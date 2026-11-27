import { db } from "@/db/client";
import {
    activityCategories,
    milestonesTable,
    nestedCounterData,
    subEntriesData,
    subEntriesTemplate,
} from "@/db/schema/milestones";
import { useMilestoneStore } from "@/stores/milestones-store/milestones-store";
import { MilestoneActivity, SubEntryTemplate } from "@/types/milestone-types";
import { eq } from "drizzle-orm";
import { randomUUID } from "expo-crypto";

export async function insertNCData(
    milestoneId: string,
    activity: MilestoneActivity,
) {
    const [res] = await db
        .insert(nestedCounterData)
        .values({
            id: randomUUID(),
            milestoneId,
            activityId: activity.id,
        })
        .returning();
    useMilestoneStore
        .getState()
        .actions.dataInsertions.nestedCounter(milestoneId, activity, res);
}

export type MilestoneDataKeys = "nestedCounterData" | "dailyGoalData";
export async function insertSubEntryData(
    milestoneId: string,
    dataId: string,
    template: SubEntryTemplate,
    property: MilestoneDataKeys,
) {
    const [subEntry] = await db
        .insert(subEntriesData)
        .values({
            id: randomUUID(),
            [property + "Id"]: dataId,
            subEntriesTemplateId: template.id,
        })
        .returning();

    useMilestoneStore
        .getState()
        .actions.insertSubEntry(
            milestoneId,
            template,
            dataId,
            subEntry,
            property,
        );
}

export async function createMilestoneDummy() {
    const msName = "General";

    try {
        const [exists] = await db
            .select()
            .from(milestonesTable)
            .where(eq(milestonesTable.name, msName));
        if (exists) return;
        const [milestoneCreated] = await db
            .insert(milestonesTable)
            .values({
                id: randomUUID(),
                name: msName,
                type: "nested-counter",
            })
            .returning();

        useMilestoneStore.getState().actions.insertMilestone(milestoneCreated);
    } catch (err) {
        console.error(err);
    }
}

export async function createDummyCategory(milestoneId: string) {
    const acName = "Gaming";
    const [exists] = await db
        .select()
        .from(activityCategories)
        .where(eq(activityCategories.name, acName));
    if (exists) {
        await db
            .delete(activityCategories)
            .where(eq(activityCategories.name, acName));
    }
    const [res] = await db
        .insert(activityCategories)
        .values({
            id: randomUUID(),
            milestoneId,
            name: acName,
        })
        .returning();
    useMilestoneStore.getState().actions.insertCategory(milestoneId, res);
}

export async function createDummyTemplate(
    milestoneId: string,
    activityId: string,
) {
    const tName = "Valorant";
    const [template] = await db
        .insert(subEntriesTemplate)
        .values({
            id: randomUUID(),
            activityId,
            name: tName,
        })
        .returning();
    useMilestoneStore
        .getState()
        .actions.insertTemplate(milestoneId, activityId, template);
}
