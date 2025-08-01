// src/routes/settings.tsx
import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'

function SettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    autoAnswer: false,
    soundEnabled: true,
    recordCalls: true,
    theme: 'light'
  })

  const handleBack = () => {
    navigate({ to: '/' })
  }

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
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
              <p className="text-xs text-gray-500">환경설정</p>
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">환경설정</h2>
            <p className="text-gray-600">시스템 설정을 관리합니다</p>
          </div>

          <div className="space-y-6">
            {/* 통화 설정 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">통화 설정</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">자동 응답</p>
                    <p className="text-sm text-gray-600">수신 통화 자동으로 받기</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoAnswer}
                      onChange={(e) => handleSettingChange('autoAnswer', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">통화 녹음</p>
                    <p className="text-sm text-gray-600">모든 통화를 자동으로 녹음</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.recordCalls}
                      onChange={(e) => handleSettingChange('recordCalls', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* 사운드 설정 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">사운드 설정</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">사운드 활성화</p>
                    <p className="text-sm text-gray-600">알림음 및 효과음 재생</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                설정 저장
              </Button>
              <Button variant="outline" onClick={handleBack}>
                취소
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})