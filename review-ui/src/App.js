import "./style/NavStyle.css";
import "./style/AppStyle.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import SideNav from "./components/nav/SideNav.js";
import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import companyLogo from './static/DERPMINI.png';
import AccountButton from './components/general/AccountButton.js';
import bs58 from 'bs58';
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
    Link
} from "react-router-dom";
import Web3 from 'web3';
import PRContractABI from './static/PeerReviewGSNNew.json';
import SoulBoundABI from './static/SoulBoundABI.json';
import ReviewRewardTokenABI from './static/ReviewRewardTokenABI.json';
import CreateProfile from './components/modals/CreateProfile.js';
import ViewProfile from './components/modals/ViewProfile.js';
import WrongChain from "./components/modals/WrongChain";
import axios from "axios";
import STRING_CONSTANTS from "./constants.js";

const { RelayProvider } = require('@opengsn/provider');

const NETWORK = process.env.REACT_APP_TEST_NETWORK;
const NETWORK_URL = process.env[`REACT_APP_${NETWORK}_URL`];
const SOUL_BOUND_TOKEN_CONTRACT = process.env[`REACT_APP_SOUL_BOUND_TOKEN_CONTRACT_${NETWORK}`];
const REVIEW_REWARD_TOKEN_CONTRACT = process.env[`REACT_APP_REVIEW_REWARD_TOKEN_CONTRACT_${NETWORK}`];

class App extends Component {
    constructor(props) {
        super(props);
        // const PRContractAddress = process.env.REACT_APP_REVIEW_CONTRACT;
        // const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL));
        // var PRContract =
        //     new web3.eth.Contract(PRContractABI, PRContractAddress);
        // const profAddress = '0xAf5226585a77fEF444aF54EF9aC3b4647FeA2161';
        // var ProfContract =
        //     new web3.eth.Contract(ProfilesABI, profAddress);
        // var PRContract;
        // var ProfContract;
        // let web3;

        this.state = {
            account: null,
            chainId: null,
            authorBounties: null,
            editorBounties: null,
            reviewerBounties: null,
            PRContract: null,
            profile: null,
            ProfilesContract: null,
            showProfileDetails: false,
            showCreateProfile: false,
            web3: null
        };

            this.setAccount = this.setAccount.bind(this);
            this.setChainId = this.setChainId.bind(this);
            this.getBounties = this.getBounties.bind(this);
            this.getAccountData = this.getAccountData.bind(this);
            this.getProfile = this.getProfile.bind(this);
            this.setProfile = this.setProfile.bind(this);
            this.disconnect = this.disconnect.bind(this);
            this.setShowProfileDetails = this.setShowProfileDetails.bind(this);
            this.detectAccountUpdate = this.detectAccountUpdate.bind(this);
            this.setShowCreateProfile = this.setShowCreateProfile.bind(this);
            this.setWeb3 = this.setWeb3.bind(this);
            this.setPRContract = this.setPRContract.bind(this);
            this.setSoulBoundContract = this.setSoulBoundContract.bind(this);
            this.setReviewRewardTokenContract = this.setReviewRewardTokenContract.bind(this);
    }

    componentDidMount() {
        this.detectAccountUpdate();
        this.setWeb3();
    }

    setShowProfileDetails() {
        this.setState({ showProfileDetails: !this.state.showProfileDetails });
    }

    setShowCreateProfile() {
        console.log(this.state.showCreateProfile);
        this.setState({ showCreateProfile: !this.state.showCreateProfile })
    }

