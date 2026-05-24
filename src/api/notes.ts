import { apiClient } from '@/api/client';
import type { EntityType, NoteResponse, PagedResponse, UUID } from '@/api/types';

interface AddNotePayload {
    entityType: EntityType;
    entityId: UUID;
    content: string;
}

interface NotesQuery {
    entityType: EntityType;
    entityId: UUID;
    page?: number;
    size?: number;
}

export const noteApi = {
    list: async (query: NotesQuery) => {
        const { data } = await apiClient.get<PagedResponse<NoteResponse>>('/notes', {
            params: query,
        });
        return data;
    },

    add: async (payload: AddNotePayload) => {
        const { data } = await apiClient.post<NoteResponse>('/notes', payload);
        return data;
    },
};
