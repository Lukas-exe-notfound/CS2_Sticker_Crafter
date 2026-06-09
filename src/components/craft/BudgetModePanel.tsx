import { useCraftStore } from "../../store/craftStore";

export function BudgetModePanel() {
  const budget = useCraftStore((state) => state.budget);
  const setBudget = useCraftStore((state) => state.setBudget);
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <label className="space-y-2 text-sm">
        <span className="block font-bold">Budget mode</span>
        <input
          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2"
          min={0}
          type="number"
          value={budget ?? ""}
          onChange={(event) => setBudget(event.target.value ? Number(event.target.value) : undefined)}
        />
      </label>
      <p className="mt-2 text-xs text-forge-muted">Cheaper alternatives can be suggested from matching colors in the sticker library.</p>
    </section>
  );
}
