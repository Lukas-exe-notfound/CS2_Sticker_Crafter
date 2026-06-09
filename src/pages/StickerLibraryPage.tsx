import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StickerFilters } from "../components/stickers/StickerFilters";
import { StickerGrid } from "../components/stickers/StickerGrid";
import { StickerPreviewModal } from "../components/stickers/StickerPreviewModal";
import { useCraftStore } from "../store/craftStore";
import { filterStickers } from "../services/stickerService";
import type { Sticker, StickerFilters as StickerFiltersType } from "../types/sticker";

export function StickerLibraryPage() {
  const [filters, setFilters] = useState<StickerFiltersType>({});
  const [preview, setPreview] = useState<Sticker>();
  const navigate = useNavigate();
  const addSticker = useCraftStore((state) => state.addSticker);
  const stickers = useMemo(() => filterStickers(filters), [filters]);
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-8">
      <div>
        <h1 className="text-3xl font-black">Sticker library</h1>
        <p className="text-forge-muted">Search, filter, preview and use stickers in your craft.</p>
      </div>
      <StickerFilters filters={filters} onChange={setFilters} />
      <StickerGrid
        stickers={stickers}
        onPreview={setPreview}
        onUse={(sticker) => {
          addSticker(sticker);
          navigate("/craft");
        }}
      />
      {preview && <StickerPreviewModal sticker={preview} onClose={() => setPreview(undefined)} />}
    </div>
  );
}
