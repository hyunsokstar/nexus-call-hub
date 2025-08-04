// 챗봇 대화 API
import axios from 'axios';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export async function postChatKr(data: ChatRequest): Promise<ChatResponse> {
  const res = await axios.post('http://localhost:8080/api/ai/chat-kr', data);
  return res.data;
}
