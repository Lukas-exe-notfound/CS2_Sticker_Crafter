import { Heart, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { StickerDetailInfo } from "../components/stickers/StickerDetailInfo";
import { StickerInspectPreview } from "../components/stickers/StickerInspectPreview";
import { Button } from "../components/ui/Button";
import { getStickerBySlug } from "../services/stickerService";
import { useCraftStore } from "../store/craftStore";

export function StickerDetailPage() {
  const { slug } = useParams();
  const sticker = slug ? getStickerBySlug(slug) : undefined;
  const addSticker = useCraftStore((state) => state.addSticker);
  const navigate = useNavigate();
  if (!sticker) return <div className="p-8">Sticker not found.</div>;
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
