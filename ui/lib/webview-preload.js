// Shim for Electron contextBridge and ipcRenderer to zero-native
const contextBridge = {
  exposeInMainWorld: (key, value) => {
    window[key] = value;
  }
};

const ipcRenderer = {
  invoke: async (channel, ...args) => {
    let route = channel;
    let payload = args[0] || {};
    
    // Direct command routing mappings
    if (channel === "unzip-file") {
      route = "trigger_unzip";
      payload = { zipPath: payload.zipPath, extractPath: payload.extractPath };
    } else if (channel === "verify-login" || channel === "credential-store:save") {
      route = "save_credentials";
      payload = { service: args[0], username: args[1], password: args[2] };
    } else if (channel === "platform:oneview:tickets:fetch") {
      route = "fetch_tickets";
    }

    try {
      if (window.zero && typeof window.zero.invoke === "function") {
        return await window.zero.invoke(route, payload);
      }
      if (window.api && typeof window.api.webContentCall === "function") {
        if (channel === "browser-extension:host:capture-page") {
          const res = await window.api.webContentCall("capture-active-tab", payload);
          if (res && res.success && res.result && res.result.dataUrl && res.result.dataUrl.startsWith("http")) {
            try {
              // Retrieve unpatched fetch/FileReader locally in the popup context
              const nativeFetch = window.fetch.bind(window);
              const response = await nativeFetch(res.result.dataUrl);
              const blob = await response.blob();
              const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              res.result.dataUrl = dataUrl;
            } catch (e) {
              console.error("Failed to fetch capture result from local endpoint in preload", e);
            }
          }
          // The popup expects response.result to be the capture payload object {dataUrl, width, height, mode}
          return { success: res.success, result: res.result || { dataUrl: res.dataUrl, width: res.width, height: res.height, mode: res.mode } };
        }
      }
      console.warn(`[Zero-Native Bridge] window.zero.invoke is unavailable for channel: ${channel}`);
      return { success: false, message: "Bridge unavailable" };
    } catch (err) {
      return { success: false, message: err.message || String(err) };
    }
  },
  on: (channel, callback) => {
    // Zero-native listener mapping
    document.addEventListener(`zero:${channel}`, (e) => callback(e, e.detail));
  },
  removeListener: (channel, callback) => {
    document.removeEventListener(`zero:${channel}`, callback);
  },
  send: (channel, ...args) => {
    console.log(`[Zero-Native send] Send to ${channel}:`, args);
  },
  sendSync: (channel, ...args) => {
    console.log(`[Zero-Native sendSync] SendSync to ${channel}:`, args);
    return { success: true };
  }
};
function readArgValue(prefix = "") {
  const match = (Array.isArray(process.argv) ? process.argv : []).find((arg) =>
    String(arg || "").startsWith(prefix),
  );
  return match ? String(match).slice(prefix.length) : "";
}

function decodeArgValue(prefix = "") {
  const raw = readArgValue(prefix);
  try {
    return raw ? decodeURIComponent(raw) : "";
  } catch (_error) {
    return raw || "";
  }
}

const APP_PROTOCOL_SCHEME =
  readArgValue("--oneview-app-protocol=") ||
  (String(process.env.ONEVIEW_APP_ENV || "").trim().toLowerCase() === "prod"
    ? "oneview"
    : "oneview-dev");
const PLATFORM_API_ENABLED =
  readArgValue("--oneview-enable-platform-api=") === "1";
const EXTENSION_ID = decodeArgValue("--oneview-extension-id=");
const EXTENSION_PATH = decodeArgValue("--oneview-extension-path=");
const EXTENSION_MANIFEST_PATH = decodeArgValue("--oneview-extension-manifest-path=");
const EXTENSION_NAME = decodeArgValue("--oneview-extension-name=");
const EXTENSION_ROOT_URL = decodeArgValue("--oneview-extension-root-url=");
const EXTENSION_ACTIVE_TAB_URL = decodeArgValue("--oneview-extension-active-url=");
const EXTENSION_ACTIVE_TAB_TITLE = decodeArgValue("--oneview-extension-active-title=");
const EXTENSION_MANIFEST = (() => {
  const raw = decodeArgValue("--oneview-extension-manifest-json=");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (_error) {
    return {};
  }
})();

