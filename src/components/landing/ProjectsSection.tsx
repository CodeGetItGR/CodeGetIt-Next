'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { ArtifactPlate } from '@/components/landing/ArtifactPlate';
import projectsData from '@/assets/projects/projects.json';
import { DeliveredPeriod, Whisper } from './it';

interface Project {
    title: string;
    lede: string;
    challenge: string;
    solution: string;
    image: string;
    url: string;
}

export function ProjectsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { t } = useLocale();
    const { eyebrow, title, description, challengeLabel, solutionLabel, visitSite, live, artifactEyebrow, artifactCaption } = t.landing.projects;
    const project: Project = (projectsData as Project[])[0];

    return (
        <section ref={ref} id="projects" className="bg-[#f5f6f8] px-6 py-28 ambient-mesh-emerald">
            <div className="mx-auto max-w-6xl">
                <SectionHeading eyebrow={eyebrow} title={title} description={description} accent="emerald" />

                <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        className="flex flex-col gap-6"
                    >
                        <div>
                            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">First live reference</p>
                            <h2 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-slate-900 lg:text-6xl">
                                {project.title}
                                <DeliveredPeriod show={isInView} delay={0.3} />
                            </h2>
                        </div>
                        <p className="max-w-[54ch] text-lg leading-8 text-slate-500">{project.lede}</p>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="border-t border-slate-900/10 pt-4">
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{challengeLabel}</p>
                                <p className="text-sm leading-7 text-slate-600">{project.challenge}</p>
                            </div>
                            <div className="border-t border-slate-900/10 pt-4">
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{solutionLabel}</p>
                                <p className="text-sm leading-7 text-slate-600">{project.solution}</p>
                            </div>
                        </div>

                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/cta mt-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-900 transition-all"
                        >
                            <span className="border-b border-current pb-0.5 transition-all group-hover/cta:pb-1">{visitSite}</span>
                            <span className="transition-transform group-hover/cta:translate-x-1">-&gt;</span>
                        </a>
                    </motion.div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:mx-0">
                        <ArtifactPlate
                            variant="handover"
                            plate="Live 01"
                            eyebrow={artifactEyebrow}
                            caption={artifactCaption}
                            depth
                            className="relative"
                            delay={0.1}
                        />

                        <motion.a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 18, rotate: 1 }}
                            animate={isInView ? { opacity: 1, y: 0, rotate: -1 } : {}}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
                            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                            className="group absolute -bottom-8 right-3 block w-[58%] overflow-hidden rounded-xl border border-slate-900/10 bg-white p-4 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{live}</span>
                                <span className="h-2 w-2 rounded-[2px] bg-emerald-500" />
                            </div>
                            <div className="relative aspect-[4/3] w-full">
                                <Image
                                    src={project.image}
                                    alt={`${project.title} logo`}
                                    fill
                                    sizes="260px"
                                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                            </div>
                        </motion.a>
                    </div>
                </div>

                <Whisper text={t.landing.whispers.projects} className="mt-20" />
            </div>
        </section>
    );
}
