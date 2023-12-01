const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: '*'
}));

// Connecting to database and updating data
// let connection;
// try {
//     connection = await oracledb.getConnection({ user: "admin", password: "rewards23Review", connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=gf4419f065faf53_reviewrewards_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))" });
//             console.log("Successfully connected to Oracle Database", connection);
// } catch (err) {
//     console.log('connection db error', err);
// }

let connection;

async function run() {

  // let connection;

  try {
    console.log('starting connection');
    // Get a non-pooled connection
    connection = await oracledb.getConnection({ user: "admin", password: "rewards23Review", connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=gf4419f065faf53_peerreviewrewards_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))" });

    console.log('Connection was successful!');

  } catch (err) {
    console.log('error', err);
    console.error(err);
  } finally {
    console.log('successful');
    // if (connection) {
    //   try {
    //     await connection.close();
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  }
}

run();

app.post('/api/manuscript-submission', async(req, res) => {

  if (!connection) {
    await run();
  }

  console.log(req.body);
  const author_hash = req.body.author;
  const file_hash = req.body.file_hash;
  const timestamp = Date.now();

  try {
    const sql = `INSERT INTO authors VALUES (:1, :2)`; const binds = [ [author_hash, file_hash] ];
    await connection.executeMany(sql, binds);

    // const res = await connection.execute('select * from authors');
    // console.log(res);


    connection.commit();
  } catch (err) {
    console.log('err here', err);
  }




  // await run();
  res.send({ success: true, author_hash: author_hash, file_hash: file_hash });
});

app.get('/api/hello', async(req, res) => {
  // await run();
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));