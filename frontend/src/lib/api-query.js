import { getActiveBackendUrl } from "./app-env.js";

/**
 * Builds a query URL for the consolidated /api/data endpoint.
 *
 * @param {string} collection - The collection name (e.g. "resources", "issues", "users")
 * @param {Object} filters - Key-value map of filters. Operators can be formatted as field__operator (e.g. created__gte)
 * @param {Object} [options] - Additional query options like limit, page, sort_by, sort_order, baseUrl
 * @returns {string} The full URL
 */
export function buildDataQueryUrl(collection, filters = {}, options = {}) {
  const baseUrl = options.baseUrl || getActiveBackendUrl();
  const url = new URL(`${baseUrl}/api/data`);
  url.searchParams.set("collection", collection);

  if (options.limit !== undefined) {
    url.searchParams.set("limit", String(options.limit));
  }
  if (options.page !== undefined) {
    url.searchParams.set("page", String(options.page));
  }
  if (options.sort_by) {
    url.searchParams.set("sort_by", String(options.sort_by));
    if (options.sort_order) {
      url.searchParams.set("sort_order", String(options.sort_order));
    }
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== "") {
          url.searchParams.append(key, String(v));
        }
      });
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Fetches data from the consolidated /api/data endpoint.
 *
 * @param {string} collection - Collection name
 * @param {Object} filters - Query filters
 * @param {Object} [options] - Fetch and query options
 * @returns {Promise<{ data: Array, meta: Object }>}
 */
export async function queryDataApi(collection, filters = {}, options = {}) {
  const targetUrl = buildDataQueryUrl(collection, filters, options);
  const timeoutMs = options.timeoutMs || 8000;
  const res = await fetch(targetUrl, {
    signal: AbortSignal.timeout(timeoutMs),
    ...options.fetchOptions,
  });

  if (!res.ok) {
    throw new Error(`Data query for '${collection}' failed with status ${res.status}`);
  }

  const payload = await res.json();
  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    meta: payload?.meta || {},
  };
}
