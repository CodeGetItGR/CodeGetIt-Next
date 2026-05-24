import { useCallback, useState } from 'react';
import { AuditPanel } from './AuditPanel';
import { NotesPanel } from './NotesPanel';
import type { EntityType, UUID } from '@/api';
import { cn } from '@/lib/utils';

type TabKey = 'notes' | 'history';

interface EntityAuxPanelsProps {
    entityType: EntityType;
    entityId: UUID;
}

export const EntityAuxPanels = ({ entityType, entityId }: EntityAuxPanelsProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>('notes');

    const handleShowNotes = useCallback(() => {
        setActiveTab('notes');
    }, []);

    const handleShowHistory = useCallback(() => {
        setActiveTab('history');
    }, []);

    return (
        <section>
            <div className="mb-3 flex gap-2">
                <button
                    type="button"
                    onClick={handleShowNotes}
                    className={cn('rounded-lg px-3 py-1.5 text-sm', activeTab === 'notes' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700')}
                >
                    Notes
                </button>
                <button
                    type="button"
                    onClick={handleShowHistory}
                    className={cn('rounded-lg px-3 py-1.5 text-sm', activeTab === 'history' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700')}
                >
                    Audit history
                </button>
            </div>

            {activeTab === 'notes' ? (
                <NotesPanel entityType={entityType} entityId={entityId} />
            ) : (
                <AuditPanel entityType={entityType} entityId={entityId} />
            )}
        </section>
    );
};
