"use client";

import { useState, useEffect, useCallback } from "react";
import { type ToolId } from "../lib/consts";
import { type Grid, createEmptyGrid } from "../lib/utils";
import ToolsSidebar from "./ToolsSidebar";
import PaletteSidebar from "./PaletteSidebar";
import EditorCanvas from "./EditorCanvas";
import KatakanaDivider from "@/components/layout/KatakanaDivider";

export default function PixelEditor() {
  const [gridSize, setGridSize] = useState(16);
  const [activeTool, setActiveTool] = useState<ToolId>("pencil");
  const [activeColor, setActiveColor] = useState("#a11212");
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(16));
  const [history, setHistory] = useState<Grid[]>([]);
  const [showGrid, setShowGrid] = useState(true);

  // Reset grid on size change
  useEffect(() => {
    setGrid(createEmptyGrid(gridSize));
    setHistory([]);
  }, [gridSize]);

  const pushHistory = useCallback(() => {
    setHistory((h) => [...h, grid]);
  }, [grid]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    setGrid(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  }, [history]);

  const clearCanvas = useCallback(() => {
    setHistory((h) => [...h, grid]);
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
        historyLength={history.length}
      />
    </div>
  );
}
