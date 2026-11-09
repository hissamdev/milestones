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
            insertExercise: (exercise: Exercise) => void;
        };
        currentSequence: number;
        showExercises: boolean;
        updateShowExercises: (value: boolean) => void;
        updateSequence: {
            increment: () => void;
            set: (value: number) => void;
        };
    };
    loadSingleSession: (sessionId: string) => void;
    createSession: (exercise: Exercise) => void;
    allSessionsState: NestedSession[];
    loadSessions: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
    singleSession: {
        nestedSession: null,
        updateSession: {
            insertExercise: (exercise) => {
                const newData: SessionData & { exercise: Exercise } = {
                    id: randomUUID(),
                    sessionId: get().singleSession.nestedSession!.id,
                    exerciseId: exercise.id,
                    exercise: {
                        ...exercise,
                    },
                    createdAt: new Date(),
                    isRest: false,
                    restTime: 0,
                    sequence: get().singleSession.currentSequence,
                };

                set((prev) => ({
                    singleSession: {
                        ...prev.singleSession,
                        nestedSession: {
                            ...prev.singleSession.nestedSession!,
                            sessionData: [
                                ...(prev.singleSession.nestedSession!
                                    .sessionData ?? []),
                                newData,
                            ],
                        },
                    },
                }));
            },
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
            increment: () => {},
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
    loadSingleSession: (sessionId) => {
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
        set((prev) => ({
            singleSession: {
                ...prev.singleSession,
                nestedSession: session,
            },
        }));

        get().singleSession.updateSession.insertExercise(exercise);
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
