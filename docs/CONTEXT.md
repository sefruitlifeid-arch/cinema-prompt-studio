# CONTEXT — Cinema Prompt Studio

The chat-side working context of this project, consolidated into the repo so it no longer
depends on any one Claude account. Originally `CPS-ACCOUNT-TRANSFER.md` (3 August 2026);
the one-time account-migration instructions from that file are archived separately in
`docs/archive/`.

**This file is the project's "why". `docs/PROGRESS.md` is the "what happened".
`TODO.md` is the "what's next".**

> **Corrections applied when importing** — the source chat docs contained two errors that the
> repo had already documented as wrong. Both are corrected here:
> 1. Vite base is `'/cinema-prompt-studio/'`, **not** `'./'`. See `CLAUDE.md` warning #2.
> 2. V4.6 is **shipped**, not pending. See Part 5.

---

## PART 1 — WHAT THE PROJECT IS

A personal creative production tool. It does **not** generate images. It compiles UI selections
into professional, copy-paste-ready text prompts for external AI image tools (Seedance, Nano
Banana / Banana Pro, Higgsfield). Mobile-friendly by design — usable without a laptop.

Core philosophy: **build assets first, then shoot.** Create a character / product / location,
lock each with a reference image, then compose shots that anchor to those references instead of
re-imagining them every generation.

The user (Yudo) is the primary developer and creative director. Claude's role is technical
collaborator.

### Stack

| Item | Value |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Deploy | GitHub Pages, auto-deploy via GitHub Actions on push to `main` |
| Vite config | `base: '/cinema-prompt-studio/'` — **required for the Pages project site** |
| Repo | `sefruitlifeid-arch/cinema-prompt-studio` |
| Local path | `~/Documents/cinema-prompt-studio` |
| File layout | `src/constants`, `src/utils`, `src/components`, `src/App.jsx` |
| npm global | `~/.npm-global`, PATH set in `~/.zshrc` |

> The original transfer doc listed `base: './'` and a local path of
> `~/Documents/projects/cinema-prompt-studio`. The base value is simply wrong — do not change
> `vite.config.js` to match it, it breaks the deploy. The `projects/` path was a second, stale
> clone of the same remote; **it no longer exists** — `~/Documents/cinema-prompt-studio` is now
> the only clone on this machine.

### localStorage keys (in-memory fallback for sandboxed iframes)

`cps_presets_v1` · `cps_characters_v1` · `cps_products_v1` · `cps_locations_v1` · `cps_brand_v1`

Blockings are stored on the location record, not separately.

### The seven modes

1. **Cinema / Portrait** — one cinematic still. Camera rig, genre, lighting, character, action,
   outfit, expression, optional product, location, framing. Panel 08 = location + blocking.
   Panel 09 = character placement canvas.
2. **Character Maker** — reusable character assets. Outputs: identity plate (hero), character
   sheet (6 panels), full body + outfit, outfit sheet (Mode 2A), expression sheet.
3. **Product Photo** — beauty shot, clean extraction, multi-angle sheet, angle set (6 prompts).
4. **Location / Set** — establishing shot, location sheet (2×2), empty plate.
5. **Design / Thumbnail** — the only mode where text is allowed in the image.
6. **Storyboard** — scene-level locks + up to 8 frames of deltas. Copy-per-frame (standalone)
   and sheet grid.
7. **Blocking** — top-down staging map per location. Extract prompt → paste AI reply → drag
   character points (max 2) + camera point → save named blocking.

Global: Brand Kit · Creative Context · Manual Instruction · Presets.

---

## PART 2 — WORKING RULES

**Process**
- **Discuss and lock all design decisions before any execution.** Nothing gets built until the
  user says lock. This is the single most important rule.
- Commit phases independently so a failure does not dirty earlier working states.
- Visual verification is mandatory — `npm run preview`. Grep-based verification alone is
  insufficient.
- Prompts for Claude Code are delivered as a **single copy-paste block**, never as step-by-step
  instructions for the user to adapt manually.
- Generate progress documentation at session end or before a context handoff.

