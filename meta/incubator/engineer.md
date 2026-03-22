# Pookieverse — Engineering Guide

> Technical blueprint for building the Pookie site.
> Design reference: [Figma — Home Chosen](https://www.figma.com/design/9o7Ir9wghTvX24WJIPduZi/Portfolio-New?node-id=2060-1193)
> Design tokens & visual spec: see `design-system.md`

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | Next.js (App Router)              |
| Language       | TypeScript                        |
| Styling        | Tailwind CSS v4                   |
| UI Primitives  | shadcn/ui + Radix UI              |
| State          | Zustand                           |
| HTTP Client    | Axios (wrapped in custom client)  |
| Fonts          | Google Fonts + self-hosted        |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, providers, metadata)
│   ├── page.tsx                # Home page (/)
│   ├── gallery/
│   │   └── page.tsx
│   ├── shop/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
│
├── components/
│   ├── ui/                     # shadcn/ui primitives (Button, etc.)
│   ├── layout/
│   │   ├── Navbar.tsx          # Top nav — logo, links, social
│   │   ├── KatakanaDivider.tsx # Animated vertical katakana column
│   │   └── PageShell.tsx       # Shared page wrapper (nav + divider + content)
│   └── home/
│       ├── HeroSection.tsx     # Left panel — heading, body, CTA
│       └── HeroImage.tsx       # Right panel — pixel-art illustration
│
├── stores/
│   └── useAppStore.ts          # Zustand store (global UI state, etc.)
│
├── utils/
│   ├── api.ts                  # Axios client instance & helpers
│   └── cn.ts                   # clsx + tailwind-merge utility
│
├── styles/
│   └── globals.css             # CSS custom properties, @font-face, Tailwind directives
│
└── public/
    ├── fonts/
    │   ├── Genova.otf
    │   └── 7pxkbus-Regular.ttf
    └── images/
        ├── pookie-logo.png
        ├── barca-tile-plain.png
        └── instagram-icon.svg
```

---

## Architecture Details

### Components

Components follow a **flat-feature** pattern:

- **`components/ui/`** — shadcn/ui primitives. Installed via `npx shadcn@latest add <component>`. Styled to match the design system (sharp corners, `--red` accent, pixel fonts).
- **`components/layout/`** — Structural components shared across pages.
- **`components/<feature>/`** — Page-specific components grouped by feature/page name.

All components are React Server Components by default. Add `"use client"` only when interactivity (state, effects, event handlers) is required.

### State — Zustand

```ts
// src/stores/useAppStore.ts
import { create } from "zustand";

interface AppState {
  navOpen: boolean;
  toggleNav: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  navOpen: false,
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
}));
```

Keep stores minimal. One store per domain (e.g., `useShopStore`, `useGalleryStore`) as the app grows. Avoid putting server-fetched data in Zustand — prefer React Server Components or SWR/React Query for that.

### Utils — API Client

```ts
// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Handle errors globally (toast, logging, etc.)
    return Promise.reject(error);
  }
);

export default api;
```

Usage: `import api from "@/utils/api"` → `api.get("/gallery")`, `api.post("/contact", data)`.

### Utils — cn helper

```ts
// src/utils/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Styling Approach

### Tailwind + CSS Custom Properties

Design tokens from `design-system.md` are defined as CSS custom properties in `globals.css` and extended into Tailwind's theme config so they can be used as utility classes:

```css
/* src/styles/globals.css */
@import "tailwindcss";

@font-face {
  font-family: "Genova";
  src: url("/fonts/Genova.otf") format("opentype");
  font-display: swap;
}

@font-face {
  font-family: "7pxkbus";
  src: url("/fonts/7pxkbus-Regular.ttf") format("truetype");
  font-display: swap;
}

:root {
  --black: #080808;
  --red: #a11212;
  --red-faint: rgba(161, 18, 18, 0.50);
  --red-subtle: rgba(161, 18, 18, 0.20);
  --soft-white: #806d6d;
  --soft-white-muted: rgba(128, 109, 109, 0.60);
}
```

### shadcn/ui Customization

shadcn components are restyled to match the Pookie design system:
- **No border-radius** — all interactive elements have sharp/square corners.
- **Colors** — override shadcn CSS variables to use `--red`, `--black`, `--soft-white`.
- **Fonts** — buttons use `Press Start 2P`, body text uses `Genova`.

---

## Pages (from Figma)

| Route      | Page            | Status  |
|------------|-----------------|---------|
| `/`        | Home (Chosen)   | Design ready |
| `/gallery` | Gallery         | Pending |
| `/shop`    | Shop            | Pending |
| `/contact` | Contact         | Pending |

### Home Page Layout

```
┌──────────────────────────────────────────────────┐
│  Navbar                                          │
│  [Logo]        [Home Gallery Shop Contact]  [IG] │
├──────────────────────┬───┬───────────────────────┤
│                      │   │                        │
│  "Welcome            │ K │  Pixel-art hero image  │
│   To the             │ A │  (50% opacity)         │
│   Pookieverse"       │ T │                        │
│                      │ A │                        │
│  Body text           │   │                        │
│  [Enter] button      │   │                        │
│                      │   │                        │
└──────────────────────┴───┴───────────────────────┘
```

---

## Available Assets

Located in `egg/rsrcs/` — copy to `public/` during project setup:

| Asset                  | Source Path                          | Destination              |
|------------------------|--------------------------------------|--------------------------|
| Pookie logo            | `egg/rsrcs/imgs/pookie-logo.png`     | `public/images/`         |
| Hero illustration      | `egg/rsrcs/imgs/barca-tile-plain.png`| `public/images/`         |
| Instagram icon         | `egg/rsrcs/imgs/instagram-icon.svg`  | `public/images/`         |
| Genova font            | `egg/rsrcs/fonts/Genova.otf`         | `public/fonts/`          |
| 7pxkbus font           | `egg/rsrcs/fonts/7pxkbus Regular.ttf`| `public/fonts/`          |

---

## Setup Commands

```bash
# 1. Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Install dependencies
npm install zustand axios

# 3. Install shadcn/ui
npx shadcn@latest init

# 4. Add shadcn components as needed
npx shadcn@latest add button

# 5. Copy assets
mkdir -p public/fonts public/images
cp egg/rsrcs/fonts/* public/fonts/
cp egg/rsrcs/imgs/* public/images/

# 6. Run dev server
npm run dev
```

---

## Conventions

- **File naming**: PascalCase for components (`HeroSection.tsx`), camelCase for utils/stores (`useAppStore.ts`).
- **Imports**: Use `@/` path alias for all `src/` imports.
- **No barrel exports**: Import directly from the file, not through `index.ts` re-exports.
- **Server-first**: Default to React Server Components. Only add `"use client"` when needed.
- **Commit style**: Conventional commits (`feat:`, `fix:`, `chore:`, etc.).
