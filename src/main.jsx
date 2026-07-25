import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./context/SettingsContext";
import { registerSW } from "virtual:pwa-register";

import App from "./App";
import "./index.css";
import "swiper/css";
import "swiper/css/pagination";


window.deferredPrompt = null;

window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    window.deferredPrompt = e;

  }
);

window.addEventListener(
  "appinstalled",
  () => {

    window.deferredPrompt = null;

    console.log("Dream Mode installed");

  }
);



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

registerSW({
  immediate: true,
});
