import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api';
import { settingsApi, type SettingsOptionItem } from '@/api/settings';
import { useLocale } from '@/i18n/UseLocale';

interface UseSettingsOptionsParams {
    groupKey: string;
    scope?: 'public' | 'admin';
    onlyEnabled?: boolean;
}

export function useSettingsOptions({ groupKey, scope = 'admin', onlyEnabled = false }: UseSettingsOptionsParams) {
    const { locale } = useLocale();

    const queryKey = useMemo(
        () => (scope === 'public' ? [...queryKeys.settings.optionsPublic, locale] : [...queryKeys.settings.options, locale]),
        [locale, scope]
    );

    const queryFn = useCallback(() => (scope === 'public' ? settingsApi.getPublicOptions() : settingsApi.listOptions()), [scope]);

    const optionsQuery = useQuery({
        queryKey,
        queryFn,
    });

    const group = useMemo(() => optionsQuery.data?.groups.find((item) => item.key === groupKey), [groupKey, optionsQuery.data?.groups]);

    const options = useMemo<SettingsOptionItem[]>(() => {
        if (!group) {
            return [];
        }

        if (onlyEnabled) {
            return group.items.filter((item) => item.enabled);
        }

        return group.items;
    }, [group, onlyEnabled]);

    return {
        options,
        isLoading: optionsQuery.isLoading,
        isError: optionsQuery.isError,
    };
}
