export type Grid = (string | null)[][];
export type GridSize = 8 | 16 | 32 | 64;

export interface HistoryStore {
  state: Grid[];
  currentIndex: number;
}

export interface SaveData {
    history: HistoryStore;
    gridSize: GridSize;
}