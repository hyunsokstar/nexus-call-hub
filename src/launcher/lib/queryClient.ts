// C:\pilot-tauri\nexus-call-hub\src\launcher\lib\queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5분
            gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
            retry: (failureCount, error: any) => {
                // 401, 403 에러는 재시도하지 않음
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    return false
                }
                return failureCount < 3
            },
        },
        mutations: {
            retry: false,
        },
    },
})