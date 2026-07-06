import { escapeHtml, ticketTypeToMeta } from "./utils.js";
import { PARTITIONS } from "./app-runtime.js";

import jiraIcon from "../assets/jira-icon.png";

import bugIcon from "../assets/task-icons/bug.png";
import edaIcon from "../assets/task-icons/eda.png";
import emailIcon from "../assets/task-icons/email.png";
import ocIcon from "../assets/task-icons/oc.png";
import printIcon from "../assets/task-icons/print.png";
import videoIcon from "../assets/task-icons/video.png";
import webIcon from "../assets/task-icons/web.png";
import timeIcon from "../assets/task-icons/track.png";
import defaultIcon from "../assets/task-icons/default.png";

import veevaIcon from "../assets/veeva-icon.png";

import veevaBinderIcon from "../assets/veeva-binder-icon.png";
/**
 * Ticket data and rendering functionality
 */

const hostname = "http://10.215.56.196:5000";

function resolveTicketLinkPartition(url = "", title = "") {
  const lowerUrl = String(url || "").toLowerCase();
  const lowerTitle = String(title || "").toLowerCase();

  if (lowerTitle.includes("jira") || lowerUrl.includes("jira.")) {
    return PARTITIONS.vml;
  }

  if (
    lowerTitle.includes("veeva") ||
    lowerTitle.includes("binder") ||
    lowerUrl.includes("veeva") ||
    lowerUrl.includes("vault") ||
    lowerUrl.includes("binder")
  ) {
    return PARTITIONS.gsk;
  }

  return null;
}

function dispatchTicketLinkInView(url, title) {
  window.dispatchEvent(
    new CustomEvent("openTicketLinkInView", {
      detail: {
        url,
        title,
        partition: resolveTicketLinkPartition(url, title),
      },
    }),
  );
}

/**
 * Get the current logged-in username from localStorage
 * @returns {string|null} The username or null if not logged in
 */
export function getLoggedInUsername() {
  try {
    return localStorage.getItem("username");
  } catch (e) {
    console.warn("Could not retrieve username from localStorage", e);
    return null;
  }
}

/**
 * Get employee id for resource API lookup.
 * Prefer explicit emp_id (set during login/guest flow), then fallback to username.
 * @returns {string|null}
 */
export function getResourceLookupId() {
  try {
    const empId = String(localStorage.getItem("emp_id") || "").trim();
    console.log("Retrieved emp_id from localStorage:", empId);
    if (empId) return empId;
    const username = String(localStorage.getItem("username") || "").trim();
    return username || null;
  } catch (e) {
    console.warn("Could not retrieve resource lookup id from localStorage", e);
    return null;
  }
}

// const sampleTickets = [
//   {
//     id: 12345,
//     title: "WUNNEDGSK-11078",
//     client: "Trelegy",
//     status: "In Progress",
//     priority: "High",
//     type: "bug",
//     summary: "Improvement Task",
//     dueDate: "2026-02-15",
//     signOffDate: "2026-02-10",
//     jiraLink: "https://www.youtube.com",
//     veevaLink: "https://veeva.example.com/nucala/doc-11078",
//     binderLink: "https://binder.example.com/nucala/binder-11078",
//   },
//   {
//     id: 67890,
//     title: "WUNNEDGSK-13408",
//     client: "Augmentin",
//     status: "Pending Review",
//     priority: "Medium",
//     type: "incident",
//     summary: "Localisation",
//     dueDate: "2026-02-20",
//     signOffDate: "2026-02-18",
//     jiraLink: "https://jira.example.com/browse/WUNNEDGSK-13408",
//     veevaLink: "https://veeva.example.com/augmentin/doc-13408",
//     binderLink: "https://binder.example.com/augmentin/binder-13408",
//   },
//   {
//     id: 54321,
//     title: "WUNNEDGSK-50531",
//     client: "Nucala",
//     status: "Completed",
//     priority: "Low",
//     type: "bug",
//     summary: "Improvement Task",
//     dueDate: "2026-01-30",
//     signOffDate: "2026-01-28",
//     jiraLink: "https://jira.uhub.biz/browse/WUNNEDGSK-50531",
//     veevaLink: "https://gsk-contentlab.veevavault.com/ui/#doc_info/4580194/0/3",
//     binderLink: "https://binder.example.com/trelegy/binder-20439",
//   },
//   {
//     id: 98765,
//     title: "WUNNEDGSK-48540",
//     client: "Shingrix",
//     status: "Open",
//     priority: "High",
//     type: "task",
//     summary: "Bug Fix",
//     dueDate: "2026-02-05",
//     signOffDate: "2026-02-01",
//     jiraLink: "https://jira.example.com/browse/WUNNEDGSK-48540",
//     veevaLink: "https://veeva.example.com/shingrix/doc-48540",
//     binderLink: "https://binder.example.com/shingrix/binder-48540",
//   },
//   {
//     id: 55555,
//     title: "WUNNEDGSK-49358",
//     client: "Arexvy",
//     status: "Planned",
//     priority: "Low",
//     type: "feature",
//     summary: "Generate assets",
//     dueDate: "2026-03-10",
//     signOffDate: "2026-03-05",
//     jiraLink: "https://jira.example.com/browse/WUNNEDGSK-49358",
//     veevaLink: "https://veeva.example.com/arexvy/doc-49358",
//     binderLink: "https://binder.example.com/arexvy/binder-49358",
//   },
// ];

