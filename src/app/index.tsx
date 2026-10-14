import CreateMS from "@/components/ui/CreateMS";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
    const [showCreation, setShowCreation] = useState(false);

    return (
        <View style={{ position: "relative", paddingHorizontal: 15, flex: 1 }}>
            <View>
                <Text>Header</Text>
            </View>
            <TouchableOpacity
                onPress={() => setShowCreation((prev) => !prev)}
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
            {showCreation && <CreateMS setShow={setShowCreation} />}
        </View>
    );
}
