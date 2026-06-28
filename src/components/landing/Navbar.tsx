'use client'

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLocale } from '@/i18n/UseLocale';
import { DotlessWordmark } from './it';
import { Logo } from './Logo';
import { LanguageSwitch } from './LanguageSwitch';

const linkIds = ['build', 'services', 'compare', 'process', 'work', 'faq'] as const;
const linkHrefs: Record<(typeof linkIds)[number], string> = {
    build: '#build',
    services: '#services',
    compare: '#compare',
    process: '#process',
    work: '#projects',
    faq: '#faq',
};

export function Navbar() {
    const { t } = useLocale();
    const navCopy = t.landing.hero.navigation;
    const links = useMemo(
        () => linkIds.map((id) => ({ id, href: linkHrefs[id], label: navCopy.links[id] })),
        [navCopy]
    );

    const [scrolled,    setScrolled]    = useState(false);
    const [mobileOpen,  setMobileOpen]  = useState(false);
    const [active,      setActive]      = useState<string | null>(null);

    // Scroll flag — passive, only flips a boolean
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Scroll-spy via IntersectionObserver (no reflow)
    useEffect(() => {
        const sections = links
            .map((l) => document.getElementById(l.id))
            .filter((el): el is HTMLElement => Boolean(el));
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActive(visible.target.id);
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] }
        );

        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [links]);

    // Lock body scroll while overlay is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <header
            className="fixed inset-x-0 z-50 flex justify-center px-4 transition-[top] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ top: 'var(--marketing-banner-offset, 0px)' }}
        >
            {/* ── Floating glass pill ── */}
            <div
                className={cn(
                    'mt-4 flex w-full max-w-3xl items-center justify-between gap-2 rounded-full py-2 pr-2 pl-5',
                    'ring-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
                    scrolled
                        ? 'bg-white/85 ring-slate-900/10 soft-shadow backdrop-blur-xl'
                        : 'bg-white/60 ring-slate-900/5  backdrop-blur-lg'
                )}
            >
                {/* Logo */}
                <Link href="/" aria-label="CodeGetIt — home" className="group flex shrink-0 items-center gap-2.5">
                    <Logo variant="mark" className="h-[18px] w-auto transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]" />
                    {/* The wordmark lends its tittle to the page: the journey's origin */}
                    <DotlessWordmark
                        before="CodeGet"
                        origin
                        className="font-display text-sm font-semibold tracking-tight text-slate-900"
                    />
                </Link>

                {/* Desktop nav links */}
                <nav className="hidden items-center gap-0.5 md:flex">
                    {links.map((link) => {
                        const isActive = active === link.id;
                        return (
                            <a
                                key={link.label}
                                href={link.href}
                                className={cn(
                                    'relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200',
                                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                                )}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-active"
                                        className="absolute inset-0 -z-10 rounded-full bg-brand-600/[0.08] ring-1 ring-brand-600/20"
                                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                    />
                                )}
                                {link.label}
                            </a>
                        );
                    })}
                </nav>

                {/* Language switch — desktop only */}
                <LanguageSwitch className="hidden md:inline-flex" />

                {/* Mobile hamburger — morphs to X */}
                <button
                    className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label={navCopy.openMenuAria}
                    aria-expanded={mobileOpen}
                >
                    <span className={cn('block h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]', mobileOpen && 'translate-y-[7px] rotate-45')} />
                    <span className={cn('block h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300', mobileOpen && 'opacity-0')} />
                    <span className={cn('block h-0.5 w-5 rounded-full bg-slate-900 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]', mobileOpen && '-translate-y-[7px] -rotate-45')} />
                </button>
            </div>

            {/* ── Mobile full-screen glass overlay with staggered mask reveal ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="fixed inset-0 z-40 flex flex-col justify-center bg-white/65 px-8 backdrop-blur-xl md:hidden"
                    >
                        {/* Close button — top-right, always reachable */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            aria-label={navCopy.closeMenuAria}
                            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Language switch — mirrors the close button, top-left */}
                        <LanguageSwitch className="absolute left-5 top-5 bg-slate-100" />

                        <motion.nav
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } } }}
                            className="flex flex-col gap-2"
                        >
                            {links.map((link) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    variants={{
                                        hidden:  { opacity: 0, y: 24 },
                                        visible: { opacity: 1, y: 0  },
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                                    className="font-display text-4xl font-semibold tracking-tight text-slate-900"
                                >
                                    {link.label}
                                </motion.a>
                            ))}

                            <motion.a
                                href="#contact"
                                onClick={() => setMobileOpen(false)}
                                variants={{
                                    hidden:  { opacity: 0, y: 24 },
                                    visible: { opacity: 1, y: 0  },
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                                className="mt-6 inline-flex w-fit items-center gap-2.5 rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white"
                            >
                                {navCopy.contactButton}
                            </motion.a>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
