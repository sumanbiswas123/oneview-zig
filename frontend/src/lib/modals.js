import { showToast } from "./notifications.js";
import { clearMirroredOneviewSharedStorage } from "./oneview-shared-storage.js";
import { stopConnectivityMonitor } from "./connectivity-monitor.js";

import { APP_SERVICE_BASE_URL, IS_DEV_APP_BUILD } from "./app-env.js";
import { STORAGE_KEYS } from "./app-runtime.js";
/**
 * Modal functionality (change password, profile menu)
 */
let overlayLockCount = 0;
let hiddenNativeHosts = [];
let hiddenNativeHostSnapshots = [];
let changePasswordForced = false;

function overlayLog(message, payload = {}) {
  try {
    console.log(`[overlay][renderer] ${message}`, payload);
  } catch (_err) {}
}

function ensureSnapshotLayer() {
  let layer = document.getElementById("native-overlay-snapshot-layer");
  if (layer) return layer;
  layer = document.createElement("div");
  layer.id = "native-overlay-snapshot-layer";
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "999";
  document.body.appendChild(layer);
  return layer;
}

function getVisibleNativeHosts() {
  return Array.from(
    document.querySelectorAll(".webcontent-pane, .webcontent-host"),
  ).filter((host) => {
    if (!host || typeof host.syncBounds !== "function") return false;
    const rect = host.getBoundingClientRect();
    const style = window.getComputedStyle(host);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      !host.classList.contains("hidden")
    );
  });
}

async function hideNativeHostsForOverlay(options = {}) {
  const captureSnapshots = options.captureSnapshots !== false;
  hiddenNativeHosts = getVisibleNativeHosts();
  overlayLog("hide:start", {
    hostCount: hiddenNativeHosts.length,
    captureSnapshots,
    hosts: hiddenNativeHosts.map((host) => ({
      id: host.id || "",
      className: host.className || "",
      rect: host.getBoundingClientRect().toJSON?.() || null,
    })),
  });
  hiddenNativeHostSnapshots = await Promise.all(
    hiddenNativeHosts.map(async (host, index) => {
      let dataUrl = "";
      if (captureSnapshots) {
        try {
          const response = await host._webContent?.call?.("capture-page");
          overlayLog("capture:response", {
            index,
            success: response?.success ?? null,
            message: response?.message || "",
            dataUrlLength: response?.dataUrl?.length || 0,
          });
          if (response?.success && response.dataUrl) {
            dataUrl = response.dataUrl;
          }
        } catch (err) {
          overlayLog("capture:error", {
            index,
            message: err?.message || String(err),
          });
        }
      }

      const previousBackgroundImage = host.style.backgroundImage || "";
      const previousBackgroundSize = host.style.backgroundSize || "";
      const previousBackgroundPosition = host.style.backgroundPosition || "";
      const previousBackgroundRepeat = host.style.backgroundRepeat || "";
      const previousBackgroundColor = host.style.backgroundColor || "";
      const rect = host.getBoundingClientRect();

      let snapshotEl = null;
      if (dataUrl) {
        const computedStyle = window.getComputedStyle(host);
        const layer = ensureSnapshotLayer();
        snapshotEl = document.createElement("div");
        snapshotEl.className = "native-overlay-snapshot";
        snapshotEl.style.position = "fixed";
        snapshotEl.style.left = `${Math.round(rect.left)}px`;
        snapshotEl.style.top = `${Math.round(rect.top)}px`;
        snapshotEl.style.width = `${Math.round(rect.width)}px`;
        snapshotEl.style.height = `${Math.round(rect.height)}px`;
        snapshotEl.style.pointerEvents = "none";
        snapshotEl.style.backgroundImage = `url("${dataUrl}")`;
        snapshotEl.style.backgroundSize = "cover";
        snapshotEl.style.backgroundPosition = "center";
        snapshotEl.style.backgroundRepeat = "no-repeat";
        snapshotEl.style.backgroundColor = computedStyle.backgroundColor || "#fff";
        layer.appendChild(snapshotEl);

        overlayLog("capture:applied", {
          index,
          dataUrlLength: dataUrl.length,
          hostWidth: host.clientWidth,
          hostHeight: host.clientHeight,
          left: Math.round(rect.left),
          top: Math.round(rect.top),
        });
      } else {
        overlayLog("capture:missing", { index });
      }
      if (!previousBackgroundColor) {
        host.style.backgroundColor = "#ffffff";
      }

      host.classList.add("native-overlay-hidden");
      try {
        await host._webContent?.call?.("hide");
      } catch (err) {
        overlayLog("hide:error", {
          index,
          message: err?.message || String(err),
        });
      }
      overlayLog("hide:done", { index });

      return {
        host,
        previousBackgroundImage,
        previousBackgroundSize,
        previousBackgroundPosition,
        previousBackgroundRepeat,
        previousBackgroundColor,
        snapshotEl,
      };
    }),
  );
}


