const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb');
const cron = require('node-cron');
const {ethers} = require('ethers');
const SoulBoundABI = require('./static/SoulBoundABI.json');
const ReviewRewardTokenABI = require('./static/ReviewRewardTokenABI.json');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const REWARDS_TABLE = 'REWARD_ALLOCATION';
const REWARD_SETTINGS_TABLE = 'REWARD_SETTINGS';
const REVIEWS_TABLE = 'REVIEWS';
const MANUSCRIPTS_TABLE = 'MANUSCRIPTS';

app.use(cors({
  origin: '*'
}));

// let connection;
let SoulBoundContract;
let ReviewRewardTokenContract;
let signer;
let provider;

async function run() {
  try {
    console.log('starting connection');

    // Create a connection pool which will later be accessed via the
    // pool cache as the 'default' pool.
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=gf4419f065faf53_peerreviewrewards_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))',
      poolMax: 10, // maximum size of the pool. (Note: Increase UV_THREADPOOL_SIZE if you increase poolMax in Thick mode)
      poolMin: 0, // start with no connections; let the pool shrink completely
    });

  } catch (err) {
    console.log('error', err);
    console.error(err);
  } finally {
    console.log('Connection pool started');
  }
}

const knex = require("knex")({
  client: "oracledb",
  connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=gf4419f065faf53_peerreviewrewards_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))',
  },
  fetchAsString: ["number", "clob"],
  pool: { min: 0, max: 20 },
  debug: true
});

knex.raw("SELECT 1 from DUAL").then(() => {
  console.log("Oracledb connected");
})
.catch((e) => {
  console.log("Oracledb not connected");
  console.error(e);
});

async function reviewRewardTokenSetup() {
  const reviewRewardTokenAddress = process.env.REVIEW_REWARD_TOKEN_CONTRACT;
  ReviewRewardTokenContract = new ethers.Contract(reviewRewardTokenAddress, ReviewRewardTokenABI, signer);
  console.log('Review reward token contract set up!')

}

async function soulBoundSetup() {
  try {
    provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_URL);
    const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY);
    signer = wallet.connect(provider);
    balance = await provider.getBalance(signer.address);
    console.log('balance', balance);
    const soulBoundAddress = process.env.SOUL_BOUND_TOKEN_CONTRACT;
    SoulBoundContract = new ethers.Contract(soulBoundAddress, SoulBoundABI, signer);

    reviewRewardTokenSetup();
  } catch (err) {
    console.log('error', err);
    console.error(err);
  } finally {
    console.log('Soul bound token contract set up!')
  }
}

// Running cron every month
cron.schedule('0 0 1 * *', () => {
  console.log('running a task every month');
});

async function individualMint() {
  let connection;
  let unassignedReviews;

  try {
    connection = await oracledb.getConnection();
    const sql = `SELECT * FROM rewards WHERE assigned = 0`;
    unassignedReviews = await connection.execute(sql);
  } catch (err) {
    console.log('err: ', err);
  } finally {
      if (connection) {
          try {
              // Individual mint
              for (const row of unassignedReviews.rows) {
                const reviewerAddress = row[1];
                const journalAddress = row[5];
                console.log('reviewer', reviewerAddress, 'journalAddress', journalAddress);

                await SoulBoundContract.safeMint(
                  reviewerAddress, journalAddress
                );
                console.log("token minted", row[0]);

                const rewards = `UPDATE rewards SET assigned=1 WHERE id IN (${row[0]})`;
                console.log('rewards', rewards);
                await connection.execute(rewards);
                connection.commit();
                console.log('database updated');
              }
              await connection.close(); // Put the connection back in the pool

          } catch (err) {
              throw (err);
          }
      }
  }
  console.log('Soul bound tokens distributed');
}

