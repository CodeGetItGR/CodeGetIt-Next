import { useCallback, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useLocale } from '@/i18n/UseLocale';
import { useScrollHighlight } from '@/providers';
import { DotlessWordmark, EASE } from './it';
import { Logo } from './Logo';

/**
 * The epilogue's wordmark keeps its dotless-ı + ItRest-origin logic from
 * DotlessWordmark itself — it can't be split into words and re-masked by
 * ActLine, so the slow final rise is a single hand-rolled clip + motion
 * wrapper around the whole mark instead.
 */
function FooterEpilogue({ caption }: { caption: string }) {
    const ref     = useRef(null);
    const inView  = useInView(ref, { once: true, amount: 0.5 });
    const reduced = useReducedMotion();

    return (
        <div ref={ref} className="relative mb-14 pb-12">
            {/* Drawing hairline */}
            <motion.span
                aria-hidden
                className="absolute bottom-0 left-0 block h-px w-full bg-slate-900/6"
                style={{ transformOrigin: 'left' }}
                initial={reduced ? false : { scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.1, ease: EASE }}
            />

            {/* Wordmark — slow final rise */}
            <p className="overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span
                    className="inline-block align-bottom font-display text-[clamp(2.6rem,8vw,6rem)] font-extrabold leading-none tracking-[-0.03em] text-slate-900 will-change-transform"
                    initial={reduced ? false : { y: '112%' }}
                    animate={inView ? { y: '0%' } : {}}
                    transition={{ duration: 1.1, ease: EASE }}
                >
                    <DotlessWordmark before="codeget" />
                </motion.span>
            </p>

            {/* Caption — fades in after the wordmark settles */}
            <motion.p
                className="mt-4 text-sm italic text-slate-400"
                initial={reduced ? false : { opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
            >
                {caption}
            </motion.p>
        </div>
    );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function FooterSection() {
    const currentYear = new Date().getFullYear();
    const { t }       = useLocale();
    const footer      = t.landing.footer;
    const { scrollToSection } = useScrollHighlight();

    const links = [
        { id: 'services' as const,  category: footer.categories.services,   items: footer.links.services   },
        // { id: 'company' as const,    category: footer.categories.company,    items: footer.links.company    },
        // { id: 'resources' as const, category: footer.categories.resources,  items: footer.links.resources  },
    ];

    const handleServiceLinkClick = useCallback(
        (index: number) => scrollToSection(`service-${index}`),
        [scrollToSection]
    );

    const socialLinks = [
        // { Icon: GithubIcon,   href: '#', label: footer.social.github   },
        { Icon: LinkedInIcon, href: '#', label: footer.social.linkedin },
        { Icon: MailIcon,     href: '#', label: footer.social.email    },
    ];

    return (
        <footer className="border-t border-slate-900/6 bg-white px-6 py-16">
            <div className="mx-auto max-w-6xl">
                {/* Epilogue — the wordmark gave the page its dot and never takes it back */}
                <FooterEpilogue caption={footer.lentDot} />

                <div className="grid gap-10 md:grid-cols-4">
                    {/* Brand col */}
                    <div>
                        <div className="flex items-center gap-2.5">
                            <Logo variant="mark" className="h-5 w-auto" />
                            <span className="font-display text-lg font-semibold tracking-tight text-slate-900">{footer.brandName}</span>
                        </div>
                        {/*<p className="mt-4 max-w-55 text-sm leading-7 text-slate-500">{footer.tagline}</p>*/}
                        <div className="mt-5 flex gap-2">
                            {socialLinks.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-900/8 text-slate-500 transition-all duration-200 hover:bg-slate-900 hover:text-white hover:ring-slate-900"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Page navigation col */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Navigate</h4>
                        <ul className="mt-4 space-y-2.5">
                            {[
                                {label:'Build', href: '#build'},
                                { label: 'Services', href: '#services' },
                                { label: 'Compare',  href: '#compare'  },
                                { label: 'Process',  href: '#process'  },
                                { label: 'Work',     href: '#projects' },
                                { label: 'FAQ',      href: '#faq'      },
                                { label: 'Contact',  href: '#contact'  },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <a href={href} className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Link cols */}
                    {links.map((group) => (
                        <div key={group.category}>
                            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{group.category}</h4>
                            <ul className="mt-4 space-y-2.5">
                                {group.items.map((item, i) => (
                                    <li key={item}>
                                        {group.id === 'services' ? (
                                            <a
                                                href={`#service-${i}`}
                                                onClick={() => handleServiceLinkClick(i)}
                                                className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                                            >
                                                {item}
                                            </a>
                                        ) : (
                                            <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                                                {item}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-slate-900/6 pt-8 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
                    <p>© {currentYear} {footer.brandName}. {footer.rights}</p>
                    {/*<div className="flex gap-5">*/}
                    {/*    <a href="#" className="transition-colors hover:text-slate-900">{footer.privacy}</a>*/}
                    {/*    <a href="#" className="transition-colors hover:text-slate-900">{footer.terms}</a>*/}
                    {/*</div>*/}
                </div>
            </div>
        </footer>
    );
}
