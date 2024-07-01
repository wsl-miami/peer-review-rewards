// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// @ToDo: Allow soulbound token to be burnt and reassigned by the owner
// Ask chatgpt to optimize the contract

/**
    @title Soulbound Tokens
    @dev A non-transferable ERC721 token contract for rewarding reviewers.
 */
contract Soulbound is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    // Counter for token IDs
    uint256 private _tokenIdCounter;

    // Mapping to store token IDs owned by an address
    mapping(address => uint256[]) ownerTokenIds;

    // Image for the token
    string internal _rewardImage;

    // Constructor to initialize the contract with default token name, symbol, and image
    constructor() ERC721("SoulBound", "SBT") {
        _rewardImage = 'https://review-rewards.infura-ipfs.io/ipfs/Qmc8dJ1o7B7kZeuhH8DshyU55FZ1JU7PjJ6ShdwuKzEqqV';
    }

    /**
        @dev Overriding the beforeTokenTransfer function to restrict token transfer
        @param from Address from which the token is being transferred
        @param to Address to which the token is being transferred
        @param tokenId Token ID being transferred
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override
    {
        require(from == address(0), "Token can not be transferred to another address");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // function safeMint(address to) public onlyOwner {
    //     _tokenIdCounter += 1;
    //     _safeMint(to, _tokenIdCounter);
    // }

    // Changing safeMint function such that token can be assigned by cron job rather than just contract owner
    // Later change this such that token can only be issued by the contract owner
    // And then it can be burned/minted/claimed by the address to whom it is issued
    // In contructor, keep list of journals (who are allowed to assign tokens), it can be updated only by owner
    /**
        @dev Function to mint a token and assign it to the given address
        @param to Address to which the token is being assigned
        @param journalString The name of the journal associated with the token
     */
    function safeMint(address to, string memory journalString) public {
        _tokenIdCounter += 1;
        _safeMint(to, _tokenIdCounter);
        ownerTokenIds[to].push(_tokenIdCounter);

        string memory tURI = _generateTokenURI(_tokenIdCounter, journalString);
        _setTokenURI(_tokenIdCounter, tURI);
        
    }

    /**
        @dev Function to mint multiple tokens and assign them to the given addresses.
        Tokens are minted in one batch per journal.
        @param _tos Array of addresses to which the tokens are being assigned
        @param journalString The name of the journal associated with the tokens    
     */
    function bulkMintFromCron(address[] memory _tos, string memory journalString) public onlyOwner {
        require(_tos.length > 0, "No tokens to mint");
        uint256 currentTokenId = _tokenIdCounter;
        unchecked {
            for(uint256 i=0; i< _tos.length; i++) {
                currentTokenId += 1;
                _safeMint(_tos[i], currentTokenId);
                ownerTokenIds[_tos[i]].push(currentTokenId);

                string memory tURI = _generateTokenURI(
                    currentTokenId,
                    journalString
                );
                _setTokenURI(currentTokenId, tURI);
            }
        }
        _tokenIdCounter = currentTokenId;
    }

    /**
        @dev Generates the token URI for a given token ID and journal string.
        @param tokenId The ID of the token
        @param journalString The name of the journal associated with the token.
        @return tokenURi The generated token URI
     */
    function _generateTokenURI(uint256 tokenId, string memory journalString) 
        private 
        view 
        returns (string memory) {
        bytes memory attributesPart = abi.encodePacked(
            '{',
                '"trait type": "Journal",',
                '"value": "', journalString, '"',
            '},',
            '{',
                '"trait type": "Contribution",',
                '"value": "', 'Reviewer', '"',
            '},',
            '{',
                '"trait type": "No of reviews",',
                '"value": "', '1', '"',
            '}'
        );

        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Reward Token #', tokenId.toString(), '",',
                '"image": "', _rewardImage, '",',
                '"description": "A token of recognition awarded to the reviewer for their contribution by reviewing manuscripts submitted to the journal",',
                '"attributes": [',
                    attributesPart,
                ']',
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    /**
        @dev Retrieves the tokens owned by a given address.
        @param _account Address for which the token IDs are being fetched
        @return tokenIds Array of token IDs owned by the address
     */
    function getTokensOwnedByAddress(address _account) public view returns(uint256[] memory) {
        uint256[] memory tokenIds = ownerTokenIds[_account];
        return tokenIds;
    }

    /**
        @dev Burns a token owned by the caller. Restricts burning to token owner.
        @param tokenId Token ID to be burned
     */
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn the token.");
        _burn(tokenId);
    }

    // Allow only owner to burn the token
    /**
        @dev Burns a token.
        @param tokenId Token ID to be burned
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
        @dev Retrieves the token URI for a given token ID.
        @param tokenId Token ID for which the URI is being fetched
        @return tokenURI The URI of the token
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
        @dev Updates the image associated with soulbound tokens.
        @param image The new image URL
     */
    function updateTokenImage(string memory image) public onlyOwner {
        _rewardImage = image;
    }

    /**
        @dev Retrieves the image associated with soulbound tokens.
        @return image The image URL
     */
    function getRewardImage() public view returns (string memory) {
        return _rewardImage;
    }
}