import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./context/SettingsContext";
import { runUpdateManager } from "./utils/updateManager";
import { pushDebugLog } from "./utils/debugOverlay";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

import App from "./App";
import "./index.css";
import "swiper/css";
import "swiper/css/pagination";

// Guards against the launch check and a "resume" event firing the
// update flow at the same time (e.g. user switches away and back
// while the initial check is still running). Without this, two
// downloads/extractions could race each other and stomp on the same
// files, which is one of the ways the white-screen glitch happened.
let updateInProgress = false;

async function applyUpdateIfAvailable() {
  if (updateInProgress) return;
  updateInProgress = true;

  try {
    const updatePath = await runUpdateManager();

    if (updatePath) {
      pushDebugLog("main.jsx: navigating to " + updatePath + " ...");
      window.location.replace(updatePath);
    }
  } finally {
    updateInProgress = false;
  }
}

if (Capacitor.isNativePlatform()) {
  // Fire-and-forget: check for an update in the background. The
  // bundled UI below renders immediately regardless, so a slow or
  // failed network check can no longer hang the first screen - it
  // will only ever redirect if an update actually applies.
  applyUpdateIfAvailable();

  CapacitorApp.addListener("resume", () => {
    applyUpdateIfAvailable();
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <SettingsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SettingsProvider>
    </HelmetProvider>
  </React.StrictMode>
);
