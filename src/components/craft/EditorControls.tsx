import { useEffect, useState } from "react";
import { getAllCharms, hasLoadedApiCharms, searchCharms } from "../../services/charmService";
import { getAllSkins, hasLoadedApiSkins, searchSkins } from "../../services/skinService";
import { getAllStickers, hasLoadedApiStickers, searchStickers } from "../../services/stickerService";
import { useCraftStore } from "../../store/craftStore";
import type { Charm } from "../../types/charm";
import type { Skin } from "../../types/skin";
import type { Sticker } from "../../types/sticker";
import { CharmCard } from "../charms/CharmCard";
import { Tabs } from "../ui/Tabs";
import { SearchInput } from "../ui/SearchInput";
import { StickerCard } from "../stickers/StickerCard";
import { SkinCard } from "../skins/SkinCard";

export function EditorControls() {
  const [tab, setTab] = useState<"Skins" | "Stickers" | "Charms">("Skins");
  const [query, setQuery] = useState("");
  const [skins, setSkins] = useState<Skin[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [charms, setCharms] = useState<Charm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const selectSkin = useCraftStore((state) => state.selectSkin);
  const addSticker = useCraftStore((state) => state.addSticker);
  const addCharm = useCraftStore((state) => state.addCharm);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const skinRequest = query ? searchSkins(query) : getAllSkins();
    const stickerRequest = query ? searchStickers(query) : getAllStickers();
    const charmRequest = query ? searchCharms(query, { limit: 30 }) : getAllCharms({ limit: 30 });
    Promise.all([skinRequest, stickerRequest, charmRequest])
      .then(([loadedSkins, loadedStickers, loadedCharms]) => {
        if (cancelled) return;
        setSkins(loadedSkins);
        setStickers(loadedStickers);
        setCharms(loadedCharms.data);
        setError(!hasLoadedApiSkins() || !hasLoadedApiStickers() || !hasLoadedApiCharms());
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="space-y-3 p-3">
      <Tabs value={tab} options={["Skins", "Stickers", "Charms"]} onChange={setTab} />
      <SearchInput placeholder={`Search ${tab.toLowerCase()}`} value={query} onChange={setQuery} />
      {loading && <p className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-forge-muted">Loading CS2 data...</p>}
      {error && <p className="rounded-md border border-amber-400/25 bg-amber-400/10 p-3 text-xs text-amber-100">Could not load CS2 data. Make sure the backend is running.</p>}
      <div className="grid max-h-[calc(100vh-230px)] gap-3 overflow-auto pr-1">
        {tab === "Skins" && skins.map((skin) => <SkinCard key={skin.id} skin={skin} onSelect={selectSkin} />)}
        {tab === "Stickers" && stickers.map((sticker) => <StickerCard key={sticker.id} sticker={sticker} onUse={addSticker} />)}
        {tab === "Charms" && charms.map((charm) => <CharmCard key={charm.id} charm={charm} onUseCharm={addCharm} />)}
      </div>
    </div>
  );
}
