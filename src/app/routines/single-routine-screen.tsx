import { useRoutineStore } from "@/stores/routine-stores/routineStore";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

export default function SingleRoutineScreen() {
    // const [routine, setRoutine] = useState<Routine | null>(null);
    // const { routineId }: { routineId: string } = useLocalSearchParams();
    // const router = useRouter();

    // useEffect(() => {
    //     const load = async () => {
    //         const res = await getSingleRoutine(routineId);
    //         setRoutine(res);
    //     };
    //     load();
    // }, []);

    // if (!routineId || !routine) {
    //     console.log("No id");
    //     return <Text>No id or routine</Text>;
    // }

    // const checkOngoing: () => "start" | "ongoing" | "redo" = () => {
    //     if (!routine.routineData.length) {
    //         return "start";
    //     }
    //     const exists =
    //         new Date().getDate() ===
    //         routine.routineData[0].interactionTime.getDate(); // Is the latest data from today?
    //     if (!exists) {
    //         // New day
    //         return "start";
    //     }
    //     const ongoing = routine.routineData[0].isComplete === true; // Is it complete?
    //     if (!ongoing) {
    //         // Exists but completed
    //         return "ongoing";
    //     }
    //     return "redo";
    // };

    // const handleCreateData = async () => {
    //     const ongoing = checkOngoing();
    //     if (ongoing === "ongoing") {
    //         router.push({
    //             pathname: "/routines/routine-focus-screen",
    //             params: {
    //                 routineId,
    //                 dataId: routine.routineData[0].id,
    //             },
    //         });
    //         return;
    //     }
    //     const res = await createCurrentDayData(routineId);
    //     router.push({
    //         pathname: "/routines/routine-focus-screen",
    //         params: {
    //             routineId,
    //             dataId: res.id,
    //         },
    //     });
    // };

    const router = useRouter();

    const { singleRoutine, runRoutineStart } = useRoutineStore(
        useShallow((state) => ({
            singleRoutine: state.singleRoutine,
            runRoutineStart: state.runRoutineStart,
        })),
    );

    if (!singleRoutine.nestedRoutine) return;

    return (
        <SafeAreaView style={{ padding: 10, flex: 1 }}>
            <Text>{singleRoutine.nestedRoutine.name}</Text>
            <View style={{ flex: 1 }}>
                <Text style={{ marginBottom: "auto" }}>
                    Exercises for Today
                </Text>

                <TouchableOpacity
                    onPress={() => runRoutineStart()}
                    style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderWidth: 1,
                    }}
                >
                    <Text>{singleRoutine.isOngoing}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={singleRoutine.isOngoing === "ongoing"}
                    onPress={() =>
                        router.push({
                            pathname: "/routines/edit-routine-screen",
                            params: {
                                routineId: singleRoutine.nestedRoutine!.id,
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