    async setWeb3() {
        const config = { 
            paymasterAddress: '0x7e4123407707516bD7a3aFa4E3ebCeacfcbBb107',
            loggerConfiguration: {
                logLevel: 'debug'
            },
            minViewableGasLimit: 0
        }

        // @TODO: Implementation of provider for opengsn network
        // const provider = await RelayProvider.newProvider({ provider: window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL), config }).init();
        // const provider = await RelayProvider.newProvider({ provider: window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_SEPOLIA_URL), config }).init();

        try {

            const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(NETWORK_URL));
            // @TODO: Implementation of provider for opengsn network
            // const web3 = new Web3(provider);
            this.setState({ web3: web3 }, () => {
                this.setSoulBoundContract();
                this.setReviewRewardTokenContract();
                this.setAccount();
            });
        } catch (err) {
            console.log('web3 error', err);
        }

        
    }

    async setPRContract() {
        const web3 = this.state.web3;
        const PRContractAddress = process.env.REACT_APP_REVIEW_GSN_CONTRACT;
        var PRContract =
            new web3.eth.Contract(PRContractABI, PRContractAddress, {gasPrice: null});
        this.setState({PRContract});
    }

    async setSoulBoundContract() {
        // Keeping SoulBoundContract without OpenGSN
        // const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL));
        const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(NETWORK_URL));
        // const soulBoundAddress = process.env.REACT_APP_SOUL_BOUND_TOKEN_CONTRACT;
        const soulBoundAddress = SOUL_BOUND_TOKEN_CONTRACT;
        var SoulBoundContract = new web3.eth.Contract(SoulBoundABI, soulBoundAddress);
        this.setState({SoulBoundContract: SoulBoundContract});
    }

    async setReviewRewardTokenContract() {
        // const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL));
        const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(NETWORK_URL));
        // const reviewRewardTokenAddress = process.env.REACT_APP_REVIEW_REWARD_TOKEN_CONTRACT;
        const reviewRewardTokenAddress = REVIEW_REWARD_TOKEN_CONTRACT;
        var ReviewRewardTokenContract = new web3.eth.Contract(ReviewRewardTokenABI, reviewRewardTokenAddress);
        this.setState({ReviewRewardTokenContract: ReviewRewardTokenContract});
    }

    async setAccount() {
        const addr = (await this.state.web3.eth.getAccounts())[0];
        this.setState(
            { account: addr ? addr : null },
            () => addr ? this.getAccountData() : '');
    }

    detectAccountUpdate() {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async function (accounts) {
                window.location.reload();
            })
            window.ethereum.on('chainChanged', async function () {
                window.location.reload();
            })
        }
    }

    disconnect() {
        this.setState({
            account: null,
            reviewerBounties: null,
            authorBounties: null,
            editorBounties: null
        });
    }

    async getAccountData() {
        var cid = await this.state.web3.eth.getChainId();
        this.setState({ chainId: cid })
        this.getProfile();
        this.getBounties();
    }

    async getProfile() {
        try{
            const prof = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-profile`,
                method: "GET",
                params: {account_hash: this.state.account},
            });
    
            if (prof.data && prof.data.profile && prof.data.profile.USER_HASH == this.state.account) {
                this.setState({ profile: prof.data.profile });
            }
        } catch (err) {
            console.log('profile get error: ', err);
        }
    }

    setProfile(prof) {
        this.setState({ profile: prof });
    }

    async getBounties() {
        const authorBount = await axios({
            url: `${process.env.REACT_APP_API_URL}/api/get-manuscripts-by-author`,
            method: "GET",
            headers: {
                authorization: "your token comes here",
            },
            params: {author_hash: this.state.account},
        });

        const authorManuscripts = authorBount.data.manuscripts;
        let authorBounties = [];
        let authorManuscriptId = 0;

        authorManuscripts.forEach(async(manuscript, index) => {
            const manuscript_hash = manuscript.ARTICLE_HASH.trim();
            const str = Buffer.from(bs58.decode(manuscript_hash)).toString('hex')

            const reviewers_count = manuscript.REVIEWERS_COUNT;

            const review_links = manuscript.REVIEW_HASH != null ? manuscript.REVIEW_HASH : [];
            authorBounties.push({
                accepted: false,
                author: manuscript.AUTHOR_HASH.trim(),
                journal: manuscript.JOURNAL_HASH.trim(),
                manuscriptId: authorManuscriptId,
                manuscript_link: manuscript_hash,
                open: true,
                review_links: review_links,
                reviewers: [],
                reviewers_count: reviewers_count,
                submission_date: manuscript.TIME_STAMP,
                review_deadline: manuscript.DEADLINE,
                journal_name: manuscript.JOURNAL_NAME,
                decision_status: manuscript.DECISION_STATUS,
                editor_note: manuscript.EDITOR_NOTE
            });

            authorManuscriptId = authorManuscriptId+1;
        });

        this.setState({ authorBounties: authorBounties });

        const editorBount = await axios({
            url: `${process.env.REACT_APP_API_URL}/api/get-manuscripts-by-journal`,
            method: "GET",
            params: {journal_hash: this.state.account},
        });

        const editorManuscripts = editorBount.data.manuscripts;
        let editorBounties = [];
        let manuscriptId = 0;
        editorManuscripts.forEach(async(manuscript, index) => {
            const manuscript_hash = manuscript.ARTICLE_HASH.trim();
            const str = Buffer.from(bs58.decode(manuscript_hash)).toString('hex')

            const review_links = manuscript.REVIEW_HASH != null ? manuscript.REVIEW_HASH : [];
            const reviewers_count = manuscript.REVIEWERS_COUNT;
                editorBounties.push({
                accepted: false,
                author: manuscript.AUTHOR_HASH.trim(),
                journal: manuscript.JOURNAL_HASH.trim(),
                manuscriptId: manuscriptId,
                manuscript_link: manuscript_hash,
                open: true,
                review_links: review_links,
                reviewers: [],
                reviewers_count: reviewers_count,
                blockManuscriptId: null,
                submission_date: manuscript.TIME_STAMP,
                review_deadline: manuscript.DEADLINE,
                journal_name: manuscript.JOURNAL_NAME,
                decision_status: manuscript.DECISION_STATUS,
                editor_note: manuscript.EDITOR_NOTE
            });

            manuscriptId = manuscriptId + 1;
        });
        this.setState({ editorBounties: editorBounties });

        const reviewerBount = await axios({
            url: `${process.env.REACT_APP_API_URL}/api/get-manuscripts-by-reviewer`,
            method: "GET",
            params: {reviewer_hash: this.state.account},
        });

        const reviewerManuscripts = reviewerBount.data.manuscript_details;
        let reviewerBounties = [];
        let reviewerManuscriptId = 0;
        reviewerManuscripts.forEach(async(manuscript, index) => {
            const manuscript_hash = manuscript.ARTICLE_HASH.trim();
            const str = Buffer.from(bs58.decode(manuscript_hash)).toString('hex')
            
            const review_links = manuscript.REVIEW_HASH != null ? [manuscript.REVIEW_HASH] : [];

            reviewerBounties.push({
                accepted: false,
                author: null,
                journal: manuscript.JOURNAL_HASH.trim(),
                manuscriptId: reviewerManuscriptId,
                manuscript_link: manuscript_hash,
                open: true,
                review_links: review_links,
                reviewers: [],
                reviewers_count: 0,
                submission_date: manuscript.TIME_STAMP,
                review_deadline: manuscript.DEADLINE,
                journal_name: manuscript.JOURNAL_NAME,
                decision_status: manuscript.DECISION_STATUS,
                editor_note: manuscript.EDITOR_NOTE
            });

            reviewerManuscriptId = reviewerManuscriptId + 1;
        });
        this.setState({ reviewerBounties: reviewerBounties });
    }

    setChainId(chainId) {
        this.setState({ chainId: chainId });
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                            <Navbar className="navbar" variant="dark" expand="lg">
                                <Navbar.Brand as={NavLink} to="/">
                                    {' '}
                                    <img
                                        alt=""
                                        src={companyLogo}
                                        width="32"
                                        height="40"
                                    //className="d-inline-block align-top"
                                    />{' '}
                                    {STRING_CONSTANTS.PROJECT_NAME}
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="navtext me-auto">
                        
                                    </Nav>
                                    <AccountButton
                                        account={this.state.account}
                                        setAccount={this.setAccount}
                                        profile={this.state.profile}
                                        disconnect={this.disconnect}
                                        showProfileDetails={this.state.showProfileDetails}
                                        setShowProfileDetails={this.setShowProfileDetails}
                                        showCreateProfile={this.showCreateProfile}
                                        setShowCreateProfile={this.setShowCreateProfile}
                                    />
                                </Navbar.Collapse>
                            </Navbar>
                    <SideNav 
                        account={this.state.account}
                        web3={this.state.web3}
                        chainId={this.state.chainId}
                        authorBounties={this.state.authorBounties}
                        editorBounties={this.state.editorBounties}
                        reviewerBounties={this.state.reviewerBounties}
                        PRContract={this.state.PRContract}
                        SoulBoundContract={this.state.SoulBoundContract}
                        profile={this.state.profile}
                        ReviewRewardTokenContract={this.state.ReviewRewardTokenContract}
                    />
                    <Container fluid>
                        <CreateProfile
                            disconnect={this.disconnect}
                            account={this.state.account}
                            ProfilesContract={this.state.ProfilesContract}
                            setProfile={this.setProfile}
                            profile={this.state.profile}
                            web3={this.state.web3}
                            chainId={this.state.chainId}
                            showCreateProfile={this.state.showCreateProfile}
                            setShowCreateProfile={this.setShowCreateProfile}
                        />
                        <ViewProfile
                            profile={this.state.profile}
                            ProfilesContract={this.state.ProfilesContract}
                            setProfile={this.setProfile}
                            showProfileDetails={this.state.showProfileDetails}
                            setShowProfileDetails={this.setShowProfileDetails}
                        />
                        <WrongChain
                            account={this.state.account}
                            disconnect={this.disconnect}
                            chainId={this.state.chainId}
                        />
                    </Container>
                </BrowserRouter>
            </div>
        )
    }
}
export default App;