'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/i18n/UseLocale';
import { usePublicSettings } from '@/settings/usePublicSettings';

const STORAGE_KEY = 'marketing-banner.dismissed';

type BannerSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

const SEVERITY_STYLES: Record<BannerSeverity, { icon: LucideIcon; className: string }> = {
    INFO: { icon: Info, className: 'bg-sky-50/95 text-sky-900' },
    SUCCESS: { icon: CheckCircle2, className: 'bg-emerald-50/95 text-emerald-900' },
    WARNING: { icon: AlertTriangle, className: 'bg-amber-50/95 text-amber-900' },
    ERROR: { icon: AlertCircle, className: 'bg-rose-50/95 text-rose-900' },
};

export function MarketingBanner() {
    const { t } = useLocale();
    const { getBool, getString } = usePublicSettings();
    const ref = useRef<HTMLDivElement>(null);
    const [dismissed, setDismissed] = useState(true);

    const enabled = getBool('marketing.bannerEnabled', false);
    const text = getString('marketing.bannerText', '');
    const severityRaw = getString('marketing.bannerSeverity', 'INFO');
    const severity: BannerSeverity = severityRaw in SEVERITY_STYLES ? (severityRaw as BannerSeverity) : 'INFO';
    const dismissKey = `${severity}:${text}`;
    const visible = enabled && Boolean(text) && !dismissed;

    useEffect(() => {
        setDismissed(window.localStorage.getItem(STORAGE_KEY) === dismissKey);
    }, [dismissKey]);

    useEffect(() => {
        const root = document.documentElement;

        if (!visible) {
            root.style.setProperty('--marketing-banner-offset', '0px');
            return;
        }

        const node = ref.current;
        if (!node) {
            return;
        }

        const updateOffset = () => root.style.setProperty('--marketing-banner-offset', `${node.offsetHeight}px`);
        updateOffset();

        const observer = new ResizeObserver(updateOffset);
        observer.observe(node);
        return () => {
            observer.disconnect();
            root.style.setProperty('--marketing-banner-offset', '0px');
        };
    }, [visible]);

    function dismiss() {
        window.localStorage.setItem(STORAGE_KEY, dismissKey);
        setDismissed(true);
    }

    const { icon: Icon, className } = SEVERITY_STYLES[severity];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                    role="status"
                    className={cn('fixed inset-x-0 top-0 z-[60] backdrop-blur-lg', className)}
                >
                    <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <p className="flex-1 text-center text-sm font-medium leading-5 sm:text-left">{text}</p>
                        <button
                            type="button"
                            onClick={dismiss}
                            aria-label={t.landing.marketingBanner.dismissAria}
                            className="shrink-0 rounded-full p-1 transition-colors hover:bg-black/5"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
