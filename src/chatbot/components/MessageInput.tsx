import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../shared/components/Button';
import { Send } from 'lucide-react';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
    useStreaming?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    disabled = false,
    placeholder = "메시지를 입력하세요...",
    useStreaming = false
}) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 텍스트 영역 높이 자동 조정
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            // 최소 40px, 최대 120px (약 6줄)
            const newHeight = Math.min(Math.max(scrollHeight, 40), 120);
            textarea.style.height = `${newHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    // 메시지 전송
    const handleSend = () => {
        if (!message.trim() || disabled) return;

        onSendMessage(message.trim());
        setMessage('');

        // 높이 초기화
        if (textareaRef.current) {
            textareaRef.current.style.height = '40px';
        }
    };

    // 키보드 이벤트 처리
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift + Enter: 줄바꿈 (기본 동작)
                return;
            } else {
                // Enter: 메시지 전송
                e.preventDefault();
                handleSend();
            }
        }
    };

    return (
        <div className="border-t bg-white px-4 py-4 rounded-b-2xl">
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
                        `}
                        style={{ height: '40px' }}
                    />

                    {/* 입력 힌트 */}
                    <div className="absolute -bottom-5 left-0 text-xs text-gray-400">
                        <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> 전송 ·
                        <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">Shift+Enter</kbd> 줄바꿈
                    </div>
                </div>

                {/* 전송 버튼 */}
                <Button
                    onClick={handleSend}
                    disabled={disabled || !message.trim()}
                    variant="outline"
                    size="icon"
                    icon={<Send size={18} />}
                    loading={disabled}
                    className={`
                        h-10 w-10 flex-shrink-0
                        ${message.trim() && !disabled
                            ? 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                            : 'border-gray-300 text-gray-400'
                        }
                        disabled:border-gray-300 disabled:text-gray-400 
                        disabled:hover:bg-transparent disabled:hover:text-gray-400 
                        transition-colors duration-200
                    `}
                />
            </div>
        </div>
    );
};

export default MessageInput;