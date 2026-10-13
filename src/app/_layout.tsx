import { db } from "@/db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { Text } from "react-native";
import migrations from "../../drizzle/migrations";

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations as any);

    if (error) {
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
