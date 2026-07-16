import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{o as st,c as Qe,e as Ie}from"./utils-xPDMCTXC.js";import{s as ze}from"./notifications-CBkElf_0.js";import{i as dn,l as Si}from"./external-exe-DRsy67iY.js";import{c as un,i as Ei,s as xi,t as Ci}from"./webcontent-client-DJU5VCvB.js";import{n as ft,R as Mn,i as It,c as Ii,I as Lt}from"./app-env-Dw5Rxq_p.js";import{S as Ze,P as be}from"./app-runtime-CuOCpSBc.js";function Li({state:e,constants:n,escapeHtml:t,showToast:o,isPerfEnabled:r,formatDownloadBytes:u,formatDownloadSpeed:h,formatDownloadEta:C,formatHistoryTime:P,loadManagedDownloadsFromMain:k,refreshExtensionsManagerList:b,saveProfileHistoryStore:I,getActiveTab:L,updateTabTitle:A,createTab:N,switchTab:F,navigateTo:j}){const{PROFILES:Q,PARTITIONS:de,IS_DEV_APP_BUILD:q}=n;function se(m=""){const $=String(m||"").trim().toLowerCase();return["downloads","history","extensions","passwords"].includes($)?$:"extensions"}function ye(m="extensions"){const $=se(m);return $==="downloads"?"Downloads":$==="history"?"History":$==="passwords"?"Passwords":"Extensions"}function Le(m="extensions"){const $=se(m);return $==="downloads"?"Ctrl+Shift+D":$==="history"?"Ctrl+H":$==="extensions"?"Ctrl+E":""}function nt(m){const $=m instanceof Element?m:null;return $?$.closest("input, textarea, select")?!0:$.isContentEditable===!0:!1}function Me(m="settings",$="extensions"){return{type:String(m||"settings").trim().toLowerCase(),section:se($)}}function ne(m="extensions"){const $=se(m);return e.tabs.find(E=>E?.nativePage?.type==="settings"&&se(E?.nativePage?.section)===$)||null}function ue(m){return m?.nativePage?.type==="settings"}async function qe(){if(!window.api)return e.nativeSettingsGeneralInfo;try{if(!e.nativeSettingsGeneralInfo.version&&window.api.getAppVersion&&(e.nativeSettingsGeneralInfo.version=await window.api.getAppVersion()),!e.nativeSettingsGeneralInfo.defaultOpenStatus&&window.api.getDefaultOpenHandlingStatus){const m=await window.api.getDefaultOpenHandlingStatus();e.nativeSettingsGeneralInfo.defaultOpenStatus=m?.isDefault||m?.success?"Configured":"Needs setup"}}catch{}return e.nativeSettingsGeneralInfo}function ke(){return Object.entries(e.profileHistoryCache||{}).flatMap(([m,$])=>(Array.isArray($)?$:[]).map(E=>({profileId:m,profileName:Q[m]?.name||m||"Unknown",url:String(E?.url||"").trim(),title:String(E?.title||"Untitled").trim()||"Untitled",visitedAt:E?.visitedAt?Number(E.visitedAt):0}))).filter(m=>m.url&&m.visitedAt).sort((m,$)=>Number($.visitedAt||0)-Number(m.visitedAt||0))}function xe(m){const $=new Date(Number(m||0));if(Number.isNaN($.getTime()))return"Unknown Date";const E=new Date,B=new Date(E.getFullYear(),E.getMonth(),E.getDate()).getTime(),D=new Date($.getFullYear(),$.getMonth(),$.getDate()).getTime(),Y=B-1440*60*1e3;return D===B?"Today":D===Y?"Yesterday":$.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function Pe(m=[]){const $=[],E=new Map;return m.forEach(B=>{const D=xe(B.visitedAt);if(!E.has(D)){const Y={key:`${D}-${B.visitedAt}`,label:D,entries:[]};E.set(D,Y),$.push(Y)}E.get(D).entries.push(B)}),$}function Ye(){return e.managedDownloadsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.managedDownloadsCache.map(m=>{const $=m.totalBytes?Math.max(0,Math.min(100,Math.round(m.receivedBytes/m.totalBytes*100))):m.state==="completed"?100:0,E=m.totalBytes?`${u(m.receivedBytes)} / ${u(m.totalBytes)}`:u(m.receivedBytes),B=m.state==="progressing"?`${h(m.bytesPerSecond)} - ${C(m.etaSeconds)}`:m.state==="completed"?`Saved to ${t(m.savePath||"")}`:t(String(m.state||"Unknown"));return`
              <article class="native-settings-row native-settings-download-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(m.fileName||"Download")}</div>
                    <div class="native-settings-row-note">${t(E)}</div>
                    <div class="native-settings-row-note">${B}</div>
                  </div>
                  <div class="native-settings-inline-actions">
                    ${m.state==="progressing"?`<button class="native-settings-action" type="button" data-native-download-action="${m.isPaused?"resume":"pause"}" data-download-id="${t(m.id)}">${m.isPaused?"Resume":"Pause"}</button>`:""}
                    ${m.state==="progressing"?`<button class="native-settings-action" type="button" data-native-download-action="cancel" data-download-id="${t(m.id)}">Cancel</button>`:""}
                    ${m.state!=="progressing"?`<button class="native-settings-action" type="button" data-native-download-action="show" data-download-id="${t(m.id)}">Show</button>`:""}
                    ${m.state==="completed"?`<button class="native-settings-action" type="button" data-native-download-action="open" data-download-id="${t(m.id)}">Open</button>`:""}
                    ${m.state==="interrupted"||m.state==="cancelled"?`<button class="native-settings-action" type="button" data-native-download-action="retry" data-download-id="${t(m.id)}">Retry</button>`:""}
                    <button class="native-settings-action" type="button" data-native-download-action="remove" data-download-id="${t(m.id)}">Remove</button>
                  </div>
                </div>
                <div class="native-settings-progress"><span style="width:${$}%"></span></div>
              </article>
            `}).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No downloads yet.</div>'}function Fe(){const m=e.historySearchQuery.trim().toLowerCase(),$=ke().filter(B=>m?`${B.title||""} ${B.url||""} ${B.profileName||""}`.toLowerCase().includes(m):!0);return $.length?`
      <div class="native-history-flat-list">
        ${Pe($).map(B=>`
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${t(B.label)}</span>
                </div>
                ${B.entries.map(D=>`
                      <article class="native-history-entry">
                        <div class="native-history-entry-content">
                          <div class="native-history-entry-title">${t(D.title||"Untitled")}</div>
                          <div class="native-history-entry-url">${t(D.url||"")}</div>
                          <div class="native-history-entry-meta">${t(D.profileName)} • ${t(P(D.visitedAt))}</div>
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
    `:`<div class="native-settings-empty">${m?"No history matches your search.":"No history yet."}</div>`}function Ue(){return e.browserExtensionsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.browserExtensionsCache.map(m=>`
              <article class="native-settings-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(m.name||"Unnamed Extension")}</div>
                    <div class="native-settings-row-note">${t(m.id||m.path||"")}</div>
                    ${q?`<div class="native-settings-row-note">${t(m.path||"")}</div>`:""}
                  </div>
                  <div class="native-settings-inline-actions">
                    <button class="native-settings-action" type="button" data-native-extension-action="more" data-extension-path="${t(m.path||"")}">More</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="${m.enabled===!1?"enable":"disable"}" data-extension-path="${t(m.path||"")}">${m.enabled===!1?"Enable":"Disable"}</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="reload" data-extension-path="${t(m.path||"")}">Reload</button>
                    ${q?`<button class="native-settings-action" type="button" data-native-extension-action="remove" data-extension-path="${t(m.path||"")}">Remove</button>`:""}
                  </div>
                </div>
              </article>
            `).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No extensions installed yet.</div>'}function He(){const m=e.credentialCache||{},$=[];return Object.entries(m).forEach(([B,D])=>{(D||[]).forEach((Y,ee)=>{$.push({key:`${B}:${ee}`,profileId:B,domain:String(Y.domain||"").toLowerCase(),username:String(Y.username||""),password:String(Y.password||"")})})}),`
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
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${Object.entries(Q).map(([B,D])=>`
        <label class="profile-pill-item" style="cursor: pointer;" data-profile-id="${t(B)}">
          <input type="radio" name="nativePasswordProfile" value="${t(B)}" ${B===(e.passwordProfileId||e.currentProfileId||"guest")?"checked":""} style="cursor: pointer;" />
          <span class="profile-pill-dot" style="background-color: ${t(D.color||"#000")}"></span>
          <span>${t(D.name||"")}</span>
        </label>
      `).join("")}</div>
          </div>
          <button type="submit" class="native-settings-action" style="grid-column: 1 / -1; background: #3b82f6; color: white; font-weight: 600; padding: 10px 14px;">Save Credential</button>
        </form>
 
        <div class="native-settings-section-head" style="margin-top: 24px;">
          <h3>Saved Passwords</h3>
          <p>${$.length} credential${$.length!==1?"s":""} stored</p>
        </div>
        
        ${$.length===0?'<div class="native-settings-empty">No saved credentials yet. Add one above.</div>':`<div class="password-list">
              ${$.map(B=>`
                <div class="password-item" data-key="${t(B.key)}">
                  <div><strong>${t(B.domain)}</strong><div class="password-meta">${t(B.profileId)}</div></div>
                  <div>${t(B.username)}</div>
                  <div class="password-secret-container" style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <span class="password-secret" data-password="${t(B.password)}" style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; word-break: break-all;">••••••••</span>
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
    `}async function Ge(){if(window.api?.listProfileCredentials)try{const m=await window.api.listProfileCredentials();if(m&&Array.isArray(m.data)){const $={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};m.data.forEach(E=>{const B=String(E.profileId||"").toLowerCase();$[B]||($[B]=[]),$[B].push(E)}),e.credentialCache=$}}catch(m){console.error("loadCredentialsIntoCache error:",m)}}function he(m){const $=document.getElementById("nativeTabContent");if(!$||!ue(m))return;const E=se(m.nativePage?.section);let B="",D="";const Y=ye(E);let ee="Manage app behavior without leaving the browser shell.";if(E==="downloads"){const X=e.managedDownloadsCache.length,re=e.managedDownloadsCache.filter(te=>te.state==="progressing").length;B=Ye(),ee=`${re} active, ${X} total downloads.`}else if(E==="history"){const X=ke(),re=e.historySearchQuery.trim()?X.filter(te=>`${te.title||""} ${te.url||""} ${te.profileName||""}`.toLowerCase().includes(e.historySearchQuery.trim().toLowerCase())).length:X.length;D=`
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
      `,B=Fe(),ee=`${re} total history entries across all profiles.`}else if(E==="extensions"){const X=e.browserExtensionsCache.filter(re=>re.enabled!==!1).length;D=`
        <div class="native-settings-toolbar">
          ${q?'<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>':""}
        </div>
      `,B=Ue(),ee=`${X} enabled out of ${e.browserExtensionsCache.length} extensions.`}else E==="passwords"?(B=He(),ee="Manage saved passwords securely.",e._credentialsLoaded||(e._credentialsLoaded=!0,Ge().then(()=>{he(m)}))):e._credentialsLoaded=!1;$.innerHTML=`
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${t(Y)}</h2>
                <p>${t(ee)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions","history","downloads","passwords"].map(X=>{const re=Le(X);return`
                    <button
                      type="button"
                      class="native-settings-chip ${X===E?"is-active":""}"
                      data-native-settings-nav="${X}"
                      title="${t(ye(X))}${re?` (${re})`:""}"
                    >
                      <span>${t(ye(X))}</span>
                      ${re?`<span class="native-settings-chip-shortcut">${t(re)}</span>`:""}
                    </button>
                  `}).join("")}
            </div>
            ${D}
          </div>
          <div class="native-settings-body">
            ${B}
          </div>
        </section>
      </div>
    `}async function Ee(){const m=L();ue(m)&&he(m)}function Ne(m="extensions",$=e.activeTabId){const E=e.tabs.find(D=>D.id===$);if(!ue(E))return;const B=se(m);E.nativePage.section=B,A(E.id,ye(B)),E.id===e.activeTabId&&he(E)}function Te(m="extensions"){const $=ne(m);if($){F($.id);return}N(null,null,ye(m),null,{nativePage:Me("settings",m)})}function Ke(){const m=document.getElementById("settingsBtn");m&&m.dataset.boundClick!=="1"&&(m.dataset.boundClick="1",m.addEventListener("click",()=>{Te("extensions")}))}function ot(){const m=document.getElementById("nativeTabContent");if(!m||m.dataset.boundNativeSettings==="1")return;m.dataset.boundNativeSettings="1",window.addEventListener("credentials-updated",()=>{e._credentialsLoaded=!1;const E=L();ue(E)&&E.nativePage?.section==="passwords"&&Ge().then(()=>{he(E)})});const $=(E=null,B=null)=>{requestAnimationFrame(()=>{const D=document.getElementById("nativeHistorySearchInput");if(D&&(D.focus({preventScroll:!0}),Number.isInteger(E)&&Number.isInteger(B)&&typeof D.setSelectionRange=="function"))try{D.setSelectionRange(E,B)}catch{}})};m.addEventListener("click",async E=>{const B=E.target.closest(".password-visibility-toggle");if(B){E.preventDefault();const c=document.getElementById("nativePasswordSecretInput");if(c){const p=c.type==="password";c.type=p?"text":"password",B.innerHTML=p?`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          `:`
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          `}return}const D=E.target.closest(".password-list-toggle-eye");if(D){E.preventDefault();const c=D.parentNode.querySelector(".password-secret");if(c){const p=c.dataset.password||"";c.textContent==="••••••••"?(c.textContent=p,D.innerHTML=`
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            `):(c.textContent="••••••••",D.innerHTML=`
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            `)}return}const Y=E.target.closest("[data-native-settings-nav]");if(Y){Ne(Y.dataset.nativeSettingsNav||"extensions");return}const ee=E.target.closest("[data-native-settings-action]");if(ee){const c=String(ee.dataset.nativeSettingsAction||"").trim();try{c==="check-updates"&&window.api?.checkForUpdates?(await window.api.checkForUpdates(),o("Update check started.","success")):c==="open-default-apps"&&window.api?.openDefaultAppSettings?await window.api.openDefaultAppSettings():c==="load-unpacked-extension"&&window.api?.addBrowserExtensionsUnpacked?(await window.api.addBrowserExtensionsUnpacked(),await b(),await Ee(),o("Unpacked extensions loaded.","success")):c==="clear-history"&&(Object.keys(e.profileHistoryCache||{}).forEach(p=>{e.profileHistoryCache[p]=[]}),I(),he(L()))}catch(p){o(p?.message||"Could not complete settings action.","error")}return}const X=E.target.closest("[data-native-download-action]");if(X){try{const c=await window.api?.runManagedDownloadAction?.({id:String(X.dataset.downloadId||"").trim(),action:String(X.dataset.nativeDownloadAction||"").trim()});Array.isArray(c?.downloads)?e.managedDownloadsCache=c.downloads:await k(),await Ee()}catch(c){o(c?.message||"Could not complete download action.","error")}return}const re=E.target.closest("[data-native-history-action]");if(re){const c=String(re.dataset.profileId||e.historyProfileId||e.currentProfileId),p=String(re.dataset.historyTime||""),x=(e.profileHistoryCache[c]||[]).findIndex(U=>String(U.visitedAt||"")===p),y=x>=0?(e.profileHistoryCache[c]||[])[x]:null;if(!y)return;if(re.dataset.nativeHistoryAction==="delete")e.profileHistoryCache[c].splice(x,1),I(),e.historyProfileId=c,he(L());else{const U=Q[c]?.partition||de.guest;N(y.url,U,y.title||"History",c)}return}const te=E.target.closest("[data-native-extension-action]");if(te){const c=String(te.dataset.nativeExtensionAction||"").trim(),p=String(te.dataset.extensionPath||"").trim();try{c==="more"&&window.api?.getExtensionShortcutsInfo?await ve(p):c==="reload"&&window.api?.reloadBrowserExtension?(await window.api.reloadBrowserExtension({path:p}),o("Extension reloaded.","success")):(c==="enable"||c==="disable")&&window.api?.toggleBrowserExtension?(c==="disable"&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.toggleBrowserExtension({path:p,enabled:c==="enable"})):c==="remove"&&window.api?.removeBrowserExtension&&(typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.removeBrowserExtension({path:p})),await b(),await Ee()}catch(x){o(x?.message||"Could not complete extension action.","error")}}}),m.addEventListener("input",E=>{const B=E.target.closest("#nativeHistorySearchInput");if(B){const Y=Number.isInteger(B.selectionStart)?B.selectionStart:null,ee=Number.isInteger(B.selectionEnd)?B.selectionEnd:Y;e.historySearchQuery=String(B.value||""),he(L()),$(Y,ee);return}const D=E.target.closest("input[name='nativePasswordProfile']");if(D){e.passwordProfileId=String(D.value||"");return}}),m.addEventListener("submit",async E=>{const B=E.target.closest("#nativePasswordForm");if(!B)return;E.preventDefault();const D=document.getElementById("nativePasswordDomainInput"),Y=document.getElementById("nativePasswordUsernameInput"),ee=document.getElementById("nativePasswordSecretInput");if(!D||!Y||!ee)return;const X=String(D.value||"").trim().toLowerCase(),re=String(Y.value||"").trim(),te=String(ee.value||""),c=e.passwordProfileId||e.currentProfileId||"guest";if(!X||!re||!te){o("Please fill in all fields.","error");return}try{if(!window.api?.saveProfileCredential){o("Credential API unavailable.","error");return}const p=await window.api.saveProfileCredential({profileId:c,domain:X,username:re,password:te});if(!p||!p.success){o("Failed to save credential.","error");return}await Ge(),o("Credential saved successfully.","success"),B.reset(),he(L())}catch(p){o(p?.message||"Could not save credential.","error")}}),m.addEventListener("click",async E=>{const B=E.target.closest(".password-action-btn");if(!B)return;const D=String(B.dataset.action||"").trim(),Y=B.closest(".password-item"),ee=String(Y?.dataset.key||""),[X,re]=ee.split(":"),te=Number(re);if(!X||Number.isNaN(te))return;const p=((e.credentialCache||{})[X]||[])[te];if(p)try{if(D==="delete"){if(!window.api?.deleteProfileCredential){o("Credential API unavailable.","error");return}const x=await window.api.deleteProfileCredential({profileId:X,domain:String(p.domain||"").toLowerCase(),username:String(p.username||"")});if(!x||!x.success){o("Failed to delete credential.","error");return}await Ge(),o("Credential deleted successfully.","success"),he(L())}else if(D==="edit"){const x=document.getElementById("nativePasswordDomainInput"),y=document.getElementById("nativePasswordUsernameInput"),U=document.getElementById("nativePasswordSecretInput"),R=document.getElementById("nativePasswordProfileSelect");if(!x||!y||!U)return;e.passwordProfileId=X,x.value=String(p.domain||"").toLowerCase(),y.value=String(p.username||""),U.value=String(p.password||""),R&&(R.innerHTML=Object.entries(Q||{}).map(([a,f])=>`
                <label class="profile-pill-item ${a===X?"active":""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${t(a)}" ${a===X?"checked":""} style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${t(f.color||"#000")}"></span>
                  <span>${t(f.name||"")}</span>
                </label>
              `).join(""),R.addEventListener("change",a=>{const f=a.target.value;f&&(e.passwordProfileId=f)})),document.getElementById("nativePasswordForm")?.scrollIntoView({behavior:"smooth"}),x.focus()}}catch(x){o(x?.message||"Could not complete password action.","error")}})}function it(){document.addEventListener("keydown",m=>{nt(m.target)||m.ctrlKey&&((m.key==="H"||m.key==="h")&&!m.shiftKey?(m.preventDefault(),Te("history")):(m.key==="E"||m.key==="e")&&!m.shiftKey?(m.preventDefault(),Te("extensions")):(m.key==="D"||m.key==="d")&&m.shiftKey&&(m.preventDefault(),Te("downloads")))})}async function ve(m=""){const $=document.getElementById("extensionDetailsModal"),E=document.getElementById("extensionDetailsCloseBtn"),B=document.getElementById("extensionDetailsContent"),D=document.getElementById("extensionDetailsTitle");if(!(!$||!B))try{const Y=await window.api?.getExtensionShortcutsInfo?.({path:m});if(!Y?.success)B.innerHTML='<div class="extension-details-empty">Unable to load extension details.</div>';else{const{name:ee,shortcuts:X,errors:re,conflicts:te}=Y;D.textContent=`${t(ee||"Extension")} Details`;let c="";X&&X.length>0?c=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-shortcuts-list">
                ${X.map(y=>`
                      <div class="extension-shortcut-item">
                        <span class="extension-shortcut-key">${t(y.originalKey||y.key)}</span>
                        <span class="extension-shortcut-desc">${t(y.description||"No description")}</span>
                        <span class="extension-shortcut-status ${y.isActive?"active":"conflict"}">
                          ${y.isActive?"✓ Active":"⚠ Conflict"}
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
          `;let p="";re&&re.length>0&&(p=`
            <div class="extension-details-section">
              <h4>Issues</h4>
              <div class="extension-errors-list">
                ${re.map(y=>`
                      <div class="extension-error-item">
                        <div class="extension-error-type">${t(y.type)}</div>
                        <div class="extension-error-message">${t(y.message)}</div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `);let x="";te&&te.length>0&&(x=`
            <div class="extension-details-section">
              <h4>Shortcut Conflicts</h4>
              <div class="extension-conflicts-list">
                ${te.map(y=>`
                      <div class="extension-conflict-item">
                        <div class="extension-conflict-key">${t(y.key)}</div>
                        <div class="extension-conflict-extensions">
                          <strong>Conflicting with:</strong><br/>
                          ${y.conflictingExtensions.map(U=>`${t(U.name)}`).join("<br/>")}
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `),B.innerHTML=`${c}${p}${x}`}$.classList.remove("hidden"),E&&(E.onclick=()=>{$.classList.add("hidden")})}catch(Y){console.error("Failed to load extension details:",Y),B.innerHTML='<div class="extension-details-empty">Error loading extension details.</div>',$.classList.remove("hidden")}}return{bindSettingsShortcutsGlobal:it,createNativePageDescriptor:Me,ensureNativeSettingsGeneralInfo:qe,getSettingsTabTitle:ye,getSettingsShortcut:Le,initNativeSettingsUi:ot,initSettingsMenu:Ke,isEditableShortcutTarget:nt,isNativeSettingsTab:ue,normalizeSettingsSection:se,openSettingsTab:Te,refreshActiveNativeSettingsPage:Ee,renderNativeSettingsPage:he,updateNativeSettingsTabSection:Ne}}function ki({state:e,constants:n,escapeHtml:t,showToast:o,openOverlayModal:r,closeOverlayModal:u,getActiveTab:h,getActiveWebview:C,createTab:P,refreshActiveNativeSettingsPage:k,closeSettingsMenu:b}){const{PROFILES:I,PENDING_EXTENSION_OPEN_STORAGE_KEY:L,EXTENSION_PIN_STORAGE_KEY:A}=n;let N=!1,F=null,j=null,Q={visible:!1,id:"",message:"",actionLabel:"",action:""},de={},q={entryPath:""},se=!1;async function ye(){if(!window.api?.listBrowserExtensions)return e.browserExtensionsCache=[],e.browserExtensionsCache;const a=await window.api.listBrowserExtensions(),f=Array.isArray(a?.entries)?a.entries:[];return e.browserExtensionsCache=f.map(w=>{const d=(w.id||"guest").toLowerCase(),S=n.APP_PROTOCOL_SCHEME||"oneview-dev",O=String(w.path||"").trim().replace(/\\/g,"/").replace(/\/+$/,""),V=`file:///${O}`,G=fe=>{if(!fe||!fe.toLowerCase().startsWith("file://"))return fe;const ie=fe.replace(/\\/g,"/"),ge=decodeURI(ie);let we=ge.replace(V,"").replace(/^\/+/,"");if(we===ge){const pe=`/${O.split("/").pop()}/`,Z=ge.indexOf(pe);Z!==-1?we=ge.slice(Z+pe.length):we=""}const K=w.manifest?.entrypoints?.root||w.manifest?.entrypoints?.page||"index.html";return`${S}://${d}/${we||K}`};return{...w,rootUrl:G(w.rootUrl),optionsUrl:G(w.optionsUrl),popupUrl:G(w.popupUrl),sidePanelUrl:G(w.sidePanelUrl)}}),e.browserExtensionsCache}async function Le(){let a="";try{a=String(sessionStorage.getItem(L)||"").trim()}catch{a=""}if(!a)return;try{sessionStorage.removeItem(L)}catch{}const f=e.browserExtensionsCache.find(w=>w.path===a);f&&await E(f.path,"tab")}function nt(){try{const a=JSON.parse(localStorage.getItem(A)||"{}");de=a&&typeof a=="object"&&!Array.isArray(a)?a:{}}catch{de={}}}function Me(){try{localStorage.setItem(A,JSON.stringify(de||{}))}catch{}}function ne(){return h()?.partition||I[e.currentProfileId]?.partition||I.guest.partition}function ue(){const a=h(),f=C();return{url:String(f?.getURL?.()||a?.url||"").trim(),title:String(f?.getTitle?.()||a?.title||"").trim()}}function qe(a={}){return String(a?.name||a?.actionTitle||"EX").trim().split(/\s+/).slice(0,2).map(w=>w.charAt(0)).join("").toUpperCase()}function ke(a={}){return String(a?.actionTitle||a?.name||"Extension").trim()}function xe(a={},f=""){const w=String(a?.path||"").trim(),d=String(f||"").trim().replace(/\\/g,"/");if(!w||!d)return"";const S=w.replace(/\\/g,"/").replace(/\/+$/,""),O=d.replace(/^\/+/,""),V=`${S}/${O}`;return`file:///${encodeURI(V.replace(/^([A-Za-z]):/,"$1:"))}`}function Pe(a={}){return de[String(a?.path||"").trim()]===!0}function Ye(a={}){const f=(a?.id||"guest").toLowerCase(),w=a?.manifest?.entrypoints?.root||a?.manifest?.entrypoints?.page||"index.html";return`${n.APP_PROTOCOL_SCHEME}://${f}/${w}`}function Fe(a={},f=""){const w=String(a?.actionIconFileUrl||xe(a,a?.actionIconPath||"")||a?.actionIconUrl||"").trim(),d=t(qe(a));return w?`<img src="${t(w)}" alt="" />`:`<span class="${f}">${d}</span>`}function Ue(a=0){const f=Number(a||0);return f>=1024*1024*1024?`${(f/(1024*1024*1024)).toFixed(1)} GB`:f>=1024*1024?`${(f/(1024*1024)).toFixed(1)} MB`:f>=1024?`${(f/1024).toFixed(1)} KB`:`${Math.max(0,Math.round(f))} B`}function He(a=0){const f=Number(a||0);return f<=0?"":`${Ue(f)}/s`}function Ge(a=null){const f=Number(a);if(!Number.isFinite(f)||f<0)return"";if(f<60)return`${Math.round(f)}s left`;const w=Math.floor(f/60),d=Math.round(f%60);return`${w}m ${d}s left`}function he(a=""){return e.managedDownloadsCache.find(f=>f.id===a)||null}function Ee(){const a=document.getElementById("downloadsManagerBtn");a&&(a.classList.remove("has-download-highlight"),a.offsetWidth,a.classList.add("has-download-highlight"),F&&clearTimeout(F),F=setTimeout(()=>{a.classList.remove("has-download-highlight")},2300))}async function Ne(){if(!window.api?.listManagedDownloads)return e.managedDownloadsCache=[],e.managedDownloadsCache;const a=await window.api.listManagedDownloads();return e.managedDownloadsCache=Array.isArray(a?.downloads)?a.downloads:[],e.managedDownloadsCache}function Te(){const a=document.getElementById("downloadsManagerPanel"),f=document.getElementById("downloadsManagerBtn");a&&!a.classList.contains("hidden")&&(N?u(()=>a.classList.add("hidden")):a.classList.add("hidden")),N=!1,f&&f.classList.remove("is-active")}function Ke(){const a=document.getElementById("downloadsManagerPanel"),f=document.getElementById("downloadsManagerBadge");if(!a)return;const w=e.managedDownloadsCache.filter(d=>d.state==="progressing"||d.state==="interrupted").length;f&&(w>0?(f.textContent=String(w),f.classList.remove("hidden")):(f.textContent="",f.classList.add("hidden"))),a.innerHTML=`
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${e.managedDownloadsCache.length?e.managedDownloadsCache.map(d=>{const S=t(d.fileName||"Download"),O=String(d.state||"progressing"),V=typeof d.progress=="number"?Math.max(0,Math.min(100,d.progress)):0,G=d.totalBytes>0?`${Ue(d.receivedBytes)} / ${Ue(d.totalBytes)}`:Ue(d.receivedBytes),fe=He(d.bytesPerSecond),ie=Ge(d.etaSeconds),ge=O==="completed"?"Completed":O==="cancelled"?"Cancelled":O==="interrupted"?"Interrupted":d.paused?"Paused":`Downloading ${V}%`,we=[fe,ie].filter(Boolean).join(" • ");return`
                    <div class="downloads-manager-item">
                      <strong>${S}</strong>
                      <div class="downloads-manager-meta">${t(ge)} • ${t(G)}</div>
                      ${we?`<div class="downloads-manager-meta">${t(we)}</div>`:""}
                      <div class="downloads-manager-progress">
                        <span style="width:${V}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${O==="progressing"?d.paused?`<button type="button" data-download-id="${t(d.id)}" data-download-action="resume">Resume</button>`:`<button type="button" data-download-id="${t(d.id)}" data-download-action="pause">Pause</button>`:""}
                        ${O==="progressing"||O==="interrupted"?`<button type="button" data-download-id="${t(d.id)}" data-download-action="cancel">Cancel</button>`:""}
                        ${O==="interrupted"||O==="cancelled"?`<button type="button" data-download-id="${t(d.id)}" data-download-action="retry">Retry</button>`:""}
                        ${d.savePath?`<button type="button" data-download-id="${t(d.id)}" data-download-action="show">Show in Folder</button>`:""}
                        ${O==="completed"&&d.existsOnDisk?`<button type="button" data-download-id="${t(d.id)}" data-download-action="open">Open</button>`:""}
                         <button type="button" data-download-id="${t(d.id)}" data-download-action="remove">Delete</button>
                      </div>
                    </div>
                  `}).join(""):'<div class="downloads-manager-empty">No downloads yet.</div>'}
      </div>
    `}async function ot(a=null){const f=document.getElementById("downloadsManagerPanel"),w=document.getElementById("downloadsManagerBtn");if(!f||!w)return;if(!(a===null?f.classList.contains("hidden"):!!a)){Te();return}m(),Ke();try{await r(()=>f.classList.remove("hidden"),{captureSnapshots:!1}),N=!0}catch{f.classList.remove("hidden"),N=!1}w.classList.add("is-active")}function it(){let a=document.getElementById("downloadsShelf");a||(a=document.createElement("div"),a.id="downloadsShelf",a.className="downloads-shelf hidden",a.innerHTML=`
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `,document.body.appendChild(a),a.querySelector("#downloadsShelfClose")?.addEventListener("click",()=>{Q.visible=!1,it()}),a.querySelector("#downloadsShelfAction")?.addEventListener("click",async()=>{const S=he(Q.id);!S||!Q.action||!window.api?.runManagedDownloadAction||await window.api.runManagedDownloadAction({id:S.id,action:Q.action})}));const f=a.querySelector("#downloadsShelfTitle"),w=a.querySelector("#downloadsShelfMessage"),d=a.querySelector("#downloadsShelfAction");if(!Q.visible){a.classList.add("hidden");return}f&&(f.textContent="Downloads"),w&&(w.textContent=Q.message||""),d&&(d.textContent=Q.actionLabel||"Open",d.style.display=Q.action?"":"none"),a.classList.remove("hidden")}function ve(a={},f="updated"){const w=String(a.fileName||"Download").trim()||"Download";if(f==="created")Q={visible:!0,id:String(a.id||""),message:`${w} started downloading`,actionLabel:"Show",action:"show"};else if(f==="completed")Q={visible:!0,id:String(a.id||""),message:`${w} downloaded`,actionLabel:"Open",action:"open"};else if(f==="interrupted")Q={visible:!0,id:String(a.id||""),message:`${w} was interrupted`,actionLabel:"Retry",action:"retry"};else return;it(),j&&clearTimeout(j),j=setTimeout(()=>{Q.visible=!1,it()},5e3)}function m(){const a=document.getElementById("browserExtensionsMenu"),f=document.getElementById("browserExtensionsMenuBtn");a&&!a.classList.contains("hidden")&&(se?u(()=>a.classList.add("hidden")):a.classList.add("hidden")),se=!1,f&&f.classList.remove("is-active")}async function $(a=null){const f=document.getElementById("browserExtensionsMenu"),w=document.getElementById("browserExtensionsMenuBtn");if(!f||!w)return;if(!(a===null?f.classList.contains("hidden"):!!a)){m();return}B().catch(()=>{}),re();try{await r(()=>f.classList.remove("hidden"),{captureSnapshots:!1}),se=!0}catch(S){console.error("Failed to open extensions menu overlay",S),f.classList.remove("hidden"),se=!1}w.classList.add("is-active")}async function E(a,f="tab"){const w=e.browserExtensionsCache.find(V=>V.path===a);if(!w)return;const d=(w?.id||"guest").toLowerCase();let S="";if(f==="options"&&w.optionsUrl){const V=w.manifest?.entrypoints?.options||"options.html";S=`${n.APP_PROTOCOL_SCHEME}://${d}/${V}`}else if(f==="root"&&w.rootUrl){const V=w.manifest?.entrypoints?.root||"result.html";S=`${n.APP_PROTOCOL_SCHEME}://${d}/${V}`}else S=Ye(w);if(!S){o("This extension does not expose an openable page yet.","info");return}const O=`ext-${w.id||"guest"}`;P(S,O,`${w.name||"Extension"}${f==="options"?" Options":""}`,null,{extensionEntryPath:w.path,extensionActiveContext:ue()})}async function B(){if(window.api?.closeBrowserExtensionPopup)try{await window.api.closeBrowserExtensionPopup()}catch{}q={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(a=>a.classList.remove("is-active"))}function D(a={}){const f=document.getElementById("browserExtensionPopupTitle"),w=document.getElementById("browserExtensionPopupSubtitle"),d=document.getElementById("browserExtensionPopupIcon");f&&(f.textContent=ke(a)),w&&(w.textContent=a?.popupUrl?"Popup":a?.optionsUrl?"Extension page":a?.rootUrl?"Extension":""),d&&(d.innerHTML=Fe(a,"browser-extension-popup-fallback"))}function Y(a){if(!a||typeof a.getBoundingClientRect!="function")return{left:0,top:0,bottom:0,width:0,height:0};const f=a.getBoundingClientRect();return{left:Number(f.left||0),top:Number(f.top||0),bottom:Number(f.bottom||0),width:Number(f.width||0),height:Number(f.height||0)}}async function ee(a,f=null){const w=e.browserExtensionsCache.find(ie=>ie.path===a);if(!w)return;const d=String(w.popupUrl||"").trim()||String(w.optionsUrl||"").trim();if(!d){await E(a,"tab");return}if(q.entryPath===a){await B();return}await B(),m();const S=window.api?.openBrowserExtensionPopup;if(typeof S!="function")throw new Error("Extension popup API is unavailable");const O=ue(),V=`ext-${w.id||"guest"}`,G=await S({url:d,entryPath:a,partition:V,anchor:Y(f),activeUrl:O.url||"",activeTitle:O.title||""});if(!G?.success)throw new Error(G?.message||"Could not open extension popup");D(w),q={entryPath:a,pageType:"popup",host:null,overlayActive:!1};const fe=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(a):a.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${fe}"]`).forEach(ie=>ie.classList.add("is-active"))}function X(){const a=document.getElementById("browserExtensionsPinned");if(!a)return;const f=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(S=>{const O=S.id==="sitesnap-studio"||String(S.name||"").toLowerCase().includes("sitesnap")||String(S.id||"").toLowerCase().includes("sitesnap");return f?S.enabled!==!1&&O:S.enabled!==!1&&!O}),d=f?w:w.filter(S=>Pe(S));if(!d.length){a.innerHTML="",a.classList.add("hidden");return}a.classList.remove("hidden"),a.innerHTML=d.map(S=>`
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${t(S.path||"")}"
            title="${t(ke(S))}"
            aria-label="${t(ke(S))}"
          >
            ${Fe(S,"browser-extension-action-fallback")}
          </button>
        `).join("")}function re(){const a=document.getElementById("browserExtensionsMenu");if(!a)return;const f=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(d=>{const S=d.id==="sitesnap-studio"||String(d.name||"").toLowerCase().includes("sitesnap")||String(d.id||"").toLowerCase().includes("sitesnap");return f?d.enabled!==!1&&S:d.enabled!==!1&&!S});a.innerHTML=`
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${w.length?w.map(d=>{const S=t(d.path||""),O=t(ke(d)),V=t(d.version?`v${d.version}${d.id?` • ${d.id}`:""}`:d.id||d.name||"");return`
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${Fe(d,"browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${O}</strong>
                          <p>${V}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${S}"
                          title="${Pe(d)?"Unpin":"Pin"}"
                          aria-label="${Pe(d)?"Unpin":"Pin"}"
                        >
                          ${Pe(d)?"Unpin":"Pin"}
                        </button>
                      </div>
                      <div class="browser-extension-menu-actions">
                        <button type="button" data-menu-action="popup" data-path="${S}">
                          ${d.popupUrl?"Open Popup":"Open"}
                        </button>
                        ${d.optionsUrl?`<button type="button" data-menu-action="options" data-path="${S}">Options</button>`:""}
                        ${d.rootUrl?`<button type="button" data-menu-action="tab" data-path="${S}">Open in Tab</button>`:""}
                      </div>
                    </div>
                  `}).join(""):'<div class="browser-extensions-empty">No enabled extensions yet.</div>'}
      </div>
    `}function te(){X(),re()}function c(){const a=document.getElementById("extensionsManagerList");if(!a)return;const f=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(d=>{const S=d.id==="sitesnap-studio"||String(d.name||"").toLowerCase().includes("sitesnap")||String(d.id||"").toLowerCase().includes("sitesnap");return f?S:!S});if(!w.length){a.innerHTML=`
        <div class="extensions-empty-state">
          No unpacked extensions added yet.
        </div>
      `;return}a.innerHTML=w.map(d=>{const S=t(d.path||"");return`
          <div class="extension-item ${d.enabled===!1?"is-disabled":""}">
            <div class="extension-main">
              <div class="extension-title-row">
                <h4>${t(d.name||"Unnamed Extension")}</h4>
                <span class="extension-badge ${d.customBridge?"custom":"normal"}">
                  ${d.customBridge?"OneView":"Legacy"}
                </span>
                ${d.enabled===!1?'<span class="extension-status-pill">Disabled</span>':""}
              </div>
              <div class="extension-meta-row">
                ${d.version?`<span>v${t(d.version)}</span>`:""}
                ${d.id?`<span>${t(d.id)}</span>`:""}
              </div>
              ${n.IS_DEV_APP_BUILD?`<div class="extension-path">${S}</div>`:""}
              ${d.loadError?`<div class="extension-error">${t(d.loadError)}</div>`:""}
            </div>
            <div class="extension-actions">
              ${d.popupUrl?`<button type="button" class="extension-action-btn" data-action="open-popup" data-path="${S}">Popup</button>`:""}
              ${d.rootUrl||d.linkUrl?`<button type="button" class="extension-action-btn" data-action="open-tab" data-path="${S}">Open Tab</button>`:""}
              ${d.optionsUrl?`<button type="button" class="extension-action-btn" data-action="open-options" data-path="${S}">Options</button>`:""}
              <button type="button" class="extension-action-btn" data-action="reload" data-path="${S}">
                Reload
              </button>
              <button type="button" class="extension-action-btn" data-action="toggle" data-path="${S}">
                ${d.enabled===!1?"Enable":"Disable"}
              </button>
              ${n.IS_DEV_APP_BUILD?`<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${S}">Remove</button>`:""}
            </div>
          </div>
        `}).join("")}async function p(){try{await ye()}catch(a){console.error("Failed to refresh browser extensions list",a)}c(),te()}async function x(a,f){const w=e.browserExtensionsCache.find(S=>S.path===a);if(!w)return;const d=f==="options"?w.optionsUrl:f==="root"?w.rootUrl:Ye(w);if(!d){o(`This extension does not expose a ${f} page.`,"info");return}P(d,ne(),`${w.name||"Extension"} ${f==="options"?"Options":"Popup"}`,null,{extensionEntryPath:w.path,extensionActiveContext:ue()})}async function y(){const a=document.getElementById("extensionsManagerModal");if(a){m(),await B(),c(),te();try{await r(()=>a.classList.remove("hidden"))}catch(f){console.error("openOverlayModal failed for extensions manager",f),a.classList.remove("hidden")}p().catch(f=>{console.error("Failed to refresh extensions manager after open",f)})}}function U(){const a=document.getElementById("extensionsManagerModal");a&&u(()=>a.classList.add("hidden"))}function R(){const a=document.getElementById("extensionsBtn"),f=document.getElementById("settingsBtn"),w=document.getElementById("extensionsModalCloseBtn"),d=document.getElementById("extensionsLoadBtn"),S=document.getElementById("extensionsManagerList"),O=document.getElementById("browserExtensionsPinned"),V=document.getElementById("browserExtensionsMenuBtn"),G=document.getElementById("browserExtensionsMenu"),fe=document.getElementById("downloadsManagerBtn"),ie=document.getElementById("downloadsManagerPanel"),ge=document.getElementById("browserExtensionPopupClose"),we=document.getElementById("browserExtensionPopupOpenTab");nt(),c(),te(),p().catch(K=>{console.error("Failed to refresh extensions manager after open",K)}),ye().then(()=>{if(Le(),window.api?.prewarmBrowserExtensionPopup){const oe=e.browserExtensionsCache.filter(Z=>Z.enabled!==!1).filter(Z=>Pe(Z));let pe={partition:ne()};if(oe.length>0){const Z=oe[0],ce=String(Z.popupUrl||"").trim()||String(Z.optionsUrl||"").trim();ce&&(pe={...pe,url:ce,entryPath:Z.path})}window.api.prewarmBrowserExtensionPopup(pe).catch(()=>{})}}).catch(()=>{}),window.api?.onBrowserExtensionPopupState&&window.api.onBrowserExtensionPopupState(K=>{const{entryPath:oe,open:pe}=K||{};if(pe){q={entryPath:oe,pageType:"popup",host:null,overlayActive:!1};const Z=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(oe):oe.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${Z}"]`).forEach(ce=>ce.classList.add("is-active"))}else q.entryPath===oe&&(q={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(Z=>Z.classList.remove("is-active")))}),a&&a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",()=>{y().catch(K=>{console.error("Failed to open extensions manager",K),o("Could not open extensions manager.","error")})})),w&&w.dataset.boundClick!=="1"&&(w.dataset.boundClick="1",w.addEventListener("click",U)),d&&d.dataset.boundClick!=="1"&&(d.dataset.boundClick="1",d.addEventListener("click",async()=>{try{if(!window.api?.addBrowserExtensionsUnpacked){o("Extension manager API is unavailable.","error");return}const K=await window.api.addBrowserExtensionsUnpacked();e.browserExtensionsCache=Array.isArray(K?.entries)?K.entries:[],c(),te(),o("Unpacked extensions loaded.","success")}catch(K){console.error("Failed to load unpacked extensions",K),o(K?.message||"Could not load unpacked extensions.","error")}})),S&&S.dataset.boundClick!=="1"&&(S.dataset.boundClick="1",S.addEventListener("click",async K=>{const oe=K.target.closest("[data-action]");if(!oe)return;const pe=String(oe.dataset.action||"").trim(),Z=String(oe.dataset.path||"").trim();if(Z)try{if(pe==="open-popup"){await x(Z,"popup");return}if(pe==="open-tab"){await x(Z,"tab");return}if(pe==="open-options"){await x(Z,"options");return}if(pe==="reload"&&window.api?.reloadBrowserExtension){const ce=await window.api.reloadBrowserExtension({path:Z});e.browserExtensionsCache=Array.isArray(ce?.entries)?ce.entries:e.browserExtensionsCache,c(),te(),o("Extension reloaded.","success");return}if(pe==="toggle"&&window.api?.toggleBrowserExtension){const ce=e.browserExtensionsCache.find(Je=>Je.path===Z);ce?.enabled!==!1&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const Ce=await window.api.toggleBrowserExtension({path:Z,enabled:ce?.enabled===!1});e.browserExtensionsCache=Array.isArray(Ce?.entries)?Ce.entries:e.browserExtensionsCache,c(),te(),o("Extension state updated.","success");return}if(pe==="remove"&&window.api?.removeBrowserExtension){typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const ce=await window.api.removeBrowserExtension({path:Z});e.browserExtensionsCache=Array.isArray(ce?.entries)?ce.entries:e.browserExtensionsCache,c(),te(),o("Extension removed.","success")}}catch(ce){console.error("Extension manager action failed",ce),o(ce?.message||"Could not complete extension action.","error")}})),O&&O.dataset.boundClick!=="1"&&(O.dataset.boundClick="1",O.addEventListener("click",async K=>{const oe=K.target.closest("[data-path]");if(!oe)return;const pe=String(oe.dataset.path||"").trim();if(pe)try{await ee(pe,oe)}catch(Z){console.error("Failed to open extension popup",Z),o(Z?.message||"Could not open extension popup.","error")}})),V&&V.dataset.boundClick!=="1"&&(V.dataset.boundClick="1",V.addEventListener("click",()=>{$().catch(K=>{console.error("Failed to toggle extensions menu",K),o("Could not open extensions menu.","error")})})),G&&G.dataset.boundClick!=="1"&&(G.dataset.boundClick="1",G.addEventListener("click",async K=>{const oe=K.target.closest("[data-menu-action]");if(!oe)return;const pe=String(oe.dataset.menuAction||"").trim(),Z=String(oe.dataset.path||"").trim();try{if(pe==="manage"){m(),await y();return}if(!Z)return;if(pe==="pin"){const ce=!de[Z];de[Z]=ce,Me(),te();return}if(pe==="popup"){await ee(Z,V||oe);return}if(pe==="options"){m(),await E(Z,"options");return}pe==="tab"&&(m(),await E(Z,"tab"))}catch(ce){console.error("Extension menu action failed",ce),o(ce?.message||"Could not complete extension action.","error")}})),ge&&ge.dataset.boundClick!=="1"&&(ge.dataset.boundClick="1",ge.addEventListener("click",()=>{B().catch(()=>{})})),we&&we.dataset.boundClick!=="1"&&(we.dataset.boundClick="1",we.addEventListener("click",async()=>{q.entryPath&&(await E(q.entryPath,"tab"),await B())})),document.body&&document.body.dataset.boundExtensionUiDismiss!=="1"&&(document.body.dataset.boundExtensionUiDismiss="1",document.addEventListener("click",K=>{const oe=K.target;f&&!f.contains(oe)&&b(),G&&!G.classList.contains("hidden")&&!G.contains(oe)&&!V?.contains(oe)&&!a?.contains(oe)&&m(),ie&&!ie.classList.contains("hidden")&&!ie.contains(oe)&&!fe?.contains(oe)&&Te(),!oe.closest(".browser-extension-action-btn")&&!G?.contains(oe)&&B().catch(()=>{})}),document.addEventListener("keydown",K=>{K.key==="Escape"&&(b(),m(),Te(),B().catch(()=>{}))}))}function W(){const a=document.getElementById("downloadsManagerBtn"),f=document.getElementById("downloadsManagerPanel");a&&a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",()=>{ot().catch(()=>{})})),f&&f.dataset.boundClick!=="1"&&(f.dataset.boundClick="1",f.addEventListener("click",async w=>{const d=w.target.closest("[data-download-action]");if(!d)return;const S=String(d.dataset.downloadAction||"").trim(),O=String(d.dataset.downloadId||"").trim();if(S)try{if(!window.api?.runManagedDownloadAction)return;const V=await window.api.runManagedDownloadAction({id:O,action:S});Array.isArray(V?.downloads)?e.managedDownloadsCache=V.downloads:(S==="remove"||S==="clear-completed")&&await Ne(),Ke()}catch(V){o(V?.message||"Could not complete download action.","error")}})),Ne().then(()=>{Ke()}).catch(()=>{}),window.api&&typeof window.api.onDownloadManagerUpdated=="function"&&document.body?.dataset.boundDownloadManagerEvents!=="1"&&(document.body.dataset.boundDownloadManagerEvents="1",window.api.onDownloadManagerUpdated(w=>{e.managedDownloadsCache=Array.isArray(w?.downloads)?w.downloads:[],Ke(),k().catch(()=>{}),(w?.reason==="created"||w?.reason==="completed"||w?.reason==="interrupted")&&Ee();const d=he(String(w?.focusId||"").trim());d&&ve(d,String(w?.reason||"updated"))}))}return{closeBrowserExtensionPopup:B,closeBrowserExtensionsMenu:m,closeDownloadsManagerPanel:Te,formatDownloadBytes:Ue,formatDownloadEta:Ge,formatDownloadSpeed:He,initDownloadsManager:W,initExtensionsManager:R,loadManagedDownloadsFromMain:Ne,refreshBrowserExtensionsUi:te,refreshExtensionsManagerList:p}}function Pi({state:e,constants:n,showToast:t,openOverlayModal:o,closeOverlayModal:r,renderProfilePillSelect:u,resolveCredentialScopeIdForTab:h,applyProfileSelection:C,getCurrentProfileId:P,escapeHtml:k}){const{AUTH_GATEWAY_HOSTS:b,RESOURCE_SERVICE_ORIGIN:I}=n,L=()=>e.activeTabId,A=()=>e.credentialCache,N=c=>{e.credentialCache=c},F=()=>e.activeHttpAuthChallenge,j=c=>{e.activeHttpAuthChallenge=c},Q=()=>e.credentialCacheRefreshedAt,de=c=>{e.credentialCacheRefreshedAt=c},q=()=>e.credentialCacheRefreshInFlight,se=c=>{e.credentialCacheRefreshInFlight=c},ye=new Map;function Le(){return{wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]}}function nt(){return Object.keys(Le())}function Me(){return!!(window.api&&typeof window.api.listProfileCredentials=="function"&&typeof window.api.saveProfileCredential=="function"&&typeof window.api.deleteProfileCredential=="function")}function ne(c=""){const p=String(c).trim().toLowerCase();if(!p)return"";try{const R=new URL(p),W=String(R.hostname||"").trim().toLowerCase().replace(/^www\./,""),a=String(R.port||"").trim();return W?!a||a==="80"||a==="443"?W:`${W}:${a}`:""}catch{}const x=p.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];if(!x)return"";const y=x.lastIndexOf(":");if(y<=0)return x;const U=x.slice(y+1);return/^\d+$/.test(U)&&U!=="80"&&U!=="443"?x:x.slice(0,y)}function ue(c=""){const p=String(c||"").trim().toLowerCase();if(!p)return"";const x=p.lastIndexOf(":");if(x<=0)return p;const y=p.slice(x+1);return/^\d+$/.test(y)?p.slice(0,x):p}function qe(c=""){const p=[];try{const x=new URL(String(c||"")),y=(R="")=>{if(R)try{const W=new URL(String(R)),a=ne(W.host||W.hostname||"");a&&p.push(a)}catch{const a=ne(String(R||""));a&&p.push(a)}};y(x.host||x.hostname||""),["retURL","retUrl","returnUrl","TargetResource","targetResource","PartnerSpId","partnerSpId"].forEach(R=>{y(x.searchParams.get(R)||"")})}catch{}return[...new Set(p.filter(Boolean))]}function ke(c=""){const p=qe(c);if(p.length===0)return ne(c);const x=p[0]||"";if(b.has(x)){const y=p.find(U=>U&&!b.has(U));if(y)return y}return x}function xe(c=""){return b.has(ne(c))}function Pe(c=""){const p=ue(ne(c));return p.endsWith(".veevavault.com")||p==="veevavault.com"||p.endsWith(".gskinternet.com")||p==="gskinternet.com"||p.endsWith(".gskpro.com")||p==="gskpro.com"}function Ye(c,p,x=""){const y=String(p||"").trim().toLowerCase(),U=ne(x);if(!c||!y)return null;const R=(A()[c]||[]).filter(W=>{const a=ne(W.domain);return a&&a!==U&&!xe(a)&&Pe(a)&&String(W.username||"").trim().toLowerCase()===y});return R.sort((W,a)=>ne(a.domain).length-ne(W.domain).length),R[0]||null}function Fe(c=""){const p=String(c||"").trim();return/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(p)?"":p}async function Ue(){if(!window.api?.deleteProfileCredential)return;const c=[];nt().forEach(p=>{(A()[p]||[]).forEach(x=>{const y=ne(x.domain);!xe(y)||!Ye(p,x.username,y)||c.push({profileId:p,domain:y,username:String(x.username||"").trim()})})}),c.length!==0&&(await Promise.allSettled(c.map(p=>window.api.deleteProfileCredential(p))),c.forEach(p=>{const x=A()[p.profileId]||[];A()[p.profileId]=x.filter(y=>!(ne(y.domain)===p.domain&&String(y.username||"").trim().toLowerCase()===p.username.toLowerCase()))}))}async function He(){if(!Me())return N(Le()),A();try{const c=await window.api.listProfileCredentials();if(!c||!c.success||!Array.isArray(c.data))return N(Le()),A();const p=Le();return c.data.forEach(x=>{const y=String(x.profileId||"").toLowerCase();p[y]&&p[y].push({profileId:y,domain:ne(x.domain),username:String(x.username||""),password:String(x.password||"")})}),N(p),await Ue(),A()}catch{return N(Le()),A()}}async function Ge(c=15e3){if(!Me()||Date.now()-Q()<c)return A();if(q())return q();const x=He().then(y=>(de(Date.now()),y)).finally(()=>{se(null)});return se(x),x}function he(c){return c?(c.credentialHintsByDomain||(c.credentialHintsByDomain={}),c.credentialHintsByDomain):{}}function Ee(c="",p=""){const x=`${String(c||"").toLowerCase()} ${String(p||"").toLowerCase()}`;if(/login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(x))return!0;try{const y=new URL(String(c||""));if(I&&y.origin.toLowerCase()===I){const R=String(y.pathname||"/").toLowerCase(),W=String(p||"").toLowerCase();if((R==="/"||R==="/login"||R==="/signin")&&W.includes("synapse"))return!0}const U=`${y.pathname.toLowerCase()} ${y.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(U)}catch{return!1}}function Ne(c=""){let p="";try{p=new URL(String(c||"")).hostname.toLowerCase()}catch{return!1}return p==="10.215.56.196"||p.endsWith(".gskinternet.com")||p.endsWith(".gskpro.com")||p.endsWith(".veevavault.com")||p.endsWith(".okta.com")||p.endsWith(".oktacdn.com")||p.endsWith(".pingone.com")}function Te(c="",p="",x=null){return!Me()||!x?!1:x.launchedAppType==="website"||!x.launchedAppType?Ee(c,p)||Ne(c):!0}function Ke(c,p=""){if(!c)return null;const x=qe(p);if(x.length===0)return null;const y=A()[c]||[];let U=null,R=-1,W="";try{const a=ne(p);a&&(W=localStorage.getItem(`oneview:last-used-username:${c}:${a}`)||"")}catch{}return y.forEach(a=>{const f=ne(a.domain);if(!f)return;const w=x.reduce((S,O)=>{if(!O)return S;if(O===f)return Math.max(S,1e3);if(ue(O)===ue(f))return Math.max(S,900);if(O.endsWith(`.${f}`)||f.endsWith(`.${O}`))return Math.max(S,500);const V=ue(O),G=ue(f);if(V.endsWith(`.${G}`)||G.endsWith(`.${V}`))return Math.max(S,450);const fe=V.split(".").reverse(),ie=G.split(".").reverse();let ge=0;for(let we=0;we<Math.min(fe.length,ie.length)&&fe[we]===ie[we];we+=1)ge+=1;return Math.max(S,ge>1?ge:-1)},-1);if(w<0)return;const d=W&&String(a.username||"").trim().toLowerCase()===W.trim().toLowerCase();(!U||w>R||w===R&&d||w===R&&!d&&f.length>ne(U.domain).length)&&(U=a,R=w)}),U}function ot(c,p="",x=null){const y=A()[c]||[];if(y.length===0)return null;let U="";try{U=ne(p)}catch{U=""}const R=he(x),W=Object.values(R||{}).map(O=>String(O||"").trim()).filter(Boolean),a=String(x?.lastUsernameHint||"").trim()||W[W.length-1]||"";if(U&&xe(U)&&a){const O=Ye(c,a,U);if(O)return O}const f=Ke(c,p);if(f&&!xe(f.domain))return f;if(!a)return null;const w=y.filter(O=>String(O.username||"").trim().toLowerCase()===a.toLowerCase());if(w.length===1)return f&&!xe(w[0].domain)?f:w[0];if(w.length===0)return null;const d=U;if(!d)return w[0];const S=O=>{const V=ne(O);if(!V)return-1;if(xe(V)&&Pe(d))return-100;if(xe(d)&&!xe(V))return 800+(Pe(V)?50:0);if(d===V)return 1e3;if(ue(d)===ue(V))return 900;if(d.endsWith(`.${V}`)||V.endsWith(`.${d}`))return 500;const G=ue(d),fe=ue(V);if(G.endsWith(`.${fe}`)||fe.endsWith(`.${G}`))return 450;const ie=G.split(".").reverse(),ge=fe.split(".").reverse();let we=0;for(let K=0;K<Math.min(ie.length,ge.length)&&ie[K]===ge[K];K+=1)we+=1;return we};return w.sort((O,V)=>S(V.domain)-S(O.domain)),w[0]||null}function it(c,p="",x=null){const y=ot(c,p,x);if(y)return{...y,profileId:String(y.profileId||"").trim().toLowerCase()||String(c||"").trim().toLowerCase()};const U=A()[c]||[];if(U.length===1)return{...U[0],profileId:String(U[0]?.profileId||"").trim().toLowerCase()||String(c||"").trim().toLowerCase()};let R="";try{R=ne(p)}catch{R=""}if(!R||U.length===0)return null;const W=w=>{const d=ne(w);if(!d)return-1;if(xe(R)&&!xe(d))return 800+(Pe(d)?50:0);if(xe(d)&&Pe(R))return-100;if(R===d)return 1e3;if(ue(R)===ue(d))return 900;if(R.endsWith(`.${d}`)||d.endsWith(`.${R}`))return 500;const S=ue(R),O=ue(d);if(S.endsWith(`.${O}`)||O.endsWith(`.${S}`))return 450;const V=S.split(".").reverse(),G=O.split(".").reverse();let fe=0;for(let ie=0;ie<Math.min(V.length,G.length)&&V[ie]===G[ie];ie+=1)fe+=1;return fe},f=[...U].sort((w,d)=>W(d.domain)-W(w.domain))[0]||null;return f?{...f,profileId:String(f.profileId||"").trim().toLowerCase()||String(c||"").trim().toLowerCase()}:null}async function ve(c,p){if(!c||!p)return;const x=String(p.username||""),y=String(p.password||"");if(!y)return!1;const U=`
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
          if (${JSON.stringify(!!x)} && userField) {
            userField.focus();
            setNativeValue(userField, ${JSON.stringify(x)});
            fire(userField);
          }
          if (passField) {
            passField.focus();
            setNativeValue(passField, ${JSON.stringify(y)});
            fire(passField);
          }
        } finally {
          setTimeout(() => {
            window.__oneviewAutofillApplying = false;
          }, 0);
        }
      })();
    `;try{return await c.executeJavaScript(U,!0),!0}catch{return!1}}function m(c,p){if(!c||!p)return;c._oneviewAutofillTimer&&(clearTimeout(c._oneviewAutofillTimer),c._oneviewAutofillTimer=null);let x=0;const y=async()=>{if(x+=1,!(typeof c.isDestroyed=="function"?c.isDestroyed():!1)&&c.id===`webview-${L()}`){try{if(await c.executeJavaScript("Boolean(window.__oneviewManualCredentialEditAt)",!0)){c._oneviewAutofillTimer&&(clearTimeout(c._oneviewAutofillTimer),c._oneviewAutofillTimer=null);return}}catch{}await ve(c,p),x<6&&(c._oneviewAutofillTimer=setTimeout(y,1e3))}};y()}async function $(c){if(c)try{await c.executeJavaScript(`
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
        `,!0)}catch{}}async function E(c){if(!c)return null;try{const p=await c.executeJavaScript(`
        (() => {
          if (typeof window.__oneviewConsumeCredentialCapture !== "function") return null;
          const direct = window.__oneviewConsumeCredentialCapture();
          if (direct && (direct.username || direct.password)) return direct;
          const username = String(window.__oneviewLastUsernameValue || "").trim();
          const password = String(window.__oneviewLastPasswordValue || "");
          if (!username && !password) return null;
          window.__oneviewLastUsernameValue = "";
          window.__oneviewLastPasswordValue = "";
          return {
            username,
            password,
            url: window.location.href || "",
            capturedAt: Date.now(),
            activeInputType: "",
            trigger: "value-cache",
            otpLike: false,
          };
        })();
        `,!0);return p&&(p.username||p.password)?p:null}catch{return null}}async function B(c,p){if(!Me()||!c||!p||p.id!==L()||!p.credentialAutomationEnabled)return;String(c.getURL?.()||p.url||"");let x=null;if(c._oneviewSubmittedCredential?(x=c._oneviewSubmittedCredential,c._oneviewSubmittedCredential=null):x=await E(c),!x)return;const y=x,U=String(y.trigger||"");if(String(y.activeInputType||"").toLowerCase(),U==="input"){const Ce=ke(String(y.url||c.getURL()||"")),Je=Fe(y.username),dt=!!Je&&!!y.password&&Je.toLowerCase()===String(y.password).toLowerCase();Je&&!dt&&Ce&&(he(p)[Ce]=Je,p.lastUsernameHint=Je);return}const W=h(p),a=String(y.url||c.getURL()||""),f=ke(a),w=he(p);let d=Fe(y.username);const S=String(y.password||"");if(!W||!f)return;const O=/^\d{4,8}$/.test(S),V=/authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(a.toLowerCase());if(y.otpLike||V&&O)return;const G=String(w[f]||"").trim()||String(p.lastUsernameHint||"").trim(),fe=!!d&&!!S&&d.toLowerCase()===S.toLowerCase();d&&!fe?(w[f]=d,p.lastUsernameHint=d):w[f]?d=w[f]:p.lastUsernameHint&&(d=String(p.lastUsernameHint||"").trim());const ie=G||String(w[f]||"").trim()||String(p.lastUsernameHint||"").trim(),ge=!!d&&!!S&&d.toLowerCase()===S.toLowerCase();if(ge&&ie&&ie!==d&&(d=ie),!d||!S||ge&&(!ie||ie.toLowerCase()===d.toLowerCase()))return;const we=`${W}|${f}|${d}`,K=Date.now(),oe=ye.get(we)||0,pe=(A()[W]||[]).find(Ce=>ue(ne(Ce.domain))===ue(f)&&String(Ce.username||"").trim().toLowerCase()===d.toLowerCase());if(!(!pe||String(pe.password||"")!==S)&&K-oe<15e3)return;if(ye.set(we,K),await He(),xe(f)&&Ye(W,d,f)){(A()[W]||[]).find(dt=>ne(dt.domain)===f&&String(dt.username||"").trim().toLowerCase()===d.toLowerCase())&&window.api?.deleteProfileCredential&&(await window.api.deleteProfileCredential({profileId:W,domain:f,username:d}),await He());return}const ce=(A()[W]||[]).find(Ce=>ne(Ce.domain)===f&&String(Ce.username||"").trim().toLowerCase()===d.toLowerCase());if(!(ce&&String(ce.password||"")===S))try{if(!(await window.api.saveProfileCredential({profileId:W,domain:f,username:d,password:S}))?.success)return;await He()}catch(Ce){console.warn("Could not save remembered credential:",Ce)}}function D(c,p){!c||!p||c._oneviewCredentialPollId||(c._oneviewCredentialPollId=setInterval(()=>{if(typeof c.isDestroyed=="function"?c.isDestroyed():!1){clearInterval(c._oneviewCredentialPollId),c._oneviewCredentialPollId=null;return}p.id===L()&&B(c,p)},3e3))}async function Y(c=!1){const p=document.getElementById("httpAuthModal"),x=document.getElementById("httpAuthForm"),y=F();p&&!p.classList.contains("hidden")&&r(()=>p.classList.add("hidden")),x&&x.reset(),j(null),c&&y?.challengeId&&typeof window.api?.submitHttpAuthChallenge=="function"&&window.api.submitHttpAuthChallenge({challengeId:y.challengeId,cancelled:!0}).catch(()=>{})}async function ee(c={}){const p=document.getElementById("httpAuthModal"),x=document.getElementById("httpAuthModalTitle"),y=document.getElementById("httpAuthMessage"),U=document.getElementById("httpAuthUsernameInput"),R=document.getElementById("httpAuthPasswordInput"),W=document.getElementById("httpAuthRememberInput"),a=document.getElementById("httpAuthSubmitBtn");if(!p||!x||!y||!U||!R||!W||!a)return;F()?.challengeId&&Y(!0),j({...c});const f=String(c.reason||"")==="retry";x.textContent=f?"Login Failed, Update Credential":"Website Login Required";const w=String(c.host||c.url||"this website").trim(),d=String(c.realm||"").trim(),S=String(c.profileId||"").trim().toUpperCase();y.textContent=d?`${w} • ${d}${S?` • ${S}`:""}`:`${w}${S?` • ${S}`:""}`,U.value=String(c.username||""),R.value=String(c.password||""),W.checked=c.remember!==!1,a.textContent=f?"Update And Login":"Login",await o(()=>p.classList.remove("hidden")),R.value?(R.focus(),R.select()):(U.focus(),U.select())}function X(){const c=document.getElementById("httpAuthModal"),p=document.getElementById("httpAuthForm"),x=document.getElementById("httpAuthModalCloseBtn");!c||!p||!x||p.dataset.initialized!=="1"&&(p.dataset.initialized="1",x.addEventListener("click",()=>Y(!0)),c.addEventListener("click",y=>{y.target===c&&Y(!0)}),p.addEventListener("submit",async y=>{y.preventDefault();const U=F(),R=document.getElementById("httpAuthUsernameInput"),W=document.getElementById("httpAuthPasswordInput"),a=document.getElementById("httpAuthRememberInput");if(!U?.challengeId||!R||!W||typeof window.api?.submitHttpAuthChallenge!="function")return;const f=String(R.value||"").trim(),w=String(W.value||""),d=!!a?.checked;if(!(!f||!w))try{await window.api.submitHttpAuthChallenge({challengeId:U.challengeId,username:f,password:w,remember:d}),Y(!1)}catch(S){console.error("Failed to submit HTTP auth credential",S),t("Could not submit the website credential.","error")}}),typeof window.api?.onHttpAuthChallenge=="function"&&window.api.onHttpAuthChallenge(y=>{ee(y).catch(U=>{console.error("Failed to open HTTP auth modal",U)})}))}function re(){}async function te(c,p){if(!p||!p.rect)return;const x=c.getURL(),y=ke(x);if(!y)return;const U=[];if(Object.entries(A()).forEach(([W,a])=>{a.forEach(f=>{const w=ne(f.domain),d=ue(w),S=ue(y);if(d===S||S.endsWith(`.${d}`)&&d.split(".").length>1){const O=n.PROFILES[W]||{name:W,color:"#ccc"};U.push({...f,profileId:W,profileName:O.name,profileColor:O.color})}})}),U.length===0)return;const R=`if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(U)});
    }`;c.executeJavaScript(R,!0).catch(()=>{})}return{canUseSecureCredentialApi:Me,getAutofillCredentialForTab:it,initHttpAuthPrompt:X,initPasswordManager:re,installCredentialCaptureHooks:$,isCredentialAutomationDomain:Ne,isLikelyAuthPage:Ee,maybeOfferRememberCredentials:B,normalizeDomain:ne,refreshCredentialCacheIfStale:Ge,scheduleCredentialAutofill:m,shouldEnableCredentialAutomation:Te,startCredentialCapturePolling:D,handleCredentialFieldInteraction:te,hideCredentialDropdown:()=>{}}}function Bi({state:e,constants:n,createNativePageDescriptor:t,ensureNativeSettingsGeneralInfo:o,normalizeSettingsSection:r,renderNativeSettingsPage:u,closeBrowserExtensionsMenu:h,closeBrowserExtensionPopup:C,refreshBrowserExtensionsUi:P,refreshTabScrollControls:k,syncProfileSelectionForTab:b,updateProfileLockUI:I,perfMark:L,shouldRequirePlatformApiForNavigation:A,getWebviewPlatformApiFlag:N,setWebviewPlatformApiFlag:F,getWebviewPreloadPathCached:j,startCredentialCapturePolling:Q,scheduleCredentialAutofill:de,installCredentialCaptureHooks:q,refreshCredentialCacheIfStale:se,getAutofillCredentialForTab:ye,resolveAssignedProfileIdForTab:Le,getCredentialScopeIdByPartition:nt,resolveCredentialScopeIdForTab:Me,maybeOfferRememberCredentials:ne,syncTabProfileForPage:ue,trackProfileHistory:qe,resolveProfileIdForTab:ke,resolveAssignedProfileId:xe,resolveStrictProfileNavigationTarget:Pe,resolveNavigationPartition:Ye,applyProfileSelection:Fe,openProfilePromptDialog:Ue,handleCredentialFieldInteraction:He,hideCredentialDropdown:Ge}){const{PARTITIONS:he,PROFILES:Ee,LOCAL_WEB_APP_TYPES:Ne,WEBVIEW_POOL_MAX:Te=6,WEBVIEW_POOL_KEEPALIVE_MS:Ke=6e4,TAB_PREWARM_ENABLED:ot=!1,PREWARM_ALL_PROFILE_PARTITIONS:it=!1}=n,ve=[];let m=null;const $=new Map,E=()=>e.tabs,B=i=>{e.tabs=i},D=()=>e.activeTabId,Y=i=>{e.activeTabId=i},ee=()=>e.currentProfileId;function X(i){const s=document.querySelector(".browser-controls-overlay");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result"));l&&i&&(i.hideBrowserControls=!1);const g=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);s.classList.toggle("hidden",g),l?(s.classList.remove("hidden"),s.style.setProperty("display","flex","important"),s.style.setProperty("visibility","visible","important"),s.style.setProperty("opacity","1","important"),s.style.setProperty("height","40px","important")):(s.style.removeProperty("display"),s.style.removeProperty("visibility"),s.style.removeProperty("opacity"),s.style.removeProperty("height"))}function re(i){const s=document.getElementById("browserDetachHeader");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),g=(!i||i.isHome||!!i.hideBrowserControls||!!i.nativePage)&&!l;s.classList.toggle("hidden",g)}function te(i){const s=document.querySelector(".profile-section");if(!s)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),g=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);s.classList.toggle("hidden",g)}function c(i,s){const l=E().find(v=>v.id===i);if(!l)return;l.title=s;const g=document.getElementById(`tab-ui-${i}`);g&&(g.querySelector(".tab-title").textContent=s)}function p(){const i=D();return i&&E().find(s=>s.id===i)||null}function x(){const i=D();return i?document.getElementById(`webview-${i}`):null}function y(i){const s=document.getElementById("urlDisplay");s&&(s.value=i)}function U(i){const s=document.getElementById("urlDisplay");s&&(s.value=i)}function R(){const i=document.getElementById("browserBack"),s=document.getElementById("browserForward"),l=x();i&&(i.disabled=l?!l.canGoBack():!0),s&&(s.disabled=l?!l.canGoForward():!0)}function W(i){i&&(i._oneviewCredentialPollId&&(clearInterval(i._oneviewCredentialPollId),i._oneviewCredentialPollId=null),i._oneviewAutofillTimer&&(clearTimeout(i._oneviewAutofillTimer),i._oneviewAutofillTimer=null))}function a(i){document.querySelectorAll(".webviews-container .webcontent-pane").forEach(l=>{const g=l.id.replace("webview-",""),v=E().find(H=>H.id===g);g===i&&!v?.isHome&&v?.credentialAutomationEnabled?Q(l,v):W(l)})}function f(i,s=E().length-1){const l=document.getElementById("tabsList");if(!l)return;const g=document.createElement("div");g.className="tab",g.id=`tab-ui-${i.id}`,g.innerHTML=`
        <span class="tab-title">${i.title}</span>
        <button class="tab-close">x</button>
    `,g.addEventListener("click",H=>{H.target.classList.contains("tab-close")||G(i.id)}),g.querySelector(".tab-close").addEventListener("click",H=>{H.stopPropagation(),ge(i.id)});const T=l.children[s]||null;l.insertBefore(g,T),k()}function w(i){setTimeout(async()=>{const s=E().find(g=>g.id===i);if(!(!s||!s.isHome||document.getElementById(`webview-${i}`)))try{const g=await ce(s);if(!g)return;g.classList.remove("active"),typeof g.hide=="function"&&g.hide().catch(()=>{}),g.syncBounds?.(!1)}catch(g){window.api.webContentCall("log-error",{key:`prewarm-err:${i}:${g.toString()}`}).catch(()=>{})}},0)}async function d(i=null,s=null,l="New Tab",g=null,v={}){const T=v.active!==!1;window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?s=he.gsk:s=ft(s||(Ee[ee()]?Ee[ee()].partition:he.guest));const z=`tab-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,M={id:z,title:l,url:i,partition:s,isHome:!i&&!v.nativePage,nativePage:v.nativePage&&typeof v.nativePage=="object"?t(v.nativePage.type||"settings",v.nativePage.section||"general"):null,lockedProfileId:g,hideBrowserControls:!1,launchedAppType:null,trackingAppId:"",trackingAppName:"",requiresPlatformApi:!1,extensionCompatEnabled:!1,extensionEntryPath:"",extensionActiveContext:{url:"",title:""},credentialAutomationEnabled:!1,lastCredentialSourceProfileId:null};M.trackingAppId=String(v.trackingAppId||"").trim(),M.trackingAppName=String(v.trackingAppName||l||M.title||"").trim(),M.extensionEntryPath=String(v.extensionEntryPath||"").trim(),M.extensionCompatEnabled=!!M.extensionEntryPath,M.extensionActiveContext=v.extensionActiveContext&&typeof v.extensionActiveContext=="object"?{url:String(v.extensionActiveContext.url||"").trim(),title:String(v.extensionActiveContext.title||"").trim()}:{url:"",title:""};const J=E(),Se=J.findIndex(at=>at.id===D()),We=Number.isInteger(v.insertIndex)?Math.max(0,Math.min(v.insertIndex,J.length)):Se>=0?Se+1:J.length;if(J.splice(We,0,M),f(M,We),M.nativePage)await G(z);else if(i){T&&Y(z);const at=document.getElementById("view-home-content"),_t=document.getElementById("webviews-container");T&&at&&at.classList.add("hidden");const yi=i&&(i.includes("result.html")||i.includes("extension-icon")||i.toLowerCase().includes("result"));if(T&&_t){_t.classList.remove("hidden");let Ve=document.getElementById("tab-load-placeholder");yi?Ve&&(Ve.style.display="none"):Ve?Ve.style.display="flex":(Ve=document.createElement("div"),Ve.id="tab-load-placeholder",Ve.style.cssText=["position:absolute","inset:0","z-index:50","display:flex","flex-direction:column","align-items:center","justify-content:center","background:var(--bg-main,#f8fafc)","gap:16px"].join(";"),Ve.innerHTML=`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `,_t.appendChild(Ve));const sn=()=>{Ve&&(Ve.style.display="none")},an=$e=>{$e&&(typeof $e._oneviewPlaceholderFinalize=="function"&&($e.removeEventListener("did-stop-loading",$e._oneviewPlaceholderFinalize),$e.removeEventListener("did-fail-load",$e._oneviewPlaceholderFinalize)),$e._oneviewPlaceholderFinalize=null)},ln=setInterval(()=>{const $e=document.getElementById(`webview-${z}`);if(!$e)return;clearInterval(ln),clearTimeout(cn);const Dt=()=>{an($e),clearTimeout(cn),sn()};an($e),$e._oneviewPlaceholderFinalize=Dt,$e.addEventListener("did-stop-loading",Dt,{once:!0}),$e.addEventListener("did-fail-load",Dt,{once:!0})},100),cn=setTimeout(()=>{clearInterval(ln),sn()},12e3)}await we(z,i,s,l,g,v,T)}else await G(z),ot&&w(z);return M}function S(i=D()){const s=E(),l=s.find(z=>z.id===i);if(!l)return;const g=s.findIndex(z=>z.id===l.id),v=document.getElementById(`webview-${l.id}`),T=v&&typeof v.getURL=="function"&&v.getURL()||l.url||"",H=v&&typeof v.getTitle=="function"&&v.getTitle()||l.title||"New Tab";d(l.isHome||!T||T==="about:blank"?null:T,l.partition,H,l.lockedProfileId||null,{insertIndex:g>=0?g+1:s.length,trackingAppId:l.trackingAppId||"",trackingAppName:l.trackingAppName||H})}function O(i){const s=E();if(!s.length)return;const l=s.findIndex(T=>T.id===D()),v=((l>=0?l:0)+i+s.length)%s.length;G(s[v].id,{suppressHomeSearchFocus:!0})}async function V(i){!i||typeof i.focusWebContents!="function"||await i.focusWebContents().catch(()=>{})}async function G(i,s={}){Y(i);const l=E().find(M=>M.id===i);if(!l)return;h(),C().catch(()=>{}),b(l),I(l),document.querySelectorAll(".tab").forEach(M=>M.classList.remove("active"));const g=document.getElementById(`tab-ui-${i}`);g&&g.classList.add("active");const v=document.getElementById("view-home-content"),T=document.getElementById("nativeTabContent"),H=document.getElementById("webviews-container"),z=document.querySelectorAll(".webviews-container .webcontent-pane");if(l.isHome){v.classList.remove("hidden"),T?.classList.add("hidden"),H.classList.add("hidden"),X(l),re(l),te(l);const M=document.getElementById("googleSearchInput");M&&s?.suppressHomeSearchFocus!==!0&&(M.value="",M.focus())}else if(l.nativePage)v.classList.add("hidden"),T?.classList.remove("hidden"),H.classList.add("hidden"),X(l),re(l),te(l),y(""),r(l.nativePage?.section)==="general"&&await o(),u(l);else{v.classList.add("hidden"),T?.classList.add("hidden"),H.classList.remove("hidden"),X(l),re(l),te(l),z.forEach(J=>{J.id!==`webview-${i}`&&(J.classList.remove("active"),typeof J.hide=="function"&&J.hide().catch(()=>{}),J.syncBounds?.(!1))});let M=null;try{M=document.getElementById(`webview-${i}`),M||(M=await ce(l))}catch(J){window.api.webContentCall("log-error",{key:`switchTab-create-err:${i}:${J.toString()}`}).catch(()=>{})}if(M)try{M.classList.add("active"),typeof M.show=="function"&&await M.show().catch(()=>{}),M.syncBounds?.(!0),await V(M),y(M.getURL())}catch(J){window.api.webContentCall("log-error",{key:`switchTab-show-err:${i}:${J.toString()}`}).catch(()=>{})}}a(l.id),P(),R()}function fe(i){if(!i)return!1;const s=String(i.launchedAppType||"").toLowerCase();return Ne.has(s)}function ie(i,s){if(!i||!s||!fe(s))return!1;const l=String(i.getAttribute("partition")||s.partition||"");if(!l)return!1;const g=i.parentElement;for(g&&g.removeChild(i),i.classList.remove("active"),ve.push({webview:i,partition:l,platformApiEnabled:N(i),at:Date.now()}),L("view-webcontent","park-to-pool",{partition:l,poolSize:ve.length});ve.length>Te;){const v=ve.shift();v&&v.webview&&!v.webview.isDestroyed?.()&&v.webview.remove()}return!0}function ge(i){const s=E(),l=s.findIndex(H=>H.id===i);if(l===-1)return;const g=D()===i;document.getElementById(`tab-ui-${i}`)?.remove();const v=document.getElementById(`webview-${i}`);if(v&&(W(v),(!fe(s[l])||!ie(v,s[l]))&&v.remove()),s.splice(l,1),s.length===0){Y(null),d(),k();return}const T=s.some(H=>H.id===D());if(g||!T){const H=Math.min(l,s.length-1),z=s[H]||s[s.length-1];z&&G(z.id)}k()}async function we(i,s,l,g,v=null,T={},H=!0){const z=performance.now(),M=E().find(Se=>Se.id===i);if(!M)return;M._navStartedAt=z,L("view-nav","navigateTo-start",{tabId:M.id,url:String(s||""),partition:String(l||""),appType:T.appType||null}),M.isHome=!1,M.url=s,M.partition=l,M.lockedProfileId=v,M.hideBrowserControls=!!T.hideControls,M.launchedAppType=T.appType||null,M.lastCredentialSourceProfileId=null,M.trackingAppId=String(T.trackingAppId||"").trim(),M.trackingAppName=String(T.trackingAppName||g||M.title||"").trim(),M.requiresPlatformApi=A(s,T),g&&c(i,g),H&&(Y(i),await G(i));let J=document.getElementById(`webview-${i}`);if(!J)J=await ce(M,H);else{const Se=J.getAttribute("partition"),We=N(J);(Se!==l||We!==!!M.requiresPlatformApi)&&(W(J),(!fe(M)||!ie(J,M))&&J.remove(),J=await ce(M,H))}H&&typeof J.show=="function"?await J.show().catch(()=>{}):!H&&typeof J.hide=="function"&&await J.hide().catch(()=>{}),typeof J.setMeta=="function"&&await J.setMeta({trackingAppId:M.trackingAppId,appName:M.trackingAppName,appType:M.launchedAppType||""}).catch(()=>{}),J.syncBounds?.(H),H&&(y(s),await V(J)),J.src!==s&&(J.src=s),L("view-nav","navigateTo-dispatch",{tabId:M.id,elapsedMs:Math.round(performance.now()-z)})}async function K(i,s,l,g=null,v={}){return we(D(),i,s,l,g,v,!0)}function oe(i){i&&i.executeJavaScript(`
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
      `,!0).catch(()=>{})}function pe(i=""){const s=String(i||"").trim().toLowerCase();return!!(!s||s==="about:blank"||s.startsWith("javascript:")||s.startsWith("data:")||s.startsWith("chrome-error://"))}function Z(i){i._hasTabListenersAttached||(i._hasTabListenersAttached=!0,i.addEventListener("ipc-message",async s=>{if(s.channel==="oneview:credential-field-focused")He(i,s.args[0]);else if(s.channel!=="oneview:credential-field-blurred"){if(s.channel==="oneview:credential-selected"){const l=s.args[0];if(l){i.executeJavaScript("window.__oneviewManualCredentialEditAt = 0;",!0).catch(()=>{}),de(i,l),l.profileId&&l.profileId!==ee()&&Fe(l.profileId);try{const g=i.getURL(),v=g?new URL(g).hostname.toLowerCase():"";v&&localStorage.setItem(`oneview:last-used-username:${l.profileId||ee()}:${v}`,l.username)}catch{}}}else if(s.channel==="oneview:credential-login-attempted"){const l=s.args[0];if(l&&l.username)try{const g=l.url?new URL(l.url).hostname.toLowerCase():"";g&&localStorage.setItem(`oneview:last-used-username:${ee()}:${g}`,l.username)}catch{}}else if(s.channel==="oneview:credential-submitted"){const l=s.args[0];if(l){i._oneviewSubmittedCredential=l;const g=i.id.replace("webview-",""),v=E().find(T=>T.id===g);v&&ne(i,v)}}}}),i.addEventListener("console-message",s=>{const l=String(s?.message||"");(l.includes("[OneView][Credential")||l.includes("[VeevaSlide]"))&&console.log("[WebviewConsole]",{level:s?.level,line:s?.line,sourceId:s?.sourceId||"",message:l})}),i.addEventListener("did-start-loading",()=>{const s=i.id.replace("webview-",""),l=E().find(v=>v.id===s);if(!l)return;l._didStartLoadingAt=performance.now(),L("view-webcontent","did-start-loading",{tabId:l.id,url:i.getURL()||l.url||""}),l.url&&(l.url.includes("result.html")||l.url.includes("extension-icon")||l.url.toLowerCase().includes("result"))?(c(l.id,"Result"),l.id===D()&&U(l.url||"")):(c(l.id,"Loading..."),l.id===D()&&U(l.url||"Loading..."))}),i.addEventListener("did-stop-loading",async()=>{const s=i.id.replace("webview-",""),l=E().find(Se=>Se.id===s);if(!l)return;const g=typeof l._didStartLoadingAt=="number"?Math.round(performance.now()-l._didStartLoadingAt):null,v=typeof l._navStartedAt=="number"?Math.round(performance.now()-l._navStartedAt):null;L("view-webcontent","did-stop-loading",{tabId:l.id,url:i.getURL()||"",loadElapsedMs:g,navElapsedMs:v});const T=i.getURL()||l.url||"";let z=T&&(T.includes("result.html")||T.includes("extension-icon")||T.toLowerCase().includes("result"))?"Result":i.getTitle()||l.title||"Tab";if(z==="Tab"||z==="Loading..."||!z)try{const Se=new URL(T);z=Se.hostname?Se.hostname.replace("www.",""):"Tab"}catch{z="Tab"}if((l.title==="Loading..."||l.title==="Tab"||!l.title||i.getTitle()&&i.getTitle()!=="about:blank")&&c(l.id,z),l.id===D()&&y(T),l.url=T,l.credentialAutomationEnabled=nn(T,z,l),l.credentialAutomationEnabled){const Se=Le(l,T,z),We=nt(l.partition)||Se||ee();await se();const at=ye(We,T,l);de(i,at),Q(i,l),q(i)}else W(i);await ue(l,T,z,i),wi(i,l);const J=ke(l);qe(J,T,z),oe(i)}),i.addEventListener("page-title-updated",s=>{const l=i.id.replace("webview-",""),g=E().find(v=>v.id===l);g&&(c(g.id,s.title),g.credentialAutomationEnabled&&ne(i,g))}),i.addEventListener("will-navigate",()=>{const s=i.id.replace("webview-",""),l=E().find(g=>g.id===s);l&&l.credentialAutomationEnabled&&ne(i,l)}),i.addEventListener("did-navigate",s=>{const l=i.id.replace("webview-",""),g=E().find(H=>H.id===l);if(!g)return;const v=s.url||i.getURL()||"";g.url=v,g.id===D()&&(y(v),R());const T=ke(g);qe(T,v,i.getTitle()||g.title||"")}),i.addEventListener("did-navigate-in-page",async s=>{const l=i.id.replace("webview-",""),g=E().find(M=>M.id===l);if(!g)return;const v=s.url||i.getURL()||"";g.url=v,g.id===D()&&(y(v),R());const T=ke(g);if(qe(T,v,i.getTitle()||g.title||""),i.addEventListener("history-changed",M=>{_=M,g.id===D()&&R()}),g.credentialAutomationEnabled=nn(v,i.getTitle()||g.title||"",g),!g.credentialAutomationEnabled){W(i);return}ne(i,g),await se();const H=nt(g.partition)||Le(g,v,i.getTitle()||g.title||"")||Me(g),z=ye(H,v,g);de(i,z),Q(i,g)}),i.addEventListener("new-window",async s=>{const l=i.id.replace("webview-",""),g=E().find(Se=>Se.id===l);if(!g)return;typeof s?.preventDefault=="function"&&s.preventDefault();const v=String(s?.url||"").trim();if(pe(v))return;const T=String(i.getURL()||"").trim();if(T&&T===v)return;let H=xe(v,"New Tab"),z=null;if(H)z=Ee[H].partition;else if(Ue){const Se=ke(g)||"guest",We=await Ue(v,Se);if(We&&!We.cancelled&&We.profileId)H=We.profileId,z=Ee[H]?.partition;else return}else z=g.partition;const M=E(),J=M.findIndex(Se=>Se.id===g.id);d(v,z,"New Tab",H,{insertIndex:J>=0?J+1:M.length})}))}async function ce(i,s=!0){if($.has(i.id))return $.get(i.id);const l=Je(i,s);$.set(i.id,l);try{return await l}finally{$.delete(i.id)}}function Ce(i){const s=String(i?.partition||"");if(!s||ve.length===0)return null;const l=!!i?.requiresPlatformApi,g=ve.findIndex(T=>T.partition===s&&!!T.platformApiEnabled===l);if(g===-1)return null;const[v]=ve.splice(g,1);return v?.webview||null}async function Je(i,s=!0){const l=performance.now(),g=document.getElementById("webviews-container"),v=Ce(i);if(v)return v.classList.toggle("active",s),v.id=`webview-${i.id}`,v.setAttribute("partition",i.partition),F(v,!!i.requiresPlatformApi),Z(v),g.appendChild(v),s&&typeof v.show=="function"?v.show().catch(()=>{}):!s&&typeof v.hide=="function"&&v.hide().catch(()=>{}),v.syncBounds?.(s),s&&typeof v.focusWebContents=="function"&&v.focusWebContents().catch(()=>{}),L("view-webcontent","reuse-pooled",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l),poolSize:ve.length}),v;const T=j(),H=await un({key:`view:${i.id}`,partition:i.partition,preloadPath:T,additionalArguments:i.requiresPlatformApi?["--oneview-enable-platform-api=1"]:[],extensionEntryPath:i.extensionEntryPath,extensionActiveContext:i.extensionActiveContext,extensionCompat:!0,initialMeta:{trackingAppId:i.trackingAppId,appName:i.trackingAppName,appType:i.launchedAppType||"",extensionEntryPath:i.extensionEntryPath},className:`webcontent-pane${s?" active":""}`});return H.id=`webview-${i.id}`,H.setAttribute("partition",i.partition),F(H,!!i.requiresPlatformApi),Z(H),g.appendChild(H),!s&&typeof H.hide=="function"&&H.hide().catch(()=>{}),H.syncBounds?.(s),s&&typeof H.focusWebContents=="function"&&H.focusWebContents().catch(()=>{}),L("view-webcontent","create-fresh",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l)}),H}function dt(){m||(m=setInterval(()=>{if(!document.hidden&&ve.length!==0)for(let i=ve.length-1;i>=0;i-=1){const l=ve[i]?.webview;if(!l||l.isDestroyed?.()){ve.splice(i,1);continue}l.executeJavaScript("void 0",!1).catch(()=>{})}},Ke))}async function tn(i){const s=String(i||"").trim();if(!s||ve.some(T=>T.partition===s))return;const l=document.getElementById("webviews-container");if(!l)return;const g=j(),v=`view:prewarm:${s}:${Date.now()}`;try{const T=await un({key:v,partition:s,preloadPath:g,className:"webcontent-pane"});T.id=`webview-prewarm-${Date.now()}`,l.appendChild(T),T.syncBounds?.(),ie(T,{launchedAppType:"website",partition:s})}catch{}}async function di(){const i=Array.from(new Set(Object.values(Ee).map(s=>String(s?.partition||"").trim()).filter(Boolean)));for(const s of i)await tn(s),await new Promise(l=>setTimeout(l,60))}async function ui(){const i=Ee[ee()]?.partition||Ee.guest.partition;i&&await tn(i)}function pi(){dt(),ot&&(it?di():ui())}function fi(){for(m&&(clearInterval(m),m=null);ve.length>0;){const i=ve.shift();i&&i.webview&&!i.webview.isDestroyed?.()&&i.webview.remove()}}function mi(i,s=null){return!(!i||i.isHome)}function wi(i,s){if(!i||!s||s.launchedAppType!=="website")return;const l=`
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
  `;try{i.insertCSS(l)}catch(g){console.warn("Could not apply website scrollbar theme:",g)}}function gi(){const i=E().find(l=>l.id===D());if(!i||i.isHome)return;i.isHome=!0,i.url=null,i.lockedProfileId=null,c(i.id,"New Tab");const s=document.getElementById(`webview-${i.id}`);s&&(W(s),(!fe(i)||!ie(s,i))&&s.remove()),G(i.id)}function hi(i=""){const s=String(i||"").trim();if(!s)return"";const l=s.match(/^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/);if(l){const v=l[1].toUpperCase(),T=decodeURIComponent(l[2]).replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${v}:/${T}`}if(/^file:\/\//i.test(s)||/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^about:/i.test(s))return s;const g=s.match(/^([a-zA-Z])[:/\\](.*)$/);if(g){const v=g[1].toUpperCase(),T=g[2].replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${v}:/${T}`}if(/^\/[A-Za-z]\//.test(s)){const v=s[1].toUpperCase(),T=s.slice(3).replace(/\\/g,"/");return`file:///${v}:/${T}`}return/^\\\\/.test(s)?`file:${s.replace(/\\/g,"/")}`:s}function $t(i=""){const s=String(i||"").trim();return!s||/\s/.test(s)?!1:!!(/^about:/i.test(s)||/^[a-z][a-z0-9+.-]*:\/\//i.test(s)||/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(s)||/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(s)||s.includes(".")||/[/:?#]/.test(s))}async function vi(i){if(i=hi(i),!i)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){let v=i;$t(i)?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&(v=`https://${i}`):v=`https://www.google.com/search?q=${encodeURIComponent(i)}`,await K(v,he.gsk,i);return}let s=i,l=$t(i);if(l?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&!/^file:\/\//i.test(i)&&(s=`https://${i}`):$t(i)?(s=`https://${i}`,l=!0):s=`https://www.google.com/search?q=${encodeURIComponent(i)}`,l){const v=await Pe(s,null,"New Tab");if(!v||v.cancelled)return;const T=v.profileId,H=v.partition;T&&T!==ee()&&Fe(T,{bypassLock:!0}),await K(s,H,"New Tab",v.lockedProfileId);return}const g=Ye(s,p()?.partition||Ee[ee()]?.partition||he.guest,"Google Search");await K(s,g,"Google Search")}function bi(i,{isTeardown:s=!1}={}){const l=E(),g=Array.isArray(i)?i.filter(Boolean):[];if(g.length===0||l.length===0)return;const v=new Set(g),T=[...l],H=T.findIndex(z=>z.id===D());if(T.forEach(z=>{if(!v.has(z.id))return;document.getElementById(`tab-ui-${z.id}`)?.remove();const M=document.getElementById(`webview-${z.id}`);M&&(W(M),(!fe(z)||!ie(M,z))&&M.remove())}),B(T.filter(z=>!v.has(z.id))),E().length===0){Y(null),s||(d(),k());return}if(v.has(D())){const z=Math.min(Math.max(H,0),E().length-1);Y(E()[z].id)}G(D()||E()[0].id),k()}function nn(i="",s="",l=null){return l?l.launchedAppType==="website"||!l.launchedAppType?on(i,s)||rn(i):!0:!1}function on(i="",s=""){const l=`${String(i||"")} ${String(s||"")}`.toLowerCase();if(/login|sign in|signin|password|sso|authenticate|verify/.test(l))return!0;try{const g=new URL(String(i||"")),v=`${g.pathname.toLowerCase()} ${g.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(v)}catch{return!1}}function rn(i=""){let s="";try{s=new URL(String(i||"")).hostname.toLowerCase()}catch{return!1}return s==="10.215.56.196"||s.endsWith(".gskinternet.com")||s.endsWith(".gskpro.com")||s.endsWith(".veevavault.com")||s.endsWith(".okta.com")||s.endsWith(".oktacdn.com")||s.endsWith(".pingone.com")}return{closeTab:ge,closeTabsBulk:bi,createTab:d,createWebviewForTab:ce,duplicateTab:S,disposeWebviewRuntime:fi,getActiveTab:p,getActiveWebview:x,goToActiveTabHome:gi,isInspectableLocalFileTab:mi,navigateTo:K,navigateToTab:we,performSearch:vi,startWebviewRuntime:pi,switchRelativeTab:O,switchTab:G,updateTabTitle:c,updateUrlDisplay:y,updateUrlDisplayString:U,getCurrentProfileId:ee,getTabs:E}}console.log("View Page Script initializing...");let le=[],Re=null,kt=!1,Un=null,pn=null,fn=[],mn=[],wn={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};const Vt=Ze.profileHistory,jt="view.profileHistory.v1";let Ae={wppproduction:[],vml:[],gsk:[],guest:[]};const Nn=Ze.customBookmarks;let _e=[],gn="guest",Ft="guest",hn="",lt="guest",Ct=null,Xe=null,vn=null;const Ai=new Set(["login.veevavault.com","federation.gsk.com"]);let gt=null,De=-1,Oe=[],bn={version:"",defaultOpenStatus:""},yn=0,Sn=null,En=!1;const On=Ze.perfEnabled;let ut=null,xn=!1;const Et={};Object.defineProperties(Et,{tabs:{get:()=>le,set:e=>{le=e}},activeTabId:{get:()=>Re,set:e=>{Re=e}},browserExtensionsCache:{get:()=>fn,set:e=>{fn=e}},managedDownloadsCache:{get:()=>mn,set:e=>{mn=e}},nativeSettingsGeneralInfo:{get:()=>bn,set:e=>{bn=e}},historyProfileId:{get:()=>Ft,set:e=>{Ft=e}},historySearchQuery:{get:()=>hn,set:e=>{hn=e}},currentProfileId:{get:()=>me,set:e=>{me=e}},profileHistoryCache:{get:()=>Ae,set:e=>{Ae=e}},credentialCache:{get:()=>wn,set:e=>{wn=e}},passwordProfileId:{get:()=>gn,set:e=>{gn=e}},passwordEditTarget:{get:()=>pn,set:e=>{pn=e}},activeHttpAuthChallenge:{get:()=>vn,set:e=>{vn=e}},credentialCacheRefreshedAt:{get:()=>yn,set:e=>{yn=e}},credentialCacheRefreshInFlight:{get:()=>Sn,set:e=>{Sn=e}}});const Ht={synapse:{partition:be.synapse},contentgen:{partition:be.contentgen}},zt=new Set(["nextjs","vite","react","angular","html","neutralino","website","vite-server"]),Rn=(()=>{try{return new URL(Mn).origin.toLowerCase()}catch{return""}})(),Ti=new URL(""+new URL("contentgen-DZqnGDPH.png",import.meta.url).href,import.meta.url).href,$i=new URL(""+new URL("contentgen-dark-C7HM67Tp.png",import.meta.url).href,import.meta.url).href;function Cn(e=document){if(!e||typeof e.querySelectorAll!="function")return;const n=document.body.classList.contains("dark-mode");e.querySelectorAll("img[data-theme-icon]").forEach(t=>{const o=String(t.getAttribute("data-theme-icon")||"").trim();let r="";o==="contentgen"&&(r=n?$i:Ti),r&&t.getAttribute("src")!==r&&t.setAttribute("src",r)})}function _i(){["httpAuthModal","bookmarkModal","cacheActionModal","extensionsManagerModal"].forEach(e=>{const n=document.getElementById(e);!n||n.dataset.hoistedToBody==="1"||(document.body.appendChild(n),n.dataset.hoistedToBody="1")})}async function In(){const e=tt();if(!(!e||e.isHome||!e.url||!window.api?.openDetachedViewWindow))try{await window.api.openDetachedViewWindow({url:e.url,title:e.title||"Detached Tab",partition:e.partition||be.guest}),Yt(e.id)}catch(n){console.error("Failed to open detached tab window",n),ze("Could not open the page in a separate window.","error")}}function Tt(){if(ut!==null)return ut;try{const e=localStorage.getItem(On);return ut=e==="1"||e==="true",ut}catch{return ut=!1,!1}}function Fn(e,n,t=null){if(!Tt())return;const o=t?{...t}:{};try{console.log(`[PERF][${e}] ${n}`,o)}catch{}}window.addEventListener("storage",e=>{e.key===On&&(ut=null,window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Tt()).catch(()=>{}))});const ae={wppproduction:{id:"wppproduction",name:"WPPProduction",partition:be.wppproduction,color:"#000000",bgColor:"#e2e8f0",label:"W"},vml:{id:"vml",name:"VML",partition:be.vml,color:"#ff0000",bgColor:"#fee2e2",label:"V"},gsk:{id:"gsk",name:"GSK",partition:be.gsk,color:"#f37521",bgColor:"#ffedd5",label:"G"},guest:{id:"guest",name:"Guest",partition:be.guest,color:"#64748b",bgColor:"#f1f5f9",label:"?"}};let me="guest";function Di(){return me}const Mi=Pi({state:Et,constants:{AUTH_GATEWAY_HOSTS:Ai,RESOURCE_SERVICE_ORIGIN:Rn,PROFILES:ae},showToast:ze,openOverlayModal:st,closeOverlayModal:Qe,renderProfilePillSelect:Xt,resolveCredentialScopeIdForTab:ei,applyProfileSelection:wt,getCurrentProfileId:()=>me,escapeHtml:Ie}),{getAutofillCredentialForTab:Ui,initHttpAuthPrompt:Ni,installCredentialCaptureHooks:Oi,isLikelyAuthPage:Ri,maybeOfferRememberCredentials:Fi,refreshCredentialCacheIfStale:Hi,scheduleCredentialAutofill:Wi,startCredentialCapturePolling:Vi,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi}=Mi;let ct=null,ht=null;const qi=ki({state:Et,constants:{PROFILES:ae,PENDING_EXTENSION_OPEN_STORAGE_KEY:"oneview.pendingExtensionOpenPath",EXTENSION_PIN_STORAGE_KEY:"oneview.browserExtensions.pinned.v1",IS_DEV_APP_BUILD:Lt},escapeHtml:Ie,showToast:ze,openOverlayModal:st,closeOverlayModal:Qe,getActiveTab:(...e)=>ht?.getActiveTab?.(...e)??null,getActiveWebview:(...e)=>ht?.getActiveWebview?.(...e)??null,createTab:(...e)=>ht?.createTab?.(...e),refreshActiveNativeSettingsPage:(...e)=>ct?.refreshActiveNativeSettingsPage?.(...e)??Promise.resolve(),closeSettingsMenu:Eo}),{closeBrowserExtensionPopup:qt,closeBrowserExtensionsMenu:Yi,formatDownloadBytes:Gi,formatDownloadEta:Ki,formatDownloadSpeed:Ji,initDownloadsManager:Xi,initExtensionsManager:Qi,loadManagedDownloadsFromMain:Zi,refreshBrowserExtensionsUi:eo,refreshExtensionsManagerList:Hn}=qi;ht=Bi({state:Et,constants:{PARTITIONS:be,PROFILES:ae,LOCAL_WEB_APP_TYPES:zt,WEBVIEW_POOL_MAX:6,WEBVIEW_POOL_KEEPALIVE_MS:12e3,TAB_PREWARM_ENABLED:!0,PREWARM_ALL_PROFILE_PARTITIONS:!1},createNativePageDescriptor:(...e)=>ct?.createNativePageDescriptor?.(...e)??null,ensureNativeSettingsGeneralInfo:(...e)=>ct?.ensureNativeSettingsGeneralInfo?.(...e)??Promise.resolve(),normalizeSettingsSection:(...e)=>ct?.normalizeSettingsSection?.(...e)??"general",renderNativeSettingsPage:(...e)=>ct?.renderNativeSettingsPage?.(...e),closeBrowserExtensionsMenu:Yi,closeBrowserExtensionPopup:qt,refreshBrowserExtensionsUi:eo,refreshTabScrollControls:At,syncProfileSelectionForTab:ko,updateProfileLockUI:bt,perfMark:Fn,shouldRequirePlatformApiForNavigation:_o,getWebviewPlatformApiFlag:Do,setWebviewPlatformApiFlag:Mo,getWebviewPreloadPathCached:$o,startCredentialCapturePolling:Vi,scheduleCredentialAutofill:Wi,installCredentialCaptureHooks:Oi,refreshCredentialCacheIfStale:Hi,getAutofillCredentialForTab:Ui,resolveAssignedProfileIdForTab:Yn,getCredentialScopeIdByPartition:Vn,resolveCredentialScopeIdForTab:ei,maybeOfferRememberCredentials:Fi,syncTabProfileForPage:Po,trackProfileHistory:To,resolveProfileIdForTab:Zn,resolveAssignedProfileId:St,resolveStrictProfileNavigationTarget:Gn,resolveNavigationPartition:pt,applyProfileSelection:wt,openProfilePromptDialog:Io,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi});const{closeTab:Yt,closeTabsBulk:vt,createTab:Be,createWebviewForTab:to,duplicateTab:no,disposeWebviewRuntime:Wn,getActiveTab:tt,getActiveWebview:et,goToActiveTabHome:io,isInspectableLocalFileTab:oo,navigateTo:yt,navigateToTab:ro,performSearch:Pt,startWebviewRuntime:so,switchRelativeTab:xt,switchTab:je,updateTabTitle:ao,updateUrlDisplay:lo,updateUrlDisplayString:Ln,getTabs:kn}=ht;ct=Li({state:Et,constants:{PROFILES:ae,PARTITIONS:be,IS_DEV_APP_BUILD:Lt},escapeHtml:Ie,showToast:ze,isPerfEnabled:Tt,formatDownloadBytes:Gi,formatDownloadSpeed:Ji,formatDownloadEta:Ki,formatHistoryTime:ti,loadManagedDownloadsFromMain:Zi,refreshExtensionsManagerList:Hn,saveProfileHistoryStore:Qt,getActiveTab:tt,updateTabTitle:ao,createTab:Be,switchTab:je,navigateTo:yt});const{bindSettingsShortcutsGlobal:co,createNativePageDescriptor:mr,ensureNativeSettingsGeneralInfo:wr,getSettingsTabTitle:gr,initNativeSettingsUi:uo,initSettingsMenu:po,isEditableShortcutTarget:fo,isNativeSettingsTab:hr,normalizeSettingsSection:vr,openSettingsTab:Wt,refreshActiveNativeSettingsPage:mo,renderNativeSettingsPage:br,updateNativeSettingsTabSection:yr}=ct;function wo(){try{return localStorage.getItem("username")==="Guest"}catch{return!1}}function go(e="",n="",t=""){const o=String(t||"").trim().toLowerCase();if(Ht[o])return o;const r=String(n||"").trim().toLowerCase(),u=String(e||"").trim().toLowerCase();try{const h=new URL(String(e||"")),C=`${h.protocol}//${h.host}`.toLowerCase(),P=String(h.pathname||"/").toLowerCase();if(C===Rn&&(P==="/"||P===""))return"synapse";if(C==="http://10.215.56.196:3456")return"contentgen"}catch{}return/content[\s-]*gen/.test(r)||/content[\s-]*gen/.test(u)?"contentgen":r.includes("synapse")?"synapse":""}function Gt(e){const n=ft(e);if(n===be.synapse||n===be.contentgen)return"guest";const t=Object.values(ae).find(o=>o.partition===n);return t?t.id:null}function Vn(e){const n=ft(e);return n===be.synapse?"synapse":n===be.contentgen?"contentgen":Gt(n)}function pt(e="",n="",t="",o={}){const r=String(o?.sessionScope||o?.credentialScope||"").trim()||"",u=go(e,t,r);return u&&Ht[u]?Ht[u].partition:ft(n||ae[me]?.partition||be.guest)}async function ho(){const e=document.getElementById("view-synapse-link-btn");if(!e||(e.style.display="none",wo()))return;const n=String(localStorage.getItem("emp_id")||"").trim(),t=String(localStorage.getItem("username")||"").trim(),o=/^\d+$/.test(t)?t:"",r=n||o;if(r)try{const u=await fetch(`${Mn}/api/list_of_users`,{signal:AbortSignal.timeout(5e3)});if(!u.ok)throw new Error(`API returned ${u.status}`);const h=await u.json(),C=Array.isArray(h)?h:Array.isArray(h?.users)?h.users:[],P=new Set(C.map(k=>String(k?.emp_id??"").trim()).filter(Boolean));e.style.display=P.has(r)?"flex":"none"}catch(u){console.warn("Could not verify Synapse visibility in view",u),e.style.display="none"}}function vo(e="",n="addressSearchDropdown"){const t=document.getElementById(n);if(!t)return;const o=String(e||"").trim().toLowerCase();if(!o){t.classList.add("hidden"),Oe=[],De=-1;return}const r=le.filter(b=>{const I=String(b.title||"").toLowerCase(),L=String(b.url||"").toLowerCase();return I.includes(o)||L.includes(o)}).map(b=>({type:"tab",id:b.id,title:b.title||"Untitled Tab",url:b.url||"",partition:b.partition}));let u=[];Object.values(Ae).forEach(b=>{Array.isArray(b)&&b.forEach(I=>{const L=String(I.title||"").toLowerCase(),A=String(I.url||"").toLowerCase();if(L.includes(o)||A.includes(o)){const N=u.some(j=>j.url===I.url),F=r.some(j=>j.url===I.url);!N&&!F&&u.push({type:"history",title:I.title||"History Item",url:I.url,partition:I.partition||be.guest})}})}),Oe=[{type:"search",title:e,url:`Search for "${e}"`},...r.slice(0,5),...u.slice(0,15)],De=0;let C="";C+=Mt(Oe[0],0);const P=Oe.filter(b=>b.type==="tab");P.length>0&&(C+='<div class="address-search-group-label">Open Tabs</div>',P.forEach(b=>{const I=Oe.indexOf(b);C+=Mt(b,I)}));const k=Oe.filter(b=>b.type==="history");k.length>0&&(C+='<div class="address-search-group-label">History</div>',k.forEach(b=>{const I=Oe.indexOf(b);C+=Mt(b,I)})),t.innerHTML=C,t.classList.remove("hidden")}function Mt(e,n){const t=n===De;let o=String(e.title||"H").charAt(0).toUpperCase(),r="is-history",u="History";return e.type==="tab"?(r="is-tab",u="Tab"):e.type==="search"&&(r="is-search",u="Search",o="🔍"),`
    <div class="address-search-item ${r} ${t?"is-selected":""}" 
         data-index="${n}">
      <div class="address-search-item-icon">${o}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${Ie(e.title)}</span>
        <span class="address-search-item-url">${Ie(e.url)}</span>
      </div>
      <div class="address-search-item-badge">${u}</div>
    </div>
  `}async function Pn(e,n){const t=document.getElementById(e);if(!t)return;if(De<0||De>=Oe.length){Pt(t.value);return}const o=Oe[De],r=document.getElementById(n);r&&r.classList.add("hidden"),o.type==="tab"?await je(o.id):o.type==="history"?await ni(o.url,o.partition,o.title):Pt(t.value),t.blur()}function Bn(e,n){const t=document.getElementById(e),o=document.getElementById(n);!t||!o||(t.addEventListener("input",()=>{vo(t.value,n)}),t.addEventListener("keydown",r=>{o.classList.contains("hidden")||(r.key==="ArrowDown"?(r.preventDefault(),De=(De+1)%Oe.length,An(n)):r.key==="ArrowUp"?(r.preventDefault(),De=(De-1+Oe.length)%Oe.length,An(n)):r.key==="Enter"?(r.preventDefault(),Pn(e,n)):r.key==="Escape"&&o.classList.add("hidden"))}),o.addEventListener("click",r=>{const u=r.target.closest(".address-search-item");if(!u)return;const h=parseInt(u.dataset.index);isNaN(h)||(De=h,Pn(e,n))}))}function An(e){const n=document.getElementById(e);n&&n.querySelectorAll(".address-search-item").forEach((t,o)=>{const r=parseInt(t.dataset.index);t.classList.toggle("is-selected",r===De),r===De&&t.scrollIntoView({block:"nearest"})})}function bo(){const e=document.getElementById("googleSearchInput");e&&e.dataset.boundAddressInput!=="1"&&(e.dataset.boundAddressInput="1",e.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdownHome");o&&!o.classList.contains("hidden")||t.key==="Enter"&&Pt(e.value)}),Bn("googleSearchInput","addressSearchDropdownHome"));const n=document.getElementById("urlDisplay");n&&n.dataset.boundAddressInput!=="1"&&(n.dataset.boundAddressInput="1",n.addEventListener("focus",()=>{n.select?.()}),n.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdown");if(!(o&&!o.classList.contains("hidden"))){if(t.key==="Enter")t.preventDefault(),Pt(n.value),n.blur();else if(t.key==="Escape"){t.preventDefault();const r=tt();lo(r?.url||""),n.blur()}}}),Bn("urlDisplay","addressSearchDropdown"))}function jn(){if(kt){window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode(),le.length===0?Be():je(Re||le[0].id);return}kt=!0,console.log("initViewPage called"),Ei().catch(n=>{console.warn("Could not initialize OneView shared storage sync",n)}),ir(),window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Tt()).catch(()=>{}),window.api&&typeof window.api.getPerfLogPath=="function"&&window.api.getPerfLogPath().then(n=>{n?.success&&Fn("perf","log-path",{path:n.path||"",enabled:n.enabled})}).catch(()=>{}),!En&&window.api&&typeof window.api.onCredentialDebugLog=="function"&&(En=!0,window.api.onCredentialDebugLog(n=>{console.log("[OneView][CredentialCapture][MainRelay]",n)})),document.body?.dataset.boundProfileHistorySharedStorage!=="1"&&window.api?.onOneviewSharedStorageUpdated&&(document.body.dataset.boundProfileHistorySharedStorage="1",window.api.onOneviewSharedStorageUpdated(n=>{String(n?.key||"")===jt&&(Qn(n),mo().catch(()=>{}))})),Fo(),Ao(),Bo().catch(()=>{}),jo(),Zt(),Cn(),_i(),document.addEventListener("click",n=>{const t=document.getElementById("addressSearchDropdown"),o=document.getElementById("addressSearchDropdownHome"),r=document.getElementById("urlDisplay"),u=document.getElementById("googleSearchInput");t&&!t.contains(n.target)&&n.target!==r&&t.classList.add("hidden"),o&&!o.contains(n.target)&&n.target!==u&&o.classList.add("hidden");const h=document.getElementById("credentialSelectionDropdown");h&&!h.contains(n.target)&&h.classList.add("hidden")}),document.body.dataset.viewThemeIconObserverBound||(document.body.dataset.viewThemeIconObserverBound="1",new MutationObserver(()=>{Cn()}).observe(document.body,{attributes:!0,attributeFilter:["class"]})),le.length===0?Be():je(Re||le[0].id);const e=document.getElementById("newTabBtn");e&&e.addEventListener("click",()=>{Be()}),Go();try{bo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupViewSearch-err:${n.toString()}`}).catch(()=>{})}try{Ho()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupBookmarks-err:${n.toString()}`}).catch(()=>{})}ho().catch(n=>{console.warn("Failed to update Synapse visibility in view",n)});try{qo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-initBookmarkManager-err:${n.toString()}`}).catch(()=>{})}document.getElementById("browserBack")?.addEventListener("click",()=>{const n=et();if(n&&n.canGoBack()){n.goBack();return}io()}),document.getElementById("browserForward")?.addEventListener("click",()=>{const n=et();n&&n.canGoForward()&&n.goForward()}),document.getElementById("browserReload")?.addEventListener("click",()=>{const n=et();n&&n.reload()}),document.getElementById("browserDetach")?.addEventListener("click",In),document.getElementById("browserDetachHeader")?.addEventListener("click",In),So(),so(),Jo(),Ni(),Lo(),po(),co(),uo(),Qi(),Xi(),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode()}window.addEventListener("beforeunload",()=>{qt().catch(()=>{}),Wn()});window.addEventListener("teardown-view-system",()=>{console.log("Teardown View System triggered"),qt().catch(()=>{}),Wn();const e=le.map(t=>t.id);vt(e,{isTeardown:!0});const n=document.getElementById("webviews-container");n&&(n.querySelectorAll(".webcontent-pane").forEach(o=>{try{typeof o.remove=="function"&&o.remove()}catch{}}),n.innerHTML=""),le=[],Re=null,kt=!1});function Ut(e){if(!e||e.isHome)return!1;const n=String(e.url||"").trim(),t=String(e.launchedAppType||"").trim().toLowerCase();return!n||n==="about:blank"||n==="newtab"||It(n)||!/^https?:\/\//i.test(n)?!1:!t||t==="website"}function yo({activateVisibleTab:e=!0}={}){if(!kt||le.length===0)return;const n=le.filter(u=>!u.isHome&&!Ut(u)).map(u=>u.id);if(n.length>0&&vt(n),!e)return;const t=tt();if(t&&Ut(t)){je(t.id);return}const o=le.find(u=>Ut(u));if(o){je(o.id);return}const r=le.find(u=>u.isHome);if(r){je(r.id);return}if(le.length===0){Be();return}je(le[0].id)}window.addEventListener("ticket-switch-preserve-view",e=>{yo({activateVisibleTab:e?.detail?.activateVisibleTab!==!1})});async function So(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;const e=JSON.parse(localStorage.getItem(Ze.installedApps)||"{}");let n=!1;for(const[t,o]of Object.entries(e)){const r=String(o?.type||"").toLowerCase();if(zt.has(r)&&o?.localPath)try{const u=await window.api.resolveOneviewAppUrl(t,o.localPath);u?.success&&u.url&&o.oneviewUrl!==u.url&&(e[t]={...o,oneviewUrl:u.url},n=!0)}catch{}}n&&localStorage.setItem(Ze.installedApps,JSON.stringify(e))}window.initViewPage=jn;window.closeViewTab=Yt;function Eo(){const e=document.getElementById("settingsBtn");e&&e.classList.remove("is-active")}function Kt(){return{modal:document.getElementById("extensionPromptModal"),title:document.getElementById("extensionPromptTitle"),message:document.getElementById("extensionPromptMessage"),label:document.getElementById("extensionPromptLabel"),input:document.getElementById("extensionPromptInput"),textarea:document.getElementById("extensionPromptTextarea"),form:document.getElementById("extensionPromptForm"),submitBtn:document.getElementById("extensionPromptSubmitBtn"),cancelBtn:document.getElementById("extensionPromptCancelBtn"),closeBtn:document.getElementById("extensionPromptCloseBtn")}}async function xo(e={}){const n=Kt();if(!n.modal||!n.form||!n.input||!n.textarea)return{cancelled:!0,value:""};if(Xe)return{cancelled:!0,value:""};const t=e&&typeof e=="object"?e:{},o=t.multiline===!0,r=t.required!==!1,u=String(t.value||""),h=String(t.title||"Extension Input").trim()||"Extension Input",C=String(t.message||"").trim(),P=String(t.label||"Value").trim()||"Value",k=String(t.submitLabel||"Submit").trim()||"Submit",b=String(t.cancelLabel||"Cancel").trim()||"Cancel",I=String(t.placeholder||"").trim();return n.title.textContent=h,n.message.textContent=C,n.message.classList.toggle("hidden",!C),n.label.textContent=P,n.submitBtn.textContent=k,n.cancelBtn.textContent=b,n.input.classList.toggle("hidden",o),n.textarea.classList.toggle("hidden",!o),n.input.required=!o&&r,n.textarea.required=o&&r,n.input.type=t.password===!0?"password":"text",n.input.placeholder=I,n.textarea.placeholder=I,n.input.value=o?"":u,n.textarea.value=o?u:"",new Promise(L=>{Xe={resolve:L,required:r,multiline:o},st(()=>{n.modal.classList.remove("hidden"),n.modal.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{(o?n.textarea:n.input).focus(),(o?n.textarea:n.input).select?.()})}).catch(()=>{Xe=null,L({cancelled:!0,value:""})})})}function Tn(e={cancelled:!0,value:""}){const n=Kt();if(!n.modal||!Xe)return;const t=Xe;Xe=null,Qe(()=>{n.modal.classList.add("hidden"),n.modal.setAttribute("aria-hidden","true"),n.form.reset(),n.input.classList.remove("hidden"),n.textarea.classList.add("hidden"),n.input.type="text"}),t.resolve(e)}function Co(){return{modal:document.getElementById("profilePromptModal"),select:document.getElementById("profilePromptSelect"),continueBtn:document.getElementById("profilePromptContinueBtn"),cancelBtn:document.getElementById("profilePromptCancelBtn"),closeBtn:document.getElementById("profilePromptCloseBtn")}}let Nt=null;async function Io(e,n="guest"){const t=Co();if(!t.modal||!t.select)return{cancelled:!0,profileId:n};if(Nt)return{cancelled:!0,profileId:n};let o=n;const r=t.select;r.innerHTML=Object.values(ae).map(h=>{const C=String(h.name||"P").charAt(0).toUpperCase();return`
        <div class="profile-big-item ${h.id===o?"active":""}" data-id="${h.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${h.color};">
            ${C}
          </div>
          <span class="profile-big-name">${Ie(h.name)}</span>
        </div>
      `}).join("");const u=h=>{o=h,r.querySelectorAll(".profile-big-item").forEach(C=>{C.classList.toggle("active",C.dataset.id===h)})};r.querySelectorAll(".profile-big-item").forEach(h=>{const C=()=>{const P=h.dataset.id;!P||!ae[P]||u(P)};h.addEventListener("click",C),h.addEventListener("keydown",P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),C())}),h.addEventListener("dblclick",()=>{C(),t.continueBtn?.click()})});try{await st(()=>{t.modal.classList.remove("hidden"),t.modal.setAttribute("aria-hidden","false")})}catch{return{cancelled:!0,profileId:n}}return new Promise(h=>{Nt={resolve:h};const C=()=>{Qe(()=>{t.modal.classList.add("hidden"),t.modal.setAttribute("aria-hidden","true")}),t.continueBtn?.removeEventListener("click",P),t.cancelBtn?.removeEventListener("click",k),t.closeBtn?.removeEventListener("click",k),t.modal.removeEventListener("click",b),Nt=null},P=()=>{C(),h({cancelled:!1,profileId:o})},k=()=>{C(),h({cancelled:!0,profileId:n})};t.continueBtn?.addEventListener("click",P),t.cancelBtn?.addEventListener("click",k),t.closeBtn?.addEventListener("click",k);const b=I=>{I.target===t.modal&&k()};t.modal.addEventListener("click",b)})}function Lo(){const e=Kt();if(!e.modal||e.modal.dataset.boundExtensionPrompt==="1")return;e.modal.dataset.boundExtensionPrompt="1",e.form?.addEventListener("submit",t=>{if(t.preventDefault(),!Xe)return;const o=Xe.multiline?e.textarea:e.input,r=String(o?.value||"");if(Xe.required&&!r.trim()){o?.focus();return}Tn({cancelled:!1,value:r})});const n=()=>Tn({cancelled:!0,value:""});e.cancelBtn?.addEventListener("click",n),e.closeBtn?.addEventListener("click",n),e.modal.addEventListener("click",t=>{t.target===e.modal&&n()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&Xe&&!e.modal.classList.contains("hidden")&&(t.preventDefault(),n())})}function zn(){return!!tt()?.lockedProfileId}function bt(e=null){const n=e||tt(),t=!!n?.lockedProfileId,o=document.getElementById("profileBtn");if(o){if(o.classList.toggle("locked",t),t){const r=ae[n.lockedProfileId]?.name||"assigned";o.title=`Profile locked to ${r} for this tab`}else o.title="Switch Profile";qn()}}function qn(){const e=zn();document.querySelectorAll(".profile-item[data-id]").forEach(t=>{t.classList.toggle("disabled",e),t.setAttribute("aria-disabled",e?"true":"false")})}function Jt(e){return Gt(e)}function ko(e){const n=Zn(e);!n||!ae[n]||me!==n&&wt(n,{bypassLock:!0})}function Xt(e,n,t){const o=document.getElementById(e);o&&(o.innerHTML=Object.values(ae).map(r=>`
      <div class="profile-pill-item ${r.id===n?"active":""}" data-id="${r.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${r.color};"></span>
        <span>${Ie(r.name)}</span>
      </div>
    `).join(""),o.querySelectorAll(".profile-pill-item").forEach(r=>{const u=()=>{const h=r.dataset.id;!h||!ae[h]||(o.querySelectorAll(".profile-pill-item").forEach(C=>{C.classList.toggle("active",C.dataset.id===h)}),typeof t=="function"&&t(h))};r.addEventListener("click",u),r.addEventListener("keydown",h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),u())})}))}function wt(e,{bypassLock:n=!1}={}){const t=String(e||"").trim();if(!ae[t]){console.warn(`[View] applyProfileSelection: Invalid profile ID "${t}"`);return}if(!n&&zn()){console.log("[View] applyProfileSelection BLOCKED: active tab is locked");return}console.log(`[View] applyProfileSelection: Switching to ${t}`),me=t,localStorage.setItem(Ze.currentProfileId,t),oi(),document.querySelectorAll(".profile-item").forEach(r=>{r.dataset.id===t?r.classList.add("active"):r.classList.remove("active")})}function St(e="",n=""){const t=String(n).toLowerCase(),o=String(e).toLowerCase();let r=o;try{r=decodeURIComponent(o)}catch{r=o}const u=`${t} ${o} ${r}`,h=/\bai\b/.test(t),C=/\b(imagine|empower|production ai|imagine wpp)\b/.test(t),P=u.includes("jira.")||u.includes("jira/")||u.includes("atlassian.net")||u.includes("jira.uhub.biz")||t.includes("jira"),k=t.includes("aem")||t.includes("veeva")||t.includes("gsk")||o.includes("gskinternet.com")||o.includes("gsk-contentlab.veevavault.com")||o.includes("veevavault.com"),b=h||C||o.includes("imagine.wpp.ai")||o.includes("://wpp.ai")||o.includes(".wpp.ai")||u.includes("://wpp.")||u.includes(".wpp.")||u.includes("wpp.com");return P?"vml":k?"gsk":b?"wppproduction":null}function Yn(e,n="",t=""){const o=String(e?.lockedProfileId||"").trim().toLowerCase(),r=St(n,t);return o&&Ri(n,t)?o:r}async function Gn(e,n=null,t="New Tab",o={}){const r=String(n||"").trim(),u=r?Jt(r):null;if(String(e||"").trim().toLowerCase().startsWith("file://"))return{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:pt(e,ae.guest.partition,t,o)};const C=St(e,t);if(C&&ae[C])return{cancelled:!1,profileId:C,lockedProfileId:C,partition:pt(e,ae[C].partition,t,o)};const P=ri(e),k=u&&P.find(b=>b.profileId===u)||P.find(b=>b.profileId===me)||P[0]||null;return k&&ae[k.profileId]?{cancelled:!1,profileId:k.profileId,lockedProfileId:k.profileId,partition:pt(e,ae[k.profileId].partition,t,o)}:{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:pt(e,ae.guest.partition,t,o)}}async function Po(e,n,t,o){const r=Yn(e,n,t);if(e.lockedProfileId=r,!r){Re===e.id&&bt(e);return}const u=ae[r].partition;if(me!==r&&wt(r,{bypassLock:!0}),e.partition!==u){e.partition=u,o&&!o.isDestroyed?.()&&o.remove();const h=await to(e);Re===e.id&&(bt(e),setTimeout(()=>{h.src=n},10));return}Re===e.id&&bt(e)}function Kn(){return{wppproduction:[],vml:[],gsk:[],guest:[]}}function Jn(e={}){const n=Kn();return Object.keys(n).forEach(t=>{const o=Array.isArray(e?.[t])?e[t]:[];n[t]=o.map(r=>({url:String(r?.url||"").trim(),title:String(r?.title||"Untitled").trim()||"Untitled",visitedAt:r?.visitedAt?Number(r.visitedAt):0})).filter(r=>r.url&&r.url!=="about:blank").slice(0,200)}),n}function Xn(){!window.api||typeof window.api.setOneviewSharedStorage!="function"||window.api.setOneviewSharedStorage(jt,Ae).catch(e=>{console.warn("Could not sync profile history to shared storage",e)})}function Qn(e=null){if(!e||typeof e!="object")return;Ae=Jn(e.value||{});try{localStorage.setItem(Vt,JSON.stringify(Ae))}catch{}!document.getElementById("historyManagerModal")?.classList.contains("hidden")&&ai()}async function Bo(){if(!(!window.api||typeof window.api.getOneviewSharedStorage!="function"))try{const e=await window.api.getOneviewSharedStorage(jt);e?.success&&e.entry?Qn(e.entry):Xn()}catch(e){console.warn("Could not hydrate profile history from shared storage",e)}}function Ao(){try{const e=JSON.parse(localStorage.getItem(Vt)||"{}");Ae=Jn(e)}catch{Ae=Kn()}}function Qt(){localStorage.setItem(Vt,JSON.stringify(Ae)),Xn()}function Zn(e){return e&&(e.lockedProfileId||Gt(e.partition))||me}function ei(e){return e&&(Vn(e.partition)||e.lockedProfileId)||me}function To(e,n,t){if(!Ae[e])return;const o=String(n||"").trim();if(!o||o==="about:blank"||o.startsWith("devtools://"))return;const r=String(t||"Untitled").trim()||"Untitled",u=Ae[e]||[],h=u.findIndex(P=>P.url===o),C={url:o,title:r,visitedAt:Date.now()};h===0?u[0]=C:(h>0&&u.splice(h,1),u.unshift(C)),Ae[e]=u.slice(0,200),Qt()}function ti(e){if(!e)return"Unknown Date";try{return new Date(e).toLocaleString()}catch{return""}}function $o(){if(gt!==null)return gt;try{gt=window.api&&typeof window.api.getWebviewPreloadPath=="function"?window.api.getWebviewPreloadPath():""}catch{gt=""}return gt}function _o(e,n={}){const t=String(n?.appType||"").trim().toLowerCase(),o=String(e||"").trim().toLowerCase();return typeof n?.requiresPlatformApi=="boolean"?n.requiresPlatformApi:t&&t!=="website"?!0:t==="website"&&It(o)}function Do(e){return e?.getAttribute("data-platform-api-enabled")==="1"}function Mo(e,n){!e||typeof e.setAttribute!="function"||e.setAttribute("data-platform-api-enabled",n?"1":"0")}function Uo(e=""){const n=String(e).trim();if(!n)return"APP";const t=n.split(/\s+/).filter(Boolean);return t.length===1?t[0].slice(0,3).toUpperCase():t.slice(0,3).map(o=>o[0]).join("").toUpperCase()}function No(e=""){const n=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)","linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)","linear-gradient(to right, #4facfe 0%, #00f2fe 100%)","linear-gradient(to top, #30cfd0 0%, #330867 100%)"],t=String(e);let o=0;for(let r=0;r<t.length;r+=1)o=(o+t.charCodeAt(r)*(r+1))%n.length;return n[o]}function Oo(e="app"){let n=document.getElementById("view-launch-loader");n?n.style.display="flex":(n=document.createElement("div"),n.id="view-launch-loader",n.style.cssText=["position:fixed","inset:0","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","background:rgba(15,23,42,0.45)","backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)"].join(";"),n.innerHTML=`
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
    `,document.body.appendChild(n));const t=n.querySelector("p");return t&&(t.textContent=`Opening ${e||"app"}...`),()=>{n&&(n.style.display="none")}}async function Ro(e){if(!e)return;const t=JSON.parse(localStorage.getItem(Ze.installedApps)||"{}")[e];if(!t){console.warn("Installed app not found:",e);return}const o=t.name||"App",r=Oo(o),u=xi(t);console.log("[OneView Tracking] View launch decision",{appId:e,appName:t?.name||"",appType:t?.type||"",clickTrackingMode:t?.clickTrackingMode||"",trackOnLaunch:t?.trackOnLaunch,oneviewUrl:t?.oneviewUrl||"",hasLocalPath:!!t?.localPath,shouldTrackLaunch:u}),u&&Ci({currentSelectedTicketId:window.currentActiveTicketKey||"",clickedAppName:o});try{if(dn(t)){await Si(t),ze(`Opened "${o}" in a separate window.`,"info");return}const h=()=>tt()?.partition||ae[me]?.partition||be.guest,C=async(k,b={})=>{await Be(k,h(),o,null,{hideControls:!0,appType:t.type,trackingAppId:e,trackingAppName:o,bypassPrompt:!0,...b})},P=String(t.type||"").toLowerCase();if(zt.has(P)&&t.localPath){Ln(`Starting ${o}...`);let k=String(t.oneviewUrl||"").trim();if(window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const I=await window.api.resolveOneviewAppUrl(e,t.localPath,"/",h());if(I?.success&&I.url){k=I.url;const L=JSON.parse(localStorage.getItem(Ze.installedApps)||"{}");L[e]&&(L[e]={...L[e],oneviewUrl:k},localStorage.setItem(Ze.installedApps,JSON.stringify(L)))}}const b=["nextjs","next","vite-server"].includes(P);if(k&&It(k)&&b&&(k=""),k&&It(k))await C(k);else{const I=await window.api.launchNextApp(t.localPath,t.type);await C(I)}return}if(t.type==="website"&&t.url){await C(t.url);return}if(t.type==="exe"&&t.localPath){Ln(`Launching ${o}...`);const k=await window.api.launchExe(t.localPath,t.tech);if(k&&k.mode==="embedded"&&k.url){const b=new URLSearchParams;k.token&&b.set("NL_TOKEN",k.token),t.tech&&b.set("TECH",t.tech);const I=String(k.url).split(":")[2];I&&b.set("NL_PORT",I);const L=`${k.url}?${b.toString()}`;await C(L)}else k?.success&&k.mode==="external"?ze(`Opened "${o}" in a separate window.`,"info"):alert(`${o} launched externally. Embedded view is not available for this app.`);return}alert(`Cannot launch "${o}". Missing supported launch configuration.`)}catch(h){if(dn(t)){console.error("Failed to launch external Electron app from view:",h),ze(`Failed to launch "${o}".`,"error");return}console.error("Failed to launch installed app from view:",h),alert(`Failed to launch "${o}": ${h.message||h}`)}finally{r()}}async function ni(e,n=null,t="New Tab",o=!1,r={}){const u=String(e||"").trim();if(!u)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){const F=be.gsk;window.enterSiteSnapStudioMode();const j=kn(),Q=(j||[]).some(de=>{const q=String(de.url||"").trim();return q&&q!=="about:blank"&&q!=="newtab"});!j||j.length===0||o||Q?await Be(u,F,t,null,r):await yt(u,F,t,null,r);return}let h=o;u.toLowerCase().startsWith("file://")&&(h=!0);const P=await Gn(u,n,t,r);if(!P||P.cancelled)return;const k=P.partition,b=P.profileId,I=P.lockedProfileId;b&&b!==Di()&&wt(b,{bypassLock:!0});const L=kn();if(!L||L.length===0){await Be(u,k,t,I,r);return}const A=L.some(F=>{const j=String(F.url||"").trim();return j&&j!=="about:blank"&&j!=="newtab"});if(h||A){await Be(u,k,t,I,r);return}let N=tt();if(!N){const F=L[L.length-1];F&&(await je(F.id),N=F)}if(!N){await Be(u,k,t,I,r);return}await yt(u,k,t,I,r)}window.initViewPage=jn;window.createTab=Be;window.launchInstalledAppFromView=Ro;window.openUrlFromDashboard=ni;function Fo(){const e=localStorage.getItem(Ze.currentProfileId);e&&ae[e]?me=e:me="guest",oi();const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");n&&t&&(n.addEventListener("click",async o=>{o.stopPropagation(),t.classList.contains("hidden")?await st(()=>t.classList.remove("hidden")):Qe(()=>t.classList.add("hidden"))}),t.innerHTML=Object.values(ae).map(o=>`
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
      `),t.querySelectorAll(".profile-item").forEach(o=>{o.addEventListener("click",async()=>{if(o.dataset.action==="manage-passwords"){Wt("passwords"),Qe(()=>t.classList.add("hidden"));return}const r=o.dataset.id;o.classList.contains("disabled")||(ii(r),Qe(()=>t.classList.add("hidden")))})}),qn())}function ii(e){wt(e)}function oi(){const e=ae[me],n=document.getElementById("profileBtn"),t=document.getElementById("profileLabel");n&&t&&(t.textContent=e.label,t.style.color=e.color),bt()}function Ho(){const e=document.querySelector(".bookmarks-grid");e&&e.addEventListener("click",n=>{const t=n.target.closest(".bookmark-edit-btn");if(t){n.preventDefault(),n.stopPropagation();const L=t.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;L&&Yo(L);return}const o=n.target.closest(".bookmark-delete-btn");if(o){n.preventDefault(),n.stopPropagation();const L=o.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;L&&(_e=_e.filter(A=>A.id!==L),si(),Zt());return}const r=n.target.closest(".bookmark-card");if(!r||r.id==="addBookmarkBtn"||r.classList.contains("add-bookmark-card"))return;const u=r.dataset.url,h=r.dataset.title||"New Tab",C=String(r.dataset.partition||"").trim(),P=String(r.dataset.sessionScope||"").trim(),b=r.dataset.profileId||Jt(r.dataset.partition)||St(u||"",h)||me;if(b!==me&&ii(b),u){const I=pt(u,C||ae[b].partition,h,P?{sessionScope:P}:{});yt(u,I,h,St(u||"",h))}})}function mt(e=""){const n=String(e).trim();return n?/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/^about:/i.test(n)?n:`https://${n}`:""}function Bt(e=""){const n=mt(e);if(!n)return"";try{const t=new URL(n),o=t.pathname.length>1?t.pathname.replace(/\/+$/,"")||"/":t.pathname||"/";return`${t.origin}${o}${t.search}${t.hash}`}catch{return n.replace(/\/+$/,"")}}function ri(e=""){const n=Bt(e);return n?_e.filter(t=>Bt(t.url)===n):[]}function Wo(e="",n=""){const t=ri(e);return n?t.find(o=>String(o.profileId||"").trim().toLowerCase()===n)||null:t[0]||null}function Vo(e=null){return e?String(e.lockedProfileId||"").trim().toLowerCase()||Jt(e.partition)||me||"guest":me||"guest"}function jo(){try{const e=JSON.parse(localStorage.getItem(Nn)||"[]");_e=Array.isArray(e)?e.map(n=>({id:String(n?.id||""),title:String(n?.title||"").trim(),url:mt(n?.url||""),profileId:ae[n?.profileId]?n.profileId:"guest"})).filter(n=>n.id&&n.title&&n.url):[]}catch{_e=[]}}function si(){localStorage.setItem(Nn,JSON.stringify(_e))}function zo({id:e="",title:n="",url:t="",profileId:o="guest"}){const r=mt(t),u=String(n||"").trim()||r,h=ae[o]?o:"guest",C=Bt(r);if(!r||!C)return!1;const P=_e.findIndex(b=>e&&b.id===e?!0:Bt(b.url)===C&&String(b.profileId||"guest")===h),k={id:P>=0?_e[P].id:e||`bm-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:u,url:r,profileId:h};return P>=0?_e[P]={..._e[P],...k}:_e.unshift(k),P>=0?"updated":"created"}function Zt(){const e=document.querySelector(".bookmarks-grid");if(!e)return;e.querySelectorAll(".bookmark-card.custom-bookmark").forEach(o=>o.remove());const n=_e.map(o=>{const r=ae[o.profileId]||ae.guest;return`
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
      `}).join(""),t=document.getElementById("addBookmarkBtn");t?t.insertAdjacentHTML("beforebegin",n):e.insertAdjacentHTML("beforeend",n)}function qo(){const e=document.getElementById("addBookmarkBtn"),n=document.getElementById("bookmarkCurrentPageHeaderBtn"),t=document.getElementById("bookmarkModal"),o=document.getElementById("bookmarkModalCloseBtn"),r=document.getElementById("bookmarkForm"),u=document.getElementById("bookmarkTitleInput"),h=document.getElementById("bookmarkUrlInput"),C=t?.querySelector(".password-modal-header h3"),P=document.getElementById("bookmarkSaveBtn");if(!e||!t||!o||!r||!u||!h)return;const k=()=>{Qe(()=>{t.classList.add("hidden"),Ct=null})},b=async({editId:A=null,title:N="",url:F="",profileId:j=me,heading:Q="Add Bookmark",saveLabel:de="Save Bookmark"}={})=>{Ct=A,lt=ae[j]?j:me,Xt("bookmarkProfileSelect",lt,q=>{lt=q}),C&&(C.textContent=Q),P&&(P.textContent=de),r.reset(),u.value=String(N||""),h.value=String(F||""),await st(()=>t.classList.remove("hidden")),u.value?(u.focus(),u.select()):u.focus()},I=async()=>{await b()},L=async()=>{const A=tt(),N=mt(A?.url||"");if(!A||A.isHome||!N||N==="about:blank"){ze("Open a website tab first to save it as a bookmark.","error");return}const F=Vo(A),j=Wo(N,F);await b({editId:j?.id||null,title:A.title||j?.title||"New Bookmark",url:N,profileId:F,heading:j?"Update Bookmark":"Save Current Site",saveLabel:j?"Update Bookmark":"Save Bookmark"})};e.addEventListener("click",I),e.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await I())}),n?.addEventListener("click",L),n?.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await L())}),o.addEventListener("click",k),t.addEventListener("click",A=>{A.target===t&&k()}),r.addEventListener("submit",A=>{A.preventDefault();const N=String(u.value||"").trim(),F=mt(h.value);if(!N||!F)return;const j=zo({id:Ct,title:N,url:F,profileId:lt||me});j&&(si(),Zt(),k(),r.reset(),ze(j==="updated"?"Bookmark updated successfully.":"Bookmark saved successfully.","success"))})}async function Yo(e){const n=document.getElementById("bookmarkModal"),t=document.getElementById("bookmarkForm"),o=document.getElementById("bookmarkTitleInput"),r=document.getElementById("bookmarkUrlInput"),u=n?.querySelector(".password-modal-header h3"),h=document.getElementById("bookmarkSaveBtn");if(!n||!t||!o||!r)return;const C=_e.find(P=>P.id===e);C&&(Ct=C.id,lt=C.profileId||me,u&&(u.textContent="Edit Bookmark"),h&&(h.textContent="Update Bookmark"),Xt("bookmarkProfileSelect",lt,P=>{lt=P}),o.value=C.title||"",r.value=C.url||"",await st(()=>n.classList.remove("hidden")),o.focus())}function Go(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;const o=220;n.addEventListener("click",()=>{e.scrollBy({left:-o,behavior:"smooth"})}),t.addEventListener("click",()=>{e.scrollBy({left:o,behavior:"smooth"})}),e.addEventListener("scroll",At),At()}function ai(){const e=document.getElementById("historyList"),n=document.getElementById("historyProfileSelect");if(!e||!n)return;const t=Ft||me,o=Ae[t]||[];if(o.length===0){e.innerHTML="<div class='password-meta'>No history for this profile yet.</div>";return}const r=new Date,u=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),h=u-864e5,C={today:[],yesterday:[],older:[]};o.forEach((L,A)=>{const N={...L,originalIndex:A},F=L.visitedAt||0;F>=u?C.today.push(N):F>=h?C.yesterday.push(N):C.older.push(N)});const P=L=>L.toLocaleDateString(void 0,{month:"short",day:"numeric"}),k=`Today - ${P(r)}`,b=`Yesterday - ${P(new Date(h))}`,I=(L,A,N=!1)=>{if(A.length===0)return"";const F=A.map(j=>`
      <div class="history-item" data-index="${j.originalIndex}">
        <div class="history-main">
          <div class="history-title">${Ie(j.title||"Untitled")}</div>
          <div class="history-url">${Ie(j.url||"")}</div>
          <div class="password-meta">${Ie(ti(j.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `).join("");return`
      <details class="history-group" ${N?"open":""}>
        <summary class="history-group-title">
          <span>${L}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${A.length}</span>
        </summary>
        <div class="history-group-content">
          ${F}
        </div>
      </details>
    `};e.innerHTML=`
    ${I(k,C.today,C.today.length>0)}
    ${I(b,C.yesterday,!1)}
    ${I("Older",C.older,!1)}
  `,e.querySelectorAll(".history-item").forEach(L=>{L.addEventListener("click",A=>{const N=A.target.closest("button");if(!N)return;const F=Number(L.dataset.index);if(Number.isNaN(F))return;const j=Ae[t]||[],Q=j[F];if(Q){if(N.dataset.action==="delete"){j.splice(F,1),Ae[t]=j,Qt(),ai();return}if(N.dataset.action==="open"){const de=ae[t]?.partition||be.guest;Be(Q.url,de,Q.title||"History",t)}}})})}async function rt({title:e="Clear Page Cache",message:n="",confirmLabel:t="OK",cancelLabel:o="Cancel",hideCancel:r=!1}={}){const u=document.getElementById("cacheActionModal"),h=document.getElementById("cacheActionTitle"),C=document.getElementById("cacheActionMessage"),P=document.getElementById("cacheActionCloseBtn"),k=document.getElementById("cacheActionCancelBtn"),b=document.getElementById("cacheActionConfirmBtn");return!u||!h||!C||!P||!k||!b?Promise.resolve(window.confirm(n||e)):(h.textContent=e,C.textContent=n,b.textContent=t,k.textContent=o,k.style.display=r?"none":"inline-flex",await st(()=>u.classList.remove("hidden")),new Promise(I=>{const L=()=>{P.removeEventListener("click",A),k.removeEventListener("click",A),b.removeEventListener("click",N),u.removeEventListener("click",F),Qe(()=>u.classList.add("hidden"))},A=()=>{L(),I(!1)},N=()=>{L(),I(!0)},F=j=>{j.target===u&&A()};P.addEventListener("click",A),k.addEventListener("click",A),b.addEventListener("click",N),u.addEventListener("click",F)}))}function At(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;if(!(e.scrollWidth>e.clientWidth+1)){n.classList.add("hidden"),t.classList.add("hidden"),e.scrollLeft=0;return}const r=e.scrollLeft<=1,u=e.scrollLeft+e.clientWidth>=e.scrollWidth-1;n.classList.toggle("hidden",r),t.classList.toggle("hidden",u)}function en(e){if(!e)return null;if(typeof e.getWebContentsId=="function")try{const n=e.getWebContentsId();if(n)return n}catch{}return e._webContent?e._webContent.key||e._webContent.id||null:e.key||e.id||e.getAttribute("key")||e.getAttribute("id")||null}async function Ko(e,n){const t=le.findIndex(r=>r.id===n),o=le[t];if(e==="duplicate-tab"&&o){no(n);return}if(e==="inspect-local-file"&&o){const r=document.getElementById(`webview-${o.id}`),u=en(r);if(!u||!window.api?.toggleWebviewDevTools){ze(Lt?"Inspect is not available for this tab.":"Inspect is not available for this local file tab.","error");return}await window.api.toggleWebviewDevTools(u)||ze(Lt?"Could not open developer tools.":"Could not open developer tools for this local file.","error");return}if(e==="clear-cache"&&o){const r=document.getElementById(`webview-${o.id}`),u=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",h=r&&r.getAttribute("partition")||o.partition||be.guest;if(!u||u==="about:blank"||!await rt({title:"Clear Page Cache",message:`Clear cache and site data for ${u}?`,confirmLabel:"Clear Cache",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewPageCache!="function"){await rt({title:"Action Unavailable",message:"Cache clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const P=await window.api.clearWebviewPageCache(h,u);P?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await rt({title:"Could Not Clear Cache",message:P?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(P){const k=String(P?.message||P||""),b=/No handler registered for 'clear-webview-page-cache'/.test(k)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await rt({title:"Could Not Clear Cache",message:`${k}${b}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-user-data"&&o){const r=document.getElementById(`webview-${o.id}`),u=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",h=r&&r.getAttribute("partition")||o.partition||be.guest;if(!u||u==="about:blank"||!await rt({title:"Clear User Data",message:`Clear local storage and site data for ${u}?`,confirmLabel:"Clear Data",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewUserData!="function"){await rt({title:"Action Unavailable",message:"User-data clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const P=await window.api.clearWebviewUserData(h,u);P?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await rt({title:"Could Not Clear User Data",message:P?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(P){const k=String(P?.message||P||""),b=/No handler registered for 'clear-webview-user-data'/.test(k)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await rt({title:"Could Not Clear User Data",message:`${k}${b}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-all"){vt(le.map(r=>r.id));return}if(e==="clear-right"&&t>=0){vt(le.slice(t+1).map(r=>r.id));return}e==="clear-left"&&t>=0&&vt(le.slice(0,t).map(r=>r.id))}function Jo(){const e=document.querySelector(".tabs-header");e&&e.addEventListener("contextmenu",async n=>{if(n.target.closest(".profile-section"))return;n.preventDefault();const r=n.target.closest(".tab")?.id?.replace("tab-ui-","")||Re||le[0]?.id||null;if(!r)return;Un=r;const u=le.findIndex(L=>L.id===r),h=le[u],C=document.getElementById(`webview-${r}`),P=oo(h,C),k=!!(h&&!h.isHome&&(C&&C.getURL()!=="about:blank"||h.url)),b=u>0?u:0,I=u>=0&&u<le.length-1?le.length-u-1:0;window.api&&typeof window.api.showNativeTabContextMenu=="function"&&await window.api.showNativeTabContextMenu({anchorId:r,x:Math.round(n.x),y:Math.round(n.y),disabled:{clearLeft:b===0,clearRight:I===0,clearCache:!k,clearUserData:!k,inspectLocalFile:!P}})})}function Ot(e){if(!e)return"";const n=String(e.getData("text/uri-list")||"").split(/\r?\n/).map(u=>u.trim()).find(u=>u&&!u.startsWith("#"));if(n&&/^https?:\/\//i.test(n))return n;const o=String(e.getData("text/html")||"").match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);if(o&&/^https?:\/\//i.test(String(o[1]||"").trim()))return String(o[1]||"").trim();const r=String(e.getData("text/plain")||"").trim();return/^https?:\/\//i.test(r)?r:r&&!/\s/.test(r)&&/\./.test(r)?mt(r):""}function Xo(){const e=document.querySelector(".tabs-header");if(!e||e.dataset.dropBound==="1")return;e.dataset.dropBound="1";const n=t=>{e.classList.toggle("is-drop-target",!!t)};e.addEventListener("dragenter",t=>{Ot(t.dataTransfer)&&(t.preventDefault(),n(!0))}),e.addEventListener("dragover",t=>{Ot(t.dataTransfer)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),n(!0))}),e.addEventListener("dragleave",t=>{e.contains(t.relatedTarget)||n(!1)}),e.addEventListener("drop",t=>{const o=Ot(t.dataTransfer);if(n(!1),!o)return;t.preventDefault();const u=t.target.closest(".tab")?.id?.replace("tab-ui-","")||Re,h=le.findIndex(C=>C.id===u);Be(o,null,"New Tab",null,{insertIndex:h>=0?h+1:le.length})})}function Qo(e){const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");!n||!t||!n.contains(e.target)&&!t.contains(e.target)&&!t.classList.contains("hidden")&&Qe(()=>t.classList.add("hidden"))}async function Zo(e){const n=String(e?.action||"");if(!n||n==="__menu_closed__")return;const t=String(e?.anchorId||Un||Re||le[0]?.id||"");t&&await Ko(n,t)}const $n={desktop:{width:1920,height:1080,userAgent:"desktop"},mobile:{width:414,height:896,userAgent:"mobile"},tablet:{width:768,height:1024,userAgent:"tablet"}};async function li(e,n="mobile"){if(!e)throw new Error("No active webview");const t=$n[n]||$n.mobile;if(console.log(`[Viewport] Setting ${n} viewport: ${t.width}x${t.height}`),window.api?.setWebviewBounds){const o=en(e);o&&(console.log(`[Viewport] Triggering native resize to ${t.width}x${t.height} for id: ${o}`),await window.api.setWebviewBounds(o,{width:t.width,height:t.height}))}return window.__oneview_original_webview_dims||(window.__oneview_original_webview_dims={width:e.style.width,height:e.style.height,minWidth:e.style.minWidth,minHeight:e.style.minHeight,maxWidth:e.style.maxWidth,maxHeight:e.style.maxHeight,flex:e.style.flex}),e.style.width=t.width+"px",e.style.height=t.height+"px",e.style.minWidth=t.width+"px",e.style.minHeight=t.height+"px",e.style.maxWidth=t.width+"px",e.style.maxHeight=t.height+"px",e.style.flex="none",console.log(`[Viewport] Resized webview element to ${t.width}x${t.height}`),await e.executeJavaScript(`
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
    `,!0),await new Promise(o=>setTimeout(o,300)),t}async function er(e){if(e&&window.api?.setWebviewBounds){const n=document.getElementById("webviews-container"),t=en(e);if(n&&t){const o=n.getBoundingClientRect();await window.api.setWebviewBounds(t,{width:Math.round(o.width),height:Math.round(o.height)})}}}async function ci(e){if(console.log("[Viewport] Resetting to original viewport"),window.__oneview_original_webview_dims&&e){const n=window.__oneview_original_webview_dims;e.style.width=n.width,e.style.height=n.height,e.style.minWidth=n.minWidth,e.style.minHeight=n.minHeight,e.style.maxWidth=n.maxWidth,e.style.maxHeight=n.maxHeight,e.style.flex=n.flex,window.__oneview_original_webview_dims=null,await er(e),console.log("[Viewport] Webview element dimensions and native bounds restored")}await e.executeJavaScript(`
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
    `,!0),await new Promise(n=>setTimeout(n,500))}async function tr(e={}){const n=et();if(!n||typeof n.executeJavaScript!="function")throw new Error("Active tab is unavailable");if(typeof n.capturePage!="function")throw new Error("Active tab does not support capture");const t=String(e?.viewport||"desktop").trim().toLowerCase();if(console.log("[Capture] Active webview found",{id:n.id,url:n.getURL?.(),title:n.getTitle?.(),viewport:t,loading:n._webContent?.state?.loading}),t==="mobile"||t==="tablet"){const q=t==="tablet"?"tablet":"mobile";await li(n,q),console.log("[Capture] Viewport changed to "+q+", waiting for page reflow..."),await new Promise(se=>setTimeout(se,300))}const o=5e3,r=Date.now();for(;n._webContent?.state?.loading&&Date.now()-r<o;)console.log("[Capture] Waiting for page to load..."),await new Promise(q=>setTimeout(q,200));console.log("[Capture] Page load status:",n._webContent?.state?.loading?"still loading":"loaded");const u=String(e?.mode||"visible").trim().toLowerCase();if(u!=="full"&&u!=="fullpage"){const q=await n.capturePage(),se=q?.isEmpty?.()?"":q.toDataURL();return console.log("[CapturePage] Visible captured. DataUrl length:",se?.length||0),{mode:"visible",dataUrl:se,width:q?.getSize?.()?.width||0,height:q?.getSize?.()?.height||0}}const h=await n.executeJavaScript(`
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
    `,!0);Math.max(1,Number(h?.totalWidth||0));let C=Math.max(1,Number(h?.totalHeight||0));Math.max(1,Number(h?.viewportWidth||0));let P=Math.max(1,Number(h?.viewportHeight||0));if(console.log("[FullCapture] Starting capture process..."),console.log("[FullCapture] Initial metrics:",h),await n.executeJavaScript(`
    (() => {
      const style = document.createElement('style');
      style.id = '__oneview_force_auto_scroll__';
      style.textContent = 'html, body, * { scroll-behavior: auto !important; }';
      (document.head || document.documentElement).appendChild(style);
    })();
  `,!0).catch(()=>{}),C>P+100){console.log("[FullCapture] Verifying scroll functionality...");const se=await n.executeJavaScript(`
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
    `,!0).catch(()=>null);console.log("[FullCapture] Verification scroll results:",se);const ye=Number(se?.startY||0),Le=Number(se?.endY||0);if(Le-ye<10)throw new Error("Scroll verification failed: page did not scroll (startY="+ye+", endY="+Le+"). Capture aborted to prevent repeating/empty fallback images.");await n.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `,!0).catch(()=>{})}const k=Math.floor(P*.8),b=Math.ceil(C/k);console.log("[FullCapture] Progressive scroll: "+b+" steps, "+k+"px per step");let I=0;for(let q=0;q<b;q++){I=Math.min(I+k,C),console.log(`[FullCapture] Scrolling host-driven to ${I}px (${q+1}/${b})`);const se=`
      (() => {
        const targetY = ${I};
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
    `;await n.executeJavaScript(se,!0).catch(()=>{}),await new Promise(ye=>setTimeout(ye,600))}await n.executeJavaScript(`window.scrollTo({ top: ${C}, left: 0, behavior: 'auto' });`,!0).catch(()=>{}),await new Promise(q=>setTimeout(q,800)),await n.executeJavaScript(`
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
  `;await n.executeJavaScript(L,!0).catch(()=>{});let A=0,N=!1;for(;!N&&A<50;)await n.executeJavaScript("(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)",!0).catch(()=>0)<=5?N=!0:(await n.executeJavaScript(L,!0).catch(()=>{}),await new Promise(se=>setTimeout(se,100)),A++);await n.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");const F=Number(e?.wait||0)*1e3,j=200+F;console.log(`[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${j}ms (Base 0.2s + User ${F}ms) for page to settle live...`),await new Promise(q=>setTimeout(q,j));let Q="",de=null;try{console.log("[FullCapture] Calling native one-shot capture..."),de=await n.capturePage({mode:"full",scrollHeight:Math.round(C)}),Q=de?.isEmpty?.()?"":de.toDataURL()}finally{console.log("[FullCapture] Restoring original body and globals..."),await n.executeJavaScript(`
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
      `,!0).catch(()=>{}),(t==="mobile"||t==="tablet")&&await ci(n),await n.executeJavaScript(`
        window.scrollTo(${Math.round(Number(h?.scrollX||0))}, ${Math.round(Number(h?.scrollY||0))});
      `,!0).catch(()=>{})}if(!Q)throw new Error("Full page capture returned empty image data");return{mode:"full",dataUrl:Q,width:de?.getSize?.()?.width||0,height:de?.getSize?.()?.height||0,tileCount:1}}async function nr(e){const n=String(e?.command||"").trim(),t=String(e?.url||"").trim(),o=String(e?.requestId||"").trim();if(!n)return;if(n==="execute-script"){const b=String(e?.source||"");let I={requestId:o,success:!1,message:"No active tab"};try{const L=et();if(!L||typeof L.executeJavaScript!="function")I={requestId:o,success:!1,message:"Active tab is unavailable"};else{const A=`
          (() => {
            const run = () => {
              ${b}
            };
            return run();
          })();
        `,N=await L.executeJavaScript(A,!0);I={requestId:o,success:!0,result:N}}}catch(L){I={requestId:o,success:!1,message:L?.message||String(L)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(I);return}if(n==="ui-prompt"){let b={requestId:o,success:!1,message:"Prompt request failed"};try{const I=await xo(e?.prompt||{});b={requestId:o,success:!0,result:I}}catch(I){b={requestId:o,success:!1,message:I?.message||String(I)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(n==="capture-page"){let b={requestId:o,success:!1,message:"Capture request failed",key:e?.key||"view:extension-popup"};try{const I=String(e?.options?.mode||"visible").trim().toLowerCase(),L=String(e?.options?.viewport||"desktop").trim().toLowerCase(),A=Number(e?.options?.wait||0);if(console.log("[View] Capturing mode:",I,"viewport:",L,"wait:",A),I==="full"||I==="fullpage"){console.log("[View] Using full-page capture function");const N=await tr({mode:I,viewport:L,wait:A});b={requestId:o,success:!0,result:N,key:e?.key||"view:extension-popup"}}else{const N=et();if(!N||typeof N.capturePage!="function")throw new Error("Active tab does not support capture");if(console.log("[View] Capturing visible area from webview id:",N.id),L==="mobile"||L==="tablet"){const de=L==="tablet"?"tablet":"mobile";await li(N,de),console.log("[View] Viewport changed to "+de+", waiting for page reflow..."),await new Promise(q=>setTimeout(q,800))}const F=await N.capturePage(),j=F?.isEmpty?.()?"":F.toDataURL?.();console.log("[View] Visible capture dataUrl length:",j?.length||0);const Q={mode:"visible",dataUrl:j,width:F?.getSize?.()?.width||0,height:F?.getSize?.()?.height||0};(L==="mobile"||L==="tablet")&&await ci(N),b={requestId:o,success:!0,result:Q,key:e?.key||"view:extension-popup"}}}catch(I){console.error("[View] Capture error:",I),b={requestId:o,success:!1,message:I?.message||String(I),key:e?.key||"view:extension-popup"}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(n==="tabs-create"){const b=String(e.url||"").trim(),I=e.requestId;let L=e.partition||null;if(!L&&b.startsWith(`${Ii}://`))try{L=`ext-${new URL(b).host}`}catch{}const A=L?ft(L):"",N=le.find(F=>F.url&&F.url.includes("result.html")&&(!A||ft(F.partition||"")===A));N?(console.log("[View] Reusing existing result tab:",N.id),await ro(N.id,b,L,"Result"),e.active!==!1&&await je(N.id)):await Be(b,L,"Result",null,{active:e.active!==!1,extensionEntryPath:e.entryPath}),I&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:I,success:!0});return}if(n==="tabs-close"){let b={requestId:o,success:!1,message:"Tab not found"};try{const I=String(e?.tabId||"").trim();le.find(A=>A.id===I)?(Yt(I),b={requestId:o,success:!0,result:{id:I,closed:!0}}):b={requestId:o,success:!1,message:"Tab not found"}}catch(I){b={requestId:o,success:!1,message:I?.message||String(I)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(!t)return;const r=tt(),u=et(),h=r?.partition||ae[me]?.partition||be.guest,C=/^file:\/\//i.test(t),P={extensionEntryPath:C?String(e?.entryPath||"").trim():"",extensionActiveContext:{url:String(u?.getURL?.()||r?.url||"").trim(),title:String(u?.getTitle?.()||r?.title||"").trim()},active:e?.active!==!1};if(C){const b=le.find(I=>I.url===t);if(b){await je(b.id),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:b.id,url:t,title:b.title||"New Tab",active:!0}});return}}if(n==="tabs-update"&&r&&!r.isHome&&!r.nativePage){await yt(t,h,"New Tab",null,P),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:r.id,url:t,title:r.title||"New Tab",active:!0}});return}r?.id;const k=Be(t,h,"New Tab",null,P);o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:k?.id||"",url:t,title:k?.title||"New Tab",active:e?.active!==!1}})}function ir(){xn||(xn=!0,document.addEventListener("click",Qo),document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const n=String(e.key||"").toLowerCase();if(!(!(e.key==="Tab"||e.key==="PageUp"||e.key==="PageDown")&&fo(e.target))){if(n==="h"&&!e.shiftKey){e.preventDefault(),Wt("history");return}if(n==="d"&&e.shiftKey){e.preventDefault(),Wt("downloads");return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation(),xt(e.shiftKey?-1:1);return}if(e.key==="PageUp"){e.preventDefault(),e.stopPropagation(),xt(-1);return}e.key==="PageDown"&&(e.preventDefault(),e.stopPropagation(),xt(1))}},!0),window.addEventListener("resize",At),Xo(),window.api&&typeof window.api.onViewTabShortcut=="function"&&window.api.onViewTabShortcut(e=>{const n=Number(e?.direction||0);n&&xt(n<0?-1:1)}),window.api&&typeof window.api.onBrowserExtensionsUpdated=="function"&&window.api.onBrowserExtensionsUpdated(()=>{console.log("Browser extensions updated, refreshing UI..."),Hn().catch(()=>{})}),window.api&&typeof window.api.onNativeTabContextAction=="function"&&window.api.onNativeTabContextAction(e=>{Zo(e).catch(()=>{})}),window.api&&typeof window.api.onBrowserExtensionCommand=="function"&&window.api.onBrowserExtensionCommand(e=>{nr(e).catch(n=>{console.error("Browser extension command failed",n)})}))}let Rt,_n;const Dn=new ResizeObserver(()=>{const e=et();!e||typeof e.syncBounds!="function"||(e.syncBounds(!0),clearInterval(Rt),clearTimeout(_n),Rt=setInterval(()=>{const n=et();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},50),_n=setTimeout(()=>{clearInterval(Rt);const n=et();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},350))});(function(){const n=document.getElementById("webviews-container");if(n){Dn.observe(n);return}const t=new MutationObserver(()=>{const o=document.getElementById("webviews-container");o&&(t.disconnect(),Dn.observe(o))});t.observe(document.documentElement,{childList:!0,subtree:!0})})();window.enterSiteSnapStudioMode=function(){document.body.classList.add("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.add("sitesnap-studio-mode");try{window.parent.document.body.classList.add("sitesnap-studio-active")}catch(n){console.error("Failed to set parent active layout",n)}};window.exitSiteSnapStudioMode=function(){document.body.classList.remove("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.remove("sitesnap-studio-mode");try{window.parent.document.body.classList.remove("sitesnap-studio-active")}catch(n){console.error("Failed to remove parent active layout",n)}};
