import {
  APP_SERVICE_BASE_URL,
  RESOURCE_SERVICE_BASE_URL,
  isAppProtocolUrl,
} from "./app-env.js";
import { STORAGE_KEYS } from "./app-runtime.js";
import { queryDataApi } from "./api-query.js";

const APP_CLICK_TRACKING_STORAGE_KEY = STORAGE_KEYS.clickTracking;
const TRACKING_ENDPOINT_STORAGE_KEY = STORAGE_KEYS.clickTrackingEndpoint;
console.log(TRACKING_ENDPOINT_STORAGE_KEY,"TRACKING_ENDPOINT_STORAGE_KEY")
const USER_ROLE_STORAGE_KEY = STORAGE_KEYS.userRole;
const DEFAULT_TRACKING_ENDPOINT =
  `${APP_SERVICE_BASE_URL}/api/send-ticket-data`;

let trackingQueue = Promise.resolve();
let roleLookupInFlight = null;
const TRACKING_EVENT_MAX_TIMESTAMPS = 5;
const INTERACTION_ONLY_APP_TYPES = new Set([
  "nextjs",
  "vite",
  "react",
  "angular",
  "html",
  "neutralino",
  "vite-server",
]);

function readJsonFromStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackValue;
    const parsed = JSON.parse(raw);
    return parsed ?? fallbackValue;
  } catch (_err) {
    return fallbackValue;
  }
}

function writeJsonToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_err) {}
}

function readTextFromStorage(key) {
  try {
    return String(localStorage.getItem(key) || "").trim();
  } catch (_err) {
    return "";
  }
}

function isGuestLogin() {
  return readTextFromStorage("username").toLowerCase() === "guest";
}

function getTrackingEmpId() {
  const usernameValue = readTextFromStorage("username");
  const fallbackEmpId = readTextFromStorage("emp_id");
  const candidate =
    usernameValue && usernameValue.toLowerCase() !== "guest"
      ? usernameValue
      : fallbackEmpId;

  if (/^\d+$/.test(candidate)) {
    return Number(candidate);
  }
  return candidate || null;
}

function getTrackingResourceLookupId() {
  const usernameValue = readTextFromStorage("username");
  const fallbackEmpId = readTextFromStorage("emp_id");

  if (usernameValue && usernameValue.toLowerCase() !== "guest") {
    return usernameValue;
  }

  return fallbackEmpId || "";
}

function normalizeTrackingEventKey(clickedAppName = "") {
  const normalized = String(clickedAppName || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!normalized) return "unknown_click";
  return normalized.endsWith("_click") ? normalized : `${normalized}_click`;
}

function getTrackingEndpoint() {
  return (
    readTextFromStorage(TRACKING_ENDPOINT_STORAGE_KEY) ||
    DEFAULT_TRACKING_ENDPOINT
  );
}

function getStoredUserRole(empId) {
  const cached = readJsonFromStorage(USER_ROLE_STORAGE_KEY, null);
  if (!cached || typeof cached !== "object") {
    return "";
  }
  if (String(cached.emp_id ?? "") !== String(empId ?? "")) {
    return "";
  }
  return String(cached.role || "").trim();
}

function persistUserRole(role, empId) {
  const normalizedRole = String(role || "").trim();
  if (!normalizedRole) return "";
  try {
    localStorage.setItem(
      USER_ROLE_STORAGE_KEY,
      JSON.stringify({
        emp_id: empId,
        role: normalizedRole,
      }),
    );
  } catch (_err) {}
  return normalizedRole;
}

function extractRoleFromResource(resourceData = {}) {
  if (!resourceData || typeof resourceData !== "object") return "";
  return String(resourceData.roles || "").trim();
}

export function cacheTrackedUserRole(resourceData = {}) {
  const role = extractRoleFromResource(resourceData);
  if (!role) return "";
  return persistUserRole(role, resourceData.emp_id ?? getTrackingEmpId());
}

async function resolveTrackedUserRole(empId) {
  const storedRole = getStoredUserRole(empId);
  if (storedRole) return storedRole;

  const resourceLookupId = getTrackingResourceLookupId();
  if (!resourceLookupId) return "";

  if (roleLookupInFlight) {
    return roleLookupInFlight;
  }

  const isNumericId = /^\d+$/.test(resourceLookupId);
  const filter = isNumericId
    ? { emp_id: resourceLookupId }
    : resourceLookupId.includes("@")
      ? { resource_email_id: resourceLookupId }
      : { resource_name: resourceLookupId };

  roleLookupInFlight = queryDataApi("resources", filter, { timeoutMs: 5000 })
    .then(({ data }) => {
      const resource = data[0] || {};
      return persistUserRole(extractRoleFromResource(resource), empId);
    })
    .catch((error) => {
      console.warn("Could not resolve user role for click tracking:", error);
      return "";
    })
    .finally(() => {
      roleLookupInFlight = null;
    });

  return roleLookupInFlight;
}

