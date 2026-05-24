'use client'

import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import {offerApi, OfferListQuery, OfferStatus, queryKeys} from "@/api";
import Link from "next/link";
import {usePaginationState, useSettingsOptions} from "@/hooks";
import {CreateOfferSheet, PaginationControls, StatusBadge} from "@/components";

type FilterType = 'status' | 'requestId';

export default function OffersListPage(){
    const { page, resetPage, goToNextPage, goToPreviousPage } = usePaginationState();
    const [filterType, setFilterType] = useState<FilterType>('status');
    const [filterValue, setFilterValue] = useState('');
    const [showCreate, setShowCreate] = useState(false);

    const queryParams = useMemo<OfferListQuery>(() => {
        const params: OfferListQuery = { page, size: 10, sort: 'createdAt,desc' };

        if (filterType === 'status' && filterValue) {
            params.status = filterValue as OfferStatus;
        } else if (filterType === 'requestId' && filterValue.trim()) {
            params.requestId = filterValue.trim();
        }

        return params;
    }, [filterType, filterValue, page]);

    const offersQuery = useQuery({
        queryKey: queryKeys.offers.list(queryParams),
        queryFn: () => offerApi.list(queryParams),
    });

    const handleFilterTypeChange = useCallback(
        (value: FilterType) => {
            setFilterType(value);
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
            handleFilterTypeChange(event.target.value as FilterType);
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
        goToNextPage(offersQuery.data?.totalPages ?? 0);
    }, [goToNextPage, offersQuery.data?.totalPages]);

    const { options: offerStatusOptions } = useSettingsOptions({
        groupKey: 'offer.status',
        scope: 'admin',
    });

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">Offers</p>
                    <h2 className="mt-1 text-3xl font-bold text-gray-900">Commercial offers</h2>
                    <p className="mt-1 text-sm text-gray-600">Filter by status or request id based on backend precedence.</p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    + New offer
                </button>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                <div className="mb-4 grid gap-3 md:grid-cols-[160px_1fr]">
                    <select
                        value={filterType}
                        onChange={handleFilterTypeSelectChange}
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="status">Status</option>
                        <option value="requestId">Request ID</option>
                    </select>

                    {filterType === 'status' ? (
                        <select
                            value={filterValue}
                            onChange={handleFilterValueChangeEvent}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">All statuses</option>
                            {offerStatusOptions.map((status) => (
                                <option key={status.value} value={status.value as OfferStatus}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            value={filterValue}
                            onChange={handleFilterValueChangeEvent}
                            placeholder="Request UUID"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                        />
                    )}
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-left text-xs tracking-wide text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Request</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Active</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {offersQuery.data?.content.map((offer) => (
                                <tr key={offer.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{offer.title}</td>
                                    <td className="px-4 py-3 text-gray-600">{offer.requestId}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge value={offer.status} />
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{offer.active ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {typeof offer.priceAmount === 'number' ? `${offer.priceAmount} ${offer.currency || ''}`.trim() : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/offers/detail/${offer.id}`} className="text-sm font-medium text-gray-900 underline">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {offersQuery.isLoading && <p className="mt-4 text-sm text-gray-500">Loading offers...</p>}
                {!offersQuery.isLoading && offersQuery.data?.content.length === 0 && (
                    <p className="mt-4 text-sm text-gray-500">No offers found for the selected filter.</p>
                )}

                <div className="mt-4">
                    <PaginationControls
                        page={page}
                        totalPages={offersQuery.data?.totalPages ?? 0}
                        onPrevious={goToPreviousPage}
                        onNext={handleNextPage}
                    />
                </div>
            </section>

            <CreateOfferSheet isOpen={showCreate} onClose={handleCloseCreate} />
        </div>
    );
};
