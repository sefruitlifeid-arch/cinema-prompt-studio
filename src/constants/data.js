import { ArrowLeft, ArrowRight, ArrowUp, CircleDot } from "lucide-react";

export const LENSES = [
  { id: "cooke-s4", name: "Cooke S4", character: "a gentle rolloff and warm skin rendering" },
  { id: "zeiss-master-prime", name: "Zeiss Master Prime", character: "clinical sharpness and neutral color" },
  { id: "leica-summilux", name: "Leica Summilux", character: "creamy bokeh and a subtle glow" },
  { id: "vintage-anamorphic", name: "Vintage Anamorphic", character: "oval bokeh and horizontal flares" },
  { id: "macro", name: "Macro", character: "extreme close focus and a razor-thin plane" },
];

export const SENSORS = ["Full-frame", "Super35", "Anamorphic 2x", "Medium format"];

export const GENRES = [
  { id: "commercial", label: "Commercial", mood: "polished commercial" },
  { id: "editorial", label: "Editorial", mood: "editorial fashion" },
  { id: "documentary", label: "Documentary", mood: "observational documentary" },
  { id: "noir", label: "Noir", mood: "moody film-noir" },
  { id: "horror", label: "Horror", mood: "tense horror" },
  { id: "action", label: "Action", mood: "kinetic action" },
  { id: "drama", label: "Drama", mood: "intimate drama" },
  { id: "portrait", label: "Portrait", mood: "classic portrait" },
];

export const SHOT_TYPES = [
  { id: "closeup", label: "Close-up", phrase: "close-up shot" },
  { id: "chestup", label: "Chest-up", phrase: "chest-up portrait" },
  { id: "fullbody", label: "Full body", phrase: "full-body shot" },
  { id: "wide", label: "Wide establishing", phrase: "wide establishing shot" },
];

export const ACTION_CHIPS = [
  "walking toward camera mid-stride",
  "seated, leaning slightly forward",
  "glancing back over one shoulder",
  "standing relaxed with hands in pockets",
  "looking off to the side, lost in thought",
  "laughing and turning away from camera",
];

export const LOCATION_PRESETS = [
  { id: "studio", label: "Studio seamless", phrase: "a clean studio seamless backdrop" },
  { id: "street", label: "City street", phrase: "a rain-slicked city street with soft bokeh lights" },
  { id: "cafe", label: "Cafe interior", phrase: "a cozy cafe interior with warm window light" },
  { id: "nature", label: "Forest / nature", phrase: "a natural forest clearing with dappled light" },
  { id: "home", label: "Home interior", phrase: "a warm minimalist home interior" },
  { id: "field", label: "Golden field", phrase: "an open field at golden hour" },
];

export const ANGLE_DIRECTIONS = [
  { label: "Front", rot: 0 },
  { label: "Front-R", rot: 45 },
  { label: "Right", rot: 90 },
  { label: "Back-R", rot: 135 },
  { label: "Back", rot: 180 },
  { label: "Back-L", rot: 225 },
  { label: "Left", rot: 270 },
  { label: "Front-L", rot: 315 },
];

export const TILT_PRESETS = [
  { label: "Worm", val: -75 },
  { label: "Low", val: -45 },
  { label: "Eye", val: 0 },
  { label: "High", val: 45 },
  { label: "Bird", val: 75 },
];

export const CONTEXT_TYPES = [
  { id: "film-set", label: "Film set / staged scene", phrase: "This is a staged scene from a professional film production — performed by actors on a film set with props, costumes and practical effects; a fictional performance, not real events, with no gore and no real harm." },
  { id: "theater", label: "Stage / theater", phrase: "This is a theatrical stage performance captured on camera — dramatic stage lighting, actors performing a fictional scene, stylized and non-graphic." },
  { id: "cine-vfx", label: "Cinematic VFX / action", phrase: "This is a fictional cinematic scene created with professional film VFX and practical effects — stylized movie action, not real footage, depicting no gore, no injury, and no real harm." },
  { id: "kaiju", label: "Kaiju / monster spectacle", phrase: "This is a blockbuster kaiju-style monster movie scene — cinematic, stylized spectacle with no gore and no depiction of human harm, in the spirit of classic giant-monster films." },
  { id: "animation", label: "Stylized cartoon", phrase: "This is a stylized animated cartoon — playful, exaggerated and non-realistic, with a lighthearted comedic tone and no graphic content." },
  { id: "comic", label: "Comic / illustrated", phrase: "This is an illustrated comic-book style artwork — dramatic but clearly stylized and non-photographic, with no graphic or gory detail." },
  { id: "fantasy", label: "Fantasy / mythic", phrase: "This is a fantasy illustration of mythical creatures and worlds — imaginative and stylized, non-realistic, with no graphic content." },
];

