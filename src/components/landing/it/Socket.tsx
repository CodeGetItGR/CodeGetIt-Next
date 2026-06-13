'use client';

import { cn } from '@/lib/utils';

/**
 * An empty socket — a door that's waiting for It. Marks only the entrances to
 * the inquiry flow (navbar quote, hero primary, Services CTAs, contact submit);
 * it is static by design, and the only socket that ever fills is the contact
 * form's (the send-off). Third dot species: traveler (ItSystem), delivered
 * (DeliveredPeriod), socket (here) — sockets are never teal and never move.
 */
export function Socket({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] border-current opacity-40',
        className,
      )}
    />
  );
}
