import { useCraftStore } from "../../store/craftStore";
import { ExportButton } from "./ExportButton";

export function SavedCraftsPanel() {
  const savedCrafts = useCraftStore((state) => state.savedCrafts);
  const loadCraft = useCraftStore((state) => state.loadCraft);
  const duplicateCraft = useCraftStore((state) => state.duplicateCraft);
  const deleteCraft = useCraftStore((state) => state.deleteCraft);
  const addToCompare = useCraftStore((state) => state.addToCompare);
  if (!savedCrafts.length) return <p className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-forge-muted">No saved crafts yet.</p>;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {savedCrafts.map((craft) => (
        <article key={craft.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h3 className="font-bold">{craft.name}</h3>
          <p className="text-sm text-forge-muted">{craft.stickers.length} stickers - EUR {craft.totalEstimatedPrice.toFixed(2)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded bg-white/10 px-3 py-2 text-sm" onClick={() => loadCraft(craft.id)} type="button">Open</button>
            <button className="rounded bg-white/10 px-3 py-2 text-sm" onClick={() => duplicateCraft(craft.id)} type="button">Duplicate</button>
            <button className="rounded bg-white/10 px-3 py-2 text-sm" onClick={() => addToCompare(craft)} type="button">Compare</button>
            <ExportButton craft={craft} />
            <button className="rounded bg-red-500/20 px-3 py-2 text-sm text-red-100" onClick={() => deleteCraft(craft.id)} type="button">Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
