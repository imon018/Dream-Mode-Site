import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "favicon.svg",
 			  "favicon-96x96.png",
        "apple-touch-icon.png",
      ],

      manifest: {
        name: "Dream Mode",
        short_name: "Dream Mode",
        description: "Dream Mode Shopping App",
        theme_color: "#6d28d9",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",

        icons: [
  {
    src: "/android-chrome-192x192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/android-chrome-512x512.png",
    sizes: "512x512",
    type: "image/png",
  },
  {
    src: "/android-chrome-512x512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
],
      },
    }),
  ],
});

