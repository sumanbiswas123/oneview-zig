const std = @import("std");
const Webview = @import("webview").Webview;

const EasyApp = Webview.Easy(App);

const UI_ROOT = "C:\\Users\\SumanBiswas\\Downloads\\oneview_port\\ui";
const SERVER_PORT: u16 = 9731;
const SERVER_PORT_STR = std.fmt.comptimePrint("{d}", .{SERVER_PORT});
const BACKEND_HOST = "10.215.56.196";
const BACKEND_PORT: u16 = 8009; // changed to 8009 as requested
const BACKEND_PORT2: u16 = 5000; // connectivity ping server
const PROXY_ORIGIN = "http://127.0.0.1:" ++ SERVER_PORT_STR;

// ─── Child Webview C++ Helper bindings ─────────────────────────────────────────
extern "c" fn child_webview_preinit(parent_hwnd: ?*anyopaque) void;
extern "c" fn child_webview_create(parent_hwnd: ?*anyopaque, url: [*:0]const u8, is_popup: bool, key: [*:0]const u8, disable_gpu: bool) ?*anyopaque;
extern "c" fn child_webview_destroy(handle: ?*anyopaque) void;
extern "c" fn child_webview_set_bounds(handle: ?*anyopaque, x: c_int, y: c_int, w: c_int, h: c_int, visible: bool) void;
extern "c" fn child_webview_navigate(handle: ?*anyopaque, url: [*:0]const u8) void;
extern "c" fn child_webview_get_hwnd(handle: ?*anyopaque) ?*anyopaque;
extern "c" fn child_webview_capture_page(
    handle: ?*anyopaque,
    full_page: bool,
    scroll_height: c_int,
    callback: *const fn(ctx: ?*anyopaque, success: bool, json_str: [*:0]const u8) callconv(.c) void,
    ctx: ?*anyopaque
) void;
extern "c" fn child_webview_add_init_script(handle: ?*anyopaque, script_utf8: [*:0]const u8) void;
extern "c" fn child_webview_execute_script(
    handle: ?*anyopaque,
    script_utf8: [*:0]const u8,
    callback: *const fn(ctx: ?*anyopaque, success: bool, json_str: [*:0]const u8) callconv(.c) void,
    ctx: ?*anyopaque
) void;
extern "c" fn child_webview_set_message_callback(callback: *const fn(key: [*:0]const u8, message: [*:0]const u8) callconv(.c) void) void;
extern "c" fn child_webview_detach(handle: ?*anyopaque, title_utf8: [*:0]const u8) void;
extern "c" fn child_webview_attach(handle: ?*anyopaque) void;
extern "c" fn child_webview_open_devtools(handle: ?*anyopaque) void;
extern "c" fn child_webview_clear_data(handle: ?*anyopaque, origin_utf8: [*:0]const u8, types_utf8: [*:0]const u8) void;
extern "c" fn child_webview_go_back(handle: ?*anyopaque) void;
extern "c" fn child_webview_go_forward(handle: ?*anyopaque) void;
extern "c" fn child_webview_reload(handle: ?*anyopaque) void;


// ─── Native file operations (WinINet download, Shell32 unzip, SHFileOperation delete) ──
extern "c" fn native_download_file(url: [*:0]const u8, target_path: [*:0]const u8) c_int;
extern "c" fn native_unzip_file(zip_path: [*:0]const u8, extract_path: [*:0]const u8) c_int;
extern "c" fn native_delete_path(path: [*:0]const u8) c_int;
extern "c" fn get_native_download_progress(progress: *f64, received: *u32, total: *u32, target_path: [*]u8, max_len: c_int) void;

fn logMsg(comptime fmt: []const u8, args: anytype) void {
    const appdata = getEnvVar(std.heap.page_allocator, "TEMP");
    if (appdata.len == 0) return;
    defer std.heap.page_allocator.free(appdata);
    var path_buf: [512]u8 = undefined;
    const path = std.fmt.bufPrintZ(&path_buf, "{s}\\oneview_debug.log", .{appdata}) catch return;
    const fh = fopen(path, "ab") orelse return;
    defer _ = fclose(fh);
    var buf: [2048]u8 = undefined;
    const msg = std.fmt.bufPrint(&buf, fmt, args) catch return;
    _ = fwrite(msg.ptr, 1, msg.len, fh);
    _ = fwrite("\n", 1, 1, fh);
}


// ─── Win32 env var helpers ──────────────────────────────────────────────────
extern "kernel32" fn GetEnvironmentVariableA(lpName: [*:0]const u8, lpBuffer: [*]u8, nSize: u32) callconv(.winapi) u32;

fn getEnvVar(allocator: std.mem.Allocator, name: [*:0]const u8) []const u8 {
    var buf: [2048]u8 = undefined;
    const len = GetEnvironmentVariableA(name, &buf, @intCast(buf.len));
    if (len == 0 or len >= buf.len) return "";
    return allocator.dupe(u8, buf[0..len]) catch "";
}

// ─── Win32 process helper (for file ops via PowerShell) ─────────────────────
const STARTUPINFOA = extern struct {
    cb: u32 = @sizeOf(@This()),
    lpReserved: ?[*:0]u8 = null,
    lpDesktop: ?[*:0]u8 = null,
    lpTitle: ?[*:0]u8 = null,
    dwX: u32 = 0, dwY: u32 = 0, dwXSize: u32 = 0, dwYSize: u32 = 0,
    dwXCountChars: u32 = 0, dwYCountChars: u32 = 0, dwFillAttribute: u32 = 0,
    dwFlags: u32 = 0, wShowWindow: u16 = 0, cbReserved2: u16 = 0,
    lpReserved2: ?[*]u8 = null,
    hStdInput: ?*anyopaque = null, hStdOutput: ?*anyopaque = null, hStdError: ?*anyopaque = null,
};
const PROCESS_INFORMATION = extern struct {
    hProcess: ?*anyopaque = null, hThread: ?*anyopaque = null,
    dwProcessId: u32 = 0, dwThreadId: u32 = 0,
};
extern "kernel32" fn CreateProcessA(
    lpApplicationName: ?[*:0]const u8, lpCommandLine: ?[*:0]u8,
    lpProcessAttributes: ?*anyopaque, lpThreadAttributes: ?*anyopaque,
    bInheritHandles: u32, dwCreationFlags: u32,
    lpEnvironment: ?*anyopaque, lpCurrentDirectory: ?[*:0]const u8,
    lpStartupInfo: *STARTUPINFOA, lpProcessInformation: *PROCESS_INFORMATION,
) callconv(.winapi) u32;
extern "kernel32" fn WaitForSingleObject(hHandle: ?*anyopaque, dwMilliseconds: u32) callconv(.winapi) u32;
extern "kernel32" fn GetExitCodeProcess(hHandle: ?*anyopaque, lpExitCode: *u32) callconv(.winapi) u32;
extern "kernel32" fn CloseHandle(hObject: ?*anyopaque) callconv(.winapi) u32;

fn runShellCmd(allocator: std.mem.Allocator, cmd: []const u8) bool {
    const tmp = std.fmt.allocPrint(allocator, "powershell.exe -NoProfile -NonInteractive -Command \"{s}\"", .{cmd}) catch return false;
    defer allocator.free(tmp);
    const cmdline = allocator.dupeZ(u8, tmp) catch return false;
    defer allocator.free(cmdline);
    var si = STARTUPINFOA{};
    var pi = PROCESS_INFORMATION{};
    const CREATE_NO_WINDOW: u32 = 0x08000000;
    const ok = CreateProcessA(null, cmdline.ptr, null, null, 0, CREATE_NO_WINDOW, null, null, &si, &pi);
    if (ok == 0) return false;
    _ = WaitForSingleObject(pi.hProcess, 120000); // 2 min timeout
    var exit_code: u32 = 1;
    _ = GetExitCodeProcess(pi.hProcess, &exit_code);
    _ = CloseHandle(pi.hProcess);
    _ = CloseHandle(pi.hThread);
    return exit_code == 0;
}

// ─── C stdlib for file I/O ───────────────────────────────────────────────────
extern "c" fn fopen(path: [*:0]const u8, mode: [*:0]const u8) callconv(.c) ?*anyopaque;
extern "c" fn fseek(stream: *anyopaque, offset: c_long, whence: c_int) callconv(.c) c_int;
extern "c" fn ftell(stream: *anyopaque) callconv(.c) c_long;
extern "c" fn fread(ptr: [*]u8, size: usize, count: usize, stream: *anyopaque) callconv(.c) usize;
extern "c" fn fwrite(ptr: [*]const u8, size: usize, count: usize, stream: *anyopaque) callconv(.c) usize;
extern "c" fn fclose(stream: *anyopaque) callconv(.c) c_int;

// ─── WinSock2 & Win32 bindings ───────────────────────────────────────────────
extern "kernel32" fn Sleep(dwMilliseconds: u32) callconv(.winapi) void;
extern "kernel32" fn LoadLibraryA(lpLibFileName: [*:0]const u8) callconv(.winapi) ?*anyopaque;
extern "kernel32" fn GetProcAddress(hModule: ?*anyopaque, lpProcName: [*:0]const u8) callconv(.winapi) ?*anyopaque;
extern "kernel32" fn CreateDirectoryA(lpPathName: [*:0]const u8, lpSecurityAttributes: ?*anyopaque) callconv(.winapi) i32;
extern "user32" fn ShowWindow(hWnd: ?*anyopaque, nCmdShow: c_int) callconv(.winapi) u32;
extern "user32" fn GetWindowLongA(hWnd: ?*anyopaque, nIndex: c_int) callconv(.winapi) i32;
extern "user32" fn SetWindowLongA(hWnd: ?*anyopaque, nIndex: c_int, dwNewLong: i32) callconv(.winapi) i32;
extern "user32" fn SetWindowLongPtrA(hWnd: ?*anyopaque, nIndex: c_int, dwNewLong: isize) callconv(.winapi) isize;
extern "user32" fn SetWindowPos(hWnd: ?*anyopaque, hWndInsertAfter: ?*anyopaque, X: c_int, Y: c_int, cx: c_int, cy: c_int, uFlags: u32) callconv(.winapi) i32;
extern "user32" fn ClientToScreen(hWnd: ?*anyopaque, lpPoint: *POINT) callconv(.winapi) i32;
extern "user32" fn GetDC(hWnd: ?*anyopaque) callconv(.winapi) ?*anyopaque;
extern "user32" fn ReleaseDC(hWnd: ?*anyopaque, hDC: ?*anyopaque) callconv(.winapi) c_int;
extern "user32" fn SetParent(hWndChild: ?*anyopaque, hWndNewParent: ?*anyopaque) callconv(.winapi) ?*anyopaque;
extern "user32" fn SetWindowsHookExA(idHook: c_int, lpfn: ?*const anyopaque, hmod: ?*anyopaque, dwThreadId: u32) callconv(.winapi) ?*anyopaque;
extern "user32" fn UnhookWindowsHookEx(hhk: ?*anyopaque) callconv(.winapi) i32;
extern "user32" fn CallNextHookEx(hhk: ?*anyopaque, nCode: c_int, wParam: usize, lParam: usize) callconv(.winapi) isize;
extern "user32" fn CallWindowProcA(lpPrevWndFunc: ?*anyopaque, hWnd: ?*anyopaque, Msg: u32, wParam: usize, lParam: usize) callconv(.winapi) isize;
extern "user32" fn SetLayeredWindowAttributes(hWnd: ?*anyopaque, crKey: u32, bAlpha: u8, dwFlags: u32) callconv(.winapi) i32;
extern "gdi32" fn GetDeviceCaps(hDC: ?*anyopaque, nIndex: c_int) callconv(.winapi) c_int;

pub const NOTIFYICONDATAA = extern struct {
    cbSize: u32 = @sizeOf(@This()),
    hWnd: ?*anyopaque = null,
    uID: u32 = 0,
    uFlags: u32 = 0,
    uCallbackMessage: u32 = 0,
    hIcon: ?*anyopaque = null,
    szTip: [128]u8 = [_]u8{0} ** 128,
    dwState: u32 = 0,
    dwStateMask: u32 = 0,
    szInfo: [256]u8 = [_]u8{0} ** 256,
    uTimeoutOrVersion: u32 = 0,
    szInfoTitle: [64]u8 = [_]u8{0} ** 64,
    dwInfoFlags: u32 = 0,
    guidItem: [16]u8 = [_]u8{0} ** 16,
    hBalloonIcon: ?*anyopaque = null,
};
extern "shell32" fn Shell_NotifyIconA(dwMessage: u32, lpData: *NOTIFYICONDATAA) callconv(.winapi) i32;
extern "kernel32" fn GetModuleHandleA(lpModuleName: ?[*:0]const u8) callconv(.winapi) ?*anyopaque;
extern "user32" fn LoadIconA(hInstance: ?*anyopaque, lpIconName: [*:0]const u8) callconv(.winapi) ?*anyopaque;
extern "user32" fn CreatePopupMenu() callconv(.winapi) ?*anyopaque;
extern "user32" fn AppendMenuA(hMenu: ?*anyopaque, uFlags: u32, uIDNewItem: usize, lpNewItem: ?[*:0]const u8) callconv(.winapi) i32;
extern "user32" fn TrackPopupMenu(hMenu: ?*anyopaque, uFlags: u32, x: i32, y: i32, nReserved: i32, hWnd: ?*anyopaque, prcRect: ?*anyopaque) callconv(.winapi) i32;
extern "user32" fn DestroyMenu(hMenu: ?*anyopaque) callconv(.winapi) i32;
extern "user32" fn PostMessageA(hWnd: ?*anyopaque, Msg: u32, wParam: usize, lParam: isize) callconv(.winapi) i32;

extern "user32" fn GetCursorPos(lpPoint: *POINT) callconv(.winapi) i32;


const MF_STRING: u32 = 0x0000;
const MF_SEPARATOR: u32 = 0x0800;
const MF_GRAYED: u32 = 0x0001;
const TPM_RIGHTBUTTON: u32 = 0x0002;
const TPM_BOTTOMALIGN: u32 = 0x0020;
const WM_COMMAND: u32 = 0x0111;
const TRAY_MENU_OPEN: usize = 1001;
const TRAY_MENU_QUIT: usize = 1002;

const SW_HIDE = 0;
const SW_SHOW = 5;

// SetWindowLongA index constants
const GWL_STYLE:      c_int = -16;
const GWL_EXSTYLE:    c_int = -20;
const GWLP_HWNDPARENT: c_int = -8;

// SetWindowPos flags
const SWP_NOSIZE:       u32 = 0x0001;
const SWP_NOMOVE:       u32 = 0x0002;
const SWP_NOZORDER:     u32 = 0x0004;
const SWP_SHOWWINDOW:   u32 = 0x0040;
const SWP_HIDEWINDOW:   u32 = 0x0080;
const SWP_FRAMECHANGED: u32 = 0x0020;
const SWP_NOACTIVATE:   u32 = 0x0010;

// POINT struct for ClientToScreen
const POINT = extern struct { x: i32, y: i32 };

fn getWindowDpi(hwnd: ?*anyopaque) u32 {
    const hdc = GetDC(hwnd);
    if (hdc) |h| {
        defer _ = ReleaseDC(hwnd, h);
        const dpi = GetDeviceCaps(h, 88); // 88 is LOGPIXELSX
        if (dpi > 0) return @intCast(dpi);
    }
    return 96;
}

fn scaleCssToPhysical(val: c_int, dpi: u32) c_int {
    return @divTrunc(val * @as(c_int, @intCast(dpi)), 96);
}

const WSADATA = extern struct {
    wVersion: u16, wHighVersion: u16,
    szDescription: [257]u8, szSystemStatus: [129]u8,
    iMaxSockets: u16, iMaxUdpDg: u16, lpVendorInfo: ?*u8,
};
const SOCKADDR_IN = extern struct {
    sin_family: u16, sin_port: u16, sin_addr: u32, sin_zero: [8]u8,
};
const INVALID_SOCKET: usize = ~@as(usize, 0);
const SOCKET_ERROR: c_int = -1;
const AF_INET: u16 = 2;
const SOCK_STREAM: c_int = 1;
const SOL_SOCKET: c_int = 0xFFFF;
const SO_REUSEADDR: c_int = 4;
const IPPROTO_TCP: c_int = 6;

extern "ws2_32" fn WSAStartup(wVersionRequired: u16, lpWSAData: *WSADATA) callconv(.winapi) c_int;
extern "ws2_32" fn WSACleanup() callconv(.winapi) c_int;
extern "ws2_32" fn socket(af: c_int, stype: c_int, protocol: c_int) callconv(.winapi) usize;
extern "ws2_32" fn bind(s: usize, name: *const SOCKADDR_IN, namelen: c_int) callconv(.winapi) c_int;
extern "ws2_32" fn connect(s: usize, name: *const SOCKADDR_IN, namelen: c_int) callconv(.winapi) c_int;
extern "ws2_32" fn listen(s: usize, backlog: c_int) callconv(.winapi) c_int;
extern "ws2_32" fn accept(s: usize, addr: ?*SOCKADDR_IN, addrlen: ?*c_int) callconv(.winapi) usize;
extern "ws2_32" fn recv(s: usize, buf: [*]u8, len: c_int, flags: c_int) callconv(.winapi) c_int;
extern "ws2_32" fn send(s: usize, buf: [*]const u8, len: c_int, flags: c_int) callconv(.winapi) c_int;
extern "ws2_32" fn closesocket(s: usize) callconv(.winapi) c_int;
extern "ws2_32" fn setsockopt(s: usize, level: c_int, optname: c_int, optval: *const c_int, optlen: c_int) callconv(.winapi) c_int;
extern "ws2_32" fn htons(hostshort: u16) callconv(.winapi) u16;
extern "ws2_32" fn htonl(hostlong: u32) callconv(.winapi) u32;
extern "ws2_32" fn inet_addr(cp: [*:0]const u8) callconv(.winapi) u32;

// ─── Content View Structure ───────────────────────────────────────────────
pub const ContentView = struct {
    cpp_handle: ?*anyopaque = null,
    panel_hwnd: ?*anyopaque = null,
    // Last known CSS-pixel bounds from JS (used by WM_WINDOWPOSCHANGED to reposition)
    last_x: c_int = 0,
    last_y: c_int = 0,
    last_w: c_int = 0,
    last_h: c_int = 0,
    last_visible: bool = false,
    pending_url: ?[:0]const u8 = null,
    loaded_url: ?[]const u8 = null,
    partition: ?[]const u8 = null,
};

fn applyViewBounds(main_window_hwnd: ?*anyopaque, view: ContentView) void {
    if (view.cpp_handle) |handle| {
        const dpi = getWindowDpi(main_window_hwnd);
        const px = scaleCssToPhysical(view.last_x, dpi);
        const py = scaleCssToPhysical(view.last_y, dpi);
        const pw = scaleCssToPhysical(view.last_w, dpi);
        const ph = scaleCssToPhysical(view.last_h, dpi);
        child_webview_set_bounds(handle, px, py, pw, ph, view.last_visible);
    }
}

// ─── App context ─────────────────────────────────────────────────────────────
pub const App = struct {
    allocator: std.mem.Allocator,
    ping_count: u32 = 0,
    main_window_hwnd: ?*anyopaque = null,
    child_views: std.StringHashMap(ContentView),
    main_webview: ?*Webview = null,
    pending_startup_arg: ?[]const u8 = null,

    pub fn init(allocator: std.mem.Allocator) App {
        return .{
            .allocator = allocator,
            .child_views = std.StringHashMap(ContentView).init(allocator),
            .main_webview = null,
            .pending_startup_arg = null,
        };
    }
};

fn allocPrintZ(allocator: std.mem.Allocator, comptime fmt: []const u8, args: anytype) ![:0]u8 {
    const slice = try std.fmt.allocPrint(allocator, fmt, args);
    defer allocator.free(slice);
    return allocator.dupeZ(u8, slice);
}

// ─── MIME types ──────────────────────────────────────────────────────────────
fn mimeType(path: []const u8) []const u8 {
    if (std.mem.endsWith(u8, path, ".html"))  return "text/html; charset=utf-8";
    if (std.mem.endsWith(u8, path, ".js"))    return "application/javascript; charset=utf-8";
    if (std.mem.endsWith(u8, path, ".css"))   return "text/css; charset=utf-8";
    if (std.mem.endsWith(u8, path, ".svg"))   return "image/svg+xml";
    if (std.mem.endsWith(u8, path, ".png"))   return "image/png";
    if (std.mem.endsWith(u8, path, ".jpg"))   return "image/jpeg";
    if (std.mem.endsWith(u8, path, ".ico"))   return "image/x-icon";
    if (std.mem.endsWith(u8, path, ".json"))  return "application/json";
    if (std.mem.endsWith(u8, path, ".woff2")) return "font/woff2";
    if (std.mem.endsWith(u8, path, ".woff"))  return "font/woff";
    if (std.mem.endsWith(u8, path, ".ttf"))   return "font/ttf";
    return "application/octet-stream";
}

var last_ext_path_buf: [512]u8 = undefined;
var last_ext_path_len: usize = 0;
var last_ext_path_mutex: std.atomic.Mutex = .unlocked;

fn setLastExtensionPath(path: []const u8) void {
    while (!last_ext_path_mutex.tryLock()) {}
    defer last_ext_path_mutex.unlock();
    
    const copy_len = @min(path.len, last_ext_path_buf.len);
    @memcpy(last_ext_path_buf[0..copy_len], path[0..copy_len]);
    last_ext_path_len = copy_len;
}

fn getLastExtensionPath(allocator: std.mem.Allocator) ?[]const u8 {
    while (!last_ext_path_mutex.tryLock()) {}
    defer last_ext_path_mutex.unlock();
    
    if (last_ext_path_len == 0) return null;
    return allocator.dupe(u8, last_ext_path_buf[0..last_ext_path_len]) catch null;
}

fn decodePercent(allocator: std.mem.Allocator, input: []const u8) ![]u8 {
    var current = try allocator.dupe(u8, input);
    errdefer allocator.free(current);
    
    var iterations: usize = 0;
    while (iterations < 3) : (iterations += 1) {
        var has_percent = false;
        var decoded = std.ArrayList(u8).empty;
        defer decoded.deinit(allocator);
        
        var i: usize = 0;
        while (i < current.len) {
            if (current[i] == '%' and i + 2 < current.len) {
                const hex = current[i + 1 .. i + 3];
                if (std.fmt.parseInt(u8, hex, 16)) |val| {
                    try decoded.append(allocator, val);
                    if (val == '%') {
                        has_percent = true;
                    }
                } else |_| {
                    try decoded.append(allocator, current[i]);
                }
                i += 3;
            } else if (current[i] == '+') {
                try decoded.append(allocator, ' ');
                i += 1;
            } else {
                try decoded.append(allocator, current[i]);
                i += 1;
            }
        }
        
        allocator.free(current);
        current = try allocator.dupe(u8, decoded.items);
        if (!has_percent and std.mem.indexOfScalar(u8, current, '%') == null) {
            break;
        }
    }
    return current;
}

fn startsWithCI(haystack: []const u8, needle: []const u8) bool {
    if (haystack.len < needle.len) return false;
    return std.ascii.eqlIgnoreCase(haystack[0..needle.len], needle);
}

// ─── CORS proxy ──────────────────────────────────────────────────────────────

fn sendSimple(sock: usize, status: []const u8, body: []const u8) void {
    const resp = std.fmt.allocPrint(std.heap.page_allocator,
        "HTTP/1.0 {s}\r\nContent-Length: {d}\r\n\r\n{s}",
        .{ status, body.len, body }) catch return;
    defer std.heap.page_allocator.free(resp);
    _ = send(sock, resp.ptr, @intCast(resp.len), 0);
}

fn sendJson(sock: usize, body: []const u8) void {
    const resp = std.fmt.allocPrint(std.heap.page_allocator,
        "HTTP/1.0 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: {d}\r\n\r\n{s}",
        .{ body.len, body }) catch return;
    defer std.heap.page_allocator.free(resp);
    _ = send(sock, resp.ptr, @intCast(resp.len), 0);
}

fn proxyToBackendPort(allocator: std.mem.Allocator, client_sock: usize, raw_request: []const u8, backend_port: u16, prefix: []const u8) void {
    // Parse HTTP method, path, version from first line
    const line_end = std.mem.indexOf(u8, raw_request, "\r\n") orelse return;
    const first_line = raw_request[0..line_end];

    const sp1 = std.mem.indexOfScalar(u8, first_line, ' ') orelse return;
    const sp2 = std.mem.lastIndexOfScalar(u8, first_line, ' ') orelse return;
    if (sp1 == sp2) return;
    const method = first_line[0..sp1];
    const full_path = first_line[sp1 + 1 .. sp2];

    // Strip prefix from path: "/proxy/auth/login" → "/auth/login"
    const backend_path = if (std.mem.startsWith(u8, full_path, prefix))
        full_path[prefix.len..]
    else
        full_path;

    // Handle OPTIONS preflight locally
    if (std.mem.eql(u8, method, "OPTIONS")) {
        const preflight =
            "HTTP/1.0 204 No Content\r\n" ++
            "Access-Control-Allow-Origin: " ++ PROXY_ORIGIN ++ "\r\n" ++
            "Access-Control-Allow-Credentials: true\r\n" ++
            "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH\r\n" ++
            "Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cookie, Accept\r\n" ++
            "Access-Control-Max-Age: 86400\r\n" ++
            "Content-Length: 0\r\n\r\n";
        _ = send(client_sock, preflight.ptr, @intCast(preflight.len), 0);
        return;
    }

    // Connect to backend via WinSock2
    const backend_sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (backend_sock == INVALID_SOCKET) {
        sendSimple(client_sock, "502 Bad Gateway", "Cannot connect to backend");
        return;
    }
    defer _ = closesocket(backend_sock);

    var addr = SOCKADDR_IN{
        .sin_family = AF_INET,
        .sin_port = htons(backend_port),
        .sin_addr = inet_addr(BACKEND_HOST ++ "\x00"),
        .sin_zero = [_]u8{0} ** 8,
    };
    if (connect(backend_sock, &addr, @sizeOf(SOCKADDR_IN)) == SOCKET_ERROR) {
        sendSimple(client_sock, "502 Bad Gateway", "Backend unreachable");
        return;
    }

    // Build forwarded request
    const headers_end_idx = std.mem.indexOf(u8, raw_request, "\r\n\r\n") orelse raw_request.len;
    const headers_section = raw_request[line_end + 2 .. headers_end_idx];
    const body_part = if (headers_end_idx + 4 < raw_request.len) raw_request[headers_end_idx + 4 ..] else "";

    var fwd = std.ArrayList(u8).empty;
    defer fwd.deinit(allocator);

    // First line: use HTTP/1.0 to avoid chunked encoding
    fwd.print(allocator, "{s} {s} HTTP/1.0\r\n", .{ method, backend_path }) catch return;
    fwd.print(allocator, "Host: {s}:{d}\r\n", .{ BACKEND_HOST, backend_port }) catch return;
    fwd.print(allocator, "Origin: http://{s}:{d}\r\n", .{ BACKEND_HOST, backend_port }) catch return;

    // Forward original headers, skipping ones we set manually
    var lines = std.mem.splitSequence(u8, headers_section, "\r\n");
    while (lines.next()) |line| {
        if (line.len == 0) continue;
        if (startsWithCI(line, "host:")) continue;
        if (startsWithCI(line, "origin:")) continue;
        if (startsWithCI(line, "connection:")) continue;
        if (startsWithCI(line, "referer:")) continue;
        fwd.appendSlice(allocator, line) catch return;
        fwd.appendSlice(allocator, "\r\n") catch return;
    }
    fwd.appendSlice(allocator, "Connection: close\r\n\r\n") catch return;
    if (body_part.len > 0) fwd.appendSlice(allocator, body_part) catch return;

    _ = send(backend_sock, fwd.items.ptr, @intCast(fwd.items.len), 0);

    // Read full backend response
    var resp_buf = std.ArrayList(u8).empty;
    defer resp_buf.deinit(allocator);
    var chunk: [8192]u8 = undefined;
    while (true) {
        const n = recv(backend_sock, &chunk, @intCast(chunk.len), 0);
        if (n <= 0) break;
        resp_buf.appendSlice(allocator, chunk[0..@intCast(n)]) catch break;
    }
    if (resp_buf.items.len == 0) {
        sendSimple(client_sock, "502 Bad Gateway", "Empty backend response");
        return;
    }

    // Rewrite CORS headers in response
    const resp_hdr_end = std.mem.indexOf(u8, resp_buf.items, "\r\n\r\n") orelse resp_buf.items.len;
    const resp_hdr = resp_buf.items[0..resp_hdr_end];
    const resp_body = if (resp_hdr_end + 4 < resp_buf.items.len) resp_buf.items[resp_hdr_end + 4 ..] else "";

    var out = std.ArrayList(u8).empty;
    defer out.deinit(allocator);

    var resp_lines = std.mem.splitSequence(u8, resp_hdr, "\r\n");
    const status_ln = resp_lines.next() orelse "HTTP/1.0 200 OK";
    out.appendSlice(allocator, status_ln) catch return;
    out.appendSlice(allocator, "\r\n") catch return;

    var has_acao = false;
    var has_acac = false;
    while (resp_lines.next()) |rl| {
        if (rl.len == 0) continue;
        if (startsWithCI(rl, "access-control-allow-origin:")) {
            out.appendSlice(allocator, "Access-Control-Allow-Origin: " ++ PROXY_ORIGIN ++ "\r\n") catch return;
            has_acao = true;
            continue;
        }
        if (startsWithCI(rl, "access-control-allow-credentials:")) {
            out.appendSlice(allocator, "Access-Control-Allow-Credentials: true\r\n") catch return;
            has_acac = true;
            continue;
        }
        out.appendSlice(allocator, rl) catch return;
        out.appendSlice(allocator, "\r\n") catch return;
    }
    if (!has_acao) out.appendSlice(allocator, "Access-Control-Allow-Origin: " ++ PROXY_ORIGIN ++ "\r\n") catch return;
    if (!has_acac) out.appendSlice(allocator, "Access-Control-Allow-Credentials: true\r\n") catch return;
    out.appendSlice(allocator, "\r\n") catch return;

    _ = send(client_sock, out.items.ptr, @intCast(out.items.len), 0);
    if (resp_body.len > 0) _ = send(client_sock, resp_body.ptr, @intCast(resp_body.len), 0);
}

