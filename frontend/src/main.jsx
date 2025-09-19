import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Global CSS (keep exactly what you have installed)
import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/core/dist/css/tabler-vendors.min.css";
import "./tabler-theme.css";
import "./styles.css";

const root = document.getElementById("root");
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// helpful: log any silent errors
window.addEventListener("error", (e) => console.error("window.onerror:", e.error || e.message));
window.addEventListener("unhandledrejection", (e) => console.error("unhandledrejection:", e.reason));
