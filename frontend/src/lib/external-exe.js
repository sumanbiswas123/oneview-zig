function normalizeValue(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function looksLikeWindowsExecutable(value = "") {
  return String(value || "").trim().toLowerCase().endsWith(".exe");
}

export function isStandaloneExternalExeApp(app = {}) {
  const type = normalizeValue(app?.type);
  const localPath = String(app?.localPath || "").trim();
  const releaseUrl = String(app?.releaseUrl || app?.url || "").trim();
  const hasExePath =
    looksLikeWindowsExecutable(localPath) ||
    looksLikeWindowsExecutable(releaseUrl);

  if (type !== "exe" && !(type === "custom" && hasExePath) && !app?.systemWideInstall) return false;

  const tech = normalizeValue(app?.tech);
  const launchMode = normalizeValue(
    app?.launchMode || app?.openMode || app?.launchStrategy,
  );

  // System-wide installed apps always launch in their own window
  if (app?.systemWideInstall) return true;

  if (
    launchMode === "external" ||
    launchMode === "separate-window" ||
    launchMode === "standalone"
  ) {
    return true;
  }

  return (
    hasExePath ||
    tech === "electron" ||
    tech === "electron-exe" ||
    tech === "standalone-electron"
  );
}

export async function launchStandaloneExternalExe(app = {}) {
  const exePath = String(app?.localPath || "").trim();
  if (!exePath) {
    throw new Error("Executable path is missing");
  }

  if (!window.api || typeof window.api.launchExe !== "function") {
    throw new Error("Executable launch API is unavailable");
  }

  return window.api.launchExe(exePath, app?.tech || "Electron");
}
