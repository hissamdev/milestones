import { db } from "@/db/client";
import { routineDataTopLevel, routineExerciseData } from "@/db/schema/workouts";
import {
    ExerciseData,
    NestedRoutine,
    ShallowRoutine,
} from "@/types/routineTypes";
import { daysOfTheWeek } from "@/utils/workouts/days";
import { updateStartTime } from "@/utils/workouts/routineHelpers";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

interface RoutinesState {
    singleRoutine: {
        nestedRoutine: NestedRoutine | null;
        isNextAvailable: boolean;
        currentSequence: number;
        isOngoing: "new" | "ongoing" | "complete";
        findSingleActivity: () => NestedRoutine["routineData"][0]["dataExercises"][0];
        updateSequence: {
            increment: () => void;
            decrement: () => void;
            setSequence: (num: number) => void;
        };
        complexSetters: {
            activity: <K extends keyof ExerciseData>(
                keyName: K,
                value: ExerciseData[K],
            ) => void;
        };
        markStart: (newStart: Date) => Promise<void>;
    };
    runRoutineStart: () => void;
    findCurrentDay: () => NestedRoutine["daysOtw"][0];
    updateAvailabilityState: () => void;
    loadSingleRoutine: (routineId: string) => void;
    updateOngoingState: () => void;
    allRoutinesState: ShallowRoutine[];
    loadRoutines: () => void;
}

