const SVG_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const ICON_PATHS = {
    controller: '<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-4 3.6C2.6 9.4 2 14.5 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.4-1.4a2 2 0 0 1 1.4-.6h4.4a2 2 0 0 1 1.4.6L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.5-.6-6.6-.7-7.3A4 4 0 0 0 17.3 5z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    play: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 9l5 3-5 3z"/>',
    palette: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.3a1.8 1.8 0 0 0-1.4 2.8l.3.4A1.8 1.8 0 0 1 12 22z"/><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/>',
    pawn: '<circle cx="12" cy="6.5" r="3"/><path d="M8 12h8"/><path d="M9.5 12c0 3-3 4-3 8h11c0-4-3-5-3-8"/>',
    cards: '<rect x="4" y="6" width="12" height="15" rx="2"/><path d="M8 3h11a1 1 0 0 1 1 1v13"/>',
    exit: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    scales: '<path d="M12 3v18M8 21h8M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    'screen-code': '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 21h6M12 16v5M10 8l-2 2 2 2M14 8l2 2-2 2"/>',
};
export function iconMarkup(name) {
    return `${SVG_OPEN}${ICON_PATHS[name]}</svg>`;
}
export function createIcon(name, className = 'icon') {
    const element = document.createElement('span');
    element.className = className;
    element.setAttribute('aria-hidden', 'true');
    element.innerHTML = iconMarkup(name);
    return element;
}
/** Ersetzt alle Elemente mit `data-icon="<name>"` durch das passende SVG. */
export function hydrateIcons(root) {
    root.querySelectorAll('[data-icon]').forEach((element) => {
        const name = element.dataset.icon;
        if (name in ICON_PATHS) {
            element.innerHTML = iconMarkup(name);
        }
    });
}
