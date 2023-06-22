const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PG_HOSTNAME,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  allowExitOnIdle: false,
  idle_in_transaction_session_timeout: 0,
  idleTimeoutMillis: 0,
});

// 1) Increase poolSize

// 2) Separate connection pools for potentially slow operations

// 3) Break up one slow operation into many fast operations

// 4) Indexes

module.exports = pool;
