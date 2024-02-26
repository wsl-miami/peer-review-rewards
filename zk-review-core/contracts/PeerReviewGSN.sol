pragma solidity ^0.8.4;
// SPDX-License-Identifier: MIT

import "@opengsn/contracts/src/ERC2771Recipient.sol";
// import "./IERC20.sol";
// import "./ReentrancyGuard.sol";

contract PeerReviewGSN is ERC2771Recipient {
    mapping(uint256 => bool) public manuscriptExists;

    struct ManuscriptReview {
        uint256 manuscriptId;
        address journal;
        bytes32 manuscript_link;
        bytes32[] review_links;
        // address author;
        // address[] reviewers;
        // uint256 rewardAmount;
        bool open;
        bool accepted;
    }

    ManuscriptReview[] public manuscripts;
    uint256 public reviewedGroupId = 1;

    // mapping(address => uint256[]) authorManuscriptIds;
    mapping(address => uint256[]) reviewerManuscriptIds;
    mapping(address => uint256[]) journalManuscriptIds;
    mapping(bytes32 => uint256[]) articleManuscriptIds;


    event ManuscriptSubmitted(ManuscriptReview manuscript);
    event ManuscriptReviewOpened(ManuscriptReview manuscript);
    event ManuscriptReviewClosed(ManuscriptReview manuscript);
    event ManuscriptReviewClaimed(ManuscriptReview manuscript);
    event ReviewClosed(ManuscriptReview manuscript);

    uint256 public counter;
    address public lastCaller;
    event Increment(address indexed by, uint256 to);

    constructor(address _forwarder) {
        _setTrustedForwarder(_forwarder);
    }

    function increment() public {
        counter++;
        lastCaller = _msgSender();
        emit Increment(_msgSender(), counter);
    }

    function getManuscript(uint256 _manuscriptId) public view returns(ManuscriptReview memory) {
        return manuscripts[_manuscriptId];
    }

    function allManuscripts() public view returns(ManuscriptReview[] memory) {
        return manuscripts;
    }

        /*
     @notice Calculates all manuscripts existing for an author's address
     @param _account is the address of the account you wish to find the bounties for
     @return ManuscriptReview[] list of manuscripts for the account
    */
    // function getManuscriptsByAuthor(address _account) public view returns(ManuscriptReview[] memory) {
    //     // Create lists
    //     uint256[] memory ids = authorManuscriptIds[_account];
    //     ManuscriptReview[] memory ret = new ManuscriptReview[](ids.length);

    //     // Loops through the manuscripts to create return lists
    //     for(uint i = 0; i < ids.length; i++) {
    //         ret[i] = manuscripts[ids[i]];
    //     }

    //     // Returns the list of manuscripts and claim statuses
    //     return ret;
    // }

    function getManuscriptsByArticleHash(bytes32 _manuscript_hash) public view returns(ManuscriptReview[] memory) {
        // Create lists
        uint256[] memory ids = articleManuscriptIds[_manuscript_hash];
        ManuscriptReview[] memory ret = new ManuscriptReview[](ids.length);

        // Loops through the manuscripts to create return lists
        for(uint i = 0; i < ids.length; i++) {
            ret[i] = manuscripts[ids[i]];
        }

        // Returns the list of manuscripts and claim statuses
        return ret;
    }

    /*
     @notice Calculates all  manuscripts existing for a reviewer's address
     @param _account is the address of the account you wish to find the manuscripts for
     @return ManuscriptReview[] list of  manuscripts for the account, bool[] list of bounty statuses
    */
    function getManuscriptsByReviewer(address _account) public view returns(ManuscriptReview[] memory) {
        uint256[] memory ids = reviewerManuscriptIds[_account];
        ManuscriptReview[] memory ret = new ManuscriptReview[](ids.length);
        // bool[] memory claim_status = new bool[](ids.length);
        
        for(uint i = 0; i < ids.length; i++) {
            ret[i] = manuscripts[ids[i]];
            // claim_status[i] = hasClaimed[ids[i]][_account];
        }
        
        // return (ret, claim_status);
        return ret;
    }

    /*
     @notice Calculates all manuscripts existing for an editor's address
     @param _account is the address of the account you wish to find the manuscripts for
     @return ManuscriptReview[] list of manuscripts for the account
    */
    function getManuscriptsByJournal(address _account) public view returns(ManuscriptReview[] memory) {
        uint256[] memory ids = journalManuscriptIds[_account];
        ManuscriptReview[] memory ret = new ManuscriptReview[](ids.length);
        
        for(uint i = 0; i < ids.length; i++) {
            ret[i] = manuscripts[ids[i]];
        }
        
        return ret;
    }

    function submitManuscript(address _journal, bytes32 _manuscriptHash) public returns(ManuscriptReview memory) {
        // require(manuscriptExists[_manuscriptHash], "Manuscript does not exist");

        ManuscriptReview memory manuscript;

        // Increment manuscript id based on present number of manuscripts submitted for review
        manuscript.manuscriptId = manuscripts.length;
        // manuscript.token = _token;

        // Use _msgSender instead of msg.sender for GSN
        // manuscript.author = _msgSender();
        manuscript.journal = _journal;
        manuscript.manuscript_link = _manuscriptHash;
        manuscript.open = true;

        manuscripts.push(manuscript);

        // authorManuscriptIds[_msgSender()].push(manuscript.manuscriptId);
        articleManuscriptIds[_manuscriptHash].push(manuscript.manuscriptId);

        journalManuscriptIds[_journal].push(manuscript.manuscriptId);

        emit ManuscriptSubmitted(manuscript);
        
        return manuscript;
    }

    function closeReview(uint256 _manuscriptId, bool accepted) public returns(ManuscriptReview memory) {
        ManuscriptReview memory manuscript = manuscripts[_manuscriptId];
        manuscripts[_manuscriptId].accepted = accepted;
        manuscripts[_manuscriptId].open = false;

        emit ReviewClosed(manuscripts[_manuscriptId]);
        return manuscripts[_manuscriptId];
    }

    // function assignReviewers(uint256 _manuscriptId, address[] memory reviewerAddresses, uint256 _rewardAmount) public returns(ManuscriptReview memory) {
    //     // Logic to assign reiewers here
    //     ManuscriptReview memory manuscript = manuscripts[_manuscriptId];
    //     manuscripts[_manuscriptId].rewardAmount = _rewardAmount; // Allow journal to assign specific reward amount later
    //     manuscripts[_manuscriptId].reviewers = reviewerAddresses;
    //     emit ManuscriptReviewOpened(manuscript);
    //     return manuscript;

    // }

    function submitReview(uint256 _manuscriptId, uint256 _journalId, bytes32 _ipfsHash) public returns(ManuscriptReview memory){
        // Logic to submit review here
        ManuscriptReview memory manuscript = manuscripts[_manuscriptId];

        // Generally done off-chain from UI
        // generateProof();
        
    }

    string public versionRecipient = "3.0.0-beta.6";
}