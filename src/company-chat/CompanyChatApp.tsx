import React, { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import CommonHeader from '@/widgets/CommonHeader'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import CreateRoomDialog from './components/CreateRoomDialog'

const CompanyChatApp: React.FC = () => {
    const win = getCurrentWindow()
    const [openCreate, setOpenCreate] = useState(false)

    const backToLauncher = async () => {
        try {
            await invoke('switch_window', {
                fromLabel: win.label,
                toWindowType: 'Launcher'
            })
        } catch (_) {
            await invoke('replace_all_windows', { windowType: 'Launcher' })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <CommonHeader
                title="Company Chat"
                subtitle="사내 채팅"
                showBackButton
                onBack={backToLauncher}
            />
            {/* 우측 상단: 방 추가 버튼 */}
            <div className="px-4 pt-3 flex justify-end">
                <button
                    onClick={() => setOpenCreate(true)}
                    className="text-xs px-3 py-1.5 border rounded bg-white hover:bg-gray-50 shadow-sm"
                >
                    방 추가
                </button>
            </div>
            {/* 본문 */}
            <main className="flex-1 bg-white rounded-md border m-4 p-4 overflow-hidden">
                <RouterProvider router={router} />
            </main>

            {/* 방 생성 다이얼로그 */}
            {openCreate && (
                <CreateRoomDialog open={openCreate} onOpenChange={setOpenCreate} />
            )}
        </div>
    )
}

export default CompanyChatApp
