const rawAppEnv = String(import.meta.env.VITE_ONEVIEW_APP_ENV || "dev")
  .trim()
  .toLowerCase();

export const APP_BUILD_ENV =
  rawAppEnv === "prod" || rawAppEnv === "production" ? "prod" : "dev";

export const IS_DEV_APP_BUILD = APP_BUILD_ENV === "dev";
export const IS_PRODUCTION_APP_BUILD = APP_BUILD_ENV === "prod";
export const APP_DISPLAY_NAME = IS_PRODUCTION_APP_BUILD
  ? "OneView"
  : "OneView Dev";
export const APP_PROTOCOL_SCHEME = IS_PRODUCTION_APP_BUILD
  ? "oneview"
  : "oneview-dev";
export const APP_PROTOCOL_PREFIX = `${APP_PROTOCOL_SCHEME}://`;
export const APP_STORAGE_NAMESPACE = IS_PRODUCTION_APP_BUILD
  ? "oneview.app"
  : "oneview.dev";
export const APP_PARTITION_NAMESPACE = APP_PROTOCOL_SCHEME;

export const PROD_SERVICE_BASE_URL = "http://10.215.56.196:8009";
export const DEV_SERVICE_BASE_URL = "http://10.215.56.196:8001";

export function getActiveBackendUrl() {
  try {
    const envMode = localStorage.getItem("oneview_env_mode");
    if (envMode === "dev") {
      return DEV_SERVICE_BASE_URL;
    }
  } catch (_e) {}
  return PROD_SERVICE_BASE_URL;
}

export const APP_SERVICE_BASE_URL = getActiveBackendUrl();

export const RESOURCE_SERVICE_BASE_URL = "http://10.215.56.196:5000";
export const EXTENSIONS_RELEASES_URL =
  "https://raw.githubusercontent.com/dikshantgoel-WPP/automation-store/refs/heads/main/releases.json";
export const DEV_ACCESS_LIST_URL =
  "https://raw.githubusercontent.com/dikshantgoel-WPP/automation-store/refs/heads/main/dev.json";
export const QC_ACCESS_LIST_URL =
  "https://raw.githubusercontent.com/dikshantgoel-WPP/automation-store/refs/heads/main/qc.json";

export function buildAppStorageKey(key = "") {
  return `${APP_STORAGE_NAMESPACE}.${String(key || "").trim()}`;
}

export function buildAppSessionStorageKey(key = "") {
  return `${APP_STORAGE_NAMESPACE}.session.${String(key || "").trim()}`;
}

export function buildAppPartitionName(name = "") {
  const normalized = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `persist:${APP_PARTITION_NAMESPACE}-${normalized || "guest"}`;
}

export function normalizeAppPartitionName(name = "", fallbackName = "guest") {
  const raw = String(name || "").trim();
  if (!raw) return buildAppPartitionName(fallbackName);

  if (raw.startsWith("persist:")) {
    const suffix = raw.slice("persist:".length);
    const expectedPrefix = `${APP_PARTITION_NAMESPACE}-`;
    if (suffix.startsWith(expectedPrefix)) return raw;
    return buildAppPartitionName(suffix);
  }

  return buildAppPartitionName(raw);
}

export function isAppProtocolUrl(url = "") {
  return String(url || "").startsWith(APP_PROTOCOL_PREFIX);
}
