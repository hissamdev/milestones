import { db } from "@/db/client";
import { NestedSession } from "@/types/session-types";
import { create } from "zustand";

interface SessionState {
    allSessionsState: NestedSession | null;
    loadSessions: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
    allSessionsState: null,
    loadSessions: async () => {
        const sessions = await db.query.sessions.findMany({
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
    },
}));
