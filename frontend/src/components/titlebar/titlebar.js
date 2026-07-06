function _callApi(name) {
    if (window.api && typeof window.api[name] === 'function') {
        try { window.api[name](); } catch (e) { console.warn('api.'+name+'() failed', e); }
    } else {
        console.warn('window.api.'+name+'() not available');
    }
}

function Exit() { _callApi('close'); }
function Minimize() { _callApi('minimize'); }
function Maximize() { _callApi('maximize'); }

// attach click handlers in case pages use buttons without inline onclick
window.addEventListener('DOMContentLoaded', ()=>{
    const closeBtn = document.getElementById('close-btn');
    const minBtn = document.getElementById('min-btn');
    const maxBtn = document.getElementById('max-btn');

    if (closeBtn) closeBtn.addEventListener('click', Exit);
    if (minBtn) minBtn.addEventListener('click', Minimize);
    if (maxBtn) maxBtn.addEventListener('click', Maximize);

    const dragBox = document.querySelector('.drag-box');
    const titleBar = document.querySelector('.titlebar');

    const setupDrag = (el) => {
        if (!el) return;
        el.addEventListener('mousedown', (e) => {
            if (e.target.closest('.action-btn') || e.target.closest('button')) return;
            if (e.detail === 2) {
                _callApi('maximize');
            } else {
                _callApi('dragWindow');
            }
        });
    };
    setupDrag(dragBox);
    setupDrag(titleBar);

    const updateMaximized = () => {
        const isMax = window.screenX < 0 || window.screenY < 0 || window.outerHeight >= window.screen.availHeight - 10;
        document.body.classList.toggle('maximized', isMax);
    };
    window.addEventListener('resize', updateMaximized);
    updateMaximized();
    setTimeout(updateMaximized, 500);

    // listen for maximize state and toggle class for icon
    if (window.api && typeof window.api.on === 'function') {
        window.api.on('window-maximized', (isMax) => {
            if (maxBtn) {
                if (isMax) maxBtn.classList.add('maximized'); else maxBtn.classList.remove('maximized');
            }
        });
    }
});
