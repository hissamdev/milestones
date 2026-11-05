import { db } from "@/db/client";
import { routineDataTopLevel, routineExerciseData } from "@/db/schema/workouts";
import { NestedRoutine, ShallowRoutine } from "@/types/routineTypes";
import { daysOfTheWeek } from "@/utils/workouts/days";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

interface RoutinesState {
    singleRoutine: {
        nestedRoutine: NestedRoutine | null;
        isNextAvailable: boolean;
        currentSequence: number;
        isOngoing: "new" | "ongoing" | "complete";
    };
    runRoutineStart: () => void;
    findCurrentDay: () => NestedRoutine["daysOtw"][0];
    checkIsNextAvailable: () => void;
    loadSingleRoutine: (routineId: string) => void;
    updateOngoingState: () => void;
    updateSequence: {
        increment: () => void;
        decrement: () => void;
        setSequence: (num: number) => void;
    };
    allRoutinesState: ShallowRoutine[];
    loadRoutines: () => void;
}

export const useRoutineStore = create<RoutinesState>()((set, get) => ({
    singleRoutine: {
        nestedRoutine: null,
        isNextAvailable: false,
        currentSequence: 1,
        isOngoing: "new",
    },
    runRoutineStart: async () => {
        try {
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
                              workAmount: te.displayRestAmount,
                              startTime: new Date(),
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
                              workAmount: te.displayAmount,
                              startTime: new Date(),
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
            get().updateSequence.setSequence(1);
            return;
        }
        if (!tld.isComplete) {
            set((prev) => ({
                singleRoutine: {
                    ...prev.singleRoutine,
                    isOngoing: "ongoing",
                },
            }));
            const first =
                get().singleRoutine.nestedRoutine!.routineData[0].dataExercises.find(
                    (tld) => !tld.isComplete,
                );
            get().updateSequence.setSequence(first ? first.sequence : 1);
            return;
        }
        set((prev) => ({
            singleRoutine: {
                ...prev.singleRoutine,
                isOngoing: "complete",
            },
        }));
        get().updateSequence.setSequence(1);
    },
    findCurrentDay: () => {
        const currentDayTitle = daysOfTheWeek.map((d) => d.title)[
            new Date().getDay() + 1
        ];
        const day = get().singleRoutine.nestedRoutine!.daysOtw.find(
            (d) => d.dayTitle === currentDayTitle,
        );

        return day!;
    },
    checkIsNextAvailable: () => {
        // const nested = get().singleRoutine.nestedRoutine;
        // if (!nested) {
        //     get().loadRoutines();
        //     return;
        // }

        const day = get().singleRoutine.nestedRoutine!.daysOtw.find(
            (d) => d.dayTitle === "sat",
        );

        const nextSeq = get().singleRoutine.currentSequence + 1;
        const isAvailable = day!.routineTemplate.templateExercises.find(
            (te) => te.sequence === nextSeq,
        );

        set((prev) => ({
            singleRoutine: {
                ...prev.singleRoutine,
                isNextAvailable: isAvailable ? true : false,
            },
        }));
    },
    loadSingleRoutine: async (routineId: string) => {
        const singleRoutine = await db.query.routines.findFirst({
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

        if (!singleRoutine) return null;

        set((prev) => ({
            singleRoutine: {
                ...prev.singleRoutine,
                nestedRoutine: singleRoutine,
            },
        }));

        get().updateOngoingState();
    },

    updateSequence: {
        increment: () => {
            // get().checkIsNextAvailable();
            // const isAvailable = get().singleRoutine.isNextAvailable

            set((prev) => ({
                singleRoutine: {
                    ...prev.singleRoutine,
                    currentSequence: prev.singleRoutine.currentSequence + 1,
                },
            }));
        },
        decrement: () => {
            const safeSubtract =
                get().singleRoutine.currentSequence - 1 < 0
                    ? 0
                    : get().singleRoutine.currentSequence;

            set((prev) => ({
                singleRoutine: {
                    ...prev.singleRoutine,
                    currentSequence: safeSubtract,
                },
            }));
        },
        setSequence: (num) => {
            set((prev) => ({
                singleRoutine: { ...prev.singleRoutine, currentSequence: num },
            }));
        },
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
