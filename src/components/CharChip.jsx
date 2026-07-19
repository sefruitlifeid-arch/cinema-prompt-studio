import React from "react";
import { COLORS, fBody } from "../constants/theme";

// Deterministic fallback swatch color + initials for characters without a thumbnail.
const FALLBACK_COLORS = ["#7A5C3E", "#3E5A7A", "#5A7A3E", "#7A3E5C", "#3E7A6E", "#6E3E7A"];

function fallbackColor(name) {
  let h = 0;
  const s = name || "";
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
}

export function charInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Small square avatar (thumb if present, else initials swatch). Reused by the
// capture preview so the fallback logic lives in exactly one place.
export function CharAvatar({ character, size = 28 }) {
  const c = character || {};
  if (c.thumb) {
    return <img src={c.thumb} alt="" className="rounded" style={{ width: size, height: size, objectFit: "cover", flexShrink: 0, display: "block" }} />;
  }
  return (
    <span className="rounded flex items-center justify-center" style={{ width: size, height: size, flexShrink: 0, backgroundColor: fallbackColor(c.name), color: "#fff", fontSize: size * 0.4, fontWeight: 700 }}>
      {charInitials(c.name)}
    </span>
  );
}

export function CharChip({ character, selected, onClick }) {
  const c = character || {};
  return (
    <button
      onClick={onClick}
      title={c.text}
      className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded text-sm transition-colors"
      style={{
        fontFamily: fBody,
        backgroundColor: selected ? COLORS.amber : "transparent",
        color: selected ? COLORS.console : COLORS.steel,
        border: `1px solid ${selected ? COLORS.amber : COLORS.panelBorder}`,
        fontWeight: selected ? 600 : 400,
      }}
    >
      <CharAvatar character={c} size={28} />
      <span>{c.name}</span>
    </button>
  );
}
