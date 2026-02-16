# Tiered Todo List Component

A reusable Svelte 5 component with tiered todo layout, dark theme styling, and filter controls. Copy to any new Svelte project with Tailwind CSS.

## Files to Copy

Copy these files to your new project:

```
src/lib/components/TieredTodoList/
├── TieredTodoList.svelte
├── types.ts
├── index.ts
└── README.md (optional)
```

## Requirements

- **Svelte 5** (uses runes: `$props`, `$state`, `$derived`)
- **Tailwind CSS** v3+
- **TypeScript** (optional but recommended)

## Setup in New Project

1. Add Tailwind CSS if not already present.
2. Ensure your base styles use a light text color (e.g. `text-yellow-50` or `text-slate-100`) since the component uses dark backgrounds.
3. Copy the `TieredTodoList` folder into `src/lib/components/`.

## Usage

### Basic usage

```svelte
<script lang="ts">
  import { TieredTodoList } from '$lib/components/TieredTodoList';
  import type { Todo } from '$lib/components/TieredTodoList';

  const todos = $state<Todo[]>([
    {
      heading: 'Section Name',
      tasks: [
        { text: 'Task one', done: false },
        { text: 'Task two', done: true }
      ]
    }
  ]);

  function handleToggle(todoIndex: number, taskIndex: number) {
    const task = todos[todoIndex].tasks[taskIndex];
    task.done = !task.done;
  }

  function handleUncheckAll() {
    todos.forEach((todo) => {
      todo.tasks.forEach((t) => (t.done = false));
    });
  }
</script>

<TieredTodoList
  items={todos}
  onToggle={handleToggle}
  onUncheckAll={handleUncheckAll}
/>
```

### With optional props

```svelte
<TieredTodoList
  items={todos}
  onToggle={handleToggle}
  onUncheckAll={handleUncheckAll}
  showHeading={true}
  showFilterBar={true}
/>
```

| Prop           | Type     | Default | Description                                      |
|----------------|----------|---------|--------------------------------------------------|
| `items`        | `Todo[]` | required| Tiered todo data (sections with heading + tasks) |
| `onToggle`     | `(todoIndex, taskIndex) => void` | - | Called when a task is clicked to toggle done state |
| `onUncheckAll` | `() => void` | - | Called when "Uncheck all" is clicked            |
| `showHeading`  | `boolean`| `true`  | Whether to show section headings                 |
| `showFilterBar`| `boolean`| `true`  | Whether to show All / Active / Completed filters |

## Data Types

```ts
type Task = {
  text: string;
  done: boolean;
  id?: number;  // optional, for persistence
};

type Todo = {
  heading: string;
  tasks: Task[];
};
```

## Styling

The component uses Tailwind classes and is responsive:

- **Grid**: 1 column on mobile, 2 on `md`, 3 on `lg`
- **Section cards**: `bg-slate-900`, `border-slate-600`, rounded corners
- **Task buttons**: `bg-slate-700`, opacity changes on done state
- **Filter bar**: Gradient buttons (`indigo → purple → pink`), stacked on mobile, row on `sm+`

To restyle, edit the Tailwind classes directly in `TieredTodoList.svelte`.
