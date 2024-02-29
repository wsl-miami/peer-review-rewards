import { useState, useEffect } from 'react';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Web3 from 'web3';
import RewardTokens from "./RewardTokens";
import Container from 'react-bootstrap/Container';
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
                // var ret = await PRContract.methods.addressToReputation(account).call();
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
                        <div>
                            <span className="badge bg-primary clickable-badges" style={{'font-size': '16px'}}>
                                {STRING_CONSTANTS.SBT}: {reputation} 
                            </span>
                            <span>
                                <span className="badge bg-success clickable-badges" style={{'font-size': '16px'}}>
                                    {STRING_CONSTANTS.RRT}: {rrtTokens}
                                </span> 
                            </span>
                        </div>
                    </div>
                </Row>
                <Row xs={1} md={2} className="g-2">
                    {tokens.length !==0 ? tokens.map((item, index) => <RewardTokens tokenId={item} SoulBoundContract={SoulBoundContract} key={index} />) : 'No reputation tokens accumulated'}
                </Row>
            </Container>
        </>
    )
}