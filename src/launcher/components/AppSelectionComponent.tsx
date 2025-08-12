// C:\pilot-tauri\nexus-call-hub\src\launcher\components\AppSelectionComponent.tsx
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/shared/ui/button"
import { useUser } from "@/shared/hooks/useUser"  // 🔐 새로 추가
import CommonHeader from "@/widgets/CommonHeader"

// 상담사용 앱들: 요청에 따라 "챗봇 테스트", "공유 업무 정보"만 노출
const consultantApps = [
    // {
    //     id: 'inbound',
    //     label: '인바운드 상담',
    //     icon: '📞',
    //     description: '고객 문의 자동 분배',
    //     windowType: 'CallInbound',
    //     color: 'blue',
    // },
    // {
    //     id: 'outbound',
    //     label: '아웃바운드 영업',
    //     icon: '📱',
    //     description: '캠페인 통화 실행',
    //     windowType: 'CallOutbound',
    //     color: 'green',
    // },
    // {
    //     id: 'callbot',
    //     label: 'AI 콜봇',
    //     icon: '🤖',
    //     description: 'AI 자동 상담 시스템',
    //     windowType: 'CallBot',
    //     color: 'purple',
    // },
    {
        id: 'chatbot',
        label: '챗봇 테스트',
        icon: '💬',
        description: '챗봇 기능 테스트',
        windowType: 'ChatBot',
        color: 'indigo',
    },
    {
        id: 'company-chat',
        label: 'Company Chat',
        icon: '🏢',
        description: '사내 채팅',
        windowType: 'CompanyChat',
        color: 'gray',
    },
    // {
    //     id: 'queue-monitor',
    //     label: '실시간 대기열',
    //     icon: '⏳',
    //     description: '현재 대기 상황 모니터링',
    //     windowType: 'QueueMonitor',
    //     color: 'orange',
    // },
    {
        id: 'share-task-info',
        label: '공유 업무 정보',
        icon: '🗂️',
        description: '업무 정보 공유 및 확인',
        windowType: 'ShareTaskInfo',
        color: 'blue',
    },
];

// 관리/분석용 앱들: 현재는 비활성화 (필요 시 주석 해제)
const managementApps: typeof consultantApps = [
    // {
    //     id: 'statistics',
    //     label: '통계 대시보드',
    //     icon: '📊',
    //     description: '상담 현황 분석',
    //     windowType: 'Statistics',
    //     color: 'orange'
    // },
    // {
    //     id: 'settings',
    //     label: '환경설정',
    //     icon: '⚙️',
    //     description: '시스템 설정',
    //     windowType: 'Settings',
    //     color: 'gray'
    // },
    // {
    //     id: 'share-task-info',
    //     label: '공유 업무 정보',
    //     icon: '🗂️',
    //     description: '업무 정보 공유 및 확인',
    //     windowType: 'share_task_info', // 동적 생성용 label
    //     color: 'blue'
    // }
]

// AppCard 컴포넌트 (기존과 동일)
interface AppCardProps {
    app: {
        id: string
        label: string
        icon: string
        description: string
        windowType: string
        color: string
    }
}

function AppCard({ app }: AppCardProps) {
    const handleClick = async () => {
        try {
            await invoke('switch_window', {
                fromLabel: 'launcher',
                toWindowType: app.windowType
            })
        } catch (error) {
            console.error(`${app.label} 윈도우 전환 실패:`, error)
        }
    }

    const colorClasses = {
        blue: 'hover:bg-blue-50 hover:border-blue-200 bg-blue-100 text-blue-600 group-hover:bg-blue-200',
        green: 'hover:bg-green-50 hover:border-green-200 bg-green-100 text-green-600 group-hover:bg-green-200',
        purple: 'hover:bg-purple-50 hover:border-purple-200 bg-purple-100 text-purple-600 group-hover:bg-purple-200',
        indigo: 'hover:bg-indigo-50 hover:border-indigo-200 bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
        orange: 'hover:bg-orange-50 hover:border-orange-200 bg-orange-100 text-orange-600 group-hover:bg-orange-200',
        gray: 'hover:bg-gray-50 hover:border-gray-300 bg-gray-100 text-gray-600 group-hover:bg-gray-200'
    }

    const hoverClass = colorClasses[app.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')
    const iconClass = colorClasses[app.color as keyof typeof colorClasses].split(' ').slice(2).join(' ')

    return (
        <Button
            className={`h-32 flex flex-col items-center justify-center gap-3 bg-white ${hoverClass} border border-gray-200 rounded-xl transition-all duration-200 group`}
            onClick={handleClick}
            variant="outline"
        >
            <div className={`w-12 h-12 ${iconClass} rounded-lg flex items-center justify-center text-xl transition-colors`}>
                {app.icon}
            </div>
            <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{app.label}</div>
                <div className="text-xs text-gray-500 mt-1">{app.description}</div>
            </div>
        </Button>
    )
}

function AppSelectionComponent() {  // 🔧 props 제거
    const { user, isLoading } = useUser();  // 🔐 useUser 훅 사용

    // 🔧 로딩 상태 처리
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 🔧 로그인되지 않은 상태 처리
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
                    <Button onClick={() => invoke('replace_all_windows', { windowType: 'Login' })}>
                        로그인하기
                    </Button>
                </div>
            </div>
        );
    }

    // 역할별 접근 권한 확인
    const getAvailableApps = () => {
        const isManager = user.role.includes('관리') || user.role === '매니저' || user.role === 'manager'

        // 상담원: 상담 앱들만
        // 관리자: 모든 앱
        return {
            consultant: consultantApps,
            management: isManager ? managementApps : []
        }
    }

    const { consultant, management } = getAvailableApps()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 🔧 CommonHeader 수정 - user, onLogout prop 제거 */}
            <CommonHeader
                title="Nexus Call Hub"
                subtitle="통합 상담 시스템"
                icon="N"
                showBackButton={false}
            />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">어플리케이션 선택</h2>
                        <p className="text-sm text-gray-600">
                            {user.role.includes('관리') ? '관리자 권한으로 모든 기능을 사용할 수 있습니다' : '원하는 작업 모드를 선택하세요'}
                        </p>
                    </div>

                    {/* 상담 앱들 */}
                    <section className="mb-8">
                        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            상담 업무
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {consultant.map(app => (
                                <AppCard key={app.id} app={app} />
                            ))}
                        </div>
                    </section>

                    {/* 관리 앱들 - 관리자만 표시 */}
                    {management.length > 0 && (
                        <section>
                            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                관리 도구
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                    관리자 전용
                                </span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {management.map(app => (
                                    <AppCard key={app.id} app={app} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 권한 안내 (상담원인 경우) */}
                    {management.length === 0 && (
                        <section>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">상담원 권한</h3>
                                <p className="text-xs text-blue-600">
                                    현재 상담원 권한으로 로그인되어 있습니다. 관리 도구는 관리자 권한이 필요합니다.
                                </p>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>시스템 정상</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>서버 연결됨</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>로그인: {user.name}</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default AppSelectionComponent