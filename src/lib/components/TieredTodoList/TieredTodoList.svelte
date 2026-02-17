<script lang="ts">
	import { longpress } from '$lib/actions/longpress';
 	import { todoService } from '$lib/todoService.svelte';

	/**
	 * Reusable Tiered Todo List Component
	 *
	 * Drop this component into any Svelte 5 project with Tailwind CSS.
	 * Requires: Tailwind CSS, Svelte 5
	 *
	 * @example
	 * <TieredTodoList
	 *   items={myTodos}
	 *   onToggle={(todoIndex, taskIndex) => handleToggle(todoIndex, taskIndex)}
	 *   onUncheckAll={() => resetAllTasks()}
	 *   showHeading={true}
	 * />
	 */
	import type { Todo, Task, Filters } from './types.js';

	interface Props {
		/** The tiered todo data: array of sections with heading + tasks */
		items: Todo[];
		/** Called when a task is toggled (todoIndex, taskIndex) */
		onToggle?: (todoIndex: number, taskIndex: number) => void;
		/** Called when "Uncheck all" is clicked */
		onUncheckAll?: () => void;
		/** Day filter: 'All' or e.g. 'Mon' – only tasks whose days include this are shown; taskIndex in onToggle is the index in the full task list */
		selectedDay?: string;
		/** Whether to show the section headings. Default: true */
		showHeading?: boolean;
		/** Whether to show the filter bar (all / active / completed). Default: true */
		showFilterBar?: boolean;
	}

	let {
		items,
		onToggle,
		onUncheckAll,
		selectedDay = 'All',
		showHeading = true,
		showFilterBar = true
	}: Props = $props();

	let filter = $state<Filters>('all');

	/** Filter tasks by selected day; each entry keeps originalIndex for onToggle */
	type TaskWithIndex = { task: Task; originalIndex: number };
	function tasksForDay(todo: Todo): TaskWithIndex[] {
		const isAll = !selectedDay || selectedDay === 'All';
		return todo.tasks
			.map((task, originalIndex) => ({ task, originalIndex }))
			.filter(({ task }) =>
				isAll
					? true
					: Array.isArray(task.days) && task.days.length > 0 && task.days.includes(selectedDay)
			);
	}

	let itemsByDay = $derived(
		items.map((todo) => ({ ...todo, tasksWithIndex: tasksForDay(todo) }))
	);

	let filteredItems = $derived(
		itemsByDay.map((todo) => {
			const statusFiltered =
				filter === 'all'
					? todo.tasksWithIndex
					: filter === 'active'
						? todo.tasksWithIndex.filter(({ task }) => !task.done)
						: todo.tasksWithIndex.filter(({ task }) => task.done);
			return { ...todo, tasksWithIndex: statusFiltered };
		})
	);

	function setFilter(newFilter: Filters) {
		filter = newFilter;
	}

	function toggleTodo(event: Event) {
		const target = event.target as HTMLElement;
		const todoIndex = +(target.closest('[data-todo-index]')?.getAttribute('data-todo-index') ?? -1);
		const taskIndex = +(target.closest('[data-task-index]')?.getAttribute('data-task-index') ?? -1);
		if (todoIndex >= 0 && taskIndex >= 0 && onToggle) {
			onToggle(todoIndex, taskIndex);
		}
	}

	// confirm delete section
	function handleLongPress(todoId: string, heading: string) {
        const proceed = confirm(`Delete section "${heading}" and all its tasks?`);
        if (proceed) {
            todoService.deleteTodo(todoId);
        }
    };

	// confirm delete task
	async function handleTaskLongPress(todoId: string, taskIndex: number, taskText: string) {
    if (confirm(`Delete task: "${taskText}"?`)) {
        await todoService.deleteTask(todoId, taskIndex);
    }
}

	// Shared button styles
const buttonStyle =
    'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 px-3 py-1.5 rounded-md text-sm font-medium text-current shadow-sm';	const buttonActive =
		'transition duration-600 active:ring-2 active:ring-offset-2 active:ring-pink-700';
	const buttonFocus =
		'transition duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-pink-700';
</script>

{#if showFilterBar}
	<div class="m-4 flex flex-row items-center justify-center gap-2">
		
			{#each ['all', 'active', 'completed'] as filterOption}
				<button
					type="button"
					class="{buttonStyle} {buttonFocus} capitalize flex-1 whitespace-nowrap"
					onclick={() => setFilter(filterOption as Filters)}
				>
					{filterOption}
				</button>
			{/each}

		<button
			type="button"
			class="{buttonStyle} {buttonActive} flex-1 whitespace-nowrap"
			onclick={() => onUncheckAll?.()}
		>
			Uncheck all
		</button>
	</div>
{/if}


<div class="grid gap-4 m-4 md:grid-cols-2 lg:grid-cols-3">
	{#each filteredItems as todo, todoIndex}
		<div
			class="flex flex-col items-center bg-slate-900 border-2 border-slate-600 rounded-lg overflow-hidden"
			data-todo-index={todoIndex}
		>
			{#if showHeading}
				<h2 use:longpress={600}
					onlongpress={() => handleLongPress(todo.id, todo.heading)}
					class="text-xl sm:text-2xl md:text-3xl text-center my-3 px-4">{todo.heading}</h2>
			{/if}
			<div class="w-full flex flex-col items-center pb-3">
				{#each todo.tasksWithIndex as { task, originalIndex }}
					<button
    type="button"
    use:longpress={600} 
    onlongpress={() => handleTaskLongPress(todo.id, originalIndex, task.text)}
    onclick={toggleTodo}
    data-todo-index={todoIndex}
    data-task-index={originalIndex}
    class="select-none {task.done
        ? 'w-11/12 p-2 mb-1 rounded-sm transition duration-300 opacity-10 bg-slate-700 text-left'
        : 'w-11/12 p-2 mb-1 rounded-sm bg-slate-700 opacity-90 text-left hover:opacity-100 transition duration-300'}"
>
    {task.text}
</button>
				{/each}
			</div>
		</div>
	{/each}
</div>


