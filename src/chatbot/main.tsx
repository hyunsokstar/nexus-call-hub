// C:\pilot-tauri\nexus-call-hub\src\chatbot\main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../index.css'
import ChatBotApp from './ChatBotApp'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ChatBotApp />
        </QueryClientProvider>
    </React.StrictMode>,
)
