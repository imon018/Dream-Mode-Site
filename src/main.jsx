import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./context/SettingsContext";
import { checkForUpdate } from "./utils/updateChecker";

import App from "./App";
import "./index.css";
import "swiper/css";
import "swiper/css/pagination";

checkForUpdate();

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

