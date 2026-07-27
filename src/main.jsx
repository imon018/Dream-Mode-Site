import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./context/SettingsContext";
import { runUpdateManager } from "./utils/updateManager";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

import App from "./App";
import "./index.css";
import "swiper/css";
import "swiper/css/pagination";

async function initApp() {

  if (Capacitor.isNativePlatform()) {

    const updatePath =
      await runUpdateManager();


    if (updatePath) {

      console.log(
        "Loading updated frontend:",
        updatePath
      );


      window.location.replace(
        updatePath
      );

      return;
    }
  }

}

initApp();


if (Capacitor.isNativePlatform()) {

  CapacitorApp.addListener(
    "resume",
    async () => {

      const updatePath =
        await runUpdateManager();

      if (updatePath) {

        window.location.replace(
          updatePath
        );

      }

    }
  );

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

