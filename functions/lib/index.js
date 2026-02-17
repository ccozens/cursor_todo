"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAllTodosAt2am = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const logger = __importStar(require("firebase-functions/logger"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
function normalizeTask(input) {
    if (input == null || typeof input !== "object")
        return null;
    const t = input;
    const out = {
        text: typeof t.text === "string" ? t.text : "",
        done: false,
    };
    if (typeof t.id === "number")
        out.id = t.id;
    if (Array.isArray(t.days) && t.days.every((d) => typeof d === "string") && t.days.length > 0) {
        out.days = t.days;
    }
    return out;
}
/**
 * Runs daily at 2:00 AM (UTC by default).
 * - Reads all docs in `todos`
 * - Sets every task's `done` => false
 * - Preserves task fields like `text`, `days`, `id` (and drops undefined)
 */
exports.resetAllTodosAt2am = (0, scheduler_1.onSchedule)({
    schedule: "0 2 * * *",
    timeZone: "UTC", // change to your timezone, e.g. "Europe/London"
    region: "us-central1",
}, async () => {
    const db = admin.firestore();
    const snapshot = await db.collection("todos").get();
    if (snapshot.empty) {
        logger.info("No todos to reset.");
        return;
    }
    const writer = db.bulkWriter();
    let updatedDocs = 0;
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const rawTasks = Array.isArray(data.tasks) ? data.tasks : [];
        const normalizedTasks = rawTasks.map(normalizeTask).filter(Boolean);
        writer.update(docSnap.ref, { tasks: normalizedTasks });
        updatedDocs += 1;
    });
    await writer.close();
    logger.info("Reset tasks to unchecked.", { updatedDocs });
});
