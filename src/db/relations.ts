import { defineRelations } from "drizzle-orm";
import { images, milestoneData, milestones } from "./schema";

export const relations = defineRelations(
    { milestones, milestoneData, images },
    (r) => ({
        milestones: {
            data: r.many.milestoneData(),
        },
        milestoneData: {
            milestone: r.one.milestones({
                from: r.milestoneData.milestoneId,
                to: r.milestones.id,
            }),
            image: r.many.images(),
        },
        images: {
            data: r.one.milestoneData({
                from: r.images.dataId,
                to: r.milestoneData.id,
            }),
        },
    }),
);
