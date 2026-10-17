import { defineRelationsPart } from "drizzle-orm";
import { images, milestoneData, milestones } from "./milestones-schema";
import {
    exercises,
    routines,
    sessionData,
    sessions,
    standaloneExercises,
    workouts,
} from "./workouts-schema";

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
        workouts,
        exercises,
        sessions,
        sessionData,
        routines,
        standaloneExercises,
    },
    (r) => ({
        workouts: {
            sessions: r.many.sessions(),
            standaloneExercises: r.many.standaloneExercises(),
        },
        standaloneExercises: {
            workout: r.one.workouts({
                from: r.standaloneExercises.workoutId,
                to: r.workouts.id,
            }),
            exercise: r.one.exercises({
                from: r.standaloneExercises.exerciseId,
                to: r.exercises.id,
            }),
        },
        sessions: {
            workout: r.one.workouts({
                from: r.sessions.workoutId,
                to: r.workouts.id,
            }),
            routine: r.one.routines({
                from: r.sessions.routineId,
                to: r.routines.id,
            }),
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
    }),
);
