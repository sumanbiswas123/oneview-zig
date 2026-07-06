# Dashboard Code Architecture - Modular Structure

## Overview

The dashboard code has been refactored into a modular architecture for better maintainability, reusability, and separation of concerns.

## Module Structure

### 1. **utils.js** - Utility Functions

**Location:** `/src/renderer/lib/utils.js`
**Exports:**

- `escapeHtml(str)` - Escapes HTML special characters for safe DOM insertion
- `ticketTypeToMeta(type)` - Returns metadata (icon and CSS class) for ticket types

**Usage:** Core utilities used by multiple modules

---

### 2. **notifications.js** - Toast Notification System

**Location:** `/src/renderer/lib/notifications.js`
**Exports:**

- `showToast(message, type, duration)` - Shows a toast notification
  - `type`: 'error', 'success', 'info', 'warning'
  - `duration`: milliseconds before auto-dismiss (default: 4000ms)

**Usage:** Global notification system accessible from anywhere

---

### 3. **webview.js** - Webview Functionality

**Location:** `/src/renderer/lib/webview.js`
**Exports:**

- `loadUrlInWebview(url)` - Loads a URL into the webview
- `closeWebview()` - Closes and hides the webview
- `openWebviewInNewWindow()` - Opens webview content in a new browser window
- `initializeWebview()` - Sets up webview event listeners

**Features:**

- Automatic zoom factor adjustment
- Error handling with toast notifications
- Duplicate event listener prevention

---

### 4. **tickets.js** - Ticket Rendering & Management

**Location:** `/src/renderer/lib/tickets.js`
**Exports:**

- `sampleTickets` - Sample ticket data
- `createSidebarTicketElement(ticket)` - Creates a sidebar ticket item
- `showTicketDetail(ticket)` - Displays ticket details in the detail panel
- `renderTickets(tickets)` - Renders all tickets sorted by due date
- `fetchTickets()` - Fetches tickets from backend or uses sample data

**Features:**

- Automatic sorting by due date
- Dynamic detail panel rendering
- Link click interception (opens in webview)
- Responsive sidebar collapse/expand

---

### 5. **modals.js** - Modal Dialogs

**Location:** `/src/renderer/lib/modals.js`
**Exports:**

- `initializeChangePasswordModal()` - Sets up change password dialog
- `initializeProfileMenu()` - Sets up profile menu with dropdown actions

**Features:**

- Change Password Modal:
  - Password validation (match, min 6 chars)
  - Form submission handling
  - Keyboard navigation (Escape to close)
  - Overlay click detection
- Profile Menu:
  - Profile picture upload with localStorage persistence
  - Change password access
  - Logout with session cleanup
  - Arrow key navigation
  - Auto-focus management

---

### 6. **dashboard.js** - Main Entry Point

**Location:** `/src/renderer/pages/dashboard/dashboard.js`
**Responsibility:**

- Loads and initializes all modules
- Sets up DOMContentLoaded event
- Coordinates module initialization order

**Module Load Order:**

1. Utils (required by all others)
2. Notifications (required by most modules)
3. Webview
4. Tickets
5. Modals
6. Dashboard initialization

---

## File Organization

```
src/renderer/
├── assets/                 # Shared assets
├── components/             # Shared components
│   └── titlebar/           # Titlebar component
│       ├── titlebar.css
│       └── titlebar.js
├── lib/                    # Shared library/utility modules
│   ├── modals.js
│   ├── notifications.js
│   ├── tickets.js
│   ├── utils.js
│   ├── webview.js
│   └── webview-preload.js
├── pages/                  # Application pages
│   ├── appstore/
│   │   ├── appstore.css
│   │   ├── appstore.html
│   │   └── appstore.js
│   ├── dashboard/
│   │   ├── dashboard.css
│   │   ├── dashboard.html
│   │   └── dashboard.js
│   ├── dev-runner/
│   │   ├── dev-runner.html
│   │   └── dev-runner.js
│   ├── login/
│   │   ├── index.html      # Login page (entry point)
│   │   ├── login.css
│   │   └── login.js
│   └── runner/
│       ├── runner.css
│       ├── runner.html
│       └── runner.js
└── styles/                 # Global styles
    └── fonts.css
```

## Usage Examples

### Loading a URL in Webview

```javascript
loadUrlInWebview("https://example.com");
```

### Showing a Notification

```javascript
showToast("Operation successful!", "success", 3000);
```

### Displaying Ticket Details

```javascript
showTicketDetail(ticketObject);
```

### Fetching and Rendering Tickets

```javascript
fetchTickets(); // Automatically renders in sidebar
```

## Dependencies

### Module Dependencies Graph

```
utils.js
  ├─ notifications.js
  ├─ webview.js
  ├─ tickets.js
  │  └─ notifications.js
  ├─ modals.js
  │  └─ notifications.js
  └─ dashboard.js (main entry)
```

### Global Functions Required

- `showToast()` must be called before or after notifications.js loads
- `escapeHtml()` must be called before or after utils.js loads
- `ticketTypeToMeta()` must be called before or after utils.js loads

## Benefits of Modular Structure

1. **Maintainability** - Each module has a single responsibility
2. **Reusability** - Modules can be used independently
3. **Testability** - Individual modules can be unit tested
4. **Scalability** - Easy to add new modules or extend existing ones
5. **Code Organization** - Clear separation of concerns
6. **Load Performance** - Deferred loading of independent modules

## Future Improvements

1. **CSS Modularization** - Split dashboard.css into component-specific files:
   - base.css (variables, fonts, reset)
   - layout.css (grid, positioning)
   - components.css (buttons, cards, etc.)
   - webview.css
   - modal.css
   - notifications.css

2. **Dependency Management** - Consider using a module bundler (Webpack, Vite)

3. **State Management** - Consider implementing a state manager for ticket data

4. **API Integration** - Create an api.js module for backend communication

5. **Error Handling** - Create an error.js module for centralized error handling
