// C:\pilot-tauri\nexus-call-hub\src\call-outbound\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CallOutboundApp from "./CallOutboundApp.tsx"
import "../index.css"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <CallOutboundApp />
        </QueryClientProvider>
    </React.StrictMode>,
)