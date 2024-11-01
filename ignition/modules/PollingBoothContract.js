// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PollingBoothContractModule", (m) => {

  const pollingBoothContract = m.contract("PollingBoothContract");

  console.log("Deployed Contract Name", pollingBoothContract.contractName)

  return { pollingBoothContract };
});