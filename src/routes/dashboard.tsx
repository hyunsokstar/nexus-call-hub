// src/routes/dashboard.tsx
import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'

function DashboardPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Nexus Call Hub</h1>
              <p className="text-xs text-gray-500">통화 대시보드</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700"
          >
            로그아웃
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">통화 대시보드</h2>
            <p className="text-gray-600">전화 걸기, 받기 및 통화 관리</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 통화 걸기 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl">
                  📞
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">전화 걸기</h3>
                  <p className="text-sm text-gray-600">고객에게 발신</p>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                통화 시작
              </Button>
            </div>

            {/* 통화 받기 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                  📲
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">통화 받기</h3>
                  <p className="text-sm text-gray-600">수신 대기</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                대기 모드
              </Button>
            </div>

            {/* 통화 기록 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl">
                  📋
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">통화 기록</h3>
                  <p className="text-sm text-gray-600">최근 통화 내역</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                기록 보기
              </Button>
            </div>
          </div>

          {/* 최근 통화 */}
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">최근 통화</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                    📞
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">010-1234-5678</p>
                    <p className="text-sm text-gray-600">발신 • 5분 전</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2분 30초</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">
                    📲
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">010-9876-5432</p>
                    <p className="text-sm text-gray-600">수신 • 15분 전</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">1분 45초</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})