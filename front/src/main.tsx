import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UiProvider } from "./context/uiContext";
import { AuthProvider } from "./context/authContext";
import App from "./App.tsx";
import "./index.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UiProvider>
          <App />
        </UiProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
