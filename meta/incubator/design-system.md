# Pookieverse — Design System

> Extracted from Figma: **Portfolio New → Home - Chosen**
> Target: Next.js + TypeScript + Tailwind CSS v4

---

## Color Tokens

### Core Palette

| CSS Variable         | Value                        | Tailwind Utility        | Usage                                    |
|----------------------|------------------------------|-------------------------|------------------------------------------|
| `--black`            | `#080808`                    | `bg-black`, `text-black`| Page background, button text             |
| `--red`              | `#a11212`                    | `bg-red`, `text-red`    | Primary accent, headings, CTA background |
| `--red-faint`        | `rgba(161, 18, 18, 0.50)`   | `border-red-faint`      | Borders, dividers                        |
| `--red-subtle`       | `rgba(161, 18, 18, 0.20)`   | `text-red-subtle`       | Decorative / background text             |
| `--soft-white`       | `#806d6d`                    | `text-soft-white`       | Body text, active nav link               |
| `--soft-white-muted` | `rgba(128, 109, 109, 0.60)` | `text-soft-white-muted` | Inactive nav links, footer text          |

### Semantic Mapping

```
background-primary   → --black
text-heading         → --red
text-body            → --soft-white
text-muted           → --soft-white-muted
text-decorative      → --red-subtle
accent-primary       → --red
border-default       → --red-faint
button-bg            → --red
button-text          → --black
```

---

## Typography

### Font Families

| CSS Variable       | Family             | Tailwind Utility   | Source                             |
|--------------------|--------------------|--------------------|-------------------------------------|
| `--font-display`   | `Press Start 2P`   | `font-display`     | Google Font — pixel/retro aesthetic |
| `--font-body`      | `Genova`           | `font-body`        | Custom — `@font-face` from `/fonts/Genova.otf` |
| `--font-decorative`| `7pxkbus`          | `font-decorative`  | Custom — `@font-face` from `/fonts/7pxkbus-Regular.ttf` |

### Type Scale

| Role        | Tailwind Font    | Size   | Line Height | Letter Spacing | Transform | Weight  |
|-------------|------------------|--------|-------------|----------------|-----------|---------|
| **Hero H1** | `font-display`   | 46px   | 1.2         | 1.84px         | none      | Regular |
| **Body**    | `font-body`      | 18px   | 1.2         | 0.72px         | none      | Regular |
| **Nav Link**| `font-body`      | 14px   | normal      | 0.56px         | uppercase | Regular |
| **Button**  | `font-display`   | 18px   | normal      | 0.72px         | none      | Regular |
| **Decorative** | `font-decorative` | 24px | normal   | 0.96px         | uppercase | Regular |
| **Footer**  | `font-display`   | 10px   | normal      | 0.4px          | none      | Regular |

---

## Spacing

### Shared (Tailwind theme tokens)

| CSS Variable       | Value  | Tailwind Utility       | Usage                          |
|--------------------|--------|------------------------|--------------------------------|
| `--spacing-page-x` | 40px   | `px-page-x`, `pl-page-x` | Page horizontal padding (nav, footer, hero) |
| `--nav-height`     | 57px   | `spacing-nav-height`   | Nav height, viewport calc      |

### Component-specific (hardcoded in components)

| Value  | Usage                          |
|--------|--------------------------------|
| 7px    | Button vertical padding        |
| 10px   | Nav vertical padding           |
| 15px   | Katakana column top offset     |
| 18px   | Footer vertical padding        |
| 20px   | Nav item gap, katakana gap, button horizontal padding |
| 42px   | Section gap (heading → body)   |
| 91px   | Body text → CTA offset         |
| 100px  | Body top padding               |

---

## Borders

### Shared (Tailwind theme token)

| CSS Variable     | Value  | Tailwind Utility                                  |
|------------------|--------|----------------------------------------------------|
| `--border-width` | 0.5px  | `border-t-thin`, `border-b-thin`, `border-x-thin` |

All borders use the `thin` width with `border-red-faint` color.

### Usage

| Element              | Classes                                  |
|----------------------|------------------------------------------|
| Nav bottom           | `border-b-thin border-red-faint`         |
| Footer top           | `border-t-thin border-red-faint`         |
| Katakana divider L+R | `border-x-thin border-red-faint`         |

> All borders create subtle, glowing separation lines consistent with the dark retro aesthetic.

---

## Layout

### Page Structure

