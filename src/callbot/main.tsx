// C:\pilot-tauri\nexus-call-hub\src\callbot\main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CallBotApp from './CallBotApp'
import '../index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <CallBotApp />
        </QueryClientProvider>
    </React.StrictMode>,
)
