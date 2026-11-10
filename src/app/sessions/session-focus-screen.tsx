import SessionExercise from "@/components/screens/workout/sessions/SessionExercise";
import SessionRest from "@/components/screens/workout/sessions/SessionRest";
import Popup from "@/components/ui/Popup";
import ExercisePicker from "@/components/ui/popups/ExercisePicker";
import { useSessionStore } from "@/stores/session-store";
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
    const { singleSession } = useSessionStore(
        useShallow((state) => ({
            singleSession: state.singleSession,
        })),
    );

    const router = useRouter();

    return (
        <>
            {!singleSession.nestedSession!.sessionData!.find(
                (sd) => sd.sequence === singleSession.currentSequence,
            )!.isRest ? (
                <SessionExercise />
            ) : (
                <SessionRest />
            )}
            <Popup
                onClose={closeModal}
                visible={activeModal.modal === "exercises"}
            >
                <ExercisePicker />
            </Popup>
        </>
    );
}
