import type { SkinFilters as SkinFiltersType } from "../../types/skin";
import { FilterDropdown } from "../ui/FilterDropdown";
import { SearchInput } from "../ui/SearchInput";

export function SkinFilters({ filters, onChange }: { filters: SkinFiltersType; onChange: (filters: SkinFiltersType) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <SearchInput placeholder="Search skins" value={filters.search ?? ""} onChange={(search) => onChange({ ...filters, search })} />
      <FilterDropdown label="Weapon" options={["AK-47", "M4A1-S", "AWP", "USP-S", "Glock-18", "Desert Eagle", "M4A4", "MP9"]} value={filters.weapon ?? ""} onChange={(weapon) => onChange({ ...filters, weapon })} />
      <FilterDropdown label="Rarity" options={["Mil-Spec", "Restricted", "Classified", "Covert"]} value={filters.rarity ?? ""} onChange={(rarity) => onChange({ ...filters, rarity })} />
    </div>
  );
}
