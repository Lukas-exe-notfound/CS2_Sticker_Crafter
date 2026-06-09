import type { Sticker } from "../../types/sticker";
import { Modal } from "../layout/Modal";
import { StickerInspectPreview } from "./StickerInspectPreview";

export function StickerPreviewModal({ sticker, onClose }: { sticker: Sticker; onClose: () => void }) {
  return (
    <Modal title={sticker.fullName} onClose={onClose}>
      <StickerInspectPreview sticker={sticker} scrapePercentage={25} />
    </Modal>
  );
}
