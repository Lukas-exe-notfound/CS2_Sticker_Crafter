export interface StickerInstance {
  instanceId: string;
  stickerId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  scrapePercentage: number;
  scrapeCount: number;
  scrapeSeed: string;
  opacity: number;
}

export interface CraftCharmInstance {
  instanceId: string;
  charmId: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

export interface Craft {
  id: string;
  name: string;
  skinId: string;
  floatValue: number;
  patternId?: number;
  statTrak: boolean;
  souvenir: boolean;
  stickers: StickerInstance[];
  charms?: CraftCharmInstance[];
  totalEstimatedPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CraftScoreResult {
  colorMatchScore: number;
  priceEfficiencyScore: number;
  rarityBonus: number;
  overallScore: number;
}
