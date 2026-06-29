'use client'

import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactMessageApi, type ContactMessageListQuery } from '@/api/contactMessages';
import { PaginationControls, MessageCard, MessageCardSkeleton, MessagesEmptyState } from '@/components';
import { usePaginationState } from '@/hooks';
import { Search } from 'lucide-react';

const SKELETON_COUNT = 5;

export default function ContactMessagesPage() {
    const { page, goToNextPage, goToPreviousPage } = usePaginationState();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const queryParams = useMemo<ContactMessageListQuery>(() => ({ page, size: 15, sort: 'createdAt,desc' }), [page]);

    const messagesQuery = useQuery({
        queryKey: ['contact-messages', queryParams],
        queryFn: () => contactMessageApi.list(queryParams),
    });

    const handleNextPage = useCallback(() => {
        goToNextPage(messagesQuery.data?.totalPages ?? 0);
    }, [goToNextPage, messagesQuery.data?.totalPages]);

    const handleToggleExpanded = useCallback((id: string) => {
        setExpandedId((current) => (current === id ? null : id));
    }, []);

    const messages = messagesQuery.data?.content ?? [];
    const isEmpty = !messagesQuery.isLoading && messages.length === 0;

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">Inbox</p>
                    <h2 className="mt-1 text-3xl font-bold text-gray-900">Contact messages</h2>
                    <p className="mt-1 text-sm text-gray-600">Messages submitted via the marketing website.</p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    {messagesQuery.data?.totalElements ?? 0} messages
                </span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="relative min-w-[200px] flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        disabled
                        placeholder="Search by name, email, or message..."
                        title="Search requires backend support (coming soon)"
                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-500 placeholder:text-gray-400"
                    />
                </div>
                <select
                    disabled
                    title="Filtering requires backend support (coming soon)"
                    className="cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                >
                    <option>AI status</option>
                </select>
                <select
                    disabled
                    title="Filtering requires backend support (coming soon)"
                    className="cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                >
                    <option>Date</option>
                </select>
            </div>

            <div className="space-y-4">
                {messagesQuery.isLoading &&
                    Array.from({ length: SKELETON_COUNT }).map((_, index) => <MessageCardSkeleton key={index} />)}

                {isEmpty && <MessagesEmptyState />}

                {!messagesQuery.isLoading &&
                    messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            message={message}
                            isExpanded={expandedId === message.id}
                            onToggle={() => handleToggleExpanded(message.id)}
                        />
                    ))}
            </div>

            <div className="mt-4">
                <PaginationControls
                    page={page}
                    totalPages={messagesQuery.data?.totalPages ?? 0}
                    onPrevious={goToPreviousPage}
                    onNext={handleNextPage}
                />
            </div>
        </div>
    );
};
