'use client'

import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';
import { LocaleContext } from './LocaleContext';
import { getCurrentLocale, LOCALE_STORAGE_KEY, setStoredLocale } from '@/i18n/locale-storage';
import type { Locale } from './types.ts';

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocaleState] = useState<Locale>(() => getCurrentLocale());

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        setStoredLocale(newLocale);
    }, []);

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const t = useMemo(() => translations[locale], [locale]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== LOCALE_STORAGE_KEY || !event.newValue) {
                return;
            }

            if (event.newValue === 'en' || event.newValue === 'el') {
                setLocaleState(event.newValue);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const contextValue = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

    return <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>;
};
