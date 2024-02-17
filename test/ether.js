require('dotenv').config()
// const { expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers")
// const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { ethers, JsonRpcProvider } = require('ethers');
// const Token = require("../artifacts/contracts/Token.sol/Token.json")
// const provider = new JsonRpcProvider("http://127.0.0.1:8545/");
// const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
// const signer = new ethers.Wallet(process.env.private_key, provider);
// const contract = new ethers.Contract(address, Token.abi, provider)
// const contractWithSigner = contract.connect(signer);
// const main = async () => {
//   const data = await contract.name()
//   console.log(data);
//   await contractWithSigner.removeFromLockWhitelist("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
//   await contractWithSigner.lock()
//   console.log(await contract.lockWhiteList("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"));
// }
// main();


// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function latestTime() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}

const duration = {
  seconds(val) {
    return val;
  },
  minutes(val) {
    return val * this.seconds(60);
  },
  hours(val) {
    return val * this.minutes(60);
  },
  days(val) {
    return val * this.hours(24);
  },
  weeks(val) {
    return val * this.days(7);
  },
  years(val) {
    return val * this.days(365);
  },
};


// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the Signers here.

    const FWAREVO = await ethers.getContractFactory("FWAREVO");
    const [owner, addr1, addr2] = await ethers.getSigners();
    // const signer = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    // const fwarToken = await ethers.deployContract("Token", owner.address);

    const fwarToken = await FWAREVO.deploy(owner);
    // const fwarToken = (await FWAREVO.connect(owner).deploy());
    await fwarToken.waitForDeployment();

    const latestBlockTime = await latestTime();
    const openingTime = latestBlockTime + duration.minutes(1);
    const closeTime = openingTime + duration.weeks(1); // 1 week

    const FWAREVOCrowdsale = await ethers.getContractFactory("PRESALE");
    const rate = 50000; // 500 wei per token
    const minRate = "100000000000000000"; // min 0.1ETH
    const maxRate = "1000000000000000000"; // max 1ETH
    const fwarTokenAddress = await fwarToken.getAddress();
    // console.log('rate', rate);
    // console.log('owner', owner);
    // console.log('fwarTokenAddress', fwarTokenAddress);
    // console.log('owner', owner);
    // console.log('openingTime', openingTime);
    // console.log('closeTime', closeTime);
    // console.log('minRate', minRate);
    // console.log('maxRate', maxRate);
    const fwarTokenCrowdsale = await FWAREVOCrowdsale.deploy(
      rate,
      owner,
      fwarTokenAddress,
      owner,
      openingTime,
      closeTime,
      minRate,
      maxRate
    );
    // console.log('5');
    // await fwarTokenCrowdsale.deployed();
    await fwarTokenCrowdsale.waitForDeployment();
    const fwarTokenCrowdsaleAddress = await fwarTokenCrowdsale.getAddress();
    const totalSupply = await fwarToken.totalSupply();
    const value = 500000000000000000000000000n;
    // expect(totalSupply).to.equal(ethers.formatEther(value));
    // expect(totalSupply).to.equal(ethers.formatEther(1000000));
    // Fixtures can return anything you consider useful for your tests
    return { fwarToken, fwarTokenCrowdsale, fwarTokenCrowdsaleAddress, owner, addr1, addr2, rate, totalSupply, value };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner --", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { fwarToken, owner } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.
      // console.log("owner", owner);
      // console.log("fwarToken", fwarToken);
      // console.log("fwarToken.owner", fwarToken.owner());

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await fwarToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { fwarToken, owner } = await loadFixture(deployTokenFixture);
      // console.log("owner", owner);
      // console.log("fwarToken", fwarToken);
      const ownerBalance = await fwarToken.balanceOf(owner.address);
      expect(await fwarToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have 20% of FWAREVO tokens", async () => {
      const { fwarToken, fwarTokenCrowdsale, fwarTokenCrowdsaleAddress, rate, totalSupply, value } = await loadFixture(
        deployTokenFixture
      );
      expect(await fwarToken.name()).to.equal("FWAREVO");
      expect(await fwarToken.symbol()).to.equal("FWAR");
      expect(await fwarToken.decimals()).to.equal(18);

      expect(totalSupply).to.equal(value);
      // const owner = await fwarToken.owner();

      await fwarToken.approve(
        fwarTokenCrowdsaleAddress,
        // totalSupply.mul(ethers.BigNumber.from(70)).div(ethers.BigNumber.from(100))
        totalSupply * 20n/100n
      );
  
      // console.log('rate() ', fwarTokenCrowdsale.rateValue());
  
      expect(await fwarTokenCrowdsale.rateValue()).to.equal(rate);
      expect(await fwarTokenCrowdsale.remainingTokens()).to.equal(100000000000000000000000000n);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { fwarToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      await fwarToken.release();
      // Transfer 50 tokens from owner to addr1
      // console.log('Should transfer tokens between accounts event');
      await expect(
        fwarToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(fwarToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        fwarToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(fwarToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { fwarToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      await fwarToken.release();
      // console.log('Should emit Transfer event');
      // Transfer 50 tokens from owner to addr1
      await expect(fwarToken.transfer(addr1.address, 50))
        .to.emit(fwarToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(fwarToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(fwarToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { fwarToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      await fwarToken.release();
      const initialOwnerBalance = await fwarToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        fwarToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await fwarToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});