import * as s from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";

export const milestonesTable = sqliteTable("milestones", {
    id: s.text("id").primaryKey(),
    name: s.text("name").notNull(),
    enableCategories: s
        .integer("enable_categories", { mode: "boolean" })
        .notNull()
        .default(false),
    type: s.text("type", { enum: ["nested-counter"] }).notNull(), // nested-counter, reset-timer, daily goals
    useSingle: s
        .integer("use_single", { mode: "boolean" })
        .notNull()
        .default(false),
});

export const activityCategories = sqliteTable("activity_categories", {
    id: s.text("id").primaryKey(),
    milestoneId: s
        .text("milestone_id")
        .notNull()
        .references(() => milestonesTable.id, { onDelete: "cascade" }),
    name: s.text("name"),
    targetDuration: s.integer("target_duration"), // Seconds: For nested daily goals
});

export const nestedCounterData = sqliteTable("nested_counter_data", {
    id: s.text("id").primaryKey(),
    milestoneId: s
        .text("milestone_id")
        .notNull()
        .references(() => milestonesTable.id, { onDelete: "cascade" }),
    activityId: s
        .text("activity_id")
        .notNull()
        .references(() => activityCategories.id, { onDelete: "cascade" }),
    title: s.text("title"),
    desc: s.text("desc"),
    timestamp: s
        .integer("timestamp", { mode: "timestamp" })
        .$defaultFn(() => new Date()),
    startTime: s.integer("start_time", { mode: "timestamp" }),
    endTime: s.integer("end_time", { mode: "timestamp" }),
});

export const dailyGoalsData = sqliteTable("daily_goals_data", {
    id: s.text("id").primaryKey(),
    milestoneId: s
        .text("milestone_id")
        .notNull()
        .references(() => milestonesTable.id, { onDelete: "cascade" }),
    activityId: s
        .text("activity_id")
        .notNull()
        .references(() => activityCategories.id, { onDelete: "cascade" }),
    timestamp: s
        .integer("timestamp", { mode: "timestamp" })
        .$defaultFn(() => new Date()),
    isGoalMet: s
        .integer("is_goal_met", { mode: "boolean" })
        .notNull()
        .default(false),
});

export const subEntriesTemplate = sqliteTable("sub_entries_template", {
    id: s.text("id").primaryKey(),
    activityId: s
        .text("activity_id")
        .notNull()
        .references(() => activityCategories.id, { onDelete: "cascade" }),
    name: s.text("name").notNull(),
});

export const subEntriesData = sqliteTable("sub_entries_data", {
    id: s.text("id").primaryKey(),
    nestedCounterDataId: s
        .text("nested_counter_data_id")
        .references(() => nestedCounterData.id, { onDelete: "cascade" }),
    dailyGoalsDataId: s
        .text("daily_goals_data_id")
        .references(() => dailyGoalsData.id, { onDelete: "cascade" }),
    timestamp: s
        .integer("timestamp", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

// Fetch data with its correct data type
export const milestonesData = sqliteTable("milestones_data", {
    id: s.text("id").primaryKey(),
    milestoneId: s
        .text("milestone_id")
        .notNull()
        .references(() => milestonesTable.id, { onDelete: "cascade" }),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});
