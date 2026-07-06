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
  if (!IS_PRODUCTION_APP_BUILD) return true;
  return normalizeProductionFlag(app?.production);
}

export function filterAppsForCurrentBuild(apps) {
  if (!Array.isArray(apps)) return [];
  return apps.filter(isAppVisibleInCurrentBuild);
}
