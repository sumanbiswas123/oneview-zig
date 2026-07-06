import { APP_STORAGE_NAMESPACE } from "./app-env.js";
import { trackNamedClickEvent } from "./click-tracking.js";
import { STORAGE_KEYS } from "./app-runtime.js";

export const ONEVIEW_SHARED_STORAGE_PREFIX = `${APP_STORAGE_NAMESPACE}.shared.`;
export const ONEVIEW_SHARED_STORAGE_REGISTRY_KEY =
  STORAGE_KEYS.sharedStorageRegistry;
export const ONEVIEW_EMBEDDED_TRACKING_PREFIX =
  `${APP_STORAGE_NAMESPACE}.shared.tracking.`;
const ONEVIEW_EMBEDDED_TRACKING_MAX_EVENTS = 5;

let syncInitialized = false;

function normalizeSharedStorageKey(value = "") {
  const key = String(value || "").trim();
  return /^[A-Za-z0-9._:-]{1,120}$/.test(key) ? key : "";
}

function buildStorageKey(key = "") {
  return `${ONEVIEW_SHARED_STORAGE_PREFIX}${key}`;
}

function buildTrackingStorageKey(appId = "") {
  return `${ONEVIEW_EMBEDDED_TRACKING_PREFIX}${appId}`;
}

function safeParseJson(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (_err) {
    return fallback;
  }
}

function readRegistry() {
  try {
    return safeParseJson(
      localStorage.getItem(ONEVIEW_SHARED_STORAGE_REGISTRY_KEY),
      {},
    );
  } catch (_err) {
    return {};
  }
}

function writeRegistry(registry) {
  try {
    localStorage.setItem(
      ONEVIEW_SHARED_STORAGE_REGISTRY_KEY,
      JSON.stringify(registry || {}),
    );
  } catch (_err) {}
}

export function mirrorOneviewSharedStorageEntry(payload = {}) {
  const key = normalizeSharedStorageKey(payload.key);
  if (!key) return;

  const storageKey = payload.storageKey || buildStorageKey(key);
  const value = payload.value === undefined ? null : payload.value;

  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (_err) {}

  const registry = readRegistry();
  registry[key] = {
    storageKey,
    updatedAt: String(payload.updatedAt || new Date().toISOString()),
    appId: String(payload.appId || ""),
    sourceUrl: String(payload.sourceUrl || ""),
  };
  writeRegistry(registry);
}

export function removeMirroredOneviewSharedStorageEntry(payload = {}) {
  const key = normalizeSharedStorageKey(payload.key);
  if (!key) return;

  const registry = readRegistry();
  const storageKey = payload.storageKey || registry[key]?.storageKey;

  if (storageKey) {
    try {
      localStorage.removeItem(storageKey);
    } catch (_err) {}
  }

  delete registry[key];
  writeRegistry(registry);
}

export function clearMirroredOneviewSharedStorage() {
  const registry = readRegistry();

  Object.values(registry).forEach((entry) => {
    const storageKey = String(entry?.storageKey || "");
    if (!storageKey) return;
    try {
      localStorage.removeItem(storageKey);
    } catch (_err) {}
  });

  try {
    const prefixedKeys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ONEVIEW_SHARED_STORAGE_PREFIX)) {
        prefixedKeys.push(key);
      }
    }
    prefixedKeys.forEach((key) => localStorage.removeItem(key));
  } catch (_err) {}

  try {
    localStorage.removeItem(ONEVIEW_SHARED_STORAGE_REGISTRY_KEY);
  } catch (_err) {}
}

export function mirrorOneviewEmbeddedTrackingEntry(payload = {}) {
  const appId = normalizeSharedStorageKey(payload.appId);
  if (!appId) return;

  const storageKey = payload.storageKey || buildTrackingStorageKey(appId);
  const entry =
    payload.entry && typeof payload.entry === "object"
      ? { ...payload.entry }
      : payload.entry === undefined
        ? null
        : payload.entry;

  if (entry && Array.isArray(entry.events)) {
    entry.events = entry.events.slice(-ONEVIEW_EMBEDDED_TRACKING_MAX_EVENTS);
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(entry));
  } catch (_err) {}
}

