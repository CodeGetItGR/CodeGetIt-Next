'use client'

import { useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsApi, queryKeys } from '@/api';
import { useLocale } from '@/i18n/UseLocale';
import { PublicSettingsContext, type PublicSettingsContextValue } from '@/settings/public-settings-context';

const asBool = (value: string | undefined, fallback = false) => {
    if (value == null) {
        return fallback;
    }

    return value.toLowerCase() === 'true';
};

export const PublicSettingsProvider = ({ children }: { children: ReactNode }) => {
    const { locale } = useLocale();

    const settingsQuery = useQuery({
        queryKey: [...queryKeys.settings.public, locale],
        queryFn: () => settingsApi.getPublic(),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const value = useMemo<PublicSettingsContextValue>(() => {
        const settings = settingsQuery.data ?? {};

        const getLocalizedSetting = (key: string) => {
            const localeVariants = [`${key}.${locale}`, `${key}_${locale}`, `${locale}.${key}`];

            for (const candidate of localeVariants) {
                if (candidate in settings) {
                    return settings[candidate];
                }
            }

            return settings[key];
        };

        return {
            settings,
            isLoading: settingsQuery.isLoading,
            isError: settingsQuery.isError,
            getString: (key, fallback) => getLocalizedSetting(key) || fallback,
            getBool: (key, fallback = false) => asBool(getLocalizedSetting(key), fallback),
        };
    }, [locale, settingsQuery.data, settingsQuery.isError, settingsQuery.isLoading]);

    return <PublicSettingsContext.Provider value={value}>{children}</PublicSettingsContext.Provider>;
};
