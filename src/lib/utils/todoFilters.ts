import dayjs from 'dayjs';
import type { Todo, Task, Filters } from '$lib/types';

export type TaskWithIndex = { task: Task; originalIndex: number };

export function getTodayDay(): string {
    return dayjs().format('ddd');
}

export function filterTasksByDay(todo: Todo, selectedDay: string): TaskWithIndex[] {
    const isAll = !selectedDay || selectedDay === 'All';
    return todo.tasks
        .map((task, originalIndex) => ({ task, originalIndex }))
        .filter(({ task }) =>
            isAll
                ? true
                : Array.isArray(task.days) && task.days.length > 0 && task.days.includes(selectedDay)
        );
}

export function filterTasksByStatus(
    tasksWithIndex: TaskWithIndex[],
    filter: Filters
): TaskWithIndex[] {
    if (filter === 'all') return tasksWithIndex;
    if (filter === 'active') return tasksWithIndex.filter(({ task }) => !task.done);
    return tasksWithIndex.filter(({ task }) => task.done);
}

export function applyFilters(
    items: Todo[],
    selectedDay: string,
    statusFilter: Filters
): Array<Todo & { tasksWithIndex: TaskWithIndex[] }> {
    return items
        .map((todo) => ({
            ...todo,
            tasksWithIndex: filterTasksByDay(todo, selectedDay)
        }))
        .map((todo) => ({
            ...todo,
            tasksWithIndex: filterTasksByStatus(todo.tasksWithIndex, statusFilter)
        }));
}