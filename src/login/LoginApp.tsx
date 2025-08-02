// C:\pilot-tauri\nexus-call-hub\src\login\LoginApp.tsx
import { useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/shared/ui/button"

function LoginApp() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // 로그인 로직 (추후 구현)
            console.log("로그인 시도:", credentials)

            // 성공시 런처로 전환
            await invoke('switch_window', {
                fromLabel: 'login',
                toWindowType: 'Launcher'
            })
        } catch (error) {
            console.error("로그인 실패:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = async () => {
        try {
            await invoke('switch_window', {
                fromLabel: 'login',
                toWindowType: 'Launcher'
            })
        } catch (error) {
            console.error("취소 실패:", error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* 로고 섹션 */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">N</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Nexus Call Hub</h1>
                    <p className="text-gray-600">통합 상담 시스템에 로그인하세요</p>
                </div>

                {/* 로그인 폼 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                사용자명
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="사용자명을 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-4 py-3 border