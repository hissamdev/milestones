import ExerciseScreen from "@/components/sections/single-routine/ExerciseScreen";
import RestScreen from "@/components/sections/single-routine/RestScreen";
import { useRoutineStore } from "@/stores/routine-stores/routineStore";
import { View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export type TopLevelData = {
    id: string;
    routineId: string;
    interactionTime: Date;
    completionPercentage: number;
    isComplete: boolean;
    dataExercises: {
        id: string;
        exerciseId: string | null;
        routineId: string | null;
        sequence: number;
        isComplete: boolean;
        parentMetadataId: string;
        isRest: boolean;
        exerciseName: string | null;
        exerciseDisplayName: string | null;
        exerciseDesc: string | null;
        exerciseType: string | null;
        workAmount: number | null;
        startTime: Date;
        endTime: Date | null;
    }[];
};

export default function RoutineFocusScreen() {
    // const [currentSequence, setCurrentSequence] = useState(1);
    // const { routineId, dataId }: { routineId: string; dataId: string } =
    //     useLocalSearchParams();
    // const [currentDay, setCurrentDay] = useState<DayTemplateTEE | null>(null);
    // const [routineData, setRoutineData] = useState<TopLevelData | null>(null);

    // useEffect(() => {
    //     const load = async () => {
    //         if (!routineId) {
    //             console.error("Routine id not provided");
    //             return;
    //         }

    //         const routineDay = await getCurrentDayExercises(routineId);
    //         if (!routineDay) return;
    //         setCurrentDay(routineDay);
    //         const topLevelData = await getTopLevelData(dataId);
    //         if (!topLevelData || !topLevelData.dataExercises.length) {
    //             return;
    //         }
    //         setRoutineData(topLevelData);

    //         const firstIncomplete = topLevelData.dataExercises.find(
    //             (de) => !de.isComplete,
    //         );

    //         setCurrentSequence(firstIncomplete!.sequence!);
    //     };

    //     load();
    // }, []);

    // const currentActivity = currentDay?.routineTemplate.templateExercises.find(
    //     (te) => te.sequence === currentSequence,
    // );

    // if (!currentDay || !currentActivity) {
    //     return <Text>Current day or activity not found {routineId}</Text>;
    // }

    const { singleRoutine } = useRoutineStore(
        useShallow((state) => ({
            singleRoutine: state.singleRoutine,
            findCurrent: state.findCurrentDay,
        })),
    );

    if (!singleRoutine.nestedRoutine) {
        console.error("Single routine data was not initialized");
        return;
    }

    return (
        <View style={{ flex: 1 }}>
            {singleRoutine.nestedRoutine.routineData[0].dataExercises.find(
                (de) => de.sequence === singleRoutine.currentSequence,
            )!.isRest ? (
                <RestScreen />
            ) : (
                <ExerciseScreen />
            )}
        </View>
    );
}