export const EXAMINE_PROMPT = `You are a character identity extractor for photorealistic image prompts. Examine the attached reference photo of a person and write ONE dense paragraph describing ONLY their fixed physical identity — the traits that must stay identical across every future image. Include: apparent age range, ethnicity/skin tone, face shape, jawline, cheekbones, nose shape, lip shape, eye shape and color, eyebrow shape, distinguishing marks (moles, freckles, scars), hair color, length, and texture, and overall build. Do NOT mention clothing, expression, pose, background, lighting, or camera. Write it as a flowing physical description, not a list. Keep it under 90 words.`;

export const REF_EXAMINE_PROMPT = `You are a brand and visual-style extractor for image prompts. Examine the attached reference (a brand asset, thumbnail, or moodboard) and write ONE dense paragraph capturing ONLY its reusable visual style: dominant color palette (name the key hex-like colors), overall mood, typographic feel (weight, serif/sans, case), lighting/finish, and composition tendencies. Do NOT describe the specific subject or one-off content. Keep it under 80 words, as flowing prose I can paste into an image prompt.`;

export const PALETTE_EXAMINE_PROMPT = `You are a brand color and mood extractor for image prompts. Examine the attached brand asset or reference image and write ONE short paragraph naming ONLY: the 3-5 dominant colors (as approximate hex values with plain-language names, e.g. "deep navy #0A1F44"), how they are balanced (which dominates, which accents), and the overall mood in 3-4 adjectives. Do NOT describe subjects, typography, or layout. Under 50 words, flowing prose.`;

export const PRODUCT_EXAMINE_PROMPT = `You are a product identity extractor for image prompts. Examine the attached product photo and write ONE dense paragraph describing ONLY the product's fixed physical identity that must stay identical in every future image: exact shape and proportions, materials and finishes, colors (approximate hex where useful), label/logo placement and text, caps/closures/hardware, and any distinguishing details. Do NOT mention background, lighting, angle, or props. Under 90 words, flowing prose.`;

export const LOCATION_EXAMINE_PROMPT = `You are a location identity extractor for image prompts. Examine the attached reference photo of a place and write ONE dense paragraph describing ONLY its fixed physical environment — the traits that stay identical across every future image regardless of time of day or weather. Include: architectural style and era, key structural elements, dominant materials (stone, concrete, wood, glass), built-in props and furniture, natural features, color palette of surfaces, and distinctive spatial character. Do NOT mention people, lighting conditions, weather, time of day, or camera. Under 90 words, flowing prose.`;

export const LOCATION_OUTPUTS = [
  { id: "establishing", label: "Establishing shot", desc: "One hero photograph of the location" },
  { id: "sheet", label: "Location sheet (1 image)", desc: "A 2×2 grid: wide establishing, reverse angle, detail corner, high-angle overview" },
  { id: "plate", label: "Empty plate", desc: "Location with no people, ready for compositing" },
];

export const LOCATION_SHEET_VIEWS = [
  "a wide establishing shot showing the full environment",
  "a reverse angle shot from the opposite end of the space",
  "a medium shot of the most distinctive corner or detail",
  "a high-angle overview looking down across the full space",
];

export const TIME_OF_DAY = [
  { id: "dawn", label: "Dawn", phrase: "at dawn with soft directional light just cresting the horizon" },
  { id: "midday", label: "Midday", phrase: "at midday with overhead sun and strong defined shadows" },
  { id: "golden", label: "Golden hour", phrase: "at golden hour with warm low-angle sunlight and long shadows" },
  { id: "blue", label: "Blue hour", phrase: "at blue hour with cool twilight and soft ambient light" },
  { id: "night", label: "Night", phrase: "at night with artificial and practical lighting sources" },
];

export const WEATHER_CONDITIONS = [
  { id: "clear", label: "Clear", phrase: "under clear skies" },
  { id: "overcast", label: "Overcast", phrase: "under overcast skies with soft diffused light" },
  { id: "rain", label: "Rain", phrase: "in rain with wet reflective surfaces" },
  { id: "fog", label: "Fog", phrase: "in atmospheric fog" },
  { id: "snow", label: "Snow", phrase: "in snow with cool white ambient light" },
];

