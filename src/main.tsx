import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const bootstrap = async () => {
  const ready = window.__APP_CONFIG_READY__;
  if (ready && typeof ready.then === "function") {
    try {
      await ready;
    } catch {
      // Ignore config probe failures, fall back to configured defaults.
    }
  }

  createRoot(document.getElementById("root")!).render(<App />);
};

bootstrap();
