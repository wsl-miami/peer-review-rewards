const hre = require("hardhat");
const address = require('./address');

async function main() {
  const chainId = hre.network.config.chainId;
  const forwarder = address.getForwarder(chainId);
  const relayHubAddress = address.getRelayHub(chainId);

  const WhitelistPaymaster = await hre.ethers.getContractFactory("contracts/WhitelistPaymaster.sol:WhitelistPaymaster");
  const whitelistPaymaster = await WhitelistPaymaster.deploy();
  await whitelistPaymaster.deployed();
  console.log("Paymaster deployed to:", whitelistPaymaster.address);

  const setTrustedForwarderTx = await whitelistPaymaster.setTrustedForwarder(forwarder);
  await setTrustedForwarderTx.wait();
//   console.log("Set trusted forwarder:", await whitelistPaymaster.getTrustedForwarder());

  const setRelayHubTx = await whitelistPaymaster.setRelayHub(relayHubAddress);
  console.log('relay hub add', relayHubAddress);
  await setRelayHubTx.wait();

  console.log("Set relay hub:", await whitelistPaymaster.getRelayHub());
  console.log("Set trusted forwarder:", await whitelistPaymaster.getTrustedForwarder());

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });