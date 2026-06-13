# Footer "Services" Links → Services Section Anchor + Highlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clicking a footer "Services" link (`Static Websites` / `Web Applications` / `Full-Stack Solutions`) scrolls to the matching pricing card in the Services section and briefly spotlights it, via a real `#service-N` anchor plus a reusable `ScrollHighlightProvider`/`useScrollHighlight()` primitive.

**Architecture:** A new context provider (`ScrollHighlightProvider`, mirroring the existing `ContactRequestProvider` folder convention) owns `highlightedId` state and an imperative `scrollToSection(id)`. It is mounted once in `src/app/page.tsx`. `ServicesSection` gives each pricing card `id="service-{index}"` and reads `highlightedId` to derive a spotlight/dim state (ink/slate styling only — Law 1). `FooterSection`'s "Services" link group gets real `href="#service-{index}"` anchors plus an `onClick` that calls `scrollToSection` so re-clicking the same link still re-triggers the highlight.

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (`cn()` via `clsx`/`tailwind-merge`), framer-motion. No test framework exists in this repo (`package.json` has only `dev`/`build`/`start`/`lint`) — verification uses `npx tsc --noEmit`, `npm run lint`, and manual browser-preview checks per the spec's "Testing" section.

**Reference spec:** `docs/superpowers/specs/2026-06-13-footer-services-anchor-highlight-design.md`

---

### Task 1: Create `ScrollHighlightProvider` primitive and wire it into the providers barrel

**Files:**
- Create: `src/providers/ScrollHighlightProvider/scroll-highlight-context.ts`
- Create: `src/providers/ScrollHighlightProvider/ScrollHighlightProvider.tsx`
- Create: `src/providers/ScrollHighlightProvider/useScrollHighlight.ts`
- Create: `src/providers/ScrollHighlightProvider/index.ts`
- Modify: `src/providers/index.ts`

This mirrors the existing `src/providers/ContactRequestProvider/` folder: a context file, a provider component (`useState`/`useCallback`/`useMemo`), a `use*` hook with throw-if-missing, and a barrel `index.ts`, re-exported from the top-level providers barrel.

- [ ] **Step 1: Create the context file**

Create `src/providers/ScrollHighlightProvider/scroll-highlight-context.ts`:

```typescript
'use client'

import { createContext } from 'react';

export interface ScrollHighlightContextValue {
    highlightedId: string | null;
    scrollToSection: (id: string) => void;
}

export const ScrollHighlightContext = createContext<ScrollHighlightContextValue | undefined>(undefined);
```

- [ ] **Step 2: Create the provider component**

Create `src/providers/ScrollHighlightProvider/ScrollHighlightProvider.tsx`:

```typescript
'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ScrollHighlightContext } from '@/providers';

const HIGHLIGHT_DURATION_MS = 2500;

export const ScrollHighlightProvider = ({ children }: { children: ReactNode }) => {
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const highlight = useCallback((id: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHighlightedId(id);
        timeoutRef.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_DURATION_MS);
    }, []);

    const scrollToSection = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlight(id);
    }, [highlight]);

    useEffect(() => {
        const syncFromHash = () => {
            const hash = window.location.hash.slice(1);
            if (hash) highlight(hash);
        };

        syncFromHash();
        window.addEventListener('hashchange', syncFromHash);

        return () => {
            window.removeEventListener('hashchange', syncFromHash);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [highlight]);

    const value = useMemo(
        () => ({ highlightedId, scrollToSection }),
        [highlightedId, scrollToSection]
    );

    return <ScrollHighlightContext.Provider value={value}>{children}</ScrollHighlightContext.Provider>;
};
```

- [ ] **Step 3: Create the `useScrollHighlight` hook**

Create `src/providers/ScrollHighlightProvider/useScrollHighlight.ts`:

```typescript
import { useContext } from 'react';
import { ScrollHighlightContext } from '@/providers';

export function useScrollHighlight() {
    const context = useContext(ScrollHighlightContext);

    if (!context) {
        throw new Error('useScrollHighlight must be used within a ScrollHighlightProvider');
    }

    return context;
}
```

- [ ] **Step 4: Create the folder barrel export**

Create `src/providers/ScrollHighlightProvider/index.ts`:

```typescript
export * from './scroll-highlight-context'
export * from './ScrollHighlightProvider'
export * from './useScrollHighlight'
```

- [ ] **Step 5: Re-export from the top-level providers barrel**

