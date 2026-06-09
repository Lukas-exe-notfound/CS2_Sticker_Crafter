import type { Craft, StickerInstance } from "../types/craft";
import type { Skin } from "../types/skin";
import type { Sticker } from "../types/sticker";

export function calculateCraftPrice(skin: Skin | undefined, instances: StickerInstance[], stickers: Sticker[]) {
  const stickerTotal = instances.reduce((total, instance) => {
    const sticker = stickers.find((item) => item.id === instance.stickerId);
    return total + (sticker?.estimatedPrice ?? 0);
  }, 0);
  const skinPrice = skin?.estimatedPrice ?? 0;
  return {
    skinPrice,
    stickerTotal,
    total: skinPrice + stickerTotal,
  };
}

export function craftToEstimatedPrice(craft: Craft, skin: Skin | undefined, stickers: Sticker[]) {
  return calculateCraftPrice(skin, craft.stickers, stickers).total;
}
