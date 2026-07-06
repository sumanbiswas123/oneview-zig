/**
 * Request Cache - Promise-based request deduplication
 * Prevents duplicate simultaneous requests for the same resource
 * Uses TTL (time-to-live) to keep fresh data while avoiding redundant calls
 * 
 * @module request-cache
 */

/**
 * Create a request cache with automatic deduplication
 * If a request is already in flight for the same parameters, returns the existing promise
 * Once cached, subsequent calls return the cached value until TTL expires
 * 
 * @param {Function} resolver - Async function that performs the actual request
 *                              Should accept the cache key as argument
 * @param {number} ttlMs - Time-to-live for cached data in milliseconds (default: 30000)
 * @returns {Object} - Cache object with `get(key, ...args)` method
 * 
 * @example
 * // Create cache for user data with 30 second TTL
 * const userCache = createRequestCache(
 *   (empId) => fetch(`/api/users/${empId}`).then(r => r.json()),
 *   30000
 * );
 * 
 * // First call fetches fresh data
 * const user1 = await userCache.get('emp_id_1');
 * 
 * // Second call (within 30s) returns cached data
 * const user1cached = await userCache.get('emp_id_1');
 * 
 * // Different ID fetches fresh data
 * const user2 = await userCache.get('emp_id_2');
 * 
 * // Clear specific cache entry
 * userCache.clear('emp_id_1');
 * 
 * // Clear all cached entries
 * userCache.clearAll();
 */
export function createRequestCache(resolver, ttlMs = 30000) {
  const cache = new Map(); // { key: { data, timestamp, promise } }

  /**
   * Get cached data or initiate new request
   * @param {string} key - Cache key (usually a resource ID/identifier)
   * @returns {Promise<any>} - Promised cached or fresh data
   */
  function get(key) {
    const now = Date.now();
    const cached = cache.get(key);

    // Return valid cached data if available
    if (cached && now - cached.timestamp < ttlMs) {
      return Promise.resolve(cached.data);
    }

    // Return in-flight promise if request is already happening
    if (cached && cached.promise) {
      return cached.promise;
    }

    // Initiate new request
    const promise = Promise.resolve()
      .then(() => resolver(key))
      .then((data) => {
        cache.set(key, {
          data,
          timestamp: Date.now(),
          promise: null, // Clear the in-flight promise once resolved
        });
        return data;
      })
      .catch((error) => {
        // Keep the promise in cache while request is in flight, but clear on error
        cache.delete(key);
        throw error;
      });

    // Store in-flight promise to deduplicate concurrent requests
    cache.set(key, { promise, timestamp: now });

    return promise;
  }

  /**
   * Clear specific cache entry
   * @param {string} key - Cache key to clear
   */
  function clear(key) {
    cache.delete(key);
  }

  /**
   * Clear all cached entries
   */
  function clearAll() {
    cache.clear();
  }

  /**
   * Get cache size (for debugging)
   * @returns {number}
   */
  function size() {
    return cache.size;
  }

  return { get, clear, clearAll, size };
}
