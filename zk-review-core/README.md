# Main Contracts and files to look for
## Contrats:
AcceptEverythingPaymaster : Naive paymaster that accepts requests from everyone
WhitelistPaymaster : Paymaster that allows payment for whitelisted groups only
PeerReviewGSN : Implementation of Peer Review contract with Gas Station Network
SoulBoundToken : Implementation of soul bound tokens without GSN
SoulBoundTokenGSN : Implementation of soul bound tokens with GSN
TestSoulBoundToken : Generate test soul bound tokens for testing

## Scripts/Tasks
address.js : File containing addresses of GSN based contracts
deployWhitelistPaymaster : Deployment script for WhitelistPaymaster contract
deployPeerReviewGSN : Deployment script for PeerReviewGSN contract
fund : Script to fund the paymaster to perform GSN transactions
deployTokenSoulBound : Deployment script for TestSoulBoundToken contract
SoulBoundDeploy : Deployment script for SoulBound contract without GSN
SoulBoundGSNDeploy : Deployment script for SoulBound contract with GSN


## Tests
PeerReviewGSNTest : Test file for PeerReviewGSN contract
SoulBoundToken : Test file for SoulBoundToken contract

# Semaphore Hardhat template

This project demonstrates a basic Semaphore use case. It comes with a sample contract, a test for that contract and a sample task that deploys that contract.

## Usage

### Compile

```bash
yarn compile
```

### Testing

```bash
yarn test
```

You can also generate a test coverage report:

```bash
yarn test:coverage
```

Or a test gas report:

```bash
yarn test:report-gas
```

### Deploy

1. Copy the `.env.example` file as `.env`.

```bash
cp .env.example .env
```

2. Add your environment variables.

> **Note**  
> You should at least set a valid Ethereum URL (e.g. Infura) and a private key with some ethers.

3. And deploy your contract.

```bash
yarn deploy --semaphore <semaphore-address> --group <group-id> --network goerli
```

> **Note**  
> Check the Semaphore contract addresses [here](https://semaphore.appliedzkp.org/docs/deployed-contracts#semaphore).

> **Warning**  
> The group id is a number!