async function bulkMintRRTTokens() {
  try {
    const unassignedRRTReviews = await knex(REWARDS_TABLE)
      .join(REWARD_SETTINGS_TABLE, `${REWARD_SETTINGS_TABLE}.JOURNAL_HASH`, `${REWARDS_TABLE}.JOURNAL_HASH`)
      .join(REVIEWS_TABLE, `${REWARDS_TABLE}.REVIEWS_ID`, `${REVIEWS_TABLE}.ID`)
      .where('RRT_ASSIGNED', 0)
      .where('ENABLE_RRT', 1)
      .where(`${REWARDS_TABLE}.TIME_STAMP`, '>', knex.raw(`TRUNC(SYSDATE) - interval '1' month`))
      .select(
        `${REWARDS_TABLE}.ID as REWARDS_ID`,
        `${REWARDS_TABLE}.REVIEWER_HASH`,
        `${REWARDS_TABLE}.JOURNAL_HASH`,
        `${REWARDS_TABLE}.RRT_ASSIGNED`,
        `${REWARDS_TABLE}.TIME_STAMP as REWARDS_TIME_STAMP`,
        `${REVIEWS_TABLE}.DEADLINE`,
        `${REWARD_SETTINGS_TABLE}.RRT_WITHIN_DEADLINE`,
        `${REWARD_SETTINGS_TABLE}.RRT_AFTER_DEADLINE`
      );

      const rrtJournalReviewerAddresses = {};

      unassignedRRTReviews.forEach(async (review) => {
        const rewardsId = review.REWARDS_ID;
        const reviewerAddress = review.REVIEWER_HASH;
        const journalAddress = review.JOURNAL_HASH;
  
        if (!(journalAddress in rrtJournalReviewerAddresses)) {
          rrtJournalReviewerAddresses[journalAddress] = {reviewerAddresses: [], rewardsIds: []};
        }
        // @TODO Check if review was submitted before or after deadline and push to corresponding keys
        // reviewerAddressesBeforeDeadline reviewerAddressesAfterDeadline
        rrtJournalReviewerAddresses[journalAddress]['reviewerAddresses'].push(reviewerAddress);
        rrtJournalReviewerAddresses[journalAddress]['rewardsIds'].push(rewardsId);
        rrtJournalReviewerAddresses[journalAddress]['rrtWithinDeadline'] = review.RRT_WITHIN_DEADLINE;
        rrtJournalReviewerAddresses[journalAddress]['rrtAfterDeadline'] = review.RRT_AFTER_DEADLINE;
      });
  
      let journalAddresses = Object.keys(rrtJournalReviewerAddresses);

  } catch (err) {
    console.log('err bulk minting RRT tokens', err);
  }
}

async function bulkMintSBTTokens() {
  try{
    const unassignedSBTReviews = await knex(REWARDS_TABLE)
                                .where('SBT_ASSIGNED', 0)
                                .select();

    const sbtJournalReviewerAddresses = {};

    unassignedSBTReviews.forEach(async (review) => {
      const rewardsId = review.ID;
      const reviewerAddress = review.REVIEWER_HASH;
      const journalAddress = review.JOURNAL_HASH;

      if (!(journalAddress in sbtJournalReviewerAddresses)) {
        sbtJournalReviewerAddresses[journalAddress] = {reviewerAddresses: [], rewardsIds: []};
      }
      sbtJournalReviewerAddresses[journalAddress]['reviewerAddresses'].push(reviewerAddress);
      sbtJournalReviewerAddresses[journalAddress]['rewardsIds'].push(rewardsId);
    });

    let journalAddresses = Object.keys(sbtJournalReviewerAddresses);

    for (const journalAddress of journalAddresses) {
      const reviewerAddresses = sbtJournalReviewerAddresses[journalAddress]['reviewerAddresses'];
      const rewardIds = sbtJournalReviewerAddresses[journalAddress]['rewardsIds']
      let txhash = await SoulBoundContract.bulkMintFromCron(
        reviewerAddresses, journalAddress
      );

      const updateRewards = await knex(REWARDS_TABLE)
                                  .whereIn('ID', rewardIds)
                                  .update({SBT_ASSIGNED: 1});
    }                         
  } catch (err) {
    console.log('err mintingSBT tokens: ', err);
  }
}

async function bulkMintWithNewDatabase() {
  bulkMintSBTTokens();
  bulkMintRRTTokens();
}

