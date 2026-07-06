/**
 * WebContentsView functionality for displaying external content.
 */
import { showToast } from "./notifications.js";
import { createWebContentHostElement } from "./webcontent-client.js";

const WEBVIEW_DEFAULT_ZOOM = 0.9; // adjust between 0.7 - 1.0 as needed
const DASHBOARD_WEB_KEY = "dashboard:primary";
let dashboardHost = null;
let lastLoadedUrl = "";
let currentPartition = "persist:default";

async function ensureDashboardHost(partition = "persist:default") {
  const targetPartition = String(partition || "persist:default");
  if (dashboardHost && !dashboardHost.isDestroyed?.() && targetPartition === currentPartition) {
    return dashboardHost;
  }
  if (dashboardHost && dashboardHost._webContent) {
    await dashboardHost._webContent.destroy();
    dashboardHost = null;
  }
  if (dashboardHost && !dashboardHost.isDestroyed?.()) return dashboardHost;
  const host = document.getElementById("webview-host");
  if (!host) return null;
  host.innerHTML = "";
  const preloadPath =
    window.api && typeof window.api.getWebviewPreloadPath === "function"
      ? window.api.getWebviewPreloadPath()
      : "";
  dashboardHost = await createWebContentHostElement({
    key: DASHBOARD_WEB_KEY,
    partition: targetPartition,
    preloadPath,
    className: "webcontent-host",
  });
  currentPartition = targetPartition;
  host.appendChild(dashboardHost);
  dashboardHost.addEventListener("did-fail-load", (event) => {
    console.error("WebContentsView failed to load:", event);
    showToast("Failed to load webpage. Please check the URL.", "error");
  });
  dashboardHost.addEventListener("did-finish-load", async () => {
    try {
      await dashboardHost.setZoomFactor(WEBVIEW_DEFAULT_ZOOM);
    } catch (err) {
      console.warn("Could not set web content zoom", err);
    }
  });
  return dashboardHost;
}

/**
 * Load a URL into the web content host.
 * @param {string} url - URL to load
 */
export async function loadUrlInWebview(url, partition = "persist:default") {
  const webviewContainer = document.querySelector(".web-view");
  if (!webviewContainer) return;
  const remote = await ensureDashboardHost(partition);
  if (!remote) return;
  lastLoadedUrl = String(url || "");
  remote.src = lastLoadedUrl;
  remote.syncBounds();
  webviewContainer.classList.remove("hidden");
}

/**
 * Close the web content and hide it.
 */
export function closeWebview() {
  const webviewContainer = document.querySelector(".web-view");
  if (webviewContainer) webviewContainer.classList.add("hidden");
  if (dashboardHost && dashboardHost._webContent) {
    dashboardHost._webContent.call("hide");
  }
}

export async function destroyDashboardWebviewSession() {
  const webviewContainer = document.querySelector(".web-view");
  if (webviewContainer) webviewContainer.classList.add("hidden");

  if (dashboardHost && !dashboardHost.isDestroyed?.()) {
    dashboardHost.remove();
  } else if (dashboardHost && dashboardHost._webContent) {
    await dashboardHost._webContent.destroy();
  }

  dashboardHost = null;
  lastLoadedUrl = "";
  currentPartition = "persist:default";

  const host = document.getElementById("webview-host");
  if (host) {
    host.innerHTML = "";
  }
}

/**
 * Open content in a new browser window.
 */
export function openWebviewInNewWindow() {
  if (lastLoadedUrl) {
    window.open(lastLoadedUrl, "_blank");
  }
}

/**
 * Initialize webview event listeners
 */
export function initializeWebview() {
  const webviewCloseBtn = document.querySelector(".webview-close-btn");
  if (webviewCloseBtn) {
    webviewCloseBtn.addEventListener("click", closeWebview);
  }

  const webviewOpenBtn = document.querySelector(".webview-open-btn");
  if (webviewOpenBtn) {
    webviewOpenBtn.addEventListener("click", openWebviewInNewWindow);
  }
}
