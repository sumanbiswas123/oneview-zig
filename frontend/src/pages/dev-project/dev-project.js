import { IS_DEV_APP_BUILD } from "../../lib/app-env.js";

let devProjects = [];
let activeProject = null;
let activeFile = null;
let treeState = new Set();
let createProgressUnsub = null;
let startProgressUnsub = null;
let activeSelectId = null;

const ENTRY_CANDIDATES = [
  "README.md",
  "oneview-manifest.json",
  "popup.js",
  "index.js",
  "index.html",
  "src/index.html",
  "src/main.tsx",
  "src/main.jsx",
  "src/main.ts",
  "src/main.js",
  "src/index.tsx",
  "src/index.jsx",
  "src/index.ts",
  "src/index.js",
  "src/App.tsx",
  "src/App.jsx",
  "src/App.ts",
  "src/App.js",
];

function appendCreateLog(line) {
  const log = document.getElementById("devCreateLog");
  if (!log) return;

  const escaped = String(line)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  let colored;
  if (escaped.startsWith("[error]") || escaped.startsWith("[fatal]")) {
    colored = `<span style="color:#f87171">${escaped}</span>`;
  } else if (escaped.startsWith("[done]")) {
    colored = `<span style="color:#4ade80">${escaped}</span>`;
  } else if (escaped.startsWith("[info]") || escaped.startsWith("[oneview]")) {
    colored = `<span style="color:#38bdf8">${escaped}</span>`;
  } else if (escaped.startsWith("[warn]")) {
    colored = `<span style="color:#fbbf24">${escaped}</span>`;
  } else if (escaped.startsWith("==") && escaped.endsWith("==")) {
    colored = `<span style="color:#c084fc;font-weight:600">${escaped}</span>`;
  } else if (escaped.startsWith("[appstore]")) {
    colored = `<span style="color:#a78bfa">${escaped}</span>`;
  } else if (escaped.startsWith("[appstore:err]")) {
    colored = `<span style="color:#fb923c">${escaped}</span>`;
  } else {
    colored = escaped;
  }

  log.innerHTML += `${colored}\n`;
  log.scrollTop = log.scrollHeight;
}

function closeAllCustomSelects() {
  document.querySelectorAll(".custom-select").forEach((root) => {
    root.classList.remove("open");
  });
  activeSelectId = null;
}

function setupCustomSelect(rootId, inputId) {
  const root = document.getElementById(rootId);
  const hiddenInput = document.getElementById(inputId);
  if (!root || !hiddenInput) return;

  const trigger = root.querySelector('[data-role="trigger"]');
  const label = root.querySelector('[data-role="label"]');
  const options = [...root.querySelectorAll(".custom-select-option")];
  if (!trigger || !label || !options.length) return;

  const setValue = (value) => {
    const previousValue = hiddenInput.value;
    const picked =
      options.find((opt) => opt.dataset.value === value) || options[0];
    hiddenInput.value = picked.dataset.value || "";
    label.textContent = picked.dataset.label || picked.textContent || "";
    options.forEach((opt) => {
      opt.classList.toggle("active", opt === picked);
    });
    if (hiddenInput.value !== previousValue) {
      hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  setValue(hiddenInput.value || options[0].dataset.value);

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = root.classList.contains("open");
    closeAllCustomSelects();
    if (!isOpen) {
      root.classList.add("open");
      activeSelectId = rootId;
    }
  });

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      setValue(opt.dataset.value || "");
      closeAllCustomSelects();
    });
  });
}

function getCustomSelectValue(rootId, inputId, fallback = "") {
  const activeOption = document.querySelector(
    `#${rootId} .custom-select-option.active`,
  );
  const activeValue = String(activeOption?.dataset?.value || "").trim();
  if (activeValue) return activeValue;
  return String(document.getElementById(inputId)?.value || fallback).trim();
}

function setCreateBusy(busy) {
  const btn = document.getElementById("devCreateProjectBtn");
  if (btn) btn.disabled = busy;
}

function setWorkspaceVisible(visible) {
  const panel = document.getElementById("workspacePanel");
  if (!panel) return;
  panel.classList.toggle("hidden", !visible);
}

