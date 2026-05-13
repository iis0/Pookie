"use client";

import { Button, SegmentControl } from "@/components/input";
import { TOOLS, GRID_PRESETS, type ToolId } from "../lib/consts";
import { GridSize } from "../lib/types";
import ToolSection from "@/components/layout/ToolSection";

interface ToolsSidebarProps {
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
  gridSize: GridSize;
  setGridSize: (size: GridSize) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
}

interface Action {
  onClick: () => void;
  label: string;
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
  const actionList: Action[] = [
    { onClick: onUndo, label: "undo" },
    { onClick: onRedo, label: "redo" },
    { onClick: onClear, label: "clear" },
    { onClick: onLoad, label: "load" },
    { onClick: onSave, label: "save" },
  ];
  return (
    <div className="w-[200px] shrink-0 border-r-thin border-red-faint p-4 flex flex-col overflow-y-auto gap-5">
      {/* Tool grid */}
      <ToolSection title="tools">
        <div className="grid grid-cols-2 gap-1.5">
          {TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <Button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                title={tool.label}
                buttonType="secondary"
                className={`flex flex-col items-center gap-1 py-2.5 px-1 ${
                  isActive
                    ? "bg-red text-black border-red"
                    : "bg-transparent text-soft-white border-red-faint"
                }`}
              >
                <span className="text-[18px] leading-none">{tool.icon}</span>
                <span className="text-[6px] tracking-[0.8px]">
                  {tool.label}
                </span>
              </Button>
            );
          })}
        </div>
      </ToolSection>

      {/* Grid Size */}
      <ToolSection title="grid">
        <SegmentControl<GridSize>
          options={GRID_PRESETS.map((size) => ({ label: size.toString(), value: size}))}
          setValue={(value) => setGridSize(value)}
          value={gridSize}
        />
      </ToolSection>

      {/* Toggle grid */}
      <Button
        onClick={() => setShowGrid(!showGrid)}
        buttonType="secondary"
        className={`mt-4 py-[7px] px-3 text-[10px] font-normal ${
          showGrid ? "bg-red-subtle disabled:bg-red-subtle" : "bg-transparent"
        }`}
      >
        {showGrid ? "GRID ON" : "GRID OFF"}
      </Button>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-2">
        {actionList.map((item, index) => (
          <Button
            key={index}
            onClick={item.onClick}
            buttonType="secondary"
            className="py-[7px] px-3 !text-[10px] font-normal"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
