import { SavedCraftsPanel } from "../components/craft/SavedCraftsPanel";

export function SavedCraftsPage() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-8">
      <div>
        <h1 className="text-3xl font-black">Saved crafts</h1>
        <p className="text-forge-muted">Open, duplicate, export, compare or delete local crafts.</p>
      </div>
      <SavedCraftsPanel />
    </div>
  );
}