/**
 * Create a sidebar ticket element with accordion functionality
 * @param {Object} ticket - Ticket object
 * @returns {HTMLElement} Ticket element
 */
export function createSidebarTicketElement(ticket) {
  const li = document.createElement("li");
  li.className = "sidebar-ticket-item";
  li.tabIndex = 0;

  const ISSUE_TYPE_ICONS = {
    web: webIcon,
    print: printIcon,
    video: videoIcon,
    email: emailIcon,
    eda: edaIcon,
    omnichannel: ocIcon,
    bug: bugIcon,
    time: timeIcon,
    improvement: defaultIcon,
    default: defaultIcon,
  };

  const issueType = ticket.channel || "task";

  const normalizeIssueType = (type = "") =>
    type.toLowerCase().replace(/\s+/g, "");

  const getIssueIcon = (issueType) => {
    const normalized = normalizeIssueType(issueType);

    if (normalized.includes("bug")) return ISSUE_TYPE_ICONS.bug;
    if (normalized.includes("improvement")) return ISSUE_TYPE_ICONS.improvement;
    if (normalized.includes("time")) return ISSUE_TYPE_ICONS.time;

    return ISSUE_TYPE_ICONS[normalized] || ISSUE_TYPE_ICONS.default;
  };

  const issueIcon = getIssueIcon(issueType);

  const getValue = (val) => {
    if (!val) return "N/A";
    if (typeof val === "object" && val.value) return val.value;
    return val;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return dateStr;
  };

  let linksHtml = "";
  if (ticket.key) {
    const jiraUrl =
      ticket.jiraLink || `https://jira.uhub.biz/browse/${ticket.key}`;

    linksHtml += `<a href="${jiraUrl}" class="detail-link icon-link jira-link" title="Open in Jira">
      <img src="${jiraIcon}" alt="Jira" class="link-icon">
    </a>`;

    if (ticket.veevaLink) {
      linksHtml += `<a href="${ticket.veevaLink}" class="detail-link icon-link" target="_blank" title="Open in Veeva">
        <img src="${veevaIcon}" alt="Veeva" class="link-icon">
      </a>`;
    }

    if (ticket.binderLink) {
      linksHtml += `<a href="${ticket.binderLink}" class="detail-link icon-link" target="_blank" title="Open Binder">
        <img src="${veevaBinderIcon}" alt="Binder" class="link-icon">
      </a>`;
    }
  }

  if (ticket.flags && ticket.flags.risk_flag) {
    li.classList.add("at-risk");
  }

  li.innerHTML = `
    <div class="ticket-header">
        <div class="sidebar-ticket-icon" title="${escapeHtml(issueType)}" aria-hidden="true">
          <img src="${issueIcon}" alt="${escapeHtml(issueType)}" class="ticket-type-icon">
        </div>
        <div class="sidebar-ticket-content">
            <div class="sidebar-ticket-title">${escapeHtml(ticket.key || "")}</div>
            <div class="sidebar-ticket-meta"><span>${escapeHtml(ticket.current_status || "")}</span></div>
        </div>
        <div class="accordion-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </div>
    </div>
    <div class="ticket-accordion-body">
        <div class="detail-content-inner">
             <div class="detail-field full-width">
                <label class="detail-field-label">Summary</label>
                <div class="detail-field-value">${escapeHtml(ticket.summary || "N/A")}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-field">
                    <label class="detail-field-label">Flags</label>
                    <div class="detail-field-value">
                      ${(() => {
                        if (
                          !ticket.flags ||
                          Object.keys(ticket.flags).length === 0
                        ) {
                          return "None";
                        }
                        const activeFlags = Object.entries(ticket.flags)
                          .filter(
                            ([key, value]) =>
                              value === true &&
                              key !== "tech_triage_missed",
                          )
                          .map(([key]) => {
                            if (key === "risk_flag") return "At Risk";
                            return key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (ch) => ch.toUpperCase());
                          });
                        return activeFlags.length > 0
                          ? activeFlags.join(", ")
                          : "None";
                      })()}
                    </div>
                </div>
                <div class="detail-field">
                    <label class="detail-field-label">Complexity</label>
                    <div class="detail-field-value">${escapeHtml(getValue(ticket.complexity))}</div>
                </div>
            </div>

            <div class="detail-row">
                 <div class="detail-field">
                    <label class="detail-field-label">Due Date</label>
                    <div class="detail-field-value">${formatDate(ticket.due_date)}</div>
                </div>
            </div>

            ${
              linksHtml
                ? `
            <div class="detail-field full-width">
                <label class="detail-field-label">Links</label>
                <div class="detail-links">
                    ${linksHtml}
                </div>
            </div>
            `
                : ""
            }
        </div>
    </div>
  `;

  li.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;

    const nextTicketKey = ticket.key || ticket.id;
    const isSameActiveTicket =
      String(window.currentActiveTicketKey || "").trim() ===
      String(nextTicketKey || "").trim();
    const wasExpanded = li.classList.contains("expanded");
    document.querySelectorAll(".sidebar-ticket-item.expanded").forEach((el) => {
      if (el !== li) el.classList.remove("expanded");
    });
    li.classList.toggle("expanded", !wasExpanded);

    if (isSameActiveTicket) {
      document
        .querySelectorAll(".sidebar-ticket-item.active")
        .forEach((el) => {
          if (el !== li) el.classList.remove("active");
        });
      li.classList.add("active");
      return;
    }

    document
      .querySelectorAll(".sidebar-ticket-item.active")
      .forEach((el) => el.classList.remove("active"));
    li.classList.add("active");

    window.currentActiveTicketKey = nextTicketKey;
    if (window.api && typeof window.api.setOneviewSharedStorage === "function") {
      window.api.setOneviewSharedStorage("activeSelectedTicket", ticket);
    }
    window.dispatchEvent(
      new CustomEvent("ticketActivated", { detail: { ticket } }),
    );

    if (typeof window.handleTicketActivationCleanup === "function") {
      window.handleTicketActivationCleanup();
    } else if (typeof window.triggerHomeActionWithCleanup === "function") {
      window.triggerHomeActionWithCleanup({ preserveViewState: true });
    } else if (typeof window.triggerHomeAction === "function") {
      window.triggerHomeAction();
    }
  });

  if (
    window.currentActiveTicketKey &&
    ((ticket.key && ticket.key === window.currentActiveTicketKey) ||
      (ticket.id && ticket.id === window.currentActiveTicketKey))
  ) {
    li.classList.add("active");
  }

  li.querySelectorAll("a.detail-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = link.href;

      if (link.classList.contains("jira-link")) {
        dispatchTicketLinkInView(url, "Jira");
      } else {
        dispatchTicketLinkInView(
          url,
          ticket.binderLink === url ? "Veeva Binder" : "Veeva",
        );
      }
    });
  });

  return li;
}
/**
 * Display ticket details in the detail panel
 * @param {Object} ticket - Ticket object to display
 */
