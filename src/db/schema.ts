import * as s from "drizzle-orm/sqlite-core";
import * as Crypto from "expo-crypto";

export const milestones = s.sqliteTable("milestones", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => Crypto.randomUUID()),
    name: s.text("name").notNull(),
    emoji: s.text("emoji"),
    desc: s.text("desc"),
    type: s.text("type").notNull(),
});

export const milestoneData = s.sqliteTable("milestone_data", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => Crypto.randomUUID()),
    milestoneId: s
        .text("milestone_id")
        .notNull()
        .references(() => milestones.id),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: s
        .integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$onUpdateFn(() => new Date()),
    creationDay: s
        .text("creation_day")
        .notNull()
        .$defaultFn(() => new Date().toDateString()),
    device: s.text(),

    // Duration Counter
    start: s.integer("start", { mode: "timestamp" }),
    stop: s.integer("stop", { mode: "timestamp" }),
    duration: s.integer("duration"),

    // Yes/No
    switchToggle: s.text(),

    // Memorables
    note: s.text(),
});

export const images = s.sqliteTable("images", {
    id: s.integer("id").primaryKey({ autoIncrement: true }),
    dataId: s
        .text("data_id")
        .notNull()
        .references(() => milestoneData.id),
});
