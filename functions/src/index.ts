import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

type FirestoreTask = {
  text: string;
  done: boolean;
  id?: number;
  days?: string[];
};

function normalizeTask(input: unknown): FirestoreTask | null {
  if (input == null || typeof input !== "object") return null;
  const t = input as Record<string, unknown>;

  const out: FirestoreTask = {
    text: typeof t.text === "string" ? t.text : "",
    done: false,
  };

  if (typeof t.id === "number") out.id = t.id;
  if (Array.isArray(t.days) && t.days.every((d) => typeof d === "string") && t.days.length > 0) {
    out.days = t.days as string[];
  }

  return out;
}

/**
 * Runs daily at 2:00 AM (UTC by default).
 * - Reads all docs in `todos`
 * - Sets every task's `done` => false
 * - Preserves task fields like `text`, `days`, `id` (and drops undefined)
 */
export const resetAllTodosAt2am = onSchedule(
  {
    schedule: "0 2 * * *",
    timeZone: "UTC", // change to your timezone, e.g. "Europe/London"
    region: "us-central1",
  },
  async () => {
    const db = admin.firestore();

    const snapshot = await db.collection("todos").get();
    if (snapshot.empty) {
      logger.info("No todos to reset.");
      return;
    }

    const writer = db.bulkWriter();

    let updatedDocs = 0;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      const rawTasks = Array.isArray(data.tasks) ? data.tasks : [];
      const normalizedTasks = rawTasks.map(normalizeTask).filter(Boolean) as FirestoreTask[];

      writer.update(docSnap.ref, { tasks: normalizedTasks });
      updatedDocs += 1;
    });

    await writer.close();
    logger.info("Reset tasks to unchecked.", { updatedDocs });
  }
);

