const hre = require("hardhat");
const address = require('./address');

async function main() {
    console.log('here');
  const chainId = hre.network.config.chainId;
  console.log('here 1', chainId);
  const forwarder = address.getForwarder(chainId);
  console.log('here 2', forwarder);
  const Counter = await hre.ethers.getContractFactory("Counter");
  console.log('here 3');
  const counter = await Counter.deploy(forwarder);
console.log('here 4')
  await counter.deployed();
  console.log("Counter deployed to:", counter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });