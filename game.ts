import type { PlayerIndex } from './types';

export type CardState = 'hidden' | 'flipped' | 'matched';

export interface Card {
  symbol: string;
  state: CardState;
  owner: PlayerIndex | null;
}

export type FlipOutcome = 'ignored' | 'first' | 'second';

export interface TurnResult {
  isMatch: boolean;
  indices: [number, number];
  player: PlayerIndex;
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export class MemoryGame {
  private readonly cards: Card[];
  private readonly scores: [number, number] = [0, 0];
  private flippedIndices: number[] = [];
  private activePlayer: PlayerIndex = 0;

  constructor(symbols: readonly string[], pairCount: number) {
    if (symbols.length < pairCount) {
      throw new Error('Nicht genug Symbole für die gewählte Spielfeldgröße.');
    }
    const pairSymbols = shuffle(symbols).slice(0, pairCount);
    this.cards = shuffle([...pairSymbols, ...pairSymbols]).map((symbol) => ({
      symbol,
      state: 'hidden',
      owner: null,
    }));
  }

  get currentPlayer(): PlayerIndex {
    return this.activePlayer;
  }

  get isFinished(): boolean {
    return this.cards.every((card) => card.state === 'matched');
  }

  /** Gewinner oder `null` bei Gleichstand. */
  get winner(): PlayerIndex | null {
    if (this.scores[0] === this.scores[1]) {
      return null;
    }
    return this.scores[0] > this.scores[1] ? 0 : 1;
  }

  getCards(): readonly Card[] {
    return this.cards;
  }

  getScore(player: PlayerIndex): number {
    return this.scores[player];
  }

  flip(index: number): FlipOutcome {
    const card = this.cards[index];
    if (!card || card.state !== 'hidden' || this.flippedIndices.length >= 2) {
      return 'ignored';
    }
    card.state = 'flipped';
    this.flippedIndices.push(index);
    return this.flippedIndices.length === 1 ? 'first' : 'second';
  }

  /** Wertet zwei aufgedeckte Karten aus. Nur aufrufen, wenn `flip` 'second' lieferte. */
  resolveTurn(): TurnResult {
    if (this.flippedIndices.length !== 2) {
      throw new Error('Es müssen genau zwei Karten aufgedeckt sein.');
    }
    const indices: [number, number] = [this.flippedIndices[0], this.flippedIndices[1]];
    const [first, second] = indices.map((index) => this.cards[index]);
    const player = this.activePlayer;
    const isMatch = first.symbol === second.symbol;

    if (isMatch) {
      first.state = second.state = 'matched';
      first.owner = second.owner = player;
      this.scores[player]++;
    } else {
      first.state = second.state = 'hidden';
      this.activePlayer = player === 0 ? 1 : 0;
    }
    this.flippedIndices = [];
    return { isMatch, indices, player };
  }
}