export function showTicketDetail(ticket) {
  const panel = document.getElementById("ticket-detail-panel");
  const detailContent = document.getElementById("detail-content");
  const sidebar = document.getElementById("sidebar");
  if (!panel || !detailContent) return;

  const issueType = ticket.issue_type || "task";
  const typeMeta = ticketTypeToMeta(issueType);

  // Helper function to format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return dateStr;
  };

  // Helper function to get nested field value
  const getFieldValue = (obj) => {
    if (!obj) return "N/A";
    return obj.value || "N/A";
  };

  // Format AHT data
  const devAht = ticket.dev_aht ? `${ticket.dev_aht.toFixed(2)} hrs` : "N/A";
  const qcAht = ticket.qc_aht ? `${ticket.qc_aht.toFixed(2)} hrs` : "N/A";
  const techAht = ticket.tech_aht ? `${ticket.tech_aht.toFixed(2)} hrs` : "N/A";
  const totalAht = ticket.total_aht
    ? `${ticket.total_aht.toFixed(2)} hrs`
    : "N/A";

  // Build flags info
  let flagsInfo = "";
  if (ticket.flags) {
    const flags = [];
    if (ticket.flags.risk_flag) flags.push("🚩 Risk Flag");
    if (ticket.flags.tech_triage_missed) flags.push("⚠️ Tech Triage Missed");
    flagsInfo = flags.length > 0 ? flags.join(", ") : "None";
  }

  detailContent.innerHTML = `
        <div class="detail-header">
            <div class="detail-title">
                <span class="detail-title-icon">${typeMeta.icon}</span>
                <h2 class="detail-title-text">${escapeHtml(ticket.key || "")}</h2>
            </div>
            <button class="detail-close-btn" id="detail-close-btn" aria-label="Close"></button>
        </div>
        <div class="detail-body">
            <div class="detail-field">
                <label class="detail-field-label">Summary</label>
                <div class="detail-field-value">${escapeHtml(ticket.summary || "N/A")}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Current Status</label>
                <div class="detail-field-value status">${escapeHtml(ticket.current_status || "N/A")}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Issue Type</label>
                <div class="detail-field-value">${escapeHtml(issueType)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Complexity</label>
                <div class="detail-field-value">${getFieldValue(ticket.complexity)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Service Type</label>
                <div class="detail-field-value">${getFieldValue(ticket.service_type)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Work Type</label>
                <div class="detail-field-value">${getFieldValue(ticket.work_type)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Change Reason</label>
                <div class="detail-field-value">${getFieldValue(ticket.change_reason)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Market</label>
                <div class="detail-field-value">${escapeHtml(ticket.market || "N/A")}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Due Date</label>
                <div class="detail-field-value">${formatDate(ticket.due_date)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Dispatch Date</label>
                <div class="detail-field-value">${formatDate(ticket.dispatch_date)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Completion Time</label>
                <div class="detail-field-value">${formatDate(ticket.completion_time)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Sign-Off Due Date</label>
                <div class="detail-field-value">${escapeHtml(ticket.sign_off_due_date || "N/A")}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Average Handle Time (AHT)</label>
                <div class="detail-field-value">
                    Dev: ${devAht} | QC: ${qcAht} | Tech: ${techAht} | Total: ${totalAht}
                </div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Flags</label>
                <div class="detail-field-value">${escapeHtml(flagsInfo)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Created</label>
                <div class="detail-field-value">${formatDate(ticket.created)}</div>
            </div>
            <div class="detail-field">
                <label class="detail-field-label">Updated</label>
                <div class="detail-field-value">${formatDate(ticket.updated)}</div>
            </div>
        </div>
    `;

  panel.classList.add("active");

  // Collapse the sidebar
  if (sidebar) sidebar.classList.add("collapsed");

  const closeBtn = document.getElementById("detail-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel.classList.remove("active");
      if (sidebar) sidebar.classList.remove("collapsed");
      document
        .querySelectorAll(".sidebar-ticket-item.active")
        .forEach((n) => n.classList.remove("active"));
    });
  }

  // Add click handlers for detail links to open in webview
  detailContent.querySelectorAll(".detail-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = link.href;
      
      // For JIRA links, dispatch a custom event to let dashboard handle it with the view page
      if (link.classList.contains("jira-link")) {
        dispatchTicketLinkInView(url, "Jira");
      } else {
        dispatchTicketLinkInView(
          url,
          ticket.binderLink === url ? "Veeva Binder" : "Veeva",
        );
      }
    });
  });
}

