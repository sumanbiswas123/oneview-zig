export function createViewSettingsManager({
  state,
  constants,
  escapeHtml,
  showToast,
  isPerfEnabled,
  formatDownloadBytes,
  formatDownloadSpeed,
  formatDownloadEta,
  formatHistoryTime,
  loadManagedDownloadsFromMain,
  refreshExtensionsManagerList,
  saveProfileHistoryStore,
  getActiveTab,
  updateTabTitle,
  createTab,
  switchTab,
  navigateTo,
}) {
  const { PROFILES, PARTITIONS, IS_DEV_APP_BUILD } = constants;

  function normalizeSettingsSection(value = "") {
    const section = String(value || "")
      .trim()
      .toLowerCase();
    return ["downloads", "history", "extensions", "passwords", "about"].includes(section)
      ? section
      : "extensions";
  }

  function getSettingsTabTitle(section = "extensions") {
    const normalized = normalizeSettingsSection(section);
    if (normalized === "downloads") return "Downloads";
    if (normalized === "history") return "History";
    if (normalized === "passwords") return "Passwords";
    if (normalized === "extensions") return "Extensions";
    if (normalized === "about") return "About & Updates";
    return "Extensions";
  }

  function getSettingsShortcut(section = "extensions") {
    const normalized = normalizeSettingsSection(section);
    if (normalized === "downloads") return "Ctrl+Shift+D";
    if (normalized === "history") return "Ctrl+H";
    if (normalized === "extensions") return "Ctrl+E";
    return "";
  }

  function isEditableShortcutTarget(target) {
    const element = target instanceof Element ? target : null;
    if (!element) return false;
    if (element.closest("input, textarea, select")) return true;
    return element.isContentEditable === true;
  }

  function createNativePageDescriptor(page = "settings", section = "extensions") {
    return {
      type: String(page || "settings").trim().toLowerCase(),
      section: normalizeSettingsSection(section),
    };
  }

  function findExistingSettingsTab(section = "extensions") {
    const targetSection = normalizeSettingsSection(section);
    return (
      state.tabs.find(
        (tab) =>
          tab?.nativePage?.type === "settings" &&
          normalizeSettingsSection(tab?.nativePage?.section) === targetSection,
      ) || null
    );
  }

  function isNativeSettingsTab(tab) {
    return tab?.nativePage?.type === "settings";
  }

  async function ensureNativeSettingsGeneralInfo() {
    if (!window.api) return state.nativeSettingsGeneralInfo;
    try {
      if (!state.nativeSettingsGeneralInfo.version && window.api.getAppVersion) {
        state.nativeSettingsGeneralInfo.version = await window.api.getAppVersion();
      }
      if (
        !state.nativeSettingsGeneralInfo.defaultOpenStatus &&
        window.api.getDefaultOpenHandlingStatus
      ) {
        const result = await window.api.getDefaultOpenHandlingStatus();
        state.nativeSettingsGeneralInfo.defaultOpenStatus =
          result?.isDefault || result?.success ? "Configured" : "Needs setup";
      }
    } catch (_error) {}
    return state.nativeSettingsGeneralInfo;
  }

  function buildNativeSettingsProfileOptions(selectedProfileId = "guest") {
    return Object.values(PROFILES)
      .map(
        (profile) => `
        <option value="${escapeHtml(profile.id)}" ${
          profile.id === selectedProfileId ? "selected" : ""
        }>${escapeHtml(profile.name)}</option>
      `,
      )
      .join("");
  }

  function getAllHistoryRows() {
    return Object.entries(state.profileHistoryCache || {})
      .flatMap(([profileId, rows]) =>
        (Array.isArray(rows) ? rows : []).map((entry) => ({
          profileId,
          profileName: PROFILES[profileId]?.name || profileId || "Unknown",
          url: String(entry?.url || "").trim(),
          title: String(entry?.title || "Untitled").trim() || "Untitled",
          visitedAt: entry?.visitedAt ? Number(entry.visitedAt) : 0,
        })),
      )
      .filter((entry) => entry.url && entry.visitedAt)
      .sort((a, b) => Number(b.visitedAt || 0) - Number(a.visitedAt || 0));
  }

  function formatHistorySectionLabel(timestamp) {
    const date = new Date(Number(timestamp || 0));
    if (Number.isNaN(date.getTime())) return "Unknown Date";

    const today = new Date();
    const todayKey = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ).getTime();
    const dateKey = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).getTime();
    const yesterdayKey = todayKey - 24 * 60 * 60 * 1000;

    if (dateKey === todayKey) return "Today";
    if (dateKey === yesterdayKey) return "Yesterday";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function buildHistorySections(rows = []) {
    const groups = [];
    const buckets = new Map();

    rows.forEach((entry) => {
      const label = formatHistorySectionLabel(entry.visitedAt);
      if (!buckets.has(label)) {
        const group = { key: `${label}-${entry.visitedAt}`, label, entries: [] };
        buckets.set(label, group);
        groups.push(group);
      }
      buckets.get(label).entries.push(entry);
    });

    return groups;
  }

  function renderNativeSettingsDownloadsSection() {
    if (!state.managedDownloadsCache.length) {
      return `<div class="native-settings-empty">No downloads yet.</div>`;
    }
    return `
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${state.managedDownloadsCache
          .map((entry) => {
            const progress = entry.totalBytes
              ? Math.max(
                  0,
                  Math.min(100, Math.round((entry.receivedBytes / entry.totalBytes) * 100)),
                )
              : entry.state === "completed"
                ? 100
                : 0;
            const totalLabel = entry.totalBytes
              ? `${formatDownloadBytes(entry.receivedBytes)} / ${formatDownloadBytes(entry.totalBytes)}`
              : formatDownloadBytes(entry.receivedBytes);
            const extraMeta =
              entry.state === "progressing"
                ? `${formatDownloadSpeed(entry.bytesPerSecond)} - ${formatDownloadEta(entry.etaSeconds)}`
                : entry.state === "completed"
                  ? `Saved to ${escapeHtml(entry.savePath || "")}`
                  : escapeHtml(String(entry.state || "Unknown"));
            return `
              <article class="native-settings-row native-settings-download-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${escapeHtml(entry.fileName || "Download")}</div>
                    <div class="native-settings-row-note">${escapeHtml(totalLabel)}</div>
                    <div class="native-settings-row-note">${extraMeta}</div>
                  </div>
                  <div class="native-settings-inline-actions">
                    ${
                      entry.state === "progressing"
                        ? `<button class="native-settings-action" type="button" data-native-download-action="${
                            entry.isPaused ? "resume" : "pause"
                          }" data-download-id="${escapeHtml(entry.id)}">${
                            entry.isPaused ? "Resume" : "Pause"
                          }</button>`
                        : ""
                    }
                    ${
                      entry.state === "progressing"
                        ? `<button class="native-settings-action" type="button" data-native-download-action="cancel" data-download-id="${escapeHtml(entry.id)}">Cancel</button>`
                        : ""
                    }
                    ${
                      entry.state !== "progressing"
                        ? `<button class="native-settings-action" type="button" data-native-download-action="show" data-download-id="${escapeHtml(entry.id)}">Show</button>`
                        : ""
                    }
                    ${
                      entry.state === "completed"
                        ? `<button class="native-settings-action" type="button" data-native-download-action="open" data-download-id="${escapeHtml(entry.id)}">Open</button>`
                        : ""
                    }
                    ${
                      entry.state === "interrupted" || entry.state === "cancelled"
                        ? `<button class="native-settings-action" type="button" data-native-download-action="retry" data-download-id="${escapeHtml(entry.id)}">Retry</button>`
                        : ""
                    }
                    <button class="native-settings-action" type="button" data-native-download-action="remove" data-download-id="${escapeHtml(entry.id)}">Remove</button>
                  </div>
                </div>
                <div class="native-settings-progress"><span style="width:${progress}%"></span></div>
              </article>
            `;
          })
          .join("")}
        </div>
      </section>
    `;
  }

  function renderNativeSettingsHistorySection() {
    const searchQuery = state.historySearchQuery.trim().toLowerCase();
    const rows = getAllHistoryRows().filter((entry) => {
      if (!searchQuery) return true;
      const haystack = `${entry.title || ""} ${entry.url || ""} ${entry.profileName || ""}`
        .toLowerCase();
      return haystack.includes(searchQuery);
    });
    if (!rows.length) {
      return `<div class="native-settings-empty">${
        searchQuery ? "No history matches your search." : "No history yet."
      }</div>`;
    }
    const groups = buildHistorySections(rows);
    return `
      <div class="native-history-flat-list">
        ${groups
          .map(
            (group) => `
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${escapeHtml(group.label)}</span>
                </div>
                ${group.entries
                  .map(
                    (entry) => `
                      <article class="native-history-entry">
                        <div class="native-history-entry-content">
                          <div class="native-history-entry-title">${escapeHtml(entry.title || "Untitled")}</div>
                          <div class="native-history-entry-url">${escapeHtml(entry.url || "")}</div>
                          <div class="native-history-entry-meta">${escapeHtml(entry.profileName)} • ${escapeHtml(formatHistoryTime(entry.visitedAt))}</div>
                        </div>
                        <div class="native-history-entry-actions">
                          <button class="native-settings-action" type="button" data-native-history-action="open" data-history-time="${escapeHtml(entry.visitedAt || "")}" data-profile-id="${escapeHtml(entry.profileId)}">Open</button>
                          <button class="native-settings-action" type="button" data-native-history-action="delete" data-history-time="${escapeHtml(entry.visitedAt || "")}" data-profile-id="${escapeHtml(entry.profileId)}">Delete</button>
                        </div>
                      </article>
                    `,
                  )
                  .join("")}
              </div>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function renderNativeSettingsExtensionsSection() {
    if (!state.browserExtensionsCache.length) {
      return `<div class="native-settings-empty">No extensions installed yet.</div>`;
    }
    return `
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${state.browserExtensionsCache
          .map(
            (entry) => {
              const isDevModeActive = (function() {
                try {
                  const role = String(localStorage.getItem("userRole") || "production").toLowerCase();
                  const mode = String(localStorage.getItem("oneview_env_mode") || "prod").toLowerCase();
                  return role === "dev" && mode === "dev";
                } catch (_e) { return false; }
              })();
              return `
              <article class="native-settings-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${escapeHtml(entry.name || "Unnamed Extension")}</div>
                    <div class="native-settings-row-note">${escapeHtml(entry.id || "")}</div>
                    ${isDevModeActive ? `<div class="native-settings-row-note">${escapeHtml(entry.path || "")}</div>` : ""}
                  </div>
                  <div class="native-settings-inline-actions">
                    <button class="native-settings-action" type="button" data-native-extension-action="more" data-extension-path="${escapeHtml(entry.path || "")}">More</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="${
                      entry.enabled === false ? "enable" : "disable"
                    }" data-extension-path="${escapeHtml(entry.path || "")}">${
                      entry.enabled === false ? "Enable" : "Disable"
                    }</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="reload" data-extension-path="${escapeHtml(entry.path || "")}">Reload</button>
                    ${isDevModeActive ? `<button class="native-settings-action" type="button" data-native-extension-action="remove" data-extension-path="${escapeHtml(entry.path || "")}">Remove</button>` : ""}
                  </div>
                </div>
              </article>
            `;
            },
          )
          .join("")}
        </div>
      </section>
    `;
  }

  function renderNativeSettingsPasswordSection() {
    const credentialCache = state.credentialCache || {};
    const rows = [];
    Object.entries(credentialCache).forEach(([profileId, items]) => {
      (items || []).forEach((item, index) => {
        rows.push({
          key: `${profileId}:${index}`,
          profileId,
          domain: String(item.domain || "").toLowerCase(),
          username: String(item.username || ""),
          password: String(item.password || ""),
        });
      });
    });

    const profileOptions = Object.entries(PROFILES)
      .map(
        ([pId, profile]) => `
        <label class="profile-pill-item" style="cursor: pointer;" data-profile-id="${escapeHtml(pId)}">
          <input type="radio" name="nativePasswordProfile" value="${escapeHtml(pId)}" ${
            pId === (state.passwordProfileId || state.currentProfileId || "guest") ? "checked" : ""
          } style="cursor: pointer;" />
          <span class="profile-pill-dot" style="background-color: ${escapeHtml(profile.color || "#000")}"></span>
          <span>${escapeHtml(profile.name || "")}</span>
        </label>
      `,
      )
      .join("");

    return `
      <section class="native-settings-section">
        <div class="native-settings-section-head">
          <h3>Add or Update Password</h3>
          <p>Securely store credentials for quick autofill</p>
        </div>
        <form class="password-form" id="nativePasswordForm">
          <div class="password-field">
            <label>Domain</label>
            <input type="text" id="nativePasswordDomainInput" placeholder="example.com" required />
          </div>
          <div class="password-field">
            <label>Username</label>
            <input type="text" id="nativePasswordUsernameInput" placeholder="user@example.com" required />
          </div>
          <div class="password-field">
            <label>Password</label>
            <div class="password-input-wrapper" style="position: relative; display: flex; align-items: stretch;">
              <input type="password" id="nativePasswordSecretInput" placeholder="••••••••" required style="flex: 1; padding-right: 40px;" />
              <button type="button" id="nativePasswordToggleEye" class="password-visibility-toggle" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          <div class="password-field" style="grid-column: 1 / -1;">
            <label>Profile</label>
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${profileOptions}</div>
          </div>
          <button type="submit" class="native-settings-action" style="grid-column: 1 / -1; background: #3b82f6; color: white; font-weight: 600; padding: 10px 14px;">Save Credential</button>
        </form>
 
        <div class="native-settings-section-head" style="margin-top: 24px;">
          <h3>Saved Passwords</h3>
          <p>${rows.length} credential${rows.length !== 1 ? 's' : ''} stored</p>
        </div>
        
        ${rows.length === 0 
          ? '<div class="native-settings-empty">No saved credentials yet. Add one above.</div>'
          : `<div class="password-list">
              ${rows.map(row => `
                <div class="password-item" data-key="${escapeHtml(row.key)}">
                  <div><strong>${escapeHtml(row.domain)}</strong><div class="password-meta">${escapeHtml(row.profileId)}</div></div>
                  <div>${escapeHtml(row.username)}</div>
                  <div class="password-secret-container" style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <span class="password-secret" data-password="${escapeHtml(row.password)}" style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; word-break: break-all;">••••••••</span>
                    <button type="button" class="password-list-toggle-eye" style="background: none; border: none; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; color: #666; margin-left: auto;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  </div>
                  <div class="password-actions">
                    <button type="button" class="password-action-btn" data-action="edit">Edit</button>
                    <button type="button" class="password-action-btn" data-action="delete">Delete</button>
                  </div>
                </div>
              `).join('')}
            </div>`
        }
      </section>
    `;
  }

  async function loadCredentialsIntoCache() {
    if (!window.api?.listProfileCredentials) return;
    try {
      const resp = await window.api.listProfileCredentials();
      if (resp && Array.isArray(resp.data)) {
        const grouped = {
          wppproduction: [],
          vml: [],
          gsk: [],
          guest: [],
          synapse: [],
          contentgen: [],
        };
        resp.data.forEach((item) => {
          const pId = String(item.profileId || "").toLowerCase();
          if (!grouped[pId]) grouped[pId] = [];
          grouped[pId].push(item);
        });
        state.credentialCache = grouped;
      }
    } catch (e) {
      console.error("loadCredentialsIntoCache error:", e);
    }
  }

  function renderNativeSettingsPage(tab) {
    const container = document.getElementById("nativeTabContent");
    if (!container || !isNativeSettingsTab(tab)) return;
    const section = normalizeSettingsSection(tab.nativePage?.section);
    let sectionBody = "";
    let stickyToolbar = "";
    const sectionTitle = getSettingsTabTitle(section);
    let sectionDescription = "Manage app behavior without leaving the browser shell.";

    if (section === "downloads") {
      const totalDownloads = state.managedDownloadsCache.length;
      const activeDownloads = state.managedDownloadsCache.filter(
        (entry) => entry.state === "progressing",
      ).length;
      sectionBody = renderNativeSettingsDownloadsSection();
      sectionDescription = `${activeDownloads} active, ${totalDownloads} total downloads.`;
    } else if (section === "history") {
      const allHistoryRows = getAllHistoryRows();
      const historyCount = state.historySearchQuery.trim()
        ? allHistoryRows.filter((entry) =>
            `${entry.title || ""} ${entry.url || ""} ${entry.profileName || ""}`
              .toLowerCase()
              .includes(state.historySearchQuery.trim().toLowerCase()),
          ).length
        : allHistoryRows.length;
      stickyToolbar = `
        <div class="native-settings-inline native-settings-toolbar">
          <input
            id="nativeHistorySearchInput"
            class="native-settings-search"
            type="search"
            placeholder="Search all history"
            value="${escapeHtml(state.historySearchQuery)}"
          />
          <button class="native-settings-action" type="button" data-native-settings-action="clear-history">Clear all history</button>
        </div>
      `;
      sectionBody = renderNativeSettingsHistorySection();
      sectionDescription = `${historyCount} total history entries across all profiles.`;
    } else if (section === "extensions") {
      const enabledExtensions = state.browserExtensionsCache.filter(
        (entry) => entry.enabled !== false,
      ).length;
      stickyToolbar = `
        <div class="native-settings-toolbar">
          ${(function() {
            try {
              const role = String(localStorage.getItem("userRole") || "production").toLowerCase();
              const mode = String(localStorage.getItem("oneview_env_mode") || "prod").toLowerCase();
              return (role === "dev" && mode === "dev") ? '<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>' : '';
            } catch (_e) { return ''; }
          })()}
        </div>
      `;
      sectionBody = renderNativeSettingsExtensionsSection();
      sectionDescription = `${enabledExtensions} enabled out of ${state.browserExtensionsCache.length} extensions.`;
    } else if (section === "passwords") {
      sectionBody = renderNativeSettingsPasswordSection();
      sectionDescription = "Manage saved passwords securely.";

      if (!state._credentialsLoaded) {
        state._credentialsLoaded = true;
        loadCredentialsIntoCache().then(() => {
          renderNativeSettingsPage(tab);
        });
      }
    } else if (section === "about") {
      if (!state._aboutInfoLoaded) {
        state._aboutInfoLoaded = true;
        ensureNativeSettingsGeneralInfo().then(() => {
          renderNativeSettingsPage(tab);
        });
      }
      sectionBody = renderNativeSettingsAboutSection();
      sectionDescription = `OneView v${state.nativeSettingsGeneralInfo?.version || "1.3.7"} • Check for updates and system configuration.`;
    } else {
      state._credentialsLoaded = false;
    }

    container.innerHTML = `
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${escapeHtml(sectionTitle)}</h2>
                <p>${escapeHtml(sectionDescription)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions", "history", "downloads", "passwords", "about"]
                .map(
                  (item) => {
                    const shortcut = getSettingsShortcut(item);
                    return `
                    <button
                      type="button"
                      class="native-settings-chip ${item === section ? "is-active" : ""}"
                      data-native-settings-nav="${item}"
                      title="${escapeHtml(getSettingsTabTitle(item))}${shortcut ? ` (${shortcut})` : ""}"
                    >
                      <span>${escapeHtml(getSettingsTabTitle(item))}</span>
                      ${shortcut ? `<span class="native-settings-chip-shortcut">${escapeHtml(shortcut)}</span>` : ""}
                    </button>
                  `;
                  }
                )
                .join("")}
            </div>
            ${stickyToolbar}
          </div>
          <div class="native-settings-body">
            ${sectionBody}
          </div>
        </section>
      </div>
    `;
  }

  function renderNativeSettingsAboutSection() {
    const version = state.nativeSettingsGeneralInfo?.version || "1.3.7";
    const defaultStatus = state.nativeSettingsGeneralInfo?.defaultOpenStatus || "Configured";

    return `
      <section class="native-settings-section">
        <div class="native-settings-section-head">
          <h3>OneView App & Updates</h3>
          <p>Application version, update status, and system configurations</p>
        </div>
        <div class="native-settings-list">
          <article class="native-settings-row">
            <div class="native-settings-row-main">
              <div>
                <div class="native-settings-row-title">Version</div>
                <div class="native-settings-row-note">v${escapeHtml(version)}</div>
              </div>
              <div class="native-settings-inline-actions">
                <button class="native-settings-action" type="button" data-native-settings-action="check-updates">Check for updates</button>
              </div>
            </div>
          </article>
          <article class="native-settings-row">
            <div class="native-settings-row-main">
              <div>
                <div class="native-settings-row-title">Default Browser</div>
                <div class="native-settings-row-note">${escapeHtml(defaultStatus)}</div>
              </div>
              <div class="native-settings-inline-actions">
                <button class="native-settings-action" type="button" data-native-settings-action="open-default-apps">Open Default Apps Settings</button>
              </div>
            </div>
          </article>
        </div>
      </section>
    `;
  }

  async function refreshActiveNativeSettingsPage() {
    const activeTab = getActiveTab();
    if (!isNativeSettingsTab(activeTab)) return;
    renderNativeSettingsPage(activeTab);
  }

  function updateNativeSettingsTabSection(
    section = "extensions",
    tabId = state.activeTabId,
  ) {
    const tab = state.tabs.find((item) => item.id === tabId);
    if (!isNativeSettingsTab(tab)) return;
    const nextSection = normalizeSettingsSection(section);
    tab.nativePage.section = nextSection;
    updateTabTitle(tab.id, getSettingsTabTitle(nextSection));
    if (tab.id === state.activeTabId) {
      renderNativeSettingsPage(tab);
    }
  }

  function openSettingsTab(section = "extensions") {
    const existingTab = findExistingSettingsTab(section);
    if (existingTab) {
      switchTab(existingTab.id);
      return;
    }
    createTab(null, null, getSettingsTabTitle(section), null, {
      nativePage: createNativePageDescriptor("settings", section),
    });
  }

  function initSettingsMenu() {
    const btn = document.getElementById("settingsBtn");

    if (btn && btn.dataset.boundClick !== "1") {
      btn.dataset.boundClick = "1";
      btn.addEventListener("click", () => {
        openSettingsTab("extensions");
      });
    }
  }

  function initNativeSettingsUi() {
    const container = document.getElementById("nativeTabContent");
    if (!container || container.dataset.boundNativeSettings === "1") return;
    container.dataset.boundNativeSettings = "1";

    window.addEventListener("credentials-updated", () => {
      state._credentialsLoaded = false;
      const activeTab = getActiveTab();
      if (isNativeSettingsTab(activeTab) && activeTab.nativePage?.section === "passwords") {
        loadCredentialsIntoCache().then(() => {
          renderNativeSettingsPage(activeTab);
        });
      }
    });

    const restoreHistorySearchFocus = (selectionStart = null, selectionEnd = null) => {
      requestAnimationFrame(() => {
        const nextInput = document.getElementById("nativeHistorySearchInput");
        if (!nextInput) return;
        nextInput.focus({ preventScroll: true });
        if (
          Number.isInteger(selectionStart) &&
          Number.isInteger(selectionEnd) &&
          typeof nextInput.setSelectionRange === "function"
        ) {
          try {
            nextInput.setSelectionRange(selectionStart, selectionEnd);
          } catch (_error) {}
        }
      });
    };

    container.addEventListener("click", async (event) => {
      const eyeButton = event.target.closest(".password-visibility-toggle");
      if (eyeButton) {
        event.preventDefault();
        const secretInput = document.getElementById("nativePasswordSecretInput");
        if (secretInput) {
          const isPassword = secretInput.type === "password";
          secretInput.type = isPassword ? "text" : "password";
          eyeButton.innerHTML = isPassword ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          `;
        }
        return;
      }

      const listEyeButton = event.target.closest(".password-list-toggle-eye");
      if (listEyeButton) {
        event.preventDefault();
        const secretSpan = listEyeButton.parentNode.querySelector(".password-secret");
        if (secretSpan) {
          const rawPassword = secretSpan.dataset.password || "";
          const isMasked = secretSpan.textContent === "••••••••";
          
          if (isMasked) {
            secretSpan.textContent = rawPassword;
            listEyeButton.innerHTML = `
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            `;
          } else {
            secretSpan.textContent = "••••••••";
            listEyeButton.innerHTML = `
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            `;
          }
        }
        return;
      }

      const navBtn = event.target.closest("[data-native-settings-nav]");
      if (navBtn) {
        updateNativeSettingsTabSection(navBtn.dataset.nativeSettingsNav || "extensions");
        return;
      }

      const settingsAction = event.target.closest("[data-native-settings-action]");
      if (settingsAction) {
        const action = String(settingsAction.dataset.nativeSettingsAction || "").trim();
        try {
          if (action === "check-updates" && window.api?.checkForUpdates) {
            if (typeof window.triggerManualSystemUpdateCheck === "function") {
              await window.triggerManualSystemUpdateCheck();
            } else {
              showToast("Checking for OneView updates...", "info", 3000);
              try {
                const res = await window.api.checkForUpdates();
                if (res && res.updateAvailable) {
                  showToast(
                    `Update v${res.latestVersion || res.version || ""} is available!`,
                    "info",
                    5000,
                  );
                } else {
                  showToast("OneView is already up to date.", "success", 4000);
                }
              } catch (e) {
                showToast(e?.message || "Could not check for updates.", "error", 4000);
              }
            }
          } else if (
            action === "open-default-apps" &&
            window.api?.openDefaultAppSettings
          ) {
            await window.api.openDefaultAppSettings();
          } else if (
            action === "load-unpacked-extension" &&
            window.api?.addBrowserExtensionsUnpacked
          ) {
            await window.api.addBrowserExtensionsUnpacked();
            await refreshExtensionsManagerList();
            await refreshActiveNativeSettingsPage();
            showToast("Unpacked extensions loaded.", "success");
          } else if (action === "clear-history") {
            Object.keys(state.profileHistoryCache || {}).forEach((profileId) => {
              state.profileHistoryCache[profileId] = [];
            });
            saveProfileHistoryStore();
            renderNativeSettingsPage(getActiveTab());
          }
        } catch (error) {
          showToast(error?.message || "Could not complete settings action.", "error");
        }
        return;
      }

      const downloadBtn = event.target.closest("[data-native-download-action]");
      if (downloadBtn) {
        try {
          const result = await window.api?.runManagedDownloadAction?.({
            id: String(downloadBtn.dataset.downloadId || "").trim(),
            action: String(downloadBtn.dataset.nativeDownloadAction || "").trim(),
          });
          if (Array.isArray(result?.downloads)) {
            state.managedDownloadsCache = result.downloads;
          } else {
            await loadManagedDownloadsFromMain();
          }
          await refreshActiveNativeSettingsPage();
        } catch (error) {
          showToast(error?.message || "Could not complete download action.", "error");
        }
        return;
      }

      const historyBtn = event.target.closest("[data-native-history-action]");
      if (historyBtn) {
        const profileId = String(
          historyBtn.dataset.profileId || state.historyProfileId || state.currentProfileId,
        );
        const visitedAt = String(historyBtn.dataset.historyTime || "");
        const entryIndex = (state.profileHistoryCache[profileId] || []).findIndex(
          (item) => String(item.visitedAt || "") === visitedAt,
        );
        const entry =
          entryIndex >= 0 ? (state.profileHistoryCache[profileId] || [])[entryIndex] : null;
        if (!entry) return;
        if (historyBtn.dataset.nativeHistoryAction === "delete") {
          state.profileHistoryCache[profileId].splice(entryIndex, 1);
          saveProfileHistoryStore();
          state.historyProfileId = profileId;
          renderNativeSettingsPage(getActiveTab());
        } else {
          const targetPartition = PROFILES[profileId]?.partition || PARTITIONS.guest;
          createTab(entry.url, targetPartition, entry.title || "History", profileId);
        }
        return;
      }

      const extensionBtn = event.target.closest("[data-native-extension-action]");
      if (extensionBtn) {
        const action = String(extensionBtn.dataset.nativeExtensionAction || "").trim();
        const entryPath = String(extensionBtn.dataset.extensionPath || "").trim();
        try {
          if (action === "more" && window.api?.getExtensionShortcutsInfo) {
            await showExtensionDetailsModal(entryPath);
          } else if (action === "reload" && window.api?.reloadBrowserExtension) {
            await window.api.reloadBrowserExtension({ path: entryPath });
            showToast("Extension reloaded.", "success");
          } else if (
            (action === "enable" || action === "disable") &&
            window.api?.toggleBrowserExtension
          ) {
            if (action === "disable" && typeof window.api?.closeBrowserExtensionPopup === "function") {
              await window.api.closeBrowserExtensionPopup();
            }
            await window.api.toggleBrowserExtension({
              path: entryPath,
              enabled: action === "enable",
            });
          } else if (action === "remove" && window.api?.removeBrowserExtension) {
            if (typeof window.api?.closeBrowserExtensionPopup === "function") {
              await window.api.closeBrowserExtensionPopup();
            }
            await window.api.removeBrowserExtension({ path: entryPath });
          }
          await refreshExtensionsManagerList();
          await refreshActiveNativeSettingsPage();
        } catch (error) {
          showToast(error?.message || "Could not complete extension action.", "error");
        }
      }
    });

    container.addEventListener("input", (event) => {
      const searchInput = event.target.closest("#nativeHistorySearchInput");
      if (searchInput) {
        const selectionStart = Number.isInteger(searchInput.selectionStart)
          ? searchInput.selectionStart
          : null;
        const selectionEnd = Number.isInteger(searchInput.selectionEnd)
          ? searchInput.selectionEnd
          : selectionStart;
        state.historySearchQuery = String(searchInput.value || "");
        renderNativeSettingsPage(getActiveTab());
        restoreHistorySearchFocus(selectionStart, selectionEnd);
        return;
      }

      const profileRadio = event.target.closest("input[name='nativePasswordProfile']");
      if (profileRadio) {
        state.passwordProfileId = String(profileRadio.value || "");
        return;
      }
    });

    // Password manager handlers
    container.addEventListener("submit", async (event) => {
      const passwordForm = event.target.closest("#nativePasswordForm");
      if (!passwordForm) return;
      event.preventDefault();
      
      const domainInput = document.getElementById("nativePasswordDomainInput");
      const usernameInput = document.getElementById("nativePasswordUsernameInput");
      const secretInput = document.getElementById("nativePasswordSecretInput");
      if (!domainInput || !usernameInput || !secretInput) return;

      const domain = String(domainInput.value || "").trim().toLowerCase();
      const username = String(usernameInput.value || "").trim();
      const password = String(secretInput.value || "");
      const profileId = state.passwordProfileId || state.currentProfileId || "guest";

      if (!domain || !username || !password) {
        showToast("Please fill in all fields.", "error");
        return;
      }

      try {
        if (!window.api?.saveProfileCredential) {
          showToast("Credential API unavailable.", "error");
          return;
        }

        const saveResp = await window.api.saveProfileCredential({
          profileId,
          domain,
          username,
          password,
        });

        if (!saveResp || !saveResp.success) {
          showToast("Failed to save credential.", "error");
          return;
        }

        // Refresh credentials cache
        await loadCredentialsIntoCache();

        showToast("Credential saved successfully.", "success");
        passwordForm.reset();
        renderNativeSettingsPage(getActiveTab());
      } catch (error) {
        showToast(error?.message || "Could not save credential.", "error");
      }
    });

    container.addEventListener("click", async (event) => {
      const passwordBtn = event.target.closest(".password-action-btn");
      if (!passwordBtn) return;

      const action = String(passwordBtn.dataset.action || "").trim();
      const passwordItem = passwordBtn.closest(".password-item");
      const key = String(passwordItem?.dataset.key || "");
      const [profileId, indexText] = key.split(":");
      const index = Number(indexText);

      if (!profileId || Number.isNaN(index)) return;

      const credentialCache = state.credentialCache || {};
      const item = (credentialCache[profileId] || [])[index];
      if (!item) return;

      try {
        if (action === "delete") {
          if (!window.api?.deleteProfileCredential) {
            showToast("Credential API unavailable.", "error");
            return;
          }

          const deleteResp = await window.api.deleteProfileCredential({
            profileId,
            domain: String(item.domain || "").toLowerCase(),
            username: String(item.username || ""),
          });

          if (!deleteResp || !deleteResp.success) {
            showToast("Failed to delete credential.", "error");
            return;
          }

          // Refresh credentials cache
          await loadCredentialsIntoCache();

          showToast("Credential deleted successfully.", "success");
          renderNativeSettingsPage(getActiveTab());
        } else if (action === "edit") {
          const domainInput = document.getElementById("nativePasswordDomainInput");
          const usernameInput = document.getElementById("nativePasswordUsernameInput");
          const secretInput = document.getElementById("nativePasswordSecretInput");
          const profileSelect = document.getElementById("nativePasswordProfileSelect");

          if (!domainInput || !usernameInput || !secretInput) return;

          state.passwordProfileId = profileId;
          domainInput.value = String(item.domain || "").toLowerCase();
          usernameInput.value = String(item.username || "");
          secretInput.value = String(item.password || "");

          // Render profile select
          if (profileSelect) {
            profileSelect.innerHTML = Object.entries(PROFILES || {})
              .map(
                ([pId, profile]) => `
                <label class="profile-pill-item ${pId === profileId ? "active" : ""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${escapeHtml(pId)}" ${
                    pId === profileId ? "checked" : ""
                  } style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${escapeHtml(profile.color || "#000")}"></span>
                  <span>${escapeHtml(profile.name || "")}</span>
                </label>
              `,
              )
              .join("");

            profileSelect.addEventListener("change", (e) => {
              const selectedProfile = e.target.value;
              if (selectedProfile) {
                state.passwordProfileId = selectedProfile;
              }
            });
          }

          // Scroll to form
          const form = document.getElementById("nativePasswordForm");
          form?.scrollIntoView({ behavior: "smooth" });
          domainInput.focus();
        }
      } catch (error) {
        showToast(error?.message || "Could not complete password action.", "error");
      }
    });
  }

  function bindSettingsShortcutsGlobal() {
    document.addEventListener("keydown", (event) => {
      if (!isEditableShortcutTarget(event.target)) {
        if (event.ctrlKey) {
          if ((event.key === "H" || event.key === "h") && !event.shiftKey) {
            event.preventDefault();
            openSettingsTab("history");
          } else if ((event.key === "E" || event.key === "e") && !event.shiftKey) {
            event.preventDefault();
            openSettingsTab("extensions");
          } else if ((event.key === "D" || event.key === "d") && event.shiftKey) {
            event.preventDefault();
            openSettingsTab("downloads");
          }
        }
      }
    });
  }

  async function showExtensionDetailsModal(extensionPath = "") {
    const modal = document.getElementById("extensionDetailsModal");
    const closeBtn = document.getElementById("extensionDetailsCloseBtn");
    const contentDiv = document.getElementById("extensionDetailsContent");
    const titleDiv = document.getElementById("extensionDetailsTitle");

    if (!modal || !contentDiv) return;

    try {
      // Fetch extension shortcuts info from main process
      const result = await window.api?.getExtensionShortcutsInfo?.({
        path: extensionPath,
      });

      if (!result?.success) {
        contentDiv.innerHTML = `<div class="extension-details-empty">Unable to load extension details.</div>`;
      } else {
        const { name, shortcuts, errors, conflicts } = result;
        titleDiv.textContent = `${escapeHtml(name || "Extension")} Details`;

        let shortcutsHtml = "";
        if (shortcuts && shortcuts.length > 0) {
          shortcutsHtml = `
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-shortcuts-list">
                ${shortcuts
                  .map(
                    (shortcut) => `
                      <div class="extension-shortcut-item">
                        <span class="extension-shortcut-key">${escapeHtml(shortcut.originalKey || shortcut.key)}</span>
                        <span class="extension-shortcut-desc">${escapeHtml(shortcut.description || "No description")}</span>
                        <span class="extension-shortcut-status ${shortcut.isActive ? "active" : "conflict"}">
                          ${shortcut.isActive ? "✓ Active" : "⚠ Conflict"}
                        </span>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          `;
        } else {
          shortcutsHtml = `
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-details-empty">No keyboard shortcuts defined.</div>
            </div>
          `;
        }

        let errorsHtml = "";
        if (errors && errors.length > 0) {
          errorsHtml = `
            <div class="extension-details-section">
              <h4>Issues</h4>
              <div class="extension-errors-list">
                ${errors
                  .map(
                    (error) => `
                      <div class="extension-error-item">
                        <div class="extension-error-type">${escapeHtml(error.type)}</div>
                        <div class="extension-error-message">${escapeHtml(error.message)}</div>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          `;
        }

        let conflictsHtml = "";
        if (conflicts && conflicts.length > 0) {
          conflictsHtml = `
            <div class="extension-details-section">
              <h4>Shortcut Conflicts</h4>
              <div class="extension-conflicts-list">
                ${conflicts
                  .map(
                    (conflict) => `
                      <div class="extension-conflict-item">
                        <div class="extension-conflict-key">${escapeHtml(conflict.key)}</div>
                        <div class="extension-conflict-extensions">
                          <strong>Conflicting with:</strong><br/>
                          ${conflict.conflictingExtensions
                            .map((ext) => `${escapeHtml(ext.name)}`)
                            .join("<br/>")}
                        </div>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          `;
        }

        contentDiv.innerHTML = `${shortcutsHtml}${errorsHtml}${conflictsHtml}`;
      }

      modal.classList.remove("hidden");
      if (closeBtn) {
        closeBtn.onclick = () => {
          modal.classList.add("hidden");
        };
      }
    } catch (error) {
      console.error("Failed to load extension details:", error);
      contentDiv.innerHTML = `<div class="extension-details-empty">Error loading extension details.</div>`;
      modal.classList.remove("hidden");
    }
  }

  return {
    bindSettingsShortcutsGlobal,
    createNativePageDescriptor,
    ensureNativeSettingsGeneralInfo,
    getSettingsTabTitle,
    getSettingsShortcut,
    initNativeSettingsUi,
    initSettingsMenu,
    isEditableShortcutTarget,
    isNativeSettingsTab,
    normalizeSettingsSection,
    openSettingsTab,
    refreshActiveNativeSettingsPage,
    renderNativeSettingsPage,
    updateNativeSettingsTabSection,
  };
}