function setCreateVisible(visible) {
  const panel = document.getElementById("createPanel");
  if (!panel) return;
  panel.classList.toggle("hidden", !visible);
}

function setCardsVisible(visible) {
  const panel = document.getElementById("cardsPanel");
  if (!panel) return;
  panel.classList.toggle("hidden", !visible);
}

function setView(mode) {
  const showCards = mode === "cards";
  const showCreate = mode === "create";
  const showWorkspace = mode === "workspace";
  setCardsVisible(showCards);
  setCreateVisible(showCreate);
  setWorkspaceVisible(showWorkspace);
}

function syncProjectTypeFields() {
  const type = getCustomSelectValue("projectTypeSelect", "devProjectType", "app");
  const isExtension = type === "extension";
  const hiddenInput = document.getElementById("devProjectType");
  if (hiddenInput && hiddenInput.value !== type) hiddenInput.value = type;
  document.querySelectorAll(".app-project-field").forEach((field) => {
    field.classList.toggle("hidden", isExtension);
  });
  document
    .getElementById("extensionProjectHint")
    ?.classList.toggle("hidden", !isExtension);

  const nameInput = document.getElementById("devNewProjectName");
  if (nameInput) {
    nameInput.placeholder = isExtension ? "my-extension" : "my-app";
  }
}

function renderProjectCards() {
  const grid = document.getElementById("projectCardsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  grid.classList.toggle("empty", devProjects.length === 0);

  if (!devProjects.length) {
    const empty = document.createElement("div");
    empty.className = "project-empty";
    empty.innerHTML =
      "<div><strong>No previous projects yet</strong><br/>Create your first project card to begin.</div>";
    grid.appendChild(empty);
    return;
  }

  devProjects.forEach((project) => {
    const isExtension = project.type === "extension";
    const card = document.createElement("button");
    // Use app-card class instead of glass-card
    card.className = `app-card project-card ${activeProject?.name === project.name ? "active" : ""}`;
    card.setAttribute("data-name", project.name); // For DOM updates
    card.style.textAlign = "left";
    card.style.alignItems = "flex-start";

    // Structure similar to app-card in appstore
    card.innerHTML = `
      <div class="app-card-top" style="margin-bottom: 8px; width: 100%; justify-content: space-between;">
        <span class="project-type-tag ${isExtension ? "extension" : "app"}">${isExtension ? "Extension" : "App"}</span>
        <div class="project-card-actions">
           <button type="button" class="project-action rename" data-action="rename" title="Rename">Rename</button>
           <button type="button" class="project-action delete" data-action="delete" title="Delete">Delete</button>
        </div>
      </div>
      <h4 class="app-title" style="font-size: 18px; margin-bottom: 4px;">${project.name}</h4>
      <p class="app-desc" style="margin: 0; font-size: 13px; -webkit-line-clamp: 2;">${
        project.type === "extension"
          ? "Edit extension files and load into OneView"
          : "Open file tree and continue development"
      }</p>
    `;
    card
      .querySelector('[data-action="rename"]')
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        await renameProject(project.name);
      });
    card
      .querySelector('[data-action="delete"]')
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        await deleteProject(project.name);
      });
    card.addEventListener("click", async () => {
      activeFile = null;
      await openProjectWorkspace(project);
    });
    grid.appendChild(card);
  });
}

// Modal State
let activeModalAction = null; // 'rename' | 'delete'
let targetProjectName = null;

function openModal(action, projectName) {
  const modal = document.getElementById("devProjectModal");
  const title = document.getElementById("devModalTitle");
  const message = document.getElementById("devModalMessage");
  const inputContainer = document.getElementById("devModalInputContainer");
  const input = document.getElementById("devModalInput");
  const confirmBtn = document.getElementById("devModalConfirmBtn");

  if (!modal) return;

  activeModalAction = action;
  targetProjectName = projectName;
  modal.classList.remove("hidden");

  if (action === "rename") {
    title.textContent = "Rename Project";
    message.textContent = `Enter a new name for "${projectName}".`;
    inputContainer.classList.remove("hidden");
    input.value = projectName;
    confirmBtn.textContent = "Save";
    confirmBtn.className = "btn primary";
    // Focus input after transition
    setTimeout(() => input.focus(), 100);
  } else {
    title.textContent = "Delete Project";
    message.textContent = `Are you sure you want to delete "${projectName}"? This action cannot be undone.`;
    inputContainer.classList.add("hidden");
    confirmBtn.textContent = "Delete";
    confirmBtn.className = "btn danger";
  }
}

