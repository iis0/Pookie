/* eslint-disable @next/next/no-page-custom-font */
import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   Pookieverse Pixel Art Editor  —  p5.js + React
   Design system: dark retro / pixel-art / cyberpunk-lite
   ───────────────────────────────────────────── */

// ── Design Tokens ──
const T = {
  black: "#080808",
  red: "#a11212",
  redFaint: "rgba(161, 18, 18, 0.50)",
  redSubtle: "rgba(161, 18, 18, 0.20)",
  softWhite: "#806d6d",
  softWhiteMuted: "rgba(128, 109, 109, 0.60)",
  fontDisplay: "'Press Start 2P', monospace",
  border: "0.5px solid rgba(161, 18, 18, 0.50)",
};

// ── Katakana characters for decorative divider ──
const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

// ── Default palette ──
const DEFAULT_PALETTE = [
  "#a11212", "#e84040", "#ff8c00", "#ffd700",
  "#2ecc40", "#0074d9", "#7fdbff", "#b10dc9",
  "#f012be", "#806d6d", "#ffffff", "#080808",
  "#3d3d3d", "#6b4423", "#ff6b6b", "#48dbfb",
];

const GRID_PRESETS = [8, 16, 32, 64];
const TOOLS = [
  { id: "pencil", label: "PEN", icon: "✏" },
  { id: "eraser", label: "ERA", icon: "◻" },
  { id: "fill",   label: "FIL", icon: "▧" },
  { id: "picker", label: "PIK", icon: "◉" },
  { id: "line",   label: "LIN", icon: "╱" },
  { id: "rect",   label: "RCT", icon: "□" },
];

// ── Flood fill helper ──
function floodFill(grid, rows, cols, sr, sc, newColor) {
  const oldColor = grid[sr][sc];
  if (oldColor === newColor) return grid;
  const copy = grid.map((r) => [...r]);
  const stack = [[sr, sc]];
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (copy[r][c] !== oldColor) continue;
    copy[r][c] = newColor;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }
  return copy;
}

// ── Bresenham line ──
function bresenhamLine(x0, y0, x1, y1) {
  const pts = [];
  let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    pts.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
  return pts;
}

