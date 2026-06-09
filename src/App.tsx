import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ComparePage } from "./pages/ComparePage";
import { CraftEditorPage } from "./pages/CraftEditorPage";
import { HomePage } from "./pages/HomePage";
import { SavedCraftsPage } from "./pages/SavedCraftsPage";
import { StickerDetailPage } from "./pages/StickerDetailPage";
import { StickerLibraryPage } from "./pages/StickerLibraryPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/craft" element={<CraftEditorPage />} />
        <Route path="/stickers" element={<StickerLibraryPage />} />
        <Route path="/stickers/:slug" element={<StickerDetailPage />} />
        <Route path="/saved" element={<SavedCraftsPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </AppLayout>
  );
}
