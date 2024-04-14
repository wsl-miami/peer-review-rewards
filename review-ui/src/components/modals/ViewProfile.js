import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

let CURRENT_DATE = new Date().toISOString().slice(0,10);

export default function ViewProfile(
    {
        profile, 
        ProfilesContract, 
        setProfile, 
        showProfileDetails,
        setShowProfileDetails
    }) 
{
    const profileLoading = profile === null || profile === '';
    const [email, setEmail] = useState(profileLoading ? 'still loading' : profile.EMAIL);
    const [journalName, setJournalName] = useState(profileLoading ? 'still loading' : profile.JOURNAL_NAME);
    const [isEditing, setIsEditing] = useState(false);

    const [username, setUsername] = useState(profileLoading ? 'still loading' : profile.USERNAME);
    const [firstName, setFirstName] = useState(profileLoading ? 'still loading' : profile.FIRST_NAME);
    const [lastName, setLastName] = useState(profileLoading ? 'still loading' : profile.LAST_NAME);
    const [birthDate, setBirthDate] = useState(profileLoading ? 'still loading' : profile.BIRTH_DATE);
    const [role, setRole] = useState(profileLoading ? 'still loading' : profile.USER_ROLE);
    
    useEffect(() => {
        if (!profileLoading) {
            setEmail(profile.EMAIL);
            setJournalName(profile.JOURNAL_NAME);
            setUsername(profile.USERNAME);
            setFirstName(profile.FIRST_NAME);
            setLastName(profile.LAST_NAME);
            setBirthDate(profile.BIRTH_DATE);
            setRole(profile.USER_ROLE);
        }
    }, [profile])

    const handleUpdateProfile = () => {

    }

    const submitButton = () => {
        return (
            <>
                <Row className='text-center'>
                    <Col>
                        <Button
                            variant="primary"
                            type='Submit'
                        >
                            Submit Changes
                        </Button>
                    </Col>
                </Row>
            </>
        )
    }

    return (
        <>
        <Modal
            show={showProfileDetails}
            onHide={() => setShowProfileDetails(false)}
            size='lg'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Details for {profile === null || profile === '' ? 'still loading' : profile.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => handleUpdateProfile(e)}>
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
                                        disabled={isEditing ? "" : "disabled"}
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
                                        disabled={isEditing ? "" : "disabled"}
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
                                        disabled={isEditing ? "" : "disabled"}
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
                                        value={birthDate.substring(0, 10)}
                                        max={CURRENT_DATE}
                                        onChange={e => setBirthDate(e.target.value)}
                                        required
                                        disabled={isEditing ? "" : "disabled"}
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
                                        disabled={isEditing ? "" : "disabled"}
                                        value={role}
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
                                        disabled={isEditing ? "" : "disabled"}
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
                                        disabled={isEditing ? "" : "disabled"}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col}>
                            <Row className='align-items-center'>
                                <Col md={{span: 2, offset:0}}>
                                    <Form.Check.Input
                                        type='checkbox'
                                        onClick={() => setIsEditing(!isEditing)}
                                    />
                                    &nbsp;
                                    <Form.Check.Label
                                        style={{color: 'blue'}}
                                    >
                                        Edit Profile
                                    </Form.Check.Label>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Row>
                    <br />
                    {isEditing ? submitButton() : ''}
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
}