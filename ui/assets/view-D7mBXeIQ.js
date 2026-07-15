import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{o as at,c as Qe,e as Ie}from"./utils-xPDMCTXC.js";import{s as ze}from"./notifications-CBkElf_0.js";import{i as dn,l as Si}from"./external-exe-DRsy67iY.js";import{c as un,i as Ei,s as xi,t as Ci}from"./webcontent-client-DJU5VCvB.js";import{n as ft,R as Mn,i as It,c as Ii,I as Lt}from"./app-env-Dw5Rxq_p.js";import{S as Ze,P as be}from"./app-runtime-CuOCpSBc.js";function Li({state:e,constants:n,escapeHtml:t,showToast:o,isPerfEnabled:r,formatDownloadBytes:u,formatDownloadSpeed:h,formatDownloadEta:x,formatHistoryTime:k,loadManagedDownloadsFromMain:P,refreshExtensionsManagerList:b,saveProfileHistoryStore:C,getActiveTab:L,updateTabTitle:A,createTab:U,switchTab:H,navigateTo:z}){const{PROFILES:Z,PARTITIONS:de,IS_DEV_APP_BUILD:Y}=n;function re(f=""){const $=String(f||"").trim().toLowerCase();return["downloads","history","extensions","passwords"].includes($)?$:"extensions"}function ye(f="extensions"){const $=re(f);return $==="downloads"?"Downloads":$==="history"?"History":$==="passwords"?"Passwords":"Extensions"}function Le(f="extensions"){const $=re(f);return $==="downloads"?"Ctrl+Shift+D":$==="history"?"Ctrl+H":$==="extensions"?"Ctrl+E":""}function nt(f){const $=f instanceof Element?f:null;return $?$.closest("input, textarea, select")?!0:$.isContentEditable===!0:!1}function Me(f="settings",$="extensions"){return{type:String(f||"settings").trim().toLowerCase(),section:re($)}}function ne(f="extensions"){const $=re(f);return e.tabs.find(E=>E?.nativePage?.type==="settings"&&re(E?.nativePage?.section)===$)||null}function ue(f){return f?.nativePage?.type==="settings"}async function qe(){if(!window.api)return e.nativeSettingsGeneralInfo;try{if(!e.nativeSettingsGeneralInfo.version&&window.api.getAppVersion&&(e.nativeSettingsGeneralInfo.version=await window.api.getAppVersion()),!e.nativeSettingsGeneralInfo.defaultOpenStatus&&window.api.getDefaultOpenHandlingStatus){const f=await window.api.getDefaultOpenHandlingStatus();e.nativeSettingsGeneralInfo.defaultOpenStatus=f?.isDefault||f?.success?"Configured":"Needs setup"}}catch{}return e.nativeSettingsGeneralInfo}function Pe(){return Object.entries(e.profileHistoryCache||{}).flatMap(([f,$])=>(Array.isArray($)?$:[]).map(E=>({profileId:f,profileName:Z[f]?.name||f||"Unknown",url:String(E?.url||"").trim(),title:String(E?.title||"Untitled").trim()||"Untitled",visitedAt:E?.visitedAt?Number(E.visitedAt):0}))).filter(f=>f.url&&f.visitedAt).sort((f,$)=>Number($.visitedAt||0)-Number(f.visitedAt||0))}function xe(f){const $=new Date(Number(f||0));if(Number.isNaN($.getTime()))return"Unknown Date";const E=new Date,B=new Date(E.getFullYear(),E.getMonth(),E.getDate()).getTime(),D=new Date($.getFullYear(),$.getMonth(),$.getDate()).getTime(),G=B-1440*60*1e3;return D===B?"Today":D===G?"Yesterday":$.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function ke(f=[]){const $=[],E=new Map;return f.forEach(B=>{const D=xe(B.visitedAt);if(!E.has(D)){const G={key:`${D}-${B.visitedAt}`,label:D,entries:[]};E.set(D,G),$.push(G)}E.get(D).entries.push(B)}),$}function Ye(){return e.managedDownloadsCache.length?`
      <section class="native-settings-section">
        <div class="native-settings-list">
        ${e.managedDownloadsCache.map(f=>{const $=f.totalBytes?Math.max(0,Math.min(100,Math.round(f.receivedBytes/f.totalBytes*100))):f.state==="completed"?100:0,E=f.totalBytes?`${u(f.receivedBytes)} / ${u(f.totalBytes)}`:u(f.receivedBytes),B=f.state==="progressing"?`${h(f.bytesPerSecond)} - ${x(f.etaSeconds)}`:f.state==="completed"?`Saved to ${t(f.savePath||"")}`:t(String(f.state||"Unknown"));return`
              <article class="native-settings-row native-settings-download-row">
                <div class="native-settings-row-main">
                  <div>
                    <div class="native-settings-row-title">${t(f.fileName||"Download")}</div>
                    <div class="native-settings-row-note">${t(E)}</div>
                    <div class="native-settings-row-note">${B}</div>
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
                <div class="native-settings-progress"><span style="width:${$}%"></span></div>
              </article>
            `}).join("")}
        </div>
      </section>
    `:'<div class="native-settings-empty">No downloads yet.</div>'}function Fe(){const f=e.historySearchQuery.trim().toLowerCase(),$=Pe().filter(B=>f?`${B.title||""} ${B.url||""} ${B.profileName||""}`.toLowerCase().includes(f):!0);return $.length?`
      <div class="native-history-flat-list">
        ${ke($).map(B=>`
              <div class="native-history-date-group">
                <div class="native-history-date-divider">
                  <span class="native-history-date-label">${t(B.label)}</span>
                </div>
                ${B.entries.map(D=>`
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
    `:`<div class="native-settings-empty">${f?"No history matches your search.":"No history yet."}</div>`}function Ue(){return e.browserExtensionsCache.length?`
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
    `:'<div class="native-settings-empty">No extensions installed yet.</div>'}function He(){const f=e.credentialCache||{},$=[];return Object.entries(f).forEach(([B,D])=>{(D||[]).forEach((G,te)=>{$.push({key:`${B}:${te}`,profileId:B,domain:String(G.domain||"").toLowerCase(),username:String(G.username||""),password:String(G.password||"")})})}),`
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
            <div class="profile-pill-select" id="nativePasswordProfileSelect">${Object.entries(Z).map(([B,D])=>`
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
                  <div class="password-secret">${t(B.password)}</div>
                  <div class="password-actions">
                    <button type="button" class="password-action-btn" data-action="edit">Edit</button>
                    <button type="button" class="password-action-btn" data-action="delete">Delete</button>
                  </div>
                </div>
              `).join("")}
            </div>`}
      </section>
    `}async function Ge(){if(window.api?.listProfileCredentials)try{const f=await window.api.listProfileCredentials();if(f&&Array.isArray(f.data)){const $={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};f.data.forEach(E=>{const B=String(E.profileId||"").toLowerCase();$[B]||($[B]=[]),$[B].push(E)}),e.credentialCache=$}}catch(f){console.error("loadCredentialsIntoCache error:",f)}}function he(f){const $=document.getElementById("nativeTabContent");if(!$||!ue(f))return;const E=re(f.nativePage?.section);let B="",D="";const G=ye(E);let te="Manage app behavior without leaving the browser shell.";if(E==="downloads"){const J=e.managedDownloadsCache.length,ae=e.managedDownloadsCache.filter(O=>O.state==="progressing").length;B=Ye(),te=`${ae} active, ${J} total downloads.`}else if(E==="history"){const J=Pe(),ae=e.historySearchQuery.trim()?J.filter(O=>`${O.title||""} ${O.url||""} ${O.profileName||""}`.toLowerCase().includes(e.historySearchQuery.trim().toLowerCase())).length:J.length;D=`
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
      `,B=Fe(),te=`${ae} total history entries across all profiles.`}else if(E==="extensions"){const J=e.browserExtensionsCache.filter(ae=>ae.enabled!==!1).length;D=`
        <div class="native-settings-toolbar">
          ${Y?'<button class="native-settings-action" type="button" data-native-settings-action="load-unpacked-extension">Load unpacked extension</button>':""}
        </div>
      `,B=Ue(),te=`${J} enabled out of ${e.browserExtensionsCache.length} extensions.`}else E==="passwords"?(B=He(),te="Manage saved passwords securely.",e._credentialsLoaded||(e._credentialsLoaded=!0,Ge().then(()=>{he(f)}))):e._credentialsLoaded=!1;$.innerHTML=`
      <div class="native-settings-shell">
        <section class="native-settings-panel">
          <div class="native-settings-sticky">
            <div class="native-settings-header">
              <div class="native-settings-title-block">
                <h2>${t(G)}</h2>
                <p>${t(te)}</p>
              </div>
            </div>
            <div class="native-settings-chips" role="tablist" aria-label="Settings sections">
              ${["extensions","history","downloads","passwords"].map(J=>{const ae=Le(J);return`
                    <button
                      type="button"
                      class="native-settings-chip ${J===E?"is-active":""}"
                      data-native-settings-nav="${J}"
                      title="${t(ye(J))}${ae?` (${ae})`:""}"
                    >
                      <span>${t(ye(J))}</span>
                      ${ae?`<span class="native-settings-chip-shortcut">${t(ae)}</span>`:""}
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
    `}async function Ee(){const f=L();ue(f)&&he(f)}function Ne(f="extensions",$=e.activeTabId){const E=e.tabs.find(D=>D.id===$);if(!ue(E))return;const B=re(f);E.nativePage.section=B,A(E.id,ye(B)),E.id===e.activeTabId&&he(E)}function Te(f="extensions"){const $=ne(f);if($){H($.id);return}U(null,null,ye(f),null,{nativePage:Me("settings",f)})}function Ke(){const f=document.getElementById("settingsBtn");f&&f.dataset.boundClick!=="1"&&(f.dataset.boundClick="1",f.addEventListener("click",()=>{Te("extensions")}))}function ot(){const f=document.getElementById("nativeTabContent");if(!f||f.dataset.boundNativeSettings==="1")return;f.dataset.boundNativeSettings="1",window.addEventListener("credentials-updated",()=>{e._credentialsLoaded=!1;const E=L();ue(E)&&E.nativePage?.section==="passwords"&&Ge().then(()=>{he(E)})});const $=(E=null,B=null)=>{requestAnimationFrame(()=>{const D=document.getElementById("nativeHistorySearchInput");if(D&&(D.focus({preventScroll:!0}),Number.isInteger(E)&&Number.isInteger(B)&&typeof D.setSelectionRange=="function"))try{D.setSelectionRange(E,B)}catch{}})};f.addEventListener("click",async E=>{const B=E.target.closest(".password-visibility-toggle");if(B){E.preventDefault();const O=document.getElementById("nativePasswordSecretInput");if(O){const d=O.type==="password";O.type=d?"text":"password",B.textContent=d?"🙈":"👁️"}return}const D=E.target.closest("[data-native-settings-nav]");if(D){Ne(D.dataset.nativeSettingsNav||"extensions");return}const G=E.target.closest("[data-native-settings-action]");if(G){const O=String(G.dataset.nativeSettingsAction||"").trim();try{O==="check-updates"&&window.api?.checkForUpdates?(await window.api.checkForUpdates(),o("Update check started.","success")):O==="open-default-apps"&&window.api?.openDefaultAppSettings?await window.api.openDefaultAppSettings():O==="load-unpacked-extension"&&window.api?.addBrowserExtensionsUnpacked?(await window.api.addBrowserExtensionsUnpacked(),await b(),await Ee(),o("Unpacked extensions loaded.","success")):O==="clear-history"&&(Object.keys(e.profileHistoryCache||{}).forEach(d=>{e.profileHistoryCache[d]=[]}),C(),he(L()))}catch(d){o(d?.message||"Could not complete settings action.","error")}return}const te=E.target.closest("[data-native-download-action]");if(te){try{const O=await window.api?.runManagedDownloadAction?.({id:String(te.dataset.downloadId||"").trim(),action:String(te.dataset.nativeDownloadAction||"").trim()});Array.isArray(O?.downloads)?e.managedDownloadsCache=O.downloads:await P(),await Ee()}catch(O){o(O?.message||"Could not complete download action.","error")}return}const J=E.target.closest("[data-native-history-action]");if(J){const O=String(J.dataset.profileId||e.historyProfileId||e.currentProfileId),d=String(J.dataset.historyTime||""),m=(e.profileHistoryCache[O]||[]).findIndex(y=>String(y.visitedAt||"")===d),I=m>=0?(e.profileHistoryCache[O]||[])[m]:null;if(!I)return;if(J.dataset.nativeHistoryAction==="delete")e.profileHistoryCache[O].splice(m,1),C(),e.historyProfileId=O,he(L());else{const y=Z[O]?.partition||de.guest;U(I.url,y,I.title||"History",O)}return}const ae=E.target.closest("[data-native-extension-action]");if(ae){const O=String(ae.dataset.nativeExtensionAction||"").trim(),d=String(ae.dataset.extensionPath||"").trim();try{O==="more"&&window.api?.getExtensionShortcutsInfo?await ve(d):O==="reload"&&window.api?.reloadBrowserExtension?(await window.api.reloadBrowserExtension({path:d}),o("Extension reloaded.","success")):(O==="enable"||O==="disable")&&window.api?.toggleBrowserExtension?(O==="disable"&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.toggleBrowserExtension({path:d,enabled:O==="enable"})):O==="remove"&&window.api?.removeBrowserExtension&&(typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup(),await window.api.removeBrowserExtension({path:d})),await b(),await Ee()}catch(m){o(m?.message||"Could not complete extension action.","error")}}}),f.addEventListener("input",E=>{const B=E.target.closest("#nativeHistorySearchInput");if(B){const G=Number.isInteger(B.selectionStart)?B.selectionStart:null,te=Number.isInteger(B.selectionEnd)?B.selectionEnd:G;e.historySearchQuery=String(B.value||""),he(L()),$(G,te);return}const D=E.target.closest("input[name='nativePasswordProfile']");if(D){e.passwordProfileId=String(D.value||"");return}}),f.addEventListener("submit",async E=>{const B=E.target.closest("#nativePasswordForm");if(!B)return;E.preventDefault();const D=document.getElementById("nativePasswordDomainInput"),G=document.getElementById("nativePasswordUsernameInput"),te=document.getElementById("nativePasswordSecretInput");if(!D||!G||!te)return;const J=String(D.value||"").trim().toLowerCase(),ae=String(G.value||"").trim(),O=String(te.value||""),d=e.passwordProfileId||e.currentProfileId||"guest";if(!J||!ae||!O){o("Please fill in all fields.","error");return}try{if(!window.api?.saveProfileCredential){o("Credential API unavailable.","error");return}const m=await window.api.saveProfileCredential({profileId:d,domain:J,username:ae,password:O});if(!m||!m.success){o("Failed to save credential.","error");return}await Ge(),o("Credential saved successfully.","success"),B.reset(),he(L())}catch(m){o(m?.message||"Could not save credential.","error")}}),f.addEventListener("click",async E=>{const B=E.target.closest(".password-action-btn");if(!B)return;const D=String(B.dataset.action||"").trim(),G=B.closest(".password-item"),te=String(G?.dataset.key||""),[J,ae]=te.split(":"),O=Number(ae);if(!J||Number.isNaN(O))return;const m=((e.credentialCache||{})[J]||[])[O];if(m)try{if(D==="delete"){if(!window.api?.deleteProfileCredential){o("Credential API unavailable.","error");return}const I=await window.api.deleteProfileCredential({profileId:J,domain:String(m.domain||"").toLowerCase(),username:String(m.username||"")});if(!I||!I.success){o("Failed to delete credential.","error");return}await Ge(),o("Credential deleted successfully.","success"),he(L())}else if(D==="edit"){const I=document.getElementById("nativePasswordDomainInput"),y=document.getElementById("nativePasswordUsernameInput"),R=document.getElementById("nativePasswordSecretInput"),F=document.getElementById("nativePasswordProfileSelect");if(!I||!y||!R)return;e.passwordProfileId=J,I.value=String(m.domain||"").toLowerCase(),y.value=String(m.username||""),R.value=String(m.password||""),F&&(F.innerHTML=Object.entries(Z||{}).map(([s,p])=>`
                <label class="profile-pill-item ${s===J?"active":""}" style="cursor: pointer;">
                  <input type="radio" name="passwordProfile" value="${t(s)}" ${s===J?"checked":""} style="cursor: pointer;" />
                  <span class="profile-pill-dot" style="background-color: ${t(p.color||"#000")}"></span>
                  <span>${t(p.name||"")}</span>
                </label>
              `).join(""),F.addEventListener("change",s=>{const p=s.target.value;p&&(e.passwordProfileId=p)})),document.getElementById("nativePasswordForm")?.scrollIntoView({behavior:"smooth"}),I.focus()}}catch(I){o(I?.message||"Could not complete password action.","error")}})}function it(){document.addEventListener("keydown",f=>{nt(f.target)||f.ctrlKey&&((f.key==="H"||f.key==="h")&&!f.shiftKey?(f.preventDefault(),Te("history")):(f.key==="E"||f.key==="e")&&!f.shiftKey?(f.preventDefault(),Te("extensions")):(f.key==="D"||f.key==="d")&&f.shiftKey&&(f.preventDefault(),Te("downloads")))})}async function ve(f=""){const $=document.getElementById("extensionDetailsModal"),E=document.getElementById("extensionDetailsCloseBtn"),B=document.getElementById("extensionDetailsContent"),D=document.getElementById("extensionDetailsTitle");if(!(!$||!B))try{const G=await window.api?.getExtensionShortcutsInfo?.({path:f});if(!G?.success)B.innerHTML='<div class="extension-details-empty">Unable to load extension details.</div>';else{const{name:te,shortcuts:J,errors:ae,conflicts:O}=G;D.textContent=`${t(te||"Extension")} Details`;let d="";J&&J.length>0?d=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-shortcuts-list">
                ${J.map(y=>`
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
          `:d=`
            <div class="extension-details-section">
              <h4>Keyboard Shortcuts</h4>
              <div class="extension-details-empty">No keyboard shortcuts defined.</div>
            </div>
          `;let m="";ae&&ae.length>0&&(m=`
            <div class="extension-details-section">
              <h4>Issues</h4>
              <div class="extension-errors-list">
                ${ae.map(y=>`
                      <div class="extension-error-item">
                        <div class="extension-error-type">${t(y.type)}</div>
                        <div class="extension-error-message">${t(y.message)}</div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `);let I="";O&&O.length>0&&(I=`
            <div class="extension-details-section">
              <h4>Shortcut Conflicts</h4>
              <div class="extension-conflicts-list">
                ${O.map(y=>`
                      <div class="extension-conflict-item">
                        <div class="extension-conflict-key">${t(y.key)}</div>
                        <div class="extension-conflict-extensions">
                          <strong>Conflicting with:</strong><br/>
                          ${y.conflictingExtensions.map(R=>`${t(R.name)}`).join("<br/>")}
                        </div>
                      </div>
                    `).join("")}
              </div>
            </div>
          `),B.innerHTML=`${d}${m}${I}`}$.classList.remove("hidden"),E&&(E.onclick=()=>{$.classList.add("hidden")})}catch(G){console.error("Failed to load extension details:",G),B.innerHTML='<div class="extension-details-empty">Error loading extension details.</div>',$.classList.remove("hidden")}}return{bindSettingsShortcutsGlobal:it,createNativePageDescriptor:Me,ensureNativeSettingsGeneralInfo:qe,getSettingsTabTitle:ye,getSettingsShortcut:Le,initNativeSettingsUi:ot,initSettingsMenu:Ke,isEditableShortcutTarget:nt,isNativeSettingsTab:ue,normalizeSettingsSection:re,openSettingsTab:Te,refreshActiveNativeSettingsPage:Ee,renderNativeSettingsPage:he,updateNativeSettingsTabSection:Ne}}function Pi({state:e,constants:n,escapeHtml:t,showToast:o,openOverlayModal:r,closeOverlayModal:u,getActiveTab:h,getActiveWebview:x,createTab:k,refreshActiveNativeSettingsPage:P,closeSettingsMenu:b}){const{PROFILES:C,PENDING_EXTENSION_OPEN_STORAGE_KEY:L,EXTENSION_PIN_STORAGE_KEY:A}=n;let U=!1,H=null,z=null,Z={visible:!1,id:"",message:"",actionLabel:"",action:""},de={},Y={entryPath:""},re=!1;async function ye(){if(!window.api?.listBrowserExtensions)return e.browserExtensionsCache=[],e.browserExtensionsCache;const s=await window.api.listBrowserExtensions(),p=Array.isArray(s?.entries)?s.entries:[];return e.browserExtensionsCache=p.map(w=>{const c=(w.id||"guest").toLowerCase(),S=n.APP_PROTOCOL_SCHEME||"oneview-dev",N=String(w.path||"").trim().replace(/\\/g,"/").replace(/\/+$/,""),j=`file:///${N}`,K=fe=>{if(!fe||!fe.toLowerCase().startsWith("file://"))return fe;const ie=fe.replace(/\\/g,"/"),ge=decodeURI(ie);let we=ge.replace(j,"").replace(/^\/+/,"");if(we===ge){const pe=`/${N.split("/").pop()}/`,ee=ge.indexOf(pe);ee!==-1?we=ge.slice(ee+pe.length):we=""}const X=w.manifest?.entrypoints?.root||w.manifest?.entrypoints?.page||"index.html";return`${S}://${c}/${we||X}`};return{...w,rootUrl:K(w.rootUrl),optionsUrl:K(w.optionsUrl),popupUrl:K(w.popupUrl),sidePanelUrl:K(w.sidePanelUrl)}}),e.browserExtensionsCache}async function Le(){let s="";try{s=String(sessionStorage.getItem(L)||"").trim()}catch{s=""}if(!s)return;try{sessionStorage.removeItem(L)}catch{}const p=e.browserExtensionsCache.find(w=>w.path===s);p&&await E(p.path,"tab")}function nt(){try{const s=JSON.parse(localStorage.getItem(A)||"{}");de=s&&typeof s=="object"&&!Array.isArray(s)?s:{}}catch{de={}}}function Me(){try{localStorage.setItem(A,JSON.stringify(de||{}))}catch{}}function ne(){return h()?.partition||C[e.currentProfileId]?.partition||C.guest.partition}function ue(){const s=h(),p=x();return{url:String(p?.getURL?.()||s?.url||"").trim(),title:String(p?.getTitle?.()||s?.title||"").trim()}}function qe(s={}){return String(s?.name||s?.actionTitle||"EX").trim().split(/\s+/).slice(0,2).map(w=>w.charAt(0)).join("").toUpperCase()}function Pe(s={}){return String(s?.actionTitle||s?.name||"Extension").trim()}function xe(s={},p=""){const w=String(s?.path||"").trim(),c=String(p||"").trim().replace(/\\/g,"/");if(!w||!c)return"";const S=w.replace(/\\/g,"/").replace(/\/+$/,""),N=c.replace(/^\/+/,""),j=`${S}/${N}`;return`file:///${encodeURI(j.replace(/^([A-Za-z]):/,"$1:"))}`}function ke(s={}){return de[String(s?.path||"").trim()]===!0}function Ye(s={}){const p=(s?.id||"guest").toLowerCase(),w=s?.manifest?.entrypoints?.root||s?.manifest?.entrypoints?.page||"index.html";return`${n.APP_PROTOCOL_SCHEME}://${p}/${w}`}function Fe(s={},p=""){const w=String(s?.actionIconFileUrl||xe(s,s?.actionIconPath||"")||s?.actionIconUrl||"").trim(),c=t(qe(s));return w?`<img src="${t(w)}" alt="" />`:`<span class="${p}">${c}</span>`}function Ue(s=0){const p=Number(s||0);return p>=1024*1024*1024?`${(p/(1024*1024*1024)).toFixed(1)} GB`:p>=1024*1024?`${(p/(1024*1024)).toFixed(1)} MB`:p>=1024?`${(p/1024).toFixed(1)} KB`:`${Math.max(0,Math.round(p))} B`}function He(s=0){const p=Number(s||0);return p<=0?"":`${Ue(p)}/s`}function Ge(s=null){const p=Number(s);if(!Number.isFinite(p)||p<0)return"";if(p<60)return`${Math.round(p)}s left`;const w=Math.floor(p/60),c=Math.round(p%60);return`${w}m ${c}s left`}function he(s=""){return e.managedDownloadsCache.find(p=>p.id===s)||null}function Ee(){const s=document.getElementById("downloadsManagerBtn");s&&(s.classList.remove("has-download-highlight"),s.offsetWidth,s.classList.add("has-download-highlight"),H&&clearTimeout(H),H=setTimeout(()=>{s.classList.remove("has-download-highlight")},2300))}async function Ne(){if(!window.api?.listManagedDownloads)return e.managedDownloadsCache=[],e.managedDownloadsCache;const s=await window.api.listManagedDownloads();return e.managedDownloadsCache=Array.isArray(s?.downloads)?s.downloads:[],e.managedDownloadsCache}function Te(){const s=document.getElementById("downloadsManagerPanel"),p=document.getElementById("downloadsManagerBtn");s&&!s.classList.contains("hidden")&&(U?u(()=>s.classList.add("hidden")):s.classList.add("hidden")),U=!1,p&&p.classList.remove("is-active")}function Ke(){const s=document.getElementById("downloadsManagerPanel"),p=document.getElementById("downloadsManagerBadge");if(!s)return;const w=e.managedDownloadsCache.filter(c=>c.state==="progressing"||c.state==="interrupted").length;p&&(w>0?(p.textContent=String(w),p.classList.remove("hidden")):(p.textContent="",p.classList.add("hidden"))),s.innerHTML=`
      <div class="downloads-manager-header">
        <strong>Downloads</strong>
        <button type="button" class="downloads-manager-link" data-download-action="clear-completed">
          Clear Completed
        </button>
      </div>
      <div class="downloads-manager-list">
        ${e.managedDownloadsCache.length?e.managedDownloadsCache.map(c=>{const S=t(c.fileName||"Download"),N=String(c.state||"progressing"),j=typeof c.progress=="number"?Math.max(0,Math.min(100,c.progress)):0,K=c.totalBytes>0?`${Ue(c.receivedBytes)} / ${Ue(c.totalBytes)}`:Ue(c.receivedBytes),fe=He(c.bytesPerSecond),ie=Ge(c.etaSeconds),ge=N==="completed"?"Completed":N==="cancelled"?"Cancelled":N==="interrupted"?"Interrupted":c.paused?"Paused":`Downloading ${j}%`,we=[fe,ie].filter(Boolean).join(" • ");return`
                    <div class="downloads-manager-item">
                      <strong>${S}</strong>
                      <div class="downloads-manager-meta">${t(ge)} • ${t(K)}</div>
                      ${we?`<div class="downloads-manager-meta">${t(we)}</div>`:""}
                      <div class="downloads-manager-progress">
                        <span style="width:${j}%"></span>
                      </div>
                      <div class="downloads-manager-actions">
                        ${N==="progressing"?c.paused?`<button type="button" data-download-id="${t(c.id)}" data-download-action="resume">Resume</button>`:`<button type="button" data-download-id="${t(c.id)}" data-download-action="pause">Pause</button>`:""}
                        ${N==="progressing"||N==="interrupted"?`<button type="button" data-download-id="${t(c.id)}" data-download-action="cancel">Cancel</button>`:""}
                        ${N==="interrupted"||N==="cancelled"?`<button type="button" data-download-id="${t(c.id)}" data-download-action="retry">Retry</button>`:""}
                        ${c.savePath?`<button type="button" data-download-id="${t(c.id)}" data-download-action="show">Show in Folder</button>`:""}
                        ${N==="completed"&&c.existsOnDisk?`<button type="button" data-download-id="${t(c.id)}" data-download-action="open">Open</button>`:""}
                         <button type="button" data-download-id="${t(c.id)}" data-download-action="remove">Delete</button>
                      </div>
                    </div>
                  `}).join(""):'<div class="downloads-manager-empty">No downloads yet.</div>'}
      </div>
    `}async function ot(s=null){const p=document.getElementById("downloadsManagerPanel"),w=document.getElementById("downloadsManagerBtn");if(!p||!w)return;if(!(s===null?p.classList.contains("hidden"):!!s)){Te();return}f(),Ke();try{await r(()=>p.classList.remove("hidden"),{captureSnapshots:!1}),U=!0}catch{p.classList.remove("hidden"),U=!1}w.classList.add("is-active")}function it(){let s=document.getElementById("downloadsShelf");s||(s=document.createElement("div"),s.id="downloadsShelf",s.className="downloads-shelf hidden",s.innerHTML=`
        <div class="downloads-shelf-body">
          <strong id="downloadsShelfTitle">Download</strong>
          <span id="downloadsShelfMessage"></span>
        </div>
        <div class="downloads-shelf-actions">
          <button id="downloadsShelfAction" type="button"></button>
          <button id="downloadsShelfClose" type="button">Dismiss</button>
        </div>
      `,document.body.appendChild(s),s.querySelector("#downloadsShelfClose")?.addEventListener("click",()=>{Z.visible=!1,it()}),s.querySelector("#downloadsShelfAction")?.addEventListener("click",async()=>{const S=he(Z.id);!S||!Z.action||!window.api?.runManagedDownloadAction||await window.api.runManagedDownloadAction({id:S.id,action:Z.action})}));const p=s.querySelector("#downloadsShelfTitle"),w=s.querySelector("#downloadsShelfMessage"),c=s.querySelector("#downloadsShelfAction");if(!Z.visible){s.classList.add("hidden");return}p&&(p.textContent="Downloads"),w&&(w.textContent=Z.message||""),c&&(c.textContent=Z.actionLabel||"Open",c.style.display=Z.action?"":"none"),s.classList.remove("hidden")}function ve(s={},p="updated"){const w=String(s.fileName||"Download").trim()||"Download";if(p==="created")Z={visible:!0,id:String(s.id||""),message:`${w} started downloading`,actionLabel:"Show",action:"show"};else if(p==="completed")Z={visible:!0,id:String(s.id||""),message:`${w} downloaded`,actionLabel:"Open",action:"open"};else if(p==="interrupted")Z={visible:!0,id:String(s.id||""),message:`${w} was interrupted`,actionLabel:"Retry",action:"retry"};else return;it(),z&&clearTimeout(z),z=setTimeout(()=>{Z.visible=!1,it()},5e3)}function f(){const s=document.getElementById("browserExtensionsMenu"),p=document.getElementById("browserExtensionsMenuBtn");s&&!s.classList.contains("hidden")&&(re?u(()=>s.classList.add("hidden")):s.classList.add("hidden")),re=!1,p&&p.classList.remove("is-active")}async function $(s=null){const p=document.getElementById("browserExtensionsMenu"),w=document.getElementById("browserExtensionsMenuBtn");if(!p||!w)return;if(!(s===null?p.classList.contains("hidden"):!!s)){f();return}B().catch(()=>{}),ae();try{await r(()=>p.classList.remove("hidden"),{captureSnapshots:!1}),re=!0}catch(S){console.error("Failed to open extensions menu overlay",S),p.classList.remove("hidden"),re=!1}w.classList.add("is-active")}async function E(s,p="tab"){const w=e.browserExtensionsCache.find(j=>j.path===s);if(!w)return;const c=(w?.id||"guest").toLowerCase();let S="";if(p==="options"&&w.optionsUrl){const j=w.manifest?.entrypoints?.options||"options.html";S=`${n.APP_PROTOCOL_SCHEME}://${c}/${j}`}else if(p==="root"&&w.rootUrl){const j=w.manifest?.entrypoints?.root||"result.html";S=`${n.APP_PROTOCOL_SCHEME}://${c}/${j}`}else S=Ye(w);if(!S){o("This extension does not expose an openable page yet.","info");return}const N=`ext-${w.id||"guest"}`;k(S,N,`${w.name||"Extension"}${p==="options"?" Options":""}`,null,{extensionEntryPath:w.path,extensionActiveContext:ue()})}async function B(){if(window.api?.closeBrowserExtensionPopup)try{await window.api.closeBrowserExtensionPopup()}catch{}Y={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(s=>s.classList.remove("is-active"))}function D(s={}){const p=document.getElementById("browserExtensionPopupTitle"),w=document.getElementById("browserExtensionPopupSubtitle"),c=document.getElementById("browserExtensionPopupIcon");p&&(p.textContent=Pe(s)),w&&(w.textContent=s?.popupUrl?"Popup":s?.optionsUrl?"Extension page":s?.rootUrl?"Extension":""),c&&(c.innerHTML=Fe(s,"browser-extension-popup-fallback"))}function G(s){if(!s||typeof s.getBoundingClientRect!="function")return{left:0,top:0,bottom:0,width:0,height:0};const p=s.getBoundingClientRect();return{left:Number(p.left||0),top:Number(p.top||0),bottom:Number(p.bottom||0),width:Number(p.width||0),height:Number(p.height||0)}}async function te(s,p=null){const w=e.browserExtensionsCache.find(ie=>ie.path===s);if(!w)return;const c=String(w.popupUrl||"").trim()||String(w.optionsUrl||"").trim();if(!c){await E(s,"tab");return}if(Y.entryPath===s){await B();return}await B(),f();const S=window.api?.openBrowserExtensionPopup;if(typeof S!="function")throw new Error("Extension popup API is unavailable");const N=ue(),j=`ext-${w.id||"guest"}`,K=await S({url:c,entryPath:s,partition:j,anchor:G(p),activeUrl:N.url||"",activeTitle:N.title||""});if(!K?.success)throw new Error(K?.message||"Could not open extension popup");D(w),Y={entryPath:s,pageType:"popup",host:null,overlayActive:!1};const fe=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(s):s.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${fe}"]`).forEach(ie=>ie.classList.add("is-active"))}function J(){const s=document.getElementById("browserExtensionsPinned");if(!s)return;const p=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(S=>{const N=S.id==="sitesnap-studio"||String(S.name||"").toLowerCase().includes("sitesnap")||String(S.id||"").toLowerCase().includes("sitesnap");return p?S.enabled!==!1&&N:S.enabled!==!1&&!N}),c=p?w:w.filter(S=>ke(S));if(!c.length){s.innerHTML="",s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=c.map(S=>`
          <button
            type="button"
            class="browser-extension-action-btn"
            data-path="${t(S.path||"")}"
            title="${t(Pe(S))}"
            aria-label="${t(Pe(S))}"
          >
            ${Fe(S,"browser-extension-action-fallback")}
          </button>
        `).join("")}function ae(){const s=document.getElementById("browserExtensionsMenu");if(!s)return;const p=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(c=>{const S=c.id==="sitesnap-studio"||String(c.name||"").toLowerCase().includes("sitesnap")||String(c.id||"").toLowerCase().includes("sitesnap");return p?c.enabled!==!1&&S:c.enabled!==!1&&!S});s.innerHTML=`
      <div class="browser-extensions-menu-header">
        <strong>Extensions</strong>
        <button type="button" class="browser-extensions-menu-link" data-menu-action="manage">
          Manage
        </button>
      </div>
      <div class="browser-extensions-menu-list">
        ${w.length?w.map(c=>{const S=t(c.path||""),N=t(Pe(c)),j=t(c.version?`v${c.version}${c.id?` • ${c.id}`:""}`:c.id||c.name||"");return`
                    <div class="browser-extension-menu-item">
                      <div class="browser-extension-menu-row">
                        <div class="browser-extension-menu-icon">
                          ${Fe(c,"browser-extension-menu-fallback")}
                        </div>
                        <div class="browser-extension-menu-body">
                          <strong>${N}</strong>
                          <p>${j}</p>
                        </div>
                        <button
                          type="button"
                          class="browser-extension-menu-pin"
                          data-menu-action="pin"
                          data-path="${S}"
                          title="${ke(c)?"Unpin":"Pin"}"
                          aria-label="${ke(c)?"Unpin":"Pin"}"
                        >
                          ${ke(c)?"Unpin":"Pin"}
                        </button>
                      </div>
                      <div class="browser-extension-menu-actions">
                        <button type="button" data-menu-action="popup" data-path="${S}">
                          ${c.popupUrl?"Open Popup":"Open"}
                        </button>
                        ${c.optionsUrl?`<button type="button" data-menu-action="options" data-path="${S}">Options</button>`:""}
                        ${c.rootUrl?`<button type="button" data-menu-action="tab" data-path="${S}">Open in Tab</button>`:""}
                      </div>
                    </div>
                  `}).join(""):'<div class="browser-extensions-empty">No enabled extensions yet.</div>'}
      </div>
    `}function O(){J(),ae()}function d(){const s=document.getElementById("extensionsManagerList");if(!s)return;const p=window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode,w=e.browserExtensionsCache.filter(c=>{const S=c.id==="sitesnap-studio"||String(c.name||"").toLowerCase().includes("sitesnap")||String(c.id||"").toLowerCase().includes("sitesnap");return p?S:!S});if(!w.length){s.innerHTML=`
        <div class="extensions-empty-state">
          No unpacked extensions added yet.
        </div>
      `;return}s.innerHTML=w.map(c=>{const S=t(c.path||"");return`
          <div class="extension-item ${c.enabled===!1?"is-disabled":""}">
            <div class="extension-main">
              <div class="extension-title-row">
                <h4>${t(c.name||"Unnamed Extension")}</h4>
                <span class="extension-badge ${c.customBridge?"custom":"normal"}">
                  ${c.customBridge?"OneView":"Legacy"}
                </span>
                ${c.enabled===!1?'<span class="extension-status-pill">Disabled</span>':""}
              </div>
              <div class="extension-meta-row">
                ${c.version?`<span>v${t(c.version)}</span>`:""}
                ${c.id?`<span>${t(c.id)}</span>`:""}
              </div>
              ${n.IS_DEV_APP_BUILD?`<div class="extension-path">${S}</div>`:""}
              ${c.loadError?`<div class="extension-error">${t(c.loadError)}</div>`:""}
            </div>
            <div class="extension-actions">
              ${c.popupUrl?`<button type="button" class="extension-action-btn" data-action="open-popup" data-path="${S}">Popup</button>`:""}
              ${c.rootUrl||c.linkUrl?`<button type="button" class="extension-action-btn" data-action="open-tab" data-path="${S}">Open Tab</button>`:""}
              ${c.optionsUrl?`<button type="button" class="extension-action-btn" data-action="open-options" data-path="${S}">Options</button>`:""}
              <button type="button" class="extension-action-btn" data-action="reload" data-path="${S}">
                Reload
              </button>
              <button type="button" class="extension-action-btn" data-action="toggle" data-path="${S}">
                ${c.enabled===!1?"Enable":"Disable"}
              </button>
              ${n.IS_DEV_APP_BUILD?`<button type="button" class="extension-action-btn destructive" data-action="remove" data-path="${S}">Remove</button>`:""}
            </div>
          </div>
        `}).join("")}async function m(){try{await ye()}catch(s){console.error("Failed to refresh browser extensions list",s)}d(),O()}async function I(s,p){const w=e.browserExtensionsCache.find(S=>S.path===s);if(!w)return;const c=p==="options"?w.optionsUrl:p==="root"?w.rootUrl:Ye(w);if(!c){o(`This extension does not expose a ${p} page.`,"info");return}k(c,ne(),`${w.name||"Extension"} ${p==="options"?"Options":"Popup"}`,null,{extensionEntryPath:w.path,extensionActiveContext:ue()})}async function y(){const s=document.getElementById("extensionsManagerModal");if(s){f(),await B(),d(),O();try{await r(()=>s.classList.remove("hidden"))}catch(p){console.error("openOverlayModal failed for extensions manager",p),s.classList.remove("hidden")}m().catch(p=>{console.error("Failed to refresh extensions manager after open",p)})}}function R(){const s=document.getElementById("extensionsManagerModal");s&&u(()=>s.classList.add("hidden"))}function F(){const s=document.getElementById("extensionsBtn"),p=document.getElementById("settingsBtn"),w=document.getElementById("extensionsModalCloseBtn"),c=document.getElementById("extensionsLoadBtn"),S=document.getElementById("extensionsManagerList"),N=document.getElementById("browserExtensionsPinned"),j=document.getElementById("browserExtensionsMenuBtn"),K=document.getElementById("browserExtensionsMenu"),fe=document.getElementById("downloadsManagerBtn"),ie=document.getElementById("downloadsManagerPanel"),ge=document.getElementById("browserExtensionPopupClose"),we=document.getElementById("browserExtensionPopupOpenTab");nt(),d(),O(),m().catch(X=>{console.error("Failed to refresh extensions manager after open",X)}),ye().then(()=>{if(Le(),window.api?.prewarmBrowserExtensionPopup){const oe=e.browserExtensionsCache.filter(ee=>ee.enabled!==!1).filter(ee=>ke(ee));let pe={partition:ne()};if(oe.length>0){const ee=oe[0],ce=String(ee.popupUrl||"").trim()||String(ee.optionsUrl||"").trim();ce&&(pe={...pe,url:ce,entryPath:ee.path})}window.api.prewarmBrowserExtensionPopup(pe).catch(()=>{})}}).catch(()=>{}),window.api?.onBrowserExtensionPopupState&&window.api.onBrowserExtensionPopupState(X=>{const{entryPath:oe,open:pe}=X||{};if(pe){Y={entryPath:oe,pageType:"popup",host:null,overlayActive:!1};const ee=typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(oe):oe.replace(/["\\]/g,"\\$&");document.querySelectorAll(`.browser-extension-action-btn[data-path="${ee}"]`).forEach(ce=>ce.classList.add("is-active"))}else Y.entryPath===oe&&(Y={entryPath:"",pageType:"popup",host:null,overlayActive:!1},document.querySelectorAll(".browser-extension-action-btn").forEach(ee=>ee.classList.remove("is-active")))}),s&&s.dataset.boundClick!=="1"&&(s.dataset.boundClick="1",s.addEventListener("click",()=>{y().catch(X=>{console.error("Failed to open extensions manager",X),o("Could not open extensions manager.","error")})})),w&&w.dataset.boundClick!=="1"&&(w.dataset.boundClick="1",w.addEventListener("click",R)),c&&c.dataset.boundClick!=="1"&&(c.dataset.boundClick="1",c.addEventListener("click",async()=>{try{if(!window.api?.addBrowserExtensionsUnpacked){o("Extension manager API is unavailable.","error");return}const X=await window.api.addBrowserExtensionsUnpacked();e.browserExtensionsCache=Array.isArray(X?.entries)?X.entries:[],d(),O(),o("Unpacked extensions loaded.","success")}catch(X){console.error("Failed to load unpacked extensions",X),o(X?.message||"Could not load unpacked extensions.","error")}})),S&&S.dataset.boundClick!=="1"&&(S.dataset.boundClick="1",S.addEventListener("click",async X=>{const oe=X.target.closest("[data-action]");if(!oe)return;const pe=String(oe.dataset.action||"").trim(),ee=String(oe.dataset.path||"").trim();if(ee)try{if(pe==="open-popup"){await I(ee,"popup");return}if(pe==="open-tab"){await I(ee,"tab");return}if(pe==="open-options"){await I(ee,"options");return}if(pe==="reload"&&window.api?.reloadBrowserExtension){const ce=await window.api.reloadBrowserExtension({path:ee});e.browserExtensionsCache=Array.isArray(ce?.entries)?ce.entries:e.browserExtensionsCache,d(),O(),o("Extension reloaded.","success");return}if(pe==="toggle"&&window.api?.toggleBrowserExtension){const ce=e.browserExtensionsCache.find(Je=>Je.path===ee);ce?.enabled!==!1&&typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const Ce=await window.api.toggleBrowserExtension({path:ee,enabled:ce?.enabled===!1});e.browserExtensionsCache=Array.isArray(Ce?.entries)?Ce.entries:e.browserExtensionsCache,d(),O(),o("Extension state updated.","success");return}if(pe==="remove"&&window.api?.removeBrowserExtension){typeof window.api?.closeBrowserExtensionPopup=="function"&&await window.api.closeBrowserExtensionPopup();const ce=await window.api.removeBrowserExtension({path:ee});e.browserExtensionsCache=Array.isArray(ce?.entries)?ce.entries:e.browserExtensionsCache,d(),O(),o("Extension removed.","success")}}catch(ce){console.error("Extension manager action failed",ce),o(ce?.message||"Could not complete extension action.","error")}})),N&&N.dataset.boundClick!=="1"&&(N.dataset.boundClick="1",N.addEventListener("click",async X=>{const oe=X.target.closest("[data-path]");if(!oe)return;const pe=String(oe.dataset.path||"").trim();if(pe)try{await te(pe,oe)}catch(ee){console.error("Failed to open extension popup",ee),o(ee?.message||"Could not open extension popup.","error")}})),j&&j.dataset.boundClick!=="1"&&(j.dataset.boundClick="1",j.addEventListener("click",()=>{$().catch(X=>{console.error("Failed to toggle extensions menu",X),o("Could not open extensions menu.","error")})})),K&&K.dataset.boundClick!=="1"&&(K.dataset.boundClick="1",K.addEventListener("click",async X=>{const oe=X.target.closest("[data-menu-action]");if(!oe)return;const pe=String(oe.dataset.menuAction||"").trim(),ee=String(oe.dataset.path||"").trim();try{if(pe==="manage"){f(),await y();return}if(!ee)return;if(pe==="pin"){const ce=!de[ee];de[ee]=ce,Me(),O();return}if(pe==="popup"){await te(ee,j||oe);return}if(pe==="options"){f(),await E(ee,"options");return}pe==="tab"&&(f(),await E(ee,"tab"))}catch(ce){console.error("Extension menu action failed",ce),o(ce?.message||"Could not complete extension action.","error")}})),ge&&ge.dataset.boundClick!=="1"&&(ge.dataset.boundClick="1",ge.addEventListener("click",()=>{B().catch(()=>{})})),we&&we.dataset.boundClick!=="1"&&(we.dataset.boundClick="1",we.addEventListener("click",async()=>{Y.entryPath&&(await E(Y.entryPath,"tab"),await B())})),document.body&&document.body.dataset.boundExtensionUiDismiss!=="1"&&(document.body.dataset.boundExtensionUiDismiss="1",document.addEventListener("click",X=>{const oe=X.target;p&&!p.contains(oe)&&b(),K&&!K.classList.contains("hidden")&&!K.contains(oe)&&!j?.contains(oe)&&!s?.contains(oe)&&f(),ie&&!ie.classList.contains("hidden")&&!ie.contains(oe)&&!fe?.contains(oe)&&Te(),!oe.closest(".browser-extension-action-btn")&&!K?.contains(oe)&&B().catch(()=>{})}),document.addEventListener("keydown",X=>{X.key==="Escape"&&(b(),f(),Te(),B().catch(()=>{}))}))}function V(){const s=document.getElementById("downloadsManagerBtn"),p=document.getElementById("downloadsManagerPanel");s&&s.dataset.boundClick!=="1"&&(s.dataset.boundClick="1",s.addEventListener("click",()=>{ot().catch(()=>{})})),p&&p.dataset.boundClick!=="1"&&(p.dataset.boundClick="1",p.addEventListener("click",async w=>{const c=w.target.closest("[data-download-action]");if(!c)return;const S=String(c.dataset.downloadAction||"").trim(),N=String(c.dataset.downloadId||"").trim();if(S)try{if(!window.api?.runManagedDownloadAction)return;const j=await window.api.runManagedDownloadAction({id:N,action:S});Array.isArray(j?.downloads)?e.managedDownloadsCache=j.downloads:(S==="remove"||S==="clear-completed")&&await Ne(),Ke()}catch(j){o(j?.message||"Could not complete download action.","error")}})),Ne().then(()=>{Ke()}).catch(()=>{}),window.api&&typeof window.api.onDownloadManagerUpdated=="function"&&document.body?.dataset.boundDownloadManagerEvents!=="1"&&(document.body.dataset.boundDownloadManagerEvents="1",window.api.onDownloadManagerUpdated(w=>{e.managedDownloadsCache=Array.isArray(w?.downloads)?w.downloads:[],Ke(),P().catch(()=>{}),(w?.reason==="created"||w?.reason==="completed"||w?.reason==="interrupted")&&Ee();const c=he(String(w?.focusId||"").trim());c&&ve(c,String(w?.reason||"updated"))}))}return{closeBrowserExtensionPopup:B,closeBrowserExtensionsMenu:f,closeDownloadsManagerPanel:Te,formatDownloadBytes:Ue,formatDownloadEta:Ge,formatDownloadSpeed:He,initDownloadsManager:V,initExtensionsManager:F,loadManagedDownloadsFromMain:Ne,refreshBrowserExtensionsUi:O,refreshExtensionsManagerList:m}}function ki({state:e,constants:n,showToast:t,openOverlayModal:o,closeOverlayModal:r,renderProfilePillSelect:u,resolveCredentialScopeIdForTab:h,applyProfileSelection:x,getCurrentProfileId:k,escapeHtml:P}){const{AUTH_GATEWAY_HOSTS:b,RESOURCE_SERVICE_ORIGIN:C}=n,L=()=>e.activeTabId,A=()=>e.credentialCache,U=d=>{e.credentialCache=d},H=()=>e.activeHttpAuthChallenge,z=d=>{e.activeHttpAuthChallenge=d},Z=()=>e.credentialCacheRefreshedAt,de=d=>{e.credentialCacheRefreshedAt=d},Y=()=>e.credentialCacheRefreshInFlight,re=d=>{e.credentialCacheRefreshInFlight=d},ye=new Map;function Le(){return{wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]}}function nt(){return Object.keys(Le())}function Me(){return!!(window.api&&typeof window.api.listProfileCredentials=="function"&&typeof window.api.saveProfileCredential=="function"&&typeof window.api.deleteProfileCredential=="function")}function ne(d=""){const m=String(d).trim().toLowerCase();if(!m)return"";try{const F=new URL(m),V=String(F.hostname||"").trim().toLowerCase().replace(/^www\./,""),s=String(F.port||"").trim();return V?!s||s==="80"||s==="443"?V:`${V}:${s}`:""}catch{}const I=m.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];if(!I)return"";const y=I.lastIndexOf(":");if(y<=0)return I;const R=I.slice(y+1);return/^\d+$/.test(R)&&R!=="80"&&R!=="443"?I:I.slice(0,y)}function ue(d=""){const m=String(d||"").trim().toLowerCase();if(!m)return"";const I=m.lastIndexOf(":");if(I<=0)return m;const y=m.slice(I+1);return/^\d+$/.test(y)?m.slice(0,I):m}function qe(d=""){const m=[];try{const I=new URL(String(d||"")),y=(F="")=>{if(F)try{const V=new URL(String(F)),s=ne(V.host||V.hostname||"");s&&m.push(s)}catch{const s=ne(String(F||""));s&&m.push(s)}};y(I.host||I.hostname||""),["retURL","retUrl","returnUrl","TargetResource","targetResource","PartnerSpId","partnerSpId"].forEach(F=>{y(I.searchParams.get(F)||"")})}catch{}return[...new Set(m.filter(Boolean))]}function Pe(d=""){const m=qe(d);if(m.length===0)return ne(d);const I=m[0]||"";if(b.has(I)){const y=m.find(R=>R&&!b.has(R));if(y)return y}return I}function xe(d=""){return b.has(ne(d))}function ke(d=""){const m=ue(ne(d));return m.endsWith(".veevavault.com")||m==="veevavault.com"||m.endsWith(".gskinternet.com")||m==="gskinternet.com"||m.endsWith(".gskpro.com")||m==="gskpro.com"}function Ye(d,m,I=""){const y=String(m||"").trim().toLowerCase(),R=ne(I);if(!d||!y)return null;const F=(A()[d]||[]).filter(V=>{const s=ne(V.domain);return s&&s!==R&&!xe(s)&&ke(s)&&String(V.username||"").trim().toLowerCase()===y});return F.sort((V,s)=>ne(s.domain).length-ne(V.domain).length),F[0]||null}function Fe(d=""){const m=String(d||"").trim();return/^(true|false|null|undefined|yes|no|on|off|0|1)$/i.test(m)?"":m}async function Ue(){if(!window.api?.deleteProfileCredential)return;const d=[];nt().forEach(m=>{(A()[m]||[]).forEach(I=>{const y=ne(I.domain);!xe(y)||!Ye(m,I.username,y)||d.push({profileId:m,domain:y,username:String(I.username||"").trim()})})}),d.length!==0&&(await Promise.allSettled(d.map(m=>window.api.deleteProfileCredential(m))),d.forEach(m=>{const I=A()[m.profileId]||[];A()[m.profileId]=I.filter(y=>!(ne(y.domain)===m.domain&&String(y.username||"").trim().toLowerCase()===m.username.toLowerCase()))}))}async function He(){if(!Me())return U(Le()),A();try{const d=await window.api.listProfileCredentials();if(!d||!d.success||!Array.isArray(d.data))return U(Le()),A();const m=Le();return d.data.forEach(I=>{const y=String(I.profileId||"").toLowerCase();m[y]&&m[y].push({profileId:y,domain:ne(I.domain),username:String(I.username||""),password:String(I.password||"")})}),U(m),await Ue(),A()}catch{return U(Le()),A()}}async function Ge(d=15e3){if(!Me()||Date.now()-Z()<d)return A();if(Y())return Y();const I=He().then(y=>(de(Date.now()),y)).finally(()=>{re(null)});return re(I),I}function he(d){return d?(d.credentialHintsByDomain||(d.credentialHintsByDomain={}),d.credentialHintsByDomain):{}}function Ee(d="",m=""){const I=`${String(d||"").toLowerCase()} ${String(m||"").toLowerCase()}`;if(/login|log-in|signin|sign-in|auth|oauth|sso|okta|accounts|session|password|passwd|credential|verify/.test(I))return!0;try{const y=new URL(String(d||""));if(C&&y.origin.toLowerCase()===C){const F=String(y.pathname||"/").toLowerCase(),V=String(m||"").toLowerCase();if((F==="/"||F==="/login"||F==="/signin")&&V.includes("synapse"))return!0}const R=`${y.pathname.toLowerCase()} ${y.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(R)}catch{return!1}}function Ne(d=""){let m="";try{m=new URL(String(d||"")).hostname.toLowerCase()}catch{return!1}return m==="10.215.56.196"||m.endsWith(".gskinternet.com")||m.endsWith(".gskpro.com")||m.endsWith(".veevavault.com")||m.endsWith(".okta.com")||m.endsWith(".oktacdn.com")||m.endsWith(".pingone.com")}function Te(d="",m="",I=null){return!Me()||!I?!1:I.launchedAppType==="website"||!I.launchedAppType?Ee(d,m)||Ne(d):!0}function Ke(d,m=""){if(!d)return null;const I=qe(m);if(I.length===0)return null;const y=A()[d]||[];let R=null,F=-1,V="";try{const s=ne(m);s&&(V=localStorage.getItem(`oneview:last-used-username:${d}:${s}`)||"")}catch{}return y.forEach(s=>{const p=ne(s.domain);if(!p)return;const w=I.reduce((S,N)=>{if(!N)return S;if(N===p)return Math.max(S,1e3);if(ue(N)===ue(p))return Math.max(S,900);if(N.endsWith(`.${p}`)||p.endsWith(`.${N}`))return Math.max(S,500);const j=ue(N),K=ue(p);if(j.endsWith(`.${K}`)||K.endsWith(`.${j}`))return Math.max(S,450);const fe=j.split(".").reverse(),ie=K.split(".").reverse();let ge=0;for(let we=0;we<Math.min(fe.length,ie.length)&&fe[we]===ie[we];we+=1)ge+=1;return Math.max(S,ge>1?ge:-1)},-1);if(w<0)return;const c=V&&String(s.username||"").trim().toLowerCase()===V.trim().toLowerCase();(!R||w>F||w===F&&c||w===F&&!c&&p.length>ne(R.domain).length)&&(R=s,F=w)}),R}function ot(d,m="",I=null){const y=A()[d]||[];if(y.length===0)return null;let R="";try{R=ne(m)}catch{R=""}const F=he(I),V=Object.values(F||{}).map(N=>String(N||"").trim()).filter(Boolean),s=String(I?.lastUsernameHint||"").trim()||V[V.length-1]||"";if(R&&xe(R)&&s){const N=Ye(d,s,R);if(N)return N}const p=Ke(d,m);if(p&&!xe(p.domain))return p;if(!s)return null;const w=y.filter(N=>String(N.username||"").trim().toLowerCase()===s.toLowerCase());if(w.length===1)return p&&!xe(w[0].domain)?p:w[0];if(w.length===0)return null;const c=R;if(!c)return w[0];const S=N=>{const j=ne(N);if(!j)return-1;if(xe(j)&&ke(c))return-100;if(xe(c)&&!xe(j))return 800+(ke(j)?50:0);if(c===j)return 1e3;if(ue(c)===ue(j))return 900;if(c.endsWith(`.${j}`)||j.endsWith(`.${c}`))return 500;const K=ue(c),fe=ue(j);if(K.endsWith(`.${fe}`)||fe.endsWith(`.${K}`))return 450;const ie=K.split(".").reverse(),ge=fe.split(".").reverse();let we=0;for(let X=0;X<Math.min(ie.length,ge.length)&&ie[X]===ge[X];X+=1)we+=1;return we};return w.sort((N,j)=>S(j.domain)-S(N.domain)),w[0]||null}function it(d,m="",I=null){const y=ot(d,m,I);if(y)return{...y,profileId:String(y.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};const R=A()[d]||[];if(R.length===1)return{...R[0],profileId:String(R[0]?.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()};let F="";try{F=ne(m)}catch{F=""}if(!F||R.length===0)return null;const V=w=>{const c=ne(w);if(!c)return-1;if(xe(F)&&!xe(c))return 800+(ke(c)?50:0);if(xe(c)&&ke(F))return-100;if(F===c)return 1e3;if(ue(F)===ue(c))return 900;if(F.endsWith(`.${c}`)||c.endsWith(`.${F}`))return 500;const S=ue(F),N=ue(c);if(S.endsWith(`.${N}`)||N.endsWith(`.${S}`))return 450;const j=S.split(".").reverse(),K=N.split(".").reverse();let fe=0;for(let ie=0;ie<Math.min(j.length,K.length)&&j[ie]===K[ie];ie+=1)fe+=1;return fe},p=[...R].sort((w,c)=>V(c.domain)-V(w.domain))[0]||null;return p?{...p,profileId:String(p.profileId||"").trim().toLowerCase()||String(d||"").trim().toLowerCase()}:null}async function ve(d,m){if(!d||!m)return;const I=String(m.username||""),y=String(m.password||"");if(!y)return!1;const R=`
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
          if (${JSON.stringify(!!I)} && userField) {
            userField.focus();
            setNativeValue(userField, ${JSON.stringify(I)});
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
    `;try{return await d.executeJavaScript(R,!0),!0}catch{return!1}}function f(d,m){if(!d||!m)return;d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);let I=0;const y=async()=>{if(I+=1,!(typeof d.isDestroyed=="function"?d.isDestroyed():!1)&&d.id===`webview-${L()}`){try{if(await d.executeJavaScript("Boolean(window.__oneviewManualCredentialEditAt)",!0)){d._oneviewAutofillTimer&&(clearTimeout(d._oneviewAutofillTimer),d._oneviewAutofillTimer=null);return}}catch{}await ve(d,m),I<6&&(d._oneviewAutofillTimer=setTimeout(y,1e3))}};y()}async function $(d){if(d)try{await d.executeJavaScript(`
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
        `,!0)}catch{}}async function E(d){if(!d)return null;try{const m=await d.executeJavaScript(`
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
        `,!0);return m&&(m.username||m.password)?m:null}catch{return null}}async function B(d,m){if(!Me()||!d||!m||m.id!==L()||!m.credentialAutomationEnabled)return;String(d.getURL?.()||m.url||"");let I=null;if(d._oneviewSubmittedCredential?(I=d._oneviewSubmittedCredential,d._oneviewSubmittedCredential=null):I=await E(d),!I)return;const y=I,R=String(y.trigger||"");if(String(y.activeInputType||"").toLowerCase(),R==="input"){const Ce=Pe(String(y.url||d.getURL()||"")),Je=Fe(y.username),dt=!!Je&&!!y.password&&Je.toLowerCase()===String(y.password).toLowerCase();Je&&!dt&&Ce&&(he(m)[Ce]=Je,m.lastUsernameHint=Je);return}const V=h(m),s=String(y.url||d.getURL()||""),p=Pe(s),w=he(m);let c=Fe(y.username);const S=String(y.password||"");if(!V||!p)return;const N=/^\d{4,8}$/.test(S),j=/authenticator|pingone|mfa|2fa|tfa|otp|verify/.test(s.toLowerCase());if(y.otpLike||j&&N)return;const K=String(w[p]||"").trim()||String(m.lastUsernameHint||"").trim(),fe=!!c&&!!S&&c.toLowerCase()===S.toLowerCase();c&&!fe?(w[p]=c,m.lastUsernameHint=c):w[p]?c=w[p]:m.lastUsernameHint&&(c=String(m.lastUsernameHint||"").trim());const ie=K||String(w[p]||"").trim()||String(m.lastUsernameHint||"").trim(),ge=!!c&&!!S&&c.toLowerCase()===S.toLowerCase();if(ge&&ie&&ie!==c&&(c=ie),!c||!S||ge&&(!ie||ie.toLowerCase()===c.toLowerCase()))return;const we=`${V}|${p}|${c}`,X=Date.now(),oe=ye.get(we)||0,pe=(A()[V]||[]).find(Ce=>ue(ne(Ce.domain))===ue(p)&&String(Ce.username||"").trim().toLowerCase()===c.toLowerCase());if(!(!pe||String(pe.password||"")!==S)&&X-oe<15e3)return;if(ye.set(we,X),await He(),xe(p)&&Ye(V,c,p)){(A()[V]||[]).find(dt=>ne(dt.domain)===p&&String(dt.username||"").trim().toLowerCase()===c.toLowerCase())&&window.api?.deleteProfileCredential&&(await window.api.deleteProfileCredential({profileId:V,domain:p,username:c}),await He());return}const ce=(A()[V]||[]).find(Ce=>ne(Ce.domain)===p&&String(Ce.username||"").trim().toLowerCase()===c.toLowerCase());if(!(ce&&String(ce.password||"")===S))try{if(!(await window.api.saveProfileCredential({profileId:V,domain:p,username:c,password:S}))?.success)return;await He()}catch(Ce){console.warn("Could not save remembered credential:",Ce)}}function D(d,m){!d||!m||d._oneviewCredentialPollId||(d._oneviewCredentialPollId=setInterval(()=>{if(typeof d.isDestroyed=="function"?d.isDestroyed():!1){clearInterval(d._oneviewCredentialPollId),d._oneviewCredentialPollId=null;return}m.id===L()&&B(d,m)},3e3))}async function G(d=!1){const m=document.getElementById("httpAuthModal"),I=document.getElementById("httpAuthForm"),y=H();m&&!m.classList.contains("hidden")&&r(()=>m.classList.add("hidden")),I&&I.reset(),z(null),d&&y?.challengeId&&typeof window.api?.submitHttpAuthChallenge=="function"&&window.api.submitHttpAuthChallenge({challengeId:y.challengeId,cancelled:!0}).catch(()=>{})}async function te(d={}){const m=document.getElementById("httpAuthModal"),I=document.getElementById("httpAuthModalTitle"),y=document.getElementById("httpAuthMessage"),R=document.getElementById("httpAuthUsernameInput"),F=document.getElementById("httpAuthPasswordInput"),V=document.getElementById("httpAuthRememberInput"),s=document.getElementById("httpAuthSubmitBtn");if(!m||!I||!y||!R||!F||!V||!s)return;H()?.challengeId&&G(!0),z({...d});const p=String(d.reason||"")==="retry";I.textContent=p?"Login Failed, Update Credential":"Website Login Required";const w=String(d.host||d.url||"this website").trim(),c=String(d.realm||"").trim(),S=String(d.profileId||"").trim().toUpperCase();y.textContent=c?`${w} • ${c}${S?` • ${S}`:""}`:`${w}${S?` • ${S}`:""}`,R.value=String(d.username||""),F.value=String(d.password||""),V.checked=d.remember!==!1,s.textContent=p?"Update And Login":"Login",await o(()=>m.classList.remove("hidden")),F.value?(F.focus(),F.select()):(R.focus(),R.select())}function J(){const d=document.getElementById("httpAuthModal"),m=document.getElementById("httpAuthForm"),I=document.getElementById("httpAuthModalCloseBtn");!d||!m||!I||m.dataset.initialized!=="1"&&(m.dataset.initialized="1",I.addEventListener("click",()=>G(!0)),d.addEventListener("click",y=>{y.target===d&&G(!0)}),m.addEventListener("submit",async y=>{y.preventDefault();const R=H(),F=document.getElementById("httpAuthUsernameInput"),V=document.getElementById("httpAuthPasswordInput"),s=document.getElementById("httpAuthRememberInput");if(!R?.challengeId||!F||!V||typeof window.api?.submitHttpAuthChallenge!="function")return;const p=String(F.value||"").trim(),w=String(V.value||""),c=!!s?.checked;if(!(!p||!w))try{await window.api.submitHttpAuthChallenge({challengeId:R.challengeId,username:p,password:w,remember:c}),G(!1)}catch(S){console.error("Failed to submit HTTP auth credential",S),t("Could not submit the website credential.","error")}}),typeof window.api?.onHttpAuthChallenge=="function"&&window.api.onHttpAuthChallenge(y=>{te(y).catch(R=>{console.error("Failed to open HTTP auth modal",R)})}))}function ae(){}async function O(d,m){if(!m||!m.rect)return;const I=d.getURL(),y=Pe(I);if(!y)return;const R=[];if(Object.entries(A()).forEach(([V,s])=>{s.forEach(p=>{const w=ne(p.domain),c=ue(w),S=ue(y);if(c===S||S.endsWith(`.${c}`)&&c.split(".").length>1){const N=n.PROFILES[V]||{name:V,color:"#ccc"};R.push({...p,profileId:V,profileName:N.name,profileColor:N.color})}})}),R.length===0)return;const F=`if (typeof window.__oneviewShowCredentialDropdown === "function") {
      window.__oneviewShowCredentialDropdown(${JSON.stringify(R)});
    }`;d.executeJavaScript(F,!0).catch(()=>{})}return{canUseSecureCredentialApi:Me,getAutofillCredentialForTab:it,initHttpAuthPrompt:J,initPasswordManager:ae,installCredentialCaptureHooks:$,isCredentialAutomationDomain:Ne,isLikelyAuthPage:Ee,maybeOfferRememberCredentials:B,normalizeDomain:ne,refreshCredentialCacheIfStale:Ge,scheduleCredentialAutofill:f,shouldEnableCredentialAutomation:Te,startCredentialCapturePolling:D,handleCredentialFieldInteraction:O,hideCredentialDropdown:()=>{}}}function Bi({state:e,constants:n,createNativePageDescriptor:t,ensureNativeSettingsGeneralInfo:o,normalizeSettingsSection:r,renderNativeSettingsPage:u,closeBrowserExtensionsMenu:h,closeBrowserExtensionPopup:x,refreshBrowserExtensionsUi:k,refreshTabScrollControls:P,syncProfileSelectionForTab:b,updateProfileLockUI:C,perfMark:L,shouldRequirePlatformApiForNavigation:A,getWebviewPlatformApiFlag:U,setWebviewPlatformApiFlag:H,getWebviewPreloadPathCached:z,startCredentialCapturePolling:Z,scheduleCredentialAutofill:de,installCredentialCaptureHooks:Y,refreshCredentialCacheIfStale:re,getAutofillCredentialForTab:ye,resolveAssignedProfileIdForTab:Le,getCredentialScopeIdByPartition:nt,resolveCredentialScopeIdForTab:Me,maybeOfferRememberCredentials:ne,syncTabProfileForPage:ue,trackProfileHistory:qe,resolveProfileIdForTab:Pe,resolveAssignedProfileId:xe,resolveStrictProfileNavigationTarget:ke,resolveNavigationPartition:Ye,applyProfileSelection:Fe,openProfilePromptDialog:Ue,handleCredentialFieldInteraction:He,hideCredentialDropdown:Ge}){const{PARTITIONS:he,PROFILES:Ee,LOCAL_WEB_APP_TYPES:Ne,WEBVIEW_POOL_MAX:Te=6,WEBVIEW_POOL_KEEPALIVE_MS:Ke=6e4,TAB_PREWARM_ENABLED:ot=!1,PREWARM_ALL_PROFILE_PARTITIONS:it=!1}=n,ve=[];let f=null;const $=new Map,E=()=>e.tabs,B=i=>{e.tabs=i},D=()=>e.activeTabId,G=i=>{e.activeTabId=i},te=()=>e.currentProfileId;function J(i){const a=document.querySelector(".browser-controls-overlay");if(!a)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result"));l&&i&&(i.hideBrowserControls=!1);const g=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);a.classList.toggle("hidden",g),l?(a.classList.remove("hidden"),a.style.setProperty("display","flex","important"),a.style.setProperty("visibility","visible","important"),a.style.setProperty("opacity","1","important"),a.style.setProperty("height","40px","important")):(a.style.removeProperty("display"),a.style.removeProperty("visibility"),a.style.removeProperty("opacity"),a.style.removeProperty("height"))}function ae(i){const a=document.getElementById("browserDetachHeader");if(!a)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),g=(!i||i.isHome||!!i.hideBrowserControls||!!i.nativePage)&&!l;a.classList.toggle("hidden",g)}function O(i){const a=document.querySelector(".profile-section");if(!a)return;const l=i&&(i.url&&(i.url.includes("result.html")||i.url.includes("extension-icon")||i.url.toLowerCase().includes("result"))||i.title&&i.title.includes("Result")),g=!!((i&&!i.isHome&&i.hideBrowserControls||i?.nativePage)&&!l);a.classList.toggle("hidden",g)}function d(i,a){const l=E().find(v=>v.id===i);if(!l)return;l.title=a;const g=document.getElementById(`tab-ui-${i}`);g&&(g.querySelector(".tab-title").textContent=a)}function m(){const i=D();return i&&E().find(a=>a.id===i)||null}function I(){const i=D();return i?document.getElementById(`webview-${i}`):null}function y(i){const a=document.getElementById("urlDisplay");a&&(a.value=i)}function R(i){const a=document.getElementById("urlDisplay");a&&(a.value=i)}function F(){const i=document.getElementById("browserBack"),a=document.getElementById("browserForward"),l=I();i&&(i.disabled=l?!l.canGoBack():!0),a&&(a.disabled=l?!l.canGoForward():!0)}function V(i){i&&(i._oneviewCredentialPollId&&(clearInterval(i._oneviewCredentialPollId),i._oneviewCredentialPollId=null),i._oneviewAutofillTimer&&(clearTimeout(i._oneviewAutofillTimer),i._oneviewAutofillTimer=null))}function s(i){document.querySelectorAll(".webviews-container .webcontent-pane").forEach(l=>{const g=l.id.replace("webview-",""),v=E().find(W=>W.id===g);g===i&&!v?.isHome&&v?.credentialAutomationEnabled?Z(l,v):V(l)})}function p(i,a=E().length-1){const l=document.getElementById("tabsList");if(!l)return;const g=document.createElement("div");g.className="tab",g.id=`tab-ui-${i.id}`,g.innerHTML=`
        <span class="tab-title">${i.title}</span>
        <button class="tab-close">x</button>
    `,g.addEventListener("click",W=>{W.target.classList.contains("tab-close")||K(i.id)}),g.querySelector(".tab-close").addEventListener("click",W=>{W.stopPropagation(),ge(i.id)});const T=l.children[a]||null;l.insertBefore(g,T),P()}function w(i){setTimeout(async()=>{const a=E().find(g=>g.id===i);if(!(!a||!a.isHome||document.getElementById(`webview-${i}`)))try{const g=await ce(a);if(!g)return;g.classList.remove("active"),typeof g.hide=="function"&&g.hide().catch(()=>{}),g.syncBounds?.(!1)}catch(g){window.api.webContentCall("log-error",{key:`prewarm-err:${i}:${g.toString()}`}).catch(()=>{})}},0)}async function c(i=null,a=null,l="New Tab",g=null,v={}){const T=v.active!==!1;window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?a=he.gsk:a=ft(a||(Ee[te()]?Ee[te()].partition:he.guest));const q=`tab-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,M={id:q,title:l,url:i,partition:a,isHome:!i&&!v.nativePage,nativePage:v.nativePage&&typeof v.nativePage=="object"?t(v.nativePage.type||"settings",v.nativePage.section||"general"):null,lockedProfileId:g,hideBrowserControls:!1,launchedAppType:null,trackingAppId:"",trackingAppName:"",requiresPlatformApi:!1,extensionCompatEnabled:!1,extensionEntryPath:"",extensionActiveContext:{url:"",title:""},credentialAutomationEnabled:!1,lastCredentialSourceProfileId:null};M.trackingAppId=String(v.trackingAppId||"").trim(),M.trackingAppName=String(v.trackingAppName||l||M.title||"").trim(),M.extensionEntryPath=String(v.extensionEntryPath||"").trim(),M.extensionCompatEnabled=!!M.extensionEntryPath,M.extensionActiveContext=v.extensionActiveContext&&typeof v.extensionActiveContext=="object"?{url:String(v.extensionActiveContext.url||"").trim(),title:String(v.extensionActiveContext.title||"").trim()}:{url:"",title:""};const Q=E(),Se=Q.findIndex(st=>st.id===D()),We=Number.isInteger(v.insertIndex)?Math.max(0,Math.min(v.insertIndex,Q.length)):Se>=0?Se+1:Q.length;if(Q.splice(We,0,M),p(M,We),M.nativePage)await K(q);else if(i){T&&G(q);const st=document.getElementById("view-home-content"),_t=document.getElementById("webviews-container");T&&st&&st.classList.add("hidden");const yi=i&&(i.includes("result.html")||i.includes("extension-icon")||i.toLowerCase().includes("result"));if(T&&_t){_t.classList.remove("hidden");let Ve=document.getElementById("tab-load-placeholder");yi?Ve&&(Ve.style.display="none"):Ve?Ve.style.display="flex":(Ve=document.createElement("div"),Ve.id="tab-load-placeholder",Ve.style.cssText=["position:absolute","inset:0","z-index:50","display:flex","flex-direction:column","align-items:center","justify-content:center","background:var(--bg-main,#f8fafc)","gap:16px"].join(";"),Ve.innerHTML=`
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" style="animation:tab-spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span style="font-size:14px;font-weight:600;color:#475569">Loading...</span>
            <style>@keyframes tab-spin{to{transform:rotate(360deg)}}</style>
          `,_t.appendChild(Ve));const an=()=>{Ve&&(Ve.style.display="none")},sn=$e=>{$e&&(typeof $e._oneviewPlaceholderFinalize=="function"&&($e.removeEventListener("did-stop-loading",$e._oneviewPlaceholderFinalize),$e.removeEventListener("did-fail-load",$e._oneviewPlaceholderFinalize)),$e._oneviewPlaceholderFinalize=null)},ln=setInterval(()=>{const $e=document.getElementById(`webview-${q}`);if(!$e)return;clearInterval(ln),clearTimeout(cn);const Dt=()=>{sn($e),clearTimeout(cn),an()};sn($e),$e._oneviewPlaceholderFinalize=Dt,$e.addEventListener("did-stop-loading",Dt,{once:!0}),$e.addEventListener("did-fail-load",Dt,{once:!0})},100),cn=setTimeout(()=>{clearInterval(ln),an()},12e3)}await we(q,i,a,l,g,v,T)}else await K(q),ot&&w(q);return M}function S(i=D()){const a=E(),l=a.find(q=>q.id===i);if(!l)return;const g=a.findIndex(q=>q.id===l.id),v=document.getElementById(`webview-${l.id}`),T=v&&typeof v.getURL=="function"&&v.getURL()||l.url||"",W=v&&typeof v.getTitle=="function"&&v.getTitle()||l.title||"New Tab";c(l.isHome||!T||T==="about:blank"?null:T,l.partition,W,l.lockedProfileId||null,{insertIndex:g>=0?g+1:a.length,trackingAppId:l.trackingAppId||"",trackingAppName:l.trackingAppName||W})}function N(i){const a=E();if(!a.length)return;const l=a.findIndex(T=>T.id===D()),v=((l>=0?l:0)+i+a.length)%a.length;K(a[v].id,{suppressHomeSearchFocus:!0})}async function j(i){!i||typeof i.focusWebContents!="function"||await i.focusWebContents().catch(()=>{})}async function K(i,a={}){G(i);const l=E().find(M=>M.id===i);if(!l)return;h(),x().catch(()=>{}),b(l),C(l),document.querySelectorAll(".tab").forEach(M=>M.classList.remove("active"));const g=document.getElementById(`tab-ui-${i}`);g&&g.classList.add("active");const v=document.getElementById("view-home-content"),T=document.getElementById("nativeTabContent"),W=document.getElementById("webviews-container"),q=document.querySelectorAll(".webviews-container .webcontent-pane");if(l.isHome){v.classList.remove("hidden"),T?.classList.add("hidden"),W.classList.add("hidden"),J(l),ae(l),O(l);const M=document.getElementById("googleSearchInput");M&&a?.suppressHomeSearchFocus!==!0&&(M.value="",M.focus())}else if(l.nativePage)v.classList.add("hidden"),T?.classList.remove("hidden"),W.classList.add("hidden"),J(l),ae(l),O(l),y(""),r(l.nativePage?.section)==="general"&&await o(),u(l);else{v.classList.add("hidden"),T?.classList.add("hidden"),W.classList.remove("hidden"),J(l),ae(l),O(l),q.forEach(Q=>{Q.id!==`webview-${i}`&&(Q.classList.remove("active"),typeof Q.hide=="function"&&Q.hide().catch(()=>{}),Q.syncBounds?.(!1))});let M=null;try{M=document.getElementById(`webview-${i}`),M||(M=await ce(l))}catch(Q){window.api.webContentCall("log-error",{key:`switchTab-create-err:${i}:${Q.toString()}`}).catch(()=>{})}if(M)try{M.classList.add("active"),typeof M.show=="function"&&await M.show().catch(()=>{}),M.syncBounds?.(!0),await j(M),y(M.getURL())}catch(Q){window.api.webContentCall("log-error",{key:`switchTab-show-err:${i}:${Q.toString()}`}).catch(()=>{})}}s(l.id),k(),F()}function fe(i){if(!i)return!1;const a=String(i.launchedAppType||"").toLowerCase();return Ne.has(a)}function ie(i,a){if(!i||!a||!fe(a))return!1;const l=String(i.getAttribute("partition")||a.partition||"");if(!l)return!1;const g=i.parentElement;for(g&&g.removeChild(i),i.classList.remove("active"),ve.push({webview:i,partition:l,platformApiEnabled:U(i),at:Date.now()}),L("view-webcontent","park-to-pool",{partition:l,poolSize:ve.length});ve.length>Te;){const v=ve.shift();v&&v.webview&&!v.webview.isDestroyed?.()&&v.webview.remove()}return!0}function ge(i){const a=E(),l=a.findIndex(W=>W.id===i);if(l===-1)return;const g=D()===i;document.getElementById(`tab-ui-${i}`)?.remove();const v=document.getElementById(`webview-${i}`);if(v&&(V(v),(!fe(a[l])||!ie(v,a[l]))&&v.remove()),a.splice(l,1),a.length===0){G(null),c(),P();return}const T=a.some(W=>W.id===D());if(g||!T){const W=Math.min(l,a.length-1),q=a[W]||a[a.length-1];q&&K(q.id)}P()}async function we(i,a,l,g,v=null,T={},W=!0){const q=performance.now(),M=E().find(Se=>Se.id===i);if(!M)return;M._navStartedAt=q,L("view-nav","navigateTo-start",{tabId:M.id,url:String(a||""),partition:String(l||""),appType:T.appType||null}),M.isHome=!1,M.url=a,M.partition=l,M.lockedProfileId=v,M.hideBrowserControls=!!T.hideControls,M.launchedAppType=T.appType||null,M.lastCredentialSourceProfileId=null,M.trackingAppId=String(T.trackingAppId||"").trim(),M.trackingAppName=String(T.trackingAppName||g||M.title||"").trim(),M.requiresPlatformApi=A(a,T),g&&d(i,g),W&&(G(i),await K(i));let Q=document.getElementById(`webview-${i}`);if(!Q)Q=await ce(M,W);else{const Se=Q.getAttribute("partition"),We=U(Q);(Se!==l||We!==!!M.requiresPlatformApi)&&(V(Q),(!fe(M)||!ie(Q,M))&&Q.remove(),Q=await ce(M,W))}W&&typeof Q.show=="function"?await Q.show().catch(()=>{}):!W&&typeof Q.hide=="function"&&await Q.hide().catch(()=>{}),typeof Q.setMeta=="function"&&await Q.setMeta({trackingAppId:M.trackingAppId,appName:M.trackingAppName,appType:M.launchedAppType||""}).catch(()=>{}),Q.syncBounds?.(W),W&&(y(a),await j(Q)),Q.src!==a&&(Q.src=a),L("view-nav","navigateTo-dispatch",{tabId:M.id,elapsedMs:Math.round(performance.now()-q)})}async function X(i,a,l,g=null,v={}){return we(D(),i,a,l,g,v,!0)}function oe(i){i&&i.executeJavaScript(`
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
      `,!0).catch(()=>{})}function pe(i=""){const a=String(i||"").trim().toLowerCase();return!!(!a||a==="about:blank"||a.startsWith("javascript:")||a.startsWith("data:")||a.startsWith("chrome-error://"))}function ee(i){i._hasTabListenersAttached||(i._hasTabListenersAttached=!0,i.addEventListener("ipc-message",async a=>{if(a.channel==="oneview:credential-field-focused")He(i,a.args[0]);else if(a.channel!=="oneview:credential-field-blurred"){if(a.channel==="oneview:credential-selected"){const l=a.args[0];if(l){i.executeJavaScript("window.__oneviewManualCredentialEditAt = 0;",!0).catch(()=>{}),de(i,l),l.profileId&&l.profileId!==te()&&Fe(l.profileId);try{const g=i.getURL(),v=g?new URL(g).hostname.toLowerCase():"";v&&localStorage.setItem(`oneview:last-used-username:${l.profileId||te()}:${v}`,l.username)}catch{}}}else if(a.channel==="oneview:credential-login-attempted"){const l=a.args[0];if(l&&l.username)try{const g=l.url?new URL(l.url).hostname.toLowerCase():"";g&&localStorage.setItem(`oneview:last-used-username:${te()}:${g}`,l.username)}catch{}}else if(a.channel==="oneview:credential-submitted"){const l=a.args[0];if(l){i._oneviewSubmittedCredential=l;const g=i.id.replace("webview-",""),v=E().find(T=>T.id===g);v&&ne(i,v)}}}}),i.addEventListener("console-message",a=>{const l=String(a?.message||"");(l.includes("[OneView][Credential")||l.includes("[VeevaSlide]"))&&console.log("[WebviewConsole]",{level:a?.level,line:a?.line,sourceId:a?.sourceId||"",message:l})}),i.addEventListener("did-start-loading",()=>{const a=i.id.replace("webview-",""),l=E().find(v=>v.id===a);if(!l)return;l._didStartLoadingAt=performance.now(),L("view-webcontent","did-start-loading",{tabId:l.id,url:i.getURL()||l.url||""}),l.url&&(l.url.includes("result.html")||l.url.includes("extension-icon")||l.url.toLowerCase().includes("result"))?(d(l.id,"Result"),l.id===D()&&R(l.url||"")):(d(l.id,"Loading..."),l.id===D()&&R(l.url||"Loading..."))}),i.addEventListener("did-stop-loading",async()=>{const a=i.id.replace("webview-",""),l=E().find(Se=>Se.id===a);if(!l)return;const g=typeof l._didStartLoadingAt=="number"?Math.round(performance.now()-l._didStartLoadingAt):null,v=typeof l._navStartedAt=="number"?Math.round(performance.now()-l._navStartedAt):null;L("view-webcontent","did-stop-loading",{tabId:l.id,url:i.getURL()||"",loadElapsedMs:g,navElapsedMs:v});const T=i.getURL()||l.url||"";let q=T&&(T.includes("result.html")||T.includes("extension-icon")||T.toLowerCase().includes("result"))?"Result":i.getTitle()||l.title||"Tab";if(q==="Tab"||q==="Loading..."||!q)try{const Se=new URL(T);q=Se.hostname?Se.hostname.replace("www.",""):"Tab"}catch{q="Tab"}if((l.title==="Loading..."||l.title==="Tab"||!l.title||i.getTitle()&&i.getTitle()!=="about:blank")&&d(l.id,q),l.id===D()&&y(T),l.url=T,l.credentialAutomationEnabled=nn(T,q,l),l.credentialAutomationEnabled){const Se=Le(l,T,q),We=nt(l.partition)||Se||te();await re();const st=ye(We,T,l);de(i,st),Z(i,l),Y(i)}else V(i);await ue(l,T,q,i),wi(i,l);const Q=Pe(l);qe(Q,T,q),oe(i)}),i.addEventListener("page-title-updated",a=>{const l=i.id.replace("webview-",""),g=E().find(v=>v.id===l);g&&(d(g.id,a.title),g.credentialAutomationEnabled&&ne(i,g))}),i.addEventListener("will-navigate",()=>{const a=i.id.replace("webview-",""),l=E().find(g=>g.id===a);l&&l.credentialAutomationEnabled&&ne(i,l)}),i.addEventListener("did-navigate",a=>{const l=i.id.replace("webview-",""),g=E().find(W=>W.id===l);if(!g)return;const v=a.url||i.getURL()||"";g.url=v,g.id===D()&&(y(v),F());const T=Pe(g);qe(T,v,i.getTitle()||g.title||"")}),i.addEventListener("did-navigate-in-page",async a=>{const l=i.id.replace("webview-",""),g=E().find(M=>M.id===l);if(!g)return;const v=a.url||i.getURL()||"";g.url=v,g.id===D()&&(y(v),F());const T=Pe(g);if(qe(T,v,i.getTitle()||g.title||""),i.addEventListener("history-changed",M=>{_=M,g.id===D()&&F()}),g.credentialAutomationEnabled=nn(v,i.getTitle()||g.title||"",g),!g.credentialAutomationEnabled){V(i);return}ne(i,g),await re();const W=nt(g.partition)||Le(g,v,i.getTitle()||g.title||"")||Me(g),q=ye(W,v,g);de(i,q),Z(i,g)}),i.addEventListener("new-window",async a=>{const l=i.id.replace("webview-",""),g=E().find(Se=>Se.id===l);if(!g)return;typeof a?.preventDefault=="function"&&a.preventDefault();const v=String(a?.url||"").trim();if(pe(v))return;const T=String(i.getURL()||"").trim();if(T&&T===v)return;let W=xe(v,"New Tab"),q=null;if(W)q=Ee[W].partition;else if(Ue){const Se=Pe(g)||"guest",We=await Ue(v,Se);if(We&&!We.cancelled&&We.profileId)W=We.profileId,q=Ee[W]?.partition;else return}else q=g.partition;const M=E(),Q=M.findIndex(Se=>Se.id===g.id);c(v,q,"New Tab",W,{insertIndex:Q>=0?Q+1:M.length})}))}async function ce(i,a=!0){if($.has(i.id))return $.get(i.id);const l=Je(i,a);$.set(i.id,l);try{return await l}finally{$.delete(i.id)}}function Ce(i){const a=String(i?.partition||"");if(!a||ve.length===0)return null;const l=!!i?.requiresPlatformApi,g=ve.findIndex(T=>T.partition===a&&!!T.platformApiEnabled===l);if(g===-1)return null;const[v]=ve.splice(g,1);return v?.webview||null}async function Je(i,a=!0){const l=performance.now(),g=document.getElementById("webviews-container"),v=Ce(i);if(v)return v.classList.toggle("active",a),v.id=`webview-${i.id}`,v.setAttribute("partition",i.partition),H(v,!!i.requiresPlatformApi),ee(v),g.appendChild(v),a&&typeof v.show=="function"?v.show().catch(()=>{}):!a&&typeof v.hide=="function"&&v.hide().catch(()=>{}),v.syncBounds?.(a),a&&typeof v.focusWebContents=="function"&&v.focusWebContents().catch(()=>{}),L("view-webcontent","reuse-pooled",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l),poolSize:ve.length}),v;const T=z(),W=await un({key:`view:${i.id}`,partition:i.partition,preloadPath:T,additionalArguments:i.requiresPlatformApi?["--oneview-enable-platform-api=1"]:[],extensionEntryPath:i.extensionEntryPath,extensionActiveContext:i.extensionActiveContext,extensionCompat:!0,initialMeta:{trackingAppId:i.trackingAppId,appName:i.trackingAppName,appType:i.launchedAppType||"",extensionEntryPath:i.extensionEntryPath},className:`webcontent-pane${a?" active":""}`});return W.id=`webview-${i.id}`,W.setAttribute("partition",i.partition),H(W,!!i.requiresPlatformApi),ee(W),g.appendChild(W),!a&&typeof W.hide=="function"&&W.hide().catch(()=>{}),W.syncBounds?.(a),a&&typeof W.focusWebContents=="function"&&W.focusWebContents().catch(()=>{}),L("view-webcontent","create-fresh",{tabId:i.id,partition:i.partition,elapsedMs:Math.round(performance.now()-l)}),W}function dt(){f||(f=setInterval(()=>{if(!document.hidden&&ve.length!==0)for(let i=ve.length-1;i>=0;i-=1){const l=ve[i]?.webview;if(!l||l.isDestroyed?.()){ve.splice(i,1);continue}l.executeJavaScript("void 0",!1).catch(()=>{})}},Ke))}async function tn(i){const a=String(i||"").trim();if(!a||ve.some(T=>T.partition===a))return;const l=document.getElementById("webviews-container");if(!l)return;const g=z(),v=`view:prewarm:${a}:${Date.now()}`;try{const T=await un({key:v,partition:a,preloadPath:g,className:"webcontent-pane"});T.id=`webview-prewarm-${Date.now()}`,l.appendChild(T),T.syncBounds?.(),ie(T,{launchedAppType:"website",partition:a})}catch{}}async function di(){const i=Array.from(new Set(Object.values(Ee).map(a=>String(a?.partition||"").trim()).filter(Boolean)));for(const a of i)await tn(a),await new Promise(l=>setTimeout(l,60))}async function ui(){const i=Ee[te()]?.partition||Ee.guest.partition;i&&await tn(i)}function pi(){dt(),ot&&(it?di():ui())}function fi(){for(f&&(clearInterval(f),f=null);ve.length>0;){const i=ve.shift();i&&i.webview&&!i.webview.isDestroyed?.()&&i.webview.remove()}}function mi(i,a=null){return!(!i||i.isHome)}function wi(i,a){if(!i||!a||a.launchedAppType!=="website")return;const l=`
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
  `;try{i.insertCSS(l)}catch(g){console.warn("Could not apply website scrollbar theme:",g)}}function gi(){const i=E().find(l=>l.id===D());if(!i||i.isHome)return;i.isHome=!0,i.url=null,i.lockedProfileId=null,d(i.id,"New Tab");const a=document.getElementById(`webview-${i.id}`);a&&(V(a),(!fe(i)||!ie(a,i))&&a.remove()),K(i.id)}function hi(i=""){const a=String(i||"").trim();if(!a)return"";const l=a.match(/^https?:\/\/([a-zA-Z])(?:\/|%2[fF]|\\)(.*)$/);if(l){const v=l[1].toUpperCase(),T=decodeURIComponent(l[2]).replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${v}:/${T}`}if(/^file:\/\//i.test(a)||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/^about:/i.test(a))return a;const g=a.match(/^([a-zA-Z])[:/\\](.*)$/);if(g){const v=g[1].toUpperCase(),T=g[2].replace(/\\/g,"/").replace(/^\/+/,"");return`file:///${v}:/${T}`}if(/^\/[A-Za-z]\//.test(a)){const v=a[1].toUpperCase(),T=a.slice(3).replace(/\\/g,"/");return`file:///${v}:/${T}`}return/^\\\\/.test(a)?`file:${a.replace(/\\/g,"/")}`:a}function $t(i=""){const a=String(i||"").trim();return!a||/\s/.test(a)?!1:!!(/^about:/i.test(a)||/^[a-z][a-z0-9+.-]*:\/\//i.test(a)||/^localhost(?::\d+)?(?:[/?#].*)?$/i.test(a)||/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[/?#].*)?$/.test(a)||a.includes(".")||/[/:?#]/.test(a))}async function vi(i){if(i=hi(i),!i)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){let v=i;$t(i)?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&(v=`https://${i}`):v=`https://www.google.com/search?q=${encodeURIComponent(i)}`,await X(v,he.gsk,i);return}let a=i,l=$t(i);if(l?!/^[a-z][a-z0-9+.-]*:\/\//i.test(i)&&!/^about:/i.test(i)&&!/^file:\/\//i.test(i)&&(a=`https://${i}`):$t(i)?(a=`https://${i}`,l=!0):a=`https://www.google.com/search?q=${encodeURIComponent(i)}`,l){const v=await ke(a,null,"New Tab");if(!v||v.cancelled)return;const T=v.profileId,W=v.partition;T&&T!==te()&&Fe(T,{bypassLock:!0}),await X(a,W,"New Tab",v.lockedProfileId);return}const g=Ye(a,m()?.partition||Ee[te()]?.partition||he.guest,"Google Search");await X(a,g,"Google Search")}function bi(i,{isTeardown:a=!1}={}){const l=E(),g=Array.isArray(i)?i.filter(Boolean):[];if(g.length===0||l.length===0)return;const v=new Set(g),T=[...l],W=T.findIndex(q=>q.id===D());if(T.forEach(q=>{if(!v.has(q.id))return;document.getElementById(`tab-ui-${q.id}`)?.remove();const M=document.getElementById(`webview-${q.id}`);M&&(V(M),(!fe(q)||!ie(M,q))&&M.remove())}),B(T.filter(q=>!v.has(q.id))),E().length===0){G(null),a||(c(),P());return}if(v.has(D())){const q=Math.min(Math.max(W,0),E().length-1);G(E()[q].id)}K(D()||E()[0].id),P()}function nn(i="",a="",l=null){return l?l.launchedAppType==="website"||!l.launchedAppType?on(i,a)||rn(i):!0:!1}function on(i="",a=""){const l=`${String(i||"")} ${String(a||"")}`.toLowerCase();if(/login|sign in|signin|password|sso|authenticate|verify/.test(l))return!0;try{const g=new URL(String(i||"")),v=`${g.pathname.toLowerCase()} ${g.search.toLowerCase()}`;return/login|signin|auth|sso|oauth|session|password|verify/.test(v)}catch{return!1}}function rn(i=""){let a="";try{a=new URL(String(i||"")).hostname.toLowerCase()}catch{return!1}return a==="10.215.56.196"||a.endsWith(".gskinternet.com")||a.endsWith(".gskpro.com")||a.endsWith(".veevavault.com")||a.endsWith(".okta.com")||a.endsWith(".oktacdn.com")||a.endsWith(".pingone.com")}return{closeTab:ge,closeTabsBulk:bi,createTab:c,createWebviewForTab:ce,duplicateTab:S,disposeWebviewRuntime:fi,getActiveTab:m,getActiveWebview:I,goToActiveTabHome:gi,isInspectableLocalFileTab:mi,navigateTo:X,navigateToTab:we,performSearch:vi,startWebviewRuntime:pi,switchRelativeTab:N,switchTab:K,updateTabTitle:d,updateUrlDisplay:y,updateUrlDisplayString:R,getCurrentProfileId:te,getTabs:E}}console.log("View Page Script initializing...");let le=[],Re=null,Pt=!1,Un=null,pn=null,fn=[],mn=[],wn={wppproduction:[],vml:[],gsk:[],guest:[],synapse:[],contentgen:[]};const Vt=Ze.profileHistory,jt="view.profileHistory.v1";let Ae={wppproduction:[],vml:[],gsk:[],guest:[]};const Nn=Ze.customBookmarks;let _e=[],gn="guest",Ft="guest",hn="",lt="guest",Ct=null,Xe=null,vn=null;const Ai=new Set(["login.veevavault.com","federation.gsk.com"]);let gt=null,De=-1,Oe=[],bn={version:"",defaultOpenStatus:""},yn=0,Sn=null,En=!1;const On=Ze.perfEnabled;let ut=null,xn=!1;const Et={};Object.defineProperties(Et,{tabs:{get:()=>le,set:e=>{le=e}},activeTabId:{get:()=>Re,set:e=>{Re=e}},browserExtensionsCache:{get:()=>fn,set:e=>{fn=e}},managedDownloadsCache:{get:()=>mn,set:e=>{mn=e}},nativeSettingsGeneralInfo:{get:()=>bn,set:e=>{bn=e}},historyProfileId:{get:()=>Ft,set:e=>{Ft=e}},historySearchQuery:{get:()=>hn,set:e=>{hn=e}},currentProfileId:{get:()=>me,set:e=>{me=e}},profileHistoryCache:{get:()=>Ae,set:e=>{Ae=e}},credentialCache:{get:()=>wn,set:e=>{wn=e}},passwordProfileId:{get:()=>gn,set:e=>{gn=e}},passwordEditTarget:{get:()=>pn,set:e=>{pn=e}},activeHttpAuthChallenge:{get:()=>vn,set:e=>{vn=e}},credentialCacheRefreshedAt:{get:()=>yn,set:e=>{yn=e}},credentialCacheRefreshInFlight:{get:()=>Sn,set:e=>{Sn=e}}});const Ht={synapse:{partition:be.synapse},contentgen:{partition:be.contentgen}},zt=new Set(["nextjs","vite","react","angular","html","neutralino","website","vite-server"]),Rn=(()=>{try{return new URL(Mn).origin.toLowerCase()}catch{return""}})(),Ti=new URL(""+new URL("contentgen-DZqnGDPH.png",import.meta.url).href,import.meta.url).href,$i=new URL(""+new URL("contentgen-dark-C7HM67Tp.png",import.meta.url).href,import.meta.url).href;function Cn(e=document){if(!e||typeof e.querySelectorAll!="function")return;const n=document.body.classList.contains("dark-mode");e.querySelectorAll("img[data-theme-icon]").forEach(t=>{const o=String(t.getAttribute("data-theme-icon")||"").trim();let r="";o==="contentgen"&&(r=n?$i:Ti),r&&t.getAttribute("src")!==r&&t.setAttribute("src",r)})}function _i(){["httpAuthModal","bookmarkModal","cacheActionModal","extensionsManagerModal"].forEach(e=>{const n=document.getElementById(e);!n||n.dataset.hoistedToBody==="1"||(document.body.appendChild(n),n.dataset.hoistedToBody="1")})}async function In(){const e=tt();if(!(!e||e.isHome||!e.url||!window.api?.openDetachedViewWindow))try{await window.api.openDetachedViewWindow({url:e.url,title:e.title||"Detached Tab",partition:e.partition||be.guest}),Yt(e.id)}catch(n){console.error("Failed to open detached tab window",n),ze("Could not open the page in a separate window.","error")}}function Tt(){if(ut!==null)return ut;try{const e=localStorage.getItem(On);return ut=e==="1"||e==="true",ut}catch{return ut=!1,!1}}function Fn(e,n,t=null){if(!Tt())return;const o=t?{...t}:{};try{console.log(`[PERF][${e}] ${n}`,o)}catch{}}window.addEventListener("storage",e=>{e.key===On&&(ut=null,window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Tt()).catch(()=>{}))});const se={wppproduction:{id:"wppproduction",name:"WPPProduction",partition:be.wppproduction,color:"#000000",bgColor:"#e2e8f0",label:"W"},vml:{id:"vml",name:"VML",partition:be.vml,color:"#ff0000",bgColor:"#fee2e2",label:"V"},gsk:{id:"gsk",name:"GSK",partition:be.gsk,color:"#f37521",bgColor:"#ffedd5",label:"G"},guest:{id:"guest",name:"Guest",partition:be.guest,color:"#64748b",bgColor:"#f1f5f9",label:"?"}};let me="guest";function Di(){return me}const Mi=ki({state:Et,constants:{AUTH_GATEWAY_HOSTS:Ai,RESOURCE_SERVICE_ORIGIN:Rn,PROFILES:se},showToast:ze,openOverlayModal:at,closeOverlayModal:Qe,renderProfilePillSelect:Xt,resolveCredentialScopeIdForTab:ei,applyProfileSelection:wt,getCurrentProfileId:()=>me,escapeHtml:Ie}),{getAutofillCredentialForTab:Ui,initHttpAuthPrompt:Ni,installCredentialCaptureHooks:Oi,isLikelyAuthPage:Ri,maybeOfferRememberCredentials:Fi,refreshCredentialCacheIfStale:Hi,scheduleCredentialAutofill:Wi,startCredentialCapturePolling:Vi,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi}=Mi;let ct=null,ht=null;const qi=Pi({state:Et,constants:{PROFILES:se,PENDING_EXTENSION_OPEN_STORAGE_KEY:"oneview.pendingExtensionOpenPath",EXTENSION_PIN_STORAGE_KEY:"oneview.browserExtensions.pinned.v1",IS_DEV_APP_BUILD:Lt},escapeHtml:Ie,showToast:ze,openOverlayModal:at,closeOverlayModal:Qe,getActiveTab:(...e)=>ht?.getActiveTab?.(...e)??null,getActiveWebview:(...e)=>ht?.getActiveWebview?.(...e)??null,createTab:(...e)=>ht?.createTab?.(...e),refreshActiveNativeSettingsPage:(...e)=>ct?.refreshActiveNativeSettingsPage?.(...e)??Promise.resolve(),closeSettingsMenu:Eo}),{closeBrowserExtensionPopup:qt,closeBrowserExtensionsMenu:Yi,formatDownloadBytes:Gi,formatDownloadEta:Ki,formatDownloadSpeed:Ji,initDownloadsManager:Xi,initExtensionsManager:Qi,loadManagedDownloadsFromMain:Zi,refreshBrowserExtensionsUi:eo,refreshExtensionsManagerList:Hn}=qi;ht=Bi({state:Et,constants:{PARTITIONS:be,PROFILES:se,LOCAL_WEB_APP_TYPES:zt,WEBVIEW_POOL_MAX:6,WEBVIEW_POOL_KEEPALIVE_MS:12e3,TAB_PREWARM_ENABLED:!0,PREWARM_ALL_PROFILE_PARTITIONS:!1},createNativePageDescriptor:(...e)=>ct?.createNativePageDescriptor?.(...e)??null,ensureNativeSettingsGeneralInfo:(...e)=>ct?.ensureNativeSettingsGeneralInfo?.(...e)??Promise.resolve(),normalizeSettingsSection:(...e)=>ct?.normalizeSettingsSection?.(...e)??"general",renderNativeSettingsPage:(...e)=>ct?.renderNativeSettingsPage?.(...e),closeBrowserExtensionsMenu:Yi,closeBrowserExtensionPopup:qt,refreshBrowserExtensionsUi:eo,refreshTabScrollControls:At,syncProfileSelectionForTab:Po,updateProfileLockUI:bt,perfMark:Fn,shouldRequirePlatformApiForNavigation:_o,getWebviewPlatformApiFlag:Do,setWebviewPlatformApiFlag:Mo,getWebviewPreloadPathCached:$o,startCredentialCapturePolling:Vi,scheduleCredentialAutofill:Wi,installCredentialCaptureHooks:Oi,refreshCredentialCacheIfStale:Hi,getAutofillCredentialForTab:Ui,resolveAssignedProfileIdForTab:Yn,getCredentialScopeIdByPartition:Vn,resolveCredentialScopeIdForTab:ei,maybeOfferRememberCredentials:Fi,syncTabProfileForPage:ko,trackProfileHistory:To,resolveProfileIdForTab:Zn,resolveAssignedProfileId:St,resolveStrictProfileNavigationTarget:Gn,resolveNavigationPartition:pt,applyProfileSelection:wt,openProfilePromptDialog:Io,handleCredentialFieldInteraction:ji,hideCredentialDropdown:zi});const{closeTab:Yt,closeTabsBulk:vt,createTab:Be,createWebviewForTab:to,duplicateTab:no,disposeWebviewRuntime:Wn,getActiveTab:tt,getActiveWebview:et,goToActiveTabHome:io,isInspectableLocalFileTab:oo,navigateTo:yt,navigateToTab:ro,performSearch:kt,startWebviewRuntime:ao,switchRelativeTab:xt,switchTab:je,updateTabTitle:so,updateUrlDisplay:lo,updateUrlDisplayString:Ln,getTabs:Pn}=ht;ct=Li({state:Et,constants:{PROFILES:se,PARTITIONS:be,IS_DEV_APP_BUILD:Lt},escapeHtml:Ie,showToast:ze,isPerfEnabled:Tt,formatDownloadBytes:Gi,formatDownloadSpeed:Ji,formatDownloadEta:Ki,formatHistoryTime:ti,loadManagedDownloadsFromMain:Zi,refreshExtensionsManagerList:Hn,saveProfileHistoryStore:Qt,getActiveTab:tt,updateTabTitle:so,createTab:Be,switchTab:je,navigateTo:yt});const{bindSettingsShortcutsGlobal:co,createNativePageDescriptor:mr,ensureNativeSettingsGeneralInfo:wr,getSettingsTabTitle:gr,initNativeSettingsUi:uo,initSettingsMenu:po,isEditableShortcutTarget:fo,isNativeSettingsTab:hr,normalizeSettingsSection:vr,openSettingsTab:Wt,refreshActiveNativeSettingsPage:mo,renderNativeSettingsPage:br,updateNativeSettingsTabSection:yr}=ct;function wo(){try{return localStorage.getItem("username")==="Guest"}catch{return!1}}function go(e="",n="",t=""){const o=String(t||"").trim().toLowerCase();if(Ht[o])return o;const r=String(n||"").trim().toLowerCase(),u=String(e||"").trim().toLowerCase();try{const h=new URL(String(e||"")),x=`${h.protocol}//${h.host}`.toLowerCase(),k=String(h.pathname||"/").toLowerCase();if(x===Rn&&(k==="/"||k===""))return"synapse";if(x==="http://10.215.56.196:3456")return"contentgen"}catch{}return/content[\s-]*gen/.test(r)||/content[\s-]*gen/.test(u)?"contentgen":r.includes("synapse")?"synapse":""}function Gt(e){const n=ft(e);if(n===be.synapse||n===be.contentgen)return"guest";const t=Object.values(se).find(o=>o.partition===n);return t?t.id:null}function Vn(e){const n=ft(e);return n===be.synapse?"synapse":n===be.contentgen?"contentgen":Gt(n)}function pt(e="",n="",t="",o={}){const r=String(o?.sessionScope||o?.credentialScope||"").trim()||"",u=go(e,t,r);return u&&Ht[u]?Ht[u].partition:ft(n||se[me]?.partition||be.guest)}async function ho(){const e=document.getElementById("view-synapse-link-btn");if(!e||(e.style.display="none",wo()))return;const n=String(localStorage.getItem("emp_id")||"").trim(),t=String(localStorage.getItem("username")||"").trim(),o=/^\d+$/.test(t)?t:"",r=n||o;if(r)try{const u=await fetch(`${Mn}/api/list_of_users`,{signal:AbortSignal.timeout(5e3)});if(!u.ok)throw new Error(`API returned ${u.status}`);const h=await u.json(),x=Array.isArray(h)?h:Array.isArray(h?.users)?h.users:[],k=new Set(x.map(P=>String(P?.emp_id??"").trim()).filter(Boolean));e.style.display=k.has(r)?"flex":"none"}catch(u){console.warn("Could not verify Synapse visibility in view",u),e.style.display="none"}}function vo(e="",n="addressSearchDropdown"){const t=document.getElementById(n);if(!t)return;const o=String(e||"").trim().toLowerCase();if(!o){t.classList.add("hidden"),Oe=[],De=-1;return}const r=le.filter(b=>{const C=String(b.title||"").toLowerCase(),L=String(b.url||"").toLowerCase();return C.includes(o)||L.includes(o)}).map(b=>({type:"tab",id:b.id,title:b.title||"Untitled Tab",url:b.url||"",partition:b.partition}));let u=[];Object.values(Ae).forEach(b=>{Array.isArray(b)&&b.forEach(C=>{const L=String(C.title||"").toLowerCase(),A=String(C.url||"").toLowerCase();if(L.includes(o)||A.includes(o)){const U=u.some(z=>z.url===C.url),H=r.some(z=>z.url===C.url);!U&&!H&&u.push({type:"history",title:C.title||"History Item",url:C.url,partition:C.partition||be.guest})}})}),Oe=[{type:"search",title:e,url:`Search for "${e}"`},...r.slice(0,5),...u.slice(0,15)],De=0;let x="";x+=Mt(Oe[0],0);const k=Oe.filter(b=>b.type==="tab");k.length>0&&(x+='<div class="address-search-group-label">Open Tabs</div>',k.forEach(b=>{const C=Oe.indexOf(b);x+=Mt(b,C)}));const P=Oe.filter(b=>b.type==="history");P.length>0&&(x+='<div class="address-search-group-label">History</div>',P.forEach(b=>{const C=Oe.indexOf(b);x+=Mt(b,C)})),t.innerHTML=x,t.classList.remove("hidden")}function Mt(e,n){const t=n===De;let o=String(e.title||"H").charAt(0).toUpperCase(),r="is-history",u="History";return e.type==="tab"?(r="is-tab",u="Tab"):e.type==="search"&&(r="is-search",u="Search",o="🔍"),`
    <div class="address-search-item ${r} ${t?"is-selected":""}" 
         data-index="${n}">
      <div class="address-search-item-icon">${o}</div>
      <div class="address-search-item-body">
        <span class="address-search-item-title">${Ie(e.title)}</span>
        <span class="address-search-item-url">${Ie(e.url)}</span>
      </div>
      <div class="address-search-item-badge">${u}</div>
    </div>
  `}async function kn(e,n){const t=document.getElementById(e);if(!t)return;if(De<0||De>=Oe.length){kt(t.value);return}const o=Oe[De],r=document.getElementById(n);r&&r.classList.add("hidden"),o.type==="tab"?await je(o.id):o.type==="history"?await ni(o.url,o.partition,o.title):kt(t.value),t.blur()}function Bn(e,n){const t=document.getElementById(e),o=document.getElementById(n);!t||!o||(t.addEventListener("input",()=>{vo(t.value,n)}),t.addEventListener("keydown",r=>{o.classList.contains("hidden")||(r.key==="ArrowDown"?(r.preventDefault(),De=(De+1)%Oe.length,An(n)):r.key==="ArrowUp"?(r.preventDefault(),De=(De-1+Oe.length)%Oe.length,An(n)):r.key==="Enter"?(r.preventDefault(),kn(e,n)):r.key==="Escape"&&o.classList.add("hidden"))}),o.addEventListener("click",r=>{const u=r.target.closest(".address-search-item");if(!u)return;const h=parseInt(u.dataset.index);isNaN(h)||(De=h,kn(e,n))}))}function An(e){const n=document.getElementById(e);n&&n.querySelectorAll(".address-search-item").forEach((t,o)=>{const r=parseInt(t.dataset.index);t.classList.toggle("is-selected",r===De),r===De&&t.scrollIntoView({block:"nearest"})})}function bo(){const e=document.getElementById("googleSearchInput");e&&e.dataset.boundAddressInput!=="1"&&(e.dataset.boundAddressInput="1",e.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdownHome");o&&!o.classList.contains("hidden")||t.key==="Enter"&&kt(e.value)}),Bn("googleSearchInput","addressSearchDropdownHome"));const n=document.getElementById("urlDisplay");n&&n.dataset.boundAddressInput!=="1"&&(n.dataset.boundAddressInput="1",n.addEventListener("focus",()=>{n.select?.()}),n.addEventListener("keydown",t=>{const o=document.getElementById("addressSearchDropdown");if(!(o&&!o.classList.contains("hidden"))){if(t.key==="Enter")t.preventDefault(),kt(n.value),n.blur();else if(t.key==="Escape"){t.preventDefault();const r=tt();lo(r?.url||""),n.blur()}}}),Bn("urlDisplay","addressSearchDropdown"))}function jn(){if(Pt){window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode(),le.length===0?Be():je(Re||le[0].id);return}Pt=!0,console.log("initViewPage called"),Ei().catch(n=>{console.warn("Could not initialize OneView shared storage sync",n)}),ir(),window.api&&typeof window.api.setPerfLoggingEnabled=="function"&&window.api.setPerfLoggingEnabled(Tt()).catch(()=>{}),window.api&&typeof window.api.getPerfLogPath=="function"&&window.api.getPerfLogPath().then(n=>{n?.success&&Fn("perf","log-path",{path:n.path||"",enabled:n.enabled})}).catch(()=>{}),!En&&window.api&&typeof window.api.onCredentialDebugLog=="function"&&(En=!0,window.api.onCredentialDebugLog(n=>{console.log("[OneView][CredentialCapture][MainRelay]",n)})),document.body?.dataset.boundProfileHistorySharedStorage!=="1"&&window.api?.onOneviewSharedStorageUpdated&&(document.body.dataset.boundProfileHistorySharedStorage="1",window.api.onOneviewSharedStorageUpdated(n=>{String(n?.key||"")===jt&&(Qn(n),mo().catch(()=>{}))})),Fo(),Ao(),Bo().catch(()=>{}),jo(),Zt(),Cn(),_i(),document.addEventListener("click",n=>{const t=document.getElementById("addressSearchDropdown"),o=document.getElementById("addressSearchDropdownHome"),r=document.getElementById("urlDisplay"),u=document.getElementById("googleSearchInput");t&&!t.contains(n.target)&&n.target!==r&&t.classList.add("hidden"),o&&!o.contains(n.target)&&n.target!==u&&o.classList.add("hidden");const h=document.getElementById("credentialSelectionDropdown");h&&!h.contains(n.target)&&h.classList.add("hidden")}),document.body.dataset.viewThemeIconObserverBound||(document.body.dataset.viewThemeIconObserverBound="1",new MutationObserver(()=>{Cn()}).observe(document.body,{attributes:!0,attributeFilter:["class"]})),le.length===0?Be():je(Re||le[0].id);const e=document.getElementById("newTabBtn");e&&e.addEventListener("click",()=>{Be()}),Go();try{bo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupViewSearch-err:${n.toString()}`}).catch(()=>{})}try{Ho()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-setupBookmarks-err:${n.toString()}`}).catch(()=>{})}ho().catch(n=>{console.warn("Failed to update Synapse visibility in view",n)});try{qo()}catch(n){window.api.webContentCall("log-error",{key:`viewJS-initBookmarkManager-err:${n.toString()}`}).catch(()=>{})}document.getElementById("browserBack")?.addEventListener("click",()=>{const n=et();if(n&&n.canGoBack()){n.goBack();return}io()}),document.getElementById("browserForward")?.addEventListener("click",()=>{const n=et();n&&n.canGoForward()&&n.goForward()}),document.getElementById("browserReload")?.addEventListener("click",()=>{const n=et();n&&n.reload()}),document.getElementById("browserDetach")?.addEventListener("click",In),document.getElementById("browserDetachHeader")?.addEventListener("click",In),So(),ao(),Jo(),Ni(),Lo(),po(),co(),uo(),Qi(),Xi(),window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode?window.enterSiteSnapStudioMode():window.exitSiteSnapStudioMode()}window.addEventListener("beforeunload",()=>{qt().catch(()=>{}),Wn()});window.addEventListener("teardown-view-system",()=>{console.log("Teardown View System triggered"),qt().catch(()=>{}),Wn();const e=le.map(t=>t.id);vt(e,{isTeardown:!0});const n=document.getElementById("webviews-container");n&&(n.querySelectorAll(".webcontent-pane").forEach(o=>{try{typeof o.remove=="function"&&o.remove()}catch{}}),n.innerHTML=""),le=[],Re=null,Pt=!1});function Ut(e){if(!e||e.isHome)return!1;const n=String(e.url||"").trim(),t=String(e.launchedAppType||"").trim().toLowerCase();return!n||n==="about:blank"||n==="newtab"||It(n)||!/^https?:\/\//i.test(n)?!1:!t||t==="website"}function yo({activateVisibleTab:e=!0}={}){if(!Pt||le.length===0)return;const n=le.filter(u=>!u.isHome&&!Ut(u)).map(u=>u.id);if(n.length>0&&vt(n),!e)return;const t=tt();if(t&&Ut(t)){je(t.id);return}const o=le.find(u=>Ut(u));if(o){je(o.id);return}const r=le.find(u=>u.isHome);if(r){je(r.id);return}if(le.length===0){Be();return}je(le[0].id)}window.addEventListener("ticket-switch-preserve-view",e=>{yo({activateVisibleTab:e?.detail?.activateVisibleTab!==!1})});async function So(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;const e=JSON.parse(localStorage.getItem(Ze.installedApps)||"{}");let n=!1;for(const[t,o]of Object.entries(e)){const r=String(o?.type||"").toLowerCase();if(zt.has(r)&&o?.localPath)try{const u=await window.api.resolveOneviewAppUrl(t,o.localPath);u?.success&&u.url&&o.oneviewUrl!==u.url&&(e[t]={...o,oneviewUrl:u.url},n=!0)}catch{}}n&&localStorage.setItem(Ze.installedApps,JSON.stringify(e))}window.initViewPage=jn;window.closeViewTab=Yt;function Eo(){const e=document.getElementById("settingsBtn");e&&e.classList.remove("is-active")}function Kt(){return{modal:document.getElementById("extensionPromptModal"),title:document.getElementById("extensionPromptTitle"),message:document.getElementById("extensionPromptMessage"),label:document.getElementById("extensionPromptLabel"),input:document.getElementById("extensionPromptInput"),textarea:document.getElementById("extensionPromptTextarea"),form:document.getElementById("extensionPromptForm"),submitBtn:document.getElementById("extensionPromptSubmitBtn"),cancelBtn:document.getElementById("extensionPromptCancelBtn"),closeBtn:document.getElementById("extensionPromptCloseBtn")}}async function xo(e={}){const n=Kt();if(!n.modal||!n.form||!n.input||!n.textarea)return{cancelled:!0,value:""};if(Xe)return{cancelled:!0,value:""};const t=e&&typeof e=="object"?e:{},o=t.multiline===!0,r=t.required!==!1,u=String(t.value||""),h=String(t.title||"Extension Input").trim()||"Extension Input",x=String(t.message||"").trim(),k=String(t.label||"Value").trim()||"Value",P=String(t.submitLabel||"Submit").trim()||"Submit",b=String(t.cancelLabel||"Cancel").trim()||"Cancel",C=String(t.placeholder||"").trim();return n.title.textContent=h,n.message.textContent=x,n.message.classList.toggle("hidden",!x),n.label.textContent=k,n.submitBtn.textContent=P,n.cancelBtn.textContent=b,n.input.classList.toggle("hidden",o),n.textarea.classList.toggle("hidden",!o),n.input.required=!o&&r,n.textarea.required=o&&r,n.input.type=t.password===!0?"password":"text",n.input.placeholder=C,n.textarea.placeholder=C,n.input.value=o?"":u,n.textarea.value=o?u:"",new Promise(L=>{Xe={resolve:L,required:r,multiline:o},at(()=>{n.modal.classList.remove("hidden"),n.modal.setAttribute("aria-hidden","false"),requestAnimationFrame(()=>{(o?n.textarea:n.input).focus(),(o?n.textarea:n.input).select?.()})}).catch(()=>{Xe=null,L({cancelled:!0,value:""})})})}function Tn(e={cancelled:!0,value:""}){const n=Kt();if(!n.modal||!Xe)return;const t=Xe;Xe=null,Qe(()=>{n.modal.classList.add("hidden"),n.modal.setAttribute("aria-hidden","true"),n.form.reset(),n.input.classList.remove("hidden"),n.textarea.classList.add("hidden"),n.input.type="text"}),t.resolve(e)}function Co(){return{modal:document.getElementById("profilePromptModal"),select:document.getElementById("profilePromptSelect"),continueBtn:document.getElementById("profilePromptContinueBtn"),cancelBtn:document.getElementById("profilePromptCancelBtn"),closeBtn:document.getElementById("profilePromptCloseBtn")}}let Nt=null;async function Io(e,n="guest"){const t=Co();if(!t.modal||!t.select)return{cancelled:!0,profileId:n};if(Nt)return{cancelled:!0,profileId:n};let o=n;const r=t.select;r.innerHTML=Object.values(se).map(h=>{const x=String(h.name||"P").charAt(0).toUpperCase();return`
        <div class="profile-big-item ${h.id===o?"active":""}" data-id="${h.id}" role="button" tabindex="0">
          <div class="profile-big-avatar" style="background-color: ${h.color};">
            ${x}
          </div>
          <span class="profile-big-name">${Ie(h.name)}</span>
        </div>
      `}).join("");const u=h=>{o=h,r.querySelectorAll(".profile-big-item").forEach(x=>{x.classList.toggle("active",x.dataset.id===h)})};r.querySelectorAll(".profile-big-item").forEach(h=>{const x=()=>{const k=h.dataset.id;!k||!se[k]||u(k)};h.addEventListener("click",x),h.addEventListener("keydown",k=>{(k.key==="Enter"||k.key===" ")&&(k.preventDefault(),x())}),h.addEventListener("dblclick",()=>{x(),t.continueBtn?.click()})});try{await at(()=>{t.modal.classList.remove("hidden"),t.modal.setAttribute("aria-hidden","false")})}catch{return{cancelled:!0,profileId:n}}return new Promise(h=>{Nt={resolve:h};const x=()=>{Qe(()=>{t.modal.classList.add("hidden"),t.modal.setAttribute("aria-hidden","true")}),t.continueBtn?.removeEventListener("click",k),t.cancelBtn?.removeEventListener("click",P),t.closeBtn?.removeEventListener("click",P),t.modal.removeEventListener("click",b),Nt=null},k=()=>{x(),h({cancelled:!1,profileId:o})},P=()=>{x(),h({cancelled:!0,profileId:n})};t.continueBtn?.addEventListener("click",k),t.cancelBtn?.addEventListener("click",P),t.closeBtn?.addEventListener("click",P);const b=C=>{C.target===t.modal&&P()};t.modal.addEventListener("click",b)})}function Lo(){const e=Kt();if(!e.modal||e.modal.dataset.boundExtensionPrompt==="1")return;e.modal.dataset.boundExtensionPrompt="1",e.form?.addEventListener("submit",t=>{if(t.preventDefault(),!Xe)return;const o=Xe.multiline?e.textarea:e.input,r=String(o?.value||"");if(Xe.required&&!r.trim()){o?.focus();return}Tn({cancelled:!1,value:r})});const n=()=>Tn({cancelled:!0,value:""});e.cancelBtn?.addEventListener("click",n),e.closeBtn?.addEventListener("click",n),e.modal.addEventListener("click",t=>{t.target===e.modal&&n()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&Xe&&!e.modal.classList.contains("hidden")&&(t.preventDefault(),n())})}function zn(){return!!tt()?.lockedProfileId}function bt(e=null){const n=e||tt(),t=!!n?.lockedProfileId,o=document.getElementById("profileBtn");if(o){if(o.classList.toggle("locked",t),t){const r=se[n.lockedProfileId]?.name||"assigned";o.title=`Profile locked to ${r} for this tab`}else o.title="Switch Profile";qn()}}function qn(){const e=zn();document.querySelectorAll(".profile-item[data-id]").forEach(t=>{t.classList.toggle("disabled",e),t.setAttribute("aria-disabled",e?"true":"false")})}function Jt(e){return Gt(e)}function Po(e){const n=Zn(e);!n||!se[n]||me!==n&&wt(n,{bypassLock:!0})}function Xt(e,n,t){const o=document.getElementById(e);o&&(o.innerHTML=Object.values(se).map(r=>`
      <div class="profile-pill-item ${r.id===n?"active":""}" data-id="${r.id}" role="button" tabindex="0">
        <span class="profile-pill-dot" style="background-color:${r.color};"></span>
        <span>${Ie(r.name)}</span>
      </div>
    `).join(""),o.querySelectorAll(".profile-pill-item").forEach(r=>{const u=()=>{const h=r.dataset.id;!h||!se[h]||(o.querySelectorAll(".profile-pill-item").forEach(x=>{x.classList.toggle("active",x.dataset.id===h)}),typeof t=="function"&&t(h))};r.addEventListener("click",u),r.addEventListener("keydown",h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),u())})}))}function wt(e,{bypassLock:n=!1}={}){const t=String(e||"").trim();if(!se[t]){console.warn(`[View] applyProfileSelection: Invalid profile ID "${t}"`);return}if(!n&&zn()){console.log("[View] applyProfileSelection BLOCKED: active tab is locked");return}console.log(`[View] applyProfileSelection: Switching to ${t}`),me=t,localStorage.setItem(Ze.currentProfileId,t),oi(),document.querySelectorAll(".profile-item").forEach(r=>{r.dataset.id===t?r.classList.add("active"):r.classList.remove("active")})}function St(e="",n=""){const t=String(n).toLowerCase(),o=String(e).toLowerCase();let r=o;try{r=decodeURIComponent(o)}catch{r=o}const u=`${t} ${o} ${r}`,h=/\bai\b/.test(t),x=/\b(imagine|empower|production ai|imagine wpp)\b/.test(t),k=u.includes("jira.")||u.includes("jira/")||u.includes("atlassian.net")||u.includes("jira.uhub.biz")||t.includes("jira"),P=t.includes("aem")||t.includes("veeva")||t.includes("gsk")||o.includes("gskinternet.com")||o.includes("gsk-contentlab.veevavault.com")||o.includes("veevavault.com"),b=h||x||o.includes("imagine.wpp.ai")||o.includes("://wpp.ai")||o.includes(".wpp.ai")||u.includes("://wpp.")||u.includes(".wpp.")||u.includes("wpp.com");return k?"vml":P?"gsk":b?"wppproduction":null}function Yn(e,n="",t=""){const o=String(e?.lockedProfileId||"").trim().toLowerCase(),r=St(n,t);return o&&Ri(n,t)?o:r}async function Gn(e,n=null,t="New Tab",o={}){const r=String(n||"").trim(),u=r?Jt(r):null;if(String(e||"").trim().toLowerCase().startsWith("file://"))return{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:pt(e,se.guest.partition,t,o)};const x=St(e,t);if(x&&se[x])return{cancelled:!1,profileId:x,lockedProfileId:x,partition:pt(e,se[x].partition,t,o)};const k=ri(e),P=u&&k.find(b=>b.profileId===u)||k.find(b=>b.profileId===me)||k[0]||null;return P&&se[P.profileId]?{cancelled:!1,profileId:P.profileId,lockedProfileId:P.profileId,partition:pt(e,se[P.profileId].partition,t,o)}:{cancelled:!1,profileId:"guest",lockedProfileId:"guest",partition:pt(e,se.guest.partition,t,o)}}async function ko(e,n,t,o){const r=Yn(e,n,t);if(e.lockedProfileId=r,!r){Re===e.id&&bt(e);return}const u=se[r].partition;if(me!==r&&wt(r,{bypassLock:!0}),e.partition!==u){e.partition=u,o&&!o.isDestroyed?.()&&o.remove();const h=await to(e);Re===e.id&&(bt(e),setTimeout(()=>{h.src=n},10));return}Re===e.id&&bt(e)}function Kn(){return{wppproduction:[],vml:[],gsk:[],guest:[]}}function Jn(e={}){const n=Kn();return Object.keys(n).forEach(t=>{const o=Array.isArray(e?.[t])?e[t]:[];n[t]=o.map(r=>({url:String(r?.url||"").trim(),title:String(r?.title||"Untitled").trim()||"Untitled",visitedAt:r?.visitedAt?Number(r.visitedAt):0})).filter(r=>r.url&&r.url!=="about:blank").slice(0,200)}),n}function Xn(){!window.api||typeof window.api.setOneviewSharedStorage!="function"||window.api.setOneviewSharedStorage(jt,Ae).catch(e=>{console.warn("Could not sync profile history to shared storage",e)})}function Qn(e=null){if(!e||typeof e!="object")return;Ae=Jn(e.value||{});try{localStorage.setItem(Vt,JSON.stringify(Ae))}catch{}!document.getElementById("historyManagerModal")?.classList.contains("hidden")&&si()}async function Bo(){if(!(!window.api||typeof window.api.getOneviewSharedStorage!="function"))try{const e=await window.api.getOneviewSharedStorage(jt);e?.success&&e.entry?Qn(e.entry):Xn()}catch(e){console.warn("Could not hydrate profile history from shared storage",e)}}function Ao(){try{const e=JSON.parse(localStorage.getItem(Vt)||"{}");Ae=Jn(e)}catch{Ae=Kn()}}function Qt(){localStorage.setItem(Vt,JSON.stringify(Ae)),Xn()}function Zn(e){return e&&(e.lockedProfileId||Gt(e.partition))||me}function ei(e){return e&&(Vn(e.partition)||e.lockedProfileId)||me}function To(e,n,t){if(!Ae[e])return;const o=String(n||"").trim();if(!o||o==="about:blank"||o.startsWith("devtools://"))return;const r=String(t||"Untitled").trim()||"Untitled",u=Ae[e]||[],h=u.findIndex(k=>k.url===o),x={url:o,title:r,visitedAt:Date.now()};h===0?u[0]=x:(h>0&&u.splice(h,1),u.unshift(x)),Ae[e]=u.slice(0,200),Qt()}function ti(e){if(!e)return"Unknown Date";try{return new Date(e).toLocaleString()}catch{return""}}function $o(){if(gt!==null)return gt;try{gt=window.api&&typeof window.api.getWebviewPreloadPath=="function"?window.api.getWebviewPreloadPath():""}catch{gt=""}return gt}function _o(e,n={}){const t=String(n?.appType||"").trim().toLowerCase(),o=String(e||"").trim().toLowerCase();return typeof n?.requiresPlatformApi=="boolean"?n.requiresPlatformApi:t&&t!=="website"?!0:t==="website"&&It(o)}function Do(e){return e?.getAttribute("data-platform-api-enabled")==="1"}function Mo(e,n){!e||typeof e.setAttribute!="function"||e.setAttribute("data-platform-api-enabled",n?"1":"0")}function Uo(e=""){const n=String(e).trim();if(!n)return"APP";const t=n.split(/\s+/).filter(Boolean);return t.length===1?t[0].slice(0,3).toUpperCase():t.slice(0,3).map(o=>o[0]).join("").toUpperCase()}function No(e=""){const n=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)","linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)","linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)","linear-gradient(to right, #4facfe 0%, #00f2fe 100%)","linear-gradient(to top, #30cfd0 0%, #330867 100%)"],t=String(e);let o=0;for(let r=0;r<t.length;r+=1)o=(o+t.charCodeAt(r)*(r+1))%n.length;return n[o]}function Oo(e="app"){let n=document.getElementById("view-launch-loader");n?n.style.display="flex":(n=document.createElement("div"),n.id="view-launch-loader",n.style.cssText=["position:fixed","inset:0","z-index:99999","display:flex","flex-direction:column","align-items:center","justify-content:center","background:rgba(15,23,42,0.45)","backdrop-filter:blur(8px)","-webkit-backdrop-filter:blur(8px)"].join(";"),n.innerHTML=`
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
    `,document.body.appendChild(n));const t=n.querySelector("p");return t&&(t.textContent=`Opening ${e||"app"}...`),()=>{n&&(n.style.display="none")}}async function Ro(e){if(!e)return;const t=JSON.parse(localStorage.getItem(Ze.installedApps)||"{}")[e];if(!t){console.warn("Installed app not found:",e);return}const o=t.name||"App",r=Oo(o),u=xi(t);console.log("[OneView Tracking] View launch decision",{appId:e,appName:t?.name||"",appType:t?.type||"",clickTrackingMode:t?.clickTrackingMode||"",trackOnLaunch:t?.trackOnLaunch,oneviewUrl:t?.oneviewUrl||"",hasLocalPath:!!t?.localPath,shouldTrackLaunch:u}),u&&Ci({currentSelectedTicketId:window.currentActiveTicketKey||"",clickedAppName:o});try{if(dn(t)){await Si(t),ze(`Opened "${o}" in a separate window.`,"info");return}const h=()=>tt()?.partition||se[me]?.partition||be.guest,x=async(P,b={})=>{await Be(P,h(),o,null,{hideControls:!0,appType:t.type,trackingAppId:e,trackingAppName:o,bypassPrompt:!0,...b})},k=String(t.type||"").toLowerCase();if(zt.has(k)&&t.localPath){Ln(`Starting ${o}...`);let P=String(t.oneviewUrl||"").trim();if(window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const C=await window.api.resolveOneviewAppUrl(e,t.localPath,"/",h());if(C?.success&&C.url){P=C.url;const L=JSON.parse(localStorage.getItem(Ze.installedApps)||"{}");L[e]&&(L[e]={...L[e],oneviewUrl:P},localStorage.setItem(Ze.installedApps,JSON.stringify(L)))}}const b=["nextjs","next","vite-server"].includes(k);if(P&&It(P)&&b&&(P=""),P&&It(P))await x(P);else{const C=await window.api.launchNextApp(t.localPath,t.type);await x(C)}return}if(t.type==="website"&&t.url){await x(t.url);return}if(t.type==="exe"&&t.localPath){Ln(`Launching ${o}...`);const P=await window.api.launchExe(t.localPath,t.tech);if(P&&P.mode==="embedded"&&P.url){const b=new URLSearchParams;P.token&&b.set("NL_TOKEN",P.token),t.tech&&b.set("TECH",t.tech);const C=String(P.url).split(":")[2];C&&b.set("NL_PORT",C);const L=`${P.url}?${b.toString()}`;await x(L)}else P?.success&&P.mode==="external"?ze(`Opened "${o}" in a separate window.`,"info"):alert(`${o} launched externally. Embedded view is not available for this app.`);return}alert(`Cannot launch "${o}". Missing supported launch configuration.`)}catch(h){if(dn(t)){console.error("Failed to launch external Electron app from view:",h),ze(`Failed to launch "${o}".`,"error");return}console.error("Failed to launch installed app from view:",h),alert(`Failed to launch "${o}": ${h.message||h}`)}finally{r()}}async function ni(e,n=null,t="New Tab",o=!1,r={}){const u=String(e||"").trim();if(!u)return;if(window.isSiteSnapStudioMode||window.parent?.isSiteSnapStudioMode){const H=be.gsk;window.enterSiteSnapStudioMode();const z=Pn(),Z=(z||[]).some(de=>{const Y=String(de.url||"").trim();return Y&&Y!=="about:blank"&&Y!=="newtab"});!z||z.length===0||o||Z?await Be(u,H,t,null,r):await yt(u,H,t,null,r);return}let h=o;u.toLowerCase().startsWith("file://")&&(h=!0);const k=await Gn(u,n,t,r);if(!k||k.cancelled)return;const P=k.partition,b=k.profileId,C=k.lockedProfileId;b&&b!==Di()&&wt(b,{bypassLock:!0});const L=Pn();if(!L||L.length===0){await Be(u,P,t,C,r);return}const A=L.some(H=>{const z=String(H.url||"").trim();return z&&z!=="about:blank"&&z!=="newtab"});if(h||A){await Be(u,P,t,C,r);return}let U=tt();if(!U){const H=L[L.length-1];H&&(await je(H.id),U=H)}if(!U){await Be(u,P,t,C,r);return}await yt(u,P,t,C,r)}window.initViewPage=jn;window.createTab=Be;window.launchInstalledAppFromView=Ro;window.openUrlFromDashboard=ni;function Fo(){const e=localStorage.getItem(Ze.currentProfileId);e&&se[e]?me=e:me="guest",oi();const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");n&&t&&(n.addEventListener("click",async o=>{o.stopPropagation(),t.classList.contains("hidden")?await at(()=>t.classList.remove("hidden")):Qe(()=>t.classList.add("hidden"))}),t.innerHTML=Object.values(se).map(o=>`
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
      `),t.querySelectorAll(".profile-item").forEach(o=>{o.addEventListener("click",async()=>{if(o.dataset.action==="manage-passwords"){Wt("passwords"),Qe(()=>t.classList.add("hidden"));return}const r=o.dataset.id;o.classList.contains("disabled")||(ii(r),Qe(()=>t.classList.add("hidden")))})}),qn())}function ii(e){wt(e)}function oi(){const e=se[me],n=document.getElementById("profileBtn"),t=document.getElementById("profileLabel");n&&t&&(t.textContent=e.label,t.style.color=e.color),bt()}function Ho(){const e=document.querySelector(".bookmarks-grid");e&&e.addEventListener("click",n=>{const t=n.target.closest(".bookmark-edit-btn");if(t){n.preventDefault(),n.stopPropagation();const L=t.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;L&&Yo(L);return}const o=n.target.closest(".bookmark-delete-btn");if(o){n.preventDefault(),n.stopPropagation();const L=o.closest(".bookmark-card.custom-bookmark")?.dataset.bookmarkId;L&&(_e=_e.filter(A=>A.id!==L),ai(),Zt());return}const r=n.target.closest(".bookmark-card");if(!r||r.id==="addBookmarkBtn"||r.classList.contains("add-bookmark-card"))return;const u=r.dataset.url,h=r.dataset.title||"New Tab",x=String(r.dataset.partition||"").trim(),k=String(r.dataset.sessionScope||"").trim(),b=r.dataset.profileId||Jt(r.dataset.partition)||St(u||"",h)||me;if(b!==me&&ii(b),u){const C=pt(u,x||se[b].partition,h,k?{sessionScope:k}:{});yt(u,C,h,St(u||"",h))}})}function mt(e=""){const n=String(e).trim();return n?/^[a-z][a-z0-9+.-]*:\/\//i.test(n)||/^about:/i.test(n)?n:`https://${n}`:""}function Bt(e=""){const n=mt(e);if(!n)return"";try{const t=new URL(n),o=t.pathname.length>1?t.pathname.replace(/\/+$/,"")||"/":t.pathname||"/";return`${t.origin}${o}${t.search}${t.hash}`}catch{return n.replace(/\/+$/,"")}}function ri(e=""){const n=Bt(e);return n?_e.filter(t=>Bt(t.url)===n):[]}function Wo(e="",n=""){const t=ri(e);return n?t.find(o=>String(o.profileId||"").trim().toLowerCase()===n)||null:t[0]||null}function Vo(e=null){return e?String(e.lockedProfileId||"").trim().toLowerCase()||Jt(e.partition)||me||"guest":me||"guest"}function jo(){try{const e=JSON.parse(localStorage.getItem(Nn)||"[]");_e=Array.isArray(e)?e.map(n=>({id:String(n?.id||""),title:String(n?.title||"").trim(),url:mt(n?.url||""),profileId:se[n?.profileId]?n.profileId:"guest"})).filter(n=>n.id&&n.title&&n.url):[]}catch{_e=[]}}function ai(){localStorage.setItem(Nn,JSON.stringify(_e))}function zo({id:e="",title:n="",url:t="",profileId:o="guest"}){const r=mt(t),u=String(n||"").trim()||r,h=se[o]?o:"guest",x=Bt(r);if(!r||!x)return!1;const k=_e.findIndex(b=>e&&b.id===e?!0:Bt(b.url)===x&&String(b.profileId||"guest")===h),P={id:k>=0?_e[k].id:e||`bm-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,title:u,url:r,profileId:h};return k>=0?_e[k]={..._e[k],...P}:_e.unshift(P),k>=0?"updated":"created"}function Zt(){const e=document.querySelector(".bookmarks-grid");if(!e)return;e.querySelectorAll(".bookmark-card.custom-bookmark").forEach(o=>o.remove());const n=_e.map(o=>{const r=se[o.profileId]||se.guest;return`
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
      `}).join(""),t=document.getElementById("addBookmarkBtn");t?t.insertAdjacentHTML("beforebegin",n):e.insertAdjacentHTML("beforeend",n)}function qo(){const e=document.getElementById("addBookmarkBtn"),n=document.getElementById("bookmarkCurrentPageHeaderBtn"),t=document.getElementById("bookmarkModal"),o=document.getElementById("bookmarkModalCloseBtn"),r=document.getElementById("bookmarkForm"),u=document.getElementById("bookmarkTitleInput"),h=document.getElementById("bookmarkUrlInput"),x=t?.querySelector(".password-modal-header h3"),k=document.getElementById("bookmarkSaveBtn");if(!e||!t||!o||!r||!u||!h)return;const P=()=>{Qe(()=>{t.classList.add("hidden"),Ct=null})},b=async({editId:A=null,title:U="",url:H="",profileId:z=me,heading:Z="Add Bookmark",saveLabel:de="Save Bookmark"}={})=>{Ct=A,lt=se[z]?z:me,Xt("bookmarkProfileSelect",lt,Y=>{lt=Y}),x&&(x.textContent=Z),k&&(k.textContent=de),r.reset(),u.value=String(U||""),h.value=String(H||""),await at(()=>t.classList.remove("hidden")),u.value?(u.focus(),u.select()):u.focus()},C=async()=>{await b()},L=async()=>{const A=tt(),U=mt(A?.url||"");if(!A||A.isHome||!U||U==="about:blank"){ze("Open a website tab first to save it as a bookmark.","error");return}const H=Vo(A),z=Wo(U,H);await b({editId:z?.id||null,title:A.title||z?.title||"New Bookmark",url:U,profileId:H,heading:z?"Update Bookmark":"Save Current Site",saveLabel:z?"Update Bookmark":"Save Bookmark"})};e.addEventListener("click",C),e.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await C())}),n?.addEventListener("click",L),n?.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await L())}),o.addEventListener("click",P),t.addEventListener("click",A=>{A.target===t&&P()}),r.addEventListener("submit",A=>{A.preventDefault();const U=String(u.value||"").trim(),H=mt(h.value);if(!U||!H)return;const z=zo({id:Ct,title:U,url:H,profileId:lt||me});z&&(ai(),Zt(),P(),r.reset(),ze(z==="updated"?"Bookmark updated successfully.":"Bookmark saved successfully.","success"))})}async function Yo(e){const n=document.getElementById("bookmarkModal"),t=document.getElementById("bookmarkForm"),o=document.getElementById("bookmarkTitleInput"),r=document.getElementById("bookmarkUrlInput"),u=n?.querySelector(".password-modal-header h3"),h=document.getElementById("bookmarkSaveBtn");if(!n||!t||!o||!r)return;const x=_e.find(k=>k.id===e);x&&(Ct=x.id,lt=x.profileId||me,u&&(u.textContent="Edit Bookmark"),h&&(h.textContent="Update Bookmark"),Xt("bookmarkProfileSelect",lt,k=>{lt=k}),o.value=x.title||"",r.value=x.url||"",await at(()=>n.classList.remove("hidden")),o.focus())}function Go(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;const o=220;n.addEventListener("click",()=>{e.scrollBy({left:-o,behavior:"smooth"})}),t.addEventListener("click",()=>{e.scrollBy({left:o,behavior:"smooth"})}),e.addEventListener("scroll",At),At()}function si(){const e=document.getElementById("historyList"),n=document.getElementById("historyProfileSelect");if(!e||!n)return;const t=Ft||me,o=Ae[t]||[];if(o.length===0){e.innerHTML="<div class='password-meta'>No history for this profile yet.</div>";return}const r=new Date,u=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),h=u-864e5,x={today:[],yesterday:[],older:[]};o.forEach((L,A)=>{const U={...L,originalIndex:A},H=L.visitedAt||0;H>=u?x.today.push(U):H>=h?x.yesterday.push(U):x.older.push(U)});const k=L=>L.toLocaleDateString(void 0,{month:"short",day:"numeric"}),P=`Today - ${k(r)}`,b=`Yesterday - ${k(new Date(h))}`,C=(L,A,U=!1)=>{if(A.length===0)return"";const H=A.map(z=>`
      <div class="history-item" data-index="${z.originalIndex}">
        <div class="history-main">
          <div class="history-title">${Ie(z.title||"Untitled")}</div>
          <div class="history-url">${Ie(z.url||"")}</div>
          <div class="password-meta">${Ie(ti(z.visitedAt))}</div>
        </div>
        <div class="history-actions">
          <button type="button" data-action="open">Open</button>
          <button type="button" data-action="delete">Delete</button>
        </div>
      </div>
    `).join("");return`
      <details class="history-group" ${U?"open":""}>
        <summary class="history-group-title">
          <span>${L}</span>
          <span style="font-weight:400; font-size:11px; opacity:0.7">${A.length}</span>
        </summary>
        <div class="history-group-content">
          ${H}
        </div>
      </details>
    `};e.innerHTML=`
    ${C(P,x.today,x.today.length>0)}
    ${C(b,x.yesterday,!1)}
    ${C("Older",x.older,!1)}
  `,e.querySelectorAll(".history-item").forEach(L=>{L.addEventListener("click",A=>{const U=A.target.closest("button");if(!U)return;const H=Number(L.dataset.index);if(Number.isNaN(H))return;const z=Ae[t]||[],Z=z[H];if(Z){if(U.dataset.action==="delete"){z.splice(H,1),Ae[t]=z,Qt(),si();return}if(U.dataset.action==="open"){const de=se[t]?.partition||be.guest;Be(Z.url,de,Z.title||"History",t)}}})})}async function rt({title:e="Clear Page Cache",message:n="",confirmLabel:t="OK",cancelLabel:o="Cancel",hideCancel:r=!1}={}){const u=document.getElementById("cacheActionModal"),h=document.getElementById("cacheActionTitle"),x=document.getElementById("cacheActionMessage"),k=document.getElementById("cacheActionCloseBtn"),P=document.getElementById("cacheActionCancelBtn"),b=document.getElementById("cacheActionConfirmBtn");return!u||!h||!x||!k||!P||!b?Promise.resolve(window.confirm(n||e)):(h.textContent=e,x.textContent=n,b.textContent=t,P.textContent=o,P.style.display=r?"none":"inline-flex",await at(()=>u.classList.remove("hidden")),new Promise(C=>{const L=()=>{k.removeEventListener("click",A),P.removeEventListener("click",A),b.removeEventListener("click",U),u.removeEventListener("click",H),Qe(()=>u.classList.add("hidden"))},A=()=>{L(),C(!1)},U=()=>{L(),C(!0)},H=z=>{z.target===u&&A()};k.addEventListener("click",A),P.addEventListener("click",A),b.addEventListener("click",U),u.addEventListener("click",H)}))}function At(){const e=document.getElementById("tabsList"),n=document.getElementById("tabsScrollLeft"),t=document.getElementById("tabsScrollRight");if(!e||!n||!t)return;if(!(e.scrollWidth>e.clientWidth+1)){n.classList.add("hidden"),t.classList.add("hidden"),e.scrollLeft=0;return}const r=e.scrollLeft<=1,u=e.scrollLeft+e.clientWidth>=e.scrollWidth-1;n.classList.toggle("hidden",r),t.classList.toggle("hidden",u)}function en(e){if(!e)return null;if(typeof e.getWebContentsId=="function")try{const n=e.getWebContentsId();if(n)return n}catch{}return e._webContent?e._webContent.key||e._webContent.id||null:e.key||e.id||e.getAttribute("key")||e.getAttribute("id")||null}async function Ko(e,n){const t=le.findIndex(r=>r.id===n),o=le[t];if(e==="duplicate-tab"&&o){no(n);return}if(e==="inspect-local-file"&&o){const r=document.getElementById(`webview-${o.id}`),u=en(r);if(!u||!window.api?.toggleWebviewDevTools){ze(Lt?"Inspect is not available for this tab.":"Inspect is not available for this local file tab.","error");return}await window.api.toggleWebviewDevTools(u)||ze(Lt?"Could not open developer tools.":"Could not open developer tools for this local file.","error");return}if(e==="clear-cache"&&o){const r=document.getElementById(`webview-${o.id}`),u=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",h=r&&r.getAttribute("partition")||o.partition||be.guest;if(!u||u==="about:blank"||!await rt({title:"Clear Page Cache",message:`Clear cache and site data for ${u}?`,confirmLabel:"Clear Cache",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewPageCache!="function"){await rt({title:"Action Unavailable",message:"Cache clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const k=await window.api.clearWebviewPageCache(h,u);k?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await rt({title:"Could Not Clear Cache",message:k?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(k){const P=String(k?.message||k||""),b=/No handler registered for 'clear-webview-page-cache'/.test(P)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await rt({title:"Could Not Clear Cache",message:`${P}${b}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-user-data"&&o){const r=document.getElementById(`webview-${o.id}`),u=r&&typeof r.getURL=="function"&&r.getURL()||o.url||"",h=r&&r.getAttribute("partition")||o.partition||be.guest;if(!u||u==="about:blank"||!await rt({title:"Clear User Data",message:`Clear local storage and site data for ${u}?`,confirmLabel:"Clear Data",cancelLabel:"Cancel"}))return;try{if(!window.api||typeof window.api.clearWebviewUserData!="function"){await rt({title:"Action Unavailable",message:"User-data clear API is not available in this app session. Please restart OneView and try again.",confirmLabel:"OK",hideCancel:!0});return}const k=await window.api.clearWebviewUserData(h,u);k?.success?r&&(typeof r.reloadIgnoringCache=="function"?r.reloadIgnoringCache():r.reload()):await rt({title:"Could Not Clear User Data",message:k?.message||"Unknown error",confirmLabel:"OK",hideCancel:!0})}catch(k){const P=String(k?.message||k||""),b=/No handler registered for 'clear-webview-user-data'/.test(P)?" Restart OneView completely so the latest main-process IPC handlers load.":"";await rt({title:"Could Not Clear User Data",message:`${P}${b}`,confirmLabel:"OK",hideCancel:!0})}return}if(e==="clear-all"){vt(le.map(r=>r.id));return}if(e==="clear-right"&&t>=0){vt(le.slice(t+1).map(r=>r.id));return}e==="clear-left"&&t>=0&&vt(le.slice(0,t).map(r=>r.id))}function Jo(){const e=document.querySelector(".tabs-header");e&&e.addEventListener("contextmenu",async n=>{if(n.target.closest(".profile-section"))return;n.preventDefault();const r=n.target.closest(".tab")?.id?.replace("tab-ui-","")||Re||le[0]?.id||null;if(!r)return;Un=r;const u=le.findIndex(L=>L.id===r),h=le[u],x=document.getElementById(`webview-${r}`),k=oo(h,x),P=!!(h&&!h.isHome&&(x&&x.getURL()!=="about:blank"||h.url)),b=u>0?u:0,C=u>=0&&u<le.length-1?le.length-u-1:0;window.api&&typeof window.api.showNativeTabContextMenu=="function"&&await window.api.showNativeTabContextMenu({anchorId:r,x:Math.round(n.x),y:Math.round(n.y),disabled:{clearLeft:b===0,clearRight:C===0,clearCache:!P,clearUserData:!P,inspectLocalFile:!k}})})}function Ot(e){if(!e)return"";const n=String(e.getData("text/uri-list")||"").split(/\r?\n/).map(u=>u.trim()).find(u=>u&&!u.startsWith("#"));if(n&&/^https?:\/\//i.test(n))return n;const o=String(e.getData("text/html")||"").match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);if(o&&/^https?:\/\//i.test(String(o[1]||"").trim()))return String(o[1]||"").trim();const r=String(e.getData("text/plain")||"").trim();return/^https?:\/\//i.test(r)?r:r&&!/\s/.test(r)&&/\./.test(r)?mt(r):""}function Xo(){const e=document.querySelector(".tabs-header");if(!e||e.dataset.dropBound==="1")return;e.dataset.dropBound="1";const n=t=>{e.classList.toggle("is-drop-target",!!t)};e.addEventListener("dragenter",t=>{Ot(t.dataTransfer)&&(t.preventDefault(),n(!0))}),e.addEventListener("dragover",t=>{Ot(t.dataTransfer)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),n(!0))}),e.addEventListener("dragleave",t=>{e.contains(t.relatedTarget)||n(!1)}),e.addEventListener("drop",t=>{const o=Ot(t.dataTransfer);if(n(!1),!o)return;t.preventDefault();const u=t.target.closest(".tab")?.id?.replace("tab-ui-","")||Re,h=le.findIndex(x=>x.id===u);Be(o,null,"New Tab",null,{insertIndex:h>=0?h+1:le.length})})}function Qo(e){const n=document.getElementById("profileBtn"),t=document.getElementById("profileDropdown");!n||!t||!n.contains(e.target)&&!t.contains(e.target)&&!t.classList.contains("hidden")&&Qe(()=>t.classList.add("hidden"))}async function Zo(e){const n=String(e?.action||"");if(!n||n==="__menu_closed__")return;const t=String(e?.anchorId||Un||Re||le[0]?.id||"");t&&await Ko(n,t)}const $n={desktop:{width:1920,height:1080,userAgent:"desktop"},mobile:{width:414,height:896,userAgent:"mobile"},tablet:{width:768,height:1024,userAgent:"tablet"}};async function li(e,n="mobile"){if(!e)throw new Error("No active webview");const t=$n[n]||$n.mobile;if(console.log(`[Viewport] Setting ${n} viewport: ${t.width}x${t.height}`),window.api?.setWebviewBounds){const o=en(e);o&&(console.log(`[Viewport] Triggering native resize to ${t.width}x${t.height} for id: ${o}`),await window.api.setWebviewBounds(o,{width:t.width,height:t.height}))}return window.__oneview_original_webview_dims||(window.__oneview_original_webview_dims={width:e.style.width,height:e.style.height,minWidth:e.style.minWidth,minHeight:e.style.minHeight,maxWidth:e.style.maxWidth,maxHeight:e.style.maxHeight,flex:e.style.flex}),e.style.width=t.width+"px",e.style.height=t.height+"px",e.style.minWidth=t.width+"px",e.style.minHeight=t.height+"px",e.style.maxWidth=t.width+"px",e.style.maxHeight=t.height+"px",e.style.flex="none",console.log(`[Viewport] Resized webview element to ${t.width}x${t.height}`),await e.executeJavaScript(`
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
    `,!0),await new Promise(n=>setTimeout(n,500))}async function tr(e={}){const n=et();if(!n||typeof n.executeJavaScript!="function")throw new Error("Active tab is unavailable");if(typeof n.capturePage!="function")throw new Error("Active tab does not support capture");const t=String(e?.viewport||"desktop").trim().toLowerCase();if(console.log("[Capture] Active webview found",{id:n.id,url:n.getURL?.(),title:n.getTitle?.(),viewport:t,loading:n._webContent?.state?.loading}),t==="mobile"||t==="tablet"){const Y=t==="tablet"?"tablet":"mobile";await li(n,Y),console.log("[Capture] Viewport changed to "+Y+", waiting for page reflow..."),await new Promise(re=>setTimeout(re,300))}const o=5e3,r=Date.now();for(;n._webContent?.state?.loading&&Date.now()-r<o;)console.log("[Capture] Waiting for page to load..."),await new Promise(Y=>setTimeout(Y,200));console.log("[Capture] Page load status:",n._webContent?.state?.loading?"still loading":"loaded");const u=String(e?.mode||"visible").trim().toLowerCase();if(u!=="full"&&u!=="fullpage"){const Y=await n.capturePage(),re=Y?.isEmpty?.()?"":Y.toDataURL();return console.log("[CapturePage] Visible captured. DataUrl length:",re?.length||0),{mode:"visible",dataUrl:re,width:Y?.getSize?.()?.width||0,height:Y?.getSize?.()?.height||0}}const h=await n.executeJavaScript(`
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
    `,!0);Math.max(1,Number(h?.totalWidth||0));let x=Math.max(1,Number(h?.totalHeight||0));Math.max(1,Number(h?.viewportWidth||0));let k=Math.max(1,Number(h?.viewportHeight||0));if(console.log("[FullCapture] Starting capture process..."),console.log("[FullCapture] Initial metrics:",h),await n.executeJavaScript(`
    (() => {
      const style = document.createElement('style');
      style.id = '__oneview_force_auto_scroll__';
      style.textContent = 'html, body, * { scroll-behavior: auto !important; }';
      (document.head || document.documentElement).appendChild(style);
    })();
  `,!0).catch(()=>{}),x>k+100){console.log("[FullCapture] Verifying scroll functionality...");const re=await n.executeJavaScript(`
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
    `,!0).catch(()=>null);console.log("[FullCapture] Verification scroll results:",re);const ye=Number(re?.startY||0),Le=Number(re?.endY||0);if(Le-ye<10)throw new Error("Scroll verification failed: page did not scroll (startY="+ye+", endY="+Le+"). Capture aborted to prevent repeating/empty fallback images.");await n.executeJavaScript(`
      (() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      })();
    `,!0).catch(()=>{})}const P=Math.floor(k*.8),b=Math.ceil(x/P);console.log("[FullCapture] Progressive scroll: "+b+" steps, "+P+"px per step");let C=0;for(let Y=0;Y<b;Y++){C=Math.min(C+P,x),console.log(`[FullCapture] Scrolling host-driven to ${C}px (${Y+1}/${b})`);const re=`
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
    `;await n.executeJavaScript(re,!0).catch(()=>{}),await new Promise(ye=>setTimeout(ye,600))}await n.executeJavaScript(`window.scrollTo({ top: ${x}, left: 0, behavior: 'auto' });`,!0).catch(()=>{}),await new Promise(Y=>setTimeout(Y,800)),await n.executeJavaScript(`
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
  `;await n.executeJavaScript(L,!0).catch(()=>{});let A=0,U=!1;for(;!U&&A<50;)await n.executeJavaScript("(window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)",!0).catch(()=>0)<=5?U=!0:(await n.executeJavaScript(L,!0).catch(()=>{}),await new Promise(re=>setTimeout(re,100)),A++);await n.executeJavaScript(`
    (() => {
      const scrollStyle = document.getElementById('__oneview_force_auto_scroll__');
      if (scrollStyle) scrollStyle.remove();
    })();
  `,!0).catch(()=>{}),console.log("[FullCapture] Progressive scroll and freeze complete, back at top.");const H=Number(e?.wait||0)*1e3,z=200+H;console.log(`[FullCapture] PHASE 2: Scrolling back to top complete. Waiting ${z}ms (Base 0.2s + User ${H}ms) for page to settle live...`),await new Promise(Y=>setTimeout(Y,z));let Z="",de=null;try{console.log("[FullCapture] Calling native one-shot capture..."),de=await n.capturePage({mode:"full",scrollHeight:Math.round(x)}),Z=de?.isEmpty?.()?"":de.toDataURL()}finally{console.log("[FullCapture] Restoring original body and globals..."),await n.executeJavaScript(`
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
      `,!0).catch(()=>{})}if(!Z)throw new Error("Full page capture returned empty image data");return{mode:"full",dataUrl:Z,width:de?.getSize?.()?.width||0,height:de?.getSize?.()?.height||0,tileCount:1}}async function nr(e){const n=String(e?.command||"").trim(),t=String(e?.url||"").trim(),o=String(e?.requestId||"").trim();if(!n)return;if(n==="execute-script"){const b=String(e?.source||"");let C={requestId:o,success:!1,message:"No active tab"};try{const L=et();if(!L||typeof L.executeJavaScript!="function")C={requestId:o,success:!1,message:"Active tab is unavailable"};else{const A=`
          (() => {
            const run = () => {
              ${b}
            };
            return run();
          })();
        `,U=await L.executeJavaScript(A,!0);C={requestId:o,success:!0,result:U}}}catch(L){C={requestId:o,success:!1,message:L?.message||String(L)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(C);return}if(n==="ui-prompt"){let b={requestId:o,success:!1,message:"Prompt request failed"};try{const C=await xo(e?.prompt||{});b={requestId:o,success:!0,result:C}}catch(C){b={requestId:o,success:!1,message:C?.message||String(C)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(n==="capture-page"){let b={requestId:o,success:!1,message:"Capture request failed",key:e?.key||"view:extension-popup"};try{const C=String(e?.options?.mode||"visible").trim().toLowerCase(),L=String(e?.options?.viewport||"desktop").trim().toLowerCase(),A=Number(e?.options?.wait||0);if(console.log("[View] Capturing mode:",C,"viewport:",L,"wait:",A),C==="full"||C==="fullpage"){console.log("[View] Using full-page capture function");const U=await tr({mode:C,viewport:L,wait:A});b={requestId:o,success:!0,result:U,key:e?.key||"view:extension-popup"}}else{const U=et();if(!U||typeof U.capturePage!="function")throw new Error("Active tab does not support capture");if(console.log("[View] Capturing visible area from webview id:",U.id),L==="mobile"||L==="tablet"){const de=L==="tablet"?"tablet":"mobile";await li(U,de),console.log("[View] Viewport changed to "+de+", waiting for page reflow..."),await new Promise(Y=>setTimeout(Y,800))}const H=await U.capturePage(),z=H?.isEmpty?.()?"":H.toDataURL?.();console.log("[View] Visible capture dataUrl length:",z?.length||0);const Z={mode:"visible",dataUrl:z,width:H?.getSize?.()?.width||0,height:H?.getSize?.()?.height||0};(L==="mobile"||L==="tablet")&&await ci(U),b={requestId:o,success:!0,result:Z,key:e?.key||"view:extension-popup"}}}catch(C){console.error("[View] Capture error:",C),b={requestId:o,success:!1,message:C?.message||String(C),key:e?.key||"view:extension-popup"}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(n==="tabs-create"){const b=String(e.url||"").trim(),C=e.requestId;let L=e.partition||null;if(!L&&b.startsWith(`${Ii}://`))try{L=`ext-${new URL(b).host}`}catch{}const A=L?ft(L):"",U=le.find(H=>H.url&&H.url.includes("result.html")&&(!A||ft(H.partition||"")===A));U?(console.log("[View] Reusing existing result tab:",U.id),await ro(U.id,b,L,"Result"),e.active!==!1&&await je(U.id)):await Be(b,L,"Result",null,{active:e.active!==!1,extensionEntryPath:e.entryPath}),C&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:C,success:!0});return}if(n==="tabs-close"){let b={requestId:o,success:!1,message:"Tab not found"};try{const C=String(e?.tabId||"").trim();le.find(A=>A.id===C)?(Yt(C),b={requestId:o,success:!0,result:{id:C,closed:!0}}):b={requestId:o,success:!1,message:"Tab not found"}}catch(C){b={requestId:o,success:!1,message:C?.message||String(C)}}window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand(b);return}if(!t)return;const r=tt(),u=et(),h=r?.partition||se[me]?.partition||be.guest,x=/^file:\/\//i.test(t),k={extensionEntryPath:x?String(e?.entryPath||"").trim():"",extensionActiveContext:{url:String(u?.getURL?.()||r?.url||"").trim(),title:String(u?.getTitle?.()||r?.title||"").trim()},active:e?.active!==!1};if(x){const b=le.find(C=>C.url===t);if(b){await je(b.id),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:b.id,url:t,title:b.title||"New Tab",active:!0}});return}}if(n==="tabs-update"&&r&&!r.isHome&&!r.nativePage){await yt(t,h,"New Tab",null,k),o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:r.id,url:t,title:r.title||"New Tab",active:!0}});return}r?.id;const P=Be(t,h,"New Tab",null,k);o&&window.api?.resolveBrowserExtensionCommand&&await window.api.resolveBrowserExtensionCommand({requestId:o,success:!0,result:{id:P?.id||"",url:t,title:P?.title||"New Tab",active:e?.active!==!1}})}function ir(){xn||(xn=!0,document.addEventListener("click",Qo),document.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey))return;const n=String(e.key||"").toLowerCase();if(!(!(e.key==="Tab"||e.key==="PageUp"||e.key==="PageDown")&&fo(e.target))){if(n==="h"&&!e.shiftKey){e.preventDefault(),Wt("history");return}if(n==="d"&&e.shiftKey){e.preventDefault(),Wt("downloads");return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation(),xt(e.shiftKey?-1:1);return}if(e.key==="PageUp"){e.preventDefault(),e.stopPropagation(),xt(-1);return}e.key==="PageDown"&&(e.preventDefault(),e.stopPropagation(),xt(1))}},!0),window.addEventListener("resize",At),Xo(),window.api&&typeof window.api.onViewTabShortcut=="function"&&window.api.onViewTabShortcut(e=>{const n=Number(e?.direction||0);n&&xt(n<0?-1:1)}),window.api&&typeof window.api.onBrowserExtensionsUpdated=="function"&&window.api.onBrowserExtensionsUpdated(()=>{console.log("Browser extensions updated, refreshing UI..."),Hn().catch(()=>{})}),window.api&&typeof window.api.onNativeTabContextAction=="function"&&window.api.onNativeTabContextAction(e=>{Zo(e).catch(()=>{})}),window.api&&typeof window.api.onBrowserExtensionCommand=="function"&&window.api.onBrowserExtensionCommand(e=>{nr(e).catch(n=>{console.error("Browser extension command failed",n)})}))}let Rt,_n;const Dn=new ResizeObserver(()=>{const e=et();!e||typeof e.syncBounds!="function"||(e.syncBounds(!0),clearInterval(Rt),clearTimeout(_n),Rt=setInterval(()=>{const n=et();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},50),_n=setTimeout(()=>{clearInterval(Rt);const n=et();n&&typeof n.syncBounds=="function"&&n.syncBounds(!0)},350))});(function(){const n=document.getElementById("webviews-container");if(n){Dn.observe(n);return}const t=new MutationObserver(()=>{const o=document.getElementById("webviews-container");o&&(t.disconnect(),Dn.observe(o))});t.observe(document.documentElement,{childList:!0,subtree:!0})})();window.enterSiteSnapStudioMode=function(){document.body.classList.add("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.add("sitesnap-studio-mode");try{window.parent.document.body.classList.add("sitesnap-studio-active")}catch(n){console.error("Failed to set parent active layout",n)}};window.exitSiteSnapStudioMode=function(){document.body.classList.remove("sitesnap-studio-mode");const e=document.querySelector(".view-layout");e&&e.classList.remove("sitesnap-studio-mode");try{window.parent.document.body.classList.remove("sitesnap-studio-active")}catch(n){console.error("Failed to remove parent active layout",n)}};
