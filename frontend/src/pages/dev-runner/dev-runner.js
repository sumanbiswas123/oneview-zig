import { createWebContentHostElement } from "../../lib/webcontent-client.js";
import { initializeOneviewSharedStorageSync } from "../../lib/oneview-shared-storage.js";

window.addEventListener("DOMContentLoaded", async () => {
  await initializeOneviewSharedStorageSync().catch((err) => {
    console.warn("Could not initialize OneView shared storage sync", err);
  });

  const hostSlot = document.getElementById("dev-webview");
  const loadingScreen = document.getElementById("loading");
  const urlDisplay = document.getElementById("url-display");
  const inspectBtn = document.getElementById("btn-inspect");

  const isInspectShortcut = (e) =>
    e.key === "F12" ||
    ((e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      e.key.toLowerCase() === "i");

  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get("url");
  const autoInspect = urlParams.get("inspect") === "1";
  if (!targetUrl) {
    loadingScreen.innerHTML = "<h2>Error</h2><p>No URL provided</p>";
    return;
  }
  urlDisplay.textContent = targetUrl;

  const preloadPath =
    window.api && typeof window.api.getWebviewPreloadPath === "function"
      ? window.api.getWebviewPreloadPath()
      : "";

  const remote = await createWebContentHostElement({
    key: "dev-runner:primary",
    partition: "persist:devsession",
    preloadPath,
    className: "dev-webcontent",
  });
  hostSlot.replaceWith(remote);
  remote.id = "dev-webview";
  remote.syncBounds();

  async function toggleDevTools() {
    try {
      if (remote.isDevToolsOpened()) await remote.closeDevTools();
      else await remote.openDevTools();
    } catch (err) {
      console.error("Dev Runner: unable to toggle DevTools", err);
    }
  }

  document.getElementById("btn-minimize")?.addEventListener("click", () => {
    window.api?.minimize();
  });
  document.getElementById("btn-maximize")?.addEventListener("click", () => {
    window.api?.maximize();
  });
  document.getElementById("btn-close")?.addEventListener("click", () => {
    window.api?.close();
  });
  document.getElementById("btn-refresh")?.addEventListener("click", () => {
    remote.reload();
  });
  inspectBtn?.addEventListener("click", toggleDevTools);

  document.addEventListener("keydown", (e) => {
    if (!isInspectShortcut(e)) return;
    e.preventDefault();
    toggleDevTools();
  });

  remote.addEventListener("did-finish-load", () => {
    loadingScreen.style.display = "none";
    if (autoInspect) {
      setTimeout(() => {
        toggleDevTools();
      }, 300);
    }
  });

  remote.addEventListener("console-message", (e) => {
    const level = e.level === 0 ? "log" : e.level === 1 ? "warn" : "error";
    console[level](`[Dev Host] ${e.sourceId || "webcontent"}:${e.line || 0} - ${e.message}`);
  });

  remote.addEventListener("did-fail-load", (e) => {
    console.error("Dev Runner: failed to load", e);
    if (e.errorCode !== -3) {
      loadingScreen.innerHTML = `<h2>Loading Error</h2><p>${e.errorDescription} (${e.errorCode})</p><p>Trying to connect to: ${targetUrl}</p>`;
    }
  });

  remote.src = targetUrl;
});
