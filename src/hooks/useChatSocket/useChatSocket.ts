'use client'

import { useEffect, useRef, useState, useCallback } from 'react';
import {ChatWebSocketService, StompMessage} from "@/api";

interface UseChatSocketOptions {
    threadId: string;
    baseUrl?: string;
    enabled?: boolean;
}

export function useChatSocket({ threadId, baseUrl = '', enabled = true }: UseChatSocketOptions) {
    const serviceRef = useRef<ChatWebSocketService | null>(null);
    const subscribedRef = useRef(false);

    const [messages, setMessages] = useState<StompMessage[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // init service once
    useEffect(() => {
        if (!serviceRef.current) {
            serviceRef.current = new ChatWebSocketService(baseUrl);
        }
    }, [baseUrl]);

    const connect = useCallback(async () => {
        if (!enabled || !threadId || !serviceRef.current) return;

        try {
            await serviceRef.current.connect();
            setConnected(true);

            // prevent double subscription
            if (!subscribedRef.current) {
                subscribedRef.current = true;

                serviceRef.current.subscribe(threadId, (msg) => {
                    setMessages((prev) => [...prev, msg]);
                });
            }
        } catch (err) {
            setError(err);
            setConnected(false);
        }
    }, [threadId, enabled]);

    const sendMessage = useCallback(
        (content: string) => {
            serviceRef.current?.sendMessage(threadId, content);
        },
        [threadId]
    );

    const disconnect = useCallback(() => {
        serviceRef.current?.unsubscribe(threadId);
        subscribedRef.current = false;
        setConnected(false);
    }, [threadId]);

    useEffect(() => {
        if (!enabled) return;

        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect, enabled]);

    return {
        messages,
        connected,
        error,
        sendMessage,
        reconnect: connect,
    };
}
