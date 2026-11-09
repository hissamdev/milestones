import { create } from "zustand";

type ModalName = "exercises" | "create-exercise";

interface WorkoutsState {
    activeModal: ModalName | null;
    openModal: (modal: ModalName) => void;
    closeModal: () => void;
}

export const useWorkoutsGlobalState = create<WorkoutsState>()((set, get) => ({
    activeModal: null,
    openModal: (modal) => {
        set({ activeModal: modal });
    },
    closeModal: () => {
        set({ activeModal: null });
    },
}));
