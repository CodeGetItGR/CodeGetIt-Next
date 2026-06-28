'use client'

import { Fragment, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactMessageApi, type ContactMessageListQuery } from '@/api/contactMessages';
import type { ContactMessageResponse } from '@/api';
import { PaginationControls, MessageAiStatusBadge, AiAcknowledgmentTimeline } from '@/components';
import { usePaginationState } from '@/hooks';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SNIPPET_LENGTH = 80;

const toSnippet = (message: string) =>
    message.length > SNIPPET_LENGTH ? `${message.slice(0, SNIPPET_LENGTH)}…` : message;

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

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-left text-xs tracking-wide text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Message</th>
                                <th className="px-4 py-3">AI status</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {messagesQuery.data?.content.map((msg: ContactMessageResponse) => {
                                const isExpanded = expandedId === msg.id;

                                return (
                                    <Fragment key={msg.id}>
                                        <tr
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={isExpanded}
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleToggleExpanded(msg.id)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    event.preventDefault();
                                                    handleToggleExpanded(msg.id);
                                                }
                                            }}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-900">{msg.name}</td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={`mailto:${msg.email}`}
                                                    onClick={(event) => event.stopPropagation()}
                                                    className="text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
                                                >
                                                    {msg.email}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{toSnippet(msg.message)}</td>
                                            <td className="px-4 py-3">
                                                <MessageAiStatusBadge aiAcknowledgments={msg.aiAcknowledgments} />
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{new Date(msg.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-gray-400">
                                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={6} className="px-4 py-4">
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{msg.message}</p>

                                                    <a
                                                        href={`mailto:${msg.email}?subject=Re: your message`}
                                                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                                    >
                                                        Reply via email
                                                    </a>

                                                    <h4 className="mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                                        AI acknowledgment history
                                                    </h4>
                                                    <div className="mt-2">
                                                        <AiAcknowledgmentTimeline aiAcknowledgments={msg.aiAcknowledgments} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {messagesQuery.isLoading && <p className="mt-4 text-sm text-gray-500">Loading messages...</p>}
                {!messagesQuery.isLoading && messagesQuery.data?.content.length === 0 && (
                    <p className="mt-4 text-sm text-gray-500">No messages yet.</p>
                )}

                <div className="mt-4">
                    <PaginationControls
                        page={page}
                        totalPages={messagesQuery.data?.totalPages ?? 0}
                        onPrevious={goToPreviousPage}
                        onNext={handleNextPage}
                    />
                </div>
            </section>
        </div>
    );
};
