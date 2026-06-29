'use client';

import { useDeferredValue, useMemo, useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowRight, BarChart3, CalendarDays, RefreshCw } from 'lucide-react';
import { aiApi, queryKeys, type AiInteractionType, type AiInteractionStatus, type AiUsageStatsQuery } from '@/api';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { normalizeApiError } from '@/api/client';
import { cn } from '@/lib/utils';
import { PANEL_CLASS } from '@/components/admin/settings/Utils';

type AiUsageMode = 'overview' | 'detail';

const STATUS_ORDER: AiInteractionStatus[] = ['SUCCESS', 'RATE_LIMITED', 'ERROR', 'TIMEOUT'];

const INTERACTION_LABELS: Record<AiInteractionType, string> = {
    REQUEST_ANALYSIS: 'Request analysis',
    CHAT_MESSAGE: 'Chat message',
    AUTO_SUMMARY: 'Auto summary',
    THREAD_CONTEXT_SWITCH: 'Thread context switch',
    CUSTOM: 'Custom',
    CONTACT_ACKNOWLEDGMENT: 'Contact acknowledgment',
};

const currency2 = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const currency4 = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
});

const numberFormatter = new Intl.NumberFormat('en-US');
const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
});

function toDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function buildDefaultRange() {
    const now = new Date();
    const to = toDateInputValue(now);
    const fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - 30);
    return {
        from: toDateInputValue(fromDate),
        to,
    };
}

function formatDayLabel(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });
}

function getUsageQueryParams(from: string, to: string, model: string, interactionType: AiInteractionType | ''): AiUsageStatsQuery {
    const query: AiUsageStatsQuery = { from, to };

    if (model.trim()) {
        query.model = model.trim();
    }

    if (interactionType) {
        query.interactionType = interactionType;
    }

    return query;
}

function MetricCard({
    label,
    value,
    detail,
}: {
    label: string;
    value: string;
    detail?: string;
}) {
    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-medium tracking-[0.18em] text-gray-500 uppercase">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
            {detail && <p className="mt-1 text-sm text-gray-600">{detail}</p>}
        </article>
    );
}