function restoreNativeHostsAfterOverlay() {
  const hostsToRestore = hiddenNativeHosts.slice();
  const snapshotsToRestore = hiddenNativeHostSnapshots.slice();
  overlayLog("restore:start", { hostCount: hostsToRestore.length });
  hiddenNativeHosts = [];
  hiddenNativeHostSnapshots = [];
  requestAnimationFrame(() => {
    snapshotsToRestore.forEach((entry) => {
      const { host } = entry;
      if (!host) return;
      host.style.backgroundImage = entry.previousBackgroundImage;
      host.style.backgroundSize = entry.previousBackgroundSize;
      host.style.backgroundPosition = entry.previousBackgroundPosition;
      host.style.backgroundRepeat = entry.previousBackgroundRepeat;
      host.style.backgroundColor = entry.previousBackgroundColor;
      if (entry.snapshotEl && entry.snapshotEl.parentNode) {
        entry.snapshotEl.remove();
      }
    });
    hostsToRestore.forEach((host) => {
      try {
        host.classList.remove("native-overlay-hidden");
        host._webContent?.call?.("show");
        overlayLog("restore:show-called", {
          id: host.id || "",
          className: host.className || "",
        });
      } catch (_err) {}
    });
  });
}

export async function openOverlayModal(modalOpenLogic, options = {}) {
  overlayLockCount += 1;
  overlayLog("open", { overlayLockCount });
  if (overlayLockCount === 1) {
    await hideNativeHostsForOverlay(options);
  }
  modalOpenLogic();
}

export function closeOverlayModal(modalCloseLogic) {
  modalCloseLogic();
  overlayLockCount = Math.max(0, overlayLockCount - 1);
  overlayLog("close", { overlayLockCount });
  if (overlayLockCount === 0) {
    restoreNativeHostsAfterOverlay();
  }
}
/**
 * Initialize change password modal
 */
