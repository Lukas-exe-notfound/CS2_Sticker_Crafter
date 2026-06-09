import { useEffect, useRef, useState } from "react";
import { getStickerById } from "../../services/stickerService";
import { useCraftStore } from "../../store/craftStore";
import { drawCraftToCanvas, hitTestSticker } from "./canvasRenderer";

export function CraftCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedSkin = useCraftStore((state) => state.selectedSkin);
  const placedStickers = useCraftStore((state) => state.placedStickers);
  const selectedStickerInstanceId = useCraftStore((state) => state.selectedStickerInstanceId);
  const selectSticker = useCraftStore((state) => state.selectSticker);
  const updateSticker = useCraftStore((state) => state.updateSticker);
  const pushHistory = useCraftStore((state) => state.pushHistory);
  const removeSticker = useCraftStore((state) => state.removeSticker);
  const [draggingId, setDraggingId] = useState<string>();
  const dragRecordedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const items = placedStickers.map((instance) => ({ instance, sticker: getStickerById(instance.stickerId) }));
    drawCraftToCanvas(canvas, selectedSkin, items, selectedStickerInstanceId);
  }, [selectedSkin, placedStickers, selectedStickerInstanceId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedStickerInstanceId) removeSticker(selectedStickerInstanceId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [removeSticker, selectedStickerInstanceId]);

  const pointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * event.currentTarget.width,
      y: ((event.clientY - rect.top) / rect.height) * event.currentTarget.height,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className="aspect-[5/3] w-full cursor-grab rounded-lg border border-white/10 bg-black shadow-2xl active:cursor-grabbing"
      height={720}
      width={1200}
      onPointerDown={(event) => {
        const point = pointer(event);
        const hit = hitTestSticker(placedStickers, point.x, point.y);
        selectSticker(hit?.instanceId);
        setDraggingId(hit?.instanceId);
        dragRecordedRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!draggingId) return;
        if (!dragRecordedRef.current) {
          pushHistory();
          dragRecordedRef.current = true;
        }
        updateSticker(draggingId, pointer(event), false);
      }}
      onPointerUp={() => {
        setDraggingId(undefined);
        dragRecordedRef.current = false;
      }}
    />
  );
}
