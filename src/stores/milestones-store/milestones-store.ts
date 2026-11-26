import { db } from "@/db/client";
import {
    Milestone,
    MilestoneActivity,
    NestedCounterData,
    NestedMilestone,
} from "@/types/milestone-types";
import { create } from "zustand";

interface MilestoneState {
    milestones: NestedMilestone[];
    actions: {
        loadMilestones: () => void;
        insertMilestone: (milestone: Milestone) => void;
        insertCategory: (milestoneId: string, c: MilestoneActivity) => void;
        dataInsertions: {
            nestedCounter: (
                milestoneId: string,
                activity: MilestoneActivity,
                data: NestedCounterData,
            ) => void;
        };
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
                                    templates: {
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
                                        with: {
                                            template: true,
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
        insertCategory: (milestoneId, c) => {
            set((prev) => ({
                ...prev,
                milestones: prev.milestones.map((m) =>
                    m.id === milestoneId
                        ? {
                              ...m,
                              categories: [
                                  {
                                      ...c,
                                      templates: [],
                                  },
                                  ...m.categories,
                              ],
                          }
                        : {
                              ...m,
                          },
                ),
            }));
        },
        dataInsertions: {
            nestedCounter: (mId, a, data) => {
                set((prev) => ({
                    ...prev,
                    milestones: prev.milestones.map((m) =>
                        m.id === mId
                            ? {
                                  ...m,
                                  nestedCounters: [
                                      {
                                          ...data,
                                          subEntriesData: [],
                                          activity: {
                                              ...a,
                                          },
                                      },
                                      ...m.nestedCounters,
                                  ],
                              }
                            : {
                                  ...m,
                              },
                    ),
                }));
            },
        },
    },
}));
