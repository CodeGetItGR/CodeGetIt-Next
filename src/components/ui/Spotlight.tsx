import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

/**
 * Aceternity-style SVG spotlight — a soft beam of light that fades in from a corner.
 * Uses `animate-spotlight` (defined in index.css @theme) and starts with `opacity-0`.
 * Position via `className` (e.g. "-top-40 left-0 md:left-60 md:-top-20").
 */
export function Spotlight({ className, fill = 'white' }: SpotlightProps) {
  return (
    <svg
      className={cn(
        'pointer-events-none absolute z-[1] h-[169%] w-[138%] animate-spotlight opacity-0',
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#hero-spotlight-filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="hero-spotlight-filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_hero" />
        </filter>
      </defs>
    </svg>
  );
}
