import { db } from "@/db/client";
import { milestones } from "@/db/schema";

// type MilestoneCreate = {
//     name: string;
//     emoji: string;
//     desc: string;
//     type: string;
// };
export async function createMilestone(
    emoji: string,
    name: string,
    desc: string,
    type: string,
) {
    try {
        await db
            .insert(milestones)
            .values({
                emoji,
                name,
                desc,
                type,
            })
            .returning();

        return {
            success: true,
            message: "Milestone created",
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Something went wrong",
        };
    }
}
