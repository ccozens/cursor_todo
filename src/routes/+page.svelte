<script lang="ts">
  import { todoService } from '$lib/todoService.svelte';
  import { TieredTodoList } from '$lib/components/TieredTodoList';
	import dayjs from 'dayjs';

  

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
  const today = dayjs().format('ddd');
  let selectedDay = $state<string>(today);

    // debug day
  console.log('Today is:', today);
  console.log('selectedDay is:', selectedDay);

  // Add Task form state
  const NEW_SECTION_VALUE = '__new__';
  let addTaskSectionId = $state<string>('');
  let addTaskNewHeading = $state('');
  let addTaskText = $state('');
  let everyDay = $state(true);
  let addTaskDays = $state<string[]>([]);

  function toggleAddTaskDay(day: string) {
    addTaskDays = addTaskDays.includes(day)
      ? addTaskDays.filter((d) => d !== day)
      : [...addTaskDays, day];
  }

  async function submitAddTask() {
    const text = addTaskText.trim();
    if (!text) return;
    let sectionId = addTaskSectionId;
    if (sectionId === NEW_SECTION_VALUE) {
      const heading = addTaskNewHeading.trim();
      if (!heading) return;
      sectionId = await todoService.addTodo(heading);
      addTaskSectionId = sectionId;
      addTaskNewHeading = '';
    }
    if (!sectionId) return;
    const days = everyDay ? [...DAYS] : (addTaskDays.length ? [...addTaskDays] : undefined);
    await todoService.addTask(sectionId, { text, days });
    addTaskText = '';
    everyDay = true;
    addTaskDays = [];
  }
</script>

<!-- Loading state -->
{#if todoService.loading && todoService.todos.length === 0}
  <div class="m-4 p-4 text-center text-slate-400">Loading your todos...</div>
{:else}
  <TieredTodoList
    items={todoService.todos}
    selectedDay={selectedDay}
    onToggle={(todoIndex, taskIndex) => {
      const todo = todoService.todos[todoIndex];
      if (todo) todoService.toggleTask(todo.id, taskIndex);
    }}
    onUncheckAll={() => todoService.uncheckAll()}
  />

<!-- Add Task Form -->
<section class="m-4 p-4 bg-slate-800 rounded-xl border border-slate-600 max-w-md">
  <h2 class="text-lg font-semibold text-slate-200 mb-3">Add Task</h2>
  <form
    class="flex flex-col gap-3"
    onsubmit={(e) => {
      e.preventDefault();
      submitAddTask();
    }}
  >
    <label class="flex flex-col gap-1">
      <span class="text-slate-400 text-sm">Section</span>
      <select
        class="bg-slate-700 text-slate-200 rounded-lg px-3 py-2 border border-slate-600"
        bind:value={addTaskSectionId}
      >
        <option value="">Choose a section</option>
        <option value={NEW_SECTION_VALUE}>Create new category...</option>
        {#each todoService.todos as todo (todo.id)}
          <option value={todo.id}>{todo.heading || 'Untitled'}</option>
        {/each}
      </select>
      {#if addTaskSectionId === NEW_SECTION_VALUE}
        <input
          type="text"
          class="mt-2 bg-slate-700 text-slate-200 rounded-lg px-3 py-2 border border-slate-600"
          placeholder="New section heading"
          bind:value={addTaskNewHeading}
        />
      {/if}
    </label>
    <label class="flex flex-col gap-1">
      <span class="text-slate-400 text-sm">Task</span>
      <input
        type="text"
        class="bg-slate-700 text-slate-200 rounded-lg px-3 py-2 border border-slate-600"
        placeholder="Task text"
        bind:value={addTaskText}
        required
      />
    </label>
    <div class="flex flex-col gap-1">
      <span class="text-slate-400 text-sm">Days</span>
      <label class="inline-flex items-center gap-2 cursor-pointer mb-2">
        <input
          type="checkbox"
          class="rounded border-slate-500 bg-slate-700 text-indigo-500"
          bind:checked={everyDay}
        />
        <span class="text-slate-300 text-sm">Every day</span>
      </label>
      <div class="flex flex-wrap gap-2">
        {#each DAYS as day}
          <label class="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              class="rounded border-slate-500 bg-slate-700 text-indigo-500"
              checked={addTaskDays.includes(day)}
              onchange={() => toggleAddTaskDay(day)}
            />
            <span class="text-slate-300 text-sm">{day}</span>
          </label>
        {/each}
      </div>
    </div>
    <button
      type="submit"
      class="mt-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
    >
      Add Task
    </button>
  </form>
</section>

{/if}
