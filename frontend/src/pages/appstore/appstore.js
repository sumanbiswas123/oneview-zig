import {
  isStandaloneExternalExeApp,
  launchStandaloneExternalExe,
} from "../../lib/external-exe.js";
import {
  APP_DISPLAY_NAME,
  APP_SERVICE_BASE_URL,
  DEV_ACCESS_LIST_URL,
  EXTENSIONS_RELEASES_URL,
  IS_DEV_APP_BUILD,
} from "../../lib/app-env.js";
import { filterAppsForCurrentBuild } from "../../lib/app-catalog.js";
import { SESSION_KEYS, STORAGE_KEYS } from "../../lib/app-runtime.js";
import {
  clearNotificationHistory,
  getNotificationHistory,
  saveNotification as persistNotification,
} from "../../lib/app-update-notifications.js";

const EXTENSIONS_URL = EXTENSIONS_RELEASES_URL;

let allApps = [];
let installedApps = JSON.parse(
  localStorage.getItem(STORAGE_KEYS.installedApps) || "{}",
);
const LOCAL_WEB_APP_TYPES = new Set([
  "nextjs",
  "vite",
  "react",
  "angular",
  "html",
  "neutralino",
  "website",
]);

function isVersionGreater(v1, v2) {
  const parsePart = (p) => parseInt(String(p).split(/[^0-9]/)[0]) || 0;
  const parts1 = String(v1).split(".").map(parsePart);
  const parts2 = String(v2).split(".").map(parsePart);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const a = parts1[i] || 0;
    const b = parts2[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}

function normalizeAppField(value = "") {
  return String(value || "").trim().toLowerCase();
}

function isOneviewManagedInstallerApp(app = {}) {
  const type = normalizeAppField(app?.type);
  const installFlow = normalizeAppField(
    app?.installFlow || app?.installMode || app?.distribution || app?.packageType,
  );
  const releaseUrl = String(app?.releaseUrl || app?.url || "").trim().toLowerCase();
  const fileName = releaseUrl ? releaseUrl.split("/").pop() || "" : "";
  const looksLikeOneviewInstallerExe =
    fileName.endsWith(".exe") &&
    (fileName.includes("oneview-setup") ||
      fileName.includes("-setup-") ||
      fileName.includes("installer") ||
      fileName.includes("-setup."));
  // Apps with systemWideInstall:true use the managed NSIS installer flow
  const isSystemWide = Boolean(app?.systemWideInstall);
  return (
    isSystemWide ||
    type === "installer" ||
    type === "oneview-installer" ||
    installFlow === "oneview-installer" ||
    installFlow === "managed-installer" ||
    installFlow === "nsis" ||
    looksLikeOneviewInstallerExe
  );
}

function isOneviewManagedInstalledRecord(app = {}) {
  return (
    Boolean(app?.managedByOneviewInstaller) ||
    normalizeAppField(app?.installFlow) === "oneview-installer" ||
    isOneviewManagedInstallerApp(app)
  );
}

function sanitizeInstallFolderName(value = "") {
  return String(value || "")
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1f]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .slice(0, 80);
}

function getOneviewManagedInstallDir(secretDir, app = {}) {
  const folderName =
    sanitizeInstallFolderName(
      app?.oneviewInstallDirName || app?.installDirName || app?.name || app?.id,
    ) || "Installed App";
  return `${secretDir}/installed/${folderName}`;
}

function getOneviewManagedManifestName(app = {}) {
  return String(app?.oneviewManifestName || app?.installManifestName || "oneview-install.json").trim() || "oneview-install.json";
}

function getAppKind(app = {}) {
  return String(app?.type || app?.runtime || "").trim().toLowerCase() ===
    "oneview-extension"
    ? "extension"
    : "app";
}

function getAppKindLabel(app = {}) {
  return getAppKind(app) === "extension" ? "Extension" : "App";
}

function getAppKindBadgeHtml(app = {}) {
  const kind = getAppKind(app);
  return `<span class="app-kind-badge app-kind-badge-${kind}">${getAppKindLabel(app)}</span>`;
}
const USER_INSTALLATIONS_CACHE_TTL_MS = 30_000;
const UPDATE_ICON_SVG = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M8 16H3v5"></path>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M16 8h5V3"></path>
  </svg>
`;

window.activeDownloads = window.activeDownloads || {};
window.__appStoreState = window.__appStoreState || {
  userInstallationsCache: {},
  userInstallationsFetchedAt: 0,
  userInstallationsPromise: null,
  renderNonce: 0,
  searchKeydownBound: false,
  notificationOutsideClickBound: false,
  systemUpdateCheckPromise: null,
};

function getAppStoreState() {
  return window.__appStoreState;
}

function readInstalledApps() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.installedApps) || "{}");
  } catch (_err) {
    return {};
  }
}

function writeInstalledApps(nextInstalledApps) {
  installedApps = nextInstalledApps;
  localStorage.setItem(
    STORAGE_KEYS.installedApps,
    JSON.stringify(nextInstalledApps),
  );
}

function markCachedUserInstallation(appId, isInstalled) {
  if (!appId) return;
  const state = getAppStoreState();
  const nextCache = { ...(state.userInstallationsCache || {}) };
  if (isInstalled) {
    nextCache[appId] = true;
  } else {
    delete nextCache[appId];
  }
  state.userInstallationsCache = nextCache;
  state.userInstallationsFetchedAt = Date.now();
}

function invalidateUserInstallationsCache() {
  const state = getAppStoreState();
  state.userInstallationsFetchedAt = 0;
  state.userInstallationsPromise = null;
}

async function fetchUserInstallations({ force = false } = {}) {
  const state = getAppStoreState();
  const now = Date.now();
  if (
    !force &&
    state.userInstallationsFetchedAt &&
    now - state.userInstallationsFetchedAt < USER_INSTALLATIONS_CACHE_TTL_MS
  ) {
    return state.userInstallationsCache || {};
  }

  if (!force && state.userInstallationsPromise) {
    return state.userInstallationsPromise;
  }

  const empId = String(localStorage.getItem("username") || "").trim();
  if (!empId) {
    state.userInstallationsCache = {};
    state.userInstallationsFetchedAt = now;
    return {};
  }

  state.userInstallationsPromise = (async () => {
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
      state.userInstallationsCache = data.installations || {};
      state.userInstallationsFetchedAt = Date.now();
      return state.userInstallationsCache;
    } catch (error) {
      console.error("Failed to fetch user installations", error);
      return state.userInstallationsCache || {};
    } finally {
      state.userInstallationsPromise = null;
    }
  })();

  return state.userInstallationsPromise;
}

function ensureCustomModalExists() {
  if (document.getElementById("customModal")) return;

  const modal = document.createElement("div");
  modal.id = "customModal";
  modal.className = "custom-modal-overlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "customModalTitle");
  modal.setAttribute("aria-describedby", "customModalMessage");
  modal.innerHTML = `
    <div class="custom-modal-glass">
      <button id="customModalClose" class="custom-modal-close" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="modal-icon-wrap" id="customModalIconWrap" aria-hidden="true">
        <div class="modal-icon" id="customModalIcon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <circle cx="12" cy="16" r="1"></circle>
          </svg>
        </div>
      </div>
      <h3 id="customModalTitle" class="modal-title">Confirmation</h3>
      <p id="customModalMessage" class="modal-message">Are you sure you want to proceed?</p>
      <p id="customModalHint" class="modal-hint"></p>
      <div class="custom-modal-actions">
        <button id="customModalCancel" class="modal-btn ghost">Cancel</button>
        <button id="customModalConfirm" class="modal-btn primary">Confirm</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// Initialize app store - can be called manually or on DOMContentLoaded
function initAppStore() {
  ensureCustomModalExists();
  void fetchAppsOptimized();
  setupEventListenersOptimized();
  setupSearchOptimized();
  setupNotificationsOptimized();
  setupCustomModal();
  setupDevProjectEntry();
  void hydrateInstalledOneviewUrls();

  // Check installed tool updates every time the App Store is opened.
  void checkForUpdatesOptimized();

  window.appStoreInitialized = true;
}

async function hydrateInstalledOneviewUrls() {
  if (!window.api || typeof window.api.resolveOneviewAppUrl !== "function") {
    return;
  }
  let changed = false;
  const latestInstalled = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.installedApps) || "{}",
  );
  const entries = Object.entries(latestInstalled);
  for (const [appId, app] of entries) {
    const appType = String(app?.type || "").toLowerCase();
    if (!LOCAL_WEB_APP_TYPES.has(appType)) continue;
    if (!app?.localPath) continue;
    try {
      const resolved = await window.api.resolveOneviewAppUrl(
        appId,
        app.localPath,
      );
      if (resolved?.success && resolved.url) {
        if (app.oneviewUrl !== resolved.url) {
          latestInstalled[appId] = { ...app, oneviewUrl: resolved.url };
          changed = true;
        }
      }
    } catch (_err) {}
  }
  if (changed) {
    writeInstalledApps(latestInstalled);
  }
}

