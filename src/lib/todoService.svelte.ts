// src/lib/todoService.svelte.ts
import {
	collection,
	onSnapshot,
	addDoc,
	updateDoc,
	doc,
	type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Todo, Task } from "./components/TieredTodoList/types";
import { browser } from "$app/environment";

/** Todo with Firestore document id */
export type TodoWithId = Todo & { id: string };

/** Firestore does not allow undefined; strip it from task objects before writing */
function tasksForFirestore(tasks: Task[]): Record<string, unknown>[] {
	return tasks.map((t) => {
		const out: Record<string, unknown> = { text: t.text, done: t.done };
		if (t.days != null && t.days.length > 0) out.days = t.days;
		if (t.id != null) out.id = t.id;
		return out;
	});
}

class TodoService {
	todos = $state<TodoWithId[]>([]);
	#unsubscribe: Unsubscribe | null = null;

	constructor() {
		if (browser && db) {
			this.#unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
				this.todos = snapshot.docs.map((d) => {
					const data = d.data();
					const rawTasks = Array.isArray(data.tasks) ? data.tasks : [];
					const tasks: Task[] = rawTasks.map((t: any) => ({
						text: String(t.text ?? ""),
						done: Boolean(t.done),
						id: typeof t.id === 'number' ? t.id : undefined,
						position: typeof t.position === 'number' ? t.position : 0,
						days: Array.isArray(t.days) ? (t.days as string[]) : undefined,
					}));
					return {
						id: d.id,
						position: typeof data.position === 'number' ? data.position : 0,
						heading: data.heading ?? "",
						tasks,
					} as TodoWithId;
				});
			});
		}
	}

	/** Create a new tiered section */
	async addTodo(heading: string): Promise<string> {
		if (!db) throw new Error("Firestore not available");
		const ref = await addDoc(collection(db, "todos"), {
			heading,
			tasks: [],
		});
		// Optimistic update so the Section dropdown has the new option immediately
		// (avoids select value resetting when Firestore onSnapshot hasn't fired yet)
		this.todos = [...this.todos, { id: ref.id, heading, tasks: [] } as TodoWithId];
		return ref.id;
	}

	/** Add a task to a specific section */
	async addTask(
		todoId: string,
		task: { text: string; done?: boolean; days?: string[] }
	): Promise<void> {
		if (!db) throw new Error("Firestore not available");
		const todo = this.todos.find((t) => t.id === todoId);
		if (!todo) return;
		const newTask: Task = {
			text: task.text,
			done: task.done ?? false,
			days: task.days?.length ? task.days : undefined,
		};
		const newTasks = [...todo.tasks, newTask];
		await updateDoc(doc(db, "todos", todoId), { tasks: tasksForFirestore(newTasks) });
	}

	/** Toggle a task's done state */
	async toggleTask(todoId: string, taskIndex: number): Promise<void> {
		if (!db) throw new Error("Firestore not available");
		const todo = this.todos.find((t) => t.id === todoId);
		if (!todo || taskIndex < 0 || taskIndex >= todo.tasks.length) return;
		const updated = [...todo.tasks];
		updated[taskIndex] = { ...updated[taskIndex], done: !updated[taskIndex].done };
		await updateDoc(doc(db, "todos", todoId), { tasks: tasksForFirestore(updated) });
	}

	/** Set all tasks in all sections to unchecked and sync to Firebase */
	async uncheckAll(): Promise<void> {
		if (!db) throw new Error("Firestore not available");
		const updates = this.todos.map((todo) =>
			updateDoc(doc(db, "todos", todo.id), {
				tasks: tasksForFirestore(todo.tasks.map((t) => ({ ...t, done: false }))),
			})
		);
		await Promise.all(updates);
	}

	destroy() {
		this.#unsubscribe?.();
	}
}

export const todoService = new TodoService();
