import { createElement, queryRequired } from './dom.js';
import { createIcon } from './icons.js';
import { createScoreItem } from './scoreChip.js';
const CONFETTI_COLORS = ['#e8903e', '#5aa0f0', '#ede564', '#e0457b', '#8dd8c3', '#7ac74f'];
const CONFETTI_COUNT = 70;
export class ResultScreen {
    resultRoot;
    finalScore;
    confetti;
    eyebrow;
    title;
    icon;
    constructor(gameOverRoot, resultRoot) {
        this.resultRoot = resultRoot;
        this.finalScore = queryRequired(gameOverRoot, '[data-ref="final-score"]');
        this.confetti = queryRequired(resultRoot, '[data-ref="confetti"]');
        this.eyebrow = queryRequired(resultRoot, '[data-ref="result-eyebrow"]');
        this.title = queryRequired(resultRoot, '[data-ref="result-title"]');
        this.icon = queryRequired(resultRoot, '[data-ref="result-icon"]');
    }
    showFinalScore(players, scores) {
        this.finalScore.replaceChildren(createScoreItem(players[0], scores[0]), createScoreItem(players[1], scores[1]));
    }
    /** `winner === null` steht für ein Unentschieden. */
    showResult(players, winner, theme) {
        const isDraw = winner === null;
        this.resultRoot.classList.toggle('screen--draw', isDraw);
        this.confetti.replaceChildren(...(theme.hasConfetti && !isDraw ? this.createConfetti() : []));
        if (isDraw) {
            this.eyebrow.textContent = 'It’s a';
            this.title.textContent = 'DRAW';
            this.title.style.removeProperty('--player-color');
            this.icon.style.removeProperty('--player-color');
            this.icon.replaceChildren(createIcon('scales', 'result__svg'));
            return;
        }
        const player = players[winner];
        this.eyebrow.textContent = 'The winner is';
        this.title.textContent = `${player.label} Player`;
        this.title.style.setProperty('--player-color', player.hex);
        this.icon.style.setProperty('--player-color', player.hex);
        this.icon.replaceChildren(createIcon(theme.winnerIcon, 'result__svg result__svg--player'));
    }
    createConfetti() {
        return Array.from({ length: CONFETTI_COUNT }, () => {
            const piece = createElement('span', 'confetti__piece');
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.top = `${Math.random() * 100}%`;
            piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            piece.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
            piece.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
            return piece;
        });
    }
}
