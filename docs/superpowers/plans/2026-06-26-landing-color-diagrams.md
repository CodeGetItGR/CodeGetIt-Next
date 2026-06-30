# Landing Page Color + Diagram Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring noticeably more color into the landing page's interior sections (Services, Comparison, How We Work, Projects, FAQ) using only the existing teal/amber/slate palette, plus one new content-accurate diagram in Comparison and a reused-icon background mark in How We Work — without touching the "IT." story spine (Navbar, HeroSection, ActCodeSection, ActGetSection, FooterSection, `it/`).

**Architecture:** Five independent, sequential tasks — one per section — each touching only that section's existing component file(s). No new dependencies, no new color tokens, no new image assets except one new small presentational component (`GrowthDiagram`) for Comparison.

**Tech Stack:** Next.js (React 19), Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`), Framer Motion. No test runner is configured in this repo (`package.json` has no `test` script) — verification for each task is `npx tsc --noEmit`, `npm run lint`, and a manual visual check against the dev server (or `Read`-ing the rendered diff if no browser is available). This is a deliberate adaptation: there is no existing test infra for these presentational components, and introducing one is out of scope for a styling pass.

**Reference spec:** `docs/superpowers/specs/2026-06-26-landing-color-diagrams-design.md`

---

### Task 1: Services — tier-colored icon chips

**Files:**
- Modify: `src/components/landing/ServicesSection.tsx`

**Context:** Service tier icon chips (lines ~172-178) currently use a binary `isRecommended ? 'bg-slate-900/5 text-slate-700' : 'bg-slate-100 text-slate-600'` — the two non-recommended tiers look identical. Pricing-factor icon tiles (lines ~280-283) are uniform `bg-slate-100 text-slate-500` even though `FACTOR_ICONS` already hardcode a teal stroke (`stroke="#0d9488"`), so the gray tile clashes with the already-teal icon inside it.

- [ ] **Step 1: Add a per-tier chip style array**

In `src/components/landing/ServicesSection.tsx`, after the `RECOMMENDED_INDEX` constant (around line 72), add:

```tsx
// Per-tier icon chip tint — index 0 (static) stays neutral, index 1 (recommended)
// gets the teal tint already used on its card, index 2 (full-stack) gets amber
// so all three tiers read as visually distinct instead of two identical grays.
const TIER_CHIP_STYLES = [
    'bg-slate-100 text-slate-600',
    'bg-brand-600/10 text-brand-700',
    'bg-amber-50 text-amber-700',
];
```

- [ ] **Step 2: Replace the icon chip className**

Find this block inside the `.map` (around line 173-178):

```tsx
                                    <div className={cn(
                                        'mb-5 inline-flex w-fit rounded-xl p-2.5',
                                        isRecommended ? 'bg-slate-900/5 text-slate-700' : 'bg-slate-100 text-slate-600'
                                    )}>
                                        <Icon />
                                    </div>
```

Replace with:

```tsx
                                    <div className={cn(
                                        'mb-5 inline-flex w-fit rounded-xl p-2.5',
                                        TIER_CHIP_STYLES[index] ?? TIER_CHIP_STYLES[0],
                                    )}>
                                        <Icon />
                                    </div>
```

- [ ] **Step 3: Tint the pricing-factor icon tiles**

Find this block (around line 280-283):

```tsx
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                    {FACTOR_ICONS[i]}
                                </div>
```

Replace with:

```tsx
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600/8 text-slate-500">
                                    {FACTOR_ICONS[i]}
                                </div>
```

(The icons already hardcode a teal stroke; this just makes the tile background agree with them instead of fighting a flat gray.)

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no new errors.

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 5: Visual check**

Start the dev server (`npm run dev`) if not already running, open the landing page, scroll to Services. Confirm: the three tier icon chips are now visually distinct (slate / teal / amber), and the pricing-factors row no longer has flat-gray tiles around teal icons.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/ServicesSection.tsx
git commit -m "Tint Services icon chips per tier instead of flat slate"
```

---

### Task 2: Comparison — growth diagram

**Files:**
- Modify: `src/components/landing/ComparisonSection.tsx`
- Modify: `src/components/landing/index.ts` (barrel export, if `ComparisonSection` co-exports siblings — verify pattern first)

**Context:** The Comparison section is currently a pure data table (`comparisonMatrix`/`rows`) with no visual element above it. We're adding a small horizontal diagram — three nodes growing in size, connected by a line that goes from light to saturated teal — that visualizes "more capability, more weight" the same way the table states it in words. Nodes are rounded squares, not circles, to avoid reading as a second "It" dot.

- [ ] **Step 1: Check for an existing barrel-export pattern**

Run: `cat src/components/landing/index.ts | head -20`

