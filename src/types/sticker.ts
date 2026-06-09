export type StickerFilm = "Paper" | "Holo" | "Foil" | "Gold" | "Glitter" | "Lenticular" | "Other";

export interface Sticker {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  imageUrl: string;
  rarity: string;
  film: StickerFilm;
  tournament?: string;
  team?: string;
  player?: string;
  collection?: string;
  colors: string[];
  estimatedPrice: number;
  minPrice?: number;
  maxPrice?: number;
  popularity?: number;
  rating?: number;
}

export interface StickerFilters {
  search?: string;
  tournament?: string;
  team?: string;
  player?: string;
  film?: StickerFilm | "All";
  rarity?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  minPopularity?: number;
}
