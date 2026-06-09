import { getAllStickers } from "../../services/stickerService";
import { useCraftStore } from "../../store/craftStore";
import { calculateCraftPrice } from "../../utils/priceCalculator";

export function PriceBreakdown() {
  const skin = useCraftStore((state) => state.selectedSkin);
  const placed = useCraftStore((state) => state.placedStickers);
  const budget = useCraftStore((state) => state.budget);
  const prices = calculateCraftPrice(skin, placed, getAllStickers());
  const overBudget = budget != null && prices.total > budget;
  return (
    <section className="space-y-2 rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <h3 className="font-bold">Price breakdown</h3>
      <div className="flex justify-between text-sm"><span className="text-forge-muted">Skin price</span><b>EUR {prices.skinPrice.toFixed(2)}</b></div>
      <div className="flex justify-between text-sm"><span className="text-forge-muted">Sticker total</span><b>EUR {prices.stickerTotal.toFixed(2)}</b></div>
      <div className="flex justify-between border-t border-white/10 pt-2 text-sm"><span>Total craft</span><b className="text-forge-cyan">EUR {prices.total.toFixed(2)}</b></div>
      {overBudget && <p className="rounded-md bg-forge-warning/15 p-2 text-xs text-amber-200">Budget warning: this craft is above your current budget.</p>}
      <p className="text-xs text-forge-muted">Prices are estimates.</p>
    </section>
  );
}