function readRuntimeExtensionContext() {
  try {
    const response = ipcRenderer.sendSync("browser-extension:bridge:context-sync");
    if (response?.success) {
      return {
        id: String(response.id || ""),
        path: String(response.path || ""),
        manifestPath: String(response.manifestPath || ""),
        name: String(response.name || ""),
        rootUrl: String(response.rootUrl || ""),
        activeUrl: String(response.activeUrl || ""),
        activeTitle: String(response.activeTitle || ""),
        manifest:
          response.manifest &&
          typeof response.manifest === "object" &&
          !Array.isArray(response.manifest)
            ? response.manifest
            : {},
      };
    }
  } catch (_error) {}
  return {
    id: EXTENSION_ID,
    path: EXTENSION_PATH,
    manifestPath: EXTENSION_MANIFEST_PATH,
    name: EXTENSION_NAME,
    rootUrl: EXTENSION_ROOT_URL,
    activeUrl: EXTENSION_ACTIVE_TAB_URL,
    activeTitle: EXTENSION_ACTIVE_TAB_TITLE,
    manifest: EXTENSION_MANIFEST,
  };
}

function getEmbeddedOneviewContext() {
  return {
    appId: readArgValue("--oneview-app-id="),
  };
}

function createPlatformApi() {
  const oneviewContext = getEmbeddedOneviewContext();
  return {
    fs: {
      readDir: (targetPath) => ipcRenderer.invoke("platform:fs:readDir", targetPath),
      readFile: (filePath, options) =>
        ipcRenderer.invoke("platform:fs:readFile", filePath, options),
      writeFile: (filePath, content) =>
        ipcRenderer.invoke("platform:fs:writeFile", filePath, content),
      createDir: (dirPath) => ipcRenderer.invoke("platform:fs:createDir", dirPath),
      exists: (targetPath) => ipcRenderer.invoke("platform:fs:exists", targetPath),
    },
    dialog: {
      showOpenDialog: (options) =>
        ipcRenderer.invoke("platform:dialog:showOpenDialog", options),
      showSaveDialog: (options) =>
        ipcRenderer.invoke("platform:dialog:showSaveDialog", options),
      showMessageBox: (options) =>
        ipcRenderer.invoke("platform:dialog:showMessageBox", options),
    },
    env: {
      get: () => ipcRenderer.invoke("platform:env:get"),
      getPath: (name) => ipcRenderer.invoke("platform:app:getPath", name),
    },
    app: {
      getVersion: () => ipcRenderer.invoke("app:get-version"),
      checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
      openDefaultAppSettings: () => ipcRenderer.invoke("open-default-app-settings"),
      getDefaultOpenHandlingStatus: () =>
        ipcRenderer.invoke("get-default-open-handling-status"),
    },
    browser: {
      tabs: {
        create: (payload = {}) =>
          ipcRenderer.invoke("browser-extension:compat:tabs:create", payload),
        update: (payload = {}) =>
          ipcRenderer.invoke("browser-extension:compat:tabs:update", payload),
      },
    },
    downloads: {
      list: () => ipcRenderer.invoke("download-manager:list"),
      action: (payload) => ipcRenderer.invoke("download-manager:action", payload),
      onUpdated: (listener) => {
        if (typeof listener !== "function") return () => {};
        const wrapped = (_event, payload) => listener(payload);
        ipcRenderer.on("download-manager-updated", wrapped);
        return () => ipcRenderer.removeListener("download-manager-updated", wrapped);
      },
    },
    extensions: {
      list: () => ipcRenderer.invoke("browser-extensions:list"),
      addUnpacked: () => ipcRenderer.invoke("browser-extensions:add-unpacked"),
      remove: (payload) => ipcRenderer.invoke("browser-extensions:remove", payload),
      toggle: (payload) => ipcRenderer.invoke("browser-extensions:toggle", payload),
      reload: (payload) => ipcRenderer.invoke("browser-extensions:reload", payload),
    },
    oneview: {
      context: {
        get: () => ({ ...oneviewContext }),
      },
      storage: {
        set: (key, value) =>
          ipcRenderer.invoke("platform:oneview:storage:set", { key, value }),
        get: (key) =>
          ipcRenderer.invoke("platform:oneview:storage:get", { key }),
        list: () => ipcRenderer.invoke("platform:oneview:storage:list"),
        remove: (key) =>
          ipcRenderer.invoke("platform:oneview:storage:remove", { key }),
        clear: () => ipcRenderer.invoke("platform:oneview:storage:clear"),
      },
      tracking: {
        track: (eventName, payload = null, options = {}) =>
          ipcRenderer.invoke("oneview:embedded-tracking:track", {
            eventName,
            payload,
            appId: options?.appId || oneviewContext.appId || "",
            appName: options?.appName || "",
            appType: options?.appType || "",
          }),
        get: (appId = "") =>
          ipcRenderer.invoke("oneview:embedded-tracking:get", { appId }),
        list: () => ipcRenderer.invoke("oneview:embedded-tracking:list"),
        clear: (appId = "") =>
          ipcRenderer.invoke("oneview:embedded-tracking:clear", { appId }),
      },
    },
    capabilities: {
      get: () => ipcRenderer.invoke("platform:capabilities:get"),
    },
  };
}

