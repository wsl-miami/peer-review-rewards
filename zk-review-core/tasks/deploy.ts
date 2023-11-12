import { task, types } from "hardhat/config"
console.log('dafd')
// task("deploy", "Deployment of Peer Review Contract")
//     .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
//     .addOptionalParam("group", "Group id", "42", types.string)
//     .addOptionalParam("logs", "Print the logs", true, types.boolean)
//     .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {
//         console.log('here');
//         if (!semaphoreAddress) {
//             const { semaphore } = await run("deploy:semaphore", {
//                 logs
//             })

//             semaphoreAddress = semaphore.address
//         }

//         const forwarder = require('../build/gsn/Forwarder').address;

//         const PRContract = await ethers.getContractFactory("PeerReviewContract")
//         const PRContractDeploy = await PRContract.deploy(semaphoreAddress, forwarder);

//         await PRContractDeploy.deployed();

//         if (logs) {
//             console.info(`Greeter contract has been deployed to: ${PRContractDeploy.address}`)
//         }
//         return PRContract
//     })


// import { task, types } from "hardhat/config"

task("deploy", "Deploy a Greeter contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("group", "Group id", "42", types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = semaphore.address
        }

        const PRFactory = await ethers.getContractFactory("PeerReview")
        console.log('eys', semaphoreAddress)
        const PRContract = await PRFactory.deploy(semaphoreAddress)

        await PRContract.deployed()

        if (logs) {
            console.info(`Greeter contract has been deployed to: ${PRContract.address}`)
        }
        return PRContract
    })
