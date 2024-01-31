const { expect } = require("chai");
const hre = require("hardhat");

describe("ReviewRewardToken contract", function() {
  // global vars
  let Token;
  let reviewRewardToken;
  let owner;
  let addr1;
  let addr2;
  let tokenBlockReward = 50;
  let initialSupply = 0;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("ReviewRewardToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    reviewRewardToken = await Token.deploy(tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await reviewRewardToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await reviewRewardToken.balanceOf(owner.address);
      initialSupply = ownerBalance;
      expect(await reviewRewardToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await reviewRewardToken.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await reviewRewardToken.transfer(addr1.address, 50);
      const addr1Balance = await reviewRewardToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await reviewRewardToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await reviewRewardToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await reviewRewardToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        reviewRewardToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await reviewRewardToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await reviewRewardToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await reviewRewardToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await reviewRewardToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await reviewRewardToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await reviewRewardToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await reviewRewardToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
    
    it("Owner should be able to mint tokens in bulk", async function () {
      // Owner mints 50 tokens for addr1 and addr2
      let addresses = [addr1.address, addr2.address]
      await reviewRewardToken.bulkMint(addresses, 50);
      const addr1Balance = await reviewRewardToken.balanceOf(addr1.address);
      expect(Number(hre.ethers.utils.formatEther(addr1Balance))).to.equal(50);

      const addr2Balance = await reviewRewardToken.balanceOf(addr2.address);
      expect(Number(hre.ethers.utils.formatEther(addr2Balance))).to.equal(50);

      // Total supply should equal to all the tokens minted till now
      const currentSupply = Number(hre.ethers.utils.formatEther(initialSupply)) + 100;
      const totalSupply = await reviewRewardToken.totalSupply();
      expect(Number(hre.ethers.utils.formatEther(totalSupply))).to.equal(currentSupply);

    });

    it("Non owner should not be able to mint tokens", async function () {
      let addresses = [addr2.address]
      await expect(reviewRewardToken.connect(addr1).bulkMint(addresses, 50)).to.be.revertedWith("Only the owner can call this function");
    });

  });
  
});