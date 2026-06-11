import { useEffect, useRef, useState } from "react";
import { getStickerById } from "../../services/stickerService";
import { getCharmById } from "../../services/charmService";
import { useCraftStore } from "../../store/craftStore";
import { drawCraftToCanvas, hitTestCharm, hitTestSticker, preloadCharmImage } from "./canvasRenderer";

export function CraftCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedSkin = useCraftStore((state) => state.selectedSkin);
  const placedStickers = useCraftStore((state) => state.placedStickers);
  const placedCharms = useCraftStore((state) => state.placedCharms);
  const selectedStickerInstanceId = useCraftStore((state) => state.selectedStickerInstanceId);
  const selectedCharmInstanceId = useCraftStore((state) => state.selectedCharmInstanceId);
  const selectSticker = useCraftStore((state) => state.selectSticker);
  const selectCharm = useCraftStore((state) => state.selectCharm);
  const updateSticker = useCraftStore((state) => state.updateSticker);
  const updateCharm = useCraftStore((state) => state.updateCharm);
  const pushHistory = useCraftStore((state) => state.pushHistory);
  const removeSticker = useCraftStore((state) => state.removeSticker);
  const removeCharm = useCraftStore((state) => state.removeCharm);
  const [draggingId, setDraggingId] = useState<string>();
  const [imageTick, setImageTick] = useState(0);
  const dragRecordedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const items = placedStickers.map((instance) => ({ instance, sticker: getStickerById(instance.stickerId) }));
    const charmItems = placedCharms.map((instance) => ({ instance, charm: getCharmById(instance.charmId) }));
    drawCraftToCanvas(canvas, selectedSkin, items, charmItems, selectedStickerInstanceId, selectedCharmInstanceId);
  }, [selectedSkin, placedStickers, placedCharms, selectedStickerInstanceId, selectedCharmInstanceId, imageTick]);

  useEffect(() => {
    placedCharms.forEach((instance) => {
      const charm = getCharmById(instance.charmId);
      if (charm?.imageUrl) preloadCharmImage(charm.imageUrl, () => setImageTick((tick) => tick + 1));
    });
  }, [placedCharms]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedStickerInstanceId) removeSticker(selectedStickerInstanceId);
      if ((event.key === "Delete" || event.key === "Backspace") && selectedCharmInstanceId) removeCharm(selectedCharmInstanceId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [removeCharm, removeSticker, selectedCharmInstanceId, selectedStickerInstanceId]);

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
        const charmHit = hitTestCharm(placedCharms, point.x, point.y);
        const stickerHit = charmHit ? undefined : hitTestSticker(placedStickers, point.x, point.y);
        if (charmHit) selectCharm(charmHit.instanceId);
        else selectSticker(stickerHit?.instanceId);
        setDraggingId(charmHit?.instanceId ?? stickerHit?.instanceId);
        dragRecordedRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!draggingId) return;
        if (!dragRecordedRef.current) {
          pushHistory();
          dragRecordedRef.current = true;
        }
        if (placedCharms.some((charm) => charm.instanceId === draggingId)) updateCharm(draggingId, pointer(event), false);
        else updateSticker(draggingId, pointer(event), false);
      }}
      onPointerUp={() => {
        setDraggingId(undefined);
        dragRecordedRef.current = false;
      }}
    />
  );
}
