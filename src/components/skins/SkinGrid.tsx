import type { Skin } from "../../types/skin";
import { SkinCard } from "./SkinCard";

export function SkinGrid({ skins, onSelect }: { skins: Skin[]; onSelect?: (skin: Skin) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {skins.map((skin) => (
        <SkinCard key={skin.id} skin={skin} onSelect={onSelect} />
      ))}
    </div>
  );
}
