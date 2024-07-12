import { useState, useEffect } from 'react';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Web3 from 'web3';
import RewardTokens from "./RewardTokens";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import STRING_CONSTANTS from "../../constants";


export default function Reputation({
    PRContract,
    SoulBoundContract,
    ReviewRewardTokenContract,
    account
}) {

    const [reputation, setReputation] = useState(0);
    const [tokens, setTokens] = useState([]);
    const [rrtTokens, setRrtTokens] = useState(0);

    useEffect(() => {
        const fetchReputation = async () => {
            if(account) {
                var totalTokens = await SoulBoundContract.methods.balanceOf(account).call();
                var listAllTokens = await SoulBoundContract.methods.getTokensOwnedByAddress(account).call();
                console.log('listAllTokens', listAllTokens);
                setReputation(totalTokens);
                setTokens(listAllTokens);

            }
        }

        const fetchRRTTokens = async () => {
            if (account) {
                var totalTokens = await ReviewRewardTokenContract.methods.balanceOf(account).call();
                totalTokens = Web3.utils.fromWei(totalTokens);
                setRrtTokens(totalTokens);
            }
        }

        fetchReputation();
        fetchRRTTokens();

    }, [account])

    return (
        <>
            <Container>
                <Row>
                    <div class="d-flex justify-content-between" style={{'margin': '5px'}}>
                        <h3>
                            {STRING_CONSTANTS.TOKENS}
                        </h3>
                    </div>
                </Row>
                <Row xs={1} md={1} lg={1}>                   
                    <Col>
                        <Card className="border-success mb-5">
                            <Card.Body>
                                <Card.Title className="border-bottom border-success">
                                    <div class="d-flex justify-content-between">
                                        {STRING_CONSTANTS.RRT}
                                        <div>
                                        <span className="badge bg-success clickable-badges" style={{'font-size': '16px'}}>
                                            {STRING_CONSTANTS.RRT}: {rrtTokens} 
                                        </span>
                                        </div>
                                    </div>
                                </Card.Title>
                            <Card.Text>
                                {STRING_CONSTANTS.RRT} are awarded by the journals for your 
                                contribution as a reviewer. Journals have the freedom to assign specific
                                amount of {STRING_CONSTANTS.RRT} to you based upon the quality of review 
                                submitted and timeliness. {STRING_CONSTANTS.RRT} can be used as credit 
                                towards the payment required to submit a manuscript or for journal subscriptions.
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="border-primary mb-5">
                            <Card.Body>
                                <Card.Title className="border-bottom border-primary">
                                    <div class="d-flex justify-content-between">
                                        {STRING_CONSTANTS.SBT}
                                        <div>
                                        <span className="badge bg-primary clickable-badges" style={{'font-size': '16px'}}>
                                            {STRING_CONSTANTS.SBT}: {reputation} 
                                        </span>
                                        </div>
                                    </div>
                                </Card.Title>
                            <Card.Text>
                            
                                <div class="d-flex justify-content-between" style={{'margin': '5px'}}>
                                    <p>
                                    {STRING_CONSTANTS.SBT} serve as a certificate of recognition for 
                                    your contributions. Each reviewer is assigned a single token per 
                                    review submitted. {STRING_CONSTANTS.SBT} includes necessary information related 
                                    to the reviewers’ reputation such as journal address, token name 
                                    and description, type of contribution, and number of papers 
                                    reviewed.
                                    </p>
                                </div>

                                <Row xs={1} md={2} className="g-2">
                                    {tokens.length !==0 ? tokens.map((item, index) => <RewardTokens tokenId={item} SoulBoundContract={SoulBoundContract} key={index} />) : 'No reputation tokens accumulated'}
                                </Row>
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </Container>
        </>
    )
}