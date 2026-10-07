const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

function database(query, env = {}, overrides = {}, localEnv = {}) {
  const poolConfig = { host: 'old-host', socketPath: '/cloudsql/test-instance', user: 'test', connectionLimit: 2, ...overrides };
  const originalConfig = { ...poolConfig };
  let selectedConfig;
  let pools = 0;
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(path.join(__dirname, '../app/model/db.js'), 'utf8'), {
    module, exports: module.exports, console: { log() {} },
    process: { env }, __dirname: path.join(__dirname, '../app/model'),
    require(name) {
      if (name === '../../config') return { pool: poolConfig };
      if (name === 'path') return path;
      if (name === 'dotenv') return { config(options) {
        assert.equal(options.path, path.join(__dirname, '../.env.local'));
        for (const [key, value] of Object.entries(localEnv)) {
          if (env[key] === undefined) env[key] = value;
        }
      } };
      assert.equal(name, 'mysql2');
      return { createPool(config) {
        pools += 1;
        selectedConfig = config;
        assert.deepEqual(poolConfig, originalConfig, 'The source config must not be mutated');
        assert.equal(config.user, poolConfig.user);
        assert.equal(config.connectionLimit, poolConfig.connectionLimit);
        assert.equal(config.authPlugins, undefined);
        return { query };
      } };
    },
  });
  return { db: module.exports, get pools() { return pools; }, get config() { return selectedConfig; } };
}

test('DB_HOST selects TCP and removes the socket option', () => {
  const { config } = database(() => {}, { DB_HOST: ' 192.0.2.10 ' });
  assert.equal(config.host, '192.0.2.10');
  assert.equal('socketPath' in config, false);
});

test('unset or blank DB_HOST defaults to the socket and ignores an old host', () => {
  for (const env of [{}, { DB_HOST: '' }, { DB_HOST: '  ' }]) {
    const { config } = database(() => {}, env);
    assert.equal(config.socketPath, '/cloudsql/test-instance');
    assert.equal('host' in config, false);
  }
});

test('local IP is loaded but an existing environment setting takes precedence', () => {
  assert.equal(database(() => {}, {}, {}, { DB_HOST: '192.0.2.10' }).config.host, '192.0.2.10');
  assert.equal(database(() => {}, { DB_HOST: '192.0.2.20' }, {}, { DB_HOST: '192.0.2.10' }).config.host, '192.0.2.20');
  assert.equal(database(() => {}, { DB_HOST: '' }, {}, { DB_HOST: '192.0.2.10' }).config.socketPath, '/cloudsql/test-instance');
});

test('missing socket fails clearly unless DB_HOST is set', () => {
  assert.throws(() => database(() => {}, {}, { socketPath: undefined }), /pool.socketPath or set DB_HOST/);
  assert.equal(database(() => {}, { DB_HOST: '192.0.2.10' }, { socketPath: undefined }).config.host, '192.0.2.10');
});

test('parameterised queries share a pool and preserve parameters and results', () => {
  const rows = [{ id: 7 }];
  const params = [7];
  const command = {};
  let calls = 0;
  const connection = database((sql, values, callback) => {
    assert.equal(sql, 'SELECT id FROM posts WHERE id = ?');
    assert.equal(values, params);
    callback(null, rows);
    return command;
  });
  for (let i = 0; i < 2; i++) {
    assert.equal(connection.db.query('SELECT id FROM posts WHERE id = ?', params, (error, result) => {
      calls += 1;
      assert.equal(error, null);
      assert.equal(result, rows);
    }), command);
  }
  assert.equal(calls, 2);
  assert.equal(connection.pools, 1);
});

test('parameterless statistics queries invoke their callback once', () => {
  const rows = [{ posts_n: 10 }];
  const { db } = database((sql, params, callback) => {
    assert.equal(sql, 'SELECT count(*) AS posts_n FROM posts');
    assert.equal(params, undefined);
    callback(null, rows);
  });
  let calls = 0;
  db.query('SELECT count(*) AS posts_n FROM posts', (error, result) => {
    calls += 1;
    assert.equal(error, null);
    assert.equal(result, rows);
  });
  assert.equal(calls, 1);
});

test('database errors reach callers for both query signatures', () => {
  const failure = new Error('Database unavailable');
  const { db } = database((sql, params, callback) => callback(failure));
  let calls = 0;
  const callback = (error, result) => {
    calls += 1;
    assert.equal(error, failure);
    assert.equal(result, null);
  };
  db.query('SELECT 1', callback);
  db.query('SELECT ?', [1], callback);
  assert.equal(calls, 2);
});
