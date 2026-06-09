import { useState } from "react";
import { getAllSkins } from "../../services/skinService";
import { getAllStickers } from "../../services/stickerService";
import { useCraftStore } from "../../store/craftStore";
import { Tabs } from "../ui/Tabs";
import { SearchInput } from "../ui/SearchInput";
import { StickerCard } from "../stickers/StickerCard";
import { SkinCard } from "../skins/SkinCard";

export function EditorControls() {
  const [tab, setTab] = useState<"Skins" | "Stickers">("Skins");
  const [query, setQuery] = useState("");
  const selectSkin = useCraftStore((state) => state.selectSkin);
  const addSticker = useCraftStore((state) => state.addSticker);
  const skins = getAllSkins().filter((skin) => skin.fullName.toLowerCase().includes(query.toLowerCase()) || skin.weapon.toLowerCase().includes(query.toLowerCase()));
  const stickers = getAllStickers().filter((sticker) => sticker.fullName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-3 p-3">
      <Tabs value={tab} options={["Skins", "Stickers"]} onChange={setTab} />
      <SearchInput placeholder={`Search ${tab.toLowerCase()}`} value={query} onChange={setQuery} />
      <div className="grid max-h-[calc(100vh-230px)] gap-3 overflow-auto pr-1">
        {tab === "Skins"
          ? skins.map((skin) => <SkinCard key={skin.id} skin={skin} onSelect={selectSkin} />)
          : stickers.map((sticker) => <StickerCard key={sticker.id} sticker={sticker} onUse={addSticker} />)}
      </div>
    </div>
  );
}
