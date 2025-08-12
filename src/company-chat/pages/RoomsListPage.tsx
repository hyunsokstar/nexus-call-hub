import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useRooms, useDeleteRoom } from '../hooks/useRooms'
import { useUser } from '@/shared/hooks/useUser'
import HeadlessButton from '@/shared/headless/button'
import { Trash2 } from 'lucide-react'
import Toast from '@/shared/components/Toast'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

const RoomsListPage: React.FC = () => {
    const { data, isLoading, isError, error, refetch, isFetching } = useRooms()
    const { user, isLoggedIn } = useUser()
    const deleteRoom = useDeleteRoom()
    const [toast, setToast] = useState<ToastState | null>(null)

    const showToast = (message: string, type: ToastState['type']) => {
        setToast({ message, type })
    }

    const handleDeleteRoom = async (roomId: string, roomName: string) => {
        if (!confirm('정말로 이 채팅방을 삭제하시겠습니까?')) return

        try {
            await deleteRoom.mutateAsync(roomId)
            showToast(`"${roomName}" 채팅방이 삭제되었습니다.`, 'success')
            console.log('방 삭제 성공:', roomId)
        } catch (error) {
            console.error('방 삭제 실패:', error)
            showToast('채팅방 삭제에 실패했습니다.', 'error')
        }
    }

    if (isLoading) return <div className="p-4 text-sm text-gray-500">불러오는 중...</div>
    if (isError) return (
        <div className="p-4 text-sm text-red-600">
            목록을 불러오지 못했습니다. <button onClick={() => refetch()} className="underline">다시 시도</button>
            <div className="text-xs text-gray-500 mt-1">{(error as Error).message}</div>
        </div>
    )

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">채팅방 목록</h2>
                <button className="text-sm px-2 py-1 border rounded" onClick={() => refetch()} disabled={isFetching}>
                    {isFetching ? '새로고침 중...' : '새로고침'}
                </button>
            </div>
            <ul className="divide-y border rounded bg-white">
                {data?.map((room) => (
                    <li key={room.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-gray-900">{room.name}</div>
                                <div className="text-xs text-gray-500">
                                    {new Date(room.createdAt).toLocaleDateString('ko-KR', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="inline-flex items-center">
                                        👤 {room.creator.username}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span>메시지 {room.messageCount}개</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* 현재 유저가 만든 방인 경우 삭제 버튼 표시 */}
                                    {isLoggedIn && user && room.creator.username === user.name && (
                                        <button
                                            onClick={() => handleDeleteRoom(room.id, room.name)}
                                            disabled={deleteRoom.isPending}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                            title="채팅방 삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}

                                    <Link to="/rooms/$roomId" params={{ roomId: room.id }}>
                                        <HeadlessButton className="text-sm px-3 py-1.5 border rounded bg-white relative overflow-hidden group transition-all duration-500 hover:text-white hover:border-blue-300">
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform scale-x-0 group-hover:scale-x-150 transition-all duration-500 origin-center blur-sm opacity-0 group-hover:opacity-80"></span>
                                            <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-blue-500 to-blue-400/20 transform scale-x-0 group-hover:scale-x-110 transition-all duration-300 origin-center"></span>
                                            <span className="relative z-10">입장</span>
                                        </HeadlessButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
                {data && data.length === 0 && (
                    <li className="p-4 text-sm text-gray-500">채팅방이 없습니다.</li>
                )}
            </ul>

            {/* Toast 알림 */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}

export default RoomsListPage
