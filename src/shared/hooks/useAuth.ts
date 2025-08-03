// C:\pilot-tauri\nexus-call-hub\src\launcher\hooks\useAuth.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { loginApi, getCurrentUserApi, validateTokenApi } from '../api/auth'
import { LoginRequest, User } from '../api/types'
import { invoke } from '@tauri-apps/api/core'

// 로그인 뮤테이션
export const useLogin = () => {
    return useMutation({
        mutationFn: loginApi,
        onSuccess: async (data) => {
            if (data.success && data.data) {
                // 백엔드 응답을 Tauri State 형식으로 변환
                const user: User = {
                    id: data.data.username, // 임시로 username을 id로 사용
                    name: data.data.username,
                    department: '고객상담팀', // 추후 백엔드에서 받아올 예정
                    role: '상담원', // 추후 백엔드에서 받아올 예정
                    token: data.data.token
                }

                // Tauri State에 사용자 정보 저장
                await invoke('login_user', { user })

                console.log('로그인 성공 및 Tauri State 저장 완료')
            }
        },
        onError: (error) => {
            console.error('로그인 실패:', error)
        }
    })
}

// 현재 사용자 정보 조회 쿼리
export const useCurrentUser = (token?: string) => {
    return useQuery({
        queryKey: ['currentUser', token],
        queryFn: () => getCurrentUserApi(token!),
        enabled: !!token, // 토큰이 있을 때만 실행
        staleTime: 1000 * 60 * 5, // 5분간 캐시
        retry: false
    })
}

// 토큰 유효성 검증 쿼리
export const useValidateToken = (token?: string) => {
    return useQuery({
        queryKey: ['validateToken', token],
        queryFn: () => validateTokenApi(token!),
        enabled: !!token,
        staleTime: 1000 * 60 * 2, // 2분간 캐시
        retry: false
    })
}

// Tauri State에서 사용자 정보 가져오기 훅
export const useTauriUser = () => {
    return useQuery({
        queryKey: ['tauriUser'],
        queryFn: async () => {
            try {
                const userData = await invoke('get_user')
                return userData as User | null
            } catch (error) {
                console.log('저장된 사용자 정보 없음')
                return null
            }
        },
        staleTime: 1000 * 60 * 10, // 10분간 캐시
    })
}