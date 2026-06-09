import type { CraftScoreResult, StickerInstance } from "../types/craft";
import type { Skin } from "../types/skin";
import type { Sticker } from "../types/sticker";

const rarityBonus: Record<string, number> = {
  "High Grade": 2,
  "Mil-Spec": 3,
  Restricted: 5,
  Remarkable: 7,
  Classified: 8,
  Exotic: 10,
  Extraordinary: 12,
  Covert: 12,
};

export function calculateCraftScore(skin: Skin | undefined, instances: StickerInstance[], stickers: Sticker[], budget?: number): CraftScoreResult {
  if (!skin) {
    return { colorMatchScore: 0, priceEfficiencyScore: 0, rarityBonus: 0, overallScore: 0 };
  }

  const used = instances.map((instance) => stickers.find((sticker) => sticker.id === instance.stickerId)).filter(Boolean) as Sticker[];
  const matches = used.reduce((count, sticker) => count + sticker.colors.filter((color) => skin.colors.includes(color)).length, 0);
  const possible = Math.max(1, used.reduce((count, sticker) => count + sticker.colors.length, 0));
  const colorMatchScore = Math.round((matches / possible) * 100);
  const totalStickerPrice = used.reduce((sum, sticker) => sum + sticker.estimatedPrice, 0);
  const target = budget && budget > 0 ? budget : Math.max(30, skin.estimatedPrice * 0.75);
  const priceEfficiencyScore = Math.max(0, Math.min(100, Math.round(100 - (totalStickerPrice / target) * 55)));
  const rarity = Math.min(100, Math.round(used.reduce((sum, sticker) => sum + (rarityBonus[sticker.rarity] ?? 4), 0)));
  const overallScore = Math.round(colorMatchScore * 0.46 + priceEfficiencyScore * 0.34 + rarity * 0.2);

  return { colorMatchScore, priceEfficiencyScore, rarityBonus: rarity, overallScore };
}
