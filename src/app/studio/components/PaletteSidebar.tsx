"use client";

import { DEFAULT_PALETTE, type ToolId } from "../lib/consts";

interface PaletteSidebarProps {
  activeColor: string;
  setActiveColor: (color: string) => void;
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;
  historyLength: number;
}

export default function PaletteSidebar({
  activeColor,
  setActiveColor,
  activeTool,
  setActiveTool,
  historyLength,
}: PaletteSidebarProps) {
  return (
    <div className="w-[200px] shrink-0 border-l-thin border-red-faint p-4 flex flex-col overflow-y-auto">
      <h2 className="font-display text-[8px] text-red tracking-[1.5px] uppercase mb-3">
        Color
      </h2>

      {/* Active color preview */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 shrink-0 border-1 border-red-faint"
          style={{ background: activeColor }}
        />
        <span className="font-body text-[11px] text-soft-white-muted tracking-[0.5px]">
          {activeColor.toUpperCase()}
        </span>
      </div>

      {/* Palette grid */}
      <div className="grid grid-cols-4 gap-1">
        {DEFAULT_PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => {
              setActiveColor(color);
              if (activeTool === "picker") setActiveTool("pencil");
            }}
            className="w-full aspect-square cursor-pointer transition-transform duration-100"
            style={{
              background: color,
              outline:
                activeColor === color
                  ? "2px solid var(--red)"
                  : "1px solid rgba(161,18,18,0.3)",
              outlineOffset: activeColor === color ? 2 : 0,
            }}
          />
        ))}
      </div>

      {/* Custom color */}
      <h2 className="font-display text-[8px] text-red tracking-[1.5px] uppercase mb-3 mt-6">
        Custom
      </h2>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={activeColor}
          onChange={(e) => setActiveColor(e.target.value)}
          className="w-8 h-8 p-0 border-1 border-red-faint bg-transparent cursor-pointer"
        />
        <input
          type="text"
          value={activeColor}
          onChange={(e) => {
            if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))
              setActiveColor(e.target.value);
          }}
          maxLength={7}
          className="flex-1 font-body text-[11px] text-soft-white bg-transparent border-1 border-red-faint py-1.5 px-2 tracking-[0.5px] outline-none"
        />
      </div>

      {/* Info blocks */}
      <div className="mt-4 flex justify-between items-center py-1.5 border-b-thin border-red-faint">
        <span className="font-body text-[10px] text-soft-white-muted tracking-[0.8px]">
          TOOL
        </span>
        <span className="font-body text-[11px] text-soft-white tracking-[0.5px]">
          {activeTool.toUpperCase()}
        </span>
      </div>
      <div className="mt-4 flex justify-between items-center py-1.5 border-b-thin border-red-faint">
        <span className="font-body text-[10px] text-soft-white-muted tracking-[0.8px]">
          HISTORY
        </span>
        <span className="font-body text-[11px] text-soft-white tracking-[0.5px]">
          {historyLength} STEPS
        </span>
      </div>
    </div>
  );
}
