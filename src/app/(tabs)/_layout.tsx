import { Tabs } from "expo-router";
import { BookSearch, Weight } from "lucide-react-native";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="(workouts)/index"
                options={{
                    title: "Workouts",
                    tabBarIcon: () => <BookSearch />,
                }}
            />
            <Tabs.Screen
                name="(milestones)/milestones-screen"
                options={{ title: "Milestones", tabBarIcon: () => <Weight /> }}
            />
        </Tabs>
    );
}
