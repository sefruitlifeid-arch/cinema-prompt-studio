# FEATURE STATUS — Cinema Prompt Studio

Verified against source on 2026-07-19; V4.6 rows updated 2026-08-03. Version **V4.6**. Status
reflects the code, not intent.

"Complete" means the code path exists and compiles. It does **not** mean verified — see the
open items in `HANDOFF.md`. The V4.5 flat grade was **visually verified on 4 Aug 2026 for the
identity plate and the 6-panel character sheet** (both PASS); its outfit sheet and expression
sheet are still unverified. Blocking has still never been run end-to-end.

---

## Architecture at a glance

```
src/
├── main.jsx                  React root
├── index.css                 Tailwind v4 entry
├── App.jsx                   2,216 lines — ALL state, ALL compilers, ALL mode UI
├── constants/
│   ├── theme.js              COLORS + three font stacks
│   └── data.js               485 lines — every option list and every locked prompt constant
├── utils/
│   ├── storage.js            localStorage keys, store.read/write w/ memory fallback, copyText
│   ├── phrases.js            anglePhrase, realismForShot, placementPhrase,
│   │                         textPositionPhrase, refAnchor, polar, bladePoints
│   ├── blocking.js           parseSubAreas, nearestSubArea, distance/direction qualifiers,
│   │                         compileBlockingClause
│   └── thumb.js              makeThumb — 96px center-crop cover JPEG data URL, size-guarded
└── components/
    ├── primitives.jsx        Eyebrow, Panel, Chip, ChipField, Toggle, ExamineHelper
    ├── canvases.jsx          PlacementCanvas, BlockingCanvas, TextPlacement, AngleOrbit
    ├── CharChip.jsx          CharChip + CharAvatar — thumb-or-initials, one fallback in one place
    └── HelpModal.jsx         Context-aware user-guide modal, static JSX, no deps
```

Data flow is one-way and synchronous: `useState` → derived `useMemo` compilers → a single
`promptText` string → clipboard. No context, no reducer, no router, no async.

---

## Modes

| Mode | id | Status | Notes |
|---|---|---|---|
| Cinema / Portrait | `cinema` | **Complete** | Richest mode. Lens/sensor/focal/aperture, orbit angle canvas, composition, lighting + kelvin, expression, reference lock, outfit ref lock, product injection, character placement canvas, blocking injection, aspect, brand. |
| Product Photo | `product` | **Complete** | Four outputs: beauty, clean extraction, 6-view sheet (1 image), angle set (6 separate prompts). |
| Location / Set | `location` | **Complete** | Three outputs: establishing, 2×2 sheet, empty plate. Time-of-day × weather atmosphere. |
| Design / Thumbnail | `design` | **Complete** | Six thumbnail types with auto-suggest, drag text placement for two blocks, render styles, color treatments. |
| Storyboard | `assemble` | **Complete** | Scene locks + up to 8 frames, per-frame standalone prompts, plus a combined sheet prompt. |
| Blocking | `blocking` | **Complete, untested** | Extract → parse → drag canvas → compile → save → inject. Outputs a raw clause, not a full prompt. Never run end-to-end against a real AI reply. |
| Character Maker | `charmaker` | **Complete, V4.5 partly verified** | Five outputs: hero identity plate, 6-panel sheet, full body + outfit, 3-panel outfit sheet (two neckline variants), 9-panel expression sheet. V4.5 flat grade verified 4 Aug 2026 on the identity plate and the 6-panel sheet — both PASS, including skin tone across all six panels. Outfit sheet and expression sheet not yet visually checked. |

---

## Cross-cutting features

| Feature | Status | Notes |
|---|---|---|
| Brand Kit (global) | Complete | Name, font, palette, mood, full style ref. Single `applyBrand` toggle. Persists to `cps_brand_v1`. Not applied to Character Maker, Storyboard, or Blocking. |
| Presets (per mode) | Complete | `snapshot()` / `restore()` pair. Filtered by current mode. Blocking geometry intentionally excluded. |
| Character library | Complete | `cps_characters_v1`. Written from Cinema and from Character Maker. Read by Storyboard. |
| Product library | Complete | `cps_products_v1`. Read by Cinema (injection) and Storyboard. |
| Location library | Complete | `cps_locations_v1`. Also carries `subAreas[]` and `blockings[]` for Blocking mode. |
| Examine-prompt helpers | Complete | Six variants. Copy → run externally → paste back. |
| Creative context clause | Complete | Seven context types, prepended first. |
| Manual instruction | Complete | Appended last. |
| Multi-prompt output | Complete | Product "angle set" and multi-frame Storyboard render as separate copyable blocks. |
| Character thumbnails | Complete (V4.6a) | Optional `thumb` data URL on the character record. `makeThumb` never throws; oversized/unreadable images fall back to no thumb with an inline notice. Rendered via `<CharChip>` in Character Maker, Cinema and Storyboard. Products and locations deliberately excluded. |
| In-app Help modal | Complete (V4.6b) | Header **Help** button (`HelpCircle` icon) on all seven tabs; opens scrolled to the active tab's section. Static JSX transcription of `docs/USER_GUIDE.md`. Closes on backdrop / ✕ / Escape, locks body scroll. Zero coupling to app state. |
| Clipboard copy | Complete | `navigator.clipboard` with `execCommand` fallback. |
| Deploy | Complete | GitHub Actions → Pages on push to `main`. |

---

## Not built

| Feature | Status | Notes |
|---|---|---|
| Body proportion control | **V4.7, next release** | Height chips + optional auto-syncing cm field, plus build chips → head-height ratio; a toggleable anti-bogel guard (default ON); angle-conditional Cinema anti-distortion clause. **Decisions locked 6 Aug 2026** — see `docs/TODO.md` item 4. |
| Export / import libraries | **Not planned yet** | The cheap mitigation for the no-cloud-sync risk. |
| Cloud sync | **Planned** | Backlog. All state is device-local; clearing browser data loses every library. |
| Image generation | **Non-goal** | Deliberately out of scope. |
| Blocking with 3+ characters | **Deferred** | Data structure already supports it; UI caps at 2. |
| Blocking in Product or Location modes | **Not planned** | Injection exists only for Cinema and Storyboard. |
| Undo / redo | **Deprioritized** | Owner decision. A confirm-on-delete step is the cheap subset. |
| Tests | **None** | No test runner, no linter config in the repo. |

---

## Known limitations

- **App.jsx is a 2,216-line monolith.** Every mode's state and JSX live in one component.
  Editing it reliably requires anchored string replacement, not memory of what the code
  "should" look like.
- **No undo.** Deleting a library entry or a saved blocking is immediate and permanent.
- **Blocking geometry doesn't survive a location delete.** Deleting a location destroys its
  `subAreas` and all its `blockings`, and clears any Cinema reference to them.
- **Storyboard needs both a character and a location** before it compiles anything; the empty
  state explains this but it can read as a bug.
- **Character Maker `fullbody` and `outfitsheet` return `null` without an outfit**, which
  renders as the generic empty state.
- **Dead code:** `polar` and `memStore` are imported into `App.jsx` but unused;
  `identitySource` state exists only to migrate old presets and has no UI.
