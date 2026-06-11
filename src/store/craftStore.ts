import { create } from "zustand";
import { getCachedSkins, getSkinById } from "../services/skinService";
import { getCachedStickers } from "../services/stickerService";
import type { Charm } from "../types/charm";
import type { Craft, CraftCharmInstance, StickerInstance } from "../types/craft";
import type { Skin } from "../types/skin";
import type { Sticker } from "../types/sticker";
import { calculateCraftPrice } from "../utils/priceCalculator";
import { readStorage, writeStorage } from "../utils/storage";

const SAVED_KEY = "stickerforge-saved-crafts";

interface Snapshot {
  selectedSkin?: Skin;
  placedStickers: StickerInstance[];
  placedCharms: CraftCharmInstance[];
  selectedStickerInstanceId: string | null;
  selectedCharmInstanceId: string | null;
}

interface CraftStore extends Snapshot {
  history: Snapshot[];
  future: Snapshot[];
  savedCrafts: Craft[];
  budget?: number;
  compareCrafts: Craft[];
  selectSkin: (skin: Skin) => void;
  addSticker: (sticker: Sticker) => void;
  addCharm: (charm: Charm) => void;
  removeSticker: (instanceId: string) => void;
  removeCharm: (instanceId: string) => void;
  updateSticker: (instanceId: string, updates: Partial<StickerInstance>, recordHistory?: boolean) => void;
  updateCharm: (instanceId: string, updates: Partial<CraftCharmInstance>, recordHistory?: boolean) => void;
  pushHistory: () => void;
  duplicateSticker: (instanceId: string) => void;
  duplicateCharm: (instanceId: string) => void;
  selectSticker: (instanceId?: string | null) => void;
  selectCharm: (instanceId?: string | null) => void;
  setScrapePercentage: (instanceId: string, percentage: number) => void;
  scrapeStickerStep: (instanceId: string) => void;
  resetStickerScrape: (instanceId: string) => void;
  undo: () => void;
  redo: () => void;
  resetCraft: () => void;
  saveCraft: () => Craft | undefined;
  getCurrentCraft: () => Craft | undefined;
  loadCraft: (id: string) => void;
  deleteCraft: (id: string) => void;
  duplicateCraft: (id: string) => void;
  setBudget: (budget?: number) => void;
  addToCompare: (craft: Craft) => void;
  removeFromCompare: (craftId: string) => void;
}

const initialSkin = getCachedSkins()[0];

function snapshot(state: Snapshot): Snapshot {
  return {
    selectedSkin: state.selectedSkin,
    placedStickers: state.placedStickers.map((sticker) => ({ ...sticker })),
    placedCharms: state.placedCharms.map((charm) => ({ ...charm })),
    selectedStickerInstanceId: state.selectedStickerInstanceId,
    selectedCharmInstanceId: state.selectedCharmInstanceId,
  };
}

function withHistory(state: CraftStore, updates: Partial<Snapshot>) {
  return {
    ...updates,
    history: [...state.history, snapshot(state)].slice(-60),
    future: [],
  };
}

