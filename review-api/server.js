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

app.use(cors({
  origin: '*'
}));

// let connection;
let SoulBoundContract;
let ReviewRewardTokenContract;
let signer;

async function run() {
  try {
    console.log('starting connection');

    // Create a connection pool which will later be accessed via the
    // pool cache as the 'default' pool.
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=gf4419f065faf53_peerreviewrewards_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))',
      // poolAlias: 'default', // set an alias to allow access to the pool via a name.
      // poolIncrement: 1, // only grow the pool by one connection at a time
      poolMax: 10, // maximum size of the pool. (Note: Increase UV_THREADPOOL_SIZE if you increase poolMax in Thick mode)
      poolMin: 0, // start with no connections; let the pool shrink completely
      // poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
      // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
      // queueMax: 500, // don't allow more than 500 unsatisfied getConnection() calls in the pool queue
      // queueTimeout: 60000, // terminate getConnection() calls queued for longer than 60000 milliseconds
    });

  } catch (err) {
    console.log('error', err);
    console.error(err);
  } finally {
    console.log('Connection pool started');
  }
}

async function reviewRewardTokenSetup() {
  const reviewRewardTokenAddress = process.env.REVIEW_REWARD_TOKEN_CONTRACT;
  ReviewRewardTokenContract = new ethers.Contract(reviewRewardTokenAddress, ReviewRewardTokenABI, signer);
  console.log('Review reward token contract set up!')

}

async function soulBoundSetup() {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_URL);
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

  // const reviewerAddress = '0x9ae658c7300849D0A8E61d7098848750afDA88eF';
  // const journalAddress = '0xfcDa3161CB37feAf39F4d323dB882cCbb1b05F07';
  // await SoulBoundContract.safeMint(
  //   reviewerAddress, journalAddress
  // ).send({from: signer.address, gas: 2100000});
  console.log('Soul bound tokens distributed');
}

