import { getCachedStickers } from "../../services/stickerService";
import { useCraftStore } from "../../store/craftStore";
import { calculateCraftScore } from "../../utils/colorMatch";

export function CraftScore() {
  const skin = useCraftStore((state) => state.selectedSkin);
  const placed = useCraftStore((state) => state.placedStickers);
  const budget = useCraftStore((state) => state.budget);
  const score = calculateCraftScore(skin, placed, getCachedStickers(), budget);
  return (
    <section className="space-y-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Craft score</h3>
        <span className="rounded bg-forge-success/15 px-2 py-1 text-sm font-black text-green-200">{score.overallScore}</span>
      </div>
      {[
        ["Color match", score.colorMatchScore],
        ["Price efficiency", score.priceEfficiencyScore],
        ["Rarity bonus", score.rarityBonus],
      ].map(([label, value]) => (
        <div key={label} className="space-y-1">
          <div className="flex justify-between text-xs text-forge-muted"><span>{label}</span><span>{value}</span></div>
          <div className="h-2 rounded bg-black/35"><div className="h-2 rounded bg-forge-cyan" style={{ width: `${value}%` }} /></div>
        </div>
      ))}
    </section>
  );
}
