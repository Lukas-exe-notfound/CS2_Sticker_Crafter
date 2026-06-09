import type { StickerFilters as StickerFiltersType } from "../../types/sticker";
import { FilterDropdown } from "../ui/FilterDropdown";
import { SearchInput } from "../ui/SearchInput";

interface StickerFiltersProps {
  filters: StickerFiltersType;
  onChange: (filters: StickerFiltersType) => void;
}

const films = ["Paper", "Holo", "Foil", "Gold", "Glitter", "Lenticular", "Other"];
const rarities = ["High Grade", "Remarkable", "Exotic", "Extraordinary"];

export function StickerFilters({ filters, onChange }: StickerFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <SearchInput placeholder="Search stickers" value={filters.search ?? ""} onChange={(search) => onChange({ ...filters, search })} />
      <FilterDropdown label="Filmtype" options={films} value={filters.film === "All" ? "" : filters.film ?? ""} onChange={(film) => onChange({ ...filters, film: film as StickerFiltersType["film"] })} />
      <FilterDropdown label="Rarity" options={rarities} value={filters.rarity ?? ""} onChange={(rarity) => onChange({ ...filters, rarity })} />
      <FilterDropdown label="Color" options={["black", "purple", "cyan", "blue", "red", "gold", "green", "white", "orange", "pink"]} value={filters.color ?? ""} onChange={(color) => onChange({ ...filters, color })} />
    </div>
  );
}
