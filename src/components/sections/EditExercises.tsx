import { DayTemplateTEE } from "@/app/(workouts)/routines/edit-routine-screen";
import { EllipsisVertical, Minus, Plus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function EditExercises({
    fetchedCurrentDay,
    handleUpdateAmount,
}: {
    fetchedCurrentDay: DayTemplateTEE;
    handleUpdateAmount: (
        templateExerciseId: string,
        mode: "add" | "subtract",
    ) => void;
}) {
    return (
        <View style={{ display: "flex", gap: 10 }}>
            {fetchedCurrentDay.routineTemplate?.templateExercises.map((t) => (
                <View
                    key={t.id}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity>
                            <Text>
                                <EllipsisVertical size={18} />
                            </Text>
                        </TouchableOpacity>
                        <Text>{t.sequence}</Text>
                    </View>
                    <View
                        style={{
                            height: 50,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            flex: 1,
                            borderWidth: 1,
                            borderRadius: 3,
                        }}
                    >
                        <Text
                            style={{
                                marginLeft: 40,
                                marginVertical: "auto",
                            }}
                        >
                            {t.exercise?.displayName}
                        </Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    marginRight: 30,
                                }}
                            >
                                {!(t.displayAmount === null)
                                    ? t.displayAmount
                                    : "Null"}{" "}
                                {t.exercise?.type === "reps" ? "reps" : "s"}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    handleUpdateAmount(t.id, "subtract")
                                }
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 12,
                                    alignSelf: "stretch",
                                    backgroundColor: "darkred",
                                }}
                            >
                                <Text>
                                    <Minus color="white" strokeWidth={1} />
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleUpdateAmount(t.id, "add")}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 12,
                                    alignSelf: "stretch",
                                    backgroundColor: "limegreen",
                                }}
                            >
                                <Text>
                                    <Plus color="white" strokeWidth={1} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}
