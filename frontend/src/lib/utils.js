/**
 * Utility functions for the dashboard B-)
 */

/**
 * Escape HTML special characters for safe DOM insertion
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Get metadata for ticket types (icon and CSS class)
 * @param {string} type - Ticket type
 * @returns {Object} Metadata with cls and icon properties
 */
export function ticketTypeToMeta(type) {
  const t = String(type || "").toLowerCase();
  switch (t) {
    case "bug":
      return { cls: "type-bug", icon: "🐞" };
    case "feature":
      return { cls: "type-feature", icon: "✨" };
    case "task":
      return { cls: "type-task", icon: "✅" };
    case "incident":
      return { cls: "type-incident", icon: "⚠️" };
    default:
      return { cls: "type-default", icon: "📜" };
  }
}
