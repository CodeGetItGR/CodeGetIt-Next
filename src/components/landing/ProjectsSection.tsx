import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Compass } from 'lucide-react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';
import projectsData from '@/assets/projects/projects.json';

const projectColors = ['#e1cc67', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];

interface Project {
    title: string;
    description: string;
    tags: string[];
    logo: string;
    url: string;
}

// ─── Single-project hero layout ───────────────────────────────────────────────
function HeroProjectLayout({ project, color, isInView }: { project: Project; color: string; isInView: boolean }) {
    return (
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            {/* Left: large feature card */}
            <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="group relative block aspect-4/3 max-h-120 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-slate-950/40"
            >
                {/* Logo used as blurred hero background */}
                <img
                    src={project.logo}
                    alt={project.title}
                    className="group-hover:blur-0 absolute inset-0 h-full w-full scale-105 object-cover opacity-90 blur-sm transition-all duration-700 group-hover:scale-100 group-hover:opacity-50"
                />

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(160deg, ${color}22 0%, #0d1230cc 60%, #0d1230f0 100%)`,
                    }}
                />

                {/* Accent top bar */}
                <div className="absolute top-0 right-0 left-0 h-1" style={{ backgroundColor: color }} />

                {/* Corner badge */}
                <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <ExternalLink className="h-3 w-3 text-white/70" />
                    <span className="text-xs font-medium tracking-wide text-white/70 uppercase">Live</span>
                </div>

                {/* Bottom content */}
                <div className="absolute right-0 bottom-0 left-0 p-8">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm">
                            <img src={project.logo} alt={`${project.title} logo`} className="h-7 w-7 object-contain" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-white">{project.title}</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.a>

            {/* Right: editorial text panel */}
            <motion.div initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.15} className="flex flex-col gap-6 lg:pl-4">
                {/* Eyebrow */}
                <div className="flex items-center gap-2">
                    <div
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10"
                        style={{ backgroundColor: `${color}22` }}
                    >
                        <Compass className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color }}>
                        Featured Project
                    </span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-5xl leading-[1.1] font-bold text-white lg:text-6xl">{project.title}</h2>

                {/* Description */}
                <p className="text-base leading-8 text-slate-300">{project.description}</p>

                {/* CTA */}
                <div className="flex flex-col gap-3 pt-2">
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/cta inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase transition-all"
                        style={{ color }}
                    >
                        <span className="border-b border-current pb-0.5 transition-all group-hover/cta:pb-1">Explore the Project</span>
                        <span className="transition-transform group-hover/cta:translate-x-1">→</span>
                    </a>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Multi-project grid layout ────────────────────────────────────────────────
function GridProjectLayout({ projects, isInView }: { projects: Project[]; isInView: boolean }) {
    return (
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => {
                const color = projectColors[index] ?? projectColors[0];
                return (
                    <motion.article
                        key={project.title}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        custom={index * 0.08}
                        whileHover={{ y: -6 }}
                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/20"
                    >
                        <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10">
                                    <img src={project.logo} alt={`${project.title} logo`} className="h-8 w-8 object-contain" />
                                </div>
                                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-300">{project.title}</h3>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-slate-300">{project.description}</p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-all group-hover:gap-3"
                            >
                                View Project
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                            style={{
                                background: `radial-gradient(circle at 50% 0%, ${color}18, transparent 70%)`,
                            }}
                        />
                    </motion.article>
                );
            })}
        </div>
    );
}

// ─── Root section ─────────────────────────────────────────────────────────────
export function ProjectsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { t } = useLocale();
    const { eyebrow, title, description } = t.landing.projects;

    const projects: Project[] = projectsData;
    const isSingle = projects.length === 1;

    return (
        <section ref={ref} id="projects" className="bg-[#151b3d] px-6 py-26">
            <div className="mx-auto max-w-6xl">
                <SectionHeading eyebrow={eyebrow} title={title} description={description} />

                {isSingle ? (
                    <HeroProjectLayout project={projects[0]} color={projectColors[0]} isInView={isInView} />
                ) : (
                    <GridProjectLayout projects={projects} isInView={isInView} />
                )}
            </div>
        </section>
    );
}
