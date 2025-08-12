import { useQuery } from '@tanstack/react-query'
import { fetchRooms, Room } from '../api/rooms'

export function useRooms() {
  return useQuery<Room[]>({
    queryKey: ['company-chat', 'rooms'],
    queryFn: ({ signal }) => fetchRooms(signal),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}
