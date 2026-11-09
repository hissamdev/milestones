import SessionExercise from "@/components/screens/workout/sessions/SessionExerciseScreen";
import SessionRest from "@/components/screens/workout/sessions/SessionRest";
import Popup from "@/components/ui/Popup";
import ExercisePicker from "@/components/ui/popups/ExercisePicker";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { useRouter } from "expo-router";
import { useShallow } from "zustand/react/shallow";

export default function SessionFocusScreen() {
    const { activeModal, closeModal } = useWorkoutsGlobalState(
        useShallow((state) => ({
            activeModal: state.activeModal,
            closeModal: state.closeModal,
        })),
    );

    const router = useRouter();

    return (
        <>
            {!true ? <SessionExercise /> : <SessionRest />}
            {activeModal === "exercises" && (
                <Popup closingFunction={closeModal}>
                    <ExercisePicker />
                </Popup>
            )}
        </>
    );
}
