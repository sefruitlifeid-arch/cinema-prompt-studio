import React, { useState, useMemo, useEffect } from "react";
import { Copy, Check, ArrowLeft, ArrowRight, ArrowUp, CircleDot, Aperture, Save, X, Palette, Package, ChevronDown, ChevronUp } from "lucide-react";
import { COLORS, fDisplay, fBody, fMono } from "./constants/theme";
import {
  LENSES, SENSORS, GENRES, SHOT_TYPES, ACTION_CHIPS, LOCATION_PRESETS,
  ANGLE_DIRECTIONS, TILT_PRESETS, CONTEXT_TYPES,
  EXAMINE_PROMPT, REF_EXAMINE_PROMPT, PALETTE_EXAMINE_PROMPT, PRODUCT_EXAMINE_PROMPT, LOCATION_EXAMINE_PROMPT, LOCATION_BLOCKING_PROMPT,
  LOCATION_OUTPUTS, LOCATION_SHEET_VIEWS, TIME_OF_DAY, WEATHER_CONDITIONS,
  COMPOSITIONS, PHOTO_ASPECTS, KEY_DIRECTIONS, LIGHT_QUALITIES, CATCHLIGHT_BY_KEY,
  EXPRESSION_GROUPS, FOCAL_MARKS, APERTURE_STOPS,
  PRODUCT_OUTPUTS, SHEET_ANGLES, MATERIALS, PRODUCT_LIGHTING, PRODUCT_BG, PRODUCT_ANGLE,
  ASPECTS, THUMB_LAYOUTS, COLOR_TREATMENTS, RENDER_STYLES, TEXT_STYLES, FONT_STYLE_CHIPS, THUMB_TYPES,
  EMPTY_BRAND,
  CHARMAKER_OUTPUTS, CHARMAKER_EXPRESSIONS_9, CHARMAKER_OUTFIT_PANELS,
  ANTI_TEXT_CLAUSE, LOCKED_BACKDROP_LIGHT, REALISM_CLOSE, REF_ANCHOR_CLAUSE, OUTFIT_ANCHOR_CLAUSE, CM_BASELINE_WARDROBE, CM_DETAIL_OPTIONS, SB_LIGHTING,
  ID_AGE, ID_GENDER, ID_SKIN, ID_FACE, ID_EYES, ID_HAIR_COLOR, ID_HAIR_LENGTH, ID_HAIR_TEXTURE, ID_BUILD,
  STYLE_VIBES,
} from "./constants/data";
import { anglePhrase, placementPhrase, textPositionPhrase, polar, bladePoints, realismForShot } from "./utils/phrases";
import { parseSubAreas, compileBlockingClause } from "./utils/blocking";
import { PRESET_KEY, CHAR_KEY, PRODUCT_KEY, BRAND_KEY, LOCATION_KEY, memStore, store, copyText } from "./utils/storage";
import { Eyebrow, Panel, Chip, ChipField, Toggle, ExamineHelper } from "./components/primitives";
import { PlacementCanvas, TextPlacement, AngleOrbit, BlockingCanvas } from "./components/canvases";

// Locked backdrop variant for multi-panel sheets ("six" / "three" / "nine" panels)
const lockedBackdropUniform = (n) =>
  LOCKED_BACKDROP_LIGHT.replace("studio background —", `studio backdrop applied uniformly across all ${n} panels —`);