function resolveExtensionNavigationUrl(rawUrl = "") {
  const value = String(rawUrl || "").trim();
  if (!value) return "";
  
  let resolved = value;
  const isAbsolute = /^(https?|file|data|javascript|about|oneview|oneview-dev):/i.test(value) || 
                     (APP_PROTOCOL_SCHEME && value.toLowerCase().startsWith(APP_PROTOCOL_SCHEME.toLowerCase() + ":"));
                     
  if (!isAbsolute) {
    try {
      resolved = new URL(value, String(window.location.href || "")).toString();
    } catch (_error) {
      resolved = value;
    }
  }

  // Rewrite file:/// extension path to the custom app protocol scheme
  const context = readRuntimeExtensionContext();
  const extId = context.id || EXTENSION_ID;
  const extRootUrl = context.rootUrl || EXTENSION_ROOT_URL;

  if (extId && extRootUrl && resolved.toLowerCase().startsWith("file:")) {
    const normResolved = resolved.replace(/\\/g, "/").replace(/^file:\/\/\/+/, "file:///");
    const normRoot = extRootUrl.replace(/\\/g, "/").replace(/^file:\/\/\/+/, "file:///");
    
    if (normResolved.toLowerCase().startsWith(normRoot.toLowerCase())) {
      const relativePart = normResolved.slice(normRoot.length).replace(/^\/+/, "");
      return `${APP_PROTOCOL_SCHEME}://${extId}/${relativePart}`;
    }
  }

  return resolved;
}

function canBridgeNavigationToHost(rawUrl = "") {
  const value = String(rawUrl || "").trim();
  if (!value) return false;
  if (/^javascript:/i.test(value)) return false;
  if (/^data:/i.test(value)) return false;
  if (/^about:blank$/i.test(value)) return false;
  return true;
}

async function requestHostTabOpen(rawUrl = "", options = {}) {
  const url = resolveExtensionNavigationUrl(rawUrl);
  if (!canBridgeNavigationToHost(url)) return false;
  try {
    const response = await ipcRenderer.invoke("browser-extension:compat:tabs:create", {
      url,
      active: options?.active !== false,
    });
    return Boolean(response?.success);
  } catch (_error) {
    return false;
  }
}

function installHostNavigationBridge() {
  if (window.__oneviewHostNavigationBridgeInstalled) return;
  window.__oneviewHostNavigationBridgeInstalled = true;
 
  const findAnchor = (event) => {
    const path = typeof event?.composedPath === "function" ? event.composedPath() : [];
    for (const node of path) {
      if (node && typeof node.closest === "function") {
        const anchor = node.closest("a[href]");
        if (anchor) return anchor;
      }
    }
    return event?.target && typeof event.target.closest === "function"
      ? event.target.closest("a[href]")
      : null;
  };

  const stopEvent = (event) => {
    if (!event) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
  };

  const handleAnchorNavigation = (event, { active = true } = {}) => {
    const anchor = findAnchor(event);
    if (!anchor || anchor.hasAttribute("download")) return false;
    const target = String(anchor.getAttribute("target") || "").trim().toLowerCase();
    const href = anchor.href || anchor.getAttribute("href") || "";
    const shouldBridge =
      target === "_blank" || Boolean(event?.ctrlKey || event?.metaKey || event?.button === 1);
    if (!shouldBridge || !canBridgeNavigationToHost(href)) return false;
    stopEvent(event);
    void requestHostTabOpen(href, { active });
    return true;
  };

  document.addEventListener(
    "click",
    (event) => {
      if (!event?.isTrusted) return;
      handleAnchorNavigation(event, {
        active: !(event.ctrlKey || event.metaKey),
      });
    },
    true,
  );

  document.addEventListener(
    "auxclick",
    (event) => {
      if (!event?.isTrusted || event.button !== 1) return;
      handleAnchorNavigation(event, { active: false });
    },
    true,
  );

  const originalOpen = typeof window.open === "function" ? window.open.bind(window) : null;
  window.open = function oneviewOpen(url = "", target = "_blank", features) {
    const normalizedTarget = String(target || "").trim().toLowerCase();
    const bridgeToHost = !normalizedTarget || normalizedTarget === "_blank";
    if (!bridgeToHost) {
      return originalOpen ? originalOpen(url, target, features) : null;
    }

    let currentHref = String(url || "").trim();
    let openRequested = false;
    const maybeOpen = (nextUrl) => {
      currentHref = String(nextUrl || "").trim();
      if (openRequested || !canBridgeNavigationToHost(currentHref)) return;
      openRequested = true;
      void requestHostTabOpen(currentHref, { active: true });
    };

    maybeOpen(currentHref);

    const locationState = {
      assign: (value) => maybeOpen(value),
      replace: (value) => maybeOpen(value),
      toString: () => currentHref,
    };
    Object.defineProperty(locationState, "href", {
      configurable: true,
      enumerable: true,
      get: () => currentHref,
      set: (value) => {
        maybeOpen(value);
      },
    });

    return {
      closed: false,
      opener: null,
      focus: () => {},
      blur: () => {},
      close: () => {},
      postMessage: () => {},
      location: locationState,
    };
  };
}

function installHostContextMenuBridge() {
  if (window.__oneviewHostContextMenuBridgeInstalled) return;
  window.__oneviewHostContextMenuBridgeInstalled = true;

  const findAnchor = (node) =>
    node && typeof node.closest === "function" ? node.closest("a[href]") : null;
  const findImage = (node) =>
    node && typeof node.closest === "function" ? node.closest("img[src]") : null;
  const isEditableTarget = (node) => {
    if (!node || typeof node.matches !== "function") return false;
    if (node.matches("textarea, input, [contenteditable='true'], [contenteditable='']")) {
      return true;
    }
    return Boolean(node.closest?.("[contenteditable='true'], [contenteditable='']"));
  };

  document.addEventListener(
    "contextmenu",
    (event) => {
      if (!event?.isTrusted) return;
      const target = event.target;
      const anchor = findAnchor(target);
      const image = findImage(target);
      const selectionText = String(window.getSelection?.()?.toString?.() || "").trim();
      const payload = {
        x: Math.round(event.x || event.clientX || 0),
        y: Math.round(event.y || event.clientY || 0),
        pageURL: String(window.location.href || ""),
        linkURL: anchor?.href || anchor?.getAttribute?.("href") || "",
        srcURL: image?.src || image?.getAttribute?.("src") || "",
        selectionText,
        isEditable: isEditableTarget(target),
      };

      const inputLike =
        target && typeof target.matches === "function" && target.matches("input, textarea")
          ? target
          : target?.closest?.("input, textarea") || null;
      payload.editFlags = {
        canUndo: payload.isEditable,
        canRedo: payload.isEditable,
        canCut: payload.isEditable,
        canCopy: Boolean(selectionText) || payload.isEditable,
        canPaste: payload.isEditable,
        canSelectAll: payload.isEditable,
      };
      if (inputLike) {
        const value = String(inputLike.value || "");
        const start = Number(inputLike.selectionStart);
        const end = Number(inputLike.selectionEnd);
        payload.selectionText =
          Number.isFinite(start) && Number.isFinite(end) && end > start
            ? value.slice(start, end)
            : payload.selectionText;
        payload.editFlags.canCut = Boolean(payload.selectionText);
        payload.editFlags.canCopy = Boolean(payload.selectionText);
        payload.editFlags.canSelectAll = value.length > 0;
      }

      // Restored default context menu to allow standard browser right-click actions (copy, paste, inspect)
      // event.preventDefault();
      // event.stopPropagation();
      // if (typeof event.stopImmediatePropagation === "function") {
      //   event.stopImmediatePropagation();
      // }
      // ipcRenderer.invoke("show-webcontent-context-menu", payload).catch(() => {});
    },
    true,
  );
}

