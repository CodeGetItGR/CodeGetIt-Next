'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from '@/i18n/UseLocale';

const STORAGE_KEY = 'cookie-notice.dismissed';

export function CookieNotice() {
    const { t } = useLocale();
    const copy = t.landing.cookieNotice;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (window.localStorage.getItem(STORAGE_KEY) !== '1') {
            setVisible(true);
        }
    }, []);

    function dismiss() {
        window.localStorage.setItem(STORAGE_KEY, '1');
        setVisible(false);
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    role="status"
                    className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md flex-col gap-3 rounded-2xl bg-white/80 p-4 ring-1 ring-slate-900/10 soft-shadow backdrop-blur-lg sm:inset-x-auto sm:left-4 sm:flex-row sm:items-center sm:gap-4"
                >
                    <p className="text-sm leading-6 text-slate-600">
                        {copy.text}{' '}
                        <Link href="/privacy" className="font-medium text-slate-900 underline underline-offset-2">
                            {copy.linkLabel}
                        </Link>
                    </p>
                    <button
                        type="button"
                        onClick={dismiss}
                        className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                        {copy.dismiss}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
