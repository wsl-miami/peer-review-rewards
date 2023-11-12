pragma solidity ^0.8.4;
// SPDX-License-Identifier: MIT

import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract Counter is ERC2771Recipient {
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

    string public versionRecipient = "3.0.0-beta.6";
}