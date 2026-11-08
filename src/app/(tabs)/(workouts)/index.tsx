import Routines from "@/components/sections/routines/Routines";
import Sessions from "@/components/sections/sessions/Sessions";
import CreateExercise from "@/components/ui/CreateExercise";
import { exercises } from "@/db/schema/workouts";
import { createRoutine } from "@/utils/workouts/routineHelpers";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
("@/components/ui/Popup");

type Exercise = typeof exercises.$inferSelect;

export default function Workouts() {
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

    // useEffect(() => {
    //     const load = async () => {
    //         const res = await getCurrentDayWorkout();
    //         if (!res) return console.error("Failed to load workouts");
    //         setWorkouts(res);
    //     };

    //     load();
    // }, []);

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
        <SafeAreaView style={{ flex: 1, position: "relative", padding: 10 }}>
            <Sessions />
            <Routines />

            <CreateExercise />
        </SafeAreaView>
    );
}
