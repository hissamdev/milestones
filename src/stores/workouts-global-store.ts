import { db } from "@/db/client";
import { exercises } from "@/db/schema/workouts";
import { Exercise } from "@/types/routineTypes";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

type ModalName = "exercises" | "create-exercise";
type ModalMode = "session-create" | "session-picker" | "session-swap";

interface WorkoutsState {
    activeModal: {
        modal: ModalName | null;
        mode: ModalMode | null;
    };
    openModal: (modal: ModalName, mode: ModalMode) => void;
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
    activeModal: {
        modal: null,
        mode: null,
    },
    openModal: (modal, mode) => {
        set({ activeModal: { modal, mode } });
    },
    closeModal: () => {
        set({ activeModal: { modal: null, mode: null } });
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
