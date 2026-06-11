import { Eye, Plus } from "lucide-react";
import { useState } from "react";
import type { Charm } from "../../types/charm";
import { Button } from "../ui/Button";

function getCollectionName(charm: Charm) {
  if (Array.isArray(charm.collections)) {
    const first = charm.collections[0];
    if (first && typeof first === "object" && "name" in first) return String((first as { name?: unknown }).name ?? "");
    if (typeof first === "string") return first;
  }
  if (typeof charm.collections === "string") {
    try {
      const parsed = JSON.parse(charm.collections) as unknown;
      if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === "object" && "name" in parsed[0]) {
        return String((parsed[0] as { name?: unknown }).name ?? "");
      }
    } catch {
      return charm.collections;
    }
  }
  return "Unknown collection";
}

export function CharmArt({ charm, className = "" }: { charm: Charm; className?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const rawImageUrl = charm.imageUrl || (charm as Charm & { image_url?: string | null }).image_url || "";
  const charmImage = rawImageUrl.trim();
  const showImage = charmImage && !imageFailed;

  return (
    <div className={`grid place-items-center overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-slate-950 to-forge-panel2 ${className}`}>
      {showImage ? (
        <img
          alt={charm.fullName}
          className="h-full w-full object-contain p-4"
          loading="lazy"
          referrerPolicy="no-referrer"
          src={charmImage}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="grid h-20 w-20 place-items-center rounded-full bg-forge-cyan/20 text-xl font-black text-forge-cyan">
          {charm.name.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export function CharmCard({
  charm,
  onUseCharm,
  onPreviewCharm,
}: {
  charm: Charm;
  onUseCharm?: (charm: Charm) => void;
  onPreviewCharm?: (charm: Charm) => void;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.045] p-3 transition hover:border-cyan-400/50 hover:bg-white/[0.07]">
      <CharmArt charm={charm} className="aspect-square" />
      <div className="mt-3 min-w-0">
        <h3 className="truncate text-sm font-bold">{charm.fullName}</h3>
        <p className="truncate text-xs text-forge-muted">
          {charm.rarityName ?? "Unknown rarity"} · {getCollectionName(charm)}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button aria-label={`Preview ${charm.name}`} className="px-2" icon={<Eye className="h-4 w-4" />} onClick={() => onPreviewCharm?.(charm)}>
          Preview
        </Button>
        <Button aria-label={`Use ${charm.name} in craft`} className="px-2" icon={<Plus className="h-4 w-4" />} onClick={() => onUseCharm?.(charm)}>
          Use
        </Button>
      </div>
    </article>
  );
}
