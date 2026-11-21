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
                const res = await db.query.milestonesTable.findMany({
                    with: {
                        categories: {},
                    },
                });
            } catch (err) {
                console.error(err);
            }
        },
    },
}));
