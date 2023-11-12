const { expect } = require("chai");
const hre = require("hardhat");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const { Identity } = require("@semaphore-protocol/identity");
const { Group } = require("@semaphore-protocol/group");

describe("Peer Review Contract", function () {
    async function deployPeerReviewContract() {
        const PeerReview = await ethers.getContractFactory("PeerReviewContract");
        const [owner, addr1, addr2] = await ethers.getSigners();
        const PeerReviewContract = await PeerReview.deploy("Deploying contract");
        await PeerReviewContract.deployed();

        const Token = await ethers.getContractFactory("TestToken");
        const hardhatToken = await Token.deploy();
        await hardhatToken.deployed();

        // this is needed otherwise the peer review contract can't transfer tokens from the author's wallet
        hardhatToken.approve(PeerReviewContract.address, 10000);

        return { PeerReviewContract, owner, addr1, addr2, PeerReview, Token, hardhatToken }
    }

    it("Should submit a manuscript with correct initial states", async function() {
        const { PeerReviewContract, owner, addr1, addr2, PeerReview, Token, hardhatToken } = await loadFixture(deployPeerReviewContract);

        const submitManu = await expect(PeerReviewContract.submitManuscript(hardhatToken.address,
            addr1.address, ethers.utils.formatBytes32String("google.com"))).to.emit(PeerReviewContract, "ManuscriptSubmitted");

        const manuscript = await PeerReviewContract.getManuscript(0);
        expect(manuscript.token).to.equal(hardhatToken.address);
        expect(manuscript.journal).to.equal(addr1.address);

        var byte32str = ethers.utils.formatBytes32String("google.com")
        expect(manuscript.manuscript_link).to.equal(byte32str);

    });

    it("Should add reviewers", async function() {
        const { PeerReviewContract, owner, addr1, addr2, PeerReview, Token, hardhatToken } = await loadFixture(deployPeerReviewContract);

        const submitManu = await PeerReviewContract.submitManuscript(hardhatToken.address,
            addr1.address, ethers.utils.formatBytes32String("google.com"));

        var identity = new Identity();
        await PeerReviewContract.connect(addr1).assignReviewers(0, [addr2.address], 35);

        const manuscript = await PeerReviewContract.getManuscript(0);
        expect(manuscript.rewardAmount).to.equal(35);

    });
});