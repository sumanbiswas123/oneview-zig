import { escapeHtml, ticketTypeToMeta } from "../../lib/utils.js";
import { showToast } from "../../lib/notifications.js";
import {
  isStandaloneExternalExeApp,
  launchStandaloneExternalExe,
} from "../../lib/external-exe.js";
import { openOverlayModal, closeOverlayModal } from "../../lib/modals.js";
import {
  shouldTrackAppLaunchClick,
  trackInstalledAppClick,
} from "../../lib/click-tracking.js";
import { initializeOneviewSharedStorageSync } from "../../lib/oneview-shared-storage.js";
import {
  APP_PROTOCOL_SCHEME,
  isAppProtocolUrl,
  IS_DEV_APP_BUILD,
  normalizeAppPartitionName,
  RESOURCE_SERVICE_BASE_URL,
} from "../../lib/app-env.js";
import { PARTITIONS, STORAGE_KEYS } from "../../lib/app-runtime.js";
import { createViewSettingsManager } from "./view-settings.js";
import { createViewExtensionsManager } from "./view-extensions.js";
import { createViewCredentialsManager } from "./view-credentials.js";
import { createViewTabsManager } from "./view-tabs.js";
// import { loadUrlInWebview } from "../../lib/webview.js"; // view.js has its own logic currently

/**
 * View Page Scripts - Tab System
 */

console.log("View Page Script initializing...");

// State
let tabs = [];
let activeTabId = null;
let viewPageInitialized = false;
let tabContextAnchorId = null;
let passwordEditTarget = null;
let browserExtensionsCache = [];
let managedDownloadsCache = [];
let credentialCache = {
  wppproduction: [],
  vml: [],
  gsk: [],
  guest: [],
  synapse: [],
  contentgen: [],
};
const PROFILE_HISTORY_STORAGE_KEY = STORAGE_KEYS.profileHistory;
const PROFILE_HISTORY_SHARED_KEY = "view.profileHistory.v1";
let profileHistoryCache = { wppproduction: [], vml: [], gsk: [], guest: [] };
const CUSTOM_BOOKMARKS_STORAGE_KEY = STORAGE_KEYS.customBookmarks;
let customBookmarks = [];
let passwordProfileId = "guest";
let historyProfileId = "guest";
let historySearchQuery = "";
let bookmarkProfileId = "guest";
let bookmarkEditId = null;
let extensionPromptSession = null;
let activeHttpAuthChallenge = null;
const rememberPromptCooldown = new Map();
const AUTH_GATEWAY_HOSTS = new Set([
  "login.veevavault.com",
  "federation.gsk.com",
]);
let cachedWebviewPreloadPath = null;
let addressSearchSelectedIndex = -1;
let addressSearchResults = [];
let nativeSettingsGeneralInfo = {
  version: "",
  defaultOpenStatus: "",
};
let credentialCacheRefreshedAt = 0;
let credentialCacheRefreshInFlight = null;
let credentialDebugLogBound = false;
const PERF_KEY = STORAGE_KEYS.perfEnabled;
let perfEnabledCache = null;
let viewGlobalListenersBound = false;
const viewSettingsState = {};
Object.defineProperties(viewSettingsState, {
  tabs: {
    get: () => tabs,
    set: (value) => {
      tabs = value;
    },
  },
  activeTabId: {
    get: () => activeTabId,
    set: (value) => {
      activeTabId = value;
    },
  },
  browserExtensionsCache: {
    get: () => browserExtensionsCache,
    set: (value) => {
      browserExtensionsCache = value;
    },
  },
  managedDownloadsCache: {
    get: () => managedDownloadsCache,
    set: (value) => {
      managedDownloadsCache = value;
    },
  },
  nativeSettingsGeneralInfo: {
    get: () => nativeSettingsGeneralInfo,
    set: (value) => {
      nativeSettingsGeneralInfo = value;
    },
  },
  historyProfileId: {
    get: () => historyProfileId,
    set: (value) => {
      historyProfileId = value;
    },
  },
  historySearchQuery: {
    get: () => historySearchQuery,
    set: (value) => {
      historySearchQuery = value;
    },
  },
  currentProfileId: {
    get: () => currentProfileId,
    set: (value) => {
      currentProfileId = value;
    },
  },
  profileHistoryCache: {
    get: () => profileHistoryCache,
    set: (value) => {
      profileHistoryCache = value;
    },
  },
  credentialCache: {
    get: () => credentialCache,
    set: (value) => {
      credentialCache = value;
    },
  },
  passwordProfileId: {
    get: () => passwordProfileId,
    set: (value) => {
      passwordProfileId = value;
    },
  },
  passwordEditTarget: {
    get: () => passwordEditTarget,
    set: (value) => {
      passwordEditTarget = value;
    },
  },
  activeHttpAuthChallenge: {
    get: () => activeHttpAuthChallenge,
    set: (value) => {
      activeHttpAuthChallenge = value;
    },
  },
  credentialCacheRefreshedAt: {
    get: () => credentialCacheRefreshedAt,
    set: (value) => {
      credentialCacheRefreshedAt = value;
    },
  },
  credentialCacheRefreshInFlight: {
    get: () => credentialCacheRefreshInFlight,
    set: (value) => {
      credentialCacheRefreshInFlight = value;
    },
  },
});
const SPECIAL_GUEST_APP_SCOPES = {
  synapse: {
    partition: PARTITIONS.synapse,
  },
  contentgen: {
    partition: PARTITIONS.contentgen,
  },
};
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
const RESOURCE_SERVICE_ORIGIN = (() => {
  try {
    return new URL(RESOURCE_SERVICE_BASE_URL).origin.toLowerCase();
  } catch (_err) {
    return "";
  }
})();
const CONTENTGEN_ICON_LIGHT = new URL(
  "../../assets/contentgen.png",
  import.meta.url,
).href;
const CONTENTGEN_ICON_DARK = new URL(
  "../../assets/contentgen-dark.png",
  import.meta.url,
).href;

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

function hoistViewModalsToBody() {
  [
    "httpAuthModal",
    "bookmarkModal",
    "cacheActionModal",
    "extensionsManagerModal",
  ].forEach((id) => {
    const modal = document.getElementById(id);
    if (!modal || modal.dataset.hoistedToBody === "1") return;
    document.body.appendChild(modal);
    modal.dataset.hoistedToBody = "1";
  });
}

async function detachActiveTabToSeparateWindow() {
  const tab = getActiveTab();
  if (!tab || tab.isHome || !tab.url || !window.api?.openDetachedViewWindow) {
    return;
  }
  try {
    await window.api.openDetachedViewWindow({
      url: tab.url,
      title: tab.title || "Detached Tab",
      partition: tab.partition || PARTITIONS.guest,
    });
    closeTab(tab.id);
  } catch (error) {
    console.error("Failed to open detached tab window", error);
    showToast("Could not open the page in a separate window.", "error");
  }
}

function isPerfEnabled() {
  if (perfEnabledCache !== null) return perfEnabledCache;
  try {
    const raw = localStorage.getItem(PERF_KEY);
    perfEnabledCache = raw === "1" || raw === "true";
    return perfEnabledCache;
  } catch (_err) {
    perfEnabledCache = false;
    return false;
  }
}

function perfMark(scope, message, meta = null) {
  if (!isPerfEnabled()) return;
  const payload = meta ? { ...meta } : {};
  try {
    console.log(`[PERF][${scope}] ${message}`, payload);
  } catch (_err) {}
}

window.addEventListener("storage", (event) => {
  if (event.key === PERF_KEY) {
    perfEnabledCache = null;
    if (window.api && typeof window.api.setPerfLoggingEnabled === "function") {
      window.api.setPerfLoggingEnabled(isPerfEnabled()).catch(() => {});
    }
  }
});

// Profile System
const PROFILES = {
  wppproduction: {
    id: "wppproduction",
    name: "WPPProduction",
    partition: PARTITIONS.wppproduction,
    color: "#000000",
    bgColor: "#e2e8f0",
    label: "W",
  },
  vml: {
    id: "vml",
    name: "VML",
    partition: PARTITIONS.vml,
    color: "#ff0000",
    bgColor: "#fee2e2",
    label: "V",
  },
  gsk: {
    id: "gsk",
    name: "GSK",
    partition: PARTITIONS.gsk,
    color: "#f37521",
    bgColor: "#ffedd5",
    label: "G",
  },
  guest: {
    id: "guest",
    name: "Guest",
    partition: PARTITIONS.guest,
    color: "#64748b",
    bgColor: "#f1f5f9",
    label: "?",
  },
};

let currentProfileId = "guest"; // Default
function getCurrentProfileId() {
  return currentProfileId;
}

const viewCredentialsManager = createViewCredentialsManager({
  state: viewSettingsState,
  constants: { AUTH_GATEWAY_HOSTS, RESOURCE_SERVICE_ORIGIN, PROFILES },
  showToast,
  openOverlayModal,
  closeOverlayModal,
  renderProfilePillSelect,
  resolveCredentialScopeIdForTab,
  applyProfileSelection,
  getCurrentProfileId: () => currentProfileId,
  escapeHtml,
});
const {
  canUseSecureCredentialApi,
  getAutofillCredentialForTab,
  initHttpAuthPrompt,
  initPasswordManager,
  installCredentialCaptureHooks,
  isCredentialAutomationDomain,
  isLikelyAuthPage,
  maybeOfferRememberCredentials,
  normalizeDomain,
  refreshCredentialCacheIfStale,
  scheduleCredentialAutofill,
  shouldEnableCredentialAutomation,
  startCredentialCapturePolling,
  handleCredentialFieldInteraction,
  hideCredentialDropdown,
} = viewCredentialsManager;

let viewSettingsManager = null;
let viewTabsManager = null;
const viewExtensionsManager = createViewExtensionsManager({
  state: viewSettingsState,
  constants: {
    PROFILES,
    PENDING_EXTENSION_OPEN_STORAGE_KEY: "oneview.pendingExtensionOpenPath",
    EXTENSION_PIN_STORAGE_KEY: "oneview.browserExtensions.pinned.v1",
    IS_DEV_APP_BUILD,
  },
  escapeHtml,
  showToast,
  openOverlayModal,
  closeOverlayModal,
  getActiveTab: (...args) => viewTabsManager?.getActiveTab?.(...args) ?? null,
  getActiveWebview: (...args) =>
    viewTabsManager?.getActiveWebview?.(...args) ?? null,
  createTab: (...args) => viewTabsManager?.createTab?.(...args),
  refreshActiveNativeSettingsPage: (...args) =>
    viewSettingsManager?.refreshActiveNativeSettingsPage?.(...args) ??
    Promise.resolve(),
  closeSettingsMenu,
});
const {
  closeBrowserExtensionPopup,
  closeBrowserExtensionsMenu,
  closeDownloadsManagerPanel,
  formatDownloadBytes,
  formatDownloadEta,
  formatDownloadSpeed,
  initDownloadsManager,
  initExtensionsManager,
  loadManagedDownloadsFromMain,
  refreshBrowserExtensionsUi,
  refreshExtensionsManagerList,
} = viewExtensionsManager;

viewTabsManager = createViewTabsManager({
  state: viewSettingsState,
  constants: {
    PARTITIONS,
    PROFILES,
    LOCAL_WEB_APP_TYPES,
    WEBVIEW_POOL_MAX: 6,
    WEBVIEW_POOL_KEEPALIVE_MS: 12000,
    TAB_PREWARM_ENABLED: true,
    PREWARM_ALL_PROFILE_PARTITIONS: false,
    IS_DEV_APP_BUILD,
  },
  createNativePageDescriptor: (...args) =>
    viewSettingsManager?.createNativePageDescriptor?.(...args) ?? null,
  ensureNativeSettingsGeneralInfo: (...args) =>
    viewSettingsManager?.ensureNativeSettingsGeneralInfo?.(...args) ??
    Promise.resolve(),
  normalizeSettingsSection: (...args) =>
    viewSettingsManager?.normalizeSettingsSection?.(...args) ?? "general",
  renderNativeSettingsPage: (...args) =>
    viewSettingsManager?.renderNativeSettingsPage?.(...args),
  closeBrowserExtensionsMenu,
  closeBrowserExtensionPopup,
  refreshBrowserExtensionsUi,
  refreshTabScrollControls,
  syncProfileSelectionForTab,
  updateProfileLockUI,
  perfMark,
  shouldRequirePlatformApiForNavigation,
  getWebviewPlatformApiFlag,
  setWebviewPlatformApiFlag,
  getWebviewPreloadPathCached,
  startCredentialCapturePolling,
  scheduleCredentialAutofill,
  installCredentialCaptureHooks,
  refreshCredentialCacheIfStale,
  getAutofillCredentialForTab,
  resolveAssignedProfileIdForTab,
  getCredentialScopeIdByPartition,
  resolveCredentialScopeIdForTab,
  maybeOfferRememberCredentials,
  syncTabProfileForPage,
  trackProfileHistory,
  resolveProfileIdForTab,
  resolveAssignedProfileId,
  resolveStrictProfileNavigationTarget,
  resolveNavigationPartition,
  applyProfileSelection,
  openProfilePromptDialog,
  handleCredentialFieldInteraction,
  hideCredentialDropdown,
});
const {
  closeTab,
  closeTabsBulk,
  createTab,
  createWebviewForTab,
  duplicateTab,
  disposeWebviewRuntime,
  getActiveTab,
  getActiveWebview,
  goToActiveTabHome,
  isInspectableLocalFileTab,
  navigateTo,
  navigateToTab,
  performSearch,
  startWebviewRuntime,
  switchRelativeTab,
  switchTab,
  updateTabTitle,
  updateUrlDisplay,
  updateUrlDisplayString,
  getTabs,
} = viewTabsManager;

viewSettingsManager = createViewSettingsManager({
  state: viewSettingsState,
  constants: { PROFILES, PARTITIONS, IS_DEV_APP_BUILD },
  escapeHtml,
  showToast,
  isPerfEnabled,
  formatDownloadBytes,
  formatDownloadSpeed,
  formatDownloadEta,
  formatHistoryTime,
  loadManagedDownloadsFromMain,
  refreshExtensionsManagerList,
  saveProfileHistoryStore,
  getActiveTab,
  updateTabTitle,
  createTab,
  switchTab,
  navigateTo,
});
const {
  bindSettingsShortcutsGlobal,
  createNativePageDescriptor,
  ensureNativeSettingsGeneralInfo,
  getSettingsTabTitle,
  initNativeSettingsUi,
  initSettingsMenu,
  isEditableShortcutTarget,
  isNativeSettingsTab,
  normalizeSettingsSection,
  openSettingsTab,
  refreshActiveNativeSettingsPage,
  renderNativeSettingsPage,
  updateNativeSettingsTabSection,
} = viewSettingsManager;

function isGuestMode() {
  try {
    return localStorage.getItem("username") === "Guest";
  } catch (_err) {
    return false;
  }
}

function getDedicatedGuestAppScope(url = "", title = "", explicitScope = "") {
  const forced = String(explicitScope || "")
    .trim()
    .toLowerCase();
  if (SPECIAL_GUEST_APP_SCOPES[forced]) return forced;

  const lowerTitle = String(title || "")
    .trim()
    .toLowerCase();
  const lowerUrl = String(url || "")
    .trim()
    .toLowerCase();
  try {
    const parsed = new URL(String(url || ""));
    const normalizedOrigin = `${parsed.protocol}//${parsed.host}`.toLowerCase();
    const normalizedPath = String(parsed.pathname || "/").toLowerCase();
    if (normalizedOrigin === RESOURCE_SERVICE_ORIGIN) {
      if (normalizedPath === "/" || normalizedPath === "") return "synapse";
    }
    if (normalizedOrigin === "http://10.215.56.196:3456") {
      return "contentgen";
    }
  } catch (_err) {}

  if (
    /content[\s-]*gen/.test(lowerTitle) ||
    /content[\s-]*gen/.test(lowerUrl)
  ) {
    return "contentgen";
  }

  if (lowerTitle.includes("synapse")) {
    return "synapse";
  }

  return "";
}

function getVisibleProfileIdByPartition(partition) {
  const normalizedPartition = normalizeAppPartitionName(partition);
  if (
    normalizedPartition === PARTITIONS.synapse ||
    normalizedPartition === PARTITIONS.contentgen
  ) {
    return "guest";
  }

  const found = Object.values(PROFILES).find(
    (p) => p.partition === normalizedPartition,
  );
  return found ? found.id : null;
}

