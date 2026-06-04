"use client";

import { InfoRow, TextInput } from "@/components/element";
import { DEFAULT_PALETTE, type ToolId } from "../lib/consts";
import ToolSection from "@/components/layout/ToolSection";
import { Swatch } from "@/components/element/colour";

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
    <div className="w-[200px] shrink-0 border-l-thin border-red-faint p-4 flex flex-col gap-5 overflow-y-auto">
      <ToolSection title="colour">
        {/* Active color preview */}

        <Swatch colour={activeColor} showLabel />

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
      </ToolSection>

      {/* Custom color */}
      <ToolSection title="custom" className="mb-3 mt-6">
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={activeColor}
            onChange={(e) => setActiveColor(e.target.value)}
            className="w-8 h-8 p-0 border-1 border-red-faint bg-transparent cursor-pointer"
          />
          <TextInput
            value={activeColor}
            onChange={(e) => {
              if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))
                setActiveColor(e.target.value);
            }}
            maxLength={7}
          />
        </div>
      </ToolSection>

      {/* Info blocks */}
      <div>
        <InfoRow label="tool" value={activeTool} />
        <InfoRow
          label="history"
          value={`${historyLength} STEPS`}
          className="mt-2"
        />
      </div>
    </div>
  );
}