function closeModal() {
  const modal = document.getElementById("devProjectModal");
  if (modal) modal.classList.add("hidden");
  activeModalAction = null;
  targetProjectName = null;
}

async function handleModalConfirm() {
  const confirmBtn = document.getElementById("devModalConfirmBtn");
  const cancelBtn = document.getElementById("devModalCancelBtn");
  const message = document.getElementById("devModalMessage");
  if (confirmBtn) confirmBtn.disabled = true;
  if (cancelBtn) cancelBtn.disabled = true;

  // Release tree state if this project is currently being viewed
  // This frees file handles on Windows that cause EBUSY
  if (activeProject?.name === targetProjectName) {
    activeProject = null;
    activeFile = null;
    lastTreeData = null;
    const tree = document.getElementById("devTree");
    if (tree) tree.innerHTML = "";
    const preview = document.getElementById("devFilePreview");
    if (preview) preview.textContent = "";
    setView("cards");
  }

  try {
    if (activeModalAction === "rename") {
      const input = document.getElementById("devModalInput");
      const newName = input.value.trim();
      if (!newName || newName === targetProjectName) {
        closeModal();
        return;
      }

      if (message) message.textContent = "Renaming project...";

      const result = await window.api.renameDevProject(
        targetProjectName,
        newName,
      );
      if (result && result.success) {
        // Immediate UI Update
        const card = document.querySelector(
          `.project-card[data-name="${targetProjectName}"]`,
        );
        if (card) {
          card.dataset.name = newName;
          card.querySelector(".app-title").textContent = newName;
          card.querySelector('[data-action="rename"]').onclick = (e) => {
            e.stopPropagation();
            openModal("rename", newName);
          };
          card.querySelector('[data-action="delete"]').onclick = (e) => {
            e.stopPropagation();
            openModal("delete", newName);
          };
        }
        if (activeProject?.name === targetProjectName) {
          activeProject.name = newName;
          syncWorkspaceHeader();
        }
        await loadProjects();
      } else {
        alert(result?.message || "Rename failed");
      }
    } else if (activeModalAction === "delete") {
      // Show delete progress UI inside the modal
      const inputContainer = document.getElementById("devModalInputContainer");
      if (inputContainer) inputContainer.classList.add("hidden");
      if (confirmBtn) confirmBtn.style.display = "none";
      if (cancelBtn) cancelBtn.style.display = "none";

      // Create progress indicator
      if (message) {
        message.innerHTML = `
          <div style="text-align: center; padding: 10px 0;">
            <div class="delete-spinner"></div>
            <p id="deleteProgressText" style="margin: 12px 0 8px; font-size: 14px; color: var(--text-main, #1e293b);">Preparing to delete...</p>
            <div style="width: 100%; height: 6px; border-radius: 3px; background: rgba(148,163,184,0.2); overflow: hidden;">
              <div id="deleteProgressBar" style="width: 0%; height: 100%; border-radius: 3px; background: linear-gradient(90deg, #ef4444, #f97316); transition: width 0.4s ease;"></div>
            </div>
            <p id="deleteProgressPercent" style="margin: 6px 0 0; font-size: 12px; color: var(--text-muted, #64748b);">0%</p>
          </div>`;
      }

      // Subscribe to delete progress events
      let deleteProgressUnsub = null;
      if (window.api.onDevProjectProgress) {
        deleteProgressUnsub = window.api.onDevProjectProgress((payload) => {
          if (!payload || payload.scope !== "delete-project") return;
          const progressText = document.getElementById("deleteProgressText");
          const progressBar = document.getElementById("deleteProgressBar");
          const progressPercent = document.getElementById(
            "deleteProgressPercent",
          );
          if (progressText && payload.line)
            progressText.textContent = payload.line;
          if (progressBar && typeof payload.percent === "number") {
            progressBar.style.width = `${payload.percent}%`;
          }
          if (progressPercent && typeof payload.percent === "number") {
            progressPercent.textContent = `${Math.round(payload.percent)}%`;
          }
        });
      }

      const result = await window.api.deleteDevProject(targetProjectName);

      // Cleanup progress listener
      if (deleteProgressUnsub) deleteProgressUnsub();

      if (result && result.success) {
        // Immediate UI Update
        const card = document.querySelector(
          `.project-card[data-name="${targetProjectName}"]`,
        );
        if (card) {
          card.style.transition = "all 0.3s ease";
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => card.remove(), 300);
        }

        devProjects = devProjects.filter((p) => p.name !== targetProjectName);
        if (devProjects.length === 0) renderProjectCards();
        syncWorkspaceHeader();
        await loadProjects();
      } else {
        alert(result?.message || "Delete failed");
      }
    }
  } catch (err) {
    console.error("Modal action failed", err);
    alert("Action failed: " + err.message);
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.style.display = "";
    }
    if (cancelBtn) {
      cancelBtn.disabled = false;
      cancelBtn.style.display = "";
    }
    closeModal();
  }
}

