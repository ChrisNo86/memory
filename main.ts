import './styles/main.css';
import { DEFAULT_SETTINGS, PLAYER_COLORS, findById } from './config';
import { queryRequired } from './dom';
import { GameScreen } from './gameScreen';
import { SettingsScreen } from './settingsScreen';
import type { ScreenName, Settings } from './types';

class App {
  private readonly screens: Map<ScreenName, HTMLElement>;
  private readonly settingsScreen: SettingsScreen;
  private readonly gameScreen: GameScreen;
  private settings: Settings = { ...DEFAULT_SETTINGS };

  constructor(private readonly root: HTMLElement) {
    this.screens = new Map<ScreenName, HTMLElement>([
      ['home', queryRequired(root, '[data-screen="home"]')],
      ['settings', queryRequired(root, '[data-screen="settings"]')],
      ['game', queryRequired(root, '[data-screen="game"]')],
    ]);

    this.settingsScreen = new SettingsScreen(this.getScreen('settings'), this.settings, (settings) => {
      this.settings = settings;
      this.applyVisualSettings();
    });
    this.gameScreen = new GameScreen(this.getScreen('game'));

    this.bindActions();
    this.applyVisualSettings();
    this.showScreen('home');
  }

  private getScreen(name: ScreenName): HTMLElement {
    const screen = this.screens.get(name);
    if (!screen) {
      throw new Error(`Unbekannter Screen: ${name}`);
    }
    return screen;
  }

  private bindActions(): void {
    const actions: Record<string, () => void> = {
      start: () => this.showScreen('settings'),
      'back-home': () => this.showScreen('home'),
      play: () => this.startGame(),
      'exit-game': () => this.exitGame(),
      'new-round': () => this.startGame(),
      'open-settings': () => this.exitGame(),
    };

    this.root.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
      const action = target?.dataset.action;
      if (action && action in actions) {
        actions[action]();
      }
    });
  }

  private showScreen(name: ScreenName): void {
    this.screens.forEach((screen, screenName) => {
      screen.hidden = screenName !== name;
    });
  }

  private startGame(): void {
    this.gameScreen.start(this.settings);
    this.showScreen('game');
  }

  private exitGame(): void {
    this.gameScreen.stop();
    this.showScreen('settings');
  }

  /** Überträgt Theme und Spielerfarben als Data-Attribut bzw. CSS-Variablen auf die Seite. */
  private applyVisualSettings(): void {
    const playerOne = findById(PLAYER_COLORS, this.settings.playerColorId);
    const playerTwo = PLAYER_COLORS.find((color) => color.id !== playerOne.id) ?? playerOne;
    const style = document.body.style;

    document.body.dataset.theme = this.settings.themeId;
    style.setProperty('--player-0-color', playerOne.hex);
    style.setProperty('--player-1-color', playerTwo.hex);
  }
}

new App(queryRequired(document, '.app'));
