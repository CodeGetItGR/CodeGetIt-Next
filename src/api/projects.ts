import { apiClient } from './client';
import type { PagedResponse, ProjectResponse, ProjectStatus, UUID } from './types';

export interface ProjectListQuery {
    page?: number;
    size?: number;
    sort?: string;
    status?: ProjectStatus;
}

export interface UpdateProjectPayload {
    name: string;
    description?: string;
    ownerUserId?: UUID;
}

interface ProjectStatusPayload {
    targetStatus: ProjectStatus;
    reason?: string;
}

export interface CreateGithubRepoPayload {
    mode: 'CREATE';
    repoName?: string;
    privateRepo?: boolean;
}

export interface LinkGithubRepoPayload {
    mode: 'LINK';
    repoUrl: string;
    repoName?: string;
}

export type GithubRepoActionPayload = CreateGithubRepoPayload | LinkGithubRepoPayload;

export const projectApi = {
    list: async (query: ProjectListQuery) => {
        const { data } = await apiClient.get<PagedResponse<ProjectResponse>>('/projects', {
            params: query,
        });
        return data;
    },

    getById: async (id: UUID) => {
        const { data } = await apiClient.get<ProjectResponse>(`/projects/${id}`);
        return data;
    },

    update: async (id: UUID, payload: UpdateProjectPayload) => {
        const { data } = await apiClient.put<ProjectResponse>(`/projects/${id}`, payload);
        return data;
    },

    changeStatus: async (id: UUID, payload: ProjectStatusPayload) => {
        const { data } = await apiClient.patch<ProjectResponse>(`/projects/${id}/status`, payload);
        return data;
    },

    githubRepoAction: async (id: UUID, payload: GithubRepoActionPayload) => {
        const { data } = await apiClient.post<ProjectResponse>(`/projects/${id}/github-repo`, payload);
        return data;
    },
};
