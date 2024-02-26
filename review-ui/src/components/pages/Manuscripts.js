// import "../../style/BountyCardStyle.css";
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
import { SiCodereview } from "react-icons/si";

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
    const [show, setShow] = useState(false);
    const [ipfs32, setIpfs32] = useState('');
    const [reviewers, setReviewers] = useState([]);
    const handleClose = () => {
        setShow(false);
        setIpfs32('');
    }
    const handleShow = (link) => {
        setIpfs32(link);
        console.log(ipfs32);
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
            PRContract.methods.cancelBounty(
                bounty.id
            ).send({ from: account })
                .on('confirmation', (receipt) => {
                    window.location.reload();
                });
        } else if (type === 'editor' && bounty.blockManuscriptId) {
            PRContract.methods.closeReview(
                bounty.blockManuscriptId, passedOrFailed == 'Publish'
            ).send({from: account, gas: 210000})
            .on('confirmation', (receipt) => {
                console.log("done!");
                window.location.reload();
            });
            
            // PRContract.methods.closeBounty(
            //     bounty.id, passedOrFailed == 'Publish'
            // ).send({ from: account })
            //     .on('confirmation', (receipt) => {
            //         window.location.reload();
            //     });;
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

    const editorPassOrFail = () => {
        if (type != 'editor') {
            return '';
        }

        return (
            <>
                <Row>
                    <Form.Group as={Col}>
                        <Row>
                            <Col>
                                <Form.Label>Publish or Deny?</Form.Label>
                            </Col>
                            <Col>
                                <Form.Select
                                    type="text"
                                    onChange={e => setPassedOrFailed(e.target.value)}
                                    required
                                >
                                    <option>Publish</option>
                                    <option>Deny</option>
                                </Form.Select>
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
                    <Modal.Title>Confirm Article {type === 'author' ? 'Cancellation' : 'Closure'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <h6>Are you sure want to {type === 'author' ? 'cancel' : 'close'} the article with id: {bounty.blockManuscriptId}?</h6>
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
                        {editorPassOrFail()}
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
        if (bounty.review_links.length > 0 || !bounty.open) {
            return true;
        }
        else {
            return false;
        }
    }
    const authorDisabledString = () => {
        if (!bounty.open) {
            return 'Article is closed';
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
        if (!bounty.open || bounty.review_links.length > 0) {
            return true;
        }
        else {
            return
        }
    }
    const isEditorClosedDisabled = () => {
        if (!bounty.open || bounty.review_links.length < bounty.reviewers_count) {
            return true;
        }
        else {
            return false;
        }
    }
    const editorDisabledString = () => {
        if (!bounty.open) {
            return 'Article is closed.';
        }
        else if (bounty.review_links.length > 0) {
            return 'Reviews have been submitted.';
        }
    }
    const editorClosedDisabledString = () => {
        if (!bounty.open) {
            return 'Article is closed.';
        }
        else if (bounty.review_links.length < bounty.reviewers_count) {
            return 'Reviewers are still working on their reviews.';
        }
    }
    const editorContent = () => {
        if (type !== 'editor') {
            return ('');
        }
        return (
            <>
                <Col md={{ span: 2 }}>
                    <br /><br />
                    <br />
                    <OverlayTrigger overlay={isEditorDisabled() ? <Tooltip id="tooltip-disabled">{editorDisabledString()}</Tooltip> : <div></div>}>
                        <Row class='text-right'>
                            <Button
                                disabled={isEditorDisabled()}
                                onClick={handleShowOpenReviewer}
                                variant='outline-primary'
                            >
                                Add Reviewers
                            </Button>
                        </Row>
                    </OverlayTrigger>
                    <br />

                    <Row>
                        <DropdownButton
                            as={ButtonGroup}
                            title="View Reviewers"
                            style={{}}
                        >
                            {
                                    reviewers.map((reviewer, index) => {
                                        return (
                                            <Dropdown.Item 
                                                key={index}
                                            >
                                                {reviewer.REVIEWER_HASH}
                                            </Dropdown.Item>
                                        )
                                    })

                                }
                        </DropdownButton>
                    </Row>
                </Col>

                <Col md={{ span: 2 }}>
                    <OverlayTrigger overlay={isEditorClosedDisabled() ? <Tooltip id="tooltip-disabled">{editorClosedDisabledString()}</Tooltip> : <div></div>}>
                        <Row class='text-right' className="butt">
                            <Button
                                disabled={isEditorClosedDisabled()}
                                onClick={handleOpenConfirm}
                                variant='outline-success'
                            >
                                Close Article
                            </Button>
                        </Row>
                    </OverlayTrigger>

                </Col>
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
        )
    }
    // const userHasReviewed = () => {
    //     var bountyList = type === 'reviewer' ? bounties[0] : bounties;
    //     if (bountyList.length === 0 || bounties === null) {
    //         return <NoBounties type={type} />
    //     } 
    // }
    const reviewerContent = () => {
        if (type !== 'reviewer') {
            return ('');
        }
        return (
            <>
                <Col md={{ span: 2 }}>
                    <Row class='text-right'>
                        <Button
                            onClick={handleShowOpenReview}
                            variant='outline-primary'
                        >
                            Submit Review
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
                    </Row>
                </Col>
            </>
        )
    }

    const convertBytes32toIpfsHash = (bytes32) => {
        var hashHex = "1220" + bytes32.slice(2);
        var hashBytes = Buffer.from(hashHex, 'hex');
        var hashStr = bs58.encode(hashBytes);
        return hashStr;
    }

    const convertTimestampToDate = (date) => {
        const dateFormat = new Date(date);
        return `${dateFormat.getMonth() + 1}/${dateFormat.getDate()}/${dateFormat.getFullYear()}`;
    }

    const checkState = () => {
        if (bounty && bounty.review_links && bounty.review_links.length == 0 && !bounty.open) {
            return (
                <>
                    {/* <span className="close">Cancelled</span> */}
                    <span className="badge rounded-pill bg-warning">Cancelled</span>

                </>
            );
        }
        if (bounty.open) {
            return (
                <>
                    {/* <span className="open">Open</span> */}
                    <span className="badge rounded-pill bg-primary">Open</span>
                </>
            );
        }
        if (bounty.accepted) {
            return (
                <>
                    {/* <span className="passed">Accepted</span> */}
                    <span className="badge rounded-pill bg-success">Accepted</span>

                </>
            );
        }
        else {
            return (
                <>
                    {/* <span className="failed">Failed</span> */}
                    <span className="badge rounded-pill bg-danger">Failed</span>
                </>
            );
        }
    }
    return (
        <>
            <td>
                {bounty.submission_date ? convertTimestampToDate(bounty.submission_date) : "N/A"}
            </td>
            <td>
                <Ratio aspectRatio="16x9">
                    <IframeResizer
                        // src={bounty ? "https://review-rewards.infura-ipfs.io/ipfs/" + convertBytes32toIpfsHash(bounty.manuscript_link) : ''}
                        src={bounty ? `${process.env.REACT_APP_PINATA_DEDICATED_GATEWAY_URL}/ipfs/${bounty.manuscript_link}?pinataGatewayToken=${process.env.REACT_APP_PINATA_OPEN_ACCESS_GATEWAY_KEY}` : ''}
                        heightCalculationMethod="lowestElement"
                        style={{ width: '1px', minWidth: '100%' }}
                    />
                </Ratio>
            </td>
            <td>
                <OverlayTrigger overlay= {<Tooltip id="tooltip-disabled">{`${bounty.journal}`}</Tooltip>}>
                    <span>
                        {bounty && bounty.journal && `${bounty.journal.substring(0, 5)}...${bounty.journal.substring(bounty.journal.length - 4, bounty.journal.length)}`}
                    </span>
                </OverlayTrigger>
            </td>
            {type == 'editor' &&
                <td> 
                    {reviewers.map((reviewer, index) => {
                        return (
                            <OverlayTrigger overlay= {<Tooltip id="tooltip-disabled">{`${reviewer.REVIEWER_HASH}`}</Tooltip>}>
                                <span key={index} className="badge bg-light text-dark clickable-badges">
                                    {reviewer && reviewer.REVIEWER_HASH && `${reviewer.REVIEWER_HASH.substring(0, 5)}...${reviewer.REVIEWER_HASH.substring(reviewer.REVIEWER_HASH.length - 4, reviewer.REVIEWER_HASH.length)}`}
                                </span>
                            </OverlayTrigger>
                        )
                    })}
               </td>
            //         <DropdownButton
            //             as={ButtonGroup}
            //             title="View Reviewers"
            //             style={{}}
            //         >
            //             {
            //                     reviewers.map((reviewer, index) => {
            //                         return (
            //                             <Dropdown.Item 
            //                                 key={index}
            //                             >
            //                                 {reviewer.REVIEWER_HASH}
            //                             </Dropdown.Item>
            //                         )
            //                     })

            //                 }
            //         </DropdownButton>
            }
            <td>
                {
                    bounty && bounty.review_links && bounty.review_links.length > 0 && bounty.review_links.map((link, index) => {
                        return (
                                <span className="badge rounded-pill bg-info text-dark clickable-badges" onClick={() => handleShow(link)}>Review {index + 1}</span>
                        )
                    })

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
                               <MdCancel />Cancel Submission
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
                                    Close Manuscript
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
                        // src={bounty ? "https://review-rewards.infura-ipfs.io/ipfs/" + convertBytes32toIpfsHash(ipfs32) : ''}
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