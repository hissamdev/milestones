import { db } from "@/db/client";
import { NestedMilestone } from "@/types/milestone-types";
import { create } from "zustand";

interface MilestoneState {
    milestones: NestedMilestone[];
    actions: {
        loadMilestones: () => void;
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
                                    nestedCounterData: {
                                        orderBy: {
                                            timestamp: "desc",
                                        },
                                        with: {
                                            subEntriesTemplate: {
                                                orderBy: {
                                                    name: "asc",
                                                },
                                            },
                                            subEntriesData: {
                                                orderBy: {
                                                    timestamp: "desc",
                                                },
                                            },
                                        },
                                    },
                                    dailyGoalsData: {
                                        orderBy: {
                                            timestamp: "desc",
                                        },
                                        with: {
                                            subEntriesTemplate: {
                                                orderBy: {
                                                    name: "asc",
                                                },
                                            },
                                            subEntriesData: {
                                                orderBy: {
                                                    timestamp: "desc",
                                                },
                                            },
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
    },
}));
