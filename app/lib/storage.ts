// lib/storage.ts
// Safe localStorage utilities with error handling

export const safeGetItem = (key: string, fallback: string = ''): string => {
  try {
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(key) || fallback;
  } catch (error) {
    console.error(`localStorage read error for key "${key}":`, error);
    return fallback;
  }
};

export const safeSetItem = (key: string, value: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`localStorage write error for key "${key}":`, error);
    // Could be quota exceeded, privacy mode, etc.
    return false;
  }
};

export const safeRemoveItem = (key: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`localStorage remove error for key "${key}":`, error);
    return false;
  }
};

export const safeParseJSON = <T,>(str: string, fallback: T): T => {
  try {
    if (!str || str === '') return fallback;
    return JSON.parse(str) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
};

export const safeStringifyJSON = (obj: any): string | null => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return null;
  }
};

// Combined get and parse
export const getJSON = <T,>(key: string, fallback: T): T => {
  const str = safeGetItem(key);
  return safeParseJSON(str, fallback);
};

// Combined stringify and set
export const setJSON = (key: string, value: any): boolean => {
  const str = safeStringifyJSON(value);
  if (str === null) return false;
  return safeSetItem(key, str);
};
