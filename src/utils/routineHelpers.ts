import { db } from "@/db/client";
import {
    daysOtw,
    routines,
    routineTemplateExercises,
    routineTemplates,
} from "@/db/schema/workouts";
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

export async function getRoutines() {
    try {
        const res = await db.query.routines.findMany({
            with: {
                daysOtw: true,
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

export async function getRoutineDays(routineId: string) {
    try {
        const res = await db.query.daysOtw.findMany({
            where: {
                routineId,
            },
            with: {
                routineTemplate: {
                    with: {
                        templateExercises: {
                            with: {
                                exercise: true,
                            },
                            orderBy: {
                                sequence: "asc",
                            },
                        },
                    },
                },
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
    // This is called when the user inserts a first exercise into a routine day
}

export async function insertRoutineExercise(
    routineId: string,
    selectedDay: string,
    exerciseId: string,
    sequence: number,
) {
    try {
        const res = await db.query.daysOtw.findFirst({
            where: {
                routineId,
                dayTitle: selectedDay.trim().toLocaleLowerCase(),
            },
        });
        if (!res) {
            // Check if the day exists, if not, create it, and insert the exercise in its appropriate template
            db.transaction((tx) => {
                const templateInfo = tx
                    .insert(routineTemplates)
                    .values({
                        restDay: false,
                    })
                    .returning()
                    .get();
                tx.insert(daysOtw).values({
                    routineId,
                    routineTemplateId: templateInfo.id,
                    dayTitle: selectedDay.trim().toLowerCase(),
                });
                tx.insert(routineTemplateExercises).values({
                    templateId: templateInfo.id,
                    exerciseId,
                    sequence,
                });
            });
            const days = await db.query.daysOtw.findMany({
                with: {
                    routineTemplate: {
                        with: {
                            templateExercises: {
                                with: {
                                    exercise: true,
                                },
                                orderBy: {
                                    sequence: "asc",
                                },
                            },
                        },
                    },
                },
            });
            return days;
        }
    } catch (err) {
        console.error(err);
        return;
    }
}
