import type { StickerFilm } from "../types/sticker";
import { seededRandom } from "./seededRandom";

interface ScrapeOptions {
  stickerImage?: HTMLImageElement;
  stickerId?: string;
  stickerName?: string;
  colors?: string[];
  scrapePercentage: number;
  scrapeSeed: string;
  filmType: StickerFilm;
  width: number;
  height: number;
}

const cache = new Map<string, HTMLCanvasElement>();
const colorMap: Record<string, string> = {
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

function createStickerBase(options: ScrapeOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext("2d")!;
  const colors = options.colors?.map((color) => colorMap[color] ?? color).slice(0, 3) ?? ["#7C3AED", "#06B6D4"];
  const gradient = ctx.createLinearGradient(0, 0, options.width, options.height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1] ?? "#06B6D4");

  ctx.shadowColor = colors[1] ?? "#06B6D4";
  ctx.shadowBlur = options.filmType === "Paper" ? 4 : 18;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(options.width * 0.08, options.height * 0.12, options.width * 0.84, options.height * 0.76, 18);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = options.filmType === "Gold" ? "#FDE68A" : "rgba(255,255,255,.55)";
  ctx.lineWidth = Math.max(3, options.width * 0.025);
  ctx.stroke();

  ctx.fillStyle = "rgba(7,10,18,.72)";
  ctx.beginPath();
  ctx.arc(options.width * 0.5, options.height * 0.48, options.width * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#F9FAFB";
  ctx.font = `700 ${Math.max(16, options.width * 0.13)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText((options.stickerName ?? "SF").slice(0, 2).toUpperCase(), options.width * 0.5, options.height * 0.48);
  ctx.font = `700 ${Math.max(10, options.width * 0.055)}px Inter, sans-serif`;
  ctx.fillText(options.filmType.toUpperCase(), options.width * 0.5, options.height * 0.75);
  return canvas;
}

function adjustImageData(ctx: CanvasRenderingContext2D, width: number, height: number, percentage: number, filmType: StickerFilm) {
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  const desaturate = percentage / 100;
  const contrast = 1 - desaturate * 0.42;
  const shineLoss = ["Holo", "Foil", "Gold", "Glitter", "Lenticular"].includes(filmType) ? desaturate * 0.35 : desaturate * 0.18;

  for (let index = 0; index < data.length; index += 4) {
    const gray = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
    data[index] = (gray * desaturate + data[index] * (1 - desaturate) - 128) * contrast + 128;
    data[index + 1] = (gray * desaturate + data[index + 1] * (1 - desaturate) - 128) * contrast + 128;
    data[index + 2] = (gray * desaturate + data[index + 2] * (1 - desaturate) - 128) * contrast + 128;
    data[index + 3] *= 1 - shineLoss;
  }
  ctx.putImageData(image, 0, 0);
}

export function applyStickerScrapeEffect(options: ScrapeOptions) {
  const percentage = Math.max(0, Math.min(100, Math.round(options.scrapePercentage)));
  const cacheKey = `${options.stickerId ?? options.stickerName}-${percentage}-${options.scrapeSeed}-${options.filmType}-${options.width}x${options.height}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext("2d")!;
  if (options.stickerImage?.complete && options.stickerImage.naturalWidth > 0) {
    ctx.drawImage(options.stickerImage, 0, 0, options.width, options.height);
  } else {
    ctx.drawImage(createStickerBase(options), 0, 0);
  }

  adjustImageData(ctx, options.width, options.height, percentage, options.filmType);
  const random = seededRandom(`${options.scrapeSeed}-${options.stickerId ?? ""}`);
  const intensity = percentage / 100;
  ctx.globalCompositeOperation = "destination-out";

  for (let i = 0; i < 45 + intensity * 160; i += 1) {
    const x = random() * options.width;
    const y = random() * options.height;
    const radius = (random() * 5 + 1.5) * (0.35 + intensity * 1.8);
    const threshold = random();
    if (threshold < intensity * 0.92) {
      ctx.globalAlpha = 0.18 + intensity * 0.85;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * (1 + random() * 2), radius, random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 10 + intensity * 55; i += 1) {
    const x = random() * options.width;
    const y = random() * options.height;
    const length = (18 + random() * 95) * intensity;
    const angle = random() * Math.PI;
    ctx.globalAlpha = 0.35 + intensity * 0.55;
    ctx.lineWidth = 1 + random() * 3.5 * intensity;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  const edgeDamage = intensity * 22;
  for (let i = 0; i < 80 * intensity; i += 1) {
    const side = Math.floor(random() * 4);
    const x = side < 2 ? random() * options.width : side === 2 ? 0 : options.width;
    const y = side >= 2 ? random() * options.height : side === 0 ? 0 : options.height;
    ctx.globalAlpha = 0.4 + intensity * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, edgeDamage * random(), 0, Math.PI * 2);
    ctx.fill();
  }

  if (percentage >= 90) {
    ctx.globalAlpha = (percentage - 88) / 12;
    ctx.fillRect(0, 0, options.width, options.height);
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  cache.set(cacheKey, canvas);
  return canvas;
}

export const renderScrapedSticker = applyStickerScrapeEffect;
