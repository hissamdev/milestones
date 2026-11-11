import { useSessionStore } from "@/stores/session-store";
import { Minus, Plus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function RepsControls() {
    const { singleSession } = useSessionStore(
        useShallow((state) => ({ singleSession: state.singleSession })),
    );

    return (
        <View>
            <Text style={{ textAlign: "center" }}>Completed Reps</Text>
            <View
                style={{
                    marginVertical: 20,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    height: 40,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: "#EFEDEE",
                        aspectRatio: 1 / 1,
                        borderWidth: 1,
                        borderColor: "#E8E7EA",
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ margin: "auto" }}>
                        <Minus />
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 30, fontWeight: 500 }}>
                        {
                            singleSession.nestedSession!.sessionData!.find(
                                (sd) =>
                                    sd.sequence ===
                                    singleSession.currentSequence,
                            )!
                        }
                    </Text>
                    <Text style={{ marginTop: 8, marginLeft: 4 }}>Reps</Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#094CB2",
                        aspectRatio: 1 / 1,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ margin: "auto" }}>
                        <Plus color="white" />
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
