import { BOARD_SIZES, MISMATCH_DELAY_MS, THEMES, findById } from './config.js';
import { createElement, queryRequired } from './dom.js';
import { MemoryGame } from './game.js';
import { createIcon } from './icons.js';
import { createScoreItem } from './scoreChip.js';
const PLAYER_INDICES = [0, 1];
export class GameScreen {
    callbacks;
    board;
    scoreboard;
    turnIndicator;
    quitDialog;
    game = null;
    players = null;
    cardElements = [];
    isLocked = false;
    resolveTimer;
    constructor(root, callbacks) {
        this.callbacks = callbacks;
        this.board = queryRequired(root, '[data-ref="board"]');
        this.scoreboard = queryRequired(root, '[data-ref="scoreboard"]');
        this.turnIndicator = queryRequired(root, '[data-ref="turn-indicator"]');
        this.quitDialog = queryRequired(root, '[data-ref="quit-dialog"]');
        this.bindDialogActions(root);
    }
    start(settings, players) {
        this.stop();
        const boardSize = findById(BOARD_SIZES, settings.boardSizeId);
        const theme = findById(THEMES, settings.themeId);
        this.players = players;
        this.game = new MemoryGame(theme.symbols, (boardSize.rows * boardSize.columns) / 2);
        this.board.style.setProperty('--columns', String(boardSize.columns));
        this.board.style.setProperty('--rows', String(boardSize.rows));
        this.renderBoard(this.game.getCards());
        this.updateStatus();
    }
    /** Bricht laufende Timer ab und schließt offene Dialoge. */
    stop() {
        window.clearTimeout(this.resolveTimer);
        this.isLocked = false;
        if (this.quitDialog.open) {
            this.quitDialog.close();
        }
    }
    /** Öffnet die Sicherheitsabfrage zum Verlassen des Spiels. */
    requestQuit() {
        if (!this.quitDialog.open) {
            this.quitDialog.showModal();
        }
    }
    bindDialogActions(root) {
        queryRequired(root, '[data-action="resume"]').addEventListener('click', () => this.quitDialog.close());
        queryRequired(root, '[data-action="confirm-quit"]').addEventListener('click', () => {
            this.stop();
            this.callbacks.onQuit();
        });
    }
    renderBoard(cards) {
        this.cardElements = cards.map((card, index) => this.createCardElement(card, index));
        this.board.replaceChildren(...this.cardElements);
    }
    createCardElement(card, index) {
        const button = createElement('button', 'card');
        button.type = 'button';
        button.setAttribute('aria-label', `Card ${index + 1}`);
        const back = createElement('span', 'card__face card__face--back');
        back.append(createIcon('screen-code', 'card__icon'));
        const front = createElement('span', 'card__face card__face--front');
        const image = createElement('img', 'card__image');
        image.src = card.symbol;
        image.alt = '';
        front.append(image);
        const inner = createElement('span', 'card__inner');
        inner.append(back, front);
        button.append(inner);
        button.addEventListener('click', () => this.handleCardClick(index));
        return button;
    }
    handleCardClick(index) {
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
    resolveTurn() {
        if (!this.game || !this.players) {
            return;
        }
        this.applyTurnResult(this.game.resolveTurn());
        this.updateStatus();
        this.isLocked = false;
        if (this.game.isFinished) {
            const scores = [this.game.getScore(0), this.game.getScore(1)];
            this.callbacks.onFinish(this.players, scores, this.game.winner);
        }
    }
    applyTurnResult({ isMatch, indices, player }) {
        indices.forEach((index) => {
            const element = this.cardElements[index];
            if (isMatch) {
                element.classList.add('card--matched');
                element.style.setProperty('--player-color', this.players?.[player].hex ?? 'transparent');
                element.disabled = true;
            }
            else {
                element.classList.remove('card--flipped');
            }
        });
    }
    updateStatus() {
        if (!this.game || !this.players) {
            return;
        }
        const { game, players } = this;
        this.scoreboard.replaceChildren(...PLAYER_INDICES.map((index) => {
            const item = createScoreItem(players[index], game.getScore(index));
            item.classList.toggle('score-item--active', index === game.currentPlayer);
            return item;
        }));
        const current = players[game.currentPlayer];
        const currentIcon = createIcon('pawn', 'topbar__player-icon');
        currentIcon.style.color = current.hex;
        currentIcon.title = current.label;
        this.turnIndicator.replaceChildren('Current player: ', currentIcon);
    }
}
