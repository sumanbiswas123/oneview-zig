#include <windows.h>
#include <stdlib.h>
#include <string>
#include <wininet.h>
#include <shlobj.h>
#include <shlwapi.h>
#include <shobjidl.h>
#include <objbase.h>
#include <comdef.h>
#include "WebView2.h"

#pragma comment(lib, "wininet.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "ole32.lib")

// ── Global Download Progress Tracking ──────────────────────────────────────────
static double g_download_progress = 0.0;
static DWORD g_download_received = 0;
static DWORD g_download_total = 0;
static char g_download_target_path[MAX_PATH] = "";

extern "C" void get_native_download_progress(double* progress, DWORD* received, DWORD* total, char* target_path, int max_len) {
    *progress = g_download_progress;
    *received = g_download_received;
    *total = g_download_total;
    strncpy_s(target_path, max_len, g_download_target_path, max_len - 1);
}

// ── Native download via WinINet ────────────────────────────────────────────────
extern "C" int native_download_file(const char* url, const char* target_path) {
    g_download_progress = 0.0;
    g_download_received = 0;
    g_download_total = 0;
    strncpy_s(g_download_target_path, MAX_PATH, target_path, MAX_PATH - 1);

    // Normalize forward slashes to backslashes for Windows API path functions
    char win_target_path[MAX_PATH];
    strncpy_s(win_target_path, MAX_PATH, target_path, MAX_PATH - 1);
    for (int i = 0; win_target_path[i] != '\0'; i++) {
        if (win_target_path[i] == '/') win_target_path[i] = '\\';
    }

    // Ensure parent directory exists
    char dir[MAX_PATH];
    strncpy_s(dir, win_target_path, MAX_PATH - 1);
    PathRemoveFileSpecA(dir);
    SHCreateDirectoryExA(nullptr, dir, nullptr);

    HINTERNET hInet = InternetOpenA("OneView/1.0", INTERNET_OPEN_TYPE_PRECONFIG, nullptr, nullptr, 0);
    if (!hInet) return -1;

    DWORD flags = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE;
    if (_strnicmp(url, "https://", 8) == 0) {
        flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
    }

    HINTERNET hUrl = InternetOpenUrlA(hInet, url, nullptr, 0, flags, 0);
    if (!hUrl) { 
        DWORD err = GetLastError();
        printf("[native_download_file] InternetOpenUrlA failed for url: %s, error code: %lu\n", url, err);
        InternetCloseHandle(hInet); 
        return -2; 
    }

    // Check HTTP status code
    DWORD statusCode = 0;
    DWORD statusCodeSize = sizeof(statusCode);
    if (HttpQueryInfoA(hUrl, HTTP_QUERY_STATUS_CODE | HTTP_QUERY_FLAG_NUMBER, &statusCode, &statusCodeSize, nullptr)) {
        if (statusCode < 200 || statusCode >= 300) {
            printf("[native_download_file] Download HTTP status error: %lu for url: %s\n", statusCode, url);
            InternetCloseHandle(hUrl);
            InternetCloseHandle(hInet);
            return -4;
        }
    }

    // Try to get Content-Length
    char szContentLength[32] = "";
    DWORD dwBufLen = sizeof(szContentLength);
    DWORD dwIndex = 0;
    if (HttpQueryInfoA(hUrl, HTTP_QUERY_CONTENT_LENGTH, szContentLength, &dwBufLen, &dwIndex)) {
        g_download_total = atol(szContentLength);
    }

    HANDLE hFile = CreateFileA(win_target_path, GENERIC_WRITE, 0, nullptr,
        CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, nullptr);
    if (hFile == INVALID_HANDLE_VALUE) {
        DWORD err = GetLastError();
        printf("[native_download_file] CreateFileA failed for target path: %s, error code: %lu\n", win_target_path, err);
        InternetCloseHandle(hUrl); InternetCloseHandle(hInet); return -3;
    }

    char buf[65536];
    DWORD read = 0, written = 0;
    while (InternetReadFile(hUrl, buf, sizeof(buf), &read) && read > 0) {
        WriteFile(hFile, buf, read, &written, nullptr);
        g_download_received += read;
        if (g_download_total > 0) {
            g_download_progress = ((double)g_download_received / (double)g_download_total) * 100.0;
        }
        read = 0;
    }

    // Done
    g_download_progress = 100.0;
    CloseHandle(hFile);
    InternetCloseHandle(hUrl);
    InternetCloseHandle(hInet);
    return 0;
}

// ── Native unzip via Shell32 COM (IShellDispatch) ─────────────────────────────
// Returns 0 on success, non-zero on error.
extern "C" int native_unzip_file(const char* zip_path, const char* extract_path) {
    HRESULT hr = CoInitializeEx(nullptr, COINIT_APARTMENTTHREADED | COINIT_DISABLE_OLE1DDE);
    bool coinit_ok = SUCCEEDED(hr);

    // Ensure extract dir exists
    SHCreateDirectoryExA(nullptr, extract_path, nullptr);

    // Convert paths to wide
    wchar_t wzip[MAX_PATH], wdest[MAX_PATH];
    MultiByteToWideChar(CP_UTF8, 0, zip_path,     -1, wzip,  MAX_PATH);
    MultiByteToWideChar(CP_UTF8, 0, extract_path, -1, wdest, MAX_PATH);

    // Shell NameSpace prefers backslashes for paths
    std::wstring zip_str(wzip);
    std::wstring dest_str(wdest);
    for (auto& c : zip_str) if (c == L'/') c = L'\\';
    for (auto& c : dest_str) if (c == L'/') c = L'\\';

    IShellDispatch* pShell = nullptr;
    hr = CoCreateInstance(CLSID_Shell, nullptr, CLSCTX_INPROC_SERVER,
                          IID_IShellDispatch, (void**)&pShell);
    if (FAILED(hr) || !pShell) {
        if (coinit_ok) CoUninitialize();
        return -1;
    }

    VARIANT vZip, vDest, vOpts;
    VariantInit(&vZip); VariantInit(&vDest); VariantInit(&vOpts);
    vZip.vt  = VT_BSTR; vZip.bstrVal  = SysAllocString(zip_str.c_str());
    vDest.vt = VT_BSTR; vDest.bstrVal = SysAllocString(dest_str.c_str());
    vOpts.vt = VT_I4;   vOpts.lVal    = 1044; // FOF_NO_UI | FOF_NOCONFIRMATION | FOF_NOERRORUI | FOF_SILENT

    Folder* pZipFolder  = nullptr;
    Folder* pDestFolder = nullptr;
    pShell->NameSpace(vZip,  &pZipFolder);
    pShell->NameSpace(vDest, &pDestFolder);

    int result = -2;
    if (pZipFolder && pDestFolder) {
        FolderItems* pZipItems = nullptr;
        pZipFolder->Items(&pZipItems);
        if (pZipItems) {
            VARIANT vItems;
            VariantInit(&vItems);
            vItems.vt = VT_DISPATCH;
            pZipItems->QueryInterface(IID_IDispatch, (void**)&vItems.pdispVal);
            
            hr = pDestFolder->CopyHere(vItems, vOpts);
            if (SUCCEEDED(hr)) {
                // Sleep for extraction completion
                Sleep(2000); 
                result = 0;
            }
            VariantClear(&vItems);
            pZipItems->Release();
        }
        pZipFolder->Release();
        pDestFolder->Release();
    }

    VariantClear(&vZip); VariantClear(&vDest);
    pShell->Release();
    if (coinit_ok) CoUninitialize();
    return result;
}

// ── Delete path (file or dir) ──────────────────────────────────────────────────
extern "C" int native_delete_path(const char* path) {
    wchar_t wpath[MAX_PATH + 2] = {};
    MultiByteToWideChar(CP_UTF8, 0, path, -1, wpath, MAX_PATH);
    // SHFILEOPSTRUCT requires double-null terminated string
    SHFILEOPSTRUCTW op = {};
    op.wFunc  = FO_DELETE;
    op.pFrom  = wpath;
    op.fFlags = FOF_NO_UI | FOF_NOCONFIRMATION | FOF_NOERRORUI | FOF_SILENT;
    return SHFileOperationW(&op);
}

// Define function pointers for WebView2Loader functions loaded dynamically
typedef HRESULT(STDAPICALLTYPE* CreateCoreWebView2EnvironmentWithOptionsFn)(
    PCWSTR browserExecutableFolder,
    PCWSTR userDataFolder,
    ICoreWebView2EnvironmentOptions* environmentOptions,
    ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler* environmentCreatedHandler);

static CreateCoreWebView2EnvironmentWithOptionsFn g_CreateCoreWebView2EnvironmentWithOptions = nullptr;

struct ChildWebView {
    HWND hwnd = nullptr;
    ICoreWebView2Controller* controller = nullptr;
    ICoreWebView2* webview = nullptr;
    std::wstring pending_url = L"";
    bool is_initialized = false;
    int last_x = -32000;
    int last_y = -32000;
    int last_w = 1280;
    int last_h = 720;
    bool last_visible = false;
    bool is_popup = false;
    std::wstring pending_init_script = L"";
    std::string key = "";
    HWND detached_hwnd = nullptr;
    HWND original_parent = nullptr;
    std::wstring title = L"OneView Detached Tab";
};

