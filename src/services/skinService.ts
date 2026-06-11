import skinsJson from "../data/skins/skins.json";
import type { Skin, SkinFilters } from "../types/skin";
import { apiGet } from "./apiClient";

interface ApiListResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiSkin {
  id: number | string;
  slug: string;
  name: string;
  full_name?: string;
  fullName?: string;
  image_url?: string;
  imageUrl?: string;
  colors?: string[] | string | null;
  estimatedPrice?: number;
  estimated_price?: number;
  weapon_name?: string;
  weapon?: string;
  collection_name?: string;
  collection?: string;
  rarity_name?: string;
  rarity?: string;
  supports_stattrak?: boolean | 0 | 1;
  supportsStatTrak?: boolean;
  supports_souvenir?: boolean | 0 | 1;
  supportsSouvenir?: boolean;
}

const fallbackSkins = skinsJson as Skin[];
let skinCache: Skin[] = [...fallbackSkins];
let apiLoaded = false;

function parseColors(value: ApiSkin["colors"], fallback: string[] = []) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return value.split(",").map((color) => color.trim()).filter(Boolean);
  }
}

export function mapApiSkinToSkin(apiSkin: ApiSkin): Skin {
  return {
    id: String(apiSkin.id),
    slug: apiSkin.slug,
    weapon: apiSkin.weapon_name ?? apiSkin.weapon ?? "Unknown",
    name: apiSkin.name,
    fullName: apiSkin.full_name ?? apiSkin.fullName ?? apiSkin.name,
    collection: apiSkin.collection_name ?? apiSkin.collection ?? "Unknown Collection",
    rarity: apiSkin.rarity_name ?? apiSkin.rarity ?? "Unknown",
    imageUrl: apiSkin.image_url ?? apiSkin.imageUrl ?? "",
    colors: parseColors(apiSkin.colors, ["black", "cyan"]),
    estimatedPrice: Number(apiSkin.estimated_price ?? apiSkin.estimatedPrice ?? 0),
    supportsStatTrak: Boolean(apiSkin.supports_stattrak ?? apiSkin.supportsStatTrak),
    supportsSouvenir: Boolean(apiSkin.supports_souvenir ?? apiSkin.supportsSouvenir),
  };
}

function updateCache(skins: Skin[], loadedFromApi: boolean) {
  skinCache = skins.length ? skins : fallbackSkins;
  apiLoaded = loadedFromApi;
  return skinCache;
}

function filterLocal(filters: SkinFilters, source = skinCache) {
  const query = filters.search?.trim().toLowerCase() ?? "";
  return source.filter((skin) => {
    if (query && ![skin.weapon, skin.name, skin.fullName, skin.collection, skin.rarity].some((value) => value.toLowerCase().includes(query))) return false;
    if (filters.weapon && skin.weapon !== filters.weapon && skin.slug !== filters.weapon) return false;
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

export function getCachedSkins() {
  return skinCache;
}

export function hasLoadedApiSkins() {
  return apiLoaded;
}

export async function getAllSkins() {
  try {
    const response = await apiGet<ApiListResponse<ApiSkin>>("/skins", { limit: 30 });
    return updateCache(response.data.map(mapApiSkinToSkin), true);
  } catch {
    return updateCache(fallbackSkins, false);
  }
}

export function getSkinById(id: string) {
  return skinCache.find((skin) => skin.id === id) ?? fallbackSkins.find((skin) => skin.id === id);
}

export async function getSkinBySlug(slug: string) {
  try {
    const apiSkin = await apiGet<ApiSkin>(`/skins/${slug}`);
    const skin = mapApiSkinToSkin(apiSkin);
    skinCache = [skin, ...skinCache.filter((item) => item.id !== skin.id)];
    apiLoaded = true;
    return skin;
  } catch {
    return fallbackSkins.find((skin) => skin.slug === slug);
  }
}

export async function searchSkins(query: string) {
  try {
    const response = await apiGet<ApiListResponse<ApiSkin>>("/skins", { search: query, limit: 30 });
    return updateCache(response.data.map(mapApiSkinToSkin), true);
  } catch {
    return filterLocal({ search: query }, fallbackSkins);
  }
}

export async function filterSkins(filters: SkinFilters) {
  try {
    const response = await apiGet<ApiListResponse<ApiSkin>>("/skins", {
      search: filters.search,
      weapon: filters.weapon,
      rarity: filters.rarity,
      limit: 30,
    });
    return updateCache(response.data.map(mapApiSkinToSkin), true).filter((skin) => filterLocal(filters, [skin]).length > 0);
  } catch {
    return filterLocal(filters, fallbackSkins);
  }
}

export const getSkinsByWeapon = (weapon: string) => filterLocal({ weapon });
export const getSkinsByRarity = (rarity: string) => filterLocal({ rarity });

export async function getSkins(params?: SkinFilters & { page?: number; limit?: number }) {
  try {
    const response = await apiGet<ApiListResponse<ApiSkin>>("/skins", { ...params, limit: params?.limit ?? 30 });
    const data = response.data.map(mapApiSkinToSkin);
    updateCache(data, true);
    return {
      data,
      pagination: response.pagination,
    };
  } catch {
    const data = filterLocal(params ?? {}, fallbackSkins);
    return {
      data,
      pagination: {
        page: params?.page ?? 1,
        limit: params?.limit ?? data.length,
        total: data.length,
        totalPages: 1,
      },
    };
  }
}
