/**
 * Local storage abstraction with safe fallback
 */
export const storageService = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`manganai_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`manganai_${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`manganai_${key}`);
      return true;
    } catch {
      return false;
    }
  },
};
