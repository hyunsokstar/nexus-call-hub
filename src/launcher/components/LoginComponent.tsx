// C:\pilot-tauri\nexus-call-hub\src\launcher\components\LoginComponent.tsx
import { useState } from "react"
import { invoke } from "@tauri-apps/api/core"

interface User {
    id: string
    name: string
    department: string
    role: string
    token: string
}

interface LoginComponentProps {
    onLoginSuccess: (user: User) => void
}

function LoginComponent({ onLoginSuccess }: LoginComponentProps) {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            // 로그인 시뮬레이션 (실제로는 API 호출)
            await new Promise(resolve => setTimeout(resolve, 1000))

            // 샘플 사용자 데이터
            const userData: User = {
                id: Date.now().toString(),
                name: credentials.username || '홍길동',
                department: credentials.username.includes('관리') ? '관리팀' : '고객상담팀',
                role: credentials.username.includes('관리') ? '관리자' : '상담원',
                token: 'sample-jwt-token-' + Date.now()
            }

            // Tauri State에 사용자 정보 저장
            await invoke('login_user', { user: userData })

            // 부모 컴포넌트에 로그인 성공 알림
            onLoginSuccess(userData)

        } catch (error) {
            console.error('로그인 실패:', error)
            setError('로그인에 실패했습니다. 다시 시도해주세요.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleQuickLogin = async (type: 'agent' | 'manager') => {
        const quickCredentials = {
            username: type === 'agent' ? '상담원1' : '관리자1',
            password: 'password'
        }

        setCredentials(quickCredentials)

        // 약간의 딜레이 후 자동 로그인
        setTimeout(() => {
            const event = new Event('submit', { bubbles: true, cancelable: true })
            document.querySelector('form')?.dispatchEvent(event)
        }, 100)
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #dbeafe, #c7d2fe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{ width: '100%', maxWidth: '350px' }}>
                {/* 로고 섹션 */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: '#2563eb',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px'
                    }}>
                        <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>N</span>
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                        Nexus Call Hub
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>통합 상담 시스템에 로그인하세요</p>
                </div>

                {/* 로그인 폼 */}
                <div style={{
                    background: 'white',
                    borderRadius: '14px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                    padding: '24px'
                }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: 'none',
                                borderRadius: '12px',
                                background: isLoading ? '#9ca3af' : '#2563eb',
                                color: 'white',
                                fontSize: '14px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {isLoading && (
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid white',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            )}
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>

                    {/* 개발용 빠른 로그인 */}
                    <div style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <p style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            textAlign: 'center',
                            marginBottom: '8px'
                        }}>
                            개발용 빠른 로그인
                        </p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('agent')}
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    padding: '6px 10px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    background: 'white',
                                    color: '#374151',
                                    fontSize: '11px',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                상담원
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('manager')}
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    padding: '6px 10px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    background: 'white',
                                    color: '#374151',
                                    fontSize: '11px',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                관리자
                            </button>
                        </div>
                    </div>
                </div>

                {/* 상태 표시 - 간소화 */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            background: '#10b981',
                            borderRadius: '50%'
                        }}></div>
                        <span>서버 연결됨</span>
                    </div>
                </div>
            </div>

            {/* CSS 애니메이션 */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default LoginComponent