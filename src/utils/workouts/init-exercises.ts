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
    isSplit: boolean;
}

const exerciseList: Exercise[] = [
    {
        name: "pushups",
        displayName: "Push-ups",
        desc: "Targets the chest, triceps, and front shoulders. Builds upper-body pushing strength.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "pullups",
        displayName: "Pull-ups",
        desc: "Targets the lats, upper back, and biceps. Builds pulling strength and grip.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "decline-pullups",
        displayName: "Decline Pull-ups",
        desc: "A pullup progression",
        type: "reps",
        isSplit: false,
    },
    {
        name: "ledge-pullups",
        displayName: "Ledge Pull-ups",
        desc: "Targets the upper back, lats, and biceps. Develops pulling strength and grip.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "reverse-crunches",
        displayName: "Reverse Crunches",
        desc: "Targets the lower portion of the abdominal muscles. Builds core strength and control.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "glute-bridges",
        displayName: "Glute Bridges",
        desc: "Targets the glutes and hamstrings. Builds hip extension strength and pelvic stability.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "horizontal-rows",
        displayName: "Horizontal Rows",
        desc: "Targets the lats, rhomboids, rear shoulders, and biceps. Improves upper-back strength and posture.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "pike-pushups",
        displayName: "Pike Push-ups",
        desc: "Targets the shoulders and triceps. Develops overhead pushing strength.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "handstand-pushups",
        displayName: "Handstand Push-ups",
        desc: "Targets the shoulders and triceps. Builds advanced overhead pushing strength and stability.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "pistol-squats",
        displayName: "Pistol Squats",
        desc: "Targets the quadriceps and glutes. Develops single-leg strength, balance, and mobility.",
        type: "reps",
        isSplit: true,
    },
    {
        name: "squats",
        displayName: "Squats",
        desc: "Targets the quadriceps and glutes. Builds lower-body strength and mobility.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "lunges",
        displayName: "Lunges",
        desc: "Targets the quadriceps and glutes. Improves single-leg strength, balance, and coordination.",
        type: "reps",
        isSplit: true,
    },
    {
        name: "planks",
        displayName: "Planks",
        desc: "Targets the deep core, abdominals, and stabilizing muscles. Builds core endurance and stability.",
        type: "duration",
        isSplit: false,
    },
    {
        name: "side-planks",
        displayName: "Side Planks",
        desc: "Targets the obliques and lateral core muscles. Builds side-to-side stability and endurance.",
        type: "duration",
        isSplit: true,
    },
    {
        name: "situps",
        displayName: "Sit-ups",
        desc: "Targets the abdominal muscles and hip flexors. Builds trunk flexion strength and endurance.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "leg-raises",
        displayName: "Leg Raises",
        desc: "Targets the abdominals and hip flexors. Builds core strength and control.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "elbow-pushups",
        displayName: "Elbow Push-ups",
        desc: "Targets the triceps and shoulders. Develops arm strength and pushing control.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "pseudo-planche-pushups",
        displayName: "Pseudo Planche Push-ups",
        desc: "Targets the chest, shoulders, and triceps. Builds forward-leaning pushing strength for planche progressions.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "planche-lean-hold",
        displayName: "Planche Lean Hold",
        desc: "Targets the shoulders, wrists, and core. Builds straight-arm strength and planche-specific stability.",
        type: "duration",
        isSplit: false,
    },
    {
        name: "tucked-planche-hold",
        displayName: "Tucked Planche Hold",
        desc: "Targets the shoulders, core, and straight-arm stabilizers. Develops advanced planche strength.",
        type: "duration",
        isSplit: false,
    },
    {
        name: "hanging-leg-raises",
        displayName: "Hanging Leg Raises",
        desc: "Targets the abdominals and hip flexors. Builds core strength, grip, and hanging control.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "l-sit-hold",
        displayName: "L-Sit Hold",
        desc: "Targets the abdominals, hip flexors, and triceps. Builds core compression and support strength.",
        type: "duration",
        isSplit: false,
    },
    {
        name: "high-knees-reps",
        displayName: "High Knees (Reps)",
        desc: "Targets the hip flexors, quadriceps, and calves. Builds leg coordination and cardiovascular fitness.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "high-knees-duration",
        displayName: "High Knees (Duration)",
        desc: "Targets the hip flexors, quadriceps, and calves. Builds cardiovascular endurance and lower-body stamina.",
        type: "duration",
        isSplit: false,
    },
    {
        name: "jumping-jacks",
        displayName: "Jumping Jacks",
        desc: "Engages the legs, shoulders, and core. Builds cardiovascular endurance and whole-body coordination.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "crunches",
        displayName: "Crunches",
        desc: "Targets the abdominal muscles. Builds core strength and trunk flexion control.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "burpees",
        displayName: "Burpees",
        desc: "Engages the chest, shoulders, core, and legs. Builds full-body conditioning and cardiovascular endurance.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "side-lunges",
        displayName: "Side Lunges",
        desc: "Targets the glutes, quadriceps, and inner thighs. Builds lateral strength and hip mobility.",
        type: "reps",
        isSplit: true,
    },
    {
        name: "dips",
        displayName: "Dips",
        desc: "Targets the triceps, chest, and front shoulders. Builds upper-body pushing strength.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "nordic-hamstring-curls",
        displayName: "Nordic Hamstring Curls",
        desc: "Targets the hamstrings. Builds eccentric strength and resilience in the back of the thighs.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "scapular-pullups",
        displayName: "Scapular Pull-ups",
        desc: "Targets the scapular stabilizers and lats. Improves shoulder control and pulling mechanics.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "reverse-snow-angels",
        displayName: "Reverse Snow Angels",
        desc: "Targets the rear shoulders, upper back, and scapular stabilizers. Supports shoulder mobility and posture.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "tibialis-raises",
        displayName: "Tibialis Raises",
        desc: "Targets the tibialis anterior along the front of the shin. Builds ankle strength and control.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "calf-raises",
        displayName: "Calf Raises",
        desc: "Targets the calf muscles. Builds ankle strength and lower-leg endurance.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "single-leg-calf-raises",
        displayName: "Single-Leg Calf Raises",
        desc: "Targets the calf muscles one leg at a time. Builds unilateral strength and ankle stability.",
        type: "reps",
        isSplit: true,
    },
    {
        name: "mountain-climbers",
        displayName: "Mountain Climbers",
        desc: "Targets the core, hip flexors, and shoulders. Builds core endurance and cardiovascular fitness.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "jump-squats",
        displayName: "Jump Squats",
        desc: "Targets the quadriceps and glutes. Develops explosive lower-body power.",
        type: "reps",
        isSplit: false,
    },
    {
        name: "front-kicks",
        displayName: "Front Kicks",
        desc: "Targets the hip flexors and quadriceps. Develops kicking power, balance, and coordination.",
        type: "reps",
        isSplit: true,
    },
    {
        name: "shadowboxing",
        displayName: "Shadowboxing",
        desc: "Engages the shoulders, arms, core, and legs. Develops cardiovascular endurance, footwork, and striking coordination.",
        type: "duration",
        isSplit: false,
    },
    {
        name: "roundhouse-kicks",
        displayName: "Roundhouse Kicks",
        desc: "Targets the glutes, hip flexors, and core. Develops rotational power, balance, and kicking technique.",
        type: "reps",
        isSplit: true,
    },
    {
        name: "rkc-plank",
        displayName: "RKC Plank",
        desc: "Targets the deep core, abdominals, and glutes. Builds intense full-body bracing strength and core stability.",
        type: "duration",
        isSplit: false,
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
                    isSplit: sql.raw(`excluded.is_split`),
                    type: sql.raw(`excluded.type`),
                },
            });
    } catch (err) {
        console.error(err);
        throw err;
    }
}
