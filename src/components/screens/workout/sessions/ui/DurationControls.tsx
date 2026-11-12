import { Minus, Play, Plus, TimerResetIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function DurationControls() {
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
                    <Text style={{ fontSize: 20 }}>60</Text>
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
                    <Text style={{ color: "white" }}>Start</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
