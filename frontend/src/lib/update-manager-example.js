/**
 * Example: Integrating GitHub Auto-Update System into Your Dashboard
 * 
 * This example shows how to add update notifications and controls
 * to your application's main dashboard or any other component.
 */

// Example usage in dashboard.js or similar
// import { GitHubUpdateHelper } from "../lib/github-update-helper.js";

class UpdateManager {
  constructor() {
    // Initialize the update helper
    // You can pass the notifications module if available
    this.updateHelper = null;
    this.updateInfo = null;
    this.isUpdateReady = false;
    
    this.init();
  }

  init() {
    // Try to load the helper - it's in the lib folder
    if (typeof GitHubUpdateHelper !== 'undefined') {
      // Assuming notifications are available globally or via window.notifications
      const notificationsModule = window.notifications || null;
      this.updateHelper = new GitHubUpdateHelper(notificationsModule);
      
      // Set up event listeners
      this.setupEventListeners();
      console.log("[UpdateManager] GitHub updater initialized");
    } else {
      console.warn("[UpdateManager] GitHubUpdateHelper not available");
    }
  }

  setupEventListeners() {
    // Listen for update availability
    window.addEventListener("github-update-available", (e) => {
      this.handleUpdateAvailable(e.detail);
    });

    // Listen for update ready to install
    window.addEventListener("github-update-ready", (e) => {
      this.handleUpdateReady(e.detail);
    });

    // Listen for status changes via IPC
    if (window.electronAPI) {
      window.electronAPI.onUpdateStatus?.((status, data) => {
        this.handleStatusChange(status, data);
      });
    }
  }

  handleUpdateAvailable(updateInfo) {
    console.log("[UpdateManager] Update available:", updateInfo);
    this.updateInfo = updateInfo;
    
    // Show notification
    if (window.notifications) {
      window.notifications.show(
        `Update v${updateInfo.version} is available and downloading...`,
        'info',
        5000
      );
    }
    
    // You could also:
    // 1. Store in state
    // 2. Enable an update button
    // 3. Show a banner
    this.showUpdateBanner(updateInfo);
  }

  handleUpdateReady(updateInfo) {
    console.log("[UpdateManager] Update ready to install:", updateInfo);
    this.updateInfo = updateInfo;
    this.isUpdateReady = true;
    
    // Show notification
    if (window.notifications) {
      window.notifications.show(
        `Update v${updateInfo.version} downloaded and ready to install. Restart to apply.`,
        'success',
        10000
      );
    }
    
    // Show install prompt
    this.showInstallPrompt(updateInfo);
  }

  handleStatusChange(status, data) {
    console.log(`[UpdateManager] Status: ${status}`, data);
    
    switch (status) {
      case 'checking':
        console.log("[UpdateManager] Checking for updates...");
        break;
      case 'progress':
        console.log(`[UpdateManager] Download progress: ${data.percent}%`);
        this.updateProgressBar?.(data.percent);
        break;
      case 'installing':
        console.log("[UpdateManager] Installing update...");
        this.showInstalling?.();
        break;
      case 'error':
        console.error("[UpdateManager] Update error:", data.error);
        if (window.notifications) {
          window.notifications.show(
            `Update failed: ${data.error}`,
            'error',
            10000
          );
        }
        break;
    }
  }

  showUpdateBanner(updateInfo) {
    // Example: Show a banner in your UI
    const banner = document.getElementById("update-banner");
    if (banner) {
      banner.innerHTML = `
        <div class="update-notification">
          <span>Update v${updateInfo.version} available</span>
          <span class="release-name">${updateInfo.releaseName || ''}</span>
        </div>
      `;
      banner.style.display = "block";
    }
  }

  showInstallPrompt(updateInfo) {
    // Example: Show install dialog
    const dialog = document.getElementById("update-dialog");
    if (dialog) {
      dialog.innerHTML = `
        <div class="update-ready-dialog">
          <h3>Update Ready to Install</h3>
          <p>Version ${updateInfo.version} has been downloaded.</p>
          <div class="release-notes">
            ${updateInfo.releaseNotes ? `
              <h4>Release Notes:</h4>
              <p>${updateInfo.releaseNotes}</p>
            ` : ''}
          </div>
          <div class="dialog-buttons">
            <button id="install-now-btn" class="btn-primary">Install & Restart</button>
            <button id="install-later-btn" class="btn-secondary">Later</button>
          </div>
        </div>
      `;
      dialog.style.display = "block";
      
      // Attach event listeners
      document.getElementById("install-now-btn")?.addEventListener("click", () => {
        this.installUpdate();
      });
      
      document.getElementById("install-later-btn")?.addEventListener("click", () => {
        dialog.style.display = "none";
      });
    }
  }

  async installUpdate() {
    try {
      console.log("[UpdateManager] Installing update...");
      await this.updateHelper.installUpdate();
    } catch (error) {
      console.error("[UpdateManager] Install failed:", error);
      if (window.notifications) {
        window.notifications.show(
          `Failed to install update: ${error.message}`,
          'error',
          10000
        );
      }
    }
  }

  async checkManually() {
    try {
      console.log("[UpdateManager] Manually checking for updates...");
      const result = await this.updateHelper.checkForUpdates();
      console.log("[UpdateManager] Check result:", result);
      return result;
    } catch (error) {
      console.error("[UpdateManager] Check failed:", error);
      if (window.notifications) {
        window.notifications.show(
          `Failed to check for updates: ${error.message}`,
          'error',
          5000
        );
      }
    }
  }
}

// Usage in your dashboard.js:
/*
// At the top of dashboard.js, initialize the update manager
const updateManager = new UpdateManager();

// You can also manually trigger a check from a menu or button:
document.getElementById("check-updates-btn")?.addEventListener("click", () => {
  updateManager.checkManually();
});

// Or in settings:
function initSettingsPage() {
  const checkUpdatesBtn = document.getElementById("settings-check-updates");
  if (checkUpdatesBtn) {
    checkUpdatesBtn.addEventListener("click", () => {
      updateManager.checkManually();
    });
  }
}
*/

// Example HTML elements you might need:
/*
<div id="update-banner" class="update-banner" style="display: none;"></div>
<div id="update-dialog" class="modal" style="display: none;"></div>
<button id="check-updates-btn">Check for Updates</button>
*/

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UpdateManager };
}
