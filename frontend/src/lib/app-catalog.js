import { IS_PRODUCTION_APP_BUILD } from "./app-env.js";

function normalizeProductionFlag(value) {
  if (typeof value === "boolean") return value;

  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return true;
}

export function isAppVisibleInCurrentBuild(app) {
  let userRole = "production";
  let envMode = "prod";
  try {
    userRole = String(localStorage.getItem("userRole") || "production").trim().toLowerCase();
    envMode = String(localStorage.getItem("oneview_env_mode") || "prod").trim().toLowerCase();
  } catch (_e) {}

  // Only show production: false apps if active mode is 'dev' AND user is dev or qc
  if (envMode === "dev" && (userRole === "dev" || userRole === "qc")) {
    return true;
  }

  // In production mode (or for production users), only show production: true apps
  return normalizeProductionFlag(app?.production);
}

export function filterAppsForCurrentBuild(apps) {
  if (!Array.isArray(apps)) return [];
  return apps.filter(isAppVisibleInCurrentBuild);
}
