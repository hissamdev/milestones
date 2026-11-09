import { useRoutineStore } from "@/stores/routine-stores/routineStore";
import { calculateEnd } from "@/utils/workouts/focus-screen-helpers";
import { ChevronLeft, ChevronRight, RefreshCcwIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function RestScreen() {
    const { singleRoutine } = useRoutineStore(
        useShallow((state) => ({ singleRoutine: state.singleRoutine })),
    );

    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!singleRoutine.findSingleActivity().startTime) {
            if (!singleRoutine.findSingleActivity().useStopwatch) {
                singleRoutine.markStart(newTimestamp);
                singleRoutine.markEnd(
                    calculateEnd(
                        newTimestamp,
                        singleRoutine.findSingleActivity().workAmount,
                    ),
                );
                return;
            }
            singleRoutine.markStart(newTimestamp).catch((error) => {
                console.error(error);
                return;
            });
        }

        const newTime = new Date();
        const initStartEnd = () => {
            if (!singleRoutine.findSingleActivity().useStopwatch) {
                if (!singleRoutine.findSingleActivity().startTime) {
                    singleRoutine.markStart(newTime);
                    singleRoutine.markEnd(
                        calculateEnd(
                            newTime,
                            singleRoutine.findSingleActivity().workAmount,
                        ),
                    );
                    return;
                }
                shouldResetCountdown();
                return;
            }

            if (!singleRoutine.findSingleActivity().startTime) {
                singleRoutine.markStart(newTime);
            }
        };

        initStartEnd();
        updateDisplay();

        const timer = setInterval(updateDisplay, 100);

        return () => clearInterval(timer);
    }, []);

    const updateDisplay = () => {
        const currentTime = new Date();
        if (!singleRoutine.findSingleActivity().useStopwatch) {
            const remaining =
                Math.round(
                    singleRoutine.findSingleActivity().endTime!.getTime() -
                        currentTime.getTime(),
                ) / 1000;
            setDisplay(remaining);
            return;
        }
        const elapsed =
            Math.round(
                currentTime.getTime() -
                    singleRoutine.findSingleActivity().startTime!.getTime(),
            ) / 1000;
        setDisplay(elapsed);
    };

    const shouldResetCountdown = () => {
        const newTimestamp = new Date();
        if (
            calculateEnd(
                singleRoutine.findSingleActivity().startTime!,
                singleRoutine.findSingleActivity().workAmount,
            ) < new Date()
        ) {
            singleRoutine.markStart(newTimestamp);
            singleRoutine.markEnd(
                calculateEnd(
                    newTimestamp,
                    singleRoutine.findSingleActivity().workAmount,
                ),
            );
            return;
        }

        // singleRoutine.markEnd(
        //     calculateEnd(
        //         singleRoutine.findSingleActivity().startTime!,
        //         singleRoutine.findSingleActivity().workAmount,
        //     ),
        // );
    };

    const handleSwitching = () => {
        console.log("Captured", display);
        if (!singleRoutine.findSingleActivity().useStopwatch) {
            singleRoutine.complexSetters.activity("useStopwatch", true);
            updateDisplay();
            return;
        }
        shouldResetCountdown();
        singleRoutine.complexSetters.activity("useStopwatch", false);
        updateDisplay();
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#1950CE" }}>
            <View
                style={{
                    marginTop: 50,
                    marginHorizontal: 20,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        singleRoutine.updateSequence.decrement();
                    }}
                    style={{
                        padding: 10,
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
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        padding: 10,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 100,
                    }}
                >
                    <Text>
                        <ChevronRight color="white" size={16} />
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 50 }}>
                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Text>Up Next</Text>
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: "gray",
                        }}
                    />
                    <Text>Plank</Text>
                    <Text></Text>
                </View>

                <View
                    style={{
                        marginTop: 100,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 50, color: "white" }}>
                        {display}
                    </Text>
                    <Text style={{ fontSize: 30, color: "white" }}>
                        {singleRoutine.findSingleActivity().useStopwatch
                            ? "Elapsed"
                            : "Remaining"}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    marginTop: "auto",
                    marginBottom: 50,
                    height: 40,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "center",
                    gap: 30,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: "gray",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        aspectRatio: 1 / 1,
                        borderRadius: 100,
                    }}
                >
                    <RefreshCcwIcon color="white" size={17} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSwitching}
                    style={{
                        backgroundColor: "gray",
                        display: "flex",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                        borderRadius: 100,
                    }}
                >
                    <Text style={{ color: "white" }}>Switch to Stopwatch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: "gray",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        aspectRatio: 1 / 1,
                        borderRadius: 100,
                    }}
                >
                    <ChevronRight color="white" size={17} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
