// LocalStorage utility with error handling and JSON parsing
class StorageManager {
  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  // Check if localStorage is available
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e);
      return false;
    }
  }

  // Get item from localStorage
  get(key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error getting item ${key}:`, e);
      return defaultValue;
    }
  }

  // Set item in localStorage
  set(key, value) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error setting item ${key}:`, e);
      return false;
    }
  }

  // Remove item from localStorage
  remove(key) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing item ${key}:`, e);
      return false;
    }
  }

  // Clear all localStorage
  clear() {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }

  // Check if key exists
  has(key) {
    if (!this.isAvailable) return false;
    return localStorage.getItem(key) !== null;
  }

  // Get all keys
  keys() {
    if (!this.isAvailable) return [];
    return Object.keys(localStorage);
  }

  // Get all items
  getAll() {
    if (!this.isAvailable) return {};
    
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items[key] = this.get(key);
    }
    return items;
  }
}

// Create singleton instance
const storage = new StorageManager();

export default storage;