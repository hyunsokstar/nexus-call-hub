// C:\pilot-tauri\nexus-call-hub\src\widgets\CommonHeader\index.tsx
import { User } from "@/shared/api/types"
import { useLogout } from "@/shared/hooks/useLogout"
import { Button } from "@/shared/ui/button"
import { invoke } from "@tauri-apps/api/core"

interface CommonHeaderProps {
    title: string
    subtitle?: string
    icon?: string
    user?: User | null
    showBackButton?: boolean
    onBack?: () => void
    showLogout?: boolean
    customActions?: React.ReactNode
}

function CommonHeader({
    title,
    subtitle,
    icon = "📞",
    user,
    showBackButton = false,
    onBack,
    showLogout = true,
    customActions
}: CommonHeaderProps) {
    const logoutMutation = useLogout()

    const handleBack = async () => {
        if (onBack) {
            onBack()
        } else {
            // 기본적으로 런처로 돌아가기
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

            // 그 다음 로그아웃 처리
            await logoutMutation.mutateAsync()

            // 🔥 현재 윈도우만 닫기 (모든 윈도우 닫지 않음)
            const currentLabel = window.location.pathname.split('/').pop()?.replace('.html', '') || 'launcher'
            await invoke('close_window', {
                label: currentLabel
            })

        } catch (error) {
            console.error('로그아웃 실패:', error)
            // 에러 발생시 최소한 로그인 윈도우는 열어주기
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
        <header className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
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
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{icon}</span>
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
                            {subtitle && (
                                <p className="text-xs text-gray-500">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {customActions}

                    {user && (
                        <>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.department} · {user.role}</p>
                            </div>
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">
                                    {user.name[0]}
                                </span>
                            </div>

                            {showLogout && (
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    size="sm"
                                    className="ml-1 text-xs px-2 py-1 h-7"
                                    disabled={logoutMutation.isPending}
                                >
                                    {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default CommonHeader