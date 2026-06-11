import type { ApiCharm, Charm, CharmFilters } from "../types/charm";
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

let charmCache: Charm[] = [];
let apiLoaded = false;

export function mapApiCharmToCharm(apiCharm: ApiCharm): Charm {
  return {
    id: apiCharm.id,
    externalId: apiCharm.external_id,
    defIndex: apiCharm.def_index,
    slug: apiCharm.slug,
    name: apiCharm.name,
    fullName: apiCharm.full_name,
    marketHashName: apiCharm.market_hash_name,
    description: apiCharm.description,
    imageUrl: apiCharm.image_url?.trim() || null,
    colors: apiCharm.colors,
    collections: apiCharm.collections,
    rarityName: apiCharm.rarity_name,
    raritySlug: apiCharm.rarity_slug,
    rarityColor: apiCharm.rarity_color,
  };
}

function updateCache(charms: Charm[], loadedFromApi: boolean) {
  charmCache = charms;
  apiLoaded = loadedFromApi;
  return charmCache;
}

export function getCachedCharms() {
  return charmCache;
}

export function hasLoadedApiCharms() {
  return apiLoaded;
}

export function getCharmById(id: number) {
  return charmCache.find((charm) => charm.id === id);
}

export async function getCharmBySlug(slug: string) {
  try {
    const apiCharm = await apiGet<ApiCharm>(`/charms/${slug}`);
    const charm = mapApiCharmToCharm(apiCharm);
    charmCache = [charm, ...charmCache.filter((item) => item.id !== charm.id)];
    apiLoaded = true;
    return charm;
  } catch {
    apiLoaded = false;
    return undefined;
  }
}

export async function getAllCharms(options: CharmFilters = {}) {
  try {
    const response = await apiGet<ApiListResponse<ApiCharm>>("/charms", {
      search: options.search,
      rarity: options.rarity,
      page: options.page,
      limit: options.limit ?? 30,
    });
    const data = response.data.map(mapApiCharmToCharm);
    updateCache(data, true);
    return {
      data,
      pagination: response.pagination,
    };
  } catch {
    return {
      data: updateCache([], false),
      pagination: {
        page: options.page ?? 1,
        limit: options.limit ?? 30,
        total: 0,
        totalPages: 1,
      },
    };
  }
}

export async function searchCharms(query: string, options: CharmFilters = {}) {
  return getAllCharms({ ...options, search: query, limit: options.limit ?? 30 });
}

export async function filterCharms(filters: CharmFilters) {
  return getAllCharms({ ...filters, limit: filters.limit ?? 30 });
}
