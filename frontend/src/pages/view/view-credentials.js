import { escapeHtml } from "../../lib/utils.js";

export function createViewCredentialsManager({
  state,
  constants,
  showToast,
  openOverlayModal,
  closeOverlayModal,
  renderProfilePillSelect,
  resolveCredentialScopeIdForTab,
  applyProfileSelection,
  getCurrentProfileId,
  escapeHtml,
}) {
  const { AUTH_GATEWAY_HOSTS, RESOURCE_SERVICE_ORIGIN } = constants;

  const getActiveTabId = () => state.activeTabId;
  const getCredentialCache = () => state.credentialCache;
  const setCredentialCache = (value) => {
    state.credentialCache = value;
  };
  const getPasswordProfileId = () => state.passwordProfileId;
  const setPasswordProfileId = (value) => {
    state.passwordProfileId = value;
  };
  const getPasswordEditTarget = () => state.passwordEditTarget;
  const setPasswordEditTarget = (value) => {
    state.passwordEditTarget = value;
  };
  const getActiveHttpAuthChallenge = () => state.activeHttpAuthChallenge;
  const setActiveHttpAuthChallenge = (value) => {
    state.activeHttpAuthChallenge = value;
  };
  const getCredentialCacheRefreshedAt = () => state.credentialCacheRefreshedAt;
  const setCredentialCacheRefreshedAt = (value) => {
    state.credentialCacheRefreshedAt = value;
  };
  const getCredentialCacheRefreshInFlight = () =>
    state.credentialCacheRefreshInFlight;
  const setCredentialCacheRefreshInFlight = (value) => {
    state.credentialCacheRefreshInFlight = value;
  };

  const rememberPromptCooldown = new Map();

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

  function canUseSecureCredentialApi() {
    return Boolean(
      window.api &&
        typeof window.api.listProfileCredentials === "function" &&
        typeof window.api.saveProfileCredential === "function" &&
        typeof window.api.deleteProfileCredential === "function",
    );
  }

  function normalizeDomain(raw = "") {
    const val = String(raw).trim().toLowerCase();
    if (!val) return "";
    try {
      const parsed = new URL(val);
      const hostname = String(parsed.hostname || "")
        .trim()
        .toLowerCase()
        .replace(/^www\./, "");
      const port = String(parsed.port || "").trim();
      if (!hostname) return "";
      if (!port || port === "80" || port === "443") return hostname;
      return `${hostname}:${port}`;
    } catch (_err) {}

    const domain = val
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
    if (!domain) return "";
    const colonIndex = domain.lastIndexOf(":");
    if (colonIndex <= 0) return domain;
    const maybePort = domain.slice(colonIndex + 1);
    if (/^\d+$/.test(maybePort) && maybePort !== "80" && maybePort !== "443") {
      return domain;
    }
    return domain.slice(0, colonIndex);
  }

  function stripDomainPort(domain = "") {
    const value = String(domain || "").trim().toLowerCase();
    if (!value) return "";
    const colonIndex = value.lastIndexOf(":");
    if (colonIndex <= 0) return value;
    const maybePort = value.slice(colonIndex + 1);
    return /^\d+$/.test(maybePort) ? value.slice(0, colonIndex) : value;
  }

  function extractRelatedCredentialDomains(rawUrl = "") {
    const related = [];
    try {
      const parsed = new URL(String(rawUrl || ""));
      const addHost = (value = "") => {
        if (!value) return;
        try {
          const nested = new URL(String(value));
          const host = normalizeDomain(nested.host || nested.hostname || "");
          if (host) related.push(host);
        } catch (_err) {
          const host = normalizeDomain(String(value || ""));
          if (host) related.push(host);
        }
      };

      addHost(parsed.host || parsed.hostname || "");

      const nestedParams = [
        "retURL",
        "retUrl",
        "returnUrl",
        "TargetResource",
        "targetResource",
        "PartnerSpId",
        "partnerSpId",
      ];
      nestedParams.forEach((key) => {
        addHost(parsed.searchParams.get(key) || "");
      });
    } catch (_err) {}

    return [...new Set(related.filter(Boolean))];
  }

  function pickCredentialStorageDomain(rawUrl = "") {
    const domains = extractRelatedCredentialDomains(rawUrl);
    if (domains.length === 0) return normalizeDomain(rawUrl);

    const currentHost = domains[0] || "";
    if (AUTH_GATEWAY_HOSTS.has(currentHost)) {
      const redirectedTarget = domains.find(
        (host) => host && !AUTH_GATEWAY_HOSTS.has(host),
      );
      if (redirectedTarget) return redirectedTarget;
    }

    return currentHost;
  }

  function isAuthGatewayCredentialDomain(domain = "") {
    return AUTH_GATEWAY_HOSTS.has(normalizeDomain(domain));
  }

  function isGskCredentialDomain(domain = "") {
    const host = stripDomainPort(normalizeDomain(domain));
    return (
      host.endsWith(".veevavault.com") ||
      host === "veevavault.com" ||
      host.endsWith(".gskinternet.com") ||
      host === "gskinternet.com" ||
      host.endsWith(".gskpro.com") ||
      host === "gskpro.com"
    );
  }

  function findCanonicalCredentialForUsername(
    profileId,
    username,
    excludedDomain = "",
  ) {
    const normalizedUsername = String(username || "").trim().toLowerCase();
    const excluded = normalizeDomain(excludedDomain);
    if (!profileId || !normalizedUsername) return null;

    const matches = (getCredentialCache()[profileId] || []).filter((item) => {
      const domain = normalizeDomain(item.domain);
      return (
        domain &&
        domain !== excluded &&
        !isAuthGatewayCredentialDomain(domain) &&
        isGskCredentialDomain(domain) &&
        String(item.username || "").trim().toLowerCase() === normalizedUsername
      );
    });

    matches.sort(
      (a, b) => normalizeDomain(b.domain).length - normalizeDomain(a.domain).length,
    );
    return matches[0] || null;
  }

  function sanitizeCredentialUsername(username = "") {
    const value = String(username || "").trim();
    if (/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(value)) {
      return "";
    }
    return value;
  }

  async function cleanupAuthGatewayCredentialDuplicates() {
    if (!window.api?.deleteProfileCredential) return;
    const removals = [];

    getCredentialProfileIds().forEach((profileId) => {
      (getCredentialCache()[profileId] || []).forEach((item) => {
        const domain = normalizeDomain(item.domain);
        if (!isAuthGatewayCredentialDomain(domain)) return;
        const canonical = findCanonicalCredentialForUsername(
          profileId,
          item.username,
          domain,
        );
        if (!canonical) return;
        removals.push({
          profileId,
          domain,
          username: String(item.username || "").trim(),
        });
      });
    });

    if (removals.length === 0) return;

    await Promise.allSettled(
      removals.map((item) => window.api.deleteProfileCredential(item)),
    );

    removals.forEach((removed) => {
      const profileList = getCredentialCache()[removed.profileId] || [];
      getCredentialCache()[removed.profileId] = profileList.filter(
        (item) =>
          !(
            normalizeDomain(item.domain) === removed.domain &&
            String(item.username || "").trim().toLowerCase() ===
              removed.username.toLowerCase()
          ),
      );
    });
  }

  async function refreshCredentialCache() {
    if (!canUseSecureCredentialApi()) {
      setCredentialCache(emptyCredentialCache());
      return getCredentialCache();
    }

    try {
      const response = await window.api.listProfileCredentials();
      if (!response || !response.success || !Array.isArray(response.data)) {
        setCredentialCache(emptyCredentialCache());
        return getCredentialCache();
      }

      const next = emptyCredentialCache();
      response.data.forEach((item) => {
        const profileId = String(item.profileId || "").toLowerCase();
        if (!next[profileId]) return;
        next[profileId].push({
          profileId,
          domain: normalizeDomain(item.domain),
          username: String(item.username || ""),
          password: String(item.password || ""),
        });
      });
      setCredentialCache(next);
      await cleanupAuthGatewayCredentialDuplicates();
      return getCredentialCache();
    } catch (_e) {
      setCredentialCache(emptyCredentialCache());
      return getCredentialCache();
    }
  }

  async function refreshCredentialCacheIfStale(maxAgeMs = 15000) {
    if (!canUseSecureCredentialApi()) return getCredentialCache();
    const now = Date.now();
    if (now - getCredentialCacheRefreshedAt() < maxAgeMs) {
      return getCredentialCache();
    }
    if (getCredentialCacheRefreshInFlight()) {
      return getCredentialCacheRefreshInFlight();
    }
    const inFlight = refreshCredentialCache()
      .then((data) => {
        setCredentialCacheRefreshedAt(Date.now());
        return data;
      })
      .finally(() => {
        setCredentialCacheRefreshInFlight(null);
      });
    setCredentialCacheRefreshInFlight(inFlight);
    return inFlight;
  }

  function ensureTabCredentialHints(tab) {
    if (!tab) return {};
    if (!tab.credentialHintsByDomain) tab.credentialHintsByDomain = {};
    return tab.credentialHintsByDomain;
  }

  function shouldDebugCredentialFlow(rawUrl = "") {
    const value = String(rawUrl || "").toLowerCase();
    return (
      value.includes("10.215.56.196:3456") ||
      value.includes(".okta.com") ||
      value.includes("gsk-contentlab.veevavault.com") ||
      value.includes("login.veevavault.com") ||
      value.includes("federation.gsk.com")
    );
  }

  function isLikelyAuthPage(rawUrl = "", rawTitle = "") {
    const text = `${String(rawUrl || "").toLowerCase()} ${String(rawTitle || "").toLowerCase()}`;
    if (
      /login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(
        text,
      )
    ) {
      return true;
    }
    try {
      const u = new URL(String(rawUrl || ""));
      if (RESOURCE_SERVICE_ORIGIN && u.origin.toLowerCase() === RESOURCE_SERVICE_ORIGIN) {
        const path = String(u.pathname || "/").toLowerCase();
        const title = String(rawTitle || "").toLowerCase();
        if (
          (path === "/" || path === "/login" || path === "/signin") &&
          title.includes("synapse")
        ) {
          return true;
        }
      }
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

  function shouldEnableCredentialAutomation(url = "", title = "", tab = null) {
    if (!canUseSecureCredentialApi()) return false;
    if (!tab) return false;
    if (tab.launchedAppType === "website") {
      return isLikelyAuthPage(url, title) || isCredentialAutomationDomain(url);
    }
    if (!tab.launchedAppType) {
      return isLikelyAuthPage(url, title) || isCredentialAutomationDomain(url);
    }
    return true;
  }

  function findCredentialForUrl(profileId, rawUrl = "") {
    if (!profileId) return null;
    const candidateHosts = extractRelatedCredentialDomains(rawUrl);
    if (candidateHosts.length === 0) return null;

    const list = getCredentialCache()[profileId] || [];
    let best = null;
    let bestScore = -1;
    let lastUsedUsername = "";
    try {
      const host = normalizeDomain(rawUrl);
      if (host) {
        lastUsedUsername = localStorage.getItem(`oneview:last-used-username:${profileId}:${host}`) || "";
      }
    } catch (_) {}

    list.forEach((item) => {
      const domain = normalizeDomain(item.domain);
      if (!domain) return;
      const score = candidateHosts.reduce((highest, host) => {
        if (!host) return highest;
        if (host === domain) return Math.max(highest, 1000);
        if (stripDomainPort(host) === stripDomainPort(domain)) {
          return Math.max(highest, 900);
        }
        if (host.endsWith(`.${domain}`) || domain.endsWith(`.${host}`)) {
          return Math.max(highest, 500);
        }
        const hostBase = stripDomainPort(host);
        const domainBase = stripDomainPort(domain);
        if (hostBase.endsWith(`.${domainBase}`) || domainBase.endsWith(`.${hostBase}`)) {
          return Math.max(highest, 450);
        }
        const hostParts = hostBase.split(".").reverse();
        const domainParts = domainBase.split(".").reverse();
        let common = 0;
        for (let i = 0; i < Math.min(hostParts.length, domainParts.length); i += 1) {
          if (hostParts[i] !== domainParts[i]) break;
          common += 1;
        }
        return Math.max(highest, common > 1 ? common : -1);
      }, -1);
      if (score < 0) return;
      const isLastUsed = lastUsedUsername && String(item.username || "").trim().toLowerCase() === lastUsedUsername.trim().toLowerCase();
      if (
        !best ||
        score > bestScore ||
        (score === bestScore && isLastUsed) ||
        (score === bestScore && !isLastUsed && domain.length > normalizeDomain(best.domain).length)
      ) {
        best = item;
        bestScore = score;
      }
    });
    return best;
  }

  function findCredentialForTab(profileId, rawUrl = "", tab = null) {
    const list = getCredentialCache()[profileId] || [];
    if (list.length === 0) return null;

    let currentHost = "";
    try {
      currentHost = normalizeDomain(rawUrl);
    } catch (_e) {
      currentHost = "";
    }

    const hints = ensureTabCredentialHints(tab);
    const hintedUsernames = Object.values(hints || {})
      .map((value) => String(value || "").trim())
      .filter(Boolean);
    const lastHint =
      String(tab?.lastUsernameHint || "").trim() ||
      hintedUsernames[hintedUsernames.length - 1] ||
      "";

    if (currentHost && isAuthGatewayCredentialDomain(currentHost) && lastHint) {
      const canonical = findCanonicalCredentialForUsername(
        profileId,
        lastHint,
        currentHost,
      );
      if (canonical) return canonical;
    }

    const direct = findCredentialForUrl(profileId, rawUrl);
    if (direct && !isAuthGatewayCredentialDomain(direct.domain)) return direct;

    if (!lastHint) return null;

    const byUsername = list.filter(
      (item) =>
        String(item.username || "").trim().toLowerCase() ===
        lastHint.toLowerCase(),
    );
    if (byUsername.length === 1) {
      if (direct && !isAuthGatewayCredentialDomain(byUsername[0].domain)) {
        return direct;
      }
      return byUsername[0];
    }
    if (byUsername.length === 0) return null;

    const host = currentHost;
    if (!host) return byUsername[0];

    const score = (domainRaw) => {
      const d = normalizeDomain(domainRaw);
      if (!d) return -1;
      if (isAuthGatewayCredentialDomain(d) && isGskCredentialDomain(host)) {
        return -100;
      }
      if (isAuthGatewayCredentialDomain(host) && !isAuthGatewayCredentialDomain(d)) {
        return 800 + (isGskCredentialDomain(d) ? 50 : 0);
      }
      if (host === d) return 1000;
      if (stripDomainPort(host) === stripDomainPort(d)) return 900;
      if (host.endsWith(`.${d}`) || d.endsWith(`.${host}`)) return 500;
      const hostBase = stripDomainPort(host);
      const dBase = stripDomainPort(d);
      if (hostBase.endsWith(`.${dBase}`) || dBase.endsWith(`.${hostBase}`)) {
        return 450;
      }
      const hostParts = hostBase.split(".").reverse();
      const dParts = dBase.split(".").reverse();
      let common = 0;
      for (let i = 0; i < Math.min(hostParts.length, dParts.length); i += 1) {
        if (hostParts[i] !== dParts[i]) break;
        common += 1;
      }
      return common;
    };

    byUsername.sort((a, b) => score(b.domain) - score(a.domain));
    return byUsername[0] || null;
  }

  function getAutofillCredentialForTab(profileId, rawUrl = "", tab = null) {
    const preferred = findCredentialForTab(profileId, rawUrl, tab);
    if (preferred) {
      return {
        ...preferred,
        profileId:
          String(preferred.profileId || "").trim().toLowerCase() ||
          String(profileId || "").trim().toLowerCase(),
      };
    }

    const list = getCredentialCache()[profileId] || [];
    if (list.length === 1) {
      return {
        ...list[0],
        profileId:
          String(list[0]?.profileId || "").trim().toLowerCase() ||
          String(profileId || "").trim().toLowerCase(),
      };
    }

    let host = "";
    try {
      host = normalizeDomain(rawUrl);
    } catch (_e) {
      host = "";
    }
    if (!host || list.length === 0) {
      return null;
    }

    const score = (domainRaw) => {
      const d = normalizeDomain(domainRaw);
      if (!d) return -1;
      if (isAuthGatewayCredentialDomain(host) && !isAuthGatewayCredentialDomain(d)) {
        return 800 + (isGskCredentialDomain(d) ? 50 : 0);
      }
      if (isAuthGatewayCredentialDomain(d) && isGskCredentialDomain(host)) {
        return -100;
      }
      if (host === d) return 1000;
      if (stripDomainPort(host) === stripDomainPort(d)) return 900;
      if (host.endsWith(`.${d}`) || d.endsWith(`.${host}`)) return 500;
      const hostBase = stripDomainPort(host);
      const dBase = stripDomainPort(d);
      if (hostBase.endsWith(`.${dBase}`) || dBase.endsWith(`.${hostBase}`)) {
        return 450;
      }
      const hostParts = hostBase.split(".").reverse();
      const dParts = dBase.split(".").reverse();
      let common = 0;
      for (let i = 0; i < Math.min(hostParts.length, dParts.length); i += 1) {
        if (hostParts[i] !== dParts[i]) break;
        common += 1;
      }
      return common;
    };

    const ranked = [...list].sort((a, b) => score(b.domain) - score(a.domain));
    const winner = ranked[0] || null;
    if (winner) {
      return {
        ...winner,
        profileId:
          String(winner.profileId || "").trim().toLowerCase() ||
          String(profileId || "").trim().toLowerCase(),
      };
    }

    return null;
  }

  async function autofillCredentialsInWebview(webview, cred) {
    if (!webview || !cred) return;
    const username = String(cred.username || "");
    const password = String(cred.password || "");
    if (!password) return false;

    const script = `
      (() => {
        const getContextDocuments = () => {
          const docs = [document];
          const iframes = Array.from(document.querySelectorAll("iframe"));
          iframes.forEach((frame) => {
            try {
              if (frame.contentDocument) docs.push(frame.contentDocument);
            } catch (_e) {}
          });
          return docs;
        };
        const visibleInputs = (doc) =>
          Array.from(doc.querySelectorAll("input")).filter((el) => {
            if (!el || el.disabled || el.type === "hidden") return false;
            const win =
              el.ownerDocument && el.ownerDocument.defaultView
                ? el.ownerDocument.defaultView
                : window;
            const s = win.getComputedStyle(el);
            return s && s.display !== "none" && s.visibility !== "hidden";
          });
        const isPasswordLike = (el) => {
          if (!el) return false;
          const isMasked = el.style.webkitTextSecurity === "disc" || el.style.getPropertyValue("-webkit-text-security") === "disc";
          const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return el.type === "password" || isMasked || /password|passwd|pwd/.test(bag) || /current-password|new-password/.test(String(el.autocomplete || "").toLowerCase());
        };
        const isOtpLike = (el) => {
          if (!el) return false;
          const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return /otp|one\\s*time|verification\\s*code|authenticator|token|mfa|2fa|tfa|pin/.test(bag);
        };
        const isUserLike = (el) => {
          if (!el) return false;
          const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return el.type === "email" || /user|login|email|identifier|account/.test(bag) || /username|email/.test(String(el.autocomplete || "").toLowerCase());
        };

        const docs = getContextDocuments();
        let passField = null;
        let userField = null;
        const isLoginPage = /login|signin|sign-in|log-in|sso|auth|oauth|account|session/.test(window.location.href.toLowerCase());

        docs.some((doc) => {
          const inputs = visibleInputs(doc);
          const pass = inputs.find((el) => isPasswordLike(el) && !isOtpLike(el));
          if (pass) {
            passField = pass;
            userField =
              inputs.find((el) => !isPasswordLike(el) && isUserLike(el)) ||
              inputs.find((el) => !isPasswordLike(el) && (el.type === "text" || el.type === "email" || el.type === "tel")) ||
              null;
            return true;
          }
          return false;
        });

        if (!passField && isLoginPage) {
          docs.some((doc) => {
            const inputs = visibleInputs(doc);
            const user = inputs.find((el) => !isPasswordLike(el) && isUserLike(el));
            if (user) {
              userField = user;
              return true;
            }
            return false;
          });
        }

        const setNativeValue = (el, value) => {
          if (!el) return;
          const proto =
            el.tagName === "TEXTAREA"
              ? window.HTMLTextAreaElement?.prototype
              : window.HTMLInputElement?.prototype;
          const descriptor = proto
            ? Object.getOwnPropertyDescriptor(proto, "value")
            : null;
          if (descriptor && typeof descriptor.set === "function") {
            descriptor.set.call(el, value);
            return;
          }
          el.value = value;
        };
        const fire = (el) => {
          const Evt =
            (el.ownerDocument && el.ownerDocument.defaultView && el.ownerDocument.defaultView.Event) ||
            Event;
          const InputEvt =
            (el.ownerDocument && el.ownerDocument.defaultView && el.ownerDocument.defaultView.InputEvent) ||
            null;
          el.dispatchEvent(new Evt("input", { bubbles: true }));
          if (InputEvt) {
            el.dispatchEvent(new InputEvt("input", {
              bubbles: true,
              inputType: "insertText",
              data: String(el.value || ""),
            }));
          }
          el.dispatchEvent(new Evt("change", { bubbles: true }));
          el.dispatchEvent(new Evt("blur", { bubbles: true }));
        };

        window.__oneviewAutofillApplying = true;
        try {
          if (${JSON.stringify(Boolean(username))} && userField) {
            userField.focus();
            setNativeValue(userField, ${JSON.stringify(username)});
            fire(userField);
          }
          if (passField) {
            passField.focus();
            setNativeValue(passField, ${JSON.stringify(password)});
            fire(passField);
          }
        } finally {
          setTimeout(() => {
            window.__oneviewAutofillApplying = false;
          }, 0);
        }
      })();
    `;

    try {
      await webview.executeJavaScript(script, true);
      return true;
    } catch (_e) {
      return false;
    }
  }

  function scheduleCredentialAutofill(webview, cred) {
    if (!webview || !cred) return;

    if (webview._oneviewAutofillTimer) {
      clearTimeout(webview._oneviewAutofillTimer);
      webview._oneviewAutofillTimer = null;
    }

    let attempts = 0;
    const run = async () => {
      attempts += 1;
      const isDestroyed =
        typeof webview.isDestroyed === "function" ? webview.isDestroyed() : false;
      if (isDestroyed) return;
      if (webview.id !== `webview-${getActiveTabId()}`) return;

      try {
        const shouldStopForManualEdit = await webview.executeJavaScript(
          `Boolean(window.__oneviewManualCredentialEditAt)`,
          true,
        );
        if (shouldStopForManualEdit) {
          if (webview._oneviewAutofillTimer) {
            clearTimeout(webview._oneviewAutofillTimer);
            webview._oneviewAutofillTimer = null;
          }
          return;
        }
      } catch (_e) {}

      await autofillCredentialsInWebview(webview, cred);
      if (attempts < 6) {
        webview._oneviewAutofillTimer = setTimeout(run, 1000);
      }
    };

    run();
  }

  async function readCredentialInputsFromWebview(webview) {
    if (!webview) return null;
    try {
      const result = await webview.executeJavaScript(
        `
        (() => {
          const getContextDocuments = () => {
            const docs = [document];
            const iframes = Array.from(document.querySelectorAll("iframe"));
            iframes.forEach((frame) => {
              try {
                if (frame.contentDocument) docs.push(frame.contentDocument);
              } catch (_e) {}
            });
            return docs;
          };
          const visible = (el) => {
            if (!el) return false;
            const win =
              el.ownerDocument && el.ownerDocument.defaultView
                ? el.ownerDocument.defaultView
                : window;
            const s = win.getComputedStyle(el);
            return s && s.display !== "none" && s.visibility !== "hidden";
          };
          const isPasswordLike = (el) => {
            if (!el) return false;
            const isMasked = el.style.webkitTextSecurity === "disc" || el.style.getPropertyValue("-webkit-text-security") === "disc";
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return el.type === "password" || isMasked || /password|passwd|pwd/.test(bag) || /current-password|new-password/.test(String(el.autocomplete || "").toLowerCase());
          };
          const isOtpLike = (el) => {
            if (!el) return false;
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return /otp|one\\s*time|verification\\s*code|authenticator|token|mfa|2fa|tfa|pin/.test(bag);
          };
          const isUserLike = (el) => {
            if (!el) return false;
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return el.type === "email" || /user|login|email|identifier|account|okta/.test(bag) || /username|email/.test(String(el.autocomplete || "").toLowerCase());
          };

          const docs = getContextDocuments();
          let passwordField = null;
          let userField = null;

          docs.some((doc) => {
            const candidates = Array.from(doc.querySelectorAll("input"));
            const pass = candidates.find(
              (el) => visible(el) && isPasswordLike(el) && !isOtpLike(el),
            );
            const pool = pass
              ? (pass.closest("form")
                  ? Array.from(pass.closest("form").querySelectorAll("input"))
                  : candidates)
              : candidates;
            const explicitUser = pool.find(
              (el) => visible(el) && !isPasswordLike(el) && isUserLike(el),
            );
            const fallbackUser = pass
              ? null
              : pool.find(
                  (el) => visible(el) && !isPasswordLike(el) && (el.type === "text" || el.type === "email" || el.type === "tel"),
                );
            const user = explicitUser || fallbackUser;

            if (pass || user) {
              passwordField = pass || null;
              userField = user || null;
              return true;
            }
            return false;
          });

          const username = (userField && userField.value) ? String(userField.value).trim() : "";
          const password = (passwordField && passwordField.value) ? String(passwordField.value) : "";
          const activeDoc =
            (passwordField && passwordField.ownerDocument) ||
            (userField && userField.ownerDocument) ||
            document;
          const active = activeDoc.activeElement;
          const activeInputType =
            active && active.tagName === "INPUT" ? String(active.type || "").toLowerCase() : "";
          if (!username && !password) return null;
          return {
            username,
            password,
            url: window.location.href || "",
            activeInputType,
            otpLike: Boolean(passwordField && isOtpLike(passwordField)),
          };
        })();
        `,
        true,
      );
      return result && (result.username || result.password) ? result : null;
    } catch (_e) {
      return null;
    }
  }

  async function installCredentialCaptureHooks(webview) {
    if (!webview) return;
    try {
      await webview.executeJavaScript(
        `
        (() => {
          if (window.__oneviewCredentialHookInstalled) return;
          window.__oneviewCredentialHookInstalled = true;
          window.__oneviewCredentialCapture = null;

          const getContextDocuments = () => {
            const docs = [document];
            const iframes = Array.from(document.querySelectorAll("iframe"));
            iframes.forEach((frame) => {
              try {
                if (frame.contentDocument) docs.push(frame.contentDocument);
              } catch (_e) {}
            });
            return docs;
          };
          const shouldDebugCredentialFlow = (url = "") => {
            const value = String(url || "").toLowerCase();
            return (
              value.includes("10.215.56.196:3456") ||
              value.includes(".okta.com") ||
              value.includes("gsk-contentlab.veevavault.com") ||
              value.includes("login.veevavault.com") ||
              value.includes("federation.gsk.com")
            );
          };
          const debugLog = (message, payload = {}) => {
            if (!shouldDebugCredentialFlow(window.location.href || "")) return;
            try {
              console.log("[OneView][CredentialCapture]", message, payload);
            } catch (_err) {}
          };
          const visible = (el) => {
            if (!el) return false;
            const win =
              el.ownerDocument && el.ownerDocument.defaultView
                ? el.ownerDocument.defaultView
                : window;
            const s = win.getComputedStyle(el);
            return s && s.display !== "none" && s.visibility !== "hidden";
          };
          const isPasswordLike = (el) => {
            if (!el) return false;
            const isMasked = el.style.webkitTextSecurity === "disc" || el.style.getPropertyValue("-webkit-text-security") === "disc";
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return el.type === "password" || isMasked || /password|passwd|pwd/.test(bag) || /current-password|new-password/.test(String(el.autocomplete || "").toLowerCase());
          };
          const isOtpLike = (el) => {
            if (!el) return false;
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return /otp|one\\s*time|verification\\s*code|authenticator|token|mfa|2fa|tfa|pin/.test(bag);
          };
          const isUserLike = (el) => {
            if (!el) return false;
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return el.type === "email" || /user|login|email|identifier|account|okta/.test(bag) || /username|email/.test(String(el.autocomplete || "").toLowerCase());
          };
          const isSubmitLikeControl = (el) => {
            if (!el) return false;
            const bag = [el.type, el.name, el.id, el.value, el.textContent, el.getAttribute("aria-label"), el.getAttribute("title")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return /submit|login|log in|sign in|signin|continue|next/.test(bag);
          };

          const capture = (trigger = "unknown") => {
            const docs = getContextDocuments();
            let passwordField = null;
            let userField = null;

            docs.some((doc) => {
              const candidates = Array.from(doc.querySelectorAll("input"));
              const pass = candidates.find(
                (el) => visible(el) && isPasswordLike(el) && !isOtpLike(el),
              );
              const pool = pass
                ? (pass.closest("form")
                    ? Array.from(pass.closest("form").querySelectorAll("input"))
                    : candidates)
                : candidates;
              const explicitUser = pool.find(
                (el) => visible(el) && !isPasswordLike(el) && isUserLike(el),
              );
              const fallbackUser = pass
                ? null
                : pool.find(
                    (el) => visible(el) && !isPasswordLike(el) && (el.type === "text" || el.type === "email" || el.type === "tel"),
                  );
              const user = explicitUser || fallbackUser;

              if (pass || user) {
                passwordField = pass || null;
                userField = user || null;
                return true;
              }
              return false;
            });

            const username = (userField && userField.value) ? String(userField.value).trim() : "";
            const password = (passwordField && passwordField.value) ? String(passwordField.value) : "";
            if (username) window.__oneviewLastUsernameValue = username;
            if (password) window.__oneviewLastPasswordValue = password;
            const activeDoc =
              (passwordField && passwordField.ownerDocument) ||
              (userField && userField.ownerDocument) ||
              document;
            const active = activeDoc.activeElement;
            const isActivePassword = active && active.tagName === "INPUT" && (active.type === "password" || active.style.webkitTextSecurity === "disc" || active.style.getPropertyValue("-webkit-text-security") === "disc");
            const activeInputType = isActivePassword ? "password" : (active && active.tagName === "INPUT" ? String(active.type || "").toLowerCase() : "");
            if (!username && !password) return;
            window.__oneviewCredentialCapture = {
              username,
              password,
              url: window.location.href || "",
              capturedAt: Date.now(),
              activeInputType,
              trigger,
              otpLike: Boolean(passwordField && isOtpLike(passwordField)),
            };
            debugLog("captured", {
              trigger,
              usernamePresent: Boolean(username),
              passwordPresent: Boolean(password),
              url: window.location.href || "",
              activeInputType,
            });
          };

          const bindDocumentListeners = (doc) => {
            if (!doc || doc.__oneviewCredentialListenersBound) return;
            doc.__oneviewCredentialListenersBound = true;

            doc.addEventListener("submit", () => {
              capture("submit");
              setTimeout(() => capture("submit"), 0);
            }, true);

            doc.addEventListener("click", (event) => {
              const target = event.target && event.target.closest
                ? event.target.closest('button, input[type="submit"], input[type="button"]')
                : null;
              if (target && isSubmitLikeControl(target)) {
                capture("submit-click");
                setTimeout(() => capture("submit-click"), 0);
              }
            }, true);

            doc.addEventListener("keydown", (event) => {
              if (event.key === "Enter") {
                capture("enter");
                setTimeout(() => capture("enter"), 0);
              }
            }, true);

            doc.addEventListener("input", (event) => {
              const t = event.target;
              if (!t || t.tagName !== "INPUT") return;
              const isPassword = t.type === "password" || t.style.webkitTextSecurity === "disc" || t.style.getPropertyValue("-webkit-text-security") === "disc";
              if (isPassword || t.type === "email" || t.type === "text" || t.type === "tel") {
                if (!window.__oneviewAutofillApplying) {
                  window.__oneviewManualCredentialEditAt = Date.now();
                  if (isPassword) {
                    window.__oneviewLastPasswordValue = String(t.value || "");
                  } else {
                    window.__oneviewLastUsernameValue = String(t.value || "").trim();
                  }
                }
                capture("input");
              }
            }, true);

            debugLog("listeners-bound", {
              href: doc.defaultView?.location?.href || "",
            });
          };

          const bindAllContexts = () => {
            getContextDocuments().forEach((doc) => bindDocumentListeners(doc));
          };

          bindAllContexts();
          document.addEventListener("load", () => {
            bindAllContexts();
          }, true);
          const observer = new MutationObserver(() => bindAllContexts());
          observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true,
          });

          window.__oneviewConsumeCredentialCapture = () => {
            const payload = window.__oneviewCredentialCapture;
            window.__oneviewCredentialCapture = null;
            return payload;
          };
        })();
        `,
        true,
      );
    } catch (_e) {}
  }

  async function consumeCapturedCredentialFromWebview(webview) {
    if (!webview) return null;
    try {
      const payload = await webview.executeJavaScript(
        `
        (() => {
          if (typeof window.__oneviewConsumeCredentialCapture !== "function") return null;
          const direct = window.__oneviewConsumeCredentialCapture();
          if (direct && (direct.username || direct.password)) return direct;
          const username = String(window.__oneviewLastUsernameValue || "").trim();
          const password = String(window.__oneviewLastPasswordValue || "");
          if (!username && !password) return null;
          window.__oneviewLastUsernameValue = "";
          window.__oneviewLastPasswordValue = "";
          return {
            username,
            password,
            url: window.location.href || "",
            capturedAt: Date.now(),
            activeInputType: "",
            trigger: "value-cache",
            otpLike: false,
          };
        })();
        `,
        true,
      );
      return payload && (payload.username || payload.password) ? payload : null;
    } catch (_e) {
      return null;
    }
  }

  async function maybeOfferRememberCredentials(webview, tab) {
    if (!canUseSecureCredentialApi() || !webview || !tab) return;
    if (tab.id !== getActiveTabId()) return;
    if (!tab.credentialAutomationEnabled) return;

    const currentUrl = String(webview.getURL?.() || tab.url || "");
    let captured = null;
    if (webview._oneviewSubmittedCredential) {
      captured = webview._oneviewSubmittedCredential;
      webview._oneviewSubmittedCredential = null;
    } else {
      captured = await consumeCapturedCredentialFromWebview(webview);
    }
    // ONLY offer saving if we actually captured a submission/click event!
    // Stale/autofilled or live page state inputs read during the 3-second poll should never trigger database saving.
    if (!captured) return;
    const creds = captured;

    const trigger = String(creds.trigger || "");
    const activeInputType = String(creds.activeInputType || "").toLowerCase();
    const isTypingOnlyCapture = trigger === "input";
    if (isTypingOnlyCapture) {
      // While typing, update in-memory hints, but NEVER trigger database save!
      const domain = pickCredentialStorageDomain(String(creds.url || webview.getURL() || ""));
      const username = sanitizeCredentialUsername(creds.username);
      const incomingLooksSuspicious =
        Boolean(username) &&
        Boolean(creds.password) &&
        username.toLowerCase() === String(creds.password).toLowerCase();
      if (username && !incomingLooksSuspicious && domain) {
        ensureTabCredentialHints(tab)[domain] = username;
        tab.lastUsernameHint = username;
      }
      return;
    }

    const profileId = resolveCredentialScopeIdForTab(tab);
    const sourceUrl = String(creds.url || webview.getURL() || "");
    const domain = pickCredentialStorageDomain(sourceUrl);
    const hints = ensureTabCredentialHints(tab);
    let username = sanitizeCredentialUsername(creds.username);
    const password = String(creds.password || "");
    if (!profileId || !domain) return;

    const passwordLooksLikeOtp = /^\d{4,8}$/.test(password);
    const sourceLooksLikeMfa = /authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(
      sourceUrl.toLowerCase(),
    );
    if (creds.otpLike || (sourceLooksLikeMfa && passwordLooksLikeOtp)) {
      return;
    }

    const previousHintedUsername =
      String(hints[domain] || "").trim() ||
      String(tab.lastUsernameHint || "").trim();
    const incomingLooksSuspicious =
      Boolean(username) &&
      Boolean(password) &&
      username.toLowerCase() === password.toLowerCase();

    if (username && !incomingLooksSuspicious) {
      hints[domain] = username;
      tab.lastUsernameHint = username;
    } else if (hints[domain]) {
      username = hints[domain];
    } else if (tab.lastUsernameHint) {
      username = String(tab.lastUsernameHint || "").trim();
    }

    const hintedUsername =
      previousHintedUsername ||
      String(hints[domain] || "").trim() ||
      String(tab.lastUsernameHint || "").trim();
    const usernameEqualsPassword =
      Boolean(username) &&
      Boolean(password) &&
      username.toLowerCase() === password.toLowerCase();

    if (usernameEqualsPassword && hintedUsername && hintedUsername !== username) {
      username = hintedUsername;
    }
    if (!username || !password) return;
    if (
      usernameEqualsPassword &&
      (!hintedUsername || hintedUsername.toLowerCase() === username.toLowerCase())
    ) {
      return;
    }

    const cooldownKey = `${profileId}|${domain}|${username}`;
    const now = Date.now();
    const lastPromptAt = rememberPromptCooldown.get(cooldownKey) || 0;

    const existingCred = (getCredentialCache()[profileId] || []).find(
      (item) =>
        stripDomainPort(normalizeDomain(item.domain)) === stripDomainPort(domain) &&
        String(item.username || "").trim().toLowerCase() === username.toLowerCase(),
    );
    const isNewOrDifferent = !existingCred || String(existingCred.password || "") !== password;

    if (!isNewOrDifferent && (now - lastPromptAt < 15000)) return;
    rememberPromptCooldown.set(cooldownKey, now);

    await refreshCredentialCache();
    if (isAuthGatewayCredentialDomain(domain)) {
      const canonical = findCanonicalCredentialForUsername(
        profileId,
        username,
        domain,
      );
      if (canonical) {
        const gatewayExisting = (getCredentialCache()[profileId] || []).find(
          (item) =>
            normalizeDomain(item.domain) === domain &&
            String(item.username || "").trim().toLowerCase() ===
              username.toLowerCase(),
        );
        if (gatewayExisting && window.api?.deleteProfileCredential) {
          await window.api.deleteProfileCredential({
            profileId,
            domain,
            username,
          });
          await refreshCredentialCache();
        }
        return;
      }
    }

    const existing = (getCredentialCache()[profileId] || []).find(
      (item) =>
        normalizeDomain(item.domain) === domain &&
        String(item.username || "").trim().toLowerCase() === username.toLowerCase(),
    );
    if (existing && String(existing.password || "") === password) return;

    try {
      const saveResp = await window.api.saveProfileCredential({
        profileId,
        domain,
        username,
        password,
      });
      if (!saveResp?.success) return;
      await refreshCredentialCache();
    } catch (err) {
      console.warn("Could not save remembered credential:", err);
    }
  }

  function startCredentialCapturePolling(webview, tab) {
    if (!webview || !tab || webview._oneviewCredentialPollId) return;
    webview._oneviewCredentialPollId = setInterval(() => {
      const isDestroyed =
        typeof webview.isDestroyed === "function" ? webview.isDestroyed() : false;
      if (isDestroyed) {
        clearInterval(webview._oneviewCredentialPollId);
        webview._oneviewCredentialPollId = null;
        return;
      }
      if (tab.id !== getActiveTabId()) return;
      maybeOfferRememberCredentials(webview, tab);
    }, 3000);
  }

  async function closeHttpAuthModal(notifyMain = false) {
    const modal = document.getElementById("httpAuthModal");
    const form = document.getElementById("httpAuthForm");
    const challenge = getActiveHttpAuthChallenge();
    if (modal && !modal.classList.contains("hidden")) {
      closeOverlayModal(() => modal.classList.add("hidden"));
    }
    if (form) form.reset();
    setActiveHttpAuthChallenge(null);

    if (
      notifyMain &&
      challenge?.challengeId &&
      typeof window.api?.submitHttpAuthChallenge === "function"
    ) {
      window.api
        .submitHttpAuthChallenge({
          challengeId: challenge.challengeId,
          cancelled: true,
        })
        .catch(() => {});
    }
  }

  async function openHttpAuthModal(payload = {}) {
    const modal = document.getElementById("httpAuthModal");
    const titleEl = document.getElementById("httpAuthModalTitle");
    const messageEl = document.getElementById("httpAuthMessage");
    const usernameInput = document.getElementById("httpAuthUsernameInput");
    const passwordInput = document.getElementById("httpAuthPasswordInput");
    const rememberInput = document.getElementById("httpAuthRememberInput");
    const submitBtn = document.getElementById("httpAuthSubmitBtn");
    if (
      !modal ||
      !titleEl ||
      !messageEl ||
      !usernameInput ||
      !passwordInput ||
      !rememberInput ||
      !submitBtn
    ) {
      return;
    }

    if (getActiveHttpAuthChallenge()?.challengeId) {
      closeHttpAuthModal(true);
    }

    setActiveHttpAuthChallenge({ ...payload });
    const isRetry = String(payload.reason || "") === "retry";
    titleEl.textContent = isRetry
      ? "Login Failed, Update Credential"
      : "Website Login Required";

    const siteLabel = String(payload.host || payload.url || "this website").trim();
    const realmLabel = String(payload.realm || "").trim();
    const profileLabel = String(payload.profileId || "").trim().toUpperCase();
    messageEl.textContent = realmLabel
      ? `${siteLabel} • ${realmLabel}${profileLabel ? ` • ${profileLabel}` : ""}`
      : `${siteLabel}${profileLabel ? ` • ${profileLabel}` : ""}`;

    usernameInput.value = String(payload.username || "");
    passwordInput.value = String(payload.password || "");
    rememberInput.checked = payload.remember !== false;
    submitBtn.textContent = isRetry ? "Update And Login" : "Login";

    await openOverlayModal(() => modal.classList.remove("hidden"));
    if (passwordInput.value) {
      passwordInput.focus();
      passwordInput.select();
    } else {
      usernameInput.focus();
      usernameInput.select();
    }
  }

  function initHttpAuthPrompt() {
    const modal = document.getElementById("httpAuthModal");
    const form = document.getElementById("httpAuthForm");
    const closeBtn = document.getElementById("httpAuthModalCloseBtn");
    if (!modal || !form || !closeBtn) return;
    if (form.dataset.initialized === "1") return;
    form.dataset.initialized = "1";

    closeBtn.addEventListener("click", () => closeHttpAuthModal(true));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeHttpAuthModal(true);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const challenge = getActiveHttpAuthChallenge();
      const usernameInput = document.getElementById("httpAuthUsernameInput");
      const passwordInput = document.getElementById("httpAuthPasswordInput");
      const rememberInput = document.getElementById("httpAuthRememberInput");
      if (
        !challenge?.challengeId ||
        !usernameInput ||
        !passwordInput ||
        typeof window.api?.submitHttpAuthChallenge !== "function"
      ) {
        return;
      }

      const username = String(usernameInput.value || "").trim();
      const password = String(passwordInput.value || "");
      const remember = Boolean(rememberInput?.checked);
      if (!username || !password) return;

      try {
        await window.api.submitHttpAuthChallenge({
          challengeId: challenge.challengeId,
          username,
          password,
          remember,
        });
        closeHttpAuthModal(false);
      } catch (error) {
        console.error("Failed to submit HTTP auth credential", error);
        showToast("Could not submit the website credential.", "error");
      }
    });

    if (typeof window.api?.onHttpAuthChallenge === "function") {
      window.api.onHttpAuthChallenge((payload) => {
        openHttpAuthModal(payload).catch((error) => {
          console.error("Failed to open HTTP auth modal", error);
        });
      });
    }
  }

  // *** MOVED TO SETTINGS TAB ***
  // Password manager functionality is now accessed via settings page (Passwords tab)
  function initPasswordManager() {
    // Logic moved to settings-passwords.js
  }

  async function handleCredentialFieldInteraction(webview, payload) {
    if (!payload || !payload.rect) return;

    const currentUrl = webview.getURL();
    const domain = pickCredentialStorageDomain(currentUrl);
    if (!domain) return;

    // Find credentials across ALL profiles
    const allCreds = [];
    Object.entries(getCredentialCache()).forEach(([profileId, list]) => {
      list.forEach((item) => {
        const itemDomain = normalizeDomain(item.domain);
        const strippedItem = stripDomainPort(itemDomain);
        const strippedDomain = stripDomainPort(domain);
        if (strippedItem === strippedDomain || (strippedDomain.endsWith(`.${strippedItem}`) && strippedItem.split(".").length > 1)) {
          const profile = constants.PROFILES[profileId] || { name: profileId, color: "#ccc" };
          allCreds.push({ 
            ...item, 
            profileId,
            profileName: profile.name,
            profileColor: profile.color
          });
        }
      });
    });

    if (allCreds.length === 0) return;

    // Call the webview's internal dropdown renderer
    const script = `if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(allCreds)});
    }`;
    webview.executeJavaScript(script, true).catch(() => {});
  }

  return {
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
    hideCredentialDropdown: () => {
      // Handled inside webview-preload
    }
  };
}
