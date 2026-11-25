import { defineRelationsPart } from "drizzle-orm";
import {
    activityCategories,
    dailyGoalsData,
    milestonesTable,
    nestedCounterData,
    subEntriesData,
    subEntriesTemplate,
} from "./schema/milestones";
import {
    daysOtw,
    exercises,
    routineDataTopLevel,
    routineExerciseData,
    routines,
    routineTemplateExercises,
    routineTemplates,
    sessionData,
    sessions,
    standaloneExercises,
    workoutDay,
} from "./schema/workouts";

export const milestoneRelations = defineRelationsPart(
    {
        milestonesTable,
        activityCategories,
        nestedCounterData,
        dailyGoalsData,
        subEntriesData,
        subEntriesTemplate,
    },
    (r) => ({
        milestonesTable: {
            categories: r.many.activityCategories(),
            nestedCounters: r.many.nestedCounterData(),
            dailyGoals: r.many.dailyGoalsData(),
        },
        activityCategories: {
            milestone: r.one.milestonesTable({
                from: r.activityCategories.milestoneId,
                to: r.milestonesTable.id,
            }),
            subEntriesTemplate: r.many.subEntriesTemplate(),
            nestedCounterData: r.many.nestedCounterData(),
            dailyGoalsData: r.many.dailyGoalsData(),
        },
        subEntriesTemplate: {
            activity: r.one.activityCategories({
                from: r.subEntriesTemplate.activityId,
                to: r.activityCategories.id,
            }),
        },
        nestedCounterData: {
            milestone: r.one.milestonesTable({
                from: r.nestedCounterData.milestoneId,
                to: r.milestonesTable.id,
            }),
            activity: r.one.activityCategories({
                from: r.nestedCounterData.activityId,
                to: r.activityCategories.id,
            }),
            subEntriesData: r.many.subEntriesData({
                alias: "nc-sub-entries-data",
            }),
        },
        dailyGoalsData: {
            milestone: r.one.milestonesTable({
                from: r.dailyGoalsData.milestoneId,
                to: r.milestonesTable.id,
            }),
            activity: r.one.activityCategories({
                from: r.dailyGoalsData.activityId,
                to: r.activityCategories.id,
            }),
            subEntriesData: r.many.subEntriesData({
                alias: "dg-sub-entries-data",
            }),
        },

        subEntriesData: {
            nestedCounter: r.one.nestedCounterData({
                from: r.subEntriesData.nestedCounterDataId,
                to: r.nestedCounterData.id,
                alias: "nc-sub-entries-data",
            }),
            dailyGoal: r.one.dailyGoalsData({
                from: r.subEntriesData.dailyGoalsDataId,
                to: r.dailyGoalsData.id,
                alias: "dg-sub-entries-data",
            }),
        },
    }),
);

export const workoutRelations = defineRelationsPart(
    {
        workoutDay,
        exercises,
        standaloneExercises,
        sessions,
        sessionData,
        routines,
        daysOtw,
        routineTemplates,
        routineTemplateExercises,
        routineDataTopLevel,
        routineExerciseData,
    },
    (r) => ({
        exercises: {
            standalones: r.many.standaloneExercises(),
            templates: r.many.routineTemplateExercises(),
        },
        standaloneExercises: {
            workout: r.one.workoutDay({
                from: r.standaloneExercises.workoutId,
                to: r.workoutDay.id,
            }),
            exercise: r.one.exercises({
                from: r.standaloneExercises.exerciseId,
                to: r.exercises.id,
            }),
        },
        sessions: {
            sessionData: r.many.sessionData(),
        },
        sessionData: {
            session: r.one.sessions({
                from: r.sessionData.sessionId,
                to: r.sessions.id,
            }),
            exercise: r.one.exercises({
                from: r.sessionData.exerciseId,
                to: r.exercises.id,
            }),
        },
        routines: {
            daysOtw: r.many.daysOtw(),
            routineData: r.many.routineDataTopLevel(),
        },
        daysOtw: {
            routine: r.one.routines({
                from: r.daysOtw.routineId,
                to: r.routines.id,
            }),
            routineTemplate: r.one.routineTemplates({
                from: r.daysOtw.routineTemplateId,
                to: r.routineTemplates.id,
                optional: false,
            }),
        },
        routineTemplates: {
            templateExercises: r.many.routineTemplateExercises({}),
        },
        routineTemplateExercises: {
            template: r.one.routineTemplates({
                from: r.routineTemplateExercises.templateId,
                to: r.routineTemplates.id,
                optional: false,
            }),
            exercise: r.one.exercises({
                from: r.routineTemplateExercises.exerciseId,
                to: r.exercises.id,
            }),
        },
        routineDataTopLevel: {
            routine: r.one.routines({
                from: r.routineDataTopLevel.routineId,
                to: r.routines.id,
            }),
            dataExercises: r.many.routineExerciseData(),
        },
        routineExerciseData: {
            topLevelData: r.one.routineDataTopLevel({
                from: r.routineExerciseData.parentMetadataId,
                to: r.routineDataTopLevel.id,
            }),
        },
    }),
);