export const COMPOSITIONS = [
  { id: "thirds", label: "Rule of thirds", phrase: "framed on the rule of thirds" },
  { id: "golden", label: "Golden ratio", phrase: "composed along the golden ratio for a naturally balanced frame" },
  { id: "spiral", label: "Golden spiral", phrase: "arranged along a golden spiral leading the eye to the subject" },
  { id: "centered", label: "Centered", phrase: "centered in frame with symmetry" },
  { id: "leading", label: "Leading lines", phrase: "using strong leading lines that draw the eye to the subject" },
  { id: "frame", label: "Frame-in-frame", phrase: "using a natural frame-within-the-frame around the subject" },
  { id: "diagonal", label: "Dynamic diagonal", phrase: "built on dynamic diagonals for energy and movement" },
  { id: "neg-left", label: "Negative space L", phrase: "the subject to the right with generous negative space on the left for text or layout" },
  { id: "neg-right", label: "Negative space R", phrase: "the subject to the left with generous negative space on the right for text or layout" },
  { id: "neg-top", label: "Negative space top", phrase: "the subject low in frame with clean negative space above for a headline" },
  { id: "environmental", label: "Environmental", phrase: "placed small within its environment" },
];

export const PHOTO_ASPECTS = [
  { id: "free", label: "Default", phrase: "" },
  { id: "239", label: "2.39:1 Cine", phrase: "composed in a 2.39:1 anamorphic widescreen aspect ratio" },
  { id: "169", label: "16:9", phrase: "composed in a 16:9 widescreen aspect ratio" },
  { id: "32", label: "3:2", phrase: "composed in a 3:2 aspect ratio" },
  { id: "45", label: "4:5 Portrait", phrase: "composed in a 4:5 vertical portrait aspect ratio" },
  { id: "916", label: "9:16 Vertical", phrase: "composed in a 9:16 vertical aspect ratio" },
  { id: "11", label: "1:1 Square", phrase: "composed in a 1:1 square aspect ratio" },
];

export const KEY_DIRECTIONS = [
  { id: "left", label: "Camera-left", phrase: "from camera-left", Icon: ArrowLeft },
  { id: "right", label: "Camera-right", phrase: "from camera-right", Icon: ArrowRight },
  { id: "top", label: "Top", phrase: "from directly above", Icon: ArrowUp },
  { id: "ring", label: "Ring", phrase: "evenly from a ring light", Icon: CircleDot },
];

export const LIGHT_QUALITIES = [
  { id: "soft", label: "Soft diffused", phrase: "soft, diffused" },
  { id: "hard", label: "Hard direct", phrase: "hard, direct" },
  { id: "golden", label: "Golden hour", phrase: "warm golden-hour" },
  { id: "practical", label: "Practical mixed", phrase: "mixed practical" },
];

export const CATCHLIGHT_BY_KEY = {
  left: "a single soft catchlight at the 10 o'clock position in each eye, mirroring the key from camera-left",
  right: "a single soft catchlight at the 2 o'clock position in each eye, mirroring the key from camera-right",
  top: "a catchlight near the 12 o'clock position in each eye from the overhead key",
  ring: "a distinct ring-shaped catchlight in each eye from the ring light",
};

export const EXPRESSION_GROUPS = [
  { group: "Candid", items: [
    { id: "candid-half", label: "Candid half-smile", phrase: "a candid asymmetric half-smile with slight tension at the outer corners of the eyes" },
    { id: "mid-blink", label: "Mid-blink", phrase: "caught in a natural mid-blink, eyelids softly lowered" },
    { id: "thinking", label: "Caught thinking", phrase: "an unposed, faintly distracted look as if caught mid-thought, gaze drifting slightly off-lens" },
    { id: "soft-serious", label: "Soft serious", phrase: "a calm, softly serious expression with relaxed brows and a closed mouth" },
    { id: "neutral", label: "Resting neutral", phrase: "a relaxed resting expression, lips naturally parted, no forced posing" },
    { id: "mid-speak", label: "Mid-sentence", phrase: "caught mid-sentence, mouth slightly open as if speaking, eyes engaged" },
  ]},
  { group: "Positive", items: [
    { id: "genuine-laugh", label: "Genuine laugh", phrase: "a genuine laugh with crinkled eyes and asymmetric mouth, not posed" },
    { id: "warm-smile", label: "Warm eye-smile", phrase: "a warm closed-mouth smile that reaches the eyes with genuine crow's feet" },
    { id: "confident", label: "Quiet confidence", phrase: "a quietly confident look, chin level, a faint knowing smile" },
    { id: "proud", label: "Proud", phrase: "a quietly proud look, chin lifted slightly, a restrained satisfied smile" },
  ]},
  { group: "Negative", items: [
    { id: "melancholy", label: "Wistful", phrase: "a wistful, faintly melancholic expression with softened eyes" },
    { id: "angry", label: "Angry", phrase: "jaw clenched tight, brows pressed down, nostrils slightly flared in visible anger" },
    { id: "angry-hold", label: "Suppressed anger", phrase: "lips pressed thin, a hard controlled stare holding back anger" },
    { id: "sad", label: "Sad", phrase: "downturned eyes and mouth, a heavy distant gaze filled with sadness" },
    { id: "near-tears", label: "Near tears", phrase: "glassy welling eyes, a faint tremble in the chin, on the verge of tears" },
    { id: "disgust", label: "Disgusted", phrase: "nose wrinkled, upper lip raised asymmetrically in disgust" },
    { id: "exhausted", label: "Exhausted", phrase: "heavy eyelids, drained expression, visible exhaustion pulling at every feature" },
  ]},
  { group: "Intense", items: [
    { id: "intense", label: "Intense focus", phrase: "an intense, focused stare directly into the lens, jaw set" },
    { id: "surprised", label: "Subtle surprise", phrase: "a subtle flash of surprise, brows lifted slightly, lips just parting" },
    { id: "fear", label: "Fearful", phrase: "eyes wide with fear, body pulling slightly back, lips parted in alarm" },
    { id: "anxious", label: "Anxious", phrase: "biting the lower lip, knitted brows, a restless anxious gaze that won't settle" },
    { id: "shock", label: "Shock", phrase: "mouth open wide, eyebrows shot up, a full shock reaction — genuine and unguarded" },
  ]},
];

