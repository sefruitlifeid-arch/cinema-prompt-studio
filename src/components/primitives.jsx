import React from "react";
import { Copy, Check } from "lucide-react";
import { COLORS, fDisplay, fBody, fMono } from "../constants/theme";

export function Eyebrow({ children }) {
  return (
    <div className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.15em" }}>
      {children}
    </div>
  );
}

export function Panel({ children }) {
  return (
    <div className="rounded-lg p-5 mb-5" style={{ backgroundColor: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
      {children}
    </div>
  );
}

export function Chip({ active, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="px-3 py-1.5 rounded text-sm mr-2 mb-2 transition-colors"
      style={{
        fontFamily: fBody,
        backgroundColor: active ? COLORS.amber : "transparent",
        color: active ? COLORS.console : COLORS.steel,
        border: `1px solid ${active ? COLORS.amber : COLORS.panelBorder}`,
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

// Chips + custom: flat or grouped (grouped=true expects [{group, items:[{id,label,phrase}]}])
export function ChipField({ options, value, onChange, placeholder, rows = 2, grouped = false }) {
  if (grouped) {
    return (
      <div>
        {options.map((g) => (
          <div key={g.group} className="mb-2">
            <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>{g.group}</div>
            <div className="flex flex-wrap">
              {g.items.map((o) => (
                <Chip key={o.id} active={value === o.phrase} onClick={() => onChange(o.phrase)}>{o.label}</Chip>
              ))}
            </div>
          </div>
        ))}
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          className="w-full rounded p-3 text-sm resize-none mt-1"
          style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }}/>
      </div>
    );
  }
  const activeOpt = options.find((o) => o.phrase === value);
  return (
    <div>
      <div className="flex flex-wrap">
        {options.map((o) => (
          <Chip key={o.id || o.label} active={!!activeOpt && (o.id || o.label) === (activeOpt.id || activeOpt.label)} onClick={() => onChange(o.phrase)} title={o.desc}>
            {o.label}
          </Chip>
        ))}
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full rounded p-3 text-sm resize-none mt-1"
        style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }}/>
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-start w-full text-left py-2" style={{ fontFamily: fBody }}>
      <span className="mt-0.5 mr-3 flex-shrink-0 rounded-full transition-colors" style={{ width: 34, height: 18, backgroundColor: checked ? COLORS.amber : COLORS.panelBorder, position: "relative" }}>
        <span className="absolute rounded-full transition-all" style={{ width: 14, height: 14, top: 2, left: checked ? 18 : 2, backgroundColor: checked ? COLORS.console : COLORS.steel }} />
      </span>
      <span>
        <span className="block text-sm" style={{ color: COLORS.paper }}>{label}</span>
        <span className="block text-xs" style={{ color: COLORS.steel }}>{description}</span>
      </span>
    </button>
  );
}

// Collapsible examine-prompt helper (copy → paste into external AI with an image → paste result back).
export function ExamineHelper({ open, setOpen, copied, onCopy, prompt, hint, linkLabel }) {
  return (
    <div className="mt-2">
      <button onClick={() => setOpen(!open)} className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, textDecoration: "underline" }}>
        {open ? "Hide" : linkLabel}
      </button>
      {open && (
        <div className="mt-2 rounded p-3" style={{ backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}` }}>
          <p className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>{hint}</p>
          <p className="text-xs mb-2 p-2 rounded" style={{ fontFamily: fMono, color: COLORS.paper, backgroundColor: COLORS.panel, lineHeight: 1.5 }}>{prompt}</p>
          <button onClick={onCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.amber, color: COLORS.console, fontWeight: 600 }}>
            {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "Copied" : "Copy extract prompt"}
          </button>
        </div>
      )}
    </div>
  );
}