// Auto-initialize on DOMContentLoaded (for standalone mode)
document.addEventListener("DOMContentLoaded", () => {
  initAppStore();
});

// Expose init function globally for dashboard mode
window.initAppStore = initAppStore;

function setupDevProjectEntry() {
  const createBtn = document.getElementById("createDevProjectBtn");
  if (!createBtn) return;

  createBtn.style.display = "none";
  if (!IS_DEV_APP_BUILD) return;
  if (localStorage.getItem("userMaster") !== "true") return;
  createBtn.style.display = "";

  const empId = String(
    localStorage.getItem("emp_id") || localStorage.getItem("username") || "",
  ).trim();
  const resourceName = String(
    localStorage.getItem("resourceName") || "",
  ).trim();
  fetch(DEV_ACCESS_LIST_URL)
    .then((res) => res.json())
    .then((allowedUsers) => {
      const hasAccess = allowedUsers.some(
        (u) =>
          String(u.id).trim() === empId &&
          String(u.name).trim() === resourceName,
      );
      if (!hasAccess) {
        console.info(
          "Dev project entry visible because this is a dev build; user is not on remote allow-list.",
        );
      }
    })
    .catch(console.warn);

  createBtn.addEventListener("click", () => {
    if (typeof window.loadDevProjectStudio === "function") {
      window.loadDevProjectStudio();
      return;
    }
    window.location.href = "../dev-project/dev-project.html";
  });
}

async function checkForUpdates() {
  console.log("AppStore: Checking for updates...");

  // 1. Fetch latest Apps List if needed
  if (!allApps || allApps.length === 0) {
    try {
      const response = await fetch(EXTENSIONS_URL);
      if (response.ok) {
        allApps = filterAppsForCurrentBuild(await response.json());
      }
    } catch (e) {
      console.warn("Could not fetch apps for update check", e);
    }
  }

  // 2. Check for TOOL specific updates
  const toolUpdates = [];

  Object.keys(installedApps).forEach((appId) => {
    const installed = installedApps[appId];
    const latest = allApps.find((a) => a.id === appId);

    if (latest && installed.version && latest.version) {
      // Simple string compare for now (v1.0.0 vs v1.0.1)
      if (latest.version !== installed.version) {
        // Only push if different (assuming new one is newer)
        toolUpdates.push(latest);
      }
    }
  });

  if (toolUpdates.length > 0) {
    toolUpdates.forEach((app) => {
      showToast({
        title: `${app.name} Update`,
        message: `v${app.version} is available.`,
        icon: "🚀",
      });

      saveNotification({
        title: `${app.name} Update`,
        message: `v${app.version} is available.`,
        icon: "🚀",
        time: new Date().toISOString(),
        dedupeKey: `app-update:${app.id}:${app.version}`,
        replaceKey: `app-update:${app.id}`,
      });
    });
  }

  // 3. OneView System Update (Optional - kept separate)
  if (window.api && window.api.checkForUpdates) {
    try {
      const result = await window.api.checkForUpdates();
      console.log("Check for updates result:", result);
    } catch (e) {
      console.warn(
        "System update check failed (likely dev mode or network):",
        e.message,
      );
    }
  }
}

if (window.api && window.api.on) {
  window.api.on("update-status", (payload) => {
    if (!payload || !payload.status) return;

    if (payload.status === "available") {
      showToast({
        title: "OneView Update",
        message: `v${payload.version} is available and downloading.`,
        icon: "UP",
      });
    }

    if (payload.status === "downloaded") {
      showToast({
        title: "OneView Update",
        message: `v${payload.version} downloaded. Restart from Dashboard to install.`,
        icon: "OK",
      });
    }

    if (payload.status === "error") {
      showToast({
        title: "OneView Update",
        message: payload.error || "Update failed.",
        icon: "!",
      });
    }
  });
}

