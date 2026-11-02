import { DayTemplateTEE } from "@/app/routines/edit-routine-screen";
import { TopLevelData } from "@/app/routines/routine-focus-screen";
import { initializeExerciseData } from "@/utils/workouts/routineHelpers";
import { useRouter } from "expo-router";
import {
    ChevronLeft,
    ChevronRight,
    CircleCheck,
    History,
    PlusCircle,
    TrophyIcon,
} from "lucide-react-native";
import { SetStateAction, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DurationControls from "./DurationControls";
import RepControls from "./RepControls";

export default function ExerciseScreen({
    routineTemplate,
    setCurrentSequence,
    currentSequence,
    routineId,
    dataId,
    topLevelData,
}: {
    routineTemplate: DayTemplateTEE["routineTemplate"];
    setCurrentSequence: React.Dispatch<SetStateAction<number>>;
    currentSequence: number;
    routineId: string;
    dataId: string;
    topLevelData: TopLevelData | null;
}) {
    const [isNextAvailable, setIsNextAvailable] = useState(false);
    const [exerciseDataId, setExerciseDataId] = useState("");
    const [currentActivity, setCurrentActivity] = useState<
        DayTemplateTEE["routineTemplate"]["templateExercises"][0] | null
    >(null);
    const [amount, setAmount] = useState(0);

    const router = useRouter();

    useEffect(() => {
        const load = () => {
            const isNextAvailable = routineTemplate.templateExercises.find(
                (te) => te.sequence === currentSequence + 1,
            );
            if (!isNextAvailable) {
                setIsNextAvailable(false);
                return;
            }
            setIsNextAvailable(true);
        };

        load();
    }, [currentSequence]);

    useEffect(() => {
        // Create entry for this exercise if does not exist, update it on each interaction
        const load = async () => {
            const currentExercise = routineTemplate.templateExercises.find(
                (te) => te.sequence === currentSequence,
            );
            if (!currentExercise) return;
            setCurrentActivity(currentExercise);

            const res = await initializeExerciseData({
                exerciseId: currentExercise.exercise!.id,
                dataId,
                name: currentExercise.exercise!.displayName,
                desc: currentExercise.exercise!.desc,
                type: currentExercise.exercise!.type as "reps" | "duration",
                workAmount: currentExercise.displayAmount!,
                sequence: currentSequence,
            });
            if (!res) {
                return;
            }
            setExerciseDataId(res.id);
            setAmount(res.workAmount!);
        };
        load();
    }, []);

    const handleNextSequence = () => {
        if (!isNextAvailable) {
            router.navigate({
                pathname: "/routines/single-routine-screen",
                params: {
                    routineId,
                },
            });
            return;
        }

        setCurrentSequence((prev) => prev + 1);
    };

    if (!currentActivity || !exerciseDataId) return;

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    paddingHorizontal: 20,
                    height: 350,
                    backgroundColor: "#3166CA",
                }}
            >
                <View
                    style={{
                        marginTop: 50,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: 100,
                        }}
                    >
                        <Text>
                            <ChevronLeft color="white" size={16} />
                        </Text>
                        <Text style={{ color: "white" }}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: 100,
                        }}
                    >
                        <Text style={{ color: "white" }}>Skip</Text>
                        <Text>
                            <ChevronRight color="white" size={16} />
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        marginTop: 50,
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: "#ffffff0a",
                        }}
                    />
                    <Text
                        style={{ marginTop: 10, fontSize: 24, color: "white" }}
                    >
                        {currentActivity.exercise?.displayName}
                    </Text>
                    <Text
                        style={{ marginTop: 0, fontSize: 15, color: "white" }}
                    >
                        {currentActivity.exercise?.desc}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    padding: 20,
                    flex: 1,
                }}
            >
                <View style={{}}>
                    {currentActivity.exercise?.type &&
                    currentActivity.exercise?.type === "reps" ? (
                        <RepControls
                            exerciseDataId={exerciseDataId}
                            currentActivity={currentActivity}
                            amount={amount}
                            setAmount={setAmount}
                        />
                    ) : (
                        <DurationControls
                            currentActivity={currentActivity}
                            amount={amount}
                        />
                    )}

                    <View>
                        <View
                            style={{
                                paddingTop: 8,
                                paddingBottom: 8,
                                borderTopWidth: 1.5,
                                borderBottomWidth: 1.5,
                                borderColor: "#EAEAEF",
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View>
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-start",
                                            gap: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                padding: 4,
                                                backgroundColor: "#F9EBD6",
                                                borderRadius: 100,
                                            }}
                                        >
                                            <TrophyIcon
                                                size={12}
                                                color="#D97706"
                                            />
                                        </Text>
                                        <View>
                                            <Text>Lifetime Record</Text>
                                            <Text>12 reps</Text>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "flex-start",
                                            gap: 5,
                                        }}
                                    >
                                        <View>
                                            <Text>Last week best</Text>
                                            <Text
                                                style={{
                                                    textAlign: "right",
                                                }}
                                            >
                                                10 reps
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                padding: 4,
                                                backgroundColor: "#EBECEF",
                                                borderRadius: 100,
                                            }}
                                        >
                                            <History
                                                size={14}
                                                color="#475569"
                                            />
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{}}>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginTop: 10,
                                    paddingBottom: 4,
                                    borderBottomWidth: 1.5,
                                    borderBottomColor: "#EAEAEF",
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text>Completed</Text>
                                </View>
                                <View style={{ flex: 1 / 3 }}>
                                    <Text>Amount</Text>
                                </View>
                                <View>
                                    <Text>Duration</Text>
                                </View>
                            </View>

                            {topLevelData &&
                                topLevelData.dataExercises
                                    .filter(
                                        (de) =>
                                            !de.isRest &&
                                            de.sequence !== currentSequence,
                                    )
                                    .map((de) => (
                                        <View key={de.id}>
                                            <Text>
                                                {de.exerciseName} {de.sequence}{" "}
                                                {currentSequence.toString()}
                                                {de.isRest.toString()}
                                                {JSON.stringify(
                                                    topLevelData.dataExercises.filter(
                                                        (de) =>
                                                            !de.isRest ||
                                                            de.sequence !==
                                                                currentSequence,
                                                    ),
                                                    null,
                                                    2,
                                                )}
                                            </Text>
                                        </View>
                                    ))}
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "auto" }}>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.stepButtons,
                                {
                                    backgroundColor: "#EFEDEE",
                                    borderWidth: 1,
                                    borderColor: "#DDDDE4",
                                },
                            ]}
                        >
                            <Text>
                                <PlusCircle size={17} />
                            </Text>
                            <Text style={[styles.buttonText, { fontSize: 14 }]}>
                                Add Set
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleNextSequence}
                            style={[
                                styles.stepButtons,
                                {
                                    backgroundColor: "#1952CC",
                                    flex: 1,
                                },
                            ]}
                        >
                            <Text>
                                <CircleCheck
                                    color="#1952CC"
                                    fill="white"
                                    size={17}
                                />
                            </Text>
                            <Text
                                style={[styles.buttonText, { color: "white" }]}
                            >
                                {isNextAvailable ? "Next" : "Finish"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    stepButtons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 24,
        height: 50,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
    },
});
