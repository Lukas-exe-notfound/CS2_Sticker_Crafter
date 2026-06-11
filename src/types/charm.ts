export interface Charm {
  id: number;
  externalId?: string | null;
  defIndex: number | null;
  slug: string;
  name: string;
  fullName: string;
  marketHashName?: string | null;
  description?: string | null;
  imageUrl: string | null;
  colors: string[] | string | null;
  collections: unknown[] | string | null;
  rarityName: string | null;
  raritySlug: string | null;
  rarityColor: string | null;
}

export interface ApiCharm {
  id: number;
  external_id: string | null;
  def_index: number | null;
  slug: string;
  name: string;
  full_name: string;
  market_hash_name: string | null;
  description: string | null;
  image_url: string | null;
  colors: string[] | string | null;
  collections: unknown[] | string | null;
  rarity_name: string | null;
  rarity_slug: string | null;
  rarity_color: string | null;
}

export interface CharmFilters {
  search?: string;
  rarity?: string;
  page?: number;
  limit?: number;
}
