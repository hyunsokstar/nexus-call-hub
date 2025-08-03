// C:\pilot-tauri\nexus-call-hub\src\shared\hooks\useLogout.ts
import { useMutation } from '@tanstack/react-query'
import { invoke } from '@tauri-apps/api/core'

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            // Tauri 백엔드에 로그아웃 요청
            await invoke('logout_user')
        },
        onSuccess: () => {
            console.log('✅ 로그아웃 성공')
            // 추가적인 정리 작업이 필요하면 여기서 수행
            // 예: 로컬 캐시 정리, 타이머 정리 등
        },
        onError: (error) => {
            console.error('❌ 로그아웃 실패:', error)
        }
    })
}