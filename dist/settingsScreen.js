import { BOARD_SIZES, PLAYER_COLORS, THEMES, findById } from './config.js';
import { createElement, queryRequired } from './dom.js';
import { createIcon } from './icons.js';
import { createScoreItem } from './scoreChip.js';
const GROUPS = [
    { group: 'theme', key: 'themeId', options: THEMES },
    { group: 'player', key: 'playerColorId', options: PLAYER_COLORS },
    { group: 'board-size', key: 'boardSizeId', options: BOARD_SIZES },
];
export class SettingsScreen {
    root;
    onChange;
    settings;
    preview;
    previewSymbol;
    summaryTheme;
    summaryPlayer;
    summarySize;
    constructor(root, initialSettings, onChange) {
        this.root = root;
        this.onChange = onChange;
        this.settings = { ...initialSettings };
        this.preview = queryRequired(root, '[data-ref="preview"]');
        this.previewSymbol = queryRequired(root, '[data-ref="preview-symbol"]');
        this.summaryTheme = queryRequired(root, '[data-ref="summary-theme"]');
        this.summaryPlayer = queryRequired(root, '[data-ref="summary-player"]');
        this.summarySize = queryRequired(root, '[data-ref="summary-size"]');
        GROUPS.forEach((definition) => this.renderGroup(definition));
        this.renderPreviewBar();
        this.renderSelection();
    }
    renderGroup({ group, key, options }) {
        const container = queryRequired(this.root, `[data-group="${group}"] .settings__options`);
        container.replaceChildren(...options.map((option) => this.createOption(group, key, option)));
    }
    createOption(group, key, option) {
        const label = createElement('label', 'option');
        const input = createElement('input', 'option__input');
        input.type = 'radio';
        input.name = group;
        input.value = option.id;
        input.checked = this.settings[key] === option.id;
        input.addEventListener('change', () => {
            this.settings = { ...this.settings, [key]: option.id };
            this.renderSelection();
            this.onChange({ ...this.settings });
        });
        label.append(input, createElement('span', 'option__radio'), createElement('span', 'option__label', option.label), createElement('span', 'option__marker'));
        return label;
    }
    /** Zeigt in der Vorschau die Kopfleiste des Spiels (Punktestand, Spieler, Exit). */
    renderPreviewBar() {
        const [first, second] = PLAYER_COLORS;
        queryRequired(this.root, '[data-ref="preview-scores"]').replaceChildren(createScoreItem(first, 0), createScoreItem(second, 6));
        const turnIcon = createIcon('pawn', 'preview__turn-icon');
        turnIcon.style.color = first.hex;
        queryRequired(this.root, '[data-ref="preview-turn"]').replaceChildren('Current player: ', turnIcon);
    }
    /** Aktualisiert Vorschau und Zusammenfassung passend zur Auswahl. */
    renderSelection() {
        const theme = findById(THEMES, this.settings.themeId);
        this.preview.dataset.theme = theme.id;
        this.previewSymbol.src = theme.symbols[0];
        this.summaryTheme.textContent = theme.label;
        this.summaryPlayer.textContent = findById(PLAYER_COLORS, this.settings.playerColorId).label;
        this.summarySize.textContent = findById(BOARD_SIZES, this.settings.boardSizeId).label;
    }
}
