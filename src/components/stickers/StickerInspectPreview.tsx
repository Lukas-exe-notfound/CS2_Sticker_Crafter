import { Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { StickerInstance } from "../../types/craft";
import type { Sticker } from "../../types/sticker";
import { renderScrapedSticker } from "../../utils/scrapeEffect";
import { Tabs } from "../ui/Tabs";
import { StickerScrapeSlider } from "./StickerScrapeSlider";

export function StickerInspectPreview({
  sticker,
  instance,
  scrapePercentage,
  onScrapeChange,
}: {
  sticker?: Sticker;
  instance?: StickerInstance;
  scrapePercentage?: number;
  onScrapeChange?: (value: number) => void;
}) {
  const [tab, setTab] = useState<"Screenshot" | "3D View">("Screenshot");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const percentage = scrapePercentage ?? instance?.scrapePercentage ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sticker) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rendered = renderScrapedSticker({
      stickerId: sticker.id,
      stickerName: sticker.name,
      colors: sticker.colors,
      scrapePercentage: percentage,
      scrapeSeed: instance?.scrapeSeed ?? `${sticker.id}-detail`,
      filmType: sticker.film,
      width: canvas.width,
      height: canvas.height,
    });
    if (tab === "3D View") {
      ctx.save();
      ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
      ctx.transform(1, -0.08, 0.18, 0.95, 0, 0);
      ctx.drawImage(rendered, -canvas.width * 0.39, -canvas.height * 0.39, canvas.width * 0.78, canvas.height * 0.78);
      ctx.restore();
      // Later this placeholder can be replaced with a Three.js or React Three Fiber scene.
    } else {
      ctx.drawImage(rendered, 20, 20, canvas.width - 40, canvas.height - 40);
    }
  }, [sticker, instance, percentage, tab]);

  if (!sticker) {
    return <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-white/15 text-sm text-forge-muted">Select a sticker to inspect scraping</div>;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Tabs value={tab} options={["Screenshot", "3D View"]} onChange={setTab} />
        <button aria-label="Expand preview" className="rounded-md p-2 text-forge-muted hover:bg-white/10 hover:text-white" type="button">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
      <div className="checker rounded-lg p-3">
        <canvas ref={canvasRef} className="h-auto w-full" height={320} width={420} />
      </div>
      <div className="mt-4">
        <StickerScrapeSlider value={percentage} onChange={(value) => onScrapeChange?.(value)} />
      </div>
    </div>
  );
}
