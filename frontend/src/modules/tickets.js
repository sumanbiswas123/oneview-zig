/**
 * Ticket data and rendering functionality
 */

const hostname = 'http://10.215.56.196:5000';

/**
 * Get the current logged-in username from localStorage
 * @returns {string|null} The username or null if not logged in
 */
function getLoggedInUsername() {
    try {
        return localStorage.getItem('username');
    } catch (e) {
        console.warn('Could not retrieve username from localStorage', e);
        return null;
    }
}

const sampleTickets = [
    { id: 12345, title: 'WUNNEDGSK-11078', client: 'Trelegy', status: 'In Progress', priority: 'High', type: 'bug', summary: 'Improvement Task', dueDate: '2026-02-15', signOffDate: '2026-02-10', jiraLink: 'https://www.youtube.com', veevaLink: 'https://veeva.example.com/nucala/doc-11078', binderLink: 'https://binder.example.com/nucala/binder-11078' },
    { id: 67890, title: 'WUNNEDGSK-13408', client: 'Augmentin', status: 'Pending Review', priority: 'Medium', type: 'incident', summary: 'Localisation', dueDate: '2026-02-20', signOffDate: '2026-02-18', jiraLink: 'https://jira.example.com/browse/WUNNEDGSK-13408', veevaLink: 'https://veeva.example.com/augmentin/doc-13408', binderLink: 'https://binder.example.com/augmentin/binder-13408' },
    { id: 54321, title: 'WUNNEDGSK-50531', client: 'Nucala', status: 'Completed', priority: 'Low', type: 'bug', summary: 'Improvement Task', dueDate: '2026-01-30', signOffDate: '2026-01-28', jiraLink: 'https://jira.uhub.biz', veevaLink: 'https://veeva.example.com/trelegy/doc-20439', binderLink: 'https://binder.example.com/trelegy/binder-20439' },
    { id: 98765, title: 'WUNNEDGSK-48540', client: 'Shingrix', status: 'Open', priority: 'High', type: 'task', summary: 'Bug Fix', dueDate: '2026-02-05', signOffDate: '2026-02-01', jiraLink: 'https://jira.example.com/browse/WUNNEDGSK-48540', veevaLink: 'https://veeva.example.com/shingrix/doc-48540', binderLink: 'https://binder.example.com/shingrix/binder-48540' },
    { id: 55555, title: 'WUNNEDGSK-49358', client: 'Arexvy', status: 'Planned', priority: 'Low', type: 'feature', summary: 'Generate assets', dueDate: '2026-03-10', signOffDate: '2026-03-05', jiraLink: 'https://jira.example.com/browse/WUNNEDGSK-49358', veevaLink: 'https://veeva.example.com/arexvy/doc-49358', binderLink: 'https://binder.example.com/arexvy/binder-49358' }
];

/**
 * Create a sidebar ticket element
 * @param {Object} ticket - Ticket object
 * @returns {HTMLElement} Ticket element
 */
function createSidebarTicketElement(ticket) {
    const li = document.createElement('li');
    li.className = 'sidebar-ticket-item';
    li.tabIndex = 0;

    const issueType = ticket.issue_type || 'task';
    const typeMeta = ticketTypeToMeta(issueType);
    
    // Format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return dateStr;
    };

    // Build flags info
    let flagsInfo = '';
    if (ticket.flags) {
        const flags = [];
        if (ticket.flags.risk_flag) flags.push('🚩 Risk');
        if (ticket.flags.tech_triage_missed) flags.push('⚠️ Triage');
        flagsInfo = flags.length > 0 ? flags.join(', ') : 'None';
    }

    li.innerHTML = `
        <div class="ticket-header">
            <div class="sidebar-ticket-icon" title="${escapeHtml(issueType)}" aria-hidden="true">${typeMeta.icon}</div>
            <div class="sidebar-ticket-content">
                <div class="sidebar-ticket-title">${escapeHtml(ticket.key || '')}</div>
                <div class="sidebar-ticket-meta"><span>${escapeHtml(ticket.current_status || '')}</span></div>
            </div>
            <div class="accordion-indicator">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>
        <div class="ticket-accordion-body">
            <div class="detail-content-inner">
                <div class="detail-field">
                    <label class="detail-field-label">Summary</label>
                    <div class="detail-field-value">${escapeHtml(ticket.summary || 'No summary available')}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-field">
                        <label class="detail-field-label">Due Date</label>
                        <div class="detail-field-value">${formatDate(ticket.due_date)}</div>
                    </div>
                </div>
                ${flagsInfo !== 'None' ? `
                <div class="detail-field">
                    <label class="detail-field-label">Flags</label>
                    <div class="detail-field-value">${escapeHtml(flagsInfo)}</div>
                </div>` : ''}
            </div>
        </div>
    `;

    li.addEventListener('click', (e) => {
        const isActive = li.classList.contains('active');
        document.querySelectorAll('.sidebar-ticket-item.active').forEach(n => n.classList.remove('active'));
        if (!isActive) {
            li.classList.add('active');
        }
    });

    return li;
}

/**
 * Display ticket details in the detail panel
 * @param {Object} ticket - Ticket object to display
 */
// showTicketDetail logic removed - tickets now expand as accordions inside the sidebar.

/**
 * Render tickets in the sidebar
 * @param {Array} tickets - Array of ticket objects
 */
function renderTickets(tickets) {
    const sidebarTickets = document.getElementById('sidebar-tickets');
    if (!sidebarTickets) return;
    sidebarTickets.innerHTML = '';
    if (!tickets || tickets.length === 0) {
        sidebarTickets.innerHTML = '<div class="sidebar-empty">No tickets</div>';
        return;
    }
    // Sort tickets by due date (closest first)
    const sortedTickets = [...tickets].sort((a, b) => {
        const dateA = new Date(a.due_date || '9999-12-31');
        const dateB = new Date(b.due_date || '9999-12-31');
        return dateA - dateB;
    });
    sortedTickets.forEach(t => sidebarTickets.appendChild(createSidebarTicketElement(t)));
}

/**
 * Fetch tickets from backend based on logged-in user
 */
function fetchTickets() {
    // Replace '/api/tickets' with real backend endpoint when confirmed
    fetch('/api/tickets')
        .then(r => r.json())
        .then(data => {
            renderTickets(data);
        })
        .catch(err => {
            console.warn('Could not fetch tickets, using sample data', err);
            renderTickets(sampleTickets);
        });
}