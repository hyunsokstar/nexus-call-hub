import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../shared/components/Button';
import { Send, StopCircle, X, Loader2 } from 'lucide-react';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    onCancelStreaming?: () => void;
    disabled?: boolean;
    placeholder?: string;
    useStreaming?: boolean;
    isStreaming?: boolean;
    isCancelling?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    onCancelStreaming,
    disabled = false,
    placeholder = "메시지를 입력하세요...",
    useStreaming = false,
    isStreaming = false,
    isCancelling = false
}) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 텍스트 영역 높이 자동 조정
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const newHeight = Math.min(Math.max(scrollHeight, 40), 120);
            textarea.style.height = `${newHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    // 메시지 전송
    const handleSend = () => {
        if (!message.trim() || disabled || isStreaming) return;

        onSendMessage(message.trim());
        setMessage('');

        if (textareaRef.current) {
            textareaRef.current.style.height = '40px';
        }
    };

    // 스트리밍 취소
    const handleCancel = () => {
        if (onCancelStreaming && isStreaming && !isCancelling) {
            onCancelStreaming();
        }
    };

    // 키보드 이벤트 처리
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return; // Shift + Enter: 줄바꿈
            } else {
                e.preventDefault();
                if (isStreaming) {
                    handleCancel(); // 스트리밍 중: 취소
                } else {
                    handleSend(); // 일반 상황: 전송
                }
            }
        }

        if (e.key === 'Escape' && isStreaming) {
            e.preventDefault();
            handleCancel();
        }
    };

    // 🔥 버튼 상태 결정 (3가지 상태)
    const getButtonConfig = () => {
        if (isCancelling) {
            // 취소 진행 중
            return {
                icon: <Loader2 size={18} className="animate-spin" />,
                onClick: () => { }, // 비활성화
                disabled: true,
                variant: 'outline' as const,
                className: "border-gray-400 text-gray-500",
                title: "취소 처리 중...",
                label: "취소 중..."
            };
        } else if (isStreaming) {
            // 스트리밍 중 (취소 가능)
            return {
                icon: <StopCircle size={18} />,
                onClick: handleCancel,
                disabled: false,
                variant: 'outline' as const,
                className: "border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-red-50",
                title: "응답 중단 (Enter 또는 Esc)",
                label: "중단"
            };
        } else {
            // 일반 상태 (전송 가능)
            const canSend = message.trim() && !disabled;
            return {
                icon: <Send size={18} />,
                onClick: handleSend,
                disabled: !canSend,
                variant: 'outline' as const,
                className: canSend
                    ? 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-blue-50'
                    : 'border-gray-300 text-gray-400',
                title: canSend ? "메시지 전송 (Enter)" : "메시지를 입력하세요",
                label: "전송"
            };
        }
    };

    const buttonConfig = getButtonConfig();

    return (
        <div className="border-t bg-white px-4 py-4 rounded-b-2xl mb-5">
            <div className="flex gap-3 items-end">
                {/* 텍스트 입력 영역 */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`
                            w-full min-h-[40px] max-h-[120px] px-3 py-2 
                            border border-gray-300 rounded-lg resize-none
                            text-sm leading-5
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                            placeholder:text-gray-400
                            transition-all duration-200
                            ${isStreaming ? 'bg-orange-50 border-orange-200' : ''}
                            ${isCancelling ? 'bg-gray-50 border-gray-200' : ''}
                        `}
                        style={{ height: '40px' }}
                    />

                    {/* 입력 힌트 */}
                    <div className="absolute -bottom-5 left-0 text-xs text-gray-400">
                        {isCancelling ? (
                            <span className="text-gray-500">취소 처리 중입니다...</span>
                        ) : isStreaming ? (
                            <>
                                <kbd className="px-1 py-0.5 bg-red-100 text-red-600 rounded text-xs">Esc</kbd> 취소 ·
                                <kbd className="px-1 py-0.5 bg-red-100 text-red-600 rounded text-xs ml-1">Enter</kbd> 중단
                            </>
                        ) : (
                            <>
                                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> 전송 ·
                                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">Shift+Enter</kbd> 줄바꿈
                            </>
                        )}
                    </div>
                </div>

                {/* 🔥 스마트 버튼 (전송 ↔ 취소) */}
                <div className="flex flex-col items-center gap-1">
                    <Button
                        onClick={buttonConfig.onClick}
                        disabled={buttonConfig.disabled}
                        variant={buttonConfig.variant}
                        size="icon"
                        icon={buttonConfig.icon}
                        title={buttonConfig.title}
                        className={`
                            h-10 w-10 flex-shrink-0
                            ${buttonConfig.className}
                            disabled:border-gray-300 disabled:text-gray-400 
                            disabled:hover:bg-transparent disabled:hover:text-gray-400 
                            transition-all duration-200 ease-in-out
                            ${isStreaming && !isCancelling ? 'shadow-lg shadow-red-200' : ''}
                        `}
                    />

                    {/* 버튼 상태 라벨 */}
                    <span className={`
                        text-xs font-medium transition-colors duration-200
                        ${isCancelling ? 'text-gray-500' :
                            isStreaming ? 'text-red-600' :
                                message.trim() ? 'text-blue-600' : 'text-gray-400'}
                    `}>
                        {buttonConfig.label}
                    </span>
                </div>
            </div>

            {/* 🔥 스트리밍 상태 표시 바 */}
            {(isStreaming || isCancelling) && (
                <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                    <div className="flex items-center justify-center text-xs">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isCancelling ? 'bg-gray-500 animate-pulse' : 'bg-orange-500 animate-pulse'
                                }`}></div>
                            <span className={`font-medium ${isCancelling ? 'text-gray-600' : 'text-orange-700'
                                }`}>
                                {isCancelling ? '🛑 응답을 취소하는 중...' : '🤖 실시간으로 응답을 생성하고 있어요'}
                            </span>
                        </div>
                    </div>

                    {/* 진행 바 효과 */}
                    {isStreaming && !isCancelling && (
                        <div className="mt-2 w-full bg-orange-200 rounded-full h-1">
                            <div className="bg-orange-500 h-1 rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MessageInput;