import { Slider } from "../ui/Slider";

export function StickerScrapeSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <Slider label="Scrape Level %" value={value} onChange={onChange} />;
}
