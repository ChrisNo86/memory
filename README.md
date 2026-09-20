# Memory

A browser-based Memory card game for two players, built with TypeScript and plain CSS. No framework, no bundler, no runtime dependencies.

## Features

- **Two players, alternating turns** with live scoreboard and current-player indicator
- **Player color:** Blue or Orange
- **Board sizes:** 4×4, 4×6, 6×6
- **Four themes** (color scheme and image order): Code vibes, Gaming, Developer Akademie, Foodie
- **3D card flip** animation, match and mismatch feedback
- **Game flow:** Home → Settings (with live preview) → Game → Game over → Result (winner or draw) → New round
- **Exit dialog** to leave a running game
- Design based on a [Figma concept](https://www.figma.com/design/teDxq4ywNg46iqiWHpHQYM/Memory)

## Tech Stack

- TypeScript (strict), compiled with `tsc` to native ES modules
- Plain CSS with custom properties for theming
- Inline SVG icons
- Fonts via Google Fonts (Red Rose, Figtree, Orbitron, Klee One)

## Getting Started

### Play

The compiled output is committed, so no build is required. Serve the project folder with any static server, for example:

```bash
npx serve .
```

or use the VS Code *Live Server* extension on `index.html`. Opening the file directly via `file://` does not work because ES modules need to be served over HTTP.

### Develop

```bash
npm install
npm run build   # compile src/ to dist/
npm run watch   # recompile on change
```

### Deploy

Upload these to any static host (including plain FTP):

- `index.html`
- `dist/`
- `src/styles/`
- `src/assets/`

After an update, do a hard refresh (Ctrl+F5) or bump the `?v=` query in `index.html` to bypass cached files.

## Project Structure

```
.
├── index.html            # All screens (markup)
├── dist/                 # Compiled JavaScript (loaded by index.html)
└── src/
    ├── main.ts           # App: screen switching, game flow
    ├── game.ts           # MemoryGame: pure game logic (no DOM)
    ├── gameScreen.ts     # Board rendering, flip logic, scoreboard, exit dialog
    ├── settingsScreen.ts # Settings and live preview
    ├── resultScreen.ts   # Game over and winner/draw screens
    ├── config.ts         # Themes, player colors, board sizes, timings
    ├── cardImages.ts     # Card motif image URLs
    ├── icons.ts          # Inline SVG icons
    ├── scoreChip.ts      # Score display component
    ├── dom.ts            # Small DOM helpers
    ├── types.ts          # Shared types
    ├── assets/cards/     # Card images
    └── styles/main.css   # Styles and theme tokens
```

## Architecture Notes

- Game logic (`MemoryGame`) is separated from rendering, so it can be tested without a DOM.
- Themes are CSS custom properties switched via `data-theme` on `<body>`; screens via `data-screen`.
- Card images are resolved with `new URL(..., import.meta.url)`, so the app works from any sub-path.

## Customization

- **Add or change a theme:** edit `THEMES` in `src/config.ts` and add matching `[data-theme='…']` tokens in `src/styles/main.css`.
- **Add a board size:** edit `BOARD_SIZES` in `src/config.ts`.
- **Timings:** `MISMATCH_DELAY_MS` and `GAME_OVER_DURATION_MS` in `src/config.ts`.

Note: 18 unique card images exist. The largest board (6×6) needs 18 pairs, so all themes share this pool and differ in their ordering.
