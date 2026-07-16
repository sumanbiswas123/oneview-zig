import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{i as F,l as ue}from"./external-exe-DRsy67iY.js";import{A as R,E as pe,I as me,D as fe}from"./app-env-Dw5Rxq_p.js";import{s as we,c as ge,g as Z,f as q}from"./app-update-notifications-DQcYLNxX.js";import{S as j,a as he}from"./app-runtime-CuOCpSBc.js";const Q=pe;let v=[],y=JSON.parse(localStorage.getItem(j.installedApps)||"{}");const ee=new Set(["nextjs","vite","react","angular","html","neutralino","website"]);function ye(e,t){const n=s=>parseInt(String(s).split(/[^0-9]/)[0])||0,i=String(e).split(".").map(n),a=String(t).split(".").map(n);for(let s=0;s<Math.max(i.length,a.length);s++){const d=i[s]||0,m=a[s]||0;if(d>m)return!0;if(d<m)return!1}return!1}function W(e=""){return String(e||"").trim().toLowerCase()}function te(e={}){const t=W(e?.type),n=W(e?.installFlow||e?.installMode||e?.distribution||e?.packageType),i=String(e?.releaseUrl||e?.url||"").trim().toLowerCase(),a=i&&i.split("/").pop()||"",s=a.endsWith(".exe")&&(a.includes("oneview-setup")||a.includes("-setup-")||a.includes("installer")||a.includes("-setup."));return!!e?.systemWideInstall||t==="installer"||t==="oneview-installer"||n==="oneview-installer"||n==="managed-installer"||n==="nsis"||s}function ve(e={}){return!!e?.managedByOneviewInstaller||W(e?.installFlow)==="oneview-installer"||te(e)}function be(e=""){return String(e||"").trim().replace(/[<>:"/\\|?*\x00-\x1f]+/g,"-").replace(/\s+/g," ").replace(/[. ]+$/g,"").slice(0,80)}function xe(e,t={}){const n=be(t?.oneviewInstallDirName||t?.installDirName||t?.name||t?.id)||"Installed App";return`${e}/installed/${n}`}function Ie(e={}){return String(e?.oneviewManifestName||e?.installManifestName||"oneview-install.json").trim()||"oneview-install.json"}function ne(e={}){const t=String(e?.type||e?.runtime||"").trim().toLowerCase();return t==="oneview-extension"?"extension":t==="website"?"website":"app"}function Ee(e={}){const t=ne(e);return t==="extension"?"Extension":t==="website"?"Web App":"App"}function Se(e={}){return`<span class="app-kind-badge app-kind-badge-${ne(e)}">${Ee(e)}</span>`}const Ae=3e4,_=`
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M8 16H3v5"></path>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M16 8h5V3"></path>
  </svg>
`;window.activeDownloads=window.activeDownloads||{};window.__appStoreState=window.__appStoreState||{userInstallationsCache:{},userInstallationsFetchedAt:0,userInstallationsPromise:null,renderNonce:0,searchKeydownBound:!1,notificationOutsideClickBound:!1,systemUpdateCheckPromise:null};function $(){return window.__appStoreState}function ie(){try{return JSON.parse(localStorage.getItem(j.installedApps)||"{}")}catch{return{}}}function J(e){y=e,localStorage.setItem(j.installedApps,JSON.stringify(e))}function Y(e,t){if(!e)return;const n=$(),i={...n.userInstallationsCache||{}};t?i[e]=!0:delete i[e],n.userInstallationsCache=i,n.userInstallationsFetchedAt=Date.now()}function Ce(){const e=$();e.userInstallationsFetchedAt=0,e.userInstallationsPromise=null}async function ke({force:e=!1}={}){const t=$(),n=Date.now();if(!e&&t.userInstallationsFetchedAt&&n-t.userInstallationsFetchedAt<Ae)return t.userInstallationsCache||{};if(!e&&t.userInstallationsPromise)return t.userInstallationsPromise;const i=String(localStorage.getItem("username")||"").trim();return i?(t.userInstallationsPromise=(async()=>{try{const a=await fetch(`${R}/api/user_data/${i}`,{signal:AbortSignal.timeout(8e3)});if(!a.ok)throw new Error(`User installations request failed with ${a.status}`);const s=await a.json();return t.userInstallationsCache=s.installations||{},t.userInstallationsFetchedAt=Date.now(),t.userInstallationsCache}catch(a){return console.error("Failed to fetch user installations",a),t.userInstallationsCache||{}}finally{t.userInstallationsPromise=null}})(),t.userInstallationsPromise):(t.userInstallationsCache={},t.userInstallationsFetchedAt=n,{})}function Me(){if(document.getElementById("customModal"))return;const e=document.createElement("div");e.id="customModal",e.className="custom-modal-overlay",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","customModalTitle"),e.setAttribute("aria-describedby","customModalMessage"),e.innerHTML=`
    <div class="custom-modal-glass">
      <button id="customModalClose" class="custom-modal-close" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="modal-icon-wrap" id="customModalIconWrap" aria-hidden="true">
        <div class="modal-icon" id="customModalIcon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <circle cx="12" cy="16" r="1"></circle>
          </svg>
        </div>
      </div>
      <h3 id="customModalTitle" class="modal-title">Confirmation</h3>
      <p id="customModalMessage" class="modal-message">Are you sure you want to proceed?</p>
      <p id="customModalHint" class="modal-hint"></p>
      <div class="custom-modal-actions">
        <button id="customModalCancel" class="modal-btn ghost">Cancel</button>
        <button id="customModalConfirm" class="modal-btn primary">Confirm</button>
      </div>
    </div>
  `,document.body.appendChild(e)}function ae(){Me(),le(),Ue(),De(),$e(),Ne(),Pe(),Le(),Be(),window.appStoreInitialized=!0}async function Le(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;let e=!1;const t=JSON.parse(localStorage.getItem(j.installedApps)||"{}"),n=Object.entries(t);for(const[i,a]of n){const s=String(a?.type||"").toLowerCase();if(ee.has(s)&&a?.localPath)try{const d=await window.api.resolveOneviewAppUrl(i,a.localPath);d?.success&&d.url&&a.oneviewUrl!==d.url&&(t[i]={...a,oneviewUrl:d.url},e=!0)}catch{}}e&&J(t)}document.addEventListener("DOMContentLoaded",()=>{ae()});window.initAppStore=ae;function Pe(){const e=document.getElementById("createDevProjectBtn");if(!e||(e.style.display="none",!me)||localStorage.getItem("userMaster")!=="true")return;const t=String(localStorage.getItem("emp_id")||localStorage.getItem("username")||"").trim(),n=String(localStorage.getItem("resourceName")||"").trim();fetch(fe).then(i=>i.json()).then(i=>{i.some(s=>String(s.id).trim()===t&&String(s.name).trim()===n)||console.info("Dev project entry visible because this is a dev build; user is not on remote allow-list.")}).catch(console.warn),e.addEventListener("click",()=>{if(typeof window.loadDevProjectStudio=="function"){window.loadDevProjectStudio();return}window.location.href="../dev-project/dev-project.html"})}window.api&&window.api.on&&window.api.on("update-status",e=>{!e||!e.status||(e.status==="available"&&C({title:"OneView Update",message:`v${e.version} is available and downloading.`,icon:"UP"}),e.status==="downloaded"&&C({title:"OneView Update",message:`v${e.version} downloaded. Restart from Dashboard to install.`,icon:"OK"}),e.status==="error"&&C({title:"OneView Update",message:e.error||"Update failed.",icon:"!"}))});function C({title:e,message:t,icon:n,persist:i=!0}){let a=document.getElementById("toastContainer");a||(a=document.createElement("div"),a.id="toastContainer",a.style.cssText=`
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      max-width: 350px;
    `,document.body.appendChild(a));const s=document.createElement("div");s.className="toast-notification",s.style.cssText=`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease;
  `,s.innerHTML=`
    <div class="toast-icon" style="flex-shrink: 0;">${n||"🔔"}</div>
    <div class="toast-content" style="flex: 1;">
      <div class="toast-title" style="font-weight: 600; font-size: 14px; color: #1e293b;">${e}</div>
      <div class="toast-msg" style="font-size: 13px; color: #64748b; margin-top: 2px;">${t}</div>
    </div>
    <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#999; cursor:pointer; font-size: 18px; padding: 4px;">✕</button>
  `,a.appendChild(s),i&&oe({title:e,message:t,icon:n,time:new Date().toISOString()}),setTimeout(()=>{s.parentElement&&(s.style.opacity="0",s.style.transform="translateX(100px)",s.style.transition="all 0.3s ease",setTimeout(()=>s.remove(),300))},5e3)}function oe(e){we(e),K()}function se(){const e=document.getElementById("notifList");if(!e)return;const t=Z();if(t.length===0){e.innerHTML='<div class="empty-notifs">No notifications</div>';return}e.innerHTML=t.map(n=>`
        <div class="notif-item">
            <div style="font-size:18px">${n.icon||"🔔"}</div>
            <div style="flex:1">
                <div style="font-weight:600; color:var(--text-main)">${n.title}</div>
                <div style="color:var(--text-muted)">${n.message}</div>
                <div class="notif-time">${new Date(n.time).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
            </div>
        </div>
    `).join("")}window.clearNotifications=()=>{ge(),se();const e=document.getElementById("notification-badge");e&&(e.style.display="none")};function K(){const e=Z(),t=document.getElementById("notification-badge");t&&e.length>0?t.style.display="block":t&&(t.style.display="none")}window.syncInstallationToDB=function(e){try{const t=localStorage.getItem("username")||"",n=parseInt(t,10);if(!isNaN(n)){const i={emp_id:n,installation:{[e]:!0}};fetch(`${R}/api/send-user-installation-data`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then(a=>{a.ok?console.log("Synced DB for",e):console.warn("Failed to sync installation",a.status)}).catch(a=>{console.error("Error syncing DB:",a)})}}catch(t){console.error("Error preparing installation payload:",t)}Y(e,!0),k(v)};async function Be(){const e=$();return e.systemUpdateCheckPromise||(e.systemUpdateCheckPromise=(async()=>{if(y=ie(),!v||v.length===0)try{const n=await fetch(Q,{signal:AbortSignal.timeout(8e3)});n.ok&&(v=q(await n.json()))}catch(n){console.warn("Could not fetch apps for update check",n)}Object.keys(y).map(n=>{const i=y[n],a=v.find(s=>s.id===n);return!a||!i?.version||!a.version||a.version===i.version?null:a}).filter(Boolean).forEach(n=>{C({title:`${n.name} Update`,message:`v${n.version} is available.`,icon:"UP",persist:!1}),oe({title:`${n.name} Update`,message:`v${n.version} is available.`,icon:"UP",time:new Date().toISOString(),dedupeKey:`app-update:${n.id}:${n.version}`,replaceKey:`app-update:${n.id}`})})})().finally(()=>{e.systemUpdateCheckPromise=null})),e.systemUpdateCheckPromise}function $e(){const e=document.getElementById("notifBtn"),t=document.getElementById("notifPopover"),n=document.getElementById("notifBadge");if(!e||!t||!n){K();return}e.dataset.boundClick!=="1"&&(e.dataset.boundClick="1",e.addEventListener("click",a=>{a.stopPropagation();const s=document.getElementById("notifPopover"),d=document.getElementById("notifBadge");s&&(s.classList.toggle("active"),s.classList.contains("active")&&(se(),d&&(d.style.display="none")))}));const i=$();i.notificationOutsideClickBound||(i.notificationOutsideClickBound=!0,document.addEventListener("click",a=>{const s=document.getElementById("notifPopover"),d=document.getElementById("notifBtn");!s||!d||!s.contains(a.target)&&!d.contains(a.target)&&s.classList.remove("active")})),K()}async function le(){const e=document.getElementById("appsGridAvailable"),t=document.getElementById("appsGridInstalled");try{const n=await fetch(Q,{signal:AbortSignal.timeout(8e3)});if(!n.ok)throw new Error("Network response was not ok");const i=await n.json();v=q(i),await k(v)}catch(n){console.error("Error fetching apps:",n);const i=`
            <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <h3>Connection Error</h3>
                <p>Could not load the app directory.</p>
                <button onclick="window.fetchApps()" class="btn-install" style="width: auto; margin-top: 20px;">Retry</button>
            </div>
        `;e&&(e.innerHTML=i),t&&(t.innerHTML=i)}}async function k(e){const t=document.getElementById("appsGridAvailable"),n=document.getElementById("appsGridInstalled");if(!t||!n)return;const i=$(),a=++i.renderNonce;t.innerHTML="",n.innerHTML="";const s=await ke();if(a!==i.renderNonce)return;y=ie();const d=q(Array.isArray(e)?e:v).sort((o,f)=>(o.name||"").toLowerCase().localeCompare((f.name||"").toLowerCase())),m=[],c=[];d.forEach(o=>{const f=!!y[o.id],E=!!s[o.id];f&&E?c.push(o):m.push(o)});const w=(o,f)=>{const E=!!y[o.id],h=!!s[o.id],U=E,N=f<10?f*35:0,L=document.createElement("div");L.className=`app-card ${U?"is-installed":"is-store"}`,N>0&&(L.style.animation=`fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards ${N}ms`);const P=o.iconUrl?`<img src="${o.iconUrl}" class="app-icon app-icon-image" alt="${o.name}" />`:`<div class="app-icon app-icon-fallback">${o.icon||"?"}</div>`;let r=!1;const b=v.find(x=>x.id===o.id);E&&b&&b.version&&y[o.id]?.version&&(r=b.version!==y[o.id].version);let p="";if(E&&h)if(window.activeDownloads[o.id]){const x=window.activeDownloads[o.id];p=`
        <button class="btn-icon delete" disabled title="Update in progress">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <button class="btn-icon update is-busy" id="btn-${o.id}" disabled title="${x.label}">
          ${_}
        </button>
      `}else p=`
        <button class="btn-icon delete" id="btn-${o.id}" onclick="uninstallApp('${o.id}')" title="Uninstall">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        ${r?`
        <button class="btn-icon update" onclick="updateApp('${o.id}')" title="Update Available">
          ${_}
        </button>`:""}
      `;else if(E&&!h)p=`
        <button class="btn-install" onclick="syncInstallationToDB('${o.id}')">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v12"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            </svg>
            Sync Installation
          </span>
        </button>
      `;else if(window.activeDownloads[o.id]){const x=window.activeDownloads[o.id];p=`
        <button class="btn-install" id="btn-${o.id}" disabled style="opacity:0.7;">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              style="animation:spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            ${x.label}
          </span>
        </button>
      `}else p=`
        <button class="btn-install" id="btn-${o.id}" onclick="handleAppAction('${o.id}')">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Get
          </span>
        </button>
      `;const S=U?`Installed: v${y[o.id]?.version||"1.0.0"}`:`v${o.version}`;return L.innerHTML=`
      <div class="app-card-top">
        ${P}
        <div class="app-meta">
          <div class="app-name-row">
            <h3 class="app-name">${o.name}</h3>
            <div class="app-card-tags">
              ${Se(o)}
            </div>
          </div>
          <div class="app-meta-row">
            <span class="app-channel">
              ${String(o.channel||"App").toUpperCase()==="EDA"?"eDA":o.channel||"App"}
            </span>
          </div>
        </div>
      </div>
      <p class="app-desc app-desc-unified">${o.description}</p>
      <div class="app-card-bottom">
        <span class="version-badge" style="
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--primary);
        ">
          ${S}
        </span>
        <div class="app-actions">
          ${p}
        </div>
      </div>
    `,L},g=document.createDocumentFragment(),l=document.createDocumentFragment();m.forEach((o,f)=>{g.appendChild(w(o,f))}),c.forEach((o,f)=>{l.appendChild(w(o,f))}),m.length===0?t.innerHTML='<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding:40px;">All available apps are installed!</div>':t.appendChild(g),c.length===0?n.innerHTML=`<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding:40px;">You haven't installed any apps yet.</div>`:n.appendChild(l)}function Ue(){const e=document.querySelectorAll(".filter-btn[data-cat]");e.forEach(t=>{t.dataset.boundClick!=="1"&&(t.dataset.boundClick="1",t.addEventListener("click",n=>{e.forEach(s=>s.classList.remove("active"));const i=n.currentTarget;i.classList.add("active");const a=i.dataset.cat;if(Te(a),a==="all")k(v);else{const s=v.filter(d=>d.channel&&d.channel.toLowerCase()===a.toLowerCase());k(s)}}))})}function De(){const e=document.getElementById("searchModal"),t=document.getElementById("searchInput"),n=document.getElementById("searchTrigger"),i=document.getElementById("searchResults"),a=document.getElementById("closeSearchBtn");if(!e||!t||!i||!a)return;const s=()=>{e.classList.add("active"),t.focus()},d=()=>{e.classList.remove("active"),t.value="",i.innerHTML=""};n&&n.dataset.boundClick!=="1"&&(n.dataset.boundClick="1",n.addEventListener("click",s)),a.dataset.boundClick!=="1"&&(a.dataset.boundClick="1",a.addEventListener("click",d));const m=$();m.searchKeydownBound||(m.searchKeydownBound=!0,document.addEventListener("keydown",c=>{const w=document.getElementById("searchModal"),g=document.getElementById("searchInput"),l=document.getElementById("searchResults");!w||!g||!l||((c.ctrlKey||c.metaKey)&&c.key==="k"&&(c.preventDefault(),w.classList.contains("active")?(w.classList.remove("active"),g.value="",l.innerHTML=""):(w.classList.add("active"),g.focus())),c.key==="Escape"&&(w.classList.remove("active"),g.value="",l.innerHTML=""))})),e.dataset.boundClick!=="1"&&(e.dataset.boundClick="1",e.addEventListener("click",c=>{c.target===e&&d()})),t.dataset.boundInput!=="1"&&(t.dataset.boundInput="1",t.addEventListener("input",c=>{const w=c.target.value.toLowerCase();if(w.length<1){i.innerHTML="";return}const g=v.filter(l=>l.name.toLowerCase().includes(w)||l.author.toLowerCase().includes(w)||l.channel.toLowerCase().includes(w));if(g.length===0){i.innerHTML='<div style="padding:20px; text-align:center; color:var(--text-muted)">No results found</div>';return}i.innerHTML=g.map(l=>`
            <div class="search-result-row" onclick="handleSearchSelect('${l.id}')" style="
                display:flex; align-items:center; gap:16px; padding:12px;
                cursor:pointer; border-radius:12px; transition:bg 0.2s;
            " onmouseover="this.style.background='rgba(0,0,0,0.03)'" onmouseout="this.style.background='transparent'">
                <div style="font-weight:600; color:var(--text-main)">${l.name}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-left:auto">${l.channel}</div>
            </div>
        `).join("")}))}window.fetchApps=le;let H=null,M=null,G=null;function Ne(){const e=document.getElementById("customModal");if(!e){console.error("Custom Modal element not found in DOM");return}e.onclick=t=>{const n=t.target;if(n.id==="customModalClose"||n.closest("#customModalClose")||n.id==="customModalCancel"||n.closest("#customModalCancel")){console.log("Modal: Cancel Clicked"),t.stopPropagation(),D(!1);return}if(n.id==="customModalConfirm"||n.closest("#customModalConfirm")){console.log("Modal: Confirm Clicked"),t.stopPropagation(),D(!0);return}n===e&&(console.log("Modal: Overlay Clicked"),D(!1))},console.log("Custom Modal Setup Complete via Delegation")}function X({title:e,message:t,type:n="normal",confirmText:i="Confirm",hint:a=""}){return new Promise(s=>{H=s;const d=document.getElementById("customModal"),m=document.getElementById("customModalTitle"),c=document.getElementById("customModalMessage"),w=document.getElementById("customModalHint"),g=document.getElementById("customModalIcon"),l=document.getElementById("customModalCancel"),o=document.getElementById("customModalConfirm");if(!d||!m||!c||!o||!l){s(window.confirm(t||e||"Are you sure?"));return}M&&(document.removeEventListener("keydown",M),M=null),G=document.activeElement,m.textContent=e,c.textContent=t,w&&(w.textContent=a),o.textContent=i,d.classList.toggle("modal-danger",n==="danger"),o.className="modal-btn",n==="danger"?o.classList.add("danger"):o.classList.add("primary"),g&&(g.innerHTML=n==="danger"?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><circle cx="12" cy="16" r="1"></circle></svg>'),M=f=>{if(d.classList.contains("active")){if(f.key==="Escape")f.preventDefault(),D(!1);else if(f.key==="Enter"){const h=(f.target&&f.target.tagName?f.target.tagName:"")==="BUTTON";(f.target===o||!h)&&(f.preventDefault(),D(!0))}}},document.addEventListener("keydown",M),d.classList.add("active"),requestAnimationFrame(()=>o.focus())})}function D(e){const t=document.getElementById("customModal");if(!t)return;t.classList.remove("active"),t.classList.remove("modal-danger"),M&&(document.removeEventListener("keydown",M),M=null),H&&(H(e),H=null);const n=G;G=null,n&&typeof n.focus=="function"&&requestAnimationFrame(()=>n.focus())}window.launchAppAttr=e=>{const t=v.find(n=>n.id===e);t&&de(t)};window.uninstallApp=async e=>{const t=v.find(m=>m.id===e)||y[e],n=y[e]||t;if(!t){console.error("App not found for uninstall:",e);return}const i=document.getElementById(`btn-${e}`),a=i?i.innerHTML:null,s=i?i.style.opacity:"1";i&&(i.classList.contains("btn-icon")?i.innerHTML=`
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4444" stroke-width="2.5" style="animation: spin 1.2s linear infinite;">
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M8 16H3v5"></path>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M16 8h5V3"></path>
        </svg>
      `:i.innerHTML=`
        <span style="display:flex; align-items:center; justify-content:center; gap:8px; color: #ff4444; font-weight: 600;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1.2s linear infinite;">
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M16 8h5V3"></path>
            </svg>
            Uninstalling...
        </span>
      `,i.disabled=!0,i.style.opacity="0.9");const d=await X({title:"Uninstall App",message:`Are you sure you want to uninstall ${t.name}? This will remove it from your device.`,type:"danger",confirmText:"Uninstall",hint:"This action cannot be undone"});if(!d){i&&(i.innerHTML=a,i.disabled=!1,i.style.opacity=s);return}if(d){const m=[],c=String(n?.id||"").trim().toLowerCase()==="presentationbuilder"||F(n),w=ve(n),g=c?{mode:"presentationbuilder"}:void 0;C({title:"Uninstalling",message:`Removing ${t.name}...`,icon:"🗑️",persist:!1});try{if(n.type==="oneview-extension"&&window.api?.removeBrowserExtension&&await window.api.removeBrowserExtension({path:n.localPath}),n.type==="nextjs"&&window.api?.killNextApp?await window.api.killNextApp():n.type==="exe"&&window.api?.killExe&&await window.api.killExe(c?{mode:"presentationbuilder",exePath:n.localPath}:{exePath:n.localPath}),w&&n.uninstallPath&&window.api?.uninstallManagedWindowsApp){const l=await window.api.uninstallManagedWindowsApp({uninstallPath:n.uninstallPath,installDir:n.installDir||"",manifestName:n.manifestName||"",appExePath:n.localPath||"",silent:!0,extraArgs:Array.isArray(n.uninstallArgs)?n.uninstallArgs:[]});l?.success||m.push(l?.message||"Could not uninstall the app.")}}catch(l){console.warn("Failed to stop app process before uninstall:",l)}if(!w&&n.localPath&&window.api?.deletePath)try{const l=await window.api.deletePath(n.localPath,g);l?.success||m.push(l?.message||"Could not remove app files.")}catch(l){m.push(l.message||"Could not remove app files.")}if(n.packagePath&&window.api?.deletePath)try{const l=await window.api.deletePath(n.packagePath,g);l?.success||m.push(l?.message||"Could not remove downloaded package.")}catch(l){m.push(l.message||"Could not remove downloaded package.")}if(m.length>0){if(!m.some(o=>o.toLowerCase().includes("not found")||o.toLowerCase().includes("enoent")||o.toLowerCase().includes("does not exist"))){C({title:"Uninstall Failed",message:m[0],icon:"⚠️"}),k(v);return}console.log("App files already gone, removing ghost entry from state.")}delete y[e],J(y),Y(e,!1),Ce();try{const l=localStorage.getItem("username")||"",o=parseInt(l,10);if(!isNaN(o)){const f=t.id,E={emp_id:o,installation:{[f]:!1}};fetch(`${R}/api/send-user-installation-data`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(E)}).then(h=>{h.ok?console.log("Successfully sent installation data for",t.name):console.warn("Failed to send installation data",h.status)}).catch(h=>{console.error("Error sending installation data:",h)})}}catch(l){console.error("Error preparing installation payload:",l)}k(v),typeof window.loadMiniInstalledApps=="function"&&window.loadMiniInstalledApps(),C({title:"App Uninstalled",message:`${t.name} has been removed.`,icon:"🗑️"})}};window.updateApp=async e=>{const t=v.find(i=>i.id===e)||y[e];if(!t){console.error("App not found for update:",e);return}if(await X({title:"Update Available",message:`A new version of ${t.name} is available. Update now?`,type:"normal",confirmText:"Update"}))try{await re(t,{isUpdate:!0})}catch(i){console.error("Update flow failed to start:",i),C({title:"Update Failed",message:i?.message||`Could not start update for ${t.name}.`,icon:"⚠️"})}};window.handleAppAction=e=>{const t=v.find(n=>n.id===e);t&&(y[e]?de(t):re(t))};async function re(e,t={}){const n=window.activeDownloads[e.id];if(n){const r=Number(n.startedAt||0);if(r>0&&Date.now()-r>120*1e3)delete window.activeDownloads[e.id];else{C({title:"Update In Progress",message:n.label||`${e.name} is already updating.`,icon:"UP",persist:!1}),k(v);return}}const i=t?.isUpdate===!0,a=y[e.id]||null,s=i?"Updating...":"Installing...",d=String(a?.id||e?.id||"").trim().toLowerCase()==="presentationbuilder"||F(a||e),m=d?{mode:"presentationbuilder"}:void 0;window.activeDownloads[e.id]={label:s,startedAt:Date.now()};const c=(r,b=!1)=>{window.activeDownloads[e.id]&&(window.activeDownloads[e.id].label=r);const p=document.getElementById(`btn-${e.id}`);if(p){const S=p.classList.contains("btn-icon");b?(S?(p.innerHTML=_,p.title=r):p.innerHTML=`<span>${r}</span>`,p.disabled=!1,p.style.opacity="1"):(S?(p.innerHTML=_,p.title=r):p.innerHTML=`
            <span style="display:flex; align-items:center; justify-content:center; gap:8px">
                <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                ${r}
            </span>
          `,p.disabled=!0,p.style.opacity="0.7")}};c(s);const w=e["oneview-version"]||e.oneviewVersion||e.oneViewVersion;if(w)try{const r=await window.api.getAppVersion();if(ye(w,r)){delete window.activeDownloads[e.id],c("Retry",!0);const x=((await window.api.getCurrentUpdateStatus())?.state||{}).status==="downloaded";await X({title:"Update Available",message:`Current version: ${r}. Please update to ${w} or higher.`,confirmText:x?"Install Now":"Check for Updates",type:"normal",hint:x?"An update is ready to install.":"A newer version of OneView is required."})&&(x?window.api.installUpdate():window.api.checkForUpdates());return}}catch(r){console.warn("Failed to check OneView version compatibility:",r)}k(v);let g="";try{window.api&&typeof window.api.getAppsSecretRoot=="function"&&(g=await window.api.getAppsSecretRoot())}catch(r){console.error("Could not resolve apps root path",r)}if(!g){delete window.activeDownloads[e.id],c("Retry",!0),alert("Could not resolve application storage path.");return}let l="";const o=!!e?.systemWideInstall;if(o){try{window.api&&typeof window.api.getLocalAppDataPath=="function"&&(l=await window.api.getLocalAppDataPath())}catch(r){console.warn("Could not resolve localAppData path",r)}l||(l=g)}const f=e.releaseUrl&&e.releaseUrl.endsWith(".zip"),E=e.releaseUrl?e.releaseUrl.split("/").pop():`${e.id}.zip`,h=`${g}/${E}`,U=String(e.sha256||"").trim().toLowerCase(),N=/^[a-f0-9]{64}$/.test(U);c("Downloading... 0%");const L=r=>`${(r/(1024*1024)).toFixed(1)} MB`;let P=null;window.api&&typeof window.api.onDownloadProgress=="function"&&(P=window.api.onDownloadProgress(r=>{if(!r||r.targetPath!==h)return;const{progress:b,receivedBytes:p,totalBytes:S}=r,x=typeof b=="number"?`${b}%`:`${L(p||0)}${S?` / ${L(S)}`:""}`;c(`Downloading... ${x}`)})),window.api.downloadFile(e.releaseUrl,h).then(async()=>{if(P&&P(),N&&window.api&&typeof window.api.verifyFileSha256=="function"){const u=await window.api.verifyFileSha256(h,U);if(!u?.success||!u.matches){try{window.api?.deletePath&&await window.api.deletePath(h)}catch{}delete window.activeDownloads[e.id],c("Retry",!0),alert(`SHA256 verification failed for ${e.name}. Download blocked for safety.`);return}}c("Download Complete");let r=h,b=e.type,p="",S="",x=!1,T="";if(i)try{a?.type==="nextjs"&&window.api?.killNextApp?await window.api.killNextApp():a?.type==="exe"&&window.api?.killExe&&await window.api.killExe(d?{mode:"presentationbuilder",exePath:a.localPath}:{exePath:a.localPath})}catch(u){console.warn("Failed to stop app process before update:",u)}if(te(e))if(o){if(!window.api?.installSystemWideApp)throw new Error("System-wide installer API is unavailable.");c(i?"Applying update...":"Installing app...");const u=await window.api.installSystemWideApp({installerPath:h,appName:e.name||"",appId:e.id||""});if(!u?.success)throw new Error(u?.message||"System-wide installer did not complete successfully.");r=u.exePath||"",p=u.installLocation||r;const I=u.registryEntry;if(I?.uninstallString&&(S=I.uninstallString.replace(/^"|"$/g,"").split('"').find(A=>A.trim().endsWith(".exe"))||""),!r)throw new Error("App installed but could not locate executable. Please check your installed apps and try opening manually.");b="exe",x=!0}else{if(!window.api?.installManagedWindowsApp)throw new Error("Managed installer API is unavailable.");p=xe(g,e),T=Ie(e),c(i?"Applying update...":"Installing app...");const u=await window.api.installManagedWindowsApp({installerPath:h,installDir:p,manifestName:T,silent:!0});if(!u?.success)throw new Error(u?.message||"Installer did not complete successfully.");const I=u?.manifest||{},A=String(I?.binaryName||e?.binaryName||e?.installedBinaryName||"").trim();if(r=String(I?.exePath||(A?`${p}\\${A}`:"")).trim(),S=String(I?.uninstallPath||`${p}\\Uninstall.exe`).trim(),!r)throw new Error("Installer completed but no executable path was returned.");b="exe",x=!0}else if(f){const u=i&&d?e.id:E.replace(".zip",""),I=`${g}/${u}`;c("Unzipping...");try{if(i&&a?.localPath&&window.api?.deletePath){const B=await window.api.deletePath(a.localPath,m);B?.success||console.warn("Previous install cleanup warning:",B?.message||a.localPath)}const A=F(e)?"electron-exe":"default";if(await window.api.unzipFile(h,I,{mode:A}),r=I,window.api?.deletePath)try{await window.api.deletePath(h)}catch(B){console.warn("Failed to clean up zip installer:",B)}}catch(A){console.error("Unzip Failed",A),alert("Download successful but failed to unzip. "+A.message),delete window.activeDownloads[e.id],c("Error",!0);return}}else{if(i&&a?.packagePath&&a.packagePath!==h&&window.api?.deletePath){const u=await window.api.deletePath(a.packagePath,m);u?.success||console.warn("Previous package cleanup warning:",u?.message||a.packagePath)}e.releaseUrl&&e.releaseUrl.endsWith(".exe")&&(b="exe")}let V="",z=null;if(ee.has(String(b||"").toLowerCase())&&window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const u=await window.api.resolveOneviewAppUrl(e.id,r);u?.success&&u.url&&(V=u.url)}if(String(b||"").toLowerCase()==="oneview-extension"){if(!f)throw new Error("OneView extensions must be distributed as zip releases.");if(!window.api||typeof window.api.installBrowserExtensionFromPath!="function")throw new Error("Extension installation API is unavailable.");const u=await window.api.installBrowserExtensionFromPath({path:r,installSource:"appstore",releaseUrl:e.releaseUrl||"",enabled:!0});if(!u?.success||!u?.entry)throw new Error(u?.message||"Could not register OneView extension.");z=u.entry,V=String(z.rootUrl||"").trim()}delete window.activeDownloads[e.id],y[e.id]={...e,type:b,tech:x&&!String(e?.tech||"").trim()?"electron":e.tech,localPath:r,packagePath:f?null:h,installDir:p,uninstallPath:S,manifestName:T,installFlow:x?"oneview-installer":"",managedByOneviewInstaller:x,systemWideInstall:o?!0:e?.systemWideInstall||!1,oneviewUrl:V,extensionEntry:z,installedAt:new Date().toISOString()},J(y),Y(e.id,!0),y[e.id],console.log("Local Storage updated");try{const u=localStorage.getItem("username")||"",I=parseInt(u,10);if(!isNaN(I)){const A=e.id;console.log("Mapped app name to key:",A);const B={emp_id:I,installation:{[A]:!0}};console.log("Sending installation data payload:",B),fetch(`${R}/api/send-user-installation-data`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(B)}).then(O=>{O.ok?console.log("Successfully sent installation data for",e.name):console.warn("Failed to send installation data",O.status)}).catch(O=>{console.error("Error sending installation data:",O)})}}catch(u){console.error("Error preparing installation payload:",u)}k(v),typeof window.loadMiniInstalledApps=="function"&&window.loadMiniInstalledApps(),C({title:i?"Update Installed":"App Installed",message:i?`${e.name} has been updated successfully.`:`${e.name} has been installed successfully.`,icon:i?"⬆️":"✅"})}).catch(r=>{P&&P(),console.error("Install Failed",r),delete window.activeDownloads[e.id],c("Retry",!0),alert("Installation Failed: "+r.message)})}async function de(e){const t=y[e.id];if(!t){console.error("App not installed:",e.id);return}if(F(t)){try{await ue(t)}catch(n){console.error("External Electron launch failed:",n),C({title:"Launch Failed",message:n?.message||`Could not launch ${t.name}.`,icon:"⚠️"})}return}if(t.type==="oneview-extension"){sessionStorage.setItem("oneview.pendingExtensionOpenPath",String(t.localPath||"")),window.location.href="../view/view.html";return}sessionStorage.setItem(he.activeLaunchApp,JSON.stringify(t)),window.location.href="../runner/runner.html"}function Te(e){const t=document.getElementById("availableGridHeader"),n=document.getElementById("installedGridHeader");if(!t||!n)return;const i=String(e||"all").toLowerCase();let a="";switch(i){case"all":a="All Apps";break;case"eda":a="eDa Tools";break;case"web":a="Web Apps";break;case"creative":a="Creative Suite";break;default:a=i.charAt(0).toUpperCase()+i.slice(1)+" Apps"}t.textContent=`Available ${a}`,n.textContent=`Installed ${a}`}window.handleSearchSelect=e=>{document.getElementById("searchModal").classList.remove("active"),document.querySelector('.filter-btn[data-cat="all"]').click(),setTimeout(()=>{const t=document.getElementById(`btn-${e}`);if(t){t.scrollIntoView({behavior:"smooth",block:"center"});const n=t.closest(".app-card");n.style.transition="box-shadow 0.3s",n.style.boxShadow="0 0 0 4px var(--primary)",setTimeout(()=>{n.style.boxShadow=""},1e3)}},400)};const ce=document.createElement("style");ce.innerText=`
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
    from { 
        opacity: 0; 
        transform: translateX(100px); 
    }
    to { 
        opacity: 1; 
        transform: translateX(0); 
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

`;document.head.appendChild(ce);
