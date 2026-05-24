import type { EntityType, UUID } from './types';

interface EntityQueryKeys {
    root: readonly [string];
    list: (params: object) => readonly [string, object];
    detail: (id: UUID) => readonly [string, UUID];
}

interface RelationalQueryKeys {
    scoped: (entityType: EntityType, entityId: UUID) => readonly [string, EntityType, UUID];
    list: (entityType: EntityType, entityId: UUID, page: number) => readonly [string, EntityType, UUID, number];
}

interface QueryKeys {
    dashboard: {
        requestsCount: readonly [string, string];
        offersCount: readonly [string, string];
        projectsCount: readonly [string, string];
    };
    requests: EntityQueryKeys;
    offers: EntityQueryKeys;
    projects: EntityQueryKeys;
    notes: RelationalQueryKeys;
    history: RelationalQueryKeys;
    contactMessages: {
        root: readonly [string];
        list: (params: object) => readonly [string, object];
    };
    settings: {
        root: readonly [string];
        list: readonly [string, string];
        public: readonly [string, string];
        options: readonly [string, string];
        optionsPublic: readonly [string, string];
    };
    ai: {
        analysis: (offerId: UUID) => readonly [string, string, UUID];
        requestAnalysis: (requestId: UUID) => readonly [string, string, UUID];
        requestAnalysisStatus: (requestId: UUID) => readonly [string, string, UUID];
        thread: (threadId: UUID) => readonly [string, string, UUID];
        messages: (threadId: UUID, limit: number) => readonly [string, string, UUID, number];
        stats: (offerId: UUID) => readonly [string, string, UUID];
    };
}

export const queryKeys: QueryKeys = {
    dashboard: {
        requestsCount: ['dashboard', 'requests-count'],
        offersCount: ['dashboard', 'offers-count'],
        projectsCount: ['dashboard', 'projects-count'],
    },
    requests: {
        root: ['requests'],
        list: (params) => ['requests', params],
        detail: (id) => ['request', id],
    },
    offers: {
        root: ['offers'],
        list: (params) => ['offers', params],
        detail: (id) => ['offer', id],
    },
    projects: {
        root: ['projects'],
        list: (params) => ['projects', params],
        detail: (id) => ['project', id],
    },
    notes: {
        scoped: (entityType, entityId) => ['notes', entityType, entityId],
        list: (entityType, entityId, page) => ['notes', entityType, entityId, page],
    },
    history: {
        scoped: (entityType, entityId) => ['history', entityType, entityId],
        list: (entityType, entityId, page) => ['history', entityType, entityId, page],
    },
    contactMessages: {
        root: ['contact-messages'] as const,
        list: (params: object) => ['contact-messages', params] as const,
    },
    settings: {
        root: ['settings'] as const,
        list: ['settings', 'list'] as const,
        public: ['settings', 'public'] as const,
        options: ['settings', 'options'] as const,
        optionsPublic: ['settings', 'options-public'] as const,
    },
    ai: {
        analysis: (offerId) => ['ai', 'analysis', offerId] as const,
        requestAnalysis: (requestId) => ['ai', 'request-analysis', requestId] as const,
        requestAnalysisStatus: (requestId) => ['ai', 'request-analysis-status', requestId] as const,
        thread: (threadId) => ['ai', 'thread', threadId] as const,
        messages: (threadId, limit) => ['ai', 'messages', threadId, limit] as const,
        stats: (offerId) => ['ai', 'stats', offerId] as const,
    },
};
