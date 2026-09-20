import { DEFAULT_SETTINGS, GAME_OVER_DURATION_MS, THEMES, findById, resolvePlayers } from './config.js';
import { queryRequired } from './dom.js';
import { GameScreen } from './gameScreen.js';
import { hydrateIcons } from './icons.js';
import { ResultScreen } from './resultScreen.js';
import { SettingsScreen } from './settingsScreen.js';
class App {
    root;
    screens;
    gameScreen;
    resultScreen;
    settings = { ...DEFAULT_SETTINGS };
    gameOverTimer;
    constructor(root) {
        this.root = root;
        hydrateIcons(root);
        this.screens = new Map([
            ['home', queryRequired(root, '[data-screen="home"]')],
            ['settings', queryRequired(root, '[data-screen="settings"]')],
            ['game', queryRequired(root, '[data-screen="game"]')],
            ['game-over', queryRequired(root, '[data-screen="game-over"]')],
            ['result', queryRequired(root, '[data-screen="result"]')],
        ]);
        new SettingsScreen(this.getScreen('settings'), this.settings, (settings) => {
            this.settings = settings;
            this.applyTheme();
        });
        this.gameScreen = new GameScreen(this.getScreen('game'), {
            onQuit: () => this.showScreen('settings'),
            onFinish: (players, scores, winner) => this.finishGame(players, scores, winner),
        });
        this.resultScreen = new ResultScreen(this.getScreen('game-over'), this.getScreen('result'));
        this.bindActions();
        this.applyTheme();
        this.showScreen('home');
    }
    getScreen(name) {
        const screen = this.screens.get(name);
        if (!screen) {
            throw new Error(`Unbekannter Screen: ${name}`);
        }
        return screen;
    }
    bindActions() {
        const actions = {
            start: () => this.showScreen('settings'),
            play: () => this.startGame(),
            'exit-game': () => this.gameScreen.requestQuit(),
            'new-round': () => this.startGame(),
            home: () => this.showScreen('home'),
        };
        this.root.addEventListener('click', (event) => {
            const target = event.target.closest('[data-action]');
            const action = target?.dataset.action;
            if (action && action in actions) {
                actions[action]();
            }
        });
        // Ein Klick auf „Game over" überspringt die Wartezeit bis zum Ergebnis.
        this.getScreen('game-over').addEventListener('click', () => this.showPendingResult());
    }
    showScreen(name) {
        window.clearTimeout(this.gameOverTimer);
        this.screens.forEach((screen, screenName) => {
            screen.hidden = screenName !== name;
        });
        document.body.dataset.screen = name;
    }
    startGame() {
        this.gameScreen.start(this.settings, resolvePlayers(this.settings));
        this.showScreen('game');
    }
    finishGame(players, scores, winner) {
        this.resultScreen.showFinalScore(players, scores);
        this.resultScreen.showResult(players, winner, findById(THEMES, this.settings.themeId));
        this.showScreen('game-over');
        this.gameOverTimer = window.setTimeout(() => this.showPendingResult(), GAME_OVER_DURATION_MS);
    }
    showPendingResult() {
        if (!this.getScreen('game-over').hidden) {
            this.showScreen('result');
        }
    }
    applyTheme() {
        document.body.dataset.theme = this.settings.themeId;
    }
}
new App(queryRequired(document, '.app'));
