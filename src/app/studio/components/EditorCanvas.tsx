"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type p5Type from "p5";
import { CANVAS_SIZE, type ToolId } from "../lib/consts";
import { Grid } from "../lib/types";
import { floodFill, bresenhamLine } from "../lib/utils";
import ExportDialog from "./ExportDialog";
import { Button } from "@/components/input";

interface EditorCanvasProps {
  grid: Grid;
  setGrid: React.Dispatch<React.SetStateAction<Grid>>;
  gridSize: number;
  activeColor: string;
  activeTool: ToolId;
  setActiveColor: (color: string) => void;
  showGrid: boolean;
  pushHistory: () => void;
}

export default function EditorCanvas({
  grid,
  setGrid,
  gridSize,
  activeColor,
  activeTool,
  setActiveColor,
  showGrid,
  pushHistory,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5Type | null>(null);
  const dragStart = useRef<{ row: number; col: number } | null>(null);
  const previewRef = useRef<[number, number][] | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Keep mutable refs in sync so the p5 draw loop reads current values
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const gridSizeRef = useRef(gridSize);
  gridSizeRef.current = gridSize;
  const activeColorRef = useRef(activeColor);
  activeColorRef.current = activeColor;
  const showGridRef = useRef(showGrid);
  showGridRef.current = showGrid;

  // Create p5 instance once
  useEffect(() => {
    let cancelled = false;

    const loadP5 = async () => {
      const p5 = (await import("p5")).default;
      if (cancelled) return;

      // Clear any existing children (safety)
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }

      const instance = new p5((p: p5Type) => {
        p.setup = () => {
          const cnv = p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
          cnv.parent(canvasRef.current!);
          cnv.style("display", "block");
          p.pixelDensity(1);
          p.noSmooth();
        };

        p.draw = () => {
          const currentGrid = gridRef.current;
          const currentGridSize = gridSizeRef.current;
          const currentActiveColor = activeColorRef.current;
          const currentShowGrid = showGridRef.current;
          const cs = CANVAS_SIZE / currentGridSize;

          p.background(8);

          // Draw pixels
          for (let r = 0; r < currentGridSize; r++) {
            for (let c = 0; c < currentGridSize; c++) {
              const color = currentGrid[r]?.[c];
              if (color) {
                p.noStroke();
                p.fill(color);
                p.rect(c * cs, r * cs, cs, cs);
              }
            }
          }

          // Draw preview (line/rect)
          const preview = previewRef.current;
          if (preview) {
            p.noStroke();
            p.fill(currentActiveColor + "88");
            for (const [pr, pc] of preview) {
              p.rect(pc * cs, pr * cs, cs, cs);
            }
          }

          // Grid lines
          if (currentShowGrid) {
            p.stroke(128, 109, 109, 70);
            // p.stroke(161, 18, 18, 40);
            p.strokeWeight(0.5);
            for (let i = 0; i <= currentGridSize; i++) {
              p.line(i * cs, 0, i * cs, CANVAS_SIZE);
              p.line(0, i * cs, CANVAS_SIZE, i * cs);
            }
          }

          // Canvas border
          p.noFill();
          p.stroke(161, 18, 18, 128);
          p.strokeWeight(1);
          p.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        };
      }, canvasRef.current!);

      p5Ref.current = instance;
    };

    loadP5();

    return () => {
      cancelled = true;
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
    };
  }, []); // Only run once on mount

  // Cell from mouse event
  const getCellFromEvent = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current?.querySelector("canvas");
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cs = CANVAS_SIZE / gridSize;
      const col = Math.floor(x / cs);
      const row = Math.floor(y / cs);
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null;
      return { row, col };
    },
    [gridSize],
  );

  const applyTool = useCallback(
    (row: number, col: number) => {
      setGrid((prev) => {
        const copy = prev.map((r) => [...r]);
        if (activeTool === "pencil") {
          copy[row][col] = activeColor;
        } else if (activeTool === "eraser") {
          copy[row][col] = null;
        } else if (activeTool === "fill") {
          return floodFill(prev, gridSize, gridSize, row, col, activeColor);
        } else if (activeTool === "picker") {
          const picked = prev[row][col];
          if (picked) setActiveColor(picked);
          return prev;
        }
        return copy;
      });
    },
    [activeTool, activeColor, gridSize, setGrid, setActiveColor],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const cell = getCellFromEvent(e);
      if (!cell) return;
      pushHistory();
      if (activeTool === "line" || activeTool === "rect") {
        dragStart.current = cell;
      } else {
        applyTool(cell.row, cell.col);
      }
    },
    [getCellFromEvent, applyTool, pushHistory, activeTool],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!(e.buttons & 1)) return;
      const cell = getCellFromEvent(e);
      if (!cell) return;

      if (activeTool === "line" && dragStart.current) {
        previewRef.current = bresenhamLine(
          dragStart.current.row,
          dragStart.current.col,
          cell.row,
          cell.col,
        );
      } else if (activeTool === "rect" && dragStart.current) {
        const pts: [number, number][] = [];
        const r0 = Math.min(dragStart.current.row, cell.row);
        const r1 = Math.max(dragStart.current.row, cell.row);
        const c0 = Math.min(dragStart.current.col, cell.col);
        const c1 = Math.max(dragStart.current.col, cell.col);
        for (let r = r0; r <= r1; r++)
          for (let c = c0; c <= c1; c++)
            if (r === r0 || r === r1 || c === c0 || c === c1) pts.push([r, c]);
        previewRef.current = pts;
      } else if (activeTool === "pencil" || activeTool === "eraser") {
        applyTool(cell.row, cell.col);
      }
    },
    [getCellFromEvent, applyTool, activeTool],
  );

  const handleMouseUp = () => {
    const preview = previewRef.current;
    if (preview && dragStart.current) {
      setGrid((prev) => {
        const copy = prev.map((r) => [...r]);
        for (const [pr, pc] of preview) {
          copy[pr][pc] = activeColor;
        }
        return copy;
      });
    }
    dragStart.current = null;
    previewRef.current = null;
  };

  const exportPNG = (filename: string, targetRes: number) => {
    const scale =
      targetRes > 0 ? Math.max(1, Math.floor(targetRes / gridSize)) : 1;
    const size = gridSize * scale;

    const expCanvas = document.createElement("canvas");
    expCanvas.width = size;
    expCanvas.height = size;
    const ctx = expCanvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    // ctx.fillStyle = "#080808";
    // ctx.fillRect(0, 0, size, size);

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c]!;
          ctx.fillRect(c * scale, r * scale, scale, scale);
        }
      }
    }

    const safeName =
      filename.trim().replace(/[\\/]/g, "-") ||
      `pookie-pixel-${gridSize}x${gridSize}`;
    const link = document.createElement("a");
    link.download = `${safeName}.png`;
    link.href = expCanvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col items-center py-5 px-6 min-w-0">
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-4 w-full max-w-[512px] justify-between">
        <span className="font-body text-[12px] text-soft-white-muted tracking-[0.4px]">
          {gridSize}&times;{gridSize}px
        </span>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-[512px] h-[512px] cursor-crosshair shrink-0"
        style={{ imageRendering: "pixelated" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Export */}
      <div className="mt-4 flex gap-3">
        <Button onClick={() => setExportOpen(true)} className="font-medium">
          EXPORT PNG
        </Button>
      </div>

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={exportPNG}
        grid={grid}
        gridSize={gridSize}
      />
    </div>
  );
}