export const FOCAL_MARKS = [8, 14, 24, 35, 50, 85, 135, 200];
export const APERTURE_STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

export const PRODUCT_OUTPUTS = [
  { id: "beauty", label: "Beauty shot", desc: "One polished hero photograph of the product" },
  { id: "clean", label: "Clean asset extraction", desc: "Isolate the product from a reference photo into a clean e-commerce asset" },
  { id: "sheet", label: "Multi-angle sheet (1 image)", desc: "One prompt asking for a 6-view reference grid in a single image" },
  { id: "angles", label: "Angle set (6 prompts)", desc: "Six separate prompts, one per angle, for tools that generate one image at a time" },
];

export const SHEET_ANGLES = [
  { label: "Front", phrase: "a straight-on front view at product eye level" },
  { label: "Left 3/4", phrase: "a left three-quarter hero view slightly above the product" },
  { label: "Right profile", phrase: "a right side profile view" },
  { label: "Back", phrase: "a straight-on back view" },
  { label: "Top-down", phrase: "a top-down flat view" },
  { label: "Macro detail", phrase: "an extreme macro detail of the most distinctive part (label, cap, texture)" },
];

export const MATERIALS = [
  { id: "matte", label: "Matte", phrase: "a matte surface that absorbs light with soft, even falloff" },
  { id: "glossy", label: "Glossy", phrase: "a glossy surface with crisp, controlled highlight reflections" },
  { id: "glass", label: "Glass", phrase: "transparent glass with refraction, edge highlights and caustics" },
  { id: "metal", label: "Metal / chrome", phrase: "polished metal with sharp specular reflections and a gradient of the environment" },
  { id: "fabric", label: "Fabric / leather", phrase: "soft fabric or leather with visible weave, grain and fibre detail" },
  { id: "ceramic", label: "Ceramic", phrase: "smooth ceramic with a subtle satin sheen" },
];

export const PRODUCT_LIGHTING = [
  { id: "softbox", label: "Softbox strip", phrase: "a large softbox strip creating a smooth gradient reflection along the product" },
  { id: "darkfield", label: "Dark field", phrase: "dark-field lighting with bright rim edges against a dark surround, ideal for glass" },
  { id: "highkey", label: "High-key", phrase: "bright high-key lighting with soft, shadowless illumination" },
  { id: "dramatic", label: "Dramatic single", phrase: "a single dramatic hard source with deep directional shadows" },
  { id: "gradient", label: "Gradient sweep", phrase: "a controlled gradient light sweep from bright to shadow across the frame" },
];

export const PRODUCT_BG = [
  { id: "seamless-white", label: "Seamless white", phrase: "a clean seamless white studio backdrop" },
  { id: "seamless-color", label: "Seamless color", phrase: "a seamless solid-color studio backdrop" },
  { id: "textured", label: "Textured surface", phrase: "a textured natural surface such as stone, wood or linen" },
  { id: "lifestyle", label: "Lifestyle context", phrase: "a lifestyle setting that shows the product in real use" },
  { id: "gradient-bg", label: "Gradient", phrase: "a smooth studio gradient background" },
];

export const PRODUCT_ANGLE = [
  { id: "hero-34", label: "Hero 3/4", phrase: "a hero three-quarter angle slightly above the product" },
  { id: "straight", label: "Straight-on", phrase: "a straight-on eye-level angle" },
  { id: "flatlay", label: "Flat lay", phrase: "a top-down flat-lay composition" },
  { id: "low-hero", label: "Low hero", phrase: "a low heroic angle looking up at the product" },
  { id: "macro", label: "Macro detail", phrase: "an extreme macro detail of one part of the product" },
];

