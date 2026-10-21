import { db } from "@/db/client";
import { routines } from "@/db/schema/workouts";
import z from "zod";
export async function createRoutine(name: string) {
    const safeName = z.string().min(3).safeParse(name);
    if (!safeName.success) {
        console.error(safeName.error.issues[0]);
        return {
            success: false,
            message: "Invalid name",
        };
    }
    try {
        await db.insert(routines).values({
            name: safeName.data,
        });
        return {
            success: true,
            message: "Created routine" + safeName.data,
        };
    } catch (err) {
        console.error(err);
    }
}
