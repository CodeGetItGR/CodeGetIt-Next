# Process section redesign — scroll-driven two-column layout

> Status: approved
> Date: 2026-06-13

## Problem

[HowWeWorkSection.tsx](../../../src/components/landing/HowWeWorkSection.tsx)
currently renders a static, alternating vertical timeline: four cards, each
with just a title and a one-sentence description, fading/rising into view
once via `useInView`. It doesn't communicate that the agency follows the same
proven process for every project, that deliverables scale with project
complexity, or that the process is something a client can trust to justify
pricing.

## Goal

Redesign the Process section (`id="process"`) into a scroll-driven,
two-column experience that:

- Keeps vertical scrolling as the only interaction (no carousels, no
  horizontal scroll, no scroll-jacking/pinning).
- Shows a sticky left-column timeline (step indicators + a progress line that
  fills continuously as the user scrolls) and a right column with full detail
  per step (description, deliverables, outcome).
- Communicates the same fixed 4-step process for every project
  (Planning & Understanding → Design & Architecture → Building & Testing →
  Launch & Support), with small `[All Projects]` / `[Web App+]` /
  `[Full-Stack]` badges on deliverables that only apply to certain project
  types.
- Stacks into a single, easy-to-scan column on mobile while preserving the
  visible timeline and scroll-driven emphasis.
- Stays within the existing premium/minimalist aesthetic: generous
  whitespace, soft shadows, rounded corners, neutral ink/slate palette, no
  teal (Law 1 — teal is reserved for "It").

## Non-goals

- No interactive project-type selector/filter. Badges are static,
  always-visible annotations — there is exactly one process, shown to
  everyone.
- No pinned/cross-fade "movie" scene (the Act II treatment in
  [ActCodeSection.tsx](../../../src/components/landing/ActCodeSection.tsx)).
  That pattern's scroll-jacking and `aria-hidden`/sr-only duplication are
  intentionally not reused here — all Process content stays in normal,
  accessible DOM flow.
- No changes to `ServicesSection`, `ComparisonSection`, or any other section
  beyond reusing their existing naming conventions ("Static Websites" / "Web
  Applications" / "Full-Stack Solutions" → `[All Projects]` / `[Web App+]` /
  `[Full-Stack]` badge tiers).
- No new global CSS tokens. Reuses `--ease-premium` (as the literal
  `[0.32, 0.72, 0, 1]` array, matching existing inline usage in
  `ComparisonSection`/`ServicesSection`), `.soft-shadow`, and the existing
  square-ink-tick / squared-chip visual language.

## Design

### 1. Layout (desktop, `lg:` / 1024px and up)

- Container widens from `max-w-5xl` to `max-w-6xl` (matching
  `ServicesSection`/`FooterSection`) to give the two-column layout room.
- `<div className="mt-16 lg:grid lg:grid-cols-12 lg:gap-12">`:
  - Left column: `lg:col-span-4 lg:sticky lg:top-28 lg:self-start` — the step
    timeline. `lg:top-28` (7rem) matches the navbar-clearance value already
    used as `scroll-mt-28` in `ServicesSection`. `lg:self-start` is required
    for `sticky` to work as a grid item.
  - Right column: `lg:col-span-8`, a `flex flex-col gap-12` of 4 content
    blocks, one per step.
- Each right-column block wrapper: `lg:min-h-[70vh] lg:flex lg:flex-col
  lg:justify-center` — on desktop each step "owns" roughly one viewport's
  worth of scroll and its content vertically centers as it becomes active,
  giving it a moment of focus. On mobile (`lg:` not active) blocks size to
  their content — no forced empty space.

### 2. Scroll mechanism — one source of truth

```ts
const sectionRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
const fillProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });

const [activeIndex, setActiveIndex] = useState(0);
useEffect(() => {
  const compute = (p: number) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
    setActiveIndex(next);
  };
  compute(scrollYProgress.get());
  return scrollYProgress.on('change', compute);
}, [scrollYProgress, steps.length]);
```

