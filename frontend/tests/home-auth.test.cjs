const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const Vue = require('@vue/compat');
const { parse } = require('@vue/compiler-sfc');

// Exercise the actual SFC and Vue watchers without a browser or a live Auth0 session.
const node = (text = '') => ({ text, children: [], parent: null });
const remove = el => {
  if (el.parent) {
    el.parent.children.splice(el.parent.children.indexOf(el), 1);
    el.parent = null;
  }
};
const renderer = Vue.createRenderer({
  createElement: () => node(),
  createText: node,
  createComment: () => node(),
  setText: (el, text) => { el.text = text; },
  setElementText: (el, text) => { el.text = text; el.children = []; },
  patchProp: () => {},
  insert(el, parent, anchor = null) {
    remove(el);
    const index = anchor ? parent.children.indexOf(anchor) : -1;
    parent.children.splice(index < 0 ? parent.children.length : index, 0, el);
    el.parent = parent;
  },
  remove,
  parentNode: el => el.parent,
  nextSibling: el => el.parent?.children[el.parent.children.indexOf(el) + 1],
});
const textContent = el => el.text + el.children.map(textContent).join('');
const flush = async () => {
  await new Promise(resolve => setImmediate(resolve));
  await Vue.nextTick();
};
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

async function mount(t, { loading = true, authenticated = false, latest = async () => [], header = false, profile = false } = {}) {
  const auth = {
    isLoading: Vue.ref(loading),
    isAuthenticated: Vue.ref(authenticated),
    user: Vue.ref(undefined),
    loginWithRedirect: async () => { calls.login += 1; },
    logout: async () => {},
  };
  const calls = { latest: 0, stats: 0, login: 0 };
  const slotComponent = {
    compatConfig: { MODE: 3 },
    render() { return Vue.h('div', this.$slots.default?.()); },
  };
  const modules = {
    'vue': Vue,
    '@auth0/auth0-vue': { useAuth0: () => auth },
    '@/components/BaseNav': { default: slotComponent },
    '../services/EpisodeService': { getLatestEpisodes: () => { calls.latest += 1; return latest(); } },
    '../services/StatsService': Object.fromEntries(
      ['getEpisodesCount', 'getCharactersCount', 'getPostsCount'].map(name => [name, async () => {
        calls.stats += 1;
        return [{ episodes_n: 1, characters_n: 2, posts_n: 3 }];
      }])
    ),
  };
  const file = path.join(__dirname, '../src', profile ? 'views/Profile.vue' : header ? 'layout/AppHeader.vue' : 'views/Home.vue');
  const { descriptor } = parse(readFileSync(file, 'utf8'));
  const context = vm.createContext({ document: {}, process: { env: { NODE_ENV: 'test' } }, console: { error() {} } });
  const script = new vm.SourceTextModule(descriptor.script.content, { context });
  await script.link(name => {
    assert.ok(modules[name], `Unexpected import: ${name}`);
    return new vm.SyntheticModule(Object.keys(modules[name]), function () {
      for (const [key, value] of Object.entries(modules[name])) this.setExport(key, value);
    }, { context });
  });
  await script.evaluate();
  const app = renderer.createApp({
    ...script.namespace.default,
    render: Vue.compile(descriptor.template.content, { compatConfig: { MODE: 2 } }),
  });
  app.config.globalProperties.$t = key => key;
  for (const name of ['card', 'base-button', 'router-link', 'icon']) app.component(name, slotComponent);
  const root = node();
  const instance = app.mount(root);
  t.after(() => app.unmount());
  return { auth, calls, instance, text: () => textContent(root) };
}

