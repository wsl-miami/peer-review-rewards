
const hre = require("hardhat");
const { parseEther } = require("ethers/lib/utils");
const address = require('./address');
const { ethers, waffle } = require("hardhat");
const path = require("path");
const fs = require("fs-extra");

const fund = async () => {
  const chainId = hre.network.config.chainId;
  const [admin] = await ethers.getSigners();

  const relayHubAddress = address.getRelayHub(chainId);
  const payMasterAddress = address.getPayMaster(chainId);

  console.log('chainid', chainId);
  console.log(relayHubAddress);

  // Trying out using ABI file
  const relayHubAbiFile = path.resolve(__dirname, "../relayHubABI.abi");
    const relayHubABI = fs.readFileSync(relayHubAbiFile, "utf8");

    const relayHub = new ethers.Contract(
      relayHubAddress,
      relayHubABI,
      (await ethers.getSigners())[0]
    );

  const tx = await relayHub.depositFor(payMasterAddress, { value: parseEther("0.1") });
  await tx.wait();

  console.log('PayMaster balance:', await relayHub.balanceOf(payMasterAddress));
  console.log('Admin wallet balance', await ethers.provider.getBalance(admin.address));
};

async function main() {
  await hre.run('compile');

  await fund();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });