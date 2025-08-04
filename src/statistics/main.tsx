// C:\pilot-tauri\nexus-call-hub\src\statistics\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import StatisticsApp from "./StatisticsApp"
import "../index.css"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <StatisticsApp />
        </QueryClientProvider>
    </React.StrictMode>,
)