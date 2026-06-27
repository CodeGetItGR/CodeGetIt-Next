# Landing page: color + content-accurate diagrams

> Status: approved design, ready for implementation plan.
> Scope: interior sections only (Services, Comparison, How We Work, Projects,
> FAQ). Does NOT touch the story spine — Navbar, HeroSection, ActCodeSection,
> ActGetSection, FooterSection, and the `it/` system stay exactly as documented
> in `docs/creative-direction-it.md`. Laws 1–4 still hold there.

## Problem

Feedback: the landing page reads "like a PDF" — flat, white, text-heavy,
almost no color or imagery outside the single teal "It" dot. The interior
sections (everything between the hero and the closing CTA) are the offenders:
white cards on white/near-white backgrounds, slate-on-slate icon chips, and
exactly one real image on the whole page (a small boxed project screenshot).

## Goals

- Bring noticeably more color into the interior sections, using the existing
  palette (brand teal scale, the amber already used for "featured", slate) —
  not a new color system.
- Add visual elements that are content-accurate: every new graphic must map
  directly to something the section is already saying. No decorative shapes,
  no stock photography, no generic illustration filler.
- Leave the "IT." story spine untouched — this is an interior-sections-only
  pass.

## Non-goals

- Changing the one-dot story, Laws 1–4, or anything in `it/`.
- Sourcing real photography or stock imagery.
- A full redesign of section layout/structure — this is a color + accent
  pass on existing structure, not a rebuild.

## Per-section changes

### 1. Services (`ServicesSection.tsx`)
- Icon chips (currently `bg-slate-100 text-slate-600` / `bg-slate-900/5`)
  become tier-colored: each of the 3 service tiers gets a distinct tint drawn
  from the existing palette (e.g. teal for the recommended tier — already
  partially done via `bg-brand-600/4` — extended to the icon chip itself;
  the other two tiers get a lighter slate-to-amber-adjacent treatment so they
  don't look identical to each other).
- Pricing-factor icon tiles (`FACTOR_ICONS`, currently uniform
  `bg-slate-100 text-slate-500`) pick up the same per-category tinting logic
  instead of one flat gray.

### 2. Comparison (`ComparisonSection.tsx`)
- New small diagram above the table: three connected nodes — Static → Web
  App → Full-Stack — with a connecting line that gradient-shifts from light
  to saturated teal left to right, visually reinforcing what the table
  already states in words (more capability = more color/weight). Renders
  above the desktop table and above the mobile matrix.
- This is the only genuinely new graphic element in the whole change; it
  must be inline SVG (no new image assets), sized small (a strip, not a
  hero), and rectilinear/flat in keeping with Law 2 outside the spine — it
  is decorative ink, not a second "It."

### 3. How We Work (`HowWeWorkSection.tsx` / `process/ProcessTimeline.tsx` / `process/ProcessStepContent.tsx`)
- Timeline (left column): no new graphic needed — it already encodes
  progress data (`fillProgress`, `activeIndex`) and the active step chip is
  already teal. Leave as-is, just confirm it doesn't get duplicated by the
  change below.
- Step content (right column, `ProcessStepContent.tsx`): currently plain
  text with no visual element. Add one large, softly-tinted version of that
  step's own icon (`DiscoverIcon` / `DesignIcon` / `BuildIcon` / `LaunchIcon`
  — already imported in `ProcessTimeline.tsx`, reused here) as a background
  mark behind/beside the step heading. No new icon shapes — reuse the
  existing per-step icon set, just rendered larger and tinted in the brand
  teal scale, low-opacity enough to stay a background mark rather than
  compete with the text. This gives each step a distinct colored visual
  identity as you scroll without inventing new artwork or attempting a
  mockup-style illustration (explicitly decided against — too much
  production effort for this pass).

### 4. Projects (`ProjectsSection.tsx`)
- Replace the plain rounded-box image frame with a browser-chrome frame
  (traffic-light dots + address-bar sliver) around the existing real
  screenshot, so it reads as "a live product" rather than a clipped image.
  No new image asset — same `project.image`, new frame chrome only.
- Frame ring/shadow picks up a soft teal tint instead of flat slate.

### 5. FAQ (`FAQSection.tsx`)
- Smallest change: the open-state toggle icon (currently
  `bg-slate-900 text-white` when open) shifts to a teal-tinted treatment.
  No new graphics — FAQ content is inherently textual.

## Constraints

- All color stays within the existing `brand-*` teal scale, the existing
  amber accent, and slate — no new hues introduced.
- No new image assets fetched or generated; the only pixel image on the page
  remains the existing project screenshot.
- The Comparison diagram is the only new SVG graphic; everything else is a
  re-tint of existing elements.
- Must not regress `prefers-reduced-motion` handling already present in these
  components (`useReducedMotion` usage in Comparison/HowWeWork).

## Testing / verification

- Visual check via dev server + preview tools: each of the 5 sections shows
  visibly more color than before, no regressions to existing interactions
  (hover/lock states in Services, accordion in FAQ, sticky timeline in How We
  Work, scroll-triggered animations).
- Confirm no teal/circle usage leaked onto the story spine components.

## Open follow-ups (explicitly deferred, not in this pass)

- User said "we'll see what we can add/change later" — this spec covers a
  first pass only. Additional sections or a second diagram pass can follow
  as a separate spec once this lands.
