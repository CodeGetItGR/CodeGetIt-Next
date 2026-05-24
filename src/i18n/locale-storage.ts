import type { Locale } from '@/i18n/types';

export const LOCALE_STORAGE_KEY = 'app.locale';

function isLocale(value: string): value is Locale {
    return value === 'en' || value === 'el';
}

export function getStoredLocale(): Locale | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (!raw || !isLocale(raw)) {
        return null;
    }

    return raw;
}

export function getCurrentLocale(): Locale {
    const stored = getStoredLocale();
    if (stored) {
        return stored;
    }

    if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('el')) {
        return 'el';
    }

    return 'en';
}

export function setStoredLocale(locale: Locale): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
