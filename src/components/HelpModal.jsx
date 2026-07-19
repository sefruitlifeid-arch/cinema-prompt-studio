import React from "react";
import { X } from "lucide-react";
import { COLORS, fDisplay, fBody } from "../constants/theme";

const TOC = [
  { id: "bigidea", label: "Big Idea" },
  { id: "cinema", label: "1 · Cinema" },
  { id: "character", label: "2 · Character" },
  { id: "product", label: "3 · Product" },
  { id: "location", label: "4 · Location" },
  { id: "design", label: "5 · Design" },
  { id: "storyboard", label: "6 · Storyboard" },
  { id: "blocking", label: "7 · Blocking" },
  { id: "global", label: "Global" },
  { id: "cheatsheet", label: "Cheat-sheet" },
];

const CM_ROWS = [
  ["Identity plate (hero)", "One clean medium-shot portrait, neutral wardrobe, mid-gray studio", "Make this FIRST. This image becomes your character's canonical face reference"],
  ["Character sheet", "One image, 6 panels: front body, left profile, back body, right profile, face close-up, detail shot (pick via chip)", "The all-angles asset — generate it with the hero image attached"],
  ["Full body + outfit", "One full-body shot in a styled outfit", "Base look reference"],
  ["Outfit sheet", "Body-only panels (head out of frame) + one face anchor panel", "For video tools: outfit locked, identity taken from the single face panel"],
  ["Expression sheet", "Grid of expressions, neutral wardrobe", "Emotion reference"],
];

function H({ id, children }) {
  return (
    <h3 id={id} style={{ fontFamily: fDisplay, color: COLORS.paper, fontWeight: 700, fontSize: 17, marginTop: 26, marginBottom: 8, scrollMarginTop: 12 }}>
      {children}
    </h3>
  );
}
function P({ children }) {
  return <p style={{ fontFamily: fBody, color: COLORS.steel, fontSize: 13.5, lineHeight: 1.6, marginBottom: 10 }}>{children}</p>;
}
function LI({ children }) {
  return <li style={{ fontFamily: fBody, color: COLORS.steel, fontSize: 13.5, lineHeight: 1.55, marginBottom: 6 }}>{children}</li>;
}
const strong = (t) => <span style={{ color: COLORS.paper, fontWeight: 600 }}>{t}</span>;