test('refresh waits for session restoration before showing the homepage or fetching data', async t => {
  const request = deferred();
  const { auth, calls, text } = await mount(t, { latest: () => request.promise });
  assert.match(text(), /checkingSession/);
  assert.doesNotMatch(text(), /gloryDescription|newPosts/);
  assert.equal(calls.latest, 0);
  assert.equal(calls.stats, 0);

  // Auth0 may publish the authenticated flag before finishing initialisation.
  auth.isAuthenticated.value = true;
  await flush();
  assert.equal(calls.latest, 0);
  auth.isLoading.value = false;
  await flush();
  assert.equal(calls.latest, 1);
  assert.match(text(), /loadingUpdates/);
  assert.doesNotMatch(text(), /gloryDescription/);

  request.resolve([{ id: 1, post_id: 10, name: 'Restored story', char_name: 'Author' }]);
  await flush();
  assert.match(text(), /Restored story/);
  assert.doesNotMatch(text(), /loadingUpdates/);
  assert.equal(calls.latest, 1);
});

test('an already authenticated visit loads updates immediately', async t => {
  const { calls, text } = await mount(t, { loading: false, authenticated: true });
  await flush();
  assert.equal(calls.latest, 1);
  assert.equal(calls.stats, 0);
  assert.match(text(), /noUpdates/);
});

test('a confirmed guest gets public data; login does not fabricate authentication', async t => {
  const { auth, calls, instance, text } = await mount(t);
  auth.isLoading.value = false;
  await flush();
  assert.match(text(), /gloryDescription/);
  assert.equal(calls.stats, 3);
  assert.equal(calls.latest, 0);
  await instance.login();
  assert.equal(calls.login, 1);
  assert.equal(auth.isAuthenticated.value, false);
  assert.equal(calls.latest, 0);

  auth.isAuthenticated.value = true;
  await flush();
  assert.equal(calls.latest, 1);
  assert.doesNotMatch(text(), /gloryDescription/);
});

test('API error responses show an error and can be retried', async t => {
  let result = { error: 'Authentication failed', status: 'AUTH_ERROR' };
  const { instance, text } = await mount(t, {
    loading: false, authenticated: true, latest: async () => result,
  });
  await flush();
  assert.match(text(), /updatesLoadError/);
  assert.doesNotMatch(text(), /noUpdates/);
  result = [];
  await instance.getLatestEpisodeData();
  await flush();
  assert.match(text(), /noUpdates/);
  assert.doesNotMatch(text(), /updatesLoadError/);
});

test('network failures show an error instead of an empty feed', async t => {
  const { text } = await mount(t, {
    loading: false, authenticated: true, latest: async () => { throw new Error('Offline'); },
  });
  await flush();
  assert.match(text(), /updatesLoadError/);
  assert.doesNotMatch(text(), /noUpdates|loadingUpdates/);
});

test('an old session response cannot overwrite the next session feed', async t => {
  const oldRequest = deferred();
  const newRequest = deferred();
  let request = oldRequest;
  const { auth, instance, text } = await mount(t, {
    loading: false, authenticated: true, latest: () => request.promise,
  });
  auth.isAuthenticated.value = false;
  await flush();
  request = newRequest;
  auth.isAuthenticated.value = true;
  await flush();
  newRequest.resolve([{ id: 2, post_id: 20, name: 'Current story' }]);
  await flush();
  oldRequest.resolve([{ id: 1, post_id: 10, name: 'Old story' }]);
  await flush();
  assert.equal(instance.episodes[0].name, 'Current story');
  assert.match(text(), /Current story/);
  assert.doesNotMatch(text(), /Old story/);
});

test('the header waits for Auth0 before displaying login or logout', async t => {
  const { auth, text } = await mount(t, { header: true });
  assert.equal(text(), '');
  auth.isAuthenticated.value = true;
  auth.isLoading.value = false;
  await flush();
  assert.match(text(), /logout/);
  assert.doesNotMatch(text(), /login/);
  auth.isAuthenticated.value = false;
  await flush();
  assert.match(text(), /login/);
  assert.doesNotMatch(text(), /logout/);
});

test('profile reacts to Auth0 user claims without an old token manager', async t => {
  const { auth, text } = await mount(t, { profile: true });
  assert.doesNotMatch(text(), /test@example.com/);
  auth.user.value = { email: 'test@example.com', name: 'Test player' };
  await flush();
  assert.match(text(), /test@example.com/);
  assert.match(text(), /Test player/);
  auth.user.value = undefined;
  await flush();
  assert.doesNotMatch(text(), /test@example.com/);
});
