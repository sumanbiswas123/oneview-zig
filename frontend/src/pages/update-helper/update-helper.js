function renderState(state = {}) {
  const eyebrowEl = document.getElementById("helperEyebrow");
  const titleEl = document.getElementById("helperTitle");
  const messageEl = document.getElementById("helperMessage");
  const phaseLabelEl = document.getElementById("helperPhaseLabel");
  const versionEl = document.getElementById("helperVersion");
  const detailEl = document.getElementById("helperDetail");

  if (eyebrowEl) eyebrowEl.textContent = state.eyebrow || "Preparing update";
  if (titleEl) {
    titleEl.textContent =
      state.title || "Getting OneView ready to update";
  }
  if (messageEl) {
    messageEl.textContent =
      state.message ||
      "Please keep this window open while OneView updates.";
  }
  if (phaseLabelEl) phaseLabelEl.textContent = state.phaseLabel || "Stand by";
  if (versionEl) {
    versionEl.textContent = state.version ? `v${state.version}` : "";
  }
  if (detailEl) {
    detailEl.textContent =
      state.detail || "Waiting for the installer handoff.";
  }
}

async function init() {
  if (window.api?.getUpdateHelperState) {
    const response = await window.api.getUpdateHelperState();
    renderState(response?.state || {});
  } else {
    renderState();
  }

  if (window.api?.onUpdateHelperState) {
    window.api.onUpdateHelperState((state) => {
      renderState(state || {});
    });
  }
}

window.addEventListener("DOMContentLoaded", init);
