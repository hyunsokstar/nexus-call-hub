// C:\pilot-tauri\nexus-call-hub\src\widgets\CommonHeader\index.tsx
import { useUser } from "@/shared/hooks/useUser"
import { Button } from "@/shared/ui/button"
import { invoke } from "@tauri-apps/api/core"

interface CommonHeaderProps {
    title: string
    subtitle?: string
    icon?: string
    showBackButton?: boolean
    onBack?: () => void
    showLogout?: boolean
    customActions?: React.ReactNode
}

function CommonHeader({
    title,
    subtitle,
    icon = "📞",
    showBackButton = false,
    onBack,
    showLogout = true,
    customActions
}: Omit<CommonHeaderProps, 'user'>) {  // user prop 제거
    const { user, logout, isLoggingOut } = useUser(); // 🔐 새로운 useUser 훅 사용

    const handleBack = async () => {
        if (onBack) {
            onBack()
        } else {
            try {
            await invoke('switch_window', {
                fromLabel: window.location.pathname.split('/').pop()?.replace('.html', '') || 'unknown',
                toWindowType: 'Launcher'
            })
            } catch (error) {
                console.error('런처로 돌아가기 실패:', error)
            }
        }
    }

    const handleLogout = async () => {
        try {
            // 🔥 먼저 로그인 윈도우를 생성
            await invoke('open_window', {
                windowType: 'Login'
            })

            // 🔐 새로운 auth_state 기반 로그아웃
            await logout()

            // 🔥 현재 윈도우만 닫기
            const currentLabel = window.location.pathname.split('/').pop()?.replace('.html', '') || 'launcher'
            await invoke('close_window', {
                label: currentLabel
            })

        } catch (error) {
            console.error('로그아웃 실패:', error)
            try {
                await invoke('replace_all_windows', {
                    windowType: 'Login'
                })
            } catch (fallbackError) {
                console.error('로그인 윈도우 열기 실패:', fallbackError)
            }
        }
    }

    return (
        <header className="bg-[#55BEC8] border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
                {/* 왼쪽 영역 - 타이틀 */}
                <div className="flex items-center gap-3">
                    {showBackButton && (
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1 h-7"
                        >
                            ← 메인
                        </Button>
                    )}

                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                            <span className="text-white text-sm">{icon}</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-gray-600 -mt-0.5">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 오른쪽 영역 - 사용자 정보 */}
                <div className="flex items-center gap-3">
                    {customActions}

                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* 사용자 정보 */}
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">
                                    {user.department} · {user.role}
                                </p>
                            </div>

                            {/* 아바타 */}
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">
                                    {user.name?.[0] || '?'}
                                </span>
                            </div>

                            {/* 로그아웃 버튼 */}
                            {showLogout && (
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs px-3 py-1 h-7 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                                </Button>
                            )}
                        </div>
                    ) : (
                        // 로그인되지 않은 상태
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 text-sm">👤</span>
                            </div>
                            <span className="text-sm text-gray-500">로그인이 필요합니다</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default CommonHeader