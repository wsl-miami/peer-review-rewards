import React from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import STRING_CONSTANTS from "../../constants";
const FormData = require('form-data');

const Web3 = require("web3");
const { RelayProvider } = require('@opengsn/provider');


class OpenBountyModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: null,
            editor: null,
            token:null,
            amount:null,
            web3: null,
            journals: []
        }
        
        this.handleOpenBounty = this.handleOpenBounty.bind(this);
    }

    componentDidMount() {
        const getJournal = async () => {
            const journals = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-journals`,
                method: "GET",
            });

            this.setState({'journals': journals.data.journals});
            console.log('test', journals);
            console.log('journal', this.state.journals);
        }

        getJournal();

    }

    async handleOpenBounty() {
        const authorization = `Bearer ${process.env.REACT_APP_PINATA_API_KEY}`;

        // @TODO: Implementation of provider for opengsn network
        // const provider = await RelayProvider.newProvider({ provider: window.ethereum, config }).init();
        const web3 = this.props.web3;

        // if (!this.props.web3.utils.isAddress(this.state.token)) {
        //     alert('Token entered is not a valid eth address!')
        //     return
        // } else 

        if (!web3.utils.isAddress(this.state.editor)) {
            alert('Editor entered is not a valid eth address!')
            return
        } else if (this.state.article === null) {
            alert('Must choose a file as your article')
            return
        } 

        const formData = new FormData();
        formData.append('file', this.state.article);

        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        });

        formData.append('pinataOptions', pinataOptions);

        try {
            const pinataRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData,
                {
                headers: {
                    authorization
                }
            });

            let from = this.props.account;
    
            // Connecting to database and updating data
            axios({
                url: `${process.env.REACT_APP_API_URL}/api/manuscript-submission`,
                method: "POST",
                data: {author: this.props.account, file_hash: pinataRes.data.IpfsHash, journal: this.state.editor},
            })
                .then((res) => {
                    console.log('api response', res);
                    window.location.reload();
                })
                .catch((err) => {console.log('api error', err)});
        } catch(e) {
            console.log("Error while uploading file: ", e);
        }

        this.props.handleCloseOpenForm();
        this.setState({
            token: '',
            editor: '',
            amount:0,
            article:null
        });
    }
    render() {
        return (
            <Modal 
                show={this.props.showOpenForm} 
                onHide={this.props.handleCloseOpenForm}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Submit a Manuscript</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Form.Group as={Col}>
                                <Row className='align-items-center'>
                                    <Col md={{span:3}}>
                                        <Form.Label>Manuscript:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="file"
                                            onChange={e => this.setState({ article: e.target.files[0] })}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Row className='align-items-center'>
                                    <Col md={{span:2}}>
                                        <Form.Label>Journal:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Select
                                            type="text"
                                            onChange={e => this.setState({ editor: e.target.value })}
                                            required
                                        >
                                            <option>-- SELECT JOURNAL --</option>
                                            {this.state.journals && this.state.journals.length >0 && this.state.journals.map((journal) => (
                                                <option value={journal.JOURNAL_HASH}>{journal.JOURNAL_NAME}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <br />
                        <br />
                        <Row>
                            <Col md={{offset:5}}>
                                <Button
                                    onClick={this.handleOpenBounty}
                                >
                                    {STRING_CONSTANTS.SUBMIT_ACTION}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}

export default OpenBountyModal;