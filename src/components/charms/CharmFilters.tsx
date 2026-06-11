import type { CharmFilters as CharmFiltersType } from "../../types/charm";
import { FilterDropdown } from "../ui/FilterDropdown";
import { SearchInput } from "../ui/SearchInput";

export function CharmFilters({ filters, onChange }: { filters: CharmFiltersType; onChange: (filters: CharmFiltersType) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <SearchInput placeholder="Search charms" value={filters.search ?? ""} onChange={(search) => onChange({ ...filters, search, page: 1 })} />
      <FilterDropdown
        label="Rarity"
        options={["high-grade", "remarkable", "exotic", "extraordinary", "contraband"]}
        value={filters.rarity ?? ""}
        onChange={(rarity) => onChange({ ...filters, rarity, page: 1 })}
      />
    </div>
  );
}
