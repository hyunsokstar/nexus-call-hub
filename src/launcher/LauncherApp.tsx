import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface User {
    id: string;
    name: string;
    department: string;
}

function LauncherApp() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [appStatus, setAppStatus] = useState('대기 중');

    const handleLoginClick = async () => {
        try {
            console.log('로그인 버튼 클릭됨');
            alert('로그인 윈도우를 열 예정입니다.');
        } catch (error) {
            console.error('로그인 실패:', error);
        }
    };

    const handleCallClick = async () => {
        if (!isLoggedIn) {
            alert('먼저 로그인해주세요.');
            return;
        }

        try {
            console.log('전화 걸기 버튼 클릭됨');
            alert('전화 걸기 윈도우를 열 예정입니다.');
        } catch (error) {
            console.error('전화 걸기 실패:', error);
        }
    };

    const handleReceiveClick = async () => {
        if (!isLoggedIn) {
            alert('먼저 로그인해주세요.');
            return;
        }

        try {
            console.log('전화 받기 버튼 클릭됨');
            alert('전화 받기 기능을 시작합니다.');
        } catch (error) {
            console.error('전화 받기 실패:', error);
        }
    };

    const handleStatsClick = async () => {
        try {
            console.log('통계 버튼 클릭됨');
            alert('통계 윈도우를 열 예정입니다.');
        } catch (error) {
            console.error('통계 열기 실패:', error);
        }
    };

    const handleSettingsClick = async () => {
        try {
            console.log('환경설정 버튼 클릭됨');
            alert('환경설정 윈도우를 열 예정입니다.');
        } catch (error) {
            console.error('환경설정 열기 실패:', error);
        }
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white flex flex-col">
            {/* 헤더 */}
            <header className="p-6 text-center border-b border-white/20">
                <h1 className="text-3xl font-bold tracking-tight">Nexus Call Hub</h1>
                <div className="mt-2 inline-block px-3 py-1 bg-white/20 text-white border border-white/30 rounded-full text-sm">
                    v1.0.0
                </div>
            </header>

            {/* 사용자 정보 섹션 */}
            <div className="p-4">
                <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-lg">👤</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {isLoggedIn ? user?.name : '로그인 필요'}
                                </p>
                                <p className="text-xs text-white/70">상담사</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className={`inline-block px-2 py-1 rounded-full text-xs ${appStatus === '대기 중' ? 'bg-green-500/20 text-green-200 border border-green-400/30' : 'bg-white/20 text-white border border-white/30'
                                }`}>
                                {appStatus}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 메인 액션 버튼들 */}
            <div className="flex-1 p-6">
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    {/* 로그인 버튼 */}
                    <button
                        onClick={handleLoginClick}
                        disabled={isLoggedIn}
                        className={`launcher-button h-20 ${isLoggedIn ? 'launcher-button-login completed' : ''}`}
                    >
                        <div className="launcher-button-icon">👤</div>
                        <div className="launcher-button-text">
                            {isLoggedIn ? '로그인 완료' : '로그인'}
                        </div>
                    </button>

                    {/* 전화 걸기 버튼 */}
                    <button
                        onClick={handleCallClick}
                        disabled={!isLoggedIn}
                        className="launcher-button launcher-button-call h-20"
                    >
                        <div className="launcher-button-icon">📞</div>
                        <div className="launcher-button-text">전화 걸기</div>
                    </button>

                    {/* 전화 받기 버튼 */}
                    <button
                        onClick={handleReceiveClick}
                        disabled={!isLoggedIn}
                        className="launcher-button launcher-button-receive h-20"
                    >
                        <div className="launcher-button-icon">📲</div>
                        <div className="launcher-button-text">전화 받기</div>
                    </button>

                    {/* 통계 버튼 */}
                    <button
                        onClick={handleStatsClick}
                        className="launcher-button launcher-button-stats h-20"
                    >
                        <div className="launcher-button-icon">📊</div>
                        <div className="launcher-button-text">통계</div>
                    </button>

                    {/* 환경설정 버튼 - 전체 너비 */}
                    <div className="col-span-2">
                        <button
                            onClick={handleSettingsClick}
                            className="launcher-button launcher-button-settings w-full h-16"
                        >
                            <div className="flex items-center justify-center space-x-3">
                                <span className="text-lg">⚙️</span>
                                <span className="text-sm font-medium">환경설정</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* 푸터 */}
            <footer className="p-4 border-t border-white/20">
                <div className="flex justify-between items-center text-xs text-white/70">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>시스템 상태: 정상</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>서버 연결: 연결됨</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LauncherApp;