/**
 * Render tickets in the sidebar
 * @param {Array} tickets - Array of ticket objects
 */
export function renderTickets(tickets) {
  const sidebarTickets = document.getElementById("sidebar-tickets");
  if (!sidebarTickets) return;
  sidebarTickets.innerHTML = "";
  if (!tickets || tickets.length === 0) {
    sidebarTickets.innerHTML = '<div class="sidebar-empty">No tickets</div>';
    return;
  }

  const statusPriority = {
    "In Progress": 1,
    Open: 2,
    "To Do": 3,
    Planned: 4,
    "Pending Review": 5,
    "Awaiting Feedback": 6,
    Completed: 7,
    Closed: 8,
  };
  const getPriorityScore = (status) => statusPriority[status] || 99;

  const sortedTickets = [...tickets].sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    const isValidA = !Number.isNaN(dateA.getTime());
    const isValidB = !Number.isNaN(dateB.getTime());

    if (isValidA && isValidB && dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }
    if (isValidA && !isValidB) return -1;
    if (!isValidA && isValidB) return 1;

    const scoreA = getPriorityScore(a.current_status || a.status);
    const scoreB = getPriorityScore(b.current_status || b.status);
    if (scoreA !== scoreB) return scoreA - scoreB;

    return (a.key || a.title || "").localeCompare(b.key || b.title || "");
  });

  if (!window.currentActiveTicketKey && sortedTickets.length > 0) {
    const firstTicket = sortedTickets[0];
    window.currentActiveTicketKey = firstTicket.key || firstTicket.id;
    if (window.api && typeof window.api.setOneviewSharedStorage === "function") {
      window.api.setOneviewSharedStorage("activeSelectedTicket", firstTicket);
    }
  }

  const fragment = document.createDocumentFragment();
  sortedTickets.forEach((t) => {
    fragment.appendChild(createSidebarTicketElement(t));
  });
  sidebarTickets.replaceChildren(fragment);
}

