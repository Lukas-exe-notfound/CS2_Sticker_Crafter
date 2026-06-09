import { useMemo, useState } from "react";
import { filterSkins } from "../../services/skinService";
import type { Skin } from "../../types/skin";
import { SkinFilters } from "./SkinFilters";
import { SkinGrid } from "./SkinGrid";

export function SkinSearchPanel({ onSelect }: { onSelect: (skin: Skin) => void }) {
  const [filters, setFilters] = useState({});
  const skins = useMemo(() => filterSkins(filters), [filters]);
  return (
    <div className="space-y-4">
      <SkinFilters filters={filters} onChange={setFilters} />
      <SkinGrid skins={skins} onSelect={onSelect} />
    </div>
  );
}
