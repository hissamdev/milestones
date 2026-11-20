import { db } from "@/db/client";
import { sessionData, sessions } from "@/db/schema/workouts";
import { useSessionStore } from "@/stores/session-store";
import { Exercise } from "@/types/routineTypes";
import { SessionData } from "@/types/session-types";
import { eq } from "drizzle-orm";

export async function markSessionActivityComplete(
    e: SessionData & { exercise: Exercise | null },
) {
    console.log("Persisting activity", e);

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

export async function markSessionComplete() {
    const session = useSessionStore.getState().singleSession;

    try {
        await db
            .update(sessions)
            .set({
                isComplete: true,
                endTime: new Date(),
            })
            .where(eq(sessions.id, session.nestedSession!.id));
    } catch (err) {
        console.error(err);
        throw err;
    }
}
