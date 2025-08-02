// C:\pilot-tauri\nexus-call-hub\src\settings\SettingsApp.tsx
import { useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/shared/ui/button"

function SettingsApp() {
    const [settings, setSettings] = useState({
        autoAnswer: false,
        soundEnabled: true,
        volume: 75,
        theme: 'light',
        language: 'ko',
        startWithWindows: true,
        minimizeToTray: false,
    })

    const handleClose = async () => {
        try {
            await invoke('close_window', { label: 'settings' })
        } catch (error) {
            console.error("윈도우 닫기 실패:", error)
        }
    }

    const handleSave = () => {
        // 설정 저장 로직 (추후 구현)
        console.log("설정 저장:", settings)
        // 저장 완료 후 닫기
        handleClose()
    }

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">⚙️</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">환경설정</h1>
                            <p className="text-xs text-gray-500">애플리케이션 설정</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleClose}
                            variant="outline"
                            className="text-sm px-3 py-1"
                        >
                            취소
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700"
                        >
                            저장
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* 통화 설정 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">통화 설정</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">자동 응답</label>
                                    <p className="text-xs text-gray-500">수신 통화를 자동으로 받습니다</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.autoAnswer}
                                        onChange={(e) => updateSetting('autoAnswer', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">소리 활성화</label>
                                    <p className="text-xs text-gray-500">알림음 및 벨소리를 재생합니다</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.soundEnabled}
                                        onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    볼륨: {settings.volume}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.volume}
                                    onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 일반 설정 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">일반 설정</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">테마</label>
                                <select
                                    value={settings.theme}
                                    onChange={(e) => updateSetting('theme', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="light">라이트</option>
                                    <option value="dark">다크</option>
                                    <option value="auto">시스템 설정</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">언어</label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => updateSetting('language', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="ko">한국어</option>
                                    <option value="en">English</option>
                                    <option value="ja">日本語</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 시스템 설정 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">시스템 설정</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Windows 시작 시 실행</label>
                                    <p className="text-xs text-gray-500">컴퓨터 시작 시 자동으로 실행됩니다</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.startWithWindows}
                                        onChange={(e) => updateSetting('startWithWindows', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">트레이로 최소화</label>
                                    <p className="text-xs text-gray-500">닫기 시 시스템 트레이로 최소화됩니다</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.minimizeToTray}
                                        onChange={(e) => updateSetting('minimizeToTray', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 정보 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">애플리케이션 정보</h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>버전</span>
                                <span>1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span>빌드</span>
                                <span>2024.01.15</span>
                            </div>
                            <div className="flex justify-between">
                                <span>개발사</span>
                                <span>Nexus Systems</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SettingsApp