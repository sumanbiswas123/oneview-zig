import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{o as rt,c as Je,e as Ce}from"./utils-xPDMCTXC.js";import{s as Ve}from"./notifications-CBkElf_0.js";import{i as un,l as Si}from"./external-exe-DRsy67iY.js";import{c as pn,i as Ei,s as xi,t as Ci}from"./webcontent-client-DJU5VCvB.js";import{n as ft,R as Un,i as Lt,c as Ii,I as kt}from"./app-env-Dw5Rxq_p.js";import{S as Xe,P as be}from"./app-runtime-CuOCpSBc.js";function Li({state:e,constants:n,escapeHtml:t,showToast:i,isPerfEnabled:r,formatDownloadBytes:c,formatDownloadSpeed:w,formatDownloadEta:E,formatHistoryTime:k,loadManagedDownloadsFromMain:L,refreshExtensionsManagerList:b,saveProfileHistoryStore:x,getActiveTab:I,updateTabTitle:A,createTab:R,switchTab:H,navigateTo:z}){const{PROFILES:ee,PARTITIONS:ue,IS_DEV_APP_BUILD:Y}=n;function oe(f=""){const T=String(f||"").trim().toLowerCase();return["downloads","history","extensions","passwords"].includes(T)?T:"extensions"}function ye(f="extensions"){const T=oe(f);return T==="downloads"?"Downloads":T==="history"?"History":T==="passwords"?"Passwords":"Extensions"}function Ie(f="extensions"){const T=oe(f);return T==="downloads"?"Ctrl+Shift+D":T==="history"?"Ctrl+H":T==="extensions"?"Ctrl+E":""}function et(f){const T=f instanceof Element?f:null;return T?T.closest("input, textarea, select")?!0:T.isContentEditable===!0:!1}function De(f="settings",T="extensions"){return{type:String(f||"settings").trim().toLowerCase(),section:oe(T)}}function se(f="extensions"){const T=oe(f);return e.tabs.find(C=>C?.nativePage?.type==="settings"&&oe(C?.nativePage?.section)===T)||null}function we(f){return f?.nativePage?.type==="settings"}async function je(){if(!window.api)return e.nativeSettingsGeneralInfo;try{if(!e.nativeSettingsGeneralInfo.version&&window.api.getAppVersion&&(e.nativeSettingsGeneralInfo.version=await window.api.getAppVersion()),!e.nativeSettingsGeneralInfo.defaultOpenStatus&&window.api.getDefaultOpenHandlingStatus){const f=await window.api.getDefaultOpenHandlingStatus();e.nativeSettingsGeneralInfo.defaultOpenStatus=f?.isDefault||f?.success?"Configured":"Needs setup"}}catch{}return e.nativeSettingsGeneralInfo}function Le(){return Object.entries(e.profileHistoryCache||{}).flatMap(([f,T])=>(Array.isArray(T)?T:[]).map(C=>({profileId:f,profileName:ee[f]?.name||f||"Unknown",url:String(C?.url||"").trim(),title:String(C?.title||"Untitled").trim()||"Untitled",visitedAt:C?.visitedAt?Number(C.visitedAt):0}))).filter(f=>f.url&&f.visitedAt).sort((f,T)=>Number(T.visitedAt||0)-Number(f.visitedAt||0))}function xe(f){const T=new Date(Number(f||0));if(Number.isNaN(T.getTime()))return"Unknown Date";const C=new Date,P=new Date(C.getFullYear(),C.getMonth(),C.getDate()).getTime(),D=new Date(T.getFullYear(),T.getMonth(),T.getDate()).getTime(),Q=P-1440*60*1e3;return D===P?"Today":D===Q?"Yesterday":T.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function ke(f=[]){const T=[],C=new Map;return f.forEach(P=>{const D=xe(P.visitedAt);if(!C.has(D)){const Q={key:`${D}-${P.visitedAt}`,label:D,entries:[]};C.set(D,Q),T.push(Q)}C.get(D).entries.push(P)}),T}function ze(){return e.managedDownloadsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.managedDownloadsCache.map(f=>{const T=f.totalBytes?Math.max(0,Math.min(100,Math.round(f.receivedBytes/f.totalBytes*100))):f.state==="completed"?100:0,C=f.totalBytes?`${c(f.receivedBytes)} / ${c(f.totalBytes)}`:c(f.receivedBytes),P=f.state==="progressing"?`${w(f.bytesPerSecond)} - ${E(f.etaSeconds)}`:f.state==="completed"?`Saved to ${t(f.savePath||"")}`:t(String(f.state||"Unknown"));return`
              <article class="native-settings-row native-settings-download-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.fileName||"Download")}</div>
                    <div class="native-settings-row-note">${t(C)}</div>
                    <div class="native-settings-row-note">${P}</div>
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
    `:'<div class="native-settings-empty">No downloads yet.</div>'}function qe(){const f=e.historySearchQuery.trim().toLowerCase(),T=Le().filter(P=>f?`${P.title||""} ${P.url||""} ${P.profileName||""}`.toLowerCase().includes(f):!0);return T.length?`
      <div class="native-history-flat-list">
        ${ke(T).map(P=>`
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${t(P.label)}</span>
                </div>
                ${P.entries.map(D=>`
                      <article class="native-history-entry">
                        <div class="native-history-entry-content">
                          <div class="native-history-entry-title">${t(D.title||"Untitled")}</div>
                          <div class="native-history-entry-url">${t(D.url||"")}</div>
                          <div class="native-history-entry-meta">${t(D.profileName)} • ${t(k(D.visitedAt))}</div>
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
    `:`<div class="native-settings-empty">${f?"No history matches your search.":"No history yet."}</div>`}function Me(){return e.browserExtensionsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.browserExtensionsCache.map(f=>`
              <article class="native-settings-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.name||"Unnamed Extension")}</div>
                    <div class="native-settings-row-note">${t(f.id||f.path||"")}</div>
                    ${Y?`<div class="native-settings-row-note">${t(f.path||"")}</div>`:""}
                  </div>
                  <div class="native-settings-inline-actions">
                    <button class="native-settings-action" type="button" data-native-extension-action="more" data-extension-path="${t(f.path||"")}">More</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="${f.enabled===!1?"enable":"disable"}" data-extension-path="${t(f.path||"")}">${f.enabled===!1?"Enable":"Disable"}</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="reload" data-extension-path="${t(f.path||"")}">Reload</button>
                    ${Y?`<button class="native-settings-action" type="button" data-native-extension-action="remove" data-extension-path="${t(f.path||"")}">Remove</button>`:""}
                  </div>
                </div>
              </article>
            `).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No extensions installed yet.</div>'}function Re(){const f=e.credentialCache||{},T=[];return Object.entries(f).forEach(([P,D])=>{(D||[]).forEach((Q,te)=>{T.push({key:`${P}:${te}`,profileId:P,domain:String(Q.domain||"").toLowerCase(),username:String(Q.username||""),password:String(Q.password||"")})})}),`
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
              <button type="button" id="nativePasswordToggleEye" class="password-visibility-toggle" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 18px;">
                👁️
              </button>
            </div>
          </div>
          <div class="password-field" style="grid-column: 1 / -1;">
            <label>Profile</label>
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${Object.entries(ee).map(([P,D])=>`
        <label class="profile-pill-item" style="cursor: pointer;" data-profile-id="${t(P)}">
          <input type="radio" name="nativePasswordProfile" value="${t(P)}" ${P===(e.passwordProfileId||e.currentProfileId||"guest")?"checked":""} style="cursor: pointer;" />
          <span class="profile-pill-dot" style="background-color: ${t(D.color||"#000")}"></span>
          <span>${t(D.name||"")}</span>
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
              ${T.map(P=>`
                <div class="password-item" data-key="${t(P.key)}">
                  <div><strong>${t(P.domain)}</strong><div class="password-meta">${t(P.profileId)}</div></div>
                  <div>${t(P.username)}</div>
                  <div class="password-secret">${t(P.password)}</div>
                  <div class="password-actions">
                    <button type="button" class="password-action-btn" data-action="edit">Edit</button>
                    <button type="button" class="password-action-btn" data-action="delete">Delete</button>
                  </div>
                </div>
              `).join("")}
            </div>`}
      </section>
    `}async function Ye(){if(window.api?.listProfileCredentials)try{const f=await window.api.listProfileCredentials();if(f&&Array.isArray(f.data)){const T={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};f.data.forEach(C=>{const P=String(C.profileId||"").toLowerCase();T[P]||(T[P]=[]),T[P].push(C)}),e.credentialCache=T}}catch(f){console.error("loadCredentialsIntoCache error:",f)}}function ge(f){const T=document.getElementById("nativeTabContent");if(!T||!we(f))return;const C=oe(f.nativePage?.section);let P="",D="";const Q=ye(C);let te="Manage app behavior without leaving the browser shell.";if(C==="downloads"){const K=e.managedDownloadsCache.length,re=e.managedDownloadsCache.filter(F=>F.state==="progressing").length;P=ze(),te=`${re} active, ${K} total downloads.`}else if(C==="history"){const K=Le(),re=e.historySearchQuery.trim()?K.filter(F=>`${F.title||""} ${F.url||""} ${F.profileName||""}`.toLowerCase().includes(e.historySearchQuery.trim().toLowerCase())).length:K.length;D=`
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
      `,P=qe(),te=`${re} total history entries across all profiles.`}else if(C==="extensions"){const K=e.browserExtensionsCache.filter(re=>re.enabled!==!1).length;D=`
        <div class="native-settings-toolbar">
          ${Y?'<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>':""}
        </div>
      `,P=Me(),te=`${K} enabled out of ${e.browserExtensionsCache.length} extensions.`}else C==="passwords"?(P=Re(),te="Manage saved passwords securely.",e._credentialsLoaded||(e._credentialsLoaded=!0,Ye().then(()=>{ge(f)}))):e._credentialsLoaded=!1;T.innerHTML=`
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${t(Q)}</h2>
                <p>${t(te)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions","history","downloads","passwords"].map(K=>{const re=Ie(K);return`
                    <button
                      type="button"
                      class="native-settings-chip ${K===C?"is-active":""}"
                      data-native-settings-nav="${K}"
                      title="${t(ye(K))}${re?` (${re})`:""}"
                    >
                      <span>${t(ye(K))}</span>
                      ${re?`<span class="native-settings-chip-shortcut">${t(re)}</span>`:""}
                    </button>
                  `}).join("")}
            </div>
            ${D}
          </div>
          <div class="native-settings-body">
            ${P}
          </div>
        </section>
      </div>
    `}async function Ee(){const f=I();we(f)&&ge(f)}function Ue(f="extensions",T=e.activeTabId){const C=e.tabs.find(D=>D.id===T);if(!we(C))return;const P=oe(f);C.nativePage.section=P,A(C.id,ye(P)),C.id===e.activeTabId&&ge(C)}function Ae(f="extensions"){const T=se(f);if(T){H(T.id);return}R(null,null,ye(f),null,{nativePage:De("settings",f)})}function Ge(){const f=document.getElementById("settingsBtn");f&&f.dataset.boundClick!=="1"&&(f.dataset.boundClick="1",f.addEventListener("click",()=>{Ae("extensions")}))}function nt(){const f=document.getElementById("nativeTabContent");if(!f||f.dataset.boundNativeSettings==="1")return;f.dataset.boundNativeSettings="1",window.addEventListener("credentials-updated",()=>{e._credentialsLoaded=!1;const C=I();we(C)&&C.nativePage?.section==="passwords"&&Ye().then(()=>{ge(C)})});const T=(C=null,P=null)=>{requestAnimationFrame(()=>{const D=document.getElementById("nativeHistorySearchInput");if(D&&(D.focus({preventScroll:!0}),Number.isInteger(C)&&Number.isInteger(P)&&typeof D.setSelectionRange=="function"))try{D.setSelectionRange(C,P)}catch{}})};f.addEventListener("click",async C=>{const P=C.target.closest(".password-visibility-toggle");if(P){C.preventDefault();const F=document.getElementById("nativePasswordSecretInput");if(F){const Z=F.type==="password";F.type=Z?"text":"password",P.textContent=Z?"🙈":"👁️"}return}const D=C.target.closest("[data-native-settings-nav]");if(D){Ue(D.dataset.nativeSettingsNav||"extensions");return}const Q=C.target.closest("[data-native-settings-action]");if(Q){const F=String(Q.dataset.nativeSettingsAction||"").trim();try{F==="check-updates"&&window.api?.checkForUpdates?(await window.api.checkForUpdates(),i("Update check started.","success")):F==="open-default-apps"&&window.api?.openDefaultAppSettings?await window.api.openDefaultAppSettings():F==="load-unpacked-extension"&&window.api?.addBrowserExtensionsUnpacked?(await window.api.addBrowserExtensionsUnpacked(),await b(),await Ee(),i("Unpacked extensions loaded.","success")):F==="clear-history"&&(Object.keys(e.profileHistoryCache||{}).forEach(Z=>{e.profileHistoryCache[Z]=[]}),x(),ge(I()))}catch(Z){i(Z?.message||"Could not complete settings action.","error")}return}const te=C.target.closest("[data-native-download-action]");if(te){try{const F=await window.api?.runManagedDownloadAction?.({id:String(te.dataset.downloadId||"").trim(),action:String(te.dataset.nativeDownloadAction||"").trim()});Array.isArray(F?.downloads)?e.managedDownloadsCache=F.downloads:await L(),await Ee()}catch(F){i(F?.message||"Could not complete download action.","error")}return}const K=C.target.closest("[data-native-history-action]");if(K){const F=String(K.dataset.profileId||e.historyProfileId||e.currentProfileId),Z=String(K.dataset.historyTime||""),d=(e.profileHistoryCache[F]||[]).findIndex(S=>String(S.visitedAt||"")===Z),m=d>=0?(e.profileHistoryCache[F]||[])[d]:null;if(!m)return;if(K.dataset.nativeHistoryAction==="delete")e.profileHistoryCache[F].splice(d,1),x(),e.historyProfileId=F,ge(I());else{const S=ee[F]?.partition||ue.guest;R(m.url,S,m.title||"History",F)}return}const re=C.target.closest("[data-native-extension-action]");if(re){const F=String(re.dataset.nativeExtensionAction||"").trim(),Z=String(re.dataset.extensionPath||"").trim();try{F==="more"&&window.api?.getExtensionShortcutsInfo?await he(Z):F==="reload"&&window.api?.reloadBrowserExtension?(await window.api.reloadBrowserExtension({path:Z}),i("Extension reloaded.","success")):(F==="enable"||F==="disable")&&window.api?.toggleBrowserExtension?(F==="disable"&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.toggleBrowserExtension({path:Z,enabled:F==="enable"})):F==="remove"&&window.api?.removeBrowserExtension&&(typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.removeBrowserExtension({path:Z})),await b(),await Ee()}catch(d){i(d?.message||"Could not complete extension action.","error")}}}),f.addEventListener("input",C=>{const P=C.target.closest("#nativeHistorySearchInput");if(P){const Q=Number.isInteger(P.selectionStart)?P.selectionStart:null,te=Number.isInteger(P.selectionEnd)?P.selectionEnd:Q;e.historySearchQuery=String(P.value||""),ge(I()),T(Q,te);return}const D=C.target.closest("input[name='nativePasswordProfile']");if(D){e.passwordProfileId=String(D.value||"");return}}),f.addEventListener("submit",async C=>{const P=C.target.closest("#nativePasswordForm");if(!P)return;C.preventDefault();const D=document.getElementById("nativePasswordDomainInput"),Q=document.getElementById("nativePasswordUsernameInput"),te=document.getElementById("nativePasswordSecretInput");if(!D||!Q||!te)return;const K=String(D.value||"").trim().toLowerCase(),re=String(Q.value||"").trim(),F=String(te.value||""),Z=e.passwordProfileId||e.currentProfileId||"guest";if(!K||!re||!F){i("Please fill in all fields.","error");return}try{if(!window.api?.saveProfileCredential){i("Credential API unavailable.","error");return}const d=await window.api.saveProfileCredential({profileId:Z,domain:K,username:re,password:F});if(!d||!d.success){i("Failed to save credential.","error");return}await Ye(),i("Credential saved successfully.","success"),P.reset(),ge(I())}catch(d){i(d?.message||"Could not save credential.","error")}}),f.addEventListener("click",async C=>{const P=C.target.closest(".password-action-btn");if(!P)return;const D=String(P.dataset.action||"").trim(),Q=P.closest(".password-item"),te=String(Q?.dataset.key||""),[K,re]=te.split(":"),F=Number(re);if(!K||Number.isNaN(F))return;const d=((e.credentialCache||{})[K]||[])[F];if(d)try{if(D==="delete"){if(!window.api?.deleteProfileCredential){i("Credential API unavailable.","error");return}const m=await window.api.deleteProfileCredential({profileId:K,domain:String(d.domain||"").toLowerCase(),username:String(d.username||"")});if(!m||!m.success){i("Failed to delete credential.","error");return}await Ye(),i("Credential deleted successfully.","success"),ge(I())}else if(D==="edit"){const m=document.getElementById("nativePasswordDomainInput"),S=document.getElementById("nativePasswordUsernameInput"),B=document.getElementById("nativePasswordSecretInput"),U=document.getElementById("nativePasswordProfileSelect");if(!m||!S||!B)return;e.passwordProfileId=K,m.value=String(d.domain||"").toLowerCase(),S.value=String(d.username||""),B.value=String(d.password||""),U&&(U.innerHTML=Object.entries(ee||{}).map(([s,p])=>`
                <label class="profile-pill-item ${s===K?"active":""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${t(s)}" ${s===K?"checked":""} style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${t(p.color||"#000")}"></span>
                  <span>${t(p.name||"")}</span>
                </label>
              `).join(""),U.addEventListener("change",s=>{const p=s.target.value;p&&(e.passwordProfileId=p)})),document.getElementById("nativePasswordForm")?.scrollIntoView({behavior:"smooth"}),m.focus()}}catch(m){i(m?.message||"Could not complete password action.","error")}})}function tt(){document.addEventListener("keydown",f=>{et(f.target)||f.ctrlKey&&((f.key==="H"||f.key==="h")&&!f.shiftKey?(f.preventDefault(),Ae("history")):(f.key==="E"||f.key==="e")&&!f.shiftKey?(f.preventDefault(),Ae("extensions")):(f.key==="D"||f.key==="d")&&f.shiftKey&&(f.preventDefault(),Ae("downloads")))})}async function he(f=""){const T=document.getElementById("extensionDetailsModal"),C=document.getElementById("extensionDetailsCloseBtn"),P=document.getElementById("extensionDetailsContent"),D=document.getElementById("extensionDetailsTitle");if(!(!T||!P))try{const Q=await window.api?.getExtensionShortcutsInfo?.({path:f});if(!Q?.success)P.innerHTML='<div class="extension-details-empty">Unable to load extension details.</div>';else{const{name:te,shortcuts:K,errors:re,conflicts:F}=Q;D.textContent=`${t(te||"Extension")} Details`;let Z="";K&&K.length>0?Z=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-shortcuts-list">
                ${K.map(S=>`
                      <div class="extension-shortcut-item">
                        <span class="extension-shortcut-key">${t(S.originalKey||S.key)}</span>
                        <span class="extension-shortcut-desc">${t(S.description||"No description")}</span>
                        <span class="extension-shortcut-status ${S.isActive?"active":"conflict"}">
                          ${S.isActive?"✓ Active":"⚠ Conflict"}
                        </span>
                      </div>
                    `).join("")}
              </div>
            </div>
          `:Z=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-details-empty">No keyboard shortcuts defined.</div>
            </div>
          `;let d="";re&&re.length>0&&(d=`
            <div class="extension-details-section">
              <h4>Issues</h4>
              <div class="extension-errors-list">
                ${re.map(S=>`
                      <div class="extension-error-item">
                        <div class="extension-error-type">${t(S.type)}</div>
                        <div class="extension-error-message">${t(S.message)}</div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `);let m="";F&&F.length>0&&(m=`
            <div class="extension-details-section">
              <h4>Shortcut Conflicts</h4>
              <div class="extension-conflicts-list">
                ${F.map(S=>`
                      <div class="extension-conflict-item">
                        <div class="extension-conflict-key">${t(S.key)}</div>
                        <div class="extension-conflict-extensions">
                          <strong>Conflicting with:</strong><br/>
                          ${S.conflictingExtensions.map(B=>`${t(B.name)}`).join("<br/>")}
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `),P.innerHTML=`${Z}${d}${m}`}T.classList.remove("hidden"),C&&(C.onclick=()=>{T.classList.add("hidden")})}catch(Q){console.error("Failed to load extension details:",Q),P.innerHTML='<div class="extension-details-empty">Error loading extension details.</div>',T.classList.remove("hidden")}}return{bindSettingsShortcutsGlobal:tt,createNativePageDescriptor:De,ensureNativeSettingsGeneralInfo:je,getSettingsTabTitle:ye,getSettingsShortcut:Ie,initNativeSettingsUi:nt,initSettingsMenu:Ge,isEditableShortcutTarget:et,isNativeSettingsTab:we,normalizeSettingsSection:oe,openSettingsTab:Ae,refreshActiveNativeSettingsPage:Ee,renderNativeSettingsPage:ge,updateNativeSettingsTabSection:Ue}}function ki({state:e,constants:n,escapeHtml:t,showToast:i,openOverlayModal:r,closeOverlayModal:c,getActiveTab:w,getActiveWebview:E,createTab:k,refreshActiveNativeSettingsPage:L,closeSettingsMenu:b}){const{PROFILES:x,PENDING_EXTENSION_OPEN_STORAGE_KEY:I,EXTENSION_PIN_STORAGE_KEY:A}=n;let R=!1,H=null,z=null,ee={visible:!1,id:"",message:"",actionLabel:"",action:""},ue={},Y={entryPath:""},oe=!1;async function ye(){if(!window.api?.listBrowserExtensions)return e.browserExtensionsCache=[],e.browserExtensionsCache;const s=await window.api.listBrowserExtensions(),p=Array.isArray(s?.entries)?s.entries:[];return e.browserExtensionsCache=p.map(g=>{const u=(g.id||"guest").toLowerCase(),y=n.APP_PROTOCOL_SCHEME||"oneview-dev",O=String(g.path||"").trim().replace(/\\/g,"/").replace(/\/+$/,""),V=`file:///${O}`,N=ie=>{if(!ie||!ie.toLowerCase().startsWith("file://"))return ie;const ce=ie.replace(/\\/g,"/"),pe=decodeURI(ce);let ve=pe.replace(V,"").replace(/^\/+/,"");if(ve===pe){const fe=`/${O.split("/").pop()}/`,J=pe.indexOf(fe);J!==-1?ve=pe.slice(J+fe.length):ve=""}const ne=g.manifest?.entrypoints?.root||g.manifest?.entrypoints?.page||"index.html";return`${y}://${u}/${ve||ne}`};return{...g,rootUrl:N(g.rootUrl),optionsUrl:N(g.optionsUrl),popupUrl:N(g.popupUrl),sidePanelUrl:N(g.sidePanelUrl)}}),e.browserExtensionsCache}async function Ie(){let s="";try{s=String(sessionStorage.getItem(I)||"").trim()}catch{s=""}if(!s)return;try{sessionStorage.removeItem(I)}catch{}const p=e.browserExtensionsCache.find(g=>g.path===s);p&&await C(p.path,"tab")}function et(){try{const s=JSON.parse(localStorage.getItem(A)||"{}");ue=s&&typeof s=="object"&&!Array.isArray(s)?s:{}}catch{ue={}}}function De(){try{localStorage.setItem(A,JSON.stringify(ue||{}))}catch{}}function se(){return w()?.partition||x[e.currentProfileId]?.partition||x.guest.partition}function we(){const s=w(),p=E();return{url:String(p?.getURL?.()||s?.url||"").trim(),title:String(p?.getTitle?.()||s?.title||"").trim()}}function je(s={}){return String(s?.name||s?.actionTitle||"EX").trim().split(/\s+/).slice(0,2).map(g=>g.charAt(0)).join("").toUpperCase()}function Le(s={}){return String(s?.actionTitle||s?.name||"Extension").trim()}function xe(s={},p=""){const g=String(s?.path||"").trim(),u=String(p||"").trim().replace(/\\/g,"/");if(!g||!u)return"";const y=g.replace(/\\/g,"/").replace(/\/+$/,""),O=u.replace(/^\/+/,""),V=`${y}/${O}`;return`file:///${encodeURI(V.replace(/^([A-Za-z]):/,"$1:"))}`}function ke(s={}){return ue[String(s?.path||"").trim()]===!0}function ze(s={}){const p=(s?.id||"guest").toLowerCase(),g=s?.manifest?.entrypoints?.root||s?.manifest?.entrypoints?.page||"index.html";return`${n.APP_PROTOCOL_SCHEME}://${p}/${g}`}function qe(s={},p=""){const g=String(s?.actionIconFileUrl||xe(s,s?.actionIconPath||"")||s?.actionIconUrl||"").trim(),u=t(je(s));return g?`<img src="${t(g)}" alt="" />`:`<span class="${p}">${u}</span>`}function Me(s=0){const p=Number(s||0);return p>=1024*1024*1024?`${(p/(1024*1024*1024)).toFixed(1)} GB`:p>=1024*1024?`${(p/(1024*1024)).toFixed(1)} MB`:p>=1024?`${(p/1024).toFixed(1)} KB`:`${Math.max(0,Math.round(p))} B`}function Re(s=0){const p=Number(s||0);return p<=0?"":`${Me(p)}/s`}function Ye(s=null){const p=Number(s);if(!Number.isFinite(p)||p<0)return"";if(p<60)return`${Math.round(p)}s left`;const g=Math.floor(p/60),u=Math.round(p%60);return`${g}m ${u}s left`}function ge(s=""){return e.managedDownloadsCache.find(p=>p.id===s)||null}function Ee(){const s=document.getElementById("downloadsManagerBtn");s&&(s.classList.remove("has-download-highlight"),s.offsetWidth,s.classList.add("has-download-highlight"),H&&clearTimeout(H),H=setTimeout(()=>{s.classList.remove("has-download-highlight")},2300))}async function Ue(){if(!window.api?.listManagedDownloads)return e.managedDownloadsCache=[],e.managedDownloadsCache;const s=await window.api.listManagedDownloads();return e.managedDownloadsCache=Array.isArray(s?.downloads)?s.downloads:[],e.managedDownloadsCache}function Ae(){const s=document.getElementById("downloadsManagerPanel"),p=document.getElementById("downloadsManagerBtn");s&&!s.classList.contains("hidden")&&(R?c(()=>s.classList.add("hidden")):s.classList.add("hidden")),R=!1,p&&p.classList.remove("is-active")}function Ge(){const s=document.getElementById("downloadsManagerPanel"),p=document.getElementById("downloadsManagerBadge");if(!s)return;const g=e.managedDownloadsCache.filter(u=>u.state==="progressing"||u.state==="interrupted").length;p&&(g>0?(p.textContent=String(g),p.classList.remove("hidden")):(p.textContent="",p.classList.add("hidden"))),s.innerHTML=`
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${e.managedDownloadsCache.length?e.managedDownloadsCache.map(u=>{const y=t(u.fileName||"Download"),O=String(u.state||"progressing"),V=typeof u.progress=="number"?Math.max(0,Math.min(100,u.progress)):0,N=u.totalBytes>0?`${Me(u.receivedBytes)} / ${Me(u.totalBytes)}`:Me(u.receivedBytes),ie=Re(u.bytesPerSecond),ce=Ye(u.etaSeconds),pe=O==="completed"?"Completed":O==="cancelled"?"Cancelled":O==="interrupted"?"Interrupted":u.paused?"Paused":`Downloading ${V}%`,ve=[ie,ce].filter(Boolean).join(" • ");return`
                    <div class="downloads-manager-item">
                      <strong>${y}</strong>
                      <div class="downloads-manager-meta">${t(pe)} • ${t(N)}</div>
                      ${ve?`<div class="downloads-manager-meta">${t(ve)}</div>`:""}
                      <div class="downloads-manager-progress">
                        <span style="width:${V}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${O==="progressing"?u.paused?`<button type="button" data-download-id="${t(u.id)}" data-download-action="resume">Resume</button>`:`<button type="button" data-download-id="${t(u.id)}" data-download-action="pause">Pause</button>`:""}
                        ${O==="progressing"||O==="interrupted"?`<button type="button" data-download-id="${t(u.id)}" data-download-action="cancel">Cancel</button>`:""}
                        ${O==="interrupted"||O==="cancelled"?`<button type="button" data-download-id="${t(u.id)}" data-download-action="retry">Retry</button>`:""}
                        ${u.savePath?`<button type="button" data-download-id="${t(u.id)}" data-download-action="show">Show in Folder</button>`:""}
                        ${O==="completed"&&u.existsOnDisk?`<button type="button" data-download-id="${t(u.id)}" data-download-action="open">Open</button>`:""}
                         <button type="button" data-download-id="${t(u.id)}" data-download-action="remove">Delete</button>
                      </div>
                    </div>
                  `}).join(""):'<div class="downloads-manager-empty">No downloads yet.</div>'}
      </div>
    `}async function nt(s=null){const p=document.getElementById("downloadsManagerPanel"),g=document.getElementById("downloadsManagerBtn");if(!p||!g)return;if(!(s===null?p.classList.contains("hidden"):!!s)){Ae();return}f(),Ge();try{await r(()=>p.classList.remove("hidden"),{captureSnapshots:!1}),R=!0}catch{p.classList.remove("hidden"),R=!1}g.classList.add("is-active")}function tt(){let s=document.getElementById("downloadsShelf");s||(s=document.createElement("div"),s.id="downloadsShelf",s.className="downloads-shelf hidden",s.innerHTML=`
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `,document.body.appendChild(s),s.querySelector("#downloadsShelfClose")?.addEventListener("click",()=>{ee.visible=!1,tt()}),s.querySelector("#downloadsShelfAction")?.addEventListener("click",async()=>{const y=ge(ee.id);!y||!ee.action||!window.api?.runManagedDownloadAction||await window.api.runManagedDownloadAction({id:y.id,action:ee.action})}));const p=s.querySelector("#downloadsShelfTitle"),g=s.querySelector("#downloadsShelfMessage"),u=s.querySelector("#downloadsShelfAction");if(!ee.visible){s.classList.add("hidden");return}p&&(p.textContent="Downloads"),g&&(g.textContent=ee.message||""),u&&(u.textContent=ee.actionLabel||"Open",u.style.display=ee.action?"":"none"),s.classList.remove("hidden")}function he(s={},p="updated"){const g=String(s.fileName||"Download").trim()||"Download";if(p==="created")ee={visible:!0,id:String(s.id||""),message:`${g} started downloading`,actionLabel:"Show",action:"show"};else if(p==="completed")ee={visible:!0,id:String(s.id||""),message:`${g} downloaded`,actionLabel:"Open",action:"open"};else if(p==="interrupted")ee={visible:!0,id:String(s.id||""),message:`${g} was interrupted`,actionLabel:"Retry",action:"retry"};else return;tt(),z&&clearTimeout(z),z=setTimeout(()=>{ee.visible=!1,tt()},5e3)}function f(){const s=document.getElementById("browserExtensionsMenu"),p=document.getElementById("browserExtensionsMenuBtn");s&&!s.classList.contains("hidden")&&(oe?c(()=>s.classList.add("hidden")):s.classList.add("hidden")),oe=!1,p&&p.classList.remove("is-active")}async function T(s=null){const p=document.getElementById("browserExtensionsMenu"),g=document.getElementById("browserExtensionsMenuBtn");if(!p||!g)return;if(!(s===null?p.classList.contains("hidden"):!!s)){f();return}P().catch(()=>{}),re();try{await r(()=>p.classList.remove("hidden"),{captureSnapshots:!1}),oe=!0}catch(y){console.error("Failed to open extensions menu overlay",y),p.classList.remove("hidden"),oe=!1}g.classList.add("is-active")}async function C(s,p="tab"){const g=e.browserExtensionsCache.find(V=>V.path===s);if(!g)return;const u=(g?.id||"guest").toLowerCase();let y="";if(p==="options"&&g.optionsUrl){const V=g.manifest?.entrypoints?.options||"options.html";y=`${n.APP_PROTOCOL_SCHEME}://${u}/${V}`}else if(p==="root"&&g.rootUrl){const V=g.manifest?.entrypoints?.root||"result.html";y=`${n.APP_PROTOCOL_SCHEME}://${u}/${V}`}else y=ze(g);if(!y){i("This extension does not expose an openable page yet.","info");return}const O=`ext-${g.id||"guest"}`;k(y,O,`${g.name||"Extension"}${p==="options"?" Options":""}`,null,{extensionEntryPath:g.path,extensionActiveContext:we()})}async function P(){if(window.api?.closeBrowserExtensionPopup)try{await window.api.closeBrowserExtensionPopup()}catch{}Y={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(s=>s.classList.remove("is-active"))}function D(s={}){const p=document.getElementById("browserExtensionPopupTitle"),g=document.getElementById("browserExtensionPopupSubtitle"),u=document.getElementById("browserExtensionPopupIcon");p&&(p.textContent=Le(s)),g&&(g.textContent=s?.popupUrl?"Popup":s?.optionsUrl?"Extension page":s?.rootUrl?"Extension":""),u&&(u.innerHTML=qe(s,"browser-extension-popup-fallback"))}function Q(s){if(!s||typeof s.getBoundingClientRect!="function")return{left:0,top:0,bottom:0,width:0,height:0};const p=s.getBoundingClientRect();return{left:Number(p.left||0),top:Number(p.top||0),bottom:Number(p.bottom||0),width:Number(p.width||0),height:Number(p.height||0)}}async function te(s,p=null){const g=e.browserExtensionsCache.find(ce=>ce.path===s);if(!g)return;const u=String(g.popupUrl||"").trim()||String(g.optionsUrl||"").trim();if(!u){await C(s,"tab");return}if(Y.entryPath===s){await P();return}await P(),f();const y=window.api?.openBrowserExtensionPopup;if(typeof y!="function")throw new Error("Extension popup API is unavailable");const O=we(),V=`ext-${g.id||"guest"}`,N=await y({url:u,entryPath:s,partition:V,anchor:Q(p),activeUrl:O.url||"",activeTitle:O.title||""});if(!N?.success)throw new Error(N?.message||"Could not open extension popup");D(g),Y={entryPath:s,pageType:"popup",host:null,overlayActive:!1};const ie=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(s):s.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${ie}"]`).forEach(ce=>ce.classList.add("is-active"))}function K(){const s=document.getElementById("browserExtensionsPinned");if(!s)return;const p=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,g=e.browserExtensionsCache.filter(y=>{const O=y.id==="sitesnap-studio"||String(y.name||"").toLowerCase().includes("sitesnap")||String(y.id||"").toLowerCase().includes("sitesnap");return p?y.enabled!==!1&&O:y.enabled!==!1&&!O}),u=p?g:g.filter(y=>ke(y));if(!u.length){s.innerHTML="",s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=u.map(y=>`
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${t(y.path||"")}"
            title="${t(Le(y))}"
            aria-label="${t(Le(y))}"
          >
            ${qe(y,"browser-extension-action-fallback")}
          </button>
        `).join("")}function re(){const s=document.getElementById("browserExtensionsMenu");if(!s)return;const p=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,g=e.browserExtensionsCache.filter(u=>{const y=u.id==="sitesnap-studio"||String(u.name||"").toLowerCase().includes("sitesnap")||String(u.id||"").toLowerCase().includes("sitesnap");return p?u.enabled!==!1&&y:u.enabled!==!1&&!y});s.innerHTML=`
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${g.length?g.map(u=>{const y=t(u.path||""),O=t(Le(u)),V=t(u.version?`v${u.version}${u.id?` • ${u.id}`:""}`:u.id||u.name||"");return`
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${qe(u,"browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${O}</strong>
                          <p>${V}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${y}"
                          title="${ke(u)?"Unpin":"Pin"}"
                          aria-label="${ke(u)?"Unpin":"Pin"}"
                        >
                          ${ke(u)?"Unpin":"Pin"}
                        </button>
                      </div>
                      <div class="browser-extension-menu-actions">
                        <button type="button" data-menu-action="popup" data-path="${y}">
                          ${u.popupUrl?"Open Popup":"Open"}
                        </button>
                        ${u.optionsUrl?`<button type="button" data-menu-action="options" data-path="${y}">Options</button>`:""}
                        ${u.rootUrl?`<button type="button" data-menu-action="tab" data-path="${y}">Open in Tab</button>`:""}
                      </div>
                    </div>
                  `}).join(""):'<div class="browser-extensions-empty">No enabled extensions yet.</div>'}
      </div>
    `}function F(){K(),re()}function Z(){const s=document.getElementById("extensionsManagerList");if(!s)return;const p=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,g=e.browserExtensionsCache.filter(u=>{const y=u.id==="sitesnap-studio"||String(u.name||"").toLowerCase().includes("sitesnap")||String(u.id||"").toLowerCase().includes("sitesnap");return p?y:!y});if(!g.length){s.innerHTML=`
        <div class="extensions-empty-state">
          No unpacked extensions added yet.
        </div>
      `;return}s.innerHTML=g.map(u=>{const y=t(u.path||"");return`
          <div class="extension-item ${u.enabled===!1?"is-disabled":""}">
            <div class="extension-main">
              <div class="extension-title-row">
                <h4>${t(u.name||"Unnamed Extension")}</h4>
                <span class="extension-badge ${u.customBridge?"custom":"normal"}">
                  ${u.customBridge?"OneView":"Legacy"}
                </span>
                ${u.enabled===!1?'<span class="extension-status-pill">Disabled</span>':""}
              </div>
              <div class="extension-meta-row">
                ${u.version?`<span>v${t(u.version)}</span>`:""}
                ${u.id?`<span>${t(u.id)}</span>`:""}
              </div>
              ${n.IS_DEV_APP_BUILD?`<div class="extension-path">${y}</div>`:""}
              ${u.loadError?`<div class="extension-error">${t(u.loadError)}</div>`:""}
            </div>
            <div class="extension-actions">
              ${u.popupUrl?`<button type="button" class="extension-action-btn" data-action="open-popup" data-path="${y}">Popup</button>`:""}
              ${u.rootUrl||u.linkUrl?`<button type="button" class="extension-action-btn" data-action="open-tab" data-path="${y}">Open Tab</button>`:""}
              ${u.optionsUrl?`<button type="button" class="extension-action-btn" data-action="open-options" data-path="${y}">Options</button>`:""}
              <button type="button" class="extension-action-btn" data-action="reload" data-path="${y}">
                Reload
              </button>
              <button type="button" class="extension-action-btn" data-action="toggle" data-path="${y}">
                ${u.enabled===!1?"Enable":"Disable"}
              </button>
              ${n.IS_DEV_APP_BUILD?`<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${y}">Remove</button>`:""}
            </div>
          </div>
        `}).join("")}async function d(){try{await ye()}catch(s){console.error("Failed to refresh browser extensions list",s)}Z(),F()}async function m(s,p){const g=e.browserExtensionsCache.find(y=>y.path===s);if(!g)return;const u=p==="options"?g.optionsUrl:p==="root"?g.rootUrl:ze(g);if(!u){i(`This extension does not expose a ${p} page.`,"info");return}k(u,se(),`${g.name||"Extension"} ${p==="options"?"Options":"Popup"}`,null,{extensionEntryPath:g.path,extensionActiveContext:we()})}async function S(){const s=document.getElementById("extensionsManagerModal");if(s){f(),await P(),Z(),F();try{await r(()=>s.classList.remove("hidden"))}catch(p){console.error("openOverlayModal failed for extensions manager",p),s.classList.remove("hidden")}d().catch(p=>{console.error("Failed to refresh extensions manager after open",p)})}}function B(){const s=document.getElementById("extensionsManagerModal");s&&c(()=>s.classList.add("hidden"))}function U(){const s=document.getElementById("extensionsBtn"),p=document.getElementById("settingsBtn"),g=document.getElementById("extensionsModalCloseBtn"),u=document.getElementById("extensionsLoadBtn"),y=document.getElementById("extensionsManagerList"),O=document.getElementById("browserExtensionsPinned"),V=document.getElementById("browserExtensionsMenuBtn"),N=document.getElementById("browserExtensionsMenu"),ie=document.getElementById("downloadsManagerBtn"),ce=document.getElementById("downloadsManagerPanel"),pe=document.getElementById("browserExtensionPopupClose"),ve=document.getElementById("browserExtensionPopupOpenTab");et(),Z(),F(),d().catch(ne=>{console.error("Failed to refresh extensions manager after open",ne)}),ye().then(()=>{if(Ie(),window.api?.prewarmBrowserExtensionPopup){const G=e.browserExtensionsCache.filter(J=>J.enabled!==!1).filter(J=>ke(J));let fe={partition:se()};if(G.length>0){const J=G[0],de=String(J.popupUrl||"").trim()||String(J.optionsUrl||"").trim();de&&(fe={...fe,url:de,entryPath:J.path})}window.api.prewarmBrowserExtensionPopup(fe).catch(()=>{})}}).catch(()=>{}),window.api?.onBrowserExtensionPopupState&&window.api.onBrowserExtensionPopupState(ne=>{const{entryPath:G,open:fe}=ne||{};if(fe){Y={entryPath:G,pageType:"popup",host:null,overlayActive:!1};const J=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(G):G.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${J}"]`).forEach(de=>de.classList.add("is-active"))}else Y.entryPath===G&&(Y={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(J=>J.classList.remove("is-active")))}),s&&s.dataset.boundClick!=="1"&&(s.dataset.boundClick="1",s.addEventListener("click",()=>{S().catch(ne=>{console.error("Failed to open extensions manager",ne),i("Could not open extensions manager.","error")})})),g&&g.dataset.boundClick!=="1"&&(g.dataset.boundClick="1",g.addEventListener("click",B)),u&&u.dataset.boundClick!=="1"&&(u.dataset.boundClick="1",u.addEventListener("click",async()=>{try{if(!window.api?.addBrowserExtensionsUnpacked){i("Extension manager API is unavailable.","error");return}const ne=await window.api.addBrowserExtensionsUnpacked();e.browserExtensionsCache=Array.isArray(ne?.entries)?ne.entries:[],Z(),F(),i("Unpacked extensions loaded.","success")}catch(ne){console.error("Failed to load unpacked extensions",ne),i(ne?.message||"Could not load unpacked extensions.","error")}})),y&&y.dataset.boundClick!=="1"&&(y.dataset.boundClick="1",y.addEventListener("click",async ne=>{const G=ne.target.closest("[data-action]");if(!G)return;const fe=String(G.dataset.action||"").trim(),J=String(G.dataset.path||"").trim();if(J)try{if(fe==="open-popup"){await m(J,"popup");return}if(fe==="open-tab"){await m(J,"tab");return}if(fe==="open-options"){await m(J,"options");return}if(fe==="reload"&&window.api?.reloadBrowserExtension){const de=await window.api.reloadBrowserExtension({path:J});e.browserExtensionsCache=Array.isArray(de?.entries)?de.entries:e.browserExtensionsCache,Z(),F(),i("Extension reloaded.","success");return}if(fe==="toggle"&&window.api?.toggleBrowserExtension){const de=e.browserExtensionsCache.find(dt=>dt.path===J);de?.enabled!==!1&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const ct=await window.api.toggleBrowserExtension({path:J,enabled:de?.enabled===!1});e.browserExtensionsCache=Array.isArray(ct?.entries)?ct.entries:e.browserExtensionsCache,Z(),F(),i("Extension state updated.","success");return}if(fe==="remove"&&window.api?.removeBrowserExtension){typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const de=await window.api.removeBrowserExtension({path:J});e.browserExtensionsCache=Array.isArray(de?.entries)?de.entries:e.browserExtensionsCache,Z(),F(),i("Extension removed.","success")}}catch(de){console.error("Extension manager action failed",de),i(de?.message||"Could not complete extension action.","error")}})),O&&O.dataset.boundClick!=="1"&&(O.dataset.boundClick="1",O.addEventListener("click",async ne=>{const G=ne.target.closest("[data-path]");if(!G)return;const fe=String(G.dataset.path||"").trim();if(fe)try{await te(fe,G)}catch(J){console.error("Failed to open extension popup",J),i(J?.message||"Could not open extension popup.","error")}})),V&&V.dataset.boundClick!=="1"&&(V.dataset.boundClick="1",V.addEventListener("click",()=>{T().catch(ne=>{console.error("Failed to toggle extensions menu",ne),i("Could not open extensions menu.","error")})})),N&&N.dataset.boundClick!=="1"&&(N.dataset.boundClick="1",N.addEventListener("click",async ne=>{const G=ne.target.closest("[data-menu-action]");if(!G)return;const fe=String(G.dataset.menuAction||"").trim(),J=String(G.dataset.path||"").trim();try{if(fe==="manage"){f(),await S();return}if(!J)return;if(fe==="pin"){const de=!ue[J];ue[J]=de,De(),F();return}if(fe==="popup"){await te(J,V||G);return}if(fe==="options"){f(),await C(J,"options");return}fe==="tab"&&(f(),await C(J,"tab"))}catch(de){console.error("Extension menu action failed",de),i(de?.message||"Could not complete extension action.","error")}})),pe&&pe.dataset.boundClick!=="1"&&(pe.dataset.boundClick="1",pe.addEventListener("click",()=>{P().catch(()=>{})})),ve&&ve.dataset.boundClick!=="1"&&(ve.dataset.boundClick="1",ve.addEventListener("click",async()=>{Y.entryPath&&(await C(Y.entryPath,"tab"),await P())})),document.body&&document.body.dataset.boundExtensionUiDismiss!=="1"&&(document.body.dataset.boundExtensionUiDismiss="1",document.addEventListener("click",ne=>{const G=ne.target;p&&!p.contains(G)&&b(),N&&!N.classList.contains("hidden")&&!N.contains(G)&&!V?.contains(G)&&!s?.contains(G)&&f(),ce&&!ce.classList.contains("hidden")&&!ce.contains(G)&&!ie?.contains(G)&&Ae(),!G.closest(".browser-extension-action-btn")&&!N?.contains(G)&&P().catch(()=>{})}),document.addEventListener("keydown",ne=>{ne.key==="Escape"&&(b(),f(),Ae(),P().catch(()=>{}))}))}function W(){const s=document.getElementById("downloadsManagerBtn"),p=document.getElementById("downloadsManagerPanel");s&&s.dataset.boundClick!=="1"&&(s.dataset.boundClick="1",s.addEventListener("click",()=>{nt().catch(()=>{})})),p&&p.dataset.boundClick!=="1"&&(p.dataset.boundClick="1",p.addEventListener("click",async g=>{const u=g.target.closest("[data-download-action]");if(!u)return;const y=String(u.dataset.downloadAction||"").trim(),O=String(u.dataset.downloadId||"").trim();if(y)try{if(!window.api?.runManagedDownloadAction)return;const V=await window.api.runManagedDownloadAction({id:O,action:y});Array.isArray(V?.downloads)?e.managedDownloadsCache=V.downloads:(y==="remove"||y==="clear-completed")&&await Ue(),Ge()}catch(V){i(V?.message||"Could not complete download action.","error")}})),Ue().then(()=>{Ge()}).catch(()=>{}),window.api&&typeof window.api.onDownloadManagerUpdated=="function"&&document.body?.dataset.boundDownloadManagerEvents!=="1"&&(document.body.dataset.boundDownloadManagerEvents="1",window.api.onDownloadManagerUpdated(g=>{e.managedDownloadsCache=Array.isArray(g?.downloads)?g.downloads:[],Ge(),L().catch(()=>{}),(g?.reason==="created"||g?.reason==="completed"||g?.reason==="interrupted")&&Ee();const u=ge(String(g?.focusId||"").trim());u&&he(u,String(g?.reason||"updated"))}))}return{closeBrowserExtensionPopup:P,closeBrowserExtensionsMenu:f,closeDownloadsManagerPanel:Ae,formatDownloadBytes:Me,formatDownloadEta:Ye,formatDownloadSpeed:Re,initDownloadsManager:W,initExtensionsManager:U,loadManagedDownloadsFromMain:Ue,refreshBrowserExtensionsUi:F,refreshExtensionsManagerList:d}}function Pi({state:e,constants:n,showToast:t,openOverlayModal:i,closeOverlayModal:r,renderProfilePillSelect:c,resolveCredentialScopeIdForTab:w,applyProfileSelection:E,getCurrentProfileId:k,escapeHtml:L}){const{AUTH_GATEWAY_HOSTS:b,RESOURCE_SERVICE_ORIGIN:x}=n,I=()=>e.activeTabId,A=()=>e.credentialCache,R=d=>{e.credentialCache=d},H=()=>e.activeHttpAuthChallenge,z=d=>{e.activeHttpAuthChallenge=d},ee=()=>e.credentialCacheRefreshedAt,ue=d=>{e.credentialCacheRefreshedAt=d},Y=()=>e.credentialCacheRefreshInFlight,oe=d=>{e.credentialCacheRefreshInFlight=d},ye=new Map;function Ie(){return{wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]}}function et(){return Object.keys(Ie())}function De(){return!!(window.api&&typeof window.api.listProfileCredentials=="function"&&typeof window.api.saveProfileCredential=="function"&&typeof window.api.deleteProfileCredential=="function")}function se(d=""){const m=String(d).trim().toLowerCase();if(!m)return"";try{const W=new URL(m),s=String(W.hostname||"").trim().toLowerCase().replace(/^www\./,""),p=String(W.port||"").trim();return s?!p||p==="80"||p==="443"?s:`${s}:${p}`:""}catch{}const S=m.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];if(!S)return"";const B=S.lastIndexOf(":");if(B<=0)return S;const U=S.slice(B+1);return/^\d+$/.test(U)&&U!=="80"&&U!=="443"?S:S.slice(0,B)}function we(d=""){const m=String(d||"").trim().toLowerCase();if(!m)return"";const S=m.lastIndexOf(":");if(S<=0)return m;const B=m.slice(S+1);return/^\d+$/.test(B)?m.slice(0,S):m}function je(d=""){const m=[];try{const S=new URL(String(d||"")),B=(W="")=>{if(W)try{const s=new URL(String(W)),p=se(s.host||s.hostname||"");p&&m.push(p)}catch{const p=se(String(W||""));p&&m.push(p)}};B(S.host||S.hostname||""),["retURL","retUrl","returnUrl","TargetResource","targetResource","PartnerSpId","partnerSpId"].forEach(W=>{B(S.searchParams.get(W)||"")})}catch{}return[...new Set(m.filter(Boolean))]}function Le(d=""){const m=je(d);if(m.length===0)return se(d);const S=m[0]||"";if(b.has(S)){const B=m.find(U=>U&&!b.has(U));if(B)return B}return S}function xe(d=""){return b.has(se(d))}function ke(d=""){const m=we(se(d));return m.endsWith(".veevavault.com")||m==="veevavault.com"||m.endsWith(".gskinternet.com")||m==="gskinternet.com"||m.endsWith(".gskpro.com")||m==="gskpro.com"}function ze(d,m,S=""){const B=String(m||"").trim().toLowerCase(),U=se(S);if(!d||!B)return null;const W=(A()[d]||[]).filter(s=>{const p=se(s.domain);return p&&p!==U&&!xe(p)&&ke(p)&&String(s.username||"").trim().toLowerCase()===B});return W.sort((s,p)=>se(p.domain).length-se(s.domain).length),W[0]||null}function qe(d=""){const m=String(d||"").trim();return/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(m)?"":m}async function Me(){if(!window.api?.deleteProfileCredential)return;const d=[];et().forEach(m=>{(A()[m]||[]).forEach(S=>{const B=se(S.domain);!xe(B)||!ze(m,S.username,B)||d.push({profileId:m,domain:B,username:String(S.username||"").trim()})})}),d.length!==0&&(await Promise.allSettled(d.map(m=>window.api.deleteProfileCredential(m))),d.forEach(m=>{const S=A()[m.profileId]||[];A()[m.profileId]=S.filter(B=>!(se(B.domain)===m.domain&&String(B.username||"").trim().toLowerCase()===m.username.toLowerCase()))}))}async function Re(){if(!De())return R(Ie()),A();try{const d=await window.api.listProfileCredentials();if(!d||!d.success||!Array.isArray(d.data))return R(Ie()),A();const m=Ie();return d.data.forEach(S=>{const B=String(S.profileId||"").toLowerCase();m[B]&&m[B].push({profileId:B,domain:se(S.domain),username:String(S.username||""),password:String(S.password||"")})}),R(m),await Me(),A()}catch{return R(Ie()),A()}}async function Ye(d=15e3){if(!De()||Date.now()-ee()<d)return A();if(Y())return Y();const S=Re().then(B=>(ue(Date.now()),B)).finally(()=>{oe(null)});return oe(S),S}function ge(d){return d?(d.credentialHintsByDomain||(d.credentialHintsByDomain={}),d.credentialHintsByDomain):{}}function Ee(d="",m=""){const S=`${String(d||"").toLowerCase()} ${String(m||"").toLowerCase()}`;if(/login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(S))return!0;try{const B=new URL(String(d||""));if(x&&B.origin.toLowerCase()===x){const W=String(B.pathname||"/").toLowerCase(),s=String(m||"").toLowerCase();if((W==="/"||W==="/login"||W==="/signin")&&s.includes("synapse"))return!0}const U=`${B.pathname.toLowerCase()} ${B.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(U)}catch{return!1}}function Ue(d=""){let m="";try{m=new URL(String(d||"")).hostname.toLowerCase()}catch{return!1}return m==="10.215.56.196"||m.endsWith(".gskinternet.com")||m.endsWith(".gskpro.com")||m.endsWith(".veevavault.com")||m.endsWith(".okta.com")||m.endsWith(".oktacdn.com")||m.endsWith(".pingone.com")}function Ae(d="",m="",S=null){return!De()||!S?!1:S.launchedAppType==="website"||!S.launchedAppType?Ee(d,m)||Ue(d):!0}function Ge(d,m=""){if(!d)return null;const S=je(m);if(S.length===0)return null;const B=A()[d]||[];let U=null,W=-1;return B.forEach(s=>{const p=se(s.domain);if(!p)return;const g=S.reduce((u,y)=>{if(!y)return u;if(y===p)return Math.max(u,1e3);if(we(y)===we(p))return Math.max(u,900);if(y.endsWith(`.${p}`)||p.endsWith(`.${y}`))return Math.max(u,500);const O=we(y),V=we(p);if(O.endsWith(`.${V}`)||V.endsWith(`.${O}`))return Math.max(u,450);const N=O.split(".").reverse(),ie=V.split(".").reverse();let ce=0;for(let pe=0;pe<Math.min(N.length,ie.length)&&N[pe]===ie[pe];pe+=1)ce+=1;return Math.max(u,ce>1?ce:-1)},-1);g<0||(!U||g>W||g===W&&p.length>se(U.domain).length)&&(U=s,W=g)}),U}function nt(d,m="",S=null){const B=A()[d]||[];if(B.length===0)return null;let U="";try{U=se(m)}catch{U=""}const W=ge(S),s=Object.values(W||{}).map(V=>String(V||"").trim()).filter(Boolean),p=String(S?.lastUsernameHint||"").trim()||s[s.length-1]||"";if(U&&xe(U)&&p){const V=ze(d,p,U);if(V)return V}const g=Ge(d,m);if(g&&!xe(g.domain))return g;if(!p)return null;const u=B.filter(V=>String(V.username||"").trim().toLowerCase()===p.toLowerCase());if(u.length===1)return g&&!xe(u[0].domain)?g:u[0];if(u.length===0)return null;const y=U;if(!y)return u[0];const O=V=>{const N=se(V);if(!N)return-1;if(xe(N)&&ke(y))return-100;if(xe(y)&&!xe(N))return 800+(ke(N)?50:0);if(y===N)return 1e3;if(we(y)===we(N))return 900;if(y.endsWith(`.${N}`)||N.endsWith(`.${y}`))return 500;const ie=we(y),ce=we(N);if(ie.endsWith(`.${ce}`)||ce.endsWith(`.${ie}`))return 450;const pe=ie.split(".").reverse(),ve=ce.split(".").reverse();let ne=0;for(let G=0;G<Math.min(pe.length,ve.length)&&pe[G]===ve[G];G+=1)ne+=1;return ne};return u.sort((V,N)=>O(N.domain)-O(V.domain)),u[0]||null}function tt(d,m="",S=null){const B=nt(d,m,S);if(B)return{...B,profileId:String(B.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};const U=A()[d]||[];if(U.length===1)return{...U[0],profileId:String(U[0]?.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};let W="";try{W=se(m)}catch{W=""}if(!W||U.length===0)return null;const s=u=>{const y=se(u);if(!y)return-1;if(xe(W)&&!xe(y))return 800+(ke(y)?50:0);if(xe(y)&&ke(W))return-100;if(W===y)return 1e3;if(we(W)===we(y))return 900;if(W.endsWith(`.${y}`)||y.endsWith(`.${W}`))return 500;const O=we(W),V=we(y);if(O.endsWith(`.${V}`)||V.endsWith(`.${O}`))return 450;const N=O.split(".").reverse(),ie=V.split(".").reverse();let ce=0;for(let pe=0;pe<Math.min(N.length,ie.length)&&N[pe]===ie[pe];pe+=1)ce+=1;return ce},g=[...U].sort((u,y)=>s(y.domain)-s(u.domain))[0]||null;return g?{...g,profileId:String(g.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()}:null}async function he(d,m){if(!d||!m)return;const S=String(m.username||""),B=String(m.password||"");if(!B)return!1;const U=`
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
          const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return el.type === "password" || /password|passwd|pwd/.test(bag) || /current-password|new-password/.test(String(el.autocomplete || "").toLowerCase());
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
            setNativeValue(passField, ${JSON.stringify(B)});
            fire(passField);
          }
        } finally {
          setTimeout(() => {
            window.__oneviewAutofillApplying = false;
          }, 0);
        }
      })();
    `;try{return await d.executeJavaScript(U,!0),!0}catch{return!1}}function f(d,m){if(!d||!m)return;d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);let S=0;const B=async()=>{if(S+=1,!(typeof d.isDestroyed=="function"?d.isDestroyed():!1)&&d.id===`webview-${I()}`){try{if(await d.executeJavaScript("Boolean(window.__oneviewManualCredentialEditAt)",!0)){d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);return}}catch{}await he(d,m),S<6&&(d._oneviewAutofillTimer=setTimeout(B,1e3))}};B()}async function T(d){if(!d)return null;try{const m=await d.executeJavaScript(`
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
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return el.type === "password" || /password|passwd|pwd/.test(bag) || /current-password|new-password/.test(String(el.autocomplete || "").toLowerCase());
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
          const activeDoc =
            (passwordField && passwordField.ownerDocument) ||
            (userField && userField.ownerDocument) ||
            document;
          const active = activeDoc.activeElement;
          const activeInputType =
            active && active.tagName === "INPUT" ? String(active.type || "").toLowerCase() : "";
          if (!username && !password) return null;
          return {
            username,
            password,
            url: window.location.href || "",
            activeInputType,
            otpLike: Boolean(passwordField && isOtpLike(passwordField)),
          };
        })();
        `,!0);return m&&(m.username||m.password)?m:null}catch{return null}}async function C(d){if(d)try{await d.executeJavaScript(`
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
            const bag = [el.type, el.name, el.id, el.autocomplete, el.placeholder, el.getAttribute("aria-label")]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return el.type === "password" || /password|passwd|pwd/.test(bag) || /current-password|new-password/.test(String(el.autocomplete || "").toLowerCase());
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
            const activeInputType =
              active && active.tagName === "INPUT" ? String(active.type || "").toLowerCase() : "";
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
              if (t.type === "password" || t.type === "email" || t.type === "text" || t.type === "tel") {
                if (!window.__oneviewAutofillApplying) {
                  window.__oneviewManualCredentialEditAt = Date.now();
                  if (t.type === "password") window.__oneviewLastPasswordValue = String(t.value || "");
                  if (t.type === "email" || t.type === "text" || t.type === "tel") {
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
        `,!0)}catch{}}async function P(d){if(!d)return null;try{const m=await d.executeJavaScript(`
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
        `,!0);return m&&(m.username||m.password)?m:null}catch{return null}}async function D(d,m){if(!De()||!d||!m||m.id!==I()||!m.credentialAutomationEnabled)return;String(d.getURL?.()||m.url||"");const S=await P(d),B=S?null:await T(d),U=S||B;if(!U)return;const W=String(U.trigger||""),p=String(U.activeInputType||"").toLowerCase()==="password";if(S&&W==="input"&&p||!S&&p)return;const u=w(m),y=String(U.url||d.getURL()||""),O=Le(y),V=ge(m);let N=qe(U.username);const ie=String(U.password||"");if(!u||!O)return;const ce=/^\d{4,8}$/.test(ie),pe=/authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(y.toLowerCase());if(U.otpLike||pe&&ce)return;const ve=String(V[O]||"").trim()||String(m.lastUsernameHint||"").trim(),ne=!!N&&!!ie&&N.toLowerCase()===ie.toLowerCase();N&&!ne?(V[O]=N,m.lastUsernameHint=N):V[O]?N=V[O]:m.lastUsernameHint&&(N=String(m.lastUsernameHint||"").trim());const G=ve||String(V[O]||"").trim()||String(m.lastUsernameHint||"").trim(),fe=!!N&&!!ie&&N.toLowerCase()===ie.toLowerCase();if(fe&&G&&G!==N&&(N=G),!N||!ie||fe&&(!G||G.toLowerCase()===N.toLowerCase()))return;const J=`${u}|${O}|${N}`,de=Date.now(),ct=ye.get(J)||0;if(de-ct<15e3)return;if(ye.set(J,de),await Re(),xe(O)&&ze(u,N,O)){(A()[u]||[]).find(xt=>se(xt.domain)===O&&String(xt.username||"").trim().toLowerCase()===N.toLowerCase())&&window.api?.deleteProfileCredential&&(await window.api.deleteProfileCredential({profileId:u,domain:O,username:N}),await Re());return}const dt=(A()[u]||[]).find(it=>se(it.domain)===O&&String(it.username||"").trim().toLowerCase()===N.toLowerCase());if(!(dt&&String(dt.password||"")===ie))try{if(!(await window.api.saveProfileCredential({profileId:u,domain:O,username:N,password:ie}))?.success)return;await Re()}catch(it){console.warn("Could not save remembered credential:",it)}}function Q(d,m){!d||!m||d._oneviewCredentialPollId||(d._oneviewCredentialPollId=setInterval(()=>{if(typeof d.isDestroyed=="function"?d.isDestroyed():!1){clearInterval(d._oneviewCredentialPollId),d._oneviewCredentialPollId=null;return}m.id===I()&&D(d,m)},3e3))}async function te(d=!1){const m=document.getElementById("httpAuthModal"),S=document.getElementById("httpAuthForm"),B=H();m&&!m.classList.contains("hidden")&&r(()=>m.classList.add("hidden")),S&&S.reset(),z(null),d&&B?.challengeId&&typeof window.api?.submitHttpAuthChallenge=="function"&&window.api.submitHttpAuthChallenge({challengeId:B.challengeId,cancelled:!0}).catch(()=>{})}async function K(d={}){const m=document.getElementById("httpAuthModal"),S=document.getElementById("httpAuthModalTitle"),B=document.getElementById("httpAuthMessage"),U=document.getElementById("httpAuthUsernameInput"),W=document.getElementById("httpAuthPasswordInput"),s=document.getElementById("httpAuthRememberInput"),p=document.getElementById("httpAuthSubmitBtn");if(!m||!S||!B||!U||!W||!s||!p)return;H()?.challengeId&&te(!0),z({...d});const g=String(d.reason||"")==="retry";S.textContent=g?"Login Failed, Update Credential":"Website Login Required";const u=String(d.host||d.url||"this website").trim(),y=String(d.realm||"").trim(),O=String(d.profileId||"").trim().toUpperCase();B.textContent=y?`${u} • ${y}${O?` • ${O}`:""}`:`${u}${O?` • ${O}`:""}`,U.value=String(d.username||""),W.value=String(d.password||""),s.checked=d.remember!==!1,p.textContent=g?"Update And Login":"Login",await i(()=>m.classList.remove("hidden")),W.value?(W.focus(),W.select()):(U.focus(),U.select())}function re(){const d=document.getElementById("httpAuthModal"),m=document.getElementById("httpAuthForm"),S=document.getElementById("httpAuthModalCloseBtn");!d||!m||!S||m.dataset.initialized!=="1"&&(m.dataset.initialized="1",S.addEventListener("click",()=>te(!0)),d.addEventListener("click",B=>{B.target===d&&te(!0)}),m.addEventListener("submit",async B=>{B.preventDefault();const U=H(),W=document.getElementById("httpAuthUsernameInput"),s=document.getElementById("httpAuthPasswordInput"),p=document.getElementById("httpAuthRememberInput");if(!U?.challengeId||!W||!s||typeof window.api?.submitHttpAuthChallenge!="function")return;const g=String(W.value||"").trim(),u=String(s.value||""),y=!!p?.checked;if(!(!g||!u))try{await window.api.submitHttpAuthChallenge({challengeId:U.challengeId,username:g,password:u,remember:y}),te(!1)}catch(O){console.error("Failed to submit HTTP auth credential",O),t("Could not submit the website credential.","error")}}),typeof window.api?.onHttpAuthChallenge=="function"&&window.api.onHttpAuthChallenge(B=>{K(B).catch(U=>{console.error("Failed to open HTTP auth modal",U)})}))}function F(){}async function Z(d,m){if(!m||!m.rect)return;const S=d.getURL(),B=Le(S);if(!B)return;const U=[];if(Object.entries(A()).forEach(([s,p])=>{p.forEach(g=>{const u=se(g.domain);if(u===B||B.endsWith(`.${u}`)&&u.split(".").length>1){const y=n.PROFILES[s]||{name:s,color:"#ccc"};U.push({...g,profileId:s,profileName:y.name,profileColor:y.color})}})}),U.length===0)return;const W=`if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(U)});
    }`;d.executeJavaScript(W,!0).catch(()=>{})}return{canUseSecureCredentialApi:De,getAutofillCredentialForTab:tt,initHttpAuthPrompt:re,initPasswordManager:F,installCredentialCaptureHooks:C,isCredentialAutomationDomain:Ue,isLikelyAuthPage:Ee,maybeOfferRememberCredentials:D,normalizeDomain:se,refreshCredentialCacheIfStale:Ye,scheduleCredentialAutofill:f,shouldEnableCredentialAutomation:Ae,startCredentialCapturePolling:Q,handleCredentialFieldInteraction:Z,hideCredentialDropdown:()=>{}}}function Bi({state:e,constants:n,createNativePageDescriptor:t,ensureNativeSettingsGeneralInfo:i,normalizeSettingsSection:r,renderNativeSettingsPage:c,closeBrowserExtensionsMenu:w,closeBrowserExtensionPopup:E,refreshBrowserExtensionsUi:k,refreshTabScrollControls:L,syncProfileSelectionForTab:b,updateProfileLockUI:x,perfMark:I,shouldRequirePlatformApiForNavigation:A,getWebviewPlatformApiFlag:R,setWebviewPlatformApiFlag:H,getWebviewPreloadPathCached:z,startCredentialCapturePolling:ee,scheduleCredentialAutofill:ue,installCredentialCaptureHooks:Y,refreshCredentialCacheIfStale:oe,getAutofillCredentialForTab:ye,resolveAssignedProfileIdForTab:Ie,getCredentialScopeIdByPartition:et,resolveCredentialScopeIdForTab:De,maybeOfferRememberCredentials:se,syncTabProfileForPage:we,trackProfileHistory:je,resolveProfileIdForTab:Le,resolveAssignedProfileId:xe,resolveStrictProfileNavigationTarget:ke,resolveNavigationPartition:ze,applyProfileSelection:qe,openProfilePromptDialog:Me,handleCredentialFieldInteraction:Re,hideCredentialDropdown:Ye}){const{PARTITIONS:ge,PROFILES:Ee,LOCAL_WEB_APP_TYPES:Ue,WEBVIEW_POOL_MAX:Ae=6,WEBVIEW_POOL_KEEPALIVE_MS:Ge=6e4,TAB_PREWARM_ENABLED:nt=!1,PREWARM_ALL_PROFILE_PARTITIONS:tt=!1}=n,he=[];let f=null;const T=new Map,C=()=>e.tabs,P=o=>{e.tabs=o},D=()=>e.activeTabId,Q=o=>{e.activeTabId=o},te=()=>e.currentProfileId;function K(o){const a=document.querySelector(".browser-controls-overlay");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result"));l&&o&&(o.hideBrowserControls=!1);const v=!!((o&&!o.isHome&&o.hideBrowserControls||o?.nativePage)&&!l);a.classList.toggle("hidden",v),l?(a.classList.remove("hidden"),a.style.setProperty("display","flex","important"),a.style.setProperty("visibility","visible","important"),a.style.setProperty("opacity","1","important"),a.style.setProperty("height","40px","important")):(a.style.removeProperty("display"),a.style.removeProperty("visibility"),a.style.removeProperty("opacity"),a.style.removeProperty("height"))}function re(o){const a=document.getElementById("browserDetachHeader");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result")),v=(!o||o.isHome||!!o.hideBrowserControls||!!o.nativePage)&&!l;a.classList.toggle("hidden",v)}function F(o){const a=document.querySelector(".profile-section");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result")),v=!!((o&&!o.isHome&&o.hideBrowserControls||o?.nativePage)&&!l);a.classList.toggle("hidden",v)}function Z(o,a){const l=C().find(h=>h.id===o);if(!l)return;l.title=a;const v=document.getElementById(`tab-ui-${o}`);v&&(v.querySelector(".tab-title").textContent=a)}function d(){const o=D();return o&&C().find(a=>a.id===o)||null}function m(){const o=D();return o?document.getElementById(`webview-${o}`):null}function S(o){const a=document.getElementById("urlDisplay");a&&(a.value=o)}function B(o){const a=document.getElementById("urlDisplay");a&&(a.value=o)}function U(){const o=document.getElementById("browserBack"),a=document.getElementById("browserForward"),l=m();o&&(o.disabled=l?!l.canGoBack():!0),a&&(a.disabled=l?!l.canGoForward():!0)}function W(o){o&&(o._oneviewCredentialPollId&&(clearInterval(o._oneviewCredentialPollId),o._oneviewCredentialPollId=null),o._oneviewAutofillTimer&&(clearTimeout(o._oneviewAutofillTimer),o._oneviewAutofillTimer=null))}function s(o){document.querySelectorAll(".webviews-container .webcontent-pane").forEach(l=>{const v=l.id.replace("webview-",""),h=C().find(j=>j.id===v);v===o&&!h?.isHome&&h?.credentialAutomationEnabled?ee(l,h):W(l)})}function p(o,a=C().length-1){const l=document.getElementById("tabsList");if(!l)return;const v=document.createElement("div");v.className="tab",v.id=`tab-ui-${o.id}`,v.innerHTML=`
        <span class="tab-title">${o.title}</span>
        <button class="tab-close">x</button>
    `,v.addEventListener("click",j=>{j.target.classList.contains("tab-close")||N(o.id)}),v.querySelector(".tab-close").addEventListener("click",j=>{j.stopPropagation(),pe(o.id)});const $=l.children[a]||null;l.insertBefore(v,$),L()}function g(o){setTimeout(async()=>{const a=C().find(v=>v.id===o);if(!(!a||!a.isHome||document.getElementById(`webview-${o}`)))try{const v=await de(a);if(!v)return;v.classList.remove("active"),typeof v.hide=="function"&&v.hide().catch(()=>{}),v.syncBounds?.(!1)}catch(v){window.api.webContentCall("log-error",{key:`prewarm-err:${o}:${v.toString()}`}).catch(()=>{})}},0)}async function u(o=null,a=null,l="New Tab",v=null,h={}){const $=h.active!==!1;window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?a=ge.gsk:a=ft(a||(Ee[te()]?Ee[te()].partition:ge.guest));const q=`tab-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,M={id:q,title:l,url:o,partition:a,isHome:!o&&!h.nativePage,nativePage:h.nativePage&&typeof h.nativePage=="object"?t(h.nativePage.type||"settings",h.nativePage.section||"general"):null,lockedProfileId:v,hideBrowserControls:!1,launchedAppType:null,trackingAppId:"",trackingAppName:"",requiresPlatformApi:!1,extensionCompatEnabled:!1,extensionEntryPath:"",extensionActiveContext:{url:"",title:""},credentialAutomationEnabled:!1,lastCredentialSourceProfileId:null};M.trackingAppId=String(h.trackingAppId||"").trim(),M.trackingAppName=String(h.trackingAppName||l||M.title||"").trim(),M.extensionEntryPath=String(h.extensionEntryPath||"").trim(),M.extensionCompatEnabled=!!M.extensionEntryPath,M.extensionActiveContext=h.extensionActiveContext&&typeof h.extensionActiveContext=="object"?{url:String(h.extensionActiveContext.url||"").trim(),title:String(h.extensionActiveContext.title||"").trim()}:{url:"",title:""};const X=C(),Se=X.findIndex(at=>at.id===D()),Fe=Number.isInteger(h.insertIndex)?Math.max(0,Math.min(h.insertIndex,X.length)):Se>=0?Se+1:X.length;if(X.splice(Fe,0,M),p(M,Fe),M.nativePage)await N(q);else if(o){$&&Q(q);const at=document.getElementById("view-home-content"),Mt=document.getElementById("webviews-container");$&&at&&at.classList.add("hidden");const yi=o&&(o.includes("result.html")||o.includes("extension-icon")||o.toLowerCase().includes("result"));if($&&Mt){Mt.classList.remove("hidden");let We=document.getElementById("tab-load-placeholder");yi?We&&(We.style.display="none"):We?We.style.display="flex":(We=document.createElement("div"),We.id="tab-load-placeholder",We.style.cssText=["position:absolute","inset:0","z-index:50","display:flex","flex-direction:column","align-items:center","justify-content:center","background:var(--bg-main,#f8fafc)","gap:16px"].join(";"),We.innerHTML=`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `,Mt.appendChild(We));const sn=()=>{We&&(We.style.display="none")},ln=Te=>{Te&&(typeof Te._oneviewPlaceholderFinalize=="function"&&(Te.removeEventListener("did-stop-loading",Te._oneviewPlaceholderFinalize),Te.removeEventListener("did-fail-load",Te._oneviewPlaceholderFinalize)),Te._oneviewPlaceholderFinalize=null)},cn=setInterval(()=>{const Te=document.getElementById(`webview-${q}`);if(!Te)return;clearInterval(cn),clearTimeout(dn);const Ut=()=>{ln(Te),clearTimeout(dn),sn()};ln(Te),Te._oneviewPlaceholderFinalize=Ut,Te.addEventListener("did-stop-loading",Ut,{once:!0}),Te.addEventListener("did-fail-load",Ut,{once:!0})},100),dn=setTimeout(()=>{clearInterval(cn),sn()},12e3)}await ve(q,o,a,l,v,h,$)}else await N(q),nt&&g(q);return M}function y(o=D()){const a=C(),l=a.find(q=>q.id===o);if(!l)return;const v=a.findIndex(q=>q.id===l.id),h=document.getElementById(`webview-${l.id}`),$=h&&typeof h.getURL=="function"&&h.getURL()||l.url||"",j=h&&typeof h.getTitle=="function"&&h.getTitle()||l.title||"New Tab";u(l.isHome||!$||$==="about:blank"?null:$,l.partition,j,l.lockedProfileId||null,{insertIndex:v>=0?v+1:a.length,trackingAppId:l.trackingAppId||"",trackingAppName:l.trackingAppName||j})}function O(o){const a=C();if(!a.length)return;const l=a.findIndex($=>$.id===D()),h=((l>=0?l:0)+o+a.length)%a.length;N(a[h].id,{suppressHomeSearchFocus:!0})}async function V(o){!o||typeof o.focusWebContents!="function"||await o.focusWebContents().catch(()=>{})}async function N(o,a={}){Q(o);const l=C().find(M=>M.id===o);if(!l)return;w(),E().catch(()=>{}),b(l),x(l),document.querySelectorAll(".tab").forEach(M=>M.classList.remove("active"));const v=document.getElementById(`tab-ui-${o}`);v&&v.classList.add("active");const h=document.getElementById("view-home-content"),$=document.getElementById("nativeTabContent"),j=document.getElementById("webviews-container"),q=document.querySelectorAll(".webviews-container .webcontent-pane");if(l.isHome){h.classList.remove("hidden"),$?.classList.add("hidden"),j.classList.add("hidden"),K(l),re(l),F(l);const M=document.getElementById("googleSearchInput");M&&a?.suppressHomeSearchFocus!==!0&&(M.value="",M.focus())}else if(l.nativePage)h.classList.add("hidden"),$?.classList.remove("hidden"),j.classList.add("hidden"),K(l),re(l),F(l),S(""),r(l.nativePage?.section)==="general"&&await i(),c(l);else{h.classList.add("hidden"),$?.classList.add("hidden"),j.classList.remove("hidden"),K(l),re(l),F(l),q.forEach(X=>{X.id!==`webview-${o}`&&(X.classList.remove("active"),typeof X.hide=="function"&&X.hide().catch(()=>{}),X.syncBounds?.(!1))});let M=null;try{M=document.getElementById(`webview-${o}`),M||(M=await de(l))}catch(X){window.api.webContentCall("log-error",{key:`switchTab-create-err:${o}:${X.toString()}`}).catch(()=>{})}if(M)try{M.classList.add("active"),typeof M.show=="function"&&await M.show().catch(()=>{}),M.syncBounds?.(!0),await V(M),S(M.getURL())}catch(X){window.api.webContentCall("log-error",{key:`switchTab-show-err:${o}:${X.toString()}`}).catch(()=>{})}}s(l.id),k(),U()}function ie(o){if(!o)return!1;const a=String(o.launchedAppType||"").toLowerCase();return Ue.has(a)}function ce(o,a){if(!o||!a||!ie(a))return!1;const l=String(o.getAttribute("partition")||a.partition||"");if(!l)return!1;const v=o.parentElement;for(v&&v.removeChild(o),o.classList.remove("active"),he.push({webview:o,partition:l,platformApiEnabled:R(o),at:Date.now()}),I("view-webcontent","park-to-pool",{partition:l,poolSize:he.length});he.length>Ae;){const h=he.shift();h&&h.webview&&!h.webview.isDestroyed?.()&&h.webview.remove()}return!0}function pe(o){const a=C(),l=a.findIndex(j=>j.id===o);if(l===-1)return;const v=D()===o;document.getElementById(`tab-ui-${o}`)?.remove();const h=document.getElementById(`webview-${o}`);if(h&&(W(h),(!ie(a[l])||!ce(h,a[l]))&&h.remove()),a.splice(l,1),a.length===0){Q(null),u(),L();return}const $=a.some(j=>j.id===D());if(v||!$){const j=Math.min(l,a.length-1),q=a[j]||a[a.length-1];q&&N(q.id)}L()}async function ve(o,a,l,v,h=null,$={},j=!0){const q=performance.now(),M=C().find(Se=>Se.id===o);if(!M)return;M._navStartedAt=q,I("view-nav","navigateTo-start",{tabId:M.id,url:String(a||""),partition:String(l||""),appType:$.appType||null}),M.isHome=!1,M.url=a,M.partition=l,M.lockedProfileId=h,M.hideBrowserControls=!!$.hideControls,M.launchedAppType=$.appType||null,M.lastCredentialSourceProfileId=null,M.trackingAppId=String($.trackingAppId||"").trim(),M.trackingAppName=String($.trackingAppName||v||M.title||"").trim(),M.requiresPlatformApi=A(a,$),v&&Z(o,v),j&&(Q(o),await N(o));let X=document.getElementById(`webview-${o}`);if(!X)X=await de(M,j);else{const Se=X.getAttribute("partition"),Fe=R(X);(Se!==l||Fe!==!!M.requiresPlatformApi)&&(W(X),(!ie(M)||!ce(X,M))&&X.remove(),X=await de(M,j))}j&&typeof X.show=="function"?await X.show().catch(()=>{}):!j&&typeof X.hide=="function"&&await X.hide().catch(()=>{}),typeof X.setMeta=="function"&&await X.setMeta({trackingAppId:M.trackingAppId,appName:M.trackingAppName,appType:M.launchedAppType||""}).catch(()=>{}),X.syncBounds?.(j),j&&(S(a),await V(X)),X.src!==a&&(X.src=a),I("view-nav","navigateTo-dispatch",{tabId:M.id,elapsedMs:Math.round(performance.now()-q)})}async function ne(o,a,l,v=null,h={}){return ve(D(),o,a,l,v,h,!0)}function G(o){o&&o.executeJavaScript(`
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
      `,!0).catch(()=>{})}function fe(o=""){const a=String(o||"").trim().toLowerCase();return!!(!a||a==="about:blank"||a.startsWith("javascript:")||a.startsWith("data:")||a.startsWith("chrome-error://"))}function J(o){o._hasTabListenersAttached||(o._hasTabListenersAttached=!0,o.addEventListener("ipc-message",async a=>{if(a.channel==="oneview:credential-field-focused")Re(o,a.args[0]);else if(a.channel!=="oneview:credential-field-blurred"){if(a.channel==="oneview:credential-selected"){const l=a.args[0];l&&(ue(o,l),l.profileId&&l.profileId!==te()&&qe(l.profileId))}}}),o.addEventListener("console-message",a=>{const l=String(a?.message||"");(l.includes("[OneView][Credential")||l.includes("[VeevaSlide]"))&&console.log("[WebviewConsole]",{level:a?.level,line:a?.line,sourceId:a?.sourceId||"",message:l})}),o.addEventListener("did-start-loading",()=>{const a=o.id.replace("webview-",""),l=C().find(h=>h.id===a);if(!l)return;l._didStartLoadingAt=performance.now(),I("view-webcontent","did-start-loading",{tabId:l.id,url:o.getURL()||l.url||""}),l.url&&(l.url.includes("result.html")||l.url.includes("extension-icon")||l.url.toLowerCase().includes("result"))?(Z(l.id,"Result"),l.id===D()&&B(l.url||"")):(Z(l.id,"Loading..."),l.id===D()&&B(l.url||"Loading..."))}),o.addEventListener("did-stop-loading",async()=>{const a=o.id.replace("webview-",""),l=C().find(Se=>Se.id===a);if(!l)return;const v=typeof l._didStartLoadingAt=="number"?Math.round(performance.now()-l._didStartLoadingAt):null,h=typeof l._navStartedAt=="number"?Math.round(performance.now()-l._navStartedAt):null;I("view-webcontent","did-stop-loading",{tabId:l.id,url:o.getURL()||"",loadElapsedMs:v,navElapsedMs:h});const $=o.getURL()||l.url||"";let q=$&&($.includes("result.html")||$.includes("extension-icon")||$.toLowerCase().includes("result"))?"Result":o.getTitle()||l.title||"Tab";if(q==="Tab"||q==="Loading..."||!q)try{const Se=new URL($);q=Se.hostname?Se.hostname.replace("www.",""):"Tab"}catch{q="Tab"}if((l.title==="Loading..."||l.title==="Tab"||!l.title||o.getTitle()&&o.getTitle()!=="about:blank")&&Z(l.id,q),l.id===D()&&S($),l.url=$,l.credentialAutomationEnabled=on($,q,l),l.credentialAutomationEnabled){const Se=Ie(l,$,q),Fe=et(l.partition)||Se||te();await oe();const at=ye(Fe,$,l);ue(o,at),ee(o,l),Y(o)}else W(o);await we(l,$,q,o),wi(o,l);const X=Le(l);je(X,$,q),G(o)}),o.addEventListener("page-title-updated",a=>{const l=o.id.replace("webview-",""),v=C().find(h=>h.id===l);v&&(Z(v.id,a.title),v.credentialAutomationEnabled&&se(o,v))}),o.addEventListener("will-navigate",()=>{const a=o.id.replace("webview-",""),l=C().find(v=>v.id===a);l&&l.credentialAutomationEnabled&&se(o,l)}),o.addEventListener("did-navigate",a=>{const l=o.id.replace("webview-",""),v=C().find(j=>j.id===l);if(!v)return;const h=a.url||o.getURL()||"";v.url=h,v.id===D()&&(S(h),U());const $=Le(v);je($,h,o.getTitle()||v.title||"")}),o.addEventListener("did-navigate-in-page",async a=>{const l=o.id.replace("webview-",""),v=C().find(M=>M.id===l);if(!v)return;const h=a.url||o.getURL()||"";v.url=h,v.id===D()&&(S(h),U());const $=Le(v);if(je($,h,o.getTitle()||v.title||""),o.addEventListener("history-changed",M=>{_=M,v.id===D()&&U()}),v.credentialAutomationEnabled=on(h,o.getTitle()||v.title||"",v),!v.credentialAutomationEnabled){W(o);return}se(o,v),await oe();const j=et(v.partition)||Ie(v,h,o.getTitle()||v.title||"")||De(v),q=ye(j,h,v);ue(o,q),ee(o,v)}),o.addEventListener("new-window",async a=>{const l=o.id.replace("webview-",""),v=C().find(Se=>Se.id===l);if(!v)return;typeof a?.preventDefault=="function"&&a.preventDefault();const h=String(a?.url||"").trim();if(fe(h))return;const $=String(o.getURL()||"").trim();if($&&$===h)return;let j=xe(h,"New Tab"),q=null;if(j)q=Ee[j].partition;else if(Me){const Se=Le(v)||"guest",Fe=await Me(h,Se);if(Fe&&!Fe.cancelled&&Fe.profileId)j=Fe.profileId,q=Ee[j]?.partition;else return}else q=v.partition;const M=C(),X=M.findIndex(Se=>Se.id===v.id);u(h,q,"New Tab",j,{insertIndex:X>=0?X+1:M.length})}))}async function de(o,a=!0){if(T.has(o.id))return T.get(o.id);const l=dt(o,a);T.set(o.id,l);try{return await l}finally{T.delete(o.id)}}function ct(o){const a=String(o?.partition||"");if(!a||he.length===0)return null;const l=!!o?.requiresPlatformApi,v=he.findIndex($=>$.partition===a&&!!$.platformApiEnabled===l);if(v===-1)return null;const[h]=he.splice(v,1);return h?.webview||null}async function dt(o,a=!0){const l=performance.now(),v=document.getElementById("webviews-container"),h=ct(o);if(h)return h.classList.toggle("active",a),h.id=`webview-${o.id}`,h.setAttribute("partition",o.partition),H(h,!!o.requiresPlatformApi),J(h),v.appendChild(h),a&&typeof h.show=="function"?h.show().catch(()=>{}):!a&&typeof h.hide=="function"&&h.hide().catch(()=>{}),h.syncBounds?.(a),a&&typeof h.focusWebContents=="function"&&h.focusWebContents().catch(()=>{}),I("view-webcontent","reuse-pooled",{tabId:o.id,partition:o.partition,elapsedMs:Math.round(performance.now()-l),poolSize:he.length}),h;const $=z(),j=await pn({key:`view:${o.id}`,partition:o.partition,preloadPath:$,additionalArguments:o.requiresPlatformApi?["--oneview-enable-platform-api=1"]:[],extensionEntryPath:o.extensionEntryPath,extensionActiveContext:o.extensionActiveContext,extensionCompat:!0,initialMeta:{trackingAppId:o.trackingAppId,appName:o.trackingAppName,appType:o.launchedAppType||"",extensionEntryPath:o.extensionEntryPath},className:`webcontent-pane${a?" active":""}`});return j.id=`webview-${o.id}`,j.setAttribute("partition",o.partition),H(j,!!o.requiresPlatformApi),J(j),v.appendChild(j),!a&&typeof j.hide=="function"&&j.hide().catch(()=>{}),j.syncBounds?.(a),a&&typeof j.focusWebContents=="function"&&j.focusWebContents().catch(()=>{}),I("view-webcontent","create-fresh",{tabId:o.id,partition:o.partition,elapsedMs:Math.round(performance.now()-l)}),j}function it(){f||(f=setInterval(()=>{if(!document.hidden&&he.length!==0)for(let o=he.length-1;o>=0;o-=1){const l=he[o]?.webview;if(!l||l.isDestroyed?.()){he.splice(o,1);continue}l.executeJavaScript("void 0",!1).catch(()=>{})}},Ge))}async function _t(o){const a=String(o||"").trim();if(!a||he.some($=>$.partition===a))return;const l=document.getElementById("webviews-container");if(!l)return;const v=z(),h=`view:prewarm:${a}:${Date.now()}`;try{const $=await pn({key:h,partition:a,preloadPath:v,className:"webcontent-pane"});$.id=`webview-prewarm-${Date.now()}`,l.appendChild($),$.syncBounds?.(),ce($,{launchedAppType:"website",partition:a})}catch{}}async function xt(){const o=Array.from(new Set(Object.values(Ee).map(a=>String(a?.partition||"").trim()).filter(Boolean)));for(const a of o)await _t(a),await new Promise(l=>setTimeout(l,60))}async function ui(){const o=Ee[te()]?.partition||Ee.guest.partition;o&&await _t(o)}function pi(){it(),nt&&(tt?xt():ui())}function fi(){for(f&&(clearInterval(f),f=null);he.length>0;){const o=he.shift();o&&o.webview&&!o.webview.isDestroyed?.()&&o.webview.remove()}}function mi(o,a=null){return!(!o||o.isHome)}function wi(o,a){if(!o||!a||a.launchedAppType!=="website")return;const l=`
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
  `;try{o.insertCSS(l)}catch(v){console.warn("Could not apply website scrollbar theme:",v)}}function gi(){const o=C().find(l=>l.id===D());if(!o||o.isHome)return;o.isHome=!0,o.url=null,o.lockedProfileId=null,Z(o.id,"New Tab");const a=document.getElementById(`webview-${o.id}`);a&&(W(a),(!ie(o)||!ce(a,o))&&a.remove()),N(o.id)}function hi(o=""){const a=String(o||"").trim();if(!a)return"";const l=a.match(/^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/);if(l){const h=l[1].toUpperCase(),$=decodeURIComponent(l[2]).replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${h}:/${$}`}if(/^file:\/\//i.test(a)||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/^about:/i.test(a))return a;const v=a.match(/^([a-zA-Z])[:/\\](.*)$/);if(v){const h=v[1].toUpperCase(),$=v[2].replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${h}:/${$}`}if(/^\/[A-Za-z]\//.test(a)){const h=a[1].toUpperCase(),$=a.slice(3).replace(/\\/g,"/");return`file:///${h}:/${$}`}return/^\\\\/.test(a)?`file:${a.replace(/\\/g,"/")}`:a}function Dt(o=""){const a=String(o||"").trim();return!a||/\s/.test(a)?!1:!!(/^about:/i.test(a)||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(a)||/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(a)||a.includes(".")||/[/:?#]/.test(a))}async function vi(o){if(o=hi(o),!o)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){let h=o;Dt(o)?!/^[a-z][a-z0-9+.-]*:\/\//i.test(o)&&!/^about:/i.test(o)&&(h=`https://${o}`):h=`https://www.google.com/search?q=${encodeURIComponent(o)}`,await ne(h,ge.gsk,o);return}let a=o,l=Dt(o);if(l?!/^[a-z][a-z0-9+.-]*:\/\//i.test(o)&&!/^about:/i.test(o)&&!/^file:\/\//i.test(o)&&(a=`https://${o}`):Dt(o)?(a=`https://${o}`,l=!0):a=`https://www.google.com/search?q=${encodeURIComponent(o)}`,l){const h=await ke(a,null,"New Tab");if(!h||h.cancelled)return;const $=h.profileId,j=h.partition;$&&$!==te()&&qe($,{bypassLock:!0}),await ne(a,j,"New Tab",h.lockedProfileId);return}const v=ze(a,d()?.partition||Ee[te()]?.partition||ge.guest,"Google Search");await ne(a,v,"Google Search")}function bi(o,{isTeardown:a=!1}={}){const l=C(),v=Array.isArray(o)?o.filter(Boolean):[];if(v.length===0||l.length===0)return;const h=new Set(v),$=[...l],j=$.findIndex(q=>q.id===D());if($.forEach(q=>{if(!h.has(q.id))return;document.getElementById(`tab-ui-${q.id}`)?.remove();const M=document.getElementById(`webview-${q.id}`);M&&(W(M),(!ie(q)||!ce(M,q))&&M.remove())}),P($.filter(q=>!h.has(q.id))),C().length===0){Q(null),a||(u(),L());return}if(h.has(D())){const q=Math.min(Math.max(j,0),C().length-1);Q(C()[q].id)}N(D()||C()[0].id),L()}function on(o="",a="",l=null){return l?l.launchedAppType==="website"||!l.launchedAppType?rn(o,a)||an(o):!0:!1}function rn(o="",a=""){const l=`${String(o||"")} ${String(a||"")}`.toLowerCase();if(/login|sign in|signin|password|sso|authenticate|verify/.test(l))return!0;try{const v=new URL(String(o||"")),h=`${v.pathname.toLowerCase()} ${v.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(h)}catch{return!1}}function an(o=""){let a="";try{a=new URL(String(o||"")).hostname.toLowerCase()}catch{return!1}return a==="10.215.56.196"||a.endsWith(".gskinternet.com")||a.endsWith(".gskpro.com")||a.endsWith(".veevavault.com")||a.endsWith(".okta.com")||a.endsWith(".oktacdn.com")||a.endsWith(".pingone.com")}return{closeTab:pe,closeTabsBulk:bi,createTab:u,createWebviewForTab:de,duplicateTab:y,disposeWebviewRuntime:fi,getActiveTab:d,getActiveWebview:m,goToActiveTabHome:gi,isInspectableLocalFileTab:mi,navigateTo:ne,navigateToTab:ve,performSearch:vi,startWebviewRuntime:pi,switchRelativeTab:O,switchTab:N,updateTabTitle:Z,updateUrlDisplay:S,updateUrlDisplayString:B,getCurrentProfileId:te,getTabs:C}}console.log("View Page Script initializing...");let le=[],Oe=null,Pt=!1,Nn=null,fn=null,mn=[],wn=[],gn={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};const zt=Xe.profileHistory,qt="view.profileHistory.v1";let Be={wppproduction:[],vml:[],gsk:[],guest:[]};const On=Xe.customBookmarks;let $e=[],hn="guest",Ht="guest",vn="",st="guest",It=null,Ke=null,bn=null;const Ai=new Set(["login.veevavault.com","federation.gsk.com"]);let gt=null,_e=-1,Ne=[],yn={version:"",defaultOpenStatus:""},Sn=0,En=null,xn=!1;const Rn=Xe.perfEnabled;let ut=null,Cn=!1;const Et={};Object.defineProperties(Et,{tabs:{get:()=>le,set:e=>{le=e}},activeTabId:{get:()=>Oe,set:e=>{Oe=e}},browserExtensionsCache:{get:()=>mn,set:e=>{mn=e}},managedDownloadsCache:{get:()=>wn,set:e=>{wn=e}},nativeSettingsGeneralInfo:{get:()=>yn,set:e=>{yn=e}},historyProfileId:{get:()=>Ht,set:e=>{Ht=e}},historySearchQuery:{get:()=>vn,set:e=>{vn=e}},currentProfileId:{get:()=>me,set:e=>{me=e}},profileHistoryCache:{get:()=>Be,set:e=>{Be=e}},credentialCache:{get:()=>gn,set:e=>{gn=e}},passwordProfileId:{get:()=>hn,set:e=>{hn=e}},passwordEditTarget:{get:()=>fn,set:e=>{fn=e}},activeHttpAuthChallenge:{get:()=>bn,set:e=>{bn=e}},credentialCacheRefreshedAt:{get:()=>Sn,set:e=>{Sn=e}},credentialCacheRefreshInFlight:{get:()=>En,set:e=>{En=e}}});const Vt={synapse:{partition:be.synapse},contentgen:{partition:be.contentgen}},Yt=new Set(["nextjs","vite","react","angular","html","neutralino","website","vite-server"]),Fn=(()=>{try{return new URL(Un).origin.toLowerCase()}catch{return""}})(),Ti=new URL(""+new URL("contentgen-DZqnGDPH.png",import.meta.url).href,import.meta.url).href,$i=new URL(""+new URL("contentgen-dark-C7HM67Tp.png",import.meta.url).href,import.meta.url).href;function In(e=document){if(!e||typeof e.querySelectorAll!="function")return;const n=document.body.classList.contains("dark-mode");e.querySelectorAll("img[data-theme-icon]").forEach(t=>{const i=String(t.getAttribute("data-theme-icon")||"").trim();let r="";i==="contentgen"&&(r=n?$i:Ti),r&&t.getAttribute("src")!==r&&t.setAttribute("src",r)})}function _i(){["httpAuthModal","bookmarkModal","cacheActionModal","extensionsManagerModal"].forEach(e=>{const n=document.getElementById(e);!n||n.dataset.hoistedToBody==="1"||(document.body.appendChild(n),n.dataset.hoistedToBody="1")})}async function Ln(){const e=Ze();if(!(!e||e.isHome||!e.url||!window.api?.openDetachedViewWindow))try{await window.api.openDetachedViewWindow({url:e.url,title:e.title||"Detached Tab",partition:e.partition||be.guest}),Kt(e.id)}catch(n){console.error("Failed to open detached tab window",n),Ve("Could not open the page in a separate window.","error")}}function $t(){if(ut!==null)return ut;try{const e=localStorage.getItem(Rn);return ut=e==="1"||e==="true",ut}catch{return ut=!1,!1}}function Wn(e,n,t=null){if(!$t())return;const i=t?{...t}:{};try{console.log(`[PERF][${e}] ${n}`,i)}catch{}}window.addEventListener("storage",e=>{e.key===Rn&&(ut=null,window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled($t()).catch(()=>{}))});const ae={wppproduction:{id:"wppproduction",name:"WPPProduction",partition:be.wppproduction,color:"#000000",bgColor:"#e2e8f0",label:"W"},vml:{id:"vml",name:"VML",partition:be.vml,color:"#ff0000",bgColor:"#fee2e2",label:"V"},gsk:{id:"gsk",name:"GSK",partition:be.gsk,color:"#f37521",bgColor:"#ffedd5",label:"G"},guest:{id:"guest",name:"Guest",partition:be.guest,color:"#64748b",bgColor:"#f1f5f9",label:"?"}};let me="guest";function Di(){return me}const Mi=Pi({state:Et,constants:{AUTH_GATEWAY_HOSTS:Ai,RESOURCE_SERVICE_ORIGIN:Fn,PROFILES:ae},showToast:Ve,openOverlayModal:rt,closeOverlayModal:Je,renderProfilePillSelect:Zt,resolveCredentialScopeIdForTab:ti,applyProfileSelection:wt,getCurrentProfileId:()=>me,escapeHtml:Ce}),{getAutofillCredentialForTab:Ui,initHttpAuthPrompt:Ni,installCredentialCaptureHooks:Oi,isLikelyAuthPage:Ri,maybeOfferRememberCredentials:Fi,refreshCredentialCacheIfStale:Wi,scheduleCredentialAutofill:Hi,startCredentialCapturePolling:Vi,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi}=Mi;let lt=null,ht=null;const qi=ki({state:Et,constants:{PROFILES:ae,PENDING_EXTENSION_OPEN_STORAGE_KEY:"oneview.pendingExtensionOpenPath",EXTENSION_PIN_STORAGE_KEY:"oneview.browserExtensions.pinned.v1",IS_DEV_APP_BUILD:kt},escapeHtml:Ce,showToast:Ve,openOverlayModal:rt,closeOverlayModal:Je,getActiveTab:(...e)=>ht?.getActiveTab?.(...e)??null,getActiveWebview:(...e)=>ht?.getActiveWebview?.(...e)??null,createTab:(...e)=>ht?.createTab?.(...e),refreshActiveNativeSettingsPage:(...e)=>lt?.refreshActiveNativeSettingsPage?.(...e)??Promise.resolve(),closeSettingsMenu:Eo}),{closeBrowserExtensionPopup:Gt,closeBrowserExtensionsMenu:Yi,formatDownloadBytes:Gi,formatDownloadEta:Ki,formatDownloadSpeed:Ji,initDownloadsManager:Xi,initExtensionsManager:Qi,loadManagedDownloadsFromMain:Zi,refreshBrowserExtensionsUi:eo,refreshExtensionsManagerList:Hn}=qi;ht=Bi({state:Et,constants:{PARTITIONS:be,PROFILES:ae,LOCAL_WEB_APP_TYPES:Yt,WEBVIEW_POOL_MAX:6,WEBVIEW_POOL_KEEPALIVE_MS:12e3,TAB_PREWARM_ENABLED:!0,PREWARM_ALL_PROFILE_PARTITIONS:!1},createNativePageDescriptor:(...e)=>lt?.createNativePageDescriptor?.(...e)??null,ensureNativeSettingsGeneralInfo:(...e)=>lt?.ensureNativeSettingsGeneralInfo?.(...e)??Promise.resolve(),normalizeSettingsSection:(...e)=>lt?.normalizeSettingsSection?.(...e)??"general",renderNativeSettingsPage:(...e)=>lt?.renderNativeSettingsPage?.(...e),closeBrowserExtensionsMenu:Yi,closeBrowserExtensionPopup:Gt,refreshBrowserExtensionsUi:eo,refreshTabScrollControls:Tt,syncProfileSelectionForTab:ko,updateProfileLockUI:bt,perfMark:Wn,shouldRequirePlatformApiForNavigation:_o,getWebviewPlatformApiFlag:Do,setWebviewPlatformApiFlag:Mo,getWebviewPreloadPathCached:$o,startCredentialCapturePolling:Vi,scheduleCredentialAutofill:Hi,installCredentialCaptureHooks:Oi,refreshCredentialCacheIfStale:Wi,getAutofillCredentialForTab:Ui,resolveAssignedProfileIdForTab:Gn,getCredentialScopeIdByPartition:jn,resolveCredentialScopeIdForTab:ti,maybeOfferRememberCredentials:Fi,syncTabProfileForPage:Po,trackProfileHistory:To,resolveProfileIdForTab:ei,resolveAssignedProfileId:St,resolveStrictProfileNavigationTarget:Kn,resolveNavigationPartition:pt,applyProfileSelection:wt,openProfilePromptDialog:Io,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi});const{closeTab:Kt,closeTabsBulk:vt,createTab:Pe,createWebviewForTab:to,duplicateTab:no,disposeWebviewRuntime:Vn,getActiveTab:Ze,getActiveWebview:Qe,goToActiveTabHome:io,isInspectableLocalFileTab:oo,navigateTo:yt,navigateToTab:ro,performSearch:Bt,startWebviewRuntime:ao,switchRelativeTab:Ct,switchTab:He,updateTabTitle:so,updateUrlDisplay:lo,updateUrlDisplayString:kn,getTabs:Pn}=ht;lt=Li({state:Et,constants:{PROFILES:ae,PARTITIONS:be,IS_DEV_APP_BUILD:kt},escapeHtml:Ce,showToast:Ve,isPerfEnabled:$t,formatDownloadBytes:Gi,formatDownloadSpeed:Ji,formatDownloadEta:Ki,formatHistoryTime:ni,loadManagedDownloadsFromMain:Zi,refreshExtensionsManagerList:Hn,saveProfileHistoryStore:en,getActiveTab:Ze,updateTabTitle:so,createTab:Pe,switchTab:He,navigateTo:yt});const{bindSettingsShortcutsGlobal:co,createNativePageDescriptor:mr,ensureNativeSettingsGeneralInfo:wr,getSettingsTabTitle:gr,initNativeSettingsUi:uo,initSettingsMenu:po,isEditableShortcutTarget:fo,isNativeSettingsTab:hr,normalizeSettingsSection:vr,openSettingsTab:jt,refreshActiveNativeSettingsPage:mo,renderNativeSettingsPage:br,updateNativeSettingsTabSection:yr}=lt;function wo(){try{return localStorage.getItem("username")==="Guest"}catch{return!1}}function go(e="",n="",t=""){const i=String(t||"").trim().toLowerCase();if(Vt[i])return i;const r=String(n||"").trim().toLowerCase(),c=String(e||"").trim().toLowerCase();try{const w=new URL(String(e||"")),E=`${w.protocol}//${w.host}`.toLowerCase(),k=String(w.pathname||"/").toLowerCase();if(E===Fn&&(k==="/"||k===""))return"synapse";if(E==="http://10.215.56.196:3456")return"contentgen"}catch{}return/content[\s-]*gen/.test(r)||/content[\s-]*gen/.test(c)?"contentgen":r.includes("synapse")?"synapse":""}function Jt(e){const n=ft(e);if(n===be.synapse||n===be.contentgen)return"guest";const t=Object.values(ae).find(i=>i.partition===n);return t?t.id:null}function jn(e){const n=ft(e);return n===be.synapse?"synapse":n===be.contentgen?"contentgen":Jt(n)}function pt(e="",n="",t="",i={}){const r=String(i?.sessionScope||i?.credentialScope||"").trim()||"",c=go(e,t,r);return c&&Vt[c]?Vt[c].partition:ft(n||ae[me]?.partition||be.guest)}async function ho(){const e=document.getElementById("view-synapse-link-btn");if(!e||(e.style.display="none",wo()))return;const n=String(localStorage.getItem("emp_id")||"").trim(),t=String(localStorage.getItem("username")||"").trim(),i=/^\d+$/.test(t)?t:"",r=n||i;if(r)try{const c=await fetch(`${Un}/api/list_of_users`,{signal:AbortSignal.timeout(5e3)});if(!c.ok)throw new Error(`API returned ${c.status}`);const w=await c.json(),E=Array.isArray(w)?w:Array.isArray(w?.users)?w.users:[],k=new Set(E.map(L=>String(L?.emp_id??"").trim()).filter(Boolean));e.style.display=k.has(r)?"flex":"none"}catch(c){console.warn("Could not verify Synapse visibility in view",c),e.style.display="none"}}function vo(e="",n="addressSearchDropdown"){const t=document.getElementById(n);if(!t)return;const i=String(e||"").trim().toLowerCase();if(!i){t.classList.add("hidden"),Ne=[],_e=-1;return}const r=le.filter(b=>{const x=String(b.title||"").toLowerCase(),I=String(b.url||"").toLowerCase();return x.includes(i)||I.includes(i)}).map(b=>({type:"tab",id:b.id,title:b.title||"Untitled Tab",url:b.url||"",partition:b.partition}));let c=[];Object.values(Be).forEach(b=>{Array.isArray(b)&&b.forEach(x=>{const I=String(x.title||"").toLowerCase(),A=String(x.url||"").toLowerCase();if(I.includes(i)||A.includes(i)){const R=c.some(z=>z.url===x.url),H=r.some(z=>z.url===x.url);!R&&!H&&c.push({type:"history",title:x.title||"History Item",url:x.url,partition:x.partition||be.guest})}})}),Ne=[{type:"search",title:e,url:`Search for "${e}"`},...r.slice(0,5),...c.slice(0,15)],_e=0;let E="";E+=Nt(Ne[0],0);const k=Ne.filter(b=>b.type==="tab");k.length>0&&(E+='<div class="address-search-group-label">Open Tabs</div>',k.forEach(b=>{const x=Ne.indexOf(b);E+=Nt(b,x)}));const L=Ne.filter(b=>b.type==="history");L.length>0&&(E+='<div class="address-search-group-label">History</div>',L.forEach(b=>{const x=Ne.indexOf(b);E+=Nt(b,x)})),t.innerHTML=E,t.classList.remove("hidden")}function Nt(e,n){const t=n===_e;let i=String(e.title||"H").charAt(0).toUpperCase(),r="is-history",c="History";return e.type==="tab"?(r="is-tab",c="Tab"):e.type==="search"&&(r="is-search",c="Search",i="🔍"),`
    <div class="address-search-item ${r} ${t?"is-selected":""}" 
         data-index="${n}">
      <div class="address-search-item-icon">${i}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${Ce(e.title)}</span>
        <span class="address-search-item-url">${Ce(e.url)}</span>
      </div>
      <div class="address-search-item-badge">${c}</div>
    </div>
  `}async function Bn(e,n){const t=document.getElementById(e);if(!t)return;if(_e<0||_e>=Ne.length){Bt(t.value);return}const i=Ne[_e],r=document.getElementById(n);r&&r.classList.add("hidden"),i.type==="tab"?await He(i.id):i.type==="history"?await ii(i.url,i.partition,i.title):Bt(t.value),t.blur()}function An(e,n){const t=document.getElementById(e),i=document.getElementById(n);!t||!i||(t.addEventListener("input",()=>{vo(t.value,n)}),t.addEventListener("keydown",r=>{i.classList.contains("hidden")||(r.key==="ArrowDown"?(r.preventDefault(),_e=(_e+1)%Ne.length,Tn(n)):r.key==="ArrowUp"?(r.preventDefault(),_e=(_e-1+Ne.length)%Ne.length,Tn(n)):r.key==="Enter"?(r.preventDefault(),Bn(e,n)):r.key==="Escape"&&i.classList.add("hidden"))}),i.addEventListener("click",r=>{const c=r.target.closest(".address-search-item");if(!c)return;const w=parseInt(c.dataset.index);isNaN(w)||(_e=w,Bn(e,n))}))}function Tn(e){const n=document.getElementById(e);n&&n.querySelectorAll(".address-search-item").forEach((t,i)=>{const r=parseInt(t.dataset.index);t.classList.toggle("is-selected",r===_e),r===_e&&t.scrollIntoView({block:"nearest"})})}function bo(){const e=document.getElementById("googleSearchInput");e&&e.dataset.boundAddressInput!=="1"&&(e.dataset.boundAddressInput="1",e.addEventListener("keydown",t=>{const i=document.getElementById("addressSearchDropdownHome");i&&!i.classList.contains("hidden")||t.key==="Enter"&&Bt(e.value)}),An("googleSearchInput","addressSearchDropdownHome"));const n=document.getElementById("urlDisplay");n&&n.dataset.boundAddressInput!=="1"&&(n.dataset.boundAddressInput="1",n.addEventListener("focus",()=>{n.select?.()}),n.addEventListener("keydown",t=>{const i=document.getElementById("addressSearchDropdown");if(!(i&&!i.classList.contains("hidden"))){if(t.key==="Enter")t.preventDefault(),Bt(n.value),n.blur();else if(t.key==="Escape"){t.preventDefault();const r=Ze();lo(r?.url||""),n.blur()}}}),An("urlDisplay","addressSearchDropdown"))}function zn(){if(Pt){window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode(),le.length===0?Pe():He(Oe||le[0].id);return}Pt=!0,console.log("initViewPage called"),Ei().catch(n=>{console.warn("Could not initialize OneView shared storage sync",n)}),ir(),window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled($t()).catch(()=>{}),window.api&&typeof window.api.getPerfLogPath=="function"&&window.api.getPerfLogPath().then(n=>{n?.success&&Wn("perf","log-path",{path:n.path||"",enabled:n.enabled})}).catch(()=>{}),!xn&&window.api&&typeof window.api.onCredentialDebugLog=="function"&&(xn=!0,window.api.onCredentialDebugLog(n=>{console.log("[OneView][CredentialCapture][MainRelay]",n)})),document.body?.dataset.boundProfileHistorySharedStorage!=="1"&&window.api?.onOneviewSharedStorageUpdated&&(document.body.dataset.boundProfileHistorySharedStorage="1",window.api.onOneviewSharedStorageUpdated(n=>{String(n?.key||"")===qt&&(Zn(n),mo().catch(()=>{}))})),Fo(),Ao(),Bo().catch(()=>{}),jo(),tn(),In(),_i(),document.addEventListener("click",n=>{const t=document.getElementById("addressSearchDropdown"),i=document.getElementById("addressSearchDropdownHome"),r=document.getElementById("urlDisplay"),c=document.getElementById("googleSearchInput");t&&!t.contains(n.target)&&n.target!==r&&t.classList.add("hidden"),i&&!i.contains(n.target)&&n.target!==c&&i.classList.add("hidden");const w=document.getElementById("credentialSelectionDropdown");w&&!w.contains(n.target)&&w.classList.add("hidden")}),document.body.dataset.viewThemeIconObserverBound||(document.body.dataset.viewThemeIconObserverBound="1",new MutationObserver(()=>{In()}).observe(document.body,{attributes:!0,attributeFilter:["class"]})),le.length===0?Pe():He(Oe||le[0].id);const e=document.getElementById("newTabBtn");e&&e.addEventListener("click",()=>{Pe()}),Go();try{bo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupViewSearch-err:${n.toString()}`}).catch(()=>{})}try{Wo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupBookmarks-err:${n.toString()}`}).catch(()=>{})}ho().catch(n=>{console.warn("Failed to update Synapse visibility in view",n)});try{qo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-initBookmarkManager-err:${n.toString()}`}).catch(()=>{})}document.getElementById("browserBack")?.addEventListener("click",()=>{const n=Qe();if(n&&n.canGoBack()){n.goBack();return}io()}),document.getElementById("browserForward")?.addEventListener("click",()=>{const n=Qe();n&&n.canGoForward()&&n.goForward()}),document.getElementById("browserReload")?.addEventListener("click",()=>{const n=Qe();n&&n.reload()}),document.getElementById("browserDetach")?.addEventListener("click",Ln),document.getElementById("browserDetachHeader")?.addEventListener("click",Ln),So(),ao(),Jo(),Ni(),Lo(),po(),co(),uo(),Qi(),Xi(),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode()}window.addEventListener("beforeunload",()=>{Gt().catch(()=>{}),Vn()});window.addEventListener("teardown-view-system",()=>{console.log("Teardown View System triggered"),Gt().catch(()=>{}),Vn();const e=le.map(t=>t.id);vt(e,{isTeardown:!0});const n=document.getElementById("webviews-container");n&&(n.querySelectorAll(".webcontent-pane").forEach(i=>{try{typeof i.remove=="function"&&i.remove()}catch{}}),n.innerHTML=""),le=[],Oe=null,Pt=!1});function Ot(e){if(!e||e.isHome)return!1;const n=String(e.url||"").trim(),t=String(e.launchedAppType||"").trim().toLowerCase();return!n||n==="about:blank"||n==="newtab"||Lt(n)||!/^https?:\/\//i.test(n)?!1:!t||t==="website"}function yo({activateVisibleTab:e=!0}={}){if(!Pt||le.length===0)return;const n=le.filter(c=>!c.isHome&&!Ot(c)).map(c=>c.id);if(n.length>0&&vt(n),!e)return;const t=Ze();if(t&&Ot(t)){He(t.id);return}const i=le.find(c=>Ot(c));if(i){He(i.id);return}const r=le.find(c=>c.isHome);if(r){He(r.id);return}if(le.length===0){Pe();return}He(le[0].id)}window.addEventListener("ticket-switch-preserve-view",e=>{yo({activateVisibleTab:e?.detail?.activateVisibleTab!==!1})});async function So(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;const e=JSON.parse(localStorage.getItem(Xe.installedApps)||"{}");let n=!1;for(const[t,i]of Object.entries(e)){const r=String(i?.type||"").toLowerCase();if(Yt.has(r)&&i?.localPath)try{const c=await window.api.resolveOneviewAppUrl(t,i.localPath);c?.success&&c.url&&i.oneviewUrl!==c.url&&(e[t]={...i,oneviewUrl:c.url},n=!0)}catch{}}n&&localStorage.setItem(Xe.installedApps,JSON.stringify(e))}window.initViewPage=zn;window.closeViewTab=Kt;function Eo(){const e=document.getElementById("settingsBtn");e&&e.classList.remove("is-active")}function Xt(){return{modal:document.getElementById("extensionPromptModal"),title:document.getElementById("extensionPromptTitle"),message:document.getElementById("extensionPromptMessage"),label:document.getElementById("extensionPromptLabel"),input:document.getElementById("extensionPromptInput"),textarea:document.getElementById("extensionPromptTextarea"),form:document.getElementById("extensionPromptForm"),submitBtn:document.getElementById("extensionPromptSubmitBtn"),cancelBtn:document.getElementById("extensionPromptCancelBtn"),closeBtn:document.getElementById("extensionPromptCloseBtn")}}async function xo(e={}){const n=Xt();if(!n.modal||!n.form||!n.input||!n.textarea)return{cancelled:!0,value:""};if(Ke)return{cancelled:!0,value:""};const t=e&&typeof e=="object"?e:{},i=t.multiline===!0,r=t.required!==!1,c=String(t.value||""),w=String(t.title||"Extension Input").trim()||"Extension Input",E=String(t.message||"").trim(),k=String(t.label||"Value").trim()||"Value",L=String(t.submitLabel||"Submit").trim()||"Submit",b=String(t.cancelLabel||"Cancel").trim()||"Cancel",x=String(t.placeholder||"").trim();return n.title.textContent=w,n.message.textContent=E,n.message.classList.toggle("hidden",!E),n.label.textContent=k,n.submitBtn.textContent=L,n.cancelBtn.textContent=b,n.input.classList.toggle("hidden",i),n.textarea.classList.toggle("hidden",!i),n.input.required=!i&&r,n.textarea.required=i&&r,n.input.type=t.password===!0?"password":"text",n.input.placeholder=x,n.textarea.placeholder=x,n.input.value=i?"":c,n.textarea.value=i?c:"",new Promise(I=>{Ke={resolve:I,required:r,multiline:i},rt(()=>{n.modal.classList.remove("hidden"),n.modal.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{(i?n.textarea:n.input).focus(),(i?n.textarea:n.input).select?.()})}).catch(()=>{Ke=null,I({cancelled:!0,value:""})})})}function $n(e={cancelled:!0,value:""}){const n=Xt();if(!n.modal||!Ke)return;const t=Ke;Ke=null,Je(()=>{n.modal.classList.add("hidden"),n.modal.setAttribute("aria-hidden","true"),n.form.reset(),n.input.classList.remove("hidden"),n.textarea.classList.add("hidden"),n.input.type="text"}),t.resolve(e)}function Co(){return{modal:document.getElementById("profilePromptModal"),select:document.getElementById("profilePromptSelect"),continueBtn:document.getElementById("profilePromptContinueBtn"),cancelBtn:document.getElementById("profilePromptCancelBtn"),closeBtn:document.getElementById("profilePromptCloseBtn")}}let Rt=null;async function Io(e,n="guest"){const t=Co();if(!t.modal||!t.select)return{cancelled:!0,profileId:n};if(Rt)return{cancelled:!0,profileId:n};let i=n;const r=t.select;r.innerHTML=Object.values(ae).map(w=>{const E=String(w.name||"P").charAt(0).toUpperCase();return`
        <div class="profile-big-item ${w.id===i?"active":""}" data-id="${w.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${w.color};">
            ${E}
          </div>
          <span class="profile-big-name">${Ce(w.name)}</span>
        </div>
      `}).join("");const c=w=>{i=w,r.querySelectorAll(".profile-big-item").forEach(E=>{E.classList.toggle("active",E.dataset.id===w)})};r.querySelectorAll(".profile-big-item").forEach(w=>{const E=()=>{const k=w.dataset.id;!k||!ae[k]||c(k)};w.addEventListener("click",E),w.addEventListener("keydown",k=>{(k.key==="Enter"||k.key===" ")&&(k.preventDefault(),E())}),w.addEventListener("dblclick",()=>{E(),t.continueBtn?.click()})});try{await rt(()=>{t.modal.classList.remove("hidden"),t.modal.setAttribute("aria-hidden","false")})}catch{return{cancelled:!0,profileId:n}}return new Promise(w=>{Rt={resolve:w};const E=()=>{Je(()=>{t.modal.classList.add("hidden"),t.modal.setAttribute("aria-hidden","true")}),t.continueBtn?.removeEventListener("click",k),t.cancelBtn?.removeEventListener("click",L),t.closeBtn?.removeEventListener("click",L),t.modal.removeEventListener("click",b),Rt=null},k=()=>{E(),w({cancelled:!1,profileId:i})},L=()=>{E(),w({cancelled:!0,profileId:n})};t.continueBtn?.addEventListener("click",k),t.cancelBtn?.addEventListener("click",L),t.closeBtn?.addEventListener("click",L);const b=x=>{x.target===t.modal&&L()};t.modal.addEventListener("click",b)})}function Lo(){const e=Xt();if(!e.modal||e.modal.dataset.boundExtensionPrompt==="1")return;e.modal.dataset.boundExtensionPrompt="1",e.form?.addEventListener("submit",t=>{if(t.preventDefault(),!Ke)return;const i=Ke.multiline?e.textarea:e.input,r=String(i?.value||"");if(Ke.required&&!r.trim()){i?.focus();return}$n({cancelled:!1,value:r})});const n=()=>$n({cancelled:!0,value:""});e.cancelBtn?.addEventListener("click",n),e.closeBtn?.addEventListener("click",n),e.modal.addEventListener("click",t=>{t.target===e.modal&&n()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&Ke&&!e.modal.classList.contains("hidden")&&(t.preventDefault(),n())})}function qn(){return!!Ze()?.lockedProfileId}function bt(e=null){const n=e||Ze(),t=!!n?.lockedProfileId,i=document.getElementById("profileBtn");if(i){if(i.classList.toggle("locked",t),t){const r=ae[n.lockedProfileId]?.name||"assigned";i.title=`Profile locked to ${r} for this tab`}else i.title="Switch Profile";Yn()}}function Yn(){const e=qn();document.querySelectorAll(".profile-item[data-id]").forEach(t=>{t.classList.toggle("disabled",e),t.setAttribute("aria-disabled",e?"true":"false")})}function Qt(e){return Jt(e)}function ko(e){const n=ei(e);!n||!ae[n]||me!==n&&wt(n,{bypassLock:!0})}function Zt(e,n,t){const i=document.getElementById(e);i&&(i.innerHTML=Object.values(ae).map(r=>`
      <div class="profile-pill-item ${r.id===n?"active":""}" data-id="${r.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${r.color};"></span>
        <span>${Ce(r.name)}</span>
      </div>
    `).join(""),i.querySelectorAll(".profile-pill-item").forEach(r=>{const c=()=>{const w=r.dataset.id;!w||!ae[w]||(i.querySelectorAll(".profile-pill-item").forEach(E=>{E.classList.toggle("active",E.dataset.id===w)}),typeof t=="function"&&t(w))};r.addEventListener("click",c),r.addEventListener("keydown",w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),c())})}))}function wt(e,{bypassLock:n=!1}={}){const t=String(e||"").trim();if(!ae[t]){console.warn(`[View] applyProfileSelection: Invalid profile ID "${t}"`);return}if(!n&&qn()){console.log("[View] applyProfileSelection BLOCKED: active tab is locked");return}console.log(`[View] applyProfileSelection: Switching to ${t}`),me=t,localStorage.setItem(Xe.currentProfileId,t),ri(),document.querySelectorAll(".profile-item").forEach(r=>{r.dataset.id===t?r.classList.add("active"):r.classList.remove("active")})}function St(e="",n=""){const t=String(n).toLowerCase(),i=String(e).toLowerCase();let r=i;try{r=decodeURIComponent(i)}catch{r=i}const c=`${t} ${i} ${r}`,w=/\bai\b/.test(t),E=/\b(imagine|empower|production ai|imagine wpp)\b/.test(t),k=c.includes("jira.")||c.includes("jira/")||c.includes("atlassian.net")||c.includes("jira.uhub.biz")||t.includes("jira"),L=t.includes("aem")||t.includes("veeva")||t.includes("gsk")||i.includes("gskinternet.com")||i.includes("gsk-contentlab.veevavault.com")||i.includes("veevavault.com"),b=w||E||i.includes("imagine.wpp.ai")||i.includes("://wpp.ai")||i.includes(".wpp.ai")||c.includes("://wpp.")||c.includes(".wpp.")||c.includes("wpp.com");return k?"vml":L?"gsk":b?"wppproduction":null}function Gn(e,n="",t=""){const i=String(e?.lockedProfileId||"").trim().toLowerCase(),r=St(n,t);return i&&Ri(n,t)?i:r}async function Kn(e,n=null,t="New Tab",i={}){const r=String(n||"").trim(),c=r?Qt(r):null;if(String(e||"").trim().toLowerCase().startsWith("file://"))return{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:pt(e,ae.guest.partition,t,i)};const E=St(e,t);if(E&&ae[E])return{cancelled:!1,profileId:E,lockedProfileId:E,partition:pt(e,ae[E].partition,t,i)};const k=ai(e),L=c&&k.find(b=>b.profileId===c)||k.find(b=>b.profileId===me)||k[0]||null;return L&&ae[L.profileId]?{cancelled:!1,profileId:L.profileId,lockedProfileId:L.profileId,partition:pt(e,ae[L.profileId].partition,t,i)}:{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:pt(e,ae.guest.partition,t,i)}}async function Po(e,n,t,i){const r=Gn(e,n,t);if(e.lockedProfileId=r,!r){Oe===e.id&&bt(e);return}const c=ae[r].partition;if(me!==r&&wt(r,{bypassLock:!0}),e.partition!==c){e.partition=c,i&&!i.isDestroyed?.()&&i.remove();const w=await to(e);Oe===e.id&&(bt(e),setTimeout(()=>{w.src=n},10));return}Oe===e.id&&bt(e)}function Jn(){return{wppproduction:[],vml:[],gsk:[],guest:[]}}function Xn(e={}){const n=Jn();return Object.keys(n).forEach(t=>{const i=Array.isArray(e?.[t])?e[t]:[];n[t]=i.map(r=>({url:String(r?.url||"").trim(),title:String(r?.title||"Untitled").trim()||"Untitled",visitedAt:r?.visitedAt?Number(r.visitedAt):0})).filter(r=>r.url&&r.url!=="about:blank").slice(0,200)}),n}function Qn(){!window.api||typeof window.api.setOneviewSharedStorage!="function"||window.api.setOneviewSharedStorage(qt,Be).catch(e=>{console.warn("Could not sync profile history to shared storage",e)})}function Zn(e=null){if(!e||typeof e!="object")return;Be=Xn(e.value||{});try{localStorage.setItem(zt,JSON.stringify(Be))}catch{}!document.getElementById("historyManagerModal")?.classList.contains("hidden")&&li()}async function Bo(){if(!(!window.api||typeof window.api.getOneviewSharedStorage!="function"))try{const e=await window.api.getOneviewSharedStorage(qt);e?.success&&e.entry?Zn(e.entry):Qn()}catch(e){console.warn("Could not hydrate profile history from shared storage",e)}}function Ao(){try{const e=JSON.parse(localStorage.getItem(zt)||"{}");Be=Xn(e)}catch{Be=Jn()}}function en(){localStorage.setItem(zt,JSON.stringify(Be)),Qn()}function ei(e){return e&&(e.lockedProfileId||Jt(e.partition))||me}function ti(e){return e&&(jn(e.partition)||e.lockedProfileId)||me}function To(e,n,t){if(!Be[e])return;const i=String(n||"").trim();if(!i||i==="about:blank"||i.startsWith("devtools://"))return;const r=String(t||"Untitled").trim()||"Untitled",c=Be[e]||[],w=c.findIndex(k=>k.url===i),E={url:i,title:r,visitedAt:Date.now()};w===0?c[0]=E:(w>0&&c.splice(w,1),c.unshift(E)),Be[e]=c.slice(0,200),en()}function ni(e){if(!e)return"Unknown Date";try{return new Date(e).toLocaleString()}catch{return""}}function $o(){if(gt!==null)return gt;try{gt=window.api&&typeof window.api.getWebviewPreloadPath=="function"?window.api.getWebviewPreloadPath():""}catch{gt=""}return gt}function _o(e,n={}){const t=String(n?.appType||"").trim().toLowerCase(),i=String(e||"").trim().toLowerCase();return typeof n?.requiresPlatformApi=="boolean"?n.requiresPlatformApi:t&&t!=="website"?!0:t==="website"&&Lt(i)}function Do(e){return e?.getAttribute("data-platform-api-enabled")==="1"}function Mo(e,n){!e||typeof e.setAttribute!="function"||e.setAttribute("data-platform-api-enabled",n?"1":"0")}function Uo(e=""){const n=String(e).trim();if(!n)return"APP";const t=n.split(/\s+/).filter(Boolean);return t.length===1?t[0].slice(0,3).toUpperCase():t.slice(0,3).map(i=>i[0]).join("").toUpperCase()}function No(e=""){const n=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)","linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)","linear-gradient(to right, #4facfe 0%, #00f2fe 100%)","linear-gradient(to top, #30cfd0 0%, #330867 100%)"],t=String(e);let i=0;for(let r=0;r<t.length;r+=1)i=(i+t.charCodeAt(r)*(r+1))%n.length;return n[i]}function Oo(e="app"){let n=document.getElementById("view-launch-loader");n?n.style.display="flex":(n=document.createElement("div"),n.id="view-launch-loader",n.style.cssText=["position:fixed","inset:0","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","background:rgba(15,23,42,0.45)","backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)"].join(";"),n.innerHTML=`
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
    `,document.body.appendChild(n));const t=n.querySelector("p");return t&&(t.textContent=`Opening ${e||"app"}...`),()=>{n&&(n.style.display="none")}}async function Ro(e){if(!e)return;const t=JSON.parse(localStorage.getItem(Xe.installedApps)||"{}")[e];if(!t){console.warn("Installed app not found:",e);return}const i=t.name||"App",r=Oo(i),c=xi(t);console.log("[OneView Tracking] View launch decision",{appId:e,appName:t?.name||"",appType:t?.type||"",clickTrackingMode:t?.clickTrackingMode||"",trackOnLaunch:t?.trackOnLaunch,oneviewUrl:t?.oneviewUrl||"",hasLocalPath:!!t?.localPath,shouldTrackLaunch:c}),c&&Ci({currentSelectedTicketId:window.currentActiveTicketKey||"",clickedAppName:i});try{if(un(t)){await Si(t),Ve(`Opened "${i}" in a separate window.`,"info");return}const w=()=>Ze()?.partition||ae[me]?.partition||be.guest,E=async(L,b={})=>{await Pe(L,w(),i,null,{hideControls:!0,appType:t.type,trackingAppId:e,trackingAppName:i,bypassPrompt:!0,...b})},k=String(t.type||"").toLowerCase();if(Yt.has(k)&&t.localPath){kn(`Starting ${i}...`);let L=String(t.oneviewUrl||"").trim();if(window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const x=await window.api.resolveOneviewAppUrl(e,t.localPath,"/",w());if(x?.success&&x.url){L=x.url;const I=JSON.parse(localStorage.getItem(Xe.installedApps)||"{}");I[e]&&(I[e]={...I[e],oneviewUrl:L},localStorage.setItem(Xe.installedApps,JSON.stringify(I)))}}const b=["nextjs","next","vite-server"].includes(k);if(L&&Lt(L)&&b&&(L=""),L&&Lt(L))await E(L);else{const x=await window.api.launchNextApp(t.localPath,t.type);await E(x)}return}if(t.type==="website"&&t.url){await E(t.url);return}if(t.type==="exe"&&t.localPath){kn(`Launching ${i}...`);const L=await window.api.launchExe(t.localPath,t.tech);if(L&&L.mode==="embedded"&&L.url){const b=new URLSearchParams;L.token&&b.set("NL_TOKEN",L.token),t.tech&&b.set("TECH",t.tech);const x=String(L.url).split(":")[2];x&&b.set("NL_PORT",x);const I=`${L.url}?${b.toString()}`;await E(I)}else L?.success&&L.mode==="external"?Ve(`Opened "${i}" in a separate window.`,"info"):alert(`${i} launched externally. Embedded view is not available for this app.`);return}alert(`Cannot launch "${i}". Missing supported launch configuration.`)}catch(w){if(un(t)){console.error("Failed to launch external Electron app from view:",w),Ve(`Failed to launch "${i}".`,"error");return}console.error("Failed to launch installed app from view:",w),alert(`Failed to launch "${i}": ${w.message||w}`)}finally{r()}}async function ii(e,n=null,t="New Tab",i=!1,r={}){const c=String(e||"").trim();if(!c)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){const H=be.gsk;window.enterSiteSnapStudioMode();const z=Pn(),ee=(z||[]).some(ue=>{const Y=String(ue.url||"").trim();return Y&&Y!=="about:blank"&&Y!=="newtab"});!z||z.length===0||i||ee?await Pe(c,H,t,null,r):await yt(c,H,t,null,r);return}let w=i;c.toLowerCase().startsWith("file://")&&(w=!0);const k=await Kn(c,n,t,r);if(!k||k.cancelled)return;const L=k.partition,b=k.profileId,x=k.lockedProfileId;b&&b!==Di()&&wt(b,{bypassLock:!0});const I=Pn();if(!I||I.length===0){await Pe(c,L,t,x,r);return}const A=I.some(H=>{const z=String(H.url||"").trim();return z&&z!=="about:blank"&&z!=="newtab"});if(w||A){await Pe(c,L,t,x,r);return}let R=Ze();if(!R){const H=I[I.length-1];H&&(await He(H.id),R=H)}if(!R){await Pe(c,L,t,x,r);return}await yt(c,L,t,x,r)}window.initViewPage=zn;window.createTab=Pe;window.launchInstalledAppFromView=Ro;window.openUrlFromDashboard=ii;function Fo(){const e=localStorage.getItem(Xe.currentProfileId);e&&ae[e]?me=e:me="guest",ri();const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");n&&t&&(n.addEventListener("click",async i=>{i.stopPropagation(),t.classList.contains("hidden")?await rt(()=>t.classList.remove("hidden")):Je(()=>t.classList.add("hidden"))}),t.innerHTML=Object.values(ae).map(i=>`
        <div class="profile-item ${i.id===me?"active":""}" data-id="${i.id}">
            <div class="profile-item-dot" style="background-color: ${i.color}"></div>
            <span>${i.name}</span>
        </div>
    `).join("").concat(`
        <div class="profile-divider"></div>
        <div class="profile-item" data-action="manage-passwords">
          <div class="profile-item-dot" style="background-color: #6366f1"></div>
          <span>Manage Passwords</span>
        </div>
      `),t.querySelectorAll(".profile-item").forEach(i=>{i.addEventListener("click",async()=>{if(i.dataset.action==="manage-passwords"){jt("passwords"),Je(()=>t.classList.add("hidden"));return}const r=i.dataset.id;i.classList.contains("disabled")||(oi(r),Je(()=>t.classList.add("hidden")))})}),Yn())}function oi(e){wt(e)}function ri(){const e=ae[me],n=document.getElementById("profileBtn"),t=document.getElementById("profileLabel");n&&t&&(t.textContent=e.label,t.style.color=e.color),bt()}function Wo(){const e=document.querySelector(".bookmarks-grid");e&&e.addEventListener("click",n=>{const t=n.target.closest(".bookmark-edit-btn");if(t){n.preventDefault(),n.stopPropagation();const I=t.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;I&&Yo(I);return}const i=n.target.closest(".bookmark-delete-btn");if(i){n.preventDefault(),n.stopPropagation();const I=i.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;I&&($e=$e.filter(A=>A.id!==I),si(),tn());return}const r=n.target.closest(".bookmark-card");if(!r||r.id==="addBookmarkBtn"||r.classList.contains("add-bookmark-card"))return;const c=r.dataset.url,w=r.dataset.title||"New Tab",E=String(r.dataset.partition||"").trim(),k=String(r.dataset.sessionScope||"").trim(),b=r.dataset.profileId||Qt(r.dataset.partition)||St(c||"",w)||me;if(b!==me&&oi(b),c){const x=pt(c,E||ae[b].partition,w,k?{sessionScope:k}:{});yt(c,x,w,St(c||"",w))}})}function mt(e=""){const n=String(e).trim();return n?/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/^about:/i.test(n)?n:`https://${n}`:""}function At(e=""){const n=mt(e);if(!n)return"";try{const t=new URL(n),i=t.pathname.length>1?t.pathname.replace(/\/+$/,"")||"/":t.pathname||"/";return`${t.origin}${i}${t.search}${t.hash}`}catch{return n.replace(/\/+$/,"")}}function ai(e=""){const n=At(e);return n?$e.filter(t=>At(t.url)===n):[]}function Ho(e="",n=""){const t=ai(e);return n?t.find(i=>String(i.profileId||"").trim().toLowerCase()===n)||null:t[0]||null}function Vo(e=null){return e?String(e.lockedProfileId||"").trim().toLowerCase()||Qt(e.partition)||me||"guest":me||"guest"}function jo(){try{const e=JSON.parse(localStorage.getItem(On)||"[]");$e=Array.isArray(e)?e.map(n=>({id:String(n?.id||""),title:String(n?.title||"").trim(),url:mt(n?.url||""),profileId:ae[n?.profileId]?n.profileId:"guest"})).filter(n=>n.id&&n.title&&n.url):[]}catch{$e=[]}}function si(){localStorage.setItem(On,JSON.stringify($e))}function zo({id:e="",title:n="",url:t="",profileId:i="guest"}){const r=mt(t),c=String(n||"").trim()||r,w=ae[i]?i:"guest",E=At(r);if(!r||!E)return!1;const k=$e.findIndex(b=>e&&b.id===e?!0:At(b.url)===E&&String(b.profileId||"guest")===w),L={id:k>=0?$e[k].id:e||`bm-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:c,url:r,profileId:w};return k>=0?$e[k]={...$e[k],...L}:$e.unshift(L),k>=0?"updated":"created"}function tn(){const e=document.querySelector(".bookmarks-grid");if(!e)return;e.querySelectorAll(".bookmark-card.custom-bookmark").forEach(i=>i.remove());const n=$e.map(i=>{const r=ae[i.profileId]||ae.guest;return`
        <div
          class="bookmark-card custom-bookmark"
          data-bookmark-id="${Ce(i.id)}"
          data-url="${Ce(i.url)}"
          data-title="${Ce(i.title)}"
          data-profile-id="${Ce(i.profileId)}"
        >
          <button class="bookmark-edit-btn" type="button" title="Edit Bookmark">E</button>
          <button class="bookmark-delete-btn" type="button" title="Remove Bookmark">X</button>
          <div class="bookmark-icon" style="background:${No(i.title)};">
            <span>${Ce(Uo(i.title))}</span>
          </div>
          <div class="bookmark-info">
            <h3>${Ce(i.title)}</h3>
            <p>${Ce(r.name)} Profile</p>
          </div>
        </div>
      `}).join(""),t=document.getElementById("addBookmarkBtn");t?t.insertAdjacentHTML("beforebegin",n):e.insertAdjacentHTML("beforeend",n)}function qo(){const e=document.getElementById("addBookmarkBtn"),n=document.getElementById("bookmarkCurrentPageHeaderBtn"),t=document.getElementById("bookmarkModal"),i=document.getElementById("bookmarkModalCloseBtn"),r=document.getElementById("bookmarkForm"),c=document.getElementById("bookmarkTitleInput"),w=document.getElementById("bookmarkUrlInput"),E=t?.querySelector(".password-modal-header h3"),k=document.getElementById("bookmarkSaveBtn");if(!e||!t||!i||!r||!c||!w)return;const L=()=>{Je(()=>{t.classList.add("hidden"),It=null})},b=async({editId:A=null,title:R="",url:H="",profileId:z=me,heading:ee="Add Bookmark",saveLabel:ue="Save Bookmark"}={})=>{It=A,st=ae[z]?z:me,Zt("bookmarkProfileSelect",st,Y=>{st=Y}),E&&(E.textContent=ee),k&&(k.textContent=ue),r.reset(),c.value=String(R||""),w.value=String(H||""),await rt(()=>t.classList.remove("hidden")),c.value?(c.focus(),c.select()):c.focus()},x=async()=>{await b()},I=async()=>{const A=Ze(),R=mt(A?.url||"");if(!A||A.isHome||!R||R==="about:blank"){Ve("Open a website tab first to save it as a bookmark.","error");return}const H=Vo(A),z=Ho(R,H);await b({editId:z?.id||null,title:A.title||z?.title||"New Bookmark",url:R,profileId:H,heading:z?"Update Bookmark":"Save Current Site",saveLabel:z?"Update Bookmark":"Save Bookmark"})};e.addEventListener("click",x),e.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await x())}),n?.addEventListener("click",I),n?.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await I())}),i.addEventListener("click",L),t.addEventListener("click",A=>{A.target===t&&L()}),r.addEventListener("submit",A=>{A.preventDefault();const R=String(c.value||"").trim(),H=mt(w.value);if(!R||!H)return;const z=zo({id:It,title:R,url:H,profileId:st||me});z&&(si(),tn(),L(),r.reset(),Ve(z==="updated"?"Bookmark updated successfully.":"Bookmark saved successfully.","success"))})}async function Yo(e){const n=document.getElementById("bookmarkModal"),t=document.getElementById("bookmarkForm"),i=document.getElementById("bookmarkTitleInput"),r=document.getElementById("bookmarkUrlInput"),c=n?.querySelector(".password-modal-header h3"),w=document.getElementById("bookmarkSaveBtn");if(!n||!t||!i||!r)return;const E=$e.find(k=>k.id===e);E&&(It=E.id,st=E.profileId||me,c&&(c.textContent="Edit Bookmark"),w&&(w.textContent="Update Bookmark"),Zt("bookmarkProfileSelect",st,k=>{st=k}),i.value=E.title||"",r.value=E.url||"",await rt(()=>n.classList.remove("hidden")),i.focus())}function Go(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;const i=220;n.addEventListener("click",()=>{e.scrollBy({left:-i,behavior:"smooth"})}),t.addEventListener("click",()=>{e.scrollBy({left:i,behavior:"smooth"})}),e.addEventListener("scroll",Tt),Tt()}function li(){const e=document.getElementById("historyList"),n=document.getElementById("historyProfileSelect");if(!e||!n)return;const t=Ht||me,i=Be[t]||[];if(i.length===0){e.innerHTML="<div class='password-meta'>No history for this profile yet.</div>";return}const r=new Date,c=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),w=c-864e5,E={today:[],yesterday:[],older:[]};i.forEach((I,A)=>{const R={...I,originalIndex:A},H=I.visitedAt||0;H>=c?E.today.push(R):H>=w?E.yesterday.push(R):E.older.push(R)});const k=I=>I.toLocaleDateString(void 0,{month:"short",day:"numeric"}),L=`Today - ${k(r)}`,b=`Yesterday - ${k(new Date(w))}`,x=(I,A,R=!1)=>{if(A.length===0)return"";const H=A.map(z=>`
      <div class="history-item" data-index="${z.originalIndex}">
        <div class="history-main">
          <div class="history-title">${Ce(z.title||"Untitled")}</div>
          <div class="history-url">${Ce(z.url||"")}</div>
          <div class="password-meta">${Ce(ni(z.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `).join("");return`
      <details class="history-group" ${R?"open":""}>
        <summary class="history-group-title">
          <span>${I}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${A.length}</span>
        </summary>
        <div class="history-group-content">
          ${H}
        </div>
      </details>
    `};e.innerHTML=`
    ${x(L,E.today,E.today.length>0)}
    ${x(b,E.yesterday,!1)}
    ${x("Older",E.older,!1)}
  `,e.querySelectorAll(".history-item").forEach(I=>{I.addEventListener("click",A=>{const R=A.target.closest("button");if(!R)return;const H=Number(I.dataset.index);if(Number.isNaN(H))return;const z=Be[t]||[],ee=z[H];if(ee){if(R.dataset.action==="delete"){z.splice(H,1),Be[t]=z,en(),li();return}if(R.dataset.action==="open"){const ue=ae[t]?.partition||be.guest;Pe(ee.url,ue,ee.title||"History",t)}}})})}async function ot({title:e="Clear Page Cache",message:n="",confirmLabel:t="OK",cancelLabel:i="Cancel",hideCancel:r=!1}={}){const c=document.getElementById("cacheActionModal"),w=document.getElementById("cacheActionTitle"),E=document.getElementById("cacheActionMessage"),k=document.getElementById("cacheActionCloseBtn"),L=document.getElementById("cacheActionCancelBtn"),b=document.getElementById("cacheActionConfirmBtn");return!c||!w||!E||!k||!L||!b?Promise.resolve(window.confirm(n||e)):(w.textContent=e,E.textContent=n,b.textContent=t,L.textContent=i,L.style.display=r?"none":"inline-flex",await rt(()=>c.classList.remove("hidden")),new Promise(x=>{const I=()=>{k.removeEventListener("click",A),L.removeEventListener("click",A),b.removeEventListener("click",R),c.removeEventListener("click",H),Je(()=>c.classList.add("hidden"))},A=()=>{I(),x(!1)},R=()=>{I(),x(!0)},H=z=>{z.target===c&&A()};k.addEventListener("click",A),L.addEventListener("click",A),b.addEventListener("click",R),c.addEventListener("click",H)}))}function Tt(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;if(!(e.scrollWidth>e.clientWidth+1)){n.classList.add("hidden"),t.classList.add("hidden"),e.scrollLeft=0;return}const r=e.scrollLeft<=1,c=e.scrollLeft+e.clientWidth>=e.scrollWidth-1;n.classList.toggle("hidden",r),t.classList.toggle("hidden",c)}function nn(e){if(!e)return null;if(typeof e.getWebContentsId=="function")try{const n=e.getWebContentsId();if(n)return n}catch{}return e._webContent?e._webContent.key||e._webContent.id||null:e.key||e.id||e.getAttribute("key")||e.getAttribute("id")||null}async function Ko(e,n){const t=le.findIndex(r=>r.id===n),i=le[t];if(e==="duplicate-tab"&&i){no(n);return}if(e==="inspect-local-file"&&i){const r=document.getElementById(`webview-${i.id}`),c=nn(r);if(!c||!window.api?.toggleWebviewDevTools){Ve(kt?"Inspect is not available for this tab.":"Inspect is not available for this local file tab.","error");return}await window.api.toggleWebviewDevTools(c)||Ve(kt?"Could not open developer tools.":"Could not open developer tools for this local file.","error");return}if(e==="clear-cache"&&i){const r=document.getElementById(`webview-${i.id}`),c=r&&typeof r.getURL=="function"&&r.getURL()||i.url||"",w=r&&r.getAttribute("partition")||i.partition||be.guest;if(!c||c==="about:blank"||!await ot({title:"Clear Page Cache",message:`Clear cache and site data for ${c}?`,confirmLabel:"Clear Cache",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewPageCache!="function"){await ot({title:"Action Unavailable",message:"Cache clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const k=await window.api.clearWebviewPageCache(w,c);k?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await ot({title:"Could Not Clear Cache",message:k?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(k){const L=String(k?.message||k||""),b=/No handler registered for 'clear-webview-page-cache'/.test(L)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await ot({title:"Could Not Clear Cache",message:`${L}${b}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-user-data"&&i){const r=document.getElementById(`webview-${i.id}`),c=r&&typeof r.getURL=="function"&&r.getURL()||i.url||"",w=r&&r.getAttribute("partition")||i.partition||be.guest;if(!c||c==="about:blank"||!await ot({title:"Clear User Data",message:`Clear local storage and site data for ${c}?`,confirmLabel:"Clear Data",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewUserData!="function"){await ot({title:"Action Unavailable",message:"User-data clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const k=await window.api.clearWebviewUserData(w,c);k?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await ot({title:"Could Not Clear User Data",message:k?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(k){const L=String(k?.message||k||""),b=/No handler registered for 'clear-webview-user-data'/.test(L)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await ot({title:"Could Not Clear User Data",message:`${L}${b}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-all"){vt(le.map(r=>r.id));return}if(e==="clear-right"&&t>=0){vt(le.slice(t+1).map(r=>r.id));return}e==="clear-left"&&t>=0&&vt(le.slice(0,t).map(r=>r.id))}function Jo(){const e=document.querySelector(".tabs-header");e&&e.addEventListener("contextmenu",async n=>{if(n.target.closest(".profile-section"))return;n.preventDefault();const r=n.target.closest(".tab")?.id?.replace("tab-ui-","")||Oe||le[0]?.id||null;if(!r)return;Nn=r;const c=le.findIndex(I=>I.id===r),w=le[c],E=document.getElementById(`webview-${r}`),k=oo(w,E),L=!!(w&&!w.isHome&&(E&&E.getURL()!=="about:blank"||w.url)),b=c>0?c:0,x=c>=0&&c<le.length-1?le.length-c-1:0;window.api&&typeof window.api.showNativeTabContextMenu=="function"&&await window.api.showNativeTabContextMenu({anchorId:r,x:Math.round(n.x),y:Math.round(n.y),disabled:{clearLeft:b===0,clearRight:x===0,clearCache:!L,clearUserData:!L,inspectLocalFile:!k}})})}function Ft(e){if(!e)return"";const n=String(e.getData("text/uri-list")||"").split(/\r?\n/).map(c=>c.trim()).find(c=>c&&!c.startsWith("#"));if(n&&/^https?:\/\//i.test(n))return n;const i=String(e.getData("text/html")||"").match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);if(i&&/^https?:\/\//i.test(String(i[1]||"").trim()))return String(i[1]||"").trim();const r=String(e.getData("text/plain")||"").trim();return/^https?:\/\//i.test(r)?r:r&&!/\s/.test(r)&&/\./.test(r)?mt(r):""}function Xo(){const e=document.querySelector(".tabs-header");if(!e||e.dataset.dropBound==="1")return;e.dataset.dropBound="1";const n=t=>{e.classList.toggle("is-drop-target",!!t)};e.addEventListener("dragenter",t=>{Ft(t.dataTransfer)&&(t.preventDefault(),n(!0))}),e.addEventListener("dragover",t=>{Ft(t.dataTransfer)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),n(!0))}),e.addEventListener("dragleave",t=>{e.contains(t.relatedTarget)||n(!1)}),e.addEventListener("drop",t=>{const i=Ft(t.dataTransfer);if(n(!1),!i)return;t.preventDefault();const c=t.target.closest(".tab")?.id?.replace("tab-ui-","")||Oe,w=le.findIndex(E=>E.id===c);Pe(i,null,"New Tab",null,{insertIndex:w>=0?w+1:le.length})})}function Qo(e){const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");!n||!t||!n.contains(e.target)&&!t.contains(e.target)&&!t.classList.contains("hidden")&&Je(()=>t.classList.add("hidden"))}async function Zo(e){const n=String(e?.action||"");if(!n||n==="__menu_closed__")return;const t=String(e?.anchorId||Nn||Oe||le[0]?.id||"");t&&await Ko(n,t)}const _n={desktop:{width:1920,height:1080,userAgent:"desktop"},mobile:{width:414,height:896,userAgent:"mobile"},tablet:{width:768,height:1024,userAgent:"tablet"}};async function ci(e,n="mobile"){if(!e)throw new Error("No active webview");const t=_n[n]||_n.mobile;if(console.log(`[Viewport] Setting ${n} viewport: ${t.width}x${t.height}`),window.api?.setWebviewBounds){const i=nn(e);i&&(console.log(`[Viewport] Triggering native resize to ${t.width}x${t.height} for id: ${i}`),await window.api.setWebviewBounds(i,{width:t.width,height:t.height}))}return window.__oneview_original_webview_dims||(window.__oneview_original_webview_dims={width:e.style.width,height:e.style.height,minWidth:e.style.minWidth,minHeight:e.style.minHeight,maxWidth:e.style.maxWidth,maxHeight:e.style.maxHeight,flex:e.style.flex}),e.style.width=t.width+"px",e.style.height=t.height+"px",e.style.minWidth=t.width+"px",e.style.minHeight=t.height+"px",e.style.maxWidth=t.width+"px",e.style.maxHeight=t.height+"px",e.style.flex="none",console.log(`[Viewport] Resized webview element to ${t.width}x${t.height}`),await e.executeJavaScript(`
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
    `,!0),await new Promise(i=>setTimeout(i,300)),t}async function er(e){if(e&&window.api?.setWebviewBounds){const n=document.getElementById("webviews-container"),t=nn(e);if(n&&t){const i=n.getBoundingClientRect();await window.api.setWebviewBounds(t,{width:Math.round(i.width),height:Math.round(i.height)})}}}async function di(e){if(console.log("[Viewport] Resetting to original viewport"),window.__oneview_original_webview_dims&&e){const n=window.__oneview_original_webview_dims;e.style.width=n.width,e.style.height=n.height,e.style.minWidth=n.minWidth,e.style.minHeight=n.minHeight,e.style.maxWidth=n.maxWidth,e.style.maxHeight=n.maxHeight,e.style.flex=n.flex,window.__oneview_original_webview_dims=null,await er(e),console.log("[Viewport] Webview element dimensions and native bounds restored")}await e.executeJavaScript(`
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
    `,!0),await new Promise(n=>setTimeout(n,500))}async function tr(e={}){const n=Qe();if(!n||typeof n.executeJavaScript!="function")throw new Error("Active tab is unavailable");if(typeof n.capturePage!="function")throw new Error("Active tab does not support capture");const t=String(e?.viewport||"desktop").trim().toLowerCase();if(console.log("[Capture] Active webview found",{id:n.id,url:n.getURL?.(),title:n.getTitle?.(),viewport:t,loading:n._webContent?.state?.loading}),t==="mobile"||t==="tablet"){const Y=t==="tablet"?"tablet":"mobile";await ci(n,Y),console.log("[Capture] Viewport changed to "+Y+", waiting for page reflow..."),await new Promise(oe=>setTimeout(oe,300))}const i=5e3,r=Date.now();for(;n._webContent?.state?.loading&&Date.now()-r<i;)console.log("[Capture] Waiting for page to load..."),await new Promise(Y=>setTimeout(Y,200));console.log("[Capture] Page load status:",n._webContent?.state?.loading?"still loading":"loaded");const c=String(e?.mode||"visible").trim().toLowerCase();if(c!=="full"&&c!=="fullpage"){const Y=await n.capturePage(),oe=Y?.isEmpty?.()?"":Y.toDataURL();return console.log("[CapturePage] Visible captured. DataUrl length:",oe?.length||0),{mode:"visible",dataUrl:oe,width:Y?.getSize?.()?.width||0,height:Y?.getSize?.()?.height||0}}const w=await n.executeJavaScript(`
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
    `,!0);Math.max(1,Number(w?.totalWidth||0));let E=Math.max(1,Number(w?.totalHeight||0));Math.max(1,Number(w?.viewportWidth||0));let k=Math.max(1,Number(w?.viewportHeight||0));if(console.log("[FullCapture] Starting capture process..."),console.log("[FullCapture] Initial metrics:",w),await n.executeJavaScript(`
    (() => {
      const style = document.createElement('style');
      style.id = '__oneview_force_auto_scroll__';
      style.textContent = 'html, body, * { scroll-behavior: auto !important; }';
      (document.head || document.documentElement).appendChild(style);
    })();
  `,!0).catch(()=>{}),E>k+100){console.log("[FullCapture] Verifying scroll functionality...");const oe=await n.executeJavaScript(`
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
    `,!0).catch(()=>null);console.log("[FullCapture] Verification scroll results:",oe);const ye=Number(oe?.startY||0),Ie=Number(oe?.endY||0);if(Ie-ye<10)throw new Error("Scroll verification failed: page did not scroll (startY="+ye+", endY="+Ie+"). Capture aborted to prevent repeating/empty fallback images.");await n.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `,!0).catch(()=>{})}const L=Math.floor(k*.8),b=Math.ceil(E/L);console.log("[FullCapture] Progressive scroll: "+b+" steps, "+L+"px per step");let x=0;for(let Y=0;Y<b;Y++){x=Math.min(x+L,E),console.log(`[FullCapture] Scrolling host-driven to ${x}px (${Y+1}/${b})`);const oe=`
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
    `;await n.executeJavaScript(oe,!0).catch(()=>{}),await new Promise(ye=>setTimeout(ye,600))}await n.executeJavaScript(`window.scrollTo({ top: ${E}, left: 0, behavior: 'auto' });`,!0).catch(()=>{}),await new Promise(Y=>setTimeout(Y,800)),await n.executeJavaScript(`
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
  `,!0).catch(()=>{}),console.log("[FullCapture] Scrolling back to top...");const I=`
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
  `;await n.executeJavaScript(I,!0).catch(()=>{});let A=0,R=!1;for(;!R&&A<50;)await n.executeJavaScript("(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)",!0).catch(()=>0)<=5?R=!0:(await n.executeJavaScript(I,!0).catch(()=>{}),await new Promise(oe=>setTimeout(oe,100)),A++);await n.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");const H=Number(e?.wait||0)*1e3,z=200+H;console.log(`[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${z}ms (Base 0.2s + User ${H}ms) for page to settle live...`),await new Promise(Y=>setTimeout(Y,z));let ee="",ue=null;try{console.log("[FullCapture] Calling native one-shot capture..."),ue=await n.capturePage({mode:"full",scrollHeight:Math.round(E)}),ee=ue?.isEmpty?.()?"":ue.toDataURL()}finally{console.log("[FullCapture] Restoring original body and globals..."),await n.executeJavaScript(`
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
      `,!0).catch(()=>{}),(t==="mobile"||t==="tablet")&&await di(n),await n.executeJavaScript(`
        window.scrollTo(${Math.round(Number(w?.scrollX||0))}, ${Math.round(Number(w?.scrollY||0))});
      `,!0).catch(()=>{})}if(!ee)throw new Error("Full page capture returned empty image data");return{mode:"full",dataUrl:ee,width:ue?.getSize?.()?.width||0,height:ue?.getSize?.()?.height||0,tileCount:1}}async function nr(e){const n=String(e?.command||"").trim(),t=String(e?.url||"").trim(),i=String(e?.requestId||"").trim();if(!n)return;if(n==="execute-script"){const b=String(e?.source||"");let x={requestId:i,success:!1,message:"No active tab"};try{const I=Qe();if(!I||typeof I.executeJavaScript!="function")x={requestId:i,success:!1,message:"Active tab is unavailable"};else{const A=`
          (() => {
            const run = () => {
              ${b}
            };
            return run();
          })();
        `,R=await I.executeJavaScript(A,!0);x={requestId:i,success:!0,result:R}}}catch(I){x={requestId:i,success:!1,message:I?.message||String(I)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(x);return}if(n==="ui-prompt"){let b={requestId:i,success:!1,message:"Prompt request failed"};try{const x=await xo(e?.prompt||{});b={requestId:i,success:!0,result:x}}catch(x){b={requestId:i,success:!1,message:x?.message||String(x)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(n==="capture-page"){let b={requestId:i,success:!1,message:"Capture request failed",key:e?.key||"view:extension-popup"};try{const x=String(e?.options?.mode||"visible").trim().toLowerCase(),I=String(e?.options?.viewport||"desktop").trim().toLowerCase(),A=Number(e?.options?.wait||0);if(console.log("[View] Capturing mode:",x,"viewport:",I,"wait:",A),x==="full"||x==="fullpage"){console.log("[View] Using full-page capture function");const R=await tr({mode:x,viewport:I,wait:A});b={requestId:i,success:!0,result:R,key:e?.key||"view:extension-popup"}}else{const R=Qe();if(!R||typeof R.capturePage!="function")throw new Error("Active tab does not support capture");if(console.log("[View] Capturing visible area from webview id:",R.id),I==="mobile"||I==="tablet"){const ue=I==="tablet"?"tablet":"mobile";await ci(R,ue),console.log("[View] Viewport changed to "+ue+", waiting for page reflow..."),await new Promise(Y=>setTimeout(Y,800))}const H=await R.capturePage(),z=H?.isEmpty?.()?"":H.toDataURL?.();console.log("[View] Visible capture dataUrl length:",z?.length||0);const ee={mode:"visible",dataUrl:z,width:H?.getSize?.()?.width||0,height:H?.getSize?.()?.height||0};(I==="mobile"||I==="tablet")&&await di(R),b={requestId:i,success:!0,result:ee,key:e?.key||"view:extension-popup"}}}catch(x){console.error("[View] Capture error:",x),b={requestId:i,success:!1,message:x?.message||String(x),key:e?.key||"view:extension-popup"}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(n==="tabs-create"){const b=String(e.url||"").trim(),x=e.requestId;let I=e.partition||null;if(!I&&b.startsWith(`${Ii}://`))try{I=`ext-${new URL(b).host}`}catch{}const A=I?ft(I):"",R=le.find(H=>H.url&&H.url.includes("result.html")&&(!A||ft(H.partition||"")===A));R?(console.log("[View] Reusing existing result tab:",R.id),await ro(R.id,b,I,"Result"),e.active!==!1&&await He(R.id)):await Pe(b,I,"Result",null,{active:e.active!==!1,extensionEntryPath:e.entryPath}),x&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:x,success:!0});return}if(n==="tabs-close"){let b={requestId:i,success:!1,message:"Tab not found"};try{const x=String(e?.tabId||"").trim();le.find(A=>A.id===x)?(Kt(x),b={requestId:i,success:!0,result:{id:x,closed:!0}}):b={requestId:i,success:!1,message:"Tab not found"}}catch(x){b={requestId:i,success:!1,message:x?.message||String(x)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(!t)return;const r=Ze(),c=Qe(),w=r?.partition||ae[me]?.partition||be.guest,E=/^file:\/\//i.test(t),k={extensionEntryPath:E?String(e?.entryPath||"").trim():"",extensionActiveContext:{url:String(c?.getURL?.()||r?.url||"").trim(),title:String(c?.getTitle?.()||r?.title||"").trim()},active:e?.active!==!1};if(E){const b=le.find(x=>x.url===t);if(b){await He(b.id),i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:b.id,url:t,title:b.title||"New Tab",active:!0}});return}}if(n==="tabs-update"&&r&&!r.isHome&&!r.nativePage){await yt(t,w,"New Tab",null,k),i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:r.id,url:t,title:r.title||"New Tab",active:!0}});return}r?.id;const L=Pe(t,w,"New Tab",null,k);i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:L?.id||"",url:t,title:L?.title||"New Tab",active:e?.active!==!1}})}function ir(){Cn||(Cn=!0,document.addEventListener("click",Qo),document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const n=String(e.key||"").toLowerCase();if(!(!(e.key==="Tab"||e.key==="PageUp"||e.key==="PageDown")&&fo(e.target))){if(n==="h"&&!e.shiftKey){e.preventDefault(),jt("history");return}if(n==="d"&&e.shiftKey){e.preventDefault(),jt("downloads");return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation(),Ct(e.shiftKey?-1:1);return}if(e.key==="PageUp"){e.preventDefault(),e.stopPropagation(),Ct(-1);return}e.key==="PageDown"&&(e.preventDefault(),e.stopPropagation(),Ct(1))}},!0),window.addEventListener("resize",Tt),Xo(),window.api&&typeof window.api.onViewTabShortcut=="function"&&window.api.onViewTabShortcut(e=>{const n=Number(e?.direction||0);n&&Ct(n<0?-1:1)}),window.api&&typeof window.api.onBrowserExtensionsUpdated=="function"&&window.api.onBrowserExtensionsUpdated(()=>{console.log("Browser extensions updated, refreshing UI..."),Hn().catch(()=>{})}),window.api&&typeof window.api.onNativeTabContextAction=="function"&&window.api.onNativeTabContextAction(e=>{Zo(e).catch(()=>{})}),window.api&&typeof window.api.onBrowserExtensionCommand=="function"&&window.api.onBrowserExtensionCommand(e=>{nr(e).catch(n=>{console.error("Browser extension command failed",n)})}))}let Wt,Dn;const Mn=new ResizeObserver(()=>{const e=Qe();!e||typeof e.syncBounds!="function"||(e.syncBounds(!0),clearInterval(Wt),clearTimeout(Dn),Wt=setInterval(()=>{const n=Qe();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},50),Dn=setTimeout(()=>{clearInterval(Wt);const n=Qe();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},350))});(function(){const n=document.getElementById("webviews-container");if(n){Mn.observe(n);return}const t=new MutationObserver(()=>{const i=document.getElementById("webviews-container");i&&(t.disconnect(),Mn.observe(i))});t.observe(document.documentElement,{childList:!0,subtree:!0})})();window.enterSiteSnapStudioMode=function(){document.body.classList.add("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.add("sitesnap-studio-mode");try{window.parent.document.body.classList.add("sitesnap-studio-active")}catch(n){console.error("Failed to set parent active layout",n)}};window.exitSiteSnapStudioMode=function(){document.body.classList.remove("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.remove("sitesnap-studio-mode");try{window.parent.document.body.classList.remove("sitesnap-studio-active")}catch(n){console.error("Failed to remove parent active layout",n)}};
