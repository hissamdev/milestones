import { db } from "@/db/client";
import { exercises } from "@/db/schema/workouts";
import { sql } from "drizzle-orm";
import { randomUUID } from "expo-crypto";

type Type = "reps" | "duration";
interface Exercise {
    name: string;
    displayName: string;
    desc: string;
    type: Type;
}

const exerciseList: Exercise[] = [
    {
        name: "pushups",
        displayName: "Pushups",
        desc: "Standard pushups",
        type: "reps",
    },
    {
        name: "pseudo-planche-push-ups",
        displayName: "Pseudo Planche Pushups",
        type: "reps",
        desc: "Forward-leaning pushups",
    },
    {
        name: "pullups",
        displayName: "Pull-ups",
        type: "reps",
        desc: "Standard pullups",
    },
    {
        name: "ledge-pull-ups",
        displayName: "Ledge Pull-ups",
        type: "reps",
        desc: "Pull-ups performed using a ledge",
    },
    {
        name: "leg-raises",
        displayName: "Leg Raises",
        type: "reps",
        desc: "Hanging or supported leg raises",
    },
    {
        name: "dips",
        displayName: "Dips",
        type: "reps",
        desc: "Bodyweight dips",
    },
    {
        name: "glute-bridges",
        displayName: "Glute Bridges",
        type: "reps",
        desc: "Bodyweight glute bridges",
    },
    {
        name: "pistol-squats",
        displayName: "Pistol Squats",
        type: "reps",
        desc: "Single-leg squats",
    },
];

export async function initExerciseList() {
    try {
        await db
            .insert(exercises)
            .values(exerciseList.map((e) => ({ ...e, id: randomUUID() })))
            .onConflictDoUpdate({
                target: exercises.name,
                set: {
                    displayName: sql.raw(`excluded.display_name`),
                    desc: sql.raw(`excluded.desc`),
                    icon: sql.raw(`excluded.icon`),
                },
            });
    } catch (err) {
        console.error(err);
        throw err;
    }
}
