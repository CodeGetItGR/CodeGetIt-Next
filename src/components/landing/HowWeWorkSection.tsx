'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { Whisper } from './it';
import { ProcessStepContent, ProcessTimeline, ProjectTypeBadge } from './process';

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
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const compute = (p: number) => {
            const next = Math.min(process.steps.length - 1, Math.max(0, Math.floor(p * process.steps.length)));
            setActiveIndex(next);
        };
        compute(scrollYProgress.get());
        return scrollYProgress.on('change', compute);
    }, [scrollYProgress, process.steps.length]);

    const handleStepClick = (index: number) => {
        contentRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section ref={ref} id="process" className="px-6 py-28">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                >
                    <SectionHeading eyebrow={process.eyebrow} title={process.title} description={process.description} />
                </motion.div>

                {/* Badge legend — same component as the inline deliverable badges, so hovering here teaches their meaning */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <ProjectTypeBadge label={process.badges.allProjects.label} description={process.badges.allProjects.description} />
                    <ProjectTypeBadge label={process.badges.webAppPlus.label} description={process.badges.webAppPlus.description} />
                    <ProjectTypeBadge label={process.badges.fullStack.label} description={process.badges.fullStack.description} />
                </div>

                <div ref={sectionRef} className="mt-16 lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left column: sticky step timeline. On mobile this sits in normal flow above the content stack. */}
                    <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
                        <ProcessTimeline
                            steps={process.steps}
                            activeIndex={activeIndex}
                            fillProgress={fillProgress}
                            onStepClick={handleStepClick}
                        />
                    </div>

                    {/* Right column: one detail block per step */}
                    <div className="mt-12 flex flex-col gap-12 lg:col-span-8 lg:mt-0">
                        {process.steps.map((step, index) => (
                            <div
                                key={step.title}
                                ref={(el) => { contentRefs.current[index] = el; }}
                                className="lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center"
                            >
                                <ProcessStepContent
                                    step={step}
                                    isActive={reduced ? true : index === activeIndex}
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
        </section>
    );
}
