// Checking the latency of the blockchain API calls

describe("Soulbound Token Test", function () {
    // global vars
    let Token;
    let rrt;
    let owner;
    let admin;
    let journal;
    let reviewer1;
    let reviewer2;
    let reviewer3;  
    let reviewer4; 
    let tokenBlockReward = 5;
    let initialSupply = 0;
    let sbt;
    let amount = 3;

    let delayData = "addAdmin, revokeAdmin, bulkMintFRT, individualMintFRT, balanceOf, bulkMintSBT, individualMintSBT, getTokensOwnedByAddress, tokenURISBT\n";

    beforeEach(async function () {
        // Retrieve the default account from ethers
        [owner, admin, journal, reviewer1, reviewer2, reviewer3, reviewer4] = await ethers.getSigners();

        // A helper to get the contracts instance and deploy it locally
        const Soulbound = await ethers.getContractFactory("Soulbound");
        sbt = await Soulbound.deploy();

        Token = await ethers.getContractFactory("ReviewRewardToken");
        rrt = await Token.deploy(tokenBlockReward);

        // Mint token ID 1 to owner address
        await sbt.safeMint(owner.address, '0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6');
        console.log('minted');
        
    });

    it("get API latency time", async () => {
        const fs = require('fs');
        let reviewers = [reviewer2.address, reviewer3.address, reviewer4.address];

        for (i=0; i<50; i++){
            let beforeAddAdmin = Date.now().toString();
            await rrt.addAdmin(admin.address);
            let afterAddAdmin = Date.now().toString();
            let addAdminTime = (afterAddAdmin - beforeAddAdmin).toString();
            delayData += addAdminTime + ",";
    
            let beforeRevokeAdmin = Date.now().toString();
            await rrt.revokeAdmin(admin.address);
            let afterRevokeAdmin = Date.now().toString();
            let revokeAdminTime = (afterRevokeAdmin - beforeRevokeAdmin).toString();
            delayData += revokeAdminTime + ",";
    
    
            let beforeBulkMint = Date.now().toString();
            await rrt.bulkMint(reviewers, amount);
            let afterBulkMint = Date.now().toString();
            let bulkMintTime = (afterBulkMint - beforeBulkMint).toString();
            delayData += bulkMintTime + ",";
    
            let beforeIndividualMint = Date.now().toString();
            await rrt.individualMint(reviewer1.address, amount);
            let afterIndividualMint = Date.now().toString();
            let individualMintTime = (afterIndividualMint - beforeIndividualMint).toString();
            delayData += individualMintTime + ",";
    
            let beforeBalanceOf = Date.now().toString();
            await rrt.balanceOf(reviewer1.address);
            let afterBalanceOf = Date.now().toString();
            let balanceOfTime = (afterBalanceOf - beforeBalanceOf).toString();
            delayData += balanceOfTime + ",";
    
            let beforeBulkMintSBT = Date.now().toString();
            await sbt.bulkMintFromCron(reviewers, (journal.address).toString());
            let afterBulkMintSBT = Date.now().toString();
            let bulkMintSBTTime = (afterBulkMintSBT - beforeBulkMintSBT).toString();
            delayData += bulkMintSBTTime + ",";
    
            let beforeSafeMint = Date.now().toString();
            await sbt.safeMint(reviewer1.address, (journal.address).toString());
            let afterSafeMint = Date.now().toString();
            let safeMintTime = (afterSafeMint - beforeSafeMint).toString();
            delayData += safeMintTime + ",";
    
            let beforeGetTokensOwnedByAddress = Date.now().toString();
            await sbt.getTokensOwnedByAddress(reviewer1.address);
            let afterGetTokensOwnedByAddress = Date.now().toString();
            let getTokensOwnedByAddressTime = (afterGetTokensOwnedByAddress - beforeGetTokensOwnedByAddress).toString();
            delayData += getTokensOwnedByAddressTime + ",";
    
            let beforeTokenURISBT = Date.now().toString();
            await sbt.tokenURI(1);
            let afterTokenURISBT = Date.now().toString();
            let tokenURISBTTime = (afterTokenURISBT - beforeTokenURISBT).toString();
            delayData += tokenURISBTTime + "\n";
        }


        console.log('delayData', delayData);

    });
});