function getCredentialScopeIdByPartition(partition) {
  const normalizedPartition = normalizeAppPartitionName(partition);
  if (normalizedPartition === PARTITIONS.synapse) return "synapse";
  if (normalizedPartition === PARTITIONS.contentgen) return "contentgen";
  return getVisibleProfileIdByPartition(normalizedPartition);
}

function resolveNavigationPartition(
  url = "",
  requestedPartition = "",
  title = "",
  options = {},
) {
  const explicitScope =
    String(options?.sessionScope || options?.credentialScope || "").trim() ||
    "";
  const dedicatedScope = getDedicatedGuestAppScope(url, title, explicitScope);
  if (dedicatedScope && SPECIAL_GUEST_APP_SCOPES[dedicatedScope]) {
    return SPECIAL_GUEST_APP_SCOPES[dedicatedScope].partition;
  }

  return normalizeAppPartitionName(
    requestedPartition ||
      PROFILES[currentProfileId]?.partition ||
      PARTITIONS.guest,
  );
}

async function updateSynapseVisibility() {
  const synapseBtn = document.getElementById("view-synapse-link-btn");
  if (!synapseBtn) return;

  synapseBtn.style.display = "none";
  if (isGuestMode()) return;

  const storedEmpId = String(localStorage.getItem("emp_id") || "").trim();
  const usernameValue = String(localStorage.getItem("username") || "").trim();
  const fallbackEmpId = /^\d+$/.test(usernameValue) ? usernameValue : "";
  const currentEmpId = storedEmpId || fallbackEmpId;
  if (!currentEmpId) return;

  try {
    const response = await fetch(
      `${RESOURCE_SERVICE_BASE_URL}/api/list_of_users`,
      {
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const payload = await response.json();
    const users = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.users)
        ? payload.users
        : [];

    const allowedEmpIds = new Set(
      users.map((user) => String(user?.emp_id ?? "").trim()).filter(Boolean),
    );

    synapseBtn.style.display = allowedEmpIds.has(currentEmpId)
      ? "flex"
      : "none";
  } catch (error) {
    console.warn("Could not verify Synapse visibility in view", error);
    synapseBtn.style.display = "none";
  }
}

function renderAddressSearchDropdown(
  query = "",
  dropdownId = "addressSearchDropdown",
) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  const normalizedQuery = String(query || "")
    .trim()
    .toLowerCase();
  if (!normalizedQuery) {
    dropdown.classList.add("hidden");
    addressSearchResults = [];
    addressSearchSelectedIndex = -1;
    return;
  }

  // 1. Search Open Tabs
  const matchingTabs = tabs
    .filter((tab) => {
      const title = String(tab.title || "").toLowerCase();
      const url = String(tab.url || "").toLowerCase();
      return title.includes(normalizedQuery) || url.includes(normalizedQuery);
    })
    .map((tab) => ({
      type: "tab",
      id: tab.id,
      title: tab.title || "Untitled Tab",
      url: tab.url || "",
      partition: tab.partition,
    }));

  // 2. Search History (across all profiles)
  let matchingHistory = [];
  Object.values(profileHistoryCache).forEach((historyList) => {
    if (!Array.isArray(historyList)) return;
    historyList.forEach((entry) => {
      const title = String(entry.title || "").toLowerCase();
      const url = String(entry.url || "").toLowerCase();
      if (title.includes(normalizedQuery) || url.includes(normalizedQuery)) {
        // Avoid duplicates in history or overlap with open tabs (roughly)
        const isDuplicate = matchingHistory.some((m) => m.url === entry.url);
        const alreadyOpen = matchingTabs.some((m) => m.url === entry.url);
        if (!isDuplicate && !alreadyOpen) {
          matchingHistory.push({
            type: "history",
            title: entry.title || "History Item",
            url: entry.url,
            partition: entry.partition || PARTITIONS.guest,
          });
        }
      }
    });
  });

  // 3. Raw Query Item (Primary selection)
  const rawQueryItem = {
    type: "search",
    title: query,
    url: `Search for "${query}"`,
  };

  // Limit results
  addressSearchResults = [
    rawQueryItem,
    ...matchingTabs.slice(0, 5),
    ...matchingHistory.slice(0, 15),
  ];
  addressSearchSelectedIndex = 0;

  let html = "";

  // Render Search Item
  html += renderAddressSearchItem(addressSearchResults[0], 0);

  const filteredTabs = addressSearchResults.filter((r) => r.type === "tab");
  if (filteredTabs.length > 0) {
    html += `<div class="address-search-group-label">Open Tabs</div>`;
    filteredTabs.forEach((res) => {
      const globalIdx = addressSearchResults.indexOf(res);
      html += renderAddressSearchItem(res, globalIdx);
    });
  }

  const filteredHistory = addressSearchResults.filter(
    (r) => r.type === "history",
  );
  if (filteredHistory.length > 0) {
    html += `<div class="address-search-group-label">History</div>`;
    filteredHistory.forEach((res) => {
      const globalIdx = addressSearchResults.indexOf(res);
      html += renderAddressSearchItem(res, globalIdx);
    });
  }

  dropdown.innerHTML = html;
  dropdown.classList.remove("hidden");
}

function renderAddressSearchItem(res, index) {
  const isSelected = index === addressSearchSelectedIndex;
  let initials = String(res.title || "H")
    .charAt(0)
    .toUpperCase();
  let iconClass = "is-history";
  let badge = "History";

  if (res.type === "tab") {
    iconClass = "is-tab";
    badge = "Tab";
  } else if (res.type === "search") {
    iconClass = "is-search";
    badge = "Search";
    initials = "🔍";
  }

  return `
    <div class="address-search-item ${iconClass} ${isSelected ? "is-selected" : ""}" 
         data-index="${index}">
      <div class="address-search-item-icon">${initials}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${escapeHtml(res.title)}</span>
        <span class="address-search-item-url">${escapeHtml(res.url)}</span>
      </div>
      <div class="address-search-item-badge">${badge}</div>
    </div>
  `;
}

async function commitAddressSearchSelection(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (
    addressSearchSelectedIndex < 0 ||
    addressSearchSelectedIndex >= addressSearchResults.length
  ) {
    performSearch(input.value);
    return;
  }

  const selected = addressSearchResults[addressSearchSelectedIndex];
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) dropdown.classList.add("hidden");

  if (selected.type === "tab") {
    await switchTab(selected.id);
  } else if (selected.type === "history") {
    // Re-resolve to ensure profile modal shows if it's an unknown link,
    // and to handle global profile switching.
    await openUrlFromDashboard(selected.url, selected.partition, selected.title);
  } else {
    // Default search
    performSearch(input.value);
  }

  input.blur();
}

function initAddressSearchDropdown(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  input.addEventListener("input", () => {
    renderAddressSearchDropdown(input.value, dropdownId);
  });

  input.addEventListener("keydown", (event) => {
    if (dropdown.classList.contains("hidden")) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      addressSearchSelectedIndex =
        (addressSearchSelectedIndex + 1) % addressSearchResults.length;
      updateAddressSearchHighlight(dropdownId);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      addressSearchSelectedIndex =
        (addressSearchSelectedIndex - 1 + addressSearchResults.length) %
        addressSearchResults.length;
      updateAddressSearchHighlight(dropdownId);
    } else if (event.key === "Enter") {
      event.preventDefault();
      commitAddressSearchSelection(inputId, dropdownId);
    } else if (event.key === "Escape") {
      dropdown.classList.add("hidden");
    }
  });

  dropdown.addEventListener("click", (event) => {
    const item = event.target.closest(".address-search-item");
    if (!item) return;
    const index = parseInt(item.dataset.index);
    if (!isNaN(index)) {
      addressSearchSelectedIndex = index;
      commitAddressSearchSelection(inputId, dropdownId);
    }
  });
}

function updateAddressSearchHighlight(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;
  dropdown.querySelectorAll(".address-search-item").forEach((item, idx) => {
    const itemIdx = parseInt(item.dataset.index);
    item.classList.toggle(
      "is-selected",
      itemIdx === addressSearchSelectedIndex,
    );
    if (itemIdx === addressSearchSelectedIndex) {
      item.scrollIntoView({ block: "nearest" });
    }
  });
}

function setupViewSearch() {
  const searchInput = document.getElementById("googleSearchInput");
  if (searchInput && searchInput.dataset.boundAddressInput !== "1") {
    searchInput.dataset.boundAddressInput = "1";
    searchInput.addEventListener("keydown", (event) => {
      const dropdown = document.getElementById("addressSearchDropdownHome");
      if (dropdown && !dropdown.classList.contains("hidden")) return;
      if (event.key === "Enter") performSearch(searchInput.value);
    });
    initAddressSearchDropdown("googleSearchInput", "addressSearchDropdownHome");
  }

  const urlDisplay = document.getElementById("urlDisplay");
  if (urlDisplay && urlDisplay.dataset.boundAddressInput !== "1") {
    urlDisplay.dataset.boundAddressInput = "1";
    urlDisplay.addEventListener("focus", () => {
      urlDisplay.select?.();
    });
    urlDisplay.addEventListener("keydown", (event) => {
      const dropdown = document.getElementById("addressSearchDropdown");
      if (dropdown && !dropdown.classList.contains("hidden")) {
        // Handled by initAddressSearchDropdown
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        performSearch(urlDisplay.value);
        urlDisplay.blur();
      } else if (event.key === "Escape") {
        event.preventDefault();
        const activeTab = getActiveTab();
        updateUrlDisplay(activeTab?.url || "");
        urlDisplay.blur();
      }
    });
    initAddressSearchDropdown("urlDisplay", "addressSearchDropdown");
  }
}

function initViewPage() {
  if (viewPageInitialized) {
    if (window.isSiteSnapStudioMode || window.parent?.isSiteSnapStudioMode) {
      window.enterSiteSnapStudioMode();
    } else {
      window.exitSiteSnapStudioMode();
    }
    // Avoid duplicate listeners/tab creation on repeated init calls.
    if (tabs.length === 0) {
      createTab();
    } else {
      switchTab(activeTabId || tabs[0].id);
    }
    return;
  }
  viewPageInitialized = true;

  console.log("initViewPage called");
  initializeOneviewSharedStorageSync().catch((err) => {
    console.warn("Could not initialize OneView shared storage sync", err);
  });
  bindViewGlobalListeners();
  if (window.api && typeof window.api.setPerfLoggingEnabled === "function") {
    window.api.setPerfLoggingEnabled(isPerfEnabled()).catch(() => {});
  }
  if (window.api && typeof window.api.getPerfLogPath === "function") {
    window.api
      .getPerfLogPath()
      .then((res) => {
        if (res?.success) {
          perfMark("perf", "log-path", {
            path: res.path || "",
            enabled: res.enabled,
          });
        }
      })
      .catch(() => {});
  }
  if (
    !credentialDebugLogBound &&
    window.api &&
    typeof window.api.onCredentialDebugLog === "function"
  ) {
    credentialDebugLogBound = true;
    window.api.onCredentialDebugLog((payload) => {
      console.log("[OneView][CredentialCapture][MainRelay]", payload);
    });
  }
  if (
    document.body?.dataset.boundProfileHistorySharedStorage !== "1" &&
    window.api?.onOneviewSharedStorageUpdated
  ) {
    document.body.dataset.boundProfileHistorySharedStorage = "1";
    window.api.onOneviewSharedStorageUpdated((payload) => {
      if (String(payload?.key || "") !== PROFILE_HISTORY_SHARED_KEY) return;
      applyProfileHistorySharedEntry(payload);
      refreshActiveNativeSettingsPage().catch(() => {});
    });
  }

  // Initialize Profiles
  initProfiles();
  loadProfileHistoryStore();
  hydrateProfileHistoryFromSharedStorage().catch(() => {});
  loadCustomBookmarks();
  renderCustomBookmarks();
  syncThemeAwareImages();
  hoistViewModalsToBody();

  document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("addressSearchDropdown");
    const dropdownHome = document.getElementById("addressSearchDropdownHome");
    const urlDisplay = document.getElementById("urlDisplay");
    const googleSearchInput = document.getElementById("googleSearchInput");

    if (
      dropdown &&
      !dropdown.contains(event.target) &&
      event.target !== urlDisplay
    ) {
      dropdown.classList.add("hidden");
    }
    if (
      dropdownHome &&
      !dropdownHome.contains(event.target) &&
      event.target !== googleSearchInput
    ) {
      dropdownHome.classList.add("hidden");
    }

    const credDropdown = document.getElementById("credentialSelectionDropdown");
    if (credDropdown && !credDropdown.contains(event.target)) {
      credDropdown.classList.add("hidden");
    }
  });

  if (!document.body.dataset.viewThemeIconObserverBound) {
    document.body.dataset.viewThemeIconObserverBound = "1";
    const themeObserver = new MutationObserver(() => {
      syncThemeAwareImages();
    });
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // Disabled: prewarmBrowserExtensionPopup creates a native webview on startup
  // which causes the top-left flash before any tab is opened.
  // if (window.api?.prewarmBrowserExtensionPopup) {
  //   window.api
  //     .prewarmBrowserExtensionPopup({ partition: PARTITIONS.guest })
  //     .catch(() => {});
  // }

  // Create initial tab only if no tab exists yet.
  if (tabs.length === 0) {
    createTab();
  } else {
    switchTab(activeTabId || tabs[0].id);
  }

  // Setup New Tab Button
  const newTabBtn = document.getElementById("newTabBtn");
  if (newTabBtn) {
    newTabBtn.addEventListener("click", () => {
      createTab();
    });
  }
  setupTabScrollControls();

  try {
    setupViewSearch();
  } catch (err) {
    window.api.webContentCall("log-error", { key: `viewJS-setupViewSearch-err:${err.toString()}` }).catch(() => {});
  }
  try {
    setupBookmarks();
  } catch (err) {
    window.api.webContentCall("log-error", { key: `viewJS-setupBookmarks-err:${err.toString()}` }).catch(() => {});
  }
  updateSynapseVisibility().catch((error) => {
    console.warn("Failed to update Synapse visibility in view", error);
  });
  try {
    initBookmarkManager();
  } catch (err) {
    window.api.webContentCall("log-error", { key: `viewJS-initBookmarkManager-err:${err.toString()}` }).catch(() => {});
  }

  // Setup Browser Controls (Global/Shared)
  document.getElementById("browserBack")?.addEventListener("click", () => {
    const wv = getActiveWebview();
    if (wv && wv.canGoBack()) {
      wv.goBack();
      return;
    }
    goToActiveTabHome();
  });

  document.getElementById("browserForward")?.addEventListener("click", () => {
    const wv = getActiveWebview();
    if (wv && wv.canGoForward()) wv.goForward();
  });

  document.getElementById("browserReload")?.addEventListener("click", () => {
    const wv = getActiveWebview();
    if (wv) wv.reload();
  });
  document
    .getElementById("browserDetach")
    ?.addEventListener("click", detachActiveTabToSeparateWindow);
  document
    .getElementById("browserDetachHeader")
    ?.addEventListener("click", detachActiveTabToSeparateWindow);

  hydrateInstalledOneviewUrlsInView();
  startWebviewRuntime();

  // Setup tab context menu actions
  setupTabContextMenu();
  initHttpAuthPrompt();
  initPasswordManager();
  // initHistoryManager(); // MOVED TO SETTINGS TAB
  initExtensionPromptDialog();
  initSettingsMenu();
  bindSettingsShortcutsGlobal();
  initNativeSettingsUi();
  initExtensionsManager();
  initDownloadsManager();
  if (window.isSiteSnapStudioMode || window.parent?.isSiteSnapStudioMode) {
    window.enterSiteSnapStudioMode();
  } else {
    window.exitSiteSnapStudioMode();
  }
}

window.addEventListener("beforeunload", () => {
  closeBrowserExtensionPopup().catch(() => {});
  disposeWebviewRuntime();
});

window.addEventListener("teardown-view-system", () => {
  console.log("Teardown View System triggered");
  closeBrowserExtensionPopup().catch(() => {});
  disposeWebviewRuntime();

  // Close and destroy all active tabs
  const tabIdsToClose = tabs.map((t) => t.id);
  closeTabsBulk(tabIdsToClose, { isTeardown: true });

  // Destruct prewarm instances properly to avoid memory leaks
  const container = document.getElementById("webviews-container");
  if (container) {
    const panes = container.querySelectorAll(".webcontent-pane");
    panes.forEach((p) => {
      try {
        if (typeof p.remove === "function") p.remove();
      } catch (_e) {}
    });
    container.innerHTML = "";
  }

  tabs = [];
  activeTabId = null;
  viewPageInitialized = false;
});

