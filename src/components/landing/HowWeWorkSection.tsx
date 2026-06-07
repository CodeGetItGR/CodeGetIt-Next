'use client'

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';

// Ultra-light Phosphor-style step icons
function DiscoverIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v3l2 2" />
    </svg>
  );
}
function DesignIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
function BuildIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function LaunchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2 15 22 11 13 2 9l20-7z" />
    </svg>
  );
}

const stepIcons = [DiscoverIcon, DesignIcon, BuildIcon, LaunchIcon];

export function HowWeWorkSection() {
    const ref      = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const { t }    = useLocale();
    const process  = t.landing.process;

    return (
        <section ref={ref} id="process" className="px-6 py-28">
            <div className="mx-auto max-w-5xl">
                <SectionHeading eyebrow={process.eyebrow} title={process.title} description={process.description} />

                {/* Vertical timeline */}
                <div className="relative mt-16">
                    {/* Connector line */}
                    <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-brand-200 via-brand-300 to-brand-100 md:left-1/2 md:-translate-x-px" aria-hidden="true" />

                    <div className="flex flex-col gap-10">
                        {process.steps.map((step, index) => {
                            const Icon       = stepIcons[index] ?? stepIcons[0];
                            const isEven     = index % 2 === 0;

                            return (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: index * 0.12, ease: [0.32, 0.72, 0, 1] }}
                                    className={`relative flex items-start gap-6 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Step node — centered on the line at md */}
                                    <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full ring-[6px] ring-white bg-white soft-shadow">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/[0.08] text-brand-600">
                                                <Icon />
                                            </span>
                                        </div>
                                        <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* Content card */}
                                    <div className={`md:w-[calc(50%-3.5rem)] ${isEven ? 'md:pr-0 md:pl-0' : 'md:pr-0 md:pl-0'} pl-0 md:ml-auto ${isEven ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'} w-full`}>
                                        <div className="rounded-[1.25rem] p-[6px] ring-1 ring-slate-900/[0.06] soft-shadow hover:soft-shadow-lg transition-shadow duration-300">
                                            <div className="rounded-[calc(1.25rem-6px)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                                                <h3 className="font-display text-xl font-semibold text-slate-900">{step.title}</h3>
                                                <p className="mt-2.5 text-sm leading-7 text-slate-500">{step.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spacer for the other side on desktop */}
                                    <div className="hidden md:block md:w-[calc(50%-3.5rem)]" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
