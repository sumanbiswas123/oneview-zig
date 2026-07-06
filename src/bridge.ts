/**
 * React / TypeScript Hooks & Client Bridge for Vercel zero-native.
 * Exposes a standard route caller interface matching Electron's IPC semantics.
 */

export interface ZeroBridgeResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

declare global {
  interface Window {
    zero?: {
      invoke: (command: string, payload?: any) => Promise<any>;
    };
  }
}

/**
 * High-performance JSON-RPC bridge client to communicate with the Zig backend.
 */
export const zeroBridge = {
  /**
   * Invokes a registered native command in the Zig main loop.
   */
  async invoke<T = any>(command: string, payload: any = {}): Promise<T> {
    if (window.zero && typeof window.zero.invoke === "function") {
      return window.zero.invoke(command, payload);
    }
    console.warn(`[Zero-Native Bridge] zero.invoke not found for command: ${command}`);
    throw new Error("zero-native runtime bridge is not available.");
  },

  /**
   * Triggers native decompression (unzip) of an app bundle zip archive.
   */
  async triggerUnzip(zipPath: string, extractPath: string): Promise<ZeroBridgeResponse> {
    return this.invoke("trigger_unzip", { zipPath, extractPath });
  },

  /**
   * Securely saves encrypted credentials using native std.crypto.
   */
  async saveCredentials(username: string, password: string, service = "oneview"): Promise<ZeroBridgeResponse> {
    return this.invoke("save_credentials", { service, username, password });
  },

  /**
   * Fetches local tickets dashboard statistics and queue details.
   */
  async fetchTickets(): Promise<{ tickets: any[] }> {
    return this.invoke("fetch_tickets");
  }
};
