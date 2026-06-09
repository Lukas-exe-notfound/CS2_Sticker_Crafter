import { getSkinById } from "../services/skinService";
import { getStickerById } from "../services/stickerService";
import type { Craft } from "../types/craft";
import { drawCraftToCanvas } from "../components/craft/canvasRenderer";

export function exportCraftAsPng(craft: Craft) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 720;
  const skin = getSkinById(craft.skinId);
  const stickers = craft.stickers.map((instance) => ({ instance, sticker: getStickerById(instance.stickerId) })).filter((item) => item.sticker);
  drawCraftToCanvas(canvas, skin, stickers);
  const link = document.createElement("a");
  link.download = `${craft.name.replace(/\s+/g, "-").toLowerCase()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
