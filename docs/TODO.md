# TODO — Cinema Prompt Studio

Ranked. Each item lists reason, complexity, and dependencies.

---

## Recently shipped

**V4.7 — body proportion control + anti-distortion.** Shipped 7 Aug 2026 as four independent
commits: `a5208a7` (V4.7a), `95f744d` (V4.7b), `6cf2dd5` (V4.7c), `380d805` (V4.7d). See item 4
below for the locked decisions and, importantly, the list of places where the shipped code
deliberately differs from the written spec.

**V4.6 — character thumbnails + in-app Help modal.** Both commits landed and are on `main`:
`eda306b` (V4.6a, thumbnails via `src/utils/thumb.js` + shared `src/components/CharChip.jsx`)
and `99d1f75` (V4.6b, `src/components/HelpModal.jsx` opened from the header **Help** button,
context-aware to the active tab). Shipped exactly to the locked spec — see `docs/CONTEXT.md`
Part 5 for the spec and the two implementation notes discovered during the build.

---

## Immediate

### 1. Verify V4.5 flat grade results — **DONE for identity plate + character sheet**
**Reason:** V4.5 is deployed but its central change — the flat shadowless grade and the
skin-consistency clause — had never been checked against real generated output. Until it was,
every downstream Character Maker change was built on an unverified base.
**Status:** Verified 4 Aug 2026 through Nano Banana Pro. Identity plate **PASS** — no
directional shadow under nose or chin, no readable key direction, no cheek hotspot, flat even
mid-gray backdrop. 6-panel character sheet **PASS on both flat grade and skin tone** — all six
panels lit uniformly, no profile headshot picked up a side key, and skin tone reads as one
person across front body, back body, both profiles, face close-up, and the hand detail panel.
The V4.5 skin consistency clause works.
**Still outstanding:** outfit sheet (Mode 2A, both neckline variants) and expression sheet.
Three minor non-blocking findings from the same session are recorded under *V4.8 candidates*
below — none is a flat-grade failure.

### 2. Test Blocking mode end-to-end — **current top item**
**Reason:** The whole path exists in code but has never been run through with a real location
photo and a real AI reply. `parseSubAreas()` is deliberately tolerant (bullets, `1.` / `1)`
prefixes, parenthesised coordinates) but that tolerance has only ever been tested against
hand-written input.
**Complexity:** No code, unless it surfaces a parser bug.
**Dependencies:** A saved location with a reference photo.

### 3. Fix the README base-path line — **DONE**
**Reason:** `README.md` and the chat-side progress doc both claimed `base: './'` while `vite.config.js`
actually uses `base: '/cinema-prompt-studio/'`. Appearing twice made it read as confirmed fact,
and anyone "fixing" the config to match would break the Pages deploy.
**Status:** Resolved. `README.md` was corrected in `4679025`; the chat-side progress doc was
corrected when it was folded into `docs/PROGRESS.md`. `CLAUDE.md` warning #2 stays as a guard.

---

## Short term

### 4. V4.7 — body proportion control + anti-distortion — **SHIPPED 7 Aug 2026**
**Reason:** Proportions go wrong — sometimes "bogel" (chibi/short), sometimes head-to-body ratio
off. It surfaces specifically with **extracted** characters in **Cinema at unusual camera
angles**, for two stacked reasons: the Examine prompt captures only facial identity, so an
extracted character enters Cinema with a detailed face and an empty body and the model invents
proportions; and non-eye-level angles then bake that perspective distortion into the anatomy
itself. The "Character reference attached" toggle does *not* fix it — the identity plate is a
medium shot, so only the face is anchored. Full design in `docs/CONTEXT.md` Part 5 item 4 and
`docs/PROGRESS.md` §6b.
**Complexity:** Medium-to-high. Scope spans the Examine prompt, the character record shape, and
the Cinema compiler. Three parts — height chips plus an optional auto-syncing cm field, and build
chips, compiled to a head-height ratio; a toggleable anti-bogel guard (default ON) on full-body
Character Maker output; an angle-conditional Cinema anti-distortion clause. Plus a
`proportionClause` field persisted on the character record and a "Set proportions" button to
patch already-saved entries.

**Decisions — LOCKED 6 Aug 2026.** Settled; do not relitigate.

- **A — LOCKED: chips + optional manual cm input.** Height chips (petite / average / tall /
  very tall) plus an optional cm field.
