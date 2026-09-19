import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const prefixedKey = `manganai_${key}`;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
    } catch {
      // quota exceeded silently
    }
  }, [prefixedKey, storedValue]);

  return [storedValue, setStoredValue];
}
