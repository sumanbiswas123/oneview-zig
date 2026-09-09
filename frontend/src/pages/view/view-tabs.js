import { createWebContentHostElement } from "../../lib/webcontent-client.js";
import { normalizeAppPartitionName } from "../../lib/app-env.js";

export function createViewTabsManager({
  state,
  constants,
  createNativePageDescriptor,
  ensureNativeSettingsGeneralInfo,
  normalizeSettingsSection,
  renderNativeSettingsPage,
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
}) {
  const {
    PARTITIONS,
    PROFILES,
    LOCAL_WEB_APP_TYPES,
    WEBVIEW_POOL_MAX = 6,
    // Increased from 12000ms to 60000ms - executing JS on background webviews every 12s
    // was causing significant CPU churn by preventing Chromium from idling renderer processes.
    WEBVIEW_POOL_KEEPALIVE_MS = 60_000,
    TAB_PREWARM_ENABLED = false,
    PREWARM_ALL_PROFILE_PARTITIONS = false,
    IS_DEV_APP_BUILD,
  } = constants;

  const webviewPool = [];
  let webviewPoolKeepaliveTimer = null;
  const pendingWebviewCreations = new Map();

  const getTabs = () => state.tabs;
  const setTabs = (value) => {
    state.tabs = value;
  };
  const getActiveTabId = () => state.activeTabId;
  const setActiveTabId = (value) => {
    state.activeTabId = value;
  };
  const getCurrentProfileId = () => state.currentProfileId;

  function updateBrowserControlsOverlay(tab) {
    const overlay = document.querySelector(".browser-controls-overlay");
    if (!overlay) return;
    const isExt = tab && (
      (tab.url && (tab.url.includes("result.html") || tab.url.includes("extension-icon") || tab.url.toLowerCase().includes("result"))) ||
      (tab.title && tab.title.includes("Result"))
    );
    if (isExt && tab) {
      tab.hideBrowserControls = false;
    }
    const shouldHide = Boolean(
      ((tab && !tab.isHome && tab.hideBrowserControls) || tab?.nativePage) && !isExt,
    );
    overlay.classList.toggle("hidden", shouldHide);
    if (isExt) {
      overlay.classList.remove("hidden");
      overlay.style.setProperty("display", "flex", "important");
      overlay.style.setProperty("visibility", "visible", "important");
      overlay.style.setProperty("opacity", "1", "important");
      overlay.style.setProperty("height", "40px", "important");
    } else {
      overlay.style.removeProperty("display");
      overlay.style.removeProperty("visibility");
      overlay.style.removeProperty("opacity");
      overlay.style.removeProperty("height");
    }
  }

  function updateDetachButtonVisibility(tab) {
    const detachBtn = document.getElementById("browserDetachHeader");
    if (!detachBtn) return;
    const isExt = tab && (
      (tab.url && (tab.url.includes("result.html") || tab.url.includes("extension-icon") || tab.url.toLowerCase().includes("result"))) ||
      (tab.title && tab.title.includes("Result"))
    );
    const shouldHide =
      (!tab ||
      tab.isHome ||
      Boolean(tab.hideBrowserControls) ||
      Boolean(tab.nativePage)) && !isExt;
    detachBtn.classList.toggle("hidden", shouldHide);
  }

  function updateProfileSectionVisibility(tab) {
    const profileSection = document.querySelector(".profile-section");
    if (!profileSection) return;
    const isExt = tab && (
      (tab.url && (tab.url.includes("result.html") || tab.url.includes("extension-icon") || tab.url.toLowerCase().includes("result"))) ||
      (tab.title && tab.title.includes("Result"))
    );
    const shouldHide = Boolean(
      ((tab && !tab.isHome && tab.hideBrowserControls) || tab?.nativePage) && !isExt,
    );
    profileSection.classList.toggle("hidden", shouldHide);
  }

  function updateTabTitle(id, title) {
    const tab = getTabs().find((item) => item.id === id);
    if (!tab) return;
    tab.title = title;
    const tabUi = document.getElementById(`tab-ui-${id}`);
    if (tabUi) {
      tabUi.querySelector(".tab-title").textContent = title;
    }
  }

  function getActiveTab() {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return null;
    return getTabs().find((tab) => tab.id === activeTabId) || null;
  }

  function getActiveWebview() {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return null;
    return document.getElementById(`webview-${activeTabId}`);
  }

  function updateUrlDisplay(url) {
    const display = document.getElementById("urlDisplay");
    if (display) display.value = url;
  }

  function updateUrlDisplayString(str) {
    const display = document.getElementById("urlDisplay");
    if (display) display.value = str;
  }

  function updateNavigationButtons() {
    const backBtn = document.getElementById("browserBack");
    const forwardBtn = document.getElementById("browserForward");
    const activeWv = getActiveWebview();
    if (backBtn) {
      backBtn.disabled = activeWv ? !activeWv.canGoBack() : true;
    }
    if (forwardBtn) {
      forwardBtn.disabled = activeWv ? !activeWv.canGoForward() : true;
    }
  }

  function stopWebviewBackgroundTasks(webview) {
    if (!webview) return;
    if (webview._oneviewCredentialPollId) {
      clearInterval(webview._oneviewCredentialPollId);
      webview._oneviewCredentialPollId = null;
    }
    if (webview._oneviewAutofillTimer) {
      clearTimeout(webview._oneviewAutofillTimer);
      webview._oneviewAutofillTimer = null;
    }
  }

  function syncWebviewActivity(tabId) {
    const allWebviews = document.querySelectorAll(
      ".webviews-container .webcontent-pane",
    );
    allWebviews.forEach((wv) => {
      const currentTabId = wv.id.replace("webview-", "");
      const tab = getTabs().find((item) => item.id === currentTabId);
      const active = currentTabId === tabId && !tab?.isHome;
      if (active && tab?.credentialAutomationEnabled) {
        startCredentialCapturePolling(wv, tab);
      } else {
        stopWebviewBackgroundTasks(wv);
      }
    });
  }

  function renderTab(tab, insertIndex = getTabs().length - 1) {
    const tabsList = document.getElementById("tabsList");
    if (!tabsList) return;
    const div = document.createElement("div");
    div.className = "tab";
    div.id = `tab-ui-${tab.id}`;
    div.innerHTML = `
        <span class="tab-title">${tab.title}</span>
        <button class="tab-close">x</button>
    `;

    div.addEventListener("click", (event) => {
      if (event.target.classList.contains("tab-close")) return;
      switchTab(tab.id);
    });

    const closeBtn = div.querySelector(".tab-close");
    closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      closeTab(tab.id);
    });

    const nextEl = tabsList.children[insertIndex] || null;
    tabsList.insertBefore(div, nextEl);
    refreshTabScrollControls();
  }

  function queueTabWebviewPrewarm(tabId) {
    setTimeout(async () => {
      const tab = getTabs().find((item) => item.id === tabId);
      if (!tab || !tab.isHome) return;
      const existing = document.getElementById(`webview-${tabId}`);
      if (existing) return;
      try {
        const warm = await createWebviewForTab(tab);
        if (!warm) return;
        warm.classList.remove("active");
        if (typeof warm.hide === "function") {
          warm.hide().catch(() => {});
        }
        warm.syncBounds?.(false);
      } catch (err) {
        window.api.webContentCall("log-error", { key: `prewarm-err:${tabId}:${err.toString()}` }).catch(() => {});
      }
    }, 0);
  }

  async function createTab(
    url = null,
    partition = null,
    title = "New Tab",
    lockedProfileId = null,
    options = {},
  ) {
    const shouldActivate = options.active !== false;
    const isSiteSnapMode = window.isSiteSnapStudioMode || window.parent?.isSiteSnapStudioMode;
    if (isSiteSnapMode) {
      // SiteSnap Studio always browses under the GSK profile — no profile dialog needed.
      partition = PARTITIONS.gsk;
    } else {
      partition = normalizeAppPartitionName(
        partition ||
          (PROFILES[getCurrentProfileId()]
            ? PROFILES[getCurrentProfileId()].partition
            : PARTITIONS.guest),
      );
    }
    const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const tab = {
      id,
      title,
      url,
      partition,
      isHome: !url && !options.nativePage,
      nativePage:
        options.nativePage && typeof options.nativePage === "object"
          ? createNativePageDescriptor(
              options.nativePage.type || "settings",
              options.nativePage.section || "general",
            )
          : null,
      lockedProfileId,
      hideBrowserControls: false,
      launchedAppType: null,
      trackingAppId: "",
      trackingAppName: "",
      requiresPlatformApi: false,
      extensionCompatEnabled: false,
      extensionEntryPath: "",
      extensionActiveContext: { url: "", title: "" },
      credentialAutomationEnabled: false,
      lastCredentialSourceProfileId: null,
    };

    tab.trackingAppId = String(options.trackingAppId || "").trim();
    tab.trackingAppName = String(
      options.trackingAppName || title || tab.title || "",
    ).trim();
    tab.extensionEntryPath = String(options.extensionEntryPath || "").trim();
    tab.extensionCompatEnabled = Boolean(tab.extensionEntryPath);
    tab.extensionActiveContext =
      options.extensionActiveContext &&
      typeof options.extensionActiveContext === "object"
        ? {
            url: String(options.extensionActiveContext.url || "").trim(),
            title: String(options.extensionActiveContext.title || "").trim(),
          }
        : { url: "", title: "" };

    const tabs = getTabs();
    const activeIndex = tabs.findIndex((t) => t.id === getActiveTabId());
    const insertIndex = Number.isInteger(options.insertIndex)
      ? Math.max(0, Math.min(options.insertIndex, tabs.length))
      : activeIndex >= 0
        ? activeIndex + 1
        : tabs.length;
    tabs.splice(insertIndex, 0, tab);
    renderTab(tab, insertIndex);

    if (tab.nativePage) {
      await switchTab(id);
    } else if (url) {
      if (shouldActivate) {
        setActiveTabId(id);
      }
      const homeContent = document.getElementById("view-home-content");
      const webviewsContainer = document.getElementById("webviews-container");
      if (shouldActivate && homeContent) homeContent.classList.add("hidden");
      const isExtUrl = url && (url.includes("result.html") || url.includes("extension-icon") || url.toLowerCase().includes("result"));
      if (shouldActivate && webviewsContainer) {
        webviewsContainer.classList.remove("hidden");
        let loaderPh = document.getElementById("tab-load-placeholder");
        if (!isExtUrl) {
          if (!loaderPh) {
            loaderPh = document.createElement("div");
            loaderPh.id = "tab-load-placeholder";
            loaderPh.style.cssText = [
              "position:absolute",
              "inset:0",
              "z-index:50",
              "display:flex",
              "flex-direction:column",
              "align-items:center",
              "justify-content:center",
              "background:var(--bg-main,#f8fafc)",
              "gap:16px",
            ].join(";");
            loaderPh.innerHTML = `
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `;
            webviewsContainer.appendChild(loaderPh);
          } else {
            loaderPh.style.display = "flex";
          }
        } else if (loaderPh) {
          loaderPh.style.display = "none";
        }
        const hidePlaceholder = () => {
          if (loaderPh) loaderPh.style.display = "none";
        };
        const detachPendingPlaceholderHandlers = (wv) => {
          if (!wv) return;
          if (typeof wv._oneviewPlaceholderFinalize === "function") {
            wv.removeEventListener(
              "did-stop-loading",
              wv._oneviewPlaceholderFinalize,
            );
            wv.removeEventListener(
              "did-fail-load",
              wv._oneviewPlaceholderFinalize,
            );
          }
          wv._oneviewPlaceholderFinalize = null;
        };
        const pollForWebview = setInterval(() => {
          const wv = document.getElementById(`webview-${id}`);
          if (!wv) return;
          clearInterval(pollForWebview);
          clearTimeout(pollForWebviewTimeout);
          const finalizePlaceholder = () => {
            detachPendingPlaceholderHandlers(wv);
            clearTimeout(pollForWebviewTimeout);
            hidePlaceholder();
          };
          detachPendingPlaceholderHandlers(wv);
          wv._oneviewPlaceholderFinalize = finalizePlaceholder;
          wv.addEventListener("did-stop-loading", finalizePlaceholder, {
            once: true,
          });
          wv.addEventListener("did-fail-load", finalizePlaceholder, {
            once: true,
          });
        }, 100);
        const pollForWebviewTimeout = setTimeout(() => {
          clearInterval(pollForWebview);
          hidePlaceholder();
        }, 12000);
      }
      await navigateToTab(
        id,
        url,
        partition,
        title,
        lockedProfileId,
        options,
        shouldActivate,
      );
    } else {
      await switchTab(id);
      if (TAB_PREWARM_ENABLED) {
        queueTabWebviewPrewarm(id);
      }
    }
    return tab;
  }

  function duplicateTab(anchorId = getActiveTabId()) {
    const tabs = getTabs();
    const sourceTab = tabs.find((tab) => tab.id === anchorId);
    if (!sourceTab) return;

    const sourceIndex = tabs.findIndex((tab) => tab.id === sourceTab.id);
    const sourceWebview = document.getElementById(`webview-${sourceTab.id}`);
    const sourceUrl =
      (sourceWebview &&
        typeof sourceWebview.getURL === "function" &&
        sourceWebview.getURL()) ||
      sourceTab.url ||
      "";
    const sourceTitle =
      (sourceWebview &&
        typeof sourceWebview.getTitle === "function" &&
        sourceWebview.getTitle()) ||
      sourceTab.title ||
      "New Tab";

    createTab(
      sourceTab.isHome || !sourceUrl || sourceUrl === "about:blank"
        ? null
        : sourceUrl,
      sourceTab.partition,
      sourceTitle,
      sourceTab.lockedProfileId || null,
      {
        insertIndex: sourceIndex >= 0 ? sourceIndex + 1 : tabs.length,
        trackingAppId: sourceTab.trackingAppId || "",
        trackingAppName: sourceTab.trackingAppName || sourceTitle,
      },
    );
  }

  function switchRelativeTab(delta) {
    const tabs = getTabs();
    if (!tabs.length) return;
    const activeIndex = tabs.findIndex((tab) => tab.id === getActiveTabId());
    const safeIndex = activeIndex >= 0 ? activeIndex : 0;
    const nextIndex = (safeIndex + delta + tabs.length) % tabs.length;
    switchTab(tabs[nextIndex].id, { suppressHomeSearchFocus: true });
  }

  async function focusWebviewContent(webview) {
    if (!webview || typeof webview.focusWebContents !== "function") return;
    await webview.focusWebContents().catch(() => {});
  }

  async function switchTab(id, options = {}) {
    setActiveTabId(id);
    const tab = getTabs().find((item) => item.id === id);
    if (!tab) return;
    closeBrowserExtensionsMenu();
    closeBrowserExtensionPopup().catch(() => {});
    syncProfileSelectionForTab(tab);
    updateProfileLockUI(tab);

    document
      .querySelectorAll(".tab")
      .forEach((item) => item.classList.remove("active"));
    const tabUi = document.getElementById(`tab-ui-${id}`);
    if (tabUi) tabUi.classList.add("active");

    const homeContent = document.getElementById("view-home-content");
    const nativeTabContent = document.getElementById("nativeTabContent");
    const webviewsContainer = document.getElementById("webviews-container");
    const allWebviews = document.querySelectorAll(
      ".webviews-container .webcontent-pane",
    );

    if (tab.isHome) {
      homeContent?.classList.remove("hidden");
      nativeTabContent?.classList.add("hidden");
      webviewsContainer?.classList.add("hidden");
      updateBrowserControlsOverlay(tab);
      updateDetachButtonVisibility(tab);
      updateProfileSectionVisibility(tab);
      const searchInput = document.getElementById("googleSearchInput");
      if (searchInput && options?.suppressHomeSearchFocus !== true) {
        searchInput.value = "";
        searchInput.focus();
      }
    } else if (tab.nativePage) {
      homeContent?.classList.add("hidden");
      nativeTabContent?.classList.remove("hidden");
      webviewsContainer?.classList.add("hidden");
      updateBrowserControlsOverlay(tab);
      updateDetachButtonVisibility(tab);
      updateProfileSectionVisibility(tab);
      updateUrlDisplay("");
      if (normalizeSettingsSection(tab.nativePage?.section) === "general") {
        await ensureNativeSettingsGeneralInfo();
      }
      renderNativeSettingsPage(tab);
    } else {
      homeContent?.classList.add("hidden");
      nativeTabContent?.classList.add("hidden");
      webviewsContainer?.classList.remove("hidden");
      updateBrowserControlsOverlay(tab);
      updateDetachButtonVisibility(tab);
      updateProfileSectionVisibility(tab);

      allWebviews.forEach((otherWv) => {
        if (otherWv.id !== `webview-${id}`) {
          otherWv.classList.remove("active");
          if (typeof otherWv.hide === "function") {
            otherWv.hide().catch(() => {});
          }
          otherWv.syncBounds?.(false);
        }
      });

      let wv = null;
      try {
        wv = document.getElementById(`webview-${id}`);
        if (!wv) {
          wv = await createWebviewForTab(tab);
        }
      } catch (err) {
        window.api.webContentCall("log-error", { key: `switchTab-create-err:${id}:${err.toString()}` }).catch(() => {});
      }
      if (wv) {
        try {
          wv.classList.add("active");
          if (typeof wv.show === "function") {
            await wv.show().catch(() => {});
          }
          wv.syncBounds?.(true);
          await focusWebviewContent(wv);
          updateUrlDisplay(wv.getURL());
        } catch (err) {
          window.api.webContentCall("log-error", { key: `switchTab-show-err:${id}:${err.toString()}` }).catch(() => {});
        }
      }
    }
    syncWebviewActivity(tab.id);
    refreshBrowserExtensionsUi();
    updateNavigationButtons();
  }

  function shouldPoolTabWebview(tab) {
    if (!tab) return false;
    const appType = String(tab.launchedAppType || "").toLowerCase();
    return LOCAL_WEB_APP_TYPES.has(appType);
  }

  function parkWebviewForReuse(webview, tab) {
    if (!webview || !tab || !shouldPoolTabWebview(tab)) return false;
    const partition = String(
      webview.getAttribute("partition") || tab.partition || "",
    );
    if (!partition) return false;
    const parent = webview.parentElement;
    if (parent) parent.removeChild(webview);
    webview.classList.remove("active");
    webviewPool.push({
      webview,
      partition,
      platformApiEnabled: getWebviewPlatformApiFlag(webview),
      at: Date.now(),
    });
    perfMark("view-webcontent", "park-to-pool", {
      partition,
      poolSize: webviewPool.length,
    });
    while (webviewPool.length > WEBVIEW_POOL_MAX) {
      const evicted = webviewPool.shift();
      if (evicted && evicted.webview && !evicted.webview.isDestroyed?.()) {
        evicted.webview.remove();
      }
    }
    return true;
  }

  function closeTab(id) {
    const tabs = getTabs();
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index === -1) return;
    const closingActiveTab = getActiveTabId() === id;

    document.getElementById(`tab-ui-${id}`)?.remove();

    const wv = document.getElementById(`webview-${id}`);
    if (wv) {
      stopWebviewBackgroundTasks(wv);
      const shouldPool = shouldPoolTabWebview(tabs[index]);
      if (!shouldPool || !parkWebviewForReuse(wv, tabs[index])) {
        wv.remove();
      }
    }

    tabs.splice(index, 1);

    if (tabs.length === 0) {
      setActiveTabId(null);
      createTab();
      refreshTabScrollControls();
      return;
    }

    const activeStillExists = tabs.some((tab) => tab.id === getActiveTabId());
    if (closingActiveTab || !activeStillExists) {
      const nextIndex = Math.min(index, tabs.length - 1);
      const nextTab = tabs[nextIndex] || tabs[tabs.length - 1];
      if (nextTab) {
        switchTab(nextTab.id);
      }
    }

    refreshTabScrollControls();
  }

  async function navigateToTab(
    targetTabId,
    url,
    partition,
    title,
    lockedProfileId = null,
    options = {},
    activate = true,
  ) {
    const navStartedAt = performance.now();
    const tab = getTabs().find((item) => item.id === targetTabId);
    if (!tab) return;
    tab._navStartedAt = navStartedAt;
    perfMark("view-nav", "navigateTo-start", {
      tabId: tab.id,
      url: String(url || ""),
      partition: String(partition || ""),
      appType: options.appType || null,
    });

    tab.isHome = false;
    tab.url = url;
    tab.partition = partition;
    tab.lockedProfileId = lockedProfileId;
    tab.hideBrowserControls = Boolean(options.hideControls);
    tab.launchedAppType = options.appType || null;
    tab.lastCredentialSourceProfileId = null;
    tab.trackingAppId = String(options.trackingAppId || "").trim();
    tab.trackingAppName = String(
      options.trackingAppName || title || tab.title || "",
    ).trim();
    tab.requiresPlatformApi = shouldRequirePlatformApiForNavigation(
      url,
      options,
    );
    if (title) updateTabTitle(targetTabId, title);

    if (activate) {
      setActiveTabId(targetTabId);
      await switchTab(targetTabId);
    }

    let wv = document.getElementById(`webview-${targetTabId}`);
    if (!wv) {
      wv = await createWebviewForTab(tab, activate);
    } else {
      const currentPartition = wv.getAttribute("partition");
      const currentPlatformApiEnabled = getWebviewPlatformApiFlag(wv);
      if (
        currentPartition !== partition ||
        currentPlatformApiEnabled !== Boolean(tab.requiresPlatformApi)
      ) {
        stopWebviewBackgroundTasks(wv);
        const shouldPool = shouldPoolTabWebview(tab);
        if (!shouldPool || !parkWebviewForReuse(wv, tab)) {
          wv.remove();
        }
        wv = await createWebviewForTab(tab, activate);
      }
    }

    if (activate && typeof wv.show === "function") {
      await wv.show().catch(() => {});
    } else if (!activate && typeof wv.hide === "function") {
      await wv.hide().catch(() => {});
    }
    if (typeof wv.setMeta === "function") {
      await wv
        .setMeta({
          trackingAppId: tab.trackingAppId,
          appName: tab.trackingAppName,
          appType: tab.launchedAppType || "",
        })
        .catch(() => {});
    }
    wv.syncBounds?.(activate);
    if (activate) {
      updateUrlDisplay(url);
      await focusWebviewContent(wv);
    }
    if (wv.src !== url) wv.src = url;
    perfMark("view-nav", "navigateTo-dispatch", {
      tabId: tab.id,
      elapsedMs: Math.round(performance.now() - navStartedAt),
    });
  }

  async function navigateTo(
    url,
    partition,
    title,
    lockedProfileId = null,
    options = {},
  ) {
    return navigateToTab(
      getActiveTabId(),
      url,
      partition,
      title,
      lockedProfileId,
      options,
      true,
    );
  }

  function installModifiedClickBridge(wv) {
    if (!wv) return;
    wv.executeJavaScript(
      `
      (() => {
        if (window.__oneviewModifiedClickBridgeInstalled) return true;
        window.__oneviewModifiedClickBridgeInstalled = true;
        const findAnchor = (event) => {
          const path = typeof event.composedPath === "function" ? event.composedPath() : [];
          for (const node of path) {
            if (node && typeof node.closest === "function") {
              const anchor = node.closest("a[href]");
              if (anchor) return anchor;
            }
          }
          return event.target && typeof event.target.closest === "function"
            ? event.target.closest("a[href]")
            : null;
        };

        const openModifiedLink = (event) => {
          const anchor = findAnchor(event);
          if (!anchor) return;
          const href = anchor.href || anchor.getAttribute("href") || "";
          if (!href || /^javascript:/i.test(href)) return;
          anchor.setAttribute("target", "_blank");
          anchor.setAttribute("rel", "noopener noreferrer");
          event.preventDefault();
          event.stopPropagation();
          if (typeof event.stopImmediatePropagation === "function") {
            event.stopImmediatePropagation();
          }
          window.open(href, "_blank");
        };

        document.addEventListener("mousedown", (event) => {
          if (!(event.ctrlKey || event.metaKey)) return;
          openModifiedLink(event);
        }, true);

        document.addEventListener("click", (event) => {
          if (!(event.ctrlKey || event.metaKey)) return;
          openModifiedLink(event);
        }, true);

        document.addEventListener("auxclick", (event) => {
          if (event.button !== 1) return;
          openModifiedLink(event);
        }, true);
        return true;
      })();
      `,
      true,
    ).catch(() => {});
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

  function attachWebviewTabListeners(wv) {
    if (wv._hasTabListenersAttached) return;
    wv._hasTabListenersAttached = true;

    wv.addEventListener("ipc-message", async (event) => {
      if (event.channel === "oneview:credential-field-focused") {
        handleCredentialFieldInteraction(wv, event.args[0]);
      } else if (event.channel === "oneview:credential-field-blurred") {
        hideCredentialDropdown();
      } else if (event.channel === "oneview:credential-selected") {
        const cred = event.args[0];
        if (cred) {
          wv.executeJavaScript("window.__oneviewManualCredentialEditAt = 0;", true).catch(() => {});
          // 1. Fill the field
          scheduleCredentialAutofill(wv, cred);
          // 2. Switch profile if needed
          if (cred.profileId && cred.profileId !== getCurrentProfileId()) {
            applyProfileSelection(cred.profileId);
          }
          // Save as last used
          try {
            const u = wv.getURL();
            const host = u ? new URL(u).hostname.toLowerCase() : "";
            if (host) {
              localStorage.setItem(`oneview:last-used-username:${cred.profileId || getCurrentProfileId()}:${host}`, cred.username);
            }
          } catch (_) {}
        }
      } else if (event.channel === "oneview:credential-login-attempted") {
        const payload = event.args[0];
        if (payload && payload.username) {
          try {
            const host = payload.url ? new URL(payload.url).hostname.toLowerCase() : "";
            if (host) {
              localStorage.setItem(`oneview:last-used-username:${getCurrentProfileId()}:${host}`, payload.username);
            }
          } catch (_) {}
          
          const currentTabId = wv.id.replace("webview-", "");
          const boundTab = getTabs().find((tab) => tab.id === currentTabId);
          if (boundTab && boundTab.credentialAutomationEnabled) {
            maybeOfferRememberCredentials(wv, boundTab);
          }
        }
      } else if (event.channel === "oneview:credential-submitted") {
        const payload = event.args[0];
        if (payload) {
          wv._oneviewSubmittedCredential = payload;
        }
      } else if (event.channel === "oneview:keydown") {
        const payload = event.args[0];
        if (payload) {
          const keyEvent = new KeyboardEvent("keydown", {
            key: payload.key,
            ctrlKey: payload.ctrlKey,
            shiftKey: payload.shiftKey,
            altKey: payload.altKey,
            metaKey: payload.metaKey,
            bubbles: true,
            cancelable: true
          });
          document.dispatchEvent(keyEvent);
        }
      }
    });

    wv.addEventListener("console-message", (event) => {
      const message = String(event?.message || "");
      const shouldRelay =
        message.includes("[OneView][Credential") ||
        message.includes("[VeevaSlide]");
      if (!shouldRelay) return;
      console.log("[WebviewConsole]", {
        level: event?.level,
        line: event?.line,
        sourceId: event?.sourceId || "",
        message,
      });
    });

    wv.addEventListener("did-start-loading", () => {
      const currentTabId = wv.id.replace("webview-", "");
      const boundTab = getTabs().find((tab) => tab.id === currentTabId);
      if (!boundTab) return;

      boundTab._didStartLoadingAt = performance.now();
      perfMark("view-webcontent", "did-start-loading", {
        tabId: boundTab.id,
        url: wv.getURL() || boundTab.url || "",
      });
      const isExt = boundTab.url && (
        boundTab.url.includes("result.html") || boundTab.url.includes("extension-icon") || boundTab.url.toLowerCase().includes("result")
      );
      if (!isExt) {
        updateTabTitle(boundTab.id, "Loading...");
        if (boundTab.id === getActiveTabId()) {
          updateUrlDisplayString(boundTab.url || "Loading...");
        }
      } else {
        updateTabTitle(boundTab.id, "Result");
        if (boundTab.id === getActiveTabId()) {
          updateUrlDisplayString(boundTab.url || "");
        }
      }
    });

    wv.addEventListener("did-stop-loading", async () => {
      const currentTabId = wv.id.replace("webview-", "");
      const boundTab = getTabs().find((tab) => tab.id === currentTabId);
      if (!boundTab) return;

      const loadElapsed =
        typeof boundTab._didStartLoadingAt === "number"
          ? Math.round(performance.now() - boundTab._didStartLoadingAt)
          : null;
      const navElapsed =
        typeof boundTab._navStartedAt === "number"
          ? Math.round(performance.now() - boundTab._navStartedAt)
          : null;
      perfMark("view-webcontent", "did-stop-loading", {
        tabId: boundTab.id,
        url: wv.getURL() || "",
        loadElapsedMs: loadElapsed,
        navElapsedMs: navElapsed,
      });
      const currentUrl = wv.getURL() || boundTab.url || "";
      const isExt = currentUrl && (
        currentUrl.includes("result.html") || currentUrl.includes("extension-icon") || currentUrl.toLowerCase().includes("result")
      );
      let currentTitle = isExt ? "Result" : (wv.getTitle() || boundTab.title || "Tab");
      if (currentTitle === "Tab" || currentTitle === "Loading..." || !currentTitle) {
        try {
          const parsed = new URL(currentUrl);
          currentTitle = parsed.hostname ? parsed.hostname.replace("www.", "") : "Tab";
        } catch (e) {
          currentTitle = "Tab";
        }
      }
      const isGeneric = boundTab.title === "Loading..." || boundTab.title === "Tab" || !boundTab.title;
      if (isGeneric || (wv.getTitle() && wv.getTitle() !== "about:blank")) {
        updateTabTitle(boundTab.id, currentTitle);
      }
      if (boundTab.id === getActiveTabId()) {
        updateUrlDisplay(currentUrl);
      }
      boundTab.url = currentUrl;
      boundTab.credentialAutomationEnabled = shouldEnableCredentialAutomation(
        currentUrl,
        currentTitle,
        boundTab,
      );

      const setupCredentialAutomation = async (tab, url, title) => {
        if (!tab.credentialAutomationEnabled) {
          stopWebviewBackgroundTasks(wv);
          return;
        }
        const assignedProfile = resolveAssignedProfileIdForTab(
          tab,
          url,
          title,
        );
        const profileForAutofill =
          getCredentialScopeIdByPartition(tab.partition) ||
          assignedProfile ||
          getCurrentProfileId();
        await refreshCredentialCacheIfStale();
        const credential = getAutofillCredentialForTab(
          profileForAutofill,
          url,
          tab,
        );
        scheduleCredentialAutofill(wv, credential);
        startCredentialCapturePolling(wv, tab);
        installCredentialCaptureHooks(wv);
      };
      wv._oneviewSetupCredentialAutomation = setupCredentialAutomation;

      await setupCredentialAutomation(boundTab, currentUrl, currentTitle);

      await syncTabProfileForPage(boundTab, currentUrl, currentTitle, wv);
      applyWebsiteScrollbarTheme(wv, boundTab);
      const historyProfileId = resolveProfileIdForTab(boundTab);
      trackProfileHistory(historyProfileId, currentUrl, currentTitle);
      installModifiedClickBridge(wv);
    });

    wv.addEventListener("page-title-updated", (event) => {
      const currentTabId = wv.id.replace("webview-", "");
      const boundTab = getTabs().find((tab) => tab.id === currentTabId);
      if (!boundTab) return;

      updateTabTitle(boundTab.id, event.title);
      if (boundTab.credentialAutomationEnabled) {
        maybeOfferRememberCredentials(wv, boundTab);
      }
    });

    wv.addEventListener("will-navigate", () => {
      const currentTabId = wv.id.replace("webview-", "");
      const boundTab = getTabs().find((tab) => tab.id === currentTabId);
      if (!boundTab) return;

      if (boundTab.credentialAutomationEnabled) {
        maybeOfferRememberCredentials(wv, boundTab);
      }
    });

    wv.addEventListener("did-navigate", (event) => {
      const currentTabId = wv.id.replace("webview-", "");
      const boundTab = getTabs().find((tab) => tab.id === currentTabId);
      if (!boundTab) return;
      const currentUrl = event.url || wv.getURL() || "";
      boundTab.url = currentUrl;
      if (boundTab.id === getActiveTabId()) {
        updateUrlDisplay(currentUrl);
        updateNavigationButtons();
      }
      const historyProfileId = resolveProfileIdForTab(boundTab);
      trackProfileHistory(historyProfileId, currentUrl, wv.getTitle() || boundTab.title || "");
      if (boundTab.credentialAutomationEnabled) {
        maybeOfferRememberCredentials(wv, boundTab);
        if (typeof wv._oneviewSetupCredentialAutomation === "function") {
          wv._oneviewSetupCredentialAutomation(boundTab, currentUrl, wv.getTitle() || boundTab.title || "");
        }
      }
    });

    wv.addEventListener("did-navigate-in-page", async (event) => {
      const currentTabId = wv.id.replace("webview-", "");
      const boundTab = getTabs().find((tab) => tab.id === currentTabId);
      if (!boundTab) return;

      const currentUrl = event.url || wv.getURL() || "";
      boundTab.url = currentUrl;
      if (boundTab.id === getActiveTabId()) {
        updateUrlDisplay(currentUrl);
        updateNavigationButtons();
      }

      const historyProfileId = resolveProfileIdForTab(boundTab);
      trackProfileHistory(historyProfileId, currentUrl, wv.getTitle() || boundTab.title || "");

      if (boundTab.credentialAutomationEnabled) {
        maybeOfferRememberCredentials(wv, boundTab);
        if (typeof wv._oneviewSetupCredentialAutomation === "function") {
          wv._oneviewSetupCredentialAutomation(boundTab, currentUrl, wv.getTitle() || boundTab.title || "");
        }
      }

      wv.addEventListener("history-changed", (e) => {
        _ = e;
        if (boundTab.id === getActiveTabId()) {
          updateNavigationButtons();
        }
      });

      boundTab.credentialAutomationEnabled = shouldEnableCredentialAutomation(
        currentUrl,
        wv.getTitle() || boundTab.title || "",
        boundTab,
      );
      if (!boundTab.credentialAutomationEnabled) {
        stopWebviewBackgroundTasks(wv);
        return;
      }
      maybeOfferRememberCredentials(wv, boundTab);
      await refreshCredentialCacheIfStale();
      const profileForAutofill =
        getCredentialScopeIdByPartition(boundTab.partition) ||
        resolveAssignedProfileIdForTab(
          boundTab,
          currentUrl,
          wv.getTitle() || boundTab.title || "",
        ) ||
        resolveCredentialScopeIdForTab(boundTab);
      const credential = getAutofillCredentialForTab(
        profileForAutofill,
        currentUrl,
        boundTab,
      );
      scheduleCredentialAutofill(wv, credential);
      startCredentialCapturePolling(wv, boundTab);
    });

    wv.addEventListener("new-window", async (event) => {
      const currentTabId = wv.id.replace("webview-", "");
      const boundTab = getTabs().find((tab) => tab.id === currentTabId);
      if (!boundTab) return;

      if (typeof event?.preventDefault === "function") {
        event.preventDefault();
      }
      const popupUrl = String(event?.url || "").trim();
      if (isIgnorablePopupUrl(popupUrl)) return;
      const currentUrl = String(wv.getURL() || "").trim();
      if (currentUrl && currentUrl === popupUrl) return;

      let targetProfileId = resolveAssignedProfileId(popupUrl, "New Tab");
      let targetPartition = null;

      if (!targetProfileId) {
        if (openProfilePromptDialog) {
          const defaultProfile = resolveProfileIdForTab(boundTab) || "guest";
          const res = await openProfilePromptDialog(popupUrl, defaultProfile);
          if (res && !res.cancelled && res.profileId) {
            targetProfileId = res.profileId;
            targetPartition = PROFILES[targetProfileId]?.partition;
          } else {
            return; // Cancelled
          }
        } else {
          targetPartition = boundTab.partition;
        }
      } else {
        targetPartition = PROFILES[targetProfileId].partition;
      }

      const tabs = getTabs();
      const sourceIndex = tabs.findIndex((tab) => tab.id === boundTab.id);
      createTab(popupUrl, targetPartition, "New Tab", targetProfileId, {
        insertIndex: sourceIndex >= 0 ? sourceIndex + 1 : tabs.length,
      });
    });
  }

  async function createWebviewForTab(tab, activate = true) {
    if (pendingWebviewCreations.has(tab.id)) {
      return pendingWebviewCreations.get(tab.id);
    }
    const promise = createWebviewForTabImpl(tab, activate);
    pendingWebviewCreations.set(tab.id, promise);
    try {
      return await promise;
    } finally {
      pendingWebviewCreations.delete(tab.id);
    }
  }

  function takePooledWebview(tab) {
    const partition = String(tab?.partition || "");
    if (!partition || webviewPool.length === 0) return null;
    const requiredPlatformApi = Boolean(tab?.requiresPlatformApi);
    const index = webviewPool.findIndex(
      (entry) =>
        entry.partition === partition &&
        Boolean(entry.platformApiEnabled) === requiredPlatformApi,
    );
    if (index === -1) return null;
    const [entry] = webviewPool.splice(index, 1);
    return entry?.webview || null;
  }

  async function createWebviewForTabImpl(tab, activate = true) {
    const createStartedAt = performance.now();
    let container = document.getElementById("webviews-container");
    if (!container) {
      const viewRoot = document.getElementById("view-page-content") || document.body;
      container = document.createElement("div");
      container.id = "webviews-container";
      container.className = "webviews-container";
      viewRoot.appendChild(container);
    }
    const reused = takePooledWebview(tab);
    if (reused) {
      reused.classList.toggle("active", activate);
      reused.id = `webview-${tab.id}`;
      reused.setAttribute("partition", tab.partition);
      setWebviewPlatformApiFlag(reused, Boolean(tab.requiresPlatformApi));
      attachWebviewTabListeners(reused);
      container.appendChild(reused);
      if (activate && typeof reused.show === "function") {
        reused.show().catch(() => {});
      } else if (!activate && typeof reused.hide === "function") {
        reused.hide().catch(() => {});
      }
      reused.syncBounds?.(activate);
      if (activate && typeof reused.focusWebContents === "function") {
        reused.focusWebContents().catch(() => {});
      }
      perfMark("view-webcontent", "reuse-pooled", {
        tabId: tab.id,
        partition: tab.partition,
        elapsedMs: Math.round(performance.now() - createStartedAt),
        poolSize: webviewPool.length,
      });
      return reused;
    }
    const preloadPath = getWebviewPreloadPathCached();
    const wv = await createWebContentHostElement({
      key: `view:${tab.id}`,
      partition: tab.partition,
      preloadPath,
      additionalArguments: tab.requiresPlatformApi
        ? ["--oneview-enable-platform-api=1"]
        : [],
      extensionEntryPath: tab.extensionEntryPath,
      extensionActiveContext: tab.extensionActiveContext,
      extensionCompat: true,
      initialMeta: {
        trackingAppId: tab.trackingAppId,
        appName: tab.trackingAppName,
        appType: tab.launchedAppType || "",
        extensionEntryPath: tab.extensionEntryPath,
      },
      className: `webcontent-pane${activate ? " active" : ""}`,
    });
    wv.id = `webview-${tab.id}`;
    wv.setAttribute("partition", tab.partition);
    setWebviewPlatformApiFlag(wv, Boolean(tab.requiresPlatformApi));
    attachWebviewTabListeners(wv);

    container.appendChild(wv);

    if (!activate && typeof wv.hide === "function") {
      wv.hide().catch(() => {});
    }
    wv.syncBounds?.(activate);
    if (activate) {
      requestAnimationFrame(() => {
        wv.syncBounds?.(true);
      });
      setTimeout(() => {
        wv.syncBounds?.(true);
      }, 100);
    }
    if (activate && typeof wv.focusWebContents === "function") {
      wv.focusWebContents().catch(() => {});
    }
    perfMark("view-webcontent", "create-fresh", {
      tabId: tab.id,
      partition: tab.partition,
      elapsedMs: Math.round(performance.now() - createStartedAt),
    });
    return wv;
  }

  function startWebviewPoolKeepalive() {
    if (webviewPoolKeepaliveTimer) return;
    webviewPoolKeepaliveTimer = setInterval(() => {
      if (document.hidden) return;
      if (webviewPool.length === 0) return;
      for (let i = webviewPool.length - 1; i >= 0; i -= 1) {
        const entry = webviewPool[i];
        const webview = entry?.webview;
        if (!webview || webview.isDestroyed?.()) {
          webviewPool.splice(i, 1);
          continue;
        }
        webview.executeJavaScript("void 0", false).catch(() => {});
      }
    }, WEBVIEW_POOL_KEEPALIVE_MS);
  }

  async function prewarmWebviewPoolForPartition(partition) {
    const partitionName = String(partition || "").trim();
    if (!partitionName) return;
    if (webviewPool.some((entry) => entry.partition === partitionName)) return;

    const container = document.getElementById("webviews-container");
    if (!container) return;

    const preloadPath = getWebviewPreloadPathCached();
    const key = `view:prewarm:${partitionName}:${Date.now()}`;
    try {
      const warm = await createWebContentHostElement({
        key,
        partition: partitionName,
        preloadPath,
        className: "webcontent-pane",
      });
      warm.id = `webview-prewarm-${Date.now()}`;
      container.appendChild(warm);
      warm.syncBounds?.();
      parkWebviewForReuse(warm, {
        launchedAppType: "website",
        partition: partitionName,
      });
    } catch (_err) {}
  }

  async function prewarmWebviewPoolsForKnownProfiles() {
    const partitions = Array.from(
      new Set(
        Object.values(PROFILES)
          .map((profile) => String(profile?.partition || "").trim())
          .filter(Boolean),
      ),
    );
    for (const partition of partitions) {
      await prewarmWebviewPoolForPartition(partition);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  }

  async function prewarmWebviewPoolForCurrentProfile() {
    const partition =
      PROFILES[getCurrentProfileId()]?.partition || PROFILES.guest.partition;
    if (!partition) return;
    await prewarmWebviewPoolForPartition(partition);
  }

  function startWebviewRuntime() {
    startWebviewPoolKeepalive();
    // Don't prewarm any pool when prewarming is disabled — it creates native
    // webview windows on startup which cause the top-left flash.
    if (!TAB_PREWARM_ENABLED) return;
    if (PREWARM_ALL_PROFILE_PARTITIONS) {
      prewarmWebviewPoolsForKnownProfiles();
    } else {
      prewarmWebviewPoolForCurrentProfile();
    }
  }

  function disposeWebviewRuntime() {
    if (webviewPoolKeepaliveTimer) {
      clearInterval(webviewPoolKeepaliveTimer);
      webviewPoolKeepaliveTimer = null;
    }

    while (webviewPool.length > 0) {
      const entry = webviewPool.shift();
      if (entry && entry.webview && !entry.webview.isDestroyed?.()) {
        entry.webview.remove();
      }
    }
  }

  function isInspectableLocalFileTab(tab, webview = null) {
    if (!tab || tab.isHome) return false;
    return true;
  }

  function applyWebsiteScrollbarTheme(webview, tab) {
    if (!webview || !tab || tab.launchedAppType !== "website") return;
    const css = `
    html, body {
      scrollbar-width: thin !important;
      scrollbar-color: rgba(99,102,241,0.65) rgba(148,163,184,0.16) !important;
    }
    * {
      scrollbar-width: thin !important;
      scrollbar-color: rgba(99,102,241,0.65) rgba(148,163,184,0.16) !important;
    }
    ::-webkit-scrollbar {
      width: 12px !important;
      height: 12px !important;
    }
    ::-webkit-scrollbar-track {
      background: linear-gradient(180deg, rgba(241,245,249,0.55), rgba(226,232,240,0.35)) !important;
      border-radius: 12px !important;
    }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, rgba(99,102,241,0.85), rgba(79,70,229,0.78)) !important;
      border: 2px solid rgba(255,255,255,0.88) !important;
      border-radius: 999px !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, rgba(79,70,229,0.95), rgba(67,56,202,0.9)) !important;
    }
    ::-webkit-scrollbar-corner {
      background: rgba(226,232,240,0.45) !important;
    }
  `;

    try {
      webview.insertCSS(css);
    } catch (err) {
      console.warn("Could not apply website scrollbar theme:", err);
    }
  }

  function goToActiveTabHome() {
    const tab = getTabs().find((item) => item.id === getActiveTabId());
    if (!tab || tab.isHome) return;

    tab.isHome = true;
    tab.url = null;
    tab.lockedProfileId = null;
    updateTabTitle(tab.id, "New Tab");

    const wv = document.getElementById(`webview-${tab.id}`);
    if (wv) {
      stopWebviewBackgroundTasks(wv);
      const shouldPool = shouldPoolTabWebview(tab);
      if (!shouldPool || !parkWebviewForReuse(wv, tab)) {
        wv.remove();
      }
    }

    switchTab(tab.id);
  }

  function normalizeAddressInput(query = "") {
    let value = String(query || "").trim();
    if (!value) return "";

    if (/^file:\/\/\/https?:\/\//i.test(value)) {
      value = value.replace(/^file:\/\/\//i, "");
    } else if (/^file:\/\/https?:\/\//i.test(value)) {
      value = value.replace(/^file:\/\//i, "");
    }

    const malformedWindowsDriveUrl = value.match(
      /^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/,
    );
    if (malformedWindowsDriveUrl) {
      const drive = malformedWindowsDriveUrl[1].toUpperCase();
      const rest = decodeURIComponent(malformedWindowsDriveUrl[2])
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");
      return `file:///${drive}:/${rest}`;
    }

    if (
      /^file:\/\//i.test(value) ||
      /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ||
      /^about:/i.test(value)
    ) {
      return value;
    }

    const windowsDrivePath = value.match(/^([a-zA-Z])[:/\\](.*)$/);
    if (windowsDrivePath) {
      const drive = windowsDrivePath[1].toUpperCase();
      const rest = windowsDrivePath[2].replace(/\\/g, "/").replace(/^\/+/, "");
      return `file:///${drive}:/${rest}`;
    }

    if (/^\/[A-Za-z]\//.test(value)) {
      const drive = value[1].toUpperCase();
      const rest = value.slice(3).replace(/\\/g, "/");
      return `file:///${drive}:/${rest}`;
    }

    if (/^\\\\/.test(value)) {
      return `file:${value.replace(/\\/g, "/")}`;
    }

    return value;
  }

  function looksLikeDirectNavigationInput(query = "") {
    const value = String(query || "").trim();
    if (!value || /\s/.test(value)) return false;
    if (/^about:/i.test(value)) return true;
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return true;
    if (/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(value)) return true;
    if (/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(value)) {
      return true;
    }
    if (value.includes(".")) return true;
    if (/[/:?#]/.test(value)) return true;
    return false;
  }

  async function performSearch(query) {
    query = normalizeAddressInput(query);
    if (!query) return;

    // In SiteSnap Studio mode, bypass profile resolution entirely and use sitesnap partition directly.
    if (window.isSiteSnapStudioMode || window.parent?.isSiteSnapStudioMode) {
      let url = query;
      if (looksLikeDirectNavigationInput(query)) {
        if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(query) && !/^about:/i.test(query)) {
          url = `https://${query}`;
        }
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
      await navigateTo(url, PARTITIONS.gsk, query);
      return;
    }

    let url = query;
    let isDirectUrl = looksLikeDirectNavigationInput(query);

    if (!isDirectUrl) {
      if (looksLikeDirectNavigationInput(query)) {
        url = `https://${query}`;
        isDirectUrl = true;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
    } else if (
      !/^[a-z][a-z0-9+.-]*:\/\//i.test(query) &&
      !/^about:/i.test(query) &&
      !/^file:\/\//i.test(query)
    ) {
      url = `https://${query}`;
    }

    if (isDirectUrl) {
      const targetNavigation = await resolveStrictProfileNavigationTarget(
        url,
        null,
        "New Tab",
      );
      if (!targetNavigation || targetNavigation.cancelled) {
        return;
      }

      const targetProfileId = targetNavigation.profileId;
      const targetPartition = targetNavigation.partition;

      if (targetProfileId && targetProfileId !== getCurrentProfileId()) {
        applyProfileSelection(targetProfileId, { bypassLock: true });
      }

      await navigateTo(
        url,
        targetPartition,
        "New Tab",
        targetNavigation.lockedProfileId,
      );
      return;
    }

    const searchPartition = resolveNavigationPartition(
      url,
      getActiveTab()?.partition ||
        PROFILES[getCurrentProfileId()]?.partition ||
        PARTITIONS.guest,
      "Google Search",
    );
    await navigateTo(url, searchPartition, "Google Search");
  }

  function closeTabsBulk(idsToClose, { isTeardown = false } = {}) {
    const tabs = getTabs();
    const ids = Array.isArray(idsToClose) ? idsToClose.filter(Boolean) : [];
    if (ids.length === 0 || tabs.length === 0) return;

    const toClose = new Set(ids);
    const currentTabs = [...tabs];
    const oldActiveIndex = currentTabs.findIndex(
      (tab) => tab.id === getActiveTabId(),
    );

    currentTabs.forEach((tab) => {
      if (!toClose.has(tab.id)) return;
      document.getElementById(`tab-ui-${tab.id}`)?.remove();
      const wv = document.getElementById(`webview-${tab.id}`);
      if (wv) {
        stopWebviewBackgroundTasks(wv);
        const shouldPool = !isTeardown && shouldPoolTabWebview(tab);
        if (!shouldPool || !parkWebviewForReuse(wv, tab)) {
          wv.remove();
        }
      }
    });

    setTabs(currentTabs.filter((tab) => !toClose.has(tab.id)));

    if (getTabs().length === 0) {
      setActiveTabId(null);
      if (!isTeardown) {
        createTab();
        refreshTabScrollControls();
      }
      return;
    }

    if (toClose.has(getActiveTabId())) {
      const fallbackIndex = Math.min(
        Math.max(oldActiveIndex, 0),
        getTabs().length - 1,
      );
      setActiveTabId(getTabs()[fallbackIndex].id);
    }

    switchTab(getActiveTabId() || getTabs()[0].id);
    refreshTabScrollControls();
  }

  function shouldEnableCredentialAutomation(url = "", title = "", tab = null) {
    if (!tab) return false;
    if (tab.launchedAppType === "website") {
      return isLikelyAuthPage(url, title) || isCredentialAutomationDomain(url);
    }
    if (!tab.launchedAppType) {
      return isLikelyAuthPage(url, title) || isCredentialAutomationDomain(url);
    }
    return true;
  }

  function isLikelyAuthPage(rawUrl = "", title = "") {
    const haystack =
      `${String(rawUrl || "")} ${String(title || "")}`.toLowerCase();
    if (
      /login|sign in|signin|password|sso|authenticate|verify/.test(haystack)
    ) {
      return true;
    }
    try {
      const u = new URL(String(rawUrl || ""));
      const pathAndQuery = `${u.pathname.toLowerCase()} ${u.search.toLowerCase()}`;
      return /login|signin|auth|sso|oauth|session|password|verify/.test(
        pathAndQuery,
      );
    } catch (_err) {
      return false;
    }
  }

  function isCredentialAutomationDomain(rawUrl = "") {
    let host = "";
    try {
      host = new URL(String(rawUrl || "")).hostname.toLowerCase();
    } catch (_err) {
      return false;
    }

    return (
      host === "10.215.56.196" ||
      host.endsWith(".gskinternet.com") ||
      host.endsWith(".gskpro.com") ||
      host.endsWith(".veevavault.com") ||
      host.endsWith(".okta.com") ||
      host.endsWith(".oktacdn.com") ||
      host.endsWith(".pingone.com")
    );
  }

  return {
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
    getCurrentProfileId,
    getTabs,
  };
}
