// C:\pilot-tauri\nexus-call-hub\src\queue-monitor\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "../index.css"
import QueueMonitorApp from "./QueueMonitorApp"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <QueueMonitorApp />
        </QueryClientProvider>
    </React.StrictMode>,
)