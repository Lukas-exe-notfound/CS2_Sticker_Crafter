import { getAllStickers } from "../../services/stickerService";
import { useCraftStore } from "../../store/craftStore";
import { calculateCraftScore } from "../../utils/colorMatch";

export function CompareDrawer() {
  const compareCrafts = useCraftStore((state) => state.compareCrafts);
  const removeFromCompare = useCraftStore((state) => state.removeFromCompare);
  const stickers = getAllStickers();
  if (!compareCrafts.length) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-forge-panel p-3">
      <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-4">
        {compareCrafts.map((craft) => {
          const score = calculateCraftScore(undefined, craft.stickers, stickers);
          return (
            <article key={craft.id} className="rounded-md bg-white/[0.05] p-3 text-sm">
              <button className="float-right text-forge-muted" onClick={() => removeFromCompare(craft.id)} type="button">×</button>
              <b>{craft.name}</b>
              <p className="text-forge-muted">EUR {craft.totalEstimatedPrice.toFixed(2)} - score {score.overallScore}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