function createExtensionBridge() {
  const runtimeContext = readRuntimeExtensionContext();
  const manifest = runtimeContext.manifest || {};
  const activeTab = {
    id: -1,
    active: true,
    highlighted: true,
    url: runtimeContext.activeUrl || EXTENSION_ACTIVE_TAB_URL,
    title: runtimeContext.activeTitle || EXTENSION_ACTIVE_TAB_TITLE,
  };

  const withCallbackSupport = (executor, callback) => {
    const promise = Promise.resolve().then(executor);
    if (typeof callback === "function") {
      promise.then(
        (value) => callback(value),
        () => callback(),
      );
      return undefined;
    }
    return promise;
  };

  return {
    capabilities: {
      get: () => ipcRenderer.invoke("browser-extension:bridge:capabilities"),
    },
    manifest: {
      get: () => ({ ...manifest }),
    },
    runtime: {
      getInfo: () => ({
        id: runtimeContext.id,
        name: runtimeContext.name || manifest.name || "",
        path: runtimeContext.path,
        manifestPath: runtimeContext.manifestPath,
      }),
      getManifest: () => ({ ...manifest }),
      openPage: async (pageType = "root") => {
        const entrypoints =
          manifest?.entrypoints && typeof manifest.entrypoints === "object"
            ? manifest.entrypoints
            : {};
        const nextTarget =
          pageType === "popup"
            ? entrypoints.popup || entrypoints.root || ""
            : pageType === "options"
              ? entrypoints.options || ""
              : pageType === "sidePanel"
                ? entrypoints.sidePanel || ""
                : entrypoints.root || entrypoints.popup || "";
        const url = resolveExtensionNavigationUrl(nextTarget);
        if (!url) return false;
        const response = await ipcRenderer.invoke("browser-extension:compat:tabs:create", {
          url,
          active: true,
        });
        if (!response?.success) {
          throw new Error(response?.message || "Could not open extension page");
        }
        return true;
      },
    },
    host: {
      activeTab: {
        get: () => ({ ...activeTab }),
      },
      executeScript: async (source = "") => {
        const response = await ipcRenderer.invoke(
          "browser-extension:host:execute-script",
          { source: String(source || "") },
        );
        if (!response?.success) {
          throw new Error(response?.message || "Could not execute active-tab script");
        }
        return response?.result;
      },
      capturePage: async (options = {}) => {
        const response = await ipcRenderer.invoke(
          "browser-extension:host:capture-page",
          options,
        );
        if (!response?.success) {
          throw new Error(response?.message || "Could not capture the active tab");
        }
        return response?.result || {};
      },
      tabs: {
        query: (queryInfo = {}, callback) =>
          withCallbackSupport(() => {
            const info = queryInfo && typeof queryInfo === "object" ? queryInfo : {};
            const wantsCurrent =
              info.active === true ||
              info.currentWindow === true ||
              info.lastFocusedWindow === true;
            if (!wantsCurrent) {
              return activeTab.url || activeTab.title ? [activeTab] : [];
            }
            return activeTab.url || activeTab.title ? [activeTab] : [];
          }, callback),
        create: (createProperties = {}, callback) =>
          withCallbackSupport(async () => {
            const url = resolveExtensionNavigationUrl(createProperties?.url);
            const response = await ipcRenderer.invoke(
              "browser-extension:compat:tabs:create",
              {
                url,
                active: createProperties?.active !== false,
              },
            );
            if (!response?.success) {
              throw new Error(response?.message || "Could not create tab");
            }
            return response?.result || { ...activeTab, url };
          }, callback),
        createMany: (entries = [], callback) =>
          withCallbackSupport(async () => {
            const payloadEntries = (Array.isArray(entries) ? entries : [])
              .map((entry) => ({
                url: resolveExtensionNavigationUrl(entry?.url),
                active: entry?.active !== false,
              }))
              .filter((entry) => entry.url);
            const response = await ipcRenderer.invoke(
              "browser-extension:compat:tabs:create-many",
              {
                entries: payloadEntries,
              },
            );
            if (!response?.success) {
              throw new Error(response?.message || "Could not create extension tabs");
            }
            return Array.isArray(response?.result?.tabs) ? response.result.tabs : [];
          }, callback),
        close: (tabId, callback) =>
          withCallbackSupport(async () => {
            const response = await ipcRenderer.invoke(
              "browser-extension:compat:tabs:close",
              {
                tabId: String(tabId || "").trim(),
              },
            );
            if (!response?.success) {
              throw new Error(response?.message || "Could not close tab");
            }
            return response?.result || { id: String(tabId || "").trim(), closed: true };
          }, callback),
        update: (tabId, updateProperties = {}, callback) =>
          withCallbackSupport(async () => {
            const url = resolveExtensionNavigationUrl(updateProperties?.url);
            const response = await ipcRenderer.invoke(
              "browser-extension:compat:tabs:update",
              {
                url,
                active: updateProperties?.active !== false,
              },
            );
            if (!response?.success) {
              throw new Error(response?.message || "Could not update tab");
            }
            return response?.result || { ...activeTab, url: url || activeTab.url };
          }, callback),
      },
    },
    fs: {
      readDir: (targetPath) =>
        ipcRenderer.invoke("browser-extension:bridge:fs:read-dir", targetPath),
      readFile: (filePath, options) =>
        ipcRenderer.invoke("browser-extension:bridge:fs:read-file", filePath, options),
      writeFile: (filePath, content) =>
        ipcRenderer.invoke("browser-extension:bridge:fs:write-file", filePath, content),
      createDir: (dirPath) =>
        ipcRenderer.invoke("browser-extension:bridge:fs:create-dir", dirPath),
      exists: (targetPath) =>
        ipcRenderer.invoke("browser-extension:bridge:fs:exists", targetPath),
      remove: (targetPath) =>
        ipcRenderer.invoke("browser-extension:bridge:fs:remove", targetPath),
      rename: (sourcePath, targetPath) =>
        ipcRenderer.invoke("browser-extension:bridge:fs:rename", sourcePath, targetPath),
      extract: (zipPath, extractPath, options = {}) =>
        ipcRenderer.invoke("unzip-file", { zipPath, extractPath, ...options }),
    },
    os: {
      info: () => ipcRenderer.invoke("browser-extension:bridge:os:info"),
      getPath: (name) =>
        ipcRenderer.invoke("browser-extension:bridge:os:get-path", name),
      openPath: (targetPath) =>
        ipcRenderer.invoke("browser-extension:bridge:os:open-path", targetPath),
    },
    dialog: {
      showOpenDialog: (options) =>
        ipcRenderer.invoke("browser-extension:bridge:dialog:show-open", options),
      showSaveDialog: (options) =>
        ipcRenderer.invoke("browser-extension:bridge:dialog:show-save", options),
      showMessageBox: (options) =>
        ipcRenderer.invoke("browser-extension:bridge:dialog:show-message", options),
    },
    storage: {
      get: (key) => ipcRenderer.invoke("platform:oneview:storage:get", { key }),
      set: (key, value) => ipcRenderer.invoke("platform:oneview:storage:set", { key, value }),
    },
    downloads: {
      setOverridePath: (overridePath) =>
        ipcRenderer.invoke("download-manager:set-override-path", { overridePath }),
    },
    ui: {
      prompt: async (options = {}) => {
        const response = await ipcRenderer.invoke("browser-extension:bridge:ui:prompt", options);
        if (!response?.success && !response?.result?.cancelled) {
          throw new Error(response?.message || "Could not open extension prompt");
        }
        return response?.result || { cancelled: true, value: "" };
      },
      resizePopup: (width, height) =>
        ipcRenderer.invoke("browser-extension-popup:resize", { width, height }),
      getTheme: () =>
        ipcRenderer.invoke("browser-extension:bridge:ui:get-theme"),
    },
  };
}

