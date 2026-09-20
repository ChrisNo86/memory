import { BOARD_SIZES, MISMATCH_DELAY_MS, THEMES, findById } from './config';
import { createElement, queryRequired } from './dom';
import { MemoryGame } from './game';
import type { Card, TurnResult } from './game';
import type { PlayerIndex, Settings } from './types';

const PLAYER_INDICES: readonly PlayerIndex[] = [0, 1];

function playerName(player: PlayerIndex): string {
  return `Spieler ${player + 1}`;
}

export class GameScreen {
  private readonly board: HTMLElement;
  private readonly scoreboard: HTMLElement;
  private readonly turnIndicator: HTMLElement;
  private readonly gameOverDialog: HTMLDialogElement;
  private readonly winnerText: HTMLElement;
  private readonly finalScores: HTMLElement;

  private game: MemoryGame | null = null;
  private cardElements: HTMLButtonElement[] = [];
  private scorePanels: HTMLElement[] = [];
  private isLocked = false;
  private resolveTimer: number | undefined;

  constructor(root: HTMLElement) {
    this.board = queryRequired(root, '[data-ref="board"]');
    this.scoreboard = queryRequired(root, '[data-ref="scoreboard"]');
    this.turnIndicator = queryRequired(root, '[data-ref="turn-indicator"]');
    this.gameOverDialog = queryRequired<HTMLDialogElement>(root, '[data-ref="game-over"]');
    this.winnerText = queryRequired(root, '[data-ref="winner-text"]');
    this.finalScores = queryRequired(root, '[data-ref="final-scores"]');
  }

  start(settings: Settings): void {
    this.stop();

    const boardSize = findById(BOARD_SIZES, settings.boardSizeId);
    const theme = findById(THEMES, settings.themeId);
    this.game = new MemoryGame(theme.symbols, (boardSize.rows * boardSize.columns) / 2);
    this.isLocked = false;

    this.board.style.setProperty('--columns', String(boardSize.columns));
    this.renderScoreboard();
    this.renderBoard(this.game.getCards());
    this.updateStatus();
  }

  /** Bricht laufende Timer ab und schließt das Game-over-Fenster. */
  stop(): void {
    window.clearTimeout(this.resolveTimer);
    this.isLocked = false;
    if (this.gameOverDialog.open) {
      this.gameOverDialog.close();
    }
  }

  private renderScoreboard(): void {
    const panels = PLAYER_INDICES.map((player) => {
      const panel = createElement('div', `scoreboard__player scoreboard__player--${player}`);
      panel.append(createElement('span', 'scoreboard__name', playerName(player)));
      panel.append(createElement('span', 'scoreboard__score', '0'));
      return panel;
    });
    this.scorePanels = panels;
    this.scoreboard.replaceChildren(...panels);
  }

  private renderBoard(cards: readonly Card[]): void {
    this.cardElements = cards.map((card, index) => this.createCardElement(card, index));
    this.board.replaceChildren(...this.cardElements);
  }

  private createCardElement(card: Card, index: number): HTMLButtonElement {
    const button = createElement('button', 'card');
    button.type = 'button';
    button.setAttribute('aria-label', `Karte ${index + 1}`);

    const inner = createElement('span', 'card__inner');
    inner.append(createElement('span', 'card__face card__face--back'));
    inner.append(createElement('span', 'card__face card__face--front', card.symbol));
    button.append(inner);

    button.addEventListener('click', () => this.handleCardClick(index));
    return button;
  }

  private handleCardClick(index: number): void {
    if (!this.game || this.isLocked) {
      return;
    }
    const outcome = this.game.flip(index);
    if (outcome === 'ignored') {
      return;
    }
    this.cardElements[index].classList.add('card--flipped');

    if (outcome === 'second') {
      this.isLocked = true;
      this.resolveTimer = window.setTimeout(() => this.resolveTurn(), MISMATCH_DELAY_MS);
    }
  }

  private resolveTurn(): void {
    if (!this.game) {
      return;
    }
    const result = this.game.resolveTurn();
    this.applyTurnResult(result);
    this.updateStatus();
    this.isLocked = false;

    if (this.game.isFinished) {
      this.showGameOver();
    }
  }

  private applyTurnResult({ isMatch, indices, player }: TurnResult): void {
    indices.forEach((index) => {
      const element = this.cardElements[index];
      if (isMatch) {
        element.classList.add('card--matched');
        element.dataset.owner = String(player);
        element.disabled = true;
      } else {
        element.classList.remove('card--flipped');
      }
    });
  }

  private updateStatus(): void {
    if (!this.game) {
      return;
    }
    const game = this.game;
    PLAYER_INDICES.forEach((player) => {
      const panel = this.scorePanels[player];
      queryRequired(panel, '.scoreboard__score').textContent = String(game.getScore(player));
      panel.classList.toggle('scoreboard__player--active', player === game.currentPlayer);
    });
    this.turnIndicator.textContent = `${playerName(this.game.currentPlayer)} ist am Zug`;
    this.turnIndicator.dataset.player = String(this.game.currentPlayer);
  }

  private showGameOver(): void {
    if (!this.game) {
      return;
    }
    const winner = this.game.winner;
    this.winnerText.textContent = winner === null ? 'Unentschieden!' : `${playerName(winner)} gewinnt!`;
    this.finalScores.textContent = PLAYER_INDICES.map(
      (player) => `${playerName(player)}: ${this.game?.getScore(player)}`,
    ).join('  |  ');
    this.gameOverDialog.showModal();
  }
}
