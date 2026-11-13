import EditExercises from "@/components/screens/workout/sessions/ui/EditExercise";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemplateEditScreen() {
    return (
        <SafeAreaView>
            <View>
                <Text>Template Edit screen</Text>
                <EditExercises />
            </View>
        </SafeAreaView>
    );
}