```
┌──────────────────────────────────────────────────┐
│  Nav  (full width, h: 57px)                      │
│  [Logo]        [Nav Items]        [Social Icons]  │
├──────────────────────┬───┬───────────────────────┤
│                      │ K │                        │
│     Left Panel       │ A │     Right Panel        │
│     (text content)   │ T │     (hero image)       │
│     flex: 1          │ A │     flex: 1            │
│                      │   │                        │
├──────────────────────┴───┴───────────────────────┤
│  Footer                                          │
│  [© 2026 iis0]                      [IG icon]    │
└──────────────────────────────────────────────────┘
```

- **Viewport**: 1280px designed width
- **Page padding**: `px-page-x` (40px horizontal)
- **Nav height**: `--nav-height` (57px)
- **Body**: 2-column split layout with center katakana divider (41px wide)
- **Left/Right panels**: flex: 1 (equal width, ~620px each)

### Nav Layout

- 3-column CSS Grid (`grid-cols-3`)
- Col 1: Logo (start-aligned)
- Col 2: Nav links (center-aligned, 20px gap)
- Col 3: Social icons (end-aligned)

---

## Components

### NavItem

```
States:
  - active:   text-soft-white
  - inactive: text-soft-white-muted

Font: font-body, 14px, uppercase, letter-spacing: 0.56px
Gap between items: 20px
```

### Button (CTA)

```
Background: bg-red
Text color:  text-black
Font:        font-display, 18px, letter-spacing: 0.72px
Padding:     7px 20px
Border:      none
Radius:      0 (sharp corners)

Hover state: hover:brightness-[1.15]
```

### KatakanaDivider

```
Container:   41px wide, full body height
Background:  bg-black
Borders:     border-x-thin border-red-faint
Content:     Repeating glyphs "a", "e", "f", "v" (mapped to katakana by 7pxkbus font)
Font:        font-decorative, 24px
Text color:  text-red-subtle
Gap between glyph groups: 20px
Animation:   katakana-scroll 30s linear infinite (translateY)
```

### Logo

```
Single combined pixel-art image: pookie-logo.png
Size: 168×37px
```

### SocialLink (Instagram icon)

```
Size: 17×17px (nav), 15×15px (footer)
Opacity: 0.55, hover: 0.80–0.85
Color: stroke --red (nav SVG), stroke --soft-white (footer SVG)
Position: right-aligned
```

---

## Visual Identity Notes

- **Aesthetic**: Dark retro / pixel-art / cyberpunk-lite
- **Key motif**: Pixel art imagery, monospace display font, Japanese katakana as decoration
- **Mood**: Mysterious, personal, playful-dark — "the innerworkings of iis0's mind"
- **Images**: Pixel-art hero illustration at 50% opacity on right panel
- **No border-radius** on interactive elements — everything is sharp/square
- **Thin red borders** act as the main structural dividers rather than spacing or background changes

---

## Tailwind Theme (`@theme inline` in `globals.css`)

```css
@theme inline {
  /* Colors */
  --color-black: var(--black);
  --color-red: var(--red);
  --color-red-faint: var(--red-faint);
  --color-red-subtle: var(--red-subtle);
  --color-soft-white: var(--soft-white);
  --color-soft-white-muted: var(--soft-white-muted);

  /* Fonts */
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-decorative: var(--font-decorative);

  /* Spacing */
  --spacing-page-x: var(--spacing-page-x);
  --spacing-nav-height: var(--nav-height);

  /* Borders */
  --border-width-thin: var(--border-width);
}
```

---

## CSS Custom Properties (`:root`)

```css
:root {
  /* Colors */
  --black: #080808;
  --red: #a11212;
  --red-faint: rgba(161, 18, 18, 0.5);
  --red-subtle: rgba(161, 18, 18, 0.2);
  --soft-white: #806d6d;
  --soft-white-muted: rgba(128, 109, 109, 0.6);

  /* Typography */
  --font-display: "Press Start 2P", monospace;
  --font-body: "Genova", sans-serif;
  --font-decorative: "7pxkbus", monospace;

  /* Spacing */
  --spacing-page-x: 40px;
  --nav-height: 57px;

  /* Borders */
  --border-width: 0.5px;
}
```

---

## Font Loading

```css
/* @font-face in globals.css */
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
```

Press Start 2P is loaded via `next/font/google` in `layout.tsx` and injected as `--font-display`.

> `Genova` and `7pxkbus` are custom/non-Google fonts, self-hosted in `public/fonts/`.
