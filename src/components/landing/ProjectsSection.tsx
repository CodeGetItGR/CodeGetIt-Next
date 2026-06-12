'use client'

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';
import projectsData from '@/assets/projects/projects.json';
import { DeliveredPeriod, Whisper } from './it';

// Teal (and its neighbors) belongs to It — the only teal in this section is
// each title's delivered period. Accent[0] is ink pending the treatment decision.
const projectColors = ['#0f172a', '#7c6af7', '#e8855a', '#3b82f6', '#ec4899', '#64748b'];

interface Project {
    title: string;
    description: string;
    tags: string[];
    logo: string;
    url: string;
}

function HeroProjectLayout({ project, color, isInView }: { project: Project; color: string; isInView: boolean }) {
    return (
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
            {/* Left: featured card — showcase with tilt physics */}
            <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                whileHover={{ y: -8, scale: 1.01, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
                className="group relative block overflow-hidden rounded-[1.5rem] ring-1 ring-slate-900/[0.08] soft-shadow-lg aspect-[4/3] max-h-[480px]"
            >
                <img
                    src={project.logo}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full scale-105 object-cover opacity-80 blur-[2px] transition-all duration-700 group-hover:scale-100 group-hover:opacity-50 group-hover:blur-0"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${color}18 0%, rgba(255,255,255,0.04) 40%, rgba(248,250,252,0.92) 100%)` }} />
                <div className="absolute top-0 right-0 left-0 h-[3px] rounded-t-[1.5rem]" style={{ backgroundColor: color }} />

                {/* Corner badge */}
                <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/70 px-3 py-1.5 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                    </svg>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Live</span>
                </div>

                <div className="absolute right-0 bottom-0 left-0 p-8">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white soft-shadow">
                            <img src={project.logo} alt={`${project.title} logo`} className="h-7 w-7 object-contain" />
                        </div>
                        <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">{project.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-slate-900/10 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.a>

            {/* Right: editorial text */}
            <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col gap-5 lg:pl-4"
            >
                <div className="flex items-center gap-2">
                    {/* No dot in the badge — the only dot a project earns is its period */}
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color, backgroundColor: `${color}12` }}>
                        Featured project
                    </span>
                </div>

                <h2 className="font-display text-5xl font-bold leading-[1.06] tracking-tight text-slate-900 lg:text-6xl">
                    {project.title}
                    <DeliveredPeriod show={isInView} delay={0.55} />
                </h2>
                <p className="text-base leading-8 text-slate-500">{project.description}</p>

                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/cta inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-all"
                    style={{ color }}
                >
                    <span className="border-b border-current pb-0.5 transition-all group-hover/cta:pb-1">Explore the project</span>
                    <span className="transition-transform group-hover/cta:translate-x-1">→</span>
                </a>
            </motion.div>
        </div>
    );
}

function GridProjectLayout({ projects, isInView }: { projects: Project[]; isInView: boolean }) {
    return (
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => {
                const color = projectColors[index] ?? projectColors[0];
                return (
                    <motion.a
                        key={project.title}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.07, ease: [0.32, 0.72, 0, 1] }}
                        whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                        className="group relative overflow-hidden rounded-[1.25rem] ring-1 ring-slate-900/[0.06] soft-shadow block"
                    >
                        <div className="h-1 w-full" style={{ backgroundColor: color }} />
                        <div className="bg-white p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100">
                                    <img src={project.logo} alt={`${project.title} logo`} className="h-7 w-7 object-contain" />
                                </div>
                                <h3 className="font-display text-lg font-semibold text-slate-900">
                                    {project.title}
                                    <DeliveredPeriod show={isInView} delay={0.3 + index * 0.06} />
                                </h3>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-slate-500">{project.description}</p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5" style={{ color }}>
                                View project
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                                </svg>
                            </span>
                        </div>
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `radial-gradient(circle at 50% 0%, ${color}10, transparent 65%)` }} />
                    </motion.a>
                );
            })}
        </div>
    );
}

export function ProjectsSection() {
    const ref      = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { t }    = useLocale();
    const { eyebrow, title, description } = t.landing.projects;
    const projects: Project[] = projectsData;
    const isSingle = projects.length === 1;

    return (
        <section ref={ref} id="projects" className="bg-[#f5f6f8] px-6 py-28">
            <div className="mx-auto max-w-6xl">
                <SectionHeading eyebrow={eyebrow} title={title} description={description} />
                {isSingle
                    ? <HeroProjectLayout project={projects[0]} color={projectColors[0]} isInView={isInView} />
                    : <GridProjectLayout projects={projects} isInView={isInView} />}

                <Whisper text={t.landing.whispers.projects} className="mt-14" />
            </div>
        </section>
    );
}
