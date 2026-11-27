import { db } from "@/db/client";
import {
    Milestone,
    MilestoneActivity,
    NestedCounterData,
    NestedMilestone,
    SubEntryData,
    SubEntryTemplate,
} from "@/types/milestone-types";
import { MilestoneDataKeys } from "@/utils/milestones/milestone-helpers";
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
        insertTemplate: (
            milestoneId: string,
            activityId: string,
            data: SubEntryTemplate,
        ) => void;
        insertSubEntry: (
            milestoneId: string,
            template: SubEntryTemplate,
            dataId: string,
            data: SubEntryData,
            key: MilestoneDataKeys,
        ) => void;
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
                            nestedCounterData: {
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
                            dailyGoalData: {
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
                        dailyGoalData: [],
                        nestedCounterData: [],
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
                                  nestedCounterData: [
                                      {
                                          ...data,
                                          subEntriesData: [],
                                          activity: {
                                              ...a,
                                          },
                                      },
                                      ...m.nestedCounterData,
                                  ],
                              }
                            : {
                                  ...m,
                              },
                    ),
                }));
            },
        },
        insertTemplate: (mId, aId, data) => {
            set((prev) => ({
                ...prev,
                milestones: prev.milestones.map((m) =>
                    m.id === mId
                        ? {
                              ...m,
                              categories: m.categories.map((c) =>
                                  c.id === aId
                                      ? {
                                            ...c,
                                            templates: [
                                                {
                                                    ...data,
                                                },
                                                ...c.templates,
                                            ],
                                        }
                                      : {
                                            ...c,
                                        },
                              ),
                          }
                        : {
                              ...m,
                          },
                ),
            }));
        },
        insertSubEntry: (mId, template, dataId, data, key) => {
            set((prev) => ({
                ...prev,
                milestones: prev.milestones.map((m) =>
                    m.id === mId
                        ? {
                              ...m,
                              [key]: m.nestedCounterData.map((entryKey) =>
                                  entryKey.id === dataId
                                      ? {
                                            ...entryKey,
                                            subEntriesData: [
                                                {
                                                    ...data,
                                                    template,
                                                },
                                                ...entryKey.subEntriesData,
                                            ],
                                        }
                                      : {
                                            ...entryKey,
                                        },
                              ),
                          }
                        : {
                              ...m,
                          },
                ),
            }));
        },
    },
}));
