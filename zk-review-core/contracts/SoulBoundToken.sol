// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Soulbound is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;
    uint256 private _tokenIdCounter;

    mapping(address => uint256[]) ownerTokenIds;
    string internal rewardImage;

    constructor() ERC721("SoulBound", "SBT") {
        rewardImage = 'https://review-rewards.infura-ipfs.io/ipfs/Qmc8dJ1o7B7kZeuhH8DshyU55FZ1JU7PjJ6ShdwuKzEqqV';
    }

    /**
        The token should not be transferable once assigned to the reviewer
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override
    {
        require(from == address(0), "Token not transferable");
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
    function safeMint(address to, string memory journalString) public {
        _tokenIdCounter += 1;
        _safeMint(to, _tokenIdCounter);
        ownerTokenIds[to].push(_tokenIdCounter);

        string memory tURI = generateTokenURI(
            _tokenIdCounter,
            journalString
        );
        _setTokenURI(_tokenIdCounter, tURI);
        
    }

    function bulkMint(address[] memory _tos, string memory journalString, address journal) public {
        require(journal == msg.sender, "Only journal can mint the token.");

        unchecked {
            for(uint256 i=0; i< _tos.length; i++) {
                _tokenIdCounter += 1;
                _safeMint(_tos[i], _tokenIdCounter);
                ownerTokenIds[_tos[i]].push(_tokenIdCounter);

                string memory tURI = generateTokenURI(
                    _tokenIdCounter,
                    journalString
                );
                _setTokenURI(_tokenIdCounter, tURI);
            }
        }
    }

    function bulkMintFromCron(address[] memory _tos, string memory journalString) public onlyOwner {
        unchecked {
            for(uint256 i=0; i< _tos.length; i++) {
                _tokenIdCounter += 1;
                _safeMint(_tos[i], _tokenIdCounter);
                ownerTokenIds[_tos[i]].push(_tokenIdCounter);

                string memory tURI = generateTokenURI(
                    _tokenIdCounter,
                    journalString
                );
                _setTokenURI(_tokenIdCounter, tURI);
            }
        }
    }

    function generateTokenURI(
        uint256 tokenId,
        string memory journalString
    ) private view returns (string memory) {
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
                '"image": "', rewardImage, '",',
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

    function getTokensOwnedByAddress(address _account) public view returns(uint256[] memory) {
        uint256[] memory tokenIds = ownerTokenIds[_account];
        return tokenIds;
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn the token.");
        // require(ownerOf(tokenId) == _msgSender(), "Only owner can burn the token.");
        _burn(tokenId);
    }

    // Allow only owner to burn the token
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function updateTokenImage(string memory image) public onlyOwner {
        rewardImage = image;
    }

    function getRewardImage() public view returns (string memory) {
        return rewardImage;
    }

    // string public versionRecipient = "3.0.0-beta.6";
}