fn proxyExternalUrl(allocator: std.mem.Allocator, client_sock: usize, target_url: []const u8) void {
    const HINTERNET = *anyopaque;

    const WinINet = struct {
        extern "wininet" fn InternetOpenA(lpszAgent: ?[*:0]const u8, dwAccessType: u32, lpszProxyName: ?[*:0]const u8, lpszProxyBypass: ?[*:0]const u8, dwFlags: u32) callconv(.winapi) ?HINTERNET;
        extern "wininet" fn InternetOpenUrlA(hInternet: HINTERNET, lpszUrl: [*:0]const u8, lpszHeaders: ?[*:0]const u8, dwHeadersLength: u32, dwFlags: u32, dwContext: usize) callconv(.winapi) ?HINTERNET;
        extern "wininet" fn InternetReadFile(hFile: HINTERNET, lpBuffer: [*]u8, dwNumberOfBytesToRead: u32, lpdwNumberOfBytesRead: *u32) callconv(.winapi) u32;
        extern "wininet" fn InternetCloseHandle(hInternet: HINTERNET) callconv(.winapi) u32;
    };

    const target_url_z = allocator.dupeZ(u8, target_url) catch return;
    defer allocator.free(target_url_z);

    const io = WinINet.InternetOpenA("Mozilla/5.0", 1, null, null, 0) orelse {
        sendSimple(client_sock, "502 Bad Gateway", "InternetOpen failed");
        return;
    };
    defer _ = WinINet.InternetCloseHandle(io);

    // 0x00800000 = INTERNET_FLAG_SECURE, 0x80000000 = INTERNET_FLAG_RELOAD
    const connection = WinINet.InternetOpenUrlA(io, target_url_z, null, 0, 0x00800000 | 0x80000000, 0) orelse {
        sendSimple(client_sock, "502 Bad Gateway", "Failed to reach target URL");
        return;
    };
    defer _ = WinINet.InternetCloseHandle(connection);

    var content = std.ArrayList(u8).empty;
    defer content.deinit(allocator);

    var buffer: [8192]u8 = undefined;
    while (true) {
        var read: u32 = 0;
        if (WinINet.InternetReadFile(connection, &buffer, @intCast(buffer.len), &read) == 0) break;
        if (read == 0) break;
        content.appendSlice(allocator, buffer[0..read]) catch break;
    }

    const header = std.fmt.allocPrint(allocator,
        "HTTP/1.0 200 OK\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: {d}\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: no-cache\r\n\r\n",
        .{ content.items.len }) catch return;
    defer allocator.free(header);

    _ = send(client_sock, header.ptr, @intCast(header.len), 0);
    if (content.items.len > 0) _ = send(client_sock, content.items.ptr, @intCast(content.items.len), 0);
}

// ─── Connection handler ───────────────────────────────────────────────────────

const CachedFile = struct {
    content: []const u8,
    mime: []const u8,
};

var g_static_files: ?std.StringHashMap(CachedFile) = null;

const win32_find = struct {
    const HANDLE = ?*anyopaque;
    const INVALID_HANDLE_VALUE = @as(HANDLE, @ptrFromInt(@as(usize, @bitCast(@as(isize, -1)))));
    const WIN32_FIND_DATAA = extern struct {
        dwFileAttributes: u32,
        ftCreationTime: [8]u8,
        ftLastAccessTime: [8]u8,
        ftLastWriteTime: [8]u8,
        nFileSizeHigh: u32,
        nFileSizeLow: u32,
        dwReserved0: u32,
        dwReserved1: u32,
        cFileName: [260]u8,
        cAlternateFileName: [14]u8,
    };
    extern "kernel32" fn FindFirstFileA(lpFileName: [*:0]const u8, lpFindFileData: *WIN32_FIND_DATAA) callconv(.winapi) HANDLE;
    extern "kernel32" fn FindNextFileA(hFindFile: HANDLE, lpFindFileData: *WIN32_FIND_DATAA) callconv(.winapi) i32;
    extern "kernel32" fn FindClose(hFindFile: HANDLE) callconv(.winapi) i32;
};

fn scanAndCacheDir(allocator: std.mem.Allocator, map: *std.StringHashMap(CachedFile), dir_path: []const u8) !void {
    const search_pattern = try std.fmt.allocPrint(allocator, "{s}\\*", .{dir_path});
    defer allocator.free(search_pattern);
    const search_pattern_z = try allocator.dupeZ(u8, search_pattern);
    defer allocator.free(search_pattern_z);

    var find_data: win32_find.WIN32_FIND_DATAA = undefined;
    const hFind = win32_find.FindFirstFileA(search_pattern_z.ptr, &find_data);
    if (hFind == win32_find.INVALID_HANDLE_VALUE) return;
    defer _ = win32_find.FindClose(hFind);

    while (true) {
        const name_len = std.mem.len(@as([*:0]const u8, @ptrCast(&find_data.cFileName)));
        const name = find_data.cFileName[0..name_len];

        if (!std.mem.eql(u8, name, ".") and !std.mem.eql(u8, name, "..")) {
            const sub_path = try std.fmt.allocPrint(allocator, "{s}\\{s}", .{ dir_path, name });
            defer allocator.free(sub_path);

            if ((find_data.dwFileAttributes & 0x10) != 0) { // FILE_ATTRIBUTE_DIRECTORY
                try scanAndCacheDir(allocator, map, sub_path);
            } else {
                const sub_path_z = try allocator.dupeZ(u8, sub_path);
                defer allocator.free(sub_path_z);

                if (fopen(sub_path_z.ptr, "rb")) |fh| {
                    defer _ = fclose(fh);
                    _ = fseek(fh, 0, 2);
                    const file_size: usize = @intCast(ftell(fh));
                    _ = fseek(fh, 0, 0);

                    const content = try allocator.alloc(u8, file_size);
                    errdefer allocator.free(content);
                    _ = fread(content.ptr, 1, file_size, fh);

                    if (std.mem.indexOf(u8, sub_path, UI_ROOT)) |ui_idx| {
                        const rel_path = sub_path[ui_idx + UI_ROOT.len ..];
                        const web_path_buf = try allocator.alloc(u8, rel_path.len);
                        errdefer allocator.free(web_path_buf);
                        std.mem.copyForwards(u8, web_path_buf, rel_path);
                        for (web_path_buf) |*c| {
                            if (c.* == '\\') {
                                c.* = '/';
                            }
                        }

                        const mime = try allocator.dupe(u8, mimeType(web_path_buf));
                        errdefer allocator.free(mime);

                        const cached = CachedFile{
                            .content = content,
                            .mime = mime,
                        };
                        try map.put(web_path_buf, cached);
                        std.debug.print("DEBUG: Cached UI static file: {s} -> {d} bytes\n", .{ web_path_buf, file_size });
                    }
                }
            }
        }

        if (win32_find.FindNextFileA(hFind, &find_data) == 0) break;
    }
}

fn populateStaticFilesCache(allocator: std.mem.Allocator) !void {
    var map = std.StringHashMap(CachedFile).init(allocator);
    errdefer {
        var it = map.iterator();
        while (it.next()) |entry| {
            allocator.free(entry.key_ptr.*);
            allocator.free(entry.value_ptr.*.content);
            allocator.free(entry.value_ptr.*.mime);
        }
        map.deinit();
    }

    try scanAndCacheDir(allocator, &map, UI_ROOT);
    g_static_files = map;
}

const ConnCtx = struct { sock: usize, allocator: std.mem.Allocator };

