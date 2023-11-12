// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@opengsn/contracts/src/ERC2771Recipient.sol";

import "./IERC20.sol";
import "./ReentrancyGuard.sol";
import "./ISemaphore.sol";


/*
submitFile(file)
    uploadToIPFS(file) -> ipfsHash
    submitManuscript(uint256 journalId, bytes32 ipfsHash)

downloadFile(bytes32 ipfsHash)
assignReviewers(uint256 manuscriptId, address[] memory reviewerAddresses)
    Bid tokenAmount for the review to PR contract wallet

downloadFile(bytes32 ipfsHash)
submitFile(file)
    uploadToIPFS(file) -> ipfsHash
    submitReview(uint256 manuscriptId, uint256 journalId, bytes32 ipfsHash)
        generateProof(bytes 32 ipfsHash, x, pp, uint256 journalId) -> returns p which is stored off-chain

(reviewer logs in with public address)
claimReputation()
    If p exists
        verifyProof(p, vp, x)
        If proof verified
            distributeRewardToken(reviewerShare)
                For now let's just assume that the reward token will be equally distributed amongst all the reviewers
*/

contract PeerReviewContract is ERC2771Recipient, ReentrancyGuard {

    ISemaphore public semaphore;

    mapping(uint256 => bool) public manuscriptExists;

    struct ManuscriptReview {
        uint256 manuscriptId;
        address journal;
        bytes32 manuscript_link;
        address token;
        bytes32[] review_links;
        address author;
        address[] reviewers;
        uint256 rewardAmount;
        bool openForReview;
        bool accepted;
    }

    ManuscriptReview[] public manuscripts;
    uint256 public reviewedGroupId = 1;



    mapping(address => uint256[]) authorManuscriptIds;
    mapping(address => uint256[]) reviewerManuscriptIds;
    mapping(address => uint256[]) journalManuscriptIds;


    event ManuscriptSubmitted(ManuscriptReview manuscript);
    event ManuscriptReviewOpened(ManuscriptReview manuscript);
    event ManuscriptReviewClosed(ManuscriptReview manuscript);
    event ManuscriptReviewClaimed(ManuscriptReview manuscript);

    // constructor(address semaphoreAddress, address _forwarder) {
    constructor(string memory initMsg) {
    

        // address semaphoreAddress = 0xf8d4B594B74b557650515Dd4f4a00D4061074d43;
        // address _forwarder = 0xE8172A9bf53001d2796825AeC32B68e21FDBb869;

        // semaphore = ISemaphore(semaphoreAddress);

        // semaphore.createGroup(reviewedGroupId, 20, address(this));

        // _setTrustedForwarder(_forwarder);

    }

    function getManuscript(uint256 _manuscriptId) public view returns(ManuscriptReview memory) {
        return manuscripts[_manuscriptId];
    }

    function submitManuscript(address _token, address _journal, bytes32 _manuscriptHash) public returns(ManuscriptReview memory) {
        // require(manuscriptExists[_manuscriptHash], "Manuscript does not exist");

        ManuscriptReview memory manuscript;

        // Increment manuscript id based on present number of manuscripts submitted for review
        manuscript.manuscriptId = manuscripts.length;
        manuscript.token = _token;

        // Use _msgSender instead of msg.sender for GSN
        manuscript.author = _msgSender();
        manuscript.journal = _journal;
        manuscript.manuscript_link = _manuscriptHash;
        manuscript.openForReview = false;

        manuscripts.push(manuscript);

        authorManuscriptIds[_msgSender()].push(manuscript.manuscriptId);
        journalManuscriptIds[_journal].push(manuscript.manuscriptId);

        emit ManuscriptSubmitted(manuscript);
        
        return manuscript;
    }

    function assignReviewers(uint256 _manuscriptId, address[] memory reviewerAddresses, uint256 _rewardAmount) public returns(ManuscriptReview memory) {
        // Logic to assign reiewers here
        ManuscriptReview memory manuscript = manuscripts[_manuscriptId];
        manuscript.rewardAmount = _rewardAmount; // Allow journal to assign specific reward amount later
        manuscripts[_manuscriptId] = manuscript;
        emit ManuscriptReviewOpened(manuscript);
        return manuscript;

    }

    function submitReview(uint256 _manuscriptId, uint256 _journalId, bytes32 _ipfsHash) public returns(ManuscriptReview memory){
        // Logic to submit review here
        ManuscriptReview memory manuscript = manuscripts[_manuscriptId];

        // Generally done off-chain from UI
        // generateProof();
        
    }

    function claimReputation(bytes32 signal, uint256 merkleTreeRoot, uint256 nullifierHash, uint256[8] calldata proof) external {
        // bool verified = semaphore.verifyProof(groupId, merkleTreeRoot, signal, nullifierHash, reviewedGroupId, proof);
        bool verified = true;
        distributeRewardToken(verified);
    }

    function distributeRewardToken(bool verified) public returns(ManuscriptReview memory) {
        // Logic to distribute token here
    }

    function submitFile(bytes memory file) external {
        require(file.length > 0, "File cannot be empty");

        // Upload file to IPFS and get the IPFS hash
        bytes32 ipfsHash = uploadToIPFS(file);

        // uint256 manuscriptId = manuscriptIds.current();
        // manuscriptIds.increment();

        // manuscriptIPFSHashes[manuscriptId] = ipfsHash;
        // manuscriptExists[manuscriptId] = true;
    }

    function uploadToIPFS(bytes memory file) internal returns (bytes32) {
        bytes32 ipfsHash = keccak256(file);
        return ipfsHash;
    }

    // Other functions for reviewers, proofs, etc.
}

// Define your Paymaster contract and any other necessary contracts here

