import type { StickerInstance } from "../../types/craft";
import type { Charm } from "../../types/charm";
import type { CraftCharmInstance } from "../../types/craft";
import type { Skin } from "../../types/skin";
import type { Sticker } from "../../types/sticker";
import { renderScrapedSticker } from "../../utils/scrapeEffect";

const colorHex: Record<string, string> = {
  black: "#111827",
  purple: "#7C3AED",
  cyan: "#06B6D4",
  blue: "#2563EB",
  pink: "#EC4899",
  gold: "#F59E0B",
  orange: "#F97316",
  red: "#EF4444",
  white: "#F9FAFB",
  silver: "#CBD5E1",
  gray: "#64748B",
  green: "#22C55E",
  yellow: "#EAB308",
};

const charmImageCache = new Map<string, HTMLImageElement>();

export function preloadCharmImage(url: string, onLoad?: () => void) {
  const cached = charmImageCache.get(url);
  if (cached) {
    if (cached.complete) onLoad?.();
    return cached;
  }
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.referrerPolicy = "no-referrer";
  image.onload = () => onLoad?.();
  image.src = url;
  charmImageCache.set(url, image);
  return image;
}

export function drawSkin(ctx: CanvasRenderingContext2D, skin: Skin | undefined, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0B1020");
  gradient.addColorStop(1, colorHex[skin?.colors[1] ?? "purple"] ?? "#7C3AED");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,.035)";
  for (let i = 0; i < 18; i += 1) ctx.fillRect(i * 90 - 30, 0, 34, height);

  const centerY = height * 0.53;
  ctx.save();
  ctx.shadowColor = "rgba(6,182,212,.25)";
  ctx.shadowBlur = 34;
  ctx.fillStyle = "#D1D5DB";
  ctx.beginPath();
  ctx.roundRect(width * 0.17, centerY - 48, width * 0.62, 72, 34);
  ctx.fill();
  ctx.fillStyle = "#9CA3AF";
  ctx.fillRect(width * 0.72, centerY - 28, width * 0.16, 28);
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.roundRect(width * 0.34, centerY + 10, width * 0.2, 92, 10);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(width * 0.2, centerY + 2, width * 0.16, 46, 14);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(249,250,251,.88)";
  ctx.font = "700 28px Inter, sans-serif";
  ctx.fillText(skin?.fullName ?? "Select a skin", 32, 52);
  ctx.font = "500 15px Inter, sans-serif";
  ctx.fillStyle = "rgba(249,250,251,.55)";
  ctx.fillText("Drag stickers on the weapon body. Scrape syncs with the inspect panel.", 32, 78);
}

export function drawStickerLayer(
  ctx: CanvasRenderingContext2D,
  instance: StickerInstance,
  sticker: Sticker,
  selected: boolean,
) {
  const size = 116 * instance.scale;
  const layer = renderScrapedSticker({
    stickerId: sticker.id,
    stickerName: sticker.name,
    colors: sticker.colors,
    scrapePercentage: instance.scrapePercentage,
    scrapeSeed: instance.scrapeSeed,
    filmType: sticker.film,
    width: 180,
    height: 180,
  });
  ctx.save();
  ctx.translate(instance.x, instance.y);
  ctx.rotate((instance.rotation * Math.PI) / 180);
  ctx.globalAlpha = instance.opacity;
  ctx.drawImage(layer, -size / 2, -size / 2, size, size);
  if (selected) {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#06B6D4";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 5]);
    ctx.strokeRect(-size / 2 - 8, -size / 2 - 8, size + 16, size + 16);
    ctx.setLineDash([]);
    ctx.fillStyle = "#06B6D4";
    for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      ctx.fillRect((x * (size + 16)) / 2 - 5, (y * (size + 16)) / 2 - 5, 10, 10);
    }
  }
  ctx.restore();
}

export function drawCharmLayer(ctx: CanvasRenderingContext2D, instance: CraftCharmInstance, charm: Charm | undefined, selected: boolean) {
  const size = 78 * instance.scale;
  ctx.save();
  ctx.translate(instance.x, instance.y);
  ctx.rotate((instance.rotation * Math.PI) / 180);
  ctx.globalAlpha = instance.opacity;

  const image = charm?.imageUrl ? preloadCharmImage(charm.imageUrl) : undefined;
  const gradient = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
  gradient.addColorStop(0, charm?.rarityColor ?? "#06B6D4");
  gradient.addColorStop(1, "#111827");
  ctx.fillStyle = gradient;
  ctx.shadowColor = charm?.rarityColor ?? "#06B6D4";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(-size / 2, -size / 2, size, size, 14);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,.5)";
  ctx.lineWidth = 2;
  ctx.stroke();
  if (image?.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, -size * 0.43, -size * 0.43, size * 0.86, size * 0.86);
  } else {
    ctx.fillStyle = "rgba(7,10,18,.72)";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#F9FAFB";
    ctx.font = `800 ${Math.max(12, size * 0.18)}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((charm?.name ?? "CH").slice(0, 2).toUpperCase(), 0, 0);
  }

  if (selected) {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#F59E0B";
    ctx.setLineDash([7, 4]);
    ctx.strokeRect(-size / 2 - 7, -size / 2 - 7, size + 14, size + 14);
    ctx.setLineDash([]);
  }
  ctx.restore();
}

export function drawCraftToCanvas(
  canvas: HTMLCanvasElement,
  skin: Skin | undefined,
  stickerItems: { instance: StickerInstance; sticker?: Sticker }[],
  charmItems: { instance: CraftCharmInstance; charm?: Charm }[] = [],
  selectedId?: string | null,
  selectedCharmId?: string | null,
) {
  const ctx = canvas.getContext("2d")!;
  drawSkin(ctx, skin, canvas.width, canvas.height);
  for (const item of stickerItems) {
    if (item.sticker) drawStickerLayer(ctx, item.instance, item.sticker, item.instance.instanceId === selectedId);
  }
  for (const item of charmItems) {
    drawCharmLayer(ctx, item.instance, item.charm, item.instance.instanceId === selectedCharmId);
  }
}

export function hitTestSticker(instances: StickerInstance[], x: number, y: number) {
  for (const instance of [...instances].reverse()) {
    const size = 70 * instance.scale;
    if (Math.abs(x - instance.x) <= size && Math.abs(y - instance.y) <= size) return instance;
  }
  return undefined;
}

export function hitTestCharm(instances: CraftCharmInstance[], x: number, y: number) {
  for (const instance of [...instances].reverse()) {
    const size = 52 * instance.scale;
    if (Math.abs(x - instance.x) <= size && Math.abs(y - instance.y) <= size) return instance;
  }
  return undefined;
}
