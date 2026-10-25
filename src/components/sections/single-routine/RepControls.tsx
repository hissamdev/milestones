import { Dumbbell, Minus, Plus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { CurrentActivity } from "./ExerciseScreen";

export default function RepControls({
    currentActivity,
}: {
    currentActivity: CurrentActivity;
}) {
    return (
        <View
            style={{
                paddingBottom: 10,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
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
                        {(!!currentActivity.displayAmount).toString()}
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
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderWidth: 1,
                    flex: 1,
                    borderRadius: 10,
                }}
            >
                <View
                    style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text>Completed</Text>
                    <Text>
                        <Dumbbell size={15} />
                    </Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                    }}
                >
                    <Text style={{ fontSize: 50, lineHeight: 50 }}>8</Text>
                    <Text
                        style={{
                            paddingTop: 20,
                            fontSize: 16,
                            textTransform: "uppercase",
                            verticalAlign: "middle",
                        }}
                    >
                        reps
                    </Text>
                </View>
            </View>
        </View>
    );
}
