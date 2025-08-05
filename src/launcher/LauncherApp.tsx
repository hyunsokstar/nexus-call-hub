// C:\pilot-tauri\nexus-call-hub\src\launcher\LauncherApp.tsx
import { useUser } from "@/shared/hooks/useUser"
import LoginComponent from "../widgets/LoginForm/LoginComponent"
import AppSelectionComponent from "./components/AppSelectionComponent"
import { User } from "../shared/api/types"

function LauncherApp() {
    const { user, isLoading } = useUser();

    // 🔧 로그인 성공 핸들러 (LoginComponent용)
    const handleLoginSuccess = async (userData: User) => {
        try {
            // useUser 훅이 자동으로 감지해서 업데이트됨
            console.log('✅ 로그인 성공:', userData.name);
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

    // 🔧 로그인되지 않은 상태
    if (!user) {
        return <LoginComponent onLoginSuccess={handleLoginSuccess} />
    }

    // 🔧 로그인된 상태 - props 제거
    return <AppSelectionComponent />
}

export default LauncherApp