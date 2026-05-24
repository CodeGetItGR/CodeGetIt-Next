import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Lightbulb, Rocket, Zap } from 'lucide-react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';

const sectionFade = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay },
    }),
};

const stepIcons = [Lightbulb, Zap, Code2, Rocket];

export function HowWeWorkSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { t } = useLocale();
    const process = t.landing.process;

    return (
        <section ref={ref} id="process" className="px-6 py-24">
            <div className="mx-auto max-w-6xl">
                <SectionHeading eyebrow={process.eyebrow} title={process.title} description={process.description} />

                <div className="mt-14 grid gap-6 md:grid-cols-2">
                    {process.steps.map((step, index) => {
                        const Icon = stepIcons[index] ?? stepIcons[0];

                        return (
                            <motion.article
                                key={step.title}
                                initial="hidden"
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={sectionFade}
                                custom={index * 0.08}
                                whileHover={{ y: -6 }}
                                className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="relative shrink-0">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10">
                                            <Icon className="h-8 w-8 text-cyan-300" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                                        <p className="mt-3 text-slate-300">{step.description}</p>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
