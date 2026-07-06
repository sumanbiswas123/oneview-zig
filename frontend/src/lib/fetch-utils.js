/**
 * Fetch Utilities - Timeout-wrapped fetch with AbortController
 * Provides safe HTTP request handling with automatic timeouts and cancellation
 * 
 * @module fetch-utils
 */

/**
 * Fetch with timeout support using AbortController
 * Automatically cancels request if it takes longer than specified timeout
 * 
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {number} timeoutMs - Timeout in milliseconds (default: 8000)
 * @returns {Promise<Response>} - Fetch response promise
 * @throws {Error} - Throws if request timeout or fails
 * 
 * @example
 * try {
 *   const response = await fetchWithTimeout('https://api.example.com/data', {}, 5000);
 *   const data = await response.json();
 * } catch (error) {
 *   console.error('Fetch failed:', error.message);
 * }
 */
export function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  })
    .then((response) => {
      clearTimeout(timeoutId);
      return response;
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      throw error;
    });
}

/**
 * Get request - shorthand for GET requests with timeout
 * @param {string} url - URL to fetch
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
export function getWithTimeout(url, timeoutMs = 8000) {
  return fetchWithTimeout(url, { method: "GET" }, timeoutMs);
}

/**
 * Post request - shorthand for POST requests with timeout
 * @param {string} url - URL to post to
 * @param {Object} data - Data to send (will be JSON stringified)
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
export function postWithTimeout(url, data, timeoutMs = 8000) {
  return fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    timeoutMs,
  );
}