// Window Procedure for child webview container windows
LRESULT CALLBACK ChildWebViewWndProc(HWND hwnd, UINT msg, WPARAM wp, LPARAM lp) {
    ChildWebView* self = (ChildWebView*)GetWindowLongPtr(hwnd, GWLP_USERDATA);
    if (msg == WM_SIZE) {
        if (self && self->controller) {
            RECT r;
            GetClientRect(hwnd, &r);
            self->controller->put_Bounds(r);
        }
        return 0;
    }
    if (msg == WM_ERASEBKGND) {
        return 1; // Prevent background erasing to avoid flicker/flash
    }
    if (msg == WM_DESTROY) {
        if (self) {
            if (self->controller) {
                self->controller->Close();
                self->controller->Release();
                self->controller = nullptr;
            }
            if (self->webview) {
                self->webview->Release();
                self->webview = nullptr;
            }
            self->hwnd = nullptr;
        }
        return 0;
    }
    return DefWindowProc(hwnd, msg, wp, lp);
}

// Ensure the window class is registered
static void RegisterChildClass() {
    static bool registered = false;
    if (registered) return;
    WNDCLASSA wc = {};
    wc.lpfnWndProc = ChildWebViewWndProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "ChildWebViewClass";
    wc.hbrBackground = NULL;
    wc.hIcon = LoadIconA(GetModuleHandle(NULL), "IDI_ICON1");
    RegisterClassA(&wc);
    registered = true;
}

// Dynamically load WebView2Loader.dll if not loaded already
static bool LoadWebView2Loader() {
    if (g_CreateCoreWebView2EnvironmentWithOptions) return true;
    HMODULE hDll = LoadLibraryA("WebView2Loader.dll");
    if (!hDll) return false;
    g_CreateCoreWebView2EnvironmentWithOptions = (CreateCoreWebView2EnvironmentWithOptionsFn)
        GetProcAddress(hDll, "CreateCoreWebView2EnvironmentWithOptions");
    return g_CreateCoreWebView2EnvironmentWithOptions != nullptr;
}

// Define GUIDs locally to avoid missing link symbols under MinGW / LLVM Linker
static const GUID Local_IID_ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler = 
    { 0xA2207A2A, 0x7258, 0x45AB, { 0xA4, 0x0C, 0xE6, 0x15, 0xB6, 0x12, 0xC2, 0x08 } };

static const GUID Local_IID_ICoreWebView2CreateCoreWebView2ControllerCompletedHandler = 
    { 0xE834D18B, 0xEFD3, 0x4CEE, { 0x8B, 0xA5, 0x5A, 0xBE, 0x1F, 0x3D, 0x48, 0xEC } };

static const GUID Local_IID_ICoreWebView2Controller2 = 
    { 0xc979903e, 0xd4ca, 0x4228, { 0x92, 0xeb, 0x47, 0xee, 0x3f, 0xa9, 0x6e, 0xab } };

static const GUID Local_IID_ICoreWebView2WebMessageReceivedEventHandler = 
    {0x57213f19, 0x00e6, 0x49fa, {0x8e, 0x07, 0x89, 0x8e, 0xa0, 0x1e, 0xcb, 0xd2}};

typedef void (*ChildWebviewMessageCallback)(const char* key, const char* message);
static ChildWebviewMessageCallback g_message_callback = nullptr;

static const GUID Local_IID_ICoreWebView2ExecuteScriptCompletedHandler = 
    {0x49511172, 0xcc67, 0x4bca, {0x99, 0x23, 0x13, 0x71, 0x12, 0xf4, 0xc4, 0xcc}};

typedef void (*ExecuteScriptCallback)(void* ctx, bool success, const char* json_str);

class ExecuteScriptCompletedHandler : public ICoreWebView2ExecuteScriptCompletedHandler {
private:
    ULONG m_refCount = 1;
    ExecuteScriptCallback m_callback;
    void* m_ctx;
public:
    ExecuteScriptCompletedHandler(ExecuteScriptCallback callback, void* ctx)
        : m_callback(callback), m_ctx(ctx) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2ExecuteScriptCompletedHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(HRESULT errorCode, LPCWSTR resultObjectAsJson) override {
        printf("[C++ DEBUG] ExecuteScriptCompletedHandler::Invoke: errorCode=0x%lx, has_result=%d\n", errorCode, resultObjectAsJson != nullptr);
        if (SUCCEEDED(errorCode) && resultObjectAsJson) {
            int len = WideCharToMultiByte(CP_UTF8, 0, resultObjectAsJson, -1, NULL, 0, NULL, NULL);
            char* json_utf8 = new char[len];
            WideCharToMultiByte(CP_UTF8, 0, resultObjectAsJson, -1, json_utf8, len, NULL, NULL);
            m_callback(m_ctx, true, json_utf8);
            delete[] json_utf8;
        } else {
            m_callback(m_ctx, false, "{}");
        }
        return S_OK;
    }
};

static const GUID Local_IID_ICoreWebView2SourceChangedEventHandler = 
    { 0x3C067F9F, 0x5388, 0x4772, { 0x8B, 0x48, 0x79, 0xF7, 0xEF, 0x1A, 0xB3, 0x7C } };

class SourceChangedHandler : public ICoreWebView2SourceChangedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_key;
public:
    SourceChangedHandler(const std::string& key) : m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2SourceChangedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2* sender, ICoreWebView2SourceChangedEventArgs* args) override {
        LPWSTR url = nullptr;
        if (SUCCEEDED(sender->get_Source(&url)) && url) {
            int len = WideCharToMultiByte(CP_UTF8, 0, url, -1, NULL, 0, NULL, NULL);
            char* url_utf8 = new char[len];
            WideCharToMultiByte(CP_UTF8, 0, url, -1, url_utf8, len, NULL, NULL);

            BOOL canBack = FALSE;
            BOOL canForward = FALSE;
            sender->get_CanGoBack(&canBack);
            sender->get_CanGoForward(&canForward);
            std::string canBackStr = canBack ? "true" : "false";
            std::string canForwardStr = canForward ? "true" : "false";

            std::string msg = "{\"method\":\"source-changed\",\"payload\":{\"url\":\"" + std::string(url_utf8) + 
                              "\",\"canGoBack\":" + canBackStr + ",\"canGoForward\":" + canForwardStr + "}}";

            if (g_message_callback) {
                g_message_callback(m_key.c_str(), msg.c_str());
            }

            delete[] url_utf8;
            CoTaskMemFree(url);
        }
        return S_OK;
    }
};

static const GUID Local_IID_ICoreWebView2NavigationCompletedEventHandler = 
    {0xd33a35bf,0x1c49,0x4f98,{0x93,0xab,0x00,0x6e,0x05,0x33,0xfe,0x1c}};

class NavigationCompletedHandler : public ICoreWebView2NavigationCompletedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_key;
public:
    NavigationCompletedHandler(const std::string& key) : m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2NavigationCompletedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2* sender, ICoreWebView2NavigationCompletedEventArgs* args) override {
        std::string msg = "{\"event\":\"did-stop-loading\",\"payload\":{}}";
        if (g_message_callback) {
            g_message_callback(m_key.c_str(), msg.c_str());
        }
        return S_OK;
    }
};

static const GUID Local_IID_ICoreWebView2DocumentTitleChangedEventHandler = 
    {0xf5f2b923,0x953e,0x4042,{0x9f,0x95,0xf3,0xa1,0x18,0xe1,0xaf,0xd4}};

class DocumentTitleChangedHandler : public ICoreWebView2DocumentTitleChangedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_key;
public:
    DocumentTitleChangedHandler(const std::string& key) : m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2DocumentTitleChangedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2* sender, IUnknown* args) override {
        LPWSTR title = nullptr;
        if (SUCCEEDED(sender->get_DocumentTitle(&title)) && title) {
            int len = WideCharToMultiByte(CP_UTF8, 0, title, -1, NULL, 0, NULL, NULL);
            char* title_utf8 = new char[len];
            WideCharToMultiByte(CP_UTF8, 0, title, -1, title_utf8, len, NULL, NULL);
            
            std::string title_str = title_utf8;
            std::string escaped_title = "";
            for (char c : title_str) {
                if (c == '"') escaped_title += "\\\"";
                else if (c == '\\') escaped_title += "\\\\";
                else escaped_title += c;
            }

            std::string msg = "{\"event\":\"page-title-updated\",\"payload\":{\"title\":\"" + escaped_title + "\"}}";
            if (g_message_callback) {
                g_message_callback(m_key.c_str(), msg.c_str());
            }

            delete[] title_utf8;
            CoTaskMemFree(title);
        }
        return S_OK;
    }
};

static const GUID Local_IID_ICoreWebView2HistoryChangedEventHandler = 
    { 0xC79A420C, 0xEFD9, 0x4058, { 0x92, 0x95, 0x3E, 0x8B, 0x4B, 0xCA, 0xB6, 0x45 } };

