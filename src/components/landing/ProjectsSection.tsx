'use client'

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';
import projectsData from '@/assets/projects/projects.json';
import { DeliveredPeriod, Whisper } from './it';

// Single-project case study: the story carries the hierarchy, the screenshot
// is supporting evidence. The only color is the title's delivered period.

interface Project {
    title: string;
    lede: string;
    challenge: string;
    solution: string;
    image: string;
    url: string;
}

export function ProjectsSection() {
    const ref      = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { t }    = useLocale();
    const { eyebrow, title, description, challengeLabel, solutionLabel, visitSite, live } = t.landing.projects;
    const project: Project = (projectsData as Project[])[0];

    return (
        <section ref={ref} id="projects" className="bg-[#f5f6f8] px-6 py-28">
            <div className="mx-auto max-w-6xl">
                <SectionHeading eyebrow={eyebrow} title={title} description={description} />

                <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                    {/* Story — leads the hierarchy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        className="flex flex-col gap-6"
                    >
                        <h2 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-slate-900 lg:text-6xl">
                            {project.title}
                            <DeliveredPeriod show={isInView} delay={0.3} />
                        </h2>
                        <p className="text-lg leading-8 text-slate-500">{project.lede}</p>

                        <div className="space-y-5">
                            <div>
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{challengeLabel}</p>
                                <p className="text-base leading-7 text-slate-600">{project.challenge}</p>
                            </div>
                            <div>
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{solutionLabel}</p>
                                <p className="text-base leading-7 text-slate-600">{project.solution}</p>
                            </div>
                        </div>

                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/cta mt-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-900 transition-all"
                        >
                            <span className="border-b border-current pb-0.5 transition-all group-hover/cta:pb-1">{visitSite}</span>
                            <span className="transition-transform group-hover/cta:translate-x-1">→</span>
                        </a>
                    </motion.div>

                    {/* Evidence — supports the story, never leads it */}
                    <motion.a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
                        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                        className="group relative mx-auto block w-full max-w-[440px] overflow-hidden rounded-2xl bg-white ring-1 ring-brand-600/[0.12] soft-shadow lg:mx-0"
                    >
                        {/* Browser-chrome header — reads "a live product," not a clipped image */}
                        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden />
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden />
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden />
                            <span aria-hidden className="ml-2 flex-1 truncate rounded-full bg-white px-3 py-1 text-[10px] text-slate-400 ring-1 ring-slate-200">
                                {project.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </span>
                        </div>

                        <div className="relative aspect-[4/3] max-h-[240px] w-full lg:max-h-none">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(min-width: 1024px) 440px, 100vw"
                                className="object-contain p-8"
                            />

                            {/* Squared "Live" marker — reachable, not pulsing (only circle on the page is It) */}
                            <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 backdrop-blur-sm">
                                <span className="inline-block h-1.5 w-1.5 rounded-[2px] bg-emerald-500" />
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{live}</span>
                            </div>
                        </div>
                    </motion.a>
                </div>

                <Whisper text={t.landing.whispers.projects} className="mt-14" />
            </div>
        </section>
    );
}