function isCurrentExtensionPage() {
  const runtimeContext = readRuntimeExtensionContext();
  let extensionId = runtimeContext.id || EXTENSION_ID;
  const extensionRootUrl = String(runtimeContext.rootUrl || EXTENSION_ROOT_URL || "").trim();
  
  try {
    const href = String(window.location.href || "").trim();
    if (!href) return false;

    // Fallback: If extensionId is missing, try to extract it from the app protocol URL host
    if (!extensionId && href.startsWith(`${APP_PROTOCOL_SCHEME}://`)) {
      try {
        const url = new URL(href);
        if (url.protocol === `${APP_PROTOCOL_SCHEME}:`) {
          extensionId = url.host;
        }
      } catch (_e) {}
    }

    if (!extensionId) return false;

    // Case-insensitive match for Windows paths
    const lowerHref = href.toLowerCase();
    const lowerRoot = extensionRootUrl.toLowerCase();
    
    if (lowerRoot && lowerHref.startsWith(lowerRoot)) return true;

    // Authorize pages loaded via the app protocol (e.g. oneview-dev://sitesnap-studio-pro/)
    if (extensionId && lowerHref.startsWith(`${APP_PROTOCOL_SCHEME}://${extensionId.toLowerCase()}/`)) {
      return true;
    }

    // Handle file:/// vs file:// differences on Windows
    if (lowerRoot.startsWith("file://") && !lowerRoot.startsWith("file:///")) {
       const tripleRoot = lowerRoot.replace("file://", "file:///");
       if (lowerHref.startsWith(tripleRoot)) return true;
    } else if (lowerRoot.startsWith("file:///")) {
       const doubleRoot = lowerRoot.replace("file:///", "file://");
       if (lowerHref.startsWith(doubleRoot)) return true;
    }

    return false;
  } catch (_error) {
    return false;
  }
}

