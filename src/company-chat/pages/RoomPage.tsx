import React, { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: string
}

const RoomPage: React.FC = () => {
  const { roomId } = useParams({ from: '/rooms/$roomId' as any })
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '안녕하세요! 이 방에 오신 것을 환영합니다.', sender: '시스템', timestamp: '09:00' },
    { id: '2', text: '좋은 하루 되세요!', sender: '사용자A', timestamp: '09:05' },
    { id: '3', text: '회의 준비는 잘 되고 있나요?', sender: '사용자B', timestamp: '09:10' },
  ])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: '나',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMessage])
    setMessage('')
  }

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Link to="/rooms" className="text-sm px-2 py-1 border rounded hover:bg-white">← 목록</Link>
          <h2 className="font-semibold">채팅방 {roomId}</h2>
        </div>
        <div className="text-xs text-gray-500">참여자 3명</div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === '나' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
              msg.sender === '나' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              {msg.sender !== '나' && (
                <div className="text-xs opacity-70 mb-1">{msg.sender}</div>
              )}
              <div>{msg.text}</div>
              <div className="text-xs opacity-70 mt-1">{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 메시지 입력 */}
      <form onSubmit={sendMessage} className="p-3 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  )
}

export default RoomPage