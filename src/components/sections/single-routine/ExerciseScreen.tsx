import {
    ChevronLeft,
    ChevronRight,
    CircleCheck,
    History,
    PlusCircle,
    TrophyIcon,
} from "lucide-react-native";
import { SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RepControls from "./RepControls";
// import * as SVG from "react-native-svg";
// import TrophyFill from "../../../../assets/images/trophy-fill-icon.svg";

export type CurrentActivity = {
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
};

export default function ExerciseScreen({
    setCurrentSequence,
    currentActivity,
}: {
    setCurrentSequence: React.Dispatch<SetStateAction<number>>;
    currentActivity: CurrentActivity;
}) {
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
                    <RepControls currentActivity={currentActivity} />

                    <View>
                        <View
                            style={{ height: 1.5, backgroundColor: "#EAEAEF" }}
                        />
                        <View
                            style={{
                                marginTop: 5,
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
                                        <TrophyIcon size={12} color="#D97706" />
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
                                        <History size={14} color="#475569" />
                                    </Text>
                                </View>
                            </View>
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
                            onPress={() =>
                                setCurrentSequence((prev) => prev + 1)
                            }
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
                                Done
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
