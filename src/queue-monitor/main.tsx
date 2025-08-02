// C:\pilot-tauri\nexus-call-hub\src\queue-monitor\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import "../shared/globals.css"
import QueueMonitorApp from "./QueueMonitorApp"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueueMonitorApp />
    </React.StrictMode>,
)