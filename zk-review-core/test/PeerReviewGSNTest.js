const { expect } = require("chai");
const hre = require("hardhat");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const address = require('../tasks/address');
const util = require('../tasks/util');

const {RelayProvider} = require('@opengsn/provider');
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
      const config = {
        paymasterAddress,
        loggerConfiguration: {
          logLevel: 'error',
        },
  
      };
  
      console.log("config", config);
  
      relayProvider = await RelayProvider.newProvider({
        provider: hre.network.provider,

        config : {
            paymasterAddress: '0x7e4123407707516bD7a3aFa4E3ebCeacfcbBb107',
            loggerConfiguration: {
            logLevel: 'error',
            },
        },
      }).init();

      web3.setProvider(relayProvider);
  
      //create a new gasless account:
      console.log('break 6');
      user = relayProvider.newAccount();
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
    });
});