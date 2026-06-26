'use client'

import { useLocale } from '@/i18n/UseLocale';
import { cn } from '@/lib/utils';

interface LanguageSwitchProps {
    className?: string;
}

/** Shows the language you'd switch to, not the one you're on — a single tap flips it. */
export function LanguageSwitch({ className }: LanguageSwitchProps) {
    const { locale, setLocale } = useLocale();
    const next = locale === 'en' ? 'el' : 'en';

    return (
        <button
            type="button"
            onClick={() => setLocale(next)}
            aria-label={next === 'el' ? 'Switch to Greek' : 'Switch to English'}
            className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-500 ring-1 ring-slate-900/8 transition-colors duration-200 hover:text-slate-900 hover:ring-slate-900/15',
                className
            )}
        >
            {next === 'el' ? 'ΕΛ' : 'EN'}
        </button>
    );
}
