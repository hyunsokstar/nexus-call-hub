// C:\pilot-tauri\nexus-call-hub\src\dashboard\DashboardApp.tsx
import { useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/shared/ui/button"

function DashboardApp() {
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle')
    const [currentCall, setCurrentCall] = useState<string>("")

    const handleStartCall = async () => {
        setCallStatus('calling')
        // 통화 시작 로직 (추후 구현)
        setTimeout(() => {
            setCallStatus('connected')
            setCurrentCall("010-1234-5678")
        }, 2000)
    }

    const handleEndCall = () => {
        setCallStatus('idle')
        setCurrentCall("")
    }

    const handleReturnToLauncher = async () => {
        try {
            await invoke('switch_window', {
                fromLabel: 'call_outbound',
                toWindowType: 'Launcher'
            })
        } catch (error) {
            console.error("런처로 전환 실패:", error)
        }
    }

    const getStatusColor = () => {
        switch (callStatus) {
            case 'calling': return 'bg-yellow-500'
            case 'connected': return 'bg-green-500'
            default: return 'bg-gray-400'
        }
    }

    const getStatusText = () => {
        switch (callStatus) {
            case 'calling': return '연결 중...'
            case 'connected': return '통화 중'
            default: return '대기'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">📞</span>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900">통화 대시보드</h1>
                    </div>
                    <Button
                        onClick={handleReturnToLauncher}
                        variant="outline"
                        className="text-sm px-3 py-1"
                    >
                        런처로
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                {/* 통화 상태 표시 */}
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
                    {/* 상태 아이콘 */}
                    <div className={`w-24 h-24 ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300`}>
                        <span className="text-white text-3xl">
                            {callStatus === 'connected' ? '🔊' : '📞'}
                        </span>
                    </div>

                    {/* 상태 텍스트 */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{getStatusText()}</h2>
                    {currentCall && (
                        <p className="text-lg text-gray-600 mb-6">{currentCall}</p>
                    )}

                    {/* 통화 컨트롤 */}
                    <div className="space-y-4">
                        {callStatus === 'idle' && (
                            <Button
                                onClick={handleStartCall}
                                className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 rounded-xl"
                            >
                                통화 시작
                            </Button>
                        )}

                        {callStatus === 'calling' && (
                            <Button
                                onClick={handleEndCall}
                                variant="destructive"
                                className="w-full py-3 text-lg rounded-xl"
                            >
                                취소
                            </Button>
                        )}

                        {callStatus === 'connected' && (
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="py-3 rounded-xl"
                                >
                                    음소거
                                </Button>
                                <Button
                                    onClick={handleEndCall}
                                    variant="destructive"
                                    className="py-3 rounded-xl"
                                >
                                    종료
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 빠른 액션 */}
                {callStatus === 'idle' && (
                    <div className="mt-6 w-full max-w-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">빠른 액션</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="py-2 text-sm rounded-xl">
                                최근 통화
                            </Button>
                            <Button variant="outline" className="py-2 text-sm rounded-xl">
                                연락처
                            </Button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="p-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 ${getStatusColor()} rounded-full`}></div>
                            <span>통화 상태: {getStatusText()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>네트워크 연결됨</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default DashboardApp