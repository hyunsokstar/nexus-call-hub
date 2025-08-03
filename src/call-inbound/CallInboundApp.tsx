// C:\pilot-tauri\nexus-call-hub\src\call-inbound\CallInboundApp.tsx
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface User {
    id: string;
    name: string;
    department: string;
    role: string;
    token: string;
}

interface InboundCall {
    id: string;
    customerPhone: string;
    customerName?: string;
    waitTime: number;
    priority: 'high' | 'normal' | 'low';
    type: 'inquiry' | 'complaint' | 'support';
}

type AgentStatus = 'available' | 'busy' | 'break' | 'offline';

const CallInboundApp = () => {
    const [user, setUser] = useState<User | null>(null);
    const [agentStatus, setAgentStatus] = useState<AgentStatus>('offline');
    const [currentCall, setCurrentCall] = useState<InboundCall | null>(null);
    const [callDuration, setCallDuration] = useState(0);
    const [waitingCalls, setWaitingCalls] = useState<InboundCall[]>([]);
    const [customerNotes, setCustomerNotes] = useState('');

    useEffect(() => {
        // Tauri State에서 사용자 정보 가져오기
        const fetchUser = async () => {
            try {
                const userData = await invoke('get_user');
                setUser(userData as User);
                loadSampleData();
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
            }
        };

        fetchUser();
    }, []);

    // 통화 시간 카운터
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentCall && agentStatus === 'busy') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [currentCall, agentStatus]);

    const loadSampleData = () => {
        const sampleCalls: InboundCall[] = [
            {
                id: '1',
                customerPhone: '010-1234-5678',
                customerName: '김고객',
                waitTime: 125,
                priority: 'high',
                type: 'complaint'
            },
            {
                id: '2',
                customerPhone: '010-9876-5432',
                waitTime: 67,
                priority: 'normal',
                type: 'inquiry'
            },
            {
                id: '3',
                customerPhone: '010-5555-7777',
                waitTime: 203,
                priority: 'normal',
                type: 'support'
            }
        ];
        setWaitingCalls(sampleCalls);
    };

    const handleStatusChange = (newStatus: AgentStatus) => {
        setAgentStatus(newStatus);
        if (newStatus === 'available' && waitingCalls.length > 0) {
            // 대기중인 통화가 있으면 자동 연결 시뮬레이션
            setTimeout(() => {
                const nextCall = waitingCalls[0];
                setCurrentCall(nextCall);
                setWaitingCalls(prev => prev.slice(1));
                setAgentStatus('busy');
                setCallDuration(0);
                setCustomerNotes('');
            }, 2000);
        }
    };

    const handleEndCall = () => {
        setCurrentCall(null);
        setCallDuration(0);
        setCustomerNotes('');
        setAgentStatus('available');

        // 다음 통화가 있으면 자동 연결
        setTimeout(() => {
            if (waitingCalls.length > 0) {
                const nextCall = waitingCalls[0];
                setCurrentCall(nextCall);
                setWaitingCalls(prev => prev.slice(1));
                setAgentStatus('busy');
                setCallDuration(0);
            }
        }, 1000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleBackToLauncher = async () => {
        try {
            await invoke('switch_window', {
                fromLabel: 'callinbound',
                toWindowType: 'Launcher'
            });
        } catch (error) {
            console.error('런처로 돌아가기 실패:', error);
        }
    };

    const getStatusColor = (status: AgentStatus) => {
        switch (status) {
            case 'available': return 'bg-green-500';
            case 'busy': return 'bg-red-500';
            case 'break': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-500';
        }
    };

    const getStatusText = (status: AgentStatus) => {
        switch (status) {
            case 'available': return '대기중';
            case 'busy': return '통화중';
            case 'break': return '휴식중';
            case 'offline': return '오프라인';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'normal': return 'bg-blue-100 text-blue-800';
            case 'low': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'high': return '긴급';
            case 'normal': return '일반';
            case 'low': return '낮음';
            default: return '일반';
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'inquiry': return '문의';
            case 'complaint': return '불만';
            case 'support': return '지원';
            default: return '기타';
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={handleBackToLauncher}
                        style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            background: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        ← 메인
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#2563eb',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            📞
                        </div>
                        <div>
                            <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                인바운드 상담
                            </h1>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                                고객 문의 자동 분배
                            </p>
                        </div>
                    </div>
                </div>

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                                {user.name}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                                {user.department}
                            </p>
                        </div>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%'
                        }} className={getStatusColor(agentStatus)}></div>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                            {getStatusText(agentStatus)}
                        </span>
                    </div>
                )}
            </header>

            <div style={{ flex: 1, display: 'flex' }}>
                {/* 사이드바 - 상담원 상태 및 대기열 */}
                <aside style={{
                    width: '320px',
                    backgroundColor: 'white',
                    borderRight: '1px solid #e5e7eb',
                    padding: '16px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* 상담원 상태 */}
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                                상담원 상태
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {(['available', 'break'] as const).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        disabled={currentCall !== null}
                                        style={{
                                            padding: '8px 12px',
                                            fontSize: '12px',
                                            border: agentStatus === status ? '2px solid #2563eb' : '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            background: agentStatus === status ? '#eff6ff' : 'white',
                                            color: agentStatus === status ? '#2563eb' : '#374151',
                                            cursor: currentCall !== null ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {status === 'available' ? '대기중' : '휴식중'}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handleStatusChange('offline')}
                                    disabled={currentCall !== null}
                                    style={{
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        border: agentStatus === 'offline' ? '2px solid #2563eb' : '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        background: agentStatus === 'offline' ? '#eff6ff' : 'white',
                                        color: agentStatus === 'offline' ? '#2563eb' : '#374151',
                                        cursor: currentCall !== null ? 'not-allowed' : 'pointer',
                                        gridColumn: 'span 2'
                                    }}
                                >
                                    오프라인
                                </button>
                            </div>
                        </div>

                        {/* 현재 통화 정보 */}
                        {currentCall && (
                            <div style={{
                                backgroundColor: '#dbeafe',
                                padding: '16px',
                                borderRadius: '8px'
                            }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                                    현재 통화
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>고객번호:</span>
                                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>{currentCall.customerPhone}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>고객명:</span>
                                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>
                                            {currentCall.customerName || '미등록'}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>통화시간:</span>
                                        <span style={{ marginLeft: '8px', fontWeight: '500', color: '#dc2626' }}>
                                            {formatTime(callDuration)}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>문의유형:</span>
                                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>{getTypeText(currentCall.type)}</span>
                                    </div>
                                    <div style={{ display: 'inline-block', fontSize: '10px', padding: '2px 8px', borderRadius: '12px' }}
                                        className={getPriorityColor(currentCall.priority)}>
                                        {getPriorityText(currentCall.priority)}
                                    </div>
                                </div>
                                <button
                                    onClick={handleEndCall}
                                    style={{
                                        width: '100%',
                                        marginTop: '12px',
                                        padding: '8px',
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    통화 종료
                                </button>
                            </div>
                        )}

                        {/* 대기 중인 통화 */}
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                                대기 중인 통화 ({waitingCalls.length})
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                maxHeight: '240px',
                                overflowY: 'auto'
                            }}>
                                {waitingCalls.map((call) => (
                                    <div key={call.id} style={{
                                        backgroundColor: '#f9fafb',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}>
                                        <div style={{ fontWeight: '500' }}>{call.customerPhone}</div>
                                        <div style={{ color: '#6b7280' }}>대기: {formatTime(call.waitTime)}</div>
                                        <div style={{ color: '#6b7280' }}>{getTypeText(call.type)}</div>
                                        <div style={{
                                            display: 'inline-block',
                                            fontSize: '10px',
                                            padding: '2px 6px',
                                            borderRadius: '8px',
                                            marginTop: '4px'
                                        }} className={getPriorityColor(call.priority)}>
                                            {getPriorityText(call.priority)}
                                        </div>
                                    </div>
                                ))}
                                {waitingCalls.length === 0 && (
                                    <div style={{
                                        textAlign: 'center',
                                        color: '#6b7280',
                                        padding: '16px'
                                    }}>
                                        대기 중인 통화가 없습니다
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 메인 영역 - 상담 화면 */}
                <main style={{ flex: 1, padding: '24px' }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        height: '100%',
                        padding: '24px'
                    }}>
                        {currentCall ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                                    고객 상담 진행중
                                </h2>

                                {/* 고객 정보 */}
                                <div style={{
                                    backgroundColor: '#f9fafb',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    marginBottom: '24px'
                                }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>고객 정보</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#6b7280' }}>전화번호</label>
                                            <div style={{ fontSize: '16px', fontWeight: '500' }}>{currentCall.customerPhone}</div>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#6b7280' }}>고객명</label>
                                            <input
                                                type="text"
                                                placeholder="고객명 입력"
                                                defaultValue={currentCall.customerName || ''}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#6b7280' }}>문의유형</label>
                                            <div style={{ fontSize: '16px', fontWeight: '500' }}>{getTypeText(currentCall.type)}</div>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#6b7280' }}>우선순위</label>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }} className={getPriorityColor(currentCall.priority)}>
                                                {getPriorityText(currentCall.priority)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 상담 메모 */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>상담 내용</h3>
                                    <textarea
                                        value={customerNotes}
                                        onChange={(e) => setCustomerNotes(e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            padding: '16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            resize: 'none',
                                            fontSize: '14px'
                                        }}
                                        placeholder="상담 내용을 입력하세요..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        fontSize: '24px'
                                    }}>
                                        📞
                                    </div>
                                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                                        통화 대기중
                                    </h2>
                                    <p style={{ color: '#6b7280' }}>
                                        {agentStatus === 'available'
                                            ? '고객 전화를 대기하고 있습니다'
                                            : '상담원 상태를 "대기중"으로 변경하세요'}
                                    </p>
                                    {waitingCalls.length > 0 && agentStatus === 'available' && (
                                        <p style={{ fontSize: '12px', color: '#2563eb', marginTop: '8px' }}>
                                            {waitingCalls.length}명의 고객이 대기 중입니다
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CallInboundApp;