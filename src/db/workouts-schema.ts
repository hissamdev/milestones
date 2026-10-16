import { generateUuid } from "@/utils/helpers";
import * as s from "drizzle-orm/sqlite-core";

export const workouts = s.sqliteTable("workouts", {
    id: s
        .text()
        .primaryKey()
        .$defaultFn(() => generateUuid()),
});
