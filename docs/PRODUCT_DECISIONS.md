# PRODUCT DECISIONS — Cinema Prompt Studio

Why the app is shaped the way it is. This is the context that does **not** exist in the code.
Each decision below is locked unless the owner explicitly reopens it.

---

## 1. Product philosophy

### The app compiles text, it does not generate images
No API keys, no backend, no image generation. The user pastes the compiled prompt into
whichever external tool they prefer. This keeps the app free to host, instantly portable
between generators, and immune to any single vendor's pricing or policy changes.

### Mobile-first, laptop-optional
The owner uses this on a phone. Chips over dropdowns, drag canvases over numeric inputs,
one-tap copy everywhere. Any feature that assumes a mouse or a wide viewport is a
regression.

### "Examine prompt" pattern instead of vision APIs
The app needs image understanding (extract a face's identity, a product's identity, a
location's geography) but has no backend. The solution: the app *emits a prompt for the
user's own AI tool*, the user runs it externally, then pastes the text reply back.
Implemented as `EXAMINE_PROMPT`, `REF_EXAMINE_PROMPT`, `PALETTE_EXAMINE_PROMPT`,
`PRODUCT_EXAMINE_PROMPT`, `LOCATION_EXAMINE_PROMPT`, `LOCATION_BLOCKING_PROMPT`.
This is the app's core trick. Preserve it.

### Libraries, not documents
Characters, products, and locations are saved as named reusable text entries, and are
cross-referenced by id across modes. Continuity across many generated images is the whole
point of the tool.

---

## 2. Prompt-engineering decisions (the important ones)

These exist because specific image models failed in specific ways. They look like
over-writing. They are not.

### Creative-context clause goes FIRST
`contextClause` is prepended before the compiled prompt, not appended. Safety classifiers
weight the opening of a prompt more heavily, so a "this is a staged film scene" framing must
lead. See `CONTEXT_TYPES` in `data.js` and the assembly at `App.jsx` ~line 580.

### Manual instruction goes LAST
The user's free-text override is appended after everything so it takes precedence in models
that weight recency.

### Resolution-aware realism (Cinema V4.2)
`realismForShot(shotId, …)` in `utils/phrases.js` buckets shots into **close / medium / wide**.

- close (`closeup`, `chestup`): full pore/subsurface detail plus the eye sentence
- medium (`fullbody`): soft even skin, no pore-level detail, no eye sentence
- wide (`wide`): **no face, skin, or eye micro-detail at all** — instead an explicit
  "reads at true distance scale" clause

Reason: asking for visible pores in a wide shot makes generators enlarge and oversharpen the
face until the figure's head-to-body proportion breaks. The buckets only ever *cap* detail —
a toggle the user turned off stays off.

### Zoom slider removed (Cinema V4.2)
Focal length now speaks only to lens character (perspective compression), and figure size
comes exclusively from shot type. Two controls were fighting over the same output. Do not
re-add a zoom control.

### Aspect ratio removed from Character Maker
Character Maker outputs are reference sheets with a fixed intended canvas
(`CHARMAKER_OUTPUTS[].aspect` is descriptive metadata only). Letting the user override it
broke the panel grids.

### Flat-grade lock for all Character Maker asset outputs
`FLAT_GRADE_CLOSE` forces mid-gray seamless backdrop and shadowless frontal light on every
Character Maker output. Reference assets must be relightable downstream, so baked-in
directional light is a defect. `flatUniform(n)` in `App.jsx` rewrites two phrases of that
constant for multi-panel sheets so the flatness reads as "identical across all N panels".

### Reference-lock toggles use one shared clause
`REF_ANCHOR_CLAUSE` / `refAnchor(handle)`. When more than one person could be in frame, the
optional handle prefixes the clause so the anchor attaches to the right figure.
`OUTFIT_ANCHOR_CLAUSE` does the same job for wardrobe. Cinema, Character Maker, and
Storyboard all use these — never write a fourth variant.

### Anti-text clause on every sheet output
`ANTI_TEXT_CLAUSE`. Generators love to render panel numbers and labels into reference sheets.

### Anti-acne clause inside the realism block
`REALISM_CLOSE` and `FLAT_GRADE_CLOSE` both ask for fine flattering texture and explicitly
exclude acne, blemishes, and enlarged pores. Asking for "realistic skin" without this
produces blemished faces.

### Character sheet layout is asymmetric, not a 3×2 grid
Current shipped layout: left half is two full-height body columns (front, back); right half is
a 2×2 of four headshot cells (left profile, right profile, front face closeup, detail).
Panels 3 and 4 carry an explicit "must never face the same direction" instruction because
generators mirror profiles.

### Outfit sheet has two neckline modes
`cmNeckline` = `closed` or `open`, producing two very different left-panel descriptions
(invisible-body ghost mannequin vs. clean flat mannequin cut). Both variants spend many words
forbidding gore, fading, blur, and ghosting at the cut. That verbosity is the point.

### Turnaround output removed from Character Maker
Superseded by the character sheet.

---

## 3. Blocking mode design (V4.3 / Phase C) — shipped

**Problem:** spatial staging inside a location cannot be expressed reliably in free text.

**Solution — the pipeline:**

1. User picks a saved location from the library.
2. App emits `LOCATION_BLOCKING_PROMPT`, which asks an external AI to map the location photo
   into 4–8 sub-areas as strict pipe-delimited lines: `N | name | x,y | description`.
3. User pastes the reply. `parseSubAreas()` parses it tolerantly (accepts `1.` / `1)` prefixes,
   markdown bullets, parenthesised coordinates, missing leading numbers) and clamps x/y to 0–100.
4. Sub-areas are stored on the **location library entry** as `location.subAreas[]`.
5. The user drags sub-area dots, character points, and the camera on a top-down `BlockingCanvas`.
6. `compileBlockingClause()` converts the geometry into qualitative prose — never numbers.
7. Named blockings are saved to `location.blockings[]` and injected into Cinema and Storyboard.

**Locked details:**

- **Axis convention:** x is 0=left → 100=right as seen from the image's camera position;
  y is 0=rear/far → 100=front/near. Stated explicitly in the extract prompt and in
  `blocking.js`.
- **Pipe-delimited format**, not JSON. LLMs emit it more reliably and the parser can be tolerant.
- **Qualitative output only.** Distances compile to "right at" / "a few steps from" / "across
  the space from" (thresholds 15 and 30); pair distance uses 20 and 45; direction uses a ±10
  deadband and never uses compass words. Image models handle relative prose far better than
  coordinates.
- **One camera point**, auto-facing a chosen subject (`blSubjectIdx`).
- **Max two characters in the V1 UI**, but stored as an array so expansion needs no migration.
- **The extract prompt lives only in the Blocking tab** — it is not duplicated anywhere else.
- **Injection is by slot, not by compiler edit.** Cinema has a `blockingSentence` slot;
  Storyboard has a `blockingClause` field per frame. Neither compiler was modified to know
  about blocking internals.
- **Cinema recompiles the clause live from stored geometry**, tracked by library id
  (`cineBlockingId` + `cineLocationId`), so editing the location's text does not break the
  blocking link. The UI warns when the text has drifted.
- **Blocking is suppressed if the Cinema location field is empty** — a spatial clause with no
  scene is nonsense.

---

## 4. Storyboard design (V4.1)

- Replaced the older "Assemble" mode; the internal id is still `assemble`.
- **Scene-level locks** (character, product, location, time, weather, lighting, direction)
  compile once into `sbSceneLocks` and are repeated into every frame.
- **Each frame compiles to a full standalone prompt**, not a diff. Generators are used one
  frame at a time, so each prompt must carry its own complete context.
- **Max 8 frames**, with duplicate and reorder controls.
- **Storyboard sheet** is a separate output: one grid image containing all frames, column
  count derived as 2 / 3 / 4 by frame count, with an explicit note when the last row is partial.
- Gutters are specified as "hairline gutters matching the surrounding image tones, no white
  lines, no visible borders" — a fix for a white-gutter regression.
- Requires both a character *and* a location to compile.

---

## 5. Other locked decisions

- **Gender fork for baseline wardrobe** — `CM_BASELINE_WARDROBE.female` / `.male`, chosen by
  `cmBaseGender`, keeps the identity plate neutral and consistent.
- **Nine curated expressions** for the expression sheet (`CHARMAKER_EXPRESSIONS_9`), hand-picked
  across all four emotional groups rather than the first nine in the list.
- **All expression labels are in English** — a past fix translated the Indonesian labels for
  consistency with the compiled output.
- **Thumbnail type auto-suggests** color treatment, text style, and layout (`THUMB_TYPES[].suggest`),
  but every suggestion stays user-overridable.
- **Brand Kit is global** and applies across Cinema, Product, Design, and Location behind a
  single `applyBrand` toggle.
- **In-memory fallback for all storage** (`memStore` in `utils/storage.js`) so the app still
  functions inside sandboxed iframes where localStorage throws.
- **Clipboard has an `execCommand` fallback** for the same reason.

---

## 6. Version history

Kept because it records *why* things changed, and because several entries describe decisions
that are invisible in the current code (removed features leave no trace).

### V1–V3 — foundation
Single-file JSX artifact. Grouped expression ChipField (`EXPRESSION_GROUPS`, four categories,
22 presets — note the state stores the `expressionPhrase` **string**, not an id, so custom
text works). Creative Context added, with `contextClause` moved to the start of the compiled
prompt. Location/Set added as the fourth mode with its own library and
`LOCATION_EXAMINE_PROMPT`. Character Placement Canvas added to Cinema. Scene Assembler added
as the fifth mode.

### Migration — monolith to Vite
JSX artifact split into `constants` / `utils` / `components` / `App.jsx`. GitHub Pages deploy
established. Resolved a **production-only Tailwind bug** where utilities compiled and the CSS
loaded, but layout classes did not apply in `vite preview` and on Pages, while the dev server
worked fine. Worth knowing if styling ever diverges between dev and prod again.

### V4.1 — Character Maker overhaul + Storyboard
Locked flat studio formula. Six-panel character sheet. Gender fork for baseline wardrobe.
Reference-lock toggle using `REF_ANCHOR_CLAUSE`, producing delta-mode prompts that stop
describing the face. Aspect ratio removed from Character Maker; Turnaround output removed.
Storyboard replaced Assemble as mode 6 — hence the surviving `assemble` id.

### V4.2 — Cinema fixes
Zoom slider removed. Resolution-aware realism in three buckets. Character-identity and outfit
reference toggles added.

### V4.3 — Blocking mode (Phase C)
Pipe-delimited extract format with a tolerant parser. Top-down canvas, one camera point
auto-facing the chosen subject, max two character points. Blockings stored on Location library
entries. Clause injection into Cinema panel 08 and Storyboard frame slots without touching
either compiler.

### V4.4 — source audit, four bugs fixed
1. Cinema blocking lookup used fragile **text equality** → switched to id tracking
   (`cineBlockingId` + `cineLocationId`). This is why the Cinema UI can warn that the location
   text drifted while keeping the blocking link alive.
2. Storyboard sheet grid rows were hardcoded → now derived from frame count.
3. Gutter wording contradicted the location backdrop.
4. The distance slider had **zero effect** on compiled prompts → removed/fixed.

Same pass: merged the two Cinema reference mechanisms, separated the shared aspect-ratio state
into per-mode state (`cineAspectId` / `prodAspectId` / `locAspectId` — the `photoAspectId`
entry in `restore()` is the migration shim for old presets), curated the expression sheet down
to nine, added gender-fork auto-sync, and translated all Indonesian expression labels to
English.

### V4.5 — "Banana Pro Director 3.0" upgrades — current, unverified
- `FLAT_GRADE_CLOSE`: flat shadowless grade replacing all directional lighting for Character
  Maker outputs.
- `SKIN_CONSISTENCY_CLAUSE` across all sheets.
- Mode 2A outfit sheet with ghost-mannequin and clean-neck-cut neckline variants.
- Visual handle inputs on all three reference toggles (`cineRefHandle`, `cmRefHandle`,
  `sbRefHandle`), so the anchor clause attaches to the right figure when several people
  are in frame.

**Status: deployed, awaiting visual verification.** See the checklist in `HANDOFF.md`.

---

## 7. V4.6 — decisions locked, not built

Do not redesign these; they were already argued through.

### Character thumbnails — option C
Canvas-downscale the reference image to roughly 96px and store it as a data URL **on the
character record** in `cps_characters_v1`.

Needs a **size guard**: skip or compress further if the encoded string exceeds a few KB.
localStorage is the only store and the quota is shared across all five `cps_*` keys, so an
unbounded data URL can break the whole app, not just thumbnails.

### Help — a modal, not an eighth tab
A single `<HelpModal />` mounted once in `App.jsx`, opened by a `?` button in the header so it
is reachable from all seven tabs. Content sourced from `cinema-prompt-studio-user-guide.md`
and rendered as static JSX sections.

**Why not a tab:** an eighth tab shifts tab indices and touches the mode switcher, the
`basePrompt` ternary chain, and the empty-state ternary — a much larger blast radius for a
feature that renders static text. The modal changes almost nothing.

Both ship as **one combined mega-prompt**.

> Content source is `docs/USER_GUIDE.md`, now in the repo.
>
> **Watch the ordering.** The guide is written in *learning* order (Character Maker second,
> because assets come first), while the tab bar renders Character Maker **last**. The guide's
> section headings deliberately carry no tab numbers for this reason. If the Help modal adds
> navigation, either follow the tab bar order or keep the explanatory note at the top — do not
> silently renumber.
