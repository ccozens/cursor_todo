export const buttonStyles = {
    base: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 px-3 py-1.5 rounded-md text-sm font-medium text-current shadow-sm',
    active: 'transition duration-600 active:ring-2 active:ring-offset-2 active:ring-pink-700',
    focus: 'transition duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-pink-700'
} as const;

export const taskStyles = {
    done: 'w-11/12 p-2 mb-1 rounded-sm transition duration-300 opacity-10 bg-slate-700 text-left',
    active: 'w-11/12 p-2 mb-1 rounded-sm bg-slate-700 opacity-90 text-left hover:opacity-100 transition duration-300'
} as const;