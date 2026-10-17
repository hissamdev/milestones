import { generateUuid } from "@/utils/helpers";
import * as s from "drizzle-orm/sqlite-core";

export const workouts = s.sqliteTable("workouts", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => generateUuid()),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    creationDay: s
        .text("creation_day")
        .notNull()
        .$defaultFn(() => new Date().toDateString()),
    // standaloneExercises
    // sessions
});

export const sessions = s.sqliteTable("sessions", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => generateUuid()),
    workoutId: s
        .text()
        .notNull()
        .references(() => workouts.id),
    routineId: s.text().references(() => routines.id),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    creationDay: s
        .text("creation_day")
        .notNull()
        .$defaultFn(() => new Date().toDateString()),
});

export const sessionData = s.sqliteTable("session_data", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => generateUuid()),
    sessionId: s
        .text()
        .notNull()
        .references(() => sessions.id),
    exerciseId: s.text().references(() => exercises.id),

    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    creationDay: s
        .text("creation_day")
        .notNull()
        .$defaultFn(() => new Date().toDateString()),
    restTime: s.integer(),
    sequence: s.integer().notNull(),
});

// Independent list of available exercises for autocomplete
export const exercises = s.sqliteTable("exercises", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => generateUuid()),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: s
        .integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),

    name: s.text().notNull(),
    icon: s.text(),
    desc: s.text(),
});

export const routines = s.sqliteTable("routines", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => generateUuid()),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    creationDay: s
        .text("creation_day")
        .notNull()
        .$defaultFn(() => new Date().toDateString()),
});
