"use client";

import { TOOLS, GRID_PRESETS, type ToolId } from "../lib/consts";

interface ToolsSidebarProps {
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export default function ToolsSidebar({
  activeTool,
  setActiveTool,
  gridSize,
  setGridSize,
  showGrid,
  setShowGrid,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onLoad,
}: ToolsSidebarProps) {
  return (
    <div className="w-[200px] shrink-0 border-r-thin border-red-faint p-4 flex flex-col overflow-y-auto">
      <h2 className="font-display text-[8px] text-red tracking-[1.5px] uppercase mb-3">
        Tools
      </h2>

      {/* Tool grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 border-thin font-body cursor-pointer transition-all duration-150 ${
                isActive
                  ? "bg-red text-black border-red"
                  : "bg-transparent text-soft-white border-red-faint"
              }`}
            >
              <span className="text-[18px] leading-none">{tool.icon}</span>
              <span className="text-[6px] tracking-[0.8px]">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid size */}
      <h2 className="font-display text-[8px] text-red tracking-[1.5px] uppercase mb-3 mt-6">
        Grid
      </h2>
      <div className="grid grid-cols-2 gap-1.5">
        {GRID_PRESETS.map((size) => {
          const isActive = gridSize === size;
          return (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={`py-1.5 border-thin font-body text-[10px] cursor-pointer transition-all duration-150 text-center ${
                isActive
                  ? "bg-red text-black border-red"
                  : "bg-transparent text-soft-white border-red-faint"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Toggle grid */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`mt-4 py-[7px] px-3 border-thin border-red-faint font-body text-[10px] text-soft-white cursor-pointer tracking-[0.72px] transition-all duration-150 text-center ${
          showGrid ? "bg-red-subtle" : "bg-transparent"
        }`}
      >
        {showGrid ? "GRID ON" : "GRID OFF"}
      </button>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-2">
        <button
          onClick={onUndo}
          className="py-[7px] px-3 border-thin border-red-faint font-body text-[10px] text-soft-white bg-transparent cursor-pointer tracking-[0.72px] transition-all duration-150 text-center"
        >
          UNDO
        </button>
        <button
          onClick={onRedo}
          className="py-[7px] px-3 border-thin border-red-faint font-body text-[10px] text-soft-white bg-transparent cursor-pointer tracking-[0.72px] transition-all duration-150 text-center"
        >
          REDO
        </button>
        <button
          onClick={onClear}
          className="py-[7px] px-3 border-thin border-red-faint font-body text-[10px] text-soft-white bg-transparent cursor-pointer tracking-[0.72px] transition-all duration-150 text-center"
        >
          CLEAR
        </button>
        <button
          onClick={onLoad}
          className="py-[7px] px-3 border-thin border-red-faint font-body text-[10px] text-soft-white bg-transparent cursor-pointer tracking-[0.72px] transition-all duration-150 text-center"
        >
          LOAD
        </button>
        <button
          onClick={onSave}
          className="py-[7px] px-3 border-thin border-red-faint font-body text-[10px] text-soft-white bg-transparent cursor-pointer tracking-[0.72px] transition-all duration-150 text-center"
        >
          SAVE
        </button>
      </div>
    </div>
  );
}
