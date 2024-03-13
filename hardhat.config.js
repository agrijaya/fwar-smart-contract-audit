require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-verify")
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-ganache");
require('dotenv').config()

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // ropsten: {
    //   url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ropsten_key}`,
    //   accounts: [`${process.env.private_key}`]
    // },
    // hardhat: {
    //  chainId: 1337,
    //  allowUnlimitedContractSize: true
    // },
    ganache: {
        chainId: 1337,
        allowUnlimitedContractSize: true,
        url: 'http://localhost:7545',
        accounts:[{
          mnemonic:'twelve valid monitor behind stomach scene feel fetch path alter onion often'

        }]
        // accounts:[`0xd9b800e155ff777b5fe671479b1af7dcad5409e9428202729c613ae60e2229fe`]
        // accounts: [
        //   '0xd92354caa23f3c87f7345a6d700450229dc9629fbf4f328dfa6a9e0ec20218be', 
        //   '0xf0059a4989e253fbfe987a3120481a42919d8e4b53406fcc8522d2adbfa243ad'
        // ],
    },
    // mumbai: {
    //   url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.alchemy_mumbai_key}`,
    //   accounts: [`${process.env.private_key}`]
    // },
    // mainnet: {
    //   url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.mainnet_key}`, // or any other JSON-RPC provider
    //   accounts: [`${process.env.private_key}`],
    //   gasPrice: 50000000000,
    //   saveDeployments: true,
    // }
  },
  // etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // apiKey: `${process.env.etherscan_key}`
  // }
};