export const ASPECTS = [
  { id: "16-9", label: "16:9 · YouTube", phrase: "a 16:9 widescreen thumbnail" },
  { id: "9-16", label: "9:16 · Shorts/Reels", phrase: "a 9:16 vertical full-screen format" },
  { id: "1-1", label: "1:1 · Feed", phrase: "a 1:1 square format" },
  { id: "4-5", label: "4:5 · IG Portrait", phrase: "a 4:5 portrait format" },
];

export const THUMB_LAYOUTS = [
  { id: "bigface", label: "Big face + object", phrase: "a large expressive face filling roughly half the frame on one side, eyes landing on the upper-third line, with the key object balanced on the opposite third; shallow depth of field separates subject from a softly blurred background" },
  { id: "pointing", label: "Subject pointing", phrase: "the subject looking and gesturing toward the key object so their gaze and arm form a leading line the viewer's eye follows, both subject and object anchored on rule-of-thirds power points" },
  { id: "split", label: "Split comparison", phrase: "a bold vertical split-screen comparison, each half with one clear focal point at matching eye level so the eye reads left-to-right without hunting" },
  { id: "beforeafter", label: "Before / after", phrase: "a diagonal before/after split with strong contrast in color and light between the two states, the transformation reading instantly even at small size" },
  { id: "objecthero", label: "Object hero + reaction", phrase: "the key object oversized in the sharp foreground with a smaller reaction face in one corner, layered foreground/midground/background depth pulling the eye to the object first" },
  { id: "textdom", label: "Text-dominant", phrase: "a typography-dominant layout where the headline is the hero, anchored to the thirds grid, with one small supporting visual and generous negative space around the type" },
  { id: "environmental", label: "Environmental drama", phrase: "the subject placed within a dramatic environment, framed on the rule of thirds with strong leading lines in the scene converging toward them" },
  { id: "centered", label: "Centered symmetry", phrase: "a strong centered symmetrical composition with the focal subject dead-center and the background radiating evenly around it" },
];

export const COLOR_TREATMENTS = [
  { id: "punchy", label: "High-contrast punchy", phrase: "high-contrast punchy colors that pop at small sizes" },
  { id: "orangeteal", label: "Orange & teal clash", phrase: "a complementary orange-and-teal color clash with warm subject against cool background" },
  { id: "blocking", label: "Bold color blocking", phrase: "bold flat color-blocking" },
  { id: "duotone", label: "Duotone", phrase: "a striking duotone palette" },
  { id: "gradientpop", label: "Gradient pop", phrase: "vivid modern gradients flowing through the background" },
  { id: "vibrant", label: "Vibrant saturated", phrase: "vibrant, highly saturated color" },
  { id: "retro", label: "Retro / vintage", phrase: "a warm retro palette with faded film tones and vintage grain" },
  { id: "pastel", label: "Soft pastel", phrase: "a soft pastel palette, airy and friendly" },
  { id: "minimal", label: "Clean minimal", phrase: "a clean minimal palette with lots of breathing room" },
  { id: "moody", label: "Dark moody", phrase: "a dark, moody, cinematic palette" },
];

export const RENDER_STYLES = [
  { group: "Photographic", id: "photo", label: "Photographic", phrase: "photographic realism" },
  { group: "Photographic", id: "composite", label: "Cinematic composite", phrase: "a cinematic composite look" },
  { group: "3D", id: "3d", label: "3D render", phrase: "a polished 3D render style" },
  { group: "3D", id: "3dcartoon", label: "3D cartoon", phrase: "a friendly stylized 3D cartoon look with soft shapes and expressive characters, like a modern animated feature film" },
  { group: "3D", id: "clay", label: "Claymation", phrase: "a handmade claymation stop-motion style with visible fingerprints and sculpted texture" },
  { group: "Illustrated", id: "anime", label: "Anime", phrase: "a vibrant anime illustration style with clean linework and cel shading" },
  { group: "Illustrated", id: "comicbook", label: "Comic book", phrase: "a bold comic-book style with inked outlines, halftone dots and dynamic panels energy" },
  { group: "Illustrated", id: "vector", label: "Flat vector", phrase: "a flat vector illustration style" },
  { group: "Illustrated", id: "watercolor", label: "Watercolor", phrase: "a hand-painted watercolor style with soft washes and organic edges" },
  { group: "Stylized", id: "collage", label: "Mixed collage", phrase: "a mixed-media collage style" },
  { group: "Stylized", id: "cutout", label: "Paper cutout", phrase: "a layered paper-cutout style with crisp cut edges and subtle drop shadows" },
  { group: "Stylized", id: "pixel", label: "Pixel art", phrase: "a chunky retro pixel-art style" },
  { group: "Stylized", id: "riso", label: "Risograph", phrase: "a retro risograph print style with limited spot colors and visible grain" },
  { group: "Stylized", id: "neon", label: "Neon / cyber", phrase: "a neon-drenched futuristic style with glowing accents" },
];

