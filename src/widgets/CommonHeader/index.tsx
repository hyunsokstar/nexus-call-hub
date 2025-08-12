// C:\pilot-tauri\nexus-call-hub\src\widgets\CommonHeader\index.tsx
import React from 'react'
import { useUser } from '@/shared/hooks/useUser'
import { ChevronLeft, LogOut } from 'lucide-react'

interface Props {
    title: string
    subtitle?: string
    icon?: string
    showBackButton?: boolean
    onBack?: () => void
}

const CommonHeader: React.FC<Props> = ({
    title,
    subtitle,
    icon,
    showBackButton,
    onBack
}) => {
    const { user, isLoggedIn, logout } = useUser()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('로그아웃 실패:', error)
        }
    }

    return (
        <header className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* 왼쪽: 뒤로가기 + 타이틀 */}
                    <div className="flex items-center gap-3">
                        {showBackButton && (
                            <button
                                onClick={onBack}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
                                aria-label="뒤로가기"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="text-2xl bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                    {icon}
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                                {subtitle && (
                                    <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽: 사용자 정보 */}
                    {isLoggedIn && user && (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <div className="text-sm font-medium">{user.name}</div>
                                <div className="text-xs text-white/70">{user.department} · {user.role}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* 사용자 아바타 */}
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                    <span className="text-sm font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                {/* 로그아웃 버튼 */}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 transition-colors duration-200 backdrop-blur-sm group"
                                    title="로그아웃"
                                >
                                    <LogOut size={16} className="group-hover:text-red-200" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default CommonHeader