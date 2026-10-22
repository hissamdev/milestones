import { getRoutineDays } from "@/utils/routineHelpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function RoutineScreen() {
    const router = useRouter();
    const { routineId } = useLocalSearchParams();
    if (!routineId) {
        router.push("/(workouts)/workouts-screen");
        return;
    }
    useEffect(() => {
        const load = async () => {
            const res = await getRoutineDays(routineId as string);
            if (!res || !res.data) {
                console.error("Failed");
            }
        };
        load();
    }, []);

    return (
        <View>
            <Text>hi</Text>
        </View>
    );
}
