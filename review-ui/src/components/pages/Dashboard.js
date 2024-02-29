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
import Manuscripts from "./Manuscripts";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Table from 'react-bootstrap/Table';

import axios from "axios";
import STRING_CONSTANTS from "../../constants.js";

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
                    <tr>
                                <Manuscripts
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
                    </tr>
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
            url: `${process.env.REACT_APP_API_URL}/api/get-unassigned-reviews`,
            method: "GET",
            params: {journal_hash: account},
        })
        console.log('api response', res);
        const unassignedReviews =  res.data.unassignedReviews;
        const rewardsIds = [];
        const reviewerAddresses = [];
        unassignedReviews.forEach(async (review) => {
            const rewardsId = review.ID;
            const reviewerAddress = review.REVIEWER_HASH;

            rewardsIds.push(rewardsId);
            reviewerAddresses.push(reviewerAddress);

            // console.log(reviewerAddress);
            // let test = await SoulBoundContract.methods.safeMint(
            //         reviewerAddress, account
            //     ).send({from: account, gas: 2100000});

            // const updateRewards = await axios({
            //     url: "http://localhost:5000/api/update-assigned-reviews",
            //     method: "POST",
            //     data: {rewardsId: rewardsId},
            // })
        });

        if (reviewerAddresses.length > 0){
            let test = await SoulBoundContract.methods.bulkMint(
                reviewerAddresses, account, account
            ).send({from: account, gas: 2100000});
    
            const updateRewards = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/bulk-update-assigned-reviews`,
                method: "POST",
                data: {rewardIds: rewardsIds},
            })
        }

        // @TODO add RRT tokens distribution code logic
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
                                Submit a Manuscript
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
                {/* <Col style={{ 'text-align': 'right' }}>
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

                </Col> */}
            </>
        );
    }

    const filterTypes = ['passedFilter', 'failedFilter', 'openFilter', 'closedFilter'];
    const filterStatus = {
        'passedFilter': STRING_CONSTANTS.STATUS.ACCEPTED.text,
        'failedFilter': STRING_CONSTANTS.STATUS.REJECTED.text,
        'openFilter': STRING_CONSTANTS.STATUS.PENDING.text,
        'closedFilter': STRING_CONSTANTS.STATUS.WITHDRAWN.text
    }
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
                                        <Form.Check.Label>{filterStatus[type]}</Form.Check.Label>
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
                            ) : (bounties.length === 0 || bounties === null) ? <NoBounties type={type} /> :
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <Table hover responsive style={{'text-align': 'center'}}>
                                    <thead>
                                        <tr>
                                        <th>Submission Date</th>
                                        <th>Manuscript</th>
                                        <th>Journal</th>
                                        {type == 'editor' &&
                                            <th>Reviewers</th>
                                        }
                                        <th>Reviews</th>
                                        {type != 'author' &&
                                            <th>Review Deadline</th>
                                        }
                                        <th>Status</th>
                                        <th>View</th>
                                        <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                           { renderBounties() }                                       
                                    </tbody>
                                </Table>
                            </div>
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