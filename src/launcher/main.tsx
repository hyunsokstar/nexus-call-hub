// C:\pilot-tauri\nexus-call-hub\src\launcher\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LauncherApp from "./LauncherApp"
import { queryClient } from "./lib/queryclient"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <LauncherApp />
            {/* 개발 환경에서만 DevTools 표시 */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>,

)