function exposeGlobal(name, value) {
  if (!value) return;
  try {
    contextBridge.exposeInMainWorld(name, value);
  } catch (_error) {
    window[name] = value;
  }
}

function installCredentialFieldBridge() {
  if (window.__oneviewCredentialFieldBridgeInstalled) return;
  window.__oneviewCredentialFieldBridgeInstalled = true;

  const isCredentialLike = (el) => {
    if (!el || el.tagName !== "INPUT") return false;
    const type = String(el.type || "").toLowerCase();
    if (type === "password") return true;
    const name = String(el.name || "").toLowerCase();
    const id = String(el.id || "").toLowerCase();
    const autocomplete = String(el.autocomplete || "").toLowerCase();
    const placeholder = String(el.placeholder || "").toLowerCase();
    const bag = `${name} ${id} ${autocomplete} ${placeholder}`;
    return /user|login|email|identifier|account/.test(bag);
  };

  const handleFieldInteraction = (event) => {
    const target = event.target;
    if (!isCredentialLike(target)) {
      if (event.type === "click") {
        hideDropdown();
      }
      return;
    }

    const rect = target.getBoundingClientRect();
    window.__oneviewActiveCredentialField = target;

    ipcRenderer.sendToHost("oneview:credential-field-focused", {
      value: target.value,
      type: target.type,
      rect: {
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
        width: rect.width,
        height: rect.height,
      },
    });
  };

  const hideDropdown = () => {
    const existing = document.getElementById("oneview-credential-dropdown");
    if (existing) existing.remove();
  };

  window.__oneviewShowCredentialDropdown = (creds) => {
    hideDropdown();
    if (!creds || creds.length === 0 || !window.__oneviewActiveCredentialField) return;

    const target = window.__oneviewActiveCredentialField;
    const rect = target.getBoundingClientRect();

    const dropdown = document.createElement("div");
    dropdown.id = "oneview-credential-dropdown";
    
    // Inject Styles
    if (!document.getElementById("oneview-credential-styles")) {
      const style = document.createElement("style");
      style.id = "oneview-credential-styles";
      style.textContent = `
        #oneview-credential-dropdown {
          position: fixed;
          z-index: 2147483647;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 14px;
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.15);
          min-width: 260px;
          max-width: 320px;
          max-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          padding: 8px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          animation: oneviewFadeIn 0.2s ease-out;
        }
        @keyframes oneviewFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .oneview-cred-header {
          padding: 8px 16px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          margin-bottom: 4px;
        }
        .oneview-cred-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .oneview-cred-item:hover {
          background: rgba(0, 0, 0, 0.04);
        }
        .oneview-cred-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        .oneview-cred-body {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }
        .oneview-cred-username {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .oneview-cred-profile {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
        }
        @media (prefers-color-scheme: dark) {
          #oneview-credential-dropdown {
            background: rgba(30, 41, 59, 0.85);
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          }
          .oneview-cred-username { color: #f1f5f9; }
          .oneview-cred-profile { color: #94a3b8; }
          .oneview-cred-item:hover { background: rgba(255, 255, 255, 0.05); }
        }
      `;
      document.head.appendChild(style);
    }

    let html = `<div class="oneview-cred-header">Use Saved Credential</div>`;
    creds.forEach((cred, idx) => {
      const initials = String(cred.username || "U").charAt(0).toUpperCase();
      const color = cred.profileColor || "#6366f1";
      html += `
        <div class="oneview-cred-item" data-index="${idx}">
          <div class="oneview-cred-icon" style="background-color: ${color}">${initials}</div>
          <div class="oneview-cred-body">
            <span class="oneview-cred-username">${cred.username}</span>
            <span class="oneview-cred-profile">${cred.profileName} Profile</span>
          </div>
        </div>
      `;
    });

    dropdown.innerHTML = html;
    
    // Position
    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;
    
    // Flip if no space below
    if (top + 250 > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - 250 - 4;
    }
    
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
    
    document.body.appendChild(dropdown);

    // Events
    dropdown.querySelectorAll(".oneview-cred-item").forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(item.dataset.index);
        const selected = creds[idx];
        ipcRenderer.sendToHost("oneview:credential-selected", selected);
        hideDropdown();
      };
    });

    // Auto hide on scroll or click elsewhere
    const scrollHandler = () => hideDropdown();
    window.addEventListener("scroll", scrollHandler, { once: true });
    document.addEventListener("mousedown", (e) => {
      if (!dropdown.contains(e.target)) hideDropdown();
    }, { once: true });
  };

  document.addEventListener("focusin", handleFieldInteraction, true);
  document.addEventListener("click", handleFieldInteraction, true);
}