If `ComparisonSection` is exported from a barrel file (`src/components/landing/index.ts`), the new `ComparisonGrowthDiagram` component does NOT need its own barrel entry since it's only imported directly by `ComparisonSection.tsx` (it's an internal implementation detail of that section, not part of the public `@/components/landing` surface). Skip modifying the barrel.

```tsx
'use client'

import { cn } from '@/lib/utils';

interface ComparisonGrowthDiagramProps {
    labels: [string, string, string];
}

// Three rounded-square nodes growing in size left-to-right, connected by a
// line that goes from light to saturated teal — the same "more capability,
// more weight" idea the table states in words. Squares, not circles: the
// only circle on the page is It (docs/creative-direction-it.md Law 2).
const NODE_SIZES = ['h-5 w-5 rounded-md', 'h-7 w-7 rounded-lg', 'h-10 w-10 rounded-xl'];
const NODE_FILLS = ['bg-brand-200', 'bg-brand-400', 'bg-brand-600'];

export function ComparisonGrowthDiagram({ labels }: ComparisonGrowthDiagramProps) {
    return (
        <div className="relative mx-auto mb-12 max-w-xl" aria-hidden="true">
            <div
                className="absolute left-[10%] right-[10%] top-5 h-px"
                style={{ background: 'linear-gradient(90deg, #99f6e4 0%, #2dd4bf 50%, #0d9488 100%)' }}
            />
            <div className="relative flex items-center justify-between">
                {labels.map((label, i) => (
                    <div key={label} className="flex flex-1 flex-col items-center gap-2.5">
                        <span className={cn('flex shrink-0', NODE_SIZES[i], NODE_FILLS[i])} />
                        <span
                            className={cn(
                                'text-center text-[11px] font-medium',
                                i === labels.length - 1 ? 'font-semibold text-slate-900' : 'text-slate-500',
                            )}
                        >
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Import and render it in ComparisonSection**

In `src/components/landing/ComparisonSection.tsx`, add the import after the existing `SectionHeading` import (around line 6):

```tsx
import { ComparisonGrowthDiagram } from './ComparisonGrowthDiagram';
```

Then find the `<SectionHeading .../>` call (around line 55) and add the diagram immediately after it, before `<div className="mt-14">`:

```tsx
                <SectionHeading eyebrow={comparison.eyebrow} title={comparison.title} description={comparison.description} />

                <ComparisonGrowthDiagram
                    labels={[
                        comparison.headers.staticWebsite,
                        comparison.headers.webApplication,
                        comparison.headers.fullStackApplication,
                    ]}
                />

                <div className="mt-14">
