import { Copy, Trash2 } from "lucide-react";
import { getStickerById } from "../../services/stickerService";
import { useCraftStore } from "../../store/craftStore";
import { StickerInspectPreview } from "../stickers/StickerInspectPreview";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import { BudgetModePanel } from "./BudgetModePanel";
import { CraftScore } from "./CraftScore";
import { PriceBreakdown } from "./PriceBreakdown";

export function SelectedStickerPanel() {
  const selectedId = useCraftStore((state) => state.selectedStickerInstanceId);
  const instance = useCraftStore((state) => state.placedStickers.find((item) => item.instanceId === selectedId));
  const updateSticker = useCraftStore((state) => state.updateSticker);
  const setScrapePercentage = useCraftStore((state) => state.setScrapePercentage);
  const scrapeStickerStep = useCraftStore((state) => state.scrapeStickerStep);
  const resetStickerScrape = useCraftStore((state) => state.resetStickerScrape);
  const duplicateSticker = useCraftStore((state) => state.duplicateSticker);
  const removeSticker = useCraftStore((state) => state.removeSticker);
  const sticker = instance ? getStickerById(instance.stickerId) : undefined;

  return (
    <div className="space-y-3 p-3">
      <div>
        <h2 className="text-lg font-bold">{sticker?.name ?? "No sticker selected"}</h2>
        <p className="text-xs text-forge-muted">{sticker ? "Selected sticker controls" : "Click a sticker on the skin or add one from the left panel."}</p>
      </div>
      <StickerInspectPreview sticker={sticker} instance={instance} onScrapeChange={(value) => instance && setScrapePercentage(instance.instanceId, value)} />
      {instance && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => scrapeStickerStep(instance.instanceId)}>Scrape +10%</Button>
            <Button onClick={() => resetStickerScrape(instance.instanceId)}>Reset scrape</Button>
            <Button icon={<Copy className="h-4 w-4" />} onClick={() => duplicateSticker(instance.instanceId)}>Duplicate</Button>
            <Button icon={<Trash2 className="h-4 w-4" />} onClick={() => removeSticker(instance.instanceId)} variant="danger">Remove</Button>
          </div>
          <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <Slider label="Position X" max={1200} value={Math.round(instance.x)} onChange={(x) => updateSticker(instance.instanceId, { x })} />
            <Slider label="Position Y" max={720} value={Math.round(instance.y)} onChange={(y) => updateSticker(instance.instanceId, { y })} />
            <Slider label="Rotation" min={-180} max={180} value={instance.rotation} onChange={(rotation) => updateSticker(instance.instanceId, { rotation })} />
            <Slider label="Scale" min={0.4} max={2.2} step={0.05} value={Number(instance.scale.toFixed(2))} onChange={(scale) => updateSticker(instance.instanceId, { scale })} />
            <Slider label="Opacity" min={0.1} max={1} step={0.05} value={Number(instance.opacity.toFixed(2))} onChange={(opacity) => updateSticker(instance.instanceId, { opacity })} />
          </div>
          <p className="rounded-md border border-amber-400/25 bg-amber-400/10 p-3 text-xs text-amber-100">
            Dit is een visuele simulator. In CS2 zelf is sticker scraping permanent en kan het niet ongedaan worden gemaakt.
          </p>
        </>
      )}
      <PriceBreakdown />
      <CraftScore />
      <BudgetModePanel />
    </div>
  );
}
