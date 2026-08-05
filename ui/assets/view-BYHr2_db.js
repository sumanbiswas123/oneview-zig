import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{c as gn,d as Si,s as Ei,t as xi,o as lt,b as Ze,e as xe}from"./utils-Lv9QOe7S.js";import{s as Ye}from"./notifications-CBkElf_0.js";import{i as wn,l as Ci}from"./external-exe-DRsy67iY.js";import{n as gt,R as Rn,i as Bt,b as Ii,I as At}from"./app-env-DxClrP2r.js";import{S as et,P as be}from"./app-runtime-DxUgWNtJ.js";function Li({state:e,constants:n,escapeHtml:t,showToast:o,isPerfEnabled:r,formatDownloadBytes:u,formatDownloadSpeed:v,formatDownloadEta:E,formatHistoryTime:P,loadManagedDownloadsFromMain:k,refreshExtensionsManagerList:y,saveProfileHistoryStore:x,getActiveTab:L,updateTabTitle:$,createTab:O,switchTab:F,navigateTo:j}){const{PROFILES:ee,PARTITIONS:ce}=n;function z(f=""){const B=String(f||"").trim().toLowerCase();return["downloads","history","extensions","passwords"].includes(B)?B:"extensions"}function se(f="extensions"){const B=z(f);return B==="downloads"?"Downloads":B==="history"?"History":B==="passwords"?"Passwords":"Extensions"}function Ce(f="extensions"){const B=z(f);return B==="downloads"?"Ctrl+Shift+D":B==="history"?"Ctrl+H":B==="extensions"?"Ctrl+E":""}function Ie(f){const B=f instanceof Element?f:null;return B?B.closest("input, textarea, select")?!0:B.isContentEditable===!0:!1}function nt(f="settings",B="extensions"){return{type:String(f||"settings").trim().toLowerCase(),section:z(B)}}function Ve(f="extensions"){const B=z(f);return e.tabs.find(D=>D?.nativePage?.type==="settings"&&z(D?.nativePage?.section)===B)||null}function J(f){return f?.nativePage?.type==="settings"}async function we(){if(!window.api)return e.nativeSettingsGeneralInfo;try{if(!e.nativeSettingsGeneralInfo.version&&window.api.getAppVersion&&(e.nativeSettingsGeneralInfo.version=await window.api.getAppVersion()),!e.nativeSettingsGeneralInfo.defaultOpenStatus&&window.api.getDefaultOpenHandlingStatus){const f=await window.api.getDefaultOpenHandlingStatus();e.nativeSettingsGeneralInfo.defaultOpenStatus=f?.isDefault||f?.success?"Configured":"Needs setup"}}catch{}return e.nativeSettingsGeneralInfo}function je(){return Object.entries(e.profileHistoryCache||{}).flatMap(([f,B])=>(Array.isArray(B)?B:[]).map(D=>({profileId:f,profileName:ee[f]?.name||f||"Unknown",url:String(D?.url||"").trim(),title:String(D?.title||"Untitled").trim()||"Untitled",visitedAt:D?.visitedAt?Number(D.visitedAt):0}))).filter(f=>f.url&&f.visitedAt).sort((f,B)=>Number(B.visitedAt||0)-Number(f.visitedAt||0))}function Pe(f){const B=new Date(Number(f||0));if(Number.isNaN(B.getTime()))return"Unknown Date";const D=new Date,S=new Date(D.getFullYear(),D.getMonth(),D.getDate()).getTime(),N=new Date(B.getFullYear(),B.getMonth(),B.getDate()).getTime(),V=S-1440*60*1e3;return N===S?"Today":N===V?"Yesterday":B.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function Se(f=[]){const B=[],D=new Map;return f.forEach(S=>{const N=Pe(S.visitedAt);if(!D.has(N)){const V={key:`${N}-${S.visitedAt}`,label:N,entries:[]};D.set(N,V),B.push(V)}D.get(N).entries.push(S)}),B}function Be(){return e.managedDownloadsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.managedDownloadsCache.map(f=>{const B=f.totalBytes?Math.max(0,Math.min(100,Math.round(f.receivedBytes/f.totalBytes*100))):f.state==="completed"?100:0,D=f.totalBytes?`${u(f.receivedBytes)} / ${u(f.totalBytes)}`:u(f.receivedBytes),S=f.state==="progressing"?`${v(f.bytesPerSecond)} - ${E(f.etaSeconds)}`:f.state==="completed"?`Saved to ${t(f.savePath||"")}`:t(String(f.state||"Unknown"));return`
              <article class="native-settings-row native-settings-download-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.fileName||"Download")}</div>
                    <div class="native-settings-row-note">${t(D)}</div>
                    <div class="native-settings-row-note">${S}</div>
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
                <div class="native-settings-progress"><span style="width:${B}%"></span></div>
              </article>
            `}).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No downloads yet.</div>'}function Ge(){const f=e.historySearchQuery.trim().toLowerCase(),B=je().filter(S=>f?`${S.title||""} ${S.url||""} ${S.profileName||""}`.toLowerCase().includes(f):!0);return B.length?`
      <div class="native-history-flat-list">
        ${Se(B).map(S=>`
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${t(S.label)}</span>
                </div>
                ${S.entries.map(N=>`
                      <article class="native-history-entry">
                        <div class="native-history-entry-content">
                          <div class="native-history-entry-title">${t(N.title||"Untitled")}</div>
                          <div class="native-history-entry-url">${t(N.url||"")}</div>
                          <div class="native-history-entry-meta">${t(N.profileName)} • ${t(P(N.visitedAt))}</div>
                        </div>
                        <div class="native-history-entry-actions">
                          <button class="native-settings-action" type="button" data-native-history-action="open" data-history-time="${t(N.visitedAt||"")}" data-profile-id="${t(N.profileId)}">Open</button>
                          <button class="native-settings-action" type="button" data-native-history-action="delete" data-history-time="${t(N.visitedAt||"")}" data-profile-id="${t(N.profileId)}">Delete</button>
                        </div>
                      </article>
                    `).join("")}
              </div>
            `).join("")}
      </div>
    `:`<div class="native-settings-empty">${f?"No history matches your search.":"No history yet."}</div>`}function ze(){return e.browserExtensionsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.browserExtensionsCache.map(f=>{const B=(function(){try{const D=String(localStorage.getItem("userRole")||"production").toLowerCase(),S=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();return D==="dev"&&S==="dev"}catch{return!1}})();return`
              <article class="native-settings-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.name||"Unnamed Extension")}</div>
                    <div class="native-settings-row-note">${t(f.id||"")}</div>
                    ${B?`<div class="native-settings-row-note">${t(f.path||"")}</div>`:""}
                  </div>
                  <div class="native-settings-inline-actions">
                    <button class="native-settings-action" type="button" data-native-extension-action="more" data-extension-path="${t(f.path||"")}">More</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="${f.enabled===!1?"enable":"disable"}" data-extension-path="${t(f.path||"")}">${f.enabled===!1?"Enable":"Disable"}</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="reload" data-extension-path="${t(f.path||"")}">Reload</button>
                    ${B?`<button class="native-settings-action" type="button" data-native-extension-action="remove" data-extension-path="${t(f.path||"")}">Remove</button>`:""}
                  </div>
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No extensions installed yet.</div>'}function Fe(){const f=e.credentialCache||{},B=[];return Object.entries(f).forEach(([S,N])=>{(N||[]).forEach((V,ae)=>{B.push({key:`${S}:${ae}`,profileId:S,domain:String(V.domain||"").toLowerCase(),username:String(V.username||""),password:String(V.password||"")})})}),`
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
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${Object.entries(ee).map(([S,N])=>`
        <label class="profile-pill-item" style="cursor: pointer;" data-profile-id="${t(S)}">
          <input type="radio" name="nativePasswordProfile" value="${t(S)}" ${S===(e.passwordProfileId||e.currentProfileId||"guest")?"checked":""} style="cursor: pointer;" />
          <span class="profile-pill-dot" style="background-color: ${t(N.color||"#000")}"></span>
          <span>${t(N.name||"")}</span>
        </label>
      `).join("")}</div>
          </div>
          <button type="submit" class="native-settings-action" style="grid-column: 1 / -1; background: #3b82f6; color: white; font-weight: 600; padding: 10px 14px;">Save Credential</button>
        </form>
 
        <div class="native-settings-section-head" style="margin-top: 24px;">
          <h3>Saved Passwords</h3>
          <p>${B.length} credential${B.length!==1?"s":""} stored</p>
        </div>
        
        ${B.length===0?'<div class="native-settings-empty">No saved credentials yet. Add one above.</div>':`<div class="password-list">
              ${B.map(S=>`
                <div class="password-item" data-key="${t(S.key)}">
                  <div><strong>${t(S.domain)}</strong><div class="password-meta">${t(S.profileId)}</div></div>
                  <div>${t(S.username)}</div>
                  <div class="password-secret-container" style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <span class="password-secret" data-password="${t(S.password)}" style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; word-break: break-all;">••••••••</span>
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
    `}async function De(){if(window.api?.listProfileCredentials)try{const f=await window.api.listProfileCredentials();if(f&&Array.isArray(f.data)){const B={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};f.data.forEach(D=>{const S=String(D.profileId||"").toLowerCase();B[S]||(B[S]=[]),B[S].push(D)}),e.credentialCache=B}}catch(f){console.error("loadCredentialsIntoCache error:",f)}}function Le(f){const B=document.getElementById("nativeTabContent");if(!B||!J(f))return;const D=z(f.nativePage?.section);let S="",N="";const V=se(D);let ae="Manage app behavior without leaving the browser shell.";if(D==="downloads"){const K=e.managedDownloadsCache.length,ie=e.managedDownloadsCache.filter(le=>le.state==="progressing").length;S=Be(),ae=`${ie} active, ${K} total downloads.`}else if(D==="history"){const K=je(),ie=e.historySearchQuery.trim()?K.filter(le=>`${le.title||""} ${le.url||""} ${le.profileName||""}`.toLowerCase().includes(e.historySearchQuery.trim().toLowerCase())).length:K.length;N=`
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
      `,S=Ge(),ae=`${ie} total history entries across all profiles.`}else if(D==="extensions"){const K=e.browserExtensionsCache.filter(ie=>ie.enabled!==!1).length;N=`
        <div class="native-settings-toolbar">
          ${(function(){try{const ie=String(localStorage.getItem("userRole")||"production").toLowerCase(),le=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();return ie==="dev"&&le==="dev"?'<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>':""}catch{return""}})()}
        </div>
      `,S=ze(),ae=`${K} enabled out of ${e.browserExtensionsCache.length} extensions.`}else D==="passwords"?(S=Fe(),ae="Manage saved passwords securely.",e._credentialsLoaded||(e._credentialsLoaded=!0,De().then(()=>{Le(f)}))):e._credentialsLoaded=!1;B.innerHTML=`
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${t(V)}</h2>
                <p>${t(ae)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions","history","downloads","passwords"].map(K=>{const ie=Ce(K);return`
                    <button
                      type="button"
                      class="native-settings-chip ${K===D?"is-active":""}"
                      data-native-settings-nav="${K}"
                      title="${t(se(K))}${ie?` (${ie})`:""}"
                    >
                      <span>${t(se(K))}</span>
                      ${ie?`<span class="native-settings-chip-shortcut">${t(ie)}</span>`:""}
                    </button>
                  `}).join("")}
            </div>
            ${N}
          </div>
          <div class="native-settings-body">
            ${S}
          </div>
        </section>
      </div>
    `}async function ke(){const f=L();J(f)&&Le(f)}function Ee(f="extensions",B=e.activeTabId){const D=e.tabs.find(N=>N.id===B);if(!J(D))return;const S=z(f);D.nativePage.section=S,$(D.id,se(S)),D.id===e.activeTabId&&Le(D)}function Ae(f="extensions"){const B=Ve(f);if(B){F(B.id);return}O(null,null,se(f),null,{nativePage:nt("settings",f)})}function Je(){const f=document.getElementById("settingsBtn");f&&f.dataset.boundClick!=="1"&&(f.dataset.boundClick="1",f.addEventListener("click",()=>{Ae("extensions")}))}function Xe(){const f=document.getElementById("nativeTabContent");if(!f||f.dataset.boundNativeSettings==="1")return;f.dataset.boundNativeSettings="1",window.addEventListener("credentials-updated",()=>{e._credentialsLoaded=!1;const D=L();J(D)&&D.nativePage?.section==="passwords"&&De().then(()=>{Le(D)})});const B=(D=null,S=null)=>{requestAnimationFrame(()=>{const N=document.getElementById("nativeHistorySearchInput");if(N&&(N.focus({preventScroll:!0}),Number.isInteger(D)&&Number.isInteger(S)&&typeof N.setSelectionRange=="function"))try{N.setSelectionRange(D,S)}catch{}})};f.addEventListener("click",async D=>{const S=D.target.closest(".password-visibility-toggle");if(S){D.preventDefault();const c=document.getElementById("nativePasswordSecretInput");if(c){const d=c.type==="password";c.type=d?"text":"password",S.innerHTML=d?`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          `:`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          `}return}const N=D.target.closest(".password-list-toggle-eye");if(N){D.preventDefault();const c=N.parentNode.querySelector(".password-secret");if(c){const d=c.dataset.password||"";c.textContent==="••••••••"?(c.textContent=d,N.innerHTML=`
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            `):(c.textContent="••••••••",N.innerHTML=`
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            `)}return}const V=D.target.closest("[data-native-settings-nav]");if(V){Ee(V.dataset.nativeSettingsNav||"extensions");return}const ae=D.target.closest("[data-native-settings-action]");if(ae){const c=String(ae.dataset.nativeSettingsAction||"").trim();try{c==="check-updates"&&window.api?.checkForUpdates?(await window.api.checkForUpdates(),o("Update check started.","success")):c==="open-default-apps"&&window.api?.openDefaultAppSettings?await window.api.openDefaultAppSettings():c==="load-unpacked-extension"&&window.api?.addBrowserExtensionsUnpacked?(await window.api.addBrowserExtensionsUnpacked(),await y(),await ke(),o("Unpacked extensions loaded.","success")):c==="clear-history"&&(Object.keys(e.profileHistoryCache||{}).forEach(d=>{e.profileHistoryCache[d]=[]}),x(),Le(L()))}catch(d){o(d?.message||"Could not complete settings action.","error")}return}const K=D.target.closest("[data-native-download-action]");if(K){try{const c=await window.api?.runManagedDownloadAction?.({id:String(K.dataset.downloadId||"").trim(),action:String(K.dataset.nativeDownloadAction||"").trim()});Array.isArray(c?.downloads)?e.managedDownloadsCache=c.downloads:await k(),await ke()}catch(c){o(c?.message||"Could not complete download action.","error")}return}const ie=D.target.closest("[data-native-history-action]");if(ie){const c=String(ie.dataset.profileId||e.historyProfileId||e.currentProfileId),d=String(ie.dataset.historyTime||""),C=(e.profileHistoryCache[c]||[]).findIndex(A=>String(A.visitedAt||"")===d),I=C>=0?(e.profileHistoryCache[c]||[])[C]:null;if(!I)return;if(ie.dataset.nativeHistoryAction==="delete")e.profileHistoryCache[c].splice(C,1),x(),e.historyProfileId=c,Le(L());else{const A=ee[c]?.partition||ce.guest;O(I.url,A,I.title||"History",c)}return}const le=D.target.closest("[data-native-extension-action]");if(le){const c=String(le.dataset.nativeExtensionAction||"").trim(),d=String(le.dataset.extensionPath||"").trim();try{c==="more"&&window.api?.getExtensionShortcutsInfo?await it(d):c==="reload"&&window.api?.reloadBrowserExtension?(await window.api.reloadBrowserExtension({path:d}),o("Extension reloaded.","success")):(c==="enable"||c==="disable")&&window.api?.toggleBrowserExtension?(c==="disable"&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.toggleBrowserExtension({path:d,enabled:c==="enable"})):c==="remove"&&window.api?.removeBrowserExtension&&(typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.removeBrowserExtension({path:d})),await y(),await ke()}catch(C){o(C?.message||"Could not complete extension action.","error")}}}),f.addEventListener("input",D=>{const S=D.target.closest("#nativeHistorySearchInput");if(S){const V=Number.isInteger(S.selectionStart)?S.selectionStart:null,ae=Number.isInteger(S.selectionEnd)?S.selectionEnd:V;e.historySearchQuery=String(S.value||""),Le(L()),B(V,ae);return}const N=D.target.closest("input[name='nativePasswordProfile']");if(N){e.passwordProfileId=String(N.value||"");return}}),f.addEventListener("submit",async D=>{const S=D.target.closest("#nativePasswordForm");if(!S)return;D.preventDefault();const N=document.getElementById("nativePasswordDomainInput"),V=document.getElementById("nativePasswordUsernameInput"),ae=document.getElementById("nativePasswordSecretInput");if(!N||!V||!ae)return;const K=String(N.value||"").trim().toLowerCase(),ie=String(V.value||"").trim(),le=String(ae.value||""),c=e.passwordProfileId||e.currentProfileId||"guest";if(!K||!ie||!le){o("Please fill in all fields.","error");return}try{if(!window.api?.saveProfileCredential){o("Credential API unavailable.","error");return}const d=await window.api.saveProfileCredential({profileId:c,domain:K,username:ie,password:le});if(!d||!d.success){o("Failed to save credential.","error");return}await De(),o("Credential saved successfully.","success"),S.reset(),Le(L())}catch(d){o(d?.message||"Could not save credential.","error")}}),f.addEventListener("click",async D=>{const S=D.target.closest(".password-action-btn");if(!S)return;const N=String(S.dataset.action||"").trim(),V=S.closest(".password-item"),ae=String(V?.dataset.key||""),[K,ie]=ae.split(":"),le=Number(ie);if(!K||Number.isNaN(le))return;const d=((e.credentialCache||{})[K]||[])[le];if(d)try{if(N==="delete"){if(!window.api?.deleteProfileCredential){o("Credential API unavailable.","error");return}const C=await window.api.deleteProfileCredential({profileId:K,domain:String(d.domain||"").toLowerCase(),username:String(d.username||"")});if(!C||!C.success){o("Failed to delete credential.","error");return}await De(),o("Credential deleted successfully.","success"),Le(L())}else if(N==="edit"){const C=document.getElementById("nativePasswordDomainInput"),I=document.getElementById("nativePasswordUsernameInput"),A=document.getElementById("nativePasswordSecretInput"),R=document.getElementById("nativePasswordProfileSelect");if(!C||!I||!A)return;e.passwordProfileId=K,C.value=String(d.domain||"").toLowerCase(),I.value=String(d.username||""),A.value=String(d.password||""),R&&(R.innerHTML=Object.entries(ee||{}).map(([H,a])=>`
                <label class="profile-pill-item ${H===K?"active":""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${t(H)}" ${H===K?"checked":""} style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${t(a.color||"#000")}"></span>
                  <span>${t(a.name||"")}</span>
                </label>
              `).join(""),R.addEventListener("change",H=>{const a=H.target.value;a&&(e.passwordProfileId=a)})),document.getElementById("nativePasswordForm")?.scrollIntoView({behavior:"smooth"}),C.focus()}}catch(C){o(C?.message||"Could not complete password action.","error")}})}function ot(){document.addEventListener("keydown",f=>{Ie(f.target)||f.ctrlKey&&((f.key==="H"||f.key==="h")&&!f.shiftKey?(f.preventDefault(),Ae("history")):(f.key==="E"||f.key==="e")&&!f.shiftKey?(f.preventDefault(),Ae("extensions")):(f.key==="D"||f.key==="d")&&f.shiftKey&&(f.preventDefault(),Ae("downloads")))})}async function it(f=""){const B=document.getElementById("extensionDetailsModal"),D=document.getElementById("extensionDetailsCloseBtn"),S=document.getElementById("extensionDetailsContent"),N=document.getElementById("extensionDetailsTitle");if(!(!B||!S))try{const V=await window.api?.getExtensionShortcutsInfo?.({path:f});if(!V?.success)S.innerHTML='<div class="extension-details-empty">Unable to load extension details.</div>';else{const{name:ae,shortcuts:K,errors:ie,conflicts:le}=V;N.textContent=`${t(ae||"Extension")} Details`;let c="";K&&K.length>0?c=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-shortcuts-list">
                ${K.map(I=>`
                      <div class="extension-shortcut-item">
                        <span class="extension-shortcut-key">${t(I.originalKey||I.key)}</span>
                        <span class="extension-shortcut-desc">${t(I.description||"No description")}</span>
                        <span class="extension-shortcut-status ${I.isActive?"active":"conflict"}">
                          ${I.isActive?"✓ Active":"⚠ Conflict"}
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
          `;let d="";ie&&ie.length>0&&(d=`
            <div class="extension-details-section">
              <h4>Issues</h4>
              <div class="extension-errors-list">
                ${ie.map(I=>`
                      <div class="extension-error-item">
                        <div class="extension-error-type">${t(I.type)}</div>
                        <div class="extension-error-message">${t(I.message)}</div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `);let C="";le&&le.length>0&&(C=`
            <div class="extension-details-section">
              <h4>Shortcut Conflicts</h4>
              <div class="extension-conflicts-list">
                ${le.map(I=>`
                      <div class="extension-conflict-item">
                        <div class="extension-conflict-key">${t(I.key)}</div>
                        <div class="extension-conflict-extensions">
                          <strong>Conflicting with:</strong><br/>
                          ${I.conflictingExtensions.map(A=>`${t(A.name)}`).join("<br/>")}
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `),S.innerHTML=`${c}${d}${C}`}B.classList.remove("hidden"),D&&(D.onclick=()=>{B.classList.add("hidden")})}catch(V){console.error("Failed to load extension details:",V),S.innerHTML='<div class="extension-details-empty">Error loading extension details.</div>',B.classList.remove("hidden")}}return{bindSettingsShortcutsGlobal:ot,createNativePageDescriptor:nt,ensureNativeSettingsGeneralInfo:we,getSettingsTabTitle:se,getSettingsShortcut:Ce,initNativeSettingsUi:Xe,initSettingsMenu:Je,isEditableShortcutTarget:Ie,isNativeSettingsTab:J,normalizeSettingsSection:z,openSettingsTab:Ae,refreshActiveNativeSettingsPage:ke,renderNativeSettingsPage:Le,updateNativeSettingsTabSection:Ee}}function ki({state:e,constants:n,escapeHtml:t,showToast:o,openOverlayModal:r,closeOverlayModal:u,getActiveTab:v,getActiveWebview:E,createTab:P,refreshActiveNativeSettingsPage:k,closeSettingsMenu:y}){const{PROFILES:x,PENDING_EXTENSION_OPEN_STORAGE_KEY:L,EXTENSION_PIN_STORAGE_KEY:$}=n;let O=!1,F=null,j=null,ee={visible:!1,id:"",message:"",actionLabel:"",action:""},ce={},z={entryPath:""},se=!1;async function Ce(){if(!window.api?.listBrowserExtensions)return e.browserExtensionsCache=[],e.browserExtensionsCache;const a=await window.api.listBrowserExtensions(),g=Array.isArray(a?.entries)?a.entries:[];return e.browserExtensionsCache=g.map(m=>{const p=(m.id||"guest").toLowerCase(),b=n.APP_PROTOCOL_SCHEME||"oneview-dev",M=String(m.path||"").trim().replace(/\\/g,"/").replace(/\/+$/,""),Y=`file:///${M}`,X=de=>{if(!de||!de.toLowerCase().startsWith("file://"))return de;const ge=de.replace(/\\/g,"/"),ue=decodeURI(ge);let he=ue.replace(Y,"").replace(/^\/+/,"");if(he===ue){const pe=`/${M.split("/").pop()}/`,Z=ue.indexOf(pe);Z!==-1?he=ue.slice(Z+pe.length):he=""}const te=m.manifest?.entrypoints?.root||m.manifest?.entrypoints?.page||"index.html";return`${b}://${p}/${he||te}`};return{...m,rootUrl:X(m.rootUrl),optionsUrl:X(m.optionsUrl),popupUrl:X(m.popupUrl),sidePanelUrl:X(m.sidePanelUrl)}}),e.browserExtensionsCache}async function Ie(){let a="";try{a=String(sessionStorage.getItem(L)||"").trim()}catch{a=""}if(!a)return;try{sessionStorage.removeItem(L)}catch{}const g=e.browserExtensionsCache.find(m=>m.path===a);g&&await S(g.path,"tab")}function nt(){try{const a=JSON.parse(localStorage.getItem($)||"{}");ce=a&&typeof a=="object"&&!Array.isArray(a)?a:{}}catch{ce={}}}function Ve(){try{localStorage.setItem($,JSON.stringify(ce||{}))}catch{}}function J(){return v()?.partition||x[e.currentProfileId]?.partition||x.guest.partition}function we(){const a=v(),g=E();return{url:String(g?.getURL?.()||a?.url||"").trim(),title:String(g?.getTitle?.()||a?.title||"").trim()}}function je(a={}){return String(a?.name||a?.actionTitle||"EX").trim().split(/\s+/).slice(0,2).map(m=>m.charAt(0)).join("").toUpperCase()}function Pe(a={}){return String(a?.actionTitle||a?.name||"Extension").trim()}function Se(a={},g=""){const m=String(a?.path||"").trim(),p=String(g||"").trim().replace(/\\/g,"/");if(!m||!p)return"";const b=m.replace(/\\/g,"/").replace(/\/+$/,""),M=p.replace(/^\/+/,""),Y=`${b}/${M}`;return`file:///${encodeURI(Y.replace(/^([A-Za-z]):/,"$1:"))}`}function Be(a={}){return ce[String(a?.path||"").trim()]===!0}function Ge(a={}){const g=(a?.id||"guest").toLowerCase(),m=a?.manifest?.entrypoints?.root||a?.manifest?.entrypoints?.page||"index.html";return`${n.APP_PROTOCOL_SCHEME}://${g}/${m}`}function ze(a={},g=""){const m=String(a?.actionIconFileUrl||Se(a,a?.actionIconPath||"")||a?.actionIconUrl||"").trim(),p=t(je(a));return m?`<img src="${t(m)}" alt="" />`:`<span class="${g}">${p}</span>`}function Fe(a=0){const g=Number(a||0);return g>=1024*1024*1024?`${(g/(1024*1024*1024)).toFixed(1)} GB`:g>=1024*1024?`${(g/(1024*1024)).toFixed(1)} MB`:g>=1024?`${(g/1024).toFixed(1)} KB`:`${Math.max(0,Math.round(g))} B`}function De(a=0){const g=Number(a||0);return g<=0?"":`${Fe(g)}/s`}function Le(a=null){const g=Number(a);if(!Number.isFinite(g)||g<0)return"";if(g<60)return`${Math.round(g)}s left`;const m=Math.floor(g/60),p=Math.round(g%60);return`${m}m ${p}s left`}function ke(a=""){return e.managedDownloadsCache.find(g=>g.id===a)||null}function Ee(){const a=document.getElementById("downloadsManagerBtn");a&&(a.classList.remove("has-download-highlight"),a.offsetWidth,a.classList.add("has-download-highlight"),F&&clearTimeout(F),F=setTimeout(()=>{a.classList.remove("has-download-highlight")},2300))}async function Ae(){if(!window.api?.listManagedDownloads)return e.managedDownloadsCache=[],e.managedDownloadsCache;const a=await window.api.listManagedDownloads();return e.managedDownloadsCache=Array.isArray(a?.downloads)?a.downloads:[],e.managedDownloadsCache}function Je(){const a=document.getElementById("downloadsManagerPanel"),g=document.getElementById("downloadsManagerBtn");a&&!a.classList.contains("hidden")&&(O?u(()=>a.classList.add("hidden")):a.classList.add("hidden")),O=!1,g&&g.classList.remove("is-active")}function Xe(){const a=document.getElementById("downloadsManagerPanel"),g=document.getElementById("downloadsManagerBadge");if(!a)return;const m=e.managedDownloadsCache.filter(p=>p.state==="progressing"||p.state==="interrupted").length;g&&(m>0?(g.textContent=String(m),g.classList.remove("hidden")):(g.textContent="",g.classList.add("hidden"))),a.innerHTML=`
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${e.managedDownloadsCache.length?e.managedDownloadsCache.map(p=>{const b=t(p.fileName||"Download"),M=String(p.state||"progressing"),Y=typeof p.progress=="number"?Math.max(0,Math.min(100,p.progress)):0,X=p.totalBytes>0?`${Fe(p.receivedBytes)} / ${Fe(p.totalBytes)}`:Fe(p.receivedBytes),de=De(p.bytesPerSecond),ge=Le(p.etaSeconds),ue=M==="completed"?"Completed":M==="cancelled"?"Cancelled":M==="interrupted"?"Interrupted":p.paused?"Paused":`Downloading ${Y}%`,he=[de,ge].filter(Boolean).join(" • ");return`
                    <div class="downloads-manager-item">
                      <strong>${b}</strong>
                      <div class="downloads-manager-meta">${t(ue)} • ${t(X)}</div>
                      ${he?`<div class="downloads-manager-meta">${t(he)}</div>`:""}
                      <div class="downloads-manager-progress">
                        <span style="width:${Y}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${M==="progressing"?p.paused?`<button type="button" data-download-id="${t(p.id)}" data-download-action="resume">Resume</button>`:`<button type="button" data-download-id="${t(p.id)}" data-download-action="pause">Pause</button>`:""}
                        ${M==="progressing"||M==="interrupted"?`<button type="button" data-download-id="${t(p.id)}" data-download-action="cancel">Cancel</button>`:""}
                        ${M==="interrupted"||M==="cancelled"?`<button type="button" data-download-id="${t(p.id)}" data-download-action="retry">Retry</button>`:""}
                        ${p.savePath?`<button type="button" data-download-id="${t(p.id)}" data-download-action="show">Show in Folder</button>`:""}
                        ${M==="completed"&&p.existsOnDisk?`<button type="button" data-download-id="${t(p.id)}" data-download-action="open">Open</button>`:""}
                         <button type="button" data-download-id="${t(p.id)}" data-download-action="remove">Delete</button>
                      </div>
                    </div>
                  `}).join(""):'<div class="downloads-manager-empty">No downloads yet.</div>'}
      </div>
    `}async function ot(a=null){const g=document.getElementById("downloadsManagerPanel"),m=document.getElementById("downloadsManagerBtn");if(!g||!m)return;if(!(a===null?g.classList.contains("hidden"):!!a)){Je();return}B(),Xe();try{await r(()=>g.classList.remove("hidden"),{captureSnapshots:!1}),O=!0}catch{g.classList.remove("hidden"),O=!1}m.classList.add("is-active")}function it(){let a=document.getElementById("downloadsShelf");a||(a=document.createElement("div"),a.id="downloadsShelf",a.className="downloads-shelf hidden",a.innerHTML=`
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `,document.body.appendChild(a),a.querySelector("#downloadsShelfClose")?.addEventListener("click",()=>{ee.visible=!1,it()}),a.querySelector("#downloadsShelfAction")?.addEventListener("click",async()=>{const b=ke(ee.id);!b||!ee.action||!window.api?.runManagedDownloadAction||await window.api.runManagedDownloadAction({id:b.id,action:ee.action})}));const g=a.querySelector("#downloadsShelfTitle"),m=a.querySelector("#downloadsShelfMessage"),p=a.querySelector("#downloadsShelfAction");if(!ee.visible){a.classList.add("hidden");return}g&&(g.textContent="Downloads"),m&&(m.textContent=ee.message||""),p&&(p.textContent=ee.actionLabel||"Open",p.style.display=ee.action?"":"none"),a.classList.remove("hidden")}function f(a={},g="updated"){const m=String(a.fileName||"Download").trim()||"Download";if(g==="created")ee={visible:!0,id:String(a.id||""),message:`${m} started downloading`,actionLabel:"Show",action:"show"};else if(g==="completed")ee={visible:!0,id:String(a.id||""),message:`${m} downloaded`,actionLabel:"Open",action:"open"};else if(g==="interrupted")ee={visible:!0,id:String(a.id||""),message:`${m} was interrupted`,actionLabel:"Retry",action:"retry"};else return;it(),j&&clearTimeout(j),j=setTimeout(()=>{ee.visible=!1,it()},5e3)}function B(){const a=document.getElementById("browserExtensionsMenu"),g=document.getElementById("browserExtensionsMenuBtn");a&&!a.classList.contains("hidden")&&(se?u(()=>a.classList.add("hidden")):a.classList.add("hidden")),se=!1,g&&g.classList.remove("is-active")}async function D(a=null){const g=document.getElementById("browserExtensionsMenu"),m=document.getElementById("browserExtensionsMenuBtn");if(!g||!m)return;if(!(a===null?g.classList.contains("hidden"):!!a)){B();return}N().catch(()=>{}),le();try{await r(()=>g.classList.remove("hidden"),{captureSnapshots:!1}),se=!0}catch(b){console.error("Failed to open extensions menu overlay",b),g.classList.remove("hidden"),se=!1}m.classList.add("is-active")}async function S(a,g="tab"){const m=e.browserExtensionsCache.find(Y=>Y.path===a);if(!m)return;const p=(m?.id||"guest").toLowerCase();let b="";if(g==="options"&&m.optionsUrl){const Y=m.manifest?.entrypoints?.options||"options.html";b=`${n.APP_PROTOCOL_SCHEME}://${p}/${Y}`}else if(g==="root"&&m.rootUrl){const Y=m.manifest?.entrypoints?.root||"result.html";b=`${n.APP_PROTOCOL_SCHEME}://${p}/${Y}`}else b=Ge(m);if(!b){o("This extension does not expose an openable page yet.","info");return}const M=`ext-${m.id||"guest"}`;P(b,M,`${m.name||"Extension"}${g==="options"?" Options":""}`,null,{extensionEntryPath:m.path,extensionActiveContext:we()})}async function N(){if(window.api?.closeBrowserExtensionPopup)try{await window.api.closeBrowserExtensionPopup()}catch{}z={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(a=>a.classList.remove("is-active"))}function V(a={}){const g=document.getElementById("browserExtensionPopupTitle"),m=document.getElementById("browserExtensionPopupSubtitle"),p=document.getElementById("browserExtensionPopupIcon");g&&(g.textContent=Pe(a)),m&&(m.textContent=a?.popupUrl?"Popup":a?.optionsUrl?"Extension page":a?.rootUrl?"Extension":""),p&&(p.innerHTML=ze(a,"browser-extension-popup-fallback"))}function ae(a){if(!a||typeof a.getBoundingClientRect!="function")return{left:0,top:0,bottom:0,width:0,height:0};const g=a.getBoundingClientRect();return{left:Number(g.left||0),top:Number(g.top||0),bottom:Number(g.bottom||0),width:Number(g.width||0),height:Number(g.height||0)}}async function K(a,g=null){const m=e.browserExtensionsCache.find(ge=>ge.path===a);if(!m)return;const p=String(m.popupUrl||"").trim()||String(m.optionsUrl||"").trim();if(!p){await S(a,"tab");return}if(z.entryPath===a){await N();return}await N(),B();const b=window.api?.openBrowserExtensionPopup;if(typeof b!="function")throw new Error("Extension popup API is unavailable");const M=we(),Y=`ext-${m.id||"guest"}`,X=await b({url:p,entryPath:a,partition:Y,anchor:ae(g),activeUrl:M.url||"",activeTitle:M.title||""});if(!X?.success)throw new Error(X?.message||"Could not open extension popup");V(m),z={entryPath:a,pageType:"popup",host:null,overlayActive:!1};const de=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(a):a.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${de}"]`).forEach(ge=>ge.classList.add("is-active"))}function ie(){const a=document.getElementById("browserExtensionsPinned");if(!a)return;const g=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(b=>{const M=b.id==="sitesnap-studio"||String(b.name||"").toLowerCase().includes("sitesnap")||String(b.id||"").toLowerCase().includes("sitesnap");return g?b.enabled!==!1&&M:b.enabled!==!1&&!M}),p=g?m:m.filter(b=>Be(b));if(!p.length){a.innerHTML="",a.classList.add("hidden");return}a.classList.remove("hidden"),a.innerHTML=p.map(b=>`
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${t(b.path||"")}"
            title="${t(Pe(b))}"
            aria-label="${t(Pe(b))}"
          >
            ${ze(b,"browser-extension-action-fallback")}
          </button>
        `).join("")}function le(){const a=document.getElementById("browserExtensionsMenu");if(!a)return;const g=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(p=>{const b=p.id==="sitesnap-studio"||String(p.name||"").toLowerCase().includes("sitesnap")||String(p.id||"").toLowerCase().includes("sitesnap");return g?p.enabled!==!1&&b:p.enabled!==!1&&!b});a.innerHTML=`
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${m.length?m.map(p=>{const b=t(p.path||""),M=t(Pe(p)),Y=t(p.version?`v${p.version}${p.id?` • ${p.id}`:""}`:p.id||p.name||"");return`
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${ze(p,"browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${M}</strong>
                          <p>${Y}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${b}"
                          title="${Be(p)?"Unpin":"Pin"}"
                          aria-label="${Be(p)?"Unpin":"Pin"}"
                        >
                          ${Be(p)?"Unpin":"Pin"}
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
    `}function c(){ie(),le()}function d(){const a=document.getElementById("extensionsManagerList");if(!a)return;const g=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,m=e.browserExtensionsCache.filter(p=>{const b=p.id==="sitesnap-studio"||String(p.name||"").toLowerCase().includes("sitesnap")||String(p.id||"").toLowerCase().includes("sitesnap");return g?b:!b});if(!m.length){a.innerHTML=`
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
              ${(function(){try{const M=String(localStorage.getItem("userRole")||"production").toLowerCase(),Y=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();return M==="dev"&&Y==="dev"?`<div class="extension-path">${b}</div>`:""}catch{return""}})()}
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
              ${(function(){try{const M=String(localStorage.getItem("userRole")||"production").toLowerCase(),Y=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();return M==="dev"&&Y==="dev"?`<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${b}">Remove</button>`:""}catch{return""}})()}
            </div>
          </div>
        `}).join("")}async function C(){try{await Ce()}catch(a){console.error("Failed to refresh browser extensions list",a)}d(),c()}async function I(a,g){const m=e.browserExtensionsCache.find(b=>b.path===a);if(!m)return;const p=g==="options"?m.optionsUrl:g==="root"?m.rootUrl:Ge(m);if(!p){o(`This extension does not expose a ${g} page.`,"info");return}P(p,J(),`${m.name||"Extension"} ${g==="options"?"Options":"Popup"}`,null,{extensionEntryPath:m.path,extensionActiveContext:we()})}async function A(){const a=document.getElementById("extensionsManagerModal");if(a){B(),await N(),d(),c();try{await r(()=>a.classList.remove("hidden"))}catch(g){console.error("openOverlayModal failed for extensions manager",g),a.classList.remove("hidden")}C().catch(g=>{console.error("Failed to refresh extensions manager after open",g)})}}function R(){const a=document.getElementById("extensionsManagerModal");a&&u(()=>a.classList.add("hidden"))}function G(){const a=document.getElementById("extensionsBtn"),g=document.getElementById("settingsBtn"),m=document.getElementById("extensionsModalCloseBtn"),p=document.getElementById("extensionsLoadBtn"),b=document.getElementById("extensionsManagerList"),M=document.getElementById("browserExtensionsPinned"),Y=document.getElementById("browserExtensionsMenuBtn"),X=document.getElementById("browserExtensionsMenu"),de=document.getElementById("downloadsManagerBtn"),ge=document.getElementById("downloadsManagerPanel"),ue=document.getElementById("browserExtensionPopupClose"),he=document.getElementById("browserExtensionPopupOpenTab");if(nt(),d(),c(),C().catch(te=>{console.error("Failed to refresh extensions manager after open",te)}),Ce().then(()=>{if(Ie(),window.api?.prewarmBrowserExtensionPopup){const ne=e.browserExtensionsCache.filter(Z=>Z.enabled!==!1).filter(Z=>Be(Z));let pe={partition:J()};if(ne.length>0){const Z=ne[0],fe=String(Z.popupUrl||"").trim()||String(Z.optionsUrl||"").trim();fe&&(pe={...pe,url:fe,entryPath:Z.path})}window.api.prewarmBrowserExtensionPopup(pe).catch(()=>{})}}).catch(()=>{}),window.api?.onBrowserExtensionPopupState&&window.api.onBrowserExtensionPopupState(te=>{const{entryPath:ne,open:pe}=te||{};if(pe){z={entryPath:ne,pageType:"popup",host:null,overlayActive:!1};const Z=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(ne):ne.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${Z}"]`).forEach(fe=>fe.classList.add("is-active"))}else z.entryPath===ne&&(z={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(Z=>Z.classList.remove("is-active")))}),a&&a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",()=>{A().catch(te=>{console.error("Failed to open extensions manager",te),o("Could not open extensions manager.","error")})})),m&&m.dataset.boundClick!=="1"&&(m.dataset.boundClick="1",m.addEventListener("click",R)),p)try{const te=String(localStorage.getItem("userRole")||"production").toLowerCase(),ne=String(localStorage.getItem("oneview_env_mode")||"prod").toLowerCase();te!=="dev"||ne!=="dev"?p.style.display="none":p.style.display=""}catch{}p&&p.dataset.boundClick!=="1"&&(p.dataset.boundClick="1",p.addEventListener("click",async()=>{try{if(!window.api?.addBrowserExtensionsUnpacked){o("Extension manager API is unavailable.","error");return}const te=await window.api.addBrowserExtensionsUnpacked();e.browserExtensionsCache=Array.isArray(te?.entries)?te.entries:[],d(),c(),o("Unpacked extensions loaded.","success")}catch(te){console.error("Failed to load unpacked extensions",te),o(te?.message||"Could not load unpacked extensions.","error")}})),b&&b.dataset.boundClick!=="1"&&(b.dataset.boundClick="1",b.addEventListener("click",async te=>{const ne=te.target.closest("[data-action]");if(!ne)return;const pe=String(ne.dataset.action||"").trim(),Z=String(ne.dataset.path||"").trim();if(Z)try{if(pe==="open-popup"){await I(Z,"popup");return}if(pe==="open-tab"){await I(Z,"tab");return}if(pe==="open-options"){await I(Z,"options");return}if(pe==="reload"&&window.api?.reloadBrowserExtension){const fe=await window.api.reloadBrowserExtension({path:Z});e.browserExtensionsCache=Array.isArray(fe?.entries)?fe.entries:e.browserExtensionsCache,d(),c(),o("Extension reloaded.","success");return}if(pe==="toggle"&&window.api?.toggleBrowserExtension){const fe=e.browserExtensionsCache.find(vt=>vt.path===Z);fe?.enabled!==!1&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const ct=await window.api.toggleBrowserExtension({path:Z,enabled:fe?.enabled===!1});e.browserExtensionsCache=Array.isArray(ct?.entries)?ct.entries:e.browserExtensionsCache,d(),c(),o("Extension state updated.","success");return}if(pe==="remove"&&window.api?.removeBrowserExtension){typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const fe=await window.api.removeBrowserExtension({path:Z});e.browserExtensionsCache=Array.isArray(fe?.entries)?fe.entries:e.browserExtensionsCache,d(),c(),o("Extension removed.","success")}}catch(fe){console.error("Extension manager action failed",fe),o(fe?.message||"Could not complete extension action.","error")}})),M&&M.dataset.boundClick!=="1"&&(M.dataset.boundClick="1",M.addEventListener("click",async te=>{const ne=te.target.closest("[data-path]");if(!ne)return;const pe=String(ne.dataset.path||"").trim();if(pe)try{await K(pe,ne)}catch(Z){console.error("Failed to open extension popup",Z),o(Z?.message||"Could not open extension popup.","error")}})),Y&&Y.dataset.boundClick!=="1"&&(Y.dataset.boundClick="1",Y.addEventListener("click",()=>{D().catch(te=>{console.error("Failed to toggle extensions menu",te),o("Could not open extensions menu.","error")})})),X&&X.dataset.boundClick!=="1"&&(X.dataset.boundClick="1",X.addEventListener("click",async te=>{const ne=te.target.closest("[data-menu-action]");if(!ne)return;const pe=String(ne.dataset.menuAction||"").trim(),Z=String(ne.dataset.path||"").trim();try{if(pe==="manage"){B(),await A();return}if(!Z)return;if(pe==="pin"){const fe=!ce[Z];ce[Z]=fe,Ve(),c();return}if(pe==="popup"){await K(Z,Y||ne);return}if(pe==="options"){B(),await S(Z,"options");return}pe==="tab"&&(B(),await S(Z,"tab"))}catch(fe){console.error("Extension menu action failed",fe),o(fe?.message||"Could not complete extension action.","error")}})),ue&&ue.dataset.boundClick!=="1"&&(ue.dataset.boundClick="1",ue.addEventListener("click",()=>{N().catch(()=>{})})),he&&he.dataset.boundClick!=="1"&&(he.dataset.boundClick="1",he.addEventListener("click",async()=>{z.entryPath&&(await S(z.entryPath,"tab"),await N())})),document.body&&document.body.dataset.boundExtensionUiDismiss!=="1"&&(document.body.dataset.boundExtensionUiDismiss="1",document.addEventListener("click",te=>{const ne=te.target;g&&!g.contains(ne)&&y(),X&&!X.classList.contains("hidden")&&!X.contains(ne)&&!Y?.contains(ne)&&!a?.contains(ne)&&B(),ge&&!ge.classList.contains("hidden")&&!ge.contains(ne)&&!de?.contains(ne)&&Je(),!ne.closest(".browser-extension-action-btn")&&!X?.contains(ne)&&N().catch(()=>{})}),document.addEventListener("keydown",te=>{te.key==="Escape"&&(y(),B(),Je(),N().catch(()=>{}))}))}function H(){const a=document.getElementById("downloadsManagerBtn"),g=document.getElementById("downloadsManagerPanel");a&&a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",()=>{ot().catch(()=>{})})),g&&g.dataset.boundClick!=="1"&&(g.dataset.boundClick="1",g.addEventListener("click",async m=>{const p=m.target.closest("[data-download-action]");if(!p)return;const b=String(p.dataset.downloadAction||"").trim(),M=String(p.dataset.downloadId||"").trim();if(b)try{if(!window.api?.runManagedDownloadAction)return;const Y=await window.api.runManagedDownloadAction({id:M,action:b});Array.isArray(Y?.downloads)?e.managedDownloadsCache=Y.downloads:(b==="remove"||b==="clear-completed")&&await Ae(),Xe()}catch(Y){o(Y?.message||"Could not complete download action.","error")}})),Ae().then(()=>{Xe()}).catch(()=>{}),window.api&&typeof window.api.onDownloadManagerUpdated=="function"&&document.body?.dataset.boundDownloadManagerEvents!=="1"&&(document.body.dataset.boundDownloadManagerEvents="1",window.api.onDownloadManagerUpdated(m=>{e.managedDownloadsCache=Array.isArray(m?.downloads)?m.downloads:[],Xe(),k().catch(()=>{}),(m?.reason==="created"||m?.reason==="completed"||m?.reason==="interrupted")&&Ee();const p=ke(String(m?.focusId||"").trim());p&&f(p,String(m?.reason||"updated"))}))}return{closeBrowserExtensionPopup:N,closeBrowserExtensionsMenu:B,closeDownloadsManagerPanel:Je,formatDownloadBytes:Fe,formatDownloadEta:Le,formatDownloadSpeed:De,initDownloadsManager:H,initExtensionsManager:G,loadManagedDownloadsFromMain:Ae,refreshBrowserExtensionsUi:c,refreshExtensionsManagerList:C}}function Pi({state:e,constants:n,showToast:t,openOverlayModal:o,closeOverlayModal:r,renderProfilePillSelect:u,resolveCredentialScopeIdForTab:v,applyProfileSelection:E,getCurrentProfileId:P,escapeHtml:k}){const{AUTH_GATEWAY_HOSTS:y,RESOURCE_SERVICE_ORIGIN:x}=n,L=()=>e.activeTabId,$=()=>e.credentialCache,O=c=>{e.credentialCache=c},F=()=>e.activeHttpAuthChallenge,j=c=>{e.activeHttpAuthChallenge=c},ee=()=>e.credentialCacheRefreshedAt,ce=c=>{e.credentialCacheRefreshedAt=c},z=()=>e.credentialCacheRefreshInFlight,se=c=>{e.credentialCacheRefreshInFlight=c},Ce=new Map;function Ie(){return{wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]}}function nt(){return Object.keys(Ie())}function Ve(){return!!(window.api&&typeof window.api.listProfileCredentials=="function"&&typeof window.api.saveProfileCredential=="function"&&typeof window.api.deleteProfileCredential=="function")}function J(c=""){const d=String(c).trim().toLowerCase();if(!d)return"";try{const R=new URL(d),G=String(R.hostname||"").trim().toLowerCase().replace(/^www\./,""),H=String(R.port||"").trim();return G?!H||H==="80"||H==="443"?G:`${G}:${H}`:""}catch{}const C=d.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];if(!C)return"";const I=C.lastIndexOf(":");if(I<=0)return C;const A=C.slice(I+1);return/^\d+$/.test(A)&&A!=="80"&&A!=="443"?C:C.slice(0,I)}function we(c=""){const d=String(c||"").trim().toLowerCase();if(!d)return"";const C=d.lastIndexOf(":");if(C<=0)return d;const I=d.slice(C+1);return/^\d+$/.test(I)?d.slice(0,C):d}function je(c=""){const d=[];try{const C=new URL(String(c||"")),I=(R="")=>{if(R)try{const G=new URL(String(R)),H=J(G.host||G.hostname||"");H&&d.push(H)}catch{const H=J(String(R||""));H&&d.push(H)}};I(C.host||C.hostname||""),["retURL","retUrl","returnUrl","TargetResource","targetResource","PartnerSpId","partnerSpId"].forEach(R=>{I(C.searchParams.get(R)||"")})}catch{}return[...new Set(d.filter(Boolean))]}function Pe(c=""){const d=je(c);if(d.length===0)return J(c);const C=d[0]||"";if(y.has(C)){const I=d.find(A=>A&&!y.has(A));if(I)return I}return C}function Se(c=""){return y.has(J(c))}function Be(c=""){const d=we(J(c));return d.endsWith(".veevavault.com")||d==="veevavault.com"||d.endsWith(".gskinternet.com")||d==="gskinternet.com"||d.endsWith(".gskpro.com")||d==="gskpro.com"}function Ge(c,d,C=""){const I=String(d||"").trim().toLowerCase(),A=J(C);if(!c||!I)return null;const R=($()[c]||[]).filter(G=>{const H=J(G.domain);return H&&H!==A&&!Se(H)&&Be(H)&&String(G.username||"").trim().toLowerCase()===I});return R.sort((G,H)=>J(H.domain).length-J(G.domain).length),R[0]||null}function ze(c=""){const d=String(c||"").trim();return/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(d)?"":d}async function Fe(){if(!window.api?.deleteProfileCredential)return;const c=[];nt().forEach(d=>{($()[d]||[]).forEach(C=>{const I=J(C.domain);!Se(I)||!Ge(d,C.username,I)||c.push({profileId:d,domain:I,username:String(C.username||"").trim()})})}),c.length!==0&&(await Promise.allSettled(c.map(d=>window.api.deleteProfileCredential(d))),c.forEach(d=>{const C=$()[d.profileId]||[];$()[d.profileId]=C.filter(I=>!(J(I.domain)===d.domain&&String(I.username||"").trim().toLowerCase()===d.username.toLowerCase()))}))}async function De(){if(!Ve())return O(Ie()),$();try{const c=await window.api.listProfileCredentials();if(!c||!c.success||!Array.isArray(c.data))return O(Ie()),$();const d=Ie();return c.data.forEach(C=>{const I=String(C.profileId||"").toLowerCase();d[I]&&d[I].push({profileId:I,domain:J(C.domain),username:String(C.username||""),password:String(C.password||"")})}),O(d),await Fe(),$()}catch{return O(Ie()),$()}}async function Le(c=15e3){if(!Ve()||Date.now()-ee()<c)return $();if(z())return z();const C=De().then(I=>(ce(Date.now()),I)).finally(()=>{se(null)});return se(C),C}function ke(c){return c?(c.credentialHintsByDomain||(c.credentialHintsByDomain={}),c.credentialHintsByDomain):{}}function Ee(c="",d=""){const C=`${String(c||"").toLowerCase()} ${String(d||"").toLowerCase()}`;if(/login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(C))return!0;try{const I=new URL(String(c||""));if(x&&I.origin.toLowerCase()===x){const R=String(I.pathname||"/").toLowerCase(),G=String(d||"").toLowerCase();if((R==="/"||R==="/login"||R==="/signin")&&G.includes("synapse"))return!0}const A=`${I.pathname.toLowerCase()} ${I.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(A)}catch{return!1}}function Ae(c=""){let d="";try{d=new URL(String(c||"")).hostname.toLowerCase()}catch{return!1}return d==="10.215.56.196"||d.endsWith(".gskinternet.com")||d.endsWith(".gskpro.com")||d.endsWith(".veevavault.com")||d.endsWith(".okta.com")||d.endsWith(".oktacdn.com")||d.endsWith(".pingone.com")}function Je(c="",d="",C=null){return!Ve()||!C?!1:C.launchedAppType==="website"||!C.launchedAppType?Ee(c,d)||Ae(c):!0}function Xe(c,d=""){if(!c)return null;const C=je(d);if(C.length===0)return null;const I=$()[c]||[];let A=null,R=-1,G="";try{const H=J(d);H&&(G=localStorage.getItem(`oneview:last-used-username:${c}:${H}`)||"")}catch{}return I.forEach(H=>{const a=J(H.domain);if(!a)return;const g=C.reduce((p,b)=>{if(!b)return p;if(b===a)return Math.max(p,1e3);if(we(b)===we(a))return Math.max(p,900);if(b.endsWith(`.${a}`)||a.endsWith(`.${b}`))return Math.max(p,500);const M=we(b),Y=we(a);if(M.endsWith(`.${Y}`)||Y.endsWith(`.${M}`))return Math.max(p,450);const X=M.split(".").reverse(),de=Y.split(".").reverse();let ge=0;for(let ue=0;ue<Math.min(X.length,de.length)&&X[ue]===de[ue];ue+=1)ge+=1;return Math.max(p,ge>1?ge:-1)},-1);if(g<0)return;const m=G&&String(H.username||"").trim().toLowerCase()===G.trim().toLowerCase();(!A||g>R||g===R&&m||g===R&&!m&&a.length>J(A.domain).length)&&(A=H,R=g)}),A}function ot(c,d="",C=null){const I=$()[c]||[];if(I.length===0)return null;let A="";try{A=J(d)}catch{A=""}const R=ke(C),G=Object.values(R||{}).map(b=>String(b||"").trim()).filter(Boolean),H=String(C?.lastUsernameHint||"").trim()||G[G.length-1]||"";if(A&&Se(A)&&H){const b=Ge(c,H,A);if(b)return b}const a=Xe(c,d);if(a&&!Se(a.domain))return a;if(!H)return null;const g=I.filter(b=>String(b.username||"").trim().toLowerCase()===H.toLowerCase());if(g.length===1)return a&&!Se(g[0].domain)?a:g[0];if(g.length===0)return null;const m=A;if(!m)return g[0];const p=b=>{const M=J(b);if(!M)return-1;if(Se(M)&&Be(m))return-100;if(Se(m)&&!Se(M))return 800+(Be(M)?50:0);if(m===M)return 1e3;if(we(m)===we(M))return 900;if(m.endsWith(`.${M}`)||M.endsWith(`.${m}`))return 500;const Y=we(m),X=we(M);if(Y.endsWith(`.${X}`)||X.endsWith(`.${Y}`))return 450;const de=Y.split(".").reverse(),ge=X.split(".").reverse();let ue=0;for(let he=0;he<Math.min(de.length,ge.length)&&de[he]===ge[he];he+=1)ue+=1;return ue};return g.sort((b,M)=>p(M.domain)-p(b.domain)),g[0]||null}function it(c,d="",C=null){const I=ot(c,d,C);if(I)return{...I,profileId:String(I.profileId||"").trim().toLowerCase()||String(c||"").trim().toLowerCase()};const A=$()[c]||[];if(A.length===1)return{...A[0],profileId:String(A[0]?.profileId||"").trim().toLowerCase()||String(c||"").trim().toLowerCase()};let R="";try{R=J(d)}catch{R=""}if(!R||A.length===0)return null;const G=g=>{const m=J(g);if(!m)return-1;if(Se(R)&&!Se(m))return 800+(Be(m)?50:0);if(Se(m)&&Be(R))return-100;if(R===m)return 1e3;if(we(R)===we(m))return 900;if(R.endsWith(`.${m}`)||m.endsWith(`.${R}`))return 500;const p=we(R),b=we(m);if(p.endsWith(`.${b}`)||b.endsWith(`.${p}`))return 450;const M=p.split(".").reverse(),Y=b.split(".").reverse();let X=0;for(let de=0;de<Math.min(M.length,Y.length)&&M[de]===Y[de];de+=1)X+=1;return X},a=[...A].sort((g,m)=>G(m.domain)-G(g.domain))[0]||null;return a?{...a,profileId:String(a.profileId||"").trim().toLowerCase()||String(c||"").trim().toLowerCase()}:null}async function f(c,d){if(!c||!d)return;const C=String(d.username||""),I=String(d.password||"");if(!I)return!1;const A=`
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
          if (${JSON.stringify(!!C)} && userField) {
            userField.focus();
            setNativeValue(userField, ${JSON.stringify(C)});
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
    `;try{return await c.executeJavaScript(A,!0),!0}catch{return!1}}function B(c,d){if(!c||!d)return;c._oneviewAutofillTimer&&(clearTimeout(c._oneviewAutofillTimer),c._oneviewAutofillTimer=null);let C=0;const I=async()=>{if(C+=1,!(typeof c.isDestroyed=="function"?c.isDestroyed():!1)&&c.id===`webview-${L()}`){try{if(await c.executeJavaScript("Boolean(window.__oneviewManualCredentialEditAt)",!0)){c._oneviewAutofillTimer&&(clearTimeout(c._oneviewAutofillTimer),c._oneviewAutofillTimer=null);return}}catch{}await f(c,d),C<6&&(c._oneviewAutofillTimer=setTimeout(I,1e3))}};I()}async function D(c){if(c)try{await c.executeJavaScript(`
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
        `,!0)}catch{}}async function S(c,d){if(!Ve()||!c||!d||d.id!==L()||!d.credentialAutomationEnabled)return;const C=String(c.getURL?.()||d.url||"");let I=null;if(c._oneviewSubmittedCredential&&(I=c._oneviewSubmittedCredential,c._oneviewSubmittedCredential=null),!I)return;const A=I,R=ye=>{try{const Te=new URL(ye);return(Te.origin+Te.pathname).toLowerCase().replace(/\/$/,"")}catch{return String(ye||"").split("?")[0].split("#")[0].toLowerCase().replace(/\/$/,"")}};if(A.url&&R(C)===R(A.url)){c._oneviewSubmittedCredential=I;return}const G=String(A.trigger||"");if(String(A.activeInputType||"").toLowerCase(),G==="input"){const ye=Pe(String(A.url||c.getURL()||"")),Te=ze(A.username),rt=!!Te&&!!A.password&&Te.toLowerCase()===String(A.password).toLowerCase();Te&&!rt&&ye&&(ke(d)[ye]=Te,d.lastUsernameHint=Te);return}const a=v(d),g=String(A.url||c.getURL()||""),m=Pe(g),p=ke(d);let b=ze(A.username);const M=String(A.password||"");if(!a||!m)return;const Y=/^\d{4,8}$/.test(M),X=/authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(g.toLowerCase());if(A.otpLike||X&&Y)return;const de=String(p[m]||"").trim()||String(d.lastUsernameHint||"").trim(),ge=!!b&&!!M&&b.toLowerCase()===M.toLowerCase();b&&!ge?(p[m]=b,d.lastUsernameHint=b):p[m]?b=p[m]:d.lastUsernameHint&&(b=String(d.lastUsernameHint||"").trim());const ue=de||String(p[m]||"").trim()||String(d.lastUsernameHint||"").trim(),he=!!b&&!!M&&b.toLowerCase()===M.toLowerCase();if(he&&ue&&ue!==b&&(b=ue),!b||!M||he&&(!ue||ue.toLowerCase()===b.toLowerCase()))return;const te=`${a}|${m}|${b}`,ne=Date.now(),pe=Ce.get(te)||0,Z=($()[a]||[]).find(ye=>we(J(ye.domain))===we(m)&&String(ye.username||"").trim().toLowerCase()===b.toLowerCase());if(!(!Z||String(Z.password||"")!==M)&&ne-pe<15e3)return;if(Ce.set(te,ne),await De(),Se(m)&&Ge(a,b,m)){($()[a]||[]).find(rt=>J(rt.domain)===m&&String(rt.username||"").trim().toLowerCase()===b.toLowerCase())&&window.api?.deleteProfileCredential&&(await window.api.deleteProfileCredential({profileId:a,domain:m,username:b}),await De());return}const ct=($()[a]||[]).find(ye=>J(ye.domain)===m&&String(ye.username||"").trim().toLowerCase()===b.toLowerCase());if(ct&&String(ct.password||"")===M)return;function vt(ye,Te,rt="success"){if(!ye)return;const Ut=`
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
          toast.textContent = "${Te.replace(/"/g,'\\"')}";
          
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
      `;ye.executeJavaScript(Ut,!0).catch(()=>{})}try{if(!(await window.api.saveProfileCredential({profileId:a,domain:m,username:b,password:M}))?.success)return;await De(),vt(c,"Password saved successfully.","success")}catch(ye){console.warn("Could not save remembered credential:",ye)}}function N(c,d){!c||!d||c._oneviewCredentialPollId||(c._oneviewCredentialPollId=setInterval(()=>{if(typeof c.isDestroyed=="function"?c.isDestroyed():!1){clearInterval(c._oneviewCredentialPollId),c._oneviewCredentialPollId=null;return}d.id,L()},3e3))}async function V(c=!1){const d=document.getElementById("httpAuthModal"),C=document.getElementById("httpAuthForm"),I=F();d&&!d.classList.contains("hidden")&&r(()=>d.classList.add("hidden")),C&&C.reset(),j(null),c&&I?.challengeId&&typeof window.api?.submitHttpAuthChallenge=="function"&&window.api.submitHttpAuthChallenge({challengeId:I.challengeId,cancelled:!0}).catch(()=>{})}async function ae(c={}){const d=document.getElementById("httpAuthModal"),C=document.getElementById("httpAuthModalTitle"),I=document.getElementById("httpAuthMessage"),A=document.getElementById("httpAuthUsernameInput"),R=document.getElementById("httpAuthPasswordInput"),G=document.getElementById("httpAuthRememberInput"),H=document.getElementById("httpAuthSubmitBtn");if(!d||!C||!I||!A||!R||!G||!H)return;F()?.challengeId&&V(!0),j({...c});const a=String(c.reason||"")==="retry";C.textContent=a?"Login Failed, Update Credential":"Website Login Required";const g=String(c.host||c.url||"this website").trim(),m=String(c.realm||"").trim(),p=String(c.profileId||"").trim().toUpperCase();I.textContent=m?`${g} • ${m}${p?` • ${p}`:""}`:`${g}${p?` • ${p}`:""}`,A.value=String(c.username||""),R.value=String(c.password||""),G.checked=c.remember!==!1,H.textContent=a?"Update And Login":"Login",await o(()=>d.classList.remove("hidden")),R.value?(R.focus(),R.select()):(A.focus(),A.select())}function K(){const c=document.getElementById("httpAuthModal"),d=document.getElementById("httpAuthForm"),C=document.getElementById("httpAuthModalCloseBtn");!c||!d||!C||d.dataset.initialized!=="1"&&(d.dataset.initialized="1",C.addEventListener("click",()=>V(!0)),c.addEventListener("click",I=>{I.target===c&&V(!0)}),d.addEventListener("submit",async I=>{I.preventDefault();const A=F(),R=document.getElementById("httpAuthUsernameInput"),G=document.getElementById("httpAuthPasswordInput"),H=document.getElementById("httpAuthRememberInput");if(!A?.challengeId||!R||!G||typeof window.api?.submitHttpAuthChallenge!="function")return;const a=String(R.value||"").trim(),g=String(G.value||""),m=!!H?.checked;if(!(!a||!g))try{await window.api.submitHttpAuthChallenge({challengeId:A.challengeId,username:a,password:g,remember:m}),V(!1)}catch(p){console.error("Failed to submit HTTP auth credential",p),t("Could not submit the website credential.","error")}}),typeof window.api?.onHttpAuthChallenge=="function"&&window.api.onHttpAuthChallenge(I=>{ae(I).catch(A=>{console.error("Failed to open HTTP auth modal",A)})}))}function ie(){}async function le(c,d){if(!d||!d.rect)return;const C=c.getURL(),I=Pe(C);if(!I)return;const A=[];if(Object.entries($()).forEach(([G,H])=>{H.forEach(a=>{const g=J(a.domain),m=we(g),p=we(I),b=m.endsWith("veevavault.com")&&p.endsWith("veevavault.com");if(m===p||b||p.endsWith(`.${m}`)&&m.split(".").length>1){const M=n.PROFILES[G]||{name:G,color:"#ccc"};A.push({...a,profileId:G,profileName:M.name,profileColor:M.color})}})}),A.length===0)return;const R=`if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(A)});
    }`;c.executeJavaScript(R,!0).catch(()=>{})}return{canUseSecureCredentialApi:Ve,getAutofillCredentialForTab:it,initHttpAuthPrompt:K,initPasswordManager:ie,installCredentialCaptureHooks:D,isCredentialAutomationDomain:Ae,isLikelyAuthPage:Ee,maybeOfferRememberCredentials:S,normalizeDomain:J,refreshCredentialCacheIfStale:Le,scheduleCredentialAutofill:B,shouldEnableCredentialAutomation:Je,startCredentialCapturePolling:N,handleCredentialFieldInteraction:le,hideCredentialDropdown:()=>{}}}function Bi({state:e,constants:n,createNativePageDescriptor:t,ensureNativeSettingsGeneralInfo:o,normalizeSettingsSection:r,renderNativeSettingsPage:u,closeBrowserExtensionsMenu:v,closeBrowserExtensionPopup:E,refreshBrowserExtensionsUi:P,refreshTabScrollControls:k,syncProfileSelectionForTab:y,updateProfileLockUI:x,perfMark:L,shouldRequirePlatformApiForNavigation:$,getWebviewPlatformApiFlag:O,setWebviewPlatformApiFlag:F,getWebviewPreloadPathCached:j,startCredentialCapturePolling:ee,scheduleCredentialAutofill:ce,installCredentialCaptureHooks:z,refreshCredentialCacheIfStale:se,getAutofillCredentialForTab:Ce,resolveAssignedProfileIdForTab:Ie,getCredentialScopeIdByPartition:nt,resolveCredentialScopeIdForTab:Ve,maybeOfferRememberCredentials:J,syncTabProfileForPage:we,trackProfileHistory:je,resolveProfileIdForTab:Pe,resolveAssignedProfileId:Se,resolveStrictProfileNavigationTarget:Be,resolveNavigationPartition:Ge,applyProfileSelection:ze,openProfilePromptDialog:Fe,handleCredentialFieldInteraction:De,hideCredentialDropdown:Le}){const{PARTITIONS:ke,PROFILES:Ee,LOCAL_WEB_APP_TYPES:Ae,WEBVIEW_POOL_MAX:Je=6,WEBVIEW_POOL_KEEPALIVE_MS:Xe=6e4,TAB_PREWARM_ENABLED:ot=!1,PREWARM_ALL_PROFILE_PARTITIONS:it=!1}=n,f=[];let B=null;const D=new Map,S=()=>e.tabs,N=i=>{e.tabs=i},V=()=>e.activeTabId,ae=i=>{e.activeTabId=i},K=()=>e.currentProfileId;function ie(i){const s=document.querySelector(".browser-controls-overlay");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result"));l&&i&&(i.hideBrowserControls=!1);const w=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);s.classList.toggle("hidden",w),l?(s.classList.remove("hidden"),s.style.setProperty("display","flex","important"),s.style.setProperty("visibility","visible","important"),s.style.setProperty("opacity","1","important"),s.style.setProperty("height","40px","important")):(s.style.removeProperty("display"),s.style.removeProperty("visibility"),s.style.removeProperty("opacity"),s.style.removeProperty("height"))}function le(i){const s=document.getElementById("browserDetachHeader");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),w=(!i||i.isHome||!!i.hideBrowserControls||!!i.nativePage)&&!l;s.classList.toggle("hidden",w)}function c(i){const s=document.querySelector(".profile-section");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),w=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);s.classList.toggle("hidden",w)}function d(i,s){const l=S().find(h=>h.id===i);if(!l)return;l.title=s;const w=document.getElementById(`tab-ui-${i}`);w&&(w.querySelector(".tab-title").textContent=s)}function C(){const i=V();return i&&S().find(s=>s.id===i)||null}function I(){const i=V();return i?document.getElementById(`webview-${i}`):null}function A(i){const s=document.getElementById("urlDisplay");s&&(s.value=i)}function R(i){const s=document.getElementById("urlDisplay");s&&(s.value=i)}function G(){const i=document.getElementById("browserBack"),s=document.getElementById("browserForward"),l=I();i&&(i.disabled=l?!l.canGoBack():!0),s&&(s.disabled=l?!l.canGoForward():!0)}function H(i){i&&(i._oneviewCredentialPollId&&(clearInterval(i._oneviewCredentialPollId),i._oneviewCredentialPollId=null),i._oneviewAutofillTimer&&(clearTimeout(i._oneviewAutofillTimer),i._oneviewAutofillTimer=null))}function a(i){document.querySelectorAll(".webviews-container .webcontent-pane").forEach(l=>{const w=l.id.replace("webview-",""),h=S().find(W=>W.id===w);w===i&&!h?.isHome&&h?.credentialAutomationEnabled?ee(l,h):H(l)})}function g(i,s=S().length-1){const l=document.getElementById("tabsList");if(!l)return;const w=document.createElement("div");w.className="tab",w.id=`tab-ui-${i.id}`,w.innerHTML=`
        <span class="tab-title">${i.title}</span>
        <button class="tab-close">x</button>
    `,w.addEventListener("click",W=>{W.target.classList.contains("tab-close")||X(i.id)}),w.querySelector(".tab-close").addEventListener("click",W=>{W.stopPropagation(),ue(i.id)});const T=l.children[s]||null;l.insertBefore(w,T),k()}function m(i){setTimeout(async()=>{const s=S().find(w=>w.id===i);if(!(!s||!s.isHome||document.getElementById(`webview-${i}`)))try{const w=await fe(s);if(!w)return;w.classList.remove("active"),typeof w.hide=="function"&&w.hide().catch(()=>{}),w.syncBounds?.(!1)}catch(w){window.api.webContentCall("log-error",{key:`prewarm-err:${i}:${w.toString()}`}).catch(()=>{})}},0)}async function p(i=null,s=null,l="New Tab",w=null,h={}){const T=h.active!==!1;window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?s=ke.gsk:s=gt(s||(Ee[K()]?Ee[K()].partition:ke.guest));const q=`tab-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,U={id:q,title:l,url:i,partition:s,isHome:!i&&!h.nativePage,nativePage:h.nativePage&&typeof h.nativePage=="object"?t(h.nativePage.type||"settings",h.nativePage.section||"general"):null,lockedProfileId:w,hideBrowserControls:!1,launchedAppType:null,trackingAppId:"",trackingAppName:"",requiresPlatformApi:!1,extensionCompatEnabled:!1,extensionEntryPath:"",extensionActiveContext:{url:"",title:""},credentialAutomationEnabled:!1,lastCredentialSourceProfileId:null};U.trackingAppId=String(h.trackingAppId||"").trim(),U.trackingAppName=String(h.trackingAppName||l||U.title||"").trim(),U.extensionEntryPath=String(h.extensionEntryPath||"").trim(),U.extensionCompatEnabled=!!U.extensionEntryPath,U.extensionActiveContext=h.extensionActiveContext&&typeof h.extensionActiveContext=="object"?{url:String(h.extensionActiveContext.url||"").trim(),title:String(h.extensionActiveContext.title||"").trim()}:{url:"",title:""};const Q=S(),Me=Q.findIndex(st=>st.id===V()),ve=Number.isInteger(h.insertIndex)?Math.max(0,Math.min(h.insertIndex,Q.length)):Me>=0?Me+1:Q.length;if(Q.splice(ve,0,U),g(U,ve),U.nativePage)await X(q);else if(i){T&&ae(q);const st=document.getElementById("view-home-content"),bt=document.getElementById("webviews-container");T&&st&&st.classList.add("hidden");const Ot=i&&(i.includes("result.html")||i.includes("extension-icon")||i.toLowerCase().includes("result"));if(T&&bt){bt.classList.remove("hidden");let Ne=document.getElementById("tab-load-placeholder");Ot?Ne&&(Ne.style.display="none"):Ne?Ne.style.display="flex":(Ne=document.createElement("div"),Ne.id="tab-load-placeholder",Ne.style.cssText=["position:absolute","inset:0","z-index:50","display:flex","flex-direction:column","align-items:center","justify-content:center","background:var(--bg-main,#f8fafc)","gap:16px"].join(";"),Ne.innerHTML=`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `,bt.appendChild(Ne));const Lt=()=>{Ne&&(Ne.style.display="none")},pn=Ue=>{Ue&&(typeof Ue._oneviewPlaceholderFinalize=="function"&&(Ue.removeEventListener("did-stop-loading",Ue._oneviewPlaceholderFinalize),Ue.removeEventListener("did-fail-load",Ue._oneviewPlaceholderFinalize)),Ue._oneviewPlaceholderFinalize=null)},fn=setInterval(()=>{const Ue=document.getElementById(`webview-${q}`);if(!Ue)return;clearInterval(fn),clearTimeout(mn);const Rt=()=>{pn(Ue),clearTimeout(mn),Lt()};pn(Ue),Ue._oneviewPlaceholderFinalize=Rt,Ue.addEventListener("did-stop-loading",Rt,{once:!0}),Ue.addEventListener("did-fail-load",Rt,{once:!0})},100),mn=setTimeout(()=>{clearInterval(fn),Lt()},12e3)}await he(q,i,s,l,w,h,T)}else await X(q),ot&&m(q);return U}function b(i=V()){const s=S(),l=s.find(q=>q.id===i);if(!l)return;const w=s.findIndex(q=>q.id===l.id),h=document.getElementById(`webview-${l.id}`),T=h&&typeof h.getURL=="function"&&h.getURL()||l.url||"",W=h&&typeof h.getTitle=="function"&&h.getTitle()||l.title||"New Tab";p(l.isHome||!T||T==="about:blank"?null:T,l.partition,W,l.lockedProfileId||null,{insertIndex:w>=0?w+1:s.length,trackingAppId:l.trackingAppId||"",trackingAppName:l.trackingAppName||W})}function M(i){const s=S();if(!s.length)return;const l=s.findIndex(T=>T.id===V()),h=((l>=0?l:0)+i+s.length)%s.length;X(s[h].id,{suppressHomeSearchFocus:!0})}async function Y(i){!i||typeof i.focusWebContents!="function"||await i.focusWebContents().catch(()=>{})}async function X(i,s={}){ae(i);const l=S().find(U=>U.id===i);if(!l)return;v(),E().catch(()=>{}),y(l),x(l),document.querySelectorAll(".tab").forEach(U=>U.classList.remove("active"));const w=document.getElementById(`tab-ui-${i}`);w&&w.classList.add("active");const h=document.getElementById("view-home-content"),T=document.getElementById("nativeTabContent"),W=document.getElementById("webviews-container"),q=document.querySelectorAll(".webviews-container .webcontent-pane");if(l.isHome){h.classList.remove("hidden"),T?.classList.add("hidden"),W.classList.add("hidden"),ie(l),le(l),c(l);const U=document.getElementById("googleSearchInput");U&&s?.suppressHomeSearchFocus!==!0&&(U.value="",U.focus())}else if(l.nativePage)h.classList.add("hidden"),T?.classList.remove("hidden"),W.classList.add("hidden"),ie(l),le(l),c(l),A(""),r(l.nativePage?.section)==="general"&&await o(),u(l);else{h.classList.add("hidden"),T?.classList.add("hidden"),W.classList.remove("hidden"),ie(l),le(l),c(l),q.forEach(Q=>{Q.id!==`webview-${i}`&&(Q.classList.remove("active"),typeof Q.hide=="function"&&Q.hide().catch(()=>{}),Q.syncBounds?.(!1))});let U=null;try{U=document.getElementById(`webview-${i}`),U||(U=await fe(l))}catch(Q){window.api.webContentCall("log-error",{key:`switchTab-create-err:${i}:${Q.toString()}`}).catch(()=>{})}if(U)try{U.classList.add("active"),typeof U.show=="function"&&await U.show().catch(()=>{}),U.syncBounds?.(!0),await Y(U),A(U.getURL())}catch(Q){window.api.webContentCall("log-error",{key:`switchTab-show-err:${i}:${Q.toString()}`}).catch(()=>{})}}a(l.id),P(),G()}function de(i){if(!i)return!1;const s=String(i.launchedAppType||"").toLowerCase();return Ae.has(s)}function ge(i,s){if(!i||!s||!de(s))return!1;const l=String(i.getAttribute("partition")||s.partition||"");if(!l)return!1;const w=i.parentElement;for(w&&w.removeChild(i),i.classList.remove("active"),f.push({webview:i,partition:l,platformApiEnabled:O(i),at:Date.now()}),L("view-webcontent","park-to-pool",{partition:l,poolSize:f.length});f.length>Je;){const h=f.shift();h&&h.webview&&!h.webview.isDestroyed?.()&&h.webview.remove()}return!0}function ue(i){const s=S(),l=s.findIndex(W=>W.id===i);if(l===-1)return;const w=V()===i;document.getElementById(`tab-ui-${i}`)?.remove();const h=document.getElementById(`webview-${i}`);if(h&&(H(h),(!de(s[l])||!ge(h,s[l]))&&h.remove()),s.splice(l,1),s.length===0){ae(null),p(),k();return}const T=s.some(W=>W.id===V());if(w||!T){const W=Math.min(l,s.length-1),q=s[W]||s[s.length-1];q&&X(q.id)}k()}async function he(i,s,l,w,h=null,T={},W=!0){const q=performance.now(),U=S().find(Me=>Me.id===i);if(!U)return;U._navStartedAt=q,L("view-nav","navigateTo-start",{tabId:U.id,url:String(s||""),partition:String(l||""),appType:T.appType||null}),U.isHome=!1,U.url=s,U.partition=l,U.lockedProfileId=h,U.hideBrowserControls=!!T.hideControls,U.launchedAppType=T.appType||null,U.lastCredentialSourceProfileId=null,U.trackingAppId=String(T.trackingAppId||"").trim(),U.trackingAppName=String(T.trackingAppName||w||U.title||"").trim(),U.requiresPlatformApi=$(s,T),w&&d(i,w),W&&(ae(i),await X(i));let Q=document.getElementById(`webview-${i}`);if(!Q)Q=await fe(U,W);else{const Me=Q.getAttribute("partition"),ve=O(Q);(Me!==l||ve!==!!U.requiresPlatformApi)&&(H(Q),(!de(U)||!ge(Q,U))&&Q.remove(),Q=await fe(U,W))}W&&typeof Q.show=="function"?await Q.show().catch(()=>{}):!W&&typeof Q.hide=="function"&&await Q.hide().catch(()=>{}),typeof Q.setMeta=="function"&&await Q.setMeta({trackingAppId:U.trackingAppId,appName:U.trackingAppName,appType:U.launchedAppType||""}).catch(()=>{}),Q.syncBounds?.(W),W&&(A(s),await Y(Q)),Q.src!==s&&(Q.src=s),L("view-nav","navigateTo-dispatch",{tabId:U.id,elapsedMs:Math.round(performance.now()-q)})}async function te(i,s,l,w=null,h={}){return he(V(),i,s,l,w,h,!0)}function ne(i){i&&i.executeJavaScript(`
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
      `,!0).catch(()=>{})}function pe(i=""){const s=String(i||"").trim().toLowerCase();return!!(!s||s==="about:blank"||s.startsWith("javascript:")||s.startsWith("data:")||s.startsWith("chrome-error://"))}function Z(i){i._hasTabListenersAttached||(i._hasTabListenersAttached=!0,i.addEventListener("ipc-message",async s=>{if(s.channel==="oneview:credential-field-focused")De(i,s.args[0]);else if(s.channel!=="oneview:credential-field-blurred"){if(s.channel==="oneview:credential-selected"){const l=s.args[0];if(l){i.executeJavaScript("window.__oneviewManualCredentialEditAt = 0;",!0).catch(()=>{}),ce(i,l),l.profileId&&l.profileId!==K()&&ze(l.profileId);try{const w=i.getURL(),h=w?new URL(w).hostname.toLowerCase():"";h&&localStorage.setItem(`oneview:last-used-username:${l.profileId||K()}:${h}`,l.username)}catch{}}}else if(s.channel==="oneview:credential-login-attempted"){const l=s.args[0];if(l&&l.username){try{const T=l.url?new URL(l.url).hostname.toLowerCase():"";T&&localStorage.setItem(`oneview:last-used-username:${K()}:${T}`,l.username)}catch{}const w=i.id.replace("webview-",""),h=S().find(T=>T.id===w);h&&h.credentialAutomationEnabled&&J(i,h)}}else if(s.channel==="oneview:credential-submitted"){const l=s.args[0];l&&(i._oneviewSubmittedCredential=l)}else if(s.channel==="oneview:keydown"){const l=s.args[0];if(l){const w=new KeyboardEvent("keydown",{key:l.key,ctrlKey:l.ctrlKey,shiftKey:l.shiftKey,altKey:l.altKey,metaKey:l.metaKey,bubbles:!0,cancelable:!0});document.dispatchEvent(w)}}}}),i.addEventListener("console-message",s=>{const l=String(s?.message||"");(l.includes("[OneView][Credential")||l.includes("[VeevaSlide]"))&&console.log("[WebviewConsole]",{level:s?.level,line:s?.line,sourceId:s?.sourceId||"",message:l})}),i.addEventListener("did-start-loading",()=>{const s=i.id.replace("webview-",""),l=S().find(h=>h.id===s);if(!l)return;l._didStartLoadingAt=performance.now(),L("view-webcontent","did-start-loading",{tabId:l.id,url:i.getURL()||l.url||""}),l.url&&(l.url.includes("result.html")||l.url.includes("extension-icon")||l.url.toLowerCase().includes("result"))?(d(l.id,"Result"),l.id===V()&&R(l.url||"")):(d(l.id,"Loading..."),l.id===V()&&R(l.url||"Loading..."))}),i.addEventListener("did-stop-loading",async()=>{const s=i.id.replace("webview-",""),l=S().find(ve=>ve.id===s);if(!l)return;const w=typeof l._didStartLoadingAt=="number"?Math.round(performance.now()-l._didStartLoadingAt):null,h=typeof l._navStartedAt=="number"?Math.round(performance.now()-l._navStartedAt):null;L("view-webcontent","did-stop-loading",{tabId:l.id,url:i.getURL()||"",loadElapsedMs:w,navElapsedMs:h});const T=i.getURL()||l.url||"";let q=T&&(T.includes("result.html")||T.includes("extension-icon")||T.toLowerCase().includes("result"))?"Result":i.getTitle()||l.title||"Tab";if(q==="Tab"||q==="Loading..."||!q)try{const ve=new URL(T);q=ve.hostname?ve.hostname.replace("www.",""):"Tab"}catch{q="Tab"}(l.title==="Loading..."||l.title==="Tab"||!l.title||i.getTitle()&&i.getTitle()!=="about:blank")&&d(l.id,q),l.id===V()&&A(T),l.url=T,l.credentialAutomationEnabled=cn(T,q,l);const Q=async(ve,st,bt)=>{if(!ve.credentialAutomationEnabled){H(i);return}const Ot=Ie(ve,st,bt),Ne=nt(ve.partition)||Ot||K();await se();const Lt=Ce(Ne,st,ve);ce(i,Lt),ee(i,ve),z(i)};i._oneviewSetupCredentialAutomation=Q,await Q(l,T,q),await we(l,T,q,i),wi(i,l);const Me=Pe(l);je(Me,T,q),ne(i)}),i.addEventListener("page-title-updated",s=>{const l=i.id.replace("webview-",""),w=S().find(h=>h.id===l);w&&(d(w.id,s.title),w.credentialAutomationEnabled&&J(i,w))}),i.addEventListener("will-navigate",()=>{const s=i.id.replace("webview-",""),l=S().find(w=>w.id===s);l&&l.credentialAutomationEnabled&&J(i,l)}),i.addEventListener("did-navigate",s=>{const l=i.id.replace("webview-",""),w=S().find(W=>W.id===l);if(!w)return;const h=s.url||i.getURL()||"";w.url=h,w.id===V()&&(A(h),G());const T=Pe(w);je(T,h,i.getTitle()||w.title||""),w.credentialAutomationEnabled&&(J(i,w),typeof i._oneviewSetupCredentialAutomation=="function"&&i._oneviewSetupCredentialAutomation(w,h,i.getTitle()||w.title||""))}),i.addEventListener("did-navigate-in-page",async s=>{const l=i.id.replace("webview-",""),w=S().find(U=>U.id===l);if(!w)return;const h=s.url||i.getURL()||"";w.url=h,w.id===V()&&(A(h),G());const T=Pe(w);if(je(T,h,i.getTitle()||w.title||""),w.credentialAutomationEnabled&&(J(i,w),typeof i._oneviewSetupCredentialAutomation=="function"&&i._oneviewSetupCredentialAutomation(w,h,i.getTitle()||w.title||"")),i.addEventListener("history-changed",U=>{_=U,w.id===V()&&G()}),w.credentialAutomationEnabled=cn(h,i.getTitle()||w.title||"",w),!w.credentialAutomationEnabled){H(i);return}J(i,w),await se();const W=nt(w.partition)||Ie(w,h,i.getTitle()||w.title||"")||Ve(w),q=Ce(W,h,w);ce(i,q),ee(i,w)}),i.addEventListener("new-window",async s=>{const l=i.id.replace("webview-",""),w=S().find(Me=>Me.id===l);if(!w)return;typeof s?.preventDefault=="function"&&s.preventDefault();const h=String(s?.url||"").trim();if(pe(h))return;const T=String(i.getURL()||"").trim();if(T&&T===h)return;let W=Se(h,"New Tab"),q=null;if(W)q=Ee[W].partition;else if(Fe){const Me=Pe(w)||"guest",ve=await Fe(h,Me);if(ve&&!ve.cancelled&&ve.profileId)W=ve.profileId,q=Ee[W]?.partition;else return}else q=w.partition;const U=S(),Q=U.findIndex(Me=>Me.id===w.id);p(h,q,"New Tab",W,{insertIndex:Q>=0?Q+1:U.length})}))}async function fe(i,s=!0){if(D.has(i.id))return D.get(i.id);const l=vt(i,s);D.set(i.id,l);try{return await l}finally{D.delete(i.id)}}function ct(i){const s=String(i?.partition||"");if(!s||f.length===0)return null;const l=!!i?.requiresPlatformApi,w=f.findIndex(T=>T.partition===s&&!!T.platformApiEnabled===l);if(w===-1)return null;const[h]=f.splice(w,1);return h?.webview||null}async function vt(i,s=!0){const l=performance.now(),w=document.getElementById("webviews-container"),h=ct(i);if(h)return h.classList.toggle("active",s),h.id=`webview-${i.id}`,h.setAttribute("partition",i.partition),F(h,!!i.requiresPlatformApi),Z(h),w.appendChild(h),s&&typeof h.show=="function"?h.show().catch(()=>{}):!s&&typeof h.hide=="function"&&h.hide().catch(()=>{}),h.syncBounds?.(s),s&&typeof h.focusWebContents=="function"&&h.focusWebContents().catch(()=>{}),L("view-webcontent","reuse-pooled",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l),poolSize:f.length}),h;const T=j(),W=await gn({key:`view:${i.id}`,partition:i.partition,preloadPath:T,additionalArguments:i.requiresPlatformApi?["--oneview-enable-platform-api=1"]:[],extensionEntryPath:i.extensionEntryPath,extensionActiveContext:i.extensionActiveContext,extensionCompat:!0,initialMeta:{trackingAppId:i.trackingAppId,appName:i.trackingAppName,appType:i.launchedAppType||"",extensionEntryPath:i.extensionEntryPath},className:`webcontent-pane${s?" active":""}`});return W.id=`webview-${i.id}`,W.setAttribute("partition",i.partition),F(W,!!i.requiresPlatformApi),Z(W),w.appendChild(W),!s&&typeof W.hide=="function"&&W.hide().catch(()=>{}),W.syncBounds?.(s),s&&typeof W.focusWebContents=="function"&&W.focusWebContents().catch(()=>{}),L("view-webcontent","create-fresh",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l)}),W}function ye(){B||(B=setInterval(()=>{if(!document.hidden&&f.length!==0)for(let i=f.length-1;i>=0;i-=1){const l=f[i]?.webview;if(!l||l.isDestroyed?.()){f.splice(i,1);continue}l.executeJavaScript("void 0",!1).catch(()=>{})}},Xe))}async function Te(i){const s=String(i||"").trim();if(!s||f.some(T=>T.partition===s))return;const l=document.getElementById("webviews-container");if(!l)return;const w=j(),h=`view:prewarm:${s}:${Date.now()}`;try{const T=await gn({key:h,partition:s,preloadPath:w,className:"webcontent-pane"});T.id=`webview-prewarm-${Date.now()}`,l.appendChild(T),T.syncBounds?.(),ge(T,{launchedAppType:"website",partition:s})}catch{}}async function rt(){const i=Array.from(new Set(Object.values(Ee).map(s=>String(s?.partition||"").trim()).filter(Boolean)));for(const s of i)await Te(s),await new Promise(l=>setTimeout(l,60))}async function ln(){const i=Ee[K()]?.partition||Ee.guest.partition;i&&await Te(i)}function Ut(){ye(),ot&&(it?rt():ln())}function mi(){for(B&&(clearInterval(B),B=null);f.length>0;){const i=f.shift();i&&i.webview&&!i.webview.isDestroyed?.()&&i.webview.remove()}}function gi(i,s=null){return!(!i||i.isHome)}function wi(i,s){if(!i||!s||s.launchedAppType!=="website")return;const l=`
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
  `;try{i.insertCSS(l)}catch(w){console.warn("Could not apply website scrollbar theme:",w)}}function hi(){const i=S().find(l=>l.id===V());if(!i||i.isHome)return;i.isHome=!0,i.url=null,i.lockedProfileId=null,d(i.id,"New Tab");const s=document.getElementById(`webview-${i.id}`);s&&(H(s),(!de(i)||!ge(s,i))&&s.remove()),X(i.id)}function vi(i=""){const s=String(i||"").trim();if(!s)return"";const l=s.match(/^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/);if(l){const h=l[1].toUpperCase(),T=decodeURIComponent(l[2]).replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${h}:/${T}`}if(/^file:\/\//i.test(s)||/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^about:/i.test(s))return s;const w=s.match(/^([a-zA-Z])[:/\\](.*)$/);if(w){const h=w[1].toUpperCase(),T=w[2].replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${h}:/${T}`}if(/^\/[A-Za-z]\//.test(s)){const h=s[1].toUpperCase(),T=s.slice(3).replace(/\\/g,"/");return`file:///${h}:/${T}`}return/^\\\\/.test(s)?`file:${s.replace(/\\/g,"/")}`:s}function Nt(i=""){const s=String(i||"").trim();return!s||/\s/.test(s)?!1:!!(/^about:/i.test(s)||/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(s)||/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(s)||s.includes(".")||/[/:?#]/.test(s))}async function bi(i){if(i=vi(i),!i)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){let h=i;Nt(i)?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&(h=`https://${i}`):h=`https://www.google.com/search?q=${encodeURIComponent(i)}`,await te(h,ke.gsk,i);return}let s=i,l=Nt(i);if(l?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&!/^file:\/\//i.test(i)&&(s=`https://${i}`):Nt(i)?(s=`https://${i}`,l=!0):s=`https://www.google.com/search?q=${encodeURIComponent(i)}`,l){const h=await Be(s,null,"New Tab");if(!h||h.cancelled)return;const T=h.profileId,W=h.partition;T&&T!==K()&&ze(T,{bypassLock:!0}),await te(s,W,"New Tab",h.lockedProfileId);return}const w=Ge(s,C()?.partition||Ee[K()]?.partition||ke.guest,"Google Search");await te(s,w,"Google Search")}function yi(i,{isTeardown:s=!1}={}){const l=S(),w=Array.isArray(i)?i.filter(Boolean):[];if(w.length===0||l.length===0)return;const h=new Set(w),T=[...l],W=T.findIndex(q=>q.id===V());if(T.forEach(q=>{if(!h.has(q.id))return;document.getElementById(`tab-ui-${q.id}`)?.remove();const U=document.getElementById(`webview-${q.id}`);U&&(H(U),(!de(q)||!ge(U,q))&&U.remove())}),N(T.filter(q=>!h.has(q.id))),S().length===0){ae(null),s||(p(),k());return}if(h.has(V())){const q=Math.min(Math.max(W,0),S().length-1);ae(S()[q].id)}X(V()||S()[0].id),k()}function cn(i="",s="",l=null){return l?l.launchedAppType==="website"||!l.launchedAppType?dn(i,s)||un(i):!0:!1}function dn(i="",s=""){const l=`${String(i||"")} ${String(s||"")}`.toLowerCase();if(/login|sign in|signin|password|sso|authenticate|verify/.test(l))return!0;try{const w=new URL(String(i||"")),h=`${w.pathname.toLowerCase()} ${w.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(h)}catch{return!1}}function un(i=""){let s="";try{s=new URL(String(i||"")).hostname.toLowerCase()}catch{return!1}return s==="10.215.56.196"||s.endsWith(".gskinternet.com")||s.endsWith(".gskpro.com")||s.endsWith(".veevavault.com")||s.endsWith(".okta.com")||s.endsWith(".oktacdn.com")||s.endsWith(".pingone.com")}return{closeTab:ue,closeTabsBulk:yi,createTab:p,createWebviewForTab:fe,duplicateTab:b,disposeWebviewRuntime:mi,getActiveTab:C,getActiveWebview:I,goToActiveTabHome:hi,isInspectableLocalFileTab:gi,navigateTo:te,navigateToTab:he,performSearch:bi,startWebviewRuntime:Ut,switchRelativeTab:M,switchTab:X,updateTabTitle:d,updateUrlDisplay:A,updateUrlDisplayString:R,getCurrentProfileId:K,getTabs:S}}console.log("View Page Script initializing...");let oe=[],We=null,Tt=!1,Fn=null,hn=null,vn=[],bn=[],yn={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};const Gt=et.profileHistory,Jt="view.profileHistory.v1";let _e={wppproduction:[],vml:[],gsk:[],guest:[]};const Hn=et.customBookmarks;let Oe=[],Sn="guest",zt="guest",En="",dt="guest",Pt=null,Qe=null,xn=null;const Ai=new Set(["login.veevavault.com","federation.gsk.com"]);let yt=null,Re=-1,He=[],Cn={version:"",defaultOpenStatus:""},In=0,Ln=null,kn=!1;const Wn=et.perfEnabled;let pt=null,Pn=!1;const It={};Object.defineProperties(It,{tabs:{get:()=>oe,set:e=>{oe=e}},activeTabId:{get:()=>We,set:e=>{We=e}},browserExtensionsCache:{get:()=>vn,set:e=>{vn=e}},managedDownloadsCache:{get:()=>bn,set:e=>{bn=e}},nativeSettingsGeneralInfo:{get:()=>Cn,set:e=>{Cn=e}},historyProfileId:{get:()=>zt,set:e=>{zt=e}},historySearchQuery:{get:()=>En,set:e=>{En=e}},currentProfileId:{get:()=>me,set:e=>{me=e}},profileHistoryCache:{get:()=>_e,set:e=>{_e=e}},credentialCache:{get:()=>yn,set:e=>{yn=e}},passwordProfileId:{get:()=>Sn,set:e=>{Sn=e}},passwordEditTarget:{get:()=>hn,set:e=>{hn=e}},activeHttpAuthChallenge:{get:()=>xn,set:e=>{xn=e}},credentialCacheRefreshedAt:{get:()=>In,set:e=>{In=e}},credentialCacheRefreshInFlight:{get:()=>Ln,set:e=>{Ln=e}}});const qt={synapse:{partition:be.synapse},contentgen:{partition:be.contentgen}},Xt=new Set(["nextjs","vite","react","angular","html","neutralino","website","vite-server"]),Vn=(()=>{try{return new URL(Rn).origin.toLowerCase()}catch{return""}})(),Ti=new URL(""+new URL("contentgen-DHdropzE.webp",import.meta.url).href,import.meta.url).href,$i=new URL(""+new URL("contentgen-dark-Bj2lxwBn.webp",import.meta.url).href,import.meta.url).href;function Bn(e=document){if(!e||typeof e.querySelectorAll!="function")return;const n=document.body.classList.contains("dark-mode");e.querySelectorAll("img[data-theme-icon]").forEach(t=>{const o=String(t.getAttribute("data-theme-icon")||"").trim();let r="";o==="contentgen"&&(r=n?$i:Ti),r&&t.getAttribute("src")!==r&&t.setAttribute("src",r)})}function _i(){["httpAuthModal","bookmarkModal","cacheActionModal","extensionsManagerModal"].forEach(e=>{const n=document.getElementById(e);!n||n.dataset.hoistedToBody==="1"||(document.body.appendChild(n),n.dataset.hoistedToBody="1")})}async function An(){const e=tt();if(!(!e||e.isHome||!e.url||!window.api?.openDetachedViewWindow))try{await window.api.openDetachedViewWindow({url:e.url,title:e.title||"Detached Tab",partition:e.partition||be.guest}),Zt(e.id)}catch(n){console.error("Failed to open detached tab window",n),Ye("Could not open the page in a separate window.","error")}}function Mt(){if(pt!==null)return pt;try{const e=localStorage.getItem(Wn);return pt=e==="1"||e==="true",pt}catch{return pt=!1,!1}}function jn(e,n,t=null){if(!Mt())return;const o=t?{...t}:{};try{console.log(`[PERF][${e}] ${n}`,o)}catch{}}window.addEventListener("storage",e=>{e.key===Wn&&(pt=null,window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Mt()).catch(()=>{}))});const re={wppproduction:{id:"wppproduction",name:"WPPProduction",partition:be.wppproduction,color:"#000000",bgColor:"#e2e8f0",label:"W"},vml:{id:"vml",name:"VML",partition:be.vml,color:"#ff0000",bgColor:"#fee2e2",label:"V"},gsk:{id:"gsk",name:"GSK",partition:be.gsk,color:"#f37521",bgColor:"#ffedd5",label:"G"},guest:{id:"guest",name:"Guest",partition:be.guest,color:"#64748b",bgColor:"#f1f5f9",label:"?"}};let me="guest";function Di(){return me}const Mi=Pi({state:It,constants:{AUTH_GATEWAY_HOSTS:Ai,RESOURCE_SERVICE_ORIGIN:Vn,PROFILES:re},showToast:Ye,openOverlayModal:lt,closeOverlayModal:Ze,renderProfilePillSelect:on,resolveCredentialScopeIdForTab:oi,applyProfileSelection:ht,getCurrentProfileId:()=>me,escapeHtml:xe}),{getAutofillCredentialForTab:Ui,initHttpAuthPrompt:Ni,installCredentialCaptureHooks:Oi,isLikelyAuthPage:Ri,maybeOfferRememberCredentials:Fi,refreshCredentialCacheIfStale:Hi,scheduleCredentialAutofill:Wi,startCredentialCapturePolling:Vi,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi}=Mi;let ut=null,St=null;const qi=ki({state:It,constants:{PROFILES:re,PENDING_EXTENSION_OPEN_STORAGE_KEY:"oneview.pendingExtensionOpenPath",EXTENSION_PIN_STORAGE_KEY:"oneview.browserExtensions.pinned.v1",IS_DEV_APP_BUILD:At},escapeHtml:xe,showToast:Ye,openOverlayModal:lt,closeOverlayModal:Ze,getActiveTab:(...e)=>St?.getActiveTab?.(...e)??null,getActiveWebview:(...e)=>St?.getActiveWebview?.(...e)??null,createTab:(...e)=>St?.createTab?.(...e),refreshActiveNativeSettingsPage:(...e)=>ut?.refreshActiveNativeSettingsPage?.(...e)??Promise.resolve(),closeSettingsMenu:Eo}),{closeBrowserExtensionPopup:Qt,closeBrowserExtensionsMenu:Yi,formatDownloadBytes:Ki,formatDownloadEta:Gi,formatDownloadSpeed:Ji,initDownloadsManager:Xi,initExtensionsManager:Qi,loadManagedDownloadsFromMain:Zi,refreshBrowserExtensionsUi:eo,refreshExtensionsManagerList:zn}=qi;St=Bi({state:It,constants:{PARTITIONS:be,PROFILES:re,LOCAL_WEB_APP_TYPES:Xt,WEBVIEW_POOL_MAX:6,WEBVIEW_POOL_KEEPALIVE_MS:12e3,TAB_PREWARM_ENABLED:!0,PREWARM_ALL_PROFILE_PARTITIONS:!1},createNativePageDescriptor:(...e)=>ut?.createNativePageDescriptor?.(...e)??null,ensureNativeSettingsGeneralInfo:(...e)=>ut?.ensureNativeSettingsGeneralInfo?.(...e)??Promise.resolve(),normalizeSettingsSection:(...e)=>ut?.normalizeSettingsSection?.(...e)??"general",renderNativeSettingsPage:(...e)=>ut?.renderNativeSettingsPage?.(...e),closeBrowserExtensionsMenu:Yi,closeBrowserExtensionPopup:Qt,refreshBrowserExtensionsUi:eo,refreshTabScrollControls:Dt,syncProfileSelectionForTab:ko,updateProfileLockUI:Et,perfMark:jn,shouldRequirePlatformApiForNavigation:_o,getWebviewPlatformApiFlag:Do,setWebviewPlatformApiFlag:Mo,getWebviewPreloadPathCached:$o,startCredentialCapturePolling:Vi,scheduleCredentialAutofill:Wi,installCredentialCaptureHooks:Oi,refreshCredentialCacheIfStale:Hi,getAutofillCredentialForTab:Ui,resolveAssignedProfileIdForTab:Xn,getCredentialScopeIdByPartition:Yn,resolveCredentialScopeIdForTab:oi,maybeOfferRememberCredentials:Fi,syncTabProfileForPage:Po,trackProfileHistory:To,resolveProfileIdForTab:ii,resolveAssignedProfileId:Ct,resolveStrictProfileNavigationTarget:Qn,resolveNavigationPartition:ft,applyProfileSelection:ht,openProfilePromptDialog:Io,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi});const{closeTab:Zt,closeTabsBulk:mt,createTab:$e,createWebviewForTab:to,duplicateTab:no,disposeWebviewRuntime:qn,getActiveTab:tt,getActiveWebview:Ke,goToActiveTabHome:io,isInspectableLocalFileTab:oo,navigateTo:xt,navigateToTab:ro,performSearch:$t,startWebviewRuntime:so,switchRelativeTab:kt,switchTab:qe,updateTabTitle:ao,updateUrlDisplay:lo,updateUrlDisplayString:Tn,getTabs:Yt}=St;ut=Li({state:It,constants:{PROFILES:re,PARTITIONS:be,IS_DEV_APP_BUILD:At},escapeHtml:xe,showToast:Ye,isPerfEnabled:Mt,formatDownloadBytes:Ki,formatDownloadSpeed:Ji,formatDownloadEta:Gi,formatHistoryTime:ri,loadManagedDownloadsFromMain:Zi,refreshExtensionsManagerList:zn,saveProfileHistoryStore:rn,getActiveTab:tt,updateTabTitle:ao,createTab:$e,switchTab:qe,navigateTo:xt});const{bindSettingsShortcutsGlobal:co,createNativePageDescriptor:fr,ensureNativeSettingsGeneralInfo:mr,getSettingsTabTitle:gr,initNativeSettingsUi:uo,initSettingsMenu:po,isEditableShortcutTarget:fo,isNativeSettingsTab:wr,normalizeSettingsSection:hr,openSettingsTab:Kt,refreshActiveNativeSettingsPage:mo,renderNativeSettingsPage:vr,updateNativeSettingsTabSection:br}=ut;function go(){try{return localStorage.getItem("username")==="Guest"}catch{return!1}}function wo(e="",n="",t=""){const o=String(t||"").trim().toLowerCase();if(qt[o])return o;const r=String(n||"").trim().toLowerCase(),u=String(e||"").trim().toLowerCase();try{const v=new URL(String(e||"")),E=`${v.protocol}//${v.host}`.toLowerCase(),P=String(v.pathname||"/").toLowerCase();if(E===Vn&&(P==="/"||P===""))return"synapse";if(E==="http://10.215.56.196:3456")return"contentgen"}catch{}return/content[\s-]*gen/.test(r)||/content[\s-]*gen/.test(u)?"contentgen":r.includes("synapse")?"synapse":""}function en(e){const n=gt(e);if(n===be.synapse||n===be.contentgen)return"guest";const t=Object.values(re).find(o=>o.partition===n);return t?t.id:null}function Yn(e){const n=gt(e);return n===be.synapse?"synapse":n===be.contentgen?"contentgen":en(n)}function ft(e="",n="",t="",o={}){const r=String(o?.sessionScope||o?.credentialScope||"").trim()||"",u=wo(e,t,r);return u&&qt[u]?qt[u].partition:gt(n||re[me]?.partition||be.guest)}async function ho(){const e=document.getElementById("view-synapse-link-btn");if(!e||(e.style.display="none",go()))return;const n=String(localStorage.getItem("emp_id")||"").trim(),t=String(localStorage.getItem("username")||"").trim(),o=/^\d+$/.test(t)?t:"",r=n||o;if(r)try{const u=await fetch(`${Rn}/api/list_of_users`,{signal:AbortSignal.timeout(5e3)});if(!u.ok)throw new Error(`API returned ${u.status}`);const v=await u.json(),E=Array.isArray(v)?v:Array.isArray(v?.users)?v.users:[],P=new Set(E.map(k=>String(k?.emp_id??"").trim()).filter(Boolean));e.style.display=P.has(r)?"flex":"none"}catch(u){console.warn("Could not verify Synapse visibility in view",u),e.style.display="none"}}function vo(e="",n="addressSearchDropdown"){const t=document.getElementById(n);if(!t)return;const o=String(e||"").trim().toLowerCase();if(!o){t.classList.add("hidden"),He=[],Re=-1;return}const r=oe.filter(y=>{const x=String(y.title||"").toLowerCase(),L=String(y.url||"").toLowerCase();return x.includes(o)||L.includes(o)}).map(y=>({type:"tab",id:y.id,title:y.title||"Untitled Tab",url:y.url||"",partition:y.partition}));let u=[];Object.values(_e).forEach(y=>{Array.isArray(y)&&y.forEach(x=>{const L=String(x.title||"").toLowerCase(),$=String(x.url||"").toLowerCase();if(L.includes(o)||$.includes(o)){const O=u.some(j=>j.url===x.url),F=r.some(j=>j.url===x.url);!O&&!F&&u.push({type:"history",title:x.title||"History Item",url:x.url,partition:x.partition||be.guest})}})}),He=[{type:"search",title:e,url:`Search for "${e}"`},...r.slice(0,5),...u.slice(0,15)],Re=0;let E="";E+=Ft(He[0],0);const P=He.filter(y=>y.type==="tab");P.length>0&&(E+='<div class="address-search-group-label">Open Tabs</div>',P.forEach(y=>{const x=He.indexOf(y);E+=Ft(y,x)}));const k=He.filter(y=>y.type==="history");k.length>0&&(E+='<div class="address-search-group-label">History</div>',k.forEach(y=>{const x=He.indexOf(y);E+=Ft(y,x)})),t.innerHTML=E,t.classList.remove("hidden")}function Ft(e,n){const t=n===Re;let o=String(e.title||"H").charAt(0).toUpperCase(),r="is-history",u="History";return e.type==="tab"?(r="is-tab",u="Tab"):e.type==="search"&&(r="is-search",u="Search",o="🔍"),`
    <div class="address-search-item ${r} ${t?"is-selected":""}" 
         data-index="${n}">
      <div class="address-search-item-icon">${o}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${xe(e.title)}</span>
        <span class="address-search-item-url">${xe(e.url)}</span>
      </div>
      <div class="address-search-item-badge">${u}</div>
    </div>
  `}async function $n(e,n){const t=document.getElementById(e);if(!t)return;if(Re<0||Re>=He.length){$t(t.value);return}const o=He[Re],r=document.getElementById(n);r&&r.classList.add("hidden"),o.type==="tab"?await qe(o.id):o.type==="history"?await si(o.url,o.partition,o.title):$t(t.value),t.blur()}function _n(e,n){const t=document.getElementById(e),o=document.getElementById(n);!t||!o||(t.addEventListener("input",()=>{vo(t.value,n)}),t.addEventListener("keydown",r=>{o.classList.contains("hidden")||(r.key==="ArrowDown"?(r.preventDefault(),Re=(Re+1)%He.length,Dn(n)):r.key==="ArrowUp"?(r.preventDefault(),Re=(Re-1+He.length)%He.length,Dn(n)):r.key==="Enter"?(r.preventDefault(),$n(e,n)):r.key==="Escape"&&o.classList.add("hidden"))}),o.addEventListener("click",r=>{const u=r.target.closest(".address-search-item");if(!u)return;const v=parseInt(u.dataset.index);isNaN(v)||(Re=v,$n(e,n))}))}function Dn(e){const n=document.getElementById(e);n&&n.querySelectorAll(".address-search-item").forEach((t,o)=>{const r=parseInt(t.dataset.index);t.classList.toggle("is-selected",r===Re),r===Re&&t.scrollIntoView({block:"nearest"})})}function bo(){const e=document.getElementById("googleSearchInput");e&&e.dataset.boundAddressInput!=="1"&&(e.dataset.boundAddressInput="1",e.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdownHome");o&&!o.classList.contains("hidden")||t.key==="Enter"&&$t(e.value)}),_n("googleSearchInput","addressSearchDropdownHome"));const n=document.getElementById("urlDisplay");n&&n.dataset.boundAddressInput!=="1"&&(n.dataset.boundAddressInput="1",n.addEventListener("focus",()=>{n.select?.()}),n.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdown");if(!(o&&!o.classList.contains("hidden"))){if(t.key==="Enter")t.preventDefault(),$t(n.value),n.blur();else if(t.key==="Escape"){t.preventDefault();const r=tt();lo(r?.url||""),n.blur()}}}),_n("urlDisplay","addressSearchDropdown"))}function Kn(){if(Tt){window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode(),oe.length===0?$e():qe(We||oe[0].id);return}Tt=!0,console.log("initViewPage called"),Si().catch(n=>{console.warn("Could not initialize OneView shared storage sync",n)}),ir(),window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Mt()).catch(()=>{}),window.api&&typeof window.api.getPerfLogPath=="function"&&window.api.getPerfLogPath().then(n=>{n?.success&&jn("perf","log-path",{path:n.path||"",enabled:n.enabled})}).catch(()=>{}),!kn&&window.api&&typeof window.api.onCredentialDebugLog=="function"&&(kn=!0,window.api.onCredentialDebugLog(n=>{console.log("[OneView][CredentialCapture][MainRelay]",n)})),document.body?.dataset.boundProfileHistorySharedStorage!=="1"&&window.api?.onOneviewSharedStorageUpdated&&(document.body.dataset.boundProfileHistorySharedStorage="1",window.api.onOneviewSharedStorageUpdated(n=>{String(n?.key||"")===Jt&&(ni(n),mo().catch(()=>{}))})),Fo(),Ao(),Bo().catch(()=>{}),jo(),sn(),Bn(),_i(),document.addEventListener("click",n=>{const t=document.getElementById("addressSearchDropdown"),o=document.getElementById("addressSearchDropdownHome"),r=document.getElementById("urlDisplay"),u=document.getElementById("googleSearchInput");t&&!t.contains(n.target)&&n.target!==r&&t.classList.add("hidden"),o&&!o.contains(n.target)&&n.target!==u&&o.classList.add("hidden");const v=document.getElementById("credentialSelectionDropdown");v&&!v.contains(n.target)&&v.classList.add("hidden")}),document.body.dataset.viewThemeIconObserverBound||(document.body.dataset.viewThemeIconObserverBound="1",new MutationObserver(()=>{Bn()}).observe(document.body,{attributes:!0,attributeFilter:["class"]})),oe.length===0?$e():qe(We||oe[0].id);const e=document.getElementById("newTabBtn");e&&e.addEventListener("click",()=>{$e()}),Ko();try{bo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupViewSearch-err:${n.toString()}`}).catch(()=>{})}try{Ho()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupBookmarks-err:${n.toString()}`}).catch(()=>{})}ho().catch(n=>{console.warn("Failed to update Synapse visibility in view",n)});try{qo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-initBookmarkManager-err:${n.toString()}`}).catch(()=>{})}document.getElementById("browserBack")?.addEventListener("click",()=>{const n=Ke();if(n&&n.canGoBack()){n.goBack();return}io()}),document.getElementById("browserForward")?.addEventListener("click",()=>{const n=Ke();n&&n.canGoForward()&&n.goForward()}),document.getElementById("browserReload")?.addEventListener("click",()=>{const n=Ke();n&&n.reload()}),document.getElementById("browserDetach")?.addEventListener("click",An),document.getElementById("browserDetachHeader")?.addEventListener("click",An),So(),so(),Jo(),Ni(),Lo(),po(),co(),uo(),Qi(),Xi(),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode()}window.addEventListener("beforeunload",()=>{if(Qt().catch(()=>{}),qn(),typeof oe<"u"&&Array.isArray(oe)){const e=oe.map(n=>n.id);mt(e,{isTeardown:!0})}});window.addEventListener("teardown-view-system",()=>{console.log("Teardown View System triggered"),Qt().catch(()=>{}),qn();const e=oe.map(t=>t.id);mt(e,{isTeardown:!0});const n=document.getElementById("webviews-container");n&&(n.querySelectorAll(".webcontent-pane").forEach(o=>{try{typeof o.remove=="function"&&o.remove()}catch{}}),n.innerHTML=""),oe=[],We=null,Tt=!1});function Ht(e){if(!e||e.isHome)return!1;const n=String(e.url||"").trim(),t=String(e.launchedAppType||"").trim().toLowerCase();return!n||n==="about:blank"||n==="newtab"||Bt(n)||!/^https?:\/\//i.test(n)?!1:!t||t==="website"}function yo({activateVisibleTab:e=!0}={}){if(!Tt||oe.length===0)return;const n=oe.filter(u=>!u.isHome&&!Ht(u)).map(u=>u.id);if(n.length>0&&mt(n),!e)return;const t=tt();if(t&&Ht(t)){qe(t.id);return}const o=oe.find(u=>Ht(u));if(o){qe(o.id);return}const r=oe.find(u=>u.isHome);if(r){qe(r.id);return}if(oe.length===0){$e();return}qe(oe[0].id)}window.addEventListener("ticket-switch-preserve-view",e=>{yo({activateVisibleTab:e?.detail?.activateVisibleTab!==!1})});async function So(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;const e=JSON.parse(localStorage.getItem(et.installedApps)||"{}");let n=!1;for(const[t,o]of Object.entries(e)){const r=String(o?.type||"").toLowerCase();if(Xt.has(r)&&o?.localPath)try{const u=await window.api.resolveOneviewAppUrl(t,o.localPath);u?.success&&u.url&&o.oneviewUrl!==u.url&&(e[t]={...o,oneviewUrl:u.url},n=!0)}catch{}}n&&localStorage.setItem(et.installedApps,JSON.stringify(e))}window.initViewPage=Kn;window.closeViewTab=Zt;function Eo(){const e=document.getElementById("settingsBtn");e&&e.classList.remove("is-active")}function tn(){return{modal:document.getElementById("extensionPromptModal"),title:document.getElementById("extensionPromptTitle"),message:document.getElementById("extensionPromptMessage"),label:document.getElementById("extensionPromptLabel"),input:document.getElementById("extensionPromptInput"),textarea:document.getElementById("extensionPromptTextarea"),form:document.getElementById("extensionPromptForm"),submitBtn:document.getElementById("extensionPromptSubmitBtn"),cancelBtn:document.getElementById("extensionPromptCancelBtn"),closeBtn:document.getElementById("extensionPromptCloseBtn")}}async function xo(e={}){const n=tn();if(!n.modal||!n.form||!n.input||!n.textarea)return{cancelled:!0,value:""};if(Qe)return{cancelled:!0,value:""};const t=e&&typeof e=="object"?e:{},o=t.multiline===!0,r=t.required!==!1,u=String(t.value||""),v=String(t.title||"Extension Input").trim()||"Extension Input",E=String(t.message||"").trim(),P=String(t.label||"Value").trim()||"Value",k=String(t.submitLabel||"Submit").trim()||"Submit",y=String(t.cancelLabel||"Cancel").trim()||"Cancel",x=String(t.placeholder||"").trim();return n.title.textContent=v,n.message.textContent=E,n.message.classList.toggle("hidden",!E),n.label.textContent=P,n.submitBtn.textContent=k,n.cancelBtn.textContent=y,n.input.classList.toggle("hidden",o),n.textarea.classList.toggle("hidden",!o),n.input.required=!o&&r,n.textarea.required=o&&r,n.input.type=t.password===!0?"password":"text",n.input.placeholder=x,n.textarea.placeholder=x,n.input.value=o?"":u,n.textarea.value=o?u:"",new Promise(L=>{Qe={resolve:L,required:r,multiline:o},lt(()=>{n.modal.classList.remove("hidden"),n.modal.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{(o?n.textarea:n.input).focus(),(o?n.textarea:n.input).select?.()})}).catch(()=>{Qe=null,L({cancelled:!0,value:""})})})}function Mn(e={cancelled:!0,value:""}){const n=tn();if(!n.modal||!Qe)return;const t=Qe;Qe=null,Ze(()=>{n.modal.classList.add("hidden"),n.modal.setAttribute("aria-hidden","true"),n.form.reset(),n.input.classList.remove("hidden"),n.textarea.classList.add("hidden"),n.input.type="text"}),t.resolve(e)}function Co(){return{modal:document.getElementById("profilePromptModal"),select:document.getElementById("profilePromptSelect"),continueBtn:document.getElementById("profilePromptContinueBtn"),cancelBtn:document.getElementById("profilePromptCancelBtn"),closeBtn:document.getElementById("profilePromptCloseBtn")}}let Wt=null;async function Io(e,n="guest"){const t=Co();if(!t.modal||!t.select)return{cancelled:!0,profileId:n};if(Wt)return{cancelled:!0,profileId:n};let o=n;const r=t.select;r.innerHTML=Object.values(re).map(v=>{const E=String(v.name||"P").charAt(0).toUpperCase();return`
        <div class="profile-big-item ${v.id===o?"active":""}" data-id="${v.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${v.color};">
            ${E}
          </div>
          <span class="profile-big-name">${xe(v.name)}</span>
        </div>
      `}).join("");const u=v=>{o=v,r.querySelectorAll(".profile-big-item").forEach(E=>{E.classList.toggle("active",E.dataset.id===v)})};r.querySelectorAll(".profile-big-item").forEach(v=>{const E=()=>{const P=v.dataset.id;!P||!re[P]||u(P)};v.addEventListener("click",E),v.addEventListener("keydown",P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),E())}),v.addEventListener("dblclick",()=>{E(),t.continueBtn?.click()})});try{await lt(()=>{t.modal.classList.remove("hidden"),t.modal.setAttribute("aria-hidden","false")})}catch{return{cancelled:!0,profileId:n}}return new Promise(v=>{Wt={resolve:v};const E=()=>{Ze(()=>{t.modal.classList.add("hidden"),t.modal.setAttribute("aria-hidden","true")}),t.continueBtn?.removeEventListener("click",P),t.cancelBtn?.removeEventListener("click",k),t.closeBtn?.removeEventListener("click",k),t.modal.removeEventListener("click",y),Wt=null},P=()=>{E(),v({cancelled:!1,profileId:o})},k=()=>{E(),v({cancelled:!0,profileId:n})};t.continueBtn?.addEventListener("click",P),t.cancelBtn?.addEventListener("click",k),t.closeBtn?.addEventListener("click",k);const y=x=>{x.target===t.modal&&k()};t.modal.addEventListener("click",y)})}function Lo(){const e=tn();if(!e.modal||e.modal.dataset.boundExtensionPrompt==="1")return;e.modal.dataset.boundExtensionPrompt="1",e.form?.addEventListener("submit",t=>{if(t.preventDefault(),!Qe)return;const o=Qe.multiline?e.textarea:e.input,r=String(o?.value||"");if(Qe.required&&!r.trim()){o?.focus();return}Mn({cancelled:!1,value:r})});const n=()=>Mn({cancelled:!0,value:""});e.cancelBtn?.addEventListener("click",n),e.closeBtn?.addEventListener("click",n),e.modal.addEventListener("click",t=>{t.target===e.modal&&n()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&Qe&&!e.modal.classList.contains("hidden")&&(t.preventDefault(),n())})}function Gn(){return!!tt()?.lockedProfileId}function Et(e=null){const n=e||tt(),t=!!n?.lockedProfileId,o=document.getElementById("profileBtn");if(o){if(o.classList.toggle("locked",t),t){const r=re[n.lockedProfileId]?.name||"assigned";o.title=`Profile locked to ${r} for this tab`}else o.title="Switch Profile";Jn()}}function Jn(){const e=Gn();document.querySelectorAll(".profile-item[data-id]").forEach(t=>{t.classList.toggle("disabled",e),t.setAttribute("aria-disabled",e?"true":"false")})}function nn(e){return en(e)}function ko(e){const n=ii(e);!n||!re[n]||me!==n&&ht(n,{bypassLock:!0})}function on(e,n,t){const o=document.getElementById(e);o&&(o.innerHTML=Object.values(re).map(r=>`
      <div class="profile-pill-item ${r.id===n?"active":""}" data-id="${r.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${r.color};"></span>
        <span>${xe(r.name)}</span>
      </div>
    `).join(""),o.querySelectorAll(".profile-pill-item").forEach(r=>{const u=()=>{const v=r.dataset.id;!v||!re[v]||(o.querySelectorAll(".profile-pill-item").forEach(E=>{E.classList.toggle("active",E.dataset.id===v)}),typeof t=="function"&&t(v))};r.addEventListener("click",u),r.addEventListener("keydown",v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),u())})}))}function ht(e,{bypassLock:n=!1}={}){const t=String(e||"").trim();if(!re[t]){console.warn(`[View] applyProfileSelection: Invalid profile ID "${t}"`);return}if(!n&&Gn()){console.log("[View] applyProfileSelection BLOCKED: active tab is locked");return}console.log(`[View] applyProfileSelection: Switching to ${t}`),me=t,localStorage.setItem(et.currentProfileId,t),li(),document.querySelectorAll(".profile-item").forEach(r=>{r.dataset.id===t?r.classList.add("active"):r.classList.remove("active")})}function Ct(e="",n=""){const t=String(n).toLowerCase(),o=String(e).toLowerCase();let r=o;try{r=decodeURIComponent(o)}catch{r=o}const u=`${t} ${o} ${r}`,v=/\bai\b/.test(t),E=/\b(imagine|empower|production ai|imagine wpp)\b/.test(t),P=u.includes("jira.")||u.includes("jira/")||u.includes("atlassian.net")||u.includes("jira.uhub.biz")||t.includes("jira"),k=t.includes("aem")||t.includes("veeva")||t.includes("gsk")||o.includes("gskinternet.com")||o.includes("gsk-contentlab.veevavault.com")||o.includes("veevavault.com"),y=v||E||o.includes("imagine.wpp.ai")||o.includes("://wpp.ai")||o.includes(".wpp.ai")||u.includes("://wpp.")||u.includes(".wpp.")||u.includes("wpp.com");return P?"vml":k?"gsk":y?"wppproduction":null}function Xn(e,n="",t=""){const o=String(e?.lockedProfileId||"").trim().toLowerCase(),r=Ct(n,t);return o&&Ri(n,t)?o:r}async function Qn(e,n=null,t="New Tab",o={}){const r=String(n||"").trim(),u=r?nn(r):null;if(String(e||"").trim().toLowerCase().startsWith("file://"))return{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:ft(e,re.guest.partition,t,o)};const E=Ct(e,t);if(E&&re[E])return{cancelled:!1,profileId:E,lockedProfileId:E,partition:ft(e,re[E].partition,t,o)};const P=ci(e),k=u&&P.find(y=>y.profileId===u)||P.find(y=>y.profileId===me)||P[0]||null;return k&&re[k.profileId]?{cancelled:!1,profileId:k.profileId,lockedProfileId:k.profileId,partition:ft(e,re[k.profileId].partition,t,o)}:{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:ft(e,re.guest.partition,t,o)}}async function Po(e,n,t,o){const r=Xn(e,n,t);if(e.lockedProfileId=r,!r){We===e.id&&Et(e);return}const u=re[r].partition;if(me!==r&&ht(r,{bypassLock:!0}),e.partition!==u){e.partition=u,o&&!o.isDestroyed?.()&&o.remove();const v=await to(e);We===e.id&&(Et(e),setTimeout(()=>{v.src=n},10));return}We===e.id&&Et(e)}function Zn(){return{wppproduction:[],vml:[],gsk:[],guest:[]}}function ei(e={}){const n=Zn();return Object.keys(n).forEach(t=>{const o=Array.isArray(e?.[t])?e[t]:[];n[t]=o.map(r=>({url:String(r?.url||"").trim(),title:String(r?.title||"Untitled").trim()||"Untitled",visitedAt:r?.visitedAt?Number(r.visitedAt):0})).filter(r=>r.url&&r.url!=="about:blank").slice(0,200)}),n}function ti(){!window.api||typeof window.api.setOneviewSharedStorage!="function"||window.api.setOneviewSharedStorage(Jt,_e).catch(e=>{console.warn("Could not sync profile history to shared storage",e)})}function ni(e=null){if(!e||typeof e!="object")return;_e=ei(e.value||{});try{localStorage.setItem(Gt,JSON.stringify(_e))}catch{}!document.getElementById("historyManagerModal")?.classList.contains("hidden")&&ui()}async function Bo(){if(!(!window.api||typeof window.api.getOneviewSharedStorage!="function"))try{const e=await window.api.getOneviewSharedStorage(Jt);e?.success&&e.entry?ni(e.entry):ti()}catch(e){console.warn("Could not hydrate profile history from shared storage",e)}}function Ao(){try{const e=JSON.parse(localStorage.getItem(Gt)||"{}");_e=ei(e)}catch{_e=Zn()}}function rn(){localStorage.setItem(Gt,JSON.stringify(_e)),ti()}function ii(e){return e&&(e.lockedProfileId||en(e.partition))||me}function oi(e){return e&&(Yn(e.partition)||e.lockedProfileId)||me}function To(e,n,t){if(!_e[e])return;const o=String(n||"").trim();if(!o||o==="about:blank"||o.startsWith("devtools://"))return;const r=String(t||"Untitled").trim()||"Untitled",u=_e[e]||[],v=u.findIndex(P=>P.url===o),E={url:o,title:r,visitedAt:Date.now()};v===0?u[0]=E:(v>0&&u.splice(v,1),u.unshift(E)),_e[e]=u.slice(0,200),rn()}function ri(e){if(!e)return"Unknown Date";try{return new Date(e).toLocaleString()}catch{return""}}function $o(){if(yt!==null)return yt;try{yt=window.api&&typeof window.api.getWebviewPreloadPath=="function"?window.api.getWebviewPreloadPath():""}catch{yt=""}return yt}function _o(e,n={}){const t=String(n?.appType||"").trim().toLowerCase(),o=String(e||"").trim().toLowerCase();return typeof n?.requiresPlatformApi=="boolean"?n.requiresPlatformApi:t&&t!=="website"?!0:t==="website"&&Bt(o)}function Do(e){return e?.getAttribute("data-platform-api-enabled")==="1"}function Mo(e,n){!e||typeof e.setAttribute!="function"||e.setAttribute("data-platform-api-enabled",n?"1":"0")}function Uo(e=""){const n=String(e).trim();if(!n)return"APP";const t=n.split(/\s+/).filter(Boolean);return t.length===1?t[0].slice(0,3).toUpperCase():t.slice(0,3).map(o=>o[0]).join("").toUpperCase()}function No(e=""){const n=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)","linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)","linear-gradient(to right, #4facfe 0%, #00f2fe 100%)","linear-gradient(to top, #30cfd0 0%, #330867 100%)"],t=String(e);let o=0;for(let r=0;r<t.length;r+=1)o=(o+t.charCodeAt(r)*(r+1))%n.length;return n[o]}function Oo(e="app"){let n=document.getElementById("view-launch-loader");n?n.style.display="flex":(n=document.createElement("div"),n.id="view-launch-loader",n.style.cssText=["position:fixed","inset:0","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","background:rgba(15,23,42,0.45)","backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)"].join(";"),n.innerHTML=`
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
    `,document.body.appendChild(n));const t=n.querySelector("p");return t&&(t.textContent=`Opening ${e||"app"}...`),()=>{n&&(n.style.display="none")}}async function Ro(e){if(!e)return;const t=JSON.parse(localStorage.getItem(et.installedApps)||"{}")[e];if(!t){console.warn("Installed app not found:",e);return}const o=t.name||"App",r=Oo(o),u=Ei(t);console.log("[OneView Tracking] View launch decision",{appId:e,appName:t?.name||"",appType:t?.type||"",clickTrackingMode:t?.clickTrackingMode||"",trackOnLaunch:t?.trackOnLaunch,oneviewUrl:t?.oneviewUrl||"",hasLocalPath:!!t?.localPath,shouldTrackLaunch:u}),u&&xi({currentSelectedTicketId:window.currentActiveTicketKey||"",clickedAppName:o});try{if(wn(t)){await Ci(t),Ye(`Opened "${o}" in a separate window.`,"info");return}const v=()=>tt()?.partition||re[me]?.partition||be.guest,E=async(k,y={})=>{await $e(k,v(),o,null,{hideControls:!0,appType:t.type,trackingAppId:e,trackingAppName:o,bypassPrompt:!0,...y})},P=String(t.type||"").toLowerCase();if(Xt.has(P)&&t.localPath){Tn(`Starting ${o}...`);let k=String(t.oneviewUrl||"").trim();if(window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const x=await window.api.resolveOneviewAppUrl(e,t.localPath,"/",v());if(x?.success&&x.url){k=x.url;const L=JSON.parse(localStorage.getItem(et.installedApps)||"{}");L[e]&&(L[e]={...L[e],oneviewUrl:k},localStorage.setItem(et.installedApps,JSON.stringify(L)))}}const y=["nextjs","next","vite-server"].includes(P);if(k&&Bt(k)&&y&&(k=""),k&&Bt(k))await E(k);else{const x=await window.api.launchNextApp(t.localPath,t.type);await E(x)}return}if(t.type==="website"&&t.url){await E(t.url);return}if(t.type==="exe"&&t.localPath){Tn(`Launching ${o}...`);const k=await window.api.launchExe(t.localPath,t.tech);if(k&&k.mode==="embedded"&&k.url){const y=new URLSearchParams;k.token&&y.set("NL_TOKEN",k.token),t.tech&&y.set("TECH",t.tech);const x=String(k.url).split(":")[2];x&&y.set("NL_PORT",x);const L=`${k.url}?${y.toString()}`;await E(L)}else k?.success&&k.mode==="external"?Ye(`Opened "${o}" in a separate window.`,"info"):alert(`${o} launched externally. Embedded view is not available for this app.`);return}alert(`Cannot launch "${o}". Missing supported launch configuration.`)}catch(v){if(wn(t)){console.error("Failed to launch external Electron app from view:",v),Ye(`Failed to launch "${o}".`,"error");return}console.error("Failed to launch installed app from view:",v),alert(`Failed to launch "${o}": ${v.message||v}`)}finally{r()}}async function si(e,n=null,t="New Tab",o=!1,r={}){const u=String(e||"").trim();if(!u)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){const F=be.gsk;window.enterSiteSnapStudioMode();const j=Yt(),ee=(j||[]).some(ce=>{const z=String(ce.url||"").trim();return z&&z!=="about:blank"&&z!=="newtab"});!j||j.length===0||o||ee?await $e(u,F,t,null,r):await xt(u,F,t,null,r);return}let v=o;u.toLowerCase().startsWith("file://")&&(v=!0);const P=await Qn(u,n,t,r);if(!P||P.cancelled)return;const k=P.partition,y=P.profileId,x=P.lockedProfileId;y&&y!==Di()&&ht(y,{bypassLock:!0});const L=Yt();if(!L||L.length===0){await $e(u,k,t,x,r);return}const $=L.some(F=>{const j=String(F.url||"").trim();return j&&j!=="about:blank"&&j!=="newtab"});if(v||$){await $e(u,k,t,x,r);return}let O=tt();if(!O){const F=L[L.length-1];F&&(await qe(F.id),O=F)}if(!O){await $e(u,k,t,x,r);return}await xt(u,k,t,x,r)}window.initViewPage=Kn;window.createTab=$e;window.getTabs=Yt;window.getActiveWebview=Ke;window.launchInstalledAppFromView=Ro;window.openUrlFromDashboard=si;function Fo(){const e=localStorage.getItem(et.currentProfileId);e&&re[e]?me=e:me="guest",li();const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");n&&t&&(n.addEventListener("click",async o=>{o.stopPropagation(),t.classList.contains("hidden")?await lt(()=>t.classList.remove("hidden")):Ze(()=>t.classList.add("hidden"))}),t.innerHTML=Object.values(re).map(o=>`
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
      `),t.querySelectorAll(".profile-item").forEach(o=>{o.addEventListener("click",async()=>{if(o.dataset.action==="manage-passwords"){Kt("passwords"),Ze(()=>t.classList.add("hidden"));return}const r=o.dataset.id;o.classList.contains("disabled")||(ai(r),Ze(()=>t.classList.add("hidden")))})}),Jn())}function ai(e){ht(e)}function li(){const e=re[me],n=document.getElementById("profileBtn"),t=document.getElementById("profileLabel");n&&t&&(t.textContent=e.label,t.style.color=e.color),Et()}function Ho(){const e=document.querySelector(".bookmarks-grid");e&&e.addEventListener("click",n=>{const t=n.target.closest(".bookmark-edit-btn");if(t){n.preventDefault(),n.stopPropagation();const L=t.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;L&&Yo(L);return}const o=n.target.closest(".bookmark-delete-btn");if(o){n.preventDefault(),n.stopPropagation();const L=o.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;L&&(Oe=Oe.filter($=>$.id!==L),di(),sn());return}const r=n.target.closest(".bookmark-card");if(!r||r.id==="addBookmarkBtn"||r.classList.contains("add-bookmark-card"))return;const u=r.dataset.url,v=r.dataset.title||"New Tab",E=String(r.dataset.partition||"").trim(),P=String(r.dataset.sessionScope||"").trim(),y=r.dataset.profileId||nn(r.dataset.partition)||Ct(u||"",v)||me;if(y!==me&&ai(y),u){const x=ft(u,E||re[y].partition,v,P?{sessionScope:P}:{});xt(u,x,v,Ct(u||"",v))}})}function wt(e=""){const n=String(e).trim();return n?/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/^about:/i.test(n)?n:`https://${n}`:""}function _t(e=""){const n=wt(e);if(!n)return"";try{const t=new URL(n),o=t.pathname.length>1?t.pathname.replace(/\/+$/,"")||"/":t.pathname||"/";return`${t.origin}${o}${t.search}${t.hash}`}catch{return n.replace(/\/+$/,"")}}function ci(e=""){const n=_t(e);return n?Oe.filter(t=>_t(t.url)===n):[]}function Wo(e="",n=""){const t=ci(e);return n?t.find(o=>String(o.profileId||"").trim().toLowerCase()===n)||null:t[0]||null}function Vo(e=null){return e?String(e.lockedProfileId||"").trim().toLowerCase()||nn(e.partition)||me||"guest":me||"guest"}function jo(){try{const e=JSON.parse(localStorage.getItem(Hn)||"[]");Oe=Array.isArray(e)?e.map(n=>({id:String(n?.id||""),title:String(n?.title||"").trim(),url:wt(n?.url||""),profileId:re[n?.profileId]?n.profileId:"guest"})).filter(n=>n.id&&n.title&&n.url):[]}catch{Oe=[]}}function di(){localStorage.setItem(Hn,JSON.stringify(Oe))}function zo({id:e="",title:n="",url:t="",profileId:o="guest"}){const r=wt(t),u=String(n||"").trim()||r,v=re[o]?o:"guest",E=_t(r);if(!r||!E)return!1;const P=Oe.findIndex(y=>e&&y.id===e?!0:_t(y.url)===E&&String(y.profileId||"guest")===v),k={id:P>=0?Oe[P].id:e||`bm-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:u,url:r,profileId:v};return P>=0?Oe[P]={...Oe[P],...k}:Oe.unshift(k),P>=0?"updated":"created"}function sn(){const e=document.querySelector(".bookmarks-grid");if(!e)return;e.querySelectorAll(".bookmark-card.custom-bookmark").forEach(o=>o.remove());const n=Oe.map(o=>{const r=re[o.profileId]||re.guest;return`
        <div
          class="bookmark-card custom-bookmark"
          data-bookmark-id="${xe(o.id)}"
          data-url="${xe(o.url)}"
          data-title="${xe(o.title)}"
          data-profile-id="${xe(o.profileId)}"
        >
          <button class="bookmark-edit-btn" type="button" title="Edit Bookmark">E</button>
          <button class="bookmark-delete-btn" type="button" title="Remove Bookmark">X</button>
          <div class="bookmark-icon" style="background:${No(o.title)};">
            <span>${xe(Uo(o.title))}</span>
          </div>
          <div class="bookmark-info">
            <h3>${xe(o.title)}</h3>
            <p>${xe(r.name)} Profile</p>
          </div>
        </div>
      `}).join(""),t=document.getElementById("addBookmarkBtn");t?t.insertAdjacentHTML("beforebegin",n):e.insertAdjacentHTML("beforeend",n)}function qo(){const e=document.getElementById("addBookmarkBtn"),n=document.getElementById("bookmarkCurrentPageHeaderBtn"),t=document.getElementById("bookmarkModal"),o=document.getElementById("bookmarkModalCloseBtn"),r=document.getElementById("bookmarkForm"),u=document.getElementById("bookmarkTitleInput"),v=document.getElementById("bookmarkUrlInput"),E=t?.querySelector(".password-modal-header h3"),P=document.getElementById("bookmarkSaveBtn");if(!e||!t||!o||!r||!u||!v)return;const k=()=>{Ze(()=>{t.classList.add("hidden"),Pt=null})},y=async({editId:$=null,title:O="",url:F="",profileId:j=me,heading:ee="Add Bookmark",saveLabel:ce="Save Bookmark"}={})=>{Pt=$,dt=re[j]?j:me,on("bookmarkProfileSelect",dt,z=>{dt=z}),E&&(E.textContent=ee),P&&(P.textContent=ce),r.reset(),u.value=String(O||""),v.value=String(F||""),await lt(()=>t.classList.remove("hidden")),u.value?(u.focus(),u.select()):u.focus()},x=async()=>{await y()},L=async()=>{const $=tt(),O=wt($?.url||"");if(!$||$.isHome||!O||O==="about:blank"){Ye("Open a website tab first to save it as a bookmark.","error");return}const F=Vo($),j=Wo(O,F);await y({editId:j?.id||null,title:$.title||j?.title||"New Bookmark",url:O,profileId:F,heading:j?"Update Bookmark":"Save Current Site",saveLabel:j?"Update Bookmark":"Save Bookmark"})};e.addEventListener("click",x),e.addEventListener("keydown",async $=>{($.key==="Enter"||$.key===" ")&&($.preventDefault(),await x())}),n?.addEventListener("click",L),n?.addEventListener("keydown",async $=>{($.key==="Enter"||$.key===" ")&&($.preventDefault(),await L())}),o.addEventListener("click",k),t.addEventListener("click",$=>{$.target===t&&k()}),r.addEventListener("submit",$=>{$.preventDefault();const O=String(u.value||"").trim(),F=wt(v.value);if(!O||!F)return;const j=zo({id:Pt,title:O,url:F,profileId:dt||me});j&&(di(),sn(),k(),r.reset(),Ye(j==="updated"?"Bookmark updated successfully.":"Bookmark saved successfully.","success"))})}async function Yo(e){const n=document.getElementById("bookmarkModal"),t=document.getElementById("bookmarkForm"),o=document.getElementById("bookmarkTitleInput"),r=document.getElementById("bookmarkUrlInput"),u=n?.querySelector(".password-modal-header h3"),v=document.getElementById("bookmarkSaveBtn");if(!n||!t||!o||!r)return;const E=Oe.find(P=>P.id===e);E&&(Pt=E.id,dt=E.profileId||me,u&&(u.textContent="Edit Bookmark"),v&&(v.textContent="Update Bookmark"),on("bookmarkProfileSelect",dt,P=>{dt=P}),o.value=E.title||"",r.value=E.url||"",await lt(()=>n.classList.remove("hidden")),o.focus())}function Ko(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;const o=220;n.addEventListener("click",()=>{e.scrollBy({left:-o,behavior:"smooth"})}),t.addEventListener("click",()=>{e.scrollBy({left:o,behavior:"smooth"})}),e.addEventListener("scroll",Dt),Dt()}function ui(){const e=document.getElementById("historyList"),n=document.getElementById("historyProfileSelect");if(!e||!n)return;const t=zt||me,o=_e[t]||[];if(o.length===0){e.innerHTML="<div class='password-meta'>No history for this profile yet.</div>";return}const r=new Date,u=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),v=u-864e5,E={today:[],yesterday:[],older:[]};o.forEach((L,$)=>{const O={...L,originalIndex:$},F=L.visitedAt||0;F>=u?E.today.push(O):F>=v?E.yesterday.push(O):E.older.push(O)});const P=L=>L.toLocaleDateString(void 0,{month:"short",day:"numeric"}),k=`Today - ${P(r)}`,y=`Yesterday - ${P(new Date(v))}`,x=(L,$,O=!1)=>{if($.length===0)return"";const F=$.map(j=>`
      <div class="history-item" data-index="${j.originalIndex}">
        <div class="history-main">
          <div class="history-title">${xe(j.title||"Untitled")}</div>
          <div class="history-url">${xe(j.url||"")}</div>
          <div class="password-meta">${xe(ri(j.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `).join("");return`
      <details class="history-group" ${O?"open":""}>
        <summary class="history-group-title">
          <span>${L}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${$.length}</span>
        </summary>
        <div class="history-group-content">
          ${F}
        </div>
      </details>
    `};e.innerHTML=`
    ${x(k,E.today,E.today.length>0)}
    ${x(y,E.yesterday,!1)}
    ${x("Older",E.older,!1)}
  `,e.querySelectorAll(".history-item").forEach(L=>{L.addEventListener("click",$=>{const O=$.target.closest("button");if(!O)return;const F=Number(L.dataset.index);if(Number.isNaN(F))return;const j=_e[t]||[],ee=j[F];if(ee){if(O.dataset.action==="delete"){j.splice(F,1),_e[t]=j,rn(),ui();return}if(O.dataset.action==="open"){const ce=re[t]?.partition||be.guest;$e(ee.url,ce,ee.title||"History",t)}}})})}async function at({title:e="Clear Page Cache",message:n="",confirmLabel:t="OK",cancelLabel:o="Cancel",hideCancel:r=!1}={}){const u=document.getElementById("cacheActionModal"),v=document.getElementById("cacheActionTitle"),E=document.getElementById("cacheActionMessage"),P=document.getElementById("cacheActionCloseBtn"),k=document.getElementById("cacheActionCancelBtn"),y=document.getElementById("cacheActionConfirmBtn");return!u||!v||!E||!P||!k||!y?Promise.resolve(window.confirm(n||e)):(v.textContent=e,E.textContent=n,y.textContent=t,k.textContent=o,k.style.display=r?"none":"inline-flex",await lt(()=>u.classList.remove("hidden")),new Promise(x=>{const L=()=>{P.removeEventListener("click",$),k.removeEventListener("click",$),y.removeEventListener("click",O),u.removeEventListener("click",F),Ze(()=>u.classList.add("hidden"))},$=()=>{L(),x(!1)},O=()=>{L(),x(!0)},F=j=>{j.target===u&&$()};P.addEventListener("click",$),k.addEventListener("click",$),y.addEventListener("click",O),u.addEventListener("click",F)}))}function Dt(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;if(!(e.scrollWidth>e.clientWidth+1)){n.classList.add("hidden"),t.classList.add("hidden"),e.scrollLeft=0;return}const r=e.scrollLeft<=1,u=e.scrollLeft+e.clientWidth>=e.scrollWidth-1;n.classList.toggle("hidden",r),t.classList.toggle("hidden",u)}function an(e){if(!e)return null;if(typeof e.getWebContentsId=="function")try{const n=e.getWebContentsId();if(n)return n}catch{}return e._webContent?e._webContent.key||e._webContent.id||null:e.key||e.id||e.getAttribute("key")||e.getAttribute("id")||null}async function Go(e,n){const t=oe.findIndex(r=>r.id===n),o=oe[t];if(e==="duplicate-tab"&&o){no(n);return}if(e==="inspect-local-file"&&o){const r=document.getElementById(`webview-${o.id}`),u=an(r);if(!u||!window.api?.toggleWebviewDevTools){Ye(At?"Inspect is not available for this tab.":"Inspect is not available for this local file tab.","error");return}await window.api.toggleWebviewDevTools(u)||Ye(At?"Could not open developer tools.":"Could not open developer tools for this local file.","error");return}if(e==="clear-cache"&&o){const r=document.getElementById(`webview-${o.id}`),u=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",v=r&&r.getAttribute("partition")||o.partition||be.guest;if(!u||u==="about:blank"||!await at({title:"Clear Page Cache",message:`Clear cache and site data for ${u}?`,confirmLabel:"Clear Cache",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewPageCache!="function"){await at({title:"Action Unavailable",message:"Cache clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const P=await window.api.clearWebviewPageCache(v,u);P?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await at({title:"Could Not Clear Cache",message:P?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(P){const k=String(P?.message||P||""),y=/No handler registered for 'clear-webview-page-cache'/.test(k)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await at({title:"Could Not Clear Cache",message:`${k}${y}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-user-data"&&o){const r=document.getElementById(`webview-${o.id}`),u=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",v=r&&r.getAttribute("partition")||o.partition||be.guest;if(!u||u==="about:blank"||!await at({title:"Clear User Data",message:`Clear local storage and site data for ${u}?`,confirmLabel:"Clear Data",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewUserData!="function"){await at({title:"Action Unavailable",message:"User-data clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const P=await window.api.clearWebviewUserData(v,u);P?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await at({title:"Could Not Clear User Data",message:P?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(P){const k=String(P?.message||P||""),y=/No handler registered for 'clear-webview-user-data'/.test(k)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await at({title:"Could Not Clear User Data",message:`${k}${y}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-all"){mt(oe.map(r=>r.id));return}if(e==="clear-right"&&t>=0){mt(oe.slice(t+1).map(r=>r.id));return}e==="clear-left"&&t>=0&&mt(oe.slice(0,t).map(r=>r.id))}function Jo(){const e=document.querySelector(".tabs-header");e&&e.addEventListener("contextmenu",async n=>{if(n.target.closest(".profile-section"))return;n.preventDefault();const r=n.target.closest(".tab")?.id?.replace("tab-ui-","")||We||oe[0]?.id||null;if(!r)return;Fn=r;const u=oe.findIndex(L=>L.id===r),v=oe[u],E=document.getElementById(`webview-${r}`),P=oo(v,E),k=!!(v&&!v.isHome&&(E&&E.getURL()!=="about:blank"||v.url)),y=u>0?u:0,x=u>=0&&u<oe.length-1?oe.length-u-1:0;window.api&&typeof window.api.showNativeTabContextMenu=="function"&&await window.api.showNativeTabContextMenu({anchorId:r,x:Math.round(n.x),y:Math.round(n.y),disabled:{clearLeft:y===0,clearRight:x===0,clearCache:!k,clearUserData:!k,inspectLocalFile:!P}})})}function Vt(e){if(!e)return"";const n=String(e.getData("text/uri-list")||"").split(/\r?\n/).map(u=>u.trim()).find(u=>u&&!u.startsWith("#"));if(n&&/^https?:\/\//i.test(n))return n;const o=String(e.getData("text/html")||"").match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);if(o&&/^https?:\/\//i.test(String(o[1]||"").trim()))return String(o[1]||"").trim();const r=String(e.getData("text/plain")||"").trim();return/^https?:\/\//i.test(r)?r:r&&!/\s/.test(r)&&/\./.test(r)?wt(r):""}function Xo(){const e=document.querySelector(".tabs-header");if(!e||e.dataset.dropBound==="1")return;e.dataset.dropBound="1";const n=t=>{e.classList.toggle("is-drop-target",!!t)};e.addEventListener("dragenter",t=>{Vt(t.dataTransfer)&&(t.preventDefault(),n(!0))}),e.addEventListener("dragover",t=>{Vt(t.dataTransfer)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),n(!0))}),e.addEventListener("dragleave",t=>{e.contains(t.relatedTarget)||n(!1)}),e.addEventListener("drop",t=>{const o=Vt(t.dataTransfer);if(n(!1),!o)return;t.preventDefault();const u=t.target.closest(".tab")?.id?.replace("tab-ui-","")||We,v=oe.findIndex(E=>E.id===u);$e(o,null,"New Tab",null,{insertIndex:v>=0?v+1:oe.length})})}function Qo(e){const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");!n||!t||!n.contains(e.target)&&!t.contains(e.target)&&!t.classList.contains("hidden")&&Ze(()=>t.classList.add("hidden"))}async function Zo(e){const n=String(e?.action||"");if(!n||n==="__menu_closed__")return;const t=String(e?.anchorId||Fn||We||oe[0]?.id||"");t&&await Go(n,t)}const Un={desktop:{width:1920,height:1080,userAgent:"desktop"},mobile:{width:414,height:896,userAgent:"mobile"},tablet:{width:768,height:1024,userAgent:"tablet"}};async function pi(e,n="mobile"){if(!e)throw new Error("No active webview");const t=Un[n]||Un.mobile;if(console.log(`[Viewport] Setting ${n} viewport: ${t.width}x${t.height}`),window.api?.setWebviewBounds){const o=an(e);o&&(console.log(`[Viewport] Triggering native resize to ${t.width}x${t.height} for id: ${o}`),await window.api.setWebviewBounds(o,{width:t.width,height:t.height}))}return window.__oneview_original_webview_dims||(window.__oneview_original_webview_dims={width:e.style.width,height:e.style.height,minWidth:e.style.minWidth,minHeight:e.style.minHeight,maxWidth:e.style.maxWidth,maxHeight:e.style.maxHeight,flex:e.style.flex}),e.style.width=t.width+"px",e.style.height=t.height+"px",e.style.minWidth=t.width+"px",e.style.minHeight=t.height+"px",e.style.maxWidth=t.width+"px",e.style.maxHeight=t.height+"px",e.style.flex="none",console.log(`[Viewport] Resized webview element to ${t.width}x${t.height}`),await e.executeJavaScript(`
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
    `,!0),await new Promise(n=>setTimeout(n,500))}async function tr(e={}){const n=Ke();if(!n||typeof n.executeJavaScript!="function")throw new Error("Active tab is unavailable");if(typeof n.capturePage!="function")throw new Error("Active tab does not support capture");const t=String(e?.viewport||"desktop").trim().toLowerCase();if(console.log("[Capture] Active webview found",{id:n.id,url:n.getURL?.(),title:n.getTitle?.(),viewport:t,loading:n._webContent?.state?.loading}),t==="mobile"||t==="tablet"){const z=t==="tablet"?"tablet":"mobile";await pi(n,z),console.log("[Capture] Viewport changed to "+z+", waiting for page reflow..."),await new Promise(se=>setTimeout(se,300))}const o=5e3,r=Date.now();for(;n._webContent?.state?.loading&&Date.now()-r<o;)console.log("[Capture] Waiting for page to load..."),await new Promise(z=>setTimeout(z,200));console.log("[Capture] Page load status:",n._webContent?.state?.loading?"still loading":"loaded");const u=String(e?.mode||"visible").trim().toLowerCase();if(u!=="full"&&u!=="fullpage"){const z=await n.capturePage(),se=z?.isEmpty?.()?"":z.toDataURL();return console.log("[CapturePage] Visible captured. DataUrl length:",se?.length||0),{mode:"visible",dataUrl:se,width:z?.getSize?.()?.width||0,height:z?.getSize?.()?.height||0}}const v=await n.executeJavaScript(`
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
    `,!0);Math.max(1,Number(v?.totalWidth||0));let E=Math.max(1,Number(v?.totalHeight||0));Math.max(1,Number(v?.viewportWidth||0));let P=Math.max(1,Number(v?.viewportHeight||0));if(console.log("[FullCapture] Starting capture process..."),console.log("[FullCapture] Initial metrics:",v),await n.executeJavaScript(`
    (() => {
      const style = document.createElement('style');
      style.id = '__oneview_force_auto_scroll__';
      style.textContent = 'html, body, * { scroll-behavior: auto !important; }';
      (document.head || document.documentElement).appendChild(style);
    })();
  `,!0).catch(()=>{}),E>P+100){console.log("[FullCapture] Verifying scroll functionality...");const se=await n.executeJavaScript(`
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
    `,!0).catch(()=>null);console.log("[FullCapture] Verification scroll results:",se);const Ce=Number(se?.startY||0),Ie=Number(se?.endY||0);if(Ie-Ce<10)throw new Error("Scroll verification failed: page did not scroll (startY="+Ce+", endY="+Ie+"). Capture aborted to prevent repeating/empty fallback images.");await n.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `,!0).catch(()=>{})}const k=Math.floor(P*.8),y=Math.ceil(E/k);console.log("[FullCapture] Progressive scroll: "+y+" steps, "+k+"px per step");let x=0;for(let z=0;z<y;z++){x=Math.min(x+k,E),console.log(`[FullCapture] Scrolling host-driven to ${x}px (${z+1}/${y})`);const se=`
      (() => {
        const targetY = ${x};
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
    `;await n.executeJavaScript(se,!0).catch(()=>{}),await new Promise(Ce=>setTimeout(Ce,600))}await n.executeJavaScript(`window.scrollTo({ top: ${E}, left: 0, behavior: 'auto' });`,!0).catch(()=>{}),await new Promise(z=>setTimeout(z,800)),await n.executeJavaScript(`
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
  `;await n.executeJavaScript(L,!0).catch(()=>{});let $=0,O=!1;for(;!O&&$<50;)await n.executeJavaScript("(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)",!0).catch(()=>0)<=5?O=!0:(await n.executeJavaScript(L,!0).catch(()=>{}),await new Promise(se=>setTimeout(se,100)),$++);await n.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");const F=Number(e?.wait||0)*1e3,j=200+F;console.log(`[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${j}ms (Base 0.2s + User ${F}ms) for page to settle live...`),await new Promise(z=>setTimeout(z,j));let ee="",ce=null;try{console.log("[FullCapture] Calling native one-shot capture..."),ce=await n.capturePage({mode:"full",scrollHeight:Math.round(E)}),ee=ce?.isEmpty?.()?"":ce.toDataURL()}finally{console.log("[FullCapture] Restoring original body and globals..."),await n.executeJavaScript(`
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
      `,!0).catch(()=>{})}if(!ee)throw new Error("Full page capture returned empty image data");return{mode:"full",dataUrl:ee,width:ce?.getSize?.()?.width||0,height:ce?.getSize?.()?.height||0,tileCount:1}}async function nr(e){const n=String(e?.command||"").trim(),t=String(e?.url||"").trim(),o=String(e?.requestId||"").trim();if(!n)return;if(n==="execute-script"){const y=String(e?.source||"");let x={requestId:o,success:!1,message:"No active tab"};try{const L=Ke();if(!L||typeof L.executeJavaScript!="function")x={requestId:o,success:!1,message:"Active tab is unavailable"};else{const $=`
          (() => {
            const run = () => {
              ${y}
            };
            return run();
          })();
        `,O=await L.executeJavaScript($,!0);x={requestId:o,success:!0,result:O}}}catch(L){x={requestId:o,success:!1,message:L?.message||String(L)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(x);return}if(n==="ui-prompt"){let y={requestId:o,success:!1,message:"Prompt request failed"};try{const x=await xo(e?.prompt||{});y={requestId:o,success:!0,result:x}}catch(x){y={requestId:o,success:!1,message:x?.message||String(x)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(y);return}if(n==="capture-page"){let y={requestId:o,success:!1,message:"Capture request failed",key:e?.key||"view:extension-popup"};try{const x=String(e?.options?.mode||"visible").trim().toLowerCase(),L=String(e?.options?.viewport||"desktop").trim().toLowerCase(),$=Number(e?.options?.wait||0);if(console.log("[View] Capturing mode:",x,"viewport:",L,"wait:",$),x==="full"||x==="fullpage"){console.log("[View] Using full-page capture function");const O=await tr({mode:x,viewport:L,wait:$});y={requestId:o,success:!0,result:O,key:e?.key||"view:extension-popup"}}else{const O=Ke();if(!O||typeof O.capturePage!="function")throw new Error("Active tab does not support capture");if(console.log("[View] Capturing visible area from webview id:",O.id),L==="mobile"||L==="tablet"){const ce=L==="tablet"?"tablet":"mobile";await pi(O,ce),console.log("[View] Viewport changed to "+ce+", waiting for page reflow..."),await new Promise(z=>setTimeout(z,800))}const F=await O.capturePage(),j=F?.isEmpty?.()?"":F.toDataURL?.();console.log("[View] Visible capture dataUrl length:",j?.length||0);const ee={mode:"visible",dataUrl:j,width:F?.getSize?.()?.width||0,height:F?.getSize?.()?.height||0};(L==="mobile"||L==="tablet")&&await fi(O),y={requestId:o,success:!0,result:ee,key:e?.key||"view:extension-popup"}}}catch(x){console.error("[View] Capture error:",x),y={requestId:o,success:!1,message:x?.message||String(x),key:e?.key||"view:extension-popup"}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(y);return}if(n==="tabs-create"){const y=String(e.url||"").trim(),x=e.requestId;let L=e.partition||null;if(!L&&y.startsWith(`${Ii}://`))try{L=`ext-${new URL(y).host}`}catch{}const $=L?gt(L):"",O=oe.find(F=>F.url&&F.url.includes("result.html")&&(!$||gt(F.partition||"")===$));O?(console.log("[View] Reusing existing result tab:",O.id),await ro(O.id,y,L,"Result"),e.active!==!1&&await qe(O.id)):await $e(y,L,"Result",null,{active:e.active!==!1,extensionEntryPath:e.entryPath}),x&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:x,success:!0});return}if(n==="tabs-close"){let y={requestId:o,success:!1,message:"Tab not found"};try{const x=String(e?.tabId||"").trim();oe.find($=>$.id===x)?(Zt(x),y={requestId:o,success:!0,result:{id:x,closed:!0}}):y={requestId:o,success:!1,message:"Tab not found"}}catch(x){y={requestId:o,success:!1,message:x?.message||String(x)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(y);return}if(!t)return;const r=tt(),u=Ke(),v=r?.partition||re[me]?.partition||be.guest,E=/^file:\/\//i.test(t),P={extensionEntryPath:E?String(e?.entryPath||"").trim():"",extensionActiveContext:{url:String(u?.getURL?.()||r?.url||"").trim(),title:String(u?.getTitle?.()||r?.title||"").trim()},active:e?.active!==!1};if(E){const y=oe.find(x=>x.url===t);if(y){await qe(y.id),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:y.id,url:t,title:y.title||"New Tab",active:!0}});return}}if(n==="tabs-update"&&r&&!r.isHome&&!r.nativePage){await xt(t,v,"New Tab",null,P),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:r.id,url:t,title:r.title||"New Tab",active:!0}});return}r?.id;const k=$e(t,v,"New Tab",null,P);o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:k?.id||"",url:t,title:k?.title||"New Tab",active:e?.active!==!1}})}function ir(){Pn||(Pn=!0,document.addEventListener("click",Qo),document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const n=String(e.key||"").toLowerCase();if(!(!(e.key==="Tab"||e.key==="PageUp"||e.key==="PageDown")&&fo(e.target))){if(n==="h"&&!e.shiftKey){e.preventDefault(),Kt("history");return}if(n==="d"&&e.shiftKey){e.preventDefault(),Kt("downloads");return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation(),kt(e.shiftKey?-1:1);return}if(e.key==="PageUp"){e.preventDefault(),e.stopPropagation(),kt(-1);return}e.key==="PageDown"&&(e.preventDefault(),e.stopPropagation(),kt(1))}},!0),window.addEventListener("resize",Dt),Xo(),window.api&&typeof window.api.onViewTabShortcut=="function"&&window.api.onViewTabShortcut(e=>{const n=Number(e?.direction||0);n&&kt(n<0?-1:1)}),window.api&&typeof window.api.onBrowserExtensionsUpdated=="function"&&window.api.onBrowserExtensionsUpdated(()=>{console.log("Browser extensions updated, refreshing UI..."),zn().catch(()=>{})}),window.api&&typeof window.api.onNativeTabContextAction=="function"&&window.api.onNativeTabContextAction(e=>{Zo(e).catch(()=>{})}),window.api&&typeof window.api.onBrowserExtensionCommand=="function"&&window.api.onBrowserExtensionCommand(e=>{nr(e).catch(n=>{console.error("Browser extension command failed",n)})}))}let jt,Nn;const On=new ResizeObserver(()=>{const e=Ke();!e||typeof e.syncBounds!="function"||(e.syncBounds(!0),clearInterval(jt),clearTimeout(Nn),jt=setInterval(()=>{const n=Ke();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},50),Nn=setTimeout(()=>{clearInterval(jt);const n=Ke();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},350))});(function(){const n=document.getElementById("webviews-container");if(n){On.observe(n);return}const t=new MutationObserver(()=>{const o=document.getElementById("webviews-container");o&&(t.disconnect(),On.observe(o))});t.observe(document.documentElement,{childList:!0,subtree:!0})})();window.enterSiteSnapStudioMode=function(){document.body.classList.add("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.add("sitesnap-studio-mode");try{window.parent.document.body.classList.add("sitesnap-studio-active")}catch(n){console.error("Failed to set parent active layout",n)}};window.exitSiteSnapStudioMode=function(){document.body.classList.remove("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.remove("sitesnap-studio-mode");try{window.parent.document.body.classList.remove("sitesnap-studio-active")}catch(n){console.error("Failed to remove parent active layout",n)}};
