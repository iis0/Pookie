export const DEFAULT_PALETTE = [
  "#a11212", "#e84040", "#ff8c00", "#ffd700",
  "#2ecc40", "#0074d9", "#7fdbff", "#b10dc9",
  "#f012be", "#806d6d", "#ffffff", "#080808",
  "#3d3d3d", "#6b4423", "#ff6b6b", "#48dbfb",
];

export const GRID_PRESETS = [8, 16, 32, 64] as const;

export const TOOLS = [
  { id: "pencil", label: "PEN", icon: "✏" },
  { id: "eraser", label: "ERA", icon: "◻" },
  { id: "fill", label: "FIL", icon: "▧" },
  { id: "picker", label: "PIK", icon: "◉" },
  { id: "line", label: "LIN", icon: "╱" },
  { id: "rect", label: "RCT", icon: "□" },
] as const;

export type ToolId = (typeof TOOLS)[number]["id"];

export const CANVAS_SIZE = 512;
