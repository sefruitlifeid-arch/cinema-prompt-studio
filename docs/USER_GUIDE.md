# Cinema Prompt Studio — User Guide

Cinema Prompt Studio doesn't generate images. It builds **professional, copy-paste-ready prompts** for external AI image tools (Seedance, Nano Banana, Higgsfield, etc.). You make selections in the UI; the app compiles them into one carefully structured prompt; you copy it into your AI tool — together with any reference images the prompt expects.

Everything you save (characters, products, locations, brand kit, presets) is stored in your browser on this device.

---

## The big idea: build assets first, then shoot

The app works like a small production studio:

1. **Create your assets** — a character (Character Maker), a product (Product Photo), a location (Location / Set). Each gets saved to its library.
2. **Lock them with reference images** — generate the asset once, save the image in your AI tool, and from then on always attach it when generating. The app's "Reference attached" toggles switch prompts into *anchor mode* so the AI copies identity from your image instead of re-imagining it.
3. **Shoot** — compose single cinematic stills (Cinema/Portrait), multi-shot scenes (Storyboard), or staged camera setups (Blocking).

You can use any tab standalone, but this order is what makes faces, outfits, and places stay consistent across every image you make.

> **Note on ordering:** the sections below follow the *recommended learning order*, not the
> left-to-right order of the tabs in the app. The tab bar reads: Cinema / Portrait, Product
> Photo, Location / Set, Design / Thumbnail, Storyboard, Blocking, Character Maker. Character
> Maker sits last in the bar but is covered second here, because it is where most projects
> should actually start.

---

## Cinema / Portrait

**What it's for:** one cinematic still — your "hero shot".

You control the full camera rig (lens, sensor, focal length, aperture), genre, lighting (direction, quality, color temperature), the character (from your library or described fresh), their action, outfit, expression, an optional product in hand, the location, and framing: shot type, camera orbit, and a drag canvas for where the character sits in frame.

**Key concepts:**
- **Shot type controls figure size** (close-up → wide). **Focal length controls lens character** (compression, distortion) — not size. Pick shot type first.
- Realism detail auto-adapts to shot type: close-ups get full skin/eye micro-detail; wide shots deliberately drop face detail so distant figures don't morph.
- **Character reference attached** toggle: ON when you attach your character's saved image in the AI tool. **Outfit as attached reference**: ON when you attach an outfit sheet. Use both for maximum consistency.
- If your chosen location has saved Blockings (see the Blocking section), pick one to stage exactly where the character and camera are.

**Output:** one prompt → one image.

## Character Maker

**What it's for:** creating a reusable character asset with a consistent face.

Build identity with attribute chips (or extract it from a photo using the Examine helper), pick a gender (sets the neutral baseline wardrobe), then choose an output type:

| Output | What you get | When to use |
|---|---|---|
| **Identity plate (hero)** | One clean medium-shot portrait, neutral wardrobe, mid-gray studio | **Make this FIRST.** This image becomes your character's canonical face reference |
| **Character sheet** | One image, 6 panels: front body, left profile, back body, right profile, face close-up, detail shot (pick via chip) | The all-angles asset — generate it with the hero image attached |
| **Full body + outfit** | One full-body shot in a styled outfit | Base look reference |
| **Outfit sheet** | Body-only panels (head out of frame) + one face anchor panel | For video tools: outfit locked, identity taken from the single face panel |
| **Expression sheet** | Grid of expressions, neutral wardrobe | Emotion reference |

Background and lighting are locked (mid-gray studio, soft diffused light) — that's intentional: assets must be clean and evenly lit.

**The consistency workflow (important):**
1. Generate the **Identity plate** first. Save the image.
2. Turn ON **"Reference image locked"**. Prompts now stop describing the face and instead anchor to your attached image.
3. Generate the character sheet, outfit sheets, expressions — always attaching the identity plate in your AI tool.
4. **Save to Character Library** — the character is now available in Cinema, Storyboard, and beyond.

