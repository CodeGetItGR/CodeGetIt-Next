# Creative Direction — "IT." (a one-dot story)

> Status: active art-direction contract for the landing experience.
> Supersedes the previous direction (see `creative-direction.md`, retired).

## The concept

The name is secretly a sentence with three acts: **you bring it, we code it, you get it.**
"It" — the client's unnamed idea — is made literal as the page's single teal dot.
The dot is the only colored object in the world. It travels the page as living
punctuation: it is lent by the logo, it serves as the period of every act
declaration, it hops down the list of what we build, and it finally docks inside
the closing CTA — the handover. The footer wordmark is left permanently dotless,
captioned *"(you have it now.)"*

## Laws

1. **If it's teal, it's It.** Teal (#0d9488 / `brand-600`) is reserved for the dot
   and what it touches (focus marks attention). No teal links, buttons, or icons
   on the story spine (navbar, hero, acts, footer).
2. **The only circle on the page is It.** Everything else is rectilinear ink type
   on paper (#fafafa field, #0f172a ink).
3. **Declarations never end in a period glyph.** It is their period. The type
   cannot finish its sentence without the brand.
4. **Depth is forbidden.** Paper is flat; the dot lives on the page, not in a world.

## The three acts

| Act | Line          | Where                         | The dot's role                            |
|-----|---------------|-------------------------------|-------------------------------------------|
| I   | You bring it  | Hero                          | Pops in on the navbar wordmark's dotless ı (the logo lends its tittle), travels down, lands as the headline's period. |
| II  | We code it    | Interstitial before Services  | Hops down the build list as each line's period; only the line being read gets to finish its sentence. During the middle sections the dot is absent — *it is in the shop.* |
| III | You get it    | Interstitial before Contact   | Re-enters, pauses a beat, docks inside the ink pill `[ • Get it ]`. The handover. |
| —   | (epilogue)    | Footer                        | The wordmark `codegetıt` is permanently dotless: *"(you have it now.)"* |

## Typography

- **Syne 700–800** speaks only in declarations: the wordmark and the act lines.
  Huge, tight tracking (−0.03em), hand-set feel.
- **Outfit 400–500** is the explaining voice. Calm. Never shouts.
- Detail layer ("It-alics"): body words containing *it* may ink their `it` teal
  on hover — those who notice, get it. (Optional, rollout layer.)

## Motion — the Beat

Borrowed from comedic timing: **anticipate → travel → settle.**

- Travel spring: `stiffness 260, damping 26` — slight overshoot is the punchline.
- The reading line sits at 42% of the viewport, so the dot leaves each rest
  *before* you fully arrive. The site gets it before you finish asking.
- Page load: paper → dot pops on the navbar tittle (~0.45s) → hero words rise →
  dot departs (~1.35s) and lands as the period just after the last word settles.
- Long act-to-act jumps re-enter from just above the target rather than streaking
  across the document.
- `prefers-reduced-motion`: every rest renders its own static teal period; the
  traveler is never summoned. The story survives as punctuation.

## Implementation map

- `src/components/landing/it/ItSystem.tsx` — `ItProvider` (rest registry, reading
  line, overlay), `ItRest` (inline period placeholder), the traveling dot.
- `src/components/landing/it/ActLine.tsx` — masked word-rise declaration whose
  period is an `ItRest`.
- `src/components/landing/it/DotlessWordmark.tsx` — brand text with dotless ı;
  navbar instance registers the journey origin.
- `src/components/landing/HeroSection.tsx` — Act I.
- `src/components/landing/ActCodeSection.tsx` — Act II (hop list).
- `src/components/landing/ActGetSection.tsx` — Act III (dock + handover).
- `src/components/landing/FooterSection.tsx` — dotless wordmark epilogue.
- Copy: `landing.hero` + `landing.story` in `src/i18n` (el currently aliases en).

## Rollout (remaining)

- De-teal the interior sections (services, comparison, process, projects, FAQ,
  contact) so Law 1 holds everywhere; teal kickers/pills become slate.
- Favicon → the dot alone. Loading states → the dot bouncing.
- Optional It-alics hover layer in body copy.

## Success test

Strip all text: paper, ink masses, one teal dot that arrives, waits, hops down a
list, pauses, and docks into a pill — still a complete, recognizable story.
A visitor should be able to retell it 24 hours later: *"the site where the logo's
dot travels the page and you finally get it."*
