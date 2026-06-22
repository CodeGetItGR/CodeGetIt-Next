import { apiClient } from './client';
import { getCurrentLocale } from '@/i18n/locale-storage';

export type AppSettingType = 'STRING' | 'BOOLEAN' | 'INTEGER';

export interface AppConfigResponse {
    key: string;
    value: string;
    type: AppSettingType;
}

export interface AppConfigUpsertPayload {
    value: string;
    type: AppSettingType;
}

export interface AppConfigBatchItem {
    key: string;
    value: string;
    type: AppSettingType;
}

export interface AppConfigBatchPayload {
    items: AppConfigBatchItem[];
}

export type PublicSettingsMap = Record<string, string>;

export interface SettingsOptionItem {
    value: string;
    label: string;
    enabled: boolean;
}

export interface SettingsOptionGroup {
    key: string;
    label: string;
    configurable: boolean;
    items: SettingsOptionItem[];
}

export interface SettingsOptionsCatalog {
    groups: SettingsOptionGroup[];
}

interface RawSettingsOptionItem {
    value: string;
    label?: string;
    labelEl?: string;
    labels?: Record<string, string>;
    labelKey?: string;
    enabled?: boolean;
}

interface RawSettingsOptionGroup {
    key: string;
    label?: string;
    labelEl?: string;
    labels?: Record<string, string>;
    labelKey?: string;
    configurable?: boolean;
    items?: RawSettingsOptionItem[];
}

interface RawSettingsOptionsCatalog {
    groups?: RawSettingsOptionGroup[];
}

/** Backend sends either a flat `label`/`labelEl` pair or a nested `labels` map — support both. */
function pickLocalizedLabel(labelEl?: string, localized?: Record<string, string>, fallback?: string, secondaryFallback?: string): string {
    const locale = getCurrentLocale();
    if (locale === 'el' && labelEl) {
        return labelEl;
    }

    if (!localized) {
        return fallback ?? secondaryFallback ?? '';
    }

    return localized[locale] ?? localized[locale.toUpperCase()] ?? localized.en ?? localized.EN ?? fallback ?? secondaryFallback ?? '';
}

function normalizeOptionItem(item: RawSettingsOptionItem): SettingsOptionItem {
    return {
        value: item.value,
        label: pickLocalizedLabel(item.labelEl, item.labels, item.label, item.labelKey ?? item.value),
        enabled: item.enabled ?? true,
    };
}

function normalizeOptionsCatalog(payload: RawSettingsOptionsCatalog): SettingsOptionsCatalog {
    return {
        groups: (payload.groups ?? []).map((group) => ({
            key: group.key,
            label: pickLocalizedLabel(group.labelEl, group.labels, group.label, group.labelKey ?? group.key),
            configurable: group.configurable ?? false,
            items: (group.items ?? []).map(normalizeOptionItem),
        })),
    };
}

export interface UpdateDisabledOptionsPayload {
    disabledValues: string[];
}

export const settingsApi = {
    getPublic: async () => {
        const { data } = await apiClient.get<PublicSettingsMap>('/settings/public');
        return data;
    },

    getPublicOptions: async () => {
        const { data } = await apiClient.get<RawSettingsOptionsCatalog>('/settings/options/public');
        return normalizeOptionsCatalog(data);
    },

    listAll: async () => {
        const { data } = await apiClient.get<AppConfigResponse[]>('/settings');
        return data;
    },

    listOptions: async () => {
        const { data } = await apiClient.get<RawSettingsOptionsCatalog>('/settings/options');
        return normalizeOptionsCatalog(data);
    },

    upsert: async (key: string, payload: AppConfigUpsertPayload) => {
        const { data } = await apiClient.put<AppConfigResponse>(`/settings/${encodeURIComponent(key)}`, payload);
        return data;
    },

    batchUpdate: async (payload: AppConfigBatchPayload) => {
        const { data } = await apiClient.patch<AppConfigResponse[]>('/settings/batch', payload);
        return data;
    },

    updateDisabledOptions: async (groupKey: string, payload: UpdateDisabledOptionsPayload) => {
        const { data } = await apiClient.put<RawSettingsOptionGroup>(`/settings/options/${encodeURIComponent(groupKey)}/disabled`, payload);
        return {
            key: data.key,
            label: pickLocalizedLabel(data.labelEl, data.labels, data.label, data.labelKey ?? data.key),
            configurable: data.configurable ?? false,
            items: (data.items ?? []).map(normalizeOptionItem),
        };
    },
};