async function massMint() {
  bulkMintSBTTokens();
  bulkMintRRTTokens();
  console.log('Soul bound tokens and RRT tokens distributed');
}

// Running cron every 30 minutes
cron.schedule('*/5 * * * *', async() => {
  console.log('running a task every 30 minutes');
  if (SoulBoundContract) {
    console.log('Soul bound contract is set up.');

    // individualMint();
    massMint();
  }
});

run();
soulBoundSetup();

app.post('/api/manuscript-submission', async(req, res) => {
  console.log(req.body);
  const author_hash = req.body.author;
  const journal_hash = req.body.journal;
  const file_hash = req.body.file_hash;

  try {
    const insertQuery = await knex(MANUSCRIPTS_TABLE)
                                .insert({
                                  'ARTICLE_HASH': file_hash,
                                  'AUTHOR_HASH': author_hash,
                                  'JOURNAL_HASH': journal_hash,
                                  'TIME_STAMP': knex.raw('CURRENT_TIMESTAMP')
                                }, ['ID']);
    res.send({ success: true, author_hash: author_hash, file_hash: file_hash, manuscript_id: insertQuery.ID });
  } catch (err) {
    console.log('err here', err);
    res.send({success: false, error_code: 'SERVERSIDEERROR'})
  }

});

app.get('/api/get-assigned-reviewers', async(req, res) => {
  const article_hash = req.query.article_hash;

  try {
    const reviewers = await knex(REVIEWS_TABLE)
                                  .join(MANUSCRIPTS_TABLE, `${MANUSCRIPTS_TABLE}.ID`,  `${REVIEWS_TABLE}.MANUSCRIPTS_ID`)
                                  .where(`${MANUSCRIPTS_TABLE}.ARTICLE_HASH`, article_hash)
                                  .select(
                                    `${REVIEWS_TABLE}.ID as ID`,
                                    `${REVIEWS_TABLE}.REVIEWER_HASH`,
                                    `${MANUSCRIPTS_TABLE}.ARTICLE_HASH`,
                                    `${REVIEWS_TABLE}.TIME_STAMP as TIME_STAMP`,
                                    `${REVIEWS_TABLE}.DEADLINE`,
                                  );

    res.send({success: true, reviewers});
  } catch (err) {
    console.log('err here', err);
    res.send({success: false, error_code: 'SERVERSIDEERROR'})
  }
});

app.post('/api/add-reviewers', async(req, res) => {

  // if (!connection) {
  //   await run();
  // }

  console.log(req.body);
  const reviewer_hashes = req.body.reviewer_hashes;
  const article_hash = req.body.article_hash;
  const deadline = req.body.deadline;
  let connection;

  const manuscript_update = await knex(MANUSCRIPTS_TABLE)
                                .where('ARTICLE_HASH', article_hash)
                                .update({
                                  'DEADLINE': knex.raw(`to_date('${deadline}', 'YYYY-MM-DD')`)
                                }, ['ID']);
  
  const manuscripts_id = manuscript_update[0].ID;

  reviewer_hashes.forEach(async(reviewer, index) => {
    try {
      // insert only if reviewer_hash not present in reviewers table
      const alreadyPresentReview = await knex(REVIEWS_TABLE)
                                        .where(`${REVIEWS_TABLE}.ARTICLE_HASH`, article_hash)
                                        .where(`${REVIEWS_TABLE}.REVIEWER_HASH`, reviewer)
                                        .select(`${REVIEWS_TABLE}.ID as review_id`);

      if (alreadyPresentReview && alreadyPresentReview.length > 0) {

        let review_ids = []
        alreadyPresentReview.forEach((review) => {
          review_ids.push(review.review_id);
        });

        const updateReview = await knex(REVIEWS_TABLE)
                              .whereIn('ID', review_ids)
                              .update({
                                'DEADLINE': knex.raw(`to_date('${deadline}', 'YYYY-MM-DD')`)
                              });
      } else {
        const insertReview = await knex(REVIEWS_TABLE)
                                    .insert({
                                      'REVIEWER_HASH': reviewer,
                                      'ARTICLE_HASH': article_hash,
                                      'DEADLINE': knex.raw(`to_date('${deadline}', 'YYYY-MM-DD')`),
                                      'MANUSCRIPTS_ID': manuscripts_id,
                                      'TIME_STAMP': knex.raw('CURRENT_TIMESTAMP')
                                    })
      }
    } catch (err) {
      console.log('err here', err);
    }
  });
  res.send({ success: true, reviewer_hashes: reviewer_hashes, article_hash: article_hash });
});


