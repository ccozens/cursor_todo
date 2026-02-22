import { todoService } from '$lib/todoService.svelte';

export function createToggleHandler(onToggle?: (todoIndex: number, taskIndex: number) => void) {
    return (event: Event) => {
        const target = event.target as HTMLElement;
        const todoIndex = +(target.closest('[data-todo-index]')?.getAttribute('data-todo-index') ?? -1);
        const taskIndex = +(target.closest('[data-task-index]')?.getAttribute('data-task-index') ?? -1);
        if (todoIndex >= 0 && taskIndex >= 0 && onToggle) {
            onToggle(todoIndex, taskIndex);
        }
    };
}

export function createSectionDeleteHandler() {
    return (todoId: string, heading: string) => {
        const proceed = confirm(`Delete section "${heading}" and all its tasks?`);
        if (proceed) {
            todoService.deleteSection(todoId);
        }
    };
}

export function createTaskDeleteHandler() {
    return async (todoId: string, taskIndex: number, taskText: string) => {
        if (confirm(`Delete task: "${taskText}"?`)) {
            await todoService.deleteTask(todoId, taskIndex);
        }
    };
}