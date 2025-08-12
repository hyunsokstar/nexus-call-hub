import { apiClient } from '@/shared/api/client'

export interface Room {
    id: string
    name: string
    lastMessage?: string
}

export async function fetchRooms(signal?: AbortSignal): Promise<Room[]> {
    const res = await apiClient.get<Room[]>('/api/chatting/rooms', { signal })
    return res.data
}
