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


## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

**Note: Please run everytime before merging to ensure latest app is pushed to deployment environment**

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

#### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)