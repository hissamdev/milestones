import { db, expoDb } from "@/db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import migrations from "../../drizzle/migrations";

import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { BookSearch, Weight } from "lucide-react-native";

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations as any);
    useDrizzleStudio(expoDb);

    if (error) {
        console.log(error, error.message, error.cause);
        return <Text>{error.message}</Text>;
    }

    if (!success) {
        return <Text>Loading</Text>;
    }

    return (
        <Tabs>
            <Tabs.Screen
                name="(milestones)/milestones"
                options={{
                    title: "Milestones",
                    tabBarIcon: () => <BookSearch />,
                }}
            />
            <Tabs.Screen
                name="(workouts)/workouts-screen"
                options={{ title: "Workouts", tabBarIcon: () => <Weight /> }}
            />
            <Tabs.Screen
                name="(workouts)/routines/edit-routine-screen"
                options={{ title: "Workouts", tabBarIcon: () => <Weight /> }}
            />
        </Tabs>
    );
}
