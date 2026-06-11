import { motion } from "framer-motion";
import { ArrowRight, BadgeEuro, Layers, Save, SlidersHorizontal, SplitSquareHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStickers, getCachedStickers } from "../services/stickerService";
import { Button } from "../components/ui/Button";
import { StickerCard } from "../components/stickers/StickerCard";

export function HomePage() {
  const navigate = useNavigate();
  const [stickers, setStickers] = useState(getCachedStickers().slice(0, 5));

  useEffect(() => {
    getAllStickers().then((loadedStickers) => setStickers(loadedStickers.slice(0, 5)));
  }, []);

  const features = [
    ["Skin & sticker editor", Layers],
    ["Live scrape simulator", SlidersHorizontal],
    ["Price calculator", BadgeEuro],
    ["Save & export crafts", Save],
    ["Compare crafts", SplitSquareHorizontal],
  ];
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-10">
      <section className="grid min-h-[68vh] items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Preview your CS2 sticker crafts before spending money</h1>
          <p className="max-w-2xl text-lg text-forge-muted">Test skins, stickers, scrape levels and prices in one modern craft simulator.</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />} onClick={() => navigate("/craft")}>Start Crafting</Button>
            <Button onClick={() => navigate("/stickers")}>Explore Stickers</Button>
          </div>
        </motion.div>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map(([label, Icon]) => (
            <div key={label as string} className="glass rounded-lg p-5">
              <Icon className="mb-4 h-6 w-6 text-forge-cyan" />
              <h3 className="font-bold">{label as string}</h3>
            </div>
          ))}
        </div>
      </section>
      <section className="py-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black">Popular mock crafts</h2>
            <p className="text-forge-muted">A quick taste of stickers ready for preview.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {stickers.map((sticker) => <StickerCard key={sticker.id} sticker={sticker} onUse={() => navigate("/craft")} />)}
        </div>
      </section>
    </div>
  );
}
