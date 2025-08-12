// C:\nexus-call-hub\src\shared\hooks\useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { User } from '../api/types';
import { setAuthToken, clearAuthToken } from '../auth/token';

const USER_STORAGE_KEY = 'auth_user';

function getStoredUser(): User | null {
    try {
        const raw = localStorage.getItem(USER_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

function setStoredUser(user: User | null) {
    try {
        if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        else localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
        // ignore storage errors
    }
}

export function useUser() {
    const queryClient = useQueryClient();

    // 🔐 사용자 정보 조회 (AuthState 사용) + 로컬 스토리지 동기화
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<User | null> => {
            return await invoke('get_user_state');
        },
        initialData: getStoredUser(),
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000,   // 10분
        retry: 1, // 재시도 횟수 제한
    });

    // 데이터 변화에 따라 로컬 스토리지/토큰 동기화
    useEffect(() => {
        const user = userQuery.data as User | null | undefined;
        setStoredUser(user ?? null);
        const token = (user as any)?.token as string | undefined;
        if (token) setAuthToken(token); else clearAuthToken();
    }, [userQuery.data]);

    // 🔐 로그아웃 (AuthState 사용) + 로컬 스토리지 정리
    const logoutMutation = useMutation({
        mutationFn: async (): Promise<void> => {
            await invoke('logout_user');
        },
        onSuccess: () => {
            clearAuthToken();
            setStoredUser(null);
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