// src/routes/statistics.tsx
import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'

function StatisticsPage() {
  const navigate = useNavigate()

  const handleBack = () => {
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
              <p className="text-xs text-gray-500">통계</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700"
          >
            ← 돌아가기
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">통화 통계</h2>
            <p className="text-gray-600">통화 기록 및 성과 분석</p>
          </div>

          {/* 통계 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">
                  📞
                </div>
                <h3 className="font-medium text-gray-900">총 통화</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">127</p>
              <p className="text-sm text-green-600">+12% 전월 대비</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm">
                  ⏱️
                </div>
                <h3 className="font-medium text-gray-900">평균 통화시간</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">3분 24초</p>
              <p className="text-sm text-green-600">+8% 전월 대비</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">
                  ✅
                </div>
                <h3 className="font-medium text-gray-900">성공률</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">89.2%</p>
              <p className="text-sm text-green-600">+2.1% 전월 대비</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm">
                  😊
                </div>
                <h3 className="font-medium text-gray-900">만족도</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">4.6/5</p>
              <p className="text-sm text-green-600">+0.2 전월 대비</p>
            </div>
          </div>

          {/* 차트 영역 (임시) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">주간 통화 현황</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">차트 영역 (구현 예정)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/statistics')({
  component: StatisticsPage,
})