async function main() {
    const TestContract = await ethers.getContractFactory("TestContract");
 
    // Start deployment, returning a promise that resolves to a contract object
    const test_contract = await TestContract.deploy("Test Contract deployed!");
    console.log("Contract deployed to address:", test_contract.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });