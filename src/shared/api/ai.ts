import axios from 'axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const API_BASE_URL = 'http://localhost:8080/api/ai';

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    response: string;
    formattedResponse?: string;  // 추가
    htmlResponse?: string;       // 추가
}

// 💬 일반 채팅 (전체 응답 한 번에)
export async function postChatKr(data: ChatRequest): Promise<ChatResponse> {
    const res = await axios.post(`${API_BASE_URL}/chat-kr`, data);
    return res.data;
}

// 🔥 스트리밍 채팅 (fetch-event-source 사용 - 가장 안정적)
export async function streamChatKr(
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
): Promise<void> {
    try {
        console.log('🚀 fetch-event-source로 스트리밍 시작:', message);

        let isCompleted = false;

        await fetchEventSource(`${API_BASE_URL}/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
            onmessage: (event) => {
                if (event.data === '[DONE]') {
                    // ...
                } else if (event.data !== undefined) { // length 체크 제거
                    onChunk(event.data); // 빈 문자열도 전달
                }
            },
            onclose: () => {
                console.log('🔌 연결 종료');
                // [DONE] 신호를 받지 못한 경우에만 완료 처리
                if (!isCompleted) {
                    console.log('✅ 강제 스트리밍 완료');
                    onComplete();
                }
            },
            onerror: (error) => {
                console.error('❌ 스트리밍 에러:', error);
                onError(error as Error);
                throw error; // 재연결 중단
            }
        });

    } catch (error) {
        console.error('❌ fetch-event-source 에러:', error);
        onError(error as Error);
    }
}

// 🧪 간단한 테스트
export async function getHello(message?: string): Promise<ChatResponse> {
    const res = await axios.get(`${API_BASE_URL}/hello`, {
        params: { message }
    });
    return res.data;
}

// 🎬 영화 추천
export interface MovieInfo {
    actor: string;
    movies: string[];
}

export async function getMovieRecommendation(actor: string): Promise<MovieInfo> {
    const res = await axios.get(`${API_BASE_URL}/movie`, {
        params: { actor }
    });
    return res.data;
}

// 🌍 번역 기능
export async function translateText(text: string, targetLanguage: string): Promise<ChatResponse> {
    const res = await axios.post(`${API_BASE_URL}/translate`, null, {
        params: { text, targetLanguage }
    });
    return res.data;
}

// 👨‍💻 코드 리뷰
export async function reviewCode(code: string): Promise<ChatResponse> {
    const res = await axios.post(`${API_BASE_URL}/review-code`, code, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
    return res.data;
}