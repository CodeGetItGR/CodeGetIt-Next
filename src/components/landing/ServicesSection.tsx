'use client'

import { motion, useInView } from 'framer-motion';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api';
import { settingsApi } from '@/api/settings';
import { useContactRequest } from '@/providers';
import { getServiceContactPreset } from '@/components/landing/service-contact-presets';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { Socket, Whisper } from './it';

// Ultra-light inline SVG icons (1.5 stroke — Phosphor-style)
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5"  rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  );
}
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

const serviceIcons = [GlobeIcon, LayersIcon, DatabaseIcon];

const featureMatrix = [
    ['Responsive Design', 'SEO Optimization', 'Fast Loading', 'Basic Integrations'],
    ['Responsive Design', 'SEO Optimization', 'Fast Loading', 'User Authentication', 'API Integrations', 'Dashboard UI'],
    ['Responsive Design', 'SEO Optimization', 'Fast Loading', 'User Authentication', 'API Integrations', 'Dashboard UI', 'Backend Architecture', 'Database Design', 'Admin Panel'],
];

const serviceTimelines = ['2–4 weeks', '4–8 weeks', '8–16+ weeks'];

// Middle card (index 1) is the recommended / highlighted tier
const RECOMMENDED_INDEX = 1;

export function ServicesSection() {
    const { t }               = useLocale();
    const { openContactRequest } = useContactRequest();
    const containerRef        = useRef<HTMLDivElement | null>(null);
    const ref                 = useRef(null);
    const isInView            = useInView(ref, { once: true, margin: '-80px' });

    const [hoverFeature,  setHoverFeature]  = useState<string | null>(null);
    const [lockedFeature, setLockedFeature] = useState<string | null>(null);
    const activeFeature = lockedFeature ?? hoverFeature;

    const settingsQuery = useQuery({
        queryKey: queryKeys.settings.list,
        queryFn:  () => settingsApi.getPublic(),
    });

    const services = t.landing.services;

    const formatPrice = useCallback(
        (value: string) =>
            services.from.replace('{price}', new Intl.NumberFormat('el-GR').format(Number.parseInt(value))),
        [services.from]
    );

    const toggleLock          = useCallback((f: string) => setLockedFeature((p) => (p === f ? null : f)), []);
    const handleFeatureEnter  = useCallback((f: string) => { if (!lockedFeature) setHoverFeature(f); }, [lockedFeature]);
    const handleFeatureLeave  = useCallback(() => { if (!lockedFeature) setHoverFeature(null); }, [lockedFeature]);
    const handleOutsideClick  = useCallback((e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setLockedFeature(null); setHoverFeature(null);
        }
    }, []);
    const handleGetStarted    = useCallback((i: number) => openContactRequest(getServiceContactPreset(i)), [openContactRequest]);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [handleOutsideClick]);

    return (
        <section ref={ref} id="services" className="px-6 py-28 ambient-mesh">
            <div className="mx-auto max-w-6xl">
                <SectionHeading eyebrow={services.eyebrow} title={services.title} description={services.description} />

                {/* Asymmetric bento — recommended tier is wider on lg */}
                <div ref={containerRef} className="mt-16 grid gap-5 md:grid-cols-3">
                    {services.items.map((service, index) => {
                        const Icon        = serviceIcons[index] ?? serviceIcons[0];
                        const features    = featureMatrix[index] ?? [];
                        const price       = settingsQuery.data?.[service.priceKey] ?? service.defaultPrice;
                        const isRecommended = index === RECOMMENDED_INDEX;
                        const isDimmed    = activeFeature !== null && !features.includes(activeFeature);

                        return (
                            <motion.article
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: isDimmed ? 0.38 : 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                                className={cn(
                                    'relative flex flex-col rounded-[1.5rem] p-[6px] transition-opacity duration-500',
                                    isRecommended
                                        ? 'ring-2 ring-slate-900/80 soft-shadow-lg'
                                        : 'ring-1 ring-slate-900/[0.06] soft-shadow',
                                )}
                            >
                                {/* Recommended badge */}
                                {isRecommended && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-1 text-[11px] font-semibold tracking-wide text-white shadow-sm">
                                        Most popular
                                    </div>
                                )}

                                {/* Inner core */}
                                <div className={cn(
                                    'flex flex-1 flex-col rounded-[calc(1.5rem-6px)] p-7',
                                    isRecommended ? 'bg-slate-900/[0.02]' : 'bg-white',
                                    'shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
                                )}>
                                    {/* Icon */}
                                    <div className={cn(
                                        'mb-5 inline-flex w-fit rounded-xl p-2.5',
                                        isRecommended ? 'bg-slate-900/[0.05] text-slate-700' : 'bg-slate-100 text-slate-600'
                                    )}>
                                        <Icon />
                                    </div>

                                    <h3 className="font-display text-xl font-semibold text-slate-900">{service.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-500">{service.description}</p>

                                    {/* Features */}
                                    <ul className="mt-6 flex-1 space-y-2.5">
                                        {features.map((feature) => {
                                            const isActive = activeFeature === feature;
                                            return (
                                                <li
                                                    key={feature}
                                                    onMouseEnter={() => handleFeatureEnter(feature)}
                                                    onMouseLeave={handleFeatureLeave}
                                                    onClick={() => toggleLock(feature)}
                                                    className={cn(
                                                        'flex cursor-pointer items-start gap-2.5 text-sm select-none',
                                                        'transition-colors duration-300',
                                                        isActive ? 'text-slate-900' : 'text-slate-500'
                                                    )}
                                                >
                                                    <div className={cn(
                                                        // square ink tick — a filled circle would counterfeit It
                                                        'mt-1.5 h-[5px] w-[5px] shrink-0 transition-all duration-300',
                                                        isActive ? 'scale-125 bg-slate-900' : 'bg-slate-300'
                                                    )} />
                                                    <span>{feature}</span>
                                                    {lockedFeature === feature && (
                                                        <span className="ml-auto text-slate-500">
                                                            <ArrowLeftIcon />
                                                        </span>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* Price + CTA — pinned to bottom */}
                                    <div className="mt-auto pt-6">
                                        <p className="font-display text-2xl font-bold text-slate-900">
                                            {formatPrice(price)}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Estimated timeline: {serviceTimelines[index]}
                                        </p>
                                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                                            {t.landing.services.timeEstimateDisclaimer}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => handleGetStarted(index)}
                                            className={cn(
                                                'group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold',
                                                'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]',
                                                isRecommended
                                                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
                                            )}
                                        >
                                            <Socket />
                                            {services.getStarted}
                                            <span className={cn(
                                                'flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5',
                                                isRecommended ? 'bg-white/15' : 'bg-slate-200',
                                            )}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M7 17 17 7M9 7h8v8" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>

                <Whisper text={t.landing.whispers.services} className="mt-14" />
            </div>
        </section>
    );
}
