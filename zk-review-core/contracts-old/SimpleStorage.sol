// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

//import OPENGSN
import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract simpleStorage is ERC2771Recipient {
  uint256 favoriteNumber;

  string public versionRecipient = "3.0.0-beta.6";

  constructor(address forwarder) {
    _setTrustedForwarder(forwarder);
  }

  function store(uint256 _favoriteNumber) public {
    favoriteNumber = _favoriteNumber;
    (_favoriteNumber);
  }

  function retrieve() public view returns (uint256) {
    return favoriteNumber;
  }
}