- `scrollYProgress` (0→1 across the whole section) is the single source of
  truth, following the same `useScroll`/`on('change', ...)` pattern already
  used in
  [ActCodeSection.tsx:401-416](../../../src/components/landing/ActCodeSection.tsx),
  without that file's pinning/stage-measurement machinery.
- **Progress line fill**: `fillProgress` (spring-smoothed) drives the line's
  `scaleY` (0→1, `transform-origin: top`) — continuous, not stepped.
- **Active step**: `activeIndex` is one of 4 equal buckets of
  `scrollYProgress`. Drives both the left-column step emphasis and the
  right-column block's `isActive` (opacity/translateY) state.
- **Click-to-navigate**: each left-column step indicator is a `<button>` that
  calls `contentRefs.current[index]?.scrollIntoView({ behavior: 'smooth',
  block: 'start' })`. The resulting scroll naturally updates
  `scrollYProgress` → `activeIndex`, so no separate "manually selected step"
  state is needed.
- Exact `min-h-[70vh]` pacing may need minor empirical adjustment once running
  in the browser, but the bucket math itself does not change.

### 3. Component hierarchy & files

- **`src/components/landing/HowWeWorkSection.tsx`** (rewritten) — orchestrator:
  owns `sectionRef`, `useScroll`/`useSpring`/`activeIndex` as above, plus a
  `contentRefs = useRef<(HTMLDivElement | null)[]>([])` array (one entry per
  right-column block, assigned via `ref={(el) => { contentRefs.current[index]
  = el; }}`) used by `handleStepClick` for `scrollIntoView`. Renders
  `SectionHeading`, the badge legend, and the two-column grid mapping over
  `process.steps`.
- **`src/components/landing/process/icons.tsx`** (new) — the existing
  `DiscoverIcon`/`DesignIcon`/`BuildIcon`/`LaunchIcon` (moved as-is from the
  current `HowWeWorkSection.tsx`), exported as `stepIcons`.
- **`src/components/landing/process/ProcessTimeline.tsx`** (new) — the sticky
  left column.
  ```ts
  interface ProcessTimelineProps {
    steps: { title: string }[];
    activeIndex: number;
    fillProgress: MotionValue<number>;
    onStepClick: (index: number) => void;
  }
  ```
  Renders the track line (`absolute left-5 top-5 bottom-5 w-0.5
  bg-slate-900/10`), the fill line (`scaleY` bound to `fillProgress`,
  `bg-slate-900`, `origin-top`), a small 6×6px filled-square "now" marker
  positioned via `fillProgress` (a square, not a circle — Law 2), and one
  button per step: icon chip (`rounded-2xl`, `h-10 w-10`) + squared number
  chip + title, with active/inactive styling driven by `index ===
  activeIndex`.
- **`src/components/landing/process/ProcessStepContent.tsx`** (new) — one
  right-column block.
  ```ts
  interface ProcessStepContentProps {
    step: Translations['landing']['process']['steps'][number];
    isActive: boolean;
    deliverablesLabel: string;
    outcomeLabel: string;
    badges: Translations['landing']['process']['badges'];
  }
  ```
  Renders the existing card shell (`rounded-[1.25rem] p-[6px] ring-1
  ring-slate-900/[0.06] soft-shadow`) containing title, description,
  deliverables list (square ink-tick bullets + optional `ProjectTypeBadge`),
  and the outcome line. `isActive` toggles
  `opacity-100 translate-y-0` vs `opacity-40 translate-y-1.5`
  (`transition-all duration-350`).
- **`src/components/landing/process/ProjectTypeBadge.tsx`** (new) —
  presentational badge.
  ```ts
  interface ProjectTypeBadgeProps {
    label: string;
    description: string;
    className?: string;
  }
  ```
  `<span title={description} className={cn('inline-flex items-center
  rounded-full px-2 py-0.5 text-[10px] font-medium uppercase
  tracking-[0.08em] text-slate-500 ring-1 ring-slate-900/10', className)}>`.
  Used both inline (deliverables list, with `className="ml-auto"`) and in the
  section-level badge legend (no extra class — same component, same look,
  so hovering the legend teaches the meaning of the inline badges).
