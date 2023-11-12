const { ethers, waffle } = require("hardhat");
const { deployContract } = waffle;
const { expect } = require("chai");

const { RelayProvider } = require('@opengsn/provider');
const { GsnTestEnvironment } = require('@opengsn/dev');

const CaptureTheFlag = require("../artifacts/contracts/CaptureTheFlag.sol/CaptureTheFlag.json");
const WhitelistPaymaster = require("../artifacts/contracts/WhitelistPaymaster.sol/WhitelistPaymaster.json");

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

describe("CaptureTheFlag", function () {
    let account;
    let captureFlagContract;
    let whitelistPaymaster;

    before(async () => {
        const { forwarderAddress, relayHubAddress } = GsnTestEnvironment.loadDeployment();

        const WhitelistPaymaster = await ethers.getContractFactory("WhitelistPaymaster");
        const [owner, addr1, addr2] = await ethers.getSigners();
        whitelistPaymaster = await WhitelistPaymaster.deploy(owner);

        // whitelistPaymaster = await deployContract(await ethers.getSigner(0), WhitelistPaymaster);
        await whitelistPaymaster.setTrustedForwarder(forwarderAddress);
        await whitelistPaymaster.setRelayHub(relayHubAddress);
        await whitelistPaymaster.sendTransaction({to: whitelistPaymaster.address, value: ethers.utils.parseEther('1')});

        const GSN = await ethers.getContractFactory("GSN");
        captureFlagContract = await GSN.deploy([forwarderAddress]);

        // captureFlagContract = await deployContract(await ethers.getSigner(0), CaptureTheFlag, [forwarderAddress]);

        const gsnProvider = await RelayProvider.newProvider({
            provider: ethers.provider,
            config: {
                loggerConfiguration: {logLevel: 'error'},
                paymasterAddress: whitelistPaymaster.address,
                methodSuffix: '',
                jsonStringifyRequest: false,
            }
        }).init();

        ethers.provider.send = gsnProvider.send.bind(gsnProvider);

        // Default ganache accounts all have eth.
        // Test from a different account, without any eth
        account = (await gsnProvider.newAccount()).address;

        await whitelistPaymaster.whitelistSender(account);
    });

    it('Runs with GSN', async () => {
        const tx = await captureFlagContract.captureTheFlag({from: account});
        const receipt = await tx.wait();
        const event = receipt.events.find(e => e.event === "FlagCaptured");

        expect(event.args.previousHolder).to.equal(ZERO_ADDRESS);
        expect(event.args.currentHolder).to.equal(account);
    });

    it('Paymaster should reject different account', async () => {
        await expect(captureFlagContract.captureTheFlag({from: accounts[2]})).to.be.revertedWith('GSN not supported');
    });
});
