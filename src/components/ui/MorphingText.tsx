'use client';

import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Gooey text-morph effect, ported from MagicUI (https://magicui.design/docs/components/morphing-text).
 * Two stacked spans cross-fade with a ramping blur; the container's SVG alpha-threshold
 * filter clips the blurred edges into a liquid merge between consecutive words.
 */

const MORPH_TIME = 1.5;
const COOLDOWN_TIME = 0.7;

function useMorphingText(texts: string[]) {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(COOLDOWN_TIME);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const current1 = text1Ref.current;
      const current2 = text2Ref.current;
      if (!current1 || !current2) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / MORPH_TIME;
    if (fraction > 1) {
      cooldownRef.current = COOLDOWN_TIME;
      fraction = 1;
    }

    setStyles(fraction);
    if (fraction === 1) textIndexRef.current++;
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const current1 = text1Ref.current;
    const current2 = text2Ref.current;
    if (current1 && current2) {
      current2.style.filter = 'none';
      current2.style.opacity = '100%';
      current1.style.filter = 'none';
      current1.style.opacity = '0%';
    }
  }, []);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const now = new Date();
      const dt = (now.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;
      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref };
}

interface MorphingTextProps {
  texts: string[];
  className?: string;
}

export function MorphingText({ texts, className }: MorphingTextProps) {
  const { text1Ref, text2Ref } = useMorphingText(texts);

  return (
    <div
      className={cn('morphing-text relative mx-auto w-full text-center leading-none', className)}
    >
      <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text1Ref} />
      <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text2Ref} />

      <svg className="fixed h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="morph-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
