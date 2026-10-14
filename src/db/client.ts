import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { relations } from "./relations";

const expoDb = openDatabaseSync("db.db");
export const db = drizzle(expoDb, { relations: relations });
