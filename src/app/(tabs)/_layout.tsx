import { Tabs } from "expo-router";
import { BookSearch, Weight } from "lucide-react-native";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="(workouts)/workouts-screen"
                options={{
                    title: "Workouts",
                    tabBarIcon: () => <BookSearch />,
                }}
            />
            <Tabs.Screen
                name="(milestones)/milestones"
                options={{ title: "Milestones", tabBarIcon: () => <Weight /> }}
            />
        </Tabs>
    );
}
