export type PlayerIndex = 0 | 1;

export interface PlayerColor {
  id: string;
  label: string;
  hex: string;
}

export interface BoardSize {
  id: string;
  label: string;
  rows: number;
  columns: number;
}

export interface Theme {
  id: string;
  label: string;
  symbols: string[];
}

export interface Settings {
  playerColorId: string;
  boardSizeId: string;
  themeId: string;
}

export type ScreenName = 'home' | 'settings' | 'game';
