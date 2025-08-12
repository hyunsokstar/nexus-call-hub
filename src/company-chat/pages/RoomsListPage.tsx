import React from 'react'
import { Link } from '@tanstack/react-router'
import { useRooms } from '../hooks/useRooms'

const RoomsListPage: React.FC = () => {
    const { data, isLoading, isError, error, refetch, isFetching } = useRooms()

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
                    <li key={room.id} className="p-3 hover:bg-gray-50 flex items-center justify-between">
                        <div>
                            <div className="font-medium">{room.name}</div>
                            {room.lastMessage && <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{room.lastMessage}</div>}
                        </div>
                        <Link to="/rooms/$roomId" params={{ roomId: room.id }} className="text-sm px-2 py-1 border rounded hover:bg-gray-50">입장</Link>
                    </li>
                ))}
                {data && data.length === 0 && (
                    <li className="p-4 text-sm text-gray-500">채팅방이 없습니다.</li>
                )}
            </ul>
        </div>
    )
}

export default RoomsListPage
