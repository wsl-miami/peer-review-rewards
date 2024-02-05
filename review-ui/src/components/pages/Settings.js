import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Web3 from 'web3';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import axios from "axios";

export default function Settings({
    PRContract,
    SoulBoundContract,
    ReviewRewardTokenContract,
    account
}) {

    const [tokenAmount, setTokenAmount] = useState(null);
    const [RRTEnabled, setRRTEnabled] = useState(null);

    const handleSettingsUpdate = () => {
        console.log("test", RRTEnabled, tokenAmount);
        axios({
            // Endpoint to send files
            url: `${process.env.REACT_APP_API_URL}/api/update-review-settings`,
            method: "POST",

            // Attaching the form data
            data: {journal_hash: account, enableRRT: RRTEnabled, amountPerReview: tokenAmount},
            // data: {author: "0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6", file_hash: "QmVZerrmNhQE1gPp4KnX1yFJSHgAfMY6QW5LxGdpRPM2uJ"}
        })
            // Handle the response from backend here
            .then((res) => {console.log('api response', res);})

            // Catch errors if any
            .catch((err) => {console.log('api error', err)});
    }

    return (
        <>
            <Container>
                <Row>
                    <h2 style={{ "margin-top": "5px" }}>Reviewer Reward Options</h2>
                </Row>
                <Row>
                    You can reward reviewers who contribute towards your journal in two ways:
                    <ol>
                        <li>Soul Bound Tokens: Tokens of recognition assigned to reviewers for each review submitted. The system automatically assigns one token per review.</li>
                        <li>Review Reward Tokens (RRT): Transferrable utility tokens that reviewers can use for subscriptions. If you want to enable distribution of RRT tokens, please fill in the details below.</li>
                    </ol>
                </Row>
                <Row>
                    <h3>Review Reward Tokens (RRT)</h3>
                    <Form>
                        <Row>
                            <Form.Group as={Col}>
                                <Row className='align-items-center'>
                                    <Form.Check
                                        type="switch"
                                        id="enableRRT"
                                        label="Enable Review Rewards Token (RRT)"
                                        onChange={e => setRRTEnabled(e.target.checked)}
                                    />
                                </Row>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Row className='align-items-center'>
                                    <Col md={{span:4}}>
                                        <Form.Label>No. of tokens per review:</Form.Label>
                                    </Col>
                                    <Col md={{span:2}}>
                                        <Form.Control 
                                            type="text"
                                            placeholder="amount"
                                            value={tokenAmount}
                                            onChange={e => setTokenAmount(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                    </Form>
                    <br />
                    <Row className='text-center'>
                        <Col>
                            <Button
                                variant="primary"
                                onClick={handleSettingsUpdate}
                            >
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </>
    )
};