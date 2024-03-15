const { Web3 } = require("web3");
const { abi, bytecode } = require('../contracts/gnosis-multisig/Multisig.json')
const {account, host} = require('./config.json') 

async function main() {
  const web3 = new Web3(host.ganache);

  const signer = web3.eth.accounts.privateKeyToAccount(account.private_key);
  web3.eth.accounts.wallet.add(signer);

  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
  contract.options.data = bytecode;
  const deployTx = contract.deploy({
    arguments: [
      [
        "0xe023fA4F589bA89082D753C2F55DD08c5A219c3A",
        "0x332689176f09f6E02Dc1CE73958fC4881bff1AEB",
        "0xCdeC6B030cd919DEa66385eb98B815317Eb5EF8D",
      ],
      2,
    ],
  });
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: await deployTx.estimateGas(),
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction ...`);
    });
  // The contract is now deployed on chain!
  console.log(
    `Add DEMO_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`,
  );
}

main();