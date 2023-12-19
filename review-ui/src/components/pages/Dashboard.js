import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import NoBounties from '../general/NoBounties.js';
import Spinner from 'react-bootstrap/Spinner';
import openBountyButton from '../../static/createNewButton.png';
import OpenBountyModal from '../modals/OpenBountyModal.js';
import BountyCard from "./BountyCard";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from "axios";

export default function Dashboard({
    chainId,
    account,
    bounties,
    PRContract,
    SoulBoundContract,
    type,
    profile,
    web3
}) {
    const [openFilter, setOpenFilter] = useState(false);
    const [closedFilter, setClosedFilter] = useState(false);
    const [passedFilter, setPassedFilter] = useState(false);
    const [failedFilter, setFailedFilter] = useState(false);
    const [showOpenForm, setShowOpenForm] = useState(false);

    const renderBounties = () => {
        console.log('bounties', bounties);
        console.log("prcont", PRContract);
        console.log("type", type);
        console.log("chainId", chainId);
        if (bounties) {
            // var bountyList = type === 'reviewer' ? bounties[0] : bounties;
            var bountyList = bounties;

            if (bountyList.length === 0 || bounties === null) {
                return <NoBounties type={type} />
            }
            return bountyList.map((bounty) => {
                return (
                    <>
                        <Row>
                            <Col>
                                <BountyCard
                                    account={account}
                                    bounty={bounty}
                                    openFilter={openFilter}
                                    closedFilter={closedFilter}
                                    passedFilter={passedFilter}
                                    failedFilter={failedFilter}
                                    PRContract={PRContract}
                                    type={type}
                                    profile={profile}
                                />
                            </Col>
                        </Row>
                    </>
                );
            });
        } else {
            return '';
        }
    }

    const handleFilterChange = (key) => {
        if (key === 'openFilter') {
            setOpenFilter(!openFilter);
        } else if (key === 'closeFilter') {
            setClosedFilter(!closedFilter);
        } else if (key === 'passedFilter') {
            setPassedFilter(!passedFilter);
        } else if (key === 'failedFilter') {
            setFailedFilter(!failedFilter);
        }
    }

    const distributeRewards = async () => {
        const res = await axios({
            url: "http://localhost:5000/api/get-unassigned-reviews",
            method: "GET",
            headers: {
                authorization: "your token comes here",
            },
            params: {journal_hash: account},
        })
        console.log('api response', res);
        const unassignedReviews =  res.data.unassignedReviews.rows;
        unassignedReviews.forEach(async (review) => {
            const reviewerAddress = review[1];
            console.log(reviewerAddress);
            let test = await SoulBoundContract.methods.safeMint(
                    reviewerAddress
                ).send({from: account, gas: 2100000});
        });
    }

    const handleShowOpenForm = () => {
        setShowOpenForm(true);
    }

    const handleCloseOpenForm = () => {
        setShowOpenForm(false);
    }

    const authorContent = () => {
        if (type !== 'author') {
            return ('');
        }
        return (
            <>
                <br />
                <br />
                <Col style={{ 'text-align': 'right' }}>
                    <OverlayTrigger overlay={account == null ? <Tooltip id="tooltip-disabled">Account Connection Required</Tooltip> : <div></div>}>
                        <span>
                            <Button
                                disabled={account == null}
                                class="btn btn-success"
                                onClick={handleShowOpenForm} >
                                <img
                                    alt=""
                                    src={openBountyButton}
                                    width="25"
                                    height="25"
                                />{' '}
                                Open a Article
                            </Button>
                        </span>
                    </OverlayTrigger>

                </Col>
            </>
        );
    }


    const editorContent = () => {
        if (type !== 'editor') {
            return ('');
        }
        return (
            <>
                <br />
                <br />
                <Col style={{ 'text-align': 'right' }}>
                    <OverlayTrigger overlay={account == null ? <Tooltip id="tooltip-disabled">Account Connection Required</Tooltip> : <div></div>}>
                        <span>
                            <Button
                                disabled={account == null}
                                class="btn btn-success"
                                onClick={() => distributeRewards()} >
                                Distribute Rewards
                            </Button>
                        </span>
                    </OverlayTrigger>

                </Col>
            </>
        );
    }

    const filterTypes = ['passedFilter', 'failedFilter', 'openFilter', 'closedFilter'];
    return (
        <>
            <Container fluid>
                <Row fluid>
                    <Form>
                        <Row
                            className='align-items-center'
                            style={{ 'min-height': '50px' }}
                        >
                            {filterTypes.map((type) => (
                                <>
                                    <Col
                                        md={{ span: 1, offset: 0 }}
                                    >
                                        <Form.Check.Input
                                            type='checkbox'
                                            id={type}
                                            onClick={() => handleFilterChange(type)}
                                        />
                                        &nbsp;
                                        <Form.Check.Label>{type.substring(0, type.length - 6)}</Form.Check.Label>
                                    </Col>
                                </>
                            ))}
                            {authorContent()}
                            {editorContent()}
                        </Row>
                    </Form>
                </Row>
                <Row className='justify-content-center'>
                    {
                        bounties === null ?
                            (account === null ?

                                <Row
                                    className="justify-content-center text-center"
                                    style={{ "margin-top": "10%" }}
                                >
                                    <h1>No connected account!</h1>
                                    <h3> How do I connect my account?</h3>
                                    <bl>
                                        <li>Ensure you have the <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">MetaMask</a> Chrome Extension installed</li>
                                        <li>Navigate to and select "Connect Wallet" at the top right of the page</li>
                                        <li>Enter your MetaMask credentials</li>
                                    </bl>
                                </Row> :
                                <Spinner
                                    animation="border"
                                    role="status"
                                    style={{ width: '8rem', height: '8rem' }}
                                />
                            ) :
                            renderBounties()
                    }
                </Row>
                <OpenBountyModal
                    showOpenForm={showOpenForm}
                    handleCloseOpenForm={handleCloseOpenForm}
                    account={account}
                    PRContract={PRContract}
                    web3={web3}
                />
            </Container>
        </>
    );
}