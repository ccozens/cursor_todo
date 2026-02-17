export function longpress(node: HTMLElement, duration = 500) {
    let timer: number;

    const handleStart = () => {
        timer = window.setTimeout(() => {
            node.dispatchEvent(new CustomEvent('longpress'));
        }, duration);
    };

    const handleEnd = () => {
        clearTimeout(timer);
    };

    node.addEventListener('mousedown', handleStart);
    node.addEventListener('mouseup', handleEnd);
    node.addEventListener('touchstart', handleStart, { passive: true });
    node.addEventListener('touchend', handleEnd);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleStart);
            node.removeEventListener('mouseup', handleEnd);
            node.removeEventListener('touchstart', handleStart);
            node.removeEventListener('touchend', handleEnd);
        }
    };
}