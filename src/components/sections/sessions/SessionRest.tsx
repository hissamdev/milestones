import { ChevronLeft, ChevronRight, RefreshCcwIcon } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function SessionRest() {
    const [display, setDisplay] = useState(0);

    // const updateDisplay = () => {
    //     const currentTime = new Date();
    //     if (!singleRoutine.findSingleActivity().useStopwatch) {
    //         const remaining =
    //             Math.round(
    //                 singleRoutine.findSingleActivity().endTime!.getTime() -
    //                     currentTime.getTime(),
    //             ) / 1000;
    //         setDisplay(remaining);
    //         return;
    //     }
    //     const elapsed =
    //         Math.round(
    //             currentTime.getTime() -
    //                 singleRoutine.findSingleActivity().startTime!.getTime(),
    //         ) / 1000;
    //     setDisplay(elapsed);
    // };

    // const shouldResetCountdown = () => {
    //     const newTimestamp = new Date();
    //     if (
    //         calculateEnd(
    //             singleRoutine.findSingleActivity().startTime!,
    //             singleRoutine.findSingleActivity().workAmount,
    //         ) < new Date()
    //     ) {
    //         singleRoutine.markStart(newTimestamp);
    //         singleRoutine.markEnd(
    //             calculateEnd(
    //                 newTimestamp,
    //                 singleRoutine.findSingleActivity().workAmount,
    //             ),
    //         );
    //         return;
    //     }

    //     // singleRoutine.markEnd(
    //     //     calculateEnd(
    //     //         singleRoutine.findSingleActivity().startTime!,
    //     //         singleRoutine.findSingleActivity().workAmount,
    //     //     ),
    //     // );
    // };

    // const handleSwitching = () => {
    //     console.log("Captured", display);
    //     if (!singleRoutine.findSingleActivity().useStopwatch) {
    //         singleRoutine.complexSetters.activity("useStopwatch", true);
    //         updateDisplay();
    //         return;
    //     }
    //     shouldResetCountdown();
    //     singleRoutine.complexSetters.activity("useStopwatch", false);
    //     updateDisplay();
    // };

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
                        Elapsed
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
