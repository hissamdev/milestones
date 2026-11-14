import * as s from "drizzle-orm/sqlite-core";

export const workoutDay = s.sqliteTable("workout_day", {
    id: s.text("id").primaryKey(),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    // standaloneExercises
    // sessions
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
        .references(() => workoutDay.id),
    exerciseId: s
        .text("exercise_id")
        .notNull()
        .references(() => exercises.id),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    repitition: s.integer("repetition").notNull(),
});

export const sessions = s.sqliteTable("sessions", {
    id: s.text("id").primaryKey(),
    templateId: s.text("template_id").references(() => routineTemplates.id),
    useTemplate: s
        .integer("use_template", { mode: "boolean" })
        .notNull()
        .default(false),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    isComplete: s
        .integer("is_complete", { mode: "boolean" })
        .notNull()
        .default(false),
});

export const sessionData = s.sqliteTable("session_data", {
    id: s.text("id").primaryKey(),
    sessionId: s
        .text("session_id")
        .notNull()
        .references(() => sessions.id, { onDelete: "cascade" }),
    exerciseId: s.text("exercise_id").references(() => exercises.id),
    startTime: s.integer("start_time", { mode: "timestamp" }),
    endTime: s.integer("end_time", { mode: "timestamp" }),
    isRest: s.integer("is_rest", { mode: "boolean" }).notNull().default(false),
    // Exercise
    amount: s.integer("amount").notNull().default(0),
    targetSets: s.integer("target_sets").notNull().default(1),
    currentSetNum: s.integer("current_set_num").notNull().default(1),
    sequence: s.integer("sequence").notNull(),
    isComplete: s
        .integer("is_complete", { mode: "boolean" })
        .notNull()
        .default(false),
});

export const routines = s.sqliteTable("routines", {
    id: s.text("id").primaryKey(),
    createdAt: s
        .integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
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
    title: s.text("title").notNull().default(""),
});

export const routineTemplateExercises = s.sqliteTable(
    "routine_template_exercises",
    {
        id: s.text("id").primaryKey(),
        templateId: s
            .text("template_id")
            .notNull()
            .references(() => routineTemplates.id),
        exerciseId: s.text("exercise_id").references(() => exercises.id),
        targetSets: s.integer("target_sets").notNull().default(1),
        displayAmount: s.integer("display_amount").notNull().default(0), // Number of Seconds or Reps. The exercise key contains the type of duration or reps
        isRestType: s
            .integer("is_rest_type", { mode: "boolean" })
            .notNull()
            .default(false),
        displayRestAmount: s.integer("rest_time").notNull().default(0),
        useStopwatch: s
            .integer("use_stopwatch", { mode: "boolean" })
            .notNull()
            .default(false),
        sequence: s.integer("sequence").notNull(),
    },
);

export const routineDataTopLevel = s.sqliteTable("routine_tl_data", {
    id: s.text("id").primaryKey(),
    routineId: s
        .text("routine_id")
        .notNull()
        .references(() => routines.id),
    interactionTime: s
        .integer("interaction_time", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()), // Created when the user initiates a routine's workout, indicates a day of routine completion
    completionPercentage: s.integer("completion_percentage").notNull(), // Percentage of a routine completed, calculated based on how many exercises from the template were done
    isComplete: s
        .integer("is_complete", { mode: "boolean" })
        .notNull()
        .default(false), // Whether a routine is still ongoing
});

export const routineExerciseData = s.sqliteTable("routine_exercise_data", {
    id: s.text("id").primaryKey(),
    routineId: s.text("routine_id").references(() => routines.id),
    parentMetadataId: s
        .text("parent_metadata_id")
        .notNull()
        .references(() => routineDataTopLevel.id),
    exerciseId: s.text("exercise_id").references(() => exercises.id),
    isRest: s.integer("is_rest", { mode: "boolean" }).notNull().default(false),
    useStopwatch: s
        .integer("use_stopwatch", { mode: "boolean" })
        .notNull()
        .default(false),
    isComplete: s
        .integer("is_complete", { mode: "boolean" })
        .notNull()
        .default(false),
    // Preserve exercise info in case of exercise deletion
    exerciseName: s.text("exercise_name"),
    exerciseDisplayName: s.text("exercise_display_name"),
    exerciseDesc: s.text("exercise_desc"),
    exerciseType: s.text("exercise_type"), // Reps or Duration
    // Work done
    workAmount: s.integer("work_amount").notNull().default(0),
    startTime: s.integer("current_set_start_time", { mode: "timestamp" }),
    endTime: s.integer("current_set_end_time", { mode: "timestamp" }),
    sequence: s.integer("sequence").notNull(),
});
