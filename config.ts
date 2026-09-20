import type { BoardSize, PlayerColor, Settings, Theme } from './types';

export const PLAYER_COLORS: readonly PlayerColor[] = [
  { id: 'blue', label: 'Blau', hex: '#3b82f6' },
  { id: 'orange', label: 'Orange', hex: '#f97316' },
];

export const BOARD_SIZES: readonly BoardSize[] = [
  { id: '4x4', label: '4 x 4', rows: 4, columns: 4 },
  { id: '4x6', label: '4 x 6', rows: 4, columns: 6 },
  { id: '6x6', label: '6 x 6', rows: 6, columns: 6 },
];

// Jedes Theme braucht mindestens 18 Symbole (grösstes Feld: 6x6 = 18 Paare).
export const THEMES: readonly Theme[] = [
  {
    id: 'animals',
    label: 'Tiere',
    symbols: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦉'],
  },
  {
    id: 'space',
    label: 'Weltraum',
    symbols: ['🚀', '🛸', '🌍', '🌙', '⭐', '🌞', '🪐', '☄️', '👽', '🛰️', '🌌', '🔭', '👨‍🚀', '🌠', '🌑', '🌟', '💫', '🌕'],
  },
  {
    id: 'fruits',
    label: 'Früchte',
    symbols: ['🍎', '🍌', '🍇', '🍓', '🍉', '🍒', '🍑', '🍍', '🥝', '🍋', '🍊', '🥭', '🍐', '🫐', '🥥', '🍈', '🍅', '🥑'],
  },
];

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  playerColorId: PLAYER_COLORS[0].id,
  boardSizeId: BOARD_SIZES[0].id,
  themeId: THEMES[0].id,
};

export const PLAYER_COUNT = 2;
export const MISMATCH_DELAY_MS = 900;

export function findById<T extends { id: string }>(items: readonly T[], id: string): T {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) {
    throw new Error(`Unbekannte ID: ${id}`);
  }
  return item;
}
