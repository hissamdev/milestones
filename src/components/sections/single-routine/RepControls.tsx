import { useRoutineStore } from "@/stores/routine-stores/routineStore";
import { Dumbbell, Minus, Plus, Timer } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function RepControls() {
    // const handleUpdateAmount = async (mode: "add" | "subtract") => {
    //     if (mode === "subtract") {
    //         const safeSubtraction = amount - 1 < 0 ? 0 : amount - 1;
    //         setAmount((prev) => (prev - 1 < 0 ? 0 : prev - 1));
    //         await updateExerciseAmountData(
    //             exerciseDataId,
    //             safeSubtraction,
    //             currentActivity.exercise!.type as "reps" | "duration",
    //         );
    //         return;
    //     }
    //     setAmount((prev) => prev + 1);
    //     await updateExerciseAmountData(
    //         exerciseDataId,
    //         amount + 1,
    //         currentActivity.exercise!.type as "reps" | "duration",
    //     );
    //     return;
    // };

    const { singleRoutine } = useRoutineStore(
        useShallow((state) => ({
            singleRoutine: state.singleRoutine,
        })),
    );

    const currentActivity = singleRoutine.findSingleActivity();

    return (
        <View
            style={{
                paddingBottom: 10,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
            }}
        >
            <View
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderWidth: 1,
                    flex: 1,
                    borderRadius: 10,
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text>Reps</Text>
                    <Text>
                        <Dumbbell size={15} />
                    </Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 5,
                    }}
                >
                    <Text style={{ fontSize: 30, lineHeight: 50 }}>
                        {currentActivity.workAmount}
                    </Text>
                    <Text
                        style={{
                            paddingTop: 5,
                            fontSize: 14,
                            textTransform: "uppercase",
                            verticalAlign: "middle",
                        }}
                    >
                        reps
                    </Text>
                </View>
                <View
                    style={{
                        paddingTop: 5,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderTopWidth: 1.5,
                        borderTopColor: "#EAEAEF",
                        gap: 10,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            paddingVertical: 3,
                            flex: 1,
                            backgroundColor: "#EFEDEE",
                            borderRadius: 5,
                        }}
                    >
                        <Text style={{ textAlign: "center" }}>
                            <Minus />
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 3,
                            flex: 1,
                            backgroundColor: "#094CB2",
                            borderRadius: 5,
                        }}
                    >
                        <Text style={{ textAlign: "center" }}>
                            <Plus color="white" />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/*Second box */}
            <View
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderWidth: 1,
                    flex: 1,
                    borderRadius: 10,
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text>Set Duration</Text>
                    <Text>
                        <Timer size={15} />
                    </Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 5,
                    }}
                >
                    <Text style={{ fontSize: 30, lineHeight: 50 }}>00:25</Text>
                    <Text
                        style={{
                            paddingTop: 5,
                            fontSize: 14,
                            textTransform: "uppercase",
                            verticalAlign: "middle",
                        }}
                    >
                        {currentActivity.exerciseType === "reps" ? "reps" : "s"}
                    </Text>
                </View>
                <View
                    style={{
                        paddingTop: 5,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "stretch",
                        borderTopWidth: 1.5,
                        borderTopColor: "#EAEAEF",
                        gap: 10,
                    }}
                >
                    {/* <TouchableOpacity
                        style={{
                            paddingVertical: 3,
                            flex: 1,
                            backgroundColor: "#EFEDEE",
                            borderRadius: 5,
                        }}
                    >
                        <Text style={{ textAlign: "center" }}>
                            <Minus />
                        </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingVertical: 3,
                            flex: 1,
                            backgroundColor: "#094CB2",
                            borderRadius: 5,
                            height: 30,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                textAlignVertical: "center",
                                lineHeight: 10,
                                color: "white",
                            }}
                        >
                            Start
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
