import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
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

export function FAQSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t } = useLocale();
    const faq = t.landing.faq;

    return (
        <section ref={ref} className="px-6 py-24" id="faq">
            <div className="mx-auto max-w-3xl">
                <SectionHeading eyebrow={faq.eyebrow} title={faq.title} description={faq.description} />

                <div className="mt-14 space-y-4">
                    {faq.items.map((item, index) => {
                        const open = openIndex === index;

                        return (
                            <motion.article
                                key={item.question}
                                initial="hidden"
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={sectionFade}
                                custom={index * 0.06}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(open ? null : index)}
                                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white/5"
                                >
                                    <span className="text-lg font-semibold text-white">{item.question}</span>
                                    {open ? <Minus className="h-5 w-5 text-cyan-300" /> : <Plus className="h-5 w-5 text-slate-400" />}
                                </button>
                                <AnimatePresence>
                                    {open && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <div className="px-6 py-3 text-slate-300">{item.answer}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
