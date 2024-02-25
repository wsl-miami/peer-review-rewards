import { useState, useEffect } from 'react';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
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
                <Row className='g-0' tokenId={tokenId}>
                    <Col className='col-md-4'>
                        <Card.Img className='sbt-img' variant="top" src={tokenMetadata ? tokenMetadata.image : ''}/>
                    </Col>
                    <Col className='col-md-8'>
                        <Card.Body>
                            <Card.Title>{tokenMetadata.name}</Card.Title>
                            <Card.Text>
                                {tokenMetadata.description}
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row> 
                <Row className='g-0'>
                    <Card.Footer>Journal: {tokenMetadata && tokenMetadata.attributes ? tokenMetadata.attributes[0].value : ''}</Card.Footer>
                </Row>

            </Card>
        </Col>
        </>
    )

}