// Replaced original renameProject/deleteProject with wrappers to open modal
async function renameProject(oldName) {
  openModal("rename", oldName);
}

async function deleteProject(projectName) {
  openModal("delete", projectName);
}

function flattenFiles(nodes, output = []) {
  (nodes || []).forEach((node) => {
    if (node.type === "file") {
      output.push(node.path);
      return;
    }
    flattenFiles(node.children || [], output);
  });
  return output;
}

function pickDefaultFile(files) {
  for (const preferred of ENTRY_CANDIDATES) {
    const hit = files.find(
      (f) => f.toLowerCase().replace(/\\/g, "/") === preferred,
    );
    if (hit) return hit;
  }
  return files[0] || null;
}

function syncWorkspaceHeader() {
  const title = document.getElementById("workspaceProjectTitle");
  const startBtn = document.getElementById("startDevelopingBtn");
  if (title) {
    title.textContent = activeProject
      ? `Workspace - ${activeProject.name}`
      : "Workspace";
  }
  if (startBtn) startBtn.disabled = !activeProject;
}

function renderTreeNode(node, parent, depth = 0) {
  const row = document.createElement("button");
  row.className = `tree-row ${node.type} ${activeFile === node.path ? "active" : ""}`;
  row.dataset.path = node.path;
  row.style.paddingLeft = `${8 + depth * 13}px`;

  if (node.type === "dir") {
    const expanded = treeState.has(node.path);
    row.innerHTML = `<span class="tree-icon dir-icon">${expanded ? "-" : "+"}</span><span class="tree-name">${node.name}</span>`;
    row.addEventListener("click", () => {
      if (expanded) treeState.delete(node.path);
      else treeState.add(node.path);
      loadProjectTree();
    });
    parent.appendChild(row);
    if (expanded) {
      (node.children || []).forEach((child) =>
        renderTreeNode(child, parent, depth + 1),
      );
    }
    return;
  }

  row.innerHTML = `<span class="tree-icon file-icon">#</span><span class="tree-name">${node.name}</span>`;
  row.addEventListener("click", async () => {
    activeFile = node.path;
    highlightActiveFile();
    await loadFilePreview(node.path);
  });
  parent.appendChild(row);
}

function highlightActiveFile() {
  const tree = document.getElementById("devTree");
  if (!tree) return;
  [...tree.querySelectorAll(".tree-row.file")].forEach((el) => {
    el.classList.toggle("active", activeFile && el.dataset.path === activeFile);
  });
}

let lastTreeData = null;

async function loadProjectTree() {
  const tree = document.getElementById("devTree");
  if (!tree) return;
  tree.innerHTML = "";

  if (!activeProject) {
    tree.textContent = "Choose a project card to view files.";
    return;
  }

  try {
    const data = await window.api.getDevProjectTree(activeProject.name);
    lastTreeData = data;
    const nodes = data?.tree || [];
    nodes.forEach((node) => renderTreeNode(node, tree, 0));
  } catch (err) {
    tree.textContent = `Could not load tree: ${err.message || err}`;
  }
}

