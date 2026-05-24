import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {usePaginationState} from "@/hooks";
import {EntityType, historyApi, queryKeys, UUID} from "@/api";
import {PaginationControls} from "@/components";

interface AuditPanelProps {
    entityType: EntityType;
    entityId: UUID;
}

const HISTORY_PAGE_SIZE = 8;

export const AuditPanel = ({ entityType, entityId }: AuditPanelProps) => {
    const { page, goToNextPage, goToPreviousPage } = usePaginationState();

    const historyScopeQueryKey = useMemo(() => queryKeys.history.scoped(entityType, entityId), [entityId, entityType]);

    const historyQuery = useQuery({
        queryKey: queryKeys.history.list(entityType, entityId, page),
        queryFn: () => historyApi.list({ entityType, entityId, page, size: HISTORY_PAGE_SIZE }),
        enabled: historyScopeQueryKey.length > 0,
    });

    const handleNextPage = useCallback(() => {
        goToNextPage(historyQuery.data?.totalPages ?? 0);
    }, [goToNextPage, historyQuery.data?.totalPages]);

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Audit history</h3>
            <p className="mt-1 text-sm text-gray-600">Chronological log of changes for this entity.</p>

            <div className="mt-4 space-y-3">
                {historyQuery.isLoading && <p className="text-sm text-gray-500">Loading history...</p>}

                {historyQuery.data?.content.map((record) => (
                    <article key={record.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-medium text-gray-900">{record.actionType.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">{new Date(record.performedAt).toLocaleString()}</p>
                        </div>
                        {record.message && <p className="mt-2 text-sm text-gray-700">{record.message}</p>}
                        {!record.message && record.fieldName && (
                            <p className="mt-2 text-sm text-gray-700">
                                <span className="font-medium">{record.fieldName}</span>: {record.oldValue || '-'} to {record.newValue || '-'}
                            </p>
                        )}
                    </article>
                ))}

                {!historyQuery.isLoading && historyQuery.data?.content.length === 0 && <p className="text-sm text-gray-500">No history yet.</p>}
            </div>

            <div className="mt-4">
                <PaginationControls
                    page={page}
                    totalPages={historyQuery.data?.totalPages ?? 0}
                    onPrevious={goToPreviousPage}
                    onNext={handleNextPage}
                />
            </div>
        </section>
    );
};
