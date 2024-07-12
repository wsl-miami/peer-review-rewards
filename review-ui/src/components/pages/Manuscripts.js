import "../../style/ModalStyle.css";
import React, { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Ratio from 'react-bootstrap/Ratio';
import IframeResizer from 'iframe-resizer-react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import AddReviewersModal from "../modals/AddReviewersModal";
import SubmitReviewModal from '../modals/submitReviewModal';
import { Buffer } from 'buffer';
import bs58 from 'bs58'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { BsFillSendArrowUpFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import STRING_CONSTANTS from '../../constants.js'
const FormData = require('form-data');

export default function Manuscripts({
    account,
    bounty,
    openFilter,
    closedFilter,
    passedFilter,
    failedFilter,
    PRContract,
    type,
    profile
}) {
    const [confirmation, setConfirmation] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [showOpenReviewer, setShowOpenReviewer] = useState(false);
    const [showOpenReview, setShowOpenReview] = useState(false);
    const [passedOrFailed, setPassedOrFailed] = useState("Publish");
    const [editorDecision, setEditorDecision] = useState(STRING_CONSTANTS.STATUS.ACCEPTED.value);
    const [editorNote, setEditorNote] = useState(null);
    const [show, setShow] = useState(false);
    const [ipfs32, setIpfs32] = useState('');
    const [reviewers, setReviewers] = useState([]);
    const handleClose = () => {
        setShow(false);
        setIpfs32('');
    }
    const handleShow = (link) => {
        setIpfs32(link);
        setShow(true);
    }

    useEffect(() => {
        const fetchReviewers = async() => {
            const reviewers = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/get-assigned-reviewers`,
                method: "GET",
                params: {article_hash: bounty.manuscript_link},
            });

            if (reviewers && reviewers.data && reviewers.data.reviewers) {
                setReviewers(reviewers.data.reviewers);
            }
        }
        if (bounty && bounty.manuscript_link) {
            fetchReviewers();
        }
    },[bounty]);

    const isVisible = () => {
        var ret = true;
        if (passedFilter) {
            ret = ret && bounty.accepted;
        } else if (closedFilter) {
            ret = ret && !bounty.open;
        } else if (openFilter) {
            ret = ret && bounty.open;
        } else if (failedFilter) {
            ret = ret && !bounty.accepted;
        }
        return (ret);
    }

    const handleOpenConfirm = () => {
        setIsConfirming(true);
    }

    const handleCloseConfirm = () => {
        setIsConfirming(false);
    }

    const handleConfirm = async () => {
        var msg = confirmation.toLowerCase()
        if (msg !== 'yes') {
            handleCloseConfirm();
            alert('you did not enter "yes", cannot cancel article.');
            return;
        }
        if (type === 'author') {
            const response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/update-decision-status`,
                method: "POST",
                data: {
                    decision_status: STRING_CONSTANTS.STATUS.WITHDRAWN.value,
                    manuscript_hash: bounty.manuscript_link
                },
            });

            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } else if (type === 'editor') {
            let editor_note = editorNote;
            let decision_status = editorDecision;
            let pinataRes = null;
    
            try {
                let formData;
                const authorization = `Bearer ${process.env.REACT_APP_PINATA_API_KEY}`;
                if (editor_note && editor_note != null) {
                    formData = new FormData();
                    formData.append('file', editor_note);
            
                    const pinataOptions = JSON.stringify({
                        cidVersion: 0,
                    });
            
                    formData.append('pinataOptions', pinataOptions);
                    
                    pinataRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData,
                    {
                        headers: {
                            authorization
                        }
                    });                   
                }

                const response = await axios({
                    url: `${process.env.REACT_APP_API_URL}/api/update-decision-status`,
                    method: "POST",
                    data: {
                        decision_status: decision_status,
                        manuscript_hash: bounty.manuscript_link,
                        editor_note: pinataRes.data.IpfsHash
                    },
                });

                if (response.data && response.data.success) {
                    window.location.reload();
                } else {
                    alert('Something went wrong. Please try again.');
                }
            } catch (err) {
                alert('Something went wrong. Please try again.');
                console.log("Error while uploading file: ", err);
            }
        }

        setConfirmation('');
        handleCloseConfirm();
    }

    const handleShowOpenReviewer = () => {
        setShowOpenReviewer(true);
    }

    const handleCloseOpenReviewer = () => {
        setShowOpenReviewer(false);
    }

    const handleShowOpenReview = () => {
        if (profile !== null) {
            alert("If you submit a review without changing metamask accounts it will not be private!" +
                "There is a profile associated with the connected ethereum account.")
        }
        setShowOpenReview(true);
    }

    const handleCloseOpenReview = () => {
        setShowOpenReview(false);
    }

    const editorDecisionOptions = () => {
        if (type != 'editor') {
            return '';
        }

        return (
            <>
                <Row>
                    <Form.Group as={Col}>
                        <Row>
                            <Col>
                                <Form.Label>Accept for publication or Reject</Form.Label>
                            </Col>
                            <Col>
                                <Form.Select
                                    onChange={e => setEditorDecision(e.target.value)}
                                    required
                                >
                                    <option value={STRING_CONSTANTS.STATUS.ACCEPTED.value}>{STRING_CONSTANTS.DECISION.ACCEPT}</option>
                                    <option value={STRING_CONSTANTS.STATUS.REJECTED.value}>{STRING_CONSTANTS.DECISION.REJECT}</option>
                                    <option value={STRING_CONSTANTS.STATUS.NEEDS_REVISION.value}>{STRING_CONSTANTS.DECISION.REVISE}</option>
                                    <option value={STRING_CONSTANTS.STATUS.NEEDS_REVISION.value}>{STRING_CONSTANTS.DECISION.RESUBMIT}</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Row>
                            <Col>
                                <Form.Label>Notes: </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    type="file"
                                    onChange={e => setEditorNote(e.target.files[0])}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
            </>
        )
    }

    const confirmModal = () => {
        return (
            <Modal
                show={isConfirming}
                onHide={handleCloseConfirm}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Manuscript {type === 'author' ? 'Withdrawal' : 'Decision'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <h6>Are you sure want to {type === 'author' ? 'withdraw' : 'submit a decision for'} the manuscript?</h6>
                        </Col>
                    </Row>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Row>
                            <Form.Group as={Col}>
                                <Row>
                                    <Col>
                                        <Form.Label>Enter 'yes' to confirm: </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type='text'
                                            value={confirmation}
                                            onChange={e => setConfirmation(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <br />
                        {editorDecisionOptions()}
                        <br />
                        <Row className='text-center'>
                            <Col>
                                <Button
                                    size='lg'
                                    variant='danger'
                                    onClick={handleConfirm}
                                >
                                    Confirm
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }

    const isAuthorDisabled = () => {
        if (bounty.decision_status != STRING_CONSTANTS.STATUS.PENDING.value) {
            return true;
        }
        else {
            return false;
        }
    }
    const authorDisabledString = () => {
        if (bounty.decision_status != STRING_CONSTANTS.STATUS.PENDING.value) {
            return 'Decision has already been made';
        }
        else if (bounty.review_links.length > 0) {
            return 'Reviews have been submitted';
        }
    }

    const authorContent = () => {
        if (type !== 'author') {
            return ('');
        }
        return (
            <Col md={{ span: 2 }}>
                <OverlayTrigger overlay={isAuthorDisabled() ? <Tooltip id="tooltip-disabled">{authorDisabledString()}</Tooltip> : <div></div>}>
                    <Row class='text-right'>
                        <Button
                            disabled={isAuthorDisabled()}
                            onClick={handleOpenConfirm}
                            variant='outline-danger'
                        >
                            Cancel Article
                        </Button>
                    </Row>
                </OverlayTrigger>
            </Col>
        );
    }
    const isEditorDisabled = () => {
        if (bounty.decision_status != STRING_CONSTANTS.STATUS.PENDING.value) {

            return true;
        }
        else {
            return
        }
    }
    const isEditorClosedDisabled = () => {
        if (bounty.decision_status != STRING_CONSTANTS.STATUS.PENDING.value) {
            return true;
        }
        else {
            return false;
        }
    }
    const editorDisabledString = () => {
        if (bounty.decision_status == STRING_CONSTANTS.STATUS.WITHDRAWN.value) {
            return 'Author has withdrawn the manuscript';
        }else if (bounty.decision_status != STRING_CONSTANTS.STATUS.PENDING.value) {
            return 'Decision has already been made.';
        }
        else if (bounty.review_links.length > 0) {
            return 'Reviews have been submitted.';
        }
    }
    const editorClosedDisabledString = () => {
        if (bounty.decision_status == STRING_CONSTANTS.STATUS.WITHDRAWN.value) {
            return 'Author has withdrawn the manuscript';
        }else if (bounty.decision_status != STRING_CONSTANTS.STATUS.PENDING.value) {
            return 'Decision has already been made.';
        }
    }

    const convertTimestampToDate = (date) => {
        const dateFormat = new Date(date);
        return `${dateFormat.getMonth() + 1}/${dateFormat.getDate()}/${dateFormat.getFullYear()}`;
    }

    const checkState = () => {
        let stateText = '';
        let classText = 'badge rounded-pill ';
        switch (Number(bounty.decision_status)) {
            case STRING_CONSTANTS.STATUS.ACCEPTED.value:
                stateText = STRING_CONSTANTS.STATUS.ACCEPTED.text;
                classText += 'bg-success';
                break;
            case STRING_CONSTANTS.STATUS.REJECTED.value:
                stateText = STRING_CONSTANTS.STATUS.REJECTED.text;
                classText += 'bg-danger';
                break;
            case STRING_CONSTANTS.STATUS.WITHDRAWN.value:
                stateText = STRING_CONSTANTS.STATUS.WITHDRAWN.text;
                classText += 'bg-warning';
                break;
            case STRING_CONSTANTS.STATUS.NEEDS_REVISION.value:
                stateText = STRING_CONSTANTS.STATUS.NEEDS_REVISION.text;
                break;
            case STRING_CONSTANTS.STATUS.PENDING.value:
                stateText = STRING_CONSTANTS.STATUS.PENDING.text;
                classText += 'bg-primary';
                break;
        }

        return (
            <>
                <span className={classText}>{stateText}</span>
            </>
        );
    }
    return (
        <>
            <td>
                {bounty.submission_date ? convertTimestampToDate(bounty.submission_date) : "N/A"}
            </td>
            <td>
                <Ratio aspectRatio="16x9">
                    <IframeResizer
                        src={bounty ? `${process.env.REACT_APP_PINATA_DEDICATED_GATEWAY_URL}/ipfs/${bounty.manuscript_link}?pinataGatewayToken=${process.env.REACT_APP_PINATA_OPEN_ACCESS_GATEWAY_KEY}` : ''}
                        heightCalculationMethod="lowestElement"
                        style={{ width: '1px', minWidth: '100%' }}
                    />
                </Ratio>
            </td>
            <td>
                <OverlayTrigger overlay= {<Tooltip id="tooltip-disabled">{`${bounty.journal}`}</Tooltip>}>
                    <span>
                        {bounty && bounty.journal_name 
                        || bounty && bounty.journal && `${bounty.journal.substring(0, 5)}...${bounty.journal.substring(bounty.journal.length - 4, bounty.journal.length)}`}
                    </span>
                </OverlayTrigger>
            </td>
            {type == 'editor' &&
                <td> 
                    {reviewers.map((reviewer, index) => {
                        return (
                            <OverlayTrigger overlay= {<Tooltip id="tooltip-disabled">{`${reviewer.REVIEWER_HASH}`}</Tooltip>}>
                                <span key={index} className="badge bg-light text-dark clickable-badges">
                                    {reviewer && reviewer.FIRST_NAME && reviewer.LAST_NAME && `${reviewer.FIRST_NAME} ${reviewer.LAST_NAME}` 
                                    || reviewer && reviewer.REVIEWER_HASH && `${reviewer.REVIEWER_HASH.substring(0, 5)}...${reviewer.REVIEWER_HASH.substring(reviewer.REVIEWER_HASH.length - 4, reviewer.REVIEWER_HASH.length)}`}
                                </span>
                            </OverlayTrigger>
                        )
                    })}
               </td>
            }
            <td>
                {
                    bounty && bounty.review_links && bounty.review_links.length > 0 && bounty.review_links.map((link, index) => {
                        return (
                                <span className="badge rounded-pill bg-info text-dark clickable-badges" onClick={() => handleShow(link)}>Review {index + 1}</span>
                        )
                    })

                }
                {
                    bounty && bounty.editor_note && 
                    <span className="badge rounded-pill bg-success clickable-badges" onClick={() => handleShow(bounty.editor_note)}>Editor Note</span>
                }
            </td>

            { type != 'author' &&
                <td>
                    {bounty.review_deadline ? convertTimestampToDate(bounty.review_deadline) : "N/A"}     
                </td>
            }
            <td>
                {checkState()}
            </td>
            <td>
                <Button
                    onClick={() => handleShow(bounty.manuscript_link)}
                    variant='info'
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="View Manuscript"
                    className="action"
                >
                    View Manuscript
                </Button>
            </td>
            <td>

                {type == "author" &&
                    <OverlayTrigger overlay={isAuthorDisabled() ? <Tooltip id="tooltip-disabled">{authorDisabledString()}</Tooltip> : <div></div>}>
                        <span> 
                            <Button
                                disabled={isAuthorDisabled()}
                                onClick={handleOpenConfirm}
                                variant='danger'
                                className="action"
                            >
                               <MdCancel />{ STRING_CONSTANTS.WITHDRAW_ACTION }
                            </Button>
                        </span>
                    </OverlayTrigger>
                }
                {type == "editor" &&
                    <>
                        <OverlayTrigger overlay={isEditorDisabled() ? <Tooltip id="tooltip-disabled">{editorDisabledString()}</Tooltip> : <div></div>}>
                            <span>
                                <Button
                                    disabled={isEditorDisabled()}
                                    onClick={handleShowOpenReviewer}
                                    variant='primary'
                                    className="action"
                                >
                                    Add Reviewers
                                </Button>
                            </span>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={isEditorClosedDisabled() ? <Tooltip id="tooltip-disabled">{editorClosedDisabledString()}</Tooltip> : <div></div>}>
                            <span className="butt">
                                <Button
                                    disabled={isEditorClosedDisabled()}
                                    onClick={handleOpenConfirm}
                                    variant='success'
                                    className="action"
                                >
                                    {STRING_CONSTANTS.DECISION_ACTION}
                                </Button>
                            </span>
                        </OverlayTrigger>

                        <AddReviewersModal
                            showOpenForm={showOpenReviewer}
                            handleCloseOpenForm={handleCloseOpenReviewer}
                            account={account}
                            bountyid={bounty.id}
                            PRContract={PRContract}
                            ipfs32={bounty.manuscript_link}
                            reviewers={reviewers}
                        />
                    </>

                }

                {type == "reviewer" &&
                    <>
                        <Button
                            onClick={handleShowOpenReview}
                            variant='primary'
                            data-toggle="tooltip" 
                            data-placement="bottom" 
                            title="Submit Review"
                            className="action"
                        >
                            <BsFillSendArrowUpFill /> Submit Review
                        </Button>
                        <SubmitReviewModal
                            showOpenForm={showOpenReview}
                            handleCloseOpenForm={handleCloseOpenReview}
                            account={account}
                            bountyid={bounty.id}
                            PRContract={PRContract}
                            ipfs32={bounty.manuscript_link}
                            journal={bounty.journal}
                            prevReviewLinks={bounty.review_links}
                        />
                    </>
                }
            </td>
            <br />
            {isConfirming ? confirmModal() : ''}
            <Modal
                show={show}
                onHide={handleClose}
                centered
                dialogClassName="fileViewer"
            >
                <Modal.Header closeButton>
                    <Modal.Title>File Viewer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <IframeResizer
                        src={bounty ?`${process.env.REACT_APP_PINATA_DEDICATED_GATEWAY_URL}/ipfs/${ipfs32}?pinataGatewayToken=${process.env.REACT_APP_PINATA_OPEN_ACCESS_GATEWAY_KEY}` : ''}

                        aspectRatio="1/1"
                        height="700"
                        style={{ width: '1px', minWidth: '100%' }}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}