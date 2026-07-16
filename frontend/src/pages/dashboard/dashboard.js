import {
  closeOverlayModal,
  initializeChangePasswordModal,
  initializeProfileMenu,
  initConnectivityModal,
  openOverlayModal,
} from "../../lib/modals.js";
import { showToast } from "../../lib/notifications.js";
import { storage } from "../../lib/storage-manager.js";
import {
  checkForSharedAppUpdates,
  clearNotificationHistory,
  getNotificationHistory,
  hasActiveNotifications,
  saveNotification as persistNotification,
} from "../../lib/app-update-notifications.js";
import {
  isStandaloneExternalExeApp,
  launchStandaloneExternalExe,
} from "../../lib/external-exe.js";
import {
  cacheTrackedUserRole,
  shouldTrackAppLaunchClick,
  trackInstalledAppClick,
} from "../../lib/click-tracking.js";
import {
  APP_DISPLAY_NAME,
  APP_SERVICE_BASE_URL,
  EXTENSIONS_RELEASES_URL,
  IS_DEV_APP_BUILD,
  RESOURCE_SERVICE_BASE_URL,
  isAppProtocolUrl,
} from "../../lib/app-env.js";
import { filterAppsForCurrentBuild } from "../../lib/app-catalog.js";
import { PARTITIONS, STORAGE_KEYS } from "../../lib/app-runtime.js";
import { initializeOneviewSharedStorageSync } from "../../lib/oneview-shared-storage.js";
import {
  initConnectivityMonitor,
  stopConnectivityMonitor,
} from "../../lib/connectivity-monitor.js";
import {
  destroyDashboardWebviewSession,
  initializeWebview,
  loadUrlInWebview,
} from "../../lib/webview.js";
import {
  fetchTickets,
  getLoggedInUsername,
} from "../../lib/tickets.js";

const hostname = RESOURCE_SERVICE_BASE_URL;
const embeddedSectionCache = new Map();
const SIDEBAR_EXPANDED_CLASS = "expanded";
const LOCAL_WEB_APP_TYPES = new Set([
  "nextjs",
  "vite",
  "react",
  "angular",
  "html",
  "neutralino",
  "website",
  "vite-server",
]);

function getDashboardAppKind(app = {}) {
  const type = String(app?.type || app?.runtime || "").trim().toLowerCase();
  if (type === "oneview-extension" || type === "extension") {
    return "extension";
  } else if (type === "website") {
    return "website";
  }
  return "app";
}

function getDashboardAppKindLabel(app = {}) {
  const kind = getDashboardAppKind(app);
  if (kind === "extension") return "Extension";
  if (kind === "website") return "Web App";
  return "App";
}

let allApps = []; // Cache for all apps list
let embeddedViewBoundsSyncInterval = null;
let embeddedViewBoundsSyncTimeout = null;
let dashboardWindowIsMaximized = false;
let dashboardUserInstallationsCache = {};
let dashboardUserInstallationsFetchedAt = 0;
let dashboardUserInstallationsPromise = null;
let dashboardHomeRenderNonce = 0;
let dashboardExtensionsSnapshot = null;
let dashboardExtensionsSnapshotAt = 0;
let dashboardExtensionsSnapshotPromise = null;
let embeddedSectionLoadNonce = 0;
let dashboardStartupOverlayTimer = null;
let connectivityModalInstance = null; // Connectivity modal
let connectivityMonitorInitialized = false; // Flag to track if monitor is running
const DASHBOARD_USER_INSTALLATIONS_CACHE_TTL_MS = 30_000;
const DASHBOARD_EXTENSIONS_CACHE_TTL_MS = 15_000;
const DASHBOARD_UPDATE_TOAST_DEDUPE_MS = 30 * 60 * 1000;
let lastDashboardUpdateToastKey = "";
const dashboardUpdateToastSeenAt = new Map();
let pendingManualUpdateCheckFeedback = false;
let pendingStartupUpdateCheckFeedback = false;
let startupUpdateCheckingToastShown = false;
let manualUpdateCheckContext = {
  pending: false,
  priorDownloadedVersion: "",
};
const CONTENTGEN_ICON_LIGHT = new URL("../../assets/contentgen.webp", import.meta.url).href;
const CONTENTGEN_ICON_DARK = new URL("../../assets/contentgen-dark.webp", import.meta.url).href;

document.title = APP_DISPLAY_NAME;

function markDashboardStartup(stage, meta = {}) {
  if (!IS_DEV_APP_BUILD) return;
  try {
    if (window.api && typeof window.api.markStartup === "function") {
      void window.api.markStartup(`dashboard:${stage}`, meta);
    }
  } catch (_err) {}
}

// Loading state management
const loadingState = {
  userGreetingLoaded: false,
  ticketsLoaded: false,
  isWebviewOpen: false,
  isGuestMode: false,
};

const EXTENSIONS_URL = EXTENSIONS_RELEASES_URL;

function markDashboardSystemUpdateCheckStarted() {
  storage.setItem(STORAGE_KEYS.systemUpdateCheckStarted, "1");
}

function hasDashboardSystemUpdateCheckStarted() {
  return storage.getItem(STORAGE_KEYS.systemUpdateCheckStarted) === "1";
}

function scheduleDashboardBackgroundTask(task, delayMs = 0) {
  const run = () => {
    Promise.resolve()
      .then(task)
      .catch((error) => {
        console.warn("Dashboard background task failed", error);
      });
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: Math.max(1200, delayMs || 0) });
    return;
  }

  setTimeout(run, delayMs);
}

async function ensureDashboardSystemUpdateCheck() {
  if (!window.api?.checkForUpdates || hasDashboardSystemUpdateCheckStarted()) {
    return;
  }
  markDashboardSystemUpdateCheckStarted();
  pendingStartupUpdateCheckFeedback = true;
  if (!startupUpdateCheckingToastShown) {
    startupUpdateCheckingToastShown = true;
    showToast(
      "Checking for OneView updates in the background.",
      "info",
      3000,
    );
  }
  try {
    await window.api.checkForUpdates();
    // After system check, check for app updates too
    void scheduleDashboardBackgroundTask(checkInstalledAppsForUpdates, 2000);
  } catch (error) {
    pendingStartupUpdateCheckFeedback = false;
    console.warn(
      "Dashboard system update check failed (likely dev mode or network):",
      error?.message || error,
    );
  }
}

/**
 * Load all apps from extension catalog
 * Caches result in memory to avoid repeated fetches
 * 
 * @async
 * @returns {Promise<Array>} Array of app objects, filtered for current build
 */
async function loadAllApps() {
  if (Array.isArray(allApps) && allApps.length > 0) {
    return allApps;
  }

  try {
    const response = await fetch(EXTENSIONS_URL, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      throw new Error(`Apps list request failed with ${response.status}`);
    }

    const data = await response.json();
    allApps = filterAppsForCurrentBuild(data);
  } catch (error) {
    console.warn("Could not load dashboard apps list", error);
    allApps = [];
  }

  return allApps;
}

/**
 * Compare two semver strings (e.g. "1.2.0" and "1.1.5")
 * @param {string} v1 - Remote version
 * @param {string} v2 - Local/installed version
 * @returns {boolean} True if v1 is greater than v2
 */
function isVersionGreater(v1, v2) {
  if (!v1 || !v2) return false;
  const parse = (v) =>
    String(v || "0.0.0")
      .split("-")[0]
      .split(".")
      .map((n) => parseInt(n, 10) || 0);
  const a = parse(v1);
  const b = parse(v2);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const na = a[i] || 0;
    const nb = b[i] || 0;
    if (na > nb) return true;
    if (na < nb) return false;
  }
  return false;
}

/**
 * Check all installed apps for available updates from the catalog
 */
async function checkInstalledAppsForUpdates() {
  const installedMap = storage.getJSON(STORAGE_KEYS.installedApps, {});
  if (Object.keys(installedMap).length === 0) return;

  try {
    const catalog = await loadAllApps();
    const updatesFound = [];

    for (const app of catalog) {
      const installed = installedMap[app.id];
      if (installed && isVersionGreater(app.version, installed.version)) {
        updatesFound.push(app);
      }
    }

    if (updatesFound.length > 0) {
      const names = updatesFound.map((a) => a.name).join(", ");
      // Toast suppressed as we now show 'Update Available' overlays on individual app cards.
      saveDashboardUpdateNotification({
        title: "App Updates Available",
        message: `New versions are available for ${names}. Please update to continue using them.`,
        icon: "UP",
        dedupeKey: `apps-update:${updatesFound.map((a) => a.id).join("-")}`,
        replaceKey: "apps-update",
      });
      // Force a re-render to apply the blur effect
      void renderDashboardHomeAppsOptimized();
    }
  } catch (error) {
    console.warn("Failed to check for installed app updates", error);
  }
}

/**
 * Fetch user installation permissions and metadata
 * Uses caching with 30-second TTL to minimize API calls
 * 
 * @async
 * @param {Object} options - Options object
 * @param {boolean} options.force - Force refresh, bypass cache
 * @returns {Promise<Object>} Installation data keyed by app ID
 */
async function fetchDashboardUserInstallations({ force = false } = {}) {
  const now = Date.now();
  if (
    !force &&
    dashboardUserInstallationsFetchedAt &&
    now - dashboardUserInstallationsFetchedAt <
      DASHBOARD_USER_INSTALLATIONS_CACHE_TTL_MS
  ) {
    return dashboardUserInstallationsCache;
  }

  if (!force && dashboardUserInstallationsPromise) {
    return dashboardUserInstallationsPromise;
  }

  const empId = String(storage.getItem("username") || "").trim();
  if (!empId) {
    dashboardUserInstallationsCache = {};
    dashboardUserInstallationsFetchedAt = now;
    return {};
  }

  dashboardUserInstallationsPromise = (async () => {
    try {
      const response = await fetch(
        `${APP_SERVICE_BASE_URL}/api/user_data/${empId}`,
        {
          signal: AbortSignal.timeout(8000),
        },
      );
      if (!response.ok) {
        throw new Error(`User installations request failed with ${response.status}`);
      }

      const data = await response.json();
      dashboardUserInstallationsCache = data.installations || {};
      dashboardUserInstallationsFetchedAt = Date.now();
      return dashboardUserInstallationsCache;
    } catch (error) {
      console.warn("Failed to fetch dashboard user installations", error);
      return dashboardUserInstallationsCache || {};
    } finally {
      dashboardUserInstallationsPromise = null;
    }
  })();

  return dashboardUserInstallationsPromise;
}

async function fetchDashboardExtensionsSnapshot({ force = false } = {}) {
  const now = Date.now();
  if (
    !force &&
    dashboardExtensionsSnapshot &&
    now - dashboardExtensionsSnapshotAt < DASHBOARD_EXTENSIONS_CACHE_TTL_MS
  ) {
    return dashboardExtensionsSnapshot;
  }

  if (!force && dashboardExtensionsSnapshotPromise) {
    return dashboardExtensionsSnapshotPromise;
  }

  if (!window.api?.listBrowserExtensions) {
    dashboardExtensionsSnapshot = [];
    dashboardExtensionsSnapshotAt = now;
    return dashboardExtensionsSnapshot;
  }

  dashboardExtensionsSnapshotPromise = window.api
    .listBrowserExtensions()
    .then((extResult) => {
      dashboardExtensionsSnapshot = Array.isArray(extResult?.entries)
        ? extResult.entries
        : [];
      dashboardExtensionsSnapshotAt = Date.now();
      return dashboardExtensionsSnapshot;
    })
    .catch((error) => {
      console.warn("Failed to load local browser extensions for dashboard", error);
      return dashboardExtensionsSnapshot || [];
    })
    .finally(() => {
      dashboardExtensionsSnapshotPromise = null;
    });

  return dashboardExtensionsSnapshotPromise;
}

function mergeInstalledExtensionsSnapshot(installedMap, extensionEntries = []) {
  if (!installedMap || typeof installedMap !== "object") {
    return installedMap;
  }

  extensionEntries.forEach((ext) => {
    if (!ext || typeof ext !== "object") return;

    if (ext.id && installedMap[ext.id]) {
      installedMap[ext.id] = { ...installedMap[ext.id], ...ext };
      return;
    }

    if (!ext.path) return;
    for (const id in installedMap) {
      const installedEntry = installedMap[id];
      if (!installedEntry) continue;
      if (
        installedEntry.localPath === ext.path ||
        installedEntry.path === ext.path
      ) {
        installedMap[id] = { ...installedEntry, ...ext };
        break;
      }
    }
  });

  return installedMap;
}

function isAllDataLoaded() {
  return loadingState.userGreetingLoaded;
}

