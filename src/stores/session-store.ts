import { db } from "@/db/client";
import { sessions } from "@/db/schema/workouts";
import { Exercise } from "@/types/routineTypes";
import { NestedSession, SessionData } from "@/types/session-types";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";
import { useTemplateStore } from "./template-store";

type CreateSession =
    | {
          mode: "session";
          exercise: Exercise;
      }
    | {
          mode: "template";
          templateId: string;
      };

interface SessionState {
    singleSession: {
        nestedSession: NestedSession | null;
        updateSession: {
            handleInsert: (
                newData: SessionData & { exercise: Exercise | null },
            ) => void;
            handlePush: (
                newData: SessionData & { exercise: Exercise | null },
            ) => void;
            insertExercise: (exercise: Exercise) => void;
            insertRest: (mode: "push" | "insert") => void;
        };
        currentSequence: number;
        complexSetters: {
            sessionData: <K extends object>(
                multipleKeys: Partial<SessionData>,
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
            decrement: () => void;
            set: (value: number) => void;
        };
    };
    handleSwap: (mode: "current" | "next", exercise: Exercise) => void;
    findActivity: {
        current: () => NonNullable<NestedSession["sessionData"]>[0];
        next: () => NonNullable<NestedSession["sessionData"]>[0] | undefined;
    };
    loadOngoingSession: (sessionId: string) => void;
    createSession: (p: CreateSession) => void;
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
            handlePush: (newData) => {
                set((prev) => ({
                    singleSession: {
                        ...prev.singleSession,
                        nestedSession: {
                            ...prev.singleSession.nestedSession!,
                            sessionData: prev.singleSession
                                .nestedSession!.sessionData!.toSpliced(
                                    get().singleSession.currentSequence,
                                    0,
                                    newData,
                                )
                                .map((sd, idx) => ({
                                    ...sd,
                                    sequence: idx + 1,
                                })),
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
                    amount: 0,
                    targetSets: 1,
                    currentSetNum: 1,
                    startTime: null,
                    endTime: null,
                    sequence: get().singleSession.currentSequence + 1,
                    isComplete: false,
                };

                get().singleSession.updateSession.handleInsert(newData);
            },
            insertRest: (mode) => {
                const newData: SessionData & { exercise: Exercise | null } = {
                    id: randomUUID(),
                    sessionId: get().singleSession.nestedSession!.id,
                    exercise: null,
                    exerciseId: null,
                    isRest: true,
                    amount: 0,
                    targetSets: 1,
                    currentSetNum: 1,
                    startTime: null,
                    endTime: null,
                    sequence: get().singleSession.currentSequence + 1,
                    isComplete: false,
                };
                if (mode === "insert") {
                    get().singleSession.updateSession.handleInsert(newData);
                    get().singleSession.updateSequence.increment();
                    return;
                }

                get().singleSession.updateSession.handlePush(newData);
                get().singleSession.updateSequence.increment();
                console.log(
                    "Details",
                    JSON.stringify(
                        get().singleSession.nestedSession!.sessionData?.map(
                            (sd) => ({
                                isExercise: !sd.isRest,
                                set: sd.currentSetNum,
                                sequence: sd.sequence,
                            }),
                        ),
                        null,
                        2,
                    ),
                );
            },
        },
        complexSetters: {
            sessionData: (multiple) => {
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
                                                  ...multiple,
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
                    get().singleSession.complexSetters.sessionData({
                        amount: lastValue + 1,
                    });
                    return;
                }
                get().singleSession.complexSetters.sessionData({
                    amount: lastValue + 10,
                });
                return;
            }
            if (type === "reps") {
                const safeSubtract = lastValue - 1 <= 0 ? 0 : lastValue - 1;
                get().singleSession.complexSetters.sessionData({
                    amount: safeSubtract,
                });
                return;
            }
            const safeSubtract = lastValue - 10 ? 0 : lastValue - 10;
            get().singleSession.complexSetters.sessionData({
                amount: safeSubtract,
            });
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
            decrement: () => {
                set((prev) => ({
                    singleSession: {
                        ...prev.singleSession,
                        currentSequence:
                            prev.singleSession.currentSequence - 1 <= 1
                                ? 1
                                : prev.singleSession.currentSequence - 1,
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
    handleSwap: (mode, exercise) => {
        if (mode === "current") {
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
                                              exerciseId: exercise.id,
                                              exercise,
                                              startTime: null,
                                              endTiem: null,
                                          }
                                        : { ...sd },
                            ),
                    },
                },
            }));
            return;
        }
        set((prev) => ({
            singleSession: {
                ...prev.singleSession,
                nestedSession: {
                    ...prev.singleSession.nestedSession!,
                    sessionData:
                        prev.singleSession.nestedSession!.sessionData!.map(
                            (sd) =>
                                sd.sequence ===
                                get().singleSession.currentSequence + 1
                                    ? {
                                          ...sd,
                                          exerciseId: exercise.id,
                                          exercise,
                                          startTime: null,
                                          endTiem: null,
                                      }
                                    : { ...sd },
                        ),
                },
            },
        }));
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
    createSession: async (p) => {
        get().singleSession.updateSequence.set(1);
        if (p.mode === "session") {
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
                exerciseId: p.exercise.id,
                exercise: {
                    ...p.exercise,
                },
                isRest: false,
                amount: 0,
                targetSets: 1,
                currentSetNum: 1,
                startTime: null,
                endTime: null,
                sequence: get().singleSession.currentSequence,
                isComplete: false,
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
            return;
        }
        // Template
        get().singleSession.updateSequence.set(1);
        const [session] = await db
            .insert(sessions)
            .values({
                id: randomUUID(),
                templateId: p.templateId,
                useTemplate: true,
            })
            .returning();
        // const templateExercises =
        //     await db.query.routineTemplateExercises.findMany({
        //         where: {
        //             id: p.templateId,
        //         },
        //         orderBy: {
        //             sequence: "asc",
        //         },
        //         with: {
        //             exercise: true,
        //         },
        //     });
        const templateExercises =
            useTemplateStore.getState().template!.templateExercises;

        const converted: (SessionData & { exercise: Exercise | null })[] =
            templateExercises
                .filter((te) => !te.isRestType)
                .map((te) => ({
                    id: randomUUID(),
                    sessionId: session.id,
                    exerciseId: te.exerciseId,
                    isRest: false,
                    exercise: {
                        ...te.exercise!,
                    },
                    amount: te.displayAmount,
                    autoSets: true,
                    targetSets: te.targetSets,
                    currentSetNum: 1,
                    startTime: null,
                    endTime: null,
                    isComplete: false,
                    sequence: te.sequence,
                }));

        const preparedSets = converted.flatMap((te, idx) =>
            Array.from({ length: te.targetSets }, (_, setIdx) => ({
                ...te,
                currentSetNum: setIdx + 1,
                sequence: idx + 1,
            })),
        );

        set((prev) => ({
            singleSession: {
                ...prev.singleSession,
                nestedSession: {
                    ...session,
                    sessionData: [...preparedSets],
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
