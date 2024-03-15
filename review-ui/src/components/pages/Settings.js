import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Web3 from 'web3';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';

import axios from "axios";
import STRING_CONSTANTS from "../../constants";

export default function Settings({
    PRContract,
    SoulBoundContract,
    ReviewRewardTokenContract,
    account
}) {

    // const [tokenAmount, setTokenAmount] = useState(null);
    const [RRTEnabled, setRRTEnabled] = useState(null);
    const [tokenWithinDeadline, setTokenWithinDeadline] = useState(null);
    const [tokenAfterDeadline, setTokenAfterDeadline] = useState(null);

    useEffect(() => {
        const fetchSettings = async() => {
            console.log("entered here", account);
            if (account) {
                const settings = await axios({
                    url: `${process.env.REACT_APP_API_URL}/api/get-token-settings`,
                    method: "GET",
                    params: {journal_hash: account},
                });
    
                if (settings && settings.data && settings.data.settings) {
                    const reward_settings = settings.data.settings;
                    const rrt_amount_per_review = reward_settings.RRT_AMOUNT_PER_REVIEW;
                    const enabled = (reward_settings.ENABLE_RRT && reward_settings.ENABLE_RRT == 1) ? true : false;
                    const rrt_within_deadline = reward_settings.RRT_WITHIN_DEADLINE;
                    const rrt_after_deadline = reward_settings.RRT_AFTER_DEADLINE;
                    // setTokenAmount(rrt_amount_per_review);
                    setRRTEnabled(enabled);
                    setTokenWithinDeadline(rrt_within_deadline);
                    setTokenAfterDeadline(rrt_after_deadline);
                }
            }
        };  
        fetchSettings();
    }, [account]);

    const handleSettingsUpdate = () => {
        axios({
            url: `${process.env.REACT_APP_API_URL}/api/update-review-settings`,
            method: "POST",
            data: {journal_hash: account, 
                    enableRRT: RRTEnabled, 
                    // amountPerReview: tokenAmount,
                    amountPerReviewWithinDeadline: tokenWithinDeadline,
                    amountPerReviewAfterDeadline: tokenAfterDeadline
                },
            // data: {author: "0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6", file_hash: "QmVZerrmNhQE1gPp4KnX1yFJSHgAfMY6QW5LxGdpRPM2uJ"}
        })
            .then((res) => {
                console.log('api response', res);
                })
            .catch((err) => {
                console.log('api error', err);
                alert('Something went wrong. Please try again.');
            });
    }

    return (
        <>
            <Container className="text-center">
                <h2 className="pb-2 border-bottom" style={{"paddingTop" : "30px"}}>Reviewer Reward Options</h2>
                <p className="lead">Reviewers that submit quality reviews to your journal can be rewarded in following ways</p>
                <Row xs={1} md={2} className="g-2">
                    <Col>
                        <Card className="border-primary mb-5">
                            <Card.Body>
                                <Card.Title className="border-bottom border-primary">{STRING_CONSTANTS.SBT}</Card.Title>
                            <Card.Text>
                            Tokens of recognition assigned to reviewers for each review submitted. 
                            The system automatically assigns one token per review.
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="border-success mb-5">
                            <Card.Body>
                                <Card.Title className="border-bottom border-success">{STRING_CONSTANTS.RRT}</Card.Title>
                            <Card.Text>
                            Transferrable utility tokens that reviewers can use for subscriptions. 
                            If you want to enable distribution of {STRING_CONSTANTS.RRT}, please fill in the 
                            details below.
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <h2 className="pb-2 border-bottom">Reward Policy</h2>
                    <p className="lead">Enable this option to automatically assign {STRING_CONSTANTS.RRT} to reviewers. Once activated, the reviewers will receive {STRING_CONSTANTS.RRT} for the papers they review. Select the number of tokens that should be assigned per review.</p>


                    <Form>
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <Form.Check
                                    type="switch"
                                    id="enableRRT"
                                    label="Enable Review Rewards Token"
                                    checked={RRTEnabled ? 'checked' : ''}
                                    onChange={e => setRRTEnabled(e.target.checked)}
                                    className="mb-2"
                                />
                            </Col>
                            {/* <Col xs="auto">
                                <Form.Label htmlFor="rrt_amount" visuallyHidden>
                                    Tokens Per Review
                                </Form.Label>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>RRT</InputGroup.Text>
                                    <FormControl 
                                        id="rrt_amount"
                                        placeholder="Tokens per review" 
                                        type="text"
                                        value={tokenAmount}
                                        onChange={e => setTokenAmount(e.target.value)}    
                                    />
                                </InputGroup>
                            </Col> */}
                            <Col xs="auto">
                                <Form.Label htmlFor="rrt_within_deadline">
                                    Review submitted within deadline
                                </Form.Label>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>{STRING_CONSTANTS.RRT_SHORTENED}</InputGroup.Text>
                                    <FormControl 
                                        id="rrt_within_deadline"
                                        placeholder="Tokens per review" 
                                        type="text"
                                        value={tokenWithinDeadline}
                                        onChange={e => setTokenWithinDeadline(e.target.value)}    
                                    />
                                </InputGroup>
                            </Col>
                            <Col xs="auto">
                                <Form.Label htmlFor="rrt_after_deadline">
                                    Review submited after deadline
                                </Form.Label>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>{STRING_CONSTANTS.RRT_SHORTENED}</InputGroup.Text>
                                    <FormControl 
                                        id="rrt_after_deadline"
                                        placeholder="Tokens per review" 
                                        type="text"
                                        value={tokenAfterDeadline}
                                        onChange={e => setTokenAfterDeadline(e.target.value)}    
                                    />
                                </InputGroup>
                            </Col>
                            <Col xs="auto">
                                <Button className="mb-2" onClick={handleSettingsUpdate}>
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </Container>
        </>
    )
};