Modify `src/providers/index.ts` — current content:

```typescript
export * from './ContactRequestProvider'
export * from './AiChatProvider'
```

New content:

```typescript
export * from './ContactRequestProvider'
export * from './AiChatProvider'
export * from './ScrollHighlightProvider'
```

- [ ] **Step 6: Type-check and lint**

Run:

```
npx tsc --noEmit
npm run lint
```

Expected: both complete with no errors related to the new `ScrollHighlightProvider` files.

- [ ] **Step 7: Commit**

```bash
git add src/providers/ScrollHighlightProvider src/providers/index.ts
git commit -m "Add reusable ScrollHighlightProvider/useScrollHighlight primitive"
```

---

### Task 2: Mount `ScrollHighlightProvider` in the landing page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Import and mount the provider**

Modify `src/app/page.tsx`. Current content:

```tsx
'use client'

import { ContactRequestProvider } from '@/providers';
import { PublicSettingsProvider } from '@/settings/PublicSettingsProvider';
import {
    ActCodeSection,
    ActGetSection,
    ComparisonSection,
    FAQSection,
    FooterSection,
    HeroSection,
    HowWeWorkSection,
    ItProvider,
    ProjectsSection,
    ServicesSection,
    Navbar,
} from '@/components/landing';
import { Contact } from '@/components';

export default function LandingPage() {
    return (
        <PublicSettingsProvider>
            <ContactRequestProvider>
                {/* overflow-x-clip (not -hidden): hidden would make this a scroll container and break the Act II sticky pin */}
                <div className="relative min-h-screen overflow-x-clip bg-[#fafafa] text-slate-900">
                    {/* Fixed film-grain overlay — one instance for the whole page */}
                    <div className="page-grain" aria-hidden="true" />
                    {/* The It journey: Act I (hero) → Act II (hop list) → absence → Act III (handover) */}
                    <ItProvider>
                        <Navbar />
                        <HeroSection />
                        <ActCodeSection />
                        <ServicesSection />
                        <ComparisonSection />
                        <HowWeWorkSection />
                        <ProjectsSection />
                        <FAQSection />
                        <ActGetSection />
                        <Contact />
                        <FooterSection />
                    </ItProvider>
                </div>
            </ContactRequestProvider>
        </PublicSettingsProvider>
    );
}
```

New content (adds `ScrollHighlightProvider` import and wraps the page content alongside `ContactRequestProvider`):

```tsx
'use client'

import { ContactRequestProvider, ScrollHighlightProvider } from '@/providers';
import { PublicSettingsProvider } from '@/settings/PublicSettingsProvider';
import {
    ActCodeSection,
    ActGetSection,
    ComparisonSection,
    FAQSection,
    FooterSection,
    HeroSection,
    HowWeWorkSection,
    ItProvider,
    ProjectsSection,
    ServicesSection,
    Navbar,
} from '@/components/landing';
import { Contact } from '@/components';

export default function LandingPage() {
    return (
        <PublicSettingsProvider>
            <ContactRequestProvider>
                <ScrollHighlightProvider>
                    {/* overflow-x-clip (not -hidden): hidden would make this a scroll container and break the Act II sticky pin */}
                    <div className="relative min-h-screen overflow-x-clip bg-[#fafafa] text-slate-900">
                        {/* Fixed film-grain overlay — one instance for the whole page */}
                        <div className="page-grain" aria-hidden="true" />
                        {/* The It journey: Act I (hero) → Act II (hop list) → absence → Act III (handover) */}
                        <ItProvider>
                            <Navbar />
                            <HeroSection />
                            <ActCodeSection />
                            <ServicesSection />
                            <ComparisonSection />
                            <HowWeWorkSection />
                            <ProjectsSection />
                            <FAQSection />
                            <ActGetSection />
                            <Contact />
                            <FooterSection />
                        </ItProvider>
                    </div>
                </ScrollHighlightProvider>
            </ContactRequestProvider>
        </PublicSettingsProvider>
    );
}
```

- [ ] **Step 2: Type-check and lint**

Run:

```
npx tsc --noEmit
npm run lint
```

Expected: both complete with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "Mount ScrollHighlightProvider on the landing page"
```

---

### Task 3: Add per-card anchors and spotlight styling to `ServicesSection`

**Files:**
- Modify: `src/components/landing/ServicesSection.tsx`

This task is independently verifiable: setting `#service-1` (etc.) in the URL hash should spotlight the matching card and dim the others, fading back after ~2.5s, even before the footer links are wired up in Task 4.

