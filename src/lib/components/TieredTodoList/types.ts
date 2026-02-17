/**
 * Reusable Tiered Todo List - Type definitions
 * Copy this file along with TieredTodoList.svelte to your new project.
 */


export type Task = {
	text: string;
	done: boolean;
	id?: number;
	// position is a number to sort the headings
	position?: number;
	/** Day labels (e.g. 'Mon', 'Tue') for filtering; empty or missing = show when "All" selected */
	days?: string[];
};



export type Todo = {
	heading: string;
	tasks: Task[];
};

export type Filters = 'all' | 'active' | 'completed';
