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
