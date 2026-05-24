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
        <div className="relative sticky top-32 space-y-10 overflow-hidden rounded-3xl border border-gray-800 bg-linear-to-b from-gray-950 via-slate-900 to-gray-950 p-8 text-gray-100 shadow-2xl shadow-slate-900/30">
            <motion.div
                className="pointer-events-none absolute -top-20 right-[-2.5rem] h-52 w-52 rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 19, repeat: Infinity, ease: 'linear' }}
            />

            <div>
                <p className="mb-3 text-sm font-medium tracking-wider text-gray-400 uppercase">{emailLabel}</p>
                <a
                    href={`mailto:${email}`}
                    className="text-lg font-semibold text-white underline decoration-gray-700 underline-offset-4 transition-colors duration-200 hover:text-gray-300"
                >
                    {email}
                </a>
            </div>

            <div>
                <p className="mb-3 text-sm font-medium tracking-wider text-gray-400 uppercase">{locationLabel}</p>
                <p className="text-lg text-white">{locationValue}</p>
            </div>

            <div>
                <p className="mb-3 text-sm font-medium tracking-wider text-gray-400 uppercase">{responseTimeLabel}</p>
                <p className="inline-flex items-center gap-2 text-lg text-white">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
                    {responseTimeValue}
                </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/80 px-4 py-4">
                <p className="text-sm leading-relaxed text-gray-300">{trustNote}</p>
            </div>
        </div>
    </motion.div>
);
