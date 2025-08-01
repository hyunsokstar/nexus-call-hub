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
    if (!isLoggedIn) return alert('먼저 로그인해주세요.');

    try {
      console.log('전화 걸기 버튼 클릭됨');
      alert('전화 걸기 윈도우를 열 예정입니다.');
    } catch (error) {
      console.error('전화 걸기 실패:', error);
    }
  };

  const handleReceiveClick = async () => {
    if (!isLoggedIn) return alert('먼저 로그인해주세요.');

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
    <main className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold">Nexus Call Hub</h1>
        <span className="text-sm text-gray-500">v1.0.0</span>
      </header>

      <section className="mb-4 grid gap-2 text-sm text-gray-700">
        <div>
          <span className="font-semibold">상담사: </span>
          <span>{isLoggedIn ? user?.name : '로그인 필요'}</span>
        </div>
        <div>
          <span className="font-semibold">상태: </span>
          <span>{appStatus}</span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <button
          className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-sm font-medium shadow-sm transition ${isLoggedIn ? 'bg-green-100' : 'hover:bg-gray-100'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          onClick={handleLoginClick}
          disabled={isLoggedIn}
        >
          <span className="text-2xl">👤</span>
          <span>{isLoggedIn ? '로그인 완료' : '로그인'}</span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-sm font-medium shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleCallClick}
          disabled={!isLoggedIn}
        >
          <span className="text-2xl">📞</span>
          <span>전화 걸기</span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-sm font-medium shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleReceiveClick}
          disabled={!isLoggedIn}
        >
          <span className="text-2xl">📲</span>
          <span>전화 받기</span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-sm font-medium shadow-sm transition hover:bg-gray-100"
          onClick={handleStatsClick}
        >
          <span className="text-2xl">📊</span>
          <span>통계</span>
        </button>

        <button
          className="flex flex-col items-center justify-center gap-1 rounded-lg border p-4 text-sm font-medium shadow-sm transition hover:bg-gray-100"
          onClick={handleSettingsClick}
        >
          <span className="text-2xl">⚙️</span>
          <span>환경설정</span>
        </button>
      </section>

      <footer className="mt-10 text-center text-xs text-gray-500">
        <p>시스템 상태: 정상</p>
        <p>서버 연결: 연결됨</p>
      </footer>
    </main>
  );
}

export default LauncherApp;
