import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
    return (
        <View style={{ paddingHorizontal: 15 }}>
            <View>
                <Text>Header</Text>
            </View>
            <TouchableOpacity
                style={{
                    alignSelf: "flex-start",
                    marginTop: 100,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderColor: "black",
                    borderWidth: 1,
                }}
            >
                <Text>Create Property</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 35 }}></View>
        </View>
    );
}
