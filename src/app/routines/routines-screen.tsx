import { getRoutineDays } from "@/utils/routineHelpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function RoutineScreen() {
    const router = useRouter();
    const { routineId } = useLocalSearchParams();

    useEffect(() => {
        const load = async () => {
            if (!routineId) {
                router.push("/(tabs)/(workouts)/workouts-screen");
                return;
            }

            const res = await getRoutineDays(routineId as string);
            if (!res || !res.data) {
                console.error("Failed");
            }
        };
        load();
    }, [routineId]);

    return (
        <View>
            <Text>hi</Text>
        </View>
    );
}
