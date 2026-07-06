/**
 * StorageManager - Centralized localStorage access with error handling
 * Provides safe, consistent access to localStorage throughout the application
 */

export class StorageManager {
  constructor() {
    this.silentMode = false; // Set to true to suppress error logs
  }

  /**
   * Safely get an item from localStorage
   * @param {string} key - The storage key
   * @param {*} fallback - Optional fallback value if key not found or error occurs
   * @returns {string|*} The stored value or fallback
   */
  getItem(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : fallback;
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`[StorageManager] Failed to get item '${key}':`, error);
      }
      return fallback;
    }
  }

  /**
   * Safely set an item in localStorage
   * @param {string} key - The storage key
   * @param {string} value - The value to store (must be string)
   * @returns {boolean} True if successful, false otherwise
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`[StorageManager] Failed to set item '${key}':`, error);
      }
      return false;
    }
  }

  /**
   * Safely remove an item from localStorage
   * @param {string} key - The storage key
   * @returns {boolean} True if successful, false otherwise
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`[StorageManager] Failed to remove item '${key}':`, error);
      }
      return false;
    }
  }

  /**
   * Safely get and parse JSON from localStorage
   * @param {string} key - The storage key
   * @param {*} fallback - Optional fallback value if parsing fails
   * @returns {*} Parsed JSON value or fallback
   */
  getJSON(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`[StorageManager] Failed to parse JSON for '${key}':`, error);
      }
      return fallback;
    }
  }

  /**
   * Safely set an object as JSON in localStorage
   * @param {string} key - The storage key
   * @param {*} value - The value to serialize and store
   * @returns {boolean} True if successful, false otherwise
   */
  setJSON(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`[StorageManager] Failed to serialize/set JSON for '${key}':`, error);
      }
      return false;
    }
  }

  /**
   * Safely get item as trimmed string
   * @param {string} key - The storage key
   * @returns {string} Trimmed string value or empty string
   */
  getString(key) {
    try {
      const value = localStorage.getItem(key) || "";
      return String(value).trim();
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`[StorageManager] Failed to get string for '${key}':`, error);
      }
      return "";
    }
  }

  /**
   * Safely check if a key exists in localStorage
   * @param {string} key - The storage key
   * @returns {boolean} True if key exists, false otherwise
   */
  hasKey(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`[StorageManager] Failed to check key '${key}':`, error);
      }
      return false;
    }
  }

  /**
   * Safely clear all items from localStorage
   * @returns {boolean} True if successful, false otherwise
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      if (!this.silentMode) {
        console.warn("[StorageManager] Failed to clear storage:", error);
      }
      return false;
    }
  }

  /**
   * Enable/disable silent error logging
   * @param {boolean} silent - True to suppress error logs
   */
  setSilentMode(silent) {
    this.silentMode = Boolean(silent);
  }
}

// Export singleton instance for convenience
export const storage = new StorageManager();
