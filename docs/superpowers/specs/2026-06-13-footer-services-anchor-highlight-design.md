# Footer "Services" links → Services section anchor + highlight

> Status: approved
> Date: 2026-06-13

## Problem

In [FooterSection.tsx](../../../src/components/landing/FooterSection.tsx) the
"Services" link group (`Static Websites`, `Web Applications`, `Full-Stack
Solutions`) currently renders `href="#"` for every item — clicking does
nothing. These three labels are an exact, ordered match for the three pricing
cards rendered by [ServicesSection.tsx](../../../src/components/landing/ServicesSection.tsx)
(`id="services"`, `t.landing.services.items`).

## Goal

Clicking a footer service link scrolls to the matching pricing card in the
Services section and briefly highlights it, so the link feels like a real
shortcut rather than a dead anchor.

## Non-goals

- No change to the `company` / `resources` footer link groups.
- No mapping to the Act II ("We code it") section — its three items (`Landing
  pages`, `Custom websites`, `Full-stack applications`) don't correspond 1:1
  to the pricing tiers.
- No persistence/analytics around which card was highlighted.

## Design

### 1. Anchor scheme (index-based, not slug-based)

Each pricing card in `ServicesSection` gets `id={`service-${index}`}` (0/1/2)
plus a `scroll-mt-*` utility so the card clears the floating navbar pill when
scrolled to.

The footer's `services` link group is rendered from
`t.landing.footer.links.services` (an array of 3 strings, same order as
`t.landing.services.items`). For this group only, each link gets
`href={`#service-${index}`}` using the array index — not a slug derived from
the translated title — so the mapping stays correct across locales without
relying on translated strings matching.

### 2. Highlight trigger (ServicesSection)

`ServicesSection` adds an effect that:

- On mount, reads `window.location.hash`.
- Also subscribes to the `hashchange` window event (covers footer → services
  navigation while already on the page).
- If the hash matches `/^#service-(\d)$/` and the index is within
  `services.items` bounds:
  - Calls `scrollIntoView({ behavior: 'smooth', block: 'center' })` on that
    card's element (global CSS already sets `scroll-behavior: smooth`, with
    `prefers-reduced-motion` already falling back to `auto`).
  - Sets local state `spotlightIndex = index`.
  - Starts a 2.5s timer that resets `spotlightIndex` to `null`, after which
    the card returns to its resting visual state. The timer is cleared on
    unmount / re-trigger.

### 3. Visual treatment (Law 1 compliant — no teal)

Per `docs/creative-direction-it.md`, teal (`brand-600`) is reserved for "It"
(the dot) and must not appear in interior sections. The spotlight therefore
uses ink/slate tones only:

- **Spotlighted card** (`index === spotlightIndex`): an added emphasis ring
  (`ring-2 ring-slate-900` plus a soft outer glow ring, e.g.
  `ring-4 ring-slate-900/10`) layered on top of whatever ring/shadow the card
  already has (works the same whether or not it's the "recommended" middle
  card), plus the existing hover-lift translate (`y: -6`).
- **Other two cards**: dim to the same ~0.38 opacity already used by the
  existing feature-hover dim mechanism.
- Dimming is computed as `isDimmed = isFeatureDimmed || isSpotlightDimmed` so
  the existing feature-hover dimming and the new spotlight dimming compose
  without conflicting.
- All transitions ~400–500ms, matching the existing
  `transition-opacity duration-500` / framer-motion timings already in the
  file.

### 4. Edge cases

- **Re-clicking the same footer link**: the URL hash doesn't change, so no
  `hashchange` fires and the spotlight effect won't re-trigger (native anchor
  scrolling still happens via the browser). Accepted as-is — no
  `history.replaceState` workaround.
- **Direct/shared link with `#service-N` in the URL**: on first load, the
  mount-time effect runs the same logic, so deep links also work.
- **Invalid/unknown hash** (e.g. `#service-9`, or any other `#...` hash used
  elsewhere on the page like `#faq`): ignored — `spotlightIndex` stays `null`.

## Files touched

- [src/components/landing/FooterSection.tsx](../../../src/components/landing/FooterSection.tsx) —
  give the `services` link group real `href`s (`#service-0..2`) instead of
  `#`.
- [src/components/landing/ServicesSection.tsx](../../../src/components/landing/ServicesSection.tsx) —
  add per-card `id`/`scroll-mt-*`, the hash-driven spotlight effect, and the
  spotlight ring/dim styling.

## Testing

- Manual verification in the browser preview: click each of the three footer
  service links and confirm the page scrolls to and highlights the matching
  card, with the other two dimming and everything settling back after ~2.5s.
- Verify a direct page load with `#service-1` (etc.) in the URL produces the
  same result.
- Verify unrelated hashes (`#faq`, `#compare`, ...) don't trigger any
  spotlight state.
