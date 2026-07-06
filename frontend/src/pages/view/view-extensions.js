export function createViewExtensionsManager({
  state,
  constants,
  escapeHtml,
  showToast,
  openOverlayModal,
  closeOverlayModal,
  getActiveTab,
  getActiveWebview,
  createTab,
  refreshActiveNativeSettingsPage,
  closeSettingsMenu,
}) {
  const {
    PROFILES,
    PENDING_EXTENSION_OPEN_STORAGE_KEY,
    EXTENSION_PIN_STORAGE_KEY,
  } = constants;

  let downloadsPanelOverlayActive = false;
  let downloadsHighlightTimer = null;
  let downloadsShelfTimer = null;
  let downloadsShelfState = {
    visible: false,
    id: "",
    message: "",
    actionLabel: "",
    action: "",
  };
  let browserExtensionPins = {};
  let browserExtensionPopupState = {
    entryPath: "",
    pageType: "popup",
    host: null,
    overlayActive: false,
  };
  let browserExtensionsMenuOverlayActive = false;

  async function loadBrowserExtensionsFromMain() {
    if (!window.api?.listBrowserExtensions) {
      state.browserExtensionsCache = [];
      return state.browserExtensionsCache;
    }
    const result = await window.api.listBrowserExtensions();
    const rawEntries = Array.isArray(result?.entries) ? result.entries : [];
    
    // Global URL Rewriter: Convert all file:// URLs to oneview-dev:// for storage and bridge consistency
    state.browserExtensionsCache = rawEntries.map(entry => {
      const id = (entry.id || "guest").toLowerCase();
      const scheme = constants.APP_PROTOCOL_SCHEME || "oneview-dev";
      
      const extensionPath = String(entry.path || "").trim().replace(/\\/g, "/").replace(/\/+$/, "");
      const extensionRootUrl = `file:///${extensionPath}`;

      const rewrite = (url) => {
        if (!url || !url.toLowerCase().startsWith("file://")) return url;
        const normalizedUrl = url.replace(/\\/g, "/");
        const decodedUrl = decodeURI(normalizedUrl);
        
        // Try to extract relative path by stripping the file:///C:/path/to/ext prefix
        let relativePath = decodedUrl.replace(extensionRootUrl, "").replace(/^\/+/, "");
        
        // If that didn't work (e.g. encoding mismatch), try matching after the extension folder name
        if (relativePath === decodedUrl) {
          const folderName = extensionPath.split("/").pop();
          const searchPattern = `/${folderName}/`;
          const patternIndex = decodedUrl.indexOf(searchPattern);
          if (patternIndex !== -1) {
            relativePath = decodedUrl.slice(patternIndex + searchPattern.length);
          } else {
            relativePath = "";
          }
        }

        const manifestRoot = entry.manifest?.entrypoints?.root || entry.manifest?.entrypoints?.page || "index.html";
        return `${scheme}://${id}/${relativePath || manifestRoot}`;
      };

      return {
        ...entry,
        rootUrl: rewrite(entry.rootUrl),
        optionsUrl: rewrite(entry.optionsUrl),
        popupUrl: rewrite(entry.popupUrl),
        sidePanelUrl: rewrite(entry.sidePanelUrl),
      };
    });
    return state.browserExtensionsCache;
  }

  async function consumePendingExtensionLaunch() {
    let pendingPath = "";
    try {
      pendingPath = String(
        sessionStorage.getItem(PENDING_EXTENSION_OPEN_STORAGE_KEY) || "",
      ).trim();
    } catch (_error) {
      pendingPath = "";
    }
    if (!pendingPath) return;
    try {
      sessionStorage.removeItem(PENDING_EXTENSION_OPEN_STORAGE_KEY);
    } catch (_error) {}
    const entry = state.browserExtensionsCache.find(
      (item) => item.path === pendingPath,
    );
    if (!entry) return;
    await openExtensionInNewTab(entry.path, "tab");
  }

  function loadBrowserExtensionPins() {
    try {
      const raw = JSON.parse(
        localStorage.getItem(EXTENSION_PIN_STORAGE_KEY) || "{}",
      );
      browserExtensionPins =
        raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    } catch (_error) {
      browserExtensionPins = {};
    }
  }

  function saveBrowserExtensionPins() {
    try {
      localStorage.setItem(
        EXTENSION_PIN_STORAGE_KEY,
        JSON.stringify(browserExtensionPins || {}),
      );
    } catch (_error) {}
  }

  function getPreferredExtensionPartition() {
    return (
      getActiveTab()?.partition ||
      PROFILES[state.currentProfileId]?.partition ||
      PROFILES.guest.partition
    );
  }

  function getActiveTabExtensionSnapshot() {
    const activeTab = getActiveTab();
    const activeWebview = getActiveWebview();
    return {
      url: String(activeWebview?.getURL?.() || activeTab?.url || "").trim(),
      title: String(
        activeWebview?.getTitle?.() || activeTab?.title || "",
      ).trim(),
    };
  }

  function getExtensionInitials(entry = {}) {
    const source = String(entry?.name || entry?.actionTitle || "EX").trim();
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }

  function getExtensionDisplayTitle(entry = {}) {
    return String(entry?.actionTitle || entry?.name || "Extension").trim();
  }

  function buildLocalExtensionAssetUrl(entry = {}, relativePath = "") {
    const rootPath = String(entry?.path || "").trim();
    const assetPath = String(relativePath || "")
      .trim()
      .replace(/\\/g, "/");
    if (!rootPath || !assetPath) return "";
    const normalizedRoot = rootPath.replace(/\\/g, "/").replace(/\/+$/, "");
    const normalizedAsset = assetPath.replace(/^\/+/, "");
    const fullPath = `${normalizedRoot}/${normalizedAsset}`;
    return `file:///${encodeURI(fullPath.replace(/^([A-Za-z]):/, "$1:"))}`;
  }

  function isExtensionPinned(entry = {}) {
    return browserExtensionPins[String(entry?.path || "").trim()] === true;
  }

  function getExtensionTabTarget(entry = {}) {
    const id = (entry?.id || "guest").toLowerCase();
    const manifestRoot = entry?.manifest?.entrypoints?.root || entry?.manifest?.entrypoints?.page || "index.html";
    return `${constants.APP_PROTOCOL_SCHEME}://${id}/${manifestRoot}`;
  }

  function renderExtensionIconMarkup(entry = {}, className = "") {
    const iconUrl = String(
      entry?.actionIconFileUrl ||
        buildLocalExtensionAssetUrl(entry, entry?.actionIconPath || "") ||
        entry?.actionIconUrl ||
        "",
    ).trim();
    const initials = escapeHtml(getExtensionInitials(entry));
    if (iconUrl) {
      return `<img src="${escapeHtml(iconUrl)}" alt="" />`;
    }
    return `<span class="${className}">${initials}</span>`;
  }

  function formatDownloadBytes(bytes = 0) {
    const value = Number(bytes || 0);
    if (value >= 1024 * 1024 * 1024) {
      return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    if (value >= 1024 * 1024) {
      return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (value >= 1024) {
      return `${(value / 1024).toFixed(1)} KB`;
    }
    return `${Math.max(0, Math.round(value))} B`;
  }

  function formatDownloadSpeed(bytesPerSecond = 0) {
    const value = Number(bytesPerSecond || 0);
    if (value <= 0) return "";
    return `${formatDownloadBytes(value)}/s`;
  }

  function formatDownloadEta(seconds = null) {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value < 0) return "";
    if (value < 60) return `${Math.round(value)}s left`;
    const minutes = Math.floor(value / 60);
    const remainingSeconds = Math.round(value % 60);
    return `${minutes}m ${remainingSeconds}s left`;
  }

  function getManagedDownloadById(id = "") {
    return state.managedDownloadsCache.find((entry) => entry.id === id) || null;
  }

  function triggerDownloadsButtonHighlight() {
    const btn = document.getElementById("downloadsManagerBtn");
    if (!btn) return;
    btn.classList.remove("has-download-highlight");
    void btn.offsetWidth;
    btn.classList.add("has-download-highlight");
    if (downloadsHighlightTimer) {
      clearTimeout(downloadsHighlightTimer);
    }
    downloadsHighlightTimer = setTimeout(() => {
      btn.classList.remove("has-download-highlight");
    }, 2300);
  }

  async function loadManagedDownloadsFromMain() {
    if (!window.api?.listManagedDownloads) {
      state.managedDownloadsCache = [];
      return state.managedDownloadsCache;
    }
    const result = await window.api.listManagedDownloads();
    state.managedDownloadsCache = Array.isArray(result?.downloads)
      ? result.downloads
      : [];
    return state.managedDownloadsCache;
  }

  function closeDownloadsManagerPanel() {
    const panel = document.getElementById("downloadsManagerPanel");
    const btn = document.getElementById("downloadsManagerBtn");
    if (panel && !panel.classList.contains("hidden")) {
      if (downloadsPanelOverlayActive) {
        closeOverlayModal(() => panel.classList.add("hidden"));
      } else {
        panel.classList.add("hidden");
      }
    }
    downloadsPanelOverlayActive = false;
    if (btn) btn.classList.remove("is-active");
  }

  function renderDownloadsManagerPanel() {
    const panel = document.getElementById("downloadsManagerPanel");
    const badge = document.getElementById("downloadsManagerBadge");
    if (!panel) return;

    const activeCount = state.managedDownloadsCache.filter(
      (entry) => entry.state === "progressing" || entry.state === "interrupted",
    ).length;
    if (badge) {
      if (activeCount > 0) {
        badge.textContent = String(activeCount);
        badge.classList.remove("hidden");
      } else {
        badge.textContent = "";
        badge.classList.add("hidden");
      }
    }

    panel.innerHTML = `
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${
          state.managedDownloadsCache.length
            ? state.managedDownloadsCache
                .map((entry) => {
                  const fileName = escapeHtml(entry.fileName || "Download");
                  const stateLabelRaw = String(entry.state || "progressing");
                  const progress =
                    typeof entry.progress === "number"
                      ? Math.max(0, Math.min(100, entry.progress))
                      : 0;
                  const totalLabel =
                    entry.totalBytes > 0
                      ? `${formatDownloadBytes(entry.receivedBytes)} / ${formatDownloadBytes(entry.totalBytes)}`
                      : formatDownloadBytes(entry.receivedBytes);
                  const speedLabel = formatDownloadSpeed(entry.bytesPerSecond);
                  const etaLabel = formatDownloadEta(entry.etaSeconds);
                  const stateLabel =
                    stateLabelRaw === "completed"
                      ? "Completed"
                      : stateLabelRaw === "cancelled"
                        ? "Cancelled"
                        : stateLabelRaw === "interrupted"
                          ? "Interrupted"
                          : entry.paused
                            ? "Paused"
                            : `Downloading ${progress}%`;
                  const extraMeta = [speedLabel, etaLabel]
                    .filter(Boolean)
                    .join(" • ");
                  return `
                    <div class="downloads-manager-item">
                      <strong>${fileName}</strong>
                      <div class="downloads-manager-meta">${escapeHtml(stateLabel)} • ${escapeHtml(totalLabel)}</div>
                      ${
                        extraMeta
                          ? `<div class="downloads-manager-meta">${escapeHtml(extraMeta)}</div>`
                          : ""
                      }
                      <div class="downloads-manager-progress">
                        <span style="width:${progress}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${
                          stateLabelRaw === "progressing"
                            ? entry.paused
                              ? `<button type="button" data-download-id="${escapeHtml(entry.id)}" data-download-action="resume">Resume</button>`
                              : `<button type="button" data-download-id="${escapeHtml(entry.id)}" data-download-action="pause">Pause</button>`
                            : ""
                        }
                        ${
                          stateLabelRaw === "progressing" ||
                          stateLabelRaw === "interrupted"
                            ? `<button type="button" data-download-id="${escapeHtml(entry.id)}" data-download-action="cancel">Cancel</button>`
                            : ""
                        }
                        ${
                          stateLabelRaw === "interrupted" ||
                          stateLabelRaw === "cancelled"
                            ? `<button type="button" data-download-id="${escapeHtml(entry.id)}" data-download-action="retry">Retry</button>`
                            : ""
                        }
                        ${
                          entry.savePath
                            ? `<button type="button" data-download-id="${escapeHtml(entry.id)}" data-download-action="show">Show in Folder</button>`
                            : ""
                        }
                        ${
                          stateLabelRaw === "completed" && entry.existsOnDisk
                            ? `<button type="button" data-download-id="${escapeHtml(entry.id)}" data-download-action="open">Open</button>`
                            : ""
                        }
                        <button type="button" data-download-id="${escapeHtml(entry.id)}" data-download-action="remove">Remove</button>
                      </div>
                    </div>
                  `;
                })
                .join("")
            : '<div class="downloads-manager-empty">No downloads yet.</div>'
        }
      </div>
    `;
  }

  async function toggleDownloadsManagerPanel(forceOpen = null) {
    const panel = document.getElementById("downloadsManagerPanel");
    const btn = document.getElementById("downloadsManagerBtn");
    if (!panel || !btn) return;
    const shouldOpen =
      forceOpen === null
        ? panel.classList.contains("hidden")
        : Boolean(forceOpen);
    if (!shouldOpen) {
      closeDownloadsManagerPanel();
      return;
    }
    closeBrowserExtensionsMenu();
    renderDownloadsManagerPanel();
    try {
      await openOverlayModal(() => panel.classList.remove("hidden"), {
        captureSnapshots: false,
      });
      downloadsPanelOverlayActive = true;
    } catch (_error) {
      panel.classList.remove("hidden");
      downloadsPanelOverlayActive = false;
    }
    btn.classList.add("is-active");
  }

  function renderDownloadsShelf() {
    let shelf = document.getElementById("downloadsShelf");
    if (!shelf) {
      shelf = document.createElement("div");
      shelf.id = "downloadsShelf";
      shelf.className = "downloads-shelf hidden";
      shelf.innerHTML = `
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `;
      document.body.appendChild(shelf);
      shelf
        .querySelector("#downloadsShelfClose")
        ?.addEventListener("click", () => {
          downloadsShelfState.visible = false;
          renderDownloadsShelf();
        });
      shelf
        .querySelector("#downloadsShelfAction")
        ?.addEventListener("click", async () => {
          const current = getManagedDownloadById(downloadsShelfState.id);
          if (
            !current ||
            !downloadsShelfState.action ||
            !window.api?.runManagedDownloadAction
          ) {
            return;
          }
          await window.api.runManagedDownloadAction({
            id: current.id,
            action: downloadsShelfState.action,
          });
        });
    }

    const title = shelf.querySelector("#downloadsShelfTitle");
    const message = shelf.querySelector("#downloadsShelfMessage");
    const actionButton = shelf.querySelector("#downloadsShelfAction");
    if (!downloadsShelfState.visible) {
      shelf.classList.add("hidden");
      return;
    }
    if (title) title.textContent = "Downloads";
    if (message) message.textContent = downloadsShelfState.message || "";
    if (actionButton) {
      actionButton.textContent = downloadsShelfState.actionLabel || "Open";
      actionButton.style.display = downloadsShelfState.action ? "" : "none";
    }
    shelf.classList.remove("hidden");
  }

  function showDownloadsShelf(entry = {}, reason = "updated") {
    const fileName = String(entry.fileName || "Download").trim() || "Download";
    if (reason === "created") {
      downloadsShelfState = {
        visible: true,
        id: String(entry.id || ""),
        message: `${fileName} started downloading`,
        actionLabel: "Show",
        action: "show",
      };
    } else if (reason === "completed") {
      downloadsShelfState = {
        visible: true,
        id: String(entry.id || ""),
        message: `${fileName} downloaded`,
        actionLabel: "Open",
        action: "open",
      };
    } else if (reason === "interrupted") {
      downloadsShelfState = {
        visible: true,
        id: String(entry.id || ""),
        message: `${fileName} was interrupted`,
        actionLabel: "Retry",
        action: "retry",
      };
    } else {
      return;
    }
    renderDownloadsShelf();
    if (downloadsShelfTimer) clearTimeout(downloadsShelfTimer);
    downloadsShelfTimer = setTimeout(() => {
      downloadsShelfState.visible = false;
      renderDownloadsShelf();
    }, 5000);
  }

  function closeBrowserExtensionsMenu() {
    const menu = document.getElementById("browserExtensionsMenu");
    const btn = document.getElementById("browserExtensionsMenuBtn");
    if (menu && !menu.classList.contains("hidden")) {
      if (browserExtensionsMenuOverlayActive) {
        closeOverlayModal(() => menu.classList.add("hidden"));
      } else {
        menu.classList.add("hidden");
      }
    }
    browserExtensionsMenuOverlayActive = false;
    if (btn) btn.classList.remove("is-active");
  }

  async function toggleBrowserExtensionsMenu(forceOpen = null) {
    const menu = document.getElementById("browserExtensionsMenu");
    const btn = document.getElementById("browserExtensionsMenuBtn");
    if (!menu || !btn) return;
    const shouldOpen =
      forceOpen === null
        ? menu.classList.contains("hidden")
        : Boolean(forceOpen);
    if (!shouldOpen) {
      closeBrowserExtensionsMenu();
      return;
    }
    closeBrowserExtensionPopup().catch(() => {});
    renderBrowserExtensionsMenu();
    try {
      await openOverlayModal(() => menu.classList.remove("hidden"), {
        captureSnapshots: false,
      });
      browserExtensionsMenuOverlayActive = true;
    } catch (error) {
      console.error("Failed to open extensions menu overlay", error);
      menu.classList.remove("hidden");
      browserExtensionsMenuOverlayActive = false;
    }
    btn.classList.add("is-active");
  }

  async function openExtensionInNewTab(entryPath, preferredPageType = "tab") {
    const entry = state.browserExtensionsCache.find(
      (item) => item.path === entryPath,
    );
    if (!entry) return;
    const id = (entry?.id || "guest").toLowerCase();
    let pageUrl = "";

    if (preferredPageType === "options" && entry.optionsUrl) {
      const optionsFile = entry.manifest?.entrypoints?.options || "options.html";
      pageUrl = `${constants.APP_PROTOCOL_SCHEME}://${id}/${optionsFile}`;
    } else if (preferredPageType === "root" && entry.rootUrl) {
      const rootFile = entry.manifest?.entrypoints?.root || "result.html";
      pageUrl = `${constants.APP_PROTOCOL_SCHEME}://${id}/${rootFile}`;
    } else {
      pageUrl = getExtensionTabTarget(entry);
    }

    if (!pageUrl) {
      showToast("This extension does not expose an openable page yet.", "info");
      return;
    }

    const extensionPartition = `ext-${entry.id || "guest"}`;
    createTab(
      pageUrl,
      extensionPartition,
      `${entry.name || "Extension"}${preferredPageType === "options" ? " Options" : ""}`,
      null,
      {
        extensionEntryPath: entry.path,
        extensionActiveContext: getActiveTabExtensionSnapshot(),
      },
    );
  }

  async function closeBrowserExtensionPopup() {
    if (window.api?.closeBrowserExtensionPopup) {
      try {
        await window.api.closeBrowserExtensionPopup();
      } catch (_error) {}
    }
    browserExtensionPopupState = {
      entryPath: "",
      pageType: "popup",
      host: null,
      overlayActive: false,
    };
    document
      .querySelectorAll(".browser-extension-action-btn")
      .forEach((btn) => btn.classList.remove("is-active"));
  }

  function updateBrowserExtensionPopupHeader(entry = {}) {
    const title = document.getElementById("browserExtensionPopupTitle");
    const subtitle = document.getElementById("browserExtensionPopupSubtitle");
    const icon = document.getElementById("browserExtensionPopupIcon");
    if (title) title.textContent = getExtensionDisplayTitle(entry);
    if (subtitle) {
      subtitle.textContent = entry?.popupUrl
        ? "Popup"
        : entry?.optionsUrl
          ? "Extension page"
          : entry?.rootUrl
            ? "Extension"
            : "";
    }
    if (icon) {
      icon.innerHTML = renderExtensionIconMarkup(
        entry,
        "browser-extension-popup-fallback",
      );
    }
  }

  function getElementWindowAnchorRect(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") {
      return { left: 0, top: 0, bottom: 0, width: 0, height: 0 };
    }
    const rect = element.getBoundingClientRect();
    return {
      left: Number(rect.left || 0),
      top: Number(rect.top || 0),
      bottom: Number(rect.bottom || 0),
      width: Number(rect.width || 0),
      height: Number(rect.height || 0),
    };
  }

  async function openBrowserExtensionPopup(entryPath, anchorElement = null) {
    const entry = state.browserExtensionsCache.find(
      (item) => item.path === entryPath,
    );
    if (!entry) return;
    const popupUrl =
      String(entry.popupUrl || "").trim() ||
      String(entry.optionsUrl || "").trim();
    if (!popupUrl) {
      await openExtensionInNewTab(entryPath, "tab");
      return;
    }

    if (browserExtensionPopupState.entryPath === entryPath) {
      await closeBrowserExtensionPopup();
      return;
    }

    await closeBrowserExtensionPopup();
    closeBrowserExtensionsMenu();

    const popupApi = window.api?.openBrowserExtensionPopup;
    if (typeof popupApi !== "function") {
      throw new Error("Extension popup API is unavailable");
    }

    const activeContext = getActiveTabExtensionSnapshot();
    const extensionPartition = `ext-${entry.id || "guest"}`;
    const result = await popupApi({
      url: popupUrl,
      entryPath,
      partition: extensionPartition,
      anchor: getElementWindowAnchorRect(anchorElement),
      activeUrl: activeContext.url || "",
      activeTitle: activeContext.title || "",
    });
    if (!result?.success) {
      throw new Error(result?.message || "Could not open extension popup");
    }

    updateBrowserExtensionPopupHeader(entry);
    browserExtensionPopupState = {
      entryPath,
      pageType: "popup",
      host: null,
      overlayActive: false,
    };
    const safePathSelector =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(entryPath)
        : entryPath.replace(/["\\]/g, "\\$&");
    document
      .querySelectorAll(
        `.browser-extension-action-btn[data-path="${safePathSelector}"]`,
      )
      .forEach((btn) => btn.classList.add("is-active"));
  }

  function renderBrowserExtensionsToolbar() {
    const pinnedContainer = document.getElementById("browserExtensionsPinned");
    if (!pinnedContainer) return;
    const isSiteSnapMode = window.isSiteSnapStudioMode || window.parent?.isSiteSnapStudioMode;
    const actionable = state.browserExtensionsCache.filter((entry) => {
      const isSiteSnap = entry.id === "sitesnap-studio" || String(entry.name || "").toLowerCase().includes("sitesnap") || String(entry.id || "").toLowerCase().includes("sitesnap");
      if (isSiteSnapMode) {
        return entry.enabled !== false && isSiteSnap;
      } else {
        return entry.enabled !== false && !isSiteSnap;
      }
    });
    // In SiteSnap mode: always show all SiteSnap extensions as pinned (auto-pinned).
    // In normal mode: respect the user's pin preferences.
    const pinned = isSiteSnapMode ? actionable : actionable.filter((entry) => isExtensionPinned(entry));

    if (!pinned.length) {
      pinnedContainer.innerHTML = "";
      pinnedContainer.classList.add("hidden");
      return;
    }

    pinnedContainer.classList.remove("hidden");
    pinnedContainer.innerHTML = pinned
      .map(
        (entry) => `
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${escapeHtml(entry.path || "")}"
            title="${escapeHtml(getExtensionDisplayTitle(entry))}"
            aria-label="${escapeHtml(getExtensionDisplayTitle(entry))}"
          >
            ${renderExtensionIconMarkup(entry, "browser-extension-action-fallback")}
          </button>
        `,
      )
      .join("");
  }

  function renderBrowserExtensionsMenu() {
    const menu = document.getElementById("browserExtensionsMenu");
    if (!menu) return;

    const isSiteSnapMode = window.isSiteSnapStudioMode || window.parent?.isSiteSnapStudioMode;
    const actionable = state.browserExtensionsCache.filter((entry) => {
      const isSiteSnap = entry.id === "sitesnap-studio" || String(entry.name || "").toLowerCase().includes("sitesnap") || String(entry.id || "").toLowerCase().includes("sitesnap");
      if (isSiteSnapMode) {
        return entry.enabled !== false && isSiteSnap;
      } else {
        return entry.enabled !== false && !isSiteSnap;
      }
    });
    menu.innerHTML = `
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${
          actionable.length
            ? actionable
                .map((entry) => {
                  const entryPath = escapeHtml(entry.path || "");
                  const displayTitle = escapeHtml(
                    getExtensionDisplayTitle(entry),
                  );
                  const subline = escapeHtml(
                    entry.version
                      ? `v${entry.version}${entry.id ? ` • ${entry.id}` : ""}`
                      : entry.id || entry.name || "",
                  );
                  return `
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${renderExtensionIconMarkup(entry, "browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${displayTitle}</strong>
                          <p>${subline}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${entryPath}"
                          title="${isExtensionPinned(entry) ? "Unpin" : "Pin"}"
                          aria-label="${isExtensionPinned(entry) ? "Unpin" : "Pin"}"
                        >
                          ${isExtensionPinned(entry) ? "Unpin" : "Pin"}
                        </button>
                      </div>
                      <div class="browser-extension-menu-actions">
                        <button type="button" data-menu-action="popup" data-path="${entryPath}">
                          ${entry.popupUrl ? "Open Popup" : "Open"}
                        </button>
                        ${
                          entry.optionsUrl
                            ? `<button type="button" data-menu-action="options" data-path="${entryPath}">Options</button>`
                            : ""
                        }
                        ${
                          entry.rootUrl
                            ? `<button type="button" data-menu-action="tab" data-path="${entryPath}">Open in Tab</button>`
                            : ""
                        }
                      </div>
                    </div>
                  `;
                })
                .join("")
            : '<div class="browser-extensions-empty">No enabled extensions yet.</div>'
        }
      </div>
    `;
  }

  function refreshBrowserExtensionsUi() {
    renderBrowserExtensionsToolbar();
    renderBrowserExtensionsMenu();
  }

  function renderExtensionsManagerList() {
    const list = document.getElementById("extensionsManagerList");
    if (!list) return;

    const isSiteSnapMode = window.isSiteSnapStudioMode || window.parent?.isSiteSnapStudioMode;
    const filteredCache = state.browserExtensionsCache.filter((entry) => {
      const isSiteSnap = entry.id === "sitesnap-studio" || String(entry.name || "").toLowerCase().includes("sitesnap") || String(entry.id || "").toLowerCase().includes("sitesnap");
      if (isSiteSnapMode) {
        return isSiteSnap;
      } else {
        return !isSiteSnap;
      }
    });

    if (!filteredCache.length) {
      list.innerHTML = `
        <div class="extensions-empty-state">
          No unpacked extensions added yet.
        </div>
      `;
      return;
    }

    list.innerHTML = filteredCache
      .map((entry) => {
        const escapedPath = escapeHtml(entry.path || "");
        return `
          <div class="extension-item ${entry.enabled === false ? "is-disabled" : ""}">
            <div class="extension-main">
              <div class="extension-title-row">
                <h4>${escapeHtml(entry.name || "Unnamed Extension")}</h4>
                <span class="extension-badge ${entry.customBridge ? "custom" : "normal"}">
                  ${entry.customBridge ? "OneView" : "Legacy"}
                </span>
                ${entry.enabled === false ? '<span class="extension-status-pill">Disabled</span>' : ""}
              </div>
              <div class="extension-meta-row">
                ${entry.version ? `<span>v${escapeHtml(entry.version)}</span>` : ""}
                ${entry.id ? `<span>${escapeHtml(entry.id)}</span>` : ""}
              </div>
              ${constants.IS_DEV_APP_BUILD ? `<div class="extension-path">${escapedPath}</div>` : ""}
              ${entry.loadError ? `<div class="extension-error">${escapeHtml(entry.loadError)}</div>` : ""}
            </div>
            <div class="extension-actions">
              ${
                entry.popupUrl
                  ? `<button type="button" class="extension-action-btn" data-action="open-popup" data-path="${escapedPath}">Popup</button>`
                  : ""
              }
              ${
                (entry.rootUrl || entry.linkUrl)
                  ? `<button type="button" class="extension-action-btn" data-action="open-tab" data-path="${escapedPath}">Open Tab</button>`
                  : ""
              }
              ${
                entry.optionsUrl
                  ? `<button type="button" class="extension-action-btn" data-action="open-options" data-path="${escapedPath}">Options</button>`
                  : ""
              }
              <button type="button" class="extension-action-btn" data-action="reload" data-path="${escapedPath}">
                Reload
              </button>
              <button type="button" class="extension-action-btn" data-action="toggle" data-path="${escapedPath}">
                ${entry.enabled === false ? "Enable" : "Disable"}
              </button>
              ${
                constants.IS_DEV_APP_BUILD
                  ? `<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${escapedPath}">Remove</button>`
                  : ""
              }
            </div>
          </div>
        `;
      })
      .join("");
  }

  async function refreshExtensionsManagerList() {
    try {
      await loadBrowserExtensionsFromMain();
    } catch (error) {
      console.error("Failed to refresh browser extensions list", error);
    }
    renderExtensionsManagerList();
    refreshBrowserExtensionsUi();
  }

  async function openExtensionPageForEntry(entryPath, pageType) {
    const entry = state.browserExtensionsCache.find(
      (item) => item.path === entryPath,
    );
    if (!entry) return;
    const targetUrl =
      pageType === "options"
        ? entry.optionsUrl
        : pageType === "root"
          ? entry.rootUrl
          : getExtensionTabTarget(entry);
    if (!targetUrl) {
      showToast(`This extension does not expose a ${pageType} page.`, "info");
      return;
    }

    createTab(
      targetUrl,
      getPreferredExtensionPartition(),
      `${entry.name || "Extension"} ${pageType === "options" ? "Options" : "Popup"}`,
      null,
      {
        extensionEntryPath: entry.path,
        extensionActiveContext: getActiveTabExtensionSnapshot(),
      },
    );
  }

  async function openExtensionsManagerModal() {
    const modal = document.getElementById("extensionsManagerModal");
    if (!modal) return;
    closeBrowserExtensionsMenu();
    await closeBrowserExtensionPopup();
    renderExtensionsManagerList();
    refreshBrowserExtensionsUi();
    try {
      await openOverlayModal(() => modal.classList.remove("hidden"));
    } catch (error) {
      console.error("openOverlayModal failed for extensions manager", error);
      modal.classList.remove("hidden");
    }
    refreshExtensionsManagerList().catch((error) => {
      console.error("Failed to refresh extensions manager after open", error);
    });
  }

  function closeExtensionsManagerModal() {
    const modal = document.getElementById("extensionsManagerModal");
    if (!modal) return;
    closeOverlayModal(() => modal.classList.add("hidden"));
  }

  function initExtensionsManager() {
    const openBtn = document.getElementById("extensionsBtn");
    const settingsBtn = document.getElementById("settingsBtn");
    const closeBtn = document.getElementById("extensionsModalCloseBtn");
    const addBtn = document.getElementById("extensionsLoadBtn");
    const list = document.getElementById("extensionsManagerList");
    const toolbarPinned = document.getElementById("browserExtensionsPinned");
    const menuBtn = document.getElementById("browserExtensionsMenuBtn");
    const menu = document.getElementById("browserExtensionsMenu");
    const downloadsBtn = document.getElementById("downloadsManagerBtn");
    const downloadsPanel = document.getElementById("downloadsManagerPanel");
    const popupCloseBtn = document.getElementById("browserExtensionPopupClose");
    const popupOpenTabBtn = document.getElementById(
      "browserExtensionPopupOpenTab",
    );

    loadBrowserExtensionPins();
    renderExtensionsManagerList();
    refreshBrowserExtensionsUi();
    refreshExtensionsManagerList().catch((error) => {
      console.error("Failed to refresh extensions manager after open", error);
    });
    loadBrowserExtensionsFromMain()
      .then(() => {
        consumePendingExtensionLaunch();
        if (window.api?.prewarmBrowserExtensionPopup) {
          const actionable = state.browserExtensionsCache.filter((e) => e.enabled !== false);
          const pinned = actionable.filter((e) => isExtensionPinned(e));
          let prewarmPayload = { partition: getPreferredExtensionPartition() };
          if (pinned.length > 0) {
            const entry = pinned[0];
            const popupUrl = String(entry.popupUrl || "").trim() || String(entry.optionsUrl || "").trim();
            if (popupUrl) {
              prewarmPayload = { ...prewarmPayload, url: popupUrl, entryPath: entry.path };
            }
          }
          window.api.prewarmBrowserExtensionPopup(prewarmPayload).catch(() => {});
        }
      })
      .catch(() => {});

    if (window.api?.onBrowserExtensionPopupState) {
      window.api.onBrowserExtensionPopupState((payload) => {
        const { entryPath, open } = payload || {};
        if (open) {
          browserExtensionPopupState = {
            entryPath,
            pageType: "popup",
            host: null,
            overlayActive: false,
          };
          const safePathSelector =
            typeof CSS !== "undefined" && typeof CSS.escape === "function"
              ? CSS.escape(entryPath)
              : entryPath.replace(/["\\]/g, "\\$&");
          document
            .querySelectorAll(
              `.browser-extension-action-btn[data-path="${safePathSelector}"]`,
            )
            .forEach((btn) => btn.classList.add("is-active"));
        } else {
          // Only clear if the closed extension matches what we think is open
          if (browserExtensionPopupState.entryPath === entryPath) {
            browserExtensionPopupState = {
              entryPath: "",
              pageType: "popup",
              host: null,
              overlayActive: false,
            };
            document
              .querySelectorAll(".browser-extension-action-btn")
              .forEach((btn) => btn.classList.remove("is-active"));
          }
        }
      });
    }

    if (openBtn && openBtn.dataset.boundClick !== "1") {
      openBtn.dataset.boundClick = "1";
      openBtn.addEventListener("click", () => {
        openExtensionsManagerModal().catch((error) => {
          console.error("Failed to open extensions manager", error);
          showToast("Could not open extensions manager.", "error");
        });
      });
    }

    if (closeBtn && closeBtn.dataset.boundClick !== "1") {
      closeBtn.dataset.boundClick = "1";
      closeBtn.addEventListener("click", closeExtensionsManagerModal);
    }

    if (addBtn && addBtn.dataset.boundClick !== "1") {
      addBtn.dataset.boundClick = "1";
      addBtn.addEventListener("click", async () => {
        try {
          if (!window.api?.addBrowserExtensionsUnpacked) {
            showToast("Extension manager API is unavailable.", "error");
            return;
          }
          const result = await window.api.addBrowserExtensionsUnpacked();
          state.browserExtensionsCache = Array.isArray(result?.entries)
            ? result.entries
            : [];
          renderExtensionsManagerList();
          refreshBrowserExtensionsUi();
          showToast("Unpacked extensions loaded.", "success");
        } catch (error) {
          console.error("Failed to load unpacked extensions", error);
          showToast(
            error?.message || "Could not load unpacked extensions.",
            "error",
          );
        }
      });
    }

    if (list && list.dataset.boundClick !== "1") {
      list.dataset.boundClick = "1";
      list.addEventListener("click", async (event) => {
        const actionButton = event.target.closest("[data-action]");
        if (!actionButton) return;
        const action = String(actionButton.dataset.action || "").trim();
        const entryPath = String(actionButton.dataset.path || "").trim();
        if (!entryPath) return;

        try {
          if (action === "open-popup") {
            await openExtensionPageForEntry(entryPath, "popup");
            return;
          }
          if (action === "open-tab") {
            await openExtensionPageForEntry(entryPath, "tab");
            return;
          }
          if (action === "open-options") {
            await openExtensionPageForEntry(entryPath, "options");
            return;
          }
          if (action === "reload" && window.api?.reloadBrowserExtension) {
            const result = await window.api.reloadBrowserExtension({
              path: entryPath,
            });
            state.browserExtensionsCache = Array.isArray(result?.entries)
              ? result.entries
              : state.browserExtensionsCache;
            renderExtensionsManagerList();
            refreshBrowserExtensionsUi();
            showToast("Extension reloaded.", "success");
            return;
          }
          if (action === "toggle" && window.api?.toggleBrowserExtension) {
            const entry = state.browserExtensionsCache.find(
              (item) => item.path === entryPath,
            );
            if (entry?.enabled !== false && typeof window.api?.closeBrowserExtensionPopup === "function") {
               await window.api.closeBrowserExtensionPopup();
            }
            const result = await window.api.toggleBrowserExtension({
              path: entryPath,
              enabled: entry?.enabled === false,
            });
            state.browserExtensionsCache = Array.isArray(result?.entries)
              ? result.entries
              : state.browserExtensionsCache;
            renderExtensionsManagerList();
            refreshBrowserExtensionsUi();
            showToast("Extension state updated.", "success");
            return;
          }
          if (action === "remove" && window.api?.removeBrowserExtension) {
            if (typeof window.api?.closeBrowserExtensionPopup === "function") {
               await window.api.closeBrowserExtensionPopup();
            }
            const result = await window.api.removeBrowserExtension({
              path: entryPath,
            });
            state.browserExtensionsCache = Array.isArray(result?.entries)
              ? result.entries
              : state.browserExtensionsCache;
            renderExtensionsManagerList();
            refreshBrowserExtensionsUi();
            showToast("Extension removed.", "success");
          }
        } catch (error) {
          console.error("Extension manager action failed", error);
          showToast(
            error?.message || "Could not complete extension action.",
            "error",
          );
        }
      });
    }

    if (toolbarPinned && toolbarPinned.dataset.boundClick !== "1") {
      toolbarPinned.dataset.boundClick = "1";
      toolbarPinned.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-path]");
        if (!button) return;
        const entryPath = String(button.dataset.path || "").trim();
        if (!entryPath) return;
        try {
          await openBrowserExtensionPopup(entryPath, button);
        } catch (error) {
          console.error("Failed to open extension popup", error);
          showToast(
            error?.message || "Could not open extension popup.",
            "error",
          );
        }
      });
    }

    if (menuBtn && menuBtn.dataset.boundClick !== "1") {
      menuBtn.dataset.boundClick = "1";
      menuBtn.addEventListener("click", () => {
        toggleBrowserExtensionsMenu().catch((error) => {
          console.error("Failed to toggle extensions menu", error);
          showToast("Could not open extensions menu.", "error");
        });
      });
    }

    if (menu && menu.dataset.boundClick !== "1") {
      menu.dataset.boundClick = "1";
      menu.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-menu-action]");
        if (!button) return;
        const action = String(button.dataset.menuAction || "").trim();
        const entryPath = String(button.dataset.path || "").trim();
        try {
          if (action === "manage") {
            closeBrowserExtensionsMenu();
            await openExtensionsManagerModal();
            return;
          }
          if (!entryPath) return;
          if (action === "pin") {
            const nextValue = !browserExtensionPins[entryPath];
            browserExtensionPins[entryPath] = nextValue;
            saveBrowserExtensionPins();
            refreshBrowserExtensionsUi();
            return;
          }
          if (action === "popup") {
            await openBrowserExtensionPopup(entryPath, menuBtn || button);
            return;
          }
          if (action === "options") {
            closeBrowserExtensionsMenu();
            await openExtensionInNewTab(entryPath, "options");
            return;
          }
          if (action === "tab") {
            closeBrowserExtensionsMenu();
            await openExtensionInNewTab(entryPath, "tab");
          }
        } catch (error) {
          console.error("Extension menu action failed", error);
          showToast(
            error?.message || "Could not complete extension action.",
            "error",
          );
        }
      });
    }

    if (popupCloseBtn && popupCloseBtn.dataset.boundClick !== "1") {
      popupCloseBtn.dataset.boundClick = "1";
      popupCloseBtn.addEventListener("click", () => {
        closeBrowserExtensionPopup().catch(() => {});
      });
    }

    if (popupOpenTabBtn && popupOpenTabBtn.dataset.boundClick !== "1") {
      popupOpenTabBtn.dataset.boundClick = "1";
      popupOpenTabBtn.addEventListener("click", async () => {
        if (!browserExtensionPopupState.entryPath) return;
        await openExtensionInNewTab(
          browserExtensionPopupState.entryPath,
          "tab",
        );
        await closeBrowserExtensionPopup();
      });
    }

    if (
      document.body &&
      document.body.dataset.boundExtensionUiDismiss !== "1"
    ) {
      document.body.dataset.boundExtensionUiDismiss = "1";
      document.addEventListener("click", (event) => {
        const target = event.target;
        if (settingsBtn && !settingsBtn.contains(target)) {
          closeSettingsMenu();
        }
        if (
          menu &&
          !menu.classList.contains("hidden") &&
          !menu.contains(target) &&
          !menuBtn?.contains(target) &&
          !openBtn?.contains(target)
        ) {
          closeBrowserExtensionsMenu();
        }
        if (
          downloadsPanel &&
          !downloadsPanel.classList.contains("hidden") &&
          !downloadsPanel.contains(target) &&
          !downloadsBtn?.contains(target)
        ) {
          closeDownloadsManagerPanel();
        }
        if (
          !target.closest(".browser-extension-action-btn") &&
          !menu?.contains(target)
        ) {
          closeBrowserExtensionPopup().catch(() => {});
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeSettingsMenu();
          closeBrowserExtensionsMenu();
          closeDownloadsManagerPanel();
          closeBrowserExtensionPopup().catch(() => {});
        }
      });
    }
  }

  function initDownloadsManager() {
    const btn = document.getElementById("downloadsManagerBtn");
    const panel = document.getElementById("downloadsManagerPanel");
    if (btn && btn.dataset.boundClick !== "1") {
      btn.dataset.boundClick = "1";
      btn.addEventListener("click", () => {
        toggleDownloadsManagerPanel().catch(() => {});
      });
    }

    if (panel && panel.dataset.boundClick !== "1") {
      panel.dataset.boundClick = "1";
      panel.addEventListener("click", async (event) => {
        const actionButton = event.target.closest("[data-download-action]");
        if (!actionButton) return;
        const action = String(actionButton.dataset.downloadAction || "").trim();
        const id = String(actionButton.dataset.downloadId || "").trim();
        if (!action) return;
        try {
          if (!window.api?.runManagedDownloadAction) return;
          const result = await window.api.runManagedDownloadAction({
            id,
            action,
          });
          if (Array.isArray(result?.downloads)) {
            state.managedDownloadsCache = result.downloads;
          } else if (action === "remove" || action === "clear-completed") {
            await loadManagedDownloadsFromMain();
          }
          renderDownloadsManagerPanel();
        } catch (error) {
          showToast(
            error?.message || "Could not complete download action.",
            "error",
          );
        }
      });
    }

    loadManagedDownloadsFromMain()
      .then(() => {
        renderDownloadsManagerPanel();
      })
      .catch(() => {});

    if (
      window.api &&
      typeof window.api.onDownloadManagerUpdated === "function" &&
      document.body?.dataset.boundDownloadManagerEvents !== "1"
    ) {
      document.body.dataset.boundDownloadManagerEvents = "1";
      window.api.onDownloadManagerUpdated((payload) => {
        state.managedDownloadsCache = Array.isArray(payload?.downloads)
          ? payload.downloads
          : [];
        renderDownloadsManagerPanel();
        refreshActiveNativeSettingsPage().catch(() => {});
        if (
          payload?.reason === "created" ||
          payload?.reason === "completed" ||
          payload?.reason === "interrupted"
        ) {
          triggerDownloadsButtonHighlight();
        }
        const focusedEntry = getManagedDownloadById(
          String(payload?.focusId || "").trim(),
        );
        if (focusedEntry) {
          showDownloadsShelf(
            focusedEntry,
            String(payload?.reason || "updated"),
          );
        }
      });
    }
  }

  return {
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
  };
}