export const TEXT_STYLES = [
  { id: "flat", label: "Flat bold", phrase: "clean flat bold text with strong contrast against the background" },
  { id: "3d", label: "3D extruded", phrase: "bold 3D extruded text with real depth, dimensional side shading, and lighting that matches the scene" },
  { id: "perspective", label: "Perspective warp", phrase: "text set in dramatic perspective, receding into the scene as if standing inside the environment, partially overlapped by the subject" },
  { id: "sticker", label: "Sticker outline", phrase: "sticker-style text with a thick white outline and a soft drop shadow, popping off the image" },
  { id: "neon", label: "Neon sign", phrase: "glowing neon-sign text with realistic tube glow and light spill onto nearby surfaces" },
  { id: "doodle", label: "Doodle interact", phrase: "playful hand-drawn doodle lettering with scribbled arrows, circles and underlines that interact directly with the subject — pointing at it, circling it, reacting to it" },
  { id: "chrome", label: "Chrome metallic", phrase: "polished metallic chrome text with environment reflections and sharp specular highlights" },
  { id: "graffiti", label: "Graffiti", phrase: "energetic graffiti-style lettering with spray texture and street-art attitude" },
  { id: "cutout-txt", label: "Cutout collage", phrase: "ransom-note style paper cutout letters, each slightly rotated, layered over the image" },
];

export const FONT_STYLE_CHIPS = [
  "bold condensed all-caps sans",
  "rounded friendly sans",
  "elegant editorial serif",
  "handwritten marker",
  "geometric techno sans",
  "chunky retro slab serif",
];

export const THUMB_TYPES = [
  { id: "bold", label: "Bold / punchy", desc: "Max attention: oversized elements, aggressive contrast. Best for entertainment & challenge videos.", phrase: "a bold, punchy high-impact thumbnail with oversized focal elements and aggressive contrast", suggest: { color: "punchy", text: "sticker", layout: "bigface" } },
  { id: "premium", label: "Premium / clean", desc: "Refined and minimal. Best for high-end products, finance, education with authority.", phrase: "a premium, clean and minimal thumbnail with refined spacing and restrained elegance", suggest: { color: "minimal", text: "flat", layout: "textdom" } },
  { id: "editorial", label: "Editorial", desc: "Magazine feel with typographic hierarchy. Best for essays, commentary, documentaries.", phrase: "an editorial magazine-style thumbnail with sophisticated typographic hierarchy", suggest: { color: "moody", text: "flat", layout: "environmental" } },
  { id: "playful", label: "Playful / fun", desc: "Lively shapes and fun energy. Best for lifestyle, family, casual vlogs.", phrase: "a playful, energetic thumbnail with lively shapes and a fun mood", suggest: { color: "pastel", text: "doodle", layout: "pointing" } },
  { id: "tech", label: "Tech / modern", desc: "Crisp geometry, futuristic edge. Best for tech reviews, AI, gadgets.", phrase: "a sleek modern tech thumbnail with crisp geometry and a futuristic edge", suggest: { color: "gradientpop", text: "3d", layout: "objecthero" } },
  { id: "luxury", label: "Luxury", desc: "Deep tones and metallic restraint. Best for premium brands, watches, cars.", phrase: "a luxury thumbnail with deep tones, gold or metallic accents and high-end restraint", suggest: { color: "moody", text: "chrome", layout: "centered" } },
];

export const EMPTY_BRAND = { name: "", palette: "", font: "", mood: "", styleRef: "" };

// ── Shared prompt-formula constants (Character Maker + Storyboard) ──────────
export const ANTI_TEXT_CLAUSE =
  "No text, numbers, letters, labels, captions, or watermarks rendered anywhere in the image.";

export const LOCKED_BACKDROP_LIGHT =
  "Mid-gray seamless studio background — even neutral mid-gray, no seam line, no gradient, no falloff to black or white. Relight from scratch overriding any reference lighting: one broad diffused source from camera-left and slightly above, gentle wrap onto the subject, no hard shadow edges, no rim light, no hair light, no kicker. Skin reads matte and velvety — zero shine on forehead, nose bridge, cheekbones, temples, and chin — in a low-contrast milky look. Skin renders at its true natural skin tone and wardrobe at its true natural color, warmth preserved and natural against the neutral gray, never pale or washed-out or cool-shifted by the background.";