function showToast({ title, message, icon, persist = true }) {
  let container = document.getElementById("toastContainer");

  // If container doesn't exist, create it
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      max-width: 350px;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.style.cssText = `
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease;
  `;

  toast.innerHTML = `
    <div class="toast-icon" style="flex-shrink: 0;">${icon || "🔔"}</div>
    <div class="toast-content" style="flex: 1;">
      <div class="toast-title" style="font-weight: 600; font-size: 14px; color: #1e293b;">${title}</div>
      <div class="toast-msg" style="font-size: 13px; color: #64748b; margin-top: 2px;">${message}</div>
    </div>
    <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#999; cursor:pointer; font-size: 18px; padding: 4px;">✕</button>
  `;

  container.appendChild(toast);

  if (persist) {
    saveNotification({ title, message, icon, time: new Date().toISOString() });
  }

  // Auto remove after 5s
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// === NOTIFICATION SYSTEM ===
function setupNotifications() {
  const btn = document.getElementById("notifBtn");
  const popover = document.getElementById("notifPopover");
  const badge = document.getElementById("notifBadge");
  if (!btn || !popover || !badge) {
    updateBadgeVisibility();
    return;
  }

  // Toggle Popover
  btn.addEventListener("click", (e) => {
    console.log("Notification Bell Clicked");
    e.stopPropagation();
    popover.classList.toggle("active");
    console.log("Popover Active State:", popover.classList.contains("active"));

    if (popover.classList.contains("active")) {
      renderNotifications();
      // Clear badge on open
      badge.style.display = "none";
    }
  });

  // Close on click outside
  document.addEventListener("click", (e) => {
    if (!popover.contains(e.target) && !btn.contains(e.target)) {
      popover.classList.remove("active");
    }
  });

  updateBadgeVisibility();
}

function saveNotification(notif) {
  persistNotification(notif);
  updateBadgeVisibility();
}

function renderNotifications() {
  const list = document.getElementById("notifList");

  // If element doesn't exist (we're in dashboard mode), skip rendering
  if (!list) {
    return;
  }

  const history = getNotificationHistory();

  if (history.length === 0) {
    list.innerHTML = '<div class="empty-notifs">No notifications</div>';
    return;
  }

  list.innerHTML = history
    .map(
      (item) => `
        <div class="notif-item">
            <div style="font-size:18px">${item.icon || "🔔"}</div>
            <div style="flex:1">
                <div style="font-weight:600; color:var(--text-main)">${
                  item.title
                }</div>
                <div style="color:var(--text-muted)">${item.message}</div>
                <div class="notif-time">${new Date(
                  item.time,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</div>
            </div>
        </div>
    `,
    )
    .join("");
}

window.clearNotifications = () => {
  clearNotificationHistory();
  renderNotifications();
  // Use dashboard's notification badge
  const badge = document.getElementById("notification-badge");
  if (badge) {
    badge.style.display = "none";
  }
};

function updateBadgeVisibility() {
  const history = getNotificationHistory();

  // Update dashboard's notification badge
  const badge = document.getElementById("notification-badge");
  if (badge && history.length > 0) {
    badge.style.display = "block";
  } else if (badge) {
    badge.style.display = "none";
  }
}

async function fetchApps() {
  const availableGrid = document.getElementById("appsGridAvailable");
  const installedGrid = document.getElementById("appsGridInstalled");

  try {
    const response = await fetch(EXTENSIONS_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    allApps = filterAppsForCurrentBuild(data);
    renderAppsOptimized(allApps);
  } catch (error) {
    console.error("Error fetching apps:", error);
    const errorHtml = `
            <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <h3>Connection Error</h3>
                <p>Could not load the app directory.</p>
                <button onclick="window.fetchApps()" class="btn-install" style="width: auto; margin-top: 20px;">Retry</button>
            </div>
        `;
    if (availableGrid) availableGrid.innerHTML = errorHtml;
    if (installedGrid) installedGrid.innerHTML = errorHtml;
  }
}

window.syncInstallationToDB = function (appId) {
  try {
    const empIdStr = localStorage.getItem("username") || "";
    const empId = parseInt(empIdStr, 10);

    if (!isNaN(empId)) {
      const payload = {
        emp_id: empId,
        installation: {
          [appId]: true
        }
      };

      fetch(`${APP_SERVICE_BASE_URL}/api/send-user-installation-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) {
            console.warn("Failed to sync installation", res.status);
          } else {
            console.log("Synced DB for", appId);
          }
        })
        .catch((err) => {
          console.error("Error syncing DB:", err);
        });
    }
  } catch (err) {
    console.error("Error preparing installation payload:", err);
  }

  markCachedUserInstallation(appId, true);
  void renderAppsOptimized(allApps);
}

// Main render function (now async to fetch DB data)
async function renderApps(apps) {
  const availableGrid = document.getElementById("appsGridAvailable");
  const installedGrid = document.getElementById("appsGridInstalled");
  if (!availableGrid || !installedGrid) return;
 
  availableGrid.innerHTML = "";
  installedGrid.innerHTML = "";

  // Get apps from DB
  let userInstallations = {};

  try {
    const emp_id = localStorage.getItem("username");
    const url = `${APP_SERVICE_BASE_URL}/api/user_data/${emp_id}`;
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      userInstallations = data.installations || {};
    }
  } catch (err) {
    console.error("Failed to fetch user installations", err);
  }


  installedApps = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.installedApps) || "{}",
  );

  const sourceApps = filterAppsForCurrentBuild(
    Array.isArray(apps) ? apps : allApps,
  );

  const availableApps = [];
  const installedList = [];

  sourceApps.forEach((app) => {
    const localInstalled = !!installedApps[app.id];
    const dbInstalled = !!userInstallations[app.id];

    // CASE 1: local true + db true → installed
    if (localInstalled && dbInstalled) {
      installedList.push(app);
    }

    // CASE 2: local false + db false → available
    else if (!localInstalled && !dbInstalled) {
      availableApps.push(app);
    }

    // CASE 3: local false + db true → treat as available (normal install flow)
    else if (!localInstalled && dbInstalled) {
      availableApps.push(app);
    }

    // CASE 4: local true + db false → installed BUT sync DB
    else if (localInstalled && !dbInstalled) {
      availableApps.push(app);
    }
  });

  const sortAZ = (a, b) => (a.name || "").localeCompare(b.name || "");
  availableApps.sort(sortAZ);
  installedList.sort(sortAZ);

  if (availableApps.length === 0) {
    availableGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding:40px;">All available apps are installed!</div>`;
  }
 
  if (installedList.length === 0) {
    installedGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding:40px;">You haven't installed any apps yet.</div>`;
  }
 
  const renderCardToGrid = (app, index, targetGrid, userInstallations) => {
    const localInstalled = !!installedApps[app.id];
    const dbInstalled = !!userInstallations[app.id];
    const isInstalled = localInstalled;

    const delay = index * 50;

    const card = document.createElement("div");
    card.className = `app-card ${isInstalled ? "is-installed" : "is-store"}`;
    card.style.animation = `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards ${delay}ms`;

    // Icon handling
    const iconHtml = app.iconUrl
      ? `<img src="${app.iconUrl}" class="app-icon app-icon-image" alt="${app.name}" />`
      : `<div class="app-icon app-icon-fallback">${app.icon || "✨"}</div>`;

    // Check for update
    let hasUpdate = false;
    const latestRemote = allApps.find((a) => a.id === app.id);

    if (
      localInstalled &&
      latestRemote &&
      latestRemote.version &&
      installedApps[app.id]?.version
    ) {
      hasUpdate = latestRemote.version !== installedApps[app.id].version;
    }

    let actionButtons = "";

    // =========================
    // INSTALLED STATE LOGIC
    // =========================
    if (localInstalled && dbInstalled) {
      if (window.activeDownloads[app.id]) {
        const downloadState = window.activeDownloads[app.id];
        actionButtons = `
        <button class="btn-icon delete" disabled title="Update in progress">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <button class="btn-icon update is-busy" id="btn-${app.id}" disabled title="${downloadState.label}">
          ${UPDATE_ICON_SVG}
        </button>
      `;
      } else {
      // NORMAL INSTALLED
      actionButtons = `
        <button class="btn-icon delete" id="btn-${app.id}" onclick="uninstallApp('${app.id}')" title="Uninstall">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        ${
          hasUpdate
            ? `
        <button class="btn-icon update" onclick="updateApp('${app.id}')" title="Update Available">
          ${UPDATE_ICON_SVG}
        </button>`
            : ""
        }
      `;
      }
    } 
    else if (localInstalled && !dbInstalled) {
      // MISMATCH CASE → SHOW SYNC BUTTON
      actionButtons = `
        <button class="btn-install" onclick="syncInstallationToDB('${app.id}')">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v12"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            </svg>
            Sync Installation
          </span>
        </button>
      `;
    } 
    else {
      // =========================
      // STORE STATE (NOT INSTALLED LOCALLY)
      // =========================
      if (window.activeDownloads[app.id]) {
        const downloadState = window.activeDownloads[app.id];

        actionButtons = `
          <button class="btn-install" id="btn-${app.id}" disabled style="opacity:0.7;">
            <span style="display:flex; align-items:center; justify-content:center; gap:8px">
              <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                style="animation:spin 1s linear infinite">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              ${downloadState.label}
            </span>
          </button>
        `;
      } else {
        actionButtons = `
          <button class="btn-install" id="btn-${app.id}" onclick="handleAppAction('${app.id}')">
            <span style="display:flex; align-items:center; justify-content:center; gap:8px">
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Get
            </span>
          </button>
        `;
      }
    }

    // Version Badge
    let vBadgeStyle = `
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
      border: 1px solid rgba(99, 102, 241, 0.2);
      color: var(--primary);
    `;

    const versionText = isInstalled
      ? `Installed: v${installedApps[app.id]?.version || "1.0.0"}`
      : `v${app.version}`;

    card.innerHTML = `
      <div class="app-card-top">
        ${iconHtml}
        <div class="app-meta">
          <div class="app-name-row">
            <h3 class="app-name">${app.name}</h3>
            <div class="app-card-tags">
              ${getAppKindBadgeHtml(app)}
            </div>
          </div>
          <div class="app-meta-row">
            <span class="app-channel">
              ${String(app.channel || "App").toUpperCase() === "EDA" ? "eDA" : app.channel || "App"}
            </span>
            
          </div>
        </div>
      </div>

      <p class="app-desc app-desc-unified">${app.description}</p>

      <div class="app-card-bottom">
        <span class="version-badge" style="${vBadgeStyle}">
          ${versionText}
        </span>
        <div class="app-actions">
          ${actionButtons}
        </div>
      </div>
    `;

    targetGrid.appendChild(card);
  }; 

  availableApps.forEach((app, index) => {
    renderCardToGrid(app, index, availableGrid, userInstallations);
  });

  installedList.forEach((app, index) => {
    renderCardToGrid(app, index, installedGrid, userInstallations);
  });
}

async function checkForUpdatesOptimized() {
  const state = getAppStoreState();
  if (state.systemUpdateCheckPromise) {
    return state.systemUpdateCheckPromise;
  }

  state.systemUpdateCheckPromise = (async () => {
    installedApps = readInstalledApps();

    if (!allApps || allApps.length === 0) {
      try {
        const response = await fetch(EXTENSIONS_URL, {
          signal: AbortSignal.timeout(8000),
        });
        if (response.ok) {
          allApps = filterAppsForCurrentBuild(await response.json());
        }
      } catch (error) {
        console.warn("Could not fetch apps for update check", error);
      }
    }

    const toolUpdates = Object.keys(installedApps)
      .map((appId) => {
        const installed = installedApps[appId];
        const latest = allApps.find((app) => app.id === appId);
        if (!latest || !installed?.version || !latest.version) return null;
        if (latest.version === installed.version) return null;
        return latest;
      })
      .filter(Boolean);

    toolUpdates.forEach((app) => {
      showToast({
        title: `${app.name} Update`,
        message: `v${app.version} is available.`,
        icon: "UP",
        persist: false,
      });

      saveNotification({
        title: `${app.name} Update`,
        message: `v${app.version} is available.`,
        icon: "UP",
        time: new Date().toISOString(),
        dedupeKey: `app-update:${app.id}:${app.version}`,
        replaceKey: `app-update:${app.id}`,
      });
    });

  })().finally(() => {
    state.systemUpdateCheckPromise = null;
  });

  return state.systemUpdateCheckPromise;
}

function setupNotificationsOptimized() {
  const btn = document.getElementById("notifBtn");
  const popover = document.getElementById("notifPopover");
  const badge = document.getElementById("notifBadge");
  if (!btn || !popover || !badge) {
    updateBadgeVisibility();
    return;
  }

  if (btn.dataset.boundClick !== "1") {
    btn.dataset.boundClick = "1";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const currentPopover = document.getElementById("notifPopover");
      const currentBadge = document.getElementById("notifBadge");
      if (!currentPopover) return;
      currentPopover.classList.toggle("active");
      if (currentPopover.classList.contains("active")) {
        renderNotifications();
        if (currentBadge) currentBadge.style.display = "none";
      }
    });
  }

  const state = getAppStoreState();
  if (!state.notificationOutsideClickBound) {
    state.notificationOutsideClickBound = true;
    document.addEventListener("click", (e) => {
      const currentPopover = document.getElementById("notifPopover");
      const currentBtn = document.getElementById("notifBtn");
      if (!currentPopover || !currentBtn) return;
      if (!currentPopover.contains(e.target) && !currentBtn.contains(e.target)) {
        currentPopover.classList.remove("active");
      }
    });
  }

  updateBadgeVisibility();
}

async function fetchAppsOptimized() {
  const availableGrid = document.getElementById("appsGridAvailable");
  const installedGrid = document.getElementById("appsGridInstalled");

  try {
    const response = await fetch(EXTENSIONS_URL, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    allApps = filterAppsForCurrentBuild(data);
    await renderAppsOptimized(allApps);
  } catch (error) {
    console.error("Error fetching apps:", error);
    const errorHtml = `
            <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <h3>Connection Error</h3>
                <p>Could not load the app directory.</p>
                <button onclick="window.fetchApps()" class="btn-install" style="width: auto; margin-top: 20px;">Retry</button>
            </div>
        `;
    if (availableGrid) availableGrid.innerHTML = errorHtml;
    if (installedGrid) installedGrid.innerHTML = errorHtml;
  }
}

async function renderAppsOptimized(apps) {
  const availableGrid = document.getElementById("appsGridAvailable");
  const installedGrid = document.getElementById("appsGridInstalled");
  if (!availableGrid || !installedGrid) return;

  const state = getAppStoreState();
  const renderNonce = ++state.renderNonce;

  availableGrid.innerHTML = "";
  installedGrid.innerHTML = "";

  const userInstallations = await fetchUserInstallations();
  if (renderNonce !== state.renderNonce) return;

  installedApps = readInstalledApps();

  const sourceApps = filterAppsForCurrentBuild(
    Array.isArray(apps) ? apps : allApps,
  ).sort((a, b) => (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase()));

  const availableApps = [];
  const installedList = [];

  sourceApps.forEach((app) => {
    const localInstalled = !!installedApps[app.id];
    const dbInstalled = !!userInstallations[app.id];

    if (localInstalled && dbInstalled) {
      installedList.push(app);
    } else {
      availableApps.push(app);
    }
  });

  const renderCard = (app, index) => {
    const localInstalled = !!installedApps[app.id];
    const dbInstalled = !!userInstallations[app.id];
    const isInstalled = localInstalled;
    const delay = index < 10 ? index * 35 : 0;

    const card = document.createElement("div");
    card.className = `app-card ${isInstalled ? "is-installed" : "is-store"}`;
    if (delay > 0) {
      card.style.animation = `fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards ${delay}ms`;
    }

    const iconHtml = app.iconUrl
      ? `<img src="${app.iconUrl}" class="app-icon app-icon-image" alt="${app.name}" />`
      : `<div class="app-icon app-icon-fallback">${app.icon || "?"}</div>`;

    let hasUpdate = false;
    const latestRemote = allApps.find((item) => item.id === app.id);
    if (
      localInstalled &&
      latestRemote &&
      latestRemote.version &&
      installedApps[app.id]?.version
    ) {
      hasUpdate = latestRemote.version !== installedApps[app.id].version;
    }

    let actionButtons = "";
    if (localInstalled && dbInstalled) {
      if (window.activeDownloads[app.id]) {
        const downloadState = window.activeDownloads[app.id];
        actionButtons = `
        <button class="btn-icon delete" disabled title="Update in progress">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <button class="btn-icon update is-busy" id="btn-${app.id}" disabled title="${downloadState.label}">
          ${UPDATE_ICON_SVG}
        </button>
      `;
      } else {
      actionButtons = `
        <button class="btn-icon delete" id="btn-${app.id}" onclick="uninstallApp('${app.id}')" title="Uninstall">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        ${
          hasUpdate
            ? `
        <button class="btn-icon update" onclick="updateApp('${app.id}')" title="Update Available">
          ${UPDATE_ICON_SVG}
        </button>`
            : ""
        }
      `;
      }
    } else if (localInstalled && !dbInstalled) {
      actionButtons = `
        <button class="btn-install" onclick="syncInstallationToDB('${app.id}')">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v12"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            </svg>
            Sync Installation
          </span>
        </button>
      `;
    } else if (window.activeDownloads[app.id]) {
      const downloadState = window.activeDownloads[app.id];
      actionButtons = `
        <button class="btn-install" id="btn-${app.id}" disabled style="opacity:0.7;">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              style="animation:spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            ${downloadState.label}
          </span>
        </button>
      `;
    } else {
      actionButtons = `
        <button class="btn-install" id="btn-${app.id}" onclick="handleAppAction('${app.id}')">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Get
          </span>
        </button>
      `;
    }

    const versionText = isInstalled
      ? `Installed: v${installedApps[app.id]?.version || "1.0.0"}`
      : `v${app.version}`;

    card.innerHTML = `
      <div class="app-card-top">
        ${iconHtml}
        <div class="app-meta">
          <div class="app-name-row">
            <h3 class="app-name">${app.name}</h3>
            <div class="app-card-tags">
              ${getAppKindBadgeHtml(app)}
            </div>
          </div>
          <div class="app-meta-row">
            <span class="app-channel">
              ${String(app.channel || "App").toUpperCase() === "EDA" ? "eDA" : app.channel || "App"}
            </span>
          </div>
        </div>
      </div>
      <p class="app-desc app-desc-unified">${app.description}</p>
      <div class="app-card-bottom">
        <span class="version-badge" style="
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--primary);
        ">
          ${versionText}
        </span>
        <div class="app-actions">
          ${actionButtons}
        </div>
      </div>
    `;

    return card;
  };

  const availableFragment = document.createDocumentFragment();
  const installedFragment = document.createDocumentFragment();

  availableApps.forEach((app, index) => {
    availableFragment.appendChild(renderCard(app, index));
  });

  installedList.forEach((app, index) => {
    installedFragment.appendChild(renderCard(app, index));
  });

  if (availableApps.length === 0) {
    availableGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding:40px;">All available apps are installed!</div>`;
  } else {
    availableGrid.appendChild(availableFragment);
  }

  if (installedList.length === 0) {
    installedGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding:40px;">You haven't installed any apps yet.</div>`;
  } else {
    installedGrid.appendChild(installedFragment);
  }
}

function setupEventListenersOptimized() {
  const filterBtns = document.querySelectorAll(".filter-btn[data-cat]");
  filterBtns.forEach((item) => {
    if (item.dataset.boundClick === "1") return;
    item.dataset.boundClick = "1";
    item.addEventListener("click", (e) => {
      filterBtns.forEach((button) => button.classList.remove("active"));
      const target = e.currentTarget;
      target.classList.add("active");

      const cat = target.dataset.cat;
      updateGridHeader(cat);

      if (cat === "all") {
        void renderAppsOptimized(allApps);
      } else {
        const filtered = allApps.filter(
          (app) =>
            app.channel && app.channel.toLowerCase() === cat.toLowerCase(),
        );
        void renderAppsOptimized(filtered);
      }
    });
  });
}

function setupSearchOptimized() {
  const modal = document.getElementById("searchModal");
  const input = document.getElementById("searchInput");
  const trigger = document.getElementById("searchTrigger");
  const results = document.getElementById("searchResults");
  const closeBtn = document.getElementById("closeSearchBtn");

  if (!modal || !input || !results || !closeBtn) {
    return;
  }

  const openModal = () => {
    modal.classList.add("active");
    input.focus();
  };

  const closeModal = () => {
    modal.classList.remove("active");
    input.value = "";
    results.innerHTML = "";
  };

  if (trigger && trigger.dataset.boundClick !== "1") {
    trigger.dataset.boundClick = "1";
    trigger.addEventListener("click", openModal);
  }

  if (closeBtn.dataset.boundClick !== "1") {
    closeBtn.dataset.boundClick = "1";
    closeBtn.addEventListener("click", closeModal);
  }

  const state = getAppStoreState();
  if (!state.searchKeydownBound) {
    state.searchKeydownBound = true;
    document.addEventListener("keydown", (e) => {
      const currentModal = document.getElementById("searchModal");
      const currentInput = document.getElementById("searchInput");
      const currentResults = document.getElementById("searchResults");
      if (!currentModal || !currentInput || !currentResults) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (currentModal.classList.contains("active")) {
          currentModal.classList.remove("active");
          currentInput.value = "";
          currentResults.innerHTML = "";
        } else {
          currentModal.classList.add("active");
          currentInput.focus();
        }
      }

      if (e.key === "Escape") {
        currentModal.classList.remove("active");
        currentInput.value = "";
        currentResults.innerHTML = "";
      }
    });
  }

  if (modal.dataset.boundClick !== "1") {
    modal.dataset.boundClick = "1";
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (input.dataset.boundInput !== "1") {
    input.dataset.boundInput = "1";
    input.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length < 1) {
        results.innerHTML = "";
        return;
      }

      const matches = allApps.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.author.toLowerCase().includes(query) ||
          app.channel.toLowerCase().includes(query),
      );

      if (matches.length === 0) {
        results.innerHTML =
          '<div style="padding:20px; text-align:center; color:var(--text-muted)">No results found</div>';
        return;
      }

      results.innerHTML = matches
        .map(
          (app) => `
            <div class="search-result-row" onclick="handleSearchSelect('${app.id}')" style="
                display:flex; align-items:center; gap:16px; padding:12px;
                cursor:pointer; border-radius:12px; transition:bg 0.2s;
            " onmouseover="this.style.background='rgba(0,0,0,0.03)'" onmouseout="this.style.background='transparent'">
                <div style="font-weight:600; color:var(--text-main)">${app.name}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-left:auto">${app.channel}</div>
            </div>
        `,
        )
        .join("");
    });
  }
}