```

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no new errors.

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 5: Visual check**

Open the landing page, scroll to Comparison. Confirm: a small three-node diagram appears above the table, growing in size and color left to right, labeled with the same three column headers as the table below it. Confirm it does not look like a circular brand-dot reference (nodes are rounded squares).

- [ ] **Step 6: Commit**

---

### Task 3: How We Work — tinted background icon per step

**Files:**
- Modify: `src/components/landing/process/icons.tsx`
- Modify: `src/components/landing/process/ProcessTimeline.tsx`
- Modify: `src/components/landing/process/ProcessStepContent.tsx`
- Modify: `src/components/landing/HowWeWorkSection.tsx`

**Context:** `ProcessTimeline.tsx` already defines `const stepIcons = [DiscoverIcon, DesignIcon, BuildIcon, LaunchIcon]` locally and colors the active step teal. `ProcessStepContent.tsx` (the right-column detail block per step) has no visual element at all — just text. We're reusing the same per-step icon set, enlarged and tinted, as a low-opacity background mark behind each step's heading. The icon components currently only accept a `size` prop with no way to set color via class — we need to add `className` support so we can tint via `currentColor`.

- [ ] **Step 1: Add `className` support to the step icons**

In `src/components/landing/process/icons.tsx`, update the shared props interface and every icon function to accept and forward `className`:

```tsx
// Ultra-light Phosphor-style step icons
interface IconProps {
  size?: number;
  className?: string;
}
export function DiscoverIcon({ size = 22, className }: IconProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v3l2 2" />
    </svg>
  );
}
export function DesignIcon({ size = 22, className }: IconProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
export function BuildIcon({ size = 22, className }: IconProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
export function LaunchIcon({ size = 22, className }: IconProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2 15 22 11 13 2 9l20-7z" />
    </svg>
  );
}

export const stepIcons = [DiscoverIcon, DesignIcon, BuildIcon, LaunchIcon];
```

(This adds the `stepIcons` export here so both `ProcessTimeline.tsx` and `ProcessStepContent.tsx` can share one definition instead of duplicating the array.)

- [ ] **Step 2: Remove the duplicate `stepIcons` from ProcessTimeline and import the shared one**

In `src/components/landing/process/ProcessTimeline.tsx`, find (lines 5-7):

```tsx
import { BuildIcon, DesignIcon, DiscoverIcon, LaunchIcon } from './icons';

const stepIcons = [DiscoverIcon, DesignIcon, BuildIcon, LaunchIcon];

interface ProcessTimelineProps {
```

Replace those three lines with:

```tsx
import { stepIcons } from './icons';

interface ProcessTimelineProps {
```

- [ ] **Step 3: Run the barrel export to confirm `stepIcons` doesn't need re-exporting**

Run: `cat src/components/landing/process/index.ts`

It re-exports everything from `./icons` via `export * from './icons'`, so `stepIcons` is automatically available from `@/components/landing/process` if ever needed elsewhere. No change needed to the barrel file itself.

- [ ] **Step 4: Add the `index` prop and background icon to ProcessStepContent**

In `src/components/landing/process/ProcessStepContent.tsx`, update the imports and props interface:

```tsx
'use client'

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { Translations } from '@/i18n/types';
import { ProjectTypeBadge } from './ProjectTypeBadge';
import { stepIcons } from './icons';

const EASE = [0.32, 0.72, 0, 1] as const;

interface ProcessStepContentProps {
    step: Translations['landing']['process']['steps'][number];
    index: number;
    deliverablesLabel: string;
    outcomeLabel: string;
    badges: Translations['landing']['process']['badges'];
}

export function ProcessStepContent({ step, index, deliverablesLabel, outcomeLabel, badges }: ProcessStepContentProps) {
    const ref = useRef(null);
    const inView = useInView(ref, { amount: 0.15 });
    const reduced = useReducedMotion();
    const active = reduced ? true : inView;
    const StepIcon = stepIcons[index] ?? stepIcons[0];
```

Then find the return statement's opening (currently `<div ref={ref} className="max-w-[460px]">`) and replace it with a relatively-positioned wrapper that includes the background icon mark:

```tsx
    return (
        <div ref={ref} className="relative max-w-[460px]">
            <StepIcon
                size={130}
                className="pointer-events-none absolute -top-3 right-0 -z-10 text-brand-600/[0.07]"
            />
            <motion.h3 {...fadeUp(0)} className="font-display text-2xl font-semibold text-slate-900">
```

Leave the rest of the function body (everything after the `<motion.h3>` line) unchanged.

- [ ] **Step 5: Pass `index` from HowWeWorkSection**

In `src/components/landing/HowWeWorkSection.tsx`, find the `.map` rendering `ProcessStepContent` (around line 91-100):

```tsx
                        {process.steps.map((step, index) => (
                            <div key={step.title} ref={(el) => { contentRefs.current[index] = el; }}>
                                <ProcessStepContent
                                    step={step}
                                    deliverablesLabel={process.deliverablesLabel}
                                    outcomeLabel={process.outcomeLabel}
                                    badges={process.badges}
                                />
                            </div>
                        ))}
```

Add `index={index}` to the `ProcessStepContent` props:

```tsx
                        {process.steps.map((step, index) => (
                            <div key={step.title} ref={(el) => { contentRefs.current[index] = el; }}>
                                <ProcessStepContent
                                    step={step}
                                    index={index}
                                    deliverablesLabel={process.deliverablesLabel}
                                    outcomeLabel={process.outcomeLabel}
                                    badges={process.badges}
                                />
                            </div>
                        ))}
```

- [ ] **Step 6: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no new errors. (If `index` doesn't propagate correctly this will surface as a missing-prop error.)

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 7: Visual check**

Open the landing page, scroll through How We Work. Confirm: each step's content block has a large, very faint teal icon mark behind/beside its heading, and the icon matches that step (Discover/Design/Build/Launch in order), and it doesn't visually compete with the text.

- [ ] **Step 8: Commit**

```bash
git add src/components/landing/process/icons.tsx src/components/landing/process/ProcessTimeline.tsx src/components/landing/process/ProcessStepContent.tsx src/components/landing/HowWeWorkSection.tsx
git commit -m "Add tinted background step icon to How We Work content blocks"
```

---

### Task 4: Projects — browser-chrome frame

**Files:**
- Modify: `src/components/landing/ProjectsSection.tsx`

**Context:** The one real screenshot on the page is currently boxed in a plain `rounded-2xl` frame with a flat slate ring. We're wrapping it in a recognizable browser-chrome header (three neutral dots + a truncated-URL address-bar pill) so it reads as "a live product," and tinting the frame's ring/shadow teal instead of flat slate. The "Live" badge moves from the outer link to sit inside the image sub-container (since the outer container now also contains the chrome header).

- [ ] **Step 1: Replace the image frame markup**

Find the closing `motion.a` block in `src/components/landing/ProjectsSection.tsx` (currently lines 72-95):

```tsx
                    {/* Evidence — supports the story, never leads it */}
                    <motion.a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
                        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                        className="group relative mx-auto block aspect-[4/3] w-full max-h-[280px] max-w-[440px] overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/[0.08] soft-shadow lg:mx-0 lg:max-h-none"
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(min-width: 1024px) 440px, 100vw"
                            className="object-contain p-10"
                        />

                        {/* Squared "Live" marker — reachable, not pulsing (only circle on the page is It) */}
                        <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 backdrop-blur-sm">
                            <span className="inline-block h-1.5 w-1.5 rounded-[2px] bg-emerald-500" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{live}</span>
                        </div>
                    </motion.a>
```

Replace it with:

```tsx
                    {/* Evidence — supports the story, never leads it */}
                    <motion.a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
                        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
                        className="group relative mx-auto block w-full max-w-[440px] overflow-hidden rounded-2xl bg-white ring-1 ring-brand-600/[0.12] soft-shadow lg:mx-0"
                    >
                        {/* Browser-chrome header — reads "a live product," not a clipped image */}
                        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
                            <span className="ml-2 flex-1 truncate rounded-full bg-white px-3 py-1 text-[10px] text-slate-400 ring-1 ring-slate-200">
                                {project.url.replace(/^https?:\/\//, '')}
                            </span>
                        </div>

                        <div className="relative aspect-[4/3] max-h-[240px] w-full lg:max-h-none">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(min-width: 1024px) 440px, 100vw"
                                className="object-contain p-8"
                            />

                            {/* Squared "Live" marker — reachable, not pulsing (only circle on the page is It) */}
                            <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 backdrop-blur-sm">
                                <span className="inline-block h-1.5 w-1.5 rounded-[2px] bg-emerald-500" />
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{live}</span>
                            </div>
                        </div>
                    </motion.a>
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no new errors.

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 3: Visual check**

Open the landing page, scroll to Projects. Confirm: the screenshot now sits below a browser-chrome header bar (three neutral dots + truncated URL pill), the frame ring/shadow has a soft teal tint instead of flat slate, and the "Live" badge still sits over the top-right of the image itself.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/ProjectsSection.tsx
git commit -m "Frame Projects screenshot in browser chrome with teal-tinted ring"
```

---

### Task 5: FAQ — teal-tinted toggle icon

**Files:**
- Modify: `src/components/landing/FAQSection.tsx`

**Context:** The accordion's open-state toggle icon currently switches to `bg-slate-900 text-white` when open. This is the smallest change in the pass — just shift that open-state color to teal.

- [ ] **Step 1: Update the toggle icon's open-state class**

Find this line in `src/components/landing/FAQSection.tsx` (around line 38):

```tsx
                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center transition-all duration-300 ease-premium ${open ? 'bg-slate-900 text-white rotate-45 rounded-[4px]' : 'bg-slate-100 text-slate-500 rounded-[4px]'}`}>
```

Replace with:

```tsx
                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center transition-all duration-300 ease-premium ${open ? 'bg-brand-600 text-white rotate-45 rounded-[4px]' : 'bg-slate-100 text-slate-500 rounded-[4px]'}`}>
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no new errors.

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 3: Visual check**

Open the landing page, scroll to FAQ, open an item. Confirm: the toggle icon's open state is teal instead of black.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/FAQSection.tsx
git commit -m "Tint FAQ open-state toggle icon teal"
```

---

### Task 6: Full-page verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full build check**

Run: `npm run build`
Expected: build succeeds with no new errors or warnings introduced by Tasks 1-5.

- [ ] **Step 2: Full visual pass on the dev server**

Start `npm run dev`, load the landing page end to end. Confirm for each section:
- Services: three visually distinct tier icon chips (slate / teal / amber), teal-tinted pricing-factor tiles.
- Comparison: growth diagram visible above the table, growing/saturating left to right.
- How We Work: each step content block has its own faint colored icon mark.
- Projects: browser-chrome frame around the screenshot, teal-tinted ring.
- FAQ: teal toggle icon when an item is open.

- [ ] **Step 3: Confirm the story spine is untouched**

Open `src/components/landing/Navbar.tsx`, `HeroSection.tsx`, `ActCodeSection.tsx`, `ActGetSection.tsx`, `FooterSection.tsx`, and everything under `src/components/landing/it/` — confirm none of these files appear in `git diff main` for this work (only the five section files + the new diagram component + `process/icons.tsx` + `process/ProcessTimeline.tsx` should show changes).

Run: `git diff --stat main`

- [ ] **Step 4: Check `prefers-reduced-motion` is unaffected**

In the browser, enable "reduce motion" (OS-level or devtools emulation) and reload. Confirm Comparison's row animations and How We Work's existing reduced-motion paths (`useReducedMotion` in both files) still behave as before — none of Tasks 1-5 touched animation logic, only static color classes and one new static (non-animated) diagram, so this should be a no-op confirmation.
