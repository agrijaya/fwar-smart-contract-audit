const { ethers } = require("hardhat");

async function deploySmartContract() {
  
  const fixture = new SmartContract();
  const [owner, addr1, addr2] = await ethers.getSigners();
  const FWAR = await ethers.getContractFactory("FWAR", {

  });
  const rate = 50000;

  const fwarToken = await FWAR.deploy(owner);
  await fwarToken.waitForDeployment();


  const totalSupply = await fwarToken.totalSupply();
  const value = 500000000000000000000000000n;

  fixture.setFwartoken(fwarToken);
  fixture.setOwner(owner);
  fixture.setAddr1(addr1);
  fixture.setAddr2(addr2);
  fixture.setRate(rate);
  fixture.setTotalSupply(totalSupply);
  fixture.setValue(value);

  return fixture;
}

module.exports = { deploySmartContract, deploy };

async function deploy(){
  // compile contract first with: npx hardhat compile
  // make sure ./artifacts folder generated
  // deploy using hardhat
  await ethers.deployContract('FWAR')

  // // Store the ABI and Bytecode into a JSON file
  // const artifact = JSON.stringify({ abi, bytecode }, null, 2);
  // await fs.writeFile("Demo.json", artifact);
}

function compile(){}

class SmartContract {

  setFwartoken(token) {
    this.token = token;
  }
  setOwner(owner) {
    this.owner = owner;
  }
  setAddr1(addr1) {
    this.addr1 = addr1;
  }
  setAddr2(addr2) {
    this.addr2 = addr2;
  }
  setRate(rate) {
    this.rate = rate;
  }
  setTotalSupply(totalSupply) {
    this.totalSupply = totalSupply;
  }
  setValue(value) {
    this.value = value;
  }

  getFwartoken() {
    return this.token;
  }
  getOwner() {
    return this.owner;
  }
  getAddr1() {
    return this.addr1;
  }
  getAddr2() {
    return this.addr2;
  }
  getRate() {
    return this.rate;
  }
  getTotalSupply() {
    return this.totalSupply;
  }
  getValue() {
    return this.value;
  }
}
