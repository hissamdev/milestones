import {
    Hourglass,
    Minus,
    Play,
    Plus,
    Square,
    Timer,
} from "lucide-react-native";
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
                    <Text>Stopwatch</Text>
                    <Text>
                        <Hourglass size={15} />
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
                        {currentActivity.exercise?.type === "reps"
                            ? "reps"
                            : "s"}
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
                        gap: 2,
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
                            backgroundColor: "#EFEDEE",
                            borderRadius: 5,
                            borderColor: "#E2E1E7",
                            borderWidth: 1,
                            height: 30,
                            width: 30,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                            }}
                        >
                            <Square size={15} color="#1B1C1D" />
                        </Text>
                    </TouchableOpacity>
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
                            }}
                        >
                            <Play size={15} color="white" />
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingVertical: 3,
                            backgroundColor: "#EFEDEE",
                            borderRadius: 5,
                            borderColor: "#E2E1E7",
                            borderWidth: 1,
                            height: 30,
                            width: 30,
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
                            <Minus size={15} color="#1B1C1D" />
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingVertical: 3,
                            backgroundColor: "#EFEDEE",
                            borderRadius: 5,
                            borderColor: "#E2E1E7",
                            borderWidth: 1,
                            height: 30,
                            width: 30,
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
                            <Plus size={15} color="#1B1C1D" />
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
                    borderRadius: 10,
                    minWidth: 130,
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
                        {currentActivity.exercise?.type === "reps"
                            ? "reps"
                            : "s"}
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
