import "./style/NavStyle.css";
import "./style/AppStyle.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Editor from './components/pages/Editor';
import Review from './components/pages/Review';
import Author from './components/pages/Author';
import companyLogo from './static/DERPMINI.png';
import editorButton from './static/editorButton.png';
import reviewerButton from './static/ReviewerButton.png';
import authorButton from './static/authorButton.png';
import reputationButton from './static/reputationButtonV2.png';
import AccountButton from './components/general/AccountButton.js';
import bs58 from 'bs58';
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
    Link
} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Home from './components/pages/Home.js'
import Web3 from 'web3';
// import PRContractABI from './static/PeerReviewGSN.json';
import PRContractABI from './static/PeerReviewGSNNew.json';
import SoulBoundABI from './static/SoulBoundABI.json';
import ReviewRewardTokenABI from './static/ReviewRewardTokenABI.json';

import ProfilesABI from './static/ProfilesABI.json';
import CreateProfile from './components/modals/CreateProfile.js';
import ViewProfile from './components/modals/ViewProfile.js';
import WrongChain from "./components/modals/WrongChain";
import Reputation from "./components/pages/Reputation";
import Settings from "./components/pages/Settings";
import axios from "axios";

const { RelayProvider } = require('@opengsn/provider');
// const oracledb = require('oracledb');

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
        var PRContract;
        var ProfContract;
        let web3;

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
            this.disconnect = this.disconnect.bind(this);
            this.setShowProfileDetails = this.setShowProfileDetails.bind(this);
            this.detectAccountUpdate = this.detectAccountUpdate.bind(this);
            this.setShowCreateProfile = this.setShowCreateProfile.bind(this);
            this.setWeb3 = this.setWeb3.bind(this);
            this.setPRContract = this.setPRContract.bind(this);
            this.setProfilesContract = this.setProfilesContract.bind(this);
            this.setSoulBoundContract = this.setSoulBoundContract.bind(this);
            this.setReviewRewardTokenContract = this.setReviewRewardTokenContract.bind(this);

        // (async()=>{
        //     const config = { 
        //         paymasterAddress: '0x7e4123407707516bD7a3aFa4E3ebCeacfcbBb107',
        //         loggerConfiguration: {
        //             logLevel: 'debug'
        //         }
        //     }
        //     const provider = await RelayProvider.newProvider({ provider: window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL), config }).init();
        //     web3 = new Web3(provider);

        //     const PRContractAddress = process.env.REACT_APP_REVIEW_CONTRACT;
        //     // web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL));
        //     PRContract = new web3.eth.Contract(PRContractABI, PRContractAddress);
        //     const profAddress = '0xAf5226585a77fEF444aF54EF9aC3b4647FeA2161';
        //     ProfContract = new web3.eth.Contract(ProfilesABI, profAddress);

        //     // this.state = {
        //     //     account: null,
        //     //     chainId: null,
        //     //     authorBounties: null,
        //     //     editorBounties: null,
        //     //     reviewerBounties: null,
        //     //     PRContract: PRContract,
        //     //     profile: null,
        //     //     ProfilesContract: ProfContract,
        //     //     showProfileDetails: false,
        //     //     showCreateProfile: false,
        //     //     web3: web3
        //     // }
    
        //     this.setAccount = this.setAccount.bind(this);
        //     this.setChainId = this.setChainId.bind(this);
        //     this.getBounties = this.getBounties.bind(this);
        //     this.getAccountData = this.getAccountData.bind(this);
        //     this.getProfile = this.getProfile.bind(this);
        //     this.disconnect = this.disconnect.bind(this);
        //     this.setShowProfileDetails = this.setShowProfileDetails.bind(this);
        //     this.detectAccountUpdate = this.detectAccountUpdate.bind(this);
        //     this.setShowCreateProfile = this.setShowCreateProfile.bind(this);
        //     this.setWeb3 = this.setWeb3.bind(this);
        //     this.setPRContract = this.setPRContract.bind(this);
        //     this.setProfilesContract = this.setProfilesContract.bind(this);
        // })();

    }

    componentDidMount() {
        console.log("here I am");

        this.detectAccountUpdate();
        // this.setAccount();
        this.setWeb3();

        // const response = await fetch('/api/hello');

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
            // preferredRelays: ["0x7DDa9Bf2C0602a96c06FA5996F715C7Acfb8E7b0"],
            // managerStakeTokenAddress: "0xE8172A9bf53001d2796825AeC32B68e21FDBb869",
            loggerConfiguration: {
                logLevel: 'debug'
            },
            minViewableGasLimit: 0
        }
        // console.log('setweb3', config);

        // console.log("testing provider", new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL));
        const provider = await RelayProvider.newProvider({ provider: window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL), config }).init();
        console.log('setweb3', provider);

        try {

            // const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL))
            const web3 = new Web3(provider);
            console.log('web', web3);
            this.setState({ web3: web3 }, () => {
                console.log('state', this.state.web3);
                this.setPRContract();
                this.setProfilesContract();
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

    async setProfilesContract() {
        const web3 = this.state.web3;
        const profAddress = '0xAf5226585a77fEF444aF54EF9aC3b4647FeA2161';
        var ProfContract =
            new web3.eth.Contract(ProfilesABI, profAddress);
        this.setState({ProfilesContract: ProfContract});
    }

    async setSoulBoundContract() {
        // Keeping SoulBoundContract without OpenGSN
        const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL));
        const soulBoundAddress = process.env.REACT_APP_SOUL_BOUND_TOKEN_CONTRACT;
        var SoulBoundContract = new web3.eth.Contract(SoulBoundABI, soulBoundAddress);
        this.setState({SoulBoundContract: SoulBoundContract});
    }

    async setReviewRewardTokenContract() {
        const web3 = new Web3(window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL));
        const reviewRewardTokenAddress = process.env.REACT_APP_REVIEW_REWARD_TOKEN_CONTRACT;
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
        const prof = await this.state.ProfilesContract.methods.getProfileByAddress(
            this.state.account
        ).call();
        if (prof.addr == this.state.account) {
            this.setState({ profile: prof });
        }
    }

    setProfile(prof) {
        this.setState({ profile: prof });
    }

    async getBounties() {
        // const authorBounties =
        //     await this.state.PRContract.methods.getManuscriptsByAuthor(
        //         this.state.account
        //     ).call();

        const authorBount = await axios({
            // Endpoint to send files
            url: `${process.env.REACT_APP_API_URL}/api/get-manuscripts-by-author`,
            method: "GET",
            headers: {
                // Add any auth token here
                authorization: "your token comes here",
            },

            // Attaching the form data
            params: {author_hash: this.state.account},
        });

        const authorManuscripts = authorBount.data.manuscripts;
        let authorBounties = [];
        let authorManuscriptId = 0;

        authorManuscripts.forEach(async(manuscript, index) => {
            const manuscript_hash = manuscript.ARTICLE_HASH.trim();
            console.log("manuscript hash", `test${manuscript_hash}test`);
            const str = Buffer.from(bs58.decode(manuscript_hash)).toString('hex')

            const authorBounty =
            await this.state.PRContract.methods.getManuscriptsByArticleHash(
                '0x'+str.substring(4, str.length)
            ).call();

            console.log('authorBounty from contract', authorBounty);
            const reviewers_count = manuscript.REVIEWERS_COUNT;


            const review_links = manuscript.REVIEW_HASH != null ? manuscript.REVIEW_HASH : [];
            if (authorBounty && authorBounty.length != 0) {
                // console.log('shouldnot be here', authorBounty[0].article);
                authorBounties.push({
                    accepted: authorBounty[0].accepted,
                    author: manuscript.AUTHOR_HASH.trim(),
                    journal: manuscript.JOURNAL_HASH.trim(),
                    manuscriptId: authorManuscriptId,
                    manuscript_link: manuscript_hash,
                    open: authorBounty[0].open,
                    review_links: review_links,
                    reviewers: [],
                    reviewers_count: reviewers_count
                });
            } else {
                authorBounties.push({
                    accepted: false,
                    author: manuscript.AUTHOR_HASH.trim(),
                    journal: manuscript.JOURNAL_HASH.trim(),
                    manuscriptId: authorManuscriptId,
                    manuscript_link: manuscript_hash,
                    open: true,
                    review_links: review_links,
                    reviewers: [],
                    reviewers_count: reviewers_count
                });
            }
            authorManuscriptId = authorManuscriptId+1;
        });

        console.log('final authorbounties', authorBounties);
        this.setState({ authorBounties: authorBounties });

        const editorBount = await axios({
            // Endpoint to send files
            url: `${process.env.REACT_APP_API_URL}/api/get-manuscripts-by-journal`,
            method: "GET",
            headers: {
                // Add any auth token here
                authorization: "your token comes here",
            },

            // Attaching the form data
            params: {journal_hash: this.state.account},
        });

        const editorManuscripts = editorBount.data.manuscripts;
        let editorBounties = [];
        let manuscriptId = 0;
        editorManuscripts.forEach(async(manuscript, index) => {
            const manuscript_hash = manuscript.ARTICLE_HASH.trim();
            // console.log("manuscript hash rev here", `test${manuscript_hash}test`);
            const str = Buffer.from(bs58.decode(manuscript_hash)).toString('hex')

            const editorBounty =
            await this.state.PRContract.methods.getManuscriptsByArticleHash(
                '0x'+str.substring(4, str.length)
            ).call();

            console.log('editorBounty from blockchain', editorBounty);

            const review_links = manuscript.REVIEW_HASH != null ? manuscript.REVIEW_HASH : [];
            const reviewers_count = manuscript.REVIEWERS_COUNT;

            if (editorBounty && editorBounty.length != 0) {
                editorBounties.push({
                    accepted: editorBounty[0].accepted,
                    author: manuscript.AUTHOR_HASH.trim(),
                    journal: manuscript.JOURNAL_HASH.trim(),
                    manuscriptId: manuscriptId,
                    manuscript_link: manuscript_hash,
                    open: editorBounty[0].open,
                    review_links: review_links,
                    reviewers: [],
                    reviewers_count: reviewers_count,
                    blockManuscriptId: editorBounty[0].manuscriptId
                });
            } else {
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
                    blockManuscriptId: null

                });
            }

            manuscriptId = manuscriptId + 1;
        });

        console.log('final editorbounties', editorBounties);

        // const editorBounties =
        //     await this.state.PRContract.methods.getManuscriptsByJournal(
        //         this.state.account
        //     ).call();
        this.setState({ editorBounties: editorBounties });

        const reviewerBount = await axios({
            // Endpoint to send files
            url: `${process.env.REACT_APP_API_URL}/api/get-manuscripts-by-reviewer`,
            method: "GET",
            headers: {
                // Add any auth token here
                authorization: "your token comes here",
            },
            params: {reviewer_hash: this.state.account},
        });

        console.log("reviewerBount", reviewerBount);
        const reviewerManuscripts = reviewerBount.data.manuscript_details;
        let reviewerBounties = [];
        let reviewerManuscriptId = 0;
        reviewerManuscripts.forEach(async(manuscript, index) => {
            const manuscript_hash = manuscript.ARTICLE_HASH.trim();
            const str = Buffer.from(bs58.decode(manuscript_hash)).toString('hex')

            const reviewerBounty =
            await this.state.PRContract.methods.getManuscriptsByArticleHash(
                '0x'+str.substring(4, str.length)
            ).call();
            
            const review_links = manuscript.REVIEW_HASH != null ? manuscript.REVIEW_HASH : [];
            // console.log('typeof review_links ', typeof(review_links), review_links.push('test'));
            console.log("final review_links", review_links);

            if (reviewerBounty && reviewerBounty.length != 0) {
                reviewerBounties.push({
                    accepted: reviewerBounty[0].accepted,
                    author: null,
                    journal: manuscript.JOURNAL_HASH.trim(),
                    manuscriptId: reviewerManuscriptId,
                    manuscript_link: manuscript_hash,
                    open: reviewerBounty[0].open,
                    review_links: review_links,
                    reviewers: [],
                    reviewers_count: 0 // @TODO: Change the static value later
                });
            } else {
                reviewerBounties.push({
                    accepted: false,
                    author: null,
                    journal: manuscript.JOURNAL_HASH.trim(),
                    manuscriptId: reviewerManuscriptId,
                    manuscript_link: manuscript_hash,
                    open: true,
                    review_links: review_links,
                    reviewers: [],
                    reviewers_count: 0
                });
            }

            reviewerManuscriptId = reviewerManuscriptId + 1;
        });

        // const reviewerBounties =
        //     await this.state.PRContract.methods.getManuscriptsByReviewer(
        //         this.state.account
        //     ).call();
        this.setState({ reviewerBounties: reviewerBounties });
        console.log('reviewerBounties', this.state.reviewerBounties);
    }

    setChainId(chainId) {
        this.setState({ chainId: chainId });
    }
    setChainId(chainId) {
        this.setState({ chainId: chainId });
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Container fluid>
                        <Row>
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
                                    Review Rewards
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="navtext me-auto">
                                        <Nav.Link as={NavLink} to="/author">
                                            <img
                                                alt=""
                                                src={authorButton}
                                                width="32"
                                                height="40"
                                                test={this.state.account}
                                            />
                                            {' '}Author
                                        </Nav.Link>
                                        <Nav.Link as={NavLink} to="/editor">
                                            <img
                                                alt=""
                                                src={editorButton}
                                                width="32"
                                                height="40"
                                            />
                                            {' '} Editor
                                        </Nav.Link>
                                        <Nav.Link as={NavLink} to="/review">
                                            <img
                                                alt=""
                                                src={reviewerButton}
                                                width="32"
                                                height="40"
                                            />
                                            {' '}Reviewer
                                        </Nav.Link>
                                        <Nav.Link as={NavLink} to="/reputation">
                                            <img
                                                alt=""
                                                src={reputationButton}
                                                width="32"
                                                height="40"
                                            />
                                            {' '}Reputation
                                        </Nav.Link>
                                        <Nav.Link as={NavLink} to="/settings">
                                            <img
                                                alt=""
                                                width="32"
                                                height="40"
                                            />
                                            {' '}Settings
                                        </Nav.Link>
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
                        </Row>
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
                    <div>
                        <Routes>
                            <Route path="/author"
                                element={
                                    <Author
                                        chainId={this.state.chainId}
                                        account={this.state.account}
                                        authorBounties={this.state.authorBounties}
                                        PRContract={this.state.PRContract}
                                        // SoulBoundContract={this.state.SoulBoundContract}
                                        web3={this.state.web3}
                                    />} />
                            <Route path="/editor"
                                element={
                                    <Editor
                                        chainId={this.state.chainId}
                                        account={this.state.account}
                                        editorBounties={this.state.editorBounties}
                                        PRContract={this.state.PRContract}
                                        SoulBoundContract={this.state.SoulBoundContract}
                                        web3={this.state.web3}

                                    />
                                }
                            />
                            <Route path="/review"
                                element={
                                    <Review
                                        chainId={this.state.chainId}
                                        account={this.state.account}
                                        reviewerBounties={this.state.reviewerBounties}
                                        PRContract={this.state.PRContract}
                                        // SoulBoundContract={this.state.SoulBoundContract}
                                        profile={this.state.profile}
                                        web3={this.state.web3}

                                    />
                                } 
                            />
                            <Route path="/"
                                element={
                                <Home PRContract={this.state.PRContract} />
                                } 
                            />
                            <Route path="/reputation"
                                element={<Reputation
                                    PRContract={this.state.PRContract}
                                    SoulBoundContract={this.state.SoulBoundContract}
                                    ReviewRewardTokenContract={this.state.ReviewRewardTokenContract}
                                    account={this.state.account}
                                />}
                            />
                            <Route path="/settings"
                                element={<Settings
                                    PRContract={this.state.PRContract}
                                    SoulBoundContract={this.state.SoulBoundContract}
                                    ReviewRewardTokenContract={this.state.ReviewRewardTokenContract}
                                    account={this.state.account}
                                />}
                            />
                        </Routes>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
export default App;