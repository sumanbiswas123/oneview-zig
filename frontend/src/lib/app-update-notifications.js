import { EXTENSIONS_RELEASES_URL } from "./app-env.js";
import { filterAppsForCurrentBuild } from "./app-catalog.js";
import { STORAGE_KEYS } from "./app-runtime.js";

const NOTIFICATION_HISTORY_KEY = STORAGE_KEYS.notificationHistory;
const APP_UPDATE_CHECK_SESSION_KEY = STORAGE_KEYS.sharedAppUpdatesChecked;
const NOTIFICATION_RETENTION_MS = 24 * 60 * 60 * 1000;
const MAX_NOTIFICATION_ITEMS = 50;

function readStoredNotifications() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(NOTIFICATION_HISTORY_KEY) || "[]",
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch (_err) {
    return [];
  }
}

function writeStoredNotifications(history) {
  localStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(history));
}

function normalizeNotification(entry) {
  const time = new Date(entry?.time || Date.now()).toISOString();
  return {
    title: String(entry?.title || "").trim(),
    message: String(entry?.message || "").trim(),
    icon: String(entry?.icon || "").trim(),
    time,
    dedupeKey: String(entry?.dedupeKey || "").trim(),
    replaceKey: String(entry?.replaceKey || "").trim(),
  };
}

export function getNotificationHistory() {
  const cutoff = Date.now() - NOTIFICATION_RETENTION_MS;
  const history = readStoredNotifications()
    .map(normalizeNotification)
    .filter(
      (entry) =>
        entry.title &&
        entry.message &&
        Number.isFinite(new Date(entry.time).getTime()) &&
        new Date(entry.time).getTime() >= cutoff,
    )
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, MAX_NOTIFICATION_ITEMS);

  writeStoredNotifications(history);
  return history;
}

export function saveNotification(entry) {
  const normalized = normalizeNotification(entry);
  const history = getNotificationHistory();

  const filteredHistory = normalized.replaceKey
    ? history.filter(
        (item) =>
          item.replaceKey !== normalized.replaceKey &&
          item.dedupeKey !== normalized.dedupeKey &&
          !(
            item.title === normalized.title &&
            item.message === normalized.message
          ),
      )
    : history;

  if (
    normalized.dedupeKey &&
    !normalized.replaceKey &&
    filteredHistory.some((item) => item.dedupeKey === normalized.dedupeKey)
  ) {
    return { saved: false, history: filteredHistory };
  }

  filteredHistory.unshift(normalized);
  const nextHistory = filteredHistory.slice(0, MAX_NOTIFICATION_ITEMS);
  writeStoredNotifications(nextHistory);
  return { saved: true, history: nextHistory };
}

export function clearNotificationHistory() {
  localStorage.removeItem(NOTIFICATION_HISTORY_KEY);
}

export function hasActiveNotifications() {
  return getNotificationHistory().length > 0;
}

export async function checkForSharedAppUpdates({ onNewUpdate } = {}) {
  try {
    if (sessionStorage.getItem(APP_UPDATE_CHECK_SESSION_KEY) === "1") {
      return { checked: false, updates: [] };
    }
  } catch (_err) {}

  const installedApps = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.installedApps) || "{}");
    } catch (_err) {
      return {};
    }
  })();

  let latestApps = [];
  try {
    const response = await fetch(EXTENSIONS_RELEASES_URL, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      throw new Error(`Apps update check failed with ${response.status}`);
    }
    latestApps = filterAppsForCurrentBuild(await response.json());
  } catch (error) {
    console.warn("Could not check shared app updates", error);
    return { checked: false, updates: [] };
  }

  try {
    sessionStorage.setItem(APP_UPDATE_CHECK_SESSION_KEY, "1");
  } catch (_err) {}

  const updates = Object.entries(installedApps)
    .map(([appId, installedApp]) => {
      const latest = latestApps.find((app) => app.id === appId);
      if (!latest || !installedApp?.version || !latest.version) return null;
      if (String(latest.version) === String(installedApp.version)) return null;
      return latest;
    })
    .filter(Boolean);

  updates.forEach((app) => {
    const notification = {
      title: `${app.name} Update`,
      message: `v${app.version} is available.`,
      icon: "UP",
      time: new Date().toISOString(),
      dedupeKey: `app-update:${app.id}:${app.version}`,
      replaceKey: `app-update:${app.id}`,
    };
    const { saved } = saveNotification(notification);
    if (saved && typeof onNewUpdate === "function") {
      onNewUpdate(notification);
    }
  });

  return { checked: true, updates };
}
