// C:\pilot-tauri\nexus-call-hub\src\login\LoginApp.tsx (디버깅 강화)
import { invoke } from "@tauri-apps/api/core"
import { User } from "@/shared/api/types"
import { useState } from "react"
import LoginComponent from "@/widgets/LoginForm/LoginComponent"
import SignupComponent from "@/widgets/SignupForm/SignupComponent"

type ViewMode = 'login' | 'signup'

function LoginApp() {
    const [viewMode, setViewMode] = useState<ViewMode>('login')

    const handleLoginSuccess = async (user: User) => {
        console.log('🎯 LoginApp: 로그인 성공 콜백 호출됨', user)

        try {
            // 🎯 Tauri State에 사용자 정보 저장
            console.log('📝 사용자 정보를 Tauri State에 저장 중...')
            await invoke('set_user_state', {
                user: user
            })
            console.log('✅ Tauri State 저장 완료')

            // 🚀 로그인 성공 후 런처로 이동
            console.log('🔄 런처 윈도우로 전환 시작...')
            // 기본 경로: switch_window (라벨 기반 교체)
            try {
                console.log('🔄 switch_window(Login → Launcher) 시도')
                await invoke('switch_window', { to_window_type: 'Launcher' })
                console.log('✅ switch_window 성공')
                return
            } catch (e1) {
                console.error('❌ switch_window 실패:', e1)
            }

            // 대안: open_window + close_window 조합
            try {
                console.log('🔄 대안: 런처 윈도우 직접 열기 시도...')
                await invoke('open_window', {
                    windowType: 'Launcher'
                })

                // 잠깐 기다린 후 로그인 윈도우 닫기
                setTimeout(async () => {
                    try {
                        await invoke('close_window', {
                            label: 'login'
                        })
                        console.log('✅ 로그인 윈도우 닫기 완료')
                    } catch (closeError) {
                        console.error('❌ 로그인 윈도우 닫기 실패:', closeError)
                    }
                }, 500)

            } catch (fallbackError) {
                console.error('❌ 대안 방법도 실패:', fallbackError)
                alert('윈도우 전환에 실패했습니다. 수동으로 런처를 열어주세요.')
            }
        } catch (error) {
            console.error('❌ 로그인 후 처리 실패:', error)
        }
    }

    // 회원가입 성공 후 로그인 페이지로 이동
    const handleSignupSuccess = () => {
        setViewMode('login')
    }

    // 로그인/회원가입 전환
    const switchToSignup = () => {
        setViewMode('signup')
    }

    const switchToLogin = () => {
        setViewMode('login')
    }

    return (
        <>
            {viewMode === 'login' ? (
                <LoginComponent
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToSignup={switchToSignup}
                />
            ) : (
                <SignupComponent
                    onSignupSuccess={handleSignupSuccess}
                    onSwitchToLogin={switchToLogin}
                />
            )}
        </>
    )
}

export default LoginApp