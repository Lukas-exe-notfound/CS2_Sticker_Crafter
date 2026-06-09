import type { Skin } from "../../types/skin";
import { Button } from "../ui/Button";

export function SkinVisual({ skin, className = "" }: { skin: Skin; className?: string }) {
  const accent = skin.colors.includes("cyan") ? "#06B6D4" : skin.colors.includes("red") ? "#EF4444" : skin.colors.includes("gold") ? "#F59E0B" : "#7C3AED";
  if (skin.imageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-md border border-white/10 bg-slate-950 ${className}`}>
        <img alt={skin.fullName} className="h-full w-full object-contain p-4" src={skin.imageUrl} />
        <div className="absolute bottom-3 left-3 rounded bg-black/55 px-2 py-1 text-xs font-bold">{skin.weapon}</div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-md border border-white/10 bg-slate-950 ${className}`}>
      <div className="absolute inset-0 opacity-80" style={{ background: `linear-gradient(135deg, #111827, ${accent})` }} />
      <div className="absolute left-[12%] top-[42%] h-[16%] w-[76%] -translate-y-1/2 rounded-full bg-slate-200 shadow-2xl" />
      <div className="absolute left-[24%] top-[52%] h-[18%] w-[34%] rounded bg-slate-800" />
      <div className="absolute left-[54%] top-[49%] h-[11%] w-[22%] rounded bg-slate-700" />
      <div className="absolute bottom-3 left-3 rounded bg-black/45 px-2 py-1 text-xs font-bold">{skin.weapon}</div>
    </div>
  );
}

export function SkinCard({ skin, onSelect }: { skin: Skin; onSelect?: (skin: Skin) => void }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
      <SkinVisual skin={skin} className="aspect-[16/9]" />
      <h3 className="mt-3 truncate text-sm font-bold">{skin.fullName}</h3>
      <p className="truncate text-xs text-forge-muted">{skin.collection} - {skin.rarity}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-forge-cyan">EUR {skin.estimatedPrice.toFixed(2)}</span>
        <Button onClick={() => onSelect?.(skin)}>Select</Button>
      </div>
    </article>
  );
}