**Model tiering (cost discipline)**
- Premium/Opus → architecture and design decisions.
- Sonnet medium → complex implementation phases.
- Sonnet low → genuinely surgical single-string tasks only.
- Escalate after two failures at a tier rather than retrying at the same tier.
- *Known incident:* a Sonnet-low edit to gutter wording broke the sheet compiler. Correct
  recovery is a single revert-plus-reapply prompt with strict diff verification — not a
  multi-step diagnostic loop.

**Build strategy — atomic Python surgical replacement**
- Read source, `src.replace(old, new)` guarded by `if old in src`.
- One `python3 - << 'PYEOF'` heredoc per feature to keep replacements atomic.
- Audit with `(name, needle)` tuples printed with ✓/✗.
- Verify brace/paren/bracket balance before final write.
- Stage to `/tmp/`, copy to the output path only after the audit passes.
- **`repr()` anchor technique:** when an exact string match fails, print
  `repr(src[idx:idx+400])` around a known anchor to find the actual text, then build the
  replacement from what was found — never from memory of what the string "should" look like.

---

## PART 3 — LOCKED PROMPT ENGINEERING DECISIONS

These are settled. Do not relitigate them without the user raising it first.

- `contextClause` always goes at the **start** of every compiled prompt — classifiers weight
  the opening.
- Expression is stored as a phrase string, not an ID.
- Character Maker prompts are **aspect-free**; per-output aspect hints live in the UI only.
- Asset plates carry **zero lighting information** — flat grade only. Baked shadows are
  inherited and amplified downstream.
- Reference images carry identity; prompts must **not re-describe what a reference shows**
  (visual handle only).
- Sheet gutters match the backdrop tone, never white.
- Blocking uses **pipe-delimited** format over JSON — survives AI formatting damage.
- Storyboard frames are **full standalone prompts** — external tools have no memory between
  generations.
- Shot type controls figure size; focal length controls lens character. Pick shot type first.
- Realism detail auto-adapts to shot type in three buckets (close / medium / wide) so distant
  faces don't morph.

---

## PART 4 — VERSION HISTORY (condensed)

Full history with per-version detail lives in `docs/PROGRESS.md`.

**V1–V3** — single-file JSX artifact. Grouped Expression ChipField (`EXPRESSION_GROUPS`, 4
categories, 22 presets). Creative Context with `contextClause` moved to prompt start.
Location/Set as fourth mode with `LOCATION_EXAMINE_PROMPT`. Character Placement Canvas in Cinema
panel 09.

**Migration** — JSX monolith → Vite project, split into constants/utils/components/App. GitHub
Pages deploy. Fixed a production-only Tailwind bug where utilities compiled and CSS loaded but
layout classes did not apply in `vite preview` and on Pages, while the dev server worked.

**V4.1** — Character Maker overhaul. Locked flat studio formula (mid-gray seamless, diffused
light, anti-acne and anti-text clauses). Six-panel character sheet. Gender fork for baseline
wardrobe. `REF_ANCHOR_CLAUSE` delta-mode toggle. Aspect removed from Character Maker. Storyboard
replaces Assemble as mode 6, with a reserved `blockingClause` slot per frame.

**V4.2** — Cinema fixes. Zoom slider removed. Resolution-aware realism in three buckets. Two
reference toggles added (character identity, outfit).

**V4.3** — Blocking mode. Pipe-delimited extract format with tolerant parser. Top-down canvas,
camera auto-facing the subject, max two character points. Blocking clauses inject into Cinema
panel 08 and Storyboard frames without touching those compilers.

**V4.4** — source audit, 4 bugs fixed: fragile text-equality blocking lookup → ID tracking;
hardcoded storyboard grid rows → dynamic; gutter wording contradicting the location backdrop;
distance slider having zero prompt effect. Also merged the two Cinema reference mechanisms,
separated per-mode aspect state, curated expressions to nine, gender-fork auto-sync, and
translated all Indonesian expression labels to English.