async function loadFilePreview(relativePath) {
  const title = document.getElementById("devPreviewTitle");
  const preview = document.getElementById("devFilePreview");
  if (!preview || !activeProject) return;

  title.textContent = `Preview - ${relativePath}`;
  preview.textContent = "Loading...";
  try {
    const result = await window.api.readDevProjectFile(
      activeProject.name,
      relativePath,
    );
    const raw = result?.content || "";
    preview.innerHTML = highlightForPreview(raw, relativePath);
  } catch (err) {
    preview.textContent = `Could not read file: ${err.message || err}`;
  }
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getLanguageFromPath(filePath) {
  const p = (filePath || "").toLowerCase();
  if (p.endsWith(".html") || p.endsWith(".htm")) return "html";
  if (p.endsWith(".css")) return "css";
  if (p.endsWith(".json")) return "json";
  if (
    p.endsWith(".js") ||
    p.endsWith(".jsx") ||
    p.endsWith(".ts") ||
    p.endsWith(".tsx")
  )
    return "js";
  if (p.endsWith(".md")) return "md";
  return "plain";
}

function highlightJs(escaped) {
  return escaped
    .replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>')
    .replace(/(".*?"|'.*?'|`[\s\S]*?`)/g, '<span class="tok-string">$1</span>')
    .replace(
      /\b(const|let|var|function|return|if|else|for|while|switch|case|break|import|from|export|default|async|await|try|catch|throw|new|class|extends)\b/g,
      '<span class="tok-keyword">$1</span>',
    )
    .replace(
      /\b(true|false|null|undefined)\b/g,
      '<span class="tok-boolean">$1</span>',
    )
    .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>');
}

function highlightHtml(escaped) {
  return escaped
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-comment">$1</span>')
    .replace(/(&lt;\/?[a-zA-Z0-9-]+)/g, '<span class="tok-tag">$1</span>')
    .replace(/([a-zA-Z-:]+)=/g, '<span class="tok-attr">$1</span>=')
    .replace(/(".*?")/g, '<span class="tok-string">$1</span>');
}

function highlightCss(escaped) {
  return escaped
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>')
    .replace(
      /([.#]?[a-zA-Z0-9_-]+)(\s*\{)/g,
      '<span class="tok-tag">$1</span>$2',
    )
    .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="tok-attr">$1</span>$2')
    .replace(
      /(#(?:[0-9a-fA-F]{3,8})|\b\d+(?:px|rem|em|%)\b)/g,
      '<span class="tok-number">$1</span>',
    );
}

function highlightJson(escaped) {
  return escaped
    .replace(/(".*?")(\s*:)/g, '<span class="tok-attr">$1</span>$2')
    .replace(/(:\s*)(".*?")/g, '$1<span class="tok-string">$2</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="tok-boolean">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>');
}

function highlightForPreview(raw, filePath) {
  const escaped = escapeHtml(raw);
  const lang = getLanguageFromPath(filePath);
  let highlighted = escaped;

  if (lang === "js") highlighted = highlightJs(escaped);
  else if (lang === "html") highlighted = highlightHtml(escaped);
  else if (lang === "css") highlighted = highlightCss(escaped);
  else if (lang === "json") highlighted = highlightJson(escaped);

  return `<code class="lang-${lang}">${highlighted}</code>`;
}

async function openDefaultFile() {
  if (!lastTreeData?.tree) return;
  const files = flattenFiles(lastTreeData.tree, []);
  const defaultFile = pickDefaultFile(files);
  if (!defaultFile) {
    const preview = document.getElementById("devFilePreview");
    const title = document.getElementById("devPreviewTitle");
    if (title) title.textContent = "File Preview";
    if (preview) preview.textContent = "No files to preview in this project.";
    return;
  }

  // Expand parent dirs for selected file.
  const segments = defaultFile.replace(/\\/g, "/").split("/");
  let current = "";
  for (let i = 0; i < segments.length - 1; i += 1) {
    current = current ? `${current}/${segments[i]}` : segments[i];
    treeState.add(current);
  }

  activeFile = defaultFile;
  await loadProjectTree();
  await loadFilePreview(defaultFile);
}

async function loadProjects() {
  try {
    devProjects = await window.api.listDevProjects();
  } catch (err) {
    devProjects = [];
    appendCreateLog(`[error] Could not list projects: ${err.message || err}`);
  }

  if (activeProject) {
    activeProject =
      devProjects.find((project) => project.name === activeProject.name) ||
      null;
  }

  renderProjectCards();
  syncWorkspaceHeader();
}

async function openProjectWorkspace(project, projectType = "") {
  if (!project) return false;
  activeProject = project;
  setView("workspace");
  treeState =
    (projectType || project.type) === "extension"
      ? new Set(["assets", "lib"])
      : new Set(["src", "public"]);
  renderProjectCards();
  await loadProjectTree();
  await openDefaultFile();
  syncWorkspaceHeader();
  return true;
}

async function createProject() {
  syncProjectTypeFields();
  const projectType = getCustomSelectValue(
    "projectTypeSelect",
    "devProjectType",
    "app",
  );
  const framework = document.getElementById("devNewFramework")?.value;
  const language = document.getElementById("devNewLanguage")?.value;
  const starter =
    document.getElementById("devStarterPreset")?.value || "standard";
  const name = (
    document.getElementById("devNewProjectName")?.value || ""
  ).trim();

  if (!name) {
    appendCreateLog("[error] Project name is required");
    return;
  }

  const log = document.getElementById("devCreateLog");
  if (log) log.innerHTML = "";
  appendCreateLog(
    projectType === "extension"
      ? "[oneview] type=extension, starter=oneview-extension"
      : `[oneview] type=app, framework=${framework}, language=${language}, starter=${starter}`,
  );
  setCreateBusy(true);

  if (createProgressUnsub) createProgressUnsub();
  if (window.api.onDevProjectProgress) {
    createProgressUnsub = window.api.onDevProjectProgress((payload) => {
      if (!payload) return;
      if (payload.phase === "start")
        appendCreateLog(`\n== ${payload.label} ==`);
      else if (payload.phase === "stdout" || payload.phase === "stderr")
        appendCreateLog(payload.line);
      else if (payload.phase === "info")
        appendCreateLog(`[info] ${payload.line}`);
      else if (payload.phase === "done")
        appendCreateLog(`[done] ${payload.label}`);
      else if (payload.phase === "error")
        appendCreateLog(`[error] ${payload.line}`);
    });
  }

  try {
    const result = await window.api.createDevProject({
      projectType,
      framework,
      language,
      projectName: name,
      starter,
    });
    if (!result?.success) {
      if (result?.code === "TARGET_FOLDER_NOT_EMPTY") {
        appendCreateLog(
          `[warn] Project '${name}' already exists. Opening the existing project instead.`,
        );
        await loadProjects();
        const existingProject = devProjects.find(
          (project) => project.name.toLowerCase() === name.toLowerCase(),
        );
        if (existingProject) {
          await openProjectWorkspace(existingProject, projectType);
          return;
        }
      }
      appendCreateLog(
        `[fatal] ${result?.message || "Project creation failed"}`,
      );
      return;
    }

    appendCreateLog(`[done] Project '${name}' created`);
    await loadProjects();
    activeProject = devProjects.find((p) => p.name === name) || null;
    if (activeProject) {
      await openProjectWorkspace(activeProject, projectType);
    }
  } catch (err) {
    appendCreateLog(`[fatal] ${err.message || err}`);
  } finally {
    setCreateBusy(false);
    if (createProgressUnsub) {
      createProgressUnsub();
      createProgressUnsub = null;
    }
  }
}

async function startDeveloping() {
  if (!activeProject) return;
  appendCreateLog(`[info] Starting dev workflow for ${activeProject.name}`);
  if (activeProject.path) {
    appendCreateLog(`[info] Opening path: ${activeProject.path}`);
  }
  if (startProgressUnsub) {
    startProgressUnsub();
    startProgressUnsub = null;
  }
  if (window.api.onDevProjectProgress) {
    startProgressUnsub = window.api.onDevProjectProgress((payload) => {
      if (!payload || payload.scope !== "start-developing") return;
      const phase = payload.phase || "info";
      const line = payload.line || "";
      if (phase === "stdout") appendCreateLog(`[appstore] ${line}`);
      else if (phase === "stderr") appendCreateLog(`[appstore:err] ${line}`);
      else if (phase === "warn") appendCreateLog(`[warn] ${line}`);
      else if (phase === "error") appendCreateLog(`[error] ${line}`);
      else appendCreateLog(`[info] ${line}`);
    });
  }
  try {
    const result = await window.api.startDevelopingProject({
      name: activeProject.name,
      path: activeProject.path,
      type: activeProject.type,
    });
    if (!result?.success && result?.message) {
      appendCreateLog(`[warn] ${result.message}`);
      return;
    }
    appendCreateLog(
      activeProject.type === "extension"
        ? "[done] VS Code opened and extension loaded into OneView"
        : "[done] VS Code and appstore runner started",
    );
  } catch (err) {
    appendCreateLog(`[error] ${err.message || err}`);
  }
}

function bindDevProjectEvents() {
  document
    .getElementById("createProjectCard")
    ?.addEventListener("click", () => {
      setView("create");
      activeProject = null;
      renderProjectCards();
      syncWorkspaceHeader();
    });
  document.getElementById("createBackBtn")?.addEventListener("click", () => {
    setView("cards");
  });
  document
    .getElementById("devCreateProjectBtn")
    ?.addEventListener("click", createProject);
  document
    .getElementById("refreshProjectsBtn")
    ?.addEventListener("click", loadProjects);
  document
    .getElementById("startDevelopingBtn")
    ?.addEventListener("click", startDeveloping);
  document.getElementById("workspaceBackBtn")?.addEventListener("click", () => {
    setView("cards");
  });
  document
    .getElementById("exposeFileBtn")
    ?.addEventListener("click", async () => {
      if (activeProject) {
        await window.api.openProjectFolder({
          name: activeProject.name,
          path: activeProject.path,
        });
      }
    });
  document.getElementById("devBackToStore")?.addEventListener("click", () => {
    if (typeof window.loadAppStore === "function") window.loadAppStore();
    else window.location.href = "../appstore/appstore.html";
  });

  document.addEventListener("click", () => {
    if (activeSelectId) closeAllCustomSelects();
  });
}

async function initDevProjectPage() {
  if (IS_DEV_APP_BUILD && localStorage.getItem("userMaster") !== "true") {
    window.location.href = "../appstore/appstore.html";
    return;
  }
  setupCustomSelect("projectTypeSelect", "devProjectType");
  setupCustomSelect("frameworkSelect", "devNewFramework");
  setupCustomSelect("languageSelect", "devNewLanguage");
  setupCustomSelect("starterSelect", "devStarterPreset");
  document
    .getElementById("devProjectType")
    ?.addEventListener("change", syncProjectTypeFields);
  syncProjectTypeFields();
  closeAllCustomSelects();
  bindDevProjectEvents();
  setView("cards");
  document
    .getElementById("devModalCancelBtn")
    ?.addEventListener("click", closeModal);
  document
    .getElementById("devModalConfirmBtn")
    ?.addEventListener("click", handleModalConfirm);
  document.getElementById("devModalInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleModalConfirm();
    if (e.key === "Escape") closeModal();
  });

  // Close on backdrop
  document.getElementById("devProjectModal")?.addEventListener("click", (e) => {
    if (e.target.id === "devProjectModal") closeModal();
  });

  await loadProjects();
}

// Export for module usage if needed
export { initDevProjectPage };

// Expose globally for dashboard loader
window.initDevProjectPage = initDevProjectPage;

// Only run automatically if not loaded as a module/embedded
if (!window.devProjectScriptLoaded) {
  document.addEventListener("DOMContentLoaded", initDevProjectPage);
}
