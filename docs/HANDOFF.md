# HANDOFF — Cinema Prompt Studio

**Read this file first.** Everything else in `/docs` expands on it.

Generated 2026-07-19, verified directly against the source of the deployed `main`.

---

## What this project is

A single-page React app that compiles UI selections into **copy-paste-ready text prompts** for
*external* AI image generators (Seedance, Nano Banana Pro, Higgsfield).

**The app never generates images.** No backend, no API calls, no auth. It is a
prompt-composition console; output is always text on the clipboard.

Core philosophy: **build assets first, then shoot.** Create a character / product / location,
lock each with a reference image, then compose shots that anchor to those references instead
of re-imagining them on every generation.

Live: `https://sefruitlifeid-arch.github.io/cinema-prompt-studio/`
Repo: `sefruitlifeid-arch/cinema-prompt-studio`
Current version: **V4.5**, deployed.

---

## Current state — what works

All seven modes compile and are shipped:

| Mode (tab label) | internal `mode` id | Status |
|---|---|---|
| Cinema / Portrait | `cinema` | Working |
| Product Photo | `product` | Working |
| Location / Set | `location` | Working |
| Design / Thumbnail | `design` | Working |
| Storyboard | `assemble` | Working |
| Blocking | `blocking` | Working, **untested end-to-end** |
| Character Maker | `charmaker` | Working, **V4.5 output unverified** |

Also working: global Brand Kit, Creative Context, Manual Instruction, per-mode presets, four
localStorage libraries, clipboard copy with a sandboxed-iframe fallback, and GitHub Actions
auto-deploy on push to `main`.

---

## Current goal

**V4.5 shipped but has not been visually verified.** No new feature work should start until
it is. Two open items, in order:

### 1. Verify the V4.5 flat grade (highest priority)

This is a visual check, not a code change. Run `npm run preview` and generate:

1. **Identity plate** — near-absent nose/chin shadow, no discernible key direction, no cheek
   hotspot. If you can tell where the light is, the flat grade did not take.
2. **Character sheet (6 panels)** — all six lit identically. Common failure: the profile
   headshots pick up a side key while the body columns stay flat.
3. **Skin tone across panels** — face close-up vs. back body vs. profiles must read as one
   person. This is the specific target of `SKIN_CONSISTENCY_CLAUSE` and the real test.
4. **Outfit sheet (2A)** — both neckline variants flat; the face anchor panel not brighter
   than the body panels.
5. **Expression sheet** — flat across all nine cells, no cell-to-cell exposure drift.

Identity plate and character sheet cover most of the surface — do those first.

### 2. Test Blocking mode end-to-end

The code path is complete but has never been run through in full: pick a location → copy the
extract prompt → run it externally against a real location photo → paste the reply → drag the
canvas → save a named blocking → inject it into Cinema and into a Storyboard frame → read the
compiled clause. The tolerant parser in particular has not met real-world AI replies.

---

## Blocking issues

Nothing prevents the app from running. Three real defects:

1. **Two documents state the wrong Vite base.** Both `README.md` and the progress doc say
   `base: './'`. The actual `vite.config.js` uses `base: '/cinema-prompt-studio/'`, which is
   correct for a GitHub Pages project site. **The docs are wrong, the config is right.**
   Because the error appears in two places it looks authoritative — do not "fix" the config
   to match it, or the deploy breaks.
2. **Mode id/label mismatch.** The Storyboard tab has internal id `assemble` (a leftover from
   the old Scene Assembler). Presets saved from that tab store `mode: "assemble"`. Renaming
   the id without a migration silently orphans every saved Storyboard preset.
3. **Blocking geometry is not in presets.** `blCharacters`, `blCamera`, `blSubjectIdx` are
   deliberately excluded from the preset snapshot — blockings persist on the *location library
   entry* as `location.blockings[]`. Only `blLocationId` is in the snapshot. Intentional, but
   it surprises people.

---

## Recommended next steps

1. Do the V4.5 verification above. Nothing else is worth starting until the flat grade is
   confirmed.
2. Read `PRODUCT_DECISIONS.md` before changing any compiler. Most of the odd-looking prompt
   text is a deliberate fix for a specific image-model failure. It looks removable. It is not.
3. Read `AI_INSTRUCTIONS.md` before writing code. The owner works discuss-first and will
   reject unrequested rewrites.
4. Fix the README base-path line — one line, and it is actively misleading.
5. Then pick from `TODO.md`. V4.6 already has locked decisions; do not redesign it.

---

## Important warnings

- **Do not "clean up" the long prompt constants.** `FLAT_GRADE_CLOSE` (~250 words in
  `src/constants/data.js`) reads like redundant repetition. Every clause is load-bearing
  against a specific generator artifact. Same for `REALISM_CLOSE`, `SKIN_CONSISTENCY_CLAUSE`,
  and the two `outfitsheet` neckline variants.
- **Do not add a build step, framework, router, or state library** without asking. The app is
  deliberately one component tree with plain `useState`.
- **Do not touch the Cinema or Storyboard compilers to add blocking.** Blocking already
  injects through dedicated slots (`blockingSentence` in Cinema, `f.blockingClause` per
  Storyboard frame). That separation was designed on purpose and survived V4.3 intact.
- **`npm run preview` is mandatory before claiming a visual fix works.** Grepping the source
  is not verification. A Sonnet-low edit to the gutter wording once broke the sheet compiler
  and passed a grep check.
- **localStorage keys are versioned** (`cps_*_v1`). Changing an entry's shape requires a key
  bump or a defensive read. The code already defends — `location.subAreas` and
  `location.blockings` default to `[]` for entries saved before Blocking existed. Preserve
  that pattern; V4.6 thumbnails will need the same treatment.
