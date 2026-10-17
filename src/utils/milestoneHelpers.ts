import { db } from "@/db/client";
import { milestones } from "@/db/milestones-schema";

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
        const res = await db
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
            data: res,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Something went wrong",
        };
    }
}

export async function getMilestones() {
    try {
        const res = await db.query.milestones.findMany({
            with: {
                data: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        return {
            success: true,
            message: "Milestones retrieved",
            data: res,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Something went wrong",
        };
    }
}
