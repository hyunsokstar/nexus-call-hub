import React, { useState } from 'react'
import { useCreateRoom } from '../hooks/useRooms'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

const CreateRoomDialog: React.FC<Props> = ({ open, onOpenChange, onCreated }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const createRoom = useCreateRoom()

    if (!open) return null

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createRoom.mutateAsync({ name, description })
            onOpenChange(false)
            onCreated?.()
            setName('')
            setDescription('')
        } catch (e) {
            console.error(e)
            alert('방 생성에 실패했습니다')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">새 채팅방 만들기</h3>
                    <button className="text-sm" onClick={() => onOpenChange(false)}>닫기</button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="block text-sm mb-1">방 이름</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">설명 (선택)</label>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => onOpenChange(false)} className="text-sm px-3 py-1.5 border rounded">취소</button>
                        <button type="submit" disabled={createRoom.isPending} className="text-sm px-3 py-1.5 border rounded bg-blue-600 text-white disabled:opacity-60">
                            {createRoom.isPending ? '생성 중...' : '생성'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateRoomDialog
