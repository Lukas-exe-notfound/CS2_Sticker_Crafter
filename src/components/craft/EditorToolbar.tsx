import { Copy, Download, Redo2, RotateCcw, Save, Share2, Undo2 } from "lucide-react";
import { useCraftStore } from "../../store/craftStore";
import { exportCraftAsPng } from "../../utils/exportCanvas";
import { createShareLink } from "../../utils/shareLink";
import { Button } from "../ui/Button";

export function EditorToolbar() {
  const state = useCraftStore();

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-forge-panel p-2">
      <Button icon={<Undo2 className="h-4 w-4" />} onClick={state.undo}>Undo</Button>
      <Button icon={<Redo2 className="h-4 w-4" />} onClick={state.redo}>Redo</Button>
      <Button icon={<RotateCcw className="h-4 w-4" />} onClick={state.resetCraft}>Reset</Button>
      <Button icon={<Save className="h-4 w-4" />} onClick={state.saveCraft} variant="primary">Save</Button>
      <Button icon={<Download className="h-4 w-4" />} onClick={() => { const craft = state.getCurrentCraft(); if (craft) exportCraftAsPng(craft); }}>Export PNG</Button>
      <Button icon={<Share2 className="h-4 w-4" />} onClick={() => { const craft = state.getCurrentCraft(); if (craft) navigator.clipboard.writeText(createShareLink(craft)); }}>Share</Button>
      <Button icon={<Copy className="h-4 w-4" />} onClick={() => navigator.clipboard.writeText("inspect-craft-placeholder")}>Inspect</Button>
    </div>
  );
}
