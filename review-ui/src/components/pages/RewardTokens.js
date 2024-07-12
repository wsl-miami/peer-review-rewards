import { useState, useEffect } from 'react';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import axios from "axios";


export default function RewardTokens({tokenId, SoulBoundContract}) {
    const [tokenMetadata, setTokenMetadata] = useState({journal: {
        journal_name: null,
        journal_hash: null
    }});

    useEffect(() => {
        const fetchTokenMetadata = async() => {
                let soulBoundToken = await SoulBoundContract.methods.tokenURI(tokenId).call();
                const response = await axios.get(soulBoundToken);
                let journal = {
                    journal_name: null,
                    journal_hash: null
                }

                if (response.data?.attributes && response.data.attributes[0]?.value) {
                    const journal_hash = response.data.attributes[0]?.value;
                    journal.journal_hash = journal_hash;
                    let journal_detail = await axios({
                        url: `${process.env.REACT_APP_API_URL}/api/get-journal-detail`,
                        method: "GET",
                        params: {journal_hash: journal_hash}
                    });

                    if (journal_detail && journal_detail.data && journal_detail.data.journal) {
                        journal_detail = journal_detail.data.journal;
                        journal.journal_name = journal_detail.JOURNAL_NAME;
                    }
                    
                }

                response.data.journal = journal;
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
                    <Card.Footer>Journal: {tokenMetadata && tokenMetadata.journal && tokenMetadata.journal.journal_name ? tokenMetadata.journal.journal_name : tokenMetadata.journal.journal_hash}</Card.Footer>
                </Row>

            </Card>
        </Col>
        </>
    )

}