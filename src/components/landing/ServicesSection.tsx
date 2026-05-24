import { motion } from 'framer-motion';
import { useCallback, useState, useEffect, useRef } from 'react';
import { ArrowLeft, Code2, Database, Globe } from 'lucide-react';
import { useLocale } from '@/i18n/UseLocale';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api';
import { settingsApi } from '@/api/settings';
import { useContactRequest } from '@/providers';
import { getServiceContactPreset } from '@/components/landing/service-contact-presets';
import {cn} from "@/lib/utils";
import {SectionHeading} from "@/components/landing/SectionHeading";

const serviceIcons = [Globe, Code2, Database];

const featureMatrix = [
    ['Responsive Design', 'SEO Optimization', 'Fast Loading', 'Basic Integrations'],
    ['Responsive Design', 'SEO Optimization', 'Fast Loading', 'User Authentication', 'API Integrations', 'Dashboard UI'],
    [
        'Responsive Design',
        'SEO Optimization',
        'Fast Loading',
        'User Authentication',
        'API Integrations',
        'Dashboard UI',
        'Backend Architecture',
        'Database Design',
        'Admin Panel',
    ],
];

const serviceTimelines = ['2–4 weeks', '4–8 weeks', '8–16+ weeks'];

export function ServicesSection() {
    const { t } = useLocale();
    const { openContactRequest } = useContactRequest();

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [hoverFeature, setHoverFeature] = useState<string | null>(null);
    const [lockedFeature, setLockedFeature] = useState<string | null>(null);

    const activeFeature = lockedFeature ?? hoverFeature;

    const settingsQuery = useQuery({
        queryKey: queryKeys.settings.list,
        queryFn: () => settingsApi.getPublic(),
    });

    const services = t.landing.services;

    const formatPrice = useCallback(
        (value: string) =>
            services.from.replace(
                '{price}',
                new Intl.NumberFormat('el-GR').format(Number.parseInt(value))
            ),
        [services.from]
    );

    const toggleLock = useCallback((feature: string) => {
        setLockedFeature((prev) => (prev === feature ? null : feature));
    }, []);

    const handleFeatureEnter = useCallback(
        (feature: string) => {
            if (!lockedFeature) setHoverFeature(feature);
        },
        [lockedFeature]
    );

    const handleFeatureLeave = useCallback(() => {
        if (!lockedFeature) setHoverFeature(null);
    }, [lockedFeature]);

    const handleOutsideClick = useCallback((event: MouseEvent) => {
        if (!containerRef.current) return;

        if (!containerRef.current.contains(event.target as Node)) {
            setLockedFeature(null);
            setHoverFeature(null);
        }
    }, []);

    const handleGetStarted = useCallback(
        (index: number) => {
            openContactRequest(getServiceContactPreset(index));
        },
        [openContactRequest]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [handleOutsideClick]);

    return (
        <section id="services" className="px-6 py-24">
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    eyebrow={services.eyebrow}
                    title={services.title}
                    description={services.description}
                />

                <div ref={containerRef} className="mt-14 grid gap-6 md:grid-cols-3">
                    {services.items.map((service, index) => {
                        const Icon = serviceIcons[index] ?? serviceIcons[0];
                        const features = featureMatrix[index];

                        const price =
                            settingsQuery.data?.[service.priceKey] ??
                            service.defaultPrice;

                        const isDimmed =
                            activeFeature !== null &&
                            !features.includes(activeFeature);

                        const handleMouseEnter = (feature: string) =>
                            handleFeatureEnter(feature);

                        const handleMouseLeave = () => handleFeatureLeave();

                        const handleClickFeature = (feature: string) =>
                            toggleLock(feature);

                        const handleClickGetStarted = () =>
                            handleGetStarted(index);

                        return (
                            <motion.article
                                key={service.title}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className={cn(
                                    'relative isolate flex h-full flex-col rounded-3xl border p-8',
                                    'transition-all duration-500 ease-out',
                                    'border-white/10 bg-slate-900/30 backdrop-blur-md',
                                    isDimmed ? 'opacity-40' : 'opacity-100'
                                )}
                            >
                                {/* ICON */}
                                <div className="mb-6 inline-flex w-fit rounded-2xl bg-white/10 p-3">
                                    <Icon className="h-6 w-6 text-cyan-300" />
                                </div>

                                {/* TITLE */}
                                <h3 className="text-2xl font-bold text-white">
                                    {service.title}
                                </h3>

                                {/* DESCRIPTION */}
                                <p className="mt-3 text-sm leading-7 text-slate-300">
                                    {service.description}
                                </p>

                                {/* FEATURES */}
                                <ul className="mt-6 flex-1 space-y-3">
                                    {features.map((feature) => {
                                        const isActive =
                                            activeFeature === feature;

                                        return (
                                            <li
                                                key={feature}
                                                onMouseEnter={() =>
                                                    handleMouseEnter(feature)
                                                }
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() =>
                                                    handleClickFeature(feature)
                                                }
                                                className={cn(
                                                    'flex cursor-pointer items-start gap-2 text-sm select-none',
                                                    'transition-colors duration-500 ease-out',
                                                    isActive
                                                        ? 'text-cyan-200'
                                                        : 'text-slate-300'
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'mt-1 h-1.5 w-1.5 rounded-full',
                                                        'transition-all duration-500 ease-out',
                                                        isActive
                                                            ? 'scale-125 bg-cyan-300'
                                                            : 'scale-100 bg-white/40'
                                                    )}
                                                />
                                                {feature}

                                                {lockedFeature === feature && (
                                                    <span className="ml-auto text-xs text-cyan-300">
                                                        <ArrowLeft
                                                            width={15}
                                                            height={15}
                                                        />
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* PRICE */}
                                <div className="mt-auto">
                                    <div className="mt-8 text-2xl font-bold text-cyan-300">
                                        {formatPrice(price)}
                                    </div>

                                    <div className="mt-2 text-xs text-slate-400">
                                        Estimated timeline: {serviceTimelines[index]}
                                    </div>

                                    {/* DISCLAIMER */}
                                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                                        {t.landing.services.timeEstimateDisclaimer}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleClickGetStarted}
                                        className="mt-6 w-full rounded-xl bg-white/10 px-4 py-3 font-semibold text-white transition-colors duration-300 ease-out hover:bg-cyan-300 hover:text-slate-950"
                                    >
                                        {services.getStarted}
                                    </button>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}