export default function CinemaPromptStudio() {
  const [mode, setMode] = useState("cinema");
  // Brand Kit (global)
  const [brand, setBrand] = useState(EMPTY_BRAND);
  const [brandOpen, setBrandOpen] = useState(false);
  const [applyBrand, setApplyBrand] = useState(false);
  const [brandPaletteExOpen, setBrandPaletteExOpen] = useState(false);
  const [brandPaletteExCopied, setBrandPaletteExCopied] = useState(false);
  const [brandStyleExOpen, setBrandStyleExOpen] = useState(false);
  const [brandStyleExCopied, setBrandStyleExCopied] = useState(false);
  // Cinema state
  const [lensId, setLensId] = useState("cooke-s4");
  const [sensor, setSensor] = useState("Full-frame");
  const [focalIdx, setFocalIdx] = useState(4);
  const [apertureIdx, setApertureIdx] = useState(2);
  const [genreId, setGenreId] = useState("portrait");
  const [keyId, setKeyId] = useState("left");
  const [qualityId, setQualityId] = useState("soft");
  const [kelvin, setKelvin] = useState(4500);
  const [identitySource, setIdentitySource] = useState("describe"); // describe | reference
  const [character, setCharacter] = useState("");
  const [action, setAction] = useState("");
  const [outfit, setOutfit] = useState("");
  const [location, setLocation] = useState("");
  const [shotId, setShotId] = useState("chestup");
  const [rotation, setRotation] = useState(30);
  const [tilt, setTilt] = useState(0);
  const [cineRefLocked, setCineRefLocked] = useState(false);
  const [cineOutfitRef, setCineOutfitRef] = useState(false);
  const [photoAspectId, setPhotoAspectId] = useState("free");
  const [compId, setCompId] = useState("thirds");
  const [skinTexture, setSkinTexture] = useState(true);
  const [opticalImperfection, setOpticalImperfection] = useState(true);
  const [antiAI, setAntiAI] = useState(true);
  const [eyeEngine, setEyeEngine] = useState(true);
  const [expressionPhrase, setExpressionPhrase] = useState("a candid asymmetric half-smile with slight tension at the outer corners of the eyes");
  // Product mode state
  const [productOutput, setProductOutput] = useState("beauty");
  const [productDesc, setProductDesc] = useState("");
  const [materialId, setMaterialId] = useState("glossy");
  const [prodLightId, setProdLightId] = useState("softbox");
  const [prodBgId, setProdBgId] = useState("seamless-white");
  const [prodAngleId, setProdAngleId] = useState("hero-34");
  const [prodRealReflection, setProdRealReflection] = useState(true);
  const [prodContactShadow, setProdContactShadow] = useState(true);
  const [prodExOpen, setProdExOpen] = useState(false);
  const [prodExCopied, setProdExCopied] = useState(false);
  // Design mode state
  const [designDesc, setDesignDesc] = useState("");
  const [aspectId, setAspectId] = useState("16-9");
  const [thumbLayout, setThumbLayout] = useState(THUMB_LAYOUTS[0].phrase);
  const [colorTreat, setColorTreat] = useState(COLOR_TREATMENTS[0].phrase);
  const [renderStyle, setRenderStyle] = useState(RENDER_STYLES[0].phrase);
  const [textStyle, setTextStyle] = useState(TEXT_STYLES[0].phrase);
  const [designLegibility, setDesignLegibility] = useState(true);
  const [designRef, setDesignRef] = useState("");
  const [brandFontField, setBrandFontField] = useState("");
  const [thumbTypeId, setThumbTypeId] = useState("bold");
  const [textBlocks, setTextBlocks] = useState([
    { enabled: true, text: "", tx: 0.5, ty: 0.28, tw: 0.6, rot: 0 },
    { enabled: false, text: "", tx: 0.5, ty: 0.75, tw: 0.4, rot: 0 },
  ]);
  const [activeBlockIdx, setActiveBlockIdx] = useState(0);
  const [refExamineOpen, setRefExamineOpen] = useState(false);
  const [refExamineCopied, setRefExamineCopied] = useState(false);
  const [copied, setCopied] = useState(false);
  // Presets
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [savingOpen, setSavingOpen] = useState(false);
  // Angle snap
  const [snapAngle, setSnapAngle] = useState(false);
  // Product injection (cinema)
  const [injectProduct, setInjectProduct] = useState(false);
  const [productInteraction, setProductInteraction] = useState("");
  const [injectedProductId, setInjectedProductId] = useState("");
  // Manual instruction + creative context (global)
  const [manualInstruction, setManualInstruction] = useState("");
  const [creativeContext, setCreativeContext] = useState(false);
  const [contextTypeId, setContextTypeId] = useState("film-set");
  // Libraries
  const [characters, setCharacters] = useState([]);
  const [charName, setCharName] = useState("");
  const [charSavingOpen, setCharSavingOpen] = useState(false);
  const [examineOpen, setExamineOpen] = useState(false);
  const [examineCopied, setExamineCopied] = useState(false);
  const [products, setProducts] = useState([]);
  const [prodName, setProdName] = useState("");
  const [prodSavingOpen, setProdSavingOpen] = useState(false);
  // Location mode state
  const [locationOutput, setLocationOutput] = useState("establishing");
  const [locationDesc, setLocationDesc] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("golden");
  const [weatherId, setWeatherId] = useState("clear");
  const [locExOpen, setLocExOpen] = useState(false);
  const [locExCopied, setLocExCopied] = useState(false);
  // Location library
  const [locations, setLocations] = useState([]);
  const [locName, setLocName] = useState("");
  const [locSavingOpen, setLocSavingOpen] = useState(false);
  // Storyboard state (mode id stays "assemble" for preset compatibility)
  const newFrame = () => ({ id: Date.now().toString() + Math.random().toString(36).slice(2, 6), shotType: "chestup", angleRot: 0, action: "", expressionPhrase: "", px: 0.5, py: 0.5, dist: 0.5, blockingClause: "" });
  const [sbCharacterId, setSbCharacterId] = useState("");
  const [sbProductId, setSbProductId] = useState("");
  const [sbLocationId, setSbLocationId] = useState("");
  const [sbTimeOfDay, setSbTimeOfDay] = useState("golden");
  const [sbWeather, setSbWeather] = useState("clear");
  const [sbLighting, setSbLighting] = useState("soft-daylight");
  const [sbDirection, setSbDirection] = useState("");
  const [sbAspect, setSbAspect] = useState("169");
  const [sbRefLocked, setSbRefLocked] = useState(false);
  const [sbFrames, setSbFrames] = useState(() => [newFrame()]);
  const [sbCopiedId, setSbCopiedId] = useState("");
  const [sbSheetCopied, setSbSheetCopied] = useState(false);
  // Character placement (Cinema)
  const [charPlacement, setCharPlacement] = useState(false);
  const [charPx, setCharPx] = useState(0.5);
  const [charPy, setCharPy] = useState(0.5);
  const [charDist, setCharDist] = useState(0.5);
  // Character Maker state
  const [cmOutput, setCmOutput] = useState("hero");
  const [cmAge, setCmAge] = useState("");
  const [cmGender, setCmGender] = useState("");
  const [cmSkin, setCmSkin] = useState("");
  const [cmFace, setCmFace] = useState("");
  const [cmEyes, setCmEyes] = useState("");
  const [cmHairColor, setCmHairColor] = useState("");
  const [cmHairLength, setCmHairLength] = useState("");
  const [cmHairTexture, setCmHairTexture] = useState("");
  const [cmBuild, setCmBuild] = useState("");
  const [cmMarks, setCmMarks] = useState("");
  const [cmIdentityText, setCmIdentityText] = useState("");
  const [cmIdentityDirty, setCmIdentityDirty] = useState(false);
  const [cmOutfit, setCmOutfit] = useState("");
  const [cmVibe, setCmVibe] = useState("");
  const [cmBaseGender, setCmBaseGender] = useState("female"); // baseline wardrobe fork
  const [cmRefLocked, setCmRefLocked] = useState(false);
  const [cmDetail, setCmDetail] = useState("hands");
  const [cmSavingOpen, setCmSavingOpen] = useState(false);
  const [cmName, setCmName] = useState("");
  const [cmSource, setCmSource] = useState("scratch");
  const [cmExOpen, setCmExOpen] = useState(false);
  const [cmExCopied, setCmExCopied] = useState(false);
  // Blocking mode state (blockings persist in the location library, not presets)
  const [blLocationId, setBlLocationId] = useState("");
  const [blPasteText, setBlPasteText] = useState("");
  const [blParseErrors, setBlParseErrors] = useState([]);
  const [blPromptCopied, setBlPromptCopied] = useState(false);
  const [blClauseCopied, setBlClauseCopied] = useState(false);
  const [blReextract, setBlReextract] = useState(false);
  const [blCharacters, setBlCharacters] = useState([{ x: 40, y: 55, label: "Character A" }]);
  const [blCamera, setBlCamera] = useState({ x: 50, y: 90 });
  const [blSubjectIdx, setBlSubjectIdx] = useState(0);
  const [blName, setBlName] = useState("");
  const [blLoadedId, setBlLoadedId] = useState("");
  // Blocking injection (cinema)
  const [cineBlockingId, setCineBlockingId] = useState("");

  useEffect(() => {
    setPresets(store.read(PRESET_KEY));
    setCharacters(store.read(CHAR_KEY));
    setProducts(store.read(PRODUCT_KEY));
    setLocations(store.read(LOCATION_KEY));
    setBrand(store.read(BRAND_KEY, EMPTY_BRAND));
  }, []);

  const setBrandField = (k, v) => {
    const next = { ...brand, [k]: v };
    setBrand(next);
    store.write(BRAND_KEY, next);
  };
  const brandHasContent = !!(brand.palette.trim() || brand.mood.trim() || brand.styleRef.trim() || brand.font.trim());
  const brandClause = useMemo(() => {
    if (!applyBrand || !brandHasContent) return "";
    const bits = [];
    if (brand.styleRef.trim()) bits.push(`match this visual style: ${brand.styleRef.trim()}`);
    if (brand.palette.trim()) bits.push(`use the brand color palette (${brand.palette.trim()})`);
    if (brand.mood.trim()) bits.push(`keep the overall mood ${brand.mood.trim()}`);
    if (!bits.length) return "";
    return `Art-direct the image to the brand${brand.name.trim() ? ` "${brand.name.trim()}"` : ""}: ${bits.join("; ")}.`;
  }, [applyBrand, brandHasContent, brand]);

  const lens = LENSES.find((l) => l.id === lensId);
  const genre = GENRES.find((g) => g.id === genreId);
  const shot = SHOT_TYPES.find((s) => s.id === shotId);
  const comp = COMPOSITIONS.find((c) => c.id === compId);
  const photoAspect = PHOTO_ASPECTS.find((a) => a.id === photoAspectId);
  const key = KEY_DIRECTIONS.find((k) => k.id === keyId);
  const quality = LIGHT_QUALITIES.find((q) => q.id === qualityId);
  // expression is now a phrase string stored directly in expressionPhrase
  const focalLength = FOCAL_MARKS[focalIdx];
  const aperture = APERTURE_STOPS[apertureIdx];
  const closure = apertureIdx / (APERTURE_STOPS.length - 1);
  const material = MATERIALS.find((m) => m.id === materialId);
  const prodLight = PRODUCT_LIGHTING.find((l) => l.id === prodLightId);
  const prodBg = PRODUCT_BG.find((b) => b.id === prodBgId);
  const prodAngle = PRODUCT_ANGLE.find((a) => a.id === prodAngleId);
  const aspect = ASPECTS.find((a) => a.id === aspectId);
  const thumbType = THUMB_TYPES.find((t) => t.id === thumbTypeId);
  const injectedProduct = products.find((p) => p.id === injectedProductId);
  const tod = TIME_OF_DAY.find((t) => t.id === timeOfDay);
  const weather = WEATHER_CONDITIONS.find((w) => w.id === weatherId);
  const contextType = CONTEXT_TYPES.find((c) => c.id === contextTypeId);

  // Blocking mode derived values (old library entries default subAreas/blockings to [])
  const blLocation = locations.find((l) => l.id === blLocationId);
  const blSubAreas = (blLocation && blLocation.subAreas) || [];
  const blBlockings = (blLocation && blLocation.blockings) || [];
  const blClause = useMemo(
    () => compileBlockingClause({ characters: blCharacters, camera: blCamera, subjectIdx: blSubjectIdx }, blSubAreas),
    [blCharacters, blCamera, blSubjectIdx, blSubAreas]
  );

  // ---------- Cinema compiler ----------
  const cinemaPrompt = useMemo(() => {
    const isRef = identitySource === "reference";
    if (!cineRefLocked && !isRef && !character.trim()) return null;
    const opening = `A ${genre.mood} ${shot.phrase}, ${anglePhrase(rotation, tilt)}, ${comp.phrase}.`;
    const charSentence = cineRefLocked
      ? REF_ANCHOR_CLAUSE
      : isRef
      ? `Use the attached photo as the identity reference: preserve this person's face, features, skin tone, hair and overall likeness exactly — do not alter their identity in any way.${character.trim() ? ` (${character.trim()})` : ""} Change only the visual direction described below.`
      : `${character.trim()}.`;
    const actionSentence = action.trim() ? `They are ${action.trim()}.` : "";
    const outfitSentence = cineOutfitRef ? OUTFIT_ANCHOR_CLAUSE : (outfit.trim() ? `Wearing ${outfit.trim()}.` : "");
    const prodIdentity = injectedProduct ? ` The product: ${injectedProduct.text}` : "";
    const productSentence = injectProduct
      ? `The subject is ${productInteraction.trim() ? productInteraction.trim() : "holding and presenting the product naturally"} — keep the product's shape, color, logo and details exactly as in the provided product reference.${prodIdentity}`
      : "";
    const locationSentence = location.trim() ? `The scene is set in ${location.trim()}.` : "";
    const placeSentence = charPlacement ? placementPhrase(charPx, charPy, charDist) : "";
    // Focal length speaks lens character only — figure size comes exclusively from shot type.
    const perspective = focalLength >= 85 ? "compressed perspective, flattened depth planes" : focalLength <= 24 ? "wide-angle perspective with mild edge stretch" : "natural perspective";
    const cameraSentence = `Shot on a ${lens.name} at ${focalLength}mm (${perspective}) on a ${sensor} sensor, aperture f/${aperture} for ${lens.character}.`;
    const lightingSentence = `Lit ${key.phrase} with a ${quality.phrase} quality at a ${kelvin}K color temperature.`;
    const expressionSentence = expressionPhrase.trim() ? `Their face shows ${expressionPhrase.trim()}.` : "";
    const eyeSentence = eyeEngine
      ? `The eyes are the anchor of realism: sharp, moist, and alive, with ${CATCHLIGHT_BY_KEY[keyId]}, faint reflections of the surroundings on the cornea, subtle asymmetry between the irises, and fine visible detail in the iris texture.`
      : "";
    const realismSentence = realismForShot(shotId, { eyeSentence, skinTexture, opticalImperfection });
    const closing = antiAI ? "Real photographic frame captured on a real camera — no CGI, no plastic, no AI smoothness, no skin smoothing." : "";
    const aspectSentence = photoAspect && photoAspect.phrase ? `${photoAspect.phrase.charAt(0).toUpperCase()}${photoAspect.phrase.slice(1)}.` : "";
    const refProportion = cineRefLocked ? "Figure proportions anatomically correct and consistent with the reference." : "";
    return [opening, charSentence, actionSentence, outfitSentence, productSentence, locationSentence, placeSentence, cameraSentence, lightingSentence, expressionSentence, realismSentence, brandClause, aspectSentence, closing, refProportion]
      .filter(Boolean)
      .join(" ");
  }, [identitySource, character, action, outfit, location, genreId, shotId, rotation, tilt, compId, lensId, sensor, focalIdx, apertureIdx, keyId, qualityId, kelvin, expressionPhrase, eyeEngine, skinTexture, opticalImperfection, antiAI, photoAspectId, injectProduct, productInteraction, injectedProduct, brandClause, charPlacement, charPx, charPy, charDist, cineRefLocked, cineOutfitRef]);

  // ---------- Product compiler ----------
  const productPrompt = useMemo(() => {
    if (!productDesc.trim()) return null;
    const aspectSentence = photoAspect && photoAspect.phrase ? `${photoAspect.phrase.charAt(0).toUpperCase()}${photoAspect.phrase.slice(1)}.` : "";
    const identity = productDesc.trim();

    if (productOutput === "clean") {
      return [
        `Extract the product from the attached reference photo into a clean, professional e-commerce asset: ${identity}.`,
        "Isolate the product perfectly, removing the original background, reflections of the old environment, watermarks and compression artifacts, reconstructing any clipped edges cleanly.",
        `Place it on ${prodBg.phrase} with ${prodLight.phrase}, from ${prodAngle.phrase}.`,
        "Keep the product's shape, proportions, colors, materials, label and logo exactly identical to the reference — do not redesign or 'improve' any detail.",
        prodContactShadow ? "Ground it with a believable soft contact shadow — nothing floats." : "",
        brandClause,
        aspectSentence,
        "Commercial studio quality, tack-sharp, true-to-life color — no CGI look, no AI artifacts.",
      ].filter(Boolean).join(" ");
    }

    if (productOutput === "sheet") {
      return [
        `Create a product reference sheet as ONE single image: a clean 3x2 grid showing the exact same product — ${identity} — from six views: ${SHEET_ANGLES.map((a) => a.phrase).join("; ")}.`,
        "The product must be pixel-consistent across all six views: identical shape, proportions, colors, materials, label and logo, matching the attached reference photo exactly.",
        `Every view uses identical ${prodLight.phrase} on ${prodBg.phrase}, with the same scale and centered placement in each cell, thin neutral dividers between cells.`,
        prodContactShadow ? "Each view is grounded with the same soft contact shadow." : "",
        "This sheet will be used as a consistency reference for future generations, so accuracy to the real product matters more than drama.",
        brandClause,
        "Clean, catalog-grade, tack-sharp — no CGI look, no AI artifacts.",
      ].filter(Boolean).join(" ");
    }

    if (productOutput === "angles") {
      const shared = [
        `keep the product exactly identical to the attached reference photo — same shape, proportions, colors, materials, label and logo`,
        `${prodLight.phrase} on ${prodBg.phrase}`,
        prodContactShadow ? "grounded with a soft contact shadow" : "",
        "commercial studio quality, tack-sharp, no CGI look, no AI artifacts",
      ].filter(Boolean).join("; ");
      return SHEET_ANGLES
        .map((a, i) => `${i + 1}. [${a.label}] A professional product photograph of ${identity}, shot from ${a.phrase}. The product has ${material.phrase}. Consistency rules: ${shared}.${brandClause ? " " + brandClause : ""}${aspectSentence ? " " + aspectSentence : ""}`)
        .join("\n\n");
    }

    // beauty (default)
    const opening = `A professional product photograph of ${identity}, shot from ${prodAngle.phrase}.`;
    const materialSentence = `The product has ${material.phrase}.`;
    const lightingSentence = `Lit with ${prodLight.phrase}.`;
    const bgSentence = `Set against ${prodBg.phrase}.`;
    const reflectionSentence = prodRealReflection
      ? "Reflections and highlights follow real optical physics, with an accurate soft reflection of the light source and clean, dust-free surfaces."
      : "";
    const shadowSentence = prodContactShadow
      ? "The product sits with a believable contact shadow grounding it to the surface — nothing floats."
      : "";
    const closing = "Commercial studio quality, tack-sharp focus, true-to-life color, captured on a real camera — no CGI look, no plastic rendering, no AI artifacts.";
    return [opening, materialSentence, lightingSentence, bgSentence, reflectionSentence, shadowSentence, brandClause, aspectSentence, closing]
      .filter(Boolean)
      .join(" ");
  }, [productDesc, productOutput, materialId, prodLightId, prodBgId, prodAngleId, prodRealReflection, prodContactShadow, photoAspectId, brandClause]);

  // ---------- Design compiler ----------
  const designPrompt = useMemo(() => {
    if (!designDesc.trim()) return null;
    const opening = `${aspect.phrase.charAt(0).toUpperCase() + aspect.phrase.slice(1)}: ${thumbType.phrase} for ${designDesc.trim()}.`;
    const refSentence = designRef.trim() ? `Match the visual style of this reference: ${designRef.trim()}.` : "";
    const layoutSentence = thumbLayout.trim() ? `Layout: ${thumbLayout.trim()}.` : "";
    const headline = textBlocks[0];
    const sub = textBlocks[1];
    const captionSentence = headline.text.trim() ? `Include the on-image headline "${headline.text.trim()}" rendered as ${textStyle.trim() || "clean bold text"}.` : "";
    const subSentence = sub.enabled && sub.text.trim() ? `Add a smaller secondary label "${sub.text.trim()}".` : "";
    const fontVal = brandFontField.trim() || (applyBrand ? brand.font.trim() : "");
    const fontSentence = fontVal
      ? `Set the lettering in ${fontVal} (or the closest visual match), crisply rendered and correctly spelled.`
      : (headline.text.trim() ? "Render all text crisply and correctly spelled with a strong readable typeface." : "");
    const placementParts = [];
    if (headline.text.trim()) placementParts.push(textPositionPhrase(headline, "headline"));
    if (sub.enabled && sub.text.trim()) placementParts.push(textPositionPhrase(sub, "secondary label"));
    const placementSentence = placementParts.join(" ");
    const colorSentence = `Color treatment: ${colorTreat.trim() || "high-contrast colors"}, rendered in ${renderStyle.trim() || "photographic realism"}.`;
    const legibilitySentence = designLegibility
      ? "A single clear focal hierarchy that stays instantly readable even scaled down to a small thumbnail, with strong figure-to-ground separation."
      : "";
    const closing = "Designed to stop the scroll — intentional and clean, not cluttered.";
    return [opening, refSentence, brandClause, layoutSentence, captionSentence, subSentence, fontSentence, placementSentence, colorSentence, legibilitySentence, closing]
      .filter(Boolean)
      .join(" ");
  }, [designDesc, aspectId, thumbTypeId, thumbLayout, designRef, brandFontField, textBlocks, textStyle, colorTreat, renderStyle, designLegibility, brandClause, applyBrand, brand.font]);

  // ── Location compiler ──────────────────────────────────────────────────────
  const locationPrompt = useMemo(() => {
    if (!locationDesc.trim()) return null;
    const identity = locationDesc.trim();
    const todObj = TIME_OF_DAY.find((t) => t.id === timeOfDay);
    const wObj = WEATHER_CONDITIONS.find((w) => w.id === weatherId);
    const atmo = `${todObj ? todObj.phrase : "at golden hour"}, ${wObj ? wObj.phrase : "under clear skies"}`;
    const closing = "Real photographic quality, tack-sharp — no CGI look, no AI artifacts.";
    if (locationOutput === "sheet") return [`Create a location reference sheet as ONE single image: a clean 2x2 grid showing the exact same location — ${identity} — from four views: ${LOCATION_SHEET_VIEWS.join("; ")}.`, "The environment must be visually consistent across all four cells: identical architecture, materials, colors and props.", `All views use the same time and atmosphere: ${atmo}.`, "Thin neutral dividers between cells. This sheet is a consistency reference for compositing.", brandClause, closing].filter(Boolean).join(" ");
    if (locationOutput === "plate") return [`An empty background plate of ${identity}: no people, no characters, nothing that would conflict with compositing a subject into the scene.`, `${atmo.charAt(0).toUpperCase() + atmo.slice(1)}.`, "Clean, seamless and ready for a subject to be placed in — no motion blur, no clipping objects, clear foreground area.", brandClause, closing].filter(Boolean).join(" ");
    return [`A hero establishing shot of ${identity}.`, `${atmo.charAt(0).toUpperCase() + atmo.slice(1)}.`, "Capture the full character and spatial depth of the environment — architecture, materials, atmosphere and scale in one frame.", brandClause, closing].filter(Boolean).join(" ");
  }, [locationDesc, locationOutput, timeOfDay, weatherId, brandClause]);

  // ── Storyboard compiler ─────────────────────────────────────────────────────
  const sbContinuityClause = "Same character, same wardrobe, same location, and same lighting as every other frame in this scene — identity and continuity locked.";
  const sbSceneLocks = useMemo(() => {
    const ch = characters.find((c) => c.id === sbCharacterId);
    const pr = products.find((p) => p.id === sbProductId);
    const lo = locations.find((l) => l.id === sbLocationId);
    if (!ch || !lo) return null;
    const todObj = TIME_OF_DAY.find((t) => t.id === sbTimeOfDay);
    const wObj = WEATHER_CONDITIONS.find((w) => w.id === sbWeather);
    const lightObj = SB_LIGHTING.find((l) => l.id === sbLighting) || SB_LIGHTING[0];
    return {
      charLock: sbRefLocked ? REF_ANCHOR_CLAUSE : `The character: ${ch.text.replace(/\.+$/, "")}.`,
      prodLock: pr ? `The product must match the product reference exactly: ${pr.text.replace(/\.+$/, "")}.` : "",
      locLock: `The location: ${lo.text.replace(/\.+$/, "")}, ${todObj ? todObj.phrase : ""}, ${wObj ? wObj.phrase : ""}.`,
      lighting: `Scene lighting: ${lightObj.phrase}.`,
      charText: ch.text, locText: lo.text,
    };
  }, [characters, products, locations, sbCharacterId, sbProductId, sbLocationId, sbTimeOfDay, sbWeather, sbLighting, sbRefLocked]);

  const sbAspectObj = PHOTO_ASPECTS.find((a) => a.id === sbAspect);
  const sbAspectClause = sbAspectObj && sbAspectObj.phrase ? `${sbAspectObj.phrase.charAt(0).toUpperCase()}${sbAspectObj.phrase.slice(1)}.` : "";

  // Each frame compiles to a FULL STANDALONE prompt (context first, manual last).
  const sbFramePrompts = useMemo(() => {
    if (!sbSceneLocks) return [];
    const ctx = creativeContext && contextType ? contextType.phrase : "";
    return sbFrames.map((f) => {
      const shotObj = SHOT_TYPES.find((s) => s.id === f.shotType) || SHOT_TYPES[1];
      const deltas = `A ${shotObj.phrase}, ${anglePhrase(f.angleRot, 0)}.`;
      return [
        ctx,
        sbSceneLocks.charLock,
        sbSceneLocks.prodLock,
        sbSceneLocks.locLock,
        sbSceneLocks.lighting,
        sbDirection.trim(),
        deltas,
        f.action.trim() ? `The character is ${f.action.trim().replace(/\.+$/, "")}.` : "",
        f.expressionPhrase.trim() ? `Their face shows ${f.expressionPhrase.trim().replace(/\.+$/, "")}.` : "",
        placementPhrase(f.px, f.py, f.dist),
        f.blockingClause,
        sbContinuityClause,
        sbAspectClause,
        REALISM_CLOSE,
        ANTI_TEXT_CLAUSE,
        manualInstruction.trim(),
      ].filter(Boolean).join(" ");
    });
  }, [sbSceneLocks, sbFrames, sbDirection, sbAspectClause, creativeContext, contextType, manualInstruction]);

  const assemblePrompt = useMemo(() => {
    if (!sbFramePrompts.length) return null;
    return sbFramePrompts.map((t, i) => `FRAME ${i + 1}\n${t}`).join("\n\n");
  }, [sbFramePrompts]);

  // Storyboard sheet: one grid image containing all frames (previz overview).
  const sbSheetPrompt = useMemo(() => {
    if (!sbSceneLocks || sbFrames.length < 2) return null;
    const n = sbFrames.length;
    const cols = n <= 4 ? 2 : n <= 6 ? 3 : 4;
    const pos = (i) => `row ${Math.floor(i / cols) + 1}, column ${(i % cols) + 1}`;
    const lightObj = SB_LIGHTING.find((l) => l.id === sbLighting) || SB_LIGHTING[0];
    const panelLines = sbFrames.map((f, i) => {
      const shotObj = SHOT_TYPES.find((s) => s.id === f.shotType) || SHOT_TYPES[1];
      return `Panel ${i + 1} (${pos(i)}): ${shotObj.phrase}, ${anglePhrase(f.angleRot, 0)}${f.action.trim() ? ` — ${f.action.trim().replace(/\.+$/, "")}` : ""}.${f.expressionPhrase.trim() ? ` Expression: ${f.expressionPhrase.trim().replace(/\.+$/, "")}.` : ""}`;
    }).join("\n");
    return [
      `A ${n}-panel storyboard previz sheet arranged as a ${cols}-column by 2-row grid in a single frame, separated by hairline gutters in the exact same mid-gray tone as the backdrop, no white lines, no visible borders. Every panel shows the same single character in the same location. ${sbSceneLocks.charLock} ${sbSceneLocks.locLock} ${sbSceneLocks.lighting}${sbDirection.trim() ? ` ${sbDirection.trim().replace(/\.+$/, "")}.` : ""}`,
      panelLines,
      `The backdrop of every panel is the location environment itself under the same scene lighting — identical character identity and location continuity locked across all panels.`,
      `${REALISM_CLOSE} ${ANTI_TEXT_CLAUSE}`,
    ].join("\n\n");
  }, [sbSceneLocks, sbFrames, sbLighting, sbDirection]);

  // Frame list operations
  const sbAddFrame = () => setSbFrames((fs) => (fs.length >= 8 ? fs : [...fs, newFrame()]));
  const sbDuplicateFrame = (i) => setSbFrames((fs) => {
    if (fs.length >= 8) return fs;
    const copy = { ...fs[i], id: newFrame().id };
    return [...fs.slice(0, i + 1), copy, ...fs.slice(i + 1)];
  });
  const sbDeleteFrame = (i) => setSbFrames((fs) => (fs.length <= 1 ? fs : fs.filter((_, idx) => idx !== i)));
  const sbMoveFrame = (i, dir) => setSbFrames((fs) => {
    const j = i + dir;
    if (j < 0 || j >= fs.length) return fs;
    const next = [...fs];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
  const sbPatchFrame = (i, patch) => setSbFrames((fs) => fs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  // ── Character Maker compiler (V4.1: locked studio formula) ─────────────────
  const characterPrompt = useMemo(() => {
    if (!cmRefLocked && !cmIdentityText.trim()) return null;
    const output = CHARMAKER_OUTPUTS.some((o) => o.id === cmOutput) ? cmOutput : "hero";
    const identityBlock = cmRefLocked ? REF_ANCHOR_CLAUSE : `${cmIdentityText.trim().replace(/\.+$/, "")}.`;
    const baseline = CM_BASELINE_WARDROBE[cmBaseGender] || CM_BASELINE_WARDROBE.female;
    const pronoun = cmBaseGender === "male" ? "He" : "She";
    const vibeObj = STYLE_VIBES.find((v) => v.id === cmVibe);
    const outfitLine = [vibeObj ? vibeObj.phrase : "", cmOutfit.trim()].filter(Boolean).join(", ");
    const close = `${REALISM_CLOSE} ${ANTI_TEXT_CLAUSE}`;

    if (output === "hero") {
      return [
        "A clean cinema-character-reference headshot, framed from forehead to upper chest with the face filling most of the frame.",
        identityBlock,
        `${pronoun} wears ${baseline}.`,
        "Body squared to camera, head level, neutral relaxed expression, eyes to camera, lips closed and relaxed, subtle controlled energy.",
        LOCKED_BACKDROP_LIGHT,
        close,
      ].join(" ");
    }

    if (output === "expressions") {
      const rowcol = ["top-left", "top-center", "top-right", "middle-left", "middle-center", "middle-right", "bottom-left", "bottom-center", "bottom-right"];
      const panelLines = CHARMAKER_EXPRESSIONS_9.map((e, i) => `Panel ${i + 1} (${rowcol[i]}): ${e.phrase}.`).join("\n");
      return [
        `A 9-panel character expression reference sheet arranged as a 3-column by 3-row grid in a single frame, separated by hairline gutters in the exact same mid-gray tone as the backdrop, no white lines, no visible borders. Each panel shows the same single character from the same chest-up angle — ${identityBlock} ${pronoun} wears ${baseline}.`,
        panelLines,
        `${lockedBackdropUniform("nine")} The face and identity must be absolutely consistent across all nine panels — same bone structure, same skin, same hair, same proportions in every cell. Only the expression changes.`,
        close,
      ].join("\n\n");
    }

    if (output === "sheet") {
      const wardrobe = outfitLine || baseline;
      const detailObj = CM_DETAIL_OPTIONS.find((d) => d.id === cmDetail) || CM_DETAIL_OPTIONS[0];
      const panels = [
        "Panel 1 (top-left): Full body front — straight-on neutral stance, weight even, arms relaxed at the sides, full styling readable from head to footwear.",
        "Panel 2 (top-center): Side profile close headshot, left side — tight crop from collarbone up, the character's left profile facing screen-right, hair fall, ear, jaw and chin geometry clearly readable.",
        "Panel 3 (top-right): Full body back — straight back view, showing hair fall from behind, garment drape, and footwear from behind.",
        "Panel 4 (bottom-left): Side profile close headshot, right side — tight crop from collarbone up, the character's right profile facing screen-left, a mirror of Panel 2 from the opposite side.",
        "Panel 5 (bottom-center): Front face close headshot — tight crop from collarbone up, body squared to camera, face filling the frame, eyes to camera, skin texture and facial structure clearly readable.",
        `Panel 6 (bottom-right): Detail shot — ${detailObj.clause}.`,
      ].join("\n");
      return [
        `A 6-panel character reference sheet arranged as a 3-column by 2-row grid in a single horizontal frame, separated by hairline gutters in the exact same mid-gray tone as the backdrop, no white lines, no visible borders. Each panel shows the same single character — ${identityBlock} wearing ${wardrobe}.`,
        panels,
        `${lockedBackdropUniform("six")} Sharp focus across every panel. Identical character identity locked across all six panels — same face, same skin, same hair, same wardrobe, same accessories, same proportions in every cell.`,
        close,
      ].join("\n\n");
    }

    if (output === "fullbody") {
      if (!cmOutfit.trim()) return null;
      return [
        "A full-body character reference.",
        identityBlock,
        `The character wears ${outfitLine}, head to toe.`,
        "Standing angled slightly from camera, weight shifted naturally, head level, neutral relaxed expression, eyes to camera. Framed full body from head to just below the footwear.",
        LOCKED_BACKDROP_LIGHT,
        close,
      ].join(" ");
    }

    if (output === "outfitsheet") {
      if (!cmOutfit.trim()) return null;
      const panels = CHARMAKER_OUTFIT_PANELS.map((p, i) => `Panel ${i + 1}: ${p}.`).join("\n");
      return [
        `A 3-panel outfit reference sheet arranged as a single horizontal frame, separated by hairline gutters in the exact same mid-gray tone as the backdrop, no white lines, no visible borders. Every panel shows the same single character — ${identityBlock} — wearing ${outfitLine}.`,
        panels,
        "The clothing, fabric, colors and details must be pixel-consistent across all panels. The face appears ONLY in the third anchor panel so downstream video tools take identity from that single face.",
        `${lockedBackdropUniform("three")}`,
        close,
      ].join("\n\n");
    }

    return null;
  }, [cmOutput, cmIdentityText, cmRefLocked, cmBaseGender, cmDetail, cmVibe, cmOutfit]);

  const contextClause = creativeContext && contextType ? contextType.phrase : "";
  const basePrompt = mode === "cinema" ? cinemaPrompt : mode === "product" ? productPrompt : mode === "location" ? locationPrompt : mode === "assemble" ? assemblePrompt : mode === "charmaker" ? characterPrompt : mode === "blocking" ? (blClause || null) : designPrompt;
  // contextClause goes FIRST — classifiers weight the opening more heavily.
  // Storyboard frames are already full standalone prompts (context + manual baked in).
  // Blocking output is a raw spatial clause meant for injection, not a full prompt.
  const promptText = basePrompt
    ? (mode === "assemble" || mode === "blocking" ? basePrompt : [contextClause, basePrompt, manualInstruction.trim()].filter(Boolean).join(" "))
    : null;
  const isMultiPrompt = (mode === "product" && productOutput === "angles" && !!promptText) || (mode === "assemble" && sbFrames.length > 1 && !!promptText);

  const handleCopy = () => {
    if (!promptText) return;
    copyText(promptText, () => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };

  const snapshot = () => ({
    lensId, sensor, focalIdx, apertureIdx, genreId, keyId, qualityId, kelvin,
    identitySource, character, action, outfit, location, shotId, rotation, tilt, compId, cineRefLocked, cineOutfitRef,
    skinTexture, opticalImperfection, antiAI, eyeEngine, expressionPhrase,
    charPlacement, charPx, charPy, charDist,
    photoAspectId, injectProduct, productInteraction, injectedProductId, manualInstruction, creativeContext, contextTypeId, applyBrand,
    productOutput, productDesc, materialId, prodLightId, prodBgId, prodAngleId, prodRealReflection, prodContactShadow,
    locationOutput, locationDesc, timeOfDay, weatherId,
    designDesc, aspectId, thumbLayout, colorTreat, renderStyle, textStyle, designLegibility,
    designRef, brandFontField, thumbTypeId, textBlocks,
    sbCharacterId, sbProductId, sbLocationId, sbTimeOfDay, sbWeather, sbLighting, sbDirection, sbAspect, sbRefLocked, sbFrames,
    cmOutput, cmAge, cmGender, cmSkin, cmFace, cmEyes, cmHairColor, cmHairLength, cmHairTexture, cmBuild,
    cmMarks, cmIdentityText, cmIdentityDirty, cmOutfit, cmVibe, cmSource,
    cmBaseGender, cmRefLocked, cmDetail,
    blLocationId, cineBlockingId,
  });

  const restore = (d) => {
    const setters = {
      lensId: setLensId, sensor: setSensor, focalIdx: setFocalIdx, apertureIdx: setApertureIdx,
      genreId: setGenreId, keyId: setKeyId, qualityId: setQualityId, kelvin: setKelvin,
      subject: setCharacter, setting: setLocation,
      identitySource: setIdentitySource, character: setCharacter, action: setAction, outfit: setOutfit, location: setLocation,
      shotId: setShotId, rotation: setRotation, tilt: setTilt, compId: setCompId,
      cineRefLocked: setCineRefLocked, cineOutfitRef: setCineOutfitRef,
      photoAspectId: setPhotoAspectId,
      charPlacement: setCharPlacement, charPx: setCharPx, charPy: setCharPy, charDist: setCharDist,
      injectProduct: setInjectProduct, productInteraction: setProductInteraction, injectedProductId: setInjectedProductId,
      manualInstruction: setManualInstruction, creativeContext: setCreativeContext, contextTypeId: setContextTypeId, applyBrand: setApplyBrand,
      skinTexture: setSkinTexture, opticalImperfection: setOpticalImperfection, antiAI: setAntiAI,
      eyeEngine: setEyeEngine, expressionPhrase: setExpressionPhrase,
      productOutput: setProductOutput, productDesc: setProductDesc, materialId: setMaterialId, prodLightId: setProdLightId,
      prodBgId: setProdBgId, prodAngleId: setProdAngleId, prodRealReflection: setProdRealReflection,
      prodContactShadow: setProdContactShadow,
      locationOutput: setLocationOutput, locationDesc: setLocationDesc, timeOfDay: setTimeOfDay, weatherId: setWeatherId,
      designDesc: setDesignDesc, aspectId: setAspectId, thumbLayout: setThumbLayout,
      colorTreat: setColorTreat, renderStyle: setRenderStyle, textStyle: setTextStyle, designLegibility: setDesignLegibility,
      designRef: setDesignRef, brandFontField: setBrandFontField, thumbTypeId: setThumbTypeId, textBlocks: setTextBlocks,
      sbCharacterId: setSbCharacterId, sbProductId: setSbProductId, sbLocationId: setSbLocationId,
      sbTimeOfDay: setSbTimeOfDay, sbWeather: setSbWeather, sbLighting: setSbLighting,
      sbDirection: setSbDirection, sbAspect: setSbAspect, sbRefLocked: setSbRefLocked,
      sbFrames: (v) => setSbFrames(Array.isArray(v) && v.length ? v.map((f) => ({ ...newFrame(), ...f })) : [newFrame()]),
      cmOutput: (v) => setCmOutput(CHARMAKER_OUTPUTS.some((o) => o.id === v) ? v : "hero"),
      cmAge: setCmAge, cmGender: setCmGender, cmSkin: setCmSkin,
      cmFace: setCmFace, cmEyes: setCmEyes, cmHairColor: setCmHairColor,
      cmHairLength: setCmHairLength, cmHairTexture: setCmHairTexture, cmBuild: setCmBuild,
      cmMarks: setCmMarks, cmIdentityText: setCmIdentityText, cmIdentityDirty: setCmIdentityDirty,
      cmOutfit: setCmOutfit, cmVibe: setCmVibe, cmSource: setCmSource,
      cmBaseGender: setCmBaseGender, cmRefLocked: setCmRefLocked, cmDetail: setCmDetail,
      blLocationId: setBlLocationId, cineBlockingId: setCineBlockingId,
    };
    Object.entries(d).forEach(([k, v]) => { if (setters[k]) setters[k](v); });
  };

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) return;
    const next = [...presets, { id: Date.now().toString(), name, mode, data: snapshot() }];
    setPresets(next);
    store.write(PRESET_KEY, next);
    setPresetName("");
    setSavingOpen(false);
  };
  const loadPreset = (p) => { setMode(p.mode); restore(p.data); };
  const deletePreset = (id) => {
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    store.write(PRESET_KEY, next);
  };
  const modePresets = presets.filter((p) => p.mode === mode);

  // Character library
  const saveCharacter = () => {
    const name = charName.trim();
    if (!name || !character.trim()) return;
    const next = [...characters, { id: Date.now().toString(), name, text: character.trim() }];
    setCharacters(next);
    store.write(CHAR_KEY, next);
    setCharName("");
    setCharSavingOpen(false);
  };
  const deleteCharacter = (id) => {
    const next = characters.filter((c) => c.id !== id);
    setCharacters(next);
    store.write(CHAR_KEY, next);
    if (sbCharacterId === id) setSbCharacterId("");
  };

  // Product library
  const saveProduct = () => {
    const name = prodName.trim();
    if (!name || !productDesc.trim()) return;
    const next = [...products, { id: Date.now().toString(), name, text: productDesc.trim() }];
    setProducts(next);
    store.write(PRODUCT_KEY, next);
    setProdName("");
    setProdSavingOpen(false);
  };
  const deleteProduct = (id) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    store.write(PRODUCT_KEY, next);
    if (injectedProductId === id) setInjectedProductId("");
    if (sbProductId === id) setSbProductId("");
  };

  // Location library
  const saveLocation = () => {
    const name = locName.trim();
    if (!name || !locationDesc.trim()) return;
    const next = [...locations, { id: Date.now().toString(), name, text: locationDesc.trim() }];
    setLocations(next); store.write(LOCATION_KEY, next); setLocName(""); setLocSavingOpen(false);
  };
  const deleteLocation = (id) => {
    const next = locations.filter((l) => l.id !== id);
    setLocations(next); store.write(LOCATION_KEY, next);
    if (sbLocationId === id) setSbLocationId("");
    if (blLocationId === id) setBlLocationId("");
  };

  // ── Blocking mode ───────────────────────────────────────────────────────────
  // Patch a location entry in place, preserving any fields we don't know about.
  const patchLocationEntry = (id, patch) => {
    const next = locations.map((l) => (l.id === id ? { ...l, ...patch } : l));
    setLocations(next);
    store.write(LOCATION_KEY, next);
  };
  const blParse = () => {
    const { subAreas, errors } = parseSubAreas(blPasteText);
    setBlParseErrors(errors);
    if (subAreas.length >= 2) {
      patchLocationEntry(blLocationId, { subAreas });
      setBlReextract(false);
      setBlPasteText("");
    }
  };
  const blMoveSubArea = (i, pt) => {
    patchLocationEntry(blLocationId, { subAreas: blSubAreas.map((sa, idx) => (idx === i ? { ...sa, ...pt } : sa)) });
  };
  const blMoveCharacter = (i, pt) => setBlCharacters((cs) => cs.map((c, idx) => (idx === i ? { ...c, ...pt } : c)));
  const blPatchCharacter = (i, patch) => setBlCharacters((cs) => cs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const blAddCharacter = () => setBlCharacters((cs) => (cs.length >= 2 ? cs : [...cs, { x: 60, y: 55, label: "Character B" }]));
  const blRemoveCharacter = (i) => {
    setBlCharacters((cs) => (cs.length <= 1 ? cs : cs.filter((_, idx) => idx !== i)));
    setBlSubjectIdx(0);
  };
  const blSaveBlocking = () => {
    const name = blName.trim();
    if (!name || !blLocation) return;
    const entry = { id: blLoadedId || Date.now().toString(), name, characters: blCharacters, camera: blCamera, subjectIdx: blSubjectIdx };
    const next = blBlockings.some((b) => b.id === entry.id)
      ? blBlockings.map((b) => (b.id === entry.id ? entry : b))
      : [...blBlockings, entry];
    patchLocationEntry(blLocationId, { blockings: next });
    setBlLoadedId(entry.id);
  };
  const blLoadBlocking = (b) => {
    setBlCharacters(Array.isArray(b.characters) && b.characters.length ? b.characters.map((c) => ({ ...c })) : [{ x: 40, y: 55, label: "Character A" }]);
    setBlCamera(b.camera ? { ...b.camera } : { x: 50, y: 90 });
    setBlSubjectIdx(b.subjectIdx || 0);
    setBlName(b.name);
    setBlLoadedId(b.id);
  };
  const blDeleteBlocking = (id) => {
    patchLocationEntry(blLocationId, { blockings: blBlockings.filter((b) => b.id !== id) });
    if (blLoadedId === id) setBlLoadedId("");
    if (cineBlockingId === id) setCineBlockingId("");
  };

  const saveCharacterFromCM = () => {
    const name = cmName.trim();
    if (!name || !cmIdentityText.trim()) return;
    const next = [...characters, { id: Date.now().toString(), name, text: cmIdentityText.trim() }];
    setCharacters(next);
    store.write(CHAR_KEY, next);
    setCmName("");
    setCmSavingOpen(false);
  };

  // Thumbnail type auto-suggest: sets matching color / text style / layout (still overridable).
  const pickThumbType = (t) => {
    setThumbTypeId(t.id);
    if (t.suggest) {
      const c = COLOR_TREATMENTS.find((x) => x.id === t.suggest.color);
      const ts = TEXT_STYLES.find((x) => x.id === t.suggest.text);
      const l = THUMB_LAYOUTS.find((x) => x.id === t.suggest.layout);
      if (c) setColorTreat(c.phrase);
      if (ts) setTextStyle(ts.phrase);
      if (l) setThumbLayout(l.phrase);
    }
  };

  const buildIdentityFromChips = () => {
    const gObj = ID_GENDER.find((g) => g.id === cmGender);
    const genderPhrase = gObj ? gObj.phrase : "person";
    const pronoun = cmGender === "woman" ? "She has" : cmGender === "man" ? "He has" : "They have";
    const ageObj = ID_AGE.find((a) => a.id === cmAge);
    const skinObj = ID_SKIN.find((s) => s.id === cmSkin);
    const faceObj = ID_FACE.find((f) => f.id === cmFace);
    const eyesObj = ID_EYES.find((e) => e.id === cmEyes);
    const hairColorObj = ID_HAIR_COLOR.find((h) => h.id === cmHairColor);
    const hairLengthObj = ID_HAIR_LENGTH.find((h) => h.id === cmHairLength);
    const hairTextureObj = ID_HAIR_TEXTURE.find((h) => h.id === cmHairTexture);
    const buildObj = ID_BUILD.find((b) => b.id === cmBuild);
    const parts = [];
    const subjectParts = [genderPhrase, ageObj ? ageObj.phrase : ""].filter(Boolean);
    if (skinObj) subjectParts.push(`with ${skinObj.phrase}`);
    parts.push(`A ${subjectParts.join(", ")}.`);
    const faceParts = [];
    if (faceObj) faceParts.push(faceObj.phrase);
    if (eyesObj) faceParts.push(eyesObj.phrase);
    if (faceParts.length) parts.push(`${pronoun} ${faceParts.join(" and ")}.`);
    if (hairLengthObj) {
      if (hairLengthObj.id === "bald") {
        parts.push(`${pronoun} ${hairLengthObj.phrase}.`);
      } else {
        const hairDesc = [hairTextureObj ? hairTextureObj.phrase : "", hairColorObj ? hairColorObj.phrase : "", hairLengthObj.phrase].filter(Boolean).join(" ");
        parts.push(`${pronoun} ${hairDesc} hair.`);
      }
    }
    if (buildObj) parts.push(`${pronoun} ${buildObj.phrase}.`);
    if (cmMarks.trim()) parts.push(cmMarks.trim());
    return parts.join(" ");
  };

  useEffect(() => {
    if (cmIdentityDirty || cmSource !== "scratch") return;
    if (!cmAge && !cmGender && !cmSkin && !cmFace && !cmEyes && !cmHairColor && !cmHairLength && !cmHairTexture && !cmBuild && !cmMarks.trim()) return;
    setCmIdentityText(buildIdentityFromChips());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmAge, cmGender, cmSkin, cmFace, cmEyes, cmHairColor, cmHairLength, cmHairTexture, cmBuild, cmMarks, cmIdentityDirty, cmSource]);

  const updateBlock = (i, patch) => {
    setTextBlocks((prev) => prev.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  };

  // Snap-aware angle setters
  const snapRot = (v) => (snapAngle ? Math.round((((v % 360) + 360) % 360) / 45) * 45 % 360 : (((v % 360) + 360) % 360));
  const snapTilt = (v) => (snapAngle ? Math.round(v / 15) * 15 : v);
  const setRotationSnapped = (v) => setRotation((prev) => snapRot(typeof v === "function" ? v(prev) : v));
  const setTiltSnapped = (v) => setTilt((prev) => Math.max(-90, Math.min(90, snapTilt(typeof v === "function" ? v(prev) : v))));

  const mkCopy = (text, setFlag) => () => copyText(text, () => { setFlag(true); setTimeout(() => setFlag(false), 1500); });

  const groupedRender = RENDER_STYLES.reduce((acc, r) => {
    (acc[r.group] = acc[r.group] || []).push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: COLORS.console }}>
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Aperture size={22} style={{ color: COLORS.amber }} className="mr-3 flex-shrink-0" />
          <div>
            <h1 className="text-2xl leading-tight" style={{ fontFamily: fDisplay, color: COLORS.paper, fontWeight: 700, letterSpacing: "0.02em" }}>
              CINEMA PROMPT STUDIO
            </h1>
            <p className="text-sm" style={{ fontFamily: fBody, color: COLORS.steel }}>
              Director console for photoreal prompts — set the rig, copy the shot.
            </p>
          </div>
        </div>

        {/* BRAND KIT — global */}
        <div className="mb-4 rounded-lg" style={{ backgroundColor: COLORS.panel, border: `1px solid ${applyBrand && brandHasContent ? COLORS.amberDim : COLORS.panelBorder}` }}>
          <button onClick={() => setBrandOpen((v) => !v)} className="flex items-center justify-between w-full px-4 py-3">
            <span className="flex items-center gap-2">
              <Palette size={14} style={{ color: COLORS.amber }} />
              <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.15em" }}>
                Brand Kit{brand.name.trim() ? ` · ${brand.name.trim()}` : ""}
              </span>
              {applyBrand && brandHasContent && (
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ fontFamily: fMono, color: COLORS.console, backgroundColor: COLORS.amber, fontSize: 9, fontWeight: 700 }}>ACTIVE</span>
              )}
            </span>
            {brandOpen ? <ChevronUp size={14} color={COLORS.steel} /> : <ChevronDown size={14} color={COLORS.steel} />}
          </button>
          {brandOpen && (
            <div className="px-4 pb-4">
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel }}>Brand name</div>
                  <input value={brand.name} onChange={(e) => setBrandField("name", e.target.value)} placeholder="e.g. Kopi Senja" className="w-full rounded p-2.5 text-sm" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel }}>Brand font / lettering feel</div>
                  <input value={brand.font} onChange={(e) => setBrandField("font", e.target.value)} placeholder="e.g. Montserrat ExtraBold, all caps" className="w-full rounded p-2.5 text-sm" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
                </div>
              </div>
              <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel }}>Color palette</div>
              <textarea value={brand.palette} onChange={(e) => setBrandField("palette", e.target.value)} placeholder="e.g. deep navy #0A1F44, warm gold #E6B34A, off-white" rows={2} className="w-full rounded p-2.5 text-sm resize-none mb-1" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              <ExamineHelper
                open={brandPaletteExOpen} setOpen={setBrandPaletteExOpen}
                copied={brandPaletteExCopied} onCopy={mkCopy(PALETTE_EXAMINE_PROMPT, setBrandPaletteExCopied)}
                prompt={PALETTE_EXAMINE_PROMPT}
                hint="Copy this, paste into an AI tool with your brand asset image, then paste the result into the palette field."
                linkLabel="Extract palette from a brand image →"
              />
              <div className="text-xs mb-1 mt-3" style={{ fontFamily: fBody, color: COLORS.steel }}>Mood (3–4 adjectives)</div>
              <input value={brand.mood} onChange={(e) => setBrandField("mood", e.target.value)} placeholder="e.g. warm, premium, calm, earthy" className="w-full rounded p-2.5 text-sm mb-3" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel }}>Full style reference (optional — richer than palette+mood)</div>
              <textarea value={brand.styleRef} onChange={(e) => setBrandField("styleRef", e.target.value)} placeholder="Paste an extracted style paragraph here, or describe the look yourself" rows={2} className="w-full rounded p-2.5 text-sm resize-none mb-1" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              <ExamineHelper
                open={brandStyleExOpen} setOpen={setBrandStyleExOpen}
                copied={brandStyleExCopied} onCopy={mkCopy(REF_EXAMINE_PROMPT, setBrandStyleExCopied)}
                prompt={REF_EXAMINE_PROMPT}
                hint="Copy this, paste into an AI tool with a reference image (thumbnail, moodboard, brand asset), then paste the result above."
                linkLabel="Extract full style from a reference image →"
              />
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.panelBorder}` }}>
                <Toggle
                  checked={applyBrand}
                  onChange={setApplyBrand}
                  label="Apply brand kit to compiled prompts"
                  description="Adds a brand art-direction clause to every mode (Cinema, Product, Design) until turned off"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mode switcher */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "cinema", label: "Cinema / Portrait" },
            { id: "product", label: "Product Photo" },
            { id: "location", label: "Location / Set" },
            { id: "design", label: "Design / Thumbnail" },
            { id: "assemble", label: "Storyboard" },
            { id: "blocking", label: "Blocking" },
            { id: "charmaker", label: "Character Maker" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="px-4 py-2 rounded text-sm transition-colors"
              style={{
                fontFamily: fDisplay, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600,
                backgroundColor: mode === m.id ? COLORS.amber : "transparent",
                color: mode === m.id ? COLORS.console : COLORS.steel,
                border: `1px solid ${mode === m.id ? COLORS.amber : COLORS.panelBorder}`,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Presets bar */}
        <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: COLORS.panel, border: `1px solid ${COLORS.panelBorder}` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.15em" }}>
              Presets · {mode}
            </span>
            {savingOpen ? (
              <div className="flex items-center gap-2">
                <input value={presetName} onChange={(e) => setPresetName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") savePreset(); }} placeholder="Preset name" autoFocus className="rounded px-2 py-1 text-sm" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}`, width: 150 }} />
                <button onClick={savePreset} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.amber, color: COLORS.console, fontWeight: 600 }}>Save</button>
                <button onClick={() => { setSavingOpen(false); setPresetName(""); }} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setSavingOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.amber, border: `1px solid ${COLORS.amberDim}` }}>
                <Save size={12} /> Save current
              </button>
            )}
          </div>
          {modePresets.length === 0 ? (
            <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>
              No saved presets for this mode yet — configure the panels, then Save current.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {modePresets.map((p) => (
                <div key={p.id} className="flex items-center rounded" style={{ border: `1px solid ${COLORS.panelBorder}` }}>
                  <button onClick={() => loadPreset(p)} className="px-3 py-1.5 text-sm" style={{ fontFamily: fBody, color: COLORS.paper }}>{p.name}</button>
                  <button onClick={() => deletePreset(p.id)} className="px-2 py-1.5" title="Delete" style={{ color: COLORS.steel }}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: console */}
          <div className="flex-1 min-w-0">
            {mode === "cinema" && (
            <>
            <Panel>
              <Eyebrow>01 — Rig</Eyebrow>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 140 }}>
                  <svg viewBox="-110 -110 220 220" width="120" height="120">
                    <circle cx="0" cy="0" r="102" fill="none" stroke={COLORS.panelBorder} strokeWidth="2" />
                    {Array.from({ length: 9 }).map((_, i) => (
                      <polygon key={i} points={bladePoints(i, 9, closure, 100, 12)} fill={COLORS.steel} fillOpacity="0.88" stroke={COLORS.amber} strokeWidth="0.5" />
                    ))}
                  </svg>
                  <div className="text-center mt-2" style={{ fontFamily: fMono, color: COLORS.amber, fontSize: 15, fontWeight: 700 }}>f/{aperture}</div>
                  <input type="range" min={0} max={APERTURE_STOPS.length - 1} step={1} value={apertureIdx} onChange={(e) => setApertureIdx(Number(e.target.value))} className="w-full mt-2" />
                  <div className="text-xs mt-1" style={{ fontFamily: fBody, color: COLORS.steel }}>Aperture</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Lens</div>
                    <div className="flex flex-wrap">
                      {LENSES.map((l) => (<Chip key={l.id} active={l.id === lensId} onClick={() => setLensId(l.id)}>{l.name}</Chip>))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Sensor</div>
                    <div className="flex flex-wrap">
                      {SENSORS.map((s) => (<Chip key={s} active={s === sensor} onClick={() => setSensor(s)}>{s}</Chip>))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Focal length</span>
                      <span style={{ fontFamily: fMono, color: COLORS.amber, fontSize: 15, fontWeight: 700 }}>{focalLength}mm</span>
                    </div>
                    <input type="range" min={0} max={FOCAL_MARKS.length - 1} step={1} value={focalIdx} onChange={(e) => setFocalIdx(Number(e.target.value))} className="w-full" />
                    <div className="flex justify-between mt-1">
                      {FOCAL_MARKS.map((m) => (<span key={m} className="text-xs" style={{ fontFamily: fMono, color: COLORS.panelBorder }}>{m}</span>))}
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel>
              <Eyebrow>02 — Genre</Eyebrow>
              <div className="flex flex-wrap">
                {GENRES.map((g) => (<Chip key={g.id} active={g.id === genreId} onClick={() => setGenreId(g.id)}>{g.label}</Chip>))}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>03 — Lighting</Eyebrow>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Key direction</div>
                <div className="flex gap-2">
                  {KEY_DIRECTIONS.map(({ id, label, Icon }) => (
                    <button key={id} onClick={() => setKeyId(id)} title={label} className="flex items-center justify-center rounded" style={{ width: 40, height: 40, backgroundColor: keyId === id ? COLORS.amber : "transparent", border: `1px solid ${keyId === id ? COLORS.amber : COLORS.panelBorder}` }}>
                      <Icon size={16} color={keyId === id ? COLORS.console : COLORS.steel} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Quality</div>
                <div className="flex flex-wrap">
                  {LIGHT_QUALITIES.map((q) => (<Chip key={q.id} active={q.id === qualityId} onClick={() => setQualityId(q.id)}>{q.label}</Chip>))}
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Color temperature</span>
                  <span style={{ fontFamily: fMono, color: COLORS.amber, fontSize: 15, fontWeight: 700 }}>{kelvin}K</span>
                </div>
                <input type="range" min={2700} max={9000} step={100} value={kelvin} onChange={(e) => setKelvin(Number(e.target.value))} className="w-full" style={{ background: `linear-gradient(90deg, #FF8A3D, #EDE6D6, #6FA8DC)`, height: 3, borderRadius: 2 }} />
                <div className="flex justify-between mt-1 text-xs" style={{ fontFamily: fBody, color: COLORS.panelBorder }}>
                  <span>Warm</span><span>Cool</span>
                </div>
              </div>
            </Panel>

            {/* Character — locked, now with identity source */}
            <Panel>
              <div className="flex items-center gap-2 mb-1">
                <Eyebrow>04 — Character</Eyebrow>
                <span className="text-xs px-1.5 py-0.5 rounded mb-3" style={{ fontFamily: fMono, color: COLORS.console, backgroundColor: COLORS.amber, fontSize: 10, fontWeight: 700 }}>LOCKED</span>
              </div>
              <Toggle
                checked={cineRefLocked}
                onChange={setCineRefLocked}
                label="Character reference attached"
                description="On: you will attach the character's saved reference image in your AI tool. Identity is anchored to the image, not re-described."
              />
              {cineRefLocked ? (
                <p className="text-xs mt-1 mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>
                  Identity is anchored to the attached reference image — the identity inputs below are ignored while this is on.
                </p>
              ) : (
              <>
              <div className="flex gap-2 mb-3 mt-2">
                {[
                  { id: "describe", label: "Describe identity" },
                  { id: "reference", label: "Reference photo attached" },
                ].map((s) => (
                  <Chip key={s.id} active={identitySource === s.id} onClick={() => setIdentitySource(s.id)}>{s.label}</Chip>
                ))}
              </div>
              {identitySource === "describe" ? (
                <>
                  <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>
                    Fixed identity — keep this <span style={{ color: COLORS.amber }}>exactly the same</span> across every frame for a consistent character
                  </div>
                  <textarea
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                    placeholder="e.g. a woman in her early 30s, warm olive skin, sharp jawline, dark almond eyes, shoulder-length wavy auburn hair, a small mole above her left lip"
                    rows={3}
                    className="w-full rounded p-3 text-sm resize-none"
                    style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.amberDim}` }}
                  />
                  <ExamineHelper
                    open={examineOpen} setOpen={setExamineOpen}
                    copied={examineCopied} onCopy={mkCopy(EXAMINE_PROMPT, setExamineCopied)}
                    prompt={EXAMINE_PROMPT}
                    hint="1. Copy this. 2. Paste into an AI tool together with your reference photo. 3. Paste the description it returns back into the Character box above."
                    linkLabel="Extract identity from a reference photo →"
                  />
                </>
              ) : (
                <>
                  <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>
                    You'll attach the person's photo in your gen tool. The prompt will <span style={{ color: COLORS.amber }}>lock their likeness</span> and change only the visual direction (lighting, mood, wardrobe, location, angle) you set below.
                  </div>
                  <textarea
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                    placeholder="Optional short note about the person, e.g. keep her glasses on"
                    rows={2}
                    className="w-full rounded p-3 text-sm resize-none"
                    style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.amberDim}` }}
                  />
                </>
              )}
              </>
              )}

              {/* Character library */}
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.panelBorder}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.1em" }}>Saved characters</span>
                  {charSavingOpen ? (
                    <div className="flex items-center gap-2">
                      <input value={charName} onChange={(e) => setCharName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveCharacter(); }} placeholder="Name" autoFocus className="rounded px-2 py-1 text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}`, width: 110 }} />
                      <button onClick={saveCharacter} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.amber, color: COLORS.console, fontWeight: 600 }}>Save</button>
                      <button onClick={() => { setCharSavingOpen(false); setCharName(""); }} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setCharSavingOpen(true)} disabled={!character.trim()} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: character.trim() ? COLORS.amber : COLORS.steel, opacity: character.trim() ? 1 : 0.4, border: `1px solid ${COLORS.amberDim}` }}>
                      <Save size={11} /> Save this character
                    </button>
                  )}
                </div>
                {characters.length === 0 ? (
                  <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>No saved characters yet — build one, then save to reuse across frames.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {characters.map((c) => (
                      <div key={c.id} className="flex items-center rounded" style={{ border: `1px solid ${COLORS.panelBorder}` }}>
                        <button onClick={() => setCharacter(c.text)} className="px-3 py-1.5 text-sm" style={{ fontFamily: fBody, color: COLORS.paper }} title={c.text}>{c.name}</button>
                        <button onClick={() => deleteCharacter(c.id)} className="px-2 py-1.5" title="Delete" style={{ color: COLORS.steel }}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>05 — Action &amp; Pose</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>What is the character doing (change this per frame)</div>
              <textarea value={action} onChange={(e) => setAction(e.target.value)} placeholder="e.g. glancing back over one shoulder" rows={2} className="w-full rounded p-3 text-sm resize-none mb-2" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              <div className="flex flex-wrap">
                {ACTION_CHIPS.map((a) => (<Chip key={a} active={action === a} onClick={() => setAction(a)}>{a.length > 26 ? a.slice(0, 24) + "…" : a}</Chip>))}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>06 — Outfit</Eyebrow>
              <Toggle
                checked={cineOutfitRef}
                onChange={setCineOutfitRef}
                label="Outfit as attached reference"
                description="On: you will attach an outfit reference image (e.g. an outfit sheet from Character Maker). The outfit is anchored to the image, not described."
              />
              {cineOutfitRef ? (
                <p className="text-xs mt-1" style={{ fontFamily: fBody, color: COLORS.steel }}>
                  The outfit is anchored to the attached reference image — the description below is ignored while this is on.
                </p>
              ) : (
              <>
              <div className="text-xs mb-2 mt-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Wardrobe — separate from identity, so you can restyle without changing the person</div>
              <textarea value={outfit} onChange={(e) => setOutfit(e.target.value)} placeholder="e.g. an oversized cream trench coat over a black turtleneck" rows={2} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              </>
              )}
            </Panel>

            {/* Product injection — now connected to Product Library */}
            <Panel>
              <Eyebrow>07 — Inject Product</Eyebrow>
              <Toggle
                checked={injectProduct}
                onChange={setInjectProduct}
                label="Place a product with the character"
                description="Attach the real product image in your gen tool — this locks its details and describes the interaction"
              />
              {injectProduct && (
                <>
                  {products.length > 0 && (
                    <div className="mt-2 mb-2">
                      <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Pull identity from Product Library (saved in Product Photo mode)</div>
                      <div className="flex flex-wrap">
                        <Chip active={!injectedProductId} onClick={() => setInjectedProductId("")}>None</Chip>
                        {products.map((p) => (
                          <Chip key={p.id} active={injectedProductId === p.id} onClick={() => setInjectedProductId(p.id)} title={p.text}>
                            <span className="inline-flex items-center gap-1"><Package size={11} />{p.name}</span>
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea
                    value={productInteraction}
                    onChange={(e) => setProductInteraction(e.target.value)}
                    placeholder="How does the character interact with it? e.g. holding the bottle at chest height, label facing the camera"
                    rows={2}
                    className="w-full rounded p-3 text-sm resize-none mt-2"
                    style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }}
                  />
                </>
              )}
            </Panel>

            <Panel>
              <Eyebrow>08 — Location</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Type your own, pick a preset, or load from Location Library</div>
              {locations.length > 0 && (
                <div className="flex flex-wrap mb-2">
                  {locations.map((l) => (
                    <Chip key={l.id} active={location === l.text} onClick={() => setLocation(l.text)} title={l.text}>
                      📍 {l.name}
                    </Chip>
                  ))}
                </div>
              )}
              <textarea value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. a rain-slicked city street at dusk, neon reflected in puddles" rows={2} className="w-full rounded p-3 text-sm resize-none mb-2" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              <div className="flex flex-wrap">
                {LOCATION_PRESETS.map((l) => (<Chip key={l.id} active={location === l.phrase} onClick={() => setLocation(l.phrase)}>{l.label}</Chip>))}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>09 — Framing</Eyebrow>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Shot type</div>
                <div className="flex flex-wrap">
                  {SHOT_TYPES.map((s) => (<Chip key={s.id} active={s.id === shotId} onClick={() => setShotId(s.id)}>{s.label}</Chip>))}
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Camera angle</span>
                  <span className="text-xs" style={{ fontFamily: fMono, color: COLORS.amber }}>{Math.round(rotation)}° / {Math.round(tilt)}°</span>
                </div>
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Drag the sphere to orbit the camera around the subject</div>
                <div className="rounded-lg mb-3" style={{ backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}` }}>
                  <AngleOrbit rotation={rotation} tilt={tilt} setRotation={setRotationSnapped} setTilt={setTiltSnapped} />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-1">
                    {ANGLE_DIRECTIONS.map((d) => (
                      <button key={d.label} onClick={() => setRotation(d.rot)} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: Math.round(rotation) === d.rot ? COLORS.amber : "transparent", color: Math.round(rotation) === d.rot ? COLORS.console : COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>{d.label}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-wrap gap-1">
                    {TILT_PRESETS.map((t) => (
                      <button key={t.label} onClick={() => setTilt(t.val)} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: Math.round(tilt) === t.val ? COLORS.amber : "transparent", color: Math.round(tilt) === t.val ? COLORS.console : COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>{t.label}</button>
                    ))}
                  </div>
                  <button onClick={() => setSnapAngle((v) => !v)} className="flex items-center gap-1.5 px-2 py-1 rounded text-xs flex-shrink-0" style={{ fontFamily: fBody, backgroundColor: snapAngle ? COLORS.amber : "transparent", color: snapAngle ? COLORS.console : COLORS.steel, border: `1px solid ${snapAngle ? COLORS.amber : COLORS.panelBorder}`, fontWeight: snapAngle ? 600 : 400 }}>
                    {snapAngle ? "🔒 Snap on" : "Snap off"}
                  </button>
                </div>
                <div className="mb-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Rotation</span>
                    <span style={{ fontFamily: fMono, color: COLORS.amber, fontSize: 13 }}>{Math.round(rotation)}°</span>
                  </div>
                  <input type="range" min={0} max={360} step={1} value={rotation} onChange={(e) => setRotationSnapped(Number(e.target.value))} className="w-full" />
                </div>
                <div className="mb-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Tilt</span>
                    <span style={{ fontFamily: fMono, color: COLORS.amber, fontSize: 13 }}>{Math.round(tilt)}°</span>
                  </div>
                  <input type="range" min={-90} max={90} step={1} value={tilt} onChange={(e) => setTiltSnapped(Number(e.target.value))} className="w-full" />
                </div>
                <div className="mt-3 rounded p-2.5" style={{ backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}` }}>
                  <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Reads as: </span>
                  <span className="text-xs" style={{ fontFamily: fBody, color: COLORS.paper }}>{anglePhrase(rotation, tilt)}</span>
                </div>
              </div>
              {/* Character placement canvas */}
              <div className="mb-4">
                <Toggle checked={charPlacement} onChange={setCharPlacement} label="Place character in scene" description="Drag point to set position — front/back depth and left/right — translates to spatial prose in the prompt"/>
                {charPlacement && (
                  <div className="mt-2">
                    <PlacementCanvas px={charPx} py={charPy} dist={charDist} setPx={setCharPx} setPy={setCharPy} setDist={setCharDist}/>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Composition</div>
                <div className="flex flex-wrap">
                  {COMPOSITIONS.map((c) => (<Chip key={c.id} active={c.id === compId} onClick={() => setCompId(c.id)}>{c.label}</Chip>))}
                </div>
              </div>
              <div>
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Aspect ratio</div>
                <div className="flex flex-wrap">
                  {PHOTO_ASPECTS.map((a) => (<Chip key={a.id} active={a.id === photoAspectId} onClick={() => setPhotoAspectId(a.id)}>{a.label}</Chip>))}
                </div>
              </div>
            </Panel>

            <Panel>
              <Eyebrow>10 — Expression</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>
                Candid over posed — the fastest tell of an AI face is a perfectly posed expression. Pick a preset or write your own below.
              </div>
              <ChipField
                options={EXPRESSION_GROUPS}
                value={expressionPhrase}
                onChange={setExpressionPhrase}
                placeholder="Or describe your own expression in detail, e.g. a slow blink with a slight smirk…"
                rows={2}
                grouped={true}
              />
            </Panel>

            <Panel>
              <Eyebrow>11 — Realism Stack</Eyebrow>
              <Toggle checked={eyeEngine} onChange={setEyeEngine} label="Eye Engine" description="Catchlight matched to your key-light direction, corneal reflections, iris asymmetry & moisture" />
              <Toggle checked={skinTexture} onChange={setSkinTexture} label="Natural skin texture" description="Visible pores, subtle asymmetry — avoids the smoothed plastic look" />
              <Toggle checked={opticalImperfection} onChange={setOpticalImperfection} label="Optical imperfections" description="Fine grain, gentle chromatic aberration, natural bokeh falloff" />
              <Toggle checked={antiAI} onChange={setAntiAI} label="Anti-AI closing clause" description='Appends "no CGI, no plastic, no AI smoothness" to the prompt' />
            </Panel>
            </>
            )}

            {mode === "product" && (
            <>
            <Panel>
              <Eyebrow>01 — Output Type</Eyebrow>
              <div className="flex flex-wrap mb-2">
                {PRODUCT_OUTPUTS.map((o) => (
                  <Chip key={o.id} active={productOutput === o.id} onClick={() => setProductOutput(o.id)} title={o.desc}>{o.label}</Chip>
                ))}
              </div>
              <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>
                {PRODUCT_OUTPUTS.find((o) => o.id === productOutput).desc}
                {(productOutput === "clean" || productOutput === "sheet" || productOutput === "angles") && (
                  <span style={{ color: COLORS.amber }}> · Attach your product photo (e.g. from the website) in your gen tool alongside this prompt.</span>
                )}
              </p>
            </Panel>

            <Panel>
              <Eyebrow>02 — Product</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Describe the product's fixed identity — this is what stays consistent everywhere</div>
              <textarea value={productDesc} onChange={(e) => setProductDesc(e.target.value)} placeholder="e.g. a matte black glass perfume bottle with a brushed gold cap and a minimal white serif label" rows={3} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.amberDim}` }} />
              <ExamineHelper
                open={prodExOpen} setOpen={setProdExOpen}
                copied={prodExCopied} onCopy={mkCopy(PRODUCT_EXAMINE_PROMPT, setProdExCopied)}
                prompt={PRODUCT_EXAMINE_PROMPT}
                hint="Copy this, paste into an AI tool with your product photo, then paste the identity paragraph it returns back into the box above."
                linkLabel="Extract product identity from a photo →"
              />
              {/* Product library */}
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.panelBorder}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.1em" }}>Product library</span>
                  {prodSavingOpen ? (
                    <div className="flex items-center gap-2">
                      <input value={prodName} onChange={(e) => setProdName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveProduct(); }} placeholder="Name" autoFocus className="rounded px-2 py-1 text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}`, width: 110 }} />
                      <button onClick={saveProduct} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.amber, color: COLORS.console, fontWeight: 600 }}>Save</button>
                      <button onClick={() => { setProdSavingOpen(false); setProdName(""); }} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setProdSavingOpen(true)} disabled={!productDesc.trim()} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: productDesc.trim() ? COLORS.amber : COLORS.steel, opacity: productDesc.trim() ? 1 : 0.4, border: `1px solid ${COLORS.amberDim}` }}>
                      <Save size={11} /> Save this product
                    </button>
                  )}
                </div>
                {products.length === 0 ? (
                  <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>
                    Saved products can be injected into Cinema mode for consistent product placement.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center rounded" style={{ border: `1px solid ${COLORS.panelBorder}` }}>
                        <button onClick={() => setProductDesc(p.text)} className="px-3 py-1.5 text-sm inline-flex items-center gap-1.5" style={{ fontFamily: fBody, color: COLORS.paper }} title={p.text}><Package size={12} />{p.name}</button>
                        <button onClick={() => deleteProduct(p.id)} className="px-2 py-1.5" title="Delete" style={{ color: COLORS.steel }}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>03 — Surface &amp; Material</Eyebrow>
              <div className="flex flex-wrap">
                {MATERIALS.map((m) => (<Chip key={m.id} active={m.id === materialId} onClick={() => setMaterialId(m.id)}>{m.label}</Chip>))}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>04 — Lighting</Eyebrow>
              <div className="flex flex-wrap">
                {PRODUCT_LIGHTING.map((l) => (<Chip key={l.id} active={l.id === prodLightId} onClick={() => setProdLightId(l.id)}>{l.label}</Chip>))}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>05 — Background</Eyebrow>
              <div className="flex flex-wrap">
                {PRODUCT_BG.map((b) => (<Chip key={b.id} active={b.id === prodBgId} onClick={() => setProdBgId(b.id)}>{b.label}</Chip>))}
              </div>
            </Panel>

            {productOutput === "beauty" || productOutput === "clean" ? (
              <Panel>
                <Eyebrow>06 — Angle</Eyebrow>
                <div className="flex flex-wrap">
                  {PRODUCT_ANGLE.map((a) => (<Chip key={a.id} active={a.id === prodAngleId} onClick={() => setProdAngleId(a.id)}>{a.label}</Chip>))}
                </div>
              </Panel>
            ) : (
              <Panel>
                <Eyebrow>06 — Angles (fixed set)</Eyebrow>
                <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>
                  {SHEET_ANGLES.map((a) => a.label).join(" · ")} — the standard six views for a consistency reference sheet.
                </p>
              </Panel>
            )}

            <Panel>
              <Eyebrow>07 — Aspect Ratio</Eyebrow>
              <div className="flex flex-wrap">
                {PHOTO_ASPECTS.map((a) => (<Chip key={a.id} active={a.id === photoAspectId} onClick={() => setPhotoAspectId(a.id)}>{a.label}</Chip>))}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>08 — Realism Stack</Eyebrow>
              <Toggle checked={prodRealReflection} onChange={setProdRealReflection} label="Real reflection physics" description="Accurate light-source reflection, dust-free surfaces, no fake highlights" />
              <Toggle checked={prodContactShadow} onChange={setProdContactShadow} label="Grounded contact shadow" description="Believable contact shadow so the product never floats" />
            </Panel>
            </>
            )}

            {mode === "design" && (
            <>
            <Panel>
              <Eyebrow>01 — Brief</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>What is this design for</div>
              <textarea value={designDesc} onChange={(e) => setDesignDesc(e.target.value)} placeholder="e.g. a YouTube thumbnail for a video about escaping the city to live off-grid" rows={2} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
            </Panel>

            <Panel>
              <Eyebrow>02 — Thumbnail Type</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>
                Picking a type auto-suggests matching color, text style and layout below — you can override any of them
              </div>
              <div className="flex flex-wrap">
                {THUMB_TYPES.map((t) => (<Chip key={t.id} active={t.id === thumbTypeId} onClick={() => pickThumbType(t)} title={t.desc}>{t.label}</Chip>))}
              </div>
              <p className="text-xs mt-1" style={{ fontFamily: fBody, color: COLORS.amber }}>{thumbType.desc}</p>
            </Panel>

            <Panel>
              <Eyebrow>03 — Reference Style</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Describe the look to match, or extract it from a reference image. (Brand-level style lives in the Brand Kit at the top.)</div>
              <textarea value={designRef} onChange={(e) => setDesignRef(e.target.value)} placeholder="e.g. bold creator-style, saturated, big shocked face, thick outlined text" rows={2} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              <ExamineHelper
                open={refExamineOpen} setOpen={setRefExamineOpen}
                copied={refExamineCopied} onCopy={mkCopy(REF_EXAMINE_PROMPT, setRefExamineCopied)}
                prompt={REF_EXAMINE_PROMPT}
                hint="Copy this, paste into an AI tool with your reference image, then paste the result above."
                linkLabel="Extract style from a reference image →"
              />
            </Panel>

            <Panel>
              <Eyebrow>04 — Format</Eyebrow>
              <div className="flex flex-wrap">
                {ASPECTS.map((a) => (<Chip key={a.id} active={a.id === aspectId} onClick={() => setAspectId(a.id)}>{a.label}</Chip>))}
              </div>
            </Panel>

            <Panel>
              <Eyebrow>05 — Layout</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>
                Thumbnail-native layouts with real composition built in (thirds, eye-lines, depth) — pick one or write your own
              </div>
              <ChipField options={THUMB_LAYOUTS} value={thumbLayout} onChange={setThumbLayout} placeholder="Or describe your own layout…" />
            </Panel>

            <Panel>
              <Eyebrow>06 — Text &amp; Typography</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Headline</div>
              <input value={textBlocks[0].text} onChange={(e) => updateBlock(0, { text: e.target.value })} placeholder="e.g. I QUIT MY 9–5" className="w-full rounded p-3 text-sm mb-2" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              <Toggle
                checked={textBlocks[1].enabled}
                onChange={(v) => { updateBlock(1, { enabled: v }); if (v) setActiveBlockIdx(1); else setActiveBlockIdx(0); }}
                label="Add a secondary sub-label"
                description="A smaller second text block (e.g. episode number, hook line)"
              />
              {textBlocks[1].enabled && (
                <input value={textBlocks[1].text} onChange={(e) => updateBlock(1, { text: e.target.value })} placeholder="e.g. EP. 12 — NO MONEY, NO PLAN" className="w-full rounded p-3 text-sm mb-2" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              )}
              <div className="text-xs mb-2 mt-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Text style — how the lettering behaves in the scene</div>
              <ChipField options={TEXT_STYLES} value={textStyle} onChange={setTextStyle} placeholder="Or describe your own text treatment…" />
              <div className="text-xs mb-2 mt-3" style={{ fontFamily: fBody, color: COLORS.steel }}>Lettering feel (typeface category or name — image models approximate, they don't render exact fonts)</div>
              <div className="flex flex-wrap">
                {FONT_STYLE_CHIPS.map((f) => (<Chip key={f} active={brandFontField === f} onClick={() => setBrandFontField(f)}>{f}</Chip>))}
              </div>
              <input value={brandFontField} onChange={(e) => setBrandFontField(e.target.value)} placeholder={applyBrand && brand.font.trim() ? `Using brand font: ${brand.font.trim()} (type here to override)` : "Or name a typeface, e.g. Montserrat ExtraBold"} className="w-full rounded p-3 text-sm mt-1" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
              <div className="text-xs mb-2 mt-4" style={{ fontFamily: fBody, color: COLORS.steel }}>
                Drag blocks to place them {textBlocks[1].enabled ? "— tap a block to select it, then drag" : ""}
              </div>
              <TextPlacement aspectId={aspectId} blocks={textBlocks} activeIdx={activeBlockIdx} setActiveIdx={setActiveBlockIdx} updateBlock={updateBlock} />
            </Panel>

            <Panel>
              <Eyebrow>07 — Color</Eyebrow>
              <ChipField options={COLOR_TREATMENTS} value={colorTreat} onChange={setColorTreat} placeholder="Or describe your own color treatment…" />
            </Panel>

            <Panel>
              <Eyebrow>08 — Render Style</Eyebrow>
              {Object.entries(groupedRender).map(([group, styles]) => (
                <div key={group} className="mb-2">
                  <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>{group}</div>
                  <div className="flex flex-wrap">
                    {styles.map((r) => (<Chip key={r.id} active={renderStyle === r.phrase} onClick={() => setRenderStyle(r.phrase)}>{r.label}</Chip>))}
                  </div>
                </div>
              ))}
              <textarea value={renderStyle} onChange={(e) => setRenderStyle(e.target.value)} placeholder="Or describe your own render style…" rows={2} className="w-full rounded p-3 text-sm resize-none mt-1" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
            </Panel>

            <Panel>
              <Eyebrow>09 — Composition Stack</Eyebrow>
              <Toggle checked={designLegibility} onChange={setDesignLegibility} label="Thumbnail legibility" description="One clear focal hierarchy, strong figure-to-ground, stays readable when scaled down" />
            </Panel>
            </>
            )}

            {/* ─── LOCATION MODE ─────────────────────────────────────────── */}
            {mode === "location" && (<>
            <Panel>
              <Eyebrow>01 — Output Type</Eyebrow>
              <div className="flex flex-wrap mb-2">
                {LOCATION_OUTPUTS.map((o) => <Chip key={o.id} active={locationOutput === o.id} onClick={() => setLocationOutput(o.id)} title={o.desc}>{o.label}</Chip>)}
              </div>
              <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>{LOCATION_OUTPUTS.find((o) => o.id === locationOutput).desc}</p>
              {locationOutput === "sheet" && <p className="text-xs mt-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Views: {LOCATION_SHEET_VIEWS.map((v, i) => `[${i+1}] ${v}`).join(" · ")}</p>}
            </Panel>
            <Panel>
              <div className="flex items-center gap-2 mb-1"><Eyebrow>02 — Location Identity</Eyebrow><span className="text-xs px-1.5 py-0.5 rounded mb-3" style={{ fontFamily: fMono, color: COLORS.console, backgroundColor: COLORS.amber, fontSize: 10, fontWeight: 700 }}>LOCKED</span></div>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Fixed environment — stays consistent regardless of time of day or weather</div>
              <textarea value={locationDesc} onChange={(e) => setLocationDesc(e.target.value)} placeholder="e.g. a mid-century brutalist coffee shop interior with exposed concrete walls, large factory windows, warm Edison bulb pendants, a long oak bar with vintage stools" rows={4} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.amberDim}` }}/>
              <ExamineHelper open={locExOpen} setOpen={setLocExOpen} copied={locExCopied} onCopy={mkCopy(LOCATION_EXAMINE_PROMPT, setLocExCopied)} prompt={LOCATION_EXAMINE_PROMPT} hint="Copy this, paste into an AI tool with a reference photo of the location, then paste the identity paragraph back above." linkLabel="Extract identity from a location photo →"/>
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.panelBorder}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.1em" }}>Location library</span>
                  {locSavingOpen ? (
                    <div className="flex items-center gap-2">
                      <input value={locName} onChange={(e) => setLocName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveLocation(); }} placeholder="Name" autoFocus className="rounded px-2 py-1 text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}`, width: 110 }}/>
                      <button onClick={saveLocation} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.amber, color: COLORS.console, fontWeight: 600 }}>Save</button>
                      <button onClick={() => { setLocSavingOpen(false); setLocName(""); }} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setLocSavingOpen(true)} disabled={!locationDesc.trim()} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: locationDesc.trim() ? COLORS.amber : COLORS.steel, opacity: locationDesc.trim() ? 1 : 0.4, border: `1px solid ${COLORS.amberDim}` }}>
                      <Save size={11}/> Save this location
                    </button>
                  )}
                </div>
                {locations.length === 0 ? <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>No saved locations yet — saved locations appear in Cinema mode and Storyboard.</p> : (
                  <div className="flex flex-wrap gap-2">
                    {locations.map((l) => (
                      <div key={l.id} className="flex items-center rounded" style={{ border: `1px solid ${COLORS.panelBorder}` }}>
                        <button onClick={() => setLocationDesc(l.text)} className="px-3 py-1.5 text-sm" style={{ fontFamily: fBody, color: COLORS.paper }} title={l.text}>📍 {l.name}</button>
                        <button onClick={() => deleteLocation(l.id)} className="px-2 py-1.5" style={{ color: COLORS.steel }}><X size={12}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>
            <Panel>
              <Eyebrow>03 — Time &amp; Atmosphere</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Applied to this shot only — does not change the location identity</div>
              <div className="mb-3">
                <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Time of day</div>
                <div className="flex flex-wrap">{TIME_OF_DAY.map((t) => <Chip key={t.id} active={timeOfDay === t.id} onClick={() => setTimeOfDay(t.id)}>{t.label}</Chip>)}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Weather</div>
                <div className="flex flex-wrap">{WEATHER_CONDITIONS.map((w) => <Chip key={w.id} active={weatherId === w.id} onClick={() => setWeatherId(w.id)}>{w.label}</Chip>)}</div>
              </div>
            </Panel>
            <Panel>
              <Eyebrow>04 — Aspect Ratio</Eyebrow>
              <div className="flex flex-wrap">{PHOTO_ASPECTS.map((a) => <Chip key={a.id} active={a.id === photoAspectId} onClick={() => setPhotoAspectId(a.id)}>{a.label}</Chip>)}</div>
            </Panel>
            </>)}

            {/* ─── STORYBOARD ─────────────────────────────────────────────── */}
            {mode === "assemble" && (<>
            <Panel>
              <Eyebrow>01 — Scene Locks</Eyebrow>
              <p className="text-xs mb-4" style={{ fontFamily: fBody, color: COLORS.steel }}>One scene = locked assets + N frames. Every frame compiles to a full standalone prompt with identical lock sentences, so external tools keep continuity between generations.</p>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Character (from library) <span style={{ color: COLORS.amber }}>— required</span></div>
                {characters.length === 0 ? <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>No saved characters — save one in Character Maker or Cinema mode.</p> : (
                  <div className="flex flex-wrap">{characters.map((c) => <Chip key={c.id} active={sbCharacterId === c.id} onClick={() => setSbCharacterId(sbCharacterId === c.id ? "" : c.id)} title={c.text}>{c.name}</Chip>)}</div>
                )}
              </div>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Product (from library) — optional</div>
                {products.length === 0 ? <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>No saved products — save one in Product Photo mode.</p> : (
                  <div className="flex flex-wrap"><Chip active={!sbProductId} onClick={() => setSbProductId("")}>None</Chip>{products.map((p) => <Chip key={p.id} active={sbProductId === p.id} onClick={() => setSbProductId(p.id)} title={p.text}>{p.name}</Chip>)}</div>
                )}
              </div>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Location (from library) <span style={{ color: COLORS.amber }}>— required</span></div>
                {locations.length === 0 ? <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>No saved locations — save one in Location / Set mode.</p> : (
                  <div className="flex flex-wrap">{locations.map((l) => <Chip key={l.id} active={sbLocationId === l.id} onClick={() => setSbLocationId(sbLocationId === l.id ? "" : l.id)} title={l.text}>📍 {l.name}</Chip>)}</div>
                )}
              </div>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Time of day</div>
                <div className="flex flex-wrap">{TIME_OF_DAY.map((t) => <Chip key={t.id} active={sbTimeOfDay === t.id} onClick={() => setSbTimeOfDay(t.id)}>{t.label}</Chip>)}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Weather</div>
                <div className="flex flex-wrap">{WEATHER_CONDITIONS.map((w) => <Chip key={w.id} active={sbWeather === w.id} onClick={() => setSbWeather(w.id)}>{w.label}</Chip>)}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Scene lighting / mood</div>
                <div className="flex flex-wrap">{SB_LIGHTING.map((l) => <Chip key={l.id} active={sbLighting === l.id} onClick={() => setSbLighting(l.id)}>{l.label}</Chip>)}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Scene direction — what is happening across the scene</div>
                <textarea value={sbDirection} onChange={(e) => setSbDirection(e.target.value)} placeholder="e.g. the character walks through the cafe carrying the product, increasingly hurried" rows={3} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }}/>
              </div>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Aspect ratio (written into every frame prompt)</div>
                <div className="flex flex-wrap">{["169", "916", "11", "45"].map((id) => { const a = PHOTO_ASPECTS.find((x) => x.id === id); return <Chip key={id} active={sbAspect === id} onClick={() => setSbAspect(id)}>{a.label}</Chip>; })}</div>
              </div>
              <Toggle
                checked={sbRefLocked}
                onChange={setSbRefLocked}
                label="Reference images locked"
                description="On: the character lock sentence anchors to the attached reference image instead of re-describing the identity."
              />
              {sbSheetPrompt && (
                <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.panelBorder}` }}>
                  <button onClick={() => copyText(sbSheetPrompt, () => { setSbSheetCopied(true); setTimeout(() => setSbSheetCopied(false), 1500); })} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: sbSheetCopied ? COLORS.amber : "transparent", color: sbSheetCopied ? COLORS.console : COLORS.amber, border: `1px solid ${COLORS.amber}`, fontWeight: 600 }}>
                    {sbSheetCopied ? <Check size={12}/> : <Copy size={12}/>} Copy storyboard sheet
                  </button>
                  <p className="text-xs mt-2" style={{ fontFamily: fBody, color: COLORS.steel }}>One prompt → one grid image previewing all {sbFrames.length} frames.</p>
                </div>
              )}
            </Panel>

            {sbFrames.map((f, i) => (
              <Panel key={f.id}>
                <div className="flex items-center justify-between mb-3">
                  <Eyebrow>Frame {i + 1}</Eyebrow>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => sbMoveFrame(i, -1)} disabled={i === 0} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}`, opacity: i === 0 ? 0.35 : 1 }}><ChevronUp size={12}/></button>
                    <button onClick={() => sbMoveFrame(i, 1)} disabled={i === sbFrames.length - 1} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}`, opacity: i === sbFrames.length - 1 ? 0.35 : 1 }}><ChevronDown size={12}/></button>
                    <button onClick={() => sbDuplicateFrame(i)} disabled={sbFrames.length >= 8} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}`, opacity: sbFrames.length >= 8 ? 0.35 : 1 }}>Duplicate</button>
                    <button onClick={() => sbDeleteFrame(i)} disabled={sbFrames.length <= 1} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}`, opacity: sbFrames.length <= 1 ? 0.35 : 1 }}><X size={12}/></button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Shot type</div>
                  <div className="flex flex-wrap">{SHOT_TYPES.map((s) => <Chip key={s.id} active={f.shotType === s.id} onClick={() => sbPatchFrame(i, { shotType: s.id })}>{s.label}</Chip>)}</div>
                </div>
                <div className="mb-3">
                  <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Camera angle</div>
                  <div className="flex flex-wrap">{ANGLE_DIRECTIONS.map((a) => <Chip key={a.label} active={f.angleRot === a.rot} onClick={() => sbPatchFrame(i, { angleRot: a.rot })}>{a.label}</Chip>)}</div>
                </div>
                <div className="mb-3">
                  <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Action — what the character does in this frame</div>
                  <textarea value={f.action} onChange={(e) => sbPatchFrame(i, { action: e.target.value })} placeholder="e.g. pushing the door open, glancing back over one shoulder" rows={2} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }}/>
                </div>
                <div className="mb-3">
                  <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Expression</div>
                  <ChipField grouped options={EXPRESSION_GROUPS} value={f.expressionPhrase} onChange={(v) => sbPatchFrame(i, { expressionPhrase: v })} placeholder="Or describe the expression…" rows={2}/>
                </div>
                <div className="mb-3">
                  <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Character placement</div>
                  <PlacementCanvas px={f.px} py={f.py} dist={f.dist} setPx={(v) => sbPatchFrame(i, { px: v })} setPy={(v) => sbPatchFrame(i, { py: v })} setDist={(v) => sbPatchFrame(i, { dist: v })} ratio={{ "169": 16 / 9, "916": 9 / 16, "11": 1, "45": 4 / 5 }[sbAspect] || 16 / 9}/>
                </div>
                {sbFramePrompts[i] ? (
                  <div className="rounded p-3" style={{ backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.1em" }}>Frame {i + 1} prompt</span>
                      <button onClick={() => copyText(sbFramePrompts[i], () => { setSbCopiedId(f.id); setTimeout(() => setSbCopiedId(""), 1500); })} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: sbCopiedId === f.id ? COLORS.amber : "transparent", color: sbCopiedId === f.id ? COLORS.console : COLORS.amber, border: `1px solid ${COLORS.amber}` }}>
                        {sbCopiedId === f.id ? <Check size={11}/> : <Copy size={11}/>} Copy
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: fBody, color: COLORS.paper, opacity: 0.8 }}>{sbFramePrompts[i]}</p>
                  </div>
                ) : (
                  <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>Pick a character and a location above to compile this frame.</p>
                )}
              </Panel>
            ))}

            <button onClick={sbAddFrame} disabled={sbFrames.length >= 8} className="w-full rounded py-2.5 mb-4 text-sm" style={{ fontFamily: fBody, color: sbFrames.length >= 8 ? COLORS.steel : COLORS.amber, border: `1px dashed ${sbFrames.length >= 8 ? COLORS.panelBorder : COLORS.amberDim}`, opacity: sbFrames.length >= 8 ? 0.5 : 1 }}>
              + Add frame {sbFrames.length >= 8 ? "(max 8)" : `(${sbFrames.length}/8)`}
            </button>
            </>)}

            {/* ─── BLOCKING ────────────────────────────────────────────── */}
            {mode === "blocking" && (<>
            <Panel>
              <Eyebrow>01 — Location</Eyebrow>
              {locations.length === 0 ? (
                <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>No saved locations yet — create one in Location / Set mode first, then come back here to block the scene.</p>
              ) : (
                <>
                  <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Pick a location from the library to block</div>
                  <div className="flex flex-wrap">
                    {locations.map((l) => (
                      <Chip key={l.id} active={blLocationId === l.id} onClick={() => { setBlLocationId(blLocationId === l.id ? "" : l.id); setBlParseErrors([]); setBlReextract(false); setBlLoadedId(""); }} title={l.text}>
                        📍 {l.name}{(l.blockings || []).length ? ` (${l.blockings.length})` : ""}
                      </Chip>
                    ))}
                  </div>
                </>
              )}
            </Panel>

            {blLocation && (blSubAreas.length < 2 || blReextract) && (
            <Panel>
              <Eyebrow>02 — Extract Sub-Areas</Eyebrow>
              <div className="rounded p-3 mb-3" style={{ backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}` }}>
                <p className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Copy this prompt, paste it into your AI tool together with the location photo, then paste the reply below.</p>
                <p className="text-xs mb-2 p-2 rounded" style={{ fontFamily: fMono, color: COLORS.paper, backgroundColor: COLORS.panel, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{LOCATION_BLOCKING_PROMPT}</p>
                <button onClick={mkCopy(LOCATION_BLOCKING_PROMPT, setBlPromptCopied)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.amber, color: COLORS.console, fontWeight: 600 }}>
                  {blPromptCopied ? <Check size={12} /> : <Copy size={12} />}{blPromptCopied ? "Copied" : "Copy extract prompt"}
                </button>
              </div>
              <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel }}>Paste the AI's reply here</div>
              <textarea value={blPasteText} onChange={(e) => setBlPasteText(e.target.value)} placeholder={"1 | doorway | 10,80 | a wooden door with a brass handle\n2 | counter | 50,40 | a marble kitchen counter\n…"} rows={6} className="w-full rounded p-3 text-sm resize-none mb-2" style={{ fontFamily: fMono, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}`, fontSize: 12 }} />
              {blParseErrors.length > 0 && (
                <div className="rounded p-2 mb-2" style={{ backgroundColor: COLORS.console, border: `1px solid ${COLORS.amberDim}` }}>
                  {blParseErrors.map((e, i) => (<p key={i} className="text-xs" style={{ fontFamily: fMono, color: COLORS.amber, fontSize: 11 }}>{e}</p>))}
                </div>
              )}
              <button onClick={blParse} disabled={!blPasteText.trim()} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: blPasteText.trim() ? COLORS.amber : "transparent", color: blPasteText.trim() ? COLORS.console : COLORS.steel, border: `1px solid ${blPasteText.trim() ? COLORS.amber : COLORS.panelBorder}`, fontWeight: 600, opacity: blPasteText.trim() ? 1 : 0.5 }}>Parse</button>
            </Panel>
            )}

            {blLocation && blSubAreas.length >= 2 && !blReextract && (<>
            <Panel>
              <div className="flex items-center justify-between mb-3">
                <Eyebrow>03 — Blocking Canvas</Eyebrow>
                <button onClick={() => setBlReextract(true)} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>Re-extract</button>
              </div>
              <p className="text-xs mb-3" style={{ fontFamily: fBody, color: COLORS.steel }}>Top-down map of {blLocation.name}. Drag sub-area dots to correct their positions, drag the amber character points and the camera. The camera always faces the selected subject.</p>
              <BlockingCanvas subAreas={blSubAreas} characters={blCharacters} camera={blCamera} subjectIdx={blSubjectIdx} onMoveSubArea={blMoveSubArea} onMoveCharacter={blMoveCharacter} onMoveCamera={setBlCamera} />
              <div className="mt-3">
                {blCharacters.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input value={c.label} onChange={(e) => blPatchCharacter(i, { label: e.target.value })} className="rounded px-2 py-1 text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}`, width: 140 }} />
                    <button onClick={() => blRemoveCharacter(i)} disabled={blCharacters.length <= 1} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}`, opacity: blCharacters.length <= 1 ? 0.35 : 1 }}>Remove</button>
                  </div>
                ))}
                <button onClick={blAddCharacter} disabled={blCharacters.length >= 2} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: fBody, color: blCharacters.length >= 2 ? COLORS.steel : COLORS.amber, border: `1px dashed ${blCharacters.length >= 2 ? COLORS.panelBorder : COLORS.amberDim}`, opacity: blCharacters.length >= 2 ? 0.5 : 1 }}>+ Add character</button>
              </div>
              <div className="mt-3">
                <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel }}>Camera subject — who the camera faces</div>
                <div className="flex flex-wrap">
                  {blCharacters.map((c, i) => (<Chip key={i} active={blSubjectIdx === i} onClick={() => setBlSubjectIdx(i)}>{c.label}</Chip>))}
                </div>
              </div>
            </Panel>

            <Panel>
              <Eyebrow>04 — Save & Output</Eyebrow>
              <div className="flex items-center gap-2 mb-3">
                <input value={blName} onChange={(e) => setBlName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") blSaveBlocking(); }} placeholder="Blocking name, e.g. Opening scene" className="rounded px-2 py-1.5 text-sm flex-1" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
                <button onClick={blSaveBlocking} disabled={!blName.trim()} className="px-3 py-1.5 rounded text-xs flex-shrink-0" style={{ fontFamily: fBody, backgroundColor: blName.trim() ? COLORS.amber : "transparent", color: blName.trim() ? COLORS.console : COLORS.steel, border: `1px solid ${blName.trim() ? COLORS.amber : COLORS.panelBorder}`, fontWeight: 600, opacity: blName.trim() ? 1 : 0.5 }}>
                  {blLoadedId && blBlockings.some((b) => b.id === blLoadedId) ? "Update blocking" : "Save blocking"}
                </button>
              </div>
              {blBlockings.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {blBlockings.map((b) => (
                    <div key={b.id} className="flex items-center rounded" style={{ border: `1px solid ${blLoadedId === b.id ? COLORS.amberDim : COLORS.panelBorder}` }}>
                      <button onClick={() => blLoadBlocking(b)} className="px-3 py-1.5 text-sm" style={{ fontFamily: fBody, color: blLoadedId === b.id ? COLORS.amber : COLORS.paper }}>{b.name}</button>
                      <button onClick={() => blDeleteBlocking(b.id)} className="px-2 py-1.5" title="Delete" style={{ color: COLORS.steel }}><X size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel }}>Load a blocking to rename it — edit the name and hit Update. Saved blockings appear as chips in Cinema and Storyboard.</p>
              <div className="rounded p-3 mt-2" style={{ backgroundColor: COLORS.console, border: `1px solid ${COLORS.panelBorder}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.1em" }}>Blocking clause</span>
                  <button onClick={mkCopy(blClause, setBlClauseCopied)} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: blClauseCopied ? COLORS.amber : "transparent", color: blClauseCopied ? COLORS.console : COLORS.amber, border: `1px solid ${COLORS.amber}` }}>
                    {blClauseCopied ? <Check size={11} /> : <Copy size={11} />} Copy
                  </button>
                </div>
                <p className="text-xs leading-relaxed" style={{ fontFamily: fBody, color: COLORS.paper, opacity: 0.85 }}>{blClause}</p>
              </div>
            </Panel>
            </>)}
            </>)}

            {/* ─── CHARACTER MAKER ─────────────────────────────────────── */}
            {mode === "charmaker" && (<>
            <Panel>
              <Eyebrow>01 — Output Type</Eyebrow>
              <div className="relative mb-2">
                <select
                  value={cmOutput}
                  onChange={(e) => setCmOutput(e.target.value)}
                  className="w-full rounded p-2.5 text-sm pr-8"
                  style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }}
                >
                  {CHARMAKER_OUTPUTS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: COLORS.steel, pointerEvents: "none" }} />
              </div>
              <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>{CHARMAKER_OUTPUTS.find((o) => o.id === cmOutput).desc}</p>
            </Panel>

            <Panel>
              <Eyebrow>02 — Identity</Eyebrow>

              {/* Baseline wardrobe gender fork */}
              <div className="mb-3">
                <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Baseline wardrobe</div>
                <div className="flex gap-2">
                  {[
                    { id: "female", label: "Female" },
                    { id: "male", label: "Male" },
                  ].map((g) => (
                    <Chip key={g.id} active={cmBaseGender === g.id} onClick={() => setCmBaseGender(g.id)}>{g.label}</Chip>
                  ))}
                </div>
              </div>

              <Toggle
                checked={cmRefLocked}
                onChange={setCmRefLocked}
                label="Reference image locked"
                description="On: prompt assumes you attach the saved character reference image in your AI tool. Identity is anchored to the reference, not re-described."
              />

              {cmRefLocked ? (
                <p className="text-xs mt-1 mb-3" style={{ fontFamily: fBody, color: COLORS.steel }}>
                  Identity is anchored to the attached reference image — the builder below is ignored while this is on.
                </p>
              ) : (
              <>
              {/* Source toggle */}
              <div className="flex gap-2 mb-4 mt-2">
                {[
                  { id: "scratch", label: "Build from scratch" },
                  { id: "extract", label: "Extract from photo" },
                ].map((s) => (
                  <Chip key={s.id} active={cmSource === s.id} onClick={() => setCmSource(s.id)}>{s.label}</Chip>
                ))}
              </div>

              {cmSource === "scratch" ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    {cmIdentityDirty && <span className="text-xs px-1.5 py-0.5 rounded" style={{ fontFamily: fMono, color: COLORS.console, backgroundColor: COLORS.amberDim, fontSize: 9, fontWeight: 700 }}>MANUAL</span>}
                  </div>
                  <div className="text-xs mb-3" style={{ fontFamily: fBody, color: COLORS.steel }}>Pick traits — identity paragraph auto-compiles below. Edit the text directly to lock it in manual mode.</div>

                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Gender</div>
                    <div className="flex flex-wrap">
                      {ID_GENDER.map((g) => <Chip key={g.id} active={cmGender === g.id} onClick={() => setCmGender(cmGender === g.id ? "" : g.id)}>{g.label}</Chip>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Age</div>
                    <div className="flex flex-wrap">
                      {ID_AGE.map((a) => <Chip key={a.id} active={cmAge === a.id} onClick={() => setCmAge(cmAge === a.id ? "" : a.id)}>{a.label}</Chip>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Skin tone</div>
                    <div className="flex flex-wrap">
                      {ID_SKIN.map((s) => <Chip key={s.id} active={cmSkin === s.id} onClick={() => setCmSkin(cmSkin === s.id ? "" : s.id)}>{s.label}</Chip>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Face shape</div>
                    <div className="flex flex-wrap">
                      {ID_FACE.map((f) => <Chip key={f.id} active={cmFace === f.id} onClick={() => setCmFace(cmFace === f.id ? "" : f.id)}>{f.label}</Chip>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Eye shape</div>
                    <div className="flex flex-wrap">
                      {ID_EYES.map((e) => <Chip key={e.id} active={cmEyes === e.id} onClick={() => setCmEyes(cmEyes === e.id ? "" : e.id)}>{e.label}</Chip>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Hair color</div>
                    <div className="flex flex-wrap">
                      {ID_HAIR_COLOR.map((h) => <Chip key={h.id} active={cmHairColor === h.id} onClick={() => setCmHairColor(cmHairColor === h.id ? "" : h.id)}>{h.label}</Chip>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Hair length</div>
                    <div className="flex flex-wrap">
                      {ID_HAIR_LENGTH.map((h) => <Chip key={h.id} active={cmHairLength === h.id} onClick={() => setCmHairLength(cmHairLength === h.id ? "" : h.id)}>{h.label}</Chip>)}
                    </div>
                  </div>
                  {cmHairLength && cmHairLength !== "bald" && cmHairLength !== "buzzcut" && (
                    <div className="mb-3">
                      <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Hair texture</div>
                      <div className="flex flex-wrap">
                        {ID_HAIR_TEXTURE.map((h) => <Chip key={h.id} active={cmHairTexture === h.id} onClick={() => setCmHairTexture(cmHairTexture === h.id ? "" : h.id)}>{h.label}</Chip>)}
                      </div>
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Build</div>
                    <div className="flex flex-wrap">
                      {ID_BUILD.map((b) => <Chip key={b.id} active={cmBuild === b.id} onClick={() => setCmBuild(cmBuild === b.id ? "" : b.id)}>{b.label}</Chip>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Distinguishing marks (optional)</div>
                    <input value={cmMarks} onChange={(e) => setCmMarks(e.target.value)} placeholder="e.g. a small scar above the left eyebrow, freckles across the nose" className="w-full rounded p-2.5 text-sm" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }}/>
                  </div>

                  <div className="mt-2 mb-1 flex items-center justify-between">
                    <div className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Compiled identity paragraph</div>
                    {cmIdentityDirty && (
                      <button onClick={() => setCmIdentityDirty(false)} className="text-xs px-2 py-0.5 rounded" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>Reset to chips</button>
                    )}
                  </div>
                  <textarea
                    value={cmIdentityText}
                    onChange={(e) => { setCmIdentityText(e.target.value); setCmIdentityDirty(true); }}
                    placeholder="Pick traits above to auto-build, or type your character description directly"
                    rows={4}
                    className="w-full rounded p-3 text-sm resize-none"
                    style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${cmIdentityDirty ? COLORS.amberDim : COLORS.panelBorder}` }}
                  />
                </>
              ) : (
                <>
                  <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Copy the extract prompt, paste into an AI tool with a portrait photo of your character, then paste the result below.</div>
                  <ExamineHelper
                    open={cmExOpen} setOpen={setCmExOpen}
                    copied={cmExCopied} onCopy={mkCopy(EXAMINE_PROMPT, setCmExCopied)}
                    prompt={EXAMINE_PROMPT}
                    hint="Attach a portrait photo and send this to an AI — it returns a single identity paragraph you can paste below."
                    linkLabel="Copy extract prompt →"
                  />
                  <div className="text-xs mb-1 mt-3" style={{ fontFamily: fBody, color: COLORS.steel }}>Paste extracted identity</div>
                  <textarea
                    value={cmIdentityText}
                    onChange={(e) => setCmIdentityText(e.target.value)}
                    placeholder="Paste the extracted identity paragraph here"
                    rows={4}
                    className="w-full rounded p-3 text-sm resize-none"
                    style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }}
                  />
                </>
              )}
              </>
              )}

              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.panelBorder}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.steel, letterSpacing: "0.1em" }}>Character library</span>
                  {cmSavingOpen ? (
                    <div className="flex items-center gap-2">
                      <input value={cmName} onChange={(e) => setCmName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveCharacterFromCM(); }} placeholder="Name" autoFocus className="rounded px-2 py-1 text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}`, width: 110 }}/>
                      <button onClick={saveCharacterFromCM} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, backgroundColor: COLORS.amber, color: COLORS.console, fontWeight: 600 }}>Save</button>
                      <button onClick={() => { setCmSavingOpen(false); setCmName(""); }} className="px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: COLORS.steel, border: `1px solid ${COLORS.panelBorder}` }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setCmSavingOpen(true)} disabled={!cmIdentityText.trim()} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ fontFamily: fBody, color: cmIdentityText.trim() ? COLORS.amber : COLORS.steel, opacity: cmIdentityText.trim() ? 1 : 0.4, border: `1px solid ${COLORS.amberDim}` }}>
                      <Save size={11}/> Save to library
                    </button>
                  )}
                </div>
                {characters.length === 0 ? (
                  <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.6 }}>Saved characters appear here and in Cinema mode and Storyboard.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {characters.map((c) => (
                      <div key={c.id} className="flex items-center rounded" style={{ border: `1px solid ${COLORS.panelBorder}` }}>
                        <button onClick={() => { setCmIdentityText(c.text); setCmIdentityDirty(cmSource === "scratch"); }} className="px-3 py-1.5 text-sm" style={{ fontFamily: fBody, color: COLORS.paper }} title={c.text}>{c.name}</button>
                        <button onClick={() => deleteCharacter(c.id)} className="px-2 py-1.5" style={{ color: COLORS.steel }}><X size={12}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>

            {cmOutput === "hero" || cmOutput === "expressions" ? (
              <Panel>
                <Eyebrow>03 — Outfit &amp; Style</Eyebrow>
                <p className="text-xs" style={{ fontFamily: fBody, color: COLORS.steel }}>Identity plate &amp; expression sheet are always neutral — baseline wardrobe, locked studio backdrop and lighting. Styling is locked off for consistency.</p>
              </Panel>
            ) : (
              <Panel>
                <Eyebrow>03 — Outfit &amp; Style</Eyebrow>
                {(cmOutput === "fullbody" || cmOutput === "outfitsheet") && !cmOutfit.trim() && (
                  <p className="text-xs mb-3" style={{ fontFamily: fBody, color: COLORS.amber }}>This output needs an outfit — describe it below.</p>
                )}
                <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Style vibe</div>
                <div className="flex flex-wrap mb-3">
                  {STYLE_VIBES.map((v) => <Chip key={v.id} active={cmVibe === v.id} onClick={() => setCmVibe(cmVibe === v.id ? "" : v.id)}>{v.label}</Chip>)}
                </div>
                <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel }}>
                  Outfit detail {(cmOutput === "fullbody" || cmOutput === "outfitsheet") ? <span style={{ color: COLORS.amber }}>— required for this output</span> : "(optional — baseline wardrobe if empty)"}
                </div>
                <textarea value={cmOutfit} onChange={(e) => setCmOutfit(e.target.value)} placeholder="e.g. oversized cream linen shirt, dark jeans, white leather sneakers" rows={2} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${(cmOutput === "fullbody" || cmOutput === "outfitsheet") ? COLORS.amberDim : COLORS.panelBorder}` }}/>
                {cmOutput === "sheet" && (
                  <div className="mt-3">
                    <div className="text-xs mb-1" style={{ fontFamily: fBody, color: COLORS.steel, opacity: 0.7 }}>Panel 6 — detail shot</div>
                    <div className="flex flex-wrap">
                      {CM_DETAIL_OPTIONS.map((d) => <Chip key={d.id} active={cmDetail === d.id} onClick={() => setCmDetail(d.id)}>{d.label}</Chip>)}
                    </div>
                  </div>
                )}
              </Panel>
            )}
            </>)}

            {/* Creative Context — global */}
            <Panel>
              <Eyebrow>+ Creative Context</Eyebrow>
              <Toggle
                checked={creativeContext}
                onChange={setCreativeContext}
                label="Add fiction / medium framing"
                description="For benign creative scenes (action, kaiju, cartoon) that get falsely flagged — states the medium and non-graphic intent so they read as fiction. Off by default."
              />
              {creativeContext && (
                <div className="mt-2">
                  <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>Pick the medium that actually matches your scene</div>
                  <div className="flex flex-wrap">
                    {CONTEXT_TYPES.map((c) => (<Chip key={c.id} active={c.id === contextTypeId} onClick={() => setContextTypeId(c.id)}>{c.label}</Chip>))}
                  </div>
                  <p className="text-xs mt-2" style={{ fontFamily: fBody, color: COLORS.steel }}>
                    Masih ke-flag? Biasanya pemicunya kata di Action/Location — deskripsikan hasil visualnya, bukan kekerasannya.
                  </p>
                </div>
              )}
            </Panel>

            {/* Manual instruction — global */}
            <Panel>
              <Eyebrow>+ Manual Instruction</Eyebrow>
              <div className="text-xs mb-2" style={{ fontFamily: fBody, color: COLORS.steel }}>
                Anything custom appended verbatim to the end of the prompt (added in every mode)
              </div>
              <textarea value={manualInstruction} onChange={(e) => setManualInstruction(e.target.value)} placeholder="e.g. shot on Kodak Portra 400, subtle film halation, --no text watermark" rows={2} className="w-full rounded p-3 text-sm resize-none" style={{ fontFamily: fBody, backgroundColor: COLORS.console, color: COLORS.paper, border: `1px solid ${COLORS.panelBorder}` }} />
            </Panel>
          </div>

          {/* RIGHT: output */}
          <div className="w-full lg:w-96 flex-shrink-0" style={{ maxWidth: "100%" }}>
            <div className="lg:sticky lg:top-6" style={{ width: "100%", minWidth: 0 }}>
              <div>
                <div className="rounded-lg p-5" style={{ backgroundColor: COLORS.paper, minHeight: 260 }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-widest uppercase" style={{ fontFamily: fDisplay, color: COLORS.ink, letterSpacing: "0.15em" }}>
                      {isMultiPrompt ? "Compiled Prompts (6)" : "Compiled Prompt"}
                    </span>
                    <button
                      onClick={handleCopy}
                      disabled={!promptText}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs"
                      style={{ fontFamily: fBody, backgroundColor: promptText ? COLORS.ink : "transparent", color: promptText ? COLORS.paper : COLORS.ink, opacity: promptText ? 1 : 0.4, border: `1px solid ${COLORS.ink}`, cursor: promptText ? "pointer" : "default" }}
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied" : isMultiPrompt ? "Copy all" : "Copy"}
                    </button>
                  </div>

                  {promptText ? (
                    <p className="text-sm leading-relaxed" style={{ fontFamily: fBody, color: COLORS.ink, whiteSpace: "pre-wrap" }}>
                      {promptText}
                    </p>
                  ) : (
                    <p className="text-sm italic leading-relaxed" style={{ fontFamily: fBody, color: COLORS.ink, opacity: 0.55 }}>
                      {mode === "cinema" ? "Describe your character above (or switch to Reference photo) to compile your prompt." : mode === "product" ? "Describe your product above to compile your prompt." : mode === "charmaker" ? ((cmOutput === "fullbody" || cmOutput === "outfitsheet") && cmIdentityText.trim() && !characterPrompt ? "Describe the outfit to compile this output." : "Build your character identity above to compile your prompt.") : mode === "assemble" ? "Pick a character and a location from the libraries above to compile your frames." : mode === "blocking" ? "Pick a location and parse its sub-areas to compile a blocking clause." : "Describe your design brief above to compile your prompt."}
                    </p>
                  )}

                  <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${COLORS.ink}22` }}>
                    <p className="text-xs" style={{ fontFamily: fMono, color: COLORS.ink, opacity: 0.6 }}>
                      {mode === "cinema"
                        ? `${lens.name} · ${focalLength}mm · f/${aperture} · ${sensor}${photoAspect.phrase ? " · " + photoAspect.label : ""}${applyBrand && brandHasContent ? " · BRAND" : ""}`
                        : mode === "product"
                        ? `${PRODUCT_OUTPUTS.find((o) => o.id === productOutput).label} · ${material.label} · ${prodLight.label}${applyBrand && brandHasContent ? " · BRAND" : ""}`
                        : mode === "location" ? `${LOCATION_OUTPUTS.find((o) => o.id === locationOutput).label} · ${tod ? tod.label : ""} · ${weather ? weather.label : ""}${applyBrand && brandHasContent ? " · BRAND" : ""}`
                        : mode === "assemble" ? `Storyboard · ${sbFrames.length} frame${sbFrames.length > 1 ? "s" : ""} · ${PHOTO_ASPECTS.find((a) => a.id === sbAspect)?.label ?? ""}`
                        : mode === "blocking" ? `Blocking · ${blLocation ? blLocation.name : "no location"} · ${blCharacters.length} character${blCharacters.length > 1 ? "s" : ""}`
                        : mode === "charmaker" ? `${CHARMAKER_OUTPUTS.find((o) => o.id === cmOutput)?.label ?? "Character Maker"} · ${cmSource}`
                        : `${aspect.label} · ${thumbType.label}${applyBrand && brandHasContent ? " · BRAND" : ""}`}
                    </p>
                  </div>
                </div>
                <p className="text-xs mt-3 px-1" style={{ fontFamily: fBody, color: COLORS.steel }}>
                  Paste this into your image tool of choice — no generation happens here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
