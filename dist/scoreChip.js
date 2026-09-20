import { createIcon } from './icons.js';
import { createElement } from './dom.js';
/** Kompakter Eintrag „<Icon> <Name> <Punkte>" in der Farbe des Spielers. */
export function createScoreItem(player, score) {
    const item = createElement('span', 'score-item');
    item.style.setProperty('--player-color', player.hex);
    item.append(createIcon('pawn', 'score-item__icon'));
    item.append(createElement('span', 'score-item__name', player.label));
    item.append(createElement('span', 'score-item__score', String(score)));
    return item;
}