**V4.4.1 / V4.4.3** — Character Maker refinements: per-output aspect guidance in the UI,
explicitly opposite-facing profile panels, mid-air hands detail; then the asymmetric 6-panel
sheet (two full-height body columns + a 2×2 headshot block) and a Hair detail option.

**V4.5** — Banana Pro Director 3.0 integration. Flat shadowless grade constant
(`FLAT_GRADE_CLOSE`) replacing directional lighting in Character Maker. Skin-tone consistency
clause on all sheets. Mode 2A outfit sheet with ghost-mannequin and clean-neck-cut neckline
variants. Visual handle inputs on all three reference toggles. **Status: awaiting visual
verification.**

**V4.6** — character thumbnails + in-app Help modal. **Shipped.**

---

## PART 5 — WHERE WE ARE RIGHT NOW

### Backlog, in order

| # | Item | Status |
|---|---|---|
| 1 | Verify V4.5 flat grade results | **In progress — user-side visual check** |
| 2 | Test Blocking end-to-end with a real location image | **Pending** |
| 3 | **V4.6** — character thumbnails + Help modal | **Shipped** (`eda306b`, `99d1f75`) |
| 4 | **V4.7** — body proportion + anti-distortion | **In design, 3 decisions pending** |
| 5 | In-app Help page as collapsible panel | Backlog (separate from the shipped V4.6 modal) |
| 6 | Undo / redo | Deprioritized — presets cover most of the need |
| 7 | Cloud sync | Backlog — needs backend + auth, separate project |

`TODO.md` carries the same backlog ranked with complexity and dependencies, plus repo-only
items (export/import libraries, splitting `App.jsx`, tests) that were never in the chat docs.

### Item 1 — V4.5 verification checklist (visual, not code)

Run `npm run preview` and generate:

1. **Identity plate** — near-absent nose/chin shadow, no discernible key direction, no cheek
   hotspot. If you can tell where the light is, the flat grade did not take.
2. **Character sheet (6 panels)** — all six lit identically. Common failure: profile headshots
   pick up a side key while body columns stay flat.
3. **Skin tone across panels** — face close-up vs. back body vs. profiles must read as one
   person. This is the specific target of the new clause and the real test.
4. **Outfit sheet (2A)** — both neckline variants flat; face anchor panel not brighter than body
   panels.
5. **Expression sheet** — flat across all nine cells, no exposure drift.

Priority: identity plate + character sheet first.

### Item 3 — V4.6 (SHIPPED)

> The source chat docs describe V4.6 as "mega-prompt written, NOT executed." That is no longer
> true — it was built and pushed. The locked spec is retained below because it documents *why*
> each piece is shaped the way it is.

Delivered as two independent commits:

**`eda306b` — V4.6a: character thumbnails (option C, characters only)**
- Optional `thumb` field (JPEG data URL) on character records in `cps_characters_v1`. No
  migration; every consumer handles its absence.
- `src/utils/thumb.js` exports `async makeThumb(file)`: load via object URL → canvas 96×96
  **center-crop cover** → `toDataURL('image/jpeg', 0.7)`. Size guard: >~15KB re-encode at 0.5 →
  still over, redraw 64×64 at 0.5 → still >~25KB, return null. Never throws.
- Capture UI in the Character Maker save panel: 40px rounded preview, "Add thumbnail" label
  wrapping a hidden `<input type="file" accept="image/*">`, ✕ overlay to remove. Null result →
  inline notice, save still proceeds without a thumb.
- Shared `src/components/CharChip.jsx` (`{ character, selected, onClick }`): renders the thumb as
  a 28px rounded square, else the initials/color fallback, extracted into this one place.
- Rolled out to exactly three places: Character Maker library list, Cinema character panel,
  Storyboard scene-lock picker. Product and location chips deliberately untouched.

**`99d1f75` — V4.6b: in-app Help modal (context-aware)**
- `src/components/HelpModal.jsx`, props `{ open, onClose, section }` where section ∈
  cinema/character/product/location/design/storyboard/blocking/null.
