import React from "react";
import ReactDOM from "react-dom/client";
import "../launcher.css";
import LauncherApp from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <LauncherApp />
    </React.StrictMode>,
);