import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRooms, Room, createRoomApi, deleteRoomApi } from '../api/rooms'

export function useRooms() {
  return useQuery<Room[]>({
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

export function useDeleteRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteRoomApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-chat', 'rooms'] })
    },
  })
}