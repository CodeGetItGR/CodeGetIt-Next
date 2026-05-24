import { Mail } from 'lucide-react';
import { useLocale } from '@/i18n/UseLocale';

export function FooterSection() {
    const currentYear = new Date().getFullYear();
    const { t } = useLocale();
    const footer = t.landing.footer;

    const links = [
        { category: footer.categories.services, items: footer.links.services },
        { category: footer.categories.company, items: footer.links.company },
        { category: footer.categories.resources, items: footer.links.resources },
    ];

    const socialLinks = [
        // TODO: Add actual icons and links
        { icon: '', href: '#', label: footer.social.github },
        { icon: '', href: '#', label: footer.social.linkedin },
        { icon: Mail, href: '#', label: footer.social.email },
    ];

    return (
        <footer className="border-t border-white/10 bg-[#0a0e27] px-6 py-16">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 md:grid-cols-4">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-white">{footer.brandName}</h3>
                        <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">{footer.tagline}</p>
                        <div className="mt-6 flex gap-3">
                            {socialLinks.map((social) => {
                                // const icon = social.icon;

                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-200 transition-colors hover:bg-white/10"
                                    >
                                        {/*<image src={icon} className="h-5 w-5" />*/}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {links.map((group) => (
                        <div key={group.category}>
                            <h4 className="font-semibold text-white">{group.category}</h4>
                            <ul className="mt-4 space-y-3">
                                {group.items.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-slate-400 transition-colors hover:text-cyan-300">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                    <p>
                        © {currentYear} {footer.brandName}. {footer.rights}
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="transition-colors hover:text-cyan-300">
                            {footer.privacy}
                        </a>
                        <a href="#" className="transition-colors hover:text-cyan-300">
                            {footer.terms}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
