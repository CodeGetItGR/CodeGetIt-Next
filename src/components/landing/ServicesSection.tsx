'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api';
import { settingsApi } from '@/api/settings';
import { useContactRequest, useScrollHighlight } from '@/providers';
import { getServiceContactPreset } from '@/components/landing/service-contact-presets';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { ArtifactPlate, type ArtifactVariant } from '@/components/landing/ArtifactPlate';
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

const serviceDiscountKeys = ['marketing.staticDiscount', 'marketing.webDiscount', 'marketing.fullDiscount'];

const FACTOR_ICONS = [
    // Scope & features
    <svg key="scope" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    // Design complexity
    <svg key="design" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    // Integrations
    <svg key="integrations" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    // Timeline
    <svg key="timeline" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    // Content volume
    <svg key="content" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    // Tech stack
    <svg key="tech" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    // Post-launch support
    <svg key="support" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
];

// Middle card (index 1) is the recommended / highlighted tier
const RECOMMENDED_INDEX = 1;

// Per-tier icon chip tint — index 0 (static) stays neutral, index 1 (recommended)
// gets the teal tint already used on its card, index 2 (full-stack) gets amber
// so all three tiers read as visually distinct instead of two identical grays.
const TIER_CHIP_STYLES = [
    'bg-slate-100 text-slate-600',
    'bg-slate-900/8 text-slate-700',
    'bg-amber-50 text-amber-700',
];

const SERVICE_ARTIFACTS: ArtifactVariant[] = ['tierStatic', 'tierApp', 'tierFull'];

// Matches the `#service-{index}` anchors used by FooterSection's "Services" links
const SPOTLIGHT_ID_PATTERN = /^service-(\d+)$/;

