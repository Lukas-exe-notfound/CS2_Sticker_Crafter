import stickersJson from "../data/stickers/stickers.json";
import type { Sticker, StickerFilters, StickerFilm } from "../types/sticker";

const stickers = stickersJson as Sticker[];

export const getAllStickers = () => stickers;
export const getStickerById = (id: string) => stickers.find((sticker) => sticker.id === id);
export const getStickerBySlug = (slug: string) => stickers.find((sticker) => sticker.slug === slug);

export function searchStickers(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return stickers;
  return stickers.filter((sticker) =>
    [sticker.name, sticker.fullName, sticker.team, sticker.player, sticker.tournament, sticker.film, sticker.rarity]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalized)),
  );
}

export function filterStickers(filters: StickerFilters) {
  return searchStickers(filters.search ?? "").filter((sticker) => {
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

export const getStickersByTournament = (tournament: string) => stickers.filter((sticker) => sticker.tournament === tournament);
export const getStickersByTeam = (team: string) => stickers.filter((sticker) => sticker.team === team);
export const getStickersByFilm = (film: StickerFilm) => stickers.filter((sticker) => sticker.film === film);
export const getFavoriteStickers = () => stickers.filter((sticker) => localStorage.getItem(`favorite-sticker-${sticker.id}`) === "true");
