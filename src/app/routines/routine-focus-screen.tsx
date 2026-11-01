import ExerciseScreen from "@/components/sections/single-routine/ExerciseScreen";
import RestScreen from "@/components/sections/single-routine/RestScreen";
import { getCurrentDayExercises } from "@/utils/workouts/routineHelpers";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { DayTemplateTEE } from "./edit-routine-screen";

export default function RoutineFocusScreen() {
    const [currentSequence, setCurrentSequence] = useState(1);
    const { routineId, dataId }: { routineId: string; dataId: string } =
        useLocalSearchParams();
    const [currentDay, setCurrentDay] = useState<DayTemplateTEE | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!routineId) {
                console.error("Routine id not provided");
                return;
            }
            const routineDay = await getCurrentDayExercises(routineId);
            if (!routineDay) return;
            setCurrentDay(routineDay);
        };

        load();
    }, []);

    const currentActivity = currentDay?.routineTemplate.templateExercises.find(
        (te) => te.sequence === currentSequence,
    );

    if (!currentDay || !currentActivity) {
        return <Text>Current day or activity not found {routineId}</Text>;
    }
    return (
        <View style={{ flex: 1 }}>
            {currentActivity.displayRestAmount ? (
                <RestScreen
                    routineId={routineId}
                    dataId={dataId}
                    routineTemplate={currentDay.routineTemplate}
                    currentSequence={currentSequence}
                    setCurrentSequence={setCurrentSequence}
                />
            ) : (
                <ExerciseScreen
                    routineTemplate={currentDay.routineTemplate}
                    dataId={dataId}
                    currentSequence={currentSequence}
                    setCurrentSequence={setCurrentSequence}
                    routineId={routineId}
                />
            )}
        </View>
    );
}
