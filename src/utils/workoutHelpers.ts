import { db } from "@/db/client";
import { workouts } from "@/db/schema/workouts";

export async function getCurrentDayWorkout() {
    try {
        const res = await db.query.workouts.findFirst({
            where: {
                creationDay: new Date().toDateString(),
            },
        });
        if (!res) {
            try {
                const create = await db.insert(workouts).values({}).returning();

                return create[0];
            } catch (err) {
                console.error("Something went wrong: Workouts");
                return;
            }
        }
        return res;
    } catch (err) {
        console.error("Something went wrong: Workouts\n", err);
        return;
    }
}
