// C:\pilot-tauri\nexus-call-hub\src\call-inbound\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import CallInboundApp from "./CallInboundApp"
import "../shared/globals.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CallInboundApp />
    </React.StrictMode>,
)