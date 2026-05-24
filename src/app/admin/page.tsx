'use client'

import { useQuery } from '@tanstack/react-query';
import { offerApi, projectApi, queryKeys, requestApi} from '@/api';
import Link from "next/link";

interface StatCardProps {
    label: string;
    value: string;
    hint: string;
}

const StatCard = ({ label, value, hint }: StatCardProps) => (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs tracking-[0.12em] text-gray-500 uppercase">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        <p className="mt-1 text-sm text-gray-600">{hint}</p>
    </article>
);

export default function AdminPage() {
    const requestsQuery = useQuery({
        queryKey: queryKeys.dashboard.requestsCount,
        queryFn: () => requestApi.list({ page: 0, size: 1 }),
    });

    const offersQuery = useQuery({
        queryKey: queryKeys.dashboard.offersCount,
        queryFn: () => offerApi.list({ page: 0, size: 1 }),
    });

    const projectsQuery = useQuery({
        queryKey: queryKeys.dashboard.projectsCount,
        queryFn: () => projectApi.list({ page: 0, size: 1 }),
    });

    const loading = requestsQuery.isLoading || offersQuery.isLoading || projectsQuery.isLoading;

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-medium tracking-[0.16em] text-gray-500 uppercase">Overview</p>
                    <h2 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Operations dashboard</h2>
                    <p className="mt-2 text-sm text-gray-600">Live snapshot of your request -&gt; offer -&gt; project pipeline.</p>
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">Loading metrics...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard label="Requests" value={String(requestsQuery.data?.totalElements ?? 0)} hint="Inbound opportunities" />
                    <StatCard label="Offers" value={String(offersQuery.data?.totalElements ?? 0)} hint="Commercial proposals" />
                    <StatCard label="Projects" value={String(projectsQuery.data?.totalElements ?? 0)} hint="Accepted work in execution" />
                </div>
            )}

            <section className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                    {
                        to: '/admin/requests',
                        title: 'Manage requests',
                        description: 'Qualify and approve incoming requests.',
                    },
                    {
                        to: '/admin/offers',
                        title: 'Manage offers',
                        description: 'Create offers and move proposals to acceptance.',
                    },
                    {
                        to: '/admin/projects',
                        title: 'Manage projects',
                        description: 'Track delivery status until completion.',
                    },
                ].map((item) => (
                    <Link
                        key={item.to}
                        href={item.to}
                        className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300"
                    >
                        <p className="text-lg font-semibold text-gray-900">{item.title}</p>
                        <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                        <p className="mt-4 text-sm font-medium text-gray-900">Open section -&gt;</p>
                    </Link>
                ))}
            </section>
        </div>
    );
};