- [ ] **Step 1: Import `useScrollHighlight` alongside the existing `useContactRequest` import**

Modify `src/components/landing/ServicesSection.tsx:9` — current:

```typescript
import { useContactRequest } from '@/providers';
```

New:

```typescript
import { useContactRequest, useScrollHighlight } from '@/providers';
```

- [ ] **Step 2: Add a spotlight-id pattern constant near the other module-level constants**

Modify `src/components/landing/ServicesSection.tsx` — current (lines 60-61):

```typescript
// Middle card (index 1) is the recommended / highlighted tier
const RECOMMENDED_INDEX = 1;
```

New:

```typescript
// Middle card (index 1) is the recommended / highlighted tier
const RECOMMENDED_INDEX = 1;

// Matches the `#service-{index}` anchors used by FooterSection's "Services" links
const SPOTLIGHT_ID_PATTERN = /^service-(\d+)$/;
```

- [ ] **Step 3: Read `highlightedId` and derive `spotlightIndex`**

Modify `src/components/landing/ServicesSection.tsx` — current (lines 63-79):

```typescript
export function ServicesSection() {
    const { t }               = useLocale();
    const { openContactRequest } = useContactRequest();
    const containerRef        = useRef<HTMLDivElement | null>(null);
    const ref                 = useRef(null);
    const isInView            = useInView(ref, { once: true, margin: '-80px' });

    const [hoverFeature,  setHoverFeature]  = useState<string | null>(null);
    const [lockedFeature, setLockedFeature] = useState<string | null>(null);
    const activeFeature = lockedFeature ?? hoverFeature;

    const settingsQuery = useQuery({
        queryKey: queryKeys.settings.list,
        queryFn:  () => settingsApi.getPublic(),
    });

    const services = t.landing.services;
```

New:

```typescript
export function ServicesSection() {
    const { t }               = useLocale();
    const { openContactRequest } = useContactRequest();
    const { highlightedId }   = useScrollHighlight();
    const containerRef        = useRef<HTMLDivElement | null>(null);
    const ref                 = useRef(null);
    const isInView            = useInView(ref, { once: true, margin: '-80px' });

    const [hoverFeature,  setHoverFeature]  = useState<string | null>(null);
    const [lockedFeature, setLockedFeature] = useState<string | null>(null);
    const activeFeature = lockedFeature ?? hoverFeature;

    const settingsQuery = useQuery({
        queryKey: queryKeys.settings.list,
        queryFn:  () => settingsApi.getPublic(),
    });

    const services = t.landing.services;

    const spotlightMatch = highlightedId?.match(SPOTLIGHT_ID_PATTERN);
    const spotlightIndex = spotlightMatch && Number(spotlightMatch[1]) < services.items.length
        ? Number(spotlightMatch[1])
        : null;
```

- [ ] **Step 4: Derive spotlight/dim flags per card and combine with the existing dim check**

Modify `src/components/landing/ServicesSection.tsx` — current (lines 109-115):

```typescript
                    {services.items.map((service, index) => {
                        const Icon        = serviceIcons[index] ?? serviceIcons[0];
                        const features    = featureMatrix[index] ?? [];
                        const price       = settingsQuery.data?.[service.priceKey] ?? service.defaultPrice;
                        const isRecommended = index === RECOMMENDED_INDEX;
                        const isDimmed    = activeFeature !== null && !features.includes(activeFeature);

                        return (
```

New:

```typescript
                    {services.items.map((service, index) => {
                        const Icon        = serviceIcons[index] ?? serviceIcons[0];
                        const features    = featureMatrix[index] ?? [];
                        const price       = settingsQuery.data?.[service.priceKey] ?? service.defaultPrice;
                        const isRecommended = index === RECOMMENDED_INDEX;
                        const isFeatureDimmed = activeFeature !== null && !features.includes(activeFeature);
                        const isSpotlight    = index === spotlightIndex;
                        const isSpotlightDimmed = spotlightIndex !== null && index !== spotlightIndex;
                        const isDimmed    = isFeatureDimmed || isSpotlightDimmed;

                        return (
```

- [ ] **Step 5: Add `id`, `scroll-mt-*`, and the spotlight ring/glow to the card**

Modify `src/components/landing/ServicesSection.tsx` — current (lines 117-129):

```typescript
                            <motion.article
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: isDimmed ? 0.38 : 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                                className={cn(
                                    'relative flex flex-col rounded-[1.5rem] p-[6px] transition-opacity duration-500',
                                    isRecommended
                                        ? 'ring-2 ring-slate-900/80 soft-shadow-lg'
                                        : 'ring-1 ring-slate-900/[0.06] soft-shadow',
                                )}
                            >
```

New:

```typescript
                            <motion.article
                                key={service.title}
                                id={`service-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: isDimmed ? 0.38 : 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                                className={cn(
                                    'relative flex flex-col rounded-[1.5rem] p-[6px] scroll-mt-28 transition-all duration-500',
                                    isRecommended
                                        ? 'ring-2 ring-slate-900/80 soft-shadow-lg'
                                        : 'ring-1 ring-slate-900/[0.06] soft-shadow',
                                    isSpotlight && 'ring-2 ring-slate-900 ring-offset-2 ring-offset-[#fafafa] drop-shadow-[0_0_24px_rgba(15,23,42,0.18)]',
                                )}
                            >
```

Notes on this styling (Law 1 compliant — ink/slate only, no teal):
- `id={`service-${index}`}` + `scroll-mt-28` let the footer's `#service-{index}` anchor land the card below the floating navbar pill.
- `transition-opacity` → `transition-all` so the spotlight ring/glow animates in/out over the same ~500ms as the existing opacity transition.
- When `isSpotlight` is true, `ring-2 ring-slate-900` (via `cn`/`tailwind-merge`) replaces whatever ring-width/color the card already had, `ring-offset-2 ring-offset-[#fafafa]` pops the ring against the page background, and `drop-shadow-[...]` adds a soft ink glow as a `filter` — a different CSS property from the `box-shadow`-based `.soft-shadow`/`.soft-shadow-lg` classes, so it layers on top without overriding them.

- [ ] **Step 6: Type-check and lint**

Run:

```
npx tsc --noEmit
npm run lint
```

Expected: both complete with no errors.

- [ ] **Step 7: Manual verification in the browser preview**

Start the dev server (or reuse a running one) and open the landing page.

1. Navigate to `/#service-1`. Confirm the middle pricing card ("Web Applications") gets a dark ring + soft ink glow, the other two cards dim to ~0.38 opacity, and after ~2.5s everything returns to normal (ring/glow disappear, opacity back to 1).
2. Navigate to `/#service-0` and `/#service-2` and confirm the first/third cards spotlight correctly.
3. Navigate to `/#faq` (an existing, unrelated anchor). Confirm no card in the Services section spotlights or dims — this hash is a no-op for `ServicesSection`.

- [ ] **Step 8: Commit**

```bash
git add src/components/landing/ServicesSection.tsx
git commit -m "Add per-card anchors and scroll-spotlight styling to ServicesSection"
```

---

### Task 4: Wire FooterSection "Services" links to scroll + highlight

**Files:**
- Modify: `src/components/landing/FooterSection.tsx`

- [ ] **Step 1: Add imports for `useCallback` and `useScrollHighlight`**

Modify `src/components/landing/FooterSection.tsx:1-3` — current:

```typescript
import { useLocale } from '@/i18n/UseLocale';
import { DotlessWordmark } from './it';
import { Logo } from './Logo';
```

New:

```typescript
import { useCallback } from 'react';
import { useLocale } from '@/i18n/UseLocale';
import { useScrollHighlight } from '@/providers';
import { DotlessWordmark } from './it';
import { Logo } from './Logo';
```

- [ ] **Step 2: Tag the `services` link group with an `id` discriminator and add the click handler**

Modify `src/components/landing/FooterSection.tsx:23-32` — current:

```typescript
export function FooterSection() {
    const currentYear = new Date().getFullYear();
    const { t }       = useLocale();
    const footer      = t.landing.footer;

    const links = [
        { category: footer.categories.services,   items: footer.links.services   },
        // { category: footer.categories.company,    items: footer.links.company    },
        { category: footer.categories.resources,  items: footer.links.resources  },
    ];
```

New:

```typescript
export function FooterSection() {
    const currentYear = new Date().getFullYear();
    const { t }       = useLocale();
    const footer      = t.landing.footer;
    const { scrollToSection } = useScrollHighlight();

    const links = [
        { id: 'services' as const,  category: footer.categories.services,   items: footer.links.services   },
        // { id: 'company' as const,    category: footer.categories.company,    items: footer.links.company    },
        { id: 'resources' as const, category: footer.categories.resources,  items: footer.links.resources  },
    ];

    const handleServiceLinkClick = useCallback(
        (index: number) => scrollToSection(`service-${index}`),
        [scrollToSection]
    );
```

- [ ] **Step 3: Render real anchors + onClick for the `services` group, leaving other groups unchanged**

Modify `src/components/landing/FooterSection.tsx:74-87` — current:

```typescript
                    {/* Link cols */}
                    {links.map((group) => (
                        <div key={group.category}>
                            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{group.category}</h4>
                            <ul className="mt-4 space-y-2.5">
                                {group.items.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
```

New:

```typescript
                    {/* Link cols */}
                    {links.map((group) => (
                        <div key={group.category}>
                            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{group.category}</h4>
                            <ul className="mt-4 space-y-2.5">
                                {group.items.map((item, i) => (
                                    <li key={item}>
                                        {group.id === 'services' ? (
                                            <a
                                                href={`#service-${i}`}
                                                onClick={() => handleServiceLinkClick(i)}
                                                className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                                            >
                                                {item}
                                            </a>
                                        ) : (
                                            <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                                                {item}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
```

- [ ] **Step 4: Type-check and lint**

Run:

```
npx tsc --noEmit
npm run lint
```

Expected: both complete with no errors.

- [ ] **Step 5: Manual verification in the browser preview**

Start the dev server (or reuse a running one), open the landing page, and scroll to the footer.

1. Click "Static Websites". Confirm the page smooth-scrolls so the first pricing card ("Static Websites") is centered, that card gets the dark ring + ink glow, the other two dim, and everything settles back after ~2.5s.
2. Click "Web Applications", then "Full-Stack Solutions" — confirm each scrolls to and spotlights the matching card (index 1 and 2 respectively).
3. Click the same link (e.g. "Static Websites") twice in a row. Confirm the second click re-triggers the scroll + spotlight (the `onClick` calls `scrollToSection` directly, independent of whether the URL hash actually changes).
4. Reload the page with `#service-2` already in the URL. Confirm the third card ("Full-Stack Solutions") is positioned correctly (native anchor scroll + `scroll-mt-28`) and spotlights on load.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/FooterSection.tsx
git commit -m "Wire footer Services links to scroll+highlight the matching pricing card"
```

---

## Self-Review

**Spec coverage:**
- Anchor scheme (`#service-{index}`, index-based, `scroll-mt-*`) → Task 3 Steps 1/5, Task 4 Step 3.
- `ScrollHighlightProvider`/`useScrollHighlight` with `{ highlightedId, scrollToSection }`, imperative scroll+highlight, passive hashchange sync (no `scrollIntoView` on the passive path), 2.5s timer, mounted alongside `ContactRequestProvider` → Task 1, Task 2.
- Memoization (`useCallback` for `scrollToSection`/`highlight`, `useMemo` for context value; `handleServiceLinkClick` via `useCallback` in FooterSection) → Task 1 Step 2, Task 4 Step 2.
- `ServicesSection` spotlight/dim derivation (`spotlightIndex`, `isSpotlight`, `isSpotlightDimmed`, combined `isDimmed`) → Task 3 Steps 2-4.
- Law 1 visual treatment (ink/slate ring + glow, no teal) → Task 3 Step 5.
- Edge cases (re-click re-triggers, direct `#service-N` load, unrelated hashes no-op) → Task 3 Step 7 (#3), Task 4 Step 5 (#3, #4).
- Non-goals (no `company`/`resources` changes, no Act II mapping) → Task 4 Step 3 leaves the non-services branch untouched; Act II untouched throughout.

**Placeholder scan:** No TBD/TODO; every step has complete code or exact commands.

**Type consistency:** `ScrollHighlightContextValue` (`highlightedId: string | null`, `scrollToSection: (id: string) => void`) defined in Task 1 Step 1 is used identically in Task 3 (`const { highlightedId } = useScrollHighlight()`) and Task 4 (`const { scrollToSection } = useScrollHighlight()`). `SPOTLIGHT_ID_PATTERN`/`spotlightIndex`/`isSpotlight`/`isSpotlightDimmed`/`isFeatureDimmed`/`isDimmed` names are consistent across Task 3's steps. `handleServiceLinkClick(index: number)` signature matches its `onClick={() => handleServiceLinkClick(i)}` usage in Task 4.
