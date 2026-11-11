import { db } from "@/db/client";
import { sessions } from "@/db/schema/workouts";
import { Exercise } from "@/types/routineTypes";
import { NestedSession, SessionData } from "@/types/session-types";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

interface SessionState {
    singleSession: {
        nestedSession: NestedSession | null;
        updateSession: {
            handleInsert: (
                newData: SessionData & { exercise: Exercise | null },
            ) => void;
            insertExercise: (exercise: Exercise) => void;
            insertRest: () => void;
        };
        currentSequence: number;
        complexSetters: {
            sessionData: <K extends keyof SessionData>(
                key: K,
                value: SessionData[K],
            ) => void;
        };
        updateAmount: (
            mode: "add" | "subtract",
            type: "reps" | "duration",
        ) => void;
        showExercises: boolean;
        updateShowExercises: (value: boolean) => void;
        updateSequence: {
            increment: () => void;
            set: (value: number) => void;
        };
    };
    findActivity: {
        current: () => NonNullable<NestedSession["sessionData"]>[0];
        next: () => NonNullable<NestedSession["sessionData"]>[0] | undefined;
    };
    loadOngoingSession: (sessionId: string) => void;
    createSession: (exercise: Exercise) => void;
    allSessionsState: NestedSession[];
    loadSessions: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
    singleSession: {
        nestedSession: null,
        updateSession: {
            handleInsert: (newData) => {
                set((prev) => ({
                    singleSession: {
                        ...prev.singleSession,
                        nestedSession: {
                            ...prev.singleSession.nestedSession!,
                            sessionData: [
                                ...prev.singleSession.nestedSession!
                                    .sessionData!,
                                newData,
                            ],
                        },
                    },
                }));
            },
            insertExercise: (exercise) => {
                const newData: SessionData & { exercise: Exercise } = {
                    id: randomUUID(),
                    sessionId: get().singleSession.nestedSession!.id,
                    exerciseId: exercise.id,
                    exercise: {
                        ...exercise,
                    },
                    isRest: false,
                    restTime: 0,
                    amount: 0,
                    startTime: null,
                    endTime: null,
                    sequence: get().singleSession.currentSequence + 1,
                };

                get().singleSession.updateSession.handleInsert(newData);
            },
            insertRest: () => {
                const newData: SessionData & { exercise: Exercise | null } = {
                    id: randomUUID(),
                    sessionId: get().singleSession.nestedSession!.id,
                    exercise: null,
                    exerciseId: null,
                    isRest: true,
                    restTime: 0,
                    amount: 0,
                    startTime: null,
                    endTime: null,
                    sequence: get().singleSession.currentSequence + 1,
                };
                get().singleSession.updateSession.handleInsert(newData);
                get().singleSession.updateSequence.increment();
            },
        },
        complexSetters: {
            sessionData: (key, value) => {
                set((prev) => ({
                    singleSession: {
                        ...prev.singleSession,
                        nestedSession: {
                            ...prev.singleSession.nestedSession!,
                            sessionData:
                                prev.singleSession.nestedSession!.sessionData!.map(
                                    (sd) =>
                                        sd.sequence ===
                                        get().singleSession.currentSequence
                                            ? {
                                                  ...sd,
                                                  [key]: value,
                                              }
                                            : {
                                                  ...sd,
                                              },
                                ),
                        },
                    },
                }));
            },
        },
        updateAmount: (mode, type) => {
            const lastValue =
                get().singleSession.nestedSession!.sessionData!.find(
                    (sd) => sd.sequence === get().singleSession.currentSequence,
                )!.amount;
            if (mode === "add") {
                if (type === "reps") {
                    get().singleSession.complexSetters.sessionData(
                        "amount",
                        lastValue + 1,
                    );
                    return;
                }
                get().singleSession.complexSetters.sessionData(
                    "amount",
                    lastValue + 10,
                );
                return;
            }
            if (type === "reps") {
                const safeSubtract = lastValue - 1 <= 0 ? 0 : lastValue - 1;
                get().singleSession.complexSetters.sessionData(
                    "amount",
                    safeSubtract,
                );
                return;
            }
            const safeSubtract = lastValue - 10 ? 0 : lastValue - 10;
            get().singleSession.complexSetters.sessionData(
                "amount",
                safeSubtract,
            );
        },
        currentSequence: 1,
        showExercises: true,
        updateShowExercises: (value) => {
            set((prev) => ({
                singleSession: {
                    ...prev.singleSession,
                    showExercises: value,
                },
            }));
        },
        updateSequence: {
            increment: () => {
                set((prev) => ({
                    singleSession: {
                        ...prev.singleSession,
                        currentSequence: prev.singleSession.currentSequence + 1,
                    },
                }));
            },
            set: (value) => {
                set((prev) => ({
                    singleSession: {
                        ...prev.singleSession,
                        currentSequence: value,
                    },
                }));
            },
        },
    },
    findActivity: {
        current: () => {
            const current =
                get().singleSession.nestedSession!.sessionData!.find(
                    (sd) => sd.sequence === get().singleSession.currentSequence,
                )!;

            return current;
        },
        next: () => {
            const next = get().singleSession.nestedSession!.sessionData!.find(
                (sd) => sd.sequence === get().singleSession.currentSequence + 1,
            );

            return next;
        },
    },
    loadOngoingSession: (sessionId) => {
        const findCurrentSession = get().allSessionsState.find(
            (session) => session.id === sessionId,
        )!;

        set((prev) => ({
            singleSession: {
                ...prev.singleSession,
                nestedSession: findCurrentSession,
            },
        }));
    },
    createSession: async (exercise) => {
        get().singleSession.updateSequence.set(1);
        const [session] = await db
            .insert(sessions)
            .values({
                id: randomUUID(),
            })
            .returning();
        set((prev) => ({
            allSessionsState: [session, ...prev.allSessionsState],
        }));
        const newData: SessionData & { exercise: Exercise } = {
            id: randomUUID(),
            sessionId: session.id,
            exerciseId: exercise.id,
            exercise: {
                ...exercise,
            },
            isRest: false,
            restTime: 0,
            amount: 0,
            startTime: null,
            endTime: null,
            sequence: get().singleSession.currentSequence,
        };
        set((prev) => ({
            singleSession: {
                ...prev.singleSession,
                nestedSession: {
                    ...session,
                    sessionData: [newData],
                },
            },
        }));
    },
    allSessionsState: [],
    loadSessions: async () => {
        const rangeStart = new Date();
        rangeStart.setHours(0, 0, 0, 0);
        const rangeEnd = new Date();
        rangeEnd.setDate(rangeEnd.getDate() + 1);

        const sessions = await db.query.sessions.findMany({
            where: {
                createdAt: {
                    gte: rangeStart,
                    lte: rangeEnd,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            with: {
                sessionData: {
                    orderBy: {
                        sequence: "asc",
                    },
                    with: {
                        exercise: true,
                    },
                },
            },
        });
        set(() => ({ allSessionsState: sessions }));
    },
}));
