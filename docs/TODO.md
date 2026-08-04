# TODO — Cinema Prompt Studio

Ranked. Each item lists reason, complexity, and dependencies.

---

## Recently shipped

**V4.6 — character thumbnails + in-app Help modal.** Both commits landed and are on `main`:
`eda306b` (V4.6a, thumbnails via `src/utils/thumb.js` + shared `src/components/CharChip.jsx`)
and `99d1f75` (V4.6b, `src/components/HelpModal.jsx` opened from the header `?` button,
context-aware to the active tab). Shipped exactly to the locked spec — see `docs/CONTEXT.md`
Part 5 for the spec and the two implementation notes discovered during the build.

---

## Immediate

### 1. Verify V4.5 flat grade results
**Reason:** V4.5 is deployed but its central change — the flat shadowless grade and the
skin-consistency clause — has never been checked against real generated output. Until it is,
every downstream Character Maker change is built on an unverified base.
**Complexity:** No code. `npm run preview`, generate five outputs, judge them. Full checklist
in `HANDOFF.md`.
**Dependencies:** None. **Do this before anything else.**

### 2. Test Blocking mode end-to-end
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

### 4. V4.7 — body proportion control + anti-distortion
**Reason:** Proportions go wrong — sometimes "bogel" (chibi/short), sometimes head-to-body ratio
off. It surfaces specifically with **extracted** characters in **Cinema at unusual camera
angles**, for two stacked reasons: the Examine prompt captures only facial identity, so an
extracted character enters Cinema with a detailed face and an empty body and the model invents
proportions; and non-eye-level angles then bake that perspective distortion into the anatomy
itself. The "Character reference attached" toggle does *not* fix it — the identity plate is a
medium shot, so only the face is anchored. Full design in `docs/CONTEXT.md` Part 5 item 4 and
`docs/PROGRESS.md` §6b.
**Complexity:** Medium-to-high. Scope spans the Examine prompt, the character record shape, and
the Cinema compiler — weigh that against decision C. Three parts — height +
build chips compiled to a head-height ratio; an anti-bogel guard constant on full-body
Character Maker output (always-on vs toggleable is decision B); an angle-conditional Cinema
anti-distortion clause. Plus a
`proportionClause` field persisted on the character record and a "Set proportions" button to
patch already-saved entries.

**Three decisions still open — lock these before any execution:**
- **A:** chips only, or chips + optional manual cm input?
- **B:** anti-bogel guard always-on, or toggleable?
- **C:** is V4.7 its own version, or does it ride on another release?

**Dependencies:** Items 1 and 2 first. Do not start implementation until A, B and C are locked.

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
**Reason:** 2,165 lines holding all state, all seven compilers, and all seven mode UIs. It is
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

## Deprioritized

- **Full undo / redo** — owner decision. See item 6 for the cheap subset.

## Dead code to remove opportunistically
`polar` and `memStore` are imported into `App.jsx` and never used. `identitySource` state
exists only to translate legacy presets and has no UI — **keep its entry in `restore()`**,
that one is a live migration path.
