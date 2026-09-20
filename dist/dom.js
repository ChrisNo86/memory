export function queryRequired(root, selector) {
    const element = root.querySelector(selector);
    if (!element) {
        throw new Error(`Element nicht gefunden: ${selector}`);
    }
    return element;
}
export function createElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}
