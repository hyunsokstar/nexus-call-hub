import { apiClient } from './client';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const API_BASE_URL = 'http://43.200.234.52:8080/api/ai';

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    response: string;
}

// 🛑 스트림 취소를 위한 AbortController 관리
class StreamManager {
    private activeStreams: Map<string, AbortController> = new Map();

    // 새 스트림 생성
    createStream(streamId: string): AbortController {
        const controller = new AbortController();
        this.activeStreams.set(streamId, controller);
        return controller;
    }

    // 스트림 취소
    cancelStream(streamId: string): boolean {
        const controller = this.activeStreams.get(streamId);
        if (controller) {
            controller.abort();
            this.activeStreams.delete(streamId);
            return true;
        }
        return false;
    }

    // 스트림 완료 처리
    completeStream(streamId: string): void {
        this.activeStreams.delete(streamId);
    }

    // 활성 스트림 목록
    getActiveStreams(): string[] {
        return Array.from(this.activeStreams.keys());
    }
}

export const streamManager = new StreamManager();

// 🔥 취소 가능한 스트리밍 채팅
export async function streamChatWithCancel(
    message: string,
    streamId: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
): Promise<void> {
    try {
        console.log('🚀 취소 가능한 스트리밍 시작:', streamId);

        // AbortController 생성
        const controller = streamManager.createStream(streamId);
        let isCompleted = false;

        await fetchEventSource(`${API_BASE_URL}/stream/${streamId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
            signal: controller.signal, // 🔥 취소 신호 추가
            onmessage: (event) => {
                if (event.data === '[DONE]') {
                    isCompleted = true;
                    streamManager.completeStream(streamId);
                    onComplete();
                } else if (event.data !== undefined) {
                    onChunk(event.data);
                }
            },
            onclose: () => {
                console.log('🔌 연결 종료:', streamId);
                if (!isCompleted) {
                    streamManager.completeStream(streamId);
                    onComplete();
                }
            },
            onerror: (error) => {
                console.error('❌ 스트리밍 에러:', error);
                streamManager.completeStream(streamId);

                // AbortError는 사용자가 직접 취소한 경우
                if (error.name === 'AbortError') {
                    onError(new Error('사용자가 채팅을 취소했습니다.'));
                } else {
                    onError(error as Error);
                }
                throw error;
            }
        });

    } catch (error: any) {
        console.error('❌ fetch-event-source 에러:', error);
        streamManager.completeStream(streamId);

        if (error.name === 'AbortError') {
            onError(new Error('사용자가 채팅을 취소했습니다.'));
        } else {
            onError(error as Error);
        }
    }
}

// 🛑 서버에 취소 요청 + 클라이언트 취소
export async function cancelChatStream(streamId: string): Promise<boolean> {
    try {
        // 1. 클라이언트 측 스트림 취소
        const clientCancelled = streamManager.cancelStream(streamId);

        // 2. 서버 측 스트림 취소
        const response = await apiClient.delete(`/api/ai/stream/${streamId}`);
        const serverCancelled = response.data.cancelled;

        console.log('🛑 취소 결과:', {
            clientCancelled,
            serverCancelled,
            streamId
        });

        return clientCancelled || serverCancelled;
    } catch (error) {
        console.error('❌ 취소 요청 실패:', error);
        // 클라이언트라도 취소
        return streamManager.cancelStream(streamId);
    }
}

// 📊 활성 스트림 조회 (디버깅용)
export async function getActiveStreams(): Promise<string[]> {
    try {
        const response = await apiClient.get(`/api/ai/streams/active`);
        return response.data.activeStreams;
    } catch (error) {
        console.error('❌ 활성 스트림 조회 실패:', error);
        return [];
    }
}

// 🔥 기존 스트리밍 함수 (호환성 유지)
export async function streamChatKr(
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
): Promise<void> {
    // 임시 ID로 기존 방식 유지
    const tempId = `temp_${Date.now()}`;
    return streamChatWithCancel(message, tempId, onChunk, onComplete, onError);
}

// 💬 일반 채팅 (변경 없음)
export async function postChatKr(data: ChatRequest): Promise<ChatResponse> {
    const res = await apiClient.post(`/api/ai/chat-kr`, data);
    return res.data;
}

// 🧪 간단한 테스트 (변경 없음)
export async function getHello(message?: string): Promise<ChatResponse> {
    const res = await apiClient.get(`/api/ai/hello`, {
        params: { message }
    });
    return res.data;
}

// 🎬 영화 추천 (변경 없음)
export interface MovieInfo {
    actor: string;
    movies: string[];
}

export async function getMovieRecommendation(actor: string): Promise<MovieInfo> {
    const res = await apiClient.get(`/api/ai/movie`, {
        params: { actor }
    });
    return res.data;
}

// 🌍 번역 기능 (변경 없음)
export async function translateText(text: string, targetLanguage: string): Promise<ChatResponse> {
    const res = await apiClient.post(`/api/ai/translate`, null, {
        params: { text, targetLanguage }
    });
    return res.data;
}

// 👨‍💻 코드 리뷰 (변경 없음)
export async function reviewCode(code: string): Promise<ChatResponse> {
    const res = await apiClient.post(`/api/ai/review-code`, code, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
    return res.data;
}