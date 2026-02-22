// src/lib/actions/longpress.d.ts (or src/app.d.ts)
declare namespace svelteHTML {
    interface HTMLAttributes<T> {
        'onlongpress'?: (event: CustomEvent) => void;
    }
}