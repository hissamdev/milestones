import {
    createCurrentDayData,
    getSingleRoutine,
    Routine,
} from "@/utils/workouts/routineHelpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SingleRoutineScreen() {
    const [routine, setRoutine] = useState<Routine | null>(null);
    const { routineId }: { routineId: string } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const res = await getSingleRoutine(routineId);
            setRoutine(res);
        };
        load();
    }, []);

    if (!routineId || !routine) {
        console.log("No id");
        return <Text>No id or routine</Text>;
    }

    const checkOngoing: () => "start" | "ongoing" | "redo" = () => {
        if (!routine.routineData?.[0]) {
            return "start";
        }
        const exists =
            new Date().getDate() ===
            routine.routineData[0].interactionTime.getDate(); // Is the latest data from today?
        if (!exists) {
            // New day
            return "start";
        }
        const ongoing = routine.routineData[0].isComplete === true; // Is it complete?
        if (!ongoing) {
            // Exists but completed
            return "ongoing";
        }
        return "redo";
    };

    const handleCreateData = async () => {
        const ongoing = checkOngoing();
        if (ongoing === "ongoing") {
            router.push({
                pathname: "/routines/routine-focus-screen",
                params: {
                    routineId,
                    dataId: routine.routineData[0].id,
                },
            });
            return;
        }
        const res = await createCurrentDayData(routineId);
        router.push({
            pathname: "/routines/routine-focus-screen",
            params: {
                routineId,
                dataId: res.id,
            },
        });
    };

    return (
        <SafeAreaView style={{ padding: 10, flex: 1 }}>
            <Text>{routine.name}</Text>
            <View style={{ flex: 1 }}>
                <Text style={{ marginBottom: "auto" }}>
                    Exercises for Today
                </Text>

                <TouchableOpacity
                    onPress={() => handleCreateData()}
                    style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderWidth: 1,
                    }}
                >
                    <Text>{checkOngoing()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={checkOngoing() === "ongoing"}
                    onPress={() =>
                        router.push({
                            pathname: "/routines/edit-routine-screen",
                            params: {
                                routineId,
                            },
                        })
                    }
                    style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderWidth: 1,
                    }}
                >
                    <Text>Edit Routine</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
