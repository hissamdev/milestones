import { Plus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function Sessions() {
    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: 500 }}>Sessions</Text>
            <TouchableOpacity
                style={{
                    marginTop: 10,
                    backgroundColor: "gray",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 10,
                    borderRadius: 5,
                }}
            >
                <Text>
                    <Plus size={18} />
                </Text>
                <Text>Session</Text>
            </TouchableOpacity>
            <View></View>
        </View>
    );
}