function makeInstance(sticker: Sticker, index: number): StickerInstance {
  return {
    instanceId: crypto.randomUUID(),
    stickerId: sticker.id,
    x: 430 + index * 72,
    y: 340,
    rotation: 0,
    scale: 1,
    scrapePercentage: 0,
    scrapeCount: 0,
    scrapeSeed: `${sticker.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    opacity: 1,
  };
}

function makeCharmInstance(charm: Charm, index: number): CraftCharmInstance {
  return {
    instanceId: `charm-${charm.id}-${Date.now()}-${index}`,
    charmId: charm.id,
    x: 50,
    y: 50,
    rotation: 0,
    scale: 1,
    opacity: 1,
  };
}

function toCraft(state: CraftStore): Craft | undefined {
  if (!state.selectedSkin) return undefined;
  const stickers = getCachedStickers();
  const totalEstimatedPrice = calculateCraftPrice(state.selectedSkin, state.placedStickers, stickers).total;
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: `${state.selectedSkin.fullName} Craft`,
    skinId: state.selectedSkin.id,
    floatValue: 0.108,
    statTrak: false,
    souvenir: false,
    stickers: state.placedStickers,
    charms: state.placedCharms,
    totalEstimatedPrice,
    createdAt: now,
    updatedAt: now,
  };
}

export const useCraftStore = create<CraftStore>((set, get) => ({
  selectedSkin: initialSkin,
  placedStickers: [],
  placedCharms: [],
  selectedStickerInstanceId: null,
  selectedCharmInstanceId: null,
  history: [],
  future: [],
  savedCrafts: readStorage<Craft[]>(SAVED_KEY, []),
  budget: 150,
  compareCrafts: [],
  selectSkin: (skin) => set((state) => withHistory(state, { selectedSkin: skin, selectedStickerInstanceId: null, selectedCharmInstanceId: null })),
  addSticker: (sticker) =>
    set((state) => {
      const instance = makeInstance(sticker, state.placedStickers.length);
      return withHistory(state, {
        placedStickers: [...state.placedStickers, instance],
        selectedStickerInstanceId: instance.instanceId,
        selectedCharmInstanceId: null,
      });
    }),
  addCharm: (charm) =>
    set((state) => {
      const instance = makeCharmInstance(charm, state.placedCharms.length);
      return withHistory(state, {
        placedCharms: [...state.placedCharms, instance],
        selectedCharmInstanceId: instance.instanceId,
        selectedStickerInstanceId: null,
      });
    }),
  removeSticker: (instanceId) =>
    set((state) =>
      withHistory(state, {
        placedStickers: state.placedStickers.filter((sticker) => sticker.instanceId !== instanceId),
        selectedStickerInstanceId: state.selectedStickerInstanceId === instanceId ? null : state.selectedStickerInstanceId,
      }),
    ),
  removeCharm: (instanceId) =>
    set((state) =>
      withHistory(state, {
        placedCharms: state.placedCharms.filter((charm) => charm.instanceId !== instanceId),
        selectedCharmInstanceId: state.selectedCharmInstanceId === instanceId ? null : state.selectedCharmInstanceId,
      }),
    ),
  updateSticker: (instanceId, updates, recordHistory = true) =>
    set((state) => {
      const nextStickers = state.placedStickers.map((sticker) => (sticker.instanceId === instanceId ? { ...sticker, ...updates } : sticker));
      if (!recordHistory) return { placedStickers: nextStickers };
      return withHistory(state, { placedStickers: nextStickers });
    }),
  updateCharm: (instanceId, updates, recordHistory = true) =>
    set((state) => {
      const nextCharms = state.placedCharms.map((charm) => (charm.instanceId === instanceId ? { ...charm, ...updates } : charm));
      if (!recordHistory) return { placedCharms: nextCharms };
      return withHistory(state, { placedCharms: nextCharms });
    }),
  pushHistory: () => set((state) => ({ history: [...state.history, snapshot(state)].slice(-60), future: [] })),
  duplicateSticker: (instanceId) =>
    set((state) => {
      const source = state.placedStickers.find((sticker) => sticker.instanceId === instanceId);
      if (!source) return {};
      const clone = {
        ...source,
        instanceId: crypto.randomUUID(),
        x: source.x + 34,
        y: source.y + 28,
        scrapeSeed: `${source.scrapeSeed}-copy-${Date.now()}`,
      };
      return withHistory(state, { placedStickers: [...state.placedStickers, clone], selectedStickerInstanceId: clone.instanceId });
    }),
  duplicateCharm: (instanceId) =>
    set((state) => {
      const source = state.placedCharms.find((charm) => charm.instanceId === instanceId);
      if (!source) return {};
      const clone = {
        ...source,
        instanceId: `charm-${source.charmId}-${Date.now()}`,
        x: source.x + 28,
        y: source.y + 28,
      };
      return withHistory(state, { placedCharms: [...state.placedCharms, clone], selectedCharmInstanceId: clone.instanceId, selectedStickerInstanceId: null });
    }),
  selectSticker: (instanceId) => set({ selectedStickerInstanceId: instanceId ?? null, selectedCharmInstanceId: null }),
  selectCharm: (instanceId) => set({ selectedCharmInstanceId: instanceId ?? null, selectedStickerInstanceId: null }),
  setScrapePercentage: (instanceId, percentage) =>
    set((state) =>
      withHistory(state, {
        placedStickers: state.placedStickers.map((sticker) =>
          sticker.instanceId === instanceId
            ? { ...sticker, scrapePercentage: Math.max(0, Math.min(100, percentage)), scrapeCount: Math.round(percentage / 10) }
            : sticker,
        ),
      }),
    ),
  scrapeStickerStep: (instanceId) => {
    const current = get().placedStickers.find((sticker) => sticker.instanceId === instanceId);
    if (current) get().setScrapePercentage(instanceId, Math.min(100, current.scrapePercentage + 10));
  },
  resetStickerScrape: (instanceId) => get().setScrapePercentage(instanceId, 0),
  undo: () =>
    set((state) => {
      const previous = state.history[state.history.length - 1];
      if (!previous) return {};
      return {
        ...previous,
        history: state.history.slice(0, -1),
        future: [snapshot(state), ...state.future],
      };
    }),
  redo: () =>
    set((state) => {
      const next = state.future[0];
      if (!next) return {};
      return {
        ...next,
        history: [...state.history, snapshot(state)],
        future: state.future.slice(1),
      };
    }),
  resetCraft: () => set((state) => withHistory(state, { placedStickers: [], placedCharms: [], selectedStickerInstanceId: null, selectedCharmInstanceId: null })),
  saveCraft: () => {
    const craft = toCraft(get());
    if (!craft) return undefined;
    const savedCrafts = [craft, ...get().savedCrafts.filter((item) => item.id !== craft.id)];
    writeStorage(SAVED_KEY, savedCrafts);
    set({ savedCrafts });
    return craft;
  },
  getCurrentCraft: () => toCraft(get()),
  loadCraft: (id) => {
    const craft = get().savedCrafts.find((item) => item.id === id);
    const skin = craft ? getSkinById(craft.skinId) : undefined;
    if (!craft || !skin) return;
    set((state) =>
      withHistory(state, {
        selectedSkin: skin,
        placedStickers: craft.stickers,
        placedCharms: craft.charms ?? [],
        selectedStickerInstanceId: craft.stickers[0]?.instanceId ?? null,
        selectedCharmInstanceId: null,
      }),
    );
  },
  deleteCraft: (id) => {
    const savedCrafts = get().savedCrafts.filter((craft) => craft.id !== id);
    writeStorage(SAVED_KEY, savedCrafts);
    set({ savedCrafts });
  },
  duplicateCraft: (id) => {
    const craft = get().savedCrafts.find((item) => item.id === id);
    if (!craft) return;
    const duplicate = { ...craft, id: crypto.randomUUID(), name: `${craft.name} Copy`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const savedCrafts = [duplicate, ...get().savedCrafts];
    writeStorage(SAVED_KEY, savedCrafts);
    set({ savedCrafts });
  },
  setBudget: (budget) => set({ budget }),
  addToCompare: (craft) => set((state) => ({ compareCrafts: [craft, ...state.compareCrafts.filter((item) => item.id !== craft.id)].slice(0, 4) })),
  removeFromCompare: (craftId) => set((state) => ({ compareCrafts: state.compareCrafts.filter((craft) => craft.id !== craftId) })),
}));
