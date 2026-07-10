import React from "react";
import { COLORS, fDisplay, fBody, fMono } from "../constants/theme";
import { placementPhrase } from "../utils/phrases";

// Draggable placement canvas: X = left/right, Y = back(top)/front(bottom)
export function PlacementCanvas({ px, py, dist, setPx, setPy, setDist, ratio }) {
  const ref = React.useRef(null);
  const dragging = React.useRef(false);
  const W = 260, H = ratio ? Math.round(260 / ratio) : 160;
  const onDown = () => { dragging.current = true; };
  const onUp = () => { dragging.current = false; };
  const onMove = (e) => {
    if (!dragging.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    setPx(Math.max(0.05, Math.min(0.95, (p.clientX - rect.left) / rect.width)));
    setPy(Math.max(0.05, Math.min(0.95, (p.clientY - rect.top) / rect.height)));
  };
  const dotR = 6 + dist * 10;
  return (
    <div>
      <div ref={ref}
        onMouseDown={(e) => { onDown(); onMove(e); }} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        style={{ width: W, height: H, position: "relative", margin: "0 auto", cursor: "crosshair", touchAction: "none",
          backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 6, overflow: "hidden", userSelect: "none" }}>
        {[1/3, 2/3].map(f => <div key={"v"+f} style={{ position:"absolute",left:f*W,top:0,width:1,height:H,backgroundColor:COLORS.panelBorder,opacity:0.5 }}/>)}
        <div style={{ position:"absolute",top:H*0.33,left:0,height:1,width:W,backgroundColor:COLORS.panelBorder,opacity:0.3 }}/>
        <div style={{ position:"absolute",top:H*0.66,left:0,height:1,width:W,backgroundColor:COLORS.panelBorder,opacity:0.3 }}/>
        <span style={{ position:"absolute",top:3,left:4,fontFamily:fMono,fontSize:9,color:COLORS.steel,opacity:0.6 }}>BG</span>
        <span style={{ position:"absolute",bottom:3,left:4,fontFamily:fMono,fontSize:9,color:COLORS.steel,opacity:0.6 }}>FG</span>
        <div style={{ position:"absolute", left:px*W-dotR, top:py*H-dotR, width:dotR*2, height:dotR*2,
          borderRadius:"50%", backgroundColor:COLORS.amber, opacity:0.9, border:`2px solid ${COLORS.paper}`,
          display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
          <span style={{ fontFamily:fMono,fontSize:8,color:COLORS.console,fontWeight:700 }}>P</span>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs" style={{ fontFamily:fBody,color:COLORS.steel }}>Subject size / distance to camera</span>
          <span style={{ fontFamily:fMono,color:COLORS.amber,fontSize:12 }}>{dist > 0.6 ? "close" : dist > 0.3 ? "mid" : "far"}</span>
        </div>
        <input type="range" min={0} max={1} step={0.05} value={dist} onChange={(e) => setDist(Number(e.target.value))} className="w-full"/>
      </div>
      <div className="mt-1 rounded p-2" style={{ backgroundColor:COLORS.console,border:`1px solid ${COLORS.panelBorder}` }}>
        <span className="text-xs" style={{ fontFamily:fBody,color:COLORS.paper }}>{placementPhrase(px,py,dist)}</span>
      </div>
    </div>
  );
}

// Visual canvas to place headline + optional sub-label by dragging.
export function TextPlacement({ aspectId, blocks, activeIdx, setActiveIdx, updateBlock }) {
  const ref = React.useRef(null);
  const dragging = React.useRef(false);
  const ratios = { "16-9": 16 / 9, "9-16": 9 / 16, "1-1": 1, "4-5": 4 / 5 };
  const ar = ratios[aspectId] || 16 / 9;
  const W = 260;
  const H = Math.round(W / ar);
  const active = blocks[activeIdx];

  const onDown = () => { dragging.current = true; };
  const onUp = () => { dragging.current = false; };
  const onMove = (e) => {
    if (!dragging.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    updateBlock(activeIdx, {
      tx: Math.max(0.08, Math.min(0.92, (p.clientX - rect.left) / rect.width)),
      ty: Math.max(0.08, Math.min(0.92, (p.clientY - rect.top) / rect.height)),
    });
  };

  return (
    <div>
      <div
        ref={ref}
        onMouseDown={(e) => { onDown(); onMove(e); }}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        style={{ width: W, height: H, position: "relative", margin: "0 auto", cursor: "grab", touchAction: "none", backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 6, overflow: "hidden", userSelect: "none" }}
      >
        {[1 / 3, 2 / 3].map((f) => (
          <div key={"v" + f} style={{ position: "absolute", left: f * W, top: 0, width: 1, height: H, backgroundColor: COLORS.panelBorder, opacity: 0.5 }} />
        ))}
        {[1 / 3, 2 / 3].map((f) => (
          <div key={"h" + f} style={{ position: "absolute", top: f * H, left: 0, height: 1, width: W, backgroundColor: COLORS.panelBorder, opacity: 0.5 }} />
        ))}
        {blocks.map((b, i) => {
          if (!b.enabled) return null;
          const boxW = b.tw * W;
          const boxH = (i === 0 ? 0.16 : 0.1) * H;
          const isActive = i === activeIdx;
          return (
            <div
              key={i}
              onMouseDown={(e) => { e.stopPropagation(); setActiveIdx(i); onDown(); }}
              onTouchStart={(e) => { e.stopPropagation(); setActiveIdx(i); onDown(); }}
              style={{
                position: "absolute", left: b.tx * W - boxW / 2, top: b.ty * H - boxH / 2,
                width: boxW, height: boxH, backgroundColor: isActive ? COLORS.amber : COLORS.amberDim,
                opacity: 0.88, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                transform: `rotate(${b.rot}deg)`, overflow: "hidden", padding: "0 4px",
              }}
            >
              <span style={{ fontFamily: fDisplay, fontSize: i === 0 ? 11 : 9, color: COLORS.console, fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {(b.text || (i === 0 ? "HEADLINE" : "sub-label")).toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>{activeIdx === 0 ? "Headline" : "Sub-label"} width</span>
          <span style={{ fontFamily: fMono, color: COLORS.amber, fontSize: 12 }}>{Math.round(active.tw * 100)}%</span>
        </div>
        <input type="range" min={0.2} max={0.9} step={0.05} value={active.tw} onChange={(e) => updateBlock(activeIdx, { tw: Number(e.target.value) })} className="w-full" />
        <div className="flex items-baseline justify-between">
          <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Rotation</span>
          <span style={{ fontFamily: fMono, color: COLORS.amber, fontSize: 12 }}>{active.rot}°</span>
        </div>
        <input type="range" min={-25} max={25} step={1} value={active.rot} onChange={(e) => updateBlock(activeIdx, { rot: Number(e.target.value) })} className="w-full" />
      </div>
    </div>
  );
}

// Interactive orbit control — drag to move the camera around the subject.
export function AngleOrbit({ rotation, tilt, setRotation, setTilt }) {
  const dragging = React.useRef(false);
  const last = React.useRef({ x: 0, y: 0 });

  const onDown = (e) => {
    dragging.current = true;
    const p = e.touches ? e.touches[0] : e;
    last.current = { x: p.clientX, y: p.clientY };
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - last.current.x;
    const dy = p.clientY - last.current.y;
    last.current = { x: p.clientX, y: p.clientY };
    setRotation((prev) => (((prev + dx * 0.8) % 360) + 360) % 360);
    setTilt((prev) => Math.max(-90, Math.min(90, prev - dy * 0.6)));
  };
  const onUp = () => { dragging.current = false; };

  const cx = 100, cy = 100, R = 82;
  const az = (rotation * Math.PI) / 180;
  const el = (tilt * Math.PI) / 180;
  const x3 = Math.cos(el) * Math.sin(az);
  const y3 = Math.sin(el);
  const z3 = Math.cos(el) * Math.cos(az);
  const px = cx + R * x3;
  const py = cy - R * y3 * 0.82;
  const camScale = 0.75 + 0.45 * ((z3 + 1) / 2);
  const inFront = z3 >= 0;

  return (
    <div style={{ touchAction: "none", cursor: "grab", userSelect: "none" }} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
      <svg viewBox="0 0 200 200" width="100%" height="180" style={{ display: "block" }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#3A3025" strokeWidth="1" />
        {[0.5, 0.85].map((k, i) => (
          <ellipse key={"lat" + i} cx={cx} cy={cy} rx={R} ry={R * k} fill="none" stroke="#2A231B" strokeWidth="1" />
        ))}
        {[0.35, 0.7].map((k, i) => (
          <ellipse key={"lon" + i} cx={cx} cy={cy} rx={R * k} ry={R} fill="none" stroke="#2A231B" strokeWidth="1" />
        ))}
        {!inFront && <line x1={cx} y1={cy} x2={px} y2={py} stroke="#9C7000" strokeWidth="1.5" strokeDasharray="3 3" />}
        <circle cx={cx} cy={cy} r="12" fill="#1F1912" stroke="#7C93A0" strokeWidth="1.5" />
        <circle cx={cx} cy={cy - 3} r="3.2" fill="#7C93A0" />
        <path d={`M ${cx - 6} ${cy + 8} Q ${cx} ${cy - 1} ${cx + 6} ${cy + 8}`} fill="#7C93A0" />
        {inFront && <line x1={cx} y1={cy} x2={px} y2={py} stroke="#FFB000" strokeWidth="1.5" />}
        <g transform={`translate(${px} ${py}) scale(${camScale})`}>
          <rect x="-7" y="-6" width="14" height="12" rx="2" fill={inFront ? "#FFB000" : "#9C7000"} stroke="#14100D" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#14100D" />
        </g>
      </svg>
    </div>
  );
}
