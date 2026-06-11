import stickersJson from "../data/stickers/stickers.json";
import type { Sticker, StickerFilters, StickerFilm } from "../types/sticker";
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

interface ApiSticker {
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
  minPrice?: number;
  min_price?: number;
  maxPrice?: number;
  max_price?: number;
  popularity?: number;
  rating?: number;
  film_name?: StickerFilm | string;
  film_slug?: string;
  film?: StickerFilm;
  rarity_name?: string;
  rarity?: string;
  tournament_name?: string;
  tournament?: string;
  team_name?: string;
  team?: string;
  player_name?: string;
  player?: string;
}

const fallbackStickers = stickersJson as Sticker[];
let stickerCache: Sticker[] = [...fallbackStickers];
let apiLoaded = false;

function parseColors(value: ApiSticker["colors"], fallback: string[] = []) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return value.split(",").map((color) => color.trim()).filter(Boolean);
  }
}

function normalizeFilm(apiSticker: ApiSticker): StickerFilm {
  const film = apiSticker.film_name ?? apiSticker.film ?? "Other";
  const allowed: StickerFilm[] = ["Paper", "Holo", "Foil", "Gold", "Glitter", "Lenticular", "Other"];
  return allowed.includes(film as StickerFilm) ? (film as StickerFilm) : "Other";
}

export function mapApiStickerToSticker(apiSticker: ApiSticker): Sticker {
  return {
    id: String(apiSticker.id),
    slug: apiSticker.slug,
    name: apiSticker.name,
    fullName: apiSticker.full_name ?? apiSticker.fullName ?? apiSticker.name,
    imageUrl: apiSticker.image_url ?? apiSticker.imageUrl ?? "",
    rarity: apiSticker.rarity_name ?? apiSticker.rarity ?? "Unknown",
    film: normalizeFilm(apiSticker),
    tournament: apiSticker.tournament_name ?? apiSticker.tournament,
    team: apiSticker.team_name ?? apiSticker.team,
    player: apiSticker.player_name ?? apiSticker.player,
    colors: parseColors(apiSticker.colors, ["purple", "cyan"]),
    estimatedPrice: Number(apiSticker.estimated_price ?? apiSticker.estimatedPrice ?? 0),
    minPrice: apiSticker.min_price ?? apiSticker.minPrice,
    maxPrice: apiSticker.max_price ?? apiSticker.maxPrice,
    popularity: apiSticker.popularity ?? 50,
    rating: apiSticker.rating,
  };
}

function updateCache(stickers: Sticker[], loadedFromApi: boolean) {
  stickerCache = stickers.length ? stickers : fallbackStickers;
  apiLoaded = loadedFromApi;
  return stickerCache;
}

function filterLocal(filters: StickerFilters, source = stickerCache) {
  const query = filters.search?.trim().toLowerCase() ?? "";
  return source.filter((sticker) => {
    if (
      query &&
      ![sticker.name, sticker.fullName, sticker.team, sticker.player, sticker.tournament, sticker.film, sticker.rarity]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query))
    ) return false;
    if (filters.tournament && sticker.tournament !== filters.tournament) return false;
    if (filters.team && sticker.team !== filters.team) return false;
    if (filters.player && sticker.player !== filters.player) return false;
    if (filters.film && filters.film !== "All" && sticker.film !== filters.film) return false;
    if (filters.rarity && sticker.rarity !== filters.rarity) return false;
    if (filters.color && !sticker.colors.includes(filters.color)) return false;
    if (filters.minPrice != null && sticker.estimatedPrice < filters.minPrice) return false;
    if (filters.maxPrice != null && sticker.estimatedPrice > filters.maxPrice) return false;
    if (filters.minPopularity != null && (sticker.popularity ?? 0) < filters.minPopularity) return false;
    return true;
  });
}

export function getCachedStickers() {
  return stickerCache;
}

export function hasLoadedApiStickers() {
  return apiLoaded;
}

export async function getAllStickers() {
  try {
    const response = await apiGet<ApiListResponse<ApiSticker>>("/stickers", { limit: 30 });
    return updateCache(response.data.map(mapApiStickerToSticker), true);
  } catch {
    return updateCache(fallbackStickers, false);
  }
}

export function getStickerById(id: string) {
  return stickerCache.find((sticker) => sticker.id === id) ?? fallbackStickers.find((sticker) => sticker.id === id);
}

export async function getStickerBySlug(slug: string) {
  try {
    const apiSticker = await apiGet<ApiSticker>(`/stickers/${slug}`);
    const sticker = mapApiStickerToSticker(apiSticker);
    stickerCache = [sticker, ...stickerCache.filter((item) => item.id !== sticker.id)];
    apiLoaded = true;
    return sticker;
  } catch {
    return fallbackStickers.find((sticker) => sticker.slug === slug);
  }
}

export async function searchStickers(query: string) {
  try {
    const response = await apiGet<ApiListResponse<ApiSticker>>("/stickers", { search: query, limit: 30 });
    return updateCache(response.data.map(mapApiStickerToSticker), true);
  } catch {
    return filterLocal({ search: query }, fallbackStickers);
  }
}

export async function filterStickers(filters: StickerFilters) {
  try {
    const response = await apiGet<ApiListResponse<ApiSticker>>("/stickers", {
      search: filters.search,
      film: filters.film && filters.film !== "All" ? String(filters.film).toLowerCase() : undefined,
      rarity: filters.rarity,
      tournament: filters.tournament,
      limit: 30,
    });
    return updateCache(response.data.map(mapApiStickerToSticker), true).filter((sticker) => filterLocal(filters, [sticker]).length > 0);
  } catch {
    return filterLocal(filters, fallbackStickers);
  }
}

export const getStickersByTournament = (tournament: string) => filterLocal({ tournament });
export const getStickersByTeam = (team: string) => filterLocal({ team });
export const getStickersByFilm = (film: StickerFilm) => filterLocal({ film });
export const getFavoriteStickers = () => stickerCache.filter((sticker) => localStorage.getItem(`favorite-sticker-${sticker.id}`) === "true");

export async function getStickers(params?: StickerFilters & { page?: number; limit?: number }) {
  try {
    const response = await apiGet<ApiListResponse<ApiSticker>>("/stickers", {
      ...params,
      film: params?.film && params.film !== "All" ? String(params.film).toLowerCase() : undefined,
      limit: params?.limit ?? 30,
    });
    const data = response.data.map(mapApiStickerToSticker);
    updateCache(data, true);
    return {
      data,
      pagination: response.pagination,
    };
  } catch {
    const data = filterLocal(params ?? {}, fallbackStickers);
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
