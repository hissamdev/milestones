import * as s from "drizzle-orm/sqlite-core";

export const milestones = s.sqliteTable("milestones", {
    id: s.text().primaryKey(),
});
