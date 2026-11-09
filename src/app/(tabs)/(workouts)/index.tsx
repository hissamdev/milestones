import Routines from "@/components/screens/workout/routines/Routines";
import Sessions from "@/components/screens/workout/sessions/Sessions";
import CreateExercise from "@/components/ui/CreateExercise";
import Popup from "@/components/ui/Popup";
import ExercisePicker from "@/components/ui/popups/ExercisePicker";
import { exercises } from "@/db/schema/workouts";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { createRoutine } from "@/utils/workouts/routineHelpers";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
("@/components/ui/Popup");

type Exercise = typeof exercises.$inferSelect;

export default function Workouts() {
    const { activeModal, closeModal, allExercisesState, loadExercises } =
        useWorkoutsGlobalState(
            useShallow((state) => ({
                allExercisesState: state.allExercisesState,
                loadExercises: state.loadExercises,
                activeModal: state.activeModal,
                closeModal: state.closeModal,
            })),
        );
    // const [workouts, setWorkouts] = useState<WorkoutsType | null>(null);
    const [routineName, setRoutineName] = useState("");
    const [uiMessage, setUiMessage] = useState("");
    const [standaloneExercises, setStandaloneExercises] = useState([
        {
            id: "id-1",
            name: "Plank",
            type: "Duration",
        },
    ]);
    const [expandExercise, setExpandExercise] = useState<{
        id: string;
    } | null>({
        id: "id-1",
    });
    const router = useRouter();

    useEffect(() => {
        if (!allExercisesState.length) {
            loadExercises();
            return;
        }
    }, []);

    const handleAddStandaloneExercise = () => {
        setStandaloneExercises((prev) => [
            {
                id: "id-" + new Date(),
                name: "Random kid",
                type: "typeshi",
            },
            ...prev,
        ]);
    };

    const handleExpand = (id: string) => {
        if (!id) return;
        setExpandExercise(
            expandExercise?.id === id
                ? null
                : {
                      id,
                  },
        );
    };

    const handleCreateRoutine = async () => {
        const res = await createRoutine(routineName);
        if (!res || !res.success || !res.data) {
            setUiMessage("There was an error, please try again later");
            return;
        }
        setUiMessage("Routine created");
        router.push({
            pathname: "/routines/edit-routine-screen",
            params: {
                routineId: res.data.id,
            },
        });
    };

    // if (!workouts) return;
    return (
        <>
            <SafeAreaView
                style={{ flex: 1, position: "relative", padding: 10 }}
            >
                <Sessions />
                <Routines />
                <CreateExercise />
            </SafeAreaView>
            <Popup visible={activeModal === "exercises"} onClose={closeModal}>
                <ExercisePicker />
            </Popup>
        </>
    );
}
