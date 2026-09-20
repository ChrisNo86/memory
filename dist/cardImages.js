/**
 * Der kompilierte Code liegt in `dist/`, die Bilder in `src/assets/cards/`.
 * Die URLs werden deshalb relativ zum kompilierten Modul aufgelöst.
 */
function imageUrl(fileName) {
    return new URL(`../src/assets/cards/${fileName}`, import.meta.url).href;
}
/** Alle 18 Kartenmotive (genug für das größte Spielfeld mit 36 Karten). */
export const CARD_IMAGES = {
    arrowLogo: imageUrl('arrow-logo.png'),
    basket: imageUrl('basket.png'),
    blossom: imageUrl('blossom.png'),
    broccoli: imageUrl('broccoli.png'),
    chatBubbles: imageUrl('chat-bubbles.png'),
    chefHat: imageUrl('chef-hat.png'),
    coins: imageUrl('coins.png'),
    egg: imageUrl('egg.png'),
    fries: imageUrl('fries.png'),
    greenLogo: imageUrl('green-logo.png'),
    noodles: imageUrl('noodles.png'),
    pokeball: imageUrl('pokeball.png'),
    smiley: imageUrl('smiley.png'),
    sombrero: imageUrl('sombrero.png'),
    soupBowl: imageUrl('soup-bowl.png'),
    ticTacToe: imageUrl('tic-tac-toe.png'),
    userCircle: imageUrl('user-circle.png'),
    wave: imageUrl('wave.png'),
};