- Full-screen overlay, dark backdrop, centered scrollable panel (max-w-2xl, max-h-85vh). Closes
  on backdrop click, ✕, and Escape (listener added/removed with open state, cleaned on unmount).
  Body scroll locked while open.
- Sticky top bar with a horizontally scrollable mini-TOC (Big Idea · Tabs 1–7 · Global ·
  Cheat-sheet) scrolling to in-panel anchors. On open with a non-null section it jumps straight
  there, instantly (no smooth on first paint).
- Content: static JSX transcription of `docs/USER_GUIDE.md`, verbatim, tables rendered as simple
  styled tables. No markdown parser, no new dependencies.
- `App.jsx`: `helpOpen` state, `?` button in the header visible on all seven tabs, tab-id →
  section-id map (unknown → null), single `<HelpModal>` mount at root. Zero reads/writes of other
  app state.

*Implementation note discovered during the build:* the modal's scroll body needs
`flex: 1; minHeight: 0` to fill the panel, and the context-aware scroll must be deferred behind
`requestAnimationFrame` so it reads a committed layout.

### Item 4 — V4.7 design (PENDING DECISIONS)

**Problem, as diagnosed:** proportions go wrong — sometimes "bogel" (chibi/short), sometimes
head-to-body ratio off. It surfaces specifically with **extracted characters** (not built from
scratch) in **Cinema at unusual camera angles**.

Two stacked root causes:

1. **Extracted characters carry no proportion data.** Scratch-built characters get body info from
   chips; the Examine prompt only captures facial identity (hair, features, skin tone). So an
   extracted character enters Cinema with a detailed face and an empty body → the model invents
   proportions, defaulting short/chibi.
2. **Unusual angles amplify it via perspective distortion.** Low/high/dutch/wide-lens angles
   physically distort proportions (low angle lengthens legs and shrinks the head; high angle the
   reverse). With a strong proportion anchor the model renders the character *seen from* that
   angle; with an empty anchor it bakes the perspective distortion into the character's actual
   anatomy — a genuinely oversized head, not just an apparent one.

**Key insight:** the "Character reference attached" toggle does **not** fix this. The identity
plate is a medium shot, so only the face is anchored; body proportion stays unlocked. That is
precisely why the bug only appears for extracted characters at unusual angles.

**Proposed solution — three parts plus a library patch:**

1. **Proportion inputs.** Height chips (petite / average / tall / very tall) compiled to phrasing
   like "tall stature, approx 180cm" — cm as reinforcement only, since models lack in-frame scale
   reference. Build chips (slender / athletic / average / stocky / curvy) controlling mass
   separately. The compiler derives a head-height ratio from height+build, e.g. *"adult
   proportions of approximately 7.5 head-heights, tall slender build, long legs, natural
   anatomical proportions."*
2. **Anti-bogel guard clause** — locked constant on all full-body Character Maker output:
   *"correct adult head-to-body ratio, no chibi, no shortened limbs, no oversized head,
   consistent proportions across all panels."* The cross-panel phrasing mirrors the V4.5
   skin-tone clause.
3. **Cinema anti-distortion guard**, angle-conditional: when camera angle ≠ eye-level, append
   *"perspective affects framing only — character anatomy remains correct adult proportions, no
   exaggerated head or limbs from the camera angle."* Complements the V4.2 realism buckets.

**Extracted-character specific fixes:**
- Upgrade the Examine prompt to also estimate a height bracket and build from the photo, in a
  format parseable into the same chips.
- **Inject the proportion clause in the Cinema compiler even when the ref toggle is ON** — this
  is the gap that closes the bug.
- Persist as a `proportionClause` field on the character record so Cinema and Storyboard inherit
  identical proportions.
- Add a "Set proportions" button on existing library entries so already-saved extracted
  characters can be fixed manually without re-extracting.

**Three decisions still open — lock these before any execution:**

- **A:** chips only, or chips + optional manual cm input?
- **B:** anti-bogel guard always-on, or toggleable?
- **C:** is V4.7 its own version, or does it ride on another release? Scope to weigh: it touches
  the Examine prompt, the character record, and the Cinema compiler.