export function initializeChangePasswordModal() {
  const modal = document.getElementById("change-password-modal");
  const changePasswordForm = document.getElementById("change-password-form");
  // ... (rest of function)
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  const oldPasswordInput = document.getElementById("old-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const helperText = document.getElementById("change-password-hint");
  const visibilityButtons = Array.from(
    document.querySelectorAll(".password-visibility-btn"),
  );

  function getCompletedUsersMap() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.passwordChangeCompletedUsers);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {};
    } catch (_err) {
      return {};
    }
  }

  function markPasswordChangeCompleted() {
    try {
      const username = String(localStorage.getItem("username") || "").trim();
      if (!username) return;
      const completed = getCompletedUsersMap();
      completed[username] = {
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        STORAGE_KEYS.passwordChangeCompletedUsers,
        JSON.stringify(completed),
      );
      if (
        localStorage.getItem(STORAGE_KEYS.passwordChangePendingUser) === username
      ) {
        localStorage.removeItem(STORAGE_KEYS.passwordChangePendingUser);
      }
    } catch (_err) {}
  }

  function syncPasswordVisibilityButton(button, input) {
    if (!button || !input) return;
    const isVisible = input.type === "text";
    button.textContent = isVisible ? "Hide" : "Show";
    const label = input.getAttribute("aria-label") || "password";
    button.setAttribute(
      "aria-label",
      `${isVisible ? "Hide" : "Show"} ${label.toLowerCase()}`,
    );
    button.title = button.getAttribute("aria-label");
  }

  visibilityButtons.forEach((button) => {
    const targetId = String(button.dataset.target || "").trim();
    const input = targetId ? document.getElementById(targetId) : null;
    syncPasswordVisibilityButton(button, input);
    button.addEventListener("click", () => {
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      syncPasswordVisibilityButton(button, input);
      input.focus();
      if (typeof input.setSelectionRange === "function") {
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  });

  function showChangePasswordModal(options = {}) {
    if (!modal) return;
    changePasswordForced = Boolean(options.forced);
    modal.dataset.forced = changePasswordForced ? "1" : "0";
    if (modalCloseBtn) modalCloseBtn.style.display = changePasswordForced ? "none" : "";
    if (modalCancelBtn) modalCancelBtn.style.display = changePasswordForced ? "none" : "";
    if (helperText) {
      helperText.textContent = changePasswordForced
        ? "Your first login used the default password. Please change it before continuing."
        : "";
      helperText.classList.toggle("hidden", !changePasswordForced);
    }
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => modal.classList.add("open")),
    );
    setTimeout(() => oldPasswordInput?.focus(), 150);
  }

  function hideChangePasswordModal() {
    if (!modal) return;
    if (changePasswordForced) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!modal.classList.contains("open")) {
        modal.classList.add("hidden");
      }
    }, 200);
    if (changePasswordForm) changePasswordForm.reset();
  }

  async function openChangePasswordModal(options = {}) {
    if (!modal || !modal.classList.contains("hidden")) return;
    if (IS_DEV_APP_BUILD && localStorage.getItem("userCanChangePassword") === "false") {
      showToast("Change password is disabled for QC users.", "error");
      return;
    }
    await openOverlayModal(() => {
      showChangePasswordModal(options);
    });
  }

  function closeChangePasswordModal() {
    if (!modal || modal.classList.contains("hidden")) return;
    if (changePasswordForced) return;
    closeOverlayModal(() => {
      hideChangePasswordModal();
    });
  }

  if (modalCloseBtn)
    modalCloseBtn.addEventListener("click", closeChangePasswordModal);
  if (modalCancelBtn)
    modalCancelBtn.addEventListener("click", closeChangePasswordModal);

  // Close modal on escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      modal &&
      !modal.classList.contains("hidden") &&
      !changePasswordForced
    ) {
      closeChangePasswordModal();
    }
  });

  // Close modal on overlay click (outside the dialog)
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal && !changePasswordForced) {
        closeChangePasswordModal();
      }
    });
  }

  // Form submission
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const oldPassword = oldPasswordInput.value;
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const authToken = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        showToast("New passwords do not match. Please try again.", "error");
        confirmPasswordInput.focus();
        return;
      }

      // Validate password length
      if (newPassword.length < 6) {
        showToast("New password must be at least 6 characters long.", "error");
        newPasswordInput.focus();
        return;
      }

      console.log("Submitting password change request");
      try {
        const res = await fetch(`${APP_SERVICE_BASE_URL}/auth/reset-password`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ username, newPassword, authToken }),
        });
        if (!res.ok) {
          throw new Error(`Password change failed with ${res.status}`);
        }
        showToast("Password changed successfully!", "success");
        markPasswordChangeCompleted();
        
        // Update persisted password with the new password
        try {
          const currentUsername = localStorage.getItem("username");
          const currentFirstName = localStorage.getItem(STORAGE_KEYS.persistedFirstName);
          if (currentUsername && window.api && typeof window.api.savePersistedCredentials === "function") {
            const expiry = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000; // 100 years
            window.api.savePersistedCredentials({
              username: currentUsername,
              password: newPassword,
              firstName: currentFirstName || "",
              expiry,
            });
          }
        } catch (e) {
          console.warn("Could not update persisted password", e);
        }
        
        changePasswordForced = false;
      // else{
      //   showToast("Failed to change password. Please try again.", "error");
      // }

        closeChangePasswordModal();
      } catch (err) {
        console.error("Password change failed", err);
        showToast("Failed to change password. Please try again.", "error");
      }
    });
  }

  // Expose function globally for profile menu
  window.openChangePasswordModal = openChangePasswordModal;

  try {
    const pendingUsername = String(
      localStorage.getItem(STORAGE_KEYS.passwordChangePendingUser) || "",
    ).trim();
    const currentUsername = String(localStorage.getItem("username") || "").trim();
    if (
      pendingUsername &&
      currentUsername &&
      currentUsername !== "Guest" &&
      pendingUsername === currentUsername
    ) {
      setTimeout(() => {
        openChangePasswordModal({ forced: true }).catch(() => {});
      }, 250);
    }
  } catch (_err) {}
}

/**
 * Initialize profile menu
 */
