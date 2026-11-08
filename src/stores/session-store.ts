import { db } from "@/db/client";
import { sessions } from "@/db/schema/workouts";
import { NestedSession } from "@/types/session-types";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

interface SessionState {
    singleSession: NestedSession | null;
    loadSingleSession: (sessionId: string) => void;
    createSession: () => void;
    allSessionsState: NestedSession[];
    loadSessions: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
    singleSession: null,
    loadSingleSession: (sessionId) => {
        const findCurrentSession = get().allSessionsState.find(
            (session) => session.id === sessionId,
        )!;

        set(() => ({ singleSession: findCurrentSession }));
    },
    createSession: async () => {
        const [session] = await db
            .insert(sessions)
            .values({
                id: randomUUID(),
            })
            .returning();
        set((prev) => ({
            allSessionsState: [session, ...prev.allSessionsState],
        }));
        set(() => ({ singleSession: session }));
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
