import React from 'react'
import { invoke } from '@tauri-apps/api/core'
import CommonHeader from '@/widgets/CommonHeader'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

const CompanyChatApp: React.FC = () => {
    const win = getCurrentWindow()
    // const maximize = () => win.maximize()
    // const restore = () => win.unmaximize()
    // const toggleFullscreen = async () => {
    //     const isFull = await win.isFullscreen()
    //     await win.setFullscreen(!isFull)
    // }

    const backToLauncher = async () => {
        try {
            await invoke('switch_window', {
                // fromLabel: window.location.pathname.split('/').pop()?.replace('.html', '') || 'unknown',
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
            {/* Window controls (Optional) */}
            {/* <div className="px-4 pt-3 flex gap-2">
                <button onClick={maximize} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">최대화</button>
                <button onClick={restore} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">복원</button>
            </div> */}
            <main className="flex-1 bg-white rounded-md border m-4 p-4 overflow-hidden">
                <RouterProvider router={router} />
            </main>
        </div>
    )
}

export default CompanyChatApp