app.get('/api/get-manuscripts-by-author', async(req, res)  => {
  const author_hash = req.query.author_hash;
  try {
    const manuscripts = await knex(MANUSCRIPTS_TABLE)
                                  .select(
                                    'AUTHOR_HASH',
                                    'ARTICLE_HASH',
                                    'TIME_STAMP',
                                    'JOURNAL_HASH',
                                    'REVIEW_HASHES as REVIEW_HASH',
                                    knex.raw(`(SELECT COUNT(REVIEWER_HASH) from ${REVIEWS_TABLE} where ${REVIEWS_TABLE}.ARTICLE_HASH = ${MANUSCRIPTS_TABLE}.ARTICLE_HASH) as REVIEWERS_COUNT`)
                                  )
                                  .where('AUTHOR_HASH', author_hash);

    res.send({success: true, manuscripts});
  } catch (err) {
    console.log('err here', err);
    res.send({success: false, error_code: 'SERVERSIDEERROR'});

  } finally {
  }

});

app.get('/api/get-manuscripts-by-reviewer', async(req, res)  => {
  const reviewer_hash = req.query.reviewer_hash;
  try {
    const manuscript_details = await knex.select(
      'REVIEWER_HASH',
      `${REVIEWS_TABLE}.ARTICLE_HASH`,
      `${REVIEWS_TABLE}.TIME_STAMP`,
      `${MANUSCRIPTS_TABLE}.JOURNAL_HASH`,
      `${REVIEWS_TABLE}.REVIEW_HASH`
     )
     .table(REVIEWS_TABLE)
     .join(MANUSCRIPTS_TABLE, `${REVIEWS_TABLE}.MANUSCRIPTS_ID`, `${MANUSCRIPTS_TABLE}.ID`)
     .where(`${REVIEWS_TABLE}.REVIEWER_HASH`, reviewer_hash);

    console.log('manuscript details', manuscript_details);

    res.send({success: true, manuscript_details});
  } catch (err) {
    console.log('err here', err);
    res.send({success: false, error_code: 'SERVERSIDEERROR'});
  } finally {
  }
});

