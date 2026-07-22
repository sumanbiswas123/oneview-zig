import "../../components/titlebar/titlebar.js";
import { APP_DISPLAY_NAME, APP_SERVICE_BASE_URL, DEV_ACCESS_LIST_URL, QC_ACCESS_LIST_URL, IS_DEV_APP_BUILD } from "../../lib/app-env.js";
import { STORAGE_KEYS } from "../../lib/app-runtime.js";
import { showToast } from "../../lib/notifications.js";

document.title = APP_DISPLAY_NAME;

let loginAttempts = 0;
let url = "127.0.0.1:8009";
let loginEndpoint = "auth/login";
let resetEndpoint = "auth/reset-password";
let pingEndpoint = "auth/ping";

let eventLog = {
  user: null,
  type: null,
  timestamp: null,
};

function logEvent(user, type) {
  eventLog.user = user;
  eventLog.type = type;
  eventLog.timestamp = new Date().toISOString();
  console.log("Event logged:", eventLog);
}

function Exit() {
  if (window.api && typeof window.api.close === "function") {
    window.api.close();
  } else {
    console.warn("window.api.close() not available");
  }
  console.log("The Exit Button is pressed");
}

function Minimize() {
  if (window.api && typeof window.api.minimize === "function") {
    window.api.minimize();
  } else {
    console.warn("window.api.minimize() not available");
  }
  console.log("The Minimize Button is pressed");
}

function Maximize() {
  if (window.api && typeof window.api.maximize === "function") {
    window.api.maximize();
  } else {
    console.warn("window.api.maximize() not available");
  }
  console.log("The Maximize Button is pressed");
}

const openDashboard = () => {
  window.location.href = "../dashboard/dashboard.html";
};

function resetDashboardStartupUpdateCheck() {
  try {
    localStorage.removeItem(STORAGE_KEYS.systemUpdateCheckStarted);
    sessionStorage.removeItem(STORAGE_KEYS.systemUpdateCheckStarted);
  } catch (error) {
    console.warn("Could not reset dashboard update check state", error);
  }
}

let forceUpdateGateState = {
  checking: false,
  forceUpdate: false,
  blocked: false,
  status: "idle",
  latestVersion: "",
  error: "",
};
let forceUpdateGatePromise = null;
let mandatoryInstallQueued = false;

// Persistent login functions
async function getPersistedCredentials() {
  try {
    if (!window.api || typeof window.api.getPersistedCredentials !== "function") {
      return null;
    }
    const creds = await window.api.getPersistedCredentials();
    if (!creds) return null;

    // Clean up any "undefined" values that might have been stored previously
    const cleanFirstName =
      creds.firstName && creds.firstName !== "undefined" && creds.firstName.trim()
        ? creds.firstName
        : null;

    return {
      username: creds.username,
      password: creds.password,
      firstName: cleanFirstName,
    };
  } catch (e) {
    console.warn("Error reading persisted credentials", e);
    return null;
  }
}

async function setPersistedCredentials(username, password, firstName) {
  try {
    if (!window.api || typeof window.api.savePersistedCredentials !== "function") {
      return;
    }
    const cleanFirstName =
      firstName && firstName !== "undefined" && firstName.trim()
        ? firstName
        : "";
    const expiry = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000; // 100 years
    await window.api.savePersistedCredentials({
      username,
      password,
      firstName: cleanFirstName,
      expiry,
    });
  } catch (e) {
    console.warn("Error saving persisted credentials", e);
  }
}

async function clearPersistedCredentials() {
  try {
    if (window.api && typeof window.api.clearPersistedCredentials === "function") {
      await window.api.clearPersistedCredentials();
    }
  } catch (e) {
    console.warn("Error clearing persisted credentials", e);
  }
}

// Fetch user's first name from resource API
async function fetchUserFirstName(username) {
  try {
    // Only numeric usernames can be looked up via resource API
    if (!/^\d+$/.test(username)) {
      return null;
    }

    const RESOURCE_SERVICE_BASE_URL = "http://10.215.56.196:5000";
    const res = await fetch(
      `${RESOURCE_SERVICE_BASE_URL}/api/resources/${username}`,
      {
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!res.ok) return null;

    const data = await res.json();
    const fullName =
      data?.resource_name || data?.resourceName || data?.resourceNameId;

    if (fullName) {
      return String(fullName).trim().split(/\s+/)[0];
    }
  } catch (e) {
    console.warn("Could not fetch user first name", e);
  }
  return null;
}

function persistSuccessfulLoginCredentials(username, password, firstName = null) {
  setPersistedCredentials(username, password, firstName);

  if (firstName) {
    return;
  }

  void fetchUserFirstName(username)
    .then((resolvedFirstName) => {
      if (resolvedFirstName) {
        setPersistedCredentials(username, password, resolvedFirstName);
      }
    })
    .catch((error) => {
      console.warn("Could not enrich persisted credentials with first name", error);
    });
}

// Make functions globally available for other modules
window.setPersistedCredentials = setPersistedCredentials;
window.getPersistedCredentials = getPersistedCredentials;
window.clearPersistedCredentials = clearPersistedCredentials;

function showPersistedLoginUI(creds) {
  const persistedContainer = document.getElementById(
    "persisted-login-container",
  );
  const loginForm = document.getElementById("login-form");
  const usernameDisplay = document.getElementById("persisted-username-display");

  if (persistedContainer && loginForm && usernameDisplay) {
    const displayName =
      (creds.firstName && creds.firstName.trim()) || creds.username;
    usernameDisplay.textContent = `Welcome back, ${displayName}`;
    persistedContainer.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }
}

function showRegularLoginUI() {
  const persistedContainer = document.getElementById(
    "persisted-login-container",
  );
  const loginForm = document.getElementById("login-form");

  if (persistedContainer && loginForm) {
    persistedContainer.classList.add("hidden");
    loginForm.classList.remove("hidden");
  }
}

function readCompletedPasswordChangeUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.passwordChangeCompletedUsers);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (_err) {
    return {};
  }
}

