'use client'

import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactMessageApi, type ContactMessageListQuery } from '@/api/contactMessages';
import { PaginationControls } from '@/components';
import { usePaginationState } from '@/hooks';

export default function ContactMessagesPage() {
    const { page, goToNextPage, goToPreviousPage } = usePaginationState();

    const queryParams = useMemo<ContactMessageListQuery>(() => ({ page, size: 15, sort: 'createdAt,desc' }), [page]);

    const messagesQuery = useQuery({
        queryKey: ['contact-messages', queryParams],
        queryFn: () => contactMessageApi.list(queryParams),
    });

    const handleNextPage = useCallback(() => {
        goToNextPage(messagesQuery.data?.totalPages ?? 0);
    }, [goToNextPage, messagesQuery.data?.totalPages]);

    return (
        <div>
            <div className="mb-6">
                <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">Inbox</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">Contact messages</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Messages submitted via the marketing contact form.{' '}
                    <span className="font-medium text-gray-900">{messagesQuery.data?.totalElements ?? 0} total</span>
                </p>
            </div>

            <div className="space-y-3">
                {messagesQuery.isLoading && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">Loading messages...</div>
                )}

                {!messagesQuery.isLoading && messagesQuery.data?.content.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">No messages yet.</div>
                )}

                {messagesQuery.data?.content.map((msg) => (
                    <article key={msg.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="text-base font-semibold text-gray-900">{msg.name}</p>
                                <a
                                    href={`mailto:${msg.email}`}
                                    className="text-sm text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
                                >
                                    {msg.email}
                                </a>
                            </div>
                            <time className="text-xs text-gray-500 tabular-nums">{new Date(msg.createdAt).toLocaleString()}</time>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{msg.message}</p>

                        <div className="mt-4 flex gap-3">
                            <a
                                href={`mailto:${msg.email}?subject=Re: your message`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Reply via email
                            </a>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-6">
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
