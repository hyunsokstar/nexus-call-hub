// C:\pilot-tauri\nexus-call-hub\src\launcher\LauncherApp.tsx
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/shared/ui/button"
import { useState, useEffect } from "react"
import LoginComponent from "./components/LoginComponent"

// 상담사용 앱들
const consultantApps = [
    {
        id: 'inbound',
        label: '인바운드 상담',
        icon: '📞',
        description: '고객 문의 자동 분배',
        windowType: 'CallInbound',
        color: 'blue'
    },
    {
        id: 'outbound',
        label: '아웃바운드 영업',
        icon: '📱',
        description: '캠페인 통화 실행',
        windowType: 'CallOutbound',
        color: 'green'
    },
    {
        id: 'queue-monitor',
        label: '실시간 대기열',
        icon: '⏳',
        description: '현재 대기 상황 모니터링',
        windowType: 'QueueMonitor',
        color: 'purple'
    }
]

// 관리/분석용 앱들
const managementApps = [
    {
        id: 'statistics',
        label: '통계 대시보드',
        icon: '📊',
        description: '상담 현황 분석',
        windowType: 'Statistics',
        color: 'orange'
    },
    {
        id: 'settings',
        label: '환경설정',
        icon: '⚙️',
        description: '시스템 설정',
        windowType: 'Settings',
        color: 'gray'
    }
]

interface User {
    id: string
    name: string
    department: string
    role: string
}

interface AppCardProps {
    app: {
        id: string
        label: string
        icon: string
        description: string
        windowType: string
        color: string
    }
}

function AppCard({ app }: AppCardProps) {
    const handleClick = async () => {
        try {
            await invoke('switch_window', {
                fromLabel: 'launcher',
                toWindowType: app.windowType
            })
        } catch (error) {
            console.error(`${app.label} 윈도우 전환 실패:`, error)
        }
    }

    const colorClasses = {
        blue: 'hover:bg-blue-50 hover:border-blue-200 bg-blue-100 text-blue-600 group-hover:bg-blue-200',
        green: 'hover:bg-green-50 hover:border-green-200 bg-green-100 text-green-600 group-hover:bg-green-200',
        purple: 'hover:bg-purple-50 hover:border-purple-200 bg-purple-100 text-purple-600 group-hover:bg-purple-200',
        orange: 'hover:bg-orange-50 hover:border-orange-200 bg-orange-100 text-orange-600 group-hover:bg-orange-200',
        gray: 'hover:bg-gray-50 hover:border-gray-300 bg-gray-100 text-gray-600 group-hover:bg-gray-200'
    }

    const hoverClass = colorClasses[app.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')
    const iconClass = colorClasses[app.color as keyof typeof colorClasses].split(' ').slice(2).join(' ')

    return (
        <Button
            className={`h-32 flex flex-col items-center justify-center gap-3 bg-white ${hoverClass} border border-gray-200 rounded-xl transition-all duration-200 group`}
            onClick={handleClick}
            variant="outline"
        >
            <div className={`w-12 h-12 ${iconClass} rounded-lg flex items-center justify-center text-xl transition-colors`}>
                {app.icon}
            </div>
            <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{app.label}</div>
                <div className="text-xs text-gray-500 mt-1">{app.description}</div>
            </div>
        </Button>
    )
}

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

        // 이벤트 리스너 등록
        // (기존 이벤트 리스너 코드...)
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

    // 로그인 전에는 LoginComponent 표시
    if (!isLoggedIn) {
        return <LoginComponent onLoginSuccess={handleLoginSuccess} />
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header with User Info */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">N</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">Nexus Call Hub</h1>
                            <p className="text-xs text-gray-500">통합 상담 시스템</p>
                        </div>
                    </div>

                    {/* User Info */}
                    {user && (
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.department} · {user.role}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">
                                    {user.name[0]}
                                </span>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="ml-2 text-xs px-3 py-1 h-7"
                            >
                                로그아웃
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">어플리케이션 선택</h2>
                        <p className="text-sm text-gray-600">원하는 작업 모드를 선택하세요</p>
                    </div>

                    {/* 상담 앱들 */}
                    <section className="mb-8">
                        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            상담 업무
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {consultantApps.map(app => (
                                <AppCard key={app.id} app={app} />
                            ))}
                        </div>
                    </section>

                    {/* 관리 앱들 */}
                    <section>
                        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            관리 도구
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {managementApps.map(app => (
                                <AppCard key={app.id} app={app} />
                            ))}
                        </div>
                    </section>
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
                        {user && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                <span>로그인: {user.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LauncherApp