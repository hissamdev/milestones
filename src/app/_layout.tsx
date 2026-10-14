import { db, expoDb } from "@/db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { Text } from "react-native";
import migrations from "../../drizzle/migrations";

import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

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
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
