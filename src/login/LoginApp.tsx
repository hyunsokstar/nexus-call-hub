// C:\pilot-tauri\nexus-call-hub\src\login\LoginApp.tsx (디버깅 강화)
import { invoke } from "@tauri-apps/api/core"
import { User } from "@/shared/api/types"
import LoginComponent from "@/widgets/LoginForm/LoginComponent"

function LoginApp() {
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
            await invoke('switch_window', {
                fromLabel: 'login',
                toWindowType: 'Launcher'
            })
            console.log('✅ 런처 윈도우 전환 완료')

        } catch (error) {
            console.error('❌ 로그인 후 처리 실패:', error)

            // 🔄 실패 시 대안: 런처 윈도우 직접 열기
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
        }
    }

    return (
        <>

            {/* 기존 LoginComponent 재사용 */}
            <LoginComponent onLoginSuccess={handleLoginSuccess} />
        </>
    )
}

export default LoginApp