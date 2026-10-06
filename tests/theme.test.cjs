const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(`${__dirname}/../script.js`, 'utf8');

function openPage({ system = 'dark', saved, media = 'modern', blockedStorage = false } = {}) {
  const root = { dataset: {} };
  const metas = { 'color-scheme': {}, 'theme-color': {} };
  const documentEvents = {};
  const storage = new Map(saved ? [['jh-peng-theme', saved]] : []);
  const queries = {};
  const toggle = {
    hidden: true,
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, listener) { this[name] = listener; },
  };
  const window = {};
  if (media !== 'missing') window.matchMedia = (query) => {
    if (media === 'throwing') throw new Error('Unavailable');
    const mode = query.includes(': dark') ? 'dark' : 'light';
    const result = { matches: system === mode };
    result[media === 'legacy' ? 'addListener' : 'addEventListener'] = (...args) => {
      result.listener = args.at(-1);
    };
    queries[mode] = result;
    return result;
  };
  const document = {
    documentElement: root,
    addEventListener(name, listener) { documentEvents[name] = listener; },
    getElementById() { return {}; },
    querySelector(selector) {
      if (selector === '.theme-toggle') return toggle;
      return metas[selector.match(/name="([^"]+)"/)[1]];
    },
    querySelectorAll() { return []; },
  };
  vm.runInNewContext(source, {
    window, document,
    localStorage: {
      getItem(key) {
        if (blockedStorage) throw new Error('Denied');
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        if (blockedStorage) throw new Error('Denied');
        storage.set(key, value);
      },
    },
  });
  // The theme and browser metadata must be ready before the page body loads.
  assert.equal(metas['color-scheme'].content, root.dataset.theme);
  documentEvents.DOMContentLoaded();
  return {
    root, metas, toggle, storage,
    changeSystem(mode) {
      for (const name of ['dark', 'light']) queries[name].matches = name === mode;
      for (const query of Object.values(queries)) query.listener();
    },
  };
}

test('new visits follow light and dark system preferences and live changes', () => {
  for (const system of ['light', 'dark']) {
    const page = openPage({ system });
    assert.equal(page.root.dataset.theme, system);
    assert.equal(page.root.dataset.themePreference, 'system');
    const next = system === 'light' ? 'dark' : 'light';
    page.changeSystem(next);
    assert.equal(page.root.dataset.theme, next);
    assert.equal(page.metas['color-scheme'].content, next);
    assert.equal(page.metas['theme-color'].content, next === 'dark' ? '#171b24' : '#f8f7f4');
    assert.match(page.toggle.attributes['aria-label'], new RegExp(`System \\(${next}\\)`));
  }
});

test('missing, failing, or unrecognized system preferences default to dark', () => {
  for (const options of [{ media: 'missing' }, { media: 'throwing' }, { system: 'unknown' }]) {
    assert.equal(openPage(options).root.dataset.theme, 'dark');
  }
});

test('manual preferences persist until the user returns to system mode', () => {
  const page = openPage({ system: 'light', saved: 'dark' });
  assert.equal(page.root.dataset.theme, 'dark');
  page.changeSystem('dark');
  page.changeSystem('light');
  assert.equal(page.root.dataset.theme, 'dark');
  page.toggle.click(); // dark -> system
  assert.equal(page.root.dataset.theme, 'light');
  assert.equal(page.storage.get('jh-peng-theme'), 'system');
  page.changeSystem('dark');
  assert.equal(page.root.dataset.theme, 'dark');
  page.toggle.click(); // system -> light
  assert.equal(page.storage.get('jh-peng-theme'), 'light');
  page.toggle.click(); // light -> dark
  assert.equal(page.storage.get('jh-peng-theme'), 'dark');
  assert.equal(openPage({ system: 'dark', saved: 'light' }).root.dataset.theme, 'light');
});

test('saved system mode and invalid preferences follow the system', () => {
  for (const saved of ['system', 'invalid']) {
    assert.equal(openPage({ system: 'light', saved }).root.dataset.theme, 'light');
  }
});

test('blocked storage still permits automatic and manual switching', () => {
  const page = openPage({ system: 'dark', blockedStorage: true });
  page.changeSystem('light');
  assert.equal(page.root.dataset.theme, 'light');
  page.toggle.click();
  page.toggle.click();
  assert.equal(page.root.dataset.theme, 'dark');
  assert.equal(page.toggle.hidden, false);
});

test('older matchMedia listeners support live system changes', () => {
  const page = openPage({ media: 'legacy' });
  page.changeSystem('light');
  assert.equal(page.root.dataset.theme, 'light');
});