app.post('/api/review-submission', async(req, res) => {
  const reviewer_hash = req.body.reviewer;
  const journal_hash = req.body.journal;
  const article_hash = req.body.article;
  const review_hashes = req.body.prev_review_links;
  const review_hash = req.body.review;
  try {
    // update review_hash if data already present in reward_allocation table
    const alreadyPresentReview = await knex(REWARDS_TABLE)
                                        .join(REVIEWS_TABLE, `${REVIEWS_TABLE}.ID`, `${REWARDS_TABLE}.REVIEWS_ID`)
                                        .join(MANUSCRIPTS_TABLE, `${MANUSCRIPTS_TABLE}.ID`, `${REVIEWS_TABLE}.MANUSCRIPTS_ID`)
                                        .where(`${REWARDS_TABLE}.REVIEWER_HASH`, reviewer_hash)
                                        .where(`${REWARDS_TABLE}.JOURNAL_HASH`, journal_hash)
                                        .where(`${MANUSCRIPTS_TABLE}.ARTICLE_HASH`, article_hash)
                                        .select(`${REWARDS_TABLE}.ID as rewards_id`, `${REVIEWS_TABLE}.ID as review_id`, `${MANUSCRIPTS_TABLE}.REVIEW_HASHES`)
                                        .first();
                          
                                        console.log("alreadyPResentreview", alreadyPresentReview);

    if (alreadyPresentReview) {
      const reward_id = alreadyPresentReview.rewards_id;
      const review_id = alreadyPresentReview.review_id;
      const updateRewardAllocationTable = await knex(REWARDS_TABLE)
                                                  .where('ID', reward_id)
                                                  .update({
                                                    'TIME_STAMP': knex.raw('CURRENT_TIMESTAMP')
                                                  });

      const updateReviewsTable = await knex(REVIEWS_TABLE)
                                    .where('ID', review_id)
                                    .update({
                                      'REVIEW_HASH': review_hash,
                                      'TIME_STAMP': knex.raw('CURRENT_TIMESTAMP')
                                    });
    } else {
      const review = await knex(REVIEWS_TABLE)
                            .join(MANUSCRIPTS_TABLE, `${MANUSCRIPTS_TABLE}.ID`, `${REVIEWS_TABLE}.MANUSCRIPTS_ID`)
                            .where(`${REVIEWS_TABLE}.REVIEWER_HASH`, reviewer_hash)
                            .where(`${MANUSCRIPTS_TABLE}.ARTICLE_HASH`, article_hash)
                            .select(`${REVIEWS_TABLE}.ID as review_id`, `${MANUSCRIPTS_TABLE}.REVIEW_HASHES`)
                            .first();
      const review_id = review.review_id;
      console.log('review_id', review_id);
      const updateReviewsTable = await knex(REVIEWS_TABLE)
                                        .where('ID', review_id)
                                        .update(`${REVIEWS_TABLE}.REVIEW_HASH`, review_hash);
                              
      const insertIntoRewardAllocationTable = await knex(REWARDS_TABLE)
                                                      .insert({
                                                        'REVIEWER_HASH': reviewer_hash,
                                                        'JOURNAL_HASH': journal_hash,
                                                        'TIME_STAMP': knex.raw('CURRENT_TIMESTAMP'),
                                                        'REVIEWS_ID': review_id
                                                      });
    }

    const getReviews = await knex(REVIEWS_TABLE)
                                .where('ARTICLE_HASH', article_hash)
                                .select();
    
    const all_review_hashes = [];
    getReviews.forEach((review)=> {
      const review_hash = review.REVIEW_HASH;
      if (review_hash) {
        all_review_hashes.push(review_hash);
      }
    });

    let new_review_hashes = all_review_hashes.map(x => "'" + x + "'").toString();

    const journalUpdate = await knex(MANUSCRIPTS_TABLE)
                                  .where('JOURNAL_HASH', journal_hash)
                                  .where('ARTICLE_HASH', article_hash)
                                  .update('REVIEW_HASHES', knex.raw(`string_array(${new_review_hashes})`));
  } catch (err) {
    console.log('err here', err);
  }

  res.send({ success: true, reviewer_hash: reviewer_hash, review_hash: review_hash });
});

app.get('/api/get-manuscripts-by-journal', async(req, res)  => {
  const journal_hash = req.query.journal_hash;
  try {
    const manuscripts = await knex(MANUSCRIPTS_TABLE)
                                  .select(
                                    'AUTHOR_HASH',
                                    'ARTICLE_HASH',
                                    'TIME_STAMP',
                                    'JOURNAL_HASH',
                                    'REVIEW_HASHES as REVIEW_HASH',
                                    knex.raw(`(SELECT COUNT(REVIEWER_HASH) from ${REVIEWS_TABLE} where ${REVIEWS_TABLE}.ARTICLE_HASH = ${MANUSCRIPTS_TABLE}.ARTICLE_HASH) as REVIEWERS_COUNT`)
                                  )
                                  .where(`${MANUSCRIPTS_TABLE}.JOURNAL_HASH`, journal_hash);

    res.send({success: true, manuscripts});
  } catch (err) {
    console.log('err here', err);
    res.send({success: false, error_code: 'SERVERSIDEERROR'})
  } finally {
  }

});

app.get('/api/get-unassigned-reviews', async(req, res) => {
  const journal_hash = req.query.journal_hash;

  try {
    const unassignedReviews = await knex(REWARDS_TABLE)
                                        .where('SBT_ASSIGNED', 0)
                                        .where('JOURNAL_HASH', journal_hash)
                                        .select();
    res.send({success: true, unassignedReviews});

  } catch (err) {
    console.log('err: ', err);
    res.send({success: false, error_code: 'SERVERSIDEERROR'});
  } finally {
  }
});

