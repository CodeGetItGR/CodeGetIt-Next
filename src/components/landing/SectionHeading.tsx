'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { ActLine, EASE } from './it';

const HAIRLINE_ACCENT: Record<string, string> = {
    teal: 'bg-brand-600/30',
    amber: 'bg-amber-500/30',
    emerald: 'bg-emerald-500/30',
};

export function SectionHeading({
    eyebrow,
    title,
    description,
    centered = true,
    accent,
}: {
    eyebrow: string;
    title: string;
    description: string;
    centered?: boolean;
    accent?: 'teal' | 'amber' | 'emerald';
}) {
    const reduced = useReducedMotion();

    return (
        <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            {/* Eyebrow fades in first */}
            <motion.span
                className="section-kicker"
                data-accent={accent}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.5, ease: EASE, delay: 0 }}
            >
                {eyebrow}
            </motion.span>

            {/* Drawing hairline — the rule is set before the title arrives */}
            <motion.span
                aria-hidden
                className={cn('mt-5 mb-1 block h-px', accent ? HAIRLINE_ACCENT[accent] : 'bg-slate-900/12')}
                style={{ transformOrigin: centered ? 'center' : 'left' }}
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.04 }}
            />

            {/* Title: word-mask rise, same mechanic as the act declarations.
                No restId — section headings are not It rest points; the
                sentence is allowed to end cleanly without the dot. */}
            <ActLine
                as="h2"
                text={title}
                trigger="view"
                delay={0.08}
                className="section-title mt-3"
            />

            {/* Description follows after the title settles */}
            {description && (
                <motion.p
                    className={`section-subtitle ${centered ? 'mx-auto' : ''} mt-4`}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
}
