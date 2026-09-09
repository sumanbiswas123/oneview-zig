import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{c as gn,d as yi,s as Si,t as Ei,o as lt,b as et,e as Ce}from"./utils-BZXZwSp-.js";import{s as Ke}from"./notifications-CBkElf_0.js";import{i as wn,l as xi,q as Ci}from"./api-query-CnFqXUJs.js";import{n as gt,R as Ii,i as Bt,b as Li,I as At}from"./app-env-Cwx6WtbG.js";import{S as tt,P as be}from"./app-runtime-CI2L9vDX.js";function ki({state:e,constants:n,escapeHtml:t,showToast:o,isPerfEnabled:r,formatDownloadBytes:d,formatDownloadSpeed:v,formatDownloadEta:x,formatHistoryTime:B,loadManagedDownloadsFromMain:P,refreshExtensionsManagerList:S,saveProfileHistoryStore:C,getActiveTab:L,updateTabTitle:D,createTab:R,switchTab:F,navigateTo:V}){const{PROFILES:ee,PARTITIONS:le}=n;function j(f=""){const T=String(f||"").trim().toLowerCase();return["downloads","history","extensions","passwords","about"].includes(T)?T:"extensions"}function ae(f="extensions"){const T=j(f);return T==="downloads"?"Downloads":T==="history"?"History":T==="passwords"?"Passwords":T==="extensions"?"Extensions":T==="about"?"About & Updates":"Extensions"}function Ie(f="extensions"){const T=j(f);return T==="downloads"?"Ctrl+Shift+D":T==="history"?"Ctrl+H":T==="extensions"?"Ctrl+E":""}function Le(f){const T=f instanceof Element?f:null;return T?T.closest("input, textarea, select")?!0:T.isContentEditable===!0:!1}function nt(f="settings",T="extensions"){return{type:String(f||"settings").trim().toLowerCase(),section:j(T)}}function je(f="extensions"){const T=j(f);return e.tabs.find(E=>E?.nativePage?.type==="settings"&&j(E?.nativePage?.section)===T)||null}function K(f){return f?.nativePage?.type==="settings"}async function me(){if(!window.api)return e.nativeSettingsGeneralInfo;try{if(!e.nativeSettingsGeneralInfo.version&&window.api.getAppVersion&&(e.nativeSettingsGeneralInfo.version=await window.api.getAppVersion()),!e.nativeSettingsGeneralInfo.defaultOpenStatus&&window.api.getDefaultOpenHandlingStatus){const f=await window.api.getDefaultOpenHandlingStatus();e.nativeSettingsGeneralInfo.defaultOpenStatus=f?.isDefault||f?.success?"Configured":"Needs setup"}}catch{}return e.nativeSettingsGeneralInfo}function ze(){return Object.entries(e.profileHistoryCache||{}).flatMap(([f,T])=>(Array.isArray(T)?T:[]).map(E=>({profileId:f,profileName:ee[f]?.name||f||"Unknown",url:String(E?.url||"").trim(),title:String(E?.title||"Untitled").trim()||"Untitled",visitedAt:E?.visitedAt?Number(E.visitedAt):0}))).filter(f=>f.url&&f.visitedAt).sort((f,T)=>Number(T.visitedAt||0)-Number(f.visitedAt||0))}function ke(f){const T=new Date(Number(f||0));if(Number.isNaN(T.getTime()))return"Unknown Date";const E=new Date,A=new Date(E.getFullYear(),E.getMonth(),E.getDate()).getTime(),M=new Date(T.getFullYear(),T.getMonth(),T.getDate()).getTime(),Q=A-1440*60*1e3;return M===A?"Today":M===Q?"Yesterday":T.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function Ee(f=[]){const T=[],E=new Map;return f.forEach(A=>{const M=ke(A.visitedAt);if(!E.has(M)){const Q={key:`${M}-${A.visitedAt}`,label:M,entries:[]};E.set(M,Q),T.push(Q)}E.get(M).entries.push(A)}),T}function Pe(){return e.managedDownloadsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.managedDownloadsCache.map(f=>{const T=f.totalBytes?Math.max(0,Math.min(100,Math.round(f.receivedBytes/f.totalBytes*100))):f.state==="completed"?100:0,E=f.totalBytes?`${d(f.receivedBytes)} / ${d(f.totalBytes)}`:d(f.receivedBytes),A=f.state==="progressing"?`${v(f.bytesPerSecond)} - ${x(f.etaSeconds)}`:f.state==="completed"?`Saved to ${t(f.savePath||"")}`:t(String(f.state||"Unknown"));return`
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
                <div class="native-settings-progress"><span style="width:${T}%"></span></div>
              </article>
            `}).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No downloads yet.</div>'}function Xe(){const f=e.historySearchQuery.trim().toLowerCase(),T=ze().filter(A=>f?`${A.title||""} ${A.url||""} ${A.profileName||""}`.toLowerCase().includes(f):!0);return T.length?`
      <div class="native-history-flat-list">
        ${Ee(T).map(A=>`
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${t(A.label)}</span>
                </div>
                ${A.entries.map(M=>`
                      <article class="native-history-entry">
                        <div class="native-history-entry-content">
                          <div class="native-history-entry-title">${t(M.title||"Untitled")}</div>
                          <div class="native-history-entry-url">${t(M.url||"")}</div>
                          <div class="native-history-entry-meta">${t(M.profileName)} • ${t(B(M.visitedAt))}</div>
                        </div>
                        <div class="native-history-entry-actions">
                          <button class="native-settings-action" type="button" data-native-history-action="open" data-history-time="${t(M.visitedAt||"")}" data-profile-id="${t(M.profileId)}">Open</button>
                          <button class="native-settings-action" type="button" data-native-history-action="delete" data-history-time="${t(M.visitedAt||"")}" data-profile-id="${t(M.profileId)}">Delete</button>
                        </div>
                      </article>
                    `).join("")}
              </div>
            `).join("")}
      </div>
    `:`<div class="native-settings-empty">${f?"No history matches your search.":"No history yet."}</div>`}function qe(){return e.browserExtensionsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.browserExtensionsCache.map(f=>{const T=(function(){try{const E=String(localStorage.getItem("userRole")||"production").toLowerCase(),A=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();return E==="dev"&&A==="dev"}catch{return!1}})();return`
              <article class="native-settings-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.name||"Unnamed Extension")}</div>
                    <div class="native-settings-row-note">${t(f.id||"")}</div>
                    ${T?`<div class="native-settings-row-note">${t(f.path||"")}</div>`:""}
                  </div>
                  <div class="native-settings-inline-actions">
                    <button class="native-settings-action" type="button" data-native-extension-action="more" data-extension-path="${t(f.path||"")}">More</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="${f.enabled===!1?"enable":"disable"}" data-extension-path="${t(f.path||"")}">${f.enabled===!1?"Enable":"Disable"}</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="reload" data-extension-path="${t(f.path||"")}">Reload</button>
                    ${T?`<button class="native-settings-action" type="button" data-native-extension-action="remove" data-extension-path="${t(f.path||"")}">Remove</button>`:""}
                  </div>
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No extensions installed yet.</div>'}function Fe(){const f=e.credentialCache||{},T=[];return Object.entries(f).forEach(([A,M])=>{(M||[]).forEach((Q,ie)=>{T.push({key:`${A}:${ie}`,profileId:A,domain:String(Q.domain||"").toLowerCase(),username:String(Q.username||""),password:String(Q.password||"")})})}),`
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
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${Object.entries(ee).map(([A,M])=>`
        <label class="profile-pill-item" style="cursor: pointer;" data-profile-id="${t(A)}">
          <input type="radio" name="nativePasswordProfile" value="${t(A)}" ${A===(e.passwordProfileId||e.currentProfileId||"guest")?"checked":""} style="cursor: pointer;" />
          <span class="profile-pill-dot" style="background-color: ${t(M.color||"#000")}"></span>
          <span>${t(M.name||"")}</span>
        </label>
      `).join("")}</div>
          </div>
          <button type="submit" class="native-settings-action" style="grid-column: 1 / -1; background: #3b82f6; color: white; font-weight: 600; padding: 10px 14px;">Save Credential</button>
        </form>
 
        <div class="native-settings-section-head" style="margin-top: 24px;">
          <h3>Saved Passwords</h3>
          <p>${T.length} credential${T.length!==1?"s":""} stored</p>
        </div>
        
        ${T.length===0?'<div class="native-settings-empty">No saved credentials yet. Add one above.</div>':`<div class="password-list">
              ${T.map(A=>`
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
    `}async function $e(){if(window.api?.listProfileCredentials)try{const f=await window.api.listProfileCredentials();if(f&&Array.isArray(f.data)){const T={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};f.data.forEach(E=>{const A=String(E.profileId||"").toLowerCase();T[A]||(T[A]=[]),T[A].push(E)}),e.credentialCache=T}}catch(f){console.error("loadCredentialsIntoCache error:",f)}}function xe(f){const T=document.getElementById("nativeTabContent");if(!T||!K(f))return;const E=j(f.nativePage?.section);let A="",M="";const Q=ae(E);let ie="Manage app behavior without leaving the browser shell.";if(E==="downloads"){const Z=e.managedDownloadsCache.length,oe=e.managedDownloadsCache.filter(u=>u.state==="progressing").length;A=Pe(),ie=`${oe} active, ${Z} total downloads.`}else if(E==="history"){const Z=ze(),oe=e.historySearchQuery.trim()?Z.filter(u=>`${u.title||""} ${u.url||""} ${u.profileName||""}`.toLowerCase().includes(e.historySearchQuery.trim().toLowerCase())).length:Z.length;M=`
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
      `,A=Xe(),ie=`${oe} total history entries across all profiles.`}else if(E==="extensions"){const Z=e.browserExtensionsCache.filter(oe=>oe.enabled!==!1).length;M=`
        <div class="native-settings-toolbar">
          ${(function(){try{const oe=String(localStorage.getItem("userRole")||"production").toLowerCase(),u=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();return oe==="dev"&&u==="dev"?'<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>':""}catch{return""}})()}
        </div>
      `,A=qe(),ie=`${Z} enabled out of ${e.browserExtensionsCache.length} extensions.`}else E==="passwords"?(A=Fe(),ie="Manage saved passwords securely.",e._credentialsLoaded||(e._credentialsLoaded=!0,$e().then(()=>{xe(f)}))):E==="about"?(e._aboutInfoLoaded||(e._aboutInfoLoaded=!0,me().then(()=>{xe(f)})),A=Ue(),ie=`OneView v${e.nativeSettingsGeneralInfo?.version||"1.3.7"} • Check for updates and system configuration.`):e._credentialsLoaded=!1;T.innerHTML=`
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${t(Q)}</h2>
                <p>${t(ie)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions","history","downloads","passwords","about"].map(Z=>{const oe=Ie(Z);return`
                    <button
                      type="button"
                      class="native-settings-chip ${Z===E?"is-active":""}"
                      data-native-settings-nav="${Z}"
                      title="${t(ae(Z))}${oe?` (${oe})`:""}"
                    >
                      <span>${t(ae(Z))}</span>
                      ${oe?`<span class="native-settings-chip-shortcut">${t(oe)}</span>`:""}
                    </button>
                  `}).join("")}
            </div>
            ${M}
          </div>
          <div class="native-settings-body">
            ${A}
          </div>
        </section>
      </div>
    `}function Ue(){const f=e.nativeSettingsGeneralInfo?.version||"1.3.7",T=e.nativeSettingsGeneralInfo?.defaultOpenStatus||"Configured";return`
      <section class="native-settings-section">
        <div class="native-settings-section-head">
          <h3>OneView App & Updates</h3>
          <p>Application version, update status, and system configurations</p>
        </div>
        <div class="native-settings-list">
          <article class="native-settings-row">
            <div class="native-settings-row-main">
              <div>
                <div class="native-settings-row-title">Version</div>
                <div class="native-settings-row-note">v${t(f)}</div>
              </div>
              <div class="native-settings-inline-actions">
                <button class="native-settings-action" type="button" data-native-settings-action="check-updates">Check for updates</button>
              </div>
            </div>
          </article>
          <article class="native-settings-row">
            <div class="native-settings-row-main">
              <div>
                <div class="native-settings-row-title">Default Browser</div>
                <div class="native-settings-row-note">${t(T)}</div>
              </div>
              <div class="native-settings-inline-actions">
                <button class="native-settings-action" type="button" data-native-settings-action="open-default-apps">Open Default Apps Settings</button>
              </div>
            </div>
          </article>
        </div>
      </section>
    `}async function Se(){const f=L();K(f)&&xe(f)}function We(f="extensions",T=e.activeTabId){const E=e.tabs.find(M=>M.id===T);if(!K(E))return;const A=j(f);E.nativePage.section=A,D(E.id,ae(A)),E.id===e.activeTabId&&xe(E)}function _e(f="extensions"){const T=je(f);if(T){F(T.id);return}R(null,null,ae(f),null,{nativePage:nt("settings",f)})}function Qe(){const f=document.getElementById("settingsBtn");f&&f.dataset.boundClick!=="1"&&(f.dataset.boundClick="1",f.addEventListener("click",()=>{_e("extensions")}))}function ot(){const f=document.getElementById("nativeTabContent");if(!f||f.dataset.boundNativeSettings==="1")return;f.dataset.boundNativeSettings="1",window.addEventListener("credentials-updated",()=>{e._credentialsLoaded=!1;const E=L();K(E)&&E.nativePage?.section==="passwords"&&$e().then(()=>{xe(E)})});const T=(E=null,A=null)=>{requestAnimationFrame(()=>{const M=document.getElementById("nativeHistorySearchInput");if(M&&(M.focus({preventScroll:!0}),Number.isInteger(E)&&Number.isInteger(A)&&typeof M.setSelectionRange=="function"))try{M.setSelectionRange(E,A)}catch{}})};f.addEventListener("click",async E=>{const A=E.target.closest(".password-visibility-toggle");if(A){E.preventDefault();const c=document.getElementById("nativePasswordSecretInput");if(c){const b=c.type==="password";c.type=b?"text":"password",A.innerHTML=b?`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          `:`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          `}return}const M=E.target.closest(".password-list-toggle-eye");if(M){E.preventDefault();const c=M.parentNode.querySelector(".password-secret");if(c){const b=c.dataset.password||"";c.textContent==="••••••••"?(c.textContent=b,M.innerHTML=`
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            `):(c.textContent="••••••••",M.innerHTML=`
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            `)}return}const Q=E.target.closest("[data-native-settings-nav]");if(Q){We(Q.dataset.nativeSettingsNav||"extensions");return}const ie=E.target.closest("[data-native-settings-action]");if(ie){const c=String(ie.dataset.nativeSettingsAction||"").trim();try{if(c==="check-updates"&&window.api?.checkForUpdates)if(typeof window.triggerManualSystemUpdateCheck=="function")await window.triggerManualSystemUpdateCheck();else{o("Checking for OneView updates...","info",3e3);try{const b=await window.api.checkForUpdates();b&&b.updateAvailable?o(`Update v${b.latestVersion||b.version||""} is available!`,"info",5e3):o("OneView is already up to date.","success",4e3)}catch(b){o(b?.message||"Could not check for updates.","error",4e3)}}else c==="open-default-apps"&&window.api?.openDefaultAppSettings?await window.api.openDefaultAppSettings():c==="load-unpacked-extension"&&window.api?.addBrowserExtensionsUnpacked?(await window.api.addBrowserExtensionsUnpacked(),await S(),await Se(),o("Unpacked extensions loaded.","success")):c==="clear-history"&&(Object.keys(e.profileHistoryCache||{}).forEach(b=>{e.profileHistoryCache[b]=[]}),C(),xe(L()))}catch(b){o(b?.message||"Could not complete settings action.","error")}return}const Z=E.target.closest("[data-native-download-action]");if(Z){try{const c=await window.api?.runManagedDownloadAction?.({id:String(Z.dataset.downloadId||"").trim(),action:String(Z.dataset.nativeDownloadAction||"").trim()});Array.isArray(c?.downloads)?e.managedDownloadsCache=c.downloads:await P(),await Se()}catch(c){o(c?.message||"Could not complete download action.","error")}return}const oe=E.target.closest("[data-native-history-action]");if(oe){const c=String(oe.dataset.profileId||e.historyProfileId||e.currentProfileId),b=String(oe.dataset.historyTime||""),I=(e.profileHistoryCache[c]||[]).findIndex(O=>String(O.visitedAt||"")===b),k=I>=0?(e.profileHistoryCache[c]||[])[I]:null;if(!k)return;if(oe.dataset.nativeHistoryAction==="delete")e.profileHistoryCache[c].splice(I,1),C(),e.historyProfileId=c,xe(L());else{const O=ee[c]?.partition||le.guest;R(k.url,O,k.title||"History",c)}return}const u=E.target.closest("[data-native-extension-action]");if(u){const c=String(u.dataset.nativeExtensionAction||"").trim(),b=String(u.dataset.extensionPath||"").trim();try{c==="more"&&window.api?.getExtensionShortcutsInfo?await he(b):c==="reload"&&window.api?.reloadBrowserExtension?(await window.api.reloadBrowserExtension({path:b}),o("Extension reloaded.","success")):(c==="enable"||c==="disable")&&window.api?.toggleBrowserExtension?(c==="disable"&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.toggleBrowserExtension({path:b,enabled:c==="enable"})):c==="remove"&&window.api?.removeBrowserExtension&&(typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.removeBrowserExtension({path:b})),await S(),await Se()}catch(I){o(I?.message||"Could not complete extension action.","error")}}}),f.addEventListener("input",E=>{const A=E.target.closest("#nativeHistorySearchInput");if(A){const Q=Number.isInteger(A.selectionStart)?A.selectionStart:null,ie=Number.isInteger(A.selectionEnd)?A.selectionEnd:Q;e.historySearchQuery=String(A.value||""),xe(L()),T(Q,ie);return}const M=E.target.closest("input[name='nativePasswordProfile']");if(M){e.passwordProfileId=String(M.value||"");return}}),f.addEventListener("submit",async E=>{const A=E.target.closest("#nativePasswordForm");if(!A)return;E.preventDefault();const M=document.getElementById("nativePasswordDomainInput"),Q=document.getElementById("nativePasswordUsernameInput"),ie=document.getElementById("nativePasswordSecretInput");if(!M||!Q||!ie)return;const Z=String(M.value||"").trim().toLowerCase(),oe=String(Q.value||"").trim(),u=String(ie.value||""),c=e.passwordProfileId||e.currentProfileId||"guest";if(!Z||!oe||!u){o("Please fill in all fields.","error");return}try{if(!window.api?.saveProfileCredential){o("Credential API unavailable.","error");return}const b=await window.api.saveProfileCredential({profileId:c,domain:Z,username:oe,password:u});if(!b||!b.success){o("Failed to save credential.","error");return}await $e(),o("Credential saved successfully.","success"),A.reset(),xe(L())}catch(b){o(b?.message||"Could not save credential.","error")}}),f.addEventListener("click",async E=>{const A=E.target.closest(".password-action-btn");if(!A)return;const M=String(A.dataset.action||"").trim(),Q=A.closest(".password-item"),ie=String(Q?.dataset.key||""),[Z,oe]=ie.split(":"),u=Number(oe);if(!Z||Number.isNaN(u))return;const b=((e.credentialCache||{})[Z]||[])[u];if(b)try{if(M==="delete"){if(!window.api?.deleteProfileCredential){o("Credential API unavailable.","error");return}const I=await window.api.deleteProfileCredential({profileId:Z,domain:String(b.domain||"").toLowerCase(),username:String(b.username||"")});if(!I||!I.success){o("Failed to delete credential.","error");return}await $e(),o("Credential deleted successfully.","success"),xe(L())}else if(M==="edit"){const I=document.getElementById("nativePasswordDomainInput"),k=document.getElementById("nativePasswordUsernameInput"),O=document.getElementById("nativePasswordSecretInput"),Y=document.getElementById("nativePasswordProfileSelect");if(!I||!k||!O)return;e.passwordProfileId=Z,I.value=String(b.domain||"").toLowerCase(),k.value=String(b.username||""),O.value=String(b.password||""),Y&&(Y.innerHTML=Object.entries(ee||{}).map(([a,g])=>`
                <label class="profile-pill-item ${a===Z?"active":""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${t(a)}" ${a===Z?"checked":""} style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${t(g.color||"#000")}"></span>
                  <span>${t(g.name||"")}</span>
                </label>
              `).join(""),Y.addEventListener("change",a=>{const g=a.target.value;g&&(e.passwordProfileId=g)})),document.getElementById("nativePasswordForm")?.scrollIntoView({behavior:"smooth"}),I.focus()}}catch(I){o(I?.message||"Could not complete password action.","error")}})}function it(){document.addEventListener("keydown",f=>{Le(f.target)||f.ctrlKey&&((f.key==="H"||f.key==="h")&&!f.shiftKey?(f.preventDefault(),_e("history")):(f.key==="E"||f.key==="e")&&!f.shiftKey?(f.preventDefault(),_e("extensions")):(f.key==="D"||f.key==="d")&&f.shiftKey&&(f.preventDefault(),_e("downloads")))})}async function he(f=""){const T=document.getElementById("extensionDetailsModal"),E=document.getElementById("extensionDetailsCloseBtn"),A=document.getElementById("extensionDetailsContent"),M=document.getElementById("extensionDetailsTitle");if(!(!T||!A))try{const Q=await window.api?.getExtensionShortcutsInfo?.({path:f});if(!Q?.success)A.innerHTML='<div class="extension-details-empty">Unable to load extension details.</div>';else{const{name:ie,shortcuts:Z,errors:oe,conflicts:u}=Q;M.textContent=`${t(ie||"Extension")} Details`;let c="";Z&&Z.length>0?c=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-shortcuts-list">
                ${Z.map(k=>`
                      <div class="extension-shortcut-item">
                        <span class="extension-shortcut-key">${t(k.originalKey||k.key)}</span>
                        <span class="extension-shortcut-desc">${t(k.description||"No description")}</span>
                        <span class="extension-shortcut-status ${k.isActive?"active":"conflict"}">
                          ${k.isActive?"✓ Active":"⚠ Conflict"}
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
          `;let b="";oe&&oe.length>0&&(b=`
            <div class="extension-details-section">
              <h4>Issues</h4>
              <div class="extension-errors-list">
                ${oe.map(k=>`
                      <div class="extension-error-item">
                        <div class="extension-error-type">${t(k.type)}</div>
                        <div class="extension-error-message">${t(k.message)}</div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `);let I="";u&&u.length>0&&(I=`
            <div class="extension-details-section">
              <h4>Shortcut Conflicts</h4>
              <div class="extension-conflicts-list">
                ${u.map(k=>`
                      <div class="extension-conflict-item">
                        <div class="extension-conflict-key">${t(k.key)}</div>
                        <div class="extension-conflict-extensions">
                          <strong>Conflicting with:</strong><br/>
                          ${k.conflictingExtensions.map(O=>`${t(O.name)}`).join("<br/>")}
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `),A.innerHTML=`${c}${b}${I}`}T.classList.remove("hidden"),E&&(E.onclick=()=>{T.classList.add("hidden")})}catch(Q){console.error("Failed to load extension details:",Q),A.innerHTML='<div class="extension-details-empty">Error loading extension details.</div>',T.classList.remove("hidden")}}return{bindSettingsShortcutsGlobal:it,createNativePageDescriptor:nt,ensureNativeSettingsGeneralInfo:me,getSettingsTabTitle:ae,getSettingsShortcut:Ie,initNativeSettingsUi:ot,initSettingsMenu:Qe,isEditableShortcutTarget:Le,isNativeSettingsTab:K,normalizeSettingsSection:j,openSettingsTab:_e,refreshActiveNativeSettingsPage:Se,renderNativeSettingsPage:xe,updateNativeSettingsTabSection:We}}function Pi({state:e,constants:n,escapeHtml:t,showToast:o,openOverlayModal:r,closeOverlayModal:d,getActiveTab:v,getActiveWebview:x,createTab:B,refreshActiveNativeSettingsPage:P,closeSettingsMenu:S}){const{PROFILES:C,PENDING_EXTENSION_OPEN_STORAGE_KEY:L,EXTENSION_PIN_STORAGE_KEY:D}=n;let R=!1,F=null,V=null,ee={visible:!1,id:"",message:"",actionLabel:"",action:""},le={},j={entryPath:""},ae=!1;async function Ie(){if(!window.api?.listBrowserExtensions)return e.browserExtensionsCache=[],e.browserExtensionsCache;const a=await window.api.listBrowserExtensions(),g=Array.isArray(a?.entries)?a.entries:[];return e.browserExtensionsCache=g.map(m=>{const p=(m.id||"guest").toLowerCase(),y=n.APP_PROTOCOL_SCHEME||"oneview-dev",U=String(m.path||"").trim().replace(/\\/g,"/").replace(/\/+$/,""),q=`file:///${U}`,G=ce=>{if(!ce||!ce.toLowerCase().startsWith("file://"))return ce;const ge=ce.replace(/\\/g,"/"),de=decodeURI(ge);let we=de.replace(q,"").replace(/^\/+/,"");if(we===de){const ue=`/${U.split("/").pop()}/`,X=de.indexOf(ue);X!==-1?we=de.slice(X+ue.length):we=""}const te=m.manifest?.entrypoints?.root||m.manifest?.entrypoints?.page||"index.html";return`${y}://${p}/${we||te}`};return{...m,rootUrl:G(m.rootUrl),optionsUrl:G(m.optionsUrl),popupUrl:G(m.popupUrl),sidePanelUrl:G(m.sidePanelUrl)}}),e.browserExtensionsCache}async function Le(){let a="";try{a=String(sessionStorage.getItem(L)||"").trim()}catch{a=""}if(!a)return;try{sessionStorage.removeItem(L)}catch{}const g=e.browserExtensionsCache.find(m=>m.path===a);g&&await E(g.path,"tab")}function nt(){try{const a=JSON.parse(localStorage.getItem(D)||"{}");le=a&&typeof a=="object"&&!Array.isArray(a)?a:{}}catch{le={}}}function je(){try{localStorage.setItem(D,JSON.stringify(le||{}))}catch{}}function K(){return v()?.partition||C[e.currentProfileId]?.partition||C.guest.partition}function me(){const a=v(),g=x();return{url:String(g?.getURL?.()||a?.url||"").trim(),title:String(g?.getTitle?.()||a?.title||"").trim()}}function ze(a={}){return String(a?.name||a?.actionTitle||"EX").trim().split(/\s+/).slice(0,2).map(m=>m.charAt(0)).join("").toUpperCase()}function ke(a={}){return String(a?.actionTitle||a?.name||"Extension").trim()}function Ee(a={},g=""){const m=String(a?.path||"").trim(),p=String(g||"").trim().replace(/\\/g,"/");if(!m||!p)return"";const y=m.replace(/\\/g,"/").replace(/\/+$/,""),U=p.replace(/^\/+/,""),q=`${y}/${U}`;return`file:///${encodeURI(q.replace(/^([A-Za-z]):/,"$1:"))}`}function Pe(a={}){return le[String(a?.path||"").trim()]===!0}function Xe(a={}){const g=(a?.id||"guest").toLowerCase(),m=a?.manifest?.entrypoints?.root||a?.manifest?.entrypoints?.page||"index.html";return`${n.APP_PROTOCOL_SCHEME}://${g}/${m}`}function qe(a={},g=""){const m=String(a?.actionIconFileUrl||Ee(a,a?.actionIconPath||"")||a?.actionIconUrl||"").trim(),p=t(ze(a));return m?`<img src="${t(m)}" alt="" />`:`<span class="${g}">${p}</span>`}function Fe(a=0){const g=Number(a||0);return g>=1024*1024*1024?`${(g/(1024*1024*1024)).toFixed(1)} GB`:g>=1024*1024?`${(g/(1024*1024)).toFixed(1)} MB`:g>=1024?`${(g/1024).toFixed(1)} KB`:`${Math.max(0,Math.round(g))} B`}function $e(a=0){const g=Number(a||0);return g<=0?"":`${Fe(g)}/s`}function xe(a=null){const g=Number(a);if(!Number.isFinite(g)||g<0)return"";if(g<60)return`${Math.round(g)}s left`;const m=Math.floor(g/60),p=Math.round(g%60);return`${m}m ${p}s left`}function Ue(a=""){return e.managedDownloadsCache.find(g=>g.id===a)||null}function Se(){const a=document.getElementById("downloadsManagerBtn");a&&(a.classList.remove("has-download-highlight"),a.offsetWidth,a.classList.add("has-download-highlight"),F&&clearTimeout(F),F=setTimeout(()=>{a.classList.remove("has-download-highlight")},2300))}async function We(){if(!window.api?.listManagedDownloads)return e.managedDownloadsCache=[],e.managedDownloadsCache;const a=await window.api.listManagedDownloads();return e.managedDownloadsCache=Array.isArray(a?.downloads)?a.downloads:[],e.managedDownloadsCache}function _e(){const a=document.getElementById("downloadsManagerPanel"),g=document.getElementById("downloadsManagerBtn");a&&!a.classList.contains("hidden")&&(R?d(()=>a.classList.add("hidden")):a.classList.add("hidden")),R=!1,g&&g.classList.remove("is-active")}function Qe(){const a=document.getElementById("downloadsManagerPanel"),g=document.getElementById("downloadsManagerBadge");if(!a)return;const m=e.managedDownloadsCache.filter(p=>p.state==="progressing"||p.state==="interrupted").length;g&&(m>0?(g.textContent=String(m),g.classList.remove("hidden")):(g.textContent="",g.classList.add("hidden"))),a.innerHTML=`
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${e.managedDownloadsCache.length?e.managedDownloadsCache.map(p=>{const y=t(p.fileName||"Download"),U=String(p.state||"progressing"),q=typeof p.progress=="number"?Math.max(0,Math.min(100,p.progress)):0,G=p.totalBytes>0?`${Fe(p.receivedBytes)} / ${Fe(p.totalBytes)}`:Fe(p.receivedBytes),ce=$e(p.bytesPerSecond),ge=xe(p.etaSeconds),de=U==="completed"?"Completed":U==="cancelled"?"Cancelled":U==="interrupted"?"Interrupted":p.paused?"Paused":`Downloading ${q}%`,we=[ce,ge].filter(Boolean).join(" • ");return`
                    <div class="downloads-manager-item">
                      <strong>${y}</strong>
                      <div class="downloads-manager-meta">${t(de)} • ${t(G)}</div>
                      ${we?`<div class="downloads-manager-meta">${t(we)}</div>`:""}
                      <div class="downloads-manager-progress">
                        <span style="width:${q}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${U==="progressing"?p.paused?`<button type="button" data-download-id="${t(p.id)}" data-download-action="resume">Resume</button>`:`<button type="button" data-download-id="${t(p.id)}" data-download-action="pause">Pause</button>`:""}
                        ${U==="progressing"||U==="interrupted"?`<button type="button" data-download-id="${t(p.id)}" data-download-action="cancel">Cancel</button>`:""}
                        ${U==="interrupted"||U==="cancelled"?`<button type="button" data-download-id="${t(p.id)}" data-download-action="retry">Retry</button>`:""}
                        ${p.savePath?`<button type="button" data-download-id="${t(p.id)}" data-download-action="show">Show in Folder</button>`:""}
                        ${U==="completed"&&p.existsOnDisk?`<button type="button" data-download-id="${t(p.id)}" data-download-action="open">Open</button>`:""}
                         <button type="button" data-download-id="${t(p.id)}" data-download-action="remove">Delete</button>
                      </div>
                    </div>
                  `}).join(""):'<div class="downloads-manager-empty">No downloads yet.</div>'}
      </div>
    `}async function ot(a=null){const g=document.getElementById("downloadsManagerPanel"),m=document.getElementById("downloadsManagerBtn");if(!g||!m)return;if(!(a===null?g.classList.contains("hidden"):!!a)){_e();return}f(),Qe();try{await r(()=>g.classList.remove("hidden"),{captureSnapshots:!1}),R=!0}catch{g.classList.remove("hidden"),R=!1}m.classList.add("is-active")}function it(){let a=document.getElementById("downloadsShelf");a||(a=document.createElement("div"),a.id="downloadsShelf",a.className="downloads-shelf hidden",a.innerHTML=`
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `,document.body.appendChild(a),a.querySelector("#downloadsShelfClose")?.addEventListener("click",()=>{ee.visible=!1,it()}),a.querySelector("#downloadsShelfAction")?.addEventListener("click",async()=>{const y=Ue(ee.id);!y||!ee.action||!window.api?.runManagedDownloadAction||await window.api.runManagedDownloadAction({id:y.id,action:ee.action})}));const g=a.querySelector("#downloadsShelfTitle"),m=a.querySelector("#downloadsShelfMessage"),p=a.querySelector("#downloadsShelfAction");if(!ee.visible){a.classList.add("hidden");return}g&&(g.textContent="Downloads"),m&&(m.textContent=ee.message||""),p&&(p.textContent=ee.actionLabel||"Open",p.style.display=ee.action?"":"none"),a.classList.remove("hidden")}function he(a={},g="updated"){const m=String(a.fileName||"Download").trim()||"Download";if(g==="created")ee={visible:!0,id:String(a.id||""),message:`${m} started downloading`,actionLabel:"Show",action:"show"};else if(g==="completed")ee={visible:!0,id:String(a.id||""),message:`${m} downloaded`,actionLabel:"Open",action:"open"};else if(g==="interrupted")ee={visible:!0,id:String(a.id||""),message:`${m} was interrupted`,actionLabel:"Retry",action:"retry"};else return;it(),V&&clearTimeout(V),V=setTimeout(()=>{ee.visible=!1,it()},5e3)}function f(){const a=document.getElementById("browserExtensionsMenu"),g=document.getElementById("browserExtensionsMenuBtn");a&&!a.classList.contains("hidden")&&(ae?d(()=>a.classList.add("hidden")):a.classList.add("hidden")),ae=!1,g&&g.classList.remove("is-active")}async function T(a=null){const g=document.getElementById("browserExtensionsMenu"),m=document.getElementById("browserExtensionsMenuBtn");if(!g||!m)return;if(!(a===null?g.classList.contains("hidden"):!!a)){f();return}A().catch(()=>{}),oe();try{await r(()=>g.classList.remove("hidden"),{captureSnapshots:!1}),ae=!0}catch(y){console.error("Failed to open extensions menu overlay",y),g.classList.remove("hidden"),ae=!1}m.classList.add("is-active")}async function E(a,g="tab"){const m=e.browserExtensionsCache.find(q=>q.path===a);if(!m)return;const p=(m?.id||"guest").toLowerCase();let y="";if(g==="options"&&m.optionsUrl){const q=m.manifest?.entrypoints?.options||"options.html";y=`${n.APP_PROTOCOL_SCHEME}://${p}/${q}`}else if(g==="root"&&m.rootUrl){const q=m.manifest?.entrypoints?.root||"result.html";y=`${n.APP_PROTOCOL_SCHEME}://${p}/${q}`}else y=Xe(m);if(!y){o("This extension does not expose an openable page yet.","info");return}const U=`ext-${m.id||"guest"}`;B(y,U,`${m.name||"Extension"}${g==="options"?" Options":""}`,null,{extensionEntryPath:m.path,extensionActiveContext:me()})}async function A(){if(window.api?.closeBrowserExtensionPopup)try{await window.api.closeBrowserExtensionPopup()}catch{}j={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(a=>a.classList.remove("is-active"))}function M(a={}){const g=document.getElementById("browserExtensionPopupTitle"),m=document.getElementById("browserExtensionPopupSubtitle"),p=document.getElementById("browserExtensionPopupIcon");g&&(g.textContent=ke(a)),m&&(m.textContent=a?.popupUrl?"Popup":a?.optionsUrl?"Extension page":a?.rootUrl?"Extension":""),p&&(p.innerHTML=qe(a,"browser-extension-popup-fallback"))}function Q(a){if(!a||typeof a.getBoundingClientRect!="function")return{left:0,top:0,bottom:0,width:0,height:0};const g=a.getBoundingClientRect();return{left:Number(g.left||0),top:Number(g.top||0),bottom:Number(g.bottom||0),width:Number(g.width||0),height:Number(g.height||0)}}async function ie(a,g=null){const m=e.browserExtensionsCache.find(ge=>ge.path===a);if(!m)return;const p=String(m.popupUrl||"").trim()||String(m.optionsUrl||"").trim();if(!p){await E(a,"tab");return}if(j.entryPath===a){await A();return}await A(),f();const y=window.api?.openBrowserExtensionPopup;if(typeof y!="function")throw new Error("Extension popup API is unavailable");const U=me(),q=`ext-${m.id||"guest"}`,G=await y({url:p,entryPath:a,partition:q,anchor:Q(g),activeUrl:U.url||"",activeTitle:U.title||""});if(!G?.success)throw new Error(G?.message||"Could not open extension popup");M(m),j={entryPath:a,pageType:"popup",host:null,overlayActive:!1};const ce=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(a):a.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${ce}"]`).forEach(ge=>ge.classList.add("is-active"))}function Z(){const a=document.getElementById("browserExtensionsPinned");if(!a)return;const g=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(y=>{const U=y.id==="sitesnap-studio"||String(y.name||"").toLowerCase().includes("sitesnap")||String(y.id||"").toLowerCase().includes("sitesnap");return g?y.enabled!==!1&&U:y.enabled!==!1&&!U}),p=g?m:m.filter(y=>Pe(y));if(!p.length){a.innerHTML="",a.classList.add("hidden");return}a.classList.remove("hidden"),a.innerHTML=p.map(y=>`
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${t(y.path||"")}"
            title="${t(ke(y))}"
            aria-label="${t(ke(y))}"
          >
            ${qe(y,"browser-extension-action-fallback")}
          </button>
        `).join("")}function oe(){const a=document.getElementById("browserExtensionsMenu");if(!a)return;const g=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(p=>{const y=p.id==="sitesnap-studio"||String(p.name||"").toLowerCase().includes("sitesnap")||String(p.id||"").toLowerCase().includes("sitesnap");return g?p.enabled!==!1&&y:p.enabled!==!1&&!y});a.innerHTML=`
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${m.length?m.map(p=>{const y=t(p.path||""),U=t(ke(p)),q=t(p.version?`v${p.version}${p.id?` • ${p.id}`:""}`:p.id||p.name||"");return`
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${qe(p,"browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${U}</strong>
                          <p>${q}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${y}"
                          title="${Pe(p)?"Unpin":"Pin"}"
                          aria-label="${Pe(p)?"Unpin":"Pin"}"
                        >
                          ${Pe(p)?"Unpin":"Pin"}
                        </button>
                      </div>
                      <div class="browser-extension-menu-actions">
                        <button type="button" data-menu-action="popup" data-path="${y}">
                          ${p.popupUrl?"Open Popup":"Open"}
                        </button>
                        ${p.optionsUrl?`<button type="button" data-menu-action="options" data-path="${y}">Options</button>`:""}
                        ${p.rootUrl?`<button type="button" data-menu-action="tab" data-path="${y}">Open in Tab</button>`:""}
                      </div>
                    </div>
                  `}).join(""):'<div class="browser-extensions-empty">No enabled extensions yet.</div>'}
      </div>
    `}function u(){Z(),oe()}function c(){const a=document.getElementById("extensionsManagerList");if(!a)return;const g=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(p=>{const y=p.id==="sitesnap-studio"||String(p.name||"").toLowerCase().includes("sitesnap")||String(p.id||"").toLowerCase().includes("sitesnap");return g?y:!y});if(!m.length){a.innerHTML=`
        <div class="extensions-empty-state">
          No unpacked extensions added yet.
        </div>
      `;return}a.innerHTML=m.map(p=>{const y=t(p.path||"");return`
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
              ${(function(){try{const U=String(localStorage.getItem("userRole")||"production").toLowerCase(),q=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();return U==="dev"&&q==="dev"?`<div class="extension-path">${y}</div>`:""}catch{return""}})()}
              ${p.loadError?`<div class="extension-error">${t(p.loadError)}</div>`:""}
            </div>
            <div class="extension-actions">
              ${p.popupUrl?`<button type="button" class="extension-action-btn" data-action="open-popup" data-path="${y}">Popup</button>`:""}
              ${p.rootUrl||p.linkUrl?`<button type="button" class="extension-action-btn" data-action="open-tab" data-path="${y}">Open Tab</button>`:""}
              ${p.optionsUrl?`<button type="button" class="extension-action-btn" data-action="open-options" data-path="${y}">Options</button>`:""}
              <button type="button" class="extension-action-btn" data-action="reload" data-path="${y}">
                Reload
              </button>
              <button type="button" class="extension-action-btn" data-action="toggle" data-path="${y}">
                ${p.enabled===!1?"Enable":"Disable"}
              </button>
              ${(function(){try{const U=String(localStorage.getItem("userRole")||"production").toLowerCase(),q=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();return U==="dev"&&q==="dev"?`<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${y}">Remove</button>`:""}catch{return""}})()}
            </div>
          </div>
        `}).join("")}async function b(){try{await Ie()}catch(a){console.error("Failed to refresh browser extensions list",a)}c(),u()}async function I(a,g){const m=e.browserExtensionsCache.find(y=>y.path===a);if(!m)return;const p=g==="options"?m.optionsUrl:g==="root"?m.rootUrl:Xe(m);if(!p){o(`This extension does not expose a ${g} page.`,"info");return}B(p,K(),`${m.name||"Extension"} ${g==="options"?"Options":"Popup"}`,null,{extensionEntryPath:m.path,extensionActiveContext:me()})}async function k(){const a=document.getElementById("extensionsManagerModal");if(a){f(),await A(),c(),u();try{await r(()=>a.classList.remove("hidden"))}catch(g){console.error("openOverlayModal failed for extensions manager",g),a.classList.remove("hidden")}b().catch(g=>{console.error("Failed to refresh extensions manager after open",g)})}}function O(){const a=document.getElementById("extensionsManagerModal");a&&d(()=>a.classList.add("hidden"))}function Y(){const a=document.getElementById("extensionsBtn"),g=document.getElementById("settingsBtn"),m=document.getElementById("extensionsModalCloseBtn"),p=document.getElementById("extensionsLoadBtn"),y=document.getElementById("extensionsManagerList"),U=document.getElementById("browserExtensionsPinned"),q=document.getElementById("browserExtensionsMenuBtn"),G=document.getElementById("browserExtensionsMenu"),ce=document.getElementById("downloadsManagerBtn"),ge=document.getElementById("downloadsManagerPanel"),de=document.getElementById("browserExtensionPopupClose"),we=document.getElementById("browserExtensionPopupOpenTab");if(nt(),c(),u(),b().catch(te=>{console.error("Failed to refresh extensions manager after open",te)}),Ie().then(()=>{if(Le(),window.api?.prewarmBrowserExtensionPopup){const ne=e.browserExtensionsCache.filter(X=>X.enabled!==!1).filter(X=>Pe(X));let ue={partition:K()};if(ne.length>0){const X=ne[0],pe=String(X.popupUrl||"").trim()||String(X.optionsUrl||"").trim();pe&&(ue={...ue,url:pe,entryPath:X.path})}window.api.prewarmBrowserExtensionPopup(ue).catch(()=>{})}}).catch(()=>{}),window.api?.onBrowserExtensionPopupState&&window.api.onBrowserExtensionPopupState(te=>{const{entryPath:ne,open:ue}=te||{};if(ue){j={entryPath:ne,pageType:"popup",host:null,overlayActive:!1};const X=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(ne):ne.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${X}"]`).forEach(pe=>pe.classList.add("is-active"))}else j.entryPath===ne&&(j={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(X=>X.classList.remove("is-active")))}),a&&a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",()=>{k().catch(te=>{console.error("Failed to open extensions manager",te),o("Could not open extensions manager.","error")})})),m&&m.dataset.boundClick!=="1"&&(m.dataset.boundClick="1",m.addEventListener("click",O)),p)try{const te=String(localStorage.getItem("userRole")||"production").toLowerCase(),ne=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();te!=="dev"||ne!=="dev"?p.style.display="none":p.style.display=""}catch{}p&&p.dataset.boundClick!=="1"&&(p.dataset.boundClick="1",p.addEventListener("click",async()=>{try{if(!window.api?.addBrowserExtensionsUnpacked){o("Extension manager API is unavailable.","error");return}const te=await window.api.addBrowserExtensionsUnpacked();e.browserExtensionsCache=Array.isArray(te?.entries)?te.entries:[],c(),u(),o("Unpacked extensions loaded.","success")}catch(te){console.error("Failed to load unpacked extensions",te),o(te?.message||"Could not load unpacked extensions.","error")}})),y&&y.dataset.boundClick!=="1"&&(y.dataset.boundClick="1",y.addEventListener("click",async te=>{const ne=te.target.closest("[data-action]");if(!ne)return;const ue=String(ne.dataset.action||"").trim(),X=String(ne.dataset.path||"").trim();if(X)try{if(ue==="open-popup"){await I(X,"popup");return}if(ue==="open-tab"){await I(X,"tab");return}if(ue==="open-options"){await I(X,"options");return}if(ue==="reload"&&window.api?.reloadBrowserExtension){const pe=await window.api.reloadBrowserExtension({path:X});e.browserExtensionsCache=Array.isArray(pe?.entries)?pe.entries:e.browserExtensionsCache,c(),u(),o("Extension reloaded.","success");return}if(ue==="toggle"&&window.api?.toggleBrowserExtension){const pe=e.browserExtensionsCache.find(vt=>vt.path===X);pe?.enabled!==!1&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const ct=await window.api.toggleBrowserExtension({path:X,enabled:pe?.enabled===!1});e.browserExtensionsCache=Array.isArray(ct?.entries)?ct.entries:e.browserExtensionsCache,c(),u(),o("Extension state updated.","success");return}if(ue==="remove"&&window.api?.removeBrowserExtension){typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const pe=await window.api.removeBrowserExtension({path:X});e.browserExtensionsCache=Array.isArray(pe?.entries)?pe.entries:e.browserExtensionsCache,c(),u(),o("Extension removed.","success")}}catch(pe){console.error("Extension manager action failed",pe),o(pe?.message||"Could not complete extension action.","error")}})),U&&U.dataset.boundClick!=="1"&&(U.dataset.boundClick="1",U.addEventListener("click",async te=>{const ne=te.target.closest("[data-path]");if(!ne)return;const ue=String(ne.dataset.path||"").trim();if(ue)try{await ie(ue,ne)}catch(X){console.error("Failed to open extension popup",X),o(X?.message||"Could not open extension popup.","error")}})),q&&q.dataset.boundClick!=="1"&&(q.dataset.boundClick="1",q.addEventListener("click",()=>{T().catch(te=>{console.error("Failed to toggle extensions menu",te),o("Could not open extensions menu.","error")})})),G&&G.dataset.boundClick!=="1"&&(G.dataset.boundClick="1",G.addEventListener("click",async te=>{const ne=te.target.closest("[data-menu-action]");if(!ne)return;const ue=String(ne.dataset.menuAction||"").trim(),X=String(ne.dataset.path||"").trim();try{if(ue==="manage"){f(),await k();return}if(!X)return;if(ue==="pin"){const pe=!le[X];le[X]=pe,je(),u();return}if(ue==="popup"){await ie(X,q||ne);return}if(ue==="options"){f(),await E(X,"options");return}ue==="tab"&&(f(),await E(X,"tab"))}catch(pe){console.error("Extension menu action failed",pe),o(pe?.message||"Could not complete extension action.","error")}})),de&&de.dataset.boundClick!=="1"&&(de.dataset.boundClick="1",de.addEventListener("click",()=>{A().catch(()=>{})})),we&&we.dataset.boundClick!=="1"&&(we.dataset.boundClick="1",we.addEventListener("click",async()=>{j.entryPath&&(await E(j.entryPath,"tab"),await A())})),document.body&&document.body.dataset.boundExtensionUiDismiss!=="1"&&(document.body.dataset.boundExtensionUiDismiss="1",document.addEventListener("click",te=>{const ne=te.target;g&&!g.contains(ne)&&S(),G&&!G.classList.contains("hidden")&&!G.contains(ne)&&!q?.contains(ne)&&!a?.contains(ne)&&f(),ge&&!ge.classList.contains("hidden")&&!ge.contains(ne)&&!ce?.contains(ne)&&_e(),!ne.closest(".browser-extension-action-btn")&&!G?.contains(ne)&&A().catch(()=>{})}),document.addEventListener("keydown",te=>{te.key==="Escape"&&(S(),f(),_e(),A().catch(()=>{}))}))}function z(){const a=document.getElementById("downloadsManagerBtn"),g=document.getElementById("downloadsManagerPanel");a&&a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",()=>{ot().catch(()=>{})})),g&&g.dataset.boundClick!=="1"&&(g.dataset.boundClick="1",g.addEventListener("click",async m=>{const p=m.target.closest("[data-download-action]");if(!p)return;const y=String(p.dataset.downloadAction||"").trim(),U=String(p.dataset.downloadId||"").trim();if(y)try{if(!window.api?.runManagedDownloadAction)return;const q=await window.api.runManagedDownloadAction({id:U,action:y});Array.isArray(q?.downloads)?e.managedDownloadsCache=q.downloads:(y==="remove"||y==="clear-completed")&&await We(),Qe()}catch(q){o(q?.message||"Could not complete download action.","error")}})),We().then(()=>{Qe()}).catch(()=>{}),window.api&&typeof window.api.onDownloadManagerUpdated=="function"&&document.body?.dataset.boundDownloadManagerEvents!=="1"&&(document.body.dataset.boundDownloadManagerEvents="1",window.api.onDownloadManagerUpdated(m=>{e.managedDownloadsCache=Array.isArray(m?.downloads)?m.downloads:[],Qe(),P().catch(()=>{}),(m?.reason==="created"||m?.reason==="completed"||m?.reason==="interrupted")&&Se();const p=Ue(String(m?.focusId||"").trim());p&&he(p,String(m?.reason||"updated"))}))}return{closeBrowserExtensionPopup:A,closeBrowserExtensionsMenu:f,closeDownloadsManagerPanel:_e,formatDownloadBytes:Fe,formatDownloadEta:xe,formatDownloadSpeed:$e,initDownloadsManager:z,initExtensionsManager:Y,loadManagedDownloadsFromMain:We,refreshBrowserExtensionsUi:u,refreshExtensionsManagerList:b}}function Bi({state:e,constants:n,showToast:t,openOverlayModal:o,closeOverlayModal:r,renderProfilePillSelect:d,resolveCredentialScopeIdForTab:v,applyProfileSelection:x,getCurrentProfileId:B,escapeHtml:P}){const{AUTH_GATEWAY_HOSTS:S,RESOURCE_SERVICE_ORIGIN:C}=n,L=()=>e.activeTabId,D=()=>e.credentialCache,R=u=>{e.credentialCache=u},F=()=>e.activeHttpAuthChallenge,V=u=>{e.activeHttpAuthChallenge=u},ee=()=>e.credentialCacheRefreshedAt,le=u=>{e.credentialCacheRefreshedAt=u},j=()=>e.credentialCacheRefreshInFlight,ae=u=>{e.credentialCacheRefreshInFlight=u},Ie=new Map;function Le(){return{wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]}}function nt(){return Object.keys(Le())}function je(){return!!(window.api&&typeof window.api.listProfileCredentials=="function"&&typeof window.api.saveProfileCredential=="function"&&typeof window.api.deleteProfileCredential=="function")}function K(u=""){const c=String(u).trim().toLowerCase();if(!c)return"";try{const O=new URL(c),Y=String(O.hostname||"").trim().toLowerCase().replace(/^www\./,""),z=String(O.port||"").trim();return Y?!z||z==="80"||z==="443"?Y:`${Y}:${z}`:""}catch{}const b=c.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];if(!b)return"";const I=b.lastIndexOf(":");if(I<=0)return b;const k=b.slice(I+1);return/^\d+$/.test(k)&&k!=="80"&&k!=="443"?b:b.slice(0,I)}function me(u=""){const c=String(u||"").trim().toLowerCase();if(!c)return"";const b=c.lastIndexOf(":");if(b<=0)return c;const I=c.slice(b+1);return/^\d+$/.test(I)?c.slice(0,b):c}function ze(u=""){const c=[];try{const b=new URL(String(u||"")),I=(O="")=>{if(O)try{const Y=new URL(String(O)),z=K(Y.host||Y.hostname||"");z&&c.push(z)}catch{const z=K(String(O||""));z&&c.push(z)}};I(b.host||b.hostname||""),["retURL","retUrl","returnUrl","TargetResource","targetResource","PartnerSpId","partnerSpId"].forEach(O=>{I(b.searchParams.get(O)||"")})}catch{}return[...new Set(c.filter(Boolean))]}function ke(u=""){const c=ze(u);if(c.length===0)return K(u);const b=c[0]||"";if(S.has(b)){const I=c.find(k=>k&&!S.has(k));if(I)return I}return b}function Ee(u=""){return S.has(K(u))}function Pe(u=""){const c=me(K(u));return c.endsWith(".veevavault.com")||c==="veevavault.com"||c.endsWith(".gskinternet.com")||c==="gskinternet.com"||c.endsWith(".gskpro.com")||c==="gskpro.com"}function Xe(u,c,b=""){const I=String(c||"").trim().toLowerCase(),k=K(b);if(!u||!I)return null;const O=(D()[u]||[]).filter(Y=>{const z=K(Y.domain);return z&&z!==k&&!Ee(z)&&Pe(z)&&String(Y.username||"").trim().toLowerCase()===I});return O.sort((Y,z)=>K(z.domain).length-K(Y.domain).length),O[0]||null}function qe(u=""){const c=String(u||"").trim();return/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(c)?"":c}async function Fe(){if(!window.api?.deleteProfileCredential)return;const u=[];nt().forEach(c=>{(D()[c]||[]).forEach(b=>{const I=K(b.domain);!Ee(I)||!Xe(c,b.username,I)||u.push({profileId:c,domain:I,username:String(b.username||"").trim()})})}),u.length!==0&&(await Promise.allSettled(u.map(c=>window.api.deleteProfileCredential(c))),u.forEach(c=>{const b=D()[c.profileId]||[];D()[c.profileId]=b.filter(I=>!(K(I.domain)===c.domain&&String(I.username||"").trim().toLowerCase()===c.username.toLowerCase()))}))}async function $e(){if(!je())return R(Le()),D();try{const u=await window.api.listProfileCredentials();if(!u||!u.success||!Array.isArray(u.data))return R(Le()),D();const c=Le();return u.data.forEach(b=>{const I=String(b.profileId||"").toLowerCase();c[I]&&c[I].push({profileId:I,domain:K(b.domain),username:String(b.username||""),password:String(b.password||"")})}),R(c),await Fe(),D()}catch{return R(Le()),D()}}async function xe(u=15e3){if(!je()||Date.now()-ee()<u)return D();if(j())return j();const b=$e().then(I=>(le(Date.now()),I)).finally(()=>{ae(null)});return ae(b),b}function Ue(u){return u?(u.credentialHintsByDomain||(u.credentialHintsByDomain={}),u.credentialHintsByDomain):{}}function Se(u="",c=""){const b=`${String(u||"").toLowerCase()} ${String(c||"").toLowerCase()}`;if(/login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(b))return!0;try{const I=new URL(String(u||""));if(C&&I.origin.toLowerCase()===C){const O=String(I.pathname||"/").toLowerCase(),Y=String(c||"").toLowerCase();if((O==="/"||O==="/login"||O==="/signin")&&Y.includes("synapse"))return!0}const k=`${I.pathname.toLowerCase()} ${I.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(k)}catch{return!1}}function We(u=""){let c="";try{c=new URL(String(u||"")).hostname.toLowerCase()}catch{return!1}return c==="10.215.56.196"||c.endsWith(".gskinternet.com")||c.endsWith(".gskpro.com")||c.endsWith(".veevavault.com")||c.endsWith(".okta.com")||c.endsWith(".oktacdn.com")||c.endsWith(".pingone.com")}function _e(u="",c="",b=null){return!je()||!b?!1:b.launchedAppType==="website"||!b.launchedAppType?Se(u,c)||We(u):!0}function Qe(u,c=""){if(!u)return null;const b=ze(c);if(b.length===0)return null;const I=D()[u]||[];let k=null,O=-1,Y="";try{const z=K(c);z&&(Y=localStorage.getItem(`oneview:last-used-username:${u}:${z}`)||"")}catch{}return I.forEach(z=>{const a=K(z.domain);if(!a)return;const g=b.reduce((p,y)=>{if(!y)return p;if(y===a)return Math.max(p,1e3);if(me(y)===me(a))return Math.max(p,900);if(y.endsWith(`.${a}`)||a.endsWith(`.${y}`))return Math.max(p,500);const U=me(y),q=me(a);if(U.endsWith(`.${q}`)||q.endsWith(`.${U}`))return Math.max(p,450);const G=U.split(".").reverse(),ce=q.split(".").reverse();let ge=0;for(let de=0;de<Math.min(G.length,ce.length)&&G[de]===ce[de];de+=1)ge+=1;return Math.max(p,ge>1?ge:-1)},-1);if(g<0)return;const m=Y&&String(z.username||"").trim().toLowerCase()===Y.trim().toLowerCase();(!k||g>O||g===O&&m||g===O&&!m&&a.length>K(k.domain).length)&&(k=z,O=g)}),k}function ot(u,c="",b=null){const I=D()[u]||[];if(I.length===0)return null;let k="";try{k=K(c)}catch{k=""}const O=Ue(b),Y=Object.values(O||{}).map(y=>String(y||"").trim()).filter(Boolean),z=String(b?.lastUsernameHint||"").trim()||Y[Y.length-1]||"";if(k&&Ee(k)&&z){const y=Xe(u,z,k);if(y)return y}const a=Qe(u,c);if(a&&!Ee(a.domain))return a;if(!z)return null;const g=I.filter(y=>String(y.username||"").trim().toLowerCase()===z.toLowerCase());if(g.length===1)return a&&!Ee(g[0].domain)?a:g[0];if(g.length===0)return null;const m=k;if(!m)return g[0];const p=y=>{const U=K(y);if(!U)return-1;if(Ee(U)&&Pe(m))return-100;if(Ee(m)&&!Ee(U))return 800+(Pe(U)?50:0);if(m===U)return 1e3;if(me(m)===me(U))return 900;if(m.endsWith(`.${U}`)||U.endsWith(`.${m}`))return 500;const q=me(m),G=me(U);if(q.endsWith(`.${G}`)||G.endsWith(`.${q}`))return 450;const ce=q.split(".").reverse(),ge=G.split(".").reverse();let de=0;for(let we=0;we<Math.min(ce.length,ge.length)&&ce[we]===ge[we];we+=1)de+=1;return de};return g.sort((y,U)=>p(U.domain)-p(y.domain)),g[0]||null}function it(u,c="",b=null){const I=ot(u,c,b);if(I)return{...I,profileId:String(I.profileId||"").trim().toLowerCase()||String(u||"").trim().toLowerCase()};const k=D()[u]||[];if(k.length===1)return{...k[0],profileId:String(k[0]?.profileId||"").trim().toLowerCase()||String(u||"").trim().toLowerCase()};let O="";try{O=K(c)}catch{O=""}if(!O||k.length===0)return null;const Y=g=>{const m=K(g);if(!m)return-1;if(Ee(O)&&!Ee(m))return 800+(Pe(m)?50:0);if(Ee(m)&&Pe(O))return-100;if(O===m)return 1e3;if(me(O)===me(m))return 900;if(O.endsWith(`.${m}`)||m.endsWith(`.${O}`))return 500;const p=me(O),y=me(m);if(p.endsWith(`.${y}`)||y.endsWith(`.${p}`))return 450;const U=p.split(".").reverse(),q=y.split(".").reverse();let G=0;for(let ce=0;ce<Math.min(U.length,q.length)&&U[ce]===q[ce];ce+=1)G+=1;return G},a=[...k].sort((g,m)=>Y(m.domain)-Y(g.domain))[0]||null;return a?{...a,profileId:String(a.profileId||"").trim().toLowerCase()||String(u||"").trim().toLowerCase()}:null}async function he(u,c){if(!u||!c)return;const b=String(c.username||""),I=String(c.password||"");if(!I)return!1;const k=`
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
          if (${JSON.stringify(!!b)} && userField) {
            userField.focus();
            setNativeValue(userField, ${JSON.stringify(b)});
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
    `;try{return await u.executeJavaScript(k,!0),!0}catch{return!1}}function f(u,c){if(!u||!c)return;u._oneviewAutofillTimer&&(clearTimeout(u._oneviewAutofillTimer),u._oneviewAutofillTimer=null);let b=0;const I=async()=>{if(b+=1,!(typeof u.isDestroyed=="function"?u.isDestroyed():!1)&&u.id===`webview-${L()}`){try{if(await u.executeJavaScript("Boolean(window.__oneviewManualCredentialEditAt)",!0)){u._oneviewAutofillTimer&&(clearTimeout(u._oneviewAutofillTimer),u._oneviewAutofillTimer=null);return}}catch{}await he(u,c),b<6&&(u._oneviewAutofillTimer=setTimeout(I,1e3))}};I()}async function T(u){if(u)try{await u.executeJavaScript(`
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
        `,!0)}catch{}}async function E(u,c){if(!je()||!u||!c||c.id!==L()||!c.credentialAutomationEnabled)return;const b=String(u.getURL?.()||c.url||"");let I=null;if(u._oneviewSubmittedCredential&&(I=u._oneviewSubmittedCredential,u._oneviewSubmittedCredential=null),!I)return;const k=I,O=ye=>{try{const Be=new URL(ye);return(Be.origin+Be.pathname).toLowerCase().replace(/\/$/,"")}catch{return String(ye||"").split("?")[0].split("#")[0].toLowerCase().replace(/\/$/,"")}};if(k.url&&O(b)===O(k.url)){u._oneviewSubmittedCredential=I;return}const Y=String(k.trigger||"");if(String(k.activeInputType||"").toLowerCase(),Y==="input"){const ye=ke(String(k.url||u.getURL()||"")),Be=qe(k.username),rt=!!Be&&!!k.password&&Be.toLowerCase()===String(k.password).toLowerCase();Be&&!rt&&ye&&(Ue(c)[ye]=Be,c.lastUsernameHint=Be);return}const a=v(c),g=String(k.url||u.getURL()||""),m=ke(g),p=Ue(c);let y=qe(k.username);const U=String(k.password||"");if(!a||!m)return;const q=/^\d{4,8}$/.test(U),G=/authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(g.toLowerCase());if(k.otpLike||G&&q)return;const ce=String(p[m]||"").trim()||String(c.lastUsernameHint||"").trim(),ge=!!y&&!!U&&y.toLowerCase()===U.toLowerCase();y&&!ge?(p[m]=y,c.lastUsernameHint=y):p[m]?y=p[m]:c.lastUsernameHint&&(y=String(c.lastUsernameHint||"").trim());const de=ce||String(p[m]||"").trim()||String(c.lastUsernameHint||"").trim(),we=!!y&&!!U&&y.toLowerCase()===U.toLowerCase();if(we&&de&&de!==y&&(y=de),!y||!U||we&&(!de||de.toLowerCase()===y.toLowerCase()))return;const te=`${a}|${m}|${y}`,ne=Date.now(),ue=Ie.get(te)||0,X=(D()[a]||[]).find(ye=>me(K(ye.domain))===me(m)&&String(ye.username||"").trim().toLowerCase()===y.toLowerCase());if(!(!X||String(X.password||"")!==U)&&ne-ue<15e3)return;if(Ie.set(te,ne),await $e(),Ee(m)&&Xe(a,y,m)){(D()[a]||[]).find(rt=>K(rt.domain)===m&&String(rt.username||"").trim().toLowerCase()===y.toLowerCase())&&window.api?.deleteProfileCredential&&(await window.api.deleteProfileCredential({profileId:a,domain:m,username:y}),await $e());return}const ct=(D()[a]||[]).find(ye=>K(ye.domain)===m&&String(ye.username||"").trim().toLowerCase()===y.toLowerCase());if(ct&&String(ct.password||"")===U)return;function vt(ye,Be,rt="success"){if(!ye)return;const Nt=`
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
      `;ye.executeJavaScript(Nt,!0).catch(()=>{})}try{if(!(await window.api.saveProfileCredential({profileId:a,domain:m,username:y,password:U}))?.success)return;await $e(),vt(u,"Password saved successfully.","success")}catch(ye){console.warn("Could not save remembered credential:",ye)}}function A(u,c){!u||!c||u._oneviewCredentialPollId||(u._oneviewCredentialPollId=setInterval(()=>{if(typeof u.isDestroyed=="function"?u.isDestroyed():!1){clearInterval(u._oneviewCredentialPollId),u._oneviewCredentialPollId=null;return}c.id,L()},3e3))}async function M(u=!1){const c=document.getElementById("httpAuthModal"),b=document.getElementById("httpAuthForm"),I=F();c&&!c.classList.contains("hidden")&&r(()=>c.classList.add("hidden")),b&&b.reset(),V(null),u&&I?.challengeId&&typeof window.api?.submitHttpAuthChallenge=="function"&&window.api.submitHttpAuthChallenge({challengeId:I.challengeId,cancelled:!0}).catch(()=>{})}async function Q(u={}){const c=document.getElementById("httpAuthModal"),b=document.getElementById("httpAuthModalTitle"),I=document.getElementById("httpAuthMessage"),k=document.getElementById("httpAuthUsernameInput"),O=document.getElementById("httpAuthPasswordInput"),Y=document.getElementById("httpAuthRememberInput"),z=document.getElementById("httpAuthSubmitBtn");if(!c||!b||!I||!k||!O||!Y||!z)return;F()?.challengeId&&M(!0),V({...u});const a=String(u.reason||"")==="retry";b.textContent=a?"Login Failed, Update Credential":"Website Login Required";const g=String(u.host||u.url||"this website").trim(),m=String(u.realm||"").trim(),p=String(u.profileId||"").trim().toUpperCase();I.textContent=m?`${g} • ${m}${p?` • ${p}`:""}`:`${g}${p?` • ${p}`:""}`,k.value=String(u.username||""),O.value=String(u.password||""),Y.checked=u.remember!==!1,z.textContent=a?"Update And Login":"Login",await o(()=>c.classList.remove("hidden")),O.value?(O.focus(),O.select()):(k.focus(),k.select())}function ie(){const u=document.getElementById("httpAuthModal"),c=document.getElementById("httpAuthForm"),b=document.getElementById("httpAuthModalCloseBtn");!u||!c||!b||c.dataset.initialized!=="1"&&(c.dataset.initialized="1",b.addEventListener("click",()=>M(!0)),u.addEventListener("click",I=>{I.target===u&&M(!0)}),c.addEventListener("submit",async I=>{I.preventDefault();const k=F(),O=document.getElementById("httpAuthUsernameInput"),Y=document.getElementById("httpAuthPasswordInput"),z=document.getElementById("httpAuthRememberInput");if(!k?.challengeId||!O||!Y||typeof window.api?.submitHttpAuthChallenge!="function")return;const a=String(O.value||"").trim(),g=String(Y.value||""),m=!!z?.checked;if(!(!a||!g))try{await window.api.submitHttpAuthChallenge({challengeId:k.challengeId,username:a,password:g,remember:m}),M(!1)}catch(p){console.error("Failed to submit HTTP auth credential",p),t("Could not submit the website credential.","error")}}),typeof window.api?.onHttpAuthChallenge=="function"&&window.api.onHttpAuthChallenge(I=>{Q(I).catch(k=>{console.error("Failed to open HTTP auth modal",k)})}))}function Z(){}async function oe(u,c){if(!c||!c.rect)return;const b=u.getURL(),I=ke(b);if(!I)return;const k=[];if(Object.entries(D()).forEach(([Y,z])=>{z.forEach(a=>{const g=K(a.domain),m=me(g),p=me(I),y=m.endsWith("veevavault.com")&&p.endsWith("veevavault.com");if(m===p||y||p.endsWith(`.${m}`)&&m.split(".").length>1){const U=n.PROFILES[Y]||{name:Y,color:"#ccc"};k.push({...a,profileId:Y,profileName:U.name,profileColor:U.color})}})}),k.length===0)return;const O=`if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(k)});
    }`;u.executeJavaScript(O,!0).catch(()=>{})}return{canUseSecureCredentialApi:je,getAutofillCredentialForTab:it,initHttpAuthPrompt:ie,initPasswordManager:Z,installCredentialCaptureHooks:T,isCredentialAutomationDomain:We,isLikelyAuthPage:Se,maybeOfferRememberCredentials:E,normalizeDomain:K,refreshCredentialCacheIfStale:xe,scheduleCredentialAutofill:f,shouldEnableCredentialAutomation:_e,startCredentialCapturePolling:A,handleCredentialFieldInteraction:oe,hideCredentialDropdown:()=>{}}}function Ai({state:e,constants:n,createNativePageDescriptor:t,ensureNativeSettingsGeneralInfo:o,normalizeSettingsSection:r,renderNativeSettingsPage:d,closeBrowserExtensionsMenu:v,closeBrowserExtensionPopup:x,refreshBrowserExtensionsUi:B,refreshTabScrollControls:P,syncProfileSelectionForTab:S,updateProfileLockUI:C,perfMark:L,shouldRequirePlatformApiForNavigation:D,getWebviewPlatformApiFlag:R,setWebviewPlatformApiFlag:F,getWebviewPreloadPathCached:V,startCredentialCapturePolling:ee,scheduleCredentialAutofill:le,installCredentialCaptureHooks:j,refreshCredentialCacheIfStale:ae,getAutofillCredentialForTab:Ie,resolveAssignedProfileIdForTab:Le,getCredentialScopeIdByPartition:nt,resolveCredentialScopeIdForTab:je,maybeOfferRememberCredentials:K,syncTabProfileForPage:me,trackProfileHistory:ze,resolveProfileIdForTab:ke,resolveAssignedProfileId:Ee,resolveStrictProfileNavigationTarget:Pe,resolveNavigationPartition:Xe,applyProfileSelection:qe,openProfilePromptDialog:Fe,handleCredentialFieldInteraction:$e,hideCredentialDropdown:xe}){const{PARTITIONS:Ue,PROFILES:Se,LOCAL_WEB_APP_TYPES:We,WEBVIEW_POOL_MAX:_e=6,WEBVIEW_POOL_KEEPALIVE_MS:Qe=6e4,TAB_PREWARM_ENABLED:ot=!1,PREWARM_ALL_PROFILE_PARTITIONS:it=!1}=n,he=[];let f=null;const T=new Map,E=()=>e.tabs,A=i=>{e.tabs=i},M=()=>e.activeTabId,Q=i=>{e.activeTabId=i},ie=()=>e.currentProfileId;function Z(i){const s=document.querySelector(".browser-controls-overlay");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result"));l&&i&&(i.hideBrowserControls=!1);const w=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);s.classList.toggle("hidden",w),l?(s.classList.remove("hidden"),s.style.setProperty("display","flex","important"),s.style.setProperty("visibility","visible","important"),s.style.setProperty("opacity","1","important"),s.style.setProperty("height","40px","important")):(s.style.removeProperty("display"),s.style.removeProperty("visibility"),s.style.removeProperty("opacity"),s.style.removeProperty("height"))}function oe(i){const s=document.getElementById("browserDetachHeader");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),w=(!i||i.isHome||!!i.hideBrowserControls||!!i.nativePage)&&!l;s.classList.toggle("hidden",w)}function u(i){const s=document.querySelector(".profile-section");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),w=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);s.classList.toggle("hidden",w)}function c(i,s){const l=E().find(h=>h.id===i);if(!l)return;l.title=s;const w=document.getElementById(`tab-ui-${i}`);w&&(w.querySelector(".tab-title").textContent=s)}function b(){const i=M();return i&&E().find(s=>s.id===i)||null}function I(){const i=M();return i?document.getElementById(`webview-${i}`):null}function k(i){const s=document.getElementById("urlDisplay");s&&(s.value=i)}function O(i){const s=document.getElementById("urlDisplay");s&&(s.value=i)}function Y(){const i=document.getElementById("browserBack"),s=document.getElementById("browserForward"),l=I();i&&(i.disabled=l?!l.canGoBack():!0),s&&(s.disabled=l?!l.canGoForward():!0)}function z(i){i&&(i._oneviewCredentialPollId&&(clearInterval(i._oneviewCredentialPollId),i._oneviewCredentialPollId=null),i._oneviewAutofillTimer&&(clearTimeout(i._oneviewAutofillTimer),i._oneviewAutofillTimer=null))}function a(i){document.querySelectorAll(".webviews-container .webcontent-pane").forEach(l=>{const w=l.id.replace("webview-",""),h=E().find(W=>W.id===w);w===i&&!h?.isHome&&h?.credentialAutomationEnabled?ee(l,h):z(l)})}function g(i,s=E().length-1){const l=document.getElementById("tabsList");if(!l)return;const w=document.createElement("div");w.className="tab",w.id=`tab-ui-${i.id}`,w.innerHTML=`
        <span class="tab-title">${i.title}</span>
        <button class="tab-close">x</button>
    `,w.addEventListener("click",W=>{W.target.classList.contains("tab-close")||G(i.id)}),w.querySelector(".tab-close").addEventListener("click",W=>{W.stopPropagation(),de(i.id)});const $=l.children[s]||null;l.insertBefore(w,$),P()}function m(i){setTimeout(async()=>{const s=E().find(w=>w.id===i);if(!(!s||!s.isHome||document.getElementById(`webview-${i}`)))try{const w=await pe(s);if(!w)return;w.classList.remove("active"),typeof w.hide=="function"&&w.hide().catch(()=>{}),w.syncBounds?.(!1)}catch(w){window.api.webContentCall("log-error",{key:`prewarm-err:${i}:${w.toString()}`}).catch(()=>{})}},0)}async function p(i=null,s=null,l="New Tab",w=null,h={}){const $=h.active!==!1;window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?s=Ue.gsk:s=gt(s||(Se[ie()]?Se[ie()].partition:Ue.guest));const H=`tab-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,N={id:H,title:l,url:i,partition:s,isHome:!i&&!h.nativePage,nativePage:h.nativePage&&typeof h.nativePage=="object"?t(h.nativePage.type||"settings",h.nativePage.section||"general"):null,lockedProfileId:w,hideBrowserControls:!1,launchedAppType:null,trackingAppId:"",trackingAppName:"",requiresPlatformApi:!1,extensionCompatEnabled:!1,extensionEntryPath:"",extensionActiveContext:{url:"",title:""},credentialAutomationEnabled:!1,lastCredentialSourceProfileId:null};N.trackingAppId=String(h.trackingAppId||"").trim(),N.trackingAppName=String(h.trackingAppName||l||N.title||"").trim(),N.extensionEntryPath=String(h.extensionEntryPath||"").trim(),N.extensionCompatEnabled=!!N.extensionEntryPath,N.extensionActiveContext=h.extensionActiveContext&&typeof h.extensionActiveContext=="object"?{url:String(h.extensionActiveContext.url||"").trim(),title:String(h.extensionActiveContext.title||"").trim()}:{url:"",title:""};const J=E(),De=J.findIndex(st=>st.id===M()),ve=Number.isInteger(h.insertIndex)?Math.max(0,Math.min(h.insertIndex,J.length)):De>=0?De+1:J.length;if(J.splice(ve,0,N),g(N,ve),N.nativePage)await G(H);else if(i){$&&Q(H);const st=document.getElementById("view-home-content"),bt=document.getElementById("webviews-container");$&&st&&st.classList.add("hidden");const Rt=i&&(i.includes("result.html")||i.includes("extension-icon")||i.toLowerCase().includes("result"));if($&&bt){bt.classList.remove("hidden");let Ne=document.getElementById("tab-load-placeholder");Rt?Ne&&(Ne.style.display="none"):Ne?Ne.style.display="flex":(Ne=document.createElement("div"),Ne.id="tab-load-placeholder",Ne.style.cssText=["position:absolute","inset:0","z-index:50","display:flex","flex-direction:column","align-items:center","justify-content:center","background:var(--bg-main,#f8fafc)","gap:16px"].join(";"),Ne.innerHTML=`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `,bt.appendChild(Ne));const Lt=()=>{Ne&&(Ne.style.display="none")},pn=Me=>{Me&&(typeof Me._oneviewPlaceholderFinalize=="function"&&(Me.removeEventListener("did-stop-loading",Me._oneviewPlaceholderFinalize),Me.removeEventListener("did-fail-load",Me._oneviewPlaceholderFinalize)),Me._oneviewPlaceholderFinalize=null)},fn=setInterval(()=>{const Me=document.getElementById(`webview-${H}`);if(!Me)return;clearInterval(fn),clearTimeout(mn);const Ft=()=>{pn(Me),clearTimeout(mn),Lt()};pn(Me),Me._oneviewPlaceholderFinalize=Ft,Me.addEventListener("did-stop-loading",Ft,{once:!0}),Me.addEventListener("did-fail-load",Ft,{once:!0})},100),mn=setTimeout(()=>{clearInterval(fn),Lt()},12e3)}await we(H,i,s,l,w,h,$)}else await G(H),ot&&m(H);return N}function y(i=M()){const s=E(),l=s.find(H=>H.id===i);if(!l)return;const w=s.findIndex(H=>H.id===l.id),h=document.getElementById(`webview-${l.id}`),$=h&&typeof h.getURL=="function"&&h.getURL()||l.url||"",W=h&&typeof h.getTitle=="function"&&h.getTitle()||l.title||"New Tab";p(l.isHome||!$||$==="about:blank"?null:$,l.partition,W,l.lockedProfileId||null,{insertIndex:w>=0?w+1:s.length,trackingAppId:l.trackingAppId||"",trackingAppName:l.trackingAppName||W})}function U(i){const s=E();if(!s.length)return;const l=s.findIndex($=>$.id===M()),h=((l>=0?l:0)+i+s.length)%s.length;G(s[h].id,{suppressHomeSearchFocus:!0})}async function q(i){!i||typeof i.focusWebContents!="function"||await i.focusWebContents().catch(()=>{})}async function G(i,s={}){Q(i);const l=E().find(N=>N.id===i);if(!l)return;v(),x().catch(()=>{}),S(l),C(l),document.querySelectorAll(".tab").forEach(N=>N.classList.remove("active"));const w=document.getElementById(`tab-ui-${i}`);w&&w.classList.add("active");const h=document.getElementById("view-home-content"),$=document.getElementById("nativeTabContent"),W=document.getElementById("webviews-container"),H=document.querySelectorAll(".webviews-container .webcontent-pane");if(l.isHome){h?.classList.remove("hidden"),$?.classList.add("hidden"),W?.classList.add("hidden"),Z(l),oe(l),u(l);const N=document.getElementById("googleSearchInput");N&&s?.suppressHomeSearchFocus!==!0&&(N.value="",N.focus())}else if(l.nativePage)h?.classList.add("hidden"),$?.classList.remove("hidden"),W?.classList.add("hidden"),Z(l),oe(l),u(l),k(""),r(l.nativePage?.section)==="general"&&await o(),d(l);else{h?.classList.add("hidden"),$?.classList.add("hidden"),W?.classList.remove("hidden"),Z(l),oe(l),u(l),H.forEach(J=>{J.id!==`webview-${i}`&&(J.classList.remove("active"),typeof J.hide=="function"&&J.hide().catch(()=>{}),J.syncBounds?.(!1))});let N=null;try{N=document.getElementById(`webview-${i}`),N||(N=await pe(l))}catch(J){window.api.webContentCall("log-error",{key:`switchTab-create-err:${i}:${J.toString()}`}).catch(()=>{})}if(N)try{N.classList.add("active"),typeof N.show=="function"&&await N.show().catch(()=>{}),N.syncBounds?.(!0),await q(N),k(N.getURL())}catch(J){window.api.webContentCall("log-error",{key:`switchTab-show-err:${i}:${J.toString()}`}).catch(()=>{})}}a(l.id),B(),Y()}function ce(i){if(!i)return!1;const s=String(i.launchedAppType||"").toLowerCase();return We.has(s)}function ge(i,s){if(!i||!s||!ce(s))return!1;const l=String(i.getAttribute("partition")||s.partition||"");if(!l)return!1;const w=i.parentElement;for(w&&w.removeChild(i),i.classList.remove("active"),he.push({webview:i,partition:l,platformApiEnabled:R(i),at:Date.now()}),L("view-webcontent","park-to-pool",{partition:l,poolSize:he.length});he.length>_e;){const h=he.shift();h&&h.webview&&!h.webview.isDestroyed?.()&&h.webview.remove()}return!0}function de(i){const s=E(),l=s.findIndex(W=>W.id===i);if(l===-1)return;const w=M()===i;document.getElementById(`tab-ui-${i}`)?.remove();const h=document.getElementById(`webview-${i}`);if(h&&(z(h),(!ce(s[l])||!ge(h,s[l]))&&h.remove()),s.splice(l,1),s.length===0){Q(null),p(),P();return}const $=s.some(W=>W.id===M());if(w||!$){const W=Math.min(l,s.length-1),H=s[W]||s[s.length-1];H&&G(H.id)}P()}async function we(i,s,l,w,h=null,$={},W=!0){const H=performance.now(),N=E().find(De=>De.id===i);if(!N)return;N._navStartedAt=H,L("view-nav","navigateTo-start",{tabId:N.id,url:String(s||""),partition:String(l||""),appType:$.appType||null}),N.isHome=!1,N.url=s,N.partition=l,N.lockedProfileId=h,N.hideBrowserControls=!!$.hideControls,N.launchedAppType=$.appType||null,N.lastCredentialSourceProfileId=null,N.trackingAppId=String($.trackingAppId||"").trim(),N.trackingAppName=String($.trackingAppName||w||N.title||"").trim(),N.requiresPlatformApi=D(s,$),w&&c(i,w),W&&(Q(i),await G(i));let J=document.getElementById(`webview-${i}`);if(!J)J=await pe(N,W);else{const De=J.getAttribute("partition"),ve=R(J);(De!==l||ve!==!!N.requiresPlatformApi)&&(z(J),(!ce(N)||!ge(J,N))&&J.remove(),J=await pe(N,W))}W&&typeof J.show=="function"?await J.show().catch(()=>{}):!W&&typeof J.hide=="function"&&await J.hide().catch(()=>{}),typeof J.setMeta=="function"&&await J.setMeta({trackingAppId:N.trackingAppId,appName:N.trackingAppName,appType:N.launchedAppType||""}).catch(()=>{}),J.syncBounds?.(W),W&&(k(s),await q(J)),J.src!==s&&(J.src=s),L("view-nav","navigateTo-dispatch",{tabId:N.id,elapsedMs:Math.round(performance.now()-H)})}async function te(i,s,l,w=null,h={}){return we(M(),i,s,l,w,h,!0)}function ne(i){i&&i.executeJavaScript(`
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
      `,!0).catch(()=>{})}function ue(i=""){const s=String(i||"").trim().toLowerCase();return!!(!s||s==="about:blank"||s.startsWith("javascript:")||s.startsWith("data:")||s.startsWith("chrome-error://"))}function X(i){i._hasTabListenersAttached||(i._hasTabListenersAttached=!0,i.addEventListener("ipc-message",async s=>{if(s.channel==="oneview:credential-field-focused")$e(i,s.args[0]);else if(s.channel!=="oneview:credential-field-blurred"){if(s.channel==="oneview:credential-selected"){const l=s.args[0];if(l){i.executeJavaScript("window.__oneviewManualCredentialEditAt = 0;",!0).catch(()=>{}),le(i,l),l.profileId&&l.profileId!==ie()&&qe(l.profileId);try{const w=i.getURL(),h=w?new URL(w).hostname.toLowerCase():"";h&&localStorage.setItem(`oneview:last-used-username:${l.profileId||ie()}:${h}`,l.username)}catch{}}}else if(s.channel==="oneview:credential-login-attempted"){const l=s.args[0];if(l&&l.username){try{const $=l.url?new URL(l.url).hostname.toLowerCase():"";$&&localStorage.setItem(`oneview:last-used-username:${ie()}:${$}`,l.username)}catch{}const w=i.id.replace("webview-",""),h=E().find($=>$.id===w);h&&h.credentialAutomationEnabled&&K(i,h)}}else if(s.channel==="oneview:credential-submitted"){const l=s.args[0];l&&(i._oneviewSubmittedCredential=l)}else if(s.channel==="oneview:keydown"){const l=s.args[0];if(l){const w=new KeyboardEvent("keydown",{key:l.key,ctrlKey:l.ctrlKey,shiftKey:l.shiftKey,altKey:l.altKey,metaKey:l.metaKey,bubbles:!0,cancelable:!0});document.dispatchEvent(w)}}}}),i.addEventListener("console-message",s=>{const l=String(s?.message||"");(l.includes("[OneView][Credential")||l.includes("[VeevaSlide]"))&&console.log("[WebviewConsole]",{level:s?.level,line:s?.line,sourceId:s?.sourceId||"",message:l})}),i.addEventListener("did-start-loading",()=>{const s=i.id.replace("webview-",""),l=E().find(h=>h.id===s);if(!l)return;l._didStartLoadingAt=performance.now(),L("view-webcontent","did-start-loading",{tabId:l.id,url:i.getURL()||l.url||""}),l.url&&(l.url.includes("result.html")||l.url.includes("extension-icon")||l.url.toLowerCase().includes("result"))?(c(l.id,"Result"),l.id===M()&&O(l.url||"")):(c(l.id,"Loading..."),l.id===M()&&O(l.url||"Loading..."))}),i.addEventListener("did-stop-loading",async()=>{const s=i.id.replace("webview-",""),l=E().find(ve=>ve.id===s);if(!l)return;const w=typeof l._didStartLoadingAt=="number"?Math.round(performance.now()-l._didStartLoadingAt):null,h=typeof l._navStartedAt=="number"?Math.round(performance.now()-l._navStartedAt):null;L("view-webcontent","did-stop-loading",{tabId:l.id,url:i.getURL()||"",loadElapsedMs:w,navElapsedMs:h});const $=i.getURL()||l.url||"";let H=$&&($.includes("result.html")||$.includes("extension-icon")||$.toLowerCase().includes("result"))?"Result":i.getTitle()||l.title||"Tab";if(H==="Tab"||H==="Loading..."||!H)try{const ve=new URL($);H=ve.hostname?ve.hostname.replace("www.",""):"Tab"}catch{H="Tab"}(l.title==="Loading..."||l.title==="Tab"||!l.title||i.getTitle()&&i.getTitle()!=="about:blank")&&c(l.id,H),l.id===M()&&k($),l.url=$,l.credentialAutomationEnabled=cn($,H,l);const J=async(ve,st,bt)=>{if(!ve.credentialAutomationEnabled){z(i);return}const Rt=Le(ve,st,bt),Ne=nt(ve.partition)||Rt||ie();await ae();const Lt=Ie(Ne,st,ve);le(i,Lt),ee(i,ve),j(i)};i._oneviewSetupCredentialAutomation=J,await J(l,$,H),await me(l,$,H,i),gi(i,l);const De=ke(l);ze(De,$,H),ne(i)}),i.addEventListener("page-title-updated",s=>{const l=i.id.replace("webview-",""),w=E().find(h=>h.id===l);w&&(c(w.id,s.title),w.credentialAutomationEnabled&&K(i,w))}),i.addEventListener("will-navigate",()=>{const s=i.id.replace("webview-",""),l=E().find(w=>w.id===s);l&&l.credentialAutomationEnabled&&K(i,l)}),i.addEventListener("did-navigate",s=>{const l=i.id.replace("webview-",""),w=E().find(W=>W.id===l);if(!w)return;const h=s.url||i.getURL()||"";w.url=h,w.id===M()&&(k(h),Y());const $=ke(w);ze($,h,i.getTitle()||w.title||""),w.credentialAutomationEnabled&&(K(i,w),typeof i._oneviewSetupCredentialAutomation=="function"&&i._oneviewSetupCredentialAutomation(w,h,i.getTitle()||w.title||""))}),i.addEventListener("did-navigate-in-page",async s=>{const l=i.id.replace("webview-",""),w=E().find(N=>N.id===l);if(!w)return;const h=s.url||i.getURL()||"";w.url=h,w.id===M()&&(k(h),Y());const $=ke(w);if(ze($,h,i.getTitle()||w.title||""),w.credentialAutomationEnabled&&(K(i,w),typeof i._oneviewSetupCredentialAutomation=="function"&&i._oneviewSetupCredentialAutomation(w,h,i.getTitle()||w.title||"")),i.addEventListener("history-changed",N=>{_=N,w.id===M()&&Y()}),w.credentialAutomationEnabled=cn(h,i.getTitle()||w.title||"",w),!w.credentialAutomationEnabled){z(i);return}K(i,w),await ae();const W=nt(w.partition)||Le(w,h,i.getTitle()||w.title||"")||je(w),H=Ie(W,h,w);le(i,H),ee(i,w)}),i.addEventListener("new-window",async s=>{const l=i.id.replace("webview-",""),w=E().find(De=>De.id===l);if(!w)return;typeof s?.preventDefault=="function"&&s.preventDefault();const h=String(s?.url||"").trim();if(ue(h))return;const $=String(i.getURL()||"").trim();if($&&$===h)return;let W=Ee(h,"New Tab"),H=null;if(W)H=Se[W].partition;else if(Fe){const De=ke(w)||"guest",ve=await Fe(h,De);if(ve&&!ve.cancelled&&ve.profileId)W=ve.profileId,H=Se[W]?.partition;else return}else H=w.partition;const N=E(),J=N.findIndex(De=>De.id===w.id);p(h,H,"New Tab",W,{insertIndex:J>=0?J+1:N.length})}))}async function pe(i,s=!0){if(T.has(i.id))return T.get(i.id);const l=vt(i,s);T.set(i.id,l);try{return await l}finally{T.delete(i.id)}}function ct(i){const s=String(i?.partition||"");if(!s||he.length===0)return null;const l=!!i?.requiresPlatformApi,w=he.findIndex($=>$.partition===s&&!!$.platformApiEnabled===l);if(w===-1)return null;const[h]=he.splice(w,1);return h?.webview||null}async function vt(i,s=!0){const l=performance.now();let w=document.getElementById("webviews-container");if(!w){const H=document.getElementById("view-page-content")||document.body;w=document.createElement("div"),w.id="webviews-container",w.className="webviews-container",H.appendChild(w)}const h=ct(i);if(h)return h.classList.toggle("active",s),h.id=`webview-${i.id}`,h.setAttribute("partition",i.partition),F(h,!!i.requiresPlatformApi),X(h),w.appendChild(h),s&&typeof h.show=="function"?h.show().catch(()=>{}):!s&&typeof h.hide=="function"&&h.hide().catch(()=>{}),h.syncBounds?.(s),s&&typeof h.focusWebContents=="function"&&h.focusWebContents().catch(()=>{}),L("view-webcontent","reuse-pooled",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l),poolSize:he.length}),h;const $=V(),W=await gn({key:`view:${i.id}`,partition:i.partition,preloadPath:$,additionalArguments:i.requiresPlatformApi?["--oneview-enable-platform-api=1"]:[],extensionEntryPath:i.extensionEntryPath,extensionActiveContext:i.extensionActiveContext,extensionCompat:!0,initialMeta:{trackingAppId:i.trackingAppId,appName:i.trackingAppName,appType:i.launchedAppType||"",extensionEntryPath:i.extensionEntryPath},className:`webcontent-pane${s?" active":""}`});return W.id=`webview-${i.id}`,W.setAttribute("partition",i.partition),F(W,!!i.requiresPlatformApi),X(W),w.appendChild(W),!s&&typeof W.hide=="function"&&W.hide().catch(()=>{}),W.syncBounds?.(s),s&&(requestAnimationFrame(()=>{W.syncBounds?.(!0)}),setTimeout(()=>{W.syncBounds?.(!0)},100)),s&&typeof W.focusWebContents=="function"&&W.focusWebContents().catch(()=>{}),L("view-webcontent","create-fresh",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l)}),W}function ye(){f||(f=setInterval(()=>{if(!document.hidden&&he.length!==0)for(let i=he.length-1;i>=0;i-=1){const l=he[i]?.webview;if(!l||l.isDestroyed?.()){he.splice(i,1);continue}l.executeJavaScript("void 0",!1).catch(()=>{})}},Qe))}async function Be(i){const s=String(i||"").trim();if(!s||he.some($=>$.partition===s))return;const l=document.getElementById("webviews-container");if(!l)return;const w=V(),h=`view:prewarm:${s}:${Date.now()}`;try{const $=await gn({key:h,partition:s,preloadPath:w,className:"webcontent-pane"});$.id=`webview-prewarm-${Date.now()}`,l.appendChild($),$.syncBounds?.(),ge($,{launchedAppType:"website",partition:s})}catch{}}async function rt(){const i=Array.from(new Set(Object.values(Se).map(s=>String(s?.partition||"").trim()).filter(Boolean)));for(const s of i)await Be(s),await new Promise(l=>setTimeout(l,60))}async function ln(){const i=Se[ie()]?.partition||Se.guest.partition;i&&await Be(i)}function Nt(){ye(),ot&&(it?rt():ln())}function fi(){for(f&&(clearInterval(f),f=null);he.length>0;){const i=he.shift();i&&i.webview&&!i.webview.isDestroyed?.()&&i.webview.remove()}}function mi(i,s=null){return!(!i||i.isHome)}function gi(i,s){if(!i||!s||s.launchedAppType!=="website")return;const l=`
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
  `;try{i.insertCSS(l)}catch(w){console.warn("Could not apply website scrollbar theme:",w)}}function wi(){const i=E().find(l=>l.id===M());if(!i||i.isHome)return;i.isHome=!0,i.url=null,i.lockedProfileId=null,c(i.id,"New Tab");const s=document.getElementById(`webview-${i.id}`);s&&(z(s),(!ce(i)||!ge(s,i))&&s.remove()),G(i.id)}function hi(i=""){let s=String(i||"").trim();if(!s)return"";/^file:\/\/\/https?:\/\//i.test(s)?s=s.replace(/^file:\/\/\//i,""):/^file:\/\/https?:\/\//i.test(s)&&(s=s.replace(/^file:\/\//i,""));const l=s.match(/^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/);if(l){const h=l[1].toUpperCase(),$=decodeURIComponent(l[2]).replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${h}:/${$}`}if(/^file:\/\//i.test(s)||/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^about:/i.test(s))return s;const w=s.match(/^([a-zA-Z])[:/\\](.*)$/);if(w){const h=w[1].toUpperCase(),$=w[2].replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${h}:/${$}`}if(/^\/[A-Za-z]\//.test(s)){const h=s[1].toUpperCase(),$=s.slice(3).replace(/\\/g,"/");return`file:///${h}:/${$}`}return/^\\\\/.test(s)?`file:${s.replace(/\\/g,"/")}`:s}function Ot(i=""){const s=String(i||"").trim();return!s||/\s/.test(s)?!1:!!(/^about:/i.test(s)||/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(s)||/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(s)||s.includes(".")||/[/:?#]/.test(s))}async function vi(i){if(i=hi(i),!i)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){let h=i;Ot(i)?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&(h=`https://${i}`):h=`https://www.google.com/search?q=${encodeURIComponent(i)}`,await te(h,Ue.gsk,i);return}let s=i,l=Ot(i);if(l?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&!/^file:\/\//i.test(i)&&(s=`https://${i}`):Ot(i)?(s=`https://${i}`,l=!0):s=`https://www.google.com/search?q=${encodeURIComponent(i)}`,l){const h=await Pe(s,null,"New Tab");if(!h||h.cancelled)return;const $=h.profileId,W=h.partition;$&&$!==ie()&&qe($,{bypassLock:!0}),await te(s,W,"New Tab",h.lockedProfileId);return}const w=Xe(s,b()?.partition||Se[ie()]?.partition||Ue.guest,"Google Search");await te(s,w,"Google Search")}function bi(i,{isTeardown:s=!1}={}){const l=E(),w=Array.isArray(i)?i.filter(Boolean):[];if(w.length===0||l.length===0)return;const h=new Set(w),$=[...l],W=$.findIndex(H=>H.id===M());if($.forEach(H=>{if(!h.has(H.id))return;document.getElementById(`tab-ui-${H.id}`)?.remove();const N=document.getElementById(`webview-${H.id}`);N&&(z(N),(!(!s&&ce(H))||!ge(N,H))&&N.remove())}),A($.filter(H=>!h.has(H.id))),E().length===0){Q(null),s||(p(),P());return}if(h.has(M())){const H=Math.min(Math.max(W,0),E().length-1);Q(E()[H].id)}G(M()||E()[0].id),P()}function cn(i="",s="",l=null){return l?l.launchedAppType==="website"||!l.launchedAppType?dn(i,s)||un(i):!0:!1}function dn(i="",s=""){const l=`${String(i||"")} ${String(s||"")}`.toLowerCase();if(/login|sign in|signin|password|sso|authenticate|verify/.test(l))return!0;try{const w=new URL(String(i||"")),h=`${w.pathname.toLowerCase()} ${w.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(h)}catch{return!1}}function un(i=""){let s="";try{s=new URL(String(i||"")).hostname.toLowerCase()}catch{return!1}return s==="10.215.56.196"||s.endsWith(".gskinternet.com")||s.endsWith(".gskpro.com")||s.endsWith(".veevavault.com")||s.endsWith(".okta.com")||s.endsWith(".oktacdn.com")||s.endsWith(".pingone.com")}return{closeTab:de,closeTabsBulk:bi,createTab:p,createWebviewForTab:pe,duplicateTab:y,disposeWebviewRuntime:fi,getActiveTab:b,getActiveWebview:I,goToActiveTabHome:wi,isInspectableLocalFileTab:mi,navigateTo:te,navigateToTab:we,performSearch:vi,startWebviewRuntime:Nt,switchRelativeTab:U,switchTab:G,updateTabTitle:c,updateUrlDisplay:k,updateUrlDisplayString:O,getCurrentProfileId:ie,getTabs:E}}console.log("View Page Script initializing...");let re=[],Ve=null,Tt=!1,Rn=null,hn=null,vn=[],bn=[],yn={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};const Jt=tt.profileHistory,Xt="view.profileHistory.v1";let Te={wppproduction:[],vml:[],gsk:[],guest:[]};const Fn=tt.customBookmarks;let Oe=[],Sn="guest",qt="guest",En="",dt="guest",Pt=null,Ze=null,xn=null;const Ti=new Set(["login.veevavault.com","federation.gsk.com"]);let yt=null,Re=-1,He=[],Cn={version:"",defaultOpenStatus:""},In=0,Ln=null,kn=!1;const Wn=tt.perfEnabled;let pt=null,Pn=!1;const It={};Object.defineProperties(It,{tabs:{get:()=>re,set:e=>{re=e}},activeTabId:{get:()=>Ve,set:e=>{Ve=e}},browserExtensionsCache:{get:()=>vn,set:e=>{vn=e}},managedDownloadsCache:{get:()=>bn,set:e=>{bn=e}},nativeSettingsGeneralInfo:{get:()=>Cn,set:e=>{Cn=e}},historyProfileId:{get:()=>qt,set:e=>{qt=e}},historySearchQuery:{get:()=>En,set:e=>{En=e}},currentProfileId:{get:()=>fe,set:e=>{fe=e}},profileHistoryCache:{get:()=>Te,set:e=>{Te=e}},credentialCache:{get:()=>yn,set:e=>{yn=e}},passwordProfileId:{get:()=>Sn,set:e=>{Sn=e}},passwordEditTarget:{get:()=>hn,set:e=>{hn=e}},activeHttpAuthChallenge:{get:()=>xn,set:e=>{xn=e}},credentialCacheRefreshedAt:{get:()=>In,set:e=>{In=e}},credentialCacheRefreshInFlight:{get:()=>Ln,set:e=>{Ln=e}}});const Yt={synapse:{partition:be.synapse},contentgen:{partition:be.contentgen}},Qt=new Set(["nextjs","vite","react","angular","html","neutralino","website","vite-server"]),Hn=(()=>{try{return new URL(Ii).origin.toLowerCase()}catch{return""}})(),$i=new URL(""+new URL("contentgen-DHdropzE.webp",import.meta.url).href,import.meta.url).href,_i=new URL(""+new URL("contentgen-dark-Bj2lxwBn.webp",import.meta.url).href,import.meta.url).href;function Bn(e=document){if(!e||typeof e.querySelectorAll!="function")return;const n=document.body.classList.contains("dark-mode");e.querySelectorAll("img[data-theme-icon]").forEach(t=>{const o=String(t.getAttribute("data-theme-icon")||"").trim();let r="";o==="contentgen"&&(r=n?_i:$i),r&&t.getAttribute("src")!==r&&t.setAttribute("src",r)})}function Di(){["httpAuthModal","bookmarkModal","cacheActionModal","extensionsManagerModal"].forEach(e=>{const n=document.getElementById(e);!n||n.dataset.hoistedToBody==="1"||(document.body.appendChild(n),n.dataset.hoistedToBody="1")})}async function An(){const e=Je();if(!(!e||e.isHome||!e.url||!window.api?.openDetachedViewWindow))try{await window.api.openDetachedViewWindow({url:e.url,title:e.title||"Detached Tab",partition:e.partition||be.guest}),Ut(e.id)}catch(n){console.error("Failed to open detached tab window",n),Ke("Could not open the page in a separate window.","error")}}function Mt(){if(pt!==null)return pt;try{const e=localStorage.getItem(Wn);return pt=e==="1"||e==="true",pt}catch{return pt=!1,!1}}function Vn(e,n,t=null){if(!Mt())return;const o=t?{...t}:{};try{console.log(`[PERF][${e}] ${n}`,o)}catch{}}window.addEventListener("storage",e=>{e.key===Wn&&(pt=null,window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Mt()).catch(()=>{}))});const se={wppproduction:{id:"wppproduction",name:"WPPProduction",partition:be.wppproduction,color:"#000000",bgColor:"#e2e8f0",label:"W"},vml:{id:"vml",name:"VML",partition:be.vml,color:"#ff0000",bgColor:"#fee2e2",label:"V"},gsk:{id:"gsk",name:"GSK",partition:be.gsk,color:"#f37521",bgColor:"#ffedd5",label:"G"},guest:{id:"guest",name:"Guest",partition:be.guest,color:"#64748b",bgColor:"#f1f5f9",label:"?"}};let fe="guest";function Mi(){return fe}const Ui=Bi({state:It,constants:{AUTH_GATEWAY_HOSTS:Ti,RESOURCE_SERVICE_ORIGIN:Hn,PROFILES:se},showToast:Ke,openOverlayModal:lt,closeOverlayModal:et,renderProfilePillSelect:on,resolveCredentialScopeIdForTab:ii,applyProfileSelection:ht,getCurrentProfileId:()=>fe,escapeHtml:Ce}),{getAutofillCredentialForTab:Ni,initHttpAuthPrompt:Oi,installCredentialCaptureHooks:Ri,isLikelyAuthPage:Fi,maybeOfferRememberCredentials:Wi,refreshCredentialCacheIfStale:Hi,scheduleCredentialAutofill:Vi,startCredentialCapturePolling:ji,handleCredentialFieldInteraction:zi,hideCredentialDropdown:qi}=Ui;let ut=null,St=null;const Yi=Pi({state:It,constants:{PROFILES:se,PENDING_EXTENSION_OPEN_STORAGE_KEY:"oneview.pendingExtensionOpenPath",EXTENSION_PIN_STORAGE_KEY:"oneview.browserExtensions.pinned.v1",IS_DEV_APP_BUILD:At},escapeHtml:Ce,showToast:Ke,openOverlayModal:lt,closeOverlayModal:et,getActiveTab:(...e)=>St?.getActiveTab?.(...e)??null,getActiveWebview:(...e)=>St?.getActiveWebview?.(...e)??null,createTab:(...e)=>St?.createTab?.(...e),refreshActiveNativeSettingsPage:(...e)=>ut?.refreshActiveNativeSettingsPage?.(...e)??Promise.resolve(),closeSettingsMenu:xo}),{closeBrowserExtensionPopup:Zt,closeBrowserExtensionsMenu:Ki,formatDownloadBytes:Gi,formatDownloadEta:Ji,formatDownloadSpeed:Xi,initDownloadsManager:Qi,initExtensionsManager:Zi,loadManagedDownloadsFromMain:eo,refreshBrowserExtensionsUi:to,refreshExtensionsManagerList:jn}=Yi;St=Ai({state:It,constants:{PARTITIONS:be,PROFILES:se,LOCAL_WEB_APP_TYPES:Qt,WEBVIEW_POOL_MAX:6,WEBVIEW_POOL_KEEPALIVE_MS:12e3,TAB_PREWARM_ENABLED:!0,PREWARM_ALL_PROFILE_PARTITIONS:!1},createNativePageDescriptor:(...e)=>ut?.createNativePageDescriptor?.(...e)??null,ensureNativeSettingsGeneralInfo:(...e)=>ut?.ensureNativeSettingsGeneralInfo?.(...e)??Promise.resolve(),normalizeSettingsSection:(...e)=>ut?.normalizeSettingsSection?.(...e)??"general",renderNativeSettingsPage:(...e)=>ut?.renderNativeSettingsPage?.(...e),closeBrowserExtensionsMenu:Ki,closeBrowserExtensionPopup:Zt,refreshBrowserExtensionsUi:to,refreshTabScrollControls:Dt,syncProfileSelectionForTab:Po,updateProfileLockUI:Et,perfMark:Vn,shouldRequirePlatformApiForNavigation:Do,getWebviewPlatformApiFlag:Mo,setWebviewPlatformApiFlag:Uo,getWebviewPreloadPathCached:_o,startCredentialCapturePolling:ji,scheduleCredentialAutofill:Vi,installCredentialCaptureHooks:Ri,refreshCredentialCacheIfStale:Hi,getAutofillCredentialForTab:Ni,resolveAssignedProfileIdForTab:Jn,getCredentialScopeIdByPartition:qn,resolveCredentialScopeIdForTab:ii,maybeOfferRememberCredentials:Wi,syncTabProfileForPage:Bo,trackProfileHistory:$o,resolveProfileIdForTab:ni,resolveAssignedProfileId:Ct,resolveStrictProfileNavigationTarget:Xn,resolveNavigationPartition:ft,applyProfileSelection:ht,openProfilePromptDialog:Lo,handleCredentialFieldInteraction:zi,hideCredentialDropdown:qi});const{closeTab:Ut,closeTabsBulk:mt,createTab:Ae,createWebviewForTab:no,duplicateTab:io,disposeWebviewRuntime:zn,getActiveTab:Je,getActiveWebview:Ge,goToActiveTabHome:oo,isInspectableLocalFileTab:ro,navigateTo:xt,navigateToTab:so,performSearch:$t,startWebviewRuntime:ao,switchRelativeTab:kt,switchTab:Ye,updateTabTitle:lo,updateUrlDisplay:co,updateUrlDisplayString:Tn,getTabs:Kt}=St;ut=ki({state:It,constants:{PROFILES:se,PARTITIONS:be,IS_DEV_APP_BUILD:At},escapeHtml:Ce,showToast:Ke,isPerfEnabled:Mt,formatDownloadBytes:Gi,formatDownloadSpeed:Xi,formatDownloadEta:Ji,formatHistoryTime:oi,loadManagedDownloadsFromMain:eo,refreshExtensionsManagerList:jn,saveProfileHistoryStore:rn,getActiveTab:Je,updateTabTitle:lo,createTab:Ae,switchTab:Ye,navigateTo:xt});const{bindSettingsShortcutsGlobal:uo,createNativePageDescriptor:mr,ensureNativeSettingsGeneralInfo:gr,getSettingsTabTitle:wr,initNativeSettingsUi:po,initSettingsMenu:fo,isEditableShortcutTarget:mo,isNativeSettingsTab:hr,normalizeSettingsSection:vr,openSettingsTab:Gt,refreshActiveNativeSettingsPage:go,renderNativeSettingsPage:br,updateNativeSettingsTabSection:yr}=ut;function wo(){try{return localStorage.getItem("username")==="Guest"}catch{return!1}}function ho(e="",n="",t=""){const o=String(t||"").trim().toLowerCase();if(Yt[o])return o;const r=String(n||"").trim().toLowerCase(),d=String(e||"").trim().toLowerCase();try{const v=new URL(String(e||"")),x=`${v.protocol}//${v.host}`.toLowerCase(),B=String(v.pathname||"/").toLowerCase();if(x===Hn&&(B==="/"||B===""))return"synapse";if(x==="http://10.215.56.196:3456")return"contentgen"}catch{}return/content[\s-]*gen/.test(r)||/content[\s-]*gen/.test(d)?"contentgen":r.includes("synapse")?"synapse":""}function en(e){const n=gt(e);if(n===be.synapse||n===be.contentgen)return"guest";const t=Object.values(se).find(o=>o.partition===n);return t?t.id:null}function qn(e){const n=gt(e);return n===be.synapse?"synapse":n===be.contentgen?"contentgen":en(n)}function ft(e="",n="",t="",o={}){const r=String(o?.sessionScope||o?.credentialScope||"").trim()||"",d=ho(e,t,r);return d&&Yt[d]?Yt[d].partition:gt(n||se[fe]?.partition||be.guest)}async function vo(){const e=document.getElementById("view-synapse-link-btn");if(!e||(e.style.display="none",wo()))return;const n=String(localStorage.getItem("emp_id")||"").trim(),t=String(localStorage.getItem("username")||"").trim(),o=/^\d+$/.test(t)?t:"",r=n||o;if(r)try{const{data:d}=await Ci("resources",{},{limit:200,timeoutMs:5e3}),v=new Set(d.map(x=>String(x?.emp_id??"").trim()).filter(Boolean));e.style.display=v.has(r)?"flex":"none"}catch(d){console.warn("Could not verify Synapse visibility in view",d),e.style.display="none"}}function bo(e="",n="addressSearchDropdown"){const t=document.getElementById(n);if(!t)return;const o=String(e||"").trim().toLowerCase();if(!o){t.classList.add("hidden"),He=[],Re=-1;return}const r=re.filter(S=>{const C=String(S.title||"").toLowerCase(),L=String(S.url||"").toLowerCase();return C.includes(o)||L.includes(o)}).map(S=>({type:"tab",id:S.id,title:S.title||"Untitled Tab",url:S.url||"",partition:S.partition}));let d=[];Object.values(Te).forEach(S=>{Array.isArray(S)&&S.forEach(C=>{const L=String(C.title||"").toLowerCase(),D=String(C.url||"").toLowerCase();if(L.includes(o)||D.includes(o)){const R=d.some(V=>V.url===C.url),F=r.some(V=>V.url===C.url);!R&&!F&&d.push({type:"history",title:C.title||"History Item",url:C.url,partition:C.partition||be.guest})}})}),He=[{type:"search",title:e,url:`Search for "${e}"`},...r.slice(0,5),...d.slice(0,15)],Re=0;let x="";x+=Wt(He[0],0);const B=He.filter(S=>S.type==="tab");B.length>0&&(x+='<div class="address-search-group-label">Open Tabs</div>',B.forEach(S=>{const C=He.indexOf(S);x+=Wt(S,C)}));const P=He.filter(S=>S.type==="history");P.length>0&&(x+='<div class="address-search-group-label">History</div>',P.forEach(S=>{const C=He.indexOf(S);x+=Wt(S,C)})),t.innerHTML=x,t.classList.remove("hidden")}function Wt(e,n){const t=n===Re;let o=String(e.title||"H").charAt(0).toUpperCase(),r="is-history",d="History";return e.type==="tab"?(r="is-tab",d="Tab"):e.type==="search"&&(r="is-search",d="Search",o="🔍"),`
    <div class="address-search-item ${r} ${t?"is-selected":""}" 
         data-index="${n}">
      <div class="address-search-item-icon">${o}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${Ce(e.title)}</span>
        <span class="address-search-item-url">${Ce(e.url)}</span>
      </div>
      <div class="address-search-item-badge">${d}</div>
    </div>
  `}async function $n(e,n){const t=document.getElementById(e);if(!t)return;if(Re<0||Re>=He.length){$t(t.value);return}const o=He[Re],r=document.getElementById(n);r&&r.classList.add("hidden"),o.type==="tab"?await Ye(o.id):o.type==="history"?await ri(o.url,o.partition,o.title):$t(t.value),t.blur()}function _n(e,n){const t=document.getElementById(e),o=document.getElementById(n);!t||!o||(t.addEventListener("input",()=>{bo(t.value,n)}),t.addEventListener("keydown",r=>{o.classList.contains("hidden")||(r.key==="ArrowDown"?(r.preventDefault(),Re=(Re+1)%He.length,Dn(n)):r.key==="ArrowUp"?(r.preventDefault(),Re=(Re-1+He.length)%He.length,Dn(n)):r.key==="Enter"?(r.preventDefault(),$n(e,n)):r.key==="Escape"&&o.classList.add("hidden"))}),o.addEventListener("click",r=>{const d=r.target.closest(".address-search-item");if(!d)return;const v=parseInt(d.dataset.index);isNaN(v)||(Re=v,$n(e,n))}))}function Dn(e){const n=document.getElementById(e);n&&n.querySelectorAll(".address-search-item").forEach((t,o)=>{const r=parseInt(t.dataset.index);t.classList.toggle("is-selected",r===Re),r===Re&&t.scrollIntoView({block:"nearest"})})}function yo(){const e=document.getElementById("googleSearchInput");e&&e.dataset.boundAddressInput!=="1"&&(e.dataset.boundAddressInput="1",e.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdownHome");o&&!o.classList.contains("hidden")||t.key==="Enter"&&$t(e.value)}),_n("googleSearchInput","addressSearchDropdownHome"));const n=document.getElementById("urlDisplay");n&&n.dataset.boundAddressInput!=="1"&&(n.dataset.boundAddressInput="1",n.addEventListener("focus",()=>{n.select?.()}),n.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdown");if(!(o&&!o.classList.contains("hidden"))){if(t.key==="Enter")t.preventDefault(),$t(n.value),n.blur();else if(t.key==="Escape"){t.preventDefault();const r=Je();co(r?.url||""),n.blur()}}}),_n("urlDisplay","addressSearchDropdown"))}function Yn(){if(Tt){window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode(),re.length===0?Ae():Ye(Ve||re[0].id);return}Tt=!0,console.log("initViewPage called"),yi().catch(n=>{console.warn("Could not initialize OneView shared storage sync",n)}),or(),window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Mt()).catch(()=>{}),window.api&&typeof window.api.getPerfLogPath=="function"&&window.api.getPerfLogPath().then(n=>{n?.success&&Vn("perf","log-path",{path:n.path||"",enabled:n.enabled})}).catch(()=>{}),!kn&&window.api&&typeof window.api.onCredentialDebugLog=="function"&&(kn=!0,window.api.onCredentialDebugLog(n=>{console.log("[OneView][CredentialCapture][MainRelay]",n)})),document.body?.dataset.boundProfileHistorySharedStorage!=="1"&&window.api?.onOneviewSharedStorageUpdated&&(document.body.dataset.boundProfileHistorySharedStorage="1",window.api.onOneviewSharedStorageUpdated(n=>{String(n?.key||"")===Xt&&(ti(n),go().catch(()=>{}))})),Wo(),To(),Ao().catch(()=>{}),zo(),sn(),Bn(),Di(),document.addEventListener("click",n=>{const t=document.getElementById("addressSearchDropdown"),o=document.getElementById("addressSearchDropdownHome"),r=document.getElementById("urlDisplay"),d=document.getElementById("googleSearchInput");t&&!t.contains(n.target)&&n.target!==r&&t.classList.add("hidden"),o&&!o.contains(n.target)&&n.target!==d&&o.classList.add("hidden");const v=document.getElementById("credentialSelectionDropdown");v&&!v.contains(n.target)&&v.classList.add("hidden")}),document.body.dataset.viewThemeIconObserverBound||(document.body.dataset.viewThemeIconObserverBound="1",new MutationObserver(()=>{Bn()}).observe(document.body,{attributes:!0,attributeFilter:["class"]})),re.length===0?Ae():Ye(Ve||re[0].id);const e=document.getElementById("newTabBtn");e&&e.addEventListener("click",()=>{Ae()}),Go();try{yo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupViewSearch-err:${n.toString()}`}).catch(()=>{})}try{Ho()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupBookmarks-err:${n.toString()}`}).catch(()=>{})}vo().catch(n=>{console.warn("Failed to update Synapse visibility in view",n)});try{Yo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-initBookmarkManager-err:${n.toString()}`}).catch(()=>{})}document.getElementById("browserBack")?.addEventListener("click",()=>{const n=Ge();if(n&&n.canGoBack()){n.goBack();return}oo()}),document.getElementById("browserForward")?.addEventListener("click",()=>{const n=Ge();n&&n.canGoForward()&&n.goForward()}),document.getElementById("browserReload")?.addEventListener("click",()=>{const n=Ge();n&&n.reload()}),document.getElementById("browserDetach")?.addEventListener("click",An),document.getElementById("browserDetachHeader")?.addEventListener("click",An),Eo(),ao(),Xo(),Oi(),ko(),fo(),uo(),po(),Zi(),Qi(),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode()}window.addEventListener("beforeunload",()=>{if(Zt().catch(()=>{}),zn(),typeof re<"u"&&Array.isArray(re)){const e=re.map(n=>n.id);mt(e,{isTeardown:!0})}});window.addEventListener("teardown-view-system",()=>{console.log("Teardown View System triggered"),Zt().catch(()=>{}),zn();const e=re.map(t=>t.id);mt(e,{isTeardown:!0});const n=document.getElementById("webviews-container");n&&(n.querySelectorAll(".webcontent-pane").forEach(o=>{try{typeof o.remove=="function"&&o.remove()}catch{}}),n.innerHTML=""),re=[],Ve=null,Tt=!1});function Ht(e){if(!e||e.isHome)return!1;const n=String(e.url||"").trim(),t=String(e.launchedAppType||"").trim().toLowerCase();return!n||n==="about:blank"||n==="newtab"||Bt(n)||!/^https?:\/\//i.test(n)?!1:!t||t==="website"}function So({activateVisibleTab:e=!0}={}){if(!Tt||re.length===0)return;const n=re.filter(d=>!d.isHome&&!Ht(d)).map(d=>d.id);if(n.length>0&&mt(n),!e)return;const t=Je();if(t&&Ht(t)){Ye(t.id);return}const o=re.find(d=>Ht(d));if(o){Ye(o.id);return}const r=re.find(d=>d.isHome);if(r){Ye(r.id);return}if(re.length===0){Ae();return}Ye(re[0].id)}window.addEventListener("ticket-switch-preserve-view",e=>{So({activateVisibleTab:e?.detail?.activateVisibleTab!==!1})});async function Eo(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;const e=JSON.parse(localStorage.getItem(tt.installedApps)||"{}");let n=!1;for(const[t,o]of Object.entries(e)){const r=String(o?.type||"").toLowerCase();if(Qt.has(r)&&o?.localPath)try{const d=await window.api.resolveOneviewAppUrl(t,o.localPath);d?.success&&d.url&&o.oneviewUrl!==d.url&&(e[t]={...o,oneviewUrl:d.url},n=!0)}catch{}}n&&localStorage.setItem(tt.installedApps,JSON.stringify(e))}window.initViewPage=Yn;window.closeViewTab=Ut;function xo(){const e=document.getElementById("settingsBtn");e&&e.classList.remove("is-active")}function tn(){return{modal:document.getElementById("extensionPromptModal"),title:document.getElementById("extensionPromptTitle"),message:document.getElementById("extensionPromptMessage"),label:document.getElementById("extensionPromptLabel"),input:document.getElementById("extensionPromptInput"),textarea:document.getElementById("extensionPromptTextarea"),form:document.getElementById("extensionPromptForm"),submitBtn:document.getElementById("extensionPromptSubmitBtn"),cancelBtn:document.getElementById("extensionPromptCancelBtn"),closeBtn:document.getElementById("extensionPromptCloseBtn")}}async function Co(e={}){const n=tn();if(!n.modal||!n.form||!n.input||!n.textarea)return{cancelled:!0,value:""};if(Ze)return{cancelled:!0,value:""};const t=e&&typeof e=="object"?e:{},o=t.multiline===!0,r=t.required!==!1,d=String(t.value||""),v=String(t.title||"Extension Input").trim()||"Extension Input",x=String(t.message||"").trim(),B=String(t.label||"Value").trim()||"Value",P=String(t.submitLabel||"Submit").trim()||"Submit",S=String(t.cancelLabel||"Cancel").trim()||"Cancel",C=String(t.placeholder||"").trim();return n.title.textContent=v,n.message.textContent=x,n.message.classList.toggle("hidden",!x),n.label.textContent=B,n.submitBtn.textContent=P,n.cancelBtn.textContent=S,n.input.classList.toggle("hidden",o),n.textarea.classList.toggle("hidden",!o),n.input.required=!o&&r,n.textarea.required=o&&r,n.input.type=t.password===!0?"password":"text",n.input.placeholder=C,n.textarea.placeholder=C,n.input.value=o?"":d,n.textarea.value=o?d:"",new Promise(L=>{Ze={resolve:L,required:r,multiline:o},lt(()=>{n.modal.classList.remove("hidden"),n.modal.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{(o?n.textarea:n.input).focus(),(o?n.textarea:n.input).select?.()})}).catch(()=>{Ze=null,L({cancelled:!0,value:""})})})}function Mn(e={cancelled:!0,value:""}){const n=tn();if(!n.modal||!Ze)return;const t=Ze;Ze=null,et(()=>{n.modal.classList.add("hidden"),n.modal.setAttribute("aria-hidden","true"),n.form.reset(),n.input.classList.remove("hidden"),n.textarea.classList.add("hidden"),n.input.type="text"}),t.resolve(e)}function Io(){return{modal:document.getElementById("profilePromptModal"),select:document.getElementById("profilePromptSelect"),continueBtn:document.getElementById("profilePromptContinueBtn"),cancelBtn:document.getElementById("profilePromptCancelBtn"),closeBtn:document.getElementById("profilePromptCloseBtn")}}let Vt=null;async function Lo(e,n="guest"){const t=Io();if(!t.modal||!t.select)return{cancelled:!0,profileId:n};if(Vt)return{cancelled:!0,profileId:n};let o=n;const r=t.select;r.innerHTML=Object.values(se).map(v=>{const x=String(v.name||"P").charAt(0).toUpperCase();return`
        <div class="profile-big-item ${v.id===o?"active":""}" data-id="${v.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${v.color};">
            ${x}
          </div>
          <span class="profile-big-name">${Ce(v.name)}</span>
        </div>
      `}).join("");const d=v=>{o=v,r.querySelectorAll(".profile-big-item").forEach(x=>{x.classList.toggle("active",x.dataset.id===v)})};r.querySelectorAll(".profile-big-item").forEach(v=>{const x=()=>{const B=v.dataset.id;!B||!se[B]||d(B)};v.addEventListener("click",x),v.addEventListener("keydown",B=>{(B.key==="Enter"||B.key===" ")&&(B.preventDefault(),x())}),v.addEventListener("dblclick",()=>{x(),t.continueBtn?.click()})});try{await lt(()=>{t.modal.classList.remove("hidden"),t.modal.setAttribute("aria-hidden","false")})}catch{return{cancelled:!0,profileId:n}}return new Promise(v=>{Vt={resolve:v};const x=()=>{et(()=>{t.modal.classList.add("hidden"),t.modal.setAttribute("aria-hidden","true")}),t.continueBtn?.removeEventListener("click",B),t.cancelBtn?.removeEventListener("click",P),t.closeBtn?.removeEventListener("click",P),t.modal.removeEventListener("click",S),Vt=null},B=()=>{x(),v({cancelled:!1,profileId:o})},P=()=>{x(),v({cancelled:!0,profileId:n})};t.continueBtn?.addEventListener("click",B),t.cancelBtn?.addEventListener("click",P),t.closeBtn?.addEventListener("click",P);const S=C=>{C.target===t.modal&&P()};t.modal.addEventListener("click",S)})}function ko(){const e=tn();if(!e.modal||e.modal.dataset.boundExtensionPrompt==="1")return;e.modal.dataset.boundExtensionPrompt="1",e.form?.addEventListener("submit",t=>{if(t.preventDefault(),!Ze)return;const o=Ze.multiline?e.textarea:e.input,r=String(o?.value||"");if(Ze.required&&!r.trim()){o?.focus();return}Mn({cancelled:!1,value:r})});const n=()=>Mn({cancelled:!0,value:""});e.cancelBtn?.addEventListener("click",n),e.closeBtn?.addEventListener("click",n),e.modal.addEventListener("click",t=>{t.target===e.modal&&n()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&Ze&&!e.modal.classList.contains("hidden")&&(t.preventDefault(),n())})}function Kn(){return!!Je()?.lockedProfileId}function Et(e=null){const n=e||Je(),t=!!n?.lockedProfileId,o=document.getElementById("profileBtn");if(o){if(o.classList.toggle("locked",t),t){const r=se[n.lockedProfileId]?.name||"assigned";o.title=`Profile locked to ${r} for this tab`}else o.title="Switch Profile";Gn()}}function Gn(){const e=Kn();document.querySelectorAll(".profile-item[data-id]").forEach(t=>{t.classList.toggle("disabled",e),t.setAttribute("aria-disabled",e?"true":"false")})}function nn(e){return en(e)}function Po(e){const n=ni(e);!n||!se[n]||fe!==n&&ht(n,{bypassLock:!0})}function on(e,n,t){const o=document.getElementById(e);o&&(o.innerHTML=Object.values(se).map(r=>`
      <div class="profile-pill-item ${r.id===n?"active":""}" data-id="${r.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${r.color};"></span>
        <span>${Ce(r.name)}</span>
      </div>
    `).join(""),o.querySelectorAll(".profile-pill-item").forEach(r=>{const d=()=>{const v=r.dataset.id;!v||!se[v]||(o.querySelectorAll(".profile-pill-item").forEach(x=>{x.classList.toggle("active",x.dataset.id===v)}),typeof t=="function"&&t(v))};r.addEventListener("click",d),r.addEventListener("keydown",v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),d())})}))}function ht(e,{bypassLock:n=!1}={}){const t=String(e||"").trim();if(!se[t]){console.warn(`[View] applyProfileSelection: Invalid profile ID "${t}"`);return}if(!n&&Kn()){console.log("[View] applyProfileSelection BLOCKED: active tab is locked");return}console.log(`[View] applyProfileSelection: Switching to ${t}`),fe=t,localStorage.setItem(tt.currentProfileId,t),ai(),document.querySelectorAll(".profile-item").forEach(r=>{r.dataset.id===t?r.classList.add("active"):r.classList.remove("active")})}function Ct(e="",n=""){const t=String(n).toLowerCase(),o=String(e).toLowerCase();let r=o;try{r=decodeURIComponent(o)}catch{r=o}const d=`${t} ${o} ${r}`,v=/\bai\b/.test(t),x=/\b(imagine|empower|production ai|imagine wpp)\b/.test(t),B=d.includes("jira.")||d.includes("jira/")||d.includes("atlassian.net")||d.includes("jira.uhub.biz")||t.includes("jira"),P=t.includes("aem")||t.includes("veeva")||t.includes("gsk")||o.includes("gskinternet.com")||o.includes("gsk-contentlab.veevavault.com")||o.includes("veevavault.com"),S=v||x||o.includes("imagine.wpp.ai")||o.includes("://wpp.ai")||o.includes(".wpp.ai")||d.includes("://wpp.")||d.includes(".wpp.")||d.includes("wpp.com");return B?"vml":P?"gsk":S?"wppproduction":null}function Jn(e,n="",t=""){const o=String(e?.lockedProfileId||"").trim().toLowerCase(),r=Ct(n,t);return o&&Fi(n,t)?o:r}async function Xn(e,n=null,t="New Tab",o={}){const r=String(n||"").trim(),d=r?nn(r):null;if(String(e||"").trim().toLowerCase().startsWith("file://"))return{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:ft(e,se.guest.partition,t,o)};const x=Ct(e,t);if(x&&se[x])return{cancelled:!1,profileId:x,lockedProfileId:x,partition:ft(e,se[x].partition,t,o)};const B=li(e),P=d&&B.find(S=>S.profileId===d)||B.find(S=>S.profileId===fe)||B[0]||null;return P&&se[P.profileId]?{cancelled:!1,profileId:P.profileId,lockedProfileId:P.profileId,partition:ft(e,se[P.profileId].partition,t,o)}:{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:ft(e,se.guest.partition,t,o)}}async function Bo(e,n,t,o){const r=Jn(e,n,t);if(e.lockedProfileId=r,!r){Ve===e.id&&Et(e);return}const d=se[r].partition;if(fe!==r&&ht(r,{bypassLock:!0}),e.partition!==d){e.partition=d,o&&!o.isDestroyed?.()&&o.remove();const v=await no(e);Ve===e.id&&(Et(e),setTimeout(()=>{v.src=n},10));return}Ve===e.id&&Et(e)}function Qn(){return{wppproduction:[],vml:[],gsk:[],guest:[]}}function Zn(e={}){const n=Qn();return Object.keys(n).forEach(t=>{const o=Array.isArray(e?.[t])?e[t]:[];n[t]=o.map(r=>({url:String(r?.url||"").trim(),title:String(r?.title||"Untitled").trim()||"Untitled",visitedAt:r?.visitedAt?Number(r.visitedAt):0})).filter(r=>r.url&&r.url!=="about:blank").slice(0,200)}),n}function ei(){!window.api||typeof window.api.setOneviewSharedStorage!="function"||window.api.setOneviewSharedStorage(Xt,Te).catch(e=>{console.warn("Could not sync profile history to shared storage",e)})}function ti(e=null){if(!e||typeof e!="object")return;Te=Zn(e.value||{});try{localStorage.setItem(Jt,JSON.stringify(Te))}catch{}!document.getElementById("historyManagerModal")?.classList.contains("hidden")&&di()}async function Ao(){if(!(!window.api||typeof window.api.getOneviewSharedStorage!="function"))try{const e=await window.api.getOneviewSharedStorage(Xt);e?.success&&e.entry?ti(e.entry):ei()}catch(e){console.warn("Could not hydrate profile history from shared storage",e)}}function To(){try{const e=JSON.parse(localStorage.getItem(Jt)||"{}");Te=Zn(e)}catch{Te=Qn()}}function rn(){localStorage.setItem(Jt,JSON.stringify(Te)),ei()}function ni(e){return e&&(e.lockedProfileId||en(e.partition))||fe}function ii(e){return e&&(qn(e.partition)||e.lockedProfileId)||fe}function $o(e,n,t){if(!Te[e])return;const o=String(n||"").trim();if(!o||o==="about:blank"||o.startsWith("devtools://"))return;const r=String(t||"Untitled").trim()||"Untitled",d=Te[e]||[],v=d.findIndex(B=>B.url===o),x={url:o,title:r,visitedAt:Date.now()};v===0?d[0]=x:(v>0&&d.splice(v,1),d.unshift(x)),Te[e]=d.slice(0,200),rn()}function oi(e){if(!e)return"Unknown Date";try{return new Date(e).toLocaleString()}catch{return""}}function _o(){if(yt!==null)return yt;try{yt=window.api&&typeof window.api.getWebviewPreloadPath=="function"?window.api.getWebviewPreloadPath():""}catch{yt=""}return yt}function Do(e,n={}){const t=String(n?.appType||"").trim().toLowerCase(),o=String(e||"").trim().toLowerCase();return typeof n?.requiresPlatformApi=="boolean"?n.requiresPlatformApi:t&&t!=="website"?!0:t==="website"&&Bt(o)}function Mo(e){return e?.getAttribute("data-platform-api-enabled")==="1"}function Uo(e,n){!e||typeof e.setAttribute!="function"||e.setAttribute("data-platform-api-enabled",n?"1":"0")}function No(e=""){const n=String(e).trim();if(!n)return"APP";const t=n.split(/\s+/).filter(Boolean);return t.length===1?t[0].slice(0,3).toUpperCase():t.slice(0,3).map(o=>o[0]).join("").toUpperCase()}function Oo(e=""){const n=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)","linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)","linear-gradient(to right, #4facfe 0%, #00f2fe 100%)","linear-gradient(to top, #30cfd0 0%, #330867 100%)"],t=String(e);let o=0;for(let r=0;r<t.length;r+=1)o=(o+t.charCodeAt(r)*(r+1))%n.length;return n[o]}function Ro(e="app"){let n=document.getElementById("view-launch-loader");n?n.style.display="flex":(n=document.createElement("div"),n.id="view-launch-loader",n.style.cssText=["position:fixed","inset:0","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","background:rgba(15,23,42,0.45)","backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)"].join(";"),n.innerHTML=`
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
    `,document.body.appendChild(n));const t=n.querySelector("p");return t&&(t.textContent=`Opening ${e||"app"}...`),()=>{n&&(n.style.display="none")}}async function Fo(e){if(!e)return;const t=JSON.parse(localStorage.getItem(tt.installedApps)||"{}")[e];if(!t){console.warn("Installed app not found:",e);return}const o=t.name||"App",r=Ro(o),d=Si(t);console.log("[OneView Tracking] View launch decision",{appId:e,appName:t?.name||"",appType:t?.type||"",clickTrackingMode:t?.clickTrackingMode||"",trackOnLaunch:t?.trackOnLaunch,oneviewUrl:t?.oneviewUrl||"",hasLocalPath:!!t?.localPath,shouldTrackLaunch:d}),d&&Ei({currentSelectedTicketId:window.currentActiveTicketKey||"",clickedAppName:o});try{if(wn(t)){await xi(t),Ke(`Opened "${o}" in a separate window.`,"info");return}const v=()=>Je()?.partition||se[fe]?.partition||be.guest,x=async(P,S={})=>{await Ae(P,v(),o,null,{hideControls:!0,appType:t.type,trackingAppId:e,trackingAppName:o,bypassPrompt:!0,...S})},B=String(t.type||"").toLowerCase();if(Qt.has(B)&&t.localPath){Tn(`Starting ${o}...`);let P=String(t.oneviewUrl||"").trim();if(window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const C=await window.api.resolveOneviewAppUrl(e,t.localPath,"/",v());if(C?.success&&C.url){P=C.url;const L=JSON.parse(localStorage.getItem(tt.installedApps)||"{}");L[e]&&(L[e]={...L[e],oneviewUrl:P},localStorage.setItem(tt.installedApps,JSON.stringify(L)))}}const S=["nextjs","next","vite-server"].includes(B);if(P&&Bt(P)&&S&&(P=""),P&&Bt(P))await x(P);else{const C=await window.api.launchNextApp(t.localPath,t.type);await x(C)}return}if(t.type==="website"&&t.url){await x(t.url);return}if(t.type==="exe"&&t.localPath){Tn(`Launching ${o}...`);const P=await window.api.launchExe(t.localPath,t.tech);if(P&&P.mode==="embedded"&&P.url){const S=new URLSearchParams;P.token&&S.set("NL_TOKEN",P.token),t.tech&&S.set("TECH",t.tech);const C=String(P.url).split(":")[2];C&&S.set("NL_PORT",C);const L=`${P.url}?${S.toString()}`;await x(L)}else P?.success&&P.mode==="external"?Ke(`Opened "${o}" in a separate window.`,"info"):alert(`${o} launched externally. Embedded view is not available for this app.`);return}alert(`Cannot launch "${o}". Missing supported launch configuration.`)}catch(v){if(wn(t)){console.error("Failed to launch external Electron app from view:",v),Ke(`Failed to launch "${o}".`,"error");return}console.error("Failed to launch installed app from view:",v),alert(`Failed to launch "${o}": ${v.message||v}`)}finally{r()}}async function ri(e,n=null,t="New Tab",o=!1,r={}){let d=String(e||"").trim();if(!d)return;if(/^file:\/\/\/https?:\/\//i.test(d)?d=d.replace(/^file:\/\/\//i,""):/^file:\/\/https?:\/\//i.test(d)&&(d=d.replace(/^file:\/\//i,"")),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){const F=be.gsk;window.enterSiteSnapStudioMode();const V=Kt(),ee=(V||[]).some(le=>{const j=String(le.url||"").trim();return j&&j!=="about:blank"&&j!=="newtab"});!V||V.length===0||o||ee?await Ae(d,F,t,null,r):await xt(d,F,t,null,r);return}let v=o;d.toLowerCase().startsWith("file://")&&(v=!0);const B=await Xn(d,n,t,r);if(!B||B.cancelled)return;const P=B.partition,S=B.profileId,C=B.lockedProfileId;S&&S!==Mi()&&ht(S,{bypassLock:!0});const L=Kt();if(!L||L.length===0){await Ae(d,P,t,C,r);return}const D=L.some(F=>{const V=String(F.url||"").trim();return V&&V!=="about:blank"&&V!=="newtab"});if(v||D){await Ae(d,P,t,C,r);return}let R=Je();if(!R){const F=L[L.length-1];F&&(await Ye(F.id),R=F)}if(!R){await Ae(d,P,t,C,r);return}await xt(d,P,t,C,r)}window.initViewPage=Yn;window.createTab=Ae;window.getTabs=Kt;window.getActiveTab=Je;window.closeTab=Ut;window.getActiveWebview=Ge;window.launchInstalledAppFromView=Fo;window.openUrlFromDashboard=ri;function Wo(){const e=localStorage.getItem(tt.currentProfileId);e&&se[e]?fe=e:fe="guest",ai();const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");n&&t&&(n.addEventListener("click",async o=>{o.stopPropagation(),t.classList.contains("hidden")?await lt(()=>t.classList.remove("hidden")):et(()=>t.classList.add("hidden"))}),t.innerHTML=Object.values(se).map(o=>`
        <div class="profile-item ${o.id===fe?"active":""}" data-id="${o.id}">
            <div class="profile-item-dot" style="background-color: ${o.color}"></div>
            <span>${o.name}</span>
        </div>
    `).join("").concat(`
        <div class="profile-divider"></div>
        <div class="profile-item" data-action="manage-passwords">
          <div class="profile-item-dot" style="background-color: #6366f1"></div>
          <span>Manage Passwords</span>
        </div>
      `),t.querySelectorAll(".profile-item").forEach(o=>{o.addEventListener("click",async()=>{if(o.dataset.action==="manage-passwords"){Gt("passwords"),et(()=>t.classList.add("hidden"));return}const r=o.dataset.id;o.classList.contains("disabled")||(si(r),et(()=>t.classList.add("hidden")))})}),Gn())}function si(e){ht(e)}function ai(){const e=se[fe],n=document.getElementById("profileBtn"),t=document.getElementById("profileLabel");n&&t&&(t.textContent=e.label,t.style.color=e.color),Et()}function Ho(){const e=document.querySelector(".bookmarks-grid");e&&e.addEventListener("click",n=>{const t=n.target.closest(".bookmark-edit-btn");if(t){n.preventDefault(),n.stopPropagation();const L=t.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;L&&Ko(L);return}const o=n.target.closest(".bookmark-delete-btn");if(o){n.preventDefault(),n.stopPropagation();const L=o.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;L&&(Oe=Oe.filter(D=>D.id!==L),ci(),sn());return}const r=n.target.closest(".bookmark-card");if(!r||r.id==="addBookmarkBtn"||r.classList.contains("add-bookmark-card"))return;const d=r.dataset.url,v=r.dataset.title||"New Tab",x=String(r.dataset.partition||"").trim(),B=String(r.dataset.sessionScope||"").trim(),S=r.dataset.profileId||nn(r.dataset.partition)||Ct(d||"",v)||fe;if(S!==fe&&si(S),d){const C=ft(d,x||se[S].partition,v,B?{sessionScope:B}:{});xt(d,C,v,Ct(d||"",v))}})}function wt(e=""){const n=String(e).trim();return n?/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/^about:/i.test(n)?n:`https://${n}`:""}function _t(e=""){const n=wt(e);if(!n)return"";try{const t=new URL(n),o=t.pathname.length>1?t.pathname.replace(/\/+$/,"")||"/":t.pathname||"/";return`${t.origin}${o}${t.search}${t.hash}`}catch{return n.replace(/\/+$/,"")}}function li(e=""){const n=_t(e);return n?Oe.filter(t=>_t(t.url)===n):[]}function Vo(e="",n=""){const t=li(e);return n?t.find(o=>String(o.profileId||"").trim().toLowerCase()===n)||null:t[0]||null}function jo(e=null){return e?String(e.lockedProfileId||"").trim().toLowerCase()||nn(e.partition)||fe||"guest":fe||"guest"}function zo(){try{const e=JSON.parse(localStorage.getItem(Fn)||"[]");Oe=Array.isArray(e)?e.map(n=>({id:String(n?.id||""),title:String(n?.title||"").trim(),url:wt(n?.url||""),profileId:se[n?.profileId]?n.profileId:"guest"})).filter(n=>n.id&&n.title&&n.url):[]}catch{Oe=[]}}function ci(){localStorage.setItem(Fn,JSON.stringify(Oe))}function qo({id:e="",title:n="",url:t="",profileId:o="guest"}){const r=wt(t),d=String(n||"").trim()||r,v=se[o]?o:"guest",x=_t(r);if(!r||!x)return!1;const B=Oe.findIndex(S=>e&&S.id===e?!0:_t(S.url)===x&&String(S.profileId||"guest")===v),P={id:B>=0?Oe[B].id:e||`bm-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:d,url:r,profileId:v};return B>=0?Oe[B]={...Oe[B],...P}:Oe.unshift(P),B>=0?"updated":"created"}function sn(){const e=document.querySelector(".bookmarks-grid");if(!e)return;e.querySelectorAll(".bookmark-card.custom-bookmark").forEach(o=>o.remove());const n=Oe.map(o=>{const r=se[o.profileId]||se.guest;return`
        <div
          class="bookmark-card custom-bookmark"
          data-bookmark-id="${Ce(o.id)}"
          data-url="${Ce(o.url)}"
          data-title="${Ce(o.title)}"
          data-profile-id="${Ce(o.profileId)}"
        >
          <button class="bookmark-edit-btn" type="button" title="Edit Bookmark">E</button>
          <button class="bookmark-delete-btn" type="button" title="Remove Bookmark">X</button>
          <div class="bookmark-icon" style="background:${Oo(o.title)};">
            <span>${Ce(No(o.title))}</span>
          </div>
          <div class="bookmark-info">
            <h3>${Ce(o.title)}</h3>
            <p>${Ce(r.name)} Profile</p>
          </div>
        </div>
      `}).join(""),t=document.getElementById("addBookmarkBtn");t?t.insertAdjacentHTML("beforebegin",n):e.insertAdjacentHTML("beforeend",n)}function Yo(){const e=document.getElementById("addBookmarkBtn"),n=document.getElementById("bookmarkCurrentPageHeaderBtn"),t=document.getElementById("bookmarkModal"),o=document.getElementById("bookmarkModalCloseBtn"),r=document.getElementById("bookmarkForm"),d=document.getElementById("bookmarkTitleInput"),v=document.getElementById("bookmarkUrlInput"),x=t?.querySelector(".password-modal-header h3"),B=document.getElementById("bookmarkSaveBtn");if(!e||!t||!o||!r||!d||!v)return;const P=()=>{et(()=>{t.classList.add("hidden"),Pt=null})},S=async({editId:D=null,title:R="",url:F="",profileId:V=fe,heading:ee="Add Bookmark",saveLabel:le="Save Bookmark"}={})=>{Pt=D,dt=se[V]?V:fe,on("bookmarkProfileSelect",dt,j=>{dt=j}),x&&(x.textContent=ee),B&&(B.textContent=le),r.reset(),d.value=String(R||""),v.value=String(F||""),await lt(()=>t.classList.remove("hidden")),d.value?(d.focus(),d.select()):d.focus()},C=async()=>{await S()},L=async()=>{const D=Je(),R=wt(D?.url||"");if(!D||D.isHome||!R||R==="about:blank"){Ke("Open a website tab first to save it as a bookmark.","error");return}const F=jo(D),V=Vo(R,F);await S({editId:V?.id||null,title:D.title||V?.title||"New Bookmark",url:R,profileId:F,heading:V?"Update Bookmark":"Save Current Site",saveLabel:V?"Update Bookmark":"Save Bookmark"})};e.addEventListener("click",C),e.addEventListener("keydown",async D=>{(D.key==="Enter"||D.key===" ")&&(D.preventDefault(),await C())}),n?.addEventListener("click",L),n?.addEventListener("keydown",async D=>{(D.key==="Enter"||D.key===" ")&&(D.preventDefault(),await L())}),o.addEventListener("click",P),t.addEventListener("click",D=>{D.target===t&&P()}),r.addEventListener("submit",D=>{D.preventDefault();const R=String(d.value||"").trim(),F=wt(v.value);if(!R||!F)return;const V=qo({id:Pt,title:R,url:F,profileId:dt||fe});V&&(ci(),sn(),P(),r.reset(),Ke(V==="updated"?"Bookmark updated successfully.":"Bookmark saved successfully.","success"))})}async function Ko(e){const n=document.getElementById("bookmarkModal"),t=document.getElementById("bookmarkForm"),o=document.getElementById("bookmarkTitleInput"),r=document.getElementById("bookmarkUrlInput"),d=n?.querySelector(".password-modal-header h3"),v=document.getElementById("bookmarkSaveBtn");if(!n||!t||!o||!r)return;const x=Oe.find(B=>B.id===e);x&&(Pt=x.id,dt=x.profileId||fe,d&&(d.textContent="Edit Bookmark"),v&&(v.textContent="Update Bookmark"),on("bookmarkProfileSelect",dt,B=>{dt=B}),o.value=x.title||"",r.value=x.url||"",await lt(()=>n.classList.remove("hidden")),o.focus())}function Go(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;const o=220;n.addEventListener("click",()=>{e.scrollBy({left:-o,behavior:"smooth"})}),t.addEventListener("click",()=>{e.scrollBy({left:o,behavior:"smooth"})}),e.addEventListener("scroll",Dt),Dt()}function di(){const e=document.getElementById("historyList"),n=document.getElementById("historyProfileSelect");if(!e||!n)return;const t=qt||fe,o=Te[t]||[];if(o.length===0){e.innerHTML="<div class='password-meta'>No history for this profile yet.</div>";return}const r=new Date,d=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),v=d-864e5,x={today:[],yesterday:[],older:[]};o.forEach((L,D)=>{const R={...L,originalIndex:D},F=L.visitedAt||0;F>=d?x.today.push(R):F>=v?x.yesterday.push(R):x.older.push(R)});const B=L=>L.toLocaleDateString(void 0,{month:"short",day:"numeric"}),P=`Today - ${B(r)}`,S=`Yesterday - ${B(new Date(v))}`,C=(L,D,R=!1)=>{if(D.length===0)return"";const F=D.map(V=>`
      <div class="history-item" data-index="${V.originalIndex}">
        <div class="history-main">
          <div class="history-title">${Ce(V.title||"Untitled")}</div>
          <div class="history-url">${Ce(V.url||"")}</div>
          <div class="password-meta">${Ce(oi(V.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `).join("");return`
      <details class="history-group" ${R?"open":""}>
        <summary class="history-group-title">
          <span>${L}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${D.length}</span>
        </summary>
        <div class="history-group-content">
          ${F}
        </div>
      </details>
    `};e.innerHTML=`
    ${C(P,x.today,x.today.length>0)}
    ${C(S,x.yesterday,!1)}
    ${C("Older",x.older,!1)}
  `,e.querySelectorAll(".history-item").forEach(L=>{L.addEventListener("click",D=>{const R=D.target.closest("button");if(!R)return;const F=Number(L.dataset.index);if(Number.isNaN(F))return;const V=Te[t]||[],ee=V[F];if(ee){if(R.dataset.action==="delete"){V.splice(F,1),Te[t]=V,rn(),di();return}if(R.dataset.action==="open"){const le=se[t]?.partition||be.guest;Ae(ee.url,le,ee.title||"History",t)}}})})}async function at({title:e="Clear Page Cache",message:n="",confirmLabel:t="OK",cancelLabel:o="Cancel",hideCancel:r=!1}={}){const d=document.getElementById("cacheActionModal"),v=document.getElementById("cacheActionTitle"),x=document.getElementById("cacheActionMessage"),B=document.getElementById("cacheActionCloseBtn"),P=document.getElementById("cacheActionCancelBtn"),S=document.getElementById("cacheActionConfirmBtn");return!d||!v||!x||!B||!P||!S?Promise.resolve(window.confirm(n||e)):(v.textContent=e,x.textContent=n,S.textContent=t,P.textContent=o,P.style.display=r?"none":"inline-flex",await lt(()=>d.classList.remove("hidden")),new Promise(C=>{const L=()=>{B.removeEventListener("click",D),P.removeEventListener("click",D),S.removeEventListener("click",R),d.removeEventListener("click",F),et(()=>d.classList.add("hidden"))},D=()=>{L(),C(!1)},R=()=>{L(),C(!0)},F=V=>{V.target===d&&D()};B.addEventListener("click",D),P.addEventListener("click",D),S.addEventListener("click",R),d.addEventListener("click",F)}))}function Dt(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;if(!(e.scrollWidth>e.clientWidth+1)){n.classList.add("hidden"),t.classList.add("hidden"),e.scrollLeft=0;return}const r=e.scrollLeft<=1,d=e.scrollLeft+e.clientWidth>=e.scrollWidth-1;n.classList.toggle("hidden",r),t.classList.toggle("hidden",d)}function an(e){if(!e)return null;if(typeof e.getWebContentsId=="function")try{const n=e.getWebContentsId();if(n)return n}catch{}return e._webContent?e._webContent.key||e._webContent.id||null:e.key||e.id||e.getAttribute("key")||e.getAttribute("id")||null}async function Jo(e,n){const t=re.findIndex(r=>r.id===n),o=re[t];if(e==="duplicate-tab"&&o){io(n);return}if(e==="inspect-local-file"&&o){const r=document.getElementById(`webview-${o.id}`),d=an(r);if(!d||!window.api?.toggleWebviewDevTools){Ke(At?"Inspect is not available for this tab.":"Inspect is not available for this local file tab.","error");return}await window.api.toggleWebviewDevTools(d)||Ke(At?"Could not open developer tools.":"Could not open developer tools for this local file.","error");return}if(e==="clear-cache"&&o){const r=document.getElementById(`webview-${o.id}`),d=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",v=r&&r.getAttribute("partition")||o.partition||be.guest;if(!d||d==="about:blank"||!await at({title:"Clear Page Cache",message:`Clear cache and site data for ${d}?`,confirmLabel:"Clear Cache",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewPageCache!="function"){await at({title:"Action Unavailable",message:"Cache clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const B=await window.api.clearWebviewPageCache(v,d);B?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await at({title:"Could Not Clear Cache",message:B?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(B){const P=String(B?.message||B||""),S=/No handler registered for 'clear-webview-page-cache'/.test(P)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await at({title:"Could Not Clear Cache",message:`${P}${S}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-user-data"&&o){const r=document.getElementById(`webview-${o.id}`),d=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",v=r&&r.getAttribute("partition")||o.partition||be.guest;if(!d||d==="about:blank"||!await at({title:"Clear User Data",message:`Clear local storage and site data for ${d}?`,confirmLabel:"Clear Data",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewUserData!="function"){await at({title:"Action Unavailable",message:"User-data clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const B=await window.api.clearWebviewUserData(v,d);B?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await at({title:"Could Not Clear User Data",message:B?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(B){const P=String(B?.message||B||""),S=/No handler registered for 'clear-webview-user-data'/.test(P)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await at({title:"Could Not Clear User Data",message:`${P}${S}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-all"){mt(re.map(r=>r.id));return}if(e==="clear-right"&&t>=0){mt(re.slice(t+1).map(r=>r.id));return}e==="clear-left"&&t>=0&&mt(re.slice(0,t).map(r=>r.id))}function Xo(){const e=document.querySelector(".tabs-header");e&&e.addEventListener("contextmenu",async n=>{if(n.target.closest(".profile-section"))return;n.preventDefault();const r=n.target.closest(".tab")?.id?.replace("tab-ui-","")||Ve||re[0]?.id||null;if(!r)return;Rn=r;const d=re.findIndex(L=>L.id===r),v=re[d],x=document.getElementById(`webview-${r}`),B=ro(v,x),P=!!(v&&!v.isHome&&(x&&x.getURL()!=="about:blank"||v.url)),S=d>0?d:0,C=d>=0&&d<re.length-1?re.length-d-1:0;window.api&&typeof window.api.showNativeTabContextMenu=="function"&&await window.api.showNativeTabContextMenu({anchorId:r,x:Math.round(n.x),y:Math.round(n.y),disabled:{clearLeft:S===0,clearRight:C===0,clearCache:!P,clearUserData:!P,inspectLocalFile:!B}})})}function jt(e){if(!e)return"";const n=String(e.getData("text/uri-list")||"").split(/\r?\n/).map(d=>d.trim()).find(d=>d&&!d.startsWith("#"));if(n&&/^https?:\/\//i.test(n))return n;const o=String(e.getData("text/html")||"").match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);if(o&&/^https?:\/\//i.test(String(o[1]||"").trim()))return String(o[1]||"").trim();const r=String(e.getData("text/plain")||"").trim();return/^https?:\/\//i.test(r)?r:r&&!/\s/.test(r)&&/\./.test(r)?wt(r):""}function Qo(){const e=document.querySelector(".tabs-header");if(!e||e.dataset.dropBound==="1")return;e.dataset.dropBound="1";const n=t=>{e.classList.toggle("is-drop-target",!!t)};e.addEventListener("dragenter",t=>{jt(t.dataTransfer)&&(t.preventDefault(),n(!0))}),e.addEventListener("dragover",t=>{jt(t.dataTransfer)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),n(!0))}),e.addEventListener("dragleave",t=>{e.contains(t.relatedTarget)||n(!1)}),e.addEventListener("drop",t=>{const o=jt(t.dataTransfer);if(n(!1),!o)return;t.preventDefault();const d=t.target.closest(".tab")?.id?.replace("tab-ui-","")||Ve,v=re.findIndex(x=>x.id===d);Ae(o,null,"New Tab",null,{insertIndex:v>=0?v+1:re.length})})}function Zo(e){const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");!n||!t||!n.contains(e.target)&&!t.contains(e.target)&&!t.classList.contains("hidden")&&et(()=>t.classList.add("hidden"))}async function er(e){const n=String(e?.action||"");if(!n||n==="__menu_closed__")return;const t=String(e?.anchorId||Rn||Ve||re[0]?.id||"");t&&await Jo(n,t)}const Un={desktop:{width:1920,height:1080,userAgent:"desktop"},mobile:{width:414,height:896,userAgent:"mobile"},tablet:{width:768,height:1024,userAgent:"tablet"}};async function ui(e,n="mobile"){if(!e)throw new Error("No active webview");const t=Un[n]||Un.mobile;if(console.log(`[Viewport] Setting ${n} viewport: ${t.width}x${t.height}`),window.api?.setWebviewBounds){const o=an(e);o&&(console.log(`[Viewport] Triggering native resize to ${t.width}x${t.height} for id: ${o}`),await window.api.setWebviewBounds(o,{width:t.width,height:t.height}))}return window.__oneview_original_webview_dims||(window.__oneview_original_webview_dims={width:e.style.width,height:e.style.height,minWidth:e.style.minWidth,minHeight:e.style.minHeight,maxWidth:e.style.maxWidth,maxHeight:e.style.maxHeight,flex:e.style.flex}),e.style.width=t.width+"px",e.style.height=t.height+"px",e.style.minWidth=t.width+"px",e.style.minHeight=t.height+"px",e.style.maxWidth=t.width+"px",e.style.maxHeight=t.height+"px",e.style.flex="none",console.log(`[Viewport] Resized webview element to ${t.width}x${t.height}`),await e.executeJavaScript(`
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
    `,!0),await new Promise(o=>setTimeout(o,300)),t}async function tr(e){if(e&&window.api?.setWebviewBounds){const n=document.getElementById("webviews-container"),t=an(e);if(n&&t){const o=n.getBoundingClientRect();await window.api.setWebviewBounds(t,{width:Math.round(o.width),height:Math.round(o.height)})}}}async function pi(e){if(console.log("[Viewport] Resetting to original viewport"),window.__oneview_original_webview_dims&&e){const n=window.__oneview_original_webview_dims;e.style.width=n.width,e.style.height=n.height,e.style.minWidth=n.minWidth,e.style.minHeight=n.minHeight,e.style.maxWidth=n.maxWidth,e.style.maxHeight=n.maxHeight,e.style.flex=n.flex,window.__oneview_original_webview_dims=null,await tr(e),console.log("[Viewport] Webview element dimensions and native bounds restored")}await e.executeJavaScript(`
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
    `,!0),await new Promise(n=>setTimeout(n,500))}async function nr(e={}){const n=Ge();if(!n||typeof n.executeJavaScript!="function")throw new Error("Active tab is unavailable");if(typeof n.capturePage!="function")throw new Error("Active tab does not support capture");const t=String(e?.viewport||"desktop").trim().toLowerCase();if(console.log("[Capture] Active webview found",{id:n.id,url:n.getURL?.(),title:n.getTitle?.(),viewport:t,loading:n._webContent?.state?.loading}),t==="mobile"||t==="tablet"){const j=t==="tablet"?"tablet":"mobile";await ui(n,j),console.log("[Capture] Viewport changed to "+j+", waiting for page reflow..."),await new Promise(ae=>setTimeout(ae,300))}const o=5e3,r=Date.now();for(;n._webContent?.state?.loading&&Date.now()-r<o;)console.log("[Capture] Waiting for page to load..."),await new Promise(j=>setTimeout(j,200));console.log("[Capture] Page load status:",n._webContent?.state?.loading?"still loading":"loaded");const d=String(e?.mode||"visible").trim().toLowerCase();if(d!=="full"&&d!=="fullpage"){const j=await n.capturePage(),ae=j?.isEmpty?.()?"":j.toDataURL();return console.log("[CapturePage] Visible captured. DataUrl length:",ae?.length||0),{mode:"visible",dataUrl:ae,width:j?.getSize?.()?.width||0,height:j?.getSize?.()?.height||0}}const v=await n.executeJavaScript(`
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
  `,!0).catch(()=>{}),x>B+100){console.log("[FullCapture] Verifying scroll functionality...");const ae=await n.executeJavaScript(`
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
    `,!0).catch(()=>null);console.log("[FullCapture] Verification scroll results:",ae);const Ie=Number(ae?.startY||0),Le=Number(ae?.endY||0);if(Le-Ie<10)throw new Error("Scroll verification failed: page did not scroll (startY="+Ie+", endY="+Le+"). Capture aborted to prevent repeating/empty fallback images.");await n.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `,!0).catch(()=>{})}const P=Math.floor(B*.8),S=Math.ceil(x/P);console.log("[FullCapture] Progressive scroll: "+S+" steps, "+P+"px per step");let C=0;for(let j=0;j<S;j++){C=Math.min(C+P,x),console.log(`[FullCapture] Scrolling host-driven to ${C}px (${j+1}/${S})`);const ae=`
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
    `;await n.executeJavaScript(ae,!0).catch(()=>{}),await new Promise(Ie=>setTimeout(Ie,600))}await n.executeJavaScript(`window.scrollTo({ top: ${x}, left: 0, behavior: 'auto' });`,!0).catch(()=>{}),await new Promise(j=>setTimeout(j,800)),await n.executeJavaScript(`
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
  `,!0).catch(()=>{}),console.log("[FullCapture] Scrolling back to top...");const L=`
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
  `;await n.executeJavaScript(L,!0).catch(()=>{});let D=0,R=!1;for(;!R&&D<50;)await n.executeJavaScript("(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)",!0).catch(()=>0)<=5?R=!0:(await n.executeJavaScript(L,!0).catch(()=>{}),await new Promise(ae=>setTimeout(ae,100)),D++);await n.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");const F=Number(e?.wait||0)*1e3,V=200+F;console.log(`[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${V}ms (Base 0.2s + User ${F}ms) for page to settle live...`),await new Promise(j=>setTimeout(j,V));let ee="",le=null;try{console.log("[FullCapture] Calling native one-shot capture..."),le=await n.capturePage({mode:"full",scrollHeight:Math.round(x)}),ee=le?.isEmpty?.()?"":le.toDataURL()}finally{console.log("[FullCapture] Restoring original body and globals..."),await n.executeJavaScript(`
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
      `,!0).catch(()=>{}),(t==="mobile"||t==="tablet")&&await pi(n),await n.executeJavaScript(`
        window.scrollTo(${Math.round(Number(v?.scrollX||0))}, ${Math.round(Number(v?.scrollY||0))});
      `,!0).catch(()=>{})}if(!ee)throw new Error("Full page capture returned empty image data");return{mode:"full",dataUrl:ee,width:le?.getSize?.()?.width||0,height:le?.getSize?.()?.height||0,tileCount:1}}async function ir(e){const n=String(e?.command||"").trim(),t=String(e?.url||"").trim(),o=String(e?.requestId||"").trim();if(!n)return;if(n==="execute-script"){const S=String(e?.source||"");let C={requestId:o,success:!1,message:"No active tab"};try{const L=Ge();if(!L||typeof L.executeJavaScript!="function")C={requestId:o,success:!1,message:"Active tab is unavailable"};else{const D=`
          (() => {
            const run = () => {
              ${S}
            };
            return run();
          })();
        `,R=await L.executeJavaScript(D,!0);C={requestId:o,success:!0,result:R}}}catch(L){C={requestId:o,success:!1,message:L?.message||String(L)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(C);return}if(n==="ui-prompt"){let S={requestId:o,success:!1,message:"Prompt request failed"};try{const C=await Co(e?.prompt||{});S={requestId:o,success:!0,result:C}}catch(C){S={requestId:o,success:!1,message:C?.message||String(C)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(S);return}if(n==="capture-page"){let S={requestId:o,success:!1,message:"Capture request failed",key:e?.key||"view:extension-popup"};try{const C=String(e?.options?.mode||"visible").trim().toLowerCase(),L=String(e?.options?.viewport||"desktop").trim().toLowerCase(),D=Number(e?.options?.wait||0);if(console.log("[View] Capturing mode:",C,"viewport:",L,"wait:",D),C==="full"||C==="fullpage"){console.log("[View] Using full-page capture function");const R=await nr({mode:C,viewport:L,wait:D});S={requestId:o,success:!0,result:R,key:e?.key||"view:extension-popup"}}else{const R=Ge();if(!R||typeof R.capturePage!="function")throw new Error("Active tab does not support capture");if(console.log("[View] Capturing visible area from webview id:",R.id),L==="mobile"||L==="tablet"){const le=L==="tablet"?"tablet":"mobile";await ui(R,le),console.log("[View] Viewport changed to "+le+", waiting for page reflow..."),await new Promise(j=>setTimeout(j,800))}const F=await R.capturePage(),V=F?.isEmpty?.()?"":F.toDataURL?.();console.log("[View] Visible capture dataUrl length:",V?.length||0);const ee={mode:"visible",dataUrl:V,width:F?.getSize?.()?.width||0,height:F?.getSize?.()?.height||0};(L==="mobile"||L==="tablet")&&await pi(R),S={requestId:o,success:!0,result:ee,key:e?.key||"view:extension-popup"}}}catch(C){console.error("[View] Capture error:",C),S={requestId:o,success:!1,message:C?.message||String(C),key:e?.key||"view:extension-popup"}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(S);return}if(n==="tabs-create"){const S=String(e.url||"").trim(),C=e.requestId;let L=e.partition||null;if(!L&&S.startsWith(`${Li}://`))try{L=`ext-${new URL(S).host}`}catch{}const D=L?gt(L):"",R=re.find(F=>F.url&&F.url.includes("result.html")&&(!D||gt(F.partition||"")===D));R?(console.log("[View] Reusing existing result tab:",R.id),await so(R.id,S,L,"Result"),e.active!==!1&&await Ye(R.id)):await Ae(S,L,"Result",null,{active:e.active!==!1,extensionEntryPath:e.entryPath}),C&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:C,success:!0});return}if(n==="tabs-close"){let S={requestId:o,success:!1,message:"Tab not found"};try{const C=String(e?.tabId||"").trim();re.find(D=>D.id===C)?(Ut(C),S={requestId:o,success:!0,result:{id:C,closed:!0}}):S={requestId:o,success:!1,message:"Tab not found"}}catch(C){S={requestId:o,success:!1,message:C?.message||String(C)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(S);return}if(!t)return;const r=Je(),d=Ge(),v=r?.partition||se[fe]?.partition||be.guest,x=/^file:\/\//i.test(t),B={extensionEntryPath:x?String(e?.entryPath||"").trim():"",extensionActiveContext:{url:String(d?.getURL?.()||r?.url||"").trim(),title:String(d?.getTitle?.()||r?.title||"").trim()},active:e?.active!==!1};if(x){const S=re.find(C=>C.url===t);if(S){await Ye(S.id),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:S.id,url:t,title:S.title||"New Tab",active:!0}});return}}if(n==="tabs-update"&&r&&!r.isHome&&!r.nativePage){await xt(t,v,"New Tab",null,B),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:r.id,url:t,title:r.title||"New Tab",active:!0}});return}r?.id;const P=Ae(t,v,"New Tab",null,B);o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:P?.id||"",url:t,title:P?.title||"New Tab",active:e?.active!==!1}})}function or(){Pn||(Pn=!0,document.addEventListener("click",Zo),document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const n=String(e.key||"").toLowerCase();if(!(!(e.key==="Tab"||e.key==="PageUp"||e.key==="PageDown")&&mo(e.target))){if(n==="h"&&!e.shiftKey){e.preventDefault(),Gt("history");return}if(n==="d"&&e.shiftKey){e.preventDefault(),Gt("downloads");return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation(),kt(e.shiftKey?-1:1);return}if(e.key==="PageUp"){e.preventDefault(),e.stopPropagation(),kt(-1);return}e.key==="PageDown"&&(e.preventDefault(),e.stopPropagation(),kt(1))}},!0),window.addEventListener("resize",Dt),Qo(),window.api&&typeof window.api.onViewTabShortcut=="function"&&window.api.onViewTabShortcut(e=>{const n=Number(e?.direction||0);n&&kt(n<0?-1:1)}),window.api&&typeof window.api.onBrowserExtensionsUpdated=="function"&&window.api.onBrowserExtensionsUpdated(()=>{console.log("Browser extensions updated, refreshing UI..."),jn().catch(()=>{})}),window.api&&typeof window.api.onNativeTabContextAction=="function"&&window.api.onNativeTabContextAction(e=>{er(e).catch(()=>{})}),window.api&&typeof window.api.onBrowserExtensionCommand=="function"&&window.api.onBrowserExtensionCommand(e=>{ir(e).catch(n=>{console.error("Browser extension command failed",n)})}))}let zt,Nn;const On=new ResizeObserver(()=>{const e=Ge();!e||typeof e.syncBounds!="function"||(e.syncBounds(!0),clearInterval(zt),clearTimeout(Nn),zt=setInterval(()=>{const n=Ge();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},50),Nn=setTimeout(()=>{clearInterval(zt);const n=Ge();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},350))});(function(){const n=document.getElementById("webviews-container");if(n){On.observe(n);return}const t=new MutationObserver(()=>{const o=document.getElementById("webviews-container");o&&(t.disconnect(),On.observe(o))});t.observe(document.documentElement,{childList:!0,subtree:!0})})();window.enterSiteSnapStudioMode=function(){document.body.classList.add("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.add("sitesnap-studio-mode");try{window.parent.document.body.classList.add("sitesnap-studio-active")}catch(n){console.error("Failed to set parent active layout",n)}};window.exitSiteSnapStudioMode=function(){document.body.classList.remove("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.remove("sitesnap-studio-mode");try{window.parent.document.body.classList.remove("sitesnap-studio-active")}catch(n){console.error("Failed to remove parent active layout",n)}};
