import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CopilotKit } from "@copilotkit/react-core";

createRoot(document.getElementById("root")).render(
  <CopilotKit runtimeUrl="https://copilotkit-taskmanager.onrender.com/copilotkit">
    <App />
  </CopilotKit>
);
