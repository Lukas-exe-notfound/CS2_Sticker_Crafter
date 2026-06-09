import { getSkinById } from "../services/skinService";
import { getAllStickers } from "../services/stickerService";
import { useCraftStore } from "../store/craftStore";
import { calculateCraftScore } from "../utils/colorMatch";
import { ExportButton } from "../components/craft/ExportButton";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export function ComparePage() {
  const compareCrafts = useCraftStore((state) => state.compareCrafts);
  const savedCrafts = useCraftStore((state) => state.savedCrafts);
  const crafts = compareCrafts.length ? compareCrafts : savedCrafts.slice(0, 4);
  const loadCraft = useCraftStore((state) => state.loadCraft);
  const stickers = getAllStickers();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-8">
      <h1 className="text-3xl font-black">Compare crafts</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {crafts.map((craft) => {
          const skin = getSkinById(craft.skinId);
          const score = calculateCraftScore(skin, craft.stickers, stickers);
          return (
            <article key={craft.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <h2 className="font-bold">{craft.name}</h2>
              <p className="text-sm text-forge-muted">{skin?.fullName}</p>
              <ul className="my-4 space-y-1 text-sm text-forge-muted">
                {craft.stickers.map((instance) => {
                  const sticker = stickers.find((item) => item.id === instance.stickerId);
                  return <li key={instance.instanceId}>{sticker?.name}: {instance.scrapePercentage}% scrape</li>;
                })}
              </ul>
              <p className="text-sm">Total price: <b>EUR {craft.totalEstimatedPrice.toFixed(2)}</b></p>
              <p className="text-sm">Color match: <b>{score.colorMatchScore}</b></p>
              <p className="text-sm">Price efficiency: <b>{score.priceEfficiencyScore}</b></p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ExportButton craft={craft} />
                <Button onClick={() => { loadCraft(craft.id); navigate("/craft"); }}>Open in editor</Button>
              </div>
            </article>
          );
        })}
      </div>
      {!crafts.length && <p className="text-forge-muted">Save or add crafts to compare first.</p>}
    </div>
  );
}
