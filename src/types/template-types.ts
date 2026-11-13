import {
    routineTemplateExercises,
    routineTemplates,
} from "@/db/schema/workouts";
import { Exercise } from "./routineTypes";

export type Template = typeof routineTemplates.$inferSelect;
export type TemplateExercises = typeof routineTemplateExercises.$inferSelect;
export type NestedTemplate = Template & {
    templateExercises: (TemplateExercises & {
        exercise: Exercise | null;
    })[];
};
