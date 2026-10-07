'use strict';

const mysql2 = require('mysql2');
const config = require('../../config');
const path = require('path');

// Local overrides are excluded from deployment. Existing environment variables
// take precedence; this absolute path also works when started outside api/.
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

const poolConfig = { ...config.pool };
const host = process.env.DB_HOST?.trim();
if (host) {
  poolConfig.host = host;
  delete poolConfig.socketPath;
} else {
  delete poolConfig.host;
  if (!poolConfig.socketPath) {
    throw new Error('Configure pool.socketPath or set DB_HOST for TCP database access.');
  }
}

// Shared by every model. mysql2 opens connections as needed and releases them
// after pool.query(), using its built-in database authentication handlers.
const pool = mysql2.createPool(poolConfig);

exports.query = function(query, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = undefined;
  }

  return pool.query(query, params, function(err, rows) {
    if (err) {
      console.log(err);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
};
