import type { Sticker } from "../../types/sticker";
import { StickerCard } from "./StickerCard";

export function StickerGrid({ stickers, onUse, onPreview }: { stickers: Sticker[]; onUse?: (sticker: Sticker) => void; onPreview?: (sticker: Sticker) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {stickers.map((sticker) => (
        <StickerCard key={sticker.id} sticker={sticker} onPreview={onPreview} onUse={onUse} />
      ))}
    </div>
  );
}