- **`src/components/landing/process/index.ts`** (new) — barrel re-exporting
  `ProcessTimeline`, `ProcessStepContent`, `ProjectTypeBadge`, `stepIcons`.

### 4. Content structure & i18n

`Translations['landing']['process']` (in
[src/i18n/types.ts](../../../src/i18n/types.ts)) changes from
`{ eyebrow, title, description, steps: { title, description }[] }` to:

```ts
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

[src/i18n/locales/en.ts](../../../src/i18n/locales/en.ts) content
(`el.ts` is `export const el: Translations = en`, so this covers both
locales — no separate `el` edit needed):

```ts
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

The badge legend renders the three `badges` entries via `ProjectTypeBadge`
just below `SectionHeading`, centered:
`<div className="mt-6 flex flex-wrap items-center justify-center gap-2">`.

### 5. Motion specification

| Element | At rest | Active | Transition |
|---|---|---|---|
| Progress line fill | `scaleY: 0` | `scaleY: 1` (driven by `fillProgress`) | spring `{ stiffness: 300, damping: 40 }`, continuous |
| Step icon chip | `bg-slate-900/[0.05] text-slate-400`, `rounded-2xl` | `bg-slate-900 text-white` | `duration-300`, `ease: [0.32, 0.72, 0, 1]` |
| Step number chip | `bg-slate-200 text-slate-500` | `bg-slate-900 text-white` | same |
| Step title | `text-slate-400` | `text-slate-900 font-semibold` | same |
| Step icon "settle" | — | one `scale: [1, 1.06, 1]` on becoming active | `duration: 0.4`, `ease: [0.32, 0.72, 0, 1]`, not looping |
| Right-column block | `opacity-40 translate-y-1.5` | `opacity-100 translate-y-0` | `duration-350`, `ease: [0.32, 0.72, 0, 1]` |
| Step indicator hover | — | `hover:bg-slate-900/[0.03] rounded-xl` | `duration-200` |
| Section heading | fade-up once on first view (`useInView`, matching `ComparisonSection`) | — | `duration-600`, `delay-100`, `ease: [0.32, 0.72, 0, 1]` |

`prefers-reduced-motion` (via `useReducedMotion()`, as already used in
`ActCodeSection`):

- `fillProgress` is replaced by the raw `scrollYProgress` (no spring — instant,
  not animated).
- Every right-column block renders with `isActive` forced to `true`
  (`opacity-100 translate-y-0`, always).
- The icon "settle" `scale` animation is skipped entirely; active state is
  conveyed by color/weight only.
- `activeIndex` itself is **not** forced — the left-column highlighting
  continues to track scroll position even under reduced motion (it's a state
  swap, not a travel/animation effect), consistent with the global
  `transition-duration: 0.01ms !important` override in `globals.css`.

### 6. Responsive behavior (below `lg` / 1024px)

- The grid collapses to a single column; `lg:sticky`/`lg:col-span-*` simply
  don't apply.
- Each step renders as a full-width block: icon/number marker at the top-left,
  connecting line running down the left edge between markers (same structural
  idea as the *current* timeline, now carrying the full step content —
  description, deliverables with badges, outcome).
- The same `scrollYProgress`-driven line fill and `activeIndex`-driven
  opacity/translateY continue to apply — only the layout direction changes.
- `lg:min-h-[70vh]` is dropped on mobile so blocks size to content, keeping the
  section scannable.

### 7. Accessibility

- All content (all 4 steps, full deliverables, outcomes) is real, visible DOM
  at all times — `isActive`/inactive only changes opacity/transform, never
  `display`/`visibility`/`aria-hidden`. No sr-only duplication is needed
  (unlike `ActCodeSection`).
- Step indicator buttons are real `<button type="button">` elements with their
  step title as accessible text, so the timeline is keyboard- and
  screen-reader-navigable independent of scroll.
- `ProjectTypeBadge`'s `title` attribute exposes the badge definition on
  hover/focus.

## Files touched