class HistoryChangedHandler : public ICoreWebView2HistoryChangedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_key;
public:
    HistoryChangedHandler(const std::string& key) : m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2HistoryChangedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2* sender, IUnknown* args) override {
        BOOL canBack = FALSE;
        BOOL canForward = FALSE;
        sender->get_CanGoBack(&canBack);
        sender->get_CanGoForward(&canForward);
        
        LPWSTR url = nullptr;
        std::string url_str = "";
        if (SUCCEEDED(sender->get_Source(&url)) && url) {
            int len = WideCharToMultiByte(CP_UTF8, 0, url, -1, NULL, 0, NULL, NULL);
            char* url_utf8 = new char[len];
            WideCharToMultiByte(CP_UTF8, 0, url, -1, url_utf8, len, NULL, NULL);
            url_str = url_utf8;
            delete[] url_utf8;
            CoTaskMemFree(url);
        }

        std::string canBackStr = canBack ? "true" : "false";
        std::string canForwardStr = canForward ? "true" : "false";

        std::string msg = "{\"method\":\"history-changed\",\"payload\":{\"url\":\"" + url_str + 
                          "\",\"canGoBack\":" + canBackStr + ",\"canGoForward\":" + canForwardStr + "}}";

        if (g_message_callback) {
            g_message_callback(m_key.c_str(), msg.c_str());
        }
        return S_OK;
    }
};

// ─── WebView2 Download Interception and Handlers ─────────────────────────────
#include <map>
#include <mutex>

static std::map<std::string, ICoreWebView2DownloadOperation*> g_active_downloads;
static std::mutex g_downloads_mutex;

static const GUID Local_IID_ICoreWebView2DownloadStartingEventHandler = 
    { 0xEFEDC989, 0xC396, 0x41CA, { 0x83, 0xF7, 0x07, 0xF8, 0x45, 0xA5, 0x57, 0x24 } };

static const GUID Local_IID_ICoreWebView2BytesReceivedChangedEventHandler = 
    { 0x828E8C81, 0x34B1, 0x4168, { 0xAC, 0x3E, 0x2A, 0xEF, 0x0C, 0x22, 0xBF, 0x0A } };

static const GUID Local_IID_ICoreWebView2StateChangedEventHandler = 
    { 0x81353DA7, 0xD83C, 0x449E, { 0xB5, 0xA5, 0xA2, 0x5C, 0xFA, 0x5D, 0x1B, 0xDF } };

class DownloadBytesReceivedChangedHandler : public ICoreWebView2BytesReceivedChangedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_id;
    std::string m_key;
public:
    DownloadBytesReceivedChangedHandler(const std::string& id, const std::string& key) : m_id(id), m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2BytesReceivedChangedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2DownloadOperation* sender, IUnknown* args) override {
        INT64 received = 0;
        INT64 total = 0;
        sender->get_BytesReceived(&received);
        sender->get_TotalBytesToReceive(&total);

        char msg_buf[256];
        sprintf_s(msg_buf, "{\"method\":\"download-progress\",\"payload\":{\"id\":\"%s\",\"receivedBytes\":%lld,\"totalBytes\":%lld}}", 
                  m_id.c_str(), received, total);

        if (g_message_callback) {
            g_message_callback(m_key.c_str(), msg_buf);
        }
        return S_OK;
    }
};

class DownloadStateChangedHandler : public ICoreWebView2StateChangedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_id;
    std::string m_key;
public:
    DownloadStateChangedHandler(const std::string& id, const std::string& key) : m_id(id), m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2StateChangedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2DownloadOperation* sender, IUnknown* args) override {
        COREWEBVIEW2_DOWNLOAD_STATE state;
        sender->get_State(&state);

        std::string state_str = "progressing";
        if (state == COREWEBVIEW2_DOWNLOAD_STATE_COMPLETED) {
            state_str = "completed";
            // Remove from active map and release reference
            std::lock_guard<std::mutex> lock(g_downloads_mutex);
            auto it = g_active_downloads.find(m_id);
            if (it != g_active_downloads.end()) {
                it->second->Release();
                g_active_downloads.erase(it);
            }
        } else if (state == COREWEBVIEW2_DOWNLOAD_STATE_INTERRUPTED) {
            state_str = "interrupted";
        }

        INT64 received = 0;
        INT64 total = 0;
        sender->get_BytesReceived(&received);
        sender->get_TotalBytesToReceive(&total);

        char msg_buf[512];
        sprintf_s(msg_buf, "{\"method\":\"download-state\",\"payload\":{\"id\":\"%s\",\"state\":\"%s\",\"receivedBytes\":%lld,\"totalBytes\":%lld}}", 
                  m_id.c_str(), state_str.c_str(), received, total);

        if (g_message_callback) {
            g_message_callback(m_key.c_str(), msg_buf);
        }
        return S_OK;
    }
};

class DownloadStartingHandler : public ICoreWebView2DownloadStartingEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_key;
public:
    DownloadStartingHandler(const std::string& key) : m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2DownloadStartingEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2* sender, ICoreWebView2DownloadStartingEventArgs* args) override {
        // Suppress default UI
        args->put_Handled(TRUE);

        ICoreWebView2DownloadOperation* op = nullptr;
        args->get_DownloadOperation(&op);
        if (op) {
            op->AddRef();
            
            char id_buf[64];
            sprintf_s(id_buf, "%p", op);
            std::string id = id_buf;

            {
                std::lock_guard<std::mutex> lock(g_downloads_mutex);
                g_active_downloads[id] = op;
            }

            LPWSTR resultFilePath = nullptr;
            std::string filepath = "";
            if (SUCCEEDED(op->get_ResultFilePath(&resultFilePath)) && resultFilePath) {
                int len = WideCharToMultiByte(CP_UTF8, 0, resultFilePath, -1, NULL, 0, NULL, NULL);
                char* fp_utf8 = new char[len];
                WideCharToMultiByte(CP_UTF8, 0, resultFilePath, -1, fp_utf8, len, NULL, NULL);
                filepath = fp_utf8;
                delete[] fp_utf8;
                CoTaskMemFree(resultFilePath);
            }

            // Extract file name
            std::string filename = "";
            size_t last_slash = filepath.find_last_of("\\/");
            if (last_slash != std::string::npos) {
                filename = filepath.substr(last_slash + 1);
            } else {
                filename = filepath;
            }

            // Escape backslashes for JSON
            std::string filepath_escaped = "";
            for (char c : filepath) {
                if (c == '\\') {
                    filepath_escaped += "\\\\";
                } else {
                    filepath_escaped += c;
                }
            }

            INT64 total = 0;
            op->get_TotalBytesToReceive(&total);

            // Register handlers for progress and state changes
            EventRegistrationToken p_token;
            DownloadBytesReceivedChangedHandler* progressHandler = new DownloadBytesReceivedChangedHandler(id, m_key);
            op->add_BytesReceivedChanged(progressHandler, &p_token);
            progressHandler->Release();

            EventRegistrationToken s_token;
            DownloadStateChangedHandler* stateHandler = new DownloadStateChangedHandler(id, m_key);
            op->add_StateChanged(stateHandler, &s_token);
            stateHandler->Release();

            char msg_buf[1024];
            sprintf_s(msg_buf, "{\"method\":\"download-started\",\"payload\":{\"id\":\"%s\",\"fileName\":\"%s\",\"totalBytes\":%lld,\"savePath\":\"%s\",\"state\":\"progressing\"}}", 
                      id.c_str(), filename.c_str(), total, filepath_escaped.c_str());

            if (g_message_callback) {
                g_message_callback(m_key.c_str(), msg_buf);
            }
        }
        return S_OK;
    }
};

// ─── WebView2 Context Menu Customization ──────────────────────────────────────
static ICoreWebView2Environment* g_webViewEnvironment = nullptr; // GPU environment (default)
static ICoreWebView2Environment* g_webViewEnvironmentCPU = nullptr; // CPU environment (for SiteSnap screenshots)
static bool g_isInitializingEnv = false;
static bool g_isInitializingEnvCPU = false;
static bool g_isNativeNewWindowRequested = false;

static void LogDebug(const std::string& msg) {
    FILE* f = fopen("C:\\Users\\SumanBiswas\\oneview_debug.log", "a");
    if (f) {
        fprintf(f, "%s\n", msg.c_str());
        fclose(f);
    }
}

static const GUID Local_IID_ICoreWebView2ContextMenuRequestedEventHandler = 
    { 0x04D3FE1D, 0xAB87, 0x42FB, { 0xA8, 0x98, 0xDA, 0x24, 0x1D, 0x35, 0xB6, 0x3C } };

static const GUID Local_IID_ICoreWebView2CustomItemSelectedEventHandler = 
    { 0x49E1D0BC, 0xFE9E, 0x4481, { 0xB7, 0xC2, 0x32, 0x32, 0x4A, 0xA2, 0x19, 0x98 } };

static const GUID Local_IID_ICoreWebView2NewWindowRequestedEventHandler =
    { 0xd4c185fe, 0xc81c, 0x4989, { 0x97, 0xaf, 0x2d, 0x3f, 0xa7, 0xab, 0x56, 0x51 } };

static const GUID Local_IID_ICoreWebView2_11 = 
    { 0x0BE78E56, 0xC193, 0x4051, { 0xB9, 0x43, 0x23, 0xB4, 0x60, 0xC0, 0x8B, 0xDB } };

static const GUID Local_IID_ICoreWebView2Environment9 = 
    { 0xF06F41BF, 0x4B5A, 0x49D8, { 0xB9, 0xF6, 0xFA, 0x16, 0xCD, 0x29, 0xF2, 0x74 } };

