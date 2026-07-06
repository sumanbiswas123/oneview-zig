import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{o as rt,c as Ge,e as Ee}from"./utils-D9fnbo9O.js";import{s as We}from"./notifications-CBkElf_0.js";import{i as dn,l as yi}from"./external-exe-DRsy67iY.js";import{c as un,i as Si,s as Ei,t as xi}from"./webcontent-client-BT2Fs4US.js";import{n as pt,R as Mn,i as Lt,c as Ci,I as bt}from"./app-env-Dw5Rxq_p.js";import{S as Ke,P as ge}from"./app-runtime-CuOCpSBc.js";function Ii({state:e,constants:n,escapeHtml:t,showToast:i,isPerfEnabled:r,formatDownloadBytes:c,formatDownloadSpeed:w,formatDownloadEta:S,formatHistoryTime:I,loadManagedDownloadsFromMain:C,refreshExtensionsManagerList:h,saveProfileHistoryStore:y,getActiveTab:x,updateTabTitle:A,createTab:N,switchTab:F,navigateTo:j}){const{PROFILES:Q,PARTITIONS:ue,IS_DEV_APP_BUILD:Y}=n;function ae(m=""){const L=String(m||"").trim().toLowerCase();return["downloads","history","extensions","passwords"].includes(L)?L:"extensions"}function ve(m="extensions"){const L=ae(m);return L==="downloads"?"Downloads":L==="history"?"History":L==="passwords"?"Passwords":"Extensions"}function xe(m="extensions"){const L=ae(m);return L==="downloads"?"Ctrl+Shift+D":L==="history"?"Ctrl+H":L==="extensions"?"Ctrl+E":""}function Qe(m){const L=m instanceof Element?m:null;return L?L.closest("input, textarea, select")?!0:L.isContentEditable===!0:!1}function De(m="settings",L="extensions"){return{type:String(m||"settings").trim().toLowerCase(),section:ae(L)}}function se(m="extensions"){const L=ae(m);return e.tabs.find(U=>U?.nativePage?.type==="settings"&&ae(U?.nativePage?.section)===L)||null}function we(m){return m?.nativePage?.type==="settings"}async function tt(){if(!window.api)return e.nativeSettingsGeneralInfo;try{if(!e.nativeSettingsGeneralInfo.version&&window.api.getAppVersion&&(e.nativeSettingsGeneralInfo.version=await window.api.getAppVersion()),!e.nativeSettingsGeneralInfo.defaultOpenStatus&&window.api.getDefaultOpenHandlingStatus){const m=await window.api.getDefaultOpenHandlingStatus();e.nativeSettingsGeneralInfo.defaultOpenStatus=m?.isDefault||m?.success?"Configured":"Needs setup"}}catch{}return e.nativeSettingsGeneralInfo}function Te(){return Object.entries(e.profileHistoryCache||{}).flatMap(([m,L])=>(Array.isArray(L)?L:[]).map(U=>({profileId:m,profileName:Q[m]?.name||m||"Unknown",url:String(U?.url||"").trim(),title:String(U?.title||"Untitled").trim()||"Untitled",visitedAt:U?.visitedAt?Number(U.visitedAt):0}))).filter(m=>m.url&&m.visitedAt).sort((m,L)=>Number(L.visitedAt||0)-Number(m.visitedAt||0))}function ye(m){const L=new Date(Number(m||0));if(Number.isNaN(L.getTime()))return"Unknown Date";const U=new Date,T=new Date(U.getFullYear(),U.getMonth(),U.getDate()).getTime(),P=new Date(L.getFullYear(),L.getMonth(),L.getDate()).getTime(),oe=T-1440*60*1e3;return P===T?"Today":P===oe?"Yesterday":L.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function Ce(m=[]){const L=[],U=new Map;return m.forEach(T=>{const P=ye(T.visitedAt);if(!U.has(P)){const oe={key:`${P}-${T.visitedAt}`,label:P,entries:[]};U.set(P,oe),L.push(oe)}U.get(P).entries.push(T)}),L}function Ve(){return e.managedDownloadsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.managedDownloadsCache.map(m=>{const L=m.totalBytes?Math.max(0,Math.min(100,Math.round(m.receivedBytes/m.totalBytes*100))):m.state==="completed"?100:0,U=m.totalBytes?`${c(m.receivedBytes)} / ${c(m.totalBytes)}`:c(m.receivedBytes),T=m.state==="progressing"?`${w(m.bytesPerSecond)} - ${S(m.etaSeconds)}`:m.state==="completed"?`Saved to ${t(m.savePath||"")}`:t(String(m.state||"Unknown"));return`
              <article class="native-settings-row native-settings-download-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(m.fileName||"Download")}</div>
                    <div class="native-settings-row-note">${t(U)}</div>
                    <div class="native-settings-row-note">${T}</div>
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
                <div class="native-settings-progress"><span style="width:${L}%"></span></div>
              </article>
            `}).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No downloads yet.</div>'}function je(){const m=e.historySearchQuery.trim().toLowerCase(),L=Te().filter(T=>m?`${T.title||""} ${T.url||""} ${T.profileName||""}`.toLowerCase().includes(m):!0);return L.length?`
      <div class="native-history-flat-list">
        ${Ce(L).map(T=>`
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${t(T.label)}</span>
                </div>
                ${T.entries.map(P=>`
                      <article class="native-history-entry">
                        <div class="native-history-entry-content">
                          <div class="native-history-entry-title">${t(P.title||"Untitled")}</div>
                          <div class="native-history-entry-url">${t(P.url||"")}</div>
                          <div class="native-history-entry-meta">${t(P.profileName)} • ${t(I(P.visitedAt))}</div>
                        </div>
                        <div class="native-history-entry-actions">
                          <button class="native-settings-action" type="button" data-native-history-action="open" data-history-time="${t(P.visitedAt||"")}" data-profile-id="${t(P.profileId)}">Open</button>
                          <button class="native-settings-action" type="button" data-native-history-action="delete" data-history-time="${t(P.visitedAt||"")}" data-profile-id="${t(P.profileId)}">Delete</button>
                        </div>
                      </article>
                    `).join("")}
              </div>
            `).join("")}
      </div>
    `:`<div class="native-settings-empty">${m?"No history matches your search.":"No history yet."}</div>`}function Me(){return e.browserExtensionsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.browserExtensionsCache.map(m=>`
              <article class="native-settings-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(m.name||"Unnamed Extension")}</div>
                    <div class="native-settings-row-note">${t(m.id||m.path||"")}</div>
                    ${Y?`<div class="native-settings-row-note">${t(m.path||"")}</div>`:""}
                  </div>
                  <div class="native-settings-inline-actions">
                    <button class="native-settings-action" type="button" data-native-extension-action="more" data-extension-path="${t(m.path||"")}">More</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="${m.enabled===!1?"enable":"disable"}" data-extension-path="${t(m.path||"")}">${m.enabled===!1?"Enable":"Disable"}</button>
                    <button class="native-settings-action" type="button" data-native-extension-action="reload" data-extension-path="${t(m.path||"")}">Reload</button>
                    ${Y?`<button class="native-settings-action" type="button" data-native-extension-action="remove" data-extension-path="${t(m.path||"")}">Remove</button>`:""}
                  </div>
                </div>
              </article>
            `).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No extensions installed yet.</div>'}function Oe(){const m=e.credentialCache||{},L=[];return Object.entries(m).forEach(([T,P])=>{(P||[]).forEach((oe,K)=>{L.push({key:`${T}:${K}`,profileId:T,domain:String(oe.domain||"").toLowerCase(),username:String(oe.username||""),password:String(oe.password||"")})})}),`
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
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${Object.entries(Q).map(([T,P])=>`
        <label class="profile-pill-item" style="cursor: pointer;" data-profile-id="${t(T)}">
          <input type="radio" name="nativePasswordProfile" value="${t(T)}" ${T===(e.passwordProfileId||e.currentProfileId||"guest")?"checked":""} style="cursor: pointer;" />
          <span class="profile-pill-dot" style="background-color: ${t(P.color||"#000")}"></span>
          <span>${t(P.name||"")}</span>
        </label>
      `).join("")}</div>
          </div>
          <button type="submit" class="native-settings-action" style="grid-column: 1 / -1; background: #3b82f6; color: white; font-weight: 600; padding: 10px 14px;">Save Credential</button>
        </form>

        <div class="native-settings-section-head" style="margin-top: 24px;">
          <h3>Saved Passwords</h3>
          <p>${L.length} credential${L.length!==1?"s":""} stored</p>
        </div>
        
        ${L.length===0?'<div class="native-settings-empty">No saved credentials yet. Add one above.</div>':`<div class="password-list">
              ${L.map(T=>`
                <div class="password-item" data-key="${t(T.key)}">
                  <div><strong>${t(T.domain)}</strong><div class="password-meta">${t(T.profileId)}</div></div>
                  <div>${t(T.username)}</div>
                  <div class="password-secret">${t(T.password)}</div>
                  <div class="password-actions">
                    <button type="button" class="password-action-btn" data-action="edit">Edit</button>
                    <button type="button" class="password-action-btn" data-action="delete">Delete</button>
                  </div>
                </div>
              `).join("")}
            </div>`}
      </section>
    `}function Be(m){const L=document.getElementById("nativeTabContent");if(!L||!we(m))return;const U=ae(m.nativePage?.section);let T="",P="";const oe=ve(U);let K="Manage app behavior without leaving the browser shell.";if(U==="downloads"){const q=e.managedDownloadsCache.length,Z=e.managedDownloadsCache.filter(W=>W.state==="progressing").length;T=Ve(),K=`${Z} active, ${q} total downloads.`}else if(U==="history"){const q=Te(),Z=e.historySearchQuery.trim()?q.filter(W=>`${W.title||""} ${W.url||""} ${W.profileName||""}`.toLowerCase().includes(e.historySearchQuery.trim().toLowerCase())).length:q.length;P=`
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
      `,T=je(),K=`${Z} total history entries across all profiles.`}else if(U==="extensions"){const q=e.browserExtensionsCache.filter(Z=>Z.enabled!==!1).length;P=`
        <div class="native-settings-toolbar">
          ${Y?'<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>':""}
        </div>
      `,T=Me(),K=`${q} enabled out of ${e.browserExtensionsCache.length} extensions.`}else U==="passwords"&&(T=Oe(),K="Manage saved passwords securely.");L.innerHTML=`
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${t(oe)}</h2>
                <p>${t(K)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions","history","downloads","passwords"].map(q=>{const Z=xe(q);return`
                    <button
                      type="button"
                      class="native-settings-chip ${q===U?"is-active":""}"
                      data-native-settings-nav="${q}"
                      title="${t(ve(q))}${Z?` (${Z})`:""}"
                    >
                      <span>${t(ve(q))}</span>
                      ${Z?`<span class="native-settings-chip-shortcut">${t(Z)}</span>`:""}
                    </button>
                  `}).join("")}
            </div>
            ${P}
          </div>
          <div class="native-settings-body">
            ${T}
          </div>
        </section>
      </div>
    `}async function Ie(){const m=x();we(m)&&Be(m)}function Se(m="extensions",L=e.activeTabId){const U=e.tabs.find(P=>P.id===L);if(!we(U))return;const T=ae(m);U.nativePage.section=T,A(U.id,ve(T)),U.id===e.activeTabId&&Be(U)}function Le(m="extensions"){const L=se(m);if(L){F(L.id);return}N(null,null,ve(m),null,{nativePage:De("settings",m)})}function ze(){const m=document.getElementById("settingsBtn");m&&m.dataset.boundClick!=="1"&&(m.dataset.boundClick="1",m.addEventListener("click",()=>{Le("extensions")}))}function qe(){const m=document.getElementById("nativeTabContent");if(!m||m.dataset.boundNativeSettings==="1")return;m.dataset.boundNativeSettings="1";const L=(U=null,T=null)=>{requestAnimationFrame(()=>{const P=document.getElementById("nativeHistorySearchInput");if(P&&(P.focus({preventScroll:!0}),Number.isInteger(U)&&Number.isInteger(T)&&typeof P.setSelectionRange=="function"))try{P.setSelectionRange(U,T)}catch{}})};m.addEventListener("click",async U=>{const T=U.target.closest(".password-visibility-toggle");if(T){U.preventDefault();const W=document.getElementById("nativePasswordSecretInput");if(W){const ee=W.type==="password";W.type=ee?"text":"password",T.textContent=ee?"🙈":"👁️"}return}const P=U.target.closest("[data-native-settings-nav]");if(P){Se(P.dataset.nativeSettingsNav||"extensions");return}const oe=U.target.closest("[data-native-settings-action]");if(oe){const W=String(oe.dataset.nativeSettingsAction||"").trim();try{W==="check-updates"&&window.api?.checkForUpdates?(await window.api.checkForUpdates(),i("Update check started.","success")):W==="open-default-apps"&&window.api?.openDefaultAppSettings?await window.api.openDefaultAppSettings():W==="load-unpacked-extension"&&window.api?.addBrowserExtensionsUnpacked?(await window.api.addBrowserExtensionsUnpacked(),await h(),await Ie(),i("Unpacked extensions loaded.","success")):W==="clear-history"&&(Object.keys(e.profileHistoryCache||{}).forEach(ee=>{e.profileHistoryCache[ee]=[]}),y(),Be(x()))}catch(ee){i(ee?.message||"Could not complete settings action.","error")}return}const K=U.target.closest("[data-native-download-action]");if(K){try{const W=await window.api?.runManagedDownloadAction?.({id:String(K.dataset.downloadId||"").trim(),action:String(K.dataset.nativeDownloadAction||"").trim()});Array.isArray(W?.downloads)?e.managedDownloadsCache=W.downloads:await C(),await Ie()}catch(W){i(W?.message||"Could not complete download action.","error")}return}const q=U.target.closest("[data-native-history-action]");if(q){const W=String(q.dataset.profileId||e.historyProfileId||e.currentProfileId),ee=String(q.dataset.historyTime||""),re=(e.profileHistoryCache[W]||[]).findIndex(p=>String(p.visitedAt||"")===ee),d=re>=0?(e.profileHistoryCache[W]||[])[re]:null;if(!d)return;if(q.dataset.nativeHistoryAction==="delete")e.profileHistoryCache[W].splice(re,1),y(),e.historyProfileId=W,Be(x());else{const p=Q[W]?.partition||ue.guest;N(d.url,p,d.title||"History",W)}return}const Z=U.target.closest("[data-native-extension-action]");if(Z){const W=String(Z.dataset.nativeExtensionAction||"").trim(),ee=String(Z.dataset.extensionPath||"").trim();try{W==="more"&&window.api?.getExtensionShortcutsInfo?await Ze(ee):W==="reload"&&window.api?.reloadBrowserExtension?(await window.api.reloadBrowserExtension({path:ee}),i("Extension reloaded.","success")):(W==="enable"||W==="disable")&&window.api?.toggleBrowserExtension?(W==="disable"&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.toggleBrowserExtension({path:ee,enabled:W==="enable"})):W==="remove"&&window.api?.removeBrowserExtension&&(typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.removeBrowserExtension({path:ee})),await h(),await Ie()}catch(re){i(re?.message||"Could not complete extension action.","error")}}}),m.addEventListener("input",U=>{const T=U.target.closest("#nativeHistorySearchInput");if(T){const oe=Number.isInteger(T.selectionStart)?T.selectionStart:null,K=Number.isInteger(T.selectionEnd)?T.selectionEnd:oe;e.historySearchQuery=String(T.value||""),Be(x()),L(oe,K);return}const P=U.target.closest("input[name='nativePasswordProfile']");if(P){e.passwordProfileId=String(P.value||"");return}}),m.addEventListener("submit",async U=>{const T=U.target.closest("#nativePasswordForm");if(!T)return;U.preventDefault();const P=document.getElementById("nativePasswordDomainInput"),oe=document.getElementById("nativePasswordUsernameInput"),K=document.getElementById("nativePasswordSecretInput");if(!P||!oe||!K)return;const q=String(P.value||"").trim().toLowerCase(),Z=String(oe.value||"").trim(),W=String(K.value||""),ee=e.passwordProfileId||e.currentProfileId||"guest";if(!q||!Z||!W){i("Please fill in all fields.","error");return}try{if(!window.api?.saveProfileCredential){i("Credential API unavailable.","error");return}const re=await window.api.saveProfileCredential({profileId:ee,domain:q,username:Z,password:W});if(!re||!re.success){i("Failed to save credential.","error");return}if(window.api?.listProfileCredentials){const d=await window.api.listProfileCredentials();d&&(e.credentialCache=d)}i("Credential saved successfully.","success"),T.reset(),Be(x())}catch(re){i(re?.message||"Could not save credential.","error")}}),m.addEventListener("click",async U=>{const T=U.target.closest(".password-action-btn");if(!T)return;const P=String(T.dataset.action||"").trim(),oe=T.closest(".password-item"),K=String(oe?.dataset.key||""),[q,Z]=K.split(":"),W=Number(Z);if(!q||Number.isNaN(W))return;const re=((e.credentialCache||{})[q]||[])[W];if(re)try{if(P==="delete"){if(!window.api?.deleteProfileCredential){i("Credential API unavailable.","error");return}const d=await window.api.deleteProfileCredential({profileId:q,domain:String(re.domain||"").toLowerCase(),username:String(re.username||"")});if(!d||!d.success){i("Failed to delete credential.","error");return}if(window.api?.listProfileCredentials){const p=await window.api.listProfileCredentials();p&&(e.credentialCache=p)}i("Credential deleted successfully.","success"),Be(x())}else if(P==="edit"){const d=document.getElementById("nativePasswordDomainInput"),p=document.getElementById("nativePasswordUsernameInput"),k=document.getElementById("nativePasswordSecretInput"),B=document.getElementById("nativePasswordProfileSelect");if(!d||!p||!k)return;e.passwordProfileId=q,d.value=String(re.domain||"").toLowerCase(),p.value=String(re.username||""),k.value=String(re.password||""),B&&(B.innerHTML=Object.entries(Q||{}).map(([D,s])=>`
                <label class="profile-pill-item ${D===q?"active":""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${t(D)}" ${D===q?"checked":""} style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${t(s.color||"#000")}"></span>
                  <span>${t(s.name||"")}</span>
                </label>
              `).join(""),B.addEventListener("change",D=>{const s=D.target.value;s&&(e.passwordProfileId=s)})),document.getElementById("nativePasswordForm")?.scrollIntoView({behavior:"smooth"}),d.focus()}}catch(d){i(d?.message||"Could not complete password action.","error")}})}function nt(){document.addEventListener("keydown",m=>{Qe(m.target)||m.ctrlKey&&((m.key==="H"||m.key==="h")&&!m.shiftKey?(m.preventDefault(),Le("history")):(m.key==="E"||m.key==="e")&&!m.shiftKey?(m.preventDefault(),Le("extensions")):(m.key==="D"||m.key==="d")&&m.shiftKey&&(m.preventDefault(),Le("downloads")))})}async function Ze(m=""){const L=document.getElementById("extensionDetailsModal"),U=document.getElementById("extensionDetailsCloseBtn"),T=document.getElementById("extensionDetailsContent"),P=document.getElementById("extensionDetailsTitle");if(!(!L||!T))try{const oe=await window.api?.getExtensionShortcutsInfo?.({path:m});if(!oe?.success)T.innerHTML='<div class="extension-details-empty">Unable to load extension details.</div>';else{const{name:K,shortcuts:q,errors:Z,conflicts:W}=oe;P.textContent=`${t(K||"Extension")} Details`;let ee="";q&&q.length>0?ee=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-shortcuts-list">
                ${q.map(p=>`
                      <div class="extension-shortcut-item">
                        <span class="extension-shortcut-key">${t(p.originalKey||p.key)}</span>
                        <span class="extension-shortcut-desc">${t(p.description||"No description")}</span>
                        <span class="extension-shortcut-status ${p.isActive?"active":"conflict"}">
                          ${p.isActive?"✓ Active":"⚠ Conflict"}
                        </span>
                      </div>
                    `).join("")}
              </div>
            </div>
          `:ee=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-details-empty">No keyboard shortcuts defined.</div>
            </div>
          `;let re="";Z&&Z.length>0&&(re=`
            <div class="extension-details-section">
              <h4>Issues</h4>
              <div class="extension-errors-list">
                ${Z.map(p=>`
                      <div class="extension-error-item">
                        <div class="extension-error-type">${t(p.type)}</div>
                        <div class="extension-error-message">${t(p.message)}</div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `);let d="";W&&W.length>0&&(d=`
            <div class="extension-details-section">
              <h4>Shortcut Conflicts</h4>
              <div class="extension-conflicts-list">
                ${W.map(p=>`
                      <div class="extension-conflict-item">
                        <div class="extension-conflict-key">${t(p.key)}</div>
                        <div class="extension-conflict-extensions">
                          <strong>Conflicting with:</strong><br/>
                          ${p.conflictingExtensions.map(k=>`${t(k.name)}`).join("<br/>")}
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `),T.innerHTML=`${ee}${re}${d}`}L.classList.remove("hidden"),U&&(U.onclick=()=>{L.classList.add("hidden")})}catch(oe){console.error("Failed to load extension details:",oe),T.innerHTML='<div class="extension-details-empty">Error loading extension details.</div>',L.classList.remove("hidden")}}return{bindSettingsShortcutsGlobal:nt,createNativePageDescriptor:De,ensureNativeSettingsGeneralInfo:tt,getSettingsTabTitle:ve,getSettingsShortcut:xe,initNativeSettingsUi:qe,initSettingsMenu:ze,isEditableShortcutTarget:Qe,isNativeSettingsTab:we,normalizeSettingsSection:ae,openSettingsTab:Le,refreshActiveNativeSettingsPage:Ie,renderNativeSettingsPage:Be,updateNativeSettingsTabSection:Se}}function Li({state:e,constants:n,escapeHtml:t,showToast:i,openOverlayModal:r,closeOverlayModal:c,getActiveTab:w,getActiveWebview:S,createTab:I,refreshActiveNativeSettingsPage:C,closeSettingsMenu:h}){const{PROFILES:y,PENDING_EXTENSION_OPEN_STORAGE_KEY:x,EXTENSION_PIN_STORAGE_KEY:A}=n;let N=!1,F=null,j=null,Q={visible:!1,id:"",message:"",actionLabel:"",action:""},ue={},Y={entryPath:""},ae=!1;async function ve(){if(!window.api?.listBrowserExtensions)return e.browserExtensionsCache=[],e.browserExtensionsCache;const s=await window.api.listBrowserExtensions(),f=Array.isArray(s?.entries)?s.entries:[];return e.browserExtensionsCache=f.map(g=>{const u=(g.id||"guest").toLowerCase(),b=n.APP_PROTOCOL_SCHEME||"oneview-dev",M=String(g.path||"").trim().replace(/\\/g,"/").replace(/\/+$/,""),H=`file:///${M}`,_=ne=>{if(!ne||!ne.toLowerCase().startsWith("file://"))return ne;const ce=ne.replace(/\\/g,"/"),pe=decodeURI(ce);let he=pe.replace(H,"").replace(/^\/+/,"");if(he===pe){const fe=`/${M.split("/").pop()}/`,J=pe.indexOf(fe);J!==-1?he=pe.slice(J+fe.length):he=""}const te=g.manifest?.entrypoints?.root||g.manifest?.entrypoints?.page||"index.html";return`${b}://${u}/${he||te}`};return{...g,rootUrl:_(g.rootUrl),optionsUrl:_(g.optionsUrl),popupUrl:_(g.popupUrl),sidePanelUrl:_(g.sidePanelUrl)}}),e.browserExtensionsCache}async function xe(){let s="";try{s=String(sessionStorage.getItem(x)||"").trim()}catch{s=""}if(!s)return;try{sessionStorage.removeItem(x)}catch{}const f=e.browserExtensionsCache.find(g=>g.path===s);f&&await T(f.path,"tab")}function Qe(){try{const s=JSON.parse(localStorage.getItem(A)||"{}");ue=s&&typeof s=="object"&&!Array.isArray(s)?s:{}}catch{ue={}}}function De(){try{localStorage.setItem(A,JSON.stringify(ue||{}))}catch{}}function se(){return w()?.partition||y[e.currentProfileId]?.partition||y.guest.partition}function we(){const s=w(),f=S();return{url:String(f?.getURL?.()||s?.url||"").trim(),title:String(f?.getTitle?.()||s?.title||"").trim()}}function tt(s={}){return String(s?.name||s?.actionTitle||"EX").trim().split(/\s+/).slice(0,2).map(g=>g.charAt(0)).join("").toUpperCase()}function Te(s={}){return String(s?.actionTitle||s?.name||"Extension").trim()}function ye(s={},f=""){const g=String(s?.path||"").trim(),u=String(f||"").trim().replace(/\\/g,"/");if(!g||!u)return"";const b=g.replace(/\\/g,"/").replace(/\/+$/,""),M=u.replace(/^\/+/,""),H=`${b}/${M}`;return`file:///${encodeURI(H.replace(/^([A-Za-z]):/,"$1:"))}`}function Ce(s={}){return ue[String(s?.path||"").trim()]===!0}function Ve(s={}){const f=(s?.id||"guest").toLowerCase(),g=s?.manifest?.entrypoints?.root||s?.manifest?.entrypoints?.page||"index.html";return`${n.APP_PROTOCOL_SCHEME}://${f}/${g}`}function je(s={},f=""){const g=String(s?.actionIconFileUrl||ye(s,s?.actionIconPath||"")||s?.actionIconUrl||"").trim(),u=t(tt(s));return g?`<img src="${t(g)}" alt="" />`:`<span class="${f}">${u}</span>`}function Me(s=0){const f=Number(s||0);return f>=1024*1024*1024?`${(f/(1024*1024*1024)).toFixed(1)} GB`:f>=1024*1024?`${(f/(1024*1024)).toFixed(1)} MB`:f>=1024?`${(f/1024).toFixed(1)} KB`:`${Math.max(0,Math.round(f))} B`}function Oe(s=0){const f=Number(s||0);return f<=0?"":`${Me(f)}/s`}function Be(s=null){const f=Number(s);if(!Number.isFinite(f)||f<0)return"";if(f<60)return`${Math.round(f)}s left`;const g=Math.floor(f/60),u=Math.round(f%60);return`${g}m ${u}s left`}function Ie(s=""){return e.managedDownloadsCache.find(f=>f.id===s)||null}function Se(){const s=document.getElementById("downloadsManagerBtn");s&&(s.classList.remove("has-download-highlight"),s.offsetWidth,s.classList.add("has-download-highlight"),F&&clearTimeout(F),F=setTimeout(()=>{s.classList.remove("has-download-highlight")},2300))}async function Le(){if(!window.api?.listManagedDownloads)return e.managedDownloadsCache=[],e.managedDownloadsCache;const s=await window.api.listManagedDownloads();return e.managedDownloadsCache=Array.isArray(s?.downloads)?s.downloads:[],e.managedDownloadsCache}function ze(){const s=document.getElementById("downloadsManagerPanel"),f=document.getElementById("downloadsManagerBtn");s&&!s.classList.contains("hidden")&&(N?c(()=>s.classList.add("hidden")):s.classList.add("hidden")),N=!1,f&&f.classList.remove("is-active")}function qe(){const s=document.getElementById("downloadsManagerPanel"),f=document.getElementById("downloadsManagerBadge");if(!s)return;const g=e.managedDownloadsCache.filter(u=>u.state==="progressing"||u.state==="interrupted").length;f&&(g>0?(f.textContent=String(g),f.classList.remove("hidden")):(f.textContent="",f.classList.add("hidden"))),s.innerHTML=`
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${e.managedDownloadsCache.length?e.managedDownloadsCache.map(u=>{const b=t(u.fileName||"Download"),M=String(u.state||"progressing"),H=typeof u.progress=="number"?Math.max(0,Math.min(100,u.progress)):0,_=u.totalBytes>0?`${Me(u.receivedBytes)} / ${Me(u.totalBytes)}`:Me(u.receivedBytes),ne=Oe(u.bytesPerSecond),ce=Be(u.etaSeconds),pe=M==="completed"?"Completed":M==="cancelled"?"Cancelled":M==="interrupted"?"Interrupted":u.paused?"Paused":`Downloading ${H}%`,he=[ne,ce].filter(Boolean).join(" • ");return`
                    <div class="downloads-manager-item">
                      <strong>${b}</strong>
                      <div class="downloads-manager-meta">${t(pe)} • ${t(_)}</div>
                      ${he?`<div class="downloads-manager-meta">${t(he)}</div>`:""}
                      <div class="downloads-manager-progress">
                        <span style="width:${H}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${M==="progressing"?u.paused?`<button type="button" data-download-id="${t(u.id)}" data-download-action="resume">Resume</button>`:`<button type="button" data-download-id="${t(u.id)}" data-download-action="pause">Pause</button>`:""}
                        ${M==="progressing"||M==="interrupted"?`<button type="button" data-download-id="${t(u.id)}" data-download-action="cancel">Cancel</button>`:""}
                        ${M==="interrupted"||M==="cancelled"?`<button type="button" data-download-id="${t(u.id)}" data-download-action="retry">Retry</button>`:""}
                        ${u.savePath?`<button type="button" data-download-id="${t(u.id)}" data-download-action="show">Show in Folder</button>`:""}
                        ${M==="completed"&&u.existsOnDisk?`<button type="button" data-download-id="${t(u.id)}" data-download-action="open">Open</button>`:""}
                        <button type="button" data-download-id="${t(u.id)}" data-download-action="remove">Remove</button>
                      </div>
                    </div>
                  `}).join(""):'<div class="downloads-manager-empty">No downloads yet.</div>'}
      </div>
    `}async function nt(s=null){const f=document.getElementById("downloadsManagerPanel"),g=document.getElementById("downloadsManagerBtn");if(!f||!g)return;if(!(s===null?f.classList.contains("hidden"):!!s)){ze();return}L(),qe();try{await r(()=>f.classList.remove("hidden"),{captureSnapshots:!1}),N=!0}catch{f.classList.remove("hidden"),N=!1}g.classList.add("is-active")}function Ze(){let s=document.getElementById("downloadsShelf");s||(s=document.createElement("div"),s.id="downloadsShelf",s.className="downloads-shelf hidden",s.innerHTML=`
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `,document.body.appendChild(s),s.querySelector("#downloadsShelfClose")?.addEventListener("click",()=>{Q.visible=!1,Ze()}),s.querySelector("#downloadsShelfAction")?.addEventListener("click",async()=>{const b=Ie(Q.id);!b||!Q.action||!window.api?.runManagedDownloadAction||await window.api.runManagedDownloadAction({id:b.id,action:Q.action})}));const f=s.querySelector("#downloadsShelfTitle"),g=s.querySelector("#downloadsShelfMessage"),u=s.querySelector("#downloadsShelfAction");if(!Q.visible){s.classList.add("hidden");return}f&&(f.textContent="Downloads"),g&&(g.textContent=Q.message||""),u&&(u.textContent=Q.actionLabel||"Open",u.style.display=Q.action?"":"none"),s.classList.remove("hidden")}function m(s={},f="updated"){const g=String(s.fileName||"Download").trim()||"Download";if(f==="created")Q={visible:!0,id:String(s.id||""),message:`${g} started downloading`,actionLabel:"Show",action:"show"};else if(f==="completed")Q={visible:!0,id:String(s.id||""),message:`${g} downloaded`,actionLabel:"Open",action:"open"};else if(f==="interrupted")Q={visible:!0,id:String(s.id||""),message:`${g} was interrupted`,actionLabel:"Retry",action:"retry"};else return;Ze(),j&&clearTimeout(j),j=setTimeout(()=>{Q.visible=!1,Ze()},5e3)}function L(){const s=document.getElementById("browserExtensionsMenu"),f=document.getElementById("browserExtensionsMenuBtn");s&&!s.classList.contains("hidden")&&(ae?c(()=>s.classList.add("hidden")):s.classList.add("hidden")),ae=!1,f&&f.classList.remove("is-active")}async function U(s=null){const f=document.getElementById("browserExtensionsMenu"),g=document.getElementById("browserExtensionsMenuBtn");if(!f||!g)return;if(!(s===null?f.classList.contains("hidden"):!!s)){L();return}P().catch(()=>{}),W();try{await r(()=>f.classList.remove("hidden"),{captureSnapshots:!1}),ae=!0}catch(b){console.error("Failed to open extensions menu overlay",b),f.classList.remove("hidden"),ae=!1}g.classList.add("is-active")}async function T(s,f="tab"){const g=e.browserExtensionsCache.find(H=>H.path===s);if(!g)return;const u=(g?.id||"guest").toLowerCase();let b="";if(f==="options"&&g.optionsUrl){const H=g.manifest?.entrypoints?.options||"options.html";b=`${n.APP_PROTOCOL_SCHEME}://${u}/${H}`}else if(f==="root"&&g.rootUrl){const H=g.manifest?.entrypoints?.root||"result.html";b=`${n.APP_PROTOCOL_SCHEME}://${u}/${H}`}else b=Ve(g);if(!b){i("This extension does not expose an openable page yet.","info");return}const M=`ext-${g.id||"guest"}`;I(b,M,`${g.name||"Extension"}${f==="options"?" Options":""}`,null,{extensionEntryPath:g.path,extensionActiveContext:we()})}async function P(){if(window.api?.closeBrowserExtensionPopup)try{await window.api.closeBrowserExtensionPopup()}catch{}Y={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(s=>s.classList.remove("is-active"))}function oe(s={}){const f=document.getElementById("browserExtensionPopupTitle"),g=document.getElementById("browserExtensionPopupSubtitle"),u=document.getElementById("browserExtensionPopupIcon");f&&(f.textContent=Te(s)),g&&(g.textContent=s?.popupUrl?"Popup":s?.optionsUrl?"Extension page":s?.rootUrl?"Extension":""),u&&(u.innerHTML=je(s,"browser-extension-popup-fallback"))}function K(s){if(!s||typeof s.getBoundingClientRect!="function")return{left:0,top:0,bottom:0,width:0,height:0};const f=s.getBoundingClientRect();return{left:Number(f.left||0),top:Number(f.top||0),bottom:Number(f.bottom||0),width:Number(f.width||0),height:Number(f.height||0)}}async function q(s,f=null){const g=e.browserExtensionsCache.find(ce=>ce.path===s);if(!g)return;const u=String(g.popupUrl||"").trim()||String(g.optionsUrl||"").trim();if(!u){await T(s,"tab");return}if(Y.entryPath===s){await P();return}await P(),L();const b=window.api?.openBrowserExtensionPopup;if(typeof b!="function")throw new Error("Extension popup API is unavailable");const M=we(),H=`ext-${g.id||"guest"}`,_=await b({url:u,entryPath:s,partition:H,anchor:K(f),activeUrl:M.url||"",activeTitle:M.title||""});if(!_?.success)throw new Error(_?.message||"Could not open extension popup");oe(g),Y={entryPath:s,pageType:"popup",host:null,overlayActive:!1};const ne=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(s):s.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${ne}"]`).forEach(ce=>ce.classList.add("is-active"))}function Z(){const s=document.getElementById("browserExtensionsPinned");if(!s)return;const f=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,g=e.browserExtensionsCache.filter(b=>{const M=b.id==="sitesnap-studio"||String(b.name||"").toLowerCase().includes("sitesnap")||String(b.id||"").toLowerCase().includes("sitesnap");return f?b.enabled!==!1&&M:b.enabled!==!1&&!M}),u=f?g:g.filter(b=>Ce(b));if(!u.length){s.innerHTML="",s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=u.map(b=>`
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${t(b.path||"")}"
            title="${t(Te(b))}"
            aria-label="${t(Te(b))}"
          >
            ${je(b,"browser-extension-action-fallback")}
          </button>
        `).join("")}function W(){const s=document.getElementById("browserExtensionsMenu");if(!s)return;const f=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,g=e.browserExtensionsCache.filter(u=>{const b=u.id==="sitesnap-studio"||String(u.name||"").toLowerCase().includes("sitesnap")||String(u.id||"").toLowerCase().includes("sitesnap");return f?u.enabled!==!1&&b:u.enabled!==!1&&!b});s.innerHTML=`
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${g.length?g.map(u=>{const b=t(u.path||""),M=t(Te(u)),H=t(u.version?`v${u.version}${u.id?` • ${u.id}`:""}`:u.id||u.name||"");return`
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${je(u,"browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${M}</strong>
                          <p>${H}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${b}"
                          title="${Ce(u)?"Unpin":"Pin"}"
                          aria-label="${Ce(u)?"Unpin":"Pin"}"
                        >
                          ${Ce(u)?"Unpin":"Pin"}
                        </button>
                      </div>
                      <div class="browser-extension-menu-actions">
                        <button type="button" data-menu-action="popup" data-path="${b}">
                          ${u.popupUrl?"Open Popup":"Open"}
                        </button>
                        ${u.optionsUrl?`<button type="button" data-menu-action="options" data-path="${b}">Options</button>`:""}
                        ${u.rootUrl?`<button type="button" data-menu-action="tab" data-path="${b}">Open in Tab</button>`:""}
                      </div>
                    </div>
                  `}).join(""):'<div class="browser-extensions-empty">No enabled extensions yet.</div>'}
      </div>
    `}function ee(){Z(),W()}function re(){const s=document.getElementById("extensionsManagerList");if(!s)return;const f=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,g=e.browserExtensionsCache.filter(u=>{const b=u.id==="sitesnap-studio"||String(u.name||"").toLowerCase().includes("sitesnap")||String(u.id||"").toLowerCase().includes("sitesnap");return f?b:!b});if(!g.length){s.innerHTML=`
        <div class="extensions-empty-state">
          No unpacked extensions added yet.
        </div>
      `;return}s.innerHTML=g.map(u=>{const b=t(u.path||"");return`
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
              ${n.IS_DEV_APP_BUILD?`<div class="extension-path">${b}</div>`:""}
              ${u.loadError?`<div class="extension-error">${t(u.loadError)}</div>`:""}
            </div>
            <div class="extension-actions">
              ${u.popupUrl?`<button type="button" class="extension-action-btn" data-action="open-popup" data-path="${b}">Popup</button>`:""}
              ${u.rootUrl||u.linkUrl?`<button type="button" class="extension-action-btn" data-action="open-tab" data-path="${b}">Open Tab</button>`:""}
              ${u.optionsUrl?`<button type="button" class="extension-action-btn" data-action="open-options" data-path="${b}">Options</button>`:""}
              <button type="button" class="extension-action-btn" data-action="reload" data-path="${b}">
                Reload
              </button>
              <button type="button" class="extension-action-btn" data-action="toggle" data-path="${b}">
                ${u.enabled===!1?"Enable":"Disable"}
              </button>
              ${n.IS_DEV_APP_BUILD?`<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${b}">Remove</button>`:""}
            </div>
          </div>
        `}).join("")}async function d(){try{await ve()}catch(s){console.error("Failed to refresh browser extensions list",s)}re(),ee()}async function p(s,f){const g=e.browserExtensionsCache.find(b=>b.path===s);if(!g)return;const u=f==="options"?g.optionsUrl:f==="root"?g.rootUrl:Ve(g);if(!u){i(`This extension does not expose a ${f} page.`,"info");return}I(u,se(),`${g.name||"Extension"} ${f==="options"?"Options":"Popup"}`,null,{extensionEntryPath:g.path,extensionActiveContext:we()})}async function k(){const s=document.getElementById("extensionsManagerModal");if(s){L(),await P(),re(),ee();try{await r(()=>s.classList.remove("hidden"))}catch(f){console.error("openOverlayModal failed for extensions manager",f),s.classList.remove("hidden")}d().catch(f=>{console.error("Failed to refresh extensions manager after open",f)})}}function B(){const s=document.getElementById("extensionsManagerModal");s&&c(()=>s.classList.add("hidden"))}function R(){const s=document.getElementById("extensionsBtn"),f=document.getElementById("settingsBtn"),g=document.getElementById("extensionsModalCloseBtn"),u=document.getElementById("extensionsLoadBtn"),b=document.getElementById("extensionsManagerList"),M=document.getElementById("browserExtensionsPinned"),H=document.getElementById("browserExtensionsMenuBtn"),_=document.getElementById("browserExtensionsMenu"),ne=document.getElementById("downloadsManagerBtn"),ce=document.getElementById("downloadsManagerPanel"),pe=document.getElementById("browserExtensionPopupClose"),he=document.getElementById("browserExtensionPopupOpenTab");Qe(),re(),ee(),d().catch(te=>{console.error("Failed to refresh extensions manager after open",te)}),ve().then(()=>{if(xe(),window.api?.prewarmBrowserExtensionPopup){const G=e.browserExtensionsCache.filter(J=>J.enabled!==!1).filter(J=>Ce(J));let fe={partition:se()};if(G.length>0){const J=G[0],de=String(J.popupUrl||"").trim()||String(J.optionsUrl||"").trim();de&&(fe={...fe,url:de,entryPath:J.path})}window.api.prewarmBrowserExtensionPopup(fe).catch(()=>{})}}).catch(()=>{}),window.api?.onBrowserExtensionPopupState&&window.api.onBrowserExtensionPopupState(te=>{const{entryPath:G,open:fe}=te||{};if(fe){Y={entryPath:G,pageType:"popup",host:null,overlayActive:!1};const J=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(G):G.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${J}"]`).forEach(de=>de.classList.add("is-active"))}else Y.entryPath===G&&(Y={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(J=>J.classList.remove("is-active")))}),s&&s.dataset.boundClick!=="1"&&(s.dataset.boundClick="1",s.addEventListener("click",()=>{k().catch(te=>{console.error("Failed to open extensions manager",te),i("Could not open extensions manager.","error")})})),g&&g.dataset.boundClick!=="1"&&(g.dataset.boundClick="1",g.addEventListener("click",B)),u&&u.dataset.boundClick!=="1"&&(u.dataset.boundClick="1",u.addEventListener("click",async()=>{try{if(!window.api?.addBrowserExtensionsUnpacked){i("Extension manager API is unavailable.","error");return}const te=await window.api.addBrowserExtensionsUnpacked();e.browserExtensionsCache=Array.isArray(te?.entries)?te.entries:[],re(),ee(),i("Unpacked extensions loaded.","success")}catch(te){console.error("Failed to load unpacked extensions",te),i(te?.message||"Could not load unpacked extensions.","error")}})),b&&b.dataset.boundClick!=="1"&&(b.dataset.boundClick="1",b.addEventListener("click",async te=>{const G=te.target.closest("[data-action]");if(!G)return;const fe=String(G.dataset.action||"").trim(),J=String(G.dataset.path||"").trim();if(J)try{if(fe==="open-popup"){await p(J,"popup");return}if(fe==="open-tab"){await p(J,"tab");return}if(fe==="open-options"){await p(J,"options");return}if(fe==="reload"&&window.api?.reloadBrowserExtension){const de=await window.api.reloadBrowserExtension({path:J});e.browserExtensionsCache=Array.isArray(de?.entries)?de.entries:e.browserExtensionsCache,re(),ee(),i("Extension reloaded.","success");return}if(fe==="toggle"&&window.api?.toggleBrowserExtension){const de=e.browserExtensionsCache.find(dt=>dt.path===J);de?.enabled!==!1&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const ct=await window.api.toggleBrowserExtension({path:J,enabled:de?.enabled===!1});e.browserExtensionsCache=Array.isArray(ct?.entries)?ct.entries:e.browserExtensionsCache,re(),ee(),i("Extension state updated.","success");return}if(fe==="remove"&&window.api?.removeBrowserExtension){typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const de=await window.api.removeBrowserExtension({path:J});e.browserExtensionsCache=Array.isArray(de?.entries)?de.entries:e.browserExtensionsCache,re(),ee(),i("Extension removed.","success")}}catch(de){console.error("Extension manager action failed",de),i(de?.message||"Could not complete extension action.","error")}})),M&&M.dataset.boundClick!=="1"&&(M.dataset.boundClick="1",M.addEventListener("click",async te=>{const G=te.target.closest("[data-path]");if(!G)return;const fe=String(G.dataset.path||"").trim();if(fe)try{await q(fe,G)}catch(J){console.error("Failed to open extension popup",J),i(J?.message||"Could not open extension popup.","error")}})),H&&H.dataset.boundClick!=="1"&&(H.dataset.boundClick="1",H.addEventListener("click",()=>{U().catch(te=>{console.error("Failed to toggle extensions menu",te),i("Could not open extensions menu.","error")})})),_&&_.dataset.boundClick!=="1"&&(_.dataset.boundClick="1",_.addEventListener("click",async te=>{const G=te.target.closest("[data-menu-action]");if(!G)return;const fe=String(G.dataset.menuAction||"").trim(),J=String(G.dataset.path||"").trim();try{if(fe==="manage"){L(),await k();return}if(!J)return;if(fe==="pin"){const de=!ue[J];ue[J]=de,De(),ee();return}if(fe==="popup"){await q(J,H||G);return}if(fe==="options"){L(),await T(J,"options");return}fe==="tab"&&(L(),await T(J,"tab"))}catch(de){console.error("Extension menu action failed",de),i(de?.message||"Could not complete extension action.","error")}})),pe&&pe.dataset.boundClick!=="1"&&(pe.dataset.boundClick="1",pe.addEventListener("click",()=>{P().catch(()=>{})})),he&&he.dataset.boundClick!=="1"&&(he.dataset.boundClick="1",he.addEventListener("click",async()=>{Y.entryPath&&(await T(Y.entryPath,"tab"),await P())})),document.body&&document.body.dataset.boundExtensionUiDismiss!=="1"&&(document.body.dataset.boundExtensionUiDismiss="1",document.addEventListener("click",te=>{const G=te.target;f&&!f.contains(G)&&h(),_&&!_.classList.contains("hidden")&&!_.contains(G)&&!H?.contains(G)&&!s?.contains(G)&&L(),ce&&!ce.classList.contains("hidden")&&!ce.contains(G)&&!ne?.contains(G)&&ze(),!G.closest(".browser-extension-action-btn")&&!_?.contains(G)&&P().catch(()=>{})}),document.addEventListener("keydown",te=>{te.key==="Escape"&&(h(),L(),ze(),P().catch(()=>{}))}))}function D(){const s=document.getElementById("downloadsManagerBtn"),f=document.getElementById("downloadsManagerPanel");s&&s.dataset.boundClick!=="1"&&(s.dataset.boundClick="1",s.addEventListener("click",()=>{nt().catch(()=>{})})),f&&f.dataset.boundClick!=="1"&&(f.dataset.boundClick="1",f.addEventListener("click",async g=>{const u=g.target.closest("[data-download-action]");if(!u)return;const b=String(u.dataset.downloadAction||"").trim(),M=String(u.dataset.downloadId||"").trim();if(b)try{if(!window.api?.runManagedDownloadAction)return;const H=await window.api.runManagedDownloadAction({id:M,action:b});Array.isArray(H?.downloads)?e.managedDownloadsCache=H.downloads:(b==="remove"||b==="clear-completed")&&await Le(),qe()}catch(H){i(H?.message||"Could not complete download action.","error")}})),Le().then(()=>{qe()}).catch(()=>{}),window.api&&typeof window.api.onDownloadManagerUpdated=="function"&&document.body?.dataset.boundDownloadManagerEvents!=="1"&&(document.body.dataset.boundDownloadManagerEvents="1",window.api.onDownloadManagerUpdated(g=>{e.managedDownloadsCache=Array.isArray(g?.downloads)?g.downloads:[],qe(),C().catch(()=>{}),(g?.reason==="created"||g?.reason==="completed"||g?.reason==="interrupted")&&Se();const u=Ie(String(g?.focusId||"").trim());u&&m(u,String(g?.reason||"updated"))}))}return{closeBrowserExtensionPopup:P,closeBrowserExtensionsMenu:L,closeDownloadsManagerPanel:ze,formatDownloadBytes:Me,formatDownloadEta:Be,formatDownloadSpeed:Oe,initDownloadsManager:D,initExtensionsManager:R,loadManagedDownloadsFromMain:Le,refreshBrowserExtensionsUi:ee,refreshExtensionsManagerList:d}}function Pi({state:e,constants:n,showToast:t,openOverlayModal:i,closeOverlayModal:r,renderProfilePillSelect:c,resolveCredentialScopeIdForTab:w,applyProfileSelection:S,getCurrentProfileId:I,escapeHtml:C}){const{AUTH_GATEWAY_HOSTS:h,RESOURCE_SERVICE_ORIGIN:y}=n,x=()=>e.activeTabId,A=()=>e.credentialCache,N=d=>{e.credentialCache=d},F=()=>e.activeHttpAuthChallenge,j=d=>{e.activeHttpAuthChallenge=d},Q=()=>e.credentialCacheRefreshedAt,ue=d=>{e.credentialCacheRefreshedAt=d},Y=()=>e.credentialCacheRefreshInFlight,ae=d=>{e.credentialCacheRefreshInFlight=d},ve=new Map;function xe(){return{wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]}}function Qe(){return Object.keys(xe())}function De(){return!!(window.api&&typeof window.api.listProfileCredentials=="function"&&typeof window.api.saveProfileCredential=="function"&&typeof window.api.deleteProfileCredential=="function")}function se(d=""){const p=String(d).trim().toLowerCase();if(!p)return"";try{const D=new URL(p),s=String(D.hostname||"").trim().toLowerCase().replace(/^www\./,""),f=String(D.port||"").trim();return s?!f||f==="80"||f==="443"?s:`${s}:${f}`:""}catch{}const k=p.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];if(!k)return"";const B=k.lastIndexOf(":");if(B<=0)return k;const R=k.slice(B+1);return/^\d+$/.test(R)&&R!=="80"&&R!=="443"?k:k.slice(0,B)}function we(d=""){const p=String(d||"").trim().toLowerCase();if(!p)return"";const k=p.lastIndexOf(":");if(k<=0)return p;const B=p.slice(k+1);return/^\d+$/.test(B)?p.slice(0,k):p}function tt(d=""){const p=[];try{const k=new URL(String(d||"")),B=(D="")=>{if(D)try{const s=new URL(String(D)),f=se(s.host||s.hostname||"");f&&p.push(f)}catch{const f=se(String(D||""));f&&p.push(f)}};B(k.host||k.hostname||""),["retURL","retUrl","returnUrl","TargetResource","targetResource","PartnerSpId","partnerSpId"].forEach(D=>{B(k.searchParams.get(D)||"")})}catch{}return[...new Set(p.filter(Boolean))]}function Te(d=""){const p=tt(d);if(p.length===0)return se(d);const k=p[0]||"";if(h.has(k)){const B=p.find(R=>R&&!h.has(R));if(B)return B}return k}function ye(d=""){return h.has(se(d))}function Ce(d=""){const p=we(se(d));return p.endsWith(".veevavault.com")||p==="veevavault.com"||p.endsWith(".gskinternet.com")||p==="gskinternet.com"||p.endsWith(".gskpro.com")||p==="gskpro.com"}function Ve(d,p,k=""){const B=String(p||"").trim().toLowerCase(),R=se(k);if(!d||!B)return null;const D=(A()[d]||[]).filter(s=>{const f=se(s.domain);return f&&f!==R&&!ye(f)&&Ce(f)&&String(s.username||"").trim().toLowerCase()===B});return D.sort((s,f)=>se(f.domain).length-se(s.domain).length),D[0]||null}function je(d=""){const p=String(d||"").trim();return/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(p)?"":p}async function Me(){if(!window.api?.deleteProfileCredential)return;const d=[];Qe().forEach(p=>{(A()[p]||[]).forEach(k=>{const B=se(k.domain);!ye(B)||!Ve(p,k.username,B)||d.push({profileId:p,domain:B,username:String(k.username||"").trim()})})}),d.length!==0&&(await Promise.allSettled(d.map(p=>window.api.deleteProfileCredential(p))),d.forEach(p=>{const k=A()[p.profileId]||[];A()[p.profileId]=k.filter(B=>!(se(B.domain)===p.domain&&String(B.username||"").trim().toLowerCase()===p.username.toLowerCase()))}))}async function Oe(){if(!De())return N(xe()),A();try{const d=await window.api.listProfileCredentials();if(!d||!d.success||!Array.isArray(d.data))return N(xe()),A();const p=xe();return d.data.forEach(k=>{const B=String(k.profileId||"").toLowerCase();p[B]&&p[B].push({profileId:B,domain:se(k.domain),username:String(k.username||""),password:String(k.password||"")})}),N(p),await Me(),A()}catch{return N(xe()),A()}}async function Be(d=15e3){if(!De()||Date.now()-Q()<d)return A();if(Y())return Y();const k=Oe().then(B=>(ue(Date.now()),B)).finally(()=>{ae(null)});return ae(k),k}function Ie(d){return d?(d.credentialHintsByDomain||(d.credentialHintsByDomain={}),d.credentialHintsByDomain):{}}function Se(d="",p=""){const k=`${String(d||"").toLowerCase()} ${String(p||"").toLowerCase()}`;if(/login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(k))return!0;try{const B=new URL(String(d||""));if(y&&B.origin.toLowerCase()===y){const D=String(B.pathname||"/").toLowerCase(),s=String(p||"").toLowerCase();if((D==="/"||D==="/login"||D==="/signin")&&s.includes("synapse"))return!0}const R=`${B.pathname.toLowerCase()} ${B.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(R)}catch{return!1}}function Le(d=""){let p="";try{p=new URL(String(d||"")).hostname.toLowerCase()}catch{return!1}return p==="10.215.56.196"||p.endsWith(".gskinternet.com")||p.endsWith(".gskpro.com")||p.endsWith(".veevavault.com")||p.endsWith(".okta.com")||p.endsWith(".oktacdn.com")||p.endsWith(".pingone.com")}function ze(d="",p="",k=null){return!De()||!k?!1:k.launchedAppType==="website"||!k.launchedAppType?Se(d,p)||Le(d):!0}function qe(d,p=""){if(!d)return null;const k=tt(p);if(k.length===0)return null;const B=A()[d]||[];let R=null,D=-1;return B.forEach(s=>{const f=se(s.domain);if(!f)return;const g=k.reduce((u,b)=>{if(!b)return u;if(b===f)return Math.max(u,1e3);if(we(b)===we(f))return Math.max(u,900);if(b.endsWith(`.${f}`)||f.endsWith(`.${b}`))return Math.max(u,500);const M=we(b),H=we(f);if(M.endsWith(`.${H}`)||H.endsWith(`.${M}`))return Math.max(u,450);const _=M.split(".").reverse(),ne=H.split(".").reverse();let ce=0;for(let pe=0;pe<Math.min(_.length,ne.length)&&_[pe]===ne[pe];pe+=1)ce+=1;return Math.max(u,ce>1?ce:-1)},-1);g<0||(!R||g>D||g===D&&f.length>se(R.domain).length)&&(R=s,D=g)}),R}function nt(d,p="",k=null){const B=A()[d]||[];if(B.length===0)return null;let R="";try{R=se(p)}catch{R=""}const D=Ie(k),s=Object.values(D||{}).map(H=>String(H||"").trim()).filter(Boolean),f=String(k?.lastUsernameHint||"").trim()||s[s.length-1]||"";if(R&&ye(R)&&f){const H=Ve(d,f,R);if(H)return H}const g=qe(d,p);if(g&&!ye(g.domain))return g;if(!f)return null;const u=B.filter(H=>String(H.username||"").trim().toLowerCase()===f.toLowerCase());if(u.length===1)return g&&!ye(u[0].domain)?g:u[0];if(u.length===0)return null;const b=R;if(!b)return u[0];const M=H=>{const _=se(H);if(!_)return-1;if(ye(_)&&Ce(b))return-100;if(ye(b)&&!ye(_))return 800+(Ce(_)?50:0);if(b===_)return 1e3;if(we(b)===we(_))return 900;if(b.endsWith(`.${_}`)||_.endsWith(`.${b}`))return 500;const ne=we(b),ce=we(_);if(ne.endsWith(`.${ce}`)||ce.endsWith(`.${ne}`))return 450;const pe=ne.split(".").reverse(),he=ce.split(".").reverse();let te=0;for(let G=0;G<Math.min(pe.length,he.length)&&pe[G]===he[G];G+=1)te+=1;return te};return u.sort((H,_)=>M(_.domain)-M(H.domain)),u[0]||null}function Ze(d,p="",k=null){const B=nt(d,p,k);if(B)return{...B,profileId:String(B.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};const R=A()[d]||[];if(R.length===1)return{...R[0],profileId:String(R[0]?.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};let D="";try{D=se(p)}catch{D=""}if(!D||R.length===0)return null;const s=u=>{const b=se(u);if(!b)return-1;if(ye(D)&&!ye(b))return 800+(Ce(b)?50:0);if(ye(b)&&Ce(D))return-100;if(D===b)return 1e3;if(we(D)===we(b))return 900;if(D.endsWith(`.${b}`)||b.endsWith(`.${D}`))return 500;const M=we(D),H=we(b);if(M.endsWith(`.${H}`)||H.endsWith(`.${M}`))return 450;const _=M.split(".").reverse(),ne=H.split(".").reverse();let ce=0;for(let pe=0;pe<Math.min(_.length,ne.length)&&_[pe]===ne[pe];pe+=1)ce+=1;return ce},g=[...R].sort((u,b)=>s(b.domain)-s(u.domain))[0]||null;return g?{...g,profileId:String(g.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()}:null}async function m(d,p){if(!d||!p)return;const k=String(p.username||""),B=String(p.password||"");if(!B)return!1;const R=`
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
          if (${JSON.stringify(!!k)} && userField) {
            userField.focus();
            setNativeValue(userField, ${JSON.stringify(k)});
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
    `;try{return await d.executeJavaScript(R,!0),!0}catch{return!1}}function L(d,p){if(!d||!p)return;d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);let k=0;const B=async()=>{if(k+=1,!(typeof d.isDestroyed=="function"?d.isDestroyed():!1)&&d.id===`webview-${x()}`){try{if(await d.executeJavaScript("Boolean(window.__oneviewManualCredentialEditAt)",!0)){d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);return}}catch{}await m(d,p),k<6&&(d._oneviewAutofillTimer=setTimeout(B,1e3))}};B()}async function U(d){if(!d)return null;try{const p=await d.executeJavaScript(`
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
        `,!0);return p&&(p.username||p.password)?p:null}catch{return null}}async function T(d){if(d)try{await d.executeJavaScript(`
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
        `,!0)}catch{}}async function P(d){if(!d)return null;try{const p=await d.executeJavaScript(`
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
        `,!0);return p&&(p.username||p.password)?p:null}catch{return null}}async function oe(d,p){if(!De()||!d||!p||p.id!==x()||!p.credentialAutomationEnabled)return;String(d.getURL?.()||p.url||"");const k=await P(d),B=k?null:await U(d),R=k||B;if(!R)return;const D=String(R.trigger||""),f=String(R.activeInputType||"").toLowerCase()==="password";if(k&&D==="input"&&f||!k&&f)return;const u=w(p),b=String(R.url||d.getURL()||""),M=Te(b),H=Ie(p);let _=je(R.username);const ne=String(R.password||"");if(!u||!M)return;const ce=/^\d{4,8}$/.test(ne),pe=/authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(b.toLowerCase());if(R.otpLike||pe&&ce)return;const he=String(H[M]||"").trim()||String(p.lastUsernameHint||"").trim(),te=!!_&&!!ne&&_.toLowerCase()===ne.toLowerCase();_&&!te?(H[M]=_,p.lastUsernameHint=_):H[M]?_=H[M]:p.lastUsernameHint&&(_=String(p.lastUsernameHint||"").trim());const G=he||String(H[M]||"").trim()||String(p.lastUsernameHint||"").trim(),fe=!!_&&!!ne&&_.toLowerCase()===ne.toLowerCase();if(fe&&G&&G!==_&&(_=G),!_||!ne||fe&&(!G||G.toLowerCase()===_.toLowerCase()))return;const J=`${u}|${M}|${_}`,de=Date.now(),ct=ve.get(J)||0;if(de-ct<15e3)return;if(ve.set(J,de),await Oe(),ye(M)&&Ve(u,_,M)){(A()[u]||[]).find(xt=>se(xt.domain)===M&&String(xt.username||"").trim().toLowerCase()===_.toLowerCase())&&window.api?.deleteProfileCredential&&(await window.api.deleteProfileCredential({profileId:u,domain:M,username:_}),await Oe());return}const dt=(A()[u]||[]).find(it=>se(it.domain)===M&&String(it.username||"").trim().toLowerCase()===_.toLowerCase());if(!(dt&&String(dt.password||"")===ne))try{if(!(await window.api.saveProfileCredential({profileId:u,domain:M,username:_,password:ne}))?.success)return;await Oe()}catch(it){console.warn("Could not save remembered credential:",it)}}function K(d,p){!d||!p||d._oneviewCredentialPollId||(d._oneviewCredentialPollId=setInterval(()=>{if(typeof d.isDestroyed=="function"?d.isDestroyed():!1){clearInterval(d._oneviewCredentialPollId),d._oneviewCredentialPollId=null;return}p.id===x()&&oe(d,p)},3e3))}async function q(d=!1){const p=document.getElementById("httpAuthModal"),k=document.getElementById("httpAuthForm"),B=F();p&&!p.classList.contains("hidden")&&r(()=>p.classList.add("hidden")),k&&k.reset(),j(null),d&&B?.challengeId&&typeof window.api?.submitHttpAuthChallenge=="function"&&window.api.submitHttpAuthChallenge({challengeId:B.challengeId,cancelled:!0}).catch(()=>{})}async function Z(d={}){const p=document.getElementById("httpAuthModal"),k=document.getElementById("httpAuthModalTitle"),B=document.getElementById("httpAuthMessage"),R=document.getElementById("httpAuthUsernameInput"),D=document.getElementById("httpAuthPasswordInput"),s=document.getElementById("httpAuthRememberInput"),f=document.getElementById("httpAuthSubmitBtn");if(!p||!k||!B||!R||!D||!s||!f)return;F()?.challengeId&&q(!0),j({...d});const g=String(d.reason||"")==="retry";k.textContent=g?"Login Failed, Update Credential":"Website Login Required";const u=String(d.host||d.url||"this website").trim(),b=String(d.realm||"").trim(),M=String(d.profileId||"").trim().toUpperCase();B.textContent=b?`${u} • ${b}${M?` • ${M}`:""}`:`${u}${M?` • ${M}`:""}`,R.value=String(d.username||""),D.value=String(d.password||""),s.checked=d.remember!==!1,f.textContent=g?"Update And Login":"Login",await i(()=>p.classList.remove("hidden")),D.value?(D.focus(),D.select()):(R.focus(),R.select())}function W(){const d=document.getElementById("httpAuthModal"),p=document.getElementById("httpAuthForm"),k=document.getElementById("httpAuthModalCloseBtn");!d||!p||!k||p.dataset.initialized!=="1"&&(p.dataset.initialized="1",k.addEventListener("click",()=>q(!0)),d.addEventListener("click",B=>{B.target===d&&q(!0)}),p.addEventListener("submit",async B=>{B.preventDefault();const R=F(),D=document.getElementById("httpAuthUsernameInput"),s=document.getElementById("httpAuthPasswordInput"),f=document.getElementById("httpAuthRememberInput");if(!R?.challengeId||!D||!s||typeof window.api?.submitHttpAuthChallenge!="function")return;const g=String(D.value||"").trim(),u=String(s.value||""),b=!!f?.checked;if(!(!g||!u))try{await window.api.submitHttpAuthChallenge({challengeId:R.challengeId,username:g,password:u,remember:b}),q(!1)}catch(M){console.error("Failed to submit HTTP auth credential",M),t("Could not submit the website credential.","error")}}),typeof window.api?.onHttpAuthChallenge=="function"&&window.api.onHttpAuthChallenge(B=>{Z(B).catch(R=>{console.error("Failed to open HTTP auth modal",R)})}))}function ee(){}async function re(d,p){if(!p||!p.rect)return;const k=d.getURL(),B=Te(k);if(!B)return;const R=[];if(Object.entries(A()).forEach(([s,f])=>{f.forEach(g=>{const u=se(g.domain);if(u===B||B.endsWith(`.${u}`)&&u.split(".").length>1){const b=n.PROFILES[s]||{name:s,color:"#ccc"};R.push({...g,profileId:s,profileName:b.name,profileColor:b.color})}})}),R.length===0)return;const D=`if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(R)});
    }`;d.executeJavaScript(D,!0).catch(()=>{})}return{canUseSecureCredentialApi:De,getAutofillCredentialForTab:Ze,initHttpAuthPrompt:W,initPasswordManager:ee,installCredentialCaptureHooks:T,isCredentialAutomationDomain:Le,isLikelyAuthPage:Se,maybeOfferRememberCredentials:oe,normalizeDomain:se,refreshCredentialCacheIfStale:Be,scheduleCredentialAutofill:L,shouldEnableCredentialAutomation:ze,startCredentialCapturePolling:K,handleCredentialFieldInteraction:re,hideCredentialDropdown:()=>{}}}function ki({state:e,constants:n,createNativePageDescriptor:t,ensureNativeSettingsGeneralInfo:i,normalizeSettingsSection:r,renderNativeSettingsPage:c,closeBrowserExtensionsMenu:w,closeBrowserExtensionPopup:S,refreshBrowserExtensionsUi:I,refreshTabScrollControls:C,syncProfileSelectionForTab:h,updateProfileLockUI:y,perfMark:x,shouldRequirePlatformApiForNavigation:A,getWebviewPlatformApiFlag:N,setWebviewPlatformApiFlag:F,getWebviewPreloadPathCached:j,startCredentialCapturePolling:Q,scheduleCredentialAutofill:ue,installCredentialCaptureHooks:Y,refreshCredentialCacheIfStale:ae,getAutofillCredentialForTab:ve,resolveAssignedProfileIdForTab:xe,getCredentialScopeIdByPartition:Qe,resolveCredentialScopeIdForTab:De,maybeOfferRememberCredentials:se,syncTabProfileForPage:we,trackProfileHistory:tt,resolveProfileIdForTab:Te,resolveAssignedProfileId:ye,resolveStrictProfileNavigationTarget:Ce,resolveNavigationPartition:Ve,applyProfileSelection:je,openProfilePromptDialog:Me,handleCredentialFieldInteraction:Oe,hideCredentialDropdown:Be}){const{PARTITIONS:Ie,PROFILES:Se,LOCAL_WEB_APP_TYPES:Le,WEBVIEW_POOL_MAX:ze=6,WEBVIEW_POOL_KEEPALIVE_MS:qe=6e4,TAB_PREWARM_ENABLED:nt=!1,PREWARM_ALL_PROFILE_PARTITIONS:Ze=!1,IS_DEV_APP_BUILD:m}=n,L=[];let U=null;const T=new Map,P=()=>e.tabs,oe=o=>{e.tabs=o},K=()=>e.activeTabId,q=o=>{e.activeTabId=o},Z=()=>e.currentProfileId;function W(o){const a=document.querySelector(".browser-controls-overlay");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result"));l&&o&&(o.hideBrowserControls=!1);const E=!!((o&&!o.isHome&&o.hideBrowserControls||o?.nativePage)&&!l);a.classList.toggle("hidden",E),l?(a.classList.remove("hidden"),a.style.setProperty("display","flex","important"),a.style.setProperty("visibility","visible","important"),a.style.setProperty("opacity","1","important"),a.style.setProperty("height","40px","important")):(a.style.removeProperty("display"),a.style.removeProperty("visibility"),a.style.removeProperty("opacity"),a.style.removeProperty("height"))}function ee(o){const a=document.getElementById("browserDetachHeader");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result")),E=(!o||o.isHome||!!o.hideBrowserControls||!!o.nativePage)&&!l;a.classList.toggle("hidden",E)}function re(o){const a=document.querySelector(".profile-section");if(!a)return;const l=o&&(o.url&&(o.url.includes("result.html")||o.url.includes("extension-icon")||o.url.toLowerCase().includes("result"))||o.title&&o.title.includes("Result")),E=!!((o&&!o.isHome&&o.hideBrowserControls||o?.nativePage)&&!l);a.classList.toggle("hidden",E)}function d(o,a){const l=P().find(v=>v.id===o);if(!l)return;l.title=a;const E=document.getElementById(`tab-ui-${o}`);E&&(E.querySelector(".tab-title").textContent=a)}function p(){const o=K();return o&&P().find(a=>a.id===o)||null}function k(){const o=K();return o?document.getElementById(`webview-${o}`):null}function B(o){const a=document.getElementById("urlDisplay");a&&(a.value=o)}function R(o){const a=document.getElementById("urlDisplay");a&&(a.value=o)}function D(o){o&&(o._oneviewCredentialPollId&&(clearInterval(o._oneviewCredentialPollId),o._oneviewCredentialPollId=null),o._oneviewAutofillTimer&&(clearTimeout(o._oneviewAutofillTimer),o._oneviewAutofillTimer=null))}function s(o){document.querySelectorAll(".webviews-container .webcontent-pane").forEach(l=>{const E=l.id.replace("webview-",""),v=P().find(V=>V.id===E);E===o&&!v?.isHome&&v?.credentialAutomationEnabled?Q(l,v):D(l)})}function f(o,a=P().length-1){const l=document.getElementById("tabsList");if(!l)return;const E=document.createElement("div");E.className="tab",E.id=`tab-ui-${o.id}`,E.innerHTML=`
        <span class="tab-title">${o.title}</span>
        <button class="tab-close">x</button>
    `,E.addEventListener("click",V=>{V.target.classList.contains("tab-close")||_(o.id)}),E.querySelector(".tab-close").addEventListener("click",V=>{V.stopPropagation(),pe(o.id)});const $=l.children[a]||null;l.insertBefore(E,$),C()}function g(o){setTimeout(async()=>{const a=P().find(E=>E.id===o);if(!(!a||!a.isHome||document.getElementById(`webview-${o}`)))try{const E=await de(a);if(!E)return;E.classList.remove("active"),typeof E.hide=="function"&&E.hide().catch(()=>{}),E.syncBounds?.(!1)}catch(E){window.api.webContentCall("log-error",{key:`prewarm-err:${o}:${E.toString()}`}).catch(()=>{})}},0)}async function u(o=null,a=null,l="New Tab",E=null,v={}){const $=v.active!==!1;window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?a=Ie.gsk:a=pt(a||(Se[Z()]?Se[Z()].partition:Ie.guest));const z=`tab-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,O={id:z,title:l,url:o,partition:a,isHome:!o&&!v.nativePage,nativePage:v.nativePage&&typeof v.nativePage=="object"?t(v.nativePage.type||"settings",v.nativePage.section||"general"):null,lockedProfileId:E,hideBrowserControls:!1,launchedAppType:null,trackingAppId:"",trackingAppName:"",requiresPlatformApi:!1,extensionCompatEnabled:!1,extensionEntryPath:"",extensionActiveContext:{url:"",title:""},credentialAutomationEnabled:!1,lastCredentialSourceProfileId:null};O.trackingAppId=String(v.trackingAppId||"").trim(),O.trackingAppName=String(v.trackingAppName||l||O.title||"").trim(),O.extensionEntryPath=String(v.extensionEntryPath||"").trim(),O.extensionCompatEnabled=!!O.extensionEntryPath,O.extensionActiveContext=v.extensionActiveContext&&typeof v.extensionActiveContext=="object"?{url:String(v.extensionActiveContext.url||"").trim(),title:String(v.extensionActiveContext.title||"").trim()}:{url:"",title:""};const X=P(),be=X.findIndex(at=>at.id===K()),Re=Number.isInteger(v.insertIndex)?Math.max(0,Math.min(v.insertIndex,X.length)):be>=0?be+1:X.length;if(X.splice(Re,0,O),f(O,Re),O.nativePage)await _(z);else if(o){$&&q(z);const at=document.getElementById("view-home-content"),Dt=document.getElementById("webviews-container");$&&at&&at.classList.add("hidden");const bi=o&&(o.includes("result.html")||o.includes("extension-icon")||o.toLowerCase().includes("result"));if($&&Dt){Dt.classList.remove("hidden");let Fe=document.getElementById("tab-load-placeholder");bi?Fe&&(Fe.style.display="none"):Fe?Fe.style.display="flex":(Fe=document.createElement("div"),Fe.id="tab-load-placeholder",Fe.style.cssText=["position:absolute","inset:0","z-index:50","display:flex","flex-direction:column","align-items:center","justify-content:center","background:var(--bg-main,#f8fafc)","gap:16px"].join(";"),Fe.innerHTML=`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `,Dt.appendChild(Fe));const an=()=>{Fe&&(Fe.style.display="none")},sn=Ae=>{Ae&&(typeof Ae._oneviewPlaceholderFinalize=="function"&&(Ae.removeEventListener("did-stop-loading",Ae._oneviewPlaceholderFinalize),Ae.removeEventListener("did-fail-load",Ae._oneviewPlaceholderFinalize)),Ae._oneviewPlaceholderFinalize=null)},ln=setInterval(()=>{const Ae=document.getElementById(`webview-${z}`);if(!Ae)return;clearInterval(ln),clearTimeout(cn);const Mt=()=>{sn(Ae),clearTimeout(cn),an()};sn(Ae),Ae._oneviewPlaceholderFinalize=Mt,Ae.addEventListener("did-stop-loading",Mt,{once:!0}),Ae.addEventListener("did-fail-load",Mt,{once:!0})},100),cn=setTimeout(()=>{clearInterval(ln),an()},12e3)}await he(z,o,a,l,E,v,$)}else await _(z),nt&&g(z);return O}function b(o=K()){const a=P(),l=a.find(z=>z.id===o);if(!l)return;const E=a.findIndex(z=>z.id===l.id),v=document.getElementById(`webview-${l.id}`),$=v&&typeof v.getURL=="function"&&v.getURL()||l.url||"",V=v&&typeof v.getTitle=="function"&&v.getTitle()||l.title||"New Tab";u(l.isHome||!$||$==="about:blank"?null:$,l.partition,V,l.lockedProfileId||null,{insertIndex:E>=0?E+1:a.length,trackingAppId:l.trackingAppId||"",trackingAppName:l.trackingAppName||V})}function M(o){const a=P();if(!a.length)return;const l=a.findIndex($=>$.id===K()),v=((l>=0?l:0)+o+a.length)%a.length;_(a[v].id,{suppressHomeSearchFocus:!0})}async function H(o){!o||typeof o.focusWebContents!="function"||await o.focusWebContents().catch(()=>{})}async function _(o,a={}){q(o);const l=P().find(O=>O.id===o);if(!l)return;w(),S().catch(()=>{}),h(l),y(l),document.querySelectorAll(".tab").forEach(O=>O.classList.remove("active"));const E=document.getElementById(`tab-ui-${o}`);E&&E.classList.add("active");const v=document.getElementById("view-home-content"),$=document.getElementById("nativeTabContent"),V=document.getElementById("webviews-container"),z=document.querySelectorAll(".webviews-container .webcontent-pane");if(l.isHome){v.classList.remove("hidden"),$?.classList.add("hidden"),V.classList.add("hidden"),W(l),ee(l),re(l);const O=document.getElementById("googleSearchInput");O&&a?.suppressHomeSearchFocus!==!0&&(O.value="",O.focus())}else if(l.nativePage)v.classList.add("hidden"),$?.classList.remove("hidden"),V.classList.add("hidden"),W(l),ee(l),re(l),B(""),r(l.nativePage?.section)==="general"&&await i(),c(l);else{v.classList.add("hidden"),$?.classList.add("hidden"),V.classList.remove("hidden"),W(l),ee(l),re(l),z.forEach(X=>{X.id!==`webview-${o}`&&(X.classList.remove("active"),typeof X.hide=="function"&&X.hide().catch(()=>{}),X.syncBounds?.(!1))});let O=null;try{O=document.getElementById(`webview-${o}`),O||(O=await de(l))}catch(X){window.api.webContentCall("log-error",{key:`switchTab-create-err:${o}:${X.toString()}`}).catch(()=>{})}if(O)try{O.classList.add("active"),typeof O.show=="function"&&await O.show().catch(()=>{}),O.syncBounds?.(!0),await H(O),B(O.getURL())}catch(X){window.api.webContentCall("log-error",{key:`switchTab-show-err:${o}:${X.toString()}`}).catch(()=>{})}}s(l.id),I()}function ne(o){if(!o)return!1;const a=String(o.launchedAppType||"").toLowerCase();return Le.has(a)}function ce(o,a){if(!o||!a||!ne(a))return!1;const l=String(o.getAttribute("partition")||a.partition||"");if(!l)return!1;const E=o.parentElement;for(E&&E.removeChild(o),o.classList.remove("active"),L.push({webview:o,partition:l,platformApiEnabled:N(o),at:Date.now()}),x("view-webcontent","park-to-pool",{partition:l,poolSize:L.length});L.length>ze;){const v=L.shift();v&&v.webview&&!v.webview.isDestroyed?.()&&v.webview.remove()}return!0}function pe(o){const a=P(),l=a.findIndex(V=>V.id===o);if(l===-1)return;const E=K()===o;document.getElementById(`tab-ui-${o}`)?.remove();const v=document.getElementById(`webview-${o}`);if(v&&(D(v),(!ne(a[l])||!ce(v,a[l]))&&v.remove()),a.splice(l,1),a.length===0){q(null),u(),C();return}const $=a.some(V=>V.id===K());if(E||!$){const V=Math.min(l,a.length-1),z=a[V]||a[a.length-1];z&&_(z.id)}C()}async function he(o,a,l,E,v=null,$={},V=!0){const z=performance.now(),O=P().find(be=>be.id===o);if(!O)return;O._navStartedAt=z,x("view-nav","navigateTo-start",{tabId:O.id,url:String(a||""),partition:String(l||""),appType:$.appType||null}),O.isHome=!1,O.url=a,O.partition=l,O.lockedProfileId=v,O.hideBrowserControls=!!$.hideControls,O.launchedAppType=$.appType||null,O.lastCredentialSourceProfileId=null,O.trackingAppId=String($.trackingAppId||"").trim(),O.trackingAppName=String($.trackingAppName||E||O.title||"").trim(),O.requiresPlatformApi=A(a,$),E&&d(o,E),V&&(q(o),await _(o));let X=document.getElementById(`webview-${o}`);if(!X)X=await de(O,V);else{const be=X.getAttribute("partition"),Re=N(X);(be!==l||Re!==!!O.requiresPlatformApi)&&(D(X),(!ne(O)||!ce(X,O))&&X.remove(),X=await de(O,V))}V&&typeof X.show=="function"?await X.show().catch(()=>{}):!V&&typeof X.hide=="function"&&await X.hide().catch(()=>{}),typeof X.setMeta=="function"&&await X.setMeta({trackingAppId:O.trackingAppId,appName:O.trackingAppName,appType:O.launchedAppType||""}).catch(()=>{}),X.syncBounds?.(V),V&&(B(a),await H(X)),X.src!==a&&(X.src=a),x("view-nav","navigateTo-dispatch",{tabId:O.id,elapsedMs:Math.round(performance.now()-z)})}async function te(o,a,l,E=null,v={}){return he(K(),o,a,l,E,v,!0)}function G(o){o&&o.executeJavaScript(`
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
      `,!0).catch(()=>{})}function fe(o=""){const a=String(o||"").trim().toLowerCase();return!!(!a||a==="about:blank"||a.startsWith("javascript:")||a.startsWith("data:")||a.startsWith("chrome-error://"))}function J(o){o._hasTabListenersAttached||(o._hasTabListenersAttached=!0,o.addEventListener("ipc-message",async a=>{if(a.channel==="oneview:credential-field-focused")Oe(o,a.args[0]);else if(a.channel!=="oneview:credential-field-blurred"){if(a.channel==="oneview:credential-selected"){const l=a.args[0];l&&(ue(o,l),l.profileId&&l.profileId!==Z()&&je(l.profileId))}}}),o.addEventListener("console-message",a=>{const l=String(a?.message||"");(l.includes("[OneView][Credential")||l.includes("[VeevaSlide]"))&&console.log("[WebviewConsole]",{level:a?.level,line:a?.line,sourceId:a?.sourceId||"",message:l})}),o.addEventListener("did-start-loading",()=>{const a=o.id.replace("webview-",""),l=P().find(v=>v.id===a);if(!l)return;l._didStartLoadingAt=performance.now(),x("view-webcontent","did-start-loading",{tabId:l.id,url:o.getURL()||l.url||""}),l.url&&(l.url.includes("result.html")||l.url.includes("extension-icon")||l.url.toLowerCase().includes("result"))?(d(l.id,"Result"),l.id===K()&&R(l.url||"")):(d(l.id,"Loading..."),l.id===K()&&R(l.url||"Loading..."))}),o.addEventListener("did-stop-loading",async()=>{const a=o.id.replace("webview-",""),l=P().find(be=>be.id===a);if(!l)return;const E=typeof l._didStartLoadingAt=="number"?Math.round(performance.now()-l._didStartLoadingAt):null,v=typeof l._navStartedAt=="number"?Math.round(performance.now()-l._navStartedAt):null;x("view-webcontent","did-stop-loading",{tabId:l.id,url:o.getURL()||"",loadElapsedMs:E,navElapsedMs:v});const $=o.getURL()||l.url||"";let z=$&&($.includes("result.html")||$.includes("extension-icon")||$.toLowerCase().includes("result"))?"Result":o.getTitle()||l.title||"Tab";if(z==="Tab"||z==="Loading..."||!z)try{const be=new URL($);z=be.hostname?be.hostname.replace("www.",""):"Tab"}catch{z="Tab"}if((l.title==="Loading..."||l.title==="Tab"||!l.title||o.getTitle()&&o.getTitle()!=="about:blank")&&d(l.id,z),l.id===K()&&B($),l.url=$,l.credentialAutomationEnabled=nn($,z,l),l.credentialAutomationEnabled){const be=xe(l,$,z),Re=Qe(l.partition)||be||Z();await ae();const at=ve(Re,$,l);ue(o,at),Q(o,l),Y(o)}else D(o);await we(l,$,z,o),mi(o,l);const X=Te(l);tt(X,$,z),G(o)}),o.addEventListener("page-title-updated",a=>{const l=o.id.replace("webview-",""),E=P().find(v=>v.id===l);E&&(d(E.id,a.title),E.credentialAutomationEnabled&&se(o,E))}),o.addEventListener("will-navigate",()=>{const a=o.id.replace("webview-",""),l=P().find(E=>E.id===a);l&&l.credentialAutomationEnabled&&se(o,l)}),o.addEventListener("did-navigate-in-page",async()=>{const a=o.id.replace("webview-",""),l=P().find(V=>V.id===a);if(!l)return;const E=o.getURL();if(l.credentialAutomationEnabled=nn(E,o.getTitle()||l.title||"",l),!l.credentialAutomationEnabled){D(o);return}se(o,l),await ae();const v=Qe(l.partition)||xe(l,E,o.getTitle()||l.title||"")||De(l),$=ve(v,E,l);ue(o,$),Q(o,l)}),o.addEventListener("new-window",async a=>{const l=o.id.replace("webview-",""),E=P().find(be=>be.id===l);if(!E)return;typeof a?.preventDefault=="function"&&a.preventDefault();const v=String(a?.url||"").trim();if(fe(v))return;const $=String(o.getURL()||"").trim();if($&&$===v)return;let V=ye(v,"New Tab"),z=null;if(V)z=Se[V].partition;else if(Me){const be=Te(E)||"guest",Re=await Me(v,be);if(Re&&!Re.cancelled&&Re.profileId)V=Re.profileId,z=Se[V]?.partition;else return}else z=E.partition;const O=P(),X=O.findIndex(be=>be.id===E.id);u(v,z,"New Tab",V,{insertIndex:X>=0?X+1:O.length})}))}async function de(o,a=!0){if(T.has(o.id))return T.get(o.id);const l=dt(o,a);T.set(o.id,l);try{return await l}finally{T.delete(o.id)}}function ct(o){const a=String(o?.partition||"");if(!a||L.length===0)return null;const l=!!o?.requiresPlatformApi,E=L.findIndex($=>$.partition===a&&!!$.platformApiEnabled===l);if(E===-1)return null;const[v]=L.splice(E,1);return v?.webview||null}async function dt(o,a=!0){const l=performance.now(),E=document.getElementById("webviews-container"),v=ct(o);if(v)return v.classList.toggle("active",a),v.id=`webview-${o.id}`,v.setAttribute("partition",o.partition),F(v,!!o.requiresPlatformApi),J(v),E.appendChild(v),a&&typeof v.show=="function"?v.show().catch(()=>{}):!a&&typeof v.hide=="function"&&v.hide().catch(()=>{}),v.syncBounds?.(a),a&&typeof v.focusWebContents=="function"&&v.focusWebContents().catch(()=>{}),x("view-webcontent","reuse-pooled",{tabId:o.id,partition:o.partition,elapsedMs:Math.round(performance.now()-l),poolSize:L.length}),v;const $=j(),V=await un({key:`view:${o.id}`,partition:o.partition,preloadPath:$,additionalArguments:o.requiresPlatformApi?["--oneview-enable-platform-api=1"]:[],extensionEntryPath:o.extensionEntryPath,extensionActiveContext:o.extensionActiveContext,extensionCompat:!0,initialMeta:{trackingAppId:o.trackingAppId,appName:o.trackingAppName,appType:o.launchedAppType||"",extensionEntryPath:o.extensionEntryPath},className:`webcontent-pane${a?" active":""}`});return V.id=`webview-${o.id}`,V.setAttribute("partition",o.partition),F(V,!!o.requiresPlatformApi),J(V),E.appendChild(V),!a&&typeof V.hide=="function"&&V.hide().catch(()=>{}),V.syncBounds?.(a),a&&typeof V.focusWebContents=="function"&&V.focusWebContents().catch(()=>{}),x("view-webcontent","create-fresh",{tabId:o.id,partition:o.partition,elapsedMs:Math.round(performance.now()-l)}),V}function it(){U||(U=setInterval(()=>{if(!document.hidden&&L.length!==0)for(let o=L.length-1;o>=0;o-=1){const l=L[o]?.webview;if(!l||l.isDestroyed?.()){L.splice(o,1);continue}l.executeJavaScript("void 0",!1).catch(()=>{})}},qe))}async function $t(o){const a=String(o||"").trim();if(!a||L.some($=>$.partition===a))return;const l=document.getElementById("webviews-container");if(!l)return;const E=j(),v=`view:prewarm:${a}:${Date.now()}`;try{const $=await un({key:v,partition:a,preloadPath:E,className:"webcontent-pane"});$.id=`webview-prewarm-${Date.now()}`,l.appendChild($),$.syncBounds?.(),ce($,{launchedAppType:"website",partition:a})}catch{}}async function xt(){const o=Array.from(new Set(Object.values(Se).map(a=>String(a?.partition||"").trim()).filter(Boolean)));for(const a of o)await $t(a),await new Promise(l=>setTimeout(l,60))}async function di(){const o=Se[Z()]?.partition||Se.guest.partition;o&&await $t(o)}function ui(){it(),nt&&(Ze?xt():di())}function pi(){for(U&&(clearInterval(U),U=null);L.length>0;){const o=L.shift();o&&o.webview&&!o.webview.isDestroyed?.()&&o.webview.remove()}}function fi(o,a=null){if(!o||o.isHome)return!1;const l=a&&typeof a.getURL=="function"&&a.getURL()||o.url||"";return m?!0:/^file:\/\//i.test(String(l||"").trim())}function mi(o,a){if(!o||!a||a.launchedAppType!=="website")return;const l=`
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
  `;try{o.insertCSS(l)}catch(E){console.warn("Could not apply website scrollbar theme:",E)}}function wi(){const o=P().find(l=>l.id===K());if(!o||o.isHome)return;o.isHome=!0,o.url=null,o.lockedProfileId=null,d(o.id,"New Tab");const a=document.getElementById(`webview-${o.id}`);a&&(D(a),(!ne(o)||!ce(a,o))&&a.remove()),_(o.id)}function gi(o=""){const a=String(o||"").trim();if(!a)return"";const l=a.match(/^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/);if(l){const v=l[1].toUpperCase(),$=decodeURIComponent(l[2]).replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${v}:/${$}`}if(/^file:\/\//i.test(a)||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/^about:/i.test(a))return a;const E=a.match(/^([a-zA-Z])[:/\\](.*)$/);if(E){const v=E[1].toUpperCase(),$=E[2].replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${v}:/${$}`}if(/^\/[A-Za-z]\//.test(a)){const v=a[1].toUpperCase(),$=a.slice(3).replace(/\\/g,"/");return`file:///${v}:/${$}`}return/^\\\\/.test(a)?`file:${a.replace(/\\/g,"/")}`:a}function _t(o=""){const a=String(o||"").trim();return!a||/\s/.test(a)?!1:!!(/^about:/i.test(a)||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(a)||/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(a)||a.includes(".")||/[/:?#]/.test(a))}async function hi(o){if(o=gi(o),!o)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){let v=o;_t(o)?!/^[a-z][a-z0-9+.-]*:\/\//i.test(o)&&!/^about:/i.test(o)&&(v=`https://${o}`):v=`https://www.google.com/search?q=${encodeURIComponent(o)}`,await te(v,Ie.gsk,o);return}let a=o,l=_t(o);if(l?!/^[a-z][a-z0-9+.-]*:\/\//i.test(o)&&!/^about:/i.test(o)&&!/^file:\/\//i.test(o)&&(a=`https://${o}`):_t(o)?(a=`https://${o}`,l=!0):a=`https://www.google.com/search?q=${encodeURIComponent(o)}`,l){const v=await Ce(a,null,"New Tab");if(!v||v.cancelled)return;const $=v.profileId,V=v.partition;$&&$!==Z()&&je($,{bypassLock:!0}),await te(a,V,"New Tab",v.lockedProfileId);return}const E=Ve(a,p()?.partition||Se[Z()]?.partition||Ie.guest,"Google Search");await te(a,E,"Google Search")}function vi(o,{isTeardown:a=!1}={}){const l=P(),E=Array.isArray(o)?o.filter(Boolean):[];if(E.length===0||l.length===0)return;const v=new Set(E),$=[...l],V=$.findIndex(z=>z.id===K());if($.forEach(z=>{if(!v.has(z.id))return;document.getElementById(`tab-ui-${z.id}`)?.remove();const O=document.getElementById(`webview-${z.id}`);O&&(D(O),(!ne(z)||!ce(O,z))&&O.remove())}),oe($.filter(z=>!v.has(z.id))),P().length===0){q(null),a||(u(),C());return}if(v.has(K())){const z=Math.min(Math.max(V,0),P().length-1);q(P()[z].id)}_(K()||P()[0].id),C()}function nn(o="",a="",l=null){return l?l.launchedAppType==="website"||!l.launchedAppType?on(o,a)||rn(o):!0:!1}function on(o="",a=""){const l=`${String(o||"")} ${String(a||"")}`.toLowerCase();if(/login|sign in|signin|password|sso|authenticate|verify/.test(l))return!0;try{const E=new URL(String(o||"")),v=`${E.pathname.toLowerCase()} ${E.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(v)}catch{return!1}}function rn(o=""){let a="";try{a=new URL(String(o||"")).hostname.toLowerCase()}catch{return!1}return a==="10.215.56.196"||a.endsWith(".gskinternet.com")||a.endsWith(".gskpro.com")||a.endsWith(".veevavault.com")||a.endsWith(".okta.com")||a.endsWith(".oktacdn.com")||a.endsWith(".pingone.com")}return{closeTab:pe,closeTabsBulk:vi,createTab:u,createWebviewForTab:de,duplicateTab:b,disposeWebviewRuntime:pi,getActiveTab:p,getActiveWebview:k,goToActiveTabHome:wi,isInspectableLocalFileTab:fi,navigateTo:te,navigateToTab:he,performSearch:hi,startWebviewRuntime:ui,switchRelativeTab:M,switchTab:_,updateTabTitle:d,updateUrlDisplay:B,updateUrlDisplayString:R,getCurrentProfileId:Z,getTabs:P}}console.log("View Page Script initializing...");let le=[],Ne=null,Pt=!1,Un=null,pn=null,fn=[],mn=[],wn={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};const zt=Ke.profileHistory,qt="view.profileHistory.v1";let ke={wppproduction:[],vml:[],gsk:[],guest:[]};const Nn=Ke.customBookmarks;let $e=[],gn="guest",Ht="guest",hn="",st="guest",It=null,Ye=null,vn=null;const Bi=new Set(["login.veevavault.com","federation.gsk.com"]);let wt=null,_e=-1,Ue=[],bn={version:"",defaultOpenStatus:""},yn=0,Sn=null,En=!1;const On=Ke.perfEnabled;let ut=null,xn=!1;const Et={};Object.defineProperties(Et,{tabs:{get:()=>le,set:e=>{le=e}},activeTabId:{get:()=>Ne,set:e=>{Ne=e}},browserExtensionsCache:{get:()=>fn,set:e=>{fn=e}},managedDownloadsCache:{get:()=>mn,set:e=>{mn=e}},nativeSettingsGeneralInfo:{get:()=>bn,set:e=>{bn=e}},historyProfileId:{get:()=>Ht,set:e=>{Ht=e}},historySearchQuery:{get:()=>hn,set:e=>{hn=e}},currentProfileId:{get:()=>me,set:e=>{me=e}},profileHistoryCache:{get:()=>ke,set:e=>{ke=e}},credentialCache:{get:()=>wn,set:e=>{wn=e}},passwordProfileId:{get:()=>gn,set:e=>{gn=e}},passwordEditTarget:{get:()=>pn,set:e=>{pn=e}},activeHttpAuthChallenge:{get:()=>vn,set:e=>{vn=e}},credentialCacheRefreshedAt:{get:()=>yn,set:e=>{yn=e}},credentialCacheRefreshInFlight:{get:()=>Sn,set:e=>{Sn=e}}});const Wt={synapse:{partition:ge.synapse},contentgen:{partition:ge.contentgen}},Yt=new Set(["nextjs","vite","react","angular","html","neutralino","website","vite-server"]),Rn=(()=>{try{return new URL(Mn).origin.toLowerCase()}catch{return""}})(),Ai=new URL(""+new URL("contentgen-DZqnGDPH.png",import.meta.url).href,import.meta.url).href,Ti=new URL(""+new URL("contentgen-dark-C7HM67Tp.png",import.meta.url).href,import.meta.url).href;function Cn(e=document){if(!e||typeof e.querySelectorAll!="function")return;const n=document.body.classList.contains("dark-mode");e.querySelectorAll("img[data-theme-icon]").forEach(t=>{const i=String(t.getAttribute("data-theme-icon")||"").trim();let r="";i==="contentgen"&&(r=n?Ti:Ai),r&&t.getAttribute("src")!==r&&t.setAttribute("src",r)})}function $i(){["httpAuthModal","bookmarkModal","cacheActionModal","extensionsManagerModal"].forEach(e=>{const n=document.getElementById(e);!n||n.dataset.hoistedToBody==="1"||(document.body.appendChild(n),n.dataset.hoistedToBody="1")})}async function In(){const e=Xe();if(!(!e||e.isHome||!e.url||!window.api?.openDetachedViewWindow))try{await window.api.openDetachedViewWindow({url:e.url,title:e.title||"Detached Tab",partition:e.partition||ge.guest}),Kt(e.id)}catch(n){console.error("Failed to open detached tab window",n),We("Could not open the page in a separate window.","error")}}function Tt(){if(ut!==null)return ut;try{const e=localStorage.getItem(On);return ut=e==="1"||e==="true",ut}catch{return ut=!1,!1}}function Fn(e,n,t=null){if(!Tt())return;const i=t?{...t}:{};try{console.log(`[PERF][${e}] ${n}`,i)}catch{}}window.addEventListener("storage",e=>{e.key===On&&(ut=null,window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Tt()).catch(()=>{}))});const ie={wppproduction:{id:"wppproduction",name:"WPPProduction",partition:ge.wppproduction,color:"#000000",bgColor:"#e2e8f0",label:"W"},vml:{id:"vml",name:"VML",partition:ge.vml,color:"#ff0000",bgColor:"#fee2e2",label:"V"},gsk:{id:"gsk",name:"GSK",partition:ge.gsk,color:"#f37521",bgColor:"#ffedd5",label:"G"},guest:{id:"guest",name:"Guest",partition:ge.guest,color:"#64748b",bgColor:"#f1f5f9",label:"?"}};let me="guest";function _i(){return me}const Di=Pi({state:Et,constants:{AUTH_GATEWAY_HOSTS:Bi,RESOURCE_SERVICE_ORIGIN:Rn,PROFILES:ie},showToast:We,openOverlayModal:rt,closeOverlayModal:Ge,renderProfilePillSelect:Zt,resolveCredentialScopeIdForTab:ei,applyProfileSelection:mt,getCurrentProfileId:()=>me,escapeHtml:Ee}),{getAutofillCredentialForTab:Mi,initHttpAuthPrompt:Ui,installCredentialCaptureHooks:Ni,isLikelyAuthPage:Oi,maybeOfferRememberCredentials:Ri,refreshCredentialCacheIfStale:Fi,scheduleCredentialAutofill:Hi,startCredentialCapturePolling:Wi,handleCredentialFieldInteraction:Vi,hideCredentialDropdown:ji}=Di;let lt=null,gt=null;const zi=Li({state:Et,constants:{PROFILES:ie,PENDING_EXTENSION_OPEN_STORAGE_KEY:"oneview.pendingExtensionOpenPath",EXTENSION_PIN_STORAGE_KEY:"oneview.browserExtensions.pinned.v1",IS_DEV_APP_BUILD:bt},escapeHtml:Ee,showToast:We,openOverlayModal:rt,closeOverlayModal:Ge,getActiveTab:(...e)=>gt?.getActiveTab?.(...e)??null,getActiveWebview:(...e)=>gt?.getActiveWebview?.(...e)??null,createTab:(...e)=>gt?.createTab?.(...e),refreshActiveNativeSettingsPage:(...e)=>lt?.refreshActiveNativeSettingsPage?.(...e)??Promise.resolve(),closeSettingsMenu:So}),{closeBrowserExtensionPopup:Gt,closeBrowserExtensionsMenu:qi,formatDownloadBytes:Yi,formatDownloadEta:Gi,formatDownloadSpeed:Ki,initDownloadsManager:Ji,initExtensionsManager:Xi,loadManagedDownloadsFromMain:Qi,refreshBrowserExtensionsUi:Zi,refreshExtensionsManagerList:Hn}=zi;gt=ki({state:Et,constants:{PARTITIONS:ge,PROFILES:ie,LOCAL_WEB_APP_TYPES:Yt,WEBVIEW_POOL_MAX:6,WEBVIEW_POOL_KEEPALIVE_MS:12e3,TAB_PREWARM_ENABLED:!0,PREWARM_ALL_PROFILE_PARTITIONS:!1,IS_DEV_APP_BUILD:bt},createNativePageDescriptor:(...e)=>lt?.createNativePageDescriptor?.(...e)??null,ensureNativeSettingsGeneralInfo:(...e)=>lt?.ensureNativeSettingsGeneralInfo?.(...e)??Promise.resolve(),normalizeSettingsSection:(...e)=>lt?.normalizeSettingsSection?.(...e)??"general",renderNativeSettingsPage:(...e)=>lt?.renderNativeSettingsPage?.(...e),closeBrowserExtensionsMenu:qi,closeBrowserExtensionPopup:Gt,refreshBrowserExtensionsUi:Zi,refreshTabScrollControls:At,syncProfileSelectionForTab:Io,updateProfileLockUI:vt,perfMark:Fn,shouldRequirePlatformApiForNavigation:To,getWebviewPlatformApiFlag:$o,setWebviewPlatformApiFlag:_o,getWebviewPreloadPathCached:Ao,startCredentialCapturePolling:Wi,scheduleCredentialAutofill:Hi,installCredentialCaptureHooks:Ni,refreshCredentialCacheIfStale:Fi,getAutofillCredentialForTab:Mi,resolveAssignedProfileIdForTab:Yn,getCredentialScopeIdByPartition:Vn,resolveCredentialScopeIdForTab:ei,maybeOfferRememberCredentials:Ri,syncTabProfileForPage:Lo,trackProfileHistory:Bo,resolveProfileIdForTab:Zn,resolveAssignedProfileId:St,resolveStrictProfileNavigationTarget:Gn,resolveNavigationPartition:et,applyProfileSelection:mt,openProfilePromptDialog:jt,handleCredentialFieldInteraction:Vi,hideCredentialDropdown:ji});const{closeTab:Kt,closeTabsBulk:ht,createTab:Pe,createWebviewForTab:eo,duplicateTab:to,disposeWebviewRuntime:Wn,getActiveTab:Xe,getActiveWebview:Je,goToActiveTabHome:no,isInspectableLocalFileTab:io,navigateTo:yt,navigateToTab:oo,performSearch:kt,startWebviewRuntime:ro,switchRelativeTab:Ct,switchTab:He,updateTabTitle:ao,updateUrlDisplay:so,updateUrlDisplayString:Ln,getTabs:Pn}=gt;lt=Ii({state:Et,constants:{PROFILES:ie,PARTITIONS:ge,IS_DEV_APP_BUILD:bt},escapeHtml:Ee,showToast:We,isPerfEnabled:Tt,formatDownloadBytes:Yi,formatDownloadSpeed:Ki,formatDownloadEta:Gi,formatHistoryTime:ti,loadManagedDownloadsFromMain:Qi,refreshExtensionsManagerList:Hn,saveProfileHistoryStore:en,getActiveTab:Xe,updateTabTitle:ao,createTab:Pe,switchTab:He,navigateTo:yt});const{bindSettingsShortcutsGlobal:lo,createNativePageDescriptor:pr,ensureNativeSettingsGeneralInfo:fr,getSettingsTabTitle:mr,initNativeSettingsUi:co,initSettingsMenu:uo,isEditableShortcutTarget:po,isNativeSettingsTab:wr,normalizeSettingsSection:gr,openSettingsTab:Vt,refreshActiveNativeSettingsPage:fo,renderNativeSettingsPage:hr,updateNativeSettingsTabSection:vr}=lt;function mo(){try{return localStorage.getItem("username")==="Guest"}catch{return!1}}function wo(e="",n="",t=""){const i=String(t||"").trim().toLowerCase();if(Wt[i])return i;const r=String(n||"").trim().toLowerCase(),c=String(e||"").trim().toLowerCase();try{const w=new URL(String(e||"")),S=`${w.protocol}//${w.host}`.toLowerCase(),I=String(w.pathname||"/").toLowerCase();if(S===Rn&&(I==="/"||I===""))return"synapse";if(S==="http://10.215.56.196:3456")return"contentgen"}catch{}return/content[\s-]*gen/.test(r)||/content[\s-]*gen/.test(c)?"contentgen":r.includes("synapse")?"synapse":""}function Jt(e){const n=pt(e);if(n===ge.synapse||n===ge.contentgen)return"guest";const t=Object.values(ie).find(i=>i.partition===n);return t?t.id:null}function Vn(e){const n=pt(e);return n===ge.synapse?"synapse":n===ge.contentgen?"contentgen":Jt(n)}function et(e="",n="",t="",i={}){const r=String(i?.sessionScope||i?.credentialScope||"").trim()||"",c=wo(e,t,r);return c&&Wt[c]?Wt[c].partition:pt(n||ie[me]?.partition||ge.guest)}async function go(){const e=document.getElementById("view-synapse-link-btn");if(!e||(e.style.display="none",mo()))return;const n=String(localStorage.getItem("emp_id")||"").trim(),t=String(localStorage.getItem("username")||"").trim(),i=/^\d+$/.test(t)?t:"",r=n||i;if(r)try{const c=await fetch(`${Mn}/api/list_of_users`,{signal:AbortSignal.timeout(5e3)});if(!c.ok)throw new Error(`API returned ${c.status}`);const w=await c.json(),S=Array.isArray(w)?w:Array.isArray(w?.users)?w.users:[],I=new Set(S.map(C=>String(C?.emp_id??"").trim()).filter(Boolean));e.style.display=I.has(r)?"flex":"none"}catch(c){console.warn("Could not verify Synapse visibility in view",c),e.style.display="none"}}function ho(e="",n="addressSearchDropdown"){const t=document.getElementById(n);if(!t)return;const i=String(e||"").trim().toLowerCase();if(!i){t.classList.add("hidden"),Ue=[],_e=-1;return}const r=le.filter(h=>{const y=String(h.title||"").toLowerCase(),x=String(h.url||"").toLowerCase();return y.includes(i)||x.includes(i)}).map(h=>({type:"tab",id:h.id,title:h.title||"Untitled Tab",url:h.url||"",partition:h.partition}));let c=[];Object.values(ke).forEach(h=>{Array.isArray(h)&&h.forEach(y=>{const x=String(y.title||"").toLowerCase(),A=String(y.url||"").toLowerCase();if(x.includes(i)||A.includes(i)){const N=c.some(j=>j.url===y.url),F=r.some(j=>j.url===y.url);!N&&!F&&c.push({type:"history",title:y.title||"History Item",url:y.url,partition:y.partition||ge.guest})}})}),Ue=[{type:"search",title:e,url:`Search for "${e}"`},...r.slice(0,5),...c.slice(0,15)],_e=0;let S="";S+=Ut(Ue[0],0);const I=Ue.filter(h=>h.type==="tab");I.length>0&&(S+='<div class="address-search-group-label">Open Tabs</div>',I.forEach(h=>{const y=Ue.indexOf(h);S+=Ut(h,y)}));const C=Ue.filter(h=>h.type==="history");C.length>0&&(S+='<div class="address-search-group-label">History</div>',C.forEach(h=>{const y=Ue.indexOf(h);S+=Ut(h,y)})),t.innerHTML=S,t.classList.remove("hidden")}function Ut(e,n){const t=n===_e;let i=String(e.title||"H").charAt(0).toUpperCase(),r="is-history",c="History";return e.type==="tab"?(r="is-tab",c="Tab"):e.type==="search"&&(r="is-search",c="Search",i="🔍"),`
    <div class="address-search-item ${r} ${t?"is-selected":""}" 
         data-index="${n}">
      <div class="address-search-item-icon">${i}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${Ee(e.title)}</span>
        <span class="address-search-item-url">${Ee(e.url)}</span>
      </div>
      <div class="address-search-item-badge">${c}</div>
    </div>
  `}async function kn(e,n){const t=document.getElementById(e);if(!t)return;if(_e<0||_e>=Ue.length){kt(t.value);return}const i=Ue[_e],r=document.getElementById(n);r&&r.classList.add("hidden"),i.type==="tab"?await He(i.id):i.type==="history"?await ni(i.url,i.partition,i.title):kt(t.value),t.blur()}function Bn(e,n){const t=document.getElementById(e),i=document.getElementById(n);!t||!i||(t.addEventListener("input",()=>{ho(t.value,n)}),t.addEventListener("keydown",r=>{i.classList.contains("hidden")||(r.key==="ArrowDown"?(r.preventDefault(),_e=(_e+1)%Ue.length,An(n)):r.key==="ArrowUp"?(r.preventDefault(),_e=(_e-1+Ue.length)%Ue.length,An(n)):r.key==="Enter"?(r.preventDefault(),kn(e,n)):r.key==="Escape"&&i.classList.add("hidden"))}),i.addEventListener("click",r=>{const c=r.target.closest(".address-search-item");if(!c)return;const w=parseInt(c.dataset.index);isNaN(w)||(_e=w,kn(e,n))}))}function An(e){const n=document.getElementById(e);n&&n.querySelectorAll(".address-search-item").forEach((t,i)=>{const r=parseInt(t.dataset.index);t.classList.toggle("is-selected",r===_e),r===_e&&t.scrollIntoView({block:"nearest"})})}function vo(){const e=document.getElementById("googleSearchInput");e&&e.dataset.boundAddressInput!=="1"&&(e.dataset.boundAddressInput="1",e.addEventListener("keydown",t=>{const i=document.getElementById("addressSearchDropdownHome");i&&!i.classList.contains("hidden")||t.key==="Enter"&&kt(e.value)}),Bn("googleSearchInput","addressSearchDropdownHome"));const n=document.getElementById("urlDisplay");n&&n.dataset.boundAddressInput!=="1"&&(n.dataset.boundAddressInput="1",n.addEventListener("focus",()=>{n.select?.()}),n.addEventListener("keydown",t=>{const i=document.getElementById("addressSearchDropdown");if(!(i&&!i.classList.contains("hidden"))){if(t.key==="Enter")t.preventDefault(),kt(n.value),n.blur();else if(t.key==="Escape"){t.preventDefault();const r=Xe();so(r?.url||""),n.blur()}}}),Bn("urlDisplay","addressSearchDropdown"))}function jn(){if(Pt){window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode(),le.length===0?Pe():He(Ne||le[0].id);return}Pt=!0,console.log("initViewPage called"),Si().catch(n=>{console.warn("Could not initialize OneView shared storage sync",n)}),tr(),window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Tt()).catch(()=>{}),window.api&&typeof window.api.getPerfLogPath=="function"&&window.api.getPerfLogPath().then(n=>{n?.success&&Fn("perf","log-path",{path:n.path||"",enabled:n.enabled})}).catch(()=>{}),!En&&window.api&&typeof window.api.onCredentialDebugLog=="function"&&(En=!0,window.api.onCredentialDebugLog(n=>{console.log("[OneView][CredentialCapture][MainRelay]",n)})),document.body?.dataset.boundProfileHistorySharedStorage!=="1"&&window.api?.onOneviewSharedStorageUpdated&&(document.body.dataset.boundProfileHistorySharedStorage="1",window.api.onOneviewSharedStorageUpdated(n=>{String(n?.key||"")===qt&&(Qn(n),fo().catch(()=>{}))})),Oo(),ko(),Po().catch(()=>{}),Wo(),tn(),Cn(),$i(),document.addEventListener("click",n=>{const t=document.getElementById("addressSearchDropdown"),i=document.getElementById("addressSearchDropdownHome"),r=document.getElementById("urlDisplay"),c=document.getElementById("googleSearchInput");t&&!t.contains(n.target)&&n.target!==r&&t.classList.add("hidden"),i&&!i.contains(n.target)&&n.target!==c&&i.classList.add("hidden");const w=document.getElementById("credentialSelectionDropdown");w&&!w.contains(n.target)&&w.classList.add("hidden")}),document.body.dataset.viewThemeIconObserverBound||(document.body.dataset.viewThemeIconObserverBound="1",new MutationObserver(()=>{Cn()}).observe(document.body,{attributes:!0,attributeFilter:["class"]})),le.length===0?Pe():He(Ne||le[0].id);const e=document.getElementById("newTabBtn");e&&e.addEventListener("click",()=>{Pe()}),qo();try{vo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupViewSearch-err:${n.toString()}`}).catch(()=>{})}try{Ro()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupBookmarks-err:${n.toString()}`}).catch(()=>{})}go().catch(n=>{console.warn("Failed to update Synapse visibility in view",n)});try{jo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-initBookmarkManager-err:${n.toString()}`}).catch(()=>{})}document.getElementById("browserBack")?.addEventListener("click",()=>{const n=Je();if(n&&n.canGoBack()){n.goBack();return}no()}),document.getElementById("browserForward")?.addEventListener("click",()=>{const n=Je();n&&n.canGoForward()&&n.goForward()}),document.getElementById("browserReload")?.addEventListener("click",()=>{const n=Je();n&&n.reload()}),document.getElementById("browserDetach")?.addEventListener("click",In),document.getElementById("browserDetachHeader")?.addEventListener("click",In),yo(),ro(),Go(),Ui(),Co(),uo(),lo(),co(),Xi(),Ji(),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode()}window.addEventListener("beforeunload",()=>{Gt().catch(()=>{}),Wn()});window.addEventListener("teardown-view-system",()=>{console.log("Teardown View System triggered"),Gt().catch(()=>{}),Wn();const e=le.map(t=>t.id);ht(e,{isTeardown:!0});const n=document.getElementById("webviews-container");n&&(n.querySelectorAll(".webcontent-pane").forEach(i=>{try{typeof i.remove=="function"&&i.remove()}catch{}}),n.innerHTML=""),le=[],Ne=null,Pt=!1});function Nt(e){if(!e||e.isHome)return!1;const n=String(e.url||"").trim(),t=String(e.launchedAppType||"").trim().toLowerCase();return!n||n==="about:blank"||n==="newtab"||Lt(n)||!/^https?:\/\//i.test(n)?!1:!t||t==="website"}function bo({activateVisibleTab:e=!0}={}){if(!Pt||le.length===0)return;const n=le.filter(c=>!c.isHome&&!Nt(c)).map(c=>c.id);if(n.length>0&&ht(n),!e)return;const t=Xe();if(t&&Nt(t)){He(t.id);return}const i=le.find(c=>Nt(c));if(i){He(i.id);return}const r=le.find(c=>c.isHome);if(r){He(r.id);return}if(le.length===0){Pe();return}He(le[0].id)}window.addEventListener("ticket-switch-preserve-view",e=>{bo({activateVisibleTab:e?.detail?.activateVisibleTab!==!1})});async function yo(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;const e=JSON.parse(localStorage.getItem(Ke.installedApps)||"{}");let n=!1;for(const[t,i]of Object.entries(e)){const r=String(i?.type||"").toLowerCase();if(Yt.has(r)&&i?.localPath)try{const c=await window.api.resolveOneviewAppUrl(t,i.localPath);c?.success&&c.url&&i.oneviewUrl!==c.url&&(e[t]={...i,oneviewUrl:c.url},n=!0)}catch{}}n&&localStorage.setItem(Ke.installedApps,JSON.stringify(e))}window.initViewPage=jn;window.closeViewTab=Kt;function So(){const e=document.getElementById("settingsBtn");e&&e.classList.remove("is-active")}function Xt(){return{modal:document.getElementById("extensionPromptModal"),title:document.getElementById("extensionPromptTitle"),message:document.getElementById("extensionPromptMessage"),label:document.getElementById("extensionPromptLabel"),input:document.getElementById("extensionPromptInput"),textarea:document.getElementById("extensionPromptTextarea"),form:document.getElementById("extensionPromptForm"),submitBtn:document.getElementById("extensionPromptSubmitBtn"),cancelBtn:document.getElementById("extensionPromptCancelBtn"),closeBtn:document.getElementById("extensionPromptCloseBtn")}}async function Eo(e={}){const n=Xt();if(!n.modal||!n.form||!n.input||!n.textarea)return{cancelled:!0,value:""};if(Ye)return{cancelled:!0,value:""};const t=e&&typeof e=="object"?e:{},i=t.multiline===!0,r=t.required!==!1,c=String(t.value||""),w=String(t.title||"Extension Input").trim()||"Extension Input",S=String(t.message||"").trim(),I=String(t.label||"Value").trim()||"Value",C=String(t.submitLabel||"Submit").trim()||"Submit",h=String(t.cancelLabel||"Cancel").trim()||"Cancel",y=String(t.placeholder||"").trim();return n.title.textContent=w,n.message.textContent=S,n.message.classList.toggle("hidden",!S),n.label.textContent=I,n.submitBtn.textContent=C,n.cancelBtn.textContent=h,n.input.classList.toggle("hidden",i),n.textarea.classList.toggle("hidden",!i),n.input.required=!i&&r,n.textarea.required=i&&r,n.input.type=t.password===!0?"password":"text",n.input.placeholder=y,n.textarea.placeholder=y,n.input.value=i?"":c,n.textarea.value=i?c:"",new Promise(x=>{Ye={resolve:x,required:r,multiline:i},rt(()=>{n.modal.classList.remove("hidden"),n.modal.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{(i?n.textarea:n.input).focus(),(i?n.textarea:n.input).select?.()})}).catch(()=>{Ye=null,x({cancelled:!0,value:""})})})}function Tn(e={cancelled:!0,value:""}){const n=Xt();if(!n.modal||!Ye)return;const t=Ye;Ye=null,Ge(()=>{n.modal.classList.add("hidden"),n.modal.setAttribute("aria-hidden","true"),n.form.reset(),n.input.classList.remove("hidden"),n.textarea.classList.add("hidden"),n.input.type="text"}),t.resolve(e)}function xo(){return{modal:document.getElementById("profilePromptModal"),select:document.getElementById("profilePromptSelect"),continueBtn:document.getElementById("profilePromptContinueBtn"),cancelBtn:document.getElementById("profilePromptCancelBtn"),closeBtn:document.getElementById("profilePromptCloseBtn")}}let Ot=null;async function jt(e,n="guest"){const t=xo();if(!t.modal||!t.select)return{cancelled:!0,profileId:n};if(Ot)return{cancelled:!0,profileId:n};let i=n;const r=t.select;r.innerHTML=Object.values(ie).map(w=>{const S=String(w.name||"P").charAt(0).toUpperCase();return`
        <div class="profile-big-item ${w.id===i?"active":""}" data-id="${w.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${w.color};">
            ${S}
          </div>
          <span class="profile-big-name">${Ee(w.name)}</span>
        </div>
      `}).join("");const c=w=>{i=w,r.querySelectorAll(".profile-big-item").forEach(S=>{S.classList.toggle("active",S.dataset.id===w)})};r.querySelectorAll(".profile-big-item").forEach(w=>{const S=()=>{const I=w.dataset.id;!I||!ie[I]||c(I)};w.addEventListener("click",S),w.addEventListener("keydown",I=>{(I.key==="Enter"||I.key===" ")&&(I.preventDefault(),S())}),w.addEventListener("dblclick",()=>{S(),t.continueBtn?.click()})});try{await rt(()=>{t.modal.classList.remove("hidden"),t.modal.setAttribute("aria-hidden","false")})}catch{return{cancelled:!0,profileId:n}}return new Promise(w=>{Ot={resolve:w};const S=()=>{Ge(()=>{t.modal.classList.add("hidden"),t.modal.setAttribute("aria-hidden","true")}),t.continueBtn?.removeEventListener("click",I),t.cancelBtn?.removeEventListener("click",C),t.closeBtn?.removeEventListener("click",C),t.modal.removeEventListener("click",h),Ot=null},I=()=>{S(),w({cancelled:!1,profileId:i})},C=()=>{S(),w({cancelled:!0,profileId:n})};t.continueBtn?.addEventListener("click",I),t.cancelBtn?.addEventListener("click",C),t.closeBtn?.addEventListener("click",C);const h=y=>{y.target===t.modal&&C()};t.modal.addEventListener("click",h)})}function Co(){const e=Xt();if(!e.modal||e.modal.dataset.boundExtensionPrompt==="1")return;e.modal.dataset.boundExtensionPrompt="1",e.form?.addEventListener("submit",t=>{if(t.preventDefault(),!Ye)return;const i=Ye.multiline?e.textarea:e.input,r=String(i?.value||"");if(Ye.required&&!r.trim()){i?.focus();return}Tn({cancelled:!1,value:r})});const n=()=>Tn({cancelled:!0,value:""});e.cancelBtn?.addEventListener("click",n),e.closeBtn?.addEventListener("click",n),e.modal.addEventListener("click",t=>{t.target===e.modal&&n()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&Ye&&!e.modal.classList.contains("hidden")&&(t.preventDefault(),n())})}function zn(){return!!Xe()?.lockedProfileId}function vt(e=null){const n=e||Xe(),t=!!n?.lockedProfileId,i=document.getElementById("profileBtn");if(i){if(i.classList.toggle("locked",t),t){const r=ie[n.lockedProfileId]?.name||"assigned";i.title=`Profile locked to ${r} for this tab`}else i.title="Switch Profile";qn()}}function qn(){const e=zn();document.querySelectorAll(".profile-item[data-id]").forEach(t=>{t.classList.toggle("disabled",e),t.setAttribute("aria-disabled",e?"true":"false")})}function Qt(e){return Jt(e)}function Io(e){const n=Zn(e);!n||!ie[n]||me!==n&&mt(n,{bypassLock:!0})}function Zt(e,n,t){const i=document.getElementById(e);i&&(i.innerHTML=Object.values(ie).map(r=>`
      <div class="profile-pill-item ${r.id===n?"active":""}" data-id="${r.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${r.color};"></span>
        <span>${Ee(r.name)}</span>
      </div>
    `).join(""),i.querySelectorAll(".profile-pill-item").forEach(r=>{const c=()=>{const w=r.dataset.id;!w||!ie[w]||(i.querySelectorAll(".profile-pill-item").forEach(S=>{S.classList.toggle("active",S.dataset.id===w)}),typeof t=="function"&&t(w))};r.addEventListener("click",c),r.addEventListener("keydown",w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),c())})}))}function mt(e,{bypassLock:n=!1}={}){const t=String(e||"").trim();if(!ie[t]){console.warn(`[View] applyProfileSelection: Invalid profile ID "${t}"`);return}if(!n&&zn()){console.log("[View] applyProfileSelection BLOCKED: active tab is locked");return}console.log(`[View] applyProfileSelection: Switching to ${t}`),me=t,localStorage.setItem(Ke.currentProfileId,t),oi(),document.querySelectorAll(".profile-item").forEach(r=>{r.dataset.id===t?r.classList.add("active"):r.classList.remove("active")})}function St(e="",n=""){const t=String(n).toLowerCase(),i=String(e).toLowerCase();let r=i;try{r=decodeURIComponent(i)}catch{r=i}const c=`${t} ${i} ${r}`,w=/\bai\b/.test(t),S=/\b(imagine|empower|production ai|imagine wpp)\b/.test(t),I=c.includes("jira.")||c.includes("jira/")||c.includes("atlassian.net")||c.includes("jira.uhub.biz")||t.includes("jira"),C=t.includes("aem")||t.includes("veeva")||t.includes("gsk")||i.includes("gskinternet.com")||i.includes("gsk-contentlab.veevavault.com")||i.includes("veevavault.com"),h=w||S||i.includes("imagine.wpp.ai")||i.includes("://wpp.ai")||i.includes(".wpp.ai")||c.includes("://wpp.")||c.includes(".wpp.")||c.includes("wpp.com");return I?"vml":C?"gsk":h?"wppproduction":null}function Yn(e,n="",t=""){const i=String(e?.lockedProfileId||"").trim().toLowerCase(),r=St(n,t);return i&&Oi(n,t)?i:r}async function Gn(e,n=null,t="New Tab",i={}){const r=String(n||"").trim(),c=r?Qt(r):null;if(String(e||"").trim().toLowerCase().startsWith("file://"))return{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:et(e,ie.guest.partition,t,i)};const S=St(e,t);if(S&&ie[S])return{cancelled:!1,profileId:S,lockedProfileId:S,partition:et(e,ie[S].partition,t,i)};const I=ri(e),C=c&&I.find(h=>h.profileId===c)||I.find(h=>h.profileId===me)||I[0]||null;if(C&&ie[C.profileId])return{cancelled:!1,profileId:C.profileId,lockedProfileId:C.profileId,partition:et(e,ie[C.profileId].partition,t,i)};if(!i?.bypassPrompt&&typeof jt=="function"){const h=await jt(e,c||"guest");if(!h||h.cancelled)return{cancelled:!0,profileId:null,lockedProfileId:null,partition:""};const y=ie[h.profileId]?h.profileId:"guest";return{cancelled:!1,profileId:y,lockedProfileId:y,partition:et(e,ie[y].partition,t,i)}}return c&&ie[c]?{cancelled:!1,profileId:c,lockedProfileId:c,partition:et(e,ie[c].partition,t,i)}:r?{cancelled:!1,profileId:null,lockedProfileId:null,partition:et(e,r,t,i)}:{cancelled:!1,profileId:null,lockedProfileId:null,partition:et(e,ge.guest,t,i)}}async function Lo(e,n,t,i){const r=Yn(e,n,t);if(e.lockedProfileId=r,!r){Ne===e.id&&vt(e);return}const c=ie[r].partition;if(me!==r&&mt(r,{bypassLock:!0}),e.partition!==c){e.partition=c,i&&!i.isDestroyed?.()&&i.remove();const w=await eo(e);Ne===e.id&&(vt(e),setTimeout(()=>{w.src=n},10));return}Ne===e.id&&vt(e)}function Kn(){return{wppproduction:[],vml:[],gsk:[],guest:[]}}function Jn(e={}){const n=Kn();return Object.keys(n).forEach(t=>{const i=Array.isArray(e?.[t])?e[t]:[];n[t]=i.map(r=>({url:String(r?.url||"").trim(),title:String(r?.title||"Untitled").trim()||"Untitled",visitedAt:r?.visitedAt?Number(r.visitedAt):0})).filter(r=>r.url&&r.url!=="about:blank").slice(0,200)}),n}function Xn(){!window.api||typeof window.api.setOneviewSharedStorage!="function"||window.api.setOneviewSharedStorage(qt,ke).catch(e=>{console.warn("Could not sync profile history to shared storage",e)})}function Qn(e=null){if(!e||typeof e!="object")return;ke=Jn(e.value||{});try{localStorage.setItem(zt,JSON.stringify(ke))}catch{}!document.getElementById("historyManagerModal")?.classList.contains("hidden")&&si()}async function Po(){if(!(!window.api||typeof window.api.getOneviewSharedStorage!="function"))try{const e=await window.api.getOneviewSharedStorage(qt);e?.success&&e.entry?Qn(e.entry):Xn()}catch(e){console.warn("Could not hydrate profile history from shared storage",e)}}function ko(){try{const e=JSON.parse(localStorage.getItem(zt)||"{}");ke=Jn(e)}catch{ke=Kn()}}function en(){localStorage.setItem(zt,JSON.stringify(ke)),Xn()}function Zn(e){return e&&(e.lockedProfileId||Jt(e.partition))||me}function ei(e){return e&&(Vn(e.partition)||e.lockedProfileId)||me}function Bo(e,n,t){if(!ke[e])return;const i=String(n||"").trim();if(!i||i==="about:blank"||i.startsWith("devtools://"))return;const r=String(t||"Untitled").trim()||"Untitled",c=ke[e]||[],w=c.findIndex(I=>I.url===i),S={url:i,title:r,visitedAt:Date.now()};w===0?c[0]=S:(w>0&&c.splice(w,1),c.unshift(S)),ke[e]=c.slice(0,200),en()}function ti(e){if(!e)return"Unknown Date";try{return new Date(e).toLocaleString()}catch{return""}}function Ao(){if(wt!==null)return wt;try{wt=window.api&&typeof window.api.getWebviewPreloadPath=="function"?window.api.getWebviewPreloadPath():""}catch{wt=""}return wt}function To(e,n={}){const t=String(n?.appType||"").trim().toLowerCase(),i=String(e||"").trim().toLowerCase();return typeof n?.requiresPlatformApi=="boolean"?n.requiresPlatformApi:t&&t!=="website"?!0:t==="website"&&Lt(i)}function $o(e){return e?.getAttribute("data-platform-api-enabled")==="1"}function _o(e,n){!e||typeof e.setAttribute!="function"||e.setAttribute("data-platform-api-enabled",n?"1":"0")}function Do(e=""){const n=String(e).trim();if(!n)return"APP";const t=n.split(/\s+/).filter(Boolean);return t.length===1?t[0].slice(0,3).toUpperCase():t.slice(0,3).map(i=>i[0]).join("").toUpperCase()}function Mo(e=""){const n=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)","linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)","linear-gradient(to right, #4facfe 0%, #00f2fe 100%)","linear-gradient(to top, #30cfd0 0%, #330867 100%)"],t=String(e);let i=0;for(let r=0;r<t.length;r+=1)i=(i+t.charCodeAt(r)*(r+1))%n.length;return n[i]}function Uo(e="app"){let n=document.getElementById("view-launch-loader");n?n.style.display="flex":(n=document.createElement("div"),n.id="view-launch-loader",n.style.cssText=["position:fixed","inset:0","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","background:rgba(15,23,42,0.45)","backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)"].join(";"),n.innerHTML=`
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
    `,document.body.appendChild(n));const t=n.querySelector("p");return t&&(t.textContent=`Opening ${e||"app"}...`),()=>{n&&(n.style.display="none")}}async function No(e){if(!e)return;const t=JSON.parse(localStorage.getItem(Ke.installedApps)||"{}")[e];if(!t){console.warn("Installed app not found:",e);return}const i=t.name||"App",r=Uo(i),c=Ei(t);console.log("[OneView Tracking] View launch decision",{appId:e,appName:t?.name||"",appType:t?.type||"",clickTrackingMode:t?.clickTrackingMode||"",trackOnLaunch:t?.trackOnLaunch,oneviewUrl:t?.oneviewUrl||"",hasLocalPath:!!t?.localPath,shouldTrackLaunch:c}),c&&xi({currentSelectedTicketId:window.currentActiveTicketKey||"",clickedAppName:i});try{if(dn(t)){await yi(t),We(`Opened "${i}" in a separate window.`,"info");return}const w=()=>Xe()?.partition||ie[me]?.partition||ge.guest,S=async(C,h={})=>{await Pe(C,w(),i,null,{hideControls:!0,appType:t.type,trackingAppId:e,trackingAppName:i,bypassPrompt:!0,...h})},I=String(t.type||"").toLowerCase();if(Yt.has(I)&&t.localPath){Ln(`Starting ${i}...`);let C=String(t.oneviewUrl||"").trim();if(window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const y=await window.api.resolveOneviewAppUrl(e,t.localPath,"/",w());if(y?.success&&y.url){C=y.url;const x=JSON.parse(localStorage.getItem(Ke.installedApps)||"{}");x[e]&&(x[e]={...x[e],oneviewUrl:C},localStorage.setItem(Ke.installedApps,JSON.stringify(x)))}}const h=["nextjs","next","vite-server"].includes(I);if(C&&Lt(C)&&h&&(C=""),C&&Lt(C))await S(C);else{const y=await window.api.launchNextApp(t.localPath,t.type);await S(y)}return}if(t.type==="website"&&t.url){await S(t.url);return}if(t.type==="exe"&&t.localPath){Ln(`Launching ${i}...`);const C=await window.api.launchExe(t.localPath,t.tech);if(C&&C.mode==="embedded"&&C.url){const h=new URLSearchParams;C.token&&h.set("NL_TOKEN",C.token),t.tech&&h.set("TECH",t.tech);const y=String(C.url).split(":")[2];y&&h.set("NL_PORT",y);const x=`${C.url}?${h.toString()}`;await S(x)}else C?.success&&C.mode==="external"?We(`Opened "${i}" in a separate window.`,"info"):alert(`${i} launched externally. Embedded view is not available for this app.`);return}alert(`Cannot launch "${i}". Missing supported launch configuration.`)}catch(w){if(dn(t)){console.error("Failed to launch external Electron app from view:",w),We(`Failed to launch "${i}".`,"error");return}console.error("Failed to launch installed app from view:",w),alert(`Failed to launch "${i}": ${w.message||w}`)}finally{r()}}async function ni(e,n=null,t="New Tab",i=!1,r={}){const c=String(e||"").trim();if(!c)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){const F=ge.gsk;window.enterSiteSnapStudioMode();const j=Pn(),Q=(j||[]).some(ue=>{const Y=String(ue.url||"").trim();return Y&&Y!=="about:blank"&&Y!=="newtab"});!j||j.length===0||i||Q?await Pe(c,F,t,null,r):await yt(c,F,t,null,r);return}let w=i;c.toLowerCase().startsWith("file://")&&(w=!0);const I=await Gn(c,n,t,r);if(!I||I.cancelled)return;const C=I.partition,h=I.profileId,y=I.lockedProfileId;h&&h!==_i()&&mt(h,{bypassLock:!0});const x=Pn();if(!x||x.length===0){await Pe(c,C,t,y,r);return}const A=x.some(F=>{const j=String(F.url||"").trim();return j&&j!=="about:blank"&&j!=="newtab"});if(w||A){await Pe(c,C,t,y,r);return}let N=Xe();if(!N){const F=x[x.length-1];F&&(await He(F.id),N=F)}if(!N){await Pe(c,C,t,y,r);return}await yt(c,C,t,y,r)}window.initViewPage=jn;window.createTab=Pe;window.launchInstalledAppFromView=No;window.openUrlFromDashboard=ni;function Oo(){const e=localStorage.getItem(Ke.currentProfileId);e&&ie[e]?me=e:me="guest",oi();const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");n&&t&&(n.addEventListener("click",async i=>{i.stopPropagation(),t.classList.contains("hidden")?await rt(()=>t.classList.remove("hidden")):Ge(()=>t.classList.add("hidden"))}),t.innerHTML=Object.values(ie).map(i=>`
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
      `),t.querySelectorAll(".profile-item").forEach(i=>{i.addEventListener("click",async()=>{if(i.dataset.action==="manage-passwords"){Vt("passwords"),Ge(()=>t.classList.add("hidden"));return}const r=i.dataset.id;i.classList.contains("disabled")||(ii(r),Ge(()=>t.classList.add("hidden")))})}),qn())}function ii(e){mt(e)}function oi(){const e=ie[me],n=document.getElementById("profileBtn"),t=document.getElementById("profileLabel");n&&t&&(t.textContent=e.label,t.style.color=e.color),vt()}function Ro(){const e=document.querySelector(".bookmarks-grid");e&&e.addEventListener("click",n=>{const t=n.target.closest(".bookmark-edit-btn");if(t){n.preventDefault(),n.stopPropagation();const x=t.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;x&&zo(x);return}const i=n.target.closest(".bookmark-delete-btn");if(i){n.preventDefault(),n.stopPropagation();const x=i.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;x&&($e=$e.filter(A=>A.id!==x),ai(),tn());return}const r=n.target.closest(".bookmark-card");if(!r||r.id==="addBookmarkBtn"||r.classList.contains("add-bookmark-card"))return;const c=r.dataset.url,w=r.dataset.title||"New Tab",S=String(r.dataset.partition||"").trim(),I=String(r.dataset.sessionScope||"").trim(),h=r.dataset.profileId||Qt(r.dataset.partition)||St(c||"",w)||me;if(h!==me&&ii(h),c){const y=et(c,S||ie[h].partition,w,I?{sessionScope:I}:{});yt(c,y,w,St(c||"",w))}})}function ft(e=""){const n=String(e).trim();return n?/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/^about:/i.test(n)?n:`https://${n}`:""}function Bt(e=""){const n=ft(e);if(!n)return"";try{const t=new URL(n),i=t.pathname.length>1?t.pathname.replace(/\/+$/,"")||"/":t.pathname||"/";return`${t.origin}${i}${t.search}${t.hash}`}catch{return n.replace(/\/+$/,"")}}function ri(e=""){const n=Bt(e);return n?$e.filter(t=>Bt(t.url)===n):[]}function Fo(e="",n=""){const t=ri(e);return n?t.find(i=>String(i.profileId||"").trim().toLowerCase()===n)||null:t[0]||null}function Ho(e=null){return e?String(e.lockedProfileId||"").trim().toLowerCase()||Qt(e.partition)||me||"guest":me||"guest"}function Wo(){try{const e=JSON.parse(localStorage.getItem(Nn)||"[]");$e=Array.isArray(e)?e.map(n=>({id:String(n?.id||""),title:String(n?.title||"").trim(),url:ft(n?.url||""),profileId:ie[n?.profileId]?n.profileId:"guest"})).filter(n=>n.id&&n.title&&n.url):[]}catch{$e=[]}}function ai(){localStorage.setItem(Nn,JSON.stringify($e))}function Vo({id:e="",title:n="",url:t="",profileId:i="guest"}){const r=ft(t),c=String(n||"").trim()||r,w=ie[i]?i:"guest",S=Bt(r);if(!r||!S)return!1;const I=$e.findIndex(h=>e&&h.id===e?!0:Bt(h.url)===S&&String(h.profileId||"guest")===w),C={id:I>=0?$e[I].id:e||`bm-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:c,url:r,profileId:w};return I>=0?$e[I]={...$e[I],...C}:$e.unshift(C),I>=0?"updated":"created"}function tn(){const e=document.querySelector(".bookmarks-grid");if(!e)return;e.querySelectorAll(".bookmark-card.custom-bookmark").forEach(i=>i.remove());const n=$e.map(i=>{const r=ie[i.profileId]||ie.guest;return`
        <div
          class="bookmark-card custom-bookmark"
          data-bookmark-id="${Ee(i.id)}"
          data-url="${Ee(i.url)}"
          data-title="${Ee(i.title)}"
          data-profile-id="${Ee(i.profileId)}"
        >
          <button class="bookmark-edit-btn" type="button" title="Edit Bookmark">E</button>
          <button class="bookmark-delete-btn" type="button" title="Remove Bookmark">X</button>
          <div class="bookmark-icon" style="background:${Mo(i.title)};">
            <span>${Ee(Do(i.title))}</span>
          </div>
          <div class="bookmark-info">
            <h3>${Ee(i.title)}</h3>
            <p>${Ee(r.name)} Profile</p>
          </div>
        </div>
      `}).join(""),t=document.getElementById("addBookmarkBtn");t?t.insertAdjacentHTML("beforebegin",n):e.insertAdjacentHTML("beforeend",n)}function jo(){const e=document.getElementById("addBookmarkBtn"),n=document.getElementById("bookmarkCurrentPageHeaderBtn"),t=document.getElementById("bookmarkModal"),i=document.getElementById("bookmarkModalCloseBtn"),r=document.getElementById("bookmarkForm"),c=document.getElementById("bookmarkTitleInput"),w=document.getElementById("bookmarkUrlInput"),S=t?.querySelector(".password-modal-header h3"),I=document.getElementById("bookmarkSaveBtn");if(!e||!t||!i||!r||!c||!w)return;const C=()=>{Ge(()=>{t.classList.add("hidden"),It=null})},h=async({editId:A=null,title:N="",url:F="",profileId:j=me,heading:Q="Add Bookmark",saveLabel:ue="Save Bookmark"}={})=>{It=A,st=ie[j]?j:me,Zt("bookmarkProfileSelect",st,Y=>{st=Y}),S&&(S.textContent=Q),I&&(I.textContent=ue),r.reset(),c.value=String(N||""),w.value=String(F||""),await rt(()=>t.classList.remove("hidden")),c.value?(c.focus(),c.select()):c.focus()},y=async()=>{await h()},x=async()=>{const A=Xe(),N=ft(A?.url||"");if(!A||A.isHome||!N||N==="about:blank"){We("Open a website tab first to save it as a bookmark.","error");return}const F=Ho(A),j=Fo(N,F);await h({editId:j?.id||null,title:A.title||j?.title||"New Bookmark",url:N,profileId:F,heading:j?"Update Bookmark":"Save Current Site",saveLabel:j?"Update Bookmark":"Save Bookmark"})};e.addEventListener("click",y),e.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await y())}),n?.addEventListener("click",x),n?.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await x())}),i.addEventListener("click",C),t.addEventListener("click",A=>{A.target===t&&C()}),r.addEventListener("submit",A=>{A.preventDefault();const N=String(c.value||"").trim(),F=ft(w.value);if(!N||!F)return;const j=Vo({id:It,title:N,url:F,profileId:st||me});j&&(ai(),tn(),C(),r.reset(),We(j==="updated"?"Bookmark updated successfully.":"Bookmark saved successfully.","success"))})}async function zo(e){const n=document.getElementById("bookmarkModal"),t=document.getElementById("bookmarkForm"),i=document.getElementById("bookmarkTitleInput"),r=document.getElementById("bookmarkUrlInput"),c=n?.querySelector(".password-modal-header h3"),w=document.getElementById("bookmarkSaveBtn");if(!n||!t||!i||!r)return;const S=$e.find(I=>I.id===e);S&&(It=S.id,st=S.profileId||me,c&&(c.textContent="Edit Bookmark"),w&&(w.textContent="Update Bookmark"),Zt("bookmarkProfileSelect",st,I=>{st=I}),i.value=S.title||"",r.value=S.url||"",await rt(()=>n.classList.remove("hidden")),i.focus())}function qo(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;const i=220;n.addEventListener("click",()=>{e.scrollBy({left:-i,behavior:"smooth"})}),t.addEventListener("click",()=>{e.scrollBy({left:i,behavior:"smooth"})}),e.addEventListener("scroll",At),At()}function si(){const e=document.getElementById("historyList"),n=document.getElementById("historyProfileSelect");if(!e||!n)return;const t=Ht||me,i=ke[t]||[];if(i.length===0){e.innerHTML="<div class='password-meta'>No history for this profile yet.</div>";return}const r=new Date,c=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),w=c-864e5,S={today:[],yesterday:[],older:[]};i.forEach((x,A)=>{const N={...x,originalIndex:A},F=x.visitedAt||0;F>=c?S.today.push(N):F>=w?S.yesterday.push(N):S.older.push(N)});const I=x=>x.toLocaleDateString(void 0,{month:"short",day:"numeric"}),C=`Today - ${I(r)}`,h=`Yesterday - ${I(new Date(w))}`,y=(x,A,N=!1)=>{if(A.length===0)return"";const F=A.map(j=>`
      <div class="history-item" data-index="${j.originalIndex}">
        <div class="history-main">
          <div class="history-title">${Ee(j.title||"Untitled")}</div>
          <div class="history-url">${Ee(j.url||"")}</div>
          <div class="password-meta">${Ee(ti(j.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `).join("");return`
      <details class="history-group" ${N?"open":""}>
        <summary class="history-group-title">
          <span>${x}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${A.length}</span>
        </summary>
        <div class="history-group-content">
          ${F}
        </div>
      </details>
    `};e.innerHTML=`
    ${y(C,S.today,S.today.length>0)}
    ${y(h,S.yesterday,!1)}
    ${y("Older",S.older,!1)}
  `,e.querySelectorAll(".history-item").forEach(x=>{x.addEventListener("click",A=>{const N=A.target.closest("button");if(!N)return;const F=Number(x.dataset.index);if(Number.isNaN(F))return;const j=ke[t]||[],Q=j[F];if(Q){if(N.dataset.action==="delete"){j.splice(F,1),ke[t]=j,en(),si();return}if(N.dataset.action==="open"){const ue=ie[t]?.partition||ge.guest;Pe(Q.url,ue,Q.title||"History",t)}}})})}async function ot({title:e="Clear Page Cache",message:n="",confirmLabel:t="OK",cancelLabel:i="Cancel",hideCancel:r=!1}={}){const c=document.getElementById("cacheActionModal"),w=document.getElementById("cacheActionTitle"),S=document.getElementById("cacheActionMessage"),I=document.getElementById("cacheActionCloseBtn"),C=document.getElementById("cacheActionCancelBtn"),h=document.getElementById("cacheActionConfirmBtn");return!c||!w||!S||!I||!C||!h?Promise.resolve(window.confirm(n||e)):(w.textContent=e,S.textContent=n,h.textContent=t,C.textContent=i,C.style.display=r?"none":"inline-flex",await rt(()=>c.classList.remove("hidden")),new Promise(y=>{const x=()=>{I.removeEventListener("click",A),C.removeEventListener("click",A),h.removeEventListener("click",N),c.removeEventListener("click",F),Ge(()=>c.classList.add("hidden"))},A=()=>{x(),y(!1)},N=()=>{x(),y(!0)},F=j=>{j.target===c&&A()};I.addEventListener("click",A),C.addEventListener("click",A),h.addEventListener("click",N),c.addEventListener("click",F)}))}function At(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;if(!(e.scrollWidth>e.clientWidth+1)){n.classList.add("hidden"),t.classList.add("hidden"),e.scrollLeft=0;return}const r=e.scrollLeft<=1,c=e.scrollLeft+e.clientWidth>=e.scrollWidth-1;n.classList.toggle("hidden",r),t.classList.toggle("hidden",c)}async function Yo(e,n){const t=le.findIndex(r=>r.id===n),i=le[t];if(e==="duplicate-tab"&&i){to(n);return}if(e==="inspect-local-file"&&i){const r=document.getElementById(`webview-${i.id}`),c=r&&typeof r.getWebContentsId=="function"?r.getWebContentsId():0;if(!c||!window.api?.toggleWebviewDevTools){We(bt?"Inspect is not available for this tab.":"Inspect is not available for this local file tab.","error");return}await window.api.toggleWebviewDevTools(c)||We(bt?"Could not open developer tools.":"Could not open developer tools for this local file.","error");return}if(e==="clear-cache"&&i){const r=document.getElementById(`webview-${i.id}`),c=r&&typeof r.getURL=="function"&&r.getURL()||i.url||"",w=r&&r.getAttribute("partition")||i.partition||ge.guest;if(!c||c==="about:blank"||!await ot({title:"Clear Page Cache",message:`Clear cache and site data for ${c}?`,confirmLabel:"Clear Cache",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewPageCache!="function"){await ot({title:"Action Unavailable",message:"Cache clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const I=await window.api.clearWebviewPageCache(w,c);I?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await ot({title:"Could Not Clear Cache",message:I?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(I){const C=String(I?.message||I||""),h=/No handler registered for 'clear-webview-page-cache'/.test(C)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await ot({title:"Could Not Clear Cache",message:`${C}${h}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-user-data"&&i){const r=document.getElementById(`webview-${i.id}`),c=r&&typeof r.getURL=="function"&&r.getURL()||i.url||"",w=r&&r.getAttribute("partition")||i.partition||ge.guest;if(!c||c==="about:blank"||!await ot({title:"Clear User Data",message:`Clear local storage and site data for ${c}?`,confirmLabel:"Clear Data",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewUserData!="function"){await ot({title:"Action Unavailable",message:"User-data clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const I=await window.api.clearWebviewUserData(w,c);I?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await ot({title:"Could Not Clear User Data",message:I?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(I){const C=String(I?.message||I||""),h=/No handler registered for 'clear-webview-user-data'/.test(C)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await ot({title:"Could Not Clear User Data",message:`${C}${h}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-all"){ht(le.map(r=>r.id));return}if(e==="clear-right"&&t>=0){ht(le.slice(t+1).map(r=>r.id));return}e==="clear-left"&&t>=0&&ht(le.slice(0,t).map(r=>r.id))}function Go(){const e=document.querySelector(".tabs-header");e&&e.addEventListener("contextmenu",async n=>{if(n.target.closest(".profile-section"))return;n.preventDefault();const r=n.target.closest(".tab")?.id?.replace("tab-ui-","")||Ne||le[0]?.id||null;if(!r)return;Un=r;const c=le.findIndex(x=>x.id===r),w=le[c],S=document.getElementById(`webview-${r}`),I=io(w,S),C=!!(w&&!w.isHome&&(S&&S.getURL()!=="about:blank"||w.url)),h=c>0?c:0,y=c>=0&&c<le.length-1?le.length-c-1:0;window.api&&typeof window.api.showNativeTabContextMenu=="function"&&await window.api.showNativeTabContextMenu({anchorId:r,x:Math.round(n.x),y:Math.round(n.y),disabled:{clearLeft:h===0,clearRight:y===0,clearCache:!C,clearUserData:!C,inspectLocalFile:!I}})})}function Rt(e){if(!e)return"";const n=String(e.getData("text/uri-list")||"").split(/\r?\n/).map(c=>c.trim()).find(c=>c&&!c.startsWith("#"));if(n&&/^https?:\/\//i.test(n))return n;const i=String(e.getData("text/html")||"").match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);if(i&&/^https?:\/\//i.test(String(i[1]||"").trim()))return String(i[1]||"").trim();const r=String(e.getData("text/plain")||"").trim();return/^https?:\/\//i.test(r)?r:r&&!/\s/.test(r)&&/\./.test(r)?ft(r):""}function Ko(){const e=document.querySelector(".tabs-header");if(!e||e.dataset.dropBound==="1")return;e.dataset.dropBound="1";const n=t=>{e.classList.toggle("is-drop-target",!!t)};e.addEventListener("dragenter",t=>{Rt(t.dataTransfer)&&(t.preventDefault(),n(!0))}),e.addEventListener("dragover",t=>{Rt(t.dataTransfer)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),n(!0))}),e.addEventListener("dragleave",t=>{e.contains(t.relatedTarget)||n(!1)}),e.addEventListener("drop",t=>{const i=Rt(t.dataTransfer);if(n(!1),!i)return;t.preventDefault();const c=t.target.closest(".tab")?.id?.replace("tab-ui-","")||Ne,w=le.findIndex(S=>S.id===c);Pe(i,null,"New Tab",null,{insertIndex:w>=0?w+1:le.length})})}function Jo(e){const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");!n||!t||!n.contains(e.target)&&!t.contains(e.target)&&!t.classList.contains("hidden")&&Ge(()=>t.classList.add("hidden"))}async function Xo(e){const n=String(e?.action||"");if(!n||n==="__menu_closed__")return;const t=String(e?.anchorId||Un||Ne||le[0]?.id||"");t&&await Yo(n,t)}const $n={desktop:{width:1920,height:1080,userAgent:"desktop"},mobile:{width:414,height:896,userAgent:"mobile"},tablet:{width:768,height:1024,userAgent:"tablet"}};async function li(e,n="mobile"){if(!e)throw new Error("No active webview");const t=$n[n]||$n.mobile;if(console.log(`[Viewport] Setting ${n} viewport: ${t.width}x${t.height}`),window.api?.setWebviewBounds){const i=e.getWebContentsId?.()||e._webContent?.id;i&&(console.log(`[Viewport] Triggering native resize to ${t.width}x${t.height} for id: ${i}`),await window.api.setWebviewBounds(i,{width:t.width,height:t.height}))}return window.__oneview_original_webview_dims||(window.__oneview_original_webview_dims={width:e.style.width,height:e.style.height,minWidth:e.style.minWidth,minHeight:e.style.minHeight,maxWidth:e.style.maxWidth,maxHeight:e.style.maxHeight,flex:e.style.flex}),e.style.width=t.width+"px",e.style.height=t.height+"px",e.style.minWidth=t.width+"px",e.style.minHeight=t.height+"px",e.style.maxWidth=t.width+"px",e.style.maxHeight=t.height+"px",e.style.flex="none",console.log(`[Viewport] Resized webview element to ${t.width}x${t.height}`),await e.executeJavaScript(`
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
    `,!0),await new Promise(i=>setTimeout(i,300)),t}async function Qo(e){if(e&&window.api?.setWebviewBounds){const n=document.getElementById("webviews-container"),t=e.getWebContentsId?.()||e._webContent?.id;if(n&&t){const i=n.getBoundingClientRect();await window.api.setWebviewBounds(t,{width:Math.round(i.width),height:Math.round(i.height)})}}}async function ci(e){if(console.log("[Viewport] Resetting to original viewport"),window.__oneview_original_webview_dims&&e){const n=window.__oneview_original_webview_dims;e.style.width=n.width,e.style.height=n.height,e.style.minWidth=n.minWidth,e.style.minHeight=n.minHeight,e.style.maxWidth=n.maxWidth,e.style.maxHeight=n.maxHeight,e.style.flex=n.flex,window.__oneview_original_webview_dims=null,await Qo(e),console.log("[Viewport] Webview element dimensions and native bounds restored")}await e.executeJavaScript(`
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
    `,!0),await new Promise(n=>setTimeout(n,500))}async function Zo(e={}){const n=Je();if(!n||typeof n.executeJavaScript!="function")throw new Error("Active tab is unavailable");if(typeof n.capturePage!="function")throw new Error("Active tab does not support capture");const t=String(e?.viewport||"desktop").trim().toLowerCase();if(console.log("[Capture] Active webview found",{id:n.id,url:n.getURL?.(),title:n.getTitle?.(),viewport:t,loading:n._webContent?.state?.loading}),t==="mobile"||t==="tablet"){const Y=t==="tablet"?"tablet":"mobile";await li(n,Y),console.log("[Capture] Viewport changed to "+Y+", waiting for page reflow..."),await new Promise(ae=>setTimeout(ae,300))}const i=5e3,r=Date.now();for(;n._webContent?.state?.loading&&Date.now()-r<i;)console.log("[Capture] Waiting for page to load..."),await new Promise(Y=>setTimeout(Y,200));console.log("[Capture] Page load status:",n._webContent?.state?.loading?"still loading":"loaded");const c=String(e?.mode||"visible").trim().toLowerCase();if(c!=="full"&&c!=="fullpage"){const Y=await n.capturePage(),ae=Y?.isEmpty?.()?"":Y.toDataURL();return console.log("[CapturePage] Visible captured. DataUrl length:",ae?.length||0),{mode:"visible",dataUrl:ae,width:Y?.getSize?.()?.width||0,height:Y?.getSize?.()?.height||0}}const w=await n.executeJavaScript(`
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
    `,!0);Math.max(1,Number(w?.totalWidth||0));let S=Math.max(1,Number(w?.totalHeight||0));Math.max(1,Number(w?.viewportWidth||0));let I=Math.max(1,Number(w?.viewportHeight||0));if(console.log("[FullCapture] Starting capture process..."),console.log("[FullCapture] Initial metrics:",w),await n.executeJavaScript(`
    (() => {
      const style = document.createElement('style');
      style.id = '__oneview_force_auto_scroll__';
      style.textContent = 'html, body, * { scroll-behavior: auto !important; }';
      (document.head || document.documentElement).appendChild(style);
    })();
  `,!0).catch(()=>{}),S>I+100){console.log("[FullCapture] Verifying scroll functionality...");const ae=await n.executeJavaScript(`
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
    `,!0).catch(()=>null);console.log("[FullCapture] Verification scroll results:",ae);const ve=Number(ae?.startY||0),xe=Number(ae?.endY||0);if(xe-ve<10)throw new Error("Scroll verification failed: page did not scroll (startY="+ve+", endY="+xe+"). Capture aborted to prevent repeating/empty fallback images.");await n.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `,!0).catch(()=>{})}const C=Math.floor(I*.8),h=Math.ceil(S/C);console.log("[FullCapture] Progressive scroll: "+h+" steps, "+C+"px per step");let y=0;for(let Y=0;Y<h;Y++){y=Math.min(y+C,S),console.log(`[FullCapture] Scrolling host-driven to ${y}px (${Y+1}/${h})`);const ae=`
      (() => {
        const targetY = ${y};
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
    `;await n.executeJavaScript(ae,!0).catch(()=>{}),await new Promise(ve=>setTimeout(ve,600))}await n.executeJavaScript(`window.scrollTo({ top: ${S}, left: 0, behavior: 'auto' });`,!0).catch(()=>{}),await new Promise(Y=>setTimeout(Y,800)),await n.executeJavaScript(`
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
  `,!0).catch(()=>{}),console.log("[FullCapture] Scrolling back to top...");const x=`
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
  `;await n.executeJavaScript(x,!0).catch(()=>{});let A=0,N=!1;for(;!N&&A<50;)await n.executeJavaScript("(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)",!0).catch(()=>0)<=5?N=!0:(await n.executeJavaScript(x,!0).catch(()=>{}),await new Promise(ae=>setTimeout(ae,100)),A++);await n.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");const F=Number(e?.wait||0)*1e3,j=200+F;console.log(`[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${j}ms (Base 0.2s + User ${F}ms) for page to settle live...`),await new Promise(Y=>setTimeout(Y,j));let Q="",ue=null;try{console.log("[FullCapture] Calling native one-shot capture..."),ue=await n.capturePage({mode:"full",scrollHeight:Math.round(S)}),Q=ue?.isEmpty?.()?"":ue.toDataURL()}finally{console.log("[FullCapture] Restoring original body and globals..."),await n.executeJavaScript(`
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
        window.scrollTo(${Math.round(Number(w?.scrollX||0))}, ${Math.round(Number(w?.scrollY||0))});
      `,!0).catch(()=>{})}if(!Q)throw new Error("Full page capture returned empty image data");return{mode:"full",dataUrl:Q,width:ue?.getSize?.()?.width||0,height:ue?.getSize?.()?.height||0,tileCount:1}}async function er(e){const n=String(e?.command||"").trim(),t=String(e?.url||"").trim(),i=String(e?.requestId||"").trim();if(!n)return;if(n==="execute-script"){const h=String(e?.source||"");let y={requestId:i,success:!1,message:"No active tab"};try{const x=Je();if(!x||typeof x.executeJavaScript!="function")y={requestId:i,success:!1,message:"Active tab is unavailable"};else{const A=`
          (() => {
            const run = () => {
              ${h}
            };
            return run();
          })();
        `,N=await x.executeJavaScript(A,!0);y={requestId:i,success:!0,result:N}}}catch(x){y={requestId:i,success:!1,message:x?.message||String(x)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(y);return}if(n==="ui-prompt"){let h={requestId:i,success:!1,message:"Prompt request failed"};try{const y=await Eo(e?.prompt||{});h={requestId:i,success:!0,result:y}}catch(y){h={requestId:i,success:!1,message:y?.message||String(y)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(h);return}if(n==="capture-page"){let h={requestId:i,success:!1,message:"Capture request failed",key:e?.key||"view:extension-popup"};try{const y=String(e?.options?.mode||"visible").trim().toLowerCase(),x=String(e?.options?.viewport||"desktop").trim().toLowerCase(),A=Number(e?.options?.wait||0);if(console.log("[View] Capturing mode:",y,"viewport:",x,"wait:",A),y==="full"||y==="fullpage"){console.log("[View] Using full-page capture function");const N=await Zo({mode:y,viewport:x,wait:A});h={requestId:i,success:!0,result:N,key:e?.key||"view:extension-popup"}}else{const N=Je();if(!N||typeof N.capturePage!="function")throw new Error("Active tab does not support capture");if(console.log("[View] Capturing visible area from webview id:",N.id),x==="mobile"||x==="tablet"){const ue=x==="tablet"?"tablet":"mobile";await li(N,ue),console.log("[View] Viewport changed to "+ue+", waiting for page reflow..."),await new Promise(Y=>setTimeout(Y,800))}const F=await N.capturePage(),j=F?.isEmpty?.()?"":F.toDataURL?.();console.log("[View] Visible capture dataUrl length:",j?.length||0);const Q={mode:"visible",dataUrl:j,width:F?.getSize?.()?.width||0,height:F?.getSize?.()?.height||0};(x==="mobile"||x==="tablet")&&await ci(N),h={requestId:i,success:!0,result:Q,key:e?.key||"view:extension-popup"}}}catch(y){console.error("[View] Capture error:",y),h={requestId:i,success:!1,message:y?.message||String(y),key:e?.key||"view:extension-popup"}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(h);return}if(n==="tabs-create"){const h=String(e.url||"").trim(),y=e.requestId;let x=e.partition||null;if(!x&&h.startsWith(`${Ci}://`))try{x=`ext-${new URL(h).host}`}catch{}const A=x?pt(x):"",N=le.find(F=>F.url&&F.url.includes("result.html")&&(!A||pt(F.partition||"")===A));N?(console.log("[View] Reusing existing result tab:",N.id),await oo(N.id,h,x,"Result"),e.active!==!1&&await He(N.id)):await Pe(h,x,"Result",null,{active:e.active!==!1,extensionEntryPath:e.entryPath}),y&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:y,success:!0});return}if(n==="tabs-close"){let h={requestId:i,success:!1,message:"Tab not found"};try{const y=String(e?.tabId||"").trim();le.find(A=>A.id===y)?(Kt(y),h={requestId:i,success:!0,result:{id:y,closed:!0}}):h={requestId:i,success:!1,message:"Tab not found"}}catch(y){h={requestId:i,success:!1,message:y?.message||String(y)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(h);return}if(!t)return;const r=Xe(),c=Je(),w=r?.partition||ie[me]?.partition||ge.guest,S=/^file:\/\//i.test(t),I={extensionEntryPath:S?String(e?.entryPath||"").trim():"",extensionActiveContext:{url:String(c?.getURL?.()||r?.url||"").trim(),title:String(c?.getTitle?.()||r?.title||"").trim()},active:e?.active!==!1};if(S){const h=le.find(y=>y.url===t);if(h){await He(h.id),i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:h.id,url:t,title:h.title||"New Tab",active:!0}});return}}if(n==="tabs-update"&&r&&!r.isHome&&!r.nativePage){await yt(t,w,"New Tab",null,I),i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:r.id,url:t,title:r.title||"New Tab",active:!0}});return}r?.id;const C=Pe(t,w,"New Tab",null,I);i&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:i,success:!0,result:{id:C?.id||"",url:t,title:C?.title||"New Tab",active:e?.active!==!1}})}function tr(){xn||(xn=!0,document.addEventListener("click",Jo),document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const n=String(e.key||"").toLowerCase();if(!(!(e.key==="Tab"||e.key==="PageUp"||e.key==="PageDown")&&po(e.target))){if(n==="h"&&!e.shiftKey){e.preventDefault(),Vt("history");return}if(n==="d"&&e.shiftKey){e.preventDefault(),Vt("downloads");return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation(),Ct(e.shiftKey?-1:1);return}if(e.key==="PageUp"){e.preventDefault(),e.stopPropagation(),Ct(-1);return}e.key==="PageDown"&&(e.preventDefault(),e.stopPropagation(),Ct(1))}},!0),window.addEventListener("resize",At),Ko(),window.api&&typeof window.api.onViewTabShortcut=="function"&&window.api.onViewTabShortcut(e=>{const n=Number(e?.direction||0);n&&Ct(n<0?-1:1)}),window.api&&typeof window.api.onBrowserExtensionsUpdated=="function"&&window.api.onBrowserExtensionsUpdated(()=>{console.log("Browser extensions updated, refreshing UI..."),Hn().catch(()=>{})}),window.api&&typeof window.api.onNativeTabContextAction=="function"&&window.api.onNativeTabContextAction(e=>{Xo(e).catch(()=>{})}),window.api&&typeof window.api.onBrowserExtensionCommand=="function"&&window.api.onBrowserExtensionCommand(e=>{er(e).catch(n=>{console.error("Browser extension command failed",n)})}))}let Ft,_n;const Dn=new ResizeObserver(()=>{const e=Je();!e||typeof e.syncBounds!="function"||(e.syncBounds(!0),clearInterval(Ft),clearTimeout(_n),Ft=setInterval(()=>{const n=Je();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},50),_n=setTimeout(()=>{clearInterval(Ft);const n=Je();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},350))});(function(){const n=document.getElementById("webviews-container");if(n){Dn.observe(n);return}const t=new MutationObserver(()=>{const i=document.getElementById("webviews-container");i&&(t.disconnect(),Dn.observe(i))});t.observe(document.documentElement,{childList:!0,subtree:!0})})();window.enterSiteSnapStudioMode=function(){document.body.classList.add("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.add("sitesnap-studio-mode");try{window.parent.document.body.classList.add("sitesnap-studio-active")}catch(n){console.error("Failed to set parent active layout",n)}};window.exitSiteSnapStudioMode=function(){document.body.classList.remove("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.remove("sitesnap-studio-mode");try{window.parent.document.body.classList.remove("sitesnap-studio-active")}catch(n){console.error("Failed to remove parent active layout",n)}};
