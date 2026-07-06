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
        devrunner: resolve(
          __dirname,
          "src/pages/dev-runner/dev-runner.html",
        ),
        devproject: resolve(
          __dirname,
          "src/pages/dev-project/dev-project.html",
        ),
        detachedbrowser: resolve(
          __dirname,
          "src/pages/detached-browser/index.html",
        ),
        runner: resolve(__dirname, "src/pages/runner/runner.html"),
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
          src: "assets/**/*",
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
