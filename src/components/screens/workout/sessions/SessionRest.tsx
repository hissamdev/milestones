import { useSessionStore } from "@/stores/session-store";
import { useWorkoutsGlobalState } from "@/stores/workouts-global-store";
import {
    initSessionRest,
    updateDisplay,
} from "@/utils/workouts/session-helpers";
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    RefreshCcwIcon,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function SessionRest() {
    const [display, setDisplay] = useState(0);
    const { openModal } = useWorkoutsGlobalState(
        useShallow((state) => ({
            openModal: state.openModal,
        })),
    );
    const { singleSession } = useSessionStore(
        useShallow((state) => ({ singleSession: state.singleSession })),
    );

    useEffect(() => {
        initSessionRest();

        const repeat = () => {
            const seconds = updateDisplay();

            setDisplay(seconds);
        };

        const timer = setInterval(repeat, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
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
                        <Text>
                            {
                                singleSession.nestedSession!.sessionData!.find(
                                    (sd) =>
                                        sd.sequence ===
                                        singleSession.currentSequence + 1,
                                )?.exercise?.displayName
                            }
                        </Text>
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
                        <TouchableOpacity
                            onPress={() => {
                                const nextExists =
                                    singleSession.nestedSession!.sessionData!.find(
                                        (sd) =>
                                            sd.sequence ===
                                            singleSession.currentSequence + 1,
                                    );
                                if (!nextExists) {
                                    openModal("exercises", "session-picker");
                                    return;
                                }
                                openModal("exercises", "session-swap-next");
                            }}
                            style={{
                                marginTop: 20,
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
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "#1A56DB",
                                    fontWeight: 500,
                                }}
                            >
                                {singleSession.nestedSession!.sessionData!.find(
                                    (sd) =>
                                        sd.sequence ===
                                        singleSession.currentSequence + 1,
                                )
                                    ? "Swap"
                                    : "Select next exercise"}
                            </Text>
                            <Text>
                                <ArrowUpDown color="#1A56DB" size={16} />
                            </Text>
                        </TouchableOpacity>
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
                        <Text style={{ color: "white" }}>
                            Switch to Stopwatch
                        </Text>
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
        </>
    );
}
