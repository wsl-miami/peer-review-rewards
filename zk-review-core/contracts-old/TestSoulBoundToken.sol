//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./SoulBoundToken.sol";

//  ___________________________________________________________________
// |  BASIC SOULBOUND TOKEN TO USE IN HARDHAT TESTING  |
// |___________________________________________________________________|

contract TestSoulBoundToken is Soulbound {
    uint constant _initial_supply = 100 * (10**18);
    constructor() Soulbound() {
        _mint(msg.sender, _initial_supply);
    }
}