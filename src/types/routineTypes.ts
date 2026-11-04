import { routineDataTopLevel, routines } from "@/db/schema/workouts";

export type Routine = typeof routines.$inferSelect;
export type TLD = typeof routineDataTopLevel.$inferSelect;

export type RoutineWithTLD = Routine & {
    routineData: TLD[];
};

export type DayTemplateTEE = {
    id: string;
    routineId: string;
    routineTemplateId: string;
    dayTitle: string;
    routineTemplate: {
        id: string;
        restDay: boolean;
        templateExercises: {
            id: string;
            exerciseId: string | null;
            sequence: number;
            templateId: string;
            displayAmount: number | null;
            isRestType: boolean;
            displayRestAmount: number | null;
            exercise: {
                id: string;
                name: string;
                desc: string | null;
                type: string;
                createdAt: Date;
                updatedAt: Date;
                displayName: string;
                icon: string | null;
            } | null;
        }[];
    };
};