try {
  installHostNavigationBridge();
  installHostContextMenuBridge();
  installCredentialFieldBridge();

  if (PLATFORM_API_ENABLED) {
    exposeGlobal("platform", createPlatformApi());
  }

  const runtimeContext = readRuntimeExtensionContext();
  const activeExtensionId = runtimeContext.id || EXTENSION_ID;
  const cleanUrl = (u) => String(u || "").split("#")[0].toLowerCase().trim();
  const isHostPage = EXTENSION_ACTIVE_TAB_URL && cleanUrl(window.location.href) === cleanUrl(EXTENSION_ACTIVE_TAB_URL);
  const isVeevaPage = cleanUrl(window.location.href).includes("veevavault.com") || cleanUrl(window.location.href).includes("veeva.com");
  if (isCurrentExtensionPage() || isHostPage || isVeevaPage) {
    const bridge = createExtensionBridge();
    exposeGlobal("oneviewExtension", bridge);
    exposeGlobal("oneview", bridge);
  }

  window.addEventListener("load", () => {
    const href = String(window.location.href || "");
    if (href.startsWith(`${APP_PROTOCOL_SCHEME}://`)) {
      console.log("[OneView][WebviewPreload] OneView app loaded", href);
    }
  });
} catch (error) {
  console.error("[OneView][WebviewPreload] Failed to initialize", error);
}