fn handleConnection(ctx: ConnCtx) void {
    defer _ = closesocket(ctx.sock);
    const allocator = ctx.allocator;
    // Read request using a single recv call (robust and non-blocking for HTTP headers)
    var req_buf: [8192]u8 = undefined;
    const n = recv(ctx.sock, &req_buf, @intCast(req_buf.len), 0);
    if (n <= 0) return;
    const request = req_buf[0..@intCast(n)];



    if (!std.mem.startsWith(u8, request, "GET ") and
        !std.mem.startsWith(u8, request, "POST ") and
        !std.mem.startsWith(u8, request, "PUT ") and
        !std.mem.startsWith(u8, request, "DELETE ") and
        !std.mem.startsWith(u8, request, "OPTIONS ") and
        !std.mem.startsWith(u8, request, "PATCH "))
    {
        sendSimple(ctx.sock, "405 Method Not Allowed", "");
        return;
    }

    const sp = std.mem.indexOfScalar(u8, request, ' ') orelse return;
    const after_method = request[sp + 1 ..];
    const sp2 = std.mem.indexOfScalar(u8, after_method, ' ') orelse return;
    const url_path_raw = after_method[0..sp2];
    const q = std.mem.indexOfScalar(u8, url_path_raw, '?') orelse url_path_raw.len;
    const url_path = url_path_raw[0..q];

    if (g_static_files) |files| {
        if (files.get(url_path)) |cached| {
            // Hashed asset filenames (e.g. dashboard-Cyx9l-6x.js) get long-lived immutable cache.
            // HTML index files always get no-cache so they stay fresh.
            const is_html = std.mem.endsWith(u8, url_path, ".html");
            const cache_control = if (is_html) "no-cache" else "max-age=31536000, immutable";
            const header = std.fmt.allocPrint(allocator,
                "HTTP/1.1 200 OK\r\nContent-Type: {s}\r\nContent-Length: {d}\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: {s}\r\nConnection: keep-alive\r\n\r\n",
                .{ cached.mime, cached.content.len, cache_control }) catch return;
            defer allocator.free(header);
            _ = send(ctx.sock, header.ptr, @intCast(header.len), 0);
            _ = send(ctx.sock, cached.content.ptr, @intCast(cached.content.len), 0);
            return;
        }
    }

    // Detect Referer header to automatically resolve relative path extension assets (styles.css, index.js)
    var referer_path: ?[]const u8 = null;
    var line_it = std.mem.splitSequence(u8, request, "\r\n");
    while (line_it.next()) |line| {
        if (line.len == 0) continue;
        if (startsWithCI(line, "referer:")) {
            const ref_val = std.mem.trim(u8, line["referer:".len..], " \t");
            std.debug.print("DEBUG: found referer header: {s}\n", .{ref_val});
            if (std.mem.indexOf(u8, ref_val, "/api/extension-icon")) |idx| {
                const query_part = ref_val[idx..];
                if (std.mem.indexOf(u8, query_part, "path=")) |p_idx| {
                    var p_val = query_part[p_idx + 5 ..];
                    if (std.mem.indexOfScalar(u8, p_val, '&')) |amp_idx| {
                        p_val = p_val[0..amp_idx];
                    }
                    if (decodePercent(allocator, p_val)) |decoded_path| {
                        referer_path = decoded_path;
                        setLastExtensionPath(decoded_path);
                        std.debug.print("DEBUG: decoded referer path: {s}\n", .{decoded_path});
                    } else |_| {}
                }
            }
        }
    }
    if (referer_path == null and std.mem.startsWith(u8, url_path, "/api/")) {
        referer_path = getLastExtensionPath(allocator);
    }
    defer if (referer_path) |rp| allocator.free(rp);

    const is_real_api = std.mem.eql(u8, url_path, "/api/apps-secret-root") or
                        std.mem.eql(u8, url_path, "/api/local-appdata-path") or
                        std.mem.eql(u8, url_path, "/api/app-version") or
                        std.mem.eql(u8, url_path, "/api/download-file") or
                        std.mem.eql(u8, url_path, "/api/unzip-file") or
                        std.mem.eql(u8, url_path, "/api/delete-path") or
                        std.mem.eql(u8, url_path, "/api/launch-exe") or
                        std.mem.eql(u8, url_path, "/api/attach-detached-view-window") or
                        std.mem.eql(u8, url_path, "/api/list-extensions") or
                        std.mem.eql(u8, url_path, "/api/extension-icon") or
                        std.mem.eql(u8, url_path, "/api/download-progress") or
                        std.mem.eql(u8, url_path, "/api/remove-extension") or
                        std.mem.eql(u8, url_path, "/api/toggle-extension") or
                        std.mem.eql(u8, url_path, "/api/list-credentials") or
                        std.mem.eql(u8, url_path, "/api/save-credential") or
                        std.mem.eql(u8, url_path, "/api/delete-credential") or
                        std.mem.eql(u8, url_path, "/api/show-native-tab-context-menu") or
                        std.mem.eql(u8, url_path, "/api/clear-webview-page-cache") or
                        std.mem.eql(u8, url_path, "/api/clear-webview-user-data") or
                        std.mem.eql(u8, url_path, "/api/toggle-webview-dev-tools") or
                        std.mem.eql(u8, url_path, "/api/install-extension");

    if (referer_path != null and !is_real_api) {
        var clean_file_path = url_path;
        if (std.mem.startsWith(u8, clean_file_path, "/")) {
            clean_file_path = clean_file_path[1..];
        }
        if (std.mem.startsWith(u8, clean_file_path, "api/")) {
            clean_file_path = clean_file_path[4..];
        }
        const target_file_path = std.fs.path.join(allocator, &.{ referer_path.?, clean_file_path }) catch null;
        if (target_file_path) |tfp| {
            std.debug.print("DEBUG: proxying asset look up: {s}\n", .{tfp});
            defer allocator.free(tfp);
            const tfp_z = allocator.dupeZ(u8, tfp) catch null;
            if (tfp_z) |tfpz| {
                defer allocator.free(tfpz);
                if (fopen(tfpz, "rb")) |fh| {
                    defer _ = fclose(fh);
                    _ = fseek(fh, 0, 2);
                    const file_size: usize = @intCast(ftell(fh));
                    _ = fseek(fh, 0, 0);
                    const content = allocator.alloc(u8, file_size) catch return;
                    defer allocator.free(content);
                    _ = fread(content.ptr, 1, file_size, fh);
                    
                    const mime = mimeType(clean_file_path);
                    const header = std.fmt.allocPrint(allocator,
                        "HTTP/1.0 200 OK\r\nContent-Type: {s}\r\nContent-Length: {d}\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: no-cache\r\n\r\n",
                        .{ mime, file_size }) catch return;
                    defer allocator.free(header);
                    _ = send(ctx.sock, header.ptr, @intCast(header.len), 0);
                    _ = send(ctx.sock, content.ptr, @intCast(content.len), 0);
                    std.debug.print("DEBUG: successfully proxied asset: {s}\n", .{tfp});
                    return;
                } else {
                    std.debug.print("DEBUG: failed to open asset file: {s}\n", .{tfp});
                }
            }
        }
    }

    // Route: /api/apps-secret-root  — returns the apps install directory
    if (std.mem.eql(u8, url_path, "/api/apps-secret-root")) {
        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const secret_root = if (appdata.len > 0)
            std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\Secret\\apps", .{appdata}) catch ""
        else
            "";
        defer if (secret_root.len > 0) allocator.free(secret_root);
        const fwd = std.mem.replaceOwned(u8, allocator, secret_root, "\\", "/") catch "";
        defer if (fwd.len > 0) allocator.free(fwd);
        const body = std.fmt.allocPrint(allocator, "{{\"path\":\"{s}\"}}", .{fwd}) catch "{}";
        defer allocator.free(body);
        sendJson(ctx.sock, body);
        return;
    }

    // Route: /api/local-appdata-path — returns %LOCALAPPDATA%
    if (std.mem.eql(u8, url_path, "/api/local-appdata-path")) {
        const appdata = getEnvVar(allocator, "LOCALAPPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const fwd = std.mem.replaceOwned(u8, allocator, appdata, "\\", "/") catch "";
        defer if (fwd.len > 0) allocator.free(fwd);
        const body = std.fmt.allocPrint(allocator, "{{\"path\":\"{s}\"}}", .{fwd}) catch "{}";
        defer allocator.free(body);
        sendJson(ctx.sock, body);
        return;
    }

    // Route: /api/app-version — returns the current OneView app version
    if (std.mem.eql(u8, url_path, "/api/app-version")) {
        sendJson(ctx.sock, "{\"version\":\"1.2.7\"}");
        return;
    }

    // ── Credential management routes (read/write %APPDATA%\OneView\credentials.json) ──
    if (std.mem.eql(u8, url_path, "/api/list-credentials")) {
        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const cred_path = std.fs.path.join(allocator, &.{ appdata, "OneView", "credentials.json" }) catch {
            sendJson(ctx.sock, "{\"success\":true,\"data\":[]}");
            return;
        };
        defer allocator.free(cred_path);
        const cred_path_z = allocator.dupeZ(u8, cred_path) catch {
            sendJson(ctx.sock, "{\"success\":true,\"data\":[]}");
            return;
        };
        defer allocator.free(cred_path_z);
        if (fopen(cred_path_z, "rb")) |fh| {
            defer _ = fclose(fh);
            _ = fseek(fh, 0, 2);
            const file_size: usize = @intCast(ftell(fh));
            _ = fseek(fh, 0, 0);
            const content = allocator.alloc(u8, file_size) catch {
                sendJson(ctx.sock, "{\"success\":true,\"data\":[]}");
                return;
            };
            defer allocator.free(content);
            _ = fread(content.ptr, 1, file_size, fh);
            const resp = std.fmt.allocPrint(allocator, "{{\"success\":true,\"data\":{s}}}", .{content}) catch {
                sendJson(ctx.sock, "{\"success\":true,\"data\":[]}");
                return;
            };
            defer allocator.free(resp);
            sendJson(ctx.sock, resp);
        } else {
            sendJson(ctx.sock, "{\"success\":true,\"data\":[]}");
        }
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/save-credential") or std.mem.eql(u8, url_path, "/api/delete-credential")) {
        const body_start_cred = std.mem.indexOf(u8, request, "\r\n\r\n") orelse request.len;
        const body_cred = if (body_start_cred + 4 < request.len) request[body_start_cred + 4 ..] else "";

        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body_cred, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();

        if (std.mem.eql(u8, url_path, "/api/delete-credential")) {
            deleteCredentialHelper(allocator, parsed.value, "guest") catch {
                sendJson(ctx.sock, "{\"success\":false,\"message\":\"Delete failed\"}");
                return;
            };
        } else {
            saveCredentialHelper(allocator, parsed.value, "guest") catch {
                sendJson(ctx.sock, "{\"success\":false,\"message\":\"Save failed\"}");
                return;
            };
        }
        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }


    // Parse JSON body from POST requests (needed for file ops)
    const body_start = std.mem.indexOf(u8, request, "\r\n\r\n") orelse request.len;
    const body = if (body_start + 4 < request.len) request[body_start + 4 ..] else "";

    if (std.mem.eql(u8, url_path, "/api/download-file")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const url_val = parsed.value.object.get("url") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing url\"}");
            return;
        };
        const path_val = parsed.value.object.get("targetPath") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing targetPath\"}");
            return;
        };
        // Native WinINet download — no PowerShell, no process overhead
        const url_z  = allocator.dupeZ(u8, url_val.string)  catch { sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}"); return; };
        const path_z = allocator.dupeZ(u8, path_val.string) catch { allocator.free(url_z); sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}"); return; };
        defer allocator.free(url_z);
        defer allocator.free(path_z);
        const rc = native_download_file(url_z, path_z);
        sendJson(ctx.sock, if (rc == 0) "{\"success\":true}" else "{\"success\":false,\"message\":\"Download failed\"}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/unzip-file")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const zip_val = parsed.value.object.get("zipPath") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing zipPath\"}");
            return;
        };
        const ext_val = parsed.value.object.get("extractPath") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing extractPath\"}");
            return;
        };
        // Native Shell32 COM unzip — in-process, no PowerShell
        const zip_z = allocator.dupeZ(u8, zip_val.string) catch { sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}"); return; };
        const ext_z = allocator.dupeZ(u8, ext_val.string) catch { allocator.free(zip_z); sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}"); return; };
        defer allocator.free(zip_z);
        defer allocator.free(ext_z);
        const rc = native_unzip_file(zip_z, ext_z);
        sendJson(ctx.sock, if (rc == 0) "{\"success\":true}" else "{\"success\":false,\"message\":\"Unzip failed\"}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/delete-path")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const path_val = parsed.value.object.get("targetPath") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing targetPath\"}");
            return;
        };
        const path_z = allocator.dupeZ(u8, path_val.string) catch { sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}"); return; };
        defer allocator.free(path_z);
        _ = native_delete_path(path_z);
        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/launch-exe")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const path_val = parsed.value.object.get("path") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing path\"}");
            return;
        };
        const path_z = allocator.dupeZ(u8, path_val.string) catch { sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}"); return; };
        defer allocator.free(path_z);

        const shell32 = struct {
            extern "shell32" fn ShellExecuteA(
                hwnd: ?*anyopaque,
                lpOperation: ?[*:0]const u8,
                lpFile: [*:0]const u8,
                lpParameters: ?[*:0]const u8,
                lpDirectory: ?[*:0]const u8,
                nShowCmd: c_int
            ) callconv(.winapi) ?*anyopaque;
        };
        _ = shell32.ShellExecuteA(null, "open", path_z.ptr, null, null, 5);
        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/attach-detached-view-window")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer parsed.deinit();
        const url_val = parsed.value.object.get("url") orelse {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };

        const eval_js = std.fmt.allocPrint(allocator,
            "document.dispatchEvent(new CustomEvent('zero:detached-tab-attach-request', {{ detail: {{ url: '{s}' }} }}));",
            .{ url_val.string }
        ) catch return;
        defer allocator.free(eval_js);
        const eval_js_z = allocator.dupeZ(u8, eval_js) catch return;
        defer allocator.free(eval_js_z);

        if (g_app_ptr) |app| {
            if (app.main_webview) |main_wv| {
                main_wv.eval(eval_js_z) catch {};
            }
        }
        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }


    if (std.mem.eql(u8, url_path, "/api/list-extensions")) {
        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const registry_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\oneview-extensions.v1.json", .{appdata}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"entries\":[]}");
            return;
        };
        defer allocator.free(registry_path);
        const registry_path_z = allocator.dupeZ(u8, registry_path) catch {
            sendJson(ctx.sock, "{\"success\":false,\"entries\":[]}");
            return;
        };
        defer allocator.free(registry_path_z);

        var reg_raw: []u8 = &[_]u8{};
        var has_reg = false;
        if (fopen(registry_path_z, "rb")) |reg_f| {
            defer _ = fclose(reg_f);
            _ = fseek(reg_f, 0, 2);
            const reg_size = ftell(reg_f);
            if (reg_size > 0) {
                _ = fseek(reg_f, 0, 0);
                reg_raw = allocator.alloc(u8, @intCast(reg_size)) catch &[_]u8{};
                if (reg_raw.len > 0) {
                    _ = fread(reg_raw.ptr, 1, @intCast(reg_size), reg_f);
                    has_reg = true;
                }
            }
        }
        defer if (reg_raw.len > 0) allocator.free(reg_raw);

        const body_res = if (has_reg)
            std.fmt.allocPrint(allocator, "{{\"success\":true,\"entries\":{s}}}", .{reg_raw}) catch "{\"success\":false,\"entries\":[]}"
        else
            "{\"success\":true,\"entries\":[]}";
        defer if (body_res.ptr != "{\"success\":true,\"entries\":[]}".ptr and body_res.ptr != "{\"success\":false,\"entries\":[]}".ptr) allocator.free(body_res);
        sendJson(ctx.sock, body_res);
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/extension-icon")) {
        const query_start = std.mem.indexOfScalar(u8, url_path_raw, '?') orelse return;
        const query = url_path_raw[query_start + 1 ..];
        
        var ext_path_enc: []const u8 = "";
        var file_name: []const u8 = "assets/icon.svg";

        var query_it = std.mem.tokenizeScalar(u8, query, '&');
        while (query_it.next()) |param| {
            if (std.mem.startsWith(u8, param, "path=")) {
                ext_path_enc = param[5..];
            } else if (std.mem.startsWith(u8, param, "file=")) {
                var f_val = param[5..];
                if (std.mem.indexOfScalar(u8, f_val, '?')) |q_idx| {
                    f_val = f_val[0..q_idx];
                }
                
                // Decode file parameter percent encodings (e.g. %2F -> /)
                var f_decoded = std.ArrayList(u8).empty;
                defer f_decoded.deinit(allocator);
                var f_idx: usize = 0;
                while (f_idx < f_val.len) {
                    if (f_val[f_idx] == '%' and f_idx + 2 < f_val.len) {
                        const hex = f_val[f_idx + 1 .. f_idx + 3];
                        const val = std.fmt.parseInt(u8, hex, 16) catch f_val[f_idx];
                        f_decoded.append(allocator, val) catch break;
                        f_idx += 3;
                    } else if (f_val[f_idx] == '+') {
                        f_decoded.append(allocator, ' ') catch break;
                        f_idx += 1;
                    } else {
                        f_decoded.append(allocator, f_val[f_idx]) catch break;
                        f_idx += 1;
                    }
                }
                if (f_decoded.items.len > 0) {
                    file_name = allocator.dupe(u8, f_decoded.items) catch f_val;
                } else {
                    file_name = f_val;
                }
            }
        }

        if (ext_path_enc.len > 0) {
            defer {
                // Free the dynamically allocated file_name string if it was duplicated
                if (file_name.ptr != "assets/icon.svg".ptr) {
                    allocator.free(file_name);
                }
            }
            // Decode path
            const decoded_path = decodePercent(allocator, ext_path_enc) catch {
                sendSimple(ctx.sock, "500 Internal Error", "");
                return;
            };
            defer allocator.free(decoded_path);
            setLastExtensionPath(decoded_path);

            if (decoded_path.len > 0) {
                const target_file_path = std.fs.path.join(allocator, &.{ decoded_path, file_name }) catch {
                    sendSimple(ctx.sock, "404 Not Found", "");
                    return;
                };
                defer allocator.free(target_file_path);
                const target_file_path_z = allocator.dupeZ(u8, target_file_path) catch {
                    sendSimple(ctx.sock, "500 Internal Error", "");
                    return;
                };
                defer allocator.free(target_file_path_z);

                if (fopen(target_file_path_z, "rb")) |fh| {
                    defer _ = fclose(fh);
                    _ = fseek(fh, 0, 2);
                    const file_size: usize = @intCast(ftell(fh));
                    _ = fseek(fh, 0, 0);
                    const content = allocator.alloc(u8, file_size) catch return;
                    defer allocator.free(content);
                    _ = fread(content.ptr, 1, file_size, fh);
                    
                    const mime = mimeType(file_name);
                    const header = std.fmt.allocPrint(allocator,
                        "HTTP/1.0 200 OK\r\nContent-Type: {s}\r\nContent-Length: {d}\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: no-cache\r\n\r\n",
                        .{ mime, file_size }) catch return;
                    defer allocator.free(header);
                    _ = send(ctx.sock, header.ptr, @intCast(header.len), 0);
                    _ = send(ctx.sock, content.ptr, @intCast(content.len), 0);
                    return;
                }
            }
        }
        sendSimple(ctx.sock, "404 Not Found", "");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/open-target")) {
        const body_parsed = if (body_start + 4 < request.len) request[body_start + 4 ..] else "";
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body_parsed, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer parsed.deinit();
        const target_val = parsed.value.object.get("target");
        if (target_val) |tv| {
            if (g_app_ptr) |app| {
                handleOpenTarget(app, tv.string);
            }
        }
        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/download-progress")) {

        var progress: f64 = 0.0;

        var received: u32 = 0;
        var total: u32 = 0;
        var path_buf: [260]u8 = undefined;
        get_native_download_progress(&progress, &received, &total, &path_buf, @intCast(path_buf.len));
        const path_len = std.mem.indexOfScalar(u8, &path_buf, 0) orelse path_buf.len;
        const target_path = path_buf[0..path_len];
        const body_res = std.fmt.allocPrint(allocator,
            "{{\"progress\":{d:.1},\"receivedBytes\":{d},\"totalBytes\":{d},\"targetPath\":\"{s}\"}}",
            .{ progress, received, total, std.mem.replaceOwned(u8, allocator, target_path, "\\", "/") catch target_path }
        ) catch "{}";
        defer allocator.free(body_res);
        sendJson(ctx.sock, body_res);
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/install-extension")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const path_val = parsed.value.object.get("path") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing path\"}");
            return;
        };

        const ext_path = path_val.string;
        const manifest_path = std.fs.path.join(allocator, &.{ ext_path, "oneview-manifest.json" }) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(manifest_path);

        // Read manifest via C stdlib for robust Zig 0.16 compilation
        const manifest_path_z = allocator.dupeZ(u8, manifest_path) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(manifest_path_z);

        const manifest_f = fopen(manifest_path_z, "rb") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Could not read oneview-manifest.json\"}");
            return;
        };
        defer _ = fclose(manifest_f);

        _ = fseek(manifest_f, 0, 2); // SEEK_END
        const manifest_size: usize = @intCast(ftell(manifest_f));
        _ = fseek(manifest_f, 0, 0); // SEEK_SET

        const manifest_raw = allocator.alloc(u8, manifest_size) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(manifest_raw);
        _ = fread(manifest_raw.ptr, 1, manifest_size, manifest_f);

        var manifest_parsed = std.json.parseFromSlice(std.json.Value, allocator, manifest_raw, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Failed to parse manifest JSON\"}");
            return;
        };
        defer manifest_parsed.deinit();

        const ext_id = if (manifest_parsed.value.object.get("id")) |val| val.string else "unknown-extension";
        const ext_name = if (manifest_parsed.value.object.get("name")) |val| val.string else "Unnamed Extension";
        const ext_ver = if (manifest_parsed.value.object.get("version")) |val| val.string else "0.0.1";
        const entrypoints = if (manifest_parsed.value.object.get("entrypoints")) |eps| eps.object else null;
        const root_page = if (entrypoints) |eps| (if (eps.get("root")) |r| r.string else "") else "";

        // Resolve oneview-extensions.v1.json registry path in AppData
        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const registry_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\oneview-extensions.v1.json", .{appdata}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(registry_path);
        const registry_path_z = allocator.dupeZ(u8, registry_path) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(registry_path_z);

        // Try reading existing registry array via C stdlib
        var registry_list = std.json.Array.init(allocator);
        defer registry_list.deinit();
        var existing_registry_parsed: ?std.json.Parsed(std.json.Value) = null;
        defer if (existing_registry_parsed) |*p| p.deinit();

        if (fopen(registry_path_z, "rb")) |reg_f| {
            defer _ = fclose(reg_f);
            _ = fseek(reg_f, 0, 2);
            const reg_size = ftell(reg_f);
            if (reg_size > 0) {
                _ = fseek(reg_f, 0, 0);
                const reg_raw = allocator.alloc(u8, @intCast(reg_size)) catch {
                    sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
                    return;
                };
                defer allocator.free(reg_raw);
                _ = fread(reg_raw.ptr, 1, @intCast(reg_size), reg_f);
                if (std.json.parseFromSlice(std.json.Value, allocator, reg_raw, .{})) |parsed_val| {
                    existing_registry_parsed = parsed_val;
                    if (parsed_val.value == .array) {
                        for (parsed_val.value.array.items) |item| {
                            registry_list.append(item) catch {};
                        }
                    }
                } else |_| {}
            }
        }

        // Check if already in registry, remove existing if present
        var idx: usize = 0;
        while (idx < registry_list.items.len) {
            const item = registry_list.items[idx];
            if (item == .object) {
                if (item.object.get("path")) |p| {
                    if (std.mem.eql(u8, p.string, ext_path)) {
                        _ = registry_list.orderedRemove(idx);
                        continue;
                    }
                }
            }
            idx += 1;
        }

        // Add new registry entry object
        var new_entry = std.json.ObjectMap.empty;
        new_entry.put(allocator, "id", std.json.Value{ .string = ext_id }) catch {};
        new_entry.put(allocator, "path", std.json.Value{ .string = ext_path }) catch {};
        new_entry.put(allocator, "enabled", std.json.Value{ .bool = true }) catch {};
        new_entry.put(allocator, "addedAt", std.json.Value{ .string = "2026-07-04T12:00:00Z" }) catch {};
        new_entry.put(allocator, "installSource", std.json.Value{ .string = "release" }) catch {};
        new_entry.put(allocator, "manifestName", std.json.Value{ .string = ext_name }) catch {};
        new_entry.put(allocator, "manifestVersion", std.json.Value{ .string = ext_ver }) catch {};
        registry_list.append(std.json.Value{ .object = new_entry }) catch {};

        // Save updated registry via C stdlib fopen / fwrite
        const out_string = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .array = registry_list }, .{}) catch "";
        defer if (out_string.len > 0) allocator.free(out_string);
        if (out_string.len > 0) {
            if (fopen(registry_path_z, "wb")) |reg_out| {
                defer _ = fclose(reg_out);
                _ = fwrite(out_string.ptr, 1, out_string.len, reg_out);
            }
        }

        const res_json = std.fmt.allocPrint(allocator,
            "{{\"success\":true,\"entry\":{{\"id\":\"{s}\",\"name\":\"{s}\",\"enabled\":true,\"rootUrl\":\"file:///{s}/{s}\"}}}}",
            .{ ext_id, ext_name, std.mem.replaceOwned(u8, allocator, ext_path, "\\", "/") catch ext_path, root_page }
        ) catch "{\"success\":false}";
        defer allocator.free(res_json);
        sendJson(ctx.sock, res_json);
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/remove-extension")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const path_val = parsed.value.object.get("path") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing path\"}");
            return;
        };
        const ext_path = path_val.string;

        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const registry_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\oneview-extensions.v1.json", .{appdata}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(registry_path);
        const registry_path_z = allocator.dupeZ(u8, registry_path) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(registry_path_z);

        var registry_list = std.json.Array.init(allocator);
        defer registry_list.deinit();
        var existing_registry_parsed: ?std.json.Parsed(std.json.Value) = null;
        defer if (existing_registry_parsed) |*p| p.deinit();

        if (fopen(registry_path_z, "rb")) |reg_f| {
            defer _ = fclose(reg_f);
            _ = fseek(reg_f, 0, 2);
            const reg_size = ftell(reg_f);
            if (reg_size > 0) {
                _ = fseek(reg_f, 0, 0);
                const reg_raw = allocator.alloc(u8, @intCast(reg_size)) catch {
                    sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
                    return;
                };
                defer allocator.free(reg_raw);
                _ = fread(reg_raw.ptr, 1, @intCast(reg_size), reg_f);
                if (std.json.parseFromSlice(std.json.Value, allocator, reg_raw, .{})) |parsed_val| {
                    existing_registry_parsed = parsed_val;
                    if (parsed_val.value == .array) {
                        for (parsed_val.value.array.items) |item| {
                            registry_list.append(item) catch {};
                        }
                    }
                } else |_| {}
            }
        }

        var idx: usize = 0;
        var removed = false;
        while (idx < registry_list.items.len) {
            const item = registry_list.items[idx];
            if (item == .object) {
                if (item.object.get("path")) |p| {
                    if (std.mem.eql(u8, p.string, ext_path)) {
                        _ = registry_list.orderedRemove(idx);
                        removed = true;
                        continue;
                    }
                }
            }
            idx += 1;
        }

        if (removed) {
            const out_string = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .array = registry_list }, .{}) catch "";
            defer if (out_string.len > 0) allocator.free(out_string);
            if (out_string.len > 0) {
                if (fopen(registry_path_z, "wb")) |reg_out| {
                    defer _ = fclose(reg_out);
                    _ = fwrite(out_string.ptr, 1, out_string.len, reg_out);
                }
            }
        }

        const entries_string = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .array = registry_list }, .{}) catch "[]";
        defer if (entries_string.ptr != "[]".ptr) allocator.free(entries_string);
        const res_json = std.fmt.allocPrint(allocator, "{{\"success\":true,\"entries\":{s}}}", .{entries_string}) catch "{\"success\":false}";
        defer if (res_json.ptr != "{\"success\":false}".ptr) allocator.free(res_json);
        sendJson(ctx.sock, res_json);
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/toggle-extension")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const path_val = parsed.value.object.get("path") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing path\"}");
            return;
        };
        const enabled_val = parsed.value.object.get("enabled") orelse {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing enabled\"}");
            return;
        };
        const ext_path = path_val.string;
        const ext_enabled = enabled_val.bool;

        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const registry_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\oneview-extensions.v1.json", .{appdata}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(registry_path);
        const registry_path_z = allocator.dupeZ(u8, registry_path) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
            return;
        };
        defer allocator.free(registry_path_z);

        var registry_list = std.json.Array.init(allocator);
        defer registry_list.deinit();
        var existing_registry_parsed: ?std.json.Parsed(std.json.Value) = null;
        defer if (existing_registry_parsed) |*p| p.deinit();

        if (fopen(registry_path_z, "rb")) |reg_f| {
            defer _ = fclose(reg_f);
            _ = fseek(reg_f, 0, 2);
            const reg_size = ftell(reg_f);
            if (reg_size > 0) {
                _ = fseek(reg_f, 0, 0);
                const reg_raw = allocator.alloc(u8, @intCast(reg_size)) catch {
                    sendJson(ctx.sock, "{\"success\":false,\"message\":\"OOM\"}");
                    return;
                };
                defer allocator.free(reg_raw);
                _ = fread(reg_raw.ptr, 1, @intCast(reg_size), reg_f);
                if (std.json.parseFromSlice(std.json.Value, allocator, reg_raw, .{})) |parsed_val| {
                    existing_registry_parsed = parsed_val;
                    if (parsed_val.value == .array) {
                        for (parsed_val.value.array.items) |item| {
                            registry_list.append(item) catch {};
                        }
                    }
                } else |_| {}
            }
        }

        var idx: usize = 0;
        var updated = false;
        while (idx < registry_list.items.len) {
            var item = registry_list.items[idx];
            if (item == .object) {
                if (item.object.get("path")) |p| {
                    if (std.mem.eql(u8, p.string, ext_path)) {
                        item.object.put(allocator, "enabled", std.json.Value{ .bool = ext_enabled }) catch {};
                        registry_list.items[idx] = item;
                        updated = true;
                        break;
                    }
                }
            }
            idx += 1;
        }

        if (updated) {
            const out_string = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .array = registry_list }, .{}) catch "";
            defer if (out_string.len > 0) allocator.free(out_string);
            if (out_string.len > 0) {
                if (fopen(registry_path_z, "wb")) |reg_out| {
                    defer _ = fclose(reg_out);
                    _ = fwrite(out_string.ptr, 1, out_string.len, reg_out);
                }
            }
        }

        const entries_string = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .array = registry_list }, .{}) catch "[]";
        defer if (entries_string.ptr != "[]".ptr) allocator.free(entries_string);
        const res_json = std.fmt.allocPrint(allocator, "{{\"success\":true,\"entries\":{s}}}", .{entries_string}) catch "{\"success\":false}";
        defer if (res_json.ptr != "{\"success\":false}".ptr) allocator.free(res_json);
        sendJson(ctx.sock, res_json);
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/list-credentials")) {
        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const creds_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\oneview-profile-credentials.v1.json", .{appdata}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"data\":[]}");
            return;
        };
        defer allocator.free(creds_path);
        const creds_path_z = allocator.dupeZ(u8, creds_path) catch {
            sendJson(ctx.sock, "{\"success\":false,\"data\":[]}");
            return;
        };
        defer allocator.free(creds_path_z);

        var has_creds = false;
        var creds_raw: []u8 = &[_]u8{};
        if (fopen(creds_path_z, "rb")) |creds_f| {
            defer _ = fclose(creds_f);
            _ = fseek(creds_f, 0, 2);
            const size = ftell(creds_f);
            if (size > 0) {
                _ = fseek(creds_f, 0, 0);
                creds_raw = allocator.alloc(u8, @intCast(size)) catch &[_]u8{};
                if (creds_raw.len > 0) {
                    _ = fread(creds_raw.ptr, 1, @intCast(size), creds_f);
                    has_creds = true;
                }
            }
        }
        defer if (creds_raw.len > 0) allocator.free(creds_raw);

        const body_res = if (has_creds)
            std.fmt.allocPrint(allocator, "{{\"success\":true,\"data\":{s}}}", .{creds_raw}) catch "{\"success\":false,\"data\":[]}"
        else
            "{\"success\":true,\"data\":[]}";
        defer if (body_res.ptr != "{\"success\":true,\"data\":[]}".ptr and body_res.ptr != "{\"success\":false,\"data\":[]}".ptr) allocator.free(body_res);
        sendJson(ctx.sock, body_res);
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/save-credential")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const profile_id = if (parsed.value.object.get("profileId")) |v| v.string else "guest";
        const domain = if (parsed.value.object.get("domain")) |v| v.string else "";
        const username = if (parsed.value.object.get("username")) |v| v.string else "";
        const password = if (parsed.value.object.get("password")) |v| v.string else "";

        if (domain.len == 0 or username.len == 0) {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing fields\"}");
            return;
        }

        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const creds_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\oneview-profile-credentials.v1.json", .{appdata}) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer allocator.free(creds_path);
        const creds_path_z = allocator.dupeZ(u8, creds_path) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer allocator.free(creds_path_z);

        var creds_list = std.json.Array.init(allocator);
        defer creds_list.deinit();
        var existing_parsed: ?std.json.Parsed(std.json.Value) = null;
        defer if (existing_parsed) |*p| p.deinit();

        if (fopen(creds_path_z, "rb")) |creds_f| {
            defer _ = fclose(creds_f);
            _ = fseek(creds_f, 0, 2);
            const size = ftell(creds_f);
            if (size > 0) {
                _ = fseek(creds_f, 0, 0);
                const creds_raw = allocator.alloc(u8, @intCast(size)) catch {
                    sendJson(ctx.sock, "{\"success\":false}");
                    return;
                };
                defer allocator.free(creds_raw);
                _ = fread(creds_raw.ptr, 1, @intCast(size), creds_f);
                if (std.json.parseFromSlice(std.json.Value, allocator, creds_raw, .{})) |parsed_val| {
                    existing_parsed = parsed_val;
                    if (parsed_val.value == .array) {
                        for (parsed_val.value.array.items) |item| {
                            creds_list.append(item) catch {};
                        }
                    }
                } else |_| {}
            }
        }

        var idx: usize = 0;
        while (idx < creds_list.items.len) {
            const item = creds_list.items[idx];
            if (item == .object) {
                const item_prof = if (item.object.get("profileId")) |v| v.string else "";
                const item_dom = if (item.object.get("domain")) |v| v.string else "";
                const item_user = if (item.object.get("username")) |v| v.string else "";
                if (std.mem.eql(u8, item_prof, profile_id) and std.mem.eql(u8, item_dom, domain) and std.mem.eql(u8, item_user, username)) {
                    _ = creds_list.orderedRemove(idx);
                    continue;
                }
            }
            idx += 1;
        }

        var new_entry = std.json.ObjectMap.empty;
        new_entry.put(allocator, "profileId", std.json.Value{ .string = profile_id }) catch {};
        new_entry.put(allocator, "domain", std.json.Value{ .string = domain }) catch {};
        new_entry.put(allocator, "username", std.json.Value{ .string = username }) catch {};
        new_entry.put(allocator, "password", std.json.Value{ .string = password }) catch {};
        creds_list.append(std.json.Value{ .object = new_entry }) catch {};

        const out_string = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .array = creds_list }, .{}) catch "";
        defer if (out_string.len > 0) allocator.free(out_string);
        if (out_string.len > 0) {
            if (fopen(creds_path_z, "wb")) |creds_out| {
                defer _ = fclose(creds_out);
                _ = fwrite(out_string.ptr, 1, out_string.len, creds_out);
            }
        }

        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/delete-credential")) {
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Invalid JSON\"}");
            return;
        };
        defer parsed.deinit();
        const profile_id = if (parsed.value.object.get("profileId")) |v| v.string else "guest";
        const domain = if (parsed.value.object.get("domain")) |v| v.string else "";
        const username = if (parsed.value.object.get("username")) |v| v.string else "";

        if (domain.len == 0 or username.len == 0) {
            sendJson(ctx.sock, "{\"success\":false,\"message\":\"Missing fields\"}");
            return;
        }

        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        const creds_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\oneview-profile-credentials.v1.json", .{appdata}) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer allocator.free(creds_path);
        const creds_path_z = allocator.dupeZ(u8, creds_path) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer allocator.free(creds_path_z);

        var creds_list = std.json.Array.init(allocator);
        defer creds_list.deinit();
        var existing_parsed: ?std.json.Parsed(std.json.Value) = null;
        defer if (existing_parsed) |*p| p.deinit();

        if (fopen(creds_path_z, "rb")) |creds_f| {
            defer _ = fclose(creds_f);
            _ = fseek(creds_f, 0, 2);
            const size = ftell(creds_f);
            if (size > 0) {
                _ = fseek(creds_f, 0, 0);
                const creds_raw = allocator.alloc(u8, @intCast(size)) catch {
                    sendJson(ctx.sock, "{\"success\":false}");
                    return;
                };
                defer allocator.free(creds_raw);
                _ = fread(creds_raw.ptr, 1, @intCast(size), creds_f);
                if (std.json.parseFromSlice(std.json.Value, allocator, creds_raw, .{})) |parsed_val| {
                    existing_parsed = parsed_val;
                    if (parsed_val.value == .array) {
                        for (parsed_val.value.array.items) |item| {
                            creds_list.append(item) catch {};
                        }
                    }
                } else |_| {}
            }
        }

        var idx: usize = 0;
        var removed = false;
        while (idx < creds_list.items.len) {
            const item = creds_list.items[idx];
            if (item == .object) {
                const item_prof = if (item.object.get("profileId")) |v| v.string else "";
                const item_dom = if (item.object.get("domain")) |v| v.string else "";
                const item_user = if (item.object.get("username")) |v| v.string else "";
                if (std.mem.eql(u8, item_prof, profile_id) and std.mem.eql(u8, item_dom, domain) and std.mem.eql(u8, item_user, username)) {
                    _ = creds_list.orderedRemove(idx);
                    removed = true;
                    continue;
                }
            }
            idx += 1;
        }

        if (removed) {
            const out_string = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .array = creds_list }, .{}) catch "";
            defer if (out_string.len > 0) allocator.free(out_string);
            if (out_string.len > 0) {
                if (fopen(creds_path_z, "wb")) |creds_out| {
                    defer _ = fclose(creds_out);
                    _ = fwrite(out_string.ptr, 1, out_string.len, creds_out);
                }
            }
        }

        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/show-native-tab-context-menu")) {
        const app = g_app_ptr orelse {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer parsed.deinit();

        const anchor_id = if (parsed.value.object.get("anchorId")) |v| v.string else "";
        const x = if (parsed.value.object.get("x")) |v| (if (v == .integer) v.integer else 0) else 0;
        const y = if (parsed.value.object.get("y")) |v| (if (v == .integer) v.integer else 0) else 0;

        var disable_clear_left = false;
        var disable_clear_right = false;
        var disable_clear_cache = false;
        var disable_clear_user_data = false;
        var disable_inspect = false;

        if (parsed.value.object.get("disabled")) |d| {
            if (d == .object) {
                disable_clear_left = if (d.object.get("clearLeft")) |v| v.bool else false;
                disable_clear_right = if (d.object.get("clearRight")) |v| v.bool else false;
                disable_clear_cache = if (d.object.get("clearCache")) |v| v.bool else false;
                disable_clear_user_data = if (d.object.get("clearUserData")) |v| v.bool else false;
                disable_inspect = if (d.object.get("inspectLocalFile")) |v| v.bool else false;
            }
        }

        const ContextMenuCtx = struct {
            app: *App,
            anchor_id: []const u8,
            x: i32,
            y: i32,
            disable_clear_left: bool,
            disable_clear_right: bool,
            disable_clear_cache: bool,
            disable_clear_user_data: bool,
            disable_inspect: bool,
            allocator: std.mem.Allocator,
        };

        const cctx = allocator.create(ContextMenuCtx) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        cctx.app = app;
        cctx.anchor_id = allocator.dupe(u8, anchor_id) catch "";
        cctx.x = @intCast(x);
        cctx.y = @intCast(y);
        cctx.disable_clear_left = disable_clear_left;
        cctx.disable_clear_right = disable_clear_right;
        cctx.disable_clear_cache = disable_clear_cache;
        cctx.disable_clear_user_data = disable_clear_user_data;
        cctx.disable_inspect = disable_inspect;
        cctx.allocator = allocator;

        const S = struct {
            fn cb(w: *Webview, arg: ?*anyopaque) void {
                _ = w;
                const c = @as(*ContextMenuCtx, @ptrCast(@alignCast(arg.?)));
                defer {
                    c.allocator.free(c.anchor_id);
                    c.allocator.destroy(c);
                }

                const hmenu = CreatePopupMenu() orelse return;
                defer _ = DestroyMenu(hmenu);

                _ = AppendMenuA(hmenu, if (c.disable_clear_left) MF_GRAYED else MF_STRING, 1, "Clear Tabs to the Left");
                _ = AppendMenuA(hmenu, if (c.disable_clear_right) MF_GRAYED else MF_STRING, 2, "Clear Tabs to the Right");
                _ = AppendMenuA(hmenu, MF_SEPARATOR, 0, null);
                _ = AppendMenuA(hmenu, if (c.disable_clear_cache) MF_GRAYED else MF_STRING, 3, "Clear Page Cache");
                _ = AppendMenuA(hmenu, if (c.disable_clear_user_data) MF_GRAYED else MF_STRING, 4, "Clear Site Cookies & Storage");
                _ = AppendMenuA(hmenu, MF_SEPARATOR, 0, null);
                _ = AppendMenuA(hmenu, if (c.disable_inspect) MF_GRAYED else MF_STRING, 5, "Inspect Page (DevTools)");
                _ = AppendMenuA(hmenu, MF_SEPARATOR, 0, null);
                _ = AppendMenuA(hmenu, MF_STRING, 6, "Duplicate Tab");

                var pt = POINT{ .x = c.x, .y = c.y };
                _ = ClientToScreen(c.app.main_window_hwnd, &pt);

                const TPM_RETURNCMD = 0x0100;
                const TPM_NONOTIFY = 0x0080;
                const cmd = TrackPopupMenu(hmenu, TPM_RETURNCMD | TPM_NONOTIFY | TPM_RIGHTBUTTON, pt.x, pt.y, 0, c.app.main_window_hwnd, null);

                var action: ?[]const u8 = null;
                if (cmd == 1) {
                    action = "clear-left";
                } else if (cmd == 2) {
                    action = "clear-right";
                } else if (cmd == 3) {
                    action = "clear-cache";
                } else if (cmd == 4) {
                    action = "clear-user-data";
                } else if (cmd == 5) {
                    action = "inspect-local-file";
                } else if (cmd == 6) {
                    action = "duplicate-tab";
                }

                if (action) |act| {
                    if (c.app.main_webview) |main_wv| {
                        const js = std.fmt.allocPrint(c.allocator, "if (window._wcEmitTabContextAction) window._wcEmitTabContextAction('{s}', '{s}');", .{ act, c.anchor_id }) catch "";
                        defer if (js.len > 0) c.allocator.free(js);
                        if (js.len > 0) {
                            if (c.allocator.dupeZ(u8, js) catch null) |js_z| {
                                defer c.allocator.free(js_z);
                                main_wv.eval(js_z) catch {};
                            }
                        }
                    }
                }
            }
        };

        if (app.main_webview) |main_wv| {
            main_wv.dispatchRaw(S.cb, cctx) catch {};
        }

        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/clear-webview-page-cache")) {
        const app = g_app_ptr orelse {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer parsed.deinit();

        const url = if (parsed.value.object.get("url")) |v| v.string else "";
        if (url.len > 0) {
            var origin = url;
            if (std.mem.indexOf(u8, url, "://")) |scheme_idx| {
                const rest = url[scheme_idx + 3 ..];
                if (std.mem.indexOfScalar(u8, rest, '/')) |slash_idx| {
                    origin = url[0 .. scheme_idx + 3 + slash_idx];
                }
            }

            const ClearDataCtx = struct {
                app: *App,
                origin: []const u8,
                types: []const u8,
                allocator: std.mem.Allocator,
            };

            const cctx = allocator.create(ClearDataCtx) catch {
                sendJson(ctx.sock, "{\"success\":false}");
                return;
            };
            cctx.app = app;
            cctx.origin = allocator.dupe(u8, origin) catch "";
            cctx.types = allocator.dupe(u8, "cache_storage,shader_cache") catch "";
            cctx.allocator = allocator;

            const S = struct {
                fn cb(w: *Webview, arg: ?*anyopaque) void {
                    _ = w;
                    const c = @as(*ClearDataCtx, @ptrCast(@alignCast(arg.?)));
                    defer {
                        c.allocator.free(c.origin);
                        c.allocator.free(c.types);
                        c.allocator.destroy(c);
                    }

                    var opt_handle: ?*anyopaque = null;
                    var it = c.app.child_views.iterator();
                    while (it.next()) |entry| {
                        if (entry.value_ptr.cpp_handle) |h| {
                            opt_handle = h;
                            break;
                        }
                    }

                    if (opt_handle) |h| {
                        const origin_z = c.allocator.dupeZ(u8, c.origin) catch "";
                        defer if (origin_z.len > 0) c.allocator.free(origin_z);
                        const types_z = c.allocator.dupeZ(u8, c.types) catch "";
                        defer if (types_z.len > 0) c.allocator.free(types_z);
                        if (origin_z.len > 0 and types_z.len > 0) {
                            child_webview_clear_data(h, origin_z, types_z);
                        }
                    }
                }
            };

            if (app.main_webview) |main_wv| {
                main_wv.dispatchRaw(S.cb, cctx) catch {};
            }
        }

        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/clear-webview-user-data")) {
        const app = g_app_ptr orelse {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer parsed.deinit();

        const url = if (parsed.value.object.get("url")) |v| v.string else "";
        if (url.len > 0) {
            var origin = url;
            if (std.mem.indexOf(u8, url, "://")) |scheme_idx| {
                const rest = url[scheme_idx + 3 ..];
                if (std.mem.indexOfScalar(u8, rest, '/')) |slash_idx| {
                    origin = url[0 .. scheme_idx + 3 + slash_idx];
                }
            }

            const ClearDataCtx = struct {
                app: *App,
                origin: []const u8,
                types: []const u8,
                allocator: std.mem.Allocator,
            };

            const cctx = allocator.create(ClearDataCtx) catch {
                sendJson(ctx.sock, "{\"success\":false}");
                return;
            };
            cctx.app = app;
            cctx.origin = allocator.dupe(u8, origin) catch "";
            cctx.types = allocator.dupe(u8, "cookies,local_storage,indexeddb,websql,file_systems") catch "";
            cctx.allocator = allocator;

            const S = struct {
                fn cb(w: *Webview, arg: ?*anyopaque) void {
                    _ = w;
                    const c = @as(*ClearDataCtx, @ptrCast(@alignCast(arg.?)));
                    defer {
                        c.allocator.free(c.origin);
                        c.allocator.free(c.types);
                        c.allocator.destroy(c);
                    }

                    var opt_handle: ?*anyopaque = null;
                    var it = c.app.child_views.iterator();
                    while (it.next()) |entry| {
                        if (entry.value_ptr.cpp_handle) |h| {
                            opt_handle = h;
                            break;
                        }
                    }

                    if (opt_handle) |h| {
                        const origin_z = c.allocator.dupeZ(u8, c.origin) catch "";
                        defer if (origin_z.len > 0) c.allocator.free(origin_z);
                        const types_z = c.allocator.dupeZ(u8, c.types) catch "";
                        defer if (types_z.len > 0) c.allocator.free(types_z);
                        if (origin_z.len > 0 and types_z.len > 0) {
                            child_webview_clear_data(h, origin_z, types_z);
                        }
                    }
                }
            };

            if (app.main_webview) |main_wv| {
                main_wv.dispatchRaw(S.cb, cctx) catch {};
            }
        }

        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    if (std.mem.eql(u8, url_path, "/api/toggle-webview-dev-tools")) {
        const app = g_app_ptr orelse {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        var parsed = std.json.parseFromSlice(std.json.Value, allocator, body, .{}) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        defer parsed.deinit();

        const web_contents_id = if (parsed.value.object.get("webContentsId")) |v| v.string else "";

        const DevToolsCtx = struct {
            app: *App,
            webContentsId: []const u8,
            allocator: std.mem.Allocator,
        };

        const dctx = allocator.create(DevToolsCtx) catch {
            sendJson(ctx.sock, "{\"success\":false}");
            return;
        };
        dctx.app = app;
        dctx.webContentsId = allocator.dupe(u8, web_contents_id) catch "";
        dctx.allocator = allocator;

        const S = struct {
            fn cb(w: *Webview, arg: ?*anyopaque) void {
                _ = w;
                const c = @as(*DevToolsCtx, @ptrCast(@alignCast(arg.?)));
                defer {
                    c.allocator.free(c.webContentsId);
                    c.allocator.destroy(c);
                }

                const key_z = c.allocator.dupeZ(u8, c.webContentsId) catch "";
                defer if (key_z.len > 0) c.allocator.free(key_z);

                if (key_z.len > 0) {
                    if (c.app.child_views.getPtr(key_z)) |view_ptr| {
                        if (view_ptr.cpp_handle) |h| {
                            child_webview_open_devtools(h);
                        }
                    }
                }
            }
        };

        if (app.main_webview) |main_wv| {
            main_wv.dispatchRaw(S.cb, dctx) catch {};
        }

        sendJson(ctx.sock, "{\"success\":true}");
        return;
    }

    // Route: /frameproxy?url=...
    if (std.mem.startsWith(u8, url_path, "/frameproxy")) {
        const query_start = std.mem.indexOfScalar(u8, url_path_raw, '?') orelse return;
        const query = url_path_raw[query_start + 1 ..];
        if (std.mem.startsWith(u8, query, "url=")) {
            const encoded_url = query[4..];
            var decoded = std.ArrayList(u8).empty;
            defer decoded.deinit(allocator);
            var i: usize = 0;
            while (i < encoded_url.len) {
                if (encoded_url[i] == '%' and i + 2 < encoded_url.len) {
                    const hex = encoded_url[i + 1 .. i + 3];
                    const val = std.fmt.parseInt(u8, hex, 16) catch encoded_url[i];
                    decoded.append(allocator, val) catch break;
                    i += 3;
                } else if (encoded_url[i] == '+') {
                    decoded.append(allocator, ' ') catch break;
                    i += 1;
                } else {
                    decoded.append(allocator, encoded_url[i]) catch break;
                    i += 1;
                }
            }
            if (decoded.items.len > 0) {
                proxyExternalUrl(allocator, ctx.sock, decoded.items);
                return;
            }
        }
        sendSimple(ctx.sock, "400 Bad Request", "Missing url parameter");
        return;
    }

    if (std.mem.startsWith(u8, url_path, "/proxy5000")) {
        proxyToBackendPort(allocator, ctx.sock, request, BACKEND_PORT2, "/proxy5000");
        return;
    }
    if (std.mem.startsWith(u8, url_path, "/proxy")) {
        proxyToBackendPort(allocator, ctx.sock, request, BACKEND_PORT, "/proxy");
        return;
    }

    const fs_path = std.fs.path.join(allocator, &.{ UI_ROOT, url_path }) catch return;
    defer allocator.free(fs_path);

    if (std.mem.indexOf(u8, fs_path, "..") != null) {
        sendSimple(ctx.sock, "403 Forbidden", "");
        return;
    }

    const fs_path_z = allocator.dupeZ(u8, fs_path) catch return;
    defer allocator.free(fs_path_z);

    const fh = fopen(fs_path_z, "rb") orelse {
        std.debug.print("DEBUG: 404 Not Found for URL: {s}, referer_path={?s}\n", .{ url_path, referer_path });
        sendSimple(ctx.sock, "404 Not Found", "Not Found");
        return;
    };
    defer _ = fclose(fh);

    _ = fseek(fh, 0, 2);
    const file_size: usize = @intCast(ftell(fh));
    _ = fseek(fh, 0, 0);

    const content = allocator.alloc(u8, file_size) catch return;
    defer allocator.free(content);
    _ = fread(content.ptr, 1, file_size, fh);

    const is_html_fallback = std.mem.endsWith(u8, fs_path, ".html");
    const cache_ctrl = if (is_html_fallback) "no-cache" else "max-age=31536000, immutable";
    const header = std.fmt.allocPrint(allocator,
        "HTTP/1.1 200 OK\r\nContent-Type: {s}\r\nContent-Length: {d}\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: {s}\r\nConnection: keep-alive\r\n\r\n",
        .{ mimeType(fs_path), file_size, cache_ctrl }) catch return;
    defer allocator.free(header);

    _ = send(ctx.sock, header.ptr, @intCast(header.len), 0);
    _ = send(ctx.sock, content.ptr, @intCast(content.len), 0);
}

fn connectionThread(ctx: ConnCtx) void { handleConnection(ctx); }

// ─── Server thread ────────────────────────────────────────────────────────────

const ServerCtx = struct { allocator: std.mem.Allocator };

fn runServer(ctx: *ServerCtx) void {
    var wsdata: WSADATA = undefined;
    _ = WSAStartup(0x0202, &wsdata);
    defer _ = WSACleanup();

    const srv = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (srv == INVALID_SOCKET) return;
    defer _ = closesocket(srv);

    const yes: c_int = 1;
    _ = setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &yes, @sizeOf(c_int));

    var addr = SOCKADDR_IN{
        .sin_family = AF_INET,
        .sin_port = htons(SERVER_PORT),
        .sin_addr = htonl(0x7F000001),
        .sin_zero = [_]u8{0} ** 8,
    };
    if (bind(srv, &addr, @sizeOf(SOCKADDR_IN)) == SOCKET_ERROR) return;
    if (listen(srv, 128) == SOCKET_ERROR) return;

    while (true) {
        const client = accept(srv, null, null);
        if (client == INVALID_SOCKET) continue;
        const conn_ctx = ConnCtx{ .sock = client, .allocator = ctx.allocator };
        const t = std.Thread.spawn(.{}, connectionThread, .{conn_ctx}) catch {
            _ = closesocket(client);
            continue;
        };
        t.detach();
    }
}

// ─── Webview bindings & IPC ───────────────────────────────────────────────────

fn ping(req: EasyApp.Request) anyerror!void {
    const self = req.easy.ctx;
    self.ping_count += 1;
    const response = try allocPrintZ(self.allocator, "{{\"message\":\"pong\",\"count\":{d}}}", .{self.ping_count});
    defer self.allocator.free(response);
    req.resolveWith(response);
}

// nativeWebcontentCall handles the Native IPC channel for child webviews
fn nativeWebcontentCall(req: EasyApp.Request) anyerror!void {
    const app = req.easy.ctx;
    
    // Parse arguments using std.json.parseFromSlice
    const parsed = try std.json.parseFromSlice(std.json.Value, app.allocator, req.args, .{});
    defer parsed.deinit();
    
    const root_arr = parsed.value.array;
    if (root_arr.items.len < 2) return;
    const method = root_arr.items[0].string;
    const payload = root_arr.items[1].object;

    // Handle window actions from frameless client titlebars
    const target_hwnd = req.easy.getWindow();
    if (std.mem.eql(u8, method, "drag-window")) {
        const user32_op = struct {
            extern "user32" fn ReleaseCapture() callconv(.winapi) i32;
            extern "user32" fn SendMessageA(hWnd: ?*anyopaque, Msg: u32, wParam: usize, lParam: isize) callconv(.winapi) isize;
        };
        _ = user32_op.ReleaseCapture();
        const WM_NCLBUTTONDOWN = 0x00A1;
        const HTCAPTION = 2;
        _ = user32_op.SendMessageA(target_hwnd, WM_NCLBUTTONDOWN, HTCAPTION, 0);
        req.resolveWith("{\"success\":true}");
        return;
    } else if (std.mem.eql(u8, method, "minimize-window")) {
        const user32_op = struct {
            extern "user32" fn ShowWindow(hWnd: ?*anyopaque, nCmdShow: c_int) callconv(.winapi) i32;
        };
        _ = user32_op.ShowWindow(target_hwnd, 6); // SW_MINIMIZE = 6
        req.resolveWith("{\"success\":true}");
        return;
    } else if (std.mem.eql(u8, method, "maximize-window")) {
        const user32_op = struct {
            extern "user32" fn IsZoomed(hWnd: ?*anyopaque) callconv(.winapi) i32;
            extern "user32" fn ShowWindow(hWnd: ?*anyopaque, nCmdShow: c_int) callconv(.winapi) i32;
        };
        const is_maximized = user32_op.IsZoomed(target_hwnd) != 0;
        const cmd = if (is_maximized) @as(c_int, 9) else @as(c_int, 3); // SW_RESTORE = 9, SW_MAXIMIZE = 3
        _ = user32_op.ShowWindow(target_hwnd, cmd);
        req.resolveWith("{\"success\":true}");
        return;
    } else if (std.mem.eql(u8, method, "close-window")) {
        const user32_op = struct {
            extern "user32" fn PostMessageA(hWnd: ?*anyopaque, Msg: u32, wParam: usize, lParam: usize) callconv(.winapi) i32;
        };
        const WM_CLOSE = 0x0010;
        _ = user32_op.PostMessageA(target_hwnd, WM_CLOSE, 0, 0);
        req.resolveWith("{\"success\":true}");
        return;
    } else if (std.mem.eql(u8, method, "get-global-theme")) {
        const temp = getEnvVar(app.allocator, "TEMP");
        defer if (temp.len > 0) app.allocator.free(temp);
        var path_buf: [512]u8 = undefined;
        const path = std.fmt.bufPrintZ(&path_buf, "{s}\\oneview_theme.txt", .{temp}) catch {
            req.resolveWith("{\"theme\":\"light\"}");
            return;
        };
        const f = fopen(path, "r");
        if (f) |file| {
            defer _ = fclose(file);
            var buf: [32]u8 = undefined;
            const bytes_read = fread(&buf, 1, buf.len - 1, file);
            buf[bytes_read] = 0;
            const theme_val = std.mem.trim(u8, buf[0..bytes_read], " \r\n\t");
            const res = try allocPrintZ(app.allocator, "{{\"theme\":\"{s}\"}}", .{theme_val});
            defer app.allocator.free(res);
            req.resolveWith(res);
        } else {
            req.resolveWith("{\"theme\":\"light\"}");
        }
        return;
    } else if (std.mem.eql(u8, method, "set-global-theme")) {
        const theme = if (payload.get("theme")) |t| t.string else "light";
        const is_dark: usize = if (std.mem.eql(u8, theme, "dark")) 1 else 0;

        // Persist to file for new windows that open later
        const temp = getEnvVar(app.allocator, "TEMP");
        defer if (temp.len > 0) app.allocator.free(temp);
        var path_buf: [512]u8 = undefined;
        if (std.fmt.bufPrintZ(&path_buf, "{s}\\oneview_theme.txt", .{temp})) |path| {
            if (fopen(path, "w")) |file| {
                defer _ = fclose(file);
                _ = fwrite(theme.ptr, 1, theme.len, file);
            }
        } else |_| {}

        // Register a system-wide message (idempotent - same name always returns same ID)
        const user32_bc = struct {
            extern "user32" fn RegisterWindowMessageA(lpString: [*:0]const u8) callconv(.winapi) u32;
            extern "user32" fn EnumWindows(lpEnumFunc: *const fn (?*anyopaque, isize) callconv(.winapi) i32, lParam: isize) callconv(.winapi) i32;
            extern "user32" fn PostMessageA(hWnd: ?*anyopaque, Msg: u32, wParam: usize, lParam: isize) callconv(.winapi) i32;
        };

        if (g_theme_msg == 0) {
            g_theme_msg = user32_bc.RegisterWindowMessageA("OneViewThemeSync_v1");
        }
        g_app_ptr = app;

        if (g_theme_msg != 0) {
            logMsg("IPC: Broadcasting theme change to {s} (msg_id={d})", .{ theme, g_theme_msg });
            const BroadcastCtx = struct {
                msg: u32,
                wparam: usize,
            };
            var ctx = BroadcastCtx{ .msg = g_theme_msg, .wparam = is_dark };
            const EnumCb = struct {
                fn cb(hwnd_enum: ?*anyopaque, lparam_enum: isize) callconv(.winapi) i32 {
                    const c: *BroadcastCtx = @ptrFromInt(@as(usize, @intCast(lparam_enum)));
                    const user32_bc_internal = struct {
                        extern "user32" fn PostMessageA(hWnd: ?*anyopaque, Msg: u32, wParam: usize, lParam: isize) callconv(.winapi) i32;
                    };
                    _ = user32_bc_internal.PostMessageA(hwnd_enum, c.msg, c.wparam, 0);
                    logMsg("EnumWindows: Posted message {d} (wparam={d}) to hwnd {?p}", .{ c.msg, c.wparam, hwnd_enum });
                    return 1; // continue enumeration
                }
            };
            _ = user32_bc.EnumWindows(EnumCb.cb, @intCast(@intFromPtr(&ctx)));
        }

        req.resolveWith("{\"success\":true}");
        return;
    }

    // Handle detached window calls that do not pass a key parameter
    if (std.mem.eql(u8, method, "open-detached-view-window")) {
        const url = if (payload.get("url")) |u| u.string else return;
        const title = if (payload.get("title")) |t| t.string else "Detached Tab";
        logMsg("IPC: method=open-detached-view-window, url={s}, title={s}", .{ url, title });

        const exe_path = getOwnExePath(app.allocator) orelse "oneview.exe";
        defer if (!std.mem.eql(u8, exe_path, "oneview.exe")) app.allocator.free(exe_path);
        const exe_path_z = app.allocator.dupeZ(u8, exe_path) catch return;
        defer app.allocator.free(exe_path_z);

        const params = std.fmt.allocPrint(app.allocator, "--detached=\"{s}\" --title=\"{s}\"", .{ url, title }) catch return;
        defer app.allocator.free(params);
        const params_z = app.allocator.dupeZ(u8, params) catch return;
        defer app.allocator.free(params_z);

        const shell32 = struct {
            extern "shell32" fn ShellExecuteA(
                hwnd: ?*anyopaque,
                lpOperation: ?[*:0]const u8,
                lpFile: [*:0]const u8,
                lpParameters: ?[*:0]const u8,
                lpDirectory: ?[*:0]const u8,
                nShowCmd: c_int
            ) callconv(.winapi) ?*anyopaque;
        };
        const res = shell32.ShellExecuteA(null, "open", exe_path_z.ptr, params_z.ptr, null, 5); // SW_SHOW = 5
        logMsg("ShellExecuteA returned: {?p}", .{res});
        req.resolveWith("{\"success\":true}");
        return;
    } else if (std.mem.eql(u8, method, "attach-detached-view-window")) {
        const url = if (payload.get("url")) |u| u.string else "";
        logMsg("IPC: method=attach-detached-view-window, url={s}", .{url});
        
        var wsdata: WSADATA = undefined;
        if (WSAStartup(0x0202, &wsdata) == 0) {
            defer _ = WSACleanup();
            const sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
            if (sock != INVALID_SOCKET) {
                defer _ = closesocket(sock);
                var addr = SOCKADDR_IN{
                    .sin_family = AF_INET,
                    .sin_port = htons(SERVER_PORT),
                    .sin_addr = htonl(0x7F000001),
                    .sin_zero = [_]u8{0} ** 8,
                };
                if (connect(sock, &addr, @sizeOf(SOCKADDR_IN)) != SOCKET_ERROR) {
                    const req_str = std.fmt.allocPrint(app.allocator,
                        "POST /api/attach-detached-view-window HTTP/1.1\r\nHost: 127.0.0.1:9731\r\nContent-Type: application/json\r\nContent-Length: {d}\r\nConnection: close\r\n\r\n{{\"url\":\"{s}\"}}",
                        .{ url.len + 9, url }
                    ) catch return;
                    defer app.allocator.free(req_str);
                    _ = send(sock, req_str.ptr, @intCast(req_str.len), 0);
                    logMsg("Sent attach request to primary successfully!", .{});
                }
            }
        }

        req.resolveWith("{\"success\":true}");
        
        const user32 = struct {
            extern "user32" fn PostQuitMessage(nExitCode: c_int) callconv(.winapi) void;
        };
        user32.PostQuitMessage(0);
        return;
    }

    const key = if (payload.get("key")) |k| k.string else {
        std.debug.print("IPC: method={s}, key=<missing, skipping>\n", .{method});
        return;
    };
    std.debug.print("IPC: method={s}, key={s}\n", .{ method, key });

    if (std.mem.eql(u8, method, "create")) {
        // Synchronously put a placeholder in the map if it doesn't exist yet,
        // so that subsequent sync-bounds or load-url calls are not ignored.
        if (!app.child_views.contains(key)) {
            const key_copy = try app.allocator.dupe(u8, key);
            errdefer app.allocator.free(key_copy);
            var view = ContentView{};
            if (payload.get("url")) |u_val| {
                view.pending_url = try app.allocator.dupeZ(u8, u_val.string);
            }
            if (payload.get("partition")) |p_val| {
                view.partition = try app.allocator.dupe(u8, p_val.string);
            }
            try app.child_views.put(key_copy, view);
        } else {
            if (payload.get("url")) |u_val| {
                if (app.child_views.getPtr(key)) |view_ptr| {
                    if (view_ptr.pending_url) |old_url| {
                        app.allocator.free(old_url);
                    }
                    view_ptr.pending_url = try app.allocator.dupeZ(u8, u_val.string);
                }
            }
            if (payload.get("partition")) |p_val| {
                if (app.child_views.getPtr(key)) |view_ptr| {
                    if (view_ptr.partition) |old_part| {
                        app.allocator.free(old_part);
                    }
                    view_ptr.partition = try app.allocator.dupe(u8, p_val.string);
                }
            }
        }

        const disable_gpu = g_is_detached or (if (payload.get("disableGpu")) |dg| dg.bool else false);

        const CreateCtx = struct {
            app: *App,
            key_z: [:0]const u8,
            req: EasyApp.Request,
            disable_gpu: bool,
        };
        const ctx = try app.allocator.create(CreateCtx);
        ctx.app = app;
        ctx.key_z = try app.allocator.dupeZ(u8, key);
        ctx.req = try req.dupe(app.allocator);
        ctx.disable_gpu = disable_gpu;

        const S = struct {
            fn cb(w: *Webview, arg: ?*anyopaque) void {
                _ = w;
                const c = @as(*CreateCtx, @ptrCast(@alignCast(arg.?)));

                var initial_url: ?[:0]const u8 = null;
                if (c.app.child_views.get(c.key_z)) |view| {
                    initial_url = view.pending_url;
                }
                const url_ptr = if (initial_url) |u| u.ptr else "about:blank";

                const is_popup = std.mem.eql(u8, c.key_z, "view:extension-popup");
                const handle = child_webview_create(c.app.main_window_hwnd, url_ptr, is_popup, c.key_z.ptr, c.disable_gpu);
                if (handle == null) {
                    c.req.reject("Failed to create child webview");
                    c.req.deinit(c.app.allocator);
                    // Remove the placeholder if creation failed
                    if (c.app.child_views.getEntry(c.key_z)) |entry| {
                        if (entry.value_ptr.*.pending_url) |p_url| {
                            c.app.allocator.free(p_url);
                        }
                        const old_key = entry.key_ptr.*;
                        _ = c.app.child_views.remove(c.key_z);
                        c.app.allocator.free(old_key);
                    }
                    c.app.allocator.free(c.key_z);
                    c.app.allocator.destroy(c);
                    return;
                }

                const child_win = child_webview_get_hwnd(handle);
                child_webview_add_init_script(handle, INIT_SCRIPT);

                // Dynamically read and inject webview-preload.js
                const preload_file_path = std.fs.path.join(c.app.allocator, &.{ UI_ROOT, "lib", "webview-preload.js" }) catch null;
                defer if (preload_file_path) |p| c.app.allocator.free(p);
                if (preload_file_path) |p| {
                    if (c.app.allocator.dupeZ(u8, p) catch null) |p_z| {
                        defer c.app.allocator.free(p_z);
                        if (fopen(p_z, "rb")) |fh| {
                            defer _ = fclose(fh);
                            _ = fseek(fh, 0, 2);
                            const size = ftell(fh);
                            if (size > 0) {
                                const size_usize: usize = @intCast(size);
                                _ = fseek(fh, 0, 0);
                                if (c.app.allocator.alloc(u8, size_usize + 1) catch null) |buf| {
                                    defer c.app.allocator.free(buf);
                                    _ = fread(buf.ptr, 1, size_usize, fh);
                                    buf[size_usize] = 0; // null-terminated
                                    child_webview_add_init_script(handle, buf[0..size_usize:0].ptr);
                                }
                            }
                        }
                    }
                }

                // Associate the webview and handle with our placeholder
                if (c.app.child_views.getPtr(c.key_z)) |view_ptr| {
                    view_ptr.cpp_handle = handle;
                    view_ptr.panel_hwnd = child_win;
                    
                    if (view_ptr.pending_url) |p_url| {
                        c.app.allocator.free(p_url);
                        view_ptr.pending_url = null;
                    }
                    
                    applyViewBounds(c.app.main_window_hwnd, view_ptr.*);
                }

                c.req.resolveWith("{\"success\":true}");
                c.req.deinit(c.app.allocator);
                c.app.allocator.free(c.key_z);
                c.app.allocator.destroy(c);
            }
        };

        try req.easy.w.dispatchRaw(S.cb, ctx);

    } else if (std.mem.eql(u8, method, "capture-page")) {
        const mode = if (payload.get("mode")) |m| m.string else "visible";
        const full_page = std.mem.eql(u8, mode, "full");
        const scroll_height: c_int = if (payload.get("scrollHeight")) |s| switch (s) {
            .integer => |i| @intCast(i),
            .float => |f| @intFromFloat(f),
            else => 0,
        } else 0;

        if (app.child_views.getPtr(key)) |view_ptr| {
            if (view_ptr.cpp_handle) |h| {
                const CaptureCtx = struct {
                    app: *App,
                    req: EasyApp.Request,
                    full_page: bool,
                    scroll_height: c_int,
                };
                const cctx = try app.allocator.create(CaptureCtx);
                cctx.app = app;
                cctx.req = try req.dupe(app.allocator);
                cctx.full_page = full_page;
                cctx.scroll_height = scroll_height;

                const S = struct {
                    fn cb(ctx_ptr: ?*anyopaque, success: bool, json_str: [*:0]const u8) callconv(.c) void {
                        const c = @as(*CaptureCtx, @ptrCast(@alignCast(ctx_ptr.?)));
                        defer {
                            c.req.deinit(c.app.allocator);
                            c.app.allocator.destroy(c);
                        }

                        if (!success) {
                            c.req.resolveWith("{\"success\":false,\"message\":\"Capture failed\"}");
                            return;
                        }

                        const raw_span = std.mem.span(json_str);
                        
                        // Parse "data" key manually without full AST parser to prevent OOM on huge base64 payloads.
                        // CDP format is typically {"data":"iVBOR..."}
                        var base64_str: []const u8 = "";
                        if (std.mem.indexOf(u8, raw_span, "\"data\":\"")) |data_idx| {
                            const start = data_idx + "\"data\":\"".len;
                            if (std.mem.indexOfScalar(u8, raw_span[start..], '"')) |end_offset| {
                                base64_str = raw_span[start .. start + end_offset];
                            }
                        }

                        if (base64_str.len > 0) {
                            // Construct response directly without printing dataUrl to intermediate buffers multiple times.
                            // We construct the complete JSON directly.
                            const height_val = if (c.full_page and c.scroll_height > 0) c.scroll_height else 720;
                            
                            // Allocate once for the final JSON string:
                            // Prefix: {"success":true,"dataUrl":"data:image/png;base64,
                            // Suffix: ","width":1280,"height":HEIGHT}
                            var suffix_buf: [128]u8 = undefined;
                            const suffix = std.fmt.bufPrint(&suffix_buf, "\",\"width\":1280,\"height\":{d}}}", .{height_val}) catch {
                                c.req.resolveWith("{\"success\":false,\"message\":\"Memory allocation error\"}");
                                return;
                            };
                            
                            const prefix = "{\"success\":true,\"dataUrl\":\"data:image/png;base64,";
                            const total_len = prefix.len + base64_str.len + suffix.len;
                            
                            const res_json_z = c.app.allocator.allocSentinel(u8, total_len, 0) catch {
                                c.req.resolveWith("{\"success\":false,\"message\":\"Memory allocation error\"}");
                                return;
                            };
                            defer c.app.allocator.free(res_json_z);
                            
                            @memcpy(res_json_z[0..prefix.len], prefix);
                            @memcpy(res_json_z[prefix.len .. prefix.len + base64_str.len], base64_str);
                            @memcpy(res_json_z[prefix.len + base64_str.len .. total_len], suffix);
                            
                            c.req.resolveWith(res_json_z);
                        } else {
                            c.req.resolveWith("{\"success\":false,\"message\":\"CDP returned empty data or parsing failed\"}");
                        }
                    }
                };

                child_webview_capture_page(h, full_page, scroll_height, S.cb, cctx);
                return;
            }
        }
        req.resolveWith("{\"success\":false,\"message\":\"No active webview handle found\"}");

    } else if (std.mem.eql(u8, method, "execute-javascript")) {
        const script = if (payload.get("code")) |c| c.string else return;

        if (app.child_views.getPtr(key)) |view_ptr| {
            if (view_ptr.cpp_handle) |h| {
                const script_z = app.allocator.dupeZ(u8, script) catch return;
                defer app.allocator.free(script_z);

                const ScriptCtx = struct {
                    app: *App,
                    req: EasyApp.Request,
                };
                const sctx = try app.allocator.create(ScriptCtx);
                sctx.app = app;
                sctx.req = try req.dupe(app.allocator);

                const S = struct {
                    fn scriptCallback(ctx_ptr: ?*anyopaque, success: bool, json_str: [*:0]const u8) callconv(.c) void {
                        const c = @as(*ScriptCtx, @ptrCast(@alignCast(ctx_ptr.?)));
                        defer {
                            c.req.deinit(c.app.allocator);
                            c.app.allocator.destroy(c);
                        }
                        const raw_result_json = std.mem.span(json_str);
                        const res_json = std.fmt.allocPrint(c.app.allocator, "{{\"success\":{},\"result\":{s}}}", .{ success, raw_result_json }) catch return;
                        defer c.app.allocator.free(res_json);
                        const res_json_z = c.app.allocator.dupeZ(u8, res_json) catch return;
                        defer c.app.allocator.free(res_json_z);
                        c.req.resolveWith(res_json_z);
                    }
                };
                child_webview_execute_script(h, script_z, S.scriptCallback, sctx);
                return;
            }
        }
        req.resolveWith("{\"success\":false,\"message\":\"No active webview handle found\"}");

    } else if (std.mem.eql(u8, method, "resolve-browser-extension-command")) {
        const popup_key = if (payload.get("key")) |k| k.string else "view:extension-popup";
        const success = if (payload.get("success")) |s| s.bool else false;

        const result_val = payload.get("result") orelse std.json.Value.null;

        const result_json = std.json.Stringify.valueAlloc(app.allocator, result_val, .{}) catch "null";
        defer if (!std.mem.eql(u8, result_json, "null")) app.allocator.free(result_json);

        const request_id = if (payload.get("requestId")) |r| switch (r) {
            .integer => |i| i,
            .float => |f| @as(i64, @intFromFloat(f)),
            .string => |s| std.fmt.parseInt(i64, s, 10) catch 0,
            .number_string => |s| std.fmt.parseInt(i64, s, 10) catch 0,
            else => 0,
        } else 0;

        if (app.child_views.getPtr(popup_key)) |view_ptr| {
            if (view_ptr.cpp_handle) |h| {
                const res_js = std.fmt.allocPrint(app.allocator, "window._resolveWebcontentCall({d}, {}, {s});", .{
                    request_id,
                    success,
                    result_json
                }) catch "window._resolveWebcontentCall(0, false, null);";
                defer if (!std.mem.eql(u8, res_js, "window._resolveWebcontentCall(0, false, null);")) app.allocator.free(res_js);
                const res_js_z = app.allocator.dupeZ(u8, res_js) catch return;
                defer app.allocator.free(res_js_z);

                const S = struct {
                    fn cb(ctx: ?*anyopaque, ok: bool, res: [*:0]const u8) callconv(.c) void {
                        _ = ctx; _ = ok; _ = res;
                    }
                };
                child_webview_execute_script(h, res_js_z, S.cb, null);
            }
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "capture-active-tab")) {
        const mode = if (payload.get("mode")) |m| m.string else "visible";
        const full_page = std.mem.eql(u8, mode, "full");
        const scroll_height: c_int = if (payload.get("scrollHeight")) |s| switch (s) {
            .integer => |i| @intCast(i),
            .float => |f| @intFromFloat(f),
            else => 0,
        } else 0;

        var active_handle: ?*anyopaque = null;
        var it = app.child_views.iterator();
        while (it.next()) |entry| {
            if (entry.value_ptr.*.last_visible and std.mem.startsWith(u8, entry.key_ptr.*, "view:tab-")) {
                active_handle = entry.value_ptr.*.cpp_handle;
                break;
            }
        }

        if (active_handle == null) {
            var it2 = app.child_views.iterator();
            while (it2.next()) |entry| {
                if (std.mem.startsWith(u8, entry.key_ptr.*, "view:tab-")) {
                    active_handle = entry.value_ptr.*.cpp_handle;
                    break;
                }
            }
        }

        if (active_handle) |h| {
            const CaptureCtx = struct {
                app: *App,
                req: EasyApp.Request,
                full_page: bool,
                scroll_height: c_int,
            };
            const cctx = try app.allocator.create(CaptureCtx);
            cctx.app = app;
            cctx.req = try req.dupe(app.allocator);
            cctx.full_page = full_page;
            cctx.scroll_height = scroll_height;

            const S = struct {
                fn cb(ctx_ptr: ?*anyopaque, success: bool, json_str: [*:0]const u8) callconv(.c) void {
                    const c = @as(*CaptureCtx, @ptrCast(@alignCast(ctx_ptr.?)));
                    defer {
                        c.req.deinit(c.app.allocator);
                        c.app.allocator.destroy(c);
                    }

                    if (!success) {
                        c.req.resolveWith("{\"success\":false,\"message\":\"Capture failed\"}");
                        return;
                    }

                    var parsed_cdp = std.json.parseFromSlice(std.json.Value, c.app.allocator, std.mem.span(json_str), .{}) catch {
                        c.req.resolveWith("{\"success\":false,\"message\":\"Failed to parse capture json\"}");
                        return;
                    };
                    defer parsed_cdp.deinit();

                    const cdp_obj = parsed_cdp.value.object;
                    if (cdp_obj.get("data")) |d| {
                        const base64_str = d.string;
                        const dataUrl = std.fmt.allocPrint(c.app.allocator, "data:image/png;base64,{s}", .{ base64_str }) catch {
                            c.req.resolveWith("{\"success\":false,\"message\":\"Memory allocation error\"}");
                            return;
                        };
                        defer c.app.allocator.free(dataUrl);

                        const res_json = std.fmt.allocPrint(c.app.allocator,
                            "{{\"success\":true,\"dataUrl\":\"{s}\",\"width\":1280,\"height\":{d}}}",
                            .{ dataUrl, if (c.full_page and c.scroll_height > 0) c.scroll_height else 720 }
                        ) catch {
                            c.req.resolveWith("{\"success\":false,\"message\":\"Memory allocation error\"}");
                            return;
                        };
                        defer c.app.allocator.free(res_json);

                        const res_json_z = c.app.allocator.dupeZ(u8, res_json) catch {
                            c.req.resolveWith("{\"success\":false,\"message\":\"Memory allocation error\"}");
                            return;
                        };
                        defer c.app.allocator.free(res_json_z);

                        c.req.resolveWith(res_json_z);
                    } else {
                        c.req.resolveWith("{\"success\":false,\"message\":\"CDP returned empty data\"}");
                    }
                }
            };

            child_webview_capture_page(h, full_page, scroll_height, S.cb, cctx);
            return;
        }
        req.resolveWith("{\"success\":false,\"message\":\"No active tab found\"}");

    } else if (std.mem.eql(u8, method, "tabs-create")) {
        const url_val = if (payload.get("url")) |u| u.string else "";
        if (url_val.len > 0) {
            const eval_script = try std.fmt.allocPrint(app.allocator,
                \\document.dispatchEvent(new CustomEvent('zero:browser-extension-command', {{ detail: {{ command: 'tabs-create', url: '{s}', active: true }} }}));
            , .{ url_val });
            defer app.allocator.free(eval_script);
            const eval_script_z = try app.allocator.dupeZ(u8, eval_script);
            defer app.allocator.free(eval_script_z);
            try req.easy.eval(eval_script_z);
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "destroy")) {
        std.debug.print("IPC Destroy: key={s}\n", .{ key });
        if (app.child_views.getEntry(key)) |entry| {
            if (entry.value_ptr.*.cpp_handle) |h| {
                child_webview_destroy(h);
            }
            if (entry.value_ptr.*.pending_url) |p_url| {
                app.allocator.free(p_url);
            }
            if (entry.value_ptr.*.loaded_url) |l_url| {
                app.allocator.free(l_url);
            }
            if (entry.value_ptr.*.partition) |part| {
                app.allocator.free(part);
            }
            const old_key = entry.key_ptr.*;
            _ = app.child_views.remove(key);
            app.allocator.free(old_key);
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "set-bounds")) {
        const S = struct {
            fn jsonValToInt(val: std.json.Value) c_int {
                switch (val) {
                    .integer => |i| return @intCast(i),
                    .float => |f| return @intFromFloat(f),
                    else => return 0,
                }
            }
        };

        const bounds = payload.get("bounds").?.object;
        const x = S.jsonValToInt(bounds.get("x").?);
        const y = S.jsonValToInt(bounds.get("y").?);
        const w = S.jsonValToInt(bounds.get("width").?);
        const h = S.jsonValToInt(bounds.get("height").?);
        const visible = if (payload.get("visible")) |v| v.bool else true;

        // Store bounds in the ContentView regardless (so WM_WINDOWPOSCHANGED can use them)
        if (app.child_views.getPtr(key)) |view_ptr| {
            view_ptr.last_x = x;
            view_ptr.last_y = y;
            view_ptr.last_w = w;
            view_ptr.last_h = h;
            view_ptr.last_visible = visible;

            // Only apply bounds if the webview has been fully created/attached
            if (view_ptr.cpp_handle != null) {
                // Dispatch positioning to GUI thread
                const BoundsCtx = struct {
                    app: *App,
                    key_z: [:0]const u8,
                };
                const bctx = try app.allocator.create(BoundsCtx);
                bctx.* = .{
                    .app = app,
                    .key_z = try app.allocator.dupeZ(u8, key),
                };
                const BoundsApply = struct {
                    fn cb(wv: *Webview, arg: ?*anyopaque) void {
                        _ = wv;
                        const bc = @as(*BoundsCtx, @ptrCast(@alignCast(arg.?)));
                        defer {
                            bc.app.allocator.free(bc.key_z);
                            bc.app.allocator.destroy(bc);
                        }
                        if (bc.app.child_views.get(bc.key_z)) |view| {
                            applyViewBounds(bc.app.main_window_hwnd, view);
                        }
                    }
                };
                try req.easy.w.dispatchRaw(BoundsApply.cb, bctx);
            }
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "load-url")) {
        const url = payload.get("url").?.string;
        if (app.child_views.getPtr(key)) |view_ptr| {
            if (view_ptr.loaded_url) |old_url| {
                app.allocator.free(old_url);
            }
            view_ptr.loaded_url = try app.allocator.dupe(u8, url);

            if (view_ptr.cpp_handle) |h| {
                _ = h;
                // Navigate MUST run on the GUI thread (WebView2 COM STA requirement)
                const NavCtx = struct {
                    app: *App,
                    key_z: [:0]const u8,
                    url_buf: [2048]u8,
                    url_len: usize,
                };
                const nctx = try app.allocator.create(NavCtx);
                const url_copy = url[0..@min(url.len, 2047)];
                @memcpy(nctx.url_buf[0..url_copy.len], url_copy);
                nctx.url_buf[url_copy.len] = 0;
                nctx.url_len = url_copy.len;
                nctx.app = app;
                nctx.key_z = try app.allocator.dupeZ(u8, key);
                
                const Nav = struct {
                    fn cb(w: *Webview, arg: ?*anyopaque) void {
                        _ = w;
                        const nc = @as(*NavCtx, @ptrCast(@alignCast(arg.?)));
                        defer {
                            nc.app.allocator.free(nc.key_z);
                            nc.app.allocator.destroy(nc);
                        }
                        if (nc.app.child_views.get(nc.key_z)) |view_info| {
                            if (view_info.cpp_handle) |handle| {
                                const url_ptr: [*:0]const u8 = @ptrCast(&nc.url_buf);
                                child_webview_navigate(handle, url_ptr);
                                applyViewBounds(nc.app.main_window_hwnd, view_info);
                            }
                        }
                    }
                };
                try req.easy.w.dispatchRaw(Nav.cb, nctx);
            } else {
                // If the webview is not created yet, queue the URL
                if (view_ptr.pending_url) |old_url| {
                    app.allocator.free(old_url);
                }
                view_ptr.pending_url = try app.allocator.dupeZ(u8, url);
            }

            // Emit did-finish-load event back to JS
            const eval_script = try std.fmt.allocPrint(app.allocator,
                "window._wcEmit && window._wcEmit('{s}', 'did-finish-load', {{ url: '{s}' }});",
                .{ key, url }
            );
            defer app.allocator.free(eval_script);
            const eval_script_z = try app.allocator.dupeZ(u8, eval_script);
            defer app.allocator.free(eval_script_z);
            try req.easy.eval(eval_script_z);
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "go-back")) {
        if (app.child_views.getPtr(key)) |view_ptr| {
            if (view_ptr.cpp_handle) |h| {
                const CmdCtx = struct {
                    cpp_handle: ?*anyopaque,
                };
                const cctx = try app.allocator.create(CmdCtx);
                cctx.cpp_handle = h;
                const GoBack = struct {
                    fn cb(wv: *Webview, arg: ?*anyopaque) void {
                        _ = wv;
                        const cc = @as(*CmdCtx, @ptrCast(@alignCast(arg.?)));
                        defer g_app_ptr.?.allocator.destroy(cc);
                        child_webview_go_back(cc.cpp_handle);
                    }
                };
                try req.easy.w.dispatchRaw(GoBack.cb, cctx);
            }
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "go-forward")) {
        if (app.child_views.getPtr(key)) |view_ptr| {
            if (view_ptr.cpp_handle) |h| {
                const CmdCtx = struct {
                    cpp_handle: ?*anyopaque,
                };
                const cctx = try app.allocator.create(CmdCtx);
                cctx.cpp_handle = h;
                const GoForward = struct {
                    fn cb(wv: *Webview, arg: ?*anyopaque) void {
                        _ = wv;
                        const cc = @as(*CmdCtx, @ptrCast(@alignCast(arg.?)));
                        defer g_app_ptr.?.allocator.destroy(cc);
                        child_webview_go_forward(cc.cpp_handle);
                    }
                };
                try req.easy.w.dispatchRaw(GoForward.cb, cctx);
            }
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "reload")) {
        if (app.child_views.getPtr(key)) |view_ptr| {
            if (view_ptr.cpp_handle) |h| {
                const CmdCtx = struct {
                    cpp_handle: ?*anyopaque,
                };
                const cctx = try app.allocator.create(CmdCtx);
                cctx.cpp_handle = h;
                const Reload = struct {
                    fn cb(wv: *Webview, arg: ?*anyopaque) void {
                        _ = wv;
                        const cc = @as(*CmdCtx, @ptrCast(@alignCast(arg.?)));
                        defer g_app_ptr.?.allocator.destroy(cc);
                        child_webview_reload(cc.cpp_handle);
                    }
                };
                try req.easy.w.dispatchRaw(Reload.cb, cctx);
            }
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "hide")) {
        if (app.child_views.getPtr(key)) |view_ptr| {
            view_ptr.last_visible = false;
            if (view_ptr.cpp_handle != null) {
                applyViewBounds(app.main_window_hwnd, view_ptr.*);
            }
        }
        req.resolveWith("{\"success\":true}");

    } else if (std.mem.eql(u8, method, "show")) {
        if (app.child_views.getPtr(key)) |view_ptr| {
            view_ptr.last_visible = true;
            if (view_ptr.cpp_handle != null) {
                applyViewBounds(app.main_window_hwnd, view_ptr.*);
            }
        }
        req.resolveWith("{\"success\":true}");

    } else {
        req.resolveWith("{\"success\":true}");
    }
}

// ─── Init script: rewrite backend URLs and wire window.api IPC to native ─────
const INIT_SCRIPT =
    \\(function() {
    \\  window.process = window.process || { argv: [], env: { ONEVIEW_APP_ENV: 'dev' } };
    \\  const B1 = 'http://10.215.56.196:8009';
    \\  const B2 = 'http://10.215.56.196:5000';
    \\  const P1 = 'http://127.0.0.1:9731/proxy';
    \\  const P2 = 'http://127.0.0.1:9731/proxy5000';
    \\  function rewrite(url) {
    \\    if (typeof url !== 'string') return url;
    \\    if (url.startsWith(B1)) return P1 + url.slice(B1.length);
    \\    if (url.startsWith(B2)) return P2 + url.slice(B2.length);

    \\    if (url.startsWith('https://raw.githubusercontent.com')) {
    \\      return 'http://127.0.0.1:9731/frameproxy?url=' + encodeURIComponent(url);
    \\    }
    \\    return url;
    \\  }
    \\  // Patch fetch
    \\  const _fetch = window.fetch.bind(window);
    \\  window.fetch = function(url, opts) {
    \\    if (url instanceof Request)
    \\      url = new Request(rewrite(url.url), url);
    \\    else
    \\      url = rewrite(url);
    \\    return _fetch(url, opts);
    \\  };
    \\  // Patch XMLHttpRequest
    \\  const _open = XMLHttpRequest.prototype.open;
    \\  XMLHttpRequest.prototype.open = function(m, url, ...a) {
    \\    return _open.call(this, m, rewrite(url), ...a);
    \\  };
    \\
    \\  // ── window.api shim: forwards calls to native WebView binding ────────────
    \\  window.api = window.api || {};
    \\  const pendingRequests = new Map();
    \\  let nextRequestId = 1;
    \\  window.api.webContentCall = function(method, payload) {
    \\    if (typeof window.nativeWebcontentCall === "function") {
    \\      return window.nativeWebcontentCall(method, payload);
    \\    } else if (window.chrome && window.chrome.webview && typeof window.chrome.webview.postMessage === "function") {
    \\      const requestId = nextRequestId++;
    \\      return new Promise((resolve, reject) => {
    \\        pendingRequests.set(requestId, { resolve, reject });
    \\        window.chrome.webview.postMessage(JSON.stringify({ requestId, method, payload }));
    \\      });
    \\    }
    \\    return Promise.reject(new Error("No native webContentCall binding available"));
    \\  };
    \\  window._resolveWebcontentCall = function(requestId, success, result) {
    \\    const req = pendingRequests.get(requestId);
    \\    if (req) {
    \\      pendingRequests.delete(requestId);
    \\      if (success) {
    \\        req.resolve(result);
    \\      } else {
    \\        req.reject(new Error(result.message || "Request failed"));
    \\      }
    \\    }
    \\  };
    \\  let _wcListener = null;
    \\  window.api.onWebContentEvent = function(cb) {
    \\    _wcListener = cb;
    \\  };
    \\  window._wcEmit = function(key, event, payload) {
    \\    if (_wcListener) {
    \\      try { _wcListener({ key, event, payload }); } catch(e) {}
    \\    }
    \\  };
    \\  window.api.on = window.api.on || function(evt, cb) {};
    \\  window.api.logout = window.api.logout || async function() { window.location.href = '/pages/login/index.html'; };
    \\  window.api.savePersistedCredentials = window.api.savePersistedCredentials || async function(creds) {
    \\    try { localStorage.setItem('oneview_persisted_creds', JSON.stringify(creds)); return { success: true }; } catch(e) { return { success: false }; }
    \\  };
    \\  window.api.getPersistedCredentials = window.api.getPersistedCredentials || async function() {
    \\    try {
    \\      const raw = localStorage.getItem('oneview_persisted_creds');
    \\      if (!raw) return null;
    \\      const data = JSON.parse(raw);
    \\      if (data.expiry && Date.now() > data.expiry) {
    \\        localStorage.removeItem('oneview_persisted_creds');
    \\        return null;
    \\      }
    \\      return data;
    \\    } catch(e) { return null; }
    \\  };
    \\  window.api.clearPersistedCredentials = window.api.clearPersistedCredentials || async function() {
    \\    try { localStorage.removeItem('oneview_persisted_creds'); return { success: true }; } catch(e) { return { success: false }; }
    \\  };
    \\  // ── Profile credential store (password manager via HTTP server) ───────────
    \\  window.api.listProfileCredentials = window.api.listProfileCredentials || async function() {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/list-credentials');
    \\      return await r.json();
    \\    } catch(e) { return { success: true, data: [] }; }
    \\  };
    \\  window.api.saveProfileCredential = window.api.saveProfileCredential || async function(cred) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/save-credential', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify(cred)
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.deleteProfileCredential = window.api.deleteProfileCredential || async function(cred) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/delete-credential', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify(cred)
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.setOneviewSharedStorage = window.api.setOneviewSharedStorage || function() {};
    \\  window.api.listOneviewSharedStorage = window.api.listOneviewSharedStorage || async function() { return []; };
    \\  window.api.clearOneviewSharedStorage = window.api.clearOneviewSharedStorage || async function() {};
    \\  window.api.clearOneviewEmbeddedTracking = window.api.clearOneviewEmbeddedTracking || async function() {};
    \\  window.api.launchExe = window.api.launchExe || async function(path, tech) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/launch-exe', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify({ path, tech })
    \\      });
    \\      return await r.json();
    \\    } catch(e) {
    \\      return { success: false, message: e.message };
    \\    }
    \\  };
    \\  window.api.githubCheckForUpdates = window.api.githubCheckForUpdates || async function() { return null; };
    \\  // ── Appstore path resolution stubs ──────────────────────────────────────
    \\  window.api.getAppsSecretRoot = window.api.getAppsSecretRoot || async function() {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/apps-secret-root');
    \\      const j = await r.json();
    \\      return j.path || '';
    \\    } catch(e) { return ''; }
    \\  };
    \\  window.api.getLocalAppDataPath = window.api.getLocalAppDataPath || async function() {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/local-appdata-path');
    \\      const j = await r.json();
    \\      return j.path || '';
    \\    } catch(e) { return ''; }
    \\  };
    \\  window.api.onDownloadProgress = window.api.onDownloadProgress || function(cb) {
    \\    const interval = setInterval(async () => {
    \\      try {
    \\        const r = await fetch('http://127.0.0.1:9731/api/download-progress');
    \\        const j = await r.json();
    \\        if (j.targetPath) {
    \\          cb(j);
    \\        }
    \\      } catch(e) {}
    \\    }, 250);
    \\    return () => clearInterval(interval);
    \\  };
    \\  window.api.listManagedDownloads = window.api.listManagedDownloads || async function() { return []; };
    \\  window.api.onBrowserExtensionCommand = window.api.onBrowserExtensionCommand || function(cb) {
    \\    document.addEventListener('zero:browser-extension-command', (e) => {
    \\      if (e.detail && e.detail.command) {
    \\        cb(e.detail);
    \\      }
    \\    });
    \\  };
    \\  window.api.onDetachedTabAttachRequest = window.api.onDetachedTabAttachRequest || function(cb) {
    \\    document.addEventListener('zero:detached-tab-attach-request', (e) => {
    \\      if (e.detail) cb(e.detail);
    \\    });
    \\  };
    \\  window.api.onDetachedOpenRequest = window.api.onDetachedOpenRequest || function(cb) {
    \\    document.addEventListener('zero:detached-open-request', (e) => {
    \\      if (e.detail) cb(e.detail);
    \\    });
    \\  };
    \\  window.api.runManagedDownloadAction = window.api.runManagedDownloadAction || async function() {};
    \\  window.api.verifyFileSha256 = window.api.verifyFileSha256 || async function() { return { success: false }; };
    \\  window.api.registerLocalApp = window.api.registerLocalApp || async function() { return { success: false }; };
    \\  window.api.resolveOneviewAppUrl = window.api.resolveOneviewAppUrl || async function() { return { success: false }; };
    \\  // ── App version ─────────────────────────────────────────────────────────
    \\  window.api.getAppVersion = window.api.getAppVersion || async function() {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/app-version');
    \\      const j = await r.json();
    \\      return j.version || '1.0.0';
    \\    } catch(e) { return '1.0.0'; }
    \\  };
    \\  window.api.getCurrentUpdateStatus = window.api.getCurrentUpdateStatus || async function() {
    \\    return { status: 'idle' };
    \\  };
    \\  // ── File operations (download / unzip / delete) ──────────────────────────
    \\  window.api.downloadFile = window.api.downloadFile || async function(url, targetPath) {
    \\    const r = await fetch('http://127.0.0.1:9731/api/download-file', {
    \\      method: 'POST',
    \\      headers: { 'Content-Type': 'application/json' },
    \\      body: JSON.stringify({ url, targetPath }),
    \\    });
    \\    const j = await r.json();
    \\    if (!j.success) throw new Error(j.message || 'Download failed');
    \\  };
    \\  window.api.onBrowserExtensionCommand = window.api.onBrowserExtensionCommand || function(cb) {
    \\    document.addEventListener('zero:browser-extension-command', (e) => {
    \\      if (e.detail && e.detail.command) {
    \\        cb(e.detail);
    \\      }
    \\    });
    \\  };
    \\  window.api.resolveBrowserExtensionCommand = window.api.resolveBrowserExtensionCommand || async function(payload) {
    \\    return window.api.webContentCall("resolve-browser-extension-command", payload);
    \\  };
    \\  window.api.unzipFile = window.api.unzipFile || async function(zipPath, extractPath, opts) {
    \\    const r = await fetch('http://127.0.0.1:9731/api/unzip-file', {
    \\      method: 'POST',
    \\      headers: { 'Content-Type': 'application/json' },
    \\      body: JSON.stringify({ zipPath, extractPath }),
    \\    });
    \\    const j = await r.json();
    \\    if (!j.success) throw new Error(j.message || 'Unzip failed');
    \\  };
    \\  window.api.deletePath = window.api.deletePath || async function(targetPath) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/delete-path', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify({ targetPath }),
    \\      });
    \\      const j = await r.json();
    \\      return j;
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.installSystemWideApp = window.api.installSystemWideApp || async function() { return { success: false, message: 'Not supported in native port' }; };
    \\  window.api.installManagedWindowsApp = window.api.installManagedWindowsApp || async function() { return { success: false, message: 'Not supported in native port' }; };
    \\  window.api.uninstallManagedWindowsApp = window.api.uninstallManagedWindowsApp || async function() { return { success: false }; };
    \\  window.api.openDetachedViewWindow = window.api.openDetachedViewWindow || async function(payload) {
    \\    const q = new URLSearchParams();
    \\    q.set('url', payload.url || '');
    \\    q.set('title', payload.title || 'Detached Tab');
    \\    q.set('partition', payload.partition || '');
    \\    const finalUrl = 'http://127.0.0.1:9731/pages/detached-browser/index.html?' + q.toString();
    \\    return window.api.webContentCall("open-detached-view-window", { url: finalUrl, title: payload.title || 'Detached Tab' });
    \\  };
    \\  window.api.attachDetachedViewWindow = window.api.attachDetachedViewWindow || async function(payload) {
    \\    return window.api.webContentCall("attach-detached-view-window", payload);
    \\  };
    \\  window.api.minimize = window.api.minimize || async function() {
    \\    return window.api.webContentCall("minimize-window", {});
    \\  };
    \\  window.api.maximize = window.api.maximize || async function() {
    \\    return window.api.webContentCall("maximize-window", {});
    \\  };
    \\  window.api.close = window.api.close || async function() {
    \\    return window.api.webContentCall("close-window", {});
    \\  };
    \\  window.api.dragWindow = window.api.dragWindow || async function() {
    \\    return window.api.webContentCall("drag-window", {});
    \\  };
    \\  window.api.onBrowserExtensionCommand = window.api.onBrowserExtensionCommand || function(cb) {
    \\    document.addEventListener('zero:browser-extension-command', (e) => {
    \\      if (e.detail && e.detail.command) {
    \\        cb(e.detail);
    \\      }
    \\    });
    \\  };
    \\
    \\  // ── Browser extension management ─────────────────────────────────────────
    \\  window.api.installBrowserExtensionFromPath = window.api.installBrowserExtensionFromPath || async function(opts) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/install-extension', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify(opts),
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.listBrowserExtensions = window.api.listBrowserExtensions || async function() {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/list-extensions');
    \\      const res = await r.json();
    \\      if (res && Array.isArray(res.entries)) {
    \\        const enriched = [];
    \\        for (const entry of res.entries) {
    \\          let manifest = { entrypoints: { popup: 'popup.html', root: 'result.html' } };
    \\          let iconFile = 'assets/icon.svg';
    \\          try {
    \\            const manifestRes = await fetch('http://127.0.0.1:9731/api/extension-icon?path=' + encodeURIComponent(entry.path) + '&file=oneview-manifest.json');
    \\            if (manifestRes.ok) {
    \\              const m = await manifestRes.json();
    \\              if (m) {
    \\                manifest = m;
    \\                if (m.icons) {
    \\                  iconFile = m.icons['48'] || m.icons['16'] || m.icons['128'] || iconFile;
    \\                }
    \\              }
    \\            }
    \\          } catch(e) { console.warn("Failed to fetch manifest for", entry.path, e); }
    \\          
    \\          const name = entry.manifestName || manifest.name || 'Unnamed Extension';
    \\          const iconUrl = entry.path ? 'http://127.0.0.1:9731/api/extension-icon?path=' + encodeURIComponent(entry.path) + '&file=' + encodeURIComponent(iconFile) : '';
    \\          const pathUrl = entry.path ? entry.path.replace(/\\/g, '/') : '';
    \\          
    \\          const popupUrl = pathUrl ? 'http://127.0.0.1:9731/api/extension-icon?path=' + encodeURIComponent(entry.path) + '&file=' + encodeURIComponent(manifest.entrypoints?.popup || 'popup.html') : '';
    \\          const optionsUrl = pathUrl ? 'http://127.0.0.1:9731/api/extension-icon?path=' + encodeURIComponent(entry.path) + '&file=' + encodeURIComponent(manifest.entrypoints?.options || 'options.html') : '';
    \\          
    \\          enriched.push({
    \\            ...entry,
    \\            name: name,
    \\            actionTitle: name,
    \\            actionIconPath: iconFile,
    \\            actionIconFileUrl: iconUrl,
    \\            popupUrl: popupUrl,
    \\            optionsUrl: optionsUrl,
    \\            enabled: entry.enabled !== false,
    \\            exists: true,
    \\            manifest: manifest
    \\          });
    \\        }
    \\        res.entries = enriched;
    \\      }
    \\      return res;
    \\    } catch(e) { return { success: false, entries: [] }; }
    \\  };
    \\  window.api.openBrowserExtensionPopup = window.api.openBrowserExtensionPopup || async function(payload) {
    \\    try {
    \\      // Native webview popup implementation: register a native popup view mapping
    \\      const key = 'view:extension-popup';
    \\      // Define dimensions: sitesnap popups default to 350x550 as defined in manifest
    \\      const width = 350;
    \\      const height = 550;
    \\      
    \\      // Get coordinate points relative to the main window
    \\      const rightMargin = 20;
    \\      let top = 120;
    \\      if (payload.anchor && typeof payload.anchor.bottom === 'number') {
    \\        top = payload.anchor.bottom + 10;
    \\      }
    \\      
    \\      // Calculate x coordinate so it aligns on the right side of the window
    \\      const parentW = window.innerWidth || 1280;
    \\      const left = parentW - width - rightMargin;
    \\      
    \\      // Destroy any existing popup view first
    \\      await window.api.webContentCall('destroy', { key });
    \\      
    \\      // Create native child WebView for the popup
    \\      await window.api.webContentCall('create', { key, url: payload.url });
    \\      
    \\      // Size and display the WebView floating on top of the tab airspace
    \\      await window.api.webContentCall('set-bounds', {
    \\        key,
    \\        bounds: { x: left, y: top, width: width, height: height },
    \\        visible: true
    \\      });
    \\      
    \\      // Show the header/metadata wrapper frame in html layout
    \\      const container = document.getElementById('browserExtensionPopup');
    \\      if (container) {
    \\        container.classList.remove('hidden');
    \\        container.style.position = 'absolute';
    \\        container.style.right = rightMargin + 'px';
    \\        container.style.top = top + 'px';
    \\        container.style.width = width + 'px';
    \\        container.style.height = height + 'px';
    \\        container.style.pointerEvents = 'none'; // click passes through html container to native webview
    \\      }
    \\      return { success: true };
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.closeBrowserExtensionPopup = window.api.closeBrowserExtensionPopup || async function() {
    \\    const key = 'view:extension-popup';
    \\    await window.api.webContentCall('destroy', { key });
    \\    const container = document.getElementById('browserExtensionPopup');
    \\    if (container) container.classList.add('hidden');
    \\    return { success: true };
    \\  };
    \\  window.api.removeBrowserExtension = window.api.removeBrowserExtension || async function(opts) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/remove-extension', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify(opts),
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.toggleBrowserExtension = window.api.toggleBrowserExtension || async function(opts) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/toggle-extension', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify(opts),
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.reloadBrowserExtension = window.api.reloadBrowserExtension || async function() { return { success: true }; };
    \\  window.api.listProfileCredentials = window.api.listProfileCredentials || async function() {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/list-credentials');
    \\      return await r.json();
    \\    } catch(e) { return { success: false, data: [] }; }
    \\  };
    \\  window.api.saveProfileCredential = window.api.saveProfileCredential || async function(opts) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/save-credential', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify(opts)
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.deleteProfileCredential = window.api.deleteProfileCredential || async function(opts) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/delete-credential', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify(opts)
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.showNativeTabContextMenu = window.api.showNativeTabContextMenu || async function(opts) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/show-native-tab-context-menu', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify(opts)
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false }; }
    \\  };
    \\  let _tabContextListener = null;
    \\  window.api.onNativeTabContextAction = window.api.onNativeTabContextAction || function(cb) {
    \\    _tabContextListener = cb;
    \\  };
    \\  window._wcEmitTabContextAction = function(action, anchorId) {
    \\    if (_tabContextListener) {
    \\      try { _tabContextListener({ action, anchorId }); } catch(e) {}
    \\    }
    \\  };
    \\  window.api.clearWebviewPageCache = window.api.clearWebviewPageCache || async function(partition, url) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/clear-webview-page-cache', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify({ partition, url })
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.clearWebviewUserData = window.api.clearWebviewUserData || async function(partition, url) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/clear-webview-user-data', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify({ partition, url })
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };
    \\  window.api.toggleWebviewDevTools = window.api.toggleWebviewDevTools || async function(webContentsId) {
    \\    try {
    \\      const r = await fetch('http://127.0.0.1:9731/api/toggle-webview-dev-tools', {
    \\        method: 'POST',
    \\        headers: { 'Content-Type': 'application/json' },
    \\        body: JSON.stringify({ webContentsId })
    \\      });
    \\      return await r.json();
    \\    } catch(e) { return { success: false, message: e.message }; }
    \\  };

    \\
    \\  // ── window.oneviewExtension and window.oneview bridge ────────────────────────
    \\  const oneviewBridge = {
    \\    capabilities: {
    \\      get: async function() { return {}; }
    \\    },
    \\    runtime: {
    \\      id: "sitesnap-ov",
    \\      getManifest: function() { return {}; },
    \\      openPage: async function(pageType) {
    \\        // Reconstruct correct extension URL with path= param intact
    \\        try {
    \\          const urlObj = new URL(window.location.href);
    \\          const extPath = urlObj.searchParams.get("path") || "";
    \\          const target = pageType === "popup" ? "popup.html" : "result.html";
    \\          const url = window.location.origin + "/api/extension-icon?path=" + encodeURIComponent(extPath) + "&file=" + target;
    \\          return window.api.webContentCall("tabs-create", { url: url, active: true });
    \\        } catch(e) {
    \\          console.error("openPage failed:", e);
    \\          return { success: false };
    \\        }
    \\      }
    \\    },
    \\    host: {
    \\      activeTab: {
    \\        get: function() { return { id: "active-tab", url: window.location.href, title: document.title }; }
    \\      },
    \\      executeScript: async function(opts) {
    \\        return window.api.webContentCall("execute-script", opts);
    \\      },
    \\      capturePage: async function(opts) {
    \\        return window.api.webContentCall("capture-active-tab", opts);
    \\      },
    \\      tabs: {
    \\        create: async function(opts) {
    \\          return window.api.webContentCall("tabs-create", opts);
    \\        }
    \\      }
    \\    },
    \\    fs: {},
    \\    os: {},
    \\    dialog: {},
    \\    ui: {
    \\      resize: async function(opts) {
    \\        return window.api.webContentCall("resize", opts);
    \\      }
    \\    }
    \\  };
    \\  window.oneviewExtension = oneviewBridge;
    \\  window.oneview = oneviewBridge;
    \\})();