function isPreservedWebsiteTab(tab) {
  if (!tab || tab.isHome) return false;
  const rawUrl = String(tab.url || "").trim();
  const appType = String(tab.launchedAppType || "")
    .trim()
    .toLowerCase();
  if (!rawUrl || rawUrl === "about:blank" || rawUrl === "newtab") return false;
  if (isAppProtocolUrl(rawUrl)) return false;
  if (!/^https?:\/\//i.test(rawUrl)) return false;
  if (!appType || appType === "website") return true;
  return false;
}

function handleTicketSwitchPreserveView({ activateVisibleTab = true } = {}) {
  if (!viewPageInitialized || tabs.length === 0) return;

  const tabsToClose = tabs
    .filter((tab) => !tab.isHome && !isPreservedWebsiteTab(tab))
    .map((tab) => tab.id);
  if (tabsToClose.length > 0) {
    closeTabsBulk(tabsToClose);
  }

  if (!activateVisibleTab) {
    return;
  }

  const survivingActiveTab = getActiveTab();
  if (survivingActiveTab && isPreservedWebsiteTab(survivingActiveTab)) {
    switchTab(survivingActiveTab.id);
    return;
  }

  const websiteTab = tabs.find((tab) => isPreservedWebsiteTab(tab));
  if (websiteTab) {
    switchTab(websiteTab.id);
    return;
  }

  const homeTab = tabs.find((tab) => tab.isHome);
  if (homeTab) {
    switchTab(homeTab.id);
    return;
  }

  if (tabs.length === 0) {
    createTab();
    return;
  }

  switchTab(tabs[0].id);
}

window.addEventListener("ticket-switch-preserve-view", (event) => {
  handleTicketSwitchPreserveView({
    activateVisibleTab: event?.detail?.activateVisibleTab !== false,
  });
});

async function hydrateInstalledOneviewUrlsInView() {
  if (!window.api || typeof window.api.resolveOneviewAppUrl !== "function") {
    return;
  }
  const installedAppsObj = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.installedApps) || "{}",
  );
  let changed = false;
  for (const [appId, app] of Object.entries(installedAppsObj)) {
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
          installedAppsObj[appId] = { ...app, oneviewUrl: resolved.url };
          changed = true;
        }
      }
    } catch (_err) {}
  }
  if (changed) {
    localStorage.setItem(
      STORAGE_KEYS.installedApps,
      JSON.stringify(installedAppsObj),
    );
  }
}

window.initViewPage = initViewPage;
export { initViewPage };

window.closeViewTab = closeTab;

function closeSettingsMenu() {
  const btn = document.getElementById("settingsBtn");
  if (btn) btn.classList.remove("is-active");
}

function renderSettingsMenu() {
  return;
}

async function toggleSettingsMenu(forceOpen = null) {
  const btn = document.getElementById("settingsBtn");
  if (btn) btn.classList.add("is-active");
  openSettingsTab(
    forceOpen && typeof forceOpen === "string" ? forceOpen : "extensions",
  );
}
function getExtensionPromptElements() {
  return {
    modal: document.getElementById("extensionPromptModal"),
    title: document.getElementById("extensionPromptTitle"),
    message: document.getElementById("extensionPromptMessage"),
    label: document.getElementById("extensionPromptLabel"),
    input: document.getElementById("extensionPromptInput"),
    textarea: document.getElementById("extensionPromptTextarea"),
    form: document.getElementById("extensionPromptForm"),
    submitBtn: document.getElementById("extensionPromptSubmitBtn"),
    cancelBtn: document.getElementById("extensionPromptCancelBtn"),
    closeBtn: document.getElementById("extensionPromptCloseBtn"),
  };
}

async function openExtensionPromptDialog(promptOptions = {}) {
  const elements = getExtensionPromptElements();
  if (
    !elements.modal ||
    !elements.form ||
    !elements.input ||
    !elements.textarea
  ) {
    return { cancelled: true, value: "" };
  }
  if (extensionPromptSession) {
    return { cancelled: true, value: "" };
  }

  const options =
    promptOptions && typeof promptOptions === "object" ? promptOptions : {};
  const multiline = options.multiline === true;
  const required = options.required !== false;
  const defaultValue = String(options.value || "");
  const title =
    String(options.title || "Extension Input").trim() || "Extension Input";
  const message = String(options.message || "").trim();
  const label = String(options.label || "Value").trim() || "Value";
  const submitLabel =
    String(options.submitLabel || "Submit").trim() || "Submit";
  const cancelLabel =
    String(options.cancelLabel || "Cancel").trim() || "Cancel";
  const placeholder = String(options.placeholder || "").trim();

  elements.title.textContent = title;
  elements.message.textContent = message;
  elements.message.classList.toggle("hidden", !message);
  elements.label.textContent = label;
  elements.submitBtn.textContent = submitLabel;
  elements.cancelBtn.textContent = cancelLabel;
  elements.input.classList.toggle("hidden", multiline);
  elements.textarea.classList.toggle("hidden", !multiline);
  elements.input.required = !multiline && required;
  elements.textarea.required = multiline && required;
  elements.input.type = options.password === true ? "password" : "text";
  elements.input.placeholder = placeholder;
  elements.textarea.placeholder = placeholder;
  elements.input.value = multiline ? "" : defaultValue;
  elements.textarea.value = multiline ? defaultValue : "";

  return new Promise((resolve) => {
    extensionPromptSession = {
      resolve,
      required,
      multiline,
    };
    openOverlayModal(() => {
      elements.modal.classList.remove("hidden");
      elements.modal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        (multiline ? elements.textarea : elements.input).focus();
        (multiline ? elements.textarea : elements.input).select?.();
      });
    }).catch(() => {
      extensionPromptSession = null;
      resolve({ cancelled: true, value: "" });
    });
  });
}

function closeExtensionPromptDialog(result = { cancelled: true, value: "" }) {
  const elements = getExtensionPromptElements();
  if (!elements.modal || !extensionPromptSession) return;
  const session = extensionPromptSession;
  extensionPromptSession = null;
  closeOverlayModal(() => {
    elements.modal.classList.add("hidden");
    elements.modal.setAttribute("aria-hidden", "true");
    elements.form.reset();
    elements.input.classList.remove("hidden");
    elements.textarea.classList.add("hidden");
    elements.input.type = "text";
  });
  session.resolve(result);
}

function getProfilePromptElements() {
  return {
    modal: document.getElementById("profilePromptModal"),
    select: document.getElementById("profilePromptSelect"),
    continueBtn: document.getElementById("profilePromptContinueBtn"),
    cancelBtn: document.getElementById("profilePromptCancelBtn"),
    closeBtn: document.getElementById("profilePromptCloseBtn"),
  };
}

let profilePromptSession = null;

async function openProfilePromptDialog(url, defaultProfileId = "guest") {
  const elements = getProfilePromptElements();
  if (!elements.modal || !elements.select) {
    return { cancelled: true, profileId: defaultProfileId };
  }
  if (profilePromptSession) {
    return { cancelled: true, profileId: defaultProfileId };
  }

  let selectedProfileId = defaultProfileId;

  const container = elements.select;
  container.innerHTML = Object.values(PROFILES)
    .map((p) => {
      const initial = String(p.name || "P").charAt(0).toUpperCase();
      return `
        <div class="profile-big-item ${p.id === selectedProfileId ? "active" : ""}" data-id="${p.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${p.color};">
            ${initial}
          </div>
          <span class="profile-big-name">${escapeHtml(p.name)}</span>
        </div>
      `;
    })
    .join("");

  const updateSelection = (id) => {
    selectedProfileId = id;
    container.querySelectorAll(".profile-big-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.id === id);
    });
  };

  container.querySelectorAll(".profile-big-item").forEach((item) => {
    const select = () => {
      const id = item.dataset.id;
      if (!id || !PROFILES[id]) return;
      updateSelection(id);
    };
    item.addEventListener("click", select);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    });
    
    item.addEventListener("dblclick", () => {
      select();
      elements.continueBtn?.click();
    });
  });

  try {
    await openOverlayModal(() => {
      elements.modal.classList.remove("hidden");
      elements.modal.setAttribute("aria-hidden", "false");
    });
  } catch (_error) {
    return { cancelled: true, profileId: defaultProfileId };
  }

  return new Promise((resolve) => {
    profilePromptSession = { resolve };

    const cleanup = () => {
      closeOverlayModal(() => {
        elements.modal.classList.add("hidden");
        elements.modal.setAttribute("aria-hidden", "true");
      });
      elements.continueBtn?.removeEventListener("click", onContinue);
      elements.cancelBtn?.removeEventListener("click", onCancel);
      elements.closeBtn?.removeEventListener("click", onCancel);
      elements.modal.removeEventListener("click", onBackdrop);
      profilePromptSession = null;
    };

    const onContinue = () => {
      cleanup();
      resolve({ cancelled: false, profileId: selectedProfileId });
    };

    const onCancel = () => {
      cleanup();
      resolve({ cancelled: true, profileId: defaultProfileId });
    };

    elements.continueBtn?.addEventListener("click", onContinue);
    elements.cancelBtn?.addEventListener("click", onCancel);
    elements.closeBtn?.addEventListener("click", onCancel);
    const onBackdrop = (event) => {
      if (event.target === elements.modal) {
        onCancel();
      }
    };
    elements.modal.addEventListener("click", onBackdrop);
  });
}

function initExtensionPromptDialog() {
  const elements = getExtensionPromptElements();
  if (!elements.modal || elements.modal.dataset.boundExtensionPrompt === "1")
    return;
  elements.modal.dataset.boundExtensionPrompt = "1";

  elements.form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!extensionPromptSession) return;
    const target = extensionPromptSession.multiline
      ? elements.textarea
      : elements.input;
    const value = String(target?.value || "");
    if (extensionPromptSession.required && !value.trim()) {
      target?.focus();
      return;
    }
    closeExtensionPromptDialog({
      cancelled: false,
      value,
    });
  });

  const cancelHandler = () =>
    closeExtensionPromptDialog({ cancelled: true, value: "" });
  elements.cancelBtn?.addEventListener("click", cancelHandler);
  elements.closeBtn?.addEventListener("click", cancelHandler);
  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      cancelHandler();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      extensionPromptSession &&
      !elements.modal.classList.contains("hidden")
    ) {
      event.preventDefault();
      cancelHandler();
    }
  });
}

function isProfileLockedForActiveTab() {
  return Boolean(getActiveTab()?.lockedProfileId);
}

function updateProfileLockUI(tabOverride = null) {
  const activeTab = tabOverride || getActiveTab();
  const isLocked = Boolean(activeTab?.lockedProfileId);
  const btn = document.getElementById("profileBtn");
  if (!btn) return;

  btn.classList.toggle("locked", isLocked);
  if (isLocked) {
    const profileName = PROFILES[activeTab.lockedProfileId]?.name || "assigned";
    btn.title = `Profile locked to ${profileName} for this tab`;
  } else {
    btn.title = "Switch Profile";
  }
  updateProfileDropdownLockState();
}

function updateProfileDropdownLockState() {
  const locked = isProfileLockedForActiveTab();
  const profileItems = document.querySelectorAll(".profile-item[data-id]");
  profileItems.forEach((item) => {
    item.classList.toggle("disabled", locked);
    item.setAttribute("aria-disabled", locked ? "true" : "false");
  });
}

function getProfileIdByPartition(partition) {
  return getVisibleProfileIdByPartition(partition);
}

function syncProfileSelectionForTab(tab) {
  const targetProfileId = resolveProfileIdForTab(tab);
  if (!targetProfileId || !PROFILES[targetProfileId]) return;
  if (currentProfileId === targetProfileId) return;
  applyProfileSelection(targetProfileId, { bypassLock: true });
}

function renderProfilePillSelect(containerId, selectedId, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = Object.values(PROFILES)
    .map(
      (p) => `
      <div class="profile-pill-item ${p.id === selectedId ? "active" : ""}" data-id="${p.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${p.color};"></span>
        <span>${escapeHtml(p.name)}</span>
      </div>
    `,
    )
    .join("");

  container.querySelectorAll(".profile-pill-item").forEach((item) => {
    const select = () => {
      const id = item.dataset.id;
      if (!id || !PROFILES[id]) return;
      container.querySelectorAll(".profile-pill-item").forEach((el) => {
        el.classList.toggle("active", el.dataset.id === id);
      });
      if (typeof onSelect === "function") onSelect(id);
    };
    item.addEventListener("click", select);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    });
  });
}

function applyProfileSelection(id, { bypassLock = false } = {}) {
  const targetId = String(id || "").trim();
  if (!PROFILES[targetId]) {
    console.warn(`[View] applyProfileSelection: Invalid profile ID "${targetId}"`);
    return;
  }
  
  if (!bypassLock && isProfileLockedForActiveTab()) {
    console.log(`[View] applyProfileSelection BLOCKED: active tab is locked`);
    return;
  }

  console.log(`[View] applyProfileSelection: Switching to ${targetId}`);
  currentProfileId = targetId;
  localStorage.setItem(STORAGE_KEYS.currentProfileId, targetId);
  updateProfileUI();

  const items = document.querySelectorAll(".profile-item");
  items.forEach((item) => {
    if (item.dataset.id === targetId) item.classList.add("active");
    else item.classList.remove("active");
  });
}

function resolveAssignedProfileId(url = "", title = "") {
  const lowerTitle = String(title).toLowerCase();
  const lowerUrl = String(url).toLowerCase();
  let decodedUrl = lowerUrl;
  try {
    decodedUrl = decodeURIComponent(lowerUrl);
  } catch (_err) {
    decodedUrl = lowerUrl;
  }
  const inspectText = `${lowerTitle} ${lowerUrl} ${decodedUrl}`;
  const titleHasAiWord = /\bai\b/.test(lowerTitle);
  const titleHasKnownAiName =
    /\b(imagine|empower|production ai|imagine wpp)\b/.test(lowerTitle);

  const isJira =
    inspectText.includes("jira.") ||
    inspectText.includes("jira/") ||
    inspectText.includes("atlassian.net") ||
    inspectText.includes("jira.uhub.biz") ||
    lowerTitle.includes("jira");
  const isGsk =
    lowerTitle.includes("aem") ||
    lowerTitle.includes("veeva") ||
    lowerTitle.includes("gsk") ||
    lowerUrl.includes("gskinternet.com") ||
    lowerUrl.includes("gsk-contentlab.veevavault.com") ||
    lowerUrl.includes("veevavault.com");
  const isWpp =
    titleHasAiWord ||
    titleHasKnownAiName ||
    lowerUrl.includes("imagine.wpp.ai") ||
    lowerUrl.includes("://wpp.ai") ||
    lowerUrl.includes(".wpp.ai") ||
    inspectText.includes("://wpp.") ||
    inspectText.includes(".wpp.") ||
    inspectText.includes("wpp.com");

  if (isJira) return "vml";
  if (isGsk) return "gsk";
  if (isWpp) return "wppproduction";
  return null;
}

function resolveAssignedProfileIdForTab(tab, url = "", title = "") {
  const existingLockedProfileId = String(tab?.lockedProfileId || "")
    .trim()
    .toLowerCase();
  const assignedProfileId = resolveAssignedProfileId(url, title);

  // Shared auth gateways like WPP Okta should inherit the tab's originating
  // profile instead of reclassifying the tab mid-login.
  if (existingLockedProfileId && isLikelyAuthPage(url, title)) {
    return existingLockedProfileId;
  }

  return assignedProfileId;
}

