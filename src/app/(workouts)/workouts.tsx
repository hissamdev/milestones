import CreateExercise from "@/components/ui/CreateExercise";
import { Text, View } from "react-native";

export default function Workouts() {
    return (
        <View style={{ flex: 1, position: "relative" }}>
            <CreateExercise />
            <Text>hi</Text>
        </View>
    );
}