window.fetchApps = fetchAppsOptimized;

// Wrapper to launch app because onclick string needs simple args
// Custom Modal Logic
let customModalResolve = null;
let customModalKeyHandler = null;
let lastModalFocus = null;

function setupCustomModal() {
  const modal = document.getElementById("customModal");
  if (!modal) {
    console.error("Custom Modal element not found in DOM");
    return;
  }

  // Use event delegation on the modal container itself
  // This avoids issues with cloning or replacing buttons losing listeners
  modal.onclick = (e) => {
    const target = e.target;

    // Check for Cancel
    if (
      target.id === "customModalClose" ||
      target.closest("#customModalClose") ||
      target.id === "customModalCancel" ||
      target.closest("#customModalCancel")
    ) {
      console.log("Modal: Cancel Clicked");
      e.stopPropagation();
      closeCustomModal(false);
      return;
    }

    // Check for Confirm
    if (
      target.id === "customModalConfirm" ||
      target.closest("#customModalConfirm")
    ) {
      console.log("Modal: Confirm Clicked");
      e.stopPropagation();
      closeCustomModal(true);
      return;
    }

    // Check for Overlay Click (background)
    if (target === modal) {
      console.log("Modal: Overlay Clicked");
      closeCustomModal(false);
    }
  };

  console.log("Custom Modal Setup Complete via Delegation");
}

