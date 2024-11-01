require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEYS = process.env.PRIVATE_KEYS;
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.27",
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545', // Local network URL
    },
    sepolia: {
      url: `https://arbitrum-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: PRIVATE_KEYS.split(","),
    },
  },
};
