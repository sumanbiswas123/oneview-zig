import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{o as rt,c as Ge,e as xe}from"./utils-CcN8uuF7.js";import{s as We}from"./notifications-CBkElf_0.js";import{i as un,l as yi}from"./external-exe-DRsy67iY.js";import{c as pn,i as Si,s as Ei,t as xi}from"./webcontent-client-57hWQ0Ee.js";import{n as pt,R as Un,i as It,c as Ci,I as Lt}from"./app-env-Dw5Rxq_p.js";import{S as Ke,P as ge}from"./app-runtime-CuOCpSBc.js";function Ii({state:e,constants:n,escapeHtml:t,showToast:i,isPerfEnabled:r,formatDownloadBytes:c,formatDownloadSpeed:g,formatDownloadEta:x,formatHistoryTime:P,loadManagedDownloadsFromMain:L,refreshExtensionsManagerList:h,saveProfileHistoryStore:E,getActiveTab:I,updateTabTitle:A,createTab:N,switchTab:H,navigateTo:j}){const{PROFILES:Z,PARTITIONS:de,IS_DEV_APP_BUILD:q}=n;function oe(f=""){const T=String(f||"").trim().toLowerCase();return["downloads","history","extensions","passwords"].includes(T)?T:"extensions"}function be(f="extensions"){const T=oe(f);return T==="downloads"?"Downloads":T==="history"?"History":T==="passwords"?"Passwords":"Extensions"}function Ce(f="extensions"){const T=oe(f);return T==="downloads"?"Ctrl+Shift+D":T==="history"?"Ctrl+H":T==="extensions"?"Ctrl+E":""}function Qe(f){const T=f instanceof Element?f:null;return T?T.closest("input, textarea, select")?!0:T.isContentEditable===!0:!1}function _e(f="settings",T="extensions"){return{type:String(f||"settings").trim().toLowerCase(),section:oe(T)}}function ae(f="extensions"){const T=oe(f);return e.tabs.find(C=>C?.nativePage?.type==="settings"&&oe(C?.nativePage?.section)===T)||null}function me(f){return f?.nativePage?.type==="settings"}async function nt(){if(!window.api)return e.nativeSettingsGeneralInfo;try{if(!e.nativeSettingsGeneralInfo.version&&window.api.getAppVersion&&(e.nativeSettingsGeneralInfo.version=await window.api.getAppVersion()),!e.nativeSettingsGeneralInfo.defaultOpenStatus&&window.api.getDefaultOpenHandlingStatus){const f=await window.api.getDefaultOpenHandlingStatus();e.nativeSettingsGeneralInfo.defaultOpenStatus=f?.isDefault||f?.success?"Configured":"Needs setup"}}catch{}return e.nativeSettingsGeneralInfo}function Ae(){return Object.entries(e.profileHistoryCache||{}).flatMap(([f,T])=>(Array.isArray(T)?T:[]).map(C=>({profileId:f,profileName:Z[f]?.name||f||"Unknown",url:String(C?.url||"").trim(),title:String(C?.title||"Untitled").trim()||"Untitled",visitedAt:C?.visitedAt?Number(C.visitedAt):0}))).filter(f=>f.url&&f.visitedAt).sort((f,T)=>Number(T.visitedAt||0)-Number(f.visitedAt||0))}function Ee(f){const T=new Date(Number(f||0));if(Number.isNaN(T.getTime()))return"Unknown Date";const C=new Date,k=new Date(C.getFullYear(),C.getMonth(),C.getDate()).getTime(),_=new Date(T.getFullYear(),T.getMonth(),T.getDate()).getTime(),X=k-1440*60*1e3;return _===k?"Today":_===X?"Yesterday":T.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function Ie(f=[]){const T=[],C=new Map;return f.forEach(k=>{const _=Ee(k.visitedAt);if(!C.has(_)){const X={key:`${_}-${k.visitedAt}`,label:_,entries:[]};C.set(_,X),T.push(X)}C.get(_).entries.push(k)}),T}function Ve(){return e.managedDownloadsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.managedDownloadsCache.map(f=>{const T=f.totalBytes?Math.max(0,Math.min(100,Math.round(f.receivedBytes/f.totalBytes*100))):f.state==="completed"?100:0,C=f.totalBytes?`${c(f.receivedBytes)} / ${c(f.totalBytes)}`:c(f.receivedBytes),k=f.state==="progressing"?`${g(f.bytesPerSecond)} - ${x(f.etaSeconds)}`:f.state==="completed"?`Saved to ${t(f.savePath||"")}`:t(String(f.state||"Unknown"));return`
              <article class="native-settings-row native-settings-download-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.fileName||"Download")}</div>
                    <div class="native-settings-row-note">${t(C)}</div>
                    <div class="native-settings-row-note">${k}</div>
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
    `:'<div class="native-settings-empty">No downloads yet.</div>'}function je(){const f=e.historySearchQuery.trim().toLowerCase(),T=Ae().filter(k=>f?`${k.title||""} ${k.url||""} ${k.profileName||""}`.toLowerCase().includes(f):!0);return T.length?`
      <div class="native-history-flat-list">
        ${Ie(T).map(k=>`
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${t(k.label)}</span>
                </div>
                ${k.entries.map(_=>`
                      <article class="native-history-entry">
                        <div class="native-history-entry-content">
                          <div class="native-history-entry-title">${t(_.title||"Untitled")}</div>
                          <div class="native-history-entry-url">${t(_.url||"")}</div>
                          <div class="native-history-entry-meta">${t(_.profileName)} • ${t(P(_.visitedAt))}</div>
                        </div>
                        <div class="native-history-entry-actions">
                          <button class="native-settings-action" type="button" data-native-history-action="open" data-history-time="${t(_.visitedAt||"")}" data-profile-id="${t(_.profileId)}">Open</button>
                          <button class="native-settings-action" type="button" data-native-history-action="delete" data-history-time="${t(_.visitedAt||"")}" data-profile-id="${t(_.profileId)}">Delete</button>
                        </div>
                      </article>
                    `).join("")}
              </div>
            `).join("")}
      </div>
    `:`<div class="native-settings-empty">${f?"No history matches your search.":"No history yet."}</div>`}function De(){return e.browserExtensionsCache.length?`
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
    `:'<div class="native-settings-empty">No extensions installed yet.</div>'}function Oe(){const f=e.credentialCache||{},T=[];return Object.entries(f).forEach(([k,_])=>{(_||[]).forEach((X,ee)=>{T.push({key:`${k}:${ee}`,profileId:k,domain:String(X.domain||"").toLowerCase(),username:String(X.username||""),password:String(X.password||"")})})}),`
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
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${Object.entries(Z).map(([k,_])=>`
        <label class="profile-pill-item" style="cursor: pointer;" data-profile-id="${t(k)}">
          <input type="radio" name="nativePasswordProfile" value="${t(k)}" ${k===(e.passwordProfileId||e.currentProfileId||"guest")?"checked":""} style="cursor: pointer;" />
          <span class="profile-pill-dot" style="background-color: ${t(_.color||"#000")}"></span>
          <span>${t(_.name||"")}</span>
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
              ${T.map(k=>`
                <div class="password-item" data-key="${t(k.key)}">
                  <div><strong>${t(k.domain)}</strong><div class="password-meta">${t(k.profileId)}</div></div>
                  <div>${t(k.username)}</div>
                  <div class="password-secret">${t(k.password)}</div>
                  <div class="password-actions">
                    <button type="button" class="password-action-btn" data-action="edit">Edit</button>
                    <button type="button" class="password-action-btn" data-action="delete">Delete</button>
                  </div>
                </div>
              `).join("")}
            </div>`}
      </section>
    `}async function ze(){if(window.api?.listProfileCredentials)try{const f=await window.api.listProfileCredentials();if(f&&Array.isArray(f.data)){const T={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};f.data.forEach(C=>{const k=String(C.profileId||"").toLowerCase();T[k]||(T[k]=[]),T[k].push(C)}),e.credentialCache=T}}catch(f){console.error("loadCredentialsIntoCache error:",f)}}function he(f){const T=document.getElementById("nativeTabContent");if(!T||!me(f))return;const C=oe(f.nativePage?.section);let k="",_="";const X=be(C);let ee="Manage app behavior without leaving the browser shell.";if(C==="downloads"){const K=e.managedDownloadsCache.length,re=e.managedDownloadsCache.filter(F=>F.state==="progressing").length;k=Ve(),ee=`${re} active, ${K} total downloads.`}else if(C==="history"){const K=Ae(),re=e.historySearchQuery.trim()?K.filter(F=>`${F.title||""} ${F.url||""} ${F.profileName||""}`.toLowerCase().includes(e.historySearchQuery.trim().toLowerCase())).length:K.length;_=`
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
      `,k=je(),ee=`${re} total history entries across all profiles.`}else if(C==="extensions"){const K=e.browserExtensionsCache.filter(re=>re.enabled!==!1).length;_=`
        <div class="native-settings-toolbar">
          ${q?'<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>':""}
        </div>
      `,k=De(),ee=`${K} enabled out of ${e.browserExtensionsCache.length} extensions.`}else C==="passwords"?(k=Oe(),ee="Manage saved passwords securely.",e._credentialsLoaded||(e._credentialsLoaded=!0,ze().then(()=>{he(f)}))):e._credentialsLoaded=!1;T.innerHTML=`
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${t(X)}</h2>
                <p>${t(ee)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions","history","downloads","passwords"].map(K=>{const re=Ce(K);return`
                    <button
                      type="button"
                      class="native-settings-chip ${K===C?"is-active":""}"
                      data-native-settings-nav="${K}"
                      title="${t(be(K))}${re?` (${re})`:""}"
                    >
                      <span>${t(be(K))}</span>
                      ${re?`<span class="native-settings-chip-shortcut">${t(re)}</span>`:""}
                    </button>
                  `}).join("")}
            </div>
            ${_}
          </div>
          <div class="native-settings-body">
            ${k}
          </div>
        </section>
      </div>
    `}async function Se(){const f=I();me(f)&&he(f)}function Me(f="extensions",T=e.activeTabId){const C=e.tabs.find(_=>_.id===T);if(!me(C))return;const k=oe(f);C.nativePage.section=k,A(C.id,be(k)),C.id===e.activeTabId&&he(C)}function ke(f="extensions"){const T=ae(f);if(T){H(T.id);return}N(null,null,be(f),null,{nativePage:_e("settings",f)})}function qe(){const f=document.getElementById("settingsBtn");f&&f.dataset.boundClick!=="1"&&(f.dataset.boundClick="1",f.addEventListener("click",()=>{ke("extensions")}))}function it(){const f=document.getElementById("nativeTabContent");if(!f||f.dataset.boundNativeSettings==="1")return;f.dataset.boundNativeSettings="1",window.addEventListener("credentials-updated",()=>{e._credentialsLoaded=!1;const C=I();me(C)&&C.nativePage?.section==="passwords"&&ze().then(()=>{he(C)})});const T=(C=null,k=null)=>{requestAnimationFrame(()=>{const _=document.getElementById("nativeHistorySearchInput");if(_&&(_.focus({preventScroll:!0}),Number.isInteger(C)&&Number.isInteger(k)&&typeof _.setSelectionRange=="function"))try{_.setSelectionRange(C,k)}catch{}})};f.addEventListener("click",async C=>{const k=C.target.closest(".password-visibility-toggle");if(k){C.preventDefault();const F=document.getElementById("nativePasswordSecretInput");if(F){const Q=F.type==="password";F.type=Q?"text":"password",k.textContent=Q?"🙈":"👁️"}return}const _=C.target.closest("[data-native-settings-nav]");if(_){Me(_.dataset.nativeSettingsNav||"extensions");return}const X=C.target.closest("[data-native-settings-action]");if(X){const F=String(X.dataset.nativeSettingsAction||"").trim();try{F==="check-updates"&&window.api?.checkForUpdates?(await window.api.checkForUpdates(),i("Update check started.","success")):F==="open-default-apps"&&window.api?.openDefaultAppSettings?await window.api.openDefaultAppSettings():F==="load-unpacked-extension"&&window.api?.addBrowserExtensionsUnpacked?(await window.api.addBrowserExtensionsUnpacked(),await h(),await Se(),i("Unpacked extensions loaded.","success")):F==="clear-history"&&(Object.keys(e.profileHistoryCache||{}).forEach(Q=>{e.profileHistoryCache[Q]=[]}),E(),he(I()))}catch(Q){i(Q?.message||"Could not complete settings action.","error")}return}const ee=C.target.closest("[data-native-download-action]");if(ee){try{const F=await window.api?.runManagedDownloadAction?.({id:String(ee.dataset.downloadId||"").trim(),action:String(ee.dataset.nativeDownloadAction||"").trim()});Array.isArray(F?.downloads)?e.managedDownloadsCache=F.downloads:await L(),await Se()}catch(F){i(F?.message||"Could not complete download action.","error")}return}const K=C.target.closest("[data-native-history-action]");if(K){const F=String(K.dataset.profileId||e.historyProfileId||e.currentProfileId),Q=String(K.dataset.historyTime||""),d=(e.profileHistoryCache[F]||[]).findIndex(S=>String(S.visitedAt||"")===Q),m=d>=0?(e.profileHistoryCache[F]||[])[d]:null;if(!m)return;if(K.dataset.nativeHistoryAction==="delete")e.profileHistoryCache[F].splice(d,1),E(),e.historyProfileId=F,he(I());else{const S=Z[F]?.partition||de.guest;N(m.url,S,m.title||"History",F)}return}const re=C.target.closest("[data-native-extension-action]");if(re){const F=String(re.dataset.nativeExtensionAction||"").trim(),Q=String(re.dataset.extensionPath||"").trim();try{F==="more"&&window.api?.getExtensionShortcutsInfo?await ve(Q):F==="reload"&&window.api?.reloadBrowserExtension?(await window.api.reloadBrowserExtension({path:Q}),i("Extension reloaded.","success")):(F==="enable"||F==="disable")&&window.api?.toggleBrowserExtension?(F==="disable"&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.toggleBrowserExtension({path:Q,enabled:F==="enable"})):F==="remove"&&window.api?.removeBrowserExtension&&(typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.removeBrowserExtension({path:Q})),await h(),await Se()}catch(d){i(d?.message||"Could not complete extension action.","error")}}}),f.addEventListener("input",C=>{const k=C.target.closest("#nativeHistorySearchInput");if(k){const X=Number.isInteger(k.selectionStart)?k.selectionStart:null,ee=Number.isInteger(k.selectionEnd)?k.selectionEnd:X;e.historySearchQuery=String(k.value||""),he(I()),T(X,ee);return}const _=C.target.closest("input[name='nativePasswordProfile']");if(_){e.passwordProfileId=String(_.value||"");return}}),f.addEventListener("submit",async C=>{const k=C.target.closest("#nativePasswordForm");if(!k)return;C.preventDefault();const _=document.getElementById("nativePasswordDomainInput"),X=document.getElementById("nativePasswordUsernameInput"),ee=document.getElementById("nativePasswordSecretInput");if(!_||!X||!ee)return;const K=String(_.value||"").trim().toLowerCase(),re=String(X.value||"").trim(),F=String(ee.value||""),Q=e.passwordProfileId||e.currentProfileId||"guest";if(!K||!re||!F){i("Please fill in all fields.","error");return}try{if(!window.api?.saveProfileCredential){i("Credential API unavailable.","error");return}const d=await window.api.saveProfileCredential({profileId:Q,domain:K,username:re,password:F});if(!d||!d.success){i("Failed to save credential.","error");return}await ze(),i("Credential saved successfully.","success"),k.reset(),he(I())}catch(d){i(d?.message||"Could not save credential.","error")}}),f.addEventListener("click",async C=>{const k=C.target.closest(".password-action-btn");if(!k)return;const _=String(k.dataset.action||"").trim(),X=k.closest(".password-item"),ee=String(X?.dataset.key||""),[K,re]=ee.split(":"),F=Number(re);if(!K||Number.isNaN(F))return;const d=((e.credentialCache||{})[K]||[])[F];if(d)try{if(_==="delete"){if(!window.api?.deleteProfileCredential){i("Credential API unavailable.","error");return}const m=await window.api.deleteProfileCredential({profileId:K,domain:String(d.domain||"").toLowerCase(),username:String(d.username||"")});if(!m||!m.success){i("Failed to delete credential.","error");return}await ze(),i("Credential deleted successfully.","success"),he(I())}else if(_==="edit"){const m=document.getElementById("nativePasswordDomainInput"),S=document.getElementById("nativePasswordUsernameInput"),B=document.getElementById("nativePasswordSecretInput"),D=document.getElementById("nativePasswordProfileSelect");if(!m||!S||!B)return;e.passwordProfileId=K,m.value=String(d.domain||"").toLowerCase(),S.value=String(d.username||""),B.value=String(d.password||""),D&&(D.innerHTML=Object.entries(Z||{}).map(([s,u])=>`
                <label class="profile-pill-item ${s===K?"active":""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${t(s)}" ${s===K?"checked":""} style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${t(u.color||"#000")}"></span>
                  <span>${t(u.name||"")}</span>
                </label>
              `).join(""),D.addEventListener("change",s=>{const u=s.target.value;u&&(e.passwordProfileId=u)})),document.getElementById("nativePasswordForm")?.scrollIntoView({behavior:"smooth"}),m.focus()}}catch(m){i(m?.message||"Could not complete password action.","error")}})}function Ze(){document.addEventListener("keydown",f=>{Qe(f.target)||f.ctrlKey&&((f.key==="H"||f.key==="h")&&!f.shiftKey?(f.preventDefault(),ke("history")):(f.key==="E"||f.key==="e")&&!f.shiftKey?(f.preventDefault(),ke("extensions")):(f.key==="D"||f.key==="d")&&f.shiftKey&&(f.preventDefault(),ke("downloads")))})}async function ve(f=""){const T=document.getElementById("extensionDetailsModal"),C=document.getElementById("extensionDetailsCloseBtn"),k=document.getElementById("extensionDetailsContent"),_=document.getElementById("extensionDetailsTitle");if(!(!T||!k))try{const X=await window.api?.getExtensionShortcutsInfo?.({path:f});if(!X?.success)k.innerHTML='<div class="extension-details-empty">Unable to load extension details.</div>';else{const{name:ee,shortcuts:K,errors:re,conflicts:F}=X;_.textContent=`${t(ee||"Extension")} Details`;let Q="";K&&K.length>0?Q=`
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
          `:Q=`
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
          `),k.innerHTML=`${Q}${d}${m}`}T.classList.remove("hidden"),C&&(C.onclick=()=>{T.classList.add("hidden")})}catch(X){console.error("Failed to load extension details:",X),k.innerHTML='<div class="extension-details-empty">Error loading extension details.</div>',T.classList.remove("hidden")}}return{bindSettingsShortcutsGlobal:Ze,createNativePageDescriptor:_e,ensureNativeSettingsGeneralInfo:nt,getSettingsTabTitle:be,getSettingsShortcut:Ce,initNativeSettingsUi:it,initSettingsMenu:qe,isEditableShortcutTarget:Qe,isNativeSettingsTab:me,normalizeSettingsSection:oe,openSettingsTab:ke,refreshActiveNativeSettingsPage:Se,renderNativeSettingsPage:he,updateNativeSettingsTabSection:Me}}function Li({state:e,constants:n,escapeHtml:t,showToast:i,openOverlayModal:r,closeOverlayModal:c,getActiveTab:g,getActiveWebview:x,createTab:P,refreshActiveNativeSettingsPage:L,closeSettingsMenu:h}){const{PROFILES:E,PENDING_EXTENSION_OPEN_STORAGE_KEY:I,EXTENSION_PIN_STORAGE_KEY:A}=n;let N=!1,H=null,j=null,Z={visible:!1,id:"",message:"",actionLabel:"",action:""},de={},q={entryPath:""},oe=!1;async function be(){if(!window.api?.listBrowserExtensions)return e.browserExtensionsCache=[],e.browserExtensionsCache;const s=await window.api.listBrowserExtensions(),u=Array.isArray(s?.entries)?s.entries:[];return e.browserExtensionsCache=u.map(w=>{const p=(w.id||"guest").toLowerCase(),y=n.APP_PROTOCOL_SCHEME||"oneview-dev",M=String(w.path||"").trim().replace(/\\/g,"/").replace(/\/+$/,""),U=`file:///${M}`,R=te=>{if(!te||!te.toLowerCase().startsWith("file://"))return te;const pe=te.replace(/\\/g,"/"),le=decodeURI(pe);let we=le.replace(U,"").replace(/^\/+/,"");if(we===le){const ce=`/${M.split("/").pop()}/`,G=le.indexOf(ce);G!==-1?we=le.slice(G+ce.length):we=""}const ie=w.manifest?.entrypoints?.root||w.manifest?.entrypoints?.page||"index.html";return`${y}://${p}/${we||ie}`};return{...w,rootUrl:R(w.rootUrl),optionsUrl:R(w.optionsUrl),popupUrl:R(w.popupUrl),sidePanelUrl:R(w.sidePanelUrl)}}),e.browserExtensionsCache}async function Ce(){let s="";try{s=String(sessionStorage.getItem(I)||"").trim()}catch{s=""}if(!s)return;try{sessionStorage.removeItem(I)}catch{}const u=e.browserExtensionsCache.find(w=>w.path===s);u&&await C(u.path,"tab")}function Qe(){try{const s=JSON.parse(localStorage.getItem(A)||"{}");de=s&&typeof s=="object"&&!Array.isArray(s)?s:{}}catch{de={}}}function _e(){try{localStorage.setItem(A,JSON.stringify(de||{}))}catch{}}function ae(){return g()?.partition||E[e.currentProfileId]?.partition||E.guest.partition}function me(){const s=g(),u=x();return{url:String(u?.getURL?.()||s?.url||"").trim(),title:String(u?.getTitle?.()||s?.title||"").trim()}}function nt(s={}){return String(s?.name||s?.actionTitle||"EX").trim().split(/\s+/).slice(0,2).map(w=>w.charAt(0)).join("").toUpperCase()}function Ae(s={}){return String(s?.actionTitle||s?.name||"Extension").trim()}function Ee(s={},u=""){const w=String(s?.path||"").trim(),p=String(u||"").trim().replace(/\\/g,"/");if(!w||!p)return"";const y=w.replace(/\\/g,"/").replace(/\/+$/,""),M=p.replace(/^\/+/,""),U=`${y}/${M}`;return`file:///${encodeURI(U.replace(/^([A-Za-z]):/,"$1:"))}`}function Ie(s={}){return de[String(s?.path||"").trim()]===!0}function Ve(s={}){const u=(s?.id||"guest").toLowerCase(),w=s?.manifest?.entrypoints?.root||s?.manifest?.entrypoints?.page||"index.html";return`${n.APP_PROTOCOL_SCHEME}://${u}/${w}`}function je(s={},u=""){const w=String(s?.actionIconFileUrl||Ee(s,s?.actionIconPath||"")||s?.actionIconUrl||"").trim(),p=t(nt(s));return w?`<img src="${t(w)}" alt="" />`:`<span class="${u}">${p}</span>`}function De(s=0){const u=Number(s||0);return u>=1024*1024*1024?`${(u/(1024*1024*1024)).toFixed(1)} GB`:u>=1024*1024?`${(u/(1024*1024)).toFixed(1)} MB`:u>=1024?`${(u/1024).toFixed(1)} KB`:`${Math.max(0,Math.round(u))} B`}function Oe(s=0){const u=Number(s||0);return u<=0?"":`${De(u)}/s`}function ze(s=null){const u=Number(s);if(!Number.isFinite(u)||u<0)return"";if(u<60)return`${Math.round(u)}s left`;const w=Math.floor(u/60),p=Math.round(u%60);return`${w}m ${p}s left`}function he(s=""){return e.managedDownloadsCache.find(u=>u.id===s)||null}function Se(){const s=document.getElementById("downloadsManagerBtn");s&&(s.classList.remove("has-download-highlight"),s.offsetWidth,s.classList.add("has-download-highlight"),H&&clearTimeout(H),H=setTimeout(()=>{s.classList.remove("has-download-highlight")},2300))}async function Me(){if(!window.api?.listManagedDownloads)return e.managedDownloadsCache=[],e.managedDownloadsCache;const s=await window.api.listManagedDownloads();return e.managedDownloadsCache=Array.isArray(s?.downloads)?s.downloads:[],e.managedDownloadsCache}function ke(){const s=document.getElementById("downloadsManagerPanel"),u=document.getElementById("downloadsManagerBtn");s&&!s.classList.contains("hidden")&&(N?c(()=>s.classList.add("hidden")):s.classList.add("hidden")),N=!1,u&&u.classList.remove("is-active")}function qe(){const s=document.getElementById("downloadsManagerPanel"),u=document.getElementById("downloadsManagerBadge");if(!s)return;const w=e.managedDownloadsCache.filter(p=>p.state==="progressing"||p.state==="interrupted").length;u&&(w>0?(u.textContent=String(w),u.classList.remove("hidden")):(u.textContent="",u.classList.add("hidden"))),s.innerHTML=`
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${e.managedDownloadsCache.length?e.managedDownloadsCache.map(p=>{const y=t(p.fileName||"Download"),M=String(p.state||"progressing"),U=typeof p.progress=="number"?Math.max(0,Math.min(100,p.progress)):0,R=p.totalBytes>0?`${De(p.receivedBytes)} / ${De(p.totalBytes)}`:De(p.receivedBytes),te=Oe(p.bytesPerSecond),pe=ze(p.etaSeconds),le=M==="completed"?"Completed":M==="cancelled"?"Cancelled":M==="interrupted"?"Interrupted":p.paused?"Paused":`Downloading ${U}%`,we=[te,pe].filter(Boolean).join(" • ");return`
                    <div class="downloads-manager-item">
                      <strong>${y}</strong>
                      <div class="downloads-manager-meta">${t(le)} • ${t(R)}</div>
                      ${we?`<div class="downloads-manager-meta">${t(we)}</div>`:""}
                      <div class="downloads-manager-progress">
                        <span style="width:${U}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${M==="progressing"?p.paused?`<button type="button" data-download-id="${t(p.id)}" data-download-action="resume">Resume</button>`:`<button type="button" data-download-id="${t(p.id)}" data-download-action="pause">Pause</button>`:""}
                        ${M==="progressing"||M==="interrupted"?`<button type="button" data-download-id="${t(p.id)}" data-download-action="cancel">Cancel</button>`:""}
                        ${M==="interrupted"||M==="cancelled"?`<button type="button" data-download-id="${t(p.id)}" data-download-action="retry">Retry</button>`:""}
                        ${p.savePath?`<button type="button" data-download-id="${t(p.id)}" data-download-action="show">Show in Folder</button>`:""}
                        ${M==="completed"&&p.existsOnDisk?`<button type="button" data-download-id="${t(p.id)}" data-download-action="open">Open</button>`:""}
                        <button type="button" data-download-id="${t(p.id)}" data-download-action="remove">Remove</button>
                      </div>
                    </div>
                  `}).join(""):'<div class="downloads-manager-empty">No downloads yet.</div>'}
      </div>
    `}async function it(s=null){const u=document.getElementById("downloadsManagerPanel"),w=document.getElementById("downloadsManagerBtn");if(!u||!w)return;if(!(s===null?u.classList.contains("hidden"):!!s)){ke();return}f(),qe();try{await r(()=>u.classList.remove("hidden"),{captureSnapshots:!1}),N=!0}catch{u.classList.remove("hidden"),N=!1}w.classList.add("is-active")}function Ze(){let s=document.getElementById("downloadsShelf");s||(s=document.createElement("div"),s.id="downloadsShelf",s.className="downloads-shelf hidden",s.innerHTML=`
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `,document.body.appendChild(s),s.querySelector("#downloadsShelfClose")?.addEventListener("click",()=>{Z.visible=!1,Ze()}),s.querySelector("#downloadsShelfAction")?.addEventListener("click",async()=>{const y=he(Z.id);!y||!Z.action||!window.api?.runManagedDownloadAction||await window.api.runManagedDownloadAction({id:y.id,action:Z.action})}));const u=s.querySelector("#downloadsShelfTitle"),w=s.querySelector("#downloadsShelfMessage"),p=s.querySelector("#downloadsShelfAction");if(!Z.visible){s.classList.add("hidden");return}u&&(u.textContent="Downloads"),w&&(w.textContent=Z.message||""),p&&(p.textContent=Z.actionLabel||"Open",p.style.display=Z.action?"":"none"),s.classList.remove("hidden")}function ve(s={},u="updated"){const w=String(s.fileName||"Download").trim()||"Download";if(u==="created")Z={visible:!0,id:String(s.id||""),message:`${w} started downloading`,actionLabel:"Show",action:"show"};else if(u==="completed")Z={visible:!0,id:String(s.id||""),message:`${w} downloaded`,actionLabel:"Open",action:"open"};else if(u==="interrupted")Z={visible:!0,id:String(s.id||""),message:`${w} was interrupted`,actionLabel:"Retry",action:"retry"};else return;Ze(),j&&clearTimeout(j),j=setTimeout(()=>{Z.visible=!1,Ze()},5e3)}function f(){const s=document.getElementById("browserExtensionsMenu"),u=document.getElementById("browserExtensionsMenuBtn");s&&!s.classList.contains("hidden")&&(oe?c(()=>s.classList.add("hidden")):s.classList.add("hidden")),oe=!1,u&&u.classList.remove("is-active")}async function T(s=null){const u=document.getElementById("browserExtensionsMenu"),w=document.getElementById("browserExtensionsMenuBtn");if(!u||!w)return;if(!(s===null?u.classList.contains("hidden"):!!s)){f();return}k().catch(()=>{}),re();try{await r(()=>u.classList.remove("hidden"),{captureSnapshots:!1}),oe=!0}catch(y){console.error("Failed to open extensions menu overlay",y),u.classList.remove("hidden"),oe=!1}w.classList.add("is-active")}async function C(s,u="tab"){const w=e.browserExtensionsCache.find(U=>U.path===s);if(!w)return;const p=(w?.id||"guest").toLowerCase();let y="";if(u==="options"&&w.optionsUrl){const U=w.manifest?.entrypoints?.options||"options.html";y=`${n.APP_PROTOCOL_SCHEME}://${p}/${U}`}else if(u==="root"&&w.rootUrl){const U=w.manifest?.entrypoints?.root||"result.html";y=`${n.APP_PROTOCOL_SCHEME}://${p}/${U}`}else y=Ve(w);if(!y){i("This extension does not expose an openable page yet.","info");return}const M=`ext-${w.id||"guest"}`;P(y,M,`${w.name||"Extension"}${u==="options"?" Options":""}`,null,{extensionEntryPath:w.path,extensionActiveContext:me()})}async function k(){if(window.api?.closeBrowserExtensionPopup)try{await window.api.closeBrowserExtensionPopup()}catch{}q={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(s=>s.classList.remove("is-active"))}function _(s={}){const u=document.getElementById("browserExtensionPopupTitle"),w=document.getElementById("browserExtensionPopupSubtitle"),p=document.getElementById("browserExtensionPopupIcon");u&&(u.textContent=Ae(s)),w&&(w.textContent=s?.popupUrl?"Popup":s?.optionsUrl?"Extension page":s?.rootUrl?"Extension":""),p&&(p.innerHTML=je(s,"browser-extension-popup-fallback"))}function X(s){if(!s||typeof s.getBoundingClientRect!="function")return{left:0,top:0,bottom:0,width:0,height:0};const u=s.getBoundingClientRect();return{left:Number(u.left||0),top:Number(u.top||0),bottom:Number(u.bottom||0),width:Number(u.width||0),height:Number(u.height||0)}}async function ee(s,u=null){const w=e.browserExtensionsCache.find(pe=>pe.path===s);if(!w)return;const p=String(w.popupUrl||"").trim()||String(w.optionsUrl||"").trim();if(!p){await C(s,"tab");return}if(q.entryPath===s){await k();return}await k(),f();const y=window.api?.openBrowserExtensionPopup;if(typeof y!="function")throw new Error("Extension popup API is unavailable");const M=me(),U=`ext-${w.id||"guest"}`,R=await y({url:p,entryPath:s,partition:U,anchor:X(u),activeUrl:M.url||"",activeTitle:M.title||""});if(!R?.success)throw new Error(R?.message||"Could not open extension popup");_(w),q={entryPath:s,pageType:"popup",host:null,overlayActive:!1};const te=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(s):s.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${te}"]`).forEach(pe=>pe.classList.add("is-active"))}function K(){const s=document.getElementById("browserExtensionsPinned");if(!s)return;const u=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(y=>{const M=y.id==="sitesnap-studio"||String(y.name||"").toLowerCase().includes("sitesnap")||String(y.id||"").toLowerCase().includes("sitesnap");return u?y.enabled!==!1&&M:y.enabled!==!1&&!M}),p=u?w:w.filter(y=>Ie(y));if(!p.length){s.innerHTML="",s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=p.map(y=>`
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${t(y.path||"")}"
            title="${t(Ae(y))}"
            aria-label="${t(Ae(y))}"
          >
            ${je(y,"browser-extension-action-fallback")}
          </button>
        `).join("")}function re(){const s=document.getElementById("browserExtensionsMenu");if(!s)return;const u=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(p=>{const y=p.id==="sitesnap-studio"||String(p.name||"").toLowerCase().includes("sitesnap")||String(p.id||"").toLowerCase().includes("sitesnap");return u?p.enabled!==!1&&y:p.enabled!==!1&&!y});s.innerHTML=`
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${w.length?w.map(p=>{const y=t(p.path||""),M=t(Ae(p)),U=t(p.version?`v${p.version}${p.id?` • ${p.id}`:""}`:p.id||p.name||"");return`
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${je(p,"browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${M}</strong>
                          <p>${U}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${y}"
                          title="${Ie(p)?"Unpin":"Pin"}"
                          aria-label="${Ie(p)?"Unpin":"Pin"}"
                        >
                          ${Ie(p)?"Unpin":"Pin"}
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
    `}function F(){K(),re()}function Q(){const s=document.getElementById("extensionsManagerList");if(!s)return;const u=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(p=>{const y=p.id==="sitesnap-studio"||String(p.name||"").toLowerCase().includes("sitesnap")||String(p.id||"").toLowerCase().includes("sitesnap");return u?y:!y});if(!w.length){s.innerHTML=`
        <div class="extensions-empty-state">
          No unpacked extensions added yet.
        </div>
      `;return}s.innerHTML=w.map(p=>{const y=t(p.path||"");return`
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
              ${n.IS_DEV_APP_BUILD?`<div class="extension-path">${y}</div>`:""}
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
              ${n.IS_DEV_APP_BUILD?`<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${y}">Remove</button>`:""}
            </div>
          </div>
        `}).join("")}async function d(){try{await be()}catch(s){console.error("Failed to refresh browser extensions list",s)}Q(),F()}async function m(s,u){const w=e.browserExtensionsCache.find(y=>y.path===s);if(!w)return;const p=u==="options"?w.optionsUrl:u==="root"?w.rootUrl:Ve(w);if(!p){i(`This extension does not expose a ${u} page.`,"info");return}P(p,ae(),`${w.name||"Extension"} ${u==="options"?"Options":"Popup"}`,null,{extensionEntryPath:w.path,extensionActiveContext:me()})}async function S(){const s=document.getElementById("extensionsManagerModal");if(s){f(),await k(),Q(),F();try{await r(()=>s.classList.remove("hidden"))}catch(u){console.error("openOverlayModal failed for extensions manager",u),s.classList.remove("hidden")}d().catch(u=>{console.error("Failed to refresh extensions manager after open",u)})}}function B(){const s=document.getElementById("extensionsManagerModal");s&&c(()=>s.classList.add("hidden"))}function D(){const s=document.getElementById("extensionsBtn"),u=document.getElementById("settingsBtn"),w=document.getElementById("extensionsModalCloseBtn"),p=document.getElementById("extensionsLoadBtn"),y=document.getElementById("extensionsManagerList"),M=document.getElementById("browserExtensionsPinned"),U=document.getElementById("browserExtensionsMenuBtn"),R=document.getElementById("browserExtensionsMenu"),te=document.getElementById("downloadsManagerBtn"),pe=document.getElementById("downloadsManagerPanel"),le=document.getElementById("browserExtensionPopupClose"),we=document.getElementById("browserExtensionPopupOpenTab");Qe(),Q(),F(),d().catch(ie=>{console.error("Failed to refresh extensions manager after open",ie)}),be().then(()=>{if(Ce(),window.api?.prewarmBrowserExtensionPopup){const Y=e.browserExtensionsCache.filter(G=>G.enabled!==!1).filter(G=>Ie(G));let ce={partition:ae()};if(Y.length>0){const G=Y[0],fe=String(G.popupUrl||"").trim()||String(G.optionsUrl||"").trim();fe&&(ce={...ce,url:fe,entryPath:G.path})}window.api.prewarmBrowserExtensionPopup(ce).catch(()=>{})}}).catch(()=>{}),window.api?.onBrowserExtensionPopupState&&window.api.onBrowserExtensionPopupState(ie=>{const{entryPath:Y,open:ce}=ie||{};if(ce){q={entryPath:Y,pageType:"popup",host:null,overlayActive:!1};const G=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(Y):Y.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${G}"]`).forEach(fe=>fe.classList.add("is-active"))}else q.entryPath===Y&&(q={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(G=>G.classList.remove("is-active")))}),s&&s.dataset.boundClick!=="1"&&(s.dataset.boundClick="1",s.addEventListener("click",()=>{S().catch(ie=>{console.error("Failed to open extensions manager",ie),i("Could not open extensions manager.","error")})})),w&&w.dataset.boundClick!=="1"&&(w.dataset.boundClick="1",w.addEventListener("click",B)),p&&p.dataset.boundClick!=="1"&&(p.dataset.boundClick="1",p.addEventListener("click",async()=>{try{if(!window.api?.addBrowserExtensionsUnpacked){i("Extension manager API is unavailable.","error");return}const ie=await window.api.addBrowserExtensionsUnpacked();e.browserExtensionsCache=Array.isArray(ie?.entries)?ie.entries:[],Q(),F(),i("Unpacked extensions loaded.","success")}catch(ie){console.error("Failed to load unpacked extensions",ie),i(ie?.message||"Could not load unpacked extensions.","error")}})),y&&y.dataset.boundClick!=="1"&&(y.dataset.boundClick="1",y.addEventListener("click",async ie=>{const Y=ie.target.closest("[data-action]");if(!Y)return;const ce=String(Y.dataset.action||"").trim(),G=String(Y.dataset.path||"").trim();if(G)try{if(ce==="open-popup"){await m(G,"popup");return}if(ce==="open-tab"){await m(G,"tab");return}if(ce==="open-options"){await m(G,"options");return}if(ce==="reload"&&window.api?.reloadBrowserExtension){const fe=await window.api.reloadBrowserExtension({path:G});e.browserExtensionsCache=Array.isArray(fe?.entries)?fe.entries:e.browserExtensionsCache,Q(),F(),i("Extension reloaded.","success");return}if(ce==="toggle"&&window.api?.toggleBrowserExtension){const fe=e.browserExtensionsCache.find(dt=>dt.path===G);fe?.enabled!==!1&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const ct=await window.api.toggleBrowserExtension({path:G,enabled:fe?.enabled===!1});e.browserExtensionsCache=Array.isArray(ct?.entries)?ct.entries:e.browserExtensionsCache,Q(),F(),i("Extension state updated.","success");return}if(ce==="remove"&&window.api?.removeBrowserExtension){typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const fe=await window.api.removeBrowserExtension({path:G});e.browserExtensionsCache=Array.isArray(fe?.entries)?fe.entries:e.browserExtensionsCache,Q(),F(),i("Extension removed.","success")}}catch(fe){console.error("Extension manager action failed",fe),i(fe?.message||"Could not complete extension action.","error")}})),M&&M.dataset.boundClick!=="1"&&(M.dataset.boundClick="1",M.addEventListener("click",async ie=>{const Y=ie.target.closest("[data-path]");if(!Y)return;const ce=String(Y.dataset.path||"").trim();if(ce)try{await ee(ce,Y)}catch(G){console.error("Failed to open extension popup",G),i(G?.message||"Could not open extension popup.","error")}})),U&&U.dataset.boundClick!=="1"&&(U.dataset.boundClick="1",U.addEventListener("click",()=>{T().catch(ie=>{console.error("Failed to toggle extensions menu",ie),i("Could not open extensions menu.","error")})})),R&&R.dataset.boundClick!=="1"&&(R.dataset.boundClick="1",R.addEventListener("click",async ie=>{const Y=ie.target.closest("[data-menu-action]");if(!Y)return;const ce=String(Y.dataset.menuAction||"").trim(),G=String(Y.dataset.path||"").trim();try{if(ce==="manage"){f(),await S();return}if(!G)return;if(ce==="pin"){const fe=!de[G];de[G]=fe,_e(),F();return}if(ce==="popup"){await ee(G,U||Y);return}if(ce==="options"){f(),await C(G,"options");return}ce==="tab"&&(f(),await C(G,"tab"))}catch(fe){console.error("Extension menu action failed",fe),i(fe?.message||"Could not complete extension action.","error")}})),le&&le.dataset.boundClick!=="1"&&(le.dataset.boundClick="1",le.addEventListener("click",()=>{k().catch(()=>{})})),we&&we.dataset.boundClick!=="1"&&(we.dataset.boundClick="1",we.addEventListener("click",async()=>{q.entryPath&&(await C(q.entryPath,"tab"),await k())})),document.body&&document.body.dataset.boundExtensionUiDismiss!=="1"&&(document.body.dataset.boundExtensionUiDismiss="1",document.addEventListener("click",ie=>{const Y=ie.target;u&&!u.contains(Y)&&h(),R&&!R.classList.contains("hidden")&&!R.contains(Y)&&!U?.contains(Y)&&!s?.contains(Y)&&f(),pe&&!pe.classList.contains("hidden")&&!pe.contains(Y)&&!te?.contains(Y)&&ke(),!Y.closest(".browser-extension-action-btn")&&!R?.contains(Y)&&k().catch(()=>{})}),document.addEventListener("keydown",ie=>{ie.key==="Escape"&&(h(),f(),ke(),k().catch(()=>{}))}))}function W(){const s=document.getElementById("downloadsManagerBtn"),u=document.getElementById("downloadsManagerPanel");s&&s.dataset.boundClick!=="1"&&(s.dataset.boundClick="1",s.addEventListener("click",()=>{it().catch(()=>{})})),u&&u.dataset.boundClick!=="1"&&(u.dataset.boundClick="1",u.addEventListener("click",async w=>{const p=w.target.closest("[data-download-action]");if(!p)return;const y=String(p.dataset.downloadAction||"").trim(),M=String(p.dataset.downloadId||"").trim();if(y)try{if(!window.api?.runManagedDownloadAction)return;const U=await window.api.runManagedDownloadAction({id:M,action:y});Array.isArray(U?.downloads)?e.managedDownloadsCache=U.downloads:(y==="remove"||y==="clear-completed")&&await Me(),qe()}catch(U){i(U?.message||"Could not complete download action.","error")}})),Me().then(()=>{qe()}).catch(()=>{}),window.api&&typeof window.api.onDownloadManagerUpdated=="function"&&document.body?.dataset.boundDownloadManagerEvents!=="1"&&(document.body.dataset.boundDownloadManagerEvents="1",window.api.onDownloadManagerUpdated(w=>{e.managedDownloadsCache=Array.isArray(w?.downloads)?w.downloads:[],qe(),L().catch(()=>{}),(w?.reason==="created"||w?.reason==="completed"||w?.reason==="interrupted")&&Se();const p=he(String(w?.focusId||"").trim());p&&ve(p,String(w?.reason||"updated"))}))}return{closeBrowserExtensionPopup:k,closeBrowserExtensionsMenu:f,closeDownloadsManagerPanel:ke,formatDownloadBytes:De,formatDownloadEta:ze,formatDownloadSpeed:Oe,initDownloadsManager:W,initExtensionsManager:D,loadManagedDownloadsFromMain:Me,refreshBrowserExtensionsUi:F,refreshExtensionsManagerList:d}}function Pi({state:e,constants:n,showToast:t,openOverlayModal:i,closeOverlayModal:r,renderProfilePillSelect:c,resolveCredentialScopeIdForTab:g,applyProfileSelection:x,getCurrentProfileId:P,escapeHtml:L}){const{AUTH_GATEWAY_HOSTS:h,RESOURCE_SERVICE_ORIGIN:E}=n,I=()=>e.activeTabId,A=()=>e.credentialCache,N=d=>{e.credentialCache=d},H=()=>e.activeHttpAuthChallenge,j=d=>{e.activeHttpAuthChallenge=d},Z=()=>e.credentialCacheRefreshedAt,de=d=>{e.credentialCacheRefreshedAt=d},q=()=>e.credentialCacheRefreshInFlight,oe=d=>{e.credentialCacheRefreshInFlight=d},be=new Map;function Ce(){return{wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]}}function Qe(){return Object.keys(Ce())}function _e(){return!!(window.api&&typeof window.api.listProfileCredentials=="function"&&typeof window.api.saveProfileCredential=="function"&&typeof window.api.deleteProfileCredential=="function")}function ae(d=""){const m=String(d).trim().toLowerCase();if(!m)return"";try{const W=new URL(m),s=String(W.hostname||"").trim().toLowerCase().replace(/^www\./,""),u=String(W.port||"").trim();return s?!u||u==="80"||u==="443"?s:`${s}:${u}`:""}catch{}const S=m.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];if(!S)return"";const B=S.lastIndexOf(":");if(B<=0)return S;const D=S.slice(B+1);return/^\d+$/.test(D)&&D!=="80"&&D!=="443"?S:S.slice(0,B)}function me(d=""){const m=String(d||"").trim().toLowerCase();if(!m)return"";const S=m.lastIndexOf(":");if(S<=0)return m;const B=m.slice(S+1);return/^\d+$/.test(B)?m.slice(0,S):m}function nt(d=""){const m=[];try{const S=new URL(String(d||"")),B=(W="")=>{if(W)try{const s=new URL(String(W)),u=ae(s.host||s.hostname||"");u&&m.push(u)}catch{const u=ae(String(W||""));u&&m.push(u)}};B(S.host||S.hostname||""),["retURL","retUrl","returnUrl","TargetResource","targetResource","PartnerSpId","partnerSpId"].forEach(W=>{B(S.searchParams.get(W)||"")})}catch{}return[...new Set(m.filter(Boolean))]}function Ae(d=""){const m=nt(d);if(m.length===0)return ae(d);const S=m[0]||"";if(h.has(S)){const B=m.find(D=>D&&!h.has(D));if(B)return B}return S}function Ee(d=""){return h.has(ae(d))}function Ie(d=""){const m=me(ae(d));return m.endsWith(".veevavault.com")||m==="veevavault.com"||m.endsWith(".gskinternet.com")||m==="gskinternet.com"||m.endsWith(".gskpro.com")||m==="gskpro.com"}function Ve(d,m,S=""){const B=String(m||"").trim().toLowerCase(),D=ae(S);if(!d||!B)return null;const W=(A()[d]||[]).filter(s=>{const u=ae(s.domain);return u&&u!==D&&!Ee(u)&&Ie(u)&&String(s.username||"").trim().toLowerCase()===B});return W.sort((s,u)=>ae(u.domain).length-ae(s.domain).length),W[0]||null}function je(d=""){const m=String(d||"").trim();return/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(m)?"":m}async function De(){if(!window.api?.deleteProfileCredential)return;const d=[];Qe().forEach(m=>{(A()[m]||[]).forEach(S=>{const B=ae(S.domain);!Ee(B)||!Ve(m,S.username,B)||d.push({profileId:m,domain:B,username:String(S.username||"").trim()})})}),d.length!==0&&(await Promise.allSettled(d.map(m=>window.api.deleteProfileCredential(m))),d.forEach(m=>{const S=A()[m.profileId]||[];A()[m.profileId]=S.filter(B=>!(ae(B.domain)===m.domain&&String(B.username||"").trim().toLowerCase()===m.username.toLowerCase()))}))}async function Oe(){if(!_e())return N(Ce()),A();try{const d=await window.api.listProfileCredentials();if(!d||!d.success||!Array.isArray(d.data))return N(Ce()),A();const m=Ce();return d.data.forEach(S=>{const B=String(S.profileId||"").toLowerCase();m[B]&&m[B].push({profileId:B,domain:ae(S.domain),username:String(S.username||""),password:String(S.password||"")})}),N(m),await De(),A()}catch{return N(Ce()),A()}}async function ze(d=15e3){if(!_e()||Date.now()-Z()<d)return A();if(q())return q();const S=Oe().then(B=>(de(Date.now()),B)).finally(()=>{oe(null)});return oe(S),S}function he(d){return d?(d.credentialHintsByDomain||(d.credentialHintsByDomain={}),d.credentialHintsByDomain):{}}function Se(d="",m=""){const S=`${String(d||"").toLowerCase()} ${String(m||"").toLowerCase()}`;if(/login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(S))return!0;try{const B=new URL(String(d||""));if(E&&B.origin.toLowerCase()===E){const W=String(B.pathname||"/").toLowerCase(),s=String(m||"").toLowerCase();if((W==="/"||W==="/login"||W==="/signin")&&s.includes("synapse"))return!0}const D=`${B.pathname.toLowerCase()} ${B.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(D)}catch{return!1}}function Me(d=""){let m="";try{m=new URL(String(d||"")).hostname.toLowerCase()}catch{return!1}return m==="10.215.56.196"||m.endsWith(".gskinternet.com")||m.endsWith(".gskpro.com")||m.endsWith(".veevavault.com")||m.endsWith(".okta.com")||m.endsWith(".oktacdn.com")||m.endsWith(".pingone.com")}function ke(d="",m="",S=null){return!_e()||!S?!1:S.launchedAppType==="website"||!S.launchedAppType?Se(d,m)||Me(d):!0}function qe(d,m=""){if(!d)return null;const S=nt(m);if(S.length===0)return null;const B=A()[d]||[];let D=null,W=-1;return B.forEach(s=>{const u=ae(s.domain);if(!u)return;const w=S.reduce((p,y)=>{if(!y)return p;if(y===u)return Math.max(p,1e3);if(me(y)===me(u))return Math.max(p,900);if(y.endsWith(`.${u}`)||u.endsWith(`.${y}`))return Math.max(p,500);const M=me(y),U=me(u);if(M.endsWith(`.${U}`)||U.endsWith(`.${M}`))return Math.max(p,450);const R=M.split(".").reverse(),te=U.split(".").reverse();let pe=0;for(let le=0;le<Math.min(R.length,te.length)&&R[le]===te[le];le+=1)pe+=1;return Math.max(p,pe>1?pe:-1)},-1);w<0||(!D||w>W||w===W&&u.length>ae(D.domain).length)&&(D=s,W=w)}),D}function it(d,m="",S=null){const B=A()[d]||[];if(B.length===0)return null;let D="";try{D=ae(m)}catch{D=""}const W=he(S),s=Object.values(W||{}).map(U=>String(U||"").trim()).filter(Boolean),u=String(S?.lastUsernameHint||"").trim()||s[s.length-1]||"";if(D&&Ee(D)&&u){const U=Ve(d,u,D);if(U)return U}const w=qe(d,m);if(w&&!Ee(w.domain))return w;if(!u)return null;const p=B.filter(U=>String(U.username||"").trim().toLowerCase()===u.toLowerCase());if(p.length===1)return w&&!Ee(p[0].domain)?w:p[0];if(p.length===0)return null;const y=D;if(!y)return p[0];const M=U=>{const R=ae(U);if(!R)return-1;if(Ee(R)&&Ie(y))return-100;if(Ee(y)&&!Ee(R))return 800+(Ie(R)?50:0);if(y===R)return 1e3;if(me(y)===me(R))return 900;if(y.endsWith(`.${R}`)||R.endsWith(`.${y}`))return 500;const te=me(y),pe=me(R);if(te.endsWith(`.${pe}`)||pe.endsWith(`.${te}`))return 450;const le=te.split(".").reverse(),we=pe.split(".").reverse();let ie=0;for(let Y=0;Y<Math.min(le.length,we.length)&&le[Y]===we[Y];Y+=1)ie+=1;return ie};return p.sort((U,R)=>M(R.domain)-M(U.domain)),p[0]||null}function Ze(d,m="",S=null){const B=it(d,m,S);if(B)return{...B,profileId:String(B.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};const D=A()[d]||[];if(D.length===1)return{...D[0],profileId:String(D[0]?.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};let W="";try{W=ae(m)}catch{W=""}if(!W||D.length===0)return null;const s=p=>{const y=ae(p);if(!y)return-1;if(Ee(W)&&!Ee(y))return 800+(Ie(y)?50:0);if(Ee(y)&&Ie(W))return-100;if(W===y)return 1e3;if(me(W)===me(y))return 900;if(W.endsWith(`.${y}`)||y.endsWith(`.${W}`))return 500;const M=me(W),U=me(y);if(M.endsWith(`.${U}`)||U.endsWith(`.${M}`))return 450;const R=M.split(".").reverse(),te=U.split(".").reverse();let pe=0;for(let le=0;le<Math.min(R.length,te.length)&&R[le]===te[le];le+=1)pe+=1;return pe},w=[...D].sort((p,y)=>s(y.domain)-s(p.domain))[0]||null;return w?{...w,profileId:String(w.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()}:null}async function ve(d,m){if(!d||!m)return;const S=String(m.username||""),B=String(m.password||"");if(!B)return!1;const D=`
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
    `;try{return await d.executeJavaScript(D,!0),!0}catch{return!1}}function f(d,m){if(!d||!m)return;d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);let S=0;const B=async()=>{if(S+=1,!(typeof d.isDestroyed=="function"?d.isDestroyed():!1)&&d.id===`webview-${I()}`){try{if(await d.executeJavaScript("Boolean(window.__oneviewManualCredentialEditAt)",!0)){d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);return}}catch{}await ve(d,m),S<6&&(d._oneviewAutofillTimer=setTimeout(B,1e3))}};B()}async function T(d){if(!d)return null;try{const m=await d.executeJavaScript(`
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
        `,!0)}catch{}}async function k(d){if(!d)return null;try{const m=await d.executeJavaScript(`
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
        `,!0);return m&&(m.username||m.password)?m:null}catch{return null}}async function _(d,m){if(!_e()||!d||!m||m.id!==I()||!m.credentialAutomationEnabled)return;String(d.getURL?.()||m.url||"");const S=await k(d),B=S?null:await T(d),D=S||B;if(!D)return;const W=String(D.trigger||""),u=String(D.activeInputType||"").toLowerCase()==="password";if(S&&W==="input"&&u||!S&&u)return;const p=g(m),y=String(D.url||d.getURL()||""),M=Ae(y),U=he(m);let R=je(D.username);const te=String(D.password||"");if(!p||!M)return;const pe=/^\d{4,8}$/.test(te),le=/authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(y.toLowerCase());if(D.otpLike||le&&pe)return;const we=String(U[M]||"").trim()||String(m.lastUsernameHint||"").trim(),ie=!!R&&!!te&&R.toLowerCase()===te.toLowerCase();R&&!ie?(U[M]=R,m.lastUsernameHint=R):U[M]?R=U[M]:m.lastUsernameHint&&(R=String(m.lastUsernameHint||"").trim());const Y=we||String(U[M]||"").trim()||String(m.lastUsernameHint||"").trim(),ce=!!R&&!!te&&R.toLowerCase()===te.toLowerCase();if(ce&&Y&&Y!==R&&(R=Y),!R||!te||ce&&(!Y||Y.toLowerCase()===R.toLowerCase()))return;const G=`${p}|${M}|${R}`,fe=Date.now(),ct=be.get(G)||0;if(fe-ct<15e3)return;if(be.set(G,fe),await Oe(),Ee(M)&&Ve(p,R,M)){(A()[p]||[]).find(Et=>ae(Et.domain)===M&&String(Et.username||"").trim().toLowerCase()===R.toLowerCase())&&window.api?.deleteProfileCredential&&(await window.api.deleteProfileCredential({profileId:p,domain:M,username:R}),await Oe());return}const dt=(A()[p]||[]).find(et=>ae(et.domain)===M&&String(et.username||"").trim().toLowerCase()===R.toLowerCase());if(!(dt&&String(dt.password||"")===te))try{if(!(await window.api.saveProfileCredential({profileId:p,domain:M,username:R,password:te}))?.success)return;await Oe()}catch(et){console.warn("Could not save remembered credential:",et)}}function X(d,m){!d||!m||d._oneviewCredentialPollId||(d._oneviewCredentialPollId=setInterval(()=>{if(typeof d.isDestroyed=="function"?d.isDestroyed():!1){clearInterval(d._oneviewCredentialPollId),d._oneviewCredentialPollId=null;return}m.id===I()&&_(d,m)},3e3))}async function ee(d=!1){const m=document.getElementById("httpAuthModal"),S=document.getElementById("httpAuthForm"),B=H();m&&!m.classList.contains("hidden")&&r(()=>m.classList.add("hidden")),S&&S.reset(),j(null),d&&B?.challengeId&&typeof window.api?.submitHttpAuthChallenge=="function"&&window.api.submitHttpAuthChallenge({challengeId:B.challengeId,cancelled:!0}).catch(()=>{})}async function K(d={}){const m=document.getElementById("httpAuthModal"),S=document.getElementById("httpAuthModalTitle"),B=document.getElementById("httpAuthMessage"),D=document.getElementById("httpAuthUsernameInput"),W=document.getElementById("httpAuthPasswordInput"),s=document.getElementById("httpAuthRememberInput"),u=document.getElementById("httpAuthSubmitBtn");if(!m||!S||!B||!D||!W||!s||!u)return;H()?.challengeId&&ee(!0),j({...d});const w=String(d.reason||"")==="retry";S.textContent=w?"Login Failed, Update Credential":"Website Login Required";const p=String(d.host||d.url||"this website").trim(),y=String(d.realm||"").trim(),M=String(d.profileId||"").trim().toUpperCase();B.textContent=y?`${p} • ${y}${M?` • ${M}`:""}`:`${p}${M?` • ${M}`:""}`,D.value=String(d.username||""),W.value=String(d.password||""),s.checked=d.remember!==!1,u.textContent=w?"Update And Login":"Login",await i(()=>m.classList.remove("hidden")),W.value?(W.focus(),W.select()):(D.focus(),D.select())}function re(){const d=document.getElementById("httpAuthModal"),m=document.getElementById("httpAuthForm"),S=document.getElementById("httpAuthModalCloseBtn");!d||!m||!S||m.dataset.initialized!=="1"&&(m.dataset.initialized="1",S.addEventListener("click",()=>ee(!0)),d.addEventListener("click",B=>{B.target===d&&ee(!0)}),m.addEventListener("submit",async B=>{B.preventDefault();const D=H(),W=document.getElementById("httpAuthUsernameInput"),s=document.getElementById("httpAuthPasswordInput"),u=document.getElementById("httpAuthRememberInput");if(!D?.challengeId||!W||!s||typeof window.api?.submitHttpAuthChallenge!="function")return;const w=String(W.value||"").trim(),p=String(s.value||""),y=!!u?.checked;if(!(!w||!p))try{await window.api.submitHttpAuthChallenge({challengeId:D.challengeId,username:w,password:p,remember:y}),ee(!1)}catch(M){console.error("Failed to submit HTTP auth credential",M),t("Could not submit the website credential.","error")}}),typeof window.api?.onHttpAuthChallenge=="function"&&window.api.onHttpAuthChallenge(B=>{K(B).catch(D=>{console.error("Failed to open HTTP auth modal",D)})}))}function F(){}async function Q(d,m){if(!m||!m.rect)return;const S=d.getURL(),B=Ae(S);if(!B)return;const D=[];if(Object.entries(A()).forEach(([s,u])=>{u.forEach(w=>{const p=ae(w.domain);if(p===B||B.endsWith(`.${p}`)&&p.split(".").length>1){const y=n.PROFILES[s]||{name:s,color:"#ccc"};D.push({...w,profileId:s,profileName:y.name,profileColor:y.color})}})}),D.length===0)return;const W=`if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(D)});
    }`;d.executeJavaScript(W,!0).catch(()=>{})}return{canUseSecureCredentialApi:_e,getAutofillCredentialForTab:Ze,initHttpAuthPrompt:re,initPasswordManager:F,installCredentialCaptureHooks:C,isCredentialAutomationDomain:Me,isLikelyAuthPage:Se,maybeOfferRememberCredentials:_,normalizeDomain:ae,refreshCredentialCacheIfStale:ze,scheduleCredentialAutofill:f,shouldEnableCredentialAutomation:ke,startCredentialCapturePolling:X,handleCredentialFieldInteraction:Q,hideCredentialDropdown:()=>{}}}function ki({state:e,constants:n,createNativePageDescriptor:t,ensureNativeSettingsGeneralInfo:i,normalizeSettingsSection:r,renderNativeSettingsPage:c,closeBrowserExtensionsMenu:g,closeBrowserExtensionPopup:x,refreshBrowserExtensionsUi:P,refreshTabScrollControls:L,syncProfileSelectionForTab:h,updateProfileLockUI:E,perfMark:I,shouldRequirePlatformApiForNavigation:A,getWebviewPlatformApiFlag:N,setWebviewPlatformApiFlag:H,getWebviewPreloadPathCached:j,startCredentialCapturePolling:Z,scheduleCredentialAutofill:de,installCredentialCaptureHooks:q,refreshCredentialCacheIfStale:oe,getAutofillCredentialForTab:be,resolveAssignedProfileIdForTab:Ce,getCredentialScopeIdByPartition:Qe,resolveCredentialScopeIdForTab:_e,maybeOfferRememberCredentials:ae,syncTabProfileForPage:me,trackProfileHistory:nt,resolveProfileIdForTab:Ae,resolveAssignedProfileId:Ee,resolveStrictProfileNavigationTarget:Ie,resolveNavigationPartition:Ve,applyProfileSelection:je,openProfilePromptDialog:De,handleCredentialFieldInteraction:Oe,hideCredentialDropdown:ze}){const{PARTITIONS:he,PROFILES:Se,LOCAL_WEB_APP_TYPES:Me,WEBVIEW_POOL_MAX:ke=6,WEBVIEW_POOL_KEEPALIVE_MS:qe=6e4,TAB_PREWARM_ENABLED:it=!1,PREWARM_ALL_PROFILE_PARTITIONS:Ze=!1}=n,ve=[];let f=null;const T=new Map,C=()=>e.tabs,k=o=>{e.tabs=o},_=()=>e.activeTabId,X=o=>{e.activeTabId=o},ee=()=>e.currentProfileId;function K(o){const a=document.querySelector(".browser-controls-overlay");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result"));l&&o&&(o.hideBrowserControls=!1);const b=!!((o&&!o.isHome&&o.hideBrowserControls||o?.nativePage)&&!l);a.classList.toggle("hidden",b),l?(a.classList.remove("hidden"),a.style.setProperty("display","flex","important"),a.style.setProperty("visibility","visible","important"),a.style.setProperty("opacity","1","important"),a.style.setProperty("height","40px","important")):(a.style.removeProperty("display"),a.style.removeProperty("visibility"),a.style.removeProperty("opacity"),a.style.removeProperty("height"))}function re(o){const a=document.getElementById("browserDetachHeader");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result")),b=(!o||o.isHome||!!o.hideBrowserControls||!!o.nativePage)&&!l;a.classList.toggle("hidden",b)}function F(o){const a=document.querySelector(".profile-section");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result")),b=!!((o&&!o.isHome&&o.hideBrowserControls||o?.nativePage)&&!l);a.classList.toggle("hidden",b)}function Q(o,a){const l=C().find(v=>v.id===o);if(!l)return;l.title=a;const b=document.getElementById(`tab-ui-${o}`);b&&(b.querySelector(".tab-title").textContent=a)}function d(){const o=_();return o&&C().find(a=>a.id===o)||null}function m(){const o=_();return o?document.getElementById(`webview-${o}`):null}function S(o){const a=document.getElementById("urlDisplay");a&&(a.value=o)}function B(o){const a=document.getElementById("urlDisplay");a&&(a.value=o)}function D(o){o&&(o._oneviewCredentialPollId&&(clearInterval(o._oneviewCredentialPollId),o._oneviewCredentialPollId=null),o._oneviewAutofillTimer&&(clearTimeout(o._oneviewAutofillTimer),o._oneviewAutofillTimer=null))}function W(o){document.querySelectorAll(".webviews-container .webcontent-pane").forEach(l=>{const b=l.id.replace("webview-",""),v=C().find(V=>V.id===b);b===o&&!v?.isHome&&v?.credentialAutomationEnabled?Z(l,v):D(l)})}function s(o,a=C().length-1){const l=document.getElementById("tabsList");if(!l)return;const b=document.createElement("div");b.className="tab",b.id=`tab-ui-${o.id}`,b.innerHTML=`
        <span class="tab-title">${o.title}</span>
        <button class="tab-close">x</button>
    `,b.addEventListener("click",V=>{V.target.classList.contains("tab-close")||U(o.id)}),b.querySelector(".tab-close").addEventListener("click",V=>{V.stopPropagation(),pe(o.id)});const $=l.children[a]||null;l.insertBefore(b,$),L()}function u(o){setTimeout(async()=>{const a=C().find(b=>b.id===o);if(!(!a||!a.isHome||document.getElementById(`webview-${o}`)))try{const b=await G(a);if(!b)return;b.classList.remove("active"),typeof b.hide=="function"&&b.hide().catch(()=>{}),b.syncBounds?.(!1)}catch(b){window.api.webContentCall("log-error",{key:`prewarm-err:${o}:${b.toString()}`}).catch(()=>{})}},0)}async function w(o=null,a=null,l="New Tab",b=null,v={}){const $=v.active!==!1;window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?a=he.gsk:a=pt(a||(Se[ee()]?Se[ee()].partition:he.guest));const z=`tab-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,O={id:z,title:l,url:o,partition:a,isHome:!o&&!v.nativePage,nativePage:v.nativePage&&typeof v.nativePage=="object"?t(v.nativePage.type||"settings",v.nativePage.section||"general"):null,lockedProfileId:b,hideBrowserControls:!1,launchedAppType:null,trackingAppId:"",trackingAppName:"",requiresPlatformApi:!1,extensionCompatEnabled:!1,extensionEntryPath:"",extensionActiveContext:{url:"",title:""},credentialAutomationEnabled:!1,lastCredentialSourceProfileId:null};O.trackingAppId=String(v.trackingAppId||"").trim(),O.trackingAppName=String(v.trackingAppName||l||O.title||"").trim(),O.extensionEntryPath=String(v.extensionEntryPath||"").trim(),O.extensionCompatEnabled=!!O.extensionEntryPath,O.extensionActiveContext=v.extensionActiveContext&&typeof v.extensionActiveContext=="object"?{url:String(v.extensionActiveContext.url||"").trim(),title:String(v.extensionActiveContext.title||"").trim()}:{url:"",title:""};const J=C(),ye=J.findIndex(at=>at.id===_()),Re=Number.isInteger(v.insertIndex)?Math.max(0,Math.min(v.insertIndex,J.length)):ye>=0?ye+1:J.length;if(J.splice(Re,0,O),s(O,Re),O.nativePage)await U(z);else if(o){$&&X(z);const at=document.getElementById("view-home-content"),_t=document.getElementById("webviews-container");$&&at&&at.classList.add("hidden");const bi=o&&(o.includes("result.html")||o.includes("extension-icon")||o.toLowerCase().includes("result"));if($&&_t){_t.classList.remove("hidden");let Fe=document.getElementById("tab-load-placeholder");bi?Fe&&(Fe.style.display="none"):Fe?Fe.style.display="flex":(Fe=document.createElement("div"),Fe.id="tab-load-placeholder",Fe.style.cssText=["position:absolute","inset:0","z-index:50","display:flex","flex-direction:column","align-items:center","justify-content:center","background:var(--bg-main,#f8fafc)","gap:16px"].join(";"),Fe.innerHTML=`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `,_t.appendChild(Fe));const sn=()=>{Fe&&(Fe.style.display="none")},ln=Be=>{Be&&(typeof Be._oneviewPlaceholderFinalize=="function"&&(Be.removeEventListener("did-stop-loading",Be._oneviewPlaceholderFinalize),Be.removeEventListener("did-fail-load",Be._oneviewPlaceholderFinalize)),Be._oneviewPlaceholderFinalize=null)},cn=setInterval(()=>{const Be=document.getElementById(`webview-${z}`);if(!Be)return;clearInterval(cn),clearTimeout(dn);const Dt=()=>{ln(Be),clearTimeout(dn),sn()};ln(Be),Be._oneviewPlaceholderFinalize=Dt,Be.addEventListener("did-stop-loading",Dt,{once:!0}),Be.addEventListener("did-fail-load",Dt,{once:!0})},100),dn=setTimeout(()=>{clearInterval(cn),sn()},12e3)}await le(z,o,a,l,b,v,$)}else await U(z),it&&u(z);return O}function p(o=_()){const a=C(),l=a.find(z=>z.id===o);if(!l)return;const b=a.findIndex(z=>z.id===l.id),v=document.getElementById(`webview-${l.id}`),$=v&&typeof v.getURL=="function"&&v.getURL()||l.url||"",V=v&&typeof v.getTitle=="function"&&v.getTitle()||l.title||"New Tab";w(l.isHome||!$||$==="about:blank"?null:$,l.partition,V,l.lockedProfileId||null,{insertIndex:b>=0?b+1:a.length,trackingAppId:l.trackingAppId||"",trackingAppName:l.trackingAppName||V})}function y(o){const a=C();if(!a.length)return;const l=a.findIndex($=>$.id===_()),v=((l>=0?l:0)+o+a.length)%a.length;U(a[v].id,{suppressHomeSearchFocus:!0})}async function M(o){!o||typeof o.focusWebContents!="function"||await o.focusWebContents().catch(()=>{})}async function U(o,a={}){X(o);const l=C().find(O=>O.id===o);if(!l)return;g(),x().catch(()=>{}),h(l),E(l),document.querySelectorAll(".tab").forEach(O=>O.classList.remove("active"));const b=document.getElementById(`tab-ui-${o}`);b&&b.classList.add("active");const v=document.getElementById("view-home-content"),$=document.getElementById("nativeTabContent"),V=document.getElementById("webviews-container"),z=document.querySelectorAll(".webviews-container .webcontent-pane");if(l.isHome){v.classList.remove("hidden"),$?.classList.add("hidden"),V.classList.add("hidden"),K(l),re(l),F(l);const O=document.getElementById("googleSearchInput");O&&a?.suppressHomeSearchFocus!==!0&&(O.value="",O.focus())}else if(l.nativePage)v.classList.add("hidden"),$?.classList.remove("hidden"),V.classList.add("hidden"),K(l),re(l),F(l),S(""),r(l.nativePage?.section)==="general"&&await i(),c(l);else{v.classList.add("hidden"),$?.classList.add("hidden"),V.classList.remove("hidden"),K(l),re(l),F(l),z.forEach(J=>{J.id!==`webview-${o}`&&(J.classList.remove("active"),typeof J.hide=="function"&&J.hide().catch(()=>{}),J.syncBounds?.(!1))});let O=null;try{O=document.getElementById(`webview-${o}`),O||(O=await G(l))}catch(J){window.api.webContentCall("log-error",{key:`switchTab-create-err:${o}:${J.toString()}`}).catch(()=>{})}if(O)try{O.classList.add("active"),typeof O.show=="function"&&await O.show().catch(()=>{}),O.syncBounds?.(!0),await M(O),S(O.getURL())}catch(J){window.api.webContentCall("log-error",{key:`switchTab-show-err:${o}:${J.toString()}`}).catch(()=>{})}}W(l.id),P()}function R(o){if(!o)return!1;const a=String(o.launchedAppType||"").toLowerCase();return Me.has(a)}function te(o,a){if(!o||!a||!R(a))return!1;const l=String(o.getAttribute("partition")||a.partition||"");if(!l)return!1;const b=o.parentElement;for(b&&b.removeChild(o),o.classList.remove("active"),ve.push({webview:o,partition:l,platformApiEnabled:N(o),at:Date.now()}),I("view-webcontent","park-to-pool",{partition:l,poolSize:ve.length});ve.length>ke;){const v=ve.shift();v&&v.webview&&!v.webview.isDestroyed?.()&&v.webview.remove()}return!0}function pe(o){const a=C(),l=a.findIndex(V=>V.id===o);if(l===-1)return;const b=_()===o;document.getElementById(`tab-ui-${o}`)?.remove();const v=document.getElementById(`webview-${o}`);if(v&&(D(v),(!R(a[l])||!te(v,a[l]))&&v.remove()),a.splice(l,1),a.length===0){X(null),w(),L();return}const $=a.some(V=>V.id===_());if(b||!$){const V=Math.min(l,a.length-1),z=a[V]||a[a.length-1];z&&U(z.id)}L()}async function le(o,a,l,b,v=null,$={},V=!0){const z=performance.now(),O=C().find(ye=>ye.id===o);if(!O)return;O._navStartedAt=z,I("view-nav","navigateTo-start",{tabId:O.id,url:String(a||""),partition:String(l||""),appType:$.appType||null}),O.isHome=!1,O.url=a,O.partition=l,O.lockedProfileId=v,O.hideBrowserControls=!!$.hideControls,O.launchedAppType=$.appType||null,O.lastCredentialSourceProfileId=null,O.trackingAppId=String($.trackingAppId||"").trim(),O.trackingAppName=String($.trackingAppName||b||O.title||"").trim(),O.requiresPlatformApi=A(a,$),b&&Q(o,b),V&&(X(o),await U(o));let J=document.getElementById(`webview-${o}`);if(!J)J=await G(O,V);else{const ye=J.getAttribute("partition"),Re=N(J);(ye!==l||Re!==!!O.requiresPlatformApi)&&(D(J),(!R(O)||!te(J,O))&&J.remove(),J=await G(O,V))}V&&typeof J.show=="function"?await J.show().catch(()=>{}):!V&&typeof J.hide=="function"&&await J.hide().catch(()=>{}),typeof J.setMeta=="function"&&await J.setMeta({trackingAppId:O.trackingAppId,appName:O.trackingAppName,appType:O.launchedAppType||""}).catch(()=>{}),J.syncBounds?.(V),V&&(S(a),await M(J)),J.src!==a&&(J.src=a),I("view-nav","navigateTo-dispatch",{tabId:O.id,elapsedMs:Math.round(performance.now()-z)})}async function we(o,a,l,b=null,v={}){return le(_(),o,a,l,b,v,!0)}function ie(o){o&&o.executeJavaScript(`
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
      `,!0).catch(()=>{})}function Y(o=""){const a=String(o||"").trim().toLowerCase();return!!(!a||a==="about:blank"||a.startsWith("javascript:")||a.startsWith("data:")||a.startsWith("chrome-error://"))}function ce(o){o._hasTabListenersAttached||(o._hasTabListenersAttached=!0,o.addEventListener("ipc-message",async a=>{if(a.channel==="oneview:credential-field-focused")Oe(o,a.args[0]);else if(a.channel!=="oneview:credential-field-blurred"){if(a.channel==="oneview:credential-selected"){const l=a.args[0];l&&(de(o,l),l.profileId&&l.profileId!==ee()&&je(l.profileId))}}}),o.addEventListener("console-message",a=>{const l=String(a?.message||"");(l.includes("[OneView][Credential")||l.includes("[VeevaSlide]"))&&console.log("[WebviewConsole]",{level:a?.level,line:a?.line,sourceId:a?.sourceId||"",message:l})}),o.addEventListener("did-start-loading",()=>{const a=o.id.replace("webview-",""),l=C().find(v=>v.id===a);if(!l)return;l._didStartLoadingAt=performance.now(),I("view-webcontent","did-start-loading",{tabId:l.id,url:o.getURL()||l.url||""}),l.url&&(l.url.includes("result.html")||l.url.includes("extension-icon")||l.url.toLowerCase().includes("result"))?(Q(l.id,"Result"),l.id===_()&&B(l.url||"")):(Q(l.id,"Loading..."),l.id===_()&&B(l.url||"Loading..."))}),o.addEventListener("did-stop-loading",async()=>{const a=o.id.replace("webview-",""),l=C().find(ye=>ye.id===a);if(!l)return;const b=typeof l._didStartLoadingAt=="number"?Math.round(performance.now()-l._didStartLoadingAt):null,v=typeof l._navStartedAt=="number"?Math.round(performance.now()-l._navStartedAt):null;I("view-webcontent","did-stop-loading",{tabId:l.id,url:o.getURL()||"",loadElapsedMs:b,navElapsedMs:v});const $=o.getURL()||l.url||"";let z=$&&($.includes("result.html")||$.includes("extension-icon")||$.toLowerCase().includes("result"))?"Result":o.getTitle()||l.title||"Tab";if(z==="Tab"||z==="Loading..."||!z)try{const ye=new URL($);z=ye.hostname?ye.hostname.replace("www.",""):"Tab"}catch{z="Tab"}if((l.title==="Loading..."||l.title==="Tab"||!l.title||o.getTitle()&&o.getTitle()!=="about:blank")&&Q(l.id,z),l.id===_()&&S($),l.url=$,l.credentialAutomationEnabled=on($,z,l),l.credentialAutomationEnabled){const ye=Ce(l,$,z),Re=Qe(l.partition)||ye||ee();await oe();const at=be(Re,$,l);de(o,at),Z(o,l),q(o)}else D(o);await me(l,$,z,o),mi(o,l);const J=Ae(l);nt(J,$,z),ie(o)}),o.addEventListener("page-title-updated",a=>{const l=o.id.replace("webview-",""),b=C().find(v=>v.id===l);b&&(Q(b.id,a.title),b.credentialAutomationEnabled&&ae(o,b))}),o.addEventListener("will-navigate",()=>{const a=o.id.replace("webview-",""),l=C().find(b=>b.id===a);l&&l.credentialAutomationEnabled&&ae(o,l)}),o.addEventListener("did-navigate",a=>{const l=o.id.replace("webview-",""),b=C().find($=>$.id===l);if(!b)return;const v=a.url||o.getURL()||"";b.url=v,b.id===_()&&S(v)}),o.addEventListener("did-navigate-in-page",async a=>{const l=o.id.replace("webview-",""),b=C().find(z=>z.id===l);if(!b)return;const v=a.url||o.getURL()||"";if(b.url=v,b.id===_()&&S(v),b.credentialAutomationEnabled=on(v,o.getTitle()||b.title||"",b),!b.credentialAutomationEnabled){D(o);return}ae(o,b),await oe();const $=Qe(b.partition)||Ce(b,v,o.getTitle()||b.title||"")||_e(b),V=be($,v,b);de(o,V),Z(o,b)}),o.addEventListener("new-window",async a=>{const l=o.id.replace("webview-",""),b=C().find(ye=>ye.id===l);if(!b)return;typeof a?.preventDefault=="function"&&a.preventDefault();const v=String(a?.url||"").trim();if(Y(v))return;const $=String(o.getURL()||"").trim();if($&&$===v)return;let V=Ee(v,"New Tab"),z=null;if(V)z=Se[V].partition;else if(De){const ye=Ae(b)||"guest",Re=await De(v,ye);if(Re&&!Re.cancelled&&Re.profileId)V=Re.profileId,z=Se[V]?.partition;else return}else z=b.partition;const O=C(),J=O.findIndex(ye=>ye.id===b.id);w(v,z,"New Tab",V,{insertIndex:J>=0?J+1:O.length})}))}async function G(o,a=!0){if(T.has(o.id))return T.get(o.id);const l=ct(o,a);T.set(o.id,l);try{return await l}finally{T.delete(o.id)}}function fe(o){const a=String(o?.partition||"");if(!a||ve.length===0)return null;const l=!!o?.requiresPlatformApi,b=ve.findIndex($=>$.partition===a&&!!$.platformApiEnabled===l);if(b===-1)return null;const[v]=ve.splice(b,1);return v?.webview||null}async function ct(o,a=!0){const l=performance.now(),b=document.getElementById("webviews-container"),v=fe(o);if(v)return v.classList.toggle("active",a),v.id=`webview-${o.id}`,v.setAttribute("partition",o.partition),H(v,!!o.requiresPlatformApi),ce(v),b.appendChild(v),a&&typeof v.show=="function"?v.show().catch(()=>{}):!a&&typeof v.hide=="function"&&v.hide().catch(()=>{}),v.syncBounds?.(a),a&&typeof v.focusWebContents=="function"&&v.focusWebContents().catch(()=>{}),I("view-webcontent","reuse-pooled",{tabId:o.id,partition:o.partition,elapsedMs:Math.round(performance.now()-l),poolSize:ve.length}),v;const $=j(),V=await pn({key:`view:${o.id}`,partition:o.partition,preloadPath:$,additionalArguments:o.requiresPlatformApi?["--oneview-enable-platform-api=1"]:[],extensionEntryPath:o.extensionEntryPath,extensionActiveContext:o.extensionActiveContext,extensionCompat:!0,initialMeta:{trackingAppId:o.trackingAppId,appName:o.trackingAppName,appType:o.launchedAppType||"",extensionEntryPath:o.extensionEntryPath},className:`webcontent-pane${a?" active":""}`});return V.id=`webview-${o.id}`,V.setAttribute("partition",o.partition),H(V,!!o.requiresPlatformApi),ce(V),b.appendChild(V),!a&&typeof V.hide=="function"&&V.hide().catch(()=>{}),V.syncBounds?.(a),a&&typeof V.focusWebContents=="function"&&V.focusWebContents().catch(()=>{}),I("view-webcontent","create-fresh",{tabId:o.id,partition:o.partition,elapsedMs:Math.round(performance.now()-l)}),V}function dt(){f||(f=setInterval(()=>{if(!document.hidden&&ve.length!==0)for(let o=ve.length-1;o>=0;o-=1){const l=ve[o]?.webview;if(!l||l.isDestroyed?.()){ve.splice(o,1);continue}l.executeJavaScript("void 0",!1).catch(()=>{})}},qe))}async function et(o){const a=String(o||"").trim();if(!a||ve.some($=>$.partition===a))return;const l=document.getElementById("webviews-container");if(!l)return;const b=j(),v=`view:prewarm:${a}:${Date.now()}`;try{const $=await pn({key:v,partition:a,preloadPath:b,className:"webcontent-pane"});$.id=`webview-prewarm-${Date.now()}`,l.appendChild($),$.syncBounds?.(),te($,{launchedAppType:"website",partition:a})}catch{}}async function nn(){const o=Array.from(new Set(Object.values(Se).map(a=>String(a?.partition||"").trim()).filter(Boolean)));for(const a of o)await et(a),await new Promise(l=>setTimeout(l,60))}async function Et(){const o=Se[ee()]?.partition||Se.guest.partition;o&&await et(o)}function ui(){dt(),it&&(Ze?nn():Et())}function pi(){for(f&&(clearInterval(f),f=null);ve.length>0;){const o=ve.shift();o&&o.webview&&!o.webview.isDestroyed?.()&&o.webview.remove()}}function fi(o,a=null){return!(!o||o.isHome)}function mi(o,a){if(!o||!a||a.launchedAppType!=="website")return;const l=`
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
  `;try{o.insertCSS(l)}catch(b){console.warn("Could not apply website scrollbar theme:",b)}}function wi(){const o=C().find(l=>l.id===_());if(!o||o.isHome)return;o.isHome=!0,o.url=null,o.lockedProfileId=null,Q(o.id,"New Tab");const a=document.getElementById(`webview-${o.id}`);a&&(D(a),(!R(o)||!te(a,o))&&a.remove()),U(o.id)}function gi(o=""){const a=String(o||"").trim();if(!a)return"";const l=a.match(/^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/);if(l){const v=l[1].toUpperCase(),$=decodeURIComponent(l[2]).replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${v}:/${$}`}if(/^file:\/\//i.test(a)||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/^about:/i.test(a))return a;const b=a.match(/^([a-zA-Z])[:/\\](.*)$/);if(b){const v=b[1].toUpperCase(),$=b[2].replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${v}:/${$}`}if(/^\/[A-Za-z]\//.test(a)){const v=a[1].toUpperCase(),$=a.slice(3).replace(/\\/g,"/");return`file:///${v}:/${$}`}return/^\\\\/.test(a)?`file:${a.replace(/\\/g,"/")}`:a}function $t(o=""){const a=String(o||"").trim();return!a||/\s/.test(a)?!1:!!(/^about:/i.test(a)||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(a)||/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(a)||a.includes(".")||/[/:?#]/.test(a))}async function hi(o){if(o=gi(o),!o)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){let v=o;$t(o)?!/^[a-z][a-z0-9+.-]*:\/\//i.test(o)&&!/^about:/i.test(o)&&(v=`https://${o}`):v=`https://www.google.com/search?q=${encodeURIComponent(o)}`,await we(v,he.gsk,o);return}let a=o,l=$t(o);if(l?!/^[a-z][a-z0-9+.-]*:\/\//i.test(o)&&!/^about:/i.test(o)&&!/^file:\/\//i.test(o)&&(a=`https://${o}`):$t(o)?(a=`https://${o}`,l=!0):a=`https://www.google.com/search?q=${encodeURIComponent(o)}`,l){const v=await Ie(a,null,"New Tab");if(!v||v.cancelled)return;const $=v.profileId,V=v.partition;$&&$!==ee()&&je($,{bypassLock:!0}),await we(a,V,"New Tab",v.lockedProfileId);return}const b=Ve(a,d()?.partition||Se[ee()]?.partition||he.guest,"Google Search");await we(a,b,"Google Search")}function vi(o,{isTeardown:a=!1}={}){const l=C(),b=Array.isArray(o)?o.filter(Boolean):[];if(b.length===0||l.length===0)return;const v=new Set(b),$=[...l],V=$.findIndex(z=>z.id===_());if($.forEach(z=>{if(!v.has(z.id))return;document.getElementById(`tab-ui-${z.id}`)?.remove();const O=document.getElementById(`webview-${z.id}`);O&&(D(O),(!R(z)||!te(O,z))&&O.remove())}),k($.filter(z=>!v.has(z.id))),C().length===0){X(null),a||(w(),L());return}if(v.has(_())){const z=Math.min(Math.max(V,0),C().length-1);X(C()[z].id)}U(_()||C()[0].id),L()}function on(o="",a="",l=null){return l?l.launchedAppType==="website"||!l.launchedAppType?rn(o,a)||an(o):!0:!1}function rn(o="",a=""){const l=`${String(o||"")} ${String(a||"")}`.toLowerCase();if(/login|sign in|signin|password|sso|authenticate|verify/.test(l))return!0;try{const b=new URL(String(o||"")),v=`${b.pathname.toLowerCase()} ${b.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(v)}catch{return!1}}function an(o=""){let a="";try{a=new URL(String(o||"")).hostname.toLowerCase()}catch{return!1}return a==="10.215.56.196"||a.endsWith(".gskinternet.com")||a.endsWith(".gskpro.com")||a.endsWith(".veevavault.com")||a.endsWith(".okta.com")||a.endsWith(".oktacdn.com")||a.endsWith(".pingone.com")}return{closeTab:pe,closeTabsBulk:vi,createTab:w,createWebviewForTab:G,duplicateTab:p,disposeWebviewRuntime:pi,getActiveTab:d,getActiveWebview:m,goToActiveTabHome:wi,isInspectableLocalFileTab:fi,navigateTo:we,navigateToTab:le,performSearch:hi,startWebviewRuntime:ui,switchRelativeTab:y,switchTab:U,updateTabTitle:Q,updateUrlDisplay:S,updateUrlDisplayString:B,getCurrentProfileId:ee,getTabs:C}}console.log("View Page Script initializing...");let se=[],Ne=null,Pt=!1,Nn=null,fn=null,mn=[],wn=[],gn={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};const jt=Ke.profileHistory,zt="view.profileHistory.v1";let Pe={wppproduction:[],vml:[],gsk:[],guest:[]};const On=Ke.customBookmarks;let Te=[],hn="guest",Ft="guest",vn="",st="guest",Ct=null,Ye=null,bn=null;const Bi=new Set(["login.veevavault.com","federation.gsk.com"]);let wt=null,$e=-1,Ue=[],yn={version:"",defaultOpenStatus:""},Sn=0,En=null,xn=!1;const Rn=Ke.perfEnabled;let ut=null,Cn=!1;const St={};Object.defineProperties(St,{tabs:{get:()=>se,set:e=>{se=e}},activeTabId:{get:()=>Ne,set:e=>{Ne=e}},browserExtensionsCache:{get:()=>mn,set:e=>{mn=e}},managedDownloadsCache:{get:()=>wn,set:e=>{wn=e}},nativeSettingsGeneralInfo:{get:()=>yn,set:e=>{yn=e}},historyProfileId:{get:()=>Ft,set:e=>{Ft=e}},historySearchQuery:{get:()=>vn,set:e=>{vn=e}},currentProfileId:{get:()=>ue,set:e=>{ue=e}},profileHistoryCache:{get:()=>Pe,set:e=>{Pe=e}},credentialCache:{get:()=>gn,set:e=>{gn=e}},passwordProfileId:{get:()=>hn,set:e=>{hn=e}},passwordEditTarget:{get:()=>fn,set:e=>{fn=e}},activeHttpAuthChallenge:{get:()=>bn,set:e=>{bn=e}},credentialCacheRefreshedAt:{get:()=>Sn,set:e=>{Sn=e}},credentialCacheRefreshInFlight:{get:()=>En,set:e=>{En=e}}});const Ht={synapse:{partition:ge.synapse},contentgen:{partition:ge.contentgen}},qt=new Set(["nextjs","vite","react","angular","html","neutralino","website","vite-server"]),Fn=(()=>{try{return new URL(Un).origin.toLowerCase()}catch{return""}})(),Ai=new URL(""+new URL("contentgen-DZqnGDPH.png",import.meta.url).href,import.meta.url).href,Ti=new URL(""+new URL("contentgen-dark-C7HM67Tp.png",import.meta.url).href,import.meta.url).href;function In(e=document){if(!e||typeof e.querySelectorAll!="function")return;const n=document.body.classList.contains("dark-mode");e.querySelectorAll("img[data-theme-icon]").forEach(t=>{const i=String(t.getAttribute("data-theme-icon")||"").trim();let r="";i==="contentgen"&&(r=n?Ti:Ai),r&&t.getAttribute("src")!==r&&t.setAttribute("src",r)})}function $i(){["httpAuthModal","bookmarkModal","cacheActionModal","extensionsManagerModal"].forEach(e=>{const n=document.getElementById(e);!n||n.dataset.hoistedToBody==="1"||(document.body.appendChild(n),n.dataset.hoistedToBody="1")})}async function Ln(){const e=Xe();if(!(!e||e.isHome||!e.url||!window.api?.openDetachedViewWindow))try{await window.api.openDetachedViewWindow({url:e.url,title:e.title||"Detached Tab",partition:e.partition||ge.guest}),Gt(e.id)}catch(n){console.error("Failed to open detached tab window",n),We("Could not open the page in a separate window.","error")}}function Tt(){if(ut!==null)return ut;try{const e=localStorage.getItem(Rn);return ut=e==="1"||e==="true",ut}catch{return ut=!1,!1}}function Hn(e,n,t=null){if(!Tt())return;const i=t?{...t}:{};try{console.log(`[PERF][${e}] ${n}`,i)}catch{}}window.addEventListener("storage",e=>{e.key===Rn&&(ut=null,window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Tt()).catch(()=>{}))});const ne={wppproduction:{id:"wppproduction",name:"WPPProduction",partition:ge.wppproduction,color:"#000000",bgColor:"#e2e8f0",label:"W"},vml:{id:"vml",name:"VML",partition:ge.vml,color:"#ff0000",bgColor:"#fee2e2",label:"V"},gsk:{id:"gsk",name:"GSK",partition:ge.gsk,color:"#f37521",bgColor:"#ffedd5",label:"G"},guest:{id:"guest",name:"Guest",partition:ge.guest,color:"#64748b",bgColor:"#f1f5f9",label:"?"}};let ue="guest";function _i(){return ue}const Di=Pi({state:St,constants:{AUTH_GATEWAY_HOSTS:Bi,RESOURCE_SERVICE_ORIGIN:Fn,PROFILES:ne},showToast:We,openOverlayModal:rt,closeOverlayModal:Ge,renderProfilePillSelect:Qt,resolveCredentialScopeIdForTab:ti,applyProfileSelection:mt,getCurrentProfileId:()=>ue,escapeHtml:xe}),{getAutofillCredentialForTab:Mi,initHttpAuthPrompt:Ui,installCredentialCaptureHooks:Ni,isLikelyAuthPage:Oi,maybeOfferRememberCredentials:Ri,refreshCredentialCacheIfStale:Fi,scheduleCredentialAutofill:Hi,startCredentialCapturePolling:Wi,handleCredentialFieldInteraction:Vi,hideCredentialDropdown:ji}=Di;let lt=null,gt=null;const zi=Li({state:St,constants:{PROFILES:ne,PENDING_EXTENSION_OPEN_STORAGE_KEY:"oneview.pendingExtensionOpenPath",EXTENSION_PIN_STORAGE_KEY:"oneview.browserExtensions.pinned.v1",IS_DEV_APP_BUILD:Lt},escapeHtml:xe,showToast:We,openOverlayModal:rt,closeOverlayModal:Ge,getActiveTab:(...e)=>gt?.getActiveTab?.(...e)??null,getActiveWebview:(...e)=>gt?.getActiveWebview?.(...e)??null,createTab:(...e)=>gt?.createTab?.(...e),refreshActiveNativeSettingsPage:(...e)=>lt?.refreshActiveNativeSettingsPage?.(...e)??Promise.resolve(),closeSettingsMenu:So}),{closeBrowserExtensionPopup:Yt,closeBrowserExtensionsMenu:qi,formatDownloadBytes:Yi,formatDownloadEta:Gi,formatDownloadSpeed:Ki,initDownloadsManager:Ji,initExtensionsManager:Xi,loadManagedDownloadsFromMain:Qi,refreshBrowserExtensionsUi:Zi,refreshExtensionsManagerList:Wn}=zi;gt=ki({state:St,constants:{PARTITIONS:ge,PROFILES:ne,LOCAL_WEB_APP_TYPES:qt,WEBVIEW_POOL_MAX:6,WEBVIEW_POOL_KEEPALIVE_MS:12e3,TAB_PREWARM_ENABLED:!0,PREWARM_ALL_PROFILE_PARTITIONS:!1},createNativePageDescriptor:(...e)=>lt?.createNativePageDescriptor?.(...e)??null,ensureNativeSettingsGeneralInfo:(...e)=>lt?.ensureNativeSettingsGeneralInfo?.(...e)??Promise.resolve(),normalizeSettingsSection:(...e)=>lt?.normalizeSettingsSection?.(...e)??"general",renderNativeSettingsPage:(...e)=>lt?.renderNativeSettingsPage?.(...e),closeBrowserExtensionsMenu:qi,closeBrowserExtensionPopup:Yt,refreshBrowserExtensionsUi:Zi,refreshTabScrollControls:At,syncProfileSelectionForTab:Io,updateProfileLockUI:vt,perfMark:Hn,shouldRequirePlatformApiForNavigation:To,getWebviewPlatformApiFlag:$o,setWebviewPlatformApiFlag:_o,getWebviewPreloadPathCached:Ao,startCredentialCapturePolling:Wi,scheduleCredentialAutofill:Hi,installCredentialCaptureHooks:Ni,refreshCredentialCacheIfStale:Fi,getAutofillCredentialForTab:Mi,resolveAssignedProfileIdForTab:Gn,getCredentialScopeIdByPartition:jn,resolveCredentialScopeIdForTab:ti,maybeOfferRememberCredentials:Ri,syncTabProfileForPage:Lo,trackProfileHistory:Bo,resolveProfileIdForTab:ei,resolveAssignedProfileId:yt,resolveStrictProfileNavigationTarget:Kn,resolveNavigationPartition:tt,applyProfileSelection:mt,openProfilePromptDialog:Vt,handleCredentialFieldInteraction:Vi,hideCredentialDropdown:ji});const{closeTab:Gt,closeTabsBulk:ht,createTab:Le,createWebviewForTab:eo,duplicateTab:to,disposeWebviewRuntime:Vn,getActiveTab:Xe,getActiveWebview:Je,goToActiveTabHome:no,isInspectableLocalFileTab:io,navigateTo:bt,navigateToTab:oo,performSearch:kt,startWebviewRuntime:ro,switchRelativeTab:xt,switchTab:He,updateTabTitle:ao,updateUrlDisplay:so,updateUrlDisplayString:Pn,getTabs:kn}=gt;lt=Ii({state:St,constants:{PROFILES:ne,PARTITIONS:ge,IS_DEV_APP_BUILD:Lt},escapeHtml:xe,showToast:We,isPerfEnabled:Tt,formatDownloadBytes:Yi,formatDownloadSpeed:Ki,formatDownloadEta:Gi,formatHistoryTime:ni,loadManagedDownloadsFromMain:Qi,refreshExtensionsManagerList:Wn,saveProfileHistoryStore:Zt,getActiveTab:Xe,updateTabTitle:ao,createTab:Le,switchTab:He,navigateTo:bt});const{bindSettingsShortcutsGlobal:lo,createNativePageDescriptor:pr,ensureNativeSettingsGeneralInfo:fr,getSettingsTabTitle:mr,initNativeSettingsUi:co,initSettingsMenu:uo,isEditableShortcutTarget:po,isNativeSettingsTab:wr,normalizeSettingsSection:gr,openSettingsTab:Wt,refreshActiveNativeSettingsPage:fo,renderNativeSettingsPage:hr,updateNativeSettingsTabSection:vr}=lt;function mo(){try{return localStorage.getItem("username")==="Guest"}catch{return!1}}function wo(e="",n="",t=""){const i=String(t||"").trim().toLowerCase();if(Ht[i])return i;const r=String(n||"").trim().toLowerCase(),c=String(e||"").trim().toLowerCase();try{const g=new URL(String(e||"")),x=`${g.protocol}//${g.host}`.toLowerCase(),P=String(g.pathname||"/").toLowerCase();if(x===Fn&&(P==="/"||P===""))return"synapse";if(x==="http://10.215.56.196:3456")return"contentgen"}catch{}return/content[\s-]*gen/.test(r)||/content[\s-]*gen/.test(c)?"contentgen":r.includes("synapse")?"synapse":""}function Kt(e){const n=pt(e);if(n===ge.synapse||n===ge.contentgen)return"guest";const t=Object.values(ne).find(i=>i.partition===n);return t?t.id:null}function jn(e){const n=pt(e);return n===ge.synapse?"synapse":n===ge.contentgen?"contentgen":Kt(n)}function tt(e="",n="",t="",i={}){const r=String(i?.sessionScope||i?.credentialScope||"").trim()||"",c=wo(e,t,r);return c&&Ht[c]?Ht[c].partition:pt(n||ne[ue]?.partition||ge.guest)}async function go(){const e=document.getElementById("view-synapse-link-btn");if(!e||(e.style.display="none",mo()))return;const n=String(localStorage.getItem("emp_id")||"").trim(),t=String(localStorage.getItem("username")||"").trim(),i=/^\d+$/.test(t)?t:"",r=n||i;if(r)try{const c=await fetch(`${Un}/api/list_of_users`,{signal:AbortSignal.timeout(5e3)});if(!c.ok)throw new Error(`API returned ${c.status}`);const g=await c.json(),x=Array.isArray(g)?g:Array.isArray(g?.users)?g.users:[],P=new Set(x.map(L=>String(L?.emp_id??"").trim()).filter(Boolean));e.style.display=P.has(r)?"flex":"none"}catch(c){console.warn("Could not verify Synapse visibility in view",c),e.style.display="none"}}function ho(e="",n="addressSearchDropdown"){const t=document.getElementById(n);if(!t)return;const i=String(e||"").trim().toLowerCase();if(!i){t.classList.add("hidden"),Ue=[],$e=-1;return}const r=se.filter(h=>{const E=String(h.title||"").toLowerCase(),I=String(h.url||"").toLowerCase();return E.includes(i)||I.includes(i)}).map(h=>({type:"tab",id:h.id,title:h.title||"Untitled Tab",url:h.url||"",partition:h.partition}));let c=[];Object.values(Pe).forEach(h=>{Array.isArray(h)&&h.forEach(E=>{const I=String(E.title||"").toLowerCase(),A=String(E.url||"").toLowerCase();if(I.includes(i)||A.includes(i)){const N=c.some(j=>j.url===E.url),H=r.some(j=>j.url===E.url);!N&&!H&&c.push({type:"history",title:E.title||"History Item",url:E.url,partition:E.partition||ge.guest})}})}),Ue=[{type:"search",title:e,url:`Search for "${e}"`},...r.slice(0,5),...c.slice(0,15)],$e=0;let x="";x+=Mt(Ue[0],0);const P=Ue.filter(h=>h.type==="tab");P.length>0&&(x+='<div class="address-search-group-label">Open Tabs</div>',P.forEach(h=>{const E=Ue.indexOf(h);x+=Mt(h,E)}));const L=Ue.filter(h=>h.type==="history");L.length>0&&(x+='<div class="address-search-group-label">History</div>',L.forEach(h=>{const E=Ue.indexOf(h);x+=Mt(h,E)})),t.innerHTML=x,t.classList.remove("hidden")}function Mt(e,n){const t=n===$e;let i=String(e.title||"H").charAt(0).toUpperCase(),r="is-history",c="History";return e.type==="tab"?(r="is-tab",c="Tab"):e.type==="search"&&(r="is-search",c="Search",i="🔍"),`
    <div class="address-search-item ${r} ${t?"is-selected":""}" 
         data-index="${n}">
      <div class="address-search-item-icon">${i}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${xe(e.title)}</span>
        <span class="address-search-item-url">${xe(e.url)}</span>
      </div>
      <div class="address-search-item-badge">${c}</div>
    </div>
  `}async function Bn(e,n){const t=document.getElementById(e);if(!t)return;if($e<0||$e>=Ue.length){kt(t.value);return}const i=Ue[$e],r=document.getElementById(n);r&&r.classList.add("hidden"),i.type==="tab"?await He(i.id):i.type==="history"?await ii(i.url,i.partition,i.title):kt(t.value),t.blur()}function An(e,n){const t=document.getElementById(e),i=document.getElementById(n);!t||!i||(t.addEventListener("input",()=>{ho(t.value,n)}),t.addEventListener("keydown",r=>{i.classList.contains("hidden")||(r.key==="ArrowDown"?(r.preventDefault(),$e=($e+1)%Ue.length,Tn(n)):r.key==="ArrowUp"?(r.preventDefault(),$e=($e-1+Ue.length)%Ue.length,Tn(n)):r.key==="Enter"?(r.preventDefault(),Bn(e,n)):r.key==="Escape"&&i.classList.add("hidden"))}),i.addEventListener("click",r=>{const c=r.target.closest(".address-search-item");if(!c)return;const g=parseInt(c.dataset.index);isNaN(g)||($e=g,Bn(e,n))}))}function Tn(e){const n=document.getElementById(e);n&&n.querySelectorAll(".address-search-item").forEach((t,i)=>{const r=parseInt(t.dataset.index);t.classList.toggle("is-selected",r===$e),r===$e&&t.scrollIntoView({block:"nearest"})})}function vo(){const e=document.getElementById("googleSearchInput");e&&e.dataset.boundAddressInput!=="1"&&(e.dataset.boundAddressInput="1",e.addEventListener("keydown",t=>{const i=document.getElementById("addressSearchDropdownHome");i&&!i.classList.contains("hidden")||t.key==="Enter"&&kt(e.value)}),An("googleSearchInput","addressSearchDropdownHome"));const n=document.getElementById("urlDisplay");n&&n.dataset.boundAddressInput!=="1"&&(n.dataset.boundAddressInput="1",n.addEventListener("focus",()=>{n.select?.()}),n.addEventListener("keydown",t=>{const i=document.getElementById("addressSearchDropdown");if(!(i&&!i.classList.contains("hidden"))){if(t.key==="Enter")t.preventDefault(),kt(n.value),n.blur();else if(t.key==="Escape"){t.preventDefault();const r=Xe();so(r?.url||""),n.blur()}}}),An("urlDisplay","addressSearchDropdown"))}function zn(){if(Pt){window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode(),se.length===0?Le():He(Ne||se[0].id);return}Pt=!0,console.log("initViewPage called"),Si().catch(n=>{console.warn("Could not initialize OneView shared storage sync",n)}),tr(),window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Tt()).catch(()=>{}),window.api&&typeof window.api.getPerfLogPath=="function"&&window.api.getPerfLogPath().then(n=>{n?.success&&Hn("perf","log-path",{path:n.path||"",enabled:n.enabled})}).catch(()=>{}),!xn&&window.api&&typeof window.api.onCredentialDebugLog=="function"&&(xn=!0,window.api.onCredentialDebugLog(n=>{console.log("[OneView][CredentialCapture][MainRelay]",n)})),document.body?.dataset.boundProfileHistorySharedStorage!=="1"&&window.api?.onOneviewSharedStorageUpdated&&(document.body.dataset.boundProfileHistorySharedStorage="1",window.api.onOneviewSharedStorageUpdated(n=>{String(n?.key||"")===zt&&(Zn(n),fo().catch(()=>{}))})),Oo(),ko(),Po().catch(()=>{}),Wo(),en(),In(),$i(),document.addEventListener("click",n=>{const t=document.getElementById("addressSearchDropdown"),i=document.getElementById("addressSearchDropdownHome"),r=document.getElementById("urlDisplay"),c=document.getElementById("googleSearchInput");t&&!t.contains(n.target)&&n.target!==r&&t.classList.add("hidden"),i&&!i.contains(n.target)&&n.target!==c&&i.classList.add("hidden");const g=document.getElementById("credentialSelectionDropdown");g&&!g.contains(n.target)&&g.classList.add("hidden")}),document.body.dataset.viewThemeIconObserverBound||(document.body.dataset.viewThemeIconObserverBound="1",new MutationObserver(()=>{In()}).observe(document.body,{attributes:!0,attributeFilter:["class"]})),se.length===0?Le():He(Ne||se[0].id);const e=document.getElementById("newTabBtn");e&&e.addEventListener("click",()=>{Le()}),qo();try{vo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupViewSearch-err:${n.toString()}`}).catch(()=>{})}try{Ro()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupBookmarks-err:${n.toString()}`}).catch(()=>{})}go().catch(n=>{console.warn("Failed to update Synapse visibility in view",n)});try{jo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-initBookmarkManager-err:${n.toString()}`}).catch(()=>{})}document.getElementById("browserBack")?.addEventListener("click",()=>{const n=Je();if(n&&n.canGoBack()){n.goBack();return}no()}),document.getElementById("browserForward")?.addEventListener("click",()=>{const n=Je();n&&n.canGoForward()&&n.goForward()}),document.getElementById("browserReload")?.addEventListener("click",()=>{const n=Je();n&&n.reload()}),document.getElementById("browserDetach")?.addEventListener("click",Ln),document.getElementById("browserDetachHeader")?.addEventListener("click",Ln),yo(),ro(),Go(),Ui(),Co(),uo(),lo(),co(),Xi(),Ji(),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode()}window.addEventListener("beforeunload",()=>{Yt().catch(()=>{}),Vn()});window.addEventListener("teardown-view-system",()=>{console.log("Teardown View System triggered"),Yt().catch(()=>{}),Vn();const e=se.map(t=>t.id);ht(e,{isTeardown:!0});const n=document.getElementById("webviews-container");n&&(n.querySelectorAll(".webcontent-pane").forEach(i=>{try{typeof i.remove=="function"&&i.remove()}catch{}}),n.innerHTML=""),se=[],Ne=null,Pt=!1});function Ut(e){if(!e||e.isHome)return!1;const n=String(e.url||"").trim(),t=String(e.launchedAppType||"").trim().toLowerCase();return!n||n==="about:blank"||n==="newtab"||It(n)||!/^https?:\/\//i.test(n)?!1:!t||t==="website"}function bo({activateVisibleTab:e=!0}={}){if(!Pt||se.length===0)return;const n=se.filter(c=>!c.isHome&&!Ut(c)).map(c=>c.id);if(n.length>0&&ht(n),!e)return;const t=Xe();if(t&&Ut(t)){He(t.id);return}const i=se.find(c=>Ut(c));if(i){He(i.id);return}const r=se.find(c=>c.isHome);if(r){He(r.id);return}if(se.length===0){Le();return}He(se[0].id)}window.addEventListener("ticket-switch-preserve-view",e=>{bo({activateVisibleTab:e?.detail?.activateVisibleTab!==!1})});async function yo(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;const e=JSON.parse(localStorage.getItem(Ke.installedApps)||"{}");let n=!1;for(const[t,i]of Object.entries(e)){const r=String(i?.type||"").toLowerCase();if(qt.has(r)&&i?.localPath)try{const c=await window.api.resolveOneviewAppUrl(t,i.localPath);c?.success&&c.url&&i.oneviewUrl!==c.url&&(e[t]={...i,oneviewUrl:c.url},n=!0)}catch{}}n&&localStorage.setItem(Ke.installedApps,JSON.stringify(e))}window.initViewPage=zn;window.closeViewTab=Gt;function So(){const e=document.getElementById("settingsBtn");e&&e.classList.remove("is-active")}function Jt(){return{modal:document.getElementById("extensionPromptModal"),title:document.getElementById("extensionPromptTitle"),message:document.getElementById("extensionPromptMessage"),label:document.getElementById("extensionPromptLabel"),input:document.getElementById("extensionPromptInput"),textarea:document.getElementById("extensionPromptTextarea"),form:document.getElementById("extensionPromptForm"),submitBtn:document.getElementById("extensionPromptSubmitBtn"),cancelBtn:document.getElementById("extensionPromptCancelBtn"),closeBtn:document.getElementById("extensionPromptCloseBtn")}}async function Eo(e={}){const n=Jt();if(!n.modal||!n.form||!n.input||!n.textarea)return{cancelled:!0,value:""};if(Ye)return{cancelled:!0,value:""};const t=e&&typeof e=="object"?e:{},i=t.multiline===!0,r=t.required!==!1,c=String(t.value||""),g=String(t.title||"Extension Input").trim()||"Extension Input",x=String(t.message||"").trim(),P=String(t.label||"Value").trim()||"Value",L=String(t.submitLabel||"Submit").trim()||"Submit",h=String(t.cancelLabel||"Cancel").trim()||"Cancel",E=String(t.placeholder||"").trim();return n.title.textContent=g,n.message.textContent=x,n.message.classList.toggle("hidden",!x),n.label.textContent=P,n.submitBtn.textContent=L,n.cancelBtn.textContent=h,n.input.classList.toggle("hidden",i),n.textarea.classList.toggle("hidden",!i),n.input.required=!i&&r,n.textarea.required=i&&r,n.input.type=t.password===!0?"password":"text",n.input.placeholder=E,n.textarea.placeholder=E,n.input.value=i?"":c,n.textarea.value=i?c:"",new Promise(I=>{Ye={resolve:I,required:r,multiline:i},rt(()=>{n.modal.classList.remove("hidden"),n.modal.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{(i?n.textarea:n.input).focus(),(i?n.textarea:n.input).select?.()})}).catch(()=>{Ye=null,I({cancelled:!0,value:""})})})}function $n(e={cancelled:!0,value:""}){const n=Jt();if(!n.modal||!Ye)return;const t=Ye;Ye=null,Ge(()=>{n.modal.classList.add("hidden"),n.modal.setAttribute("aria-hidden","true"),n.form.reset(),n.input.classList.remove("hidden"),n.textarea.classList.add("hidden"),n.input.type="text"}),t.resolve(e)}function xo(){return{modal:document.getElementById("profilePromptModal"),select:document.getElementById("profilePromptSelect"),continueBtn:document.getElementById("profilePromptContinueBtn"),cancelBtn:document.getElementById("profilePromptCancelBtn"),closeBtn:document.getElementById("profilePromptCloseBtn")}}let Nt=null;async function Vt(e,n="guest"){const t=xo();if(!t.modal||!t.select)return{cancelled:!0,profileId:n};if(Nt)return{cancelled:!0,profileId:n};let i=n;const r=t.select;r.innerHTML=Object.values(ne).map(g=>{const x=String(g.name||"P").charAt(0).toUpperCase();return`
        <div class="profile-big-item ${g.id===i?"active":""}" data-id="${g.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${g.color};">
            ${x}
          </div>
          <span class="profile-big-name">${xe(g.name)}</span>
        </div>
      `}).join("");const c=g=>{i=g,r.querySelectorAll(".profile-big-item").forEach(x=>{x.classList.toggle("active",x.dataset.id===g)})};r.querySelectorAll(".profile-big-item").forEach(g=>{const x=()=>{const P=g.dataset.id;!P||!ne[P]||c(P)};g.addEventListener("click",x),g.addEventListener("keydown",P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),x())}),g.addEventListener("dblclick",()=>{x(),t.continueBtn?.click()})});try{await rt(()=>{t.modal.classList.remove("hidden"),t.modal.setAttribute("aria-hidden","false")})}catch{return{cancelled:!0,profileId:n}}return new Promise(g=>{Nt={resolve:g};const x=()=>{Ge(()=>{t.modal.classList.add("hidden"),t.modal.setAttribute("aria-hidden","true")}),t.continueBtn?.removeEventListener("click",P),t.cancelBtn?.removeEventListener("click",L),t.closeBtn?.removeEventListener("click",L),t.modal.removeEventListener("click",h),Nt=null},P=()=>{x(),g({cancelled:!1,profileId:i})},L=()=>{x(),g({cancelled:!0,profileId:n})};t.continueBtn?.addEventListener("click",P),t.cancelBtn?.addEventListener("click",L),t.closeBtn?.addEventListener("click",L);const h=E=>{E.target===t.modal&&L()};t.modal.addEventListener("click",h)})}function Co(){const e=Jt();if(!e.modal||e.modal.dataset.boundExtensionPrompt==="1")return;e.modal.dataset.boundExtensionPrompt="1",e.form?.addEventListener("submit",t=>{if(t.preventDefault(),!Ye)return;const i=Ye.multiline?e.textarea:e.input,r=String(i?.value||"");if(Ye.required&&!r.trim()){i?.focus();return}$n({cancelled:!1,value:r})});const n=()=>$n({cancelled:!0,value:""});e.cancelBtn?.addEventListener("click",n),e.closeBtn?.addEventListener("click",n),e.modal.addEventListener("click",t=>{t.target===e.modal&&n()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&Ye&&!e.modal.classList.contains("hidden")&&(t.preventDefault(),n())})}function qn(){return!!Xe()?.lockedProfileId}function vt(e=null){const n=e||Xe(),t=!!n?.lockedProfileId,i=document.getElementById("profileBtn");if(i){if(i.classList.toggle("locked",t),t){const r=ne[n.lockedProfileId]?.name||"assigned";i.title=`Profile locked to ${r} for this tab`}else i.title="Switch Profile";Yn()}}function Yn(){const e=qn();document.querySelectorAll(".profile-item[data-id]").forEach(t=>{t.classList.toggle("disabled",e),t.setAttribute("aria-disabled",e?"true":"false")})}function Xt(e){return Kt(e)}function Io(e){const n=ei(e);!n||!ne[n]||ue!==n&&mt(n,{bypassLock:!0})}function Qt(e,n,t){const i=document.getElementById(e);i&&(i.innerHTML=Object.values(ne).map(r=>`
      <div class="profile-pill-item ${r.id===n?"active":""}" data-id="${r.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${r.color};"></span>
        <span>${xe(r.name)}</span>
      </div>
    `).join(""),i.querySelectorAll(".profile-pill-item").forEach(r=>{const c=()=>{const g=r.dataset.id;!g||!ne[g]||(i.querySelectorAll(".profile-pill-item").forEach(x=>{x.classList.toggle("active",x.dataset.id===g)}),typeof t=="function"&&t(g))};r.addEventListener("click",c),r.addEventListener("keydown",g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),c())})}))}function mt(e,{bypassLock:n=!1}={}){const t=String(e||"").trim();if(!ne[t]){console.warn(`[View] applyProfileSelection: Invalid profile ID "${t}"`);return}if(!n&&qn()){console.log("[View] applyProfileSelection BLOCKED: active tab is locked");return}console.log(`[View] applyProfileSelection: Switching to ${t}`),ue=t,localStorage.setItem(Ke.currentProfileId,t),ri(),document.querySelectorAll(".profile-item").forEach(r=>{r.dataset.id===t?r.classList.add("active"):r.classList.remove("active")})}function yt(e="",n=""){const t=String(n).toLowerCase(),i=String(e).toLowerCase();let r=i;try{r=decodeURIComponent(i)}catch{r=i}const c=`${t} ${i} ${r}`,g=/\bai\b/.test(t),x=/\b(imagine|empower|production ai|imagine wpp)\b/.test(t),P=c.includes("jira.")||c.includes("jira/")||c.includes("atlassian.net")||c.includes("jira.uhub.biz")||t.includes("jira"),L=t.includes("aem")||t.includes("veeva")||t.includes("gsk")||i.includes("gskinternet.com")||i.includes("gsk-contentlab.veevavault.com")||i.includes("veevavault.com"),h=g||x||i.includes("imagine.wpp.ai")||i.includes("://wpp.ai")||i.includes(".wpp.ai")||c.includes("://wpp.")||c.includes(".wpp.")||c.includes("wpp.com");return P?"vml":L?"gsk":h?"wppproduction":null}function Gn(e,n="",t=""){const i=String(e?.lockedProfileId||"").trim().toLowerCase(),r=yt(n,t);return i&&Oi(n,t)?i:r}async function Kn(e,n=null,t="New Tab",i={}){const r=String(n||"").trim(),c=r?Xt(r):null;if(String(e||"").trim().toLowerCase().startsWith("file://"))return{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:tt(e,ne.guest.partition,t,i)};const x=yt(e,t);if(x&&ne[x])return{cancelled:!1,profileId:x,lockedProfileId:x,partition:tt(e,ne[x].partition,t,i)};const P=ai(e),L=c&&P.find(h=>h.profileId===c)||P.find(h=>h.profileId===ue)||P[0]||null;if(L&&ne[L.profileId])return{cancelled:!1,profileId:L.profileId,lockedProfileId:L.profileId,partition:tt(e,ne[L.profileId].partition,t,i)};if(!i?.bypassPrompt&&typeof Vt=="function"){const h=await Vt(e,c||"guest");if(!h||h.cancelled)return{cancelled:!0,profileId:null,lockedProfileId:null,partition:""};const E=ne[h.profileId]?h.profileId:"guest";return{cancelled:!1,profileId:E,lockedProfileId:E,partition:tt(e,ne[E].partition,t,i)}}return c&&ne[c]?{cancelled:!1,profileId:c,lockedProfileId:c,partition:tt(e,ne[c].partition,t,i)}:r?{cancelled:!1,profileId:null,lockedProfileId:null,partition:tt(e,r,t,i)}:{cancelled:!1,profileId:null,lockedProfileId:null,partition:tt(e,ge.guest,t,i)}}async function Lo(e,n,t,i){const r=Gn(e,n,t);if(e.lockedProfileId=r,!r){Ne===e.id&&vt(e);return}const c=ne[r].partition;if(ue!==r&&mt(r,{bypassLock:!0}),e.partition!==c){e.partition=c,i&&!i.isDestroyed?.()&&i.remove();const g=await eo(e);Ne===e.id&&(vt(e),setTimeout(()=>{g.src=n},10));return}Ne===e.id&&vt(e)}function Jn(){return{wppproduction:[],vml:[],gsk:[],guest:[]}}function Xn(e={}){const n=Jn();return Object.keys(n).forEach(t=>{const i=Array.isArray(e?.[t])?e[t]:[];n[t]=i.map(r=>({url:String(r?.url||"").trim(),title:String(r?.title||"Untitled").trim()||"Untitled",visitedAt:r?.visitedAt?Number(r.visitedAt):0})).filter(r=>r.url&&r.url!=="about:blank").slice(0,200)}),n}function Qn(){!window.api||typeof window.api.setOneviewSharedStorage!="function"||window.api.setOneviewSharedStorage(zt,Pe).catch(e=>{console.warn("Could not sync profile history to shared storage",e)})}function Zn(e=null){if(!e||typeof e!="object")return;Pe=Xn(e.value||{});try{localStorage.setItem(jt,JSON.stringify(Pe))}catch{}!document.getElementById("historyManagerModal")?.classList.contains("hidden")&&li()}async function Po(){if(!(!window.api||typeof window.api.getOneviewSharedStorage!="function"))try{const e=await window.api.getOneviewSharedStorage(zt);e?.success&&e.entry?Zn(e.entry):Qn()}catch(e){console.warn("Could not hydrate profile history from shared storage",e)}}function ko(){try{const e=JSON.parse(localStorage.getItem(jt)||"{}");Pe=Xn(e)}catch{Pe=Jn()}}function Zt(){localStorage.setItem(jt,JSON.stringify(Pe)),Qn()}function ei(e){return e&&(e.lockedProfileId||Kt(e.partition))||ue}function ti(e){return e&&(jn(e.partition)||e.lockedProfileId)||ue}function Bo(e,n,t){if(!Pe[e])return;const i=String(n||"").trim();if(!i||i==="about:blank"||i.startsWith("devtools://"))return;const r=String(t||"Untitled").trim()||"Untitled",c=Pe[e]||[],g=c.findIndex(P=>P.url===i),x={url:i,title:r,visitedAt:Date.now()};g===0?c[0]=x:(g>0&&c.splice(g,1),c.unshift(x)),Pe[e]=c.slice(0,200),Zt()}function ni(e){if(!e)return"Unknown Date";try{return new Date(e).toLocaleString()}catch{return""}}function Ao(){if(wt!==null)return wt;try{wt=window.api&&typeof window.api.getWebviewPreloadPath=="function"?window.api.getWebviewPreloadPath():""}catch{wt=""}return wt}function To(e,n={}){const t=String(n?.appType||"").trim().toLowerCase(),i=String(e||"").trim().toLowerCase();return typeof n?.requiresPlatformApi=="boolean"?n.requiresPlatformApi:t&&t!=="website"?!0:t==="website"&&It(i)}function $o(e){return e?.getAttribute("data-platform-api-enabled")==="1"}function _o(e,n){!e||typeof e.setAttribute!="function"||e.setAttribute("data-platform-api-enabled",n?"1":"0")}function Do(e=""){const n=String(e).trim();if(!n)return"APP";const t=n.split(/\s+/).filter(Boolean);return t.length===1?t[0].slice(0,3).toUpperCase():t.slice(0,3).map(i=>i[0]).join("").toUpperCase()}function Mo(e=""){const n=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)","linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)","linear-gradient(to right, #4facfe 0%, #00f2fe 100%)","linear-gradient(to top, #30cfd0 0%, #330867 100%)"],t=String(e);let i=0;for(let r=0;r<t.length;r+=1)i=(i+t.charCodeAt(r)*(r+1))%n.length;return n[i]}function Uo(e="app"){let n=document.getElementById("view-launch-loader");n?n.style.display="flex":(n=document.createElement("div"),n.id="view-launch-loader",n.style.cssText=["position:fixed","inset:0","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","background:rgba(15,23,42,0.45)","backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)"].join(";"),n.innerHTML=`
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
    `,document.body.appendChild(n));const t=n.querySelector("p");return t&&(t.textContent=`Opening ${e||"app"}...`),()=>{n&&(n.style.display="none")}}async function No(e){if(!e)return;const t=JSON.parse(localStorage.getItem(Ke.installedApps)||"{}")[e];if(!t){console.warn("Installed app not found:",e);return}const i=t.name||"App",r=Uo(i),c=Ei(t);console.log("[OneView Tracking] View launch decision",{appId:e,appName:t?.name||"",appType:t?.type||"",clickTrackingMode:t?.clickTrackingMode||"",trackOnLaunch:t?.trackOnLaunch,oneviewUrl:t?.oneviewUrl||"",hasLocalPath:!!t?.localPath,shouldTrackLaunch:c}),c&&xi({currentSelectedTicketId:window.currentActiveTicketKey||"",clickedAppName:i});try{if(un(t)){await yi(t),We(`Opened "${i}" in a separate window.`,"info");return}const g=()=>Xe()?.partition||ne[ue]?.partition||ge.guest,x=async(L,h={})=>{await Le(L,g(),i,null,{hideControls:!0,appType:t.type,trackingAppId:e,trackingAppName:i,bypassPrompt:!0,...h})},P=String(t.type||"").toLowerCase();if(qt.has(P)&&t.localPath){Pn(`Starting ${i}...`);let L=String(t.oneviewUrl||"").trim();if(window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const E=await window.api.resolveOneviewAppUrl(e,t.localPath,"/",g());if(E?.success&&E.url){L=E.url;const I=JSON.parse(localStorage.getItem(Ke.installedApps)||"{}");I[e]&&(I[e]={...I[e],oneviewUrl:L},localStorage.setItem(Ke.installedApps,JSON.stringify(I)))}}const h=["nextjs","next","vite-server"].includes(P);if(L&&It(L)&&h&&(L=""),L&&It(L))await x(L);else{const E=await window.api.launchNextApp(t.localPath,t.type);await x(E)}return}if(t.type==="website"&&t.url){await x(t.url);return}if(t.type==="exe"&&t.localPath){Pn(`Launching ${i}...`);const L=await window.api.launchExe(t.localPath,t.tech);if(L&&L.mode==="embedded"&&L.url){const h=new URLSearchParams;L.token&&h.set("NL_TOKEN",L.token),t.tech&&h.set("TECH",t.tech);const E=String(L.url).split(":")[2];E&&h.set("NL_PORT",E);const I=`${L.url}?${h.toString()}`;await x(I)}else L?.success&&L.mode==="external"?We(`Opened "${i}" in a separate window.`,"info"):alert(`${i} launched externally. Embedded view is not available for this app.`);return}alert(`Cannot launch "${i}". Missing supported launch configuration.`)}catch(g){if(un(t)){console.error("Failed to launch external Electron app from view:",g),We(`Failed to launch "${i}".`,"error");return}console.error("Failed to launch installed app from view:",g),alert(`Failed to launch "${i}": ${g.message||g}`)}finally{r()}}async function ii(e,n=null,t="New Tab",i=!1,r={}){const c=String(e||"").trim();if(!c)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){const H=ge.gsk;window.enterSiteSnapStudioMode();const j=kn(),Z=(j||[]).some(de=>{const q=String(de.url||"").trim();return q&&q!=="about:blank"&&q!=="newtab"});!j||j.length===0||i||Z?await Le(c,H,t,null,r):await bt(c,H,t,null,r);return}let g=i;c.toLowerCase().startsWith("file://")&&(g=!0);const P=await Kn(c,n,t,r);if(!P||P.cancelled)return;const L=P.partition,h=P.profileId,E=P.lockedProfileId;h&&h!==_i()&&mt(h,{bypassLock:!0});const I=kn();if(!I||I.length===0){await Le(c,L,t,E,r);return}const A=I.some(H=>{const j=String(H.url||"").trim();return j&&j!=="about:blank"&&j!=="newtab"});if(g||A){await Le(c,L,t,E,r);return}let N=Xe();if(!N){const H=I[I.length-1];H&&(await He(H.id),N=H)}if(!N){await Le(c,L,t,E,r);return}await bt(c,L,t,E,r)}window.initViewPage=zn;window.createTab=Le;window.launchInstalledAppFromView=No;window.openUrlFromDashboard=ii;function Oo(){const e=localStorage.getItem(Ke.currentProfileId);e&&ne[e]?ue=e:ue="guest",ri();const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");n&&t&&(n.addEventListener("click",async i=>{i.stopPropagation(),t.classList.contains("hidden")?await rt(()=>t.classList.remove("hidden")):Ge(()=>t.classList.add("hidden"))}),t.innerHTML=Object.values(ne).map(i=>`
        <div class="profile-item ${i.id===ue?"active":""}" data-id="${i.id}">
            <div class="profile-item-dot" style="background-color: ${i.color}"></div>
            <span>${i.name}</span>
        </div>
    `).join("").concat(`
        <div class="profile-divider"></div>
        <div class="profile-item" data-action="manage-passwords">
          <div class="profile-item-dot" style="background-color: #6366f1"></div>
          <span>Manage Passwords</span>
        </div>
      `),t.querySelectorAll(".profile-item").forEach(i=>{i.addEventListener("click",async()=>{if(i.dataset.action==="manage-passwords"){Wt("passwords"),Ge(()=>t.classList.add("hidden"));return}const r=i.dataset.id;i.classList.contains("disabled")||(oi(r),Ge(()=>t.classList.add("hidden")))})}),Yn())}function oi(e){mt(e)}function ri(){const e=ne[ue],n=document.getElementById("profileBtn"),t=document.getElementById("profileLabel");n&&t&&(t.textContent=e.label,t.style.color=e.color),vt()}function Ro(){const e=document.querySelector(".bookmarks-grid");e&&e.addEventListener("click",n=>{const t=n.target.closest(".bookmark-edit-btn");if(t){n.preventDefault(),n.stopPropagation();const I=t.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;I&&zo(I);return}const i=n.target.closest(".bookmark-delete-btn");if(i){n.preventDefault(),n.stopPropagation();const I=i.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;I&&(Te=Te.filter(A=>A.id!==I),si(),en());return}const r=n.target.closest(".bookmark-card");if(!r||r.id==="addBookmarkBtn"||r.classList.contains("add-bookmark-card"))return;const c=r.dataset.url,g=r.dataset.title||"New Tab",x=String(r.dataset.partition||"").trim(),P=String(r.dataset.sessionScope||"").trim(),h=r.dataset.profileId||Xt(r.dataset.partition)||yt(c||"",g)||ue;if(h!==ue&&oi(h),c){const E=tt(c,x||ne[h].partition,g,P?{sessionScope:P}:{});bt(c,E,g,yt(c||"",g))}})}function ft(e=""){const n=String(e).trim();return n?/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/^about:/i.test(n)?n:`https://${n}`:""}function Bt(e=""){const n=ft(e);if(!n)return"";try{const t=new URL(n),i=t.pathname.length>1?t.pathname.replace(/\/+$/,"")||"/":t.pathname||"/";return`${t.origin}${i}${t.search}${t.hash}`}catch{return n.replace(/\/+$/,"")}}function ai(e=""){const n=Bt(e);return n?Te.filter(t=>Bt(t.url)===n):[]}function Fo(e="",n=""){const t=ai(e);return n?t.find(i=>String(i.profileId||"").trim().toLowerCase()===n)||null:t[0]||null}function Ho(e=null){return e?String(e.lockedProfileId||"").trim().toLowerCase()||Xt(e.partition)||ue||"guest":ue||"guest"}function Wo(){try{const e=JSON.parse(localStorage.getItem(On)||"[]");Te=Array.isArray(e)?e.map(n=>({id:String(n?.id||""),title:String(n?.title||"").trim(),url:ft(n?.url||""),profileId:ne[n?.profileId]?n.profileId:"guest"})).filter(n=>n.id&&n.title&&n.url):[]}catch{Te=[]}}function si(){localStorage.setItem(On,JSON.stringify(Te))}function Vo({id:e="",title:n="",url:t="",profileId:i="guest"}){const r=ft(t),c=String(n||"").trim()||r,g=ne[i]?i:"guest",x=Bt(r);if(!r||!x)return!1;const P=Te.findIndex(h=>e&&h.id===e?!0:Bt(h.url)===x&&String(h.profileId||"guest")===g),L={id:P>=0?Te[P].id:e||`bm-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:c,url:r,profileId:g};return P>=0?Te[P]={...Te[P],...L}:Te.unshift(L),P>=0?"updated":"created"}function en(){const e=document.querySelector(".bookmarks-grid");if(!e)return;e.querySelectorAll(".bookmark-card.custom-bookmark").forEach(i=>i.remove());const n=Te.map(i=>{const r=ne[i.profileId]||ne.guest;return`
        <div
          class="bookmark-card custom-bookmark"
          data-bookmark-id="${xe(i.id)}"
          data-url="${xe(i.url)}"
          data-title="${xe(i.title)}"
          data-profile-id="${xe(i.profileId)}"
        >
          <button class="bookmark-edit-btn" type="button" title="Edit Bookmark">E</button>
          <button class="bookmark-delete-btn" type="button" title="Remove Bookmark">X</button>
          <div class="bookmark-icon" style="background:${Mo(i.title)};">
            <span>${xe(Do(i.title))}</span>
          </div>
          <div class="bookmark-info">
            <h3>${xe(i.title)}</h3>
            <p>${xe(r.name)} Profile</p>
          </div>
        </div>
      `}).join(""),t=document.getElementById("addBookmarkBtn");t?t.insertAdjacentHTML("beforebegin",n):e.insertAdjacentHTML("beforeend",n)}function jo(){const e=document.getElementById("addBookmarkBtn"),n=document.getElementById("bookmarkCurrentPageHeaderBtn"),t=document.getElementById("bookmarkModal"),i=document.getElementById("bookmarkModalCloseBtn"),r=document.getElementById("bookmarkForm"),c=document.getElementById("bookmarkTitleInput"),g=document.getElementById("bookmarkUrlInput"),x=t?.querySelector(".password-modal-header h3"),P=document.getElementById("bookmarkSaveBtn");if(!e||!t||!i||!r||!c||!g)return;const L=()=>{Ge(()=>{t.classList.add("hidden"),Ct=null})},h=async({editId:A=null,title:N="",url:H="",profileId:j=ue,heading:Z="Add Bookmark",saveLabel:de="Save Bookmark"}={})=>{Ct=A,st=ne[j]?j:ue,Qt("bookmarkProfileSelect",st,q=>{st=q}),x&&(x.textContent=Z),P&&(P.textContent=de),r.reset(),c.value=String(N||""),g.value=String(H||""),await rt(()=>t.classList.remove("hidden")),c.value?(c.focus(),c.select()):c.focus()},E=async()=>{await h()},I=async()=>{const A=Xe(),N=ft(A?.url||"");if(!A||A.isHome||!N||N==="about:blank"){We("Open a website tab first to save it as a bookmark.","error");return}const H=Ho(A),j=Fo(N,H);await h({editId:j?.id||null,title:A.title||j?.title||"New Bookmark",url:N,profileId:H,heading:j?"Update Bookmark":"Save Current Site",saveLabel:j?"Update Bookmark":"Save Bookmark"})};e.addEventListener("click",E),e.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await E())}),n?.addEventListener("click",I),n?.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await I())}),i.addEventListener("click",L),t.addEventListener("click",A=>{A.target===t&&L()}),r.addEventListener("submit",A=>{A.preventDefault();const N=String(c.value||"").trim(),H=ft(g.value);if(!N||!H)return;const j=Vo({id:Ct,title:N,url:H,profileId:st||ue});j&&(si(),en(),L(),r.reset(),We(j==="updated"?"Bookmark updated successfully.":"Bookmark saved successfully.","success"))})}async function zo(e){const n=document.getElementById("bookmarkModal"),t=document.getElementById("bookmarkForm"),i=document.getElementById("bookmarkTitleInput"),r=document.getElementById("bookmarkUrlInput"),c=n?.querySelector(".password-modal-header h3"),g=document.getElementById("bookmarkSaveBtn");if(!n||!t||!i||!r)return;const x=Te.find(P=>P.id===e);x&&(Ct=x.id,st=x.profileId||ue,c&&(c.textContent="Edit Bookmark"),g&&(g.textContent="Update Bookmark"),Qt("bookmarkProfileSelect",st,P=>{st=P}),i.value=x.title||"",r.value=x.url||"",await rt(()=>n.classList.remove("hidden")),i.focus())}function qo(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;const i=220;n.addEventListener("click",()=>{e.scrollBy({left:-i,behavior:"smooth"})}),t.addEventListener("click",()=>{e.scrollBy({left:i,behavior:"smooth"})}),e.addEventListener("scroll",At),At()}function li(){const e=document.getElementById("historyList"),n=document.getElementById("historyProfileSelect");if(!e||!n)return;const t=Ft||ue,i=Pe[t]||[];if(i.length===0){e.innerHTML="<div class='password-meta'>No history for this profile yet.</div>";return}const r=new Date,c=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),g=c-864e5,x={today:[],yesterday:[],older:[]};i.forEach((I,A)=>{const N={...I,originalIndex:A},H=I.visitedAt||0;H>=c?x.today.push(N):H>=g?x.yesterday.push(N):x.older.push(N)});const P=I=>I.toLocaleDateString(void 0,{month:"short",day:"numeric"}),L=`Today - ${P(r)}`,h=`Yesterday - ${P(new Date(g))}`,E=(I,A,N=!1)=>{if(A.length===0)return"";const H=A.map(j=>`
      <div class="history-item" data-index="${j.originalIndex}">
        <div class="history-main">
          <div class="history-title">${xe(j.title||"Untitled")}</div>
          <div class="history-url">${xe(j.url||"")}</div>
          <div class="password-meta">${xe(ni(j.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `).join("");return`
      <details class="history-group" ${N?"open":""}>
        <summary class="history-group-title">
          <span>${I}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${A.length}</span>
        </summary>
        <div class="history-group-content">
          ${H}
        </div>
      </details>
    `};e.innerHTML=`
    ${E(L,x.today,x.today.length>0)}
    ${E(h,x.yesterday,!1)}
    ${E("Older",x.older,!1)}
  `,e.querySelectorAll(".history-item").forEach(I=>{I.addEventListener("click",A=>{const N=A.target.closest("button");if(!N)return;const H=Number(I.dataset.index);if(Number.isNaN(H))return;const j=Pe[t]||[],Z=j[H];if(Z){if(N.dataset.action==="delete"){j.splice(H,1),Pe[t]=j,Zt(),li();return}if(N.dataset.action==="open"){const de=ne[t]?.partition||ge.guest;Le(Z.url,de,Z.title||"History",t)}}})})}async function ot({title:e="Clear Page Cache",message:n="",confirmLabel:t="OK",cancelLabel:i="Cancel",hideCancel:r=!1}={}){const c=document.getElementById("cacheActionModal"),g=document.getElementById("cacheActionTitle"),x=document.getElementById("cacheActionMessage"),P=document.getElementById("cacheActionCloseBtn"),L=document.getElementById("cacheActionCancelBtn"),h=document.getElementById("cacheActionConfirmBtn");return!c||!g||!x||!P||!L||!h?Promise.resolve(window.confirm(n||e)):(g.textContent=e,x.textContent=n,h.textContent=t,L.textContent=i,L.style.display=r?"none":"inline-flex",await rt(()=>c.classList.remove("hidden")),new Promise(E=>{const I=()=>{P.removeEventListener("click",A),L.removeEventListener("click",A),h.removeEventListener("click",N),c.removeEventListener("click",H),Ge(()=>c.classList.add("hidden"))},A=()=>{I(),E(!1)},N=()=>{I(),E(!0)},H=j=>{j.target===c&&A()};P.addEventListener("click",A),L.addEventListener("click",A),h.addEventListener("click",N),c.addEventListener("click",H)}))}function At(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;if(!(e.scrollWidth>e.clientWidth+1)){n.classList.add("hidden"),t.classList.add("hidden"),e.scrollLeft=0;return}const r=e.scrollLeft<=1,c=e.scrollLeft+e.clientWidth>=e.scrollWidth-1;n.classList.toggle("hidden",r),t.classList.toggle("hidden",c)}function tn(e){if(!e)return null;if(typeof e.getWebContentsId=="function")try{const n=e.getWebContentsId();if(n)return n}catch{}return e._webContent?e._webContent.key||e._webContent.id||null:e.key||e.id||e.getAttribute("key")||e.getAttribute("id")||null}async function Yo(e,n){const t=se.findIndex(r=>r.id===n),i=se[t];if(e==="duplicate-tab"&&i){to(n);return}if(e==="inspect-local-file"&&i){const r=document.getElementById(`webview-${i.id}`),c=tn(r);if(!c||!window.api?.toggleWebviewDevTools){We(Lt?"Inspect is not available for this tab.":"Inspect is not available for this local file tab.","error");return}await window.api.toggleWebviewDevTools(c)||We(Lt?"Could not open developer tools.":"Could not open developer tools for this local file.","error");return}if(e==="clear-cache"&&i){const r=document.getElementById(`webview-${i.id}`),c=r&&typeof r.getURL=="function"&&r.getURL()||i.url||"",g=r&&r.getAttribute("partition")||i.partition||ge.guest;if(!c||c==="about:blank"||!await ot({title:"Clear Page Cache",message:`Clear cache and site data for ${c}?`,confirmLabel:"Clear Cache",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewPageCache!="function"){await ot({title:"Action Unavailable",message:"Cache clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const P=await window.api.clearWebviewPageCache(g,c);P?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await ot({title:"Could Not Clear Cache",message:P?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(P){const L=String(P?.message||P||""),h=/No handler registered for 'clear-webview-page-cache'/.test(L)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await ot({title:"Could Not Clear Cache",message:`${L}${h}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-user-data"&&i){const r=document.getElementById(`webview-${i.id}`),c=r&&typeof r.getURL=="function"&&r.getURL()||i.url||"",g=r&&r.getAttribute("partition")||i.partition||ge.guest;if(!c||c==="about:blank"||!await ot({title:"Clear User Data",message:`Clear local storage and site data for ${c}?`,confirmLabel:"Clear Data",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewUserData!="function"){await ot({title:"Action Unavailable",message:"User-data clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const P=await window.api.clearWebviewUserData(g,c);P?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await ot({title:"Could Not Clear User Data",message:P?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(P){const L=String(P?.message||P||""),h=/No handler registered for 'clear-webview-user-data'/.test(L)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await ot({title:"Could Not Clear User Data",message:`${L}${h}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-all"){ht(se.map(r=>r.id));return}if(e==="clear-right"&&t>=0){ht(se.slice(t+1).map(r=>r.id));return}e==="clear-left"&&t>=0&&ht(se.slice(0,t).map(r=>r.id))}function Go(){const e=document.querySelector(".tabs-header");e&&e.addEventListener("contextmenu",async n=>{if(n.target.closest(".profile-section"))return;n.preventDefault();const r=n.target.closest(".tab")?.id?.replace("tab-ui-","")||Ne||se[0]?.id||null;if(!r)return;Nn=r;const c=se.findIndex(I=>I.id===r),g=se[c],x=document.getElementById(`webview-${r}`),P=io(g,x),L=!!(g&&!g.isHome&&(x&&x.getURL()!=="about:blank"||g.url)),h=c>0?c:0,E=c>=0&&c<se.length-1?se.length-c-1:0;window.api&&typeof window.api.showNativeTabContextMenu=="function"&&await window.api.showNativeTabContextMenu({anchorId:r,x:Math.round(n.x),y:Math.round(n.y),disabled:{clearLeft:h===0,clearRight:E===0,clearCache:!L,clearUserData:!L,inspectLocalFile:!P}})})}function Ot(e){if(!e)return"";const n=String(e.getData("text/uri-list")||"").split(/\r?\n/).map(c=>c.trim()).find(c=>c&&!c.startsWith("#"));if(n&&/^https?:\/\//i.test(n))return n;const i=String(e.getData("text/html")||"").match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);if(i&&/^https?:\/\//i.test(String(i[1]||"").trim()))return String(i[1]||"").trim();const r=String(e.getData("text/plain")||"").trim();return/^https?:\/\//i.test(r)?r:r&&!/\s/.test(r)&&/\./.test(r)?ft(r):""}function Ko(){const e=document.querySelector(".tabs-header");if(!e||e.dataset.dropBound==="1")return;e.dataset.dropBound="1";const n=t=>{e.classList.toggle("is-drop-target",!!t)};e.addEventListener("dragenter",t=>{Ot(t.dataTransfer)&&(t.preventDefault(),n(!0))}),e.addEventListener("dragover",t=>{Ot(t.dataTransfer)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),n(!0))}),e.addEventListener("dragleave",t=>{e.contains(t.relatedTarget)||n(!1)}),e.addEventListener("drop",t=>{const i=Ot(t.dataTransfer);if(n(!1),!i)return;t.preventDefault();const c=t.target.closest(".tab")?.id?.replace("tab-ui-","")||Ne,g=se.findIndex(x=>x.id===c);Le(i,null,"New Tab",null,{insertIndex:g>=0?g+1:se.length})})}function Jo(e){const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");!n||!t||!n.contains(e.target)&&!t.contains(e.target)&&!t.classList.contains("hidden")&&Ge(()=>t.classList.add("hidden"))}async function Xo(e){const n=String(e?.action||"");if(!n||n==="__menu_closed__")return;const t=String(e?.anchorId||Nn||Ne||se[0]?.id||"");t&&await Yo(n,t)}const _n={desktop:{width:1920,height:1080,userAgent:"desktop"},mobile:{width:414,height:896,userAgent:"mobile"},tablet:{width:768,height:1024,userAgent:"tablet"}};async function ci(e,n="mobile"){if(!e)throw new Error("No active webview");const t=_n[n]||_n.mobile;if(console.log(`[Viewport] Setting ${n} viewport: ${t.width}x${t.height}`),window.api?.setWebviewBounds){const i=tn(e);i&&(console.log(`[Viewport] Triggering native resize to ${t.width}x${t.height} for id: ${i}`),await window.api.setWebviewBounds(i,{width:t.width,height:t.height}))}return window.__oneview_original_webview_dims||(window.__oneview_original_webview_dims={width:e.style.width,height:e.style.height,minWidth:e.style.minWidth,minHeight:e.style.minHeight,maxWidth:e.style.maxWidth,maxHeight:e.style.maxHeight,flex:e.style.flex}),e.style.width=t.width+"px",e.style.height=t.height+"px",e.style.minWidth=t.width+"px",e.style.minHeight=t.height+"px",e.style.maxWidth=t.width+"px",e.style.maxHeight=t.height+"px",e.style.flex="none",console.log(`[Viewport] Resized webview element to ${t.width}x${t.height}`),await e.executeJavaScript(`
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
    `,!0),await new Promise(i=>setTimeout(i,300)),t}async function Qo(e){if(e&&window.api?.setWebviewBounds){const n=document.getElementById("webviews-container"),t=tn(e);if(n&&t){const i=n.getBoundingClientRect();await window.api.setWebviewBounds(t,{width:Math.round(i.width),height:Math.round(i.height)})}}}async function di(e){if(console.log("[Viewport] Resetting to original viewport"),window.__oneview_original_webview_dims&&e){const n=window.__oneview_original_webview_dims;e.style.width=n.width,e.style.height=n.height,e.style.minWidth=n.minWidth,e.style.minHeight=n.minHeight,e.style.maxWidth=n.maxWidth,e.style.maxHeight=n.maxHeight,e.style.flex=n.flex,window.__oneview_original_webview_dims=null,await Qo(e),console.log("[Viewport] Webview element dimensions and native bounds restored")}await e.executeJavaScript(`
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
    `,!0),await new Promise(n=>setTimeout(n,500))}async function Zo(e={}){const n=Je();if(!n||typeof n.executeJavaScript!="function")throw new Error("Active tab is unavailable");if(typeof n.capturePage!="function")throw new Error("Active tab does not support capture");const t=String(e?.viewport||"desktop").trim().toLowerCase();if(console.log("[Capture] Active webview found",{id:n.id,url:n.getURL?.(),title:n.getTitle?.(),viewport:t,loading:n._webContent?.state?.loading}),t==="mobile"||t==="tablet"){const q=t==="tablet"?"tablet":"mobile";await ci(n,q),console.log("[Capture] Viewport changed to "+q+", waiting for page reflow..."),await new Promise(oe=>setTimeout(oe,300))}const i=5e3,r=Date.now();for(;n._webContent?.state?.loading&&Date.now()-r<i;)console.log("[Capture] Waiting for page to load..."),await new Promise(q=>setTimeout(q,200));console.log("[Capture] Page load status:",n._webContent?.state?.loading?"still loading":"loaded");const c=String(e?.mode||"visible").trim().toLowerCase();if(c!=="full"&&c!=="fullpage"){const q=await n.capturePage(),oe=q?.isEmpty?.()?"":q.toDataURL();return console.log("[CapturePage] Visible captured. DataUrl length:",oe?.length||0),{mode:"visible",dataUrl:oe,width:q?.getSize?.()?.width||0,height:q?.getSize?.()?.height||0}}const g=await n.executeJavaScript(`
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
    `,!0);Math.max(1,Number(g?.totalWidth||0));let x=Math.max(1,Number(g?.totalHeight||0));Math.max(1,Number(g?.viewportWidth||0));let P=Math.max(1,Number(g?.viewportHeight||0));if(console.log("[FullCapture] Starting capture process..."),console.log("[FullCapture] Initial metrics:",g),await n.executeJavaScript(`
    (() => {
      const style = document.createElement('style');
      style.id = '__oneview_force_auto_scroll__';
      style.textContent = 'html, body, * { scroll-behavior: auto !important; }';
      (document.head || document.documentElement).appendChild(style);
    })();
  `,!0).catch(()=>{}),x>P+100){console.log("[FullCapture] Verifying scroll functionality...");const oe=await n.executeJavaScript(`
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
    `,!0).catch(()=>null);console.log("[FullCapture] Verification scroll results:",oe);const be=Number(oe?.startY||0),Ce=Number(oe?.endY||0);if(Ce-be<10)throw new Error("Scroll verification failed: page did not scroll (startY="+be+", endY="+Ce+"). Capture aborted to prevent repeating/empty fallback images.");await n.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `,!0).catch(()=>{})}const L=Math.floor(P*.8),h=Math.ceil(x/L);console.log("[FullCapture] Progressive scroll: "+h+" steps, "+L+"px per step");let E=0;for(let q=0;q<h;q++){E=Math.min(E+L,x),console.log(`[FullCapture] Scrolling host-driven to ${E}px (${q+1}/${h})`);const oe=`
      (() => {
        const targetY = ${E};
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
    `;await n.executeJavaScript(oe,!0).catch(()=>{}),await new Promise(be=>setTimeout(be,600))}await n.executeJavaScript(`window.scrollTo({ top: ${x}, left: 0, behavior: 'auto' });`,!0).catch(()=>{}),await new Promise(q=>setTimeout(q,800)),await n.executeJavaScript(`
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
  `;await n.executeJavaScript(I,!0).catch(()=>{});let A=0,N=!1;for(;!N&&A<50;)await n.executeJavaScript("(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)",!0).catch(()=>0)<=5?N=!0:(await n.executeJavaScript(I,!0).catch(()=>{}),await new Promise(oe=>setTimeout(oe,100)),A++);await n.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");const H=Number(e?.wait||0)*1e3,j=200+H;console.log(`[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${j}ms (Base 0.2s + User ${H}ms) for page to settle live...`),await new Promise(q=>setTimeout(q,j));let Z="",de=null;try{console.log("[FullCapture] Calling native one-shot capture..."),de=await n.capturePage({mode:"full",scrollHeight:Math.round(x)}),Z=de?.isEmpty?.()?"":de.toDataURL()}finally{console.log("[FullCapture] Restoring original body and globals..."),await n.executeJavaScript(`
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
        window.scrollTo(${Math.round(Number(g?.scrollX||0))}, ${Math.round(Number(g?.scrollY||0))});
      `,!0).catch(()=>{})}if(!Z)throw new Error("Full page capture returned empty image data");return{mode:"full",dataUrl:Z,width:de?.getSize?.()?.width||0,height:de?.getSize?.()?.height||0,tileCount:1}}async function er(e){const n=String(e?.command||"").trim(),t=String(e?.url||"").trim(),i=String(e?.requestId||"").trim();if(!n)return;if(n==="execute-script"){const h=String(e?.source||"");let E={requestId:i,success:!1,message:"No active tab"};try{const I=Je();if(!I||typeof I.executeJavaScript!="function")E={requestId:i,success:!1,message:"Active tab is unavailable"};else{const A=`
          (() => {
            const run = () => {
              ${h}
            };
            return run();
          })();
        `,N=await I.executeJavaScript(A,!0);E={requestId:i,success:!0,result:N}}}catch(I){E={requestId:i,success:!1,message:I?.message||String(I)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(E);return}if(n==="ui-prompt"){let h={requestId:i,success:!1,message:"Prompt request failed"};try{const E=await Eo(e?.prompt||{});h={requestId:i,success:!0,result:E}}catch(E){h={requestId:i,success:!1,message:E?.message||String(E)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(h);return}if(n==="capture-page"){let h={requestId:i,success:!1,message:"Capture request failed",key:e?.key||"view:extension-popup"};try{const E=String(e?.options?.mode||"visible").trim().toLowerCase(),I=String(e?.options?.viewport||"desktop").trim().toLowerCase(),A=Number(e?.options?.wait||0);if(console.log("[View] Capturing mode:",E,"viewport:",I,"wait:",A),E==="full"||E==="fullpage"){console.log("[View] Using full-page capture function");const N=await Zo({mode:E,viewport:I,wait:A});h={requestId:i,success:!0,result:N,key:e?.key||"view:extension-popup"}}else{const N=Je();if(!N||typeof N.capturePage!="function")throw new Error("Active tab does not support capture");if(console.log("[View] Capturing visible area from webview id:",N.id),I==="mobile"||I==="tablet"){const de=I==="tablet"?"tablet":"mobile";await ci(N,de),console.log("[View] Viewport changed to "+de+", waiting for page reflow..."),await new Promise(q=>setTimeout(q,800))}const H=await N.capturePage(),j=H?.isEmpty?.()?"":H.toDataURL?.();console.log("[View] Visible capture dataUrl length:",j?.length||0);const Z={mode:"visible",dataUrl:j,width:H?.getSize?.()?.width||0,height:H?.getSize?.()?.height||0};(I==="mobile"||I==="tablet")&&await di(N),h={requestId:i,success:!0,result:Z,key:e?.key||"view:extension-popup"}}}catch(E){console.error("[View] Capture error:",E),h={requestId:i,success:!1,message:E?.message||String(E),key:e?.key||"view:extension-popup"}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(h);return}if(n==="tabs-create"){const h=String(e.url||"").trim(),E=e.requestId;let I=e.partition||null;if(!I&&h.startsWith(`${Ci}://`))try{I=`ext-${new URL(h).host}`}catch{}const A=I?pt(I):"",N=se.find(H=>H.url&&H.url.includes("result.html")&&(!A||pt(H.partition||"")===A));N?(console.log("[View] Reusing existing result tab:",N.id),await oo(N.id,h,I,"Result"),e.active!==!1&&await He(N.id)):await Le(h,I,"Result",null,{active:e.active!==!1,extensionEntryPath:e.entryPath}),E&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:E,success:!0});return}if(n==="tabs-close"){let h={requestId:i,success:!1,message:"Tab not found"};try{const E=String(e?.tabId||"").trim();se.find(A=>A.id===E)?(Gt(E),h={requestId:i,success:!0,result:{id:E,closed:!0}}):h={requestId:i,success:!1,message:"Tab not found"}}catch(E){h={requestId:i,success:!1,message:E?.message||String(E)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(h);return}if(!t)return;const r=Xe(),c=Je(),g=r?.partition||ne[ue]?.partition||ge.guest,x=/^file:\/\//i.test(t),P={extensionEntryPath:x?String(e?.entryPath||"").trim():"",extensionActiveContext:{url:String(c?.getURL?.()||r?.url||"").trim(),title:String(c?.getTitle?.()||r?.title||"").trim()},active:e?.active!==!1};if(x){const h=se.find(E=>E.url===t);if(h){await He(h.id),i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:h.id,url:t,title:h.title||"New Tab",active:!0}});return}}if(n==="tabs-update"&&r&&!r.isHome&&!r.nativePage){await bt(t,g,"New Tab",null,P),i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:r.id,url:t,title:r.title||"New Tab",active:!0}});return}r?.id;const L=Le(t,g,"New Tab",null,P);i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:L?.id||"",url:t,title:L?.title||"New Tab",active:e?.active!==!1}})}function tr(){Cn||(Cn=!0,document.addEventListener("click",Jo),document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const n=String(e.key||"").toLowerCase();if(!(!(e.key==="Tab"||e.key==="PageUp"||e.key==="PageDown")&&po(e.target))){if(n==="h"&&!e.shiftKey){e.preventDefault(),Wt("history");return}if(n==="d"&&e.shiftKey){e.preventDefault(),Wt("downloads");return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation(),xt(e.shiftKey?-1:1);return}if(e.key==="PageUp"){e.preventDefault(),e.stopPropagation(),xt(-1);return}e.key==="PageDown"&&(e.preventDefault(),e.stopPropagation(),xt(1))}},!0),window.addEventListener("resize",At),Ko(),window.api&&typeof window.api.onViewTabShortcut=="function"&&window.api.onViewTabShortcut(e=>{const n=Number(e?.direction||0);n&&xt(n<0?-1:1)}),window.api&&typeof window.api.onBrowserExtensionsUpdated=="function"&&window.api.onBrowserExtensionsUpdated(()=>{console.log("Browser extensions updated, refreshing UI..."),Wn().catch(()=>{})}),window.api&&typeof window.api.onNativeTabContextAction=="function"&&window.api.onNativeTabContextAction(e=>{Xo(e).catch(()=>{})}),window.api&&typeof window.api.onBrowserExtensionCommand=="function"&&window.api.onBrowserExtensionCommand(e=>{er(e).catch(n=>{console.error("Browser extension command failed",n)})}))}let Rt,Dn;const Mn=new ResizeObserver(()=>{const e=Je();!e||typeof e.syncBounds!="function"||(e.syncBounds(!0),clearInterval(Rt),clearTimeout(Dn),Rt=setInterval(()=>{const n=Je();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},50),Dn=setTimeout(()=>{clearInterval(Rt);const n=Je();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},350))});(function(){const n=document.getElementById("webviews-container");if(n){Mn.observe(n);return}const t=new MutationObserver(()=>{const i=document.getElementById("webviews-container");i&&(t.disconnect(),Mn.observe(i))});t.observe(document.documentElement,{childList:!0,subtree:!0})})();window.enterSiteSnapStudioMode=function(){document.body.classList.add("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.add("sitesnap-studio-mode");try{window.parent.document.body.classList.add("sitesnap-studio-active")}catch(n){console.error("Failed to set parent active layout",n)}};window.exitSiteSnapStudioMode=function(){document.body.classList.remove("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.remove("sitesnap-studio-mode");try{window.parent.document.body.classList.remove("sitesnap-studio-active")}catch(n){console.error("Failed to remove parent active layout",n)}};
