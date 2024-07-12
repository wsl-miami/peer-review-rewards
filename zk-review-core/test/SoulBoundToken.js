const { expect } = require("chai");
const address = require('../tasks/address');

describe("Token Delay Test", function () {
    let owner;

    beforeEach(async function () {
        // Retrieve the default account from ethers
        [owner] = await ethers.getSigners();

        // A helper to get the contracts instance and deploy it locally
        const Soulbound = await ethers.getContractFactory("Soulbound");
        soulbound = await Soulbound.deploy();

        // Mint token ID 1 to owner address
        await soulbound.safeMint(owner.address, '0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6');
        console.log('minted');
        
    });

    it("check the owner is correct", async () => {
        // Check that owner address owns the token ID 0
        const value = await soulbound.ownerOf(1);
        console.log('value', value);
        expect(value).to.equal(owner.address);

        var totalTokens = await soulbound.balanceOf(owner.address);
        console.log('totalTokens', totalTokens);
    });

    it("should not allow transfer using safeTransferFrom", async () => {

        const approve = await soulbound.approve("0x000000000000000000000000000000000000dEaD", 1)

        await expect(soulbound['safeTransferFrom(address,address,uint256)'](
            owner.address,
            "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
            1 // token id
        )).to.be.reverted;

    });
    
    it("should not allow transfer using transferFrom", async () => {
        const approve = await soulbound.approve("0x000000000000000000000000000000000000dEaD", 1)

        await expect(soulbound['transferFrom(address,address,uint256)'](
            owner.address,
            "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
            1 // token id
        )).to.be.reverted;
        
    });

    it("update token image", async () => {
        const newTokenImage = "";
        await soulbound.updateTokenImage(newTokenImage);

        const image = await soulbound.getRewardImage();

        expect(image).to.equal(newTokenImage);
    })
});