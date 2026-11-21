import {
    activityCategories,
    dailyGoalsData,
    milestonesTable,
    nestedCounterData,
    subEntriesData,
} from "@/db/schema/milestones";

export type Milestone = typeof milestonesTable.$inferSelect;
export type MilestoneActivity = typeof activityCategories.$inferSelect;

export type SubEntries = typeof subEntriesData.$inferSelect;
// Property types
export type NestedCounterData = typeof nestedCounterData.$inferSelect;
export type DailyGoalsData = typeof dailyGoalsData.$inferSelect;

export type NestedMilestone = Milestone & {
    activity: (MilestoneActivity & {
        nestedCounterData:
            | (NestedCounterData & {
                  subEntries: SubEntries[];
              })[]
            | null;
        dailyGoalsData:
            | (DailyGoalsData & {
                  subEntries: SubEntries[];
              })[]
            | null;
    })[];
};