function normalizeStoredTrackingPayload(candidate, empId, role) {
  const nextPayload = {
    emp_id: empId,
    role: String(role || "").trim(),
    tracking: [],
  };

  if (!candidate || typeof candidate !== "object") {
    return nextPayload;
  }

  const sameUser = String(candidate.emp_id ?? "") === String(empId ?? "");
  if (!sameUser) {
    return nextPayload;
  }

  nextPayload.role =
    String(role || "").trim() || String(candidate.role || "").trim();

  if (!Array.isArray(candidate.tracking)) {
    return nextPayload;
  }

  nextPayload.tracking = candidate.tracking
    .map((item) => {
      const ticketId = String(item?.ticket_id || "").trim();
      if (!ticketId) return null;

      const events = {};
      if (item?.events && typeof item.events === "object") {
        Object.entries(item.events).forEach(([key, timestamps]) => {
          const eventKey = normalizeTrackingEventKey(key);
          const values = Array.isArray(timestamps)
            ? timestamps
                .map((value) => String(value || "").trim())
                .filter(Boolean)
                .slice(-TRACKING_EVENT_MAX_TIMESTAMPS)
            : [];
          if (eventKey && values.length > 0) {
            events[eventKey] = values;
          }
        });
      }

      const normalizedItem = {
        ticket_id: ticketId,
        events,
      };

      if (item?.guest_login === true) {
        normalizedItem.guest_login = true;
      }

      return normalizedItem;
    })
    .filter(Boolean);

  return nextPayload;
}

function buildUpdatedTrackingPayload({
  currentSelectedTicketId,
  clickedAppName,
  empId,
  role,
  occurredAt,
}) {
  const storedPayload = readJsonFromStorage(APP_CLICK_TRACKING_STORAGE_KEY, {});
  const payload = normalizeStoredTrackingPayload(storedPayload, empId, role);
  const ticketId =
    String(currentSelectedTicketId || window.currentActiveTicketKey || "").trim() ||
    "no_ticket_selected";
  const eventKey = normalizeTrackingEventKey(clickedAppName);
  const clickedAt = String(occurredAt || "").trim() || new Date().toISOString();
  const guestLogin = isGuestLogin();

  let ticketEntry = payload.tracking.find(
    (item) => String(item.ticket_id || "") === ticketId,
  );
  if (!ticketEntry) {
    ticketEntry = {
      ticket_id: ticketId,
      events: {},
    };
    if (guestLogin) {
      ticketEntry.guest_login = true;
    }
    payload.tracking.push(ticketEntry);
  }

  if (!ticketEntry.events || typeof ticketEntry.events !== "object") {
    ticketEntry.events = {};
  }
  if (!Array.isArray(ticketEntry.events[eventKey])) {
    ticketEntry.events[eventKey] = [];
  }
  ticketEntry.events[eventKey].push(clickedAt);
  if (ticketEntry.events[eventKey].length > TRACKING_EVENT_MAX_TIMESTAMPS) {
    ticketEntry.events[eventKey].splice(
      0,
      ticketEntry.events[eventKey].length - TRACKING_EVENT_MAX_TIMESTAMPS,
    );
  }

  if (guestLogin) {
    ticketEntry.guest_login = true;
  }

  return payload;
}

function buildLatestTrackingPayload({
  empId,
  role,
  ticketId,
  eventKey,
  clickedAt,
  guestLogin,
}) {
  const latestEntry = {
    ticket_id: ticketId,
    events: {
      [eventKey]: [clickedAt],
    },
  };

  if (guestLogin) {
    latestEntry.guest_login = true;
  }

  return {
    emp_id: empId,
    role: String(role || "").trim(),
    tracking: [latestEntry]
  };
}

async function postTrackingPayload(payload) {
  const endpoint = getTrackingEndpoint();
  if (!endpoint) return;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });

  if (!response.ok) {
    throw new Error(`Tracking API returned ${response.status}`);
  }
}

