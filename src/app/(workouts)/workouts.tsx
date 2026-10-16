import CreateExercise from "@/components/ui/CreateExercise";
import { workouts } from "@/db/schema/workouts";
import { getCurrentDayWorkout } from "@/utils/workoutHelpers";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type Workouts = typeof workouts.$inferSelect;

export default function Workouts() {
    const [workouts, setWorkouts] = useState<Workouts | null>(null);

    useEffect(() => {
        const load = async () => {
            const res = await getCurrentDayWorkout();
            if (!res) return console.error("Failed to load workouts");
            setWorkouts(res);
        };

        load();
    }, []);

    if (!workouts) return;
    return (
        <View style={{ flex: 1, position: "relative" }}>
            <CreateExercise />
            {/* <TouchableOpacity
                style={{
                    alignSelf: "flex-start",
                    marginHorizontal: "auto",
                    marginTop: 70,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderColor: "black",
                    borderWidth: 1,
                }}
            >
                <Text>Create Property</Text>
            </TouchableOpacity> */}
            <Text>{workouts?.creationDay}</Text>
        </View>
    );
}