export function initializeProfileMenu() {
  const profileBtn = document.querySelector(".profile-btn");
  const profileMenu = document.getElementById("profile-menu");
  const menuItems = profileMenu
    ? Array.from(profileMenu.querySelectorAll(".profile-menu-item"))
    : [];

  function closeProfileMenu() {
    if (!profileMenu) return;

    closeOverlayModal(() => {
      profileMenu.classList.remove("open");
      profileMenu.setAttribute("aria-hidden", "true");
      if (profileBtn) profileBtn.setAttribute("aria-expanded", "false");

      const onEnd = () => {
        profileMenu.classList.add("hidden");
        profileMenu.removeEventListener("transitionend", onEnd);
      };
      profileMenu.addEventListener("transitionend", onEnd);

      setTimeout(() => {
        if (!profileMenu.classList.contains("open"))
          profileMenu.classList.add("hidden");
      }, 350);
    });
  }

  // Change this function to use the helper:
  async function openProfileMenu(focusFirst = false) {
    if (!profileMenu) return;

    await openOverlayModal(() => {
      profileMenu.classList.remove("hidden");
      profileMenu.setAttribute("aria-hidden", "false");
      if (profileBtn) profileBtn.setAttribute("aria-expanded", "true");

      requestAnimationFrame(() =>
        requestAnimationFrame(() => profileMenu.classList.add("open")),
      );

      if (focusFirst) {
        const onEnd = () => {
          menuItems[0] && menuItems[0].focus();
          profileMenu.removeEventListener("transitionend", onEnd);
        };
        profileMenu.addEventListener("transitionend", onEnd);
      }
    });
  }

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isKeyboardActivation = e && e.detail === 0;
      if (profileMenu.classList.contains("hidden"))
        openProfileMenu(isKeyboardActivation);
      else closeProfileMenu();
    });

    document.addEventListener("click", (e) => {
      if (
        !profileMenu.classList.contains("hidden") &&
        !profileMenu.contains(e.target) &&
        e.target !== profileBtn &&
        !profileBtn.contains(e.target)
      ) {
        closeProfileMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (profileMenu.classList.contains("hidden")) return;
      const idx = menuItems.indexOf(document.activeElement);
      if (e.key === "Escape") {
        closeProfileMenu();
        profileBtn.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (idx + 1) % menuItems.length;
        menuItems[next].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (idx - 1 + menuItems.length) % menuItems.length;
        menuItems[prev].focus();
      }
    });

    // Profile actions
    const changeIconBtn = document.getElementById("change-icon");
    const changeBtn = document.getElementById("change-password");
    const checkUpdatesBtn = document.getElementById("check-app-updates");
    const logoutBtn = document.getElementById("logout");
    const fileInput = document.getElementById("profile-file-input");
    const profilePic = document.querySelector(".profile-pic");

    // Load saved profile pic
    try {
      const saved = localStorage.getItem("userProfilePic");
      if (saved && profilePic) profilePic.src = saved;
    } catch (e) {
      console.warn("Could not load saved profile pic", e);
    }

    if (changeIconBtn) {
      changeIconBtn.addEventListener("click", () => {
        closeProfileMenu();
        if (fileInput) fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", () => {
        const f = (fileInput.files && fileInput.files[0]) || null;
        if (!f) return;
        if (!f.type || !f.type.startsWith("image/")) {
          showToast("Please select a valid image file.", "error");
          fileInput.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            if (profilePic) profilePic.src = ev.target.result;
            localStorage.setItem("userProfilePic", ev.target.result);
          } catch (err) {
            console.warn("Could not save profile pic", err);
          }
          fileInput.value = "";
        };
        reader.readAsDataURL(f);
      });
    }

    if (changeBtn) {
      if (IS_DEV_APP_BUILD && localStorage.getItem("userCanChangePassword") === "false") {
        changeBtn.style.display = "none";
      }
      changeBtn.addEventListener("click", () => {
        closeProfileMenu();
        window.openChangePasswordModal();
      });
    }

    // Environment Switch (Dev/QC Users)
    const switchEnvBtn = document.getElementById("switch-env-btn");
    const switchEnvLabel = document.getElementById("switch-env-label");
    const envSwitchModalOverlay = document.getElementById("env-switch-modal-overlay");
    const envSwitchModalCloseBtn = document.getElementById("env-switch-modal-close-btn");
    const envSwitchModalCancelBtn = document.getElementById("env-switch-modal-cancel-btn");
    const envSwitchModalConfirmBtn = document.getElementById("env-switch-modal-confirm-btn");
    const envSwitchModalMessage = document.getElementById("env-switch-modal-message");

    const userRole = String(localStorage.getItem("userRole") || "production").toLowerCase();
    const currentMode = String(localStorage.getItem("oneview_env_mode") || "prod").toLowerCase();

    if (userRole === "dev" || userRole === "qc") {
      if (switchEnvBtn) {
        switchEnvBtn.classList.remove("hidden");
        if (switchEnvLabel) {
          switchEnvLabel.textContent = currentMode === "dev" ? "Switch to Production" : "Switch to Dev";
        }
      }
    }

    async function openEnvSwitchModal() {
      if (userRole !== "dev" && userRole !== "qc") return;
      const targetEnv = currentMode === "dev" ? "Production" : "Development";
      const targetPort = currentMode === "dev" ? "8009" : "8001";
      const overlayEl = document.getElementById("env-switch-modal-overlay") || envSwitchModalOverlay;
      const titleEl = document.getElementById("env-switch-modal-title");
      const msgEl = document.getElementById("env-switch-modal-message") || envSwitchModalMessage;
      const confirmBtnEl = document.getElementById("env-switch-modal-confirm-btn");

      if (!overlayEl) return;
      if (titleEl) {
        titleEl.textContent = `Switch to ${targetEnv}`;
      }
      if (msgEl) {
        msgEl.textContent = `Are you sure you want to switch to ${targetEnv} mode? (Backend port will switch to ${targetPort})`;
      }
      if (confirmBtnEl) {
        confirmBtnEl.textContent = "Confirm Switch";
      }

      if (overlayEl.classList.contains("hidden")) {
        await openOverlayModal(() => {
          overlayEl.classList.remove("hidden");
          overlayEl.setAttribute("aria-hidden", "false");
          requestAnimationFrame(() =>
            requestAnimationFrame(() => overlayEl.classList.add("open")),
          );
        });
      }
    }

    function closeEnvSwitchModal() {
      const overlayEl = document.getElementById("env-switch-modal-overlay") || envSwitchModalOverlay;
      if (!overlayEl || overlayEl.classList.contains("hidden")) return;
      closeOverlayModal(() => {
        overlayEl.classList.remove("open");
        overlayEl.setAttribute("aria-hidden", "true");
        setTimeout(() => {
          if (!overlayEl.classList.contains("open")) overlayEl.classList.add("hidden");
        }, 200);
      });
    }

    async function confirmEnvSwitch() {
      const nextMode = currentMode === "dev" ? "prod" : "dev";
      const targetUrl = nextMode === "dev" ? "http://10.215.56.196:8001" : "http://10.215.56.196:8009";
      const targetEnvName = nextMode === "dev" ? "Development (port 8001)" : "Production (port 8009)";

      const confirmBtnEl = document.getElementById("env-switch-modal-confirm-btn");
      if (confirmBtnEl) {
        confirmBtnEl.disabled = true;
        confirmBtnEl.textContent = "Checking server...";
      }

      let isServerReachable = false;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const response = await fetch(`${targetUrl}/health`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        }).catch(() => null);
        clearTimeout(timeoutId);

        if (response && (response.ok || response.status === 200 || response.status === 404)) {
          isServerReachable = true;
        } else {
          // Alternative fallback ping without endpoint
          const pingController = new AbortController();
          const pingTimeoutId = setTimeout(() => pingController.abort(), 3000);
          const pingRes = await fetch(targetUrl, {
            method: "HEAD",
            mode: "no-cors",
            signal: pingController.signal,
          }).catch(() => null);
          clearTimeout(pingTimeoutId);
          if (pingRes) {
            isServerReachable = true;
          }
        }
      } catch (_e) {
        isServerReachable = false;
      }

      if (!isServerReachable) {
        if (confirmBtnEl) {
          confirmBtnEl.disabled = false;
          confirmBtnEl.textContent = "Confirm Switch";
        }
        showToast(`Cannot switch environment! The target server ${targetEnvName} is currently not responding.`, "error");
        const msgEl = document.getElementById("env-switch-modal-message") || envSwitchModalMessage;
        if (msgEl) {
          msgEl.innerHTML = `<span style="color: #ef4444; font-weight: 600;">Server Unreachable!</span><br>The ${targetEnvName} server is not responding. Environment switch cancelled.`;
        }
        return;
      }

      localStorage.setItem("oneview_env_mode", nextMode);
      closeEnvSwitchModal();
      showToast(`Server responsive! Switching to ${nextMode === "dev" ? "Dev" : "Production"} mode... Reloading...`, "success");
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }

    if (switchEnvBtn) {
      switchEnvBtn.addEventListener("click", () => {
        closeProfileMenu();
        openEnvSwitchModal();
      });
    }

    if (envSwitchModalCloseBtn) envSwitchModalCloseBtn.addEventListener("click", closeEnvSwitchModal);
    if (envSwitchModalCancelBtn) envSwitchModalCancelBtn.addEventListener("click", closeEnvSwitchModal);
    if (envSwitchModalConfirmBtn) envSwitchModalConfirmBtn.addEventListener("click", confirmEnvSwitch);

    // Dev User Simulation (Switch User / Switch to Main User)
    const switchUserBtn = document.getElementById("switch-user-btn");
    const switchMainUserBtn = document.getElementById("switch-main-user-btn");
    const switchUserModalOverlay = document.getElementById("switch-user-modal-overlay");
    const switchUserModalCloseBtn = document.getElementById("switch-user-modal-close-btn");
    const switchUserModalCancelBtn = document.getElementById("switch-user-modal-cancel-btn");
    const switchUserForm = document.getElementById("switch-user-form");
    const switchUserIdInput = document.getElementById("switch-user-id-input");

    const mainUserRaw = localStorage.getItem("oneview_main_user_session");
    const isSwitchedUser = Boolean(mainUserRaw);

    // Show options ONLY for Dev users when in Dev mode
    if (userRole === "dev" && currentMode === "dev") {
      if (switchUserBtn) switchUserBtn.classList.remove("hidden");
      if (isSwitchedUser && switchMainUserBtn) {
        switchMainUserBtn.classList.remove("hidden");
      }
    }

    async function openSwitchUserModal() {
      if (userRole !== "dev" || currentMode !== "dev") return;
      if (!switchUserModalOverlay) return;
      if (switchUserIdInput) switchUserIdInput.value = "";
      if (switchUserModalOverlay.classList.contains("hidden")) {
        await openOverlayModal(() => {
          switchUserModalOverlay.classList.remove("hidden");
          switchUserModalOverlay.setAttribute("aria-hidden", "false");
          requestAnimationFrame(() =>
            requestAnimationFrame(() => switchUserModalOverlay.classList.add("open")),
          );
        });
      }
    }

    function closeSwitchUserModal() {
      if (!switchUserModalOverlay || switchUserModalOverlay.classList.contains("hidden")) return;
      closeOverlayModal(() => {
        switchUserModalOverlay.classList.remove("open");
        switchUserModalOverlay.setAttribute("aria-hidden", "true");
        setTimeout(() => {
          if (!switchUserModalOverlay.classList.contains("open")) switchUserModalOverlay.classList.add("hidden");
        }, 200);
      });
    }

    if (switchUserBtn) {
      switchUserBtn.addEventListener("click", () => {
        closeProfileMenu();
        openSwitchUserModal();
      });
    }

    if (switchUserModalCloseBtn) switchUserModalCloseBtn.addEventListener("click", closeSwitchUserModal);
    if (switchUserModalCancelBtn) switchUserModalCancelBtn.addEventListener("click", closeSwitchUserModal);

    if (switchUserForm) {
      switchUserForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const targetUserId = (switchUserIdInput?.value || "").trim();
        if (!targetUserId) return;

        // Save original main user session if not already stored
        if (!localStorage.getItem("oneview_main_user_session")) {
          const currentAuthData = {
            authToken: localStorage.getItem("authToken"),
            userEmail: localStorage.getItem("userEmail"),
            userName: localStorage.getItem("userName"),
            username: localStorage.getItem("username"),
            emp_id: localStorage.getItem("emp_id"),
            userRole: localStorage.getItem("userRole"),
            appCatalog: localStorage.getItem("appCatalog"),
          };
          localStorage.setItem("oneview_main_user_session", JSON.stringify(currentAuthData));
        }

        // Simulate target user session info across all analytics and identity keys
        const cleanName = targetUserId.split("@")[0] || targetUserId;
        localStorage.setItem("userEmail", targetUserId);
        localStorage.setItem("userName", cleanName);
        localStorage.setItem("username", targetUserId);
        localStorage.setItem("emp_id", targetUserId);

        try {
          sessionStorage.setItem("username", targetUserId);
          sessionStorage.setItem("emp_id", targetUserId);
        } catch (_e) {}

        closeSwitchUserModal();
        showToast(`Switched session to user ${targetUserId}. Reloading...`, "success");
        setTimeout(() => {
          window.location.reload();
        }, 600);
      });
    }

    if (switchMainUserBtn) {
      switchMainUserBtn.addEventListener("click", () => {
        closeProfileMenu();
        const mainSessionStr = localStorage.getItem("oneview_main_user_session");
        if (mainSessionStr) {
          try {
            const mainSession = JSON.parse(mainSessionStr);
            if (mainSession.authToken) localStorage.setItem("authToken", mainSession.authToken);
            if (mainSession.userEmail) localStorage.setItem("userEmail", mainSession.userEmail);
            if (mainSession.userName) localStorage.setItem("userName", mainSession.userName);
            if (mainSession.username) localStorage.setItem("username", mainSession.username);
            if (mainSession.emp_id) localStorage.setItem("emp_id", mainSession.emp_id);
            if (mainSession.userRole) localStorage.setItem("userRole", mainSession.userRole);
            if (mainSession.appCatalog) localStorage.setItem("appCatalog", mainSession.appCatalog);
          } catch (_e) {}
          localStorage.removeItem("oneview_main_user_session");
        }
        showToast("Switched back to main user session. Reloading...", "success");
        setTimeout(() => {
          window.location.reload();
        }, 600);
      });
    }

    // Global Alt + D shortcut
    document.addEventListener("keydown", (e) => {
      if (e.altKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        openEnvSwitchModal();
      }
    });

    const shortcutsBtn = document.getElementById("shortcuts-guide-btn");
    const shortcutsModal = document.getElementById("shortcuts-guide-modal");
    const shortcutsCloseBtn = document.getElementById("shortcuts-guide-close-btn");
    const shortcutsOkBtn = document.getElementById("shortcuts-guide-ok-btn");

    if (shortcutsBtn) {
      console.log("[OneView] shortcutsBtn found, binding click event");
      shortcutsBtn.addEventListener("click", () => {
        console.log("[OneView] Shortcuts button clicked");
        closeProfileMenu();
        
        const modal = document.getElementById("shortcuts-guide-modal");
        console.log("[OneView] Shortcuts modal element in DOM:", modal);
        
        if (modal) {
          openOverlayModal(() => {
            modal.classList.remove("hidden");
            modal.setAttribute("aria-hidden", "false");
            requestAnimationFrame(() =>
              requestAnimationFrame(() => modal.classList.add("open")),
            );
            console.log("[OneView] Shortcuts modal classList now:", modal.classList);
          });
        }
      });
    } else {
      console.warn("[OneView] shortcutsBtn element not found in DOM");
    }

    const closeShortcutsModal = () => {
      const modal = document.getElementById("shortcuts-guide-modal");
      if (modal && !modal.classList.contains("hidden")) {
        closeOverlayModal(() => {
          modal.classList.remove("open");
          modal.setAttribute("aria-hidden", "true");
          
          const onEnd = () => {
            modal.classList.add("hidden");
            modal.removeEventListener("transitionend", onEnd);
          };
          modal.addEventListener("transitionend", onEnd);
          
          setTimeout(() => {
            if (!modal.classList.contains("open")) {
              modal.classList.add("hidden");
            }
          }, 350);
        });
      }
    };

    document.getElementById("shortcuts-guide-close-btn")?.addEventListener("click", closeShortcutsModal);
    document.getElementById("shortcuts-guide-ok-btn")?.addEventListener("click", closeShortcutsModal);
    document.getElementById("shortcuts-guide-modal")?.addEventListener("click", (event) => {
      const modal = document.getElementById("shortcuts-guide-modal");
      if (event.target === modal) {
        closeShortcutsModal();
      }
    });

    // Tab Toggling logic
    const tabGlobalBtn = document.getElementById("tab-global-btn");
    const tabBrowserBtn = document.getElementById("tab-browser-btn");
    const tabGlobalContent = document.getElementById("shortcuts-tab-global");
    const tabBrowserContent = document.getElementById("shortcuts-tab-browser");

    tabGlobalBtn?.addEventListener("click", () => {
      tabGlobalBtn.style.background = "var(--primary)";
      tabGlobalBtn.style.color = "white";
      tabGlobalBtn.style.border = "none";

      if (tabBrowserBtn) {
        tabBrowserBtn.style.background = "transparent";
        tabBrowserBtn.style.color = "var(--text-muted)";
        tabBrowserBtn.style.border = "1px solid transparent";
      }

      tabGlobalContent?.classList.remove("hidden");
      if (tabGlobalContent) {
        tabGlobalContent.style.display = "grid";
      }
      tabBrowserContent?.classList.add("hidden");
    });

    tabBrowserBtn?.addEventListener("click", () => {
      tabBrowserBtn.style.background = "var(--primary)";
      tabBrowserBtn.style.color = "white";
      tabBrowserBtn.style.border = "none";

      if (tabGlobalBtn) {
        tabGlobalBtn.style.background = "transparent";
        tabGlobalBtn.style.color = "var(--text-muted)";
        tabGlobalBtn.style.border = "1px solid transparent";
      }

      tabBrowserContent?.classList.remove("hidden");
      if (tabBrowserContent) {
        tabBrowserContent.style.display = "grid";
      }
      tabGlobalContent?.classList.add("hidden");
    });

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        closeProfileMenu();

        // Clear persisted login credentials on explicit logout
        try {
          localStorage.removeItem(STORAGE_KEYS.persistedUsername);
          localStorage.removeItem(STORAGE_KEYS.persistedPassword);
          localStorage.removeItem(STORAGE_KEYS.persistedFirstName);
          localStorage.removeItem(STORAGE_KEYS.persistedExpiry);
          if (window.api && typeof window.api.clearPersistedCredentials === "function") {
            await window.api.clearPersistedCredentials();
          }
        } catch (e) {
          console.warn("Error clearing persisted credentials", e);
        }

        // Stop connectivity monitor before logout
        try {
          stopConnectivityMonitor();
        } catch (e) {
          console.warn("Could not stop connectivity monitor", e);
        }

        // Clear sessionStorage
        try {
          sessionStorage.clear();
        } catch (e) {
          console.warn("sessionStorage clear failed", e);
        }

        // Remove known user keys from localStorage first
        const knownKeys = [
          "emp_id",
          "username",
          "authToken",
          "accesstoken",
          "resourceName",
          "userProfilePic",
        ];
        try {
          knownKeys.forEach((k) => {
            try {
              localStorage.removeItem(k);
            } catch (e) {}
          });
        } catch (e) {
          console.warn("localStorage known keys removal failed", e);
        }

        // Also remove any keys that look like auth/session tokens (but not persisted credentials)
        try {
          const toRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            const k = key.toLowerCase();
            if (
              k.includes("auth") ||
              k.includes("token") ||
              k.includes("session") ||
              k.includes("access") ||
              k.includes("emp") ||
              k.includes("resource")
            ) {
              // Don't remove persisted credential keys (already cleared above)
              if (
                key !== STORAGE_KEYS.persistedUsername &&
                key !== STORAGE_KEYS.persistedPassword &&
                key !== STORAGE_KEYS.persistedFirstName &&
                key !== STORAGE_KEYS.persistedExpiry
              ) {
                toRemove.push(key);
              }
            }
          }
          toRemove.forEach((k) => {
            try {
              localStorage.removeItem(k);
            } catch (e) {}
          });
        } catch (e) {
          console.warn("localStorage cleanup failed", e);
        }

        // Clear OneView shared tool state for the next login session
        try {
          if (
            window.api &&
            typeof window.api.clearOneviewSharedStorage === "function"
          ) {
            await window.api.clearOneviewSharedStorage();
          }
          if (
            window.api &&
            typeof window.api.clearOneviewEmbeddedTracking === "function"
          ) {
            await window.api.clearOneviewEmbeddedTracking();
          }
          clearMirroredOneviewSharedStorage();
        } catch (e) {
          console.warn("Could not clear OneView shared storage", e);
        }

        // Clear profile picture from UI
        try {
          if (profilePic) profilePic.src = "";
        } catch (e) {
          console.warn("Could not clear profile pic", e);
        }

        // Notify other parts of the app to clear in-memory UI state
        try {
          window.dispatchEvent(
            new CustomEvent("userDataLoaded", { detail: { resourceName: "" } }),
          );
        } catch (e) {
          console.warn("Could not dispatch userDataLoaded", e);
        }

        // Call optional IPC logout
        try {
          if (window.api && typeof window.api.logout === "function") {
            await window.api.logout();
          }
        } catch (e) {
          console.warn("IPC logout failed", e);
        }

        // Redirect back to login page
        try {
          window.location.href = "../login/index.html";
        } catch (e) {
          console.error("Redirect failed", e);
        }
      });
    }
  }
}

