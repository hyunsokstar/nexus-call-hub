import React from 'react'
import { Link } from '@tanstack/react-router'
import { useRooms } from '../hooks/useRooms'

const RoomsListPage: React.FC = () => {
    const { data, isLoading, isError, error, refetch, isFetching } = useRooms()

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days === 0) {
            return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        } else if (days === 1) {
            return '어제'
        } else if (days < 7) {
            return `${days}일 전`
        } else {
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
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
                    <li key={room.id} className="p-3 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-gray-900 truncate">{room.name}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>
                                        생성자: {room.creator.username || 'Unknown'}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        생성일: {formatDate(room.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <Link
                                to="/rooms/$roomId"
                                params={{ roomId: room.id }}
                                className="group relative text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:text-sky-700 transition-all duration-300 ease-out overflow-hidden
                                          before:absolute before:inset-0 before:bg-gradient-to-r before:from-sky-50 before:to-sky-100 
                                          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:ease-out
                                          hover:border-sky-200 hover:shadow-sm"
                            >
                                <span className="relative z-10">입장</span>
                            </Link>
                        </div>
                    </li>
                ))}
                {data && data.length === 0 && (
                    <li className="p-4 text-sm text-gray-500 text-center">
                        <div className="py-8">
                            <div className="text-gray-400 mb-2">💬</div>
                            <div>채팅방이 없습니다.</div>
                            <div className="text-xs mt-1">새로운 채팅방을 만들어보세요!</div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default RoomsListPage
