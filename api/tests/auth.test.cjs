const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

function load(file, requireMock, env = {}) {
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    module, exports: module.exports, require: requireMock,
    process: { env }, __dirname: path.join(__dirname, '..'), console: { log() {} },
  });
  return module.exports;
}

function middleware(env = {}) {
  let options;
  let verifications = 0;
  const check = load('app/middleware/authMiddleware.js', name => {
    if (name === 'dotenv') return { config() {} };
    assert.equal(name, 'express-oauth2-jwt-bearer');
    return { auth(config) {
      options = config;
      return (req, res, next) => {
        verifications += 1;
        next(req.headers.authorization === 'Bearer valid-test-token' ? undefined : new Error('Unauthorized'));
      };
    } };
  }, env);
  return { check, get options() { return options; }, get verifications() { return verifications; } };
}

function request(check, method, url, authorization) {
  return new Promise(resolve => check({
    method, path: url.split('?')[0], headers: { authorization },
  }, {}, error => resolve(error)));
}

test('only the intended public reads bypass JWT verification', async () => {
  const auth = middleware();
  for (const path of ['/characters', '/episodes', '/branches', '/stats/episodes', '/stats/characters', '/stats/posts']) {
    for (const method of ['GET', 'HEAD']) {
      assert.equal(await request(auth.check, method, path), undefined);
      assert.equal(await request(auth.check, method, path + '/?status=0'), undefined);
    }
  }
  assert.equal(auth.verifications, 0);
});

test('writes, private records, and lookalike public paths require verification', async () => {
  const auth = middleware();
  const paths = ['/characters', '/episodes', '/branches', '/stats/posts'];
  const requests = paths.flatMap(path => ['POST', 'PUT', 'PATCH', 'DELETE'].map(method => [method, path]));
  for (const path of ['/latest', '/players', '/episodes/1', '/characters/1', '/episodes-extra', '/stats/posts/extra']) {
    requests.push(['GET', path]);
  }
  for (const [method, path] of requests) {
    assert.ok(await request(auth.check, method, path), `${method} ${path}`);
  }
  assert.equal(auth.verifications, requests.length);
  assert.equal(await request(auth.check, 'GET', '/latest', 'Bearer valid-test-token'), undefined);
});

test('the API audience and issuer support explicit deployment overrides', () => {
  const auth = middleware({ AUTH0_AUDIENCE: 'urn:test:api', AUTH0_ISSUER_BASE_URL: 'https://example.auth0.com/' });
  assert.equal(auth.options.audience, 'urn:test:api');
  assert.equal(auth.options.issuerBaseURL, 'https://example.auth0.com/');
});

test('the real JWT middleware rejects requests with no access token', async () => {
  const check = load('app/middleware/authMiddleware.js', name => {
    if (name === 'dotenv') return { config() {} };
    return require(name);
  });
  const error = await new Promise(resolve => check({
    method: 'GET', path: '/latest', headers: { host: 'localhost' },
    protocol: 'http', url: '/api/latest', query: {}, get: () => 'localhost', is: () => false,
  }, {}, resolve));
  assert.ok(error.status === 400 || error.status === 401, 'The SDK must reject a missing credential');
});

test('server registers authentication before API route handlers', () => {
  const events = [];
  const auth = () => {};
  const app = {
    use(...args) { events.push(['use', ...args]); },
    get() {}, post() {}, set() {}, listen() {},
  };
  const express = () => app;
  express.static = () => () => {};
  load('server.js', name => {
    const modules = {
      path, express,
      'body-parser': { json: () => () => {}, urlencoded: () => () => {} },
      nocache: () => () => {},
      './app/middleware/authMiddleware': auth,
      './app/routes/appRoutes': () => events.push(['routes']),
    };
    assert.ok(name in modules, `Unexpected import: ${name}`);
    return modules[name];
  });
  const authIndex = events.findIndex(event => event[0] === 'use' && event[1] === '/api' && event[2] === auth);
  const routesIndex = events.findIndex(event => event[0] === 'routes');
  assert.ok(authIndex >= 0 && authIndex < routesIndex);
});
