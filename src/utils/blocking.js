// Blocking: parse external-AI sub-area replies and compile spatial prose.
// Axis convention: x 0=left, 100=right (seen from the default camera side);
// y 0=rear/far, 100=front/near.

// Parse "N | name | x,y | desc" lines (tolerant of "N." / "N)" prefixes,
// markdown bullets, "(x,y)" parens, and missing leading numbers).
export function parseSubAreas(text) {
  const errors = [];
  const subAreas = [];
  const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  lines.forEach((raw, idx) => {
    let line = raw.replace(/^[-*•]\s*/, "");
    line = line.replace(/^(\d+)\s*[.)]\s*/, "$1 | ");
    const parts = line.split("|").map((p) => p.trim()).filter((p, i, arr) => !(p === "" && (i === 0 || i === arr.length - 1)));
    let name, coordField, desc;
    if (parts.length >= 4) {
      [, name, coordField, ...desc] = parts;
      desc = desc.join(" | ");
    } else if (parts.length === 3) {
      [name, coordField, desc] = parts;
    } else {
      errors.push(`Line ${idx + 1}: expected "N | name | x,y | description" — got "${raw.slice(0, 60)}"`);
      return;
    }
    const m = (coordField || "").replace(/[()]/g, "").match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
    if (!m || !name) {
      errors.push(`Line ${idx + 1}: could not read "x,y" position — got "${raw.slice(0, 60)}"`);
      return;
    }
    const clamp = (v) => Math.max(0, Math.min(100, Number(v)));
    subAreas.push({
      id: `sa-${idx}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`,
      name,
      x: clamp(m[1]),
      y: clamp(m[2]),
      desc: (desc || "").trim(),
    });
  });
  if (subAreas.length < 2) {
    errors.push(`Need at least 2 valid sub-areas — parsed ${subAreas.length}.`);
    return { subAreas: [], errors };
  }
  return { subAreas, errors };
}

export function nearestSubArea(pt, subAreas) {
  let best = null;
  let bestD = Infinity;
  (subAreas || []).forEach((sa) => {
    const d = Math.hypot(sa.x - pt.x, sa.y - pt.y);
    if (d < bestD) { bestD = d; best = sa; }
  });
  return best ? { subArea: best, distance: bestD } : null;
}

export function qualDistance(d) {
  if (d < 15) return "right at";
  if (d < 30) return "a few steps from";
  return "across the space from";
}

export function pairDistance(a, b) {
  const d = Math.hypot(a.x - b.x, a.y - b.y);
  if (d < 20) return "standing close together";
  if (d < 45) return "a few steps apart";
  return "across the space from each other";
}

// Compass-free relative direction from one point toward another.
export function relativeDir(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const parts = [];
  if (dx > 10) parts.push("to the right");
  else if (dx < -10) parts.push("to the left");
  if (dy < -10) parts.push("further back");
  else if (dy > 10) parts.push("closer to the front");
  return parts.length ? parts.join(" and ") : "directly ahead";
}

// blocking: { characters: [{ x, y, label }], camera: { x, y }, subjectIdx }
export function compileBlockingClause(blocking, subAreas) {
  if (!blocking || !Array.isArray(blocking.characters) || !blocking.characters.length || !(subAreas || []).length) return "";
  const chars = blocking.characters;
  const charBits = chars.map((c) => {
    const near = nearestSubArea(c, subAreas);
    return `${c.label} is positioned ${qualDistance(near.distance)} the ${near.subArea.name}`;
  });
  let sentence = `${charBits.join("; ")}.`;
  if (chars.length === 2) {
    sentence += ` The two characters are ${pairDistance(chars[0], chars[1])}.`;
  }
  const cam = blocking.camera || { x: 50, y: 100 };
  const subject = chars[Math.min(blocking.subjectIdx || 0, chars.length - 1)];
  const camNear = nearestSubArea(cam, subAreas);
  const camSentence = `The camera is placed ${qualDistance(camNear.distance)} the ${camNear.subArea.name}, with the subject ${relativeDir(cam, subject)}, facing ${subject.label} directly.`;
  return `${sentence} ${camSentence} Spatial layout of the location kept consistent with its established geography.`;
}
