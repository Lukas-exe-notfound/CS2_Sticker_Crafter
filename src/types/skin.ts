export interface Skin {
  id: string;
  slug: string;
  weapon: string;
  name: string;
  fullName: string;
  collection: string;
  rarity: string;
  imageUrl: string;
  colors: string[];
  estimatedPrice: number;
  supportsStatTrak: boolean;
  supportsSouvenir: boolean;
}

export interface SkinFilters {
  search?: string;
  weapon?: string;
  collection?: string;
  rarity?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  statTrak?: boolean;
  souvenir?: boolean;
}
