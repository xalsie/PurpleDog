const STORAGE_PREFIX = "purple_dog";
const TOKEN_KEY = `${STORAGE_PREFIX}_token`;

const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
};

const safeLocalStorage = {
  setItem: (key: string, value: string): boolean => {
    if (!isBrowser()) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`[Storage] Error saving ${key}:`, error);
      return false;
    }
  },

  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`[Storage] Error reading ${key}:`, error);
      return null;
    }
  },

  removeItem: (key: string): boolean => {
    if (!isBrowser()) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[Storage] Error removing ${key}:`, error);
      return false;
    }
  },
};

export const storage = {

  saveToken: (token: string): boolean => {
    if (!token || token.trim() === "") {
      console.warn("[Storage] Attempted to save empty token");
      return false;
    }
    return safeLocalStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    const token = safeLocalStorage.getItem(TOKEN_KEY);
    return token && token.trim() !== "" ? token : null;
  },


  clearToken: (): boolean => {
    return safeLocalStorage.removeItem(TOKEN_KEY);
  },

  hasToken: (): boolean => {
    const token = storage.getToken();
    return token !== null && token.length > 0;
  },

  clearAll: (): boolean => {
    return safeLocalStorage.removeItem(TOKEN_KEY);
  },

  getAuthData: () => {
    return {
      token: storage.getToken(),
      hasToken: storage.hasToken(),
    };
  },
};