// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@opengsn/contracts/src/BasePaymaster.sol";

contract simplePaymaster is BasePaymaster {
  function versionPaymaster()
    external
    view
    virtual
    override
    returns (string memory)
  {
    return "3.0.0-beta.8+opengsn.simple.paymaster";
  }

  function _preRelayedCall(
    GsnTypes.RelayRequest calldata relayRequest,
    bytes calldata signature,

    bytes calldata approvalData,
    uint256 maxPossibleGas
  )
    internal
    virtual
    override
    returns (
      bytes memory context,
      bool rejectOnRecipientRevert
    )
  {
    (relayRequest, signature, approvalData, maxPossibleGas);
    return ("", false);
  }

  function _postRelayedCall(
    bytes calldata context,
    bool success,
    //gasUseWithoutPost 
    uint256 gasUseWithoutPost,
    GsnTypes.RelayData calldata relayData
  ) internal virtual override {
    (context, success, gasUseWithoutPost, relayData);
  }
}