async function resolveStrictProfileNavigationTarget(url, partition = null, title = "New Tab", options = {}) {
  const explicitPartition = String(partition || "").trim();
  const explicitProfileId = explicitPartition ? getProfileIdByPartition(explicitPartition) : null;
  
  // Check if it's a local file URL
  const isLocalFile = String(url || "").trim().toLowerCase().startsWith("file://");
  if (isLocalFile) {
    return {
      cancelled: false,
      profileId: "guest",
      lockedProfileId: "guest",
      partition: resolveNavigationPartition(url, PROFILES["guest"].partition, title, options),
    };
  }
  
  // 1. Check if this is a dedicated app/link assigned to a specific profile
  const assignedProfileId = resolveAssignedProfileId(url, title);
  if (assignedProfileId && PROFILES[assignedProfileId]) {
    return {
      cancelled: false,
      profileId: assignedProfileId,
      lockedProfileId: assignedProfileId,
      partition: resolveNavigationPartition(url, PROFILES[assignedProfileId].partition, title, options),
    };
  }

  const bookmarkedLinks = findCustomBookmarksByUrl(url);
  const matchingBookmarkedLink =
    (explicitProfileId &&
      bookmarkedLinks.find((item) => item.profileId === explicitProfileId)) ||
    bookmarkedLinks.find((item) => item.profileId === currentProfileId) ||
    bookmarkedLinks[0] ||
    null;
  if (matchingBookmarkedLink && PROFILES[matchingBookmarkedLink.profileId]) {
    return {
      cancelled: false,
      profileId: matchingBookmarkedLink.profileId,
      lockedProfileId: matchingBookmarkedLink.profileId,
      partition: resolveNavigationPartition(
        url,
        PROFILES[matchingBookmarkedLink.profileId].partition,
        title,
        options,
      ),
    };
  }

  // 2. If it's not a dedicated app, we want to prompt the user UNLESS
  // they explicitly requested a profile bypass (internal ops)
  if (!options?.bypassPrompt && typeof openProfilePromptDialog === "function") {
    // If it's from history, we might have an explicitProfileId. 
    // But user wants to be prompted for unknown links regardless of history state.
    const selected = await openProfilePromptDialog(url, explicitProfileId || "guest");
    if (!selected || selected.cancelled) {
      return { cancelled: true, profileId: null, lockedProfileId: null, partition: "" };
    }

    const selectedProfileId = PROFILES[selected.profileId] ? selected.profileId : "guest";
    return {
      cancelled: false,
      profileId: selectedProfileId,
      lockedProfileId: selectedProfileId,
      partition: resolveNavigationPartition(url, PROFILES[selectedProfileId].partition, title, options),
    };
  }

  // 3. Fallback to explicit partition if prompt is unavailable or bypassed
  if (explicitProfileId && PROFILES[explicitProfileId]) {
    return {
      cancelled: false,
      profileId: explicitProfileId,
      lockedProfileId: explicitProfileId,
      partition: resolveNavigationPartition(url, PROFILES[explicitProfileId].partition, title, options),
    };
  }

  if (explicitPartition) {
    return {
      cancelled: false,
      profileId: null,
      lockedProfileId: null,
      partition: resolveNavigationPartition(url, explicitPartition, title, options),
    };
  }

  return {
    cancelled: false,
    profileId: null,
    lockedProfileId: null,
    partition: resolveNavigationPartition(url, PARTITIONS.guest, title, options),
  };
}

async function syncTabProfileForPage(
  tab,
  currentUrl,
  currentTitle,
  webviewRef,
) {
  const assignedProfileId = resolveAssignedProfileIdForTab(
    tab,
    currentUrl,
    currentTitle,
  );
  tab.lockedProfileId = assignedProfileId;

  if (!assignedProfileId) {
    if (activeTabId === tab.id) updateProfileLockUI(tab);
    return;
  }

  const targetPartition = PROFILES[assignedProfileId].partition;
  if (currentProfileId !== assignedProfileId) {
    applyProfileSelection(assignedProfileId, { bypassLock: true });
  }

  if (tab.partition !== targetPartition) {
    tab.partition = targetPartition;
    if (webviewRef && !webviewRef.isDestroyed?.()) {
      webviewRef.remove();
    }
    const recreated = await createWebviewForTab(tab);
    if (activeTabId === tab.id) {
      updateProfileLockUI(tab);
      setTimeout(() => {
        recreated.src = currentUrl;
      }, 10);
    }
    return;
  }

  if (activeTabId === tab.id) updateProfileLockUI(tab);
}

function emptyCredentialCache() {
  return {
    wppproduction: [],
    vml: [],
    gsk: [],
    guest: [],
    synapse: [],
    contentgen: [],
  };
}

function getCredentialProfileIds() {
  return Object.keys(emptyCredentialCache());
}

function emptyProfileHistoryCache() {
  return { wppproduction: [], vml: [], gsk: [], guest: [] };
}

function normalizeProfileHistoryStore(raw = {}) {
  const next = emptyProfileHistoryCache();
  Object.keys(next).forEach((profileId) => {
    const rows = Array.isArray(raw?.[profileId]) ? raw[profileId] : [];
    next[profileId] = rows
      .map((entry) => ({
        url: String(entry?.url || "").trim(),
        title: String(entry?.title || "Untitled").trim() || "Untitled",
        visitedAt: entry?.visitedAt ? Number(entry.visitedAt) : 0,
      }))
      .filter((entry) => entry.url && entry.url !== "about:blank")
      .slice(0, 200);
  });
  return next;
}

function syncProfileHistoryToSharedStorage() {
  if (!window.api || typeof window.api.setOneviewSharedStorage !== "function") {
    return;
  }
  window.api
    .setOneviewSharedStorage(PROFILE_HISTORY_SHARED_KEY, profileHistoryCache)
    .catch((error) => {
      console.warn("Could not sync profile history to shared storage", error);
    });
}

function applyProfileHistorySharedEntry(entry = null) {
  if (!entry || typeof entry !== "object") return;
  profileHistoryCache = normalizeProfileHistoryStore(entry.value || {});
  try {
    localStorage.setItem(
      PROFILE_HISTORY_STORAGE_KEY,
      JSON.stringify(profileHistoryCache),
    );
  } catch (_error) {}

  const historyListVisible = !document
    .getElementById("historyManagerModal")
    ?.classList.contains("hidden");
  if (historyListVisible) {
    renderHistoryManagerList();
  }
}

async function hydrateProfileHistoryFromSharedStorage() {
  if (!window.api || typeof window.api.getOneviewSharedStorage !== "function") {
    return;
  }
  try {
    const result = await window.api.getOneviewSharedStorage(
      PROFILE_HISTORY_SHARED_KEY,
    );
    if (result?.success && result.entry) {
      applyProfileHistorySharedEntry(result.entry);
    } else {
      syncProfileHistoryToSharedStorage();
    }
  } catch (error) {
    console.warn(
      "Could not hydrate profile history from shared storage",
      error,
    );
  }
}

function loadProfileHistoryStore() {
  try {
    const raw = JSON.parse(
      localStorage.getItem(PROFILE_HISTORY_STORAGE_KEY) || "{}",
    );
    profileHistoryCache = normalizeProfileHistoryStore(raw);
  } catch (_e) {
    profileHistoryCache = emptyProfileHistoryCache();
  }
}

function saveProfileHistoryStore() {
  localStorage.setItem(
    PROFILE_HISTORY_STORAGE_KEY,
    JSON.stringify(profileHistoryCache),
  );
  syncProfileHistoryToSharedStorage();
}

function resolveProfileIdForTab(tab) {
  if (!tab) return currentProfileId;
  return (
    tab.lockedProfileId ||
    getVisibleProfileIdByPartition(tab.partition) ||
    currentProfileId
  );
}

function resolveCredentialScopeIdForTab(tab) {
  if (!tab) return currentProfileId;
  return (
    getCredentialScopeIdByPartition(tab.partition) ||
    tab.lockedProfileId ||
    currentProfileId
  );
}

function trackProfileHistory(profileId, url, title) {
  if (!profileHistoryCache[profileId]) return;
  const cleanUrl = String(url || "").trim();
  if (
    !cleanUrl ||
    cleanUrl === "about:blank" ||
    cleanUrl.startsWith("devtools://")
  ) {
    return;
  }

  const cleanTitle = String(title || "Untitled").trim() || "Untitled";
  const list = profileHistoryCache[profileId] || [];
  const existingIndex = list.findIndex((item) => item.url === cleanUrl);
  const entry = {
    url: cleanUrl,
    title: cleanTitle,
    visitedAt: Date.now(),
  };

  if (existingIndex === 0) {
    list[0] = entry;
  } else if (existingIndex > 0) {
    list.splice(existingIndex, 1);
    list.unshift(entry);
  } else {
    list.unshift(entry);
  }

  profileHistoryCache[profileId] = list.slice(0, 200);
  saveProfileHistoryStore();
}

function formatHistoryTime(timestamp) {
  if (!timestamp) return "Unknown Date";
  try {
    return new Date(timestamp).toLocaleString();
  } catch (_e) {
    return "";
  }
}

function getWebviewPreloadPathCached() {
  if (cachedWebviewPreloadPath !== null) return cachedWebviewPreloadPath;
  try {
    cachedWebviewPreloadPath =
      window.api && typeof window.api.getWebviewPreloadPath === "function"
        ? window.api.getWebviewPreloadPath()
        : "";
  } catch (_err) {
    cachedWebviewPreloadPath = "";
  }
  return cachedWebviewPreloadPath;
}

function shouldRequirePlatformApiForNavigation(url, options = {}) {
  const appType = String(options?.appType || "")
    .trim()
    .toLowerCase();
  const targetUrl = String(url || "")
    .trim()
    .toLowerCase();

  if (typeof options?.requiresPlatformApi === "boolean") {
    return options.requiresPlatformApi;
  }

  if (appType && appType !== "website") {
    return true;
  }

  return appType === "website" && isAppProtocolUrl(targetUrl);
}

function getWebviewPlatformApiFlag(webview) {
  return webview?.getAttribute("data-platform-api-enabled") === "1";
}

function setWebviewPlatformApiFlag(webview, enabled) {
  if (!webview || typeof webview.setAttribute !== "function") return;
  webview.setAttribute("data-platform-api-enabled", enabled ? "1" : "0");
}

function isIgnorablePopupUrl(rawUrl = "") {
  const url = String(rawUrl || "")
    .trim()
    .toLowerCase();
  if (!url) return true;
  if (url === "about:blank") return true;
  if (url.startsWith("javascript:")) return true;
  if (url.startsWith("data:")) return true;
  if (url.startsWith("chrome-error://")) return true;
  return false;
}

function getAppInitials(name = "") {
  const cleaned = String(name).trim();
  if (!cleaned) return "APP";

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

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

  const text = String(name);
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash + text.charCodeAt(i) * (i + 1)) % gradients.length;
  }
  return gradients[hash];
}

