// 테스트용 간단한 LoginApp.tsx
import { useState } from "react"
import { invoke } from "@tauri-apps/api/core"

function LoginApp() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await invoke('switch_window', {
                fromLabel: 'login',
                toWindowType: 'Launcher'
            })
        } catch (error) {
            console.error("로그인 실패:", error)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #dbeafe, #c7d2fe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                {/* 로고 섹션 */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: '#2563eb',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>N</span>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                        Nexus Call Hub
                    </h1>
                    <p style={{ color: '#6b7280' }}>통합 상담 시스템에 로그인하세요</p>
                </div>

                {/* 로그인 폼 */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '32px'
                }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                사용자명
                            </label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="사용자명을 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                비밀번호
                            </label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => invoke('switch_window', { fromLabel: 'login', toWindowType: 'Launcher' })}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    background: 'white',
                                    color: '#374151',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: 'none',
                                    borderRadius: '12px',
                                    background: '#2563eb',
                                    color: 'white',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                로그인
                            </button>
                        </div>
                    </form>
                </div>

                {/* 상태 표시 */}
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                        <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                        <span>서버 연결 상태: 정상</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginApp