// C:\pilot-tauri\nexus-call-hub\src\launcher\LauncherApp.tsx
import { invoke } from "@tauri-apps/api/core"
import { useState, useEffect } from "react"
import LoginComponent from "./components/LoginComponent"
import AppSelectionComponent from "./components/AppSelectionComponent"
import { User } from "./api/types"

function LauncherApp() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // 기존 로그인 상태 확인
        const checkLoginStatus = async () => {
            try {
                const userData = await invoke('get_user')
                if (userData) {
                    setUser(userData as User)
                    setIsLoggedIn(true)
                }
            } catch (error) {
                console.log("기존 로그인 정보 없음")
            }
        }

        checkLoginStatus()
    }, [])

    // 로그인 성공 핸들러
    const handleLoginSuccess = (userData: User) => {
        setUser(userData)
        setIsLoggedIn(true)
    }

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            await invoke('logout_user')
            setUser(null)
            setIsLoggedIn(false)
        } catch (error) {
            console.error("로그아웃 실패:", error)
        }
    }

    // 분기 처리
    if (!isLoggedIn) {
        return <LoginComponent onLoginSuccess={handleLoginSuccess} />
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    return <AppSelectionComponent user={user} onLogout={handleLogout} />
}

export default LauncherApp