class CustomItemSelectedHandler : public ICoreWebView2CustomItemSelectedEventHandler {
private:
    ULONG m_refCount = 1;
    std::wstring m_linkUri;
    std::string m_key;
    ICoreWebView2* m_webview;
    bool m_isNewWindow;
public:
    CustomItemSelectedHandler(const std::wstring& linkUri, const std::string& key, ICoreWebView2* webview, bool isNewWindow = false) 
        : m_linkUri(linkUri), m_key(key), m_webview(webview), m_isNewWindow(isNewWindow) {
        if (m_webview) m_webview->AddRef();
    }
    ~CustomItemSelectedHandler() {
        if (m_webview) m_webview->Release();
    }

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2CustomItemSelectedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2ContextMenuItem* sender, IUnknown* args) override {
        int len = WideCharToMultiByte(CP_UTF8, 0, m_linkUri.c_str(), -1, NULL, 0, NULL, NULL);
        char* url_utf8 = new char[len];
        WideCharToMultiByte(CP_UTF8, 0, m_linkUri.c_str(), -1, url_utf8, len, NULL, NULL);
        std::string url_str = url_utf8;
        delete[] url_utf8;

        LogDebug("[C++] CustomItemSelectedHandler::Invoke: isNewWindow=" + std::to_string(m_isNewWindow) + ", key=" + m_key + ", url=" + url_str);

        if (m_isNewWindow) {
            std::string msg = "{\"method\":\"open-detached-view-window\",\"payload\":{\"url\":\"" + url_str + "\",\"title\":\"Result\"}}";
            if (g_message_callback) {
                g_message_callback(m_key.c_str(), msg.c_str());
            }
        } else {
            std::string msg = "{\"method\":\"tabs-create-standard\",\"payload\":{\"url\":\"" + url_str + "\"}}";
            if (g_message_callback) {
                g_message_callback(m_key.c_str(), msg.c_str());
            }
        }
        return S_OK;
    }
};

class ContextMenuRequestedHandler : public ICoreWebView2ContextMenuRequestedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_key;
public:
    ContextMenuRequestedHandler(const std::string& key) : m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2ContextMenuRequestedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2* sender, ICoreWebView2ContextMenuRequestedEventArgs* args) override {
        ICoreWebView2ContextMenuTarget* target = nullptr;
        args->get_ContextMenuTarget(&target);
        if (!target) return S_OK;

        BOOL hasLink = FALSE;
        target->get_HasLinkUri(&hasLink);
        if (hasLink) {
            LPWSTR linkUri = nullptr;
            target->get_LinkUri(&linkUri);
            if (linkUri) {
                std::wstring link_str = linkUri;
                CoTaskMemFree(linkUri);

                LogDebug("[C++] ContextMenuRequestedHandler::Invoke: HasLinkUri=" + std::string(link_str.begin(), link_str.end()));

                ICoreWebView2ContextMenuItemCollection* items = nullptr;
                args->get_MenuItems(&items);
                if (items) {
                    UINT32 count = 0;
                    items->get_Count(&count);
                    for (int i = (int)count - 1; i >= 0; i--) {
                        ICoreWebView2ContextMenuItem* item = nullptr;
                        items->GetValueAtIndex(i, &item);
                        if (item) {
                            LPWSTR label = nullptr;
                            item->get_Label(&label);
                            if (label) {
                                std::wstring label_str = label;
                                CoTaskMemFree(label);

                                // Clean up & accelerator characters from label
                                std::wstring clean_label;
                                for (wchar_t c : label_str) {
                                    if (c != L'&') {
                                        clean_label += c;
                                    }
                                }

                                LogDebug("[C++] Checking native menu item label: " + std::string(clean_label.begin(), clean_label.end()));

                                // Remove native "Open link in new window" / "Open link in new tab"
                                if (clean_label.find(L"new window") != std::wstring::npos || 
                                    clean_label.find(L"New window") != std::wstring::npos ||
                                    clean_label.find(L"new tab") != std::wstring::npos ||
                                    clean_label.find(L"New tab") != std::wstring::npos) {
                                    items->RemoveValueAtIndex(i);
                                    LogDebug("[C++] Removed native context menu item: " + std::string(clean_label.begin(), clean_label.end()));
                                }
                            }
                            item->Release();
                        }
                    }

                    ICoreWebView2ContextMenuItem* newTabItem = nullptr;
                    ICoreWebView2ContextMenuItem* newWindowItem = nullptr;
                    ICoreWebView2Environment9* env9 = nullptr;
                    if (g_webViewEnvironment && SUCCEEDED(g_webViewEnvironment->QueryInterface(Local_IID_ICoreWebView2Environment9, (void**)&env9)) && env9) {
                        HRESULT hr1 = env9->CreateContextMenuItem(
                            L"Open in new tab",
                            nullptr,
                            COREWEBVIEW2_CONTEXT_MENU_ITEM_KIND_COMMAND,
                            &newTabItem
                        );
                        HRESULT hr2 = env9->CreateContextMenuItem(
                            L"Open in new window",
                            nullptr,
                            COREWEBVIEW2_CONTEXT_MENU_ITEM_KIND_COMMAND,
                            &newWindowItem
                        );
                        env9->Release();

                        if (SUCCEEDED(hr1) && newTabItem) {
                            CustomItemSelectedHandler* clickHandler = new CustomItemSelectedHandler(link_str, m_key, sender, false);
                            EventRegistrationToken token;
                            newTabItem->add_CustomItemSelected(clickHandler, &token);
                            items->InsertValueAtIndex(0, newTabItem);
                            newTabItem->Release();
                            clickHandler->Release();
                            LogDebug("[C++] Inserted custom \"Open in new tab\" menu item");
                        }
                        if (SUCCEEDED(hr2) && newWindowItem) {
                            CustomItemSelectedHandler* clickHandler = new CustomItemSelectedHandler(link_str, m_key, sender, true);
                            EventRegistrationToken token;
                            newWindowItem->add_CustomItemSelected(clickHandler, &token);
                            items->InsertValueAtIndex(1, newWindowItem);
                            newWindowItem->Release();
                            clickHandler->Release();
                            LogDebug("[C++] Inserted custom \"Open in new window\" menu item");
                        }
                    }
                    items->Release();
                }
            }
        }
        target->Release();
        return S_OK;
    }
};

class NewWindowRequestedHandler : public ICoreWebView2NewWindowRequestedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_key;
public:
    NewWindowRequestedHandler(const std::string& key) : m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2NewWindowRequestedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2* sender, ICoreWebView2NewWindowRequestedEventArgs* args) override {
        LPWSTR uri = nullptr;
        args->get_Uri(&uri);
        std::string url_str = "";
        if (uri) {
            int len = WideCharToMultiByte(CP_UTF8, 0, uri, -1, NULL, 0, NULL, NULL);
            char* url_utf8 = new char[len];
            WideCharToMultiByte(CP_UTF8, 0, uri, -1, url_utf8, len, NULL, NULL);
            url_str = url_utf8;
            delete[] url_utf8;
            CoTaskMemFree(uri);
        }

        LogDebug("[C++] NewWindowRequestedHandler::Invoke: isNativeNewWindowRequested=" + std::to_string(g_isNativeNewWindowRequested) + ", url=" + url_str);

        if (g_isNativeNewWindowRequested) {
            g_isNativeNewWindowRequested = false;
            // Let WebView2 handle it natively (opens in a new window)
            return S_OK;
        }

        // Intercept all other requests (target="_blank", ctrl+click, middle-click) and open in a new tab!
        args->put_Handled(TRUE);
        if (!url_str.empty()) {
            std::string msg = "{\"method\":\"new-window\",\"payload\":{\"url\":\"" + url_str + "\"}}";
            if (g_message_callback) {
                g_message_callback(m_key.c_str(), msg.c_str());
            }
        }
        return S_OK;
    }
};

class WebMessageReceivedHandler : public ICoreWebView2WebMessageReceivedEventHandler {
private:
    ULONG m_refCount = 1;
    std::string m_key;
public:
    WebMessageReceivedHandler(const std::string& key) : m_key(key) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2WebMessageReceivedEventHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(ICoreWebView2* sender, ICoreWebView2WebMessageReceivedEventArgs* args) override {
        LPWSTR message = nullptr;
        if (SUCCEEDED(args->TryGetWebMessageAsString(&message)) && message) {
            int len = WideCharToMultiByte(CP_UTF8, 0, message, -1, NULL, 0, NULL, NULL);
            char* message_utf8 = new char[len];
            WideCharToMultiByte(CP_UTF8, 0, message, -1, message_utf8, len, NULL, NULL);
            
            if (g_message_callback) {
                g_message_callback(m_key.c_str(), message_utf8);
            }
            
            delete[] message_utf8;
            CoTaskMemFree(message);
        }
        return S_OK;
    }
};

static std::wstring GetCPU_UDFPath() {
    wchar_t appdata[MAX_PATH];
    if (SUCCEEDED(SHGetFolderPathW(NULL, CSIDL_APPDATA, NULL, 0, appdata))) {
        std::wstring path(appdata);
        path += L"\\OneView Dev\\Secret\\tabs-udf";
        return path;
    }
    return L"";
}

