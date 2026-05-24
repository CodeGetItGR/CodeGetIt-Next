import { apiClient } from '@/api/client';
import {ActionHistoryResponse, EntityType, PagedResponse, UUID} from "@/api/types";

interface HistoryQuery {
    entityType: EntityType;
    entityId: UUID;
    page?: number;
    size?: number;
}

export const historyApi = {
    list: async (query: HistoryQuery) => {
        const { data } = await apiClient.get<PagedResponse<ActionHistoryResponse>>('/history', {
            params: query,
        });
        return data;
    },
};
