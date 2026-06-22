import { apiClient } from './client';
import type {
    BudgetFlexibility,
    BudgetRange,
    CommunicationPreference,
    DataSensitivity,
    DesiredStartWindow,
    OfferLanguage,
    PagedResponse,
    Priority,
    ProjectType,
    RequestResponse,
    RequestStatus,
    UUID,
} from './types';

export interface RequestListQuery {
    page?: number;
    size?: number;
    sort?: string;
    status?: RequestStatus;
    priority?: Priority;
    requesterEmail?: string;
    submittedByUserId?: UUID;
}

export interface UpdateRequestPayload {
    title: string;
    description?: string;
    priority?: Priority;
    requesterName?: string;
    projectType?: ProjectType;
    businessGoal?: string;
    organizationName?: string;
    industry?: string;
    targetAudience?: string;
    desiredStartWindow?: DesiredStartWindow;
    targetLaunchWindow?: string;
    budgetRange?: BudgetRange;
    budgetFlexibility?: BudgetFlexibility;
    enterpriseInquiry?: boolean;
    communicationPreference?: CommunicationPreference;
    legalOrBrandConstraints?: string;
    dataSensitivity?: DataSensitivity;
    language?: OfferLanguage;
}

export interface ChangeStatusPayload<TStatus extends string> {
    targetStatus: TStatus;
    reason?: string;
}

export interface SubmitRequestPayload {
    title: string;
    description?: string;
    requesterName: string;
    requesterEmail: string;
    requesterPhone: string;
    projectType: ProjectType;
    businessGoal: string;
    organizationName?: string;
    industry?: string;
    targetAudience?: string;
    desiredStartWindow: DesiredStartWindow;
    targetLaunchWindow?: string;
    budgetRange: BudgetRange;
    budgetFlexibility?: BudgetFlexibility;
    enterpriseInquiry?: boolean;
    communicationPreference?: CommunicationPreference;
    legalOrBrandConstraints?: string;
    dataSensitivity?: DataSensitivity;
    priority?: Priority;
    language?: OfferLanguage;
}

export const requestApi = {
    list: async (query: RequestListQuery) => {
        const { data } = await apiClient.get<PagedResponse<RequestResponse>>('/requests', {
            params: query,
        });
        return data;
    },

    getById: async (id: UUID) => {
        const { data } = await apiClient.get<RequestResponse>(`/requests/${id}`);
        return data;
    },

    update: async (id: UUID, payload: UpdateRequestPayload) => {
        const { data } = await apiClient.put<RequestResponse>(`/requests/${id}`, payload);
        return data;
    },

    changeStatus: async (id: UUID, payload: ChangeStatusPayload<RequestStatus>) => {
        const { data } = await apiClient.patch<RequestResponse>(`/requests/${id}/status`, payload);
        return data;
    },

    submit: async (payload: SubmitRequestPayload) => {
        const { data } = await apiClient.post<RequestResponse>('/requests/submit', payload);
        return data;
    },
};
