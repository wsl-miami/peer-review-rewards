# Review Rewards
Different outlets follow different forms of peer-review processes and prefer to reward their reviewers with different incentivization policies. Hence, ReviewRewards allows editors to configure system settings based on their specific needs and preferences. The current prototype supports a double-blind peer review process, with plans to extend to other review processes in future iterations. 

The system uses tokenization to offer different incentives. There are currently two policies supported by the system for incentivization:

## Recognition tokens: 
These tokens follow the principle of Soul Bound Tokens - non-transferrable NFTs. These tokens serve as a certificate of recognition for reviewers’ contributions. These tokens are enabled by default. Each reviewer is assigned a single token per review submitted.

## Review Reward Tokens (RRT): 
RRTs are ERC-20-based utility tokens that can be redeemed for different purposes within the system, such as subscription fee credits. These tokens are disabled by default. Editors can enable the use of these tokens in their policy settings page. They also have the flexibility to adjust distribution amounts for the reviewers who submit within the deadline and after the deadline, encouraging timely submission of reviews. Later iterations of the system will have the option for editors to add weightage to the reviews submitted so that tokens can be distributed based on the review quality.

Once the outlet updates its incentivization policy, the system will regularly (once a month) check for new reviews that have been submitted to the journal. Tokens will be distributed to the reviewers appropriately based on the journal policy. The use of blockchain ensures that the system architecture along with incentives distribution is transparent to users.

### Token Economics
1. Contract owner will have initial supply of 1000 tokens.
2. Journal can enable distribution of tokens from their UI along with the number of tokens for each review(tracked in external database).
3. Every month, a cron job will check for the reviews that have been submitted. Each review will get exactly 1 SBT minted during the cron process. If the journal has opted for utility tokens, they will also be assigned to the reviewers.

## Architecture
Main components:
### Frontend: 
Built with React.js
Handles UI components and connection with Metamask

### Backend API: 
Built with knex.js, express.js, node-cron 
Rest API to interact with database
Cron job to distribute tokens at regular intervals

### Database
- OracleDB
- SQL database
- Tables: manuscripts, reviews, reward_allocation, reward_settings
- Allows secure storage of information regarding the reviewers and the reviews submitted by them which should not be public for single/double blind reviews. 

### Blockchain
- Smart contracts build with Solidity
- Ethereum network: currently using Goerli testnet with plans to move to Sepolia testnet
- Using foundry and hardhat toolkit

### IPFS
- For file storage: using Pinata

## Users
1. **Authors** can submit their manuscripts to the journal for review
2. **Editor** verifies that the manuscript is of sufficient quality and assigns reviewers. For simplicity, the first iteration of the prototype considers the journal’s editorial role with a single editor account.
3. **Reviewers** submit reviews for their assigned manuscripts.

## User Interface
1. *Login page and Dashboard*: Users are first directed to the login page, which requires authentication using Metamask. The system assumes that the user will have the Metamask browser extension installed on their preferred browser. As an individual can have different roles based on different journals, each user can assume the role of author, editor, or reviewer.
2. *Author dashboard*: Authors can submit their manuscripts to their chosen journals from this page.
3. *Editor dashboard*: Editors can view the manuscripts submitted to their journal from this page. They can assign manuscripts to multiple reviewers and set deadlines for review submissions.
4. *Reviewer dashboard*: Reviewers can view the manuscripts assigned to them from the reviewer dashboard. They can upload reviews along with additional information.
5. *Settings page*: The settings page offers editors the flexibility to customize the incentive structure of the review process. Here, editors can enable or disable the issuance of utility tokens (RRTs) and outline the reward policy, including the allocation of different tokens based on the timeliness of review submissions. This feature allows for the incentivization of prompt reviews and the imposition of penalties for late submissions.
6. *Reputation page*: This page enables users to view the non-transferrable certificates and utility tokens they have earned, serving as a digital portfolio.

## Smart Contracts
### SoulBoundToken
- Manages SBT tokens
- Methods  
safeMint(address, journalString)   
bulkMintFromCron(address[], journalString)   
getTokensOwnedByAddress(address)  
balanceOf(address)  
tokenURI(tokenId)

### ReviewRewardToken
- Manages RRT tokens
- Methods  
bulkMint(address[], amount)  
individualMint(address, amount)  
addAdmin(address)  
revokeAdmin(address)  
balanceOf(address)  
transfer(address, amount)

For information on how to interface with application see the installation instructions [here](https://docs.google.com/document/d/1_uRGcRZdrj9LFUl2x_LC5-WXQgI2ebAofYnISW972GU), or the project documentation [here](https://docs.google.com/document/d/1gfHJRneHeNu2Sa_jfNiOxTnsREciSxlfh_BI4gcWQrA).