- **A2 — LOCKED: auto-sync.** Entering a cm value automatically moves the chip to the matching
  bracket, so chip and cm can never contradict. Same pattern as the V4.4 gender-fork auto-sync.
  The **chip remains the source of the head-height ratio**; cm is carried into the prompt as
  reinforcement.
- **B — LOCKED: toggleable, default ON.** The anti-bogel guard is a toggle, not a permanent
  constant. This departs from the locked-formula pattern deliberately, so Creative Context modes
  like cartoon and fantasy can use non-realistic proportions. Default ON so the safe behaviour is
  the baseline.
- **C — LOCKED: V4.7 is the next release.** No other release is in flight after V4.6 shipped, so
  V4.7 becomes the next version, and any other work that comes up rides along with it.

**Why B departs from the locked-formula pattern.** Height data (chips/cm) tells the model *how
tall* the character is; the anti-bogel guard tells it *not to break* the head-to-body ratio.
Those are independent — a model can render 180cm at 5.5 head-heights, which is still bogel, just
tall. The guard also carries the "consistent proportions across all panels" clause, which nothing
else covers. So it cannot be folded into the height phrasing; it survives as its own toggle.

**Shipped 7 Aug 2026** as four independent commits:
`a5208a7` (V4.7a — proportion chips, cm auto-sync, `proportionClause` persisted),
`95f744d` (V4.7b — anti-bogel guard, toggleable, default ON),
`6cf2dd5` (V4.7c — angle-conditional anti-distortion guard in the Cinema compiler),
`380d805` (V4.7d — Examine estimates proportions; "Set proportions" for saved characters).

**Implementation notes — where the build differs from the written spec.** Recorded because a
reader comparing the spec against the code would otherwise think something was missed.

- **`BUILD_CHIPS` was never created.** `buildProportionClause` reads the pre-existing `ID_BUILD`
  row (slim / athletic / average / stocky / heavyset), which already fed the identity paragraph.
  A second build row would have let a single prompt contradict itself. Build affects mass wording
  only and never changes the head-height number. `ID_BUILD` gained a short `mass` field; no preset
  migration was needed.
- **Cinema gained `cineCharacterId`**, mirroring Storyboard's `sbCharacterId`. Cinema previously
  held the character as free text with no link to the library record. The id is cleared when the
  user edits the identity textarea after selecting, so a hand-edited character cannot claim stale
  proportions.
- **`proportionClause` supersedes the pre-existing `refProportion` line** (originally
  `App.jsx:294`, now `:314`) when the character has one; that line still fires for characters
  without proportion data. **This pre-existing line is likely why the proportion bug was
  intermittent rather than constant** — it was already asserting "figure proportions anatomically
  correct" whenever the reference toggle was on, with no actual height anchor behind it.
- **The anti-distortion guard keys on `Math.abs(tilt) >= 25`** — the same band `anglePhrase` uses
  to decide it says "at eye level", so the guard appears exactly when the prompt stops claiming
  eye level. The spec's mention of "dutch" did not apply: this app has no roll control, only orbit
  rotation and tilt.
- **The proportion block renders in all three identity modes** — scratch, extract and
  reference-locked — not only "Build from scratch". It first rendered only in scratch, which left
  the Examine-parsed chips invisible in extract mode. A Build row appears only where the scratch
  identity row is not already showing one, so there is exactly one Build row and one Height row in
  every mode.

**Dependencies (historical):** None blocking — and with A, A2, B and C locked there was no design
gate left.
Item 1's identity-plate and character-sheet passes settle the flat grade, which is a *lighting*
concern;
V4.7 is body proportion, a separate axis, so the outstanding outfit- and expression-sheet checks
do not gate it. Item 2 is not a dependency either: it is a verification task that produces no code
V4.7 builds on, and any parser bug it surfaces would land in `src/utils/blocking.js`, which V4.7
never touches. The two do share one surface — both add sentences to the Cinema compiler's
assembly array — but they are independent sentences, a coordination detail rather than a gate.
That coordination held: a saved blocking compiles correctly alongside both new clauses.

### 5. Export / import libraries as JSON
**Reason:** Every character, product, location, blocking, and preset lives only in this
browser's localStorage. Clearing site data destroys all of it with no backup. This is the
largest standing risk in the product and far cheaper than cloud sync.
**Complexity:** Low — serialise the five `cps_*_v1` keys to a downloadable file, plus a
paste-or-upload restore. No backend.
**Dependencies:** None. Should land before cloud sync; it defines the sync payload shape and
gives users a manual bridge meanwhile. Gets more urgent once V4.6 thumbnails inflate the
stored data.

