'use client'

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-brand-600">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-300">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ComparisonSection() {
    const ref      = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { t }    = useLocale();
    const comparison = t.landing.comparison;

    const comparisonMatrix = [
        { static: true,  webApp: true,                 fullStack: true  },
        { static: true,  webApp: true,                 fullStack: true  },
        { static: false, webApp: comparison.managedLabel, fullStack: comparison.customLabel },
        { static: false, webApp: false,                fullStack: true  },
        { static: false, webApp: comparison.managedLabel, fullStack: comparison.customLabel },
        { static: false, webApp: false,                fullStack: true  },
        { static: false, webApp: true,                 fullStack: true  },
    ];

    const rows = [
        ...comparisonMatrix,
        { static: comparison.maintenanceStatic, webApp: comparison.maintenanceWeb, fullStack: comparison.maintenanceFull },
    ];

    return (
        <section ref={ref} id="compare" className="bg-[#f5f6f8] px-6 py-28">
            <div className="mx-auto max-w-5xl">
                <SectionHeading eyebrow={comparison.eyebrow} title={comparison.title} description={comparison.description} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                    className="mt-14"
                >
                    {/* ── Desktop table ── */}
                    <div className="hidden rounded-[1.5rem] p-[6px] ring-1 ring-slate-900/[0.06] soft-shadow md:block">
                        <div className="overflow-hidden rounded-[calc(1.5rem-6px)] bg-white">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-7 py-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            {comparison.headers.feature}
                                        </th>
                                        <th className="px-7 py-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            {comparison.headers.staticWebsite}
                                        </th>
                                        <th className="px-7 py-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            {comparison.headers.webApplication}
                                        </th>
                                        <th className="bg-slate-900/[0.03] px-7 py-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                                            {comparison.headers.fullStackApplication}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparison.rows.map((rowLabel, index) => {
                                        const row = rows[index];
                                        return (
                                            <tr key={rowLabel} className="border-b border-slate-50 last:border-none odd:bg-slate-50/40">
                                                <td className="px-7 py-4 text-sm font-medium text-slate-800">{rowLabel}</td>
                                                <td className="px-7 py-4 text-center">
                                                    {typeof row.static === 'boolean'
                                                        ? (row.static ? <CheckIcon /> : <XIcon />)
                                                        : <span className="text-sm text-slate-500">{row.static}</span>}
                                                </td>
                                                <td className="px-7 py-4 text-center">
                                                    {typeof row.webApp === 'boolean'
                                                        ? (row.webApp ? <CheckIcon /> : <XIcon />)
                                                        : <span className="text-sm text-slate-500">{row.webApp}</span>}
                                                </td>
                                                <td className="bg-slate-900/[0.02] px-7 py-4 text-center">
                                                    {typeof row.fullStack === 'boolean'
                                                        ? (row.fullStack ? <CheckIcon /> : <XIcon />)
                                                        : <span className="text-sm font-semibold text-slate-900">{row.fullStack}</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Mobile matrix ── */}
                    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-900/[0.06] soft-shadow md:hidden">
                        <div className="grid grid-cols-[1fr_52px_60px_64px] items-center border-b border-slate-100 bg-white">
                            <div className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{comparison.headers.feature}</div>
                            <div className="px-1 py-3 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">{comparison.headers.staticWebsite}</div>
                            <div className="px-1 py-3 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">{comparison.headers.webApplication}</div>
                            <div className="bg-slate-900/[0.04] px-1 py-3 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-900">{comparison.headers.fullStackApplication}</div>
                        </div>
                        {comparison.rows.map((rowLabel, index) => {
                            const row = rows[index];
                            return (
                                <div key={rowLabel} className="grid grid-cols-[1fr_52px_60px_64px] border-b border-slate-50 bg-white last:border-none odd:bg-slate-50/40">
                                    <div className="px-3 py-4 text-sm text-slate-800">{rowLabel}</div>
                                    <div className="flex items-center justify-center px-1">
                                        {typeof row.static === 'boolean'
                                            ? (row.static ? <CheckIcon /> : <XIcon />)
                                            : <span className="text-center text-[10px] text-slate-500">{row.static}</span>}
                                    </div>
                                    <div className="flex items-center justify-center px-1">
                                        {typeof row.webApp === 'boolean'
                                            ? (row.webApp ? <CheckIcon /> : <XIcon />)
                                            : <span className="text-center text-[10px] text-slate-500">{row.webApp}</span>}
                                    </div>
                                    <div className="flex items-center justify-center bg-slate-900/[0.02] px-1">
                                        {typeof row.fullStack === 'boolean'
                                            ? (row.fullStack ? <CheckIcon /> : <XIcon />)
                                            : <span className="text-center text-[10px] font-semibold text-slate-900">{row.fullStack}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
                        {t.landing.comparison.disclaimer}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
