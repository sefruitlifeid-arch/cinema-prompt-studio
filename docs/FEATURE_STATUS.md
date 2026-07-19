# FEATURE STATUS — Cinema Prompt Studio

Verified against source on 2026-07-19. Version **V4.5**. Status reflects the code, not intent.

"Complete" means the code path exists and compiles. It does **not** mean verified — see the
two open items in `HANDOFF.md`.

---

## Architecture at a glance

```
src/
├── main.jsx                  React root
├── index.css                 Tailwind v4 entry
├── App.jsx                   2,165 lines — ALL state, ALL compilers, ALL mode UI
├── constants/
│   ├── theme.js              COLORS + three font stacks
│   └── data.js               485 lines — every option list and every locked prompt constant
├── utils/
│   ├── storage.js            localStorage keys, store.read/write w/ memory fallback, copyText
│   ├── phrases.js            anglePhrase, realismForShot, placementPhrase,
│   │                         textPositionPhrase, refAnchor, polar, bladePoints
│   └── blocking.js           parseSubAreas, nearestSubArea, distance/direction qualifiers,
│                             compileBlockingClause
└── components/
    ├── primitives.jsx        Eyebrow, Panel, Chip, ChipField, Toggle, ExamineHelper
    └── canvases.jsx          PlacementCanvas, BlockingCanvas, TextPlacement, AngleOrbit
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
| Character Maker | `charmaker` | **Complete, V4.5 unverified** | Five outputs: hero identity plate, 6-panel sheet, full body + outfit, 3-panel outfit sheet (two neckline variants), 9-panel expression sheet. The V4.5 flat grade has not been visually checked. |

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
| Clipboard copy | Complete | `navigator.clipboard` with `execCommand` fallback. |
| Deploy | Complete | GitHub Actions → Pages on push to `main`. |

---

## Not built

| Feature | Status | Notes |
|---|---|---|
| Character thumbnails | **V4.6, locked not built** | Canvas-downscale to ~96px, data URL on the character record. Needs a localStorage size guard. |
| In-app Help modal | **V4.6, locked not built** | Single `<HelpModal />`, header `?` button, static JSX. Content source is `docs/USER_GUIDE.md`. |
| Export / import libraries | **Not planned yet** | The cheap mitigation for the no-cloud-sync risk. |
| Cloud sync | **Planned** | Backlog. All state is device-local; clearing browser data loses every library. |
| Image generation | **Non-goal** | Deliberately out of scope. |
| Blocking with 3+ characters | **Deferred** | Data structure already supports it; UI caps at 2. |
| Blocking in Product or Location modes | **Not planned** | Injection exists only for Cinema and Storyboard. |
| Undo / redo | **Deprioritized** | Owner decision. A confirm-on-delete step is the cheap subset. |
| Tests | **None** | No test runner, no linter config in the repo. |

---

## Known limitations

- **App.jsx is a 2,165-line monolith.** Every mode's state and JSX live in one component.
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
