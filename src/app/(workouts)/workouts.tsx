import CreateExercise from "@/components/ui/CreateExercise";
import { exercises, workouts } from "@/db/schema/workouts";
import { getCurrentDayWorkout } from "@/utils/workoutHelpers";
import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

type Workouts = typeof workouts.$inferSelect;
type Exercise = typeof exercises.$inferSelect;

export default function Workouts() {
    const [workouts, setWorkouts] = useState<Workouts | null>(null);
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

    useEffect(() => {
        const load = async () => {
            const res = await getCurrentDayWorkout();
            if (!res) return console.error("Failed to load workouts");
            setWorkouts(res);
        };

        load();
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

    if (!workouts) return;
    return (
        <View style={{ flex: 1, position: "relative", padding: 30 }}>
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
            <View>
                <Text>Standalone Exercises</Text>
                <Pressable
                    onPress={() => handleAddStandaloneExercise()}
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 6,
                        backgroundColor: "#65B8FB",
                    }}
                >
                    <Text style={{ textAlign: "center" }}>Add Exercise</Text>
                </Pressable>
                <View style={{ marginTop: 20 }}>
                    {standaloneExercises.map((e) => (
                        <TouchableOpacity
                            onPress={() => handleExpand(e.id)}
                            key={e.id}
                            style={{
                                padding: 15,
                                backgroundColor: "white",
                                borderRadius: 10,
                                marginBottom: 20,
                            }}
                            activeOpacity={1}
                        >
                            <View
                                style={{
                                    paddingVertical: 5,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View>
                                    <Text>{e.name}</Text>
                                </View>
                                <View>
                                    <Text>Avg: {e.name}</Text>
                                </View>
                            </View>
                            {expandExercise?.id === e.id && (
                                <View
                                    style={{
                                        marginTop: 15,
                                        padding: 15,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        backgroundColor: "#FBF2EE",
                                        borderRadius: 6,
                                    }}
                                >
                                    <View
                                        style={{
                                            padding: 15,
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            backgroundColor: "white",
                                            borderRadius: 6,
                                        }}
                                    >
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: 3,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 24,
                                                }}
                                            >
                                                57
                                            </Text>
                                            <Text
                                                style={{
                                                    textAlignVertical: "bottom",
                                                }}
                                            >
                                                Seconds
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                padding: 3,
                                                backgroundColor: "#9D3E1A",
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Check color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}
