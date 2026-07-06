function applyPromptState(state = {}) {
  const version = String(state?.version || "").trim();
  const messageEl = document.getElementById("updatePromptMessage");
  const installBtn = document.getElementById("updatePromptInstallBtn");
  const laterBtn = document.getElementById("updatePromptLaterBtn");

  if (messageEl) {
    messageEl.textContent = version
      ? `Version ${version} is ready. We'll restart the app and open the Windows installer automatically.`
      : "A new version has been downloaded and is ready to install. We'll open the Windows installer automatically.";
  }

  if (installBtn) {
    installBtn.disabled = false;
  }

  if (laterBtn) {
    laterBtn.disabled = false;
  }
}

async function submit(action) {
  if (
    !window.api ||
    typeof window.api.submitUpdateInstallPrompt !== "function"
  ) {
    return;
  }

  if (action === "install") {
    window.api.submitUpdateInstallPrompt({ action }).catch((error) => {
      console.error("Failed to start update install flow:", error);
      applyPromptState();
    });
    return;
  }

  await window.api.submitUpdateInstallPrompt({ action });
}

async function init() {
  const installBtn = document.getElementById("updatePromptInstallBtn");
  const laterBtn = document.getElementById("updatePromptLaterBtn");

  if (window.api?.getUpdateInstallPromptState) {
    const response = await window.api.getUpdateInstallPromptState();
    applyPromptState(response?.state || {});
  } else {
    applyPromptState();
  }

  if (window.api?.onUpdateInstallPromptState) {
    window.api.onUpdateInstallPromptState((state) => {
      applyPromptState(state || {});
    });
  }

  if (window.api?.onUpdateStatus) {
    window.api.onUpdateStatus(() => {});
  }

  installBtn?.addEventListener("click", () => submit("install"));
  laterBtn?.addEventListener("click", () => submit("later"));

  document.addEventListener("keydown", async (event) => {
    if (event.key === "Escape" && window.api?.closeUpdateInstallPrompt) {
      await window.api.closeUpdateInstallPrompt();
    }
  });
}

window.addEventListener("DOMContentLoaded", init);
