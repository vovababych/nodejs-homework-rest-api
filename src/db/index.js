const mongoose = require('mongoose');
require('dotenv').config();
const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection to db');
});
mongoose.connection.on('err', () => {
  console.log(`Mongoose connection error: ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Connection for DB disconnected and app terminated');
  process.exit(1);
});

module.exports = db;

// -------------------mongoDb-------------------

// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// const uriDb = process.env.URI_DB;

// const db = new MongoClient.connect(uriDb, {
//   useUnifiedTopology: true,
//   poolSize: 5,
// });

// process.on('SIGINT', async () => {
//   const client = await db;
//   client.close();
//   console.log('Connection for DB disconnected and app terminated');
//   process.exit(1);
// });
