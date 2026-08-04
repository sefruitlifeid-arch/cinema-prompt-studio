# Cinema Prompt Studio — Progress Documentation

**Originally written:** 21 July 2026 (chat-side) · **Consolidated into the repo:** 3 August 2026
**Current version:** V4.6 shipped. V4.5 flat grade verified 4 Aug 2026 (identity plate +
character sheet; outfit and expression sheets still unchecked). V4.7 in design.
**Live:** https://sefruitlifeid-arch.github.io/cinema-prompt-studio/
**Repo:** `sefruitlifeid-arch/cinema-prompt-studio`

> **Corrections applied on import.** The original chat-side progress doc stated
> `base: './'` and listed V4.6 as unbuilt. Both were wrong by the time this was folded into the
> repo — the Vite base is `'/cinema-prompt-studio/'` (see `CLAUDE.md` warning #2), and V4.6
> shipped as `eda306b` + `99d1f75`. Fixed in place below.

---

## 1. What this app is

A personal creative production tool. It does **not** generate images. It compiles UI selections
into professional, copy-paste-ready text prompts for external AI image tools (Seedance, Nano
Banana Pro, Higgsfield). Mobile-friendly by design — usable without a laptop.

Core philosophy: **build assets first, then shoot.** Create a character / product / location,
lock each with a reference image, then compose shots that anchor to those references instead of
re-imagining them every generation.

---

## 2. Stack & architecture

| Item | Value |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Deploy | GitHub Pages, auto-deploy via GitHub Actions on push to `main` |
| Vite config | `base: '/cinema-prompt-studio/'` — required for the Pages **project** site |
| File layout | `src/constants`, `src/utils`, `src/components`, `src/App.jsx` |

### localStorage keys

All with in-memory fallback for sandboxed iframes.

| Key | Contents |
|---|---|
| `cps_presets_v1` | Per-mode full app-state snapshots |
| `cps_characters_v1` | Character library (optional `thumb` data URL since V4.6a) |
| `cps_products_v1` | Product library |
| `cps_locations_v1` | Location library (blockings stored on the location record) |
| `cps_brand_v1` | Brand kit |

---

## 3. Modes (7)

1. **Cinema / Portrait** — one cinematic still. Full camera rig, genre, lighting, character,
   action, outfit, expression, optional product, location, framing. Panel 08 = location +
   blocking selection. Panel 09 = character placement canvas.
2. **Character Maker** — reusable character assets. Outputs: identity plate (hero), character
   sheet (6 panels), full body + outfit, outfit sheet (Mode 2A), expression sheet.
3. **Product Photo** — beauty shot, clean extraction, multi-angle sheet, angle set (6 separate
   prompts).
4. **Location / Set** — establishing shot, location sheet (2×2), empty plate.
5. **Design / Thumbnail** — the only mode where text is allowed in the image. Headline +
   sub-label on a drag canvas with rotation.
6. **Storyboard** — scene-level locks + up to 8 frames of deltas. Outputs: copy-per-frame
   (standalone prompts, locks repeated every time) and storyboard sheet grid.
7. **Blocking** — top-down staging map per location. Extract prompt → paste AI reply → drag
   character points (max 2) + camera point → save named blocking.

### Global features

- **Brand Kit** — inject brand name/palette/mood/style into any mode.
- **Creative Context** — medium framing (film set, theater, VFX, cartoon, comic, fantasy). Placed
  at the **start** of the compiled prompt because models weight the opening heavily.
- **Manual Instruction** — free text appended verbatim at the end. The escape hatch.
- **Presets** — per-mode state snapshots; save / load / delete.
- **Help modal** — `?` in the header, context-aware to the active tab (V4.6b).

---

## 4. Version history

### V1–V3 (foundation)
Single-file JSX artifact. Grouped Expression ChipField (`EXPRESSION_GROUPS`, 4 categories, 22
presets; state stores `expressionPhrase` string, not an ID). Creative Context upgrades with
`contextClause` moved to prompt start. Location/Set as fourth mode with library +
`LOCATION_EXAMINE_PROMPT`. Character Placement Canvas in Cinema panel 09. Scene Assembler as
fifth mode.

### Migration
JSX monolith → proper Vite project, split into `constants` / `utils` / `components` / `App.jsx`.
GitHub Pages deploy set up. Resolved a production-only Tailwind bug where utilities compiled and
CSS loaded but layout classes did not apply in `vite preview` and on Pages while dev server
worked.

### V4.1 — Character Maker overhaul + Storyboard
- Locked flat studio formula: mid-gray seamless backdrop, diffused lighting, realism close block
  (anti-acne, anti-text clauses).
- Six-panel character sheet.
- Gender fork for baseline wardrobe.
- "Reference image locked" toggle using the `REF_ANCHOR_CLAUSE` pattern → delta-mode prompts that
  stop describing the face.
- Aspect ratio removed from Character Maker prompts. Turnaround output type removed.
- **Storyboard** replaces Assemble as mode 6: scene-level locks, dynamic frames (max 8) with
  duplicate/reorder, standalone per-frame compilation, storyboard sheet grid output, reserved
  `blockingClause` slot per frame.

### V4.2 — Cinema fixes
- Zoom slider removed (focal length handles lens character; shot type handles figure size).
- Resolution-aware realism in three buckets (close / medium / wide) to stop face morphing at
  distance.
- Two reference toggles added: character identity anchor and outfit anchor.

### V4.3 — Blocking mode (Phase C)
- Pipe-delimited extract prompt format for AI-extracted sub-area coordinates, with a tolerant
  parser.
- Top-down canvas; one camera point auto-facing the chosen subject; max two character points
  (array structure for future expansion).
- Extract prompt lives only in the Blocking tab.
- Named blockings stored on Location library entries.
- Compiled blocking clauses inject into Cinema panel 08 and Storyboard frame slots **without
  touching those compilers**.

### V4.4 — Source audit, 4 bugs fixed
1. Cinema blocking lookup used fragile text equality → switched to ID tracking.
2. Storyboard sheet grid rows were hardcoded → made dynamic.
3. Gutter wording contradicted the location backdrop.
4. Distance slider had zero effect on prompts.

Refinements in the same pass: merged the two Cinema reference mechanisms, separated shared
aspect-ratio state per mode, curated the expression sheet down to nine, added gender-fork
auto-sync. Also translated all Indonesian expression labels to English across shared constants.

### V4.4.1 / V4.4.3 — Character Maker refinements
*(Shipped after the original progress doc was written; reconstructed from the commit history.)*

- **V4.4.1** — per-output aspect-ratio guidance surfaced in the UI (prompts stay aspect-free);
  profile panels made explicitly opposite-facing; hands detail shot specified as mid-air against
  the backdrop rather than laid flat on a surface.
- **V4.4.3** — the character sheet became an asymmetric 6-panel layout: two full-height body
  columns (front, back) on the left half, a 2×2 headshot block (left profile, right profile,
  front face, detail) on the right. Added a Hair option to the detail-shot chips.

### V4.5 — Banana Pro Director 3.0 upgrades
- Flat shadowless grade constant (`FLAT_GRADE_CLOSE`) replacing all directional lighting for
  Character Maker outputs.
- Skin-tone consistency clause across all sheets.
- Mode 2A outfit sheet with ghost-mannequin and clean-neck-cut neckline variants.
- Visual handle inputs on all three reference toggles.

**Status: verified 4 Aug 2026** for the identity plate and the 6-panel character sheet, tested
through Nano Banana Pro. See §5.

- **Identity plate — PASS.** No directional shadow under nose or chin, no readable key
  direction, no cheek hotspot, flat even mid-gray backdrop.
- **Character sheet — PASS on flat grade and skin tone.** All six panels lit uniformly; no
  profile headshot picked up a side key (the known common failure). Skin tone reads as one
  person across front body, back body, both profiles, face close-up, and the hand detail panel.
  The V4.5 skin consistency clause works.

**Still outstanding:** outfit sheet (Mode 2A, both neckline variants) and expression sheet.

### V4.6 — Character thumbnails + in-app Help modal *(SHIPPED)*

Two independent commits, exactly as specified in the locked spec.

- **`eda306b` — V4.6a: character thumbnails.** Optional `thumb` field (JPEG data URL) on
  character records; no migration, absence handled everywhere. New `src/utils/thumb.js`
  (`makeThumb`: 96×96 center-crop cover → quality 0.7, three-step size guard down to 64×64/0.5,
  null past ~25KB, never throws). New shared `src/components/CharChip.jsx` holding the thumb-or-
  initials fallback in one place, rolled out to exactly three sites (Character Maker library,
  Cinema character panel, Storyboard scene-lock picker). Product and location chips untouched.
- **`99d1f75` — V4.6b: Help modal.** `src/components/HelpModal.jsx`, context-aware via a
  tab-id → section-id map, opened by a `?` header button present on all seven tabs. Static JSX
  transcription of `docs/USER_GUIDE.md`, no markdown parser, no new dependencies. Closes on
  backdrop / ✕ / Escape, locks body scroll, sticky mini-TOC with in-panel anchor jumps.

---

## 5. V4.5 verification checklist — partly done (4 Aug 2026)

Visual check, not a code change. Run `npm run preview` and generate:

1. **Identity plate** — near-absent nose/chin shadow, no discernible key direction, no cheek
   hotspot. If you can tell where the light is, the flat grade did not take.
   **PASS, 4 Aug 2026.**
2. **Character sheet (6 panels)** — all six lit identically. Common failure: profile headshots
   pick up a side key while body columns stay flat. **PASS, 4 Aug 2026** — no profile headshot
   picked up a side key.
3. **Skin tone across panels** — face close-up vs. back body vs. profiles must read as one
   person. This is the specific target of the new clause and the real test.
   **PASS, 4 Aug 2026** — reads as one person across all six panels.
4. **Outfit sheet (2A)** — both neckline variants flat; face anchor panel not brighter than body
   panels. **Not yet tested.**
5. **Expression sheet** — flat across all nine cells, no cell-to-cell exposure drift.
   **Not yet tested.**

Priority: identity plate + character sheet first; they cover most of the surface. Both are now
done and both passed, which clears the base the Character Maker work sits on. Items 4 and 5
remain outstanding. Three minor non-blocking findings from this session are recorded as V4.8
candidates in `TODO.md` — none of them is a flat-grade failure.

---

## 6. Backlog

| Priority | Item | Status |
|---|---|---|
| 1 | Verify V4.5 flat grade results | Done for identity plate + character sheet (4 Aug 2026); outfit + expression sheets pending |
| 2 | Test Blocking mode end-to-end | **Pending — current top item** |
| 3 | **V4.6** — character thumbnails + in-app Help modal | **Shipped** (`eda306b`, `99d1f75`) |
| 4 | **V4.7** — body proportion control + anti-distortion | In design, decisions pending |
| 5 | Undo / redo | Deprioritized |
| 6 | Cloud sync | Backlog |

`TODO.md` is the authoritative ranked backlog — it carries the same items with complexity and
dependencies, plus repo-only items (export/import libraries as JSON, splitting `App.jsx`, tests).

---

## 6b. V4.7 — Body proportion control + anti-distortion (IN DESIGN)

### Problem
Proportions go wrong — sometimes "bogel" (chibi/short), sometimes head-to-body ratio off. Two
stacked root causes, both specific to the observed case:

1. **Extracted characters carry no proportion data.** Build-from-scratch characters get body info
   from chips; the `EXAMINE_PROMPT` only captures facial identity (hair, features, skin tone). So
   an extracted character enters Cinema with a detailed face but an empty body → the model invents
   proportions, defaulting to short/chibi.
2. **Unusual camera angles amplify it via perspective distortion.** Low/high/dutch/wide-lens
   angles physically distort proportions (low angle lengthens legs, shrinks head; high angle the
   reverse). With a strong proportion anchor the model renders the character *seen from* that
   angle; with an empty anchor it bakes the perspective distortion into the character's actual
   anatomy → genuinely oversized head, not just apparent.

Key insight: **"Character reference attached" does NOT fix this** — the identity plate is a medium
shot, so only the face is anchored; body proportion stays unlocked. That's why the problem only
surfaced with extracted characters at unusual angles in Cinema.

### Proposed solution (three parts + library patch)
1. **Proportion inputs (new):**
   - Height chips: petite / average / tall / very tall → compiled to phrasing like "tall stature,
     approx 180cm" (cm as reinforcement, not the anchor — models lack in-frame scale reference).
   - Build chips: slender / athletic / average / stocky / curvy (mass, separate from height).
   - Compiler derives a head-height ratio from height+build, e.g. *"adult proportions of
     approximately 7.5 head-heights, tall slender build, long legs, natural anatomical
     proportions."*
2. **Anti-bogel guard clause (locked constant, always on):** permanent negative on all full-body
   Character Maker output — *"correct adult head-to-body ratio, no chibi, no shortened limbs, no
   oversized head, consistent proportions across all panels."* The "consistent across all panels"
   part mirrors the V4.5 skin-tone clause for character sheets.
3. **Cinema anti-distortion guard (angle-conditional):** when camera angle ≠ eye-level, compiler
   appends *"perspective affects framing only — character anatomy remains correct adult
   proportions, no exaggerated head or limbs from the camera angle."* Complements the V4.2 realism
   buckets.

### Additional fixes specific to the extracted-character case
- **Upgrade the Examine prompt** to also estimate a height bracket and build from the photo, in a
  format parseable into the same chips → extracted characters gain proportion data like
  scratch-built ones.
- **Inject the proportion clause in the Cinema compiler even when the ref toggle is ON** — this is
  the gap that closes the bug (face ref does not lock height).
- **Persist proportion as a `proportionClause` field on the character record** so Cinema and
  Storyboard inherit identical proportions.
- **"Set proportions" button on existing library entries** so already-saved extracted characters
  can get chips manually without re-extracting.

### Open decisions (PENDING — lock before execution)
- **A:** chips only, or chips + optional manual cm input?
- **B:** anti-bogel guard always-on (recommended, matches locked-formula pattern) or toggleable?
- **C:** confirmed as its own version V4.7 (touches examine prompt + character record + Cinema
  compiler — too large to ride on V4.6). Tentatively yes.

---

## 7. Working rules

**Process**
- Discuss and lock all design decisions before any execution. *"Jangan execute apa apa before i
  decide."*
- Commit phases independently so a failure does not dirty earlier working states.
- Visual verification is mandatory — `npm run preview`, never grep-only checks, to confirm
  production behaviour.

**Model tiering (cost discipline)**
- Premium (Fable / Opus) → architecture and design decisions.
- Sonnet medium → complex implementation phases.
- Sonnet low → genuinely small, surgical single-string tasks only.
- Escalate after two failures rather than retrying at the same tier.
- *Known incident:* a Sonnet-low edit to the gutter wording broke the sheet compiler. Recovery =
  revert plus reapply with strict diff verification.

**Build strategy — atomic Python surgical replacement**
- Read source, `src.replace(old, new)` guarded by `if old in src`.
- One `python3 - << 'PYEOF'` heredoc per feature to keep replacements atomic and debuggable.
- Audit with `(name, needle)` tuples printed with ✓/✗.
- Verify brace/paren/bracket balance (`src.count('{')` vs `src.count('}')`) before final write.
- Stage to `/tmp/`, copy to the output path only after the full audit passes.
- **`repr()` anchor technique:** when an exact string match fails, print `repr(src[idx:idx+400])`
  around a known anchor to find the actual text, then build the replacement from what was found —
  never from memory of what the string "should" look like.

**Prompt engineering**
- Prefer Mega-Prompts with deterministic test blocks over open-ended implementation tasks.
