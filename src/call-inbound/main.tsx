// C:\pilot-tauri\nexus-call-hub\src\call-inbound\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CallInboundApp from "./CallInboundApp"
import "../index.css"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <CallInboundApp />
        </QueryClientProvider>
    </React.StrictMode>,
)