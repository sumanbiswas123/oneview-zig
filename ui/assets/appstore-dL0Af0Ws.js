import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css              *//* empty css                 */import{i as F,l as ue,q as pe}from"./api-query-CnFqXUJs.js";import{A as G,E as me,I as fe,D as we}from"./app-env-Cwx6WtbG.js";import{s as ge,c as he,g as Z,f as q}from"./app-update-notifications-DxIbSuXu.js";import{S as R,a as ye}from"./app-runtime-CI2L9vDX.js";const Q=me;let v=[],y=JSON.parse(localStorage.getItem(R.installedApps)||"{}");const ee=new Set(["nextjs","vite","react","angular","html","neutralino","website"]);function ve(e,t){const n=s=>parseInt(String(s).split(/[^0-9]/)[0])||0,i=String(e).split(".").map(n),o=String(t).split(".").map(n);for(let s=0;s<Math.max(i.length,o.length);s++){const d=i[s]||0,p=o[s]||0;if(d>p)return!0;if(d<p)return!1}return!1}function z(e=""){return String(e||"").trim().toLowerCase()}function te(e={}){const t=z(e?.type),n=z(e?.installFlow||e?.installMode||e?.distribution||e?.packageType),i=String(e?.releaseUrl||e?.url||"").trim().toLowerCase(),o=i&&i.split("/").pop()||"",s=o.endsWith(".exe")&&(o.includes("oneview-setup")||o.includes("-setup-")||o.includes("installer")||o.includes("-setup."));return!!e?.systemWideInstall||t==="installer"||t==="oneview-installer"||n==="oneview-installer"||n==="managed-installer"||n==="nsis"||s}function be(e={}){return!!e?.managedByOneviewInstaller||z(e?.installFlow)==="oneview-installer"||te(e)}function xe(e=""){return String(e||"").trim().replace(/[<>:"/\\|?*\x00-\x1f]+/g,"-").replace(/\s+/g," ").replace(/[. ]+$/g,"").slice(0,80)}function Ie(e,t={}){const n=xe(t?.oneviewInstallDirName||t?.installDirName||t?.name||t?.id)||"Installed App";return`${e}/installed/${n}`}function Se(e={}){return String(e?.oneviewManifestName||e?.installManifestName||"oneview-install.json").trim()||"oneview-install.json"}function ne(e={}){const t=String(e?.type||e?.runtime||"").trim().toLowerCase();return t==="oneview-extension"?"extension":t==="website"?"website":"app"}function Ee(e={}){const t=ne(e);return t==="extension"?"Extension":t==="website"?"Web App":"App"}function Ce(e={}){return`<span class="app-kind-badge app-kind-badge-${ne(e)}">${Ee(e)}</span>`}const Ae=3e4,_=`
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M8 16H3v5"></path>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M16 8h5V3"></path>
  </svg>