export default function PixelEditor() {
  const canvasRef = useRef(null);
  const p5Ref = useRef(null);
  const [gridSize, setGridSize] = useState(16);
  const [activeTool, setActiveTool] = useState("pencil");
  const [activeColor, setActiveColor] = useState("#a11212");
  const [grid, setGrid] = useState(() =>
    Array.from({ length: 16 }, () => Array(16).fill(null))
  );
  const [history, setHistory] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [katakanaOffset, setKatakanaOffset] = useState(0);

  // For line/rect preview
  const dragStart = useRef(null);
  const [preview, setPreview] = useState(null);

  // ── Katakana scroll animation ──
  useEffect(() => {
    const id = setInterval(() => setKatakanaOffset((o) => o + 0.5), 50);
    return () => clearInterval(id);
  }, []);

  // ── Reset grid on size change ──
  useEffect(() => {
    const newGrid = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(null)
    );
    setGrid(newGrid);
    setHistory([]);
  }, [gridSize]);

  // ── p5 sketch ──
  useEffect(() => {
    let p5Instance;
    const loadP5 = async () => {
      const p5 = (await import("https://cdn.jsdelivr.net/npm/p5@1.9.4/+esm")).default;
      if (p5Ref.current) p5Ref.current.remove();

      p5Instance = new p5((p) => {
        const CANVAS_SIZE = 512;
        const cellSize = () => CANVAS_SIZE / gridSize;

        p.setup = () => {
          const cnv = p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
          cnv.parent(canvasRef.current);
          cnv.style("display", "block");
          p.pixelDensity(1);
          p.noSmooth();
        };

        p.draw = () => {
          const cs = cellSize();
          // background
          p.background(8);

          // draw pixels
          for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
              const color = grid[r]?.[c];
              if (color) {
                p.noStroke();
                p.fill(color);
                p.rect(c * cs, r * cs, cs, cs);
              }
            }
          }

          // draw preview (line/rect)
          if (preview) {
            p.noStroke();
            p.fill(activeColor + "88");
            for (const [pr, pc] of preview) {
              p.rect(pc * cs, pr * cs, cs, cs);
            }
          }

          // grid lines
          if (showGrid) {
            p.stroke(161, 18, 18, 40);
            p.strokeWeight(0.5);
            for (let i = 0; i <= gridSize; i++) {
              p.line(i * cs, 0, i * cs, CANVAS_SIZE);
              p.line(0, i * cs, CANVAS_SIZE, i * cs);
            }
          }

          // canvas border
          p.noFill();
          p.stroke(161, 18, 18, 128);
          p.strokeWeight(1);
          p.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        };
      }, canvasRef.current);

      p5Ref.current = p5Instance;
    };

    loadP5();
    return () => { if (p5Ref.current) p5Ref.current.remove(); };
  }, [gridSize, grid, showGrid, activeColor, preview]);

  // ── Grid interaction ──
  const getCellFromEvent = useCallback(
    (e) => {
      const rect = canvasRef.current?.querySelector("canvas")?.getBoundingClientRect();
      if (!rect) return null;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cs = 512 / gridSize;
      const col = Math.floor(x / cs);
      const row = Math.floor(y / cs);
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null;
      return { row, col };
    },
    [gridSize]
  );

  const applyTool = useCallback(
    (row, col) => {
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
    [activeTool, activeColor, gridSize]
  );

  const handleMouseDown = useCallback(
    (e) => {
      const cell = getCellFromEvent(e);
      if (!cell) return;
      setHistory((h) => [...h, grid]);
      if (activeTool === "line" || activeTool === "rect") {
        dragStart.current = cell;
      } else {
        applyTool(cell.row, cell.col);
      }
    },
    [getCellFromEvent, applyTool, grid, activeTool]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!(e.buttons & 1)) return;
      const cell = getCellFromEvent(e);
      if (!cell) return;
      if (activeTool === "line" && dragStart.current) {
        const pts = bresenhamLine(dragStart.current.row, dragStart.current.col, cell.row, cell.col);
        setPreview(pts);
      } else if (activeTool === "rect" && dragStart.current) {
        const pts = [];
        const r0 = Math.min(dragStart.current.row, cell.row);
        const r1 = Math.max(dragStart.current.row, cell.row);
        const c0 = Math.min(dragStart.current.col, cell.col);
        const c1 = Math.max(dragStart.current.col, cell.col);
        for (let r = r0; r <= r1; r++)
          for (let c = c0; c <= c1; c++)
            if (r === r0 || r === r1 || c === c0 || c === c1) pts.push([r, c]);
        setPreview(pts);
      } else if (activeTool === "pencil" || activeTool === "eraser") {
        applyTool(cell.row, cell.col);
      }
    },
    [getCellFromEvent, applyTool, activeTool]
  );

  const handleMouseUp = useCallback(
    () => {
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
      setPreview(null);
    },
    [preview, activeColor]
  );

  const undo = () => {
    if (history.length === 0) return;
    setGrid(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const clearCanvas = () => {
    setHistory((h) => [...h, grid]);
    setGrid(Array.from({ length: gridSize }, () => Array(gridSize).fill(null)));
  };

  const exportPNG = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    // Create a clean export canvas without grid
    const expCanvas = document.createElement("canvas");
    expCanvas.width = gridSize;
    expCanvas.height = gridSize;
    const ctx = expCanvas.getContext("2d");
    ctx.fillStyle = T.black;
    ctx.fillRect(0, 0, gridSize, gridSize);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c];
          ctx.fillRect(c, r, 1, 1);
        }
      }
    }
    const link = document.createElement("a");
    link.download = `pookie-pixel-${gridSize}x${gridSize}.png`;
    link.href = expCanvas.toDataURL();
    link.click();
  };

  // ── Katakana column content ──
  const katakanaChars = KATAKANA.repeat(4).split("");

  return (
    <div style={styles.page}>
      {/* ── Google Font ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      {/* ── Nav ── */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>POOKIE</div>
        <div style={styles.navCenter}>
          {["Editor", "Gallery", "About"].map((item, i) => (
            <span
              key={item}
              style={{
                ...styles.navLink,
                color: i === 0 ? T.softWhite : T.softWhiteMuted,
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <div style={styles.navRight}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={T.softWhite} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.2" fill={T.softWhite} stroke="none" />
          </svg>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div style={styles.main}>
        {/* ── Left Sidebar: Tools ── */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>TOOLS</h2>
          <div style={styles.toolGrid}>
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                style={{
                  ...styles.toolBtn,
                  background: activeTool === tool.id ? T.red : "transparent",
                  color: activeTool === tool.id ? T.black : T.softWhite,
                  borderColor: activeTool === tool.id ? T.red : T.redFaint,
                }}
                title={tool.label}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{tool.icon}</span>
                <span style={styles.toolLabel}>{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Grid Size */}
          <h2 style={{ ...styles.sidebarTitle, marginTop: 24 }}>GRID</h2>
          <div style={styles.gridPresets}>
            {GRID_PRESETS.map((size) => (
              <button
                key={size}
                onClick={() => setGridSize(size)}
                style={{
                  ...styles.presetBtn,
                  background: gridSize === size ? T.red : "transparent",
                  color: gridSize === size ? T.black : T.softWhite,
                  borderColor: gridSize === size ? T.red : T.redFaint,
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Toggle grid */}
          <button
            onClick={() => setShowGrid((g) => !g)}
            style={{
              ...styles.actionBtn,
              marginTop: 16,
              background: showGrid ? T.redSubtle : "transparent",
            }}
          >
            {showGrid ? "GRID ON" : "GRID OFF"}
          </button>

          {/* Actions */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={undo} style={styles.actionBtn}>
              UNDO
            </button>
            <button onClick={clearCanvas} style={styles.actionBtn}>
              CLEAR
            </button>
          </div>
        </div>

        {/* ── Katakana Divider ── */}
        <div style={styles.katakanaDivider}>
          <div
            style={{
              ...styles.katakanaInner,
              transform: `translateY(-${katakanaOffset % 600}px)`,
            }}
          >
            {katakanaChars.map((ch, i) => (
              <span key={i} style={styles.katakanaChar}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* ── Canvas Area ── */}
        <div style={styles.canvasArea}>
          <div style={styles.canvasHeader}>
            <h1 style={styles.heading}>PIXEL EDITOR</h1>
            <span style={styles.canvasInfo}>
              {gridSize}×{gridSize}px
            </span>
          </div>
          <div
            ref={canvasRef}
            style={styles.canvasWrap}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div style={styles.canvasFooterActions}>
            <button onClick={exportPNG} style={styles.ctaBtn}>
              EXPORT PNG
            </button>
          </div>
        </div>

        {/* ── Katakana Divider ── */}
        <div style={styles.katakanaDivider}>
          <div
            style={{
              ...styles.katakanaInner,
              transform: `translateY(-${(katakanaOffset + 200) % 600}px)`,
            }}
          >
            {katakanaChars.map((ch, i) => (
              <span key={i} style={styles.katakanaChar}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right Sidebar: Palette ── */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>COLOR</h2>
          {/* Active color preview */}
          <div style={styles.activeColorWrap}>
            <div
              style={{
                ...styles.activeColor,
                background: activeColor,
              }}
            />
            <span style={styles.activeColorHex}>{activeColor.toUpperCase()}</span>
          </div>

          {/* Palette grid */}
          <div style={styles.paletteGrid}>
            {DEFAULT_PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setActiveColor(color);
                  if (activeTool === "picker") setActiveTool("pencil");
                }}
                style={{
                  ...styles.paletteBtn,
                  background: color,
                  outline:
                    activeColor === color
                      ? `2px solid ${T.red}`
                      : "1px solid rgba(161,18,18,0.3)",
                  outlineOffset: activeColor === color ? 2 : 0,
                }}
              />
            ))}
          </div>

          {/* Custom color input */}
          <h2 style={{ ...styles.sidebarTitle, marginTop: 24 }}>CUSTOM</h2>
          <div style={styles.customColorRow}>
            <input
              type="color"
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              style={styles.colorInput}
            />
            <input
              type="text"
              value={activeColor}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))
                  setActiveColor(e.target.value);
              }}
              style={styles.hexInput}
              maxLength={7}
            />
          </div>

          {/* Layer info / decorative */}
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>TOOL</span>
            <span style={styles.infoValue}>{activeTool.toUpperCase()}</span>
          </div>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>HISTORY</span>
            <span style={styles.infoValue}>{history.length} STEPS</span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>© 2026 iis0</span>
        <div style={styles.footerLinks}>
          {["Gallery", "Shop", "Contact"].map((l) => (
            <span key={l} style={styles.footerLink}>
              {l}
            </span>
          ))}
        </div>
        <div style={{ opacity: 0.55 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.softWhite} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.2" fill={T.softWhite} stroke="none" />
          </svg>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Styles — Pookieverse Design System
   ═══════════════════════════════════════════ */

const styles = {
  page: {
    background: T.black,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: T.fontDisplay,
    color: T.softWhite,
    overflow: "hidden",
  },

  /* ── Nav ── */
  nav: {
    height: 57,
    padding: "0 40px",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    borderBottom: T.border,
  },
  navLogo: {
    fontFamily: T.fontDisplay,
    fontSize: 14,
    color: T.red,
    letterSpacing: 2,
  },
  navCenter: {
    display: "flex",
    gap: 20,
  },
  navLink: {
    fontFamily: T.fontDisplay,
    fontSize: 10,
    letterSpacing: 0.56,
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  navRight: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  /* ── Main Layout ── */
  main: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },

  /* ── Sidebars ── */
  sidebar: {
    width: 200,
    padding: "20px 16px",
    borderRight: T.border,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    overflowY: "auto",
  },
  sidebarTitle: {
    fontFamily: T.fontDisplay,
    fontSize: 8,
    color: T.red,
    letterSpacing: 1.5,
    marginBottom: 12,
    textTransform: "uppercase",
  },

  /* ── Tools ── */
  toolGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
  },
  toolBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "10px 4px",
    border: "0.5px solid",
    borderRadius: 0,
    cursor: "pointer",
    fontFamily: T.fontDisplay,
    transition: "all 0.15s ease",
    background: "transparent",
  },
  toolLabel: {
    fontSize: 6,
    letterSpacing: 0.8,
  },

  /* ── Grid presets ── */
  gridPresets: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
  },
  presetBtn: {
    padding: "6px 0",
    border: "0.5px solid",
    borderRadius: 0,
    fontFamily: T.fontDisplay,
    fontSize: 8,
    cursor: "pointer",
    transition: "all 0.15s ease",
    textAlign: "center",
  },

  /* ── Action buttons ── */
  actionBtn: {
    padding: "7px 12px",
    border: T.border,
    borderRadius: 0,
    fontFamily: T.fontDisplay,
    fontSize: 7,
    color: T.softWhite,
    background: "transparent",
    cursor: "pointer",
    letterSpacing: 0.72,
    transition: "all 0.15s ease",
    textAlign: "center",
  },

  /* ── Katakana Divider ── */
  katakanaDivider: {
    width: 32,
    borderLeft: T.border,
    borderRight: T.border,
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  },
  katakanaInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    paddingTop: 15,
    transition: "transform 0.05s linear",
  },
  katakanaChar: {
    fontSize: 14,
    color: T.redSubtle,
    lineHeight: 1,
    userSelect: "none",
  },

  /* ── Canvas Area ── */
  canvasArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 24px",
    minWidth: 0,
  },
  canvasHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 16,
    marginBottom: 16,
    width: "100%",
    maxWidth: 512,
    justifyContent: "space-between",
  },
  heading: {
    fontFamily: T.fontDisplay,
    fontSize: 14,
    color: T.red,
    letterSpacing: 1.84,
    margin: 0,
  },
  canvasInfo: {
    fontFamily: T.fontDisplay,
    fontSize: 8,
    color: T.softWhiteMuted,
    letterSpacing: 0.4,
  },
  canvasWrap: {
    width: 512,
    height: 512,
    cursor: "crosshair",
    imageRendering: "pixelated",
    flexShrink: 0,
  },
  canvasFooterActions: {
    marginTop: 16,
    display: "flex",
    gap: 12,
  },

  /* ── CTA Button ── */
  ctaBtn: {
    fontFamily: T.fontDisplay,
    fontSize: 10,
    letterSpacing: 0.72,
    padding: "7px 20px",
    background: T.red,
    color: T.black,
    border: "none",
    borderRadius: 0,
    cursor: "pointer",
    transition: "filter 0.15s ease",
  },

  /* ── Palette ── */
  activeColorWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  activeColor: {
    width: 32,
    height: 32,
    border: `1px solid ${T.redFaint}`,
    flexShrink: 0,
  },
  activeColorHex: {
    fontFamily: T.fontDisplay,
    fontSize: 7,
    color: T.softWhiteMuted,
    letterSpacing: 0.5,
  },
  paletteGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 4,
  },
  paletteBtn: {
    width: "100%",
    aspectRatio: "1",
    border: "none",
    borderRadius: 0,
    cursor: "pointer",
    transition: "transform 0.1s ease",
  },

  /* ── Custom color ── */
  customColorRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  colorInput: {
    width: 32,
    height: 32,
    padding: 0,
    border: `1px solid ${T.redFaint}`,
    borderRadius: 0,
    background: "transparent",
    cursor: "pointer",
  },
  hexInput: {
    flex: 1,
    fontFamily: T.fontDisplay,
    fontSize: 8,
    color: T.softWhite,
    background: "transparent",
    border: T.border,
    borderRadius: 0,
    padding: "6px 8px",
    letterSpacing: 0.5,
    outline: "none",
  },

  /* ── Info blocks ── */
  infoBlock: {
    marginTop: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: T.border,
  },
  infoLabel: {
    fontSize: 6,
    color: T.softWhiteMuted,
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 7,
    color: T.softWhite,
    letterSpacing: 0.5,
  },

  /* ── Footer ── */
  footer: {
    borderTop: T.border,
    padding: "18px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    fontFamily: T.fontDisplay,
    fontSize: 10,
    letterSpacing: 0.4,
    color: T.softWhiteMuted,
  },
  footerLinks: {
    display: "flex",
    gap: 24,
  },
  footerLink: {
    fontFamily: T.fontDisplay,
    fontSize: 10,
    letterSpacing: 0.4,
    color: T.softWhiteMuted,
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
};
