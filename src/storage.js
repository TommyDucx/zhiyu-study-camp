/* Zhiyu Study Camp — progress repository.
 *
 * One adapter over Web Storage. account/session keys retain the prototype's
 * namespace so existing local progress survives the refactor.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZYStorage = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const KEYS = Object.freeze({
    accounts: 'zhiyu.accounts.v1',
    session: 'zhiyu.session.v1',
    guest: 'zhiyu.guest.v1',
    progressPrefix: 'zhiyu.progress.v1.',
  });

  function createStore(storage) {
    if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
      throw new Error('A Web Storage compatible adapter is required.');
    }

    function read(key, fallback) {
      try {
        const value = storage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    function write(key, value) {
      try {
        storage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    }

    function remove(key) {
      try {
        storage.removeItem(key);
        return true;
      } catch (error) {
        return false;
      }
    }

    function accounts() {
      const value = read(KEYS.accounts, []);
      return Array.isArray(value) ? value : [];
    }

    function saveAccounts(value) {
      return write(KEYS.accounts, Array.isArray(value) ? value : []);
    }

    function session() {
      const value = read(KEYS.session, null);
      return typeof value === 'string' ? value : null;
    }

    function saveSession(userId) {
      return userId ? write(KEYS.session, userId) : remove(KEYS.session);
    }

    function clearSession() {
      return remove(KEYS.session);
    }

    function loadProgress(userId, normalize) {
      const key = userId ? KEYS.progressPrefix + userId : KEYS.guest;
      const raw = read(key, null);
      return typeof normalize === 'function' ? normalize(raw) : raw;
    }

    function saveProgress(userId, state) {
      const key = userId ? KEYS.progressPrefix + userId : KEYS.guest;
      return write(key, state);
    }

    return Object.freeze({
      keys: KEYS,
      read,
      write,
      remove,
      accounts,
      saveAccounts,
      session,
      saveSession,
      clearSession,
      loadProgress,
      saveProgress,
    });
  }

  return Object.freeze({ createStore, keys: KEYS });
});