`;window.activeDownloads=window.activeDownloads||{};window.__appStoreState=window.__appStoreState||{userInstallationsCache:{},userInstallationsFetchedAt:0,userInstallationsPromise:null,renderNonce:0,searchKeydownBound:!1,notificationOutsideClickBound:!1,systemUpdateCheckPromise:null};function $(){return window.__appStoreState}function ie(){try{return JSON.parse(localStorage.getItem(R.installedApps)||"{}")}catch{return{}}}function J(e){y=e,localStorage.setItem(R.installedApps,JSON.stringify(e))}function Y(e,t){if(!e)return;const n=$(),i={...n.userInstallationsCache||{}};t?i[e]=!0:delete i[e],n.userInstallationsCache=i,n.userInstallationsFetchedAt=Date.now()}function ke(){const e=$();e.userInstallationsFetchedAt=0,e.userInstallationsPromise=null}async function Me({force:e=!1}={}){const t=$(),n=Date.now();if(!e&&t.userInstallationsFetchedAt&&n-t.userInstallationsFetchedAt<Ae)return t.userInstallationsCache||{};if(!e&&t.userInstallationsPromise)return t.userInstallationsPromise;const i=String(localStorage.getItem("username")||"").trim();return i?(t.userInstallationsPromise=(async()=>{try{const s=/^\d+$/.test(i)?{emp_id:i}:{},{data:d}=await pe("user-tracking",s,{timeoutMs:8e3}),p=d[0]||{};return t.userInstallationsCache=p.installations||{},t.userInstallationsFetchedAt=Date.now(),t.userInstallationsCache}catch(o){return console.error("Failed to fetch user installations",o),t.userInstallationsCache||{}}finally{t.userInstallationsPromise=null}})(),t.userInstallationsPromise):(t.userInstallationsCache={},t.userInstallationsFetchedAt=n,{})}function Le(){if(document.getElementById("customModal"))return;const e=document.createElement("div");e.id="customModal",e.className="custom-modal-overlay",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","customModalTitle"),e.setAttribute("aria-describedby","customModalMessage"),e.innerHTML=`
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
  `,document.body.appendChild(e)}function oe(){Le(),le(),De(),Ne(),Ue(),Te(),Be(),Pe(),$e(),window.appStoreInitialized=!0}async function Pe(){if(!window.api||typeof window.api.resolveOneviewAppUrl!="function")return;let e=!1;const t=JSON.parse(localStorage.getItem(R.installedApps)||"{}"),n=Object.entries(t);for(const[i,o]of n){const s=String(o?.type||"").toLowerCase();if(ee.has(s)&&o?.localPath)try{const d=await window.api.resolveOneviewAppUrl(i,o.localPath);d?.success&&d.url&&o.oneviewUrl!==d.url&&(t[i]={...o,oneviewUrl:d.url},e=!0)}catch{}}e&&J(t)}document.addEventListener("DOMContentLoaded",()=>{oe()});window.initAppStore=oe;function Be(){const e=document.getElementById("createDevProjectBtn");if(!e||(e.style.display="none",!fe)||localStorage.getItem("userMaster")!=="true")return;const t=String(localStorage.getItem("emp_id")||localStorage.getItem("username")||"").trim(),n=String(localStorage.getItem("resourceName")||"").trim();fetch(we).then(i=>i.json()).then(i=>{i.some(s=>String(s.id).trim()===t&&String(s.name).trim()===n)||console.info("Dev project entry visible because this is a dev build; user is not on remote allow-list.")}).catch(console.warn),e.addEventListener("click",()=>{if(typeof window.loadDevProjectStudio=="function"){window.loadDevProjectStudio();return}window.location.href="../dev-project/dev-project.html"})}window.api&&window.api.on&&window.api.on("update-status",e=>{!e||!e.status||(e.status==="available"&&A({title:"OneView Update",message:`v${e.version} is available and downloading.`,icon:"UP"}),e.status==="downloaded"&&A({title:"OneView Update",message:`v${e.version} downloaded. Restart from Dashboard to install.`,icon:"OK"}),e.status==="error"&&A({title:"OneView Update",message:e.error||"Update failed.",icon:"!"}))});function A({title:e,message:t,icon:n,persist:i=!0}){let o=document.getElementById("toastContainer");o||(o=document.createElement("div"),o.id="toastContainer",o.style.cssText=`
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      max-width: 350px;
    `,document.body.appendChild(o));const s=document.createElement("div");s.className="toast-notification",s.style.cssText=`
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
  `,o.appendChild(s),i&&ae({title:e,message:t,icon:n,time:new Date().toISOString()}),setTimeout(()=>{s.parentElement&&(s.style.opacity="0",s.style.transform="translateX(100px)",s.style.transition="all 0.3s ease",setTimeout(()=>s.remove(),300))},5e3)}function ae(e){ge(e),W()}function se(){const e=document.getElementById("notifList");if(!e)return;const t=Z();if(t.length===0){e.innerHTML='<div class="empty-notifs">No notifications</div>';return}e.innerHTML=t.map(n=>`
        <div class="notif-item">
            <div style="font-size:18px">${n.icon||"🔔"}</div>
            <div style="flex:1">
                <div style="font-weight:600; color:var(--text-main)">${n.title}</div>
                <div style="color:var(--text-muted)">${n.message}</div>
                <div class="notif-time">${new Date(n.time).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
            </div>
        </div>
    `).join("")}window.clearNotifications=()=>{he(),se();const e=document.getElementById("notification-badge");e&&(e.style.display="none")};function W(){const e=Z(),t=document.getElementById("notification-badge");t&&e.length>0?t.style.display="block":t&&(t.style.display="none")}window.syncInstallationToDB=function(e){try{const t=localStorage.getItem("username")||"",n=parseInt(t,10);if(!isNaN(n)){const i={emp_id:n,installation:{[e]:!0}};fetch(`${G}/api/send-user-installation-data`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then(o=>{o.ok?console.log("Synced DB for",e):console.warn("Failed to sync installation",o.status)}).catch(o=>{console.error("Error syncing DB:",o)})}}catch(t){console.error("Error preparing installation payload:",t)}Y(e,!0),k(v)};async function $e(){const e=$();return e.systemUpdateCheckPromise||(e.systemUpdateCheckPromise=(async()=>{if(y=ie(),!v||v.length===0)try{const n=await fetch(Q,{signal:AbortSignal.timeout(8e3)});n.ok&&(v=q(await n.json()))}catch(n){console.warn("Could not fetch apps for update check",n)}Object.keys(y).map(n=>{const i=y[n],o=v.find(s=>s.id===n);return!o||!i?.version||!o.version||o.version===i.version?null:o}).filter(Boolean).forEach(n=>{A({title:`${n.name} Update`,message:`v${n.version} is available.`,icon:"UP",persist:!1}),ae({title:`${n.name} Update`,message:`v${n.version} is available.`,icon:"UP",time:new Date().toISOString(),dedupeKey:`app-update:${n.id}:${n.version}`,replaceKey:`app-update:${n.id}`})})})().finally(()=>{e.systemUpdateCheckPromise=null})),e.systemUpdateCheckPromise}function Ue(){const e=document.getElementById("notifBtn"),t=document.getElementById("notifPopover"),n=document.getElementById("notifBadge");if(!e||!t||!n){W();return}e.dataset.boundClick!=="1"&&(e.dataset.boundClick="1",e.addEventListener("click",o=>{o.stopPropagation();const s=document.getElementById("notifPopover"),d=document.getElementById("notifBadge");s&&(s.classList.toggle("active"),s.classList.contains("active")&&(se(),d&&(d.style.display="none")))}));const i=$();i.notificationOutsideClickBound||(i.notificationOutsideClickBound=!0,document.addEventListener("click",o=>{const s=document.getElementById("notifPopover"),d=document.getElementById("notifBtn");!s||!d||!s.contains(o.target)&&!d.contains(o.target)&&s.classList.remove("active")})),W()}async function le(){const e=document.getElementById("appsGridAvailable"),t=document.getElementById("appsGridInstalled");try{const n=await fetch(Q,{signal:AbortSignal.timeout(8e3)});if(!n.ok)throw new Error("Network response was not ok");const i=await n.json();v=q(i),await k(v)}catch(n){console.error("Error fetching apps:",n);const i=`
            <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <h3>Connection Error</h3>
                <p>Could not load the app directory.</p>
                <button onclick="window.fetchApps()" class="btn-install" style="width: auto; margin-top: 20px;">Retry</button>
            </div>
        `;e&&(e.innerHTML=i),t&&(t.innerHTML=i)}}async function k(e){const t=document.getElementById("appsGridAvailable"),n=document.getElementById("appsGridInstalled");if(!t||!n)return;const i=$(),o=++i.renderNonce;t.innerHTML="",n.innerHTML="";const s=await Me();if(o!==i.renderNonce)return;y=ie();const d=q(Array.isArray(e)?e:v).sort((a,f)=>(a.name||"").toLowerCase().localeCompare((f.name||"").toLowerCase())),p=[],c=[];d.forEach(a=>{const f=!!y[a.id],S=!!s[a.id];f&&S?c.push(a):p.push(a)});const w=(a,f)=>{const S=!!y[a.id],h=!!s[a.id],U=S,N=f<10?f*35:0,L=document.createElement("div");L.className=`app-card ${U?"is-installed":"is-store"}`,N>0&&(L.style.animation=`fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards ${N}ms`);const P=a.iconUrl?`<img src="${a.iconUrl}" class="app-icon app-icon-image" alt="${a.name}" />`:`<div class="app-icon app-icon-fallback">${a.icon||"?"}</div>`;let r=!1;const b=v.find(x=>x.id===a.id);S&&b&&b.version&&y[a.id]?.version&&(r=b.version!==y[a.id].version);let m="";if(S&&h)if(window.activeDownloads[a.id]){const x=window.activeDownloads[a.id];m=`
        <button class="btn-icon delete" disabled title="Update in progress">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <button class="btn-icon update is-busy" id="btn-${a.id}" disabled title="${x.label}">
          ${_}
        </button>
      `}else m=`
        <button class="btn-icon delete" id="btn-${a.id}" onclick="uninstallApp('${a.id}')" title="Uninstall">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        ${r?`
        <button class="btn-icon update" onclick="updateApp('${a.id}')" title="Update Available">
          ${_}
        </button>`:""}
      `;else if(S&&!h)m=`
        <button class="btn-install" onclick="syncInstallationToDB('${a.id}')">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v12"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            </svg>
            Sync Installation
          </span>
        </button>
      `;else if(window.activeDownloads[a.id]){const x=window.activeDownloads[a.id];m=`
        <button class="btn-install" id="btn-${a.id}" disabled style="opacity:0.7;">
          <span style="display:flex; align-items:center; justify-content:center; gap:8px">
            <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              style="animation:spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            ${x.label}
          </span>
        </button>
      `}else m=`
        <button class="btn-install" id="btn-${a.id}" onclick="handleAppAction('${a.id}')">
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
      `;const E=U?`Installed: v${y[a.id]?.version||"1.0.0"}`:`v${a.version}`;return L.innerHTML=`
      <div class="app-card-top">
        ${P}
        <div class="app-meta">
          <div class="app-name-row">
            <h3 class="app-name">${a.name}</h3>
            <div class="app-card-tags">
              ${Ce(a)}
            </div>
          </div>
          <div class="app-meta-row">
            <span class="app-channel">
              ${String(a.channel||"App").toUpperCase()==="EDA"?"eDA":a.channel||"App"}
            </span>
          </div>
        </div>
      </div>
      <p class="app-desc app-desc-unified">${a.description}</p>
      <div class="app-card-bottom">
        <span class="version-badge" style="
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--primary);
        ">
          ${E}
        </span>
        <div class="app-actions">
          ${m}
        </div>
      </div>
    `,L},g=document.createDocumentFragment(),l=document.createDocumentFragment();p.forEach((a,f)=>{g.appendChild(w(a,f))}),c.forEach((a,f)=>{l.appendChild(w(a,f))}),p.length===0?t.innerHTML='<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding:40px;">All available apps are installed!</div>':t.appendChild(g),c.length===0?n.innerHTML=`<div class="empty-state" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding:40px;">You haven't installed any apps yet.</div>`:n.appendChild(l)}function De(){const e=document.querySelectorAll(".filter-btn[data-cat]");e.forEach(t=>{t.dataset.boundClick!=="1"&&(t.dataset.boundClick="1",t.addEventListener("click",n=>{e.forEach(s=>s.classList.remove("active"));const i=n.currentTarget;i.classList.add("active");const o=i.dataset.cat;if(Oe(o),o==="all")k(v);else{const s=v.filter(d=>d.channel&&d.channel.toLowerCase()===o.toLowerCase());k(s)}}))})}function Ne(){const e=document.getElementById("searchModal"),t=document.getElementById("searchInput"),n=document.getElementById("searchTrigger"),i=document.getElementById("searchResults"),o=document.getElementById("closeSearchBtn");if(!e||!t||!i||!o)return;const s=()=>{e.classList.add("active"),t.focus()},d=()=>{e.classList.remove("active"),t.value="",i.innerHTML=""};n&&n.dataset.boundClick!=="1"&&(n.dataset.boundClick="1",n.addEventListener("click",s)),o.dataset.boundClick!=="1"&&(o.dataset.boundClick="1",o.addEventListener("click",d));const p=$();p.searchKeydownBound||(p.searchKeydownBound=!0,document.addEventListener("keydown",c=>{const w=document.getElementById("searchModal"),g=document.getElementById("searchInput"),l=document.getElementById("searchResults");!w||!g||!l||((c.ctrlKey||c.metaKey)&&c.key==="k"&&(c.preventDefault(),w.classList.contains("active")?(w.classList.remove("active"),g.value="",l.innerHTML=""):(w.classList.add("active"),g.focus())),c.key==="Escape"&&(w.classList.remove("active"),g.value="",l.innerHTML=""))})),e.dataset.boundClick!=="1"&&(e.dataset.boundClick="1",e.addEventListener("click",c=>{c.target===e&&d()})),t.dataset.boundInput!=="1"&&(t.dataset.boundInput="1",t.addEventListener("input",c=>{const w=c.target.value.toLowerCase();if(w.length<1){i.innerHTML="";return}const g=v.filter(l=>l.name.toLowerCase().includes(w)||l.author.toLowerCase().includes(w)||l.channel.toLowerCase().includes(w));if(g.length===0){i.innerHTML='<div style="padding:20px; text-align:center; color:var(--text-muted)">No results found</div>';return}i.innerHTML=g.map(l=>`
            <div class="search-result-row" onclick="handleSearchSelect('${l.id}')" style="
                display:flex; align-items:center; gap:16px; padding:12px;
                cursor:pointer; border-radius:12px; transition:bg 0.2s;
            " onmouseover="this.style.background='rgba(0,0,0,0.03)'" onmouseout="this.style.background='transparent'">
                <div style="font-weight:600; color:var(--text-main)">${l.name}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-left:auto">${l.channel}</div>
            </div>
        `).join("")}))}window.fetchApps=le;let H=null,M=null,K=null;function Te(){const e=document.getElementById("customModal");if(!e){console.error("Custom Modal element not found in DOM");return}e.onclick=t=>{const n=t.target;if(n.id==="customModalClose"||n.closest("#customModalClose")||n.id==="customModalCancel"||n.closest("#customModalCancel")){console.log("Modal: Cancel Clicked"),t.stopPropagation(),D(!1);return}if(n.id==="customModalConfirm"||n.closest("#customModalConfirm")){console.log("Modal: Confirm Clicked"),t.stopPropagation(),D(!0);return}n===e&&(console.log("Modal: Overlay Clicked"),D(!1))},console.log("Custom Modal Setup Complete via Delegation")}function X({title:e,message:t,type:n="normal",confirmText:i="Confirm",hint:o=""}){return new Promise(s=>{H=s;const d=document.getElementById("customModal"),p=document.getElementById("customModalTitle"),c=document.getElementById("customModalMessage"),w=document.getElementById("customModalHint"),g=document.getElementById("customModalIcon"),l=document.getElementById("customModalCancel"),a=document.getElementById("customModalConfirm");if(!d||!p||!c||!a||!l){s(window.confirm(t||e||"Are you sure?"));return}M&&(document.removeEventListener("keydown",M),M=null),K=document.activeElement,p.textContent=e,c.textContent=t,w&&(w.textContent=o),a.textContent=i,d.classList.toggle("modal-danger",n==="danger"),a.className="modal-btn",n==="danger"?a.classList.add("danger"):a.classList.add("primary"),g&&(g.innerHTML=n==="danger"?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><circle cx="12" cy="16" r="1"></circle></svg>'),M=f=>{if(d.classList.contains("active")){if(f.key==="Escape")f.preventDefault(),D(!1);else if(f.key==="Enter"){const h=(f.target&&f.target.tagName?f.target.tagName:"")==="BUTTON";(f.target===a||!h)&&(f.preventDefault(),D(!0))}}},document.addEventListener("keydown",M),d.classList.add("active"),requestAnimationFrame(()=>a.focus())})}function D(e){const t=document.getElementById("customModal");if(!t)return;t.classList.remove("active"),t.classList.remove("modal-danger"),M&&(document.removeEventListener("keydown",M),M=null),H&&(H(e),H=null);const n=K;K=null,n&&typeof n.focus=="function"&&requestAnimationFrame(()=>n.focus())}window.launchAppAttr=e=>{const t=v.find(n=>n.id===e);t&&de(t)};window.uninstallApp=async e=>{const t=v.find(p=>p.id===e)||y[e],n=y[e]||t;if(!t){console.error("App not found for uninstall:",e);return}const i=document.getElementById(`btn-${e}`),o=i?i.innerHTML:null,s=i?i.style.opacity:"1";i&&(i.classList.contains("btn-icon")?i.innerHTML=`
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
      `,i.disabled=!0,i.style.opacity="0.9");const d=await X({title:"Uninstall App",message:`Are you sure you want to uninstall ${t.name}? This will remove it from your device.`,type:"danger",confirmText:"Uninstall",hint:"This action cannot be undone"});if(!d){i&&(i.innerHTML=o,i.disabled=!1,i.style.opacity=s);return}if(d){const p=[],c=String(n?.id||"").trim().toLowerCase()==="presentationbuilder"||F(n),w=be(n),g=c?{mode:"presentationbuilder"}:void 0;A({title:"Uninstalling",message:`Removing ${t.name}...`,icon:"🗑️",persist:!1});try{if(n.type==="oneview-extension"&&window.api?.removeBrowserExtension&&await window.api.removeBrowserExtension({path:n.localPath}),n.type==="nextjs"&&window.api?.killNextApp?await window.api.killNextApp():n.type==="exe"&&window.api?.killExe&&await window.api.killExe(c?{mode:"presentationbuilder",exePath:n.localPath}:{exePath:n.localPath}),w&&n.uninstallPath&&window.api?.uninstallManagedWindowsApp){const l=await window.api.uninstallManagedWindowsApp({uninstallPath:n.uninstallPath,installDir:n.installDir||"",manifestName:n.manifestName||"",appExePath:n.localPath||"",silent:!0,extraArgs:Array.isArray(n.uninstallArgs)?n.uninstallArgs:[]});l?.success||p.push(l?.message||"Could not uninstall the app.")}}catch(l){console.warn("Failed to stop app process before uninstall:",l)}if(!w&&n.localPath&&window.api?.deletePath)try{const l=await window.api.deletePath(n.localPath,g);l?.success||p.push(l?.message||"Could not remove app files.")}catch(l){p.push(l.message||"Could not remove app files.")}if(n.packagePath&&window.api?.deletePath)try{const l=await window.api.deletePath(n.packagePath,g);l?.success||p.push(l?.message||"Could not remove downloaded package.")}catch(l){p.push(l.message||"Could not remove downloaded package.")}if(p.length>0){if(!p.some(a=>a.toLowerCase().includes("not found")||a.toLowerCase().includes("enoent")||a.toLowerCase().includes("does not exist"))){A({title:"Uninstall Failed",message:p[0],icon:"⚠️"}),k(v);return}console.log("App files already gone, removing ghost entry from state.")}delete y[e],J(y),Y(e,!1),ke();try{const l=localStorage.getItem("username")||"",a=parseInt(l,10);if(!isNaN(a)){const f=t.id,S={emp_id:a,installation:{[f]:!1}};fetch(`${G}/api/send-user-installation-data`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(S)}).then(h=>{h.ok?console.log("Successfully sent installation data for",t.name):console.warn("Failed to send installation data",h.status)}).catch(h=>{console.error("Error sending installation data:",h)})}}catch(l){console.error("Error preparing installation payload:",l)}k(v),typeof window.loadMiniInstalledApps=="function"&&window.loadMiniInstalledApps(),A({title:"App Uninstalled",message:`${t.name} has been removed.`,icon:"🗑️"})}};window.updateApp=async e=>{const t=v.find(i=>i.id===e)||y[e];if(!t){console.error("App not found for update:",e);return}if(await X({title:"Update Available",message:`A new version of ${t.name} is available. Update now?`,type:"normal",confirmText:"Update"}))try{await re(t,{isUpdate:!0})}catch(i){console.error("Update flow failed to start:",i),A({title:"Update Failed",message:i?.message||`Could not start update for ${t.name}.`,icon:"⚠️"})}};window.handleAppAction=e=>{const t=v.find(n=>n.id===e);t&&(y[e]?de(t):re(t))};async function re(e,t={}){const n=window.activeDownloads[e.id];if(n){const r=Number(n.startedAt||0);if(r>0&&Date.now()-r>120*1e3)delete window.activeDownloads[e.id];else{A({title:"Update In Progress",message:n.label||`${e.name} is already updating.`,icon:"UP",persist:!1}),k(v);return}}const i=t?.isUpdate===!0,o=y[e.id]||null,s=i?"Updating...":"Installing...",d=String(o?.id||e?.id||"").trim().toLowerCase()==="presentationbuilder"||F(o||e),p=d?{mode:"presentationbuilder"}:void 0;window.activeDownloads[e.id]={label:s,startedAt:Date.now()};const c=(r,b=!1)=>{window.activeDownloads[e.id]&&(window.activeDownloads[e.id].label=r);const m=document.getElementById(`btn-${e.id}`);if(m){const E=m.classList.contains("btn-icon");b?(E?(m.innerHTML=_,m.title=r):m.innerHTML=`<span>${r}</span>`,m.disabled=!1,m.style.opacity="1"):(E?(m.innerHTML=_,m.title=r):m.innerHTML=`
            <span style="display:flex; align-items:center; justify-content:center; gap:8px">
                <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                ${r}
            </span>
          `,m.disabled=!0,m.style.opacity="0.7")}};c(s);const w=e["oneview-version"]||e.oneviewVersion||e.oneViewVersion;if(w)try{const r=await window.api.getAppVersion();if(ve(w,r)){delete window.activeDownloads[e.id],c("Retry",!0);const x=((await window.api.getCurrentUpdateStatus())?.state||{}).status==="downloaded";await X({title:"Update Available",message:`Current version: ${r}. Please update to ${w} or higher.`,confirmText:x?"Install Now":"Check for Updates",type:"normal",hint:x?"An update is ready to install.":"A newer version of OneView is required."})&&(x?window.api.installUpdate():typeof window.triggerManualSystemUpdateCheck=="function"?window.triggerManualSystemUpdateCheck():window.api.checkForUpdates());return}}catch(r){console.warn("Failed to check OneView version compatibility:",r)}k(v);let g="";try{window.api&&typeof window.api.getAppsSecretRoot=="function"&&(g=await window.api.getAppsSecretRoot())}catch(r){console.error("Could not resolve apps root path",r)}if(!g){delete window.activeDownloads[e.id],c("Retry",!0),alert("Could not resolve application storage path.");return}let l="";const a=!!e?.systemWideInstall;if(a){try{window.api&&typeof window.api.getLocalAppDataPath=="function"&&(l=await window.api.getLocalAppDataPath())}catch(r){console.warn("Could not resolve localAppData path",r)}l||(l=g)}const f=e.releaseUrl&&e.releaseUrl.endsWith(".zip"),S=e.releaseUrl?e.releaseUrl.split("/").pop():`${e.id}.zip`,h=`${g}/${S}`,U=String(e.sha256||"").trim().toLowerCase(),N=/^[a-f0-9]{64}$/.test(U);c("Downloading... 0%");const L=r=>`${(r/(1024*1024)).toFixed(1)} MB`;let P=null;window.api&&typeof window.api.onDownloadProgress=="function"&&(P=window.api.onDownloadProgress(r=>{if(!r||r.targetPath!==h)return;const{progress:b,receivedBytes:m,totalBytes:E}=r,x=typeof b=="number"?`${b}%`:`${L(m||0)}${E?` / ${L(E)}`:""}`;c(`Downloading... ${x}`)})),window.api.downloadFile(e.releaseUrl,h).then(async()=>{if(P&&P(),N&&window.api&&typeof window.api.verifyFileSha256=="function"){const u=await window.api.verifyFileSha256(h,U);if(!u?.success||!u.matches){try{window.api?.deletePath&&await window.api.deletePath(h)}catch{}delete window.activeDownloads[e.id],c("Retry",!0),alert(`SHA256 verification failed for ${e.name}. Download blocked for safety.`);return}}c("Download Complete");let r=h,b=e.type,m="",E="",x=!1,T="";if(i)try{o?.type==="nextjs"&&window.api?.killNextApp?await window.api.killNextApp():o?.type==="exe"&&window.api?.killExe&&await window.api.killExe(d?{mode:"presentationbuilder",exePath:o.localPath}:{exePath:o.localPath})}catch(u){console.warn("Failed to stop app process before update:",u)}if(te(e))if(a){if(!window.api?.installSystemWideApp)throw new Error("System-wide installer API is unavailable.");c(i?"Applying update...":"Installing app...");const u=await window.api.installSystemWideApp({installerPath:h,appName:e.name||"",appId:e.id||""});if(!u?.success)throw new Error(u?.message||"System-wide installer did not complete successfully.");r=u.exePath||"",m=u.installLocation||r;const I=u.registryEntry;if(I?.uninstallString&&(E=I.uninstallString.replace(/^"|"$/g,"").split('"').find(C=>C.trim().endsWith(".exe"))||""),!r)throw new Error("App installed but could not locate executable. Please check your installed apps and try opening manually.");b="exe",x=!0}else{if(!window.api?.installManagedWindowsApp)throw new Error("Managed installer API is unavailable.");m=Ie(g,e),T=Se(e),c(i?"Applying update...":"Installing app...");const u=await window.api.installManagedWindowsApp({installerPath:h,installDir:m,manifestName:T,silent:!0});if(!u?.success)throw new Error(u?.message||"Installer did not complete successfully.");const I=u?.manifest||{},C=String(I?.binaryName||e?.binaryName||e?.installedBinaryName||"").trim();if(r=String(I?.exePath||(C?`${m}\\${C}`:"")).trim(),E=String(I?.uninstallPath||`${m}\\Uninstall.exe`).trim(),!r)throw new Error("Installer completed but no executable path was returned.");b="exe",x=!0}else if(f){const u=i&&d?e.id:S.replace(".zip",""),I=`${g}/${u}`;c("Unzipping...");try{if(i&&o?.localPath&&window.api?.deletePath){const B=await window.api.deletePath(o.localPath,p);B?.success||console.warn("Previous install cleanup warning:",B?.message||o.localPath)}const C=F(e)?"electron-exe":"default";if(await window.api.unzipFile(h,I,{mode:C}),r=I,window.api?.deletePath)try{await window.api.deletePath(h)}catch(B){console.warn("Failed to clean up zip installer:",B)}}catch(C){console.error("Unzip Failed",C),alert("Download successful but failed to unzip. "+C.message),delete window.activeDownloads[e.id],c("Error",!0);return}}else{if(i&&o?.packagePath&&o.packagePath!==h&&window.api?.deletePath){const u=await window.api.deletePath(o.packagePath,p);u?.success||console.warn("Previous package cleanup warning:",u?.message||o.packagePath)}e.releaseUrl&&e.releaseUrl.endsWith(".exe")&&(b="exe")}let V="",j=null;if(ee.has(String(b||"").toLowerCase())&&window.api&&typeof window.api.resolveOneviewAppUrl=="function"){const u=await window.api.resolveOneviewAppUrl(e.id,r);u?.success&&u.url&&(V=u.url)}if(String(b||"").toLowerCase()==="oneview-extension"){if(!f)throw new Error("OneView extensions must be distributed as zip releases.");if(!window.api||typeof window.api.installBrowserExtensionFromPath!="function")throw new Error("Extension installation API is unavailable.");const u=await window.api.installBrowserExtensionFromPath({path:r,installSource:"appstore",releaseUrl:e.releaseUrl||"",enabled:!0});if(!u?.success||!u?.entry)throw new Error(u?.message||"Could not register OneView extension.");j=u.entry,V=String(j.rootUrl||"").trim()}delete window.activeDownloads[e.id],y[e.id]={...e,type:b,tech:x&&!String(e?.tech||"").trim()?"electron":e.tech,localPath:r,packagePath:f?null:h,installDir:m,uninstallPath:E,manifestName:T,installFlow:x?"oneview-installer":"",managedByOneviewInstaller:x,systemWideInstall:a?!0:e?.systemWideInstall||!1,oneviewUrl:V,extensionEntry:j,installedAt:new Date().toISOString()},J(y),Y(e.id,!0),y[e.id],console.log("Local Storage updated");try{const u=localStorage.getItem("username")||"",I=parseInt(u,10);if(!isNaN(I)){const C=e.id;console.log("Mapped app name to key:",C);const B={emp_id:I,installation:{[C]:!0}};console.log("Sending installation data payload:",B),fetch(`${G}/api/send-user-installation-data`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(B)}).then(O=>{O.ok?console.log("Successfully sent installation data for",e.name):console.warn("Failed to send installation data",O.status)}).catch(O=>{console.error("Error sending installation data:",O)})}}catch(u){console.error("Error preparing installation payload:",u)}k(v),typeof window.loadMiniInstalledApps=="function"&&window.loadMiniInstalledApps(),A({title:i?"Update Installed":"App Installed",message:i?`${e.name} has been updated successfully.`:`${e.name} has been installed successfully.`,icon:i?"⬆️":"✅"})}).catch(r=>{P&&P(),console.error("Install Failed",r),delete window.activeDownloads[e.id],c("Retry",!0),alert("Installation Failed: "+r.message)})}async function de(e){const t=y[e.id];if(!t){console.error("App not installed:",e.id);return}if(F(t)){try{await ue(t)}catch(n){console.error("External Electron launch failed:",n),A({title:"Launch Failed",message:n?.message||`Could not launch ${t.name}.`,icon:"⚠️"})}return}if(t.type==="oneview-extension"){sessionStorage.setItem("oneview.pendingExtensionOpenPath",String(t.localPath||"")),window.location.href="../view/view.html";return}sessionStorage.setItem(ye.activeLaunchApp,JSON.stringify(t)),window.location.href="../runner/runner.html"}function Oe(e){const t=document.getElementById("availableGridHeader"),n=document.getElementById("installedGridHeader");if(!t||!n)return;const i=String(e||"all").toLowerCase();let o="";switch(i){case"all":o="All Apps";break;case"eda":o="eDa Tools";break;case"web":o="Web Apps";break;case"creative":o="Creative Suite";break;default:o=i.charAt(0).toUpperCase()+i.slice(1)+" Apps"}t.textContent=`Available ${o}`,n.textContent=`Installed ${o}`}window.handleSearchSelect=e=>{document.getElementById("searchModal").classList.remove("active"),document.querySelector('.filter-btn[data-cat="all"]').click(),setTimeout(()=>{const t=document.getElementById(`btn-${e}`);if(t){t.scrollIntoView({behavior:"smooth",block:"center"});const n=t.closest(".app-card");n.style.transition="box-shadow 0.3s",n.style.boxShadow="0 0 0 4px var(--primary)",setTimeout(()=>{n.style.boxShadow=""},1e3)}},400)};const ce=document.createElement("style");ce.innerText=`
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
