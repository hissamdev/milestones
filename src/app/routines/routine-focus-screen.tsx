import ExerciseScreen from "@/components/sections/single-routine/ExerciseScreen";
import RestScreen from "@/components/sections/single-routine/RestScreen";
import { getCurrentDayExercises } from "@/utils/routineHelpers";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function RoutineFocusScreen() {
    const [currentSequence, setCurrentSequence] = useState(1);
    const { routineId }: { routineId: string } = useLocalSearchParams();
    const [currentDay, setCurrentDay] = useState<{
        id: string;
        routineId: string;
        routineTemplateId: string;
        dayTitle: string;
        routineTemplate: {
            id: string;
            restDay: boolean;
            templateExercises: {
                id: string;
                exerciseId: string;
                sequence: number;
                templateId: string;
                displayAmount: number;
                displayRestAmount: number | null;
                exercise: {
                    id: string;
                    name: string;
                    desc: string | null;
                    type: string;
                    createdAt: Date;
                    updatedAt: Date;
                    displayName: string;
                    icon: string | null;
                } | null;
            }[];
        };
    } | null>(null);

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
                <RestScreen />
            ) : (
                <ExerciseScreen
                    routineTemplate={currentDay.routineTemplate}
                    currentActivity={currentActivity}
                    currentSequence={currentSequence}
                    setCurrentSequence={setCurrentSequence}
                    routineId={routineId}
                />
            )}
        </View>
    );
}
