export function longpress(node: HTMLElement, duration = 1000) {
    let timer: number;
    let isLongPress = false;

    const handleStart = (e: Event) => {
        isLongPress = false; // Reset
        timer = window.setTimeout(() => {
            isLongPress = true;
            node.dispatchEvent(new CustomEvent('longpress'));
        }, duration);
    };

    const handleEnd = (e: Event) => {
        clearTimeout(timer);
    };

    const handleClick = (e: Event) => {
        // If it was a long press, stop the normal click (toggle) from happening
        if (isLongPress) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    };

    node.addEventListener('mousedown', handleStart);
    node.addEventListener('touchstart', handleStart, { passive: true });
    node.addEventListener('click', handleClick, { capture: true }); // Capture the click
    node.addEventListener('mouseup', handleEnd);
    node.addEventListener('touchend', handleEnd);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleStart);
            node.removeEventListener('touchstart', handleStart);
            node.removeEventListener('click', handleClick);
            node.removeEventListener('mouseup', handleEnd);
            node.removeEventListener('touchend', handleEnd);
        }
    };
}