import { db } from "@/db/client";
import { exercises } from "@/db/schema/workouts";

export async function getExercises() {
    try {
        const res = await db.select().from(exercises);
        return res;
    } catch (err) {
        console.error("Something went wrong", err);
    }
}

export async function createExercise(name: string, desc: string) {
    try {
        const res = await db
            .insert(exercises)
            .values({
                name: name.trim().toLowerCase(),
                displayName: name,
                type: "duration",
                desc,
            })
            .returning();
        return res[0];
    } catch (err) {
        console.error(err);
    }
}
