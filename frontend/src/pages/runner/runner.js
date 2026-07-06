import "../../components/titlebar/titlebar.js";
import { createWebContentHostElement } from "../../lib/webcontent-client.js";
import {
  isStandaloneExternalExeApp,
  launchStandaloneExternalExe,
} from "../../lib/external-exe.js";
import { isAppProtocolUrl } from "../../lib/app-env.js";
import { PARTITIONS, SESSION_KEYS } from "../../lib/app-runtime.js";
import { initializeOneviewSharedStorageSync } from "../../lib/oneview-shared-storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initializeOneviewSharedStorageSync().catch((err) => {
    console.warn("Could not initialize OneView shared storage sync", err);
  });

  const viewport = document.querySelector(".runner-viewport");
  const urlInput = document.getElementById("url-input");
  const loader = document.getElementById("loader");
  const loadingText = document.getElementById("loading-text");
  const backBtn = document.getElementById("back-btn");
  const fwdBtn = document.getElementById("fwd-btn");
  const reloadBtn = document.getElementById("reload-btn");
  const homeBtn = document.getElementById("home-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");

  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") document.body.classList.add("dark-mode");

  const activeAppJson = sessionStorage.getItem(SESSION_KEYS.activeLaunchApp);
  if (!activeAppJson) {
    window.location.href = "../dashboard/dashboard.html";
    return;
  }
  const app = JSON.parse(activeAppJson);
  if (isStandaloneExternalExeApp(app)) {
    try {
      await launchStandaloneExternalExe(app);
      sessionStorage.removeItem(SESSION_KEYS.activeLaunchApp);
      window.location.href = "../dashboard/dashboard.html";
      return;
    } catch (err) {
      console.error("Runner external Electron launch failed:", err);
      loadingText.textContent = `Launch Failed: ${err?.message || err}`;
    }
  }
  const statusText = `Running Extension: ${String(app.name || "").toLowerCase()}`;
  document.getElementById("status-text-left").textContent = statusText;
  document.getElementById("status-text-right").textContent = statusText;

  const preloadPath =
    window.api && typeof window.api.getWebviewPreloadPath === "function"
      ? window.api.getWebviewPreloadPath()
      : "";

  let remote = null;
  const updateNavState = () => {
    if (!remote) return;
    backBtn.disabled = !remote.canGoBack();
    fwdBtn.disabled = !remote.canGoForward();
  };

  const setUrlDisplay = (url) => {
    urlInput.value = String(url || "about:blank");
  };

  const attachRemoteEvents = () => {
    if (!remote) return;
    remote.addEventListener("did-finish-load", () => {
      loader.classList.add("hidden");
      updateNavState();
      setUrlDisplay(remote.getURL());
    });
    remote.addEventListener("did-stop-loading", () => {
      updateNavState();
      setUrlDisplay(remote.getURL());
    });
    remote.addEventListener("did-navigate", (e) => {
      setUrlDisplay(e.url || remote.getURL());
      updateNavState();
    });
    remote.addEventListener("did-navigate-in-page", (e) => {
      setUrlDisplay(e.url || remote.getURL());
      updateNavState();
    });
    remote.addEventListener("did-fail-load", (e) => {
      if (e.errorCode === -3) return;
      loadingText.textContent = `Failed to load: ${e.errorDescription || e.errorCode}`;
    });
    remote.addEventListener("console-message", (e) => {
      const level = e.level === 0 ? "log" : e.level === 1 ? "warn" : "error";
      console[level](
        `[Runner] ${e.sourceId || "webcontent"}:${e.line || 0} - ${e.message}`,
      );
    });
  };

  const ensureRemoteHost = async () => {
    if (remote && !remote.isDestroyed?.()) return remote;
    const old = document.getElementById("app-view");
    if (old) old.remove();
    remote = await createWebContentHostElement({
      key: "runner:app",
      partition: PARTITIONS.runner,
      preloadPath,
      initialMeta: {
        trackingAppId: String(app.id || "").trim(),
        appName: String(app.name || "").trim(),
        appType: String(app.type || "").trim(),
      },
      className: "app-webcontent",
    });
    remote.id = "app-view";
    viewport.appendChild(remote);
    attachRemoteEvents();
    remote.syncBounds();
    return remote;
  };

  const webAppTypes = [
    "nextjs",
    "next",
    "vite",
    "react",
    "angular",
    "html",
    "neutralino",
    "website",
  ];
  const localWebTypeSet = new Set(
    webAppTypes.map((t) => String(t).toLowerCase()),
  );

  try {
    if (
      localWebTypeSet.has(String(app.type || "").toLowerCase()) &&
      app.localPath
    ) {
      loadingText.textContent = `Starting ${app.name}...`;
      await ensureRemoteHost();
      let url = String(app.oneviewUrl || "").trim();
      const needsRunner = ["nextjs", "next", "vite-server"].includes(
        String(app.type || "").toLowerCase(),
      );

      // If it's a framework app, we must use the runner even if a static URL was cached
      if (needsRunner && isAppProtocolUrl(url)) {
        url = "";
      }

      if (
        !needsRunner &&
        window.api &&
        typeof window.api.resolveOneviewAppUrl === "function" &&
        app.id
      ) {
        const resolved = await window.api.resolveOneviewAppUrl(
          app.id,
          app.localPath,
          "/",
          PARTITIONS.runner,
        );
        if (resolved?.success && resolved.url) {
          url = resolved.url;
          // ... update cache if needed (optional here as it's just a refactor)
        }
      }
      if (!url) {
        url = await window.api.launchNextApp(app.localPath, app.type);
      }
      setUrlDisplay(url);
      remote.src = url;
    } else if (app.type === "exe" && app.localPath) {
      loadingText.textContent = "Launching Application...";
      const controls = document.querySelector(".runner-controls");
      if (controls) controls.style.display = "none";

      const result = await window.api.launchExe(app.localPath, app.tech);
      if (result && result.mode === "embedded" && result.url) {
        await ensureRemoteHost();
        const params = new URLSearchParams();
        if (result.token) params.set("NL_TOKEN", result.token);
        const portPart = String(result.url).split(":")[2];
        if (portPart) params.set("NL_PORT", portPart);
        if (app.tech) params.set("TECH", app.tech);
        const finalUrl = `${result.url}?${params.toString()}`;
        setUrlDisplay(finalUrl);
        remote.src = finalUrl;
      } else {
        viewport.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;color:white;margin-top:20%;">
            <div style="font-size:24px;font-weight:bold;margin-bottom:8px;">${app.name} is running</div>
            <p style="opacity:0.7">The application has been launched externally.</p>
          </div>
        `;
        loader.classList.add("hidden");
      }
    }
  } catch (err) {
    console.error("Runner launch failed:", err);
    loadingText.textContent = `Launch Failed: ${err?.message || err}`;
  }

  backBtn.addEventListener("click", () => {
    if (remote && remote.canGoBack()) remote.goBack();
  });
  fwdBtn.addEventListener("click", () => {
    if (remote && remote.canGoForward()) remote.goForward();
  });
  reloadBtn.addEventListener("click", () => {
    if (remote) remote.reload();
  });
  homeBtn.addEventListener("click", async () => {
    if (webAppTypes.includes(app.type)) {
      await window.api.killNextApp();
    } else if (app.type === "exe") {
      await window.api.killExe();
    }
    if (remote && remote._webContent) {
      await remote._webContent.destroy();
    }
    sessionStorage.removeItem(SESSION_KEYS.activeLaunchApp);
    window.location.href = "../dashboard/dashboard.html";
  });

  fullscreenBtn.addEventListener("click", () => {
    document.body.classList.toggle("fullscreen");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("fullscreen")) {
      document.body.classList.remove("fullscreen");
    }
  });
});