function markPasswordChangeRequired(username, required) {
  try {
    const normalizedUsername = String(username || "").trim();
    if (!normalizedUsername) return;
    if (required) {
      localStorage.setItem(
        STORAGE_KEYS.passwordChangePendingUser,
        normalizedUsername,
      );
      return;
    }
    if (
      localStorage.getItem(STORAGE_KEYS.passwordChangePendingUser) ===
      normalizedUsername
    ) {
      localStorage.removeItem(STORAGE_KEYS.passwordChangePendingUser);
    }
  } catch (_err) {}
}

function detectPasswordChangeRequired(responseBody, username, password) {
  const normalizedUsername = String(username || "").trim();
  const normalizedPassword = String(password || "");
  const completedUsers = readCompletedPasswordChangeUsers();
  if (completedUsers[normalizedUsername]) return false;

  const defaultPassword = normalizedUsername
    ? `${normalizedUsername}@Hogarth`
    : "";
  const usedDefaultPassword =
    Boolean(defaultPassword) && normalizedPassword === defaultPassword;

  const body =
    responseBody && typeof responseBody === "object" ? responseBody : {};
  const directFlags = [
    body.requiresPasswordChange,
    body.requirePasswordChange,
    body.forcePasswordChange,
    body.mustChangePassword,
    body.firstLogin,
    body.isFirstLogin,
    body.passwordResetRequired,
  ];
  if (directFlags.some((flag) => flag === true)) {
    return true;
  }

  const statusBag = [
    body.status,
    body.code,
    body.message,
    body.detail,
    body.reason,
  ]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");

  if (
    /password.*change|change.*password|first.*login|temporary.*password|default.*password/.test(
      statusBag,
    )
  ) {
    return true;
  }

  return usedDefaultPassword;
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form");
  const statusEl = document.getElementById("connection-status");
  const titlebarEl = document.querySelector(".titlebar");
  const guestButton = document.getElementById("guest-button");
  const passwordInput = document.getElementById("password");
  const passwordToggleBtn = document.getElementById("login-password-toggle");
  const loginContainer = document.querySelector(".login-container");
  const forceUpdateOverlay = document.getElementById("force-update-overlay");
  const forceUpdateTitleEl = document.getElementById("force-update-title");
  const forceUpdateMessageEl = document.getElementById("force-update-message");
  const forceUpdateProgressEl = document.getElementById(
    "force-update-progress",
  );
  const corpPingUrl = `${APP_SERVICE_BASE_URL}/auth/ping`;
  const publicProbeUrl = "https://www.gstatic.com/generate_204";
  let internetConnected = false;
  let corpNetworkReachable = false;
  const markStartup = (stage, meta = {}) => {
    try {
      if (window.api && typeof window.api.markStartup === "function") {
        void window.api.markStartup(stage, {
          page: "login",
          href: window.location.href,
          rendererMs: Number(performance.now().toFixed(1)),
          ...meta,
        });
      }
    } catch (_err) {}
  };

  markStartup("login:dom-content-loaded");
  requestAnimationFrame(() => {
    markStartup("login:first-animation-frame");
  });
  window.addEventListener(
    "load",
    () => {
      markStartup("login:window-load");
    },
    { once: true },
  );

  function isForceUpdateBlocking() {
    return forceUpdateGateState.blocked === true;
  }

  function setForceUpdatePanelState({
    visible = false,
    title = "",
    message = "",
    progress = "",
  } = {}) {
    if (forceUpdateOverlay) {
      forceUpdateOverlay.classList.toggle("hidden", !visible);
    }
    if (forceUpdateTitleEl && title) {
      forceUpdateTitleEl.textContent = title;
    }
    if (forceUpdateMessageEl && message) {
      forceUpdateMessageEl.textContent = message;
    }
    if (forceUpdateProgressEl) {
      const progressText = String(progress || "").trim();
      forceUpdateProgressEl.textContent = progressText;
      forceUpdateProgressEl.classList.toggle("hidden", !progressText);
    }
  }

  function setLoginAccessBlocked(blocked) {
    if (loginContainer) {
      loginContainer.classList.toggle("login-locked", blocked);
    }
    if (titlebarEl) {
      titlebarEl.classList.toggle("login-locked", blocked);
    }
    if (statusEl) {
      statusEl.classList.toggle("login-locked", blocked);
    }
    const controls = loginContainer?.querySelectorAll(
      "#login-form input, #login-form button, #persisted-login-container button",
    );
    controls?.forEach((control) => {
      control.disabled = blocked;
    });
  }

  async function queueMandatoryInstall(version = "") {
    if (mandatoryInstallQueued) return;
    mandatoryInstallQueued = true;
    setForceUpdatePanelState({
      visible: true,
      title: "Installing required update",
      message:
        "The required update has been downloaded. OneView will now install it automatically.",
      progress: version ? `Version ${version}` : "",
    });
    try {
      await window.api?.showUpdateInstallPrompt?.({
        version,
        mode: "update",
      });
      await window.api?.submitUpdateInstallPrompt?.({ action: "install" });
    } catch (error) {
      mandatoryInstallQueued = false;
      forceUpdateGateState = {
        ...forceUpdateGateState,
        blocked: true,
        status: "error",
        error: error?.message || String(error),
      };
      setForceUpdatePanelState({
        visible: true,
        title: "Required update could not start",
        message:
          error?.message ||
          "OneView could not start the mandatory installer. Please restart the app and try again.",
      });
    }
  }

  function renderForceUpdateState(nextState = {}) {
    forceUpdateGateState = {
      ...forceUpdateGateState,
      ...nextState,
    };

    const status = String(forceUpdateGateState.status || "idle").trim();
    const version = String(forceUpdateGateState.latestVersion || "").trim();
    const progressText =
      typeof forceUpdateGateState.percent === "number" &&
      Number.isFinite(forceUpdateGateState.percent)
        ? `${Math.max(0, Math.min(100, Math.round(forceUpdateGateState.percent)))}% downloaded`
        : version
          ? `Version ${version}`
          : "";

    if (forceUpdateGateState.checking) {
      setLoginAccessBlocked(false);
      setForceUpdatePanelState({ visible: false });
      return;
    }

    if (!forceUpdateGateState.forceUpdate || !forceUpdateGateState.blocked) {
      setLoginAccessBlocked(false);
      setForceUpdatePanelState({ visible: false });
      return;
    }

    setLoginAccessBlocked(true);

    if (status === "error") {
      setForceUpdatePanelState({
        visible: true,
        title: "Required update check failed",
        message:
          forceUpdateGateState.error ||
          "OneView could not verify the mandatory update right now. Please try again in a moment.",
      });
      return;
    }

    if (status === "downloaded") {
      setForceUpdatePanelState({
        visible: true,
        title: "Installing required update",
        message:
          "The mandatory update is ready. OneView is starting the installer now.",
        progress: progressText,
      });
      void queueMandatoryInstall(version);
      return;
    }

    if (status === "installing") {
      setForceUpdatePanelState({
        visible: true,
        title: "Installing required update",
        message:
          "The mandatory update is installing now. OneView will restart when it is ready.",
        progress: progressText,
      });
      return;
    }

    setForceUpdatePanelState({
      visible: true,
      title: "Downloading required update",
      message:
        "A mandatory OneView update is available. Sign-in is blocked until the latest build finishes downloading.",
      progress: progressText,
    });
  }

  async function checkForceUpdateGate() {
    if (!window.api?.getForceUpdateState) {
      return;
    }

    forceUpdateGatePromise = (async () => {
      renderForceUpdateState({
        checking: true,
        forceUpdate: false,
        blocked: false,
        status: "idle",
        latestVersion: "",
        error: "",
      });

      try {
        const gateState = await window.api.getForceUpdateState();
        renderForceUpdateState({
          checking: false,
          forceUpdate: gateState?.forceUpdate === true,
          blocked: gateState?.blocked === true,
          status: String(gateState?.status || "idle").trim(),
          latestVersion: String(gateState?.latestVersion || "").trim(),
          error:
            String(gateState?.message || "").trim() ||
            String(gateState?.error || "").trim(),
        });
      } catch (error) {
        renderForceUpdateState({
          checking: false,
          forceUpdate: true,
          blocked: true,
          status: "error",
          latestVersion: "",
          error: error?.message || String(error),
        });
      }
    })().finally(() => {
      forceUpdateGatePromise = null;
    });

    return forceUpdateGatePromise;
  }

  async function waitForForceUpdateCheckIfNeeded() {
    if (!forceUpdateGatePromise) return;
    try {
      await forceUpdateGatePromise;
    } catch (_error) {}
  }

  if (window.api?.on) {
    window.api.on("update-status", (payload = {}) => {
      if (!forceUpdateGateState.forceUpdate) return;
      const status = String(payload?.status || "").trim();
      const version = String(
        payload?.version || forceUpdateGateState.latestVersion || "",
      ).trim();
      renderForceUpdateState({
        checking: false,
        forceUpdate: true,
        blocked: status !== "not-available",
        status: status || forceUpdateGateState.status,
        latestVersion: version,
        percent:
          typeof payload?.percent === "number" ? payload.percent : undefined,
        error: String(payload?.error || "").trim(),
      });
    });
  }

  // Check for persisted credentials
  let persistedCreds = null;
  try {
    persistedCreds = await getPersistedCredentials();
  } catch (err) {
    console.warn("Failed to retrieve persisted credentials", err);
  }

  // One-time cleanup of any "undefined" firstName values from previous versions
  try {
    const storedFirstName = localStorage.getItem(
      STORAGE_KEYS.persistedFirstName,
    );
    if (storedFirstName === "undefined") {
      localStorage.removeItem(STORAGE_KEYS.persistedFirstName);
      console.log("Cleaned up undefined firstName from localStorage");
    }
  } catch (e) {
    console.warn("Error during firstName cleanup", e);
  }

  if (persistedCreds) {
    showPersistedLoginUI(persistedCreds);
  } else {
    showRegularLoginUI();
  }

  void checkForceUpdateGate();

  // Set up persisted login button
  const persistedLoginBtn = document.getElementById("login-persisted");
  if (persistedLoginBtn) {
    persistedLoginBtn.addEventListener("click", async () => {
      if (!persistedCreds) return;
      if (isForceUpdateBlocking()) return;

      const username = persistedCreds.username;
      const password = persistedCreds.password;

      if (
        !connectivityCheckedAt ||
        Date.now() - connectivityCheckedAt > 15000
      ) {
        await updateConnectivityStatus();
      }

      // Use the same login logic as the form
      await performLogin(username, password);
    });
  }

  // Set up "login with another user" button
  const otherUserBtn = document.getElementById("login-other-user");
  if (otherUserBtn) {
    otherUserBtn.addEventListener("click", () => {
      if (isForceUpdateBlocking()) return;
      showRegularLoginUI();
    });
  }

  // create inline error element (starts hidden)
  let errorEl = null;
  errorEl = document.createElement("div");
  if (form) {
    errorEl.className = "login-error hidden";
    errorEl.setAttribute("role", "alert");
    form.appendChild(errorEl);
  }

  // create dot + text nodes
  let dotSpan = null;
  let statusTextSpan = null;
  if (statusEl) {
    statusEl.innerHTML = ""; // clear text
    dotSpan = document.createElement("span");
    dotSpan.className = "dot loading";
    dotSpan.setAttribute("aria-hidden", "true");

    statusTextSpan = document.createElement("span");
    statusTextSpan.className = "status-text";

    statusEl.appendChild(dotSpan);
    statusEl.appendChild(statusTextSpan);
  }

  // Dots animation
  let dots = 0;
  let dotsInterval = null;
  let connectivityCheckInFlight = null;
  let connectivityCheckedAt = 0;
  let connectivityIntervalId = null;
  let connectivityBootstrapTimer = null;
  function startDots(intervalMs = 500) {
    if (!statusTextSpan || !dotSpan) return;
    clearInterval(dotsInterval);
    dots = 0;
    dotSpan.className = "dot loading";
    statusTextSpan.textContent = "Checking internet and VPN";
    dotsInterval = setInterval(() => {
      dots = (dots + 1) % 4; // 0..3
      statusTextSpan.textContent =
        "Checking internet and VPN" + ".".repeat(dots);
    }, intervalMs);
  }
  // stop animation and set final state: state = 'connected' | 'error' | 'idle'
  function stopDots(finalText, state = "idle") {
    clearInterval(dotsInterval);
    dotsInterval = null;
    if (!statusTextSpan || !dotSpan) return;
    statusTextSpan.textContent = finalText ?? "";
    dotSpan.className =
      "dot " +
      (state === "connected"
        ? "connected"
        : state === "error"
          ? "error"
          : "idle");
  }
  stopDots("Starting up...", "idle");

  function withTimeout(ms = 4000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return { signal: controller.signal, clear: () => clearTimeout(timer) };
  }

  async function probeUrl(targetUrl, timeoutMs = 4000) {
    const timeout = withTimeout(timeoutMs);
    try {
      // no-cors is enough for reachability checks; we only care if request resolves.
      await fetch(targetUrl, {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
        signal: timeout.signal,
      });
      return true;
    } catch (_err) {
      return false;
    } finally {
      timeout.clear();
    }
  }

  async function updateConnectivityStatus() {
    if (connectivityCheckInFlight) {
      return connectivityCheckInFlight;
    }

    connectivityCheckInFlight = (async () => {
      markStartup("login:connectivity-check:start");
      startDots(350);

      // Fast fail if browser already reports offline.
      if (!navigator.onLine) {
        internetConnected = false;
        corpNetworkReachable = false;
        stopDots("Please connect to internet (Wi-Fi or Ethernet).", "error");
        markStartup("login:connectivity-check:offline");
        return;
      }

      internetConnected = await probeUrl(publicProbeUrl, 3500);
      if (!internetConnected) {
        corpNetworkReachable = false;
        stopDots("Please connect to internet (Wi-Fi or Ethernet).", "error");
        markStartup("login:connectivity-check:no-internet");
        return;
      }

      // Internal endpoint reachable => either on WPP network or VPN is active.
      corpNetworkReachable = await probeUrl(corpPingUrl, 4500);
      if (!corpNetworkReachable) {
        stopDots(
          "Internet connected. Please connect to Cisco Secure VPN.",
          "error",
        );
        markStartup("login:connectivity-check:no-vpn");
        return;
      }

      stopDots("Connected", "connected");
      markStartup("login:connectivity-check:connected");
    })().finally(() => {
      connectivityCheckedAt = Date.now();
      connectivityCheckInFlight = null;
    });

    return connectivityCheckInFlight;
  }

  function scheduleConnectivityBootstrap() {
    if (connectivityBootstrapTimer) return;
    connectivityBootstrapTimer = setTimeout(() => {
      connectivityBootstrapTimer = null;
      markStartup("login:connectivity-bootstrap");
      void updateConnectivityStatus();
      if (!connectivityIntervalId) {
        connectivityIntervalId = setInterval(() => {
          void updateConnectivityStatus();
        }, 5000);
      }
    }, 1200);
  }

  requestAnimationFrame(() => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(
        () => {
          scheduleConnectivityBootstrap();
        },
        { timeout: 1500 },
      );
      return;
    }
    scheduleConnectivityBootstrap();
  });
  window.addEventListener("online", () => {
    void updateConnectivityStatus();
  });
  window.addEventListener("offline", () => {
    void updateConnectivityStatus();
  });

  if (passwordInput && passwordToggleBtn) {
    passwordToggleBtn.addEventListener("click", () => {
      const nextVisible = passwordInput.type === "password";
      passwordInput.type = nextVisible ? "text" : "password";
      passwordToggleBtn.classList.toggle("is-visible", nextVisible);
      passwordToggleBtn.setAttribute(
        "aria-label",
        `${nextVisible ? "Hide" : "Show"} password`,
      );
      passwordToggleBtn.title = passwordToggleBtn.getAttribute("aria-label");
      passwordInput.focus();
    });
  }

  // Extract login logic into a reusable function
  async function sendVersionData(empId) {
    if (!window.api || typeof window.api.getAppVersion !== "function") return;
    try {
      const version = await window.api.getAppVersion();
      if (!version) return;

      const endpoint = `${APP_SERVICE_BASE_URL}/api/send-version-data`;
      console.log("[Version Sync] Sending version data...", { empId, version });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: empId,
          app_version: version,
        }),
      });

      if (!res.ok) {
        console.warn(`[Version Sync] Server returned ${res.status}`);
      } else {
        console.log("[Version Sync] Successfully sent version data");
      }
    } catch (error) {
      console.warn("[Version Sync] Failed to send version data", error);
    }
  }

  async function performLogin(username, password) {
    await waitForForceUpdateCheckIfNeeded();

    if (isForceUpdateBlocking()) {
      showError(
        "A required OneView update is in progress. Please wait for the update to finish before signing in.",
      );
      return;
    }

    if (!connectivityCheckedAt || Date.now() - connectivityCheckedAt > 15000) {
      await updateConnectivityStatus();
    }
    markStartup("login:submit", {
      usernameLength: String(username || "").length,
    });

    // helper to show inline error
    function showError(msg) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove("hidden");
        errorEl.classList.remove("login-success");
        errorEl.classList.add("login-error");
      } else {
        alert(msg);
      }
    }

    // show success message then redirect to dashboard
    function showSuccessAndRedirect(msg) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove("hidden");
        errorEl.classList.remove("login-error");
        errorEl.classList.add("login-success");
      }
      const finalizeRedirect = async () => {
        resetDashboardStartupUpdateCheck();
        try {
          if (window.api && typeof window.api.storeSession === "function") {
            await window.api.storeSession({
              username: String(username || "").trim(),
              loggedInAt: Date.now(),
            });
            return;
          }
        } catch (error) {
          console.warn("Could not persist main-process session", error);
        }
        openDashboard();
      };
      requestAnimationFrame(() => {
        setTimeout(() => {
          void finalizeRedirect();
        }, 0);
      });
    }

    try {
      const [devRes, qcRes] = await Promise.all([
        fetch(DEV_ACCESS_LIST_URL).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(QC_ACCESS_LIST_URL).then(r => r.ok ? r.json() : []).catch(() => [])
      ]);
      
      const normalizedUsername = String(username || "").trim().toLowerCase();
      const devUser = Array.isArray(devRes) ? devRes.find(u => String(u.id).trim().toLowerCase() === normalizedUsername) : null;
      const qcUser = Array.isArray(qcRes) ? qcRes.find(u => String(u.id).trim().toLowerCase() === normalizedUsername) : null;
      
      if (devUser) {
        localStorage.setItem("userRole", "dev");
        localStorage.setItem("userMaster", "true");
        localStorage.setItem("userCanChangePassword", "true");
      } else if (qcUser) {
        localStorage.setItem("userRole", "qc");
        localStorage.setItem("userMaster", qcUser.master === true ? "true" : "false");
        localStorage.setItem("userCanChangePassword", qcUser.password === true ? "true" : "false");
      } else {
        localStorage.setItem("userRole", "production");
        localStorage.setItem("userMaster", "false");
        localStorage.setItem("userCanChangePassword", "true");
        localStorage.setItem("oneview_env_mode", "prod");
      }
      
      if (errorEl) errorEl.classList.add("hidden");
    } catch (err) {
      console.warn("Access list check non-fatal warning", err);
      if (!localStorage.getItem("userRole")) {
        localStorage.setItem("userRole", "production");
      }
    }

    if (!internetConnected) {
      showError("Please connect to internet (Wi-Fi or Ethernet) first.");
      return;
    }
    if (!corpNetworkReachable) {
      showError("Please connect to Cisco Secure VPN.");
      return;
    }

    // Try HTTP POST to backend first
    try {
      const res = await fetch(`${APP_SERVICE_BASE_URL}/auth/login`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // openDashboard(); // MOVED DOWN
        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }

        const hasToken =
          data && (data.token || data.access_token || data.accessToken);
        const okByBody = (data && data.status === "success") || hasToken;

        if (okByBody) {
          // persist token and user info if provided
          let firstName = null;
          try {
            if (hasToken) {
              const token = data.token || data.access_token || data.accessToken;
              localStorage.setItem("authToken", token);
              localStorage.setItem("username", username);
            }
            // Also store emp_id if provided in response
            if (data && data.emp_id) {
              localStorage.setItem("emp_id", data.emp_id);
            }
            // Extract and store first name
            if (data) {
              const fullName =
                data.resource_name || data.resourceName || data.resourceNameId;
              if (fullName) {
                localStorage.setItem("resourceName", String(fullName).trim());
                firstName = String(fullName).trim().split(/\s+/)[0];
              }
            }
          } catch (e) {
            console.warn("Could not save auth data", e);
          }
          markPasswordChangeRequired(
            username,
            detectPasswordChangeRequired(data, username, password),
          );

          // Keep the successful login path non-blocking. If we do not already
          // have the first name, enrich persisted credentials in the background.
          persistSuccessfulLoginCredentials(username, password, firstName);

          loginAttempts = 0;
          if (errorEl) {
            // keep hidden — just clear stale text
            errorEl.classList.add("hidden");
            errorEl.textContent = "";
          }

          // Send current app version to backend
          const syncEmpId = data?.emp_id || username;
          void sendVersionData(syncEmpId);

          showSuccessAndRedirect("Login successful! Redirecting...");
          return;
        } else {
          loginAttempts++;
          showError(
            data && data.message
              ? data.message
              : "Incorrect username or password",
          );
        }
      } else {
        // non-2xx response — treat as failure and fallback
        console.warn("Login POST returned", res.status);
        throw new Error("Server returned " + res.status);
      }
    } catch (err) {
      // network error or backend not available — try IPC verifyLogin if available
      console.warn(
        "POST /api/login failed, falling back to IPC/local check",
        err,
      );
      stopDots("Connected, but auth server is unavailable.", "error");
      try {
        if (window.api && typeof window.api.verifyLogin === "function") {
          const result = await window.api.verifyLogin(username, password);
          if (result && result.success) {
            markPasswordChangeRequired(
              username,
              detectPasswordChangeRequired(result, username, password),
            );
            persistSuccessfulLoginCredentials(username, password);
            loginAttempts = 0;
            if (errorEl) {
              errorEl.classList.remove("hidden");
              errorEl.textContent = "";
            }
            showSuccessAndRedirect(
              result && result.message ? result.message : "Login successful!",
            );
            return;
          } else {
            loginAttempts++;
            showError(
              result && result.message
                ? result.message
                : "Incorrect username or password",
            );
          }
        } else {
          // final fallback: local credentials (dev only)
          const isValid = usernames.some(
            (user) => user.username === username && user.password === password,
          );
          if (isValid) {
            markPasswordChangeRequired(
              username,
              detectPasswordChangeRequired(null, username, password),
            );
            persistSuccessfulLoginCredentials(username, password);
            loginAttempts = 0;
            if (errorEl) {
              errorEl.classList.remove("hidden");
              errorEl.textContent = "";
            }
            showSuccessAndRedirect("Login successful!");
            return;
          } else {
            loginAttempts++;
            showError("Incorrect username or password");
          }
        }
      } catch (ipcErr) {
        console.error("verifyLogin fallback failed", ipcErr);
        loginAttempts++;
        showError("Login unavailable — try again later");
      }
    }

    if (loginAttempts) {
      guestButton.classList.remove("hidden");
    }
  }

  // Form toggle functions for forgot password feature
  function showLoginForm() {
    const loginForm = document.getElementById("login-form");
    const forgotPasswordForm = document.getElementById("forgot-password-form");

    if (forgotPasswordForm) {
      forgotPasswordForm.classList.add("hidden");
    }
    if (loginForm) {
      loginForm.classList.remove("hidden");
      // Focus on username field
      const usernameInput = loginForm.querySelector("#username");
      if (usernameInput) {
        setTimeout(() => usernameInput.focus(), 100);
      }
    }

    // Clear error message
    if (errorEl) {
      errorEl.classList.add("hidden");
      errorEl.textContent = "";
    }
  }

  function showForgotPasswordForm() {
    const loginForm = document.getElementById("login-form");
    const forgotPasswordForm = document.getElementById("forgot-password-form");

    if (loginForm) {
      loginForm.classList.add("hidden");
    }
    if (forgotPasswordForm) {
      forgotPasswordForm.classList.remove("hidden");
      // Focus on employee ID field
      const employeeIdInput = forgotPasswordForm.querySelector(
        "#forgot-employee-id",
      );
      if (employeeIdInput) {
        setTimeout(() => employeeIdInput.focus(), 100);
      }
    }

    // Clear error message
    if (errorEl) {
      errorEl.classList.add("hidden");
      errorEl.textContent = "";
    }
  }

  // Forgot password handler
  async function performForgotPassword(employeeId, newPassword) {
    function showError(msg) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove("hidden");
        errorEl.classList.remove("login-success");
        errorEl.classList.add("login-error");
      } else {
        alert(msg);
      }
    }

    function showSuccess(msg) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove("hidden");
        errorEl.classList.remove("login-error");
        errorEl.classList.add("login-success");
      }
    }

    // Validate inputs
    if (!employeeId || !employeeId.trim()) {
      showError("Please enter your Employee ID.");
      return;
    }
    if (!newPassword || !newPassword.trim()) {
      showError("Please enter a new password.");
      return;
    }

    if (IS_DEV_APP_BUILD) {
      showError("Verifying permissions...");
      try {
        const [devRes, qcRes] = await Promise.all([
          fetch(DEV_ACCESS_LIST_URL).then(r => r.json()),
          fetch(QC_ACCESS_LIST_URL).then(r => r.json())
        ]);
        
        const normalizedEmpId = String(employeeId || "").trim().toLowerCase();
        const devUser = devRes.find(u => String(u.id).trim().toLowerCase() === normalizedEmpId);
        const qcUser = qcRes.find(u => String(u.id).trim().toLowerCase() === normalizedEmpId);
        
        if (!devUser && !qcUser) {
          showError("Access denied. You do not have permission to reset the password.");
          return;
        }
        
        if (qcUser && qcUser.password !== true) {
          showError("Password change is disabled for QC users.");
          return;
        }
        
        if (errorEl) errorEl.classList.add("hidden");
      } catch (err) {
        console.error("Forgot password verify error", err);
        showError("Unable to verify reset permissions. Please try again.");
        return;
      }
    }

    // Check connectivity
    if (!connectivityCheckedAt || Date.now() - connectivityCheckedAt > 15000) {
      await updateConnectivityStatus();
    }

    if (!internetConnected) {
      showError("Please connect to internet (Wi-Fi or Ethernet) first.");
      return;
    }
    if (!corpNetworkReachable) {
      showError("Please connect to Cisco Secure VPN.");
      return;
    }

    // Make POST request to reset password endpoint
    try {
      const res = await fetch(`${APP_SERVICE_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: String(employeeId).trim(),
          newPassword: String(newPassword).trim(),
        }),
      });

      if (res.ok) {
        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }

        // Treat 2xx as success
        showSuccess("Password reset successfully! Returning to login...");
        showToast(
          "Your password reset request has been sent for approval to the team.",
          "success",
          5000,
        );

        // Clear the form
        const forgotPasswordForm = document.getElementById(
          "forgot-password-form",
        );
        if (forgotPasswordForm) {
          forgotPasswordForm.reset();
        }

        // Return to login form after delay
        setTimeout(() => {
          showLoginForm();
        }, 1500);
        return;
      } else {
        // Handle non-2xx response
        let errorMsg = "Password reset failed. Please try again.";
        try {
          const data = await res.json();
          if (data && data.message) {
            errorMsg = data.message;
          }
        } catch (e) {
          // Could not parse error response
        }
        showError(errorMsg);
      }
      showToast(
        res.statusText == "Conflict"
          ? "Password reset request already submitted & pending for approval."
          : "Password reset unavailable — please try again later.",
        "warning",
        5000,
      );
    } catch (err) {
      console.warn("Password reset request failed", err);
      showError("Password reset unavailable — please try again later.");
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = passwordInput.value;
    await performLogin(username, password);
  });

  // Forgot password button event listener
  const forgotPasswordBtn = document.getElementById("forgot-password-btn");
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", (event) => {
      event.preventDefault();
      showForgotPasswordForm();
    });
  }

  // Back to login button event listener
  const backToLoginBtn = document.getElementById("back-to-login-btn");
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      showLoginForm();
    });
  }

  // Forgot password form submission
  const forgotPasswordForm = document.getElementById("forgot-password-form");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const employeeId = document.getElementById("forgot-employee-id").value;
      const newPassword = document.getElementById("forgot-new-password").value;
      const confirmPassword = document.getElementById(
        "forgot-confirm-password",
      ).value;

      if (newPassword !== confirmPassword) {
        showToast("Passwords do not match. Please try again.", "error", 4000);
        return;
      }

      await performForgotPassword(employeeId, newPassword);
    });
  }

  // Password toggle for forgot password field
  const forgotPasswordToggleBtn = document.getElementById(
    "forgot-password-toggle",
  );
  const forgotNewPasswordInput = document.getElementById("forgot-new-password");
  const forgotConfirmPasswordToggleBtn = document.getElementById(
    "forgot-confirm-password-toggle",
  );
  const forgotConfirmPasswordInput = document.getElementById(
    "forgot-confirm-password",
  );

  if (forgotPasswordToggleBtn && forgotNewPasswordInput) {
    forgotPasswordToggleBtn.addEventListener("click", () => {
      const nextVisible = forgotNewPasswordInput.type === "password";
      forgotNewPasswordInput.type = nextVisible ? "text" : "password";
      forgotPasswordToggleBtn.classList.toggle("is-visible", nextVisible);
      forgotPasswordToggleBtn.setAttribute(
        "aria-label",
        `${nextVisible ? "Hide" : "Show"} password`,
      );
      forgotPasswordToggleBtn.title =
        forgotPasswordToggleBtn.getAttribute("aria-label");
      forgotNewPasswordInput.focus();
    });
  }

  if (forgotConfirmPasswordToggleBtn && forgotConfirmPasswordInput) {
    forgotConfirmPasswordToggleBtn.addEventListener("click", () => {
      const nextVisible = forgotConfirmPasswordInput.type === "password";
      forgotConfirmPasswordInput.type = nextVisible ? "text" : "password";
      forgotConfirmPasswordToggleBtn.classList.toggle(
        "is-visible",
        nextVisible,
      );
      forgotConfirmPasswordToggleBtn.setAttribute(
        "aria-label",
        `${nextVisible ? "Hide" : "Show"} password`,
      );
      forgotConfirmPasswordToggleBtn.title =
        forgotConfirmPasswordToggleBtn.getAttribute("aria-label");
      forgotConfirmPasswordInput.focus();
    });
  }

  // hide error when user types again
  if (form) {
    form.addEventListener("input", () => {
      if (errorEl && !errorEl.classList.contains("hidden")) {
        errorEl.classList.add("hidden");
        errorEl.textContent = "";
      }
    });
  }

  // hide error when user types in forgot password form
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("input", () => {
      if (errorEl && !errorEl.classList.contains("hidden")) {
        errorEl.classList.add("hidden");
        errorEl.textContent = "";
      }
    });
  }

  // Handle guest login
  guestButton.addEventListener("click", async () => {
    if (IS_DEV_APP_BUILD) {
      if (errorEl) {
        errorEl.textContent = "Guest access is disabled in the Dev application.";
        errorEl.classList.remove("hidden");
        errorEl.classList.remove("login-success");
        errorEl.classList.add("login-error");
      }
      return;
    }

    await waitForForceUpdateCheckIfNeeded();

    if (isForceUpdateBlocking()) {
      if (errorEl) {
        errorEl.textContent =
          "A required OneView update is in progress. Guest access is temporarily unavailable.";
        errorEl.classList.remove("hidden");
        errorEl.classList.remove("login-success");
        errorEl.classList.add("login-error");
      }
      return;
    }
    // alert("Logging in as guest...");
    try {
      const employeeId = String(
        document.getElementById("username")?.value || "",
      ).trim();
      localStorage.setItem("username", "Guest");
      localStorage.setItem("resourceName", "Guest User");
      if (employeeId) {
        localStorage.setItem("emp_id", employeeId);
      } else {
        localStorage.removeItem("emp_id");
      }
      // clear auth token just in case
      localStorage.removeItem("authToken");
    } catch (e) {
      console.warn("Could not set guest storage", e);
    }
    resetDashboardStartupUpdateCheck();
    openDashboard();
  });
});
