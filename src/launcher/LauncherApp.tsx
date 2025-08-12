// C:\pilot-tauri\nexus-call-hub\src\launcher\LauncherApp.tsx
import { useUser } from "@/shared/hooks/useUser"
import { useEffect } from "react"
import { listen } from "@tauri-apps/api/event"
import LoginComponent from "../widgets/LoginForm/LoginComponent"
import AppSelectionComponent from "./components/AppSelectionComponent"
import { User } from "../shared/api/types"

function LauncherApp() {
    const { user, isLoading, refreshUser } = useUser();

    // 🔧 auth_state.rs 이벤트 리스너 및 초기화
    useEffect(() => {
        // 컴포넌트 마운트 시 사용자 정보 새로고침
        refreshUser();

        // auth_state.rs의 로그인 이벤트 리스너
        const setupEventListeners = async () => {
            try {
                const unlistenLogin = await listen('user-logged-in', (event) => {
                    console.log('🔔 런처 - 로그인 이벤트 수신:', event.payload);
                    // useUser 훅이 자동으로 업데이트하므로 추가 작업 불필요
                });

                return unlistenLogin;
            } catch (error) {
                console.error('런처 - 이벤트 리스너 설정 실패:', error);
            }
        };

        const cleanup = setupEventListeners();
        return () => {
            cleanup.then(fn => fn && fn());
        };
    }, [refreshUser]);

    // 🔧 로그인 성공 핸들러 (LoginComponent용)
    const handleLoginSuccess = async (userData: User) => {
        try {
            console.log('✅ 런처 - 로그인 성공:', userData.name);
            
            // auth_state.rs 이벤트가 자동으로 상태를 업데이트하므로
            // 여기서는 추가 작업이 불필요
            
        } catch (error) {
            console.error('❌ 로그인 후 처리 실패:', error);
        }
    };

    // 🔧 로딩 상태
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    console.log('🔍 런처 - 현재 사용자 상태:', { user, isLoading });

    // 🔧 로그인되지 않은 상태
    if (!user) {
        return <LoginComponent onLoginSuccess={handleLoginSuccess} />
    }

    // 🔧 로그인된 상태 - auth_state.rs와 연동된 상태
    return <AppSelectionComponent />
}

export default LauncherApp