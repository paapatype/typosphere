# Typosphere

A 3D typographic sphere — extruded text belts wrapped around a smooth sphere with real-time controls.

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
```

## Production Build

```bash
npm run build      # outputs to dist/
npm run preview    # local production preview → http://localhost:4173
```

## How It Works

### Fonts

All fonts are **variable** and loaded from Google Fonts via `opentype.js`. The app fetches the raw `.ttf` from `fonts.gstatic.com`, parses glyph outlines, and extrudes them into true 3D geometry (not textures).

Curated variable font list:
- **Recursive** — weight, casual, cursive, monospace axes
- **Fraunces** — weight, softness, wonkiness, optical size
- **Anybody** — weight, width
- **Bricolage Grotesque** — weight, width, optical size
- **Instrument Serif** — static (no variable axes)
- **Syne** — weight
- **Space Grotesk** — weight

Variable axes are exposed as sliders in the UI panel. When you select a font, the app loads it via `opentype.load(url)` and caches the parsed font object.

### Text Belt Layout

1. Each glyph is extruded from its outline path into 3D geometry (with optional bevel).
2. Glyphs are positioned sequentially around a circle at `ringRadius = sphereRadius + beltOffset`.
3. Each glyph's angular position is computed from its advance width + letter spacing.
4. The text repeats seamlessly to fill the full circumference.
5. Multiple lines (2–4) are stacked vertically around the equator with configurable leading.
6. Even-numbered lines are offset by half a cycle for visual stagger.

### Inversion

Scroll (or use the bottom-left scrubber) to smoothly invert the sphere from white to black. When "Lock Contrast" is enabled, text color automatically adjusts to maintain readability.

### Animation

- Camera orbits around the sphere with a subtle tilt oscillation.
- The text belt itself rotates independently.
- Both speeds are adjustable. Play/pause toggles all animation.

### Presets

- **Copy JSON** — exports current settings to clipboard and localStorage.
- **Paste JSON** — imports settings from clipboard.
- Settings persist in localStorage across sessions.

## Deploy Later to Vercel

No deployment config is included. When ready:

```bash
npm i -g vercel
vercel
```

Vite projects work out of the box with Vercel — no extra config needed.