export const REALISM_CLOSE =
  "Real peach fuzz at the jaw and hairline, real soft fine even pore texture, subsurface scattering reading as semi-translucent biology, never plastic, never waxy AI render, never glass-skin, never harsh — fine flattering texture that keeps the face looking good, no acne, no blemishes, no rough or enlarged pores. Hair rendered strand by strand with realistic flyaways and baby hairs at the hairline. Fabric with real weave detail, real weight, real drape. Photographed on a 50mm prime at a wide aperture, natural round bokeh, even sharpness, soft natural film grain. Photographed not generated.";

export const REF_ANCHOR_CLAUSE =
  "The exact same character as the attached reference image — identical face, bone structure, skin tone, hair color and texture, and body proportions. Do not alter the identity in any way.";

export const CM_BASELINE_WARDROBE = {
  female: "a plain black thin-strap camisole, no jewelry, no logos, no graphics",
  male: "a plain black ribbed tank, no jewelry, no logos, no graphics",
};

export const CM_DETAIL_OPTIONS = [
  { id: "hands", label: "Hands & nails", clause: "a tight close-up of the hands and nails, both hands relaxed and clearly visible, skin texture and nail detail readable, filling the panel cleanly" },
  { id: "jewelry", label: "Jewelry", clause: "a tight close-up of the character's key jewelry piece, metal surface detail readable, filling the panel cleanly" },
  { id: "piercing", label: "Piercing", clause: "a tight close-up of the character's piercing, exact position and metal readable, filling the panel cleanly" },
  { id: "marker", label: "Tattoo / marker", clause: "a tight close-up of the character's distinguishing mark or tattoo, placement and detail readable, filling the panel cleanly" },
  { id: "prop", label: "Held prop", clause: "a tight close-up of the character's held prop in hand, the prop filling the frame with the hand" },
];

export const SB_LIGHTING = [
  { id: "soft-daylight", label: "Soft daylight", phrase: "soft natural daylight, diffused and even, with gentle open shadows" },
  { id: "golden-hour", label: "Golden hour", phrase: "warm golden-hour sunlight, low-angle and directional, with long soft shadows" },
  { id: "overcast", label: "Overcast", phrase: "flat overcast light, a giant natural softbox with muted contrast and no hard shadows" },
  { id: "hard-sun", label: "Hard sun", phrase: "hard direct midday sun with crisp defined shadows and strong contrast" },
  { id: "tungsten", label: "Tungsten interior", phrase: "warm tungsten interior lighting from practical lamps, amber tones and cozy pools of light" },
  { id: "neon-night", label: "Neon night", phrase: "nighttime neon lighting with colored signs spilling saturated color onto the subject and wet surfaces" },
  { id: "firelight", label: "Firelight", phrase: "flickering warm firelight from below eye level, dancing orange glow with deep soft shadows" },
  { id: "moonlight", label: "Moonlight", phrase: "cool blue moonlight, dim and directional, with silvery highlights and deep night shadows" },
];

export const CHARMAKER_OUTPUTS = [
  { id: "hero", label: "Identity plate (hero)", desc: "One neutral master reference headshot — baseline wardrobe, no styling, locked studio formula" },
  { id: "sheet", label: "Character sheet (1 image)", desc: "A 3x2 grid: full body front, both side profiles, back, face close-up, and one detail shot" },
  { id: "fullbody", label: "Full body + outfit (1 image)", desc: "One head-to-toe photograph of the character wearing the outfit" },
  { id: "outfitsheet", label: "Outfit sheet (1 image)", desc: "A 3-panel grid: outfit front and back framed from the neck down, plus one neutral face close-up anchor" },
  { id: "expressions", label: "Expression sheet (1 image)", desc: "A 3x3 grid: the identical face showing nine different expressions" },
];

export const CHARMAKER_OUTFIT_PANELS = [
  "a full-body front view of the outfit, framed from the neck down with the head outside the frame, so the clothing is the sole subject",
  "a full-body back view of the outfit including the hair falling over it, framed to show the complete garment from behind",
  "a chest-up close-up of the character's face with a neutral expression, as the identity anchor",
];

export const CHARMAKER_EXPRESSIONS_9 = EXPRESSION_GROUPS.flatMap((g) => g.items).slice(0, 9);

export const ID_AGE = [
  { id: "teen", label: "Teen (16)", phrase: "a teenager, approximately 16 years old" },
  { id: "20s", label: "20s", phrase: "in their mid-20s" },
  { id: "30s", label: "30s", phrase: "in their early 30s" },
  { id: "40s", label: "40s", phrase: "in their mid-40s" },
  { id: "50s", label: "50s", phrase: "in their early 50s" },
  { id: "60plus", label: "60+", phrase: "in their 60s or older" },
];

