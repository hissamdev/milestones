import { db } from "@/db/client";
import { exercises } from "@/db/schema/workouts";
import { Exercise } from "@/types/routineTypes";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

type ModalName = "exercises" | "create-exercise";

interface WorkoutsState {
    activeModal: ModalName | null;
    openModal: (modal: ModalName) => void;
    closeModal: () => void;
    allExercisesState: Exercise[];
    loadExercises: () => void;
    createExercise: (
        name: string,
        desc: string,
        type: "reps" | "duration",
    ) => void;
}

export const useWorkoutsGlobalState = create<WorkoutsState>()((set, get) => ({
    activeModal: null,
    openModal: (modal) => {
        set({ activeModal: modal });
    },
    closeModal: () => {
        set({ activeModal: null });
    },
    allExercisesState: [],
    loadExercises: async () => {
        try {
            const allExercises = await db.select().from(exercises);
            set({ allExercisesState: allExercises });
        } catch (err) {
            throw err;
        }
    },
    createExercise: async (name, desc, type) => {
        const [res] = await db
            .insert(exercises)
            .values({
                id: randomUUID(),
                name: name.trim().toLocaleLowerCase(),
                displayName: name,
                desc,
                type,
            })
            .returning();
        set((prev) => ({
            allExercisesState: [res, ...prev.allExercisesState],
        }));
    },
}));
