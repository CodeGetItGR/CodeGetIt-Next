# Process Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the "Process" section (`HowWeWorkSection.tsx`, `id="process"`) into a scroll-driven, two-column experience — a sticky left-column timeline (continuous progress line + step indicators) and a right column with one detail block per step (description, deliverables with `[All Projects]`/`[Web App+]`/`[Full-Stack]` badges, outcome) — while preserving the existing premium/minimalist aesthetic.

**Architecture:** A new `src/components/landing/process/` folder holds the building blocks: `icons.tsx` (the four step icons, moved as-is), `ProjectTypeBadge.tsx` (the small presentational badge, reused for both the inline deliverable badges and the section-level legend), `ProcessTimeline.tsx` (the sticky left column — track line, spring-driven fill line, square "now" marker, and one button per step), and `ProcessStepContent.tsx` (one right-column detail block), re-exported via `process/index.ts`. `HowWeWorkSection.tsx` becomes the orchestrator: it owns `useScroll`/`useSpring`-derived `fillProgress`, `activeIndex` state (derived via `scrollYProgress.on('change', ...)`, mirroring the pattern in `ActCodeSection.tsx`), and a `contentRefs` array used for click-to-navigate `scrollIntoView`. The `landing.process` i18n shape gains `deliverablesLabel`, `outcomeLabel`, `badges`, and per-deliverable optional `badge` tags.

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4 (`cn()` via `clsx`/`tailwind-merge`), framer-motion (`useScroll`, `useSpring`, `useTransform`, `useReducedMotion`, `useInView`). No test framework exists in this repo (`package.json` has only `dev`/`build`/`start`/`lint`) — verification uses `npx tsc --noEmit`, `npm run lint`, and manual browser-preview checks per the spec's "Testing" section.

**Reference spec:** `docs/superpowers/specs/2026-06-13-process-section-redesign-design.md`

---

### Task 1: Update `landing.process` i18n type and content

**Files:**
- Modify: `src/i18n/types.ts:174-182`
- Modify: `src/i18n/locales/en.ts:602-624`

This task is independently verifiable: the current `HowWeWorkSection.tsx` only reads `step.title`/`step.description`, both of which remain in the new shape, so `npx tsc --noEmit` stays green after this task alone, before any component changes.

- [ ] **Step 1: Widen the `process` type in `src/i18n/types.ts`**

Modify `src/i18n/types.ts:174-182` — current:

```typescript
        process: {
            eyebrow: string;
            title: string;
            description: string;
            steps: Array<{
                title: string;
                description: string;
            }>;
        };
```

New:

```typescript
        process: {
            eyebrow: string;
            title: string;
            description: string;
            deliverablesLabel: string;
            outcomeLabel: string;
            badges: {
                allProjects: { label: string; description: string };
                webAppPlus: { label: string; description: string };
                fullStack: { label: string; description: string };
            };
            steps: Array<{
                title: string;
                description: string;
                deliverables: Array<{
                    label: string;
                    badge?: 'allProjects' | 'webAppPlus' | 'fullStack';
                }>;
                outcome: string;
            }>;
        };
```

- [ ] **Step 2: Replace the `process` content in `src/i18n/locales/en.ts`**

Modify `src/i18n/locales/en.ts:602-624` — current:

```typescript
        process: {
            eyebrow: 'Process',
            title: 'A simple process that keeps momentum high',
            description: 'We keep the work visible and the decisions clear so the project moves without feeling chaotic.',
            steps: [
                {
                    title: 'Planning & Understanding',
                    description: 'We get clear on business goals, audiences, requirements, and success criteria before any design work starts.',
                },
                {
                    title: 'Design & Architecture',
                    description: 'We shape the interface and technical plan together so the experience feels intentional and scalable.',
                },
                {
                    title: 'Building & Testing',
                    description: 'Development moves in focused iterations with testing, review, and feedback baked into each step.',
                },
                {
                    title: 'Launch & Support',
                    description: 'We ship, monitor, and support the project after launch so it keeps performing as the business grows.',
                },
            ],
        },
```

New:

```typescript
        process: {
            eyebrow: 'Process',
            title: 'A simple process that keeps momentum high',
            description: 'Every project follows the same proven path — what changes is the scope of work within each step.',
            deliverablesLabel: 'Deliverables',
            outcomeLabel: 'Outcome',
            badges: {
                allProjects: { label: 'All Projects', description: 'Applies to every project type' },
                webAppPlus: { label: 'Web App+', description: 'Web Applications and Full-Stack Solutions' },
                fullStack: { label: 'Full-Stack', description: 'Full-Stack Solutions only' },
            },
            steps: [
                {
                    title: 'Planning & Understanding',
                    description: 'We align on business goals, requirements, users, constraints, and success metrics before any design or development begins.',
                    deliverables: [
                        { label: 'Discovery Workshop' },
                        { label: 'Business Requirements' },
                        { label: 'User Research' },
                        { label: 'Technical Assessment' },
                        { label: 'Project Roadmap' },
                    ],
                    outcome: 'A clear project scope and execution plan.',
                },
                {
                    title: 'Design & Architecture',
                    description: 'We translate the brief into a concrete design direction and technical architecture — shaping the interface, the information structure, and, where relevant, the systems underneath it.',
                    deliverables: [
                        { label: 'UI/UX Design & Prototyping' },
                        { label: 'Design System' },
                        { label: 'API Design', badge: 'fullStack' },
                        { label: 'Database Design', badge: 'fullStack' },
                        { label: 'Infrastructure Planning', badge: 'fullStack' },
                    ],
                    outcome: 'A validated design direction and technical plan, scoped to the right level of complexity for your project.',
                },
                {
                    title: 'Building & Testing',
                    description: 'Development moves in focused iterations — features are built, integrated, and tested continuously, with regular check-ins to keep priorities aligned.',
                    deliverables: [
                        { label: 'Iterative Development Sprints' },
                        { label: 'Authentication', badge: 'webAppPlus' },
                        { label: 'Admin Dashboard', badge: 'webAppPlus' },
                        { label: 'Third-Party Integrations', badge: 'webAppPlus' },
                        { label: 'Quality Assurance & Testing' },
                    ],
                    outcome: 'A fully built, thoroughly tested product ready for launch.',
                },
                {
                    title: 'Launch & Support',
                    description: 'We deploy the project, set up the tools you need to track performance, and stay on hand afterward so it keeps working as your business grows.',
                    deliverables: [
                        { label: 'Deployment & Launch' },
                        { label: 'SEO Setup', badge: 'allProjects' },
                        { label: 'Analytics Setup', badge: 'allProjects' },
                        { label: 'Performance Monitoring' },
                        { label: 'Post-Launch Support Plan' },
                    ],
                    outcome: 'A live product, set up for visibility and growth, with a support plan in place.',
                },
            ],
        },
```

Note: `el.ts` is `export const el: Translations = en;` — a full alias, so no separate edit is needed for the Greek locale.

- [ ] **Step 3: Type-check**

Run:

```
npx tsc --noEmit
```

Expected: completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/types.ts src/i18n/locales/en.ts
git commit -m "Expand landing.process i18n shape with deliverables, outcomes, and project-type badges"
```

---

### Task 2: Create `process/icons.tsx` and `process/ProjectTypeBadge.tsx`

**Files:**
- Create: `src/components/landing/process/icons.tsx`
- Create: `src/components/landing/process/ProjectTypeBadge.tsx`

Both files are small, self-contained, and have no dependencies on each other or on Task 1 — safe to build and verify together.

- [ ] **Step 1: Create `src/components/landing/process/icons.tsx`**

Move the four step icons out of `HowWeWorkSection.tsx` as-is, exporting each function and a `stepIcons` array:

```typescript
// Ultra-light Phosphor-style step icons
export function DiscoverIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v3l2 2" />
    </svg>
  );
}
export function DesignIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
export function BuildIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
export function LaunchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2 15 22 11 13 2 9l20-7z" />
    </svg>
  );
}

export const stepIcons = [DiscoverIcon, DesignIcon, BuildIcon, LaunchIcon];
```

- [ ] **Step 2: Create `src/components/landing/process/ProjectTypeBadge.tsx`**

```typescript
import { cn } from '@/lib/utils';

interface ProjectTypeBadgeProps {
    label: string;
    description: string;
    className?: string;
}

export function ProjectTypeBadge({ label, description, className }: ProjectTypeBadgeProps) {
    return (
        <span
            title={description}
            className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500 ring-1 ring-slate-900/10',
                className,
            )}
        >
            {label}
        </span>
    );
}
```

- [ ] **Step 3: Type-check**

Run:

```
npx tsc --noEmit
```

Expected: completes with no errors. (These files are not imported anywhere yet — this just confirms they compile standalone.)

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/process/icons.tsx src/components/landing/process/ProjectTypeBadge.tsx
git commit -m "Add process step icons and ProjectTypeBadge primitives"
```

---

### Task 3: Create `process/ProcessTimeline.tsx`

**Files:**
- Create: `src/components/landing/process/ProcessTimeline.tsx`

Depends on Task 2 (`stepIcons` from `./icons`).

