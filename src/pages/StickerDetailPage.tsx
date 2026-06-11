import { Heart, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StickerDetailInfo } from "../components/stickers/StickerDetailInfo";
import { StickerInspectPreview } from "../components/stickers/StickerInspectPreview";
import { Button } from "../components/ui/Button";
import { getStickerBySlug, hasLoadedApiStickers } from "../services/stickerService";
import { useCraftStore } from "../store/craftStore";
import type { Sticker } from "../types/sticker";

export function StickerDetailPage() {
  const { slug } = useParams();
  const [sticker, setSticker] = useState<Sticker>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const addSticker = useCraftStore((state) => state.addSticker);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (!slug) {
      setLoading(false);
      return;
    }
    getStickerBySlug(slug)
      .then((loadedSticker) => {
        if (cancelled) return;
        setSticker(loadedSticker);
        setError(!loadedSticker || !hasLoadedApiStickers());
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
  }, [slug]);

  if (loading) return <div className="p-8 text-forge-muted">Loading CS2 data...</div>;
  if (!sticker) return <div className="p-8">{error ? "Could not load CS2 data. Make sure the backend is running." : "Sticker not found."}</div>;
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <h1 className="text-4xl font-black">{sticker.fullName}</h1>
        <StickerInspectPreview sticker={sticker} scrapePercentage={0} />
      </section>
      <aside className="space-y-4">
        <StickerDetailInfo sticker={sticker} />
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => { addSticker(sticker); navigate("/craft"); }}>Use in craft</Button>
        <Button icon={<Heart className="h-4 w-4" />}>Add to favorites</Button>
      </aside>
    </div>
  );
}