function showCustomModal({
  title,
  message,
  type = "normal",
  confirmText = "Confirm",
  hint = "",
}) {
  return new Promise((resolve) => {
    customModalResolve = resolve;

    const modal = document.getElementById("customModal");
    const titleEl = document.getElementById("customModalTitle");
    const msgEl = document.getElementById("customModalMessage");
    const hintEl = document.getElementById("customModalHint");
    const iconEl = document.getElementById("customModalIcon");
    const cancelBtn = document.getElementById("customModalCancel");
    const confirmBtn = document.getElementById("customModalConfirm");
    if (!modal || !titleEl || !msgEl || !confirmBtn || !cancelBtn) {
      resolve(window.confirm(message || title || "Are you sure?"));
      return;
    }

    if (customModalKeyHandler) {
      document.removeEventListener("keydown", customModalKeyHandler);
      customModalKeyHandler = null;
    }

    lastModalFocus = document.activeElement;
    titleEl.textContent = title;
    msgEl.textContent = message;
    if (hintEl) hintEl.textContent = hint;
    confirmBtn.textContent = confirmText;
    modal.classList.toggle("modal-danger", type === "danger");

    // Reset classes
    confirmBtn.className = "modal-btn";
    if (type === "danger") confirmBtn.classList.add("danger");
    else confirmBtn.classList.add("primary");

    if (iconEl) {
      iconEl.innerHTML =
        type === "danger"
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><circle cx="12" cy="16" r="1"></circle></svg>`;
    }

    customModalKeyHandler = (e) => {
      if (!modal.classList.contains("active")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeCustomModal(false);
      } else if (e.key === "Enter") {
        const tagName = e.target && e.target.tagName ? e.target.tagName : "";
        const isActionControl = tagName === "BUTTON";
        if (e.target === confirmBtn || !isActionControl) {
          e.preventDefault();
          closeCustomModal(true);
        }
      }
    };
    document.addEventListener("keydown", customModalKeyHandler);

    modal.classList.add("active");
    requestAnimationFrame(() => confirmBtn.focus());
  });
}

function closeCustomModal(result) {
  const modal = document.getElementById("customModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.classList.remove("modal-danger");
  if (customModalKeyHandler) {
    document.removeEventListener("keydown", customModalKeyHandler);
    customModalKeyHandler = null;
  }
  if (customModalResolve) {
    customModalResolve(result);
    customModalResolve = null;
  }
  const focusTarget = lastModalFocus;
  lastModalFocus = null;
  if (focusTarget && typeof focusTarget.focus === "function") {
    requestAnimationFrame(() => focusTarget.focus());
  }
}

// Wrapper to launch app because onclick string needs simple args
window.launchAppAttr = (appId) => {
  const app = allApps.find((a) => a.id === appId);
  if (app) launchApp(app);
};

window.uninstallApp = async (appId) => {
  const app = allApps.find((a) => a.id === appId) || installedApps[appId];
  const installedApp = installedApps[appId] || app;
  if (!app) {
    console.error("App not found for uninstall:", appId);
    return;
  }

  // Show visual feedback immediately
  const btn = document.getElementById(`btn-${appId}`);
  const originalHTML = btn ? btn.innerHTML : null;
  const originalOpacity = btn ? btn.style.opacity : "1";
  
  if (btn) {
    const isIconButton = btn.classList.contains("btn-icon");
    if (isIconButton) {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="2.5" style="animation: spin 1.2s linear infinite;">
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M8 16H3v5"></path>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M16 8h5V3"></path>
        </svg>
      `;
    } else {
      btn.innerHTML = `
        <span style="display:flex; align-items:center; justify-content:center; gap:8px; color: #ff4444; font-weight: 600;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1.2s linear infinite;">
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M16 8h5V3"></path>
            </svg>
            Uninstalling...
        </span>
      `;
    }
    btn.disabled = true;
    btn.style.opacity = "0.9";
  }

  const confirmed = await showCustomModal({
    title: "Uninstall App",
    message: `Are you sure you want to uninstall ${app.name}? This will remove it from your device.`,
    type: "danger",
    confirmText: "Uninstall",
    hint: "This action cannot be undone",
  });

  if (!confirmed) {
    // Restore original state if cancelled
    if (btn) {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      btn.style.opacity = originalOpacity;
    }
    return;
  }

  if (confirmed) {
    const cleanupErrors = [];
    const needsExternalElectronCleanup =
      String(installedApp?.id || "").trim().toLowerCase() ===
        "presentationbuilder" ||
      isStandaloneExternalExeApp(installedApp);
    const isManagedInstaller = isOneviewManagedInstalledRecord(installedApp);
    const cleanupOptions = needsExternalElectronCleanup
      ? { mode: "presentationbuilder" }
      : undefined;

    showToast({
      title: "Uninstalling",
      message: `Removing ${app.name}...`,
      icon: "🗑️",
      persist: false,
    });

    // Stop running process first (best effort) so file deletion does not fail on Windows lock.
    try {
      if (installedApp.type === "oneview-extension" && window.api?.removeBrowserExtension) {
        await window.api.removeBrowserExtension({ path: installedApp.localPath });
      }
      if (installedApp.type === "nextjs" && window.api?.killNextApp) {
        await window.api.killNextApp();
      } else if (installedApp.type === "exe" && window.api?.killExe) {
        await window.api.killExe(
          needsExternalElectronCleanup
            ? {
                mode: "presentationbuilder",
                exePath: installedApp.localPath,
              }
            : {
                exePath: installedApp.localPath,
              },
        );
      }
      if (
        isManagedInstaller &&
        installedApp.uninstallPath &&
        window.api?.uninstallManagedWindowsApp
      ) {
        const uninstallResult = await window.api.uninstallManagedWindowsApp({
          uninstallPath: installedApp.uninstallPath,
          installDir: installedApp.installDir || "",
          manifestName: installedApp.manifestName || "",
          appExePath: installedApp.localPath || "",
          silent: true,
          extraArgs: Array.isArray(installedApp.uninstallArgs)
            ? installedApp.uninstallArgs
            : [],
        });
        if (!uninstallResult?.success) {
          cleanupErrors.push(
            uninstallResult?.message || "Could not uninstall the app.",
          );
        }
      }
    } catch (err) {
      console.warn("Failed to stop app process before uninstall:", err);
    }

    // Remove installed app directory or executable.
    if (!isManagedInstaller && installedApp.localPath && window.api?.deletePath) {
      try {
        const result = await window.api.deletePath(
          installedApp.localPath,
          cleanupOptions,
        );
        if (!result?.success) {
          cleanupErrors.push(result?.message || "Could not remove app files.");
        }
      } catch (err) {
        cleanupErrors.push(err.message || "Could not remove app files.");
      }
    }

    // Remove downloaded package (zip/exe) if tracked.
    if (installedApp.packagePath && window.api?.deletePath) {
      try {
        const pkgResult = await window.api.deletePath(
          installedApp.packagePath,
          cleanupOptions,
        );
        if (!pkgResult?.success) {
          cleanupErrors.push(
            pkgResult?.message || "Could not remove downloaded package.",
          );
        }
      } catch (err) {
        cleanupErrors.push(
          err.message || "Could not remove downloaded package.",
        );
      }
    }

    if (cleanupErrors.length > 0) {
      const isFileNotFound = cleanupErrors.some(
        (e) =>
          e.toLowerCase().includes("not found") ||
          e.toLowerCase().includes("enoent") ||
          e.toLowerCase().includes("does not exist"),
      );

      if (!isFileNotFound) {
        showToast({
          title: "Uninstall Failed",
          message: cleanupErrors[0],
          icon: "⚠️",
        });
        void renderAppsOptimized(allApps);
        return;
      }
      // If it's just "not found", we proceed to remove it from state (Ghost App cleanup)
      console.log("App files already gone, removing ghost entry from state.");
    }

    delete installedApps[appId];
    writeInstalledApps(installedApps);
    markCachedUserInstallation(appId, false);
    invalidateUserInstallationsCache();

      // --- API INTEGRATION: Send Installation Data ---
      try {
        const empIdStr = localStorage.getItem("username") || "";
        const empId = parseInt(empIdStr, 10);
        
        if (!isNaN(empId)) {
          // Map app name to desired backend key
          
          const appKey = app.id
          
          const payload = {
            emp_id: empId,
            installation: {
              [appKey]: false
            }
          };

          fetch(`${APP_SERVICE_BASE_URL}/api/send-user-installation-data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }).then(res => {
             if (!res.ok) console.warn("Failed to send installation data", res.status);
             else console.log("Successfully sent installation data for", app.name);
          }).catch(err => {
             console.error("Error sending installation data:", err);
          });
        }
      } catch (err) {
        console.error("Error preparing installation payload:", err);
      }
      // -----------------------------------------------
    
    // No double save needed
    renderAppsOptimized(allApps); // Re-render to show "Get" state

    // Refresh View Page if available
    if (typeof window.loadMiniInstalledApps === "function") {
      window.loadMiniInstalledApps();
    }

    showToast({
      title: "App Uninstalled",
      message: `${app.name} has been removed.`,
      icon: "🗑️",
    });
  }
};

window.updateApp = async (appId) => {
  const app = allApps.find((a) => a.id === appId) || installedApps[appId];
  if (!app) {
    console.error("App not found for update:", appId);
    return;
  }

  const confirmed = await showCustomModal({
    title: "Update Available",
    message: `A new version of ${app.name} is available. Update now?`,
    type: "normal",
    confirmText: "Update",
  });

  if (confirmed) {
    try {
      await installApp(app, { isUpdate: true });
    } catch (error) {
      console.error("Update flow failed to start:", error);
      showToast({
        title: "Update Failed",
        message: error?.message || `Could not start update for ${app.name}.`,
        icon: "⚠️",
      });
    }
  }
};

window.handleAppAction = (appId) => {
  const app = allApps.find((a) => a.id === appId);
  if (!app) return;

  if (installedApps[appId]) {
    launchApp(app);
  } else {
    installApp(app);
  }
};

async function installApp(app, options = {}) {
  const existingDownload = window.activeDownloads[app.id];
  if (existingDownload) {
    const startedAt = Number(existingDownload.startedAt || 0);
    const isStaleLock =
      startedAt > 0 && Date.now() - startedAt > 2 * 60 * 1000;
    if (isStaleLock) {
      delete window.activeDownloads[app.id];
    } else {
      showToast({
        title: "Update In Progress",
        message: existingDownload.label || `${app.name} is already updating.`,
        icon: "UP",
        persist: false,
      });
      void renderAppsOptimized(allApps);
      return;
    }
  }
  const isUpdate = options?.isUpdate === true;
  const autoLaunchAfterInstall = false;
  const previousInstall = installedApps[app.id] || null;
  const busyLabel = isUpdate ? "Updating..." : "Installing...";
  const needsExternalElectronCleanup =
    String(previousInstall?.id || app?.id || "")
      .trim()
      .toLowerCase() === "presentationbuilder" ||
    isStandaloneExternalExeApp(previousInstall || app);
  const cleanupOptions = needsExternalElectronCleanup
    ? { mode: "presentationbuilder" }
    : undefined;
  window.activeDownloads[app.id] = {
    label: busyLabel,
    startedAt: Date.now(),
  };

  const updateBtnUI = (label, isError = false) => {
    if (window.activeDownloads[app.id]) {
      window.activeDownloads[app.id].label = label;
    }
    const b = document.getElementById(`btn-${app.id}`);
    if (b) {
      const isIconButton = b.classList.contains("btn-icon");
        if (isError) {
        if (isIconButton) {
          b.innerHTML = UPDATE_ICON_SVG;
          b.title = label;
        } else {
          b.innerHTML = `<span>${label}</span>`;
        }
        b.disabled = false;
        b.style.opacity = "1";
      } else {
        if (isIconButton) {
          b.innerHTML = UPDATE_ICON_SVG;
          b.title = label;
        } else {
          b.innerHTML = `
            <span style="display:flex; align-items:center; justify-content:center; gap:8px">
                <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                ${label}
            </span>
          `;
        }
        b.disabled = true;
        b.style.opacity = "0.7";
      }
    }
  };

  updateBtnUI(busyLabel);

  // --- ONEVIEW VERSION COMPATIBILITY CHECK ---
  const requiredOneviewVersion =
    app["oneview-version"] || app.oneviewVersion || app.oneViewVersion;

  if (requiredOneviewVersion) {
    try {
      const currentOneviewVersion = await window.api.getAppVersion();
      const needsUpdate = isVersionGreater(requiredOneviewVersion, currentOneviewVersion);

      if (needsUpdate) {
        delete window.activeDownloads[app.id];
        updateBtnUI("Retry", true);

        const updateStatusResponse = await window.api.getCurrentUpdateStatus();
        const updateState = updateStatusResponse?.state || {};
        const isDownloaded = updateState.status === "downloaded";

        const confirmed = await showCustomModal({
          title: "Update Available",
          message: `Current version: ${currentOneviewVersion}. Please update to ${requiredOneviewVersion} or higher.`,
          confirmText: isDownloaded ? "Install Now" : "Check for Updates",
          type: "normal",
          hint: isDownloaded
            ? "An update is ready to install."
            : "A newer version of OneView is required.",
        });

        if (confirmed) {
          if (isDownloaded) {
            window.api.installUpdate();
          } else {
            window.api.checkForUpdates();
          }
        }
        return;
      }
    } catch (err) {
      console.warn("Failed to check OneView version compatibility:", err);
    }
  }
  // -------------------------------------------

  void renderAppsOptimized(allApps);

  // Resolve apps install directory from main process (portable across machines)
  let secretDir = "";
  try {
    if (window.api && typeof window.api.getAppsSecretRoot === "function") {
      secretDir = await window.api.getAppsSecretRoot();
    }
  } catch (err) {
    console.error("Could not resolve apps root path", err);
  }
  if (!secretDir) {
    delete window.activeDownloads[app.id];
    updateBtnUI("Retry", true);
    alert("Could not resolve application storage path.");
    return;
  }

  // For system-wide installs, resolve %LOCALAPPDATA% as the base
  let localAppDataDir = "";
  const isSystemWideApp = Boolean(app?.systemWideInstall);
  if (isSystemWideApp) {
    try {
      if (window.api && typeof window.api.getLocalAppDataPath === "function") {
        localAppDataDir = await window.api.getLocalAppDataPath();
      }
    } catch (err) {
      console.warn("Could not resolve localAppData path", err);
    }
    if (!localAppDataDir) {
      // fallback: use secretDir (still better than nothing)
      localAppDataDir = secretDir;
    }
  }

  const isZip = app.releaseUrl && app.releaseUrl.endsWith(".zip");
  const filename = app.releaseUrl
    ? app.releaseUrl.split("/").pop()
    : `${app.id}.zip`; // default to zip if unknown? Or handle exe.
  const targetPath = `${secretDir}/${filename}`;
  const expectedSha = String(app.sha256 || "")
    .trim()
    .toLowerCase();
  const hasValidSha = /^[a-f0-9]{64}$/.test(expectedSha);

  // Start Download
  updateBtnUI("Downloading... 0%");
  const formatMb = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  let unsubscribeDownloadProgress = null;
  if (window.api && typeof window.api.onDownloadProgress === "function") {
    unsubscribeDownloadProgress = window.api.onDownloadProgress((payload) => {
      if (!payload || payload.targetPath !== targetPath) return;

      const { progress, receivedBytes, totalBytes } = payload;
      const progressLabel =
        typeof progress === "number"
          ? `${progress}%`
          : `${formatMb(receivedBytes || 0)}${
              totalBytes ? ` / ${formatMb(totalBytes)}` : ""
            }`;

      updateBtnUI(`Downloading... ${progressLabel}`);
    });
  }

  window.api
    .downloadFile(app.releaseUrl, targetPath)
    .then(async () => {
      if (unsubscribeDownloadProgress) unsubscribeDownloadProgress();
      if (
        hasValidSha &&
        window.api &&
        typeof window.api.verifyFileSha256 === "function"
      ) {
        const verifyResult = await window.api.verifyFileSha256(
          targetPath,
          expectedSha,
        );
        if (!verifyResult?.success || !verifyResult.matches) {
          try {
            if (window.api?.deletePath) await window.api.deletePath(targetPath);
          } catch (_err) {}
          delete window.activeDownloads[app.id];
          updateBtnUI("Retry", true);
          alert(
            `SHA256 verification failed for ${app.name}. Download blocked for safety.`,
          );
          return;
        }
      }

      updateBtnUI("Download Complete");
      let finalPath = targetPath;
      let type = app.type;
      let installDir = "";
      let uninstallPath = "";
      let managedByOneviewInstaller = false;
      let manifestName = "";

      if (isUpdate) {
        try {
          if (previousInstall?.type === "nextjs" && window.api?.killNextApp) {
            await window.api.killNextApp();
          } else if (previousInstall?.type === "exe" && window.api?.killExe) {
            await window.api.killExe(
              needsExternalElectronCleanup
                ? {
                    mode: "presentationbuilder",
                    exePath: previousInstall.localPath,
                  }
                : {
                    exePath: previousInstall.localPath,
                  },
            );
          }
        } catch (err) {
          console.warn("Failed to stop app process before update:", err);
        }
      }

      if (isOneviewManagedInstallerApp(app)) {
        if (isSystemWideApp) {
          // ── SYSTEM-WIDE INSTALL ──────────────────────────────────────────────
          // Run the installer with /S only — no /D=, so it installs to its own
          // default location (e.g. %LOCALAPPDATA%\<AppName> for Tauri apps).
          // Then query the Windows registry to find where it actually installed.
          if (!window.api?.installSystemWideApp) {
            throw new Error("System-wide installer API is unavailable.");
          }
          updateBtnUI(isUpdate ? "Applying update..." : "Installing app...");
          const sysResult = await window.api.installSystemWideApp({
            installerPath: targetPath,
            appName: app.name || "",
            appId: app.id || "",
          });
          if (!sysResult?.success) {
            throw new Error(
              sysResult?.message || "System-wide installer did not complete successfully.",
            );
          }
          finalPath = sysResult.exePath || "";
          installDir = sysResult.installLocation || finalPath;
          // Try to derive the uninstall exe from registry entry
          const uninstEntry = sysResult.registryEntry;
          if (uninstEntry?.uninstallString) {
            uninstallPath = uninstEntry.uninstallString.replace(/^"|"$/g, "").split('"').find(p => p.trim().endsWith(".exe")) || "";
          }
          if (!finalPath) {
            throw new Error(
              "App installed but could not locate executable. " +
              "Please check your installed apps and try opening manually.",
            );
          }
          type = "exe";
          managedByOneviewInstaller = true;
        } else {
          // ── ONEVIEW-MANAGED INSTALL (inside Secret folder) ───────────────────
          if (!window.api?.installManagedWindowsApp) {
            throw new Error("Managed installer API is unavailable.");
          }
          installDir = getOneviewManagedInstallDir(secretDir, app);
          manifestName = getOneviewManagedManifestName(app);
          updateBtnUI(isUpdate ? "Applying update..." : "Installing app...");
          const installResult = await window.api.installManagedWindowsApp({
            installerPath: targetPath,
            installDir,
            manifestName,
            silent: true,
          });
          if (!installResult?.success) {
            throw new Error(
              installResult?.message || "Installer did not complete successfully.",
            );
          }
          const manifest = installResult?.manifest || {};
          const binaryName =
            String(manifest?.binaryName || app?.binaryName || app?.installedBinaryName || "").trim();
          finalPath = String(
            manifest?.exePath ||
              (binaryName ? `${installDir}\\${binaryName}` : ""),
          ).trim();
          uninstallPath = String(
            manifest?.uninstallPath || `${installDir}\\Uninstall.exe`,
          ).trim();
          if (!finalPath) {
            throw new Error("Installer completed but no executable path was returned.");
          }
          type = "exe";
          managedByOneviewInstaller = true;
        }
      } else if (isZip) {
        // Unzip if needed
        // Assume folder name is filename without ext
        const folderName =
          isUpdate && needsExternalElectronCleanup
            ? app.id
            : filename.replace(".zip", "");
        const extractPath = `${secretDir}/${folderName}`;

        updateBtnUI("Unzipping...");

        try {
          if (
            isUpdate &&
            previousInstall?.localPath &&
            window.api?.deletePath
          ) {
            const cleanupResult = await window.api.deletePath(
              previousInstall.localPath,
              cleanupOptions,
            );
            if (!cleanupResult?.success) {
              console.warn(
                "Previous install cleanup warning:",
                cleanupResult?.message || previousInstall.localPath,
              );
            }
          }
          const unzipMode = isStandaloneExternalExeApp(app)
            ? "electron-exe"
            : "default";
          await window.api.unzipFile(targetPath, extractPath, {
            mode: unzipMode,
          });
          finalPath = extractPath; // Web app root becomes the extracted folder

          // Cleanup zip? Maybe keep it for cache. For now keep it.

          // If it's a web app, we point to this folder
          // BUT: Sometimes zip extracts to a subfolder.
          // We will assume "Standard Zip" where content is at root or inside one folder.
          // Our runner expects the path to contain package.json or index.html for web apps.
          // We point to the folder we extracted to.
        } catch (err) {
          console.error("Unzip Failed", err);
          alert("Download successful but failed to unzip. " + err.message);
          delete window.activeDownloads[app.id];
          updateBtnUI("Error", true);
          return;
        }
      } else {
        // It's likely an EXE or direct file
        if (
          isUpdate &&
          previousInstall?.packagePath &&
          previousInstall.packagePath !== targetPath &&
          window.api?.deletePath
        ) {
          const cleanupResult = await window.api.deletePath(
            previousInstall.packagePath,
            cleanupOptions,
          );
          if (!cleanupResult?.success) {
            console.warn(
              "Previous package cleanup warning:",
              cleanupResult?.message || previousInstall.packagePath,
            );
          }
        }
        if (app.releaseUrl && app.releaseUrl.endsWith(".exe")) {
          type = "exe";
        }
      }
      let oneviewUrl = "";
      let installedExtensionEntry = null;
      if (
        LOCAL_WEB_APP_TYPES.has(String(type || "").toLowerCase()) &&
        window.api &&
        typeof window.api.resolveOneviewAppUrl === "function"
      ) {
        const resolved = await window.api.resolveOneviewAppUrl(
          app.id,
          finalPath,
        );
        if (resolved?.success && resolved.url) {
          oneviewUrl = resolved.url;
        }
      }
      if (String(type || "").toLowerCase() === "oneview-extension") {
        if (!isZip) {
          throw new Error("OneView extensions must be distributed as zip releases.");
        }
        if (
          !window.api ||
          typeof window.api.installBrowserExtensionFromPath !== "function"
        ) {
          throw new Error("Extension installation API is unavailable.");
        }
        const extensionInstall = await window.api.installBrowserExtensionFromPath({
          path: finalPath,
          installSource: "appstore",
          releaseUrl: app.releaseUrl || "",
          enabled: true,
        });
        if (!extensionInstall?.success || !extensionInstall?.entry) {
          throw new Error(
            extensionInstall?.message || "Could not register OneView extension.",
          );
        }
        installedExtensionEntry = extensionInstall.entry;
        oneviewUrl = String(installedExtensionEntry.rootUrl || "").trim();
      }

      // Install Success
      delete window.activeDownloads[app.id];
      installedApps[app.id] = {
        ...app,
        type: type,
        tech:
          managedByOneviewInstaller && !String(app?.tech || "").trim()
            ? "electron"
            : app.tech,
        localPath: finalPath,
        packagePath: isZip ? null : targetPath,
        installDir,
        uninstallPath,
        manifestName,
        installFlow: managedByOneviewInstaller ? "oneview-installer" : "",
        managedByOneviewInstaller,
        // Persist system-wide flag so launch skips re-install and opens the system app
        systemWideInstall: isSystemWideApp ? true : (app?.systemWideInstall || false),
        oneviewUrl,
        extensionEntry: installedExtensionEntry,
        installedAt: new Date().toISOString(),
      };

      writeInstalledApps(installedApps);
      markCachedUserInstallation(app.id, true);
      const installedRecord = installedApps[app.id];

      console.log("Local Storage updated")
      
      // --- API INTEGRATION: Send Installation Data ---
      try {
        const empIdStr = localStorage.getItem("username") || "";
        const empId = parseInt(empIdStr, 10);
        
        if (!isNaN(empId)) {
          
          const appKey = app.id
          console.log("Mapped app name to key:", appKey);
          const payload = {
            emp_id: empId,
            installation: {
              [appKey]: true
            }
          };
          console.log("Sending installation data payload:", payload);
          fetch(`${APP_SERVICE_BASE_URL}/api/send-user-installation-data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }).then(res => {
             if (!res.ok) console.warn("Failed to send installation data", res.status);
             else console.log("Successfully sent installation data for", app.name);
          }).catch(err => {
             console.error("Error sending installation data:", err);
          });
        }
      } catch (err) {
        console.error("Error preparing installation payload:", err);
      }
      // -----------------------------------------------

      renderAppsOptimized(allApps);

      // Refresh View Page if available
      if (typeof window.loadMiniInstalledApps === "function") {
        window.loadMiniInstalledApps();
      }

      showToast({
        title: isUpdate ? "Update Installed" : "App Installed",
        message: isUpdate
          ? `${app.name} has been updated successfully.`
          : `${app.name} has been installed successfully.`,
        icon: isUpdate ? "⬆️" : "✅",
      });
      if (autoLaunchAfterInstall && installedRecord) {
        try {
          await launchApp(installedRecord);
        } catch (launchError) {
          console.warn("Auto-launch after install failed:", launchError);
        }
      }
    })
    .catch((err) => {
      if (unsubscribeDownloadProgress) unsubscribeDownloadProgress();
      console.error("Install Failed", err);
      delete window.activeDownloads[app.id];
      updateBtnUI("Retry", true);
      // Optionally show toast
      alert("Installation Failed: " + err.message);
    });
}

