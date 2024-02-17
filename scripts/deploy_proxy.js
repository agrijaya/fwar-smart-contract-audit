const { ethers, upgrades } = require("hardhat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // We get the contract to deploy
  const defaultAdmin_address=`${process.env.defaultAdmin_address}`
  const pauser_address=`${process.env.pauser_address}`
  const minter_address=`${process.env.minter_address}`
  const burner_address=`${process.env.burner_address}`
  const FWARcontract = await ethers.getContractFactory("FWAR");
  const fwarToken = await upgrades.deployProxy(FWARcontract, [defaultAdmin_address, pauser_address, minter_address, burner_address, true], {
    initializer: "initialize",
  });

  // await fwarToken.deployed();
  await fwarToken.waitForDeployment();
  const fwarTokenAddress = await fwarToken.getAddress();
  console.log("Token deployed to:", fwarTokenAddress);
  console.log(`FWAR deployed to: ${process.env.etherscan_url}${fwarTokenAddress}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
