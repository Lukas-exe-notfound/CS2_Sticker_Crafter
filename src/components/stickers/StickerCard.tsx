import { Heart, Eye, Plus } from "lucide-react";
import type { Sticker } from "../../types/sticker";
import { Button } from "../ui/Button";

export function StickerArt({ sticker, className = "" }: { sticker: Sticker; className?: string }) {
  const colors = sticker.colors.join(",");
  if (sticker.imageUrl) {
    return (
      <div className={`grid place-items-center overflow-hidden rounded-md border border-white/10 bg-slate-950 ${className}`}>
        <img alt={sticker.fullName} className="h-full w-full object-contain p-4" src={sticker.imageUrl} />
      </div>
    );
  }

  return (
    <div
      className={`grid place-items-center rounded-md border border-white/10 ${className}`}
      style={{ background: `linear-gradient(135deg, ${colors.includes("gold") ? "#F59E0B" : "#7C3AED"}, ${colors.includes("cyan") ? "#06B6D4" : "#1F2937"})` }}
    >
      <div className="grid h-20 w-20 place-items-center rounded-full bg-black/55 text-center shadow-xl">
        <span className="text-2xl font-black">{sticker.name.slice(0, 2).toUpperCase()}</span>
      </div>
    </div>
  );
}

interface StickerCardProps {
  sticker: Sticker;
  onUse?: (sticker: Sticker) => void;
  onPreview?: (sticker: Sticker) => void;
}

export function StickerCard({ sticker, onUse, onPreview }: StickerCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.045] p-3 transition hover:border-cyan-400/50 hover:bg-white/[0.07]">
      <StickerArt sticker={sticker} className="aspect-square" />
      <div className="mt-3 min-w-0">
        <h3 className="truncate text-sm font-bold">{sticker.name}</h3>
        <p className="truncate text-xs text-forge-muted">{sticker.film} - {sticker.rarity}</p>
        <p className="mt-1 text-sm font-semibold text-forge-cyan">EUR {sticker.estimatedPrice.toFixed(2)}</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Button aria-label={`Preview ${sticker.name}`} className="px-2" icon={<Eye className="h-4 w-4" />} onClick={() => onPreview?.(sticker)} />
        <Button aria-label={`Use ${sticker.name} in craft`} className="px-2" icon={<Plus className="h-4 w-4" />} onClick={() => onUse?.(sticker)} />
        <Button aria-label={`Favorite ${sticker.name}`} className="px-2" icon={<Heart className="h-4 w-4" />} />
      </div>
    </article>
  );
}
