const { defineConfig } = require("vite");
const { resolve } = require("path");
const { viteStaticCopy } = require("vite-plugin-static-copy");

module.exports = defineConfig({
  root: resolve(__dirname, "src"),
  base: "./",
  build: {
    outDir: resolve(__dirname, "../ui"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dashboard: resolve(
          __dirname,
          "src/pages/dashboard/dashboard.html",
        ),
        view: resolve(__dirname, "src/pages/view/view.html"),

        appstore: resolve(
          __dirname,
          "src/pages/appstore/appstore.html",
        ),
        login: resolve(__dirname, "src/pages/login/index.html"),
        devproject: resolve(
          __dirname,
          "src/pages/dev-project/dev-project.html",
        ),
        detachedbrowser: resolve(
          __dirname,
          "src/pages/detached-browser/index.html",
        ),
        updateprompt: resolve(__dirname, "src/pages/update-prompt/index.html"),
        updatehelper: resolve(
          __dirname,
          "src/pages/update-helper/index.html",
        ),
      },
    },
    target: "chrome130",
    minify: true,
    esbuild: {
      drop: ["console", "debugger"],
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: [
            "assets/**/*",
            // Fonts — handled by Vite via relative CSS urls
            "!assets/fonts",
            "!assets/fonts/**",
            // Orphaned / dev-only files — not referenced anywhere
            "!assets/ov-icon-dev.ico",
            "!assets/ov-icon-dev.webp",
            "!assets/ov-icon_old.webp",
            "!assets/hogarth-logo.webp",
            "!assets/home-button-1.webp",
            "!assets/home-button-2.webp",
            // Images imported via ES module in tickets.js — Vite hashes these
            "!assets/jira-icon.webp",
            "!assets/veeva-binder-icon.webp",
            "!assets/veeva-icon.webp",
            // Images referenced via new URL() in dashboard.js / view.js — Vite hashes these
            "!assets/contentgen.webp",
            "!assets/contentgen-dark.webp",
            // Background referenced via relative URL in dev-project.css — Vite hashes it
            "!assets/background.webp",
          ],
          dest: "assets",
        },
        {
          src: "lib/webview-preload.js",
          dest: "lib",
        },
      ],
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
