import { db } from "@/db/client";
import { milestonesTable } from "@/db/schema/milestones";
import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { randomUUID } from "expo-crypto";

export function singleMilestone(milestoneId: string) {
    const milestone = useMilestoneStore
        .getState()
        .milestones.find((m) => m.id === milestoneId)!;
    return milestone;
}

export type MilestoneKeyNames = "nestedCounters";
export function currentData(milestoneId: string, keyName: MilestoneKeyNames) {
    const data = singleMilestone(milestoneId)[keyName];
}

export async function createMilestoneDummy() {
    try {
        const [milestoneCreated] = await db
            .insert(milestonesTable)
            .values({
                id: randomUUID(),
                name: "General",
                type: "nested-counter",
            })
            .returning();

        useMilestoneStore.getState().actions.insertMilestone(milestoneCreated);
    } catch (err) {
        console.error(err);
    }
}
