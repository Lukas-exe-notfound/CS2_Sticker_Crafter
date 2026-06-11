import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StickerFilters } from "../components/stickers/StickerFilters";
import { StickerGrid } from "../components/stickers/StickerGrid";
import { StickerPreviewModal } from "../components/stickers/StickerPreviewModal";
import { useCraftStore } from "../store/craftStore";
import { getStickers, hasLoadedApiStickers } from "../services/stickerService";
import type { Sticker, StickerFilters as StickerFiltersType } from "../types/sticker";

export function StickerLibraryPage() {
  const [filters, setFilters] = useState<StickerFiltersType>({});
  const [preview, setPreview] = useState<Sticker>();
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const navigate = useNavigate();
  const addSticker = useCraftStore((state) => state.addSticker);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getStickers({ ...filters, page: pageInfo.page, limit: 30 })
      .then((response) => {
        if (cancelled) return;
        setStickers(response.data);
        setPageInfo({
          page: response.pagination?.page ?? 1,
          totalPages: response.pagination?.totalPages ?? 1,
        });
        setError(!hasLoadedApiStickers());
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
  }, [filters, pageInfo.page]);
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-8">
      <div>
        <h1 className="text-3xl font-black">Sticker library</h1>
        <p className="text-forge-muted">Search, filter, preview and use stickers in your craft.</p>
      </div>
      <StickerFilters filters={filters} onChange={setFilters} />
      {loading && <p className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm text-forge-muted">Loading CS2 data...</p>}
      {error && <p className="rounded-md border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">Could not load CS2 data. Make sure the backend is running.</p>}
      <StickerGrid
        stickers={stickers}
        onPreview={setPreview}
        onUse={(sticker) => {
          addSticker(sticker);
          navigate("/craft");
        }}
      />
      <p className="text-xs text-forge-muted">Page {pageInfo.page} of {pageInfo.totalPages}</p>
      {preview && <StickerPreviewModal sticker={preview} onClose={() => setPreview(undefined)} />}
    </div>
  );
}
