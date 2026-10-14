import * as s from "drizzle-orm/sqlite-core";
import * as Crypto from "expo-crypto";

export const milestones = s.sqliteTable("milestones", {
    id: s
        .text()
        .primaryKey()
        .$defaultFn(() => Crypto.randomUUID()),
});

export const milestoneData = s.sqliteTable("milestone_data", {
    id: s
        .text()
        .primaryKey()
        .$defaultFn(() => Crypto.randomUUID()),
    milestoneId: s
        .text()
        .primaryKey()
        .references(() => milestones.id),
});
