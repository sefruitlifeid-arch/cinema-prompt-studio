# HANDOFF — Cinema Prompt Studio

**Read this file first.** Everything else in `/docs` expands on it.

Generated 2026-07-19; status sections re-verified against the source of the deployed `main` on
2026-08-06.

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
Current version: **V4.7**, shipped 7 Aug 2026 — `a5208a7` (V4.7a, proportion chips + cm
auto-sync), `95f744d` (V4.7b, anti-bogel guard), `6cf2dd5` (V4.7c, Cinema anti-distortion guard),
`380d805` (V4.7d, Examine proportions + "Set proportions"). V4.6 remains deployed beneath it:
`eda306b` (character thumbnails) and `99d1f75` (in-app Help modal).

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
| Character Maker | `charmaker` | Working, **V4.5 output partly verified** |

Also working: global Brand Kit, Creative Context, Manual Instruction, per-mode presets, four
localStorage libraries, clipboard copy with a sandboxed-iframe fallback, and GitHub Actions
auto-deploy on push to `main`.

Shipped in V4.6 and also working: optional character thumbnails (`thumb` data URL on the
character record, rendered through the shared `CharChip` in Character Maker, Cinema and
Storyboard) and the in-app Help modal, opened from the header **Help** button present on all
seven tabs and scrolled to the active tab's section.

---

## Current goal

The V4.5 flat grade was **partly verified on 4 Aug 2026** — the two priority checks passed,
which clears the lighting base the Character Maker work sits on. Two open items remain:

### 1. Finish the V4.5 flat-grade verification

This is a visual check, not a code change. Run `npm run preview` and generate:

1. **Identity plate** — near-absent nose/chin shadow, no discernible key direction, no cheek
   hotspot. If you can tell where the light is, the flat grade did not take.
   **PASS, 4 Aug 2026.**
2. **Character sheet (6 panels)** — all six lit identically. Common failure: the profile
   headshots pick up a side key while the body columns stay flat.
   **PASS, 4 Aug 2026** — no profile headshot picked up a side key.
3. **Skin tone across panels** — face close-up vs. back body vs. profiles must read as one
   person. This is the specific target of `SKIN_CONSISTENCY_CLAUSE` and the real test.
   **PASS, 4 Aug 2026** — reads as one person across all six panels.
4. **Outfit sheet (2A)** — both neckline variants flat; the face anchor panel not brighter
   than the body panels. **Outstanding.**
5. **Expression sheet** — flat across all nine cells, no cell-to-cell exposure drift.
   **Outstanding.**

Checks 1–3 were the priority set and all passed. Checks 4 and 5 are the remainder; neither
blocks other work — they are a *lighting* concern, and three minor non-blocking findings from
the same session are recorded as V4.8 candidates in `TODO.md`.

### 2. Test Blocking mode end-to-end

The code path is complete but has never been run through in full: pick a location → copy the
extract prompt → run it externally against a real location photo → paste the reply → drag the
canvas → save a named blocking → inject it into Cinema and into a Storyboard frame → read the
compiled clause. The tolerant parser in particular has not met real-world AI replies.

---

## Blocking issues

Nothing prevents the app from running. Two real defects:

1. **Mode id/label mismatch.** The Storyboard tab has internal id `assemble` (a leftover from
   the old Scene Assembler). Presets saved from that tab store `mode: "assemble"`. Renaming
   the id without a migration silently orphans every saved Storyboard preset.
2. **Blocking geometry is not in presets.** `blCharacters`, `blCamera`, `blSubjectIdx` are
   deliberately excluded from the preset snapshot — blockings persist on the *location library
   entry* as `location.blockings[]`. Only `blLocationId` is in the snapshot. Intentional, but
   it surprises people.

---

## Recommended next steps

1. Read `PRODUCT_DECISIONS.md` before changing any compiler. Most of the odd-looking prompt
   text is a deliberate fix for a specific image-model failure. It looks removable. It is not.
2. Read `AI_INSTRUCTIONS.md` before writing code. The owner works discuss-first and will
   reject unrequested rewrites.
3. Then pick from `TODO.md`. Its top item is testing Blocking end-to-end.

**V4.6 is SHIPPED — do not rebuild it.** Character thumbnails (`eda306b`) and the Help modal
(`99d1f75`) are both on `main`. `PRODUCT_DECISIONS.md` §7 still carries the V4.6 spec, but it
is there as the record of *why* each piece is shaped the way it is, not as work to do.

**V4.7 is SHIPPED** (7 Aug 2026, four commits above). Its decisions were locked on 6 Aug 2026;
see `TODO.md` item 4 for the locked set and `PROGRESS.md` §6b for the rationale.

**Where the shipped code differs from the spec above.** All five are deliberate; do not
"restore" them to match the spec text.

1. **No `BUILD_CHIPS` constant.** `buildProportionClause` reads the pre-existing `ID_BUILD` row
   (slim / athletic / average / stocky / heavyset), which already fed the identity paragraph. A
   second build row would have let one prompt contradict itself. Build affects mass wording only
   and never changes the head-height number. `ID_BUILD` gained a short `mass` field; no preset
   migration was needed.
2. **Cinema gained `cineCharacterId`**, mirroring Storyboard's `sbCharacterId`. Cinema previously
   held the character as free text with no link to the record. The id clears when the user edits
   the identity textarea after selecting, so a hand-edited character cannot claim stale
   proportions.
3. **`proportionClause` supersedes the pre-existing `refProportion` line** (originally
   `App.jsx:294`, now `:314`) when the character has one; that line still fires for characters
   without proportion data. **That pre-existing line is likely why the proportion bug was
   intermittent rather than constant** — it was already asserting "figure proportions
   anatomically correct" whenever the reference toggle was on, with no height anchor behind it.
4. **The anti-distortion guard keys on `Math.abs(tilt) >= 25`**, the same band `anglePhrase` uses
   to decide it says "at eye level". The spec's mention of "dutch" did not apply: this app has no
   roll control, only orbit rotation and tilt.
5. **The proportion block renders in all three identity modes** — scratch, extract and
   reference-locked — not only "Build from scratch", with a Build row shown only where the
   scratch identity row is not already showing one.

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
  that pattern; the V4.6 `thumb` field already follows it — it is optional, there was no
  migration, and every consumer handles its absence (`c.thumb || null` at the call sites, and
  the initials fallback inside `CharChip`).