export function ServicesSection() {
    const { t }               = useLocale();
    const { openContactRequest } = useContactRequest();
    const { highlightedId }   = useScrollHighlight();
    const containerRef        = useRef<HTMLDivElement | null>(null);
    const ref                 = useRef(null);
    const isInView            = useInView(ref, { once: true, margin: '-80px' });
    const reduced              = useReducedMotion();

    const [hoverFeature,  setHoverFeature]  = useState<string | null>(null);
    const [lockedFeature, setLockedFeature] = useState<string | null>(null);
    const activeFeature = lockedFeature ?? hoverFeature;

    const settingsQuery = useQuery({
        queryKey: queryKeys.settings.list,
        queryFn:  () => settingsApi.getPublic(),
    });

    const services = t.landing.services;

    const spotlightMatch = highlightedId?.match(SPOTLIGHT_ID_PATTERN);
    const spotlightIndex = spotlightMatch && Number(spotlightMatch[1]) < services.items.length
        ? Number(spotlightMatch[1])
        : null;

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
                <SectionHeading eyebrow={services.eyebrow} title={services.title} description={services.description} accent="amber" />

                {/* Asymmetric bento — recommended tier is wider on lg.
                   `perspective` on the grid gives the cards' tilt-then-settle
                   entrance below real visible depth instead of just a skew. */}
                <div ref={containerRef} className="mt-16 grid gap-5 md:grid-cols-3" style={{ perspective: 1200 }}>
                    {services.items.map((service, index) => {
                        const Icon        = serviceIcons[index] ?? serviceIcons[0];
                        const features    = service.features ?? [];
                        const price         = settingsQuery.data?.[service.priceKey] ?? service.defaultPrice;
                        const discountPct   = Number.parseInt(settingsQuery.data?.[serviceDiscountKeys[index] ?? ''] ?? '0') || 0;
                        const discountedPrice = discountPct > 0
                            ? Math.floor(Number.parseInt(price) * (1 - discountPct / 100))
                            : null;
                        const isRecommended = index === RECOMMENDED_INDEX;
                        const isFeatureDimmed = activeFeature !== null && !features.includes(activeFeature);
                        const isSpotlight    = index === spotlightIndex;
                        const isSpotlightDimmed = spotlightIndex !== null && index !== spotlightIndex;
                        const isDimmed    = isFeatureDimmed || isSpotlightDimmed;
                        // Tilt-then-settle entrance: cards swing in from a slight 3D angle
                        // (alternating direction so the row doesn't feel mechanical) and
                        // settle flat — same anticipate-travel-settle grammar the dot's
                        // Beat motion already uses, just applied to cards. Scroll-triggered
                        // (isInView), not hover-only, so it's fully visible on mobile too.
                        const tiltDir = index === 0 ? -1 : index === 2 ? 1 : 0;

                        return (
                            <motion.article
                                key={service.title}
                                id={`service-${index}`}
                                style={{ transformPerspective: 1200 }}
                                initial={reduced
                                    ? { opacity: 0, y: 20 }
                                    : { opacity: 0, y: 26, rotateX: 12, rotateY: tiltDir * 18, z: -90 }}
                                animate={isInView
                                    ? (reduced
                                        ? { opacity: isDimmed ? 0.38 : 1, y: 0 }
                                        : { opacity: isDimmed ? 0.38 : 1, y: 0, rotateX: 0, rotateY: 0, z: 0 })
                                    : (reduced
                                        ? { opacity: 0, y: 20 }
                                        : { opacity: 0, y: 26, rotateX: 12, rotateY: tiltDir * 18, z: -90 })}
                                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.32, 0.72, 0, 1] }}
                                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                                className={cn(
                                    'relative flex flex-col rounded-[1.5rem] p-1.5 scroll-mt-28 transition-all duration-500',
                                    isRecommended
                                        ? 'ring-2 ring-slate-900/80 soft-shadow-lg'
                                        : 'ring-1 ring-slate-900/6 soft-shadow',
                                    isSpotlight && 'ring-2 ring-slate-900 ring-offset-2 ring-offset-[#fafafa] drop-shadow-[0_0_24px_rgba(15,23,42,0.18)]',
                                )}
                            >
                                {/* Recommended badge */}
                                {isRecommended && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-50 px-4 py-1 text-[11px] font-semibold tracking-wide text-amber-700 ring-1 ring-amber-200 shadow-sm">
                                        {services.featured}
                                    </div>
                                )}

                                {/* Inner core */}
                                <div className={cn(
                                    'flex flex-1 flex-col rounded-[calc(1.5rem-6px)] p-7',
                                    isRecommended ? 'bg-brand-600/4' : 'bg-white',
                                    'shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
                                )}>
                                    <div className={'flex justify-between items-center'}>

                                        {/* Icon */}
                                        <div className={cn(
                                            'inline-flex w-fit rounded-xl p-2.5',
                                            TIER_CHIP_STYLES[index] ?? TIER_CHIP_STYLES[0],
                                        )}>
                                            <Icon />
                                        </div>

                                        <h3 className="font-display text-xl font-semibold text-slate-900">{service.title}</h3>
                                    </div>

                                    <ArtifactPlate
                                        variant={SERVICE_ARTIFACTS[index] ?? SERVICE_ARTIFACTS[0]}
                                        plate={`Receive ${index + 1}`}
                                        eyebrow={services.artifactEyebrow}
                                        caption={service.title}
                                        compact
                                        delay={0.1 + index * 0.06}
                                        className="shadow-none my-6"
                                    />

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
                                                        'mt-1.5 h-1.25 w-1.25 shrink-0 transition-all duration-300',
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
                                        {discountedPrice !== null ? (
                                            <div>
                                                <p className="font-display text-sm text-slate-500 line-through">
                                                    {formatPrice(price)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-display text-2xl font-bold text-slate-900">
                                                        {formatPrice(String(discountedPrice))}
                                                    </p>
                                                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                                                        -{discountPct}%
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="font-display text-2xl font-bold text-slate-900">
                                                {formatPrice(price)}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-slate-500">
                                            {services.estimatedTimelineLabel}: {services.timelineEstimates[index]}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => handleGetStarted(index)}
                                            className={cn(
                                                'group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold',
                                                'transition-all duration-300 ease-premium active:scale-[0.98]',
                                                isRecommended
                                                    ? 'bg-brand-600 text-white hover:bg-brand-700'
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

                {/* Pricing context — factors + reassurance */}
                <div className="mt-10 rounded-2xl bg-white px-8 py-8 shadow-[0_4px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/8">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        {services.pricingFactorsLabel}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {services.priceDisclaimer}
                    </p>

                    <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-slate-100 pt-7 sm:grid-cols-2 lg:grid-cols-3">
                        {services.pricingFactors.map((factor, i) => (
                            <div key={factor.label} className="flex gap-3.5">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900/6 text-slate-500">
                                    {FACTOR_ICONS[i]}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{factor.label}</p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{factor.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-7 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">
                        {services.timeEstimateDisclaimer}
                    </p>
                </div>

                <Whisper text={t.landing.whispers.services} className="mt-14" />
            </div>
        </section>
    );
}
