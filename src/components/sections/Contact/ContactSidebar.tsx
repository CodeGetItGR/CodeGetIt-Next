import { motion } from 'framer-motion';
import { premiumEase, premiumMotion } from '@/lib/motion.ts';

interface ContactSidebarProps {
    emailLabel: string;
    email: string;
    locationLabel: string;
    locationValue: string;
    responseTimeLabel: string;
    responseTimeValue: string;
    trustNote: string;
    className?: string;
}

export const ContactSidebar = ({
    emailLabel,
    email,
    locationLabel,
    locationValue,
    responseTimeLabel,
    responseTimeValue,
    trustNote,
    className = 'lg:col-span-5',
}: ContactSidebarProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: premiumMotion.normal, delay: 0.1, ease: premiumEase }}
        className={className}
    >
        <div className="sticky top-32 space-y-10 rounded-3xl border border-slate-900/[0.06] bg-white p-8 soft-shadow">
            <div>
                <p className="mb-3 text-sm font-medium tracking-wider text-slate-500 uppercase">{emailLabel}</p>
                <a
                    href={`mailto:${email}`}
                    className="text-lg font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors duration-200 hover:text-slate-600"
                >
                    {email}
                </a>
            </div>

            <div>
                <p className="mb-3 text-sm font-medium tracking-wider text-slate-500 uppercase">{locationLabel}</p>
                <p className="text-lg text-slate-900">{locationValue}</p>
            </div>

            <div>
                <p className="mb-3 text-sm font-medium tracking-wider text-slate-500 uppercase">{responseTimeLabel}</p>
                <p className="inline-flex items-center gap-2 text-lg text-slate-900">
                    {/* Availability signal — keeps the green convention, no glow, squared to honor the only-circle-is-It law */}
                    <span className="inline-block h-2 w-2 rounded-[2px] bg-emerald-500" />
                    {responseTimeValue}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-900/[0.06] bg-slate-50 px-4 py-4">
                <p className="text-sm leading-relaxed text-slate-600">{trustNote}</p>
            </div>
        </div>
    </motion.div>
);