**Tip:** multi-panel sheets are the hardest thing for AI models. If a sheet comes out with duplicated or broken panels, regenerate — 2–3 attempts is normal — and use the model that handles grids best for you.

## Product Photo

**What it's for:** product shots as assets.

Describe the product (or extract from a photo), set material, lighting, background, and angle. Output types: **beauty shot**, **clean extraction** (for cutouts), **multi-angle sheet** (one image), or **angle set** (6 separate prompts). Save products to the library — they can then be placed into a character's hands in Cinema, or into Storyboard scenes.

## Location / Set

**What it's for:** places as assets.

Describe the location (or extract from a photo), set time of day and weather. Outputs: **establishing shot**, **location sheet** (one 2×2 image), or **empty plate** (no people — clean for compositing). Save to the Location library, then reuse the exact same place across Cinema shots and Storyboard scenes.

## Design / Thumbnail

**What it's for:** graphic pieces — thumbnails, covers, promo frames.

Write the brief, pick a thumbnail type (auto-suggests color/text/layout), format, layout, render style, and color treatment. Add headline + sub-label text and drag them exactly where you want on the text canvas (with rotation). This is the tab where text IS supposed to appear in the image — everywhere else text is banned.

## Storyboard

**What it's for:** a multi-shot scene with continuity.

Set the **scene level** once: character, location, optional product (from libraries), time of day, weather, scene lighting/mood, scene direction, aspect ratio. Then add up to **8 frames**; each frame changes only the deltas: shot type, camera angle, action, expression, character placement. Duplicate a frame and tweak it — that's the fastest way to build shot sequences.

**Outputs:**
- **Copy per frame** — each frame is a full standalone prompt (locks repeated every time, because AI tools have no memory between generations). This is your production output.
- **Copy storyboard sheet** — one prompt → one grid image of the whole scene. Use it as a previz overview.

Turn on **"Reference images locked"** and attach your character's identity plate on every generation — that's what keeps the same face across all 8 shots.

## Blocking

**What it's for:** staging — deciding exactly where characters and the camera are inside a location.

1. Pick a saved location.
2. Copy the **extract prompt**, paste it into your AI tool together with the location's image. It replies with a list of sub-areas and their map positions.
3. Paste the reply back → the app draws a **top-down map** of your location.
4. Drag character points (up to two) and the camera point. The camera always faces the character you select as subject.
5. Save the blocking with a name (e.g. "Scene 3 — argument at the door"). It's stored on the location itself.

Saved blockings then appear as options in Cinema (panel 08, Location) and on each Storyboard frame — one tap injects precise staging language ("camera near the doorway, facing the character at the window") into the prompt.

---

## Global features (work in every tab)

- **Brand Kit** — store brand name, palette, mood, and style once; toggle "Apply brand kit" to inject it into any mode's prompt.
- **Creative Context** — frames the whole prompt as a medium (film set, theater, VFX, cartoon, comic, fantasy...). Placed at the very start of the prompt because AI models weight the opening heavily.
- **Manual Instruction** — free text appended verbatim at the end of every prompt. Your escape hatch.
- **Presets** — snapshot the entire app state per mode; save, load, delete.

## Quick workflow cheat-sheet

**"I want one beautiful shot of my character":** Character Maker (hero → ref lock → save) → Cinema (pick character, ref toggle ON, attach image).

**"I want a scene of 5 shots":** assets first (character + location) → Storyboard (scene locks → 5 frames → copy per frame, attach references every time).

**"I want the character exactly HERE in my location":** Location (save it) → Blocking (extract → place points → save) → Cinema or Storyboard (pick the blocking).

**Golden rules:**
1. Generate the identity plate before anything else about a character.
2. Once a reference exists, always attach it and always keep the ref toggle ON.
3. Multi-panel sheets sometimes need 2–3 attempts — that's the model, not you.
4. If a prompt result fights you, add one line in Manual Instruction rather than fighting the chips.
