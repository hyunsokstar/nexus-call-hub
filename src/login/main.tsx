// C:\pilot-tauri\nexus-call-hub\src\login\main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LoginApp from "./LoginApp"
import { queryClient } from "@/shared/lib/queryClient"
import '../index.css' // ✅ Tailwind CSS 로드

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <LoginApp />
            {/* 개발 환경에서만 DevTools 표시 */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>,
)