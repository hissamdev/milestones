import { db } from "@/db/client";
import { exercises, routineTemplateExercises } from "@/db/schema/workouts";
import { eq } from "drizzle-orm";
import { generateUuid } from "./helpers";

export async function getExercises() {
    try {
        const res = await db.select().from(exercises);
        return res;
    } catch (err) {
        console.error("Something went wrong", err);
    }
}

export async function createExercise(name: string, desc: string, type: string) {
    try {
        const res = await db
            .insert(exercises)
            .values({
                id: generateUuid(),
                name: name.trim().toLowerCase(),
                displayName: name,
                type,
                desc,
            })
            .returning();
        return res[0];
    } catch (err) {
        console.error(err);
    }
}

export async function deleteExercise(exerciseId: string) {
    try {
        await db.delete(exercises).where(eq(exercises.id, exerciseId));
        await db
            .delete(routineTemplateExercises)
            .where(eq(routineTemplateExercises.exerciseId, exerciseId));
    } catch (err) {
        console.error("Failed to delete exercise", err);
    }
}