app.get('/api/get-token-settings', async(req, res) => {
  const journal_hash = req.query.journal_hash;

  try {
    const settings = await knex('REWARD_SETTINGS')
                                        .where('REWARD_SETTINGS.JOURNAL_HASH', journal_hash)
                                        .select()
                                        .first();
    res.send({success: true, settings});

  } catch (err) {
    console.log('err: ', err);
    res.send({success: false, error_code: 'SERVERSIDEERROR'});
  } finally {
  }
});

app.post('/api/bulk-update-assigned-reviews', async(req, res) => {
  const reward_ids = req.body.rewardIds;
  const reward_ids_string = reward_ids.toString();

  let connection;
  try {
    connection = await oracledb.getConnection();

    const rewards = `UPDATE ${REWARDS_TABLE} SET sbt_assigned=1 WHERE id IN (${reward_ids_string})`;
    console.log("journals sql", rewards);

    await connection.execute(rewards);

    connection.commit();
  } catch (err) {
    console.log('err here', err);
    await connection.close();
  } finally {
      if (connection) {
          try {
              await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
      }
  }

  res.send({ success: true});
});

app.post('/api/update-assigned-reviews', async(req, res) => {
  const rewards_id = req.body.rewardsId;

  let connection;
  try {
    connection = await oracledb.getConnection();

    const rewards = `UPDATE ${REWARDS_TABLE} SET sbt_assigned=1 WHERE id=${rewards_id}`;
    console.log("journals sql", rewards);

    await connection.execute(rewards);

    connection.commit();
  } catch (err) {
    console.log('err here', err);
    await connection.close();
  } finally {
      if (connection) {
          try {
              await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
      }
  }

  res.send({ success: true});
});

app.post('/api/update-review-settings', async(req, res) => {
  const journal_hash = req.body.journal_hash;
  const enable_rrt = (req.body.enableRRT) ? 1 : 0;
  let rrt_amount_per_review = req.body.amountPerReview ? req.body.amountPerReview : 0;
  let rrt_within_deadline = req.body.amountPerReviewWithinDeadline ? req.body.amountPerReviewWithinDeadline : 0;
  let rrt_after_deadline = req.body.amountPerReviewAfterDeadline ? req.body.amountPerReviewAfterDeadline : 0;


  if (enable_rrt == 0) {
    rrt_amount_per_review = 0;
    rrt_within_deadline = 0;
    rrt_after_deadline = 0;
  }

  let settings;
  try {
    const existing_settings = await knex(REWARD_SETTINGS_TABLE)
                          .where('JOURNAL_HASH', journal_hash)
                          .first();

    if (existing_settings && existing_settings.ID) {
      const id = existing_settings.ID;

      settings = await knex(REWARD_SETTINGS_TABLE)
                              .where('ID', id)
                              .update({
                                'ENABLE_RRT': enable_rrt,
                                'RRT_AMOUNT_PER_REVIEW': rrt_amount_per_review,
                                'RRT_WITHIN_DEADLINE': rrt_within_deadline,
                                'RRT_AFTER_DEADLINE': rrt_after_deadline
                              }, ['ID', 'ENABLE_RRT']
                              );
    } else {
      settings = await knex(REWARD_SETTINGS_TABLE)
                        .insert({
                          'JOURNAL_HASH': journal_hash,
                          'ENABLE_RRT': enable_rrt,
                          'RRT_AMOUNT_PER_REVIEW': rrt_amount_per_review,
                          'RRT_WITHIN_DEADLINE': rrt_within_deadline,
                          'RRT_AFTER_DEADLINE': rrt_after_deadline ,
                          'TIME_STAMP': knex.raw('CURRENT_TIMESTAMP')
                        }, ['ID', 'ENABLE_RRT']);
    }
  } catch (err) {
    console.log('err here', err);
    res.send({success: false, error_code: 'SERVERSIDEERROR'});
  }

  res.send({ success: true, settings});
});

app.listen(port, () => console.log(`Listening on port ${port}`));