### 6. Undo / confirm on destructive actions
**Reason:** Deleting a location silently destroys its sub-areas and every blocking saved
against it, plus any Cinema link to them. No confirmation, no undo.
**Complexity:** Low for a confirm step; medium for a real undo buffer.
**Dependencies:** None. The owner has deprioritized full undo/redo — a confirm dialog is the
cheap 80%.

---

## Long term

### 7. Split `App.jsx`
**Reason:** 2,216 lines holding all state, all seven compilers, and all seven mode UIs. It is
the main reason edits need anchored string surgery instead of ordinary editing, and the main
reason low-tier models fail on it.
**Complexity:** Medium, and risky in one pass. Suggested order, one commit each:
1. Compilers → `src/compilers/*.js` as pure functions taking an explicit args object.
2. Mode UI blocks → `src/modes/*.jsx`, props drilled from `App.jsx`.
3. `App.jsx` keeps state, libraries, and layout only.
Do **not** introduce context or a reducer as part of this.
**Dependencies:** Owner approval — exactly the kind of refactor the discuss-first rule covers.
Best done *after* V4.6, since it would otherwise collide with it.

### 8. Cloud sync
**Reason:** Standing backlog item. Libraries follow the user across devices instead of being
trapped in one browser.
**Complexity:** High — it breaks the app's defining no-backend constraint. Needs a decision on
hosting, auth, and cost before any code. A hosted key-value store with magic-link login is the
smallest viable shape.
**Dependencies:** Item 5 first.

### 9. Blocking with 3+ characters
**Reason:** The V1 UI caps at two. Group scenes need more.
**Complexity:** Low-to-medium. The stored structure is already an array, so no migration. The
real work is in `compileBlockingClause` — `pairDistance` assumes exactly two characters and
must generalise to N without producing an unreadable sentence.
**Dependencies:** Item 2 (test the two-character case properly first).

### 10. Tests
**Reason:** No test runner exists. The pure functions in `utils/` — `parseSubAreas`,
`compileBlockingClause`, `realismForShot`, `anglePhrase` — are trivially testable and are
exactly where silent breakage would hurt. `parseSubAreas` in particular has a large tolerant
input surface.
**Complexity:** Low for those four; high for anything touching `App.jsx` while it is a monolith.
**Dependencies:** Adding Vitest is a new dev dependency — needs approval.

---

## V4.8 candidates (minor, unscheduled)

Observations from the 4 Aug 2026 V4.5 verification session and the 7 Aug 2026 V4.7 build.
Deliberately unnumbered so they do not disturb the ranked list above. All are **UNSCHEDULED** and
assigned to no version.

- **Backdrop not perfectly uniform across panel types.** In the 6-panel sheet the two full-body
  columns show a faint floor gradient at the bottom, while the headshot grid is perfectly flat.
  Low priority — only matters if plates must be truly neutral. **UNSCHEDULED.**
- **Right profile headshot panel is cropped tight against the frame edge.** A panel framing
  issue, not lighting. **UNSCHEDULED.**
- **Proportions were correct in this sheet — evidence only, no action needed.** Normal
  head-to-body ratio, no shortened legs. This was a scratch-built character at neutral angles,
  which supports the V4.7 diagnosis that the proportion bug is specific to **extracted**
  characters at unusual camera angles rather than a general Character Maker defect. Recorded as
  supporting evidence. The V4.7 decisions have since been locked and V4.7 has shipped.
  **UNSCHEDULED.**
- **`charSentence` produces a double period when the character text already ends in one**
  (`App.jsx:279` — `` `${character.trim()}.` ``). Pre-existing and **not a V4.7 defect**, but V4.7
  makes it common: Character Maker's auto-composed identity paragraph always ends in a period, so
  a character saved from Character Maker and used in Cinema now reads "...an athletic build.."
  **UNSCHEDULED.**

---

## Deprioritized

- **Full undo / redo** — owner decision. See item 6 for the cheap subset.

## Dead code to remove opportunistically
`polar` and `memStore` are imported into `App.jsx` and never used. `identitySource` state
exists only to translate legacy presets and has no UI — **keep its entry in `restore()`**,
that one is a live migration path.
