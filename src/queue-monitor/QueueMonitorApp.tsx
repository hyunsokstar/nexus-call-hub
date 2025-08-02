// C:\pilot-tauri\nexus-call-hub\src\queue-monitor\QueueMonitorApp.tsx
import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { Button } from "@/shared/ui/button"

interface User {
    id: string
    name: string
    department: string
    role: string
}

interface QueueStatus {
    inbound_waiting: number
    inbound_agents_available: number
    inbound_agents_total: number
    outbound_active_campaigns: number
    outbound_calls_in_progress: number
    outbound_calls_today: number
}

interface AgentInfo {
    id: string
    name: string
    status: 'available' | 'busy' | 'break' | 'offline'
    currentCall?: string
    callDuration?: number
}

function QueueMonitorApp() {
    const [user, setUser] = useState<User | null>(null)
    const [queueStatus, setQueueStatus] = useState<QueueStatus>({
        inbound_waiting: 0,
        inbound_agents_available: 0,
        inbound_agents_total: 0,
        outbound_active_campaigns: 0,
        outbound_calls_in_progress: 0,
        outbound_calls_today: 0
    })
    const [agents, setAgents] = useState<AgentInfo[]>([])
    const [lastUpdate, setLastUpdate] = useState(new Date())

    useEffect(() => {
        // 사용자 정보 가져오기
        const fetchUser = async () => {
            try {
                const userData = await invoke('get_user')
                setUser(userData as User)
                loadSampleData()
            } catch (error) {
                console.error("사용자 정보 가져오기 실패:", error)
            }
        }

        fetchUser()

        // 이벤트 리스너 등록
        const unlistenUser = listen('user-logged-out', () => {
            setUser(null)
        })

        const unlistenQueue = listen('queue-status-updated', (event) => {
            setQueueStatus(event.payload as QueueStatus)
            setLastUpdate(new Date())
        })

        // 실시간 업데이트 시뮬레이션
        const interval = setInterval(() => {
            updateSampleData()
        }, 5000)

        return () => {
            unlistenUser.then(f => f())
            unlistenQueue.then(f => f())
            clearInterval(interval)
        }
    }, [])

    const loadSampleData = () => {
        // 샘플 상담원 데이터
        const sampleAgents: AgentInfo[] = [
            { id: '1', name: '김상담', status: 'busy', currentCall: '010-1234-5678', callDuration: 245 },
            { id: '2', name: '이상담', status: 'available' },
            { id: '3', name: '박상담', status: 'busy', currentCall: '010-9876-5432', callDuration: 89 },
            { id: '4', name: '최상담', status: 'break' },
            { id: '5', name: '정상담', status: 'available' },
            { id: '6', name: '한상담', status: 'offline' }
        ]

        setAgents(sampleAgents)

        // 초기 대기열 상태
        setQueueStatus({
            inbound_waiting: 8,
            inbound_agents_available: 2,
            inbound_agents_total: 6,
            outbound_active_campaigns: 3,
            outbound_calls_in_progress: 12,
            outbound_calls_today: 247
        })
    }

    const updateSampleData = () => {
        // 실시간 데이터 업데이트 시뮬레이션
        setQueueStatus(prev => ({
            ...prev,
            inbound_waiting: Math.max(0, prev.inbound_waiting + Math.floor(Math.random() * 3) - 1),
            outbound_calls_in_progress: Math.max(0, prev.outbound_calls_in_progress + Math.floor(Math.random() * 3) - 1),
            outbound_calls_today: prev.outbound_calls_today + Math.floor(Math.random() * 2)
        }))

        // 상담원 상태 업데이트
        setAgents(prev => prev.map(agent => {
            if (agent.status === 'busy' && agent.callDuration) {
                return { ...agent, callDuration: agent.callDuration + 5 }
            }
            return agent
        }))

        setLastUpdate(new Date())
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const handleBackToLauncher = async () => {
        try {
            await invoke('switch_window', {
                fromLabel: 'queuemonitor',
                toWindowType: 'Launcher'
            })
        } catch (error) {
            console.error("런처로 돌아가기 실패:", error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'text-green-600 bg-green-100'
            case 'busy': return 'text-red-600 bg-red-100'
            case 'break': return 'text-yellow-600 bg-yellow-100'
            case 'offline': return 'text-gray-600 bg-gray-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available': return '대기중'
            case 'busy': return '통화중'
            case 'break': return '휴식중'
            case 'offline': return '오프라인'
            default: return '알수없음'
        }
    }

    const availableAgents = agents.filter(a => a.status === 'available').length
    const busyAgents = agents.filter(a => a.status === 'busy').length
    const avgWaitTime = queueStatus.inbound_waiting > 0 ? Math.floor(120 + Math.random() * 180) : 0

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleBackToLauncher}
                            variant="outline"
                            className="text-xs px-3 py-1 h-8"
                        >
                            ← 메인
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">⏳</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">실시간 대기열</h1>
                                <p className="text-xs text-gray-500">현재 대기 상황 모니터링</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-500">
                            마지막 업데이트: {formatTimestamp(lastUpdate)}
                        </div>
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.department}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 인바운드 대기열 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            인바운드 대기열
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">{queueStatus.inbound_waiting}</div>
                                <div className="text-sm text-gray-600">대기 중인 고객</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{formatTime(avgWaitTime)}</div>
                                <div className="text-sm text-gray-600">평균 대기시간</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">대기 중인 상담원</span>
                                <span className="font-medium text-green-600">{availableAgents}명</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">통화 중인 상담원</span>
                                <span className="font-medium text-red-600">{busyAgents}명</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">전체 상담원</span>
                                <span className="font-medium">{queueStatus.inbound_agents_total}명</span>
                            </div>
                        </div>
                    </div>

                    {/* 아웃바운드 현황 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            아웃바운드 현황
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{queueStatus.outbound_calls_in_progress}</div>
                                <div className="text-sm text-gray-600">진행 중인 통화</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{queueStatus.outbound_calls_today}</div>
                                <div className="text-sm text-gray-600">오늘 완료된 통화</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">활성 캠페인</span>
                                <span className="font-medium">{queueStatus.outbound_active_campaigns}개</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">시간당 통화량</span>
                                <span className="font-medium">47통화</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">성공률</span>
                                <span className="font-medium text-green-600">23.4%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 상담원 상태 목록 */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">상담원 현황</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map((agent) => (
                            <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{agent.name}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                                        {getStatusText(agent.status)}
                                    </span>
                                </div>

                                {agent.status === 'busy' && agent.currentCall && (
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>통화: {agent.currentCall}</div>
                                        <div>시간: {formatTime(agent.callDuration || 0)}</div>
                                    </div>
                                )}

                                {agent.status === 'available' && (
                                    <div className="text-sm text-green-600">통화 대기 중</div>
                                )}

                                {agent.status === 'break' && (
                                    <div className="text-sm text-yellow-600">휴식 중</div>
                                )}

                                {agent.status === 'offline' && (
                                    <div className="text-sm text-gray-600">오프라인</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default QueueMonitorApp