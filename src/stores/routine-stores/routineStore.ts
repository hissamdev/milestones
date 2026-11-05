import { db } from "@/db/client";
import { NestedRoutine, ShallowRoutine } from "@/types/routineTypes";
import { create } from "zustand";

interface RoutinesState {
    singleRoutine: {
        nestedRoutine: NestedRoutine | null;
        isNextAvailable: boolean;
        currentSequence: number;
    };
    checkIsNextAvailable: () => void;
    loadSingleRoutine: (routineId: string) => void;
    checkOngoing: {
        isOngoing: boolean;
        ongoingId: string;
    };
    setIsOngoing: (value: boolean, id: string) => void;
    updateSequence: {
        increment: () => void;
        decrement: () => void;
        setSequence: (num: number) => void;
    };
    routinesState: ShallowRoutine[];
    loadRoutines: () => void;
}

export const useRoutineStore = create<RoutinesState>()((set, get) => ({
    singleRoutine: {
        nestedRoutine: null,
        isNextAvailable: false,
        currentSequence: 1,
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
    },
    checkOngoing: {
        isOngoing: false,
        ongoingId: "",
    },
    setIsOngoing: (value, id) => ({
        isOngoing: value,
        ongoingId: id,
    }),
    updateSequence: {
        increment: () => {
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
    routinesState: [],
    loadRoutines: async () => {
        const get = await db.query.routines.findMany({
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

        set(() => ({ routinesState: get }));
    },
}));

// Current Routine: Nested Routine, isOngoing, isNextAvailable, currentSequence
