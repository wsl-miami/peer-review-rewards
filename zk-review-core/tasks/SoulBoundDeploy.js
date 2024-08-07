// Import the Hardhat library
const hre = require("hardhat");
const address = require('./address');


// Define an async function to handle deployment
async function deploy() {
    const chainId = hre.network.config.chainId;
    const forwarder = address.getForwarder(chainId);

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Obtain the Soulbound contract
    const Soulbound = await hre.ethers.getContractFactory("Soulbound");
    
    // Deploy the Soulbound contract
    const soulbound = await Soulbound.deploy();


    // await soulbound.deployed();

    // wait for the transaction to mine
    // await soulbound.waitForDeployment()

    // Log the deployed contract's address
    console.log("Soulbound token deployed at:", soulbound.address);
}

deploy()
    .then(() => console.log("Deployment complete"))
    .catch((error) => console.error("Error deploying contract:", error));