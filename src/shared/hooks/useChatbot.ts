import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    streamChatKr,
    postChatKr,
    getHello,
    getMovieRecommendation,
    translateText,
    reviewCode,
    ChatRequest,
    ChatResponse,
    MovieInfo
} from '../api/ai';

export function useChatbot() {
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');

    // 💬 일반 채팅 (전체 응답 한 번에)
    const normalChat = useMutation<ChatResponse, Error, ChatRequest>({
        mutationFn: postChatKr,
    });

    // 🧪 Hello 테스트
    const helloTest = useMutation<ChatResponse, Error, string | undefined>({
        mutationFn: getHello,
    });

    // 🎬 영화 추천
    const movieRecommendation = useMutation<MovieInfo, Error, string>({
        mutationFn: getMovieRecommendation,
    });

    // 🌍 번역 기능
    const translation = useMutation<ChatResponse, Error, { text: string; targetLanguage: string }>({
        mutationFn: ({ text, targetLanguage }) => translateText(text, targetLanguage),
    });

    // 👨‍💻 코드 리뷰
    const codeReview = useMutation<ChatResponse, Error, string>({
        mutationFn: reviewCode,
    });

    // 🔥 스트리밍 채팅 (TanStack Query로 관리)
    const streamingChatMutation = useMutation<string, Error, string>({
        mutationFn: async (message: string) => {
            return new Promise<string>((resolve, reject) => {
                let fullMessage = '';
                setCurrentStreamingMessage('');
                setIsStreaming(true);

                streamChatKr(
                    message,
                    // onChunk: 실시간으로 텍스트 추가
                    (chunk: string) => {
                        console.log('🔥 onChunk 받은 데이터:', chunk);
                        fullMessage += chunk;
                        console.log('📝 누적 메시지:', fullMessage);
                        setCurrentStreamingMessage(fullMessage);
                        console.log('✨ currentStreamingMessage 업데이트 완료');
                    },
                    // onComplete: 스트리밍 완료
                    () => {
                        setIsStreaming(false);
                        setCurrentStreamingMessage('');
                        resolve(fullMessage);
                    },
                    // onError: 에러 처리
                    (error: Error) => {
                        setIsStreaming(false);
                        setCurrentStreamingMessage('');
                        reject(error);
                    }
                );
            });
        },
    });

    // 🔥 스트리밍 채팅 (기존 방식 유지 - 호환성)
    const streamingChat = useCallback(async (
        message: string,
        onChunk: (chunk: string) => void,
        onComplete: () => void,
        onError: (error: Error) => void
    ) => {
        setIsStreaming(true);

        try {
            await streamChatKr(
                message,
                onChunk,
                () => {
                    setIsStreaming(false);
                    onComplete();
                },
                (error) => {
                    setIsStreaming(false);
                    onError(error);
                }
            );
        } catch (error) {
            setIsStreaming(false);
            onError(error as Error);
        }
    }, []);

    return {
        // 상태
        isStreaming,
        currentStreamingMessage,

        // 일반 기능들
        normalChat,
        helloTest,
        movieRecommendation,
        translation,
        codeReview,

        // 스트리밍 기능 (두 가지 방식)
        streamingChat, // 기존 방식
        streamingChatMutation, // TanStack Query 방식
    };
}