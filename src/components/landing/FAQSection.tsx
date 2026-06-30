'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { Whisper } from './it';
import { FAQ_ICONS } from './faqIconsList';

export function FAQSection() {
    const ref      = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t }  = useLocale();
    const faq    = t.landing.faq;

    return (
        <section ref={ref} id="faq" className="px-6 py-28 ambient-mesh-rose">
            <div className="mx-auto max-w-3xl">
                <SectionHeading eyebrow={faq.eyebrow} title={faq.title} description={''} accent="teal" />

                <div className="mt-14 space-y-3">
                    {faq.items.map((item, index) => {
                        const open = openIndex === index;
                        const QuestionIcon = FAQ_ICONS[index] ?? FAQ_ICONS[0];
                        return (
                            <motion.article
                                key={item.question}
                                initial={{ opacity: 0, y: 16 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.45, delay: index * 0.06, ease: [0.32, 0.72, 0, 1] }}
                                className="overflow-hidden rounded-3xl ring-1 ring-slate-900/6 soft-shadow"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(open ? null : index)}
                                    className="flex w-full items-center justify-between gap-6 bg-white px-6 py-5 text-left transition-colors duration-200 hover:bg-slate-50/80"
                                >
                                    <span className="flex items-center gap-3.5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900/6 text-slate-500">
                                            <QuestionIcon />
                                        </span>
                                        <span className="text-[15px] font-semibold text-slate-900">{item.question}</span>
                                    </span>
                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center transition-all duration-300 ease-premium ${open ? 'bg-slate-900 text-white rotate-45 rounded-[4px]' : 'bg-slate-100 text-slate-500 rounded-[4px]'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {open && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                                        >
                                            <div className="border-t border-slate-100 bg-white px-6 pb-5 pt-4 text-sm leading-7 text-slate-500">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.article>
                        );
                    })}
                </div>

                <Whisper text={t.landing.whispers.faq} className="mt-12" />
            </div>
        </section>
    );
}
