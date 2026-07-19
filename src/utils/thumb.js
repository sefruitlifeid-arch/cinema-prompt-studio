// Capture a small center-cropped JPEG data-URL thumbnail from an image File.
// Returns a data-URL string, or null on any failure / oversize. Never throws.
export async function makeThumb(file) {
  try {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    const img = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = url;
    }).catch(() => null);
    URL.revokeObjectURL(url);
    if (!img || !img.width || !img.height) return null;

    // Center-crop cover: scale to fill the square, crop the overflow.
    const draw = (size, quality) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const scale = Math.max(size / img.width, size / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
      return canvas.toDataURL("image/jpeg", quality);
    };

    let out = draw(96, 0.7);
    if (out && out.length > 20000) out = draw(96, 0.5);
    if (out && out.length > 20000) out = draw(64, 0.5);
    if (!out || out.length > 34000) return null;
    return out;
  } catch (e) {
    return null;
  }
}
