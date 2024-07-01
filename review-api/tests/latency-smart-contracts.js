const cron = require('node-cron');
const {ethers} = require('ethers');
const SoulBoundABI = require('../static/SoulBoundABI.json');
const ReviewRewardTokenABI = require('../static/ReviewRewardTokenABI.json');
const ReviewRewardTokenChangedABI = require('../static/ReviewRewardTokenChangedAdminABI.json');

require('dotenv').config();

// let connection;
let SoulBoundContract;
let ReviewRewardTokenContract;
let signer;
let provider;

async function reviewRewardTokenSetup() {
  // const reviewRewardTokenAddress = process.env.REVIEW_REWARD_TOKEN_CONTRACT;
  const reviewRewardTokenAddress = process.env.TEST_NETWORK == 'sepolia' ? process.env.REVIEW_REWARD_TOKEN_CONTRACT_SEPOLIA: process.env.REVIEW_REWARD_TOKEN_CONTRACT_GOERLI;
  ReviewRewardTokenContract = new ethers.Contract(reviewRewardTokenAddress, ReviewRewardTokenABI, signer);
    // ReviewRewardTokenContract = new ethers.Contract('0x5DB4F9e0186e100f9B492c5DDed5Df16C0DAfE5B', ReviewRewardTokenChangedABI, signer);
  console.log('Review reward token contract set up!')

}

async function soulBoundSetup() {
  try {
    // provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_URL);
    provider = new ethers.JsonRpcProvider(process.env.TEST_NETWORK == 'sepolia' ? process.env.SEPOLIA_URL : ETHEREUM_URL);
    const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY);
    signer = wallet.connect(provider);
    balance = await provider.getBalance(signer.address);
    console.log('balance', balance);
    // const soulBoundAddress = process.env.SOUL_BOUND_TOKEN_CONTRACT;
    const soulBoundAddress = process.env.TEST_NETWORK == 'sepolia' ? process.env.SOUL_BOUND_TOKEN_CONTRACT_SEPOLIA: SOUL_BOUND_TOKEN_CONTRACT_GOERLI;
    SoulBoundContract = new ethers.Contract(soulBoundAddress, SoulBoundABI, signer);

    reviewRewardTokenSetup();
  } catch (err) {
    console.log('error', err);
    console.error(err);
  } finally {
    console.log('Soul bound token contract set up!')
  }
}

let owner = '0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6';
let admin = '0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A';
let journal='0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A';
let reviewer1='0x9ae658c7300849D0A8E61d7098848750afDA88eF';
let reviewer2='0x93Ca3d98200a35ba6a7d703188C200b000B9FDb7';
let reviewer3='0x9ae658c7300849D0A8E61d7098848750afDA88eF';  
let reviewer4; 
// let delayData = "addAdmin, revokeAdmin, bulkMintFRT, individualMintFRT, balanceOf, transfer, bulkMintSBT, individualMintSBT, getTokensOwnedByAddress, tokenURISBT\n";
let delayData = "bulkMintFRT, balanceOf, transfer, getTokensOwnedByAddress, tokenURISBT\n";
let reviewers = [reviewer1, reviewer2, reviewer3];
let amount = 1;

async function tokenMethods() {
    let beforeAddAdmin = Date.now().toString();
    await ReviewRewardTokenContract.addAdmin(admin);
    let afterAddAdmin = Date.now().toString();
    let addAdminTime = (afterAddAdmin - beforeAddAdmin).toString();
    delayData += addAdminTime + ",";

    let beforeRevokeAdmin = Date.now().toString();
    await ReviewRewardTokenContract.revokeAdmin(admin);
    let afterRevokeAdmin = Date.now().toString();
    let revokeAdminTime = (afterRevokeAdmin - beforeRevokeAdmin).toString();
    delayData += revokeAdminTime + ",";

    console.log("bulkmintrrt");
    let beforeBulkMint = Date.now().toString();
    await ReviewRewardTokenContract.bulkMint(reviewers, amount);
    let afterBulkMint = Date.now().toString();
    let bulkMintTime = (afterBulkMint - beforeBulkMint).toString();
    delayData += bulkMintTime + ",";

    let beforeIndividualMint = Date.now().toString();
    await ReviewRewardTokenContract.individualMint(reviewer1, amount);
    let afterIndividualMint = Date.now().toString();
    let individualMintTime = (afterIndividualMint - beforeIndividualMint).toString();
    delayData += individualMintTime + ",";

    console.log("balanceof");
    let beforeBalanceOf = Date.now().toString();
    await ReviewRewardTokenContract.balanceOf(reviewer1);
    let afterBalanceOf = Date.now().toString();
    let balanceOfTime = (afterBalanceOf - beforeBalanceOf).toString();
    delayData += balanceOfTime + ",";

    console.log("transfer");
    let beforeTransfer = Date.now().toString();
    await ReviewRewardTokenContract.transfer(reviewer1, 1);
    let afterTransfer = Date.now().toString();
    let transferTime = (afterTransfer - beforeTransfer).toString();
    delayData += transferTime + ",";

    console.log("bulkmintsbt");
    let beforeBulkMintSBT = Date.now().toString();
    await SoulBoundContract.bulkMintFromCron(reviewers, (journal).toString());
    let afterBulkMintSBT = Date.now().toString();
    let bulkMintSBTTime = (afterBulkMintSBT - beforeBulkMintSBT).toString();
    delayData += bulkMintSBTTime + ",";

    console.log("safeMintsbt")
    let beforeSafeMint = Date.now().toString();
    await SoulBoundContract.safeMint(reviewer1, (journal).toString());
    let afterSafeMint = Date.now().toString();
    let safeMintTime = (afterSafeMint - beforeSafeMint).toString();
    delayData += safeMintTime + ",";

    console.log("getTokensOwnedByAddress")
    let beforeGetTokensOwnedByAddress = Date.now().toString();
    await SoulBoundContract.getTokensOwnedByAddress(reviewer1);
    let afterGetTokensOwnedByAddress = Date.now().toString();
    let getTokensOwnedByAddressTime = (afterGetTokensOwnedByAddress - beforeGetTokensOwnedByAddress).toString();
    delayData += getTokensOwnedByAddressTime + ",";

    console.log("beforeTokenURISBT");
    let beforeTokenURISBT = Date.now().toString();
    await SoulBoundContract.tokenURI(1);
    let afterTokenURISBT = Date.now().toString();
    let tokenURISBTTime = (afterTokenURISBT - beforeTokenURISBT).toString();
    delayData += tokenURISBTTime + "\n";

    console.log('delayData', delayData);
}

soulBoundSetup();

// Scheduling a cron job because you can't send multiple similar transactions concurrently
cron.schedule('*/1 * * * *', async() => {
  console.log('running a task every minute');
    tokenMethods();
});