const params = new URLSearchParams(window.location.search);
const initialUrl = String(params.get("url") || "").trim();
const initialTitle = String(params.get("title") || "Detached View").trim();
const initialPartition = String(params.get("partition") || "").trim();
const THEME_STORAGE_KEY = "theme";

document.title = initialTitle || "Detached View";

function applyDetachedTheme(theme = "light") {
  const nextTheme = String(theme || "light").trim().toLowerCase() === "dark"
    ? "dark"
    : "light";
  document.body.classList.toggle("dark-mode", nextTheme === "dark");
}

function getStoredTheme() {
  try {
    return String(localStorage.getItem(THEME_STORAGE_KEY) || "light").trim();
  } catch (_err) {
    return "light";
  }
}

function waitForGlobalFunction(name, timeoutMs = 5000) {
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

async function loadStandaloneViewShell() {
  const root = document.getElementById("detachedViewRoot");
  if (!root) return false;

  const shellUrl = new URL("../view/view.html", window.location.href);
  const response = await fetch(shellUrl);
  if (!response.ok) {
    throw new Error(`Unable to load detached view shell (${response.status})`);
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const mainContent = doc.querySelector(".main-content");
  if (!mainContent) {
    throw new Error("Detached view shell is missing main content");
  }

  root.innerHTML = mainContent.outerHTML;

  doc.querySelectorAll('link[rel="stylesheet"]').forEach((linkEl) => {
    const href = linkEl.getAttribute("href");
    if (!href) return;
    const resolvedHref = new URL(href, response.url || shellUrl).toString();
    if (document.querySelector(`link[href="${resolvedHref}"]`)) return;
    const next = document.createElement("link");
    next.rel = "stylesheet";
    next.href = resolvedHref;
    document.head.appendChild(next);
  });

  const scriptUrls = Array.from(
    doc.querySelectorAll('script[type="module"][src]'),
  ).map((scriptEl) => {
    const src = scriptEl.getAttribute("src");
    return src ? new URL(src, response.url || shellUrl).toString() : "";
  });

  for (const src of scriptUrls) {
    if (!src || document.querySelector(`script[src="${src}"]`)) continue;
    const script = document.createElement("script");
    script.type = "module";
    script.src = src;
    document.body.appendChild(script);
  }

  return true;
}

async function initDetachedShell() {
  // Prefer global theme from shared file (works across separate processes)
  let initialTheme = getStoredTheme();
  if (window.api?.webContentCall) {
    try {
      const result = await window.api.webContentCall("get-global-theme", {});
      if (result?.theme === "dark" || result?.theme === "light") {
        initialTheme = result.theme;
        // Also keep localStorage in sync
        try { localStorage.setItem(THEME_STORAGE_KEY, initialTheme); } catch (_) {}
      }
    } catch (_) {}
  }
  applyDetachedTheme(initialTheme);
  await loadStandaloneViewShell();
  document.getElementById("browserDetach")?.remove();
  document.getElementById("browserDetachHeader")?.remove();

  const isSiteSnap = initialPartition === "sitesnap";
  if (isSiteSnap) {
    window.isSiteSnapStudioMode = true;
  }

  const tabsHeader = document.querySelector(".tabs-header");
  const headerActions = document.querySelector(".view-header-actions");
  if (tabsHeader && headerActions && !document.getElementById("attachMainBtn") && !document.getElementById("detachedSiteSnapTitle")) {
    if (isSiteSnap) {
      const titleEl = document.createElement("div");
      titleEl.id = "detachedSiteSnapTitle";
      titleEl.className = "detached-sitesnap-title";
      titleEl.textContent = "SiteSnap Studio";
      titleEl.style.cssText = "font-weight: 700; color: #6366f1; margin-right: auto; padding-left: 20px; font-size: 14px; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; height: 100%; font-family: inherit;";
      tabsHeader.insertBefore(titleEl, tabsHeader.firstChild || null);
    } else {
      const attachBtn = document.createElement("button");
      attachBtn.id = "attachMainBtn";
      attachBtn.className = "attach-main-btn";
      attachBtn.type = "button";
      attachBtn.textContent = "Attach to Main Window";
      headerActions.insertBefore(attachBtn, headerActions.firstChild || null);
    }

    const controls = document.createElement("div");
    controls.className = "detached-window-controls";
    controls.innerHTML = `
      <button id="min-btn" class="detached-window-btn" type="button" aria-label="Minimize" title="Minimize">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <button id="max-btn" class="detached-window-btn" type="button" aria-label="Maximize" title="Maximize">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="5" y="5" width="14" height="14" rx="1.5"></rect>
        </svg>
      </button>
      <button id="close-btn" class="detached-window-btn close" type="button" aria-label="Close" title="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    tabsHeader.appendChild(controls);
  }

  const initViewPage = await waitForGlobalFunction("initViewPage", 7000);
  if (typeof initViewPage === "function") {
    initViewPage();
  }

  const openUrl = await waitForGlobalFunction("openUrlFromDashboard", 7000);
  if (typeof openUrl === "function" && initialUrl) {
    openUrl(initialUrl, initialPartition, initialTitle || "Detached Tab", false);
  }

  if (window.api?.onDetachedOpenRequest) {
    window.api.onDetachedOpenRequest((payload = {}) => {
      if (typeof openUrl !== "function") return;
      const nextUrl = String(payload?.url || "").trim();
      if (!nextUrl) return;
      openUrl(
        nextUrl,
        String(payload?.partition || "").trim(),
        String(payload?.title || "Detached Tab").trim() || "Detached Tab",
        false,
      );
    });
  }

  const attachBtn = document.getElementById("attachMainBtn");
  attachBtn?.addEventListener("click", async () => {
    fetch('http://127.0.0.1:9731/api/debug-log?msg=' + encodeURIComponent('[Detached-Shell] Attach button clicked, window.api.attachDetachedViewWindow=' + typeof window.api?.attachDetachedViewWindow)).catch(() => {});
    if (!window.api?.attachDetachedViewWindow) return;
    const tabsList = document.getElementById("tabsList");
    const activeTab = tabsList?.querySelector(".tab.active .tab-title");
    const activeTabEl = tabsList?.querySelector(".tab.active");
    const activeWebview = document.querySelector(
      "#webviews-container .webcontent-pane.active",
    );
    const currentUrl =
      typeof activeWebview?.getURL === "function"
        ? activeWebview.getURL()
        : initialUrl;
    const nextTitle = String(activeTab?.textContent || initialTitle || "Attached Tab");
    fetch('http://127.0.0.1:9731/api/debug-log?msg=' + encodeURIComponent('[Detached-Shell] Calling attachDetachedViewWindow url=' + currentUrl + ', title=' + nextTitle)).catch(() => {});
    const resp = await window.api.attachDetachedViewWindow({
      url: currentUrl,
      title: nextTitle,
      partition: initialPartition,
    });
    fetch('http://127.0.0.1:9731/api/debug-log?msg=' + encodeURIComponent('[Detached-Shell] attachDetachedViewWindow response=' + JSON.stringify(resp))).catch(() => {});

    const allTabs = Array.from(tabsList?.querySelectorAll(".tab") || []);
    if (allTabs.length > 1) {
      const activeTabId = activeTabEl?.getAttribute("data-tab-id");
      if (typeof window.closeTab === "function" && activeTabId) {
        window.closeTab(activeTabId);
      } else {
        const closeBtn = activeTabEl?.querySelector(".close-tab-btn");
        if (closeBtn) {
          closeBtn.click();
        }
      }
    } else {
      window.api?.close?.();
    }
  });

  document.getElementById("min-btn")?.addEventListener("click", () => {
    window.api?.minimize?.();
  });
  document.getElementById("max-btn")?.addEventListener("click", () => {
    window.api?.maximize?.();
  });
  document.getElementById("close-btn")?.addEventListener("click", () => {
    window.api?.close?.();
  });

  const header = document.querySelector(".tabs-header");
  if (header) {
    header.addEventListener("mousedown", (e) => {
      if (
        e.target.closest("button") ||
        e.target.closest("input") ||
        e.target.closest(".tab") ||
        e.target.closest(".detached-window-controls") ||
        e.target.closest(".profile-menu-container") ||
        e.target.closest(".search-bar")
      ) {
        return;
      }
      
      if (e.detail === 2) {
        // Double-click detected! Maximize/Restore the window.
        if (window.api && typeof window.api.maximize === "function") {
          window.api.maximize();
        }
      } else {
        // Single-click detected! Drag the window natively.
        if (window.api && typeof window.api.dragWindow === "function") {
          window.api.dragWindow();
        }
      }
    });

    const updateMaximizedState = () => {
      const isMax = window.screenX < 0 || window.screenY < 0 || window.outerHeight >= window.screen.availHeight - 10;
      document.body.classList.toggle("maximized", isMax);
    };
    window.addEventListener("resize", updateMaximizedState);
    updateMaximizedState();
    // Re-check after layout loads
    setTimeout(updateMaximizedState, 500);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initDetachedShell().catch((error) => {
    console.error("Failed to initialize detached shell", error);
    const titleEl = document.getElementById("detachedWindowTitle");
    if (titleEl) titleEl.textContent = "Could not load detached view";
  });
});

window.addEventListener("storage", (event) => {
  if (event.key !== THEME_STORAGE_KEY) return;
  applyDetachedTheme(event.newValue || "light");
});

// Sync theme on focus - secondary safety net in case a message was missed
window.addEventListener("focus", async () => {
  if (!window.api?.webContentCall) return;
  try {
    const result = await window.api.webContentCall("get-global-theme", {});
    const globalTheme = result?.theme === "dark" ? "dark" : "light";
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    if (globalTheme !== currentTheme) {
      applyDetachedTheme(globalTheme);
      try { localStorage.setItem(THEME_STORAGE_KEY, globalTheme); } catch (_) {}
    }
  } catch (_) {}
});
