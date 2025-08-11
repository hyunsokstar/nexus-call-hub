// C:\nexus-call-hub\src\company-chat\main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import CompanyChatApp from './CompanyChatApp'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <CompanyChatApp />
        </QueryClientProvider>
    </React.StrictMode>,
)
