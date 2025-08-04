// C:\pilot-tauri\nexus-call-hub\src\settings\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SettingsApp from "./SettingsApp"
import "../index.css"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SettingsApp />
        </QueryClientProvider>
    </React.StrictMode>,
)