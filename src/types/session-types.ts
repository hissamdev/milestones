import { sessionData, sessions } from "@/db/schema/workouts";
import { Exercise } from "./routineTypes";

export type Session = typeof sessions.$inferSelect;
export type SessionData = typeof sessionData.$inferSelect;
export type NestedSession = Session & {
    sessionData?: (SessionData & {
        exercise: Exercise | null;
    })[];
};
