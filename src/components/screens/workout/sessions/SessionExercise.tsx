import { useSessionStore } from "@/stores/session-store";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import { formatSeconds } from "@/utils/workouts/session-helpers";
import {
    markSessionActivityComplete,
    markSessionComplete,
} from "@/utils/workouts/session-queries";
import { useRouter } from "expo-router";
import {
    ArrowUpDown,
    ChevronLeft,
    CircleCheck,
    Flag,
    History,
    TrophyIcon,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";
import DurationControls from "./ui/DurationControls";
import RepsControls from "./ui/RepsControls";

export default function SessionExercise() {
    const { singleSession, pushSplit } = useSessionStore(
        useShallow((state) => ({
            singleSession: state.singleSession,
            findActivity: state.findActivity,
            sessionComplete: state.setSessionEnd,
            pushSplit: state.pushSecondSplit,
        })),
    );

    const { openModal } = useWorkoutsGlobalState(
        useShallow((state) => ({ openModal: state.openModal })),
    );

    const [durStoppedSafely, setDurStoppedSafely] = useState(false);
    const [sideChosen, setSideChosen] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const router = useRouter();

    useEffect(() => {}, []);

    const handleForward = () => {
        if (!singleSession.nestedSession!.useTemplate) {
            // Session
            singleSession.updateSession.insertRest("insert");
            return;
        }
        if (
            singleSession.currentSequence >=
            singleSession.nestedSession!.sessionData!.length
        ) {
            handleSessionComplete();
            return;
        }
        singleSession.updateSession.insertRest("push");
    };

    const handleExerciseComplete = () => {
        clearInterval(timerRef.current);
        const current = singleSession.nestedSession!.sessionData!.find(
            (sd) => sd.sequence === singleSession.currentSequence,
        )!;

        const safeEnd = durStoppedSafely ? current.endTime! : new Date();
        const recalculateAmount = Math.round(
            (safeEnd.getTime() - current.startTime!.getTime()) / 1000,
        );
        const updated = {
            ...current,
            displayName: current.exercise!.isSplit
                ? `${current.exercise!.displayName} (${current.splitSide?.charAt(0).toUpperCase()! + current.splitSide?.slice(1)}) `
                : current.displayName,
            endTime: current.exercise!.type === "reps" ? new Date() : safeEnd,
            amount:
                current.exercise!.type === "reps"
                    ? current.amount
                    : recalculateAmount,
            isComplete: true,
        };

        singleSession.complexSetters.sessionData({
            endTime: updated.endTime,
            displayName: updated.displayName,
            amount: updated.amount,
            isComplete: true,
            splitSide: updated.splitSide,
        });
        markSessionActivityComplete(updated).catch(() => {
            console.error("Completion failed");
            return;
        });
        return updated;
    };

    const handleSplitSelect = (pick: "left" | "right") => {
        singleSession.complexSetters.sessionData({
            splitSide: pick,
        });
    };

    const handleSessionComplete = () => {
        markSessionComplete();
        router.push({
            pathname: "/",
        });
    };

    const disableNextButton = () => {
        const current = singleSession.nestedSession!.sessionData!.find(
            (sd) => sd.sequence === singleSession.currentSequence,
        )!;
        if (!current.startTime)
            return {
                isDisabled: true,
                showText: "Waiting...",
            };
        if (current.exercise!.isSplit) {
            if (!current.splitSide) {
                return {
                    isDisabled: true,
                    showText: "Choose a side",
                };
            }
            return {
                isDisabled: false,
                showText: `${current.splitSide} done`,
            };
        }
        return {
            isDisabled: false,
            showText: singleSession.nestedSession!.useTemplate
                ? current.sequence ===
                  singleSession!.nestedSession!.sessionData!.length
                    ? "Done"
                    : "Next"
                : "Rest",
        };
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
                    {singleSession.nestedSession!.sessionData!.find(
                        (sd) => sd.sequence === singleSession.currentSequence,
                    )!.exercise!.type === "reps" ? (
                        <RepsControls />
                    ) : (
                        <DurationControls
                            setSafelyStopped={setDurStoppedSafely}
                            timerRef={timerRef}
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
                                <View
                                    style={{
                                        width: "20%",
                                        minWidth: 0,
                                    }}
                                >
                                    <Text style={{ textAlign: "center" }}>
                                        Amount
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: "20%",
                                        minWidth: 0,
                                    }}
                                >
                                    <Text style={{ textAlign: "center" }}>
                                        Duration
                                    </Text>
                                </View>
                            </View>

                            {singleSession
                                .nestedSession!.sessionData!.filter(
                                    (sd) => !sd.isRest && sd.isComplete,
                                )
                                .map((sd) => (
                                    <View
                                        key={sd.sequence}
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
                                                {sd.displayName
                                                    ? sd.displayName
                                                    : sd.exercise?.displayName}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                width: "20%",
                                                minWidth: 0,
                                            }}
                                        >
                                            <Text
                                                style={{ textAlign: "center" }}
                                            >
                                                {sd.exercise!.type === "reps"
                                                    ? `${String(sd.amount).padStart(2, "0")}`
                                                    : formatSeconds(sd.amount)}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                width: "20%",
                                                minWidth: 0,
                                            }}
                                        >
                                            <Text
                                                style={{ textAlign: "center" }}
                                            >
                                                {formatSeconds(
                                                    Math.round(
                                                        (sd.endTime!.getTime() -
                                                            sd.startTime!.getTime()) /
                                                            1000,
                                                    ),
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "auto" }}>
                    {singleSession.nestedSession!.sessionData!.find(
                        (sd) => sd.sequence === singleSession.currentSequence,
                    )!.exercise!.isSplit && (
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10,
                                height: 40,
                            }}
                        >
                            <TouchableOpacity
                                disabled={
                                    singleSession.nestedSession!.sessionData!.find(
                                        (sd) =>
                                            sd.sequence ===
                                            singleSession.currentSequence,
                                    )!.isSecondSplit
                                }
                                onPress={() => handleSplitSelect("left")}
                                style={{
                                    flex: 1,
                                    backgroundColor:
                                        singleSession.nestedSession!.sessionData!.find(
                                            (sd) =>
                                                sd.sequence ===
                                                singleSession.currentSequence,
                                        )!.splitSide === "left"
                                            ? "#1952CC"
                                            : "transparent",
                                }}
                            >
                                <Text>Left</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={
                                    singleSession.nestedSession!.sessionData!.find(
                                        (sd) =>
                                            sd.sequence ===
                                            singleSession.currentSequence,
                                    )!.isSecondSplit
                                }
                                onPress={() => handleSplitSelect("right")}
                                style={{
                                    flex: 1,
                                    backgroundColor:
                                        singleSession.nestedSession!.sessionData!.find(
                                            (sd) =>
                                                sd.sequence ===
                                                singleSession.currentSequence,
                                        )!.splitSide === "right"
                                            ? "#1952CC"
                                            : "transparent",
                                }}
                            >
                                <Text>Right</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleSessionComplete}
                            style={[
                                styles.stepButtons,
                                {
                                    backgroundColor: "#FFE4E6",

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
                            disabled={disableNextButton().isDisabled}
                            onPress={() => {
                                const current = handleExerciseComplete();
                                if (current.exercise!.isSplit) {
                                    if (current.isSecondSplit) {
                                        handleForward();
                                        return;
                                    }
                                    pushSplit(current);
                                    singleSession.updateSequence.increment();
                                    return;
                                }
                                handleForward();
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
                                {disableNextButton().showText}
                            </Text>
                        </TouchableOpacity>
                        {singleSession.nestedSession!.sessionData!.find(
                            (sd) =>
                                sd.sequence === singleSession.currentSequence,
                        )!.exercise!.isSplit && (
                            <TouchableOpacity
                                disabled={disableNextButton().isDisabled}
                                onPress={() => {
                                    const current =
                                        singleSession.nestedSession!.sessionData!.find(
                                            (sd) =>
                                                sd.sequence ===
                                                singleSession.currentSequence,
                                        )!;
                                    if (current.isSecondSplit) {
                                        handleExerciseComplete();
                                        handleForward();
                                        return;
                                    }
                                    handleExerciseComplete();
                                    pushSplit(current);
                                    handleForward();
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
                                    style={[
                                        styles.buttonText,
                                        { color: "white" },
                                    ]}
                                >
                                    Rest
                                </Text>
                            </TouchableOpacity>
                        )}
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