- Rewritten: [src/components/landing/HowWeWorkSection.tsx](../../../src/components/landing/HowWeWorkSection.tsx)
- New: `src/components/landing/process/icons.tsx`
- New: `src/components/landing/process/ProcessTimeline.tsx`
- New: `src/components/landing/process/ProcessStepContent.tsx`
- New: `src/components/landing/process/ProjectTypeBadge.tsx`
- New: `src/components/landing/process/index.ts`
- Modified: [src/i18n/types.ts](../../../src/i18n/types.ts) — `landing.process` shape
- Modified: [src/i18n/locales/en.ts](../../../src/i18n/locales/en.ts) — `landing.process` content

## Revision (v2): Free layout, Continuous Choreography, enlarged rail, "It" travels

> Status: approved
> Date: 2026-06-13 (post Task 7 manual verification)

Manual verification of the v1 implementation (Tasks 1-6 above) showed the
right column reading as "a list of cards" rather than telling a story, and
the left-column timeline feeling small/tucked into a corner. This revision
keeps the v1 architecture (component split, i18n shape, scroll-progress
orchestration in `HowWeWorkSection.tsx`) but changes how `ProcessTimeline`
and `ProcessStepContent` render and animate. It supersedes §5's
"Right-column block" row and the dimensions baked into `ProcessTimeline.tsx`.

### Mechanism: Continuous Choreography (per-element, independent of `activeIndex`)

`ProcessStepContent` drops the card shell
(`rounded-[1.25rem] p-[6px] ring-1 ring-slate-900/[0.06] soft-shadow`) and the
whole-block `isActive` opacity/scale/blur toggle entirely. Content renders
directly in the free right column. Each step's content observes its own
viewport visibility (`useInView`, `amount: 0.5`, **not** `once: true` — it
re-triggers on re-entry) and, when in view, reveals its elements individually
via `opacity`/`translateY(14px → 0)`, staggered:

| Element | Delay |
|---|---|
| `h3` title | 0s |
| description | 0.07s |
| "Deliverables" heading | 0.14s |
| each deliverable `<li>` | 0.19s + 0.05s × index (up to 5 items → 0.39s) |
| outcome rule (line draw + "It" travel, see below) | starts 0.47s, duration 0.8s |
| outcome paragraph (fade/translate) | 0.47s |
| outcome paragraph text color brighten | 1.27s (when "It" lands) |

All translateY/opacity transitions: `duration: 0.45s`, `ease: [0.32, 0.72, 0,
1]` (existing `--ease-premium`). `activeIndex`/`fillProgress` are unchanged
and continue to drive **only** the rail (highlighting + progress line) — they
are no longer passed to `ProcessStepContent` (the `isActive` prop is
removed).

`prefers-reduced-motion`: all elements render in their final/revealed state
immediately (no stagger, no travel animation, `duration: 0`).

### "It" travels, draws the rule, settles as the Outcome's period

Above each step's Outcome paragraph, a thin rule (`h-2`, max-width matching
the content column) contains two layered elements:

- **Line**: a 1px horizontal ink line (`bg-slate-900/[0.14]`), `scaleX: 0 →
  1`, `transform-origin: left`.
- **"It"**: an 8px teal circle (`bg-brand-600` = `#0d9488`), starting at
  `left: 0%` (hidden, `scale: 0.4`, `opacity: 0`) and animating to `left:
  100%` (`scale: 1`, `opacity: 1`).

Both animate together — same `duration: 0.8s`, `delay: 0.47s`, `ease:
[0.32, 0.72, 0, 1]` — so "It" appears to draw the line as it travels left to
right, like a pen stroke. On arrival it stays at the right edge permanently
and gains a faint persistent halo: `box-shadow: 0 0 0 4px
rgba(13,148,136,0.12)`.

