import "@fontsource-variable/inter";
import "@fontsource/noto-sans-ethiopic/400.css";
import "@fontsource/noto-sans-ethiopic/600.css";
import "@fontsource/noto-sans-ethiopic/700.css";
import "./index.css";
import "./i18n";
import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./socket/callManager";
import { ErrorBoundary } from "./components/ErrorBoundary";

const root = document.getElementById("root");
if (!root) throw new Error("root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Tooltip.Provider delayDuration={350} skipDelayDuration={100}>
        <App />
      </Tooltip.Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
