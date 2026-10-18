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
        .text("workout_id")
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
        .text("session_id")
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
    restTime: s.integer("rest_time"),
    sequence: s.integer("sequence").notNull(),
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

    name: s.text("name").notNull(),
    icon: s.text("icon"),
    desc: s.text("desc"),
});

export const standaloneExercises = s.sqliteTable("standalone_exercises", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => generateUuid()),
    workoutId: s
        .text()
        .notNull()
        .references(() => workouts.id),
    exerciseId: s
        .text()
        .notNull()
        .references(() => exercises.id),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    creationDay: s
        .text("creation_day")
        .notNull()
        .$defaultFn(() => new Date().toDateString()),
    repitition: s.integer().notNull(),
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

export const routineExercises = s.sqliteTable("routine_exercises", {
    id: s
        .text("id")
        .primaryKey()
        .$defaultFn(() => generateUuid()),
    routineId: s
        .text("routine_id")
        .notNull()
        .references(() => routines.id),
    exerciseId: s.text("exercise_id").references(() => exercises.id),
    restTime: s.integer("rest_time"),
    sequence: s.integer("sequence").notNull(),
});
