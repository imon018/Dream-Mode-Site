import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";

// Read the version straight from package.json so it can be baked into
// the client bundle at build time. This is the single source of truth
// for the app's version - nothing else needs to be edited by hand
// before a release.
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
