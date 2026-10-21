import { db } from "@/db/client";
import { daysOtw, routines, routineTemplates } from "@/db/schema/workouts";
import z from "zod";
export async function createRoutine(name: string) {
    const safeName = z.string().min(3).safeParse(name);
    if (!safeName.success) {
        console.error(safeName.error.issues[0]);
        return {
            success: false,
            message: "Invalid name",
        };
    }
    try {
        const res = await db
            .insert(routines)
            .values({
                name: safeName.data,
            })
            .returning();
        return {
            success: true,
            message: "Created routine" + safeName.data,
            data: res[0],
        };
    } catch (err) {
        console.error(err);
    }
}

export async function getRoutineDays(routineId: string) {
    try {
        const res = await db.query.daysOtw.findMany({
            where: {
                routineId,
            },
        });
        return {
            success: true,
            message: "Routine days fetched",
            data: res,
        };
    } catch (err) {
        console.error(err);
    }
}

export async function createRoutineDay(
    routineId: string,
    dayTitle: string,
    exerciseId: string,
    sequence: number,
) {
    // This is called when the user inserts an exercise to a routine day
    try {
        db.transaction((tx) => {
            const template = tx
                .insert(routineTemplates)
                .values({
                    exerciseId,
                    sequence,
                })
                .returning()
                .get();
            const templateId = template.id;

            tx.insert(daysOtw).values({
                routineId,
                dayTitle,
                routineTemplateId: templateId,
            });
        });
        console.log("Sucessfully created template and day");
        return {
            success: true,
            message: "Sucessfully created template and day",
        };
    } catch (err) {
        console.error(err);
        return;
    }
}