;

var g_app_ptr: ?*App = null;
var g_is_detached: bool = false;

fn saveCredentialHelper(allocator: std.mem.Allocator, cred_val: std.json.Value, profileId: []const u8) !void {
    const appdata = getEnvVar(allocator, "APPDATA");
    defer if (appdata.len > 0) allocator.free(appdata);
    const dir_path = try std.fs.path.join(allocator, &.{ appdata, "OneView" });
    defer allocator.free(dir_path);

    const dir_path_z = try allocator.dupeZ(u8, dir_path);
    defer allocator.free(dir_path_z);
    _ = CreateDirectoryA(dir_path_z, null);

    const cred_path = try std.fs.path.join(allocator, &.{ dir_path, "credentials.json" });
    defer allocator.free(cred_path);
    const cred_path_z2 = try allocator.dupeZ(u8, cred_path);
    defer allocator.free(cred_path_z2);

    // Read existing list
    var existing_parsed: ?std.json.Parsed(std.json.Value) = null;
    defer if (existing_parsed) |*ep| ep.deinit();
    if (fopen(cred_path_z2, "rb")) |fh| {
        defer _ = fclose(fh);
        _ = fseek(fh, 0, 2);
        const file_size: usize = @intCast(ftell(fh));
        _ = fseek(fh, 0, 0);
        if (file_size > 0) {
            const raw = try allocator.alloc(u8, file_size);
            defer allocator.free(raw);
            _ = fread(raw.ptr, 1, file_size, fh);
            if (std.json.parseFromSlice(std.json.Value, allocator, raw, .{})) |pv| {
                existing_parsed = pv;
            } else |_| {}
        }
    }

    var creds_list = std.ArrayList(std.json.Value).empty;
    defer creds_list.deinit(allocator);
    if (existing_parsed) |ep| {
        if (ep.value == .array) {
            for (ep.value.array.items) |item| {
                try creds_list.append(allocator, item);
            }
        }
    }

    const inc = cred_val.object;
    const inc_domain = if (inc.get("domain")) |d| d.string else "";
    const inc_username = if (inc.get("username")) |u| u.string else "";
    const inc_profileId = if (inc.get("profileId")) |p| p.string else profileId;
    const inc_password = if (inc.get("password")) |pw| pw.string else "";

    var found = false;
    for (creds_list.items) |*item| {
        if (item.* == .object) {
            const d = if (item.object.get("domain")) |dv| dv.string else "";
            const u = if (item.object.get("username")) |uv| uv.string else "";
            const p = if (item.object.get("profileId")) |pv| pv.string else "";
            if (std.mem.eql(u8, d, inc_domain) and std.mem.eql(u8, u, inc_username) and std.mem.eql(u8, p, inc_profileId)) {
                try item.object.put(allocator, "password", std.json.Value{ .string = inc_password });
                found = true;
                break;
            }
        }
    }
    if (!found) {
        var new_entry = std.json.ObjectMap.empty;
        try new_entry.put(allocator, "profileId", std.json.Value{ .string = inc_profileId });
        try new_entry.put(allocator, "domain", std.json.Value{ .string = inc_domain });
        try new_entry.put(allocator, "username", std.json.Value{ .string = inc_username });
        try new_entry.put(allocator, "password", std.json.Value{ .string = inc_password });
        try creds_list.append(allocator, std.json.Value{ .object = new_entry });
    }

    // Manually stringify JSON list to avoid Zig std.json differences
    var out_buf = std.ArrayList(u8).empty;
    defer out_buf.deinit(allocator);
    try out_buf.appendSlice(allocator, "[\n");
    var added: usize = 0;
    for (creds_list.items) |item| {
        if (item == .object) {
            const p = if (item.object.get("profileId")) |v| v.string else "guest";
            const d = if (item.object.get("domain")) |v| v.string else "";
            const u = if (item.object.get("username")) |v| v.string else "";
            const pw = if (item.object.get("password")) |v| v.string else "";
            const comma = if (added > 0) "," else "";
            const entry_str = try std.fmt.allocPrint(allocator, "{s}{{\"profileId\":\"{s}\",\"domain\":\"{s}\",\"username\":\"{s}\",\"password\":\"{s}\"}}", .{comma, p, d, u, pw});
            defer allocator.free(entry_str);
            try out_buf.appendSlice(allocator, entry_str);
            added += 1;
        }
    }
    try out_buf.appendSlice(allocator, "\n]");

    if (fopen(cred_path_z2, "wb")) |fh2| {
        defer _ = fclose(fh2);
        _ = fwrite(out_buf.items.ptr, 1, out_buf.items.len, fh2);
    }
}

