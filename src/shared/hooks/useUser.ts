// C:\nexus-call-hub\src\shared\hooks\useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
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

    // 🔐 사용자 정보 조회 (auth_state.rs 시스템 활용)
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<User | null> => {
            try {
                // auth_state.rs의 get_user_state 활용
                const tauriUser = await invoke('get_user_state');
                if (tauriUser) {
                    console.log('✅ Tauri AuthState에서 사용자 정보 조회:', tauriUser);
                    return tauriUser as User;
                }
            } catch (error) {
                console.warn('⚠️ Tauri AuthState 조회 실패, 로컬 스토리지 시도:', error);
            }

            // Tauri AuthState에 없으면 로컬 스토리지에서 시도
            const localUser = getStoredUser();
            if (localUser) {
                console.log('✅ 로컬 스토리지에서 사용자 정보 조회:', localUser);
                // 로컬 스토리지에 있으면 Tauri AuthState에도 저장
                try {
                    await invoke('set_user_state', { user: localUser });
                    console.log('✅ 로컬 스토리지 → Tauri AuthState 동기화 완료');
                } catch (syncError) {
                    console.warn('⚠️ Tauri AuthState 동기화 실패:', syncError);
                }
                return localUser;
            }

            return null;
        },
        initialData: getStoredUser(),
        staleTime: 1000, // 1초로 줄여서 더 자주 확인
        gcTime: 10 * 60 * 1000,   // 10분
        retry: 1, // 재시도 횟수 제한
        refetchOnWindowFocus: true, // 윈도우 포커스 시 재조회
        refetchOnMount: true, // 마운트 시 재조회
    });

    // 🔐 auth_state.rs 이벤트 리스너 설정
    useEffect(() => {
        const setupEventListeners = async () => {
            try {
                // 로그인 이벤트 리스너
                const unlistenLogin = await listen('user-logged-in', (event) => {
                    console.log('🔔 사용자 로그인 이벤트 수신:', event.payload);
                    const user = event.payload as User;
                    queryClient.setQueryData(['user'], user);
                    setStoredUser(user);
                    if (user.token) setAuthToken(user.token);
                });

                // 로그아웃 이벤트 리스너
                const unlistenLogout = await listen('user-logged-out', () => {
                    console.log('🔔 사용자 로그아웃 이벤트 수신');
                    queryClient.setQueryData(['user'], null);
                    setStoredUser(null);
                    clearAuthToken();
                });

                return () => {
                    unlistenLogin();
                    unlistenLogout();
                };
            } catch (error) {
                console.error('이벤트 리스너 설정 실패:', error);
            }
        };

        const cleanup = setupEventListeners();
        return () => {
            cleanup.then(fn => fn && fn());
        };
    }, [queryClient]);

    // 데이터 변화에 따라 로컬 스토리지/토큰 동기화
    useEffect(() => {
        const user = userQuery.data as User | null | undefined;
        setStoredUser(user ?? null);
        const token = (user as any)?.token as string | undefined;
        if (token) setAuthToken(token); else clearAuthToken();
    }, [userQuery.data]);

    // 🔐 로그아웃 (auth_state.rs 시스템 활용)
    const logoutMutation = useMutation({
        mutationFn: async (): Promise<void> => {
            await invoke('logout_user');
        },
        onSuccess: () => {
            // 이벤트 리스너가 자동으로 처리하므로 여기서는 추가 작업 불필요
            console.log('✅ 로그아웃 처리 완료');
        },
    });

    // 🔐 권한 확인 (auth_state.rs 시스템 활용)
    const checkPermission = async (permission: string): Promise<boolean> => {
        try {
            return await invoke('check_permission', { permission });
        } catch (error) {
            console.error('권한 확인 실패:', error);
            return false;
        }
    };

    // 🔐 인증 상태 확인 (auth_state.rs 시스템 활용)
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