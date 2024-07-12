import React from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Web3 from 'web3';
import bs58 from 'bs58';
import axios from "axios";

class AddReviewersModal extends React.Component {
    constructor(props) {
        super(props);
        const w3 = new Web3(window.ethereum);
        let currentDate = new Date().toISOString().slice(0,10);

        this.state = {
            reviewer: null,
            reviewer_values: [''],
            web3: w3,
            deadline: null,
            currentDate: currentDate,
            available_reviewers: []
        }
        
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleReviewerChange = this.handleReviewerChange.bind(this);
        this.handleAddReviewers = this.handleAddReviewers.bind(this);
    }

    componentDidMount() {
        const getReviewers = async () => {
            const reviewers = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-reviewers`,
                method: "GET",
            });

            this.setState({'available_reviewers': reviewers.data.reviewers});
        }

        getReviewers();
    }

    async handleAddReviewers() {
        for (let i = 0; i < this.state.reviewer_values.length; i++) {
            if (!this.state.web3.utils.isAddress(this.state.reviewer_values[i])) {
                alert(`The reviewer address in slot ${i+1} is not a valid eth address.`)
                return
            }
        }

        // Connecting to database and updating data
        axios({
            url: `${process.env.REACT_APP_API_URL}/api/add-reviewers`,
            method: "POST",
            data: {reviewer_hashes: this.state.reviewer_values, article_hash: this.props.ipfs32, deadline: this.state.deadline},
        })
            .then((res) => {
                console.log('api response', res);
                window.location.reload();
            })
            .catch((err) => {
                console.log('api error', err);
                alert("Something went wrong. Please try again");
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
                    <Modal.Title>Assign Reviewers</Modal.Title>
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
                                                <Form.Select
                                                    type="text"
                                                    onChange={e => this.handleReviewerChange(e.target.value, i)}
                                                    required
                                                >
                                                    <option>-- SELECT REVIEWER --</option>
                                                    {this.state.available_reviewers && this.state.available_reviewers.length >0 && this.state.available_reviewers.map((reviewer) => (
                                                        <option value={reviewer.USER_HASH}>{`${reviewer.FIRST_NAME} ${reviewer.LAST_NAME}`}</option>
                                                    ))}
                                                </Form.Select>
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
                                    Add More Reviewers
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => this.handleAddReviewers()}
                                    variant='success'
                                >
                                    Assign Reviewers
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}

export default AddReviewersModal;