async function massMint() {
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

              // Mass mint
              const rewardsIds = [];
              const journalReviewerAddresses = {};
              unassignedReviews.rows.forEach(async (review) => {
                const rewardsId = review[0];
                const reviewerAddress = review[1];
                const journalAddress = review[5];

                if (!(journalAddress in journalReviewerAddresses)) {
                  journalReviewerAddresses[journalAddress] = [];
                }
                journalReviewerAddresses[journalAddress].push(reviewerAddress);
    
                rewardsIds.push(rewardsId);
              });

              let journalAddresses = Object.keys(journalReviewerAddresses);

              for (const journalAddress of journalAddresses) {
                const reviewerAddresses = journalReviewerAddresses[journalAddress];
                await SoulBoundContract.bulkMintFromCron(
                  reviewerAddresses, journalAddress
                );

                const reward_setting_sql = `SELECT * from reward_settings where journal_hash='${journalAddress}'`;
                console.log("reward_setting_sql", reward_setting_sql);
                const reward_setting = await connection.execute(reward_setting_sql);

                if (reward_setting && reward_setting.rows && reward_setting.rows[0]) {
                  const settings_details = reward_setting.rows[0];
                  const enable_rrt = settings_details[2];
                  const rrt_amount_per_review = settings_details[3];

                  if (enable_rrt == 1 && rrt_amount_per_review > 0) {
                    // bulk mint RRT tokens here
                    await ReviewRewardTokenContract.bulkMint(reviewerAddresses, rrt_amount_per_review);
                  }
                } 

              }

              if (rewardsIds.length > 0) {
                const reward_ids_string = rewardsIds.toString();
                const rewards = `UPDATE rewards SET assigned=1 WHERE id IN (${reward_ids_string})`;
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

// Running cron every 5 minutes
cron.schedule('*/2 * * * *', async() => {
  console.log('running a task every 5 minutes');
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

  let connection;
  try {
    connection = await oracledb.getConnection();
    const sql = `INSERT INTO authors (author_hash, file_hash, time_stamp) VALUES ('${author_hash}','${file_hash}', CURRENT_TIMESTAMP)`;
    await connection.execute(sql);

    const journals = `INSERT INTO journals (journal_hash, article_hash, time_stamp) VALUES ('${journal_hash}','${file_hash}', CURRENT_TIMESTAMP)`;
    await connection.execute(journals);

    connection.commit();
  } catch (err) {
    console.log('err here', err);
  } finally {
      if (connection) {
          try {
              await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
      }
  }

  res.send({ success: true, author_hash: author_hash, file_hash: file_hash });
});

app.post('/api/add-reviewers', async(req, res) => {

  // if (!connection) {
  //   await run();
  // }

  console.log(req.body);
  const reviewer_hashes = req.body.reviewer_hashes;
  const article_hash = req.body.article_hash;
  let connection;

  reviewer_hashes.forEach(async(reviewer, index) => {
    try {
      connection = await oracledb.getConnection();
      const sql = `INSERT INTO reviewers (reviewer_hash, article_hash, time_stamp) VALUES ('${reviewer}','${article_hash}', CURRENT_TIMESTAMP)`;
      await connection.execute(sql);
  
      connection.commit();
    } catch (err) {
      console.log('err here', err);
    } finally {
      if (connection) {
        try {
            await connection.close(); // Put the connection back in the pool
        } catch (err) {
            throw (err);
        }
      }
    }
  });
  res.send({ success: true, reviewer_hashes: reviewer_hashes, article_hash: article_hash });
});


app.get('/api/get-manuscripts-by-author', async(req, res)  => {
  console.log('req', req.query);
  const author_hash = req.query.author_hash;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const sql = `SELECT authors.author_hash AS author_hash, authors.file_hash as article_hash, \
    authors.time_stamp as time_stamp, journals.journal_hash as journal_hash, journals.review_hash as review_hash, \
    (SELECT COUNT(reviewer_hash) from reviewers where reviewers.article_hash = authors.file_hash) as reviewers_count \
    FROM authors JOIN journals ON authors.file_hash=journals.article_hash where authors.author_hash = '${author_hash}'`;
    console.log("sql", sql);
    const manuscripts = await connection.execute(sql);

    // const reviewers_sql = `select authors.author_hash AS author_hash, authors.file_hash as article_hash FROM authors join reviewers on authors.file_hash = reviewers.article_hash where authors.author_hash = '${author_hash}' GROUP BY authors.author_hash, authors.file_hash`;

    // console.log('rev sql', reviewers_sql);

    // const reviewers_hashes = await connection.execute(reviewers_sql);

    res.send({success: true, manuscripts});
  } catch (err) {
    console.log('err here', err);
  } finally {
      if (connection) {
          try {
              await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
      }
  }

});

app.get('/api/get-manuscripts-by-reviewer', async(req, res)  => {
  console.log('req', req.query);
  const reviewer_hash = req.query.reviewer_hash;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const sql = `SELECT reviewers.reviewer_hash AS reviewer_hash, reviewers.article_hash as article_hash, reviewers.time_stamp as time_stamp, journals.journal_hash as journal_hash, journals.review_hash as review_hash FROM reviewers JOIN journals ON reviewers.article_hash=journals.article_hash where reviewers.reviewer_hash = '${reviewer_hash}'`;
    const manuscripts = await connection.execute(sql);
    console.log('resp', manuscripts);
    res.send({success: true, manuscripts});
  } catch (err) {
    console.log('err here', err);
  } finally {
      if (connection) {
          try {
              await connection.close(); // Put the connection back in the pool
              console.log('connection is closed!');
          } catch (err) {
              throw (err);
          }
      }
  }

});

app.post('/api/review-submission', async(req, res) => {
  console.log('req.body', req.body);
  const reviewer_hash = req.body.reviewer;
  const journal_hash = req.body.journal;
  const article_hash = req.body.article;
  const review_hashes = req.body.prev_review_links;
  const review_hash = req.body.review;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const sql = `INSERT INTO rewards (reviewer_hash, review_hash, journal_hash, time_stamp) VALUES ('${reviewer_hash}','${review_hash}', '${journal_hash}', CURRENT_TIMESTAMP)`;
    await connection.execute(sql);

    // const journal_sql = `SELECT id, review_hash from journals where article_hash LIKE '%${article_hash}'`;
    // console.log("journal sql", journal_sql);

    // const journal = await connection.execute(journal_sql);

    // const journal_id = journal.rows[0][0];
    // let review_hashes = journal.rows[0][1];

    review_hashes.push(review_hash);
    let new_review_hashes = review_hashes.map(x => "'" + x + "'").toString();

    // const journals = `UPDATE journals SET review_hash=string_array('${review_hash}', 'new_test') WHERE id=${journal_id}`;
    const journals = `UPDATE journals SET review_hash=string_array(${new_review_hashes}) WHERE journal_hash='${journal_hash}' AND article_hash LIKE '%${article_hash}'`;

    console.log("journals sql", journals);

    await connection.execute(journals);

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

  res.send({ success: true, reviewer_hash: reviewer_hash, review_hash: review_hash });
});

app.get('/api/get-manuscripts-by-journal', async(req, res)  => {
  const journal_hash = req.query.journal_hash;
  let connection;
  try {
    connection = await oracledb.getConnection();
    const sql = `SELECT authors.author_hash AS author_hash, authors.file_hash as article_hash, \
    authors.time_stamp as time_stamp, journals.journal_hash as journal_hash, journals.review_hash as review_hash, \
    (SELECT COUNT(reviewer_hash) from reviewers where reviewers.article_hash = authors.file_hash) as reviewers_count \
    FROM authors JOIN journals ON authors.file_hash=journals.article_hash where journals.journal_hash = '${journal_hash}'`;
    const manuscripts = await connection.execute(sql);

    // const reviewers_sql = ` select journals.article_hash AS article_hash,
    // LISTAGG(reviewers.reviewer_hash, ',') WITHIN GROUP (ORDER BY reviewers.reviewer_hash) AS "reviewers_hashes"
    // FROM
    // journals join reviewers
    // on journals.article_hash = reviewers.article_hash
    // where journals.journal_hash = '${journal_hash}'
    // GROUP BY journals.article_hash;`;

    // const reviewers_hashes = await connection.execute(reviewers_sql);

    res.send({success: true, manuscripts});
  } catch (err) {
    console.log('err here', err);
  } finally {
      if (connection) {
          try {
              await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
      }
  }

});

app.get('/api/get-unassigned-reviews', async(req, res) => {
  const journal_hash = req.query.journal_hash;
  let connection;

  try {
    connection = await oracledb.getConnection();
    const sql = `SELECT * FROM rewards WHERE assigned = 0 AND journal_hash='${journal_hash}'`;
    const unassignedReviews = await connection.execute(sql);
    res.send({success: true, unassignedReviews});

  } catch (err) {
    console.log('err: ', err);
  } finally {
      if (connection) {
          try {
              await connection.close(); // Put the connection back in the pool
          } catch (err) {
              throw (err);
          }
      }
  }
})

app.post('/api/bulk-update-assigned-reviews', async(req, res) => {
  const reward_ids = req.body.rewardIds;
  const reward_ids_string = reward_ids.toString();

  let connection;
  try {
    connection = await oracledb.getConnection();

    const rewards = `UPDATE rewards SET assigned=1 WHERE id IN (${reward_ids_string})`;
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

    const rewards = `UPDATE rewards SET assigned=1 WHERE id=${rewards_id}`;
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

  if (enable_rrt == 0) {
    rrt_amount_per_review = 0;
  }

  let connection;
  try {
    connection = await oracledb.getConnection();

    const sql = `select * from reward_settings where journal_hash='${journal_hash}' FETCH FIRST 1 ROWS ONLY`;

    const journal = await connection.execute(sql);

    if (journal && journal.rows && journal.rows[0]) {
      const settings_details = journal.rows[0];
      const id = settings_details[0];

      const settings = `UPDATE reward_settings SET enable_rrt='${enable_rrt}', rrt_amount_per_review='${rrt_amount_per_review}'  WHERE id=${id}`;

      await connection.execute(settings);
    } else {
      const settings = `INSERT INTO reward_settings (journal_hash, enable_rrt, rrt_amount_per_review, time_stamp) VALUES ('${journal_hash}','${enable_rrt}', '${rrt_amount_per_review}', CURRENT_TIMESTAMP)`;
      await connection.execute(settings);
    }
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

app.listen(port, () => console.log(`Listening on port ${port}`));