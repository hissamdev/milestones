import { db } from "@/db/client";
import { Milestone, NestedMilestone } from "@/types/milestone-types";
import { create } from "zustand";

interface MilestoneState {
    milestones: NestedMilestone[];
    actions: {
        loadMilestones: () => void;
        insertMilestone: (milestone: Milestone) => void;
    };
}
export const useMilestoneStore = create<MilestoneState>()((set, get) => ({
    milestones: [],
    actions: {
        loadMilestones: async () => {
            try {
                const nestedMilestone = await db.query.milestonesTable.findMany(
                    {
                        with: {
                            categories: {
                                orderBy: {
                                    name: "asc",
                                },
                                with: {
                                    subEntriesTemplate: {
                                        orderBy: { name: "asc" },
                                    },
                                },
                            },
                            nestedCounters: {
                                orderBy: {
                                    timestamp: "desc",
                                },
                                with: {
                                    activity: true,
                                    subEntriesData: {
                                        orderBy: {
                                            timestamp: "desc",
                                        },
                                    },
                                },
                            },
                            dailyGoals: {
                                orderBy: {
                                    timestamp: "desc",
                                },
                                with: {
                                    activity: true,
                                    subEntriesData: {
                                        orderBy: {
                                            timestamp: "desc",
                                        },
                                    },
                                },
                            },
                        },
                    },
                );
                set({ milestones: nestedMilestone });
            } catch (err) {
                console.error(err);
            }
        },
        insertMilestone: (m) => {
            set((prev) => ({
                ...prev,
                milestones: [
                    {
                        ...m,
                        categories: [],
                        dailyGoals: [],
                        nestedCounters: [],
                    },
                    ...prev.milestones,
                ],
            }));
        },
    },
}));
