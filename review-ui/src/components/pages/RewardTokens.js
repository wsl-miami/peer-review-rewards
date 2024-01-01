import { useState, useEffect } from 'react';
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import axios from "axios";


export default function RewardTokens({tokenId, SoulBoundContract}) {
    const [tokenMetadata, setTokenMetadata] = useState({});

    useEffect(() => {
        const fetchTokenMetadata = async() => {
                var soulBoundToken = await SoulBoundContract.methods.tokenURI(tokenId).call();
                const response = await axios.get(soulBoundToken);
                setTokenMetadata(response.data);
        }
        fetchTokenMetadata();

    }, [tokenId])

    return (
        <>
        <Col tokenId={tokenId}>
            <Card>
                <Card.Img variant="top" src={tokenMetadata ? tokenMetadata.image : ''} />
                <Card.Body>
                    <Card.Title>{tokenMetadata.name}</Card.Title>
                    <Card.Text>
                        {tokenMetadata.description}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>Journal: {tokenMetadata && tokenMetadata.attributes ? tokenMetadata.attributes[0].value : ''}</Card.Footer>
                
            </Card>
        </Col>
        </>
    )

}