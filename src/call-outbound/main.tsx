// C:\pilot-tauri\nexus-call-hub\src\call-outbound\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import CallOutboundApp from "./CallOutboundApp.tsx"
import "../shared/globals.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CallOutboundApp />
    </React.StrictMode>,
)