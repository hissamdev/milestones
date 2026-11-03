import { db } from "@/db/client";
import {
    daysOtw,
    routineDataTopLevel,
    routineExerciseData,
    routines,
    routineTemplateExercises,
    routineTemplates,
} from "@/db/schema/workouts";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "expo-crypto";
import z from "zod";
import { generateUuid } from "../helpers";
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
                id: generateUuid(),
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
                daysOtw: {
                    with: {
                        routineTemplate: {
                            with: {
                                templateExercises: true,
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

export async function insertRoutineExercise(
    routineId: string,
    selectedDay: string,
    sequence: number,
    exerciseId?: string,
) {
    try {
        const res = await db.query.daysOtw.findFirst({
            where: {
                routineId,
                dayTitle: selectedDay.trim().toLocaleLowerCase(),
            },
            with: {
                routineTemplate: {
                    with: {
                        templateExercises: {
                            with: {
                                exercise: true,
                            },
                        },
                    },
                },
            },
        });

        if (!res) {
            if (!exerciseId) {
                console.error("Day was not found for rest type", exerciseId);
                return;
            }
            // Check if the day exists, if not, create it, and insert the exercise in its appropriate template
            const templateInsert = await db
                .insert(routineTemplates)
                .values({
                    id: generateUuid(),
                })
                .returning();
            await db.insert(daysOtw).values({
                id: generateUuid(),
                routineId,
                routineTemplateId: templateInsert[0].id,
                dayTitle: selectedDay,
            });
            await db.insert(routineTemplateExercises).values({
                id: generateUuid(),
                templateId: templateInsert[0].id,
                exerciseId,
                sequence,
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

        if (!exerciseId) {
            const previousExerciseExists =
                res.routineTemplate.templateExercises.find(
                    (te) => te.sequence === sequence - 1,
                );
            if (!previousExerciseExists) {
                return;
            }

            await db.insert(routineTemplateExercises).values({
                id: generateUuid(),
                templateId: res.routineTemplate.id,
                sequence,
                displayRestAmount: 120,
                isRestType: true,
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
        await db.insert(routineTemplateExercises).values({
            id: generateUuid(),
            templateId: res.routineTemplateId,
            exerciseId,
            sequence,
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
        console.log(JSON.stringify(days, null, 2));
        return days;
    } catch (err: any) {
        console.error("Failed to insert into template or create day", err);
        console.error("More info", err.cause, err.code, err.message);
        return;
    }
}

export async function updateAmount(
    templateExerciseId: string,
    newAmount: number,
) {
    try {
        await db
            .update(routineTemplateExercises)
            .set({
                displayAmount: newAmount,
            })
            .where(eq(routineTemplateExercises.id, templateExerciseId));
        console.log("DB Updated with amount", newAmount);
    } catch (err) {
        console.error(err);
    }
}

const daysOfTheWeek = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

export async function getCurrentDayExercises(routineId: string) {
    const currentDay = daysOfTheWeek[(new Date().getDay() + 1) % 7];

    try {
        const res = await db.query.daysOtw.findFirst({
            where: {
                routineId,
                dayTitle: "sat",
            },
            with: {
                routineTemplate: {
                    with: {
                        templateExercises: {
                            orderBy: {
                                sequence: "asc",
                            },
                            with: {
                                exercise: true,
                            },
                        },
                    },
                },
            },
        });
        return res;
    } catch (err) {
        console.error("Something went wrong", err);
    }
}

export async function removeTemplateExercise(templateExerciseId: string) {
    try {
        await db
            .delete(routineTemplateExercises)
            .where(eq(routineTemplateExercises.id, templateExerciseId));
    } catch (err) {
        console.error("Failed to remove TE", err);
    }
}

export async function getSingleRoutine(routineId: string) {
    try {
        const res = await db.query.routines.findFirst({
            where: {
                id: routineId,
            },
            with: {
                daysOtw: {
                    with: {
                        routineTemplate: {
                            with: {
                                templateExercises: {
                                    orderBy: {
                                        sequence: "asc",
                                    },
                                },
                            },
                        },
                    },
                },
                routineData: {
                    limit: 30,
                    orderBy: {
                        interactionTime: "desc",
                    },
                    with: {
                        dataExercises: {
                            orderBy: {
                                sequence: "asc",
                            },
                        },
                    },
                },
            },
        });

        if (!res) {
            throw new Error("Something went wrong");
        }

        return res;
    } catch (err) {
        console.error(err);
        throw new Error("Something went wrong");
    }
}
export type Routine = Awaited<ReturnType<typeof getSingleRoutine>>;

export async function createCurrentDayData(routineId: string) {
    const [res] = await db
        .insert(routineDataTopLevel)
        .values({
            id: randomUUID(),
            routineId,
            completionPercentage: 0,
        })
        .returning();
    return res;
}

export async function getTopLevelData(dataId: string) {
    try {
        const res = await db.query.routineDataTopLevel.findFirst({
            where: {
                id: dataId,
            },
            with: {
                dataExercises: {
                    orderBy: {
                        sequence: "asc",
                    },
                },
            },
        });

        if (!res) {
            throw new Error("Failed");
        }

        return res;
    } catch (err) {
        console.error(err);
    }
}

type CreateExerciseArgs = {
    dataId: string;
    sequence: number;
    exerciseId: string;
    name: string;
    desc: string | null;
    type: "reps" | "duration";
    workAmount: number;
};

export async function initializeExerciseData({
    dataId,
    sequence,
    exerciseId,
    name,
    desc,
    type,
    workAmount,
}: CreateExerciseArgs) {
    try {
        const alreadyCreated = await db.query.routineExerciseData.findFirst({
            where: {
                parentMetadataId: dataId,
                sequence,
            },
        });
        if (!alreadyCreated) {
            const [res] = await db
                .insert(routineExerciseData)
                .values({
                    id: randomUUID(),
                    parentMetadataId: dataId,
                    exerciseId,
                    isRest: false,
                    exerciseName: name.trim().toLowerCase(),
                    exerciseDisplayName: name,
                    exerciseDesc: desc,
                    exerciseType: type, // reps or duration
                    workAmount,
                    sequence,
                })
                .returning();
            return res;
        }

        const [updatedStart] = await db
            .update(routineExerciseData)
            .set({
                startTime: new Date(),
            })
            .where(
                and(
                    eq(routineExerciseData.parentMetadataId, dataId),
                    eq(routineExerciseData.sequence, sequence),
                ),
            )
            .returning();
        console.log("Updated", updatedStart);
        return updatedStart;
    } catch (err) {
        console.error("Failed to initialize exercise", err);
        return;
    }
}

export async function initializeRestData(
    dataId: string,
    restEnd: number,
    sequence: number,
) {
    try {
        const restExists = await db.query.routineExerciseData.findFirst({
            where: {
                parentMetadataId: dataId,
                isRest: true,
                sequence,
            },
        });

        const startTime = new Date();
        const calculateEnd = new Date(startTime.getTime() + restEnd * 1000);

        if (!restExists) {
            const [created] = await db
                .insert(routineExerciseData)
                .values({
                    id: randomUUID(),
                    parentMetadataId: dataId,
                    isRest: true,
                    startTime,
                    endTime: calculateEnd,
                    sequence,
                })
                .returning();
            return created;
        }

        const [updated] = await db
            .update(routineExerciseData)
            .set({
                startTime,
                endTime: calculateEnd,
            })
            .returning();

        return updated;
    } catch (err) {
        console.error(err);
    }
}

export async function updateExerciseAmountData(
    exerciseDataId: string,
    updatedAmount: number,
    exerciseType: "reps" | "duration",
) {
    try {
        console.log("Updating");

        await db
            .update(routineExerciseData)
            .set({
                workAmount: updatedAmount,
            })
            .where(eq(routineExerciseData.id, exerciseDataId));
        return;
    } catch (err) {
        console.error(err);
    }
}

export async function completeExercise(
    dataId: string,
    exerciseDataId: string,
    completionPercentage: number,
) {
    try {
        await db
            .update(routineExerciseData)
            .set({
                isComplete: true,
                endTime: new Date(),
            })
            .where(
                and(
                    eq(routineExerciseData.parentMetadataId, dataId),
                    eq(routineExerciseData.id, exerciseDataId),
                ),
            );
        await db.update(routineDataTopLevel).set({
            completionPercentage,
        });
    } catch (err) {
        console.error(err);
    }
}

export async function completeRest(restId: string, endTime: Date) {
    const res = await db
        .update(routineExerciseData)
        .set({
            isComplete: true,
            endTime,
        })
        .where(eq(routineExerciseData.id, restId));
}

export async function completeRoutine(dataId: string) {
    try {
        await db.update(routineDataTopLevel).set({
            isComplete: true,
        });
    } catch (err) {
        console.error(err);
    }
}
