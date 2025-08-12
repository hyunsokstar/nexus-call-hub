import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRooms, createRoomApi } from '../api/rooms'
import { ChatRoom } from '@/shared/api/types'

export function useRooms() {
    return useQuery<ChatRoom[]>({
        queryKey: ['company-chat', 'rooms'],
        queryFn: ({ signal }) => fetchRooms(signal),
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })
}

export function useCreateRoom() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createRoomApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['company-chat', 'rooms'] })
        },
    })
}
