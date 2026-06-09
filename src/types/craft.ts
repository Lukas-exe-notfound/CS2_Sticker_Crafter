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

export interface Craft {
  id: string;
  name: string;
  skinId: string;
  floatValue: number;
  patternId?: number;
  statTrak: boolean;
  souvenir: boolean;
  stickers: StickerInstance[];
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