async function launchApp(app) {
  // Ensure we launch the version from installedApps to get the correct path/type
  const installedApp = installedApps[app.id];
  if (!installedApp) {
    console.error("App not installed:", app.id);
    return;
  }

  if (isStandaloneExternalExeApp(installedApp)) {
    try {
      await launchStandaloneExternalExe(installedApp);
    } catch (err) {
      console.error("External Electron launch failed:", err);
      showToast({
        title: "Launch Failed",
        message: err?.message || `Could not launch ${installedApp.name}.`,
        icon: "⚠️",
      });
    }
    return;
  }

  if (installedApp.type === "oneview-extension") {
    sessionStorage.setItem(
      "oneview.pendingExtensionOpenPath",
      String(installedApp.localPath || ""),
    );
    window.location.href = "../view/view.html";
    return;
  }

  sessionStorage.setItem(
    SESSION_KEYS.activeLaunchApp,
    JSON.stringify(installedApp),
  );
  window.location.href = "../runner/runner.html";
}

function setupEventListeners() {
  // Back button removed - using dashboard's close button instead

  // Category Filter Logic
  const filterBtns = document.querySelectorAll(".filter-btn[data-cat]");
  filterBtns.forEach((item) => {
    item.addEventListener("click", (e) => {
      // UI Toggle
      filterBtns.forEach((i) => i.classList.remove("active"));
      const target = e.currentTarget; // safe click target
      target.classList.add("active");

      // Filter Logic
      const cat = target.dataset.cat;
      updateGridHeader(cat);

      if (cat === "all") {
        renderApps(allApps);
      } else {
        const filtered = allApps.filter(
          (app) =>
            app.channel && app.channel.toLowerCase() === cat.toLowerCase(),
        );
        renderApps(filtered);
      }
    });
  });
}

