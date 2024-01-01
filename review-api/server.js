const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: '*'
}));

// let connection;

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

run();

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
    const sql = `SELECT authors.author_hash AS author_hash, authors.file_hash as article_hash, authors.time_stamp as time_stamp, journals.journal_hash as journal_hash, journals.review_hash as review_hash FROM authors JOIN journals ON authors.file_hash=journals.article_hash where authors.author_hash = '${author_hash}'`;
    console.log("sql", sql);
    const manuscripts = await connection.execute(sql);
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
    const sql = `SELECT authors.author_hash AS author_hash, authors.file_hash as article_hash, authors.time_stamp as time_stamp, journals.journal_hash as journal_hash, journals.review_hash as review_hash FROM authors JOIN journals ON authors.file_hash=journals.article_hash where journals.journal_hash = '${journal_hash}'`;
    const manuscripts = await connection.execute(sql);
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

app.listen(port, () => console.log(`Listening on port ${port}`));