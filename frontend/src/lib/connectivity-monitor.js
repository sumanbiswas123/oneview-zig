/**
 * Connectivity Monitor
 * Monitors internet and VPN connectivity on the dashboard.
 * Shows a modal with countdown if connectivity is lost for more than 5 seconds.
 * Logs out the user if connectivity is not restored within 5 minutes.
 */

let monitorState = {
  isConnected: true,
  disconnectionStartTime: null,
  checkInterval: null,
  graceTimer: null,
  countdownInterval: null,
  maxDisconnectionTime: 300000, // 5 minutes in milliseconds
  checkIntervalMs: 5000, // 5 seconds
  corpPingUrl: "", // Will be set during initialization
  onlineListener: null,
  offlineListener: null,
};

/**
 * Helper function to probe a URL for reachability
 * @param {string} targetUrl - URL to probe
 * @param {number} timeoutMs - Timeout in milliseconds (default 4000)
 * @param {boolean} isVpn - Whether the URL is a VPN target
 * @returns {Promise<boolean>} - True if reachable, false otherwise
 */
function probeUrl(targetUrl, timeoutMs = 4000, isVpn = false) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const fetchOptions = {
    method: "GET",
    cache: "no-store",
    signal: controller.signal,
  };

  if (isVpn) {
    fetchOptions.mode = "cors";
    fetchOptions.redirect = "manual";
  } else {
    fetchOptions.mode = "no-cors";
    fetchOptions.redirect = "follow";
  }

  return fetch(targetUrl, fetchOptions)
    .then(() => {
      clearTimeout(timer);
      return true;
    })
    .catch(() => {
      clearTimeout(timer);
      return false;
    });
}

/**
 * Check current connectivity status (internet + VPN)
 * @returns {Promise<boolean>} - True if both internet and VPN are reachable
 */
async function checkConnectivity() {
  const publicProbeUrl = "https://www.gstatic.com/generate_204";
  
  // If corpPingUrl not set, assume we're not connected (fail safe)
  if (!monitorState.corpPingUrl) {
    console.warn("[Connectivity Monitor] corpPingUrl not configured");
    return false;
  }


  try {
    // Check internet connectivity
    console.debug(
      "[Connectivity Monitor] Checking internet connectivity via",
      publicProbeUrl
    );
    const internetConnected = await probeUrl(publicProbeUrl, 3500);
    console.debug(
      `[Connectivity Monitor] Internet check: ${internetConnected ? "OK" : "FAILED"}`
    );

    if (!internetConnected) {
      return false;
    }

    // Check corporate network (VPN) connectivity
    console.debug(
      "[Connectivity Monitor] Checking VPN connectivity via",
      monitorState.corpPingUrl
    );
    const vpnConnected = await probeUrl(monitorState.corpPingUrl, 4500, true);
    console.debug(
      `[Connectivity Monitor] VPN check: ${vpnConnected ? "OK" : "FAILED"}`
    );

    return vpnConnected;
  } catch (error) {
    console.error("[Connectivity Monitor] Check failed:", error);
    return false;
  }
}

/**
 * Handle disconnection detected
 * @param {Object} callbacks - Object with onModalShow callback
 */
function handleDisconnection(callbacks) {
  if (monitorState.isConnected === false) {
    // Already disconnected, don't reset timer
    console.log("[Connectivity Monitor] Already in disconnected state, skipping duplicate disconnect");
    return;
  }

  monitorState.isConnected = false;
  monitorState.disconnectionStartTime = Date.now();
  console.log("[Connectivity Monitor] Disconnection state set, grace period starting (5s)");

  // Clear any existing countdown first
  if (monitorState.countdownInterval) {
    clearInterval(monitorState.countdownInterval);
    monitorState.countdownInterval = null;
    console.log("[Connectivity Monitor] Cleared previous countdown interval");
  }

  // Clear any existing grace timer
  if (monitorState.graceTimer) {
    clearTimeout(monitorState.graceTimer);
    console.log("[Connectivity Monitor] Cleared previous grace timer");
  }

  // Wait 5 seconds grace period before showing modal
  monitorState.graceTimer = setTimeout(() => {
    // Check if still disconnected
    if (!monitorState.isConnected && callbacks.onModalShow) {
      console.log("[Connectivity Monitor] Grace period ended, showing modal and starting countdown");
      callbacks.onModalShow();
      // Start countdown immediately after showing modal
      startCountdown(callbacks);
    }
  }, 5000);
}

