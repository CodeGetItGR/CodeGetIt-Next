import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface HeroBadgeProps {
  text: string;
}

export function HeroBadge({ text }: HeroBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26, delay: 0.04 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8',
        'border-teal-500/20 bg-teal-500/[0.08] text-[13px] font-medium tracking-tight text-teal-400',
      )}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400 flex-shrink-0" />
      {text}
    </motion.div>
  );
}
