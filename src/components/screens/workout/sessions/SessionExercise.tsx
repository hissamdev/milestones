import { useSessionStore } from "@/stores/session-store";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { initSessionActivity } from "@/utils/workouts/session-helpers";
import { markSessionActivityComplete } from "@/utils/workouts/session-queries";
import { useRouter } from "expo-router";
import {
    ArrowUpDown,
    ChevronLeft,
    CircleCheck,
    Flag,
    History,
    TrophyIcon,
} from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import RepsControls from "./ui/RepsControls";

export default function SessionExercise() {
    const { singleSession, findActivity } = useSessionStore(
        useShallow((state) => ({
            singleSession: state.singleSession,
            findActivity: state.findActivity,
        })),
    );

    const { openModal } = useWorkoutsGlobalState(
        useShallow((state) => ({ openModal: state.openModal })),
    );

    const router = useRouter();

    useEffect(() => {
        initSessionActivity();
    }, []);

    const handleComplete = () => {
        const current = singleSession.nestedSession!.sessionData!.find(
            (sd) => sd.sequence === singleSession.currentSequence,
        )!;

        const updated = {
            ...current,
            endTime: new Date(),
            isComplete: true,
        };

        markSessionActivityComplete(updated).catch(() => {
            console.error("Completion failed");
            return;
        });
        singleSession.complexSetters.sessionData({
            endTime: new Date(),
            isComplete: true,
        });
        singleSession.updateSession.insertRest();
    };

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
                        onPress={() => singleSession.updateSequence.decrement()}
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
                        onPress={() =>
                            openModal("exercises", "session-swap-current")
                        }
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            backgroundColor: "white",
                            borderWidth: 2,
                            borderColor: "#7D9FEA",
                            borderRadius: 100,
                        }}
                    >
                        <Text style={{ color: "#1A56DB", fontWeight: 500 }}>
                            Swap
                        </Text>
                        <Text>
                            <ArrowUpDown color="#1A56DB" size={14} />
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
                        {
                            singleSession.nestedSession!.sessionData!.find(
                                (sd) =>
                                    sd.sequence ===
                                    singleSession.currentSequence,
                            )!.exercise?.displayName
                        }
                    </Text>
                    <Text
                        style={{ marginTop: 0, fontSize: 15, color: "white" }}
                    ></Text>
                </View>
            </View>
            <View
                style={{
                    padding: 20,
                    flex: 1,
                }}
            >
                <View style={{}}>
                    {/* {"reps" === "reps" ? <RepControls /> : <DurationControls />} */}
                    <RepsControls />

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

                            {singleSession
                                .nestedSession!.sessionData!.filter(
                                    (sd) => !sd.isRest && sd.isComplete,
                                )
                                .map((sd) => (
                                    <View
                                        key={sd.id}
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
                                            <Text>
                                                {sd.exercise?.displayName}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 / 3 }}>
                                            <Text>{sd.amount}</Text>
                                        </View>
                                        <View>
                                            <Text>
                                                {Math.round(
                                                    (sd.endTime!.getTime() -
                                                        sd.startTime!.getTime()) /
                                                        1000,
                                                )}
                                            </Text>
                                        </View>
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
                                    backgroundColor: "#FFE4E6",
                                    borderWidth: 1,
                                    borderColor: "#FDA4AF",
                                },
                            ]}
                        >
                            <Text>
                                <Flag size={17} color="#BE123C" />
                            </Text>
                            <Text
                                style={[
                                    styles.buttonText,
                                    {
                                        fontSize: 14,
                                        color: "#BE123C",
                                        fontWeight: 500,
                                    },
                                ]}
                            >
                                Done
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleComplete();
                            }}
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
                                Rest
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
