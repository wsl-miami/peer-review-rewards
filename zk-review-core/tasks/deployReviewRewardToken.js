const hre = require("hardhat");

async function main() {
  const ReviewRewardToken = await hre.ethers.getContractFactory("ReviewRewardToken");
  const reviewRewardToken = await ReviewRewardToken.deploy(5);

  await reviewRewardToken.deployed();

  console.log("Ocean Token deployed: ", reviewRewardToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});