export function HelpModal({ open, onClose, section }) {
  const bodyRef = React.useRef(null);

  // Escape to close — listener bound to open state, cleaned up on unmount.
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock the page behind the modal while it is open.
  React.useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // On open with a target section, jump straight to it (instant, no smooth).
  // Deferred one frame so the flex body has resolved its height before we scroll.
  React.useEffect(() => {
    if (!open) return undefined;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = bodyRef.current;
        if (!el) return;
        const target = section && el.querySelector(`#${section}`);
        if (target) el.scrollTop += target.getBoundingClientRect().top - el.getBoundingClientRect().top;
        else el.scrollTop = 0;
      });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [open, section]);

  if (!open) return null;

  const scrollTo = (id) => {
    const el = bodyRef.current;
    const target = el && el.querySelector(`#${id}`);
    if (target) el.scrollTop = target.offsetTop;
  };

  const th = { fontFamily: fDisplay, color: COLORS.steel, fontSize: 11, textAlign: "left", padding: "8px 10px", borderBottom: `1px solid ${COLORS.panelBorder}`, textTransform: "uppercase", letterSpacing: "0.06em" };
  const td = { fontFamily: fBody, color: COLORS.steel, fontSize: 12.5, lineHeight: 1.5, padding: "8px 10px", borderBottom: `1px solid ${COLORS.panelBorder}`, verticalAlign: "top" };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full"
        style={{ maxWidth: "42rem", maxHeight: "85vh", backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}`, borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {/* Sticky top bar */}
        <div style={{ flexShrink: 0, borderBottom: `1px solid ${COLORS.panelBorder}`, backgroundColor: COLORS.panel }}>
          <div className="flex items-center justify-between" style={{ padding: "12px 16px" }}>
            <span style={{ fontFamily: fDisplay, color: COLORS.paper, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 13 }}>User Guide</span>
            <button onClick={onClose} title="Close" style={{ color: COLORS.steel, padding: 4 }}><X size={16} /></button>
          </div>
          <div className="flex" style={{ gap: 6, overflowX: "auto", padding: "0 16px 10px", whiteSpace: "nowrap" }}>
            {TOC.map((t) => (
              <button key={t.id} onClick={() => scrollTo(t.id)} style={{ flexShrink: 0, fontFamily: fBody, fontSize: 11.5, color: COLORS.amber, border: `1px solid ${COLORS.amberDim}`, borderRadius: 5, padding: "3px 9px" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div ref={bodyRef} style={{ flex: 1, minHeight: 0, position: "relative", overflowY: "auto", padding: "8px 20px 28px" }}>
          <P>Cinema Prompt Studio doesn't generate images. It builds {strong("professional, copy-paste-ready prompts")} for external AI image tools (Seedance, Nano Banana, Higgsfield, etc.). You make selections in the UI; the app compiles them into one carefully structured prompt; you copy it into your AI tool — together with any reference images the prompt expects.</P>
          <P>Everything you save (characters, products, locations, brand kit, presets) is stored in your browser on this device.</P>

          <H id="bigidea">The big idea: build assets first, then shoot</H>
          <P>The app works like a small production studio:</P>
          <ol style={{ paddingLeft: 20, marginBottom: 10 }}>
            <LI>{strong("Create your assets")} — a character (Character Maker), a product (Product Photo), a location (Location / Set). Each gets saved to its library.</LI>
            <LI>{strong("Lock them with reference images")} — generate the asset once, save the image in your AI tool, and from then on always attach it when generating. The app's "Reference attached" toggles switch prompts into <em>anchor mode</em> so the AI copies identity from your image instead of re-imagining it.</LI>
            <LI>{strong("Shoot")} — compose single cinematic stills (Cinema/Portrait), multi-shot scenes (Storyboard), or staged camera setups (Blocking).</LI>
          </ol>
          <P>You can use any tab standalone, but this order is what makes faces, outfits, and places stay consistent across every image you make.</P>

          <H id="cinema">Tab 1 — Cinema / Portrait</H>
          <P>{strong("What it's for:")} one cinematic still — your "hero shot".</P>
          <P>You control the full camera rig (lens, sensor, focal length, aperture), genre, lighting (direction, quality, color temperature), the character (from your library or described fresh), their action, outfit, expression, an optional product in hand, the location, and framing: shot type, camera orbit, and a drag canvas for where the character sits in frame.</P>
          <P>{strong("Key concepts:")}</P>
          <ul style={{ paddingLeft: 20, marginBottom: 10, listStyle: "disc" }}>
            <LI>{strong("Shot type controls figure size")} (close-up → wide). {strong("Focal length controls lens character")} (compression, distortion) — not size. Pick shot type first.</LI>
            <LI>Realism detail auto-adapts to shot type: close-ups get full skin/eye micro-detail; wide shots deliberately drop face detail so distant figures don't morph.</LI>
            <LI>{strong("Character reference attached")} toggle: ON when you attach your character's saved image in the AI tool. {strong("Outfit as attached reference")}: ON when you attach an outfit sheet. Use both for maximum consistency.</LI>
            <LI>If your chosen location has saved Blockings (see Tab 7), pick one to stage exactly where the character and camera are.</LI>
          </ul>
          <P>{strong("Output:")} one prompt → one image.</P>

          <H id="character">Tab 2 — Character Maker</H>
          <P>{strong("What it's for:")} creating a reusable character asset with a consistent face.</P>
          <P>Build identity with attribute chips (or extract it from a photo using the Examine helper), pick a gender (sets the neutral baseline wardrobe), then choose an output type:</P>
          <div style={{ overflowX: "auto", marginBottom: 10 }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 460 }}>
              <thead><tr><th style={th}>Output</th><th style={th}>What you get</th><th style={th}>When to use</th></tr></thead>
              <tbody>
                {CM_ROWS.map((r, i) => (
                  <tr key={i}><td style={{ ...td, color: COLORS.paper, fontWeight: 600, whiteSpace: "nowrap" }}>{r[0]}</td><td style={td}>{r[1]}</td><td style={td}>{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>Background and lighting are locked (mid-gray studio, soft diffused light) — that's intentional: assets must be clean and evenly lit.</P>
          <P>{strong("The consistency workflow (important):")}</P>
          <ol style={{ paddingLeft: 20, marginBottom: 10 }}>
            <LI>Generate the {strong("Identity plate")} first. Save the image.</LI>
            <LI>Turn ON {strong("\"Reference image locked\"")}. Prompts now stop describing the face and instead anchor to your attached image.</LI>
            <LI>Generate the character sheet, outfit sheets, expressions — always attaching the identity plate in your AI tool.</LI>
            <LI>{strong("Save to Character Library")} — the character is now available in Cinema, Storyboard, and beyond.</LI>
          </ol>
          <P>{strong("Tip:")} multi-panel sheets are the hardest thing for AI models. If a sheet comes out with duplicated or broken panels, regenerate — 2–3 attempts is normal — and use the model that handles grids best for you.</P>

          <H id="product">Tab 3 — Product Photo</H>
          <P>{strong("What it's for:")} product shots as assets.</P>
          <P>Describe the product (or extract from a photo), set material, lighting, background, and angle. Output types: {strong("beauty shot")}, {strong("clean extraction")} (for cutouts), {strong("multi-angle sheet")} (one image), or {strong("angle set")} (6 separate prompts). Save products to the library — they can then be placed into a character's hands in Cinema, or into Storyboard scenes.</P>

          <H id="location">Tab 4 — Location / Set</H>
          <P>{strong("What it's for:")} places as assets.</P>
          <P>Describe the location (or extract from a photo), set time of day and weather. Outputs: {strong("establishing shot")}, {strong("location sheet")} (one 2×2 image), or {strong("empty plate")} (no people — clean for compositing). Save to the Location library, then reuse the exact same place across Cinema shots and Storyboard scenes.</P>

          <H id="design">Tab 5 — Design / Thumbnail</H>
          <P>{strong("What it's for:")} graphic pieces — thumbnails, covers, promo frames.</P>
          <P>Write the brief, pick a thumbnail type (auto-suggests color/text/layout), format, layout, render style, and color treatment. Add headline + sub-label text and drag them exactly where you want on the text canvas (with rotation). This is the tab where text IS supposed to appear in the image — everywhere else text is banned.</P>

          <H id="storyboard">Tab 6 — Storyboard</H>
          <P>{strong("What it's for:")} a multi-shot scene with continuity.</P>
          <P>Set the {strong("scene level")} once: character, location, optional product (from libraries), time of day, weather, scene lighting/mood, scene direction, aspect ratio. Then add up to {strong("8 frames")}; each frame changes only the deltas: shot type, camera angle, action, expression, character placement. Duplicate a frame and tweak it — that's the fastest way to build shot sequences.</P>
          <P>{strong("Outputs:")}</P>
          <ul style={{ paddingLeft: 20, marginBottom: 10, listStyle: "disc" }}>
            <LI>{strong("Copy per frame")} — each frame is a full standalone prompt (locks repeated every time, because AI tools have no memory between generations). This is your production output.</LI>
            <LI>{strong("Copy storyboard sheet")} — one prompt → one grid image of the whole scene. Use it as a previz overview.</LI>
          </ul>
          <P>Turn on {strong("\"Reference images locked\"")} and attach your character's identity plate on every generation — that's what keeps the same face across all 8 shots.</P>

          <H id="blocking">Tab 7 — Blocking</H>
          <P>{strong("What it's for:")} staging — deciding exactly where characters and the camera are inside a location.</P>
          <ol style={{ paddingLeft: 20, marginBottom: 10 }}>
            <LI>Pick a saved location.</LI>
            <LI>Copy the {strong("extract prompt")}, paste it into your AI tool together with the location's image. It replies with a list of sub-areas and their map positions.</LI>
            <LI>Paste the reply back → the app draws a {strong("top-down map")} of your location.</LI>
            <LI>Drag character points (up to two) and the camera point. The camera always faces the character you select as subject.</LI>
            <LI>Save the blocking with a name (e.g. "Scene 3 — argument at the door"). It's stored on the location itself.</LI>
          </ol>
          <P>Saved blockings then appear as options in Cinema (panel 08) and on each Storyboard frame — one tap injects precise staging language ("camera near the doorway, facing the character at the window") into the prompt.</P>

          <H id="global">Global features (work in every tab)</H>
          <ul style={{ paddingLeft: 20, marginBottom: 10, listStyle: "disc" }}>
            <LI>{strong("Brand Kit")} — store brand name, palette, mood, and style once; toggle "Apply brand kit" to inject it into any mode's prompt.</LI>
            <LI>{strong("Creative Context")} — frames the whole prompt as a medium (film set, theater, VFX, cartoon, comic, fantasy...). Placed at the very start of the prompt because AI models weight the opening heavily.</LI>
            <LI>{strong("Manual Instruction")} — free text appended verbatim at the end of every prompt. Your escape hatch.</LI>
            <LI>{strong("Presets")} — snapshot the entire app state per mode; save, load, delete.</LI>
          </ul>

          <H id="cheatsheet">Quick workflow cheat-sheet</H>
          <P>{strong("\"I want one beautiful shot of my character\":")} Character Maker (hero → ref lock → save) → Cinema (pick character, ref toggle ON, attach image).</P>
          <P>{strong("\"I want a scene of 5 shots\":")} assets first (character + location) → Storyboard (scene locks → 5 frames → copy per frame, attach references every time).</P>
          <P>{strong("\"I want the character exactly HERE in my location\":")} Location (save it) → Blocking (extract → place points → save) → Cinema or Storyboard (pick the blocking).</P>
          <P>{strong("Golden rules:")}</P>
          <ol style={{ paddingLeft: 20, marginBottom: 4 }}>
            <LI>Generate the identity plate before anything else about a character.</LI>
            <LI>Once a reference exists, always attach it and always keep the ref toggle ON.</LI>
            <LI>Multi-panel sheets sometimes need 2–3 attempts — that's the model, not you.</LI>
            <LI>If a prompt result fights you, add one line in Manual Instruction rather than fighting the chips.</LI>
          </ol>
        </div>
      </div>
    </div>
  );
}
