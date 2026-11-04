import { db } from "@/db/client";
import { RoutineWithTLD } from "@/types/routineTypes";
import { create } from "zustand";

interface RoutinesState {
    routines: RoutineWithTLD[];
    loadRoutines: () => void;
}

export const useRoutineStore = create<RoutinesState>()((set) => ({
    routines: [],
    loadRoutines: async () => {
        const get = await db.query.routines.findMany({
            orderBy: {
                createdAt: "desc",
            },
            with: {
                routineData: {
                    orderBy: {
                        interactionTime: "desc",
                    },
                    limit: 1,
                },
            },
        });

        set(() => ({ routines: get }));
    },
}));
