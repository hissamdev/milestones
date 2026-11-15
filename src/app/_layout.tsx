import { db, expoDb } from "@/db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import migrations from "../../drizzle/migrations";

import { initExerciseList } from "@/utils/workouts/init-exercises";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations as any);
    useDrizzleStudio(expoDb);

    if (error) {
        console.log(error, error.message, error.cause);
        return <Text>{error.message}</Text>;
    }

    if (!success) {
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ margin: "auto" }}>Migrating</Text>
            </View>
        );
    }

    initExerciseList();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="routines/single-routine-screen"
                options={{ title: "Routine" }}
            />
        </Stack>
    );
}