function showLoadingOverlay() {
  let overlay = document.getElementById("dashboard-loading-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "dashboard-loading-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: var(--bg-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      pointer-events: all;
    `;
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div style="
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 3px solid var(--glass-border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        "></div>
        <p style="color: var(--text-muted); margin: 0; font-size: 14px;">Loading dashboard...</p>
      </div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(overlay);
  }
  overlay.style.display = "flex";
}

function clearEmbeddedViewBoundsSync() {
  clearInterval(embeddedViewBoundsSyncInterval);
  clearTimeout(embeddedViewBoundsSyncTimeout);
  embeddedViewBoundsSyncInterval = null;
  embeddedViewBoundsSyncTimeout = null;
}

function getActiveEmbeddedViewHost() {
  const appStoreContainer = document.getElementById("app-store-container");
  if (!appStoreContainer || appStoreContainer.classList.contains("hidden")) {
    return null;
  }

  const viewContent = document.getElementById("view-page-content");
  if (!viewContent || viewContent.style.display === "none") {
    return null;
  }

  return viewContent.querySelector(".webcontent-pane.active");
}

function syncActiveEmbeddedViewBounds(forceVisible = true) {
  const activeHost = getActiveEmbeddedViewHost();
  if (!activeHost || typeof activeHost.syncBounds !== "function") {
    return;
  }

  activeHost.syncBounds(forceVisible);
}

function scheduleEmbeddedViewBoundsSync() {
  clearEmbeddedViewBoundsSync();

  requestAnimationFrame(() => {
    syncActiveEmbeddedViewBounds(true);

    // Position changes inside the dashboard shell do not always trigger ResizeObserver,
    // so we briefly resync during the maximize animation window.
    // Changed from 30ms to 50ms to match view.js and reduce main thread CPU overhead
    embeddedViewBoundsSyncInterval = setInterval(() => {
      syncActiveEmbeddedViewBounds(true);
    }, 50);

    embeddedViewBoundsSyncTimeout = setTimeout(() => {
      clearEmbeddedViewBoundsSync();
      syncActiveEmbeddedViewBounds(true);
    }, 400);
  });
}

function hideLoadingOverlay() {
  clearTimeout(dashboardStartupOverlayTimer);
  dashboardStartupOverlayTimer = null;
  const overlay = document.getElementById("dashboard-loading-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

function updateDashboardNotificationBadge() {
  const badge = document.getElementById("notification-badge");
  if (!badge) return;
  badge.style.display = hasActiveNotifications() ? "block" : "none";
}

function updateProfileMenuPosition() {
  const profileMenu = document.getElementById("profile-menu");
  if (!profileMenu) return;

  const webviewContainer = document.getElementById("web-view-container");
  const isWebviewOpen =
    webviewContainer && !webviewContainer.classList.contains("hidden");

  loadingState.isWebviewOpen = isWebviewOpen;

  if (isWebviewOpen) {
    // Position menu to the left when webview is open
    profileMenu.style.left = "0";
    profileMenu.style.right = "auto";
    profileMenu.style.transformOrigin = "top left";
  } else {
    // Default positioning to the right
    profileMenu.style.left = "auto";
    profileMenu.style.right = "0";
    profileMenu.style.transformOrigin = "top right";
  }
}

function readSidebarExpandedPreference() {
  return storage.getItem(STORAGE_KEYS.ticketSidebarExpanded) === "1";
}

function persistSidebarExpandedPreference(isExpanded) {
  storage.setItem(
    STORAGE_KEYS.ticketSidebarExpanded,
    isExpanded ? "1" : "0",
  );
}

function setSidebarExpanded(isExpanded, { persist = true } = {}) {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  const nextExpanded = Boolean(isExpanded);
  sidebar.classList.toggle(SIDEBAR_EXPANDED_CLASS, nextExpanded);
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-pressed", nextExpanded ? "true" : "false");
    toggleBtn.title = nextExpanded ? "Collapse Tickets" : "Expand Tickets";
  }
  if (persist) {
    persistSidebarExpandedPreference(nextExpanded);
  }
}

function restoreSidebarExpandedPreference() {
  setSidebarExpanded(readSidebarExpandedPreference(), { persist: false });
}

function isGuestMode() {
  return storage.getItem("username") === "Guest";
}

async function updateSynapseVisibility() {
  const synapseBtn = document.getElementById("synapse-link-btn");
  if (!synapseBtn) return;

  synapseBtn.style.display = "none";
  if (isGuestMode()) return;

  const storedEmpId = String(storage.getItem("emp_id") || "").trim();
  const usernameValue = String(storage.getItem("username") || "").trim();
  const fallbackEmpId = /^\d+$/.test(usernameValue) ? usernameValue : "";
  const currentEmpId = storedEmpId || fallbackEmpId;
  console.log("Synapse visibility lookup emp_id:", {
    storedEmpId,
    usernameValue,
    resolvedEmpId: currentEmpId,
  });
  if (!currentEmpId) return;

  try {
    const response = await fetch(`${hostname}/api/list_of_users`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const payload = await response.json();
    console.log("List of users payload:", payload);
    const users = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.users)
        ? payload.users
        : [];

    const allowedEmpIds = new Set(
      users
        .map((user) => String(user?.emp_id ?? "").trim())
        .filter(Boolean),
    );

    const canShowSynapse = allowedEmpIds.has(currentEmpId);

    synapseBtn.style.display = canShowSynapse ? "flex" : "none";
  } catch (error) {
    console.warn("Could not verify Synapse visibility", error);
    synapseBtn.style.display = "none";
  }
}

function applyGuestModeUI() {
  // Hide sidebar
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.style.display = "none";

  // Hide main content area
  const mainContent = document.querySelector("main");
  if (mainContent) mainContent.style.display = "none";

  // Hide ticket detail panel logic removed
  const ticketPanel = document.getElementById("ticket-detail-panel");
  if (ticketPanel) ticketPanel.style.display = "none";

  // Hide user greeting
  const userGreeting = document.getElementById("user-greeting");
  if (userGreeting) userGreeting.style.display = "none";

  // Hide theme toggle wrapper
  const themeToggleWrapper = document.querySelector(".theme-toggle-wrapper");
  if (themeToggleWrapper) themeToggleWrapper.style.display = "none";

  // Hide notification button
  const notificationBtn = document.getElementById("notification-btn");
  if (notificationBtn) notificationBtn.style.display = "none";

  // Hide update button
  const updateBtn = document.getElementById("update-btn");
  if (updateBtn) updateBtn.style.display = "none";

  // Hide navigation buttons that shouldn't work in guest mode
  const toolsBtn = document.getElementById("tools-btn");
  if (toolsBtn) toolsBtn.style.display = "none";

  const webviewBtn = document.getElementById("webview-btn");
  if (webviewBtn) webviewBtn.style.display = "none";

  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) homeBtn.style.display = "none";

  // Hide change icon and change password from profile menu, keep only logout
  const changeIconBtn = document.getElementById("change-icon");
  if (changeIconBtn) changeIconBtn.style.display = "none";

  const changePasswordBtn = document.getElementById("change-password");
  if (changePasswordBtn) changePasswordBtn.style.display = "none";

  // Show a guest-only message
  const appRoot = document.getElementById("app-root");
  if (appRoot) {
    const guestMessage = document.createElement("div");
    guestMessage.id = "guest-mode-message";
    guestMessage.style.cssText = `
      position: fixed;
      top: 80px;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      z-index: 1;
      pointer-events: none;
    `;
    guestMessage.innerHTML = `
      <div style="text-align: center; color: var(--text-muted);">
        <p style="font-size: 18px; margin: 0;">Guest Mode</p>
        <p style="font-size: 14px; margin: 8px 0 0 0;">Limited access - log out from the user icon</p>
      </div>
    `;
    appRoot.appendChild(guestMessage);
  }
}

async function loadAppVersion() {
  const versionEl = document.getElementById("profile-menu-version");
  if (!versionEl || !window.api?.getAppVersion) return;

  try {
    const version = await window.api.getAppVersion();
    versionEl.textContent = `Version: ${version}`;
  } catch (error) {
    console.warn("Could not load app version", error);
    versionEl.textContent = "Version: unavailable";
  }
}

async function openDetachedTabInView(url, partition, title = "Attached Tab") {
  const targetUrl = String(url || "").trim();
  if (!targetUrl) return;
  await loadViewPage();
  const openUrl = await waitForGlobalFunction("openUrlFromDashboard", 5000);
  if (typeof openUrl === "function") {
    openUrl(targetUrl, partition, title, false);
  }
}

function showDashboardUpdateToastOnce(message, dedupeKey) {
  const key = String(dedupeKey || "").trim();
  if (!key) return;
  const now = Date.now();
  const seenAt = dashboardUpdateToastSeenAt.get(key) || 0;
  if (
    lastDashboardUpdateToastKey === key ||
    (seenAt && now - seenAt < DASHBOARD_UPDATE_TOAST_DEDUPE_MS)
  ) {
    return;
  }
  lastDashboardUpdateToastKey = key;
  dashboardUpdateToastSeenAt.set(key, now);
  showToast(message, "info", 5000);
}

function saveDashboardUpdateNotification(entry = {}) {
  const title = String(entry?.title || "").trim();
  const message = String(entry?.message || "").trim();
  if (!title || !message) return;
  persistNotification({
    title,
    message,
    icon: String(entry?.icon || "UP").trim(),
    time: new Date().toISOString(),
    dedupeKey: String(entry?.dedupeKey || "").trim(),
    replaceKey: String(entry?.replaceKey || "").trim(),
  });
  updateDashboardNotificationBadge();
  const panel = document.getElementById("notification-panel");
  if (panel && !panel.classList.contains("hidden")) {
    loadNotifications();
  }
}

async function triggerManualSystemUpdateCheck() {
  if (!window.api?.checkForUpdates) {
    showToast("Update check is not available right now.", "warning");
    return;
  }

  let priorDownloadedVersion = "";
  try {
    const response = await window.api?.getCurrentUpdateStatus?.();
    const currentStatus = String(response?.state?.status || "").trim();
    const currentVersion = String(response?.state?.version || "").trim();
    if (currentStatus === "downloaded") {
      priorDownloadedVersion = currentVersion;
    }
    if (currentStatus === "available" || currentStatus === "progress") {
      showToast(
        currentVersion
          ? `Update v${currentVersion} is already downloading.`
          : "An update is already downloading.",
        "info",
        5000,
      );
      return;
    }
  } catch (_error) {}

  pendingManualUpdateCheckFeedback = true;
  manualUpdateCheckContext = {
    pending: true,
    priorDownloadedVersion,
  };
  showToast("Checking for OneView updates...", "info", 3000);

  try {
    await window.api.checkForUpdates();
  } catch (error) {
    pendingManualUpdateCheckFeedback = false;
    manualUpdateCheckContext = {
      pending: false,
      priorDownloadedVersion: "",
    };
    showToast(
      error?.message || "Could not check for updates right now.",
      "error",
      5000,
    );
  }
}

function applyDashboardUpdateStatus(payload = {}, { announce = false } = {}) {
  const btn = document.getElementById("update-btn");
  const btnLabel = document.getElementById("update-btn-label");
  if (!btn) return;

  const status = String(payload?.status || "idle").trim();
  const version = String(payload?.version || "").trim();
  const updateLabel = version ? `Update v${version}` : "Update";
  const progressPercent =
    typeof payload?.percent === "number" && Number.isFinite(payload.percent)
      ? Math.max(0, Math.min(100, Math.round(payload.percent)))
      : null;

  const setUpdateButtonMode = ({ visible, progress = false, label = "" } = {}) => {
    btn.classList.toggle("hidden", !visible);
    btn.style.display = visible ? "flex" : "none";
    btn.classList.toggle("update-btn-progress", Boolean(progress));
    if (btnLabel) {
      btnLabel.textContent = label;
      btnLabel.classList.toggle("hidden", !progress || !label);
    }
  };

  const openInstallPrompt = () => {
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.72";
    btn.title = "Opening update prompt...";

    if (
      window.api &&
      typeof window.api.showUpdateInstallPrompt === "function"
    ) {
      window.api
        .showUpdateInstallPrompt({ version })
        .catch((error) => {
          console.error("Failed to open update prompt:", error);
        })
        .finally(() => {
          btn.style.pointerEvents = "";
          btn.style.opacity = "";
          btn.title = `${updateLabel} ready - Click to install`;
        });
      return;
    }

    Promise.resolve(window.api.installUpdate()).finally(() => {
      btn.style.pointerEvents = "";
      btn.style.opacity = "";
      btn.title = `${updateLabel} ready - Click to install`;
    });
  };

  if (status === "checking") {
    setUpdateButtonMode({
      visible: true,
      progress: true,
      label: "Checking",
    });
    btn.onclick = null;
    btn.title = "Checking for updates...";
    if (pendingStartupUpdateCheckFeedback && !startupUpdateCheckingToastShown) {
      startupUpdateCheckingToastShown = true;
      showToast(
        "Checking for OneView updates in the background.",
        "info",
        3000,
      );
    }
    return;
  }

  if (status === "available" || status === "progress") {
    const isManualLatestUpgrade = manualUpdateCheckContext.pending;
    const priorDownloadedVersion = String(
      manualUpdateCheckContext.priorDownloadedVersion || "",
    ).trim();
    const isAlreadyDownloadedManualResult =
      pendingManualUpdateCheckFeedback &&
      priorDownloadedVersion &&
      version &&
      priorDownloadedVersion === version;
    if (isAlreadyDownloadedManualResult) {
      pendingManualUpdateCheckFeedback = false;
      pendingStartupUpdateCheckFeedback = false;
      setUpdateButtonMode({ visible: true, progress: false, label: "" });
      btn.title = `${updateLabel} ready - Click to install`;
      btn.onclick = openInstallPrompt;
      const downloadedMessage = `Update v${version} is already downloaded. Please install it.`;
      if (announce) {
        const downloadedToastKey = `downloaded:${version || "unknown"}`;
        showToast(downloadedMessage, "info", 5000);
        lastDashboardUpdateToastKey = downloadedToastKey;
        dashboardUpdateToastSeenAt.set(downloadedToastKey, Date.now());
        saveDashboardUpdateNotification({
          title: "OneView Update",
          message: downloadedMessage,
          icon: "OK",
          dedupeKey: `system-update:downloaded:${version || "unknown"}`,
          replaceKey: "system-update",
        });
      }
      manualUpdateCheckContext = {
        pending: false,
        priorDownloadedVersion: "",
      };
      return;
    }
    pendingManualUpdateCheckFeedback = false;
    pendingStartupUpdateCheckFeedback = false;
    setUpdateButtonMode({
      visible: true,
      progress: true,
      label: progressPercent !== null ? `${progressPercent}%` : "Downloading",
    });
    btn.onclick = null;
    btn.title = version
      ? `Update v${version} is downloading automatically`
      : "Update is downloading automatically";
    if (announce) {
      const downloadingMessage =
        isManualLatestUpgrade && version
          ? `Updating to the latest version v${version}. Downloading now.`
          : version
            ? `OneView update v${version} is available and downloading automatically.`
            : "A OneView update is available and downloading automatically.";
      if (isManualLatestUpgrade) {
        showToast(downloadingMessage, "info", 5000);
      } else {
        showDashboardUpdateToastOnce(
          downloadingMessage,
          `downloading:${version || "unknown"}`,
        );
      }
      saveDashboardUpdateNotification({
        title: "OneView Update",
        message: downloadingMessage,
        icon: "UP",
        dedupeKey: `system-update:available:${version || "unknown"}`,
        replaceKey: "system-update",
      });
    }
    manualUpdateCheckContext = {
      pending: false,
      priorDownloadedVersion: "",
    };
    return;
  }

  if (status === "downloaded") {
    const priorDownloadedVersion = String(
      manualUpdateCheckContext.priorDownloadedVersion || "",
    ).trim();
    const isAlreadyDownloadedManualResult =
      pendingManualUpdateCheckFeedback &&
      priorDownloadedVersion &&
      priorDownloadedVersion === version;
    pendingManualUpdateCheckFeedback = false;
    pendingStartupUpdateCheckFeedback = false;
    setUpdateButtonMode({ visible: true, progress: false, label: "" });
    btn.title = `${updateLabel} ready - Click to install`;
    btn.onclick = openInstallPrompt;
    if (announce) {
      const downloadedMessage =
        isAlreadyDownloadedManualResult && version
          ? `Update v${version} is already downloaded. Please install it.`
          : version
            ? `OneView update v${version} is ready to install.`
            : "A OneView update is ready to install.";
      if (isAlreadyDownloadedManualResult) {
        showToast(downloadedMessage, "info", 5000);
      } else {
        showDashboardUpdateToastOnce(
          downloadedMessage,
          `downloaded:${version || "unknown"}`,
        );
      }
      saveDashboardUpdateNotification({
        title: "OneView Update",
        message: downloadedMessage,
        icon: "OK",
        dedupeKey: `system-update:downloaded:${version || "unknown"}`,
        replaceKey: "system-update",
      });
    }
    manualUpdateCheckContext = {
      pending: false,
      priorDownloadedVersion: "",
    };
    return;
  }

  if (status === "not-available") {
    pendingStartupUpdateCheckFeedback = false;
    setUpdateButtonMode({ visible: false, progress: false, label: "" });
    btn.onclick = null;
    if (pendingManualUpdateCheckFeedback) {
      pendingManualUpdateCheckFeedback = false;
      showToast("OneView is already updated to the latest version.", "success", 4000);
    }
    manualUpdateCheckContext = {
      pending: false,
      priorDownloadedVersion: "",
    };
    return;
  }

  if (status === "error") {
    pendingManualUpdateCheckFeedback = false;
    pendingStartupUpdateCheckFeedback = false;
    manualUpdateCheckContext = {
      pending: false,
      priorDownloadedVersion: "",
    };
    setUpdateButtonMode({ visible: false, progress: false, label: "" });
    btn.onclick = null;
    if (announce && payload?.error) {
      showDashboardUpdateToastOnce(
        `Update check failed: ${payload.error}`,
        `error:${payload.error}`,
      );
      saveDashboardUpdateNotification({
        title: "OneView Update",
        message: payload.error,
        icon: "!",
        dedupeKey: `system-update:error:${payload.error}`,
        replaceKey: "system-update",
      });
    }
    return;
  }

  setUpdateButtonMode({ visible: false, progress: false, label: "" });
  btn.onclick = null;
}

async function loadStartupDiagnosticsIntoModal() {
  if (!IS_DEV_APP_BUILD) return;
  const metaEl = document.getElementById("startup-diagnostics-meta");
  const startupLogEl = document.getElementById("startup-diagnostics-startup-log");
  const perfLogEl = document.getElementById("startup-diagnostics-perf-log");
  const perfBtn = document.getElementById("startup-diagnostics-perf-btn");
  if (!metaEl || !startupLogEl || !perfLogEl) return;

  metaEl.textContent = "Loading diagnostics...";
  startupLogEl.textContent = "Loading...";
  perfLogEl.textContent = "Loading...";

  try {
    const response = await window.api?.getStartupDiagnostics?.();
    if (!response?.success) {
      throw new Error(response?.message || "Diagnostics unavailable");
    }

    const startupPath = String(response?.startup?.path || "").trim() || "Unavailable";
    const startupLines = Array.isArray(response?.startup?.lines)
      ? response.startup.lines
      : [];
    const perfPath = String(response?.perf?.path || "").trim() || "Unavailable";
    const perfEnabled = Boolean(response?.perf?.enabled);
    const perfLines = Array.isArray(response?.perf?.lines)
      ? response.perf.lines
      : [];
    const appVersion = String(response?.app?.version || "").trim() || "--";
    const packaged = Boolean(response?.app?.packaged);
    const pid = String(response?.app?.pid || "").trim() || "--";

    metaEl.textContent = [
      `Version: ${appVersion}`,
      `Packaged: ${packaged ? "yes" : "no"}`,
      `PID: ${pid}`,
      `Startup log: ${startupPath}`,
      `Perf log: ${perfPath}`,
      `Perf logging: ${perfEnabled ? "enabled" : "disabled"}`,
    ].join("\n");
    startupLogEl.textContent =
      startupLines.length > 0 ? startupLines.join("\n") : "No startup log entries found.";
    perfLogEl.textContent = perfEnabled
      ? perfLines.length > 0
        ? perfLines.join("\n")
        : "Perf logging is enabled, but no entries are available yet."
      : "Perf logging is disabled.";
    if (perfBtn) {
      perfBtn.textContent = perfEnabled
        ? "Disable Perf Logging"
        : "Enable Perf Logging";
    }
  } catch (error) {
    const message = error?.message || String(error);
    metaEl.textContent = `Could not load diagnostics.\n${message}`;
    startupLogEl.textContent = "No startup diagnostics available.";
    perfLogEl.textContent = "No perf diagnostics available.";
  }
}

function syncThemeAwareImages(root = document) {
  if (!root || typeof root.querySelectorAll !== "function") return;
  const useDarkVariant = document.body.classList.contains("dark-mode");
  root.querySelectorAll("img[data-theme-icon]").forEach((img) => {
    const themeIcon = String(img.getAttribute("data-theme-icon") || "").trim();
    let nextSrc = "";
    if (themeIcon === "contentgen") {
      nextSrc = useDarkVariant ? CONTENTGEN_ICON_DARK : CONTENTGEN_ICON_LIGHT;
    }
    if (nextSrc && img.getAttribute("src") !== nextSrc) {
      img.setAttribute("src", nextSrc);
    }
  });
}

async function openStartupDiagnosticsModal() {
  if (!IS_DEV_APP_BUILD) return;
  const modal = document.getElementById("startup-diagnostics-modal");
  if (!modal) return;
  if (modal.classList.contains("hidden")) {
    await openOverlayModal(() => {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => modal.classList.add("open")),
      );
    });
  }
  await loadStartupDiagnosticsIntoModal();
}

function formatRollbackBuildDate(value = "") {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue) return "Unknown publish date";
  const date = new Date(normalizedValue);
  if (Number.isNaN(date.getTime())) return normalizedValue;
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function closeRollbackBuildsModal() {
  const modal = document.getElementById("rollback-builds-modal");
  if (!modal || modal.classList.contains("hidden")) return;
  closeOverlayModal(() => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!modal.classList.contains("open")) modal.classList.add("hidden");
    }, 200);
  });
}

function renderRollbackBuildCards(releases = []) {
  const listEl = document.getElementById("rollback-builds-list");
  const metaEl = document.getElementById("rollback-builds-meta");
  if (!listEl) return;

  if (!Array.isArray(releases) || releases.length === 0) {
    if (metaEl) {
      metaEl.textContent =
        "No dev releases with installers were found on GitHub.";
    }
    listEl.innerHTML =
      '<div class="rollback-build-empty">No dev builds are available right now.</div>';
    return;
  }

  if (metaEl) {
    metaEl.textContent =
      "Choose a dev release to download and install. Current-version reinstall always downloads fresh from GitHub.";
  }

  listEl.innerHTML = "";
  releases.forEach((release) => {
    const card = document.createElement("div");
    card.className = "rollback-build-card";

    const copy = document.createElement("div");
    copy.className = "rollback-build-copy";

    const titleRow = document.createElement("div");
    titleRow.className = "rollback-build-title-row";

    const versionEl = document.createElement("span");
    versionEl.className = "rollback-build-version";
    versionEl.textContent = `Version ${release.version || release.tagName || "Unknown"}`;

    const chipEl = document.createElement("span");
    chipEl.className = "rollback-build-chip";
    chipEl.textContent = release.isCurrentVersion ? "Current" : "GitHub";

    titleRow.append(versionEl, chipEl);

    const metaEl2 = document.createElement("div");
    metaEl2.className = "rollback-build-meta";
    metaEl2.textContent = [
      release.name || release.tagName || "Unnamed release",
      `Published ${formatRollbackBuildDate(release.publishedAt)}`,
      release.installerAssetName || "Installer asset",
    ]
      .filter(Boolean)
      .join(" | ");

    copy.append(titleRow, metaEl2);

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "modal-btn modal-btn-primary";
    actionBtn.textContent = release.isCurrentVersion
      ? "Reinstall This Version"
      : "Download and Install";
    actionBtn.addEventListener("click", async () => {
      const originalLabel = actionBtn.textContent;
      actionBtn.disabled = true;
      actionBtn.textContent = release.isCurrentVersion
        ? "Redownloading..."
        : "Downloading...";
      if (metaEl) {
        metaEl.textContent = release.isCurrentVersion
          ? `Downloading current dev build ${release.version || release.tagName || ""} again from GitHub...`
          : `Downloading rollback build ${release.version || release.tagName || ""} from GitHub...`;
      }
      try {
        const response = await window.api?.prepareRollbackBuild?.({
          tagName: release.tagName,
          forceDownload: Boolean(release.isCurrentVersion),
        });
        if (!response?.success || !response?.release?.installerPath) {
          throw new Error(
            response?.message || "Could not download the rollback build.",
          );
        }

        const preparedRelease = response.release;
        closeRollbackBuildsModal();
        await window.api?.showUpdateInstallPrompt?.({
          mode: release.isCurrentVersion ? "reinstall" : "rollback",
          version: preparedRelease.version || release.version || "",
          installerPath: preparedRelease.installerPath,
          title: release.isCurrentVersion
            ? "Reinstall Ready"
            : "Rollback Ready",
          confirmLabel: release.isCurrentVersion
            ? "Reinstall"
            : "Install Rollback",
          message: release.isCurrentVersion
            ? `Version ${preparedRelease.version || release.version || ""} has been downloaded again from GitHub. OneView will close and launch that installer.`
            : `Version ${preparedRelease.version || release.version || ""} has been downloaded. OneView will close and launch that installer.`,
        });
      } catch (error) {
        if (metaEl) {
          metaEl.textContent =
            error?.message || "Could not prepare the rollback build.";
        }
        showToast(
          error?.message || "Could not prepare the rollback build.",
          "error",
        );
        actionBtn.disabled = false;
        actionBtn.textContent = originalLabel;
      }
    });

    card.append(copy, actionBtn);
    listEl.appendChild(card);
  });
}

async function openRollbackBuildsModal() {
  if (!IS_DEV_APP_BUILD) return;
  const modal = document.getElementById("rollback-builds-modal");
  const listEl = document.getElementById("rollback-builds-list");
  const metaEl = document.getElementById("rollback-builds-meta");
  if (!modal || !listEl) return;

  if (modal.classList.contains("hidden")) {
    await openOverlayModal(() => {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => modal.classList.add("open")),
      );
    });
  }

  if (metaEl) metaEl.textContent = "Checking GitHub for recent dev releases...";
  listEl.innerHTML =
    '<div class="rollback-build-empty">Loading available dev builds...</div>';

  const response = await window.api?.listRollbackBuilds?.();
  if (!response?.success) {
    const message =
      response?.message || "Could not load rollback builds from GitHub.";
    if (metaEl) metaEl.textContent = message;
    listEl.innerHTML = `<div class="rollback-build-empty">${message}</div>`;
    return;
  }

  renderRollbackBuildCards(response.releases || []);
}

function closeStartupDiagnosticsModal() {
  const modal = document.getElementById("startup-diagnostics-modal");
  if (!modal || modal.classList.contains("hidden")) return;
  closeOverlayModal(() => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!modal.classList.contains("open")) modal.classList.add("hidden");
    }, 200);
  });
}

function applyStartupDiagnosticsAvailability() {
  const startupDiagnosticsBtn = document.getElementById("startup-diagnostics");
  const startupDiagnosticsModal = document.getElementById("startup-diagnostics-modal");
  const rollbackBuildsModal = document.getElementById("rollback-builds-modal");

  if (IS_DEV_APP_BUILD) {
    startupDiagnosticsBtn?.classList.remove("hidden");
    return;
  }

  startupDiagnosticsBtn?.remove();
  startupDiagnosticsModal?.remove();
  rollbackBuildsModal?.remove();
}

function createDefaultBrowserStatusMarkup(status = null) {
  const statusGridEl = document.getElementById("default-browser-status");
  const summaryEl = document.getElementById("default-browser-summary");
  if (!statusGridEl) return;

  if (!status?.supported) {
    if (summaryEl) {
      summaryEl.textContent = "Unavailable";
      summaryEl.className = "default-browser-summary-chip";
    }
    statusGridEl.innerHTML = `
      <div class="default-browser-status-empty">
        Windows default-app guidance is only available on Windows.
      </div>
    `;
    return;
  }

  const checks = status?.checks || {};
  const items = [
    {
      key: "http",
      label: "HTTP",
      caption: "Standard web links",
      ok: Boolean(checks.http),
    },
    {
      key: "https",
      label: "HTTPS",
      caption: "Secure web links",
      ok: Boolean(checks.https),
    },
    {
      key: "html",
      label: ".HTML",
      caption: "HTML files",
      ok: Boolean(checks.html),
    },
    {
      key: "htm",
      label: ".HTM",
      caption: "HTM files",
      ok: Boolean(checks.htm),
    },
  ];

  const completedCount = items.filter((item) => item.ok).length;
  const allDone = completedCount === items.length;
  if (summaryEl) {
    summaryEl.textContent = allDone
      ? "All set"
      : `${completedCount}/${items.length} connected`;
    summaryEl.className = `default-browser-summary-chip${allDone ? " is-complete" : ""}`;
  }

  statusGridEl.innerHTML = items
    .map(
      (item) => `
        <div class="default-browser-status-card${item.ok ? " is-complete" : " is-pending"}" data-check="${item.key}">
          <div class="default-browser-status-icon" aria-hidden="true">
            ${item.ok ? "✓" : "!"}
          </div>
          <div class="default-browser-status-copy">
            <div class="default-browser-status-label-row">
              <span class="default-browser-status-label">${item.label}</span>
              <span class="default-browser-status-state">${item.ok ? "Ready" : "Needs setup"}</span>
            </div>
            <p>${item.caption}</p>
          </div>
        </div>
      `,
    )
    .join("");
}

async function loadDefaultBrowserStatusIntoModal() {
  const statusEl = document.getElementById("default-browser-status");
  const summaryEl = document.getElementById("default-browser-summary");
  if (summaryEl) {
    summaryEl.textContent = "Checking...";
    summaryEl.className = "default-browser-summary-chip";
  }
  if (statusEl) {
    statusEl.innerHTML = '<div class="default-browser-status-skeleton">Checking current defaults...</div>';
  }

  try {
    const response = await window.api?.getDefaultOpenHandlingStatus?.();
    if (statusEl) {
      createDefaultBrowserStatusMarkup(response);
    }
    return response || { supported: false, isDefault: false };
  } catch (error) {
    if (summaryEl) {
      summaryEl.textContent = "Unavailable";
      summaryEl.className = "default-browser-summary-chip";
    }
    if (statusEl) {
      statusEl.innerHTML = `
        <div class="default-browser-status-empty">
          Could not read default-app status.<br />
          ${error?.message || error}
        </div>
      `;
    }
    return { supported: false, isDefault: false };
  }
}

async function openDefaultBrowserModal(options = {}) {
  const modal = document.getElementById("default-browser-modal");
  const defaultsStep = document.getElementById("default-browser-step-defaults");
  const teamsStep = document.getElementById("default-browser-step-teams");
  const defaultActions = document.getElementById("default-browser-actions-defaults");
  const teamsActions = document.getElementById("default-browser-actions-teams");
  const openTeamsStepWhenDefault = Boolean(options?.openTeamsStepWhenDefault);
  if (!modal) return;
  defaultsStep?.classList.remove("hidden");
  teamsStep?.classList.add("hidden");
  defaultActions?.classList.remove("hidden");
  teamsActions?.classList.add("hidden");
  if (modal.classList.contains("hidden")) {
    await openOverlayModal(() => {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => modal.classList.add("open")),
      );
    });
  }
  const response = await loadDefaultBrowserStatusIntoModal();
  if (
    openTeamsStepWhenDefault &&
    response?.supported &&
    response?.isDefault
  ) {
    showTeamsDefaultGuideStep();
  }
}

function closeDefaultBrowserModal() {
  const modal = document.getElementById("default-browser-modal");
  if (!modal || modal.classList.contains("hidden")) return;
  closeOverlayModal(() => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!modal.classList.contains("open")) modal.classList.add("hidden");
    }, 200);
  });
}

function showTeamsDefaultGuideStep() {
  const defaultsStep = document.getElementById("default-browser-step-defaults");
  const teamsStep = document.getElementById("default-browser-step-teams");
  const defaultActions = document.getElementById("default-browser-actions-defaults");
  const teamsActions = document.getElementById("default-browser-actions-teams");
  defaultsStep?.classList.add("hidden");
  teamsStep?.classList.remove("hidden");
  defaultActions?.classList.add("hidden");
  teamsActions?.classList.remove("hidden");
}

async function maybePromptForDefaultBrowser() {
  if (isGuestMode()) return;
  const response = await loadDefaultBrowserStatusIntoModal();
  if (!response?.supported || response?.isDefault) {
    closeDefaultBrowserModal();
    return;
  }
  await openDefaultBrowserModal();
}

window.addEventListener("DOMContentLoaded", () => {
  markDashboardStartup("dom-content-loaded");
  requestAnimationFrame(() => {
    markDashboardStartup("first-animation-frame");
  });

  scheduleDashboardBackgroundTask(() => {
    markDashboardStartup("shared-storage-sync:start");
    return initializeOneviewSharedStorageSync()
      .catch((err) => {
        console.warn("Could not initialize OneView shared storage sync", err);
      })
      .finally(() => {
        markDashboardStartup("shared-storage-sync:end");
      });
  }, 150);

  // Add dashboard-mode class to prevent appstore.css from overriding styles
  document.body.classList.add("dashboard-mode");

  // Set guest mode flag in loading state
  loadingState.isGuestMode = isGuestMode();

  // Show loading overlay initially
  showLoadingOverlay();
  dashboardStartupOverlayTimer = setTimeout(() => {
    hideLoadingOverlay();
  }, 900);

  // Check if user is in guest mode and apply UI changes
  if (isGuestMode()) {
    applyGuestModeUI();
  }

  // Initialize connectivity monitor (only for non-guest users)
  if (!isGuestMode()) {
    scheduleDashboardBackgroundTask(async () => {
      markDashboardStartup("connectivity:init:start");
      console.log("[Dashboard] Initializing connectivity modal and monitor...");
      connectivityModalInstance = initConnectivityModal();

      if (!connectivityModalInstance) {
        console.error("[Dashboard] Failed to initialize connectivity modal instance");
      } else {
        console.log("[Dashboard] Connectivity modal initialized successfully");
      }

      console.log(
        `[Dashboard] Starting connectivity monitor with corpPingUrl: ${RESOURCE_SERVICE_BASE_URL}/auth/ping`
      );
      return initConnectivityMonitor({
        corpPingUrl: `${RESOURCE_SERVICE_BASE_URL}/auth/ping`,
        onModalShow: () => {
          console.log("[Dashboard] Connectivity monitor called onModalShow");
          if (connectivityModalInstance) {
            connectivityModalInstance.showModal();
          } else {
            console.warn("[Dashboard] connectivityModalInstance not available in onModalShow");
          }
        },
        onModalHide: () => {
          console.log("[Dashboard] Connectivity monitor called onModalHide");
          if (connectivityModalInstance) {
            connectivityModalInstance.hideModal();
          }
        },
        onCountdownTick: (remainingSeconds) => {
          if (connectivityModalInstance) {
            connectivityModalInstance.updateCountdown(remainingSeconds);
          }
        },
        onMaxTimeExceeded: async () => {
          console.error(
            "[Dashboard] Connectivity: Max disconnection time exceeded. Logging out..."
          );
          if (connectivityModalInstance) {
            connectivityModalInstance.hideModal();
          }
          stopConnectivityMonitor();
          connectivityMonitorInitialized = false;

          try {
            try {
              sessionStorage.clear();
            } catch (e) {
              console.warn("sessionStorage clear failed", e);
            }

            const knownKeys = [
              "emp_id",
              "username",
              "authToken",
              "accesstoken",
              "resourceName",
              "userProfilePic",
            ];
            knownKeys.forEach((k) => {
              storage.removeItem(k);
            });

            try {
              const toRemove = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;
                const k = key.toLowerCase();
                if (
                  k.includes("auth") ||
                  k.includes("token") ||
                  k.includes("session") ||
                  k.includes("access") ||
                  k.includes("emp") ||
                  k.includes("resource")
                ) {
                  toRemove.push(key);
                }
              }
              toRemove.forEach((k) => {
                storage.removeItem(k);
              });
            } catch (e) {
              console.warn("localStorage cleanup failed", e);
            }

            try {
              if (
                window.api &&
                typeof window.api.clearOneviewSharedStorage === "function"
              ) {
                await window.api.clearOneviewSharedStorage();
              }
            } catch (e) {
              console.warn("Could not clear OneView shared storage", e);
            }

            try {
              if (window.api && typeof window.api.logout === "function") {
                await window.api.logout();
              }
            } catch (e) {
              console.warn("IPC logout failed", e);
            }

            try {
              window.location.href = "../login/index.html";
            } catch (e) {
              console.error("Redirect to login failed", e);
            }
          } catch (e) {
            console.error("Logout failed", e);
          }
        },
        checkIntervalSec: 60,
        maxDisconnectionTimeSec: 300,
      })
        .then(() => {
          connectivityMonitorInitialized = true;
          console.log("[Dashboard] Connectivity monitor initialized successfully");
        })
        .catch((err) => {
          console.error("[Dashboard] Failed to initialize connectivity monitor", err);
          connectivityMonitorInitialized = false;
        })
        .finally(() => {
          markDashboardStartup("connectivity:init:end");
        });
    }, 1200);
  } else {
    console.log("[Dashboard] Skipping connectivity monitor (guest mode)");
  }

  // Initialize all modules
  initializeChangePasswordModal();
  initializeProfileMenu();
  applyStartupDiagnosticsAvailability();
  initializeWebview();
  initializeLeaveApplicationModal();
  loadAppVersion();
  scheduleDashboardBackgroundTask(async () => {
    await updateSynapseVisibility();
  }, 250);
  scheduleDashboardBackgroundTask(async () => {
    await checkForSharedAppUpdates({
      onNewUpdate: (notification) => {
        // Toast suppressed - we show 'Update Available' overlays on cards instead.
        updateDashboardNotificationBadge();
      },
    });
    updateDashboardNotificationBadge();
  }, 400);
  scheduleDashboardBackgroundTask(() => ensureDashboardSystemUpdateCheck(), 600);
  scheduleDashboardBackgroundTask(() => {
    void fetchDashboardExtensionsSnapshot().catch(() => {});
    void fetchDashboardUserInstallations().catch(() => {});
  }, 700);
  scheduleDashboardBackgroundTask(async () => {
    await loadAllApps();
    const dashboardHome = document.getElementById("dashboard-home");
    if (dashboardHome && !dashboardHome.classList.contains("hidden")) {
      renderDashboardHomeAppsOptimized();
    }
  }, 500);
  scheduleDashboardBackgroundTask(async () => {
    await maybePromptForDefaultBrowser();
  }, 900);
  scheduleDashboardSectionPrewarm();

  if (window.api?.onUpdateInstallPromptState) {
    const modal = document.getElementById("update-install-modal");
    const titleEl = document.getElementById("update-install-title");
    const messageEl = document.getElementById("update-install-message");
    const closeBtn = document.getElementById("update-install-close-btn");
    const laterBtn = document.getElementById("update-install-later-btn");
    const confirmBtn = document.getElementById("update-install-confirm-btn");

    const hideUpdateInstallModal = () => {
      if (!modal || modal.classList.contains("hidden")) return;
      closeOverlayModal(() => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        setTimeout(() => {
          if (!modal.classList.contains("open")) modal.classList.add("hidden");
        }, 200);
      });
    };

    const submitUpdateInstallAction = async (action) => {
      if (!window.api?.submitUpdateInstallPrompt) return;
      await window.api.submitUpdateInstallPrompt({ action });
    };

    const showUpdateInstallModal = async (state = {}) => {
      if (!modal) return;
      const version = String(state?.version || "").trim();
      const mode = String(state?.mode || "update").trim();
      const customTitle = String(state?.title || "").trim();
      const customMessage = String(state?.message || "").trim();
      const confirmLabel = String(state?.confirmLabel || "").trim();
      if (titleEl) {
        titleEl.textContent =
          customTitle ||
          (mode === "rollback"
            ? "Rollback Ready"
            : mode === "reinstall"
              ? "Reinstall Ready"
              : "Update Ready");
      }
      if (messageEl) {
        messageEl.textContent =
          customMessage ||
          (version
            ? `Version ${version} is ready. We will restart the app and launch the installer automatically.`
            : "A new version has been downloaded and is ready to install.");
      }
      if (confirmBtn) {
        confirmBtn.textContent =
          confirmLabel ||
          (mode === "rollback"
            ? "Install Rollback"
            : mode === "reinstall"
              ? "Reinstall"
              : "Restart and Install");
      }
      if (!modal.classList.contains("hidden")) return;
      await openOverlayModal(() => {
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
        requestAnimationFrame(() =>
          requestAnimationFrame(() => modal.classList.add("open")),
        );
      });
    };

    window.api.onUpdateInstallPromptState((state) => {
      if (state?.open) showUpdateInstallModal(state).catch(() => {});
      else hideUpdateInstallModal();
    });
    window.api.getUpdateInstallPromptState?.().then((response) => {
      if (response?.state?.open) {
        showUpdateInstallModal(response.state).catch(() => {});
      }
    });

    confirmBtn?.addEventListener("click", () => {
      submitUpdateInstallAction("install").catch((error) => {
        console.error("Failed to submit install action", error);
      });
    });
    laterBtn?.addEventListener("click", () => {
      submitUpdateInstallAction("later").catch((error) => {
        console.error("Failed to submit later action", error);
      });
    });
    closeBtn?.addEventListener("click", () => {
      submitUpdateInstallAction("later").catch((error) => {
        console.error("Failed to close update modal", error);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        submitUpdateInstallAction("later").catch(() => {});
      }
    });
  }

  if (window.api?.onDetachedTabAttachRequest) {
    window.api.onDetachedTabAttachRequest((payload) => {
      openDetachedTabInView(
        payload?.url || "",
        payload?.partition || "",
        payload?.title || "Attached Tab",
      ).catch((error) => {
        console.error("Failed to attach detached tab into main window", error);
      });
    });
  }

  if (window.api?.getCurrentUpdateStatus) {
    window.api
      .getCurrentUpdateStatus()
      .then((response) => {
        if (response?.state?.status) {
          applyDashboardUpdateStatus(response.state, { announce: false });
        }
      })
      .catch((error) => {
        console.warn("Could not restore current update status", error);
      });
  }

  // Load initial data
  if (!isGuestMode()) {
    scheduleDashboardBackgroundTask(async () => {
      markDashboardStartup("tickets:load:start");
      await fetchTickets();
      loadingState.ticketsLoaded = true;
      if (isAllDataLoaded()) {
        hideLoadingOverlay();
      }
      markDashboardStartup("tickets:load:end");
    }, 900);
  } else {
    // In guest mode, tickets are not loaded, so mark as loaded
    loadingState.ticketsLoaded = true;
  }

  // Load user greeting and mark as loaded when done
  scheduleDashboardBackgroundTask(() => {
    markDashboardStartup("greeting:load:start");
    return loadUserGreeting()
      .then(() => {
        loadingState.userGreetingLoaded = true;
        if (isAllDataLoaded()) {
          hideLoadingOverlay();
        }
      })
      .catch(() => {
        loadingState.userGreetingLoaded = true;
        if (isAllDataLoaded()) {
          hideLoadingOverlay();
        }
      })
      .finally(() => {
        markDashboardStartup("greeting:load:end");
      });
  }, 180);

  // Setup refresh button
  const refreshSidebarBtn = document.getElementById("refresh-sidebar-tickets");
  if (refreshSidebarBtn && !isGuestMode()) {
    refreshSidebarBtn.addEventListener("click", () => fetchTickets());
  }
  const sidebar = document.getElementById("sidebar");
  if (sidebar && !isGuestMode()) {
    sidebar.addEventListener("click", (e) => {
      // If clicking inside the sidebar but not on any locking/refreshing buttons,
      // and it's NOT already locked (expanded), we can optionally lock it.
      // But the requirement says "should stay expanded upon clicking the lock button".
      // Hover handled by CSS.
    });
  }
  const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
  if (sidebarToggleBtn && sidebar && !isGuestMode()) {
    sidebarToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = sidebar.classList.contains(SIDEBAR_EXPANDED_CLASS);
      setSidebarExpanded(!isExpanded);
    });
  }

  // Check for updates (Legacy removed)
  // checkForUpdates();

  // Setup Tools/Store button
  const toolsBtn = document.getElementById("tools-btn");
  const webviewButton = document.getElementById("webview-btn");
  if (toolsBtn) {
    toolsBtn.addEventListener("click", () => {
      if (isGuestMode()) {
        showToast("App Store is not available for guest users", "warning");
        return;
      }
      webviewButton.classList.remove("activeNav", "svg", "nav-icon");
      homeBtn.classList.remove("activeNav", "svg", "nav-icon");
      toolsBtn.classList.add("activeNav", "svg", "nav-icon");
      loadAppStore();
    });
  }

  const homeBtn = document.getElementById("home-btn");
  const webViewBtn = document.getElementById("webview-btn");
  const allNavBtns = document.querySelectorAll(".nav-btn");

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      if (isGuestMode()) {
        showToast("Home is not available for guest users", "warning");
        return;
      }



      homeBtn.classList.add("activeNav", "svg", "nav-icon");
      webViewBtn.classList.remove("activeNav", "svg", "nav-icon");
      toolsBtn.classList.remove("activeNav", "svg", "nav-icon");
      window.triggerHomeAction();
    });
  }

  // Setup Notification Bell
  const notificationBtn = document.getElementById("notification-btn");
  const notificationPanel = document.getElementById("notification-panel");
  if (notificationBtn && notificationPanel) {
    const closeNotificationPanel = () => {
      if (notificationPanel.classList.contains("hidden")) return;
      closeOverlayModal(() => {
        notificationPanel.classList.add("hidden");
        notificationBtn.classList.remove("activeNav");
        notificationBtn.classList.remove("svg");
        notificationBtn.classList.remove("nav-icon");
      });
    };

    notificationBtn.addEventListener("click", async (e) => {
      if (isGuestMode()) {
        showToast("Notifications are not available for guest users", "warning");
        return;
      }
      e.stopPropagation();

      if (notificationPanel.classList.contains("hidden")) {
        await openOverlayModal(() => {
          notificationBtn.classList.add("activeNav");
          notificationBtn.classList.add("svg");
          notificationBtn.classList.add("nav-icon");
          notificationPanel.classList.remove("hidden");
        });
        loadNotifications();

        // Hide badge when panel is opened
        const badge = document.getElementById("notification-badge");
        if (badge) {
          badge.style.display = "none";
        }
      } else {
        closeNotificationPanel();
      }
    });

    // Close panel when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !notificationPanel.contains(e.target) &&
        !notificationBtn.contains(e.target)
      ) {
        closeNotificationPanel();
      }
    });
  }

  const startupDiagnosticsBtn = document.getElementById("startup-diagnostics");
  const startupDiagnosticsModal = document.getElementById("startup-diagnostics-modal");
  const startupDiagnosticsCloseBtn = document.getElementById(
    "startup-diagnostics-close-btn",
  );
  const startupDiagnosticsRefreshBtn = document.getElementById(
    "startup-diagnostics-refresh-btn",
  );
  const startupDiagnosticsPerfBtn = document.getElementById(
    "startup-diagnostics-perf-btn",
  );
  const startupDiagnosticsRollbackBtn = document.getElementById(
    "startup-diagnostics-rollback-btn",
  );
  const rollbackBuildsModal = document.getElementById("rollback-builds-modal");
  const rollbackBuildsCloseBtn = document.getElementById(
    "rollback-builds-close-btn",
  );

  if (IS_DEV_APP_BUILD) {
    startupDiagnosticsBtn?.addEventListener("click", async () => {
      await openStartupDiagnosticsModal();
    });
    startupDiagnosticsCloseBtn?.addEventListener("click", () => {
      closeStartupDiagnosticsModal();
    });
    startupDiagnosticsModal?.addEventListener("click", (event) => {
      if (event.target === startupDiagnosticsModal) {
        closeStartupDiagnosticsModal();
      }
    });
    startupDiagnosticsRefreshBtn?.addEventListener("click", async () => {
      await loadStartupDiagnosticsIntoModal();
    });
    startupDiagnosticsPerfBtn?.addEventListener("click", async () => {
      try {
        const current = await window.api?.getStartupDiagnostics?.();
        const enabled = Boolean(current?.perf?.enabled);
        await window.api?.setPerfLoggingEnabled?.(!enabled);
        await loadStartupDiagnosticsIntoModal();
      } catch (error) {
        console.warn("Could not toggle perf logging", error);
      }
    });
    startupDiagnosticsRollbackBtn?.addEventListener("click", async () => {
      await openRollbackBuildsModal();
    });
    rollbackBuildsCloseBtn?.addEventListener("click", () => {
      closeRollbackBuildsModal();
    });
    rollbackBuildsModal?.addEventListener("click", (event) => {
      if (event.target === rollbackBuildsModal) {
        closeRollbackBuildsModal();
      }
    });
  }

  const defaultBrowserBtn = document.getElementById("set-default-browser");
  const defaultBrowserModal = document.getElementById("default-browser-modal");
  const defaultBrowserCloseBtn = document.getElementById(
    "default-browser-close-btn",
  );
  const defaultBrowserLaterBtn = document.getElementById(
    "default-browser-later-btn",
  );
  const defaultBrowserOpenSettingsBtn = document.getElementById(
    "default-browser-open-settings-btn",
  );
  const defaultBrowserTeamsDoneBtn = document.getElementById(
    "default-browser-teams-done-btn",
  );
  const defaultBrowserOpenTeamsBtn = document.getElementById(
    "default-browser-open-teams-btn",
  );

  defaultBrowserBtn?.addEventListener("click", async () => {
    await openDefaultBrowserModal({ openTeamsStepWhenDefault: true });
  });
  defaultBrowserCloseBtn?.addEventListener("click", () => {
    closeDefaultBrowserModal();
  });
  defaultBrowserLaterBtn?.addEventListener("click", () => {
    closeDefaultBrowserModal();
  });
  defaultBrowserModal?.addEventListener("click", (event) => {
    if (event.target === defaultBrowserModal) {
      closeDefaultBrowserModal();
    }
  });
  defaultBrowserOpenSettingsBtn?.addEventListener("click", async () => {
    try {
      const response = await window.api?.openDefaultAppSettings?.();
      if (!response?.success) {
        showToast(
          response?.message || "Could not open Windows default app settings.",
          "error",
        );
        return;
      }
      showTeamsDefaultGuideStep();
      showToast(
        "OneView Default Apps page opened. Finish the remaining HTTP, HTTPS, HTML, and HTM selections there.",
        "info",
        5000,
      );
    } catch (error) {
      showToast(
        error?.message || "Could not open Windows default app settings.",
        "error",
      );
    }
  });
  defaultBrowserTeamsDoneBtn?.addEventListener("click", () => {
    closeDefaultBrowserModal();
    showToast("Teams link preference marked as done.", "success", 3000);
  });
  defaultBrowserOpenTeamsBtn?.addEventListener("click", async () => {
    try {
      const response = await window.api?.openTeamsApp?.();
      if (!response?.success) {
        showToast(
          response?.message || "Could not open Microsoft Teams.",
          "error",
        );
        return;
      }
      closeDefaultBrowserModal();
      showToast(
        response?.fallback
          ? "Teams web opened. Go to Profile > Settings > Files and links."
          : "Teams opened. Go to Profile > Settings > Files and links.",
        "info",
        5000,
      );
    } catch (error) {
      showToast(
        error?.message || "Could not open Microsoft Teams.",
        "error",
      );
    }
  });

  // Setup Feedback Modal
  const feedbackBtn = document.getElementById("feedback-btn");
  const feedbackModal = document.getElementById("feedback-modal");
  const feedbackForm = document.getElementById("feedback-form");
  const feedbackAppSelect = document.getElementById("feedback-app-select");
  const feedbackCategorySelect = document.getElementById("feedback-category-select");
  const feedbackMessage = document.getElementById("feedback-message");
  const feedbackImageInput = document.getElementById("feedback-image");
  const feedbackImageBtn = document.getElementById("feedback-image-btn");
  const feedbackImageName = document.getElementById("feedback-image-name");
  const feedbackImagePreview = document.getElementById("feedback-image-preview");
  const feedbackImagePreviewContainer = document.getElementById("feedback-image-preview-container");
  const feedbackImageRemoveBtn = document.getElementById("feedback-image-remove-btn");
  const feedbackCloseBtn = document.getElementById("feedback-close-btn");
  const feedbackCancelBtn = document.getElementById("feedback-cancel-btn");

  let feedbackImageBase64 = null;
  let feedbackImageFile = null;

  let userId = localStorage.getItem("username");

  

  async function loadAppsForFeedback() {
    console.log("trial");
    try {
      // Fetch user's installations from API (returns array of user objects)
      const userDataRes = await fetch(`${APP_SERVICE_BASE_URL}/api/user_data/`+ userId, {
        signal: AbortSignal.timeout(5000),
      });
      
      if (!userDataRes.ok) throw new Error(`User data API returned ${userDataRes.status}`);
      const userDataArray = await userDataRes.json();
    
      
      const installations = userDataArray?.installations || {};
      
      // Fetch app catalog from GitHub
      const catalogRes = await fetch(EXTENSIONS_RELEASES_URL, {
        signal: AbortSignal.timeout(8000),
      });
      
      if (!catalogRes.ok) throw new Error(`Catalog API returned ${catalogRes.status}`);
      const appCatalog = await catalogRes.json();
      
      // Create a map of app ID to app name
      const appMap = {};
      if (Array.isArray(appCatalog)) {
        appCatalog.forEach((app) => {
          appMap[app.id] = app.name || app.id;
        });
      }
      
      // Clear existing options except placeholder and OneView
      while (feedbackAppSelect.options.length > 2) {
        feedbackAppSelect.remove(2);
      }
      
      // Add OneView (always present)
      if (feedbackAppSelect.options[1]?.value !== "oneview") {
        const oneviewOption = document.createElement("option");
        oneviewOption.value = "oneview";
        oneviewOption.textContent = "OneView";
        feedbackAppSelect.appendChild(oneviewOption);
      }
      
      // Add installed apps
      Object.keys(installations).forEach((appId) => {
        if (installations[appId] === true && appId !== "oneview") {
          console.log(appId);
          const option = document.createElement("option");
          option.value = appId;
          option.textContent = appMap[appId] || appId;
          feedbackAppSelect.appendChild(option);
        }
      });
    } catch (error) {
      console.warn("Could not load apps for feedback dropdown", error);
      // Fallback: Just show OneView option
      feedbackAppSelect.innerHTML = '<option value="">Select an app...</option><option value="oneview">OneView</option>';
    }
  }

  

  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function closeFeedbackModal() {
    if (!feedbackModal || feedbackModal.classList.contains("hidden")) return;
    closeOverlayModal(() => {
      feedbackBtn?.classList.remove("activeNav");
      feedbackModal.classList.add("hidden");
    });
  }

  function resetFeedbackForm() {
    feedbackForm?.reset();
    feedbackImageBase64 = null;
    feedbackImageFile = null;
    if (feedbackImageInput) {
      feedbackImageInput.value = "";
    }
    if (feedbackImageName) {
      feedbackImageName.textContent = "";
    }
    if (feedbackImagePreviewContainer) {
      feedbackImagePreviewContainer.classList.add("hidden");
    }
    if (feedbackImagePreview) {
      feedbackImagePreview.src = "";
    }
  }

  function collectSystemInfo() {
    const getOS = () => {
      const userAgent = navigator.userAgent;
      
      // Extract Windows version
      if (userAgent.includes("Windows NT")) {
        const match = userAgent.match(/Windows NT ([\d.]+)/);
        if (match) {
          const version = match[1];
          const versionMap = {
            "10.0": "Windows 11",
            "6.3": "Windows 8.1",
            "6.2": "Windows 8",
            "6.1": "Windows 7",
          };
          return versionMap[version] || `Windows (${version})`;
        }
      }
      if (userAgent.includes("Mac")) return "macOS";
      if (userAgent.includes("Linux")) return "Linux";
      return navigator.platform || "Unknown";
    };

    const getRAM = () => {
      try {
        const deviceMemory = navigator.deviceMemory;
        if (deviceMemory) return `${deviceMemory}GB`;
      } catch (e) {}
      return "Unknown";
    };

    const empId = storage.getItem("username") || storage.getItem("emp_id");
    return {
      emp_id: empId ? parseInt(empId, 10) : 0,
      system_specs: {
        os: getOS(),
        ram: getRAM(),
      },
    };
  }

  async function submitFeedback() {
    const appId = feedbackAppSelect.value;
    const area = feedbackCategorySelect.value;
    const feedback = feedbackMessage.value.trim();

    if (!appId || !area || !feedback) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    const feedbackSubmitBtn = document.getElementById("feedback-submit-btn");
    const originalText = feedbackSubmitBtn?.textContent || "Send Feedback";
    if (feedbackSubmitBtn) {
      feedbackSubmitBtn.disabled = true;
      feedbackSubmitBtn.textContent = "Sending...";
    }

    try {
      // Find app details
      const oneview_version = await window.api.getAppVersion();
      const selectedApp = appId === "oneview" 
        ? { id: "oneview", name: "OneView", version: oneview_version }
        : allApps.find(app => app.id === appId);

      const systemInfo = collectSystemInfo();

      const payload = {
        emp_id: systemInfo.emp_id,
        oneview_version,
        app_id: appId,
        app_version: selectedApp?.version || "unknown",
        area: area,
        feedback: feedback,
        image: feedbackImageBase64 || null,
        system_specs: systemInfo.system_specs,
      };

      const FEEDBACK_API_URL = `${APP_SERVICE_BASE_URL}/api/send-feedback`;
      
      const response = await fetch(FEEDBACK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Feedback submission failed: ${response.status}`);
      }

      resetFeedbackForm();
      closeFeedbackModal();
      setTimeout(() => {
        showToast("Thank you! Your feedback has been sent.", "success");
      }, 0);
    } catch (error) {
      console.error("Feedback submission error:", error);
      showToast("Failed to send feedback. Please try again.", "error");
    } finally {
      if (feedbackSubmitBtn) {
        feedbackSubmitBtn.disabled = false;
        feedbackSubmitBtn.textContent = originalText;
      }
    }
  }

  if (feedbackBtn) {
    feedbackBtn.addEventListener("click", async (e) => {
      e.stopPropagation();

      if (feedbackModal.classList.contains("hidden")) {
        await openOverlayModal(() => {
          feedbackBtn.classList.add("activeNav");
          feedbackModal.classList.remove("hidden");
        });
        await loadAppsForFeedback();
      } else {
        closeFeedbackModal();
      }
    });
  }

  if (feedbackCloseBtn) {
    feedbackCloseBtn.addEventListener("click", closeFeedbackModal);
  }

  if (feedbackCancelBtn) {
    feedbackCancelBtn.addEventListener("click", closeFeedbackModal);
  }

  if (feedbackImageBtn) {
    feedbackImageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      feedbackImageInput.click();
    });
  }

  if (feedbackImageInput) {
    feedbackImageInput.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          feedbackImageFile = file;
          feedbackImageBase64 = await convertImageToBase64(file);
          feedbackImageName.textContent = file.name;
          
          // Display preview
          feedbackImagePreview.src = feedbackImageBase64;
          feedbackImagePreviewContainer.classList.remove("hidden");
        } catch (error) {
          console.error("Error reading image:", error);
          showToast("Failed to read image file", "error");
        }
      }
    });
  }

  if (feedbackImageRemoveBtn) {
    feedbackImageRemoveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      feedbackImageInput.value = "";
      feedbackImageBase64 = null;
      feedbackImageFile = null;
      feedbackImageName.textContent = "";
      feedbackImagePreviewContainer.classList.add("hidden");
      feedbackImagePreview.src = "";
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitFeedback();
    });
  }

  // Close feedback modal when clicking outside
  document.addEventListener("click", (e) => {
    if (
      feedbackModal &&
      !feedbackModal.contains(e.target) &&
      !feedbackBtn.contains(e.target)
    ) {
      closeFeedbackModal();
    }
  });

  // Theme Logic
  const themeToggleBtn = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  function setTheme(theme, { broadcast = true } = {}) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      if (sunIcon) sunIcon.style.display = "block";
      if (moonIcon) moonIcon.style.display = "none";
    } else {
      document.body.classList.remove("dark-mode");
      if (sunIcon) sunIcon.style.display = "none";
      if (moonIcon) moonIcon.style.display = "block";
    }
    storage.setItem("theme", theme);
    syncThemeAwareImages();
    // Write to shared temp file so detached windows (separate processes) can sync
    if (broadcast && window.api?.webContentCall) {
      window.api.webContentCall("set-global-theme", { theme }).catch?.(() => {});
    }
  }

  // Load saved theme on startup - prefer global file over localStorage
  (async () => {
    let savedTheme = storage.getItem("theme") || "light";
    if (window.api?.webContentCall) {
      try {
        const result = await window.api.webContentCall("get-global-theme", {});
        if (result?.theme === "dark" || result?.theme === "light") {
          savedTheme = result.theme;
        }
      } catch (_) {}
    }
    setTheme(savedTheme);
  })();

  // Sync theme when window gains focus (in case another window changed it)
  window.addEventListener("focus", async () => {
    if (!window.api?.webContentCall) return;
    try {
      const result = await window.api.webContentCall("get-global-theme", {});
      const globalTheme = result?.theme === "dark" ? "dark" : "light";
      const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
      if (globalTheme !== currentTheme) {
        setTheme(globalTheme, { broadcast: false });
      }
    } catch (_) {}
  });

  // Also sync via localStorage storage event (same-process windows)
  window.addEventListener("storage", (e) => {
    if (e.key === "theme") {
      setTheme(e.newValue || "light", { broadcast: false });
    }
  });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }



  // Setup Webview/Web Hub button
  const homeButtom = document.getElementById("home-btn");
  const webviewBtn = document.getElementById("webview-btn");

  if (webviewBtn) {
    webviewBtn.addEventListener("click", () => {
      if (isGuestMode()) {
        showToast("Webview is not available for guest users", "warning");
        return;
      }
      


      allNavBtns.forEach((btn) => btn.classList.remove("activeNav"));
      homeButtom.classList.remove("activeNav", "svg", "nav-icon");
      webviewBtn.classList.add("activeNav", "svg", "nav-icon");
      toolsBtn.classList.remove("activeNav", "svg", "nav-icon");
      loadViewPage();
    });
  }

  const knowledgeBtn = document.getElementById("knowledge-link-btn");
  if (knowledgeBtn) {
    knowledgeBtn.addEventListener("click", () => {
      if (isGuestMode()) {
        showToast("Knowledge Hub is not available for guest users", "warning");
        return;
      }
      openUrlInView(
        "https://imagine.wpp.ai/chat/ZQygLJRKg3NV0LneHHii2/persona/VNFeDVdchOitvzyV5TaI6",
        PARTITIONS.wppproduction,
        "Knowledge Hub",
      );
    });
  }

   const pdftoemailBtn = document.getElementById("pdftoemail-link-btn");
  if (pdftoemailBtn) {
    pdftoemailBtn.addEventListener("click", () => {
      if (isGuestMode()) {
        showToast("Knowledge Hub is not available for guest users", "warning");
        return;
      }
      openUrlInView(
        "https://imagine.wpp.ai/chat/s4nBUM5uaqez811BYPLgS/persona/c0DXfbcFB8tHDNnGNTPr3",
        PARTITIONS.wppproduction,
        "Knowledge Hub",
      );
    });
  }

  const sitesnapBtn = document.getElementById("sitesnap-link-btn");
  if (sitesnapBtn) {
    sitesnapBtn.addEventListener("click", () => {
      const installedMap = storage.getJSON(STORAGE_KEYS.installedApps, {});
      const sitesnapApp = Object.values(installedMap).find(app => 
        app.id === "sitesnap-studio" || 
        String(app.name || "").toLowerCase().includes("sitesnap")
      );
      if (sitesnapApp) {
        if (window.api && typeof window.api.openDetachedViewWindow === "function") {
          window.api.openDetachedViewWindow({
            url: "",
            title: "SiteSnap Studio",
            partition: "sitesnap"
          }).catch(() => {});
        } else {
          showToast("Detached window API not available", "warning");
        }
      } else {
        showToast("SiteSnap Studio extension is not installed", "warning");
      }
    });
  }


  const synapseBtn = document.getElementById("synapse-link-btn");
  if (synapseBtn) {
    synapseBtn.addEventListener("click", () => {
      if (isGuestMode()) {
        showToast("synapse is not available for guest users", "warning");
        return;
      }
      openUrlInView(
        RESOURCE_SERVICE_BASE_URL,
        PARTITIONS.synapse,
        "Synapse",
      );
    });
  }

  const contentGenBtn = document.getElementById("contentgen-link-btn");
  if (contentGenBtn) {
    contentGenBtn.addEventListener("click", () => {
      openUrlInView(
        "http://10.215.56.196:3456",
        PARTITIONS.contentgen,
        "ContentGen",
      );
    });
  }

  const interactiveFrameworkBtn = document.getElementById(
    "interactive-framework-link-btn",
  );
  if (interactiveFrameworkBtn) {
    interactiveFrameworkBtn.addEventListener("click", () => {
      openUrlInView(
        "https://gskpro-com.preview-cf65.gskinternet.com/content/cf-pharma/health-hcpportal/master/interactive/epresentation/ansh_assessment.html",
        PARTITIONS.gsk,
        "Interactive Framework",
      );
    });
  }

  const veevaBtn = document.getElementById("veeva-link-btn");
  if (veevaBtn) {
    veevaBtn.addEventListener("click", () => {
      openUrlInView(
        "https://gsk-contentlab.veevavault.com/",
        PARTITIONS.gsk,
        "Veeva Vault",
      );
    });
  }

  // Route ticket links through the tabbed view so the persisted profile can
  // supply the initial partition before any page-specific profile lock applies.
  window.addEventListener("openTicketLinkInView", (e) => {
    if (e.detail && e.detail.url) {
      openUrlInView(
        e.detail.url,
        e.detail.partition || null,
        e.detail.title || "Ticket Link",
      );
    }
  });

  // Backward-compatible handler for older ticket link dispatches.
  window.addEventListener("openJiraLinkInView", (e) => {
    if (e.detail && e.detail.url) {
      openUrlInView(e.detail.url, PARTITIONS.vml, e.detail.title || "Jira");
    }
  });

  // Clear Notifications
  const clearNotifsBtn = document.getElementById("clear-notifications-btn");
  if (clearNotifsBtn) {
    clearNotifsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearNotifications();
    });
  }

  // Setup App Store Window Controls
  const appStoreCloseBtn = document.getElementById("app-store-close-btn");
  if (appStoreCloseBtn) {
    appStoreCloseBtn.addEventListener("click", () => {
      closeAppStore();
    });
  }

  const appStoreMaximizeBtn = document.getElementById("app-store-maximize-btn");
  const appStoreContainer = document.getElementById("app-store-container");
  if (appStoreMaximizeBtn && appStoreContainer) {
    appStoreMaximizeBtn.addEventListener("click", () => {
      appStoreContainer.classList.toggle("full-view-mode");
      const isFull = appStoreContainer.classList.contains("full-view-mode");

      applyAppStoreFullscreenState(isFull);
      scheduleEmbeddedViewBoundsSync();
    });
  }

  if (window.api && typeof window.api.on === "function") {
    window.api.on("window-maximized", (isMaximized) => {
      dashboardWindowIsMaximized = Boolean(isMaximized);
      scheduleEmbeddedViewBoundsSync();
    });
  }

  restoreSidebarExpandedPreference();
  window.triggerHomeAction();
});

