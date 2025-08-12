import { apiClient } from '@/shared/api/client'

export interface Room {
  id: string
  name: string
  creator: {
    id: number | null
    username: string
  }
  createdAt: string
  messageCount: number
  lastMessageAt: string | null
  lastMessage?: string
}

export async function fetchRooms(signal?: AbortSignal): Promise<Room[]> {
  const res = await apiClient.get<Room[]>('/api/chatting/rooms', { signal })
  return res.data
}

export async function createRoomApi(params: { name: string; description?: string }) {
  const res = await apiClient.post('/api/chatting/rooms', params)
  return res.data
}

export async function deleteRoomApi(roomId: string) {
  const res = await apiClient.delete(`/api/chatting/rooms/${roomId}`)
  return res.data
}