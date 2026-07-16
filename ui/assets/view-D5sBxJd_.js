import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{o as lt,c as Ze,e as Ie}from"./utils-BB1f9hyT.js";import{s as qe}from"./notifications-CBkElf_0.js";import{i as wn,l as Si}from"./external-exe-DRsy67iY.js";import{c as gn,i as Ei,s as xi,t as Ci}from"./webcontent-client-DJU5VCvB.js";import{n as wt,R as Rn,i as Bt,c as Ii,I as At}from"./app-env-Dw5Rxq_p.js";import{S as et,P as ye}from"./app-runtime-CuOCpSBc.js";function ki({state:e,constants:n,escapeHtml:t,showToast:o,isPerfEnabled:r,formatDownloadBytes:u,formatDownloadSpeed:v,formatDownloadEta:x,formatHistoryTime:B,loadManagedDownloadsFromMain:L,refreshExtensionsManagerList:y,saveProfileHistoryStore:C,getActiveTab:k,updateTabTitle:$,createTab:R,switchTab:F,navigateTo:W}){const{PROFILES:Z,PARTITIONS:le,IS_DEV_APP_BUILD:q}=n;function se(f=""){const M=String(f||"").trim().toLowerCase();return["downloads","history","extensions","passwords"].includes(M)?M:"extensions"}function Se(f="extensions"){const M=se(f);return M==="downloads"?"Downloads":M==="history"?"History":M==="passwords"?"Passwords":"Extensions"}function ke(f="extensions"){const M=se(f);return M==="downloads"?"Ctrl+Shift+D":M==="history"?"Ctrl+H":M==="extensions"?"Ctrl+E":""}function nt(f){const M=f instanceof Element?f:null;return M?M.closest("input, textarea, select")?!0:M.isContentEditable===!0:!1}function Oe(f="settings",M="extensions"){return{type:String(f||"settings").trim().toLowerCase(),section:se(M)}}function ee(f="extensions"){const M=se(f);return e.tabs.find(E=>E?.nativePage?.type==="settings"&&se(E?.nativePage?.section)===M)||null}function ce(f){return f?.nativePage?.type==="settings"}async function Ke(){if(!window.api)return e.nativeSettingsGeneralInfo;try{if(!e.nativeSettingsGeneralInfo.version&&window.api.getAppVersion&&(e.nativeSettingsGeneralInfo.version=await window.api.getAppVersion()),!e.nativeSettingsGeneralInfo.defaultOpenStatus&&window.api.getDefaultOpenHandlingStatus){const f=await window.api.getDefaultOpenHandlingStatus();e.nativeSettingsGeneralInfo.defaultOpenStatus=f?.isDefault||f?.success?"Configured":"Needs setup"}}catch{}return e.nativeSettingsGeneralInfo}function Le(){return Object.entries(e.profileHistoryCache||{}).flatMap(([f,M])=>(Array.isArray(M)?M:[]).map(E=>({profileId:f,profileName:Z[f]?.name||f||"Unknown",url:String(E?.url||"").trim(),title:String(E?.title||"Untitled").trim()||"Untitled",visitedAt:E?.visitedAt?Number(E.visitedAt):0}))).filter(f=>f.url&&f.visitedAt).sort((f,M)=>Number(M.visitedAt||0)-Number(f.visitedAt||0))}function Ce(f){const M=new Date(Number(f||0));if(Number.isNaN(M.getTime()))return"Unknown Date";const E=new Date,A=new Date(E.getFullYear(),E.getMonth(),E.getDate()).getTime(),D=new Date(M.getFullYear(),M.getMonth(),M.getDate()).getTime(),X=A-1440*60*1e3;return D===A?"Today":D===X?"Yesterday":M.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function Pe(f=[]){const M=[],E=new Map;return f.forEach(A=>{const D=Ce(A.visitedAt);if(!E.has(D)){const X={key:`${D}-${A.visitedAt}`,label:D,entries:[]};E.set(D,X),M.push(X)}E.get(D).entries.push(A)}),M}function Ge(){return e.managedDownloadsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.managedDownloadsCache.map(f=>{const M=f.totalBytes?Math.max(0,Math.min(100,Math.round(f.receivedBytes/f.totalBytes*100))):f.state==="completed"?100:0,E=f.totalBytes?`${u(f.receivedBytes)} / ${u(f.totalBytes)}`:u(f.receivedBytes),A=f.state==="progressing"?`${v(f.bytesPerSecond)} - ${x(f.etaSeconds)}`:f.state==="completed"?`Saved to ${t(f.savePath||"")}`:t(String(f.state||"Unknown"));return`
              <article class="native-settings-row native-settings-download-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.fileName||"Download")}</div>
                    <div class="native-settings-row-note">${t(E)}</div>
                    <div class="native-settings-row-note">${A}</div>
                  </div>
                  <div class="native-settings-inline-actions">
                    ${f.state==="progressing"?`<button class="native-settings-action" type="button" data-native-download-action="${f.isPaused?"resume":"pause"}" data-download-id="${t(f.id)}">${f.isPaused?"Resume":"Pause"}</button>`:""}
                    ${f.state==="progressing"?`<button class="native-settings-action" type="button" data-native-download-action="cancel" data-download-id="${t(f.id)}">Cancel</button>`:""}
                    ${f.state!=="progressing"?`<button class="native-settings-action" type="button" data-native-download-action="show" data-download-id="${t(f.id)}">Show</button>`:""}
                    ${f.state==="completed"?`<button class="native-settings-action" type="button" data-native-download-action="open" data-download-id="${t(f.id)}">Open</button>`:""}
                    ${f.state==="interrupted"||f.state==="cancelled"?`<button class="native-settings-action" type="button" data-native-download-action="retry" data-download-id="${t(f.id)}">Retry</button>`:""}
                    <button class="native-settings-action" type="button" data-native-download-action="remove" data-download-id="${t(f.id)}">Remove</button>
                  </div>
                </div>
                <div class="native-settings-progress"><span style="width:${M}%"></span></div>
              </article>
            `}).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No downloads yet.</div>'}function Ve(){const f=e.historySearchQuery.trim().toLowerCase(),M=Le().filter(A=>f?`${A.title||""} ${A.url||""} ${A.profileName||""}`.toLowerCase().includes(f):!0);return M.length?`
      <div class="native-history-flat-list">
        ${Pe(M).map(A=>`
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${t(A.label)}</span>
                </div>
                ${A.entries.map(D=>`
                      <article class="native-history-entry">
                        <div class="native-history-entry-content">
                          <div class="native-history-entry-title">${t(D.title||"Untitled")}</div>
                          <div class="native-history-entry-url">${t(D.url||"")}</div>
                          <div class="native-history-entry-meta">${t(D.profileName)} • ${t(B(D.visitedAt))}</div>
                        </div>
                        <div class="native-history-entry-actions">
                          <button class="native-settings-action" type="button" data-native-history-action="open" data-history-time="${t(D.visitedAt||"")}" data-profile-id="${t(D.profileId)}">Open</button>
                          <button class="native-settings-action" type="button" data-native-history-action="delete" data-history-time="${t(D.visitedAt||"")}" data-profile-id="${t(D.profileId)}">Delete</button>
                        </div>
                      </article>
                    `).join("")}
              </div>
            `).join("")}
      </div>
    `:`<div class="native-settings-empty">${f?"No history matches your search.":"No history yet."}</div>`}function Re(){return e.browserExtensionsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.browserExtensionsCache.map(f=>`
              <article class="native-settings-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.name||"Unnamed Extension")}</div>
                    <div class="native-settings-row-note">${t(f.id||f.path||"")}</div>
                    ${q?`<div class="native-settings-row-note">${t(f.path||"")}</div>`:""}
                  </div>
                  <div class="native-settings-inline-actions">
                    <button class="native-settings-action" type="button" data-native-extension-action="more" data-extension-path="${t(f.path||"")}">More</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="${f.enabled===!1?"enable":"disable"}" data-extension-path="${t(f.path||"")}">${f.enabled===!1?"Enable":"Disable"}</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="reload" data-extension-path="${t(f.path||"")}">Reload</button>
                    ${q?`<button class="native-settings-action" type="button" data-native-extension-action="remove" data-extension-path="${t(f.path||"")}">Remove</button>`:""}
                  </div>
                </div>
              </article>
            `).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No extensions installed yet.</div>'}function je(){const f=e.credentialCache||{},M=[];return Object.entries(f).forEach(([A,D])=>{(D||[]).forEach((X,te)=>{M.push({key:`${A}:${te}`,profileId:A,domain:String(X.domain||"").toLowerCase(),username:String(X.username||""),password:String(X.password||"")})})}),`
      <section class="native-settings-section">
        <div class="native-settings-section-head">
          <h3>Add or Update Password</h3>
          <p>Securely store credentials for quick autofill</p>
        </div>
        <form class="password-form" id="nativePasswordForm">
          <div class="password-field">
            <label>Domain</label>
            <input type="text" id="nativePasswordDomainInput" placeholder="example.com" required />
          </div>
          <div class="password-field">
            <label>Username</label>
            <input type="text" id="nativePasswordUsernameInput" placeholder="user@example.com" required />
          </div>
          <div class="password-field">
            <label>Password</label>
            <div class="password-input-wrapper" style="position: relative; display: flex; align-items: stretch;">
              <input type="password" id="nativePasswordSecretInput" placeholder="••••••••" required style="flex: 1; padding-right: 40px;" />
              <button type="button" id="nativePasswordToggleEye" class="password-visibility-toggle" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          <div class="password-field" style="grid-column: 1 / -1;">
            <label>Profile</label>
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${Object.entries(Z).map(([A,D])=>`
        <label class="profile-pill-item" style="cursor: pointer;" data-profile-id="${t(A)}">
          <input type="radio" name="nativePasswordProfile" value="${t(A)}" ${A===(e.passwordProfileId||e.currentProfileId||"guest")?"checked":""} style="cursor: pointer;" />
          <span class="profile-pill-dot" style="background-color: ${t(D.color||"#000")}"></span>
          <span>${t(D.name||"")}</span>
        </label>
      `).join("")}</div>
          </div>
          <button type="submit" class="native-settings-action" style="grid-column: 1 / -1; background: #3b82f6; color: white; font-weight: 600; padding: 10px 14px;">Save Credential</button>
        </form>
 
        <div class="native-settings-section-head" style="margin-top: 24px;">
          <h3>Saved Passwords</h3>
          <p>${M.length} credential${M.length!==1?"s":""} stored</p>
        </div>
        
        ${M.length===0?'<div class="native-settings-empty">No saved credentials yet. Add one above.</div>':`<div class="password-list">
              ${M.map(A=>`
                <div class="password-item" data-key="${t(A.key)}">
                  <div><strong>${t(A.domain)}</strong><div class="password-meta">${t(A.profileId)}</div></div>
                  <div>${t(A.username)}</div>
                  <div class="password-secret-container" style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <span class="password-secret" data-password="${t(A.password)}" style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; word-break: break-all;">••••••••</span>
                    <button type="button" class="password-list-toggle-eye" style="background: none; border: none; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; color: #666; margin-left: auto;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  </div>
                  <div class="password-actions">
                    <button type="button" class="password-action-btn" data-action="edit">Edit</button>
                    <button type="button" class="password-action-btn" data-action="delete">Delete</button>
                  </div>
                </div>
              `).join("")}
            </div>`}
      </section>
    `}async function Je(){if(window.api?.listProfileCredentials)try{const f=await window.api.listProfileCredentials();if(f&&Array.isArray(f.data)){const M={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};f.data.forEach(E=>{const A=String(E.profileId||"").toLowerCase();M[A]||(M[A]=[]),M[A].push(E)}),e.credentialCache=M}}catch(f){console.error("loadCredentialsIntoCache error:",f)}}function he(f){const M=document.getElementById("nativeTabContent");if(!M||!ce(f))return;const E=se(f.nativePage?.section);let A="",D="";const X=Se(E);let te="Manage app behavior without leaving the browser shell.";if(E==="downloads"){const Q=e.managedDownloadsCache.length,re=e.managedDownloadsCache.filter(d=>d.state==="progressing").length;A=Ge(),te=`${re} active, ${Q} total downloads.`}else if(E==="history"){const Q=Le(),re=e.historySearchQuery.trim()?Q.filter(d=>`${d.title||""} ${d.url||""} ${d.profileName||""}`.toLowerCase().includes(e.historySearchQuery.trim().toLowerCase())).length:Q.length;D=`
        <div class="native-settings-inline native-settings-toolbar">
          <input
            id="nativeHistorySearchInput"
            class="native-settings-search"
            type="search"
            placeholder="Search all history"
            value="${t(e.historySearchQuery)}"
          />
          <button class="native-settings-action" type="button" data-native-settings-action="clear-history">Clear all history</button>
        </div>
      `,A=Ve(),te=`${re} total history entries across all profiles.`}else if(E==="extensions"){const Q=e.browserExtensionsCache.filter(re=>re.enabled!==!1).length;D=`
        <div class="native-settings-toolbar">
          ${q?'<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>':""}
        </div>
      `,A=Re(),te=`${Q} enabled out of ${e.browserExtensionsCache.length} extensions.`}else E==="passwords"?(A=je(),te="Manage saved passwords securely.",e._credentialsLoaded||(e._credentialsLoaded=!0,Je().then(()=>{he(f)}))):e._credentialsLoaded=!1;M.innerHTML=`
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${t(X)}</h2>
                <p>${t(te)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions","history","downloads","passwords"].map(Q=>{const re=ke(Q);return`
                    <button
                      type="button"
                      class="native-settings-chip ${Q===E?"is-active":""}"
                      data-native-settings-nav="${Q}"
                      title="${t(Se(Q))}${re?` (${re})`:""}"
                    >
                      <span>${t(Se(Q))}</span>
                      ${re?`<span class="native-settings-chip-shortcut">${t(re)}</span>`:""}
                    </button>
                  `}).join("")}
            </div>
            ${D}
          </div>
          <div class="native-settings-body">
            ${A}
          </div>
        </section>
      </div>
    `}async function xe(){const f=k();ce(f)&&he(f)}function Fe(f="extensions",M=e.activeTabId){const E=e.tabs.find(D=>D.id===M);if(!ce(E))return;const A=se(f);E.nativePage.section=A,$(E.id,Se(A)),E.id===e.activeTabId&&he(E)}function $e(f="extensions"){const M=ee(f);if(M){F(M.id);return}R(null,null,Se(f),null,{nativePage:Oe("settings",f)})}function Xe(){const f=document.getElementById("settingsBtn");f&&f.dataset.boundClick!=="1"&&(f.dataset.boundClick="1",f.addEventListener("click",()=>{$e("extensions")}))}function ot(){const f=document.getElementById("nativeTabContent");if(!f||f.dataset.boundNativeSettings==="1")return;f.dataset.boundNativeSettings="1",window.addEventListener("credentials-updated",()=>{e._credentialsLoaded=!1;const E=k();ce(E)&&E.nativePage?.section==="passwords"&&Je().then(()=>{he(E)})});const M=(E=null,A=null)=>{requestAnimationFrame(()=>{const D=document.getElementById("nativeHistorySearchInput");if(D&&(D.focus({preventScroll:!0}),Number.isInteger(E)&&Number.isInteger(A)&&typeof D.setSelectionRange=="function"))try{D.setSelectionRange(E,A)}catch{}})};f.addEventListener("click",async E=>{const A=E.target.closest(".password-visibility-toggle");if(A){E.preventDefault();const c=document.getElementById("nativePasswordSecretInput");if(c){const S=c.type==="password";c.type=S?"text":"password",A.innerHTML=S?`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          `:`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          `}return}const D=E.target.closest(".password-list-toggle-eye");if(D){E.preventDefault();const c=D.parentNode.querySelector(".password-secret");if(c){const S=c.dataset.password||"";c.textContent==="••••••••"?(c.textContent=S,D.innerHTML=`
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            `):(c.textContent="••••••••",D.innerHTML=`
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            `)}return}const X=E.target.closest("[data-native-settings-nav]");if(X){Fe(X.dataset.nativeSettingsNav||"extensions");return}const te=E.target.closest("[data-native-settings-action]");if(te){const c=String(te.dataset.nativeSettingsAction||"").trim();try{c==="check-updates"&&window.api?.checkForUpdates?(await window.api.checkForUpdates(),o("Update check started.","success")):c==="open-default-apps"&&window.api?.openDefaultAppSettings?await window.api.openDefaultAppSettings():c==="load-unpacked-extension"&&window.api?.addBrowserExtensionsUnpacked?(await window.api.addBrowserExtensionsUnpacked(),await y(),await xe(),o("Unpacked extensions loaded.","success")):c==="clear-history"&&(Object.keys(e.profileHistoryCache||{}).forEach(S=>{e.profileHistoryCache[S]=[]}),C(),he(k()))}catch(S){o(S?.message||"Could not complete settings action.","error")}return}const Q=E.target.closest("[data-native-download-action]");if(Q){try{const c=await window.api?.runManagedDownloadAction?.({id:String(Q.dataset.downloadId||"").trim(),action:String(Q.dataset.nativeDownloadAction||"").trim()});Array.isArray(c?.downloads)?e.managedDownloadsCache=c.downloads:await L(),await xe()}catch(c){o(c?.message||"Could not complete download action.","error")}return}const re=E.target.closest("[data-native-history-action]");if(re){const c=String(re.dataset.profileId||e.historyProfileId||e.currentProfileId),S=String(re.dataset.historyTime||""),I=(e.profileHistoryCache[c]||[]).findIndex(N=>String(N.visitedAt||"")===S),P=I>=0?(e.profileHistoryCache[c]||[])[I]:null;if(!P)return;if(re.dataset.nativeHistoryAction==="delete")e.profileHistoryCache[c].splice(I,1),C(),e.historyProfileId=c,he(k());else{const N=Z[c]?.partition||le.guest;R(P.url,N,P.title||"History",c)}return}const d=E.target.closest("[data-native-extension-action]");if(d){const c=String(d.dataset.nativeExtensionAction||"").trim(),S=String(d.dataset.extensionPath||"").trim();try{c==="more"&&window.api?.getExtensionShortcutsInfo?await ve(S):c==="reload"&&window.api?.reloadBrowserExtension?(await window.api.reloadBrowserExtension({path:S}),o("Extension reloaded.","success")):(c==="enable"||c==="disable")&&window.api?.toggleBrowserExtension?(c==="disable"&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.toggleBrowserExtension({path:S,enabled:c==="enable"})):c==="remove"&&window.api?.removeBrowserExtension&&(typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.removeBrowserExtension({path:S})),await y(),await xe()}catch(I){o(I?.message||"Could not complete extension action.","error")}}}),f.addEventListener("input",E=>{const A=E.target.closest("#nativeHistorySearchInput");if(A){const X=Number.isInteger(A.selectionStart)?A.selectionStart:null,te=Number.isInteger(A.selectionEnd)?A.selectionEnd:X;e.historySearchQuery=String(A.value||""),he(k()),M(X,te);return}const D=E.target.closest("input[name='nativePasswordProfile']");if(D){e.passwordProfileId=String(D.value||"");return}}),f.addEventListener("submit",async E=>{const A=E.target.closest("#nativePasswordForm");if(!A)return;E.preventDefault();const D=document.getElementById("nativePasswordDomainInput"),X=document.getElementById("nativePasswordUsernameInput"),te=document.getElementById("nativePasswordSecretInput");if(!D||!X||!te)return;const Q=String(D.value||"").trim().toLowerCase(),re=String(X.value||"").trim(),d=String(te.value||""),c=e.passwordProfileId||e.currentProfileId||"guest";if(!Q||!re||!d){o("Please fill in all fields.","error");return}try{if(!window.api?.saveProfileCredential){o("Credential API unavailable.","error");return}const S=await window.api.saveProfileCredential({profileId:c,domain:Q,username:re,password:d});if(!S||!S.success){o("Failed to save credential.","error");return}await Je(),o("Credential saved successfully.","success"),A.reset(),he(k())}catch(S){o(S?.message||"Could not save credential.","error")}}),f.addEventListener("click",async E=>{const A=E.target.closest(".password-action-btn");if(!A)return;const D=String(A.dataset.action||"").trim(),X=A.closest(".password-item"),te=String(X?.dataset.key||""),[Q,re]=te.split(":"),d=Number(re);if(!Q||Number.isNaN(d))return;const S=((e.credentialCache||{})[Q]||[])[d];if(S)try{if(D==="delete"){if(!window.api?.deleteProfileCredential){o("Credential API unavailable.","error");return}const I=await window.api.deleteProfileCredential({profileId:Q,domain:String(S.domain||"").toLowerCase(),username:String(S.username||"")});if(!I||!I.success){o("Failed to delete credential.","error");return}await Je(),o("Credential deleted successfully.","success"),he(k())}else if(D==="edit"){const I=document.getElementById("nativePasswordDomainInput"),P=document.getElementById("nativePasswordUsernameInput"),N=document.getElementById("nativePasswordSecretInput"),z=document.getElementById("nativePasswordProfileSelect");if(!I||!P||!N)return;e.passwordProfileId=Q,I.value=String(S.domain||"").toLowerCase(),P.value=String(S.username||""),N.value=String(S.password||""),z&&(z.innerHTML=Object.entries(Z||{}).map(([a,w])=>`
                <label class="profile-pill-item ${a===Q?"active":""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${t(a)}" ${a===Q?"checked":""} style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${t(w.color||"#000")}"></span>
                  <span>${t(w.name||"")}</span>
                </label>
              `).join(""),z.addEventListener("change",a=>{const w=a.target.value;w&&(e.passwordProfileId=w)})),document.getElementById("nativePasswordForm")?.scrollIntoView({behavior:"smooth"}),I.focus()}}catch(I){o(I?.message||"Could not complete password action.","error")}})}function it(){document.addEventListener("keydown",f=>{nt(f.target)||f.ctrlKey&&((f.key==="H"||f.key==="h")&&!f.shiftKey?(f.preventDefault(),$e("history")):(f.key==="E"||f.key==="e")&&!f.shiftKey?(f.preventDefault(),$e("extensions")):(f.key==="D"||f.key==="d")&&f.shiftKey&&(f.preventDefault(),$e("downloads")))})}async function ve(f=""){const M=document.getElementById("extensionDetailsModal"),E=document.getElementById("extensionDetailsCloseBtn"),A=document.getElementById("extensionDetailsContent"),D=document.getElementById("extensionDetailsTitle");if(!(!M||!A))try{const X=await window.api?.getExtensionShortcutsInfo?.({path:f});if(!X?.success)A.innerHTML='<div class="extension-details-empty">Unable to load extension details.</div>';else{const{name:te,shortcuts:Q,errors:re,conflicts:d}=X;D.textContent=`${t(te||"Extension")} Details`;let c="";Q&&Q.length>0?c=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-shortcuts-list">
                ${Q.map(P=>`
                      <div class="extension-shortcut-item">
                        <span class="extension-shortcut-key">${t(P.originalKey||P.key)}</span>
                        <span class="extension-shortcut-desc">${t(P.description||"No description")}</span>
                        <span class="extension-shortcut-status ${P.isActive?"active":"conflict"}">
                          ${P.isActive?"✓ Active":"⚠ Conflict"}
                        </span>
                      </div>
                    `).join("")}
              </div>
            </div>
          `:c=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-details-empty">No keyboard shortcuts defined.</div>
            </div>
          `;let S="";re&&re.length>0&&(S=`
            <div class="extension-details-section">
              <h4>Issues</h4>
              <div class="extension-errors-list">
                ${re.map(P=>`
                      <div class="extension-error-item">
                        <div class="extension-error-type">${t(P.type)}</div>
                        <div class="extension-error-message">${t(P.message)}</div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `);let I="";d&&d.length>0&&(I=`
            <div class="extension-details-section">
              <h4>Shortcut Conflicts</h4>
              <div class="extension-conflicts-list">
                ${d.map(P=>`
                      <div class="extension-conflict-item">
                        <div class="extension-conflict-key">${t(P.key)}</div>
                        <div class="extension-conflict-extensions">
                          <strong>Conflicting with:</strong><br/>
                          ${P.conflictingExtensions.map(N=>`${t(N.name)}`).join("<br/>")}
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `),A.innerHTML=`${c}${S}${I}`}M.classList.remove("hidden"),E&&(E.onclick=()=>{M.classList.add("hidden")})}catch(X){console.error("Failed to load extension details:",X),A.innerHTML='<div class="extension-details-empty">Error loading extension details.</div>',M.classList.remove("hidden")}}return{bindSettingsShortcutsGlobal:it,createNativePageDescriptor:Oe,ensureNativeSettingsGeneralInfo:Ke,getSettingsTabTitle:Se,getSettingsShortcut:ke,initNativeSettingsUi:ot,initSettingsMenu:Xe,isEditableShortcutTarget:nt,isNativeSettingsTab:ce,normalizeSettingsSection:se,openSettingsTab:$e,refreshActiveNativeSettingsPage:xe,renderNativeSettingsPage:he,updateNativeSettingsTabSection:Fe}}function Li({state:e,constants:n,escapeHtml:t,showToast:o,openOverlayModal:r,closeOverlayModal:u,getActiveTab:v,getActiveWebview:x,createTab:B,refreshActiveNativeSettingsPage:L,closeSettingsMenu:y}){const{PROFILES:C,PENDING_EXTENSION_OPEN_STORAGE_KEY:k,EXTENSION_PIN_STORAGE_KEY:$}=n;let R=!1,F=null,W=null,Z={visible:!1,id:"",message:"",actionLabel:"",action:""},le={},q={entryPath:""},se=!1;async function Se(){if(!window.api?.listBrowserExtensions)return e.browserExtensionsCache=[],e.browserExtensionsCache;const a=await window.api.listBrowserExtensions(),w=Array.isArray(a?.entries)?a.entries:[];return e.browserExtensionsCache=w.map(m=>{const p=(m.id||"guest").toLowerCase(),b=n.APP_PROTOCOL_SCHEME||"oneview-dev",O=String(m.path||"").trim().replace(/\\/g,"/").replace(/\/+$/,""),Y=`file:///${O}`,K=de=>{if(!de||!de.toLowerCase().startsWith("file://"))return de;const we=de.replace(/\\/g,"/"),ue=decodeURI(we);let ge=ue.replace(Y,"").replace(/^\/+/,"");if(ge===ue){const pe=`/${O.split("/").pop()}/`,J=ue.indexOf(pe);J!==-1?ge=ue.slice(J+pe.length):ge=""}const ie=m.manifest?.entrypoints?.root||m.manifest?.entrypoints?.page||"index.html";return`${b}://${p}/${ge||ie}`};return{...m,rootUrl:K(m.rootUrl),optionsUrl:K(m.optionsUrl),popupUrl:K(m.popupUrl),sidePanelUrl:K(m.sidePanelUrl)}}),e.browserExtensionsCache}async function ke(){let a="";try{a=String(sessionStorage.getItem(k)||"").trim()}catch{a=""}if(!a)return;try{sessionStorage.removeItem(k)}catch{}const w=e.browserExtensionsCache.find(m=>m.path===a);w&&await E(w.path,"tab")}function nt(){try{const a=JSON.parse(localStorage.getItem($)||"{}");le=a&&typeof a=="object"&&!Array.isArray(a)?a:{}}catch{le={}}}function Oe(){try{localStorage.setItem($,JSON.stringify(le||{}))}catch{}}function ee(){return v()?.partition||C[e.currentProfileId]?.partition||C.guest.partition}function ce(){const a=v(),w=x();return{url:String(w?.getURL?.()||a?.url||"").trim(),title:String(w?.getTitle?.()||a?.title||"").trim()}}function Ke(a={}){return String(a?.name||a?.actionTitle||"EX").trim().split(/\s+/).slice(0,2).map(m=>m.charAt(0)).join("").toUpperCase()}function Le(a={}){return String(a?.actionTitle||a?.name||"Extension").trim()}function Ce(a={},w=""){const m=String(a?.path||"").trim(),p=String(w||"").trim().replace(/\\/g,"/");if(!m||!p)return"";const b=m.replace(/\\/g,"/").replace(/\/+$/,""),O=p.replace(/^\/+/,""),Y=`${b}/${O}`;return`file:///${encodeURI(Y.replace(/^([A-Za-z]):/,"$1:"))}`}function Pe(a={}){return le[String(a?.path||"").trim()]===!0}function Ge(a={}){const w=(a?.id||"guest").toLowerCase(),m=a?.manifest?.entrypoints?.root||a?.manifest?.entrypoints?.page||"index.html";return`${n.APP_PROTOCOL_SCHEME}://${w}/${m}`}function Ve(a={},w=""){const m=String(a?.actionIconFileUrl||Ce(a,a?.actionIconPath||"")||a?.actionIconUrl||"").trim(),p=t(Ke(a));return m?`<img src="${t(m)}" alt="" />`:`<span class="${w}">${p}</span>`}function Re(a=0){const w=Number(a||0);return w>=1024*1024*1024?`${(w/(1024*1024*1024)).toFixed(1)} GB`:w>=1024*1024?`${(w/(1024*1024)).toFixed(1)} MB`:w>=1024?`${(w/1024).toFixed(1)} KB`:`${Math.max(0,Math.round(w))} B`}function je(a=0){const w=Number(a||0);return w<=0?"":`${Re(w)}/s`}function Je(a=null){const w=Number(a);if(!Number.isFinite(w)||w<0)return"";if(w<60)return`${Math.round(w)}s left`;const m=Math.floor(w/60),p=Math.round(w%60);return`${m}m ${p}s left`}function he(a=""){return e.managedDownloadsCache.find(w=>w.id===a)||null}function xe(){const a=document.getElementById("downloadsManagerBtn");a&&(a.classList.remove("has-download-highlight"),a.offsetWidth,a.classList.add("has-download-highlight"),F&&clearTimeout(F),F=setTimeout(()=>{a.classList.remove("has-download-highlight")},2300))}async function Fe(){if(!window.api?.listManagedDownloads)return e.managedDownloadsCache=[],e.managedDownloadsCache;const a=await window.api.listManagedDownloads();return e.managedDownloadsCache=Array.isArray(a?.downloads)?a.downloads:[],e.managedDownloadsCache}function $e(){const a=document.getElementById("downloadsManagerPanel"),w=document.getElementById("downloadsManagerBtn");a&&!a.classList.contains("hidden")&&(R?u(()=>a.classList.add("hidden")):a.classList.add("hidden")),R=!1,w&&w.classList.remove("is-active")}function Xe(){const a=document.getElementById("downloadsManagerPanel"),w=document.getElementById("downloadsManagerBadge");if(!a)return;const m=e.managedDownloadsCache.filter(p=>p.state==="progressing"||p.state==="interrupted").length;w&&(m>0?(w.textContent=String(m),w.classList.remove("hidden")):(w.textContent="",w.classList.add("hidden"))),a.innerHTML=`
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${e.managedDownloadsCache.length?e.managedDownloadsCache.map(p=>{const b=t(p.fileName||"Download"),O=String(p.state||"progressing"),Y=typeof p.progress=="number"?Math.max(0,Math.min(100,p.progress)):0,K=p.totalBytes>0?`${Re(p.receivedBytes)} / ${Re(p.totalBytes)}`:Re(p.receivedBytes),de=je(p.bytesPerSecond),we=Je(p.etaSeconds),ue=O==="completed"?"Completed":O==="cancelled"?"Cancelled":O==="interrupted"?"Interrupted":p.paused?"Paused":`Downloading ${Y}%`,ge=[de,we].filter(Boolean).join(" • ");return`
                    <div class="downloads-manager-item">
                      <strong>${b}</strong>
                      <div class="downloads-manager-meta">${t(ue)} • ${t(K)}</div>
                      ${ge?`<div class="downloads-manager-meta">${t(ge)}</div>`:""}
                      <div class="downloads-manager-progress">
                        <span style="width:${Y}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${O==="progressing"?p.paused?`<button type="button" data-download-id="${t(p.id)}" data-download-action="resume">Resume</button>`:`<button type="button" data-download-id="${t(p.id)}" data-download-action="pause">Pause</button>`:""}
                        ${O==="progressing"||O==="interrupted"?`<button type="button" data-download-id="${t(p.id)}" data-download-action="cancel">Cancel</button>`:""}
                        ${O==="interrupted"||O==="cancelled"?`<button type="button" data-download-id="${t(p.id)}" data-download-action="retry">Retry</button>`:""}
                        ${p.savePath?`<button type="button" data-download-id="${t(p.id)}" data-download-action="show">Show in Folder</button>`:""}
                        ${O==="completed"&&p.existsOnDisk?`<button type="button" data-download-id="${t(p.id)}" data-download-action="open">Open</button>`:""}
                         <button type="button" data-download-id="${t(p.id)}" data-download-action="remove">Delete</button>
                      </div>
                    </div>
                  `}).join(""):'<div class="downloads-manager-empty">No downloads yet.</div>'}
      </div>
    `}async function ot(a=null){const w=document.getElementById("downloadsManagerPanel"),m=document.getElementById("downloadsManagerBtn");if(!w||!m)return;if(!(a===null?w.classList.contains("hidden"):!!a)){$e();return}f(),Xe();try{await r(()=>w.classList.remove("hidden"),{captureSnapshots:!1}),R=!0}catch{w.classList.remove("hidden"),R=!1}m.classList.add("is-active")}function it(){let a=document.getElementById("downloadsShelf");a||(a=document.createElement("div"),a.id="downloadsShelf",a.className="downloads-shelf hidden",a.innerHTML=`
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `,document.body.appendChild(a),a.querySelector("#downloadsShelfClose")?.addEventListener("click",()=>{Z.visible=!1,it()}),a.querySelector("#downloadsShelfAction")?.addEventListener("click",async()=>{const b=he(Z.id);!b||!Z.action||!window.api?.runManagedDownloadAction||await window.api.runManagedDownloadAction({id:b.id,action:Z.action})}));const w=a.querySelector("#downloadsShelfTitle"),m=a.querySelector("#downloadsShelfMessage"),p=a.querySelector("#downloadsShelfAction");if(!Z.visible){a.classList.add("hidden");return}w&&(w.textContent="Downloads"),m&&(m.textContent=Z.message||""),p&&(p.textContent=Z.actionLabel||"Open",p.style.display=Z.action?"":"none"),a.classList.remove("hidden")}function ve(a={},w="updated"){const m=String(a.fileName||"Download").trim()||"Download";if(w==="created")Z={visible:!0,id:String(a.id||""),message:`${m} started downloading`,actionLabel:"Show",action:"show"};else if(w==="completed")Z={visible:!0,id:String(a.id||""),message:`${m} downloaded`,actionLabel:"Open",action:"open"};else if(w==="interrupted")Z={visible:!0,id:String(a.id||""),message:`${m} was interrupted`,actionLabel:"Retry",action:"retry"};else return;it(),W&&clearTimeout(W),W=setTimeout(()=>{Z.visible=!1,it()},5e3)}function f(){const a=document.getElementById("browserExtensionsMenu"),w=document.getElementById("browserExtensionsMenuBtn");a&&!a.classList.contains("hidden")&&(se?u(()=>a.classList.add("hidden")):a.classList.add("hidden")),se=!1,w&&w.classList.remove("is-active")}async function M(a=null){const w=document.getElementById("browserExtensionsMenu"),m=document.getElementById("browserExtensionsMenuBtn");if(!w||!m)return;if(!(a===null?w.classList.contains("hidden"):!!a)){f();return}A().catch(()=>{}),re();try{await r(()=>w.classList.remove("hidden"),{captureSnapshots:!1}),se=!0}catch(b){console.error("Failed to open extensions menu overlay",b),w.classList.remove("hidden"),se=!1}m.classList.add("is-active")}async function E(a,w="tab"){const m=e.browserExtensionsCache.find(Y=>Y.path===a);if(!m)return;const p=(m?.id||"guest").toLowerCase();let b="";if(w==="options"&&m.optionsUrl){const Y=m.manifest?.entrypoints?.options||"options.html";b=`${n.APP_PROTOCOL_SCHEME}://${p}/${Y}`}else if(w==="root"&&m.rootUrl){const Y=m.manifest?.entrypoints?.root||"result.html";b=`${n.APP_PROTOCOL_SCHEME}://${p}/${Y}`}else b=Ge(m);if(!b){o("This extension does not expose an openable page yet.","info");return}const O=`ext-${m.id||"guest"}`;B(b,O,`${m.name||"Extension"}${w==="options"?" Options":""}`,null,{extensionEntryPath:m.path,extensionActiveContext:ce()})}async function A(){if(window.api?.closeBrowserExtensionPopup)try{await window.api.closeBrowserExtensionPopup()}catch{}q={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(a=>a.classList.remove("is-active"))}function D(a={}){const w=document.getElementById("browserExtensionPopupTitle"),m=document.getElementById("browserExtensionPopupSubtitle"),p=document.getElementById("browserExtensionPopupIcon");w&&(w.textContent=Le(a)),m&&(m.textContent=a?.popupUrl?"Popup":a?.optionsUrl?"Extension page":a?.rootUrl?"Extension":""),p&&(p.innerHTML=Ve(a,"browser-extension-popup-fallback"))}function X(a){if(!a||typeof a.getBoundingClientRect!="function")return{left:0,top:0,bottom:0,width:0,height:0};const w=a.getBoundingClientRect();return{left:Number(w.left||0),top:Number(w.top||0),bottom:Number(w.bottom||0),width:Number(w.width||0),height:Number(w.height||0)}}async function te(a,w=null){const m=e.browserExtensionsCache.find(we=>we.path===a);if(!m)return;const p=String(m.popupUrl||"").trim()||String(m.optionsUrl||"").trim();if(!p){await E(a,"tab");return}if(q.entryPath===a){await A();return}await A(),f();const b=window.api?.openBrowserExtensionPopup;if(typeof b!="function")throw new Error("Extension popup API is unavailable");const O=ce(),Y=`ext-${m.id||"guest"}`,K=await b({url:p,entryPath:a,partition:Y,anchor:X(w),activeUrl:O.url||"",activeTitle:O.title||""});if(!K?.success)throw new Error(K?.message||"Could not open extension popup");D(m),q={entryPath:a,pageType:"popup",host:null,overlayActive:!1};const de=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(a):a.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${de}"]`).forEach(we=>we.classList.add("is-active"))}function Q(){const a=document.getElementById("browserExtensionsPinned");if(!a)return;const w=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(b=>{const O=b.id==="sitesnap-studio"||String(b.name||"").toLowerCase().includes("sitesnap")||String(b.id||"").toLowerCase().includes("sitesnap");return w?b.enabled!==!1&&O:b.enabled!==!1&&!O}),p=w?m:m.filter(b=>Pe(b));if(!p.length){a.innerHTML="",a.classList.add("hidden");return}a.classList.remove("hidden"),a.innerHTML=p.map(b=>`
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${t(b.path||"")}"
            title="${t(Le(b))}"
            aria-label="${t(Le(b))}"
          >
            ${Ve(b,"browser-extension-action-fallback")}
          </button>
        `).join("")}function re(){const a=document.getElementById("browserExtensionsMenu");if(!a)return;const w=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(p=>{const b=p.id==="sitesnap-studio"||String(p.name||"").toLowerCase().includes("sitesnap")||String(p.id||"").toLowerCase().includes("sitesnap");return w?p.enabled!==!1&&b:p.enabled!==!1&&!b});a.innerHTML=`
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${m.length?m.map(p=>{const b=t(p.path||""),O=t(Le(p)),Y=t(p.version?`v${p.version}${p.id?` • ${p.id}`:""}`:p.id||p.name||"");return`
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${Ve(p,"browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${O}</strong>
                          <p>${Y}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${b}"
                          title="${Pe(p)?"Unpin":"Pin"}"
                          aria-label="${Pe(p)?"Unpin":"Pin"}"
                        >
                          ${Pe(p)?"Unpin":"Pin"}
                        </button>
                      </div>
                      <div class="browser-extension-menu-actions">
                        <button type="button" data-menu-action="popup" data-path="${b}">
                          ${p.popupUrl?"Open Popup":"Open"}
                        </button>
                        ${p.optionsUrl?`<button type="button" data-menu-action="options" data-path="${b}">Options</button>`:""}
                        ${p.rootUrl?`<button type="button" data-menu-action="tab" data-path="${b}">Open in Tab</button>`:""}
                      </div>
                    </div>
                  `}).join(""):'<div class="browser-extensions-empty">No enabled extensions yet.</div>'}
      </div>
    `}function d(){Q(),re()}function c(){const a=document.getElementById("extensionsManagerList");if(!a)return;const w=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(p=>{const b=p.id==="sitesnap-studio"||String(p.name||"").toLowerCase().includes("sitesnap")||String(p.id||"").toLowerCase().includes("sitesnap");return w?b:!b});if(!m.length){a.innerHTML=`
        <div class="extensions-empty-state">
          No unpacked extensions added yet.
        </div>
      `;return}a.innerHTML=m.map(p=>{const b=t(p.path||"");return`
          <div class="extension-item ${p.enabled===!1?"is-disabled":""}">
            <div class="extension-main">
              <div class="extension-title-row">
                <h4>${t(p.name||"Unnamed Extension")}</h4>
                <span class="extension-badge ${p.customBridge?"custom":"normal"}">
                  ${p.customBridge?"OneView":"Legacy"}
                </span>
                ${p.enabled===!1?'<span class="extension-status-pill">Disabled</span>':""}
              </div>
              <div class="extension-meta-row">
                ${p.version?`<span>v${t(p.version)}</span>`:""}
                ${p.id?`<span>${t(p.id)}</span>`:""}
              </div>
              ${n.IS_DEV_APP_BUILD?`<div class="extension-path">${b}</div>`:""}
              ${p.loadError?`<div class="extension-error">${t(p.loadError)}</div>`:""}
            </div>
            <div class="extension-actions">
              ${p.popupUrl?`<button type="button" class="extension-action-btn" data-action="open-popup" data-path="${b}">Popup</button>`:""}
              ${p.rootUrl||p.linkUrl?`<button type="button" class="extension-action-btn" data-action="open-tab" data-path="${b}">Open Tab</button>`:""}
              ${p.optionsUrl?`<button type="button" class="extension-action-btn" data-action="open-options" data-path="${b}">Options</button>`:""}
              <button type="button" class="extension-action-btn" data-action="reload" data-path="${b}">
                Reload
              </button>
              <button type="button" class="extension-action-btn" data-action="toggle" data-path="${b}">
                ${p.enabled===!1?"Enable":"Disable"}
              </button>
              ${n.IS_DEV_APP_BUILD?`<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${b}">Remove</button>`:""}
            </div>
          </div>
        `}).join("")}async function S(){try{await Se()}catch(a){console.error("Failed to refresh browser extensions list",a)}c(),d()}async function I(a,w){const m=e.browserExtensionsCache.find(b=>b.path===a);if(!m)return;const p=w==="options"?m.optionsUrl:w==="root"?m.rootUrl:Ge(m);if(!p){o(`This extension does not expose a ${w} page.`,"info");return}B(p,ee(),`${m.name||"Extension"} ${w==="options"?"Options":"Popup"}`,null,{extensionEntryPath:m.path,extensionActiveContext:ce()})}async function P(){const a=document.getElementById("extensionsManagerModal");if(a){f(),await A(),c(),d();try{await r(()=>a.classList.remove("hidden"))}catch(w){console.error("openOverlayModal failed for extensions manager",w),a.classList.remove("hidden")}S().catch(w=>{console.error("Failed to refresh extensions manager after open",w)})}}function N(){const a=document.getElementById("extensionsManagerModal");a&&u(()=>a.classList.add("hidden"))}function z(){const a=document.getElementById("extensionsBtn"),w=document.getElementById("settingsBtn"),m=document.getElementById("extensionsModalCloseBtn"),p=document.getElementById("extensionsLoadBtn"),b=document.getElementById("extensionsManagerList"),O=document.getElementById("browserExtensionsPinned"),Y=document.getElementById("browserExtensionsMenuBtn"),K=document.getElementById("browserExtensionsMenu"),de=document.getElementById("downloadsManagerBtn"),we=document.getElementById("downloadsManagerPanel"),ue=document.getElementById("browserExtensionPopupClose"),ge=document.getElementById("browserExtensionPopupOpenTab");nt(),c(),d(),S().catch(ie=>{console.error("Failed to refresh extensions manager after open",ie)}),Se().then(()=>{if(ke(),window.api?.prewarmBrowserExtensionPopup){const ne=e.browserExtensionsCache.filter(J=>J.enabled!==!1).filter(J=>Pe(J));let pe={partition:ee()};if(ne.length>0){const J=ne[0],fe=String(J.popupUrl||"").trim()||String(J.optionsUrl||"").trim();fe&&(pe={...pe,url:fe,entryPath:J.path})}window.api.prewarmBrowserExtensionPopup(pe).catch(()=>{})}}).catch(()=>{}),window.api?.onBrowserExtensionPopupState&&window.api.onBrowserExtensionPopupState(ie=>{const{entryPath:ne,open:pe}=ie||{};if(pe){q={entryPath:ne,pageType:"popup",host:null,overlayActive:!1};const J=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(ne):ne.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${J}"]`).forEach(fe=>fe.classList.add("is-active"))}else q.entryPath===ne&&(q={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(J=>J.classList.remove("is-active")))}),a&&a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",()=>{P().catch(ie=>{console.error("Failed to open extensions manager",ie),o("Could not open extensions manager.","error")})})),m&&m.dataset.boundClick!=="1"&&(m.dataset.boundClick="1",m.addEventListener("click",N)),p&&p.dataset.boundClick!=="1"&&(p.dataset.boundClick="1",p.addEventListener("click",async()=>{try{if(!window.api?.addBrowserExtensionsUnpacked){o("Extension manager API is unavailable.","error");return}const ie=await window.api.addBrowserExtensionsUnpacked();e.browserExtensionsCache=Array.isArray(ie?.entries)?ie.entries:[],c(),d(),o("Unpacked extensions loaded.","success")}catch(ie){console.error("Failed to load unpacked extensions",ie),o(ie?.message||"Could not load unpacked extensions.","error")}})),b&&b.dataset.boundClick!=="1"&&(b.dataset.boundClick="1",b.addEventListener("click",async ie=>{const ne=ie.target.closest("[data-action]");if(!ne)return;const pe=String(ne.dataset.action||"").trim(),J=String(ne.dataset.path||"").trim();if(J)try{if(pe==="open-popup"){await I(J,"popup");return}if(pe==="open-tab"){await I(J,"tab");return}if(pe==="open-options"){await I(J,"options");return}if(pe==="reload"&&window.api?.reloadBrowserExtension){const fe=await window.api.reloadBrowserExtension({path:J});e.browserExtensionsCache=Array.isArray(fe?.entries)?fe.entries:e.browserExtensionsCache,c(),d(),o("Extension reloaded.","success");return}if(pe==="toggle"&&window.api?.toggleBrowserExtension){const fe=e.browserExtensionsCache.find(vt=>vt.path===J);fe?.enabled!==!1&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const ct=await window.api.toggleBrowserExtension({path:J,enabled:fe?.enabled===!1});e.browserExtensionsCache=Array.isArray(ct?.entries)?ct.entries:e.browserExtensionsCache,c(),d(),o("Extension state updated.","success");return}if(pe==="remove"&&window.api?.removeBrowserExtension){typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const fe=await window.api.removeBrowserExtension({path:J});e.browserExtensionsCache=Array.isArray(fe?.entries)?fe.entries:e.browserExtensionsCache,c(),d(),o("Extension removed.","success")}}catch(fe){console.error("Extension manager action failed",fe),o(fe?.message||"Could not complete extension action.","error")}})),O&&O.dataset.boundClick!=="1"&&(O.dataset.boundClick="1",O.addEventListener("click",async ie=>{const ne=ie.target.closest("[data-path]");if(!ne)return;const pe=String(ne.dataset.path||"").trim();if(pe)try{await te(pe,ne)}catch(J){console.error("Failed to open extension popup",J),o(J?.message||"Could not open extension popup.","error")}})),Y&&Y.dataset.boundClick!=="1"&&(Y.dataset.boundClick="1",Y.addEventListener("click",()=>{M().catch(ie=>{console.error("Failed to toggle extensions menu",ie),o("Could not open extensions menu.","error")})})),K&&K.dataset.boundClick!=="1"&&(K.dataset.boundClick="1",K.addEventListener("click",async ie=>{const ne=ie.target.closest("[data-menu-action]");if(!ne)return;const pe=String(ne.dataset.menuAction||"").trim(),J=String(ne.dataset.path||"").trim();try{if(pe==="manage"){f(),await P();return}if(!J)return;if(pe==="pin"){const fe=!le[J];le[J]=fe,Oe(),d();return}if(pe==="popup"){await te(J,Y||ne);return}if(pe==="options"){f(),await E(J,"options");return}pe==="tab"&&(f(),await E(J,"tab"))}catch(fe){console.error("Extension menu action failed",fe),o(fe?.message||"Could not complete extension action.","error")}})),ue&&ue.dataset.boundClick!=="1"&&(ue.dataset.boundClick="1",ue.addEventListener("click",()=>{A().catch(()=>{})})),ge&&ge.dataset.boundClick!=="1"&&(ge.dataset.boundClick="1",ge.addEventListener("click",async()=>{q.entryPath&&(await E(q.entryPath,"tab"),await A())})),document.body&&document.body.dataset.boundExtensionUiDismiss!=="1"&&(document.body.dataset.boundExtensionUiDismiss="1",document.addEventListener("click",ie=>{const ne=ie.target;w&&!w.contains(ne)&&y(),K&&!K.classList.contains("hidden")&&!K.contains(ne)&&!Y?.contains(ne)&&!a?.contains(ne)&&f(),we&&!we.classList.contains("hidden")&&!we.contains(ne)&&!de?.contains(ne)&&$e(),!ne.closest(".browser-extension-action-btn")&&!K?.contains(ne)&&A().catch(()=>{})}),document.addEventListener("keydown",ie=>{ie.key==="Escape"&&(y(),f(),$e(),A().catch(()=>{}))}))}function V(){const a=document.getElementById("downloadsManagerBtn"),w=document.getElementById("downloadsManagerPanel");a&&a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",()=>{ot().catch(()=>{})})),w&&w.dataset.boundClick!=="1"&&(w.dataset.boundClick="1",w.addEventListener("click",async m=>{const p=m.target.closest("[data-download-action]");if(!p)return;const b=String(p.dataset.downloadAction||"").trim(),O=String(p.dataset.downloadId||"").trim();if(b)try{if(!window.api?.runManagedDownloadAction)return;const Y=await window.api.runManagedDownloadAction({id:O,action:b});Array.isArray(Y?.downloads)?e.managedDownloadsCache=Y.downloads:(b==="remove"||b==="clear-completed")&&await Fe(),Xe()}catch(Y){o(Y?.message||"Could not complete download action.","error")}})),Fe().then(()=>{Xe()}).catch(()=>{}),window.api&&typeof window.api.onDownloadManagerUpdated=="function"&&document.body?.dataset.boundDownloadManagerEvents!=="1"&&(document.body.dataset.boundDownloadManagerEvents="1",window.api.onDownloadManagerUpdated(m=>{e.managedDownloadsCache=Array.isArray(m?.downloads)?m.downloads:[],Xe(),L().catch(()=>{}),(m?.reason==="created"||m?.reason==="completed"||m?.reason==="interrupted")&&xe();const p=he(String(m?.focusId||"").trim());p&&ve(p,String(m?.reason||"updated"))}))}return{closeBrowserExtensionPopup:A,closeBrowserExtensionsMenu:f,closeDownloadsManagerPanel:$e,formatDownloadBytes:Re,formatDownloadEta:Je,formatDownloadSpeed:je,initDownloadsManager:V,initExtensionsManager:z,loadManagedDownloadsFromMain:Fe,refreshBrowserExtensionsUi:d,refreshExtensionsManagerList:S}}function Pi({state:e,constants:n,showToast:t,openOverlayModal:o,closeOverlayModal:r,renderProfilePillSelect:u,resolveCredentialScopeIdForTab:v,applyProfileSelection:x,getCurrentProfileId:B,escapeHtml:L}){const{AUTH_GATEWAY_HOSTS:y,RESOURCE_SERVICE_ORIGIN:C}=n,k=()=>e.activeTabId,$=()=>e.credentialCache,R=d=>{e.credentialCache=d},F=()=>e.activeHttpAuthChallenge,W=d=>{e.activeHttpAuthChallenge=d},Z=()=>e.credentialCacheRefreshedAt,le=d=>{e.credentialCacheRefreshedAt=d},q=()=>e.credentialCacheRefreshInFlight,se=d=>{e.credentialCacheRefreshInFlight=d},Se=new Map;function ke(){return{wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]}}function nt(){return Object.keys(ke())}function Oe(){return!!(window.api&&typeof window.api.listProfileCredentials=="function"&&typeof window.api.saveProfileCredential=="function"&&typeof window.api.deleteProfileCredential=="function")}function ee(d=""){const c=String(d).trim().toLowerCase();if(!c)return"";try{const N=new URL(c),z=String(N.hostname||"").trim().toLowerCase().replace(/^www\./,""),V=String(N.port||"").trim();return z?!V||V==="80"||V==="443"?z:`${z}:${V}`:""}catch{}const S=c.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];if(!S)return"";const I=S.lastIndexOf(":");if(I<=0)return S;const P=S.slice(I+1);return/^\d+$/.test(P)&&P!=="80"&&P!=="443"?S:S.slice(0,I)}function ce(d=""){const c=String(d||"").trim().toLowerCase();if(!c)return"";const S=c.lastIndexOf(":");if(S<=0)return c;const I=c.slice(S+1);return/^\d+$/.test(I)?c.slice(0,S):c}function Ke(d=""){const c=[];try{const S=new URL(String(d||"")),I=(N="")=>{if(N)try{const z=new URL(String(N)),V=ee(z.host||z.hostname||"");V&&c.push(V)}catch{const V=ee(String(N||""));V&&c.push(V)}};I(S.host||S.hostname||""),["retURL","retUrl","returnUrl","TargetResource","targetResource","PartnerSpId","partnerSpId"].forEach(N=>{I(S.searchParams.get(N)||"")})}catch{}return[...new Set(c.filter(Boolean))]}function Le(d=""){const c=Ke(d);if(c.length===0)return ee(d);const S=c[0]||"";if(y.has(S)){const I=c.find(P=>P&&!y.has(P));if(I)return I}return S}function Ce(d=""){return y.has(ee(d))}function Pe(d=""){const c=ce(ee(d));return c.endsWith(".veevavault.com")||c==="veevavault.com"||c.endsWith(".gskinternet.com")||c==="gskinternet.com"||c.endsWith(".gskpro.com")||c==="gskpro.com"}function Ge(d,c,S=""){const I=String(c||"").trim().toLowerCase(),P=ee(S);if(!d||!I)return null;const N=($()[d]||[]).filter(z=>{const V=ee(z.domain);return V&&V!==P&&!Ce(V)&&Pe(V)&&String(z.username||"").trim().toLowerCase()===I});return N.sort((z,V)=>ee(V.domain).length-ee(z.domain).length),N[0]||null}function Ve(d=""){const c=String(d||"").trim();return/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(c)?"":c}async function Re(){if(!window.api?.deleteProfileCredential)return;const d=[];nt().forEach(c=>{($()[c]||[]).forEach(S=>{const I=ee(S.domain);!Ce(I)||!Ge(c,S.username,I)||d.push({profileId:c,domain:I,username:String(S.username||"").trim()})})}),d.length!==0&&(await Promise.allSettled(d.map(c=>window.api.deleteProfileCredential(c))),d.forEach(c=>{const S=$()[c.profileId]||[];$()[c.profileId]=S.filter(I=>!(ee(I.domain)===c.domain&&String(I.username||"").trim().toLowerCase()===c.username.toLowerCase()))}))}async function je(){if(!Oe())return R(ke()),$();try{const d=await window.api.listProfileCredentials();if(!d||!d.success||!Array.isArray(d.data))return R(ke()),$();const c=ke();return d.data.forEach(S=>{const I=String(S.profileId||"").toLowerCase();c[I]&&c[I].push({profileId:I,domain:ee(S.domain),username:String(S.username||""),password:String(S.password||"")})}),R(c),await Re(),$()}catch{return R(ke()),$()}}async function Je(d=15e3){if(!Oe()||Date.now()-Z()<d)return $();if(q())return q();const S=je().then(I=>(le(Date.now()),I)).finally(()=>{se(null)});return se(S),S}function he(d){return d?(d.credentialHintsByDomain||(d.credentialHintsByDomain={}),d.credentialHintsByDomain):{}}function xe(d="",c=""){const S=`${String(d||"").toLowerCase()} ${String(c||"").toLowerCase()}`;if(/login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(S))return!0;try{const I=new URL(String(d||""));if(C&&I.origin.toLowerCase()===C){const N=String(I.pathname||"/").toLowerCase(),z=String(c||"").toLowerCase();if((N==="/"||N==="/login"||N==="/signin")&&z.includes("synapse"))return!0}const P=`${I.pathname.toLowerCase()} ${I.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(P)}catch{return!1}}function Fe(d=""){let c="";try{c=new URL(String(d||"")).hostname.toLowerCase()}catch{return!1}return c==="10.215.56.196"||c.endsWith(".gskinternet.com")||c.endsWith(".gskpro.com")||c.endsWith(".veevavault.com")||c.endsWith(".okta.com")||c.endsWith(".oktacdn.com")||c.endsWith(".pingone.com")}function $e(d="",c="",S=null){return!Oe()||!S?!1:S.launchedAppType==="website"||!S.launchedAppType?xe(d,c)||Fe(d):!0}function Xe(d,c=""){if(!d)return null;const S=Ke(c);if(S.length===0)return null;const I=$()[d]||[];let P=null,N=-1,z="";try{const V=ee(c);V&&(z=localStorage.getItem(`oneview:last-used-username:${d}:${V}`)||"")}catch{}return I.forEach(V=>{const a=ee(V.domain);if(!a)return;const w=S.reduce((p,b)=>{if(!b)return p;if(b===a)return Math.max(p,1e3);if(ce(b)===ce(a))return Math.max(p,900);if(b.endsWith(`.${a}`)||a.endsWith(`.${b}`))return Math.max(p,500);const O=ce(b),Y=ce(a);if(O.endsWith(`.${Y}`)||Y.endsWith(`.${O}`))return Math.max(p,450);const K=O.split(".").reverse(),de=Y.split(".").reverse();let we=0;for(let ue=0;ue<Math.min(K.length,de.length)&&K[ue]===de[ue];ue+=1)we+=1;return Math.max(p,we>1?we:-1)},-1);if(w<0)return;const m=z&&String(V.username||"").trim().toLowerCase()===z.trim().toLowerCase();(!P||w>N||w===N&&m||w===N&&!m&&a.length>ee(P.domain).length)&&(P=V,N=w)}),P}function ot(d,c="",S=null){const I=$()[d]||[];if(I.length===0)return null;let P="";try{P=ee(c)}catch{P=""}const N=he(S),z=Object.values(N||{}).map(b=>String(b||"").trim()).filter(Boolean),V=String(S?.lastUsernameHint||"").trim()||z[z.length-1]||"";if(P&&Ce(P)&&V){const b=Ge(d,V,P);if(b)return b}const a=Xe(d,c);if(a&&!Ce(a.domain))return a;if(!V)return null;const w=I.filter(b=>String(b.username||"").trim().toLowerCase()===V.toLowerCase());if(w.length===1)return a&&!Ce(w[0].domain)?a:w[0];if(w.length===0)return null;const m=P;if(!m)return w[0];const p=b=>{const O=ee(b);if(!O)return-1;if(Ce(O)&&Pe(m))return-100;if(Ce(m)&&!Ce(O))return 800+(Pe(O)?50:0);if(m===O)return 1e3;if(ce(m)===ce(O))return 900;if(m.endsWith(`.${O}`)||O.endsWith(`.${m}`))return 500;const Y=ce(m),K=ce(O);if(Y.endsWith(`.${K}`)||K.endsWith(`.${Y}`))return 450;const de=Y.split(".").reverse(),we=K.split(".").reverse();let ue=0;for(let ge=0;ge<Math.min(de.length,we.length)&&de[ge]===we[ge];ge+=1)ue+=1;return ue};return w.sort((b,O)=>p(O.domain)-p(b.domain)),w[0]||null}function it(d,c="",S=null){const I=ot(d,c,S);if(I)return{...I,profileId:String(I.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};const P=$()[d]||[];if(P.length===1)return{...P[0],profileId:String(P[0]?.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};let N="";try{N=ee(c)}catch{N=""}if(!N||P.length===0)return null;const z=w=>{const m=ee(w);if(!m)return-1;if(Ce(N)&&!Ce(m))return 800+(Pe(m)?50:0);if(Ce(m)&&Pe(N))return-100;if(N===m)return 1e3;if(ce(N)===ce(m))return 900;if(N.endsWith(`.${m}`)||m.endsWith(`.${N}`))return 500;const p=ce(N),b=ce(m);if(p.endsWith(`.${b}`)||b.endsWith(`.${p}`))return 450;const O=p.split(".").reverse(),Y=b.split(".").reverse();let K=0;for(let de=0;de<Math.min(O.length,Y.length)&&O[de]===Y[de];de+=1)K+=1;return K},a=[...P].sort((w,m)=>z(m.domain)-z(w.domain))[0]||null;return a?{...a,profileId:String(a.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()}:null}async function ve(d,c){if(!d||!c)return;const S=String(c.username||""),I=String(c.password||"");if(!I)return!1;const P=`
      (() => {
        const getContextDocuments = () => {
          const docs = [document];
          const iframes = Array.from(document.querySelectorAll("iframe"));
          iframes.forEach((frame) => {
            try {
              if (frame.contentDocument) docs.push(frame.contentDocument);
            } catch (_e) {}
          });
          return docs;
        };
        const visibleInputs = (doc) =>
          Array.from(doc.querySelectorAll("input")).filter((el) => {
            if (!el || el.disabled || el.type === "hidden") return false;
            const win =
              el.ownerDocument && el.ownerDocument.defaultView
                ? el.ownerDocument.defaultView
                : window;
            const s = win.getComputedStyle(el);
            return s && s.display !== "none" && s.visibility !== "hidden";
          });
        const isPasswordLike = (el) => {
          if (!el) return false;
          const isMasked = el.style.webkitTextSecurity === "disc" || el.style.getPropertyValue("-webkit-text-security") === "disc";
          const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return el.type === "password" || isMasked || /password|passwd|pwd/.test(bag) || /current-password|new-password/.test(String(el.autocomplete || "").toLowerCase());
        };
        const isOtpLike = (el) => {
          if (!el) return false;
          const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return /otp|one\\s*time|verification\\s*code|authenticator|token|mfa|2fa|tfa|pin/.test(bag);
        };
        const isUserLike = (el) => {
          if (!el) return false;
          const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return el.type === "email" || /user|login|email|identifier|account/.test(bag) || /username|email/.test(String(el.autocomplete || "").toLowerCase());
        };

        const docs = getContextDocuments();
        let passField = null;
        let userField = null;
        const isLoginPage = /login|signin|sign-in|log-in|sso|auth|oauth|account|session/.test(window.location.href.toLowerCase());

        docs.some((doc) => {
          const inputs = visibleInputs(doc);
          const pass = inputs.find((el) => isPasswordLike(el) && !isOtpLike(el));
          if (pass) {
            passField = pass;
            userField =
              inputs.find((el) => !isPasswordLike(el) && isUserLike(el)) ||
              inputs.find((el) => !isPasswordLike(el) && (el.type === "text" || el.type === "email" || el.type === "tel")) ||
              null;
            return true;
          }
          return false;
        });

        if (!passField && isLoginPage) {
          docs.some((doc) => {
            const inputs = visibleInputs(doc);
            const user = inputs.find((el) => !isPasswordLike(el) && isUserLike(el));
            if (user) {
              userField = user;
              return true;
            }
            return false;
          });
        }

        const setNativeValue = (el, value) => {
          if (!el) return;
          const proto =
            el.tagName === "TEXTAREA"
              ? window.HTMLTextAreaElement?.prototype
              : window.HTMLInputElement?.prototype;
          const descriptor = proto
            ? Object.getOwnPropertyDescriptor(proto, "value")
            : null;
          if (descriptor && typeof descriptor.set === "function") {
            descriptor.set.call(el, value);
            return;
          }
          el.value = value;
        };
        const fire = (el) => {
          const Evt =
            (el.ownerDocument && el.ownerDocument.defaultView && el.ownerDocument.defaultView.Event) ||
            Event;
          const InputEvt =
            (el.ownerDocument && el.ownerDocument.defaultView && el.ownerDocument.defaultView.InputEvent) ||
            null;
          el.dispatchEvent(new Evt("input", { bubbles: true }));
          if (InputEvt) {
            el.dispatchEvent(new InputEvt("input", {
              bubbles: true,
              inputType: "insertText",
              data: String(el.value || ""),
            }));
          }
          el.dispatchEvent(new Evt("change", { bubbles: true }));
          el.dispatchEvent(new Evt("blur", { bubbles: true }));
        };

        window.__oneviewAutofillApplying = true;
        try {
          if (${JSON.stringify(!!S)} && userField) {
            userField.focus();
            setNativeValue(userField, ${JSON.stringify(S)});
            fire(userField);
          }
          if (passField) {
            passField.focus();
            setNativeValue(passField, ${JSON.stringify(I)});
            fire(passField);
          }
        } finally {
          setTimeout(() => {
            window.__oneviewAutofillApplying = false;
          }, 0);
        }
      })();
    `;try{return await d.executeJavaScript(P,!0),!0}catch{return!1}}function f(d,c){if(!d||!c)return;d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);let S=0;const I=async()=>{if(S+=1,!(typeof d.isDestroyed=="function"?d.isDestroyed():!1)&&d.id===`webview-${k()}`){try{if(await d.executeJavaScript("Boolean(window.__oneviewManualCredentialEditAt)",!0)){d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);return}}catch{}await ve(d,c),S<6&&(d._oneviewAutofillTimer=setTimeout(I,1e3))}};I()}async function M(d){if(d)try{await d.executeJavaScript(`
        (() => {
          if (window.__oneviewCredentialHookInstalled) return;
          window.__oneviewCredentialHookInstalled = true;
          window.__oneviewCredentialCapture = null;

          const getContextDocuments = () => {
            const docs = [document];
            const iframes = Array.from(document.querySelectorAll("iframe"));
            iframes.forEach((frame) => {
              try {
                if (frame.contentDocument) docs.push(frame.contentDocument);
              } catch (_e) {}
            });
            return docs;
          };
          const shouldDebugCredentialFlow = (url = "") => {
            const value = String(url || "").toLowerCase();
            return (
              value.includes("10.215.56.196:3456") ||
              value.includes(".okta.com") ||
              value.includes("gsk-contentlab.veevavault.com") ||
              value.includes("login.veevavault.com") ||
              value.includes("federation.gsk.com")
            );
          };
          const debugLog = (message, payload = {}) => {
            if (!shouldDebugCredentialFlow(window.location.href || "")) return;
            try {
              console.log("[OneView][CredentialCapture]", message, payload);
            } catch (_err) {}
          };
          const visible = (el) => {
            if (!el) return false;
            const win =
              el.ownerDocument && el.ownerDocument.defaultView
                ? el.ownerDocument.defaultView
                : window;
            const s = win.getComputedStyle(el);
            return s && s.display !== "none" && s.visibility !== "hidden";
          };
          const isPasswordLike = (el) => {
            if (!el) return false;
            const isMasked = el.style.webkitTextSecurity === "disc" || el.style.getPropertyValue("-webkit-text-security") === "disc";
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return el.type === "password" || isMasked || /password|passwd|pwd/.test(bag) || /current-password|new-password/.test(String(el.autocomplete || "").toLowerCase());
          };
          const isOtpLike = (el) => {
            if (!el) return false;
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return /otp|one\\s*time|verification\\s*code|authenticator|token|mfa|2fa|tfa|pin/.test(bag);
          };
          const isUserLike = (el) => {
            if (!el) return false;
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return el.type === "email" || /user|login|email|identifier|account|okta/.test(bag) || /username|email/.test(String(el.autocomplete || "").toLowerCase());
          };
          const isSubmitLikeControl = (el) => {
            if (!el) return false;
            const bag = [el.type, el.name, el.id, el.value, el.textContent, el.getAttribute("aria-label"), el.getAttribute("title")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return /submit|login|log in|sign in|signin|continue|next/.test(bag);
          };

          const capture = (trigger = "unknown") => {
            const docs = getContextDocuments();
            let passwordField = null;
            let userField = null;

            docs.some((doc) => {
              const candidates = Array.from(doc.querySelectorAll("input"));
              const pass = candidates.find(
                (el) => visible(el) && isPasswordLike(el) && !isOtpLike(el),
              );
              const pool = pass
                ? (pass.closest("form")
                    ? Array.from(pass.closest("form").querySelectorAll("input"))
                    : candidates)
                : candidates;
              const explicitUser = pool.find(
                (el) => visible(el) && !isPasswordLike(el) && isUserLike(el),
              );
              const fallbackUser = pass
                ? null
                : pool.find(
                    (el) => visible(el) && !isPasswordLike(el) && (el.type === "text" || el.type === "email" || el.type === "tel"),
                  );
              const user = explicitUser || fallbackUser;

              if (pass || user) {
                passwordField = pass || null;
                userField = user || null;
                return true;
              }
              return false;
            });

            const username = (userField && userField.value) ? String(userField.value).trim() : "";
            const password = (passwordField && passwordField.value) ? String(passwordField.value) : "";
            if (username) window.__oneviewLastUsernameValue = username;
            if (password) window.__oneviewLastPasswordValue = password;
            const activeDoc =
              (passwordField && passwordField.ownerDocument) ||
              (userField && userField.ownerDocument) ||
              document;
            const active = activeDoc.activeElement;
            const isActivePassword = active && active.tagName === "INPUT" && (active.type === "password" || active.style.webkitTextSecurity === "disc" || active.style.getPropertyValue("-webkit-text-security") === "disc");
            const activeInputType = isActivePassword ? "password" : (active && active.tagName === "INPUT" ? String(active.type || "").toLowerCase() : "");
            if (!username && !password) return;
            window.__oneviewCredentialCapture = {
              username,
              password,
              url: window.location.href || "",
              capturedAt: Date.now(),
              activeInputType,
              trigger,
              otpLike: Boolean(passwordField && isOtpLike(passwordField)),
            };
            debugLog("captured", {
              trigger,
              usernamePresent: Boolean(username),
              passwordPresent: Boolean(password),
              url: window.location.href || "",
              activeInputType,
            });
          };

          const bindDocumentListeners = (doc) => {
            if (!doc || doc.__oneviewCredentialListenersBound) return;
            doc.__oneviewCredentialListenersBound = true;

            doc.addEventListener("submit", () => {
              capture("submit");
              setTimeout(() => capture("submit"), 0);
            }, true);

            doc.addEventListener("click", (event) => {
              const target = event.target && event.target.closest
                ? event.target.closest('button, input[type="submit"], input[type="button"]')
                : null;
              if (target && isSubmitLikeControl(target)) {
                capture("submit-click");
                setTimeout(() => capture("submit-click"), 0);
              }
            }, true);

            doc.addEventListener("keydown", (event) => {
              if (event.key === "Enter") {
                capture("enter");
                setTimeout(() => capture("enter"), 0);
              }
            }, true);

            doc.addEventListener("input", (event) => {
              const t = event.target;
              if (!t || t.tagName !== "INPUT") return;
              const isPassword = t.type === "password" || t.style.webkitTextSecurity === "disc" || t.style.getPropertyValue("-webkit-text-security") === "disc";
              if (isPassword || t.type === "email" || t.type === "text" || t.type === "tel") {
                if (!window.__oneviewAutofillApplying) {
                  window.__oneviewManualCredentialEditAt = Date.now();
                  if (isPassword) {
                    window.__oneviewLastPasswordValue = String(t.value || "");
                  } else {
                    window.__oneviewLastUsernameValue = String(t.value || "").trim();
                  }
                }
                capture("input");
              }
            }, true);

            debugLog("listeners-bound", {
              href: doc.defaultView?.location?.href || "",
            });
          };

          const bindAllContexts = () => {
            getContextDocuments().forEach((doc) => bindDocumentListeners(doc));
          };

          bindAllContexts();
          document.addEventListener("load", () => {
            bindAllContexts();
          }, true);
          const observer = new MutationObserver(() => bindAllContexts());
          observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true,
          });

          window.__oneviewConsumeCredentialCapture = () => {
            const payload = window.__oneviewCredentialCapture;
            window.__oneviewCredentialCapture = null;
            return payload;
          };
        })();
        `,!0)}catch{}}async function E(d,c){if(!Oe()||!d||!c||c.id!==k()||!c.credentialAutomationEnabled)return;const S=String(d.getURL?.()||c.url||"");let I=null;if(d._oneviewSubmittedCredential&&(I=d._oneviewSubmittedCredential,d._oneviewSubmittedCredential=null),!I)return;const P=I,N=Ee=>{try{const Be=new URL(Ee);return(Be.origin+Be.pathname).toLowerCase().replace(/\/$/,"")}catch{return String(Ee||"").split("?")[0].split("#")[0].toLowerCase().replace(/\/$/,"")}};if(P.url&&N(S)===N(P.url)){d._oneviewSubmittedCredential=I;return}const z=String(P.trigger||"");if(String(P.activeInputType||"").toLowerCase(),z==="input"){const Ee=Le(String(P.url||d.getURL()||"")),Be=Ve(P.username),rt=!!Be&&!!P.password&&Be.toLowerCase()===String(P.password).toLowerCase();Be&&!rt&&Ee&&(he(c)[Ee]=Be,c.lastUsernameHint=Be);return}const a=v(c),w=String(P.url||d.getURL()||""),m=Le(w),p=he(c);let b=Ve(P.username);const O=String(P.password||"");if(!a||!m)return;const Y=/^\d{4,8}$/.test(O),K=/authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(w.toLowerCase());if(P.otpLike||K&&Y)return;const de=String(p[m]||"").trim()||String(c.lastUsernameHint||"").trim(),we=!!b&&!!O&&b.toLowerCase()===O.toLowerCase();b&&!we?(p[m]=b,c.lastUsernameHint=b):p[m]?b=p[m]:c.lastUsernameHint&&(b=String(c.lastUsernameHint||"").trim());const ue=de||String(p[m]||"").trim()||String(c.lastUsernameHint||"").trim(),ge=!!b&&!!O&&b.toLowerCase()===O.toLowerCase();if(ge&&ue&&ue!==b&&(b=ue),!b||!O||ge&&(!ue||ue.toLowerCase()===b.toLowerCase()))return;const ie=`${a}|${m}|${b}`,ne=Date.now(),pe=Se.get(ie)||0,J=($()[a]||[]).find(Ee=>ce(ee(Ee.domain))===ce(m)&&String(Ee.username||"").trim().toLowerCase()===b.toLowerCase());if(!(!J||String(J.password||"")!==O)&&ne-pe<15e3)return;if(Se.set(ie,ne),await je(),Ce(m)&&Ge(a,b,m)){($()[a]||[]).find(rt=>ee(rt.domain)===m&&String(rt.username||"").trim().toLowerCase()===b.toLowerCase())&&window.api?.deleteProfileCredential&&(await window.api.deleteProfileCredential({profileId:a,domain:m,username:b}),await je());return}const ct=($()[a]||[]).find(Ee=>ee(Ee.domain)===m&&String(Ee.username||"").trim().toLowerCase()===b.toLowerCase());if(ct&&String(ct.password||"")===O)return;function vt(Ee,Be,rt="success"){if(!Ee)return;const Ut=`
        (() => {
          const toast = document.createElement("div");
          toast.id = "oneview-injected-toast";
          toast.style.position = "fixed";
          toast.style.top = "20px";
          toast.style.right = "20px";
          toast.style.zIndex = "2147483647";
          toast.style.background = "${rt==="success"?"#10b981":"#ef4444"}";
          toast.style.color = "white";
          toast.style.padding = "12px 24px";
          toast.style.borderRadius = "8px";
          toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
          toast.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
          toast.style.fontSize = "14px";
          toast.style.fontWeight = "600";
          toast.style.transition = "all 0.3s ease";
          toast.style.opacity = "0";
          toast.style.transform = "translateY(-20px)";
          toast.textContent = "${Be.replace(/"/g,'\\"')}";
          
          document.body.appendChild(toast);
          
          // Force reflow
          toast.offsetHeight;
          
          // Slide & fade in
          toast.style.opacity = "1";
          toast.style.transform = "translateY(0)";
          
          // Fade out & remove
          setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(-20px)";
            setTimeout(() => {
              toast.remove();
            }, 300);
          }, 3000);
        })();
      `;Ee.executeJavaScript(Ut,!0).catch(()=>{})}try{if(!(await window.api.saveProfileCredential({profileId:a,domain:m,username:b,password:O}))?.success)return;await je(),vt(d,"Password saved successfully.","success")}catch(Ee){console.warn("Could not save remembered credential:",Ee)}}function A(d,c){!d||!c||d._oneviewCredentialPollId||(d._oneviewCredentialPollId=setInterval(()=>{if(typeof d.isDestroyed=="function"?d.isDestroyed():!1){clearInterval(d._oneviewCredentialPollId),d._oneviewCredentialPollId=null;return}c.id,k()},3e3))}async function D(d=!1){const c=document.getElementById("httpAuthModal"),S=document.getElementById("httpAuthForm"),I=F();c&&!c.classList.contains("hidden")&&r(()=>c.classList.add("hidden")),S&&S.reset(),W(null),d&&I?.challengeId&&typeof window.api?.submitHttpAuthChallenge=="function"&&window.api.submitHttpAuthChallenge({challengeId:I.challengeId,cancelled:!0}).catch(()=>{})}async function X(d={}){const c=document.getElementById("httpAuthModal"),S=document.getElementById("httpAuthModalTitle"),I=document.getElementById("httpAuthMessage"),P=document.getElementById("httpAuthUsernameInput"),N=document.getElementById("httpAuthPasswordInput"),z=document.getElementById("httpAuthRememberInput"),V=document.getElementById("httpAuthSubmitBtn");if(!c||!S||!I||!P||!N||!z||!V)return;F()?.challengeId&&D(!0),W({...d});const a=String(d.reason||"")==="retry";S.textContent=a?"Login Failed, Update Credential":"Website Login Required";const w=String(d.host||d.url||"this website").trim(),m=String(d.realm||"").trim(),p=String(d.profileId||"").trim().toUpperCase();I.textContent=m?`${w} • ${m}${p?` • ${p}`:""}`:`${w}${p?` • ${p}`:""}`,P.value=String(d.username||""),N.value=String(d.password||""),z.checked=d.remember!==!1,V.textContent=a?"Update And Login":"Login",await o(()=>c.classList.remove("hidden")),N.value?(N.focus(),N.select()):(P.focus(),P.select())}function te(){const d=document.getElementById("httpAuthModal"),c=document.getElementById("httpAuthForm"),S=document.getElementById("httpAuthModalCloseBtn");!d||!c||!S||c.dataset.initialized!=="1"&&(c.dataset.initialized="1",S.addEventListener("click",()=>D(!0)),d.addEventListener("click",I=>{I.target===d&&D(!0)}),c.addEventListener("submit",async I=>{I.preventDefault();const P=F(),N=document.getElementById("httpAuthUsernameInput"),z=document.getElementById("httpAuthPasswordInput"),V=document.getElementById("httpAuthRememberInput");if(!P?.challengeId||!N||!z||typeof window.api?.submitHttpAuthChallenge!="function")return;const a=String(N.value||"").trim(),w=String(z.value||""),m=!!V?.checked;if(!(!a||!w))try{await window.api.submitHttpAuthChallenge({challengeId:P.challengeId,username:a,password:w,remember:m}),D(!1)}catch(p){console.error("Failed to submit HTTP auth credential",p),t("Could not submit the website credential.","error")}}),typeof window.api?.onHttpAuthChallenge=="function"&&window.api.onHttpAuthChallenge(I=>{X(I).catch(P=>{console.error("Failed to open HTTP auth modal",P)})}))}function Q(){}async function re(d,c){if(!c||!c.rect)return;const S=d.getURL(),I=Le(S);if(!I)return;const P=[];if(Object.entries($()).forEach(([z,V])=>{V.forEach(a=>{const w=ee(a.domain),m=ce(w),p=ce(I),b=m.endsWith("veevavault.com")&&p.endsWith("veevavault.com");if(m===p||b||p.endsWith(`.${m}`)&&m.split(".").length>1){const O=n.PROFILES[z]||{name:z,color:"#ccc"};P.push({...a,profileId:z,profileName:O.name,profileColor:O.color})}})}),P.length===0)return;const N=`if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(P)});
    }`;d.executeJavaScript(N,!0).catch(()=>{})}return{canUseSecureCredentialApi:Oe,getAutofillCredentialForTab:it,initHttpAuthPrompt:te,initPasswordManager:Q,installCredentialCaptureHooks:M,isCredentialAutomationDomain:Fe,isLikelyAuthPage:xe,maybeOfferRememberCredentials:E,normalizeDomain:ee,refreshCredentialCacheIfStale:Je,scheduleCredentialAutofill:f,shouldEnableCredentialAutomation:$e,startCredentialCapturePolling:A,handleCredentialFieldInteraction:re,hideCredentialDropdown:()=>{}}}function Bi({state:e,constants:n,createNativePageDescriptor:t,ensureNativeSettingsGeneralInfo:o,normalizeSettingsSection:r,renderNativeSettingsPage:u,closeBrowserExtensionsMenu:v,closeBrowserExtensionPopup:x,refreshBrowserExtensionsUi:B,refreshTabScrollControls:L,syncProfileSelectionForTab:y,updateProfileLockUI:C,perfMark:k,shouldRequirePlatformApiForNavigation:$,getWebviewPlatformApiFlag:R,setWebviewPlatformApiFlag:F,getWebviewPreloadPathCached:W,startCredentialCapturePolling:Z,scheduleCredentialAutofill:le,installCredentialCaptureHooks:q,refreshCredentialCacheIfStale:se,getAutofillCredentialForTab:Se,resolveAssignedProfileIdForTab:ke,getCredentialScopeIdByPartition:nt,resolveCredentialScopeIdForTab:Oe,maybeOfferRememberCredentials:ee,syncTabProfileForPage:ce,trackProfileHistory:Ke,resolveProfileIdForTab:Le,resolveAssignedProfileId:Ce,resolveStrictProfileNavigationTarget:Pe,resolveNavigationPartition:Ge,applyProfileSelection:Ve,openProfilePromptDialog:Re,handleCredentialFieldInteraction:je,hideCredentialDropdown:Je}){const{PARTITIONS:he,PROFILES:xe,LOCAL_WEB_APP_TYPES:Fe,WEBVIEW_POOL_MAX:$e=6,WEBVIEW_POOL_KEEPALIVE_MS:Xe=6e4,TAB_PREWARM_ENABLED:ot=!1,PREWARM_ALL_PROFILE_PARTITIONS:it=!1}=n,ve=[];let f=null;const M=new Map,E=()=>e.tabs,A=i=>{e.tabs=i},D=()=>e.activeTabId,X=i=>{e.activeTabId=i},te=()=>e.currentProfileId;function Q(i){const s=document.querySelector(".browser-controls-overlay");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result"));l&&i&&(i.hideBrowserControls=!1);const g=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);s.classList.toggle("hidden",g),l?(s.classList.remove("hidden"),s.style.setProperty("display","flex","important"),s.style.setProperty("visibility","visible","important"),s.style.setProperty("opacity","1","important"),s.style.setProperty("height","40px","important")):(s.style.removeProperty("display"),s.style.removeProperty("visibility"),s.style.removeProperty("opacity"),s.style.removeProperty("height"))}function re(i){const s=document.getElementById("browserDetachHeader");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),g=(!i||i.isHome||!!i.hideBrowserControls||!!i.nativePage)&&!l;s.classList.toggle("hidden",g)}function d(i){const s=document.querySelector(".profile-section");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),g=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);s.classList.toggle("hidden",g)}function c(i,s){const l=E().find(h=>h.id===i);if(!l)return;l.title=s;const g=document.getElementById(`tab-ui-${i}`);g&&(g.querySelector(".tab-title").textContent=s)}function S(){const i=D();return i&&E().find(s=>s.id===i)||null}function I(){const i=D();return i?document.getElementById(`webview-${i}`):null}function P(i){const s=document.getElementById("urlDisplay");s&&(s.value=i)}function N(i){const s=document.getElementById("urlDisplay");s&&(s.value=i)}function z(){const i=document.getElementById("browserBack"),s=document.getElementById("browserForward"),l=I();i&&(i.disabled=l?!l.canGoBack():!0),s&&(s.disabled=l?!l.canGoForward():!0)}function V(i){i&&(i._oneviewCredentialPollId&&(clearInterval(i._oneviewCredentialPollId),i._oneviewCredentialPollId=null),i._oneviewAutofillTimer&&(clearTimeout(i._oneviewAutofillTimer),i._oneviewAutofillTimer=null))}function a(i){document.querySelectorAll(".webviews-container .webcontent-pane").forEach(l=>{const g=l.id.replace("webview-",""),h=E().find(H=>H.id===g);g===i&&!h?.isHome&&h?.credentialAutomationEnabled?Z(l,h):V(l)})}function w(i,s=E().length-1){const l=document.getElementById("tabsList");if(!l)return;const g=document.createElement("div");g.className="tab",g.id=`tab-ui-${i.id}`,g.innerHTML=`
        <span class="tab-title">${i.title}</span>
        <button class="tab-close">x</button>
    `,g.addEventListener("click",H=>{H.target.classList.contains("tab-close")||K(i.id)}),g.querySelector(".tab-close").addEventListener("click",H=>{H.stopPropagation(),ue(i.id)});const T=l.children[s]||null;l.insertBefore(g,T),L()}function m(i){setTimeout(async()=>{const s=E().find(g=>g.id===i);if(!(!s||!s.isHome||document.getElementById(`webview-${i}`)))try{const g=await fe(s);if(!g)return;g.classList.remove("active"),typeof g.hide=="function"&&g.hide().catch(()=>{}),g.syncBounds?.(!1)}catch(g){window.api.webContentCall("log-error",{key:`prewarm-err:${i}:${g.toString()}`}).catch(()=>{})}},0)}async function p(i=null,s=null,l="New Tab",g=null,h={}){const T=h.active!==!1;window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?s=he.gsk:s=wt(s||(xe[te()]?xe[te()].partition:he.guest));const j=`tab-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,U={id:j,title:l,url:i,partition:s,isHome:!i&&!h.nativePage,nativePage:h.nativePage&&typeof h.nativePage=="object"?t(h.nativePage.type||"settings",h.nativePage.section||"general"):null,lockedProfileId:g,hideBrowserControls:!1,launchedAppType:null,trackingAppId:"",trackingAppName:"",requiresPlatformApi:!1,extensionCompatEnabled:!1,extensionEntryPath:"",extensionActiveContext:{url:"",title:""},credentialAutomationEnabled:!1,lastCredentialSourceProfileId:null};U.trackingAppId=String(h.trackingAppId||"").trim(),U.trackingAppName=String(h.trackingAppName||l||U.title||"").trim(),U.extensionEntryPath=String(h.extensionEntryPath||"").trim(),U.extensionCompatEnabled=!!U.extensionEntryPath,U.extensionActiveContext=h.extensionActiveContext&&typeof h.extensionActiveContext=="object"?{url:String(h.extensionActiveContext.url||"").trim(),title:String(h.extensionActiveContext.title||"").trim()}:{url:"",title:""};const G=E(),_e=G.findIndex(st=>st.id===D()),be=Number.isInteger(h.insertIndex)?Math.max(0,Math.min(h.insertIndex,G.length)):_e>=0?_e+1:G.length;if(G.splice(be,0,U),w(U,be),U.nativePage)await K(j);else if(i){T&&X(j);const st=document.getElementById("view-home-content"),bt=document.getElementById("webviews-container");T&&st&&st.classList.add("hidden");const Ot=i&&(i.includes("result.html")||i.includes("extension-icon")||i.toLowerCase().includes("result"));if(T&&bt){bt.classList.remove("hidden");let Me=document.getElementById("tab-load-placeholder");Ot?Me&&(Me.style.display="none"):Me?Me.style.display="flex":(Me=document.createElement("div"),Me.id="tab-load-placeholder",Me.style.cssText=["position:absolute","inset:0","z-index:50","display:flex","flex-direction:column","align-items:center","justify-content:center","background:var(--bg-main,#f8fafc)","gap:16px"].join(";"),Me.innerHTML=`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `,bt.appendChild(Me));const kt=()=>{Me&&(Me.style.display="none")},pn=De=>{De&&(typeof De._oneviewPlaceholderFinalize=="function"&&(De.removeEventListener("did-stop-loading",De._oneviewPlaceholderFinalize),De.removeEventListener("did-fail-load",De._oneviewPlaceholderFinalize)),De._oneviewPlaceholderFinalize=null)},fn=setInterval(()=>{const De=document.getElementById(`webview-${j}`);if(!De)return;clearInterval(fn),clearTimeout(mn);const Rt=()=>{pn(De),clearTimeout(mn),kt()};pn(De),De._oneviewPlaceholderFinalize=Rt,De.addEventListener("did-stop-loading",Rt,{once:!0}),De.addEventListener("did-fail-load",Rt,{once:!0})},100),mn=setTimeout(()=>{clearInterval(fn),kt()},12e3)}await ge(j,i,s,l,g,h,T)}else await K(j),ot&&m(j);return U}function b(i=D()){const s=E(),l=s.find(j=>j.id===i);if(!l)return;const g=s.findIndex(j=>j.id===l.id),h=document.getElementById(`webview-${l.id}`),T=h&&typeof h.getURL=="function"&&h.getURL()||l.url||"",H=h&&typeof h.getTitle=="function"&&h.getTitle()||l.title||"New Tab";p(l.isHome||!T||T==="about:blank"?null:T,l.partition,H,l.lockedProfileId||null,{insertIndex:g>=0?g+1:s.length,trackingAppId:l.trackingAppId||"",trackingAppName:l.trackingAppName||H})}function O(i){const s=E();if(!s.length)return;const l=s.findIndex(T=>T.id===D()),h=((l>=0?l:0)+i+s.length)%s.length;K(s[h].id,{suppressHomeSearchFocus:!0})}async function Y(i){!i||typeof i.focusWebContents!="function"||await i.focusWebContents().catch(()=>{})}async function K(i,s={}){X(i);const l=E().find(U=>U.id===i);if(!l)return;v(),x().catch(()=>{}),y(l),C(l),document.querySelectorAll(".tab").forEach(U=>U.classList.remove("active"));const g=document.getElementById(`tab-ui-${i}`);g&&g.classList.add("active");const h=document.getElementById("view-home-content"),T=document.getElementById("nativeTabContent"),H=document.getElementById("webviews-container"),j=document.querySelectorAll(".webviews-container .webcontent-pane");if(l.isHome){h.classList.remove("hidden"),T?.classList.add("hidden"),H.classList.add("hidden"),Q(l),re(l),d(l);const U=document.getElementById("googleSearchInput");U&&s?.suppressHomeSearchFocus!==!0&&(U.value="",U.focus())}else if(l.nativePage)h.classList.add("hidden"),T?.classList.remove("hidden"),H.classList.add("hidden"),Q(l),re(l),d(l),P(""),r(l.nativePage?.section)==="general"&&await o(),u(l);else{h.classList.add("hidden"),T?.classList.add("hidden"),H.classList.remove("hidden"),Q(l),re(l),d(l),j.forEach(G=>{G.id!==`webview-${i}`&&(G.classList.remove("active"),typeof G.hide=="function"&&G.hide().catch(()=>{}),G.syncBounds?.(!1))});let U=null;try{U=document.getElementById(`webview-${i}`),U||(U=await fe(l))}catch(G){window.api.webContentCall("log-error",{key:`switchTab-create-err:${i}:${G.toString()}`}).catch(()=>{})}if(U)try{U.classList.add("active"),typeof U.show=="function"&&await U.show().catch(()=>{}),U.syncBounds?.(!0),await Y(U),P(U.getURL())}catch(G){window.api.webContentCall("log-error",{key:`switchTab-show-err:${i}:${G.toString()}`}).catch(()=>{})}}a(l.id),B(),z()}function de(i){if(!i)return!1;const s=String(i.launchedAppType||"").toLowerCase();return Fe.has(s)}function we(i,s){if(!i||!s||!de(s))return!1;const l=String(i.getAttribute("partition")||s.partition||"");if(!l)return!1;const g=i.parentElement;for(g&&g.removeChild(i),i.classList.remove("active"),ve.push({webview:i,partition:l,platformApiEnabled:R(i),at:Date.now()}),k("view-webcontent","park-to-pool",{partition:l,poolSize:ve.length});ve.length>$e;){const h=ve.shift();h&&h.webview&&!h.webview.isDestroyed?.()&&h.webview.remove()}return!0}function ue(i){const s=E(),l=s.findIndex(H=>H.id===i);if(l===-1)return;const g=D()===i;document.getElementById(`tab-ui-${i}`)?.remove();const h=document.getElementById(`webview-${i}`);if(h&&(V(h),(!de(s[l])||!we(h,s[l]))&&h.remove()),s.splice(l,1),s.length===0){X(null),p(),L();return}const T=s.some(H=>H.id===D());if(g||!T){const H=Math.min(l,s.length-1),j=s[H]||s[s.length-1];j&&K(j.id)}L()}async function ge(i,s,l,g,h=null,T={},H=!0){const j=performance.now(),U=E().find(_e=>_e.id===i);if(!U)return;U._navStartedAt=j,k("view-nav","navigateTo-start",{tabId:U.id,url:String(s||""),partition:String(l||""),appType:T.appType||null}),U.isHome=!1,U.url=s,U.partition=l,U.lockedProfileId=h,U.hideBrowserControls=!!T.hideControls,U.launchedAppType=T.appType||null,U.lastCredentialSourceProfileId=null,U.trackingAppId=String(T.trackingAppId||"").trim(),U.trackingAppName=String(T.trackingAppName||g||U.title||"").trim(),U.requiresPlatformApi=$(s,T),g&&c(i,g),H&&(X(i),await K(i));let G=document.getElementById(`webview-${i}`);if(!G)G=await fe(U,H);else{const _e=G.getAttribute("partition"),be=R(G);(_e!==l||be!==!!U.requiresPlatformApi)&&(V(G),(!de(U)||!we(G,U))&&G.remove(),G=await fe(U,H))}H&&typeof G.show=="function"?await G.show().catch(()=>{}):!H&&typeof G.hide=="function"&&await G.hide().catch(()=>{}),typeof G.setMeta=="function"&&await G.setMeta({trackingAppId:U.trackingAppId,appName:U.trackingAppName,appType:U.launchedAppType||""}).catch(()=>{}),G.syncBounds?.(H),H&&(P(s),await Y(G)),G.src!==s&&(G.src=s),k("view-nav","navigateTo-dispatch",{tabId:U.id,elapsedMs:Math.round(performance.now()-j)})}async function ie(i,s,l,g=null,h={}){return ge(D(),i,s,l,g,h,!0)}function ne(i){i&&i.executeJavaScript(`
      (() => {
        if (window.__oneviewModifiedClickBridgeInstalled) return true;
        window.__oneviewModifiedClickBridgeInstalled = true;
        const findAnchor = (event) => {
          const path = typeof event.composedPath === "function" ? event.composedPath() : [];
          for (const node of path) {
            if (node && typeof node.closest === "function") {
              const anchor = node.closest("a[href]");
              if (anchor) return anchor;
            }
          }
          return event.target && typeof event.target.closest === "function"
            ? event.target.closest("a[href]")
            : null;
        };

        const openModifiedLink = (event) => {
          const anchor = findAnchor(event);
          if (!anchor) return;
          const href = anchor.href || anchor.getAttribute("href") || "";
          if (!href || /^javascript:/i.test(href)) return;
          anchor.setAttribute("target", "_blank");
          anchor.setAttribute("rel", "noopener noreferrer");
          event.preventDefault();
          event.stopPropagation();
          if (typeof event.stopImmediatePropagation === "function") {
            event.stopImmediatePropagation();
          }
          window.open(href, "_blank");
        };

        document.addEventListener("mousedown", (event) => {
          if (!(event.ctrlKey || event.metaKey)) return;
          openModifiedLink(event);
        }, true);

        document.addEventListener("click", (event) => {
          if (!(event.ctrlKey || event.metaKey)) return;
          openModifiedLink(event);
        }, true);

        document.addEventListener("auxclick", (event) => {
          if (event.button !== 1) return;
          openModifiedLink(event);
        }, true);
        return true;
      })();
      `,!0).catch(()=>{})}function pe(i=""){const s=String(i||"").trim().toLowerCase();return!!(!s||s==="about:blank"||s.startsWith("javascript:")||s.startsWith("data:")||s.startsWith("chrome-error://"))}function J(i){i._hasTabListenersAttached||(i._hasTabListenersAttached=!0,i.addEventListener("ipc-message",async s=>{if(s.channel==="oneview:credential-field-focused")je(i,s.args[0]);else if(s.channel!=="oneview:credential-field-blurred"){if(s.channel==="oneview:credential-selected"){const l=s.args[0];if(l){i.executeJavaScript("window.__oneviewManualCredentialEditAt = 0;",!0).catch(()=>{}),le(i,l),l.profileId&&l.profileId!==te()&&Ve(l.profileId);try{const g=i.getURL(),h=g?new URL(g).hostname.toLowerCase():"";h&&localStorage.setItem(`oneview:last-used-username:${l.profileId||te()}:${h}`,l.username)}catch{}}}else if(s.channel==="oneview:credential-login-attempted"){const l=s.args[0];if(l&&l.username){try{const T=l.url?new URL(l.url).hostname.toLowerCase():"";T&&localStorage.setItem(`oneview:last-used-username:${te()}:${T}`,l.username)}catch{}const g=i.id.replace("webview-",""),h=E().find(T=>T.id===g);h&&h.credentialAutomationEnabled&&ee(i,h)}}else if(s.channel==="oneview:credential-submitted"){const l=s.args[0];l&&(i._oneviewSubmittedCredential=l)}else if(s.channel==="oneview:keydown"){const l=s.args[0];if(l){const g=new KeyboardEvent("keydown",{key:l.key,ctrlKey:l.ctrlKey,shiftKey:l.shiftKey,altKey:l.altKey,metaKey:l.metaKey,bubbles:!0,cancelable:!0});document.dispatchEvent(g)}}}}),i.addEventListener("console-message",s=>{const l=String(s?.message||"");(l.includes("[OneView][Credential")||l.includes("[VeevaSlide]"))&&console.log("[WebviewConsole]",{level:s?.level,line:s?.line,sourceId:s?.sourceId||"",message:l})}),i.addEventListener("did-start-loading",()=>{const s=i.id.replace("webview-",""),l=E().find(h=>h.id===s);if(!l)return;l._didStartLoadingAt=performance.now(),k("view-webcontent","did-start-loading",{tabId:l.id,url:i.getURL()||l.url||""}),l.url&&(l.url.includes("result.html")||l.url.includes("extension-icon")||l.url.toLowerCase().includes("result"))?(c(l.id,"Result"),l.id===D()&&N(l.url||"")):(c(l.id,"Loading..."),l.id===D()&&N(l.url||"Loading..."))}),i.addEventListener("did-stop-loading",async()=>{const s=i.id.replace("webview-",""),l=E().find(be=>be.id===s);if(!l)return;const g=typeof l._didStartLoadingAt=="number"?Math.round(performance.now()-l._didStartLoadingAt):null,h=typeof l._navStartedAt=="number"?Math.round(performance.now()-l._navStartedAt):null;k("view-webcontent","did-stop-loading",{tabId:l.id,url:i.getURL()||"",loadElapsedMs:g,navElapsedMs:h});const T=i.getURL()||l.url||"";let j=T&&(T.includes("result.html")||T.includes("extension-icon")||T.toLowerCase().includes("result"))?"Result":i.getTitle()||l.title||"Tab";if(j==="Tab"||j==="Loading..."||!j)try{const be=new URL(T);j=be.hostname?be.hostname.replace("www.",""):"Tab"}catch{j="Tab"}(l.title==="Loading..."||l.title==="Tab"||!l.title||i.getTitle()&&i.getTitle()!=="about:blank")&&c(l.id,j),l.id===D()&&P(T),l.url=T,l.credentialAutomationEnabled=cn(T,j,l);const G=async(be,st,bt)=>{if(!be.credentialAutomationEnabled){V(i);return}const Ot=ke(be,st,bt),Me=nt(be.partition)||Ot||te();await se();const kt=Se(Me,st,be);le(i,kt),Z(i,be),q(i)};i._oneviewSetupCredentialAutomation=G,await G(l,T,j),await ce(l,T,j,i),gi(i,l);const _e=Le(l);Ke(_e,T,j),ne(i)}),i.addEventListener("page-title-updated",s=>{const l=i.id.replace("webview-",""),g=E().find(h=>h.id===l);g&&(c(g.id,s.title),g.credentialAutomationEnabled&&ee(i,g))}),i.addEventListener("will-navigate",()=>{const s=i.id.replace("webview-",""),l=E().find(g=>g.id===s);l&&l.credentialAutomationEnabled&&ee(i,l)}),i.addEventListener("did-navigate",s=>{const l=i.id.replace("webview-",""),g=E().find(H=>H.id===l);if(!g)return;const h=s.url||i.getURL()||"";g.url=h,g.id===D()&&(P(h),z());const T=Le(g);Ke(T,h,i.getTitle()||g.title||""),g.credentialAutomationEnabled&&(ee(i,g),typeof i._oneviewSetupCredentialAutomation=="function"&&i._oneviewSetupCredentialAutomation(g,h,i.getTitle()||g.title||""))}),i.addEventListener("did-navigate-in-page",async s=>{const l=i.id.replace("webview-",""),g=E().find(U=>U.id===l);if(!g)return;const h=s.url||i.getURL()||"";g.url=h,g.id===D()&&(P(h),z());const T=Le(g);if(Ke(T,h,i.getTitle()||g.title||""),g.credentialAutomationEnabled&&(ee(i,g),typeof i._oneviewSetupCredentialAutomation=="function"&&i._oneviewSetupCredentialAutomation(g,h,i.getTitle()||g.title||"")),i.addEventListener("history-changed",U=>{_=U,g.id===D()&&z()}),g.credentialAutomationEnabled=cn(h,i.getTitle()||g.title||"",g),!g.credentialAutomationEnabled){V(i);return}ee(i,g),await se();const H=nt(g.partition)||ke(g,h,i.getTitle()||g.title||"")||Oe(g),j=Se(H,h,g);le(i,j),Z(i,g)}),i.addEventListener("new-window",async s=>{const l=i.id.replace("webview-",""),g=E().find(_e=>_e.id===l);if(!g)return;typeof s?.preventDefault=="function"&&s.preventDefault();const h=String(s?.url||"").trim();if(pe(h))return;const T=String(i.getURL()||"").trim();if(T&&T===h)return;let H=Ce(h,"New Tab"),j=null;if(H)j=xe[H].partition;else if(Re){const _e=Le(g)||"guest",be=await Re(h,_e);if(be&&!be.cancelled&&be.profileId)H=be.profileId,j=xe[H]?.partition;else return}else j=g.partition;const U=E(),G=U.findIndex(_e=>_e.id===g.id);p(h,j,"New Tab",H,{insertIndex:G>=0?G+1:U.length})}))}async function fe(i,s=!0){if(M.has(i.id))return M.get(i.id);const l=vt(i,s);M.set(i.id,l);try{return await l}finally{M.delete(i.id)}}function ct(i){const s=String(i?.partition||"");if(!s||ve.length===0)return null;const l=!!i?.requiresPlatformApi,g=ve.findIndex(T=>T.partition===s&&!!T.platformApiEnabled===l);if(g===-1)return null;const[h]=ve.splice(g,1);return h?.webview||null}async function vt(i,s=!0){const l=performance.now(),g=document.getElementById("webviews-container"),h=ct(i);if(h)return h.classList.toggle("active",s),h.id=`webview-${i.id}`,h.setAttribute("partition",i.partition),F(h,!!i.requiresPlatformApi),J(h),g.appendChild(h),s&&typeof h.show=="function"?h.show().catch(()=>{}):!s&&typeof h.hide=="function"&&h.hide().catch(()=>{}),h.syncBounds?.(s),s&&typeof h.focusWebContents=="function"&&h.focusWebContents().catch(()=>{}),k("view-webcontent","reuse-pooled",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l),poolSize:ve.length}),h;const T=W(),H=await gn({key:`view:${i.id}`,partition:i.partition,preloadPath:T,additionalArguments:i.requiresPlatformApi?["--oneview-enable-platform-api=1"]:[],extensionEntryPath:i.extensionEntryPath,extensionActiveContext:i.extensionActiveContext,extensionCompat:!0,initialMeta:{trackingAppId:i.trackingAppId,appName:i.trackingAppName,appType:i.launchedAppType||"",extensionEntryPath:i.extensionEntryPath},className:`webcontent-pane${s?" active":""}`});return H.id=`webview-${i.id}`,H.setAttribute("partition",i.partition),F(H,!!i.requiresPlatformApi),J(H),g.appendChild(H),!s&&typeof H.hide=="function"&&H.hide().catch(()=>{}),H.syncBounds?.(s),s&&typeof H.focusWebContents=="function"&&H.focusWebContents().catch(()=>{}),k("view-webcontent","create-fresh",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l)}),H}function Ee(){f||(f=setInterval(()=>{if(!document.hidden&&ve.length!==0)for(let i=ve.length-1;i>=0;i-=1){const l=ve[i]?.webview;if(!l||l.isDestroyed?.()){ve.splice(i,1);continue}l.executeJavaScript("void 0",!1).catch(()=>{})}},Xe))}async function Be(i){const s=String(i||"").trim();if(!s||ve.some(T=>T.partition===s))return;const l=document.getElementById("webviews-container");if(!l)return;const g=W(),h=`view:prewarm:${s}:${Date.now()}`;try{const T=await gn({key:h,partition:s,preloadPath:g,className:"webcontent-pane"});T.id=`webview-prewarm-${Date.now()}`,l.appendChild(T),T.syncBounds?.(),we(T,{launchedAppType:"website",partition:s})}catch{}}async function rt(){const i=Array.from(new Set(Object.values(xe).map(s=>String(s?.partition||"").trim()).filter(Boolean)));for(const s of i)await Be(s),await new Promise(l=>setTimeout(l,60))}async function ln(){const i=xe[te()]?.partition||xe.guest.partition;i&&await Be(i)}function Ut(){Ee(),ot&&(it?rt():ln())}function mi(){for(f&&(clearInterval(f),f=null);ve.length>0;){const i=ve.shift();i&&i.webview&&!i.webview.isDestroyed?.()&&i.webview.remove()}}function wi(i,s=null){return!(!i||i.isHome)}function gi(i,s){if(!i||!s||s.launchedAppType!=="website")return;const l=`
    html, body {
      scrollbar-width: thin !important;
      scrollbar-color: rgba(99,102,241,0.65) rgba(148,163,184,0.16) !important;
    }
    * {
      scrollbar-width: thin !important;
      scrollbar-color: rgba(99,102,241,0.65) rgba(148,163,184,0.16) !important;
    }
    ::-webkit-scrollbar {
      width: 12px !important;
      height: 12px !important;
    }
    ::-webkit-scrollbar-track {
      background: linear-gradient(180deg, rgba(241,245,249,0.55), rgba(226,232,240,0.35)) !important;
      border-radius: 12px !important;
    }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, rgba(99,102,241,0.85), rgba(79,70,229,0.78)) !important;
      border: 2px solid rgba(255,255,255,0.88) !important;
      border-radius: 999px !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, rgba(79,70,229,0.95), rgba(67,56,202,0.9)) !important;
    }
    ::-webkit-scrollbar-corner {
      background: rgba(226,232,240,0.45) !important;
    }
  `;try{i.insertCSS(l)}catch(g){console.warn("Could not apply website scrollbar theme:",g)}}function hi(){const i=E().find(l=>l.id===D());if(!i||i.isHome)return;i.isHome=!0,i.url=null,i.lockedProfileId=null,c(i.id,"New Tab");const s=document.getElementById(`webview-${i.id}`);s&&(V(s),(!de(i)||!we(s,i))&&s.remove()),K(i.id)}function vi(i=""){const s=String(i||"").trim();if(!s)return"";const l=s.match(/^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/);if(l){const h=l[1].toUpperCase(),T=decodeURIComponent(l[2]).replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${h}:/${T}`}if(/^file:\/\//i.test(s)||/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^about:/i.test(s))return s;const g=s.match(/^([a-zA-Z])[:/\\](.*)$/);if(g){const h=g[1].toUpperCase(),T=g[2].replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${h}:/${T}`}if(/^\/[A-Za-z]\//.test(s)){const h=s[1].toUpperCase(),T=s.slice(3).replace(/\\/g,"/");return`file:///${h}:/${T}`}return/^\\\\/.test(s)?`file:${s.replace(/\\/g,"/")}`:s}function Nt(i=""){const s=String(i||"").trim();return!s||/\s/.test(s)?!1:!!(/^about:/i.test(s)||/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(s)||/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(s)||s.includes(".")||/[/:?#]/.test(s))}async function bi(i){if(i=vi(i),!i)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){let h=i;Nt(i)?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&(h=`https://${i}`):h=`https://www.google.com/search?q=${encodeURIComponent(i)}`,await ie(h,he.gsk,i);return}let s=i,l=Nt(i);if(l?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&!/^file:\/\//i.test(i)&&(s=`https://${i}`):Nt(i)?(s=`https://${i}`,l=!0):s=`https://www.google.com/search?q=${encodeURIComponent(i)}`,l){const h=await Pe(s,null,"New Tab");if(!h||h.cancelled)return;const T=h.profileId,H=h.partition;T&&T!==te()&&Ve(T,{bypassLock:!0}),await ie(s,H,"New Tab",h.lockedProfileId);return}const g=Ge(s,S()?.partition||xe[te()]?.partition||he.guest,"Google Search");await ie(s,g,"Google Search")}function yi(i,{isTeardown:s=!1}={}){const l=E(),g=Array.isArray(i)?i.filter(Boolean):[];if(g.length===0||l.length===0)return;const h=new Set(g),T=[...l],H=T.findIndex(j=>j.id===D());if(T.forEach(j=>{if(!h.has(j.id))return;document.getElementById(`tab-ui-${j.id}`)?.remove();const U=document.getElementById(`webview-${j.id}`);U&&(V(U),(!de(j)||!we(U,j))&&U.remove())}),A(T.filter(j=>!h.has(j.id))),E().length===0){X(null),s||(p(),L());return}if(h.has(D())){const j=Math.min(Math.max(H,0),E().length-1);X(E()[j].id)}K(D()||E()[0].id),L()}function cn(i="",s="",l=null){return l?l.launchedAppType==="website"||!l.launchedAppType?dn(i,s)||un(i):!0:!1}function dn(i="",s=""){const l=`${String(i||"")} ${String(s||"")}`.toLowerCase();if(/login|sign in|signin|password|sso|authenticate|verify/.test(l))return!0;try{const g=new URL(String(i||"")),h=`${g.pathname.toLowerCase()} ${g.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(h)}catch{return!1}}function un(i=""){let s="";try{s=new URL(String(i||"")).hostname.toLowerCase()}catch{return!1}return s==="10.215.56.196"||s.endsWith(".gskinternet.com")||s.endsWith(".gskpro.com")||s.endsWith(".veevavault.com")||s.endsWith(".okta.com")||s.endsWith(".oktacdn.com")||s.endsWith(".pingone.com")}return{closeTab:ue,closeTabsBulk:yi,createTab:p,createWebviewForTab:fe,duplicateTab:b,disposeWebviewRuntime:mi,getActiveTab:S,getActiveWebview:I,goToActiveTabHome:hi,isInspectableLocalFileTab:wi,navigateTo:ie,navigateToTab:ge,performSearch:bi,startWebviewRuntime:Ut,switchRelativeTab:O,switchTab:K,updateTabTitle:c,updateUrlDisplay:P,updateUrlDisplayString:N,getCurrentProfileId:te,getTabs:E}}console.log("View Page Script initializing...");let oe=[],We=null,Tt=!1,Fn=null,hn=null,vn=[],bn=[],yn={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};const Gt=et.profileHistory,Jt="view.profileHistory.v1";let Te={wppproduction:[],vml:[],gsk:[],guest:[]};const Hn=et.customBookmarks;let Ue=[],Sn="guest",zt="guest",En="",dt="guest",Pt=null,Qe=null,xn=null;const Ai=new Set(["login.veevavault.com","federation.gsk.com"]);let yt=null,Ne=-1,He=[],Cn={version:"",defaultOpenStatus:""},In=0,kn=null,Ln=!1;const Wn=et.perfEnabled;let pt=null,Pn=!1;const It={};Object.defineProperties(It,{tabs:{get:()=>oe,set:e=>{oe=e}},activeTabId:{get:()=>We,set:e=>{We=e}},browserExtensionsCache:{get:()=>vn,set:e=>{vn=e}},managedDownloadsCache:{get:()=>bn,set:e=>{bn=e}},nativeSettingsGeneralInfo:{get:()=>Cn,set:e=>{Cn=e}},historyProfileId:{get:()=>zt,set:e=>{zt=e}},historySearchQuery:{get:()=>En,set:e=>{En=e}},currentProfileId:{get:()=>me,set:e=>{me=e}},profileHistoryCache:{get:()=>Te,set:e=>{Te=e}},credentialCache:{get:()=>yn,set:e=>{yn=e}},passwordProfileId:{get:()=>Sn,set:e=>{Sn=e}},passwordEditTarget:{get:()=>hn,set:e=>{hn=e}},activeHttpAuthChallenge:{get:()=>xn,set:e=>{xn=e}},credentialCacheRefreshedAt:{get:()=>In,set:e=>{In=e}},credentialCacheRefreshInFlight:{get:()=>kn,set:e=>{kn=e}}});const qt={synapse:{partition:ye.synapse},contentgen:{partition:ye.contentgen}},Xt=new Set(["nextjs","vite","react","angular","html","neutralino","website","vite-server"]),Vn=(()=>{try{return new URL(Rn).origin.toLowerCase()}catch{return""}})(),Ti=new URL(""+new URL("contentgen-DHdropzE.webp",import.meta.url).href,import.meta.url).href,$i=new URL(""+new URL("contentgen-dark-Bj2lxwBn.webp",import.meta.url).href,import.meta.url).href;function Bn(e=document){if(!e||typeof e.querySelectorAll!="function")return;const n=document.body.classList.contains("dark-mode");e.querySelectorAll("img[data-theme-icon]").forEach(t=>{const o=String(t.getAttribute("data-theme-icon")||"").trim();let r="";o==="contentgen"&&(r=n?$i:Ti),r&&t.getAttribute("src")!==r&&t.setAttribute("src",r)})}function _i(){["httpAuthModal","bookmarkModal","cacheActionModal","extensionsManagerModal"].forEach(e=>{const n=document.getElementById(e);!n||n.dataset.hoistedToBody==="1"||(document.body.appendChild(n),n.dataset.hoistedToBody="1")})}async function An(){const e=tt();if(!(!e||e.isHome||!e.url||!window.api?.openDetachedViewWindow))try{await window.api.openDetachedViewWindow({url:e.url,title:e.title||"Detached Tab",partition:e.partition||ye.guest}),Zt(e.id)}catch(n){console.error("Failed to open detached tab window",n),qe("Could not open the page in a separate window.","error")}}function Mt(){if(pt!==null)return pt;try{const e=localStorage.getItem(Wn);return pt=e==="1"||e==="true",pt}catch{return pt=!1,!1}}function jn(e,n,t=null){if(!Mt())return;const o=t?{...t}:{};try{console.log(`[PERF][${e}] ${n}`,o)}catch{}}window.addEventListener("storage",e=>{e.key===Wn&&(pt=null,window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Mt()).catch(()=>{}))});const ae={wppproduction:{id:"wppproduction",name:"WPPProduction",partition:ye.wppproduction,color:"#000000",bgColor:"#e2e8f0",label:"W"},vml:{id:"vml",name:"VML",partition:ye.vml,color:"#ff0000",bgColor:"#fee2e2",label:"V"},gsk:{id:"gsk",name:"GSK",partition:ye.gsk,color:"#f37521",bgColor:"#ffedd5",label:"G"},guest:{id:"guest",name:"Guest",partition:ye.guest,color:"#64748b",bgColor:"#f1f5f9",label:"?"}};let me="guest";function Di(){return me}const Mi=Pi({state:It,constants:{AUTH_GATEWAY_HOSTS:Ai,RESOURCE_SERVICE_ORIGIN:Vn,PROFILES:ae},showToast:qe,openOverlayModal:lt,closeOverlayModal:Ze,renderProfilePillSelect:on,resolveCredentialScopeIdForTab:oi,applyProfileSelection:ht,getCurrentProfileId:()=>me,escapeHtml:Ie}),{getAutofillCredentialForTab:Ui,initHttpAuthPrompt:Ni,installCredentialCaptureHooks:Oi,isLikelyAuthPage:Ri,maybeOfferRememberCredentials:Fi,refreshCredentialCacheIfStale:Hi,scheduleCredentialAutofill:Wi,startCredentialCapturePolling:Vi,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi}=Mi;let ut=null,St=null;const qi=Li({state:It,constants:{PROFILES:ae,PENDING_EXTENSION_OPEN_STORAGE_KEY:"oneview.pendingExtensionOpenPath",EXTENSION_PIN_STORAGE_KEY:"oneview.browserExtensions.pinned.v1",IS_DEV_APP_BUILD:At},escapeHtml:Ie,showToast:qe,openOverlayModal:lt,closeOverlayModal:Ze,getActiveTab:(...e)=>St?.getActiveTab?.(...e)??null,getActiveWebview:(...e)=>St?.getActiveWebview?.(...e)??null,createTab:(...e)=>St?.createTab?.(...e),refreshActiveNativeSettingsPage:(...e)=>ut?.refreshActiveNativeSettingsPage?.(...e)??Promise.resolve(),closeSettingsMenu:Eo}),{closeBrowserExtensionPopup:Qt,closeBrowserExtensionsMenu:Yi,formatDownloadBytes:Ki,formatDownloadEta:Gi,formatDownloadSpeed:Ji,initDownloadsManager:Xi,initExtensionsManager:Qi,loadManagedDownloadsFromMain:Zi,refreshBrowserExtensionsUi:eo,refreshExtensionsManagerList:zn}=qi;St=Bi({state:It,constants:{PARTITIONS:ye,PROFILES:ae,LOCAL_WEB_APP_TYPES:Xt,WEBVIEW_POOL_MAX:6,WEBVIEW_POOL_KEEPALIVE_MS:12e3,TAB_PREWARM_ENABLED:!0,PREWARM_ALL_PROFILE_PARTITIONS:!1},createNativePageDescriptor:(...e)=>ut?.createNativePageDescriptor?.(...e)??null,ensureNativeSettingsGeneralInfo:(...e)=>ut?.ensureNativeSettingsGeneralInfo?.(...e)??Promise.resolve(),normalizeSettingsSection:(...e)=>ut?.normalizeSettingsSection?.(...e)??"general",renderNativeSettingsPage:(...e)=>ut?.renderNativeSettingsPage?.(...e),closeBrowserExtensionsMenu:Yi,closeBrowserExtensionPopup:Qt,refreshBrowserExtensionsUi:eo,refreshTabScrollControls:Dt,syncProfileSelectionForTab:Lo,updateProfileLockUI:Et,perfMark:jn,shouldRequirePlatformApiForNavigation:_o,getWebviewPlatformApiFlag:Do,setWebviewPlatformApiFlag:Mo,getWebviewPreloadPathCached:$o,startCredentialCapturePolling:Vi,scheduleCredentialAutofill:Wi,installCredentialCaptureHooks:Oi,refreshCredentialCacheIfStale:Hi,getAutofillCredentialForTab:Ui,resolveAssignedProfileIdForTab:Xn,getCredentialScopeIdByPartition:Yn,resolveCredentialScopeIdForTab:oi,maybeOfferRememberCredentials:Fi,syncTabProfileForPage:Po,trackProfileHistory:To,resolveProfileIdForTab:ii,resolveAssignedProfileId:Ct,resolveStrictProfileNavigationTarget:Qn,resolveNavigationPartition:ft,applyProfileSelection:ht,openProfilePromptDialog:Io,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi});const{closeTab:Zt,closeTabsBulk:mt,createTab:Ae,createWebviewForTab:to,duplicateTab:no,disposeWebviewRuntime:qn,getActiveTab:tt,getActiveWebview:Ye,goToActiveTabHome:io,isInspectableLocalFileTab:oo,navigateTo:xt,navigateToTab:ro,performSearch:$t,startWebviewRuntime:so,switchRelativeTab:Lt,switchTab:ze,updateTabTitle:ao,updateUrlDisplay:lo,updateUrlDisplayString:Tn,getTabs:Yt}=St;ut=ki({state:It,constants:{PROFILES:ae,PARTITIONS:ye,IS_DEV_APP_BUILD:At},escapeHtml:Ie,showToast:qe,isPerfEnabled:Mt,formatDownloadBytes:Ki,formatDownloadSpeed:Ji,formatDownloadEta:Gi,formatHistoryTime:ri,loadManagedDownloadsFromMain:Zi,refreshExtensionsManagerList:zn,saveProfileHistoryStore:rn,getActiveTab:tt,updateTabTitle:ao,createTab:Ae,switchTab:ze,navigateTo:xt});const{bindSettingsShortcutsGlobal:co,createNativePageDescriptor:mr,ensureNativeSettingsGeneralInfo:wr,getSettingsTabTitle:gr,initNativeSettingsUi:uo,initSettingsMenu:po,isEditableShortcutTarget:fo,isNativeSettingsTab:hr,normalizeSettingsSection:vr,openSettingsTab:Kt,refreshActiveNativeSettingsPage:mo,renderNativeSettingsPage:br,updateNativeSettingsTabSection:yr}=ut;function wo(){try{return localStorage.getItem("username")==="Guest"}catch{return!1}}function go(e="",n="",t=""){const o=String(t||"").trim().toLowerCase();if(qt[o])return o;const r=String(n||"").trim().toLowerCase(),u=String(e||"").trim().toLowerCase();try{const v=new URL(String(e||"")),x=`${v.protocol}//${v.host}`.toLowerCase(),B=String(v.pathname||"/").toLowerCase();if(x===Vn&&(B==="/"||B===""))return"synapse";if(x==="http://10.215.56.196:3456")return"contentgen"}catch{}return/content[\s-]*gen/.test(r)||/content[\s-]*gen/.test(u)?"contentgen":r.includes("synapse")?"synapse":""}function en(e){const n=wt(e);if(n===ye.synapse||n===ye.contentgen)return"guest";const t=Object.values(ae).find(o=>o.partition===n);return t?t.id:null}function Yn(e){const n=wt(e);return n===ye.synapse?"synapse":n===ye.contentgen?"contentgen":en(n)}function ft(e="",n="",t="",o={}){const r=String(o?.sessionScope||o?.credentialScope||"").trim()||"",u=go(e,t,r);return u&&qt[u]?qt[u].partition:wt(n||ae[me]?.partition||ye.guest)}async function ho(){const e=document.getElementById("view-synapse-link-btn");if(!e||(e.style.display="none",wo()))return;const n=String(localStorage.getItem("emp_id")||"").trim(),t=String(localStorage.getItem("username")||"").trim(),o=/^\d+$/.test(t)?t:"",r=n||o;if(r)try{const u=await fetch(`${Rn}/api/list_of_users`,{signal:AbortSignal.timeout(5e3)});if(!u.ok)throw new Error(`API returned ${u.status}`);const v=await u.json(),x=Array.isArray(v)?v:Array.isArray(v?.users)?v.users:[],B=new Set(x.map(L=>String(L?.emp_id??"").trim()).filter(Boolean));e.style.display=B.has(r)?"flex":"none"}catch(u){console.warn("Could not verify Synapse visibility in view",u),e.style.display="none"}}function vo(e="",n="addressSearchDropdown"){const t=document.getElementById(n);if(!t)return;const o=String(e||"").trim().toLowerCase();if(!o){t.classList.add("hidden"),He=[],Ne=-1;return}const r=oe.filter(y=>{const C=String(y.title||"").toLowerCase(),k=String(y.url||"").toLowerCase();return C.includes(o)||k.includes(o)}).map(y=>({type:"tab",id:y.id,title:y.title||"Untitled Tab",url:y.url||"",partition:y.partition}));let u=[];Object.values(Te).forEach(y=>{Array.isArray(y)&&y.forEach(C=>{const k=String(C.title||"").toLowerCase(),$=String(C.url||"").toLowerCase();if(k.includes(o)||$.includes(o)){const R=u.some(W=>W.url===C.url),F=r.some(W=>W.url===C.url);!R&&!F&&u.push({type:"history",title:C.title||"History Item",url:C.url,partition:C.partition||ye.guest})}})}),He=[{type:"search",title:e,url:`Search for "${e}"`},...r.slice(0,5),...u.slice(0,15)],Ne=0;let x="";x+=Ft(He[0],0);const B=He.filter(y=>y.type==="tab");B.length>0&&(x+='<div class="address-search-group-label">Open Tabs</div>',B.forEach(y=>{const C=He.indexOf(y);x+=Ft(y,C)}));const L=He.filter(y=>y.type==="history");L.length>0&&(x+='<div class="address-search-group-label">History</div>',L.forEach(y=>{const C=He.indexOf(y);x+=Ft(y,C)})),t.innerHTML=x,t.classList.remove("hidden")}function Ft(e,n){const t=n===Ne;let o=String(e.title||"H").charAt(0).toUpperCase(),r="is-history",u="History";return e.type==="tab"?(r="is-tab",u="Tab"):e.type==="search"&&(r="is-search",u="Search",o="🔍"),`
    <div class="address-search-item ${r} ${t?"is-selected":""}" 
         data-index="${n}">
      <div class="address-search-item-icon">${o}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${Ie(e.title)}</span>
        <span class="address-search-item-url">${Ie(e.url)}</span>
      </div>
      <div class="address-search-item-badge">${u}</div>
    </div>
  `}async function $n(e,n){const t=document.getElementById(e);if(!t)return;if(Ne<0||Ne>=He.length){$t(t.value);return}const o=He[Ne],r=document.getElementById(n);r&&r.classList.add("hidden"),o.type==="tab"?await ze(o.id):o.type==="history"?await si(o.url,o.partition,o.title):$t(t.value),t.blur()}function _n(e,n){const t=document.getElementById(e),o=document.getElementById(n);!t||!o||(t.addEventListener("input",()=>{vo(t.value,n)}),t.addEventListener("keydown",r=>{o.classList.contains("hidden")||(r.key==="ArrowDown"?(r.preventDefault(),Ne=(Ne+1)%He.length,Dn(n)):r.key==="ArrowUp"?(r.preventDefault(),Ne=(Ne-1+He.length)%He.length,Dn(n)):r.key==="Enter"?(r.preventDefault(),$n(e,n)):r.key==="Escape"&&o.classList.add("hidden"))}),o.addEventListener("click",r=>{const u=r.target.closest(".address-search-item");if(!u)return;const v=parseInt(u.dataset.index);isNaN(v)||(Ne=v,$n(e,n))}))}function Dn(e){const n=document.getElementById(e);n&&n.querySelectorAll(".address-search-item").forEach((t,o)=>{const r=parseInt(t.dataset.index);t.classList.toggle("is-selected",r===Ne),r===Ne&&t.scrollIntoView({block:"nearest"})})}function bo(){const e=document.getElementById("googleSearchInput");e&&e.dataset.boundAddressInput!=="1"&&(e.dataset.boundAddressInput="1",e.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdownHome");o&&!o.classList.contains("hidden")||t.key==="Enter"&&$t(e.value)}),_n("googleSearchInput","addressSearchDropdownHome"));const n=document.getElementById("urlDisplay");n&&n.dataset.boundAddressInput!=="1"&&(n.dataset.boundAddressInput="1",n.addEventListener("focus",()=>{n.select?.()}),n.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdown");if(!(o&&!o.classList.contains("hidden"))){if(t.key==="Enter")t.preventDefault(),$t(n.value),n.blur();else if(t.key==="Escape"){t.preventDefault();const r=tt();lo(r?.url||""),n.blur()}}}),_n("urlDisplay","addressSearchDropdown"))}function Kn(){if(Tt){window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode(),oe.length===0?Ae():ze(We||oe[0].id);return}Tt=!0,console.log("initViewPage called"),Ei().catch(n=>{console.warn("Could not initialize OneView shared storage sync",n)}),ir(),window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Mt()).catch(()=>{}),window.api&&typeof window.api.getPerfLogPath=="function"&&window.api.getPerfLogPath().then(n=>{n?.success&&jn("perf","log-path",{path:n.path||"",enabled:n.enabled})}).catch(()=>{}),!Ln&&window.api&&typeof window.api.onCredentialDebugLog=="function"&&(Ln=!0,window.api.onCredentialDebugLog(n=>{console.log("[OneView][CredentialCapture][MainRelay]",n)})),document.body?.dataset.boundProfileHistorySharedStorage!=="1"&&window.api?.onOneviewSharedStorageUpdated&&(document.body.dataset.boundProfileHistorySharedStorage="1",window.api.onOneviewSharedStorageUpdated(n=>{String(n?.key||"")===Jt&&(ni(n),mo().catch(()=>{}))})),Fo(),Ao(),Bo().catch(()=>{}),jo(),sn(),Bn(),_i(),document.addEventListener("click",n=>{const t=document.getElementById("addressSearchDropdown"),o=document.getElementById("addressSearchDropdownHome"),r=document.getElementById("urlDisplay"),u=document.getElementById("googleSearchInput");t&&!t.contains(n.target)&&n.target!==r&&t.classList.add("hidden"),o&&!o.contains(n.target)&&n.target!==u&&o.classList.add("hidden");const v=document.getElementById("credentialSelectionDropdown");v&&!v.contains(n.target)&&v.classList.add("hidden")}),document.body.dataset.viewThemeIconObserverBound||(document.body.dataset.viewThemeIconObserverBound="1",new MutationObserver(()=>{Bn()}).observe(document.body,{attributes:!0,attributeFilter:["class"]})),oe.length===0?Ae():ze(We||oe[0].id);const e=document.getElementById("newTabBtn");e&&e.addEventListener("click",()=>{Ae()}),Ko();try{bo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupViewSearch-err:${n.toString()}`}).catch(()=>{})}try{Ho()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupBookmarks-err:${n.toString()}`}).catch(()=>{})}ho().catch(n=>{console.warn("Failed to update Synapse visibility in view",n)});try{qo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-initBookmarkManager-err:${n.toString()}`}).catch(()=>{})}document.getElementById("browserBack")?.addEventListener("click",()=>{const n=Ye();if(n&&n.canGoBack()){n.goBack();return}io()}),document.getElementById("browserForward")?.addEventListener("click",()=>{const n=Ye();n&&n.canGoForward()&&n.goForward()}),document.getElementById("browserReload")?.addEventListener("click",()=>{const n=Ye();n&&n.reload()}),document.getElementById("browserDetach")?.addEventListener("click",An),document.getElementById("browserDetachHeader")?.addEventListener("click",An),So(),so(),Jo(),Ni(),ko(),po(),co(),uo(),Qi(),Xi(),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode()}window.addEventListener("beforeunload",()=>{if(Qt().catch(()=>{}),qn(),typeof oe<"u"&&Array.isArray(oe)){const e=oe.map(n=>n.id);mt(e,{isTeardown:!0})}});window.addEventListener("teardown-view-system",()=>{console.log("Teardown View System triggered"),Qt().catch(()=>{}),qn();const e=oe.map(t=>t.id);mt(e,{isTeardown:!0});const n=document.getElementById("webviews-container");n&&(n.querySelectorAll(".webcontent-pane").forEach(o=>{try{typeof o.remove=="function"&&o.remove()}catch{}}),n.innerHTML=""),oe=[],We=null,Tt=!1});function Ht(e){if(!e||e.isHome)return!1;const n=String(e.url||"").trim(),t=String(e.launchedAppType||"").trim().toLowerCase();return!n||n==="about:blank"||n==="newtab"||Bt(n)||!/^https?:\/\//i.test(n)?!1:!t||t==="website"}function yo({activateVisibleTab:e=!0}={}){if(!Tt||oe.length===0)return;const n=oe.filter(u=>!u.isHome&&!Ht(u)).map(u=>u.id);if(n.length>0&&mt(n),!e)return;const t=tt();if(t&&Ht(t)){ze(t.id);return}const o=oe.find(u=>Ht(u));if(o){ze(o.id);return}const r=oe.find(u=>u.isHome);if(r){ze(r.id);return}if(oe.length===0){Ae();return}ze(oe[0].id)}window.addEventListener("ticket-switch-preserve-view",e=>{yo({activateVisibleTab:e?.detail?.activateVisibleTab!==!1})});async function So(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;const e=JSON.parse(localStorage.getItem(et.installedApps)||"{}");let n=!1;for(const[t,o]of Object.entries(e)){const r=String(o?.type||"").toLowerCase();if(Xt.has(r)&&o?.localPath)try{const u=await window.api.resolveOneviewAppUrl(t,o.localPath);u?.success&&u.url&&o.oneviewUrl!==u.url&&(e[t]={...o,oneviewUrl:u.url},n=!0)}catch{}}n&&localStorage.setItem(et.installedApps,JSON.stringify(e))}window.initViewPage=Kn;window.closeViewTab=Zt;function Eo(){const e=document.getElementById("settingsBtn");e&&e.classList.remove("is-active")}function tn(){return{modal:document.getElementById("extensionPromptModal"),title:document.getElementById("extensionPromptTitle"),message:document.getElementById("extensionPromptMessage"),label:document.getElementById("extensionPromptLabel"),input:document.getElementById("extensionPromptInput"),textarea:document.getElementById("extensionPromptTextarea"),form:document.getElementById("extensionPromptForm"),submitBtn:document.getElementById("extensionPromptSubmitBtn"),cancelBtn:document.getElementById("extensionPromptCancelBtn"),closeBtn:document.getElementById("extensionPromptCloseBtn")}}async function xo(e={}){const n=tn();if(!n.modal||!n.form||!n.input||!n.textarea)return{cancelled:!0,value:""};if(Qe)return{cancelled:!0,value:""};const t=e&&typeof e=="object"?e:{},o=t.multiline===!0,r=t.required!==!1,u=String(t.value||""),v=String(t.title||"Extension Input").trim()||"Extension Input",x=String(t.message||"").trim(),B=String(t.label||"Value").trim()||"Value",L=String(t.submitLabel||"Submit").trim()||"Submit",y=String(t.cancelLabel||"Cancel").trim()||"Cancel",C=String(t.placeholder||"").trim();return n.title.textContent=v,n.message.textContent=x,n.message.classList.toggle("hidden",!x),n.label.textContent=B,n.submitBtn.textContent=L,n.cancelBtn.textContent=y,n.input.classList.toggle("hidden",o),n.textarea.classList.toggle("hidden",!o),n.input.required=!o&&r,n.textarea.required=o&&r,n.input.type=t.password===!0?"password":"text",n.input.placeholder=C,n.textarea.placeholder=C,n.input.value=o?"":u,n.textarea.value=o?u:"",new Promise(k=>{Qe={resolve:k,required:r,multiline:o},lt(()=>{n.modal.classList.remove("hidden"),n.modal.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{(o?n.textarea:n.input).focus(),(o?n.textarea:n.input).select?.()})}).catch(()=>{Qe=null,k({cancelled:!0,value:""})})})}function Mn(e={cancelled:!0,value:""}){const n=tn();if(!n.modal||!Qe)return;const t=Qe;Qe=null,Ze(()=>{n.modal.classList.add("hidden"),n.modal.setAttribute("aria-hidden","true"),n.form.reset(),n.input.classList.remove("hidden"),n.textarea.classList.add("hidden"),n.input.type="text"}),t.resolve(e)}function Co(){return{modal:document.getElementById("profilePromptModal"),select:document.getElementById("profilePromptSelect"),continueBtn:document.getElementById("profilePromptContinueBtn"),cancelBtn:document.getElementById("profilePromptCancelBtn"),closeBtn:document.getElementById("profilePromptCloseBtn")}}let Wt=null;async function Io(e,n="guest"){const t=Co();if(!t.modal||!t.select)return{cancelled:!0,profileId:n};if(Wt)return{cancelled:!0,profileId:n};let o=n;const r=t.select;r.innerHTML=Object.values(ae).map(v=>{const x=String(v.name||"P").charAt(0).toUpperCase();return`
        <div class="profile-big-item ${v.id===o?"active":""}" data-id="${v.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${v.color};">
            ${x}
          </div>
          <span class="profile-big-name">${Ie(v.name)}</span>
        </div>
      `}).join("");const u=v=>{o=v,r.querySelectorAll(".profile-big-item").forEach(x=>{x.classList.toggle("active",x.dataset.id===v)})};r.querySelectorAll(".profile-big-item").forEach(v=>{const x=()=>{const B=v.dataset.id;!B||!ae[B]||u(B)};v.addEventListener("click",x),v.addEventListener("keydown",B=>{(B.key==="Enter"||B.key===" ")&&(B.preventDefault(),x())}),v.addEventListener("dblclick",()=>{x(),t.continueBtn?.click()})});try{await lt(()=>{t.modal.classList.remove("hidden"),t.modal.setAttribute("aria-hidden","false")})}catch{return{cancelled:!0,profileId:n}}return new Promise(v=>{Wt={resolve:v};const x=()=>{Ze(()=>{t.modal.classList.add("hidden"),t.modal.setAttribute("aria-hidden","true")}),t.continueBtn?.removeEventListener("click",B),t.cancelBtn?.removeEventListener("click",L),t.closeBtn?.removeEventListener("click",L),t.modal.removeEventListener("click",y),Wt=null},B=()=>{x(),v({cancelled:!1,profileId:o})},L=()=>{x(),v({cancelled:!0,profileId:n})};t.continueBtn?.addEventListener("click",B),t.cancelBtn?.addEventListener("click",L),t.closeBtn?.addEventListener("click",L);const y=C=>{C.target===t.modal&&L()};t.modal.addEventListener("click",y)})}function ko(){const e=tn();if(!e.modal||e.modal.dataset.boundExtensionPrompt==="1")return;e.modal.dataset.boundExtensionPrompt="1",e.form?.addEventListener("submit",t=>{if(t.preventDefault(),!Qe)return;const o=Qe.multiline?e.textarea:e.input,r=String(o?.value||"");if(Qe.required&&!r.trim()){o?.focus();return}Mn({cancelled:!1,value:r})});const n=()=>Mn({cancelled:!0,value:""});e.cancelBtn?.addEventListener("click",n),e.closeBtn?.addEventListener("click",n),e.modal.addEventListener("click",t=>{t.target===e.modal&&n()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&Qe&&!e.modal.classList.contains("hidden")&&(t.preventDefault(),n())})}function Gn(){return!!tt()?.lockedProfileId}function Et(e=null){const n=e||tt(),t=!!n?.lockedProfileId,o=document.getElementById("profileBtn");if(o){if(o.classList.toggle("locked",t),t){const r=ae[n.lockedProfileId]?.name||"assigned";o.title=`Profile locked to ${r} for this tab`}else o.title="Switch Profile";Jn()}}function Jn(){const e=Gn();document.querySelectorAll(".profile-item[data-id]").forEach(t=>{t.classList.toggle("disabled",e),t.setAttribute("aria-disabled",e?"true":"false")})}function nn(e){return en(e)}function Lo(e){const n=ii(e);!n||!ae[n]||me!==n&&ht(n,{bypassLock:!0})}function on(e,n,t){const o=document.getElementById(e);o&&(o.innerHTML=Object.values(ae).map(r=>`
      <div class="profile-pill-item ${r.id===n?"active":""}" data-id="${r.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${r.color};"></span>
        <span>${Ie(r.name)}</span>
      </div>
    `).join(""),o.querySelectorAll(".profile-pill-item").forEach(r=>{const u=()=>{const v=r.dataset.id;!v||!ae[v]||(o.querySelectorAll(".profile-pill-item").forEach(x=>{x.classList.toggle("active",x.dataset.id===v)}),typeof t=="function"&&t(v))};r.addEventListener("click",u),r.addEventListener("keydown",v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),u())})}))}function ht(e,{bypassLock:n=!1}={}){const t=String(e||"").trim();if(!ae[t]){console.warn(`[View] applyProfileSelection: Invalid profile ID "${t}"`);return}if(!n&&Gn()){console.log("[View] applyProfileSelection BLOCKED: active tab is locked");return}console.log(`[View] applyProfileSelection: Switching to ${t}`),me=t,localStorage.setItem(et.currentProfileId,t),li(),document.querySelectorAll(".profile-item").forEach(r=>{r.dataset.id===t?r.classList.add("active"):r.classList.remove("active")})}function Ct(e="",n=""){const t=String(n).toLowerCase(),o=String(e).toLowerCase();let r=o;try{r=decodeURIComponent(o)}catch{r=o}const u=`${t} ${o} ${r}`,v=/\bai\b/.test(t),x=/\b(imagine|empower|production ai|imagine wpp)\b/.test(t),B=u.includes("jira.")||u.includes("jira/")||u.includes("atlassian.net")||u.includes("jira.uhub.biz")||t.includes("jira"),L=t.includes("aem")||t.includes("veeva")||t.includes("gsk")||o.includes("gskinternet.com")||o.includes("gsk-contentlab.veevavault.com")||o.includes("veevavault.com"),y=v||x||o.includes("imagine.wpp.ai")||o.includes("://wpp.ai")||o.includes(".wpp.ai")||u.includes("://wpp.")||u.includes(".wpp.")||u.includes("wpp.com");return B?"vml":L?"gsk":y?"wppproduction":null}function Xn(e,n="",t=""){const o=String(e?.lockedProfileId||"").trim().toLowerCase(),r=Ct(n,t);return o&&Ri(n,t)?o:r}async function Qn(e,n=null,t="New Tab",o={}){const r=String(n||"").trim(),u=r?nn(r):null;if(String(e||"").trim().toLowerCase().startsWith("file://"))return{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:ft(e,ae.guest.partition,t,o)};const x=Ct(e,t);if(x&&ae[x])return{cancelled:!1,profileId:x,lockedProfileId:x,partition:ft(e,ae[x].partition,t,o)};const B=ci(e),L=u&&B.find(y=>y.profileId===u)||B.find(y=>y.profileId===me)||B[0]||null;return L&&ae[L.profileId]?{cancelled:!1,profileId:L.profileId,lockedProfileId:L.profileId,partition:ft(e,ae[L.profileId].partition,t,o)}:{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:ft(e,ae.guest.partition,t,o)}}async function Po(e,n,t,o){const r=Xn(e,n,t);if(e.lockedProfileId=r,!r){We===e.id&&Et(e);return}const u=ae[r].partition;if(me!==r&&ht(r,{bypassLock:!0}),e.partition!==u){e.partition=u,o&&!o.isDestroyed?.()&&o.remove();const v=await to(e);We===e.id&&(Et(e),setTimeout(()=>{v.src=n},10));return}We===e.id&&Et(e)}function Zn(){return{wppproduction:[],vml:[],gsk:[],guest:[]}}function ei(e={}){const n=Zn();return Object.keys(n).forEach(t=>{const o=Array.isArray(e?.[t])?e[t]:[];n[t]=o.map(r=>({url:String(r?.url||"").trim(),title:String(r?.title||"Untitled").trim()||"Untitled",visitedAt:r?.visitedAt?Number(r.visitedAt):0})).filter(r=>r.url&&r.url!=="about:blank").slice(0,200)}),n}function ti(){!window.api||typeof window.api.setOneviewSharedStorage!="function"||window.api.setOneviewSharedStorage(Jt,Te).catch(e=>{console.warn("Could not sync profile history to shared storage",e)})}function ni(e=null){if(!e||typeof e!="object")return;Te=ei(e.value||{});try{localStorage.setItem(Gt,JSON.stringify(Te))}catch{}!document.getElementById("historyManagerModal")?.classList.contains("hidden")&&ui()}async function Bo(){if(!(!window.api||typeof window.api.getOneviewSharedStorage!="function"))try{const e=await window.api.getOneviewSharedStorage(Jt);e?.success&&e.entry?ni(e.entry):ti()}catch(e){console.warn("Could not hydrate profile history from shared storage",e)}}function Ao(){try{const e=JSON.parse(localStorage.getItem(Gt)||"{}");Te=ei(e)}catch{Te=Zn()}}function rn(){localStorage.setItem(Gt,JSON.stringify(Te)),ti()}function ii(e){return e&&(e.lockedProfileId||en(e.partition))||me}function oi(e){return e&&(Yn(e.partition)||e.lockedProfileId)||me}function To(e,n,t){if(!Te[e])return;const o=String(n||"").trim();if(!o||o==="about:blank"||o.startsWith("devtools://"))return;const r=String(t||"Untitled").trim()||"Untitled",u=Te[e]||[],v=u.findIndex(B=>B.url===o),x={url:o,title:r,visitedAt:Date.now()};v===0?u[0]=x:(v>0&&u.splice(v,1),u.unshift(x)),Te[e]=u.slice(0,200),rn()}function ri(e){if(!e)return"Unknown Date";try{return new Date(e).toLocaleString()}catch{return""}}function $o(){if(yt!==null)return yt;try{yt=window.api&&typeof window.api.getWebviewPreloadPath=="function"?window.api.getWebviewPreloadPath():""}catch{yt=""}return yt}function _o(e,n={}){const t=String(n?.appType||"").trim().toLowerCase(),o=String(e||"").trim().toLowerCase();return typeof n?.requiresPlatformApi=="boolean"?n.requiresPlatformApi:t&&t!=="website"?!0:t==="website"&&Bt(o)}function Do(e){return e?.getAttribute("data-platform-api-enabled")==="1"}function Mo(e,n){!e||typeof e.setAttribute!="function"||e.setAttribute("data-platform-api-enabled",n?"1":"0")}function Uo(e=""){const n=String(e).trim();if(!n)return"APP";const t=n.split(/\s+/).filter(Boolean);return t.length===1?t[0].slice(0,3).toUpperCase():t.slice(0,3).map(o=>o[0]).join("").toUpperCase()}function No(e=""){const n=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)","linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)","linear-gradient(to right, #4facfe 0%, #00f2fe 100%)","linear-gradient(to top, #30cfd0 0%, #330867 100%)"],t=String(e);let o=0;for(let r=0;r<t.length;r+=1)o=(o+t.charCodeAt(r)*(r+1))%n.length;return n[o]}function Oo(e="app"){let n=document.getElementById("view-launch-loader");n?n.style.display="flex":(n=document.createElement("div"),n.id="view-launch-loader",n.style.cssText=["position:fixed","inset:0","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","background:rgba(15,23,42,0.45)","backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)"].join(";"),n.innerHTML=`
      <div style="
        background:white;border-radius:20px;
        padding:32px 40px;text-align:center;
        box-shadow:0 24px 64px rgba(0,0,0,0.25);
        display:flex;flex-direction:column;
        align-items:center;gap:16px;
        min-width:220px;
      ">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:spin-view-launch 1s linear infinite">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        <p style="margin:0;font-size:15px;font-weight:600;color:#1e293b"></p>
        <style>@keyframes spin-view-launch{to{transform:rotate(360deg)}}</style>
      </div>
    `,document.body.appendChild(n));const t=n.querySelector("p");return t&&(t.textContent=`Opening ${e||"app"}...`),()=>{n&&(n.style.display="none")}}async function Ro(e){if(!e)return;const t=JSON.parse(localStorage.getItem(et.installedApps)||"{}")[e];if(!t){console.warn("Installed app not found:",e);return}const o=t.name||"App",r=Oo(o),u=xi(t);console.log("[OneView Tracking] View launch decision",{appId:e,appName:t?.name||"",appType:t?.type||"",clickTrackingMode:t?.clickTrackingMode||"",trackOnLaunch:t?.trackOnLaunch,oneviewUrl:t?.oneviewUrl||"",hasLocalPath:!!t?.localPath,shouldTrackLaunch:u}),u&&Ci({currentSelectedTicketId:window.currentActiveTicketKey||"",clickedAppName:o});try{if(wn(t)){await Si(t),qe(`Opened "${o}" in a separate window.`,"info");return}const v=()=>tt()?.partition||ae[me]?.partition||ye.guest,x=async(L,y={})=>{await Ae(L,v(),o,null,{hideControls:!0,appType:t.type,trackingAppId:e,trackingAppName:o,bypassPrompt:!0,...y})},B=String(t.type||"").toLowerCase();if(Xt.has(B)&&t.localPath){Tn(`Starting ${o}...`);let L=String(t.oneviewUrl||"").trim();if(window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const C=await window.api.resolveOneviewAppUrl(e,t.localPath,"/",v());if(C?.success&&C.url){L=C.url;const k=JSON.parse(localStorage.getItem(et.installedApps)||"{}");k[e]&&(k[e]={...k[e],oneviewUrl:L},localStorage.setItem(et.installedApps,JSON.stringify(k)))}}const y=["nextjs","next","vite-server"].includes(B);if(L&&Bt(L)&&y&&(L=""),L&&Bt(L))await x(L);else{const C=await window.api.launchNextApp(t.localPath,t.type);await x(C)}return}if(t.type==="website"&&t.url){await x(t.url);return}if(t.type==="exe"&&t.localPath){Tn(`Launching ${o}...`);const L=await window.api.launchExe(t.localPath,t.tech);if(L&&L.mode==="embedded"&&L.url){const y=new URLSearchParams;L.token&&y.set("NL_TOKEN",L.token),t.tech&&y.set("TECH",t.tech);const C=String(L.url).split(":")[2];C&&y.set("NL_PORT",C);const k=`${L.url}?${y.toString()}`;await x(k)}else L?.success&&L.mode==="external"?qe(`Opened "${o}" in a separate window.`,"info"):alert(`${o} launched externally. Embedded view is not available for this app.`);return}alert(`Cannot launch "${o}". Missing supported launch configuration.`)}catch(v){if(wn(t)){console.error("Failed to launch external Electron app from view:",v),qe(`Failed to launch "${o}".`,"error");return}console.error("Failed to launch installed app from view:",v),alert(`Failed to launch "${o}": ${v.message||v}`)}finally{r()}}async function si(e,n=null,t="New Tab",o=!1,r={}){const u=String(e||"").trim();if(!u)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){const F=ye.gsk;window.enterSiteSnapStudioMode();const W=Yt(),Z=(W||[]).some(le=>{const q=String(le.url||"").trim();return q&&q!=="about:blank"&&q!=="newtab"});!W||W.length===0||o||Z?await Ae(u,F,t,null,r):await xt(u,F,t,null,r);return}let v=o;u.toLowerCase().startsWith("file://")&&(v=!0);const B=await Qn(u,n,t,r);if(!B||B.cancelled)return;const L=B.partition,y=B.profileId,C=B.lockedProfileId;y&&y!==Di()&&ht(y,{bypassLock:!0});const k=Yt();if(!k||k.length===0){await Ae(u,L,t,C,r);return}const $=k.some(F=>{const W=String(F.url||"").trim();return W&&W!=="about:blank"&&W!=="newtab"});if(v||$){await Ae(u,L,t,C,r);return}let R=tt();if(!R){const F=k[k.length-1];F&&(await ze(F.id),R=F)}if(!R){await Ae(u,L,t,C,r);return}await xt(u,L,t,C,r)}window.initViewPage=Kn;window.createTab=Ae;window.getTabs=Yt;window.getActiveWebview=Ye;window.launchInstalledAppFromView=Ro;window.openUrlFromDashboard=si;function Fo(){const e=localStorage.getItem(et.currentProfileId);e&&ae[e]?me=e:me="guest",li();const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");n&&t&&(n.addEventListener("click",async o=>{o.stopPropagation(),t.classList.contains("hidden")?await lt(()=>t.classList.remove("hidden")):Ze(()=>t.classList.add("hidden"))}),t.innerHTML=Object.values(ae).map(o=>`
        <div class="profile-item ${o.id===me?"active":""}" data-id="${o.id}">
            <div class="profile-item-dot" style="background-color: ${o.color}"></div>
            <span>${o.name}</span>
        </div>
    `).join("").concat(`
        <div class="profile-divider"></div>
        <div class="profile-item" data-action="manage-passwords">
          <div class="profile-item-dot" style="background-color: #6366f1"></div>
          <span>Manage Passwords</span>
        </div>
      `),t.querySelectorAll(".profile-item").forEach(o=>{o.addEventListener("click",async()=>{if(o.dataset.action==="manage-passwords"){Kt("passwords"),Ze(()=>t.classList.add("hidden"));return}const r=o.dataset.id;o.classList.contains("disabled")||(ai(r),Ze(()=>t.classList.add("hidden")))})}),Jn())}function ai(e){ht(e)}function li(){const e=ae[me],n=document.getElementById("profileBtn"),t=document.getElementById("profileLabel");n&&t&&(t.textContent=e.label,t.style.color=e.color),Et()}function Ho(){const e=document.querySelector(".bookmarks-grid");e&&e.addEventListener("click",n=>{const t=n.target.closest(".bookmark-edit-btn");if(t){n.preventDefault(),n.stopPropagation();const k=t.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;k&&Yo(k);return}const o=n.target.closest(".bookmark-delete-btn");if(o){n.preventDefault(),n.stopPropagation();const k=o.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;k&&(Ue=Ue.filter($=>$.id!==k),di(),sn());return}const r=n.target.closest(".bookmark-card");if(!r||r.id==="addBookmarkBtn"||r.classList.contains("add-bookmark-card"))return;const u=r.dataset.url,v=r.dataset.title||"New Tab",x=String(r.dataset.partition||"").trim(),B=String(r.dataset.sessionScope||"").trim(),y=r.dataset.profileId||nn(r.dataset.partition)||Ct(u||"",v)||me;if(y!==me&&ai(y),u){const C=ft(u,x||ae[y].partition,v,B?{sessionScope:B}:{});xt(u,C,v,Ct(u||"",v))}})}function gt(e=""){const n=String(e).trim();return n?/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/^about:/i.test(n)?n:`https://${n}`:""}function _t(e=""){const n=gt(e);if(!n)return"";try{const t=new URL(n),o=t.pathname.length>1?t.pathname.replace(/\/+$/,"")||"/":t.pathname||"/";return`${t.origin}${o}${t.search}${t.hash}`}catch{return n.replace(/\/+$/,"")}}function ci(e=""){const n=_t(e);return n?Ue.filter(t=>_t(t.url)===n):[]}function Wo(e="",n=""){const t=ci(e);return n?t.find(o=>String(o.profileId||"").trim().toLowerCase()===n)||null:t[0]||null}function Vo(e=null){return e?String(e.lockedProfileId||"").trim().toLowerCase()||nn(e.partition)||me||"guest":me||"guest"}function jo(){try{const e=JSON.parse(localStorage.getItem(Hn)||"[]");Ue=Array.isArray(e)?e.map(n=>({id:String(n?.id||""),title:String(n?.title||"").trim(),url:gt(n?.url||""),profileId:ae[n?.profileId]?n.profileId:"guest"})).filter(n=>n.id&&n.title&&n.url):[]}catch{Ue=[]}}function di(){localStorage.setItem(Hn,JSON.stringify(Ue))}function zo({id:e="",title:n="",url:t="",profileId:o="guest"}){const r=gt(t),u=String(n||"").trim()||r,v=ae[o]?o:"guest",x=_t(r);if(!r||!x)return!1;const B=Ue.findIndex(y=>e&&y.id===e?!0:_t(y.url)===x&&String(y.profileId||"guest")===v),L={id:B>=0?Ue[B].id:e||`bm-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:u,url:r,profileId:v};return B>=0?Ue[B]={...Ue[B],...L}:Ue.unshift(L),B>=0?"updated":"created"}function sn(){const e=document.querySelector(".bookmarks-grid");if(!e)return;e.querySelectorAll(".bookmark-card.custom-bookmark").forEach(o=>o.remove());const n=Ue.map(o=>{const r=ae[o.profileId]||ae.guest;return`
        <div
          class="bookmark-card custom-bookmark"
          data-bookmark-id="${Ie(o.id)}"
          data-url="${Ie(o.url)}"
          data-title="${Ie(o.title)}"
          data-profile-id="${Ie(o.profileId)}"
        >
          <button class="bookmark-edit-btn" type="button" title="Edit Bookmark">E</button>
          <button class="bookmark-delete-btn" type="button" title="Remove Bookmark">X</button>
          <div class="bookmark-icon" style="background:${No(o.title)};">
            <span>${Ie(Uo(o.title))}</span>
          </div>
          <div class="bookmark-info">
            <h3>${Ie(o.title)}</h3>
            <p>${Ie(r.name)} Profile</p>
          </div>
        </div>
      `}).join(""),t=document.getElementById("addBookmarkBtn");t?t.insertAdjacentHTML("beforebegin",n):e.insertAdjacentHTML("beforeend",n)}function qo(){const e=document.getElementById("addBookmarkBtn"),n=document.getElementById("bookmarkCurrentPageHeaderBtn"),t=document.getElementById("bookmarkModal"),o=document.getElementById("bookmarkModalCloseBtn"),r=document.getElementById("bookmarkForm"),u=document.getElementById("bookmarkTitleInput"),v=document.getElementById("bookmarkUrlInput"),x=t?.querySelector(".password-modal-header h3"),B=document.getElementById("bookmarkSaveBtn");if(!e||!t||!o||!r||!u||!v)return;const L=()=>{Ze(()=>{t.classList.add("hidden"),Pt=null})},y=async({editId:$=null,title:R="",url:F="",profileId:W=me,heading:Z="Add Bookmark",saveLabel:le="Save Bookmark"}={})=>{Pt=$,dt=ae[W]?W:me,on("bookmarkProfileSelect",dt,q=>{dt=q}),x&&(x.textContent=Z),B&&(B.textContent=le),r.reset(),u.value=String(R||""),v.value=String(F||""),await lt(()=>t.classList.remove("hidden")),u.value?(u.focus(),u.select()):u.focus()},C=async()=>{await y()},k=async()=>{const $=tt(),R=gt($?.url||"");if(!$||$.isHome||!R||R==="about:blank"){qe("Open a website tab first to save it as a bookmark.","error");return}const F=Vo($),W=Wo(R,F);await y({editId:W?.id||null,title:$.title||W?.title||"New Bookmark",url:R,profileId:F,heading:W?"Update Bookmark":"Save Current Site",saveLabel:W?"Update Bookmark":"Save Bookmark"})};e.addEventListener("click",C),e.addEventListener("keydown",async $=>{($.key==="Enter"||$.key===" ")&&($.preventDefault(),await C())}),n?.addEventListener("click",k),n?.addEventListener("keydown",async $=>{($.key==="Enter"||$.key===" ")&&($.preventDefault(),await k())}),o.addEventListener("click",L),t.addEventListener("click",$=>{$.target===t&&L()}),r.addEventListener("submit",$=>{$.preventDefault();const R=String(u.value||"").trim(),F=gt(v.value);if(!R||!F)return;const W=zo({id:Pt,title:R,url:F,profileId:dt||me});W&&(di(),sn(),L(),r.reset(),qe(W==="updated"?"Bookmark updated successfully.":"Bookmark saved successfully.","success"))})}async function Yo(e){const n=document.getElementById("bookmarkModal"),t=document.getElementById("bookmarkForm"),o=document.getElementById("bookmarkTitleInput"),r=document.getElementById("bookmarkUrlInput"),u=n?.querySelector(".password-modal-header h3"),v=document.getElementById("bookmarkSaveBtn");if(!n||!t||!o||!r)return;const x=Ue.find(B=>B.id===e);x&&(Pt=x.id,dt=x.profileId||me,u&&(u.textContent="Edit Bookmark"),v&&(v.textContent="Update Bookmark"),on("bookmarkProfileSelect",dt,B=>{dt=B}),o.value=x.title||"",r.value=x.url||"",await lt(()=>n.classList.remove("hidden")),o.focus())}function Ko(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;const o=220;n.addEventListener("click",()=>{e.scrollBy({left:-o,behavior:"smooth"})}),t.addEventListener("click",()=>{e.scrollBy({left:o,behavior:"smooth"})}),e.addEventListener("scroll",Dt),Dt()}function ui(){const e=document.getElementById("historyList"),n=document.getElementById("historyProfileSelect");if(!e||!n)return;const t=zt||me,o=Te[t]||[];if(o.length===0){e.innerHTML="<div class='password-meta'>No history for this profile yet.</div>";return}const r=new Date,u=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),v=u-864e5,x={today:[],yesterday:[],older:[]};o.forEach((k,$)=>{const R={...k,originalIndex:$},F=k.visitedAt||0;F>=u?x.today.push(R):F>=v?x.yesterday.push(R):x.older.push(R)});const B=k=>k.toLocaleDateString(void 0,{month:"short",day:"numeric"}),L=`Today - ${B(r)}`,y=`Yesterday - ${B(new Date(v))}`,C=(k,$,R=!1)=>{if($.length===0)return"";const F=$.map(W=>`
      <div class="history-item" data-index="${W.originalIndex}">
        <div class="history-main">
          <div class="history-title">${Ie(W.title||"Untitled")}</div>
          <div class="history-url">${Ie(W.url||"")}</div>
          <div class="password-meta">${Ie(ri(W.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `).join("");return`
      <details class="history-group" ${R?"open":""}>
        <summary class="history-group-title">
          <span>${k}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${$.length}</span>
        </summary>
        <div class="history-group-content">
          ${F}
        </div>
      </details>
    `};e.innerHTML=`
    ${C(L,x.today,x.today.length>0)}
    ${C(y,x.yesterday,!1)}
    ${C("Older",x.older,!1)}
  `,e.querySelectorAll(".history-item").forEach(k=>{k.addEventListener("click",$=>{const R=$.target.closest("button");if(!R)return;const F=Number(k.dataset.index);if(Number.isNaN(F))return;const W=Te[t]||[],Z=W[F];if(Z){if(R.dataset.action==="delete"){W.splice(F,1),Te[t]=W,rn(),ui();return}if(R.dataset.action==="open"){const le=ae[t]?.partition||ye.guest;Ae(Z.url,le,Z.title||"History",t)}}})})}async function at({title:e="Clear Page Cache",message:n="",confirmLabel:t="OK",cancelLabel:o="Cancel",hideCancel:r=!1}={}){const u=document.getElementById("cacheActionModal"),v=document.getElementById("cacheActionTitle"),x=document.getElementById("cacheActionMessage"),B=document.getElementById("cacheActionCloseBtn"),L=document.getElementById("cacheActionCancelBtn"),y=document.getElementById("cacheActionConfirmBtn");return!u||!v||!x||!B||!L||!y?Promise.resolve(window.confirm(n||e)):(v.textContent=e,x.textContent=n,y.textContent=t,L.textContent=o,L.style.display=r?"none":"inline-flex",await lt(()=>u.classList.remove("hidden")),new Promise(C=>{const k=()=>{B.removeEventListener("click",$),L.removeEventListener("click",$),y.removeEventListener("click",R),u.removeEventListener("click",F),Ze(()=>u.classList.add("hidden"))},$=()=>{k(),C(!1)},R=()=>{k(),C(!0)},F=W=>{W.target===u&&$()};B.addEventListener("click",$),L.addEventListener("click",$),y.addEventListener("click",R),u.addEventListener("click",F)}))}function Dt(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;if(!(e.scrollWidth>e.clientWidth+1)){n.classList.add("hidden"),t.classList.add("hidden"),e.scrollLeft=0;return}const r=e.scrollLeft<=1,u=e.scrollLeft+e.clientWidth>=e.scrollWidth-1;n.classList.toggle("hidden",r),t.classList.toggle("hidden",u)}function an(e){if(!e)return null;if(typeof e.getWebContentsId=="function")try{const n=e.getWebContentsId();if(n)return n}catch{}return e._webContent?e._webContent.key||e._webContent.id||null:e.key||e.id||e.getAttribute("key")||e.getAttribute("id")||null}async function Go(e,n){const t=oe.findIndex(r=>r.id===n),o=oe[t];if(e==="duplicate-tab"&&o){no(n);return}if(e==="inspect-local-file"&&o){const r=document.getElementById(`webview-${o.id}`),u=an(r);if(!u||!window.api?.toggleWebviewDevTools){qe(At?"Inspect is not available for this tab.":"Inspect is not available for this local file tab.","error");return}await window.api.toggleWebviewDevTools(u)||qe(At?"Could not open developer tools.":"Could not open developer tools for this local file.","error");return}if(e==="clear-cache"&&o){const r=document.getElementById(`webview-${o.id}`),u=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",v=r&&r.getAttribute("partition")||o.partition||ye.guest;if(!u||u==="about:blank"||!await at({title:"Clear Page Cache",message:`Clear cache and site data for ${u}?`,confirmLabel:"Clear Cache",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewPageCache!="function"){await at({title:"Action Unavailable",message:"Cache clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const B=await window.api.clearWebviewPageCache(v,u);B?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await at({title:"Could Not Clear Cache",message:B?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(B){const L=String(B?.message||B||""),y=/No handler registered for 'clear-webview-page-cache'/.test(L)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await at({title:"Could Not Clear Cache",message:`${L}${y}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-user-data"&&o){const r=document.getElementById(`webview-${o.id}`),u=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",v=r&&r.getAttribute("partition")||o.partition||ye.guest;if(!u||u==="about:blank"||!await at({title:"Clear User Data",message:`Clear local storage and site data for ${u}?`,confirmLabel:"Clear Data",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewUserData!="function"){await at({title:"Action Unavailable",message:"User-data clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const B=await window.api.clearWebviewUserData(v,u);B?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await at({title:"Could Not Clear User Data",message:B?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(B){const L=String(B?.message||B||""),y=/No handler registered for 'clear-webview-user-data'/.test(L)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await at({title:"Could Not Clear User Data",message:`${L}${y}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-all"){mt(oe.map(r=>r.id));return}if(e==="clear-right"&&t>=0){mt(oe.slice(t+1).map(r=>r.id));return}e==="clear-left"&&t>=0&&mt(oe.slice(0,t).map(r=>r.id))}function Jo(){const e=document.querySelector(".tabs-header");e&&e.addEventListener("contextmenu",async n=>{if(n.target.closest(".profile-section"))return;n.preventDefault();const r=n.target.closest(".tab")?.id?.replace("tab-ui-","")||We||oe[0]?.id||null;if(!r)return;Fn=r;const u=oe.findIndex(k=>k.id===r),v=oe[u],x=document.getElementById(`webview-${r}`),B=oo(v,x),L=!!(v&&!v.isHome&&(x&&x.getURL()!=="about:blank"||v.url)),y=u>0?u:0,C=u>=0&&u<oe.length-1?oe.length-u-1:0;window.api&&typeof window.api.showNativeTabContextMenu=="function"&&await window.api.showNativeTabContextMenu({anchorId:r,x:Math.round(n.x),y:Math.round(n.y),disabled:{clearLeft:y===0,clearRight:C===0,clearCache:!L,clearUserData:!L,inspectLocalFile:!B}})})}function Vt(e){if(!e)return"";const n=String(e.getData("text/uri-list")||"").split(/\r?\n/).map(u=>u.trim()).find(u=>u&&!u.startsWith("#"));if(n&&/^https?:\/\//i.test(n))return n;const o=String(e.getData("text/html")||"").match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);if(o&&/^https?:\/\//i.test(String(o[1]||"").trim()))return String(o[1]||"").trim();const r=String(e.getData("text/plain")||"").trim();return/^https?:\/\//i.test(r)?r:r&&!/\s/.test(r)&&/\./.test(r)?gt(r):""}function Xo(){const e=document.querySelector(".tabs-header");if(!e||e.dataset.dropBound==="1")return;e.dataset.dropBound="1";const n=t=>{e.classList.toggle("is-drop-target",!!t)};e.addEventListener("dragenter",t=>{Vt(t.dataTransfer)&&(t.preventDefault(),n(!0))}),e.addEventListener("dragover",t=>{Vt(t.dataTransfer)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),n(!0))}),e.addEventListener("dragleave",t=>{e.contains(t.relatedTarget)||n(!1)}),e.addEventListener("drop",t=>{const o=Vt(t.dataTransfer);if(n(!1),!o)return;t.preventDefault();const u=t.target.closest(".tab")?.id?.replace("tab-ui-","")||We,v=oe.findIndex(x=>x.id===u);Ae(o,null,"New Tab",null,{insertIndex:v>=0?v+1:oe.length})})}function Qo(e){const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");!n||!t||!n.contains(e.target)&&!t.contains(e.target)&&!t.classList.contains("hidden")&&Ze(()=>t.classList.add("hidden"))}async function Zo(e){const n=String(e?.action||"");if(!n||n==="__menu_closed__")return;const t=String(e?.anchorId||Fn||We||oe[0]?.id||"");t&&await Go(n,t)}const Un={desktop:{width:1920,height:1080,userAgent:"desktop"},mobile:{width:414,height:896,userAgent:"mobile"},tablet:{width:768,height:1024,userAgent:"tablet"}};async function pi(e,n="mobile"){if(!e)throw new Error("No active webview");const t=Un[n]||Un.mobile;if(console.log(`[Viewport] Setting ${n} viewport: ${t.width}x${t.height}`),window.api?.setWebviewBounds){const o=an(e);o&&(console.log(`[Viewport] Triggering native resize to ${t.width}x${t.height} for id: ${o}`),await window.api.setWebviewBounds(o,{width:t.width,height:t.height}))}return window.__oneview_original_webview_dims||(window.__oneview_original_webview_dims={width:e.style.width,height:e.style.height,minWidth:e.style.minWidth,minHeight:e.style.minHeight,maxWidth:e.style.maxWidth,maxHeight:e.style.maxHeight,flex:e.style.flex}),e.style.width=t.width+"px",e.style.height=t.height+"px",e.style.minWidth=t.width+"px",e.style.minHeight=t.height+"px",e.style.maxWidth=t.width+"px",e.style.maxHeight=t.height+"px",e.style.flex="none",console.log(`[Viewport] Resized webview element to ${t.width}x${t.height}`),await e.executeJavaScript(`
      (() => {
        // Store original viewport for restoration
        if (!window.__oneview_original_viewport) {
          window.__oneview_original_viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
          };
        }
        
        // Update/create meta viewport
        let metaViewport = document.querySelector('meta[name="viewport"]');
        if (!metaViewport) {
          metaViewport = document.createElement('meta');
          metaViewport.name = 'viewport';
          document.head.appendChild(metaViewport);
        }
        metaViewport.content = 'width=${t.width}, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        // Force body and html to take correct width but allow height to be scrollable
        document.documentElement.style.width = '${t.width}px';
        document.documentElement.style.height = 'auto'; // Reverted from fixed height
        document.documentElement.style.minHeight = '100vh';
        document.body.style.width = '${t.width}px';
        document.body.style.height = 'auto';
        document.body.style.minHeight = '100vh';
        
        console.log('[Viewport] ${n} viewport applied - window.innerWidth should now reflect ${t.width}');
        return { width: ${t.width}, height: ${t.height} };
      })();
    `,!0),await new Promise(o=>setTimeout(o,300)),t}async function er(e){if(e&&window.api?.setWebviewBounds){const n=document.getElementById("webviews-container"),t=an(e);if(n&&t){const o=n.getBoundingClientRect();await window.api.setWebviewBounds(t,{width:Math.round(o.width),height:Math.round(o.height)})}}}async function fi(e){if(console.log("[Viewport] Resetting to original viewport"),window.__oneview_original_webview_dims&&e){const n=window.__oneview_original_webview_dims;e.style.width=n.width,e.style.height=n.height,e.style.minWidth=n.minWidth,e.style.minHeight=n.minHeight,e.style.maxWidth=n.maxWidth,e.style.maxHeight=n.maxHeight,e.style.flex=n.flex,window.__oneview_original_webview_dims=null,await er(e),console.log("[Viewport] Webview element dimensions and native bounds restored")}await e.executeJavaScript(`
      (() => {
        if (window.__oneview_original_viewport) {
          document.documentElement.style.width = '';
          document.documentElement.style.height = '';
          document.body.style.width = '';
          document.body.style.height = '';
          
          let metaViewport = document.querySelector('meta[name="viewport"]');
          if (metaViewport) {
            metaViewport.content = 'width=device-width, initial-scale=1.0';
          }
          console.log('[Viewport] Viewport reset to original');
        }
        return true;
      })();
    `,!0),await new Promise(n=>setTimeout(n,500))}async function tr(e={}){const n=Ye();if(!n||typeof n.executeJavaScript!="function")throw new Error("Active tab is unavailable");if(typeof n.capturePage!="function")throw new Error("Active tab does not support capture");const t=String(e?.viewport||"desktop").trim().toLowerCase();if(console.log("[Capture] Active webview found",{id:n.id,url:n.getURL?.(),title:n.getTitle?.(),viewport:t,loading:n._webContent?.state?.loading}),t==="mobile"||t==="tablet"){const q=t==="tablet"?"tablet":"mobile";await pi(n,q),console.log("[Capture] Viewport changed to "+q+", waiting for page reflow..."),await new Promise(se=>setTimeout(se,300))}const o=5e3,r=Date.now();for(;n._webContent?.state?.loading&&Date.now()-r<o;)console.log("[Capture] Waiting for page to load..."),await new Promise(q=>setTimeout(q,200));console.log("[Capture] Page load status:",n._webContent?.state?.loading?"still loading":"loaded");const u=String(e?.mode||"visible").trim().toLowerCase();if(u!=="full"&&u!=="fullpage"){const q=await n.capturePage(),se=q?.isEmpty?.()?"":q.toDataURL();return console.log("[CapturePage] Visible captured. DataUrl length:",se?.length||0),{mode:"visible",dataUrl:se,width:q?.getSize?.()?.width||0,height:q?.getSize?.()?.height||0}}const v=await n.executeJavaScript(`
      (() => {
        const root = document.scrollingElement || document.documentElement || document.body;
        const body = document.body || root;
        return {
          scrollX: Number(window.scrollX || 0),
          scrollY: Number(window.scrollY || 0),
          viewportWidth: Math.max(1, Number(window.innerWidth || root.clientWidth || 0)),
          viewportHeight: Math.max(1, Number(window.innerHeight || root.clientHeight || 0)),
          totalWidth: Math.max(
            Number(root.scrollWidth || 0),
            Number(root.clientWidth || 0),
            Number(body.scrollWidth || 0),
            Number(body.clientWidth || 0)
          ),
          totalHeight: Math.max(
            Number(root.scrollHeight || 0),
            Number(root.clientHeight || 0),
            Number(body.scrollHeight || 0),
            Number(body.clientHeight || 0)
          ),
        };
      })();
    `,!0);Math.max(1,Number(v?.totalWidth||0));let x=Math.max(1,Number(v?.totalHeight||0));Math.max(1,Number(v?.viewportWidth||0));let B=Math.max(1,Number(v?.viewportHeight||0));if(console.log("[FullCapture] Starting capture process..."),console.log("[FullCapture] Initial metrics:",v),await n.executeJavaScript(`
    (() => {
      const style = document.createElement('style');
      style.id = '__oneview_force_auto_scroll__';
      style.textContent = 'html, body, * { scroll-behavior: auto !important; }';
      (document.head || document.documentElement).appendChild(style);
    })();
  `,!0).catch(()=>{}),x>B+100){console.log("[FullCapture] Verifying scroll functionality...");const se=await n.executeJavaScript(`
      (() => {
        const startY = (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
        try {
          window.scrollTo({ top: startY + 50, behavior: 'auto' });
          if (document.documentElement) document.documentElement.scrollTop = startY + 50;
          if (document.body) document.body.scrollTop = startY + 50;
          if (document.scrollingElement) document.scrollingElement.scrollTop = startY + 50;
        } catch(e) {}
        const endY = (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
        return { startY, endY };
      })();
    `,!0).catch(()=>null);console.log("[FullCapture] Verification scroll results:",se);const Se=Number(se?.startY||0),ke=Number(se?.endY||0);if(ke-Se<10)throw new Error("Scroll verification failed: page did not scroll (startY="+Se+", endY="+ke+"). Capture aborted to prevent repeating/empty fallback images.");await n.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `,!0).catch(()=>{})}const L=Math.floor(B*.8),y=Math.ceil(x/L);console.log("[FullCapture] Progressive scroll: "+y+" steps, "+L+"px per step");let C=0;for(let q=0;q<y;q++){C=Math.min(C+L,x),console.log(`[FullCapture] Scrolling host-driven to ${C}px (${q+1}/${y})`);const se=`
      (() => {
        const targetY = ${C};
        try {
          window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
        } catch(e) {}
        try {
          if (document.documentElement) document.documentElement.scrollTop = targetY;
        } catch(e) {}
        try {
          if (document.body) document.body.scrollTop = targetY;
        } catch(e) {}
        try {
          if (document.scrollingElement) document.scrollingElement.scrollTop = targetY;
        } catch(e) {}
        return (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
      })();
    `;await n.executeJavaScript(se,!0).catch(()=>{}),await new Promise(Se=>setTimeout(Se,600))}await n.executeJavaScript(`window.scrollTo({ top: ${x}, left: 0, behavior: 'auto' });`,!0).catch(()=>{}),await new Promise(q=>setTimeout(q,800)),await n.executeJavaScript(`
    (() => {
      const STYLE_ID = '__oneview_full_capture_style__';
      const captureStyle = document.createElement('style');
      captureStyle.id = STYLE_ID;
      captureStyle.textContent = 'html, body, * { scroll-behavior: auto !important; animation-play-state: paused !important; transition: none !important; } html, body { overflow: hidden !important; }';
      (document.head || document.documentElement).appendChild(captureStyle);

      if (!window.__oneview_js_frozen) {
        window.__oneview_js_frozen = true;
        window.stop();
        window.__oneview_backup = {
          setTimeout: window.setTimeout,
          setInterval: window.setInterval,
          requestAnimationFrame: window.requestAnimationFrame,
          XMLHttpRequest: window.XMLHttpRequest,
          fetch: window.fetch
        };
        window.setTimeout = () => 0;
        window.setInterval = () => 0;
        window.requestAnimationFrame = () => 0;
        window.XMLHttpRequest = function() { throw new Error('disabled'); };
        window.fetch = () => Promise.reject(new Error('disabled'));
      }
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Scrolling back to top...");const k=`
    (() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch(e) {}
      try {
        if (document.documentElement) document.documentElement.scrollTop = 0;
      } catch(e) {}
      try {
        if (document.body) document.body.scrollTop = 0;
      } catch(e) {}
      try {
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      } catch(e) {}
      return (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
    })();
  `;await n.executeJavaScript(k,!0).catch(()=>{});let $=0,R=!1;for(;!R&&$<50;)await n.executeJavaScript("(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)",!0).catch(()=>0)<=5?R=!0:(await n.executeJavaScript(k,!0).catch(()=>{}),await new Promise(se=>setTimeout(se,100)),$++);await n.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");const F=Number(e?.wait||0)*1e3,W=200+F;console.log(`[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${W}ms (Base 0.2s + User ${F}ms) for page to settle live...`),await new Promise(q=>setTimeout(q,W));let Z="",le=null;try{console.log("[FullCapture] Calling native one-shot capture..."),le=await n.capturePage({mode:"full",scrollHeight:Math.round(x)}),Z=le?.isEmpty?.()?"":le.toDataURL()}finally{console.log("[FullCapture] Restoring original body and globals..."),await n.executeJavaScript(`
        (() => {
          if (window.__oneview_backup) {
            window.setTimeout = window.__oneview_backup.setTimeout;
            window.setInterval = window.__oneview_backup.setInterval;
            window.XMLHttpRequest = window.__oneview_backup.XMLHttpRequest;
            window.fetch = window.__oneview_backup.fetch;
            delete window.__oneview_backup;
          }
          
          // No body swap needed - live page was modified directly

          window.__oneview_js_frozen = false;
          window.__oneview_capture_in_progress = false;
          
          document.getElementById("__oneview_full_capture_style__")?.remove();
          document.querySelectorAll("[data-oneview-scroll-restore-id]").forEach((node) => {
            node.removeAttribute("data-oneview-scroll-restore-id");
          });
          window.dispatchEvent(new Event('scroll'));
          window.dispatchEvent(new Event('resize'));
          return true;
        })();
      `,!0).catch(()=>{}),(t==="mobile"||t==="tablet")&&await fi(n),await n.executeJavaScript(`
        window.scrollTo(${Math.round(Number(v?.scrollX||0))}, ${Math.round(Number(v?.scrollY||0))});
      `,!0).catch(()=>{})}if(!Z)throw new Error("Full page capture returned empty image data");return{mode:"full",dataUrl:Z,width:le?.getSize?.()?.width||0,height:le?.getSize?.()?.height||0,tileCount:1}}async function nr(e){const n=String(e?.command||"").trim(),t=String(e?.url||"").trim(),o=String(e?.requestId||"").trim();if(!n)return;if(n==="execute-script"){const y=String(e?.source||"");let C={requestId:o,success:!1,message:"No active tab"};try{const k=Ye();if(!k||typeof k.executeJavaScript!="function")C={requestId:o,success:!1,message:"Active tab is unavailable"};else{const $=`
          (() => {
            const run = () => {
              ${y}
            };
            return run();
          })();
        `,R=await k.executeJavaScript($,!0);C={requestId:o,success:!0,result:R}}}catch(k){C={requestId:o,success:!1,message:k?.message||String(k)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(C);return}if(n==="ui-prompt"){let y={requestId:o,success:!1,message:"Prompt request failed"};try{const C=await xo(e?.prompt||{});y={requestId:o,success:!0,result:C}}catch(C){y={requestId:o,success:!1,message:C?.message||String(C)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(y);return}if(n==="capture-page"){let y={requestId:o,success:!1,message:"Capture request failed",key:e?.key||"view:extension-popup"};try{const C=String(e?.options?.mode||"visible").trim().toLowerCase(),k=String(e?.options?.viewport||"desktop").trim().toLowerCase(),$=Number(e?.options?.wait||0);if(console.log("[View] Capturing mode:",C,"viewport:",k,"wait:",$),C==="full"||C==="fullpage"){console.log("[View] Using full-page capture function");const R=await tr({mode:C,viewport:k,wait:$});y={requestId:o,success:!0,result:R,key:e?.key||"view:extension-popup"}}else{const R=Ye();if(!R||typeof R.capturePage!="function")throw new Error("Active tab does not support capture");if(console.log("[View] Capturing visible area from webview id:",R.id),k==="mobile"||k==="tablet"){const le=k==="tablet"?"tablet":"mobile";await pi(R,le),console.log("[View] Viewport changed to "+le+", waiting for page reflow..."),await new Promise(q=>setTimeout(q,800))}const F=await R.capturePage(),W=F?.isEmpty?.()?"":F.toDataURL?.();console.log("[View] Visible capture dataUrl length:",W?.length||0);const Z={mode:"visible",dataUrl:W,width:F?.getSize?.()?.width||0,height:F?.getSize?.()?.height||0};(k==="mobile"||k==="tablet")&&await fi(R),y={requestId:o,success:!0,result:Z,key:e?.key||"view:extension-popup"}}}catch(C){console.error("[View] Capture error:",C),y={requestId:o,success:!1,message:C?.message||String(C),key:e?.key||"view:extension-popup"}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(y);return}if(n==="tabs-create"){const y=String(e.url||"").trim(),C=e.requestId;let k=e.partition||null;if(!k&&y.startsWith(`${Ii}://`))try{k=`ext-${new URL(y).host}`}catch{}const $=k?wt(k):"",R=oe.find(F=>F.url&&F.url.includes("result.html")&&(!$||wt(F.partition||"")===$));R?(console.log("[View] Reusing existing result tab:",R.id),await ro(R.id,y,k,"Result"),e.active!==!1&&await ze(R.id)):await Ae(y,k,"Result",null,{active:e.active!==!1,extensionEntryPath:e.entryPath}),C&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:C,success:!0});return}if(n==="tabs-close"){let y={requestId:o,success:!1,message:"Tab not found"};try{const C=String(e?.tabId||"").trim();oe.find($=>$.id===C)?(Zt(C),y={requestId:o,success:!0,result:{id:C,closed:!0}}):y={requestId:o,success:!1,message:"Tab not found"}}catch(C){y={requestId:o,success:!1,message:C?.message||String(C)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(y);return}if(!t)return;const r=tt(),u=Ye(),v=r?.partition||ae[me]?.partition||ye.guest,x=/^file:\/\//i.test(t),B={extensionEntryPath:x?String(e?.entryPath||"").trim():"",extensionActiveContext:{url:String(u?.getURL?.()||r?.url||"").trim(),title:String(u?.getTitle?.()||r?.title||"").trim()},active:e?.active!==!1};if(x){const y=oe.find(C=>C.url===t);if(y){await ze(y.id),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:y.id,url:t,title:y.title||"New Tab",active:!0}});return}}if(n==="tabs-update"&&r&&!r.isHome&&!r.nativePage){await xt(t,v,"New Tab",null,B),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:r.id,url:t,title:r.title||"New Tab",active:!0}});return}r?.id;const L=Ae(t,v,"New Tab",null,B);o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:L?.id||"",url:t,title:L?.title||"New Tab",active:e?.active!==!1}})}function ir(){Pn||(Pn=!0,document.addEventListener("click",Qo),document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const n=String(e.key||"").toLowerCase();if(!(!(e.key==="Tab"||e.key==="PageUp"||e.key==="PageDown")&&fo(e.target))){if(n==="h"&&!e.shiftKey){e.preventDefault(),Kt("history");return}if(n==="d"&&e.shiftKey){e.preventDefault(),Kt("downloads");return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation(),Lt(e.shiftKey?-1:1);return}if(e.key==="PageUp"){e.preventDefault(),e.stopPropagation(),Lt(-1);return}e.key==="PageDown"&&(e.preventDefault(),e.stopPropagation(),Lt(1))}},!0),window.addEventListener("resize",Dt),Xo(),window.api&&typeof window.api.onViewTabShortcut=="function"&&window.api.onViewTabShortcut(e=>{const n=Number(e?.direction||0);n&&Lt(n<0?-1:1)}),window.api&&typeof window.api.onBrowserExtensionsUpdated=="function"&&window.api.onBrowserExtensionsUpdated(()=>{console.log("Browser extensions updated, refreshing UI..."),zn().catch(()=>{})}),window.api&&typeof window.api.onNativeTabContextAction=="function"&&window.api.onNativeTabContextAction(e=>{Zo(e).catch(()=>{})}),window.api&&typeof window.api.onBrowserExtensionCommand=="function"&&window.api.onBrowserExtensionCommand(e=>{nr(e).catch(n=>{console.error("Browser extension command failed",n)})}))}let jt,Nn;const On=new ResizeObserver(()=>{const e=Ye();!e||typeof e.syncBounds!="function"||(e.syncBounds(!0),clearInterval(jt),clearTimeout(Nn),jt=setInterval(()=>{const n=Ye();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},50),Nn=setTimeout(()=>{clearInterval(jt);const n=Ye();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},350))});(function(){const n=document.getElementById("webviews-container");if(n){On.observe(n);return}const t=new MutationObserver(()=>{const o=document.getElementById("webviews-container");o&&(t.disconnect(),On.observe(o))});t.observe(document.documentElement,{childList:!0,subtree:!0})})();window.enterSiteSnapStudioMode=function(){document.body.classList.add("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.add("sitesnap-studio-mode");try{window.parent.document.body.classList.add("sitesnap-studio-active")}catch(n){console.error("Failed to set parent active layout",n)}};window.exitSiteSnapStudioMode=function(){document.body.classList.remove("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.remove("sitesnap-studio-mode");try{window.parent.document.body.classList.remove("sitesnap-studio-active")}catch(n){console.error("Failed to remove parent active layout",n)}};
