const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const getStorage = () => {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null;
  }
  return globalThis.localStorage;
};

export const sessionStorageAdapter = {
  TOKEN_KEY,
  USER_KEY,

  getToken() {
    return getStorage()?.getItem(TOKEN_KEY) ?? null;
  },

  setToken(token) {
    const storage = getStorage();
    if (!storage) return;
    if (token) {
      storage.setItem(TOKEN_KEY, token);
    } else {
      storage.removeItem(TOKEN_KEY);
    }
  },

  getUser() {
    const storage = getStorage();
    if (!storage) return null;
    const raw = storage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      this.clear();
      return null;
    }
  },

  setUser(user) {
    const storage = getStorage();
    if (!storage) return;
    if (user) {
      storage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      storage.removeItem(USER_KEY);
    }
  },

  save({ token, user }) {
    this.setToken(token);
    this.setUser(user);
  },

  clear() {
    const storage = getStorage();
    if (!storage) return;
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  },
};
