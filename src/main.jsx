import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { FitnessProvider } from "./context/FitnessContext.jsx";
import "./index.css";

async function clearLegacyFitVerseCaches() {
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("fitverse-") && !key.includes("v2-1")).map((key) => caches.delete(key)));
  }
}

if ("serviceWorker" in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
    clearLegacyFitVerseCaches().catch(() => {});
  } else {
    window.addEventListener("load", async () => {
      await clearLegacyFitVerseCaches().catch(() => {});
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js?v=2.1.0`).catch(() => {});
    });
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FitnessProvider>
      <App />
    </FitnessProvider>
  </React.StrictMode>,
);
