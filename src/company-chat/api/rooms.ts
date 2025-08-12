import { apiClient } from '@/shared/api/client'
import { ChatRoom } from '@/shared/api/types'

export async function fetchRooms(signal?: AbortSignal): Promise<ChatRoom[]> {
    const res = await apiClient.get<ChatRoom[]>('/api/chatting/rooms', { signal })
    return res.data
}

export async function createRoomApi(params: { name: string; description?: string }) {
    const res = await apiClient.post('/api/chatting/rooms', params)
    return res.data
}
