import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { User } from '../api/types';

export function useUser() {
    const queryClient = useQueryClient();

    // 🔐 사용자 정보 조회 (AuthState 사용)
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<User | null> => {
            return await invoke('get_user_state');
        },
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000,   // 10분
        retry: 1, // 재시도 횟수 제한
    });

    // 🔐 로그아웃 (AuthState 사용)
    const logoutMutation = useMutation({
        mutationFn: async (): Promise<void> => {
            await invoke('logout_user');
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    // 🔐 권한 확인
    const checkPermission = async (permission: string): Promise<boolean> => {
        try {
            return await invoke('check_permission', { permission });
        } catch (error) {
            console.error('권한 확인 실패:', error);
            return false;
        }
    };

    // 🔐 인증 상태 확인
    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            return await invoke('is_authenticated');
        } catch (error) {
            console.error('인증 상태 확인 실패:', error);
            return false;
        }
    };

    // 🔐 사용자 정보 새로고침
    const refreshUser = () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
    };

    return {
        // 데이터
        user: userQuery.data || null,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
        error: userQuery.error,

        // 액션
        logout: logoutMutation.mutateAsync,
        checkPermission,
        checkAuthStatus,
        refreshUser,

        // 상태
        isLoggedIn: !!userQuery.data,
        isLoggingOut: logoutMutation.isPending,
    };
}