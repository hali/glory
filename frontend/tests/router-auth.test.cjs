const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const { ref, nextTick } = require('vue');
const { createAuthGuard } = require('@auth0/auth0-vue');

async function loadScript(file, imports) {
  const context = vm.createContext({ console });
  const script = new vm.SourceTextModule(readFileSync(path.join(__dirname, '../src', file), 'utf8'), { context });
  await script.link(name => {
    const exports = imports(name);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await script.evaluate();
  return script.namespace;
}

async function routesFor(client) {
  const guard = createAuthGuard({ config: { globalProperties: { $auth0: client } } });
  const router = await loadScript('router.js', name => {
    if (name === 'vue-router') return { createRouter: config => config, createWebHistory: () => ({}) };
    if (name === '@auth0/auth0-vue') return { authGuard: guard };
    return { default: {} }; // Views don't need to mount to test navigation guards.
  });
  return router.default.routes;
}

test('all private routes use the SDK guard, while public pages remain accessible', async () => {
  const routes = await routesFor({});
  const publicPaths = ['/', '/faq', '/episodes', '/characters'];
  for (const route of routes) {
    assert.equal(typeof route.beforeEnter, publicPaths.includes(route.path) ? 'undefined' : 'function', route.path);
    assert.equal(route.components.guard, undefined, 'No unrendered guard outlet');
  }
});

test('a private deep link waits for session restoration before allowing entry', async () => {
  const client = {
    isLoading: ref(true), isAuthenticated: ref(false),
    loginWithRedirect: async () => assert.fail('A restored session should not log in again'),
  };
  const route = (await routesFor(client)).find(route => route.path === '/episode/:id');
  let completed = false;
  const navigation = route.beforeEnter({ fullPath: '/episode/114#200' }).then(result => {
    completed = true;
    return result;
  });
  await nextTick();
  assert.equal(completed, false);
  client.isAuthenticated.value = true;
  client.isLoading.value = false;
  assert.equal(await navigation, true);
});

test('a guest is redirected with the original path, query, and hash', async () => {
  let loginOptions;
  const client = {
    isLoading: ref(false), isAuthenticated: ref(false),
    loginWithRedirect: async options => { loginOptions = options; },
  };
  const route = (await routesFor(client)).find(route => route.path === '/episode/:id');
  const fullPath = '/episode/114?view=posts#200';
  assert.equal(await route.beforeEnter({ fullPath }), false);
  assert.equal(loginOptions.appState.target, fullPath);
});

test('the router is installed before Auth0 so callbacks can restore their target', async () => {
  const installed = [];
  const app = {
    config: { globalProperties: {} },
    use(plugin) { installed.push(plugin); return this; },
    component() { return this; },
    mount() {},
  };
  const router = {};
  const auth0 = {};
  await loadScript('main.js', name => {
    if (name === 'vue') return { createApp: () => app };
    if (name === './router') return { default: router };
    if (name === './plugins/auth0') return { auth0 };
    if (name === 'vue3-tabs-component') return { Tabs: {}, Tab: {} };
    return { default: {} };
  });
  assert.ok(installed.indexOf(router) < installed.indexOf(auth0));
});
