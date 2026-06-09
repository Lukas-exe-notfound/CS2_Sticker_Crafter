import type { Sticker } from "../../types/sticker";

export function StickerDetailInfo({ sticker }: { sticker: Sticker }) {
  const rows = [
    ["Filmtype", sticker.film],
    ["Rarity", sticker.rarity],
    ["Tournament", sticker.tournament ?? "Unknown"],
    ["Team/player", sticker.team ?? sticker.player ?? "None"],
    ["Estimated price", `EUR ${sticker.estimatedPrice.toFixed(2)}`],
    ["Min price", sticker.minPrice ? `EUR ${sticker.minPrice.toFixed(2)}` : "N/A"],
    ["Max price", sticker.maxPrice ? `EUR ${sticker.maxPrice.toFixed(2)}` : "N/A"],
    ["Popularity", `${sticker.popularity ?? 0}/100`],
  ];
  return (
    <dl className="grid gap-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between rounded-md bg-white/[0.05] px-3 py-2 text-sm">
          <dt className="text-forge-muted">{label}</dt>
          <dd className="font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
