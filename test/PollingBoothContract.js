const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

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
});