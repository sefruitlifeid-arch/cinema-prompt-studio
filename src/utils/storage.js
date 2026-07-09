export const PRESET_KEY = "cps_presets_v1";
export const CHAR_KEY = "cps_characters_v1";
export const PRODUCT_KEY = "cps_products_v1";
export const BRAND_KEY = "cps_brand_v1";
export const LOCATION_KEY = "cps_locations_v1";

export const memStore = {};

export const store = {
  read(key, fallback = []) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : (memStore[key] !== undefined ? memStore[key] : fallback);
    } catch (e) {
      return memStore[key] !== undefined ? memStore[key] : fallback;
    }
  },
  write(key, data) {
    memStore[key] = data;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) { /* in-memory only */ }
  },
};

// Copy helper with execCommand fallback for sandboxed iframes.
export function copyText(text, done) {
  const fallback = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.top = "0"; ta.style.left = "0"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch (e) { /* no-op */ }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  } else {
    fallback();
  }
}
