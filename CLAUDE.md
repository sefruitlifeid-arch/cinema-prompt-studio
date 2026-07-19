# Cinema Prompt Studio

A React/Vite single-page app that compiles UI selections into copy-paste-ready **text prompts**
for external AI image generators. It never generates images — no backend, no API calls, no auth.
Output is always text on the clipboard.

**Read `docs/HANDOFF.md` before starting any work.** It carries the current state, the open
items, and the reasoning that does not exist in the code.

---

## Working rule

**Discuss first, execute second.** Present the plan and the exact changes you intend to make,
then wait for explicit approval. Unrequested refactors, renames, dependency additions, and
"while I was in there" cleanups are failures even when the result is better.

Escalate after two failed attempts rather than retrying the same approach.

---

## Critical warnings

1. **Do not shorten or "clean up" the prompt constants** in `src/constants/data.js` —
   `FLAT_GRADE_CLOSE`, `REALISM_CLOSE`, `SKIN_CONSISTENCY_CLAUSE`, `ANTI_TEXT_CLAUSE`, the
   reference-anchor clauses, and the Character Maker panel descriptions. They look repetitive.
   Every negation in them was added to defeat a specific generator artifact. Shortening them
   degrades output invisibly — the code still runs, the images just get worse.

2. **`vite.config.js` uses `base: '/cinema-prompt-studio/'` and that is correct.**
   `README.md` and the progress doc both claim `base: './'`. Both are wrong. Do not change the
   config to match them; it breaks the GitHub Pages deploy.

3. **The Storyboard tab's internal mode id is `assemble`** — a leftover from the old Scene
   Assembler. Saved presets store `mode: "assemble"`. Renaming it without a migration silently
   orphans every saved Storyboard preset in users' localStorage.

4. **`npm run preview` is mandatory before claiming a visual fix works.** Grepping the source
   is not verification. A past low-tier edit to the gutter wording broke the sheet compiler and
   passed a grep check.

---

## Further documentation

Read on demand, not every session:

- `docs/HANDOFF.md` — start here: current state, open items, next steps
- `docs/PRODUCT_DECISIONS.md` — why each locked decision exists; version history; V4.6 plan
- `docs/FEATURE_STATUS.md` — per-feature status and known limitations
- `docs/AI_INSTRUCTIONS.md` — build strategy, surgical replacement discipline, model tiering
- `docs/TODO.md` — ranked backlog with complexity and dependencies
- `docs/USER_GUIDE.md` — end-user guide; content source for the planned V4.6 Help modal
