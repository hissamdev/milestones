import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";

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

export async function createMilestoneDummy() {}
