"use client";

import { useEffect, useRef, useState } from "react";
import { Grid } from '../lib/types'

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (filename: string, targetRes: number) => void;
  grid: Grid;
  gridSize: number;
}

const PRESETS = [
  { id: "1x", label: "1:1", res: 0 },
  { id: "2k", label: "2K", res: 2048 },
  { id: "4k", label: "4K", res: 4096 },
] as const;

type PresetId = (typeof PRESETS)[number]["id"];

const PREVIEW_SIZE = 256;

export default function ExportDialog({
  open,
  onClose,
  onExport,
  grid,
  gridSize,
}: ExportDialogProps) {
  const [filename, setFilename] = useState(`pookie-${gridSize}x${gridSize}`);
  const [presetId, setPresetId] = useState<PresetId>("2k");
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setFilename(`pookie-${gridSize}x${gridSize}`);
  }, [gridSize]);

  useEffect(() => {
    if (!open || !previewRef.current) return;
    const cnv = previewRef.current;
    const ctx = cnv.getContext("2d");
    if (!ctx) return;
    cnv.width = PREVIEW_SIZE;
    cnv.height = PREVIEW_SIZE;
    ctx.imageSmoothingEnabled = false;
    const cs = PREVIEW_SIZE / gridSize;
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const color = grid[r]?.[c];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c * cs, r * cs, cs, cs);
        }
      }
    }
  }, [open, grid, gridSize]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const preset = PRESETS.find((p) => p.id === presetId)!;
  const finalSize =
    preset.res === 0
      ? gridSize
      : gridSize * Math.max(1, Math.floor(preset.res / gridSize));

  const handleExport = () => {
    onExport(filename, preset.res);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-black border border-red-faint p-6 w-[480px] flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
      >
        <h2
          id="export-dialog-title"
          className="font-display text-[14px] text-red tracking-[1.84px]"
        >
          EXPORT PNG
        </h2>

        <div className="flex justify-center">
          <canvas
            ref={previewRef}
            className="w-[256px] h-[256px] border border-red-subtle"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-body text-[12px] text-soft-white-muted tracking-[0.4px]">
            FILENAME
          </span>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleExport();
            }}
            className="bg-black border border-red-subtle px-3 py-2 font-body text-[14px] text-soft-white outline-none focus:border-red"
          />
        </label>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-body text-[12px] text-soft-white-muted tracking-[0.4px]">
              SIZE
            </span>
            <span className="font-body text-[12px] text-soft-white-muted tracking-[0.4px]">
              {finalSize}&times;{finalSize}px
            </span>
          </div>
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPresetId(p.id)}
                className={`flex-1 font-body text-[12px] tracking-[0.4px] py-2 border cursor-pointer transition-colors ${
                  presetId === p.id
                    ? "bg-red text-black border-red"
                    : "bg-transparent text-soft-white border-red-subtle hover:border-red"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="font-body text-[14px] tracking-[0.72px] py-[7px] px-5 bg-transparent text-soft-white border border-red-subtle cursor-pointer hover:border-red"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="font-body text-[14px] font-medium tracking-[0.72px] py-[7px] px-5 bg-red text-black border-none cursor-pointer transition-[filter] duration-150 hover:brightness-[1.15]"
          >
            EXPORT
          </button>
        </div>
      </div>
    </div>
  );
}
