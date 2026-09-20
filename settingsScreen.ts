import { BOARD_SIZES, PLAYER_COLORS, THEMES } from './config';
import { createElement, queryRequired } from './dom';
import type { Settings } from './types';

interface Option {
  id: string;
  label: string;
  preview?: string;
  color?: string;
}

type SettingsKey = keyof Settings;

interface GroupDefinition {
  group: string;
  key: SettingsKey;
  options: readonly Option[];
}

const GROUPS: readonly GroupDefinition[] = [
  {
    group: 'player',
    key: 'playerColorId',
    options: PLAYER_COLORS.map(({ id, label, hex }) => ({ id, label, color: hex })),
  },
  {
    group: 'board-size',
    key: 'boardSizeId',
    options: BOARD_SIZES.map(({ id, label }) => ({ id, label })),
  },
  {
    group: 'theme',
    key: 'themeId',
    options: THEMES.map(({ id, label, symbols }) => ({ id, label, preview: symbols.slice(0, 3).join(' ') })),
  },
];

export class SettingsScreen {
  private settings: Settings;

  constructor(
    private readonly root: HTMLElement,
    initialSettings: Settings,
    private readonly onChange: (settings: Settings) => void,
  ) {
    this.settings = { ...initialSettings };
    GROUPS.forEach((definition) => this.renderGroup(definition));
  }

  getSettings(): Settings {
    return { ...this.settings };
  }

  private renderGroup({ group, key, options }: GroupDefinition): void {
    const container = queryRequired(this.root, `[data-group="${group}"] .settings__options`);
    container.replaceChildren(...options.map((option) => this.createOption(group, key, option)));
  }

  private createOption(group: string, key: SettingsKey, option: Option): HTMLLabelElement {
    const label = createElement('label', 'option');

    const input = createElement('input', 'option__input');
    input.type = 'radio';
    input.name = group;
    input.value = option.id;
    input.checked = this.settings[key] === option.id;
    input.addEventListener('change', () => {
      this.settings = { ...this.settings, [key]: option.id };
      this.onChange(this.getSettings());
    });

    const card = createElement('span', 'option__card');
    if (option.color) {
      const swatch = createElement('span', 'option__swatch');
      swatch.style.backgroundColor = option.color;
      card.append(swatch);
    }
    if (option.preview) {
      card.append(createElement('span', 'option__preview', option.preview));
    }
    card.append(createElement('span', 'option__label', option.label));

    label.append(input, card);
    return label;
  }
}