/**
 * Handle reconnection detected
 * @param {Object} callbacks - Object with onModalHide callback
 */
function handleReconnection(callbacks) {
  if (monitorState.isConnected === true) {
    // Already connected, nothing to do
    return;
  }

  console.log("[Connectivity Monitor] Reconnection detected!");
  monitorState.isConnected = true;
  monitorState.disconnectionStartTime = null;

  // Clear grace timer
  if (monitorState.graceTimer) {
    clearTimeout(monitorState.graceTimer);
    monitorState.graceTimer = null;
    console.log("[Connectivity Monitor] Cleared grace timer");
  }

  // Clear countdown interval
  if (monitorState.countdownInterval) {
    clearInterval(monitorState.countdownInterval);
    monitorState.countdownInterval = null;
    console.log("[Connectivity Monitor] Cleared countdown interval");
  }

  // Hide modal
  if (callbacks.onModalHide) {
    console.log("[Connectivity Monitor] Calling onModalHide callback");
    callbacks.onModalHide();
  }
}

/**
 * Start countdown timer for disconnection
 * @param {Object} callbacks - Object with onCountdownTick and onMaxTimeExceeded callbacks
 */
function startCountdown(callbacks) {
  if (monitorState.countdownInterval) {
    clearInterval(monitorState.countdownInterval);
    monitorState.countdownInterval = null;
  }

  console.log("[Connectivity Monitor] Starting countdown timer");

  // Calculate and immediately display the current countdown value
  const elapsed = Date.now() - monitorState.disconnectionStartTime;
  const remaining = Math.max(0, monitorState.maxDisconnectionTime - elapsed);
  const remainingSeconds = Math.floor(remaining / 1000);

  console.log(`[Connectivity Monitor] Initial countdown: ${remainingSeconds}s remaining`);

  if (callbacks.onCountdownTick) {
    callbacks.onCountdownTick(remainingSeconds);
  }

  // Check if already exceeded before starting interval
  if (remaining <= 0) {
    console.log("[Connectivity Monitor] Max disconnection time already exceeded!");
    if (callbacks.onMaxTimeExceeded) {
      callbacks.onMaxTimeExceeded();
    }
    return;
  }

  monitorState.countdownInterval = setInterval(() => {
    const elapsed = Date.now() - monitorState.disconnectionStartTime;
    const remaining = Math.max(0, monitorState.maxDisconnectionTime - elapsed);
    const remainingSeconds = Math.floor(remaining / 1000);

    // Update countdown display (only log every 30 seconds to avoid spam)
    if (remainingSeconds % 30 === 0 || remainingSeconds <= 10) {
      console.log(
        `[Connectivity Monitor] Countdown: ${remainingSeconds}s remaining`
      );
    }

    if (callbacks.onCountdownTick) {
      callbacks.onCountdownTick(remainingSeconds);
    }

    // If time exceeded, logout
    if (remaining <= 0) {
      console.log("[Connectivity Monitor] Max disconnection time exceeded!");
      clearInterval(monitorState.countdownInterval);
      monitorState.countdownInterval = null;

      if (callbacks.onMaxTimeExceeded) {
        callbacks.onMaxTimeExceeded();
      }
    }
  }, 1000); // Update every second
}

/**
 * Initialize connectivity monitoring
 * @param {Object} options - Configuration options
 * @param {string} options.corpPingUrl - URL for corporate network ping (REQUIRED)
 * @param {Function} options.onModalShow - Callback when modal should be shown
 * @param {Function} options.onModalHide - Callback when modal should be hidden
 * @param {Function} options.onCountdownTick - Callback with remaining seconds (remainingSeconds)
 * @param {Function} options.onMaxTimeExceeded - Callback when max disconnection time is exceeded
 * @param {number} options.checkIntervalSec - Check interval in seconds (default 60)
 * @param {number} options.maxDisconnectionTimeSec - Max disconnection time in seconds (default 300 = 5 min)
 */