export const useRoutineStore = create<RoutinesState>()((set, get) => ({
    singleRoutine: {
        nestedRoutine: null,
        isNextAvailable: false,
        currentSequence: 1,
        isOngoing: "new",
        findSingleActivity: () => {
            const activity =
                get().singleRoutine.nestedRoutine!.routineData[0].dataExercises.find(
                    (de) => de.sequence === get().singleRoutine.currentSequence,
                );

            return activity!;
        },
        updateSequence: {
            increment: () => {
                // get().updateAvailabilityState();
                // const isAvailable = get().singleRoutine.isNextAvailable

                set((prev) => ({
                    singleRoutine: {
                        ...prev.singleRoutine,
                        currentSequence: prev.singleRoutine.currentSequence + 1,
                    },
                }));

                get().updateAvailabilityState();
            },
            decrement: () => {
                const safeSubtract =
                    get().singleRoutine.currentSequence - 1 < 0
                        ? 0
                        : get().singleRoutine.currentSequence - 1;

                set((prev) => ({
                    singleRoutine: {
                        ...prev.singleRoutine,
                        currentSequence: safeSubtract,
                    },
                }));
                get().updateAvailabilityState();
            },
            setSequence: (num) => {
                set((prev) => ({
                    singleRoutine: {
                        ...prev.singleRoutine,
                        currentSequence: num,
                    },
                }));
                get().updateAvailabilityState();
            },
        },
        complexSetters: {
            activity: (keyName, value) => {
                set((prev) => ({
                    singleRoutine: {
                        ...prev.singleRoutine,
                        nestedRoutine: {
                            ...prev.singleRoutine.nestedRoutine!,
                            routineData: [
                                {
                                    ...prev.singleRoutine.nestedRoutine!
                                        .routineData[0],
                                    dataExercises:
                                        prev.singleRoutine.nestedRoutine!.routineData[0].dataExercises.map(
                                            (de) =>
                                                de.sequence ===
                                                get().singleRoutine
                                                    .currentSequence
                                                    ? {
                                                          ...de,
                                                          [keyName]: value,
                                                      }
                                                    : {
                                                          ...de,
                                                      },
                                        ),
                                },
                                ...prev.singleRoutine.nestedRoutine!
                                    .routineData,
                            ],
                        },
                    },
                }));
            },
        },
        markStart: async (newStart: Date) => {
            const activity = get().singleRoutine.findSingleActivity();
            await updateStartTime(activity.id, newStart);
            get().singleRoutine.complexSetters.activity("startTime", newStart);
        },
    },
    runRoutineStart: async () => {
        try {
            if (get().singleRoutine.isOngoing === "ongoing") {
                return;
            }
            const [createdTld] = await db
                .insert(routineDataTopLevel)
                .values({
                    id: randomUUID(),
                    routineId: get().singleRoutine.nestedRoutine!.id,
                    completionPercentage: 0,
                })
                .returning();

            const day = get().findCurrentDay();

            const compatibleInsert = day.routineTemplate.templateExercises.map(
                (te) =>
                    te.isRestType
                        ? {
                              id: randomUUID(),
                              routineId: get().singleRoutine.nestedRoutine!.id,
                              parentMetadataId: createdTld.id,
                              isRest: true,
                              isComplete: false,
                              workAmount: te.displayRestAmount
                                  ? te.displayRestAmount
                                  : 0,
                              startTime: null,
                              endTime: null,
                              sequence: te.sequence,
                          }
                        : {
                              id: randomUUID(),
                              routineId: get().singleRoutine.nestedRoutine!.id,
                              parentMetadataId: createdTld.id,
                              exerciseId: te.exerciseId,
                              isRest: false,
                              isComplete: false,
                              exerciseName: te.exercise.name,
                              exerciseDisplayName: te.exercise.displayName,
                              exerciseDesc: te.exercise.desc,
                              exerciseType: te.exercise.type,
                              workAmount: te.displayAmount
                                  ? te.displayAmount
                                  : 0,
                              startTime: null,
                              endTime: null,
                              sequence: te.sequence,
                          },
            );
            // {
            //     id: string;
            //     routineId: string | null;
            //     parentMetadataId: string;
            //     exerciseId: string | null;
            //     isRest: boolean;
            //     isComplete: boolean;
            //     exerciseName: string | null;
            //     exerciseDisplayName: string | null;
            //     exerciseDesc: string | null;
            //     exerciseType: string | null;
            //     workAmount: number | null;
            //     startTime: Date;
            //     endTime: Date | null;
            //     sequence: number;
            // }

            const inserted = await db
                .insert(routineExerciseData)
                .values(compatibleInsert)
                .returning();
            const compatibleState = {
                ...createdTld,
                dataExercises: inserted,
            };

            set((prev) => ({
                singleRoutine: {
                    ...prev.singleRoutine,
                    nestedRoutine: {
                        ...prev.singleRoutine.nestedRoutine!,
                        routineData: [
                            compatibleState,
                            ...prev.singleRoutine.nestedRoutine!.routineData,
                        ],
                    },
                },
            }));
        } catch (err) {
            console.error(err);
        }
    },
    updateOngoingState: () => {
        const tld = get().singleRoutine.nestedRoutine!.routineData[0];
        if (!tld || tld.interactionTime.getDay() !== new Date().getDay()) {
            set((prev) => ({
                singleRoutine: {
                    ...prev.singleRoutine,
                    isOngoing: "new",
                },
            }));
            get().singleRoutine.updateSequence.setSequence(1);
            return;
        }
        if (!tld.isComplete) {
            set((prev) => ({
                singleRoutine: {
                    ...prev.singleRoutine,
                    isOngoing: "ongoing",
                },
            }));
            // dataExercises may not contain any entries to find from in case of a transaction failure
            const firstIncomplete =
                get().singleRoutine.nestedRoutine!.routineData[0].dataExercises.find(
                    (tld) => !tld.isComplete,
                );
            get().singleRoutine.updateSequence.setSequence(
                firstIncomplete ? firstIncomplete.sequence : 1,
            );
            return;
        }
        set((prev) => ({
            singleRoutine: {
                ...prev.singleRoutine,
                isOngoing: "complete",
            },
        }));
        get().singleRoutine.updateSequence.setSequence(1); // Reset sequence
    },
    findCurrentDay: () => {
        const currentDayTitle = daysOfTheWeek.map((d) => d.title)[
            new Date().getDay() + 1
        ];
        const day = get().singleRoutine.nestedRoutine!.daysOtw.find(
            (d) => d.dayTitle === "sat",
        );

        return day!;
    },
    updateAvailabilityState: () => {
        // const nested = get().singleRoutine.nestedRoutine;
        // if (!nested) {
        //     get().loadRoutines();
        //     return;
        // }

        // const day = get().singleRoutine.nestedRoutine!.daysOtw.find(
        //     (d) => d.dayTitle === "sat",
        // );

        // const nextSeq = get().singleRoutine.currentSequence + 1;
        // const isAvailable = day!.routineTemplate.templateExercises.find(
        //     (te) => te.sequence === nextSeq,
        // );

        console.log("Found seq", get().singleRoutine.currentSequence);

        const available =
            get().singleRoutine.nestedRoutine?.routineData?.[0]?.dataExercises?.find(
                (de) => de.sequence === get().singleRoutine.currentSequence,
            );

        set((prev) => ({
            singleRoutine: {
                ...prev.singleRoutine,
                isNextAvailable: available ? true : false,
            },
        }));
    },
    loadSingleRoutine: async (routineId: string) => {
        const getCurrentRoutine = await db.query.routines.findFirst({
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
                                    with: {
                                        exercise: true,
                                    },
                                },
                            },
                        },
                    },
                },
                routineData: {
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

        set((prev) => ({
            singleRoutine: {
                ...prev.singleRoutine,
                nestedRoutine: getCurrentRoutine ? getCurrentRoutine : null,
            },
        }));

        if (!getCurrentRoutine) {
            return;
        }

        get().updateOngoingState();
    },
    allRoutinesState: [],
    loadRoutines: async () => {
        const allRoutines = await db.query.routines.findMany({
            orderBy: {
                createdAt: "desc",
            },
            with: {
                daysOtw: {
                    with: {
                        routineTemplate: true,
                    },
                },
                routineData: {
                    orderBy: {
                        interactionTime: "desc",
                    },
                    limit: 1,
                },
            },
        });

        set(() => ({ allRoutinesState: allRoutines }));
    },
}));
