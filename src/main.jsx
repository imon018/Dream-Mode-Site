import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./context/SettingsContext";
import { checkForUpdate } from "./utils/updateChecker";
import { getNativeUpdatePath } from "./utils/nativeUpdater";
import { Capacitor } from "@capacitor/core";

import App from "./App";
import "./index.css";
import "swiper/css";
import "swiper/css/pagination";

async function initApp() {

  if (Capacitor.isNativePlatform()) {

    const updatePath =
      await getNativeUpdatePath();

    if (updatePath) {

      console.log(
        "Using updated frontend:",
        updatePath
      );

      window.location.replace(updatePath);

      return;
    }
  }


  checkForUpdate();

}


initApp();

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

