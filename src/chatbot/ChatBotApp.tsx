// import React, { useState, useRef, useEffect } from 'react'
// import { useChatbot } from '../shared/hooks/useChatbot'
// import { Input } from '../shared/ui/input'
// // Card 관련 import 제거 (사용하지 않음)
// import CommonHeader from '@/widgets/CommonHeader'
// import { Button } from '../shared/components/Button'
// import { Send, Trash2, MessageCircle, Clock, HelpCircle } from 'lucide-react'

// interface Message {
//     id: string
//     text: string
//     sender: 'user' | 'bot'
//     timestamp: Date
// }

// const ChatBotApp: React.FC = () => {
//     const chatbotMutation = useChatbot();
//     const [messages, setMessages] = useState<Message[]>([
//         {
//             id: '1',
//             text: '안녕하세요! 챗봇 테스트에 오신 것을 환영합니다. 무엇을 도와드릴까요?',
//             sender: 'bot',
//             timestamp: new Date()
//         }
//     ])
//     const [inputMessage, setInputMessage] = useState('')
//     const [isLoading, setIsLoading] = useState(false)
//     const messagesEndRef = useRef<HTMLDivElement>(null)

//     // 메시지가 추가될 때마다 하단으로 스크롤
//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//     }

//     useEffect(() => {
//         scrollToBottom()
//     }, [messages])

//     // 봇 응답 시뮬레이션
//     const getBotResponse = (userMessage: string): string => {
//         const lowerMessage = userMessage.toLowerCase()

//         if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
//             return '안녕하세요! 좋은 하루 되세요!'
//         } else if (lowerMessage.includes('도움') || lowerMessage.includes('help')) {
//             return '무엇을 도와드릴까요? 질문하시면 최선을 다해 답변드리겠습니다.'
//         } else if (lowerMessage.includes('시간') || lowerMessage.includes('time')) {
//             return `현재 시간은 ${new Date().toLocaleTimeString('ko-KR')}입니다.`
//         } else if (lowerMessage.includes('날씨') || lowerMessage.includes('weather')) {
//             return '죄송합니다. 실시간 날씨 정보는 제공하지 않습니다. 날씨 앱을 확인해주세요.'
//         } else if (lowerMessage.includes('이름') || lowerMessage.includes('name')) {
//             return '저는 Nexus Call Hub 챗봇입니다. 테스트용 봇이에요!'
//         } else {
//             return '흥미로운 질문이네요! 더 자세한 정보가 필요하다면 구체적으로 물어보세요.'
//         }
//     }

//     const handleSendMessage = async () => {
//         if (!inputMessage.trim()) return

//         const userMessage: Message = {
//             id: Date.now().toString(),
//             text: inputMessage,
//             sender: 'user',
//             timestamp: new Date()
//         }

//         setMessages(prev => [...prev, userMessage])
//         setInputMessage('')
//         setIsLoading(true)

//         chatbotMutation.mutate(
//             { message: inputMessage },
//             {
//                 onSuccess: (data) => {
//                     const botMessage: Message = {
//                         id: (Date.now() + 1).toString(),
//                         text: data.response,
//                         sender: 'bot',
//                         timestamp: new Date()
//                     }
//                     setMessages(prev => [...prev, botMessage])
//                     setIsLoading(false)
//                 },
//                 onError: () => {
//                     const botMessage: Message = {
//                         id: (Date.now() + 1).toString(),
//                         text: '서버 오류가 발생했습니다.',
//                         sender: 'bot',
//                         timestamp: new Date()
//                     }
//                     setMessages(prev => [...prev, botMessage])
//                     setIsLoading(false)
//                 }
//             }
//         )
//     }

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault()
//             handleSendMessage()
//         }
//     }

//     const clearChat = () => {
//         setMessages([
//             {
//                 id: '1',
//                 text: '안녕하세요! 챗봇 테스트에 오신 것을 환영합니다. 무엇을 도와드릴까요?',
//                 sender: 'bot',
//                 timestamp: new Date()
//             }
//         ])
//     }

//     return (
//         <div className="h-screen bg-white flex flex-col py-6">
//             <CommonHeader
//                 title="챗봇 테스트"
//                 subtitle="AI 챗봇과 대화해보세요"
//             />
//             <div className="my-2" />
//             <main className="flex-1 flex items-center justify-center min-h-0">
//                 <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 h-full min-h-0">
//                     {/* 채팅 영역 */}
//                     <section className="lg:col-span-4 flex flex-col rounded-2xl border bg-card shadow-sm h-full min-h-0 flex-1">
//                         <header className="flex items-center justify-between px-6 py-4 border-b bg-muted rounded-t-2xl">
//                             <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
//                                 <span className="inline-block"><MessageCircle size={20} className="text-primary" /></span>
//                                 채팅
//                             </h2>
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={clearChat}
//                                 icon={<Trash2 size={16} />}
//                                 className="text-destructive"
//                             >
//                                 초기화
//                             </Button>
//                         </header>
//                         <div className="flex-1 flex flex-col overflow-hidden min-h-0">
//                             {/* 메시지 목록 */}
//                             <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-0 mb-4">
//                                 {messages.map((message) => (
//                                     <div
//                                         key={message.id}
//                                         className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                                     >
//                                         <div
//                                             className={`max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm ${message.sender === 'user'
//                                                 ? 'bg-primary text-primary-foreground'
//                                                 : 'bg-muted text-muted-foreground border border-border'
//                                                 }`}
//                                         >
//                                             <span>{message.text}</span>
//                                             <span className="block text-xs opacity-60 mt-1 text-right">
//                                                 {message.timestamp.toLocaleTimeString('ko-KR')}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 {isLoading && (
//                                     <div className="flex justify-start">
//                                         <div className="bg-muted rounded-lg px-3 py-2 animate-pulse text-xs text-muted-foreground">답변 생성 중...</div>
//                                     </div>
//                                 )}
//                                 <div ref={messagesEndRef} />
//                             </div>
//                             {/* 입력 영역 - 항상 하단 고정 */}
//                             <form
//                                 className="border-t bg-white px-4 py-4 flex gap-2 rounded-b-2xl"
//                                 onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
//                                 style={{ minHeight: 56 }}
//                             >
//                                 <Input
//                                     value={inputMessage}
//                                     onChange={e => setInputMessage(e.target.value)}
//                                     onKeyPress={handleKeyPress}
//                                     placeholder="메시지를 입력하세요..."
//                                     className="flex-1 h-10 text-sm"
//                                     disabled={isLoading}
//                                     autoFocus
//                                 />
//                                 <Button
//                                     type="submit"
//                                     disabled={!inputMessage.trim() || isLoading}
//                                     variant="default"
//                                     size="icon"
//                                     icon={<Send size={18} />}
//                                     loading={isLoading}
//                                     className="h-10 w-10"
//                                 />
//                             </form>
//                         </div>
//                     </section>
//                     {/* 테스트 패널 */}
//                     <aside className="lg:col-span-1 flex flex-col rounded-2xl border bg-card shadow-sm h-full min-h-0">
//                         <header className="px-6 py-4 border-b bg-muted rounded-t-2xl">
//                             <h3 className="text-base font-semibold text-muted-foreground">빠른 테스트</h3>
//                         </header>
//                         <div className="flex-1 flex flex-col gap-3 p-6">
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setInputMessage('안녕하세요')}
//                                 icon={<MessageCircle size={16} />}
//                                 className="w-full justify-start"
//                             >
//                                 인사하기
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setInputMessage('지금 몇 시인가요?')}
//                                 icon={<Clock size={16} />}
//                                 className="w-full justify-start"
//                             >
//                                 시간 묻기
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setInputMessage('도움이 필요해요')}
//                                 icon={<HelpCircle size={16} />}
//                                 className="w-full justify-start"
//                             >
//                                 도움 요청
//                             </Button>
//                         </div>
//                     </aside>
//                 </div>
//             </main>
//         </div>
//     )
// }

// export default ChatBotApp

import React, { useState, useRef, useEffect } from 'react'
import { useChatbot } from '../shared/hooks/useChatbot'
import { Input } from '../shared/ui/input'
import CommonHeader from '@/widgets/CommonHeader'
import { Button } from '../shared/components/Button'
import { Send, Trash2, MessageCircle, Clock, HelpCircle, Zap, Film, Globe, Code } from 'lucide-react'

interface Message {
    id: string
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
    isStreaming?: boolean
}

