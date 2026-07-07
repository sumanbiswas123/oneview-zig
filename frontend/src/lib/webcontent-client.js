import { PARTITIONS } from "./app-runtime.js";

const controllers = new Map();
let bridgeAttached = false;

function ensureBridge() {
  if (bridgeAttached) return;
  bridgeAttached = true;
  if (window.api && typeof window.api.onWebContentEvent === "function") {
    window.api.onWebContentEvent((packet) => {
      const key = String(packet?.key || "");
      const event = String(packet?.event || "");
      const payload = packet?.payload || {};
      if (!key || !event) return;
      const ctrl = controllers.get(key);
      if (ctrl) ctrl._emit(event, payload);
    });
  }
}

function toBoundsFromElement(el) {
  if (!el) return { x: 0, y: 0, width: 0, height: 0, visible: false };
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  const visible =
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    !el.classList.contains("hidden");
  return {
    x: Math.max(0, Math.round(rect.left)),
    y: Math.max(0, Math.round(rect.top)),
    width: Math.max(0, Math.round(rect.width)),
    height: Math.max(0, Math.round(rect.height)),
    visible,
  };
}

function installModifiedClickBridge(el) {
  if (!el || typeof el.executeJavaScript !== "function") return;
  el
    .executeJavaScript(
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

        const openModifiedLink = (event, anchor) => {
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
          openModifiedLink(event, findAnchor(event));
        }, true);

        document.addEventListener("click", (event) => {
          if (!(event.ctrlKey || event.metaKey)) return;
          openModifiedLink(event, findAnchor(event));
        }, true);

        document.addEventListener("auxclick", (event) => {
          if (event.button !== 1) return;
          openModifiedLink(event, findAnchor(event));
        }, true);

        return true;
      })();
      `,
      true,
    )
    .catch(() => {});
}

class WebContentController {
  constructor({
    key,
    partition = PARTITIONS.guest,
    preloadPath = "",
    additionalArguments = [],
    extensionCompat = false,
    extensionEntryPath = "",
    extensionActiveContext = {},
    initialMeta = {},
  }) {
    this.key = key;
    this.partition = partition;
    this.preloadPath = preloadPath;
    this.additionalArguments = Array.isArray(additionalArguments)
      ? additionalArguments
      : [];
    this.extensionCompat = extensionCompat === true;
    this.extensionEntryPath = String(extensionEntryPath || "").trim();
    this.extensionActiveContext =
      extensionActiveContext &&
      typeof extensionActiveContext === "object"
        ? {
            url: String(extensionActiveContext.url || "").trim(),
            title: String(extensionActiveContext.title || "").trim(),
          }
        : { url: "", title: "" };
    this.initialMeta = initialMeta;
    this.listeners = new Map();
    this.hostElement = null;
    this.destroyed = false;
    this._rafId = null;
    this._syncInFlight = false;
    this._pendingSync = false;
    this._lastBoundsSignature = "";
    this._resizeObserver = null;
    this.state = {
      id: null,
      url: "",
      title: "",
      canGoBack: false,
      canGoForward: false,
      loading: false,
      devToolsOpened: false,
    };
    ensureBridge();
  }

  async init() {
    const res = await window.api.webContentCall("create", {
      key: this.key,
      partition: this.partition,
      preloadPath: this.preloadPath,
      additionalArguments: this.additionalArguments,
      extensionCompat: this.extensionCompat,
      extensionEntryPath: this.extensionEntryPath,
      extensionActiveContext: this.extensionActiveContext,
      meta: this.initialMeta,
    });
    if (!res?.success) {
      throw new Error(res?.message || "Failed to create WebContentsView");
    }
    this.state.id = res.id || null;
    controllers.set(this.key, this);
    return this;
  }

  async destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this._resizeObserver) {
      try {
        this._resizeObserver.disconnect();
      } catch (_err) {}
      this._resizeObserver = null;
    }
    controllers.delete(this.key);
    await window.api.webContentCall("destroy", { key: this.key });
  }

  bindToElement(el) {
    this.hostElement = el;
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(() => {
        this.queueSyncBounds();
      });
      this._resizeObserver.observe(el);
    }
    this.queueSyncBounds();
  }

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(listener);
  }

  off(event, listener) {
    const bucket = this.listeners.get(event);
    if (!bucket) return;
    bucket.delete(listener);
  }

  _emit(event, payload = {}) {
    this.state = {
      ...this.state,
      ...payload,
    };
    const bucket = this.listeners.get(event);
    if (!bucket) return;
    bucket.forEach((listener) => {
      try {
        listener(payload);
      } catch (_err) {}
    });
  }

  async syncBounds(forceVisible = null) {
    if (this.destroyed || !this.hostElement || this._syncInFlight) {
      this._pendingSync = true;
      return;
    }
    this._syncInFlight = true;
    try {
      const b = toBoundsFromElement(this.hostElement);
      const overlayHidden =
        this.hostElement.classList.contains("native-overlay-hidden");
      const visible = overlayHidden
        ? false
        : forceVisible === null
          ? b.visible
          : Boolean(forceVisible);
      const signature = `${b.x}:${b.y}:${b.width}:${b.height}:${visible ? 1 : 0}`;
      if (signature !== this._lastBoundsSignature) {
        this._lastBoundsSignature = signature;
        await window.api.webContentCall("set-bounds", {
          key: this.key,
          bounds: {
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
          },
          visible,
        });
        if (
          visible &&
          this.hostElement?.classList.contains("native-overlay-hidden")
        ) {
          this._lastBoundsSignature = `${b.x}:${b.y}:${b.width}:${b.height}:0`;
          await window.api.webContentCall("hide", { key: this.key });
        }
      }
    } finally {
      this._syncInFlight = false;
      if (this._pendingSync && !this.destroyed) {
        this._pendingSync = false;
        this.queueSyncBounds();
      }
    }
  }

  queueSyncBounds(forceVisible = null) {
    if (this.destroyed) return;
    this.syncBounds(forceVisible);
  }

  async loadURL(url) {
    const targetUrl = String(url || "");
    if (!targetUrl || targetUrl === this.state.url) return { success: true };
    this.state.url = targetUrl;
    return window.api.webContentCall("load-url", {
      key: this.key,
      url: targetUrl,
    });
  }

  async call(method, payload = {}) {
    return window.api.webContentCall(method, {
      key: this.key,
      ...payload,
    });
  }
}

function attachControllerMethods(el, ctrl) {
  const relay = (event) => (payload = {}) => {
    const ev = new Event(event);
    Object.assign(ev, payload);
    el.dispatchEvent(ev);
  };

  [
    "did-start-loading",
    "did-stop-loading",
    "did-finish-load",
    "did-fail-load",
    "page-title-updated",
    "did-navigate",
    "did-navigate-in-page",
    "history-changed",
    "will-navigate",
    "new-window",
    "destroyed",
  ].forEach((event) => ctrl.on(event, relay(event)));

  ctrl.on("did-finish-load", () => installModifiedClickBridge(el));
  ctrl.on("did-navigate-in-page", () => installModifiedClickBridge(el));

  ctrl.on("ipc-message", (payload) => {
    const ev = new Event("ipc-message");
    ev.channel = payload.channel;
    ev.args = payload.args || [];
    el.dispatchEvent(ev);
  });

  el._webContent = ctrl;
  el.getURL = () => String(ctrl.state.url || "");
  el.getTitle = () => String(ctrl.state.title || "");
  el.canGoBack = () => Boolean(ctrl.state.canGoBack);
  el.canGoForward = () => Boolean(ctrl.state.canGoForward);
  el.goBack = () => ctrl.call("go-back");
  el.goForward = () => ctrl.call("go-forward");
  el.reload = () => ctrl.call("reload");
  el.reloadIgnoringCache = () => ctrl.call("reload-ignoring-cache");
  el.executeJavaScript = (code, userGesture = false) =>
    ctrl
      .call("execute-javascript", { code, userGesture })
      .then((res) => {
        const val = res?.result;
        if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch (e) {
            return val;
          }
        }
        return val;
      });
  el.insertCSS = (css) =>
    ctrl.call("insert-css", { css }).then((res) => res?.key || null);
  el.setZoomFactor = (zoom) => ctrl.call("set-zoom-factor", { zoom });
  el.getWebContentsId = () => ctrl.state.id;
  el.isDevToolsOpened = () => Boolean(ctrl.state.devToolsOpened);
  el.openDevTools = () => ctrl.call("open-devtools");
  el.closeDevTools = () => ctrl.call("close-devtools");
  el.show = () => ctrl.call("show");
  el.focusWebContents = () => ctrl.call("focus");
  el.hide = () => ctrl.call("hide");
  el.setMeta = (meta) => ctrl.call("set-meta", { meta });
  el.isDestroyed = () => ctrl.destroyed;
  el.syncBounds = (forceVisible = null) => ctrl.queueSyncBounds(forceVisible);
  el.capturePage = async (options = {}) => {
    try {
      const result = await ctrl.call("capture-page", options);
      if (result?.success === false) {
        throw new Error(result?.message || "Failed to capture page");
      }
      const dataUrl = result?.dataUrl || "";
      const width = Number(result?.width || 0);
      const height = Number(result?.height || 0);
      // Return an object that mimics NativeImage interface
      return {
        isEmpty: () => !dataUrl,
        toDataURL: () => dataUrl,
        getSize: () => ({ width, height }),
      };
    } catch (error) {
      throw error;
    }
  };

  let srcValue = "";
  Object.defineProperty(el, "src", {
    get() {
      return srcValue;
    },
    set(url) {
      srcValue = String(url || "");
      if (!srcValue) return;
      ctrl.loadURL(srcValue);
    },
    configurable: true,
  });

  const originalRemove = el.remove.bind(el);
  el.remove = () => {
    ctrl.destroy();
    originalRemove();
  };
}

export async function createWebContentHostElement({
  key,
  partition = PARTITIONS.guest,
  preloadPath = "",
  additionalArguments = [],
  extensionCompat = false,
  extensionEntryPath = "",
  extensionActiveContext = {},
  initialMeta = {},
  className = "webcontent-pane",
}) {
  const el = document.createElement("div");
  el.className = className;
  const ctrl = new WebContentController({
    key,
    partition,
    preloadPath,
    additionalArguments,
    extensionCompat,
    extensionEntryPath,
    extensionActiveContext,
    initialMeta,
  });
  await ctrl.init();
  ctrl.bindToElement(el);
  attachControllerMethods(el, ctrl);
  return el;
}

export function resyncAllWebContentBounds() {
  controllers.forEach((ctrl) => {
    ctrl.queueSyncBounds();
  });
}
window.resyncAllWebContentBounds = resyncAllWebContentBounds;

export function hideAllWebContents() {
  controllers.forEach((ctrl) => {
    ctrl.call("hide").catch(() => {});
    ctrl.queueSyncBounds(false);
  });
}
window.hideAllWebContents = hideAllWebContents;

window.addEventListener("resize", () => {
  resyncAllWebContentBounds();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    resyncAllWebContentBounds();
  }
});
