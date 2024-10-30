// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PollingBoothContract {
    string public name = "Polling Booth Contract";

    struct Voter {
        bool voted;
        uint8 vote;
    }

    struct Option {
        string name;
        uint256 voteCount;
    }

    struct VotingEvent {
        string topic;
        Option[] options;
        bool votingActive;
        bool exists;

        mapping(address => Voter) voters;
    }

    struct VotingEventSummary {
        string topic;
        Option[] options;
        bool votingActive;
        bool exists;
    }

    //This (mapping) doesn't get a getter method so we need a separate method to get these details
    mapping(uint256 => VotingEvent) public votingEvents; 
    uint256 public eventCount;

    address public owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only Owner can perform this action");
        _;
    }

    modifier validEvent(uint256 eventId){
        require(votingEvents[eventId].exists, "This Voting Event doesn't exist");
        _;
    }

    modifier onlyActiveVoting(uint256 eventId){
        require(votingEvents[eventId].votingActive, "This Voting Event is not active");
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    /********************************************/

    function isOwner() external view returns (bool) {
        return this.owner()==msg.sender;
    }

    function startVotingEvent(string memory _topicName, string[] memory _optionNames) external onlyOwner {
        VotingEvent storage newEvent = votingEvents[eventCount];
        newEvent.topic = _topicName;
        for(uint i=0;i<_optionNames.length;++i){
            newEvent.options.push(Option({
                name: _optionNames[i], voteCount: 0
            }));
        }

        newEvent.votingActive = true;
        newEvent.exists = true;

        eventCount++;
    }

    function vote(uint256 eventId, uint8 _optionId) external validEvent(eventId) onlyActiveVoting(eventId) {
        VotingEvent storage votingEvent = votingEvents[eventId];
        
        require(!votingEvent.voters[msg.sender].voted, "User already voted for this topic/event");
        require(_optionId < votingEvent.options.length, "Invalid Option selected for the Vote");

        votingEvent.voters[msg.sender].voted = true;
        votingEvent.voters[msg.sender].vote = _optionId;
        votingEvent.options[_optionId].voteCount++;
    }

    function endVoting(uint256 eventId) external onlyOwner validEvent(eventId){
        votingEvents[eventId].votingActive = false;
    }

    function getResults(uint256 eventId) external view validEvent(eventId) returns (string memory winnerName, uint256 winnerVoteCount){
        VotingEvent storage votingEvent = votingEvents[eventId];
        require(!votingEvent.votingActive, "Voting Event is still Active");

        uint256 winningVoteCount = 0;
        uint256 winnerId = 0;

        for(uint i=0;i<votingEvent.options.length;++i){
            if(votingEvent.options[i].voteCount > winningVoteCount){
                winningVoteCount = votingEvent.options[i].voteCount;
                winnerId = i;
            }
        }

        winnerName = votingEvent.options[winnerId].name;
        winnerVoteCount = votingEvent.options[winnerId].voteCount;
    }

    function getOptions(uint256 eventId) external view validEvent(eventId) returns (Option[] memory) {
        return votingEvents[eventId].options;
    }

    function votingEventsSummary() external view returns(VotingEventSummary[] memory){
        VotingEventSummary[] memory summaries = new VotingEventSummary[](eventCount);

        for(uint i=0;i<eventCount;++i){
            VotingEvent storage voteEvent = votingEvents[i];
            summaries[i].topic = voteEvent.topic;
            summaries[i].options = voteEvent.options;
            summaries[i].votingActive = voteEvent.votingActive;
            summaries[i].exists = voteEvent.exists;
        }
        return summaries;
    }
}