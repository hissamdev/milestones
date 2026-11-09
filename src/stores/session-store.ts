import { db } from "@/db/client";
import { sessions } from "@/db/schema/workouts";
import { NestedSession } from "@/types/session-types";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

interface SessionState {
    singleSession: {
        nestedSession: NestedSession | null;
        currentSequence: number;
        showExercises: boolean;
        updateShowExercises: (value: boolean) => void;
        updateSequence: {
            increment: () => void;
            set: (value: number) => void;
        };
    };
    loadSingleSession: (sessionId: string) => void;
    createSession: () => void;
    allSessionsState: NestedSession[];
    loadSessions: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
    singleSession: {
        nestedSession: null,
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
    createSession: async () => {
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
