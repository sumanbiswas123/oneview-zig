/**
 * GitHub Update Helper Module
 * Handles communication with main process for GitHub-based updates
 * Provides UI notifications and update status tracking
 */

class GitHubUpdateHelper {
  constructor(notificationsModule = null) {
    this.notifications = notificationsModule;
    this.updateInfo = null;
    this.currentStatus = null;
    this.listenForUpdates();
  }

  /**
   * Listen for update status changes from main process
   */
  listenForUpdates() {
    if (window.api && window.api.onUpdateStatus) {
      window.api.onUpdateStatus((status, data = {}) => {
        this.handleUpdateStatus(status, data);
      });
    }
  }

  /**
   * Handle update status messages from main process
   */
  handleUpdateStatus(status, data = {}) {
    this.currentStatus = status;
    console.log(`[GitHub Update] Status: ${status}`, data);

    switch (status) {
      case "checking":
        this.showNotification("Checking for updates...", "info");
        break;

      case "available":
        this.updateInfo = data;
        this.showNotification(
          `Update available: v${data.version}`,
          "info",
          10000
        );
        this.notifyUpdateAvailable(data);
        break;

      case "not-available":
        console.log("[GitHub Update] App is up to date");
        break;

      case "progress":
        this.showProgressNotification(
          `Downloading update: ${data.percent}%`,
          data.percent
        );
        break;

      case "downloaded":
        this.updateInfo = data;
        this.showNotification(
          `Update v${data.version} downloaded. Please restart to install.`,
          "success",
          15000
        );
        this.notifyUpdateReady(data);
        break;

      case "installing":
        this.showNotification(
          "Installing update... The app will restart shortly.",
          "info"
        );
        break;

      case "error":
        this.showNotification(
          `Update failed: ${data.error || "Unknown error"}`,
          "error",
          10000
        );
        break;

      default:
        console.log(`[GitHub Update] Unknown status: ${status}`);
    }
  }

  /**
   * Show notification using notifications module or fallback to console/alert
   */
  showNotification(message, type = "info", duration = 5000) {
    if (this.notifications && this.notifications.show) {
      this.notifications.show(message, type, duration);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Show progress notification (simplified - just logs)
   */
  showProgressNotification(message, percent) {
    if (this.notifications && this.notifications.show) {
      // Only show every 10% to avoid spam
      if (percent % 10 === 0 || percent === 100) {
        this.notifications.show(message, "info", 2000);
      }
    }
  }

  /**
   * Custom handler for when update is available
   * Can be overridden or extended
   */
  notifyUpdateAvailable(data) {
    // Emit custom event that UI can listen for
    const event = new CustomEvent("github-update-available", {
      detail: data,
    });
    window.dispatchEvent(event);
  }

  /**
   * Custom handler for when update is ready
   * Can be overridden or extended
   */
  notifyUpdateReady(data) {
    // Emit custom event that UI can listen for
    const event = new CustomEvent("github-update-ready", { detail: data });
    window.dispatchEvent(event);
  }

  /**
   * Check for updates manually
   */
  async checkForUpdates() {
    try {
      this.showNotification("Checking for updates...", "info");
      const result = await window.api.githubCheckForUpdates();
      return result;
    } catch (error) {
      this.showNotification(
        `Failed to check updates: ${error.message}`,
        "error",
        10000
      );
      throw error;
    }
  }

  /**
   * Install the downloaded update
   */
  async installUpdate() {
    try {
      this.showNotification(
        "Installing update... The app will restart.",
        "info"
      );
      await window.api.githubInstallUpdate();
    } catch (error) {
      this.showNotification(
        `Failed to install update: ${error.message}`,
        "error",
        10000
      );
      throw error;
    }
  }

  /**
   * Get current update info
   */
  async getUpdateInfo() {
    try {
      return await window.api.githubGetUpdateInfo();
    } catch (error) {
      console.error("Failed to get update info:", error);
      return null;
    }
  }

  /**
   * Get current update status
   */
  getStatus() {
    return this.currentStatus;
  }

  /**
   * Check if update is available
   */
  isUpdateAvailable() {
    return this.currentStatus === "available";
  }

  /**
   * Check if update is downloaded and ready
   */
  isUpdateReady() {
    return this.currentStatus === "downloaded";
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GitHubUpdateHelper };
}
