import { defineRelations } from "drizzle-orm";
import { milestoneData, milestones } from "./schema";

export const relations = defineRelations(
    { milestones, milestoneData },
    (r) => ({
        milestones: {
            data: r.many.milestoneData(),
        },
        milestoneData: {
            milestone: r.one.milestones({
                from: r.milestoneData.milestoneId,
                to: r.milestones.id,
            }),
        },
    }),
);
