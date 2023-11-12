/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.8.4;

import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract GSN is ERC2771Recipient {

    event FlagCaptured(address previousHolder, address currentHolder);

    address public currentHolder = address(0);

    constructor(address forwarder) {
        _setTrustedForwarder(forwarder);
    }

    // string public override versionRecipient = "3.0.0";

    function captureTheFlag() external {
        address previousHolder = currentHolder;

        currentHolder = _msgSender();

        emit FlagCaptured(previousHolder, currentHolder);
    }
}