'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';

function CheckIcon({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function XIcon({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function ComparisonSection() {
    const ref      = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { t }    = useLocale();
    const comparison = t.landing.comparison;
    const reduced  = useReducedMotion();

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

                <div className="mt-14">
                    {/* ── Desktop table ── */}
                    <div className="hidden rounded-[1.5rem] p-[6px] ring-1 ring-slate-900/[0.06] soft-shadow md:block">
                        <div className="overflow-hidden rounded-[calc(1.5rem-6px)] bg-white">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th scope="col" className="px-7 py-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            {comparison.headers.feature}
                                        </th>
                                        <th scope="col" className="px-7 py-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            {comparison.headers.staticWebsite}
                                        </th>
                                        <th scope="col" className="px-7 py-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            {comparison.headers.webApplication}
                                        </th>
                                        <th scope="col" className="bg-slate-900/[0.03] px-7 py-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                                            {comparison.headers.fullStackApplication}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparison.rows.map((rowLabel, index) => {
                                        const row = rows[index];
                                        return (
                                            <motion.tr
                                                key={rowLabel}
                                                className="border-b border-slate-50 last:border-none odd:bg-slate-50/40"
                                                initial={reduced ? false : { opacity: 0, x: -8 }}
                                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1], delay: 0.2 + index * 0.045 }}
                                            >
                                                <th scope="row" className="px-7 py-4 text-left text-sm font-medium text-slate-800">{rowLabel}</th>
                                                <td className="px-7 py-4 text-center">
                                                    {typeof row.static === 'boolean'
                                                        ? (row.static ? <CheckIcon label="Included" /> : <XIcon label="Not included" />)
                                                        : <span className="text-sm text-slate-500">{row.static}</span>}
                                                </td>
                                                <td className="px-7 py-4 text-center">
                                                    {typeof row.webApp === 'boolean'
                                                        ? (row.webApp ? <CheckIcon label="Included" /> : <XIcon label="Not included" />)
                                                        : <span className="text-sm text-slate-500">{row.webApp}</span>}
                                                </td>
                                                <td className="bg-slate-900/[0.02] px-7 py-4 text-center">
                                                    {typeof row.fullStack === 'boolean'
                                                        ? (row.fullStack ? <CheckIcon label="Included" /> : <XIcon label="Not included" />)
                                                        : <span className="text-sm font-semibold text-slate-900">{row.fullStack}</span>}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Mobile matrix ── */}
                    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-900/[0.06] soft-shadow md:hidden">
                        <div className="grid grid-cols-[1fr_52px_60px_64px] items-center border-b border-slate-100 bg-white">
                            <div className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{comparison.headers.feature}</div>
                            <div className="px-1 py-3 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">{comparison.headers.staticWebsite}</div>
                            <div className="px-1 py-3 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">{comparison.headers.webApplication}</div>
                            <div className="bg-slate-900/[0.04] px-1 py-3 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-900">{comparison.headers.fullStackApplication}</div>
                        </div>
                        {comparison.rows.map((rowLabel, index) => {
                            const row = rows[index];
                            return (
                                <div key={rowLabel} className="grid grid-cols-[1fr_52px_60px_64px] border-b border-slate-50 bg-white last:border-none odd:bg-slate-50/40">
                                    <div className="px-3 py-4 text-sm text-slate-800">{rowLabel}</div>
                                    <div className="flex items-center justify-center px-1">
                                        {typeof row.static === 'boolean'
                                            ? (row.static ? <CheckIcon label="Included" /> : <XIcon label="Not included" />)
                                            : <span className="text-center text-[10px] text-slate-500">{row.static}</span>}
                                    </div>
                                    <div className="flex items-center justify-center px-1">
                                        {typeof row.webApp === 'boolean'
                                            ? (row.webApp ? <CheckIcon label="Included" /> : <XIcon label="Not included" />)
                                            : <span className="text-center text-[10px] text-slate-500">{row.webApp}</span>}
                                    </div>
                                    <div className="flex items-center justify-center bg-slate-900/[0.02] px-1">
                                        {typeof row.fullStack === 'boolean'
                                            ? (row.fullStack ? <CheckIcon label="Included" /> : <XIcon label="Not included" />)
                                            : <span className="text-center text-[10px] font-semibold text-slate-900">{row.fullStack}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-8 text-center text-xs leading-relaxed text-slate-500">
                        {t.landing.comparison.disclaimer}
                    </p>
                </div>
            </div>
        </section>
    );
}
