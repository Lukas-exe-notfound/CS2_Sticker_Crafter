import type { Craft } from "../types/craft";
import { readStorage, writeStorage } from "../utils/storage";

const SAVED_KEY = "stickerforge-saved-crafts";

export const getSavedCrafts = () => readStorage<Craft[]>(SAVED_KEY, []);
export const persistSavedCrafts = (crafts: Craft[]) => writeStorage(SAVED_KEY, crafts);