function updateGridHeader(category) {
  const availableHeader = document.getElementById("availableGridHeader");
  const installedHeader = document.getElementById("installedGridHeader");
  if (!availableHeader || !installedHeader) return;

  const normalizedCategory = String(category || "all").toLowerCase();
  let base = "";
  switch (normalizedCategory) {
    case "all":
      base = "All Apps";
      break;
    case "eda":
      base = "eDa Tools";
      break;
    case "web":
      base = "Web Apps";
      break;
    case "creative":
      base = "Creative Suite";
      break;
    default:
      base =
        normalizedCategory.charAt(0).toUpperCase() +
        normalizedCategory.slice(1) +
        " Apps";
  }

  availableHeader.textContent = `Available ${base}`;
  installedHeader.textContent = `Installed ${base}`;
}

function setupSearch() {
  const modal = document.getElementById("searchModal");
  const input = document.getElementById("searchInput");
  const trigger = document.getElementById("searchTrigger");
  const results = document.getElementById("searchResults");
  const closeBtn = document.getElementById("closeSearchBtn");

  // If search elements don't exist (removed with top bar), skip setup
  if (!modal || !input || !results || !closeBtn) {
    console.log("Search elements not found - search disabled");
    return;
  }

  function openModal() {
    modal.classList.add("active");
    input.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    input.value = "";
    results.innerHTML = "";
  }

  // Only add trigger listener if trigger exists
  if (trigger) {
    trigger.addEventListener("click", openModal);
  }

  closeBtn.addEventListener("click", closeModal);

  // Shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      modal.classList.contains("active") ? closeModal() : openModal();
    }
    if (e.key === "Escape") closeModal();
  });

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Search Logic
  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 1) {
      results.innerHTML = "";
      return;
    }

    const matches = allApps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.author.toLowerCase().includes(query) ||
        app.channel.toLowerCase().includes(query),
    );
    renderSearchResults(matches);
  });

  function renderSearchResults(matches) {
    if (matches.length === 0) {
      results.innerHTML =
        '<div style="padding:20px; text-align:center; color:var(--text-muted)">No results found</div>';
      return;
    }

    results.innerHTML = matches
      .map(
        (app) => `
            <div class="search-result-row" onclick="handleSearchSelect('${app.id}')" style="
                display:flex; align-items:center; gap:16px; padding:12px; 
                cursor:pointer; border-radius:12px; transition:bg 0.2s;
            " onmouseover="this.style.background='rgba(0,0,0,0.03)'" onmouseout="this.style.background='transparent'">
                <div style="font-weight:600; color:var(--text-main)">${app.name}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-left:auto">${app.channel}</div>
            </div>
        `,
      )
      .join("");
  }
}

window.handleSearchSelect = (appId) => {
  document.getElementById("searchModal").classList.remove("active");

  // Reset to 'all' to ensure app is visible
  document.querySelector('.filter-btn[data-cat="all"]').click();

  setTimeout(() => {
    const btn = document.getElementById(`btn-${appId}`);
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      // Flash effect
      const card = btn.closest(".app-card");
      card.style.transition = "box-shadow 0.3s";
      card.style.boxShadow = "0 0 0 4px var(--primary)";
      setTimeout(() => {
        card.style.boxShadow = "";
      }, 1000);
    }
  }, 400);
};

// CSS Injection for Animation on the fly (if not in CSS)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
    from { 
        opacity: 0; 
        transform: translateX(100px); 
    }
    to { 
        opacity: 1; 
        transform: translateX(0); 
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

`;
document.head.appendChild(styleSheet);
