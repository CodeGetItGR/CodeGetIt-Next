import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {useApiErrorState, useChatSocket} from "@/hooks";
import {useLocale} from "@/i18n/UseLocale";
import {aiApi, UUID} from "@/api";
import {Input} from "@/components";


interface AiChatPanelProps {
    entityId: UUID;
    entityType: 'REQUEST' | 'OFFER' | 'PROJECT';
    className?: string;
    onAnalyze?: () => void;
}

export const AiChatPanel = ({ entityId, entityType, className = '', onAnalyze }: AiChatPanelProps) => {
    const { t } = useLocale();
    const text = t.admin.aiChat;

    const { setApiError, clearError } = useApiErrorState();
    const [input, setInput] = useState('');

    const threadQuery = useQuery({
        queryKey: ['ai-thread', entityType, entityId],
        queryFn: async () => {
            const payload = {
                ...(entityType === 'REQUEST' && { requestId: entityId }),
                ...(entityType === 'OFFER' && { offerId: entityId }),
                ...(entityType === 'PROJECT' && { projectId: entityId }),
            };

            try {
                return await aiApi.getThread(payload);
            } catch {
                return await aiApi.createThread(payload);
            }
        },
    });

    const threadId = threadQuery.data?.id;

    const { messages, sendMessage } = useChatSocket({
        threadId: threadId ?? '',
        baseUrl: (process.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', ''),
    });

    const sendMutation = useMutation({
        mutationFn: (message: string) => (threadId ? aiApi.sendMessage(threadId, { message }) : Promise.reject(new Error('No thread'))),

        onSuccess: () => {
            clearError();
            setInput('');
        },

        onError: (error) => setApiError(error),
    });

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !threadId) return;

        sendMessage(input);
        sendMutation.mutate(input);
    };

    const analyzeMutation = useMutation({
        mutationFn: () => (entityType === 'OFFER' ? aiApi.analyzeOffer(entityId) : Promise.reject()),

        onSuccess: () => onAnalyze?.(),
        onError: (error) => setApiError(error),
    });

    return (
        <div className={`flex h-[200px] flex-col rounded-2xl border bg-white ${className}`}>
            {/* HEADER */}
            <div className="flex items-center justify-between border-b p-3">
                <h3 className="text-sm font-semibold">AI Chat</h3>

                {entityType === 'OFFER' && (
                    <button onClick={() => analyzeMutation.mutate()} className="text-xs text-blue-600 hover:text-blue-700">
                        {text.analyzeOffer}
                    </button>
                )}
            </div>

            {/* MESSAGES */}
            <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3">
                {messages.length === 0 && <p className="text-center text-sm text-gray-500">{text.newConversation}</p>}

                {messages.map((msg) => (
                    <div key={msg.messageId} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                                msg.role === 'USER' ? 'bg-blue-600 text-white' : 'border bg-white text-gray-900'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* INPUT */}
            <form onSubmit={handleSend} className="flex gap-2 border-t p-3">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={text.placeholder}
                    className="flex-1"
                    disabled={sendMutation.isPending}
                />

                <button
                    type="submit"
                    disabled={!input.trim() || sendMutation.isPending}
                    className="rounded bg-blue-600 px-3 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {sendMutation.isPending ? text.loading : text.sendMessage}
                </button>
            </form>
        </div>
    );
};
