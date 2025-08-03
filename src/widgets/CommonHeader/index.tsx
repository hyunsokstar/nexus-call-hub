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
            await logoutMutation.mutateAsync()
            // 로그아웃 후 런처로 이동
            await invoke('switch_window', {
                fromLabel: window.location.pathname.split('/').pop()?.replace('.html', '') || 'unknown',
                toWindowType: 'Launcher'
            })
        } catch (error) {
            console.error('로그아웃 실패:', error)
        }
    }

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showBackButton && (
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            className="text-xs px-3 py-1 h-8"
                        >
                            ← 메인
                        </Button>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{icon}</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                            {subtitle && (
                                <p className="text-xs text-gray-500">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {customActions}

                    {user && (
                        <>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.department} · {user.role}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">
                                    {user.name[0]}
                                </span>
                            </div>

                            {showLogout && (
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="ml-2 text-xs px-3 py-1 h-7"
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