export async function initConnectivityMonitor(options = {}) {
  const {
    corpPingUrl = "",
    onModalShow = () => {},
    onModalHide = () => {},
    onCountdownTick = () => {},
    onMaxTimeExceeded = () => {},
    checkIntervalSec = 5,
    maxDisconnectionTimeSec = 300,
  } = options;

  // Validate required parameter
  if (!corpPingUrl) {
    console.error(
      "[Connectivity Monitor] FATAL: corpPingUrl not provided. Monitor cannot initialize."
    );
    return;
  }

  monitorState.corpPingUrl = corpPingUrl;

  // Convert seconds to milliseconds
  monitorState.checkIntervalMs = checkIntervalSec * 1000;
  monitorState.maxDisconnectionTime = maxDisconnectionTimeSec * 1000;

  const callbacks = {
    onModalShow,
    onModalHide,
    onCountdownTick,
    onMaxTimeExceeded,
  };

  console.log(
    `[Connectivity Monitor] Initializing with corpPingUrl: ${corpPingUrl}`
  );

  // Perform initial connectivity check
  console.log("[Connectivity Monitor] Performing initial connectivity check...");
  const isConnected = await checkConnectivity();
  console.log(`[Connectivity Monitor] Initial check result: ${isConnected ? "CONNECTED" : "DISCONNECTED"}`);
  
  if (!isConnected) {
    console.log("[Connectivity Monitor] Initial disconnect detected, starting grace period...");
    handleDisconnection(callbacks);
  }

  // Start periodic checks
  console.log(
    `[Connectivity Monitor] Starting periodic checks every ${checkIntervalSec}s`
  );
  monitorState.checkInterval = setInterval(async () => {
    const isConnected = await checkConnectivity();

    if (isConnected && !monitorState.isConnected) {
      // Reconnected
      console.log("[Connectivity Monitor] Reconnected!");
      handleReconnection(callbacks);
    } else if (!isConnected && monitorState.isConnected) {
      // Disconnected
      console.log("[Connectivity Monitor] Disconnected!");
      handleDisconnection(callbacks);
    } else if (!isConnected && !monitorState.isConnected) {
      // Still disconnected - check if we need to start countdown or update it
      if (!monitorState.countdownInterval) {
        startCountdown(callbacks);
      }
    }
  }, monitorState.checkIntervalMs);

  console.log(
    `[Connectivity Monitor] Initialized - checking every ${checkIntervalSec}s, logout after ${maxDisconnectionTimeSec}s of disconnection`
  );

  // Add event listeners for immediate response
  monitorState.onlineListener = () => {
    console.log("[Connectivity Monitor] Network 'online' event detected");
    void checkConnectivity().then((isConnected) => {
      if (isConnected && !monitorState.isConnected) {
        handleReconnection(callbacks);
      }
    });
  };

  monitorState.offlineListener = () => {
    console.log("[Connectivity Monitor] Network 'offline' event detected");
    void checkConnectivity().then((isConnected) => {
      if (!isConnected && monitorState.isConnected) {
        handleDisconnection(callbacks);
      }
    });
  };

  window.addEventListener("online", monitorState.onlineListener);
  window.addEventListener("offline", monitorState.offlineListener);
}

/**
 * Stop connectivity monitoring
 */
export function stopConnectivityMonitor() {
  console.log("[Connectivity Monitor] Stopping monitor...");

  if (monitorState.checkInterval) {
    clearInterval(monitorState.checkInterval);
    monitorState.checkInterval = null;
    console.log("[Connectivity Monitor] Cleared main check interval");
  }

  if (monitorState.graceTimer) {
    clearTimeout(monitorState.graceTimer);
    monitorState.graceTimer = null;
    console.log("[Connectivity Monitor] Cleared grace timer");
  }

  if (monitorState.countdownInterval) {
    clearInterval(monitorState.countdownInterval);
    monitorState.countdownInterval = null;
    console.log("[Connectivity Monitor] Cleared countdown interval");
  }

  if (monitorState.onlineListener) {
    window.removeEventListener("online", monitorState.onlineListener);
    monitorState.onlineListener = null;
  }

  if (monitorState.offlineListener) {
    window.removeEventListener("offline", monitorState.offlineListener);
    monitorState.offlineListener = null;
  }

  console.log("[Connectivity Monitor] Stopped");
}

/**
 * Get current connectivity state
 * @returns {Object} - Current state including isConnected, elapsedTime, etc.
 */
export function getConnectivityState() {
  return {
    isConnected: monitorState.isConnected,
    disconnectionStartTime: monitorState.disconnectionStartTime,
    elapsedMs: monitorState.disconnectionStartTime
      ? Date.now() - monitorState.disconnectionStartTime
      : 0,
  };
}