fn deleteCredentialHelper(allocator: std.mem.Allocator, cred_val: std.json.Value, profileId: []const u8) !void {
    const appdata = getEnvVar(allocator, "APPDATA");
    defer if (appdata.len > 0) allocator.free(appdata);
    const dir_path = try std.fs.path.join(allocator, &.{ appdata, "OneView" });
    defer allocator.free(dir_path);

    const cred_path = try std.fs.path.join(allocator, &.{ dir_path, "credentials.json" });
    defer allocator.free(cred_path);
    const cred_path_z2 = try allocator.dupeZ(u8, cred_path);
    defer allocator.free(cred_path_z2);

    // Read existing list
    var existing_parsed: ?std.json.Parsed(std.json.Value) = null;
    defer if (existing_parsed) |*ep| ep.deinit();
    if (fopen(cred_path_z2, "rb")) |fh| {
        defer _ = fclose(fh);
        _ = fseek(fh, 0, 2);
        const file_size: usize = @intCast(ftell(fh));
        _ = fseek(fh, 0, 0);
        if (file_size > 0) {
            const raw = try allocator.alloc(u8, file_size);
            defer allocator.free(raw);
            _ = fread(raw.ptr, 1, file_size, fh);
            if (std.json.parseFromSlice(std.json.Value, allocator, raw, .{})) |pv| {
                existing_parsed = pv;
            } else |_| {}
        }
    }

    var creds_list = std.ArrayList(std.json.Value).empty;
    defer creds_list.deinit(allocator);
    if (existing_parsed) |ep| {
        if (ep.value == .array) {
            for (ep.value.array.items) |item| {
                try creds_list.append(allocator, item);
            }
        }
    }

    const inc = cred_val.object;
    const inc_domain = if (inc.get("domain")) |d| d.string else "";
    const inc_username = if (inc.get("username")) |u| u.string else "";
    const inc_profileId = if (inc.get("profileId")) |p| p.string else profileId;

    var new_list = std.ArrayList(std.json.Value).empty;
    defer new_list.deinit(allocator);
    for (creds_list.items) |item| {
        if (item == .object) {
            const d = if (item.object.get("domain")) |dv| dv.string else "";
            const u = if (item.object.get("username")) |uv| uv.string else "";
            const p = if (item.object.get("profileId")) |pv| pv.string else "";
            if (std.mem.eql(u8, d, inc_domain) and std.mem.eql(u8, u, inc_username) and std.mem.eql(u8, p, inc_profileId)) continue;
        }
        try new_list.append(allocator, item);
    }

    // Manually stringify JSON list to avoid Zig std.json differences
    var out_buf = std.ArrayList(u8).empty;
    defer out_buf.deinit(allocator);
    try out_buf.appendSlice(allocator, "[\n");
    var added: usize = 0;
    for (new_list.items) |item| {
        if (item == .object) {
            const p = if (item.object.get("profileId")) |v| v.string else "guest";
            const d = if (item.object.get("domain")) |v| v.string else "";
            const u = if (item.object.get("username")) |v| v.string else "";
            const pw = if (item.object.get("password")) |v| v.string else "";
            const comma = if (added > 0) "," else "";
            const entry_str = try std.fmt.allocPrint(allocator, "{s}{{\"profileId\":\"{s}\",\"domain\":\"{s}\",\"username\":\"{s}\",\"password\":\"{s}\"}}", .{comma, p, d, u, pw});
            defer allocator.free(entry_str);
            try out_buf.appendSlice(allocator, entry_str);
            added += 1;
        }
    }

    try out_buf.appendSlice(allocator, "\n]");

    if (fopen(cred_path_z2, "wb")) |fh2| {
        defer _ = fclose(fh2);
        _ = fwrite(out_buf.items.ptr, 1, out_buf.items.len, fh2);
    }
}

