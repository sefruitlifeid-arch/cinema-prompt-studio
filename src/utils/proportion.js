import { HEIGHT_BRACKETS, ID_BUILD } from "../constants/data";

// V4.7 — body proportion.
//
// Decision A2: the head-height ratio always comes from the height CHIP. The cm field
// is reinforcement only, because image models have no in-frame scale reference and
// treat a bare centimetre figure as a weak hint at best. cm drives the chip via
// auto-sync; it never drives the ratio directly.

// Maps a raw cm input to a bracket id. Returns "" for empty, non-numeric, or
// non-positive input, which is what keeps a cleared cm field from disturbing the chip.
export function bracketForCm(cm) {
  const n = Number(cm);
  if (!Number.isFinite(n) || n <= 0) return "";
  const hit = HEIGHT_BRACKETS.find(
    (b) => (b.minCm == null || n >= b.minCm) && (b.maxCm == null || n <= b.maxCm)
  );
  return hit ? hit.id : "";
}

// Compiles the single proportion sentence, e.g.
//   "adult proportions of approximately 7.7 head-heights, tall athletic build,
//    approximately 178cm, long legs, natural anatomical proportions"
// Returns "" when no height chip is set — a partial clause is worse than none,
// since it would assert proportions the user never chose.
export function buildProportionClause(height, build, cm) {
  const h = HEIGHT_BRACKETS.find((b) => b.id === height);
  if (!h) return "";
  const b = ID_BUILD.find((x) => x.id === build);
  const n = Number(cm);
  const hasCm = Number.isFinite(n) && n > 0;
  return [
    `adult proportions of approximately ${h.heads} head-heights`,
    b ? `${h.adj} ${b.mass} build` : h.phrase,
    hasCm ? `approximately ${n}cm` : "",
    h.legs,
    "natural anatomical proportions",
  ]
    .filter(Boolean)
    .join(", ");
}

// V4.7 — parses the "PROPORTION | <height> | <build>" line the upgraded
// EXAMINE_PROMPT asks for. Tolerant in the same spirit as parseSubAreas: the reply
// comes back through a chat model and arrives mangled often enough that strict
// matching would be useless. Accepts bullets and numbering, "|" or ":" or ","
// separators, any case, and spaced/hyphenated/run-together spellings
// ("very tall", "very-tall", "verytall"; "heavy-set", "heavyset", "heavy set").
//
// Returns { height, build, cleaned } — `cleaned` is the reply with the PROPORTION
// line removed, so the identity paragraph never carries the marker into a prompt.
// Returns null when no usable line is found; the caller then leaves the chips alone.
const normToken = (s) => (s || "").toLowerCase().replace(/[^a-z]/g, "");

export function parseProportionReply(text, heightBrackets, buildChips) {
  const lines = (text || "").split(/\r?\n/);
  const idx = lines.findIndex((l) => /proportion/i.test(l) && normToken(l).length > "proportion".length);
  if (idx === -1) return null;

  const raw = lines[idx];
  const body = raw
    .replace(/^[\s\-*•]+/, "")
    .replace(/^\d+\s*[.)]\s*/, "")
    .replace(/proportions?/i, "");

  const tokens = body.split(/[|:,]/).map((t) => normToken(t)).filter(Boolean);
  if (!tokens.length) return null;

  const heightIds = heightBrackets.map((b) => b.id);
  const buildIds = buildChips.map((b) => b.id);
  // Match on the id and on the normalised label, so "very tall" and "heavy-set"
  // both land even though the ids are "verytall" and "heavyset".
  const findIn = (list, keyed) => (tok) => {
    const hit = list.find((o) => normToken(o.id) === tok || normToken(o.label) === tok);
    return hit && keyed.includes(hit.id) ? hit.id : "";
  };
  const asHeight = findIn(heightBrackets, heightIds);
  const asBuild = findIn(buildChips, buildIds);

  // Positional first — "average" is a valid value in BOTH lists, so order is the
  // only thing that disambiguates "PROPORTION | average | average".
  let height = "";
  let build = "";
  for (const tok of tokens) {
    if (!height && asHeight(tok)) { height = asHeight(tok); continue; }
    if (height && !build && asBuild(tok)) { build = asBuild(tok); }
  }
  if (!height && !build) return null;

  const cleaned = lines.filter((_, i) => i !== idx).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return { height, build, cleaned };
}
