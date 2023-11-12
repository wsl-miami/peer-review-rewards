async function main() {
    const PRContract = await ethers.getContractFactory("PeerReviewContract");

    // const { semaphore } = await run("deploy:semaphore");
    const semaphoreAddress = "0xf8d4B594B74b557650515Dd4f4a00D4061074d43";
 
    // Start deployment, returning a promise that resolves to a contract object
    const forwarder = "0xE8172A9bf53001d2796825AeC32B68e21FDBb869";
    const PRContractDeploy = await PRContract.deploy("Deploying PR contract");

    console.log("Contract deployed to address:", PRContractDeploy.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });
