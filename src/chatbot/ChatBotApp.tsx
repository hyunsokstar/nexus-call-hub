import React, { useState, useRef, useEffect } from 'react'
import { useChatbot } from '../shared/hooks/useChatbot'
import CommonHeader from '@/widgets/CommonHeader'
import { Button } from '../shared/components/Button'
import { Trash2, MessageCircle, Clock, HelpCircle, Zap, Film, Globe, Code } from 'lucide-react'
import GPTCodeHighlighter from './ui/GPTCodeHighlighter'
import MessageInput from './components/MessageInput'  // 🔥 새로 추가

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
    const [useStreaming, setUseStreaming] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // 메시지가 추가될 때마다 하단으로 스크롤
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, currentStreamingMessage])

    // 🔥 스트리밍 채팅 처리
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
                        text: data.response,
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

    // 🔥 메시지 전송 메인 함수 (MessageInput에서 호출)
    const handleSendMessage = async (message: string) => {
        if (useStreaming) {
            await handleStreamingChat(message)
        } else {
            handleNormalChat(message)
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

    const quickTests = [
        {
            icon: <MessageCircle size={16} />,
            label: '인사하기',
            message: '안녕하세요! 오늘 기분이 어떠세요?'
        },
        {
            icon: <Clock size={16} />,
            label: '시간 묻기',
            message: '현재 시간을 JavaScript로 가져오는 방법을 알려주세요'
        },
        {
            icon: <HelpCircle size={16} />,
            label: '도움 요청',
            message: 'Spring Boot에서 REST API를 만드는 방법을 코드와 함께 설명해주세요'
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
            message: 'JavaScript 함수를 하나 만들어주세요: 두 숫자를 더하는 함수'
        }
    ]

    const isLoading = normalChat.isPending || isStreaming

    return (
        <div className="h-screen bg-white flex flex-col pb-2 mt-0">
            <CommonHeader
                title="AI 챗봇 테스트"
                subtitle="실시간 스트리밍과 다양한 AI 기능을 체험해보세요"
                icon="🤖"
                showBackButton={true}
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
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-0">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`
                                                max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm
                                                ${message.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground border border-border'
                                                }
                                            `}
                                        >
                                            {message.sender === 'bot' ? (
                                                <GPTCodeHighlighter content={message.text} theme="light" />
                                            ) : (
                                                <span className="whitespace-pre-wrap">{message.text}</span>
                                            )}
                                            <span className="block text-xs opacity-60 mt-1 text-right">
                                                {message.timestamp.toLocaleTimeString('ko-KR')}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* 실시간 스트리밍 메시지 */}
                                {currentStreamingMessage && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm bg-muted text-muted-foreground border border-border">
                                            <GPTCodeHighlighter content={currentStreamingMessage} theme="light" />
                                            <span className="inline-block ml-1 animate-pulse text-primary">▍</span>
                                        </div>
                                    </div>
                                )}

                                {isLoading && !currentStreamingMessage && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg px-3 py-2 animate-pulse text-xs text-muted-foreground">
                                            {useStreaming ? '실시간 응답 생성 중...' : '응답 생성 중...'}
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* 🔥 분리된 입력 컴포넌트 */}
                            <MessageInput
                                onSendMessage={handleSendMessage}
                                disabled={isLoading}
                                placeholder={useStreaming ? "실시간 스트리밍으로 메시지를 입력하세요... (Shift+Enter: 줄바꿈)" : "메시지를 입력하세요... (Shift+Enter: 줄바꿈)"}
                                useStreaming={useStreaming}
                            />
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
                                    onClick={() => {
                                        // 빠른 테스트 메시지 바로 전송
                                        handleSendMessage(test.message);
                                    }}
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