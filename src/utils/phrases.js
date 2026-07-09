// Translate orbit values (rotation/tilt/zoom) into a natural camera-angle phrase.
export function anglePhrase(rotation, tilt, zoom) {
  const r = ((rotation % 360) + 360) % 360;
  const c = Math.cos((r * Math.PI) / 180);
  const s = Math.sin((r * Math.PI) / 180);
  const frontish = c > 0.38;
  const behindish = c < -0.38;
  const side = s > 0 ? "right" : "left";

  let horiz;
  if (frontish && Math.abs(s) < 0.38) horiz = "directly in front of the subject, facing them head-on";
  else if (behindish && Math.abs(s) < 0.38) horiz = "from directly behind the subject";
  else if (Math.abs(c) <= 0.38) horiz = `from the subject's ${side} side in profile`;
  else if (frontish) horiz = `from the front-${side}, a three-quarter view`;
  else horiz = `from behind and to the ${side}`;

  const at = Math.round(Math.abs(tilt));
  let vert;
  if (tilt >= 60) vert = `looking steeply down from a high overhead angle (about ${at}° above eye level)`;
  else if (tilt >= 25) vert = `from a high angle looking down (about ${at}° above eye level)`;
  else if (tilt > -25) vert = "at eye level";
  else if (tilt > -60) vert = `from a low angle looking up (about ${at}° below eye level)`;
  else vert = `looking steeply up from a low angle (about ${at}° below eye level)`;

  let z = "";
  if (zoom >= 30) z = ", the camera pushed in tight for an intimate framing";
  else if (zoom <= -30) z = ", the camera pulled back for a wider view";

  return `photographed ${horiz}, ${vert}${z}`;
}

// Translate placement canvas (px, py) to spatial prose
export function placementPhrase(px, py, dist) {
  const h = px < 0.37 ? "the left third" : px > 0.63 ? "the right third" : "center frame";
  const depth = py < 0.37 ? "deep in the background" : py > 0.63 ? "in the foreground close to camera" : "in the mid-ground";
  return `The character is placed on ${h} of the frame, ${depth}.`;
}

// Describe a text block's position in words from normalized coordinates.
export function textPositionPhrase(b, name) {
  const h = b.tx < 0.37 ? "left" : b.tx > 0.63 ? "right" : "center";
  const v = b.ty < 0.37 ? "upper" : b.ty > 0.63 ? "lower" : "middle";
  const zone = v === "middle" && h === "center" ? "the center" : `the ${v}-${h}`;
  const width = b.tw > 0.7 ? "a wide" : b.tw < 0.4 ? "a compact" : "a medium";
  const tiltP = Math.abs(b.rot) >= 5 ? `, tilted about ${Math.abs(b.rot)}° ${b.rot > 0 ? "clockwise" : "counter-clockwise"} for energy` : "";
  return `Place the ${name} in ${zone} of the frame as ${width} block${tiltP}, keeping that area visually clean behind it so the text stays legible.`;
}

export function polar(r, angle) {
  return [r * Math.cos(angle), r * Math.sin(angle)];
}

export function bladePoints(index, total, closure, rimR, innerMin) {
  const twoPi = Math.PI * 2;
  const theta0 = (twoPi / total) * index;
  const bladeWidth = (twoPi / total) * 1.55;
  const theta1 = theta0 + bladeWidth;
  const tipAngle = theta0 + bladeWidth / 2 + closure * 0.35;
  const tipRadius = rimR - closure * (rimR - innerMin);
  const [ax, ay] = polar(rimR, theta0);
  const [bx, by] = polar(rimR, theta1);
  const [tx, ty] = polar(tipRadius, tipAngle);
  return `${ax},${ay} ${tx},${ty} ${bx},${by}`;
}
