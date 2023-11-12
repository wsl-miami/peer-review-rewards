const { expect } = require("chai");
const hre = require("hardhat");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const address = require('../tasks/address');
const util = require('../tasks/util');

const {RelayProvider} = require('@opengsn/provider');
// const { ethers } = require('hardhat');
const Web3 = require('web3');
const PeerReviewGSN = require('../artifacts/contracts/PeerReviewGSN.sol/PeerReviewGSN.json');

describe("Peer Review Contract", function () {
    let admin;
    let addr1;
    let addr2;
    let user;
    let web3;
    let chainId;
    // console.log('break1');
    before(async function () {
      web3 = new Web3(process.env.ETHEREUM_URL);
    //   console.log('web3', web3);
      chainId = await web3.eth.net.getId();
      // console.log('chainID: ', chainId);
  
      const peerReviewGSNAddress = address.getPeerReviewGSN(chainId);
      const paymasterAddress = address.getPayMaster(chainId);
      // console.log('PRAddr: ', peerReviewGSNAddress);
      // console.log('paymaster: ', paymasterAddress);
  
      console.log('break3');
  
    //   let signers = await ethers.getSigners();
    //   admin = signers[0];
    //   addr1 = signers[1];
    //   addr2 = signers[2];
      // window.ethereum.enable();
    //   console.log('admin', admin);
      const config = {
        paymasterAddress,
        loggerConfiguration: {
          logLevel: 'error',
        },
  
      };
  
      console.log("config", config);
    //   console.log('provider', web3.currentProvider);
  
      relayProvider = await RelayProvider.newProvider({
        // provider: web3.currentProvider,
        provider: hre.network.provider,

        config : {
            paymasterAddress: '0x7e4123407707516bD7a3aFa4E3ebCeacfcbBb107',
            loggerConfiguration: {
            logLevel: 'error',
            },
        },
      }).init();

      //const defaultProvider = new ethers.providers.JsonRpcProvider();

      // console.log('provider', provider);
      // await provider.init();
  
      web3.setProvider(relayProvider);
  
      //create a new gasless account:
      console.log('break 6');
      user = relayProvider.newAccount();
    //   console.log(user.address);
      peerReviewGSN = new web3.eth.Contract(PeerReviewGSN.abi, peerReviewGSNAddress, {
        from: user.address,
        gasPrice: 0,
      });
    });

    it('Increment count from gasless user', async function () {
        const oldCount = await peerReviewGSN.methods.counter().call();
    
        // increment count using gasless user
        await peerReviewGSN.methods.increment().send({ gas: 210000 });
    
        // check that counter has been incremented
        const newCount = await peerReviewGSN.methods.counter().call();
        expect(parseInt(newCount)).to.equal(parseInt(oldCount) + 1);

        console.log("oldCount", oldCount);
        console.log("newCount", newCount);
    
        // check lastCaller
        expect(await peerReviewGSN.methods.lastCaller().call()).to.equal(user.address);
    });

    // async function deployPeerReviewContract() {


    //     const chainId = 5;
    //     const forwarder = address.getForwarder(chainId);
    //     const PeerReview = await ethers.getContractFactory("PeerReviewGSN");
    //     const [owner, addr1, addr2] = await ethers.getSigners();
    //     const PeerReviewContract = await PeerReview.deploy(forwarder);
    //     await PeerReviewContract.deployed();
    //     console.log("Peer Review GSN contract deployed to:", PeerReviewContract.address);

    //     // const Token = await ethers.getContractFactory("contracts-old/TestToken.sol:TestToken");
    //     // const hardhatToken = await Token.deploy();
    //     // await hardhatToken.deployed();

    //     // this is needed otherwise the peer review contract can't transfer tokens from the author's wallet
    //     // hardhatToken.approve(PeerReviewContract.address, 10000);

    //     return { PeerReviewContract, owner, addr1, addr2, PeerReview }
    // }

    it("Should submit a manuscript with correct initial states", async function() {

        const [admin, addr1, addr2] = await hre.ethers.getSigners();
        console.log('ad', admin);
        console.log('addr1', addr1);
    
        // increment count using gasless user
        await expect(peerReviewGSN.methods.submitManuscript(addr1.address, ethers.utils.formatBytes32String("testString")).send({ gas: 210000 })).to.emit(PeerReviewContract, "ManuscriptSubmitted");
    
        const manuscript = await PeerReviewContract.getManuscript(0);
        // expect(manuscript.token).to.equal(hardhatToken.address);
        expect(manuscript.journal).to.equal(addr1.address);

        var byte32str = ethers.utils.formatBytes32String("testString")
        expect(manuscript.manuscript_link).to.equal(byte32str);



        // const { PeerReviewContract, owner, addr1, addr2, PeerReview } = await loadFixture(deployPeerReviewContract);

        // const submitManu = await expect(PeerReviewContract.submitManuscript(
        //     addr1.address, ethers.utils.formatBytes32String("google.com"))).to.emit(PeerReviewContract, "ManuscriptSubmitted");

        // const manuscript = await PeerReviewContract.getManuscript(0);
        // // expect(manuscript.token).to.equal(hardhatToken.address);
        // expect(manuscript.journal).to.equal(addr1.address);

        // var byte32str = ethers.utils.formatBytes32String("google.com")
        // expect(manuscript.manuscript_link).to.equal(byte32str);

    });

    // it("Should add reviewers", async function() {
    //     const { PeerReviewContract, owner, addr1, addr2, PeerReview, } = await loadFixture(deployPeerReviewContract);

    //     const submitManu = await PeerReviewContract.submitManuscript(
    //         addr1.address, ethers.utils.formatBytes32String("google.com"));
        
    //     const rewardAmount = 20;

    //     await PeerReviewContract.connect(addr1).assignReviewers(0, [addr2.address], rewardAmount);

    //     const manuscript = await PeerReviewContract.getManuscript(0);
    //     console.log('man', manuscript);
    //     expect(manuscript.rewardAmount).to.equal(rewardAmount);

    // });
});