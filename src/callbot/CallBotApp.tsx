// C:\pilot-tauri\nexus-call-hub\src\callbot\CallBotApp.tsx
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/ui/badge'
import CommonHeader from '@/widgets/CommonHeader'
import { User } from '../shared/api/types'

interface CallSession {
    id: string
    customerName: string
    customerPhone: string
    status: 'waiting' | 'active' | 'completed' | 'failed'
    startTime?: Date
    endTime?: Date
    aiResponse?: string
    transcript?: string[]
}

interface BotStats {
    totalCalls: number
    activeCalls: number
    successRate: number
    avgDuration: string
}

function CallBotApp() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [botStatus, setBotStatus] = useState<'idle' | 'running' | 'paused'>('idle')
    const [currentSessions, setCurrentSessions] = useState<CallSession[]>([])
    const [botStats, setBotStats] = useState<BotStats>({
        totalCalls: 0,
        activeCalls: 0,
        successRate: 0,
        avgDuration: '0:00'
    })

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const userData = await invoke('get_user')
                setUser(userData as User)
                await loadBotData()
            } catch (error) {
                console.error('초기화 실패:', error)
            } finally {
                setIsLoading(false)
            }
        }

        initializeApp()
    }, [])

    const loadBotData = async () => {
        // 실제로는 Tauri 명령어로 백엔드에서 데이터를 가져옴
        // 지금은 모킹 데이터 사용
        setCurrentSessions([
            {
                id: '1',
                customerName: '김철수',
                customerPhone: '010-1234-5678',
                status: 'active',
                startTime: new Date(Date.now() - 120000),
                transcript: ['AI: 안녕하세요, 넥서스 콜센터입니다.', '고객: 상품 문의하고 싶어요.']
            },
            {
                id: '2',
                customerName: '이영희',
                customerPhone: '010-9876-5432',
                status: 'waiting',
            }
        ])

        setBotStats({
            totalCalls: 47,
            activeCalls: 2,
            successRate: 85.2,
            avgDuration: '3:42'
        })
    }

    const handleBotControl = async (action: 'start' | 'pause' | 'stop') => {
        try {
            await invoke('control_callbot', { action })

            switch (action) {
                case 'start':
                    setBotStatus('running')
                    break
                case 'pause':
                    setBotStatus('paused')
                    break
                case 'stop':
                    setBotStatus('idle')
                    break
            }
        } catch (error) {
            console.error('봇 제어 실패:', error)
        }
    }

    const getStatusColor = (status: CallSession['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'waiting': return 'bg-yellow-100 text-yellow-800'
            case 'completed': return 'bg-blue-100 text-blue-800'
            case 'failed': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: CallSession['status']) => {
        switch (status) {
            case 'active': return '통화중'
            case 'waiting': return '대기중'
            case 'completed': return '완료'
            case 'failed': return '실패'
            default: return '알 수 없음'
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">AI 콜봇을 로딩 중...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="p-6">
                    <p className="text-red-600">사용자 정보를 불러올 수 없습니다.</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <CommonHeader
                title="AI 콜봇"
                subtitle="자동 상담 시스템"
                icon="🤖"
                showBackButton={true}
            />

            <main className="p-6">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* 콜봇 제어 패널 */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        🤖
                                    </div>
                                    <div>
                                        <span className="text-xl font-bold">콜봇 제어</span>
                                        <Badge
                                            variant="secondary"
                                            className={`ml-3 ${botStatus === 'running'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : botStatus === 'paused'
                                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                                }`}
                                        >
                                            {botStatus === 'running' ? '🟢 실행중' : botStatus === 'paused' ? '🟡 일시정지' : '🔴 정지'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        size="sm"
                                        onClick={() => handleBotControl('start')}
                                        disabled={botStatus === 'running'}
                                        className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ▶ 시작
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBotControl('pause')}
                                        disabled={botStatus === 'idle'}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 font-medium px-6 py-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ⏸ 일시정지
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleBotControl('stop')}
                                        disabled={botStatus === 'idle'}
                                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ⏹ 정지
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-4 gap-6">
                                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">{botStats.totalCalls}</div>
                                    <div className="text-sm font-medium text-blue-700">총 통화</div>
                                    <div className="text-xs text-blue-500 mt-1">📞 전체 통화 수</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200">
                                    <div className="text-3xl font-bold text-green-600 mb-2">{botStats.activeCalls}</div>
                                    <div className="text-sm font-medium text-green-700">활성 통화</div>
                                    <div className="text-xs text-green-500 mt-1">🔥 현재 진행 중</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">{botStats.successRate}%</div>
                                    <div className="text-sm font-medium text-purple-700">성공률</div>
                                    <div className="text-xs text-purple-500 mt-1">✅ 완료된 통화</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-200">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">{botStats.avgDuration}</div>
                                    <div className="text-sm font-medium text-orange-700">평균 통화시간</div>
                                    <div className="text-xs text-orange-500 mt-1">⏱ 평균 소요 시간</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 현재 세션 목록 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* 활성 세션 */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        📞
                                    </div>
                                    <span className="text-lg font-bold">현재 통화 세션</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {currentSessions.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                😴
                                            </div>
                                            <p className="text-gray-500 font-medium">현재 진행중인 세션이 없습니다</p>
                                            <p className="text-sm text-gray-400 mt-2">새로운 통화가 들어오면 여기에 표시됩니다</p>
                                        </div>
                                    ) : (
                                        currentSessions.map(session => (
                                            <div key={session.id} className="border-2 border-gray-100 rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                            👤
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg text-gray-800">{session.customerName}</h4>
                                                            <p className="text-sm text-gray-600 font-medium">{session.customerPhone}</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={`px-3 py-1 font-medium ${getStatusColor(session.status)}`}>
                                                        {getStatusText(session.status)}
                                                    </Badge>
                                                </div>

                                                {session.status === 'active' && session.startTime && (
                                                    <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                                                        <span className="text-green-600">⏰</span>
                                                        <span className="text-sm font-medium text-green-700">
                                                            통화 시간: {Math.floor((Date.now() - session.startTime.getTime()) / 60000)}분
                                                        </span>
                                                    </div>
                                                )}

                                                {session.transcript && session.transcript.length > 0 && (
                                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-blue-600">💬</span>
                                                            <span className="text-sm font-bold text-blue-700">대화 내용</span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {session.transcript.slice(-3).map((msg, idx) => (
                                                                <div key={idx} className="text-sm text-gray-700 bg-white/60 rounded p-2">
                                                                    {msg}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI 설정 */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        ⚙️
                                    </div>
                                    <span className="text-lg font-bold">AI 설정</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-2 block">📋 응답 모드</label>
                                        <select className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200">
                                            <option>😊 친근한 상담원</option>
                                            <option>👔 전문적인 상담원</option>
                                            <option>⚡ 간단한 안내</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-2 block">⏰ 최대 통화 시간</label>
                                        <select className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200">
                                            <option>5분</option>
                                            <option>10분</option>
                                            <option>15분</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600">🎙️</span>
                                            <span className="text-sm font-bold text-green-700">자동 녹음</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 shadow-md"
                                        >
                                            ✅ 활성화
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600">📊</span>
                                            <span className="text-sm font-bold text-blue-700">실시간 분석</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 shadow-md"
                                        >
                                            ✅ 활성화
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default CallBotApp
