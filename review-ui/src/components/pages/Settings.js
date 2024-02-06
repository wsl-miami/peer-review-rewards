import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Web3 from 'web3';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import axios from "axios";

export default function Settings({
    PRContract,
    SoulBoundContract,
    ReviewRewardTokenContract,
    account
}) {

    const [tokenAmount, setTokenAmount] = useState(null);
    const [RRTEnabled, setRRTEnabled] = useState(null);

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
                    const rrt_amount_per_review = settings.data.settings.RRT_AMOUNT_PER_REVIEW;
                    const enabled = (settings.data.settings.ENABLE_RRT && settings.data.settings.ENABLE_RRT == 1) ? true : false;
                    setTokenAmount(rrt_amount_per_review);
                    setRRTEnabled(enabled);
                }
            }
        };  
        fetchSettings();
    }, [account]);

    const handleSettingsUpdate = () => {
        axios({
            url: `${process.env.REACT_APP_API_URL}/api/update-review-settings`,
            method: "POST",
            data: {journal_hash: account, enableRRT: RRTEnabled, amountPerReview: tokenAmount},
            // data: {author: "0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6", file_hash: "QmVZerrmNhQE1gPp4KnX1yFJSHgAfMY6QW5LxGdpRPM2uJ"}
        })
            .then((res) => {console.log('api response', res);})
            .catch((err) => {console.log('api error', err)});
    }

    return (
        <>
            <Container className="container px-4 py-5 text-center">
                <h2 className="pb-2 border-bottom" style={{"paddingTop" : "30px"}}>Reviewer Reward Options</h2>
                <p className="lead">Reviewers that submit quality reviews to your journal can be rewarded in following ways</p>
                <Row className="row g-4 py-5 row-cols-2 row-cols-lg-3">
                    
                    <Col className="col feature">
                        <h3>Soul Bound Tokens</h3>
                        <p>Tokens of recognition assigned to reviewers for each review submitted. The system automatically assigns one token per review.</p>
                    </Col>
                    <Col className="col feature">
                        <h3>Review Reward Tokens (RRT)</h3>
                        <p>Transferrable utility tokens that reviewers can use for subscriptions. If you want to enable distribution of RRT tokens, please fill in the details below.</p>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <h2 className="pb-2 border-bottom">Reward Policy</h2>
                    <p className="lead">Enable this option to automatically assign RRT tokens to reviewers. Once activated, the reviewers will receive RRT tokens for the papers they review. Select the number of tokens that should be assigned per review.</p>


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
                            <Col xs="auto">
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
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" className="mb-2" onClick={handleSettingsUpdate}>
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