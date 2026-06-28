'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { Whisper } from './it';
import { ProcessStepContent, ProcessTimeline, ProjectTypeBadge } from './process';
import { cn } from '@/lib/utils';

export function HowWeWorkSection() {
    const ref      = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const { t }    = useLocale();
    const process  = t.landing.process;
    const reduced  = useReducedMotion();

    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
    const springProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
    const fillProgress = reduced ? scrollYProgress : springProgress;

    const [activeIndex, setActiveIndex] = useState(0);
    const [inSection, setInSection]     = useState(false);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const update = () => {
            const trigger = window.innerHeight * 0.4;
            let next = 0;
            for (let i = contentRefs.current.length - 1; i >= 0; i--) {
                const el = contentRefs.current[i];
                if (el && el.getBoundingClientRect().top <= trigger) {
                    next = i;
                    break;
                }
            }
            setActiveIndex(next);

            const first = contentRefs.current[0];
            const last  = contentRefs.current[contentRefs.current.length - 1];
            if (first && last) {
                const firstTop    = first.getBoundingClientRect().top;
                const lastBottom  = last.getBoundingClientRect().bottom;
                setInSection(firstTop < window.innerHeight * 0.9 && lastBottom > window.innerHeight * 0.15);
            }
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
        return () => window.removeEventListener('scroll', update);
    }, []);

    const handleStepClick = (index: number) => {
        const el = contentRefs.current[index];
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 112;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <section ref={ref} id="process" className="px-6 py-28 ambient-mesh-amber">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                >
                    <SectionHeading eyebrow={process.eyebrow} title={process.title} description={process.description} accent="teal" />
                </motion.div>

                {/* Badge legend — same component as the inline deliverable badges, so hovering here teaches their meaning */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <ProjectTypeBadge variant="allProjects" label={process.badges.allProjects.label} description={process.badges.allProjects.description} />
                    <ProjectTypeBadge variant="webAppPlus" label={process.badges.webAppPlus.label} description={process.badges.webAppPlus.description} />
                    <ProjectTypeBadge variant="fullStack" label={process.badges.fullStack.label} description={process.badges.fullStack.description} />
                </div>

                <div ref={sectionRef} className="mt-16 lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left column: sticky step timeline — hidden on mobile where the floating pill takes over */}
                    <div className="hidden lg:sticky lg:top-28 lg:col-span-4 lg:block lg:self-start">
                        <ProcessTimeline
                            steps={process.steps}
                            activeIndex={activeIndex}
                            fillProgress={fillProgress}
                            onStepClick={handleStepClick}
                        />
                    </div>

                    {/* Right column: one detail block per step */}
                    <div className="mt-12 flex flex-col gap-y-[clamp(6rem,22vh,14rem)] lg:col-span-8 lg:mt-0">
                        {process.steps.map((step, index) => (
                            <div key={step.title} ref={(el) => { contentRefs.current[index] = el; }}>
                                <ProcessStepContent
                                    step={step}
                                    index={index}
                                    deliverablesLabel={process.deliverablesLabel}
                                    outcomeLabel={process.outcomeLabel}
                                    badges={process.badges}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Whisper text={t.landing.whispers.process} className="mt-14" />
            </div>

            {/* Floating step navigator — mobile only, appears while scrolling through step content */}
            <AnimatePresence>
                {inSection && (
                    <motion.div
                        key="mobile-step-nav"
                        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    >
                        <div className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                            {process.steps.map((step, i) => (
                                <button
                                    key={step.title}
                                    type="button"
                                    onClick={() => handleStepClick(i)}
                                    aria-label={step.title}
                                    className={cn(
                                        'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-200',
                                        i === activeIndex
                                            ? 'bg-white text-slate-900'
                                            : 'text-slate-500 hover:text-slate-300',
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <span className="mx-2 h-4 w-px bg-white/20" aria-hidden="true" />
                            <span className="max-w-[140px] truncate pr-2 text-xs font-medium text-white/80">
                                {process.steps[activeIndex]?.title}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
