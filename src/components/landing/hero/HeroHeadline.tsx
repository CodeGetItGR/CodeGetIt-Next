import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface HeroHeadlineProps {
  prefix: string;
  highlight: string;
  suffix: string;
}

// Parent triggers stagger; children inherit via variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
  },
};

export function HeroHeadline({ prefix, highlight, suffix }: HeroHeadlineProps) {
  const prefixWords = prefix.trim().split(/\s+/);
  const highlightWords = highlight.trim().split(/\s+/);
  const suffixWords = suffix.trim().split(/\s+/);

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'mb-6 font-black leading-[1.06] tracking-[-0.035em]',
        'text-[clamp(28px,4.4vw,52px)]',
        'flex flex-wrap items-baseline justify-center gap-x-[0.22em] gap-y-1 text-balance',
      )}
    >
      {prefixWords.map((word, i) => (
        <motion.span
          key={`pre-${i}`}
          variants={wordVariants}
          style={{ display: 'inline-block' }}
          className="text-slate-400"
        >
          {word}
        </motion.span>
      ))}

      {highlightWords.map((word, i) => (
        <motion.span
          key={`hl-${i}`}
          variants={wordVariants}
          style={{ display: 'inline-block' }}
          className="relative text-brand-600"
        >
          {word}
          {/* Animated underline — delays until headline words are in */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.58 }}
            className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-brand-500/40"
            aria-hidden="true"
          />
        </motion.span>
      ))}

      {suffixWords.map((word, i) => (
        <motion.span
          key={`sf-${i}`}
          variants={wordVariants}
          style={{ display: 'inline-block' }}
          className="text-slate-900"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