/**
 * Initialize connectivity modal
 * Returns object with functions to show/hide and update the modal
 */
export function initConnectivityModal() {
  const modal = document.getElementById("connectivity-modal-overlay");
  const timerElement = document.getElementById("connectivity-countdown-timer");

  console.log("[Connectivity Modal] Initializing...");
  console.log(
    `[Connectivity Modal] Modal element found: ${modal ? "YES" : "NO"}`
  );
  console.log(
    `[Connectivity Modal] Timer element found: ${timerElement ? "YES" : "NO"}`
  );

  if (!modal) {
    console.error(
      "[Connectivity Modal] Modal element not found in DOM. Ensure modal HTML is in dashboard.html"
    );
    return {
      showModal: () => console.error("Modal not initialized"),
      hideModal: () => console.error("Modal not initialized"),
      updateCountdown: () => console.error("Modal not initialized"),
    };
  }

  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }

  let countdownInterval = null;

  /**
   * Format seconds to MM:SS format
   */
  function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  /**
   * Show the connectivity modal (non-closeable)
   */
  function showModal() {
    if (!modal) {
      console.error("[Connectivity Modal] Modal element not found");
      return;
    }

    console.log("[Connectivity Modal] Showing modal");
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        console.log("[Connectivity Modal] Adding open class");
        modal.classList.add("open");
      });
    });

    // Prevent escaping and overlay click
    preventModalClose();
  }

  /**
   * Hide the connectivity modal and clear timers
   */
  function hideModal() {
    if (!modal) {
      console.error("[Connectivity Modal] Modal element not found");
      return;
    }

    console.log("[Connectivity Modal] Hiding modal");
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    // Wait for transition to complete before hiding
    setTimeout(() => {
      if (!modal.classList.contains("open")) {
        modal.classList.add("hidden");
      }
    }, 200);
  }

  /**
   * Update countdown timer display
   * @param {number} remainingSeconds - Remaining seconds
   */
  function updateCountdown(remainingSeconds) {
    if (timerElement) {
      const timeString = formatSeconds(remainingSeconds);
      timerElement.textContent = timeString;
      console.debug(`[Connectivity Modal] Updated countdown to ${timeString}`);
    } else {
      console.warn("[Connectivity Modal] Timer element not found");
    }
  }

  /**
   * Prevent modal from being closed by escape key or overlay click
   */
  function preventModalClose() {
    // Override escape key handling
    const handleEscape = (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Remove any existing listeners first
    document.removeEventListener("keydown", handleEscape);

    // Add new listener
    document.addEventListener("keydown", handleEscape);

    // Prevent overlay click from closing modal
    const handleOverlayClick = (e) => {
      if (e.target === modal) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    modal.removeEventListener("click", handleOverlayClick);
    modal.addEventListener("click", handleOverlayClick);
  }

  return {
    showModal,
    hideModal,
    updateCountdown,
  };
}

