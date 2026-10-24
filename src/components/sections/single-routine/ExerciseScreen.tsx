import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function ExerciseScreen() {
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    paddingHorizontal: 20,
                    height: 300,
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
                        marginTop: 30,
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
                </View>
            </View>
        </View>
    );
}
