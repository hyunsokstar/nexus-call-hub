import React from 'react'
import { useParams } from '@tanstack/react-router'

const RoomPage: React.FC = () => {
    const { roomId } = useParams({ from: '/rooms/$roomId' as any })
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold">방: {roomId}</h2>
            <div className="mt-3 text-sm text-gray-600">메시지 목록/입력 UI가 여기에 표시됩니다.</div>
        </div>
    )
}

export default RoomPage
