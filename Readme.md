# Decentralized Educated Review Protocol

Welcome to the Decentralized Educated Review Protocol. DERP is an application built on top of the Ethereum blockchain designed to carry out the peer review process. The process itself is meant to be emulated very closely to traditional peer review methods. This means there are 3 actors in the application: Author, Editor, and Reviewer.

1. The author submits their paper with a reward of erc20 tokens, also assigning an editor.
2. The editor will then need to assign reviewers.
3. Then each reviewer submits their review (on their anonymous eth account), gaining their erc20 reward and beginning the process of 'Proof of Review'.
4. The reviewer can then switch to their publicly known eth account, and verify a proof to claim their 'proof of review' essentially providing an on-chain professional incentive to do reviews.
5. After all of the reviews have been submitted, the editor then closes the review and marks the paper as either 'passed' or 'failed' (published or not).

For information on how to interface with application see the usage tutorial [here](https://gitlab.csi.miamioh.edu/2023-capstone/Alternate_BlockChain_Project/peer-review-system/-/blob/master/docs/guide/usage.rst), or the project wiki [here](https://gitlab.csi.miamioh.edu/2023-capstone/Alternate_BlockChain_Project/peer-review-system/-/wikis/home).


## Tokenization
There are two main types of tokens implemented in this peer review system.

### Soul Bound Tokens
Soul bound tokens are immutatable non-fungible tokens that act as a reference to the contribution of a reviewer. They act as recognition tokens which can not be transferred once awarded. In this iteration of the project, each reviewer is rewarded 1 SBT for each review that they submit regardless of the journal.

### ERC 20 based utility tokens
Unlike SBTs, these tokens can be transferred between different user addresses. Journals can decide to assign zero to any number of utility tokens to the reviewer for each review submission. These utility tokens (RRT) can be exchanged in the future iterations for journal subscriptions and other utilities.

### Token Economics
1. Contract owner will have initial supply of 1000 tokens.
2. Journal can enable distribution of tokens from their UI along with the number of tokens for each review(tracked in external database).
3. Every month, a cron job will check for the reviews that have been submitted. Each review will get exactly 1 SBT. If the journal has opted for utility tokens, they will also be assigned to the reviewers.


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