- [ ] **Step 1: Create `src/components/landing/process/ProcessTimeline.tsx`**

```tsx
'use client'

import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { stepIcons } from './icons';

interface ProcessTimelineProps {
    steps: { title: string }[];
    activeIndex: number;
    fillProgress: MotionValue<number>;
    onStepClick: (index: number) => void;
}

export function ProcessTimeline({ steps, activeIndex, fillProgress, onStepClick }: ProcessTimelineProps) {
    const reduced = useReducedMotion();
    const markerTop = useTransform(fillProgress, (v) => `calc(1.25rem + ${v} * (100% - 2.5rem))`);

    return (
        <div className="relative">
            {/* Track line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-900/10" aria-hidden="true" />
            {/* Fill line — continuous, spring-smoothed scaleY from the orchestrator */}
            <motion.div
                className="absolute left-5 top-5 bottom-5 w-0.5 origin-top bg-slate-900"
                style={{ scaleY: fillProgress }}
                aria-hidden="true"
            />
            {/* "Now" marker — a small filled square, not a circle (Law 2: the only circle is It) */}
            <motion.div
                className="absolute left-5 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-slate-900"
                style={{ top: markerTop }}
                aria-hidden="true"
            />

            <div className="flex flex-col gap-2">
                {steps.map((step, index) => {
                    const Icon = stepIcons[index] ?? stepIcons[0];
                    const isActive = index === activeIndex;

                    return (
                        <button
                            key={step.title}
                            type="button"
                            onClick={() => onStepClick(index)}
                            className="group relative z-10 flex items-center gap-4 rounded-xl p-2 text-left transition-colors duration-200 hover:bg-slate-900/[0.03]"
                        >
                            <motion.span
                                animate={{ scale: isActive && !reduced ? [1, 1.06, 1] : 1 }}
                                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-900/[0.05] text-slate-400',
                                )}
                            >
                                <Icon />
                            </motion.span>

                            <span
                                className={cn(
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500',
                                )}
                            >
                                {index + 1}
                            </span>

                            <span
                                className={cn(
                                    'text-sm transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'font-semibold text-slate-900' : 'text-slate-400',
                                )}
                            >
                                {step.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
```

Notes:
- The icon chip is `rounded-2xl` (not `rounded-full`) and the "now" marker is a 6×6px filled square — both per Law 2 ("the only circle on the page is It").
- The icon "settle" animation (`scale: [1, 1.06, 1]`, once, not looping) is gated on this component's own `useReducedMotion()` call rather than a prop, keeping `ProcessTimelineProps` exactly as specified in the spec.
- The `left-5`/`top-5`/`bottom-5` offsets approximate the track running through the center of the `h-10 w-10` icon chips given the button's `p-2` padding. Task 7's manual verification may call for a small numeric nudge here once viewed in the browser — the spec itself notes this kind of pacing may need empirical adjustment.

- [ ] **Step 2: Type-check**

Run:

```
npx tsc --noEmit
```

Expected: completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/process/ProcessTimeline.tsx
git commit -m "Add ProcessTimeline sticky left-column step nav with scroll-driven progress line"
```

---

### Task 4: Create `process/ProcessStepContent.tsx`

**Files:**
- Create: `src/components/landing/process/ProcessStepContent.tsx`

Depends on Task 1 (new `Translations['landing']['process']` shape) and Task 2 (`ProjectTypeBadge`).

- [ ] **Step 1: Create `src/components/landing/process/ProcessStepContent.tsx`**

```tsx
import type { Translations } from '@/i18n/types';
import { cn } from '@/lib/utils';
import { ProjectTypeBadge } from './ProjectTypeBadge';

interface ProcessStepContentProps {
    step: Translations['landing']['process']['steps'][number];
    isActive: boolean;
    deliverablesLabel: string;
    outcomeLabel: string;
    badges: Translations['landing']['process']['badges'];
}

