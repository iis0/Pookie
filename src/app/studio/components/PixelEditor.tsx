"use client";

import { useState, useCallback } from "react";
import { type ToolId } from "../lib/consts";
import { type Grid, createEmptyGrid } from "../lib/utils";
import ToolsSidebar from "./ToolsSidebar";
import PaletteSidebar from "./PaletteSidebar";
import EditorCanvas from "./EditorCanvas";

interface HistoryStore {
  state: Grid[];
  currentIndex: number;

}

export default function PixelEditor() {
  const [gridSize, setGridSize] = useState(16);
  const [activeTool, setActiveTool] = useState<ToolId>("pencil");
  const [activeColor, setActiveColor] = useState("#a11212");
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(16));
  const [history, setHistory] = useState<HistoryStore>({
    state: [],
    currentIndex: 0,
  });
  const [showGrid, setShowGrid] = useState(true);

  const handleGridSizeChange = useCallback((newSize: number) => {
    setGridSize(newSize);
    setGrid(createEmptyGrid(newSize));
    setHistory({ state: [], currentIndex: 0 });
  }, [])

  const pushHistory = () => {
    console.log('--- GRID ---')
    console.log(grid)
    setHistory(({ state }) => {
      const newState = [...state, grid];
      return {
        state: newState,
        currentIndex: newState.length - 1,
      };
    });
  };

  const undo = () => {
    const { state, currentIndex } = history;
    const isMissingLatestState = (state.length === currentIndex + 1 ) && (grid !== state[state.length - 1])
    let newIndex = currentIndex - 1; 
    let newState: Grid[] = [];

    if (state.length === 0) return;
    // currentIndex is offset by one (initial blank state added to history)
    if (isMissingLatestState) {
      newState = [...state, grid]
      newIndex += 1;
    }
    else {
      newState = state;
    }

    setGrid(state[newIndex]); 
    setHistory({
      state: newState,
      currentIndex: newIndex,
    });
  };

  const redo = () => {
    const { state, currentIndex } = history;
    const nextIndex = currentIndex + 1;

    if (state.length === currentIndex + 1) return;
    setGrid(state[nextIndex]);
    setHistory({
      state,
      currentIndex: nextIndex,
    });
  };

  const clearCanvas = () => {
    setHistory(({ state, currentIndex }) => ({
      state: [...state, grid],
      currentIndex,
    }));
    setGrid(createEmptyGrid(gridSize));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <ToolsSidebar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        gridSize={gridSize}
        setGridSize={handleGridSizeChange}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        onUndo={undo}
        onRedo={redo}
        onClear={clearCanvas}
      />

      {/* <KatakanaDivider /> */}

      <EditorCanvas
        grid={grid}
        setGrid={setGrid}
        gridSize={gridSize}
        activeColor={activeColor}
        activeTool={activeTool}
        setActiveColor={setActiveColor}
        showGrid={showGrid}
        pushHistory={pushHistory}
      />

      {/* <KatakanaDivider /> */}

      <PaletteSidebar
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        historyLength={history.state.length}
      />
    </div>
  );
}
