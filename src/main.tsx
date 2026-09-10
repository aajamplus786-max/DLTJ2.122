
// =====================================================
// DLTJ2.1
// APPLICATION ENTRY
// FILE: src/main.tsx
// =====================================================

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { AuthProvider } from "./hooks/useAuth";
import { SettingsProvider } from "./setting/SettingsContext";

import "./index.css";
import "./App.css";

// =====================================================
// ROOT
// =====================================================

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>

    {/* =================================================
        AUTH PROVIDER
    ================================================= */}

    <AuthProvider>

      {/* =================================================
          SETTINGS PROVIDER
      ================================================= */}

      <SettingsProvider>

        <App />

      </SettingsProvider>

    </AuthProvider>

  </React.StrictMode>
);
