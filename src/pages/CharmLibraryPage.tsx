import { useEffect, useState } from "react";
import { CharmFilters } from "../components/charms/CharmFilters";
import { CharmGrid } from "../components/charms/CharmGrid";
import { Button } from "../components/ui/Button";
import { getAllCharms, hasLoadedApiCharms } from "../services/charmService";
import { useCraftStore } from "../store/craftStore";
import type { Charm, CharmFilters as CharmFiltersType } from "../types/charm";

export function CharmLibraryPage() {
  const [filters, setFilters] = useState<CharmFiltersType>({ page: 1, limit: 30 });
  const [charms, setCharms] = useState<Charm[]>([]);
  const [preview, setPreview] = useState<Charm>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const addCharm = useCraftStore((state) => state.addCharm);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllCharms({ ...filters, limit: 30 })
      .then((response) => {
        if (cancelled) return;
        setCharms(response.data);
        setPageInfo({
          page: response.pagination?.page ?? filters.page ?? 1,
          totalPages: response.pagination?.totalPages ?? 1,
        });
        setError(!hasLoadedApiCharms());
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-8">
      <div>
        <h1 className="text-3xl font-black">Charm library</h1>
        <p className="text-forge-muted">Browse CS2 charms and add them to your craft preview.</p>
      </div>
      <CharmFilters filters={filters} onChange={setFilters} />
      {loading && <p className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm text-forge-muted">Loading CS2 charms...</p>}
      {error && <p className="rounded-md border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">Could not load CS2 charms. Make sure the backend is running.</p>}
      <CharmGrid charms={charms} onPreviewCharm={setPreview} onUseCharm={addCharm} />
      <div className="flex items-center justify-between text-xs text-forge-muted">
        <span>Page {pageInfo.page} of {pageInfo.totalPages}</span>
        <div className="flex gap-2">
          <Button disabled={pageInfo.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: Math.max(1, (current.page ?? 1) - 1) }))}>Previous</Button>
          <Button disabled={pageInfo.page >= pageInfo.totalPages} onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) + 1 }))}>Next</Button>
        </div>
      </div>
      {preview && (
        <div className="rounded-lg border border-white/10 bg-forge-panel p-4">
          <div className="flex items-start justify-between gap-4">
            {preview.imageUrl && (
              <img alt={preview.fullName} className="h-24 w-24 rounded-md object-contain" loading="lazy" referrerPolicy="no-referrer" src={preview.imageUrl} />
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold">{preview.fullName}</h2>
              <p className="mt-1 text-sm text-forge-muted">{preview.description ?? preview.rarityName}</p>
            </div>
            <Button onClick={() => setPreview(undefined)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