/**
 * Load the logged-in user's first name (from employee resource) and display in top bar
 */
async function loadUserGreeting() {
  const greetingEl = document.getElementById("user-greeting");
  if (!greetingEl) return;

  // getLoggedInUsername is defined in modules/tickets.js and returns localStorage username

  let username = null;
  try {
    username = getLoggedInUsername();
  } catch (e) {
    console.warn("getLoggedInUsername not available", e);
  }

  if (!username) {
    greetingEl.textContent = "Hi!";
    return;
  }

  // If username is not a 4-digit numeric code, just display it as-is
  if (!/^\d{4}$/.test(username)) {
    greetingEl.textContent = `Hi, ${username}!`;
    return;
  }

  // Only fetch if hostname is defined and username is valid
  if (!hostname) {
    console.warn("hostname not defined, skipping greeting fetch");
    greetingEl.textContent = `Hi, ${username}!`;
    return;
  }

  // Fetch resource by numeric user id
  try {
    const res = await fetch(`${hostname}/api/resources/${username}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    cacheTrackedUserRole(data);
    const fullName =
      data &&
      (data.resource_name || data.resourceName || data.resourceNameId || null);
    if (fullName) {
      storage.setItem("resourceName", String(fullName).trim());
    }
    const firstName = fullName
      ? String(fullName).trim().split(/\s+/)[0]
      : username;
    greetingEl.textContent = `Hi, ${firstName}!`;
  } catch (err) {
    console.warn("Could not fetch resource for greeting", err);
    greetingEl.textContent = `Hi, ${username}!`;
  }
}

function waitForGlobalFunction(name, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (typeof window[name] === "function") {
        clearInterval(timer);
        resolve(window[name]);
        return;
      }
      if (Date.now() - startedAt >= timeoutMs) {
        clearInterval(timer);
        resolve(null);
      }
    }, 60);
  });
}

function getAppInitials(name = "") {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "APP";

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getAppGradient(name = "") {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
  ];

  const text = String(name || "");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash + text.charCodeAt(i) * (i + 1)) % gradients.length;
  }
  return gradients[hash];
}

function getDashboardAppIconMarkup(app = {}, appName = "") {
  const iconUrl = String(app?.iconUrl || "").trim();
  const iconText = String(app?.icon || "").trim();
  const appId = String(app?.id || "").trim().toLowerCase();
  const normalizedName = String(appName || "").trim().toLowerCase();
  const isContentGen = appId === "contentgen" || normalizedName === "contentgen";

  if (iconUrl || isContentGen) {
    const src = isContentGen ? CONTENTGEN_ICON_LIGHT : iconUrl;
    const themeAttr = isContentGen ? ' data-theme-icon="contentgen"' : "";
    return `
      <div class="dash-app-icon-frame">
        <img src="${src}" class="dash-app-icon-image" alt="${appName}"${themeAttr} />
      </div>
    `;
  }

  if (iconText) {
    return `
      <div class="dash-app-icon-frame dash-app-icon-text-frame">
        <span class="dash-app-icon-text">${iconText}</span>
      </div>
    `;
  }

  return `
    <div class="dash-app-icon-fallback" style="background: ${getAppGradient(appName)};">
      <span>${getAppInitials(appName)}</span>
    </div>
  `;
}

async function prewarmEmbeddedSectionCache(htmlPath) {
  if (embeddedSectionCache.has(htmlPath)) {
    return embeddedSectionCache.get(htmlPath);
  }

  const response = await fetch(htmlPath);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const mainContent = doc.querySelector(".main-content");
  const links = Array.from(
    doc.querySelectorAll('link[rel="stylesheet"]'),
  ).map((link) => link.getAttribute("href"));
  const scripts = Array.from(doc.querySelectorAll("script")).map((script) => ({
    src: script.getAttribute("src"),
    type: script.type || "",
    crossOrigin: script.crossOrigin || "",
    textContent: script.textContent || "",
  }));

  const cached = {
    mainContentHtml: mainContent ? mainContent.innerHTML : "",
    links,
    scripts,
  };
  embeddedSectionCache.set(htmlPath, cached);
  return cached;
}

function scheduleDashboardSectionPrewarm() {
  const run = () => {
    prewarmEmbeddedSectionCache("../view/view.html").catch(() => {});
    prewarmEmbeddedSectionCache("../appstore/appstore.html").catch(() => {});
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 2000 });
    return;
  }

  setTimeout(run, 3500);
}

function ensureEmbeddedStylesheetLoaded(href) {
  return new Promise((resolve) => {
    const normalizedHref = String(href || "").trim();
    if (!normalizedHref) {
      resolve();
      return;
    }

    let link = document.querySelector(`link[href="${normalizedHref}"]`);
    const finish = () => {
      if (link) {
        link.dataset.oneviewLoaded = "1";
      }
      resolve();
    };

    if (link) {
      if (link.dataset.oneviewLoaded === "1" || link.sheet) {
        finish();
        return;
      }
      link.addEventListener("load", finish, { once: true });
      link.addEventListener("error", finish, { once: true });
      return;
    }

    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = normalizedHref;
    link.addEventListener("load", finish, { once: true });
    link.addEventListener("error", finish, { once: true });
    document.head.appendChild(link);
  });
}

async function resolveDashboardAppUrl(appId, app) {
  const appType = String(app?.type || "").toLowerCase();
  const directUrl = String(app?.oneviewUrl || app?.url || "").trim();
  const needsRunner = ["nextjs", "next", "vite-server"].includes(appType);

  // If it's a server-dependent app (Next.js), we MUST NOT use a cached app protocol URL
  if (needsRunner && isAppProtocolUrl(directUrl)) {
    return "";
  }

  if (directUrl) return directUrl;

  if (
    app?.localPath &&
    window.api &&
    typeof window.api.resolveOneviewAppUrl === "function" &&
    LOCAL_WEB_APP_TYPES.has(appType) &&
    !needsRunner
  ) {
    try {
      const resolved = await window.api.resolveOneviewAppUrl(
        appId,
        app.localPath,
        "/",
      );
      if (resolved?.success && resolved.url) {
        const latestInstalled = storage.getJSON(STORAGE_KEYS.installedApps, {});
        if (latestInstalled[appId]) {
          latestInstalled[appId] = {
            ...latestInstalled[appId],
            oneviewUrl: resolved.url,
          };
          storage.setJSON(STORAGE_KEYS.installedApps, latestInstalled);
        }
        return resolved.url;
      }
    } catch (_err) {}
  }

  return "";
}

/**
 * Render dashboard home apps in optimized manner
 * Uses DocumentFragment for single DOM reflow instead of multiple
 * Includes render nonce to prevent stale renders when user navigates away
 * 
 * @async
 * @returns {Promise<void>}
 * @performance Uses DocumentFragment and replaceChildren() for efficient batch updates
 */
async function renderDashboardHomeAppsOptimized() {
  const grid = document.getElementById("dashboard-apps-grid");
  if (!grid) return;

  const renderNonce = ++dashboardHomeRenderNonce;
  const installedMap = storage.getJSON(STORAGE_KEYS.installedApps, {});
  mergeInstalledExtensionsSnapshot(installedMap, dashboardExtensionsSnapshot || []);

  await loadAllApps();
  if (renderNonce !== dashboardHomeRenderNonce) return;

  const userInstallations =
    dashboardUserInstallationsFetchedAt || dashboardUserInstallationsPromise
      ? await fetchDashboardUserInstallations()
      : null;
  if (renderNonce !== dashboardHomeRenderNonce) return;

  const apps = allApps
    .filter((app) => {
      if (userInstallations) {
        return userInstallations[app.id] === true;
      }
      return Boolean(installedMap[app.id]);
    })
    .map((app) => {
      const installedInfo = installedMap[app.id];
      const isInstalled = !!installedInfo;
      const hasUpdate = isInstalled && isVersionGreater(app.version, installedInfo.version);

      return {
        ...app,
        ...(installedInfo || {}),
        isInstalled,
        hasUpdate,
        disabled: !isInstalled || hasUpdate,
      };
    });

  apps.sort((a, b) => {
    // 1. Apps with updates at the very top
    if (a.hasUpdate !== b.hasUpdate) {
      return a.hasUpdate ? -1 : 1;
    }
    // 2. Then, sort by installation status (installed first)
    if (a.isInstalled !== b.isInstalled) {
      return a.isInstalled ? -1 : 1;
    }
    // 3. Finally, sort alphabetically by name (case-insensitive)
    return (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase());
  });

  if (apps.length === 0) {
    grid.innerHTML = `
      <div class="empty-dashboard-state">
        <p>No apps available for your account.</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  apps.forEach((app, index) => {
    const card = document.createElement("div");
    const isDisabled = app.disabled;
    const hasUpdate = app.hasUpdate;

    card.className = `dash-app-card ${isDisabled && !hasUpdate ? "disabled-app" : ""} ${hasUpdate ? "has-update" : ""}`;
    if (index < 10) {
      card.style.animationDelay = `${index * 35}ms`;
    }

    const appName = app.name || "Unnamed App";
    const rawChannel = String(app.channel || "App");
    const appChannel =
      rawChannel.toUpperCase() === "EDA" ? "eDA" : rawChannel.toUpperCase();
    const iconMarkup = getDashboardAppIconMarkup(app, appName);
    const appKind = getDashboardAppKind(app);
    const appKindLabel = getDashboardAppKindLabel(app);

    card.innerHTML = `
      <div class="dash-app-card-inner">
        ${iconMarkup}
        <div class="dash-app-meta">
          <h3 class="dash-app-name">${appName}</h3>
        </div>
        <div class="dash-app-tags">
          <span class="dash-app-channel">${appChannel}</span>
          <span class="dash-app-kind dash-app-kind-${appKind}">${appKindLabel}</span>
        </div>
      </div>
      ${hasUpdate ? `
        <div class="dash-app-update-overlay">
          <div class="dash-app-update-content">
            <div class="dash-app-update-name">${appName}</div>
            <button class="dash-app-update-btn" onclick="event.stopPropagation(); window.loadAppStore('installed')">
              Update Available
            </button>
          </div>
        </div>
      ` : ""}
    `;

    if (!isDisabled) {
      card.addEventListener("click", () => launchDashboardApp(app.id, app));
    } else {
      card.addEventListener("click", () => loadAppStore());
      card.title = "App available but not installed";
    }

    fragment.appendChild(card);
  });

  if (renderNonce !== dashboardHomeRenderNonce) return;
  grid.replaceChildren(fragment);
  syncThemeAwareImages(grid);

  if (!dashboardExtensionsSnapshotAt) {
    void fetchDashboardExtensionsSnapshot().then(() => {
      if (renderNonce === dashboardHomeRenderNonce) {
        renderDashboardHomeAppsOptimized();
      }
    });
  }

  if (!dashboardUserInstallationsFetchedAt && !dashboardUserInstallationsPromise) {
    void fetchDashboardUserInstallations().then(() => {
      if (renderNonce === dashboardHomeRenderNonce) {
        renderDashboardHomeAppsOptimized();
      }
    });
  }
}

function showDashboardHome() {
  const dashHome = document.getElementById("dashboard-home");
  const webviewContainer = document.getElementById("web-view-container");
  const appStoreContainer = document.getElementById("app-store-container");
  if (dashHome) dashHome.classList.remove("hidden");
  if (webviewContainer) webviewContainer.classList.add("hidden");
  if (appStoreContainer) {
    appStoreContainer.classList.remove("view-mode");
    appStoreContainer.classList.remove("full-view-mode");
    appStoreContainer.classList.add("hidden");
  }
  if (window.api?.closeBrowserExtensionPopup) {
    window.api.closeBrowserExtensionPopup().catch(() => {});
  }
  const homeButton = document.getElementById("home-btn");
  const webviewButton = document.getElementById("webview-btn");
  const toolsButton = document.getElementById("tools-btn");
  homeButton.classList.add("activeNav", "svg", "nav-icon");
  webviewButton.classList.remove("activeNav", "svg", "nav-icon");
  toolsButton.classList.remove("activeNav", "svg", "nav-icon");
  updateProfileMenuPosition();
  renderDashboardHomeAppsOptimized();
}

async function openUrlInView(
  url,
  partition,
  title,
  forceNewTab = false,
  options = {},
) {
  await loadViewPage();
  let openUrlFn = await waitForGlobalFunction("openUrlFromDashboard", 7000);
  if (openUrlFn) {
    openUrlFn(url, partition, title, forceNewTab, options);
  } else {
    console.error(
      "View page failed to initialize openUrlFromDashboard. The tab system may be unresponsive.",
    );
    // Do NOT fallback to openWebviewWithPartition here because it breaks the tab UI.
  }
}

/**
 * Launch a dashboard app
 * Handles tracking, app loading, and displays launch overlay
 * Supports external executables, local apps via protocol, and web URLs
 * 
 * @async
 * @param {string} appId - Unique application identifier
 * @param {Object} app - App metadata object
 * @returns {Promise<void>}
 * @emits Shows loading overlay and toast notifications on state changes
 */
export async function launchDashboardApp(appId, app) {
  if (!appId) return;

  // Intercept SiteSnap Studio to open in its dedicated detached mode
  if (appId === "sitesnap-studio" || String(app?.name || "").toLowerCase().includes("sitesnap")) {
    if (window.api && typeof window.api.openDetachedViewWindow === "function") {
      window.api.openDetachedViewWindow({
        url: "",
        title: "SiteSnap Studio",
        partition: "sitesnap"
      }).catch((err) => console.error("Failed to open SiteSnap Studio detached window:", err));
    } else {
      showToast("Detached window API not available", "warning");
    }
    return;
  }

  // Extensions only navigate to the View page
  if (getDashboardAppKind(app) === "extension") {
    const targetUrl = app.linkUrl || app.link || app.rootUrl || app.oneviewUrl || "";
    console.log("[Dashboard] Launching extension", {
      id: app.id,
      name: app.name,
      targetUrl,
      hasLink: !!app.linkUrl,
      hasRoot: !!app.rootUrl,
    });
    await loadViewPage(targetUrl);
    return;
  }

  const shouldTrackLaunch = shouldTrackAppLaunchClick(app);
  console.log("[OneView Tracking] Dashboard launch decision", {
    appId,
    appName: app?.name || "",
    appType: app?.type || "",
    clickTrackingMode: app?.clickTrackingMode || "",
    trackOnLaunch: app?.trackOnLaunch,
    oneviewUrl: app?.oneviewUrl || "",
    hasLocalPath: Boolean(app?.localPath),
    shouldTrackLaunch,
  });
  if (shouldTrackLaunch) {
    void trackInstalledAppClick({
      currentSelectedTicketId: window.currentActiveTicketKey || "",
      clickedAppName: app?.name || appId,
    });
  }

  // Show a launching overlay so user knows something is happening
  const dashHome = document.getElementById("dashboard-home");
  let loaderEl = document.getElementById("dash-launch-loader");
  if (!loaderEl) {
    loaderEl = document.createElement("div");
    loaderEl.id = "dash-launch-loader";
    loaderEl.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:99999",
      "display:flex",
      "flex-direction:column",
      "align-items:center",
      "justify-content:center",
      "background:rgba(15,23,42,0.45)",
      "backdrop-filter:blur(8px)",
      "-webkit-backdrop-filter:blur(8px)",
    ].join(";");
    loaderEl.innerHTML = `
      <div style="
        background:white;border-radius:20px;
        padding:32px 40px;text-align:center;
        box-shadow:0 24px 64px rgba(0,0,0,0.25);
        display:flex;flex-direction:column;
        align-items:center;gap:16px;
        min-width:220px;
      ">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:spin-dash 1s linear infinite">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b">Opening ${app?.name || "app"}…</p>
        <style>@keyframes spin-dash{to{transform:rotate(360deg)}}</style>
      </div>
    `;
    document.body.appendChild(loaderEl);
  } else {
    loaderEl.style.display = "flex";
  }
  const loaderText = loaderEl.querySelector("p");
  if (loaderText) {
    loaderText.textContent = `Opening ${app?.name || "app"}...`;
  }
  const hideLoader = () => {
    if (loaderEl) loaderEl.style.display = "none";
  };

  try {
    if (isStandaloneExternalExeApp(app)) {
      await launchStandaloneExternalExe(app);
      showToast(
        `Opened "${app?.name || "app"}" in a separate window.`,
        "info",
      );
      hideLoader();
      return;
    }

    await loadViewPage();

    const resolvedUrl = await resolveDashboardAppUrl(appId, app);
    if (resolvedUrl) {
      await openUrlInView(resolvedUrl, PARTITIONS.guest, app?.name || "App", true, {
        trackingAppId: appId,
        trackingAppName: app?.name || "App",
        appType: app?.type || "",
        bypassPrompt: true,
      });
      hideLoader();
      return;
    }

    let launchInstalledAppFn = await waitForGlobalFunction(
      "launchInstalledAppFromView",
      7000,
    );

    if (launchInstalledAppFn) {
      launchInstalledAppFn(appId);
      hideLoader();
      return;
    }

    // Fallback path when view bridge is not ready yet.
    const fallbackUrl = String(app?.oneviewUrl || app?.url || "").trim();
    if (fallbackUrl) {
      let fallbackFn = await waitForGlobalFunction(
        "openUrlFromDashboard",
        7000,
      );
      if (fallbackFn) {
        fallbackFn(fallbackUrl, PARTITIONS.guest, app?.name || "App", true, {
          trackingAppId: appId,
          trackingAppName: app?.name || "App",
          appType: app?.type || "",
          bypassPrompt: true,
        });
      }
      hideLoader();
      return;
    }

    hideLoader();
    showToast(`Unable to open "${app?.name || "app"}" right now.`, "warning");
  } catch (err) {
    hideLoader();
    showToast(`Failed to open "${app?.name || "app"}".`, "error");
  }
}

function initializeLeaveApplicationModal() {
  const modal = document.getElementById("leave-application-modal");
  const openBtn = document.getElementById("apply-leave-btn");
  const closeBtn = document.getElementById("leave-modal-close-btn");
  const cancelBtn = document.getElementById("leave-modal-cancel-btn");
  const form = document.getElementById("leave-application-form");
  const fullDayRadio = document.getElementById("leave-full-day");
  const halfDayRadio = document.getElementById("leave-half-day");
  const fullDayDatesContainer = document.getElementById("full-day-dates-container");
  const halfDayDateContainer = document.getElementById("half-day-date-container");
  const startDateInput = document.getElementById("leave-start-date");
  const endDateInput = document.getElementById("leave-end-date");
  const singleDateInput = document.getElementById("leave-single-date");
  const halfDayTypeSelect = document.getElementById("leave-half-day-type");
  const leaveTypeSelect = document.getElementById("leave-category-type");

  if (!modal || !openBtn || !form) return;

  function openModal() {
    modal.classList.remove("hidden");
    requestAnimationFrame(() => modal.classList.add("open"));
  }

  function closeModal() {
    modal.classList.remove("open");
    setTimeout(() => {
      if (!modal.classList.contains("open")) {
        modal.classList.add("hidden");
      }
    }, 200);
  }

  openBtn.addEventListener("click", () => {
    if (isGuestMode()) {
      showToast(
        "Leave application is not available for guest users",
        "warning",
      );
      return;
    }
    openModal();
  });
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  function updateLeaveType() {
    const isHalfDay = halfDayRadio.checked;
    
    if (fullDayDatesContainer) {
      fullDayDatesContainer.classList.toggle("hidden", isHalfDay);
    }
    if (halfDayDateContainer) {
      halfDayDateContainer.classList.toggle("hidden", !isHalfDay);
    }
    
    if (startDateInput) startDateInput.required = !isHalfDay;
    if (endDateInput) endDateInput.required = !isHalfDay;
    if (singleDateInput) singleDateInput.required = isHalfDay;
    if (halfDayTypeSelect) halfDayTypeSelect.required = isHalfDay;
    if (leaveTypeSelect) leaveTypeSelect.required = true;
  }

  if (fullDayRadio) fullDayRadio.addEventListener("change", updateLeaveType);
  if (halfDayRadio) halfDayRadio.addEventListener("change", updateLeaveType);

  updateLeaveType();

  // Date Range Picker Factory Function
  function createDateRangePicker(config) {
    const {
      inputId,
      pickerId,
      monthYearId,
      daysContainerId,
      startDateInputId,
      endDateInputId,
      singleDateMode = false,
    } = config;

    const inputElement = document.getElementById(inputId);
    const pickerContainer = document.getElementById(pickerId);
    const monthYearElement = document.getElementById(monthYearId);
    const daysContainer = document.getElementById(daysContainerId);
    const navBtns = pickerContainer.querySelectorAll(".date-picker-nav-btn");
    const prevBtn = navBtns[0];
    const nextBtn = navBtns[1];
    
    const startDateInputEl = startDateInputId ? document.getElementById(startDateInputId) : null;
    const endDateInputEl = endDateInputId ? document.getElementById(endDateInputId) : null;

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedStartDate = null;
    let selectedEndDate = null;
    let hoverDate = null;

    // Helper functions to avoid timezone issues
    function dateStringFromYMD(year, month, day) {
      const m = String(month + 1).padStart(2, '0');
      const d = String(day).padStart(2, '0');
      return `${year}-${m}-${d}`;
    }

    function dateFromString(dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    function renderCalendar() {
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      monthYearElement.textContent = monthNames[currentMonth] + " " + currentYear;

      daysContainer.innerHTML = "";

      // Previous month days
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "date-picker-day other-month";
        dayDiv.textContent = prevMonthLastDay - i;
        daysContainer.appendChild(dayDiv);
      }

      // Current month days
      const today = new Date();
      const todayStr = dateStringFromYMD(today.getFullYear(), today.getMonth(), today.getDate());

      for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "date-picker-day";
        dayDiv.textContent = day;

        const currentDateStr = dateStringFromYMD(currentYear, currentMonth, day);

        // Store date as data attribute for event delegation
        dayDiv.dataset.date = currentDateStr;

        // Mark today
        if (currentDateStr === todayStr) {
          dayDiv.classList.add("today");
        }

        // Handle highlighting
        if (singleDateMode) {
          // Single date mode
          if (currentDateStr === selectedStartDate) {
            dayDiv.classList.add("selected");
          }
        } else {
          // Range mode
          if (selectedStartDate && selectedEndDate) {
            const start = dateFromString(selectedStartDate);
            const end = dateFromString(selectedEndDate);
            const current = new Date(currentYear, currentMonth, day);
            
            if (current >= start && current <= end) {
              dayDiv.classList.add("in-range");
            }
            if (currentDateStr === selectedStartDate || currentDateStr === selectedEndDate) {
              dayDiv.classList.add("selected");
            }
          } else if (selectedStartDate && !selectedEndDate) {
            // Only start date selected - show hover preview if hovering
            if (currentDateStr === selectedStartDate) {
              dayDiv.classList.add("selected");
            }
            
            // Hover preview
            if (hoverDate) {
              const start = dateFromString(selectedStartDate);
              const hover = dateFromString(hoverDate);
              const current = new Date(currentYear, currentMonth, day);
              const [rangeStart, rangeEnd] = start <= hover ? [start, hover] : [hover, start];
              
              if (current >= rangeStart && current <= rangeEnd) {
                dayDiv.classList.add("in-range");
              }
              if (currentDateStr === selectedStartDate || currentDateStr === hoverDate) {
                dayDiv.classList.add("selected");
              }
            }
          }
        }

        // Add mouseenter listener for hover preview
        dayDiv.addEventListener("mouseenter", () => {
          if (!singleDateMode && selectedStartDate && !selectedEndDate) {
            hoverDate = currentDateStr;
            // Update just the background color without re-rendering
            const start = dateFromString(selectedStartDate);
            const hover = dateFromString(hoverDate);
            const current = new Date(currentYear, currentMonth, day);
            const [rangeStart, rangeEnd] = start <= hover ? [start, hover] : [hover, start];
            
            // Re-apply classes to all day elements based on new hover state
            const allDays = daysContainer.querySelectorAll(".date-picker-day");
            allDays.forEach(d => {
              d.classList.remove("in-range", "selected");
              const dateStr = d.dataset.date;
              if (!dateStr || d.classList.contains("other-month")) return;
              
              const dayDate = dateFromString(dateStr);
              if (dayDate >= rangeStart && dayDate <= rangeEnd) {
                d.classList.add("in-range");
              }
              if (dateStr === selectedStartDate || dateStr === hoverDate) {
                d.classList.add("selected");
              }
            });
          }
        });
        
        // Add mouseleave to clear hover
        dayDiv.addEventListener("mouseleave", () => {
          if (!singleDateMode && selectedStartDate && !selectedEndDate && hoverDate) {
            hoverDate = null;
            // Clear hover highlighting without full re-render
            const allDays = daysContainer.querySelectorAll(".date-picker-day");
            allDays.forEach(d => {
              d.classList.remove("in-range");
              if (d.dataset.date === selectedStartDate) {
                d.classList.add("selected");
              }
            });
          }
        });

        daysContainer.appendChild(dayDiv);
      }

      // Next month days
      const totalCells = daysContainer.children.length;
      const remainingCells = 42 - totalCells;
      for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "date-picker-day other-month";
        dayDiv.textContent = day;
        daysContainer.appendChild(dayDiv);
      }
    }

    function selectDate(dateStr) {
      if (singleDateMode) {
        selectedStartDate = dateStr;
        selectedEndDate = null;
        updateDisplay();
        renderCalendar();
        closePickerDelayed();
      } else {
        if (!selectedStartDate) {
          selectedStartDate = dateStr;
          selectedEndDate = null;
          hoverDate = null;
          updateDisplay();
          renderCalendar();
        } else if (!selectedEndDate) {
          const start = dateFromString(selectedStartDate);
          const selected = dateFromString(dateStr);
          if (selected >= start) {
            selectedEndDate = dateStr;
          } else {
            selectedEndDate = selectedStartDate;
            selectedStartDate = dateStr;
          }
          hoverDate = null;
          updateDisplay();
          renderCalendar();
          closePickerDelayed();
        } else {
          selectedStartDate = dateStr;
          selectedEndDate = null;
          hoverDate = null;
          updateDisplay();
          renderCalendar();
        }
      }
    }

    function closePickerDelayed() {
      setTimeout(() => {
        pickerContainer.classList.add("hidden");
      }, 150);
    }

    function updateDisplay() {
      if (singleDateMode) {
        if (selectedStartDate) {
          const date = dateFromString(selectedStartDate);
          inputElement.value = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          if (startDateInputEl) startDateInputEl.value = selectedStartDate;
        } else {
          inputElement.value = "";
          if (startDateInputEl) startDateInputEl.value = "";
        }
      } else {
        if (selectedStartDate && selectedEndDate) {
          inputElement.value = `${selectedStartDate} to ${selectedEndDate}`;
        } else if (selectedStartDate) {
          inputElement.value = `${selectedStartDate} (click to add end date)`;
        } else {
          inputElement.value = "";
        }
        
        if (startDateInputEl) startDateInputEl.value = selectedStartDate || "";
        if (endDateInputEl) endDateInputEl.value = selectedEndDate || selectedStartDate || "";
      }
    }

    function reset() {
      selectedStartDate = null;
      selectedEndDate = null;
      hoverDate = null;
      currentMonth = new Date().getMonth();
      currentYear = new Date().getFullYear();
      updateDisplay();
      renderCalendar();
    }

    // Event listeners
    inputElement.addEventListener("click", (e) => {
      e.stopPropagation();
      pickerContainer.classList.toggle("hidden");
    });

    // Event delegation for day selection
    daysContainer.addEventListener("click", (e) => {
      const dayDiv = e.target.closest(".date-picker-day");
      if (dayDiv && 
          !dayDiv.classList.contains("other-month") && 
          dayDiv.dataset.date) {
        selectDate(dayDiv.dataset.date);
      }
    });

    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });

    // Close picker when clicking outside
    document.addEventListener("click", (e) => {
      if (!pickerContainer.contains(e.target) && e.target !== inputElement) {
        pickerContainer.classList.add("hidden");
      }
    });

    renderCalendar();
    return { reset };
  }

  // Initialize full day date range picker
  const fullDayPicker = createDateRangePicker({
    inputId: "leave-date-range-input",
    pickerId: "leave-date-range-picker",
    monthYearId: "leave-picker-month-year",
    daysContainerId: "leave-picker-days",
    startDateInputId: "leave-start-date",
    endDateInputId: "leave-end-date",
    singleDateMode: false,
  });

  // Initialize half day date picker
  const halfDayPicker = createDateRangePicker({
    inputId: "leave-half-day-input",
    pickerId: "leave-half-day-picker",
    monthYearId: "leave-half-picker-month-year",
    daysContainerId: "leave-half-picker-days",
    startDateInputId: "leave-single-date",
    endDateInputId: null,
    singleDateMode: true,
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const empId =
      storage.getItem("emp_id") || storage.getItem("username");
    if (!empId) {
      showToast("Employee ID not found. Please log in again.", "error");
      return;
    }

    const formData = new FormData(form);
    const isHalfDay = halfDayRadio.checked;
    const singleDate = String(formData.get("singleDate") || "");
    const startDate = isHalfDay
      ? singleDate
      : String(formData.get("startDate") || "");
    const endDate = isHalfDay
      ? singleDate
      : String(formData.get("endDate") || "");
    const leaveType = String(leaveTypeSelect.value || "").toLowerCase();

    if (!startDate || !endDate) {
      showToast("Please fill all required leave fields.", "warning");
      return;
    }

    if (!leaveType) {
      showToast("Please select a leave type.", "warning");
      return;
    }

    try {
      const response = await fetch(`${APP_SERVICE_BASE_URL}/api/apply-leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emp_id: parseInt(empId, 10),
          start_date: startDate,
          end_date: endDate,
          leave_type: leaveType,
          half_day: isHalfDay,
          half_day_type: isHalfDay ? formData.get("halfDayType") : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      showToast("Leave application submitted successfully.", "success");
      form.reset();
      fullDayPicker.reset();
      halfDayPicker.reset();
      fullDayRadio.checked = true;
      halfDayRadio.checked = false;
      if (leaveTypeSelect) { leaveTypeSelect.value = ""; }
      updateLeaveType();
      closeModal();
    } catch (error) {
      console.error("Leave application failed:", error);
      showToast("Failed to submit leave application.", "error");
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

window.triggerHomeAction = () => {
  showDashboardHome();
};

window.handleTicketActivationCleanup = async () => {
  if (
    window.api &&
    typeof window.api.shutdownLaunchedToolProcesses === "function"
  ) {
    try {
      await window.api.shutdownLaunchedToolProcesses();
    } catch (error) {
      console.warn("Could not shut down launched tool processes", error);
    }
  }

  const appStoreContainer = document.getElementById("app-store-container");
  const isViewVisible = Boolean(
    appStoreContainer &&
      !appStoreContainer.classList.contains("hidden") &&
      appStoreContainer.classList.contains("view-mode"),
  );
  const hasLoadedView = Boolean(window.viewPageLoaded);

  if (hasLoadedView) {
    window.dispatchEvent(
      new CustomEvent("ticket-switch-preserve-view", {
        detail: {
          activateVisibleTab: isViewVisible,
        },
      }),
    );
  }

  if (isViewVisible) {
    return;
  }

  await window.triggerHomeActionWithCleanup({ preserveViewState: false });
};

window.triggerHomeActionWithCleanup = async (options = {}) => {
  const preserveViewState = options?.preserveViewState !== false;
  await destroyDashboardWebviewSession();

  const appStoreContainer = document.getElementById("app-store-container");
  if (appStoreContainer && !appStoreContainer.classList.contains("hidden")) {
    closeAppStore({ preserveViewState });
    return;
  }

  showDashboardHome();
};

/**
 * Load the app store content into the dashboard
 */
async function loadAppStore(sectionToScrollTo = "") {
  restoreSidebarExpandedPreference();
  const dashHome = document.getElementById("dashboard-home");
  if (dashHome) dashHome.classList.add("hidden");
  hideViewPage({ preserveState: true });
  // Ensure view-mode class is removed
  const container = document.getElementById("app-store-container");
  if (container) container.classList.remove("view-mode");
  const appStoreContent = document.getElementById("app-store-content");
  if (appStoreContent) appStoreContent.classList.remove("hidden");

  const homeBtn = document.getElementById("home-btn");
  const webviewBtn = document.getElementById("webview-btn");
  const toolsBtn = document.getElementById("tools-btn");
  homeBtn.classList.remove("activeNav", "svg", "nav-icon");
  webviewBtn.classList.remove("activeNav", "svg", "nav-icon");
  if (window.api?.closeBrowserExtensionPopup) {
    window.api.closeBrowserExtensionPopup().catch(() => {});
  }

  const loaded = await loadEmbeddedSection({
    htmlPath: "../appstore/appstore.html",
    cssHref: "../appstore/appstore.css",
    scriptSrc: "../appstore/appstore.js",
    scriptLoadedFlag: "appStoreScriptLoaded",
    initFnName: "initAppStore",
  });

  if (loaded && sectionToScrollTo) {
    const scrollTargetId =
      sectionToScrollTo === "installed"
        ? "appsGridInstalled"
        : sectionToScrollTo;

    // Small delay to ensure content has rendered and layout is calculated
    setTimeout(() => {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Fallback: search for header
        const headers = document.querySelectorAll("h2");
        const targetHeader = Array.from(headers).find((h) =>
          h.textContent.toLowerCase().includes("installed"),
        );
        if (targetHeader) {
          targetHeader.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 500);
  }

  if (loaded) {
    requestAnimationFrame(() => {
      const availableGrid = document.getElementById("appsGridAvailable");
      const installedGrid = document.getElementById("appsGridInstalled");
      const hasRenderedContent = Boolean(
        document.querySelector("#appsGridAvailable .app-card, #appsGridAvailable .empty-state, #appsGridAvailable .error-state") ||
          document.querySelector("#appsGridInstalled .app-card, #appsGridInstalled .empty-state, #appsGridInstalled .error-state"),
      );

      if (
        availableGrid &&
        installedGrid &&
        !hasRenderedContent &&
        typeof window.fetchApps === "function"
      ) {
        window.fetchApps();
      }
    });
  }
}

async function loadDevProjectStudio() {
  restoreSidebarExpandedPreference();
  const dashHome = document.getElementById("dashboard-home");
  if (dashHome) dashHome.classList.add("hidden");
  hideViewPage({ preserveState: true });
  const container = document.getElementById("app-store-container");
  if (container) container.classList.remove("view-mode");
  const appStoreContent = document.getElementById("app-store-content");
  if (appStoreContent) appStoreContent.classList.remove("hidden");

  await loadEmbeddedSection({ 
    htmlPath: "../dev-project/dev-project.html",
    cssHref: "../dev-project/dev-project.css",
    scriptSrc: "../dev-project/dev-project.js",
    scriptLoadedFlag: "devProjectScriptLoaded",
    initFnName: "initDevProjectPage",
  });
}

async function loadEmbeddedSection({
  htmlPath,
  targetId = "app-store-content",
  // Deprecated args but kept for signature compatibility if needed
  cssHref,
  scriptSrc,
  scriptLoadedFlag,
  initFnName,
}) {
  const loadNonce = ++embeddedSectionLoadNonce;
  const appStoreContainer = document.getElementById("app-store-container");
  const appStoreContent = document.getElementById(targetId);

  if (!appStoreContainer || !appStoreContent) {
    console.error("App store container not found");
    return false;
  }

  try {
    let cached = embeddedSectionCache.get(htmlPath);
    if (!cached) {
      cached = await prewarmEmbeddedSectionCache(htmlPath);
      if (loadNonce !== embeddedSectionLoadNonce) return false;
    }

    // Helper to rebase relative paths
    const getDir = (pathStr) => {
      const lastSlash = pathStr.lastIndexOf("/");
      return lastSlash !== -1 ? pathStr.substring(0, lastSlash + 1) : "";
    };
    const baseDir = getDir(htmlPath);

    if (cached.mainContentHtml) {
      if (loadNonce !== embeddedSectionLoadNonce) return false;

      // PROPER CLEANUP: Find any active webcontent view hosts and remove them explicitly
      // to trigger their internal destroy() logic and prevent memory leaks.
      const existingPanes =
        appStoreContent.querySelectorAll(".webcontent-pane");
      existingPanes.forEach((pane) => {
        try {
          if (typeof pane.remove === "function") pane.remove();
        } catch (_err) {}
      });

      appStoreContent.style.visibility = "hidden";

      const stylesheetPromises = cached.links.map((href) => {
        if (!href) return Promise.resolve();

        let finalHref = href;
        if (
          !href.startsWith("/") &&
          !href.startsWith("http") &&
          !href.startsWith("file:")
        ) {
          finalHref = baseDir + href;
        }

        return ensureEmbeddedStylesheetLoaded(finalHref);
      });

      await Promise.all(stylesheetPromises);
      if (loadNonce !== embeddedSectionLoadNonce) return false;

      // Clear and inject the content only after the stylesheets are ready,
      // so the embedded page does not flash unstyled markup.
      appStoreContent.innerHTML = cached.mainContentHtml;

      // 2. EXTRACT AND INJECT SCRIPTS
      // Vite injects scripts as <script type="module" src="...">
      cached.scripts.forEach((script) => {
        const src = script.src;
        if (src) {
          // Rebase if relative
          let finalSrc = src;
          if (
            !src.startsWith("/") &&
            !src.startsWith("http") &&
            !src.startsWith("file:")
          ) {
            finalSrc = baseDir + src;
          }

          // Check if already loaded by src
          if (!document.querySelector(`script[src="${finalSrc}"]`)) {
            const newScript = document.createElement("script");
            if (script.type) newScript.type = script.type;
            if (script.crossOrigin) newScript.crossOrigin = script.crossOrigin;
            newScript.src = finalSrc;
            document.body.appendChild(newScript);
          }
        } else {
          // Inline script - unlikely with Vite defaults but possible
          const newScript = document.createElement("script");
          if (script.type) newScript.type = script.type;
          newScript.textContent = script.textContent;
          document.body.appendChild(newScript);
        }
      });

      // Execute init function if provided (fallback for legacy/transitions)
      if (initFnName) {
        requestAnimationFrame(async () => {
          if (loadNonce !== embeddedSectionLoadNonce) return;
          const initFn = await waitForGlobalFunction(initFnName, 5000);
          if (loadNonce !== embeddedSectionLoadNonce) return;
          if (typeof initFn === "function") {
            initFn();
          }
          requestAnimationFrame(() => {
            if (loadNonce !== embeddedSectionLoadNonce) return;
            appStoreContent.style.visibility = "";
            if (typeof window.resyncAllWebContentBounds === "function") {
              window.resyncAllWebContentBounds();
            }
          });
        });
      } else {
        requestAnimationFrame(() => {
          if (loadNonce !== embeddedSectionLoadNonce) return;
          appStoreContent.style.visibility = "";
          if (typeof window.resyncAllWebContentBounds === "function") {
            window.resyncAllWebContentBounds();
          }
        });
      }

      if (loadNonce !== embeddedSectionLoadNonce) return false;
      appStoreContainer.classList.remove("hidden");
      return true;
    }
  } catch (error) {
    console.error("Error loading embedded section:", error);
  }
  return false;
}

/**
 * Close the app store and return to dashboard
 */
function closeAppStore({ preserveViewState = false } = {}) {
  const appStoreContainer = document.getElementById("app-store-container");
  if (appStoreContainer) {
    const isViewMode = appStoreContainer.classList.contains("view-mode");
    if (isViewMode) {
      hideViewPage({ preserveState: preserveViewState });
    }
    appStoreContainer.classList.remove("full-view-mode");
    appStoreContainer.classList.remove("view-mode");
    applyAppStoreFullscreenState(false);
    appStoreContainer.classList.add("hidden");
  }
  showDashboardHome();
}

function ensureViewContentHost() {
  const appStoreContainer = document.getElementById("app-store-container");
  if (!appStoreContainer) return null;

  let viewContent = document.getElementById("view-page-content");
  if (viewContent) return viewContent;

  viewContent = document.createElement("div");
  viewContent.id = "view-page-content";
  viewContent.style.width = "100%";
  viewContent.style.height = "100%";
  viewContent.style.overflow = "auto";
  viewContent.style.display = "none";
  appStoreContainer.appendChild(viewContent);
  return viewContent;
}

function hideViewPage({ preserveState }) {
  const container = document.getElementById("app-store-container");
  const viewContent = document.getElementById("view-page-content");
  const appStoreContent = document.getElementById("app-store-content");

  if (container) container.classList.remove("view-mode");
  if (viewContent) viewContent.style.display = "none";
  if (appStoreContent) appStoreContent.classList.remove("hidden");
  clearEmbeddedViewBoundsSync();

  if (typeof window.hideAllWebContents === "function") {
    window.hideAllWebContents();
  }

  if (!preserveState && viewContent) {
    // Notify view.js to clean up active process dependencies before we destroy its body
    window.dispatchEvent(new Event("teardown-view-system"));
    viewContent.innerHTML = "";
    window.viewPageLoaded = false;
  }
}

function applyAppStoreFullscreenState(isFull) {
  const header = document.querySelector("header");
  const sidebar =
    document.querySelector(".side-bar") || document.getElementById("sidebar");

  if (isFull) {
    if (header) header.style.display = "none";
    if (sidebar) sidebar.style.display = "none";
    document.body.classList.add("app-overlay-maximized");
  } else {
    if (header) header.style.display = "";
    if (sidebar) sidebar.style.display = "";
    document.body.classList.remove("app-overlay-maximized");
  }
}

/**
 * Load notifications from localStorage and display them
 */
function loadNotifications() {
  const history = getNotificationHistory();
  const notificationList = document.getElementById("notification-list");

  if (!notificationList) return;

  if (history.length === 0) {
    notificationList.innerHTML =
      '<div class="empty-notifications">No notifications</div>';
    return;
  }

  notificationList.innerHTML = history
    .map((notif) => {
      const time = new Date(notif.time);
      const timeStr = time.toLocaleString();

      return `
        <div class="notification-item">
          <div class="notification-item-title">${notif.title}</div>
          <div class="notification-item-message">${notif.message}</div>
          <div class="notification-item-time">${timeStr}</div>
        </div>
      `;
    })
    .join("");
}

/**
 * Clear all notifications
 */
function clearNotifications() {
  clearNotificationHistory();
  loadNotifications();
  updateDashboardNotificationBadge();
}

window.openWebviewWithPartition = openWebviewWithPartition;

/**
 * Load the View page (Web Hub)
 */
async function loadViewPage(initialUrl = "") {
  restoreSidebarExpandedPreference();
  const dashHome = document.getElementById("dashboard-home");
  if (dashHome) dashHome.classList.add("hidden");

  const webviewContainer = document.getElementById("web-view-container");
  if (webviewContainer && !webviewContainer.classList.contains("hidden")) {
    webviewContainer.classList.add("hidden");
  }
  const homeButton = document.getElementById("home-btn");
  const webviewButton = document.getElementById("webview-btn");
  const toolsButton = document.getElementById("tools-btn");
  homeButton.classList.remove("activeNav", "svg", "nav-icon");
  webviewButton.classList.add("activeNav", "svg", "nav-icon");
  toolsButton.classList.remove("activeNav", "svg", "nav-icon");

  const appStoreContainer = document.getElementById("app-store-container");
  const appStoreContent = document.getElementById("app-store-content");
  const viewContent = ensureViewContentHost();
  if (appStoreContainer) {
    appStoreContainer.classList.remove("hidden");
    appStoreContainer.classList.add("view-mode");
  }
  if (appStoreContent) appStoreContent.classList.add("hidden");
  if (viewContent) viewContent.style.display = "block";
  if (dashboardWindowIsMaximized) {
    scheduleEmbeddedViewBoundsSync();
  }

  if (window.viewPageLoaded) {
    if (initialUrl && typeof window.openUrlFromDashboard === "function") {
      window.openUrlFromDashboard(initialUrl, null, "New Tab", false);
    } else {
      const tabsList = document.getElementById("tabsList");
      if (!tabsList || tabsList.children.length === 0) {
        const initView = await waitForGlobalFunction("initViewPage", 5000);
        if (typeof initView === "function") {
          initView();
        }
      }
    }
    if (typeof window.resyncAllWebContentBounds === "function") {
      window.resyncAllWebContentBounds();
    }
    return;
  }

  window.viewPageLoaded = false;
  const loaded = await loadEmbeddedSection({
    htmlPath: "../view/view.html",
    cssHref: "../view/view.css",
    scriptSrc: "../view/view.js",
    scriptLoadedFlag: "viewPageScriptLoaded",
    initFnName: "initViewPage",
    targetId: "view-page-content",
  });
  if (loaded) {
    const initView = await waitForGlobalFunction("initViewPage", 5000);
    if (typeof initView === "function") {
      initView();
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    }

    const openUrl = await waitForGlobalFunction("openUrlFromDashboard", 5000);
    window.viewPageLoaded = Boolean(openUrl);
    if (initialUrl && typeof openUrl === "function") {
      openUrl(initialUrl, null, "New Tab", false);
    }
    scheduleEmbeddedViewBoundsSync();
  }
}

/**
 * Open Webview with specific partition
 */
function openWebviewWithPartition(url, partition, title) {
  const webviewContainer = document.getElementById("web-view-container");

  if (!webviewContainer) return;
  restoreSidebarExpandedPreference();
  const dashHome = document.getElementById("dashboard-home");
  if (dashHome) dashHome.classList.add("hidden");

  // Hide overlay when switching to webview, but preserve View state.
  const appStoreContainer = document.getElementById("app-store-container");
  if (appStoreContainer) {
    appStoreContainer.classList.remove("full-view-mode");
    applyAppStoreFullscreenState(false);
    appStoreContainer.classList.add("hidden");
  }
  hideViewPage({ preserveState: true });

  if (window.api?.closeBrowserExtensionPopup) {
    window.api.closeBrowserExtensionPopup().catch(() => {});
  }

  webviewContainer.classList.remove("hidden");
  updateProfileMenuPosition();
  loadUrlInWebview(url, partition || "persist:default");

  // Update title logic if needed, but existing webview.js likely handles listeners.
  console.log(`Opening ${url} in partition ${partition || "default"}`);
}

// Expose for external calls (e.g. from appstore.js)
window.loadDevProjectStudio = loadDevProjectStudio;
window.loadAppStore = loadAppStore;
window.openWebviewWithPartition = openWebviewWithPartition;
window.showDashboardHome = showDashboardHome;
window.triggerManualSystemUpdateCheck = triggerManualSystemUpdateCheck;

// --- Auto-Update Listener ---
if (window.api && window.api.on) {
  window.api.on("update-status", (payload) => {
    console.log("Update Status:", payload);
    applyDashboardUpdateStatus(payload, { announce: true });
  });
}

if (window.api && window.api.onAppRemoved) {
  window.api.onAppRemoved(({ appId }) => {
    // Find the card by ID (ensure your HTML cards have id="app-card-APPID")
    const card = document.getElementById(`app-card-${appId}`);
    if (card) {
      card.style.opacity = "0";
      card.style.transform = "scale(0.9)";
      setTimeout(() => card.remove(), 300);
    }
  });
}

if (window.api?.onBrowserExtensionsUpdated) {
  window.api.onBrowserExtensionsUpdated(() => {
    dashboardExtensionsSnapshotAt = 0;
    void fetchDashboardExtensionsSnapshot({ force: true }).then(() => {
      renderDashboardHomeAppsOptimized().catch(() => {});
    });
  });
}

// Sync maximized visual state class on body
const updateMaximizedState = () => {
  const isMax = window.screenX < 0 || window.screenY < 0 || window.outerHeight >= window.screen.availHeight - 10;
  document.body.classList.toggle("maximized", isMax);
};
window.addEventListener("resize", updateMaximizedState);
updateMaximizedState();
setTimeout(updateMaximizedState, 500);

// --- Global Shortcuts Handler ---
document.addEventListener("keydown", (event) => {
  const key = String(event.key || "").toLowerCase();

  // 1. Shift + Tab -> Switch between Dashboard, View, Appstore
  if (event.key === "Tab" && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
    event.preventDefault();
    event.stopPropagation();

    const appStoreContainer = document.getElementById("app-store-container");
    const viewContent = document.getElementById("view-page-content");
    const isViewActive = viewContent && viewContent.style.display !== "none";
    const isAppStoreActive = appStoreContainer && !appStoreContainer.classList.contains("hidden") && (!viewContent || viewContent.style.display === "none");

    const homeBtn = document.getElementById("home-btn");
    const webviewBtn = document.getElementById("webview-btn");
    const toolsBtn = document.getElementById("tools-btn");

    if (isViewActive) {
      if (toolsBtn) toolsBtn.click();
    } else if (isAppStoreActive) {
      if (homeBtn) homeBtn.click();
    } else {
      if (webviewBtn) webviewBtn.click();
    }
    return;
  }

  // 2. Ctrl + Shift + R -> Refresh whole app
  if (key === "r" && (event.ctrlKey || event.metaKey) && event.shiftKey) {
    event.preventDefault();
    event.stopPropagation();
    window.location.reload();
    return;
  }

  // 3. Ctrl + R -> Refresh active tab in view page, prevent app reload
  if (key === "r" && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof window.getActiveWebview === "function") {
      const wv = window.getActiveWebview();
      if (wv) wv.reload();
    }
    return;
  }

  // 4. Ctrl + N -> Create new tab in view page / Open view page
  if (key === "n" && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
    event.preventDefault();
    event.stopPropagation();
    const webviewBtn = document.getElementById("webview-btn");
    const webviewContainer = document.getElementById("web-view-container");
    const isViewActive = webviewContainer && !webviewContainer.classList.contains("hidden");
    const hasTabs = typeof window.getTabs === "function" && window.getTabs().length > 0;

    if (hasTabs) {
      if (!isViewActive && webviewBtn) {
        webviewBtn.click();
      }
      if (typeof window.createTab === "function") {
        window.createTab();
      }
    } else {
      if (webviewBtn) {
        webviewBtn.click();
      }
    }
    return;
  }
}, true);
