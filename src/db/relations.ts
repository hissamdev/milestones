import { defineRelations } from "drizzle-orm";
import { images, milestoneData, milestones } from "./schema";
import {
    exercises,
    routines,
    sessionData,
    sessions,
    workouts,
} from "./workouts-schema";

export const relations = defineRelations(
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

export const workoutRelations = defineRelations(
    { workouts, exercises, sessions, sessionData, routines },
    (r) => ({
        workouts: {
            sessions: r.many.sessions(),
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