async function mapWithConcurrency(items, mapper, concurrency = 4) {
  const source = Array.isArray(items) ? items : [];
  const results = new Array(source.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < source.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await mapper(source[currentIndex], currentIndex);
    }
  };

  const workerCount = Math.max(1, Math.min(concurrency, source.length || 1));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

/**
 * Fetch tickets from backend based on logged-in user
 */
export async function fetchTickets() {
  try {
    const resourceId = getResourceLookupId();
    if (!resourceId) {
      console.warn("No user logged in, cannot fetch tickets");
      renderTickets([]);
      return;
    }

    const response = await fetch(`${hostname}/api/resources/${resourceId}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // Store employee name
    if (data.resource_name) {
      localStorage.setItem("resourceName", data.resource_name);
      window.dispatchEvent(
        new CustomEvent("userDataLoaded", {
          detail: { resourceName: data.resource_name },
        })
      );
    }

    let tickets = data.task_assigned || [];

    // Render the basic list immediately so the sidebar stays responsive
    // while issue metadata arrives in the background.
    renderTickets(
      tickets.map((ticket) => ({
        ...ticket,
        channel: ticket.channel || null,
      })),
    );

    // Enrich channels in limited parallel batches instead of flooding the
    // renderer/network with one request per ticket all at once.
    const enrichedTickets = await mapWithConcurrency(
      tickets,
      async (ticket) => {
        try {
          const issueRes = await fetch(
            `http://10.215.56.196:5000/api/resources/all-issues/${ticket.key}`,
            {
              signal: AbortSignal.timeout(5000),
            },
          );

          if (!issueRes.ok) {
            throw new Error(`Failed for ${ticket.key}`);
          }

          const issueData = await issueRes.json();

          return {
            ...ticket,
            channel: issueData.channel || null,
          };
        } catch (err) {
          console.warn(`Error fetching issue for key ${ticket.key}`, err);
          return {
            ...ticket,
            channel: null,
          };
        }
      },
      4,
    );

    const hasVisibleChannelChanges = enrichedTickets.some((ticket, index) => {
      const previousChannel = tickets[index]?.channel || null;
      return (ticket?.channel || null) !== previousChannel;
    });

    if (hasVisibleChannelChanges) {
      requestAnimationFrame(() => {
        renderTickets(enrichedTickets);
      });
    }

  } catch (err) {
    console.warn("Could not fetch tickets from API", err);
    renderTickets([]);
  }
}
