// C:\pilot-tauri\nexus-call-hub\src\call-inbound\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
// import "../shared/globals.css"
import CallInboundApp from "./CallInboundApp"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <CallInboundApp />
    </React.StrictMode>,
)