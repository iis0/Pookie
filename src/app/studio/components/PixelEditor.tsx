"use client";

import { useState, useCallback, useMemo } from "react";
import { type ToolId } from "../lib/consts";
import { Grid, SaveData, HistoryStore, GridSize } from "../lib/types";
import { createEmptyGrid } from "../lib/utils";
import ToolsSidebar from "./ToolsSidebar";
import PaletteSidebar from "./PaletteSidebar";
import EditorCanvas from "./EditorCanvas";

export default function PixelEditor() {
  const [gridSize, setGridSize] = useState<GridSize>(16);
  const [activeTool, setActiveTool] = useState<ToolId>("pencil");
  const [activeColor, setActiveColor] = useState("#a11212");
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(16));

  const [history, setHistory] = useState<HistoryStore>({
    state: [],
    currentIndex: 0,
  });
  const [showGrid, setShowGrid] = useState(true);

  const isMissingLatestState = useMemo(() => {
    const { state, currentIndex } = history;
    return (
      state.length === currentIndex + 1 && grid !== state[state.length - 1]
    );
  }, [history, grid]);

  const handleGridSizeChange = useCallback((newSize: GridSize) => {
    setGridSize(newSize);
    setGrid(createEmptyGrid(newSize));
    setHistory({ state: [], currentIndex: 0 });
  }, []);

  const pushHistory = () => {
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
    let newIndex = currentIndex - 1;
    let newState: Grid[] = [];

    if (state.length === 0) return;
    // currentIndex is offset by one (initial blank state added to history)
    if (isMissingLatestState) {
      newState = [...state, grid];
      newIndex += 1;
    } else {
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

  const save = () => {
    const saveState = isMissingLatestState ? [...history.state, grid] : history.state;
    const saveCurrentIndex = isMissingLatestState ? history.currentIndex + 1 : history.currentIndex;
    const saveData: SaveData = {
      history: {
        ...history,
        state: saveState,
        currentIndex: saveCurrentIndex,
      },
      gridSize,
    };

    const jsonData = JSON.stringify(saveData);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.download = "save.json";
    link.href = url;
    link.click();
  };

  const load = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "application/json";
    input.style.display = "none";

    input.onchange = (event) => {
      console.log("-- Start");
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      console.log("-- File loaded");

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const parsed = JSON.parse(result) as SaveData;
          const { currentIndex } = parsed.history;

          setHistory(parsed.history);
          setGrid(parsed.history.state[currentIndex]);
          setGridSize(parsed.gridSize ?? gridSize);
        } catch (err) {
          console.error("Failed to load file: ", err);
        }
      };

      reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
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
        onSave={save}
        onLoad={load}
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
