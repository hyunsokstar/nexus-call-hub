import { useMutation } from '@tanstack/react-query';
import { postChatKr, ChatRequest, ChatResponse } from '../api/ai';

export function useChatbot() {
    return useMutation<ChatResponse, Error, ChatRequest>({
        mutationFn: postChatKr,
    });
}
