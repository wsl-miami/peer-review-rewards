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
import AccountButton from './components/general/AccountButton.js'
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
import PRContractABI from './static/PeerReviewGSN.json';
import ProfilesABI from './static/ProfilesABI.json';
import CreateProfile from './components/modals/CreateProfile.js';
import ViewProfile from './components/modals/ViewProfile.js';
import WrongChain from "./components/modals/WrongChain";
import Reputation from "./components/pages/Reputation";
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
        console.log('setweb3', config);

        const provider = await RelayProvider.newProvider({ provider: window.ethereum ? window.ethereum : new Web3.providers.HttpProvider(process.env.REACT_APP_GOERLI_URL), config }).init();
        console.log('setweb3', provider);

        try {

            const web3 = new Web3(provider);
            console.log('web', web3);
            this.setState({ web3: web3 }, () => {
                console.log('state', this.state.web3);
                this.setPRContract();
                this.setProfilesContract();
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
        const authorBounties =
            await this.state.PRContract.methods.getManuscriptsByAuthor(
                this.state.account
            ).call();
        this.setState({ authorBounties: authorBounties });

        const editorBounties =
            await this.state.PRContract.methods.getManuscriptsByJournal(
                this.state.account
            ).call();
        this.setState({ editorBounties: editorBounties });

        const reviewerBounties =
            await this.state.PRContract.methods.getManuscriptsByReviewer(
                this.state.account
            ).call();
        this.setState({ reviewerBounties: reviewerBounties });
        console.log('authorBounties', this.state.authorBounties);
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
                                        web3={this.state.web3}
                                    />} />
                            <Route path="/editor"
                                element={
                                    <Editor
                                        chainId={this.state.chainId}
                                        account={this.state.account}
                                        editorBounties={this.state.editorBounties}
                                        PRContract={this.state.PRContract}
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