export function clearMirroredOneviewEmbeddedTracking(appId = "") {
  const normalizedAppId = normalizeSharedStorageKey(appId);

  if (normalizedAppId) {
    try {
      localStorage.removeItem(buildTrackingStorageKey(normalizedAppId));
    } catch (_err) {}
    return;
  }

  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ONEVIEW_EMBEDDED_TRACKING_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (_err) {}
}

function syncEntriesFromMain(entries = {}) {
  Object.entries(entries).forEach(([key, entry]) => {
    mirrorOneviewSharedStorageEntry({
      key,
      storageKey: entry?.storageKey,
      value: entry?.value,
      updatedAt: entry?.updatedAt,
      appId: entry?.appId,
      sourceUrl: entry?.sourceUrl,
    });
  });
}

export async function initializeOneviewSharedStorageSync() {
  if (syncInitialized) return;
  syncInitialized = true;

  if (!window.api) return;

  if (typeof window.api.listOneviewSharedStorage === "function") {
    try {
      const result = await window.api.listOneviewSharedStorage();
      if (result?.success && result.entries) {
        syncEntriesFromMain(result.entries);
      }
    } catch (err) {
      console.warn("Could not sync OneView shared storage from main", err);
    }
  }

  if (typeof window.api.onOneviewSharedStorageUpdated === "function") {
    window.api.onOneviewSharedStorageUpdated((payload) => {
      mirrorOneviewSharedStorageEntry(payload);
    });
  }

  if (typeof window.api.onOneviewSharedStorageRemoved === "function") {
    window.api.onOneviewSharedStorageRemoved((payload) => {
      removeMirroredOneviewSharedStorageEntry(payload);
    });
  }

  if (typeof window.api.onOneviewSharedStorageCleared === "function") {
    window.api.onOneviewSharedStorageCleared(() => {
      clearMirroredOneviewSharedStorage();
    });
  }

  if (typeof window.api.listOneviewEmbeddedTracking === "function") {
    try {
      const result = await window.api.listOneviewEmbeddedTracking();
      if (result?.success && result.entries) {
        Object.entries(result.entries).forEach(([appId, entry]) => {
          mirrorOneviewEmbeddedTrackingEntry({
            appId,
            storageKey: entry?.storageKey,
            entry,
          });
        });
      }
    } catch (err) {
      console.warn("Could not sync OneView embedded tracking from main", err);
    }
  }

  if (typeof window.api.onOneviewEmbeddedTrackingUpdated === "function") {
    window.api.onOneviewEmbeddedTrackingUpdated((payload) => {
      console.log("[OneView Tracking] Embedded tracking payload received", payload);
      mirrorOneviewEmbeddedTrackingEntry(payload);

      const eventName = String(payload?.latestEvent?.eventName || "").trim();
      console.log(eventName,"eventName")
      if (!eventName) {
        console.warn(
          "[OneView Tracking] Embedded tracking payload missing eventName",
          payload,
        );
        return;
      }

      const occurredAt =
        String(payload?.latestEvent?.payload?.clickedAt || "").trim() ||
        String(payload?.latestEvent?.trackedAt || "").trim();

      void trackNamedClickEvent({
        currentSelectedTicketId: window.currentActiveTicketKey || "",
        eventName,
        occurredAt,
      });
    });
  }

  if (typeof window.api.onOneviewEmbeddedTrackingCleared === "function") {
    window.api.onOneviewEmbeddedTrackingCleared((payload) => {
      clearMirroredOneviewEmbeddedTracking(payload?.appId || "");
    });
  }
}

export function getMirroredOneviewSharedStorageValue(key) {
  const normalizedKey = normalizeSharedStorageKey(key);
  if (!normalizedKey) return null;

  const storageKey = buildStorageKey(normalizedKey);
  try {
    return safeParseJson(localStorage.getItem(storageKey), null);
  } catch (_err) {
    return null;
  }
}

export function getMirroredOneviewSharedStorageRegistry() {
  return readRegistry();
}

export function getMirroredOneviewEmbeddedTracking(appId) {
  const normalizedAppId = normalizeSharedStorageKey(appId);
  if (!normalizedAppId) return null;

  try {
    return safeParseJson(
      localStorage.getItem(buildTrackingStorageKey(normalizedAppId)),
      null,
    );
  } catch (_err) {
    return null;
  }
}
