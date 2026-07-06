/**
 * Toast notification system
 */

/**
 * Show a toast notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('error', 'success', 'info', 'warning')
 * @param {number} duration - Duration in milliseconds before auto-dismiss
 */
export function showToast(message, type = "error", duration = 4000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "status");
  container.appendChild(toast);

  const removeToast = () => {
    toast.classList.add("removing");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  };

  setTimeout(removeToast, duration);
}
