import skinsJson from "../data/skins/skins.json";
import type { Skin, SkinFilters } from "../types/skin";

const skins = skinsJson as Skin[];

export const getAllSkins = () => skins;
export const getSkinById = (id: string) => skins.find((skin) => skin.id === id);
export const getSkinBySlug = (slug: string) => skins.find((skin) => skin.slug === slug);

export function searchSkins(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return skins;
  return skins.filter((skin) =>
    [skin.weapon, skin.name, skin.fullName, skin.collection, skin.rarity].some((value) => value.toLowerCase().includes(normalized)),
  );
}

export function filterSkins(filters: SkinFilters) {
  return searchSkins(filters.search ?? "").filter((skin) => {
    if (filters.weapon && skin.weapon !== filters.weapon) return false;
    if (filters.collection && skin.collection !== filters.collection) return false;
    if (filters.rarity && skin.rarity !== filters.rarity) return false;
    if (filters.color && !skin.colors.includes(filters.color)) return false;
    if (filters.minPrice != null && skin.estimatedPrice < filters.minPrice) return false;
    if (filters.maxPrice != null && skin.estimatedPrice > filters.maxPrice) return false;
    if (filters.statTrak && !skin.supportsStatTrak) return false;
    if (filters.souvenir && !skin.supportsSouvenir) return false;
    return true;
  });
}

export const getSkinsByWeapon = (weapon: string) => skins.filter((skin) => skin.weapon === weapon);
export const getSkinsByRarity = (rarity: string) => skins.filter((skin) => skin.rarity === rarity);
