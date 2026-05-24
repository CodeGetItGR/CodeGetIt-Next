import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { noteApi , queryKeys, type UUID, type EntityType} from '@/api';
import { PaginationControls, Textarea } from '@/components';
import { useApiErrorState, usePaginationState } from '@/hooks';

interface NotesPanelProps {
    entityType: EntityType;
    entityId: UUID;
}

const NOTES_PAGE_SIZE = 5;

export const NotesPanel = ({ entityType, entityId }: NotesPanelProps) => {
    const [content, setContent] = useState('');
    const { page, goToNextPage, goToPreviousPage } = usePaginationState();
    const { errorMessage, setApiError, clearError } = useApiErrorState();
    const queryClient = useQueryClient();

    const notesScopeQueryKey = useMemo(() => queryKeys.notes.scoped(entityType, entityId), [entityId, entityType]);

    const notesQuery = useQuery({
        queryKey: queryKeys.notes.list(entityType, entityId, page),
        queryFn: () => noteApi.list({ entityType, entityId, page, size: NOTES_PAGE_SIZE }),
    });

    const addNoteMutation = useMutation({
        mutationFn: (payload: { content: string }) => noteApi.add({ entityType, entityId, content: payload.content }),
        onSuccess: async () => {
            setContent('');
            clearError();
            await queryClient.invalidateQueries({ queryKey: notesScopeQueryKey });
        },
        onError: (error) => {
            setApiError(error);
        },
    });

    const canSubmit = content.trim().length > 0;

    const handleSubmitNote = useCallback(() => {
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            return;
        }
        addNoteMutation.mutate({ content: trimmedContent });
    }, [addNoteMutation, content]);

    const handleContentChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    }, []);

    const handleNextPage = useCallback(() => {
        goToNextPage(notesQuery.data?.totalPages ?? 0);
    }, [goToNextPage, notesQuery.data?.totalPages]);

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            <p className="mt-1 text-sm text-gray-600">Internal notes for this entity.</p>

            <div className="mt-4 space-y-3">
                <Textarea
                    value={content}
                    onChange={handleContentChange}
                    rows={3}
                    label="Add a note"
                    placeholder="Add context, feedback, blockers..."
                    className="text-sm focus:border-gray-500"
                />
                {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
                <button
                    type="button"
                    onClick={handleSubmitNote}
                    disabled={!canSubmit || addNoteMutation.isPending}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {addNoteMutation.isPending ? 'Saving...' : 'Add note'}
                </button>
            </div>

            <div className="mt-6 space-y-3">
                {notesQuery.isLoading && <p className="text-sm text-gray-500">Loading notes...</p>}
                {notesQuery.data?.content.map((note) => (
                    <article key={note.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-sm text-gray-800">{note.content}</p>
                        <p className="mt-2 text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>
                    </article>
                ))}
                {!notesQuery.isLoading && notesQuery.data?.content.length === 0 && <p className="text-sm text-gray-500">No notes yet.</p>}
            </div>

            <div className="mt-4">
                <PaginationControls page={page} totalPages={notesQuery.data?.totalPages ?? 0} onPrevious={goToPreviousPage} onNext={handleNextPage} />
            </div>
        </section>
    );
};