export function ProcessStepContent({ step, isActive, deliverablesLabel, outcomeLabel, badges }: ProcessStepContentProps) {
    return (
        <div
            className={cn(
                'rounded-[1.25rem] p-[6px] ring-1 ring-slate-900/[0.06] soft-shadow transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-40',
            )}
        >
            <div className="rounded-[calc(1.25rem-6px)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:p-8">
                <h3 className="font-display text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-slate-500">{step.description}</p>

                <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {deliverablesLabel}
                </h4>
                <ul className="mt-3 space-y-2.5">
                    {step.deliverables.map((deliverable) => (
                        <li key={deliverable.label} className="flex items-center gap-2.5 text-sm text-slate-600">
                            {/* square ink tick — a filled circle would counterfeit It */}
                            <span className="h-[5px] w-[5px] shrink-0 bg-slate-300" />
                            <span>{deliverable.label}</span>
                            {deliverable.badge && (
                                <ProjectTypeBadge
                                    label={badges[deliverable.badge].label}
                                    description={badges[deliverable.badge].description}
                                    className="ml-auto"
                                />
                            )}
                        </li>
                    ))}
                </ul>

                <p className="mt-6 border-t border-slate-900/[0.06] pt-4 text-sm text-slate-900">
                    <span className="font-semibold text-slate-400">{outcomeLabel}: </span>
                    {step.outcome}
                </p>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Type-check**

Run:

```
npx tsc --noEmit
```

Expected: completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/process/ProcessStepContent.tsx
git commit -m "Add ProcessStepContent right-column detail block with deliverable badges"
```

---

### Task 5: Create `process/index.ts` barrel

**Files:**
- Create: `src/components/landing/process/index.ts`

Depends on Tasks 2-4 (all four files must exist).

- [ ] **Step 1: Create `src/components/landing/process/index.ts`**

```typescript
export * from './icons'
export * from './ProcessStepContent'
export * from './ProcessTimeline'
export * from './ProjectTypeBadge'
```

- [ ] **Step 2: Type-check**

Run:

```
npx tsc --noEmit
```

Expected: completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/process/index.ts
git commit -m "Add barrel export for process section components"
```

---

### Task 6: Rewrite `HowWeWorkSection.tsx` as the scroll-driven orchestrator

**Files:**
- Modify: `src/components/landing/HowWeWorkSection.tsx`

Depends on Task 1 (i18n shape) and Task 5 (`process` barrel).

- [ ] **Step 1: Replace the entire contents of `src/components/landing/HowWeWorkSection.tsx`**

Current content (110 lines — static alternating timeline with inline icon definitions) is replaced entirely with:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useLocale } from '@/i18n/UseLocale';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { Whisper } from './it';
import { ProcessStepContent, ProcessTimeline, ProjectTypeBadge } from './process';

export function HowWeWorkSection() {
    const ref      = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const { t }    = useLocale();
    const process  = t.landing.process;
    const reduced  = useReducedMotion();

    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
    const springProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
    const fillProgress = reduced ? scrollYProgress : springProgress;

    const [activeIndex, setActiveIndex] = useState(0);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const compute = (p: number) => {
            const next = Math.min(process.steps.length - 1, Math.max(0, Math.floor(p * process.steps.length)));
            setActiveIndex(next);
        };
        compute(scrollYProgress.get());
        return scrollYProgress.on('change', compute);
    }, [scrollYProgress, process.steps.length]);

    const handleStepClick = (index: number) => {
        contentRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section ref={ref} id="process" className="px-6 py-28">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                >
                    <SectionHeading eyebrow={process.eyebrow} title={process.title} description={process.description} />
                </motion.div>

                {/* Badge legend — same component as the inline deliverable badges, so hovering here teaches their meaning */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <ProjectTypeBadge label={process.badges.allProjects.label} description={process.badges.allProjects.description} />
                    <ProjectTypeBadge label={process.badges.webAppPlus.label} description={process.badges.webAppPlus.description} />
                    <ProjectTypeBadge label={process.badges.fullStack.label} description={process.badges.fullStack.description} />
                </div>

                <div ref={sectionRef} className="mt-16 lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left column: sticky step timeline. On mobile this sits in normal flow above the content stack. */}
                    <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
                        <ProcessTimeline
                            steps={process.steps}
                            activeIndex={activeIndex}
                            fillProgress={fillProgress}
                            onStepClick={handleStepClick}
                        />
                    </div>

                    {/* Right column: one detail block per step */}
                    <div className="mt-12 flex flex-col gap-12 lg:col-span-8 lg:mt-0">
                        {process.steps.map((step, index) => (
                            <div
                                key={step.title}
                                ref={(el) => { contentRefs.current[index] = el; }}
                                className="lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center"
                            >
                                <ProcessStepContent
                                    step={step}
                                    isActive={reduced ? true : index === activeIndex}
                                    deliverablesLabel={process.deliverablesLabel}
                                    outcomeLabel={process.outcomeLabel}
                                    badges={process.badges}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Whisper text={t.landing.whispers.process} className="mt-14" />
            </div>
        </section>
    );
}
```

Notes:
- Container width changes from `max-w-5xl` to `max-w-6xl`, matching `ServicesSection`/`FooterSection`.
- The section heading fade-up (`isInView`/`motion.div`, `duration-600`/`delay-100`/`ease-premium`) matches the pattern in `ComparisonSection.tsx`.
- `sectionRef` is attached to the two-column grid (not the outer `<section>`) so `scrollYProgress` measures progress across exactly the timeline + content area.
- On screens below `lg` (1024px), `lg:grid`/`lg:sticky`/`lg:col-span-*` don't apply, so the grid collapses to a single column: `ProcessTimeline` renders once at the top (still receiving `fillProgress`/`activeIndex`, so the line fill and active-step highlighting remain visible and scroll-driven), followed by the four `ProcessStepContent` blocks stacked below. `lg:min-h-[70vh]` is dropped on mobile so blocks size to content.
- Under `prefers-reduced-motion: reduce`, `fillProgress` becomes the raw `scrollYProgress` (no spring lag) and every `ProcessStepContent` renders with `isActive` forced to `true` (full opacity, no translateY). `activeIndex` itself is not forced, so the left-column highlighting still tracks scroll position.

- [ ] **Step 2: Type-check and lint**

Run:

```
npx tsc --noEmit
npm run lint
```

Expected: both complete with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/HowWeWorkSection.tsx
git commit -m "Redesign Process section as scroll-driven two-column timeline + detail layout"
```

---

### Task 7: Manual verification in the browser preview

**Files:** none (verification only — no commit for this task)

- [ ] **Step 1: Start the dev server (or reuse a running one) and open the landing page**

- [ ] **Step 2: Desktop scroll behavior (≥1024px)**

Scroll through the Process section and confirm:
- The left-column progress line fills continuously (not in discrete jumps) as you scroll.
- The active step's icon chip inverts to `bg-slate-900 text-white`, its number chip inverts to `bg-slate-900 text-white`, and its title becomes `text-slate-900 font-semibold` — while the other three steps stay in their dim/inactive styling.
- The right-column block matching the active step reaches `opacity-100`/`translate-y-0`; neighboring blocks sit at roughly `opacity-40`/`translate-y-1.5`.
- The left column stays pinned (`sticky`) while the right column scrolls underneath it.

If the track/fill/"now" marker in `ProcessTimeline.tsx` doesn't visually line up with the icon chips, adjust the `left-5`/`top-5`/`bottom-5` values (and the `markerTop` calc in Task 3) until it does.

- [ ] **Step 3: Click-to-navigate**

Click each of the 4 left-column step buttons in turn and confirm the matching right-column block smooth-scrolls into view (`block: 'start'`) and becomes the active/highlighted step.

- [ ] **Step 4: Badge tooltips**

Hover a deliverable badge (e.g. "API Design [Full-Stack]" in Step 2) and confirm the native `title` tooltip shows the badge's `description` text. Repeat for one of the three legend badges below the section heading.

- [ ] **Step 5: Responsive layout (<1024px)**

Resize the viewport below 1024px and confirm:
- The grid collapses to a single column.
- `ProcessTimeline` renders as a full-width block above the four content blocks, with no `sticky` positioning.
- Each of the 4 content blocks is fully visible and scannable (no `min-h-[70vh]` empty space).
- The progress line fill and active-step highlighting continue to update as you scroll.

- [ ] **Step 6: Reduced motion**

Emulate `prefers-reduced-motion: reduce` (e.g. via browser dev tools rendering emulation) and reload. Confirm:
- All 4 right-column blocks render at full opacity with no `translateY` offset, regardless of scroll position.
- The progress line fill tracks scroll position with no spring lag (instant).
- No icon "settle" `scale` pulse fires when a step becomes active.
- The left-column active-step highlighting (icon/number/title color) still updates as you scroll.

---

## Self-Review

**Spec coverage:**
- Layout (`max-w-6xl`, `lg:grid lg:grid-cols-12 lg:gap-12`, sticky `lg:col-span-4 lg:top-28 lg:self-start` left column, `lg:col-span-8` right column, `lg:min-h-[70vh] lg:flex lg:flex-col lg:justify-center` per block) → Task 6 Step 1.
- Scroll mechanism (`sectionRef`, `useScroll`/`useSpring`, `activeIndex` via `scrollYProgress.on('change', ...)`, click-to-navigate via `contentRefs`/`scrollIntoView`) → Task 6 Step 1.
- Component hierarchy (`process/icons.tsx`, `ProcessTimeline.tsx`, `ProcessStepContent.tsx`, `ProjectTypeBadge.tsx`, `process/index.ts`, rewritten `HowWeWorkSection.tsx`) → Tasks 2-6.
- i18n content/type changes (`deliverablesLabel`, `outcomeLabel`, `badges`, per-deliverable `badge`, all 4 steps' deliverables/outcomes) → Task 1.
- Badge legend below `SectionHeading` reusing `ProjectTypeBadge` → Task 6 Step 1.
- Motion spec (progress line spring, icon/number/title chip transitions, icon "settle" pulse, right-column block opacity/translateY, indicator hover, section heading fade-up) → Task 3 Step 1 (timeline chips + settle), Task 4 Step 1 (block opacity/translateY), Task 6 Step 1 (heading fade-up).
- `prefers-reduced-motion` behavior (raw `scrollYProgress` instead of spring, `isActive` forced true, no icon settle, `activeIndex` not forced) → Task 6 Step 1 (`fillProgress`/`isActive`), Task 3 Step 1 (`useReducedMotion()` gating the settle animation).
- Responsive behavior (<1024px single column, timeline visible, no sticky, no forced `min-h`) → Task 6 Step 1 notes, verified in Task 7 Step 5.
- Accessibility (real DOM at all times, no `aria-hidden` on content, `<button type="button">` step indicators, `title` on badges) → Task 3 Step 1 (buttons), Task 4 Step 1 (no hidden content), Task 2 Step 2 (`title` attribute).
- Non-goals respected: no project-type filter/selector (badges are static), no pinned/cross-fade scene, no changes to `ServicesSection`/`ComparisonSection`, no new global CSS tokens (`--ease-premium` reused as the literal `[0.32, 0.72, 0, 1]` array, `.soft-shadow` reused, square ink-tick bullets reused).

**Placeholder scan:** No TBD/TODO; every step has complete code or exact commands. The one open-ended note (track/marker alignment nudge in Task 3/Task 7) is a calibration check, not an unimplemented requirement — the spec itself calls out that this pacing "may need minor empirical adjustment."

**Type consistency:** `Translations['landing']['process']` (Task 1) defines `deliverablesLabel`, `outcomeLabel`, `badges: {allProjects, webAppPlus, fullStack}`, and `steps[].deliverables[].badge?: 'allProjects' | 'webAppPlus' | 'fullStack'`. `ProcessStepContentProps` (Task 4) uses `step: Translations['landing']['process']['steps'][number]` and `badges: Translations['landing']['process']['badges']` directly, and indexes `badges[deliverable.badge]` using the same literal union. `ProjectTypeBadgeProps` (`label`, `description`, `className?`, Task 2) matches every call site: inline (`ml-auto`, Task 4) and legend (no extra class, Task 6). `ProcessTimelineProps` (`steps: {title: string}[]`, `activeIndex: number`, `fillProgress: MotionValue<number>`, `onStepClick: (index: number) => void`, Task 3) matches the call in Task 6 (`process.steps`, `activeIndex`, `fillProgress`, `handleStepClick`). `stepIcons` (Task 2) is consumed by index in `ProcessTimeline` (Task 3) exactly as in the original `HowWeWorkSection.tsx`.

---

## Revision (v2): Free layout, Continuous Choreography, enlarged rail, "It" travels

Per `docs/superpowers/specs/2026-06-13-process-section-redesign-design.md` § "Revision (v2)". Supersedes the dimensions/markup baked into `ProcessTimeline.tsx` and the card/`isActive` shell of `ProcessStepContent.tsx` from Tasks 3-6 above. No i18n/type changes.

### Task 8: Add `size` prop to step icons

**Files:**
- Modify: `src/components/landing/process/icons.tsx`

- [ ] **Step 1: Add an optional `size` prop (default 22) to each icon, replacing the hardcoded `width="22" height="22"`**

```tsx
// Ultra-light Phosphor-style step icons
interface IconProps {
  size?: number;
}
export function DiscoverIcon({ size = 22 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v3l2 2" />
    </svg>
  );
}
export function DesignIcon({ size = 22 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
export function BuildIcon({ size = 22 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
export function LaunchIcon({ size = 22 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2 15 22 11 13 2 9l20-7z" />
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/process/icons.tsx
git commit -m "feat: add size prop to process step icons"
```

### Task 9: Enlarge the rail in `ProcessTimeline.tsx`

**Files:**
- Modify: `src/components/landing/process/ProcessTimeline.tsx`

- [ ] **Step 1: Replace the component body with the enlarged dimensions (56px icon chips, 30px number chips, 15px titles, 14px button padding, 16px step gap, track/fill/marker re-centered on the 42px icon-center offset)**

```tsx
'use client'

import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BuildIcon, DesignIcon, DiscoverIcon, LaunchIcon } from './icons';

const stepIcons = [DiscoverIcon, DesignIcon, BuildIcon, LaunchIcon];

interface ProcessTimelineProps {
    steps: { title: string }[];
    activeIndex: number;
    fillProgress: MotionValue<number>;
    onStepClick: (index: number) => void;
}

export function ProcessTimeline({ steps, activeIndex, fillProgress, onStepClick }: ProcessTimelineProps) {
    const reduced = useReducedMotion();
    // Icon-center offset = button padding (14px) + half of the 56px icon chip (28px) = 42px, both axes.
    const markerTop = useTransform(fillProgress, (v) => `calc(42px + ${v} * (100% - 84px))`);

    return (
        <div className="relative">
            {/* Track line — centered through the 56px icon chips */}
            <div className="absolute left-[42px] top-[42px] bottom-[42px] w-px bg-slate-900/10" aria-hidden="true" />
            {/* Fill line — continuous, spring-smoothed scaleY from the orchestrator */}
            <motion.div className="absolute left-[42px] top-[42px] bottom-[42px] w-px origin-top bg-slate-900" style={{ scaleY: fillProgress }} aria-hidden="true" />
            {/* "Now" marker — a small filled square with a soft halo, not a circle (Law 2: the only circle is It) */}
            <motion.div className="absolute left-[42px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 bg-slate-900 shadow-[0_0_0_5px_rgba(15,23,42,0.08)]" style={{ top: markerTop }} aria-hidden="true" />
            <div className="flex flex-col gap-4">
                {steps.map((step, index) => {
                    const Icon = stepIcons[index] ?? stepIcons[0];
                    const isActive = index === activeIndex;
                    return (
                        <motion.button key={step.title} type="button" onClick={() => onStepClick(index)} whileTap={{ scale: 0.98 }}
                            className="group relative z-10 flex items-center gap-4 rounded-xl p-3.5 text-left transition-colors duration-200 hover:bg-slate-900/[0.03]">
                            {/* Opaque chip hides the line behind it, so the line reads as a string of nodes rather than piercing through */}
                            <motion.span animate={{ scale: isActive && !reduced ? [1, 1.08, 1] : 1 }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                    isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 ring-1 ring-slate-900/[0.06]')}>
                                <Icon size={26} />
                            </motion.span>
                            <span className={cn('flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-xs font-bold transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400')}>
                                {index + 1}
                            </span>
                            <span className={cn('text-[15px] transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                                isActive ? 'font-semibold text-slate-900' : 'text-slate-400')}>
                                {step.title}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/process/ProcessTimeline.tsx
git commit -m "feat: enlarge process timeline rail"
```

### Task 10: Rewrite `ProcessStepContent.tsx` — free layout, Continuous Choreography, "It" travels

**Files:**
- Modify: `src/components/landing/process/ProcessStepContent.tsx`

- [ ] **Step 1: Replace the whole file — drop the card shell and `isActive` prop; add per-element `useInView`-driven reveal and the traveling-dot outcome rule**

```tsx
'use client'

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { Translations } from '@/i18n/types';
import { ProjectTypeBadge } from './ProjectTypeBadge';

const EASE = [0.32, 0.72, 0, 1] as const;

interface ProcessStepContentProps {
    step: Translations['landing']['process']['steps'][number];
    deliverablesLabel: string;
    outcomeLabel: string;
    badges: Translations['landing']['process']['badges'];
}

export function ProcessStepContent({ step, deliverablesLabel, outcomeLabel, badges }: ProcessStepContentProps) {
    const ref = useRef(null);
    const inView = useInView(ref, { amount: 0.5 });
    const reduced = useReducedMotion();
    const active = reduced ? true : inView;

    const fadeUp = (delay: number) => ({
        initial: reduced ? false : { opacity: 0, y: 14 },
        animate: { opacity: active ? 1 : 0, y: active ? 0 : 14 },
        transition: { duration: reduced ? 0 : 0.45, ease: EASE, delay: reduced ? 0 : delay },
    });

    return (
        <div ref={ref} className="max-w-[460px]">
            <motion.h3 {...fadeUp(0)} className="font-display text-2xl font-semibold text-slate-900">
                {step.title}
            </motion.h3>
            <motion.p {...fadeUp(0.07)} className="mt-3 text-sm leading-7 text-slate-500">
                {step.description}
            </motion.p>
            <motion.h4 {...fadeUp(0.14)} className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {deliverablesLabel}
            </motion.h4>
            <ul className="mt-3.5 space-y-2.5">
                {step.deliverables.map((deliverable, index) => (
                    <motion.li key={deliverable.label} {...fadeUp(0.19 + index * 0.05)} className="flex items-center gap-2.5 text-sm text-slate-600">
                        {/* square ink tick — a filled circle would counterfeit It */}
                        <span className="h-[5px] w-[5px] shrink-0 bg-slate-300" />
                        <span>{deliverable.label}</span>
                        {deliverable.badge && (
                            <ProjectTypeBadge label={badges[deliverable.badge].label} description={badges[deliverable.badge].description} className="ml-auto" />
                        )}
                    </motion.li>
                ))}
            </ul>
            {/* "It" travels left-to-right, drawing the rule behind it, then settles as the Outcome's period */}
            <div className="relative mt-6 mb-3.5 h-2">
                <motion.span
                    className="absolute top-1/2 left-0 h-px w-full origin-left -translate-y-1/2 bg-slate-900/[0.14]"
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: active ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.8, ease: EASE, delay: reduced ? 0 : 0.47 }}
                />
                <motion.span
                    className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600"
                    initial={reduced ? false : { left: '0%', opacity: 0, scale: 0.4, boxShadow: '0 0 0 0 rgba(13,148,136,0)' }}
                    animate={active
                        ? { left: '100%', opacity: 1, scale: 1, boxShadow: '0 0 0 4px rgba(13,148,136,0.12)' }
                        : { left: '0%', opacity: 0, scale: 0.4, boxShadow: '0 0 0 0 rgba(13,148,136,0)' }}
                    transition={reduced ? { duration: 0 } : {
                        left: { duration: 0.8, ease: EASE, delay: 0.47 },
                        opacity: { duration: 0.25, delay: 0.47 },
                        scale: { duration: 0.25, delay: 0.47 },
                        boxShadow: { duration: 0.4, delay: 1.27 },
                    }}
                />
            </div>
            <motion.p
                initial={reduced ? false : { opacity: 0, y: 14, color: '#94a3b8' }}
                animate={{ opacity: active ? 1 : 0, y: active ? 0 : 14, color: active ? '#0f172a' : '#94a3b8' }}
                transition={reduced ? { duration: 0 } : {
                    opacity: { duration: 0.45, ease: EASE, delay: 0.47 },
                    y: { duration: 0.45, ease: EASE, delay: 0.47 },
                    color: { duration: 0.4, delay: 1.27 },
                }}
                className="text-sm leading-7"
            >
                <span className="font-semibold text-slate-400">{outcomeLabel}: </span>
                {step.outcome}
            </motion.p>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/process/ProcessStepContent.tsx
git commit -m "feat: rewrite process step content with continuous choreography"
```

### Task 11: Update `HowWeWorkSection.tsx` spacing and stop passing `isActive`

**Files:**
- Modify: `src/components/landing/HowWeWorkSection.tsx`

- [ ] **Step 1: Increase the right-column gap from `gap-12` to `gap-28`, and stop passing `isActive` to `ProcessStepContent`**

In the right-column container, change:

```tsx
<div className="mt-12 flex flex-col gap-12 lg:col-span-8 lg:mt-0">
```

to:

```tsx
<div className="mt-12 flex flex-col gap-28 lg:col-span-8 lg:mt-0">
```

And change the `ProcessStepContent` call from:

```tsx
<ProcessStepContent step={step} isActive={reduced ? true : index === activeIndex} deliverablesLabel={process.deliverablesLabel} outcomeLabel={process.outcomeLabel} badges={process.badges} />
```

to:

```tsx
<ProcessStepContent step={step} deliverablesLabel={process.deliverablesLabel} outcomeLabel={process.outcomeLabel} badges={process.badges} />
```

`activeIndex`/`fillProgress`/`scrollYProgress` and the `reduced` flag are still used elsewhere in the file (rail + spring config), so leave the rest of the file unchanged.

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/HowWeWorkSection.tsx
git commit -m "feat: adjust process section spacing for free layout"
```

### Task 12: Type-check, lint, and preview

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 3: Manual browser verification**

Start the dev server, open the Process section, and confirm:
- The rail renders larger, with the track/fill/"now" marker passing exactly through each icon chip's center.
- Scrolling each step's content into view (≥50% visible) triggers its title → description → "Deliverables" → each deliverable → outcome-rule → outcome paragraph reveal, staggered as specified; scrolling back out and back in re-triggers it.
- The teal "It" dot travels left→right across the outcome rule, drawing the line behind it, settles at the right edge with a faint halo, and the Outcome paragraph brightens to full ink in the same beat.
- The Outcome sentence still ends with its literal "." — "It" lives in the rule above, not inline.
- With `prefers-reduced-motion: reduce` emulated, everything renders in its final state immediately (no stagger, no travel, no reveal animation), and the rail's progress line/marker still track scroll position (using raw `scrollYProgress`, not the spring).
- Responsive (<1024px): single-column layout still reads correctly, rail not sticky.