fn onChildWebviewMessage(key_ptr: [*:0]const u8, message_ptr: [*:0]const u8) callconv(.c) void {
    const key = std.mem.span(key_ptr);
    const message = std.mem.span(message_ptr);
    std.debug.print("DEBUG: child webview message from key {s}: {s}\n", .{ key, message });
    
    const app = g_app_ptr orelse return;
    const allocator = app.allocator;
    
    var parsed = std.json.parseFromSlice(std.json.Value, allocator, message, .{}) catch {
        std.debug.print("DEBUG: failed to parse child message JSON\n", .{});
        return;
    };
    defer parsed.deinit();
    
    const root = parsed.value;
    if (root.object.get("event")) |evt| {
        if (std.mem.eql(u8, evt.string, "detached-attached")) {
            if (app.child_views.get(key)) |view| {
                const url = view.loaded_url orelse "about:blank";
                const eval_js = std.fmt.allocPrint(allocator,
                    "document.dispatchEvent(new CustomEvent('zero:detached-tab-attach-request', {{ detail: {{ url: '{s}' }} }}));",
                    .{ url }
                ) catch return;
                defer allocator.free(eval_js);
                const eval_js_z = allocator.dupeZ(u8, eval_js) catch return;
                defer allocator.free(eval_js_z);
                if (app.main_webview) |main_wv| {
                    main_wv.eval(eval_js_z) catch {};
                }
            }
            return;
        }
    }

    const request_id = if (root.object.get("requestId")) |r| r.integer else null;
    const method = if (root.object.get("method")) |m| m.string else return;
    const payload_val = root.object.get("payload") orelse return;
    
    // Now dispatch:
    if (std.mem.eql(u8, method, "tabs-create")) {
        const payload = payload_val.object;
        const url = if (payload.get("url")) |u| u.string else return;
        
        const req_id_str = if (request_id) |rid| std.fmt.allocPrint(allocator, "\"{d}\"", .{rid}) catch "null" else "null";
        defer if (request_id != null) allocator.free(req_id_str);
        
        const eval_js = std.fmt.allocPrint(allocator, "document.dispatchEvent(new CustomEvent('zero:browser-extension-command', {{ detail: {{ command: 'tabs-create', url: '{s}', active: true, requestId: {s} }} }}));", .{url, req_id_str}) catch return;
        defer allocator.free(eval_js);
        
        const eval_js_z = allocator.dupeZ(u8, eval_js) catch return;
        defer allocator.free(eval_js_z);
        
        if (app.main_webview) |main_wv| {
            main_wv.eval(eval_js_z) catch {};
        }
        
        // Resolve request
        if (request_id) |rid| {
            const child_view = app.child_views.get(key) orelse return;
            const popup_handle = child_view.cpp_handle orelse return;
            const res_js = std.fmt.allocPrint(allocator, "window._resolveWebcontentCall({d}, true, {{ success: true }});", .{rid}) catch return;
            defer allocator.free(res_js);
            const res_js_z = allocator.dupeZ(u8, res_js) catch return;
            defer allocator.free(res_js_z);
            const S = struct {
                fn cb(ctx: ?*anyopaque, success: bool, json_str: [*:0]const u8) callconv(.c) void {
                    _ = ctx; _ = success; _ = json_str;
                }
            };
            child_webview_execute_script(popup_handle, res_js_z, S.cb, null);
        }
    } else if (std.mem.eql(u8, method, "capture-active-tab")) {
        const payload = payload_val.object;
        const mode = if (payload.get("mode")) |m| m.string else "visible";
        const viewport = if (payload.get("viewport")) |v| v.string else "desktop";
        const wait = if (payload.get("wait")) |w| w.integer else 0;

        const req_id_str = if (request_id) |rid| std.fmt.allocPrint(allocator, "{d}", .{rid}) catch "0" else "0";
        defer if (request_id != null) allocator.free(req_id_str);

        const eval_js = std.fmt.allocPrint(allocator, 
            "document.dispatchEvent(new CustomEvent('zero:browser-extension-command', {{ detail: {{ command: 'capture-page', requestId: {s}, key: '{s}', options: {{ mode: '{s}', viewport: '{s}', wait: {d} }} }} }}));",
            .{ req_id_str, key, mode, viewport, wait }
        ) catch return;
        defer allocator.free(eval_js);
        const eval_js_z = allocator.dupeZ(u8, eval_js) catch return;
        defer allocator.free(eval_js_z);

        if (app.main_webview) |main_wv| {
            main_wv.eval(eval_js_z) catch {};
        }
    } else if (std.mem.eql(u8, method, "execute-script")) {
        const script = payload_val.string;
        
        var active_handle: ?*anyopaque = null;
        var it = app.child_views.iterator();
        while (it.next()) |entry| {
            if (entry.value_ptr.*.last_visible and std.mem.startsWith(u8, entry.key_ptr.*, "view:tab-")) {
                active_handle = entry.value_ptr.*.cpp_handle;
                break;
            }
        }
        if (active_handle == null) {
            var it2 = app.child_views.iterator();
            while (it2.next()) |entry| {
                if (std.mem.startsWith(u8, entry.key_ptr.*, "view:tab-")) {
                    active_handle = entry.value_ptr.*.cpp_handle;
                    break;
                }
            }
        }
        
        const active_h = active_handle orelse return;
        const script_z = allocator.dupeZ(u8, script) catch return;
        defer allocator.free(script_z);
        
        const ScriptCtx = struct {
            app: *App,
            request_id: ?i64,
            popup_key: []const u8,
        };
        const sctx = allocator.create(ScriptCtx) catch return;
        sctx.app = app;
        sctx.request_id = request_id;
        sctx.popup_key = allocator.dupe(u8, key) catch return;
        
        const S = struct {
            fn scriptCallback(ctx: ?*anyopaque, success: bool, json_str: [*:0]const u8) callconv(.c) void {
                const c = @as(*ScriptCtx, @ptrCast(@alignCast(ctx.?)));
                defer {
                    c.app.allocator.free(c.popup_key);
                    c.app.allocator.destroy(c);
                }
                
                const raw_result_json = std.mem.span(json_str);
                std.debug.print("DEBUG: execute-script finished, success={}, result={s}\n", .{ success, raw_result_json });
                
                if (c.request_id) |rid| {
                    const child_view = c.app.child_views.get(c.popup_key) orelse return;
                    const popup_handle = child_view.cpp_handle orelse return;
                    
                    const res_js = std.fmt.allocPrint(c.app.allocator, "window._resolveWebcontentCall({d}, {s}, {s});", .{
                        rid,
                        if (success) "true" else "false",
                        raw_result_json,
                    }) catch return;
                    defer c.app.allocator.free(res_js);
                    const res_js_z = c.app.allocator.dupeZ(u8, res_js) catch return;
                    defer c.app.allocator.free(res_js_z);
                    
                    const S2 = struct {
                        fn cb(ctx2: ?*anyopaque, success2: bool, json_str2: [*:0]const u8) callconv(.c) void {
                            _ = ctx2; _ = success2; _ = json_str2;
                        }
                    };
                    child_webview_execute_script(popup_handle, res_js_z, S2.cb, null);
                }
            }
        };
        
        child_webview_execute_script(active_h, script_z, S.scriptCallback, sctx);
    } else if (std.mem.eql(u8, method, "ipc:send-to-host")) {
        const payload = payload_val.object;
        const channel = if (payload.get("channel")) |c| c.string else return;
        const args = if (payload.get("args")) |a| a else return;

        const args_json = std.json.Stringify.valueAlloc(allocator, args, .{}) catch return;
        defer allocator.free(args_json);

        const eval_js = std.fmt.allocPrint(allocator,
            "window._wcEmit('{s}', 'ipc-message', {{ channel: '{s}', args: {s} }});",
            .{ key, channel, args_json }
        ) catch return;
        defer allocator.free(eval_js);

        const eval_js_z = allocator.dupeZ(u8, eval_js) catch return;
        defer allocator.free(eval_js_z);

    } else if (std.mem.eql(u8, method, "request-autofill")) {
        if (payload_val == .object) {
            if (payload_val.object.get("domain")) |domain_val| {
                if (domain_val == .string) {
                    const req_domain = domain_val.string;
                    var profileId: []const u8 = "guest";
                    var cpp_h: ?*anyopaque = null;
                    if (app.child_views.get(key)) |view| {
                        cpp_h = view.cpp_handle;
                        if (view.partition) |part| {
                            if (std.mem.indexOf(u8, part, "gsk") != null) {
                                profileId = "gsk";
                            } else if (std.mem.indexOf(u8, part, "wpp") != null) {
                                profileId = "wppproduction";
                            } else if (std.mem.indexOf(u8, part, "vml") != null) {
                                profileId = "vml";
                            } else if (std.mem.indexOf(u8, part, "guest") != null) {
                                profileId = "guest";
                            }
                        }
                    }

                    if (cpp_h) |active_h| {
                        const appdata = getEnvVar(allocator, "APPDATA");
                        defer if (appdata.len > 0) allocator.free(appdata);
                        const cred_path = std.fs.path.join(allocator, &.{ appdata, "OneView", "credentials.json" }) catch return;
                        defer allocator.free(cred_path);
                        const cred_path_z = allocator.dupeZ(u8, cred_path) catch return;
                        defer allocator.free(cred_path_z);

                        var match_user: ?[]const u8 = null;
                        var match_pass: ?[]const u8 = null;
                        var raw_content: ?[]u8 = null;
                        defer if (raw_content) |rc| allocator.free(rc);

                        if (fopen(cred_path_z, "rb")) |fh| {
                            defer _ = fclose(fh);
                            _ = fseek(fh, 0, 2);
                            const file_size: usize = @intCast(ftell(fh));
                            _ = fseek(fh, 0, 0);
                            if (file_size > 0) {
                                raw_content = allocator.alloc(u8, file_size) catch null;
                                if (raw_content) |rc| {
                                    _ = fread(rc.ptr, 1, file_size, fh);
                                    var cred_parsed = std.json.parseFromSlice(std.json.Value, allocator, rc, .{}) catch null;
                                    defer if (cred_parsed) |*p| p.deinit();

                                    if (cred_parsed) |p| {
                                        if (p.value == .array) {
                                            for (p.value.array.items) |item| {
                                                if (item == .object) {
                                                    const item_profile = if (item.object.get("profileId")) |prof| prof.string else "guest";
                                                    if (std.mem.eql(u8, item_profile, profileId)) {
                                                        const item_domain = if (item.object.get("domain")) |d| d.string else "";
                                                        
                                                        var is_match = false;
                                                        if (std.mem.eql(u8, req_domain, item_domain) or
                                                            std.mem.indexOf(u8, req_domain, item_domain) != null or
                                                            std.mem.indexOf(u8, item_domain, req_domain) != null) {
                                                            is_match = true;
                                                        } else if (std.mem.indexOf(u8, req_domain, "wpp") != null or std.mem.indexOf(u8, req_domain, "microsoftonline") != null) {
                                                            if (std.mem.indexOf(u8, item_domain, "wpp") != null or std.mem.indexOf(u8, item_domain, "microsoftonline") != null) {
                                                                is_match = true;
                                                            }
                                                        } else if (std.mem.indexOf(u8, req_domain, "veevavault.com") != null or std.mem.indexOf(u8, req_domain, "federation.gsk.com") != null) {
                                                            if (std.mem.indexOf(u8, item_domain, "veevavault.com") != null or std.mem.indexOf(u8, item_domain, "federation.gsk.com") != null) {
                                                                is_match = true;
                                                            }
                                                        }

                                                        if (is_match) {
                                                            match_user = if (item.object.get("username")) |u| u.string else "";
                                                            match_pass = if (item.object.get("password")) |pw| pw.string else "";
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (match_user != null and match_pass != null) {
                            const res_js = std.fmt.allocPrint(allocator,
                                "if (window.onAutofillReceived) window.onAutofillReceived('{s}', '{s}');",
                                .{ match_user.?, match_pass.? }
                            ) catch return;
                            defer allocator.free(res_js);
                            const res_js_z = allocator.dupeZ(u8, res_js) catch return;
                            defer allocator.free(res_js_z);
                            
                            const S = struct {
                                fn cb(ctx: ?*anyopaque, success: bool, json_str: [*:0]const u8) callconv(.c) void {
                                    _ = ctx; _ = success; _ = json_str;
                                }
                            };
                            child_webview_execute_script(active_h, res_js_z, S.cb, null);
                        }
                    }
                }
            }
        }
    } else if (std.mem.eql(u8, method, "save-credential")) {
        std.debug.print("DEBUG: [Zig] onChildWebviewMessage got save-credential method!\n", .{});
        if (payload_val == .object) {
            var profileId: []const u8 = "guest";
            if (app.child_views.get(key)) |view| {
                if (view.partition) |part| {
                    if (std.mem.indexOf(u8, part, "gsk") != null) {
                        profileId = "gsk";
                    } else if (std.mem.indexOf(u8, part, "wpp") != null) {
                        profileId = "wppproduction";
                    } else if (std.mem.indexOf(u8, part, "vml") != null) {
                        profileId = "vml";
                    } else if (std.mem.indexOf(u8, part, "guest") != null) {
                        profileId = "guest";
                    }
                }
            }
            saveCredentialHelper(allocator, payload_val, profileId) catch |err| {
                std.debug.print("DEBUG: [Zig] saveCredentialHelper failed: {}\n", .{err});
            };
            if (app.main_webview) |main_wv| {
                main_wv.eval("window.dispatchEvent(new CustomEvent('credentials-updated'));") catch {};
            }
        }
    } else if (std.mem.eql(u8, method, "delete-credential")) {
        std.debug.print("DEBUG: [Zig] onChildWebviewMessage got delete-credential method!\n", .{});
        if (payload_val == .object) {
            var profileId: []const u8 = "guest";
            if (app.child_views.get(key)) |view| {
                if (view.partition) |part| {
                    if (std.mem.indexOf(u8, part, "gsk") != null) {
                        profileId = "gsk";
                    } else if (std.mem.indexOf(u8, part, "wpp") != null) {
                        profileId = "wppproduction";
                    } else if (std.mem.indexOf(u8, part, "vml") != null) {
                        profileId = "vml";
                    } else if (std.mem.indexOf(u8, part, "guest") != null) {
                        profileId = "guest";
                    }
                }
            }
            deleteCredentialHelper(allocator, payload_val, profileId) catch |err| {
                std.debug.print("DEBUG: [Zig] deleteCredentialHelper failed: {}\n", .{err});
            };
            if (app.main_webview) |main_wv| {
                main_wv.eval("window.dispatchEvent(new CustomEvent('credentials-updated'));") catch {};
            }
        }
    } else if (std.mem.eql(u8, method, "source-changed")) {
        if (payload_val == .object) {
            if (payload_val.object.get("url")) |url_val| {
                if (url_val == .string) {
                    const url = url_val.string;
                    const can_back = if (payload_val.object.get("canGoBack")) |cb| cb.bool else false;
                    const can_forward = if (payload_val.object.get("canGoForward")) |cf| cf.bool else false;
                    const eval_js = std.fmt.allocPrint(allocator,
                        "window._wcEmit && window._wcEmit('{s}', 'did-navigate', {{ url: '{s}', canGoBack: {}, canGoForward: {} }});",
                        .{ key, url, can_back, can_forward }
                    ) catch return;
                    defer allocator.free(eval_js);
                    const eval_js_z = allocator.dupeZ(u8, eval_js) catch return;
                    defer allocator.free(eval_js_z);
                    if (app.main_webview) |main_wv| {
                        main_wv.eval(eval_js_z) catch {};
                    }
                }
            }
        }
    } else if (std.mem.eql(u8, method, "history-changed")) {
        if (payload_val == .object) {
            const url = if (payload_val.object.get("url")) |uv| uv.string else "";
            const can_back = if (payload_val.object.get("canGoBack")) |cb| cb.bool else false;
            const can_forward = if (payload_val.object.get("canGoForward")) |cf| cf.bool else false;
            const eval_js = std.fmt.allocPrint(allocator,
                "window._wcEmit && window._wcEmit('{s}', 'history-changed', {{ url: '{s}', canGoBack: {}, canGoForward: {} }});",
                .{ key, url, can_back, can_forward }
            ) catch return;
            defer allocator.free(eval_js);
            const eval_js_z = allocator.dupeZ(u8, eval_js) catch return;
            defer allocator.free(eval_js_z);
            if (app.main_webview) |main_wv| {
                main_wv.eval(eval_js_z) catch {};
            }
        }
    }
}

// ─── Entry point ──────────────────────────────────────────────────────────────

pub fn main(init: std.process.Init) !void {
    const allocator = init.gpa;

    // 1. Startup cleanup of old exe
    {
        const exe_path = getOwnExePath(allocator) orelse "";
        if (exe_path.len > 0) {
            const old_exe = std.fmt.allocPrint(allocator, "{s}.old", .{exe_path}) catch "";
            if (old_exe.len > 0) {
                const old_exe_z = allocator.dupeZ(u8, old_exe) catch null;
                if (old_exe_z) |oez| {
                    _ = native_delete_path(oez);
                    allocator.free(oez);
                }
                allocator.free(old_exe);
            }
            allocator.free(exe_path);
        }
    }

    // 2. Parse args for detached mode and handle Single Instance Mutex
    var is_detached = false;
    var detached_url: []const u8 = "";
    var detached_title: []const u8 = "Detached Window";

    {
        var args_it = std.process.Args.Iterator.initAllocator(init.minimal.args, allocator) catch |err| {
            std.debug.print("Failed to init args: {}\n", .{err});
            return;
        };
        defer args_it.deinit();
        _ = args_it.skip();
        while (args_it.next()) |arg| {
            if (std.mem.startsWith(u8, arg, "--detached=")) {
                is_detached = true;
                detached_url = try allocator.dupe(u8, arg["--detached=".len..]);
            } else if (std.mem.startsWith(u8, arg, "--title=")) {
                detached_title = try allocator.dupe(u8, arg["--title=".len..]);
            }
        }
    }

    logMsg("Startup args parsed: is_detached={}, url='{s}', title='{s}'", .{ is_detached, detached_url, detached_title });

    const kernel32_mut = struct {
        extern "kernel32" fn CreateMutexA(lpMutexAttributes: ?*anyopaque, bInitialOwner: u32, lpName: [*:0]const u8) callconv(.winapi) ?*anyopaque;
        extern "kernel32" fn GetLastError() callconv(.winapi) u32;
    };
    const ERROR_ALREADY_EXISTS: u32 = 183;
    if (!is_detached) {
        const mutex_handle = kernel32_mut.CreateMutexA(null, 1, "Local\\OneViewPortableMutex");
        if (mutex_handle != null and kernel32_mut.GetLastError() == ERROR_ALREADY_EXISTS) {
            var args_it = std.process.Args.Iterator.initAllocator(init.minimal.args, allocator) catch |err| {
                std.debug.print("Failed to init args: {}\n", .{err});
                return;
            };
            defer args_it.deinit();
            _ = args_it.skip();
            const target = args_it.next() orelse "";
            if (target.len > 0) {
                sendArgToPrimary(allocator, target);
            } else {
                sendArgToPrimary(allocator, "__SHOW__");
            }
            return;
        }
    } else {
        g_is_detached = true;
    }




    if (!is_detached) {
        // 3. Registry Setup
        setupRegistry(allocator);

        // 4. Telemetry Ping (Background thread to prevent startup block if backend is offline)
        const tel_thread = std.Thread.spawn(.{}, sendTelemetry, .{allocator}) catch null;
        if (tel_thread) |t| t.detach();

        populateStaticFilesCache(allocator) catch |err| {
            std.debug.print("WARNING: populateStaticFilesCache failed: {}\n", .{err});
        };

        var server_ctx = ServerCtx{ .allocator = allocator };
        const server_thread = try std.Thread.spawn(.{}, runServer, .{&server_ctx});
        server_thread.detach();

        Sleep(200); // Let server bind before WebView loads
    }

    if (is_detached) {
        const user32_env = struct {
            extern "kernel32" fn SetEnvironmentVariableA(lpName: [*:0]const u8, lpValue: ?[*:0]const u8) callconv(.winapi) i32;
        };
        const appdata = getEnvVar(allocator, "APPDATA");
        defer if (appdata.len > 0) allocator.free(appdata);
        if (appdata.len > 0) {
            const udf_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\Secret\\detached-udf", .{appdata}) catch "";
            defer if (udf_path.len > 0) allocator.free(udf_path);
            if (udf_path.len > 0) {
                const udf_path_z = allocator.dupeZ(u8, udf_path) catch null;
                if (udf_path_z) |upz| {
                    defer allocator.free(upz);
                    _ = user32_env.SetEnvironmentVariableA("WEBVIEW2_USER_DATA_FOLDER", upz.ptr);
                    logMsg("Set WEBVIEW2_USER_DATA_FOLDER to: {s}", .{udf_path});
                }
            }
        }
        
        // SiteSnap Studio detached window needs GPU fully disabled in this process
        // to prevent GPU read-back crashes on very large full-page captures.
        if (std.mem.indexOf(u8, detached_title, "SiteSnap Studio") != null) {
            _ = user32_env.SetEnvironmentVariableA("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--disable-gpu --disable-gpu-rasterization --max-texture-size=65536");
            logMsg("SiteSnap Studio mode detected: Disabling GPU globally in this process", .{});
        }
    }

    var app = App.init(allocator);
    g_app_ptr = &app;
    child_webview_set_message_callback(onChildWebviewMessage);
    logMsg("Initializing WebView...", .{});
    var easy = try EasyApp.init(&app, .debug);
    logMsg("WebView initialized successfully!", .{});
    app.main_webview = easy.w;
    defer {
        // Destroy active child views and free keys
        var it = app.child_views.iterator();
        while (it.next()) |entry| {
            if (entry.value_ptr.*.cpp_handle) |h| {
                child_webview_destroy(h);
            }
            if (entry.value_ptr.*.pending_url) |p_url| {
                app.allocator.free(p_url);
            }
            if (entry.value_ptr.*.loaded_url) |l_url| {
                app.allocator.free(l_url);
            }
            if (entry.value_ptr.*.partition) |part| {
                app.allocator.free(part);
            }
            app.allocator.free(entry.key_ptr.*);
        }
        app.child_views.deinit();
        easy.deinit();

        // Perform silent update hot-swap if scheduled
        if (g_silent_update_ready) {
            if (g_new_exe_path) |new_path| {
                const exe_path = getOwnExePath(allocator) orelse "";
                if (exe_path.len > 0) {
                    const old_exe = std.fmt.allocPrint(allocator, "{s}.old", .{exe_path}) catch "";
                    if (old_exe.len > 0) {
                        const old_exe_z = allocator.dupeZ(u8, old_exe) catch null;
                        const exe_path_z = allocator.dupeZ(u8, exe_path) catch null;
                        const new_path_z = allocator.dupeZ(u8, new_path) catch null;
                        if (old_exe_z != null and exe_path_z != null and new_path_z != null) {
                            const k32 = struct {
                                extern "kernel32" fn MoveFileExA(lpExistingFileName: [*:0]const u8, lpNewFileName: [*:0]const u8, dwFlags: u32) callconv(.winapi) u32;
                            };
                            _ = k32.MoveFileExA(exe_path_z.?, old_exe_z.?, 1);
                            _ = k32.MoveFileExA(new_path_z.?, exe_path_z.?, 1);
                        }
                        if (old_exe_z) |o| allocator.free(o);
                        if (exe_path_z) |e| allocator.free(e);
                        if (new_path_z) |n| allocator.free(n);
                        allocator.free(old_exe);
                    }
                    allocator.free(exe_path);
                }
                allocator.free(new_path);
            }
        }
    }

    if (is_detached) {
        const title_z = allocator.dupeZ(u8, detached_title) catch "Detached Tab";
        defer if (!std.mem.eql(u8, title_z, "Detached Tab")) allocator.free(title_z);
        try easy.setTitle(title_z);
        try easy.setSize(1320, 860, .none);
    } else {
        try easy.setTitle("OneView");
        try easy.setSize(1280, 720, .none);
    }

    // Track parent window HWND
    app.main_window_hwnd = easy.getWindow();

    // Subclass the main window to intercept close messages and handle tray clicks
    const GWLP_WNDPROC = -4;
    g_original_wndproc = @ptrFromInt(@as(usize, @bitCast(SetWindowLongPtrA(app.main_window_hwnd, GWLP_WNDPROC, @intCast(@intFromPtr(&customWndProc))))));

    // Register the cross-process theme broadcast message and store app pointer
    const user32_reg = struct {
        extern "user32" fn RegisterWindowMessageA(lpString: [*:0]const u8) callconv(.winapi) u32;
    };
    g_theme_msg = user32_reg.RegisterWindowMessageA("OneViewThemeSync_v1");
    g_app_ptr = &app;


    // Apply standard drop shadows, borders, and rounded corners via DWM attributes
    const DWMWA_WINDOW_CORNER_PREFERENCE: u32 = 33;
    const DWMWCP_ROUND: u32 = 2; // Enable rounded corners natively on Windows 11
    _ = dwmapi.DwmSetWindowAttribute(app.main_window_hwnd, DWMWA_WINDOW_CORNER_PREFERENCE, &DWMWCP_ROUND, @sizeOf(u32));

    const user32_style = struct {
        extern "user32" fn SetWindowPos(hWnd: ?*anyopaque, hWndInsertAfter: ?*anyopaque, X: c_int, Y: c_int, cx: c_int, cy: c_int, uFlags: u32) callconv(.winapi) i32;
        extern "user32" fn ShowWindow(hWnd: ?*anyopaque, nCmdShow: c_int) callconv(.winapi) i32;
    };
    // Force Windows to recalculate the frame layout using the subclassed customWndProc NCCALCSIZE handler
    _ = user32_style.SetWindowPos(app.main_window_hwnd, null, 0, 0, 0, 0, SWP_FRAMECHANGED | SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER);

    if (is_detached) {
        _ = user32_style.ShowWindow(app.main_window_hwnd, 3); // SW_SHOWMAXIMIZED = 3
    }


    // Setup system tray icon (skip for detached window)
    var nid: ?NOTIFYICONDATAA = null;
    if (!is_detached) {
        const icon_module = GetModuleHandleA(null);
        const app_icon = LoadIconA(icon_module, "IDI_ICON1");
        
        nid = NOTIFYICONDATAA{
            .hWnd = app.main_window_hwnd,
            .uID = 1,
            .uFlags = 1 | 2 | 4, // NIF_MESSAGE | NIF_ICON | NIF_TIP
            .uCallbackMessage = 0x0400 + 1, // WM_USER + 1
            .hIcon = app_icon orelse LoadIconA(null, @ptrFromInt(32512)), // fallback to standard if not found
        };
        @memcpy(nid.?.szTip[0.."OneView".len], "OneView");
        _ = Shell_NotifyIconA(0, &nid.?); // NIM_ADD
    }
    defer if (!is_detached and nid != null) {
        _ = Shell_NotifyIconA(2, &nid.?); // NIM_DELETE
    };


    // Pre-initialize the WebView2 environment on startup to make subsequent tabs open instantly
    child_webview_preinit(app.main_window_hwnd);

    // Enable double clipping style on parent window to prevent repainting child areas
    const WS_CLIPCHILDREN = 0x02000000;
    const WS_CLIPSIBLINGS = 0x04000000;
    const current_style = GetWindowLongA(app.main_window_hwnd, GWL_STYLE);
    _ = SetWindowLongA(app.main_window_hwnd, GWL_STYLE, current_style | WS_CLIPCHILDREN | WS_CLIPSIBLINGS);

    // Bind native webContentCall IPC endpoints
    try easy.bindFn("nativeWebcontentCall", nativeWebcontentCall);
    try easy.bindFn("ping", ping);

    // Inject rewriters
    try easy.addInitScript(INIT_SCRIPT);

    // Parse command line arguments on primary instance startup
    if (!is_detached) {
        var args_it = std.process.Args.Iterator.initAllocator(init.minimal.args, allocator) catch |err| {
            std.debug.print("Failed to init args: {}\n", .{err});
            return;
        };
        defer args_it.deinit();
        _ = args_it.skip();
        const arg = args_it.next() orelse "";
        if (arg.len > 0) {
            app.pending_startup_arg = allocator.dupe(u8, arg) catch null;
        }
    }

    if (!is_detached) {
        // Trigger credentials loading and auto-update (Background threads to prevent startup block)
        const login_thread = std.Thread.spawn(.{}, loginAndInjectCookies, .{&app}) catch null;
        if (login_thread) |t| t.detach();
        const update_thread = std.Thread.spawn(.{}, checkAndPerformUpdate, .{&app}) catch null;
        if (update_thread) |t| t.detach();

        // Navigate to local server landing page
        try easy.navigate("http://127.0.0.1:" ++ SERVER_PORT_STR ++ "/pages/login/index.html");
    } else {
        const url_z = allocator.dupeZ(u8, detached_url) catch "about:blank";
        defer if (!std.mem.eql(u8, url_z, "about:blank")) allocator.free(url_z);
        try easy.navigate(url_z);
    }

    // If a target was passed on startup, open it in a tab after a short delay to let WebView load
    if (!is_detached and app.pending_startup_arg != null) {
        const ArgCtx = struct {
            app: *App,
        };
        const actx = try allocator.create(ArgCtx);
        actx.app = &app;
        const arg_thread = try std.Thread.spawn(.{}, struct {
            fn run(ctx: *ArgCtx) void {
                // Wait for WebView to fully initialize
                Sleep(1200);

                if (ctx.app.pending_startup_arg) |arg| {
                    handleOpenTarget(ctx.app, arg);
                }
                ctx.app.allocator.destroy(ctx);
            }
        }.run, .{actx});
        arg_thread.detach();
    }

    try easy.run();
}

// ─── Win32 Registry & Update & Credentials Helpers ─────────────────────────────

const HKEY = ?*anyopaque;
const HKEY_CURRENT_USER: HKEY = @ptrFromInt(0x80000001);
const HKEY_LOCAL_MACHINE: HKEY = @ptrFromInt(0x80000002);
const KEY_READ: u32 = 0x20019;
const KEY_WRITE: u32 = 0x20006;
const REG_SZ: u32 = 1;
const lstatus = i32;
const ERROR_SUCCESS: lstatus = 0;

extern "advapi32" fn RegOpenKeyExA(
    hKey: HKEY,
    lpSubKey: [*:0]const u8,
    ulOptions: u32,
    samDesired: u32,
    phkResult: *HKEY
) callconv(.winapi) lstatus;

extern "advapi32" fn RegQueryValueExA(
    hKey: HKEY,
    lpValueName: ?[*:0]const u8,
    lpReserved: ?*u32,
    lpType: ?*u32,
    lpData: ?[*]u8,
    lpcbData: ?*u32
) callconv(.winapi) lstatus;

extern "advapi32" fn RegCloseKey(
    hKey: HKEY
) callconv(.winapi) lstatus;

extern "advapi32" fn RegCreateKeyExA(
    hKey: HKEY,
    lpSubKey: [*:0]const u8,
    Reserved: u32,
    lpClass: ?[*:0]const u8,
    dwOptions: u32,
    samDesired: u32,
    lpSecurityAttributes: ?*anyopaque,
    phkResult: *HKEY,
    lpdwDisposition: ?*u32
) callconv(.winapi) lstatus;

extern "advapi32" fn RegSetValueExA(
    hKey: HKEY,
    lpValueName: ?[*:0]const u8,
    Reserved: u32,
    dwType: u32,
    lpData: [*]const u8,
    cbData: u32
) callconv(.winapi) lstatus;

extern "kernel32" fn GetModuleFileNameA(hModule: ?*anyopaque, lpFilename: [*]u8, nSize: u32) callconv(.winapi) u32;
extern "advapi32" fn GetUserNameA(lpBuffer: [*]u8, lpnSize: *u32) callconv(.winapi) u32;

const DATA_BLOB = extern struct {
    cbData: u32,
    pbData: [*]u8,
};
const RECT = extern struct {
    left: i32,
    top: i32,
    right: i32,
    bottom: i32,
};
const MONITORINFO = extern struct {
    cbSize: u32,
    rcMonitor: RECT,
    rcWork: RECT,
    dwFlags: u32,
};
const MINMAXINFO = extern struct {
    ptReserved: POINT,
    ptMaxSize: POINT,
    ptMaxPosition: POINT,
    ptMinTrackSize: POINT,
    ptMaxTrackSize: POINT,
};
const MARGINS = extern struct {
    cxLeftWidth: i32,
    cxRightWidth: i32,
    cyTopHeight: i32,
    cyBottomHeight: i32,
};
const NCCALCSIZE_PARAMS = extern struct {
    rgrc: [3]RECT,
    lppos: ?*anyopaque,
};
const dwmapi = struct {
    extern "dwmapi" fn DwmExtendFrameIntoClientArea(hWnd: ?*anyopaque, pMarInset: *const MARGINS) callconv(.winapi) i32;
    extern "dwmapi" fn DwmSetWindowAttribute(hWnd: ?*anyopaque, dwAttribute: u32, pvAttribute: ?*const anyopaque, cbAttribute: u32) callconv(.winapi) i32;
};
extern "crypt32" fn CryptUnprotectData(
    pDataIn: *DATA_BLOB,
    ppszDataDescr: ?*?[*:0]u16,
    pOptionalEntropy: ?*DATA_BLOB,
    pvReserved: ?*anyopaque,
    pPromptStruct: ?*anyopaque,
    dwFlags: u32,
    pDataOut: *DATA_BLOB
) callconv(.winapi) u32;
extern "kernel32" fn LocalFree(hMem: ?*anyopaque) callconv(.winapi) ?*anyopaque;

var g_silent_update_ready = false;
var g_new_exe_path: ?[]const u8 = null;

var g_original_wndproc: ?*anyopaque = null;
var g_theme_msg: u32 = 0; // Registered cross-process theme broadcast message

fn customWndProc(hwnd: ?*anyopaque, msg: u32, wparam: usize, lparam: usize) callconv(.winapi) isize {
    const WM_CLOSE = 0x0010;
    const WM_DESTROY = 0x0002;
    const WM_USER = 0x0400;
    const WM_TRAY_CALLBACK = WM_USER + 1;
    const WM_LBUTTONDBLCLK = 0x0203;
    const WM_LBUTTONUP = 0x0202;
    const WM_RBUTTONUP = 0x0205;
    const WM_NCHITTEST = 0x0084;
    const HTCAPTION = 2;
    const SetForegroundWindowFn = struct {
        extern "user32" fn SetForegroundWindow(hWnd: ?*anyopaque) callconv(.winapi) i32;
    };

    const WM_NCCALCSIZE = 0x0083;
    const WM_GETMINMAXINFO = 0x0024;

    // Handle cross-process theme broadcast
    if (g_theme_msg != 0 and msg == g_theme_msg) {
        logMsg("customWndProc: Received theme broadcast msg={d}, wparam={d}, hwnd={?p}", .{ msg, wparam, hwnd });
        const is_dark = wparam == 1;
        const js = if (is_dark)
            "document.body.classList.add('dark-mode');try{localStorage.setItem('theme','dark');}catch(_){}"
        else
            "document.body.classList.remove('dark-mode');try{localStorage.setItem('theme','light');}catch(_){}";
        // Eval on main webview if this is the main window
        if (g_app_ptr) |app| {
            if (app.main_webview) |wv| {
                const js_z = app.allocator.dupeZ(u8, js) catch return 0;
                defer app.allocator.free(js_z);
                logMsg("customWndProc: evaling JS on main_webview...", .{});
                wv.eval(js_z) catch |err| {
                    logMsg("customWndProc: eval error: {}", .{err});
                };
            } else {
                logMsg("customWndProc: app.main_webview is null!", .{});
            }
        } else {
            logMsg("customWndProc: g_app_ptr is null!", .{});
        }
        return 0;
    }

    if (msg == WM_GETMINMAXINFO) {
        const user32_m = struct {
            extern "user32" fn MonitorFromWindow(hwnd: ?*anyopaque, dwFlags: u32) callconv(.winapi) ?*anyopaque;
            extern "user32" fn GetMonitorInfoA(hMonitor: ?*anyopaque, lpmi: *MONITORINFO) callconv(.winapi) i32;
        };
        const MONITOR_DEFAULTTONEAREST = 2;
        if (user32_m.MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST)) |hmon| {
            var mi = MONITORINFO{
                .cbSize = @sizeOf(MONITORINFO),
                .rcMonitor = undefined,
                .rcWork = undefined,
                .dwFlags = 0,
            };
            if (user32_m.GetMonitorInfoA(hmon, &mi) != 0) {
                const mmi: *MINMAXINFO = @ptrFromInt(lparam);
                mmi.ptMaxSize.x = mi.rcWork.right - mi.rcWork.left;
                mmi.ptMaxSize.y = mi.rcWork.bottom - mi.rcWork.top;
                mmi.ptMaxPosition.x = mi.rcWork.left;
                mmi.ptMaxPosition.y = mi.rcWork.top;
            }
        }
        return 0;
    }

    const WM_NCLBUTTONDBLCLK = 0x00A3;
    if (msg == WM_NCLBUTTONDBLCLK) {
        if (wparam == HTCAPTION) {
            const user32_op = struct {
                extern "user32" fn IsZoomed(hWnd: ?*anyopaque) callconv(.winapi) i32;
                extern "user32" fn ShowWindow(hWnd: ?*anyopaque, nCmdShow: c_int) callconv(.winapi) i32;
            };
            const is_maximized = user32_op.IsZoomed(hwnd) != 0;
            const cmd = if (is_maximized) @as(c_int, 9) else @as(c_int, 3); // SW_RESTORE = 9, SW_MAXIMIZE = 3
            _ = user32_op.ShowWindow(hwnd, cmd);
            return 0;
        }
    }

    if (msg == WM_NCCALCSIZE) {
        _ = CallWindowProcA(g_original_wndproc.?, hwnd, msg, wparam, lparam);
        if (wparam != 0) {
            const params: *NCCALCSIZE_PARAMS = @ptrFromInt(lparam);
            const user32_z = struct {
                extern "user32" fn IsZoomed(hWnd: ?*anyopaque) callconv(.winapi) i32;
            };
            if (user32_z.IsZoomed(hwnd) != 0) {
                const user32_m = struct {
                    extern "user32" fn MonitorFromWindow(hwnd: ?*anyopaque, dwFlags: u32) callconv(.winapi) ?*anyopaque;
                    extern "user32" fn GetMonitorInfoA(hMonitor: ?*anyopaque, lpmi: *MONITORINFO) callconv(.winapi) i32;
                };
                const MONITOR_DEFAULTTONEAREST = 2;
                if (user32_m.MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST)) |hmon| {
                    var mi = MONITORINFO{
                        .cbSize = @sizeOf(MONITORINFO),
                        .rcMonitor = undefined,
                        .rcWork = undefined,
                        .dwFlags = 0,
                    };
                    if (user32_m.GetMonitorInfoA(hmon, &mi) != 0) {
                        params.rgrc[0].top = mi.rcWork.top;
                        params.rgrc[0].left = mi.rcWork.left;
                        params.rgrc[0].right = mi.rcWork.right;
                        params.rgrc[0].bottom = mi.rcWork.bottom;
                    }
                }
            } else {
                const SM_CYCAPTION = 4;
                const SM_CYFRAME = 33;
                const SM_CXPADDINGS = 92;
                const user32_sys = struct {
                    extern "user32" fn GetSystemMetrics(nIndex: c_int) callconv(.winapi) c_int;
                };
                const caption_height = user32_sys.GetSystemMetrics(SM_CYCAPTION);
                const frame_height = user32_sys.GetSystemMetrics(SM_CYFRAME);
                const padding = user32_sys.GetSystemMetrics(SM_CXPADDINGS);
                // Subtract top caption only so client area stretches up, leaving native borders intact
                params.rgrc[0].top -= caption_height + frame_height + padding;
            }
        }
        return 0;
    }

    if (msg == WM_NCHITTEST) {
        const hit = CallWindowProcA(g_original_wndproc.?, hwnd, msg, wparam, lparam);

        const HTLEFT = 10;
        const HTRIGHT = 11;
        const HTTOP = 12;
        const HTTOPLEFT = 13;
        const HTTOPRIGHT = 14;
        const HTBOTTOM = 15;
        const HTBOTTOMLEFT = 16;
        const HTBOTTOMRIGHT = 17;

        if (hit == HTLEFT or hit == HTRIGHT or hit == HTTOP or hit == HTTOPLEFT or hit == HTTOPRIGHT or 
            hit == HTBOTTOM or hit == HTBOTTOMLEFT or hit == HTBOTTOMRIGHT) {
            return hit;
        }

        const user32_hit = struct {
            extern "user32" fn ScreenToClient(hWnd: ?*anyopaque, lpPoint: *POINT) callconv(.winapi) i32;
            extern "user32" fn GetClientRect(hWnd: ?*anyopaque, lpRect: *RECT) callconv(.winapi) i32;
            extern "user32" fn IsZoomed(hWnd: ?*anyopaque) callconv(.winapi) i32;
        };
        var pt = POINT{ .x = @intCast(lparam & 0xFFFF), .y = @intCast((lparam >> 16) & 0xFFFF) };
        _ = user32_hit.ScreenToClient(hwnd, &pt);
        var r: RECT = undefined;
        _ = user32_hit.GetClientRect(hwnd, &r);
        
        const is_maximized = user32_hit.IsZoomed(hwnd) != 0;

        // If windowed, manual top-edge resize check (compensates for top NCCALCSIZE shift)
        if (!is_maximized and pt.y >= -8 and pt.y < 5) {
            return 12; // HTTOP = 12
        }

        // For the custom title bar area (5 to 42 pixels)
        // Keep tabs (0-320px) and controls on the right (width-180px to width) clickable.
        // Dragging acts on the background space between tabs and buttons.
        if (pt.y >= 5 and pt.y < 42) {
            if (pt.x >= 320 and pt.x < (r.right - 180)) {
                return 2; // HTCAPTION = 2
            }
        }
        return hit;
    }

    if (msg == WM_CLOSE) {
        if (g_is_detached) {
            const user32_dest = struct {
                extern "user32" fn DestroyWindow(hWnd: ?*anyopaque) callconv(.winapi) i32;
            };
            _ = ShowWindow(hwnd, SW_HIDE);
            _ = user32_dest.DestroyWindow(hwnd);
            return 0;
        }
        // Hide to tray instead of closing
        _ = ShowWindow(hwnd, SW_HIDE);
        return 0;
    }

    if (msg == WM_TRAY_CALLBACK) {
        if (lparam == WM_LBUTTONDBLCLK or lparam == WM_LBUTTONUP) {
            // Left click / double click -> restore window
            _ = ShowWindow(hwnd, SW_SHOW);
            _ = SetForegroundWindowFn.SetForegroundWindow(hwnd);
            
            // Navigate back to login screen on restore
            if (g_app_ptr) |app| {
                if (app.main_webview) |main_wv| {
                    main_wv.navigate("http://127.0.0.1:" ++ SERVER_PORT_STR ++ "/pages/login/index.html") catch {};
                }
            }
            return 0;
        }
        if (lparam == WM_RBUTTONUP) {
            // Right click -> show context menu
            _ = SetForegroundWindowFn.SetForegroundWindow(hwnd);
            const hmenu = CreatePopupMenu();
            _ = AppendMenuA(hmenu, MF_STRING, TRAY_MENU_OPEN, "Open OneView");
            _ = AppendMenuA(hmenu, MF_SEPARATOR, 0, null);
            _ = AppendMenuA(hmenu, MF_STRING, TRAY_MENU_QUIT, "Quit");
            var pt = POINT{ .x = 0, .y = 0 };

            _ = GetCursorPos(&pt);
            _ = TrackPopupMenu(hmenu, TPM_RIGHTBUTTON | TPM_BOTTOMALIGN, pt.x, pt.y, 0, hwnd, null);
            _ = DestroyMenu(hmenu);
            return 0;
        }
    }

    if (msg == WM_COMMAND) {
        const cmd_id = wparam & 0xFFFF;
        if (cmd_id == TRAY_MENU_OPEN) {
            _ = ShowWindow(hwnd, SW_SHOW);
            _ = SetForegroundWindowFn.SetForegroundWindow(hwnd);
            
            // Navigate back to login screen on restore
            if (g_app_ptr) |app| {
                if (app.main_webview) |main_wv| {
                    main_wv.navigate("http://127.0.0.1:" ++ SERVER_PORT_STR ++ "/pages/login/index.html") catch {};
                }
            }
            return 0;
        }
        if (cmd_id == TRAY_MENU_QUIT) {
            // Post WM_DESTROY to fully exit
            _ = PostMessageA(hwnd, WM_DESTROY, 0, 0);
            return 0;
        }
    }

    return CallWindowProcA(g_original_wndproc, hwnd, msg, wparam, lparam);
}

fn getOwnExePath(allocator: std.mem.Allocator) ?[]const u8 {
    var buf: [1024]u8 = undefined;
    const len = GetModuleFileNameA(null, &buf, buf.len);
    if (len == 0) return null;
    return allocator.dupe(u8, buf[0..len]) catch null;
}

fn getSystemUsername(allocator: std.mem.Allocator) ?[]const u8 {
    var buf: [256]u8 = undefined;
    var len: u32 = buf.len;
    if (GetUserNameA(&buf, &len) == 0) return null;
    return allocator.dupe(u8, buf[0..len]) catch null;
}

fn setRegKeyString(allocator: std.mem.Allocator, hkey: HKEY, subkey: [*:0]const u8, value_name: ?[*:0]const u8, value: []const u8) bool {
    var hk: HKEY = null;
    if (RegCreateKeyExA(hkey, subkey, 0, null, 0, KEY_WRITE, null, &hk, null) != ERROR_SUCCESS) {
        return false;
    }
    defer _ = RegCloseKey(hk);
    const value_z = allocator.dupeZ(u8, value) catch return false;
    defer allocator.free(value_z);
    if (RegSetValueExA(hk, value_name, 0, REG_SZ, value_z.ptr, @intCast(value.len + 1)) != ERROR_SUCCESS) {
        return false;
    }
    return true;
}

fn setupRegistry(allocator: std.mem.Allocator) void {
    const exe_path = getOwnExePath(allocator) orelse return;
    defer allocator.free(exe_path);

    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\OneView\\Capabilities", "ApplicationName", "OneView");
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\OneView\\Capabilities", "ApplicationDescription", "OneView Browser and PDF Viewer");
    
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\OneView\\Capabilities\\FileAssociations", ".pdf", "OneView.Assoc");
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\OneView\\Capabilities\\FileAssociations", ".html", "OneView.Assoc");
    
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\OneView\\Capabilities\\URLAssociations", "http", "OneView.Assoc");
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\OneView\\Capabilities\\URLAssociations", "https", "OneView.Assoc");

    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\Classes\\OneView.Assoc", null, "OneView Document");
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\Classes\\OneView.Assoc", "FriendlyAppName", "OneView");
    
    const cmd = std.fmt.allocPrint(allocator, "\"{s}\" \"%1\"", .{exe_path}) catch return;
    defer allocator.free(cmd);
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\Classes\\OneView.Assoc\\shell\\open\\command", null, cmd);

    // Register Applications entry for taskbar/Open With display name
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\Classes\\Applications\\oneview.exe", "FriendlyAppName", "OneView");
    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\Classes\\Applications\\oneview.exe\\shell\\open\\command", null, cmd);

    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\RegisteredApplications", "OneView", "Software\\OneView\\Capabilities");

    _ = setRegKeyString(allocator, HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Run", "OneView", exe_path);
}


fn sendArgToPrimary(allocator: std.mem.Allocator, target: []const u8) void {
    var wsdata: WSADATA = undefined;
    _ = WSAStartup(0x0202, &wsdata);
    defer _ = WSACleanup();

    const client = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (client == INVALID_SOCKET) return;
    defer _ = closesocket(client);

    var addr = SOCKADDR_IN{
        .sin_family = AF_INET,
        .sin_port = htons(SERVER_PORT),
        .sin_addr = htonl(0x7F000001),
        .sin_zero = [_]u8{0} ** 8,
    };
    if (connect(client, &addr, @sizeOf(SOCKADDR_IN)) == SOCKET_ERROR) return;

    var req_body_map = std.json.ObjectMap.empty;
    defer req_body_map.deinit(allocator);
    req_body_map.put(allocator, "target", std.json.Value{ .string = target }) catch return;
    const body_str = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .object = req_body_map }, .{}) catch return;
    defer allocator.free(body_str);




    const http_req = std.fmt.allocPrint(allocator,
        "POST /api/open-target HTTP/1.0\r\nHost: 127.0.0.1:{d}\r\nContent-Length: {d}\r\nContent-Type: application/json\r\n\r\n{s}",
        .{ SERVER_PORT, body_str.len, body_str }
    ) catch return;
    defer allocator.free(http_req);

    _ = send(client, http_req.ptr, @intCast(http_req.len), 0);
}

fn fileExists(path_z: [*:0]const u8) bool {
    if (fopen(path_z, "rb")) |f| {
        _ = fclose(f);
        return true;
    }
    return false;
}

fn queryUninstallPath(allocator: std.mem.Allocator, hkey: HKEY, subkey: [*:0]const u8) ?[]const u8 {
    var hk: HKEY = null;
    if (RegOpenKeyExA(hkey, subkey, 0, KEY_READ, &hk) == ERROR_SUCCESS) {
        defer _ = RegCloseKey(hk);
        var len: u32 = 512;
        var buf = allocator.alloc(u8, len) catch return null;
        errdefer allocator.free(buf);
        if (RegQueryValueExA(hk, "InstallLocation", null, null, buf.ptr, &len) == ERROR_SUCCESS) {
            const actual_len = std.mem.indexOfScalar(u8, buf[0..len], 0) orelse len;
            const dir = buf[0..actual_len];
            const exe_path = std.fs.path.join(allocator, &.{ dir, "empower-pdf.exe" }) catch return null;
            const exe_path_z = allocator.dupeZ(u8, exe_path) catch return null;
            defer allocator.free(exe_path_z);
            if (fileExists(exe_path_z)) {
                return exe_path;
            }
            allocator.free(exe_path);
        }
    }
    return null;
}

fn findEMpowerPDF(allocator: std.mem.Allocator) ?[]const u8 {
    // 1. Check local AppData secret folder
    const appdata = getEnvVar(allocator, "APPDATA");
    defer if (appdata.len > 0) allocator.free(appdata);
    if (appdata.len > 0) {
        const secret_path = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\Secret\\apps\\empower-pdf.exe", .{appdata}) catch null;
        if (secret_path) |sp| {
            defer allocator.free(sp);
            const sp_z = allocator.dupeZ(u8, sp) catch null;
            if (sp_z) |spz| {
                defer allocator.free(spz);
                if (fileExists(spz)) {
                    return allocator.dupe(u8, sp) catch null;
                }
            }
        }
    }

    // 2. Check registry uninstall paths
    const hkcu_paths = [_][*:0]const u8{
        "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\empower-pdf",
        "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\EMpower",
    };
    for (hkcu_paths) |path| {
        if (queryUninstallPath(allocator, HKEY_CURRENT_USER, path)) |p| return p;
    }

    const hklm_paths = [_][*:0]const u8{
        "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\empower-pdf",
        "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\EMpower",
        "Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\empower-pdf",
        "Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\EMpower",
    };
    for (hklm_paths) |path| {
        if (queryUninstallPath(allocator, HKEY_LOCAL_MACHINE, path)) |p| return p;
    }

    return null;
}

fn handleOpenTarget(app: *App, target: []const u8) void {
    const allocator = app.allocator;

    const kernel32 = struct {
        extern "user32" fn SetForegroundWindow(hWnd: ?*anyopaque) callconv(.winapi) u32;
        extern "user32" fn ShowWindow(hWnd: ?*anyopaque, nCmdShow: c_int) callconv(.winapi) u32;
    };
    if (app.main_window_hwnd) |hwnd| {
        // Always show - window may be hidden to tray (not just minimized)
        _ = kernel32.ShowWindow(hwnd, SW_SHOW);
        _ = kernel32.SetForegroundWindow(hwnd);
    }

    // __SHOW__ is a special signal to just bring the window to front and reset to login
    if (std.mem.eql(u8, target, "__SHOW__")) {
        if (app.main_webview) |main_wv| {
            main_wv.navigate("http://127.0.0.1:" ++ SERVER_PORT_STR ++ "/pages/login/index.html") catch {};
        }
        return;
    }


    const is_pdf = std.mem.endsWith(u8, target, ".pdf") or (target.len >= 4 and std.ascii.eqlIgnoreCase(target[target.len - 4..], ".pdf"));
    var opened_pdf_externally = false;
    if (is_pdf) {
        if (findEMpowerPDF(allocator)) |empower_path| {
            defer allocator.free(empower_path);
            const cmd = std.fmt.allocPrint(allocator, "\"{s}\" \"{s}\"", .{ empower_path, target }) catch null;
            if (cmd) |c| {
                defer allocator.free(c);
                var si = STARTUPINFOA{};
                var pi = PROCESS_INFORMATION{};
                const c_z = allocator.dupeZ(u8, c) catch null;
                if (c_z) |cz| {
                    defer allocator.free(cz);
                    if (CreateProcessA(null, cz.ptr, null, null, 0, 0, null, null, &si, &pi) != 0) {
                        _ = CloseHandle(pi.hProcess);
                        _ = CloseHandle(pi.hThread);
                        opened_pdf_externally = true;
                    }
                }
            }
        }
    }

    if (!opened_pdf_externally) {
        if (app.main_webview) |main_wv| {
            // Convert to file:// protocol if it is a local path
            var url_buf: [2048]u8 = undefined;
            var url: []const u8 = target;
            if (std.mem.indexOf(u8, target, ":\\") != null or std.mem.indexOf(u8, target, ":/") != null or (target.len > 0 and target[0] == '\\')) {
                var temp_buf: [2048]u8 = undefined;
                @memcpy(temp_buf[0..target.len], target);
                for (temp_buf[0..target.len]) |*c| {
                    if (c.* == '\\') c.* = '/';
                }
                url = std.fmt.bufPrint(&url_buf, "file:///{s}", .{temp_buf[0..target.len]}) catch target;
            }

            const eval_js = std.fmt.allocPrint(allocator,
                \\document.dispatchEvent(new CustomEvent('zero:browser-extension-command', {{ detail: {{ command: 'tabs-create', url: '{s}', active: true }} }}));
                , .{url}) catch return;
            defer allocator.free(eval_js);
            const eval_js_z = allocator.dupeZ(u8, eval_js) catch return;
            defer allocator.free(eval_js_z);
            main_wv.eval(eval_js_z) catch {};
        }
    }
}


fn readJsonFile(allocator: std.mem.Allocator, path: []const u8) ?[]const u8 {
    const path_z = allocator.dupeZ(u8, path) catch return null;
    defer allocator.free(path_z);
    const f = fopen(path_z, "rb") orelse return null;
    defer _ = fclose(f);
    _ = fseek(f, 0, 2);
    const size = ftell(f);
    if (size <= 0) return null;
    _ = fseek(f, 0, 0);
    const buf = allocator.alloc(u8, @intCast(size)) catch return null;
    _ = fread(buf.ptr, 1, @intCast(size), f);
    return buf;
}

fn postJsonToBackend(allocator: std.mem.Allocator, host: []const u8, port: u16, path: []const u8, json_body: []const u8) ?[]const u8 {
    const backend_sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (backend_sock == INVALID_SOCKET) return null;
    defer _ = closesocket(backend_sock);

    const host_z = allocator.dupeZ(u8, host) catch return null;
    defer allocator.free(host_z);


    var addr = SOCKADDR_IN{
        .sin_family = AF_INET,
        .sin_port = htons(port),
        .sin_addr = inet_addr(host_z.ptr),
        .sin_zero = [_]u8{0} ** 8,
    };
    if (connect(backend_sock, &addr, @sizeOf(SOCKADDR_IN)) == SOCKET_ERROR) return null;

    const request = std.fmt.allocPrint(allocator,
        "POST {s} HTTP/1.0\r\n" ++
        "Host: {s}:{d}\r\n" ++
        "Content-Type: application/json\r\n" ++
        "Content-Length: {d}\r\n" ++
        "Connection: close\r\n\r\n{s}",
        .{ path, host, port, json_body.len, json_body }
    ) catch return null;
    defer allocator.free(request);

    _ = send(backend_sock, request.ptr, @intCast(request.len), 0);

    var resp_buf = std.ArrayList(u8).empty;
    defer resp_buf.deinit(allocator);

    var chunk: [4096]u8 = undefined;
    while (true) {
        const n = recv(backend_sock, &chunk, @intCast(chunk.len), 0);
        if (n <= 0) break;
        resp_buf.appendSlice(allocator, chunk[0..@intCast(n)]) catch break;
    }
    if (resp_buf.items.len == 0) return null;
    return resp_buf.toOwnedSlice(allocator) catch null;

}

fn httpGetWinINet(allocator: std.mem.Allocator, url: []const u8) ?[]const u8 {
    const HINTERNET = *anyopaque;
    const WinINet = struct {
        extern "wininet" fn InternetOpenA(lpszAgent: ?[*:0]const u8, dwAccessType: u32, lpszProxyName: ?[*:0]const u8, lpszProxyBypass: ?[*:0]const u8, dwFlags: u32) callconv(.winapi) ?HINTERNET;
        extern "wininet" fn InternetOpenUrlA(hInternet: HINTERNET, lpszUrl: [*:0]const u8, lpszHeaders: ?[*:0]const u8, dwHeadersLength: u32, dwFlags: u32, dwContext: usize) callconv(.winapi) ?HINTERNET;
        extern "wininet" fn InternetReadFile(hFile: HINTERNET, lpBuffer: [*]u8, dwNumberOfBytesToRead: u32, lpdwNumberOfBytesRead: *u32) callconv(.winapi) u32;
        extern "wininet" fn InternetCloseHandle(hInternet: HINTERNET) callconv(.winapi) u32;
    };
    const url_z = allocator.dupeZ(u8, url) catch return null;
    defer allocator.free(url_z);
    const io = WinINet.InternetOpenA("Mozilla/5.0", 1, null, null, 0) orelse return null;
    defer _ = WinINet.InternetCloseHandle(io);
    const connection = WinINet.InternetOpenUrlA(io, url_z, null, 0, 0x00800000 | 0x80000000, 0) orelse return null;
    defer _ = WinINet.InternetCloseHandle(connection);

    var content = std.ArrayList(u8).empty;
    defer content.deinit(allocator);

    var buffer: [4096]u8 = undefined;
    while (true) {
        var read: u32 = 0;
        if (WinINet.InternetReadFile(connection, &buffer, @intCast(buffer.len), &read) == 0) break;
        if (read == 0) break;
        content.appendSlice(allocator, buffer[0..read]) catch break;
    }
    return content.toOwnedSlice(allocator) catch null;

}

fn loginAndInjectCookies(app: *App) void {
    const allocator = app.allocator;
    const userprofile = getEnvVar(allocator, "USERPROFILE");
    defer if (userprofile.len > 0) allocator.free(userprofile);
    const credentials_path = std.fs.path.join(allocator, &.{ userprofile, ".oneview-credentials.json" }) catch return;
    defer allocator.free(credentials_path);

    const json_data = readJsonFile(allocator, credentials_path) orelse return;
    defer allocator.free(json_data);
    var parsed = std.json.parseFromSlice(std.json.Value, allocator, json_data, .{}) catch return;
    defer parsed.deinit();
    
    const obj = parsed.value.object;
    const username = if (obj.get("username")) |u| u.string else return;
    const password_val = obj.get("password") orelse return;

    var password: []const u8 = "";
    var password_allocated = false;
    if (password_val == .string) {
        password = password_val.string;
    } else if (password_val == .object) {
        const enc_hex = if (password_val.object.get("encrypted")) |e| e.string else "";
        if (enc_hex.len > 0) {
            var bytes = allocator.alloc(u8, enc_hex.len / 2) catch return;
            defer allocator.free(bytes);
            var i: usize = 0;
            while (i < bytes.len) : (i += 1) {
                bytes[i] = std.fmt.parseInt(u8, enc_hex[i*2 .. i*2 + 2], 16) catch 0;
            }
            var data_in = DATA_BLOB{ .cbData = @intCast(bytes.len), .pbData = bytes.ptr };
            var data_out = DATA_BLOB{ .cbData = 0, .pbData = undefined };
            if (CryptUnprotectData(&data_in, null, null, null, null, 0, &data_out) != 0) {
                const dec_pwd = data_out.pbData[0..data_out.cbData];
                password = allocator.dupe(u8, dec_pwd) catch "";
                password_allocated = true;
                _ = LocalFree(data_out.pbData);
            }
        }
    }
    defer if (password_allocated) allocator.free(password);
    if (password.len == 0) return;

    var login_body_map = std.json.ObjectMap.empty;
    defer login_body_map.deinit(allocator);
    login_body_map.put(allocator, "username", std.json.Value{ .string = username }) catch return;
    login_body_map.put(allocator, "password", std.json.Value{ .string = password }) catch return;
    const login_body = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .object = login_body_map }, .{}) catch return;
    defer allocator.free(login_body);




    const response = postJsonToBackend(allocator, "10.215.56.196", 8009, "/auth/login", login_body) orelse return;
    defer allocator.free(response);

    const body_idx = std.mem.indexOf(u8, response, "\r\n\r\n") orelse response.len;
    const resp_body = if (body_idx + 4 < response.len) response[body_idx + 4 ..] else "";
    
    var parsed_resp = std.json.parseFromSlice(std.json.Value, allocator, resp_body, .{}) catch null;
    defer if (parsed_resp) |*p| p.deinit();
    
    var token: []const u8 = "";
    if (parsed_resp) |p| {
        if (p.value == .object) {
            if (p.value.object.get("token")) |t| {
                token = t.string;
            } else if (p.value.object.get("sessionToken")) |t| {
                token = t.string;
            }
        }
    }

    var set_cookies = std.ArrayList([]const u8).empty;
    defer {
        for (set_cookies.items) |c| allocator.free(c);
        set_cookies.deinit(allocator);
    }

    var lines = std.mem.splitSequence(u8, response[0..body_idx], "\r\n");
    while (lines.next()) |line| {
        if (startsWithCI(line, "set-cookie:")) {
            const cookie_val = std.mem.trim(u8, line["set-cookie:".len..], " \t");
            set_cookies.append(allocator, allocator.dupe(u8, cookie_val) catch continue) catch {};
        }
    }


    if (app.main_webview) |main_wv| {
        var js_code = std.ArrayList(u8).empty;
        defer js_code.deinit(allocator);

        for (set_cookies.items) |cookie| {
            js_code.print(allocator, "document.cookie = '{s}';\n", .{cookie}) catch {};
        }
        if (token.len > 0) {
            js_code.print(allocator, "localStorage.setItem('token', '{s}');\n", .{token}) catch {};
        }
        if (js_code.items.len > 0) {
            const js_z = allocator.dupeZ(u8, js_code.items) catch return;
            defer allocator.free(js_z);
            main_wv.eval(js_z) catch {};
        }
    }


}

fn checkAndPerformUpdate(app: *App) void {
    const allocator = app.allocator;
    const policy_raw = httpGetWinINet(allocator, "https://raw.githubusercontent.com/dikshantgoel-WPP/automation-store/refs/heads/main/update.json") orelse return;
    defer allocator.free(policy_raw);

    var parsed = std.json.parseFromSlice(std.json.Value, allocator, policy_raw, .{}) catch return;
    defer parsed.deinit();

    const obj = parsed.value.object;
    const version = if (obj.get("version")) |v| v.string else return;
    const forceUpdate = if (obj.get("forceUpdate")) |f| f.bool else false;
    const download_url = if (obj.get("url")) |u| u.string else return;

    if (std.mem.eql(u8, version, "1.2.7")) {
        return;
    }

    if (forceUpdate) {
        if (app.main_webview) |main_wv| {
            main_wv.eval("alert('A critical update is being installed. The application will restart.');") catch {};
        }
        performHotSwap(allocator, download_url);
    } else {
        performSilentUpdate(allocator, download_url);
    }
}

fn performHotSwap(allocator: std.mem.Allocator, download_url: []const u8) void {
    const exe_path = getOwnExePath(allocator) orelse return;
    defer allocator.free(exe_path);
    const old_exe = std.fmt.allocPrint(allocator, "{s}.old", .{exe_path}) catch return;
    defer allocator.free(old_exe);

    const appdata = getEnvVar(allocator, "APPDATA");
    defer if (appdata.len > 0) allocator.free(appdata);
    const temp_exe = std.fmt.allocPrint(allocator, "{s}\\OneView Dev\\oneview_new.exe", .{appdata}) catch return;
    defer allocator.free(temp_exe);

    const temp_exe_z = allocator.dupeZ(u8, temp_exe) catch return;
    defer allocator.free(temp_exe_z);

    const download_url_z = allocator.dupeZ(u8, download_url) catch return;
    defer allocator.free(download_url_z);

    if (native_download_file(download_url_z, temp_exe_z) != 0) {
        return;
    }

    const old_exe_z = allocator.dupeZ(u8, old_exe) catch return;
    defer allocator.free(old_exe_z);
    const exe_path_z = allocator.dupeZ(u8, exe_path) catch return;
    defer allocator.free(exe_path_z);

    const kernel32 = struct {
        extern "kernel32" fn MoveFileExA(lpExistingFileName: [*:0]const u8, lpNewFileName: [*:0]const u8, dwFlags: u32) callconv(.winapi) u32;
    };
    _ = kernel32.MoveFileExA(exe_path_z, old_exe_z, 1);
    _ = kernel32.MoveFileExA(temp_exe_z, exe_path_z, 1);

    var si = STARTUPINFOA{};
    var pi = PROCESS_INFORMATION{};
    if (CreateProcessA(null, exe_path_z.ptr, null, null, 0, 0, null, null, &si, &pi) != 0) {
        _ = CloseHandle(pi.hProcess);
        _ = CloseHandle(pi.hThread);
        std.process.exit(0);
    }
}

fn performSilentUpdate(allocator: std.mem.Allocator, download_url: []const u8) void {
    const thread = std.Thread.spawn(.{}, struct {
        fn run(alloc: std.mem.Allocator, url: []const u8) void {
            const exe_path = getOwnExePath(alloc) orelse return;
            defer alloc.free(exe_path);
            const appdata = getEnvVar(alloc, "APPDATA");
            defer if (appdata.len > 0) alloc.free(appdata);
            const temp_exe = std.fmt.allocPrint(alloc, "{s}\\OneView Dev\\oneview_new.exe", .{appdata}) catch return;
            const temp_exe_z = alloc.dupeZ(u8, temp_exe) catch return;
            defer alloc.free(temp_exe_z);
            const url_z = alloc.dupeZ(u8, url) catch return;
            defer alloc.free(url_z);

            if (native_download_file(url_z, temp_exe_z) == 0) {
                g_silent_update_ready = true;
                g_new_exe_path = temp_exe;
            } else {
                alloc.free(temp_exe);
            }
        }
    }.run, .{ allocator, download_url }) catch {
        return;
    };
    thread.detach();
}


fn sendTelemetry(allocator: std.mem.Allocator) void {
    const username = getSystemUsername(allocator) orelse "Unknown";
    defer if (!std.mem.eql(u8, username, "Unknown")) allocator.free(username);
    
    var body_map = std.json.ObjectMap.empty;
    defer body_map.deinit(allocator);
    body_map.put(allocator, "username", std.json.Value{ .string = username }) catch return;
    body_map.put(allocator, "version", std.json.Value{ .string = "1.2.7" }) catch return;
    const body_str = std.json.Stringify.valueAlloc(allocator, std.json.Value{ .object = body_map }, .{}) catch return;
    defer allocator.free(body_str);




    const resp = postJsonToBackend(allocator, "10.215.56.196", 8009, "/auth/version-report", body_str);
    if (resp) |r| allocator.free(r);
}

