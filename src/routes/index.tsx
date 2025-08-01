// src/routes/index.tsx
import React from "react"
import { useNavigate } from '@tanstack/react-router'
import { Button } from "@/shared/ui/button"

function LauncherPage() {
    const navigate = useNavigate()

    const handleLoginClick = () => {
        navigate({ to: '/login' })
    }

    const handleCallDashboardClick = () => {
        // 나중에 구현
        console.log('대시보드로 이동')
    }

    const handleStatsClick = () => {
        // 나중에 구현
        console.log('통계로 이동')
    }

    const handleSettingsClick = () => {
        // 나중에 구현
        console.log('설정으로 이동')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">N</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">Nexus Call Hub</h1>
                        <p className="text-xs text-gray-500">통합 상담 시스템</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="grid grid-cols-2 gap-4">
                        {/* 로그인 버튼 */}
                        <Button
                            className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-xl transition-all duration-200 group"
                            onClick={handleLoginClick}
                            variant="outline"
                        >
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-lg group-hover:bg-blue-200 transition-colors">
                                👤
                            </div>
                            <span className="text-sm font-medium text-gray-900">로그인</span>
                        </Button>

                        {/* 통화 대시보드 버튼 */}
                        <Button
                            className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-green-50 hover:border-green-200 border border-gray-200 rounded-xl transition-all duration-200 group"
                            onClick={handleCallDashboardClick}
                            variant="outline"
                        >
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-lg group-hover:bg-green-200 transition-colors">
                                📞
                            </div>
                            <span className="text-sm font-medium text-gray-900">통화</span>
                        </Button>

                        {/* 통계 버튼 */}
                        <Button
                            className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-orange-50 hover:border-orange-200 border border-gray-200 rounded-xl transition-all duration-200 group"
                            onClick={handleStatsClick}
                            variant="outline"
                        >
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-lg group-hover:bg-orange-200 transition-colors">
                                📊
                            </div>
                            <span className="text-sm font-medium text-gray-900">통계</span>
                        </Button>

                        {/* 환경설정 버튼 */}
                        <Button
                            className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50 hover:border-gray-300 border border-gray-200 rounded-xl transition-all duration-200 group"
                            onClick={handleSettingsClick}
                            variant="outline"
                        >
                            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center text-lg group-hover:bg-gray-200 transition-colors">
                                ⚙️
                            </div>
                            <span className="text-sm font-medium text-gray-900">설정</span>
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>시스템 정상</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>서버 연결됨</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// createFileRoute 제거하고 default export로 변경
export default LauncherPage