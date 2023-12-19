// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Soulbound is ERC721, ERC721URIStorage, Ownable {

    uint256 private _tokenIdCounter;

    constructor() ERC721("SoulBound", "SBT") {}

    /**
        Ensure that the token can not be transferred
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
    function safeMint(address to) public {
        _tokenIdCounter += 1;
        _safeMint(to, _tokenIdCounter);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn the token.");
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
}