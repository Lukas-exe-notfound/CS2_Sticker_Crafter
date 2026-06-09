import type { Craft } from "../types/craft";

export function createShareLink(craft: Craft) {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(craft))));
  return `${window.location.origin}/craft?share=${encoded}`;
}

export function parseShareCraft(encoded: string) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded)))) as Craft;
  } catch {
    return undefined;
  }
}
