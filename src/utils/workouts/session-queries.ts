import { db } from "@/db/client";
import { sessionData } from "@/db/schema/workouts";
import { Exercise } from "@/types/routineTypes";
import { SessionData } from "@/types/session-types";

export async function markSessionActivityComplete(
    e: SessionData & { exercise: Exercise | null },
) {
    try {
        console.log("Saving");
        await db
            .insert(sessionData)
            .values(e)
            .onConflictDoUpdate({ target: sessionData.id, set: { ...e } });
    } catch (err) {
        console.error(err);
    }
}
