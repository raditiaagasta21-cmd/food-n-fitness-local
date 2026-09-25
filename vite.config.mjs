// Plain-JS copy of vite.config.ts so the build also works on machines where
// Vite cannot bundle the TypeScript config (seen on Windows).
// Vite loads vite.config.mjs before vite.config.ts, so this file wins.
// Keep both files in sync.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// ANDROID=1 builds a static SPA (dist/client/index.html) for Capacitor.
// Normal builds (published Lovable site) are unaffected.
const android = process.env["ANDROID"] === "1";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    ...(android ? { spa: { enabled: true, prerender: { outputPath: "/index.html" } } } : {}),
  },
});