async function trackInstalledAppClickInternal({
  currentSelectedTicketId,
  clickedAppName,
}) {
  const empId = getTrackingEmpId();
  if (empId === null || empId === undefined || empId === "") {
    console.warn("Skipping app click tracking: employee id is unavailable.");
    return null;
  }

  const role = await resolveTrackedUserRole(empId);
  const payload = buildUpdatedTrackingPayload({
    currentSelectedTicketId,
    clickedAppName,
    empId,
    role,
  });

  writeJsonToStorage(APP_CLICK_TRACKING_STORAGE_KEY, payload);

  const ticketId =
    String(currentSelectedTicketId || window.currentActiveTicketKey || "").trim() ||
    "no_ticket_selected";
  const eventKey = normalizeTrackingEventKey(clickedAppName);
  const latestEvents = payload.tracking.find(
    (item) => String(item.ticket_id || "") === ticketId,
  )?.events?.[eventKey];
  const clickedAt =
    Array.isArray(latestEvents) && latestEvents.length > 0
      ? String(latestEvents[latestEvents.length - 1] || "")
      : "";
  const latestPayload = buildLatestTrackingPayload({
    empId,
    role,
    ticketId,
    eventKey,
    clickedAt,
    guestLogin: isGuestLogin(),
  });

  try {
    await postTrackingPayload(latestPayload);
  } catch (error) {
    console.warn("Failed to post app click tracking payload:", error);
  }

  return latestPayload;
}

async function trackNamedClickEventInternal({
  currentSelectedTicketId,
  eventName,
  occurredAt,
}) {
  const normalizedEventName = String(eventName || "").trim();
  if (!normalizedEventName) {
    return null;
  }

  const empId = getTrackingEmpId();
  if (empId === null || empId === undefined || empId === "") {
    console.warn("Skipping named click tracking: employee id is unavailable.");
    return null;
  }

  const role = await resolveTrackedUserRole(empId);
  const payload = buildUpdatedTrackingPayload({
    currentSelectedTicketId,
    clickedAppName: normalizedEventName,
    empId,
    role,
    occurredAt,
  });

  writeJsonToStorage(APP_CLICK_TRACKING_STORAGE_KEY, payload);

  const ticketId =
    String(currentSelectedTicketId || window.currentActiveTicketKey || "").trim() ||
    "no_ticket_selected";
  const eventKey = normalizeTrackingEventKey(normalizedEventName);
  const latestEvents = payload.tracking.find(
    (item) => String(item.ticket_id || "") === ticketId,
  )?.events?.[eventKey];
  const clickedAt =
    Array.isArray(latestEvents) && latestEvents.length > 0
      ? String(latestEvents[latestEvents.length - 1] || "")
      : "";
  const latestPayload = buildLatestTrackingPayload({
    empId,
    role,
    ticketId,
    eventKey,
    clickedAt,
    guestLogin: isGuestLogin(),
  });

  try {
    console.log("[OneView Tracking] Posting named click tracking payload", {
      endpoint: getTrackingEndpoint(),
      payload: latestPayload,
    });
    await postTrackingPayload(latestPayload);
    console.log("[OneView Tracking] Named click tracking payload posted", {
      endpoint: getTrackingEndpoint(),
      payload: latestPayload,
    });
  } catch (error) {
    console.warn("Failed to post named click tracking payload:", {
      endpoint: getTrackingEndpoint(),
      payload: latestPayload,
      error,
    });
  }

  return latestPayload;
}

export function trackInstalledAppClick({
  currentSelectedTicketId,
  clickedAppName,
} = {}) {
  trackingQueue = trackingQueue
    .catch(() => null)
    .then(() =>
      trackInstalledAppClickInternal({
        currentSelectedTicketId,
        clickedAppName,
      }),
    );

  return trackingQueue;
}

export function shouldTrackAppLaunchClick(app = {}) {
  if (app?.trackOnLaunch === true) {
    return true;
  }

  if (app?.trackOnLaunch === false) {
    return false;
  }

  const mode = String(app?.clickTrackingMode || "")
    .trim()
    .toLowerCase();

  if (mode === "launch" || mode === "entry") {
    return true;
  }

  const appType = String(app?.type || "")
    .trim()
    .toLowerCase();
  const oneviewUrl = String(app?.oneviewUrl || "").trim();
  const localPath = String(app?.localPath || "").trim();

  if (INTERACTION_ONLY_APP_TYPES.has(appType)) {
    return false;
  }

  if (
    appType === "website" &&
    (Boolean(localPath) || isAppProtocolUrl(oneviewUrl))
  ) {
    return false;
  }

  return mode !== "interaction" && mode !== "manual";
}

export function trackNamedClickEvent({
  currentSelectedTicketId,
  eventName,
  occurredAt,
} = {}) {
  trackingQueue = trackingQueue
    .catch(() => null)
    .then(() =>
      trackNamedClickEventInternal({
        currentSelectedTicketId,
        eventName,
        occurredAt,
      }),
    );

  return trackingQueue;
}

export function getStoredAppClickTrackingPayload() {
  return readJsonFromStorage(APP_CLICK_TRACKING_STORAGE_KEY, {
    emp_id: getTrackingEmpId(),
    role: getStoredUserRole(getTrackingEmpId()),
    tracking: [],
  });
}
