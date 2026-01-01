import "./global.css";
import "./config/i18n"; // Initialize i18n before app renders
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);
root.render(<App />);
