import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {useLocale} from "@/i18n/UseLocale";

const sectionFade = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay },
    }),
};

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let frame = 0;
        let startTime = 0;
        const duration = 1800;

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [end]);

    return (
        <>
            {count}
            {suffix}
        </>
    );
}

export function StatsBar() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const { t } = useLocale();
    const labels = t.landing.stats.labels;
    const stats = [
        { value: 150, label: labels[0], suffix: '+' },
        { value: 98, label: labels[1], suffix: '%' },
        { value: 50, label: labels[2], suffix: '+' },
        { value: 5, label: labels[3], suffix: '+' },
    ];

    return (
        <section ref={ref} className="border-y border-white/10 bg-[#151b3d] px-6 py-16">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={sectionFade}
                        custom={index * 0.08}
                        className="text-center"
                    >
                        <div className="text-4xl font-black text-brand-400 md:text-5xl">
                            {isInView ? <AnimatedCounter end={stat.value} suffix={stat.suffix} /> : '0'}
                        </div>
                        <div className="mt-2 text-sm text-slate-300 md:text-base">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
