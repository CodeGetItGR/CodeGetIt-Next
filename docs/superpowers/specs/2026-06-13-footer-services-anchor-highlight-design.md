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

### 2. `ScrollHighlightProvider` / `useScrollHighlight` — reusable scroll+highlight primitive

Rather than a one-off `hashchange` listener inside `ServicesSection`, this
introduces a small generic provider following the existing
`ContactRequestProvider` convention (`src/providers/ContactRequestProvider/`),
placed at `src/providers/ScrollHighlightProvider/`:

- **Context value**: `{ highlightedId: string | null; scrollToSection: (id: string) => void }`.
- **`scrollToSection(id)`** — imperative: calls
  `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })`,
  sets `highlightedId = id`, and (re)starts a 2.5s timer that resets
  `highlightedId` back to `null`.
- **Passive hash sync** — a `hashchange` listener (plus one run on mount)
  reads `window.location.hash.slice(1)` and, if non-empty, sets
  `highlightedId` + (re)starts the same 2.5s timer, *without* calling
  `scrollIntoView` — a native `<a href="#...">` click (or a hash present at
  load) already drives the browser's own anchor scroll, combined with
  `scroll-behavior: smooth` (global CSS) and `scroll-mt-*` on the target.
  This keeps the passive path a complete no-op for scroll behavior on every
  other existing anchor (`#services`, `#faq`, `#compare`, ...) — it only adds
  an extra piece of state (`highlightedId`) that most sections never read.
- Mounted once in `src/app/page.tsx`, alongside `ContactRequestProvider`.
- **`useScrollHighlight()`** hook mirrors `useContactRequest()` — returns the
  full context value `{ highlightedId, scrollToSection }`.

The `service-N` id namespace is owned and parsed by `ServicesSection` itself
(see below) — the provider stays fully generic with no notion of "groups", so
any future section can adopt the same primitive for its own ids.

**Memoization** — following `ContactRequestProvider`'s existing pattern:
`scrollToSection` (and the hash-sync internals it shares) are wrapped in
`useCallback`, and the context `value` object is wrapped in `useMemo`, so
`highlightedId`/`scrollToSection` stay referentially stable for consumers
across unrelated re-renders.

### 3. Wiring it up

- **`FooterSection`** — services link group gets both:
  - `href="#service-{index}"` (real anchor: deep-linkable, shareable, works
    without JS), **and**
  - an `onClick` (no `preventDefault`) that re-runs the scroll+highlight even
    when the hash doesn't change (e.g. clicking the same footer link twice in
    a row), which the native anchor alone can't do. Following the
    `handleGetStarted` pattern already in `ServicesSection`, this is a single
    `useCallback`'d `handleServiceLinkClick(index: number)` (deps:
    `scrollToSection`) called from a small per-item arrow in `.map()` —
    `onClick={() => handleServiceLinkClick(i)}`.
- **`ServicesSection`** — each card gets `id={`service-${index}`}` +
  `scroll-mt-*`. Reads `highlightedId` from `useScrollHighlight()` and derives:
  - `spotlightIndex` = the numeric index if `highlightedId` matches
    `/^service-(\d)$/` and is within `services.items` bounds, else `null`.
  - `isSpotlight = index === spotlightIndex` → emphasis ring/glow.
  - `isSpotlightDimmed = spotlightIndex !== null && index !== spotlightIndex`,
    combined into the existing dimming check:
    `isDimmed = isFeatureDimmed || isSpotlightDimmed`.

### 4. Visual treatment (Law 1 compliant — no teal)

Per `docs/creative-direction-it.md`, teal (`brand-600`) is reserved for "It"
(the dot) and must not appear in interior sections. The spotlight therefore
uses ink/slate tones only:

- **Spotlighted card** (`isSpotlight`): an added emphasis ring
  (`ring-2 ring-slate-900` plus a soft outer glow ring, e.g.
  `ring-4 ring-slate-900/10`) layered on top of whatever ring/shadow the card
  already has (works the same whether or not it's the "recommended" middle
  card), plus the existing hover-lift translate (`y: -6`).
- **Other two cards** (`isSpotlightDimmed`): dim to the same ~0.38 opacity
  already used by the existing feature-hover dim mechanism.
- All transitions ~400–500ms, matching the existing
  `transition-opacity duration-500` / framer-motion timings already in the
  file. Total spotlight duration ~2.5s before fading back (per the provider's
  timer).

### 5. Edge cases

- **Re-clicking the same footer link**: handled — the `onClick` calls
  `scrollToSection` directly regardless of whether the hash changed, re-running
  the highlight (and re-centering the scroll).
- **Direct/shared link with `#service-N` in the URL**: the mount-time hash
  sync sets `highlightedId` immediately; the browser's native anchor-scroll on
  load (plus `scroll-mt-*`) positions the card correctly.
- **Other hashes** (`#faq`, `#compare`, ...): `highlightedId` becomes e.g.
  `'faq'`, but `ServicesSection`'s `spotlightIndex` parsing only matches
  `service-N`, so this is a no-op for unrelated hashes. No other section
  currently calls `useScrollHighlight()`, so there's no visible effect
  elsewhere on the page.

## Files touched

- New: `src/providers/ScrollHighlightProvider/` — `scroll-highlight-context.ts`,
  `ScrollHighlightProvider.tsx`, `useScrollHighlight.ts`, `index.ts` (+
  re-export from `src/providers/index.ts`).
- [src/app/page.tsx](../../../src/app/page.tsx) — mount
  `ScrollHighlightProvider` alongside `ContactRequestProvider`.
- [src/components/landing/FooterSection.tsx](../../../src/components/landing/FooterSection.tsx) —
  real `href`s + `onClick` for the `services` link group.
- [src/components/landing/ServicesSection.tsx](../../../src/components/landing/ServicesSection.tsx) —
  per-card `id`/`scroll-mt-*`, spotlight/dim styling driven by
  `useScrollHighlight()`.

## Testing

- Manual verification in the browser preview: click each of the three footer
  service links and confirm the page scrolls to and highlights the matching
  card, with the other two dimming and everything settling back after ~2.5s.
- Verify clicking the same footer link twice in a row re-triggers the
  highlight.
- Verify a direct page load with `#service-1` (etc.) in the URL produces the
  same result.
- Verify unrelated hashes (`#faq`, `#compare`, ...) don't trigger any
  spotlight state.
