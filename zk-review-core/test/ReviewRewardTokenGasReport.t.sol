// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";

import "../contracts/ReviewRewardToken.sol";

contract ReviewRewardTokenTest is Test {
    ReviewRewardToken public rrt;

    address owner;
    address admin;
    address reviewer1;
    address[] reviewers;
    uint256 amount;
    uint256 reward;

    function setUp() public {
        reward = 5;
        owner = vm.addr(1);
        vm.startPrank(owner);
        rrt = new ReviewRewardToken(reward);
        vm.stopPrank();

        admin = vm.addr(2);
        reviewer1 = vm.addr(3);
        reviewers.push(vm.addr(4));
        reviewers.push(vm.addr(5));
        reviewers.push(vm.addr(6));

        amount = 3;
    }

    function test_RRTGasTimes() public {
        for (uint256 i = 0; i < 20; i++) {
            vm.startPrank(owner);
            rrt.addAdmin(admin);
            rrt.revokeAdmin(admin);
            vm.stopPrank();
        }

        vm.startPrank(owner);
        for (uint256 i=0; i<100; i++) {
            rrt.bulkMint(reviewers, amount);
            rrt.individualMint(reviewer1, amount);
        }
        vm.stopPrank();
    }
}