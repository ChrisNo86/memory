import { CARD_IMAGES } from './cardImages.js';
export const PLAYER_COLORS = [
    { id: 'blue', label: 'Blue', hex: '#5aa0f0' },
    { id: 'orange', label: 'Orange', hex: '#e8903e' },
];
export const BOARD_SIZES = [
    { id: '16', label: '16 cards', rows: 4, columns: 4 },
    { id: '24', label: '24 cards', rows: 4, columns: 6 },
    { id: '36', label: '36 cards', rows: 6, columns: 6 },
];
const ALL_IMAGES = Object.values(CARD_IMAGES);
/** Passende Motive stehen vorn, die übrigen füllen größere Spielfelder auf. */
function prioritized(...preferred) {
    return [...preferred, ...ALL_IMAGES.filter((image) => !preferred.includes(image))];
}
export const THEMES = [
    {
        id: 'code',
        label: 'Code vibes theme',
        winnerIcon: 'pawn',
        hasConfetti: true,
        symbols: prioritized(CARD_IMAGES.arrowLogo, CARD_IMAGES.greenLogo, CARD_IMAGES.chatBubbles, CARD_IMAGES.userCircle, CARD_IMAGES.ticTacToe, CARD_IMAGES.coins, CARD_IMAGES.smiley, CARD_IMAGES.pokeball),
    },
    {
        id: 'gaming',
        label: 'Gaming theme',
        winnerIcon: 'trophy',
        hasConfetti: true,
        symbols: prioritized(CARD_IMAGES.pokeball, CARD_IMAGES.ticTacToe, CARD_IMAGES.smiley, CARD_IMAGES.coins, CARD_IMAGES.arrowLogo, CARD_IMAGES.chatBubbles, CARD_IMAGES.userCircle, CARD_IMAGES.greenLogo),
    },
    {
        id: 'da',
        label: 'DA Projects theme',
        winnerIcon: 'pawn',
        hasConfetti: false,
        symbols: prioritized(CARD_IMAGES.wave, CARD_IMAGES.blossom, CARD_IMAGES.userCircle, CARD_IMAGES.chatBubbles, CARD_IMAGES.arrowLogo, CARD_IMAGES.greenLogo, CARD_IMAGES.coins, CARD_IMAGES.ticTacToe),
    },
    {
        id: 'food',
        label: 'Foods theme',
        winnerIcon: 'pawn',
        hasConfetti: false,
        symbols: prioritized(CARD_IMAGES.fries, CARD_IMAGES.soupBowl, CARD_IMAGES.noodles, CARD_IMAGES.egg, CARD_IMAGES.chefHat, CARD_IMAGES.broccoli, CARD_IMAGES.basket, CARD_IMAGES.sombrero),
    },
];
export const DEFAULT_SETTINGS = {
    playerColorId: PLAYER_COLORS[0].id,
    boardSizeId: BOARD_SIZES[0].id,
    themeId: THEMES[0].id,
};
export const MISMATCH_DELAY_MS = 900;
export const GAME_OVER_DURATION_MS = 2500;
export function findById(items, id) {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) {
        throw new Error(`Unbekannte ID: ${id}`);
    }
    return item;
}
/** Gewählte Farbe beginnt als Spieler 1, die andere Farbe ist Spieler 2. */
export function resolvePlayers(settings) {
    const first = findById(PLAYER_COLORS, settings.playerColorId);
    const second = PLAYER_COLORS.find((color) => color.id !== first.id) ?? first;
    return [first, second];
}
