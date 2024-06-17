// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title ReviewRewardToken
 * @dev An ERC20 token contract for rewarding reviewers.
 */

contract ReviewRewardToken is ERC20, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;

    // Mapping for admin access control
    mapping(address => bool) admins; 

    /**
    `   @dev Constructor to initialize the contract with default token name, symbol, and image
        @param reward The reward amount to be given to the reviewers
    */
    constructor(uint256 reward) ERC20("ReviewRewardToken", "RRT") {
        owner = payable(msg.sender);
        admins[msg.sender] = true;

        // Mint initial supply to owner
        _mint(owner, 10000 * (10 ** decimals()));
        blockReward = reward * (10 ** decimals());
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    /**
        @dev Overriding the beforeTokenTransfer function
        @param from Address from which the token is being transferred
        @param to Address to which the token is being transferred
        @param value Token value being transferred
     */
    function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override {
        // if(from != address(0) && to != block.coinbase && block.coinbase != address(0)) {
        //     _mintMinerReward();
        // }
        super._beforeTokenTransfer(from, to, value);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    /**
        @dev Bulk mints tokens to multiple reviewers.
        @param _tos Array of addresses to mint tokens to
        @param amount Amount of tokens to mint
     */
    function bulkMint(address[] memory _tos, uint256 amount) public onlyOwner {
        for(uint256 i=0; i< _tos.length; i++) {
            _mint(_tos[i], amount * (10 ** decimals()));
        }
    }

    /**
        @dev Mint desired amount of tokens to a single reviewer.
        @param to Address to mint tokens to
        @param amount Amount of tokens to mint
     */
    function individualMint(address to, uint256 amount) public onlyAdmin {
        // _mint(to, amount * (10 ** decimals()));
        _mint(to, amount * (10 ** decimals()));

    }

    /**
        @dev Adds an admin to the contract
        @param _account The address to be given admin privileges
     */
    function addAdmin(address _account) public onlyAdmin {
        admins[_account] = true;
    }

    /**
        @dev Revokes admin privileges from an account
        @param _account The address to revoke admin privileges from
     */
    function revokeAdmin(address _account) public onlyAdmin {
        admins[_account] = false;
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    /**
        @dev Modifier to restrict access to only the contract owner
     */
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    /**
        @dev Modifier to restrict access to only the contract admin
     */
    modifier onlyAdmin {
        require(admins[msg.sender], "Only admin can call this function");
        _;
    }
}