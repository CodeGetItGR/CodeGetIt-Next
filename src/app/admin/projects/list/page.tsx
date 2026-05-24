'use client'

import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationControls } from '@/components';
import { StatusBadge } from '@/components';
import { useSettingsOptions, usePaginationState } from '@/hooks';
import {ProjectStatus} from "@/api";
import {projectApi, ProjectListQuery} from "@/api/projects";
import Link from "next/link";

export default function ProjectsListPage() {
    const { page, resetPage, goToNextPage, goToPreviousPage } = usePaginationState();
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');

    const queryParams = useMemo<ProjectListQuery>(() => {
        const params: ProjectListQuery = { page, size: 10, sort: 'createdAt,desc' };
        if (statusFilter) {
            params.status = statusFilter;
        }
        return params;
    }, [page, statusFilter]);

    const projectsListQueryKey = useMemo(() => ['projects', queryParams] as const, [queryParams]);

    const projectsQuery = useQuery({
        queryKey: projectsListQueryKey,
        queryFn: () => projectApi.list(queryParams),
    });

    const handleStatusChange = useCallback(
        (value: string) => {
            setStatusFilter((value as ProjectStatus) || '');
            resetPage();
        },
        [resetPage]
    );

    const handleStatusFilterChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            handleStatusChange(event.target.value);
        },
        [handleStatusChange]
    );

    const handleNextPage = useCallback(() => {
        goToNextPage(projectsQuery.data?.totalPages ?? 0);
    }, [goToNextPage, projectsQuery.data?.totalPages]);

    const { options: projectStatusOptions } = useSettingsOptions({
        groupKey: 'project.status',
        scope: 'admin',
    });

    return (
        <div>
            <div className="mb-6">
                <p className="text-sm tracking-[0.16em] text-gray-500 uppercase">Projects</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">Active projects</h2>
                <p className="mt-1 text-sm text-gray-600">Track delivery state from planning to completion.</p>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
                <div className="mb-4 max-w-xs">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">All statuses</option>
                        {projectStatusOptions.map((status) => (
                            <option key={status.value} value={status.value as ProjectStatus}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-left text-xs tracking-wide text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Request</th>
                                <th className="px-4 py-3">Offer</th>
                                <th className="px-4 py-3">Updated</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {projectsQuery.data?.content.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{project.name}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge value={project.status} />
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{project.requestId}</td>
                                    <td className="px-4 py-3 text-gray-600">{project.offerId}</td>
                                    <td className="px-4 py-3 text-gray-600">{new Date(project.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/projects/detail/${project.id}`} className="text-sm font-medium text-gray-900 underline">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {projectsQuery.isLoading && <p className="mt-4 text-sm text-gray-500">Loading projects...</p>}
                {!projectsQuery.isLoading && projectsQuery.data?.content.length === 0 && (
                    <p className="mt-4 text-sm text-gray-500">No projects found for the selected filter.</p>
                )}

                <div className="mt-4">
                    <PaginationControls
                        page={page}
                        totalPages={projectsQuery.data?.totalPages ?? 0}
                        onPrevious={goToPreviousPage}
                        onNext={handleNextPage}
                    />
                </div>
            </section>
        </div>
    );
};
