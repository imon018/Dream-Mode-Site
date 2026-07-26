import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./context/SettingsContext";
import { CapacitorUpdater } from "@capgo/capacitor-updater";

import App from "./App";
import "./index.css";
import "swiper/css";
import "swiper/css/pagination";


CapacitorUpdater.notifyAppReady()
  .then(() => {
    console.log("Capgo App Ready");
  })
  .catch((err) => {
    console.log("Capgo Error:", err);
  });


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

