import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function SingleRoutineScreen() {
    const { routineId } = useLocalSearchParams();
    const router = useRouter();

    if (!routineId) {
        return <Text>No id</Text>;
    }
    return (
        <View style={{ padding: 30 }}>
            <Text>Routine</Text>
            <View>
                <Text>Exercises for Today</Text>
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: "/routines/routine-focus-screen",
                        })
                    }
                    style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderWidth: 1,
                    }}
                >
                    <Text>Start Routine</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