static std::wstring GetNormalUDFPath() {
    wchar_t appdata[MAX_PATH];
    if (SUCCEEDED(SHGetFolderPathW(NULL, CSIDL_APPDATA, NULL, 0, appdata))) {
        std::wstring path(appdata);
        path += L"\\OneView\\WebViewData";
        return path;
    }
    return L"";
}

static void CleanSavedPasswords(const std::wstring& udfPath) {
    if (udfPath.empty()) return;
    std::wstring loginDataPath = udfPath + L"\\EBWebView\\Default\\Login Data";
    DeleteFileW(loginDataPath.c_str());
    std::wstring loginDataJournal = udfPath + L"\\EBWebView\\Default\\Login Data-journal";
    DeleteFileW(loginDataJournal.c_str());
}

// Custom completed handler for pre-initializing the global environment
class GlobalEnvironmentCompletedHandler : public ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler {
private:
    ULONG m_refCount = 1;
    bool m_isCPU = false;
public:
    GlobalEnvironmentCompletedHandler(bool isCPU = false) : m_isCPU(isCPU) {}

    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler) {
            *ppvObject = this;
            AddRef();
            return S_OK;
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }
    ULONG STDMETHODCALLTYPE AddRef() override { return InterlockedIncrement(&m_refCount); }
    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) delete this;
        return count;
    }
    HRESULT STDMETHODCALLTYPE Invoke(HRESULT result, ICoreWebView2Environment* env) override {
        if (SUCCEEDED(result) && env) {
            if (m_isCPU) {
                g_webViewEnvironmentCPU = env;
                g_webViewEnvironmentCPU->AddRef();
                printf("[C++ DEBUG] Global CPU WebView2 Environment initialized and cached successfully.\n");
            } else {
                g_webViewEnvironment = env;
                g_webViewEnvironment->AddRef();
                printf("[C++ DEBUG] Global GPU WebView2 Environment initialized and cached successfully.\n");
            }
            fflush(stdout);
        } else {
            printf("[C++ DEBUG] Failed to initialize global WebView2 environment: isCPU=%d, hr=0x%lX\n", m_isCPU, result);
            fflush(stdout);
        }
        if (m_isCPU) {
            g_isInitializingEnvCPU = false;
        } else {
            g_isInitializingEnv = false;
        }
        return S_OK;
    }
};

