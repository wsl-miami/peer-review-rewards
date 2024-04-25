// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";

import "../contracts/ReviewRewardToken.sol";
import "../contracts/SoulBoundToken.sol";


contract TokenTest is Test {
    ReviewRewardToken public rrt;

    address owner;
    address admin;
    address reviewer1;
    address[] reviewers;
    uint256 amount;
    uint256 reward;

    Soulbound public sbt;
    address journal;

    function setUp() public {
        reward = 5;
        owner = vm.addr(1);
        vm.startPrank(owner);
        rrt = new ReviewRewardToken(reward);
        sbt = new Soulbound();
        vm.stopPrank();

        admin = vm.addr(2);
        journal = vm.addr(3);
        reviewer1 = vm.addr(4);
        reviewers.push(vm.addr(5));
        reviewers.push(vm.addr(6));
        reviewers.push(vm.addr(7));

        // for (uint256 i = 0; i < 27; i++) {
        //     reviewers.push(vm.addr(i+8));
        // }

        amount = 3;
    }

    function test_GasTimes() public {
        for (uint256 i = 0; i < 500; i++) {
            vm.startPrank(owner);
            rrt.addAdmin(admin);
            rrt.revokeAdmin(admin);
            vm.stopPrank();
        }

        vm.startPrank(owner);
        for (uint256 i=0; i<500; i++) {
            rrt.bulkMint(reviewers, amount);
            rrt.individualMint(reviewer1, amount);
            rrt.balanceOf(reviewer1);
            rrt.transfer(reviewer1, 2);

            sbt.bulkMintFromCron(reviewers, vm.toString(journal));
            sbt.safeMint(reviewer1, vm.toString(journal));
            sbt.getTokensOwnedByAddress(reviewer1);
            sbt.tokenURI(1);
        }
        vm.stopPrank();
    }
}


// contract SoulboundTest is Test {

//     address owner;
//     address admin;
//     address reviewer1;
//     address[] reviewers;

//     Soulbound public sbt;
//     address journal;

//     function setUp() public {
//         owner = vm.addr(1);
//         vm.startPrank(owner);
//         sbt = new Soulbound();
//         vm.stopPrank();

//         admin = vm.addr(2);
//         journal = vm.addr(3);
//         reviewer1 = vm.addr(4);
//         reviewers.push(vm.addr(5));
//         reviewers.push(vm.addr(6));
//         reviewers.push(vm.addr(7));

//         for (uint256 i = 0; i < 7; i++) {
//             reviewers.push(vm.addr(i+8));
//         }
//     }

//     function test_SBTGasTimes() public {

//         vm.startPrank(owner);
//         // for (uint256 i=0; i<100; i++) {
//             sbt.bulkMintFromCron(reviewers, vm.toString(journal));
//             sbt.safeMint(reviewer1, vm.toString(journal));
//             sbt.getTokensOwnedByAddress(reviewer1);
//             sbt.tokenURI(1);
//         // }
//         vm.stopPrank();
//     }
// }