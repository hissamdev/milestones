import * as s from "drizzle-orm/sqlite-core";

export const workouts = s.sqliteTable("workouts", {
    id: s.text("id").primaryKey(),
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
    id: s.text("id").primaryKey(),
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
    id: s.text("id").primaryKey(),
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
    workoutSequence: s.integer("sequence").notNull(),
});

// Independent list of available exercises for autocomplete
export const exercises = s.sqliteTable("exercises", {
    id: s.text("id").primaryKey(),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: s
        .integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),

    name: s.text("name").notNull().unique(),
    displayName: s.text("display_name").notNull(),
    type: s.text("type").notNull(), // Duration or Reps
    icon: s.text("icon"),
    desc: s.text("desc"),
});

export const standaloneExercises = s.sqliteTable("standalone_exercises", {
    id: s.text("id").primaryKey(),
    workoutId: s
        .text("workout_id")
        .notNull()
        .references(() => workouts.id),
    exerciseId: s
        .text("exercise_id")
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
    repitition: s.integer("repetition").notNull(),
});

export const routines = s.sqliteTable("routines", {
    id: s.text("id").primaryKey(),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    creationDay: s
        .text("creation_day")
        .notNull()
        .$defaultFn(() => new Date().toDateString()),
    name: s.text().notNull(),
});

export const daysOtw = s.sqliteTable("days_otw", {
    id: s.text("id").primaryKey(),
    routineId: s
        .text("routine_id")
        .notNull()
        .references(() => routines.id),
    routineTemplateId: s
        .text("routine_template_id")
        .notNull()
        .references(() => routineTemplates.id),
    dayTitle: s.text("day_title").notNull(),
});

export const routineTemplates = s.sqliteTable("routine_templates", {
    id: s.text("id").primaryKey(),
    restDay: s.integer({ mode: "boolean" }).notNull().default(false),
});

export const routineTemplateExercises = s.sqliteTable(
    "routine_template_exercises",
    {
        id: s.text("id").primaryKey(),
        templateId: s
            .text("template_id")
            .notNull()
            .references(() => routineTemplates.id),
        exerciseId: s
            .text("exercise_id")
            .notNull()
            .references(() => exercises.id),
        displayAmount: s.integer("display_amount").notNull().default(0), // Number of Seconds or Reps. The exercise key contains the type of duration or reps
        displayRestAmount: s.integer("rest_time"),
        sequence: s.integer("sequence").notNull(),
    },
);

export const routineDataMetadata = s.sqliteTable("routine_tl_data", {
    id: s.text("id").primaryKey(),
    routineId: s
        .text("routine_id")
        .notNull()
        .references(() => routines.id),
    interactionTime: s
        .integer("interaction_time", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()), // Created when the user initiates a routine's workout, indicates a day of routine completion
    completion: s.integer("completion").notNull(), // Percentage of a routine completed, calculated based on how many exercises from the template were done
    isComplete: s.integer("is_complete", { mode: "boolean" }).notNull(), // Whether a routine is still ongoing
});

export const routineExerciseData = s.sqliteTable("routine_exercise_data", {
    id: s.text("id").primaryKey(),
    routineId: s.text("routine_id").references(() => routines.id),
    parentMetadataId: s
        .text("parent_metadata_id")
        .notNull()
        .references(() => routineDataMetadata.id),
    exerciseId: s.text("exercise_id").references(() => exercises.id),
});
