<script lang="ts">
    import { longpress } from '$lib/actions/longpress';
    import { applyFilters, getTodayDay } from '$lib/utils/todoFilters';
    import { 
        createToggleHandler, 
        createSectionDeleteHandler, 
        createTaskDeleteHandler 
    } from '$lib/utils/todoHandlers';
    import { buttonStyles, taskStyles } from '$lib/utils/styles';
    import type { Todo, Filters } from '$lib/types';

    interface Props {
        items: Todo[];
        onToggle?: (todoIndex: number, taskIndex: number) => void;
        onUncheckAll?: () => void;
        selectedDay?: string;
        showHeading?: boolean;
        showFilterBar?: boolean;
    }

    let {
        items,
        onToggle,
        onUncheckAll,
        selectedDay = getTodayDay(),
        showHeading = true,
        showFilterBar = true
    }: Props = $props();

    let filter = $state<Filters>('all');

    // Derived state
    let filteredItems = $derived(applyFilters(items, selectedDay, filter));

    // Handlers
    const toggleTodo = createToggleHandler(onToggle);
    const handleSectionDelete = createSectionDeleteHandler();
    const handleTaskDelete = createTaskDeleteHandler();
</script>

{#if showFilterBar}
    <div class="m-4 flex flex-row items-center justify-center gap-2">
        {#each ['all', 'active', 'completed'] as filterOption}
            <button
                type="button"
                class="{buttonStyles.base} {buttonStyles.focus} capitalize flex-1 whitespace-nowrap"
                onclick={() => filter = filterOption as Filters}
            >
                {filterOption}
            </button>
        {/each}

        <button
            type="button"
            class="{buttonStyles.base} {buttonStyles.active} flex-1 whitespace-nowrap"
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
                <h2 
                    use:longpress={600}
                    onlongpress={() => handleSectionDelete(todo.id, todo.heading)}
                    class="text-xl sm:text-2xl md:text-3xl text-center my-3 px-4"
                >
                    {todo.heading}
                </h2>
            {/if}
            <div class="w-full flex flex-col items-center pb-3">
                {#each todo.tasksWithIndex as { task, originalIndex }}
                    <button
                        type="button"
                        use:longpress={600} 
                        onlongpress={() => handleTaskDelete(todo.id, originalIndex, task.text)}
                        onclick={toggleTodo}
                        data-todo-index={todoIndex}
                        data-task-index={originalIndex}
                        class="select-none {task.done ? taskStyles.done : taskStyles.active}"
                    >
                        {task.text}
                    </button>
                {/each}
            </div>
        </div>
    {/each}
</div>