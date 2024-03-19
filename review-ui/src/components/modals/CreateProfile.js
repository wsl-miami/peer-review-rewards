import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import STRING_CONSTANTS from "../../constants";

let CURRENT_DATE = new Date().toISOString().slice(0,10);

export default function CreateProfile({
    disconnect, 
    account, 
    ProfilesContract, 
    setProfile, 
    profile,
    web3, 
    chainId,
    showCreateProfile,
    setShowCreateProfile
}) {
    const [email, setEmail] = useState(null);
    const [journalName, setJournalName] = useState(null);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [role, setRole] = useState(null);


    // const showNoProfile = () => {
    //     var ret = true;
    //     ret = ret && (account !== null && account !== '');
    //     ret = ret && (profile === null && chainId === 5);
    //     return (ret);
    // }

    const handleDisconnect = () => {
        disconnect();
    }

    const handleCreateProfile = async (e) => {
        e.preventDefault();

        if (role == 'editor' && (journalName == '' || journalName == null)) {
            alert('Journal Name must be filled in by the editor');
            return;
        }

        axios({
            url: `${process.env.REACT_APP_API_URL}/api/create-user-profile`,
            method: "POST",
            data: {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    birth_date: birthDate,
                    journal_name: journalName,
                    role,
                    account_hash: account
                },
        })
            .then((res) => {
                const prof = {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    birth_date: birthDate,
                    journal_name: journalName,
                    role,
                    account_hash: account
                };
                setProfile(prof);
                window.location.reload();
            })
            .catch((err) => {
                console.log('api error', err);
                alert('Something went Wrong. Please Try again');
            });

        // await ProfilesContract.methods.createProfile(name, journalName, email)
        // .send({from: account})
        // .on('confirmation', (receipt) => {
        //     window.location.reload();
        // });
        // var newProfile = await ProfilesContract.methods.getProfileByAddress(account).call()
        // setProfile(newProfile);
    }

    return (
        <>
            <Modal
                show={showCreateProfile}
                onHide={() => setShowCreateProfile()}
                backdrop="static"
                keyboard={false}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{STRING_CONSTANTS.CREATE_PROFILE}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleCreateProfile(e)}>
                        <Row>
                            <Form.Group as={Col}>
                                <Row>
                                    <Col md={{span:3}}>
                                        <Form.Label>Username: </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="text"
                                            placeholder="username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Col}>
                                <Row>
                                    <Col md={{span:3}}>
                                        <Form.Label>First Name: </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="text"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Col}>
                                <Row>
                                    <Col md={{span:3}}>
                                        <Form.Label>Last Name: </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Col}>
                                <Row>
                                    <Col md={{span:3}}>
                                        <Form.Label>Birth Date: </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="date"
                                            placeholder="Birth Date"
                                            value={birthDate}
                                            max={CURRENT_DATE}
                                            onChange={e => setBirthDate(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Col}>
                                <Row>
                                    <Col md={{span:3}}>
                                        <Form.Label>Role: </Form.Label>
                                    </Col>                  
                                    <Col>
                                    <Form.Select
                                            type="text"
                                            onChange={e => setRole(e.target.value)}
                                            required
                                        >
                                            <option value="">-- SELECT ROLE --</option>
                                            <option value="author">Author</option>
                                            <option value="editor">Editor</option>
                                            <option value="reviewer">Reviewer</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Col}>
                                <Row className='align-items-center'>
                                    <Col md={{span:3}}>
                                        <Form.Label>Journal Name (optional):</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Name of the journal you're editor of"
                                            value={journalName}
                                            onChange={e => setJournalName(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        
                        <br />
                        <Row>
                            <Form.Group as={Col}>
                                <Row className='align-items-center'>
                                    <Col md={{span:3}}>
                                        <Form.Label>Email:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control 
                                            type="email"
                                            placeholder="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <br />
                        <Row className='text-center'>
                            <Col>
                                <Button
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}