export const ID_GENDER = [
  { id: "man", label: "Man", phrase: "man" },
  { id: "woman", label: "Woman", phrase: "woman" },
  { id: "nb", label: "Non-binary", phrase: "non-binary person" },
];

export const ID_SKIN = [
  { id: "fair", label: "Fair", phrase: "fair, pale skin" },
  { id: "light", label: "Light", phrase: "light skin" },
  { id: "medium", label: "Medium", phrase: "medium skin" },
  { id: "olive", label: "Olive", phrase: "olive-toned skin" },
  { id: "tan", label: "Tan", phrase: "tan, warm-brown skin" },
  { id: "dark", label: "Dark", phrase: "deep dark-brown skin" },
];

export const ID_FACE = [
  { id: "oval", label: "Oval", phrase: "an oval face" },
  { id: "square", label: "Square jaw", phrase: "a strong square jaw" },
  { id: "round", label: "Round", phrase: "a round face" },
  { id: "heart", label: "Heart-shaped", phrase: "a heart-shaped face with a wide forehead" },
  { id: "angular", label: "Angular", phrase: "an angular, defined face" },
  { id: "soft", label: "Soft features", phrase: "a soft, gentle face with subtle features" },
];

export const ID_EYES = [
  { id: "almond", label: "Almond", phrase: "almond-shaped eyes" },
  { id: "round", label: "Round", phrase: "large round eyes" },
  { id: "hooded", label: "Hooded", phrase: "slightly hooded eyes" },
  { id: "monolid", label: "Monolid", phrase: "monolid eyes" },
  { id: "deepset", label: "Deep-set", phrase: "deep-set eyes" },
  { id: "upturned", label: "Upturned", phrase: "upturned eyes" },
];

export const ID_HAIR_COLOR = [
  { id: "black", label: "Black", phrase: "jet-black" },
  { id: "dark-brown", label: "Dark brown", phrase: "dark brown" },
  { id: "brown", label: "Brown", phrase: "medium brown" },
  { id: "auburn", label: "Auburn", phrase: "auburn" },
  { id: "blonde", label: "Blonde", phrase: "blonde" },
  { id: "platinum", label: "Platinum", phrase: "platinum-blonde" },
  { id: "red", label: "Red", phrase: "vibrant red" },
  { id: "grey", label: "Grey / silver", phrase: "silver-grey" },
  { id: "white", label: "White", phrase: "pure white" },
];

export const ID_HAIR_LENGTH = [
  { id: "bald", label: "Bald / shaved", phrase: "a shaved head" },
  { id: "buzzcut", label: "Buzz cut", phrase: "a very short buzz cut" },
  { id: "short", label: "Short", phrase: "short" },
  { id: "medium", label: "Medium", phrase: "medium-length" },
  { id: "long", label: "Long", phrase: "long" },
  { id: "very-long", label: "Very long", phrase: "very long" },
];

export const ID_HAIR_TEXTURE = [
  { id: "straight", label: "Straight", phrase: "straight" },
  { id: "wavy", label: "Wavy", phrase: "wavy" },
  { id: "curly", label: "Curly", phrase: "curly" },
  { id: "coily", label: "Coily", phrase: "tightly coiled" },
  { id: "locs", label: "Locs", phrase: "in locs" },
];

export const ID_BUILD = [
  { id: "slim", label: "Slim", phrase: "a slim, lean build" },
  { id: "athletic", label: "Athletic", phrase: "an athletic build" },
  { id: "average", label: "Average", phrase: "an average build" },
  { id: "stocky", label: "Stocky", phrase: "a stocky, broad-shouldered build" },
  { id: "heavyset", label: "Heavy-set", phrase: "a heavyset build" },
];

export const STYLE_VIBES = [
  { id: "streetwear", label: "Streetwear", phrase: "streetwear-influenced clothing" },
  { id: "casual", label: "Casual", phrase: "casual everyday clothing" },
  { id: "business", label: "Business casual", phrase: "smart business-casual attire" },
  { id: "formal", label: "Formal", phrase: "formal attire" },
  { id: "techwear", label: "Techwear", phrase: "techwear with functional utilitarian layers" },
  { id: "vintage", label: "Vintage", phrase: "vintage-inspired clothing" },
  { id: "editorial", label: "Editorial", phrase: "high editorial fashion styling" },
  { id: "athletic", label: "Athletic", phrase: "athletic or sporty clothing" },
  { id: "bohemian", label: "Bohemian", phrase: "bohemian flowing natural-fabric clothing" },
  { id: "punk", label: "Punk / alt", phrase: "punk or alternative styling" },
];
