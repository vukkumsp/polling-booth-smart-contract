const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { string } = require("hardhat/internal/core/params/argumentTypes");

describe("PollingBoothContract", function () {
    async function deployPollingBoothContractFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const PollingBooth = await ethers.getContractFactory("PollingBoothContract");
        const pollingBooth = await PollingBooth.deploy();

        return { pollingBooth, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should have correct name of deployed contract", async function () {
          const { pollingBooth } = await loadFixture(deployPollingBoothContractFixture);
    
          expect(await pollingBooth.name()).to.equal("Polling Booth Contract");
        });
    
        it("Should set the right owner", async function () {
          const { pollingBooth, owner } = await loadFixture(deployPollingBoothContractFixture);
    
          expect(await pollingBooth.owner()).to.equal(owner.address);
        });

        it("Should have 0 eventCount", async function () {
            const { pollingBooth } = await loadFixture(deployPollingBoothContractFixture);

            expect(await pollingBooth.eventCount()).to.equal(0);
        });
    });

    describe("Operations", function () {
        it("Should only allow vote event creation by owner", async function () {
            const { pollingBooth, owner, otherAccount } = await loadFixture(deployPollingBoothContractFixture);
      
            let alienMovies = ["Alien", "Aliens", "Alien3", "Alien:Resurrection", "Prometheus", "Covenant", "Romulus"];
            await pollingBooth.startVotingEvent("Best movie in Alien franchise", alienMovies);
            expect(await pollingBooth.eventCount()).to.equal(1);
            expect(await pollingBooth.votingEvents().length).to.equal(1);
            // expect(await pollingBooth.votingEventsSummary()).to.notEqual(null);
            // expect(await pollingBooth.votingEventsSummary()[0].topic).to.equal("Best movie in Alien franchise");
            // expect(await pollingBooth.votingEvents(0).topic).to.equal("Best movie in Alien franchise");
        });
    });


});