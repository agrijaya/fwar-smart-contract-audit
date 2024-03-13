const { Web3 } = require("web3");
const { abi, bytecode } = require('../artifacts/contracts/FWAR.sol/FWAR.json')

async function main() {
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3('HTTP://127.0.0.1:7545');

  const signer = web3.eth.accounts.privateKeyToAccount('0x2d90c841de4d0ae7e36089da8611c28de9bd6c70b8bfccc6ee7a66be4c9f75de');
  web3.eth.accounts.wallet.add(signer);

  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
  contract.options.data = bytecode;
  const deployTx = contract.deploy();
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: await deployTx.estimateGas(),
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
  // The contract is now deployed on chain!
  console.log(`Contract deployed at ${deployedContract.options.address}`);
  console.log(
    `Add DEMO_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`,
  );
}

require("dotenv").config();
main();