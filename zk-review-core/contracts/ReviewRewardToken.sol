// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ReviewRewardToken is ERC20, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;

    // mapping for admin access control
    mapping(address => bool) admins;

    constructor(uint256 reward) ERC20("ReviewRewardToken", "RRT") {
        owner = payable(msg.sender);
        admins[msg.sender] = true;

        _mint(owner, 10000 * (10 ** decimals()));
        blockReward = reward * (10 ** decimals());
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

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
        Bulk mint selected amount of tokens to reviewers
    */
    function bulkMint(address[] memory _tos, uint256 amount) public onlyOwner {
        for(uint256 i=0; i< _tos.length; i++) {
            _mint(_tos[i], amount * (10 ** decimals()));
        }
    }

    function individualMint(address to, uint256 amount) public onlyAdmin {
        // _mint(to, amount * (10 ** decimals()));
        _mint(to, amount * (10 ** decimals()));

    }

    /*
     @notice function to add an admin to the contract
     @param _account account to be given admin privilledges
     emits AdminAdded
    */
    function addAdmin(address _account) public onlyAdmin {
        admins[_account] = true;
    }

    /*
     @notice function to revoke admin access
     @param _account address to revoke admin privilledges from
     emits AdminRevoked
    */
    function revokeAdmin(address _account) public onlyAdmin {
        admins[_account] = false;
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyAdmin {
        require(admins[msg.sender], "Only admin can call this function");
        _;
    }
}