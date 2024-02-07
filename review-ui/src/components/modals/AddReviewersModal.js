import React from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Web3 from 'web3';
import bs58 from 'bs58';
import axios from "axios";

class AddReveiwersModal extends React.Component {
    constructor(props) {
        super(props);
        const w3 = new Web3(window.ethereum);
        let currentDate = new Date().toISOString().slice(0,10);

        this.state = {
            reviewer: null,
            reviewer_values: [''],
            web3: w3,
            deadline: null,
            currentDate: currentDate
        }
        
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleReviewerChange = this.handleReviewerChange.bind(this);
        this.handleAddReviewers = this.handleAddReviewers.bind(this);
    }

    async handleAddReviewers() {
        for (let i = 0; i < this.state.reviewer_values.length; i++) {
            if (!this.state.web3.utils.isAddress(this.state.reviewer_values[i])) {
                alert(`The reviewer address in slot ${i+1} is not a valid eth address.`)
                return
            }
        }
        // this.props.PRContract.methods.addReviewersToBounty(
        //     this.props.bountyid, this.state.reviewer_values
        // ).send({from: this.props.account})
        // .on('confirmation', (receipt) => {
        //     window.location.reload();
        // });

        const str = Buffer.from(bs58.decode(this.props.ipfs32)).toString('hex');
        console.log("ipfs32 props", this.props.ipfs32);

        // Connecting to database and updating data
        axios({
            url: `${process.env.REACT_APP_API_URL}/api/add-reviewers`,
            method: "POST",
            data: {reviewer_hashes: this.state.reviewer_values, article_hash: this.props.ipfs32, deadline: this.state.deadline},
            // data: {author: "0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6", file_hash: "QmVZerrmNhQE1gPp4KnX1yFJSHgAfMY6QW5LxGdpRPM2uJ"}
        })
            .then((res) => {console.log('api response', res);})
            .catch((err) => {console.log('api error', err)});

        this.props.PRContract.methods.submitManuscript(
            this.props.account,
            '0x'+str.substring(4, str.length)
        ).send({from: this.props.account, gas: 210000})
        .on('confirmation', (receipt) => {
            console.log("done!");
            window.location.reload();
        });
    }

    handleIncrement() {
        this.setState({
            reviewer_values: [...this.state.reviewer_values, '']
        })
    }

    handleDecrement(i) {
        let new_values = [...this.state.reviewer_values];
        new_values.splice(i, 1);
        this.setState({
            reviewer_values: new_values
        })
    }

    handleReviewerChange(value, i) {
        let new_values = this.state.reviewer_values;
        new_values[i] = value;
        this.setState({
            reviewer_values: new_values
        })
        
        console.log(this.state.reviewer_values);
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
                    <Modal.Title>Add Reviewers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        {this.state.reviewer_values.map((item, i) => (
                            <>
                                <Row key={i}>
                                    <Form.Group>
                                        <Row className='align-items-center'>
                                            <Col md={{span:2}}>
                                                <Form.Label>Reviewer:</Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control 
                                                    type="text"
                                                    value={item}
                                                    placeholder='Reviewer address'
                                                    onChange={(e) => this.handleReviewerChange(e.target.value, i)}
                                                />
                                            </Col>
                                            
                                            <Col>
                                                <Button
                                                    onClick={() => this.handleDecrement(i)}
                                                >
                                                    -
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    
                                </Row>
                                <br />
                            </>
                        ))}
                        <Form.Group>
                            <Row className='align-items-center'>
                            <Col md={{span:2}}>
                                <Form.Label>Submission Deadline:</Form.Label>
                            </Col>
                            <Col md={{span:6}}>
                                <Form.Control 
                                    type="date"
                                    placeholder='Deadline'
                                    value={this.state.deadline}
                                    min={this.state.currentDate}
                                    onChange={(e) => this.setState({deadline: e.target.value})}
                                />
                            </Col>
                            </Row>           
                        </Form.Group>
                        <br />
                        <Row className='text-center'>
                            <Col>
                                <Button
                                    onClick={this.handleIncrement}
                                >
                                    Add Entry
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => this.handleAddReviewers()}
                                    variant='success'
                                >
                                    Submit Reviewer
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}

export default AddReveiwersModal;