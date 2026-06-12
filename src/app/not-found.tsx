'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import { EASE } from '@/components/landing/it';
import { useLocale } from '@/i18n/UseLocale';

/**
 * 404 — an empty paper field and one lost dot. The headline declares
 * "This isn't it"; its static teal period is the only color on the page.
 */
export default function NotFound() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const copy = t.notFound;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#fafafa] px-6 text-center text-slate-900">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">404</p>
      <h1 className="mt-5 font-display text-[clamp(2.6rem,9vw,6rem)] font-extrabold leading-none tracking-[-0.03em] text-balance">
        {copy.line}
        <motion.span
          aria-hidden
          initial={reduced ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.24, ease: EASE, delay: 0.35 }}
          className="ml-[0.12em] inline-block h-[0.13em] min-h-1.5 w-[0.13em] min-w-1.5 rounded-full bg-brand-600 align-baseline"
        />
      </h1>
      <p className="mt-6 max-w-[40ch] text-[1.02rem] leading-[1.75] text-slate-500 text-pretty">{copy.sub}</p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-[15px] font-semibold text-white no-underline transition-colors duration-300 hover:bg-slate-800"
      >
        {copy.back}
        <span aria-hidden>→</span>
      </Link>
    </main>
  );
}
