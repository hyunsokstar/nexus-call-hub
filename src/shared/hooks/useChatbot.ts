import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    streamChatWithCancel,
    cancelChatStream,
    postChatKr,
    getHello,
    getMovieRecommendation,
    translateText,
    reviewCode,
    getActiveStreams,
    ChatRequest,
    ChatResponse,
    MovieInfo
} from '../api/ai';

export function useChatbot() {
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');

    // 🔥 현재 스트리밍 ID 관리
    const currentStreamIdRef = useRef<string | null>(null);

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

    // 🔥 취소 가능한 스트리밍 채팅 (TanStack Query로 관리)
    const streamingChatMutation = useMutation<string, Error, string>({
        mutationFn: async (message: string) => {
            return new Promise<string>((resolve, reject) => {
                // 고유한 스트림 ID 생성
                const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                currentStreamIdRef.current = streamId;

                let fullMessage = '';
                setCurrentStreamingMessage('');
                setIsStreaming(true);

                console.log('🚀 스트리밍 시작:', streamId);

                streamChatWithCancel(
                    message,
                    streamId,
                    // onChunk: 실시간으로 텍스트 추가
                    (chunk: string) => {
                        console.log('🔥 onChunk 받은 데이터:', JSON.stringify(chunk));
                        fullMessage += chunk;
                        setCurrentStreamingMessage(fullMessage);
                    },
                    // onComplete: 스트리밍 완료
                    () => {
                        console.log('✅ 스트리밍 완료:', streamId);
                        setIsStreaming(false);
                        setCurrentStreamingMessage('');
                        currentStreamIdRef.current = null;
                        resolve(fullMessage);
                    },
                    // onError: 에러 처리
                    (error: Error) => {
                        console.log('❌ 스트리밍 에러:', streamId, error.message);
                        setIsStreaming(false);
                        setCurrentStreamingMessage('');
                        currentStreamIdRef.current = null;
                        reject(error);
                    }
                );
            });
        },
    });

    // 🛑 스트리밍 취소 함수
    const cancelStreaming = useCallback(async (): Promise<boolean> => {
        const streamId = currentStreamIdRef.current;
        if (!streamId) {
            console.warn('⚠️ 취소할 스트림이 없습니다.');
            return false;
        }

        console.log('🛑 스트리밍 취소 시도:', streamId);

        try {
            const cancelled = await cancelChatStream(streamId);

            if (cancelled) {
                // 상태 초기화
                setIsStreaming(false);
                setCurrentStreamingMessage('');
                currentStreamIdRef.current = null;

                console.log('✅ 스트리밍 취소 완료:', streamId);
                return true;
            } else {
                console.warn('⚠️ 스트리밍 취소 실패:', streamId);
                return false;
            }
        } catch (error) {
            console.error('❌ 취소 중 오류:', error);

            // 에러가 발생해도 상태는 초기화
            setIsStreaming(false);
            setCurrentStreamingMessage('');
            currentStreamIdRef.current = null;

            return false;
        }
    }, []);

    // 📊 활성 스트림 조회 (디버깅용)
    const activeStreamQuery = useMutation<string[], Error, void>({
        mutationFn: getActiveStreams,
    });

    // 🔥 스트리밍 채팅 (기존 방식 유지 - 호환성)
    const streamingChat = useCallback(async (
        message: string,
        onChunk: (chunk: string) => void,
        onComplete: () => void,
        onError: (error: Error) => void
    ) => {
        const streamId = `compat_${Date.now()}`;
        currentStreamIdRef.current = streamId;
        setIsStreaming(true);

        try {
            await streamChatWithCancel(
                message,
                streamId,
                onChunk,
                () => {
                    setIsStreaming(false);
                    currentStreamIdRef.current = null;
                    onComplete();
                },
                (error) => {
                    setIsStreaming(false);
                    currentStreamIdRef.current = null;
                    onError(error);
                }
            );
        } catch (error) {
            setIsStreaming(false);
            currentStreamIdRef.current = null;
            onError(error as Error);
        }
    }, []);

    return {
        // 상태
        isStreaming,
        currentStreamingMessage,
        currentStreamId: currentStreamIdRef.current,

        // 일반 기능들
        normalChat,
        helloTest,
        movieRecommendation,
        translation,
        codeReview,

        // 스트리밍 기능
        streamingChat, // 기존 방식
        streamingChatMutation, // TanStack Query 방식

        // 🔥 취소 기능
        cancelStreaming,
        activeStreamQuery,
    };
}