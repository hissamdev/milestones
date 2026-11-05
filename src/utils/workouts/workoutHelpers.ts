import { db } from "@/db/client";
import { workoutDay } from "@/db/schema/workouts";
import { generateUuid } from "../helpers";

export async function getCurrentDayWorkout() {
    try {
        const res = await db.query.workoutDay.findFirst({
            where: {
                creationDay: new Date().toDateString(),
            },
        });
        if (!res) {
            try {
                const create = await db
                    .insert(workoutDay)
                    .values({
                        id: generateUuid(),
                    })
                    .returning();

                return create[0];
            } catch (err) {
                console.error("Something went wrong: Workouts", err);
                return;
            }
        }
        return res;
    } catch (err) {
        console.error("Something went wrong: Workouts\n", err);
        return;
    }
}
