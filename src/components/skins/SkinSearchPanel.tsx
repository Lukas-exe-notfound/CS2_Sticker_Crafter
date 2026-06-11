import { useEffect, useState } from "react";
import { filterSkins } from "../../services/skinService";
import type { Skin } from "../../types/skin";
import type { SkinFilters as SkinFiltersType } from "../../types/skin";
import { SkinFilters } from "./SkinFilters";
import { SkinGrid } from "./SkinGrid";

export function SkinSearchPanel({ onSelect }: { onSelect: (skin: Skin) => void }) {
  const [filters, setFilters] = useState<SkinFiltersType>({});
  const [skins, setSkins] = useState<Skin[]>([]);

  useEffect(() => {
    let cancelled = false;
    filterSkins(filters).then((loadedSkins) => {
      if (!cancelled) setSkins(loadedSkins);
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="space-y-4">
      <SkinFilters filters={filters} onChange={setFilters} />
      <SkinGrid skins={skins} onSelect={onSelect} />
    </div>
  );
}
