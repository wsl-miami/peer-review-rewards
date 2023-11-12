const hre = require("hardhat");
const address = require('./address');

async function main() {
  const chainId = hre.network.config.chainId;
  const forwarder = address.getForwarder(chainId);
  const PeerReviewContract = await hre.ethers.getContractFactory("PeerReviewGSN");
  const PR = await PeerReviewContract.deploy(forwarder);
  await PR.deployed();
  console.log("Peer Review GSN contract deployed to:", PR.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });