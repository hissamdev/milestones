import { useSessionStore } from "@/stores/session-store";
import {
    resetCountdownTimers,
    updateDisplay,
} from "@/utils/workouts/session-helpers";
import { Minus, Play, Plus, TimerResetIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function DurationControls({
    timerRef,
}: {
    timerRef: {
        current: number | null;
    };
}) {
    const { singleSession } = useSessionStore(
        useShallow((state) => ({ singleSession: state.singleSession })),
    );
    const [timerState, setTimerState] = useState<
        "initial" | "running" | "complete"
    >("initial");
    const [seconds, setSeconds] = useState(
        singleSession.nestedSession!.sessionData!.find(
            (sd) => sd.sequence === singleSession.currentSequence,
        )!.amount,
    );

    useEffect(() => {}, []);

    const handleTimerUpdate = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            const seconds = updateDisplay(false);
            setSeconds(seconds);
        }, 100);
    };

    const handleTimerRun = () => {
        if (timerState === "initial") {
            resetCountdownTimers();
            setTimerState("running");
            handleTimerUpdate();
            return;
        }
        if (timerState === "running") {
            clearInterval(timerRef.current);
            setTimerState("complete");
            singleSession.complexSetters.sessionData({ endTime: new Date() });
            return;
        }
        clearInterval(timerRef.current);
    };

    return (
        <View
            style={{ maxWidth: "60%", width: "100%", marginHorizontal: "auto" }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: "#e4e8ec",
                        aspectRatio: 1 / 1,
                        width: 40,
                        borderRadius: 6,
                    }}
                >
                    <Text
                        style={{
                            margin: "auto",
                        }}
                    >
                        <Minus />
                    </Text>
                </TouchableOpacity>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ fontSize: 20 }}>{seconds}</Text>
                    <Text style={{ marginTop: 6 }}>s</Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#225FD7",
                        aspectRatio: 1 / 1,
                        width: 40,
                        borderRadius: 6,
                    }}
                >
                    <Text
                        style={{
                            margin: "auto",
                        }}
                    >
                        <Plus color="white" />
                    </Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    height: 40,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        clearInterval(timerRef.current);
                        setTimerState("initial");
                        setSeconds(
                            singleSession.nestedSession!.sessionData!.find(
                                (sd) =>
                                    sd.sequence ===
                                    singleSession.currentSequence,
                            )!.amount,
                        );
                    }}
                    style={{
                        flex: 1 / 2,
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#e4e8ec",
                        borderRadius: 10,
                    }}
                >
                    <Text>
                        <TimerResetIcon size={16} />
                    </Text>
                    <Text>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={timerState === "complete"}
                    onPress={handleTimerRun}
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#2260DB",
                        borderRadius: 10,
                    }}
                >
                    <Text>
                        <Play color="white" size={16} fill="white" />
                    </Text>
                    <Text style={{ color: "white" }}>
                        {timerState === "initial"
                            ? "Start"
                            : timerState === "running"
                              ? "Stop"
                              : "Done"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
