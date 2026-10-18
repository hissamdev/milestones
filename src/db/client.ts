import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { milestoneRelations, workoutRelations } from "./relations";

export const expoDb = openDatabaseSync("db.db");
export const db = drizzle(expoDb, {
    relations: {
        ...milestoneRelations,
        ...workoutRelations,
    },
});
