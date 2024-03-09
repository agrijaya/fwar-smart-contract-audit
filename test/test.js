require("dotenv").config();
const {deployTokenFixture} = require("./util");
const {expect} = require("chai");
require("@nomicfoundation/hardhat-chai-matchers")
// const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function () {

  describe("Deployment", function () {


    it("Should set the right owner --", async function () {
      const fixture = await deployTokenFixture();
      expect(fixture.getFwartoken().runner.address).to.equal(fixture.getOwner());
    });


  //   it("Should assign the total supply of tokens to the owner", async function () {
  //     const { fwarToken, owner } = await loadFixture(fixture);
  //     const ownerBalance = await fwarToken.balanceOf(owner.address);
  //     expect(await fwarToken.totalSupply()).to.equal(ownerBalance);
  //   });


  //   it("Should have 20% of FWAREVO tokens", async () => {
  //     const {
  //       fwarToken,
  //       fwarTokenCrowdsale,
  //       fwarTokenCrowdsaleAddress,
  //       rate,
  //       totalSupply,
  //       value,
  //     } = await loadFixture(deployTokenFixture);
  //     expect(await fwarToken.name()).to.equal("FWAREVO");
  //     expect(await fwarToken.symbol()).to.equal("FWAR");
  //     expect(await fwarToken.decimals()).to.equal(18);
  //     expect(totalSupply).to.equal(value);

  //     await fwarToken.approve(
  //       fwarTokenCrowdsaleAddress,
  //       (totalSupply * 20n) / 100n
  //     );

  //     expect(await fwarTokenCrowdsale.rateValue()).to.equal(rate);
  //     expect(await fwarTokenCrowdsale.remainingTokens()).to.equal(
  //       100000000000000000000000000n
  //     );
  //   });
  });

  // describe("Transactions", function () {
  //   it("Should transfer tokens between accounts", async function () {
  //     const { fwarToken, owner, addr1, addr2 } = await loadFixture(
  //       deployTokenFixture
  //     );
  //     await fwarToken.release();
  //     await expect(
  //       fwarToken.transfer(addr1.address, 50)
  //     ).to.changeTokenBalances(fwarToken, [owner, addr1], [-50, 50]);
  //     await expect(
  //       fwarToken.connect(addr1).transfer(addr2.address, 50)
  //     ).to.changeTokenBalances(fwarToken, [addr1, addr2], [-50, 50]);
  //   });

  //   it("Should emit Transfer events", async function () {
  //     const { fwarToken, owner, addr1, addr2 } = await loadFixture(
  //       deployTokenFixture
  //     );
  //     await fwarToken.release();
  //     await expect(fwarToken.transfer(addr1.address, 50))
  //       .to.emit(fwarToken, "Transfer")
  //       .withArgs(owner.address, addr1.address, 50);

  //     await expect(fwarToken.connect(addr1).transfer(addr2.address, 50))
  //       .to.emit(fwarToken, "Transfer")
  //       .withArgs(addr1.address, addr2.address, 50);
  //   });

  //   it("Should fail if sender doesn't have enough tokens", async function () {
  //     const { fwarToken, owner, addr1 } = await loadFixture(deployTokenFixture);
  //     await fwarToken.release();
  //     const initialOwnerBalance = await fwarToken.balanceOf(owner.address);

  //     await expect(
  //       fwarToken.connect(addr1).transfer(owner.address, 1)
  //     ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

  //     expect(await fwarToken.balanceOf(owner.address)).to.equal(
  //       initialOwnerBalance
  //     );
  //   });
  // });
});
