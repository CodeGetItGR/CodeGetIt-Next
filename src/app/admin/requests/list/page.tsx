'use client'

import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys, requestApi, type RequestListQuery, type Priority, type RequestStatus  } from '@/api';
import { PaginationControls, StatusBadge, CreateRequestSheet } from '@/components';
import { usePaginationState, useSettingsOptions } from '@/hooks';
import Link from "next/link";

type FilterType = 'status' | 'priority' | 'requesterEmail' | 'submittedByUserId';

const filterTypeOptions: ReadonlyArray<{ value: FilterType; label: string }> = [
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'requesterEmail', label: 'Requester email' },
    { value: 'submittedByUserId', label: 'Submitted by user id' },
];

function toFilterType(value: string): FilterType {
    const validValues: readonly FilterType[] = ['status', 'priority', 'requesterEmail', 'submittedByUserId'];
    return validValues.includes(value as FilterType) ? (value as FilterType) : 'status';
}

export default function RequestsListPage () {
    const { page, resetPage, goToNextPage, goToPreviousPage } = usePaginationState();
    const [filterType, setFilterType] = useState<FilterType>('status');
    const [filterValue, setFilterValue] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [copiedRequestId, setCopiedRequestId] = useState<string | null>(null);

    const queryParams = useMemo<RequestListQuery>(() => {
        const params: RequestListQuery = { page, size: 10, sort: 'createdAt,desc' };

        if (filterType === 'status' && filterValue) {
            params.status = filterValue as RequestStatus;
        } else if (filterType === 'priority' && filterValue) {
            params.priority = filterValue as Priority;
        } else if (filterType === 'requesterEmail' && filterValue.trim()) {
            params.requesterEmail = filterValue.trim();
        } else if (filterType === 'submittedByUserId' && filterValue.trim()) {
            params.submittedByUserId = filterValue.trim();
        }

        return params;
    }, [filterType, filterValue, page]);

    const requestsQuery = useQuery({
        queryKey: queryKeys.requests.list(queryParams),
        queryFn: () => requestApi.list(queryParams),
    });

    const handleFilterTypeChange = useCallback(
        (value: string) => {
            setFilterType(toFilterType(value));
            setFilterValue('');
            resetPage();
        },
        [resetPage]
    );

    const handleFilterValueChange = useCallback(
        (value: string) => {
            setFilterValue(value);
            resetPage();
        },
        [resetPage]
    );

    const handleOpenCreate = useCallback(() => {
        setShowCreate(true);
    }, []);

    const handleCloseCreate = useCallback(() => {
        setShowCreate(false);
    }, []);

    const handleFilterTypeSelectChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleFilterTypeChange(event.target.value);
        },
        [handleFilterTypeChange]
    );

    const handleFilterValueChangeEvent = useCallback(
        (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            handleFilterValueChange(event.target.value);
        },
        [handleFilterValueChange]
    );

    const handleNextPage = useCallback(() => {
        goToNextPage(requestsQuery.data?.totalPages ?? 0);
    }, [goToNextPage, requestsQuery.data?.totalPages]);

    const handleCopyRequestId = useCallback(async (requestId: string) => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(requestId);
            } else {
                const input = document.createElement('input');
                input.value = requestId;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
            }

            setCopiedRequestId(requestId);
            window.setTimeout(() => setCopiedRequestId(null), 1800);
        } catch {
            setCopiedRequestId(null);
        }
    }, []);

    const { options: requestStatusOptions } = useSettingsOptions({
        groupKey: 'request.status',
        scope: 'admin',
    });
    const { options: requestPriorityOptions } = useSettingsOptions({
        groupKey: 'request.priority',
        scope: 'admin',
    });

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">Requests</p>
                    <h2 className="mt-1 text-3xl font-bold text-gray-900">Incoming requests</h2>
                    <p className="mt-1 text-sm text-gray-600">Filter by one field at a time, matching backend precedence.</p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    + New request
                </button>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                <div className="mb-4 grid gap-3 md:grid-cols-[190px_1fr]">
                    <select
                        value={filterType}
                        onChange={handleFilterTypeSelectChange}
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    >
                        {filterTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {filterType === 'status' ? (
                        <select
                            value={filterValue}
                            onChange={handleFilterValueChangeEvent}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">All statuses</option>
                            {requestStatusOptions.map((item) => (
                                <option key={item.value} value={item.value as RequestStatus}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    ) : filterType === 'priority' ? (
                        <select
                            value={filterValue}
                            onChange={handleFilterValueChangeEvent}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">All priorities</option>
                            {requestPriorityOptions.map((item) => (
                                <option key={item.value} value={item.value as Priority}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            value={filterValue}
                            onChange={handleFilterValueChangeEvent}
                            placeholder={filterType === 'requesterEmail' ? 'e.g. jane@example.com' : 'User UUID'}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        />
                    )}
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-left text-xs tracking-wide text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Request ID</th>
                                <th className="px-4 py-3">Requester</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Priority</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {requestsQuery.data?.content.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{request.title}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="max-w-42.5 truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700"
                                                title={request.id}
                                            >
                                                {request.id}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => void handleCopyRequestId(request.id)}
                                                className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                {copiedRequestId === request.id ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{request.requesterEmail}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge value={request.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge value={request.priority} />
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{new Date(request.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/requests/detail/${request.id}`} className="text-sm font-medium text-gray-900 underline">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {requestsQuery.isLoading && <p className="mt-4 text-sm text-gray-500">Loading requests...</p>}
                {!requestsQuery.isLoading && requestsQuery.data?.content.length === 0 && (
                    <p className="mt-4 text-sm text-gray-500">No requests found for the selected filter.</p>
                )}

                <div className="mt-4">
                    <PaginationControls
                        page={page}
                        totalPages={requestsQuery.data?.totalPages ?? 0}
                        onPrevious={goToPreviousPage}
                        onNext={handleNextPage}
                    />
                </div>
            </section>

            <CreateRequestSheet isOpen={showCreate} onClose={handleCloseCreate} />
        </div>
    );
};
