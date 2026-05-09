"use client";

import { useState, useEffect, useCallback } from "react";
import { type ToolId } from "../lib/consts";
import { type Grid, createEmptyGrid } from "../lib/utils";
import ToolsSidebar from "./ToolsSidebar";
import PaletteSidebar from "./PaletteSidebar";
import EditorCanvas from "./EditorCanvas";
// import KatakanaDivider from "@/components/layout/KatakanaDivider";

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

  // Reset grid on size change
  useEffect(() => {
    setGrid(createEmptyGrid(gridSize));
    setHistory({ state: [], currentIndex: 0 });
  }, [gridSize]);

  const pushHistory = useCallback(() => {
    setHistory(({ state }) => {
      const newState = [...state, grid];
      return {
        state: newState,
        currentIndex: newState.length - 1,
      };
    });
  }, [grid]);

  const undo = useCallback(() => {
    const { state } = history;

    console.log("state length: ", state.length);

    if (state.length === 0) return;
    setGrid(state[state.length - 1]);
    setHistory(({ state: s, currentIndex }) => ({
      // state: s.slice(0, -1),
      state: s,
      currentIndex: currentIndex - 1,
    }));
  }, [history]);

  const redo = useCallback(() => {
    const { state, currentIndex } = history;

    if (state.length === currentIndex) return;
    setGrid(state[state.length + 1]);
    setHistory(({ state: s, currentIndex: c }) => ({
      state,
      currentIndex: c + 1,
    }));
  }, []);

  const clearCanvas = useCallback(() => {
    setHistory(({ state, currentIndex }) => ({
      state: [...state, grid],
      currentIndex,
    }));
    setGrid(createEmptyGrid(gridSize));
  }, [grid, gridSize]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <ToolsSidebar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        gridSize={gridSize}
        setGridSize={setGridSize}
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
