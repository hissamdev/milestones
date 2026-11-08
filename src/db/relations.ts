import { defineRelationsPart } from "drizzle-orm";
import { images, milestoneData, milestones } from "./schema/milestones";
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
    { milestones, milestoneData, images },
    (r) => ({
        milestones: {
            data: r.many.milestoneData(),
        },
        milestoneData: {
            milestone: r.one.milestones({
                from: r.milestoneData.milestoneId,
                to: r.milestones.id,
            }),
            image: r.many.images(),
        },
        images: {
            data: r.one.milestoneData({
                from: r.images.dataId,
                to: r.milestoneData.id,
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
            templateExercises: r.many.routineTemplateExercises(),
        },
        routineTemplateExercises: {
            template: r.one.routineTemplates({
                from: r.routineTemplateExercises.templateId,
                to: r.routineTemplates.id,
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
