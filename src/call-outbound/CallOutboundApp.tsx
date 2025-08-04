// C:\pilot-tauri\nexus-call-hub\src\call-outbound\CallOutboundApp.tsx
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

interface Campaign {
    id: string
    name: string
    status: 'active' | 'paused' | 'completed'
    totalLeads: number
    completedCalls: number
    successRate: number
}

interface Lead {
    id: string
    name: string
    phone: string
    company?: string
    status: 'pending' | 'called' | 'success' | 'failed' | 'callback'
    notes?: string
    lastAttempt?: Date
    attemptCount: number
}

type AgentStatus = 'available' | 'busy' | 'break' | 'offline'

function CallOutboundApp() {
    const [user, setUser] = useState<User | null>(null)
    const [agentStatus, setAgentStatus] = useState<AgentStatus>('offline')
    const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null)
    const [currentLead, setCurrentLead] = useState<Lead | null>(null)
    const [callDuration, setCallDuration] = useState(0)
    const [_, setCampaigns] = useState<Campaign[]>([])
    const [leads, setLeads] = useState<Lead[]>([])
    const [callNotes, setCallNotes] = useState('')

    useEffect(() => {
        // 사용자 정보 가져오기
        const fetchUser = async () => {
            try {
                const userData = await invoke('get_user')
                setUser(userData as User)
                // 샘플 캠페인 데이터 로드
                loadSampleData()
            } catch (error) {
                console.error("사용자 정보 가져오기 실패:", error)
            }
        }

        fetchUser()

        // 이벤트 리스너 등록
        const unlistenUser = listen('user-logged-out', () => {
            setUser(null)
            setAgentStatus('offline')
        })

        return () => {
            unlistenUser.then(f => f())
        }
    }, [])

    // 통화 시간 카운터
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (currentLead && agentStatus === 'busy') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [currentLead, agentStatus])

    const loadSampleData = () => {
        const sampleCampaigns: Campaign[] = [
            {
                id: '1',
                name: '신제품 마케팅 캠페인',
                status: 'active',
                totalLeads: 150,
                completedCalls: 45,
                successRate: 23.5
            },
            {
                id: '2',
                name: '기존 고객 만족도 조사',
                status: 'active',
                totalLeads: 80,
                completedCalls: 12,
                successRate: 41.2
            },
            {
                id: '3',
                name: '프리미엄 서비스 안내',
                status: 'paused',
                totalLeads: 200,
                completedCalls: 78,
                successRate: 18.7
            }
        ]

        const sampleLeads: Lead[] = [
            {
                id: '1',
                name: '김철수',
                phone: '010-1234-5678',
                company: '(주)테크솔루션',
                status: 'pending',
                attemptCount: 0
            },
            {
                id: '2',
                name: '이영희',
                phone: '010-9876-5432',
                company: '스마트시스템',
                status: 'pending',
                attemptCount: 1,
                lastAttempt: new Date(Date.now() - 86400000)
            },
            {
                id: '3',
                name: '박민수',
                phone: '010-5555-7777',
                status: 'pending',
                attemptCount: 0
            },
            {
                id: '4',
                name: '정미라',
                phone: '010-3333-9999',
                company: '디지털코리아',
                status: 'callback',
                attemptCount: 2,
                lastAttempt: new Date(Date.now() - 3600000),
                notes: '오후 3시 이후 통화 가능'
            }
        ]

        setCampaigns(sampleCampaigns)
        setLeads(sampleLeads)
        setCurrentCampaign(sampleCampaigns[0])
    }

    const handleStatusChange = async (newStatus: AgentStatus) => {
        setAgentStatus(newStatus)
        if (newStatus === 'available' && currentCampaign) {
            // 다음 연락처 자동 할당
            const nextLead = leads.find(lead => lead.status === 'pending' || lead.status === 'callback')
            if (nextLead) {
                setTimeout(() => {
                    setCurrentLead(nextLead)
                    setAgentStatus('busy')
                    setCallDuration(0)
                    setCallNotes('')
                }, 1000)
            }
        }
    }

    const handleEndCall = (result: 'success' | 'failed' | 'callback') => {
        if (currentLead) {
            setLeads(prev => prev.map(lead =>
                lead.id === currentLead.id
                    ? {
                        ...lead,
                        status: result,
                        attemptCount: lead.attemptCount + 1,
                        lastAttempt: new Date(),
                        notes: callNotes || lead.notes
                    }
                    : lead
            ))

            // 캠페인 통계 업데이트
            if (currentCampaign) {
                setCampaigns(prev => prev.map(campaign =>
                    campaign.id === currentCampaign.id
                        ? {
                            ...campaign,
                            completedCalls: campaign.completedCalls + 1,
                            successRate: result === 'success'
                                ? ((campaign.successRate * campaign.completedCalls + 100) / (campaign.completedCalls + 1))
                                : ((campaign.successRate * campaign.completedCalls) / (campaign.completedCalls + 1))
                        }
                        : campaign
                ))
            }
        }

        setCurrentLead(null)
        setCallDuration(0)
        setCallNotes('')
        setAgentStatus('available')

        // 다음 리드가 있으면 자동 연결
        setTimeout(() => {
            const nextLead = leads.find(lead =>
                lead.id !== currentLead?.id &&
                (lead.status === 'pending' || lead.status === 'callback')
            )
            if (nextLead && agentStatus === 'available') {
                setCurrentLead(nextLead)
                setAgentStatus('busy')
                setCallDuration(0)
                setCallNotes('')
            }
        }, 2000)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleBackToLauncher = async () => {
        try {
            await invoke('switch_window', {
                fromLabel: 'calloutbound',
                toWindowType: 'Launcher'
            })
        } catch (error) {
            console.error("런처로 돌아가기 실패:", error)
        }
    }

    const getStatusColor = (status: AgentStatus) => {
        switch (status) {
            case 'available': return 'bg-green-500'
            case 'busy': return 'bg-red-500'
            case 'break': return 'bg-yellow-500'
            case 'offline': return 'bg-gray-500'
        }
    }

    const getStatusText = (status: AgentStatus) => {
        switch (status) {
            case 'available': return '대기중'
            case 'busy': return '통화중'
            case 'break': return '휴식중'
            case 'offline': return '오프라인'
        }
    }

    const getLeadStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-blue-100 text-blue-800'
            case 'called': return 'bg-gray-100 text-gray-800'
            case 'success': return 'bg-green-100 text-green-800'
            case 'failed': return 'bg-red-100 text-red-800'
            case 'callback': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getLeadStatusText = (status: string) => {
        switch (status) {
            case 'pending': return '대기'
            case 'called': return '통화완료'
            case 'success': return '성공'
            case 'failed': return '실패'
            case 'callback': return '재통화'
            default: return '알수없음'
        }
    }

    const getCampaignStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'paused': return 'bg-yellow-100 text-yellow-800'
            case 'completed': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const pendingLeads = leads.filter(l => l.status === 'pending' || l.status === 'callback')

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
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">📱</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">아웃바운드 영업</h1>
                                <p className="text-xs text-gray-500">캠페인 통화 실행</p>
                            </div>
                        </div>
                    </div>

                    {user && (
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.department}</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(agentStatus)}`}></div>
                            <span className="text-sm font-medium">{getStatusText(agentStatus)}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 flex">
                {/* 사이드바 - 캠페인 및 상태 */}
                <aside className="w-80 bg-white border-r border-gray-200 p-4">
                    <div className="space-y-6">
                        {/* 상담원 상태 */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">상담원 상태</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => handleStatusChange('available')}
                                    variant={agentStatus === 'available' ? 'default' : 'outline'}
                                    className="text-xs"
                                    disabled={currentLead !== null}
                                >
                                    대기중
                                </Button>
                                <Button
                                    onClick={() => handleStatusChange('break')}
                                    variant={agentStatus === 'break' ? 'default' : 'outline'}
                                    className="text-xs"
                                    disabled={currentLead !== null}
                                >
                                    휴식중
                                </Button>
                                <Button
                                    onClick={() => handleStatusChange('offline')}
                                    variant={agentStatus === 'offline' ? 'default' : 'outline'}
                                    className="text-xs col-span-2"
                                    disabled={currentLead !== null}
                                >
                                    오프라인
                                </Button>
                            </div>
                        </div>

                        {/* 현재 캠페인 */}
                        {currentCampaign && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">현재 캠페인</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="font-medium">{currentCampaign.name}</div>
                                    <div className="text-gray-600">
                                        진행률: {currentCampaign.completedCalls}/{currentCampaign.totalLeads}
                                    </div>
                                    <div className="text-gray-600">
                                        성공률: {currentCampaign.successRate.toFixed(1)}%
                                    </div>
                                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCampaignStatusColor(currentCampaign.status)}`}>
                                        {currentCampaign.status === 'active' ? '활성' :
                                            currentCampaign.status === 'paused' ? '일시정지' : '완료'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 현재 통화 정보 */}
                        {currentLead && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">현재 통화</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">고객명:</span>
                                        <span className="ml-2 font-medium">{currentLead.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">전화번호:</span>
                                        <span className="ml-2 font-medium">{currentLead.phone}</span>
                                    </div>
                                    {currentLead.company && (
                                        <div>
                                            <span className="text-gray-600">회사:</span>
                                            <span className="ml-2 font-medium">{currentLead.company}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-600">통화시간:</span>
                                        <span className="ml-2 font-medium text-red-600">{formatTime(callDuration)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">시도횟수:</span>
                                        <span className="ml-2 font-medium">{currentLead.attemptCount + 1}회</span>
                                    </div>
                                    {currentLead.notes && (
                                        <div className="text-xs text-gray-500 bg-white p-2 rounded">
                                            {currentLead.notes}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-1 mt-3">
                                    <Button
                                        onClick={() => handleEndCall('success')}
                                        className="text-xs bg-green-600 hover:bg-green-700"
                                    >
                                        성공
                                    </Button>
                                    <Button
                                        onClick={() => handleEndCall('failed')}
                                        className="text-xs bg-red-600 hover:bg-red-700"
                                    >
                                        실패
                                    </Button>
                                    <Button
                                        onClick={() => handleEndCall('callback')}
                                        className="text-xs bg-yellow-600 hover:bg-yellow-700"
                                    >
                                        재통화
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* 대기 중인 리드 */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                대기 중인 연락처 ({pendingLeads.length})
                            </h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {pendingLeads.map((lead) => (
                                    <div key={lead.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                                        <div className="font-medium">{lead.name}</div>
                                        <div className="text-gray-600">{lead.phone}</div>
                                        {lead.company && (
                                            <div className="text-xs text-gray-500">{lead.company}</div>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">
                                                시도: {lead.attemptCount}회
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getLeadStatusColor(lead.status)}`}>
                                                {getLeadStatusText(lead.status)}
                                            </span>
                                        </div>
                                        {lead.lastAttempt && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                마지막: {formatDate(lead.lastAttempt)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {pendingLeads.length === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        대기 중인 연락처가 없습니다
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 메인 영역 - 통화 화면 */}
                <main className="flex-1 p-6">
                    <div className="bg-white rounded-lg border border-gray-200 h-full p-6">
                        {currentLead ? (
                            <div className="h-full flex flex-col">
                                <h2 className="text-xl font-semibold mb-4">고객 통화 진행중</h2>

                                {/* 고객 정보 */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold mb-3">고객 정보</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600">고객명</label>
                                            <div className="text-lg font-medium">{currentLead.name}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">전화번호</label>
                                            <div className="text-lg font-medium">{currentLead.phone}</div>
                                        </div>
                                        {currentLead.company && (
                                            <div>
                                                <label className="text-sm text-gray-600">회사명</label>
                                                <div className="text-lg font-medium">{currentLead.company}</div>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm text-gray-600">통화 횟수</label>
                                            <div className="text-lg font-medium">{currentLead.attemptCount + 1}회</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 통화 스크립트 및 메모 */}
                                <div className="flex-1 grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">통화 스크립트</h3>
                                        <div className="bg-blue-50 p-4 rounded-lg h-full overflow-y-auto">
                                            <div className="text-sm space-y-3">
                                                <div>
                                                    <strong className="text-blue-800">1. 인사:</strong>
                                                    <p className="mt-1">안녕하세요, {currentLead.name}님. {currentCampaign?.name} 관련해서 연락드렸습니다.</p>
                                                </div>
                                                <div>
                                                    <strong className="text-blue-800">2. 목적 설명:</strong>
                                                    <p className="mt-1">저희 새로운 솔루션에 대해 간단히 안내드리고 싶어서 연락드렸어요.</p>
                                                </div>
                                                <div>
                                                    <strong className="text-blue-800">3. 관심도 확인:</strong>
                                                    <p className="mt-1">혹시 관련해서 관심이 있으시거나 궁금한 점이 있으신가요?</p>
                                                </div>
                                                <div>
                                                    <strong className="text-blue-800">4. 일정 제안:</strong>
                                                    <p className="mt-1">자세한 설명을 위해 미팅 일정을 잡을 수 있을까요?</p>
                                                </div>
                                                <div>
                                                    <strong className="text-blue-800">5. 마무리:</strong>
                                                    <p className="mt-1">감사합니다. 좋은 하루 되세요!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">통화 메모</h3>
                                        <textarea
                                            value={callNotes}
                                            onChange={(e) => setCallNotes(e.target.value)}
                                            className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none"
                                            placeholder="통화 내용 및 결과를 입력하세요..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📱</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">통화 대기중</h2>
                                    <p className="text-gray-600">
                                        {agentStatus === 'available'
                                            ? '다음 고객에게 연결 중입니다'
                                            : '상담원 상태를 "대기중"으로 변경하세요'}
                                    </p>
                                    {pendingLeads.length > 0 && agentStatus === 'available' && (
                                        <p className="text-sm text-green-600 mt-2">
                                            {pendingLeads.length}명의 고객이 대기 중입니다
                                        </p>
                                    )}
                                    {currentCampaign && (
                                        <div className="mt-4 text-sm text-gray-500">
                                            현재 캠페인: {currentCampaign.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CallOutboundApp