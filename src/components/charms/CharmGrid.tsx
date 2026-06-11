import type { Charm } from "../../types/charm";
import { CharmCard } from "./CharmCard";

export function CharmGrid({
  charms,
  onUseCharm,
  onPreviewCharm,
}: {
  charms: Charm[];
  onUseCharm?: (charm: Charm) => void;
  onPreviewCharm?: (charm: Charm) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {charms.map((charm) => (
        <CharmCard key={charm.id} charm={charm} onPreviewCharm={onPreviewCharm} onUseCharm={onUseCharm} />
      ))}
    </div>
  );
}