// Implement the COM interfaces raw in C++ to avoid extra headers/dependencies
class ChildWebViewCompletedHandler : 
    public ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler,
    public ICoreWebView2CreateCoreWebView2ControllerCompletedHandler {
private:
    ChildWebView* m_parent;
    ULONG m_refCount = 1;
    bool m_isControllerHandler = false;
    ICoreWebView2Environment* m_env = nullptr;
    bool m_isCPU = false;

public:
    ChildWebViewCompletedHandler(ChildWebView* parent, bool isControllerHandler = false, ICoreWebView2Environment* env = nullptr, bool isCPU = false) 
        : m_parent(parent), m_isControllerHandler(isControllerHandler), m_env(env), m_isCPU(isCPU) {}

    // IUnknown
    HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
        if (!ppvObject) return E_POINTER;
        if (m_isControllerHandler) {
            if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2CreateCoreWebView2ControllerCompletedHandler) {
                *ppvObject = (ICoreWebView2CreateCoreWebView2ControllerCompletedHandler*)this;
                AddRef();
                return S_OK;
            }
        } else {
            if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler) {
                *ppvObject = (ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler*)this;
                AddRef();
                return S_OK;
            }
        }
        *ppvObject = nullptr;
        return E_NOINTERFACE;
    }

    ULONG STDMETHODCALLTYPE AddRef() override {
        return InterlockedIncrement(&m_refCount);
    }

    ULONG STDMETHODCALLTYPE Release() override {
        ULONG count = InterlockedDecrement(&m_refCount);
        if (count == 0) {
            delete this;
        }
        return count;
    }

    // ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler
    HRESULT STDMETHODCALLTYPE Invoke(HRESULT result, ICoreWebView2Environment* env) override {
        printf("[C++ DEBUG] Environment Invoke: result=0x%lX, env=%p, isCPU=%d\n", result, env, m_isCPU);
        fflush(stdout);
        if (FAILED(result) || !env) {
            return result;
        }
        
        // Cache environment globally for next tabs if not cached already
        if (!m_isCPU && !g_webViewEnvironment) {
            g_webViewEnvironment = env;
            g_webViewEnvironment->AddRef();
        } else if (m_isCPU && !g_webViewEnvironmentCPU) {
            g_webViewEnvironmentCPU = env;
            g_webViewEnvironmentCPU->AddRef();
        }

        // Environment is ready, now create the controller inside the HWND
        ChildWebViewCompletedHandler* controllerHandler = new ChildWebViewCompletedHandler(m_parent, true, env, m_isCPU);
        HRESULT hr = env->CreateCoreWebView2Controller(m_parent->hwnd, controllerHandler);
        printf("[C++ DEBUG] CreateCoreWebView2Controller returned hr=0x%lX\n", hr);
        fflush(stdout);
        controllerHandler->Release();
        return hr;
    }

    // ICoreWebView2CreateCoreWebView2ControllerCompletedHandler
    HRESULT STDMETHODCALLTYPE Invoke(HRESULT result, ICoreWebView2Controller* controller) override {
        printf("[C++ DEBUG] Controller Invoke: result=0x%lX, controller=%p\n", result, controller);
        fflush(stdout);
        if (FAILED(result) || !controller) {
            return result;
        }
        m_parent->controller = controller;
        controller->AddRef();

        controller->get_CoreWebView2(&m_parent->webview);
        m_parent->webview->AddRef();

        // Resize to container bounds using the last requested state
        RECT r = { 0, 0, m_parent->last_w, m_parent->last_h };
        controller->put_Bounds(r);
        controller->put_IsVisible(m_parent->last_visible ? TRUE : FALSE);

        // Set transparent background for WebView2
        ICoreWebView2Controller2* controller2 = nullptr;
        HRESULT qi_hr = controller->QueryInterface(Local_IID_ICoreWebView2Controller2, (void**)&controller2);
        printf("[C++ DEBUG] QueryInterface ICoreWebView2Controller2 returned hr=0x%lX, ptr=%p\n", qi_hr, controller2);
        fflush(stdout);
        if (SUCCEEDED(qi_hr) && controller2) {
            COREWEBVIEW2_COLOR transparentColor = { 0, 0, 0, 0 };
            HRESULT bg_hr = controller2->put_DefaultBackgroundColor(transparentColor);
            printf("[C++ DEBUG] put_DefaultBackgroundColor returned hr=0x%lX\n", bg_hr);
            fflush(stdout);
            controller2->Release();
        }

        // Put default settings if needed (enable scripts, disable context menu, etc.)
        ICoreWebView2Settings* settings = nullptr;
        if (SUCCEEDED(m_parent->webview->get_Settings(&settings)) && settings) {
            settings->put_AreDefaultContextMenusEnabled(TRUE);
            settings->put_AreDevToolsEnabled(TRUE);
            // Disable native password autosave and autofill (we use custom OneView dropdown instead)
            ICoreWebView2Settings4* settings4 = nullptr;
            if (SUCCEEDED(settings->QueryInterface(IID_ICoreWebView2Settings4, (void**)&settings4)) && settings4) {
                settings4->put_IsPasswordAutosaveEnabled(FALSE);
                settings4->put_IsGeneralAutofillEnabled(FALSE);
                settings4->Release();
            }
            settings->Release();
        }

        // Register WebMessageReceived handler
        WebMessageReceivedHandler* msgHandler = new WebMessageReceivedHandler(m_parent->key);
        m_parent->webview->add_WebMessageReceived(msgHandler, nullptr);
        msgHandler->Release();

        // Register SourceChanged handler
        SourceChangedHandler* srcHandler = new SourceChangedHandler(m_parent->key);
        m_parent->webview->add_SourceChanged(srcHandler, nullptr);
        srcHandler->Release();

        // Register HistoryChanged handler
        HistoryChangedHandler* histHandler = new HistoryChangedHandler(m_parent->key);
        m_parent->webview->add_HistoryChanged(histHandler, nullptr);
        histHandler->Release();

        // Register NavigationCompleted handler
        NavigationCompletedHandler* navHandler = new NavigationCompletedHandler(m_parent->key);
        m_parent->webview->add_NavigationCompleted(navHandler, nullptr);
        navHandler->Release();

        // Register DocumentTitleChanged handler
        DocumentTitleChangedHandler* titleHandler = new DocumentTitleChangedHandler(m_parent->key);
        m_parent->webview->add_DocumentTitleChanged(titleHandler, nullptr);
        titleHandler->Release();

        // Register NewWindowRequested handler
        NewWindowRequestedHandler* newWindowHandler = new NewWindowRequestedHandler(m_parent->key);
        m_parent->webview->add_NewWindowRequested(newWindowHandler, nullptr);
        newWindowHandler->Release();

        // Register DownloadStarting handler (requires webview4)
        ICoreWebView2_4* webview4 = nullptr;
        if (SUCCEEDED(m_parent->webview->QueryInterface(IID_ICoreWebView2_4, (void**)&webview4)) && webview4) {
            DownloadStartingHandler* downloadHandler = new DownloadStartingHandler(m_parent->key);
            webview4->add_DownloadStarting(downloadHandler, nullptr);
            downloadHandler->Release();
            webview4->Release();
        }

        // Register ContextMenuRequested handler (requires webview11)
        ICoreWebView2_11* webview11 = nullptr;
        if (SUCCEEDED(m_parent->webview->QueryInterface(Local_IID_ICoreWebView2_11, (void**)&webview11)) && webview11) {
            ContextMenuRequestedHandler* menuHandler = new ContextMenuRequestedHandler(m_parent->key);
            webview11->add_ContextMenuRequested(menuHandler, nullptr);
            menuHandler->Release();
            webview11->Release();
        }

        // Natively inject credential auto-capture listeners on document creation
        // This is lightweight, silent, and works on all domains (single & multi-step)
        const wchar_t* autoCaptureScript = 
            L"(function() {"
            L"  const autofill = () => {"
            L"    try {"
            L"      console.log('[OneView Autofill] Requesting credentials for domain:', window.location.hostname);"
            L"      if (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) {"
            L"        window.chrome.webview.postMessage(JSON.stringify({"
            L"          method: 'request-autofill',"
            L"          payload: {"
            L"            domain: window.location.hostname"
            L"          }"
            L"        }));"
            L"      }"
            L"    } catch(e) {"
            L"      console.log('[OneView Autofill] Error requesting credentials:', e);"
            L"    }"
            L"  };"
            L"  const fillInputs = (username, password) => {"
            L"    try {"
            L"      const inputs = Array.from(document.querySelectorAll('input'));"
            L"      console.log('[OneView Autofill] Found input elements count:', inputs.length);"
            L"      inputs.forEach((el, idx) => {"
            L"        console.log('[OneView Autofill] Input #' + idx + ' details: type=' + el.type + ' name=' + el.name + ' id=' + el.id + ' placeholder=' + el.placeholder + ' visible=' + (el.offsetWidth > 0));"
            L"      });"
            L"      const passInput = inputs.find(el => el.type === 'password');"
            L"      const userInput = inputs.find(el => el.type === 'email' || el.type === 'text' || el.type === 'tel');"
            L"      console.log('[OneView Autofill] userInput found:', !!userInput, 'passInput found:', !!passInput);"
            L"      if (userInput && !userInput._userTyped) {"
            L"        if (!userInput.value || userInput.value !== username) {"
            L"          console.log('[OneView Autofill] Setting username field');"
            L"          userInput.value = username || '';"
            L"          userInput.dispatchEvent(new Event('input', { bubbles: true }));"
            L"          userInput.dispatchEvent(new Event('change', { bubbles: true }));"
            L"        }"
            L"      }"
            L"      if (passInput && !passInput._userTyped) {"
            L"        if (passInput.value !== password) {"
            L"          console.log('[OneView Autofill] Setting password field');"
            L"          passInput.value = password || '';"
            L"          passInput.dispatchEvent(new Event('input', { bubbles: true }));"
            L"          passInput.dispatchEvent(new Event('change', { bubbles: true }));"
            L"        }"
            L"      }"
            L"    } catch(e) {"
            L"      console.log('[OneView Autofill] Error filling inputs:', e);"
            L"    }"
            L"  };"
            L"  window.onAutofillReceived = (username, password) => {"
            L"    console.log('[OneView Autofill] Received credentials callback');"
            L"    fillInputs(username, password);"
            L"    try {"
            L"      Array.from(document.querySelectorAll('iframe')).forEach(iframe => {"
            L"        try {"
            L"          iframe.contentWindow.postMessage({"
            L"            type: 'ov-autofill',"
            L"            username: username,"
            L"            password: password"
            L"          }, '*');"
            L"        } catch(err) {}"
            L"      });"
            L"    } catch(err) {}"
            L"  };"
            L"  window.addEventListener('message', (e) => {"
            L"    if (e.data && e.data.type === 'ov-autofill') {"
            L"      console.log('[OneView Autofill] Received cross-frame message event');"
            L"      fillInputs(e.data.username, e.data.password);"
            L"    }"
            L"  });"
            L"  if (document.readyState === 'loading') {"
            L"    document.addEventListener('DOMContentLoaded', autofill);"
            L"  } else {"
            L"    autofill();"
            L"  }"
            L"  setTimeout(autofill, 500);"
            L"  setTimeout(autofill, 1500);"
            L"  setTimeout(autofill, 3000);"
            L"  setTimeout(autofill, 5000);"
            L"  try {"
            L"    const observer = new MutationObserver(autofill);"
            L"    observer.observe(document.body || document.documentElement, {"
            L"      childList: true,"
            L"      subtree: true"
            L"    });"
            L"  } catch(e) {}"
            L"  const captureField = (e) => {"
            L"    const el = e.target;"
            L"    if (!el || el.tagName !== 'INPUT') return;"
            L"    el._userTyped = true;"
            L"    try {"
            L"      if (el.type === 'password') {"
            L"        sessionStorage.setItem('ov_last_pass', el.value);"
            L"      } else if (el.type === 'email' || el.type === 'text' || el.type === 'tel') {"
            L"        sessionStorage.setItem('ov_last_user', el.value);"
            L"      }"
            L"    } catch(err) {}"
            L"  };"
            L"  document.addEventListener('input', captureField, true);"
            L"  document.addEventListener('change', captureField, true);"
            L"  document.addEventListener('blur', captureField, true);"
            L"  const notifySave = () => {"
            L"    try {"
            L"      const inputs = Array.from(document.querySelectorAll('input'));"
            L"      const passInput = inputs.find(el => el.type === 'password');"
            L"      const userInput = inputs.find(el => el.type === 'email' || el.type === 'text' || el.type === 'tel');"
            L"      let u = userInput ? userInput.value : '';"
            L"      let p = passInput ? passInput.value : '';"
            L"      if (u) sessionStorage.setItem('ov_last_user', u);"
            L"      if (p) sessionStorage.setItem('ov_last_pass', p);"
            L"      const savedUser = sessionStorage.getItem('ov_last_user') || '';"
            L"      const savedPass = sessionStorage.getItem('ov_last_pass') || '';"
            L"      if (savedUser && savedPass) {"
            L"        if (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) {"
            L"          window.chrome.webview.postMessage(JSON.stringify({"
            L"            method: 'save-credential',"
            L"            payload: {"
            L"              domain: window.location.hostname,"
            L"              username: savedUser,"
            L"              password: savedPass"
            L"            }"
            L"          }));"
            L"        }"
            L"        sessionStorage.removeItem('ov_last_user');"
            L"        sessionStorage.removeItem('ov_last_pass');"
            L"      }"
            L"    } catch(e) {}"
            L"  };"
            L"  document.addEventListener('input', (e) => {"
            L"    const el = e.target;"
            L"    if (!el || el.tagName !== 'INPUT') return;"
            L"    try {"
            L"      if (el.type === 'password') {"
            L"        sessionStorage.setItem('ov_last_pass', el.value);"
            L"      } else if (el.type === 'email' || el.type === 'text' || el.type === 'tel') {"
            L"        sessionStorage.setItem('ov_last_user', el.value);"
            L"      }"
            L"    } catch(e) {}"
            L"  }, true);"
            L"  document.addEventListener('submit', notifySave, true);"
            L"  document.addEventListener('keydown', (e) => { if (e.key === 'Enter') notifySave(); }, true);"
            L"  document.addEventListener('click', notifySave, true);"
            L"})();";
        m_parent->webview->AddScriptToExecuteOnDocumentCreated(autoCaptureScript, nullptr);

        m_parent->is_initialized = true;

        // Apply any pending initialization script before navigating
        if (!m_parent->pending_init_script.empty()) {
            m_parent->webview->AddScriptToExecuteOnDocumentCreated(m_parent->pending_init_script.c_str(), nullptr);
        }

        // Load the pending URL if one was set
        if (!m_parent->pending_url.empty()) {
            m_parent->webview->Navigate(m_parent->pending_url.c_str());
            m_parent->pending_url = L"";
        }

        return S_OK;
    }
};