function showViewLaunchLoader(appTitle = "app") {
  let loaderEl = document.getElementById("view-launch-loader");
  if (!loaderEl) {
    loaderEl = document.createElement("div");
    loaderEl.id = "view-launch-loader";
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
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:spin-view-launch 1s linear infinite">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b"></p>
        <style>@keyframes spin-view-launch{to{transform:rotate(360deg)}}</style>
      </div>
    `;
    document.body.appendChild(loaderEl);
  } else {
    loaderEl.style.display = "flex";
  }

  const loaderText = loaderEl.querySelector("p");
  if (loaderText) {
    loaderText.textContent = `Opening ${appTitle || "app"}...`;
  }

  return () => {
    if (loaderEl) {
      loaderEl.style.display = "none";
    }
  };
}

async function launchInstalledAppFromView(appId) {
  if (!appId) return;

  const installedAppsObj = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.installedApps) || "{}",
  );
  const app = installedAppsObj[appId];

  if (!app) {
    console.warn("Installed app not found:", appId);
    return;
  }

  const appTitle = app.name || "App";
  const hideLoader = showViewLaunchLoader(appTitle);
  const shouldTrackLaunch = shouldTrackAppLaunchClick(app);
  console.log("[OneView Tracking] View launch decision", {
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
      clickedAppName: appTitle,
    });
  }

  try {
    if (isStandaloneExternalExeApp(app)) {
      await launchStandaloneExternalExe(app);
      showToast(`Opened "${appTitle}" in a separate window.`, "info");
      return;
    }

    const getLaunchPartition = () => {
      const activeTab = getActiveTab();
      return (
        activeTab?.partition ||
        PROFILES[currentProfileId]?.partition ||
        PARTITIONS.guest
      );
    };

    const openFreshLaunchTab = async (targetUrl, extraOptions = {}) => {
      await createTab(targetUrl, getLaunchPartition(), appTitle, null, {
        hideControls: true,
        appType: app.type,
        trackingAppId: appId,
        trackingAppName: appTitle,
        bypassPrompt: true,
        ...extraOptions,
      });
    };

    const appType = String(app.type || "").toLowerCase();
    if (LOCAL_WEB_APP_TYPES.has(appType) && app.localPath) {
      updateUrlDisplayString(`Starting ${appTitle}...`);
      let targetUrl = String(app.oneviewUrl || "").trim();
      if (window.api && typeof window.api.resolveOneviewAppUrl === "function") {
        const resolved = await window.api.resolveOneviewAppUrl(
          appId,
          app.localPath,
          "/",
          getLaunchPartition(),
        );
        if (resolved?.success && resolved.url) {
          targetUrl = resolved.url;
          const installedAppsLatest = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.installedApps) || "{}",
          );
          if (installedAppsLatest[appId]) {
            installedAppsLatest[appId] = {
              ...installedAppsLatest[appId],
              oneviewUrl: targetUrl,
            };
            localStorage.setItem(
              STORAGE_KEYS.installedApps,
              JSON.stringify(installedAppsLatest),
            );
          }
        }
      }

      const needsRunner = ["nextjs", "next", "vite-server"].includes(appType);

      // If it's a framework app, we must use the runner even if a static URL was cached or resolved
      if (targetUrl && isAppProtocolUrl(targetUrl) && needsRunner) {
        targetUrl = "";
      }

      if (targetUrl && isAppProtocolUrl(targetUrl)) {
        await openFreshLaunchTab(targetUrl);
      } else {
        const url = await window.api.launchNextApp(app.localPath, app.type);
        await openFreshLaunchTab(url);
      }
      return;
    }

    if (app.type === "website" && app.url) {
      await openFreshLaunchTab(app.url);
      return;
    }

    if (app.type === "exe" && app.localPath) {
      updateUrlDisplayString(`Launching ${appTitle}...`);
      const result = await window.api.launchExe(app.localPath, app.tech);

      if (result && result.mode === "embedded" && result.url) {
        const urlParams = new URLSearchParams();
        if (result.token) urlParams.set("NL_TOKEN", result.token);
        if (app.tech) urlParams.set("TECH", app.tech);
        const portPart = String(result.url).split(":")[2];
        if (portPart) urlParams.set("NL_PORT", portPart);
        const embeddedUrl = `${result.url}?${urlParams.toString()}`;
        await openFreshLaunchTab(embeddedUrl);
      } else if (result?.success && result.mode === "external") {
        showToast(`Opened "${appTitle}" in a separate window.`, "info");
      } else {
        alert(
          `${appTitle} launched externally. Embedded view is not available for this app.`,
        );
      }
      return;
    }

    alert(
      `Cannot launch "${appTitle}". Missing supported launch configuration.`,
    );
  } catch (err) {
    if (isStandaloneExternalExeApp(app)) {
      console.error("Failed to launch external Electron app from view:", err);
      showToast(`Failed to launch "${appTitle}".`, "error");
      return;
    }
    console.error("Failed to launch installed app from view:", err);
    alert(`Failed to launch "${appTitle}": ${err.message || err}`);
  } finally {
    hideLoader();
  }
}

async function openUrlFromDashboard(
  url,
  partition = null,
  title = "New Tab",
  forceNewTab = false,
  options = {},
) {
  const targetUrl = String(url || "").trim();
  if (!targetUrl) return;

  // SiteSnap Studio: always use GSK profile — skip the profile dialog entirely.
  if (window.isSiteSnapStudioMode || window.parent?.isSiteSnapStudioMode) {
    const siteSnapPartition = PARTITIONS.gsk;
    window.enterSiteSnapStudioMode();
    const currentTabs = getTabs();
    const hasLoadedTabs = (currentTabs || []).some((t) => {
      const u = String(t.url || "").trim();
      return u && u !== "about:blank" && u !== "newtab";
    });
    if (!currentTabs || currentTabs.length === 0 || forceNewTab || hasLoadedTabs) {
      await createTab(targetUrl, siteSnapPartition, title, null, options);
    } else {
      await navigateTo(targetUrl, siteSnapPartition, title, null, options);
    }
    return;
  }

  // Force new tab for local file URLs to avoid rendering blank screens on active tab reuse
  let forceNew = forceNewTab;
  const isLocalFile = targetUrl.toLowerCase().startsWith("file://");
  if (isLocalFile) {
    forceNew = true;
  }

  // Use the strict resolution logic which triggers the profile selector modal if needed
  const targetNavigation = await resolveStrictProfileNavigationTarget(
    targetUrl,
    partition,
    title,
    options,
  );

  if (!targetNavigation || targetNavigation.cancelled) {
    return;
  }

  const resolvedPartition = targetNavigation.partition;
  const resolvedProfileId = targetNavigation.profileId;
  const resolvedLockedProfileId = targetNavigation.lockedProfileId;

  // Switch global profile if needed (for non-locked tabs)
  if (resolvedProfileId && resolvedProfileId !== getCurrentProfileId()) {
    applyProfileSelection(resolvedProfileId, { bypassLock: true });
  }

  const currentTabs = getTabs();
  if (!currentTabs || currentTabs.length === 0) {
    await createTab(
      targetUrl,
      resolvedPartition,
      title,
      resolvedLockedProfileId,
      options,
    );
    return;
  }

  // If explicitly forced (app launch), OR if any tab already has content loaded
  // (website, knowledge hub, etc.) → always open in a fresh tab.
  const hasLoadedTabs = currentTabs.some((t) => {
    const u = String(t.url || "").trim();
    return u && u !== "about:blank" && u !== "newtab";
  });

  if (forceNew || hasLoadedTabs) {
    await createTab(
      targetUrl,
      resolvedPartition,
      title,
      resolvedLockedProfileId,
      options,
    );
    return;
  }

  // All tabs are blank/home — reuse the active tab.
  let activeTab = getActiveTab();
  if (!activeTab) {
    const fallbackTab = currentTabs[currentTabs.length - 1];
    if (fallbackTab) {
      await switchTab(fallbackTab.id);
      activeTab = fallbackTab;
    }
  }

  if (!activeTab) {
    await createTab(
      targetUrl,
      resolvedPartition,
      title,
      resolvedLockedProfileId,
      options,
    );
    return;
  }

  await navigateTo(
    targetUrl,
    resolvedPartition,
    title,
    resolvedLockedProfileId,
    options,
  );
}

// Expose init function
window.initViewPage = initViewPage;
window.createTab = createTab;
window.launchInstalledAppFromView = launchInstalledAppFromView;
window.openUrlFromDashboard = openUrlFromDashboard;

/**
 * Profile Management
 */
function initProfiles() {
  const savedProfile = localStorage.getItem(STORAGE_KEYS.currentProfileId);
  if (savedProfile && PROFILES[savedProfile]) {
    currentProfileId = savedProfile;
  } else {
    currentProfileId = "guest";
  }
  updateProfileUI();

  // Setup Profile Switcher UI
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  if (profileBtn && profileDropdown) {
    // Toggle Dropdown
    profileBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const isHidden = profileDropdown.classList.contains("hidden");

      if (isHidden) {
        await openOverlayModal(() =>
          profileDropdown.classList.remove("hidden"),
        );
      } else {
        closeOverlayModal(() => profileDropdown.classList.add("hidden"));
      }
    });
    // Render Dropdown Items
    profileDropdown.innerHTML = Object.values(PROFILES)
      .map(
        (p) => `
        <div class="profile-item ${p.id === currentProfileId ? "active" : ""}" data-id="${p.id}">
            <div class="profile-item-dot" style="background-color: ${p.color}"></div>
            <span>${p.name}</span>
        </div>
    `,
      )
      .join("")
      .concat(
        `
        <div class="profile-divider"></div>
        <div class="profile-item" data-action="manage-passwords">
          <div class="profile-item-dot" style="background-color: #6366f1"></div>
          <span>Manage Passwords</span>
        </div>
      `,
      );

    // Add Click Listeners to Items
    profileDropdown.querySelectorAll(".profile-item").forEach((item) => {
      item.addEventListener("click", async () => {
        if (item.dataset.action === "manage-passwords") {
          openSettingsTab("passwords");
          closeOverlayModal(() => profileDropdown.classList.add("hidden"));
          return;
        }
        const id = item.dataset.id;
        if (item.classList.contains("disabled")) return;
        switchProfile(id);
        closeOverlayModal(() => profileDropdown.classList.add("hidden"));
      });
    });
    updateProfileDropdownLockState();
  }
}

function switchProfile(id) {
  applyProfileSelection(id);
}

function updateProfileUI() {
  const profile = PROFILES[currentProfileId];
  const btn = document.getElementById("profileBtn");
  const label = document.getElementById("profileLabel");

  if (btn && label) {
    label.textContent = profile.label;
    label.style.color = profile.color;
    // btn.style.borderColor = profile.color; // Optional styling
  }
  updateProfileLockUI();
}

function setupBookmarks() {
  const grid = document.querySelector(".bookmarks-grid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".bookmark-edit-btn");
    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = editBtn.closest(".bookmark-card.custom-bookmark");
      const bookmarkId = card?.dataset.bookmarkId;
      if (bookmarkId) openBookmarkEditor(bookmarkId);
      return;
    }

    const deleteBtn = e.target.closest(".bookmark-delete-btn");
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = deleteBtn.closest(".bookmark-card.custom-bookmark");
      const bookmarkId = card?.dataset.bookmarkId;
      if (bookmarkId) {
        customBookmarks = customBookmarks.filter(
          (item) => item.id !== bookmarkId,
        );
        saveCustomBookmarks();
        renderCustomBookmarks();
      }
      return;
    }

    const card = e.target.closest(".bookmark-card");
    if (!card) return;
    if (
      card.id === "addBookmarkBtn" ||
      card.classList.contains("add-bookmark-card")
    ) {
      return;
    }

    const url = card.dataset.url;
    const title = card.dataset.title || "New Tab";
    const explicitPartition = String(card.dataset.partition || "").trim();
    const explicitSessionScope = String(card.dataset.sessionScope || "").trim();
    const profileIdFromCard =
      card.dataset.profileId || getProfileIdByPartition(card.dataset.partition);
    const targetProfileId =
      profileIdFromCard ||
      resolveAssignedProfileId(url || "", title) ||
      currentProfileId;

    if (targetProfileId !== currentProfileId) {
      switchProfile(targetProfileId);
    }

    if (url) {
      const targetPartition = resolveNavigationPartition(
        url,
        explicitPartition || PROFILES[targetProfileId].partition,
        title,
        explicitSessionScope ? { sessionScope: explicitSessionScope } : {},
      );
      navigateTo(
        url,
        targetPartition,
        title,
        resolveAssignedProfileId(url || "", title),
      );
    }
  });
}

function normalizeUrlInput(raw = "") {
  const value = String(raw).trim();
  if (!value) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value) || /^about:/i.test(value)) {
    return value;
  }
  return `https://${value}`;
}

function canonicalizeBookmarkUrl(raw = "") {
  const normalized = normalizeUrlInput(raw);
  if (!normalized) return "";
  try {
    const parsed = new URL(normalized);
    const pathname =
      parsed.pathname.length > 1
        ? parsed.pathname.replace(/\/+$/, "") || "/"
        : parsed.pathname || "/";
    return `${parsed.origin}${pathname}${parsed.search}${parsed.hash}`;
  } catch (_error) {
    return normalized.replace(/\/+$/, "");
  }
}

function findCustomBookmarksByUrl(rawUrl = "") {
  const targetUrl = canonicalizeBookmarkUrl(rawUrl);
  if (!targetUrl) return [];
  return customBookmarks.filter(
    (item) => canonicalizeBookmarkUrl(item.url) === targetUrl,
  );
}

function findCustomBookmarkByUrl(rawUrl = "", profileId = "") {
  const matches = findCustomBookmarksByUrl(rawUrl);
  if (!profileId) return matches[0] || null;
  return (
    matches.find(
      (item) => String(item.profileId || "").trim().toLowerCase() === profileId,
    ) || null
  );
}

function getBookmarkProfileIdForTab(tab = null) {
  if (!tab) return currentProfileId || "guest";
  return (
    String(tab.lockedProfileId || "").trim().toLowerCase() ||
    getProfileIdByPartition(tab.partition) ||
    currentProfileId ||
    "guest"
  );
}

function loadCustomBookmarks() {
  try {
    const raw = JSON.parse(
      localStorage.getItem(CUSTOM_BOOKMARKS_STORAGE_KEY) || "[]",
    );
    customBookmarks = Array.isArray(raw)
      ? raw
          .map((item) => ({
            id: String(item?.id || ""),
            title: String(item?.title || "").trim(),
            url: normalizeUrlInput(item?.url || ""),
            profileId: PROFILES[item?.profileId] ? item.profileId : "guest",
          }))
          .filter((item) => item.id && item.title && item.url)
      : [];
  } catch (_e) {
    customBookmarks = [];
  }
}

function saveCustomBookmarks() {
  localStorage.setItem(
    CUSTOM_BOOKMARKS_STORAGE_KEY,
    JSON.stringify(customBookmarks),
  );
}

function upsertCustomBookmark({ id = "", title = "", url = "", profileId = "guest" }) {
  const normalizedUrl = normalizeUrlInput(url);
  const normalizedTitle = String(title || "").trim() || normalizedUrl;
  const normalizedProfileId = PROFILES[profileId] ? profileId : "guest";
  const canonicalUrl = canonicalizeBookmarkUrl(normalizedUrl);
  if (!normalizedUrl || !canonicalUrl) return false;

  const existingIndex = customBookmarks.findIndex((item) => {
    if (id && item.id === id) return true;
    return (
      canonicalizeBookmarkUrl(item.url) === canonicalUrl &&
      String(item.profileId || "guest") === normalizedProfileId
    );
  });

  const nextBookmark = {
    id:
      existingIndex >= 0
        ? customBookmarks[existingIndex].id
        : id || `bm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: normalizedTitle,
    url: normalizedUrl,
    profileId: normalizedProfileId,
  };

  if (existingIndex >= 0) {
    customBookmarks[existingIndex] = {
      ...customBookmarks[existingIndex],
      ...nextBookmark,
    };
  } else {
    customBookmarks.unshift(nextBookmark);
  }

  return existingIndex >= 0 ? "updated" : "created";
}

function renderCustomBookmarks() {
  const grid = document.querySelector(".bookmarks-grid");
  if (!grid) return;

  grid
    .querySelectorAll(".bookmark-card.custom-bookmark")
    .forEach((el) => el.remove());
  const cardsHtml = customBookmarks
    .map((bookmark) => {
      const profile = PROFILES[bookmark.profileId] || PROFILES.guest;
      return `
        <div
          class="bookmark-card custom-bookmark"
          data-bookmark-id="${escapeHtml(bookmark.id)}"
          data-url="${escapeHtml(bookmark.url)}"
          data-title="${escapeHtml(bookmark.title)}"
          data-profile-id="${escapeHtml(bookmark.profileId)}"
        >
          <button class="bookmark-edit-btn" type="button" title="Edit Bookmark">E</button>
          <button class="bookmark-delete-btn" type="button" title="Remove Bookmark">X</button>
          <div class="bookmark-icon" style="background:${getAppGradient(bookmark.title)};">
            <span>${escapeHtml(getAppInitials(bookmark.title))}</span>
          </div>
          <div class="bookmark-info">
            <h3>${escapeHtml(bookmark.title)}</h3>
            <p>${escapeHtml(profile.name)} Profile</p>
          </div>
        </div>
      `;
    })
    .join("");

  const addCard = document.getElementById("addBookmarkBtn");
  if (addCard) {
    addCard.insertAdjacentHTML("beforebegin", cardsHtml);
  } else {
    grid.insertAdjacentHTML("beforeend", cardsHtml);
  }
}

function initBookmarkManager() {
  const openBtn = document.getElementById("addBookmarkBtn");
  const currentPageHeaderBtn = document.getElementById(
    "bookmarkCurrentPageHeaderBtn",
  );
  const modal = document.getElementById("bookmarkModal");
  const closeBtn = document.getElementById("bookmarkModalCloseBtn");
  const form = document.getElementById("bookmarkForm");
  const titleInput = document.getElementById("bookmarkTitleInput");
  const urlInput = document.getElementById("bookmarkUrlInput");
  const modalTitle = modal?.querySelector(".password-modal-header h3");
  const saveBtn = document.getElementById("bookmarkSaveBtn");
  if (!openBtn || !modal || !closeBtn || !form || !titleInput || !urlInput)
    return;

  const closeBookmarkModal = () => {
    closeOverlayModal(() => {
      modal.classList.add("hidden");
      bookmarkEditId = null;
    });
  };

  const openBookmarkModal = async ({
    editId = null,
    title = "",
    url = "",
    profileId = currentProfileId,
    heading = "Add Bookmark",
    saveLabel = "Save Bookmark",
  } = {}) => {
    bookmarkEditId = editId;
    bookmarkProfileId = PROFILES[profileId] ? profileId : currentProfileId;
    renderProfilePillSelect(
      "bookmarkProfileSelect",
      bookmarkProfileId,
      (id) => {
        bookmarkProfileId = id;
      },
    );
    if (modalTitle) modalTitle.textContent = heading;
    if (saveBtn) saveBtn.textContent = saveLabel;
    form.reset();
    titleInput.value = String(title || "");
    urlInput.value = String(url || "");
    await openOverlayModal(() => modal.classList.remove("hidden"));
    if (titleInput.value) {
      titleInput.focus();
      titleInput.select();
    } else {
      titleInput.focus();
    }
  };

  const openAddBookmarkModal = async () => {
    await openBookmarkModal();
  };

  const openCurrentTabBookmarkModal = async () => {
    const activeTab = getActiveTab();
    const activeUrl = normalizeUrlInput(activeTab?.url || "");
    if (!activeTab || activeTab.isHome || !activeUrl || activeUrl === "about:blank") {
      showToast("Open a website tab first to save it as a bookmark.", "error");
      return;
    }

    const profileId = getBookmarkProfileIdForTab(activeTab);
    const existing = findCustomBookmarkByUrl(activeUrl, profileId);
    await openBookmarkModal({
      editId: existing?.id || null,
      title: activeTab.title || existing?.title || "New Bookmark",
      url: activeUrl,
      profileId,
      heading: existing ? "Update Bookmark" : "Save Current Site",
      saveLabel: existing ? "Update Bookmark" : "Save Bookmark",
    });
  };

  openBtn.addEventListener("click", openAddBookmarkModal);
  openBtn.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      await openAddBookmarkModal();
    }
  });
  currentPageHeaderBtn?.addEventListener("click", openCurrentTabBookmarkModal);
  currentPageHeaderBtn?.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      await openCurrentTabBookmarkModal();
    }
  });

  closeBtn.addEventListener("click", closeBookmarkModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeBookmarkModal();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = String(titleInput.value || "").trim();
    const url = normalizeUrlInput(urlInput.value);
    if (!title || !url) return;
    const result = upsertCustomBookmark({
      id: bookmarkEditId,
      title,
      url,
      profileId: bookmarkProfileId || currentProfileId,
    });
    if (!result) return;

    saveCustomBookmarks();
    renderCustomBookmarks();
    closeBookmarkModal();
    form.reset();
    showToast(
      result === "updated"
        ? "Bookmark updated successfully."
        : "Bookmark saved successfully.",
      "success",
    );
  });
}

async function openBookmarkEditor(bookmarkId) {
  const modal = document.getElementById("bookmarkModal");
  const form = document.getElementById("bookmarkForm");
  const titleInput = document.getElementById("bookmarkTitleInput");
  const urlInput = document.getElementById("bookmarkUrlInput");
  const modalTitle = modal?.querySelector(".password-modal-header h3");
  const saveBtn = document.getElementById("bookmarkSaveBtn");
  if (!modal || !form || !titleInput || !urlInput) return;

  const target = customBookmarks.find((item) => item.id === bookmarkId);
  if (!target) return;

  bookmarkEditId = target.id;
  bookmarkProfileId = target.profileId || currentProfileId;
  if (modalTitle) modalTitle.textContent = "Edit Bookmark";
  if (saveBtn) saveBtn.textContent = "Update Bookmark";
  renderProfilePillSelect("bookmarkProfileSelect", bookmarkProfileId, (id) => {
    bookmarkProfileId = id;
  });

  titleInput.value = target.title || "";
  urlInput.value = target.url || "";
  await openOverlayModal(() => modal.classList.remove("hidden"));
  titleInput.focus();
}

function setupTabScrollControls() {
  const tabsList = document.getElementById("tabsList");
  const leftBtn = document.getElementById("tabsScrollLeft");
  const rightBtn = document.getElementById("tabsScrollRight");
  if (!tabsList || !leftBtn || !rightBtn) return;

  const scrollAmount = 220;
  leftBtn.addEventListener("click", () => {
    tabsList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    tabsList.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  tabsList.addEventListener("scroll", refreshTabScrollControls);
  refreshTabScrollControls();
}

// *** MOVED TO SETTINGS TAB ***
// History manager functionality is now accessed via settings page (History tab)
// function initHistoryManager() {
//   const modal = document.getElementById("historyManagerModal");
//   const closeBtn = document.getElementById("historyModalCloseBtn");
//   const profileSelect = document.getElementById("historyProfileSelect");
//   const clearBtn = document.getElementById("historyClearBtn");
//   if (!modal || !closeBtn || !profileSelect || !clearBtn) return;
//
//   historyProfileId = currentProfileId;
//   renderProfilePillSelect("historyProfileSelect", historyProfileId, (id) => {
//     historyProfileId = id;
//     renderHistoryManagerList();
//   });
//
//   closeBtn.addEventListener("click", closeHistoryManagerModal);
//   modal.addEventListener("click", (e) => {
//     if (e.target === modal) closeHistoryManagerModal();
//   });
//
//   clearBtn.addEventListener("click", () => {
//     const profileId = historyProfileId;
//     if (!profileId || !profileHistoryCache[profileId]) return;
//     profileHistoryCache[profileId] = [];
//     saveProfileHistoryStore();
//     renderHistoryManagerList();
//   });
// }

// *** MOVED TO SETTINGS TAB ***
// History manager functionality is now accessed via settings page (History tab)
// async function openHistoryManagerModal() {
//   const modal = document.getElementById("historyManagerModal");
//   const profileSelect = document.getElementById("historyProfileSelect");
//   if (!modal || !profileSelect) return;
//   loadProfileHistoryStore();
//   await openOverlayModal(() => modal.classList.remove("hidden"));
//   historyProfileId = currentProfileId;
//   renderProfilePillSelect("historyProfileSelect", historyProfileId, (id) => {
//     historyProfileId = id;
//     renderHistoryManagerList();
//   });
//   renderHistoryManagerList();
// }

// function closeHistoryManagerModal() {
//   const modal = document.getElementById("historyManagerModal");
//   if (modal) {
//     closeOverlayModal(() => modal.classList.add("hidden"));
//   }
// }

function renderHistoryManagerList() {
  const listEl = document.getElementById("historyList");
  const profileSelect = document.getElementById("historyProfileSelect");
  if (!listEl || !profileSelect) return;

  const profileId = historyProfileId || currentProfileId;
  const rows = profileHistoryCache[profileId] || [];
  if (rows.length === 0) {
    listEl.innerHTML =
      "<div class='password-meta'>No history for this profile yet.</div>";
    return;
  }

  // Helper to check dates
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterdayStart = todayStart - 86400000;

  // Group items with their original index
  const groups = {
    today: [],
    yesterday: [],
    older: [],
  };

  rows.forEach((row, index) => {
    const item = { ...row, originalIndex: index };
    const ts = row.visitedAt || 0;
    if (ts >= todayStart) {
      groups.today.push(item);
    } else if (ts >= yesterdayStart) {
      groups.yesterday.push(item);
    } else {
      groups.older.push(item);
    }
  });

  const formatDateShort = (d) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const todayLabel = `Today - ${formatDateShort(now)}`;
  const yesterdayLabel = `Yesterday - ${formatDateShort(new Date(yesterdayStart))}`;

  const renderGroup = (title, items, isOpen = false) => {
    if (items.length === 0) return "";
    const rowsHtml = items
      .map(
        (row) => `
      <div class="history-item" data-index="${row.originalIndex}">
        <div class="history-main">
          <div class="history-title">${escapeHtml(row.title || "Untitled")}</div>
          <div class="history-url">${escapeHtml(row.url || "")}</div>
          <div class="password-meta">${escapeHtml(formatHistoryTime(row.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `,
      )
      .join("");

    return `
      <details class="history-group" ${isOpen ? "open" : ""}>
        <summary class="history-group-title">
          <span>${title}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${items.length}</span>
        </summary>
        <div class="history-group-content">
          ${rowsHtml}
        </div>
      </details>
    `;
  };

  listEl.innerHTML = `
    ${renderGroup(todayLabel, groups.today, groups.today.length > 0)}
    ${renderGroup(yesterdayLabel, groups.yesterday, false)}
    ${renderGroup("Older", groups.older, false)}
  `;

  listEl.querySelectorAll(".history-item").forEach((rowEl) => {
    rowEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const index = Number(rowEl.dataset.index);
      if (Number.isNaN(index)) return;
      const list = profileHistoryCache[profileId] || [];
      const entry = list[index];
      if (!entry) return;

      if (btn.dataset.action === "delete") {
        list.splice(index, 1);
        profileHistoryCache[profileId] = list;
        saveProfileHistoryStore();
        renderHistoryManagerList();
        return;
      }

      if (btn.dataset.action === "open") {
        const targetPartition =
          PROFILES[profileId]?.partition || PARTITIONS.guest;
        createTab(
          entry.url,
          targetPartition,
          entry.title || "History",
          profileId,
        );
        // Modal removed - history now accessed via settings tab
      }
    });
  });
}

async function showCacheActionDialog({
  title = "Clear Page Cache",
  message = "",
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  hideCancel = false,
} = {}) {
  const modal = document.getElementById("cacheActionModal");
  const titleEl = document.getElementById("cacheActionTitle");
  const messageEl = document.getElementById("cacheActionMessage");
  const closeBtn = document.getElementById("cacheActionCloseBtn");
  const cancelBtn = document.getElementById("cacheActionCancelBtn");
  const confirmBtn = document.getElementById("cacheActionConfirmBtn");

  if (
    !modal ||
    !titleEl ||
    !messageEl ||
    !closeBtn ||
    !cancelBtn ||
    !confirmBtn
  ) {
    return Promise.resolve(window.confirm(message || title));
  }

  titleEl.textContent = title;
  messageEl.textContent = message;
  confirmBtn.textContent = confirmLabel;
  cancelBtn.textContent = cancelLabel;
  cancelBtn.style.display = hideCancel ? "none" : "inline-flex";
  await openOverlayModal(() => modal.classList.remove("hidden"));

  return new Promise((resolve) => {
    const cleanup = () => {
      closeBtn.removeEventListener("click", onCancel);
      cancelBtn.removeEventListener("click", onCancel);
      confirmBtn.removeEventListener("click", onConfirm);
      modal.removeEventListener("click", onBackdrop);
      closeOverlayModal(() => modal.classList.add("hidden"));
    };

    const onCancel = () => {
      cleanup();
      resolve(false);
    };
    const onConfirm = () => {
      cleanup();
      resolve(true);
    };
    const onBackdrop = (e) => {
      if (e.target === modal) onCancel();
    };

    closeBtn.addEventListener("click", onCancel);
    cancelBtn.addEventListener("click", onCancel);
    confirmBtn.addEventListener("click", onConfirm);
    modal.addEventListener("click", onBackdrop);
  });
}

function refreshTabScrollControls() {
  const tabsList = document.getElementById("tabsList");
  const leftBtn = document.getElementById("tabsScrollLeft");
  const rightBtn = document.getElementById("tabsScrollRight");
  if (!tabsList || !leftBtn || !rightBtn) return;

  const hasOverflow = tabsList.scrollWidth > tabsList.clientWidth + 1;
  if (!hasOverflow) {
    leftBtn.classList.add("hidden");
    rightBtn.classList.add("hidden");
    tabsList.scrollLeft = 0;
    return;
  }

  const atStart = tabsList.scrollLeft <= 1;
  const atEnd =
    tabsList.scrollLeft + tabsList.clientWidth >= tabsList.scrollWidth - 1;

  leftBtn.classList.toggle("hidden", atStart);
  rightBtn.classList.toggle("hidden", atEnd);
}

function getWebviewId(wv) {
  if (!wv) return null;
  if (typeof wv.getWebContentsId === "function") {
    try {
      const id = wv.getWebContentsId();
      if (id) return id;
    } catch(e) {}
  }
  if (wv._webContent) {
    return wv._webContent.key || wv._webContent.id || null;
  }
  return wv.key || wv.id || wv.getAttribute("key") || wv.getAttribute("id") || null;
}

async function runTabContextAction(action, anchorId) {
  const anchorIndex = tabs.findIndex((t) => t.id === anchorId);
  const anchorTab = tabs[anchorIndex];

  if (action === "duplicate-tab" && anchorTab) {
    duplicateTab(anchorId);
    return;
  }

  if (action === "inspect-local-file" && anchorTab) {
    const wv = document.getElementById(`webview-${anchorTab.id}`);
    const webContentsId = getWebviewId(wv);
    if (!webContentsId || !window.api?.toggleWebviewDevTools) {
      showToast(
        IS_DEV_APP_BUILD
          ? "Inspect is not available for this tab."
          : "Inspect is not available for this local file tab.",
        "error",
      );
      return;
    }
    const opened = await window.api.toggleWebviewDevTools(webContentsId);
    if (!opened) {
      showToast(
        IS_DEV_APP_BUILD
          ? "Could not open developer tools."
          : "Could not open developer tools for this local file.",
        "error",
      );
    }
    return;
  }

  if (action === "clear-cache" && anchorTab) {
    const wv = document.getElementById(`webview-${anchorTab.id}`);
    const currentUrl =
      (wv && typeof wv.getURL === "function" && wv.getURL()) ||
      anchorTab.url ||
      "";
    const partition =
      (wv && wv.getAttribute("partition")) ||
      anchorTab.partition ||
      PARTITIONS.guest;
    if (!currentUrl || currentUrl === "about:blank") return;

    const confirmed = await showCacheActionDialog({
      title: "Clear Page Cache",
      message: `Clear cache and site data for ${currentUrl}?`,
      confirmLabel: "Clear Cache",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;

    try {
      if (
        !window.api ||
        typeof window.api.clearWebviewPageCache !== "function"
      ) {
        await showCacheActionDialog({
          title: "Action Unavailable",
          message:
            "Cache clear API is not available in this app session. Please restart OneView and try again.",
          confirmLabel: "OK",
          hideCancel: true,
        });
        return;
      }
      const result = await window.api.clearWebviewPageCache(
        partition,
        currentUrl,
      );
      if (!result?.success) {
        await showCacheActionDialog({
          title: "Could Not Clear Cache",
          message: result?.message || "Unknown error",
          confirmLabel: "OK",
          hideCancel: true,
        });
      } else if (wv) {
        if (typeof wv.reloadIgnoringCache === "function")
          wv.reloadIgnoringCache();
        else wv.reload();
      }
    } catch (err) {
      const errorText = String(err?.message || err || "");
      const hint = /No handler registered for 'clear-webview-page-cache'/.test(
        errorText,
      )
        ? " Restart OneView completely so the latest main-process IPC handlers load."
        : "";
      await showCacheActionDialog({
        title: "Could Not Clear Cache",
        message: `${errorText}${hint}`,
        confirmLabel: "OK",
        hideCancel: true,
      });
    }
    return;
  }

  if (action === "clear-user-data" && anchorTab) {
    const wv = document.getElementById(`webview-${anchorTab.id}`);
    const currentUrl =
      (wv && typeof wv.getURL === "function" && wv.getURL()) ||
      anchorTab.url ||
      "";
    const partition =
      (wv && wv.getAttribute("partition")) ||
      anchorTab.partition ||
      PARTITIONS.guest;
    if (!currentUrl || currentUrl === "about:blank") return;

    const confirmed = await showCacheActionDialog({
      title: "Clear User Data",
      message: `Clear local storage and site data for ${currentUrl}?`,
      confirmLabel: "Clear Data",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;

    try {
      if (
        !window.api ||
        typeof window.api.clearWebviewUserData !== "function"
      ) {
        await showCacheActionDialog({
          title: "Action Unavailable",
          message:
            "User-data clear API is not available in this app session. Please restart OneView and try again.",
          confirmLabel: "OK",
          hideCancel: true,
        });
        return;
      }
      const result = await window.api.clearWebviewUserData(
        partition,
        currentUrl,
      );
      if (!result?.success) {
        await showCacheActionDialog({
          title: "Could Not Clear User Data",
          message: result?.message || "Unknown error",
          confirmLabel: "OK",
          hideCancel: true,
        });
      } else if (wv) {
        if (typeof wv.reloadIgnoringCache === "function")
          wv.reloadIgnoringCache();
        else wv.reload();
      }
    } catch (err) {
      const errorText = String(err?.message || err || "");
      const hint = /No handler registered for 'clear-webview-user-data'/.test(
        errorText,
      )
        ? " Restart OneView completely so the latest main-process IPC handlers load."
        : "";
      await showCacheActionDialog({
        title: "Could Not Clear User Data",
        message: `${errorText}${hint}`,
        confirmLabel: "OK",
        hideCancel: true,
      });
    }
    return;
  }

  if (action === "clear-all") {
    closeTabsBulk(tabs.map((t) => t.id));
    return;
  }
  if (action === "clear-right" && anchorIndex >= 0) {
    closeTabsBulk(tabs.slice(anchorIndex + 1).map((t) => t.id));
    return;
  }
  if (action === "clear-left" && anchorIndex >= 0) {
    closeTabsBulk(tabs.slice(0, anchorIndex).map((t) => t.id));
  }
}

function setupTabContextMenu() {
  const tabsHeader = document.querySelector(".tabs-header");
  if (!tabsHeader) return;

  tabsHeader.addEventListener("contextmenu", async (e) => {
    if (e.target.closest(".profile-section")) return;
    e.preventDefault();

    const tabEl = e.target.closest(".tab");
    const clickedId = tabEl?.id?.replace("tab-ui-", "");
    const anchorId = clickedId || activeTabId || tabs[0]?.id || null;
    if (!anchorId) return;
    tabContextAnchorId = anchorId;

    const anchorIndex = tabs.findIndex((t) => t.id === anchorId);
    const anchorTab = tabs[anchorIndex];
    const anchorWebview = document.getElementById(`webview-${anchorId}`);
    const canInspectLocalFile = isInspectableLocalFileTab(
      anchorTab,
      anchorWebview,
    );
    const hasPageToClear = Boolean(
      anchorTab &&
      !anchorTab.isHome &&
      ((anchorWebview && anchorWebview.getURL() !== "about:blank") ||
        anchorTab.url),
    );
    const leftCount = anchorIndex > 0 ? anchorIndex : 0;
    const rightCount =
      anchorIndex >= 0 && anchorIndex < tabs.length - 1
        ? tabs.length - anchorIndex - 1
        : 0;

    if (
      window.api &&
      typeof window.api.showNativeTabContextMenu === "function"
    ) {
      await window.api.showNativeTabContextMenu({
        anchorId,
        x: Math.round(e.x),
        y: Math.round(e.y),
        disabled: {
          clearLeft: leftCount === 0,
          clearRight: rightCount === 0,
          clearCache: !hasPageToClear,
          clearUserData: !hasPageToClear,
          inspectLocalFile: !canInspectLocalFile,
        },
      });
    }
  });
}

function extractDroppedUrl(dataTransfer) {
  if (!dataTransfer) return "";

  const uriListEntry = String(dataTransfer.getData("text/uri-list") || "")
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry && !entry.startsWith("#"));
  if (uriListEntry && /^https?:\/\//i.test(uriListEntry)) {
    return uriListEntry;
  }

  const html = String(dataTransfer.getData("text/html") || "");
  const hrefMatch = html.match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);
  if (hrefMatch && /^https?:\/\//i.test(String(hrefMatch[1] || "").trim())) {
    return String(hrefMatch[1] || "").trim();
  }

  const plainText = String(dataTransfer.getData("text/plain") || "").trim();
  if (/^https?:\/\//i.test(plainText)) {
    return plainText;
  }
  if (plainText && !/\s/.test(plainText) && /\./.test(plainText)) {
    return normalizeUrlInput(plainText);
  }

  return "";
}

function setupTabDropTarget() {
  const tabsHeader = document.querySelector(".tabs-header");
  if (!tabsHeader || tabsHeader.dataset.dropBound === "1") return;
  tabsHeader.dataset.dropBound = "1";

  const setDropState = (active) => {
    tabsHeader.classList.toggle("is-drop-target", Boolean(active));
  };

  tabsHeader.addEventListener("dragenter", (event) => {
    const url = extractDroppedUrl(event.dataTransfer);
    if (!url) return;
    event.preventDefault();
    setDropState(true);
  });

  tabsHeader.addEventListener("dragover", (event) => {
    const url = extractDroppedUrl(event.dataTransfer);
    if (!url) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    setDropState(true);
  });

  tabsHeader.addEventListener("dragleave", (event) => {
    if (tabsHeader.contains(event.relatedTarget)) return;
    setDropState(false);
  });

  tabsHeader.addEventListener("drop", (event) => {
    const url = extractDroppedUrl(event.dataTransfer);
    setDropState(false);
    if (!url) return;
    event.preventDefault();
    const targetTabEl = event.target.closest(".tab");
    const targetTabId = targetTabEl?.id?.replace("tab-ui-", "") || activeTabId;
    const targetIndex = tabs.findIndex((tab) => tab.id === targetTabId);
    createTab(url, null, "New Tab", null, {
      insertIndex: targetIndex >= 0 ? targetIndex + 1 : tabs.length,
    });
  });
}

function handleProfileDropdownOutsideClick(e) {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  if (!profileBtn || !profileDropdown) return;

  if (
    !profileBtn.contains(e.target) &&
    !profileDropdown.contains(e.target) &&
    !profileDropdown.classList.contains("hidden")
  ) {
    closeOverlayModal(() => profileDropdown.classList.add("hidden"));
  }
}

async function handleNativeTabContextAction(payload) {
  const action = String(payload?.action || "");
  if (!action || action === "__menu_closed__") return;
  const anchorId = String(
    payload?.anchorId || tabContextAnchorId || activeTabId || tabs[0]?.id || "",
  );
  if (!anchorId) return;
  await runTabContextAction(action, anchorId);
}

function loadImageFromDataUrl(dataUrl = "") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode captured image"));
    img.src = String(dataUrl || "");
  });
}

function buildCaptureAxisSlices(totalSize = 0, viewportSize = 0) {
  const total = Math.max(0, Number(totalSize || 0));
  const viewport = Math.max(1, Number(viewportSize || 0));
  if (total <= viewport) {
    return [{ position: 0, drawStart: 0, drawSize: total }];
  }

  const maxScroll = Math.max(0, total - viewport);
  const positions = [];
  for (let position = 0; position < maxScroll; position += viewport) {
    positions.push(position);
  }
  if (positions[positions.length - 1] !== maxScroll) {
    positions.push(maxScroll);
  }

  const slices = [];
  let coveredUntil = 0;
  positions.forEach((position) => {
    const tileEnd = Math.min(position + viewport, total);
    const drawStart = Math.max(position, coveredUntil);
    const drawSize = Math.max(0, tileEnd - drawStart);
    if (drawSize > 0) {
      slices.push({ position, drawStart, drawSize });
      coveredUntil = Math.max(coveredUntil, tileEnd);
    }
  });
  return slices;
}

// Mobile viewport management
const VIEWPORT_PRESETS = {
  desktop: { width: 1920, height: 1080, userAgent: "desktop" },
  mobile: { width: 414, height: 896, userAgent: "mobile" },
  tablet: { width: 768, height: 1024, userAgent: "tablet" },
};

async function setMobileViewport(activeWebview, viewportType = "mobile") {
  if (!activeWebview) {
    throw new Error("No active webview");
  }

  const preset = VIEWPORT_PRESETS[viewportType] || VIEWPORT_PRESETS.mobile;

  console.log(
    `[Viewport] Setting ${viewportType} viewport: ${preset.width}x${preset.height}`,
  );

  // Physically resize the native webview surface
  if (window.api?.setWebviewBounds) {
    const webcontentsId = getWebviewId(activeWebview);
    if (webcontentsId) {
      console.log(
        `[Viewport] Triggering native resize to ${preset.width}x${preset.height} for id: ${webcontentsId}`,
      );
      await window.api.setWebviewBounds(webcontentsId, {
        width: preset.width,
        height: preset.height,
      });
    }
  }

  // Store original webview dimensions for restoration
  if (!window.__oneview_original_webview_dims) {
    window.__oneview_original_webview_dims = {
      width: activeWebview.style.width,
      height: activeWebview.style.height,
      minWidth: activeWebview.style.minWidth,
      minHeight: activeWebview.style.minHeight,
      maxWidth: activeWebview.style.maxWidth,
      maxHeight: activeWebview.style.maxHeight,
      flex: activeWebview.style.flex,
    };
  }

  // CRITICAL: Resize the actual webview element itself
  // This is what Electron's capturePage() actually captures from
  activeWebview.style.width = preset.width + "px";
  activeWebview.style.height = preset.height + "px";
  activeWebview.style.minWidth = preset.width + "px";
  activeWebview.style.minHeight = preset.height + "px";
  activeWebview.style.maxWidth = preset.width + "px";
  activeWebview.style.maxHeight = preset.height + "px";
  activeWebview.style.flex = "none";

  console.log(
    `[Viewport] Resized webview element to ${preset.width}x${preset.height}`,
  );

  // Also inject CSS to force viewport meta and proper sizing for responsive pages
  await activeWebview.executeJavaScript(
    `
      (() => {
        // Store original viewport for restoration
        if (!window.__oneview_original_viewport) {
          window.__oneview_original_viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
          };
        }
        
        // Update/create meta viewport
        let metaViewport = document.querySelector('meta[name="viewport"]');
        if (!metaViewport) {
          metaViewport = document.createElement('meta');
          metaViewport.name = 'viewport';
          document.head.appendChild(metaViewport);
        }
        metaViewport.content = 'width=${preset.width}, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        // Force body and html to take correct width but allow height to be scrollable
        document.documentElement.style.width = '${preset.width}px';
        document.documentElement.style.height = 'auto'; // Reverted from fixed height
        document.documentElement.style.minHeight = '100vh';
        document.body.style.width = '${preset.width}px';
        document.body.style.height = 'auto';
        document.body.style.minHeight = '100vh';
        
        console.log('[Viewport] ${viewportType} viewport applied - window.innerWidth should now reflect ${preset.width}');
        return { width: ${preset.width}, height: ${preset.height} };
      })();
    `,
    true,
  );

  // Force page re-layout and let Electron re-render at new size
  // Reduced from 1000ms to 300ms for better responsiveness
  await new Promise((resolve) => setTimeout(resolve, 300));

  return preset;
}

async function restoreNativeViewport(activeWebview) {
  if (!activeWebview) return;

  // Restore native bounds to fit container (visible area)
  // We can let the standard syncBounds handle this by simply resetting the style
  // but for immediate restoration before next sync, we can force it.
  if (window.api?.setWebviewBounds) {
    const container = document.getElementById("webviews-container");
    const webcontentsId = getWebviewId(activeWebview);
    if (container && webcontentsId) {
      const rect = container.getBoundingClientRect();
      await window.api.setWebviewBounds(webcontentsId, {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    }
  }
}

async function resetViewport(activeWebview) {
  console.log("[Viewport] Resetting to original viewport");

  // Restore webview element dimensions
  if (window.__oneview_original_webview_dims && activeWebview) {
    const dims = window.__oneview_original_webview_dims;
    activeWebview.style.width = dims.width;
    activeWebview.style.height = dims.height;
    activeWebview.style.minWidth = dims.minWidth;
    activeWebview.style.minHeight = dims.minHeight;
    activeWebview.style.maxWidth = dims.maxWidth;
    activeWebview.style.maxHeight = dims.maxHeight;
    activeWebview.style.flex = dims.flex;
    window.__oneview_original_webview_dims = null;

    // Restore native bounds
    await restoreNativeViewport(activeWebview);

    console.log(
      "[Viewport] Webview element dimensions and native bounds restored",
    );
  }

  await activeWebview.executeJavaScript(
    `
      (() => {
        if (window.__oneview_original_viewport) {
          document.documentElement.style.width = '';
          document.documentElement.style.height = '';
          document.body.style.width = '';
          document.body.style.height = '';
          
          let metaViewport = document.querySelector('meta[name="viewport"]');
          if (metaViewport) {
            metaViewport.content = 'width=device-width, initial-scale=1.0';
          }
          console.log('[Viewport] Viewport reset to original');
        }
        return true;
      })();
    `,
    true,
  );

  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function captureActiveWebviewScreenshot(options = {}) {
  const activeWebview = getActiveWebview();
  if (!activeWebview || typeof activeWebview.executeJavaScript !== "function") {
    throw new Error("Active tab is unavailable");
  }
  if (typeof activeWebview.capturePage !== "function") {
    throw new Error("Active tab does not support capture");
  }

  // Get viewport type (mobile/desktop) - default to desktop
  const viewportType = String(options?.viewport || "desktop")
    .trim()
    .toLowerCase();

  console.log("[Capture] Active webview found", {
    id: activeWebview.id,
    url: activeWebview.getURL?.(),
    title: activeWebview.getTitle?.(),
    viewport: viewportType,
    loading: activeWebview._webContent?.state?.loading,
  });

  // Set mobile/tablet viewport if requested
  if (viewportType === "mobile" || viewportType === "tablet") {
    const presetType = viewportType === "tablet" ? "tablet" : "mobile";
    await setMobileViewport(activeWebview, presetType);
    console.log(
      "[Capture] Viewport changed to " +
        presetType +
        ", waiting for page reflow...",
    );
    // Wait small amount for page to settle at new dimensions
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // Wait for page to be fully loaded
  const maxWaitTime = 5000; // 5 seconds max
  const startTime = Date.now();
  while (
    activeWebview._webContent?.state?.loading &&
    Date.now() - startTime < maxWaitTime
  ) {
    console.log("[Capture] Waiting for page to load...");
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(
    "[Capture] Page load status:",
    activeWebview._webContent?.state?.loading ? "still loading" : "loaded",
  );

  const mode = String(options?.mode || "visible")
    .trim()
    .toLowerCase();
  if (mode !== "full" && mode !== "fullpage") {
    const image = await activeWebview.capturePage();
    const dataUrl = image?.isEmpty?.() ? "" : image.toDataURL();
    console.log(
      "[CapturePage] Visible captured. DataUrl length:",
      dataUrl?.length || 0,
    );
    return {
      mode: "visible",
      dataUrl,
      width: image?.getSize?.()?.width || 0,
      height: image?.getSize?.()?.height || 0,
    };
  }

  const captureMetrics = await activeWebview.executeJavaScript(
    `
      (() => {
        const root = document.scrollingElement || document.documentElement || document.body;
        const body = document.body || root;
        return {
          scrollX: Number(window.scrollX || 0),
          scrollY: Number(window.scrollY || 0),
          viewportWidth: Math.max(1, Number(window.innerWidth || root.clientWidth || 0)),
          viewportHeight: Math.max(1, Number(window.innerHeight || root.clientHeight || 0)),
          totalWidth: Math.max(
            Number(root.scrollWidth || 0),
            Number(root.clientWidth || 0),
            Number(body.scrollWidth || 0),
            Number(body.clientWidth || 0)
          ),
          totalHeight: Math.max(
            Number(root.scrollHeight || 0),
            Number(root.clientHeight || 0),
            Number(body.scrollHeight || 0),
            Number(body.clientHeight || 0)
          ),
        };
      })();
    `,
    true,
  );
  let totalWidth = Math.max(1, Number(captureMetrics?.totalWidth || 0));
  let totalHeight = Math.max(1, Number(captureMetrics?.totalHeight || 0));
  let viewportWidth = Math.max(1, Number(captureMetrics?.viewportWidth || 0));
  let viewportHeight = Math.max(1, Number(captureMetrics?.viewportHeight || 0));

  console.log("[FullCapture] Starting capture process...");

  console.log("[FullCapture] Initial metrics:", captureMetrics);

  // UNLOCK scroll-behavior: auto globally to prevent 'smooth' scrolling from breaking timing
  await activeWebview.executeJavaScript(`
    (() => {
      const style = document.createElement('style');
      style.id = '__oneview_force_auto_scroll__';
      style.textContent = 'html, body, * { scroll-behavior: auto !important; }';
      (document.head || document.documentElement).appendChild(style);
    })();
  `, true).catch(() => {});

  // VERIFY SCROLL OPERATION
  if (totalHeight > viewportHeight + 100) {
    console.log("[FullCapture] Verifying scroll functionality...");
    const testScrollScript = `
      (() => {
        const startY = (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
        try {
          window.scrollTo({ top: startY + 50, behavior: 'auto' });
          if (document.documentElement) document.documentElement.scrollTop = startY + 50;
          if (document.body) document.body.scrollTop = startY + 50;
          if (document.scrollingElement) document.scrollingElement.scrollTop = startY + 50;
        } catch(e) {}
        const endY = (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
        return { startY, endY };
      })();
    `;
    const scrollRes = await activeWebview.executeJavaScript(testScrollScript, true).catch(() => null);
    console.log("[FullCapture] Verification scroll results:", scrollRes);
    
    const startY = Number(scrollRes?.startY || 0);
    const endY = Number(scrollRes?.endY || 0);
    if (endY - startY < 10) {
      throw new Error("Scroll verification failed: page did not scroll (startY=" + startY + ", endY=" + endY + "). Capture aborted to prevent repeating/empty fallback images.");
    }
    
    // Scroll back to top to begin progressive capture
    await activeWebview.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `, true).catch(() => {});
  }

  // Scroll in viewport-sized chunks to load lazy content
  const scrollStep = Math.floor(viewportHeight * 0.8);
  const steps = Math.ceil(totalHeight / scrollStep);
  console.log("[FullCapture] Progressive scroll: " + steps + " steps, " + scrollStep + "px per step");

  let currentPosition = 0;
  for (let i = 0; i < steps; i++) {
    currentPosition = Math.min(currentPosition + scrollStep, totalHeight);
    console.log(`[FullCapture] Scrolling host-driven to ${currentPosition}px (${i+1}/${steps})`);
    
    const scrollScript = `
      (() => {
        const targetY = ${currentPosition};
        try {
          window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
        } catch(e) {}
        try {
          if (document.documentElement) document.documentElement.scrollTop = targetY;
        } catch(e) {}
        try {
          if (document.body) document.body.scrollTop = targetY;
        } catch(e) {}
        try {
          if (document.scrollingElement) document.scrollingElement.scrollTop = targetY;
        } catch(e) {}
        return (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
      })();
    `;
    await activeWebview.executeJavaScript(scrollScript, true).catch(() => {});
    // Host-driven sleep: completely safe, won't hang!
    await new Promise(r => setTimeout(r, 600));
  }

  // Final scroll to absolute bottom and wait for any final lazy loads
  await activeWebview.executeJavaScript(`window.scrollTo({ top: ${totalHeight}, left: 0, behavior: 'auto' });`, true).catch(() => {});
  await new Promise(r => setTimeout(r, 800));

  // PAUSE ACTIVE ANIMATIONS AND MUTATIONS (LIVE PAGE)
  await activeWebview.executeJavaScript(`
    (() => {
      const STYLE_ID = '__oneview_full_capture_style__';
      const captureStyle = document.createElement('style');
      captureStyle.id = STYLE_ID;
      captureStyle.textContent = 'html, body, * { scroll-behavior: auto !important; animation-play-state: paused !important; transition: none !important; } html, body { overflow: hidden !important; }';
      (document.head || document.documentElement).appendChild(captureStyle);

      if (!window.__oneview_js_frozen) {
        window.__oneview_js_frozen = true;
        window.stop();
        window.__oneview_backup = {
          setTimeout: window.setTimeout,
          setInterval: window.setInterval,
          requestAnimationFrame: window.requestAnimationFrame,
          XMLHttpRequest: window.XMLHttpRequest,
          fetch: window.fetch
        };
        window.setTimeout = () => 0;
        window.setInterval = () => 0;
        window.requestAnimationFrame = () => 0;
        window.XMLHttpRequest = function() { throw new Error('disabled'); };
        window.fetch = () => Promise.reject(new Error('disabled'));
      }
    })();
  `, true).catch(() => {});

  // Scroll back to top before we take screenshots
  console.log("[FullCapture] Scrolling back to top...");
  const scrollToTopScript = `
    (() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch(e) {}
      try {
        if (document.documentElement) document.documentElement.scrollTop = 0;
      } catch(e) {}
      try {
        if (document.body) document.body.scrollTop = 0;
      } catch(e) {}
      try {
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      } catch(e) {}
      return (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
    })();
  `;
  await activeWebview.executeJavaScript(scrollToTopScript, true).catch(() => {});
  
  // Wait for scroll to actually reach the top (crucial for mobile and some desktop sites)
  let backToTopAttempts = 0;
  let reachedTop = false;
  while (!reachedTop && backToTopAttempts < 50) {
    const getScrollY = await activeWebview.executeJavaScript(`(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)`, true).catch(() => 0);
    if (getScrollY <= 5) {
      reachedTop = true;
    } else {
      await activeWebview.executeJavaScript(scrollToTopScript, true).catch(() => {});
      await new Promise(r => setTimeout(r, 100));
      backToTopAttempts++;
    }
  }

  // Clean up temp scroll style
  await activeWebview.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `, true).catch(() => {});

  console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");

  // PHASE 2: Brief pre-capture delay
  const userWaitMs = Number(options?.wait || 0) * 1000;
  const totalWaitMs = 200 + userWaitMs;

  console.log(
    `[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${totalWaitMs}ms (Base 0.2s + User ${userWaitMs}ms) for page to settle live...`,
  );
  await new Promise((r) => setTimeout(r, totalWaitMs));

  // Capture the full page in one single CPU-rasterized shot
  let dataUrl = "";
  let image = null;
  try {
    console.log("[FullCapture] Calling native one-shot capture...");
    image = await activeWebview.capturePage({ 
      mode: "full",
      scrollHeight: Math.round(totalHeight)
    });
    dataUrl = image?.isEmpty?.() ? "" : image.toDataURL();
  } finally {
    // Unfreeze and restore DOM state
    console.log("[FullCapture] Restoring original body and globals...");
    await activeWebview.executeJavaScript(
      `
        (() => {
          if (window.__oneview_backup) {
            window.setTimeout = window.__oneview_backup.setTimeout;
            window.setInterval = window.__oneview_backup.setInterval;
            window.XMLHttpRequest = window.__oneview_backup.XMLHttpRequest;
            window.fetch = window.__oneview_backup.fetch;
            delete window.__oneview_backup;
          }
          
          // No body swap needed - live page was modified directly

          window.__oneview_js_frozen = false;
          window.__oneview_capture_in_progress = false;
          
          document.getElementById("__oneview_full_capture_style__")?.remove();
          document.querySelectorAll("[data-oneview-scroll-restore-id]").forEach((node) => {
            node.removeAttribute("data-oneview-scroll-restore-id");
          });
          window.dispatchEvent(new Event('scroll'));
          window.dispatchEvent(new Event('resize'));
          return true;
        })();
      `,
      true,
    ).catch(() => {});

    if (viewportType === "mobile" || viewportType === "tablet") {
      await resetViewport(activeWebview);
    }

    // Restore scroll position
    await activeWebview
      .executeJavaScript(
        `
        window.scrollTo(${Math.round(Number(captureMetrics?.scrollX || 0))}, ${Math.round(
          Number(captureMetrics?.scrollY || 0),
        )});
      `,
        true,
      )
      .catch(() => {});
  }

  if (!dataUrl) {
    throw new Error("Full page capture returned empty image data");
  }

  return {
    mode: "full",
    dataUrl,
    width: image?.getSize?.()?.width || 0,
    height: image?.getSize?.()?.height || 0,
    tileCount: 1,
  };

  // PHASE 1: Progressive scroll to load ALL lazy content (like SiteSnap)
  // This ensures images, videos, and dynamic content are loaded before we disable JS
  console.log(
    "[FullCapture] PHASE 1: Progressive scroll to load ALL lazy content...",
  );
  return {
    mode: "full",
    dataUrl,
    width: image?.getSize?.()?.width || 0,
    height: image?.getSize?.()?.height || 0,
    tileCount: 1,
  };
}

async function handleBrowserExtensionCommand(payload) {
  const command = String(payload?.command || "").trim();
  const url = String(payload?.url || "").trim();
  const requestId = String(payload?.requestId || "").trim();
  if (!command) return;

  if (command === "execute-script") {
    const source = String(payload?.source || "");
    let response = { requestId, success: false, message: "No active tab" };
    try {
      const activeWebview = getActiveWebview();
      if (
        !activeWebview ||
        typeof activeWebview.executeJavaScript !== "function"
      ) {
        response = {
          requestId,
          success: false,
          message: "Active tab is unavailable",
        };
      } else {
        const wrappedSource = `
          (() => {
            const run = () => {
              ${source}
            };
            return run();
          })();
        `;
        const result = await activeWebview.executeJavaScript(
          wrappedSource,
          true,
        );
        response = { requestId, success: true, result };
      }
    } catch (error) {
      response = {
        requestId,
        success: false,
        message: error?.message || String(error),
      };
    }
    if (window.api?.resolveBrowserExtensionCommand) {
      await window.api.resolveBrowserExtensionCommand(response);
    }
    return;
  }

  if (command === "ui-prompt") {
    let response = {
      requestId,
      success: false,
      message: "Prompt request failed",
    };
    try {
      const result = await openExtensionPromptDialog(payload?.prompt || {});
      response = { requestId, success: true, result };
    } catch (error) {
      response = {
        requestId,
        success: false,
        message: error?.message || String(error),
      };
    }
    if (window.api?.resolveBrowserExtensionCommand) {
      await window.api.resolveBrowserExtensionCommand(response);
    }
    return;
  }

  if (command === "capture-page") {
    let response = {
      requestId,
      success: false,
      message: "Capture request failed",
      key: payload?.key || "view:extension-popup",
    };
    try {
      // Get the mode and viewport from options
      const mode = String(payload?.options?.mode || "visible")
        .trim()
        .toLowerCase();
      const viewport = String(payload?.options?.viewport || "desktop")
        .trim()
        .toLowerCase();
      const wait = Number(payload?.options?.wait || 0);
      console.log(
        "[View] Capturing mode:",
        mode,
        "viewport:",
        viewport,
        "wait:",
        wait,
      );

      // For full-page captures, use the dedicated function
      if (mode === "full" || mode === "fullpage") {
        console.log("[View] Using full-page capture function");
        const result = await captureActiveWebviewScreenshot({
          mode,
          viewport,
          wait,
        });
        response = { requestId, success: true, result, key: payload?.key || "view:extension-popup" };
      } else {
        // For visible area, capture directly from the active webview
        const activeWebview = getActiveWebview();

        if (!activeWebview || typeof activeWebview.capturePage !== "function") {
          throw new Error("Active tab does not support capture");
        }

        console.log(
          "[View] Capturing visible area from webview id:",
          activeWebview.id,
        );

        // Set viewport if needed for visible capture too
        if (viewport === "mobile" || viewport === "tablet") {
          const presetType = viewport === "tablet" ? "tablet" : "mobile";
          await setMobileViewport(activeWebview, presetType);
          console.log(
            "[View] Viewport changed to " +
              presetType +
              ", waiting for page reflow...",
          );
          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        const image = await activeWebview.capturePage();
        const dataUrl = image?.isEmpty?.() ? "" : image.toDataURL?.();

        console.log(
          "[View] Visible capture dataUrl length:",
          dataUrl?.length || 0,
        );

        const result = {
          mode: "visible",
          dataUrl,
          width: image?.getSize?.()?.width || 0,
          height: image?.getSize?.()?.height || 0,
        };

        // Reset viewport if it was changed
        if (viewport === "mobile" || viewport === "tablet") {
          await resetViewport(activeWebview);
        }

        response = { requestId, success: true, result, key: payload?.key || "view:extension-popup" };
      }
    } catch (error) {
      console.error("[View] Capture error:", error);
      response = {
        requestId,
        success: false,
        message: error?.message || String(error),
        key: payload?.key || "view:extension-popup",
      };
    }
    if (window.api?.resolveBrowserExtensionCommand) {
      await window.api.resolveBrowserExtensionCommand(response);
    }
    return;
  }

  if (command === "tabs-create") {
    const url = String(payload.url || "").trim();
    const requestId = payload.requestId;
    let targetPartition = payload.partition || null;

    // If partition is missing but it's an extension URL, try to guess it
    if (!targetPartition && url.startsWith(`${APP_PROTOCOL_SCHEME}://`)) {
      try {
        const urlObj = new URL(url);
        targetPartition = `ext-${urlObj.host}`;
      } catch (_e) {}
    }

    const normalizedTargetPartition = targetPartition
      ? normalizeAppPartitionName(targetPartition)
      : "";

    // Reuse a result tab only when it belongs to the same extension partition.
    const existingTab = tabs.find(
      (t) =>
        t.url &&
        t.url.includes("result.html") &&
        (!normalizedTargetPartition ||
          normalizeAppPartitionName(t.partition || "") === normalizedTargetPartition),
    );

    if (existingTab) {
      console.log("[View] Reusing existing result tab:", existingTab.id);
      await navigateToTab(existingTab.id, url, targetPartition, "Result");
      if (payload.active !== false) {
        await switchTab(existingTab.id);
      }
    } else {
      // Corrected: options is the 5th argument
      await createTab(url, targetPartition, "Result", null, {
        active: payload.active !== false,
        extensionEntryPath: payload.entryPath,
      });
    }

    if (requestId && window.api?.resolveBrowserExtensionCommand) {
      await window.api.resolveBrowserExtensionCommand({
        requestId,
        success: true,
      });
    }
    return;
  }

  if (command === "tabs-close") {
    let response = { requestId, success: false, message: "Tab not found" };
    try {
      const targetTabId = String(payload?.tabId || "").trim();
      const targetTab = tabs.find((item) => item.id === targetTabId);
      if (!targetTab) {
        response = { requestId, success: false, message: "Tab not found" };
      } else {
        closeTab(targetTabId);
        response = {
          requestId,
          success: true,
          result: {
            id: targetTabId,
            closed: true,
          },
        };
      }
    } catch (error) {
      response = {
        requestId,
        success: false,
        message: error?.message || String(error),
      };
    }
    if (window.api?.resolveBrowserExtensionCommand) {
      await window.api.resolveBrowserExtensionCommand(response);
    }
    return;
  }

  if (!url) return;

  const activeTab = getActiveTab();
  const activeWebview = getActiveWebview();
  const fallbackPartition =
    activeTab?.partition ||
    PROFILES[currentProfileId]?.partition ||
    PARTITIONS.guest;
  const isExtensionPageUrl = /^file:\/\//i.test(url);
  const extensionOptions = {
    extensionEntryPath: isExtensionPageUrl
      ? String(payload?.entryPath || "").trim()
      : "",
    extensionActiveContext: {
      url: String(activeWebview?.getURL?.() || activeTab?.url || "").trim(),
      title: String(
        activeWebview?.getTitle?.() || activeTab?.title || "",
      ).trim(),
    },
    active: payload?.active !== false,
  };

  // singleton tab management for extension pages: if requested URL is already open, focus it
  if (isExtensionPageUrl) {
    const existingTab = tabs.find((t) => t.url === url);
    if (existingTab) {
      await switchTab(existingTab.id);
      if (requestId && window.api?.resolveBrowserExtensionCommand) {
        await window.api.resolveBrowserExtensionCommand({
          requestId,
          success: true,
          result: {
            id: existingTab.id,
            url,
            title: existingTab.title || "New Tab",
            active: true,
          },
        });
      }
      return;
    }
  }

  if (
    command === "tabs-update" &&
    activeTab &&
    !activeTab.isHome &&
    !activeTab.nativePage
  ) {
    await navigateTo(url, fallbackPartition, "New Tab", null, extensionOptions);
    if (requestId && window.api?.resolveBrowserExtensionCommand) {
      await window.api.resolveBrowserExtensionCommand({
        requestId,
        success: true,
        result: {
          id: activeTab.id,
          url,
          title: activeTab.title || "New Tab",
          active: true,
        },
      });
    }
    return;
  }

  const previousActiveTabId = activeTab?.id || activeTabId;
  const createdTab = createTab(
    url,
    fallbackPartition,
    "New Tab",
    null,
    extensionOptions,
  );

  if (requestId && window.api?.resolveBrowserExtensionCommand) {
    await window.api.resolveBrowserExtensionCommand({
      requestId,
      success: true,
      result: {
        id: createdTab?.id || "",
        url,
        title: createdTab?.title || "New Tab",
        active: payload?.active !== false,
      },
    });
  }
}

function bindViewGlobalListeners() {
  if (viewGlobalListenersBound) return;
  viewGlobalListenersBound = true;

  document.addEventListener("click", handleProfileDropdownOutsideClick);
  document.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = String(event.key || "").toLowerCase();
    const isTabCycleShortcut =
      event.key === "Tab" || event.key === "PageUp" || event.key === "PageDown";

    // Allow tab-cycling shortcuts even while focus is inside the New Tab
    // search box or another editable field.
    if (!isTabCycleShortcut && isEditableShortcutTarget(event.target)) return;

    if (key === "h" && !event.shiftKey) {
      event.preventDefault();
      openSettingsTab("history");
      return;
    }
    if (key === "d" && event.shiftKey) {
      event.preventDefault();
      openSettingsTab("downloads");
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
      switchRelativeTab(event.shiftKey ? -1 : 1);
      return;
    }
    if (event.key === "PageUp") {
      event.preventDefault();
      event.stopPropagation();
      switchRelativeTab(-1);
      return;
    }
    if (event.key === "PageDown") {
      event.preventDefault();
      event.stopPropagation();
      switchRelativeTab(1);
    }
  }, true);
  window.addEventListener("resize", refreshTabScrollControls);
  setupTabDropTarget();

  if (window.api && typeof window.api.onViewTabShortcut === "function") {
    window.api.onViewTabShortcut((payload) => {
      const direction = Number(payload?.direction || 0);
      if (!direction) return;
      switchRelativeTab(direction < 0 ? -1 : 1);
    });
  }

  if (
    window.api &&
    typeof window.api.onBrowserExtensionsUpdated === "function"
  ) {
    window.api.onBrowserExtensionsUpdated(() => {
      console.log("Browser extensions updated, refreshing UI...");
      refreshExtensionsManagerList().catch(() => {});
    });
  }
  if (window.api && typeof window.api.onNativeTabContextAction === "function") {
    window.api.onNativeTabContextAction((payload) => {
      handleNativeTabContextAction(payload).catch(() => {});
    });
  }
  if (
    window.api &&
    typeof window.api.onBrowserExtensionCommand === "function"
  ) {
    window.api.onBrowserExtensionCommand((payload) => {
      handleBrowserExtensionCommand(payload).catch((error) => {
        console.error("Browser extension command failed", error);
      });
    });
  }
}

// Update createTab to use currentProfileId
// Redefining createTab to ensure it captures the currentProfileId correctly if it wasn't hoisted or if we need to modify default param

/**
 * WINDOWS MAXIMIZE LAYOUT FIX
 * Tracks the actual pixel dimensions of the container and handles the OS maximize animation delay.
 */
let maximizeSyncInterval;
let maximizeSyncTimeout;

const containerObserver = new ResizeObserver(() => {
  const wv = getActiveWebview();
  if (!wv || typeof wv.syncBounds !== "function") return;

  // 1. Sync immediately on the first pixel change
  wv.syncBounds(true);

  // 2. Clear any existing intervals/timeouts to prevent overlap if the user is dragging the window
  clearInterval(maximizeSyncInterval);
  clearTimeout(maximizeSyncTimeout);

  // 3. The Windows Maximize animation takes ~150-250ms.
  // We rapid-fire syncBounds every 50ms during this window to ensure the Electron view
  // stays perfectly attached to the expanding DOM.
  maximizeSyncInterval = setInterval(() => {
    const activeWv = getActiveWebview();
    if (activeWv && typeof activeWv.syncBounds === "function") {
      activeWv.syncBounds(true);
    }
  }, 50);

  // 4. Stop the rapid-fire syncing once the OS animation is completely finished
  maximizeSyncTimeout = setTimeout(() => {
    clearInterval(maximizeSyncInterval);
    const activeWv = getActiveWebview();
    if (activeWv && typeof activeWv.syncBounds === "function") {
      activeWv.syncBounds(true);
    }
  }, 350);
});

// Start observing the container as soon as it exists in the DOM
// Use MutationObserver instead of a polling setInterval - zero CPU cost until DOM actually changes
(function attachContainerObserver() {
  const container = document.getElementById("webviews-container");
  if (container) {
    containerObserver.observe(container);
    return;
  }
  // Element not yet in DOM - watch for it efficiently via MutationObserver
  const domWatcher = new MutationObserver(() => {
    const el = document.getElementById("webviews-container");
    if (el) {
      domWatcher.disconnect();
      containerObserver.observe(el);
    }
  });
  domWatcher.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

window.enterSiteSnapStudioMode = function() {
  document.body.classList.add("sitesnap-studio-mode");
  const layout = document.querySelector(".view-layout");
  if (layout) layout.classList.add("sitesnap-studio-mode");
  try {
    window.parent.document.body.classList.add("sitesnap-studio-active");
  } catch (e) {
    console.error("Failed to set parent active layout", e);
  }
};

window.exitSiteSnapStudioMode = function() {
  document.body.classList.remove("sitesnap-studio-mode");
  const layout = document.querySelector(".view-layout");
  if (layout) layout.classList.remove("sitesnap-studio-mode");
  try {
    window.parent.document.body.classList.remove("sitesnap-studio-active");
  } catch (e) {
    console.error("Failed to remove parent active layout", e);
  }
};
