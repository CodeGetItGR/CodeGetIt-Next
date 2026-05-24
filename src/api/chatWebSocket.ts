import {Client, type Frame, type Message, type StompSubscription} from '@stomp/stompjs';

export interface StompMessage {
    messageId: string;
    role: 'USER' | 'ASSISTANT';
    content: string;
    tokensUsed: number;
    estimatedCost: number;
    createdAt: string;
}

export class ChatWebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, { callback: (msg: StompMessage) => void; sub?: StompSubscription }> = new Map();

    private readonly baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    connect(): Promise<void> {
        if (this.client?.connected) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            let settled = false;

            this.client = new Client({
                brokerURL: `${this.baseUrl}/ws/chat`,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,

                onConnect: () => {
                    this.subscriptions.forEach((value, threadId) => {
                        value.sub = this.client!.subscribe(`/topic/threads/${threadId}`, (message: Message) => {
                            try {
                                const data = JSON.parse(message.body) as StompMessage;
                                value.callback(data);
                            } catch (error) {
                                console.error('Failed to parse message:', error);
                            }
                        });
                    });

                    if (!settled) {
                        settled = true;
                        resolve();
                    }
                },

                onStompError: (frame: Frame) => {
                    console.error('STOMP error:', frame);
                    if (!settled) {
                        settled = true;
                        reject(new Error(frame.body || 'STOMP error'));
                    }
                },

                onWebSocketError: (event: Event) => {
                    console.error('WebSocket error:', event);
                    if (!settled) {
                        settled = true;
                        reject(event);
                    }
                },
            });
            console.log('STOMP client connected:', this.client);
            this.client?.activate();
        });
    }

    subscribe(threadId: string, callback: (message: StompMessage) => void): void {
        if (!this.client?.connected) return;

        const sub = this.client.subscribe(`/topic/threads/${threadId}`, (message: Message) => {
            try {
                const data = JSON.parse(message.body) as StompMessage;
                callback(data);
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        });

        this.subscriptions.set(threadId, { callback, sub });
    }

    sendMessage(threadId: string, message: string): void {
        if (!this.client?.connected) return;

        this.client.publish({
            destination: `/app/chat/${threadId}`,
            body: JSON.stringify({ message }),
        });
    }

    unsubscribe(threadId: string): void {
        const entry = this.subscriptions.get(threadId);
        entry?.sub?.unsubscribe();
        this.subscriptions.delete(threadId);
    }

    disconnect(): void {
        this.subscriptions.forEach((entry) => entry.sub?.unsubscribe());
        this.subscriptions.clear();

        this.client?.deactivate();
        this.client = null;
    }

    isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}