const ChatBotApp: React.FC = () => {
    const {
        normalChat,
        streamingChatMutation,
        isStreaming,
        currentStreamingMessage
    } = useChatbot();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '안녕하세요! 🤖 AI 챗봇에 오신 것을 환영합니다.\n\n• 💬 일반 채팅\n• ⚡ 실시간 스트리밍\n• 🎬 영화 추천\n• 🌍 번역 기능\n• 👨‍💻 코드 리뷰\n\n무엇을 도와드릴까요?',
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [useStreaming, setUseStreaming] = useState(true) // 스트리밍 모드 토글
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // 🔥 디버깅: currentStreamingMessage 변화 추적
    useEffect(() => {
        console.log('🎯 ChatBot: currentStreamingMessage 변경됨');
        console.log('🎯 ChatBot: 길이:', currentStreamingMessage?.length || 0);
        console.log('🎯 ChatBot: 처음 50자:', JSON.stringify(currentStreamingMessage?.substring(0, 50)));
        console.log('🎯 ChatBot: 마지막 50자:', JSON.stringify(currentStreamingMessage?.substring(-50)));

        // DOM에서 실제 렌더링되는 요소 확인
        const streamingElement = document.querySelector('[data-streaming-message]');
        console.log('🎯 DOM 요소 존재:', !!streamingElement);
        if (streamingElement) {
            console.log('🎯 DOM 내용:', streamingElement.textContent?.substring(0, 50));
        }
    }, [currentStreamingMessage]);

    // 메시지가 추가될 때마다 하단으로 스크롤
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, currentStreamingMessage])

    // 🔥 스트리밍 채팅 처리 (TanStack Query 방식)
    const handleStreamingChat = async (message: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])

        try {
            const finalResponse = await streamingChatMutation.mutateAsync(message);

            // 스트리밍 완료 후 최종 메시지 추가
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: finalResponse,
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botMessage])

        } catch (error) {
            console.error('Streaming error:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: '스트리밍 중 오류가 발생했습니다. 다시 시도해주세요.',
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        }
    }

    // 💬 일반 채팅 처리
    const handleNormalChat = (message: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])

        normalChat.mutate(
            { message },
            {
                onSuccess: (data) => {
                    const botMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        text: data.response,  // 원본 텍스트 저장
                        sender: 'bot',
                        timestamp: new Date()
                    }
                    setMessages(prev => [...prev, botMessage])
                },
                onError: (error) => {
                    console.error('Chat error:', error)
                    const errorMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        text: '서버 오류가 발생했습니다. 다시 시도해주세요.',
                        sender: 'bot',
                        timestamp: new Date()
                    }
                    setMessages(prev => [...prev, errorMessage])
                }
            }
        )
    }

    // 메시지 전송 메인 함수
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return

        const messageToSend = inputMessage.trim()
        setInputMessage('')

        if (useStreaming) {
            await handleStreamingChat(messageToSend)
        } else {
            handleNormalChat(messageToSend)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const clearChat = () => {
        setMessages([
            {
                id: '1',
                text: '안녕하세요! 🤖 AI 챗봇에 오신 것을 환영합니다.\n\n• 💬 일반 채팅\n• ⚡ 실시간 스트리밍\n• 🎬 영화 추천\n• 🌍 번역 기능\n• 👨‍💻 코드 리뷰\n\n무엇을 도와드릴까요?',
                sender: 'bot',
                timestamp: new Date()
            }
        ])
    }

    // 빠른 테스트 메시지들
    const quickTests = [
        {
            icon: <MessageCircle size={16} />,
            label: '인사하기',
            message: '안녕하세요! 오늘 기분이 어떠세요?'
        },
        {
            icon: <Clock size={16} />,
            label: '시간 묻기',
            message: '지금 몇 시인가요?'
        },
        {
            icon: <HelpCircle size={16} />,
            label: '도움 요청',
            message: 'Spring Boot에 대해 설명해주세요'
        },
        {
            icon: <Film size={16} />,
            label: '영화 추천',
            message: '톰 행크스 주연 영화를 추천해주세요'
        },
        {
            icon: <Globe size={16} />,
            label: '번역 요청',
            message: '"Hello World"를 한국어로 번역해주세요'
        },
        {
            icon: <Code size={16} />,
            label: '코드 리뷰',
            message: 'Java Hello World 코드를 작성하고 리뷰해주세요'
        }
    ]

    const isLoading = normalChat.isPending || isStreaming

    return (
        <div className="h-screen bg-white flex flex-col py-6">
            <CommonHeader
                title="AI 챗봇 테스트"
                subtitle="실시간 스트리밍과 다양한 AI 기능을 체험해보세요"
            />
            <div className="my-2" />
            <main className="flex-1 flex items-center justify-center min-h-0">
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 h-full min-h-0">
                    {/* 채팅 영역 */}
                    <section className="lg:col-span-4 flex flex-col rounded-2xl border bg-card shadow-sm h-full min-h-0 flex-1">
                        <header className="flex items-center justify-between px-6 py-4 border-b bg-muted rounded-t-2xl">
                            <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                                <span className="inline-block">
                                    {useStreaming ? <Zap size={20} className="text-primary" /> : <MessageCircle size={20} className="text-primary" />}
                                </span>
                                {useStreaming ? '스트리밍 채팅' : '일반 채팅'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setUseStreaming(!useStreaming)}
                                    icon={<Zap size={16} />}
                                    className={useStreaming ?
                                        "border-primary text-primary bg-primary/5 hover:bg-primary/10 transition-colors duration-200" :
                                        "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                                    }
                                >
                                    스트리밍
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearChat}
                                    icon={<Trash2 size={16} />}
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors duration-200"
                                >
                                    초기화
                                </Button>
                            </div>
                        </header>
                        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                            {/* 메시지 목록 */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-0 mb-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm ${message.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground border border-border'
                                                }`}
                                            style={{ whiteSpace: 'pre-wrap' }}  // 👈 이 줄 추가
                                        >
                                            <span>{message.text}</span>
                                            <span className="block text-xs opacity-60 mt-1 text-right">
                                                {message.timestamp.toLocaleTimeString('ko-KR')}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* 🔥 실시간 스트리밍 메시지 */}
                                {currentStreamingMessage && (
                                    <div className="flex justify-start">
                                        <div
                                            className="max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm bg-muted text-muted-foreground border border-border"
                                            data-streaming-message
                                            style={{ whiteSpace: 'pre-wrap' }}  // 👈 이미 적용되어 있음
                                        >
                                            <span>{currentStreamingMessage}</span>
                                            <span className="inline-block ml-1 animate-pulse text-primary">▍</span>
                                        </div>
                                    </div>
                                )}

                                {/* 🔥 강제 디버그 메시지 - 항상 표시 */}
                                {/* <div className="flex justify-start" style={{ border: '2px solid red', margin: '10px 0' }}>
                                    <div className="max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm bg-red-100 text-red-800">
                                        <div>디버그 - currentStreamingMessage 길이: {currentStreamingMessage?.length || 0}</div>
                                        <div>첫 50자: {currentStreamingMessage?.substring(0, 50) || '(없음)'}</div>
                                        <div>조건문 결과: {currentStreamingMessage ? '참' : '거짓'}</div>
                                    </div>
                                </div> */}

                                {isLoading && !currentStreamingMessage && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg px-3 py-2 animate-pulse text-xs text-muted-foreground">
                                            {useStreaming ? '실시간 응답 생성 중...' : '응답 생성 중...'}
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* 입력 영역 */}
                            <form
                                className="border-t bg-white px-4 py-4 flex gap-2 rounded-b-2xl"
                                onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
                                style={{ minHeight: 56 }}
                            >
                                <Input
                                    value={inputMessage}
                                    onChange={e => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={useStreaming ? "실시간 스트리밍으로 메시지를 입력하세요..." : "메시지를 입력하세요..."}
                                    className="flex-1 h-10 text-sm"
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    variant="outline"
                                    size="icon"
                                    icon={<Send size={18} />}
                                    loading={isLoading}
                                    className="h-10 w-10 border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors duration-200"
                                />
                            </form>
                        </div>
                    </section>

                    {/* 테스트 패널 */}
                    <aside className="lg:col-span-1 flex flex-col rounded-2xl border bg-card shadow-sm h-full min-h-0">
                        <header className="px-6 py-4 border-b bg-muted rounded-t-2xl">
                            <h3 className="text-base font-semibold text-muted-foreground">빠른 테스트</h3>
                        </header>
                        <div className="flex-1 flex flex-col gap-3 p-6 overflow-y-auto">
                            {quickTests.map((test, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setInputMessage(test.message)}
                                    icon={test.icon}
                                    className="w-full justify-start text-left"
                                    disabled={isLoading}
                                >
                                    {test.label}
                                </Button>
                            ))}

                            <div className="border-t pt-3 mt-3">
                                <p className="text-xs text-muted-foreground mb-2">현재 모드</p>
                                <div className="flex items-center gap-2 text-xs">
                                    {useStreaming ? (
                                        <>
                                            <Zap size={14} className="text-primary" />
                                            <span className="text-primary font-medium">스트리밍 모드</span>
                                        </>
                                    ) : (
                                        <>
                                            <MessageCircle size={14} className="text-muted-foreground" />
                                            <span className="text-muted-foreground">일반 모드</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default ChatBotApp