In the same beat "It" lands (delay `1.27s`, `duration: 0.4s`), the Outcome
paragraph's text color transitions from muted (`#94a3b8` / slate-400) to full
ink (`#0f172a` / slate-900) — "It" arriving visibly finalizes the outcome
text. The Outcome copy itself is unchanged (keeps its existing trailing
"."); "It" lives in the rule above the sentence, not inline in it. This
operationalizes Law 3 of `docs/creative-direction-it.md` ("Declarations never
end in a period glyph — 'It' is their period") as a micro-interaction.

### Enlarged rail (`ProcessTimeline.tsx`)

All dimensions scale up so the rail no longer feels "hidden in the top-left
corner." The "now" marker stays a small ink/slate filled square (Law 2 — the
only circle on the page is "It"; teal stays off the rail entirely) — only its
size grows.

| Element | v1 | v2 |
|---|---|---|
| Icon chip | `h-10 w-10 rounded-2xl` (40px / 16px radius) | `h-14 w-14 rounded-[1.25rem]` (56px / 20px radius) |
| Icon SVG size | 22px (hardcoded) | 26px (`icons.tsx` gains a `size?: number` prop, default 22, rail passes 26) |
| Step-number chip | `h-6 w-6 rounded-md text-[10px]` (24px) | `h-[30px] w-[30px] rounded-[9px] text-xs` (30px) |
| Title text | `text-sm` (14px) | `text-[15px]` |
| Button padding | `p-2` (8px) | `p-3.5` (14px) |
| Gap between rail steps | `gap-2` (8px) | `gap-4` (16px) |
| Track/fill/marker horizontal position | `left-7` (28px) | `left-[42px]` — recomputed: padding (14px) + half icon (28px) = 42px, so the line passes exactly through each icon chip's center |
| Track/fill vertical inset | `top-5 bottom-5` (20px) | `top-[42px] bottom-[42px]` — same 42px logic, so the line starts/ends at the first/last icon's center |
| "Now" marker | `h-2 w-2`, halo `shadow-[0_0_0_4px_rgba(15,23,42,0.08)]`, `markerTop: calc(1.25rem + v*(100% - 2.5rem))` | `h-2.5 w-2.5`, halo `shadow-[0_0_0_5px_rgba(15,23,42,0.08)]`, `markerTop: calc(42px + v*(100% - 84px))` |

Icon/number chip color states (active/inactive bg/text), the icon "settle"
pulse, and the title weight/color transition are unchanged from v1 — only
sizes change.

### Layout spacing (`HowWeWorkSection.tsx`)

The right column's `gap-12` (48px) between step blocks increases to `gap-28`
(112px), giving the free (no-card) layout room to breathe between steps —
each step now reads as its own editorial block rather than a list item. The
`lg:col-span-4` / `lg:col-span-8` rail/content split is unchanged; the
enlarged rail still fits comfortably within `lg:col-span-4` at `max-w-6xl`.

### Files touched (this revision)

- Modified: `src/components/landing/process/icons.tsx` — add `size?: number`
  prop (default 22) to each icon component.
- Modified: `src/components/landing/process/ProcessTimeline.tsx` — dimensions
  per table above.
- Modified: `src/components/landing/process/ProcessStepContent.tsx` —
  rewritten per "Mechanism" and "'It' travels" sections above; `isActive` prop
  removed.
- Modified: `src/components/landing/HowWeWorkSection.tsx` — `gap-12` →
  `gap-28`; stop passing `isActive` to `ProcessStepContent`.

No i18n/type changes — `Translations['landing']['process']` and
`en.ts`/`el.ts` content are unchanged.

## Testing

- Manual verification in the browser preview:
  - Scroll through the section: confirm the left-column progress line fills
    continuously (not in jumps), the active step's icon/number/title invert to
    ink, and the corresponding right-column block reaches full
    opacity/`translateY: 0` while neighboring blocks sit at ~40% opacity.
  - Click each of the 4 left-column step buttons and confirm the matching
    right-column block scrolls into view and becomes active.
  - Hover a deliverable badge (and a legend badge) and confirm the `title`
    tooltip shows the correct definition.
  - Resize below 1024px: confirm single-column stacked layout, timeline still
    visible inline per step, no `sticky` left column.
  - Emulate `prefers-reduced-motion: reduce`: confirm all 4 blocks render at
    full opacity with no translateY, the line fill has no spring lag, and no
    icon "settle" animation fires.
- `npx tsc --noEmit` passes with no new errors.