extern "C" {
    __declspec(dllexport) void child_webview_preinit(HWND parent_hwnd) {
        SetEnvironmentVariableA("WEBVIEW2_DEFAULT_BACKGROUND_COLOR", "00ffffff");
        // Pre-initialize GPU environment by default (fast)
        SetEnvironmentVariableA("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist");
        if (g_webViewEnvironment || g_isInitializingEnv) return;
        RegisterChildClass();
        if (!LoadWebView2Loader()) return;

        printf("[C++ DEBUG] Pre-initializing global GPU WebView2 environment...\n");
        fflush(stdout);
        g_isInitializingEnv = true;

        std::wstring udf = GetNormalUDFPath();
        CleanSavedPasswords(udf);
        GlobalEnvironmentCompletedHandler* handler = new GlobalEnvironmentCompletedHandler(false);
        HRESULT hr = g_CreateCoreWebView2EnvironmentWithOptions(nullptr, udf.empty() ? nullptr : udf.c_str(), nullptr, handler);
        handler->Release();
        if (FAILED(hr)) {
            g_isInitializingEnv = false;
            printf("[C++ DEBUG] g_CreateCoreWebView2EnvironmentWithOptions failed in preinit: hr=0x%lX\n", hr);
            fflush(stdout);
        }
    }

    __declspec(dllexport) void* child_webview_create(HWND parent_hwnd, const char* url, bool is_popup, const char* key, bool disable_gpu) {
        SetEnvironmentVariableA("WEBVIEW2_DEFAULT_BACKGROUND_COLOR", "00ffffff");
        
        if (disable_gpu) {
            SetEnvironmentVariableA("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--disable-gpu --disable-gpu-rasterization --max-texture-size=65536");
        } else {
            SetEnvironmentVariableA("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist");
        }

        RegisterChildClass();
        if (!LoadWebView2Loader()) return nullptr;

        ChildWebView* self = new ChildWebView();
        self->is_popup = is_popup;
        self->key = key ? key : "";

        DWORD style = WS_CHILD | WS_VISIBLE | WS_CLIPSIBLINGS | WS_CLIPCHILDREN;
        DWORD exStyle = 0;
        if (is_popup) {
            style = WS_POPUP | WS_VISIBLE | WS_CLIPSIBLINGS | WS_CLIPCHILDREN;
            exStyle = WS_EX_LAYERED | WS_EX_TOOLWINDOW | WS_EX_TOPMOST;
        }

        // Create the window
        self->hwnd = CreateWindowExA(
            exStyle, "ChildWebViewClass", "",
            style,
            -32000, -32000, 1280, 720,
            parent_hwnd, NULL, GetModuleHandle(NULL), NULL
        );
        if (!self->hwnd) {
            delete self;
            return nullptr;
        }

        if (is_popup) {
            SetLayeredWindowAttributes(self->hwnd, 0, 255, LWA_ALPHA);
        }

        SetWindowLongPtr(self->hwnd, GWLP_USERDATA, (LONG_PTR)self);

        if (url) {
            int len = MultiByteToWideChar(CP_UTF8, 0, url, -1, NULL, 0);
            wchar_t* wurl = new wchar_t[len];
            MultiByteToWideChar(CP_UTF8, 0, url, -1, wurl, len);
            self->pending_url = wurl;
            delete[] wurl;
        }

        printf("[C++ DEBUG] child_webview_create: parent_hwnd=%p, url=%s, self->hwnd=%p, disable_gpu=%d, cached_env=%p, cached_cpu_env=%p\n", 
            parent_hwnd, url ? url : "null", self->hwnd, disable_gpu, g_webViewEnvironment, g_webViewEnvironmentCPU);
        fflush(stdout);

        ICoreWebView2Environment* target_env = disable_gpu ? g_webViewEnvironmentCPU : g_webViewEnvironment;

        if (target_env) {
            // Reuse the cached global environment: Create the controller directly and instantly!
            ChildWebViewCompletedHandler* controllerHandler = new ChildWebViewCompletedHandler(self, true, target_env, disable_gpu);
            HRESULT hr = target_env->CreateCoreWebView2Controller(self->hwnd, controllerHandler);
            printf("[C++ DEBUG] (Environment Cached) CreateCoreWebView2Controller returned hr=0x%lX\n", hr);
            fflush(stdout);
            controllerHandler->Release();
            if (FAILED(hr)) {
                DestroyWindow(self->hwnd);
                delete self;
                return nullptr;
            }
        } else {
            // Fallback: Create environment asynchronously
            ChildWebViewCompletedHandler* handler = new ChildWebViewCompletedHandler(self, false, nullptr, disable_gpu);
            HRESULT hr = S_OK;
            if (disable_gpu) {
                std::wstring cpu_udf = GetCPU_UDFPath();
                CleanSavedPasswords(cpu_udf);
                hr = g_CreateCoreWebView2EnvironmentWithOptions(nullptr, cpu_udf.c_str(), nullptr, handler);
            } else {
                std::wstring normal_udf = GetNormalUDFPath();
                CleanSavedPasswords(normal_udf);
                hr = g_CreateCoreWebView2EnvironmentWithOptions(nullptr, normal_udf.c_str(), nullptr, handler);
            }
            printf("[C++ DEBUG] CreateCoreWebView2EnvironmentWithOptions returned hr=0x%lX\n", hr);
            fflush(stdout);
            handler->Release();

            if (FAILED(hr)) {
                DestroyWindow(self->hwnd);
                delete self;
                return nullptr;
            }
        }

        // Restore default arguments for subsequent operations
        SetEnvironmentVariableA("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist");

        return self;
    }

    __declspec(dllexport) void child_webview_destroy(void* handle) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (self->hwnd) {
            DestroyWindow(self->hwnd);
        }
        delete self;
    }

    __declspec(dllexport) void child_webview_set_bounds(void* handle, int x, int y, int w, int h, bool visible) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        self->last_x = x;
        self->last_y = y;
        self->last_w = w;
        self->last_h = h;
        self->last_visible = visible;
        printf("[C++ DEBUG] child_webview_set_bounds: handle=%p, x=%d, y=%d, w=%d, h=%d, visible=%d, controller=%p\n", handle, x, y, w, h, visible, self->controller);
        fflush(stdout);
        if (self->hwnd) {
            int target_x = x;
            int target_y = y;
            if (self->is_popup) {
                POINT pt = { x, y };
                HWND owner = GetWindow(self->hwnd, GW_OWNER);
                if (owner) {
                    ClientToScreen(owner, &pt);
                    target_x = pt.x;
                    target_y = pt.y;
                }
            }

            UINT flags = SWP_NOACTIVATE;
            flags |= (visible ? SWP_SHOWWINDOW : SWP_HIDEWINDOW);
            SetWindowPos(self->hwnd, HWND_TOP, target_x, target_y, w, h, flags);
            if (visible) {
                RedrawWindow(self->hwnd, NULL, NULL, RDW_INVALIDATE | RDW_UPDATENOW | RDW_ALLCHILDREN);
            }
            if (self->controller) {
                RECT r = { 0, 0, w, h };
                self->controller->put_Bounds(r);
                self->controller->put_IsVisible(visible ? TRUE : FALSE);
            }
        }
    }

    __declspec(dllexport) void child_webview_navigate(void* handle, const char* url) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (url) {
            int len = MultiByteToWideChar(CP_UTF8, 0, url, -1, NULL, 0);
            wchar_t* wurl = new wchar_t[len];
            MultiByteToWideChar(CP_UTF8, 0, url, -1, wurl, len);
            
            if (self->webview && self->is_initialized) {
                self->webview->Navigate(wurl);
            } else {
                self->pending_url = wurl;
            }
            delete[] wurl;
        }
    }

    __declspec(dllexport) HWND child_webview_get_hwnd(void* handle) {
        if (!handle) return NULL;
        ChildWebView* self = (ChildWebView*)handle;
        return self->hwnd;
    }

    typedef void(*CaptureCallback)(void* ctx, bool success, const char* json_str);

    class CallDevToolsProtocolMethodCompletedHandler : 
        public ICoreWebView2CallDevToolsProtocolMethodCompletedHandler {
    private:
        CaptureCallback m_callback;
        void* m_ctx;
        ULONG m_refCount = 1;
    public:
        CallDevToolsProtocolMethodCompletedHandler(CaptureCallback callback, void* ctx) : 
            m_callback(callback), m_ctx(ctx) {}

        static constexpr IID Local_IID_ICoreWebView2CallDevToolsProtocolMethodCompletedHandler = 
            { 0xe99fe902, 0x0d14, 0x11eb, { 0xad, 0xc1, 0x02, 0x42, 0xac, 0x12, 0x00, 0x02 } };

        HRESULT STDMETHODCALLTYPE QueryInterface(REFIID riid, void** ppvObject) override {
            if (!ppvObject) return E_POINTER;
            if (riid == IID_IUnknown || riid == Local_IID_ICoreWebView2CallDevToolsProtocolMethodCompletedHandler) {
                *ppvObject = this;
                AddRef();
                return S_OK;
            }
            *ppvObject = nullptr;
            return E_NOINTERFACE;
        }

        ULONG STDMETHODCALLTYPE AddRef() override {
            return InterlockedIncrement(&m_refCount);
        }

        ULONG STDMETHODCALLTYPE Release() override {
            ULONG count = InterlockedDecrement(&m_refCount);
            if (count == 0) {
                delete this;
            }
            return count;
        }

        HRESULT STDMETHODCALLTYPE Invoke(HRESULT errorCode, LPCWSTR returnObjectAsJson) override {
            if (SUCCEEDED(errorCode) && returnObjectAsJson) {
                int len = WideCharToMultiByte(CP_UTF8, 0, returnObjectAsJson, -1, NULL, 0, NULL, NULL);
                char* json_utf8 = new char[len];
                WideCharToMultiByte(CP_UTF8, 0, returnObjectAsJson, -1, json_utf8, len, NULL, NULL);
                m_callback(m_ctx, true, json_utf8);
                delete[] json_utf8;
            } else {
                m_callback(m_ctx, false, "{}");
            }
            return S_OK;
        }
    };

    __declspec(dllexport) void child_webview_capture_page(void* handle, bool full_page, int scroll_height, CaptureCallback callback, void* ctx) {
        if (!handle) {
            callback(ctx, false, "{}");
            return;
        }
        ChildWebView* self = (ChildWebView*)handle;
        if (!self->webview || !self->is_initialized) {
            callback(ctx, false, "{}");
            return;
        }
        std::wstring params = L"{}";
        if (full_page) {
            if (scroll_height > 0) {
                wchar_t buf[512];
                swprintf_s(buf, 512, L"{\"captureBeyondViewport\":true,\"fromSurface\":true,\"clip\":{\"x\":0,\"y\":0,\"width\":1280,\"height\":%d,\"scale\":1}}", scroll_height);
                params = buf;
            } else {
                params = L"{\"captureBeyondViewport\":true}";
            }
        }
        auto handler = new CallDevToolsProtocolMethodCompletedHandler(callback, ctx);
        HRESULT hr = self->webview->CallDevToolsProtocolMethod(L"Page.captureScreenshot", params.c_str(), handler);
        if (FAILED(hr)) {
            callback(ctx, false, "{}");
            handler->Release();
        }
    }

    __declspec(dllexport) void child_webview_add_init_script(void* handle, const char* script_utf8) {
        if (!handle || !script_utf8) return;
        ChildWebView* self = (ChildWebView*)handle;
        
        int len = MultiByteToWideChar(CP_UTF8, 0, script_utf8, -1, NULL, 0);
        wchar_t* wscript = new wchar_t[len];
        MultiByteToWideChar(CP_UTF8, 0, script_utf8, -1, wscript, len);
        
        if (!self->pending_init_script.empty()) {
            self->pending_init_script += L"\n;\n";
        }
        self->pending_init_script += wscript;
        
        if (self->webview) {
            self->webview->AddScriptToExecuteOnDocumentCreated(wscript, nullptr);
        }
        delete[] wscript;
    }

    __declspec(dllexport) void child_webview_execute_script(void* handle, const char* script_utf8, ExecuteScriptCallback callback, void* ctx) {
        printf("[C++ DEBUG] child_webview_execute_script: handle=%p, script=%.100s...\n", handle, script_utf8);
        if (!handle || !script_utf8) {
            callback(ctx, false, "{}");
            return;
        }
        ChildWebView* self = (ChildWebView*)handle;
        if (!self->webview || !self->is_initialized) {
            printf("[C++ DEBUG] child_webview_execute_script: webview initialized check failed! is_initialized=%d\n", self ? self->is_initialized : 0);
            callback(ctx, false, "{}");
            return;
        }
        int len = MultiByteToWideChar(CP_UTF8, 0, script_utf8, -1, NULL, 0);
        wchar_t* wscript = new wchar_t[len];
        MultiByteToWideChar(CP_UTF8, 0, script_utf8, -1, wscript, len);

        auto handler = new ExecuteScriptCompletedHandler(callback, ctx);
        HRESULT hr = self->webview->ExecuteScript(wscript, handler);
        delete[] wscript;
        if (FAILED(hr)) {
            printf("[C++ DEBUG] ExecuteScript failed with hr=0x%lx\n", hr);
            callback(ctx, false, "{}");
            handler->Release();
        }
    }

    __declspec(dllexport) void child_webview_open_devtools(void* handle) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (self->webview) {
            self->webview->OpenDevToolsWindow();
        }
    }

    __declspec(dllexport) void child_webview_clear_data(void* handle, const char* origin_utf8, const char* types_utf8) {
        if (!handle || !origin_utf8 || !types_utf8) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (!self->webview) return;

        std::string params = "{\"origin\":\"";
        params += origin_utf8;
        params += "\",\"storageTypes\":\"";
        params += types_utf8;
        params += "\"}";

        int len = MultiByteToWideChar(CP_UTF8, 0, params.c_str(), -1, NULL, 0);
        wchar_t* wparams = new wchar_t[len];
        MultiByteToWideChar(CP_UTF8, 0, params.c_str(), -1, wparams, len);

        self->webview->CallDevToolsProtocolMethod(L"Storage.clearDataForOrigin", wparams, nullptr);
        delete[] wparams;
    }

    __declspec(dllexport) void child_webview_set_message_callback(ChildWebviewMessageCallback cb) {
        g_message_callback = cb;
    }

    // WndProc for the standalone detached browser window frame
    LRESULT CALLBACK DetachedHostWndProc(HWND hwnd, UINT msg, WPARAM wp, LPARAM lparam) {
        ChildWebView* self = (ChildWebView*)GetWindowLongPtr(hwnd, GWLP_USERDATA);
        if (msg == WM_SIZE) {
            if (self && self->hwnd) {
                RECT r;
                GetClientRect(hwnd, &r);
                MoveWindow(self->hwnd, r.left, r.top, r.right - r.left, r.bottom - r.top, TRUE);
                if (self->controller) {
                    self->controller->put_Bounds(r);
                }
            }
            return 0;
        }
        if (msg == WM_CLOSE) {
            if (self && self->original_parent) {
                // Return to main layout window
                SetParent(self->hwnd, self->original_parent);
                self->controller->put_ParentWindow(self->original_parent);
                
                // Size it offscreen or to default bounds (Zig will reposition it on tab change)
                MoveWindow(self->hwnd, self->last_x, self->last_y, self->last_w, self->last_h, TRUE);
                
                HWND detached = self->detached_hwnd;
                self->detached_hwnd = nullptr;
                self->original_parent = nullptr;
                DestroyWindow(detached);

                // Notify Zig backend that this tab is re-attached
                if (g_message_callback) {
                    g_message_callback(self->key.c_str(), "{\"event\":\"detached-attached\"}");
                }
            }
            return 0;
        }
        return DefWindowProc(hwnd, msg, wp, lparam);
    }

    static void RegisterDetachedClass() {
        static bool registered = false;
        if (registered) return;
        WNDCLASSA wc = {};
        wc.lpfnWndProc = DetachedHostWndProc;
        wc.hInstance = GetModuleHandle(NULL);
        wc.lpszClassName = "DetachedWebViewClass";
        wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
        wc.hCursor = LoadCursor(NULL, IDC_ARROW);
        wc.hIcon = LoadIconA(GetModuleHandle(NULL), "IDI_ICON1");
        RegisterClassA(&wc);
        registered = true;
    }

    __declspec(dllexport) void child_webview_detach(void* handle, const char* title_utf8) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (self->detached_hwnd) return; // Already detached

        RegisterDetachedClass();
        self->original_parent = GetParent(self->hwnd);

        // Create standalone overlapped window matching standard browser style
        self->detached_hwnd = CreateWindowExA(
            WS_EX_APPWINDOW, "DetachedWebViewClass", title_utf8 ? title_utf8 : "OneView Detached Tab",
            WS_OVERLAPPEDWINDOW | WS_VISIBLE | WS_CLIPCHILDREN | WS_CLIPSIBLINGS,
            CW_USEDEFAULT, CW_USEDEFAULT, 1024, 768,
            nullptr, nullptr, GetModuleHandle(nullptr), nullptr
        );

        if (!self->detached_hwnd) return;

        SetWindowLongPtr(self->detached_hwnd, GWLP_USERDATA, (LONG_PTR)self);

        // Reparent container window to detached host
        SetParent(self->hwnd, self->detached_hwnd);
        self->controller->put_ParentWindow(self->detached_hwnd);

        // Resize webview child inside detached host client area
        RECT r;
        GetClientRect(self->detached_hwnd, &r);
        MoveWindow(self->hwnd, r.left, r.top, r.right - r.left, r.bottom - r.top, TRUE);
        if (self->controller) {
            self->controller->put_Bounds(r);
        }
    }

    __declspec(dllexport) void child_webview_go_back(void* handle) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (self && self->webview) {
            self->webview->GoBack();
        }
    }

    __declspec(dllexport) void child_webview_go_forward(void* handle) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (self && self->webview) {
            self->webview->GoForward();
        }
    }

    __declspec(dllexport) void child_webview_reload(void* handle) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (self && self->webview) {
            self->webview->Reload();
        }
    }

    __declspec(dllexport) void child_webview_pause_download(const char* id) {
        if (!id) return;
        std::lock_guard<std::mutex> lock(g_downloads_mutex);
        auto it = g_active_downloads.find(id);
        if (it != g_active_downloads.end()) {
            it->second->Pause();
        }
    }

    __declspec(dllexport) void child_webview_resume_download(const char* id) {
        if (!id) return;
        std::lock_guard<std::mutex> lock(g_downloads_mutex);
        auto it = g_active_downloads.find(id);
        if (it != g_active_downloads.end()) {
            it->second->Resume();
        }
    }

    __declspec(dllexport) void child_webview_cancel_download(const char* id) {
        if (!id) return;
        std::lock_guard<std::mutex> lock(g_downloads_mutex);
        auto it = g_active_downloads.find(id);
        if (it != g_active_downloads.end()) {
            it->second->Cancel();
            it->second->Release();
            g_active_downloads.erase(it);
        }
    }

    __declspec(dllexport) void child_webview_attach(void* handle) {
        if (!handle) return;
        ChildWebView* self = (ChildWebView*)handle;
        if (!self->detached_hwnd) return;

        // Post WM_CLOSE to the detached window. This will automatically execute the re-attach code
        PostMessageA(self->detached_hwnd, WM_CLOSE, 0, 0);
    }
}
