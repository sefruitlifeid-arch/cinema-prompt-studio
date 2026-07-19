# AI_INSTRUCTIONS — how to work on this project

Written for whichever AI picks this up next (Codex, Claude, GPT, Gemini). These are the
owner's actual working rules, learned from prior sessions. Following them matters more than
being fast.

---

## Rule 1 — Discuss first, execute second

**The owner's standing instruction is: do not execute anything before they decide.**

Present the plan, the tradeoffs, and the exact changes you intend to make. Wait for explicit
approval. Then write code. An unrequested "I went ahead and also refactored X" is a failure,
even if X is better.

This applies to refactors, dependency additions, file splits, renames, and prompt-text edits.

## Rule 2 — Preserve the prompt constants

`FLAT_GRADE_CLOSE`, `REALISM_CLOSE`, `SKIN_CONSISTENCY_CLAUSE`, `ANTI_TEXT_CLAUSE`,
`REF_ANCHOR_CLAUSE`, `OUTFIT_ANCHOR_CLAUSE`, and the Character Maker panel descriptions are
long, repetitive, and appear to contain redundant negations ("no blur, no ghosting, no fade,
no transparency…").

Every one of those negations was added because a generator produced that exact artifact.
Shortening them for elegance regresses output quality invisibly — the code still runs, the
images just get worse. Do not touch them unless asked.

## Rule 3 — Commit each phase independently

Multi-phase work gets one commit per phase. If phase 3 fails, phases 1 and 2 remain clean and
deployed. Never bundle unrelated changes.

## Rule 4 — Visual verification is mandatory

`npm run preview` and look at the actual production build. Grepping the source to confirm a
change landed is **not** verification. A prior regression (white gutters in sheet output)
passed a grep check and shipped broken.

For prompt-output changes, copy the compiled prompt and read it end to end.

## Rule 5 — Surgical string replacement, with anchors

The preferred build strategy for `App.jsx` is atomic Python replacement, not hand-editing:

```python
src = open(path).read()
edits = [
    ("name of edit", old_string, new_string),
    ...
]
for name, old, new in edits:
    if old not in src:
        print(f"✗ {name}")   # abort, do not write
    else:
        src = src.replace(old, new, 1)
        print(f"✓ {name}")
```

Then verify brace/bracket balance, stage to `/tmp/`, and only copy to the real path after
every edit in the audit passes.

**When an exact match fails, do not guess.** Find a nearby known-good anchor and print the
real text:

```python
idx = src.index("some_reliable_anchor")
print(repr(src[idx:idx+400]))
```

Construct the replacement from what `repr()` actually shows. Whitespace, smart quotes, and
line breaks are the usual culprits, and memory of "what the string should look like" is the
usual cause of failure.

## Rule 6 — Escalate after two failures

If the same task fails twice at the same approach or model tier, stop and escalate rather
than retrying. The owner runs a deliberate cost ladder:

- **Premium tier** — architecture and design decisions
- **Mid tier** — complex implementation phases
- **Low tier** — genuinely small, surgical, single-string edits only

A low-tier model attempting a multi-file change is how the white-gutter regression happened.

## Rule 7 — Recovery is revert-plus-reapply

When an edit introduces a regression, revert to the last known-good state and reapply the
change deliberately with a strict diff review. Do not patch forward on top of a broken tree.

## Rule 8 — Prefer a deterministic mega-prompt over open-ended tasks

Implementation requests should arrive as a complete spec with explicit before/after strings
and a verifiable test block, not as "make the storyboard better".

---

## Project-specific technical rules

- **No new dependencies without justification.** Current runtime deps are exactly:
  `react`, `react-dom`, `lucide-react`. Keep it that way.
- **No state management library, no router, no CSS framework beyond Tailwind v4.**
- **Do not change `vite.config.js` `base`.** It is `/cinema-prompt-studio/` for GitHub Pages.
  The README contradicts this and the README is wrong.
- **Do not rename mode ids.** `assemble` is the Storyboard tab. Renaming it orphans saved
  presets in users' localStorage. If a rename is truly needed, ship a migration in `restore()`.
- **localStorage keys are `cps_*_v1`.** Changing an entry's shape requires a defensive read
  (default missing fields) or a key bump. Follow the existing pattern:
  `(entry.blockings) || []`.
- **New prompt text belongs in `constants/data.js`,** not inline in `App.jsx`.
- **New pure text transforms belong in `utils/phrases.js`.**
- **Injection stays slot-based.** To feed a new clause into Cinema or Storyboard, add a slot
  to the array being joined — do not rewrite the compiler to know about the new feature's
  internals. This is why blocking injection didn't disturb either compiler.
- **Everything must work one-handed on a phone.** Chips, drag canvases, large tap targets.
