import {
    activityCategories,
    dailyGoalsData,
    milestonesTable,
    nestedCounterData,
    subEntriesData,
    subEntriesTemplate,
} from "@/db/schema/milestones";

export type Milestone = typeof milestonesTable.$inferSelect;
export type MilestoneActivity = typeof activityCategories.$inferSelect;

// Nested values
export type SubEntryTemplate = typeof subEntriesTemplate.$inferSelect;
export type SubEntryData = typeof subEntriesData.$inferSelect;
// Property types
export type NestedCounterData = typeof nestedCounterData.$inferSelect;
export type DailyGoalsData = typeof dailyGoalsData.$inferSelect;

export type NestedMilestone = Milestone & {
    categories: (MilestoneActivity & {
        templates: SubEntryTemplate[];
    })[];
    nestedCounterData: (NestedCounterData & {
        activity: MilestoneActivity | null;
        subEntriesData: (SubEntryData & {
            template: SubEntryTemplate;
        })[];
    })[];
    dailyGoalData: (DailyGoalsData & {
        activity: MilestoneActivity | null;
        subEntriesData: (SubEntryData & {
            template: SubEntryTemplate;
        })[];
    })[];
};