function BreakdownBar({
    label,
    calls,
    totalCalls,
    accentClassName,
    meta,
}: {
    label: string;
    calls: number;
    totalCalls: number;
    accentClassName: string;
    meta?: string;
}) {
    const percent = totalCalls > 0 ? (calls / totalCalls) * 100 : 0;

    return (
        <div>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-gray-900">{label}</span>
                <span className="tabular-nums text-gray-500">{numberFormatter.format(calls)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className={cn('h-full rounded-full transition-all', accentClassName)} style={{ width: `${percent}%` }} />
            </div>
            {meta && <p className="mt-1 text-xs text-gray-500">{meta}</p>}
        </div>
    );
}

function TrendChart({
    title,
    subtitle,
    values,
    dates,
    formatter,
    strokeClassName,
    fillClassName,
}: {
    title: string;
    subtitle: string;
    values: number[];
    dates: string[];
    formatter: (value: number) => string;
    strokeClassName: string;
    fillClassName: string;
}) {
    const resolvedValues = useMemo(() => (values.length > 0 ? values : [0]), [values]);
    const max = Math.max(...resolvedValues, 1);
    const linePath = useMemo(() => {
        if (resolvedValues.length === 1) {
            return 'M 0 32 L 100 32';
        }

        return resolvedValues
            .map((value, index) => {
                const x = (index / (resolvedValues.length - 1)) * 100;
                const y = 36 - (value / max) * 30;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    }, [max, resolvedValues]);

    const areaPath = useMemo(() => {
        if (resolvedValues.length === 1) {
            return 'M 0 36 L 100 36 L 100 36 L 0 36 Z';
        }

        const line = resolvedValues
            .map((value, index) => {
                const x = (index / (resolvedValues.length - 1)) * 100;
                const y = 36 - (value / max) * 30;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');

        return `${line} L 100 36 L 0 36 Z`;
    }, [max, resolvedValues]);

    const firstLabel = dates[0] ? formatDayLabel(dates[0]) : 'Start';
    const lastDate = dates[dates.length - 1];
    const lastLabel = lastDate ? formatDayLabel(lastDate) : 'End';

    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h4 className="text-base font-semibold text-gray-900">{title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                </div>
                <p className="text-right text-sm text-gray-500">
                    Latest: <span className="font-medium text-gray-900">{formatter(resolvedValues[resolvedValues.length - 1] ?? 0)}</span>
                </p>
            </div>

            {values.length === 0 ? (
                <p className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                    No daily data in this range.
                </p>
            ) : (
                <div className="mt-5">
                    <svg viewBox="0 0 100 40" className="h-40 w-full overflow-visible" role="img" aria-label={title}>
                        <path d={areaPath} className={cn('text-current', fillClassName)} fill="currentColor" opacity={0.12} />
                        <path d={linePath} fill="none" className={cn('stroke-[1.75px]', strokeClassName)} />
                    </svg>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <span>{firstLabel}</span>
                        <span>{lastLabel}</span>
                    </div>
                </div>
            )}
        </article>
    );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
    return (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-base font-semibold text-gray-900">{title}</p>
            <p className="mt-2 text-sm text-gray-600">{detail}</p>
        </div>
    );
}

export function AiUsageAnalytics({ mode }: { mode: AiUsageMode }) {
    const defaultRange = useMemo(() => buildDefaultRange(), []);
    const [from, setFrom] = useState(defaultRange.from);
    const [to, setTo] = useState(defaultRange.to);
    const [model, setModel] = useState('');
    const [interactionType, setInteractionType] = useState<AiInteractionType | ''>('');
    const deferredModel = useDeferredValue(model);

    const resolvedFrom = mode === 'overview' ? defaultRange.from : from;
    const resolvedTo = mode === 'overview' ? defaultRange.to : to;
    const queryParams = useMemo(() => getUsageQueryParams(resolvedFrom, resolvedTo, mode === 'overview' ? '' : deferredModel, mode === 'overview' ? '' : interactionType), [
        deferredModel,
        interactionType,
        mode,
        resolvedFrom,
        resolvedTo,
    ]);

    const rangeIsValid = resolvedFrom <= resolvedTo;

    const usageQuery = useQuery({
        queryKey: queryKeys.ai.usageStats(queryParams),
        queryFn: () => aiApi.getUsageStats(queryParams),
        enabled: rangeIsValid,
        staleTime: 30_000,
    });

    const errorMessage = useMemo(() => {
        if (rangeIsValid) {
            return null;
        }

        return 'The start date must be on or before the end date.';
    }, [rangeIsValid]);

    const clearFilters = () => {
        setFrom(defaultRange.from);
        setTo(defaultRange.to);
        setModel('');
        setInteractionType('');
    };

    const orderedStatuses = useMemo(() => {
        const items = usageQuery.data?.by_status ?? [];
        return [...items].sort((left, right) => {
            const leftIndex = STATUS_ORDER.indexOf(left.status);
            const rightIndex = STATUS_ORDER.indexOf(right.status);
            return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
        });
    }, [usageQuery.data?.by_status]);

    const topModels = usageQuery.data?.by_model ?? [];
    const topInteractions = usageQuery.data?.by_interaction_type ?? [];
    const content = usageQuery.data;
    const byDay = content?.by_day ?? [];
    const byModel = content?.by_model ?? [];
    const byInteractions = content?.by_interaction_type ?? [];
    const byStatus = content?.by_status ?? [];
    const summary = content?.summary;
    const hasData = Boolean(content && (byDay.length > 0 || byModel.length > 0 || byInteractions.length > 0 || byStatus.length > 0));
    const isEmptyResult = Boolean(content && summary?.total_calls === 0 && !hasData);

    const isDetail = mode === 'detail';

    return (
        <div className="space-y-6">
            <section className={PANEL_CLASS}>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-6 py-6">
                    <div>
                        <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">AI analytics</p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                            {isDetail ? 'Usage dashboard' : 'Usage snapshot'}
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm text-gray-600">
                            {isDetail
                                ? 'Inspect cost, token volume, model mix, and reliability across the admin AI surface.'
                                : 'A compact view of the last 30 days. Open the full dashboard for filters and deeper breakdowns.'}
                        </p>
                    </div>

                    {isDetail ? (
                        <button
                            type="button"
                            onClick={() => void usageQuery.refetch()}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <RefreshCw className={cn('h-4 w-4', usageQuery.isFetching && 'animate-spin')} />
                            Refresh
                        </button>
                    ) : (
                        <Link
                            href="/admin/ai-usage"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Open analytics
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>

                {isDetail && (
                    <div className="grid gap-3 border-b border-gray-100 px-6 py-5 lg:grid-cols-[160px_160px_1fr_220px]">
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium tracking-[0.16em] text-gray-500 uppercase">From</span>
                            <input
                                type="date"
                                value={from}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setFrom(event.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                            />
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium tracking-[0.16em] text-gray-500 uppercase">To</span>
                            <input
                                type="date"
                                value={to}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setTo(event.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                            />
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium tracking-[0.16em] text-gray-500 uppercase">Model</span>
                            <input
                                type="text"
                                value={model}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setModel(event.target.value)}
                                placeholder="gpt-4-turbo"
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                            />
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium tracking-[0.16em] text-gray-500 uppercase">Interaction</span>
                            <select
                                value={interactionType}
                                onChange={(event: ChangeEvent<HTMLSelectElement>) => setInteractionType(event.target.value as AiInteractionType | '')}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
                            >
                                <option value="">All types</option>
                                {(Object.keys(INTERACTION_LABELS) as AiInteractionType[]).map((type) => (
                                    <option key={type} value={type}>
                                        {INTERACTION_LABELS[type]}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="flex flex-wrap items-end gap-2 lg:col-span-4">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                <CalendarDays className="h-4 w-4" />
                                Reset range
                            </button>
                            <p className="text-sm text-gray-500">
                                Default range: {defaultRange.from} to {defaultRange.to}
                            </p>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="border-b border-amber-100 bg-amber-50 px-6 py-4 text-sm text-amber-800">{errorMessage}</div>
                )}

                <div className="px-6 py-6">
                    {usageQuery.isLoading ? (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-10 text-sm text-gray-500">
                            Loading AI usage metrics...
                        </div>
                    ) : usageQuery.isError ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                            {normalizeApiError(usageQuery.error).detail}
                        </div>
                    ) : !summary ? (
                        <EmptyState
                            title="No AI usage data yet"
                            detail="Once the AI endpoints start processing requests, the dashboard will populate automatically."
                        />
                    ) : isEmptyResult ? (
                        <EmptyState
                            title="No matching usage"
                            detail="Try broadening the date range or clearing the filters to see results."
                        />
                    ) : (
                        <div className="space-y-6">
                            <div className={cn('grid gap-4', isDetail ? 'md:grid-cols-2 xl:grid-cols-5' : 'md:grid-cols-2 xl:grid-cols-4')}>
                                <MetricCard label="Total cost" value={currency2.format(summary!.total_cost)} detail={`Avg per call: ${currency4.format(summary!.avg_cost_per_call)}`} />
                                <MetricCard label="Total calls" value={numberFormatter.format(summary!.total_calls)} detail={`Success rate: ${percentFormatter.format(summary!.success_rate)}`} />
                                <MetricCard label="Total tokens" value={numberFormatter.format(summary!.total_tokens)} detail={`Input ${numberFormatter.format(summary!.total_input_tokens)} | Output ${numberFormatter.format(summary!.total_output_tokens)}`} />
                                <MetricCard label="Input tokens" value={numberFormatter.format(summary!.total_input_tokens)} detail="Prompt / context volume" />
                                {isDetail && <MetricCard label="Output tokens" value={numberFormatter.format(summary!.total_output_tokens)} detail="Generated response volume" />}
                            </div>

                            <div className="grid gap-4 xl:grid-cols-2">
                                <TrendChart
                                    title="Cost trend"
                                    subtitle="Daily spend over the selected range."
                                    values={byDay.map((item) => item.cost)}
                                    dates={byDay.map((item) => item.date)}
                                    formatter={(value) => currency4.format(value)}
                                    strokeClassName="stroke-emerald-500"
                                    fillClassName="text-emerald-500"
                                />
                                <TrendChart
                                    title="Token trend"
                                    subtitle="Daily total token volume."
                                    values={byDay.map((item) => item.total_tokens)}
                                    dates={byDay.map((item) => item.date)}
                                    formatter={(value) => numberFormatter.format(value)}
                                    strokeClassName="stroke-slate-900"
                                    fillClassName="text-slate-900"
                                />
                            </div>

                            <div className="grid gap-4 xl:grid-cols-3">
                                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-gray-500" />
                                        <h3 className="text-base font-semibold text-gray-900">Top models</h3>
                                    </div>
                                    <div className="mt-5 space-y-4">
                                        {topModels.slice(0, isDetail ? 8 : 4).map((item) => (
                                            <BreakdownBar
                                                key={item.model}
                                                label={item.model}
                                                calls={item.calls}
                                                totalCalls={summary!.total_calls}
                                                accentClassName="bg-emerald-500"
                                                meta={`${currency2.format(item.cost)} | ${numberFormatter.format(item.total_tokens)} tokens`}
                                            />
                                        ))}
                                        {topModels.length === 0 && <p className="text-sm text-gray-500">No model breakdown available.</p>}
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-gray-500" />
                                        <h3 className="text-base font-semibold text-gray-900">Interaction types</h3>
                                    </div>
                                    <div className="mt-5 space-y-4">
                                        {topInteractions.slice(0, isDetail ? 8 : 4).map((item) => (
                                            <BreakdownBar
                                                key={item.interaction_type}
                                                label={INTERACTION_LABELS[item.interaction_type]}
                                                calls={item.calls}
                                                totalCalls={summary!.total_calls}
                                                accentClassName="bg-slate-900"
                                                meta={`${currency2.format(item.cost)} | ${numberFormatter.format(item.total_tokens)} tokens`}
                                            />
                                        ))}
                                        {topInteractions.length === 0 && <p className="text-sm text-gray-500">No interaction breakdown available.</p>}
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-gray-500" />
                                        <h3 className="text-base font-semibold text-gray-900">Reliability</h3>
                                    </div>
                                    <div className="mt-5 space-y-4">
                                        {orderedStatuses.map((item) => (
                                            <div key={item.status} className="rounded-2xl border border-gray-100 p-3">
                                                        <div className="mb-3 flex items-center justify-between gap-3">
                                                            <StatusBadge value={item.status} />
                                                            <span className="text-sm font-medium text-gray-900">{numberFormatter.format(item.calls)}</span>
                                                        </div>
                                                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className={cn(
                                                            'h-full rounded-full',
                                                            item.status === 'SUCCESS' && 'bg-emerald-500',
                                                            item.status === 'RATE_LIMITED' && 'bg-amber-500',
                                                            item.status === 'ERROR' && 'bg-rose-500',
                                                            item.status === 'TIMEOUT' && 'bg-orange-500'
                                                        )}
                                                        style={{ width: `${summary!.total_calls > 0 ? (item.calls / summary!.total_calls) * 100 : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {orderedStatuses.length === 0 && <p className="text-sm text-gray-500">No status breakdown available.</p>}
                                    </div>
                                </section>
                            </div>

                            {isDetail && (
                                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">Daily breakdown</h3>
                                            <p className="mt-1 text-sm text-gray-600">Tokens and cost by day, sorted oldest to newest.</p>
                                        </div>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                            {byDay.length} days
                                        </span>
                                    </div>

                                    <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                                            <thead className="bg-gray-50 text-left text-xs tracking-wide text-gray-500 uppercase">
                                                <tr>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Calls</th>
                                                    <th className="px-4 py-3">Tokens</th>
                                                    <th className="px-4 py-3">Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {byDay.map((item) => (
                                                    <tr key={item.date} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-medium text-gray-900">{item.date}</td>
                                                        <td className="px-4 py-3 text-gray-600">{numberFormatter.format(item.calls)}</td>
                                                        <td className="px-4 py-3 text-gray-600">{numberFormatter.format(item.total_tokens)}</td>
                                                        <td className="px-4 py-3 text-gray-600">{currency2.format(item.cost)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            )}

                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
