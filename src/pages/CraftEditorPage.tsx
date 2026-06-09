import { Sidebar } from "../components/layout/Sidebar";
import { CraftCanvas } from "../components/craft/CraftCanvas";
import { EditorControls } from "../components/craft/EditorControls";
import { EditorToolbar } from "../components/craft/EditorToolbar";
import { SelectedStickerPanel } from "../components/craft/SelectedStickerPanel";
import { CompareDrawer } from "../components/craft/CompareDrawer";

export function CraftEditorPage() {
  return (
    <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)_380px]">
      <Sidebar className="border-r">
        <EditorControls />
      </Sidebar>
      <section className="min-w-0 space-y-3 p-3">
        <EditorToolbar />
        <CraftCanvas />
      </section>
      <Sidebar className="border-l">
        <SelectedStickerPanel />
      </Sidebar>
      <CompareDrawer />
    </div>
  );
}
