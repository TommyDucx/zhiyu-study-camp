const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, keys } = require('../src/storage.js');

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    dump: () => Object.fromEntries(values),
  };
}

test('repository writes and reads accounts and session', () => {
  const backing = memoryStorage();
  const store = createStore(backing);
  const account = { id: 'u1', username: '苜蓿' };
  assert.equal(store.saveAccounts([account]), true);
  assert.equal(store.saveSession('u1'), true);
  assert.deepEqual(store.accounts(), [account]);
  assert.equal(store.session(), 'u1');
  assert.equal(store.clearSession(), true);
  assert.equal(store.session(), null);
});

test('progress is isolated between guest and accounts', () => {
  const store = createStore(memoryStorage());
  store.saveProgress(null, { xp: 10 });
  store.saveProgress('u1', { xp: 20 });
  store.saveProgress('u2', { xp: 30 });
  assert.equal(store.loadProgress(null).xp, 10);
  assert.equal(store.loadProgress('u1').xp, 20);
  assert.equal(store.loadProgress('u2').xp, 30);
});

test('malformed JSON returns the caller fallback', () => {
  const backing = memoryStorage({ [keys.guest]: '{not-json' });
  const store = createStore(backing);
  assert.deepEqual(store.loadProgress(null, () => ({ recovered: true })), { recovered: true });
  assert.deepEqual(store.accounts(), []);
});

test('write failures are reported without throwing', () => {
  const store = createStore({
    getItem: () => null,
    setItem: () => { throw new Error('quota'); },
    removeItem: () => { throw new Error('denied'); },
  });
  assert.equal(store.saveProgress('u1', { xp: 1 }), false);
  assert.equal(store.saveSession('u1'), false);
  assert.equal(store.clearSession(), false);
});
